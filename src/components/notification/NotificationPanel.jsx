import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiAlertCircle, FiBell, FiX } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "../../redux/slices/shared/notificationSlice";

const getIcon = (type) => {
  switch (type) {
    case "alert":
      return <FiAlertCircle className="w-5 h-5 text-red-500" />;
    case "payment":
      return <MdOutlinePayment className="w-5 h-5 text-green-500" />;
    case "withdrawal":
      return <BiMoneyWithdraw className="w-5 h-5 text-green-500" />;
    case "system":
      return <IoWarningOutline className="w-5 h-5 text-yellow-600" />;
    default:
      return <FiAlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

const BellIcon = ({ hasUnread }) => (
  <div className="relative">
    <FiBell className="w-6 h-6 text-gray-600" />
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
    )}
  </div>
);

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("all");
  const panelRef = useRef(null);
  const dispatch = useDispatch();

  const { notifications, loading, unreadCount } = useSelector(
    (state) => state.notification
  );

  // Fetch notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
    // Add navigation logic here if needed
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "read") return n.read;
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "read", label: "Read" },
    { id: "unread", label: "Unread" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiBell className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1a365d] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="px-4 pt-3">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-180px)] p-4 space-y-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No notifications
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 rounded-lg border-l-4 ${
                  !notification.read
                    ? "border-l-[#1a365d] bg-blue-50/50"
                    : "border-l-transparent bg-gray-50"
                } hover:bg-gray-100 transition-colors cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 text-sm">
                        {notification.title}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatTimeAgo(notification.timestamp || notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export { NotificationPanel, BellIcon };
export default NotificationPanel;
