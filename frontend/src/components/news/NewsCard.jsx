"use client";
import React from 'react';
import Link from "next/link";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hi';

dayjs.extend(relativeTime);
dayjs.locale('hi');

const CATEGORY_LABELS = {
  trending:      'ट्रेंडिंग',
  international: 'अंतर्राष्ट्रीय',
  national:      'राष्ट्रीय',
  local:         'देश',
  sports:        'खेल',
  science:       'विज्ञान',
  environment:   'पर्यावरण',
  politics:      'राजनीति',
  business:      'व्यापार',
  technology:    'टेक',
  entertainment: 'मनोरंजन',
  health:        'स्वास्थ्य',
  education:     'शिक्षा',
  lifestyle:     'जीवनशैली',
  opinion:       'राय',
  'reader-news': 'पाठक समाचार',
};

export default function NewsCard({ news, size = 'normal' }) {
  if (!news) return null;

  const mainImage = news.images?.find(img => img.isMain) || news.images?.[0];
  const categoryLabel = CATEGORY_LABELS[news.category] || news.category;

  /* ── Large Card ── */
  if (size === 'large') {
    return (
      <Link href={`/news/${news.slug}`}
        className="group block bg-white overflow-hidden transition-shadow duration-300"
        style={{ border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
      >
        {mainImage ? (
          <div className="relative overflow-hidden" style={{ height: 220 }}>
            <img
              src={mainImage.url}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />

            {/* Category tag */}
            <div className="absolute top-3 left-3">
              <span style={{ background: '#DC2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {categoryLabel}
              </span>
            </div>

            {/* Headline over image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.35 }} className="line-clamp-2">
                {news.title}
              </h2>
              <div className="flex items-center gap-3 mt-2" style={{ fontSize: 11 }}>
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>{news.authorName || 'संपादक'}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{dayjs(news.publishedAt).fromNow()}</span>
              </div>
            </div>
          </div>
        ) : (
          /* No image fallback */
          <div className="p-5">
            <span style={{ background: '#DC2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase' }}>
              {categoryLabel}
            </span>
            <h2 style={{ fontWeight: 700, fontSize: 18, marginTop: 10, color: '#0F172A', lineHeight: 1.35 }} className="line-clamp-3 group-hover:text-[#DC2626] transition-colors">
              {news.title}
            </h2>
          </div>
        )}

        <div className="p-4">
          <p className="font-description line-clamp-2" style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
            {news.summary}
          </p>
          <div className="flex items-center justify-between mt-3" style={{ fontSize: 11, color: '#94A3B8' }}>
            <span>{news.authorName || 'संपादक'}</span>
            <span>{dayjs(news.publishedAt).fromNow()}</span>
          </div>
        </div>
      </Link>
    );
  }

  /* ── Normal / Small Card ── */
  return (
    <Link href={`/news/${news.slug}`}
      className="group flex gap-3 bg-white p-3 transition-shadow"
      style={{ border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.09)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'}
    >
      {mainImage && (
        <div style={{ width: 88, height: 72, flexShrink: 0, borderRadius: 6, overflow: 'hidden' }}>
          <img
            src={mainImage.url}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span style={{ color: '#DC2626', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {categoryLabel}
        </span>
        <h3 style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.4, marginTop: 3 }}
          className="line-clamp-2 group-hover:text-[#DC2626] transition-colors">
          {news.title}
        </h3>
        <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
          {dayjs(news.publishedAt).fromNow()}
        </p>
      </div>
    </Link>
  );
}