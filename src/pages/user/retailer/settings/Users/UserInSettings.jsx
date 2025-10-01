import React, { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import ReusableTable from "../../../../../components/table/ReusableTable";
import { Chip, Switch } from "@mui/material";
import COLORS from "../../../../../constants/Colors";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../../../components/ui/bread-crumb/Breadcrumbs";
import AddUserModal from "./AddUserModal";

const UserInSettings = () => {
  const [switchLoading, setSwitchLoading] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "Marvin McKinney",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Marketing", "Inventory"],
      status: "ACTIVE",
    },
    {
      id: 2,
      fullName: "Kathryn Murphy",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Marketing & Sales",
      permissions: ["Management", "Marketing", "Sales"],
      status: "ACTIVE",
    },
    {
      id: 3,
      fullName: "Marvin McKinney",
      email: "tim.jennings@example.com",
      phone: "+91 9765550116",
      role: "Finance Manager",
      permissions: ["Finance", "Marketing", "Reports"],
      status: "INACTIVE",
    },
    {
      id: 4,
      fullName: "Kathryn Murphy",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Staff", "Inventory"],
      status: "ACTIVE",
    },
    {
      id: 5,
      fullName: "Marvin McKinney",
      email: "tim.jennings@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Reports", "Analytics"],
      status: "ACTIVE",
    },
  ]);

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Set loading true for this user
    setSwitchLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      // Simulate API call
      //await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the user status in state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      console.log(
        `User ${userId} status changed from ${currentStatus} to ${newStatus}`
      );

      // Simulate success
      if (newStatus === "ACTIVE") {
        console.log(
          "User Activated",
          "The user has been activated successfully!"
        );
      } else {
        console.log("User Deactivated", "The user has been deactivated.");
      }
    } catch (error) {
      console.log("Error", error?.message || "Failed to update user status");
    } finally {
      // Set loading false for this user
      setSwitchLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    // Navigate to user profile with row data as state
    navigate("user-profile", { state: { userData: row } });
  };

  const columns = (handleStatusChange, switchLoading) => [
    { id: "fullName", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone Number" },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            backgroundColor: COLORS.primary,
            color: "white",
            fontWeight: 600,
            px: 1.5,
            borderRadius: 2,
          }}
        />
      ),
    },
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
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.status === "ACTIVE"}
            onChange={() => handleStatusChange(row.id, row.status)}
            size="small"
            disabled={switchLoading?.[row.id]}
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
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <Button label="Add User" onClick={() => setIsOpen(true)} />
      </div>

      <div>
        <Breadcrumbs />
      </div>

      <ReusableTable
        columns={columns(handleStatusChange, switchLoading)}
        rows={users}
        loading={false}
        onRowClick={handleRowClick}
      />

      <AddUserModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default UserInSettings;
