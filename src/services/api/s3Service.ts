import axiosInstance from ".";
import { API_CONFIG } from "../config/api";
import type { ApiResponse } from "../../interface/api";
import type { BaseFileResponse } from "../../interface/common";
import type { PresignResponse } from "../../interface/storage";

interface UploadFileOptions {
    fileName?: string;
    key?: string;
}

const getPresignedUrl = async (
    contentType: string,
    fileName?: string,
    key?: string,
): Promise<PresignResponse> => {
    const response = await axiosInstance.post<ApiResponse<PresignResponse>>(
        API_CONFIG.ENDPOINTS.STORAGE.PRESIGN,
        { fileName, contentType, key },
    );

    const data = response.data.data;
    if (!data?.upload_url || !data.key || !data.public_url) {
        throw new Error("Invalid presign response from server");
    }
    return data;
};

const readImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
            resolve({ width: 0, height: 0 });
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    });

export const uploadFileToS3 = async (
    file: File,
    options?: UploadFileOptions,
): Promise<BaseFileResponse> => {
    const contentType = file.type || "application/octet-stream";

    const { upload_url, key, public_url } = await getPresignedUrl(
        contentType,
        options?.fileName ?? file.name,
        options?.key,
    );

    const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: file,
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("[S3 upload] PUT failed", {
            status: uploadResponse.status,
            key,
            body: errorText,
        });
        throw new Error(`S3 upload failed (${uploadResponse.status}): ${errorText}`);
    }

    const { width, height } = await readImageDimensions(file);

    const fileType = contentType.startsWith("video/") ? "video" : "image";

    return {
        file_id: key,
        title: options?.fileName ?? file.name,
        project_url: public_url,
        thumbnail_url: public_url,
        width,
        height,
        file_type: fileType,
    };
};
