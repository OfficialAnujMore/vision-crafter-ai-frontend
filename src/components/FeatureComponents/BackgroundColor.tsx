import React, { useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import CustomInput from '../CustomComponents/CustomInput';
import { Palette, Trash2, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { buttonVariants } from '../../constants/buttonVariants';
import '../../styles/FeatureComponents/BackgroundColor.css';

const PRESET_COLORS = [
  '#ffffff', '#000000', '#f87171', '#fb923c',
  '#facc15', '#4ade80', '#22d3ee', '#818cf8',
  '#c084fc', '#f472b6', '#1e293b', '#334155',
];

const BackgroundColor: React.FC = () => {

  const { fabricCanvas } = useCanvasContext();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [appliedColor, setAppliedColor] = useState<string | null>(null);

  const applyColor = (color: string) => {
    if (!fabricCanvas) return;
    fabricCanvas.backgroundImage = undefined;
    fabricCanvas.backgroundColor = color;
    fabricCanvas.requestRenderAll();
    fabricCanvas.fire('object:modified');
    setAppliedColor(color);
  };

  const handlePresetClick = (color: string) => {
    setBackgroundColor(color);
    applyColor(color);
  };

  const handleApplyColor = () => {
    applyColor(backgroundColor);
  };

  const handleRemoveBackground = () => {
    if (!fabricCanvas) return;
    fabricCanvas.backgroundColor = "";
    fabricCanvas.backgroundImage = undefined;
    fabricCanvas.requestRenderAll();
    fabricCanvas.fire('object:modified');
    setAppliedColor(null);
  };

  return (
    <div className="bg-color-container">
      <div className="bg-color-header">
        <CustomText variant="h4" text="Background Color" />
        <CustomText variant="p" text="Pick a color or enter a hex value" fontSize="0.85rem" />
      </div>

      <div className="bg-color-presets">
        <span className="bg-color-presets-label">Quick Presets</span>
        <div className="bg-color-presets-grid">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`bg-color-swatch ${appliedColor === color ? 'bg-color-swatch--active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handlePresetClick(color)}
              title={color}
            >
              {appliedColor === color && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-color-divider" />

      <div className="bg-color-custom">
        <span className="bg-color-custom-label">Custom Color</span>
        <div className="bg-color-picker-wrapper">
          <HexColorPicker
            color={backgroundColor}
            onChange={setBackgroundColor}
          />
        </div>

        <div className="bg-color-input-row">
          <div className="bg-color-preview" style={{ backgroundColor }} />
          <div className="bg-color-input-field">
            <CustomInput
              value={backgroundColor}
              onChange={(value) => setBackgroundColor(value)}
              placeholder="#ffffff"
              label="Hex"
            />
          </div>
          <CustomButton
            onClick={handleApplyColor}
            variant={buttonVariants.default}
            icon={<Palette size={16} />}
            text="Apply"
          />
        </div>
      </div>

      <div className="bg-color-footer">
        <CustomButton
          onClick={handleRemoveBackground}
          variant={buttonVariants.outline}
          text="Clear Background"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  )
}

export default BackgroundColor
