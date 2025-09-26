import { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import Swal from "sweetalert2";
import Toast from "../../../components/ui/toast/Toast";
import EditCampaignModal from "./EditCampaignModal";
import { deleteCampaign,fetchCampaigns } from "../../../redux/slices/user/campaignSlice";

const DraftCampaign = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const filter_camp = campaigns.filter((c) => c.isDraft === true);
  console.log("Draft Campaigns:", filter_camp);

  const handleEdit = (row) => {
    setSelectedCampaign(row);
    setIsEditOpen(true);
  };

    const refreshCampaigns = () => {
      dispatch(fetchCampaigns());
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
        const campaignId = row.id || row._id || row.campaignCode;
        dispatch(deleteCampaign(campaignId))
          .unwrap()
          .then(() => {
            Toast.success("Deleted!", "The campaign has been deleted.");
          })
          .catch(() => {
            Toast.error("Error", "There was a problem deleting the campaign.");
          });
      }
    });
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    {
      id: "actions",
      label: "Actions",
      render: (row) => {
        return row.isDraft ? (
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
        ) : null;
      },
    },
  ];

  return (
    <div>
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">
        Campaign Drafts
      </h2>

      <ReusableTable
        columns={columns}
        rows={filter_camp}
        loading={loading}
        onRefresh={"refreshCampaigns"}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        order="desc"
        orderBy="updatedAt"
      />

      {isEditOpen && selectedCampaign && (
        <EditCampaignModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          campaignData={selectedCampaign}
          onSuccess={refreshCampaigns }
          isScond={true}
          seconLabel="Update Draft"
          btnLabel="Submit for Approval"
        />
      )}
    </div>
  );
};

export default DraftCampaign;
