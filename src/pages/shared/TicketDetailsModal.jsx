import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../../components/ui/modal/Modal";
import MediaCarousels from "../../components/ui/carousel/MediaCarousels";
import RemarkModal from "../../components/ui/modal/RemarkModal";
import Button from "../../components/ui/button/Button";
import LoaderEmpt from "../../components/loader/LoaderEmpt";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  role = "user",
  onSubmit,
  formLoading = false,
}) => {
  const [userRemark, setUserRemark] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [remarkError, setRemarkError] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);

  // Reset state when ticket changes
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "ACTIVE");
      setUserRemark("");
      setRemarkError(false);
      setShowRemarkModal(false);
    }
  }, [ticket]);

  const {
    ticketCode = "",
    queryType = "No Subject",
    description = "No additional details provided",
    media = [],
    status: currentStatus = "ACTIVE",
    createdAt,
  } = ticket || {};

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "";

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
      RESOLVED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
      CLOSED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    };
    return colors[status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100" };
  };

  const mediaFiles = useMemo(
    () => ({
      images: media.filter((url) => !url.match(/\.(mp4|webm|ogg)$/i)),
      videos: media.filter((url) => url.match(/\.(mp4|webm|ogg)$/i)),
    }),
    [media]
  );

  const statusOptions = useMemo(() => {
    const adminOptions = ["ACTIVE", "RESOLVED", "CLOSED"];
    if (role === "admin") {
      return adminOptions.filter((s) => s !== status).concat(status); // keep current status on top
    } else {
      return status === "ACTIVE" ? ["ACTIVE", "CLOSED"] : [status];
    }
  }, [role, status]);

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    setStatus(selected);

    const requiresRemark =
      (role === "admin" && (selected === "RESOLVED" || selected === "CLOSED")) ||
      (role !== "admin" && selected === "CLOSED");

    setShowRemarkModal(requiresRemark);
  };

  const handleSubmit = () => {
    const requiresRemark =
      (role === "admin" && (status === "RESOLVED" || status === "CLOSED")) ||
      (role !== "admin" && status === "CLOSED");

    if (requiresRemark && !userRemark.trim()) {
      setRemarkError(true);
      setShowRemarkModal(true);
      return;
    }

    onSubmit?.({ status, remark: userRemark.trim() });
    setShowRemarkModal(false);
  };

  if (!ticket) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={!formLoading}>
        {formLoading && <LoaderEmpt />}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-2xl font-semibold">{queryType}</h2>
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(currentStatus).bg} ${getStatusColor(currentStatus).text} ${getStatusColor(currentStatus).border}`}
            >
              {currentStatus}
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoBox label="Ticket Code" value={ticketCode} />
            <InfoBox label="Raised At" value={formatDate(createdAt)} />
          </div>

          {/* Description */}
          <InfoBox label="Description" value={description} />

          {/* Remark if exists */}
          {ticket?.remark && (
            <InfoBox label="Remark" value={ticket.remark} textColor="text-red-500" />
          )}

          {/* Media */}
          <div>
            <label className="text-sm text-gray-600">Media</label>
            {mediaFiles.images.length + mediaFiles.videos.length > 0 ? (
              <div className="mt-2">
                <MediaCarousels mediaFiles={mediaFiles} size="xs" />
              </div>
            ) : (
              <p className="text-gray-400 mt-1 text-sm">No media attached</p>
            )}
          </div>

          {/* Status Update */}
          {statusOptions.length > 0 && (
            <StatusUpdateSection
              role={role}
              status={status}
              statusOptions={statusOptions}
              onStatusChange={handleStatusChange}
              onSubmit={handleSubmit}
              formLoading={formLoading}
            />
          )}
        </div>
      </Modal>

      {/* Remark Modal */}
      <RemarkModal
        label="Remark"
        placeholder="Reason for status change"
        isOpen={showRemarkModal}
        onClose={() => setShowRemarkModal(false)}
        remark={userRemark}
        setRemark={setUserRemark}
        error={remarkError}
        onSubmit={() => {
          setRemarkError(false);
          handleSubmit();
        }}
      />
    </>
  );
};

// --- Reusable InfoBox ---
const InfoBox = ({ label, value, textColor = "text-gray-800" }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className={`mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm ${textColor}`}>
      {value || "—"}
    </div>
  </div>
);

// --- Reusable Status Update Section ---
const StatusUpdateSection = ({ role, status, statusOptions, onStatusChange, onSubmit, formLoading }) => (
  <div className="space-y-2 mt-4">
    <div>
      <label className="text-sm font-medium text-gray-600">Update Status</label>
      <select
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={status}
        onChange={onStatusChange}
        disabled={formLoading}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="flex justify-end">
      <Button label="Update Status" onClick={onSubmit} isLoading={formLoading} disabled={formLoading} />
    </div>
  </div>
);

export default TicketDetailsModal;