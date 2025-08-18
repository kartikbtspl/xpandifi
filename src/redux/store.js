import { configureStore } from '@reduxjs/toolkit'
import campaignReducer from './slices/campaignSlice'
import loginReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
// import campaignDetailReducer from './slices/campaignDetailSlice'
import approvedCampaignReducer from './slices/approvedCampaignSlice';
import ticketsReducer from './slices/ticketsSlice';
import cityProductDeviceReducer from './slices/cityProductDeviceSlice';

import walletReducer from './slices/walletSlice'

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
  },
})