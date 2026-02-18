import type { Canvas } from "fabric";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { ToolType } from "../pages/Editor";

export interface CanvasContextType {
    fabricCanvas: Canvas | null;
    setFabricCanvas: Dispatch<SetStateAction<Canvas | null>>;
    activeTool: ToolType;
    setActiveTool: React.Dispatch<React.SetStateAction<ToolType>>;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);

export const useCanvasContext = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error("useCanvasContext must be used within CanvasProvider")
    }
    return context
}

