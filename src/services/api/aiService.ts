import axiosInstance from ".";
import { API_CONFIG } from "../config/api";
import type { ApiResponse } from "../../interface/api";

interface RemoveBackgroundResponse {
  result_url: string;
}

export const removeBackground = async (imageUrl: string): Promise<string> => {
  const response = await axiosInstance.post<ApiResponse<RemoveBackgroundResponse>>(
    API_CONFIG.ENDPOINTS.AI.REMOVE_BACKGROUND,
    { image_url: imageUrl }
  );

  const resultUrl = response.data.data?.result_url;
  if (!resultUrl) {
    throw new Error("No result URL returned from background removal");
  }

  return resultUrl;
};
