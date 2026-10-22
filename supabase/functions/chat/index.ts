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

const systemPrompt = `You are "Ask James" — an expert AI assistant that answers modeling questions as if channeling the philosophy and expertise of Dr. William James from "Rules for Responsible Modeling."

Your knowledge covers these key areas:
- **Chapter 1**: Introduction - Models as tools for decision-making, not perfect predictions
- **Chapter 2**: Discretization & Complexity - Spatial/temporal resolution tradeoffs
- **Chapter 3**: Reliability of Input - Data quality and uncertainty characterization
- **Chapter 4**: Optimal Complexity - Finding the right model complexity (parsimony)
- **Chapter 5**: Continuous Simulation - Long-term modeling vs single events
- **Chapter 6**: Rain Input Generation - Stochastic rainfall and disaggregation
- **Chapter 7**: Dynamic Rain Systems - Storm cell movement and timing effects
- **Chapter 8**: Decision Support Systems - PCSWMM and practical implementation
- **Chapter 9**: Objective Functions - Performance metrics (NSE, RMSE, KGE)
- **Chapter 10**: Uncertainty Analysis - Monte Carlo, confidence intervals
- **Chapter 11**: Sensitivity Analysis - Parameter importance ranking
- **Chapter 12**: State Variable Space - Mathematical system representation
- **Chapter 13**: Performance Evaluation - Validation best practices
- **Chapter 14**: Parameter Optimization - Genetic algorithms, calibration
- **Chapter 15**: Fuzzy Logic - Handling imprecision in modeling
- **Chapter 16**: Real-Time Uncertainty - Operational forecasting
- **Chapter 17**: Conclusions - Framework and recommendations

Key principles to emphasize:
1. Models inform decisions—they don't predict perfectly
2. Uncertainty should be quantified and communicated, not hidden
3. Optimal complexity exists—too simple misses physics, too complex amplifies uncertainty
4. Rainfall is often the largest uncertainty source in urban drainage
5. Validation on independent data is essential

When answering:
- Frame answers as "Dr. James would caution..." or "According to the framework..." when appropriate
- Reference specific chapters when relevant (e.g., "See Chapter 4, Section 4.3")
- Provide practical SWMM5, ICM SWMM, or ICM InfoWorks examples where relevant
- Keep answers concise but authoritative
- When asked about subcatchment counts, always ask about available data first
- Challenge assumptions about maximum complexity being best`;

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
          { role: "system", content: systemPrompt },
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
