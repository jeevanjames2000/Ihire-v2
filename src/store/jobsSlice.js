import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with interceptors
const axiosAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
    timeout: 10000,
  });


  // Fetch jobs by category or subcategory name
export const fetchJobsByCategoryOrSubcategory = createAsyncThunk(
  'jobs/fetchJobsByCategoryOrSubcategory',
  async ({ categoryName, subcategoryName }, { rejectWithValue }) => {
    try {
      const params = {};
      if (categoryName) params.category_name = categoryName;
      if (subcategoryName) params.subcategory_name = subcategoryName;

      const res = await axios.get('http://localhost:5000/api/jobs/by-category', { params });
      return res.data.jobs || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);



export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (
    {
      statusFilter = 'All',
      searchQuery = '',
      page = 1,
      jobsPerPage = 10,
      category,
      sortBy,
      userId,
      postedByUser = false,
      companyId,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/jobs/all`, // Match backend POST endpoint
        {
          companyId :"1",
          statusFilter,
          searchQuery,
          page,
          jobsPerPage,
          category,
          sortBy,
          userId,
          postedByUser,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is in localStorage
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Fetch jobs error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const response = await axiosAuth(token).get(`/jobs/${jobId}`);
      return { ...response.data, createdAt: response.data.created_at || new Date().toISOString(), applicantCount: response.data.applicantCount || 0, views: response.data.views || 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Job not found';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'jobs/fetchUserApplications',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/applications', { params: { page, limit } });
      return response.data.applications.map(app => app.job_id); // just store job_ids
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchApplicantsByUserJobs = createAsyncThunk(
  'jobs/fetchApplicantsByUserJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const userId = user.userInfo?.id; // employer ID
      if (!userId) throw new Error('User ID required');

      const response = await axios.get(
        `http://localhost:5000/api/applications/jobs/applicants/user/${userId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        return { all: [] }; // no applicants found
      }

      // Map applicants with job info
      const applicants = data.map((row) => ({
        id: row.id,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        location: row.location,
        experience: row.experience,
        jobTitle: row.jobTitle,
        company: row.company,
        qualification: row.qualification,
        specialization: row.specialization,
        university: row.university,
        skills: Array.isArray(row.skills) ? row.skills : [],
        resume: row.resume,
        coverLetter: row.coverLetter,
        linkedIn: row.linkedIn,
        portfolio: row.portfolio,
        createdAt: row.createdAt,
        jobId: row.job_id,
        candidateUserId: row.user_id,
        candidateId: row.candidate_id,
        status: row.status,
        notes: row.notes,
        job: {
          id: row.job_id,
          title: row.title,
          description: row.description,
          location: row.location,
          salary: row.salary,
          companyName: row.company_name,
          userId: row.user_id,
          createdAt: row.created_at,
          status: row.status,
          skills: Array.isArray(row.skills) ? row.skills : [],
          category: row.category,
          subcategory: row.subcategory,
          tags: row.tags,
        },
      }));

      // Group by jobId for easier frontend use
      const groupedApplicants = applicants.reduce((acc, applicant) => {
        const jobId = String(applicant.jobId);
        acc[jobId] = acc[jobId] || [];
        acc[jobId].push(applicant);
        acc.all = acc.all || [];
        acc.all.push(applicant);
        return acc;
      }, { all: [] });

      return groupedApplicants;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        'Failed to fetch applicants';
      return rejectWithValue(errorMessage);
    }
  }
);
// Fetch all applicants
export const fetchAllApplicants = createAsyncThunk(
  'jobs/fetchAllApplicants',
  async ({ userId }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/jobs/applicants-for-employer', {
        params: { user_id: userId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const applicants = (response.data || []).map((app) => ({
        id: app.id,
        jobId: app.job_id,
        candidateId: app.candidate_id,
        fullName: app.full_name || app.fullName || 'N/A',
        email: app.email || 'N/A',
        phone: app.phone || app.mobile || 'N/A',
        location: app.location || 'N/A',
        experience: app.experience || 'N/A',
        jobTitle: app.job_title || 'N/A',
        company: app.company || 'N/A',
        qualification: app.qualification || 'N/A',
        specialization: app.specialization || 'N/A',
        university: app.university || 'N/A',
        skills: Array.isArray(app.skills) ? app.skills : [],
        resume: app.resume || null,
        coverLetter: app.coverLetter || app.cover_letter || null,
        linkedIn: app.linkedIn || app.linkedin || null,
        portfolio: app.portfolio || null,
        status: app.status || 'Applied',
        createdAt: app.created_at || app.createdAt || new Date().toISOString(),
      }));
      const groupedApplicants = applicants.reduce((acc, applicant) => {
        const jobId = String(applicant.jobId);
        acc[jobId] = acc[jobId] || [];
        acc[jobId].push(applicant);
        acc.all = acc.all || [];
        acc.all.push(applicant);
        return acc;
      }, { all: [] });
      return groupedApplicants;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to fetch all applicants';
      console.error('❌ [Thunk Error] Failed to fetch all applicants:', err);
      return rejectWithValue(errorMessage);
    }
  }
);

