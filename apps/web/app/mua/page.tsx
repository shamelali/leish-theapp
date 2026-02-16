'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://rmsjrhamjmupvrxqyagm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtc2pyaGFtam11cHZyeHF5YWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyNTEsImV4cCI6MjA4Njc5NzI1MX0.awTvF1jFf0ep7s9SdCUBnuL7e1kDaYpfATGr_7ERmVw'
);

export default function MUAHomePage() {
  const [muas, setMuas] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMUAs();
  }, []);

  async function loadMUAs() {
    const { data } = await supabase.from('leish_muas').select('*').order('rating', { ascending: false });
    if (data) setMuas(data);
  }

  const filtered = muas.filter(m =>
    m.location?.toLowerCase().includes(search.toLowerCase()) ||
    m.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Find Your Perfect MUA</h1>
        <p className="text-gray-600 mb-8">Book professional makeup artists in your locality</p>
        <input type="text" placeholder="Search by location (Cyberjaya, KL, Putrajaya...)" className="w-full p-4 border rounded-lg mb-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mua) => (
            <Link key={mua.id} href={`/mua/${mua.id}`} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={mua.portfolio_images?.[0] || '/placeholder.jpg'} alt={mua.display_name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold">{mua.display_name}</h3>
                <p className="text-gray-600 text-sm mt-1">📍 {mua.location}</p>
                <p className="text-sm mt-1">⭐ {mua.rating?.toFixed(1)}</p>
                <p className="text-pink-600 font-bold mt-2">From RM{mua.price_start}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}