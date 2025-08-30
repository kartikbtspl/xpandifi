import React, { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import Toast from "../../../components/ui/toast/Toast";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/ui/button/Button";

const RevenueRequest = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [campaigns, setCampaigns] = useState([
    {
      campaignCode: "CAMP001",
      campaignName: "Summer Launch 2025",
      startDate: "2025-06-01",
      endDate: "2025-06-15",
      isRequested: false,
    },
    {
      campaignCode: "CAMP002",
      campaignName: "Winter Sale Promo",
      startDate: "2025-06-15",
      endDate: "2025-07-01",
      isRequested: true,
    },
    {
      campaignCode: "CAMP003",
      campaignName: "New Product Awareness",
      startDate: "2025-07-01",
      endDate: "2025-07-22",
      isRequested: false,
    },
    {
      campaignCode: "CAMP004",
      campaignName: "Back-to-School Special",
      startDate: "2025-07-20",
      endDate: "2025-08-05",
      isRequested: true,
    },
    {
      campaignCode: "CAMP005",
      campaignName: "Holiday Mega Deals",
      startDate: "2025-08-05",
      endDate: "2025-08-20",
      isRequested: false,
    },
  ]);

  const handleRequest = (row) => {
    Toast.success("Request sent successfully!");
    // Update the campaigns state to mark as requested
    setCampaigns((prev) =>
      prev.map((c) =>
        c.campaignCode === row.campaignCode ? { ...c, isRequested: true } : c
      )
    );
    // setSelectedCampaign(row);
    // setIsOpen(true);
  };

  const columns = [
    { id: "campaignCode", label: "Campaign Code" },
    { id: "campaignName", label: "Campaign Name" },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) =>
        row.isRequested ? (
          <span className="text-gray-500 text-sm">Request already sent</span>
        ) : (
          <Button
            label="Request"
            onClick={() => handleRequest(row)}
            isIcon={false}
          />
        ),
    },
  ];

  const handleRefresh = () => {
    alert("Refreshing campaigns...");
  };

  return (
    <>
      <ReusableTable
        columns={columns}
        rows={campaigns}
        onRefresh={handleRefresh}
        searchableColumns={["campaignCode", "campaignName"]}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        {selectedCampaign ? (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedCampaign.campaignName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Code:</span>{" "}
                {selectedCampaign.campaignCode}
              </p>
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(selectedCampaign.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(selectedCampaign.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No campaign selected</p>
        )}
      </Modal>
    </>
  );
};

export default RevenueRequest;
