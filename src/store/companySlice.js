import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/companies";

export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      console.log("Fetching profile with token:", token);
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile response:", res.data);
      return res.data;
    } catch (err) {
      console.error("Profile fetch error:", err.response?.data);
      if (err.response?.status === 404) {
        return rejectWithValue(null); // No profile exists
      }
      if (err.response?.status === 401) {
        return rejectWithValue("Invalid or expired token");
      }
      if (err.response?.status === 403) {
        return rejectWithValue("Only employers can access company profiles");
      }
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch company profile"
      );
    }
  }
);


export const saveCompanyProfile = createAsyncThunk(
  "company/saveProfile",
  async ({ formData, documentTypes }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return rejectWithValue("No authentication token found");
      }
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "socialLinks") {
          submissionData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] && key !== "documents" && key !== "logo") {
          submissionData.append(key, formData[key]);
        }
      });
      if (formData.logo) {
        submissionData.append("logo", formData.logo);
      }
      formData.documents?.forEach((doc, index) => {
        if (doc) {
          submissionData.append("documents", doc);
        }
      });
      // Ensure documentTypes is always a valid array
      const validDocumentTypes = Array.isArray(documentTypes) ? documentTypes : [];
      console.log("Raw documentTypes:", documentTypes);
      console.log("Processed documentTypes:", validDocumentTypes);
      submissionData.append("documentTypes", JSON.stringify(validDocumentTypes));

      console.log("Submitting FormData:", Object.fromEntries(submissionData));
      console.log("Authorization header:", `Bearer ${token}`);

      const res = await axios.post(API_URL, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const profileRes = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...res.data, profile: profileRes.data };
    } catch (err) {
      console.error("Save profile error:", err.response?.data);
      return rejectWithValue(
        err.response?.data?.error || "Failed to save company profile"
      );
    }
  }
);


const companySlice = createSlice({
  name: "company",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    clearCompanySuccess: (state) => {
      state.success = false;
    },
    resetCompanyState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.success = true;
      })
      .addCase(saveCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCompanyError, clearCompanySuccess, resetCompanyState } =
  companySlice.actions;
export default companySlice.reducer;