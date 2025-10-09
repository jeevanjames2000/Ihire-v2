'use client';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplicantsByJob,
  clearApplicantsState,
  updateApplicantStatus,
} from '@/store/jobsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';

// Applicant Row Component
const ApplicantRow = ({ applicant, index, showJobId, onAction }) => (
  <tr className="border-t border-gray-200 hover:bg-gray-50">
    <td className="px-4 py-2">{index + 1}</td>
    {showJobId && <td className="px-4 py-2">{applicant.jobId || 'N/A'}</td>}
    <td className="px-4 py-2">{applicant.fullName || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.email || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.phone || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.location || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.experience || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.jobTitle || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.company || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.qualification || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.specialization || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.university || 'N/A'}</td>
    <td className="px-4 py-2">{applicant.skills.join(', ') || 'N/A'}</td>
    <td className="px-4 py-2">
      {applicant.resume ? (
        <a
          href={`/api/files/${applicant.resume.split('/').pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </td>
    <td className="px-4 py-2">
      {applicant.coverLetter ? (
        <a
          href={`/api/files/${applicant.coverLetter.split('/').pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </td>
    <td className="px-4 py-2">
      {applicant.linkedIn ? (
        <a
          href={applicant.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </td>
    <td className="px-4 py-2">
      {applicant.createdAt
        ? new Date(applicant.createdAt).toLocaleDateString()
        : 'N/A'}
    </td>
    <td className="px-4 py-2 font-medium">
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          applicant.status === 'Shortlisted'
            ? 'bg-green-100 text-green-700'
            : applicant.status === 'Interview Scheduled'
            ? 'bg-blue-100 text-blue-700'
            : applicant.status === 'Rejected'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {applicant.status || 'Pending'}
      </span>
    </td>
    <td className="px-4 py-2 flex gap-2">
      <button
        onClick={() => onAction(applicant, 'Shortlisted')}
        className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
      >
        Shortlist
      </button>
      <button
        onClick={() => onAction(applicant, 'Interview Scheduled')}
        className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
      >
        Interview
      </button>
      <button
        onClick={() => onAction(applicant, 'Rejected')}
        className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
      >
        Reject
      </button>
    </td>
  </tr>
);

// Applicant Card Component
const ApplicantCard = ({ applicant, showJobId, onAction }) => (
  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    {showJobId && (
      <p>
        <strong>Job ID:</strong> {applicant.jobId || 'N/A'}
      </p>
    )}
    <p>
      <strong>Name:</strong> {applicant.fullName || 'N/A'}
    </p>
    <p>
      <strong>Email:</strong> {applicant.email || 'N/A'}
    </p>
    <p>
      <strong>Phone:</strong> {applicant.phone || 'N/A'}
    </p>
    <p>
      <strong>Location:</strong> {applicant.location || 'N/A'}
    </p>
    <p>
      <strong>Experience:</strong> {applicant.experience || 'N/A'}
    </p>
    <p>
      <strong>Job Title:</strong> {applicant.jobTitle || 'N/A'}
    </p>
    <p>
      <strong>Company:</strong> {applicant.company || 'N/A'}
    </p>
    <p>
      <strong>Qualification:</strong> {applicant.qualification || 'N/A'}
    </p>
    <p>
      <strong>Specialization:</strong> {applicant.specialization || 'N/A'}
    </p>
    <p>
      <strong>University:</strong> {applicant.university || 'N/A'}
    </p>
    <p>
      <strong>Skills:</strong> {applicant.skills.join(', ') || 'N/A'}
    </p>
    <p>
      <strong>Resume:</strong>{' '}
      {applicant.resume ? (
        <a
          href={`/api/files/${applicant.resume.split('/').pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </p>
    <p>
      <strong>Cover Letter:</strong>{' '}
      {applicant.coverLetter ? (
        <a
          href={`/api/files/${applicant.coverLetter.split('/').pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </p>
    <p>
      <strong>LinkedIn:</strong>{' '}
      {applicant.linkedIn ? (
        <a
          href={applicant.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          View
        </a>
      ) : (
        'N/A'
      )}
    </p>
    <p>
      <strong>Applied On:</strong>{' '}
      {applicant.createdAt
        ? new Date(applicant.createdAt).toLocaleDateString()
        : 'N/A'}
    </p>
    <p>
      <strong>Status:</strong>{' '}
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          applicant.status === 'Shortlisted'
            ? 'bg-green-100 text-green-700'
            : applicant.status === 'Interview Scheduled'
            ? 'bg-blue-100 text-blue-700'
            : applicant.status === 'Rejected'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {applicant.status || 'Pending'}
      </span>
    </p>
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onAction(applicant, 'Shortlisted')}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Shortlist
      </button>
      <button
        onClick={() => onAction(applicant, 'Interview Scheduled')}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Interview
      </button>
      <button
        onClick={() => onAction(applicant, 'Rejected')}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Reject
      </button>
    </div>
  </div>
);

// Main Component
const JobApplicants = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: jobId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [localApplicants, setLocalApplicants] = useState([]);
  const fetchedRef = useRef(false);

  const { userInfo, userType } = useSelector((state) => state.user || {});
  const { applicants = [], applicantsStatus = 'idle', applicantsError = null } =
    useSelector((state) => state.jobs || {});

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!userInfo?.token || userType !== 'employer') {
      toast.error('Please log in as an employer to view applicants', {
        position: 'top-right',
        autoClose: 3000,
      });
      router.push('/login?type=employer');
      return;
    }

    fetchedRef.current = true;
    dispatch(clearApplicantsState());
    if (jobId) {
      dispatch(fetchApplicantsByJob({ jobId }));
    }
  }, [dispatch, jobId, userInfo, userType, router]);

  const normalizedApplicants = useMemo(() => {
    const arrayForm = Array.isArray(applicants) ? applicants : Object.values(applicants).flat();
    let normalized = arrayForm.map((applicant) => ({
      ...applicant,
      skills: Array.isArray(applicant.skills)
        ? applicant.skills
        : applicant.skills?.replace(/["]/g, '').split(',') || [],
      resume: applicant.resume?.replace(/\\/g, '/'),
      coverLetter: applicant.coverLetter?.replace(/\\/g, '/'),
      status: applicant.status || 'Pending',
    }));

    const uniqueMap = new Map();
    normalized = normalized.filter((applicant) => {
      if (uniqueMap.has(applicant.id)) return false;
      uniqueMap.set(applicant.id, true);
      return true;
    });

    setLocalApplicants(normalized);
    return normalized;
  }, [applicants]);

  const handleApplicantAction = async (applicant, newStatus) => {
    try {
      setLocalApplicants((prev) =>
        prev.map((a) => (a.id === applicant.id ? { ...a, status: newStatus } : a))
      );
      await dispatch(
        updateApplicantStatus({
          applicationId: applicant.id,
          status: newStatus,
        })
      ).unwrap();
      toast.success(`${applicant.fullName} has been marked as ${newStatus}.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error || `Failed to update status for ${applicant.fullName}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setLocalApplicants((prev) =>
        prev.map((a) => (a.id === applicant.id ? { ...a, status: applicant.status } : a))
      );
    }
  };

  const filteredApplicants = useMemo(() => {
    return normalizedApplicants.filter((applicant) =>
      [
        applicant.fullName,
        applicant.email,
        applicant.skills.join(','),
        applicant.jobTitle,
        applicant.company,
        applicant.qualification,
        applicant.specialization,
        applicant.university,
      ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [normalizedApplicants, searchTerm]);

  if (applicantsStatus === 'loading') {
    return <p className="text-gray-600 text-lg">Loading applicants...</p>;
  }

  if (applicantsStatus === 'failed') {
    return (
      <p className="text-red-600 text-lg">
        {applicantsError?.includes('404')
          ? `No applicants found for job #${jobId}`
          : `Error: ${applicantsError}`}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Applicants for Job #{jobId}</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, skills, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm pl-10"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaList />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg ${
                viewMode === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaTh />
            </button>
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <p className="text-gray-600 text-lg">No applicants found for job #{jobId}.</p>
        ) : viewMode === 'table' ? (
          <table className="min-w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Experience</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Qualification</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Specialization</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">University</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Skills</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Resume</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cover Letter</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">LinkedIn</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Applied On</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant, index) => (
                <ApplicantRow
                  key={applicant.id}
                  applicant={applicant}
                  index={index}
                  showJobId={false}
                  onAction={handleApplicantAction}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                showJobId={false}
                onAction={handleApplicantAction}
              />
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default JobApplicants;