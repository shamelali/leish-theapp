export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-pink-50 to-white">
        <h1 className="text-5xl font-bold tracking-tight">
          Leish
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl">
          Malaysia’s No.1 Beauty & Makeup Artist Booking Platform.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition">
            Find MUA
          </button>
          <button className="px-6 py-3 rounded-full border border-black hover:bg-gray-100 transition">
            Become a Pro
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-3">Verified Artists</h3>
          <p className="text-gray-600">
            Book trusted and verified makeup professionals near you.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
          <p className="text-gray-600">
            Safe checkout powered by Billplz.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Instant Booking</h3>
          <p className="text-gray-600">
            Real-time availability and instant confirmation.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to glow?
        </h2>
        <p className="mt-4 text-gray-300">
          Discover top beauty professionals across Malaysia.
        </p>
        <button className="mt-8 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition">
          Start Booking
        </button>
      </section>
    </main>
  );
}
