/**
 * Dynamic Text Sizing Utility
 * 
 * Provides responsive text sizing classes based on content length and screen size.
 * Optimized for background text, hero text, and display typography.
 */


/**
 * Get mobile-optimized background text sizing using clamp() for fluid responsiveness
 * Optimized for container queries and mobile-first approach
 * 
 * @param {string} text - The text content to size (used for length calculation)
 * @returns {string} Tailwind CSS classes with clamp-based responsive text sizing
 * 
 * @example
 * ```typescript
 * // Short product name
 * getFluidBackgroundTextSize('BMW'); 
 * // Returns: 'text-[clamp(3rem,8vw,6rem)] @sm:text-[clamp(5rem,12vw,10rem)] @md:text-[clamp(8rem,16vw,14rem)] @lg:text-[clamp(12rem,20vw,20rem)]'
 * 
 * // Long product name  
 * getFluidBackgroundTextSize('Super73-S2 Electric Adventure Bike');
 * // Returns: 'text-[clamp(2rem,6vw,4rem)] @sm:text-[clamp(3rem,8vw,6rem)] @md:text-[clamp(4rem,12vw,8rem)] @lg:text-[clamp(6rem,16vw,12rem)]'
 * ```
 */
export function getFluidBackgroundTextSize(text: string): string {
  // Very long text (15+ chars): Larger sizing for better visibility
  if (text.length > 15) {
    return "text-[clamp(2rem,6vw,4rem)] @sm:text-[clamp(3rem,8vw,6rem)] @md:text-[clamp(4rem,12vw,8rem)] @lg:text-[clamp(6rem,16vw,12rem)]";
  }
  
  // Medium text (10-15 chars): Enhanced responsive scaling  
  if (text.length > 10) {
    return "text-[clamp(2.5rem,7vw,5rem)] @sm:text-[clamp(4rem,10vw,8rem)] @md:text-[clamp(6rem,14vw,12rem)] @lg:text-[clamp(8rem,18vw,16rem)]";
  }
  
  // Short text (≤10 chars): Maximum impact sizing for short names
  return "text-[clamp(3rem,8vw,6rem)] @sm:text-[clamp(5rem,12vw,10rem)] @md:text-[clamp(8rem,16vw,14rem)] @lg:text-[clamp(12rem,20vw,20rem)]";
}

