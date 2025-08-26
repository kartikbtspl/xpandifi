import { configureStore } from '@reduxjs/toolkit'


//User Slices
import campaignReducer from './slices/User/campaignSlice'
import loginReducer from './slices/User/authSlice'
import userReducer from './slices/User/userSlice'
// import campaignDetailReducer from './slices/User/campaignDetailSlice'
import approvedCampaignReducer from './slices/User/approvedCampaignSlice';
import ticketsReducer from './slices/User/ticketsSlice';
import cityProductDeviceReducer from './slices/User/cityProductDeviceSlice';
import walletReducer from './slices/User/walletSlice'


//Admin Slices
import campaignAdminReducer from './slices/Admin/campaignSlice'
import loginAdminReducer from './slices/Admin/authSlice'
import userAdminReducer from './slices/Admin/userProfileSlice'
import usersManagementReducer from './slices/Admin/userManagementSlice'
import deviceReducer from './slices/Admin/deviceSlice'
import tierReducer from './slices/Admin/tierSlice'
import productReducer from './slices/Admin/productSlice'
import payoutReducer from './slices/Admin/payoutSlice'


export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    auth: loginReducer, 
    // campaignDetail : campaignDetailReducer,
    user : userReducer,
    approvedCampaigns: approvedCampaignReducer,
    tickets: ticketsReducer,
    cityProductDevice: cityProductDeviceReducer,
    wallet: walletReducer,

    //Admin Slices can be added here
    campaign: campaignAdminReducer,
    auth: loginAdminReducer, 
    user:userAdminReducer,
    usersManagement: usersManagementReducer,
    device: deviceReducer,
    tier:tierReducer,
    product:productReducer,
    payout:payoutReducer,
  },
})