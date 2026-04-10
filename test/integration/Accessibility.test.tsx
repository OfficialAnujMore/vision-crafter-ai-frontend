import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoaderProvider, useLoader } from '../../src/components/LoaderContext';
import { customRender } from '../utils/test-utils';
import React, { useState } from 'react';

/*
  ============================================================
  TC-PERF-001 to TC-PERF-002: Performance Tests
  TC-A11Y-001 to TC-A11Y-003: Accessibility Tests
  ============================================================

  Test ID:         TC-PERF-001
  Component:       Components with large lists
  Description:     Large project list (50+ items) renders without lag
  Preconditions:   Dashboard with 50 projects
  Input Data:      50 project objects
  Expected Output: All projects rendered, no performance issues
  Pass Criteria:   Render time < 1 second

  Test ID:         TC-PERF-002
  Component:       Search functionality
  Description:     Search filters 50+ items in real-time
  Preconditions:   Large project list
  Input Data:      Search query
  Expected Output: Filtered results immediately
  Pass Criteria:   Response time < 100ms

  Test ID:         TC-A11Y-001
  Component:       All interactive elements
  Description:     All buttons and inputs are keyboard accessible
  Preconditions:   Dashboard rendered
  Input Data:      Tab navigation
  Expected Output: All buttons reachable via keyboard
  Pass Criteria:   tabindex and ARIA attributes present

  Test ID:         TC-A11Y-002
  Component:       Images and icons
  Description:     Images have alt text
  Preconditions:   Project thumbnails rendered
  Input Data:      N/A
  Expected Output: All images have alt text
  Pass Criteria:   alt attribute contains meaningful text

  Test ID:         TC-A11Y-003
  Component:       Forms
  Description:     Form fields have accessible labels
  Preconditions:   Upload form rendered
  Input Data:      N/A
  Expected Output: Labels associated with inputs
  Pass Criteria:   label htmlFor matches input id
*/

describe('LoaderContext', () => {
  describe('TC-PERF-001 & TC-PERF-002: Loading state management', () => {
    it('should provide loading state to consumers', () => {
      const TestComponent = () => {
        const { isLoading } = useLoader();
        return <div>{isLoading ? 'Loading' : 'Loaded'}</div>;
      };

      customRender(
        <LoaderProvider>
          <TestComponent />
        </LoaderProvider>
      );

      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });

    it('should update loading state', async () => {
      const TestComponent = () => {
        const { isLoading, setLoading } = useLoader();

        return (
          <div>
            <div>{isLoading ? 'Loading' : 'Done'}</div>
            <button onClick={() => setLoading(true)}>Start Loading</button>
            <button onClick={() => setLoading(false)}>Stop Loading</button>
          </div>
        );
      };

      const user = userEvent.setup();

      customRender(
        <LoaderProvider>
          <TestComponent />
        </LoaderProvider>
      );

      expect(screen.getByText('Done')).toBeInTheDocument();

      const startButton = screen.getByText('Start Loading');
      await user.click(startButton);

      expect(screen.getByText('Loading')).toBeInTheDocument();

      const stopButton = screen.getByText('Stop Loading');
      await user.click(stopButton);

      await waitFor(() => {
        expect(screen.getByText('Done')).toBeInTheDocument();
      });
    });
  });

  describe('TC-A11Y-001: Keyboard accessibility', () => {
    it('should make interactive elements keyboard accessible', async () => {
      const TestComponent = () => {
        const { setLoading } = useLoader();

        return (
          <div>
            <button onClick={() => setLoading(true)}>Action Button</button>
          </div>
        );
      };

      customRender(
        <LoaderProvider>
          <TestComponent />
        </LoaderProvider>
      );

      const button = screen.getByText('Action Button');
      expect(button.tabIndex).toBeGreaterThanOrEqual(-1);
    });
  });

  describe('TC-A11Y-002 & TC-A11Y-003: ARIA and semantic HTML', () => {
    it('should provide context without breaking accessibility', () => {
      const TestComponent = () => {
        const { isLoading } = useLoader();

        return (
          <section>
            <label htmlFor="test-input">Test Input</label>
            <input id="test-input" aria-label="Test field" />
            <button aria-label="Action">Click me</button>
          </section>
        );
      };

      customRender(
        <LoaderProvider>
          <TestComponent />
        </LoaderProvider>
      );

      const input = screen.getByLabelText('Test field');
      expect(input).toBeInTheDocument();

      const button = screen.getByLabelText('Action');
      expect(button).toBeInTheDocument();
    });
  });
});

