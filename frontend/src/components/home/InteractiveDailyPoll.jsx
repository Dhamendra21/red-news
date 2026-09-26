"use client";
import React, { useState, useEffect } from 'react';
import { Vote } from 'lucide-react';
import api from '@/services/api';

export default function InteractiveDailyPoll() {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const { data } = await api.get('/polls');
      if (data && data.data) {
        setPollData(data.data);
        // Check if user already voted in localStorage
        const votedOption = localStorage.getItem(`voted_poll_${data.data._id}`);
        if (votedOption) {
          setSelectedOption(votedOption);
          setVoted(true);
        }
      }
    } catch (err) {
      console.error('Error fetching poll', err);
    }
  };

  const handleVote = async (optionId) => {
    if (!pollData || voted) return;
    
    try {
      setSelectedOption(optionId);
      setVoted(true);
      localStorage.setItem(`voted_poll_${pollData._id}`, optionId);
      
      const { data } = await api.post(`/polls/${pollData._id}/vote`, { optionId });
      if (data && data.data) {
        setPollData(data.data);
      }
    } catch (err) {
      console.error('Error voting', err);
    }
  };

  if (!pollData) return null;

  return (
    <div className="flex flex-col gap-4 bg-white p-5" style={{ border: '1px solid #E2E8F0', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'inline-block', width: 4, height: 16, background: '#DC2626', borderRadius: 2 }} />
        <h2 style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
          आज का बड़ा सवाल
        </h2>
      </div>
      
      <p style={{ fontWeight: 600, fontSize: 14, color: '#1E293B', lineHeight: 1.5 }}>
        {pollData.question}
      </p>

      <div className="flex flex-col gap-3 mt-1">
        {pollData.options.map((option) => {
          const isSelected = selectedOption === option._id;
          const percentage = pollData.totalVotes > 0 ? Math.round((option.votes / pollData.totalVotes) * 100) : 0;
          return (
            <div key={option._id} className="relative">
              {!voted ? (
                <button
                  onClick={() => handleVote(option._id)}
                  className="w-full text-left px-4 py-2.5 rounded-lg border hover:border-red-500 hover:bg-red-50 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#334155', fontSize: 14, fontWeight: 500 }}
                >
                  {option.label}
                </button>
              ) : (
                <div className="w-full relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between px-4 py-2.5" style={{ minHeight: 46 }}>
                  {/* Progress bar background */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out ${isSelected ? 'bg-red-100' : 'bg-slate-200'}`}
                    style={{ width: `${percentage}%` }}
                  />
                  {/* Text content on top */}
                  <span className="relative z-10 flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                    {option.label}
                    {isSelected && <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />}
                  </span>
                  <span className="relative z-10" style={{ fontSize: 14, fontWeight: 700, color: isSelected ? '#DC2626' : '#475569' }}>
                    {percentage}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {voted && (
        <div className="flex items-center gap-2 mt-2" style={{ color: '#64748B', fontSize: 12, fontWeight: 500 }}>
          <Vote size={14} />
          <span>{pollData.totalVotes} लोगों ने वोट किया</span>
        </div>
      )}
    </div>
  );
}
