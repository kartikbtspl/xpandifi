import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns } from '../../redux/slices/campaignSlice';
import ReusableTable from '../../components/table/ReusableTable';
import EditCampaignModal from './EditCampaignModal';
import Loader from '../../components/loader/Loader';

const CampaignList = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Refresh campaigns data
  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  useEffect(() => {
    refreshCampaigns();
  }, [dispatch]);

  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => ({
        id: index + 1,
        image: item.productFiles,
        name: item.campaignName || 'Untitled Campaign',
        start: `${item.startDate} - ${item.startTime}`,
        end: `${item.endDate} - ${item.endTime}`,
        targeting: item.targeting || 'N/A',
        status: item.achieveStatus || (item.status ? 'Active' : 'Inactive'),
        raw: item, // raw data for editing
      }));
      setRows(formatted);
    }
  }, [campaigns]);

  const handleEdit = (rowData) => {
    setSelectedCampaign(rowData.raw);
    setIsEditOpen(true);
  };

  const columns = [
    {
      id: 'name',
      label: 'Campaign Name',
      numeric: false,
      renderCell: (row) => (
        <span
          onClick={() => handleEdit(row)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    { id: 'start', label: 'Start Date', numeric: false },
    { id: 'end', label: 'End Date', numeric: false },
    { id: 'targeting', label: 'Targeting', numeric: false },
    { id: 'status', label: 'Status', numeric: false },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => handleEdit(row)}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Campaigns</h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <div className="text-lg font-semibold text-[#445E94]">
            Fetching Campaign...
          </div>
          <Loader />
        </div>
      ) : (
        <ReusableTable columns={columns} rows={rows} />
      )}

      {isEditOpen && selectedCampaign && (
        <EditCampaignModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          campaignData={selectedCampaign}
          onSuccess={refreshCampaigns} // <-- refresh on update
        />
      )}
    </div>
  );
};

export default CampaignList;
