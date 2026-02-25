import React, { useState } from 'react'
import { useCanvasContext } from '../../context/canvasContext';
import CustomButton from '../CustomButton';
import CustomInput from '../CustomInput';
import CustomText from '../CustomText';
import { Trash2, Palette, ImageIcon, Search, Download, Loader2 } from 'lucide-react';
import { FabricImage } from 'fabric';
import { showErrorToast } from '../../utils/toast';
// import { HexColorPicker } from 'react-colorful';
import '../../styles/FeatureComponents/BackgroundRemover.css';
import { API_CONFIG } from '../../services/config/api';
import { HexColorPicker } from 'react-colorful';



const BackgroundRemover = ({ project }) => {

  const { fabricCanvas } = useCanvasContext();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [activeTab, setActiveTab] = useState("color");

  const getMainImage = () => {
    if (!fabricCanvas) return null;
    const objects = fabricCanvas.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };

  const handleBackgroundRemoval = async () => {
    const mainImage = getMainImage();
    if (!mainImage || !project || !fabricCanvas) return;

    try {
      const currentImageUrl = project.project_url;
      const bgRemovedUrl = currentImageUrl.includes("ik.imagekit.io")
        ? `${currentImageUrl.split("?")[0]}?tr=e-bgremove`
        : currentImageUrl;

      const processedImage = await FabricImage.fromURL(bgRemovedUrl, {
        crossOrigin: "anonymous",
      });

      const currentProps = {
        left: mainImage.left,
        top: mainImage.top,
        scaleX: mainImage.scaleX,
        scaleY: mainImage.scaleY,
        angle: mainImage.angle,
        originX: mainImage.originX,
        originY: mainImage.originY,
      };

      fabricCanvas.remove(mainImage);
      processedImage.set(currentProps);
      fabricCanvas.add(processedImage);

      processedImage.setCoords();
      fabricCanvas.setActiveObject(processedImage);
      fabricCanvas.calcOffset();
      fabricCanvas.requestRenderAll();
    }
    catch (err) {
      console.log(err);
      showErrorToast("Failed to remove background")
    }
  };

  const handleColorBackground = () => {
    if (!fabricCanvas) return;
    fabricCanvas.backgroundImage = undefined
    fabricCanvas.backgroundColor = backgroundColor;
    fabricCanvas.requestRenderAll();
    // fabricCanvas.setBackgroundColor(backgroundColor, () => {
    //   fabricCanvas.requestRenderAll();
    // });
  };

  const searchUnsplashImages = async () => {
    if (!searchQuery.trim() || !API_CONFIG.UNSPLASH_ACCESS_KEY) return;
    console.log(API_CONFIG);


    setIsSearching(true);
    try {

      const response = await fetch(
        `${API_CONFIG.UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID ${API_CONFIG.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      // const response = await fetch(
      //   `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`
      // );
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

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchUnsplashImages();
    }
  };
  const handleRemoveBackground = () => {
    if (!fabricCanvas) return;

    // Clear both background color and image
    fabricCanvas.backgroundColor = "";
    fabricCanvas.backgroundImage = undefined;
    fabricCanvas.requestRenderAll();
  };

  const handleImageBackground = async (imageUrl, imageId) => {
    if (!fabricCanvas) return;

    setSelectedImageId(imageId);
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

      const canvasWidth = fabricCanvas.width;
      const canvasHeight = fabricCanvas.height;
      const imgWidth = bgImage.width;
      const imgHeight = bgImage.height;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      bgImage.set({
        scaleX: scale,
        scaleY: scale,
      });


      fabricCanvas.backgroundImage = bgImage;
      fabricCanvas.requestRenderAll();
    } catch (error) {
      console.error('Error applying background:', error);
      showErrorToast('Failed to apply background image');
    } finally {
      setSelectedImageId(null);
    }
  };

  return (
    <div className="bg-remover-container">
      <div className="bg-remover-header">
        <h3 className="bg-remover-title">
          AI Background Removal
        </h3>
        <p className="bg-remover-description">
          Automatically remove the background from your image using AI
        </p>
      </div>

      <CustomButton
        onClick={handleBackgroundRemoval}
        disabled={!getMainImage()}
        variant="primary"
        icon={<Trash2 />}
        text='Remove Image Background'
      />

      {!getMainImage() && (
        <p className="bg-remover-warning">
          Please add an image to the canvas first to remove its background
        </p>
      )}

      {/* Custom Tabs */}
      <div className="bg-remover-tabs">
        <div className="bg-remover-tabs-list">
          <button
            className={`bg-remover-tab-trigger ${activeTab === "color" ? "active" : ""}`}
            onClick={() => setActiveTab("color")}
          >
            <Palette className="tab-icon" />
            Color
          </button>
          <button
            className={`bg-remover-tab-trigger ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            <ImageIcon className="tab-icon" />
            Image
          </button>
        </div>

        {/* Color Tab */}
        {activeTab === "color" && (
          <div className="bg-remover-tab-content">
            <div className="bg-remover-section">
              <CustomText
                text="Solid Color Background"
                variant="p"
              />
              <p className="bg-remover-subtitle">
                Choose a solid color for your canvas background
              </p>
            </div>

            <div className="bg-remover-color-section">
              <div className="bg-remover-color-picker-wrapper">
                <HexColorPicker
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>

              <div className="bg-remover-color-input-group">
                <CustomInput
                  value={backgroundColor}
                  onChange={(value) => setBackgroundColor(value)}
                  placeholder="#ffffff"
                  label="Hex Color"
                />
                <div
                  className="bg-remover-color-preview"
                  style={{ backgroundColor }}
                />
              </div>

              <CustomButton
                onClick={handleColorBackground}
                variant="primary"
                icon={<Palette />}
                text="Apply Color"
              />
            </div>
          </div>
        )}

        {/* Image Tab */}
        {activeTab === "image" && (
          <div className="bg-remover-tab-content">
            <div className="bg-remover-section">
              <CustomText
                text="Image Background"
                variant="p"
              />
              <p className="bg-remover-subtitle">
                Search and use high-quality images from Unsplash
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-remover-search-group">
              <CustomInput
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                // onKeyPress={handleSearchKeyPress}
                placeholder="Search for backgrounds..."
              />
              <CustomButton
                onClick={searchUnsplashImages}
                disabled={isSearching || !searchQuery.trim()}
                variant="primary"
                icon={isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                text={isSearching ? "Searching..." : "Search"}
              />
            </div>

            {/* Search Results */}
            {unsplashImages?.length > 0 && (
              <div className="bg-remover-results">
                <h4 className="bg-remover-results-title">
                  Search Results ({unsplashImages?.length})
                </h4>
                <div className="bg-remover-grid">
                  {unsplashImages.map((image) => (
                    <div
                      key={image.id}
                      className="bg-remover-image-card"
                      onClick={() =>
                        handleImageBackground(image.urls.regular, image.id)
                      }
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description || "Background image"}
                        className="bg-remover-image"
                      />

                      {/* Loading overlay */}
                      {selectedImageId === image.id && (
                        <div className="bg-remover-overlay loading">
                          <Loader2 className="animate-spin" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="bg-remover-overlay hover">
                        <Download />
                      </div>

                      {/* Attribution */}
                      <div className="bg-remover-attribution">
                        <p>by {image.user.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isSearching && unsplashImages?.length === 0 && searchQuery && (
              <div className="bg-remover-empty-state">
                <ImageIcon />
                <p>No images found for "{searchQuery}"</p>
                <span>Try a different search term</span>
              </div>
            )}

            {/* Initial state */}
            {!searchQuery && unsplashImages?.length === 0 && (
              <div className="bg-remover-empty-state">
                <Search />
                <p>Search for background images</p>
                <span>Powered by Unsplash</span>
              </div>
            )}

            {/* API key warning */}
            {!API_CONFIG.UNSPLASH_ACCESS_KEY && (
              <div className="bg-remover-warning-box">
                <p>
                  Unsplash API key not configured. Please add
                  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your environment variables.
                </p>
              </div>
            )}
          </div>
        )}


      </div>

      <div className="pt-4 border-t border-white/10 bottom-0 w-full">
        <CustomButton
          onClick={handleRemoveBackground}
          variant="secondary"
          text='Clear Canvas Background'
          icon={<Trash2 />}
        />

      </div>
    </div>
  )
}

export default BackgroundRemover