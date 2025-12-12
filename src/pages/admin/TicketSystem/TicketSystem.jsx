import { useEffect, useState, useCallback, useMemo } from "react";
import { Typography, Chip } from "@mui/material";
import StatCard from "../../../components/card/StatCard";
import ReusableTable from "../../../components/table/ReusableTable";
import Toast from "../../../components/ui/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import TicketDetailsModal from "../../shared/TicketDetailsModal";
import {
  fetchAllTickets,
  updateTicketStatus,
} from "../../../redux/slices/admin/ticketsSlice";

function getStatusCounts(arr) {
  return arr.reduce(
    (acc, item) => {
      if (item.status in acc) {
        acc[item.status] += 1;
      } else {
        acc[item.status] = 1;
      }
      acc.total += 1;
      return acc;
    },
    { total: 0 }
  );
}

const TicketSystem = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tickets, loading, formLoading } = useSelector(
    (state) => state.adminTicket
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleRowClick = (row) => {
    setSelectedTicket(row), setIsModalOpen(true);
  };

  const {
    OPEN = 0,
    INPROGRESS = 0,
    RESOLVED = 0,
    CLOSED = 0,
    total = 0,
  } = useMemo(() => {
    return getStatusCounts(tickets || []);
  }, [tickets]);

  const statsData = [
    {
      title: "Total Tickets",
      value: total,
      currency: false,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-60",
    },
    {
      title: "Open",
      value: OPEN,
      currency: false,
      changeColor: "text-red-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-red-100",
    },
    {
      title: "In Progress",
      value: INPROGRESS,
      currency: false,
      changeColor: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
    },
    {
      title: "Resolved",
      value: RESOLVED,
      currency: false,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-green-50 to-green-100",
    },
    {
      title: "Closed",
      value: CLOSED,
      currency: false,
      changeColor: "text-gray-600",
      bgGradient: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    },
  ];

  const handleUpdate = useCallback(
    async (data) => {
      try {
        await dispatch(updateTicketStatus({ id: selectedTicket.id, data }));
        handleClose()
        Toast.success("Raised!", "Ticket status updated successfully!");
        console.log(data);
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
      id: "businessName",
      label: "Business Name",
    },
    {
      id: "role",
      label: "Role",
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(), 
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

  return (
    <div>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Ticket System
      </Typography>

      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          rows={tickets || []}
          filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "CLOSED"]}
          filterKey="status"
          onRowClick={handleRowClick}
          loading={loading}
          onRefresh={() => dispatch(fetchAllTickets())}
          searchableColumns={["ticketCode", "queryType", "status"]}
        />
      </div>

      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={handleClose}
        ticket={selectedTicket}
        onSubmit={handleUpdate}
        role="admin"
        formLoading={formLoading}
      />
    </div>
  );
};

export default TicketSystem;
