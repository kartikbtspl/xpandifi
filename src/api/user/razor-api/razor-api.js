import axiosInstance from "../../../config/axiosConfig";


export const createOrder = async (data) => {
  const response = await axiosInstance.post(
    `/api/v1/payment/create-order`,
    data
  );
  return response.data;
};
export const verifyPayment = async (data) => {
  const response = await axiosInstance.post(
    `/api/v1/payment/verify-payment`,
    data
  );
  return response.data;
};