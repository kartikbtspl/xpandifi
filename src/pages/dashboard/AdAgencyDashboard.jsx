import React, { useEffect, useState } from "react";
import StatCard from "../../components/card/StatCard";
import ReusableTable from "../../components/table/ReusableTable";
import HeaderSection from "../../components/ui/header-section/HeaderSection";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getBaseBidSumsByStatus,
  getMaxBidCapSumsByStatus,
} from "../../util/helper/sumFunctions";

const AdAgencyDashboard = () => {
  const navigate = useNavigate();
  const { campaigns } = useSelector((state) => state.campaign);
  const { profile: user } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [baseBidSums, setBaseBidSums] = useState({});
  const [maxBidCapSums, setMaxBidCapSums] = useState({});



  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      setBaseBidSums(getBaseBidSumsByStatus(campaigns.data))
      setMaxBidCapSums(getMaxBidCapSumsByStatus(campaigns.data));
      const formatted = campaigns.data.map((item, index) => {
        let statusBadge;

        switch (item.isApproved) {
          case "APPROVED":
            statusBadge = (
              <div className="p-1 rounded-full text-center bg-green-100">
                <p className="text-green-600">APPROVED</p>
              </div>
            );
            break;
          case "REJECTED":
            statusBadge = (
              <div className="p-1 rounded-full text-center bg-red-100">
                <p className="text-red-600">REJECTED</p>
              </div>
            );
            break;
          default:
            statusBadge = (
              <div className="p-1 rounded-full text-center bg-yellow-100">
                <p className="text-yellow-600">PENDING</p>
              </div>
            );
        }

        return {
          id: index + 1,
          name: item.campaignName || "Untitled Campaign",
          slot: item.timings || `${item.startTime} - ${item.endTime}`,
          bidAmount: item.baseBid || 0,
          bids: item.bidsInSameSlot || Math.floor(Math.random() * 100),
          status: statusBadge, // ✅ JSX for APPROVED/REJECTED/PENDING only
          resultIn: item.endDate || "N/A",
          raw: item,
        };
      });

      setRows(formatted);
    }
  }, [campaigns]);

 

  const statsData = [
    { title: "Revenue", value: "25.1k", change: "+15%", currency: true },
    { title: "Ad Clicks", value: "25.1k", change: "+2.5%", currency: false },
    {
      title: "Campaign Approved Base Values",
      value: baseBidSums?.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
    {
      title: "Approved Successful Bid",
      value: maxBidCapSums?.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
  ];



  const columns = [
    {
      id: "name",
      label: "Campaign Name",
      renderCell: (row) => (
        <span className="text-blue-600 hover:underline cursor-pointer">
          {row.name}
        </span>
      ),
    },
    { id: "slot", label: "Slot" },
    { id: "bidAmount", label: "Bid Amount", numeric: true },
    { id: "bids", label: "Bids In Same Slot", numeric: true },
    { id: "status", label: "Status" },
    { id: "resultIn", label: "Result In" },
  ];

  return (
    <div className="w-full">
      <HeaderSection
        subtitle={user?.fullName || "Ad Agency"}
        title="Welcome,"
        showButton={true}
        buttonLabel="Create Campaign"
        onButtonClick={() => navigate("/create-campaign")}
        subtitleClass="text-indigo-700 font-bold text-base"
      />
      <div
        className="grid gap-4 w-full mb-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
      <ReusableTable columns={columns} rows={rows} />
    </div>
  );
};

export default AdAgencyDashboard;
