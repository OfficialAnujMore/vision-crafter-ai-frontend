import axiosInstance from ".";
import { API_CONFIG } from "../../config/api";

interface ImageKitAuthResponse {
    token: string;
    expire: number;
    signature: string;
}
interface UploadResponse {
    title: string;
    project_url: string;
    thumbnail_url: string;
    width: number;
    height: number;
    file_type: string;
}

interface SaveImage extends UploadResponse {
    user_id: number;
}

export interface SaveImageResponse extends UploadResponse {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;


}

export const uploadImagetoImageKit = async (file: File): Promise<UploadResponse> => {
    try {

        const authResponse = await axiosInstance.get<ImageKitAuthResponse>(
            API_CONFIG.ENDPOINTS.IMAGEKIT.AUTH,
        )
        if (!authResponse.data ||
            !authResponse.data.token ||
            !authResponse.data.signature ||
            !authResponse.data.expire) {
            throw new Error('Invalid authentication response from ImageKit');
        }
        const currentTime = Math.floor(Date.now() / 1000);
        if (authResponse.data.expire < currentTime) {
            throw new Error('Authentication token has expired');
        }
        const { token, signature, expire } = authResponse.data;

        console.log('Auth successful:', { token, expire });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
        formData.append('signature', signature);
        formData.append('expire', expire.toString());
        formData.append('token', token);
        formData.append('fileName', file.name);


        const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            body: formData,

        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('ImageKit error response:', errorText);
            throw new Error(`ImageKit upload failed: ${errorText}`);
        }

        const uploadData = await uploadResponse.json();


        return {
            title: uploadData.name,
            project_url: uploadData.url,
            thumbnail_url: uploadData.thumbnailUrl,
            width: uploadData.width,
            height: uploadData.height,
            file_type: uploadData.fileType
        };


    } catch (err) {
        console.error('Upload error:', err);
        throw err; // Re-throw so the calling component can handle it
    }


}

// TODO: Validate this code
export const saveCreatedImage = async (data: SaveImage): Promise<SaveImageResponse> => {

    const response = await axiosInstance.post<SaveImageResponse>(
        API_CONFIG.ENDPOINTS.PROJECT.CREATE,
        data
    )
    return response.data

}

