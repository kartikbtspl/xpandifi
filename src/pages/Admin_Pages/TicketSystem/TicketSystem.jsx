import { useState } from "react";
import { Typography, Chip } from "@mui/material";
import StatCard from "../../components/atoms/card/StatCard";
import ReusableTable from "../../components/atoms/table/ReusableTable";
import TicketDetailsModal from "./TicketDetailsModal";
import { ticketCounts, ticketRows } from "./ticketData";
import COLORS from "../../constants/Colors";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketSystem = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState(ticketRows);

  const counts = ticketCounts(rows);

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleStatusChange = (newStatus) => {
    setSelectedTicket((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleAdminRemarkChange = (remark) => {
    setSelectedTicket((prev) => ({
      ...prev,
      adminRemark: remark,
    }));
  };

 const handleSubmitChanges = async (updatedTicket) => {
  const { id, status, adminRemark, userRemark, ticketID } = updatedTicket;

  const prevRow = rows.find((row) => row.id === id);
  const prevStatus = prevRow?.status;

  
  await new Promise((resolve) => setTimeout(resolve, 300));

  const updatedRows = rows.map((row) =>
    row.id === id ? { ...row, status, adminRemark, userRemark } : row
  );
  setRows(updatedRows);

  toast.success(
    `Status for ticket ${ticketID} has been changed by Admin from "${prevStatus}" to "${status}".`
  );

  setIsModalOpen(false);
  setSelectedTicket(null);
};

  const statsData = [
    {
      title: "Total Tickets",
      value: counts.total.toString(),
      currency: false,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-60",
    },
    {
      title: "Open",
      value: counts.open.toString(),
      currency: false,
      changeColor: "text-orange-600",
      bgGradient: "bg-gradient-to-br from-white via-orange-50 to-orange-100",
    },
    {
      title: "In Progress",
      value: counts.inProgress.toString(),
      currency: false,
      changeColor: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
    },
    {
      title: "Resolved",
      value: counts.resolved.toString(),
      currency: false,
      changeColor: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-100",
    },
    {
      title: "Reopen",
      value: counts.reopen.toString(),
      currency: false,
      changeColor: "text-red-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-red-100",
    },
  ];

  const columns = [
    {
      id: "ticketID",
      label: "Ticket ID",
      render: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(row);
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline "
        >
          {row.ticketID}
        </span>
      ),
    },
    
    {
      id: "subject",
      label: "Subject",
      render: (row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(row);
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline "
        >
          {row.subject}
        </span>
      ),
    },
    
    { id: "priority", label: "Priority" },
    
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const styles = {
          "OPEN": "bg-orange-100 text-orange-700",
          "INPROGRESS": "bg-yellow-100 text-yellow-700",
          "RESOLVED": "bg-blue-100 text-blue-700",
          "REOPEN": "bg-red-100 text-red-700",
          "CLOSED": "bg-green-100 text-green-700",
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
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            backgroundColor:
              row.role === "Retailer" ? COLORS.gold : COLORS.primary,
            color: "white",
            fontWeight: 600,
            px: 1.5,
            borderRadius: 2,
          }}
        />
      ),
    },
    { id: "raisedAt", label: "Raised At" },
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
          <StatCard
          
           key={index} {...item} />
        ))}
      </div>

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          rows={rows}
          filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "REOPEN", "CLOSED"]}
          filterKey="status"
          onRowClick={() => {}} 
        />
      </div>

      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={handleClose}
        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
        onAdminRemarkChange={handleAdminRemarkChange}
        onSubmitChanges={handleSubmitChanges}
      />
      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default TicketSystem;



// import { useState } from "react";
// import { Typography, Chip } from "@mui/material";
// import StatCard from "../../components/atoms/card/StatCard";
// import ReusableTable from "../../components/atoms/table/ReusableTable";
// import TicketDetailsModal from "./TicketDetailsModal";
// import { ticketCounts, ticketRows } from "./ticketData";
// import COLORS from "../../constants/Colors";
// import { toast , ToastContainer} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const TicketSystem = () => {
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [rows, setRows] = useState(ticketRows);

//   const counts = ticketCounts(rows);

//   const handleOpenModal = (ticket) => {
//     setSelectedTicket(ticket);
//     setIsModalOpen(true);
//   };

