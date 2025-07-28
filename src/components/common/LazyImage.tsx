import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // For above-the-fold images
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder,
  srcSet,
  sizes,
  onLoad,
  onError,
  objectFit = 'cover',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Preload image when in view
  useEffect(() => {
    if (!isInView || isLoaded) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setError(true);
      onError?.();
    };

    // Set srcset if provided
    if (srcSet) {
      img.srcset = srcSet;
    }
    
    img.src = src;
  }, [isInView, src, srcSet, isLoaded, onLoad, onError]);

  // Generate blur placeholder data URL
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    // Return a default blur placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTIiIC8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiIGZpbHRlcj0idXJsKCNhKSIgLz48L3N2Zz4=';
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && !error && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `url(${getPlaceholder()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <span className="text-4xl mb-2">🖼️</span>
            <p className="text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !error && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          srcSet={srcSet}
          sizes={sizes}
          width={width}
          height={height}
          className={`w-full h-full object-${objectFit}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Loading Shimmer Effect */}
      {!isLoaded && !error && isInView && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
};

// Picture component for responsive images with multiple formats
interface ResponsiveImageProps extends Omit<LazyImageProps, 'srcSet'> {
  sources?: Array<{
    srcSet: string;
    type: string;
    media?: string;
  }>;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  sources = [],
  src,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [props.priority]);

  return (
    <div ref={containerRef}>
      {isInView ? (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              media={source.media}
            />
          ))}
          <LazyImage src={src} {...props} />
        </picture>
      ) : (
        <div
          className={props.className}
          style={{
            width: props.width,
            height: props.height,
            backgroundColor: '#f3f4f6',
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;