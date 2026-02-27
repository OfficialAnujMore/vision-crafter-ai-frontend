import React, { useEffect, useRef } from 'react'
import type { CanvasEditorProps } from '../../interface/canvas'
import { Canvas, FabricImage } from 'fabric';
import '../../styles/Canvas/Editor.css'
import { showInfoToast } from '../../utils/toast';
import { saveCanvasState } from '../../services/api/canvasService';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useCanvasContext } from '../../context/canvasContext';
import { useLoader } from '../LoaderContext';

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
    const { setLoading } = useLoader();

    const { addToHistory, handleUndo, handleRedo } = useCanvasHistory(fabricCanvasRef, isRestoringRef);

    const projectUrl = project?.project_url;
    const canvasState = project?.canvas_state;


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

        return () => {
            delete window.canvasUndo;
            delete window.canvasRedo;
        };
    }, [handleUndo, handleRedo]);



    const loadImage = async () => {
        if (!fabricCanvasRef.current || !projectUrl) return;
        isRestoringRef.current = true;
        try {
            const imgElement = await FabricImage.fromURL(projectUrl, { crossOrigin: 'anonymous' });
            const canvas = fabricCanvasRef.current;
            canvas!.clear();
            canvas!.add(imgElement);

            const SIDEBAR_INSET = 352;
            const TOP_INSET = 80;
            const BOTTOM_INSET = 94;
            const RIGHT_INSET = 16;

            const visibleWidth = canvas.width! - SIDEBAR_INSET - RIGHT_INSET;
            const visibleHeight = canvas.height! - TOP_INSET - BOTTOM_INSET;
            const visibleCenterX = SIDEBAR_INSET + visibleWidth / 2;
            const visibleCenterY = TOP_INSET + visibleHeight / 2;

            const maxWidth = visibleWidth * 0.9;
            const maxHeight = visibleHeight * 0.9;
            const imgWidth = imgElement.width!;
            const imgHeight = imgElement.height!;

            const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            imgElement.set({
                scaleX: scale,
                scaleY: scale,
                left: visibleCenterX,
                top: visibleCenterY,
                originX: 'center',
                originY: 'center',
                selectable: true,
                evented: true,
            });

            // Ensure render happens after all properties are set
            canvas!.requestRenderAll();
            console.log('Image loaded and rendered successfully');
        } catch (error) {
            console.error('Failed to load image:', error);
        }
        finally {
            isRestoringRef.current = false;
        }
    };

    // Load canvas state when project loads
    useEffect(() => {
        if (!fabricCanvasRef.current || !project?.id || !isInitialLoadRef.current) return;

        isInitialLoadRef.current = false;
        isRestoringRef.current = true;

        const loadSavedState = async () => {
            try {
                if (canvasState) {
                    console.log('Canvas state found, rendering...');
                    fabricCanvasRef.current!.clear();
                    fabricCanvasRef.current!.loadFromJSON(canvasState, () => {
                        fabricCanvasRef.current!.requestRenderAll();
                        isRestoringRef.current = false;
                    });
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
    }, [project?.id]);

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
                    const canvasJSON = fabricCanvasRef.current!.toJSON();
                    await saveCanvasState(project.id, canvasJSON);
                    showInfoToast("Auto saved")
                } catch (error) {
                    showInfoToast("Failed to auto save");
                    console.error('Failed to save canvas:', error);
                }
            }, 5000);
        };

        const handleCanvasChange = () => {

            // addToHistory(); // Add to history immediately
            // debouncedSave(); // Debounce DB save
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
    }, [project?.id, addToHistory]);


    useEffect(() => {
        if (!fabricCanvas) return

        const handleSelection = (e) => {
            const selectedObject = e.selected?.[0];

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