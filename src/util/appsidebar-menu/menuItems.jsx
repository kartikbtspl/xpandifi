import {  GridIcon , ReportIcon , BidIcon , CampaignIcon, WithdrawIcon,PrivacyIcon } from "../../icon/index"
export const menuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    { name: "Campaigns", icon: <CampaignIcon />, path: "/campaigns-list" },
    { name: "Active Campaigns", icon: <BidIcon />, path: "/active-ads" },
    { name: "Reports", icon: <ReportIcon />, path: "/reports" },
    { name: "Bid Management", icon: <BidIcon />, path: "/bids" },
  ];


  export const retailerMenuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    { name: "POS Data Upload", icon: <CampaignIcon />, path: "/pos-upload" },
    {name : "Ad Performance", icon: <ReportIcon />, path: "/ad-performance"},
    {name: "Withdraw Earning", icon: <WithdrawIcon/>, path:"/withdraw-earning"},
    {name: "Data Privacy", icon:<PrivacyIcon />, path:"/data-privacy"},
    {name: "Campaigns", icon:<WithdrawIcon />, path:"/campaigns"},
    {name: "Wallet", icon:<WithdrawIcon />, path:"/wallet"},
    {name: "Devices", icon:<WithdrawIcon />, path:"/devices"},
    {name: "Reports", icon:<WithdrawIcon />, path:"/report"},
    {name: "Ads", icon:<WithdrawIcon />, path:"/ads"},
    {name: "Billings", icon:<WithdrawIcon />, path:"/billings"},
    {name: "Support", icon:<WithdrawIcon />, path:"/support"},
    {name: "Settings", icon:<WithdrawIcon />, path:"/settings"},
  ];