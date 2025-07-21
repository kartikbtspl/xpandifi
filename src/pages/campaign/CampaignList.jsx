import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns } from '../../redux/slices/campaignSlice';
import ReusableTable from '../../components/table/ReusableTable';
import EditCampaignModal from './EditCampaignModal';
import Loader from '../../components/loader/Loader';

const CampaignList = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  console.log("campaignsss",campaigns);
  const [rows, setRows] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

 

  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => ({
        id: index + 1,
        // compaignId: item.id,
        campaignCode: item.campaignCode,
        image: item.productFiles,
        name: item.campaignName || 'Untitled Campaign',
        start: `${item.startDate} - ${item.startTime}`,
        end: `${item.endDate} - ${item.endTime}`,
        status: item.achieveStatus || (item.status ? 
  <div className='p-1 rounded-full text-center bg-green-100'><p className="text-green-600">APPROVED</p></div> : 
  <div className='p-1 rounded-full text-center bg-yellow-100'><p className="text-yellow-600">PENDING</p></div>
),
        // status: item.achieveStatus || (item.status ? '<p className="text-green-600>Active</p>' : '<p className="text-red-600>Inactive</p>'),
        raw: item, // raw data for editing
      }));
      setRows(formatted);
    }
  }, [campaigns]);

  const handleEdit = (rowData) => {
    setSelectedCampaign(rowData.raw);
    setIsEditOpen(true);
  };
  const handleDelete =(rowData)=>{
    console.log(rowData);

  }


const columns = [
  {
    id: 'campaignCode',
    label: 'Campaign ID',
    numeric: false,
    render: (row) => (
      <span
      className=""
      >
        {/* onClick={() => handleEdit(row)} */}
        {row.campaignCode}
      </span>
    ),
  },
  {
    id: 'name',
    label: 'Campaign Name',
    numeric: false,
    render: (row) => (
      <span
      className=""
      >
        {/* onClick={() => handleEdit(row)} */}
        {row.name}
      </span>
    ),
  },
  { id: 'start', label: 'Start Date', numeric: false },
  { id: 'end', label: 'End Date', numeric: false },
  { id: 'status', label: 'Status', numeric: false },
  {
    id: 'actions',
    label: 'Actions',
  render: (row) => (
  row.status === 'PENDING' || row.status !== 'APPROVED' ? (
    <div className="flex gap-2">
      <button
        className="text-blue-600 bg-blue-200 hover:underline px-2 py-1 rounded"
        onClick={() => handleEdit(row)}
      >
        Edit
      </button>
      <button
        className="text-red-600 bg-red-200 hover:underline px-2 py-1 rounded"
        onClick={() => handleDelete(row)}
      >
        Delete
      </button>
    </div>
  ) : (
    <div className="flex gap-2 text-gray-500">
      No Actions
    </div>
  )
)
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
          onSuccess={refreshCampaigns} 
        />
      )}
    </div>
  );
};

export default CampaignList;
