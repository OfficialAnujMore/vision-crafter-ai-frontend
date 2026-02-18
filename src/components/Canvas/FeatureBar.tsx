import { useContext } from 'react'
import '../../styles/Editor.css'
import CropComponent from '../FeatureComponents/CropComponent'
import ResizeComponent from '../FeatureComponents/ResizeComponent'
import TextComponent from '../FeatureComponents/TextComponent'
import BackgroundRemover from '../FeatureComponents/BackgroundRemover'
import ImageExtender from '../FeatureComponents/ImageExtender'
import { CanvasContext } from '../../context/canvasContext'


const FeatureBar = () => {
  const canvasContext = useContext(CanvasContext)
  const activeTool = canvasContext?.activeTool || 'resize'

  const renderActiveTool = () => {

    switch (activeTool) {
      case "resize":
        return <ResizeComponent />
      case "crop":
        return <CropComponent />
      case "text":
        return <TextComponent />
      case "background":
        return <BackgroundRemover />
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