import axiosInstance from "../../config/axiosConfig";

const token = localStorage.getItem("token");

export const deviceTypes = async () => {
  const deviceTypes = await axiosInstance.get(
    "/api/v1/campaign/dropdown/devices",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials : true
    }
  );
  
  return deviceTypes?.data?.data;
};

export const productTypes = async () => {
  const productTypes = await axiosInstance.get(
    "/api/v1/campaign/dropdown/products",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials : true
    }
    
  );

  return productTypes?.data?.data;
};

export const targetRegions = async () => {
  const targetRegions = await axiosInstance.get(
    "/api/v1/campaign/dropdown/locations",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return targetRegions?.data?.data;
};


export const estimatePrice = async (data) => {
  const response = await axiosInstance.post("/api/v1/campaign/baseCost", data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data;
};