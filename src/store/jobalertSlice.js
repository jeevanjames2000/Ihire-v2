// store/jobalertSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/jobalerts";

// Fetch all job alerts
export const fetchJobAlerts = createAsyncThunk(
  "jobalerts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch job alerts");
    }
  }
);

// Add a new job alert
export const addJobAlert = createAsyncThunk(
  "jobalerts/add",
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE, alertData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add job alert");
    }
  }
);

// Update existing alert
export const updateJobAlert = createAsyncThunk(
  "jobalerts/update",
  async ({ id, alertData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, alertData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job alert");
    }
  }
);

// Delete alert
export const deleteJobAlert = createAsyncThunk(
  "jobalerts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job alert");
    }
  }
);

const jobalertSlice = createSlice({
  name: "jobalerts",
  initialState: {
    alerts: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearJobAlertMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchJobAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchJobAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts.push(action.payload);
        state.success = "Job alert created successfully";
      })
      .addCase(addJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.alerts[index] = action.payload;
        state.success = "Job alert updated successfully";
      })
      .addCase(updateJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = state.alerts.filter((a) => a.id !== action.payload);
        state.success = "Job alert deleted successfully";
      })
      .addCase(deleteJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobAlertMessages } = jobalertSlice.actions;
export default jobalertSlice.reducer;
