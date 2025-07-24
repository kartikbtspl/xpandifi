import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../redux/slices/campaignSlice";

const BidManagement = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => ({
        id: index + 1,
        name: item.campaignName || "Untitled Campaign",
        slot: item.timings || `${item.startTime} - ${item.endTime}`,
        bidAmount: item.baseBid || Math.floor(Math.random() * 10000 + 1000),
        status: item.status || "Active",
        raw: item,
      }));
      setRows(formatted);
    }
  }, [campaigns]);

  const handleMoreOptions = (row) => {
    alert(`More options for ${row.name}`);
    // You can show a dropdown/menu here
  };

  const columns = [
    { id: "name", label: "Campaign Name", numeric: false },
    { id: "slot", label: "Slot", numeric: false },
    { id: "bidAmount", label: "Bid Amount", numeric: true },
    { id: "status", label: "Status", numeric: false },
    {
      id: "actions",
      label: "More Options",
      renderCell: (row) => (
        <button
          onClick={() => handleMoreOptions(row)}
          className="text-blue-600 hover:underline"
        >
          Options
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Bid Management</h2>
      <ReusableTable columns={columns} rows={rows} loading= {loading} />
    </div>
  );
};

export default BidManagement;
