import React, { useEffect, useState } from 'react';
import api from "@/services/api";

// Development में सिर्फ Custom Ads दिखाएं
export default function AdUnit({ position, type = 'custom' }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!position) return;
    api.get(`/ads?position=${position}`)
      .then(({ data }) => {
        if (data.data?.length > 0) setAd(data.data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [position]);

  if (loading || !ad) return null;

  const handleClick = () => {
    api.patch(`/ads/${ad._id}/click`).catch(() => {});
    if (ad.targetUrl) window.open(ad.targetUrl, '_blank');
  };

  return (
    <div className="my-4">
      <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>विज्ञापन</p>
      <div
        onClick={handleClick}
        className="cursor-pointer rounded-xl overflow-hidden hover:opacity-95 transition-opacity shadow-sm"
      >
        <img
          src={ad.imageUrl}
          alt={ad.title || 'विज्ञापन'}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    </div>
  );
}