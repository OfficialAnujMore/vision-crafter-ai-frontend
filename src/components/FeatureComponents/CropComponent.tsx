import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Crop,
  CheckCheck,
  X,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Maximize,
} from 'lucide-react';
import { useCanvasContext } from '../../context/canvasContext';
import { FabricImage, Rect, type FabricObject } from 'fabric';
import type { CanvasEditorProps } from '../../interface/canvas';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import Divider from '../Divider';
import { buttonVariants } from '../../constants/buttonVariants';
import { textColor } from '../../constants/textVariants';
import '../../styles/FeatureComponents/CropComponent.css';

interface AspectRatio {
  label: string;
  value: number | null;
  icon: React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
  ratio?: string;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { label: 'Freeform', value: null, icon: Maximize },
  { label: 'Square', value: 1, icon: Square, ratio: '1:1' },
  { label: 'Widescreen', value: 16 / 9, icon: RectangleHorizontal, ratio: '16:9' },
  { label: 'Portrait', value: 4 / 5, icon: RectangleVertical, ratio: '4:5' },
  { label: 'Story', value: 9 / 16, icon: Smartphone, ratio: '9:16' },
];

const CROP_RECT_NAME = 'cropRect';

const CropComponent: React.FC<CanvasEditorProps> = () => {
  const { fabricCanvas, activeTool } = useCanvasContext();

  const [isCropMode, setIsCropMode] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);

  const selectedImageRef = useRef<FabricImage | null>(null);
  const cropRectRef = useRef<Rect | null>(null);
  const originalPropsRef = useRef<Record<string, unknown> | null>(null);

  const getActiveImage = useCallback((): FabricImage | null => {
    if (!fabricCanvas) return null;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
      return activeObject as FabricImage;
    }

    const objects = fabricCanvas.getObjects();
    return (objects.find((obj) => obj.type === 'image') as FabricImage) || null;
  }, [fabricCanvas]);

  const removeCropRectangles = useCallback(() => {
    if (!fabricCanvas) return;

    const rects = fabricCanvas.getObjects().filter(
      (obj) => obj.type === 'rect' && (obj as FabricObject & { name?: string }).name === CROP_RECT_NAME
    );

    rects.forEach((rect) => fabricCanvas.remove(rect));
    fabricCanvas.requestRenderAll();
  }, [fabricCanvas]);

  const createCropRectangle = useCallback(
    (image: FabricImage, ratio: number | null) => {
      if (!fabricCanvas) return;

      const coords = image.getCoords();
      const imgLeft = coords[0].x;
      const imgTop = coords[0].y;
      const imgWidth = coords[2].x - coords[0].x;
      const imgHeight = coords[2].y - coords[0].y;

      let rectWidth = imgWidth * 0.8;
      let rectHeight = imgHeight * 0.8;

      if (ratio !== null) {
        const maxWidth = imgWidth * 0.8;
        const maxHeight = imgHeight * 0.8;

        if (maxWidth / ratio <= maxHeight) {
          rectWidth = maxWidth;
          rectHeight = maxWidth / ratio;
        } else {
          rectHeight = maxHeight;
          rectWidth = maxHeight * ratio;
        }
      }

      const cropRectangle = new Rect({
        left: imgLeft + (imgWidth - rectWidth) / 2,
        top: imgTop + (imgHeight - rectHeight) / 2,
        width: rectWidth,
        height: rectHeight,
        fill: 'rgba(0, 188, 212, 0.08)',
        stroke: '#00bcd4',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: true,
        evented: true,
        cornerColor: '#00bcd4',
        cornerSize: 10,
        transparentCorners: false,
        cornerStyle: 'circle',
        borderColor: '#00bcd4',
        borderScaleFactor: 1,
        lockRotation: true,
        hasRotatingPoint: false,
      });

      (cropRectangle as Rect & { name: string }).name = CROP_RECT_NAME;
      cropRectangle.on('scaling', () => {
        const rect = cropRectangle;

        if (ratio !== null) {
          const currentWidth = (rect.width ?? 0) * (rect.scaleX ?? 1);
          const newHeight = currentWidth / ratio;
          rect.set({ scaleY: newHeight / (rect.height ?? 1) });
        }

        // Clamp to image bounds
        const rLeft = rect.left ?? 0;
        const rTop = rect.top ?? 0;
        const rWidth = (rect.width ?? 0) * (rect.scaleX ?? 1);
        const rHeight = (rect.height ?? 0) * (rect.scaleY ?? 1);

        if (rLeft + rWidth > imgLeft + imgWidth) {
          const maxWidth = imgLeft + imgWidth - rLeft;
          rect.set({ scaleX: maxWidth / (rect.width ?? 1) });
          if (ratio !== null) {
            const adjustedWidth = maxWidth;
            rect.set({ scaleY: (adjustedWidth / ratio) / (rect.height ?? 1) });
          }
        }
        if (rTop + rHeight > imgTop + imgHeight) {
          const maxHeight = imgTop + imgHeight - rTop;
          rect.set({ scaleY: maxHeight / (rect.height ?? 1) });
          if (ratio !== null) {
            const adjustedHeight = maxHeight;
            rect.set({ scaleX: (adjustedHeight * ratio) / (rect.width ?? 1) });
          }
        }

        fabricCanvas.requestRenderAll();
      });

      fabricCanvas.add(cropRectangle);
      fabricCanvas.setActiveObject(cropRectangle);
      cropRectRef.current = cropRectangle;
    },
    [fabricCanvas]
  );

  const initializeCropMode = useCallback(
    (image: FabricImage) => {
      if (!fabricCanvas || isCropMode) return;

      removeCropRectangles();

      originalPropsRef.current = {
        left: image.left,
        top: image.top,
        width: image.width,
        height: image.height,
        scaleX: image.scaleX,
        scaleY: image.scaleY,
        angle: image.angle ?? 0,
        selectable: image.selectable,
        evented: image.evented,
      };

      selectedImageRef.current = image;

      image.set({ selectable: false, evented: false });

      createCropRectangle(image, selectedRatio);
      setIsCropMode(true);

      fabricCanvas.requestRenderAll();
    },
    [fabricCanvas, isCropMode, removeCropRectangles, createCropRectangle, selectedRatio]
  );

  const exitCropMode = useCallback(() => {
    removeCropRectangles();
    cropRectRef.current = null;

    const image = selectedImageRef.current;
    const original = originalPropsRef.current;

    if (image && original) {
      image.set({
        selectable: original.selectable as boolean,
        evented: original.evented as boolean,
        left: original.left as number,
        top: original.top as number,
        scaleX: original.scaleX as number,
        scaleY: original.scaleY as number,
        angle: original.angle as number,
      });
      fabricCanvas?.setActiveObject(image);
    }

    selectedImageRef.current = null;
    originalPropsRef.current = null;
    setIsCropMode(false);
    setSelectedRatio(null);

    fabricCanvas?.requestRenderAll();
  }, [fabricCanvas, removeCropRectangles]);

  const applyCrop = useCallback(() => {
    const image = selectedImageRef.current;
    const cropRect = cropRectRef.current;

    if (!fabricCanvas || !image || !cropRect) return;

    try {
      const cropCoords = cropRect.getCoords();
      const cropLeft = cropCoords[0].x;
      const cropTop = cropCoords[0].y;
      const cropW = cropCoords[2].x - cropCoords[0].x;
      const cropH = cropCoords[2].y - cropCoords[0].y;

      const imgCoords = image.getCoords();
      const imgLeft = imgCoords[0].x;
      const imgTop = imgCoords[0].y;
      const imgW = imgCoords[2].x - imgCoords[0].x;
      const imgH = imgCoords[2].y - imgCoords[0].y;

      const relX = Math.max(0, cropLeft - imgLeft);
      const relY = Math.max(0, cropTop - imgTop);
      const relW = Math.min(cropW, imgW - relX);
      const relH = Math.min(cropH, imgH - relY);

      const imageScaleX = image.scaleX ?? 1;
      const imageScaleY = image.scaleY ?? 1;

      const newCropX = relX / imageScaleX;
      const newCropY = relY / imageScaleY;
      const newWidth = relW / imageScaleX;
      const newHeight = relH / imageScaleY;

      const existingCropX = image.cropX ?? 0;
      const existingCropY = image.cropY ?? 0;

      const newLeft = cropLeft + cropW / 2;
      const newTop = cropTop + cropH / 2;

      const imageElement = image.getElement() as HTMLImageElement;
      const croppedImage = new FabricImage(
        imageElement,
        {
          left: newLeft,
          top: newTop,
          originX: 'center',
          originY: 'center',
          cropX: existingCropX + newCropX,
          cropY: existingCropY + newCropY,
          width: newWidth,
          height: newHeight,
          scaleX: imageScaleX,
          scaleY: imageScaleY,
          selectable: true,
          evented: true,
        }
      );

      removeCropRectangles();
      fabricCanvas.remove(image);
      fabricCanvas.add(croppedImage);
      fabricCanvas.setActiveObject(croppedImage);

      cropRectRef.current = null;
      selectedImageRef.current = null;
      originalPropsRef.current = null;
      setIsCropMode(false);
      setSelectedRatio(null);

      fabricCanvas.requestRenderAll();
    } catch (error) {
      console.error('Error applying crop:', error);
      exitCropMode();
    }
  }, [fabricCanvas, removeCropRectangles, exitCropMode]);

  const applyAspectRatio = useCallback(
    (ratio: number | null) => {
      setSelectedRatio(ratio);

      const image = selectedImageRef.current;
      if (!fabricCanvas || !image) return;

      removeCropRectangles();
      createCropRectangle(image, ratio);
      fabricCanvas.requestRenderAll();
    },
    [fabricCanvas, removeCropRectangles, createCropRectangle]
  );

  useEffect(() => {
    if (activeTool !== 'crop' && isCropMode) {
      exitCropMode();
    }
  }, [activeTool, isCropMode, exitCropMode]);

  useEffect(() => {
    return () => {
      removeCropRectangles();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!fabricCanvas) {
    return (
      <div className="crop-panel">
        <CustomText variant="p" text="Canvas not ready" color={textColor.white} />
      </div>
    );
  }

  const activeImage = getActiveImage();

  if (!activeImage && !isCropMode) {
    return (
      <div className="crop-panel">
        <CustomText variant="p" text="Select an image to crop" color={textColor.white} />
      </div>
    );
  }

  return (
    <div className="crop-panel">
      <CustomText variant="h3" text="Crop" />

      <Divider spacing="sm" />

      {isCropMode && (
        <div className="crop-status">
          <CustomText
            variant="p"
            text="Adjust the blue rectangle to set crop area"
            color={textColor.white}
            fontSize="0.8rem"
          />
        </div>
      )}

      {!isCropMode && activeImage && (
        <CustomButton
          variant={buttonVariants.default}
          icon={<Crop size={16} />}
          text="Start Cropping"
          onClick={() => initializeCropMode(activeImage)}
          className="crop-start-btn"
        />
      )}

      {isCropMode && (
        <>
          <CustomText variant="p" text="Aspect Ratio" fontSize="0.85rem" />
          <div className="crop-ratio-grid">
            {ASPECT_RATIOS.map((ratio) => {
              const IconComponent = ratio.icon;
              const isActive = selectedRatio === ratio.value;
              return (
                <button
                  key={ratio.label}
                  type="button"
                  onClick={() => applyAspectRatio(ratio.value)}
                  className={`crop-ratio-btn ${isActive ? 'crop-ratio-btn--active' : ''}`}
                >
                  <IconComponent size={20} />
                  <span className="crop-ratio-label">{ratio.label}</span>
                  {ratio.ratio && (
                    <span className="crop-ratio-value">{ratio.ratio}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isCropMode && (
        <>
          <Divider spacing="sm" />
          <div className="crop-actions">
            <CustomButton
              variant={buttonVariants.default}
              icon={<CheckCheck size={16} />}
              text="Apply Crop"
              onClick={applyCrop}
            />
            <CustomButton
              variant={buttonVariants.outline}
              icon={<X size={16} />}
              text="Cancel"
              onClick={exitCropMode}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CropComponent;
