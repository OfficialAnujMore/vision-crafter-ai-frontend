import React from 'react'
import CustomButton from '../CustomButton'
import { ArrowLeft, RotateCcw, Download, Save, Undo, Redo } from 'lucide-react'
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

const TopBar: React.FC<{ title: string }> = (props) => {
  const { title } = props

  const navigate = useNavigate();
  const handleUndoClick = () => {
    window.canvasUndo?.();
  };

  const handleRedoClick = () => {
    window.canvasRedo?.();
  };

  const actionButtons = [
    { icon: RotateCcw, name: "Reset", variant: buttonVarients.icon },
    { icon: Undo, name: "Undo", variant: buttonVarients.icon, onClick: handleUndoClick },
    { icon: Redo, name: "Redo", variant: buttonVarients.icon, onClick: handleRedoClick },
    { icon: Save, name: "Save", variant: buttonVarients.icon },
    { icon: Download, name: "Export", variant: buttonVarients.icon }
  ]

  return (

    <section className='topbar-container'>
      <CustomButton
        onClick={() => {
          navigate(ROUTES.DASHBOARD)
        }}
        variant={buttonVarients.icon}
        icon={<ArrowLeft />} />

      <CustomText
        variant={textVariant.h4}
        text={title} />
      <div className='topbar-action'>
        {actionButtons.map((item) => {
          const Icon = item.icon
          return (
            <CustomButton
              key={item.name}
              variant={item.variant}
              onClick={item.onClick}
              icon={<Icon size={20} />}
            />
          )
        }
        )}
      </div>


    </section>

  )
}

export default TopBar