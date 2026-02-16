import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Welcome to Leish</h1>
        <p className="text-2xl text-gray-600 mb-8">Your Beauty Marketplace</p>
        <Link 
          href="/mua" 
          className="inline-block bg-pink-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-pink-700 transition"
        >
          Find Makeup Artists
        </Link>
      </div>
    </div>
  );
}