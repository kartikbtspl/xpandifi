import { configureStore } from '@reduxjs/toolkit'

// User Slices
import campaignReducer from './slices/user/campaignSlice'
import loginReducer from './slices/user/authSlice'
import userReducer from './slices/user/userSlice'
import approvedCampaignReducer from './slices/user/approvedCampaignSlice'
import ticketsReducer from './slices/user/ticketsSlice'
import cityProductDeviceReducer from './slices/user/cityProductDeviceSlice'
import walletReducer from './slices/user/walletSlice'

// Admin Slices
import adminCampaignReducer from './slices/admin/campaignSlice'
import adminAuthReducer from './slices/admin/authSlice'
import adminProfileReducer from './slices/admin/userProfileSlice'
import usersManagementReducer from './slices/admin/userManagementSlice'
import deviceReducer from './slices/admin/deviceSlice'
import tierReducer from './slices/admin/tierSlice'
import productReducer from './slices/admin/productSlice'
import payoutReducer from './slices/admin/payoutSlice'

export const store = configureStore({
  reducer: {
    // User Slices
    campaign: campaignReducer,
    auth: loginReducer,
    user: userReducer,
    approvedCampaigns: approvedCampaignReducer,
    tickets: ticketsReducer,
    cityProductDevice: cityProductDeviceReducer,
    wallet: walletReducer,

    // Admin Slices
    adminCampaign: adminCampaignReducer,
    adminAuth: adminAuthReducer,
    adminProfile: adminProfileReducer,
    usersManagement: usersManagementReducer,
    device: deviceReducer,
    tier: tierReducer,
    product: productReducer,
    payout: payoutReducer,
  },
})