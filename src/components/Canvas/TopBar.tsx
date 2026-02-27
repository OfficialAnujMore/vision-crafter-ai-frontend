import React from 'react'
import CustomButton from '../CustomButton'
import { ArrowLeft, Undo, Redo, Share2, Upload, User } from 'lucide-react'
import CustomText from '../CustomText'
import '../../styles/Editor.css'
import { textVariant } from '../../constants/textVarients'
import { buttonVarients } from '../../constants/buttonVarients'
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
          variant={buttonVarients.icon}
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
          variant={buttonVarients.icon}
          icon={<Undo size={18} />}
          onClick={handleUndoClick}
        />
        <CustomButton
          variant={buttonVarients.icon}
          icon={<Redo size={18} />}
          onClick={handleRedoClick}
        />
        <CustomButton
          variant={buttonVarients.ternary}
          icon={<Share2 size={16} />}
          text="Share"
        />
        <CustomButton
          variant={buttonVarients.primary}
          icon={<Upload size={16} />}
          text="Publish"
        />
        <div className='topbar-avatar' title="Profile">
          <User size={18} />
        </div>
      </div>
    </section>
  )
}

export default TopBar
