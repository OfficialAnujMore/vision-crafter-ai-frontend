import type { Canvas } from "fabric";

export class CanvasHistoryManager {
    private history: string[] = [];
    private currentIndex: number = -1;
    private maxHistory: number = 20;

    addState(canvasJSON:Canvas) { 
        this.history = this.history.slice(0,this.currentIndex+1);

        this.history.push(JSON.stringify(canvasJSON));
        this.currentIndex++;

        if (this.history.length> this.maxHistory){
            this.history.shift();
            this.currentIndex--;
        }
    }
    undo(): string | null {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null
    }
    redo(): string | null {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null
    }
    canUndo(): boolean {
        return this.currentIndex > 0;
    }
    canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }
    clear(): void {
        this.history = [];
        this.currentIndex = -1;
    }
}