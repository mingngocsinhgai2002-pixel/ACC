import { createClient } from "npm:@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Only accept GET requests
    if (req.method !== "GET") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all usage logs
    const { data: usageLogs, error: logsError } = await supabase
      .from("usage_logs")
      .select("*");

    if (logsError) {
      console.error("Database error:", logsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch usage logs" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate statistics
    const totalCardsUsed = usageLogs?.length || 0;
    const uniqueCards = usageLogs
      ? new Set(usageLogs.map((log: any) => log.card_id)).size
      : 0;

    // Get unique sessions (group by timestamp/session)
    const uniqueSessions = usageLogs
      ? new Set(usageLogs.map((log: any) => {
          const date = new Date(log.timestamp);
          return date.toDateString();
        })).size
      : 0;

    // Calculate top cards
    const cardCounts = usageLogs?.reduce((acc: any, log: any) => {
      acc[log.card_id] = (acc[log.card_id] || 0) + 1;
      return acc;
    }, {}) || {};

    const topCards = Object.entries(cardCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
      .map(([cardId, count]) => ({
        card_id: cardId,
        usage_count: count,
      }));

    const stats = {
      total_cards_used: totalCardsUsed,
      unique_cards: uniqueCards,
      total_sessions: uniqueSessions,
      top_cards: topCards,
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
