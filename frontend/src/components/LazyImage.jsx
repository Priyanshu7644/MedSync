import React, { useState } from 'react';

const DEFAULT_AVATAR = 'https://res.cloudinary.com/ogxk13pp/image/upload/v1790024351/medsync_doctors/default_faceless_doctor.jpg';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  containerClassName = '', 
  fallback = DEFAULT_AVATAR,
  showSkeleton = true,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error || !src ? fallback : src;

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Shimmer Skeleton Placeholder while loading */}
      {showSkeleton && !loaded && (
        <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/5 via-emerald-600/10 to-emerald-900/5 dark:from-emerald-400/5 dark:via-emerald-400/15 dark:to-emerald-400/5 animate-pulse flex items-center justify-center'>
          <svg className='w-6 h-6 text-emerald-600/30 dark:text-emerald-400/30 animate-pulse' fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        src={imgSrc}
        alt={alt || 'Image'}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoaded(true);
          }
        }}
        className={`transition-all duration-500 ease-out ${
          loaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-95 blur-[2px]'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
