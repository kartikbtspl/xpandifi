import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/badges/StatusBadge";
import ReusableTable from "../../../components/table/ReusableTable";
import Breadcrumbs from "../../../components/ui/bread-crumb/Breadcrumbs";
import Counter from "../../../components/ui/counter/Counter";

const TerminalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const retailer = location.state?.retailer;
  const [deviceList, setDeviceList] = useState([]);

  // Debounce ref
  const debounceTimeout = useRef(null);
  console.log(retailer)

  // Debounced API call
  const sendDeviceUpdate = useCallback((payload) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        await fetch("/api/updateDeviceCount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("Device update sent:", payload);
      } catch (err) {
        console.error("Error updating device:", err);
      }
    }, 3000); // 3000ms debounce
  }, []);

  // Initialize device list
  useEffect(() => {
    if (!retailer) {
      navigate("/terminals");
    } else {
      setDeviceList(retailer.devices || []);
    }
  }, [retailer, navigate]);

  if (!retailer) return null;

  // Columns for table
  const columns = [
    { id: "deviceName", label: "Device Name" },
    { id: "totalDevices", label: "Total Devices" },
    {
      id: "activeDevices",
      label: "Active Devices",
      render: (row) => (
        <Counter
          value={row.activeDevices}
          min={0}
          max={row.totalDevices}
          size="sm"
          width="80px"
          color="green"
          onChange={(newActive) => {
            const newInactive = row.totalDevices - newActive;

            // Update local state
            setDeviceList((prev) =>
              prev.map((device) =>
                device.deviceName === row.deviceName
                  ? { ...device, activeDevices: newActive, inactiveDevices: newInactive }
                  : device
              )
            );

            // Send update to backend (debounced)
            sendDeviceUpdate({
              retailerId: row.userId,
              activeDevices: newActive,
              inactiveDevices: newInactive,
            });
          }}
        />
      ),
    },
    {
      id: "inactiveDevices",
      label: "Inactive Devices",
      render: (row) => (
        <Counter
          value={row.inactiveDevices}
          min={0}
          max={row.totalDevices}
          size="sm"
          width="80px"
          color="red"
          onChange={(newInactive) => {
            const newActive = row.totalDevices - newInactive;

            // Update local state
            setDeviceList((prev) =>
              prev.map((device) =>
                device.deviceName === row.deviceName
                  ? { ...device, activeDevices: newActive, inactiveDevices: newInactive }
                  : device
              )
            );

            // Send update to backend (debounced)
            sendDeviceUpdate({
              retailerId: row.retailerId,
              activeDevices: newActive,
              inactiveDevices: newInactive,
            });
          }}
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge isActive={row.status.toUpperCase() === "ACTIVE"} size={12} />
      ),
    },
    {
      id: "regions",
      label: "Regions",
      render: (row) => row?.regions?.map((r) => r.name).join(", ") || "-",
    },
  ];

  return (
    <div className="p-4">
      <Breadcrumbs />
      <br />
      <div className="px-4 py-4 mb-4 shadow bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{retailer.retailerBusiness}</h2>
        <p>
          <strong>Retailer Name:</strong> {retailer.retailerName}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Devices</h3>

      <ReusableTable
        columns={columns}
        rows={deviceList}
        loading={false}
        filterKey="status"
        filterOptions={["all", "active", "inactive"]}
        searchableColumns={["deviceName", "regions"]}
      />
    </div>
  );
};

export default TerminalDetails;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import StatusBadge from "../../../components/ui/badges/StatusBadge";
// import Button from "../../../components/ui/button/Button";
// import Toast from "../../../components/ui/toast/Toast";
// import ReusableTable from "../../../components/table/ReusableTable";
// import Breadcrumbs from "../../../components/ui/bread-crumb/Breadcrumbs";
// import Counter from "../../../components/ui/counter/Counter";

// const TerminalDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();



//   const retailer = location.state?.retailer;
//   const [deviceList, setDeviceList] = useState([]);

//   // Initialize device list
//   useEffect(() => {
//     if (!retailer) {
//       navigate("/terminals");
//     } else {
//       setDeviceList(retailer.devices);
//     }
//   }, [retailer, navigate]);

//   if (!retailer) return navigate("/terminals");


//   // Columns for ReusableTable
//   const columns = [
//     { id: "deviceName", label: "Device Name" },
//     {
//       id: "totalDevices",
//       label: "Total Devices",
//     },
//     {
//       id: "activeDevices",
//       label: "Active Devices",
//       render: (row) => (
//         <Counter
//           value={row.activeDevices}
//           min={0}
//           max={row.totalDevices}
//           size="sm"
//           width="80px"
//           color="green"
//           onChange={(newActive) => {
//             const newInactive = row.totalDevices - newActive;

//             // Update the deviceList state for this row
//             setDeviceList((prev) =>
//               prev.map((device) =>
//                 device.deviceName === row.deviceName
//                   ? {
//                       ...device,
//                       activeDevices: newActive,
//                       inactiveDevices: newInactive,
//                     }
//                   : device
//               )
//             );
//           }}
//         />
//       ),
//     },
//     {
//       id: "inactiveDevices",
//       label: "Inactive Devices",
//       render: (row) => (
//         <Counter
//           value={row.inactiveDevices}
//           min={0}
//           max={row.totalDevices}
//           size="sm"
//           width="80px"
//           color="red"
//           onChange={(newInactive) => {
//             const newActive = row.totalDevices - newInactive;

//             // Update the deviceList state for this row
//             setDeviceList((prev) =>
//               prev.map((device) =>
//                 device.deviceName === row.deviceName
//                   ? {
//                       ...device,
//                       activeDevices: newActive,
//                       inactiveDevices: newInactive,
//                     }
//                   : device
//               )
//             );
//           }}
//         />
//       ),
//     },
//     {
//       id: "status",
//       label: "Status",
//       render: (row) => (
//         <StatusBadge
//           isActive={row.status.toUpperCase() === "ACTIVE"}
//           size={12}
//         />
//       ),
//     },
//     {
//       id: "regions",
//       label: "Regions",
//       render: (row) => row?.regions?.map((r) => r.name).join(", ") || "-",
//     },
//   ];

//   return (
//     <div className="p-4">
//       <Breadcrumbs />
//       <br />
//       <div className="px-4 py-4 mb-4 shadow bg-white rounded-lg">
//         <h2 className="text-2xl font-bold mb-2">{retailer.retailerBusiness}</h2>
//         <p>
//           <strong>Retailer Name:</strong> {retailer.retailerName}
//         </p>
//       </div>

//       <h3 className="text-xl font-semibold mb-2">Devices</h3>

//       <ReusableTable
//         columns={columns}
//         rows={deviceList}
//         loading={false}
//         filterKey="status"
//         filterOptions={["all", "active", "inactive"]}
//         searchableColumns={["deviceName", "regions"]}
//       />
//     </div>
//   );
// };

// export default TerminalDetails;
