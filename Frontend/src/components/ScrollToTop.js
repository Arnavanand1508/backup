import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component scrolls the window to the top every time the route changes.
 * It uses the `useLocation` hook to detect a change in the URL's pathname.
 * The `useEffect` hook then triggers the `window.scrollTo(0, 0)` command.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "document.documentElement.scrollTo" is the most reliable way to scroll
    // to the top of the page, working across all modern browsers.
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Optional: Use "auto" to skip smooth scrolling
    });
  }, [pathname]);

  return null; // This component does not render any visible UI
}

export default ScrollToTop;
