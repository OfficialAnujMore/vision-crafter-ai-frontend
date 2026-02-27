import React from 'react';
import '../../styles/CustomComponent/CustomColorPicker.css';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

const CustomColorPicker: React.FC<ColorPickerProps> = ({ label, color = '#000000', onChange }) => {
    return (
        <div className='color-picker-container'>
            <label>{label}</label>
            <div className='color-picker-wrapper'>
                <input
                    type='color'
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className='native-color-input'
                />
                <input
                    type='text'
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder='#000000'
                    className='color-input'
                />
            </div>

        </div>
    );
};

export default CustomColorPicker;