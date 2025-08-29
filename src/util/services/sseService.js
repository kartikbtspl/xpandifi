let eventSource;

export const initCampaignSSE = (onData) => {
  if (eventSource) return;

  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/retailers/live?token=${encodeURIComponent(token)}`;

  console.log("Connecting to SSE...");
  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("SSE connection established:", url);
  };

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (onData) onData(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error parsing SSE data:", err);
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