// Create job
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const payload = {
        ...jobData,
        userId: user.userInfo?.id || 1,
        skills: Array.isArray(jobData.skills) ? jobData.skills : [],
        category_id: jobData.category_id || null,
        subcategory_id: jobData.subcategory_id || null,
      };
      const response = await axios.post('http://localhost:5000/api/jobs/create-job', payload, {
        headers: token ? { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } : { 'Cache-Control': 'no-cache' },
        timeout: 10000,
      });
      console.log(" response::::::::::::::::::: ", response )
      return {
        ...response.data,
        createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(),
        applicantCount: response.data.applicantCount || 0,
        views: response.data.views || 0,
      };
    } catch (error) {
      console.error('Create Job Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...jobData }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const payload = {
        ...jobData,
        skills: Array.isArray(jobData.skills) ? jobData.skills : [],
        category_id: jobData.category_id || null,
        subcategory_id: jobData.subcategory_id || null,
      };
      const response = await axios.put(`http://localhost:5000/api/jobs/${id}/updatejob`, payload, {
        headers: token ? { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' } : { 'Cache-Control': 'no-cache' },
        timeout: 10000,
      });
      return {
        ...response.data,
        createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(),
        applicantCount: response.data.applicantCount || 0,
        views: response.data.views || 0,
      };
    } catch (error) {
      console.error('updateJob error:', JSON.stringify(error, null, 2), {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        config: error.config,
      });
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to update job',
      });
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem("token");
      const userId = user.userInfo?.id;

      if (!userId) return rejectWithValue("User ID is missing");

      await axios.delete(`http://localhost:5000/api/jobs/${id}/deletejobs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to delete job"
      );
    }
  }
);

// Bulk delete jobs
export const bulkDeleteJobs = createAsyncThunk(
  'jobs/bulkDeleteJobs',
  async (jobIds, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs/bulk-delete', { jobIds }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return jobIds;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to bulk delete jobs';
      return rejectWithValue(errorMessage);
    }
  }
);

export const toggleJobStatus = createAsyncThunk(
  'jobs/toggleJobStatus',
  async ({ id, currentStatus }, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user?.userInfo?.token || localStorage.getItem('token');
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';

      // 👇 Clearer, descriptive API route
      await axios.patch(
        `http://localhost:5000/api/jobs/${id}/toggle-status`,
        { status: newStatus },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      return { id, status: newStatus };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        'Failed to toggle job status';
      return rejectWithValue(errorMessage);
    }
  }
);



