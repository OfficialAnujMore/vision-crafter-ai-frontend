import axiosInstance from ".";
import { API_CONFIG } from "../config/api";
import type { ApiResponse } from "../../interface/api";

interface RemoveBackgroundResponse {
  result_url: string;
  token_balance: number;
}

export const removeBackground = async (
  imageUrl: string
): Promise<{ resultUrl: string; tokenBalance: number }> => {
  const response = await axiosInstance.post<ApiResponse<RemoveBackgroundResponse>>(
    API_CONFIG.ENDPOINTS.AI.REMOVE_BACKGROUND,
    { image_url: imageUrl }
  );

  const resultUrl = response.data.data?.result_url;
  if (!resultUrl) {
    throw new Error("No result URL returned from background removal");
  }

  return { resultUrl, tokenBalance: response.data.data.token_balance };
};

export const ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
] as const;
export type AspectRatio = typeof ASPECT_RATIOS[number];

interface ExtendImageRequest {
  image_url: string;
  aspect_ratio: AspectRatio;
  prompt?: string;
}

interface ExtendImageResponse {
  result_url: string;
  token_balance: number;
}

export const extendImage = async (
  params: ExtendImageRequest
): Promise<{ resultUrl: string; tokenBalance: number }> => {
  const response = await axiosInstance.post<ApiResponse<ExtendImageResponse>>(
    API_CONFIG.ENDPOINTS.AI.EXTEND_IMAGE,
    params,
    { timeout: 120_000 }
  );

  const resultUrl = response.data.data?.result_url;
  if (!resultUrl) {
    throw new Error("No result URL returned from image extension");
  }

  return { resultUrl, tokenBalance: response.data.data.token_balance };
};

export const GENERATION_TOKEN_COST = 4;

export const GENERATION_MODELS = [
  {
    id: "flux-schnell",
    label: "Flux Schnell",
    description: "Fast & economical",
  },
  {
    id: "sdxl",
    label: "SDXL",
    description: "Balanced quality",
  },
  {
    id: "imagen-3",
    label: "Imagen 3",
    description: "Premium quality",
  },
] as const;

export type GenerationModelId = typeof GENERATION_MODELS[number]["id"];

interface GenerateImageRequest {
  prompt: string;
  model: GenerationModelId;
  aspect_ratio: AspectRatio;
}

interface GenerateImageResponse {
  result_url: string;
  token_balance: number;
}

export const generateImage = async (
  params: GenerateImageRequest
): Promise<{ resultUrl: string; tokenBalance: number }> => {
  const response = await axiosInstance.post<ApiResponse<GenerateImageResponse>>(
    API_CONFIG.ENDPOINTS.AI.GENERATE_IMAGE,
    params,
    { timeout: 120_000 }
  );

  const resultUrl = response.data.data?.result_url;
  if (!resultUrl) {
    throw new Error("No result URL returned from image generation");
  }

  return { resultUrl, tokenBalance: response.data.data.token_balance };
};

export const EDIT_TOKEN_COST = 4;

interface EditImageRequest {
  image_url: string;
  prompt: string;
}

interface EditImageResponse {
  result_url: string;
  token_balance: number;
}

export const editImage = async (
  params: EditImageRequest
): Promise<{ resultUrl: string; tokenBalance: number }> => {
  const response = await axiosInstance.post<ApiResponse<EditImageResponse>>(
    API_CONFIG.ENDPOINTS.AI.EDIT_IMAGE,
    params,
    { timeout: 120_000 }
  );

  const resultUrl = response.data.data?.result_url;
  if (!resultUrl) {
    throw new Error("No result URL returned from image edit");
  }

  return { resultUrl, tokenBalance: response.data.data.token_balance };
};
