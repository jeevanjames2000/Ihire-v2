import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/resume";

export const fetchResume = createAsyncThunk(
  "resume/fetchResume",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
    
     
      const response = await axios.get(`http://localhost:5000/api/resume/getResume?userId=${user?.userInfo.id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch resume";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateResume = createAsyncThunk(
  "resume/updateResume",
  async (resumeData, { getState,rejectWithValue }) => {
    console.log("update api",resumeData)
    try {
      const { user } = getState();

      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  const payload = {
  ...resumeData,
  userId: user.userInfo.userId
};


      const response = await axios.put(API_URL, payload, config);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update resume";
      return rejectWithValue(errorMessage);
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = resumeSlice.actions;
export default resumeSlice.reducer;