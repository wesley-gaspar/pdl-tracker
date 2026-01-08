import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Tier order from lowest to highest
const TIER_ORDER = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

const DIVISION_ORDER = ["IV", "III", "II", "I"];
const LP_PER_DIVISION = 100;
const LP_PER_TIER = 400;
const MASTER_BASE_LP = 2800;

function calculateTotalLP(
  tier: string,
  rank: string,
  leaguePoints: number
): number {
  const tierIndex = TIER_ORDER.indexOf(tier);

  if (tier === "MASTER" || tier === "GRANDMASTER" || tier === "CHALLENGER") {
    const highTierBonus =
      (tierIndex - TIER_ORDER.indexOf("MASTER")) * LP_PER_TIER;
    return MASTER_BASE_LP + highTierBonus + leaguePoints;
  }

  const divisionIndex = DIVISION_ORDER.indexOf(rank);
  const tierLP = tierIndex * LP_PER_TIER;
  const divisionLP = divisionIndex * LP_PER_DIVISION;

  return tierLP + divisionLP + leaguePoints;
}

interface QueueData {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

// deno-lint-ignore no-explicit-any
async function checkAndSaveStats(
  supabase: any,
  puuid: string,
  gameName: string,
  tagLine: string,
  queueType: string,
  queueData: QueueData
) {
  const totalGames = queueData.wins + queueData.losses;
  const totalLP = calculateTotalLP(
    queueData.tier,
    queueData.rank,
    queueData.leaguePoints
  );

  // Get the latest record for this player and queue
  const { data: latestRecord, error: fetchError } = await supabase
    .from("player_stats_history")
    .select("total_games")
    .eq("puuid", puuid)
    .eq("queue_type", queueType)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching latest record:", fetchError);
    return;
  }

  // Only save if this is first record OR total games changed (new match played)
  const shouldSave = !latestRecord || latestRecord.total_games !== totalGames;

  if (shouldSave) {
    console.log(
      `Saving new stats for ${gameName}#${tagLine} - ${queueType}. Games: ${totalGames}, Total LP: ${totalLP}`
    );

    const { error: insertError } = await supabase
      .from("player_stats_history")
      .insert({
        puuid,
        game_name: gameName,
        tag_line: tagLine,
        queue_type: queueType,
        tier: queueData.tier,
        rank: queueData.rank,
        league_points: queueData.leaguePoints,
        wins: queueData.wins,
        losses: queueData.losses,
        total_games: totalGames,
        total_lp: totalLP,
      });

    if (insertError) {
      console.error("Error saving stats:", insertError);
    } else {
      console.log("Stats saved successfully");
    }
  } else {
    console.log(
      `No new games for ${gameName}#${tagLine} - ${queueType}. Skipping save.`
    );
  }
}

// deno-lint-ignore no-explicit-any
async function getFirstRecordLP(
  supabase: any,
  puuid: string,
  queueType: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from("player_stats_history")
    .select("total_lp")
    .eq("puuid", puuid)
    .eq("queue_type", queueType)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching first record:", error);
    return null;
  }

  return data?.total_lp as number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RIOT_API_KEY = Deno.env.get("RIOT_API_KEY");
    if (!RIOT_API_KEY) {
      throw new Error("RIOT_API_KEY is not set");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not set");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Calculate total LP and get baseline LP for comparison
    let soloQueueWithLP = null;
    let flexQueueWithLP = null;

    if (soloQueue) {
      const totalLP = calculateTotalLP(
        soloQueue.tier,
        soloQueue.rank,
        soloQueue.leaguePoints
      );

      // Check and save stats if new game
      await checkAndSaveStats(
        supabase,
        accountData.puuid,
        accountData.gameName,
        accountData.tagLine,
        "RANKED_SOLO_5x5",
        {
          tier: soloQueue.tier,
          rank: soloQueue.rank,
          leaguePoints: soloQueue.leaguePoints,
          wins: soloQueue.wins,
          losses: soloQueue.losses,
        }
      );

      // Get first record LP for comparison
      const firstRecordLP = await getFirstRecordLP(
        supabase,
        accountData.puuid,
        "RANKED_SOLO_5x5"
      );
      const lpDifference = firstRecordLP !== null ? totalLP - firstRecordLP : 0;

      soloQueueWithLP = {
        ...soloQueue,
        totalLP,
        lpDifference,
        hasBaseline: firstRecordLP !== null,
      };
    }

    if (flexQueue) {
      const totalLP = calculateTotalLP(
        flexQueue.tier,
        flexQueue.rank,
        flexQueue.leaguePoints
      );

      // Check and save stats if new game
      await checkAndSaveStats(
        supabase,
        accountData.puuid,
        accountData.gameName,
        accountData.tagLine,
        "RANKED_FLEX_SR",
        {
          tier: flexQueue.tier,
          rank: flexQueue.rank,
          leaguePoints: flexQueue.leaguePoints,
          wins: flexQueue.wins,
          losses: flexQueue.losses,
        }
      );

      // Get first record LP for comparison
      const firstRecordLP = await getFirstRecordLP(
        supabase,
        accountData.puuid,
        "RANKED_FLEX_SR"
      );
      const lpDifference = firstRecordLP !== null ? totalLP - firstRecordLP : 0;

      flexQueueWithLP = {
        ...flexQueue,
        totalLP,
        lpDifference,
        hasBaseline: firstRecordLP !== null,
      };
    }

    const result = {
      puuid: accountData.puuid,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      soloQueue: soloQueueWithLP,
      flexQueue: flexQueueWithLP,
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
