import { useState, useEffect } from 'react';
import { getDestinationImage } from '../services/imageService';

export default function PlaceImage({ placeName, className, alt }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    if (!placeName) {
      setSrc('/images/default-trip.jpg');
      setLoading(false);
      return;
    }

    setLoading(true);
    getDestinationImage(placeName).then((url) => {
      if (mounted) {
        setSrc(url);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setSrc('/images/default-trip.jpg');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [placeName]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`} />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt || placeName || "Location snapshot"} 
      loading="lazy" 
      className={className} 
    />
  );
}
