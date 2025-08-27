import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  fetchCampaigns,
  deleteCampaign,
} from "../../../redux/slices/User/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import EditCampaignModal from "./EditCampaignModal";
import Button from "../../../components/ui/button/Button";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";

// Format campaigns for table
const formatCampaigns = (data = []) =>
  data.map((item, index) => ({
    id: index + 1,
    campaignCode: item.campaignCode,
    image: item.productFiles,
    name: item?.name || "Untitled Campaign",
    start: `${item.startDate} - ${item.startTime}`,
    end: `${item.endDate} - ${item.endTime}`,
    status: item.isApproved || "UNKNOWN",
    raw: item,
  }));

const CampaignList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { campaigns, loading,fetched } = useSelector((state) => state.campaign);

  const isViewAnalytics = location.pathname.includes("checkout");

  const [rows, setRows] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch campaigns on mount
  useEffect(() => {
    console.log("fetched:", fetched, "Loading ", loading)
    if(!fetched && !loading){
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);

  // Filter and sort campaigns by updatedAt (descending)
  useEffect(() => {
    const data = campaigns?.data ?? [];

    const filtered = data
      .filter((c) => c.isPayment === false)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // optional

    setRows(formatCampaigns(filtered));
  }, [campaigns]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  const handleEdit = (row) => {
    console.log("row:..", row.raw);
    setSelectedCampaign(row.raw);
    setIsEditOpen(true);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#445E94",
    }).then((result) => {
      if (result.isConfirmed) {
        const campaignId = row.raw.id || row.raw._id || row.raw.campaignCode;
        dispatch(deleteCampaign(campaignId))
          .unwrap()
          .then(() => {
            Swal.fire("Deleted!", "The campaign has been deleted.", "success");
            refreshCampaigns();
          })
          .catch(() => {
            Swal.fire(
              "Error",
              "There was a problem deleting the campaign.",
              "error"
            );
          });
      }
    });
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "start", label: "Start Date" },
    { id: "end", label: "End Date" },
    {
      id: "status",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.status} size={12} />,
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => {
        const isApproved = row.raw?.isApproved;
        const canEdit = isApproved === "PENDING" || isApproved === "REJECTED";

        return canEdit ? (
          <div className="flex gap-2">
            <button
              className="text-blue-600 bg-blue-200 hover:underline cursor-pointer px-2 py-1 rounded"
              onClick={() => handleEdit(row)}
            >
              Edit
            </button>
            <button
              className="text-red-600 bg-red-200 hover:underline cursor-pointer px-2 py-1 rounded"
              onClick={() => handleDelete(row)}
            >
              Delete
            </button>
          </div>
        ) : (
          <Link to="checkout" state={{ row }}>
            <Button
              type={"button"}
              label={"Make Payment"}
              isIcon={false}
              className="cursor-pointer"
            />
          </Link>
        );
      },
    },
  ];

  return (
    <>
      {isViewAnalytics ? (
        <Outlet />
      ) : (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Campaigns</h2>

          <ReusableTable
            columns={columns}
            rows={rows}
            loading={loading}
            onRefresh={refreshCampaigns}
            filterKey="status"
            filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
          />

          {isEditOpen && selectedCampaign && (
            <EditCampaignModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              campaignData={selectedCampaign}
              onSuccess={refreshCampaigns}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CampaignList;
