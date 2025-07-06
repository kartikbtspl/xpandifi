import axiosInstance from "../../config/axiosConfig";
const token = localStorage.getItem("token");
export const createCampaignAPI = async (data) => {
 
  const formData = new FormData();

 Object.entries(data).forEach(([key, value]) => {
    if (key === "productFiles" && Array.isArray(value)) {
      value.forEach((file) => {
        formData.append("productFiles", file); // ✅ Correct key
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  // Optional: Debug output
  

  const token = localStorage.getItem("token");

  const response = await axiosInstance.post(
    "/api/v1/campaign/createCampaign",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response?.data;
};



export const getCampaignsAPI = async () => {
  const response = await axiosInstance.get("api/v1/campaign/getUserCampaign", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

export const toggleCampaignStatusAPI = async (id, status) => {
  const response = await axiosInstance.put(`/api/v1/campaign/${id}/status`, {
    status,
  });
  return response.data;
};

export const getCampaignByIdAPI = async (id) => {
  const response = await axiosInstance.get(
    `/api/v1/campaign/${id}/getCampaign`,

    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response?.data?.data;
};

export const updateUserCampaign = async (id, data) => {
  

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "productFiles" && Array.isArray(value)) {
      value.forEach((file) => {
        formData.append("productFiles", file); // ✅ append each file
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value)); // ✅ stringify arrays
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value)); // ✅ stringify objects like dateRange
    } else {
      formData.append(key, value);
    }
  });

  
 
  const token = localStorage.getItem("token");

  const response = await axiosInstance.put(
    `/api/v1/campaign/${id}/updateCampaign`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // ✅ must be set
      },
      withCredentials: true,
    }
  );

  return response?.data;
};

