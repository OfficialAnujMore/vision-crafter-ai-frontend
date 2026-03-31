import { useEffect, useState } from 'react'
import CustomText from '../CustomComponents/CustomText';
import CustomButton from '../CustomComponents/CustomButton';
import { useCanvasContext } from '../../context/canvasContext';
import { IText } from 'fabric';
import CustomSlider from '../CustomComponents/CustomSlider';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, ItalicIcon, Plus, Trash2, UnderlineIcon } from 'lucide-react';
import CustomColorPicker from '../CustomComponents/CustomColorPicker';
import FontPicker from '../CustomComponents/FontPicker';
import { loadGoogleFont } from '../../utils/googleFonts';
import "../../styles/FeatureComponents/TextComponent.css"
import Divider from '../Divider';
import { buttonVariants } from '../../constants/buttonVariants';

const FONT_SIZES = { min: 10, max: 120, default: 20 };
type TextAlignValue = "left" | "center" | "right" | "justify";

const TEXT_ALIGNMENT: Record<TextAlignValue, typeof AlignLeft> = {
  "left": AlignLeft,
  "center": AlignCenter,
  "right": AlignRight,
  "justify": AlignJustify,
}

const TEXT_FORMATTING = {
  "bold": BoldIcon,
  "italic": ItalicIcon,
  "underline": UnderlineIcon,
}

