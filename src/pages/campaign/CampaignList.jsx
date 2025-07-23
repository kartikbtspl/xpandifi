import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns, deleteCampaign } from "../../redux/slices/campaignSlice";
import ReusableTable from "../../components/table/ReusableTable";
import EditCampaignModal from "./EditCampaignModal";
import Swal from "sweetalert2";

const CampaignList = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => {
        // Determine the status badge
        let statusBadge;

        if (item.isApproved === "APPROVED") {
          statusBadge = (
            <div className="p-1 rounded-full text-center bg-green-100">
              <p className="text-green-600">APPROVED</p>
            </div>
          );
        } else if (item.isApproved === "REJECTED") {
          statusBadge = (
            <div className="p-1 rounded-full text-center bg-red-100">
              <p className="text-red-600">REJECTED</p>
            </div>
          );
        } else {
          statusBadge = (
            <div className="p-1 rounded-full text-center bg-yellow-100">
              <p className="text-yellow-600">PENDING</p>
            </div>
          );
        }

        return {
          id: index + 1,
          campaignCode: item.campaignCode,
          image: item.productFiles,
          name: item.campaignName || "Untitled Campaign",
          start: `${item.startDate} - ${item.startTime}`,
          end: `${item.endDate} - ${item.endTime}`,
          status: statusBadge,
          raw: item,
        };
      });

      setRows(formatted);
    }
  }, [campaigns]);

  const handleEdit = (rowData) => {
    setSelectedCampaign(rowData.raw);
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
      // Get the actual campaign ID - adjust based on your data structure
      const campaignId = row.raw.id || row.raw._id || row.raw.campaignCode;

      dispatch(deleteCampaign(campaignId))
        .unwrap()
        .then(() => {
          Swal.fire("Deleted!", "The campaign has been deleted.", "success");
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error", "There was a problem deleting the campaign.", "error");
        });
    
      }
  });
};

  const columns = [
    {
      id: "campaignCode",
      label: "Campaign ID",
      numeric: false,
      render: (row) => <span className="">{row.campaignCode}</span>,
    },
    {
      id: "name",
      label: "Campaign Name",
      numeric: false,
      render: (row) => <span className="">{row.name}</span>,
    },
    { id: "start", label: "Start Date", numeric: false },
    { id: "end", label: "End Date", numeric: false },
    { id: "status", label: "Status", numeric: false },
    {
      id: "actions",
      label: "Actions",
      render: (row) => {
        // FIXED: Access row.raw.isApproved and use correct logic
        const isApproved = row.raw?.isApproved;
        const canEdit = isApproved === "PENDING" || isApproved === "REJECTED";

        return canEdit ? (
          <div className="flex gap-2">
            <button
              className="text-blue-600 bg-blue-200 hover:underline px-2 py-1 rounded cursor-pointer"
              onClick={() => handleEdit(row)}
            >
              Edit
            </button>
            <button
              className="text-red-600 bg-red-200 hover:underline px-2 py-1 rounded cursor-pointer"
              onClick={() => handleDelete(row)}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="flex gap-2 text-gray-500">No Actions Available</div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
     
        <ReusableTable columns={columns} rows={rows} loading={loading} />
      {isEditOpen && selectedCampaign && (
        <EditCampaignModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          campaignData={selectedCampaign}
          onSuccess={refreshCampaigns}
        />
      )}
    </div>
  );
};

export default CampaignList;
