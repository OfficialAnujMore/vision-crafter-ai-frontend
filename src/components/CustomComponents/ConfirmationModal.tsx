import React, { useEffect, useCallback } from 'react';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { textVariant } from '../../constants/textVariants';
import { buttonVariants } from '../../constants/buttonVariants';
import '../../styles/CustomComponent/ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div
        className={`cm-card cm-card--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cm-body">
          <CustomText variant={textVariant.h4} text={title} />
          <CustomText variant={textVariant.p} text={description} />
        </div>
        <div className="cm-actions">
          <CustomButton
            variant={buttonVariants.outline}
            text={cancelText}
            onClick={onClose}
            className="cm-btn"
          />
          <CustomButton
            variant={buttonVariants.default}
            text={confirmText}
            onClick={onConfirm}
            className={`cm-btn ${variant === 'danger' ? 'cm-btn--danger' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
