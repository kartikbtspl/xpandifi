import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layout/AppLayout";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import Dashboard from "../pages/Dashboard";
import CampaignList from "../pages/campaign/CampaignList";
import CampaignReports from "../pages/campaign/CampaignReports";
import BidManagement from "../pages/campaign/BidManagement";
import UserDetails from "../pages/user/UserDetails";
import PosDataUpload from "../pages/retailer/PosDataUpload";
import AdPerformance from "../pages/retailer/AdPerformance";

export const dashboardRoutes = [
  <Route
    key="layout"
    element={
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    }
  >
    {/* <Route index path="/" element={<Home />} /> */}
    <Route path="/" element={<Dashboard />} />
    <Route path="/create-campaign" element={<CreateCampaign />} />
    <Route path="/campaigns-list" element = {<CampaignList />} />
    <Route path="/reports" element={<CampaignReports />} />
    <Route path="/bids" element={<BidManagement />} />
    <Route path="/profile" element = {<UserDetails />} /> 
    <Route path="/pos-upload" element={<PosDataUpload />} />
    <Route path="/ad-performance" element={<AdPerformance />} />
   </Route>,
];