export const fetchApplicantsByJob = createAsyncThunk(
  'jobs/fetchApplicantsByJob',
  async ({ jobId }, { rejectWithValue, getState }) => {
    try {
      if (!jobId) throw new Error('Job ID is required.');

      const state = getState();
      const token = state.user?.userInfo?.token || localStorage.getItem('token');
      const userId = state.user?.userInfo?.id || localStorage.getItem('userId');

      if (!userId) throw new Error('User ID is required.');

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const url = `http://localhost:5000/api/jobs/${jobId}/applicants`;

      const response = await axios.get(url, {
        headers,
        params: { userId },
      });

      const applicants = (response.data || []).map((app) => ({
        id: app.id,
        jobId: app.job_id,
        candidateId: app.candidate_id,
        fullName: app.full_name || app.name || 'N/A',
        email: app.email || 'N/A',
        phone: app.phone || 'N/A',
        location: app.location || 'N/A',
        experience: app.experience || 'N/A',
        jobTitle: app.job_title || app.position || 'N/A',
        company: app.company || 'N/A',
        qualification: app.qualification || 'N/A',
        specialization: app.specialization || 'N/A',
        university: app.university || 'N/A',
        skills: Array.isArray(app.skills) ? app.skills : [],
        resume: app.resume || app.resume_url || null,
        coverLetter: app.cover_letter || app.cover_letter_url || null,
        linkedIn: app.linkedin || null,
        portfolio: app.portfolio || null,
        status: app.status || 'Applied',
        createdAt: app.applied_at || app.createdAt || new Date().toISOString(),
      }));

      return { jobId: String(jobId), applicants };
    } catch (err) {
      console.error(' [Thunk Error] Failed to fetch applicants:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        err.message ||
        'Failed to fetch applicants';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch analytics
export const fetchAnalytics = createAsyncThunk(
  'jobs/fetchAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analytics', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data || { views: 0, applicantCount: 0 };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to fetch analytics';
      if (error.response?.status === 404) return { views: 0, applicantCount: 0 };
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch interviews
export const fetchInterviews = createAsyncThunk(
  'jobs/fetchInterviews',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/interviews', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to fetch interviews';
      if (error.response?.status === 404) return [];
      return rejectWithValue(errorMessage);
    }
  }
);

// Apply for job
export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token || !user.userInfo || user.userType !== 'job_seeker') throw new Error('Authentication required or unauthorized access');
      if (!applicationData.jobId || isNaN(Number(applicationData.jobId))) throw new Error('Invalid job ID');
      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        if (key === 'resume' && value) formData.append('resume', value);
        else if (key === 'coverLetter' && value) formData.append('coverLetter', value);
        else if (key === 'skills' && Array.isArray(value)) formData.append(key, JSON.stringify(value));
        else if (value) formData.append(key, value);
      });
      formData.append('status', 'Applied');
      formData.append('candidate_id', user.userInfo.id);
      const response = await axios.post(`http://localhost:5000/api/jobs/${applicationData.jobId}/apply`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return { ...response.data, jobId: applicationData.jobId };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to apply to job';
      return rejectWithValue(errorMessage);
    }
  }
);



export const updateApplicantStatus = createAsyncThunk(
  'jobs/updateApplicantStatus',
  async ({ applicationId, status, interviewDate = null }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');

      if (!token) throw new Error('Authentication required or unauthorized access');

      const payload = { status };
      if (interviewDate) payload.interviewDate = interviewDate;

      const response = await axiosAuth(token).put(`/applications/${applicationId}/status`, payload);

      return {
        applicationId,
        status: response.data.status || status,
        interviewDate: response.data.interviewDate || interviewDate,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        'Failed to update applicant status';
      return rejectWithValue(errorMessage);
    }
  }
);

