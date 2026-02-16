/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRole) {
      return json({ error: "Missing environment variables" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "expired" })
      .eq("status", "pending_payment")
      .lt("expires_at", now)
      .select("id");

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({
      message: "Expired bookings cleaned",
      expired_count: data?.length ?? 0,
      timestamp: now,
    });

  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
});
