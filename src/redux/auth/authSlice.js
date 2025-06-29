import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { register, logIn, logOut, refreshUser } from './operations';

const initialState = {
  user: { name: null, email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  error: null,
};

const handleFulfilled = (state, action) => {
  console.log('Auth fulfilled:', action.type, action.payload);
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.error = null;
};

const handlePending = (state) => {
  state.isRefreshing = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isRefreshing = false;
  state.error = null; // Clear previous errors first
  
  // Ignore "No token found" error as it's expected when user is not logged in
  if (action.payload === 'No token found') {
    console.log('No token found - this is expected for new users');
    return;
  }
  
  // Handle different error formats
  if (action.payload) {
    if (typeof action.payload === 'string') {
      state.error = action.payload;
    } else if (action.payload.message) {
      state.error = action.payload.message;
    } else if (action.payload.error) {
      state.error = action.payload.error;
    } else {
      state.error = 'An error occurred. Please try again.';
    }
  } else {
    state.error = action.error?.message || 'An unknown error occurred';
  }
  console.error('Auth error:', action);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(logIn.fulfilled, handleFulfilled)
      .addCase(logOut.fulfilled, (state) => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(refreshUser.pending, handlePending)
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
      })
      .addMatcher(
        isAnyOf(register.pending, logIn.pending),
        handlePending
      )
      .addMatcher(
        isAnyOf(register.rejected, logIn.rejected, refreshUser.rejected),
        handleRejected
      ),
});

export const { clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
