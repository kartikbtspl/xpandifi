import React from "react";
import MediaCarousel from "../../components/ui/carousel/MediaCarousel"; // Adjust path as needed

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
    isApproved,
  } = campaign;

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
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            isApproved === "APPROVED"
              ? "bg-green-100 text-green-700"
              : isApproved === "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isApproved}
        </span>
      </div>

      {/* Media Carousel */}
      <div className="mb-4">
        <MediaCarousel mediaFiles={productFiles} size="xl" autoplay={true}  />
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