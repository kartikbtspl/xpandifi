import { useState, useMemo, useEffect } from "react";
import { Modal } from "../../components/ui/modal/Modal";

import RemarkModal from "../../components/ui/modal/RemarkModal";
import Button from "../../components/ui/button/Button";
import LoaderEmpt from "../../components/loader/LoaderEmpt";
import { FiClock, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  role = "user",
  onSubmit,
  formLoading = false,
}) => {
  const [userRemark, setUserRemark] = useState("");
  const [remarkError, setRemarkError] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Reset state when ticket changes
  useEffect(() => {
    if (ticket) {
      setUserRemark("");
      setRemarkError(false);
      setShowRemarkModal(false);
      setPreviewImage(null);
    }
  }, [ticket]);

  const {
    ticketCode = "",
    queryType = "No Subject",
    description = "No additional details provided",
    media = [],
    status: currentStatus = "OPEN",
    createdAt,
  } = ticket || {};

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "";

  const getStatusConfig = (status) => {
    const config = {
      OPEN: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        icon: <FiAlertCircle className="w-4 h-4" />,
        label: "Open",
      },
      INPROGRESS: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: <FiClock className="w-4 h-4" />,
        label: "In Progress",
      },
      RESOLVED: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: <FiCheckCircle className="w-4 h-4" />,
        label: "Resolved",
      },
      CLOSED: {
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: <FiXCircle className="w-4 h-4" />,
        label: "Closed",
      },
    };
    return config[status] || config.OPEN;
  };

  const mediaFiles = useMemo(
    () => ({
      images: media.filter((url) => !url.match(/\.(mp4|webm|ogg)$/i)),
      videos: media.filter((url) => url.match(/\.(mp4|webm|ogg)$/i)),
    }),
    [media]
  );

  // Get next status for admin (only next, not current)
  const nextStatus = useMemo(() => {
    if (role !== "admin") return null;
    const statusFlow = {
      OPEN: "INPROGRESS",
      INPROGRESS: "RESOLVED",
      RESOLVED: "CLOSED",
      CLOSED: null,
    };
    return statusFlow[currentStatus] || null;
  }, [role, currentStatus]);

  const handleAdminStatusUpdate = () => {
    if (!nextStatus) return;

    // Remark required only for RESOLVED
    if (nextStatus === "RESOLVED") {
      setShowRemarkModal(true);
    } else {
      onSubmit?.({ status: nextStatus });
    }
  };

  const handleRemarkSubmit = () => {
    if (!userRemark.trim()) {
      setRemarkError(true);
      return;
    }
    onSubmit?.({ status: "RESOLVED", remark: userRemark.trim() });
    setShowRemarkModal(false);
  };

  if (!ticket) return null;

  const statusConfig = getStatusConfig(currentStatus);
  const nextStatusConfig = nextStatus ? getStatusConfig(nextStatus) : null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={!formLoading}>
        {formLoading && <LoaderEmpt />}
        <div className="space-y-5">
          {/* Header with Status Badge */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-4 mt-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 capitalize">{queryType}</h2>
              <p className="text-sm text-gray-500 mt-1">#{ticketCode}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} mr-8`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Ticket Code" value={ticketCode} icon="🎫" />
            <InfoCard label="Raised At" value={formatDate(createdAt)} icon="📅" />
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Admin Remark */}
          {ticket?.remark && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <label className="text-xs font-medium text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" />
                Admin Resolution
              </label>
              <p className="mt-2 text-emerald-800 text-sm leading-relaxed">{ticket.remark}</p>
            </div>
          )}

          {/* Media */}
          {mediaFiles.images.length + mediaFiles.videos.length > 0 && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attachments</label>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaFiles.images.map((url, idx) => (
                  <div key={idx} className="relative group cursor-pointer" onClick={() => { setPreviewImage(url); setPreviewIndex(idx); }}>
                    <img
                      src={url}
                      alt={`Attachment ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">View</span>
                    </div>
                  </div>
                ))}
                {mediaFiles.videos.map((url, idx) => (
                  <div key={idx} className="relative">
                    <video
                      src={url}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      controls
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Progress Indicator */}
          <StatusProgress currentStatus={currentStatus} />

          {/* Action Buttons */}
          <div className="border-t border-gray-100 pt-4">
            {role === "admin" ? (
              nextStatus && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Move to: <span className={`font-medium ${nextStatusConfig?.text}`}>{nextStatusConfig?.label}</span>
                  </div>
                  <Button
                    label={`Mark as ${nextStatusConfig?.label}`}
                    onClick={handleAdminStatusUpdate}
                    isLoading={formLoading}
                    disabled={formLoading}
                  />
                </div>
              )
            ) : (
              currentStatus === "RESOLVED" && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Issue resolved? Close this ticket.</p>
                  <Button
                    label="Close Ticket"
                    onClick={() => onSubmit?.({ status: "CLOSED" })}
                    isLoading={formLoading}
                    disabled={formLoading}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </Modal>

      {/* Remark Modal */}
      <RemarkModal
        label="Resolution Remark"
        placeholder="Describe how the issue was resolved..."
        isOpen={showRemarkModal}
        onClose={() => setShowRemarkModal(false)}
        remark={userRemark}
        setRemark={setUserRemark}
        error={remarkError}
        onSubmit={handleRemarkSubmit}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        images={mediaFiles.images}
        currentIndex={previewIndex}
        setCurrentIndex={setPreviewIndex}
      />
    </>
  );
};

// --- Info Card Component ---
const InfoCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  </div>
);

// --- Status Progress Component ---
const StatusProgress = ({ currentStatus }) => {
  const steps = [
    { key: "OPEN", label: "Open" },
    { key: "INPROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
    { key: "CLOSED", label: "Closed" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isAllCompleted = currentStatus === "CLOSED";

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex || isAllCompleted;
          const isCurrent = index === currentIndex && !isAllCompleted;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 text-white ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <span className={`text-xs mt-1.5 whitespace-nowrap ${isCurrent ? "text-blue-600 font-medium" : isCompleted ? "text-emerald-600 font-medium" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-1 ${index < currentIndex || isAllCompleted ? "bg-emerald-500" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Image Preview Modal Component ---
const ImagePreviewModal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  if (!isOpen || !images.length) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrev(e);
    if (e.key === "ArrowRight") handleNext(e);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <FiXCircle className="w-8 h-8" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`Preview ${currentIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumb ${idx + 1}`}
              className={`w-12 h-12 object-cover rounded cursor-pointer transition-all ${
                idx === currentIndex ? "ring-2 ring-white opacity-100" : "opacity-50 hover:opacity-75"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketDetailsModal;
