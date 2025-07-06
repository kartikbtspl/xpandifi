import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const RetailerDashboard = () => {

  const [name, setName] = useState("");

   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
  
          setName(decoded?.fullName);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }, []);
  // Bar chart data
  const barData = [10, 20, 35, 30, 25, 15, 5];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Active ads data
  const ads = [
    { title: "The Lean Startup (By Eric Bies)", time: "5 days ago", value: "32775 Giles" },
    { title: "Zero To One (By Peter Thiel)", time: "5 days ago", value: "32775 Giles" },
    { title: "The Lean Startup (By Eric Bies)", time: "5 days ago", value: "32775 Giles" },
    { title: "Zero To One (By Peter Thiel)", time: "5 days ago", value: "32775 Giles" },
    { title: "The Lean Startup (By Eric Bies)", time: "5 days ago", value: "32775 Giles" },
    { title: "Zero To One (By Peter Thiel)", time: "5 days ago", value: "32775 Giles" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
     <div className="mb-3">
      <h1 className="text-2xl font-bold">Welcome Back ,<span className="text-[#445E94] text-md">{name || "Retailer"}</span></h1>
     </div>
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
          title="Total Earnings (This Month)" 
          value="2545900.45" 
          change="+15%" 
        />
        <MetricCard 
          title="Active Ads" 
          value="45" 
          change="+2.5%" 
        />
        <MetricCard 
          title="Data Usage" 
          value="8102995" 
          change="+15%" 
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Total Revenue</h2>
          </div>
          
          {/* Bar Chart */}
          <div className="space-y-4">
            <div className="flex items-end h-48 gap-x-3">
              {barData.map((height, index) => (
                <div key={index} className="flex flex-col items-center flex-1 h-full">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg"
                    style={{ height: `${height * 0.9}%` }}
                  ></div>
                  <span className="text-sm text-gray-500 mt-2">{days[index]}</span>
                </div>
              ))}
            </div>
            
            {/* Y-axis labels */}
            <div className="flex justify-between px-2 text-xs text-gray-500">
              {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((num) => (
                <span key={num}>{num}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="space-y-6">
          {/* Active Ads */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Active Ads</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ads.map((ad, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">{ad.title}</h4>
                    <span className="text-sm text-gray-500">{ad.time}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{ad.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Data Usage</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">
              Data visualization placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric card component
const MetricCard = ({ title, value, change }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex justify-between items-start">
      <h3 className="text-gray-600 font-medium">{title}</h3>
      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
        {change}
      </span>
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default RetailerDashboard;

