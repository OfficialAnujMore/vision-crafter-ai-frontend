import { useContext } from 'react'
import { PanelLeftClose,} from 'lucide-react'
import CropComponent from '../FeatureComponents/CropComponent'
import ResizeComponent from '../FeatureComponents/ResizeComponent'
import TextComponent from '../FeatureComponents/TextComponent'
import BackgroundRemover from '../FeatureComponents/BackgroundRemover'
import ImageExtender from '../FeatureComponents/ImageExtender'
import { CanvasContext } from '../../context/canvasContext'
import AdjustComponent from '../FeatureComponents/AdjustComponent'
import PlaceholderPanel from '../FeatureComponents/PlaceholderPanel'
import type { CanvasEditorProps } from '../../interface/canvas'
import '../../styles/Editor.css'

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
        return <CropComponent />
      case 'text':
        return <TextComponent />
      case 'background':
        return <BackgroundRemover project={project} />
      case 'extend':
        return <ImageExtender />
      default:
        return <PlaceholderPanel title="Select a Tool" description="Choose a tool from the bottom toolbar to begin editing." />
    }
  }

  const shouldHide = activeTool === 'editing'

  return (
    <div className={`sidebar-container ${shouldHide ? 'hidden' : ''}`}>
      <button
        className="sidebar-close-btn"
        onClick={() => canvasContext?.setActiveTool('editing')}
        title="Close panel"
      >
        <PanelLeftClose size={16} />
      </button>
      {renderActiveTool()}
    </div>
  )
}

export default FeatureBar
