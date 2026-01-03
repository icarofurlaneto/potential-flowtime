import { useEffect } from 'react';

export function useFavicon() {
  useEffect(() => {
    // White version of CheckCircle (Lucide style)
    const svgTemplate = `
      <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `;
    const encodedSvg = encodeURIComponent(svgTemplate);
    const dataUri = `data:image/svg+xml;utf8,${encodedSvg}`;
    
    const link = (document.querySelector("link[rel*='icon']") || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = dataUri;
    
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);
}
