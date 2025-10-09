import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const withAuth = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Candidate dashboard data
export const fetchCandidateDashboard = createAsyncThunk(
  "dashboard/fetchCandidate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/candidate", {
        ...withAuth(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load dashboard");
      return {
        profile: data.profile || null,
        profileCompletion: data.profileCompletion ?? 0,
        notifications: data.notifications || [],
        jobs: data.jobs || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Employer dashboard data
export const fetchEmployerDashboard = createAsyncThunk(
  "dashboard/fetchEmployer",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/employer", {
        ...withAuth(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load dashboard");
      return {
        profile: data.profile || null,
        notifications: data.notifications || [],
        jobs: data.jobs || [],
        stats: data.stats || null, // e.g., { totalApplications, activePostings }
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    profile: null,
    profileCompletion: 0,
    notifications: [],
    jobs: [],
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDashboard: (state) => {
      state.profile = null;
      state.profileCompletion = 0;
      state.notifications = [];
      state.jobs = [];
      state.stats = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Candidate
      .addCase(fetchCandidateDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.profileCompletion = action.payload.profileCompletion;
        state.notifications = action.payload.notifications;
        state.jobs = action.payload.jobs;
        state.stats = null;
      })
      .addCase(fetchCandidateDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load candidate dashboard";
      })

      // Employer
      .addCase(fetchEmployerDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.notifications = action.payload.notifications;
        state.jobs = action.payload.jobs;
        state.stats = action.payload.stats;
        state.profileCompletion = 0;
      })
      .addCase(fetchEmployerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load employer dashboard";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
