'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const bookingData = localStorage.getItem('booking');
    if (bookingData) setBooking(JSON.parse(bookingData));
  }, []);

  function handlePayment() {
    alert('Payment Successful! Booking confirmed. Receipt sent to email.');
    localStorage.removeItem('selectedMUA');
    localStorage.removeItem('selectedService');
    localStorage.removeItem('booking');
    router.push('/mua');
  }

  if (!booking) return <div className=\"p-8\">Loading...</div>;

  return (
    <div className=\"min-h-screen bg-white p-8\">
      <div className=\"max-w-2xl mx-auto\">
        <h1 className=\"text-4xl font-bold mb-8\">Payment</h1>
        
        <div className=\"bg-gray-50 p-8 rounded-lg mb-8 text-center\">
          <p className=\"text-gray-600 mb-2\">Amount to Pay</p>
          <p className=\"text-5xl font-bold text-pink-600\">RM{booking.total_amount}</p>
          <p className=\"text-sm text-gray-500 mt-4\">Booking ID: {booking.id?.substring(0, 8)}</p>
        </div>

        <div className=\"space-y-4\">
          <button className=\"w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-700 text-lg\">
            💳 Pay with FPX
          </button>
          <button className=\"w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 text-lg\">
            💳 Pay with Card
          </button>
          <button className=\"w-full bg-orange-600 text-white p-4 rounded-lg font-bold hover:bg-orange-700 text-lg\">
            📱 Pay with E-Wallet
          </button>
          <button 
            onClick={handlePayment}
            className=\"w-full bg-purple-600 text-white p-4 rounded-lg font-bold hover:bg-purple-700 text-lg mt-8\"
          >
            ✅ Mock Payment (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
