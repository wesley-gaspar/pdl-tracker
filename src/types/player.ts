export type Lane = 'Top' | 'Jungle' | 'Mid' | 'Adc' | 'Support';

export type Tier = 
  | 'IRON' 
  | 'BRONZE' 
  | 'SILVER' 
  | 'GOLD' 
  | 'PLATINUM' 
  | 'EMERALD' 
  | 'DIAMOND' 
  | 'MASTER' 
  | 'GRANDMASTER' 
  | 'CHALLENGER';

export type Division = 'I' | 'II' | 'III' | 'IV';

export interface PlayerStats {
  id: string;
  summonerName: string;
  lane: Lane;
  secondaryLane: Lane;
  tier: Tier;
  division: Division;
  leaguePoints: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  photoUrl?: string;
}

export interface SummonerResponse {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface LeagueEntryResponse {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: Tier;
  rank: Division;
  leaguePoints: number;
  wins: number;
  losses: number;
}
