import { GridIcon, 
  ReportIcon, 
  BidIcon, 
  CampaignIcon, 
  WithdrawIcon, 
  PrivacyIcon, 
  SettingIcon, 
  AnalyticIcon, 
  DeviceIcon, 
  SupportIcon, CampaignReqIcon, UserMgntIcon, BidReviewIcon, RevenuePayIcon, DeviceMgntIcon
} 
from "../../icon/index"
export const menuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  { name: "Campaigns", icon: <CampaignIcon />, path: "/campaigns-list" },
  { name: "Active Campaigns", icon: <BidIcon />, path: "/active-ads" },
  { name: "Reports", icon: <ReportIcon />, path: "/reports" },
  { name: "Bid Management", icon: <BidIcon />, path: "/bids" },
  { name: "Settings", icon: <SettingIcon />, path: "/settings" },
  { name: "Support", icon: <SupportIcon />, path: "/support" },
  { name: "Data Privacy", icon: <PrivacyIcon />, path: "/data-privacy" },
];


export const retailerMenuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  //{ name: "POS Data Upload", icon: <CampaignIcon />, path: "/pos-upload" },
  { name: "Ad Performance", icon: <AnalyticIcon />, path: "/ad-performance" },
  { name: "Devices", icon: <DeviceIcon />, path: "/devices" },
  //{name: "Campaigns", icon:<WithdrawIcon />, path:"/campaigns"},
  { name: "Reports", icon: <ReportIcon />, path: "/report" },
  { name: "Wallet", icon: <WithdrawIcon />, path: "/wallet" },
  //{name: "Withdraw Earning", icon: <WithdrawIcon/>, path:"/withdraw-earning"},
  { name: "Settings", icon: <SettingIcon />, path: "/settings" },
  { name: "Support", icon: <SupportIcon />, path: "/support" },
  { name: "Data Privacy", icon: <PrivacyIcon />, path: "/data-privacy" },



];

export const adminMenuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/admin" },
  { name: "User Management", icon: <UserMgntIcon />, path: "/admin/user-management" },
  {
    name: "Campaign Request",
    icon: <CampaignReqIcon />,
    path: "/admin/campaign-request",
  },
  {
    name: "Live Campaigns",
    icon: <CampaignReqIcon />,
    path: "/admin/live-campaigns",
  },
  {
    name: "Withdrawal Request",
    icon: <CampaignReqIcon />,
    path: "/admin/request-withdrawal",
  },
  {
    name: "Revenue & Payouts",
    icon: <RevenuePayIcon />,
    path: "/admin/revenue-payouts",
  },
  {
    name: "My Earning",
    icon: <RevenuePayIcon />,
    path: "/admin/earning",
  },
  {
    name: "Configuration Management",
    icon: <DeviceMgntIcon />,
    path: "/admin/config-management",
  },
  {
    name: "Ticket System",
    icon: <DeviceMgntIcon />,
    path: "/admin/ticket",
  },
  { name: "Bid Review", icon: <BidReviewIcon />, path: "/admin/bids" },
  { name: "Setting", icon: <SettingIcon />, path: "/admin/setting" },
];
