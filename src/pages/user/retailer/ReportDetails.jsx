import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../../../components/card/StatCard";
import { FiAlertTriangle, FiAlertCircle } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";

const ReportDetails = ({ onBack }) => {
  // Dummy data for the analytics view
  const dummyData = useMemo(
    () => ({
      duration: "110 Days",
      durationChange: "+15%",
      earnings: 232901.0,
      earningsChange: "+62.5%",
      goalProgress: 62.1,
      views: "368232901",
      viewsChange: "+25.5%",
    }),
    []
  );

  // StatCards config - same pattern as RetailerDashboard
  const statCards = [
    {
      title: "Duration",
      value: dummyData.duration,
      change: dummyData.durationChange,
      bgGradient: "bg-gradient-to-l from-red-100 to-gray-50",
      currency: false,
    },
    {
      title: "Earnings",
      value: dummyData.earnings,
      change: dummyData.earningsChange,
      bgGradient: "bg-gradient-to-l from-amber-100 to-gray-50",
      currency: true,
    },
  ];

  // Bar chart data (View Graph)
  const barChartData = [
    { month: "Jan", estimated: 65, achieved: 70 },
    { month: "Feb", estimated: 55, achieved: 48 },
    { month: "Mar", estimated: 60, achieved: 52 },
    { month: "Apr", estimated: 50, achieved: 55 },
    { month: "May", estimated: 58, achieved: 45 },
    { month: "June", estimated: 62, achieved: 50 },
  ];

  // Devices data
  const devicesData = [
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: false },
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: false },
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: true },
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: false },
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: false },
    { name: "Cube Xenie Side 1", earnings: "325611.00", highlight: false },
  ];

  // Click rate data
  const clickRateData = {
    daily: "124,000.00",
    weekly: "124,000.00",
    monthly: "124,000.00",
    avgClickRate: "124,000.00",
    highest: "23.8%",
    avg: "14.47%",
  };

  // Pie chart data for products
  const pieChartData = [
    { name: "Loreal Condition Plus", value: 30, color: "#FDC558" }, // yellow
    { name: "Loreal Hair Mask", value: 25, color: "#F48693" }, // red
    { name: "Loreal Shampoo Plus", value: 25, color: "#90A2D1" }, // blue
    { name: "Loreal Serum", value: 20, color: "#87AA7C" }, // green
  ];

  // Analysis alerts
  const alerts = [
    {
      type: "error",
      title: "Alert: Interaction Rate Down",
      message: "Cube Xenie 3 click rate is down. Check to disable campaign.",
    },
    {
      type: "warning",
      title: "Warning: Boost Campaign Reach",
      message: "Invest more screen time to increase reach.",
    },
    {
      type: "warning",
      title: "Warning: Boost Campaign Reach",
      message: "Device number GH12 has logged off. Check status of device now.",
    },
  ];

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <IoChevronBack size={16} />
          <span>Reports</span>
        </button>
        <span>{">"}</span>
        <span className="text-gray-800 font-medium">View Analytics</span>
      </div>

      {/* Top Stats Row - Same pattern as RetailerDashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={
              card.currency
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 2,
                  }).format(card.value)
                : card.value
            }
            change={card.change}
            bgGradient={card.bgGradient}
          />
        ))}
        {/* Goal Progress Card */}
        <div className="flex flex-col w-full min-h-[102px] rounded-[12px] border border-gray-200 p-3 gap-2 shadow-sm bg-gradient-to-l from-gray-100 to-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Goal</p>
            <span className="text-2xl font-bold text-gray-900">
              {dummyData.goalProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-900 h-3 rounded-full transition-all duration-500"
              style={{ width: `${dummyData.goalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* View Graph - Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">View Graph</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
              <option>All Time</option>
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-200" />
              <span className="text-gray-600">Estimated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-900" />
              <span className="text-gray-600">Achieved</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barGap={2}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 80]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "estimated" ? "Estimated" : "Achieved",
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar
                  dataKey="estimated"
                  fill="#BFDBFE"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="achieved"
                  fill="#1e3a5f"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views & Analysis Summary */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-600">Views</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {dummyData.views}
              </h3>
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              📈 {dummyData.viewsChange}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-1">
              Analysis Summary
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Current trends and recommendations
            </p>

            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    alert.type === "error"
                      ? "bg-red-50 border-l-4 border-red-400"
                      : "bg-yellow-50 border-l-4 border-yellow-400"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.type === "error" ? (
                      <FiAlertTriangle className="text-red-500 mt-0.5" />
                    ) : (
                      <FiAlertCircle className="text-yellow-500 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          alert.type === "error"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices List */}
        <div className="bg-white rounded-xl shadow p-4">
          {/* Header with thick border */}
          <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200 mb-2">
            <h3 className="font-semibold text-gray-800">Devices</h3>
            <span className="font-semibold text-gray-800">Earnings</span>
          </div>
          {/* Device rows */}
          <div className="space-y-1">
            {devicesData.map((device, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{device.name}</span>
                <span
                  className={`font-normal ${
                    device.highlight ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  ₹ {device.earnings}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Click Rate & Products */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          {/* Header with thick border - same as Devices */}
          <h3 className="font-semibold text-gray-800 pb-3 mb-4">
            Click Rate
          </h3>

          {/* Click Rate Stats */}
          <div className="grid grid-cols-3 gap-8 pb-6 mb-6 border-b-2 border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Daily</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clickRateData.daily}
              </p>
              <p className="text-xs text-gray-400">per min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Weekly</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clickRateData.weekly}
              </p>
              <p className="text-xs text-gray-400">per min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Montly</p>
              <p className="text-2xl font-semibold text-gray-900">
                {clickRateData.monthly}
              </p>
              <p className="text-xs text-gray-400">per min</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="relative">
            {/* Legend - positioned at top right corner */}
            <div className="absolute top-0 right-0 flex flex-col gap-3">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-gray-800 mb-4">Products</h4>
            <div className="flex items-start">
              {/* Pie Chart with grey inner circle with border */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 relative">
                  {/* Grey background circle with thin dark border */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full bg-gray-200 border border-gray-400" />
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={95}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        wrapperStyle={{ zIndex: 100 }}
                        position={{ x: 180, y: 60 }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div
                                className="px-3 py-2 border border-gray-300 rounded-lg shadow-lg"
                                style={{ backgroundColor: "white" }}
                              >
                                <div className="flex items-center gap-2 text-sm mb-1">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <span className="text-gray-700 font-medium">
                                    {data.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-gray-500">
                                    Highest :
                                  </span>
                                  <span className="text-gray-700 font-medium">
                                    {clickRateData.highest}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-gray-500">Avg :</span>
                                  <span className="text-gray-700 font-medium">
                                    {clickRateData.avg}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
                    <p className="text-xs text-gray-500 mb-1">Avg Click Rate</p>
                    <p className="text-lg font-bold text-gray-900">
                      {clickRateData.avgClickRate}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">per min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
