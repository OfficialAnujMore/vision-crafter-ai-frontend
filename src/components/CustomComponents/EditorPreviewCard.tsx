import React from 'react';
import { Type, SlidersHorizontal, Wand2, Palette } from 'lucide-react';
import '../../styles/CustomComponent/EditorPreviewCard.css';

interface EditorPreviewCardProps {
  compact?: boolean;
  className?: string;
}

const EditorPreviewCard: React.FC<EditorPreviewCardProps> = ({ compact = false, className }) => {
  return (
    <div className={`editor-preview${compact ? ' editor-preview--compact' : ''}${className ? ` ${className}` : ''}`}>
      <div className="editor-preview__header">
        <span className="editor-preview__dot editor-preview__dot--red" />
        <span className="editor-preview__dot editor-preview__dot--yellow" />
        <span className="editor-preview__dot editor-preview__dot--green" />
      </div>
      <div className="editor-preview__canvas">
        <div className="editor-preview__placeholder">
          <Wand2 size={compact ? 36 : 48} className="editor-preview__icon" />
          <span>Your canvas awaits</span>
        </div>
        <div className="editor-preview__toolbar">
          <span className="editor-preview__chip"><Type size={14} /> Text</span>
          <span className="editor-preview__chip"><SlidersHorizontal size={14} /> Adjust</span>
          <span className="editor-preview__chip"><Wand2 size={14} /> AI Features</span>
          <span className="editor-preview__chip"><Palette size={14} /> Backgroun Edits</span>


        </div>
      </div>
    </div>
  );
};

export default EditorPreviewCard;
