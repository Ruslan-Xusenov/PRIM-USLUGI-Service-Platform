'use client';
import { useState, useEffect, useRef } from 'react';

export default function DeferredRender({ children, threshold = 0.1, delay = 0 }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, just render after delay
    if (!window.IntersectionObserver) {
      const timer = setTimeout(() => setShouldRender(true), delay || 100);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (delay) {
            setTimeout(() => setShouldRender(true), delay);
          } else {
            setShouldRender(true);
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Fallback: render anyway after 3 seconds so search engines/users scrolling fast don't miss it
    const fallback = setTimeout(() => {
      setShouldRender(true);
      observer.disconnect();
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold, delay]);

  return (
    <div ref={ref}>
      {shouldRender ? children : <div style={{ minHeight: '100px' }} />}
    </div>
  );
}