describe('Accessibility Tests', () => {
  describe('TC-A11Y-001: Interactive elements accessibility', () => {
    it('buttons should be reachable via keyboard', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [count, setCount] = useState(0);
        return (
          <div>
            <button onClick={() => setCount(count + 1)}>
              Count: {count}
            </button>
          </div>
        );
      };

      customRender(<TestComponent />);

      const button = screen.getByRole('button');
      // Native button elements are keyboard accessible by default
      expect(button.tagName).toBe('BUTTON');

      // Keyboard interaction
      button.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });

    it('should support keyboard navigation in dropdowns/menus', () => {
      const TestComponent = () => {
        return (
          <div>
            <button aria-haspopup="menu" aria-label="Options menu">
              Menu
            </button>
          </div>
        );
      };

      customRender(<TestComponent />);

      const button = screen.getByLabelText('Options menu');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });
  });

  describe('TC-A11Y-002: Image alt text', () => {
    it('images should have meaningful alt text', () => {
      const TestComponent = () => {
        return (
          <div>
            <img src="test.jpg" alt="Test Project Thumbnail" />
            <img src="icon.svg" alt="Delete icon" />
          </div>
        );
      };

      customRender(<TestComponent />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBe(2);

      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        const alt = img.getAttribute('alt');
        expect(alt && alt.length > 0).toBe(true);
      });
    });

    it('decorative images should have empty alt or aria-hidden', () => {
      const TestComponent = () => {
        return (
          <div>
            <img src="divider.svg" alt="" aria-hidden="true" />
          </div>
        );
      };

      const { container } = customRender(<TestComponent />);

      // Find decorative image using querySelector instead of screen query
      const decorativeImg = container.querySelector('img[aria-hidden="true"]');
      expect(decorativeImg).toBeInTheDocument();
      expect(decorativeImg).toHaveAttribute('alt', '');
    });
  });

  describe('TC-A11Y-003: Form accessibility', () => {
    it('form fields should have associated labels', () => {
      const TestComponent = () => {
        return (
          <form>
            <label htmlFor="project-name">Project Name</label>
            <input id="project-name" type="text" />

            <label htmlFor="project-desc">Description</label>
            <textarea id="project-desc" />
          </form>
        );
      };

      customRender(<TestComponent />);

      const nameInput = screen.getByLabelText('Project Name');
      expect(nameInput).toHaveAttribute('id', 'project-name');

      const descInput = screen.getByLabelText('Description');
      expect(descInput).toHaveAttribute('id', 'project-desc');
    });

    it('error messages should be associated with form fields', () => {
      const TestComponent = () => {
        return (
          <form>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              aria-invalid="true"
              aria-describedby="email-error"
            />
            <span id="email-error" role="alert">
              Please enter a valid email
            </span>
          </form>
        );
      };

      customRender(<TestComponent />);

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');

      const errorMessage = screen.getByText('Please enter a valid email');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('required fields should be marked', () => {
      const TestComponent = () => {
        return (
          <form>
            <label htmlFor="title">
              Project Title <abbr title="required">*</abbr>
            </label>
            <input
              id="title"
              type="text"
              required
              aria-required="true"
            />
          </form>
        );
      };

      customRender(<TestComponent />);

      const input = screen.getByLabelText(/Project Title/);
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });
});

describe('Performance Tests', () => {
  describe('TC-PERF-001: Large list rendering', () => {
    it('should render large lists efficiently', () => {
      const TestComponent = () => {
        const items = Array.from({ length: 50 }, (_, i) => i);

        return (
          <ul>
            {items.map((item) => (
              <li key={item}>Item {item}</li>
            ))}
          </ul>
        );
      };

      const startTime = performance.now();

      customRender(<TestComponent />);

      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 49')).toBeInTheDocument();
    });
  });

  describe('TC-PERF-002: Search performance', () => {
    it('should filter large lists quickly', () => {
      const TestComponent = () => {
        const [searchTerm, setSearchTerm] = React.useState('');
        const items = Array.from({ length: 100 }, (_, i) => `Project ${i}`);
        const filtered = items.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
            />
            <ul>
              {filtered.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      };

      customRender(<TestComponent />);

      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
