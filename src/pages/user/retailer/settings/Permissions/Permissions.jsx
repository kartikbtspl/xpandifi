import React from "react";
import ReusableTable from "../../../../../components/table/ReusableTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import Breadcrumbs from "../../../../../components/ui/bread-crumb/Breadcrumbs";
import { Switch } from "@mui/material";
import Toast from "../../../../../components/ui/toast/Toast";

const Permissions = () => {
  const [rows, setRows] = React.useState([
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
  ]);

  const cols = [
    {
      id: "permissions",
      label: "Permissions",
      render: (row) => (
        <div>
          {row.permissions.map((permission, index) => (
            <div key={index} className="mb-1 last:mb-0">
              {permission}
            </div>
          ))}
        </div>
      ),
    },
    { id: "user", label: "User" },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-black border border-blue-400">
          {row.role}
        </span>
      ),
    },
    { id: "phone", label: "Phone Number" },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={row.status === "ACTIVE"}
              size="small"
              onChange={() => handleStatusToggle(row)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#445E94",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#445E94",
                },
              }}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="rounded hover:bg-gray-100 pl-6"
            onClick={() => handleThreeDotsClick(row)}
          >
            <BsThreeDotsVertical className=" hover:cursor-pointer" />
          </button>
        </div>
      ),
    },
  ];

  const handleStatusToggle = (rowToUpdate) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row === rowToUpdate
          ? {
              ...row,
              status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : row
      )
    );

    Toast.success("Status updated successfully ! ")
  };

  const handleThreeDotsClick = (row) => {
    Toast.info(`No actions available `)
  };

  const handleRowClick = (row) => {
    console.log("Row clicked ", row);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Permissions</h2>
      </div>
      <Breadcrumbs />

      <ReusableTable
        columns={cols}
        rows={rows}
        loading={false}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Permissions;
