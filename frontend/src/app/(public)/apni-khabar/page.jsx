"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { Newspaper, CheckCircle, Send } from 'lucide-react';

export default function SubmitNewsPage() {
  const [form, setForm] = useState({ title: '', summary: '', content: '', readerName: '', readerEmail: '' });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.summary || !form.content || !form.readerName) {
      return toast.error('कृपया सभी आवश्यक जानकारी भरें');
    }
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    Array.from(images).forEach(file => formData.append('images', file));
    try {
      await api.post('/reader-news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (err) {
      toast.error('खबर भेजने में समस्या हुई');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Shared input style ── */
  const inputStyle = {
    width: '100%',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#0F172A',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    fontFamily: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = '#DC2626';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.10)';
  };
  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = '#E2E8F0';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <>
      

      <div className="max-w-2xl mx-auto animate-fade-in">

        {/* ── Page header banner ── */}
        <div
          style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 12, padding: '28px 32px', marginBottom: 28 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              background: '#DC2626', color: '#fff',
              fontSize: 10, fontWeight: 800, padding: '3px 10px',
              borderRadius: 3, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              CITIZEN JOURNALISM
            </span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 26, marginBottom: 8, lineHeight: 1.25, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Newspaper size={26} /> अपनी खबर भेजें
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            आपके आस-पास कोई महत्वपूर्ण घटना हुई? हमें बताएं — हम उसे लाखों पाठकों तक पहुँचाएंगे।
          </p>
        </div>

        {/* ── Success state ── */}
        {submitted ? (
          <div style={{
            background: '#0F172A', border: '1px solid #1E293B',
            borderRadius: 12, padding: '40px 32px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CheckCircle size={52} color="#10B981" />
            </div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>धन्यवाद!</h2>
            <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              आपकी खबर सफलतापूर्वक भेज दी गई है।<br />
              हमारी संपादकीय टीम समीक्षा के बाद प्रकाशित करेगी।
            </p>
            <Link href="/"
              style={{
                display: 'inline-block',
                background: '#DC2626', color: '#fff',
                padding: '11px 28px', borderRadius: 6,
                fontWeight: 700, fontSize: 14,
                textDecoration: 'none', letterSpacing: '0.02em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
            >
              ← होम पर जाएं
            </Link>
          </div>
        ) : (
          /* ── Submission form ── */
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#fff', border: '1px solid #E2E8F0',
              borderRadius: 12, padding: '28px 32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            {/* Row: Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  आपका नाम <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.readerName}
                  onChange={e => setForm({ ...form, readerName: e.target.value })}
                  placeholder="पूरा नाम लिखें"
                  required
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  ईमेल <span style={{ color: '#94A3B8', fontWeight: 400 }}>(वैकल्पिक)</span>
                </label>
                <input
                  type="email"
                  value={form.readerEmail}
                  onChange={e => setForm({ ...form, readerEmail: e.target.value })}
                  placeholder="yourname@email.com"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                खबर का शीर्षक <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="खबर का मुख्य शीर्षक लिखें"
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Summary */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                संक्षिप्त विवरण <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="2-3 वाक्यों में खबर का सारांश..."
                rows={3}
                required
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Full content */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                पूरी खबर <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="यहाँ अपनी खबर विस्तार से लिखें..."
                rows={8}
                required
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Image upload */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                चित्र संलग्न करें <span style={{ color: '#94A3B8', fontWeight: 400 }}>(अधिकतम 5)</span>
              </label>
              <div
                style={{
                  border: '1px dashed #CBD5E1', borderRadius: 8,
                  padding: '14px 16px', background: '#F8FAFC',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setImages(e.target.files)}
                  style={{ fontSize: 13, color: '#475569', width: '100%', cursor: 'pointer' }}
                />
              </div>
              {images.length > 0 && (
                <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6, fontWeight: 600 }}>
                  {images.length} चित्र चयनित
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? '#94A3B8' : '#DC2626',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '13px 24px',
                fontWeight: 700,
                fontSize: 15,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                letterSpacing: '0.02em',
                width: '100%',
                fontFamily: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#B91C1C')}
              onMouseLeave={e => !isLoading && (e.currentTarget.style.background = '#DC2626')}
            >
              {isLoading ? 'भेज रहे हैं...' : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Send size={18} /> खबर भेजें →</span>}
            </button>

            <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', margin: 0 }}>
              खबर भेजने से पहले सुनिश्चित करें कि जानकारी सटीक और सत्य है।
            </p>
          </form>
        )}
      </div>
    </>
  );
}

