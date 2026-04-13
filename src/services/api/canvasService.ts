import type { Canvas } from 'fabric';
import { projectService } from '../api/projectService';

interface SaveCanvasStateOptions {
    thumbnail_url?: string;
    project_url?: string;
}

export const saveCanvasState = async (
    projectId: string,
    canvasJSON: Canvas,
    options?: SaveCanvasStateOptions,
): Promise<void> => {
    try {
        await projectService.updateProject(projectId, {
            canvas_state: canvasJSON,
            ...(options?.thumbnail_url ? { thumbnail_url: options.thumbnail_url } : {}),
            ...(options?.project_url ? { project_url: options.project_url } : {}),
        });

        console.log('Canvas state saved successfully!');
    } catch (error) {
        console.error('Failed to save canvas state:', error);
        throw error;
    }
};

export const loadCanvasState = async (
    projectId: string
): Promise<Canvas | null> => {
    try {
        const project = await projectService.getProjectById(projectId);
        if (project.canvas_state) {
            console.log('Canvas state found in database');
            return project.canvas_state;
        }
        console.log('No canvas state found, will load image instead');
        return null;
    } catch (error) {
        console.error('Failed to load canvas state:', error);
        throw error;
    }
};