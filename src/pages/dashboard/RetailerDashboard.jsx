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
<<<<<<< HEAD
  ResponsiveContainer,
=======
  ResponsiveContainer
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
} from "recharts";
import StatCard from "../../components/card/StatCard";
import Button from "../../components/ui/button/Button";
import SideCard from "../../components/card/SideCard";
<<<<<<< HEAD
import {Modal} from "../../components/ui/modal/Modal"
import CampaignCard from "../../components/card/CampaignCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchApprovedCampaigns } from "../../redux/slices/approvedCampaignSlice";
=======
import { fetchApprovedCampaigns } from "../../redux/slices/approvedCampaignSlice";
import { useSelector, useDispatch } from "react-redux";
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
import { countApprovedCampaigns } from "../../util/helper/sumFunctions";

const RetailerDashboard = () => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("Day");
<<<<<<< HEAD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const dispatch = useDispatch();

  const campaigns = useSelector((state) => state.approvedCampaigns.campaigns) || [];

  console.log(campaigns)

  useEffect(() => {
    dispatch(fetchApprovedCampaigns());
=======
  const options = ["Day", "Week", "Month"];

  const dispatch = useDispatch();



  const campaigns = useSelector((state) => state.approvedCampaigns.campaigns);

  useEffect(() => {
    dispatch(fetchApprovedCampaigns())
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
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

<<<<<<< HEAD
  const sumActiveAds = countApprovedCampaigns(campaigns);

  const statCards = [
    {
      title: "Total Earnings (This Month)",
      value: 2545900.45,
      change: "+15%",
      bgGradient: "bg-gradient-to-l from-red-100 to-gray-50",
      currency: true,
    },
    {
      title: "Active Ads",
      value: sumActiveAds,
      change: "+2.5%",
      bgGradient: "bg-gradient-to-l from-amber-100 to-gray-50",
    },
    {
      title: "Data Usage",
      value: 8102995,
      change: "+15%",
      bgGradient: "bg-gradient-to-l from-gray-100 to-gray-50",
    },
  ];

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const options = ["Day", "Week", "Month"];

  // Chart Data
=======
  // Bar chart data
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [10, 20, 15, 30, 25, 35, 5];
  const chartData = days.map((day, index) => ({
    day,
    revenue: data[index],
  }));

<<<<<<< HEAD
  const areaChartData = [
=======
  // Area chart data
  const dataa = [
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
    { day: "Sun", dataUsage: 70, avgOrder: 40 },
    { day: "Mon", dataUsage: 60, avgOrder: 50 },
    { day: "Tue", dataUsage: 65, avgOrder: 30 },
    { day: "Wed", dataUsage: 50, avgOrder: 60 },
    { day: "Thu", dataUsage: 55, avgOrder: 45 },
    { day: "Fri", dataUsage: 75, avgOrder: 35 },
    { day: "Sat", dataUsage: 68, avgOrder: 55 },
  ];

<<<<<<< HEAD
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome,
          <span className="text-[#445E94] font-bold text-xl ml-2">
            {name || "Retailer"}
          </span>
        </h1>

=======
const sumActiveAds = countApprovedCampaigns(campaigns || []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome,
          <span className="text-[#445E94] font-bold text-xl ml-2">{name || "Retailer"}</span>
        </h1>
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
        <div className="flex items-center rounded-lg">
          {options.map((option) => (
            <Button
              key={option}
              label={option}
<<<<<<< HEAD
              className={`rounded-none ${selected === option ? "" : "bg-gray-200 text-gray-700"}`}
=======
              className={`rounded-none ${
                selected === option ? "" : "bg-gray-200 text-gray-700"
              }`}
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
              onClick={() => setSelected(option)}
              type="button"
              loading={false}
              disabled={false}
              isIcon={false}
            />
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<<<<<<< HEAD
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
                : new Intl.NumberFormat().format(card.value)
            }
            change={card.change}
            bgGradient={card.bgGradient}
          />
        ))}
      </div>

      {/* Main Section */}
      <div className="w-full h-auto">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          {/* Revenue Bar Chart */}
          <div className="bg-white rounded-lg shadow flex flex-col w-full lg:w-1/2 h-[483px]">
=======
        <StatCard
          title="Total Earnings (This Month)"
          value="2545900.45"
          change="+15%"
          bgGradient="bg-gradient-to-l from-red-100 to-gray-50"
          currency={true}
        />
        <StatCard
          title="Active Ads"
          value={sumActiveAds}
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
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
            <div className="text-gray-900 text-lg lg:text-xl border-b border-gray-300 px-4 py-2">
              <p className="font-bold">Total Revenue</p>
            </div>
            <div className="p-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} horizontal={true} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
<<<<<<< HEAD
                  <YAxis domain={[0, 40]} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
=======
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
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
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
<<<<<<< HEAD
          <div className="w-full lg:w-2/3 h-[483px]">
            <SideCard
              ads={campaigns}
              title="Active Ads"
              onAdClick={(campaign) => {
                setIsModalOpen(true);
                setSelectedCampaign(campaign);
              }}
            />

            <Modal
              isOpen={isModalOpen}
              onClose={handleClose}
              title="Campaign Details"
              bgcolor="bg-white"
              titleStyle="text-gray-900"
              key={selectedCampaign?.id} // Reset scroll on modal open
              size="lg"
              
            >
              {selectedCampaign && <CampaignCard campaign={selectedCampaign} />}
            </Modal>
=======
          <div className="w-2/3 h-[483px]">
            <SideCard ads={campaigns} title="Active Ads" />
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-xl shadow p-6 w-full mt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Data Usage</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
              <AreaChart data={areaChartData}>
=======
              <AreaChart data={dataa}>
>>>>>>> e048f842fa827593a9684113d4b872b9102b0a98
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "dataUsage" ? "Data Usage" : "Avg Order",
                  ]}
                />
                <Area
                  type="linear"
                  dataKey="dataUsage"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                  name="Data Usage"
                />
                <Area
                  type="linear"
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