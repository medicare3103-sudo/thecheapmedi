import { useEffect } from 'react';

export default function useSEO({ title, description, keywords }) {
  useEffect(() => {
    // Save original title
    const originalTitle = document.title;
    
    // Set Title
    if (title) {
      document.title = title;
    }
    
    // Helper to update or create meta tags by name attribute
    const setMeta = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update or create meta tags by property attribute (OpenGraph)
    const setOgMeta = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Set Description
    if (description) {
      setMeta('description', description);
      setOgMeta('og:description', description);
    }

    // Set Keywords
    if (keywords) {
      setMeta('keywords', keywords);
    }

    // Cleanup: restore defaults when unmounting
    return () => {
      document.title = originalTitle;
      
      const defaultDesc = "Buy high-quality, affordable generic medicines online. The Cheap Pharma is your trusted online pharmacy portal for safe, reliable, and discreet home delivery with deals on every purchase.";
      setMeta('description', defaultDesc);
      setOgMeta('og:description', defaultDesc);
      
      // Clean up keywords when navigating away
      let kwEl = document.querySelector('meta[name="keywords"]');
      if (kwEl) {
        kwEl.remove();
      }
    };
  }, [title, description, keywords]);
}
