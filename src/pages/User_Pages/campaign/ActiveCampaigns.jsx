import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../redux/slices/User/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import StatusBadge from "../../../components/ui/badges/StatusBadge"


const formatActiveCampaigns = (data = []) =>
  data.map((item, index) => ({
    id: index + 1,
    campaignCode: item.campaignCode,
    name: item.campaignName || item.name || "Untitled Campaign",
    start: `${item.startDate} - ${item.startTime}`,
    end: `${item.endDate} - ${item.endTime}`,
    isActive: item.isActive, //  directly from backend
    status: item.isActive ? "ACTIVE" : "INACTIVE",  // ✅ add explicit status
    raw: item,
  }));

const ActiveCampaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, fetched } = useSelector((state) => state.campaign);

  const [rows, setRows] = useState([]);

  //  Fetch on mount
  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);

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
      render: (row) => <StatusBadge isActive={row.isActive} size={11} />, //  return the badge
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