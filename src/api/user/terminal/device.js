import axiosInstance from "../../../config/axiosConfig"


export const getAllRequestAPI = async ()=>{
    const response = await axiosInstance.get(`/api/v1/terminal/all`,{withCredentials:true});
    return response?.data?.data;
}

export const createRequestAPI = async(data)=>{
    const response = axiosInstance.post("/api/v1/terminal/create",data,
        {withCredentials:true}
    );
    return (await response).data;
}


export const updateRequestAPI = async(id,data)=>{
    const response = axiosInstance.put(`/api/v1/terminal/${id}/update`,data,{withCredentials:true});
    return (await response).data;
}
export const deleteRequestAPI = async(id)=>{
        const response = axiosInstance.delete(`/api/v1/terminal/${id}/delete`,{withCredentials:true});
    return (await response).data;
}

export const getAllDevicesAPI = async ()=>{
    const response = await axiosInstance.get("/api/v1/terminal/devices/all",{withCredentials:true});
    console.log(response.data)
    return response?.data?.data;
}

