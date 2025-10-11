import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with optional auth token
const axiosAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  });

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const axiosInstance = token ? axiosAuth(token) : axios;

      const res = await axiosInstance.get('/categories/getCategories');
      console.log("res",res)
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching categories');
    }
  }
);

// Fetch subcategories based on category name
export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async (categoryName, { getState, rejectWithValue }) => {
    try {
      if (!categoryName) return rejectWithValue('Invalid category name');

      const { user } = getState();
      console.log("user",user)
      const token = user.userInfo?.token || localStorage.getItem('token');
      console.log("token",token)
      const axiosInstance = token ? axiosAuth(token) : axios;
console.log("axios",axiosInstance)
      const res = await axiosInstance.get('/subcategories', {
        params: { category_name: categoryName },
      });
console.log("res",res )
      return Array.isArray(res.data.subcategories) ? res.data.subcategories : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching subcategories');
    }
  }
);

// Fetch skills
export const fetchSkills = createAsyncThunk(
  'categories/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/skills');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching skills');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    subcategories: [],
    skills: [],              // ✅ initialize skills here
    status: 'idle',          // for categories
    subcategoriesStatus: 'idle',
    skillsStatus: 'idle',    // separate status for skills
    error: null,             // categories error
    subcategoriesError: null,
    skillsError: null,       // separate error for skills
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    resetSubcategories: (state) => {
      state.subcategories = [];
      state.subcategoriesStatus = 'idle';
      state.subcategoriesError = null;
    },
    resetSkills: (state) => {
      state.skills = [];
      state.skillsStatus = 'idle';
      state.skillsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.subcategoriesStatus = 'loading';
        state.subcategoriesError = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategoriesStatus = 'succeeded';
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.subcategoriesStatus = 'failed';
        state.subcategoriesError = action.payload;
      })
      // Skills
      .addCase(fetchSkills.pending, (state) => {
        state.skillsStatus = 'loading';
        state.skillsError = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skillsStatus = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.skillsStatus = 'failed';
        state.skillsError = action.payload;
      });
  },
});

export const { addCategory, resetSubcategories, resetSkills } = categoriesSlice.actions;
export default categoriesSlice.reducer;