//   const handleClose = () => {
//     setIsModalOpen(false);
//     setSelectedTicket(null);
//   };

//   const handleStatusChange = (newStatus) => {
//     setSelectedTicket((prev) => ({
//       ...prev,
//       status: newStatus,
//     }));
//   };

//   const handleAdminRemarkChange = (remark) => {
//     setSelectedTicket((prev) => ({
//       ...prev,
//       adminRemark: remark,
//     }));
//   };

//   const handleSubmitChanges = async (updatedTicket) => {
//     const { id, status, adminRemark, ticketID } = updatedTicket;

//     const prevRow = rows.find((row) => row.id === id);
//     const prevStatus = prevRow?.status;

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     const updatedRows = rows.map((row) =>
//       row.id === id ? { ...row, status, adminRemark } : row
//     );
//     setRows(updatedRows);

//     toast.success(
//       `Status for ticket ${ticketID} has been changed by Admin from "${prevStatus}" to "${status}".`
//     );

//     setIsModalOpen(false);
//     setSelectedTicket(null);
//   };

//   const statsData = [
//     {
//       title: "Total Tickets",
//       value: counts.total.toString(),
//       currency: false,
//       changeColor: "text-green-600",
//       bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-60",
//     },
//     {
//       title: "In Progress",
//       value: counts.inProgress.toString(),
//       currency: false,
//       changeColor: "text-green-700",
//       bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
//     },
//     {
//       title: "Pending",
//       value: counts.pending.toString(),
//       currency: false,
//       changeColor: "text-green-600",
//       bgGradient: "bg-gradient-to-br from-white via-red-50 to-red-100",
//     },
//   ];

//   const columns = [
//     {
//       id: "ticketID",
//       label: "Ticket ID",
//       render: (row) => (
//         <span
//           onClick={(e) => {
//             e.stopPropagation();
//             handleOpenModal(row);
//           }}
//           className="cursor-pointer hover:text-blue-600 hover:underline "
//         >
//           {row.ticketID}
//         </span>
//       ),
//     },
    
//     {
//       id: "subject",
//       label: "Subject",
//       render: (row) => (
//         <span
//           onClick={(e) => {
//             e.stopPropagation();
//             handleOpenModal(row);
//           }}
//           className="cursor-pointer hover:text-blue-600 hover:underline "
//         >
//           {row.subject}
//         </span>
//       ),
//     },
    
//     { id: "priority", label: "Priority" },
    
//     {
//       id: "status",
//       label: "Status",
//       render: (row) => {
//         const styles = {
//           "In Progress": "bg-yellow-100 text-yellow-700",
//           Closed: "bg-green-100 text-green-700",
//           Pending: "bg-red-100 text-red-700",
//         };

//         return (
//           <span
//             className={`px-3 py-1 rounded text-sm ${
//               styles[row.status] || "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {row.status}
//           </span>
//         );
//       },
//     },
//     {
//       id: "role",
//       label: "Role",
//       render: (row) => (
//         <Chip
//           label={row.role}
//           size="small"
//           sx={{
//             backgroundColor:
//               row.role === "Retailer" ? COLORS.gold : COLORS.primary,
//             color: "white",
//             fontWeight: 600,
//             px: 1.5,
//             borderRadius: 2,
//           }}
//         />
//       ),
//     },
//     { id: "raisedAt", label: "Raised At" },
//   ];

//   return (
//     <div>
//       <Typography variant="h5" fontWeight={600} mb={3}>
//         Ticket System
//       </Typography>

//       <div
//         className="grid gap-4 w-full"
//         style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
//       >
//         {statsData.map((item, index) => (
//           <StatCard key={index} {...item} />
//         ))}
//       </div>

//       <div className="mt-4">
//         <ReusableTable
//           columns={columns}
//           rows={rows}
//           filterOptions={["all", "Pending", "Closed", "In Progress"]}
//           filterKey="status"
//           onRowClick={() => {}} 
//         />
//       </div>

//       <TicketDetailsModal
//         isOpen={isModalOpen}
//         onClose={handleClose}
//         ticket={selectedTicket}
//         onStatusChange={handleStatusChange}
//         onAdminRemarkChange={handleAdminRemarkChange}
//         onSubmitChanges={handleSubmitChanges}
//       />
//       <ToastContainer position="bottom-left" />
//     </div>
//   );
// };

// export default TicketSystem;
