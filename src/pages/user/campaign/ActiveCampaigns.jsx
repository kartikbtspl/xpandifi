import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import StatusBadge from "../../../components/ui/badges/StatusBadge"



const ActiveCampaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, fetched } = useSelector(
    (state) => state.campaign
  );



  const filter_camp = useMemo(
  () =>
    campaigns?.filter((c) => c.isPayment)
      .map((c) => ({
        ...c,
        status: c.isActive ? "ACTIVE" : "INACTIVE",
      }))
      .sort((a, b) => {
        return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
      }),
  [campaigns]
);

  //  Fetch on mount
  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    {
      id: "budget",
      label: "Amount",
      render: (row) => `₹ ${row.baseBid}`,
    },
    {
      id: "status",
      label: "Status",
      render: (row) => <StatusBadge isActive={row.isActive} size={11} />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
      <ReusableTable
        columns={columns}
        rows={filter_camp}
        loading={loading}
        onRefresh={refreshCampaigns}
        filterKey="status"
        filterOptions={["all", "ACTIVE", "INACTIVE"]}
        order={"desc"}
        orderBy={"updatedAt"}
        searchableColumns={["name","budget","brandName","campaignCode"]}
      />
    </div>
  );
};

export default ActiveCampaigns;