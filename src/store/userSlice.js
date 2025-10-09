import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getStoredUserInfo = () => {
  try {
    const stored = localStorage.getItem('userInfo');
    return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredUserType = () => {
  try {
    const storedType = localStorage.getItem('userType');
    if (storedType) return storedType;
    const storedUser = localStorage.getItem('userInfo');
    return storedUser && storedUser !== 'undefined'
      ? JSON.parse(storedUser)?.role
      : null;
  } catch {
    return null;
  }
};

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[userSlice.js] fetchUserInfo Success:', response.data);
      localStorage.setItem('userInfo', JSON.stringify({
        ...response.data.user,
        token,
        employeeProfile: response.data.employeeProfile,
      }));
      localStorage.setItem('userType', response.data.user.role);
      return {
        ...response.data.user,
        token,
        employeeProfile: response.data.employeeProfile,
      };
    } catch (error) {
      console.error('[userSlice.js] fetchUserInfo Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        ...data.user,
        token: data.token,
        employeeId: data.employeeId,
      }));
      localStorage.setItem('userType', data.user.role);

      return { ...data.user, token: data.token, employeeId: data.employeeId };
    } catch (error) {
      console.error('[userSlice.js] registerUser Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ mobile, password, loginType }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password, loginType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        ...data.user,
        token: data.token,
      }));
      localStorage.setItem('userType', data.user.role);

      return { ...data.user, token: data.token };
    } catch (error) {
      console.error('[userSlice.js] loginUser Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userInfo: getStoredUserInfo(),
  userType: getStoredUserType(),
  isLoading: false,
  error: null,
  status: 'idle',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userInfo = null;
      state.userType = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userType');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        state.userType = action.payload.role;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.userInfo = null;
        state.userType = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.userType = action.payload.role;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.userType = action.payload.role;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;