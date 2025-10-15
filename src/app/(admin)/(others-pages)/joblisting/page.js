"use client"
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link.js';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchJobs,
  deleteJob,
  bulkDeleteJobs,
  toggleJobStatus,
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  setPage,
} from '../../../../store/jobsSlice.js';
import { fetchCategories } from '../../../../store/categoriesSlice.js';
function descriptionToText(desc) {
  if (!desc) return '';
  const html = typeof desc === 'object' ? (desc.html || '') : String(desc);
  // basic strip tags (quick)
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
const Page = () => {
  const dispatch = useDispatch();
 const router=useRouter()
const[id,setId]=useState(null)
  const {
  jobs = [],
  total = 0,
  page = 1,
  jobsPerPage = 10,
  searchQuery = '',
  statusFilter = 'All',
  categoryFilter = '',
  sortBy = 'createdAt-desc',
  jobsStatus = 'idle',
  jobsError = null,
} = useSelector((state) => state.jobs || {});

console.log("jobs",jobs)



const {
  categories = [],
  status: categoriesStatus = 'idle',
  error: categoriesError = null,
} = useSelector((state) => state.categories || {});
  const { userInfo = null, userType = null } = useSelector((state) => state.user || {});
  const [viewMode, setViewMode] = useState('grid');
  const [selectedJobs, setSelectedJobs] = useState([]);
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    useEffect(() => {
      try {
        if (typeof window === 'undefined') return; // extra guard (not necessary in useEffect but safe)
        const token = window.localStorage.getItem('token');
        if (!token) return;
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return;
        // atob is available in the browser
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const tokenDecode = JSON.parse(jsonPayload);
        if (tokenDecode?.company_id) {
          setId(tokenDecode.company_id);
        } else if (tokenDecode?.userId) {
          // fallback if your token uses userId
          setId(tokenDecode.userId);
        }
      } catch (err) {
        console.warn('Failed to decode token from localStorage', err);
      }
    }, []);



useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500); 
  return () => clearTimeout(handler);
}, [searchQuery]);

useEffect(() => {
  dispatch(fetchCategories());
}, [dispatch]);

