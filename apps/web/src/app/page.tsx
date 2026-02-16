import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: pros, error } = await supabase
    .from("pros")
    .select("id, display_name, bio, profile_image_url")
    .limit(6);

  if (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-pink-400">
        Featured Makeup Artists
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pros?.map((pro) => (
          <div
            key={pro.id}
            className="bg-[#1e1e2e] border border-[#2a2a3e] rounded-2xl p-6 hover:border-pink-400 transition"
          >
            <div className="w-full h-48 bg-gray-800 rounded-xl mb-4 overflow-hidden">
              {pro.profile_image_url ? (
                <img
                  src={pro.profile_image_url}
                  alt={pro.display_name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <h2 className="text-xl font-semibold">
              {pro.display_name}
            </h2>

            <p className="text-gray-400 mt-2 text-sm line-clamp-3">
              {pro.bio}
            </p>

            <button className="mt-4 w-full py-2 rounded-full bg-pink-500 hover:bg-pink-600 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
