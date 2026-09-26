"use client";
import React, { useState, useEffect } from 'react';
import api from '@/services/api';

export default function WebStoriesStrip() {
  const [stories, setStories] = useState([]);
  
  useEffect(() => {
    api.get('/web-stories')
      .then(res => setStories(res.data.data))
      .catch(console.error);
  }, []);

  if (stories.length === 0) return null;

  return (
    <div className="w-full bg-white mb-6 py-4 px-2" style={{ borderBottom: '1px solid #E2E8F0' }}>
      <div className="flex items-center gap-2 mb-3 px-2">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        <h2 style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>वेब स्टोरीज</h2>
      </div>
      <div className="overflow-x-auto flex gap-3 pb-2 scrollbar-none px-2" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {stories.map(story => (
          <a 
            key={story._id} 
            href={story.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-28 h-44 rounded-xl relative overflow-hidden flex-shrink-0 cursor-pointer group ring-2 ring-red-600 ring-offset-1`}
            style={{ scrollSnapAlign: 'start' }}
          >
            <img 
              src={story.thumbnailUrl} 
              alt={story.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-white font-bold text-xs leading-snug line-clamp-2 drop-shadow-sm">
                {story.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
