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

// const handStatusUpdate = async (withdrawalId, status) => {
//   await dispatch(updateWithdrawStatus({ id: withdrawalId, status }));
//   dispatch(fetchPayouts());
//   handleCloseModal();
// };
const handStatusUpdate = async (withdrawalId, status) => {
  try {
    await dispatch(updateWithdrawStatus({ id: withdrawalId, status })).unwrap();

    if (status === "APPROVED") {
      Toast.success("Success", "Withdrawal request approved!");
    } else if (status === "REJECTED") {
      Toast.error("Rejected", "Withdrawal request rejected!");
    }

    dispatch(fetchPayouts());
    handleCloseModal();
  } catch (error) {
    Toast.error("Error", error?.message || "Failed to update withdrawal status");
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
        rows={filterdPayouts}
        onRowClick={handleRowClick}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        onRefresh={() => dispatch(fetchPayouts())}
        loading={loading}
      />

      {/* Modal for details and accept/reject */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md">
        {selectedRow && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <p>
              <strong>Request Code:</strong> {selectedRow.withdrawalRequestCode}
            </p>
            <p>
              <strong>Name:</strong> {selectedRow.name}
            </p>
            <p>
              <strong>Amount:</strong> ₹{selectedRow.amount}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedRow.paymentMethod.toUpperCase()}
            </p>
            <p>
              <strong>Status:</strong> {selectedRow.isApproved}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {moment(selectedRow.createdAt).format("DD/MM/YYYY")}
            </p>
            <div className="flex gap-4 mt-6 justify-end">
              {selectedRow.isApproved === "PENDING" && (
                <>
                  <Button
                    isIcon={false}
                    label="Approve"
onClick={() => handStatusUpdate(selectedRow.id, "APPROVED")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  />
                  <Button
                    isIcon={false}
                    label="Reject"
onClick={() => handStatusUpdate(selectedRow.id, "REJECTED")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  />
                </>
              )}
              <Button
                isIcon={false}
                label="Close"
                onClick={handleCloseModal}
                className="bg-gray-400 hover:bg-gray-600"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawalRequest;