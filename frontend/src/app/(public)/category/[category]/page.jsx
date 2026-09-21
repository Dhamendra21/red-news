"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from "@/store/slice/NewsSlice";
import NewsCard from "@/components/news/NewsCard";
import { Newspaper } from 'lucide-react';

import AdUnit from "@/components/common/AdUnit";

const CAT_NAMES = {
  trending:      'ट्रेंडिंग',
  international: 'अंतर्राष्ट्रीय',
  national:      'राष्ट्रीय',
  local:         'देश',
  sports:        'खेल',
  science:       'विज्ञान',
  environment:   'पर्यावरण',
  'reader-news': 'पाठक समाचार',
  politics:      'राजनीति',
  entertainment: 'मनोरंजन',
  technology:    'टेक',
  health:        'स्वास्थ्य',
  business:      'व्यापार',
  world:         'विश्व',
  education:     'शिक्षा',
  lifestyle:     'जीवनशैली',
  travel:        'यात्रा',
  food:          'भोजन',
  opinion:       'राय',
};

export default function CategoryPage() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { list: news, isLoading } = useSelector(state => state?.news || {});
  const catName = CAT_NAMES[category] || category;

  useEffect(() => {
    dispatch(fetchNews({ category, limit: 20 }));
  }, [category, dispatch]);

  return (
    <>
      

      {/* Section heading */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 4, height: 26, background: '#DC2626', borderRadius: 2, flexShrink: 0 }} />
          <h1 style={{ fontWeight: 900, fontSize: 22, color: '#0F172A', margin: 0 }}>
            {catName} समाचार
          </h1>
          <span style={{
            background: '#DC2626', color: '#fff',
            fontSize: 10, fontWeight: 800, padding: '3px 10px',
            borderRadius: 3, letterSpacing: '0.06em', textTransform: 'uppercase',
            marginLeft: 4, alignSelf: 'center',
          }}>
            {catName.toUpperCase()}
          </span>
        </div>
        <div style={{ height: 1, background: '#E2E8F0', marginLeft: 14 }} />
      </div>

      <AdUnit position="category-top" />

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
          <div className="spinner-red" />
          <p style={{ color: '#94A3B8', fontSize: 14 }}>समाचार लोड हो रहे हैं...</p>
        </div>
      ) : (
        <>
          {news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <Newspaper size={48} color="#94A3B8" />
              </div>
              <p style={{ color: '#94A3B8', fontSize: 15 }}>इस वर्ग में अभी कोई समाचार नहीं है।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {news.map(item => (
                <NewsCard key={item._id} news={item} size="large" />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
