import { configureStore } from '@reduxjs/toolkit'
import campaignReducer from './slices/campaignSlice'
import loginReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import campaignDetailReducer from './slices/campaignDetailSlice'
import approvedCampaignReducer from './slices/approvedCampaignSlice';
import ticketsReducer from './slices/ticketsSlice';

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    auth: loginReducer, 
    campaignDetail : campaignDetailReducer,
    user : userReducer,
    approvedCampaigns: approvedCampaignReducer,
    tickets: ticketsReducer,
  },
})