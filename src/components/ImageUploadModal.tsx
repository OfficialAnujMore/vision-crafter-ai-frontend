import React, { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { useLoader } from './LoaderContext';
import { authService } from '../services/api/authService';
import { uploadFileToImageKit } from '../services/api/imageKitService';
import { projectService } from '../services/api/projectService';
import '../styles/ImageUploadModal.css';
import { showWarningToast } from '../utils/toast';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { setLoading } = useLoader();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const onDropRejected = useCallback(
        (fileRejections: FileRejection[]) => {
            const rejection = fileRejections[0];
            if (!rejection) return;

            const { errors } = rejection;

            if (errors.some(e => e.code === 'file-too-large')) {
                showWarningToast('File size exceeds 5MB. Please upload a smaller image.');
                return;
            }

            if (errors.some(e => e.code === 'file-too-small')) {
                showWarningToast('File is too small.');
                return;
            }

            if (errors.some(e => e.code === 'file-invalid-type')) {
                showWarningToast('Invalid file type. Please upload an image.');
                return;
            }

            if (errors.some(e => e.code === 'too-many-files')) {
                showWarningToast('Please upload only one image.');
                return;
            }

            showWarningToast('File rejected. Please try another file.');
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropRejected,
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
    });



    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);

        try {
            const response = await uploadFileToImageKit(selectedFile);
            const currentUser = authService.getCurrentUser();

            if (!currentUser?.id) {
                throw new Error('User not authenticated');
            }

            const imageData = { ...response, user_id: currentUser.id };
            await projectService.saveCreatedFile(imageData);
            handleClose();
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setLoading(false);
        }
    }


    const handleClose = () => {
        setPreview(null);
        setSelectedFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="image-upload-modal">
            <div className="image-upload-modal__container">
                <div className="image-upload-modal__header">
                    <CustomText
                        variant='h5'
                        value="Upload Image"
                    />
                    <CustomButton
                        variant='icon'
                        icon={<X size={24} />}
                        onClick={handleClose}
                    />
                </div>

                <div className="image-upload-modal__content">
                    {!preview ? (
                        <div
                            {...getRootProps()}
                            className={`image-upload-modal__dropzone ${isDragActive ? 'image-upload-modal__dropzone--active' : ''
                                }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="image-upload-modal__upload-icon" size={48} />
                            <CustomText
                                variant='h5'
                                value={isDragActive
                                    ? 'Drop the image here'
                                    : 'Drag & drop an image here'}
                            />
                            <CustomText
                                variant='p'
                                value="or click to select a file"
                            />
                        </div>
                    ) : (
                        <div className="image-upload-modal__preview-container">
                            <div className="image-upload-modal__preview-wrapper">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="image-upload-modal__preview-image"
                                />
                            </div>
                            <CustomButton
                                variant='primary'
                                text="Choose a different image"
                                onClick={() => {
                                    setPreview(null);
                                    setSelectedFile(null);
                                }}

                            />

                        </div>
                    )}
                </div>
                <div className='image-upload-modal__description'>
                    <CustomText
                        variant='caption'
                        value="Supports PNG, JPG, WEBP up to 5MB"
                    />
                </div>


                <div className="image-upload-modal__footer">
                    <CustomButton
                        variant='ternary'
                        text="Cancel"
                        onClick={handleClose}

                    />
                    <CustomButton
                        variant='primary'
                        text="Upload"
                        disabled={!selectedFile}
                        onClick={handleUpload}

                    />
                </div>
            </div>
        </div>
    );
};