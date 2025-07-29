import React from "react";

const SideCard = ({
  ads = [],
  title = "Campaigns",
  units = "",
  onAdClick = () => {}, // ✅ external click handler
}) => {
  // Transform campaign into display-ready data
  const transformAd = (campaign) => {
    const {
      campaignName,
      productFiles = [], // ✅ Correct field name
      startDate,
      endDate,
      startTime,
      endTime,
      isApproved = "PENDING",
    } = campaign;

    const media = productFiles[0] || "https://via.placeholder.com/48"; // ✅ First file only
    const titleText = campaignName || "Untitled Campaign";

    const time = `${new Date(startDate).toLocaleDateString()} ${startTime || ""} - ${new Date(endDate).toLocaleDateString()} ${endTime || ""}`;

    return { media, titleText, time, isApproved };
  };

  // Style based on approval status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  // Detect if file is a video
  const isVideo = (url) => {
    return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-300 w-full p-3">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      </div>

      {/* Content List */}
      <div className="space-y-4 overflow-y-auto px-6 py-3 flex-1">
        {ads.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">No data available</div>
        ) : (
          ads.map((ad, index) => {
            const { media, titleText, time, isApproved } = transformAd(ad);
            const statusColor = getStatusColor(isApproved);

            return (
              <div
                key={index}
                className="border-b pb-4 last:border-0 last:pb-0 flex items-center gap-4 border-gray-400 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => onAdClick(ad)} // ✅ Click handler
              >
                {/* Ad Media */}
                {isVideo(media) ? (
                  <video
                    src={media}
                    className="h-12 w-12 rounded-md object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={media}
                    alt={titleText}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}

                {/* Ad Content */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {titleText}
                  </h4>
                  <span className="text-xs text-gray-500 block">{time}</span>
                  <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${statusColor}`}>
                    {isApproved}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SideCard;
