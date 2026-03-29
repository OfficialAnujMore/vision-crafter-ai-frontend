import React from 'react';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import { exportFormatOptions, type ExportFormat } from '../../constants/exportFormats';
import { buttonVariants } from '../../constants/buttonVariants';
import { textVariant } from '../../constants/textVariants';
import '../../styles/Canvas/DownloadImageModal.css';

interface DownloadImageModalProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
}

const DownloadImageModal: React.FC<DownloadImageModalProps> = ({
  selectedFormat,
  onFormatChange,
  onExport,
}) => {
  return (
    <div className="dim-container" role="dialog" aria-label="Download image options">
      <div className="dim-header">
        <CustomText variant={textVariant.h4} text="Download Image" />
        <CustomText
          variant={textVariant.p}
          text="Choose a format for your current canvas export."
        />
      </div>

      <div className="dim-options">
        {exportFormatOptions.map((formatOption) => {
          const isActive = selectedFormat === formatOption.value;

          return (
            <button
              key={formatOption.value}
              type="button"
              className={`dim-option ${isActive ? 'dim-option--active' : ''}`}
              onClick={() => onFormatChange(formatOption.value)}
            >
              <div className="dim-option-row">
                <span className="dim-option-label">{formatOption.label}</span>
                <span className="dim-option-ext">.{formatOption.extension}</span>
              </div>
              <span className="dim-option-description">{formatOption.description}</span>
            </button>
          );
        })}
      </div>

      <div className="dim-footer">
        <CustomButton
          variant={buttonVariants.default}
          className="dim-export-btn"
          text="Export"
          onClick={onExport}
        />
      </div>
    </div>
  );
};

export default DownloadImageModal;
