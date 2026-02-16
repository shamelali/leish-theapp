"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-center py-20 px-6 border-b border-[#2a2a3e]">
        <div className="text-6xl mb-4">💄</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-200 bg-clip-text text-transparent">
          Leish!
        </h1>
        <p className="mt-4 text-gray-300 text-lg">
          Find Your Perfect Makeup Artist in Malaysia
        </p>

        <div className="mt-8 max-w-xl mx-auto relative">
          <input
            placeholder="Search by location, style, or artist name..."
            className="w-full rounded-full bg-[#1e1e2e] border border-[#2a2a3e] px-6 py-4 text-white focus:outline-none focus:border-pink-400"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-400 text-xl">
            🔍
          </span>
        </div>

        <div className="flex justify-center gap-10 mt-12 flex-wrap">
          <Stat number="500+" label="Verified MUAs" />
          <Stat number="10K+" label="Happy Clients" />
          <Stat number="13" label="States Covered" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-pink-400 mb-12">
          Why Choose Leish?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <Feature icon="✨" title="Verified Professionals" desc="All MUAs are verified with portfolios and client reviews" />
          <Feature icon="📍" title="Location-Based" desc="Find talented MUAs near you across Malaysia" />
          <Feature icon="💰" title="Transparent Pricing" desc="Clear pricing with no hidden charges" />
          <Feature icon="⭐" title="Real Reviews" desc="Genuine reviews from verified clients" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-center py-20">
        <h2 className="text-3xl font-bold">Ready to glow?</h2>
        <p className="mt-4 text-gray-400">
          Discover top beauty professionals across Malaysia.
        </p>
        <button className="mt-8 px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold transition">
          Browse All MUAs
        </button>
      </section>
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-pink-400">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-[#1e1e2e] border border-[#2a2a3e] rounded-2xl p-6 text-center hover:border-pink-400 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
