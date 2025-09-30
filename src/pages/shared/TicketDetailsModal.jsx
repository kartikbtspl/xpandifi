import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../../components/ui/modal/Modal";
import MediaCarousels from "../../components/ui/carousel/MediaCarousels";
import RemarkModal from "../../components/ui/modal/RemarkModal";
import Button from "../../components/ui/button/Button";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  role = "user",
  onSubmit,
  formLoading = false, // <- added loading prop
}) => {
  const [userRemark, setUserRemark] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [remarkError, setRemarkError] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);

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
    subject = "No Subject",
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
      RESOLVED: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
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
    if (role === "admin") {
      const optionsMap = {
        ACTIVE: ["RESOLVED", "CLOSED"],
        RESOLVED: ["ACTIVE", "CLOSED"],
        CLOSED: ["ACTIVE", "RESOLVED"],
      };
      return optionsMap[currentStatus] || [];
    } else {
      return currentStatus === "ACTIVE" ? ["ACTIVE", "CLOSED"] : [];
    }
  }, [role, currentStatus]);

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    setStatus(selected);

    // Show remark modal if status requires a mandatory remark
    if (
      (role === "admin" && (selected === "RESOLVED" || selected === "CLOSED")) ||
      (role !== "admin" && selected === "CLOSED")
    ) {
      setShowRemarkModal(true);
    } else {
      setShowRemarkModal(false);
    }
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

    if (typeof onSubmit === "function") {
      onSubmit({
        status,
        remark: userRemark.trim(),
      });
    }

    setShowRemarkModal(false);
    onClose();
  };

  if (!ticket) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{subject}</h2>
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                currentStatus
              ).bg} ${getStatusColor(currentStatus).text} ${getStatusColor(currentStatus).border}`}
            >
              {currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoBox label="Ticket Code" value={ticketCode} />
            <InfoBox label="Raised At" value={formatDate(createdAt)} />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description</label>
            <div className="w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm min-h-[80px]">
              {description}
            </div>
          </div>

          {mediaFiles.images.length + mediaFiles.videos.length > 0 && (
            <div>
              <label className="text-sm text-gray-600">Media</label>
              <div className="mt-2">
                <MediaCarousels mediaFiles={mediaFiles} size="sm" />
              </div>
            </div>
          )}

          {statusOptions.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Update Status</label>
                <select
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={status}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {statusOptions.length > 0 && (
            <div className="flex justify-end">
              <Button
                label="Update the Status"
                onClick={handleSubmit}
                isLoading={formLoading} // <- show loading on button
                disabled={formLoading}  // <- disable while loading
              />
            </div>
          )}
        </div>
      </Modal>

      <RemarkModal
        label="Reason for status change"
        isOpen={showRemarkModal}
        onClose={() => setShowRemarkModal(true)}
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

const InfoBox = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
      {value || "—"}
    </div>
  </div>
);

export default TicketDetailsModal;