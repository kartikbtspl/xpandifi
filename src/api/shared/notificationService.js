import axiosInstance from "../../config/axiosConfig";

// ============================================================
// 🔧 TOGGLE THIS FLAG TO SWITCH BETWEEN SAMPLE DATA AND API
// Set to `false` when backend API is ready
// ============================================================
const USE_SAMPLE_DATA = true;

// Get current user role from token
const getCurrentUserRole = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.userRole || null;
  } catch {
    return null;
  }
};

// ============================================================
// SAMPLE DATA - Role Specific Notifications
// Remove this section when integrating with real API
// ============================================================
const sampleNotificationsByRole = {
  Retailer: [
    {
      id: 1,
      type: "alert",
      title: "Device Alert",
      message: "Device number GH12 has logged off. Check status of device now.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "Payment of ₹5,000 received for campaign 'Summer Sale'.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      message: "Upcoming maintenance update on 29-09-25",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 4,
      type: "alert",
      title: "Campaign Alert",
      message: "Campaign 'Holiday Promo' is ending in 2 days.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 5,
      type: "payment",
      title: "Payments",
      message: "Device number GH12 has logged off. Check status of device now.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  "Ad-Agency": [
    {
      id: 1,
      type: "alert",
      title: "Bid Update",
      message: "Your bid for 'Tech Store Campaign' has been accepted.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "withdrawal",
      title: "Withdrawal",
      message: "Withdrawal request of ₹10,000 is being processed.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment",
      message: "Payment of ₹15,000 credited to your wallet.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "System",
      message: "New campaign opportunities available in your area.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 5,
      type: "withdrawal",
      title: "Withdrawal",
      message: "Agency 12 has withdrawn for campaign Zero To One (By Peter Thi...",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  SUPERADMIN: [
    {
      id: 1,
      type: "alert",
      title: "User Alert",
      message: "New retailer registration pending approval.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Payout",
      message: "Bulk payout of ₹50,000 processed successfully.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "system",
      title: "System",
      message: "Server maintenance scheduled for tonight 2 AM.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 4,
      type: "alert",
      title: "Campaign Review",
      message: "5 campaigns pending review and approval.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 5,
      type: "withdrawal",
      title: "Withdrawal Request",
      message: "Agency 'MediaPro' requested withdrawal of ₹25,000.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 6,
      type: "system",
      title: "System",
      message: "Upcoming maintenance update on 29-09-25",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  ADMIN: [
    {
      id: 1,
      type: "alert",
      title: "User Alert",
      message: "New retailer registration pending approval.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 2,
      type: "system",
      title: "System",
      message: "Daily report generated successfully.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Campaign Review",
      message: "3 campaigns pending review.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 4,
      type: "payment",
      title: "Payments",
      message: "Device number GH12 has logged off. Check status of device now.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
};

// In-memory store for sample data (to persist read/delete state during session)
let sampleDataStore = null;

const getSampleData = () => {
  if (!sampleDataStore) {
    const role = getCurrentUserRole();
    sampleDataStore = [...(sampleNotificationsByRole[role] || [])];
  }
  return sampleDataStore;
};

export const resetSampleData = () => {
  sampleDataStore = null;
};

// ============================================================
// API FUNCTIONS
// ============================================================

export const getNotificationsAPI = async () => {
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: getSampleData() };
  }

  const response = await axiosInstance.get("/api/v1/notifications", {
    withCredentials: true,
  });
  return response?.data;
};

export const markNotificationReadAPI = async (notificationId) => {
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const data = getSampleData();
    const notification = data.find((n) => n.id === notificationId);
    if (notification) notification.read = true;
    return { success: true };
  }

  const response = await axiosInstance.patch(
    `/api/v1/notifications/${notificationId}/read`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const markAllNotificationsReadAPI = async () => {
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const data = getSampleData();
    data.forEach((n) => (n.read = true));
    return { success: true };
  }

  const response = await axiosInstance.patch(
    "/api/v1/notifications/read-all",
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const deleteNotificationAPI = async (notificationId) => {
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const data = getSampleData();
    const index = data.findIndex((n) => n.id === notificationId);
    if (index !== -1) data.splice(index, 1);
    return { success: true };
  }

  const response = await axiosInstance.delete(
    `/api/v1/notifications/${notificationId}`,
    { withCredentials: true }
  );
  return response?.data;
};
