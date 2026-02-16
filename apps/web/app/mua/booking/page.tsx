'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient('https://rmsjrhamjmupvrxqyagm.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtc2pyaGFtam11cHZyeHF5YWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyNTEsImV4cCI6MjA4Njc5NzI1MX0.awTvF1jFf0ep7s9SdCUBnuL7e1kDaYpfATGr_7ERmVw');

export default function BookingPage() {
  const router = useRouter();
  const [mua, setMua] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '2026-03-15', time: '10:00' });

  useEffect(() => {
    const muaData = localStorage.getItem('selectedMUA');
    const serviceData = localStorage.getItem('selectedService');
    if (muaData) setMua(JSON.parse(muaData));
    if (serviceData) setService(JSON.parse(serviceData));
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const { data } = await supabase.from('leish_bookings').insert({
      mua_id: mua.id, service_id: service.id, booking_date: form.date, booking_time: form.time,
      total_amount: service.price, client_name: form.name, client_email: form.email, 
      client_phone: form.phone, status: 'pending'
    }).select().single();
    if (data) {
      localStorage.setItem('booking', JSON.stringify(data));
      router.push('/mua/payment');
    }
  }

  if (!mua || !service) return <div className=\"p-8\">Loading...</div>;

  return (
    <div className=\"min-h-screen bg-white p-8\">
      <div className=\"max-w-2xl mx-auto\">
        <h1 className=\"text-4xl font-bold mb-8\">Book Appointment</h1>
        <div className=\"bg-gray-50 p-6 rounded-lg mb-8\">
          <h2 className=\"text-xl font-bold\">{mua.display_name}</h2>
          <p className=\"text-gray-600\">{service.title}</p>
          <p className=\"text-2xl font-bold text-pink-600 mt-2\">RM{service.price}</p>
        </div>
        <form onSubmit={handleSubmit} className=\"space-y-4\">
          <div><label className=\"block font-bold mb-2\">Name</label><input required className=\"w-full p-3 border rounded\" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className=\"block font-bold mb-2\">Email</label><input required type=\"email\" className=\"w-full p-3 border rounded\" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label className=\"block font-bold mb-2\">Phone</label><input required className=\"w-full p-3 border rounded\" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className=\"block font-bold mb-2\">Date</label><input required type=\"date\" className=\"w-full p-3 border rounded\" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
          <div><label className=\"block font-bold mb-2\">Time</label><input required type=\"time\" className=\"w-full p-3 border rounded\" value={form.time} onChange={e => setForm({...form, time: e.target.value})} /></div>
          <button type=\"submit\" className=\"w-full bg-pink-600 text-white p-4 rounded-lg font-bold hover:bg-pink-700\">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
}
