import { jsPDF } from 'jspdf';
import type { Canvas } from 'fabric';
import { exportFormats, type ExportFormat } from '../../constants/exportFormats';

const DEFAULT_EXPORT_QUALITY = 0.92;

const padNumber = (value: number) => String(value).padStart(2, '0');

const slugifyTitle = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const getTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = padNumber(now.getMonth() + 1);
  const day = padNumber(now.getDate());
  const hours = padNumber(now.getHours());
  const minutes = padNumber(now.getMinutes());
  const seconds = padNumber(now.getSeconds());
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
};

const buildFileName = (title: string, extension: string) => {
  const safeTitle = slugifyTitle(title) || 'visioncrafter-export';
  return `${safeTitle}-${getTimestamp()}.${extension}`;
};

const triggerDownload = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const loadImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to prepare canvas snapshot for PDF export.'));
    image.src = dataUrl;
  });

const exportAsImage = (fabricCanvas: Canvas, format: 'png' | 'jpeg' | 'webp', fileName: string) => {
  const dataUrl = fabricCanvas.toDataURL({
    format,
    quality: format === 'png' ? undefined : DEFAULT_EXPORT_QUALITY,
    multiplier: 1,
    enableRetinaScaling: true,
  });
  triggerDownload(dataUrl, fileName);
};

const exportAsPdf = async (fabricCanvas: Canvas, fileName: string) => {
  const snapshot = fabricCanvas.toDataURL({
    format: 'png',
    multiplier: 1,
    enableRetinaScaling: true,
  });

  const image = await loadImage(snapshot);
  const width = image.naturalWidth || fabricCanvas.getWidth();
  const height = image.naturalHeight || fabricCanvas.getHeight();

  const pdf = new jsPDF({
    orientation: width >= height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  pdf.addImage(snapshot, 'PNG', 0, 0, width, height, undefined, 'FAST');
  pdf.save(fileName);
};

export const exportCanvas = async (
  fabricCanvas: Canvas,
  format: ExportFormat,
  projectTitle: string,
): Promise<string> => {
  const extension = format === exportFormats.JPEG ? 'jpg' : format;
  const filename = buildFileName(projectTitle, extension);

  if (format === exportFormats.PDF) {
    await exportAsPdf(fabricCanvas, filename);
    return filename;
  }

  exportAsImage(fabricCanvas, format, filename);
  return filename;
};
