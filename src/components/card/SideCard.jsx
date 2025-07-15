import React from "react";

const SideCard = ({
  ads = [],
  title = "Items",
  units = "",
}) => {
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
          ads.map((ad, index) => (
            <div
              key={index}
              className="border-b pb-4 last:border-0 last:pb-0 flex items-center gap-4 border-gray-400"
            >
              {/* Ad Image */}
              <img
                src={ad?.image || "https://via.placeholder.com/48"}
                alt={ad?.title || "Ad"}
                className="h-12 w-12 rounded-md object-cover"
              />

              {/* Ad Content */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {ad?.title || "Untitled"}
                </h4>
                {ad?.time && (
                  <span className="text-xs text-gray-500">{ad.time}</span>
                )}
              </div>

              {/* Ad Value */}
              <p className="text-gray-600 text-sm whitespace-nowrap">
                {ad?.value ?? "-"} {units}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SideCard;
