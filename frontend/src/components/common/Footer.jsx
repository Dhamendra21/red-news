"use client";
import React from 'react';
import Link from "next/link";
import { Send, Bell, Heart, Globe, MessageSquare, Tv } from 'lucide-react';

const FOOTER_CATEGORIES = [
  { id: 'politics',      name: 'राजनीति' },
  { id: 'local',         name: 'देश' },
  { id: 'international', name: 'विदेश' },
  { id: 'sports',        name: 'खेल' },
  { id: 'business',      name: 'व्यापार' },
  { id: 'technology',    name: 'टेक' },
  { id: 'entertainment', name: 'मनोरंजन' },
  { id: 'health',        name: 'स्वास्थ्य' },
];

const QUICK_LINKS = [
  { label: 'होम', path: '/' },
  { label: 'ट्रेंडिंग', path: '/trending' },
  { label: 'अपनी खबर भेजें', path: '/apni-khabar' },
  { label: 'संपादक पैनल', path: '/admin' },
  { label: 'हमारे बारे में', path: '/about' },
  { label: 'संपर्क करें', path: '/contact' },
  { label: 'गोपनीयता नीति', path: '/privacy' },
];

const linkStyle = {
  color: '#94A3B8',
  textDecoration: 'none',
  fontSize: 13,
  lineHeight: '1.8',
  display: 'block',
  transition: 'color 0.15s',
};

export default function Footer() {
  const handleNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted') alert('सूचनाएं सक्रिय हो गई हैं!');
      });
    }
  };

  return (
    <footer style={{ background: '#0F172A', color: '#fff', marginTop: 48 }}>

      {/* ── Main footer content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1: Brand ── */}
          <div>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#DC2626', borderRadius: 6, padding: '6px 10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="white" opacity="0.9"/>
                  <path d="M12 2L2 7l10 5 10-5L12 2z" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, lineHeight: 1 }}>
                  <span style={{ color: '#DC2626' }}>RED </span>
                  <span style={{ color: '#fff' }}>NEWS BHARAT</span>
                </div>
                <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.1em', marginTop: 2, textTransform: 'uppercase' }}>
                  हिंदी समाचार पोर्टल
                </div>
              </div>
            </Link>

            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
              भारत का सबसे तेज़ और विश्वसनीय हिंदी समाचार पोर्टल। ताज़ा खबरें, राष्ट्रीय–अंतर्राष्ट्रीय समाचार और स्थानीय खबरें एक जगह।
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Facebook', icon: <Globe size={16} /> },
                { label: 'Twitter/X', icon: <MessageSquare size={16} /> },
                { label: 'YouTube', icon: <Tv size={16} /> },
                { label: 'Telegram', icon: <Send size={16} /> },
              ].map(s => (
                <button
                  key={s.label}
                  title={s.label}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: 6,
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 16, transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#DC2626'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── Col 2: Quick Links ── */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #DC2626', display: 'inline-block' }}>
              उपयोगी लिंक
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {QUICK_LINKS.map(link => (
                <li key={link.path}>
                  <Link href={link.path}
                    style={linkStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <span style={{ color: '#DC2626', marginRight: 6 }}>›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Categories ── */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #DC2626', display: 'inline-block' }}>
              समाचार वर्ग
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {FOOTER_CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.id}`}
                    style={linkStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <span style={{ color: '#DC2626', marginRight: 6 }}>›</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Newsletter / Notifications ── */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #DC2626', display: 'inline-block' }}>
              सूचनाएं पाएं
            </h4>
            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              ताज़ा खबरों की सूचना सबसे पहले पाने के लिए सब्सक्राइब करें।
            </p>

            {/* Push notification button */}
            <button
              onClick={handleNotification}
              style={{
                background: '#DC2626',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 16px',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                width: '100%',
                marginBottom: 16,
                transition: 'background 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Bell size={16} /> सूचनाएं चालू करें</span>
            </button>

            {/* Newsletter email input */}
            <div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #334155' }}>
              <input
                type="email"
                placeholder="आपका ईमेल..."
                style={{
                  flex: 1, background: '#1E293B', border: 'none',
                  padding: '9px 12px', fontSize: 13, color: '#fff',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  background: '#DC2626', color: '#fff', border: 'none',
                  padding: '9px 14px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                सब्सक्राइब
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div style={{ borderTop: '1px solid #1E293B', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <p style={{ color: '#475569', fontSize: 12 }}>
            © {new Date().getFullYear()} <strong style={{ color: '#94A3B8' }}>RED NEWS BHARAT</strong>. सर्वाधिकार सुरक्षित।
          </p>
          <p style={{ color: '#334155', fontSize: 11 }}>
            Made with <Heart size={12} fill="#ef4444" color="#ef4444" style={{ display: 'inline' }} /> for भारत — निष्पक्ष, तेज़, विश्वसनीय पत्रकारिता
          </p>
        </div>
      </div>
    </footer>
  );
}
