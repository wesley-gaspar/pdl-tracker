-- Create table for player stats history
CREATE TABLE public.player_stats_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  puuid TEXT NOT NULL,
  game_name TEXT NOT NULL,
  tag_line TEXT NOT NULL,
  queue_type TEXT NOT NULL DEFAULT 'RANKED_SOLO_5x5',
  tier TEXT NOT NULL,
  rank TEXT NOT NULL,
  league_points INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  losses INTEGER NOT NULL,
  total_games INTEGER NOT NULL,
  total_lp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_player_stats_puuid_queue ON public.player_stats_history(puuid, queue_type);
CREATE INDEX idx_player_stats_created ON public.player_stats_history(created_at);

-- Enable RLS (public read for now since no auth)
ALTER TABLE public.player_stats_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read player stats" 
ON public.player_stats_history 
FOR SELECT 
USING (true);

-- Allow insert from edge functions (service role)
CREATE POLICY "Service role can insert stats" 
ON public.player_stats_history 
FOR INSERT 
WITH CHECK (true);