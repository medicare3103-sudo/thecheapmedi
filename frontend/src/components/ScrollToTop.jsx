import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Formulate the preferred canonical URL
    const canonicalUrl = 'https://thecheappharma.com' + pathname;

    // 1. Manage canonical link tag in head
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 2. Manage og:url meta tag
    let ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (!ogUrlEl) {
      ogUrlEl = document.createElement('meta');
      ogUrlEl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlEl);
    }
    ogUrlEl.setAttribute('content', canonicalUrl);

    // 3. Fix og:image domain to point to production instead of vercel.app
    let ogImageEl = document.querySelector('meta[property="og:image"]');
    if (ogImageEl) {
      const content = ogImageEl.getAttribute('content');
      if (content && content.includes('vercel.app')) {
        ogImageEl.setAttribute('content', content.replace(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/, 'https://thecheappharma.com'));
      }
    }

    // 4. Fix twitter:image domain
    let twitterImageEl = document.querySelector('meta[name="twitter:image"]');
    if (twitterImageEl) {
      const content = twitterImageEl.getAttribute('content');
      if (content && content.includes('vercel.app')) {
        twitterImageEl.setAttribute('content', content.replace(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/, 'https://thecheappharma.com'));
      }
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
