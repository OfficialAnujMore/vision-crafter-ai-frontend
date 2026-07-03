import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { X, Upload, ImagePlus, Sparkles, ArrowLeft } from 'lucide-react';
import CustomText from './CustomComponents/CustomText';
import CustomButton from './CustomComponents/CustomButton';
import { useLoader } from './LoaderContext';
import { authService } from '../services/api/authService';
import { uploadFileToS3 } from '../services/api/s3Service';
import { projectService } from '../services/api/projectService';
import '../styles/ImageUploadModal.css';
import { showWarningToast } from '../utils/toast';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    isOpen,
    onClose,
    onUploadSuccess,
}) => {
    const [mode, setMode] = useState<'choose' | 'upload' | 'blank'>('choose');
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const { setLoading } = useLoader();

    const handleClose = useCallback(() => {
        setMode('choose');
        setPreview(null);
        setSelectedFile(null);
        setFileName('');
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleClose]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            setFileName(nameWithoutExt);
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
            const originalExtension = selectedFile.name.includes('.')
                ? selectedFile.name.slice(selectedFile.name.lastIndexOf('.') + 1)
                : '';
            const resolvedTitle = fileName.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');
            const uploadFileName = originalExtension
                ? `${resolvedTitle}.${originalExtension}`
                : resolvedTitle;

            const response = await uploadFileToS3(selectedFile, {
                fileName: uploadFileName,
            });
            const currentUser = authService.getCurrentUser();

            if (!currentUser?.id) {
                throw new Error('User not authenticated');
            }

            const imageData = { ...response, user_id: currentUser.id, title: resolvedTitle };
            await projectService.saveCreatedFile(imageData);
            onUploadSuccess?.();
            handleClose();
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const createBlankPng = (): Promise<File> =>
        new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Failed to create blank canvas'));
                    return;
                }
                resolve(new File([blob], 'blank-canvas.png', { type: 'image/png' }));
            }, 'image/png');
        });

    const handleCreateBlank = async () => {
        setLoading(true);
        try {
            const resolvedTitle = fileName.trim() || 'Untitled';
            const file = await createBlankPng();
            const response = await uploadFileToS3(file, {
                fileName: `${resolvedTitle}.png`,
            });
            const currentUser = authService.getCurrentUser();

            if (!currentUser?.id) {
                throw new Error('User not authenticated');
            }

            const imageData = { ...response, user_id: currentUser.id, title: resolvedTitle };
            await projectService.saveCreatedFile(imageData);
            onUploadSuccess?.();
            handleClose();
        } catch (err) {
            console.error('Blank canvas creation failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ium-overlay" onClick={handleClose}>
            <div className="ium-card" onClick={(e) => e.stopPropagation()}>
                <div className="ium-header">
                    {mode !== 'choose' ? (
                        <button
                            type="button"
                            className="ium-back-btn"
                            onClick={() => {
                                setMode('choose');
                                setPreview(null);
                                setSelectedFile(null);
                                setFileName('');
                            }}
                            aria-label="Back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    ) : null}
                    <CustomText
                        variant={textVariant.h4}
                        text={
                            mode === 'choose'
                                ? 'Create Project'
                                : mode === 'blank'
                                    ? 'Start with a blank canvas'
                                    : 'Upload Image'
                        }
                    />
                    <CustomButton
                        variant={buttonVariants.icon}
                        icon={<X size={20} />}
                        onClick={handleClose}
                        className="ium-close-btn"
                    />
                </div>

                {mode === 'choose' && (
                    <div className="ium-content">
                        <div className="ium-choice-grid">
                            <button
                                type="button"
                                className="ium-choice-card"
                                onClick={() => setMode('upload')}
                            >
                                <ImagePlus className="ium-choice-icon" size={32} />
                                <CustomText variant={textVariant.h4} text="Upload an image" />
                                <CustomText
                                    variant={textVariant.p}
                                    text="Start from your own image"
                                />
                            </button>
                            <button
                                type="button"
                                className="ium-choice-card"
                                onClick={() => setMode('blank')}
                            >
                                <Sparkles className="ium-choice-icon" size={32} />
                                <CustomText variant={textVariant.h4} text="Blank canvas" />
                                <CustomText
                                    variant={textVariant.p}
                                    text="Start empty and generate with AI"
                                />
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'blank' && (
                    <div className="ium-content">
                        <div className="ium-name-field">
                            <label className="ium-name-label" htmlFor="ium-blank-name-input">
                                Project name
                            </label>
                            <input
                                id="ium-blank-name-input"
                                className="ium-name-input"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="Enter project name"
                            />
                        </div>
                        <div className="ium-description">
                            <CustomText
                                variant={textVariant.p}
                                text="A 1024x1024 blank canvas will be created. Use the AI Generate tool in the editor to add images."
                            />
                        </div>
                    </div>
                )}

                {mode === 'upload' && (
                <div className="ium-content">
                    {!preview ? (
                        <div
                            {...getRootProps()}
                            className={`ium-dropzone ${isDragActive ? 'ium-dropzone--active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="ium-upload-icon" size={40} />
                            <CustomText
                                variant={textVariant.h4}
                                text={isDragActive
                                    ? 'Drop the image here'
                                    : 'Drag & drop an image here'}
                            />
                            <CustomText
                                variant={textVariant.p}
                                text="or click to select a file"
                            />
                        </div>
                    ) : (
                        <div className="ium-preview">
                            <div className="ium-preview-wrapper">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="ium-preview-image"
                                />
                            </div>
                            <div className="ium-name-field">
                                <label className="ium-name-label" htmlFor="ium-name-input">
                                    Project name
                                </label>
                                <input
                                    id="ium-name-input"
                                    className="ium-name-input"
                                    type="text"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    placeholder="Enter project name"
                                />
                            </div>
                            <CustomButton
                                variant={buttonVariants.outline}
                                text="Choose a different image"
                                className="ium-change-btn"
                                onClick={() => {
                                    setPreview(null);
                                    setSelectedFile(null);
                                    setFileName('');
                                }}
                            />
                        </div>
                    )}

                    <div className="ium-description">
                        <CustomText
                            variant={textVariant.p}
                            text="Supports PNG, JPG, WEBP up to 5MB"
                        />
                    </div>
                </div>
                )}

                {mode !== 'choose' && (
                    <div className="ium-footer">
                        <CustomButton
                            variant={buttonVariants.outline}
                            text="Cancel"
                            onClick={handleClose}
                            className="ium-btn"
                        />
                        {mode === 'upload' ? (
                            <CustomButton
                                variant={buttonVariants.default}
                                text="Upload"
                                disabled={!selectedFile}
                                onClick={handleUpload}
                                className="ium-btn"
                            />
                        ) : (
                            <CustomButton
                                variant={buttonVariants.default}
                                text="Create"
                                onClick={handleCreateBlank}
                                className="ium-btn"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
