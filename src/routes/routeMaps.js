// src/routes/routeMap.js
export const routeMap = [
  { path: "/", 
    name: "Dashboard", 
    keywords: ["home", "dashboard", "main"],
    roles:['Ad-Agency', 'Retailer'],
  
  },
  {
    path: "/create-campaign",
    name: "Create Campaign",
    keywords: ["new", "campaign", "create"],
    roles:['Ad-Agency'],
  },
  {
    path: "/campaigns-list",
    name: "Campaigns List",
    keywords: ["list", "campaigns", "campaign"],
    roles:['Ad-Agency'],
  },
  {
    path: "/reports",
    name: "Reports",
    keywords: ["analytics", "reports", "data"],
    roles:['Ad-Agency'],
  },
  {
    path: "/bids",
    name: "Bid Management",
    keywords: ["bids", "management", "auction"],
    roles:['Ad-Agency'],
  },
  {
    path: "/profile",
    name: "User Profile",
    keywords: ["profile", "account", "user"],
    roles:['Ad-Agency', 'Retailer'],
  },
  {
    path: "/pos-upload",
    name: "POS Upload",
    keywords: ["upload", "pos", "retail"],
    roles:[ 'Retailer'],
  },
  {
    path: "/ad-performance",
    name: "Ad Performance",
    keywords: ["ads", "performance", "report"],
    roles:[ 'Retailer'],
  },
  {
    path: "/withdraw-earning",
    name: "Withdraw Earning",
    keywords: ["withdraw", "money", "earning"],
    roles:[ 'Retailer'],
  },
  {
    path: "/data-privacy",
    name: "Data Privacy",
    keywords: [
      "personal data",
      "data protection",
      "privacy policy",
      "compliance",
    ],
    roles:[ 'Retailer'],
  },
];
