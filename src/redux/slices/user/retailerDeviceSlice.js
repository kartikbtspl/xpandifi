import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
getAllDevicesAPI
} from "../../../api/user/terminal/device";

// 📌 Fetch all requests
export const fetchDevices = createAsyncThunk(
  "terminal/fetchDevicess",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllDevicesAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




// ================= SLICE ==================
const retailerDeviceSlice = createSlice({
  name: "device",
  initialState: {
    devices: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📌 Fetch Requests
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload || [];
        state.fetched = true;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch devices";
      })


      

  },
});

export default retailerDeviceSlice.reducer;
