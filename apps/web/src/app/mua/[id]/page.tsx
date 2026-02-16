export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function Profile({ params }: { params: { id: string } }) {
  const { data: pro } = await supabase
    .from("pros")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!pro) return notFound();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 max-w-4xl mx-auto">
      <img
        src={pro.profile_image_url}
        className="w-full h-80 object-cover rounded-2xl mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">{pro.display_name}</h1>

      <p className="text-gray-400 mb-8">{pro.bio}</p>

      <button className="px-8 py-4 bg-pink-500 hover:bg-pink-600 rounded-full font-semibold">
        Book Now
      </button>
    </main>
  );
}
