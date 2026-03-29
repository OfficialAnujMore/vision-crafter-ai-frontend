import React, { useState, useEffect, useRef } from 'react'
import CustomButton from '../CustomComponents/CustomButton'
import { ArrowLeft, Undo, Redo, Share2,Download } from 'lucide-react'
import CustomText from '../CustomComponents/CustomText'
import '../../styles/Canvas/Topbar.css'
import { textVariant } from '../../constants/textVariants'
import { buttonVariants } from '../../constants/buttonVariants'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes'
import DownloadImageModal from './DownloadImageModal'
import { useCanvasContext } from '../../context/canvasContext'
import { exportCanvas } from '../../services/export/exportService'
import { exportFormats, type ExportFormat } from '../../constants/exportFormats'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

declare global {
  interface Window {
    canvasUndo?: () => void;
    canvasRedo?: () => void;
  }
}

const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  const { fabricCanvas } = useCanvasContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>(exportFormats.PNG);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHistoryChange = (e: Event) => {
      const { canUndo, canRedo } = (e as CustomEvent).detail;
      setCanUndo(canUndo);
      setCanRedo(canRedo);
    };
    window.addEventListener('historychange', handleHistoryChange);
    return () => window.removeEventListener('historychange', handleHistoryChange);
  }, []);

  const handleUndoClick = () => {
    window.canvasUndo?.();
  };

  const handleRedoClick = () => {
    window.canvasRedo?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDownloadOpen(false);
      }
    };

    if (isDownloadOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDownloadOpen]);

  const handleExportClick = async () => {
    if (!fabricCanvas) {
      showErrorToast(new Error('Canvas is not ready yet. Please try again in a moment.'));
      return;
    }

    try {
      const fileName = await exportCanvas(fabricCanvas, selectedExportFormat, title);
      showSuccessToast('Export started', fileName);
      setIsDownloadOpen(false);
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <section className='topbar-container'>
      <div className='topbar-left'>
        <CustomButton
          onClick={() => navigate(ROUTES.DASHBOARD)}
          variant={buttonVariants.icon}
          icon={<ArrowLeft size={20} />}
        />
      </div>

      <div className='topbar-title-group'>
        <CustomText
          variant={textVariant.h4}
          text={title}
          fontSize="0.95rem"
        />
      </div>

      <div className='topbar-action'>
        <CustomButton
          variant={buttonVariants.icon}
          icon={<Undo size={20} />}
          onClick={handleUndoClick}
          disabled={!canUndo}
        />
        <CustomButton
          variant={buttonVariants.icon}
          icon={<Redo size={20} />}
          onClick={handleRedoClick}
          disabled={!canRedo}
        />
        {/* <CustomButton
          variant={buttonVariants.icon}
          icon={<Share2 size={20} />}
        /> */}
        <div className='topbar-download-anchor' ref={downloadRef}>
          <CustomButton
            variant={buttonVariants.icon}
            icon={<Download size={20} />}
            onClick={() => setIsDownloadOpen((prev) => !prev)}
          />
          {isDownloadOpen && (
            <DownloadImageModal
              selectedFormat={selectedExportFormat}
              onFormatChange={setSelectedExportFormat}
              onExport={handleExportClick}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default TopBar
