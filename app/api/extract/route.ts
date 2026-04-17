import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPT = `You are a logistics document extraction AI. You receive images of waybills, proof of delivery documents, shipping labels, freight quotes, customs declarations, and similar logistics paperwork.

Extract ALL available fields into a structured JSON object. Use null for fields not found in the document. Respond with ONLY valid JSON — no explanation, no markdown.

Required output format:
{
  "document_type": "waybill | pod | shipping_label | freight_quote | customs_declaration | invoice | other",
  "reference_numbers": ["any tracking, waybill, or reference numbers found"],
  "date": "document date if visible (YYYY-MM-DD)",
  "shipper": {
    "name": "company or person name",
    "address": "full address if visible",
    "contact": "phone/email if visible"
  },
  "consignee": {
    "name": "recipient company or person",
    "address": "full address if visible",
    "contact": "phone/email if visible"
  },
  "origin": "city/location of pickup",
  "destination": "city/location of delivery",
  "cargo": [
    {
      "description": "what is being shipped",
      "quantity": "number of items/packages",
      "weight_kg": "weight if shown",
      "dimensions": "LxWxH if shown"
    }
  ],
  "total_weight_kg": "total weight if shown",
  "total_packages": "total package count",
  "service_type": "express | standard | overnight | economy | other",
  "special_instructions": "any special handling notes",
  "declared_value": "value if declared",
  "currency": "ZAR, USD, etc.",
  "additional_fields": {}
}`;

export async function POST(request: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/jpeg";

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all logistics data from this document image." },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_completion_tokens: 2000,
    }),
  });

  if (!groqRes.ok) {
    const err = await groqRes.text();
    return NextResponse.json({ error: `Groq API error: ${err}` }, { status: 502 });
  }

  const groqData = await groqRes.json();
  const rawContent = groqData.choices?.[0]?.message?.content ?? "";

  let extracted: Record<string, unknown>;
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    extracted = JSON.parse(jsonMatch?.[0] ?? rawContent);
  } catch {
    extracted = { raw_response: rawContent, parse_error: true };
  }

  return NextResponse.json({
    ok: true,
    extracted,
    model: GROQ_MODEL,
    processing_note: "Same model runs locally via Ollama for on-premise deployment",
  });
}
