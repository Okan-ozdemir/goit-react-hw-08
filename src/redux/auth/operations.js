import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://connections-api.goit.global';

// Utility to add JWT
export const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// Utility to remove JWT
const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
};

/*
 * POST @ /users/signup
 * body: { name, email, password }
 */
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      console.log('Attempting to register with:', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password ? '[HIDDEN]' : 'MISSING'
      });
      console.log('API URL:', axios.defaults.baseURL);
      
      // Prepare the request data according to GoIT API specification
      const requestData = {
        name: credentials.name.trim(),
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      };
      
      console.log('Request data being sent:', {
        name: requestData.name,
        email: requestData.email,
        password: requestData.password ? '[HIDDEN]' : 'MISSING'
      });
      
      console.log('Raw request data:', JSON.stringify(requestData, null, 2));
      console.log('Name length:', requestData.name.length);
      console.log('Name contains special chars:', /[ğüşıöçĞÜŞİÖÇ]/.test(requestData.name));
      console.log('Email format check:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestData.email));
      console.log('Password length:', requestData.password.length);
      
      const res = await axios.post('/users/signup', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Registration successful:', res.data);
      // After successful registration, add the token to the HTTP header
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      console.error('Registration API error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response',
        request: error.request ? 'Request made but no response' : 'No request was made',
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      // Handle different error formats
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let errorMessage = 'Registration failed. ';
        
        if (error.response.status === 400) {
          console.error('400 Bad Request - Response data:', error.response.data);
          console.error('400 Bad Request - Full response:', error.response);
          console.error('400 Bad Request - Request data sent:', error.config?.data);
          console.error('400 Bad Request - Request URL:', error.config?.url);
          console.error('400 Bad Request - Request method:', error.config?.method);
          
          // Show the exact error message from API
          if (error.response.data?.message) {
            console.error('API Error Message:', error.response.data.message);
            errorMessage = error.response.data.message;
          } else if (error.response.data?.error) {
            console.error('API Error:', error.response.data.error);
            errorMessage = error.response.data.error;
          } else if (error.response.data?.errors) {
            // Handle validation errors array
            const validationErrors = Object.values(error.response.data.errors).join(', ');
            console.error('API Validation Errors:', validationErrors);
            errorMessage = validationErrors;
          } else if (error.response.data?.validationErrors) {
            // Handle validation errors object
            const validationErrors = Object.values(error.response.data.validationErrors).join(', ');
            console.error('API Validation Errors:', validationErrors);
            errorMessage = validationErrors;
          } else {
            console.error('Unknown API Error - Full response data:', error.response.data);
            errorMessage = 'Invalid request data. Please check your input.';
          }
        } else if (error.response.status === 409) {
          errorMessage += 'This email is already registered.';
        } else if (error.response.data?.message) {
          errorMessage += error.response.data.message;
        } else if (error.response.data?.error?.message) {
          errorMessage += error.response.data.error.message;
        } else {
          errorMessage += 'Please check your information and try again.';
        }
        
        return thunkAPI.rejectWithValue(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        return thunkAPI.rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        return thunkAPI.rejectWithValue(error.message || 'An error occurred during registration.');
      }
    }
  }
);

/*
 * POST @ /users/login
 * body: { email, password }
 */
export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/users/login', {
        email: credentials.email,
        password: credentials.password
      });
      // After successful login, add the token to the HTTP header
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'The login or password is incorrect. Please try again.'
      );
    }
  }
);

/*
 * POST @ /users/logout
 * headers: Authorization: Bearer token
 */
export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/users/logout');
    // After a successful logout, remove the token from the HTTP header
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

/*
 * GET @ /users/current
 * headers: Authorization: Bearer token
 */
export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    // Reading the token from the state via getState()
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      console.log('No token found in state, skipping refresh');
      return thunkAPI.rejectWithValue('No token found');
    }

    try {
      setAuthHeader(persistedToken);
      const res = await axios.get('/users/current');
      console.log('User refreshed successfully:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Clear invalid token
      if (error.response && (error.response.status === 401 || error.response.status === 400)) {
        console.log('Clearing invalid token');
        clearAuthHeader();
      }
      clearAuthHeader();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Unable to refresh user. Please log in again.'
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();
      // Don't run if already refreshing
      if (auth.isRefreshing) {
        return false;
      }
      return true;
    },
  }
);
