import axiosInstance from "../../config/axiosConfig";


export const deviceTypes = async () => {
  const deviceTypes = await axiosInstance.get(
    "/api/v1/campaign/dropdown/devices",
    {
      withCredentials : true
    }
  );

  
  return deviceTypes?.data?.data;
};

export const productTypes = async () => {
  const productTypes = await axiosInstance.get(
    "/api/v1/campaign/dropdown/products",
    {
      withCredentials : true
    }
    
  );
  

  return productTypes?.data?.data;
};

export const targetRegions = async () => {
  const targetRegions = await axiosInstance.get(
    "/api/v1/campaign/dropdown/locations",
    {
      withCredentials: true,
    }
  );
  return targetRegions?.data?.data;
};


export const estimatePrice = async (data) => {
  const response = await axiosInstance.post("/api/v1/campaign/baseCost", data, {
    withCredentials: true,
  });
 
  return response?.data?.data?.baseCost;
};