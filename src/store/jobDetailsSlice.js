// store/jobsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

// Helper to get token
const getToken = (getState) => {
  if (getState) {
    const state = getState();
    return state?.user?.userInfo?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

// axios instance (optional)
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// -------------------- Thunks --------------------
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs/all',
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
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getToken(getState);
      const response = await axiosInstance.post(
        `jobs/fetchJobs/all`,
        {
          companyId,
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
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data;
    } catch (error) {
      console.error('Fetch jobs error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const token = getToken(getState);
      const response = await axiosInstance.get(`/jobs/${jobId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // normalize fields if necessary
      return {
        ...response.data,
        createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(),
        applicantCount: response.data.applicant_count ?? response.data.applicantCount ?? 0,
        views: response.data.views ?? 0,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Job not found';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...jobData }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      if (!token) throw new Error('No authentication token found');

      const payload = {
        ...jobData,
        // ensure JSON columns are arrays/strings as required by your backend
        skills: Array.isArray(jobData.skills) ? jobData.skills : jobData.skills || [],
        category_id: jobData.category_id || jobData.category || null,
        subcategory_id: jobData.subcategory_id || jobData.subcategory || null,
      };

      const response = await axiosInstance.put(`/jobs/${id}/updatejob`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
      });

      return {
        ...response.data,
        createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(),
        applicantCount: response.data.applicant_count ?? response.data.applicantCount ?? 0,
        views: response.data.views ?? 0,
      };
    } catch (error) {
      console.error('updateJob error:', error);
      return rejectWithValue(error.response?.data || error.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axiosInstance.delete(`/jobs/${id}/deletejobs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete job');
    }
  }
);

export const bulkDeleteJobs = createAsyncThunk(
  'jobs/bulkDeleteJobs',
  async (jobIds, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      await axiosInstance.post(
        `/jobs/bulk-delete`,
        { jobIds },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return jobIds;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to bulk delete jobs');
    }
  }
);

export const toggleJobStatus = createAsyncThunk(
  'jobs/toggleJobStatus',
  async ({ id, currentStatus }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axiosInstance.post(
        `/jobs/${id}/toggle-status`,
        { currentStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return { id, status: response.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to toggle status');
    }
  }
);

// -------------------- Slice --------------------
const initialState = {
  jobs: [],
  total: 0,
  page: 1,
  jobsPerPage: 10,
  searchQuery: '',
  statusFilter: 'All',
  categoryFilter: '',
  sortBy: 'createdAt-desc',
  jobsStatus: 'idle',
  jobsError: null,
  currentJob: null,
};

const jobDetailsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {   
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
      state.page = 1;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
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
        state.jobsError = action.payload || action.error.message;
      })

      // fetchJobById
      .addCase(fetchJobById.pending, (state) => {
        state.jobsStatus = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload || action.error.message;
      })

      // updateJob
      .addCase(updateJob.fulfilled, (state, action) => {
        const updated = action.payload;
        state.jobs = state.jobs.map((j) => (j.id === updated.id ? updated : j));
      })

      // deleteJob
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })

      // bulkDeleteJobs
      .addCase(bulkDeleteJobs.fulfilled, (state, action) => {
        const ids = action.payload;
        state.jobs = state.jobs.filter((j) => !ids.includes(j.id));
        state.total = Math.max(0, state.total - ids.length);
        state.selected = [];
      })

      // toggleJobStatus
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.jobs = state.jobs.map((j) => (j.id === id ? { ...j, status } : j));
      });
  },
});

export const { setSearchQuery, setStatusFilter, setCategoryFilter, setSortBy, setPage } = jobsSlice.actions;

export default jobDetailsSlice.reducer;
