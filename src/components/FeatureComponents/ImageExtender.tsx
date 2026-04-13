import { ArrowRight, Expand, Image, Loader2, Wand2, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import { buttonVariants } from '../../constants/buttonVariants';
import { FabricImage } from 'fabric';
import { showErrorToast, showSuccessToast, showInfoToast } from '../../utils/toast';
import { extendImage, ASPECT_RATIOS, type AspectRatio } from '../../services/api/aiService';
import '../../styles/FeatureComponents/ImageExtender.css';

const IMAGE_LOAD_TIMEOUT = 120_000; // 120 seconds

const parseRatio = (ratio: AspectRatio): number => {
  const [a, b] = ratio.split(':').map(Number);
  return a / b;
};

interface RatioPreviewProps {
  targetRatio: number;
  currentRatio: number;
  selected: boolean;
}

const RatioPreview = ({ targetRatio, currentRatio, selected }: RatioPreviewProps) => {
  const BOX = 38;

  const outerW = targetRatio >= 1 ? BOX : BOX * targetRatio;
  const outerH = targetRatio >= 1 ? BOX / targetRatio : BOX;

  let innerW: number;
  let innerH: number;
  if (currentRatio < targetRatio) {
    innerH = outerH;
    innerW = outerH * currentRatio;
  } else if (currentRatio > targetRatio) {
    innerW = outerW;
    innerH = outerW / currentRatio;
  } else {
    innerW = outerW;
    innerH = outerH;
  }

  const offsetX = (BOX - outerW) / 2;
  const offsetY = (BOX - outerH) / 2;
  const innerX = offsetX + (outerW - innerW) / 2;
  const innerY = offsetY + (outerH - innerH) / 2;

  return (
    <svg width={BOX} height={BOX} className="img-extender-ratio-svg" aria-hidden>
      <rect
        x={offsetX + 0.5}
        y={offsetY + 0.5}
        width={outerW - 1}
        height={outerH - 1}
        fill="rgba(255, 148, 22, 0.12)"
        stroke={selected ? '#ff9416' : 'rgba(255, 255, 255, 0.35)'}
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={innerH}
        fill={selected ? 'rgba(255, 148, 22, 0.7)' : 'rgba(255, 255, 255, 0.55)'}
      />
    </svg>
  );
};

const ImageExtender = () => {
  const { fabricCanvas } = useCanvasContext();
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio | null>(null);
  const [isExtending, setIsExtending] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const cancelExtension = useCallback(() => {
    abortRef.current = true;
    stopTimer();
    setIsExtending(false);
    setExtensionStatus('idle');
    showInfoToast("Extension cancelled");
  }, [stopTimer]);

  const isFabricImage = (obj: unknown): obj is FabricImage =>
    typeof obj === 'object' && obj !== null && (obj as { type?: string }).type === 'image';

  const getMainImage = (): FabricImage | null => {
    const found = fabricCanvas?.getObjects().find(isFabricImage);
    return found ?? null;
  };

  const getImageSrc = (image: FabricImage | null | undefined): string => image?.getSrc() ?? '';

  const hasBackgroundRemoval = () => {
    const imageSrc = getImageSrc(getMainImage());
    return (
      imageSrc?.includes("e-bgremove") ||
      imageSrc?.includes("e-removedotbg") ||
      imageSrc?.includes("e-changebg")
    );
  };

  const selectRatio = (ratio: AspectRatio) => {
    setSelectedRatio((prev) => (prev === ratio ? null : ratio));
    setExtensionStatus('idle');
  };

  const hasImage = !!getMainImage();

  if (hasBackgroundRemoval()) {
    return (
      <div className="img-extender-container">
        <div className="img-extender-header">
          <CustomText variant="h4" text="AI Image Extension" />
          <CustomText variant="p" text="Extend your image to a new aspect ratio" fontSize="0.85rem" />
        </div>
        <div className="img-extender-unavailable">
          <div className="img-extender-unavailable-title">
            <AlertTriangle />
            Extension Not Available
          </div>
          <p className="img-extender-unavailable-text">
            AI Extension cannot be used on images with removed backgrounds.
            Please use extension first, then remove the background.
          </p>
        </div>
      </div>
    );
  }

  const applyExtension = async () => {
    const mainImage = getMainImage();
    if (!mainImage || !selectedRatio || !fabricCanvas) return;

    setIsExtending(true);
    setExtensionStatus('idle');
    abortRef.current = false;
    startTimer();

    try {
      const currentImageUrl = getImageSrc(mainImage);

      const extendedUrl = await extendImage({
        image_url: currentImageUrl,
        aspect_ratio: selectedRatio,
      });

      if (abortRef.current) return;

      const loadedImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        const timeout = setTimeout(() => {
          img.src = "";
          reject(new Error("timeout"));
        }, IMAGE_LOAD_TIMEOUT);

        img.onload = () => {
          clearTimeout(timeout);
          if (abortRef.current) {
            reject(new Error("cancelled"));
          } else {
            resolve(img);
          }
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("load_failed"));
        };

        img.src = extendedUrl;
      });

      if (abortRef.current) return;

      const extendedImage = new FabricImage(loadedImg);

      const canvasWidth = fabricCanvas.getWidth();
      const canvasHeight = fabricCanvas.getHeight();
      const scale = Math.min(
        canvasWidth / extendedImage.width,
        canvasHeight / extendedImage.height,
        1
      );

      extendedImage.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        evented: true,
      });

      fabricCanvas.remove(mainImage);
      fabricCanvas.add(extendedImage);
      fabricCanvas.setActiveObject(extendedImage);
      fabricCanvas.requestRenderAll();

      setExtensionStatus('success');
      setSelectedRatio(null);
      showSuccessToast("Image extended successfully");
    } catch (error) {
      if (abortRef.current) return;
      console.error("Error applying extension:", error);
      setExtensionStatus('error');

      const message = error instanceof Error ? error.message : "";
      if (message === "timeout") {
        showErrorToast("Extension timed out — try again.");
      } else {
        showErrorToast("Failed to extend image. Please try again.");
      }
    } finally {
      stopTimer();
      if (!abortRef.current) {
        setIsExtending(false);
      }
    }
  };

  const currentImage = getMainImage();
  const currentWidth = currentImage ? Math.round(currentImage.width * (currentImage.scaleX || 1)) : 0;
  const currentHeight = currentImage ? Math.round(currentImage.height * (currentImage.scaleY || 1)) : 0;
  const currentRatio = currentHeight > 0 ? currentWidth / currentHeight : 1;

  return (
    <div className="img-extender-container">
      <div className="img-extender-header">
        <CustomText variant="h4" text="AI Image Extension" />
        <CustomText variant="p" text="Expand your image to a new aspect ratio using AI" fontSize="0.85rem" />
      </div>

      <div className={`img-extender-hero ${isExtending ? 'img-extender-hero--active' : ''}`}>
        <div className="img-extender-hero-inner">
          <div className="img-extender-hero-icon-group">
            <div className="img-extender-hero-icon">
              <Image size={22} />
            </div>
            <div className="img-extender-hero-arrow">
              <ArrowRight size={16} />
            </div>
            <div className="img-extender-hero-icon img-extender-hero-icon--accent">
              <Expand size={22} />
            </div>
          </div>
          {isExtending && <div className="img-extender-hero-pulse" />}
        </div>
      </div>

      <div className="img-extender-sections">
        {(['horizontal', 'vertical'] as const).map((axis) => {
          const isHorizontal = axis === 'horizontal';
          const ratiosInAxis = ASPECT_RATIOS
            .map((r) => ({ ratio: r, value: parseRatio(r) }))
            .filter(({ value }) =>
              isHorizontal
                ? value > currentRatio + 0.01
                : value < currentRatio - 0.01,
            )
            .sort((a, b) =>
              isHorizontal ? a.value - b.value : b.value - a.value,
            );

          return (
            <div key={axis} className="img-extender-section">
              <CustomText
                variant="p"
                text={isHorizontal ? 'Extend horizontally' : 'Extend vertically'}
                fontSize="0.8rem"
                color="white"
              />
              {ratiosInAxis.length === 0 ? (
                <div className="img-extender-section-empty">
                  No {isHorizontal ? 'wider' : 'taller'} presets available for this image
                </div>
              ) : (
                <div className="img-extender-directions" style={{ marginTop: '0.5rem' }}>
                  {ratiosInAxis.map(({ ratio, value }) => {
                    const isSelected = selectedRatio === ratio;
                    return (
                      <button
                        key={ratio}
                        onClick={() => selectRatio(ratio)}
                        disabled={isExtending}
                        className={`img-extender-dir-btn ${isSelected ? 'img-extender-dir-btn--selected' : ''}`}
                      >
                        <RatioPreview targetRatio={value} currentRatio={currentRatio} selected={isSelected} />
                        <span className="img-extender-ratio-label">{ratio}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedRatio && currentImage && (
        <div className="img-extender-preview">
          <span className="img-extender-preview-title">Extension Preview</span>
          <div className="img-extender-preview-row">
            <span className="img-extender-preview-label">Current size</span>
            <span className="img-extender-preview-value">
              {currentWidth} x {currentHeight}px
            </span>
          </div>
          <div className="img-extender-preview-row">
            <span className="img-extender-preview-label">Target ratio</span>
            <span className="img-extender-preview-value img-extender-preview-value--accent">
              {selectedRatio}
            </span>
          </div>
        </div>
      )}

      <div className="img-extender-action">
        <CustomButton
          onClick={applyExtension}
          disabled={!selectedRatio || !hasImage || isExtending}
          variant={buttonVariants.default}
          icon={isExtending ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
          text={isExtending ? 'Extending...' : 'Apply AI Extension'}
        />
      </div>

      {isExtending && (
        <div className="img-extender-status img-extender-status--loading">
          <Loader2 className="animate-spin img-extender-status-icon" />
          <div className="img-extender-status-content">
            <span>
              {elapsedSeconds < 10
                ? "AI is generating extended content..."
                : elapsedSeconds < 30
                  ? "Still processing — this may take up to a minute..."
                  : "Almost there — large extensions take longer..."}
            </span>
            <span className="img-extender-status-timer">{elapsedSeconds}s</span>
          </div>
          <button
            className="img-extender-cancel-btn"
            onClick={cancelExtension}
            title="Cancel extension"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!isExtending && extensionStatus === 'success' && (
        <div className="img-extender-status img-extender-status--success">
          <CheckCircle2 className="img-extender-status-icon" />
          <span>Image extended successfully!</span>
        </div>
      )}

      {!isExtending && extensionStatus === 'error' && (
        <div className="img-extender-status img-extender-status--error">
          <XCircle className="img-extender-status-icon" />
          <span>Extension failed. Select an aspect ratio and try again.</span>
        </div>
      )}

      {!hasImage && (
        <div className="img-extender-notice">
          <Image size={16} />
          <span>Add an image to the canvas first</span>
        </div>
      )}
    </div>
  );
}

export default ImageExtender
