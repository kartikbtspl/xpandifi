import { configureStore } from '@reduxjs/toolkit'

// User Slices
import campaignReducer from './slices/user/campaignSlice'
import userReducer from './slices/user/userSlice'
import approvedCampaignReducer from './slices/user/approvedCampaignSlice'
import userTickeTReducer from './slices/user/ticketsSlice'
import cityProductDeviceReducer from './slices/user/cityProductDeviceSlice'
import walletReducer from './slices/user/walletSlice'
import userTerminalReuder from './slices/user/terminalSlice'

// Admin Slices
import adminCampaignReducer from './slices/admin/campaignSlice'
import adminReducer from './slices/admin/adminSlice'
import usersManagementReducer from './slices/admin/userManagementSlice'
import deviceReducer from './slices/admin/deviceSlice'
import tierReducer from './slices/admin/tierSlice'
import productReducer from './slices/admin/productSlice'
import payoutReducer from './slices/admin/payoutSlice'
import adminRevenueReducer from './slices/admin/adminRevenueSlice'
import adminTerminalReducer from './slices/admin/terminalSlice'
import adminTickertReducer from './slices/admin/ticketsSlice'


export const store = configureStore({
  reducer: {
    // User Slices
    campaign: campaignReducer,
    user: userReducer,
    approvedCampaigns: approvedCampaignReducer,
    userTicket: userTickeTReducer,
    cityProductDevice: cityProductDeviceReducer,
    wallet: walletReducer,
    userTerminal:userTerminalReuder,

    // Admin Slices
    adminCampaign: adminCampaignReducer,
    admin: adminReducer,
    adminRevenue:adminRevenueReducer,
    usersManagement: usersManagementReducer,
    device: deviceReducer,
    tier: tierReducer,
    product: productReducer,
    payout: payoutReducer,
    adminTerminal:adminTerminalReducer,
    adminTicket:adminTickertReducer
  },
})