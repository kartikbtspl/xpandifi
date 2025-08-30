import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRetailerCampaigns } from '../../../api/user/retailer/retailer-campaign-api';

// Async thunk to fetch approved campaigns
export const fetchApprovedCampaigns = createAsyncThunk(
  'approvedCampaigns/fetchApprovedCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRetailerCampaigns();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch approved campaigns');
    }
  }
);
const approvedCampaignSlice = createSlice({
  name: 'approvedCampaigns',
  initialState: {
    campaigns: [],
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload || [];
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
      state.fetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.fetched = true;
      })
      .addCase(fetchApprovedCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true;
      });
  },
});

export const { setCampaigns, clearCampaigns } = approvedCampaignSlice.actions;
export default approvedCampaignSlice.reducer;