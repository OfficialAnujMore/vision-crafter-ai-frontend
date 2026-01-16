import axiosInstance from ".";
import { API_CONFIG } from "../../config/api";
import type { SaveImageResponse } from "./imageKitService";


export const getUserProjects = async (userid: number): Promise<Array<SaveImageResponse>> => {


    const response = await axiosInstance.get<Array<SaveImageResponse>>(
        API_CONFIG.ENDPOINTS.PROJECT.USER_PROJECTS + userid
    )
    console.log(response);

    return response.data
}