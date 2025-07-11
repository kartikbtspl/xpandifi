import axiosInstance from "../../config/axiosConfig";

const token = localStorage.getItem("token");

export const getRetailerCampaigns = async () => {
  try {
    const response = axiosInstance.get(
      "/api/v1/retailers/fetchApproveCampaigns",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("Retailer Campaigns Response:", (await response).data.data);
    return (await response)?.data?.data;
  } catch (error) {
    console.error("Error fetching retailer campaigns:", error);
    throw error;
  }
};
