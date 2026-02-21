import React from "react"
import '../styles/Slider.css'
interface SliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    step?: number
}

const CustomSlider: React.FC<SliderProps> = ({
    label, min, max, value, onChange, step = 1
}) => {

    return (
        <div className="slider-container">
            <label>{label}</label>
            <div className="slider-wrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    className="slider"
                    onChange={(e) => onChange(Number(e.target.value))}
                />
                <span>{value}</span>
            </div>
        </div>
    )

}

export default CustomSlider;