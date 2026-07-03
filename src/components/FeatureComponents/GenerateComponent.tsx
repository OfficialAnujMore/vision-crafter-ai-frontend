import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Wand2, Loader2, CheckCircle2, XCircle, Zap, X, Image as ImageIcon } from 'lucide-react'
import { useCanvasContext } from '../../context/canvasContext'
import { useTokens } from '../../context/tokenContext'
import CustomButton from '../CustomComponents/CustomButton'
import CustomText from '../CustomComponents/CustomText'
import PurchaseModal from '../PurchaseModal'
import { buttonVariants } from '../../constants/buttonVariants'
import { FabricImage } from 'fabric'
import { showErrorToast, showSuccessToast, showInfoToast } from '../../utils/toast'
import {
  generateImage,
  editImage,
  GENERATION_MODELS,
  GENERATION_TOKEN_COST,
  ASPECT_RATIOS,
  type AspectRatio,
  type GenerationModelId,
} from '../../services/api/aiService'
import '../../styles/FeatureComponents/GenerateComponent.css'

const TOKEN_COST = GENERATION_TOKEN_COST

type Mode = 'generate' | 'edit'

const isFabricImage = (obj: unknown): obj is FabricImage =>
  typeof obj === 'object' && obj !== null && (obj as { type?: string }).type === 'image'

