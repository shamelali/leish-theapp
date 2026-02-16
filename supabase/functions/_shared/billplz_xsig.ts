function normalizeKey(key: string): string {
  return key.replaceAll("[", "").replaceAll("]", "");
}

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = aHex.toLowerCase();
  const b = bHex.toLowerCase();
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function parseFormUrlEncoded(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const sp = new URLSearchParams(body);
  for (const [k, v] of sp.entries()) out[k] = v;
  return out;
}

export async function verifyBillplzXSignature(
  params: Record<string, string>,
  xSignatureKey: string
): Promise<boolean> {
  const sig = (params["x_signature"] ?? params["billplz[x_signature]"] ?? "").trim();
  if (!sig) return false;

  const elements = Object.entries(params)
    .filter(([k]) => k !== "x_signature" && k !== "billplz[x_signature]")
    .map(([k, v]) => normalizeKey(k) + (v ?? ""));

  elements.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const source = elements.join("|");
  const computed = await hmacSha256Hex(source, xSignatureKey);

  return timingSafeEqualHex(computed, sig);
}
