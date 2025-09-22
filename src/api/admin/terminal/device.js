import axiosInstance from "../../../config/axiosConfig";

export const getAllRequestAPI = async ()=>{
    const response = await axiosInstance.get('/api/v2/terminal/all');
    return response.data;
}

export const updateRequestStatusAPI = async (id,status,remark="")=>{
    const response = axiosInstance.put(
         `/api/v2/withdrawal/${id}/status`,
    {
      isApproved: status,
      remark   
    }
    );
    return (await response).data;
}