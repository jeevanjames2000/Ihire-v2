"use client"
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { updateJob, deleteJob, clearUpdateJobState, clearDeleteJobState } from '../../../../../store/jobsSlice';
import { fetchCategories, fetchSubcategories, fetchSkills } from '../../../../../store/categoriesSlice';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';


const EditJob = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const {
    categories = [],
    categoriesStatus = 'idle',
    subcategories = [],
    subcategoriesStatus = 'idle',
    skills = [],
    skillsStatus = 'idle',
    error: categoriesError = null,
    skillsError = null,
  } = useSelector((state) => state.categories || {});
  const {
    jobsStatus = 'idle',
    jobsError = null,
    updateJobError = null,
    updateJobSuccess = false,
    deleteJobError = null,
    deleteJobSuccess = false,
  } = useSelector((state) => state.jobs || {});
  const { userInfo = null, userType = null } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    title:  '',
    company_name:  '',
    location:  '',
    description:  '',
    category_id:  '',
    category_name:  '',
    subcategory_id:  '',
    subcategory_name:  '',
    salary:  0,
    type: '',
    experience:  '',
    deadline: "",
    skills:[],
    status:"",
    contactPerson: '',
    role:  '',
    startDate: ""
  });
  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (skillsStatus === 'idle') {
      dispatch(fetchSkills());
    }
  }, [dispatch, skillsStatus]);

  useEffect(() => {
    // Uncomment if authentication is required
    // if (!userInfo || !userType || (userType !== 'employer' && userType !== 'admin')) {
    //   toast.error('Unauthorized access.', { position: 'top-right', autoClose: 3000 });
    //   router.push('/login');
    //   return;
    // }
    if (categoriesStatus === 'idle' && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, userInfo, userType, router, categoriesStatus, categories.length]);

  useEffect(() => {
    if (formData.category_id) {
      dispatch(fetchSubcategories(formData.category_id));
    } else {
      dispatch({ type: 'categories/resetSubcategories' });
    }
  }, [dispatch, formData.category_id]);

  // useEffect(() => {
  //   if (id && initialJob && Object.keys(initialJob).length > 0 && skillsStatus === 'succeeded' && skills.length > 0) {
  //     const category = categories.find((cat) => cat.id === initialJob.category_id);
  //     const subcategory = subcategories.find((sub) => sub.id === initialJob.subcategory_id);
  //     const validSkills = Array.isArray(initialJob.skills)
  //       ? initialJob.skills.filter((skill) => skills.includes(skill))
  //       : [];
  //     console.log('Initializing formData for job:', {
  //       jobId: initialJob.id,
  //       jobSkills: initialJob.skills,
  //       skills,
  //       validSkills,
  //     });
  //     setFormData({
  //       title: initialJob.title || '',
  //       company_name: initialJob.company_name || '',
  //       location: initialJob.location || '',
  //       description: initialJob.description || '',
  //       category_id: category ? String(category.id) : '',
  //       category_name: category ? category.name : '',
  //       subcategory_id: subcategory ? String(subcategory.id) : '',
  //       subcategory_name: subcategory ? subcategory.name : '',
  //       salary: initialJob.salary || 0,
  //       type: initialJob.type || '',
  //       experience: initialJob.experience || '',
  //       deadline: initialJob.deadline && !isNaN(new Date(initialJob.deadline))
  //         ? new Date(initialJob.deadline).toISOString().split('T')[0]
  //         : '',
  //       skills: validSkills,
  //       status: initialJob.status || 'Active',
  //       contactPerson: initialJob.contactPerson || '',
  //       role: initialJob.role || '',
  //       startDate: initialJob.startDate && !isNaN(new Date(initialJob.startDate))
  //         ? new Date(initialJob.startDate).toISOString().split('T')[0]
  //         : '',
  //       vacancies: initialJob.vacancies || 1,
  //     });
  //     if (category && !subcategories.length && formData.category_id) {
  //       dispatch(fetchSubcategories(category.id));
  //     }
  //   }
  // }, [id, initialJob, categories, subcategories, dispatch, skills, skillsStatus]);

  useEffect(() => {
    if (updateJobSuccess) {
      toast.success('Job updated successfully.', { position: 'top-right', autoClose: 3000 });
      dispatch(clearUpdateJobState());
      router.push('/joblisting');
    }
    if (updateJobError) {
      const errorMessage = updateJobError.message || updateJobError.data?.error || 'Failed to update job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
      dispatch(clearUpdateJobState());
    }
    if (deleteJobSuccess) {
      toast.success('Job deleted successfully.', { position: 'top-right', autoClose: 3000 });
      dispatch(clearDeleteJobState());
      router.push('/joblisting');
    }
    if (deleteJobError) {
      const errorMessage = deleteJobError.message || deleteJobError.data?.error || 'Failed to delete job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
      dispatch(clearDeleteJobState());
      setIsDeleting(false);
    }
  }, [updateJobSuccess, updateJobError, deleteJobSuccess, deleteJobError, dispatch, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'category_id') {
        updated.subcategory_id = '';
        updated.subcategory_name = '';
        updated.category_name = categories.find((cat) => cat.id === value)?.name || '';
      }
      if (name === 'subcategory_id') {
        updated.subcategory_name = subcategories.find((sub) => sub.id === value)?.name || '';
      }
      return updated;
    });
    setErrors((prev) => {
      const updatedErrors = { ...prev, [name]: '' };
      if (name === 'category_id') updatedErrors.subcategory_id = '';
      return updatedErrors;
    });
  };

  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, skills: selectedSkills }));
    setErrors((prev) => ({ ...prev, skills: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    if (!formData.title) newErrors.title = 'Job Title is required';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Job Description is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.subcategory_id && formData.category_id && subcategories.length > 0)
      newErrors.subcategory_id = 'Subcategory is required';
    if (!formData.type) newErrors.type = 'Job Type is required';
    if (!formData.deadline) newErrors.deadline = 'Application Deadline is required';
    if (formData.deadline && formData.deadline < today)
      newErrors.deadline = 'Deadline must be a future date';
    if (formData.salary < 0) newErrors.salary = 'Salary cannot be negative';
    if (formData.vacancies < 1) newErrors.vacancies = 'Vacancies must be at least 1';
    if (!formData.skills || formData.skills.length === 0)
      newErrors.skills = 'At least one skill is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      const payload = { ...formData };
      console.log('Submitting payload:', { id, ...payload });
      await dispatch(updateJob({ id, ...payload })).unwrap();
    } catch (err) {
      const errorMessage = err.message?.includes('network')
        ? 'Network error. Please check your connection.'
        : err.message || 'Failed to update job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await dispatch(deleteJob(id)).unwrap();
    } catch (err) {
      setIsDeleting(false);
      const errorMessage = err.message || 'Failed to delete job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Edit Job Posting
          </h1>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || jobsStatus === 'loading'}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-400 focus:outline-none disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Job'}
          </button>
        </div>

        {(jobsStatus === 'failed' || categoriesStatus === 'failed' || skillsStatus === 'failed') && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            {jobsError || categoriesError || skillsError || 'An error occurred while processing your request.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Frontend Developer"
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-500">
                    {errors.title}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tech Corp"
                />
                {errors.company_name && (
                  <p id="company_name-error" className="mt-1 text-sm text-red-500">
                    {errors.company_name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai, India"
                />
                {errors.location && (
                  <p id="location-error" className="mt-1 text-sm text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={jobsStatus === 'loading' || categoriesStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoriesStatus === 'loading' && (
                  <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                )}
                {errors.category_id && (
                  <p id="category_id-error" className="mt-1 text-sm text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory_id"
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
                disabled={jobsStatus === 'loading' || subcategoriesStatus === 'loading' || !formData.category_id}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                  errors.subcategory_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {subcategoriesStatus === 'loading' && (
                <p className="mt-1 text-sm text-gray-500">Loading subcategories...</p>
              )}
              {errors.subcategory_id && (
                <p id="subcategory_id-error" className="mt-1 text-sm text-red-500">
                  {errors.subcategory_id}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the job responsibilities, requirements, and perks..."
                />
                {errors.description && (
                  <p id="description-error" className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills <span className="text-red-500">*</span>
                </label>
                {skillsStatus === 'loading' ? (
                  <p className="mt-1 text-sm text-gray-500">Loading skills...</p>
                ) : Array.isArray(skills) && skills.length > 0 ? (
                  <Select
                    isMulti
                    name="skills"
                    options={skills.map((skill) => ({ value: skill, label: skill }))}
                    value={formData.skills.map((skill) => ({ value: skill, label: skill }))}
                    onChange={handleSkillsChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select skills..."
                    isDisabled={skillsStatus !== 'succeeded' || jobsStatus === 'loading'}
                  />
                ) : (
                  <p className="mt-1 text-sm text-red-500">No skills available. Please contact support.</p>
                )}
                {errors.skills && (
                  <p id="skills-error" className="mt-1 text-sm text-red-500">
                    {errors.skills}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary (INR)
                  </label>
                  <input
                    id="salary"
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                    placeholder="e.g., 50000"
                  />
                  {errors.salary && (
                    <p id="salary-error" className="mt-1 text-sm text-red-500">
                      {errors.salary}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                  {errors.type && (
                    <p id="type-error" className="mt-1 text-sm text-red-500">
                      {errors.type}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                    placeholder="e.g., 2-5 years"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                      errors.deadline ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.deadline && (
                    <p id="deadline-error" className="mt-1 text-sm text-red-500">
                      {errors.deadline}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 mb-1">
                    Vacancies
                  </label>
                  <input
                    id="vacancies"
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleChange}
                    min="1"
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                    placeholder="e.g., 3"
                  />
                  {errors.vacancies && (
                    <p id="vacancies-error" className="mt-1 text-sm text-red-500">
                      {errors.vacancies}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    id="contactPerson"
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                    placeholder="e.g., John Doe, HR Manager"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={jobsStatus === 'loading'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.push('/joblisting')}
                disabled={jobsStatus === 'loading' || isDeleting}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={jobsStatus === 'loading' || skillsStatus === 'loading' || isDeleting}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {jobsStatus === 'loading' ? 'Submitting...' : 'Update Job'}
              </button>
            </div>
          </form>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
        </div>
      </div>
    );
};



export default EditJob;