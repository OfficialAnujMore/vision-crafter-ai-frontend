import { useEffect, useState } from 'react'
import CustomButton from '../CustomComponents/CustomButton';
import { RotateCcw, Sun, Contrast, Droplets, Sparkles, CloudFog, Palette, ImageOff } from 'lucide-react';
import CustomText from '../CustomComponents/CustomText';
import { filters, FabricImage } from "fabric";
import { useCanvasContext } from '../../context/canvasContext';
import CustomSlider from '../CustomComponents/CustomSlider';
import { FabricObject } from 'fabric';
import Divider from '../Divider';
import '../../styles/FeatureComponents/AdjustComponent.css';
import { buttonVariants } from '../../constants/buttonVariants';


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
    icon: React.ReactNode;
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
        icon: <Sun size={16} />,
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
        icon: <Contrast size={16} />,
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
        icon: <Droplets size={16} />,
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
        icon: <Sparkles size={16} />,
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
        icon: <CloudFog size={16} />,
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
        icon: <Palette size={16} />,
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
        if (!fabricCanvas) return
        setFilterValues(DEFAULT_VALUES);
        applyFilters(DEFAULT_VALUES);
        fabricCanvas.fire('object:modified');
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
            fabricCanvas.fire('object:modified');
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
            <div className="adjust-empty">
                <ImageOff size={40} className="adjust-empty-icon" />
                <CustomText variant="p" text="Load an image to adjust" />
            </div>
        )
    }

    const hasModifications = Object.entries(filterValues).some(
        ([key, val]) => val !== DEFAULT_VALUES[key]
    );

    return (
        <div className='adjust-container'>
            <div className="adjust-header">
                <div className="adjust-header-actions">
                    <CustomText variant='h4' text="Adjust Image" />
                    {hasModifications && (
                        <CustomButton
                            variant={buttonVariants.icon}
                            // text='Reset'
                            icon={<RotateCcw size={18} />}
                            onClick={onApplyReset}
                        />
                    )}
                </div>
                <CustomText variant='p' text="Fine-tune brightness, contrast, and more" fontSize="0.85rem" />
            </div>

            <Divider />

            <div className="adjust-filters">
                {FILTER_CONFIGS.map((config) => {
                    const isModified = filterValues[config.key] !== config.defaultValue;
                    return (
                        <div
                            key={config.key}
                            className={`adjust-filter-card${isModified ? ' adjust-filter-card--modified' : ''}`}
                        >
                            <div className="adjust-filter-label">
                                <span className="adjust-filter-icon">{config.icon}</span>
                                <CustomText
                                    variant="p"
                                    text={`${config.label}${config.suffix ? ` ${config.suffix}` : ''}`}
                                    fontSize="0.85rem"
                                />
                            </div>
                            <CustomSlider
                                label=""
                                min={config.min}
                                max={config.max}
                                value={filterValues[config.key]}
                                onChange={(value) => handleValueChange(config.key, value)}
                                step={config.step}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default AdjustComponent
