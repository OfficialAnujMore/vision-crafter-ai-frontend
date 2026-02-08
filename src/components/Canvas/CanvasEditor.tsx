import React, { useEffect, useRef } from 'react'
import type { CanvasEditorProps } from '../../interface/canvas'
import { Canvas, FabricImage } from 'fabric';
import '../../styles/Editor.css'



const CanvasEditor: React.FC<CanvasEditorProps> = ({ projectUrl, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const loadImage = async () => {
        if (!fabricCanvasRef.current || !projectUrl) return;

        try {
            const imgElement = await FabricImage.fromURL(projectUrl, {
                crossOrigin: 'anonymous',
            });
            fabricCanvasRef.current.clear();
            fabricCanvasRef.current.add(imgElement);

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
            canvas.renderAll();
        } catch (error) {
            console.error('Failed to load image:', error);
        }

    }

    useEffect(() => {
        if (!canvasRef.current || !wrapperRef.current) return;

        const wrapperWidth = wrapperRef.current.offsetWidth;

        const wrapperHeight = wrapperRef.current.offsetHeight;

        fabricCanvasRef.current = new Canvas(canvasRef.current, {
            width: wrapperWidth,
            height: wrapperHeight,
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
        <div className='canvas-wrapper' ref={wrapperRef}>

            <canvas

                ref={canvasRef}
                className='canvas'
            />
        </div>
    )
}

export default CanvasEditor