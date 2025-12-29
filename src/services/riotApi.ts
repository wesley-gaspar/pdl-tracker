import { supabase } from "@/integrations/supabase/client";
import type { Tier, Division, Lane } from "@/types/player";

export interface RiotPlayerData {
  puuid: string;
  gameName: string;
  tagLine: string;
  soloQueue: {
    tier: Tier;
    rank: Division;
    leaguePoints: number;
    wins: number;
    losses: number;
  } | null;
  flexQueue: {
    tier: Tier;
    rank: Division;
    leaguePoints: number;
    wins: number;
    losses: number;
  } | null;
}

export interface PlayerConfig {
  gameName: string;
  tagLine: string;
  lane: Lane;
  photoUrl?: string;
  secondaryLane?: Lane; 
}

export interface PlayerWithConfig extends RiotPlayerData {
  lane: Lane;
  secondaryLane?: Lane;
  photoUrl?: string;
}

export const fetchPlayerData = async (gameName: string, tagLine: string): Promise<RiotPlayerData> => {
  const { data, error } = await supabase.functions.invoke('riot-player', {
    body: { gameName, tagLine },
  });

  if (error) {
    console.error('Error fetching player data:', error);
    throw new Error(error.message || 'Failed to fetch player data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as RiotPlayerData;
};

export const fetchMultiplePlayers = async (players: PlayerConfig[]): Promise<PlayerWithConfig[]> => {
  const results = await Promise.allSettled(
    players.map(async (player) => {
      const data = await fetchPlayerData(player.gameName, player.tagLine);
      return {
        ...data,
        lane: player.lane,
        photoUrl: player.photoUrl,
        secondaryLane: player.secondaryLane
      };
    })
  );

  const successfulResults: PlayerWithConfig[] = [];
  
  for (const result of results) {
    if (result.status === 'fulfilled') {
      successfulResults.push(result.value);
    }
  }

  return successfulResults;
};
