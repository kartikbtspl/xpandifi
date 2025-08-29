import React, { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import Modal from "../../../components/modal/Modal";

const CampaignPaymentHistory = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const payments = [
    {
      campaignCod: "CAMP001",
      campaignName: "Summer Launch 2025",
      businessName: "Bright Media Agency",
      amount: 5000,
      paymentDate: "2025-06-15",
      status: "Paid",
    },
    {
      campaignCod: "CAMP002",
      campaignName: "Winter Sale Promo",
      businessName: "Growth Solutions Ltd.",
      amount: 3200,
      paymentDate: "2025-07-01",
      status: "Pending",
    },
    {
      campaignCod: "CAMP003",
      campaignName: "New Product Awareness",
      businessName: "AdVision Partners",
      amount: 7800,
      paymentDate: "2025-07-22",
      status: "Overdue",
    },
    {
      campaignCod: "CAMP004",
      campaignName: "Back-to-School Special",
      businessName: "Creative Spark Agency",
      amount: 4500,
      paymentDate: "2025-08-05",
      status: "Paid",
    },
    {
      campaignCod: "CAMP005",
      campaignName: "Holiday Mega Deals",
      businessName: "NextGen Marketing",
      amount: 10000,
      paymentDate: "2025-08-20",
      status: "Pending",
    },
  ];

  const columns = [
    { id: "campaignCod", label: "Campaign Code" },
    { id: "campaignName", label: "Campaign Name" },
    { id: "businessName", label: "Agency Business Name" },
    { id: "amount", label: "Amount", render:(row)=>(<div>
     { `₹${row.amount}.00`}
    </div>)},
    { id: "paymentDate", label: "Payment Date" },
    { id: "status", label: "Status" },
  ];

  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsOpen(true);
  };

  const handleRefresh = () => {
    alert("Refreshing payment history...");
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClass =
      "px-3 py-1 text-xs font-semibold rounded-full w-fit ";
    switch (status) {
      case "Paid":
        return baseClass + "bg-green-100 text-green-700";
      case "Pending":
        return baseClass + "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return baseClass + "bg-red-100 text-red-700";
      default:
        return baseClass + "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <ReusableTable
        columns={columns}
        rows={payments}
        onRowClick={handleRowClick}
        filterKey="status"
        filterOptions={["all", "Overdue", "Pending", "Paid"]}
        onRefresh={handleRefresh}
        searchableColumns={[
          "campaignCod",
          "campaignName",
          "businessName",
          "amount",
        ]}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        {selectedCampaign ? (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedCampaign.campaignName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Code:</span>{" "}
                {selectedCampaign.campaignCod}
              </p>
              <p>
                <span className="font-semibold">Agency:</span>{" "}
                {selectedCampaign.businessName}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                <span className="text-blue-600 font-bold">
                  ₹{selectedCampaign.amount.toLocaleString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedCampaign.paymentDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={getStatusBadge(selectedCampaign.status)}>
                  {selectedCampaign.status}
                </span>
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

export default CampaignPaymentHistory;
