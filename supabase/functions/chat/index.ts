import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hard limits so a client cannot send a 5 MB transcript or a system-role override.
const MAX_MESSAGES = 30;
const MAX_CHARS_PER_MESSAGE = 4000;
const MAX_TOTAL_CHARS = 24000;

type ChatMessage = { role: "user" | "assistant"; content: string };

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null;
  const out: ChatMessage[] = [];
  let total = 0;
  for (const m of input) {
    if (!m || typeof m !== "object") return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    // Only user/assistant turns are accepted; a client-supplied "system" message would
    // be appended AFTER the real system prompt and override it.
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_CHARS_PER_MESSAGE) return null;
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return null;
    out.push({ role, content });
  }
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

type Source = { n: number; chapter: number; section: string; text: string };
const MAX_SOURCES = 4;
const MAX_SOURCE_CHARS = 1000;

// Sources are the app's own chapter summaries, picked in the browser for the latest question.
function sanitizeSources(input: unknown): Source[] {
  if (!Array.isArray(input)) return [];
  const out: Source[] = [];
  for (const s of input.slice(0, MAX_SOURCES)) {
    if (!s || typeof s !== "object") continue;
    const { n, chapter, section, text } = s as Record<string, unknown>;
    if (!Number.isInteger(n) || (n as number) < 1 || (n as number) > MAX_SOURCES) continue;
    if (!Number.isInteger(chapter) || (chapter as number) < 1 || (chapter as number) > 17) continue;
    if (typeof section !== "string" || typeof text !== "string" || !text.trim()) continue;
    out.push({ n: n as number, chapter: chapter as number, section: section.slice(0, 120), text: text.slice(0, MAX_SOURCE_CHARS) });
  }
  return out;
}

const basePrompt = `You are "Ask James", an AI study assistant for the interactive edition of "Rules for Responsible Modeling" by William James (4th edition, 2005). You are not William James and you do not have the book's text.

Key principles of the framework:
1. Models inform decisions; they don't predict perfectly
2. Uncertainty should be quantified and communicated, not hidden
3. Optimal complexity exists: too simple misses physics, too complex amplifies uncertainty
4. Rainfall is often the largest uncertainty source in urban drainage
5. Validation on independent data is essential

Rules for honesty about sources:
- You will be given numbered SOURCES. They are summaries written by the app's authors, NOT quotations from William James. Never present any wording as a direct quote from him, and never put his name on a quotation.
- When a sentence relies on a source, put its marker right after it, e.g. "Validation needs independent data [2]."
- Only name a chapter when a source gives it. Never invent section numbers, page numbers or quotations.
- If no source covers the question, say "The app's chapter summaries don't cover this directly" and then give general modeling guidance, clearly labelled as general guidance.
- Use "the framework suggests" or "the app's summary of Chapter N says", not "Dr. James says".

When answering:
- Give practical SWMM5, ICM SWMM or ICM InfoWorks examples where relevant
- Keep answers concise
- When asked about subcatchment counts, ask about available data first
- Challenge the assumption that maximum complexity is best`;

function buildSystemPrompt(sources: Source[]): string {
  if (sources.length === 0) return `${basePrompt}\n\nSOURCES: none matched this question.`;
  const list = sources.map((s) => `[${s.n}] App summary of Chapter ${s.chapter}, "${s.section}": ${s.text}`).join("\n");
  return `${basePrompt}\n\nSOURCES (app-written summaries, not quotations):\n${list}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json().catch(() => null);
    const messages = sanitizeMessages(body?.messages);
    const sources = sanitizeSources(body?.sources);
    if (!messages) {
      return new Response(JSON.stringify({ error: "Invalid messages payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: buildSystemPrompt(sources) },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: "Unable to answer right now. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
