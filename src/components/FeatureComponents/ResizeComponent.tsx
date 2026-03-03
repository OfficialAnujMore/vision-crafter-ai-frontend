import React, { useEffect, useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import type { CanvasEditorProps } from '../../interface/canvas';
import CustomText from '../CustomComponents/CustomText';
import CustomButton from '../CustomComponents/CustomButton';
import { Lock, LockOpen, Scaling } from 'lucide-react';
import CustomInput from '../CustomComponents/CustomInput';
import Divider from '../Divider';
import { buttonVariants } from '../../constants/buttonVariants';
import '../../styles/ResizeComponent.css';


const ASPECT_RATIOS: Array<{ name: string; ratio: [number, number]; label: string }> = [
  { name: "Instagram Story", ratio: [9, 16], label: "9:16" },
  { name: "Instagram Post", ratio: [1, 1], label: "1:1" },
  { name: "Youtube Thumbnail", ratio: [16, 9], label: "16:9" },
  { name: "Portrait", ratio: [2, 3], label: "2:3" },
  { name: "Facebook Cover", ratio: [851, 315], label: "2.7:1" },
  { name: "Twitter Header", ratio: [3, 1], label: "3:1" },
];

const ResizeComponent: React.FC<CanvasEditorProps> = ({ project }) => {

  const { fabricCanvas } = useCanvasContext();
  const [newWidth, setNewWidth] = useState(project?.width || 800);
  const [newHeight, setNewHeight] = useState(project?.height || 600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"))
    }, 500)
  }, [fabricCanvas])

  if (!fabricCanvas || !project) {
    return (
      <div className='resize-empty'>
        <Scaling size={40} className="resize-empty-icon" />
        <CustomText variant="p" text="Loading canvas..." />
      </div>
    )
  }

  const calculateAspectRatioDimensions = (ratio: [number, number]) => {
    if (!project) return { width: 800, height: 600 };

    const [ratioW, ratioH] = ratio;
    const originalArea = project.width * project.height;

    const aspectRatio = ratioW / ratioH;
    const newHeight = Math.sqrt(originalArea / aspectRatio);
    const newWidth = newHeight * aspectRatio;

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  };

  const applyAspectRatio = (aspectRatio: { name: string; ratio: [number, number]; label: string }) => {
    const dimensions = calculateAspectRatioDimensions(aspectRatio.ratio);
    setNewWidth(dimensions.width);
    setNewHeight(dimensions.height);
    setActivePreset(aspectRatio.name);
  };

  const handleWidthChange = (value: string | number) => {
    const width = parseInt(String(value)) || 0;
    setNewWidth(width);
    setActivePreset(null);

    if (lockAspectRatio && project) {
      const ratio = project.height / project.width;
      setNewHeight(Math.round(width * ratio));
    }
  };

  const handleHeightChange = (value: string | number) => {
    const height = parseInt(String(value)) || 0;
    setNewHeight(height);
    setActivePreset(null);

    if (lockAspectRatio && project) {
      const ratio = project.width / project.height;
      setNewWidth(Math.round(height * ratio));
    }
  };

  const getAvailableViewport = () => {
    const canvasEl = fabricCanvas.getElement();
    const wrapper = canvasEl.closest('.canvas-wrapper') as HTMLElement;
    if (!wrapper) return { width: 800, height: 600 };

    const PADDING = 40;

    return {
      width: wrapper.clientWidth - PADDING,
      height: wrapper.clientHeight - PADDING,
    };
  };

  const calculateViewportScale = (targetWidth: number, targetHeight: number) => {
    const available = getAvailableViewport();
    if (available.width <= 0 || available.height <= 0) return 1;

    const scaleX = available.width / targetWidth;
    const scaleY = available.height / targetHeight;
    return Math.min(scaleX, scaleY, 1);
  };

  const handleApplyResize = async () => {
    if (
      !fabricCanvas ||
      !project ||
      (newWidth === project.width && newHeight === project.height)
    ) {
      return;
    }

    try {
      fabricCanvas.setDimensions({ width: newWidth, height: newHeight });

      fabricCanvas.getObjects().forEach((obj) => {
        const naturalW = obj.width || 1;
        const naturalH = obj.height || 1;

        const fitScale = Math.min(
          (newWidth * 0.9) / naturalW,
          (newHeight * 0.9) / naturalH
        );

        obj.set({
          left: newWidth / 2,
          top: newHeight / 2,
          originX: 'center',
          originY: 'center',
          scaleX: fitScale,
          scaleY: fitScale,
        });
        obj.setCoords();
      });

      const viewportScale = calculateViewportScale(newWidth, newHeight);

      fabricCanvas.setDimensions(
        {
          width: newWidth * viewportScale,
          height: newHeight * viewportScale,
        },
        { cssOnly: true }
      );

      fabricCanvas.setZoom(viewportScale);
      fabricCanvas.calcOffset();
      fabricCanvas.requestRenderAll();

      fabricCanvas.fire('object:modified');
    } catch (error) {
      console.error("Error resizing canvas:", error);
      alert("Failed to resize canvas. Please try again.");
    }
  };

  const hasChanges = newWidth !== project.width || newHeight !== project.height;

  return (
    <div className='resize-container'>
      <div className="resize-header">
        <CustomText variant='h4' text="Resize Image" />
        <CustomText variant='p' text="Change dimensions or pick a preset" fontSize="0.85rem" />
      </div>

      <Divider />

      <div className="resize-current">
        <CustomText variant='p' text="Current size" fontSize="0.8rem" />
        <span className="resize-current-value">{project.width} × {project.height} px</span>
      </div>

      <div className="resize-dimensions">
        <div className="resize-dimension-field">
          <CustomInput
            label='Width'
            type='number'
            maxLength={5000}
            value={newWidth.toString()}
            onChange={(value) => handleWidthChange(value)}
          />
        </div>

        <button
          type="button"
          className={`resize-lock-toggle ${lockAspectRatio ? 'resize-lock-toggle--locked' : ''}`}
          onClick={() => setLockAspectRatio(!lockAspectRatio)}
          aria-label={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        >
          {lockAspectRatio ? <Lock size={16} /> : <LockOpen size={16} />}
        </button>

        <div className="resize-dimension-field">
          <CustomInput
            label='Height'
            type='number'
            maxLength={5000}
            value={newHeight.toString()}
            onChange={(value) => handleHeightChange(value)}
          />
        </div>
      </div>

      <div className="resize-lock-status">
        {lockAspectRatio ? <Lock size={12} /> : <LockOpen size={12} />}
        <span>{lockAspectRatio ? 'Aspect ratio locked' : 'Free size'}</span>
      </div>

      <Divider label="Presets" />

      <div className="resize-presets">
        {ASPECT_RATIOS.map((aspectRatio) => {
          const dimensions = calculateAspectRatioDimensions(aspectRatio.ratio);
          const isActive = activePreset === aspectRatio.name;
          const [rW, rH] = aspectRatio.ratio;
          const maxDim = 28;
          const scale = maxDim / Math.max(rW, rH);
          const previewW = Math.round(rW * scale);
          const previewH = Math.round(rH * scale);

          return (
            <button
              key={aspectRatio.name}
              type="button"
              className={`resize-preset-card ${isActive ? 'resize-preset-card--active' : ''}`}
              onClick={() => applyAspectRatio(aspectRatio)}
            >
              <div
                className="resize-preset-preview"
                style={{ width: previewW, height: previewH }}
              />
              <div className="resize-preset-info">
                <span className="resize-preset-name">{aspectRatio.name}</span>
                <span className="resize-preset-dims">{aspectRatio.label} &middot; {dimensions.width}×{dimensions.height}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="resize-apply">
        <CustomButton
          variant={hasChanges ? buttonVariants.default : buttonVariants.outline}
          disabled={!hasChanges}
          text={'Apply Resize'}
          onClick={handleApplyResize}
        />
      </div>
    </div>
  )
}

export default ResizeComponent
