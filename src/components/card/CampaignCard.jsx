import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


// Custom Arrow Components (gray icon, white background)
const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 bg-white text-gray-700 border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <FaChevronRight className="w-4 h-4" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 bg-white text-gray-700 border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <FaChevronLeft className="w-4 h-4" />
  </button>
);



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

  const isVideo = (url) => url?.match(/\.(mp4|webm|ogg)$/i);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

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
      <div className="mb-4 relative">
        <Slider {...sliderSettings}>
          {productFiles.map((file, idx) => (
            <div key={idx}>
              {isVideo(file) ? (
                <video
                  src={file}
                  controls
                  autoPlay
                  className="w-full h-100 object-cover rounded"
                />
              ) : (
                <img
                  src={file}
                  alt={`Campaign Media ${idx + 1}`}
                  className="w-full h-100 object-cover rounded"
                />
              )}
            </div>
          ))}
        </Slider>
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