///for applied jobs
export const fetchAppliedJobs = createAsyncThunk(
  "jobs/fetchAppliedJobs",
  async ({  search = "", status = "All", page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.userInfo?.token || localStorage.getItem("token");
        const { user } = getState();
        console.log(user.userInfo )
      if (!token) throw new Error("No authentication token found");
const userId=user.userInfo.id
console.log("Sfsfdf",userId)
      const params = new URLSearchParams({ id: userId,search, status, page, limit });
      console.log("Fetching applied jobs with params:", { search, status, page, limit });

      const response = await axiosAuth(token).get(`/applications/user?${params}`);
      const { jobs, total } = response.data;

      if (!Array.isArray(jobs) || typeof total !== "number") {
        throw new Error("Invalid API response format: Expected { jobs: Array, total: number }");
      }

      console.log("Fetched applied jobs:", { jobs, total });
      return { jobs, total };
    } catch (err) {
      console.log("err",err)
      console.error("fetchAppliedJobs error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message || "Failed to fetch applied jobs");
    }
  }
);

const initialState = {
  jobs: [],
  total: 0,
  page: 1,
  jobsPerPage: 10,
  searchQuery: '',
  location: '',
  statusFilter: 'All',
  categoryFilter: '',
  sortBy: 'createdAt-desc',
  jobsStatus: 'idle',
  jobsError: null,
  categories: [],
  categoriesStatus: 'idle',
    appliedJobs: [], // Added for fetchAppliedJobs
  totalAppliedJobs: 0, // Added for fetchAppliedJobs
  loading: false, // Added for fetchAppliedJobs
  error: null, // Added for fetchAppliedJobs
  categoriesError: null,
  jobsByCategory: [],
  applications: [],
  applicationsData: [],
  applicants: { all: [] }, // Initialize applicants as an object with an 'all' array
  applicantsStatus: 'idle',
  applicantsError: null,
  analytics: {},
  upcomingInterviews: [],
  applying: false,
  applyError: null,
  applySuccess: null,
  addJobStatus: 'idle',
  addJobError: null,
  addJobSuccess: false,
  updateJobStatus: 'idle',
  updateJobError: null,
  updateJobSuccess: false,
  deleteJobStatus: 'idle',
  deleteJobError: null,
  deleteJobSuccess: false,
  bulkDeleteStatus: 'idle',
  bulkDeleteError: null,
  bulkDeleteSuccess: false,
  toggleStatus: 'idle',
  toggleStatusError: null,
  toggleStatusSuccess: false,
  updateStatusStatus: 'idle',
  updateStatusError: null,
  updateStatusSuccess: false,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    decrementPage: (state) => {
      if (state.page > 1) state.page -= 1;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.location = '';
      state.statusFilter = 'All';
      state.categoryFilter = '';
      state.sortBy = 'createdAt-desc';
      state.page = 1;
    },
    clearApplyState: (state) => {
      state.applying = false;
      state.applyError = null;
      state.applySuccess = null;
    },
    clearAddJobState: (state) => {
      state.addJobStatus = 'idle';
      state.addJobError = null;
      state.addJobSuccess = false;
    },
    clearUpdateJobState: (state) => {
      state.updateJobStatus = 'idle';
      state.updateJobError = null;
      state.updateJobSuccess = false;
    },
    clearDeleteJobState: (state) => {
      state.deleteJobStatus = 'idle';
      state.deleteJobError = null;
      state.deleteJobSuccess = false;
    },
    clearBulkDeleteState: (state) => {
      state.bulkDeleteStatus = 'idle';
      state.bulkDeleteError = null;
      state.bulkDeleteSuccess = false;
    },
    clearToggleStatusState: (state) => {
      state.toggleStatus = 'idle';
      state.toggleStatusError = null;
      state.toggleStatusSuccess = false;
    },
    clearApplicantsState: (state) => {
      state.applicants = { all: [] };
      state.applicantsStatus = 'idle';
      state.applicantsError = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.jobs = action.payload.jobs || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.jobsPerPage = action.payload.jobsPerPage || state.jobsPerPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
        state.jobs = [];
        state.total = 0;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        const existingJobIndex = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (existingJobIndex >= 0) {
          state.jobs[existingJobIndex] = action.payload;
        } else {
          state.jobs.push(action.payload);
        }
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
   
      .addCase(fetchAppliedJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
      state.loading = false;
      state.appliedJobs = action.payload.jobs || [];
      state.totalAppliedJobs = action.payload.total || 0;
    })
    .addCase(fetchAppliedJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch applied jobs";
    })
      
   
      .addCase(fetchUserApplications.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applications = action.payload.applications.map((app) => app.job_id) || [];
        state.applicationsData = action.payload.applications || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      .addCase(fetchAllApplicants.pending, (state) => {
        state.applicantsStatus = 'loading';
        state.applicantsError = null;
      })
      .addCase(fetchAllApplicants.fulfilled, (state, action) => {
        state.applicantsStatus = 'succeeded';
        state.applicants = action.payload;
      })
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.applicantsStatus = 'failed';
        state.applicantsError = action.payload;
      })
      .addCase(fetchApplicantsByUserJobs.pending, (state) => {
        state.applicantsStatus = 'loading';
        state.applicantsError = null;
      })
      .addCase(fetchApplicantsByUserJobs.fulfilled, (state, action) => {
        state.applicantsStatus = 'succeeded';
        state.applicants = action.payload;
      })
      .addCase(fetchApplicantsByUserJobs.rejected, (state, action) => {
        state.applicantsStatus = 'failed';
        state.applicantsError = action.payload;
        state.applicants = { all: [] };
      })
      .addCase(createJob.pending, (state) => {
        state.addJobStatus = 'loading';
        state.addJobError = null;
        state.addJobSuccess = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.addJobStatus = 'succeeded';
        state.addJobSuccess = true;
        state.jobs = [...state.jobs, action.payload];
        state.total += 1;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.addJobStatus = 'failed';
        state.addJobError = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.updateJobStatus = 'loading';
        state.updateJobError = null;
        state.updateJobSuccess = false;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateJobStatus = 'succeeded';
        state.updateJobSuccess = true;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], ...action.payload };
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateJobStatus = 'failed';
        state.updateJobError = action.payload.message || action.payload;
      })
      .addCase(deleteJob.pending, (state) => {
        state.deleteJobStatus = 'loading';
        state.deleteJobError = null;
        state.deleteJobSuccess = false;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deleteJobStatus = 'succeeded';
        state.deleteJobSuccess = true;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteJobStatus = 'failed';
        state.deleteJobError = action.payload;
      })
      .addCase(bulkDeleteJobs.pending, (state) => {
        state.bulkDeleteStatus = 'loading';
        state.bulkDeleteError = null;
        state.bulkDeleteSuccess = false;
      })
      .addCase(bulkDeleteJobs.fulfilled, (state, action) => {
        state.bulkDeleteStatus = 'succeeded';
        state.bulkDeleteSuccess = true;
        state.jobs = state.jobs.filter((job) => !action.payload.includes(job.id));
        state.total -= action.payload.length;
      })
      .addCase(bulkDeleteJobs.rejected, (state, action) => {
        state.bulkDeleteStatus = 'failed';
        state.bulkDeleteError = action.payload;
      })
      .addCase(toggleJobStatus.pending, (state) => {
        state.toggleStatus = 'loading';
        state.toggleStatusError = null;
        state.toggleStatusSuccess = false;
      })
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
        state.toggleStatus = 'succeeded';
        state.toggleStatusSuccess = true;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index].status = action.payload.status;
        }
      })
      .addCase(toggleJobStatus.rejected, (state, action) => {
        state.toggleStatus = 'failed';
        state.toggleStatusError = action.payload;
      })
      .addCase(fetchApplicantsByJob.pending, (state) => {
        state.applicantsStatus = 'loading';
        state.applicantsError = null;
      })
      .addCase(fetchApplicantsByJob.fulfilled, (state, action) => {
        state.applicantsStatus = 'succeeded';
        state.applicants[action.payload.jobId] = action.payload.applicants;
      })
      .addCase(fetchApplicantsByJob.rejected, (state, action) => {
        state.applicantsStatus = 'failed';
        state.applicantsError = action.payload;
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      .addCase(fetchInterviews.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.upcomingInterviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      .addCase(applyForJob.pending, (state) => {
        state.applying = true;
        state.applyError = null;
        state.applySuccess = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applying = false;
        state.applySuccess = action.payload;
        state.applications = [...new Set([...state.applications, action.payload.jobId])];
        state.applicationsData = [...state.applicationsData, action.payload];
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applying = false;
        state.applyError = action.payload;
      })
      .addCase(updateApplicantStatus.pending, (state) => {
        state.updateStatusStatus = 'loading';
        state.updateStatusError = null;
        state.updateStatusSuccess = false;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.updateStatusStatus = 'succeeded';
        state.updateStatusSuccess = true;
        if (state.applicants.all) {
          const index = state.applicants.all.findIndex((app) => app.id === action.payload.applicationId);
          if (index !== -1) {
            state.applicants.all[index].status = action.payload.status;
            state.applicants.all[index].interviewDate = action.payload.interviewDate;
          }
        }
        Object.keys(state.applicants).forEach((jobId) => {
          if (jobId !== 'all') {
            const index = state.applicants[jobId].findIndex((app) => app.id === action.payload.applicationId);
            if (index !== -1) {
              state.applicants[jobId][index].status = action.payload.status;
              state.applicants[jobId][index].interviewDate = action.payload.interviewDate;
            }
          }
        });
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.updateStatusStatus = 'failed';
        state.updateStatusError = action.payload;
      })
      .addCase(fetchJobsByCategoryOrSubcategory.pending, (state) => {
        state.status = 'loading';
      })
        .addCase(fetchJobsByCategoryOrSubcategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
         .addCase(fetchJobsByCategoryOrSubcategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      


      
  },
});

export const {
  setSearchQuery,
  setLocation,
  setStatusFilter,
setCategoryFilter,
  setSortBy,
  setPage,
  incrementPage,
  decrementPage,
  clearFilters,
  clearApplyState,
  clearAddJobState,
  clearUpdateJobState,
  clearDeleteJobState,
  clearBulkDeleteState,
  clearToggleStatusState,
  clearApplicantsState,
} = jobsSlice.actions;

export default jobsSlice.reducer;