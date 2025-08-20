/**
 * Dynamic Text Sizing Utility
 * 
 * Provides responsive text sizing classes based on content length and screen size.
 * Optimized for background text, hero text, and display typography.
 */

export interface ResponsiveTextConfig {
  /** Base text size for mobile */
  base: string;
  /** Small mobile (480px+) */
  xs?: string;
  /** Tablet portrait (640px+) */
  sm?: string;
  /** Tablet landscape (768px+) */
  md?: string;
  /** Desktop (1024px+) */
  lg?: string;
  /** Large desktop (1280px+) */
  xl?: string;
  /** Extra large desktop (1536px+) */
  '2xl'?: string;
  /** Ultra wide (1920px+) */
  '3xl'?: string;
}

/**
 * Generate responsive text size classes based on content length
 * 
 * @param {string} [text] - The text content to size (used for length calculation)
 * @param {object} [options] - Configuration options
 * @returns {string} Tailwind CSS classes for responsive text sizing
 * 
 * @example
 * ```typescript
 * // Short product name
 * calculateResponsiveTextClasses('BMW'); 
 * // Returns: 'text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] 2xl:text-[13rem] 3xl:text-[15rem]'
 * 
 * // Long product name  
 * calculateResponsiveTextClasses('Super73-S2 Electric Adventure Bike');
 * // Returns: 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl'
 * ```
 */
export function calculateResponsiveTextClasses(
  text?: string,
  options: { 
    /** Minimum font size (prevents text from getting too small) */
    minSize?: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
    /** Maximum font size (prevents text from getting too large) */
    maxSize?: string;
    /** Use viewport-relative sizing for ultra-responsive behavior */
    useViewportSizing?: boolean;
  } = {}
): string {
  if (!text) {
    return generateSizeClasses(getConfigForLength(15), options); // Default medium size
  }

  const textLength = text.length;
  const config = getConfigForLength(textLength);
  
  return generateSizeClasses(config, options);
}

/**
 * Get responsive positioning classes for background text
 * 
 * @param {('short'|'medium'|'tall')} [containerHeight='medium'] - Height context ('short' | 'medium' | 'tall')
 * @returns {string} Tailwind CSS classes for responsive positioning
 */
export function getResponsivePositioning(
  containerHeight: 'short' | 'medium' | 'tall' = 'medium'
): string {
  const positioningMap = {
    short: 'mt-16 xs:mt-20 sm:mt-24 md:mt-28 lg:mt-32 xl:mt-36 2xl:mt-40',
    medium: 'mt-20 xs:mt-24 sm:mt-32 md:mt-40 lg:mt-48 xl:mt-56 2xl:mt-64',
    tall: 'mt-24 xs:mt-32 sm:mt-40 md:mt-52 lg:mt-64 xl:mt-72 2xl:mt-80'
  };

  return positioningMap[containerHeight];
}

/**
 * Get diagonal-aware positioning that follows the clipPath diagonal
 * Positions text along the diagonal break between colored and white sections
 * Based on clipPath: 'polygon(0 0, 160% 0, 0 60%)'
 * 
 * @param {('start'|'center'|'end')} [alignment='center'] - Where along the diagonal to position ('start' | 'center' | 'end')
 * @returns {string} Tailwind CSS classes for diagonal positioning
 */
export function getDiagonalPositioning(
  alignment: 'start' | 'center' | 'end' = 'center'
): string {
  const positioningMap = {
    // Position near the top-left of diagonal (20% down the slope)
    start: 'top-[15%] left-[5%] xs:top-[18%] xs:left-[8%] sm:top-[20%] sm:left-[12%] md:top-[22%] md:left-[15%] lg:top-[25%] lg:left-[18%] xl:top-[28%] xl:left-[20%] 2xl:top-[30%] 2xl:left-[22%]',
    
    // Position at the middle of diagonal (40% down the slope)  
    center: 'top-[25%] left-[10%] xs:top-[28%] xs:left-[12%] sm:top-[30%] sm:left-[15%] md:top-[32%] md:left-[18%] lg:top-[35%] lg:left-[20%] xl:top-[38%] xl:left-[22%] 2xl:top-[40%] 2xl:left-[25%]',
    
    // Position near the bottom of diagonal (55% down the slope)
    end: 'top-[35%] left-[15%] xs:top-[38%] xs:left-[18%] sm:top-[40%] sm:left-[20%] md:top-[42%] md:left-[22%] lg:top-[45%] lg:left-[25%] xl:top-[48%] xl:left-[28%] 2xl:top-[50%] 2xl:left-[30%]'
  };

  return positioningMap[alignment];
}

