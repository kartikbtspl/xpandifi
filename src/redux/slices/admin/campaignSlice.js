import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCampaignAPI,
  getCampaignsAPI,
  toggleCampaignStatusAPI,
  campaignApprovalApi,
} from "../../../api/admin/campaign-api/campaignService";
import { createSelector } from "@reduxjs/toolkit";
import Toast from "../../../components/ui/toast/Toast";

export const selectSortedCampaigns = createSelector(
  (state) => state.campaign.campaigns,
  (campaigns) =>
    [...campaigns].sort((a, b) => {
      const updatedDiff = new Date(b.updatedAt) - new Date(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
);

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(data);
      return response;
    } catch (error) {
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
        Toast.info("No campaigns found.");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const campaignApproval = createAsyncThunk(
  "campaign/campaignApproval",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const payload = { isApproved: status };
      if (status === "REJECT" && remark) {
        payload.remark = remark;
      }

      await campaignApprovalApi(id, payload);
      if (status === "APPROVE") {
        Toast.success("Campaign approved successfully!");
      } else {
        Toast.info("Campaign rejected.");
      }

      return { id, status, remark };
    } catch (error) {
      console.error("Approval request failed:", error);
      Toast.error("Failed to update status");

      return rejectWithValue(error?.response?.data || "Request failed");
    }
  }
);

export const toggleCampaignStatus = createAsyncThunk(
  "campaign/toggleCampaignStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      //  Always send plain boolean wrapped in { status: boolean }
      const responseData = await toggleCampaignStatusAPI(id, { status });

      // Get updated value from backend response (fallback to original status)
      const updatedStatus = responseData?.data?.status ?? status;
      if(status===true){
        Toast.success("Campaign activated successfully!")
      }

      return { id, status: updatedStatus };
    } catch (error) {
      console.error("Status toggle failed:", error);
      Toast.error(error?.message||"Failed to update status");


      return rejectWithValue(error?.response?.data || "Request failed");
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    loading: false,
    error: null,
    data: null, // single campaign (created or updated)
    campaigns: [], // list of campaigns
    fetched: false, // tracks if campaigns have been fetched successfully
  },
  reducers: {
    resetCampaigns: (state) => {
      state.campaigns = [];
      state.loading = false;
      state.error = null;
      state.fetched = false;
      state.data = null;
    },
  },
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
        state.fetched = true;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true;
      })

      .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.campaigns.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.campaigns[index].isActive = Boolean(status);
        }
      })

      .addCase(campaignApproval.fulfilled, (state, action) => {
        const { id, status, remark } = action.payload;
        const updatedStatus = status === "APPROVE" ? "APPROVED" : "REJECTED";
        const campaign = state.campaigns.find((c) => c.id === id);
        if (campaign) {
          campaign.isApproved = updatedStatus;
          if (remark) campaign.remark = remark;
        }
      });
  },
});

export const { resetCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer;
