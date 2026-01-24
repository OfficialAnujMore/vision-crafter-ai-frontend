import React, { useContext } from 'react'
import CustomButton from '../CustomButton'
import { PanelContext } from '../../context/panelContext'
import { ArrowLeft, Crop, Ratio, Scaling, Type, Wand2, Images, Eye, RotateCcw, Download, Save, Undo, Redo } from 'lucide-react'
import CustomText from '../CustomText'
import "../../styles/EditorTopBar.css"
import { textVariant } from '../../constants/textVarients'
import { buttonVarients } from '../../constants/buttonVarients'

interface feature {
  icon: React.ElementType
  name: string
  onClick: () => void
}

const TopBar: React.FC<{ title: string }> = (props) => {
  const { title } = props

  const panelContext = useContext(PanelContext);

  const features: Array<feature> = [
    {
      icon: Scaling,
      name: "Resize",
      onClick: () => panelContext?.setActiveTool("resize")
    },
    {
      icon: Crop,
      name: "Crop",
      onClick: () => panelContext?.setActiveTool("crop")
    },
    {
      icon: Ratio,
      name: "Adjust",
      onClick: () => panelContext?.setActiveTool("adjust")
    },
    {
      icon: Type,
      name: "Text",
      onClick: () => panelContext?.setActiveTool("text")
    },
    {
      icon: Wand2,
      name: "AI Background",
      onClick: () => panelContext?.setActiveTool("background")
    },
    {
      icon: Images,
      name: "AI Image Extender",
      onClick: () => panelContext?.setActiveTool("extend")
    },
    {
      icon: Eye,
      name: "AI Editing",
      onClick: () => panelContext?.setActiveTool("editing")
    }
  ]

  const actionButtons = [
    { icon: RotateCcw, name: "Reset", variant: buttonVarients.secondary },
    { icon: Save, name: "Save", variant: buttonVarients.secondary },
    { icon: Download, name: "Export", variant: buttonVarients.secondary }
  ]

  return (

    <section className='topbar-content'>

      <div className='topbar-one'>
        <CustomButton
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
                icon={<Icon size={18} />}
                text={item.name}
              />
            )
          }
          )}
        </div>
      </div>

      <div className='topbar-two'>
        {features.map((feature) => {
          const Icon = feature.icon
          const isActive = panelContext?.activeTool === feature.name.toLowerCase().replace(' ', '')
          return (
            <CustomButton
              key={feature.name}
              variant={isActive ? buttonVarients.primary : buttonVarients.secondary}
              icon={<Icon size={18} />}
              text={feature.name}
              onClick={feature.onClick}
            />
          )
        })}
      </div>
    </section>

  )
}

export default TopBar