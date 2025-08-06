import React from "react";
import MediaCarousel from "../../components/ui/carousel/MediaCarousel"; // Adjust path if needed

const CampaignCard = ({ campaign }) => {
  if (!campaign) return null;

  const {
    campaignName,
    productFiles = [],
    startDate,
    endDate,
    startTime,
    endTime,
    targetDevices = [],
  } = campaign;

  // ✅ Handle possible typo in isActive
  const isActive = campaign.isActive ?? campaign.isAcive ?? false;
  const statusText = isActive ? "ACTIVE" : "INACTIVE";
  const statusClass = isActive
    ? "bg-green-100 text-green-700"
    : "bg-gray-200 text-gray-700";

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full relative mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{campaignName}</h2>

        {/* Status with pulse */}
        <div className="flex items-center gap-2">
           {/* Status badge */}
          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusClass} flex gap-2`}>
            {statusText}
          
          {/* Animated pulse dot */}
          <span className="relative flex size-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                isActive ? "bg-green-400" : "bg-gray-400"
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex size-3 rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            ></span>
          </span>
          </span>

         
        </div>
      </div>

      {/* Media Carousel */}
      <div className="mb-4">
        <MediaCarousel mediaFiles={productFiles} size="xl" autoplay={true} />
      </div>

      {/* Date & Time */}
      <div className="text-sm text-gray-600 mb-3 space-y-1">
        <p>
          <strong>Start:</strong> {formatDate(startDate)} at {startTime}
        </p>
        <p>
          <strong>End:</strong> {formatDate(endDate)} at {endTime}
        </p>
      </div>

      {/* Target Devices */}
      <div className="text-sm text-gray-700">
        <strong>Target Devices:</strong>{" "}
        <span className="text-gray-600">{targetDevices.join(", ")}</span>
      </div>
    </div>
  );
};

export default CampaignCard;
