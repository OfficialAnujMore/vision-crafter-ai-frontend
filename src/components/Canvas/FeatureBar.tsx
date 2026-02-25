import { useContext } from 'react'
import '../../styles/Editor.css'
import CropComponent from '../FeatureComponents/CropComponent'
import ResizeComponent from '../FeatureComponents/ResizeComponent'
import TextComponent from '../FeatureComponents/TextComponent'
import BackgroundRemover from '../FeatureComponents/BackgroundRemover'
import ImageExtender from '../FeatureComponents/ImageExtender'
import { CanvasContext } from '../../context/canvasContext'
import AdjustComponent from '../FeatureComponents/AdjustComponent'
import type { CanvasEditorProps } from '../../interface/canvas'


const FeatureBar: React.FC<CanvasEditorProps> = ({ project }) => {
  const canvasContext = useContext(CanvasContext)
  const activeTool = canvasContext?.activeTool || 'resize'

  const renderActiveTool = () => {
    switch (activeTool) {
      case "adjust":
        return <AdjustComponent />
      case "resize":
        return <ResizeComponent project={project} />
      case "crop":
        return <CropComponent />
      case "text":
        return <TextComponent />
      case "background":
        return <BackgroundRemover  project={project}  />
      case "extend":
        return <ImageExtender />
      default:
        return <div> Select a tool</div>
    }
  }

  return (
    <div className='sidebar-container'>
      {renderActiveTool()}
    </div>
  )
}

export default FeatureBar