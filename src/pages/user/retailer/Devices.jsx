import React, { useEffect, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/button/Button";
import AddDeviceModal from "./AddDeviceModal";
import { fetchDevices } from "../../../redux/slices/user/retailerDeviceSlice";
import { fetchRequest } from "../../../redux/slices/user/terminalSlice";

const Devices = () => {
  const dispatch = useDispatch();

  // two slices
  const { devices, loading: devicesLoading, fetched: devicesFetched } =
    useSelector((state) => state.retailerDevice);
  const {
    deviceRequest,
    loading: requestsLoading,
    fetched: requestsFetched,
    formLoading,
  } = useSelector((state) => state.userTerminal);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // view toggle (devices | requests)
  const [activeView, setActiveView] = useState("devices");

  // fetch devices
  useEffect(() => {
    if (!devicesFetched && !devicesLoading) {
      dispatch(fetchDevices());
    }
  }, [dispatch ]);

  // fetch requests
  useEffect(() => {
    if (!requestsFetched && !requestsLoading) {
      dispatch(fetchRequest());
    }
  }, [dispatch]);

  const handleRowClick = (row) => {
    setSelected(row); // pass row as initialData for update
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelected(null);
    setIsOpen(false);
  };

  // table columns
  const deviceColumns = [
    { id: "deviceName", label: "Device Name" },
    { id: "qty", label: "Quantity" },
    { id: "status", label: "Status" },
  ];

  const requestColumns = [
    { id: "name", label: "Requested Device" },
    { id: "country", label: "Country" },
     { id: "state", label: "State" },
      { id: "city", label: "City" },
       { id: "regions", label: "Regions" }, 
    { id: "qty", label: "Quantity" },
    { id: "status", label: "Status" },
  ];

  return (
    <div className="p-4">
      {/* Top navigation buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Devices</h2>

          <Button
            label="Request Device"
            onClick={() => setIsOpen(true)}
            type="button"
          />
      </div>
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
        />
      ) : (
        <ReusableTable
          columns={requestColumns}
          rows={deviceRequest}
          loading={requestsLoading}
          onRowClick={handleRowClick}
          filterKey="status"
          filterOptions={["all", "Pending", "Approved", "Rejected"]}
        />
      )}

      {/* Modal for create / update */}
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