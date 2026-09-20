"use client";
import React from 'react';
import Link from "next/link";
import { useSelector } from 'react-redux';

export default function BreakingNewsTicker() {
  const { breaking } = useSelector(state => state?.news || {});
  if (!breaking?.length) return null;

  return (
    <div
      style={{ background: '#0F172A' }}
      className="flex items-stretch overflow-hidden border-b border-slate-800"
    >
      {/* Badge */}
      <div
        style={{ background: '#DC2626' }}
        className="flex items-center gap-1.5 px-4 py-2 text-white font-bold text-xs whitespace-nowrap flex-shrink-0 uppercase tracking-wide border-b border-[#DC2626]"
      >
        <span className="animate-live-dot inline-block w-2.5 h-2.5 rounded-full bg-white" />
        BREAKING&nbsp;
        <span className="opacity-90">/ ताज़ा समाचार</span>
      </div>

      {/* Scrolling headlines */}
      <div className="overflow-hidden flex-1 flex items-center">
        <div className="flex animate-ticker whitespace-nowrap py-2">
          {[...breaking, ...breaking].map((item, i) => (
            <Link key={i}
              href={`/news/${item.slug}`}
              className="text-sm text-slate-300 hover:text-white transition-colors mx-8 cursor-pointer font-medium"
            >
              <span style={{ color: '#DC2626' }} className="mr-2 font-bold">◆</span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
