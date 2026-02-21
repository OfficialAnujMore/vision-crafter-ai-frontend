
import { Crop, Scaling, Type, Wand2, Images, SlidersHorizontal } from 'lucide-react'
import React from 'react'
import CustomButton from '../CustomButton'
import { buttonVarients } from '../../constants/buttonVarients';
import { useCanvasContext } from '../../context/canvasContext';

const Toolbar = () => {
    const canvasContext = useCanvasContext();

    interface feature {
        icon: React.ElementType
        name: string
        onClick: () => void
    }

    const features: Array<feature> = [
        {
            icon: SlidersHorizontal,
            name: "Adjust",
            onClick: () => canvasContext?.setActiveTool("adjust")
        },
        {
            icon: Scaling,
            name: "Resize",
            onClick: () => canvasContext?.setActiveTool("resize")
        },
        {
            icon: Crop,
            name: "Crop",
            onClick: () => canvasContext?.setActiveTool("crop")
        },
        {
            icon: Type,
            name: "Text",
            onClick: () => canvasContext?.setActiveTool("text")
        },
        {
            icon: Wand2,
            name: "AI Background",
            onClick: () => canvasContext?.setActiveTool("background")
        },
        {
            icon: Images,
            name: "AI Image Extender",
            onClick: () => canvasContext?.setActiveTool("extend")
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