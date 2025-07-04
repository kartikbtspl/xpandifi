import React from 'react'
import StatCard from '../components/card/StatCard';
import ReusableTable from '../components/table/ReusableTable';
import campaignImg from "../../public/images/profile.jpeg"; // or use URL

const Dashboard = () => {
    const statsData = [
    {
      title: "Revenue",
      value: "25.1k",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-pink-100",
    },
    {
      title: "Ad Clicks",
      value: "25.1k",
      change: "+2.5%",
      currency: false,
      changeColor: "text-green-700",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
    },
    {
      title: "Cost",
      value: "25.1k",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-slate-50 to-blue-100",
      
    },
    {
      title: "Bid",
      value: "25.1k",
      change: "+15%",
      currency: false,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-purple-50 to-purple-100",
    }
  ];

//  const campaignData = Array(10).fill().map(() => ({
//   image: "https://via.placeholder.com/30",
//   campaign: "Diwali Sales for Beauty Products",
//   slot: "11:00 AM  -  04:00 PM",
//   bidAmount: 45000,
//   bids: 256,
//   status: "Active", // Try: "Canceled", "Rejected"
//   resultDate: "12/06/2025",
//   resultIn: "12 Days"
// }));


const columns = [
  { id: "name", label: "Campaign Name" },
  { id: "slot", label: "Slot" },
  { id: "bidAmount", label: "Bid Amount", numeric: true },
  { id: "bids", label: "Bids In Same Slot", numeric: true },
  { id: "status", label: "Status" },
  { id: "date", label: "Result In" },
];

const rows = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  image: campaignImg,
  name: "Diwali Sales for Beauty Products",
  slot: "11:00 AM - 04:00 PM",
  bidAmount: 45000,
  bids: 256,
  status: i === 2 ? "Rejected" : i === 1 ? "Canceled" : "Active",
  date: "12/06/2025",
  daysLeft: "12 Days",
}));

  return (
     <div className="text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Welcome Back, John Smith</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {statsData.map((item, index) => (
          <StatCard key={index} {...item}  />
        ))}
      </div>
      <div className='mt-8'>
        <ReusableTable columns={columns} rows={rows} title="Campaigns" />
      </div>
    </div>
  )
}

export default Dashboard