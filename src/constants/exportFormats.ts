export const exportFormats = {
  PNG: 'png',
  JPEG: 'jpeg',
  WEBP: 'webp',
  PDF: 'pdf',
} as const;

export type ExportFormat = typeof exportFormats[keyof typeof exportFormats];

export interface ExportFormatOption {
  value: ExportFormat;
  label: string;
  extension: string;
  description: string;
}

export const exportFormatOptions: ExportFormatOption[] = [
  {
    value: exportFormats.PNG,
    label: 'PNG',
    extension: 'png',
    description: 'Lossless format with transparent background support.',
  },
  {
    value: exportFormats.JPEG,
    label: 'JPEG',
    extension: 'jpg',
    description: 'Smaller file size with broad compatibility.',
  },
  {
    value: exportFormats.WEBP,
    label: 'WEBP',
    extension: 'webp',
    description: 'Modern format with excellent compression.',
  },
  {
    value: exportFormats.PDF,
    label: 'PDF',
    extension: 'pdf',
    description: 'Single-page document export.',
  },
];
