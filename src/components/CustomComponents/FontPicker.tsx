import { useState, useEffect, useRef } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { ALL_FONTS, loadGoogleFont, isFontLoaded } from '../../utils/googleFonts';
import '../../styles/CustomComponent/FontPicker.css';

interface FontPickerProps {
  value: string;
  onChange: (fontFamily: string) => void;
}

const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [, setLoadTick] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredFonts = ALL_FONTS.filter((font) =>
    font.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (value && !isFontLoaded(value)) {
      loadGoogleFont(value).then(() => setLoadTick((t) => t + 1));
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const font = entry.target.getAttribute('data-font');
            if (font && !isFontLoaded(font)) {
              loadGoogleFont(font).then(() => setLoadTick((t) => t + 1));
            }
          }
        });
      },
      { root: listRef.current, threshold: 0.1 }
    );

    const items = listRef.current.querySelectorAll('[data-font]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [isOpen, search]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = async (font: string) => {
    await loadGoogleFont(font);
    onChange(font);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="font-picker">
      <button
        className={`font-picker-trigger${isOpen ? ' font-picker-trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: isFontLoaded(value) ? value : undefined }}
      >
        <span className="font-picker-trigger-text">{value}</span>
        <ChevronDown
          size={14}
          className={`font-picker-chevron${isOpen ? ' font-picker-chevron--open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="font-picker-panel">
          <div className="font-picker-search">
            <Search size={14} className="font-picker-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="font-picker-search-input"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="font-picker-list" ref={listRef}>
            {filteredFonts.length === 0 ? (
              <div className="font-picker-empty">No fonts found</div>
            ) : (
              filteredFonts.map((font) => (
                <button
                  key={font}
                  data-font={font}
                  className={`font-picker-item${font === value ? ' font-picker-item--selected' : ''}`}
                  style={{ fontFamily: isFontLoaded(font) ? font : undefined }}
                  onClick={() => handleSelect(font)}
                >
                  <span>{font}</span>
                  {font === value && <Check size={14} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontPicker;
