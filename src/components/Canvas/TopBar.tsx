import React from 'react'
import CustomButton from '../CustomComponents/CustomButton'
import { ArrowLeft, Undo, Redo, Share2,Download } from 'lucide-react'
import CustomText from '../CustomComponents/CustomText'
import '../../styles/Canvas/Topbar.css'
import { textVariant } from '../../constants/textVariants'
import { buttonVariants } from '../../constants/buttonVariants'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes'

declare global {
  interface Window {
    canvasUndo?: () => void;
    canvasRedo?: () => void;
  }
}

const TopBar: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  const handleUndoClick = () => {
    window.canvasUndo?.();
  };

  const handleRedoClick = () => {
    window.canvasRedo?.();
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
        />
        <CustomButton
          variant={buttonVariants.icon}
          icon={<Redo size={20} />}
          onClick={handleRedoClick}
        />
        <CustomButton
          variant={buttonVariants.icon}
          icon={<Share2 size={20} />}
        />
        <CustomButton
          variant={buttonVariants.icon}
          icon={<Download size={20} />}
        />
      </div>
    </section>
  )
}

export default TopBar
