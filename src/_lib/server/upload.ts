import { axiosConfig } from "../config/config";

export const uploadImage = async (formData:FormData) => { 
    const resp = await axiosConfig.post('upload', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })  

    return resp.data;
}