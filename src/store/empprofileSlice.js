import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  employee: {
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    location: '',
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    resume: null,
  },
  loading: false,
  error: null,
};

// Axios instance with auth header
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Fetch employee profile by ID
export const fetchEmployee = createAsyncThunk(
  'employee/fetchEmployee',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      if (!userInfo) throw new Error('No user information found');
      if (userType !== 'employer' && userType !== 'job_seeker') throw new Error('Unauthorized access');
      if (!id || isNaN(Number(id))) throw new Error(`Invalid employee ID: ${id}`);
      console.log('Fetching employee with ID:', id, 'Token:', localStorage.getItem('token'), 'UserType:', userType);
      const res = await axiosInstance.get(`/employees/${id}`);
      console.log('Fetch employee response:', res.data);
      return {
        fullName: res.data.employee?.full_name || '',
        email: res.data.employee?.email || '',
        phone: res.data.employee?.phone || '',
        gender: res.data.employee?.gender || '',
        dob: res.data.employee?.dob || '',
        location: res.data.employee?.location || '',
        resume: res.data.employee?.resume ? { name: res.data.employee.resume } : null,
        skills: res.data.skills?.map((s) => s.skill) || [],
        education: res.data.education || [],
        experience: res.data.experience || [],
        certifications: res.data.certifications?.map((c) => c.cert_name) || [],
      };
    } catch (err) {
      const errorMessage =
        err.response?.status === 401 ? 'Your session has expired. Please log in again.' :
        err.response?.status === 403 ? 'You do not have permission to access this profile.' :
        err.response?.status === 404 ? `Employee not found for ID: ${id}` :
        err.response?.data?.error || err.message || 'Failed to fetch employee profile';
      console.error('Fetch employee error:', err.response?.data || err.message, 'Status:', err.response?.status);
      return rejectWithValue(errorMessage);
    }
  }
);
// export const saveEmployee = createAsyncThunk(
//   'employee/saveEmployee',
//   async (data, { getState, rejectWithValue }) => {
//     let id;
//     try {
//       const { user: { userInfo, userType } } = getState();
//       if (!userInfo) throw new Error('No user information found');
//       if (userType !== 'job_seeker' && userType !== 'employer') throw new Error('Unauthorized access');

//       id = data.employeeId || userInfo.id;
//       console.log('Saving employee with ID:', id, 'Data:', data, 'UserInfo:', userInfo, 'UserType:', userType);

//       if (!id || isNaN(Number(id))) throw new Error(`Invalid employee ID: ${id}`);

