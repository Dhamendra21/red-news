import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { MessageCircle } from 'lucide-react';

export default function CommentSection({ newsId }) {
  const [comments, setComments]       = useState([]);
  const [form, setForm]               = useState({ name: '', email: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/comments/${newsId}`)
      .then(({ data }) => setComments(data.data))
      .catch(() => {});
  }, [newsId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return toast.error('नाम और टिप्पणी आवश्यक है');
    setIsSubmitting(true);
    try {
      await api.post('/comments', { ...form, news: newsId });
      toast.success('टिप्पणी समीक्षा के बाद प्रकाशित होगी');
      setForm({ name: '', email: '', comment: '' });
    } catch (err) {
      toast.error('टिप्पणी भेजने में समस्या हुई');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>

      {/* Section header */}
      <h3 style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          background: '#DC2626', color: '#fff',
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0,
        }}><MessageCircle size={16} /></span>
        पाठकों की टिप्पणियां
        <span style={{ background: '#F1F5F9', color: '#475569', borderRadius: 20, fontSize: 13, fontWeight: 600, padding: '2px 10px' }}>
          {comments.length}
        </span>
      </h3>

      {/* Comment form */}
      <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 24, marginBottom: 24, border: '1px solid #E2E8F0' }}>
        <h4 style={{ fontWeight: 700, color: '#0F172A', fontSize: 15, marginBottom: 16 }}>अपनी राय दें</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="आपका नाम *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{
                border: '1px solid #E2E8F0', borderRadius: 8,
                padding: '10px 14px', fontSize: 14, color: '#0F172A',
                outline: 'none', background: '#fff',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#DC2626'}
              onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
            <input
              type="email"
              placeholder="ईमेल (वैकल्पिक)"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                border: '1px solid #E2E8F0', borderRadius: 8,
                padding: '10px 14px', fontSize: 14, color: '#0F172A',
                outline: 'none', background: '#fff',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#DC2626'}
              onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            />
          </div>

          <textarea
            placeholder="अपनी टिप्पणी लिखें..."
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            rows={4}
            required
            maxLength={1000}
            style={{
              width: '100%', border: '1px solid #E2E8F0', borderRadius: 8,
              padding: '10px 14px', fontSize: 14, color: '#0F172A',
              outline: 'none', background: '#fff', resize: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#DC2626'}
            onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#94A3B8' : '#DC2626',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: 14,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#B91C1C')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.background = '#DC2626')}
            >
              {isSubmitting ? 'भेज रहे हैं...' : 'टिप्पणी भेजें →'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {comments.length === 0 && (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '24px 0', fontSize: 14 }}>
            अभी तक कोई टिप्पणी नहीं। पहली टिप्पणी करें!
          </p>
        )}
        {comments.map(comment => (
          <div
            key={comment._id}
            style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#FEF2F2', border: '2px solid #FECACA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#DC2626', fontWeight: 800, fontSize: 15, flexShrink: 0,
              }}>
                {comment.name[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{comment.name}</p>
                <p style={{ fontSize: 11, color: '#94A3B8' }}>{dayjs(comment.createdAt).fromNow()}</p>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
