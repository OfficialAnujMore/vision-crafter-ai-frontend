import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BringToFront, SendToBack, Trash2 } from 'lucide-react'
import type { Canvas, FabricObject } from 'fabric'
import '../../styles/Canvas/CanvasSelectionToolbar.css'

interface CanvasSelectionToolbarProps {
  canvas: Canvas | null
}
const getSelectionTargets = (obj: FabricObject): FabricObject[] => {
  if (obj.type === 'activeselection' && 'getObjects' in obj) {
    return (obj as unknown as { getObjects: () => FabricObject[] }).getObjects()
  }
  return [obj]
}

const isEditingText = (obj: FabricObject): boolean =>
  (obj as unknown as { isEditing?: boolean }).isEditing === true

const CanvasSelectionToolbar = ({ canvas }: CanvasSelectionToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const position = useCallback(() => {
    const el = toolbarRef.current
    if (!canvas || !el) return

    const obj = canvas.getActiveObject()
    if (!obj || isEditingText(obj)) {
      setVisible(false)
      return
    }

    const rect = obj.getBoundingRect()
    const canvasBox = canvas.getElement().getBoundingClientRect()

    const centerY = canvasBox.top + rect.top + rect.height / 2
    const rightX = canvasBox.left + rect.left + rect.width
    const leftX = canvasBox.left + rect.left

    const CLEARANCE = 16
    const toolbarWidth = el.offsetWidth || 120

    const roomRight = rightX + CLEARANCE + toolbarWidth <= canvasBox.right
    const placeLeft = !roomRight

    el.style.top = `${centerY}px`
    el.style.left = `${placeLeft ? leftX - CLEARANCE : rightX + CLEARANCE}px`
    el.dataset.placement = placeLeft ? 'left' : 'right'

    setVisible(true)
  }, [canvas])

  useEffect(() => {
    if (!canvas) return

    const show = () => position()
    const hide = () => setVisible(false)

    canvas.on('selection:created', show)
    canvas.on('selection:updated', show)
    canvas.on('selection:cleared', hide)
    canvas.on('object:moving', show)
    canvas.on('object:scaling', show)
    canvas.on('object:rotating', show)
    canvas.on('object:modified', show)
    canvas.on('after:render', show)
    canvas.on('text:editing:entered', hide)
    canvas.on('text:editing:exited', show)

    window.addEventListener('resize', show)

    return () => {
      canvas.off('selection:created', show)
      canvas.off('selection:updated', show)
      canvas.off('selection:cleared', hide)
      canvas.off('object:moving', show)
      canvas.off('object:scaling', show)
      canvas.off('object:rotating', show)
      canvas.off('object:modified', show)
      canvas.off('after:render', show)
      canvas.off('text:editing:entered', hide)
      canvas.off('text:editing:exited', show)
      window.removeEventListener('resize', show)
    }
  }, [canvas, position])

  const applyOrder = (action: 'front' | 'back') => {
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return

    getSelectionTargets(obj).forEach((target) => {
      if (action === 'front') {
        canvas.bringObjectToFront(target)
      } else {
        canvas.sendObjectToBack(target)
      }
    })

    canvas.requestRenderAll()
    canvas.fire('object:modified')
  }

  const deleteSelection = () => {
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (!obj) return

    getSelectionTargets(obj).forEach((target) => canvas.remove(target))
    canvas.discardActiveObject()
    canvas.requestRenderAll()
    setVisible(false)
  }

  return createPortal(
    <div
      ref={toolbarRef}
      className={`canvas-sel-toolbar ${visible ? 'canvas-sel-toolbar--visible' : ''}`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        className="canvas-sel-btn"
        onClick={() => applyOrder('front')}
        title="Bring to front"
      >
        <BringToFront size={15} />
        <span className="canvas-sel-label">To front</span>
      </button>
      <button
        className="canvas-sel-btn"
        onClick={() => applyOrder('back')}
        title="Send to back"
      >
        <SendToBack size={15} />
        <span className="canvas-sel-label">To back</span>
      </button>
      <span className="canvas-sel-divider" />
      <button
        className="canvas-sel-btn canvas-sel-btn--danger"
        onClick={deleteSelection}
        title="Delete"
      >
        <Trash2 size={15} />
        <span className="canvas-sel-label">Delete</span>
      </button>
    </div>,
    document.body
  )
}

export default CanvasSelectionToolbar
