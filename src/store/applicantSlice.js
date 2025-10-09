import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosAuth = (token) => {
  const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` },
  });
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
          const newToken = res.data.token;
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async ({ statusFilter, searchQuery, page, jobsPerPage, jobId, candidateId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const params = new URLSearchParams({
        search: searchQuery || '',
        status: statusFilter === 'All' ? '' : statusFilter,
        page,
        limit: jobsPerPage,
      });

      const url = jobId ? `/applications/${jobId}` : '/applications';
      const res = await axiosAuth(token).get(`${url}?${params}`);
      return {
        applicants: res.data.applicants || res.data.jobs || [],
        total: res.data.total || 0,
        page,
        jobsPerPage,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.details || err.message || 'Failed to fetch applications');
    }
  }
);

export const updateApplicantStatus = createAsyncThunk(
  'applicants/updateApplicantStatus',
  async ({ id, status, interviewDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const res = await axiosAuth(token).put(`/applications/${id}/status`, { status, interviewDate });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.details || err.message || 'Failed to update status');
    }
  }
);

const initialState = {
  applicants: [],
  total: 0,
  page: 1,
  jobsPerPage: 4,
  statusFilter: 'All',
  searchQuery: '',
  status: 'idle',
  error: null,
};

const applicantsSlice = createSlice({
  name: 'applicants',
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
    setPage(state, action) {
      state.page = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.page === 1) {
          state.applicants = action.payload.applicants;
        } else {
          state.applicants = [...state.applicants, ...action.payload.applicants];
        }
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.jobsPerPage = action.payload.jobsPerPage;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, status, interviewDate } = action.payload;
        const applicant = state.applicants.find((app) => app.id === id);
        if (applicant) {
          applicant.status = status;
          applicant.interviewDate = interviewDate;
        }
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setStatusFilter, setPage, clearError } = applicantsSlice.actions;
export default applicantsSlice.reducer;