import type { Canvas } from "fabric";
import { useCallback, useRef } from "react";
import { CanvasHistoryManager } from "../utils/CanvasHistoryManager";

const dispatchHistoryChange = (canUndo: boolean, canRedo: boolean) => {
    window.dispatchEvent(new CustomEvent('historychange', { detail: { canUndo, canRedo } }));
};

export const useCanvasHistory = (fabricCanvasRef: React.RefObject<Canvas>, isRestoringRef: React.RefObject<boolean>) => {
    const historyRef = useRef<CanvasHistoryManager>(new CanvasHistoryManager());
    const isAddingToHistoryRef = useRef(false);
    const isUndoRedoInProgressRef = useRef(false);

    const notifyHistoryChange = useCallback(() => {
        dispatchHistoryChange(historyRef.current.canUndo(), historyRef.current.canRedo());
    }, []);

    const addToHistory = useCallback(() => {
        if (!isRestoringRef.current && !isAddingToHistoryRef.current && fabricCanvasRef.current) {
            isAddingToHistoryRef.current = true;
            const canvasJSON = fabricCanvasRef.current.toJSON();
            historyRef.current.addState(canvasJSON);
            isAddingToHistoryRef.current = false;
            notifyHistoryChange();
        }
    }, [fabricCanvasRef, isRestoringRef, notifyHistoryChange]);

    const handleUndo = useCallback(async () => {
        if (isUndoRedoInProgressRef.current || !fabricCanvasRef.current) return;
        const previousState = historyRef.current.undo();
        if (!previousState) return;

        isUndoRedoInProgressRef.current = true;
        isRestoringRef.current = true;
        isAddingToHistoryRef.current = true;
        try {
            await fabricCanvasRef.current.loadFromJSON(JSON.parse(previousState));
            fabricCanvasRef.current.requestRenderAll();
        } finally {
            isRestoringRef.current = false;
            isAddingToHistoryRef.current = false;
            isUndoRedoInProgressRef.current = false;
            notifyHistoryChange();
        }
    }, [fabricCanvasRef, isRestoringRef, notifyHistoryChange]);

    const handleRedo = useCallback(async () => {
        if (isUndoRedoInProgressRef.current || !fabricCanvasRef.current) return;
        const nextState = historyRef.current.redo();
        if (!nextState) return;

        isUndoRedoInProgressRef.current = true;
        isRestoringRef.current = true;
        isAddingToHistoryRef.current = true;
        try {
            await fabricCanvasRef.current.loadFromJSON(JSON.parse(nextState));
            fabricCanvasRef.current.requestRenderAll();
        } finally {
            isRestoringRef.current = false;
            isAddingToHistoryRef.current = false;
            isUndoRedoInProgressRef.current = false;
            notifyHistoryChange();
        }
    }, [fabricCanvasRef, isRestoringRef, notifyHistoryChange]);

    return {
        addToHistory,
        handleUndo,
        handleRedo,
        canUndo: () => historyRef.current.canUndo(),
        canRedo: () => historyRef.current.canRedo(),
    };
};