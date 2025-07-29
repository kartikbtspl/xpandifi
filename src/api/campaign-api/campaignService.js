import axiosInstance from "../../config/axiosConfig";


export const createCampaignAPI = async (data) => {
  const token =localStorage.getItem("token")
 
  const formData = new FormData();

 Object.entries(data).forEach(([key, value]) => {
    if (key === "productFiles" && Array.isArray(value)) {
      value.forEach((file) => {
        formData.append("productFiles", file);
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  


const response = await axiosInstance.post(
    "/api/v1/campaign/createCampaign",
    formData,
    {
      headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
      withCredentials:true
    }
  );
  
  return response?.data;
};



export const getCampaignsAPI = async () => {
  const response = await axiosInstance.get("api/v1/campaign/getUserCampaign", {
    withCredentials: true,
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
    }
  );

  return response?.data?.data;
};



export const updateUserCampaign = async (id, data, oldImages = []) => {
  const formData = new FormData();

  // Handle productFiles (only upload actual File objects)
  if (Array.isArray(data.productFiles)) {
    data.productFiles.forEach((item) => {
      if (item instanceof File) {
        formData.append("productFiles", item); // append new uploads
      }
    });
  }

  // Append old image URLs as JSON string
  formData.append("existingFiles", JSON.stringify(oldImages)); // ✅ this is key

  // Add the rest of the fields
  Object.entries(data).forEach(([key, value]) => {
    if (key === "productFiles") return; // already handled

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
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
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
console.log("🧪 FormData contents:");
for (let pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}
  return response?.data;
};




export const deleteCampaignAPI = async (id) => {
  const response = await axiosInstance.delete(
    `/api/v1/campaign/${id}/deleteCampaign`,
    {
      withCredentials: true,
    }
  );

  return response?.data;
};


