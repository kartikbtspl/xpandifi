import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserProfile,
  updateUserProfile,
  resetUserPassword,
  fetchUserAPI
} from "../../../api/admin/user-api/user-api";

const initialState = {
  admin: null,               
  profile: null,            
  loading: false,           
  status: "idle",           
  error: null,              
  successMessage: null,    
};


export const fetchAdmin = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      return await fetchUserAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      return await updateUserProfile(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

//  Reset Password Thunk
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await resetUserPassword({
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reset password failed");
    }
  }
);
const userAdminSlice = createSlice({
  name: "user",

  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user
      .addCase(fetchAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

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
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload?.message || "Password reset successful!";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userAdminSlice.actions;
export default userAdminSlice.reducer;
