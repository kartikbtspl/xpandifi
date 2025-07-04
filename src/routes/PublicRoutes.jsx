import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import SignIn from "../pages/AuthPages/SignIn";
export const publicRoutes = [
  <Route key="signin" path="/signin" element={<SignIn />} />
]