'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useRouter } from 'next/navigation';

const supabase = createClient(
  'https://rmsjrhamjmupvrxqyagm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtc2pyaGFtam11cHZyeHF5YWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyNTEsImV4cCI6MjA4Njc5NzI1MX0.awTvF1jFf0ep7s9SdCUBnuL7e1kDaYpfATGr_7ERmVw'
);

export default function MUAProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [mua, setMua] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [params.id]);

  async function loadData() {
    const { data: muaData } = await supabase.from('leish_muas').select('*').eq('id', params.id).single();
    const { data: servicesData } = await supabase.from('leish_services').select('*').eq('mua_id', params.id);
    if (muaData) setMua(muaData);
    if (servicesData) setServices(servicesData);
  }

  function handleBook(service: any) {
    localStorage.setItem('selectedMUA', JSON.stringify(mua));
    localStorage.setItem('selectedService', JSON.stringify(service));
    router.push('/mua/booking');
  }

  if (!mua) return <div className=\"p-8\">Loading...</div>;

  return (
    <div className=\"min-h-screen bg-white\">
      <img src={mua.portfolio_images?.[0]} alt={mua.display_name} className=\"w-full h-96 object-cover\" />
      <div className=\"max-w-4xl mx-auto p-8\">
        <h1 className=\"text-4xl font-bold\">{mua.display_name}</h1>
        <p className=\"text-gray-600 mt-2\">📍 {mua.location}</p>
        <p className=\"mt-1\">⭐ {mua.rating?.toFixed(1)} Rating</p>
        <p className=\"mt-4 text-gray-700\">{mua.bio}</p>
        <h2 className=\"text-2xl font-bold mt-8 mb-4\">Services</h2>
        <div className=\"space-y-4\">
          {services.map((service) => (
            <div key={service.id} className=\"border rounded-lg p-6 flex justify-between items-center\">
              <div>
                <h3 className=\"text-xl font-bold\">{service.title}</h3>
                <p className=\"text-gray-600\">⏱ {service.duration_minutes} minutes</p>
                <p className=\"text-2xl font-bold text-pink-600 mt-2\">RM{service.price}</p>
              </div>
              <button onClick={() => handleBook(service)} className=\"bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700\">Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
