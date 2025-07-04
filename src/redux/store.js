import { configureStore } from '@reduxjs/toolkit'
import campaignReducer from './slices/campaignSlice'
import loginReducer from './slices/authSlice'
import userReducer from './slices/userProfileSlice' 
import campaignDetailReducer from './slices/campaignDetailSlice'

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    auth: loginReducer, 
    user:userReducer,
    campaignDetail : campaignDetailReducer
  },
})