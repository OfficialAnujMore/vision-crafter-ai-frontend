import axiosInstance from ".";
import { API_CONFIG } from "../../config/api";
import type { ApiResponse } from "../../interface/api";
import type { BaseFileResponse } from "../../interface/common";
import type { ImageKitAuthResponse } from "../../interface/imagekit";
import { showSuccessToast } from "../../utils/toast";

const authenticateImageKit = async (): Promise<ImageKitAuthResponse> => {
    const authResponse = await axiosInstance.get<ApiResponse<ImageKitAuthResponse>>(
        API_CONFIG.ENDPOINTS.IMAGEKIT.AUTH,
    );
    
    const authData = authResponse.data.data;
    
    if (!authData || !authData.token || !authData.signature || !authData.expire) {
        throw new Error('Invalid authentication response from ImageKit');
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    if (authData.expire < currentTime) {
        throw new Error('Authentication token has expired');
    }

    return authData;
};

export const uploadFileToImageKit = async (file: File): Promise<BaseFileResponse> => {
    const { token, signature, expire } = await authenticateImageKit();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', signature);
    formData.append('expire', expire.toString());
    formData.append('token', token);
    formData.append('fileName', file.name);

    const uploadResponse = await fetch(API_CONFIG.IMAGEKIT_UPLOAD_URL, {
        method: 'POST',
        body: formData,
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`ImageKit upload failed: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    
    showSuccessToast('File uploaded successfully!');
    
    return {
        title: uploadData.name,
        project_url: uploadData.url,
        thumbnail_url: uploadData.thumbnailUrl,
        width: uploadData.width,
        height: uploadData.height,
        file_type: uploadData.fileType
    };
};



