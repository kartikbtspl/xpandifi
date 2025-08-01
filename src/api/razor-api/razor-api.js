import axiosInstance from "../../config/axiosConfig";


export const createOrder = async (data) => {
  const response = await axiosInstance.post(
    `/api/payment/create-order`,
    data
  );
  return response.data;
};
export const verifyPayment = async (data) => {
  const response = await axiosInstance.post(
    `/api/payment/verify-payment`,
    data
  );
  return response.data;
};