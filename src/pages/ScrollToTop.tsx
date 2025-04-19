import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop(): null { // Return type is null
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the window (0, 0 coordinates)
    window.scrollTo(0, 0);
  }, [pathname]); // Run only once on initial render

  return null; // Return null to avoid rendering anything
}

export default ScrollToTop;