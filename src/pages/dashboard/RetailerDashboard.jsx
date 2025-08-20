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
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/card/StatCard";
import Button from "../../components/ui/button/Button";
import SideCard from "../../components/card/SideCard";
import Modal from "../../components/modal/Modal";
// import {Modal} from "../../components/ui/modal/Modal"
import CampaignCard from "../../components/card/CampaignCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchApprovedCampaigns } from "../../redux/slices/approvedCampaignSlice";
import { countActivCampaigns } from "../../util/helper/sumFunctions";

const RetailerDashboard = () => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("Day");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const dispatch = useDispatch();

  const { campaigns, loading, fetched } =
    useSelector((state) => state.approvedCampaigns) || [];
  const activeCampaigns = campaigns.filter(campaign => {
  // Create full datetime for campaign end
  const endDateStr = campaign.endDate.split('T')[0]; // "2025-08-19"
  const endTimeStr = campaign.endTime; // "2AM"

  // Convert "2AM" to "02:00:00" format
  const timeParts = endTimeStr.match(/(\d+)(AM|PM)/i);
  if (!timeParts) return false;

  let hours = parseInt(timeParts[1]);
  const period = timeParts[2].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const formattedTime = `${hours.toString().padStart(2, '0')}:00:00`;
  const campaignEndDateTime = new Date(`${endDateStr}T${formattedTime}`);

  // ✅ Keep campaigns that haven't ended yet
  return campaignEndDateTime >= new Date();
});


  // console.log("Today active campaigns  ", activeCampaigns);
  // console.log("Campaigns", campaigns);

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

  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchApprovedCampaigns());
    }
  }, [fetched, loading, dispatch]);

  const sumActiveAds = countActivCampaigns(campaigns);

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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [10, 20, 15, 30, 25, 35, 5];
  const chartData = days.map((day, index) => ({
    day,
    revenue: data[index],
  }));

  const areaChartData = [
    { day: "Sun", dataUsage: 70, avgOrder: 40 },
    { day: "Mon", dataUsage: 60, avgOrder: 50 },
    { day: "Tue", dataUsage: 65, avgOrder: 30 },
    { day: "Wed", dataUsage: 50, avgOrder: 60 },
    { day: "Thu", dataUsage: 55, avgOrder: 45 },
    { day: "Fri", dataUsage: 75, avgOrder: 35 },
    { day: "Sat", dataUsage: 68, avgOrder: 55 },
  ];

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

        <div className="flex items-center rounded-lg">
          {options.map((option) => (
            <Button
              key={option}
              label={option}
              className={`rounded-none ${selected === option ? "" : "bg-gray-200 text-gray-700"
                }`}
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
            <div className="text-gray-900 text-lg lg:text-xl border-b border-gray-300 px-4 py-2">
              <p className="font-bold">Total Revenue</p>
            </div>
            <div className="p-2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} horizontal={true} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 40]} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
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
          <div className="w-full lg:w-2/3 h-[483px]">
            <SideCard
              ads={activeCampaigns}
              title="Active Ads"
              onAdClick={(campaign) => {
                setIsModalOpen(true);
                setSelectedCampaign(campaign);
              }}
            />

            <Modal
              isOpen={isModalOpen}
              onClose={handleClose}
              bgcolor="bg-white"
              titleStyle="text-gray-900"
              key={selectedCampaign?.id} // Reset scroll on modal open
              size="xl"
            >
              {selectedCampaign && <CampaignCard campaign={selectedCampaign} />}
            </Modal>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-xl shadow p-6 w-full mt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Data Usage</h3>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData}>
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
