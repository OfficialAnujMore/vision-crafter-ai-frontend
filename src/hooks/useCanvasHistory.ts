import type { Canvas } from "fabric";
import { useCallback, useRef } from "react";
import { CanvasHistoryManager } from "../utils/CanvasHistoryManager";

export const useCanvasHistory = (fabricCanvasRef: React.RefObject<Canvas>, isRestoringRef: React.RefObject<boolean>) => {
    const historyRef = useRef<CanvasHistoryManager>(new CanvasHistoryManager());
    const isAddingToHistoryRef = useRef(false);

    const addToHistory = useCallback(() => {
        if (!isRestoringRef.current && !isAddingToHistoryRef.current && fabricCanvasRef.current) {
            isAddingToHistoryRef.current = true;
            const canvasJSON = fabricCanvasRef.current.toJSON();
            historyRef.current.addState(canvasJSON);
            console.log("Add History updated", historyRef.current.currentState());
            isAddingToHistoryRef.current = false;
        }
    }, [fabricCanvasRef, isRestoringRef]);

    const handleUndo = useCallback(() => {
        const previousState = historyRef.current.undo();
        if (previousState && fabricCanvasRef.current) {
            isRestoringRef.current = true;
            isAddingToHistoryRef.current = true;
            fabricCanvasRef.current.loadFromJSON(JSON.parse(previousState), () => {
                fabricCanvasRef.current!.requestRenderAll();
                isRestoringRef.current = false;
                isAddingToHistoryRef.current = false;
            });
            console.log("Undo History updated", historyRef.current.currentState());
        }
    }, [fabricCanvasRef, isRestoringRef]);

    const handleRedo = useCallback(() => {
        const nextState = historyRef.current.redo();
        if (nextState && fabricCanvasRef.current) {
            isRestoringRef.current = true;
            isAddingToHistoryRef.current = true;
            fabricCanvasRef.current.loadFromJSON(JSON.parse(nextState), () => {
                fabricCanvasRef.current!.requestRenderAll();
                isRestoringRef.current = false;
                isAddingToHistoryRef.current = false;
            });
            console.log("Redo History updated", historyRef.current.currentState());
        }
    }, [fabricCanvasRef, isRestoringRef]);

    return {
        addToHistory,
        handleUndo,
        handleRedo,
        canUndo: () => historyRef.current.canUndo(),
        canRedo: () => historyRef.current.canRedo(),
    };
};