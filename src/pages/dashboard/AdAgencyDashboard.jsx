import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import StatCard from "../../components/card/StatCard";
import ReusableTable from "../../components/table/ReusableTable";
import HeaderSection from "../../components/ui/header-section/HeaderSection";
import {
  getBaseBidSumsByStatus,
  getMaxBidCapSumsByStatus,
} from "../../util/helper/sumFunctions";
import { fetchCampaigns } from "../../redux/slices/campaignSlice";

// Helper: render status badge
const renderStatusBadge = (status) => {
  const normalized = status?.toUpperCase() ?? "UNKNOWN";
  const statusClass = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  }[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded text-sm ${statusClass}`}>
      {normalized}
    </span>
  );
};

// Helper: format rows for table
const formatCampaignData = (data = []) =>
  data.map((item, index) => ({
    id: index + 1,
    campaignCode: item.campaignCode,
    name: item.campaignName || "Untitled Campaign",
    slot: item.timings || `${item.startTime} - ${item.endTime}`,
    bidAmount: item.baseBid ?? 0,
    bids: item.bidsInSameSlot ?? Math.floor(Math.random() * 100),
    status: item.isApproved || "UNKNOWN",
    resultIn: item.endDate || "N/A",
    raw: item,
  }));

const AdAgencyDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { campaigns, loading } = useSelector((state) => state.campaign);
  const { profile: user } = useSelector((state) => state.user);

  const [rows, setRows] = useState([]);
  const [baseBidSums, setBaseBidSums] = useState({});
  const [maxBidCapSums, setMaxBidCapSums] = useState({});

  useEffect(() => {
    const campaignList = campaigns?.data ?? [];
    setRows(formatCampaignData(campaignList));
    setBaseBidSums(getBaseBidSumsByStatus(campaignList));
    setMaxBidCapSums(getMaxBidCapSumsByStatus(campaignList));
  }, [campaigns]);

  const statsData = [
    { title: "Revenue", value: "25.1k", change: "+15%", currency: true },
    { title: "Ad Clicks", value: "25.1k", change: "+2.5%", currency: false },
    {
      title: "Campaign Approved Base Values",
      value: baseBidSums.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
    {
      title: "Approved Successful Bid",
      value: maxBidCapSums.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
  ];

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "slot", label: "Slot" },
    { id: "bidAmount", label: "Bid Amount", numeric: true },
    { id: "bids", label: "Bids In Same Slot", numeric: true },
    {
      id: "status",
      label: "Status",
      render: (row) => renderStatusBadge(row.status),
    },
    { id: "resultIn", label: "Result In" },
  ];

  return (
    <div className="w-full">
      <HeaderSection
        title="Welcome,"
        subtitle={user?.fullName || "Ad Agency"}
        showButton
        buttonLabel="Create Campaign"
        onButtonClick={() => navigate("/create-campaign")}
        subtitleClass="text-[#445E94] font-bold text-xl"
        buttonClass="cursor-pointer"
      />

      <div
        className="grid gap-4 w-full mb-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {statsData.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <ReusableTable
        columns={columns}
        rows={rows}
        loading={loading}
        onRefresh={() => dispatch(fetchCampaigns())}
        filterKey="status"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
      />
    </div>
  );
};

export default AdAgencyDashboard;