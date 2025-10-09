import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosAuth = (token) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });

export const fetchPostedJobs = createAsyncThunk(
  'postedJobs/fetchPostedJobs',
  async ({ userInfo, userType, token }, { rejectWithValue }) => {
    try {
      console.log('fetchPostedJobs: userInfo=', userInfo, 'userType=', userType, 'token=', token ? 'present' : 'missing');
      const response = await axiosAuth(token).get('/jobs/posted');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch posted jobs';
      console.error('fetchPostedJobs Error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const postingSlice = createSlice({
  name: 'postedJobs',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchPostedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postingSlice.reducer;