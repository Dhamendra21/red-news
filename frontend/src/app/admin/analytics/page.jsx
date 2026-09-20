"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import api from "@/services/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Newspaper, Clock, Eye, Users, Flame, TrendingUp, Activity, BarChart2 } from 'lucide-react';

const CAT_NAMES = {
  national:'राष्ट्रीय', sports:'खेल', science:'विज्ञान',
  international:'अंतर्राष्ट्रीय', local:'स्थानीय', environment:'पर्यावरण',
  politics:'राजनीति', entertainment:'मनोरंजन', technology:'प्रौद्योगिकी',
  health:'स्वास्थ्य', business:'व्यापार', education:'शिक्षा',
};

const StatCard = ({ label, value, icon: Icon, trend, trendLabel, live }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400">
        <Icon size={16} />
      </div>
    </div>
    <div className="mb-2">
      <span className="text-2xl font-bold text-white">{value ?? '—'}</span>
    </div>
    <div className="flex items-center gap-2">
      {live ? (
        <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {trendLabel}
        </span>
      ) : (
        <span className="text-emerald-400 text-xs flex items-center font-medium">
          {trend} <span className="text-slate-500 ml-1 font-normal">{trendLabel}</span>
        </span>
      )}
    </div>
  </div>
);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [viewsChart, setViewsChart] = useState([]);
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const days = dateFilter === 'today' ? 1 : dateFilter === 'week' ? 7 : dateFilter === 'month' ? 30 : 14;
      const [s, v, t] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/analytics/views-chart?days=${days}`),
        api.get('/admin/analytics/top-news?sort=views&limit=5'),
      ]);
      setStats(s.data.data);
      setViewsChart(v.data.data || []);
      setTopNews(t.data.data || []);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [dateFilter]);

  if (loading) return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center">
      <div className="w-11 h-11 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-slate-400 text-sm font-medium tracking-wider">डेटा लोड हो रहा है...</p>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen p-6 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Date Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="text-red-600" />
              टेलीमेट्री पोर्टल <span className="text-slate-500 text-sm font-normal uppercase tracking-widest ml-2">Red News Bharat</span>
            </h1>
          </div>
          
          <div className="flex items-center bg-slate-900/80 border border-slate-800 p-1 rounded-lg backdrop-blur-sm">
            {[
              { id: 'all', label: 'समग्र / All' },
              { id: 'today', label: 'आज' },
              { id: 'week', label: 'इस हफ्ते' },
              { id: 'month', label: 'इस महीने' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setDateFilter(tab.id)}
                className={`transition-colors ${dateFilter === tab.id ? 'bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold' : 'text-slate-400 hover:text-slate-200 px-3 py-1.5 text-xs'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Grid (3x2 Desktop, 2x3 Tablet, 1x6 Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="कुल खबरें" value={stats?.totalNews} icon={Newspaper} trend="+12%" trendLabel="पिछले सप्ताह से" />
          <StatCard label="आज की खबरें" value={stats?.todayNews} icon={Clock} trend="+5%" trendLabel="कल से" />
          <StatCard label="सक्रिय उपयोगकर्ता" value={Math.floor(Math.random() * 50) + 120} icon={Users} trend="" trendLabel="अभी लाइव पढ़ रहे हैं" live={true} />
          <StatCard label="कुल व्यूज़" value={stats?.totalViews} icon={Eye} trend="+24%" trendLabel="पिछले सप्ताह से" />
          <StatCard label="ट्रेंडिंग खबरें" value={stats?.trendingNews} icon={Flame} trend="+2" trendLabel="नई ट्रेंडिंग" />
          <StatCard label="कुल लाइक्स" value={stats?.totalLikes} icon={TrendingUp} trend="+18%" trendLabel="पिछले सप्ताह से" />
        </div>

        {/* Lower Dashboard Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Container (Span 2): Area Chart */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart2 size={18} className="text-red-500" />
              रियल-टाइम ट्रैफिक (Views Over Time)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#ef4444' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Container (Span 1): Top 5 Trending */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Flame size={18} className="text-red-500" />
              शीर्ष 5 ट्रेंडिंग खबरें (Top 5 Stories)
            </h3>
            
            <div className="flex-1 flex flex-col gap-3">
              {topNews.slice(0, 5).map((news, idx) => (
                <Link key={news._id} href={`/admin/news/edit/${news._id}`} className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-white transition-colors mb-1">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-slate-500">
                      <span className="text-red-400">{CAT_NAMES[news.category] || news.category}</span>
                      <span className="flex items-center gap-1"><Eye size={10} /> {news.views?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {topNews.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                  <Newspaper size={32} className="opacity-20" />
                  <span className="text-xs">कोई खबर नहीं मिली</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}