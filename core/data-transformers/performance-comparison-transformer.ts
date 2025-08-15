import type { PerformanceMetric } from '~/components/product/layout/performance-comparison/types';

export interface BigCommerceCustomField {
  entityId: number;
  name: string;
  value: string;
}

export interface BigCommerceCustomFields {
  edges: Array<{
    node: BigCommerceCustomField;
  }> | null;
}

export const PERFORMANCE_METRIC_KEYS = Array.from({ length: 7 }, (_, i) => `performance_metric_${i + 1}`);
export type PerformanceMetricKey = typeof PERFORMANCE_METRIC_KEYS[number];

export interface FlattenedCustomFields extends Partial<Record<PerformanceMetricKey, string>> {
  wheel_center?: string;
  wheel_radius?: string;
  wheel_ring_spacing?: string;
  wheel_colors?: string;
  performance_image_description?: string;
  image_container_scale?: string;
  image_offset_x?: string;
  image_offset_y?: string;
  image_max_width?: string;
  image_max_height?: string;
  metrics_gap_from_wheel?: string;
  metrics_line_spacing?: string;
  metrics_bar_width?: string;
  metrics_container_width?: string;
  metrics_container_height?: string;
  metrics_top_offset?: string;
  metrics_tracking_multiplier?: string;
  metrics_curve_radius_multiplier?: string;
}

export interface TransformedPerformanceData {
  metrics: PerformanceMetric[];
  wheelConfig: {
    centerX: number;
    centerY: number;
    radius: number;
    ringSpacing: number;
    pulseSpeed: number;
    baseColor: string;
    edgeColor: string;
    opacity: number;
    mobileOffsetX: number;
    mobileOffsetY: number;
  };
  metricsConfig: {
    trackingMultiplier: number;
    gapFromWheel: number;
    lineSpacing: number;
    barWidth: number;
    containerWidth: number;
    containerHeight: number;
    topOffset: number;
    curveRadiusMultiplier: number;
  };
  imageConfig: {
    containerScale: number;
    offsetX: number;
    offsetY: number;
    maxWidth: number;
    maxHeight: number;
  };
  performanceImageDescription?: string;
}

// Default configurations for fallback
const DEFAULT_WHEEL_CONFIG = {
  centerX: 750,
  centerY: 180,
  radius: 150,
  ringSpacing: 35,
  pulseSpeed: 1750,
  baseColor: 'rgba(237, 216, 98, 0.1)',
  edgeColor: 'rgba(200, 180, 50, 0.5)',
  opacity: 1,
  mobileOffsetX: 145,
  mobileOffsetY: 0,
};

// Each RGBA has 3 commas (r,g,b,a), two RGBAs = 6 commas, plus 1 separator = 7 minimum
const MIN_COMMA_COUNT_FOR_RGBA = 7;

/**
 * Parse a performance metric string from BigCommerce custom field
 * Format: "Label:Percentage:Sublabel:Value"
 * Note: Sublabel may contain commas, so we need to handle that
 */
/**
 * Parse a performance metric from a BigCommerce custom field value
 * @param {string} fieldValue - The custom field value in format "Label:Percentage:Sublabel:Value"
 * @returns {PerformanceMetric | null} Parsed PerformanceMetric object or null if invalid
 */
function parsePerformanceMetric(fieldValue: string): PerformanceMetric | null {
  if (!fieldValue || typeof fieldValue !== 'string') {
    return null;
  }

  // Split by ':' but handle commas in sublabels
  const firstColonIndex = fieldValue.indexOf(':');
  const lastColonIndex = fieldValue.lastIndexOf(':');
  
  if (firstColonIndex === -1 || lastColonIndex === -1 || firstColonIndex === lastColonIndex) {
    return null;
  }
  
  const label = fieldValue.substring(0, firstColonIndex);
  const value = fieldValue.substring(lastColonIndex + 1);
  const middlePart = fieldValue.substring(firstColonIndex + 1, lastColonIndex);
  
  // Find the percentage (should be a number)
  const percentageMatch = /^(\d{1,2}|100):(.+)$/.exec(middlePart);
  
  if (!percentageMatch) {
    return null;
  }
  
  const percentageStr = percentageMatch[1] || '';
  const sublabel = percentageMatch[2] || '';
  const percentage = parseInt(percentageStr, 10);

  if (Number.isNaN(percentage) || percentage < 0 || percentage > 100) {
    return null;
  }

  // Extract category from label (convert to lowercase, remove spaces)
  const category = label.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

  return {
    category,
    label,
    percentage,
    sublabel,
    value,
  };
}

/**
 * Parse wheel center coordinates from "x,y" format
 * @param {string} centerStr - The center coordinates in "x,y" format
 * @returns {Object} Object with centerX and centerY coordinates
 */
