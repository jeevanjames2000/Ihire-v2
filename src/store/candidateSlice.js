

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



// Save new candidate
export const saveCandidate = createAsyncThunk(
  "candidate/save",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { userInfo } = getState().user;
      const token = userInfo?.token;
      if (!token) throw new Error("No authentication token found");

      console.log("saveCandidate: FormData contents:", [...formData.entries()]);
      const res = await fetch("http://localhost:5000/api/candidates/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("saveCandidate: Backend error response:", { status: res.status, errorData });
        throw new Error(errorData.message || `Failed to save candidate (Status: ${res.status})`);
      }
      const responseData = await res.json();
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response data");
      }
      return responseData;
    } catch (err) {
      console.error("saveCandidate error:", { message: err.message, stack: err.stack });
      return rejectWithValue(err.message);
    }
  }
);

// Update existing candidate
export const updateCandidate = createAsyncThunk(
  "candidate/update",
  async ({ formData, user_id }, { rejectWithValue, getState }) => {
    try {
      const { userInfo } = getState().user;
      const token = userInfo?.token;
      if (!token) throw new Error("No authentication token found");

      const payload = new FormData();
      payload.append("user_id", user_id);
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val ?? "");
      });

      console.log("updateCandidate: FormData contents:", [...payload.entries()]);
      const res = await fetch(`http://localhost:5000/api/candidates/${user_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("updateCandidate: Backend error response:", { status: res.status, errorData });
        throw new Error(errorData.message || `Failed to update candidate (Status: ${res.status})`);
      }
      const responseData = await res.json();
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response data");
      }
      return responseData;
    } catch (err) {
      console.error("updateCandidate error:", { message: err.message, stack: err.stack });
      return rejectWithValue(err.message);
    }
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearCandidateMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load candidate
      .addCase(loadCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loadCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load candidate";
        state.data = null;
      })
      // Save candidate
      .addCase(saveCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(saveCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.success = "Profile saved successfully";
      })
      .addCase(saveCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save candidate";
      })
      // Update candidate
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.success = "Profile updated successfully";
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update candidate";
      });
  },
});







export const loadCandidate = createAsyncThunk(
  "candidate/loadCandidate",
  async (id, { rejectWithValue, getState }) => {
    try {
      console.log(`loadCandidate: Fetching candidate for id: ${id}`);
      const { userInfo } = getState().user;
      const response = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("loadCandidate: Backend error response:", { status: response.status, errorData });
        throw new Error(errorData.message || "Failed to load candidate");
      }
      return await response.json();
    } catch (error) {
      console.error("loadCandidate error:", error);
      return rejectWithValue(error.message);
    }
  }
);




export const { clearCandidateMessages } = candidateSlice.actions;
export default candidateSlice.reducer;