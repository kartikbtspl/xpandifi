import React from "react";
import StatCard from "../components/card/StatCard";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
