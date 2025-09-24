import axiosInstance from "../../../config/axiosConfig";

export const getAllRequestAPI = async ()=>{
    const response = await axiosInstance.get('/api/v2/terminal/all');
    return response?.data?.data;
}

export const updateRequestStatusAPI = async (id,status,remark="")=>{
    const response = axiosInstance.put(
         `/api/v2/terminal/${id}/status`,
    {
      status: status,
      remark   
    }
    );
    return (await response).data;
}