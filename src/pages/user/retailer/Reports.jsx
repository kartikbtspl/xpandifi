import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ReusableTable from "../../../components/table/ReusableTable";
import ReportDetails from "./ReportDetails";
import { FiDownload } from "react-icons/fi";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Get campaigns from Redux (approved campaigns for retailer)
  const { campaigns } = useSelector((state) => state.approvedCampaigns);

  // Mock data for reports (replace with actual API data later)
  const mockReportData = useMemo(() => {
    // If we have real campaigns, map them; otherwise use mock data
    if (campaigns && campaigns.length > 0) {
      return campaigns.map((campaign, idx) => ({
        id: campaign.id || idx,
        campaignName: campaign.name || "Campaign",
        thumbnail: campaign.images?.[0] || "/images/logo/xpandifi-logo.svg",
        startDate: campaign.startDate || "02-11-2024",
        endDate: campaign.endDate || "12-11-2024",
        targeting: campaign.impressions || "50000 Clicks",
        status: campaign.progress || "45% Achieved",
      }));
    }

    // Mock data matching the design
    return Array(8)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        campaignName: "Diwali Sales for Beauty Products",
        thumbnail: "/images/logo/xpandifi-logo.svg",
        startDate: "02-11-2024",
        endDate: "12-11-2024",
        targeting: "50000 Clicks",
        status: "45% Achieved",
      }));
  }, [campaigns]);

  // Handle row click to show details
  const handleRowClick = (row) => {
    setSelectedReport(row);
  };

  // Handle back to list
  const handleBack = () => {
    setSelectedReport(null);
  };

  // Handle single row download
  const handleDownload = (row, e) => {
    e.stopPropagation();
    // TODO: Implement actual download logic
    console.log("Downloading report for:", row.campaignName);
  };

  // Table columns matching the design
  const columns = [
    {
      id: "campaignName",
      label: "Campaign Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.thumbnail}
            alt={row.campaignName}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              e.target.src = "/images/logo/xpandifi-logo.svg";
            }}
          />
          <span className="text-blue-800 font-medium">{row.campaignName}</span>
        </div>
      ),
    },
    {
      id: "startDate",
      label: "Start Date",
    },
    {
      id: "endDate",
      label: "End Date",
    },
    {
      id: "targeting",
      label: "Targeting",
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <span className="text-blue-400 font-medium">{row.status}</span>
      ),
    },
    {
      id: "download",
      label: "",
      render: (row) => (
        <button
          onClick={(e) => handleDownload(row, e)}
          className="text-gray-400 hover:text-blue-600 transition-colors p-2"
          title="Download Report"
        >
          <FiDownload size={18} />
        </button>
      ),
    },
  ];

  // Show details view if a report is selected
  if (selectedReport) {
    return <ReportDetails report={selectedReport} onBack={handleBack} />;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      <ReusableTable
        columns={columns}
        rows={mockReportData}
        loading={false}
        isFilter={true}
        filterKey="status"
        filterOptions={["all", "Achieved", "In Progress", "Pending"]}
        searchableColumns={["campaignName", "startDate", "endDate", "targeting"]}
        defaultOrder="desc"
        defaultOrderBy="startDate"
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Reports;
