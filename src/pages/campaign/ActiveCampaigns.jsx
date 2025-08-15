import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../redux/slices/campaignSlice";
import ReusableTable from "../../components/table/ReusableTable";

//  Render badge for ACTIVE/INACTIVE based on isActive
const renderStatusBadge = (row) => {
  const status = row.isActive ? "ACTIVE" : "INACTIVE";
  const classes = {
    ACTIVE: "bg-green-100 text-green-600",
    INACTIVE: "bg-red-100 text-red-600",
  }[status];

  return (
    <div className={`p-1 rounded-full text-center ${classes}`}>
      <p>{status}</p>
    </div>
  );
};

//  Format campaign objects into table rows
const formatActiveCampaigns = (data = []) =>
  data.map((item, index) => ({
    id: index + 1,
    campaignCode: item.campaignCode,
    name: item.campaignName || item.name || "Untitled Campaign",
    start: `${item.startDate} - ${item.startTime}`,
    end: `${item.endDate} - ${item.endTime}`,
    isActive: item.isActive, //  directly from backend
    raw: item,
  }));

const ActiveCampaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);

  const [rows, setRows] = useState([]);

  //  Fetch on mount
  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  //  Filter campaigns: isApproved === "APPROVED" && isPayment === true
  useEffect(() => {
    const allCampaigns = campaigns?.data ?? [];
    const filtered = allCampaigns.filter(
      (c) => c.isApproved === "APPROVED" && c.isPayment === true
    );
    setRows(formatActiveCampaigns(filtered));
  }, [campaigns]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "start", label: "Start Date" },
    { id: "end", label: "End Date" },
    {
      id: "status",
      label: "Status",
      render: (row) => renderStatusBadge(row), //  return the badge
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
      <ReusableTable
        columns={columns}
        rows={rows}
        loading={loading}
        onRefresh={refreshCampaigns}
        filterKey="status"
        filterOptions={["all", "ACTIVE", "INACTIVE"]}
      />
    </div>
  );
};

export default ActiveCampaigns;