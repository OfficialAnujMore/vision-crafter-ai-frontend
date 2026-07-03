import React from 'react';
import {
  SlidersHorizontal,
  Type,
  Wand2,
  Images,
  Scaling,
  Palette,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useCanvasContext } from '../../context/canvasContext';
import type { ToolType } from '../../pages/Editor';
import '../../styles/Canvas/Bottombar.css';

interface ToolItem {
  icon: React.ElementType;
  label: string;
  tool: ToolType;
}

const tools: ToolItem[] = [
  { icon: SlidersHorizontal, label: 'Adjust', tool: 'adjust' },
  { icon: Scaling, label: 'Resize', tool: 'resize' },
  { icon: Type, label: 'Text', tool: 'text' },
  { icon: Palette, label: 'BG Color', tool: 'bg-color' },
  { icon: ImageIcon, label: 'BG Image', tool: 'bg-image' },
  { icon: Sparkles, label: 'AI Generate', tool: 'generate' },
  { icon: Wand2, label: 'AI BG', tool: 'bg-remove' },
  { icon: Images, label: 'AI Extend', tool: 'extend' },

];

const BottomToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useCanvasContext();

  return (
    <div className="bottom-toolbar">
      {tools.map((item) => {
        const Icon = item.icon;
        const isActive = activeTool === item.tool;
        return (
          <button
            key={item.tool}
            className={`bottom-toolbar-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTool(item.tool)}
            title={item.label}
          >
            <Icon size={20} />
            <span className="bottom-toolbar-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomToolbar;
