import { useEffect, useState } from 'react'
import CustomText from '../CustomText';
import CustomButton from '../CustomButton';
import { useCanvasContext } from '../../context/canvasContext';
import { IText } from 'fabric';
import CustomSlider from '../CustomSlider';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, ItalicIcon, Trash2, UnderlineIcon } from 'lucide-react';
import CustomColorPicker from '../CustomColorPicker';
import "../../styles/FeatureComponents/TextComponent.css"
import Divider from '../Divider';

const TextComponent = () => {

  const FONT_FAMILIES = [
    "Arial",
    "Arial Black",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
  ];

  const FONT_SIZES = { min: 10, max: 120, default: 20 };

  const TEXT_ALIGNMENT = {
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
  const [selectedText, setSelectedText] = useState<IText | null>(null);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES.default);
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const { fabricCanvas } = useCanvasContext();


  const updateSelectedText = () => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    console.log(activeObject?.type);


    if (activeObject && activeObject.type === "i-text") {

      const textObject = activeObject as IText;
      setSelectedText(textObject);
      setFontFamily(textObject.fontFamily || "Arial")
      setFontSize(textObject.fontSize || FONT_SIZES.default)
      setTextColor(typeof textObject.fill === "string" ? textObject.fill : "#000000")
      setTextAlign(textObject.textAlign || "left")
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


    return () => {
      fabricCanvas.off("selection:created", handleSelectionCreated)
      fabricCanvas.off("selection:updated", handleSelectionUpdated)
      fabricCanvas.off("selection:cleared", handleSelectionCleared)
    }
  }, [fabricCanvas])

  const onAddTextComponent = () => {
    console.log(fabricCanvas);

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

    // canvasContext?.setFabricCanvas()
    setTimeout(() => {
      text.enterEditing()
      text.selectAll()
    }, 100)


  }

  const onApplyFontFamily = (fontFamily: string) => {

    if (!selectedText) return;

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

  const onApplyTextAlignment = (textAlignment: string) => {

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
    <div className='text-container'>
      {/* Section one */}
      <div className='header'>

        <CustomText variant='h4' text="Add text" />
        <CustomText variant='p' text="Customize text" />
      </div>

      <Divider />

      {/* Section two */}


      <div className='add-text-container'>
        <CustomText variant='h2' text="Customize text" />

        <CustomText variant='p' text="Customize text" />

        <CustomButton
          variant='primary'
          text='Add Text'
          onClick={onAddTextComponent}
        />
      </div>

      <Divider />
      {
        selectedText && (
          <div className="text-customization">

            {/* Update font family */}
            <div className="fontfamily-component">

              <div className='conatiner-header'>
                <CustomText text={"Font Family"} variant='p' />
              </div>

              <div className='container-body'>

                <select
                  className=''
                  value={fontFamily}
                  onChange={(e) =>
                    onApplyFontFamily(e.target.value)

                  }
                >
                  {FONT_FAMILIES.map(
                    (font) => (
                      <option key={font} value={font}> {font}</option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Update font size */}
            <div className="fontsize-component">
              <CustomSlider
                label='Font size'
                min={FONT_SIZES.min}
                max={FONT_SIZES.max}
                value={fontSize}
                onChange={onApplyFontSize}
                step={1}

              />

            </div>

            {/* Text Alignment */}
            <div className="text-alignment">

              <div className='conatiner-header'>
                <CustomText text={"Text Alignment"} variant='p' />
              </div>
              <div className='container-body'>

                {Object.entries(TEXT_ALIGNMENT).map(([align, IconComponent]) => {
                  return (
                    <CustomButton
                      key={align}
                      variant='icon'
                      icon={<IconComponent />}
                      onClick={() => onApplyTextAlignment(align)}
                    />
                  )

                })}
              </div>
            </div>

            {/* Color Picker */}
            <div className='add-text-container'>
              <CustomColorPicker
                label="Text Color"
                color={textColor}
                onChange={onApplyTextColor}
              />
            </div>

            {/* Text formatting */}
            <div className="text-formatting">
              <div className='conatiner-header'>
                <CustomText text={"Text Alignment"} variant='p' />
              </div>
              <div className='container-body'>
                {Object.entries(TEXT_FORMATTING).map(([format, IconComponent]) => (
                  <div
                    key={format}
                    className={
                      (format === "bold" && isBold) ||
                        (format === "italic" && isItalic) ||
                        (format === "underline" && isUnderline)
                        ? "active"
                        : ""
                    }
                  >
                    <CustomButton
                      variant='icon'
                      icon={<IconComponent />}
                      onClick={() => onApplyTextFormatting(format)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Delete Text */}
            <div className="delete-text">
              <CustomButton
                variant='secondary'
                text='Delete Text'
                icon={<Trash2 />}
                onClick={onDeleteText} />
            </div>
          </div>
        )
      }

    </div>
  )
}

export default TextComponent