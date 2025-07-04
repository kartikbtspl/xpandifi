import axiosInstance from "../../config/axiosConfig";
import axios from "axios";

const API_URL = "https://your-api-url.com/api/user"; // Replace with your real API endpoint

 const token = localStorage.getItem("token") ;

export const fetchUserAPI = async () => {
    console.log(token);
    
  const response = await axios.get(
    `https://branchx-backend-api-4.onrender.com/api/v1/users/myProfile`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  console.log(response);
  console.log(token);

  return response.data;
};

export const updateUserAPI = async (data) => {
  const response = await axiosInstance.put(`${API_URL}/me`, data);
  return response.data;
};
