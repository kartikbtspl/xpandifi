import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllRequestAPI,
  createRequestAPI,
  updateRequestAPI,
  deleteRequestAPI,
} from "../../../api/user/terminal/device";

// 📌 Fetch all requests
export const fetchRequest = createAsyncThunk(
  "terminal/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllRequestAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📌 Create request
export const createRequest = createAsyncThunk(
  "terminal/createRequest",
  async (data, { rejectWithValue }) => {
    try {
      return await createRequestAPI(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📌 Update request
export const updateRequest = createAsyncThunk(
  "terminal/updateRequest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateRequestAPI(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📌 Delete request
export const deleteRequest = createAsyncThunk(
  "terminal/deleteRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteRequestAPI(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ================= SLICE ==================
const terminalSlice = createSlice({
  name: "terminal",
  initialState: {
    deviceRequest: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📌 Fetch Requests
      .addCase(fetchRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceRequest = action.payload || [];
        state.fetched = true;
      })
      .addCase(fetchRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch requests";
      })

      // 📌 Create Request
      .addCase(createRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.formLoading = false;
        state.deviceRequest.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to create request";
      })

      // 📌 Update Request
      .addCase(updateRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.formLoading = false;
        const updated = action.payload;
        const index = state.deviceRequest.findIndex((r) => r.id === updated.id);
        if (index !== -1) {
          state.deviceRequest[index] = updated;
        }
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to update request";
      })

      // 📌 Delete Request
      .addCase(deleteRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.formLoading = false;
        const deletedId = action.meta.arg;
        state.deviceRequest = state.deviceRequest.filter(
          (r) => r.id !== deletedId
        );
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to delete request";
      });
  },
});

export default terminalSlice.reducer;
