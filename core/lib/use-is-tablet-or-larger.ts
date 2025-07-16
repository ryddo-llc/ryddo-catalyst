import { useEffect, useState } from 'react';

// Returns true for tablet-sized screens (768px+) and up, false for mobile/cellphone
export function useIsTabletOrLarger(breakpoint = 768) {
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreen = () => setIsTabletOrLarger(window.innerWidth >= breakpoint);

      checkScreen();
      window.addEventListener('resize', checkScreen);
      
      return () => window.removeEventListener('resize', checkScreen);
    }
  }, [breakpoint]);

  return isTabletOrLarger;
} 