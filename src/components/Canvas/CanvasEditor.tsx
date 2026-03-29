import React, { useCallback, useEffect, useRef } from 'react'
import type { CanvasEditorProps } from '../../interface/canvas'
import { Canvas, FabricImage } from 'fabric';
import '../../styles/Canvas/Editor.css'
import { showInfoToast } from '../../utils/toast';
import { saveCanvasState } from '../../services/api/canvasService';
import { uploadFileToImageKit } from '../../services/api/imageKitService';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useCanvasContext } from '../../context/canvasContext';

declare global {
    interface Window {
        canvasUndo?: () => void;
        canvasRedo?: () => void;
    }
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ project }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas>(null!);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialLoadRef = useRef(true);
    const isRestoringRef = useRef(false);
    const { fabricCanvas, setFabricCanvas, setActiveTool } = useCanvasContext();

    const { addToHistory, handleUndo, handleRedo } = useCanvasHistory(fabricCanvasRef, isRestoringRef);

    const projectUrl = project?.project_url;
    const canvasState = project?.canvas_state;

    const dataUrlToFile = (dataUrl: string, filename: string): File => {
        const [header, base64Data] = dataUrl.split(',');
        const mimeMatch = header.match(/data:(.*?);base64/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }

        return new File([bytes], filename, { type: mimeType });
    };

    const getImageKitUploadTarget = (url: string): { fileName: string; folder?: string } | null => {
        try {
            const parsedUrl = new URL(url);
            let pathSegments = parsedUrl.pathname
                .split('/')
                .filter(Boolean)
                .map((segment) => decodeURIComponent(segment));

            // Remove ImageKit transformation segments if present in the URL path.
            while (pathSegments.length > 0 && pathSegments[0].startsWith('tr:')) {
                pathSegments = pathSegments.slice(1);
            }

            // For default ImageKit URL endpoints, first path segment is endpoint ID, not a media folder.
            if (parsedUrl.hostname.endsWith('imagekit.io') && pathSegments.length > 1) {
                pathSegments = pathSegments.slice(1);
            }

            if (pathSegments.length === 0) {
                return null;
            }

            const fileName = pathSegments[pathSegments.length - 1];
            const folderSegments = pathSegments.slice(0, -1);
            const folder = folderSegments.length > 0 ? `/${folderSegments.join('/')}` : undefined;

            return {
                fileName,
                folder,
            };
        } catch {
            return null;
        }
    };

    const getCanvasExportFormat = (fileName: string): 'png' | 'jpeg' => {
        const lowerName = fileName.toLowerCase();
        return lowerName.endsWith('.png') ? 'png' : 'jpeg';
    };


    /*
    Initial loading of canvas into the canvas wrapper
    */
    useEffect(() => {
        if (!canvasRef.current || !wrapperRef.current || fabricCanvasRef.current) return;
        const wrapperWidth = wrapperRef.current.offsetWidth;

        const wrapperHeight = wrapperRef.current.offsetHeight;
        fabricCanvasRef.current = new Canvas(canvasRef.current, {
            width: wrapperWidth,
            height: wrapperHeight,
            selection: true,
        })
        setFabricCanvas(fabricCanvasRef.current)
    }, [setFabricCanvas]);

    useEffect(() => {
        window.canvasUndo = handleUndo;
        window.canvasRedo = handleRedo;

        const handleKeyDown = (e: KeyboardEvent) => {
            const isMeta = e.metaKey || e.ctrlKey;
            if (isMeta && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((isMeta && e.key === 'z' && e.shiftKey) || (e.ctrlKey && e.key === 'y')) {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            delete window.canvasUndo;
            delete window.canvasRedo;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleUndo, handleRedo]);



    const loadImage = useCallback(async () => {
        if (!fabricCanvasRef.current || !projectUrl) return;
        isRestoringRef.current = true;
        try {
            const imgElement = await FabricImage.fromURL(projectUrl, { crossOrigin: 'anonymous' });
            const canvas = fabricCanvasRef.current;
            canvas!.clear();
            canvas!.add(imgElement);

            const maxWidth = canvas.width! * 0.9;
            const maxHeight = canvas.height! * 0.9;
            const imgWidth = imgElement.width!;
            const imgHeight = imgElement.height!;

            const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            imgElement.set({
                scaleX: scale,
                scaleY: scale,
                left: canvas.width! / 2,
                top: canvas.height! / 2,
                originX: 'center',
                originY: 'center',
                selectable: true,
                evented: true,
            });

            canvas!.requestRenderAll();
            console.log('Image loaded and rendered successfully');
        } catch (error) {
            console.error('Failed to load image:', error);
        }
        finally {
            isRestoringRef.current = false;
            addToHistory();
        }
    }, [addToHistory, projectUrl]);

    // Load canvas state when project loads
    useEffect(() => {
        if (!fabricCanvasRef.current || !project?.id || !isInitialLoadRef.current) return;

        isInitialLoadRef.current = false;
        isRestoringRef.current = true;

        const loadSavedState = async () => {
            try {
                if (canvasState) {
                    const canvas = fabricCanvasRef.current!;
                    canvas.clear();

                    const savedCanvasState = canvasState as Canvas & {
                        canvasWidth?: number;
                        canvasHeight?: number;
                    };

                    const savedWidth = savedCanvasState.canvasWidth;
                    const savedHeight = savedCanvasState.canvasHeight;
                    if (savedWidth && savedHeight) {
                        const wrapper = wrapperRef.current;
                        const PADDING = 40;
                        const availW = wrapper ? wrapper.clientWidth - PADDING : savedWidth;
                        const availH = wrapper ? wrapper.clientHeight - PADDING : savedHeight;
                        const viewportScale = Math.min(availW / savedWidth, availH / savedHeight, 1);

                        canvas.setDimensions({ width: savedWidth, height: savedHeight });
                        canvas.setDimensions(
                            { width: savedWidth * viewportScale, height: savedHeight * viewportScale },
                            { cssOnly: true }
                        );
                        canvas.setZoom(viewportScale);
                    }

                    await canvas.loadFromJSON(canvasState);
                    canvas.calcOffset();
                    canvas.requestRenderAll();
                    isRestoringRef.current = false;
                    addToHistory();
                }
                else {
                    console.log('No saved state found, loading image instead');
                    await loadImage();
                    isRestoringRef.current = false;
                }
            } catch (error) {
                console.error('Failed to load canvas state, loading image instead:', error);
                await loadImage();
            }
        };

        loadSavedState();
    }, [project?.id, canvasState, loadImage, addToHistory]);

    // // Auto-save canvas state on changes
    useEffect(() => {
        if (!fabricCanvasRef.current || !project?.id) return;

        const debouncedSave = async () => {
            if (isInitialLoadRef.current) return;
            if (isRestoringRef.current) return;

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(async () => {
                console.log('Saving canvas state to DB...');
                try {
                    const canvas = fabricCanvasRef.current!;
                    const canvasJSON = canvas.toJSON();
                    canvasJSON.canvasWidth = canvas.width;
                    canvasJSON.canvasHeight = canvas.height;

                    let latestThumbnailUrl: string | undefined;
                    let latestProjectUrl: string | undefined;

                    try {
                        const uploadTarget = getImageKitUploadTarget(project.project_url);

                        if (!uploadTarget) {
                            throw new Error('Unable to parse project_url for ImageKit overwrite upload target');
                        }

                        const exportFormat = getCanvasExportFormat(uploadTarget.fileName);
                        const thumbnailDataUrl = canvas.toDataURL({
                            format: exportFormat,
                            quality: exportFormat === 'jpeg' ? 0.9 : undefined,
                            multiplier: 1,
                            enableRetinaScaling: true,
                        });

                        const uploadedCanvasFile = dataUrlToFile(thumbnailDataUrl, uploadTarget.fileName);

                        const uploadedThumbnail = await uploadFileToImageKit(uploadedCanvasFile, {
                            fileName: uploadTarget.fileName,
                            folder: uploadTarget.folder,
                            useUniqueFileName: false,
                            overwriteFile: true,
                        });

                        latestThumbnailUrl = uploadedThumbnail.thumbnail_url;
                        latestProjectUrl = uploadedThumbnail.project_url;
                    } catch (thumbnailError) {
                        // Canvas JSON save should still proceed if thumbnail refresh fails.
                        console.warn('Thumbnail upload during autosave failed:', thumbnailError);
                    }

                    await saveCanvasState(project.id, canvasJSON, {
                        thumbnail_url: latestThumbnailUrl,
                        project_url: latestProjectUrl,
                    });
                    showInfoToast("Auto saved")
                } catch (error) {
                    showInfoToast("Failed to auto save");
                    console.error('Failed to save canvas:', error);
                }
            }, 5000);
        };

        const handleCanvasChange = () => {

            addToHistory(); // Add to history immediately
            debouncedSave(); // Debounce DB save
        };

        fabricCanvasRef.current.on('object:added', handleCanvasChange);
        fabricCanvasRef.current.on('object:modified', handleCanvasChange);
        fabricCanvasRef.current.on('object:removed', handleCanvasChange);
        fabricCanvasRef.current.on('path:created', handleCanvasChange);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.off('object:added', handleCanvasChange);
                fabricCanvasRef.current.off('object:modified', handleCanvasChange);
                fabricCanvasRef.current.off('object:removed', handleCanvasChange);
                fabricCanvasRef.current.off('path:created', handleCanvasChange);
            }
        };
    }, [project?.id, project?.project_url, addToHistory]);


    useEffect(() => {
        if (!fabricCanvas) return

        const handleSelection = (event: unknown) => {
            const selectedObject = (event as { selected?: Array<{ type?: string }> }).selected?.[0];

            if (selectedObject && selectedObject.type === "i-text") {
                setActiveTool("text")
            }
        }
        fabricCanvas.on("selection:created", handleSelection);
        fabricCanvas.on("selection:updated", handleSelection)
        return () => {
            fabricCanvas.off("selection:created", handleSelection);
            fabricCanvas.off("selection:updated", handleSelection)
        }
    }, [fabricCanvas, setActiveTool])

    return (
        <div className='canvas-wrapper' ref={wrapperRef}>
            <canvas ref={canvasRef} className='canvas' />
        </div>
    );
};

export default CanvasEditor;