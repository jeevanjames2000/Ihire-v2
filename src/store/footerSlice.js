import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define all mappings in one place
const linkPaths = {
  "Browse Jobs": "/jobs",
  "Browse Categories": "/categories",
  "Candidate Dashboard": "/dashboard",
  "Browse Candidates": "/candidates",
  "Employer Dashboard": "/empdashboard",
  "Add Job": "/empostind",
  "About Us": "/about",
  "Job Page Invoice": "/invoice",
  "Terms Page": "/terms",
  "Blog": "/blog",
};

export const fetchFooter = createAsyncThunk("footer/fetchFooter", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:5000/api/footer");
    const rawData = response.data.data || {};

    // Transform DB data into usable frontend data
    const transformLinks = (arr) =>
      (arr || []).map((item) =>
        typeof item === "string"
          ? { name: item, path: linkPaths[item] || "#" }
          : { name: item.name, path: item.path || "#" }
      );

    return {
      cta: {
        title: "Find the Right Job for You",
        subtitle: "Thousands of jobs from top companies are waiting",
        ctaText: "Get Started",
        ctaLink: "/jobsearch",
      },
      companyInfo: {
        phone: "+91 9876543210",
        address: "Kozhikode, Kerala, India",
        email: "support@ihire.com",
      },
      sections: Object.fromEntries(
        Object.entries(rawData).map(([section, links]) => [
          section,
          transformLinks(links),
        ])
      ),
      bottomLinks: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Help Center", path: "/help" },
      ],
    };
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch footer data");
  }
});

const footerSlice = createSlice({
  name: "footer",
  initialState: { data: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFooter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFooter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export default footerSlice.reducer;