function parseWheelCenter(centerStr?: string): { centerX: number; centerY: number } {
  if (!centerStr) {
    return { centerX: DEFAULT_WHEEL_CONFIG.centerX, centerY: DEFAULT_WHEEL_CONFIG.centerY };
  }

  const parts = centerStr.split(',');
  
  if (parts.length !== 2) {
    return { centerX: DEFAULT_WHEEL_CONFIG.centerX, centerY: DEFAULT_WHEEL_CONFIG.centerY };
  }

  const centerX = parseInt(parts[0]?.trim() || '0', 10);
  const centerY = parseInt(parts[1]?.trim() || '0', 10);

  if (Number.isNaN(centerX) || Number.isNaN(centerY)) {    
    return { centerX: DEFAULT_WHEEL_CONFIG.centerX, centerY: DEFAULT_WHEEL_CONFIG.centerY };
  }

  return { centerX, centerY };
}

/**
 * Parse wheel colors from "baseColor,edgeColor" format
 * Note: RGBA values contain commas, so we need to handle that
 * @param {string} colorsStr - The colors string in "baseColor,edgeColor" format
 * @returns {Object} Object with baseColor and edgeColor strings
 */
function parseWheelColors(colorsStr?: string): { baseColor: string; edgeColor: string } {
  if (!colorsStr) {
    return { baseColor: DEFAULT_WHEEL_CONFIG.baseColor, edgeColor: DEFAULT_WHEEL_CONFIG.edgeColor };
  }

  // Find the middle comma that separates the two colors
  // RGBA format: rgba(r,g,b,a),rgba(r,g,b,a)
  const commaMatches = colorsStr.match(/,/g);
  const commaCount = commaMatches ? commaMatches.length : 0;
  
  if (commaCount < MIN_COMMA_COUNT_FOR_RGBA) {
    return { baseColor: DEFAULT_WHEEL_CONFIG.baseColor, edgeColor: DEFAULT_WHEEL_CONFIG.edgeColor };
  }
  
  // Find the 4th comma (the separator between colors)
  const commaIndices = [];

  for (let i = 0; i < colorsStr.length; i += 1) {
    if (colorsStr[i] === ',') {
      commaIndices.push(i);
    }
  }

  const commaIndex = commaIndices[3]; // Get the 4th comma (0-indexed)
  
  if (commaIndex === undefined) {
    return { baseColor: DEFAULT_WHEEL_CONFIG.baseColor, edgeColor: DEFAULT_WHEEL_CONFIG.edgeColor };
  }
  
  const baseColor = colorsStr.substring(0, commaIndex).trim();
  const edgeColor = colorsStr.substring(commaIndex + 1).trim();
  
  return { baseColor, edgeColor };
}

/**
 * Flatten BigCommerce custom fields from edges/nodes format to key-value pairs
 * @param {BigCommerceCustomFields} customFields - The BigCommerce custom fields in edges/nodes format
 * @returns {FlattenedCustomFields} Flattened object with field names as keys
 */
function flattenCustomFields(customFields: BigCommerceCustomFields): FlattenedCustomFields {
  const flattened: FlattenedCustomFields = {};
  
  if (!customFields.edges || customFields.edges.length === 0) {
    return flattened;
  }
  
  customFields.edges.forEach(({ node }) => {
    if (node.name && node.value) {
      Object.assign(flattened, { [node.name]: node.value });
    }
  });
  
  return flattened;
}

/**
 * Transform BigCommerce custom fields into performance comparison data
 * @param {BigCommerceCustomFields} customFields - The BigCommerce custom fields
 * @returns {TransformedPerformanceData} Transformed performance data with metrics, wheel config, and image config
 */
/**
 * Parse performance metrics from flattened fields
 * @param {FlattenedCustomFields} flattenedFields - The flattened custom fields
 * @returns {PerformanceMetric[]} Array of parsed performance metrics
 */
function parsePerformanceMetrics(flattenedFields: FlattenedCustomFields): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];

  PERFORMANCE_METRIC_KEYS.forEach((fieldName) => {
    const fieldValue = flattenedFields[fieldName];

    if (fieldValue) {
      const metric = parsePerformanceMetric(fieldValue);

      if (metric) {
        metrics.push(metric);
      }
    }
  });

  return metrics;
}

/**
 * Parse wheel configuration from flattened fields
 * @param {FlattenedCustomFields} flattenedFields - The flattened custom fields
 * @returns {Object} Wheel configuration object
 */
