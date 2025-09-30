import { useEffect, useState, useCallback } from "react";
import { Typography, Chip } from "@mui/material";
import StatCard from "../../../components/card/StatCard";
import ReusableTable from "../../../components/table/ReusableTable";
import COLORS from "../../../constants/Colors";
import Toast from "../../../components/ui/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import TicketDetailsModal from "../../shared/TicketDetailsModal";
import {
  fetchAllTickets,
  updateTicketStatus,
} from "../../../redux/slices/admin/ticketsSlice";
const TicketSystem = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tickets,loading,formLoading } = useSelector((state) => state.adminTicket);
  const dispatch = useDispatch();
  // const counts = ticketCounts(rows);



  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };


 const  handleRowClick = (row)=>{
    setSelectedTicket(row),
    setIsModalOpen(true)
  }

  // const statsData = [
  //   {
  //     title: "Total Tickets",
  //     value: counts.total.toString(),
  //     currency: false,
  //     changeColor: "text-green-600",
  //     bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-60",
  //   },
  //   {
  //     title: "Open",
  //     value: counts.open.toString(),
  //     currency: false,
  //     changeColor: "text-orange-600",
  //     bgGradient: "bg-gradient-to-br from-white via-orange-50 to-orange-100",
  //   },
  //   {
  //     title: "In Progress",
  //     value: counts.inProgress.toString(),
  //     currency: false,
  //     changeColor: "text-yellow-600",
  //     bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
  //   },
  //   {
  //     title: "Resolved",
  //     value: counts.resolved.toString(),
  //     currency: false,
  //     changeColor: "text-blue-600",
  //     bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-100",
  //   },
  //   {
  //     title: "Reopen",
  //     value: counts.reopen.toString(),
  //     currency: false,
  //     changeColor: "text-red-600",
  //     bgGradient: "bg-gradient-to-br from-white via-red-50 to-red-100",
  //   },
  // ];

   const handleUpdate = useCallback(
      async (data) => {
        try {
          await dispatch(updateTicketStatus({ id: selectedTicket.id, data }));
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
      render: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline"
        >
          {row.ticketCode}
        </span>
      ),
    },
    {
      id: "queryType",
      label: "Issue",
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(), // format datetime
    },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const styles = {
          ACTIVE: "bg-yellow-100 text-yellow-700",
          CLOSED: "bg-red-100 text-red-700",
          RESOLVED: "bg-green-100 text-green-700",
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
        {/* {statsData.map((item, index) => (
          <StatCard
          
           key={index} {...item} />
        ))} */}
      </div>

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          rows={tickets || []}
          filterOptions={["all", "ACTIVE", "RESOLVED", "CLOSED"]}
          filterKey="status"
          onRowClick={handleRowClick}
          loading={loading}
          onRefresh={() => dispatch(fetchAllTickets())}
          searchableColumns={["queryType", "ticketCode", "status"]}
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