useEffect(() => {
//   if (!userInfo || (userType !== 'employer' && userType !== 'admin')) return;

dispatch(
  fetchJobs({
    statusFilter,
   searchQuery: debouncedSearchQuery,
    page,
    jobsPerPage,
    category: categoryFilter ? Number(categoryFilter) : undefined,
    sortBy,
    userId: userInfo?.id,
    postedByUser: true,
    companyId:id
  })
);

}, [
  dispatch,
  page,
  debouncedSearchQuery,
  statusFilter,
  categoryFilter,
  sortBy,
  jobsPerPage,
  userInfo,
  userType,
]);




  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await dispatch(deleteJob(id)).unwrap();
      setSelectedJobs((prev) => prev.filter((jobId) => id !== jobId));
      toast.success('Job deleted successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      toast.error(err?.message || 'Failed to delete job.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedJobs.length) {
      toast.error('No jobs selected for deletion.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!window.confirm(`Delete ${selectedJobs.length} job(s)?`)) return;
    try {
      await dispatch(bulkDeleteJobs(selectedJobs)).unwrap();
      setSelectedJobs([]);
      toast.success(`${selectedJobs.length} job(s) deleted successfully.`, { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      toast.error(err?.message || 'Failed to delete jobs.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleEdit = (job) => {
    console.log("job",job)
    router.push(`/EmpPosting/${job.id}`);
 };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await dispatch(toggleJobStatus({ id, currentStatus })).unwrap();
      toast.success(`Job status updated to ${currentStatus === 'Active' ? 'Closed' : 'Active'}.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to update job status.', { position: 'top-right', autoClose: 3000 });
    }
  };

  const totalPages = Math.ceil(total / jobsPerPage) || 1;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) dispatch(setPage(newPage));
  };

  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    try {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) return false;
      const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 3 && daysLeft > 0;
    } catch (err) {
      console.error('Error parsing deadline:', err);
      return false;
    }
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    try {
      const deadlineDate = new Date(deadline);
      return deadlineDate < new Date();
    } catch (err) {
      console.error('Error checking deadline passed:', err);
      return false;
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return 'Invalid deadline';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting deadline:', err);
      return 'Invalid deadline';
    }
  };

  const categoryName = (catId) => {
    if (!catId) return 'Not specified';
    const cat = categories.find(c => c.id === parseInt(catId));
    return cat ? cat.name : catId;
  };

//   if (userType !== 'employer' && userType !== 'admin') {
//     return null;
//   }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Job Postings</h1>
            <p className="mt-2 text-gray-500 text-sm">
              Manage your job listings. Create or edit jobs with a title, description, location, and company name.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
            <Link
              href="/empposting"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search your jobs by title, description, or company..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="Draft">Draft</option>
            <option value="Pending Review">Pending Review</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            disabled={categoriesStatus === 'loading' || categories.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {categoriesStatus === 'loading' ? (
              <option disabled>Loading...</option>
            ) : categories.length === 0 ? (
              <option disabled>No categories available</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="applicantCount-desc">Most Applicants</option>
            <option value="applicantCount-asc">Fewest Applicants</option>
            <option value="views-desc">Most Views</option>
            <option value="views-asc">Fewest Views</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>

        {selectedJobs.length > 0 && (
          <div className="mb-4 flex gap-4">
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Selected ({selectedJobs.length})
            </button>
          </div>
        )}

        {jobsStatus === 'loading' ? (
          <div className="text-center py-12">
            <svg className="animate-spin mx-auto h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-4 text-gray-500">Loading your jobs...</p>
          </div>
        ) : jobsStatus === 'failed' ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{jobsError || 'Failed to load your jobs.'}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchJobs({
                    statusFilter,
                    searchQuery: debouncedSearchQuery,
                    page,
                    jobsPerPage,
                    category: categoryFilter ? Number(categoryFilter) : undefined,
                    sortBy,
                    userId: userInfo.id,
                    postedByUser: true,
                  })
                )
              }
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Retry
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() =>
                            setSelectedJobs((prev) =>
                              prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]
                            )
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{job.title || 'Untitled'}</h2>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          job.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'Closed'
                            ? 'bg-gray-100 text-gray-800'
                            : job.status === 'Draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {job.status || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">
                      {job.company_name || 'Unknown Company'} • {job.location || 'Unknown Location'}
                    </p>
                    <p className="text-gray-600 mt-3 line-clamp-3">
  {descriptionToText(job.description) || 'No description provided'}
</p>

                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                      <p>
                        <span className="font-semibold">Category:</span> {categoryName(job.category)}
                      </p>
                      <p>
                        <span className="font-semibold">Subcategory:</span> {job.subcategory || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-semibold">Salary:</span>{' '}
                        {job.salary || job.salary === 0 ? `₹${Number(job.salary).toLocaleString()}` : 'Not disclosed'}
                      </p>
                      <p>
                        <span className="font-semibold">Type:</span> {job.type || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-semibold">Experience:</span> {job.experience || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-semibold">Applicants:</span> {job.applicantCount ?? 0}
                      </p>
                      <p>
                        <span className="font-semibold">Views:</span> {job.views ?? 0}
                      </p>
                      <p>
                        <span className="font-semibold">Deadline:</span> {formatDeadline(job.deadline)}
                        {job.deadline && isDeadlineApproaching(job.deadline) && (
                          <span className="ml-2 text-red-600 text-xs">(Approaching)</span>
                        )}
                        {job.deadline && isDeadlinePassed(job.deadline) && (
                          <span className="ml-2 text-red-600 text-xs">(Expired)</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Posted:</span>{' '}
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Tags:</span>{' '}
                        {job.tags?.length > 0 ? job.tags.join(', ') : 'None'}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/jobs/${job.id}/applicants`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        View Applicants ({job.applicantCount ?? 0})
                      </Link>
                      <button
                        onClick={() => handleEdit(job)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {job.status === 'Active' ? 'Close Job' : 'Reopen Job'}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedJobs.length === jobs.length && jobs.length > 0}
                          onChange={() =>
                            setSelectedJobs(selectedJobs.length === jobs.length ? [] : jobs.map((job) => job.id))
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicants
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedJobs.includes(job.id)}
                            onChange={() =>
                              setSelectedJobs((prev) =>
                                prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]
                              )
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{job.title || 'Untitled'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                          {job.company_name || 'Unknown Company'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">{job.location || 'Unknown Location'}</td>
                       <td className="px-4 py-3 text-sm text-gray-600 line-clamp-2">
  <div dangerouslySetInnerHTML={{ __html: safeHtml(job.description) }} />
</td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'Closed'
                                ? 'bg-gray-100 text-gray-800'
                                : job.status === 'Draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {job.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{job.applicantCount ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{job.views ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDeadline(job.deadline)}
                          {job.deadline && isDeadlineApproaching(job.deadline) && (
                            <span className="ml-2 text-red-600 text-xs">(Approaching)</span>
                          )}
                          {job.deadline && isDeadlinePassed(job.deadline) && (
                            <span className="ml-2 text-red-600 text-xs">(Expired)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Link
                              href={`/jobs/${job.id}/applicants`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              Applicants
                            </Link>
                            <button
                              onClick={() => handleEdit(job)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(job.id, job.status)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {job.status === 'Active' ? 'Close' : 'Reopen'}
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-500">
              No jobs found.{' '}
              {searchQuery || statusFilter !== 'All' || categoryFilter
                ? 'Try adjusting your filters or post a new job.'
                : "You haven't posted any jobs yet. Start by creating one!"}
            </p>
            <Link
              href="/empposting"
              className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Page;