const GenerateComponent = () => {
  const { fabricCanvas } = useCanvasContext()
  const { tokenBalance, deductOptimistic, refreshBalance } = useTokens()

  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<GenerationModelId>(GENERATION_MODELS[0].id)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [selectedImage, setSelectedImage] = useState<FabricImage | null>(null)
  const [hasAnyImage, setHasAnyImage] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)
  const activeModeRef = useRef<Mode>('generate')

  useEffect(() => {
    if (!fabricCanvas) return

    const update = () => {
      const active = fabricCanvas.getActiveObject()
      setSelectedImage(active && isFabricImage(active) ? active : null)
      setHasAnyImage(fabricCanvas.getObjects().some(isFabricImage))
    }

    update()
    fabricCanvas.on('selection:created', update)
    fabricCanvas.on('selection:updated', update)
    fabricCanvas.on('selection:cleared', update)
    fabricCanvas.on('object:added', update)
    fabricCanvas.on('object:removed', update)

    return () => {
      fabricCanvas.off('selection:created', update)
      fabricCanvas.off('selection:updated', update)
      fabricCanvas.off('selection:cleared', update)
      fabricCanvas.off('object:added', update)
      fabricCanvas.off('object:removed', update)
    }
  }, [fabricCanvas])

  const selectionMode: Mode = selectedImage ? 'edit' : 'generate'
  const mode: Mode = isProcessing ? activeModeRef.current : selectionMode

  const startTimer = useCallback(() => {
    setElapsedSeconds(0)
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => () => stopTimer(), [stopTimer])

  const cancelProcessing = useCallback(() => {
    abortRef.current = true
    stopTimer()
    setIsProcessing(false)
    setStatus('idle')
    showInfoToast(activeModeRef.current === 'edit' ? 'Edit cancelled' : 'Generation cancelled')
  }, [stopTimer])

  // Add a generated image as a new movable layer (non-destructive).
  const addImageToCanvas = async (url: string) => {
    if (!fabricCanvas) return

    const image = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
    if (abortRef.current) return

    const canvasWidth = fabricCanvas.getWidth()
    const canvasHeight = fabricCanvas.getHeight()
    const scale = Math.min(
      (canvasWidth * 0.9) / (image.width || 1),
      (canvasHeight * 0.9) / (image.height || 1),
      1
    )

    image.set({
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      originX: 'center',
      originY: 'center',
      scaleX: scale,
      scaleY: scale,
      selectable: true,
      evented: true,
    })

    fabricCanvas.add(image)
    image.setCoords()
    fabricCanvas.setActiveObject(image)
    fabricCanvas.requestRenderAll()
    fabricCanvas.fire('object:modified')
  }

  const replaceSelectedImage = async (url: string, target: FabricImage) => {
    if (!fabricCanvas) return

    const editedImage = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
    if (abortRef.current) return

    const currentProps = {
      left: target.left,
      top: target.top,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      angle: target.angle,
      originX: target.originX,
      originY: target.originY,
    }

    fabricCanvas.remove(target)
    editedImage.set(currentProps)
    fabricCanvas.add(editedImage)
    editedImage.setCoords()
    fabricCanvas.setActiveObject(editedImage)
    fabricCanvas.calcOffset()
    fabricCanvas.requestRenderAll()
    fabricCanvas.fire('object:modified')
  }

  const handleSubmit = async () => {
    if (!fabricCanvas || !prompt.trim() || isProcessing) return

    const submitMode = selectionMode
    const target = selectedImage
    if (submitMode === 'edit' && !target) return

    if (tokenBalance !== null && tokenBalance < TOKEN_COST) {
      setIsPurchaseOpen(true)
      return
    }

    activeModeRef.current = submitMode
    setIsProcessing(true)
    setStatus('idle')
    abortRef.current = false
    startTimer()
    deductOptimistic(TOKEN_COST)

    try {
      if (submitMode === 'edit' && target) {
        const { resultUrl } = await editImage({
          image_url: target.getSrc(),
          prompt: prompt.trim(),
        })
        if (abortRef.current) return
        await replaceSelectedImage(resultUrl, target)
      } else {
        const { resultUrl } = await generateImage({
          prompt: prompt.trim(),
          model,
          aspect_ratio: aspectRatio,
        })
        if (abortRef.current) return
        await addImageToCanvas(resultUrl)
      }

      if (abortRef.current) return

      setStatus('success')
      showSuccessToast(
        submitMode === 'edit' ? 'Image edited successfully' : 'Image generated successfully'
      )
      await refreshBalance()
    } catch (err) {
      if (abortRef.current) return
      console.error('AI request failed:', err)
      setStatus('error')
      showErrorToast(
        submitMode === 'edit'
          ? 'Failed to edit image. Please try again.'
          : 'Failed to generate image. Please try again.'
      )
      await refreshBalance()
    } finally {
      stopTimer()
      if (!abortRef.current) setIsProcessing(false)
    }
  }

  const isEdit = mode === 'edit'
  const hasInsufficientTokens = tokenBalance !== null && tokenBalance < TOKEN_COST

  return (
    <div className="ai-generate-container">
      <div className="ai-generate-header">
        <CustomText variant="h4" text={isEdit ? 'AI Image Edit' : 'AI Image Generation'} />
        <CustomText
          variant="p"
          text={
            isEdit
              ? `Describe a change and AI edits your image - ${TOKEN_COST} tokens`
              : `Describe an image and let AI create it - ${TOKEN_COST} tokens`
          }
          fontSize="0.85rem"
        />
      </div>

      <div className="ai-generate-section">
        <label className="ai-generate-label" htmlFor="ai-generate-prompt">
          {isEdit ? 'Edit instruction' : 'Prompt'}
        </label>
        <textarea
          id="ai-generate-prompt"
          className="ai-generate-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            isEdit
              ? 'e.g. Make it a snowy winter scene, add a red hat to the person'
              : 'e.g. A serene mountain lake at sunset, photorealistic'
          }
          rows={4}
          disabled={isProcessing}
        />
      </div>

      {!isEdit && (
        <>
          <div className="ai-generate-section">
            <span className="ai-generate-label">Model</span>
            <div className="ai-generate-models">
              {GENERATION_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  disabled={isProcessing}
                  className={`ai-generate-model-btn ${model === m.id ? 'ai-generate-model-btn--selected' : ''}`}
                >
                  <span className="ai-generate-model-name">{m.label}</span>
                  <span className="ai-generate-model-desc">{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-generate-section">
            <span className="ai-generate-label">Aspect ratio</span>
            <div className="ai-generate-ratios">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  disabled={isProcessing}
                  className={`ai-generate-ratio-btn ${aspectRatio === ratio ? 'ai-generate-ratio-btn--selected' : ''}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="ai-generate-action">
        <CustomButton
          onClick={handleSubmit}
          disabled={!prompt.trim() || isProcessing}
          variant={buttonVariants.default}
          icon={
            isProcessing ? (
              <Loader2 className="animate-spin" />
            ) : isEdit ? (
              <Wand2 size={18} />
            ) : (
              <Sparkles size={18} />
            )
          }
          text={
            isProcessing
              ? isEdit
                ? 'Editing...'
                : 'Generating...'
              : isEdit
                ? 'Apply AI Edit'
                : 'Generate Image'
          }
        />
      </div>

      {isProcessing && (
        <div className="ai-generate-status ai-generate-status--loading">
          <Loader2 className="animate-spin ai-generate-status-icon" />
          <div className="ai-generate-status-content">
            <span>
              {elapsedSeconds < 10
                ? isEdit
                  ? 'AI is editing your image...'
                  : 'AI is creating your image...'
                : elapsedSeconds < 30
                  ? 'Still working — this may take up to a minute...'
                  : 'Almost there — complex requests take longer...'}
            </span>
            <span className="ai-generate-status-timer">{elapsedSeconds}s</span>
          </div>
          <button className="ai-generate-cancel-btn" onClick={cancelProcessing} title="Cancel">
            <X size={14} />
          </button>
        </div>
      )}

      {!isProcessing && status === 'success' && (
        <div className="ai-generate-status ai-generate-status--success">
          <CheckCircle2 className="ai-generate-status-icon" />
          <span>{isEdit ? 'Image edited successfully!' : 'Image generated and added to canvas!'}</span>
        </div>
      )}

      {!isProcessing && status === 'error' && (
        <div className="ai-generate-status ai-generate-status--error">
          <XCircle className="ai-generate-status-icon" />
          <span>
            {isEdit
              ? 'Edit failed. Adjust your instruction and try again.'
              : 'Generation failed. Adjust your prompt and try again.'}
          </span>
        </div>
      )}

      {/* Mode discoverability hints */}
      {!isProcessing && isEdit && (
        <div className="ai-generate-notice">
          <ImageIcon size={16} />
          <span>Editing the selected image — deselect to generate a new one.</span>
        </div>
      )}

      {!isProcessing && !isEdit && hasAnyImage && (
        <div className="ai-generate-notice">
          <ImageIcon size={16} />
          <span>Select an image on the canvas to edit it instead.</span>
        </div>
      )}

      {hasInsufficientTokens && !isProcessing && (
        <div className="ai-generate-notice ai-generate-notice--tokens">
          <Zap size={16} />
          <span>Need {TOKEN_COST} tokens (you have {tokenBalance})</span>
          <button className="ai-generate-buy-btn" onClick={() => setIsPurchaseOpen(true)}>
            Buy tokens
          </button>
        </div>
      )}

      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
    </div>
  )
}

export default GenerateComponent