const TextComponent = () => {
  const [selectedText, setSelectedText] = useState<IText | null>(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(FONT_SIZES.default);
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState<TextAlignValue>("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const { fabricCanvas } = useCanvasContext();

  const updateSelectedText = () => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      const textObject = activeObject as IText;
      setSelectedText(textObject);
      setFontFamily(textObject.fontFamily || "Arial")
      setFontSize(textObject.fontSize || FONT_SIZES.default)
      setTextColor(typeof textObject.fill === "string" ? textObject.fill : "#000000")
      setTextAlign((textObject.textAlign as TextAlignValue) || "left")
      setIsBold(textObject.fontWeight === "bold" || textObject.fontWeight === 700);
      setIsItalic(textObject.fontStyle === "italic");
      setIsUnderline(textObject.underline || false);
    }
    else { setSelectedText(null) }
  }

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleSelectionCreated = () => updateSelectedText();
    const handleSelectionUpdated = () => updateSelectedText();
    const handleSelectionCleared = () => setSelectedText(null);

    fabricCanvas.on("selection:created", handleSelectionCreated)
    fabricCanvas.on("selection:updated", handleSelectionUpdated)
    fabricCanvas.on("selection:cleared", handleSelectionCleared)

    setTimeout(() => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        updateSelectedText();
      }
    }, 100);

    return () => {
      fabricCanvas.off("selection:created", handleSelectionCreated)
      fabricCanvas.off("selection:updated", handleSelectionUpdated)
      fabricCanvas.off("selection:cleared", handleSelectionCleared)
    }
  }, [fabricCanvas])

  const onAddTextComponent = () => {
    if (!fabricCanvas) return;

    const text = new IText("Add text here", {
      left: fabricCanvas.width / 2,
      top: fabricCanvas.height / 2,
      originX: "center",
      originY: "center",
      fontFamily,
      fontSize: FONT_SIZES.default,
      fill: textColor,
      textAlign,
      editable: true,
      selectable: true,
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.requestRenderAll();
    setTimeout(() => {
      text.enterEditing()
      text.selectAll()
    }, 100)
  }

  const onApplyFontFamily = async (fontFamily: string) => {
    if (!selectedText) return;
    await loadGoogleFont(fontFamily);
    setFontFamily(fontFamily)
    selectedText.set("fontFamily", fontFamily);
    fabricCanvas?.requestRenderAll();
  }

  const onApplyFontSize = (fontSize: number) => {
    if (!selectedText) return;
    setFontSize(fontSize)
    selectedText.set("fontSize", fontSize);
    fabricCanvas?.requestRenderAll();
  }

  const onApplyTextAlignment = (textAlignment: TextAlignValue) => {
    if (!selectedText) return;
    setTextAlign(textAlignment);
    selectedText.set("textAlign", textAlignment)
    fabricCanvas?.requestRenderAll();
  }

  const onApplyTextColor = (color: string) => {
    if (!selectedText) return;
    setTextColor(color);
    selectedText.set("fill", color);
    fabricCanvas?.requestRenderAll();
  };

  const onApplyTextFormatting = (format: string) => {
    if (!selectedText) return;

    switch (format) {
      case "bold": {
        const newBoldState = !isBold;
        setIsBold(!isBold);
        selectedText.set("fontWeight", newBoldState ? 700 : 400);
        break;
      }
      case "italic": {
        const newItalicState = !isItalic;
        setIsItalic(newItalicState);
        selectedText.set("fontStyle", newItalicState ? "italic" : "normal");
        break;
      }
      case "underline": {
        const newUnderlineState = !isUnderline;
        setIsUnderline(newUnderlineState);
        selectedText.set("underline", newUnderlineState);
        break;
      }
    }
    fabricCanvas?.requestRenderAll();
  };

  const onDeleteText = () => {
    if (!selectedText) return
    fabricCanvas?.remove(selectedText);
    fabricCanvas?.requestRenderAll()
    setSelectedText(null);
  }

  return (
    <div className='text-comp'>
      <div className='text-comp-header'>
        <CustomText variant='h4' text="Text" />
        <CustomText variant='p' text="Add and style text on your canvas" fontSize="0.85rem" />
      </div>

      <Divider />

      <div className='text-comp-add'>
        <CustomButton
          variant={buttonVariants.default}
          text='Add Text'
          icon={<Plus size={16} />}
          onClick={onAddTextComponent}
        />
      </div>

      {selectedText && (
        <>
          <Divider />

          <div className="text-comp-controls">
            {/* Font Family */}
            <div className="text-comp-card">
              <div className="text-comp-card-label">
                <CustomText text="Font Family" variant='p' fontSize="0.85rem" />
              </div>
              <FontPicker
                value={fontFamily}
                onChange={onApplyFontFamily}
              />
            </div>

            <div className="text-comp-card">
              <CustomSlider
                label='Font Size'
                min={FONT_SIZES.min}
                max={FONT_SIZES.max}
                value={fontSize}
                onChange={onApplyFontSize}
                step={1}
              />
            </div>

            <div className="text-comp-card">
              <div className="text-comp-card-label">
                <CustomText text="Alignment" variant='p' fontSize="0.85rem" />
              </div>
              <div className='text-comp-toggle-group'>
                {(Object.entries(TEXT_ALIGNMENT) as Array<[TextAlignValue, typeof AlignLeft]>).map(([align, IconComponent]) => (
                  <button
                    key={align}
                    className={`text-comp-toggle-btn${textAlign === align ? ' text-comp-toggle-btn--active' : ''}`}
                    onClick={() => onApplyTextAlignment(align)}
                  >
                    <IconComponent size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-comp-card">
              <div className="text-comp-card-label">
                <CustomText text="Formatting" variant='p' fontSize="0.85rem" />
              </div>
              <div className='text-comp-toggle-group'>
                {Object.entries(TEXT_FORMATTING).map(([format, IconComponent]) => {
                  const isActive =
                    (format === "bold" && isBold) ||
                    (format === "italic" && isItalic) ||
                    (format === "underline" && isUnderline);
                  return (
                    <button
                      key={format}
                      className={`text-comp-toggle-btn${isActive ? ' text-comp-toggle-btn--active' : ''}`}
                      onClick={() => onApplyTextFormatting(format)}
                    >
                      <IconComponent size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-comp-card">
              <CustomColorPicker
                label="Text Color"
                color={textColor}
                onChange={onApplyTextColor}
              />
            </div>
            <div className="text-comp-delete">
              <CustomButton
                variant={buttonVariants.outline}
                text='Delete'
                icon={<Trash2 size={16} />}
                onClick={onDeleteText}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TextComponent
