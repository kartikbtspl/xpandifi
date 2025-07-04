import React from "react";
import StatCard from "../components/card/StatCard";
import ReusableTable from "../components/table/ReusableTable";
import HeaderSection from "../components/ui/header-section/HeaderSection";

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
    },
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
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww",
    name: "Diwali Sales for Beauty Products",
    slot: "11:00 AM - 04:00 PM",
    bidAmount: 45000,
    bids: 256,
    status: i === 2 ? "Rejected" : i === 1 ? "Canceled" : "Active",
    date: "12/06/2025",
    daysLeft: "12 Days",
  }));

  return (
    <div className="w-full">
      <div>
        <HeaderSection
          subtitle="Harshal"
          showButton={true}
          buttonLabel="Create Campaign"
          onButtonClick={() => console.log("clicked")}
          subtitleClass="text-indigo-700 font-bold text-base"
        />
      </div>
      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
      <div className="mt-6">
        <ReusableTable columns={columns} rows={rows} />
      </div>
    </div>
  );
};

export default Dashboard;
