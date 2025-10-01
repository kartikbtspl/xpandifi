import React, { useEffect, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/button/Button";
import AddDeviceModal from "./AddDeviceModal";
import {
  fetchDevices,
  fetchRequests,
} from "../../../redux/slices/user/terminalSlice";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import StatusBadge from "../../../components/ui/badges/StatusBadge";

const Devices = () => {
  const dispatch = useDispatch();

  const {
    devices,
    deviceRequests,
    devicesLoading,
    requestsLoading,
    formLoading,
    devicesFetched,
    requestsFetched,
  } = useSelector((state) => state.userTerminal);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeView, setActiveView] = useState("devices"); // toggle: devices | requests

  // Fetch devices
  useEffect(() => {
    if (!devicesFetched && !devicesLoading) {
      dispatch(fetchDevices());
    }
  }, [dispatch, devicesFetched, devicesLoading]);

  // Fetch requests
  useEffect(() => {
    if (!requestsFetched && !requestsLoading) {
      dispatch(fetchRequests());
    }
  }, [dispatch, requestsFetched, requestsLoading]);

  const handleRowClick = (row) => {
    setSelected(row);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setIsOpen(false);
  };

  // Table columns
  const deviceColumns = [
    { id: "deviceName", label: "Device Name" },
    { id: "totalDevices", label: "Total Devices" },
    {
      id: "regions",
      label: "Regions",
      render: (row) =>
        row.regions && row.regions.length > 0 ? row.regions.join(", ") : "-",
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge isActive={row.status === "ACTIVE"} size={12} />
      ),
    },
  ];

  const requestColumns = [
    { id: "deviceName", label: "Requested Device" },
    { id: "qty", label: "Quantity" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "regions", label: "Regions" },
    {
      id: "status",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.status} size={12} />,
    },
  ];

  // Map device requests for table
  const mappedRequests = deviceRequests?.map((r) => ({
    id: r.id,
    deviceName: r.deviceName || "-",
    qty: r.qty || 0,
    status: r.status || "Pending",
    country: r.address?.country || "",
    state: r.address?.state || "",
    city: r.address?.city || "",
    regions: Array.isArray(r.address?.region)
      ? r.address.region.map((reg) => reg.name).join(", ")
      : r.address?.region?.name || "",
  }));

  return (
    <div className="p-4">
      {/* Top navigation buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Devices</h2>
        {activeView === "requests" && (
          <Button
            label="Request Device"
            onClick={() => setIsOpen(true)}
            type="button"
          />
        )}
      </div>

      {/* View toggle buttons */}
      <div className="flex space-x-3 mb-6">
        <Button
          label="My Devices"
          onClick={() => setActiveView("devices")}
          type="button"
          isIcon={false}
          variant={activeView === "devices" ? "primary" : "outline"}
        />
        <Button
          label="Device Requests"
          onClick={() => setActiveView("requests")}
          type="button"
          isIcon={false}
          variant={activeView === "requests" ? "primary" : "outline"}
        />
      </div>

      {/* Conditionally render tables */}
      {activeView === "devices" ? (
        <ReusableTable
          columns={deviceColumns}
          rows={devices}
          loading={devicesLoading}
          filterKey="status"
          filterOptions={["all", "Active", "Inactive"]}
          searchableColumns={["deviceName","regions","status"]}
        />
      ) : (
        <ReusableTable
          columns={requestColumns}
          rows={mappedRequests}
          loading={requestsLoading}
          onRowClick={handleRowClick}
          filterKey="status"
          filterOptions={["all", "Pending", "Approved", "Rejected"]}
          searchableColumns={["deviceName", "state", "country", "city", "regions","status"]}
        />
      )}

      {/* Modal for create/update */}
      <AddDeviceModal
        isOpen={isOpen}
        onClose={handleClose}
        initialData={selected}
        formLoading={formLoading}
      />
    </div>
  );
};

export default Devices;