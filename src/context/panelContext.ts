import { createContext, useContext } from "react";
import type { ToolType } from "../pages/Editor";

interface PanelContextType {
    activeTool: ToolType;
    setActiveTool: React.Dispatch<React.SetStateAction<ToolType>>;
}
export const PanelContext = createContext<PanelContextType | null>(null);

export const usePanelContext = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw Error("Error")
    }
    return context;
}