/**
 * Get text configuration based on character length
 * @param {number} length - Character length of the text
 * @returns {ResponsiveTextConfig} Configuration object with responsive text sizes
 */
function getConfigForLength(length: number): ResponsiveTextConfig {
  // Very short names (1-6 chars): Largest sizes - significantly bigger
  if (length <= 6) {
    return {
      base: 'text-6xl',
      xs: 'text-7xl',
      sm: 'text-8xl', 
      md: 'text-9xl',
      lg: 'text-[10rem]',
      xl: 'text-[14rem]',
      '2xl': 'text-[16rem]',
      '3xl': 'text-[18rem]'
    };
  }
  
  // Short names (7-12 chars): Large sizes - bumped up
  if (length <= 12) {
    return {
      base: 'text-5xl',
      xs: 'text-6xl',
      sm: 'text-7xl',
      md: 'text-8xl', 
      lg: 'text-9xl',
      xl: 'text-[12rem]',
      '2xl': 'text-[14rem]',
      '3xl': 'text-[16rem]'
    };
  }
  
  // Medium names (13-20 chars): Medium-large sizes - increased
  if (length <= 20) {
    return {
      base: 'text-4xl',
      xs: 'text-5xl',
      sm: 'text-6xl',
      md: 'text-7xl',
      lg: 'text-8xl', 
      xl: 'text-[10rem]',
      '2xl': 'text-[12rem]',
      '3xl': 'text-[14rem]'
    };
  }
  
  // Long names (21-30 chars): Medium sizes - scaled up
  if (length <= 30) {
    return {
      base: 'text-3xl',
      xs: 'text-4xl',
      sm: 'text-5xl',
      md: 'text-6xl',
      lg: 'text-7xl',
      xl: 'text-8xl',
      '2xl': 'text-9xl',
      '3xl': 'text-[10rem]'
    };
  }
  
  // Very long names (31-45 chars): Smaller but still bigger than before
  if (length <= 45) {
    return {
      base: 'text-2xl',
      xs: 'text-3xl', 
      sm: 'text-4xl',
      md: 'text-5xl',
      lg: 'text-6xl',
      xl: 'text-7xl',
      '2xl': 'text-8xl',
      '3xl': 'text-9xl'
    };
  }
  
  // Extra long names (46+ chars): Smallest but still readable
  return {
    base: 'text-xl',
    xs: 'text-2xl',
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl', 
    xl: 'text-6xl',
    '2xl': 'text-7xl',
    '3xl': 'text-8xl'
  };
}

/**
 * Generate the final class string from configuration
 * @param {ResponsiveTextConfig} config - The responsive text configuration
 * @param {object} [options] - Additional sizing options
 * @returns {string} Tailwind CSS classes for text sizing
 */
function generateSizeClasses(
  config: ResponsiveTextConfig, 
  options: {
    minSize?: string;
    maxSize?: string;
    useViewportSizing?: boolean;
  }
): string {
  const classes: string[] = [];
  
  // Base size
  classes.push(config.base);
  
  // Add responsive sizes
  if (config.xs) classes.push(`xs:${config.xs}`);
  if (config.sm) classes.push(`sm:${config.sm}`);
  if (config.md) classes.push(`md:${config.md}`);
  if (config.lg) classes.push(`lg:${config.lg}`);
  if (config.xl) classes.push(`xl:${config.xl}`);
  if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
  if (config['3xl']) classes.push(`3xl:${config['3xl']}`);
  
  // Apply viewport sizing if requested
  if (options.useViewportSizing) {
    classes.push('leading-none'); // Tighter line height for viewport sizing
  }
  
  return classes.join(' ');
}

/**
 * Predefined configurations for common use cases
 */
export const textSizePresets = {
  /** 
   * Hero text that should be very prominent
   * @param {string} [text] - The text content to size
   * @returns {string} Tailwind CSS classes for hero text
   */
  hero: (text?: string) => calculateResponsiveTextClasses(text, { useViewportSizing: true }),
  
  /** 
   * Background watermark text
   * @param {string} [text] - The text content to size
   * @returns {string} Tailwind CSS classes for watermark text
   */
  watermark: (text?: string) => calculateResponsiveTextClasses(text),
  
  /** 
   * Display text for headings
   * @param {string} [text] - The text content to size
   * @returns {string} Tailwind CSS classes for display text
   */
  display: (text?: string) => calculateResponsiveTextClasses(text, { minSize: 'text-xl' }),
  
  /** 
   * Compact text for tight spaces
   * @param {string} [text] - The text content to size
   * @returns {string} Tailwind CSS classes for compact text
   */
  compact: (text?: string) => calculateResponsiveTextClasses(text, { maxSize: 'text-6xl' })
} as const;