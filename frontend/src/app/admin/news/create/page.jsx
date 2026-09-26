"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import api from "@/services/api";
import toast from 'react-hot-toast';
import { 
  PenSquare, FileText, Image as ImageIcon, Search, 
  Sparkles, Bot, Edit2, Loader, Flame, Pin, TrendingUp, 
  Send, Save, UploadCloud, Trash2, X, PlayCircle, Link
} from 'lucide-react';

const CATEGORIES = [
  { id: 'national', label: 'राष्ट्रीय' },
  { id: 'state', label: 'राज्य' },
  { id: 'politics', label: 'राजनीति' },
  { id: 'business', label: 'व्यापार' },
  { id: 'sports', label: 'खेल' },
  { id: 'crime', label: 'अपराध' },
];

export default function AdminNewsForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', summary: '', content: '', category: 'national',
    status: 'draft', isTrending: false, isBreaking: false, isFeatured: false,
    metaTitle: '', metaDescription: '', metaKeywords: '',
    tags: '', videoUrl: ''
  });
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (isEdit) {
      api.get(`/news/${id}?admin=true`).then(({ data }) => {
        const n = data.data;
        setForm({
          title: n.title || '', summary: n.summary || '',
          content: n.content || '', category: n.category || 'national',
          status: n.status || 'draft', isTrending: n.isTrending || false,
          isBreaking: n.isBreaking || false, isFeatured: n.isFeatured || false,
          metaTitle: n.metaTitle || '', metaDescription: n.metaDescription || '',
          metaKeywords: n.metaKeywords?.join(', ') || '',
          tags: n.tags?.join(', ') || '',
          videoUrl: n.videoUrl || ''
        });
        
        setImages(n.images || []);
      }).catch(() => toast.error('समाचार लोड नहीं हो सका'));
    }

    
    
  }, [id, isEdit]);

  const handleImageUpload = async (files) => {
    if (images.length + files.length > 10) return toast.error('अधिकतम 10 चित्र अपलोड कर सकते हैं');
    setUploadingImages(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('images', file));
    try {
      const { data } = await api.post('/news/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImages = data.data.map((img, i) => ({
        ...img, caption: '', isMain: images.length === 0 && i === 0
      }));
      setImages(prev => [...prev, ...newImages]);
      toast.success(`${data.data.length} चित्र अपलोड हुए`);
    } catch (err) {
      toast.error('चित्र अपलोड विफल');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAiRewrite = async () => {
    if (!form.content) return toast.error('पहले सामग्री लिखें');
    setIsAiLoading(true);
    try {
      const { data } = await api.post('/ai/rewrite', { content: form.content });
      setForm(prev => ({ ...prev, content: data.data }));
      toast.success('AI ने समाचार फिर से लिखा');
    } catch (err) {
      toast.error('AI पुनर्लेखन विफल');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFixGrammar = async () => {
    if (!form.content) return toast.error('पहले सामग्री लिखें');
    setIsAiLoading(true);
    try {
      const { data } = await api.post('/ai/fix-grammar', { content: form.content });
      setForm(prev => ({ ...prev, content: data.data }));
      toast.success('व्याकरण सुधार हो गया');
    } catch (err) {
      toast.error('व्याकरण सुधार विफल');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!form.title || !form.content) return toast.error('शीर्षक और सामग्री आवश्यक है');
    setIsAiLoading(true);
    try {
      const { data } = await api.post('/ai/generate-seo', { title: form.title, content: form.content });
      setForm(prev => ({
        ...prev,
        metaDescription: data.data.metaDescription,
        tags: data.data.tags.join(', ')
      }));
      toast.success('SEO जानकारी उत्पन्न हुई');
      setActiveTab('seo');
    } catch (err) {
      toast.error('SEO उत्पन्न करना विफल');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!form.title || !form.summary || !form.content) {
      return toast.error('शीर्षक, सारांश और सामग्री आवश्यक है');
    }
    setIsLoading(true);
    const payload = {
      ...form,
      status,
      images,
      metaKeywords: form.metaKeywords.split(',').map(k => k.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      hasVideo: Boolean(form.videoUrl)
    };
    try {
      if (isEdit) {
        await api.put(`/news/${id}`, payload);
        toast.success('समाचार अपडेट हो गया');
      } else {
        await api.post('/news', payload);
        toast.success('समाचार सहेजा गया');
      }
      router.push('/admin/news');
    } catch (err) {
      toast.error(err.response?.data?.message || 'समाचार सहेजने में समस्या');
    } finally {
      setIsLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }],
      ['link'],
      ['clean']
    ]
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };
  const youtubeId = extractYoutubeId(form.videoUrl);

  return (
    <div className="bg-slate-50/60 min-h-screen p-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <PenSquare className="w-6 h-6 text-red-600" />
            </div>
            {isEdit ? 'समाचार संपादित करें' : 'नया समाचार बनाएं'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/news')}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              रद्द करें (Back)
            </button>
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> ड्राफ्ट सहेजें
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={isLoading}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> समाचार प्रकाशित करें
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (68%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Summary */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800">शीर्षक *</label>
                  <span className="text-xs text-slate-400">{form.title.length}/100</span>
                </div>
                <input
                  type="text"
                  placeholder="समाचार का शीर्षक..."
                  maxLength={100}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-lg outline-none focus:border-red-600 focus:ring-4 focus:ring-red-500/20 transition-all font-medium text-slate-900"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800">सारांश (Excerpt) *</label>
                  <span className="text-xs text-slate-400">{form.summary.length}/250</span>
                </div>
                <textarea
                  placeholder="समाचार का संक्षिप्त विवरण..."
                  maxLength={250}
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-500/20 transition-all resize-none text-slate-700"
                />
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 ${
                    activeTab === 'content' ? 'border-b-2 border-red-600 text-red-600 bg-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" /> मुख्य सामग्री
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 ${
                    activeTab === 'images' ? 'border-b-2 border-red-600 text-red-600 bg-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> मीडिया व गैलरी
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 ${
                    activeTab === 'seo' ? 'border-b-2 border-red-600 text-red-600 bg-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" /> SEO सेटिंग्स
                </button>
              </div>

              <div className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div>
                    {/* AI Tools */}
                    <div className="flex flex-wrap gap-3 mb-5 p-4 bg-slate-50 border border-slate-100 rounded-xl items-center">
                      <div className="flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg px-3 py-1.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600" /> 
                        <span className="text-xs font-bold tracking-wide">AI सहायता</span>
                      </div>
                      
                      <button
                        onClick={handleAiRewrite}
                        disabled={isAiLoading}
                        className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        {isAiLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5 text-blue-500" />} पुनर्लेखन
                      </button>
                      
                      <button
                        onClick={handleFixGrammar}
                        disabled={isAiLoading}
                        className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        {isAiLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Edit2 className="w-3.5 h-3.5 text-emerald-500" />} व्याकरण सुधार
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:border-none [&_.ql-editor]:text-base [&_.ql-editor]:text-slate-800">
                      <ReactQuill
                        value={form.content}
                        onChange={value => setForm(prev => ({ ...prev, content: value }))}
                        modules={quillModules}
                        style={{ height: '400px' }}
                        placeholder="विस्तृत समाचार यहाँ लिखें..."
                      />
                    </div>
                  </div>
                )}

                {/* Images Tab (Gallery) */}
                {activeTab === 'images' && (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-800">अतिरिक्त गैलरी चित्र (Gallery Images)</p>
                      <p className="text-xs text-slate-500">मुख्य कवर फोटो के अलावा लेख के बीच में दिखने वाले चित्र।</p>
                    </div>
                    
                    <div
                      className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 text-center cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-colors group"
                      onClick={() => document.getElementById('galleryInput').click()}
                      onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        id="galleryInput"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageUpload(e.target.files)}
                      />
                      {uploadingImages ? (
                        <p className="text-slate-600 font-medium animate-pulse">चित्र अपलोड हो रहे हैं...</p>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 group-hover:border-red-200 group-hover:text-red-500 transition-colors">
                            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
                          </div>
                          <div>
                            <p className="text-slate-700 font-medium">गैलरी चित्र यहाँ खींचें या चुनें</p>
                            <p className="text-xs text-slate-400 mt-1">अधिकतम 10 चित्र, प्रत्येक 10MB तक</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {images.length > 1 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {images.slice(1).map((img, i) => (
                          <div key={i+1} className="relative border border-slate-200 rounded-lg overflow-hidden group">
                            <img src={img.url} alt="" className="w-full h-32 object-cover" />
                            <button
                              onClick={() => removeImage(i+1)}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="p-2 bg-slate-50 border-t border-slate-200">
                              <input
                                type="text"
                                placeholder="चित्र का विवरण (Caption)..."
                                value={img.caption || ''}
                                onChange={e => {
                                  const updated = [...images];
                                  updated[i+1] = { ...updated[i+1], caption: e.target.value };
                                  setImages(updated);
                                }}
                                className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">खोज इंजन अनुकूलन (Search Engine Optimization)</p>
                      <button
                        onClick={handleGenerateSEO}
                        disabled={isAiLoading}
                        className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                      >
                        {isAiLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5 text-blue-500" />} स्वतः SEO जनरेट करें
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">मेटा शीर्षक</label>
                        <span className="text-xs text-slate-400">{form.metaTitle.length}/70</span>
                      </div>
                      <input
                        type="text"
                        value={form.metaTitle}
                        onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                        maxLength={70}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-800"
                        placeholder="SEO शीर्षक (खाली छोड़ने पर मुख्य शीर्षक उपयोग होगा)"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-slate-700">मेटा विवरण</label>
                        <span className="text-xs text-slate-400">{form.metaDescription.length}/160</span>
                      </div>
                      <textarea
                        value={form.metaDescription}
                        onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                        maxLength={160}
                        rows={3}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none text-slate-800"
                        placeholder="खोज इंजन में दिखने वाला विवरण (Search snippet)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">टैग (Tags)</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={e => setForm({ ...form, tags: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-800"
                        placeholder="अल्पविराम से अलग करें (उदा: चुनाव 2026, राजनीति, दिल्ली)"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (32%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Cover Photo Dropzone */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <label className="block text-sm font-semibold text-slate-800 mb-3">मुख्य कवर फोटो (Cover Photo) *</label>
              
              {images.length > 0 ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
                  <div className="aspect-video w-full bg-slate-100">
                    <img src={images[0].url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => removeImage(0)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-105"
                      title="फोटो बदलें"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur-md">
                    मुख्य फोटो
                  </div>
                </div>
              ) : (
                <div
                  className="aspect-video w-full border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-red-500 hover:bg-red-50/50 transition-colors group"
                  onClick={() => document.getElementById('coverInput').click()}
                  onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    id="coverInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload(e.target.files)}
                  />
                  {uploadingImages ? (
                    <Loader className="w-6 h-6 text-slate-400 animate-spin" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-2 group-hover:border-red-200 transition-colors">
                        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium text-center">कवर फोटो यहाँ ड्रॉप करें</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium bg-slate-200/50 px-2 py-0.5 rounded">1280 × 720 px अनुशंसित</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* YouTube Video Link */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <PlayCircle className="w-5 h-5 text-red-600" />
                यूट्यूब वीडियो लिंक (YouTube Video)
              </label>
              
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="youtube.com/watch?v=..."
                  value={form.videoUrl}
                  onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-800 bg-slate-50"
                />
              </div>

              {youtubeId && (
                <div className="mt-4 space-y-3">
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${youtubeId}`} 
                      title="YouTube Preview" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <button
                    onClick={() => {
                      const thumbUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
                      const newImage = { url: thumbUrl, caption: 'YouTube Thumbnail', isMain: true };
                      if (images.length > 0) {
                        const newImages = [...images];
                        newImages[0] = newImage;
                        setImages(newImages);
                      } else {
                        setImages([newImage]);
                      }
                      toast.success('यूट्यूब थंबनेल को मुख्य कवर फोटो बना दिया गया है');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-lg text-sm font-semibold border border-red-200 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    यूट्यूब थंबनेल को मुख्य कवर फोटो बनाएं
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <label className="block text-sm font-semibold text-slate-800 mb-3">समाचार वर्ग (Category) *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-slate-800 font-medium bg-slate-50 cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Special Flags */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-sm font-semibold text-slate-800 mb-4">विशेष स्थिति (Highlights)</p>
              
              <div className="space-y-3">
                {/* Breaking */}
                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.isBreaking ? 'border-red-200 bg-red-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${form.isBreaking ? 'bg-red-100' : 'bg-slate-100'}`}>
                      <Flame className={`w-4 h-4 ${form.isBreaking ? 'text-red-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${form.isBreaking ? 'text-red-900' : 'text-slate-700'}`}>ब्रेकिंग न्यूज़</p>
                      <p className="text-[11px] text-slate-500">टिकर और टॉप बैनर में दिखाएं</p>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" checked={form.isBreaking} onChange={e => setForm({...form, isBreaking: e.target.checked})} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                  </div>
                </label>

                {/* Featured / Pin */}
                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.isFeatured ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${form.isFeatured ? 'bg-amber-100' : 'bg-slate-100'}`}>
                      <Pin className={`w-4 h-4 ${form.isFeatured ? 'text-amber-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${form.isFeatured ? 'text-amber-900' : 'text-slate-700'}`}>मुख्य खबर (Featured)</p>
                      <p className="text-[11px] text-slate-500">होमपेज के बड़े कार्ड में पिन करें</p>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </div>
                </label>

                {/* Trending */}
                <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.isTrending ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${form.isTrending ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                      <TrendingUp className={`w-4 h-4 ${form.isTrending ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${form.isTrending ? 'text-indigo-900' : 'text-slate-700'}`}>ट्रेंडिंग</p>
                      <p className="text-[11px] text-slate-500">ट्रेंडिंग न्यूज़ लिस्ट में शामिल करें</p>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" checked={form.isTrending} onChange={e => setForm({...form, isTrending: e.target.checked})} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Actions Sticky (Mobile) / Block (Desktop) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sticky top-6">
              <div className="space-y-3">
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> समाचार प्रकाशित करें
                </button>
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={isLoading}
                  className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 font-medium disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> ड्राफ्ट सहेजें
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
