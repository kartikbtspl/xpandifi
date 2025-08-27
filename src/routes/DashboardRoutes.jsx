import { Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import PrivateRoute from "./PrivateRoute";
// ================= USER ROUTES =================
import Dashboard from "../pages/Dashboard";
import CreateCampaign from "../pages/user/campaign/CreateCampaign";
import CampaignList from "../pages/user/campaign/CampaignList";
import CampaignReports from "../pages/user/campaign/CampaignReports";
import BidManagement from "../pages/user/campaign/BidManagement";
import UserDetails from "../pages/shared/UserDetails";
import Devices from "../pages/user/retailer/Devices";
import AdPerformance from "../pages/user/retailer/AdPerformance";
import WithdrawEarning from "../pages/user/retailer/WithdrawEarning";
import ProductAnalytics from "../pages/user/retailer/ProductAnalytics";
import DataPrivacy from "../pages/user/retailer/DataPrivacy";
import ActiveCampaigns from "../pages/user/campaign/ActiveCampaigns";
import CheckoutCampaign from "../pages/user/campaign/CheckoutCampaign";
import Campaigns from "../pages/user/retailer/Campaigns";
import Wallets from "../pages/user/retailer/Wallet";
import Reports from "../pages/user/retailer/Reports";
import Settings from "../pages/user/retailer/Settings";
import Support from "../pages/user/retailer/Support";
import TicketRaise from "../pages/user/Ticket/TicketRaise";

// ================= ADMIN ROUTES =================
import UserManagement from "../pages/admin/userManagement/UserManagement";
import CampaignRequest from "../pages/admin/campaign/CampaignRequest";
import BidReview from "../pages/admin/bidsReview/BidReview";
import RevenuePayouts from "../pages/admin/revenuePayouts/RevenuePayouts";
// import AdminUserDetails from "../pages/admin/User/UserDetails"; 
import Setting from "../pages/admin/setting/Setting";
import ConfigurationManagement from "../pages/admin/configManagement/ConfigurationManagement";
import ActivateCampaigns from "../pages/admin/liveCampaings/ActivateCampaigns";
import TicketSystem from "../pages/admin/TicketSystem/TicketSystem";
import AdminMyEarnings from "../pages/admin/earn/MyEarnigs"; 
import PayoutCheckout from "../pages/admin/revenuePayouts/PayoutCheckout";
import WithdrawalRequest from "../pages/admin/revenuePayouts/WithdrawalRequest";

export const dashboardRoutes = [
    <Route
    key="layout"
    element={
      <PrivateRoute allowedRoles={["Retailer", "Ad-Agency", "SUPERADMIN","ADMIN"]}>
        <AppLayout />
      </PrivateRoute>
    }
  >

    {/* Shared route */}
    <Route path="/" element={<Dashboard />} />

    <Route
      path="/create-campaign"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CreateCampaign />
        </PrivateRoute>
      }
    />
    <Route path="/campaigns-list" element={
      <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignList />
        </PrivateRoute>}>
      <Route path="checkout" element={<CheckoutCampaign />} />
    </Route>
    <Route path="/reports" element={
      <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignReports />
        </PrivateRoute>} />
    <Route path="/bids" element={<PrivateRoute allowedRoles={["Ad-Agency"]}>
          <BidManagement />
        </PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency","SUPERADMIN","ADMIN"]}>
          <UserDetails />
        </PrivateRoute>} />
        <Route path="/active-ads" element={ <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <ActiveCampaigns />
        </PrivateRoute>} />

        {/* Retailer routes */}
      <Route path="/devices" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <Devices />
        </PrivateRoute>} />

    <Route path="/ad-performance" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <AdPerformance />
        </PrivateRoute>}>
      <Route path="view-analytics" element={<ProductAnalytics />} />
    </Route>
    <Route path="/withdraw-earning" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <WithdrawEarning />
        </PrivateRoute>} />
       <Route path="/data-privacy" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <DataPrivacy />
        </PrivateRoute>} />
      
        <Route path="/campaigns" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Campaigns />
        </PrivateRoute>} />
        <Route path="/wallet" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Wallets />
        </PrivateRoute>} />
        
        <Route path="/report" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Reports />
        </PrivateRoute>} />
        
        <Route path="/support" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <Support />
        </PrivateRoute>}>
      <Route path="raise-ticket" element={<TicketRaise />} />
    </Route>
        
        <Route path="/settings" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <Settings />
        </PrivateRoute>} />

    {/* ADMIN ROUTES */}
      <Route 
        path="user-management" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <UserManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="campaign-request" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <CampaignRequest />
          </PrivateRoute>
        } 
      />
      <Route 
        path="live-campaigns" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <ActivateCampaigns />
          </PrivateRoute>
        } 
      />
      <Route 
        path="manage-bids" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <BidReview />
          </PrivateRoute>
        } 
      />
      <Route 
        path="request-withdrawal" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <WithdrawalRequest />
          </PrivateRoute>
        } 
      />
      <Route 
        path="revenue-payouts" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <RevenuePayouts />
          </PrivateRoute>
        } 
      >
        <Route 
          path="pay" 
          element={
            <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
              <PayoutCheckout />
            </PrivateRoute>
          } 
        />
      </Route>
      <Route 
        path="config-management" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <ConfigurationManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="setting" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <Setting />
          </PrivateRoute>
        } 
      />
    
      <Route 
        path="ticket" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <TicketSystem />
          </PrivateRoute>
        } 
      />
      <Route 
        path="earning" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <AdminMyEarnings />
          </PrivateRoute>
        } 
      />

  </Route>,
];




// export const dashboardRoutes = [
//   <Route
//     key="layout"
//     element={
//       <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
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
//     <Route path="/profile" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
//           <UserDetails />
//         </PrivateRoute>} />
//         <Route path="/active-ads" element={ <PrivateRoute allowedRoles={["Ad-Agency"]}>
//           <ActiveCampaigns />
//         </PrivateRoute>} />

//         {/* Retailer routes */}
//       <Route path="/devices" element={<PrivateRoute allowedRoles={["Retailer"]}>
//           <Devices />
//         </PrivateRoute>} />

//     <Route path="/ad-performance" element={<PrivateRoute allowedRoles={["Retailer"]}>
//           <AdPerformance />
//         </PrivateRoute>}>
//       <Route path="view-analytics" element={<ProductAnalytics />} />
//     </Route>
//     <Route path="/withdraw-earning" element={<PrivateRoute allowedRoles={["Retailer"]}>
//           <WithdrawEarning />
//         </PrivateRoute>} />
//        <Route path="/data-privacy" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
//           <DataPrivacy />
//         </PrivateRoute>} />
      
//         <Route path="/campaigns" element={ <PrivateRoute allowedRoles={["Retailer"]}>
//           <Campaigns />
//         </PrivateRoute>} />
//         <Route path="/wallet" element={ <PrivateRoute allowedRoles={["Retailer"]}>
//           <Wallets />
//         </PrivateRoute>} />
        
//         <Route path="/report" element={ <PrivateRoute allowedRoles={["Retailer"]}>
//           <Reports />
//         </PrivateRoute>} />
        
//         <Route path="/support" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
//           <Support />
//         </PrivateRoute>}>
//       <Route path="raise-ticket" element={<TicketRaise />} />
//     </Route>
        
//         <Route path="/settings" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
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
