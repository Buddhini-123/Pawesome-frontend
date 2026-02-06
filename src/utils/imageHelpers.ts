/**
 * Image optimization helpers for the Pawesome frontend
 */

interface ImageSource {
  srcSet: string;
  type: string;
  media?: string;
}

interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  basePath: string,
  sizes: { width: number; suffix: string }[]
): string {
  return sizes
    .map(({ width, suffix }) => {
      const path = basePath.replace(/\.[^.]+$/, `${suffix}.$1`);
      return `${path} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate picture sources for different formats
 */
export function generatePictureSources(
  basePath: string,
  formats: string[] = ['webp', 'jpg']
): ImageSource[] {
  const sources: ImageSource[] = [];
  
  formats.forEach((format) => {
    if (format === 'webp') {
      sources.push({
        srcSet: basePath.replace(/\.[^.]+$/, '.webp'),
        type: 'image/webp',
      });
    }
  });
  
  return sources;
}

/**
 * Get optimized image path based on viewport
 */
export function getOptimizedImagePath(
  basePath: string,
  viewport: 'mobile' | 'tablet' | 'desktop'
): string {
  const suffixes = {
    mobile: '-sm',
    tablet: '-md',
    desktop: '-lg',
  };
  
  return basePath.replace(/\.[^.]+$/, `${suffixes[viewport]}.$1`);
}

/**
 * Calculate aspect ratio for preventing layout shift
 */
export function calculateAspectRatio(width: number, height: number): string {
  return `${(height / width) * 100}%`;
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
  dominantColor: string = '#e5e7eb'
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(
    dominantColor
  )}' filter='url(%23b)'/%3E%3C/svg%3E`;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get image dimensions from URL
 */
export function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Convert image URL to use CDN
 */
export function getCDNUrl(
  originalUrl: string,
  cdnBase: string = 'https://cdn.pawesome.com'
): string {
  // If already using CDN or is external URL, return as is
  if (originalUrl.startsWith('http') || originalUrl.startsWith('//')) {
    return originalUrl;
  }
  
  // Remove leading slash if present
  const path = originalUrl.startsWith('/') ? originalUrl.slice(1) : originalUrl;
  
  return `${cdnBase}/${path}`;
}

/**
 * Generate responsive sizes attribute
 */
export function generateSizes(
  breakpoints: { maxWidth: number; size: string }[]
): string {
  return breakpoints
    .map(({ maxWidth, size }) => `(max-width: ${maxWidth}px) ${size}`)
    .join(', ');
}

/**
 * Optimize image URL with query parameters
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format) params.append('fm', options.format);
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Extract dominant color from image (requires Canvas API)
 */
export async function extractDominantColor(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      const pixelCount = data.length / 4;
      
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Image loading states
 */
export enum ImageLoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Custom hook for image loading state
 */
export function useImageLoader(src: string) {
  const [state, setState] = React.useState<ImageLoadingState>(
    ImageLoadingState.IDLE
  );
  
  React.useEffect(() => {
    if (!src) return;
    
    setState(ImageLoadingState.LOADING);
    
    const img = new Image();
    
    img.onload = () => {
      setState(ImageLoadingState.SUCCESS);
    };
    
    img.onerror = () => {
      setState(ImageLoadingState.ERROR);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  return state;
}

// Note: React import would be needed for the hook
import React from 'react';