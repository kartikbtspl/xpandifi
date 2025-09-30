import axiosInstance from "../../../config/axiosConfig";


export const getAllTicketAPI = async () => {
  const response = axiosInstance.get("/api/v2/ticket/all");
  return response.data;
};


export const updateStatusTicketAPI = async (id,data) => {
  const response = axiosInstance.put(`/api/v2/ticket/${id}`, data);
  return response.data;
};