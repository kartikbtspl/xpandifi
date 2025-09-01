import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import moment from "moment";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import Button from "../../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayouts,
  updateWithdrawStatus,
} from "../../../redux/slices/admin/payoutSlice";
import Toast from "../../../components/ui/toast/Toast";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";

const WithdrawalRequest = () => {
  const dispatch = useDispatch();

  // ✅ correct selector (slice key = payouts)
  const { payouts, loading } = useSelector((state) => state.payout);
  console.log("payouts", payouts);

  const filterdPayouts = payouts.filter((c) => c.isPaid === false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPayouts());
  }, [dispatch]);

  // Open modal on row click
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handStatusUpdate = async (withdrawalId, status) => {
    try {
      await dispatch(
        updateWithdrawStatus({ id: withdrawalId, status })
      ).unwrap();

      if (status === "APPROVED") {
        Toast.success("Success", "Withdrawal request approved!");
      } else if (status === "REJECTED") {
        Toast.error("Rejected", "Withdrawal request rejected!");
      }

      dispatch(fetchPayouts());
      handleCloseModal();
    } catch (error) {
      Toast.error(
        "Error",
        error?.message || "Failed to update withdrawal status"
      );
    }
  };

  const columns = [
    {
      id: "withdrawalRequestCode",
      label: "Request Code",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "amount",
      label: "Amount",
      numeric: true,
      render: (row) => `₹ ${row.amount}`,
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      render: (row) => <span>{row.paymentMethod.toUpperCase()}</span>,
    },
    {
      id: "isApproved",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.isApproved} size={11} />,
    },
    {
      id: "updatedAt",
      label: "Date",
      render: (row) => (
        <span>{moment(row.updatedAt).format("DD/MM/YYYY")}</span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Typography variant="h5" fontWeight={600} mb={3}>
        Withdrawal Requests
      </Typography>

      <ReusableTable
        columns={columns}
        rows={filterdPayouts}
        onRowClick={handleRowClick}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        onRefresh={() => dispatch(fetchPayouts())}
        loading={loading}
        searchableColumns={[
          "withdrawalRequestCode",
          "name",
          "amount",
          "updatedAt",
          "paymentMethod",
        ]}
      />

      {/* Modal for details and accept/reject */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md">
        {selectedRow && (
          <div>
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Withdrawal Request
            </h2>

            {/* Content */}

            <div className="divide-y divide-gray-100 text-sm">
              {/* Request Code */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Request Code
                </span>
                <span className="text-gray-800 font-medium">
                  {selectedRow.withdrawalRequestCode}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Name
                </span>
                <span className="text-gray-800">{selectedRow.name}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Amount
                </span>
                <span className="text-gray-900 font-semibold text-base">
                  ₹{selectedRow.amount}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Payment Method
                </span>
                <span className="text-gray-800 uppercase">
                  {selectedRow.paymentMethod}
                </span>
              </div>

              {/* UPI ID */}
              {selectedRow?.upiId && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    UPI ID
                  </span>
                  <span className="text-gray-800">{selectedRow.upiId}</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </span>
                <ApprovalBadge status={selectedRow.isApproved} size={12} />
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Date
                </span>
                <span className="text-gray-800">
                  {moment(selectedRow.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>

            {/* Actions */}
            {selectedRow.isApproved === "PENDING" && (
              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => handStatusUpdate(selectedRow.id, "REJECTED")}
                  className="px-5 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  REJECT
                </button>
                <button
                  onClick={() => handStatusUpdate(selectedRow.id, "APPROVED")}
                  className="px-5 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  APPROVE
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawalRequest;
