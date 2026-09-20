import React, { useEffect, useState } from 'react';
import api from "@/services/api";

// Development में सिर्फ Custom Ads दिखाएं
export default function AdUnit({ position, type = 'custom' }) {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ads for this position
  useEffect(() => {
    if (!position) return;
    api.get(`/ads?position=${position}`)
      .then(({ data }) => {
        if (data.data?.length > 0) {
          setAds(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [position]);

  // Set up carousel rotation if there are multiple ads
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  if (loading || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const handleClick = () => {
    api.patch(`/ads/${currentAd._id}/click`).catch(() => {});
    if (currentAd.targetUrl) window.open(currentAd.targetUrl, '_blank');
  };

  return (
    <div className="my-4">
      <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        विज्ञापन
      </p>
      
      {/* Relative container to handle absolute positioned images for smooth fading */}
      <div 
        onClick={handleClick}
        className="relative cursor-pointer rounded-xl overflow-hidden hover:opacity-95 shadow-sm group bg-slate-50 w-full"
      >
        {ads.map((ad, index) => (
          <img
            key={ad._id}
            src={ad.imageUrl}
            alt={ad.title || 'विज्ञापन'}
            className={`w-full h-auto transition-opacity duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 relative z-10' 
                : 'opacity-0 absolute inset-0 z-0'
            }`}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
        
        {/* Indicators for multiple ads */}
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {ads.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}