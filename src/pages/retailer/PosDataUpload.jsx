import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/table/ReusableTable"
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const PosDataUpload = () => {
  const { campaigns, loading } = useSelector((state) => state.approvedCampaigns);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Transform backend data if needed
    if (campaigns.length > 0) {
      const transformed = campaigns.map((campaign) => ({
        ...campaign,
        startDate: dayjs(campaign.startDate).format("DD MMM YYYY"),
        endDate: dayjs(campaign.endDate).format("DD MMM YYYY"),
        targetDevices: campaign.targetDevices?.join(", ") || "-",
      }));
      setRows(transformed);
    }
  }, [campaigns]);

  const columns = [
    { id: "campaignName", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" },
    { id: "startTime", label: "Start Time" },
    { id: "endDate", label: "End Date" },
    { id: "endTime", label: "End Time" },
    { id: "targetDevices", label: "Target Devices" },
    {
      id: "productFile",
      label: "Video",
      renderCell: (row) => (
        <a
          href={row.productFile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Video
        </a>
      ),
    },
  ];

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">POS Data Uploads</h2>
      <ReusableTable columns={columns} rows={rows} loading={loading} />
    </div>
  );
};

export default PosDataUpload;

// import React, { useState, useEffect } from "react";
// import ReusableTable from "../../components/table/ReusableTable";
// import { useSelector } from "react-redux";



// const PosDataUpload = () => {
//   const [rows, setRows] = useState([]);
 
//   const { campaigns, loading, error } = useSelector((state) => state.approvedCampaigns);

//   console.log("Campaigns:", campaigns);


//   return (
//     <div className="">
//       <h2 className="text-xl font-semibold mb-4">POS Data Upload</h2>
//       {/* <ReusableTable columns={columns} rows={rows} /> */}
//     </div>
//   );
// };

// export default PosDataUpload;
