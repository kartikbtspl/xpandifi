import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../../../redux/slices/admin/terminalSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";


const TerminalDevices = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { devices, deviceLoading, deviceFetched } = useSelector(
    (state) => state.adminTerminal
  );
  const isDetails = location.pathname.includes("terminal-details");
  console.log(devices)

  useEffect(() => {
    if (!deviceFetched) dispatch(fetchDevices());
  }, [deviceFetched, dispatch]);

  const refreshDevices = () => dispatch(fetchDevices());

  const formattedRows = useMemo(() => {
    if (!devices) return [];

    // Keep a reference to the parent retailer
    return devices.flatMap((retailer) =>
      retailer.devices.map((device) => ({
        id: `${retailer.retailerName}-${device.id}`,
        retailerBusiness: retailer.retailerBusiness,
        deviceName: device.deviceName,
        qty: device.totalDevices,
        status: device.status.toUpperCase(),
        retailerData: retailer, // pass full retailer object
      }))
    );
  }, [devices]);

  // Columns
  const columns = [
    { id: "retailerBusiness", label: "Retailer" },
    { id: "deviceName", label: "Device Name" },
    { id: "qty", label: "Total Devices" },
    {
      id: "view",
      label: "View Details",
      render: (row) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate("terminal-details", {
              state: { retailer: row.retailerData },
            });
          }}
          label="View"
          isIcon={false}
        />
      ),
    },
  ];

  return (
    <>
      {isDetails && <Outlet />}
      {!isDetails && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Devices</h2>

          <ReusableTable
            columns={columns}
            rows={formattedRows}
            loading={deviceLoading}
            onRefresh={refreshDevices}
            filterKey="status"
            filterOptions={["all", "ACTIVE", "INACTIVE"]}
            order="desc"
            orderBy="retailerBusiness"
            searchableColumns={["retailerBusiness", "deviceName", "regions"]}
          />
        </div>
      )}
    </>
  );
};

export default TerminalDevices;
