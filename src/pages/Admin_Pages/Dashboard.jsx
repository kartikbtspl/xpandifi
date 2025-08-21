import { useMemo, useEffect } from "react";
import StatCard from "../components/atoms/card/StatCard";
import ReusableTable from "../components/atoms/table/ReusableTable";
import HeaderSection from "../components/ui/header-section/HeaderSection";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../redux/slices/campaignSlice";
import { fetchUserProfile } from "../redux/slices/userProfileSlice";

const AdminDashboard  = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaigns, loading, fetched } = useSelector(
    (state) => state.campaign
  );

  const { profile } = useSelector((state) => state.user);

  const handleReferesh = () => {
    dispatch(fetchCampaigns());
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [, dispatch]);

  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [fetched, loading, dispatch]);

  const {
    pendingCampaigns,
    approvedCampaigns,
    totalApprovedRevenue,
    totalPendingBid,
  } = useMemo(() => {
    const approved = campaigns.filter(
      (c) => c.isApproved?.toUpperCase() === "APPROVED"
    );
    const pending = campaigns.filter(
      (c) => c.isApproved?.toUpperCase() === "PENDING"
    );

    const totalApproved = approved.reduce(
      (sum, c) => sum + Number(c.baseBid || 0),
      0
    );

    const totalPending = pending.reduce(
      (sum, c) => sum + Number(c.baseBid || 0),
      0
    );

    return {
      approvedCampaigns: approved,
      pendingCampaigns: pending,
      totalApprovedRevenue: totalApproved,
      totalPendingBid: totalPending,
    };
  }, [campaigns]);

  const columns = [
    {
      id: "campaignCode",
      label: "Campaign ID",
      render: (row) => row.campaignCode || "N/A",
    },
    {
      id: "name",
      label: "Campaign Name",
      render: (row) => <span>{row.name}</span>,
    },
    {
      id: "brandName",
      label: "Brand Name",
    },
    {
      id: "schedule",
      label: "Schedule",
      render: (row) =>
        row.startTime && row.endTime
          ? `${row.startTime} - ${row.endTime}`
          : "N/A",
    },
    {
      id: "adType",
      label: "Ad Type",
    },
    {
      id: "baseBid",
      label: "Amount",
      render: (row) => `₹ ${row.baseBid} /-`,
    },
    {
      id: "isApproved",
      label: "Approval",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded text-sm ${
            row.isApproved === "APPROVED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.isApproved}
        </span>
      ),
    },
  ];

  const statsData = [
    {
      title: "Pending Bids",
      value: "25.1k",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-pink-100",
    },
    {
      title: "Open Requests",
      value: (totalPendingBid / 1000).toFixed(1) + "K",
      change: "+2.5%",
      currency: false,
      changeColor: "text-green-700",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
    },
    {
      title: "Total Revenue",
      value: (totalApprovedRevenue / 1000).toFixed(1) + "K",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-slate-50 to-blue-100",
    },
  ];

  return (
    <div className="w-full">
      <div>
        <HeaderSection
          subtitle={profile?.name}
          showButton={true}
          buttonLabel="Create Campaign"
          onButtonClick={() => navigate("/create-campaign")}
          subtitleClass="text-[#445E94] font-bold text-xl"
        />
      </div>
      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
      <div className="mt-6">
        <ReusableTable
          isFilter={false}
          columns={columns}
          rows={pendingCampaigns}
          loading={loading}
          onRefresh={handleReferesh}
        />
      </div>
    </div>
  );
};

export default AdminDashboard ;
