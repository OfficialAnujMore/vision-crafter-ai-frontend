import  { useEffect, useState } from 'react'
import CustomButton from '../CustomComponents/CustomButton';
import { RotateCcw } from 'lucide-react';
import CustomText from '../CustomComponents/CustomText';
import { filters, FabricImage } from "fabric";
import { useCanvasContext } from '../../context/canvasContext';
import CustomSlider from '../CustomComponents/CustomSlider';
import { FabricObject } from 'fabric';
import '../../styles/FeatureComponents/AdjustComponent.css';


interface FilterConfig {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    filterClass: typeof filters.Brightness | typeof filters.Contrast | typeof filters.Saturation | typeof filters.Vibrance | typeof filters.Blur | typeof filters.HueRotation;
    valueKey: string;
    transform: (value: number) => number;
    suffix?: string;
}

const FILTER_CONFIGS: FilterConfig[] = [
    {
        key: "brightness",
        label: "Brightness",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        filterClass: filters.Brightness,
        valueKey: "brightness",
        transform: (value) => value / 100,
    },
    {
        key: "contrast",
        label: "Contrast",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        filterClass: filters.Contrast,
        valueKey: "contrast",
        transform: (value) => value / 100,
    },
    {
        key: "saturation",
        label: "Saturation",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        filterClass: filters.Saturation,
        valueKey: "saturation",
        transform: (value) => value / 100,
    },
    {
        key: "vibrance",
        label: "Vibrance",
        min: -100,
        max: 100,
        step: 1,
        defaultValue: 0,
        filterClass: filters.Vibrance,
        valueKey: "vibrance",
        transform: (value) => value / 100,
    },
    {
        key: "blur",
        label: "Blur",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        filterClass: filters.Blur,
        valueKey: "blur",
        transform: (value) => value / 100,
    },
    {
        key: "hue",
        label: "Hue",
        min: -180,
        max: 180,
        step: 1,
        defaultValue: 0,
        filterClass: filters.HueRotation,
        valueKey: "rotation",
        transform: (value) => value * (Math.PI / 180),
        suffix: "°",
    },
];
const DEFAULT_VALUES = FILTER_CONFIGS.reduce((acc, config) => {
    acc[config.key] = config.defaultValue;
    return acc;
}, {} as Record<string, number>);

const AdjustComponent = () => {
    const [filterValues, setFilterValues] = useState(DEFAULT_VALUES);
    const [isApplying, setIsApplying] = useState(false);
    const { fabricCanvas } = useCanvasContext();

    const getActiveImage = () => {
        if (!fabricCanvas) return null;
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && activeObject.type === "image") return activeObject;
        const objects = fabricCanvas.getObjects();
        return objects.find((obj) => obj.type === "image") || null;
    };

    const onApplyReset = () => {
        setFilterValues(DEFAULT_VALUES);
        applyFilters(DEFAULT_VALUES);
    };

    const applyFilters = async (newValues: Record<string, number>): Promise<void> => {
        const imageObject = getActiveImage();
        if (!imageObject || isApplying || !fabricCanvas) return;

        setIsApplying(true);

        try {
            const filtersToApply: filters.BaseFilter<string>[] = [];

            FILTER_CONFIGS.forEach((config) => {
                const value = newValues[config.key];
                if (value !== config.defaultValue) {
                    const transformedValue = config.transform(value);
                    filtersToApply.push(
                        new config.filterClass({
                            [config.valueKey]: transformedValue,
                        })
                    );
                }
            });

            (imageObject as FabricImage).filters = filtersToApply;

            await new Promise<void>((resolve) => {
                (imageObject as FabricImage).applyFilters();
                fabricCanvas.requestRenderAll();
                setTimeout(resolve, 50);
            });
        } catch (error) {
            console.error("Error applying filters:", error);
        } finally {
            setIsApplying(false);
        }
    };

      const extractFilterValues = (imageObject: FabricObject | null) => {
        if (!imageObject || !(imageObject as FabricImage)?.filters?.length) return DEFAULT_VALUES;

    const extractedValues = { ...DEFAULT_VALUES };

    (imageObject as FabricImage).filters!.forEach((filter: filters.BaseFilter<string>) => {
      const config = FILTER_CONFIGS.find(
        (c) => c.filterClass.name === filter.constructor.name
      );
      if (config) {
        const filterValue = (filter as unknown as Record<string, number>)[config.valueKey];
        if (config.key === "hue") {
          extractedValues[config.key] = Math.round(
            filterValue * (180 / Math.PI)
          );
        } else {
          extractedValues[config.key] = Math.round(filterValue * 100);
        }
      }
    });

    return extractedValues;
  };

  useEffect(() => {
    const imageObject = getActiveImage();
    if (imageObject && (imageObject as FabricImage).filters) {
      const existingValues = extractFilterValues(imageObject);
      setFilterValues(existingValues);
    }
  }, [fabricCanvas]);


    const handleValueChange = (filterKey: string, value: number | number[]) => {
        const newValues = {
            ...filterValues,
            [filterKey]: Array.isArray(value) ? value[0] : value,
        };
        setFilterValues(newValues);
        applyFilters(newValues);
    };

    if (!fabricCanvas) {
        return (
            <div>Load an image</div>
        )
    }



    return (
        <div className='adjust-container'>
            {/* Section One - Header */}
            <div className="adjust-header">
                <CustomText variant='h4' text="Adjust Image" />
                <CustomText variant='p' text="Customize Image" />
            </div>

            {/* Section Two - Filter Controls */}
            <div className="adjust-content">
                <div className="reset-button-wrapper">
                    <CustomButton
                        variant='outline'
                        text='Reset'
                        icon={<RotateCcw />}
                        onClick={onApplyReset}
                    />
                </div>

                <div className="filters-grid">
                    {FILTER_CONFIGS.map((config) => (
                        <div key={config.key} className="filter-item">
                            <CustomSlider
                                label={`${config.label}${config.suffix ? ` ${config.suffix}` : ''}`}
                                min={config.min}
                                max={config.max}
                                value={filterValues[config.key]}
                                onChange={(value) => {
                                    handleValueChange(config.key, value)
                                }}
                                step={config.step}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdjustComponent