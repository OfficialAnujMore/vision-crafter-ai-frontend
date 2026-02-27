import React from 'react';
import CustomText from '../CustomComponents/CustomText';
import { textVariant } from '../../constants/textVarients';

interface PlaceholderPanelProps {
  title: string;
  description: string;
}

const PlaceholderPanel: React.FC<PlaceholderPanelProps> = ({ title, description }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
      <CustomText variant={textVariant.h4} text={title} />
      <CustomText variant={textVariant.p} text={description} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: '12px',
          color: 'var(--text-tertiary)',
          fontSize: '0.9rem',
        }}
      >
        Coming Soon
      </div>
    </div>
  );
};

export default PlaceholderPanel;
