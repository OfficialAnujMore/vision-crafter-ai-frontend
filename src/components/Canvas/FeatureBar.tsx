import { useContext } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import CustomButton from '../CustomComponents/CustomButton'
import { buttonVariants } from '../../constants/buttonVariants'
import CropComponent from '../FeatureComponents/CropComponent'
import ResizeComponent from '../FeatureComponents/ResizeComponent'
import TextComponent from '../FeatureComponents/TextComponent'
import BackgroundRemover from '../FeatureComponents/BackgroundRemover'
import BackgroundColor from '../FeatureComponents/BackgroundColor'
import BackgroundImage from '../FeatureComponents/BackgroundImage'
import ImageExtender from '../FeatureComponents/ImageExtender'
import GenerateComponent from '../FeatureComponents/GenerateComponent'
import { CanvasContext } from '../../context/canvasContext'
import AdjustComponent from '../FeatureComponents/AdjustComponent'
import PlaceholderPanel from '../FeatureComponents/PlaceholderPanel'
import type { CanvasEditorProps } from '../../interface/canvas'
import '../../styles/Canvas/SideBar.css'

const FeatureBar: React.FC<CanvasEditorProps> = ({ project }) => {
  const canvasContext = useContext(CanvasContext)
  const activeTool = canvasContext?.activeTool || 'adjust'

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'adjust':
        return <AdjustComponent />
      case 'resize':
        return <ResizeComponent project={project} />
      case 'crop':
        return <CropComponent project={project} />
      case 'text':
        return <TextComponent />
      case 'bg-color':
        return <BackgroundColor />
      case 'bg-image':
        return <BackgroundImage />
      case 'bg-remove':
        return <BackgroundRemover project={project} />
      case 'extend':
        return <ImageExtender />
      case 'generate':
        return <GenerateComponent />
      default:
        return <PlaceholderPanel title="Select a Tool" description="Choose a tool from the bottom toolbar to begin editing." />
    }
  }

  const shouldHide = activeTool === 'editing'

  return (
    <>
      <div className={`sidebar-container ${shouldHide ? 'hidden' : ''}`}>
        <CustomButton
          variant={buttonVariants.icon}
          className="sidebar-close-btn"
          icon={<PanelRightClose size={16} />}
          onClick={() => canvasContext?.setActiveTool('editing')}
          aria-label="Close panel"
        />
        {renderActiveTool()}
      </div>
      {shouldHide && (
        <CustomButton
          variant={buttonVariants.icon}
          className="sidebar-open-btn"
          icon={<PanelRightOpen size={18} />}
          onClick={() => canvasContext?.setActiveTool('adjust')}
          aria-label="Open panel"
        />
      )}
    </>
  )
}

export default FeatureBar
