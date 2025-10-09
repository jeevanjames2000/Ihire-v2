import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch header
export const fetchHeader = createAsyncThunk(
  "header/fetchHeader",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/header");
      return {
        logo: response.data.logo || { text: "Hire", color: "#1E3A8A" },
        navLinks: response.data.navLinks || [],
        actionLinks: response.data.actionLinks || [],
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
export const updateHeader = createAsyncThunk(
  "header/updateHeader",
  async (newHeader, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/header",
        newHeader,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data; // the updated header
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


const headerSlice = createSlice({
  name: "header",
  initialState: {
    data: {
      logo: { text: "Hire", color: "#1E3A8A" },
      navLinks: [],
      actionLinks: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Header
      .addCase(fetchHeader.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHeader.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchHeader.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Header
      .addCase(updateHeader.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateHeader.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateHeader.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default headerSlice.reducer;



