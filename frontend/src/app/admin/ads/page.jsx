"use client";
import React, { useEffect, useState } from 'react';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { Megaphone, MapPin, Eye, MousePointer2, Trash2, Plus } from 'lucide-react';
import ImageCropperModal from '@/components/admin/ImageCropperModal';

const AD_POSITIONS = [
  'home-top', 'home-mid', 'home-bottom', 'sidebar-1', 'sidebar-2',
  'article-top', 'article-mid', 'article-bottom', 'category-top'
];

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'banner', position: 'home-top',
    link: '', googleAdCode: '', isGoogleAd: false, isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For display in form
  const [isLoading, setIsLoading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = () => {
    api.get('/ads').then(({ data }) => setAds(data.data)).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (imageFile) formData.append('image', imageFile);
    try {
      await api.post('/ads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('विज्ञापन जोड़ा गया');
      setShowForm(false);
      fetchAds();
    } catch (err) {
      toast.error('विज्ञापन जोड़ने में समस्या');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Limit file size to 5MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit. Please select a smaller image.');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result?.toString() || '');
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input so same file can be selected again if cancelled
    }
  };

  const handleCropComplete = (blob) => {
    // Convert blob to File
    const file = new File([blob], "ad-image-cropped.jpg", { type: "image/jpeg" });
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(blob));
    setCropModalOpen(false);
    setCropImageSrc(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप इस विज्ञापन को हटाना चाहते हैं?')) return;
    await api.delete(`/ads/${id}`);
    toast.success('विज्ञापन हटाया गया');
    fetchAds();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Megaphone size={28} /> विज्ञापन प्रबंधन</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          <span className="flex items-center gap-1"><Plus size={16} /> नया विज्ञापन</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">नया विज्ञापन जोड़ें</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="विज्ञापन का नाम" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-green-500" required />
            <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-green-500">
              {AD_POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
            <input placeholder="लिंक URL" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-green-500" />
            
            <div className="flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleFileChange}
                className="border rounded-lg px-4 py-2 text-sm" />
              {imagePreviewUrl && (
                <div className="relative inline-block w-fit mt-2">
                  <img src={imagePreviewUrl} alt="Preview" className="h-20 object-contain rounded border" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreviewUrl(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="checkbox" checked={form.isGoogleAd} onChange={e => setForm({ ...form, isGoogleAd: e.target.checked })} className="accent-green-600" />
                <span className="text-sm font-medium">Google AdSense कोड उपयोग करें</span>
              </label>
              {form.isGoogleAd && (
                <textarea placeholder="Google AdSense HTML कोड यहाँ पेस्ट करें" value={form.googleAdCode}
                  onChange={e => setForm({ ...form, googleAdCode: e.target.value })}
                  rows={4} className="w-full border rounded-lg px-4 py-2 text-xs font-mono outline-none focus:border-green-500 resize-none" />
              )}
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-60">
                {isLoading ? 'जोड़ रहे हैं...' : 'विज्ञापन जोड़ें'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg text-sm hover:bg-gray-50">
                रद्द करें
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map(ad => (
          <div key={ad._id} className="bg-white rounded-xl p-4 shadow-sm">
            {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-24 object-cover rounded-lg mb-3" />}
            <h3 className="font-bold text-gray-800 text-sm">{ad.title}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {ad.position}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-2"><span className="flex items-center gap-1"><Eye size={12} /> {ad.impressions}</span> <span>&bull;</span> <span className="flex items-center gap-1"><MousePointer2 size={12} /> {ad.clicks}</span></span>
              <button onClick={() => handleDelete(ad._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={12} /> हटाएं</button>
            </div>
          </div>
        ))}
      </div>

      <ImageCropperModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
