import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are an expert assistant for "Rules for Responsible Modeling" - a comprehensive guide to hydrological and environmental modeling by Dr. William James.

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
- Reference specific chapters when relevant
- Provide practical examples from SWMM, ICM, or general hydrology
- Keep answers concise but informative
- If asked about ICM SWMM vs ICM InfoWorks, note that ICM SWMM uses SWMM's engine while ICM uses Innovyze's proprietary engine`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
