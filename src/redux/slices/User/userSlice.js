import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile, resetUserPassword } from '../../../api/User_API/user/user-api';

// Async Thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetch failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      return await updateUserProfile(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

// ✅ Reset Password Thunk
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await resetUserPassword({ currentPassword, newPassword });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Reset password failed');
    }
  }
);

// Initial State
const initialState = {
  profile: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully!';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || 'Password reset successful!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserMessages } = userSlice.actions;
export default userSlice.reducer;

