/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
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

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const billplzApiKey = Deno.env.get("BILLPLZ_API_KEY")!;
    const billplzCollectionId = Deno.env.get("BILLPLZ_COLLECTION_ID")!;
    const appBaseUrl = Deno.env.get("APP_BASE_URL")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing auth token" }, 401);
    }

    const supabaseUser = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userErr } =
      await supabaseUser.auth.getUser();

    if (userErr || !userData?.user) {
      return json({ error: "Invalid user" }, 401);
    }

    const customerId = userData.user.id;

    const body = await req.json();
    const { pro_id, package_id, scheduled_at, customer } = body;

    if (!pro_id || !package_id || !scheduled_at) {
      return json({ error: "Missing required fields" }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    const { data: pkg } = await supabase
      .from("packages")
      .select("id, pro_id, title, duration_min, price_sen")
      .eq("id", package_id)
      .single();

    if (!pkg || pkg.pro_id !== pro_id) {
      return json({ error: "Invalid package" }, 400);
    }

    // ---- OVERLAP CHECK ----
    const startTime = new Date(scheduled_at);
    const endTime = new Date(
      startTime.getTime() + pkg.duration_min * 60 * 1000
    );

    const { data: confirmedBookings } = await supabase
      .from("bookings")
      .select("id, scheduled_at")
      .eq("pro_id", pro_id)
      .eq("status", "confirmed");

    if (confirmedBookings) {
      for (const b of confirmedBookings) {
        const existingStart = new Date(b.scheduled_at);

        const { data: item } = await supabase
          .from("booking_items")
          .select("duration_min")
          .eq("booking_id", b.id)
          .single();

        if (!item) continue;

        const existingEnd = new Date(
          existingStart.getTime() + item.duration_min * 60 * 1000
        );

        if (existingStart < endTime && existingEnd > startTime) {
          return json({ error: "Time slot unavailable" }, 409);
        }
      }
    }

    const deposit = Math.max(Math.round(pkg.price_sen * 0.3), 1000);

    const { data: booking } = await supabase
      .from("bookings")
      .insert({
  customer_id: customerId,
  pro_id,
  scheduled_at,
  subtotal_sen: pkg.price_sen,
  deposit_sen: deposit,
  status: "pending_payment",
  expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
})

      .select("id")
      .single();

    const auth = "Basic " + btoa(billplzApiKey + ":");

    const form = new URLSearchParams();
    form.set("collection_id", billplzCollectionId);
    form.set("email", customer?.email ?? "customer@example.com");
    form.set("name", customer?.name ?? "Leish Customer");
    form.set("amount", deposit.toString());
    form.set("description", "Leish Booking Deposit");
    form.set("callback_url", appBaseUrl + "/api/billplz/webhook");

    const billRes = await fetch("https://www.billplz.com/api/v3/bills", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const bill = await billRes.json();

    await supabase.from("payments").insert({
      booking_id: booking.id,
      provider: "billplz",
      amount_sen: deposit,
      billplz_bill_id: bill.id,
      billplz_url: bill.url,
      status: "pending",
      raw: bill,
    });

    return json({ booking_id: booking.id, bill_url: bill.url });

  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
});
