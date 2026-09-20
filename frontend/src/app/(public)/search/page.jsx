"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from "@/services/api";
import NewsCard from "@/components/news/NewsCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    api.get('/news', { params: { search: query, limit: 20 } })
      .then(({ data }) => setNews(data.data))
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        "{query}" के लिए खोज परिणाम ({news.length})
      </h1>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => <NewsCard key={item._id} news={item} size="large" />)}
          {news.length === 0 && <p className="text-gray-400 col-span-3 text-center py-20">कोई परिणाम नहीं मिला</p>}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}
