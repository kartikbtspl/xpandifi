import {  GridIcon , ReportIcon , BidIcon , CampaignIcon, WithdrawIcon,PrivacyIcon,SettingIcon,AnalyticIcon, DeviceIcon,SupportIcon } from "../../icon/index"
export const menuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    { name: "Campaigns", icon: <CampaignIcon />, path: "/campaigns-list" },
    { name: "Active Campaigns", icon: <BidIcon />, path: "/active-ads" },
    { name: "Reports", icon: <ReportIcon />, path: "/reports" },
    { name: "Bid Management", icon: <BidIcon />, path: "/bids" },
    {name: "Settings", icon:<SettingIcon />, path:"/settings"},
    {name: "Support", icon:<CustomerSupport />, path:"/support"},
    {name: "Data Privacy", icon:<PrivacyIcon />, path:"/data-privacy"},
  ];


  export const retailerMenuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    //{ name: "POS Data Upload", icon: <CampaignIcon />, path: "/pos-upload" },
    {name : "Ad Performance", icon: <AnalyticIcon />, path: "/ad-performance"},
     { name: "Devices", icon: <DeviceIcon />, path: "/devices" },
    //{name: "Campaigns", icon:<WithdrawIcon />, path:"/campaigns"},
    {name: "Reports", icon:<ReportIcon />, path:"/report"},
    {name: "Wallet", icon:<WithdrawIcon />, path:"/wallet"},
    //{name: "Withdraw Earning", icon: <WithdrawIcon/>, path:"/withdraw-earning"},
    {name: "Settings", icon:<SettingIcon />, path:"/settings"},
     {name: "Support", icon:<SupportIcon />, path:"/support"},
    {name: "Data Privacy", icon:<PrivacyIcon />, path:"/data-privacy"},
    
    
  
  ];