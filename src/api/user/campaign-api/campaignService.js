import axiosInstance from "../../../config/axiosConfig";

export const createCampaignAPI = async (data) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (
      (key === "imageFiles" || key === "videoFiles" || key === "productFiles") &&
      Array.isArray(value)
    ) {
      value.forEach((file) => {
        formData.append(key, file);
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const response = await axiosInstance.post("/api/v1/campaign/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data;
};

export const updateUserCampaign = async (id, data, oldImages = [], oldVideos = []) => {
  const formData = new FormData();

  // Append new files only if they are actual File instances
  ['imageFiles', 'videoFiles', 'productFiles'].forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((file) => {
        if (file instanceof File) formData.append(key, file);
      });
    }
  });

  // Append old files info for backend to keep existing files
  formData.append("existingFiles", JSON.stringify([...oldImages, ...oldVideos]));

  // Append other fields (skip file keys)
  Object.entries(data).forEach(([key, value]) => {
    if (['imageFiles', 'videoFiles', 'productFiles'].includes(key)) return;

    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const token = localStorage.getItem("token");

  const response = await axiosInstance.put(`/api/v1/campaign/${id}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data;
};


export const getCampaignsAPI = async () => {
  const response = await axiosInstance.get("api/v1/campaign/all", {
    withCredentials: true,
  });
  return response?.data;
};

export const getCampaignByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/api/v1/campaign/${id}`, {
    withCredentials: true,
  });
  return response?.data?.data;
};

export const deleteCampaignAPI = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/campaign/${id}/delete`, {
    withCredentials: true,
  });
  return response?.data;
};



// import axiosInstance from "../../config/axiosConfig";



// export const createCampaignAPI = async (data) => {
//   console.log("Creating campaign with data:", data);
//   const token = localStorage.getItem("token");

//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if ((key === "imageFiles" || key === "videoFiles" || key === "productFiles") && Array.isArray(value)) {
//       value.forEach((file) => {
//         formData.append(key, file); // append each file under its key
//       });
//     } else if (Array.isArray(value)) {
//       formData.append(key, JSON.stringify(value));
//     } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
//       formData.append(key, JSON.stringify(value));
//     } else {
//       formData.append(key, value);
//     }
//   });

//   const response = await axiosInstance.post(
//     "/api/v1/campaign/create",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//       withCredentials: true,
//     }
//   );

//   return response?.data;
// };

// export const updateUserCampaign = async (id, data, oldImages = [], oldVideos = []) => {
//   const formData = new FormData();

//   // Append new image files if any
//   if (Array.isArray(data.imageFiles)) {
//     data.imageFiles.forEach((file) => {
//       if (file instanceof File) {
//         formData.append("imageFiles", file);
//       }
//     });
//   }

//   // Append new video files if any
//   if (Array.isArray(data.videoFiles)) {
//     data.videoFiles.forEach((file) => {
//       if (file instanceof File) {
//         formData.append("videoFiles", file);
//       }
//     });
//   }

//   // Append new productFiles if any (fallback if you use this key)
//   if (Array.isArray(data.productFiles)) {
//     data.productFiles.forEach((file) => {
//       if (file instanceof File) {
//         formData.append("productFiles", file);
//       }
//     });
//   }

//   // Append old files info as JSON strings (for backend to keep existing files)
//   formData.append("existingImages", JSON.stringify(oldImages));
//   formData.append("existingVideos", JSON.stringify(oldVideos));

//   // Append other fields except files
//   Object.entries(data).forEach(([key, value]) => {
//     if (key === "imageFiles" || key === "videoFiles" || key === "productFiles") return;

//     if (Array.isArray(value)) {
//       formData.append(key, JSON.stringify(value));
//     } else if (typeof value === "object" && value !== null) {
//       formData.append(key, JSON.stringify(value));
//     } else {
//       formData.append(key, value);
//     }
//   });

//   const token = localStorage.getItem("token");

//   const response = await axiosInstance.put(
//     `/api/v1/campaign/${id}/update`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//       withCredentials: true,
//     }
//   );

//   console.log("🧪 FormData contents:");
//   for (let pair of formData.entries()) {
//     console.log(`${pair[0]}:`, pair[1]);
//   }

//   return response?.data;
// };






// export const getCampaignsAPI = async () => {
//   const response = await axiosInstance.get("api/v1/campaign/all", {
//     withCredentials: true,
//   });
//   return response?.data;
// };


// export const getCampaignByIdAPI = async (id) => {
//   const response = await axiosInstance.get(
//     `/api/v1/campaign/${id}`,

//     {
//       withCredentials: true,
//     }
//   );

//   return response?.data?.data;
// };



// // export const updateUserCampaign = async (id, data, oldImages = []) => {
// //   const formData = new FormData();

// //   // Handle productFiles (only upload actual File objects)
// //   if (Array.isArray(data.productFiles)) {
// //     data.productFiles.forEach((item) => {
// //       if (item instanceof File) {
// //         formData.append("productFiles", item); // append new uploads
// //       }
// //     });
// //   }

// //   // Append old image URLs as JSON string
// //   formData.append("existingFiles", JSON.stringify(oldImages)); // ✅ this is key

// //   // Add the rest of the fields
// //   Object.entries(data).forEach(([key, value]) => {
// //     if (key === "productFiles") return; // already handled

// //     if (Array.isArray(value)) {
// //       formData.append(key, JSON.stringify(value));
// //     } else if (typeof value === "object" && value !== null) {
// //       formData.append(key, JSON.stringify(value));
// //     } else {
// //       formData.append(key, value);
// //     }
// //   });

// //   const token = localStorage.getItem("token");


// //   const response = await axiosInstance.put(
// //     `/api/v1/campaign/${id}/update`,
// //     formData,
// //     {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //         Authorization: `Bearer ${token}`,
// //       },
// //       withCredentials: true,
// //     }
// //   );
// // console.log("🧪 FormData contents:");
// // for (let pair of formData.entries()) {
// //   console.log(`${pair[0]}:`, pair[1]);
// // }
// //   return response?.data;
// // };

// // export const createCampaignAPI = async (data) => {

// //   console.log("Creating campaign with data:", data);
// //   const token =localStorage.getItem("token")
 
// //   const formData = new FormData();

// //  Object.entries(data).forEach(([key, value]) => {
// //     if (key === "productFiles" && Array.isArray(value)) {
// //       value.forEach((file) => {
// //         formData.append("productFiles", file);
// //       });
// //     } else if (Array.isArray(value)) {
// //       formData.append(key, JSON.stringify(value));
// //     } else if (typeof value === "object" && value !== null) {
// //       formData.append(key, JSON.stringify(value));
// //     } else {
// //       formData.append(key, value);
// //     }
// //   });

  


// // const response = await axiosInstance.post(
// //     "/api/v1/campaign/create",
// //     formData,
// //     {
// //       headers: {
// //     'Content-Type': 'multipart/form-data',
// //     Authorization: `Bearer ${token}`,
// //   },
// //       withCredentials:true
// //     }
// //   );
  
// //   return response?.data;
// // };


// export const deleteCampaignAPI = async (id) => {
//   const response = await axiosInstance.delete(
//     `/api/v1/campaign/${id}/delete`,
//     {
//       withCredentials: true,
//     }
//   );

//   return response?.data;
// };


