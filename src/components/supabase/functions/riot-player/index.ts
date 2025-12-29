import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RIOT_API_KEY = Deno.env.get("RIOT_API_KEY");
    if (!RIOT_API_KEY) {
      throw new Error("RIOT_API_KEY is not set");
    }

    const { gameName, tagLine } = await req.json();

    if (!gameName || !tagLine) {
      throw new Error("gameName and tagLine are required");
    }

    console.log(`Fetching player: ${gameName}#${tagLine}`);

    // Step 1: Get PUUID from Riot Account API
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);

    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
    console.log(`Account URL: ${accountUrl}`);

    const accountResponse = await fetch(accountUrl, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
    });

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text();
      console.error(
        `Account API error: ${accountResponse.status} - ${errorText}`
      );
      throw new Error(`Failed to fetch account: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    console.log("Account data:", accountData);

    // Step 2: Get League entries using PUUID
    const leagueUrl = `https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/${accountData.puuid}`;
    console.log(`League URL: ${leagueUrl}`);

    const leagueResponse = await fetch(leagueUrl, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY,
      },
    });

    if (!leagueResponse.ok) {
      const errorText = await leagueResponse.text();
      console.error(
        `League API error: ${leagueResponse.status} - ${errorText}`
      );
      throw new Error(`Failed to fetch league data: ${leagueResponse.status}`);
    }

    const leagueData = await leagueResponse.json();
    console.log("League data:", leagueData);

    // Find Solo/Duo queue data (priority) or Flex
    const soloQueue = leagueData.find(
      (entry: any) => entry.queueType === "RANKED_SOLO_5x5"
    );
    const flexQueue = leagueData.find(
      (entry: any) => entry.queueType === "RANKED_FLEX_SR"
    );

    const result = {
      puuid: accountData.puuid,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      soloQueue: soloQueue || null,
      flexQueue: flexQueue || null,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in riot-player function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
