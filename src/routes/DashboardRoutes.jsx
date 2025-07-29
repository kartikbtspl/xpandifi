// src/routes/DashboardRoutes.jsx
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layout/AppLayout";

// Pages
import CreateCampaign from "../pages/campaign/CreateCampaign";
import Dashboard from "../pages/Dashboard";
import CampaignList from "../pages/campaign/CampaignList";
import CampaignReports from "../pages/campaign/CampaignReports";
import BidManagement from "../pages/campaign/BidManagement";
import UserDetails from "../pages/user/UserDetails";
import PosDataUpload from "../pages/retailer/PosDataUpload";
import AdPerformance from "../pages/retailer/AdPerformance";
import WithdrawEarning from "../pages/retailer/WithdrawEarning";
import ProductAnalytics from "../pages/retailer/ProductAnalytics";
import DataPrivacy from "../pages/retailer/DataPrivacy";

export const dashboardRoutes = [
  <Route
    key="layout"
    element={
      <PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
        <AppLayout />
      </PrivateRoute>
    }
  >
    {/* Shared route */}
    <Route path="/" element={<Dashboard />} />

    {/* Ad Agency routes */}
    <Route
      path="/create-campaign"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CreateCampaign />
        </PrivateRoute>
      }
    />
    <Route
      path="/campaigns-list"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignList />
        </PrivateRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignReports />
        </PrivateRoute>
      }
    />
    <Route
      path="/bids"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <BidManagement />
        </PrivateRoute>
      }
    />

    {/* Retailer routes */}
    <Route
      path="/pos-upload"
      element={
        <PrivateRoute allowedRoles={["retailer"]}>
          <PosDataUpload />
        </PrivateRoute>
      }
    />
    <Route
      path="/ad-performance"
      element={
        <PrivateRoute allowedRoles={["retailer"]}>
          <AdPerformance />
        </PrivateRoute>
      }
    >
      <Route
        path="view-analytics"
        element={
          <PrivateRoute allowedRoles={["retailer"]}>
            <ProductAnalytics />
          </PrivateRoute>
        }
      />
    </Route>
    <Route
      path="/withdraw-earning"
      element={
        <PrivateRoute allowedRoles={["retailer"]}>
          <WithdrawEarning />
        </PrivateRoute>
      }
    />
    <Route
      path="/data-privacy"
      element={
        <PrivateRoute allowedRoles={["retailer"]}>
          <DataPrivacy />
        </PrivateRoute>
      }
    />

    {/* Shared route */}
    <Route
      path="/profile"
      element={
        <PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
          <UserDetails />
        </PrivateRoute>
      }
    />
  </Route>,
];




// //src\routes\DashboardRoutes.jsx
// import { Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
// import AppLayout from "../layout/AppLayout";
// import CreateCampaign from "../pages/campaign/CreateCampaign";
// import Dashboard from "../pages/Dashboard";
// import CampaignList from "../pages/campaign/CampaignList";
// import CampaignReports from "../pages/campaign/CampaignReports";
// import BidManagement from "../pages/campaign/BidManagement";
// import UserDetails from "../pages/user/UserDetails";
// import PosDataUpload from "../pages/retailer/PosDataUpload";
// import AdPerformance from "../pages/retailer/AdPerformance";
// import WithdrawEarning from "../pages/retailer/WithdrawEarning";
// import ProductAnalytics from "../pages/retailer/ProductAnalytics";
// import DataPrivacy from "../pages/retailer/DataPrivacy";

// export const dashboardRoutes = [
//   <Route
//     key="layout"
//     element={
//       <PrivateRoute>
//         <AppLayout />
//       </PrivateRoute>
//     }
//   >
//     {/* <Route index path="/" element={<Home />} /> */}
//     <Route path="/" element={<Dashboard />} />
//     <Route path="/create-campaign" element={<CreateCampaign />} />
//     <Route path="/campaigns-list" element={<CampaignList />} />
//     <Route path="/reports" element={<CampaignReports />} />
//     <Route path="/bids" element={<BidManagement />} />
//     <Route path="/profile" element={<UserDetails />} />
//     <Route path="/pos-upload" element={<PosDataUpload />} />
//     <Route path="/ad-performance" element={<AdPerformance />}>
//       <Route path="view-analytics" element={<ProductAnalytics />} />
//     </Route>
//     <Route path="/withdraw-earning" element={<WithdrawEarning />} />
//     <Route path="/data-privacy" element={<DataPrivacy />} />
    
//   </Route>,
// ];
