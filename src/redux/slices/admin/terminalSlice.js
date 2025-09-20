import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRequestAPI, updateRequestStatusAPI } from "../../../api/admin/terminal/device";

// Thunks
export const fetchRequests = createAsyncThunk(
  "terminal/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRequestAPI();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  "terminal/updateRequestStatus",
  async (_,{ id, status, remark }) => {
    await updateRequestStatusAPI(id, status, remark);
    return { id, status, remark };
  }
);

// Slice
const terminalSlice = createSlice({
  name: "terminal",
  initialState: {
    deviceRequests: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false, // ✅ new flag
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceRequests = action.payload || [];
        state.fetched = true; // ✅ mark as fetched
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch the device request";
        state.fetched = true; // ✅ mark as attempted
      })

      // update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.formLoading = false;
        const { id, status, remark } = action.payload;
        const idx = state.deviceRequests.findIndex((p) => p.id === id);
        if (idx !== -1) {
          state.deviceRequests[idx].status = status;
          if (remark !== undefined) {
            state.deviceRequests[idx].remark = remark;
          }
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.formLoading = false;
        state.error =
          action.payload || "Failed to update the device request";
      });
  },
});

export default terminalSlice.reducer;


// import  {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
// import {getAllRequestAPI,updateRequestStatusAPI} from "../../../api/admin/terminal/device"

// //Thunks
// export const fetchRequests = createAsyncThunk(
//     "terminal/fetchRequests",
//     async(_,{rejectWithValue})=>{
//         try{
//             const response = await getAllRequestAPI();
//             return response.data;
//         }catch(error){
//         return rejectWithValue(error.response?.data || error.message);
//     }

//     }
// )


// export const updateRequestStatus = createAsyncThunk(
//     "terminal/updateRequestStatus",
//     async({id, status, remark})=>{
//         await updateRequestStatusAPI(id,status,remark);
//         return {id,status,remark}
//     }
// )


// //Slice

// const termianlSlice= createSlice({
//     name:"terminals",
//     initialState:{
//         devices:[],
//         loading:false,
//         formLoading:false,
//         error:null,
//     },
//     reducers:{},
//     extraReducers:(builder)=>{
//         builder
//         .addCase(fetchRequests.pending, (state)=>{
//             state.loading=true,
//             state.error=null
//         })
//         .addCase(fetchRequests.fulfilled, (state,action)=>{
//             state.loading=false,
//             state.devices=action.payload || [];
//         })
//         .addCase(fetchRequests.rejected, (state, action)=>{
//             state.loading=false,
//             state.error= action.payload || "Failed to fetch the device request"
//         })


//         // update request status

//         .addCase(updateRequestStatus.pending, (state) => {
//             state.formLoading=true;
//             state.error=null;
//         })
//         .addCase(updateRequestStatus.fulfilled, (state,action) => {
//             state.formLoading=false;
//             const {id, status, remark} = action.payload;
//             const idx = state.payload.findIndex((p) =>p.id===id );
//             if(idx !==-1){
//                 state.devices[idx].status=status;
//                 if(remark !==undefined){
//                     state.devices[idx].remark = remark;
//                 }
//             }
//         })
//         .addCase(updateRequestStatus.rejected, (state,action)=>{
//             state.formLoading = false;
//             state.error=action.payload || "Failed to update the device request"
//         });
//     }
// });


// export default termianlSlice.reducer;
