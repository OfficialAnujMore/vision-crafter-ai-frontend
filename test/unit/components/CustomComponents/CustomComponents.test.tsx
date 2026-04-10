import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomButton from '../../../../src/components/CustomComponents/CustomButton';
import CustomText from '../../../../src/components/CustomComponents/CustomText';
import { customRender } from '../../../utils/test-utils';
import { buttonVariants } from '../../../../src/constants/buttonVariants';
import { textVariant } from '../../../../src/constants/textVariants';

/*
  ============================================================
  TC-RENDER-007 to TC-RENDER-010: Custom Component Render Tests
  ============================================================

  Test ID:         TC-RENDER-007
  Component:       CustomButton
  Description:     Button renders with text and icon
  Preconditions:   Button props provided
  Input Data:      text: 'Click Me', icon: <PlusIcon/>
  Expected Output: Button visible with text and icon
  Pass Criteria:   Text and icon present in DOM

  Test ID:         TC-RENDER-008
  Component:       CustomButton
  Description:     Button disabled state renders correctly
  Preconditions:   disabled prop = true
  Input Data:      disabled: true
  Expected Output: Button is disabled
  Pass Criteria:   disabled attribute set

  Test ID:         TC-RENDER-009
  Component:       CustomText
  Description:     Text renders with variant styling
  Preconditions:   Text and variant provided
  Input Data:      text: 'Hello World', variant: 'h1'
  Expected Output: Text displayed with correct styling
  Pass Criteria:   Text visible in DOM

  Test ID:         TC-RENDER-010
  Component:       CustomText
  Description:     Empty text renders without crashing
  Preconditions:   Empty text string
  Input Data:      text: ''
  Expected Output: No crash, empty element
  Pass Criteria:   Component renders
*/

describe('CustomButton Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TC-RENDER-007: Button renders with text and icon', () => {
    it('should render button with text', () => {
      customRender(
        <CustomButton
          text="Click Me"
          onClick={mockOnClick}
          variant={buttonVariants.default}
        />
      );

      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render button with icon element', () => {
      const { container } = customRender(
        <CustomButton
          text="Click"
          onClick={mockOnClick}
          variant={buttonVariants.default}
          icon={<span data-testid="test-icon">Icon</span>}
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render button with only icon', () => {
      const { container } = customRender(
        <CustomButton
          onClick={mockOnClick}
          variant={buttonVariants.icon}
          icon={<span data-testid="icon-only">X</span>}
        />
      );

      expect(screen.getByTestId('icon-only')).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();

      customRender(
        <CustomButton
          text="Click"
          onClick={mockOnClick}
          variant={buttonVariants.default}
        />
      );

      await user.click(screen.getByText('Click'));

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('TC-RENDER-008: Button disabled state', () => {
    it('should render disabled button', () => {
      customRender(
        <CustomButton
          text="Disabled"
          onClick={mockOnClick}
          disabled={true}
          variant={buttonVariants.default}
        />
      );

      const button = screen.getByText('Disabled').closest('button');
      expect(button).toBeDisabled();
    });

    it('should not call onClick when disabled and clicked', async () => {
      const user = userEvent.setup();

      customRender(
        <CustomButton
          text="Disabled"
          onClick={mockOnClick}
          disabled={true}
          variant={buttonVariants.default}
        />
      );

      const button = screen.getByText('Disabled').closest('button');
      if (button) {
        await user.click(button);
      }

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should support different button variants', () => {
      const { rerender } = customRender(
        <CustomButton
          text="Default"
          onClick={mockOnClick}
          variant={buttonVariants.default}
        />
      );

      expect(screen.getByText('Default')).toBeInTheDocument();

      rerender(
        <CustomButton
          text="Outline"
          onClick={mockOnClick}
          variant={buttonVariants.outline}
        />
      );

      expect(screen.getByText('Outline')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = customRender(
        <CustomButton
          text="Custom"
          onClick={mockOnClick}
          className="custom-class"
          variant={buttonVariants.default}
        />
      );

      const button = container.querySelector('.custom-class');
      expect(button).toBeInTheDocument();
    });
  });
});

describe('CustomText Component', () => {
  describe('TC-RENDER-009: Text rendering with variants', () => {
    it('should render text with h1 variant', () => {
      customRender(
        <CustomText
          text="Heading"
          variant={textVariant.h1}
        />
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
    });

    it('should render text with p variant', () => {
      customRender(
        <CustomText
          text="Paragraph text"
          variant={textVariant.p}
        />
      );

      expect(screen.getByText('Paragraph text')).toBeInTheDocument();
    });

    it('should render text with h4 variant', () => {
      customRender(
        <CustomText
          text="Heading 4"
          variant={textVariant.h4}
        />
      );

      expect(screen.getByText('Heading 4')).toBeInTheDocument();
    });

    it('should handle different text content', () => {
      const { rerender } = customRender(
        <CustomText
          text="First text"
          variant={textVariant.p}
        />
      );

      expect(screen.getByText('First text')).toBeInTheDocument();

      rerender(
        <CustomText
          text="Second text"
          variant={textVariant.p}
        />
      );

      expect(screen.getByText('Second text')).toBeInTheDocument();
    });
  });

  describe('TC-RENDER-010: Empty and edge cases', () => {
    it('should render empty text without crashing', () => {
      const { container } = customRender(
        <CustomText
          text=""
          variant={textVariant.p}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should handle long text', () => {
      const longText = 'Lorem ipsum dolor sit amet, '.repeat(20);

      customize(
        <CustomText
          text={longText}
          variant={textVariant.p}
        />
      );

      expect(screen.getByText(new RegExp(longText.substring(0, 50)))).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      const specialText = 'Hello @#$%^&*() World!';

      customRender(
        <CustomText
          text={specialText}
          variant={textVariant.p}
        />
      );

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('should handle text with line breaks', () => {
      const textWithBreaks = 'Line 1\nLine 2\nLine 3';

      customRender(
        <CustomText
          text={textWithBreaks}
          variant={textVariant.p}
        />
      );

      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });
  });
});

// Fix for the typo in customize
function customize(element: React.ReactElement) {
  return customRender(element);
}
