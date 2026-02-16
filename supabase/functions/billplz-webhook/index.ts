/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseFormUrlEncoded, verifyBillplzXSignature } from "../_shared/billplz_xsig.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

function text(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, "Content-Type": "text/plain" } });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return text("ok");
  if (req.method !== "POST") return text("method not allowed", 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const xSigKey = Deno.env.get("BILLPLZ_XSIGNATURE_KEY")!;
  if (!supabaseUrl || !serviceRole || !xSigKey) return text("missing env", 500);

  // Billplz callback examples use application/x-www-form-urlencoded
  const rawBody = await req.text();
  const params = parseFormUrlEncoded(rawBody);

  // 1) Verify x_signature per Billplz docs (sorted elements + HMAC-SHA256)
  const ok = await verifyBillplzXSignature(params, xSigKey);
  if (!ok) return text("invalid signature", 401);

  // 2) Extract fields (support both callback keys and redirect keys)
  const billId = params["id"] ?? params["billplz[id]"];
  const paidStr = params["paid"] ?? params["billplz[paid]"];
  const state = params["state"] ?? params["billplz[state]"] ?? "";
  const paidAt = params["paid_at"] ?? params["billplz[paid_at]"] ?? null;

  if (!billId) return text("missing bill id", 400);

  const paid = (paidStr ?? "").toString() === "true";

  const supabase = createClient(supabaseUrl, serviceRole);

  // 3) Lookup payment by bill ID
  const { data: payment, error: payErr } = await supabase
    .from("payments")
    .select("id, booking_id, status, amount_sen")
    .eq("billplz_bill_id", billId)
    .single();

  if (payErr || !payment) return text("payment not found", 404);

  // 4) Idempotency: if already paid, return OK
  if (payment.status === "paid") return text("ok", 200);

  // Optional: amount validation (prevents mismatched bills being applied)
  // Billplz sends amount as smallest unit in examples. You also store amount_sen in payments.
  const amountIncoming = params["amount"] ?? params["billplz[amount]"];
  if (amountIncoming && Number(amountIncoming) !== Number(payment.amount_sen)) {
    // signature could still be valid but wrong bill/amount mapping in your system config
    // log raw payload for investigation
    await supabase.from("payments").update({ raw: params }).eq("id", payment.id);
    return text("amount mismatch", 409);
  }

  // 5) Update statuses
  if (paid && state === "paid") {
  await supabase.rpc("confirm_payment_atomic", {
    p_bill_id: billId,
    p_paid_at: paidAt,
    p_raw: params,
  });

  return text("ok", 200);
}


  // Not paid / failed / due
  await supabase.from("payments").update({
    status: "failed",
    raw: params,
  }).eq("id", payment.id);

  return text("ok", 200);
});
