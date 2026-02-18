import type { SaveFileResponse } from './project';

export interface CanvasEditorProps {
    project: SaveFileResponse & {
        canvasState?: Record<string, unknown>;
        currentImageUrl?: string;
        originalImageUrl?: string;
    };
}
