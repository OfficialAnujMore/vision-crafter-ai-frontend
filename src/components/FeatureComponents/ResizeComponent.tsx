import React, { useEffect, useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import type { CanvasEditorProps } from '../../interface/canvas';
import CustomText from '../CustomComponents/CustomText';
import CustomButton from '../CustomComponents/CustomButton';
import { Lock, LockOpen } from 'lucide-react';
import CustomInput from '../CustomComponents/CustomInput';
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



    useEffect(()=>{
      
      setTimeout(()=>{
        console.log("Resize called");
        window.dispatchEvent(new Event("resize"))
      }, 500)
    }, [fabricCanvas])

  if (!fabricCanvas || !project) {
    return (
      <div className='resize-loading'>Loading canvas</div>
    )
  }




  // Calculate dimensions for aspect ratio based on original canvas size
  const calculateAspectRatioDimensions = (ratio: [number, number]) => {
    if (!project) return { width: 800, height: 600 };

    const [ratioW, ratioH] = ratio;
    const originalArea = project.width * project.height;

    // Calculate new dimensions maintaining the same area approximately
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
  };
  // Handle width change with aspect ratio lock
  const handleWidthChange = (value: string | number) => {
    const width = parseInt(String(value)) || 0;
    setNewWidth(width);

    if (lockAspectRatio && project) {
      const ratio = project.height / project.width;
      setNewHeight(Math.round(width * ratio));
    }
  };

  // Handle height change with aspect ratio lock
  const handleHeightChange = (value: string | number) => {
    const height = parseInt(String(value)) || 0;
    setNewHeight(height);

    if (lockAspectRatio && project) {
      const ratio = project.width / project.height;
      setNewWidth(Math.round(height * ratio));
    }
  };



  // Calculate viewport scale to fit canvas in container
  const calculateViewportScale = () => {
    const container = fabricCanvas.getElement().parentNode as HTMLElement;
    if (!container) return 1;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / newWidth;
    const scaleY = containerHeight / newHeight;
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

    // setProcessingMessage("Resizing canvas...");

    try {

      fabricCanvas.setDimensions({ width: newWidth, height: newHeight })

      // Calculate and apply viewport scale
      const viewportScale = calculateViewportScale();

      fabricCanvas.setDimensions(
        {
          width: newWidth * viewportScale,
          height: newHeight * viewportScale,
        },
        { backstoreOnly: false }
      );

      fabricCanvas.setZoom(viewportScale);
      fabricCanvas.calcOffset();
      fabricCanvas.requestRenderAll();
    } catch (error) {
      console.error("Error resizing canvas:", error);
      alert("Failed to resize canvas. Please try again.");
    } finally {
      // setProcessingMessage(null);
    }
  };

  const hasChanges = newWidth !== project.width || newHeight !== project.height;
  return (
    <div className='resize-component'>
      <div className="resize-section-one">
        <CustomText
          text={"Current size"}
          variant='p'
        />
        <div className="resize-current-size">{project.width} × {project.height} px</div>
      </div>

      <div className="resize-section-two">
        <CustomText
          text={"Custom size"}
          variant='p'
        />
        <div className="resize-lock-button">
          <CustomButton
            icon={lockAspectRatio ? <Lock size={20} /> : <LockOpen size={20} />}
            variant='icon'
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
          />
        </div>
      </div>
      <div className="resize-input-section">
        <div>
          <CustomInput
            label='Width'
            type='number'
            maxLength={5000}
            value={newWidth.toString()}
            onChange={(value) => handleWidthChange(value)}
          />
        </div>
        <div>
          <CustomInput
            label='Height'
            type='number'
            maxLength={5000}
            value={newHeight.toString()}
            onChange={(value) => handleHeightChange(value)}
          />
        </div>
        <div className="resize-aspect-status">
          {lockAspectRatio ? '🔒 Aspect ratio locked' : '🔓 Free size'}
        </div>
      </div>

      <div className="resize-aspect-ratios">
        {ASPECT_RATIOS.map((aspectRatio) => {
          const dimensions = calculateAspectRatioDimensions(aspectRatio.ratio)
          return (
            <div key={aspectRatio.name} className="resize-aspect-button-wrapper">
              <CustomButton
                text={`${aspectRatio.name} (${aspectRatio.label}) ${dimensions.width}×${dimensions.height}`}
                variant='outline'
                onClick={() => applyAspectRatio(aspectRatio)}
              />
            </div>
          )
        })}
      </div>

      <div className="resize-apply-section">
        <CustomButton
          variant='outline'
          disabled={!hasChanges}
          text={'Apply Resize'}
          onClick={handleApplyResize}
        />
      </div>
    </div>
  )
}

export default ResizeComponent