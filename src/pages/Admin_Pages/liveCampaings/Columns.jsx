import { Switch } from "@mui/material";
import Loader from "../../components/ui/loader/Loader";
import StatusBadge from "../../components/ui/badges/StatusBadge";

const getColumns = (handleActivate, switchLoading) => [
  { id: "campaignCode", label: "Campaign ID" },
  { id: "name", label: "Campaign Name" },
  { id: "brandName", label: "Brand Name" },
  {
    id: "dateRange",
    label: "Schedule",
    render: (row) =>
      `${new Date(row.startDate).toLocaleDateString()} - ${new Date(
        row.endDate
      ).toLocaleDateString()}`,
  },
  // {
  //   id: "regions",
  //   label: "Regions",
  //   render: (row) => row.regions?.join(", ") || "N/A",
  // },
  {
    id: "budget",
    label: "Amount",
    render: (row) => `₹ ${row.baseBid}`,
  },
  // {
  //   id: "status",
  //   label: "Status",
  //   render: (row) => (
  //     <span
  //       className={`px-2 py-1 rounded ${
  //         row.isActive === "ACTIVE"
  //           ? "bg-green-100 text-green-700"
  //           : "bg-gray-200 text-gray-600"
  //       }`}
  //     >
  //       {row.isActive}
  //     </span>
  //   ),
  // },
  // {
  //   id: "actions",
  //   label: "Actions",
  //   render: (row) => {
  //     if (switchLoading?.[row.id]) {
  //       return <Loader className="p-0" size="small" />;
  //     }
  //     return (
  //       <Switch
  //         checked={row.isActive === "ACTIVE"}
  //         onChange={() => handleActivate(row.id, row.isActive === "ACTIVE")}
  //         size="small"
  //         sx={{
  //           "& .MuiSwitch-switchBase.Mui-checked": { color: "#445C91" },
  //           "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
  //             backgroundColor: "#445C91",
  //           },
  //         }}
  //       />
  //     );
  //   },
  // },

  {
  id: "status",
  label: "Status",
  render: (row) => <StatusBadge isActive={row.isActive} size={11}/>
},
{
  id: "actions",
  label: "Actions",
  render: (row) => {
    if (switchLoading?.[row.id]) {
      return <Loader className="p-0" size="small" />;
    }
    return (
      <Switch
        checked={row.isActive}
        onChange={() => handleActivate(row.id, row.isActive)}
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#445C91" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#445C91",
          },
        }}
      />
    );
  },
},

];

export default getColumns;