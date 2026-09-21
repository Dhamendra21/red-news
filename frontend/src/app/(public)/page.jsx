"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchNews, fetchTrending } from "@/store/slice/NewsSlice";
import NewsCard from "@/components/news/NewsCard";
import { Landmark, Trophy, Laptop, TrendingUp, Activity, Microscope, Leaf, Film, Newspaper, PenTool, Flame } from 'lucide-react';
import AdUnit from "@/components/common/AdUnit";

/* ── Category quick-access data ── */
const QUICK_CATEGORIES = [
  { id: 'politics',  name: 'राजनीति',    icon: <Landmark size={28} /> },
  { id: 'sports',    name: 'खेल',        icon: <Trophy size={28} /> },
  { id: 'technology',name: 'टेक',        icon: <Laptop size={28} /> },
  { id: 'business',  name: 'व्यापार',    icon: <TrendingUp size={28} /> },
  { id: 'health',    name: 'स्वास्थ्य',  icon: <Activity size={28} /> },
  { id: 'science',   name: 'विज्ञान',    icon: <Microscope size={28} /> },
  { id: 'environment',name:'पर्यावरण',   icon: <Leaf size={28} /> },
  { id: 'entertainment',name:'मनोरंजन',  icon: <Film size={28} /> },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { list: news, trending, isLoading } = useSelector(state => state?.news || {});

  useEffect(() => {
    dispatch(fetchNews({ limit: 12 }));
    dispatch(fetchTrending());
  }, [dispatch]);

  const featuredNews = news[0];
  const topNews      = news.slice(1, 4);
  const latestNews   = news.slice(4, 12);

  return (
    <>
      

      {/* Top Banner Ad */}
      <AdUnit position="home-top" />

      {isLoading ? (
        /* ── Loading Skeleton ── */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="rounded-full border-4"
            style={{ width: 44, height: 44, borderColor: '#DC2626', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
          />
          <p style={{ color: '#94A3B8', fontSize: 14 }}>समाचार लोड हो रहे हैं...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════
              HERO SECTION — Lead Story + Trending Sidebar
          ══════════════════════════════════════════ */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

            {/* ── Featured / Hero Story & Trending ── */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              {featuredNews && (
                <Link href={`/news/${featuredNews.slug}`}
                  className="group block overflow-hidden"
                  style={{ borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                >
                  {/* Hero image */}
                  <div className="relative overflow-hidden" style={{ height: 360 }}>
                    {featuredNews.images?.[0] ? (
                      <img
                        src={featuredNews.images.find(i => i.isMain)?.url || featuredNews.images[0].url}
                        alt={featuredNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Newspaper size={64} color="#475569" />
                      </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                      <span style={{ background: '#DC2626', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {featuredNews.category || 'ताज़ा'}
                      </span>
                    </div>

                    {/* Hero text content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }} className="line-clamp-3">
                        {featuredNews.title}
                      </h1>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }} className="line-clamp-2">
                        {featuredNews.summary}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><PenTool size={12} /> {featuredNews.authorName || 'संपादक'}</span>
                        <span>•</span>
                        <span>{new Date(featuredNews.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* ══════════════════════════════════════════
                  TRENDING SECTION (Moved to left column)
              ══════════════════════════════════════════ */}
              {trending?.length > 0 && (
                <section>
                  {/* Section heading */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2 style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-block', width: 4, height: 20, background: '#DC2626', borderRadius: 2 }} />
                      <Flame size={20} color="#DC2626" /> ट्रेंडिंग खबरें
                    </h2>
                    <Link href="/trending" style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>
                      सभी देखें →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trending.slice(0, 4).map((item, i) => (
                      <Link key={item._id}
                        href={`/news/${item.slug}`}
                        className="group relative block"
                        style={{ textDecoration: 'none' }}
                      >
                        {/* Rank badge */}
                        <div style={{
                          position: 'absolute', top: 8, left: 8, zIndex: 10,
                          width: 26, height: 26, background: '#DC2626', color: '#fff',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 11, fontWeight: 800,
                          fontFamily: 'Inter, sans-serif',
                        }}>{i + 1}</div>

                        {/* Thumbnail */}
                        {item.images?.[0] ? (
                          <div style={{ height: 110, borderRadius: 8, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            <img
                              src={item.images[0].url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div style={{ height: 110, borderRadius: 8, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Newspaper size={28} color="#94A3B8" />
                          </div>
                        )}

                        <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginTop: 6, lineHeight: 1.4 }}
                          className="line-clamp-2 group-hover:text-[#DC2626] transition-colors">
                          {item.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar Column ── */}
            <div className="flex flex-col gap-6">
              {/* ── Trending / बड़ी खबरें Sidebar ── */}
              <div className="flex flex-col gap-0" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* Sidebar header */}
                <div style={{ borderBottom: '3px solid #DC2626', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 2, letterSpacing: '0.05em' }}>TOP</span>
                    बड़ी खबरें
                  </h2>
                  <Link href="/trending" style={{ fontSize: 12, color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>
                    सभी →
                  </Link>
                </div>

                {/* Numbered story list */}
                {topNews.map((item, i) => (
                  <Link key={item._id}
                    href={`/news/${item.slug}`}
                    className="group flex gap-3 p-4"
                    style={{ borderBottom: '1px solid #E2E8F0', textDecoration: 'none' }}
                  >
                    {/* Rank number */}
                    <span style={{ fontWeight: 900, fontSize: 22, color: '#E2E8F0', lineHeight: 1, flexShrink: 0, width: 28, fontFamily: 'Inter, sans-serif' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      {item.images?.[0] && (
                        <div style={{ height: 80, borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
                          <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <h3 style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.4 }} className="line-clamp-2 group-hover:text-[#DC2626] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sidebar Ad 1 */}
              <AdUnit position="sidebar-1" />
            </div>
          </section>

          {/* Mid Ad */}
          <AdUnit position="home-mid" />

          {/* ══════════════════════════════════════════
              LATEST NEWS GRID
          ══════════════════════════════════════════ */}
          <section className="mb-10">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 4, height: 22, background: '#DC2626', borderRadius: 2 }} />
              <h2 style={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>ताज़ा समाचार</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestNews.map(item => (
                <NewsCard key={item._id} news={item} size="large" />
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════
              CATEGORY QUICK-ACCESS GRID
          ══════════════════════════════════════════ */}
          <section className="mb-10">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-block', width: 4, height: 22, background: '#DC2626', borderRadius: 2 }} />
              <h2 style={{ fontWeight: 800, fontSize: 18, color: '#0F172A' }}>विषय अनुसार खबरें</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUICK_CATEGORIES.map(cat => (
                <Link key={cat.id}
                  href={`/category/${cat.id}`}
                  className="group flex flex-col items-center justify-center gap-2 py-6 bg-white transition-all duration-200"
                  style={{ border: '1px solid #E2E8F0', borderRadius: 10, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#DC2626';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                    {cat.icon}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }} className="group-hover:text-[#DC2626] transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════
              CITIZEN JOURNALISM CTA
          ══════════════════════════════════════════ */}
          <div
            className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl p-8"
            style={{ background: '#1E293B', border: '1px solid #334155' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 3, letterSpacing: '0.06em' }}>CITIZEN JOURNALISM</span>
              </div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Newspaper size={20} /> अपनी खबर भेजें
              </h3>
              <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>
                क्या आपके पास कोई महत्वपूर्ण खबर है? हमें भेजें और हम उसे लाखों पाठकों तक पहुँचाएंगे।
              </p>
            </div>
            <Link href="/apni-khabar"
              style={{
                background: '#DC2626',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
            >
              खबर भेजें →
            </Link>
          </div>

          {/* Bottom Ad */}
          <AdUnit position="home-bottom" />
        </>
      )}
    </>
  );
}

