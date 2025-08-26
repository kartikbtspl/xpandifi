import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createCampaignAPI,
  getCampaignsAPI,
  updateUserCampaign,
  deleteCampaignAPI,
} from "../../../api/User_API/campaign-api/campaignService";

// Thunks

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
      return response;
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateCampaign = createAsyncThunk(
  "campaign/updateCampaign",
  async ({ id, data, oldImages = [], oldVideos = [] }, { rejectWithValue }) => {
    try {
      const response = await updateUserCampaign(id, data, oldImages, oldVideos);
      toast.success("Campaign updated successfully!");
      return response;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update campaign");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteCampaign = createAsyncThunk(
  "campaign/deleteCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCampaignAPI(id);
      toast.success("Campaign deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete campaign");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Slice

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    loading: false,
    error: null,
    data: null,
    campaigns: [],
    fetched: false, // <-- fetched flag added
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
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

      // Fetch
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.fetched = true; // <-- set fetched true on success
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true; // <-- reset fetched on failure
      })

      // Update
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        const updated = action.payload;
        const index = state.campaigns.findIndex(
          (c) => c._id === updated._id || c.id === updated.id
        );
        if (index !== -1) {
          state.campaigns[index] = updated;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = state.campaigns.filter((campaign) => {
          const campaignId = campaign._id || campaign.id || campaign.campaignId;
          return campaignId !== action.payload;
        });
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default campaignSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import {
//   createCampaignAPI,
//   getCampaignsAPI,
//   updateUserCampaign,
//   deleteCampaignAPI,
// } from "../../api/campaign-api/campaignService";

// export const createCampaign = createAsyncThunk(
//   "campaign/createCampaign",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createCampaignAPI(data);
//       toast.success("Campaign created successfully!");
//       return response;
//     } catch (error) {
//       toast.error(
//         error.response?.data?.errors?.[0]?.message ||
//           error.response?.data?.message ||
//           "An error occurred while creating the campaign."
//       );
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const fetchCampaigns = createAsyncThunk(
//   "campaign/fetchCampaigns",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getCampaignsAPI();
//       return response;
//     } catch (error) {
//       toast.error("Failed to fetch campaigns.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const updateCampaign = createAsyncThunk(
//   "campaign/updateCampaign",
//   async ({ id, data, oldImages = [], oldVideos = [] }, { rejectWithValue }) => {
//     try {
//       const response = await updateUserCampaign(id, data, oldImages, oldVideos);
//       toast.success("Campaign updated successfully!");
//       return response;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update campaign");
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// export const deleteCampaign = createAsyncThunk(
//   "campaign/deleteCampaign",
//   async (id, { rejectWithValue }) => {
//     try {
//       await deleteCampaignAPI(id);
//       toast.success("Campaign deleted successfully!");
//       return id;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete campaign");
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// const campaignSlice = createSlice({
//   name: "campaign",
//   initialState: {
//     loading: false,
//     error: null,
//     data: null,
//     campaigns: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Create campaign
//       .addCase(createCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(createCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch campaigns
//       .addCase(fetchCampaigns.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCampaigns.fulfilled, (state, action) => {
//         state.loading = false;
//         state.campaigns = action.payload;
//       })
//       .addCase(fetchCampaigns.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update campaign
//       .addCase(updateCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//         if (state.campaigns?.length) {
//           const index = state.campaigns.findIndex(
//             (c) => c._id === action.payload._id || c.id === action.payload.id
//           );
//           if (index !== -1) {
//             state.campaigns[index] = action.payload;
//           }
//         }
//       })
//       .addCase(updateCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete campaign
//       .addCase(deleteCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         if (Array.isArray(state.campaigns)) {
//           state.campaigns = state.campaigns.filter((campaign) => {
//             const campaignId = campaign._id || campaign.id || campaign.campaignId;
//             return campaignId !== action.payload;
//           });
//         }
//       })
//       .addCase(deleteCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default campaignSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import {
//   createCampaignAPI,
//   getCampaignsAPI,
//   updateUserCampaign,
//   deleteCampaignAPI,
// } from "../../api/campaign-api/campaignService";

// export const createCampaign = createAsyncThunk(
//   "campaign/createCampaign",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createCampaignAPI(data);
//       toast.success("Campaign created successfully!");
//       return response;
//     } catch (error) {
//       toast.error(
//         error.response?.data?.errors?.[0]?.message ||
//           error.response?.data?.message ||
//           "An error occurred while creating the campaign."
//       );
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const fetchCampaigns = createAsyncThunk(
//   "campaign/fetchCampaigns",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getCampaignsAPI();
//       if (!response || (Array.isArray(response) && response.length === 0)) {
//         console.error("No campaigns found.");
//       }
//       return response;
//     } catch (error) {
//       toast.error("Failed to fetch campaigns.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const updateCampaign = createAsyncThunk(
//   "campaign/updateCampaign",
//   async ({ id, data, oldImages = [], oldVideos = [] }, { rejectWithValue }) => {
//     try {
//       const response = await updateUserCampaign(id, data, oldImages, oldVideos);
//       toast.success("Campaign updated successfully!");
//       return response;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update campaign");
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// export const deleteCampaign = createAsyncThunk(
//   "campaign/deleteCampaign",
//   async (id, { rejectWithValue }) => {
//     try {
//       await deleteCampaignAPI(id);
//       toast.success("Campaign deleted successfully!");
//       return id;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete campaign");
//       return rejectWithValue(err.response?.data);
//     }
//   }
// );

// const campaignSlice = createSlice({
//   name: "campaign",
//   initialState: {
//     loading: false,
//     error: null,
//     data: null,
//     campaigns: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Create campaign
//       .addCase(createCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(createCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch campaigns
//       .addCase(fetchCampaigns.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCampaigns.fulfilled, (state, action) => {
//         state.loading = false;
//         state.campaigns = action.payload;
//       })
//       .addCase(fetchCampaigns.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update campaign
//       .addCase(updateCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//         // Optionally update campaigns list if needed:
//         if (state.campaigns?.length) {
//           const index = state.campaigns.findIndex(
//             (c) => c._id === action.payload._id || c.id === action.payload.id
//           );
//           if (index !== -1) {
//             state.campaigns[index] = action.payload;
//           }
//         }
//       })
//       .addCase(updateCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Delete campaign
//       .addCase(deleteCampaign.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteCampaign.fulfilled, (state, action) => {
//         state.loading = false;
//         if (Array.isArray(state.campaigns)) {
//           state.campaigns = state.campaigns.filter((campaign) => {
//             const campaignId = campaign._id || campaign.id || campaign.campaignId;
//             return campaignId !== action.payload;
//           });
//         }
//       })
//       .addCase(deleteCampaign.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default campaignSlice.reducer;



// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { toast } from "react-toastify";
// // import {
// //   createCampaignAPI,
// //   getCampaignsAPI,
// //   deleteCampaignAPI,
// // } from "../../api/campaign-api/campaignService";
// // // import{  toggleCampaignStatusAPI,
// // // } from '../../api/campaign-api/targetingOptionService'

// // export const createCampaign = createAsyncThunk(
// //   "campaign/createCampaign",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       console.log(data)
// //       const response = await createCampaignAPI(data);
// //       toast.success("Campaign created successfully!");
// //       return response;
// //     } catch (error) {
// //       toast.error(
// //         error.response?.data?.errors?.[0]?.message ||
// //           error.response?.data?.message ||
// //           "An error occurred while creating the campaign."
// //       );
// //       return rejectWithValue(error.response?.data);
// //     }
// //   }
// // );

// // export const fetchCampaigns = createAsyncThunk(
// //   "campaign/fetchCampaigns",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await getCampaignsAPI();

// //       if (response.length === 0) {
// //         console.error("No campaigns found.");
// //       }
// //       return response;
// //     } catch (error) {
// //       toast.error("Failed to fetch campaigns.");
// //       return rejectWithValue(error.response?.data);
// //     }
// //   }
// // );


// // export const updateCampaign = createAsyncThunk(
// //   'campaign/update',
// //   async ({ id, data,oldImages }, { rejectWithValue }) => {
// //     try {
// //       const response = await updateUserCampaign(id , data, oldImages);
// //       return response.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || 'Failed to update campaign');
// //     }
// //   }
// // );

// // // export const toggleCampaignStatus = createAsyncThunk(
// // //   "campaign/toggleCampaignStatus",
// // //   async ({ id, status }, { rejectWithValue }) => {
// // //     try {
// // //       const response = await toggleCampaignStatusAPI(id, status);
// // //       toast.success(response.message || "Status updated successfully!");
// // //       return { id, status };
// // //     } catch (error) {
// // //       toast.error("Failed to update status");
// // //       return rejectWithValue(error.response?.data);
// // //     }
// // //   }
// // // );

// // export const deleteCampaign = createAsyncThunk(
// //   "campaign/delete",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       await deleteCampaignAPI(id);
// //       toast.success("Campaign deleted successfully!");
// //       return id; // return id or confirmation
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || "Failed to delete campaign");
// //       return rejectWithValue(
// //         err.response?.data?.message || "Failed to delete campaign"
// //       );
// //     }
// //   }
// // );

// // const campaignSlice = createSlice({
// //   name: "campaign",
// //   initialState: {
// //     loading: false,
// //     error: null,
// //     data: null,
// //     campaigns: [],
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(createCampaign.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(createCampaign.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.data = action.payload;
// //       })
// //       .addCase(createCampaign.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
// //       .addCase(fetchCampaigns.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchCampaigns.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.campaigns = action.payload;
// //       })
// //       .addCase(fetchCampaigns.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       })
// //       // .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
// //       //   const index = state.campaigns.findIndex(
// //       //     (c) => c.id === action.payload.id
// //       //   );
// //       //   if (index !== -1) {
// //       //     state.campaigns[index].status = action.payload.status;
// //       //   }
// //       // })
// //       .addCase(deleteCampaign.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(deleteCampaign.fulfilled, (state, action) => {
// //         state.loading = false;
// //         // Remove deleted campaign from the list immediately
// //         // Check if campaigns is an object with data property or an array
// //         if (state.campaigns?.data) {
// //           // If campaigns has a data property (object structure)
// //           state.campaigns.data = state.campaigns.data.filter((campaign) => {
// //             const campaignId = campaign._id || campaign.id || campaign.campaignId;
// //             return campaignId !== action.payload;
// //           });
// //         } else if (Array.isArray(state.campaigns)) {
// //           // If campaigns is directly an array
// //           state.campaigns = state.campaigns.filter((campaign) => {
// //             const campaignId = campaign._id || campaign.id || campaign.campaignId;
// //             return campaignId !== action.payload;
// //           });
// //         }
// //       })
// //       .addCase(deleteCampaign.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export default campaignSlice.reducer;
