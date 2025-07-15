import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../redux/slices/campaignSlice";
import Button from "../../components/ui/button/Button";

const CampaignReports = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   dispatch(fetchCampaigns());
  // }, [dispatch]);



  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => ({
        id: index + 1,
        name: item.campaignName || "Untitled Campaign",
        impressions: item.impressions || Math.floor(Math.random() * 10000 + 1000),
        clicks: item.clicks || Math.floor(Math.random() * 5000 + 500),
        conversions: item.conversions || Math.floor(Math.random() * 1000 + 100),
        cost: item.baseBid || Math.floor(Math.random() * 50000 + 5000),
        roi: `${Math.floor(Math.random() * 100)}%`,
        raw: item,
      }));
      setRows(formatted);
    }
  }, [campaigns]);

  const columns = [
    { id: "name", label: "Campaign Name", numeric: false },
    { id: "impressions", label: "Impressions", numeric: true },
    { id: "clicks", label: "Clicks", numeric: true },
    { id: "conversions", label: "Conversions", numeric: true },
    { id: "cost", label: "Cost", numeric: true },
    { id: "roi", label: "ROI", numeric: true },
    {
      id: "export",
      label: "Export",
      renderCell: (row) => (
        <Button
          onClick={() => handleExport(row)}
          className="text-blue-600 hover:underline"
          label="Export"
        >
          Export
        </Button>
      ),
    },
  ];

  const handleExport = (row) => {
    // This can be updated to download a CSV or trigger an export API call
    alert(`Exporting report for: ${row.name}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Campaign Reports</h2>
      <ReusableTable columns={columns} rows={rows} loading = {loading} />
    </div>
  );
};

export default CampaignReports;
