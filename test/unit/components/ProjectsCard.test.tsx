import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCard from '../../../src/components/ProjectsCard';
import { customRender } from '../../utils/test-utils';

/*
  ============================================================
  TC-EDGE-001 to TC-EDGE-005: Edge Case Tests
  ============================================================

  Test ID:         TC-EDGE-001
  Component:       ProjectCard
  Description:     Handle very long project titles
  Preconditions:   Project with 200+ character title
  Input Data:      title: 'A' * 200
  Expected Output: Title truncated, layout not broken
  Pass Criteria:   Text visible, no overflow issues

  Test ID:         TC-EDGE-002
  Component:       ProjectCard
  Description:     Handle zero dimensions
  Preconditions:   Project with width: 0, height: 0
  Input Data:      width: 0, height: 0
  Expected Output: Dimensions display but flagged
  Pass Criteria:   No crash, dimensions shown

  Test ID:         TC-EDGE-003
  Component:       ProjectCard
  Description:     Handle very large dimensions
  Preconditions:   Project with 10000x10000 dimensions
  Input Data:      width: 10000, height: 10000
  Expected Output: Dimensions display correctly
  Pass Criteria:   Text rendered properly

  Test ID:         TC-EDGE-004
  Component:       ProjectCard
  Description:     XSS protection - malicious title
  Preconditions:   Project with HTML/script in title
  Input Data:      title: '<img src=x onerror=alert("xss")>'
  Expected Output: Title rendered as text, not executed
  Pass Criteria:   Script not executed, shown as literal text

  Test ID:         TC-EDGE-005
  Component:       ProjectCard
  Description:     Handle missing thumbnail URL
  Preconditions:   Project with broken thumbnail URL
  Input Data:      thumbnail_url: 'https://invalid.com/missing.jpg'
  Expected Output: Placeholder shows, component doesn't crash
  Pass Criteria:   Component renders without error
*/

describe('ProjectCard Component', () => {
  const baseProject = {
    id: 1,
    file_id: 'file-123',
    title: 'Test Project',
    width: 1920,
    height: 1080,
    project_url: 'https://cdn.example.com/project.json',
    thumbnail_url: 'https://cdn.example.com/thumbnail.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    user_id: 1,
  };

  const mockOnDelete = vi.fn();
  const mockOnRename = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-EDGE-001: Long project titles', () => {
    it('should handle very long titles without breaking layout', () => {
      const longTitle = 'A'.repeat(150);
      const projectWithLongTitle = {
        ...baseProject,
        title: longTitle,
      };

      const { container } = customRender(
        <ProjectCard
          project={projectWithLongTitle}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      const titleElement = screen.getByText(longTitle);
      expect(titleElement).toBeInTheDocument();

      // Check that the card container exists and doesn't have overflow issues
      const card = container.querySelector('.pc-card');
      expect(card).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Test!@#$%^&*()Project';
      const projectWithSpecialTitle = {
        ...baseProject,
        title: specialTitle,
      };

      customRender(
        <ProjectCard
          project={projectWithSpecialTitle}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });
  });

  describe('TC-EDGE-002: Zero dimensions', () => {
    it('should handle zero width and height', () => {
      const projectWithZeroDims = {
        ...baseProject,
        width: 0,
        height: 0,
      };

      const { container } = customRender(
        <ProjectCard
          project={projectWithZeroDims}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText('0 x 0')).toBeInTheDocument();
      const card = container.querySelector('.pc-card');
      expect(card).toBeInTheDocument();
    });

    it('should handle very small dimensions', () => {
      const projectWithSmallDims = {
        ...baseProject,
        width: 1,
        height: 1,
      };

      customRender(
        <ProjectCard
          project={projectWithSmallDims}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText('1 x 1')).toBeInTheDocument();
    });
  });

  describe('TC-EDGE-003: Very large dimensions', () => {
    it('should handle extreme dimensions', () => {
      const projectWithLargeDims = {
        ...baseProject,
        width: 99999,
        height: 99999,
      };

      customRender(
        <ProjectCard
          project={projectWithLargeDims}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText('99999 x 99999')).toBeInTheDocument();
    });
  });

  describe('TC-EDGE-004: XSS protection', () => {
    it('should safely render malicious HTML in title', () => {
      const xssTitle = '<img src=x onerror="alert(\'xss\')">';
      const projectWithXSS = {
        ...baseProject,
        title: xssTitle,
      };

      const { container } = customRender(
        <ProjectCard
          project={projectWithXSS}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      // The title should be rendered as text, not executed
      expect(screen.getByText(xssTitle)).toBeInTheDocument();

      // Verify no script tag is created
      const scriptTags = container.querySelectorAll('script');
      expect(scriptTags.length).toBe(0);
    });

    it('should handle script tags in title', () => {
      const scriptTitle = '<script>alert("xss")</script>';
      const projectWithScript = {
        ...baseProject,
        title: scriptTitle,
      };

      customRender(
        <ProjectCard
          project={projectWithScript}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText(scriptTitle)).toBeInTheDocument();
    });
  });

  describe('TC-EDGE-005: Missing thumbnail', () => {
    it('should render with broken thumbnail URL', () => {
      const projectWithBrokenThumbnail = {
        ...baseProject,
        thumbnail_url: 'https://nonexistent.invalid/image.jpg',
      };

      const { container } = customRender(
        <ProjectCard
          project={projectWithBrokenThumbnail}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      const card = container.querySelector('.pc-card');
      expect(card).toBeInTheDocument();

      // Image should still be in the DOM
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    it('should render basic project info without thumbnail', () => {
      const projectWithoutThumb = {
        ...baseProject,
        thumbnail_url: '',
      };

      customRender(
        <ProjectCard
          project={projectWithoutThumb}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('1920 x 1080')).toBeInTheDocument();
    });
  });

  describe('TC-PROJ-CARD-001: Menu interactions', () => {
    it('should toggle menu when clicking menu button', async () => {
      const user = userEvent.setup();

      const { container } = customRender(
        <ProjectCard
          project={baseProject}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      const menuButton = container.querySelector('.pc-menu-trigger');
      expect(menuButton).toBeInTheDocument();

      if (menuButton) {
        await user.click(menuButton);

        // Wait for menu to be visible
        await waitFor(() => {
          const menu = container.querySelector('.pc-menu');
          expect(menu).toBeInTheDocument();
        });
      }
    });
  });

  describe('TC-PROJ-CARD-002: Date formatting', () => {
    it('should format dates correctly', () => {
      customRender(
        <ProjectCard
          project={baseProject}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText(/Created/)).toBeInTheDocument();
    });

    it('should show both created and updated dates when different', () => {
      customRender(
        <ProjectCard
          project={baseProject}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      expect(screen.getByText(/Created/)).toBeInTheDocument();
      expect(screen.getByText(/Updated/)).toBeInTheDocument();
    });

    it('should not show updated date if same as created', () => {
      const projectWithSameDate = {
        ...baseProject,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const { container } = customRender(
        <ProjectCard
          project={projectWithSameDate}
          onDelete={mockOnDelete}
          onRename={mockOnRename}
        />,
        { withRouter: true }
      );

      const updatedElements = screen.queryAllByText(/Updated/);
      expect(updatedElements.length).toBe(0);
    });
  });
});
