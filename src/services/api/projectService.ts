import axiosInstance from ".";
import { API_CONFIG } from "../config/api";
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
    },

    deleteProjectByFileId: async (fileId: string): Promise<void> => {

        await axiosInstance.delete<ApiResponse<null>>(
            `${API_CONFIG.ENDPOINTS.PROJECT.DELETE_BY_FILE_ID}${fileId}`
        );
        showSuccessToast(
            'Project deleted successfully',
            'The selected project has been removed.'
        );
    },
    getProjectById: async (projectId: number): Promise<SaveFileResponse> => {
        const response = await axiosInstance.get<ApiResponse<SaveFileResponse>>(
            `${API_CONFIG.ENDPOINTS.PROJECT.GET_PROJECT}${projectId}`
        )
        return response.data.data
    },
    updateProject: async (projectId: number, updates: Record<string, unknown>): Promise<SaveFileResponse> => {
        const response = await axiosInstance.patch<ApiResponse<SaveFileResponse>>(
            `${API_CONFIG.ENDPOINTS.PROJECT.GET_PROJECT}${projectId}`,
            updates
        );
        return response.data.data;
    }

}


