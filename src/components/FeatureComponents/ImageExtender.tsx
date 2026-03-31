import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Expand, Image, Loader2, Wand2, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import CustomSlider from '../CustomComponents/CustomSlider';
import { buttonVariants } from '../../constants/buttonVariants';
import { FabricImage } from 'fabric';
import { showErrorToast, showSuccessToast, showInfoToast } from '../../utils/toast';
import '../../styles/FeatureComponents/ImageExtender.css';

const DIRECTIONS = [
  { key: "top", label: "Top", icon: ArrowUp },
  { key: "bottom", label: "Bottom", icon: ArrowDown },
  { key: "left", label: "Left", icon: ArrowLeft },
  { key: "right", label: "Right", icon: ArrowRight },
] as const;

type DirectionKey = typeof DIRECTIONS[number]['key'];

const FOCUS_MAP: Record<DirectionKey, string> = {
  left: "fo-right",
  right: "fo-left",
  top: "fo-bottom",
  bottom: "fo-top",
};

const IMAGE_LOAD_TIMEOUT = 120_000; // 120 seconds

const ImageExtender = () => {
  const { fabricCanvas } = useCanvasContext();
  const [selectedDirection, setSelectedDirection] = useState<DirectionKey | null>(null);
  const [extensionAmount, setExtensionAmount] = useState(200);
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

  const calculateDimensions = () => {
    const image = getMainImage();
    if (!image || !selectedDirection) return { width: 0, height: 0 };

    const currentWidth = image.width * (image.scaleX || 1);
    const currentHeight = image.height * (image.scaleY || 1);

    const isHorizontal = ["left", "right"].includes(selectedDirection);
    const isVertical = ["top", "bottom"].includes(selectedDirection);

    return {
      width: Math.round(currentWidth + (isHorizontal ? extensionAmount : 0)),
      height: Math.round(currentHeight + (isVertical ? extensionAmount : 0)),
    };
  };

  const selectDirection = (direction: DirectionKey) => {
    setSelectedDirection((prev) => (prev === direction ? null : direction));
    setExtensionStatus('idle');
  };

  const hasImage = !!getMainImage();

  if (hasBackgroundRemoval()) {
    return (
      <div className="img-extender-container">
        <div className="img-extender-header">
          <CustomText variant="h4" text="AI Image Extension" />
          <CustomText variant="p" text="Extend your image in any direction" fontSize="0.85rem" />
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

  const buildExtensionUrl = (imageUrl: string) => {
    if (!imageUrl || !selectedDirection) return imageUrl;

    const baseUrl = imageUrl.split("?")[0];
    const { width, height } = calculateDimensions();

    const transformations = [
      "bg-genfill",
      `w-${width}`,
      `h-${height}`,
      "cm-pad_resize",
    ];

    const focus = FOCUS_MAP[selectedDirection];
    if (focus) transformations.push(focus);

    return `${baseUrl}?tr=${transformations.join(",")}`;
  };

  const applyExtension = async () => {
    const mainImage = getMainImage();
    if (!mainImage || !selectedDirection || !fabricCanvas) return;

    setIsExtending(true);
    setExtensionStatus('idle');
    abortRef.current = false;
    startTimer();

    try {
      const currentImageUrl = getImageSrc(mainImage);
      const extendedUrl = buildExtensionUrl(currentImageUrl);

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
      setSelectedDirection(null);
      showSuccessToast("Image extended successfully");
    } catch (error) {
      if (abortRef.current) return;
      console.error("Error applying extension:", error);
      setExtensionStatus('error');

      const message = error instanceof Error ? error.message : "";
      if (message === "timeout") {
        showErrorToast("Extension timed out. ImageKit may be under heavy load — try again.");
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

  const { width: newWidth, height: newHeight } = calculateDimensions();
  const currentImage = getMainImage();

  return (
    <div className="img-extender-container">
      <div className="img-extender-header">
        <CustomText variant="h4" text="AI Image Extension" />
        <CustomText variant="p" text="Extend your image in any direction using AI" fontSize="0.85rem" />
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

      <div>
        <CustomText variant="p" text="Select direction" fontSize="0.8rem" color="white" />
        <div className="img-extender-directions" style={{ marginTop: '0.5rem' }}>
          {DIRECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => selectDirection(key)}
              disabled={isExtending}
              className={`img-extender-dir-btn ${selectedDirection === key ? 'img-extender-dir-btn--selected' : ''}`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="img-extender-slider-section">
        <div className="img-extender-slider-header">
          <span className="img-extender-slider-label">Extension Amount</span>
          <span className="img-extender-slider-value">{extensionAmount}px</span>
        </div>
        <CustomSlider
          label="Extension Amount"
          value={extensionAmount}
          onChange={(value) => setExtensionAmount(value)}
          min={50}
          max={500}
          step={25}
          disabled={!selectedDirection || isExtending}
        />
      </div>

      {selectedDirection && currentImage && (
        <div className="img-extender-preview">
          <span className="img-extender-preview-title">Extension Preview</span>
          <div className="img-extender-preview-row">
            <span className="img-extender-preview-label">Current size</span>
            <span className="img-extender-preview-value">
              {Math.round(currentImage.width * (currentImage.scaleX || 1))} x {Math.round(currentImage.height * (currentImage.scaleY || 1))}px
            </span>
          </div>
          <div className="img-extender-preview-row">
            <span className="img-extender-preview-label">Extended size</span>
            <span className="img-extender-preview-value img-extender-preview-value--accent">
              {newWidth} x {newHeight}px
            </span>
          </div>
          <div className="img-extender-preview-row">
            <span className="img-extender-preview-label">Direction</span>
            <span className="img-extender-preview-value">
              {DIRECTIONS.find((d) => d.key === selectedDirection)?.label}
            </span>
          </div>
        </div>
      )}

      <div className="img-extender-action">
        <CustomButton
          onClick={applyExtension}
          disabled={!selectedDirection || !hasImage || isExtending}
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
          <span>Extension failed. Select a direction and try again.</span>
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
