import React, { useRef, useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomComponents/CustomButton';
import CustomText from '../CustomComponents/CustomText';
import CustomInput from '../CustomComponents/CustomInput';
import { ImageIcon, Search, Upload, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { FabricImage } from 'fabric';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { API_CONFIG } from '../../services/config/api';
import { buttonVariants } from '../../constants/buttonVariants';
import '../../styles/FeatureComponents/BackgroundImage.css';

type Tab = 'upload' | 'unsplash';

const BackgroundImage: React.FC = () => {

  const { fabricCanvas } = useCanvasContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const applyBackgroundImage = async (imageUrl: string, id?: string) => {
    if (!fabricCanvas) return;

    if (id) setLoadingId(id);
    try {
      const bgImage = await FabricImage.fromURL(imageUrl, {
        crossOrigin: "anonymous",
      });

      bgImage.set({
        left: fabricCanvas.width / 2,
        top: fabricCanvas.height / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });

      const scale = Math.max(
        fabricCanvas.width / bgImage.width,
        fabricCanvas.height / bgImage.height
      );
      bgImage.set({ scaleX: scale, scaleY: scale });

      fabricCanvas.backgroundImage = bgImage;
      fabricCanvas.requestRenderAll();
      fabricCanvas.fire('object:modified');
      showSuccessToast('Background applied');
    } catch (error) {
      console.error('Error applying background:', error);
      showErrorToast('Failed to apply background image');
    } finally {
      setLoadingId(null);
    }
  };

  // --- Local Upload ---
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      await applyBackgroundImage(url);
    } catch (error) {
      showErrorToast('Failed to load image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Unsplash ---
  const searchUnsplashImages = async () => {
    if (!searchQuery.trim() || !API_CONFIG.UNSPLASH_ACCESS_KEY) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_CONFIG.UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${API_CONFIG.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await response.json();
      setUnsplashImages(data.results || []);
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      showErrorToast('Failed to search images');
      setUnsplashImages([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchUnsplashImages();
  };

  const triggerUnsplashDownload = async (downloadLocation: string) => {
    try {
      await fetch(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${API_CONFIG.UNSPLASH_ACCESS_KEY}`,
        },
      });
    } catch {
    }
  };

  const handleUnsplashSelect = async (image: any) => {
    if (image.links?.download_location) {
      triggerUnsplashDownload(image.links.download_location);
    }
    await applyBackgroundImage(image.urls.regular, image.id);
  };

  const handleRemoveBackground = () => {
    if (!fabricCanvas) return;
    fabricCanvas.backgroundColor = "";
    fabricCanvas.backgroundImage = undefined;
    fabricCanvas.requestRenderAll();
    fabricCanvas.fire('object:modified');
  };

  return (
    <div className="bg-image-container">
      <div className="bg-image-header">
        <CustomText variant="h4" text="Background Image" />
        <CustomText variant="p" text="Upload your own or search Unsplash" fontSize="0.85rem" />
      </div>

      <div className="bg-image-tabs">
        <button
          type="button"
          className={`bg-image-tab ${activeTab === 'upload' ? 'bg-image-tab--active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload size={14} />
          Upload
        </button>
        <button
          type="button"
          className={`bg-image-tab ${activeTab === 'unsplash' ? 'bg-image-tab--active' : ''}`}
          onClick={() => setActiveTab('unsplash')}
        >
          <Search size={14} />
          Unsplash
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-image-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <div className="bg-image-dropzone" onClick={handleFileSelect}>
            {isUploading ? (
              <Loader2 size={32} className="animate-spin" />
            ) : (
              <Upload size={32} />
            )}
            <span className="bg-image-dropzone-title">
              {isUploading ? 'Applying...' : 'Click to upload'}
            </span>
            <span className="bg-image-dropzone-hint">
              JPG, PNG, or WebP
            </span>
          </div>
        </div>
      )}

      {activeTab === 'unsplash' && (
        <div className="bg-image-unsplash">
          <div className="bg-image-search" onKeyDown={handleSearchKeyDown}>
            <div className="bg-image-search-field">
              <CustomInput
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                placeholder="Search photos..."
              />
            </div>
            <CustomButton
              onClick={searchUnsplashImages}
              disabled={isSearching || !searchQuery.trim()}
              variant={buttonVariants.default}
              icon={isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              text={isSearching ? '' : 'Search'}
            />
          </div>

          {unsplashImages && unsplashImages.length > 0 && (
            <div className="bg-image-results">
              <span className="bg-image-results-count">
                {unsplashImages.length} results
              </span>
              <div className="bg-image-list">
                {unsplashImages.map((image) => (
                  <div key={image.id} className="bg-image-item">
                    <div
                      className="bg-image-item-thumb"
                      onClick={() => handleUnsplashSelect(image)}
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || 'Unsplash photo'}
                      />
                      {loadingId === image.id && (
                        <div className="bg-image-item-loading">
                          <Loader2 size={18} className="animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="bg-image-item-info">
                      <a
                        href={`${image.user.links.html}?utm_source=visioncrafterai&utm_medium=referral`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-image-item-author"
                      >
                        {image.user.name}
                        <ExternalLink size={10} />
                      </a>
                      <a
                        href="https://unsplash.com/?utm_source=visioncrafterai&utm_medium=referral"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-image-item-source"
                      >
                        Unsplash
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && unsplashImages !== null && unsplashImages.length === 0 && searchQuery && (
            <div className="bg-image-empty">
              <ImageIcon size={28} />
              <span>No results for "{searchQuery}"</span>
            </div>
          )}

          {unsplashImages === null && (
            <div className="bg-image-empty">
              <Search size={28} />
              <span>Search for background photos</span>
              <span className="bg-image-empty-sub">Powered by Unsplash</span>
            </div>
          )}

          {!API_CONFIG.UNSPLASH_ACCESS_KEY && (
            <div className="bg-image-warning">
              Unsplash API key not configured. Add VITE_UNSPLASH_ACCESS_KEY to your .env file.
            </div>
          )}
        </div>
      )}

      <div className="bg-image-footer">
        <CustomButton
          onClick={handleRemoveBackground}
          variant={buttonVariants.outline}
          text="Clear Background"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  )
}

export default BackgroundImage
