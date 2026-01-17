import axiosInstance from ".";
import { API_CONFIG } from "../../config/api";
import type { ApiResponse } from "../../interface/api";
import type { SaveFileResponse, SaveFile } from "../../interface/project";
import { showSuccessToast } from "../../utils/toast";


export const projectService = {

    saveCreatedFile: async (data: SaveFile): Promise<SaveFileResponse> => {
        const response = await axiosInstance.post<ApiResponse<SaveFileResponse>>(
            API_CONFIG.ENDPOINTS.PROJECT.CREATE,
            data
        );

        showSuccessToast(
            response.data.message || 'Project saved successfully',
            'Your work has been saved to the cloud'
        );

        return response.data.data;
    },

    getUserProjects: async (userid: number): Promise<Array<SaveFileResponse>> => {
        const response = await axiosInstance.get<ApiResponse<Array<SaveFileResponse>>>(
            `${API_CONFIG.ENDPOINTS.PROJECT.USER_PROJECTS}${userid}`
        );
        
        return response.data.data;
    }
}


