import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import StatCard from "../../components/card/StatCard";
import Button from "../../components/ui/button/Button";

const RetailerDashboard = () => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("Day");

  const options=['Day', 'Week', 'Month']

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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [10, 20, 15, 30, 25, 35, 5];
  
  const chartData = days.map((day, index) => ({
    day,
    revenue: data[index],
  }));

  // Area chart data
  const dataa = [
    { day: "Sun", dataUsage: 70, avgOrder: 40 },
    { day: "Mon", dataUsage: 60, avgOrder: 50 },
    { day: "Tue", dataUsage: 65, avgOrder: 30 },
    { day: "Wed", dataUsage: 50, avgOrder: 60 },
    { day: "Thu", dataUsage: 55, avgOrder: 45 },
    { day: "Fri", dataUsage: 75, avgOrder: 35 },
    { day: "Sat", dataUsage: 68, avgOrder: 55 },
  ];

  // Active ads data
  const ads = [
    {
      title: "The Lean Startup (By Eric Bies)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/startup1/100/100",
    },
    {
      title: "Zero To One (By Peter Thiel)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/zero1/100/100",
    },
    {
      title: "The Lean Startup (By Eric Bies)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/startup2/100/100",
    },
    {
      title: "Zero To One (By Peter Thiel)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/zero2/100/100",
    },
    {
      title: "The Lean Startup (By Eric Bies)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/startup3/100/100",
    },
    {
      title: "Zero To One (By Peter Thiel)",
      time: "5 days ago",
      value: "32775 Giles",
      image: "https://picsum.photos/seed/zero3/100/100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome Back,
          <span className="text-[#445E94] text-md ml-2">{name || "Retailer"}</span>
        </h1>
        <div className="flex items-center rounded-lg">

          {
            options.map((option)=>(<Button
          key={option}
          label={option}
          className={`rounded-none ${
            selected === option
              ? ""
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setSelected(option)}
          type="button"
          loading={false}
          disabled={false}
          isIcon={false}
        />))
          }
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Earnings (This Month)"
          value="2545900.45"
          change="+15%"
          bgGradient={"bg-gradient-to-l from-red-100 to-gray-50"}
          currency={true}
        />
        <StatCard
          title="Active Ads"
          value="45"
          change="+2.5%"
          bgGradient="bg-gradient-to-l from-amber-100 to-gray-50"
        />
        <StatCard
          title="Data Usage"
          value="8102995"
          change="+15%"
          bgGradient="bg-gradient-to-l from-gray-100 to-gray-50"
        />
      </div>

      {/* Main Content Section */}
      <div className="w-full h-auto">
        <div className="w-full flex gap-4">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow flex flex-col w-1/2 h-[483px]">
            <div className="text-gray-900 text-lg lg:text-xl border-b border-gray-300 px-4 py-2">
              <p className="font-bold">Total Revenue</p>
            </div>

            <div className="p-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} horizontal={true} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 40]}
                    ticks={[5, 10, 15, 20, 25, 30, 35, 40]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    cursor={{ fill: "transparent" }}
                    itemStyle={{ color: "rgba(18, 18, 19, 1)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#EBF0FF"
                    barSize={25}
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                    activeBar={{ fill: "#6F83B1" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Ads List */}
          <div className="w-2/3 h-[483px]">
            <div className="bg-white rounded-xl shadow p-6 h-full">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Active Ads</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ads.map((ad, index) => (
                  <div
                    key={index}
                    className="border-b pb-4 last:border-0 last:pb-0 flex items-center gap-4"
                  >
                    <img src={ad.image} alt="" className="h-12 w-12 rounded-md" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">{ad.title}</h4>
                      <span className="text-sm text-gray-500">{ad.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-nowrap">{ad.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-xl shadow p-6 w-full mt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Data Usage</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name === "dataUsage" ? "Data Usage" : "Avg Order"]}
                />
                <Area
                  type="monotone"
                  dataKey="dataUsage"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                  name="Data Usage"
                />
                <Area
                  type="monotone"
                  dataKey="avgOrder"
                  stroke="#6b7280"
                  fill="#e5e7eb"
                  name="Avg Order"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
