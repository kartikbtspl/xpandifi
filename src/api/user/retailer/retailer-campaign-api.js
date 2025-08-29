import axiosInstance from "../../../config/axiosConfig";


export const getRetailerCampaigns = async () => {
  try {
    const response = axiosInstance.get(
      "/api/v1/retailers/fetchActiveCampaigns",
      {
        withCredentials: true,
      }
    );
    return (await response)?.data?.data;
  } catch (error) {
    console.error("Error fetching retailer campaigns:", error);
    throw error;
  }
};