function parseWheelConfiguration(flattenedFields: FlattenedCustomFields) {
  const { centerX, centerY } = parseWheelCenter(flattenedFields.wheel_center);
  const radius = parseInt(flattenedFields.wheel_radius || '', 10) || DEFAULT_WHEEL_CONFIG.radius;
  const ringSpacing = parseInt(flattenedFields.wheel_ring_spacing || '', 10) || DEFAULT_WHEEL_CONFIG.ringSpacing;
  const { baseColor, edgeColor } = parseWheelColors(flattenedFields.wheel_colors);

  return {
    centerX,
    centerY,
    radius,
    ringSpacing,
    pulseSpeed: DEFAULT_WHEEL_CONFIG.pulseSpeed,
    baseColor,
    edgeColor,
    opacity: DEFAULT_WHEEL_CONFIG.opacity,
    mobileOffsetX: DEFAULT_WHEEL_CONFIG.mobileOffsetX,
    mobileOffsetY: DEFAULT_WHEEL_CONFIG.mobileOffsetY,
  };
}

/**
 * Parse image configuration from flattened fields
 * @param {FlattenedCustomFields} flattenedFields - The flattened custom fields
 * @returns {Object} Image configuration object
 */
function parseImageConfiguration(flattenedFields: FlattenedCustomFields) {
  const containerScale = flattenedFields.image_container_scale ? parseFloat(flattenedFields.image_container_scale) : 0.9;
  const offsetX = flattenedFields.image_offset_x ? parseFloat(flattenedFields.image_offset_x) : 0;
  const offsetY = flattenedFields.image_offset_y ? parseFloat(flattenedFields.image_offset_y) : 0;
  const maxWidth = flattenedFields.image_max_width ? parseFloat(flattenedFields.image_max_width) : 1800;
  const maxHeight = flattenedFields.image_max_height ? parseFloat(flattenedFields.image_max_height) : 1000;

  return {
    containerScale,
    offsetX,
    offsetY,
    maxWidth,
    maxHeight,
  };
}

/**
 * Parse metrics configuration from flattened fields
 * @param {FlattenedCustomFields} flattenedFields - The flattened custom fields
 * @returns {Object} Metrics configuration object
 */
function parseMetricsConfiguration(flattenedFields: FlattenedCustomFields) {
  const gapFromWheel = flattenedFields.metrics_gap_from_wheel ? parseFloat(flattenedFields.metrics_gap_from_wheel) : 25;
  const lineSpacing = flattenedFields.metrics_line_spacing ? parseFloat(flattenedFields.metrics_line_spacing) : 48;
  const barWidth = flattenedFields.metrics_bar_width ? parseFloat(flattenedFields.metrics_bar_width) : 350;
  const containerWidth = flattenedFields.metrics_container_width ? parseFloat(flattenedFields.metrics_container_width) : 800;
  const containerHeight = flattenedFields.metrics_container_height ? parseFloat(flattenedFields.metrics_container_height) : 1000;
  const topOffset = flattenedFields.metrics_top_offset ? parseFloat(flattenedFields.metrics_top_offset) : 0;
  const trackingMultiplier = flattenedFields.metrics_tracking_multiplier ? parseFloat(flattenedFields.metrics_tracking_multiplier) : 0.3;
  const curveRadiusMultiplier = flattenedFields.metrics_curve_radius_multiplier ? parseFloat(flattenedFields.metrics_curve_radius_multiplier) : 0.6;

  return {
    trackingMultiplier,
    gapFromWheel,
    lineSpacing,
    barWidth,
    containerWidth,
    containerHeight,
    topOffset,
    curveRadiusMultiplier,
  };
}

export function transformPerformanceComparisonData(
  customFields: BigCommerceCustomFields
): TransformedPerformanceData {
  // Flatten the custom fields first
  const flattenedFields = flattenCustomFields(customFields);
  
  // Parse all configurations
  const metrics = parsePerformanceMetrics(flattenedFields);
  const wheelConfig = parseWheelConfiguration(flattenedFields);
  const imageConfig = parseImageConfiguration(flattenedFields);
  const metricsConfig = parseMetricsConfiguration(flattenedFields);
  
  return {
    metrics,
    wheelConfig,
    metricsConfig,
    imageConfig,
    performanceImageDescription: flattenedFields.performance_image_description,
  };
}

/**
 * Find the performance image from product images based on description
 * @param {Array} images - Array of product images
 * @param {string} performanceImageDescription - Description to match against image alt text
 * @returns {Object|null} Matching image object or null if not found
 */
export function findPerformanceImage(
  images: Array<{ src: string; alt: string }>,
  performanceImageDescription?: string
): { src: string; alt: string } | null {
  if (!performanceImageDescription || images.length === 0) {
    // Fallback to first image
    return images[0] || null;
  }

  // Try exact match first
  const exactMatch = images.find(img => img.alt === performanceImageDescription);
  
  if (exactMatch) {
    return exactMatch;
  }

  // Try partial match
  const partialMatch = images.find(img => 
    img.alt.toLowerCase().includes(performanceImageDescription.toLowerCase())
  );

  if (partialMatch) {
    return partialMatch;
  }

  // Fallback to first image
  return images[0] || null;
} 