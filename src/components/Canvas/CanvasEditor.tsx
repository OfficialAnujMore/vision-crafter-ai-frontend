import React, { useEffect, useRef } from 'react'
import type { CanvasEditorProps } from '../../interface/canvas'
import { Canvas, FabricImage } from 'fabric';
import '../../styles/CanvasEditor.css'



const CanvasEditor: React.FC<CanvasEditorProps> = ({ projectUrl, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);

    const loadImage = async () => {
        if (!fabricCanvasRef.current || !projectUrl) return;

        try {
            // Create a Fabric image from the URL
            const imgElement = await FabricImage.fromURL(projectUrl, {
                crossOrigin: 'anonymous',
            });

            // Clear any existing objects on canvas
            fabricCanvasRef.current.clear();

            // Add the image to the canvas
            fabricCanvasRef.current.add(imgElement);

            // Scale image to fit canvas while maintaining aspect ratio
            const canvas = fabricCanvasRef.current;
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

            // Render the canvas
            canvas.renderAll();
        } catch (error) {
            console.error('Failed to load image:', error);
        }
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        fabricCanvasRef.current = new Canvas(canvasRef.current, {
            width: width,
            height: height,
            selection: true,
        })

        return () => {
            fabricCanvasRef.current?.dispose();
        }
    }, [width, height])

    useEffect(() => {
        loadImage();
    }, [projectUrl])
    return (
        <div className='canvas-container'>

            <canvas
                ref={canvasRef}
                style={{
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                }}
            />
        </div>
    )
}

export default CanvasEditor