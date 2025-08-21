

import React from "react";
import { Modal } from "../../components/ui/modal/Modal";
import {
  FaCalendarAlt,
  FaStore,
  FaTag,
  FaClock,
  FaBullseye,
  FaMoneyBillWave,
  FaIndustry
} from "react-icons/fa";
import ProductMedia from "../../components/campaign/ProductMedia";
import { formatScheduleDate } from "../../util/Form-menu/DateUtils";

const CampaignDetailsModal = ({
  isOpen,
  openRejectModal,
  onClose,
  campaign,
  onApprove,
  onReject,
}) => {
  if (!campaign) return null;

  const targeting =
    campaign.devices?.length > 0
      ? campaign.devices.map((device) => device.name).join(", ")
      : "—";

  const infoItems = [
    { label: "Campaign Name", value: campaign.name || campaign.campaignName || "—", icon: <FaTag /> },
    { label: "Brand", value: campaign.brandName || "—", icon: <FaIndustry /> },
    {
      label: "Schedule",
      value: formatScheduleDate(campaign.startDate, campaign.endDate) || "—",
      icon: <FaCalendarAlt />
    },
    { label: "Ad Type", value: campaign.adType || "—", icon: <FaBullseye /> },
    { label: "Store Type", value: campaign.storeTypes || "—", icon: <FaStore /> },
    { label: "Product Type", value: campaign.product || "—", icon: <FaTag /> },
    { label: "Devices", value: targeting, icon: <FaBullseye /> },
    { label: "Duration", value: campaign.duration ? `${campaign.duration} sec` : "—", icon: <FaClock /> },
    {
      label: "Base Value",
      value: campaign.baseBid !== undefined ? `₹ ${campaign.baseBid}` : "—",
      icon: <FaMoneyBillWave />
    },
    { label: "Regions", value: campaign.cityPostcodes.map(item => item.city).join(", ") ,  icon: <FaBullseye /> },

  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
      <div className="p-6 space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold">
          {campaign?.name || campaign?.campaignName || "Campaign Details"}
        </h2>

        {/* Campaign Info in Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {infoItems.map(({ label, value, icon }, index) => (
            <div key={index}>
              <label className="text-sm text-gray-600 flex items-center gap-2">
                
                {label}
              </label>
              <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Product Media Section */}
        {campaign?.productFiles && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Product Media</h3>
            <ProductMedia productFiles={campaign.productFiles} />
          </div>
        )}

        {/* Action Buttons */}
        {campaign.isApproved === "PENDING" && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-5 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={openRejectModal}
            >
              Reject
            </button>
            <button
              className="px-5 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => onApprove("APPROVE")}
            >
              Approve
            </button>
          </div>
        )}

        {/* Remark (if campaign is rejected) */}
        {campaign.isApproved === "REJECTED" && campaign.remark && (
          <div>
            <label className="text-sm text-gray-600">Rejection Remark</label>
            <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
              {campaign.remark}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CampaignDetailsModal;

// import React from "react";
// import { Modal } from "../../components/ui/modal/Modal";
// import CampaignInfo from "../../components/campaign/CampaignInfo";
// import ProductMedia from "../../components/campaign/ProductMedia";

// const CampaignDetailsModal = ({
//   isOpen,
//   openRejectModal,
//   onClose,
//   campaign,
//   onApprove,
//   onReject,
// }) => {
//   if (!campaign) return null;

//   return (
//     <div>
//       <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
//         {campaign && (
//           <div className="space-y-6">
//             {/* Title */}
//             <h2 className="text-2xl font-semibold">
//               {campaign?.name || campaign?.campaignName}
//             </h2>

//             {/* Campaign Info in Form-Like Boxes */}
//             <CampaignInfo
//               isOpen={isCampaignModalOpen}
//               onClose={() => setIsCampaignModalOpen(false)}
//               campaign={selectedCampaign} />

//             {/* Product Media Section */}
//             {campaign?.productFiles && (
//               <ProductMedia productFiles={campaign.productFiles} />
//             )}

//             {/* Action Buttons */}
//             {campaign.isApproved === "PENDING" && (
//               <div className="flex justify-end gap-4 mt-4">
//                 <button
//                   className="px-5 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={openRejectModal}
//                 >
//                   Reject
//                 </button>
//                 <button
//                   className="px-5 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={() => onApprove("APPROVE")}
//                 >
//                   Approve
//                 </button>
//               </div>
//             )}

//             {/* Remark (if campaign is rejected) */}
//             {campaign.isApproved === "REJECTED" && (
//               <div>
//                 <label className="text-sm text-gray-600">Remark</label>
//                 <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
//                   {campaign.remark}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default CampaignDetailsModal;
