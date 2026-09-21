"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from 'react-redux';
import { FileText, Settings, User, Home } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'politics',      name: 'राजनीति',        path: '/category/politics' },
  { id: 'local',         name: 'देश',             path: '/category/local' },
  { id: 'international', name: 'विदेश',           path: '/category/international' },
  { id: 'sports',        name: 'खेल',             path: '/category/sports' },
  { id: 'business',      name: 'व्यापार',         path: '/category/business' },
  { id: 'technology',    name: 'टेक',             path: '/category/technology' },
  { id: 'entertainment', name: 'मनोरंजन',         path: '/category/entertainment' },
  { id: 'health',        name: 'स्वास्थ्य',       path: '/category/health' },
  { id: 'science',       name: 'विज्ञान',         path: '/category/science' },
  { id: 'environment',   name: 'पर्यावरण',        path: '/category/environment' },
  { id: 'world',         name: 'विश्व',           path: '/category/world' },
  { id: 'education',     name: 'शिक्षा',          path: '/category/education' },
  { id: 'lifestyle',     name: 'जीवनशैली',        path: '/category/lifestyle' },
  { id: 'opinion',       name: 'राय',             path: '/category/opinion' },
  { id: 'reader-news',   name: 'पाठक समाचार',    path: '/category/reader-news' },
  { id: 'trending',      name: 'ट्रेंडिंग',      path: '/trending' },
];

/* ── Colour tokens (mirrors index.css @theme) ── */
const C = {
  red: '#DC2626',
  redDark: '#B91C1C',
  dark: '#0F172A',
  mid: '#1E293B',
  border: '#E2E8F0',
  headline: '#0F172A',
  excerpt: '#475569',
  meta: '#94A3B8',
};

export default function Header() {
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = useSelector(state => state?.auth || {});
  const navigate  = useRouter();
  const location  = { pathname: usePathname() };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    color: isActive(path) ? C.red : C.headline,
    borderBottom: isActive(path) ? `2px solid ${C.red}` : '2px solid transparent',
    background: isActive(path) ? '#FEF2F2' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      <header style={{
        background: '#FFFFFF',
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
      }}>

        {/* ── Utility Top Bar ── */}
        <div className="hidden md:block" style={{ background: C.dark, padding: '5px 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Date */}
            <span style={{ color: C.meta, fontSize: 11, letterSpacing: '0.03em' }}>
              {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>

            {/* Right utilities */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Live TV badge */}
              <span style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: C.red, color: '#fff',
                fontSize: 11, fontWeight: 700, padding: '2px 10px',
                borderRadius: 3, letterSpacing: '0.05em',
              }}>
                <span className="animate-live-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                LIVE TV
              </span>

              {/* ई-पेपर badge */}
              <span style={{
                color: '#fff', fontSize: 11, fontWeight: 600,
                border: `1px solid #334155`, padding: '2px 10px',
                borderRadius: 3, letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <FileText size={12} /> ई-पेपर
              </span>

              {/* Quick links */}
              {[['खबर भेजें', '/apni-khabar'], ['संपर्क', '/contact'], ['हमारे बारे में', '/about']].map(([label, path]) => (
                <Link key={path} href={path} style={{ color: C.meta, fontSize: 11, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = C.meta}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Header Row ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.dark, padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* ── Logo ── */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <img src="/logo.webp" alt="RED NEWS BHARAT" style={{ height: 45, objectFit: 'contain' }} />
          </Link>

          {/* ── Right Actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="खबर खोजें..."
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    padding: '6px 14px',
                    fontSize: 13,
                    outline: 'none',
                    width: 160,
                    color: C.dark,
                  }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.meta }}>✕</button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.excerpt, padding: 4 }}
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            )}

            <Link href={token ? '/admin' : '/admin/login'}
              style={{
                background: C.red,
                color: '#fff',
                padding: '7px 16px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.redDark}
              onMouseLeave={e => e.currentTarget.style.background = C.red}
            >
              {token ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Settings size={14} /> पैनल</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={14} /> लॉगिन</span>}
            </Link>
          </div>
        </div>

        {/* ── Desktop & Mobile Swipeable Nav Bar ── */}
        <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none px-4 py-2.5 border-b border-slate-200 bg-white" style={{ borderBottom: `2px solid ${C.red}` }}>
          <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 8px' }}>
            <Link href="/" style={navLinkStyle('/')}>होम</Link>
            {NAV_ITEMS.map(item => (
              <Link key={item.id} href={item.path} style={navLinkStyle(item.path)}>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* ── Mobile Slide-In Drawer ── */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex' }}>
          {/* Backdrop */}
          <div onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

          {/* Drawer panel */}
          <div style={{
            position: 'relative', width: 285, background: '#fff', height: '100%',
            overflowY: 'auto', zIndex: 1, boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
          }}>
            {/* Drawer header */}
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.dark }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <img src="/logo.webp" alt="RED NEWS BHARAT" style={{ height: 32, objectFit: 'contain' }} />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: C.meta }}>✕</button>
            </div>

            {/* Mobile search */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="खबर खोजें..."
                  style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none', color: C.dark }}
                />
                <button type="submit" style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  खोजें
                </button>
              </form>
            </div>

            {/* Nav links */}
            <div style={{ padding: '8px 0' }}>
              <Link href="/" style={{ display: 'block', padding: '12px 20px', color: isActive('/') ? C.red : C.dark, textDecoration: 'none', fontSize: 14, fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: isActive('/') ? '#FEF2F2' : 'transparent' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Home size={16} /> होम</span>
              </Link>
              {NAV_ITEMS.map(item => (
                <Link key={item.id} href={item.path} style={{
                  display: 'block', padding: '12px 20px', fontSize: 14, fontWeight: 500,
                  textDecoration: 'none', borderBottom: `1px solid ${C.border}`,
                  color: isActive(item.path) ? C.red : C.dark,
                  background: isActive(item.path) ? '#FEF2F2' : 'transparent',
                }}>
                  {item.name}
                </Link>
              ))}
            </div>

            <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
              <Link href={token ? '/admin' : '/admin/login'} style={{
                display: 'block', textAlign: 'center',
                background: C.red, color: '#fff',
                padding: '10px', borderRadius: 6,
                fontWeight: 700, textDecoration: 'none', fontSize: 14,
              }}>
                {token ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Settings size={16} /> Admin Panel</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><User size={16} /> लॉगिन करें</span>}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}