import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If an anchor hash exists (e.g., #reviews or #reviews-section), scroll to it
    if (hash) {
      const targetId = hash.replace("#", "");
      const scrollToHashElement = () => {
        const element =
          document.getElementById(targetId) ||
          document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (!scrollToHashElement()) {
        const timer = setTimeout(scrollToHashElement, 150);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Default: Reset scroll to top on route / param change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Also reset any custom layout/page scrolling containers if present
    const scrollContainers = document.querySelectorAll(
      "#root, main, .admin-main, .admin-content, [data-scroll-container]"
    );
    scrollContainers.forEach((el) => {
      if (el && el.scrollTop > 0) {
        el.scrollTop = 0;
      }
    });
  }, [pathname, search, hash]);

  return null;
}
