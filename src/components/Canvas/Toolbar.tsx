
import { Crop, Ratio, Scaling, Type, Wand2, Images, Eye } from 'lucide-react'
import React, { useContext } from 'react'
import CustomButton from '../CustomButton'
import { PanelContext } from '../../context/panelContext';
import { buttonVarients } from '../../constants/buttonVarients';

const Toolbar = () => {
    const panelContext = useContext(PanelContext);

    interface feature {
        icon: React.ElementType
        name: string
        onClick: () => void
    }

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
    ]
    return (

        <div className='toolbar-container'>
            {features.map((feature) => {
                const Icon = feature.icon
                return (
                    <CustomButton
                        key={feature.name}
                        variant={buttonVarients.icon}
                        icon={<Icon />}
                        onClick={feature.onClick}
                    />
                )
            })}
        </div>
    )
}

export default Toolbar