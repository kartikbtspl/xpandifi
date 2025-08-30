import { store } from "../../redux/store";
import { setCampaigns } from "../../redux/slices/user/approvedCampaignSlice";

let eventSource;

export const initCampaignSSE = () => {
  if (eventSource) return;

  const token = localStorage.getItem("token");
  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/api/v1/retailers/live?token=${encodeURIComponent(token)}`;

  console.log("Connecting to SSE...");
  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("SSE connection established:", url);
  };
  eventSource.onmessage = (event) => {
    try {
      if (!event.data || event.data.startsWith(":")) {
        // ignore heartbeats
        return;
      }

      console.log("Raw SSE event:", event.data);

      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        console.warn("Non-JSON SSE message, ignoring:", event.data);
        return;
      }

      console.log("Parsed SSE data:", parsed);
      store.dispatch(setCampaigns(Array.isArray(parsed) ? parsed : []));
    } catch (err) {
      console.error("Error handling SSE message:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
};

export const closeCampaignSSE = () => {
  if (eventSource) {
    console.log("Closing SSE connection...");
    eventSource.close();
    eventSource = null;
  }
};