import React from "react"
import CustomText from './CustomText'
import '../../styles/CustomComponent/CustomSlider.css'

interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    step?: number;
}

const CustomSlider: React.FC<SliderProps> = ({
    label, min, max, value, onChange, step = 1
}) => {
    const fillPercent = ((value - min) / (max - min)) * 100;

    return (
        <div className="slider-container">
            <CustomText variant="p" text={label} fontSize="13px" />
            <div className="slider-track-wrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    step={step}
                    className="slider"
                    style={{ '--slider-fill': `${fillPercent}%` } as React.CSSProperties}
                    onChange={(e) => onChange(Number(e.target.value))}
                />
                <div
                    className="slider-tooltip"
                    style={{ left: `${fillPercent}%` }}
                >
                    {value}
                </div>
            </div>
        </div>
    )
}

export default CustomSlider;
