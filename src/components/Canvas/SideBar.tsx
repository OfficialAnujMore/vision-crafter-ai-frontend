import { useContext } from 'react'
import { PanelContext } from '../../context/panelContext'
import { Crop, Ratio, Scaling, Type, Wand2, Images, Eye } from 'lucide-react'
import '../../styles/SideBar.css'

interface ToolConfig {
  icon: React.ElementType
  label: string
}

const toolConfigMap: Record<string, ToolConfig> = {
  resize: { icon: Scaling, label: 'Resize' },
  crop: { icon: Crop, label: 'Crop' },
  adjust: { icon: Ratio, label: 'Adjust' },
  text: { icon: Type, label: 'Text' },
  background: { icon: Wand2, label: 'AI Background' },
  extend: { icon: Images, label: 'AI Image Extender' },
  editing: { icon: Eye, label: 'AI Editing' },
}

const SideBar = () => {
  const panelContext = useContext(PanelContext)
  const activeTool = panelContext?.activeTool || 'adjust'
  const toolConfig = toolConfigMap[activeTool]
  const IconComponent = toolConfig?.icon || Ratio

  return (
    <div className='sidebar-container'>
      {/* Sidebar Header */}
      <div className='sidebar-header'>
        <div className='sidebar-icon-wrapper'>
          <IconComponent size={24} />
        </div>
        <h3 className='sidebar-title'>{toolConfig?.label || 'Tool'}</h3>
      </div>

      {/* Sidebar Body - Content area for tool-specific UI */}
      <div className='sidebar-body'>
        {/* Tool-specific content will go here */}
      </div>
    </div>
  )
}

export default SideBar