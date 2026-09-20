"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending } from "@/store/slice/NewsSlice";
import NewsCard from "@/components/news/NewsCard";
import { Flame } from 'lucide-react';

export default function TrendingPage() {
  const dispatch = useDispatch();
  const { trending } = useSelector(state => state?.news || {});

  useEffect(() => { dispatch(fetchTrending()); }, [dispatch]);

  return (
    <>
      

      {/* Section heading */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 4, height: 26, background: '#DC2626', borderRadius: 2, flexShrink: 0 }} />
          <h1 style={{ fontWeight: 900, fontSize: 22, color: '#0F172A', margin: 0 }}>
            <Flame size={22} color="#0F172A" /> ट्रेंडिंग समाचार
          </h1>
        </div>
        <div style={{ height: 1, background: '#E2E8F0', marginLeft: 14 }} />
      </div>

      {trending.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Flame size={48} color="#94A3B8" />
          </div>
          <p style={{ color: '#94A3B8', fontSize: 15 }}>अभी कोई ट्रेंडिंग समाचार नहीं है।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {trending.map((item, i) => (
            <div key={item._id} style={{ position: 'relative' }}>
              {/* Rank badge */}
              <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 10,
                width: 30, height: 30,
                background: i === 0 ? '#DC2626' : '#0F172A',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 13,
                fontFamily: "'Inter', system-ui, sans-serif",
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                border: i === 0 ? '2px solid rgba(255,255,255,0.3)' : '2px solid #1E293B',
              }}>
                {i + 1}
              </div>
              <NewsCard news={item} size="large" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

