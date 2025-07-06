import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createCampaignAPI,
  getCampaignsAPI,
  toggleCampaignStatusAPI
} from "../../api/campaign-api/campaignService";

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(data);
      toast.success("Campaign created successfully!");
      return response;
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "An error occurred while creating the campaign."
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignsAPI();
    
        if (response.length === 0) {
            toast.info("No campaigns found.");
        } else {
            toast.success("Campaigns fetched successfully!");
        }
      return response;
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
      return rejectWithValue(error.response?.data);
    }
  }
);
export const toggleCampaignStatus = createAsyncThunk(
  'campaign/toggleCampaignStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleCampaignStatusAPI(id, status);
      toast.success(response.message || 'Status updated successfully!');
      return { id, status };
    } catch (error) {
      toast.error('Failed to update status');
      return rejectWithValue(error.response?.data);
    }
  }
);


const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    loading: false,
    error: null,
    data: null,
    campaigns: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index].status = action.payload.status;
        }
      });
  },
});

export default campaignSlice.reducer;
