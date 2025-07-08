import {  GridIcon , ReportIcon , BidIcon , CampaignIcon, WithdrawIcon } from "../../icon/index"
export const menuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    { name: "Campaigns", icon: <CampaignIcon />, path: "/campaigns-list" },
    { name: "Reports", icon: <ReportIcon />, path: "/reports" },
    { name: "Bid Management", icon: <BidIcon />, path: "/bids" },
  ];


  export const retailerMenuItems = [
    { name: "Dashboard", icon: <GridIcon />, path: "/" },
    { name: "POS Data Upload", icon: <CampaignIcon />, path: "/pos-upload" },
    {name : "Ad Performance", icon: <ReportIcon />, path: "/ad-performance"},
  
    
  ];