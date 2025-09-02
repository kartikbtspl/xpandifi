import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import moment from "moment";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayouts,
  updateWithdrawStatus,
} from "../../../redux/slices/admin/payoutSlice";
import Toast from "../../../components/ui/toast/Toast";
import RejectWithdrawalModal from "./RejectWithdrawalRequest";

const WithdrawalRequest = () => {
  const dispatch = useDispatch();
  const { payouts, loading } = useSelector((state) => state.payout);

  const filteredPayouts = payouts.filter((c) => c.isPaid === false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Reject modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    dispatch(fetchPayouts());
  }, [dispatch]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleStatusUpdate = async (withdrawalId, status, remarkText = "") => {
    try {
      await dispatch(
        updateWithdrawStatus({ id: withdrawalId, status, remark: remarkText })
      ).unwrap();

      if (status === "APPROVED") {
        Toast.success("Success", "Withdrawal request approved!");
      } else if (status === "REJECTED") {
        Toast.error("Rejected", "Withdrawal request rejected!");
      }

      dispatch(fetchPayouts()); // ✅ always refetch from backend
      handleCloseModal();
    } catch (error) {
      Toast.error(
        "Error",
        error?.message || "Failed to update withdrawal status"
      );
    }
  };

  const columns = [
    { id: "withdrawalRequestCode", label: "Request Code" },
    { id: "name", label: "Name" },
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
      render: (row) => {
        const status = row.isApproved;
        let bgColor = "bg-gray-200";
        let textColor = "text-gray-700";

        if (status === "PENDING") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
        } else if (status === "REJECTED") {
          bgColor = "bg-red-100";
          textColor = "text-red-700";
        } else if (status === "APPROVED") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        }

        return (
          <span
            className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-semibold inline-block`}
          >
            {status}
          </span>
        );
      },
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
        rows={filteredPayouts}
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

      {/* Main Details Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md">
        {selectedRow && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Withdrawal Request
            </h2>

            {/* Details */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Request Code</span>
                <span>{selectedRow.withdrawalRequestCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{selectedRow.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium text-gray-900">
                  ₹{selectedRow.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="uppercase">{selectedRow.paymentMethod}</span>
              </div>
              {selectedRow?.upiId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">UPI ID</span>
                  <span>{selectedRow.upiId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedRow.isApproved === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : selectedRow.isApproved === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedRow.isApproved}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{moment(selectedRow.createdAt).format("DD/MM/YYYY")}</span>
              </div>

              {/* Show rejection remark if rejected */}
              {selectedRow.isApproved === "REJECTED" && selectedRow.remark && (
                <div className="flex flex-col">
                  <span className="text-gray-500">Remark</span>
                  <span className="mt-1 px-1 py-2 bg-gray-100 rounded">
                    {selectedRow.remark || " "}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons (only when pending) */}
            {selectedRow.isApproved === "PENDING" && (
              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-4 py-2 cursor-pointer rounded-full bg-red-200 text-red-700 font-semibold transition duration-150 hover:scale-95"
                >
                  REJECT
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedRow.id, "APPROVED")
                  }
                  className="px-4 py-2 cursor-pointer rounded-full bg-green-200 text-green-700 font-semibold transition duration-150 hover:scale-95"
                >
                  APPROVE
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <RejectWithdrawalModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRemark("");
        }}
        remark={remark}
        setRemark={setRemark}
        onSubmit={() => {
          handleStatusUpdate(selectedRow.id, "REJECTED", remark);
          setIsRejectModalOpen(false);
          setRemark(""); // ✅ clear after submit
        }}
      />
    </div>
  );
};

export default WithdrawalRequest;

