import { useEffect, useState } from 'react';

export function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkScreen = () => setIsDesktop(window.innerWidth >= breakpoint);

      checkScreen();
      window.addEventListener('resize', checkScreen);

      return () => window.removeEventListener('resize', checkScreen);
    }
  }, [breakpoint]);

  return isDesktop;
} 