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
 * // Returns: 'text-[clamp(1.5rem,5vw,3rem)] @sm:text-[clamp(2.5rem,7vw,5rem)] @md:text-[clamp(4rem,10vw,7rem)] @lg:text-[clamp(6rem,12vw,10rem)]'
 * 
 * // Long product name  
 * getFluidBackgroundTextSize('Super73-S2 Electric Adventure Bike');
 * // Returns: 'text-[clamp(1rem,3vw,2rem)] @sm:text-[clamp(1.5rem,4vw,3rem)] @md:text-[clamp(2rem,6vw,4rem)] @lg:text-[clamp(2.5rem,8vw,5rem)]'
 * ```
 */
export function getFluidBackgroundTextSize(text: string): string {
  // Very long text (15+ chars): Conservative mobile sizing with clamp minimums
  if (text.length > 15) {
    return "text-[clamp(1rem,3vw,2rem)] @sm:text-[clamp(1.5rem,4vw,3rem)] @md:text-[clamp(2rem,6vw,4rem)] @lg:text-[clamp(2.5rem,8vw,5rem)]";
  }
  
  // Medium text (10-15 chars): Balanced responsive scaling  
  if (text.length > 10) {
    return "text-[clamp(1.2rem,4vw,2.5rem)] @sm:text-[clamp(2rem,6vw,4rem)] @md:text-[clamp(3rem,8vw,6rem)] @lg:text-[clamp(4rem,10vw,8rem)]";
  }
  
  // Short text (≤10 chars): Maximum impact sizing for short names
  return "text-[clamp(1.5rem,5vw,3rem)] @sm:text-[clamp(2.5rem,7vw,5rem)] @md:text-[clamp(4rem,10vw,7rem)] @lg:text-[clamp(6rem,12vw,10rem)]";
}

