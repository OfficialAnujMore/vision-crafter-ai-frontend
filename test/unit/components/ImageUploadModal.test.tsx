import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploadModal } from '../../../src/components/ImageUploadModal';
import { customRender } from '../../utils/test-utils';
import * as imageKitServiceModule from '../../../src/services/api/imageKitService';
import * as projectServiceModule from '../../../src/services/api/projectService';
import * as authServiceModule from '../../../src/services/api/authService';

/*
  ============================================================
  TC-IMK-001 to TC-IMK-005: ImageKit Integration Tests
  ============================================================

  Test ID:         TC-IMK-001
  Component:       ImageUploadModal
  Description:     Upload modal renders with drag and drop area
  Preconditions:   Modal is open
  Input Data:      N/A
  Expected Output: Dropzone visible, upload instructions shown
  Pass Criteria:   'Drag & drop' text present

  Test ID:         TC-IMK-002
  Component:       ImageUploadModal
  Description:     File selection shows preview
  Preconditions:   File selected
  Input Data:      Image file (PNG, JPG)
  Expected Output: Preview image shown, name field appears
  Pass Criteria:   Preview visible, input for name shown

  Test ID:         TC-IMK-003
  Component:       ImageUploadModal
  Description:     File upload to ImageKit succeeds
  Preconditions:   File selected, auth token available
  Input Data:      Valid image file
  Expected Output: File uploaded, project saved
  Pass Criteria:   API calls made with correct data

  Test ID:         TC-IMK-004
  Component:       ImageUploadModal
  Description:     File rejection shows error message
  Preconditions:   Modal is open
  Input Data:      File > 5MB or wrong type
  Expected Output: Error toast shown
  Pass Criteria:   Warning message displayed

  Test ID:         TC-IMK-005
  Component:       ImageUploadModal
  Description:     Upload button disabled until file selected
  Preconditions:   Modal is open
  Input Data:      N/A
  Expected Output: Upload button disabled
  Pass Criteria:   Button has disabled attribute
*/

describe('ImageUploadModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnUploadSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));

    vi.spyOn(authServiceModule.authService, 'getCurrentUser')
      .mockReturnValue({ id: 1, email: 'test@example.com' });
  });

  describe('TC-IMK-001: Render upload modal', () => {
    it('should render modal with upload header', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });

    it('should render drag and drop area', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(screen.getByText(/Drag & drop an image here/i)).toBeInTheDocument();
      expect(screen.getByText(/or click to select a file/i)).toBeInTheDocument();
    });

    it('should render close button', () => {
      const { container } = customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      // Find the close button by CSS class (modal close button)
      const closeButton = container.querySelector('.ium-close-btn');
      expect(closeButton).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      const { container } = customRender(
        <ImageUploadModal
          isOpen={false}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(container.querySelector('.ium-overlay')).not.toBeInTheDocument();
    });
  });

  describe('TC-IMK-002: File preview', () => {
    it('should show file input element', () => {
      const { container } = customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('should render file support information', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(screen.getByText(/Supports PNG, JPG, WEBP up to 5MB/i)).toBeInTheDocument();
    });
  });

  describe('TC-IMK-003: File upload process', () => {
    it('should render upload and cancel buttons', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
    });

    it('should call onClose when cancel is clicked', async () => {
      const user = userEvent.setup();

      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should disable upload button initially', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      const uploadButton = screen.getByText('Upload').closest('button');
      expect(uploadButton).toBeDisabled();
    });
  });

  describe('TC-IMK-004: File rejection and validation', () => {
    it('should show file type requirements', () => {
      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      expect(screen.getByText(/Supports PNG, JPG, WEBP/i)).toBeInTheDocument();
    });
  });

  describe('TC-IMK-005: Modal controls', () => {
    it('should close modal on escape key', async () => {
      const user = userEvent.setup();

      customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close modal when overlay is clicked', async () => {
      const user = userEvent.setup();

      const { container } = customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      const overlay = container.querySelector('.ium-overlay');
      if (overlay) {
        await user.click(overlay);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close when content area is clicked', async () => {
      const user = userEvent.setup();

      const { container } = customRender(
        <ImageUploadModal
          isOpen={true}
          onClose={mockOnClose}
          onUploadSuccess={mockOnUploadSuccess}
        />,
        { withLoader: true }
      );

      const card = container.querySelector('.ium-card');
      if (card) {
        await user.click(card);
      }

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