//       let res;
//       try {
//         console.log('Updating employee with PUT request to:', `/employees/${id}`);
//         res = await axiosInstance.put(`/employees/${id}`, data);
//         console.log('Update response:', res.data);
//         return { employeeId: id, ...res.data };
//       } catch (err) {
//         if (err.response?.status === 404) {
//           console.log('Employee not found, creating new employee with POST request');
//           try {
//             res = await axiosInstance.post('/employees', { ...data, employeeId: id, userId: userInfo.id });
//             console.log('Create response:', res.data);
//             return { employeeId: id, ...res.data };
//           } catch (postErr) {
//             if (postErr.response?.status === 400 && postErr.response?.data?.error.includes('Email already exists')) {
//               console.error('Email conflict detected:', data.email);
//               // Attempt to update the existing employee with the same email
//               try {
//                 res = await axiosInstance.put(`/employees/email/${data.email}`, data);
//                 console.log('Update response for existing employee:', res.data);
//                 return { employeeId: res.data.employeeId, ...res.data };
//               } catch (updateErr) {
//                 throw new Error('Email already exists. Please use a different email or contact support.');
//               }
//             }
//             throw postErr;
//           }
//         }
//         throw err;
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.status === 401 ? 'Your session has expired. Please log in again.' :
//         err.response?.status === 403 ? 'You do not have permission to update this profile.' :
//         err.response?.status === 404 ? `Employee not found for ID: ${id || 'unknown'}` :
//         err.response?.data?.error || err.message || 'Failed to save employee profile';
//       console.error('Save employee error:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         id: id || 'undefined',
//         data,
//       });
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const saveEmployee = createAsyncThunk(
//   'employee/saveEmployee',
//   async (data, { getState, rejectWithValue }) => {
//     let id; // Declare id outside try block
//     try {
//       const { user: { userInfo, userType } } = getState();
//       if (!userInfo) throw new Error('No user information found');
//       if (userType !== 'job_seeker' && userType !== 'employer') throw new Error('Unauthorized access');

//       id = data.employeeId || userInfo.id; // Assign id here
//       console.log('Saving employee with ID:', id, 'Data:', data, 'UserInfo:', userInfo, 'UserType:', userType);

//       if (!id || isNaN(Number(id))) throw new Error(`Invalid employee ID: ${id}`);

//       let res;
//       try {
//         console.log('Updating employee with PUT request to:', `/employees/${id}`);
//         res = await axiosInstance.put(`/employees/${id}`, data);
//         console.log('Update response:', res.data);
//         return { employeeId: id, ...res.data };
//       } catch (err) {
//         if (err.response?.status === 404) {
//           console.log('Employee not found, creating new employee with POST request');
//           res = await axiosInstance.post('/employees', { ...data, employeeId: id });
//           console.log('Create response:', res.data);
//           return { employeeId: id, ...res.data };
//         }
//         throw err; // Rethrow other errors
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.status === 401 ? 'Your session has expired. Please log in again.' :
//         err.response?.status === 403 ? 'You do not have permission to update this profile.' :
//         err.response?.status === 404 ? `Employee not found for ID: ${id || 'unknown'}` :
//         err.response?.data?.error || err.message || 'Failed to save employee profile';
//       console.error('Save employee error:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         id: id || 'undefined',
//         data,
//       });
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// export const saveEmployee = createAsyncThunk(
//   'employee/saveEmployee',
//   async (data, { getState, rejectWithValue }) => {
//     try {
//       const { user: { userInfo, userType } } = getState();
//       if (!userInfo) throw new Error('No user information found');
//       if (userType !== 'job_seeker' && userType !== 'employer') throw new Error('Unauthorized access');

//       const id = data.employeeId || userInfo.id;
//       console.log('Saving employee with ID:', id, 'Data:', data, 'UserInfo:', userInfo, 'UserType:', userType);

//       if (!id || isNaN(Number(id))) throw new Error(`Invalid employee ID: ${id}`);

//       let res;
//       if (id) {
//         console.log('Updating employee with PUT request to:', `/employees/${id}`);
//         res = await axiosInstance.put(`/employees/${id}`, data);
//         console.log('Update response:', res.data);
//         return { employeeId: id, ...res.data };
//       } else {
//         console.log('Creating new employee with POST request');
//         res = await axiosInstance.post('/employees', data);
//         console.log('Create response:', res.data);
//         return { employeeId: res.data.employeeId, ...data };
//       }
//     } catch (err) {
//       const errorMessage =
//         err.response?.status === 401 ? 'Your session has expired. Please log in again.' :
//         err.response?.status === 403 ? 'You do not have permission to update this profile.' :
//         err.response?.status === 404 ? `Employee not found for ID: ${id}` :
//         err.response?.data?.error || err.message || 'Failed to save employee profile';
//       console.error('Save employee error:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         id,
//         data,
//       });
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// Upload resume
export const uploadResume = createAsyncThunk(
  'employee/uploadResume',
  async ({ employeeId, file }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      const formData = new FormData();
      formData.append('resume', file);
      const res = await axiosInstance.post(`/employees/upload-resume/${employeeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { name: res.data.filePath };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to upload resume';
      console.error('Upload resume error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Add skill
export const addEmployeeSkill = createAsyncThunk(
  'employee/addSkill',
  async ({ employeeId, skill }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!skill) throw new Error('Skill cannot be empty');
      await axiosInstance.post(`/employees/${employeeId}/skills`, { skill });
      return skill;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add skill';
      console.error('Add skill error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove skill
export const removeEmployeeSkill = createAsyncThunk(
  'employee/removeSkill',
  async ({ employeeId, skill }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!skill) throw new Error('Skill cannot be empty');
      await axiosInstance.delete(`/employees/${employeeId}/skills/${encodeURIComponent(skill)}`);
      return skill;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to remove skill';
      console.error('Remove skill error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Add education
export const addEmployeeEducation = createAsyncThunk(
  'employee/addEducation',
  async ({ employeeId, education }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!education || !education.degree || !education.institution) throw new Error('Invalid education data');
      const res = await axiosInstance.post(`/employees/${employeeId}/education`, education);
      return { id: res.data.educationId, ...education };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add education';
      console.error('Add education error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove education
export const removeEmployeeEducation = createAsyncThunk(
  'employee/removeEducation',
  async ({ employeeId, educationId }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!educationId || isNaN(Number(educationId))) throw new Error('Invalid education ID');
      await axiosInstance.delete(`/employees/${employeeId}/education/${educationId}`);
      return educationId;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to remove education';
      console.error('Remove education error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Add experience
export const addEmployeeExperience = createAsyncThunk(
  'employee/addExperience',
  async ({ employeeId, experience }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!experience || !experience.title || !experience.company) throw new Error('Invalid experience data');
      const res = await axiosInstance.post(`/employees/${employeeId}/experience`, experience);
      return { id: res.data.experienceId, ...experience };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add experience';
      console.error('Add experience error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove experience
export const removeEmployeeExperience = createAsyncThunk(
  'employee/removeExperience',
  async ({ employeeId, experienceId }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!experienceId || isNaN(Number(experienceId))) throw new Error('Invalid experience ID');
      await axiosInstance.delete(`/employees/${employeeId}/experience/${experienceId}`);
      return experienceId;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to remove experience';
      console.error('Remove experience error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Add certification
export const addEmployeeCertification = createAsyncThunk(
  'employee/addCertification',
  async ({ employeeId, cert_name, organization, issue_date }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!cert_name || !organization) throw new Error('Invalid certification data');
      const res = await axiosInstance.post(`/employees/${employeeId}/certifications`, {
        cert_name,
        organization,
        issue_date,
      });
      return { id: res.data.certificationId, cert_name };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add certification';
      console.error('Add certification error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove certification
export const removeEmployeeCertification = createAsyncThunk(
  'employee/removeCertification',
  async ({ employeeId, cert_name }, { rejectWithValue }) => {
    try {
      if (!employeeId || isNaN(Number(employeeId))) throw new Error('Invalid employee ID');
      if (!cert_name) throw new Error('Certification name cannot be empty');
      await axiosInstance.delete(`/employees/${employeeId}/certifications/${encodeURIComponent(cert_name)}`);
      return cert_name;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to remove certification';
      console.error('Remove certification error:', err.response?.data || err.message);
      return rejectWithValue(errorMessage);
    }
  }
);

const empprofileSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.employee[field] = value;
    },
    setResume: (state, action) => {
      state.employee.resume = action.payload;
    },
    resetProfile: (state) => {
      state.employee = initialState.employee;
      state.error = null;
    },
    setAllFields: (state, action) => {
      state.employee = { ...state.employee, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(saveEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.employee.resume = action.payload;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployeeSkill.fulfilled, (state, action) => {
        state.employee.skills.push(action.payload);
      })
      .addCase(addEmployeeSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeEmployeeSkill.fulfilled, (state, action) => {
        state.employee.skills = state.employee.skills.filter((skill) => skill !== action.payload);
      })
      .addCase(removeEmployeeSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addEmployeeEducation.fulfilled, (state, action) => {
        state.employee.education.push(action.payload);
      })
      .addCase(addEmployeeEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeEmployeeEducation.fulfilled, (state, action) => {
        state.employee.education = state.employee.education.filter((edu) => edu.id !== action.payload);
      })
      .addCase(removeEmployeeEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addEmployeeExperience.fulfilled, (state, action) => {
        state.employee.experience.push(action.payload);
      })
      .addCase(addEmployeeExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeEmployeeExperience.fulfilled, (state, action) => {
        state.employee.experience = state.employee.experience.filter((exp) => exp.id !== action.payload);
      })
      .addCase(removeEmployeeExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addEmployeeCertification.fulfilled, (state, action) => {
        state.employee.certifications.push(action.payload.cert_name);
      })
      .addCase(addEmployeeCertification.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeEmployeeCertification.fulfilled, (state, action) => {
        state.employee.certifications = state.employee.certifications.filter((cert) => cert !== action.payload);
      })
      .addCase(removeEmployeeCertification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});



// Thunk to Save Employee
export const saveEmployee = createAsyncThunk(
  "employee/saveEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const { id, ...data } = employeeData;
      let response;

      // Check if employee ID exists
      if (id) {
        console.log(`Updating employee with PUT request to: /employees/${id}`);
        response = await axios.put(`/employees/${id}`, data);
      } else {
        console.log("Creating new employee with POST request");
        // Pre-check email uniqueness
        const emailCheck = await axios.get(`/employees/check-email?email=${data.email}`);
        if (emailCheck.data.exists) {
          throw new Error("Email already exists. Please use a different email or contact support.");
        }
        response = await axios.post("/employees", data);
      }

      return response.data;
    } catch (error) {
      console.log("Save employee error:", error.response?.data || error.message);
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);





export const { updateField, setResume, resetProfile, setAllFields } = empprofileSlice.actions;
export default empprofileSlice.reducer;