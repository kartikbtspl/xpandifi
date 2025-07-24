import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createCampaignAPI,
  getCampaignsAPI,
  toggleCampaignStatusAPI,
  deleteCampaignAPI,
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
        console.error("No campaigns found.");
      }
      return response;
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const toggleCampaignStatus = createAsyncThunk(
  "campaign/toggleCampaignStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await toggleCampaignStatusAPI(id, status);
      toast.success(response.message || "Status updated successfully!");
      return { id, status };
    } catch (error) {
      toast.error("Failed to update status");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "campaign/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCampaignAPI(id);
      toast.success("Campaign deleted successfully!");
      return id; // return id or confirmation
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete campaign");
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete campaign"
      );
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
        const index = state.campaigns.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.campaigns[index].status = action.payload.status;
        }
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted campaign from the list immediately
        // Check if campaigns is an object with data property or an array
        if (state.campaigns?.data) {
          // If campaigns has a data property (object structure)
          state.campaigns.data = state.campaigns.data.filter((campaign) => {
            const campaignId = campaign._id || campaign.id || campaign.campaignId;
            return campaignId !== action.payload;
          });
        } else if (Array.isArray(state.campaigns)) {
          // If campaigns is directly an array
          state.campaigns = state.campaigns.filter((campaign) => {
            const campaignId = campaign._id || campaign.id || campaign.campaignId;
            return campaignId !== action.payload;
          });
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default campaignSlice.reducer;
