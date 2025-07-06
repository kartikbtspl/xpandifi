import axiosInstance from "../../config/axiosConfig";

const token = localStorage.getItem("token");

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/api/v1/users/myProfile' , {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  return response.data;
};

export const updateUserProfile = async (data) => {
  
  const response = await axiosInstance.put('/api/v1/users/editProfile', data , {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
  });
  return response.data;
};

export const resetUserPassword = async (passwordData) => {

  const response = await axiosInstance.post('/api/auth/reset-password', passwordData , {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
  });
  
  return response.data;
}