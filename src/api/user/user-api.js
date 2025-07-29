import axiosInstance from "../../config/axiosConfig";


export const loginUserApi = async (credentials) => {
  const response = await axiosInstance.post(
    `/api/auth/login`,
    credentials
  );
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/api/v1/users/myProfile' , {
      withCredentials: true,
    });
  return response.data;
};

export const updateUserProfile = async (data) => {
  
  const response = await axiosInstance.put('/api/v1/users/editProfile', data , {
      withCredentials: true,
  });
  return response.data;
};

export const resetUserPassword = async (passwordData) => {

  const response = await axiosInstance.post('/api/auth/reset-password', passwordData , {
      withCredentials: true,
  });
  
  return response.data;
}





export const getforgotPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/auth/forgot-password',data,{
      withCredentials: true,
  })

  return response.data
}
export const submitNewPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/auth/reset-password-otp',data,{
      withCredentials: true,
  })

  return response.data
}