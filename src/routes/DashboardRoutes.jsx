import { Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

// ================= USER ROUTES =================
import Dashboard from "../pages/User_Pages/Dashboard";
import CreateCampaign from "../pages/User_Pages/campaign/CreateCampaign";
import CampaignList from "../pages/User_Pages/campaign/CampaignList";
import CampaignReports from "../pages/User_Pages/campaign/CampaignReports";
import BidManagement from "../pages/User_Pages/campaign/BidManagement";
import UserDetails from "../pages/User_Pages/user/UserDetails";
import Devices from "../pages/User_Pages/retailer/Devices";
import AdPerformance from "../pages/User_Pages/retailer/AdPerformance";
import WithdrawEarning from "../pages/User_Pages/retailer/WithdrawEarning";
import ProductAnalytics from "../pages/User_Pages/retailer/ProductAnalytics";
import DataPrivacy from "../pages/User_Pages/retailer/DataPrivacy";
import ActiveCampaigns from "../pages/User_Pages/campaign/ActiveCampaigns";
import CheckoutCampaign from "../pages/User_Pages/campaign/CheckoutCampaign";
import Campaigns from "../pages/User_Pages/retailer/Campaigns";
import Wallets from "../pages/User_Pages/retailer/Wallet";
import Reports from "../pages/User_Pages/retailer/Reports";
import Settings from "../pages/User_Pages/retailer/Settings";
import Support from "../pages/User_Pages/retailer/Support";
import TicketRaise from "../pages/User_Pages/Ticket/TicketRaise";

// ================= ADMIN ROUTES =================
import AdminDashboard from "../pages/Admin_Pages/Dashboard"; 
import UserManagement from "../pages/Admin_Pages/userManagement/UserManagement";
import CampaignRequest from "../pages/Admin_Pages/campaign/CampaignRequest";
import BidReview from "../pages/Admin_Pages/bidsReview/BidReview";
import RevenuePayouts from "../pages/Admin_Pages/revenuePayouts/RevenuePayouts";
import AdminUserDetails from "../pages/Admin_Pages/User/UserDetails"; 
import Setting from "../pages/Admin_Pages/setting/Setting";
import ConfigurationManagement from "../pages/Admin_Pages/configManagement/ConfigurationManagement";
import ActivateCampaigns from "../pages/Admin_Pages/liveCampaings/ActivateCampaigns";
import TicketSystem from "../pages/Admin_Pages/TicketSystem/TicketSystem";
import AdminMyEarnings from "../pages/Admin_Pages/earn/MyEarnigs"; 
import PayoutCheckout from "../pages/Admin_Pages/revenuePayouts/PayoutCheckout";
import WithdrawalRequest from "../pages/Admin_Pages/revenuePayouts/WithdrawalRequest";


export const dashboardRoutes = [
  <Route key="layout" element={<AppLayout />}>
    {/* USER ROUTES */}
    <Route path="/" element={<Dashboard />} />
    <Route path="/create-campaign" element={<CreateCampaign />} />
    <Route path="/campaigns-list" element={<CampaignList />}>
      <Route path="checkout" element={<CheckoutCampaign />} />
    </Route>
    <Route path="/reports" element={<CampaignReports />} />
    <Route path="/bids" element={<BidManagement />} />
    <Route path="/profile" element={<UserDetails />} />
    <Route path="/active-ads" element={<ActiveCampaigns />} />
    <Route path="/devices" element={<Devices />} />
    <Route path="/ad-performance" element={<AdPerformance />}>
      <Route path="view-analytics" element={<ProductAnalytics />} />
    </Route>
    <Route path="/withdraw-earning" element={<WithdrawEarning />} />
    <Route path="/data-privacy" element={<DataPrivacy />} />
    <Route path="/campaigns" element={<Campaigns />} />
    <Route path="/wallet" element={<Wallets />} />
    <Route path="/report" element={<Reports />} />
    <Route path="/support" element={<Support />}>
      <Route path="raise-ticket" element={<TicketRaise />} />
    </Route>
    <Route path="/settings" element={<Settings />} />

    {/* ADMIN ROUTES */}
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/user-management" element={<UserManagement />} />
    <Route path="/admin/campaign-request" element={<CampaignRequest />} />
    <Route path="/admin/live-campaigns" element={<ActivateCampaigns />} />
    <Route path="/admin/bids" element={<BidReview />} />
    <Route path="/admin/request-withdrawal" element={<WithdrawalRequest />} />
    <Route path="/admin/revenue-payouts" element={<RevenuePayouts />}>
      <Route path="pay" element={<PayoutCheckout />} />
    </Route>
    <Route path="/admin/config-management" element={<ConfigurationManagement />} />
    <Route path="/admin/setting" element={<Setting />} />
    <Route path="/admin/user-details" element={<AdminUserDetails />} />
    <Route path="/admin/ticket" element={<TicketSystem />} />
    <Route path="/admin/earning" element={<AdminMyEarnings />} />
  </Route>,
];




// export const dashboardRoutes = [
//   <Route
//     key="layout"
//     element={
//       <PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
//         <AppLayout />
//       </PrivateRoute>
//     }
//   >

//     {/* Shared route */}
//     <Route path="/" element={<Dashboard />} />

//     <Route
//       path="/create-campaign"
//       element={
//         <PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <CreateCampaign />
//         </PrivateRoute>
//       }
//     />
//     <Route path="/campaigns-list" element={
//       <PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <CampaignList />
//         </PrivateRoute>}>
//       <Route path="checkout" element={<CheckoutCampaign />} />
//     </Route>
//     <Route path="/reports" element={
//       <PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <CampaignReports />
//         </PrivateRoute>} />
//     <Route path="/bids" element={<PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <BidManagement />
//         </PrivateRoute>} />
//     <Route path="/profile" element={<PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
//           <UserDetails />
//         </PrivateRoute>} />
//         <Route path="/active-ads" element={ <PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <ActiveCampaigns />
//         </PrivateRoute>} />

//         {/* Retailer routes */}
//       <Route path="/devices" element={<PrivateRoute allowedRoles={["retailer"]}>
//           <Devices />
//         </PrivateRoute>} />

//     <Route path="/ad-performance" element={<PrivateRoute allowedRoles={["retailer"]}>
//           <AdPerformance />
//         </PrivateRoute>}>
//       <Route path="view-analytics" element={<ProductAnalytics />} />
//     </Route>
//     <Route path="/withdraw-earning" element={<PrivateRoute allowedRoles={["retailer"]}>
//           <WithdrawEarning />
//         </PrivateRoute>} />
//        <Route path="/data-privacy" element={ <PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
//           <DataPrivacy />
//         </PrivateRoute>} />
      
//         <Route path="/campaigns" element={ <PrivateRoute allowedRoles={["retailer"]}>
//           <Campaigns />
//         </PrivateRoute>} />
//         <Route path="/wallet" element={ <PrivateRoute allowedRoles={["retailer"]}>
//           <Wallets />
//         </PrivateRoute>} />
        
//         <Route path="/report" element={ <PrivateRoute allowedRoles={["retailer"]}>
//           <Reports />
//         </PrivateRoute>} />
        
//         <Route path="/support" element={<PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
//           <Support />
//         </PrivateRoute>}>
//       <Route path="raise-ticket" element={<TicketRaise />} />
//     </Route>
        
//         <Route path="/settings" element={ <PrivateRoute allowedRoles={["retailer", "Ad-Agency"]}>
//           <Settings />
//         </PrivateRoute>} />
        
//   </Route>,
// ];









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
