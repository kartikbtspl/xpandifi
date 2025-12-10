import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  deleteNotificationAPI,
} from "../../../api/shared/notificationService";

// ==================== Async Thunks ====================

// Fetch all notifications
export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationsAPI();
      return response.data || response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// Mark single notification as read
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await markNotificationReadAPI(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsReadAPI();
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (notificationId, { rejectWithValue }) => {
    try {
      await deleteNotificationAPI(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

// ==================== Initial State ====================
const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

// ==================== Slice ====================
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Add a new notification (for real-time updates via SSE/WebSocket)
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    // Clear all notifications (on logout)
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
    // Clear error
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Fetch Notifications =====
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Mark as Read =====
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ===== Mark All as Read =====
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ===== Delete Notification =====
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload
        );
        if (index !== -1) {
          if (!state.notifications[index].read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addNotification, clearNotifications, clearNotificationError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
