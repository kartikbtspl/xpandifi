import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  fetchAllTickets,
  updateTicketStatus,
} from "../../../redux/slices/user/ticketsSlice";
import Button from "../../../components/ui/button/Button";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import TicketDetailsModal from "../../shared/TicketDetailsModal";
import Toast from "../../../components/ui/toast/Toast";
import ChatOption from "../../../components/chat/ChatOption";

const TicketRaise = () => {
  const dispatch = useDispatch();
  const { tickets, loading, formLoading } = useSelector((state) => state.userTicket);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const methods = useForm();
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  // Commented out fetchTickets
  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const openTicketModal = () => setIsTicketModalOpen(true);
  const closeTicketModal = () => setIsTicketModalOpen(false);


  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  const columns = [
    {
      id: "ticketCode",
      label: "Ticket#",
    },
    {
      id: "queryType",
      label: "Issue",
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const styles = {
          OPEN: "bg-red-100 text-red-700",
          INPROGRESS: "bg-yellow-100 text-yellow-700",
          RESOLVED: "bg-green-100 text-green-700",
          CLOSED: "bg-gray-100 text-gray-700",
        };
        return (
          <span
            className={`px-3 py-1 rounded text-sm ${
              styles[row.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  const ticketFields = [
    [
      {
        name: "queryType",
        label: "Query Type",
        type: "select",
        options: [
          { label: "Payment", value: "payment" },
          { label: "Device", value: "device" },
          { label: "Campaign", value: "campaign" },
          { label: "Other", value: "other" },
        ],
        required: true,
        gridSpan: 1,
      },
    ],
    [
      {
        name: "description",
        label: "Description",
        type: "text-area",
        placeholder: "Please describe your issue in detail...",
        required: true,
      },
    ],
    [
      {
        name: "media",
        label: "Upload Media",
        type: "file",
        accept: "image/*,.pdf,.doc,.docx",
        multiple: true,
        helperText: "Format: jpeg, png, mp4. Max file size: 5MB.",
      },
    ],
  ];

  const handleRowClick = (row) => {
    setSelectedTicket(row);
    setIsDetailsModalOpen(true);
  };

  const handleUpdate = useCallback(
    async (data) => {
      try {
        await dispatch(updateTicketStatus({ id: selectedTicket.id, data }));
        handleCloseDetailsModal()
        Toast.success("Raised!", "Ticket status updated successfully!");
      } catch (error) {
        Toast.error(
          "Failed!",
          error.message || "Failed to update status of Ticket!"
        );
        console.error(error);
      }
    },
    [dispatch, selectedTicket?.id]
  );

  const handleSubmitTicket = useCallback(
    async (data) => {
      console.log("submitting data", data);
      try {
        await dispatch(createTicket(data));
        closeTicketModal();
        methods.reset();
        Toast.success("Raised!", "Ticket raised successfully!");
      } catch (error) {
        console.log(error);
        Toast.error("Failed!", error.message || "Failed to raise the Ticket!");
      }
    },
    [dispatch, closeTicketModal, methods]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Tickets</h2>

        <Button
          isIcon={false}
          label="Raise Ticket"
          onClick={openTicketModal}
          type="button"
        />
      </div>

      <div className="flex w-full justify-between space-x-4">
        <div className="w-2/3">
          <ReusableTable
            columns={columns}
            rows={tickets || []}
            filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "CLOSED"]}
            filterKey="status"
            onRowClick={handleRowClick}
            loading={loading}
            onRefresh={() => dispatch(fetchAllTickets())}
            searchableColumns={["queryType", "ticketCode", "status"]}
          />
        </div>
        <div className="w-1/3">
          <ChatOption />
        </div>
      </div>

      <Modal
        isOpen={isTicketModalOpen}
        onClose={closeTicketModal}
        size="lg"
        containerClassName="bg-white rounded-xl w-full max-w-3xl"
      >
        <FormBuilder
          title="Ticket Form"
          onSubmit={handleSubmitTicket}
          fieldsConfig={ticketFields}
          methods={methods}
          submitLabel="Submit Ticket"
          isPlus={false}
          indicator={`Date ${formattedDate}`}
        />
      </Modal>

      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        ticket={selectedTicket}
        role="user"
        onSubmit={handleUpdate}
        formLoading={formLoading}
      />
    </div>
  );
};

export default TicketRaise;
