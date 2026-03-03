import React, { useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import { Trash2, Loader2, CheckCircle2, XCircle, Sparkles, Wand2, Image, ArrowRight } from 'lucide-react';
import { FabricImage } from 'fabric';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { buttonVariants } from '../../constants/buttonVariants';
import '../../styles/FeatureComponents/BackgroundRemover.css';

const BackgroundRemover = ({ project }) => {

  const { fabricCanvas } = useCanvasContext();
  const [isRemoving, setIsRemoving] = useState(false);
  const [removalStatus, setRemovalStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getMainImage = () => {
    if (!fabricCanvas) return null;
    const objects = fabricCanvas.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };

  const handleBackgroundRemoval = async () => {
    const mainImage = getMainImage();
    if (!mainImage || !project || !fabricCanvas) return;

    setIsRemoving(true);
    setRemovalStatus('idle');

    try {
      const currentImageUrl = project.project_url;
      const bgRemovedUrl = currentImageUrl.includes("ik.imagekit.io")
        ? `${currentImageUrl.split("?")[0]}?tr=e-bgremove`
        : currentImageUrl;

      const processedImage = await FabricImage.fromURL(bgRemovedUrl, {
        crossOrigin: "anonymous",
      });

      const currentProps = {
        left: mainImage.left,
        top: mainImage.top,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        angle: mainImage.angle,
        originX: mainImage.originX,
        originY: mainImage.originY,
      };

      fabricCanvas.remove(mainImage);
      processedImage.set(currentProps);
      fabricCanvas.add(processedImage);

      processedImage.setCoords();
      fabricCanvas.setActiveObject(processedImage);
      fabricCanvas.calcOffset();
      fabricCanvas.requestRenderAll();

      setRemovalStatus('success');
      showSuccessToast("Background removed successfully");
    }
    catch (err) {
      console.log(err);
      setRemovalStatus('error');
      showErrorToast("Failed to remove background");
    }
    finally {
      setIsRemoving(false);
    }
  };

  const hasImage = !!getMainImage();

  return (
    <div className="bg-remover-container">
      <div className="bg-remover-header">
        <CustomText variant="h4" text="AI Background Removal" />
        <CustomText variant="p" text="Remove backgrounds with one click" fontSize="0.85rem" />
      </div>

      <div className={`bg-remover-hero ${isRemoving ? 'bg-remover-hero--active' : ''}`}>
        <div className="bg-remover-hero-inner">
          <div className="bg-remover-hero-icon-group">
            <div className="bg-remover-hero-icon">
              <Image size={22} />
            </div>
            <div className="bg-remover-hero-arrow">
              <ArrowRight size={16} />
            </div>
            <div className="bg-remover-hero-icon bg-remover-hero-icon--accent">
              <Sparkles size={22} />
            </div>
          </div>
          {isRemoving && (
            <div className="bg-remover-hero-pulse" />
          )}
        </div>
      </div>
      <div className="bg-remover-steps">
        <div className="bg-remover-step">
          <span className="bg-remover-step-num">1</span>
          <span className="bg-remover-step-text">AI detects the subject</span>
        </div>
        <div className="bg-remover-step">
          <span className="bg-remover-step-num">2</span>
          <span className="bg-remover-step-text">Background is removed</span>
        </div>
        <div className="bg-remover-step">
          <span className="bg-remover-step-num">3</span>
          <span className="bg-remover-step-text">Transparent result ready</span>
        </div>
      </div>

      <div className="bg-remover-action">
        <CustomButton
          onClick={handleBackgroundRemoval}
          disabled={!hasImage || isRemoving}
          variant={buttonVariants.default}
          icon={isRemoving ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
          text={isRemoving ? 'Processing...' : 'Remove Background'}
        />
      </div>

      {isRemoving && (
        <div className="bg-remover-status bg-remover-status--loading">
          <Loader2 className="animate-spin bg-remover-status-icon" />
          <span>Analyzing image and removing background...</span>
        </div>
      )}

      {!isRemoving && removalStatus === 'success' && (
        <div className="bg-remover-status bg-remover-status--success">
          <CheckCircle2 className="bg-remover-status-icon" />
          <span>Background removed successfully!</span>
        </div>
      )}

      {!isRemoving && removalStatus === 'error' && (
        <div className="bg-remover-status bg-remover-status--error">
          <XCircle className="bg-remover-status-icon" />
          <span>Failed to remove background. Try again.</span>
        </div>
      )}

      {!hasImage && (
        <div className="bg-remover-notice">
          <Image size={16} />
          <span>Add an image to the canvas first</span>
        </div>
      )}
    </div>
  )
}

export default BackgroundRemover
