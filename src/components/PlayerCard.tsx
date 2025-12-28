import { PlayerStats } from '@/types/player';
import { LaneBadge } from '@/components/LaneBadge';
import { TierBadge } from '@/components/TierBadge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Swords, Trophy, ImagePlus } from 'lucide-react';
import { useState } from 'react';

interface PlayerCardProps {
  player: PlayerStats;
  index: number;
}

export function PlayerCard({ player, index }: PlayerCardProps) {
  const [imageUrl, setImageUrl] = useState(player.photoUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  const kda = player.deaths === 0 
    ? 'Perfect' 
    : ((player.kills + player.assists) / player.deaths).toFixed(2);
  
  const kdaColor = 
    kda === 'Perfect' || parseFloat(kda) >= 4 
      ? 'text-tier-emerald' 
      : parseFloat(kda) >= 3 
        ? 'text-tier-gold' 
        : parseFloat(kda) >= 2 
          ? 'text-foreground' 
          : 'text-tier-bronze';

  const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1);

  return (
    <Card
      className="glass-card card-glow overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">

          {/* Player Info Section */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gold-gradient mb-2">
                  {player.summonerName}
                </h3>
                <LaneBadge lane={player.lane} />
              </div>
              <TierBadge tier={player.tier} division={player.division} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KDA */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Swords className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">KDA</span>
                </div>
                <div className={`text-2xl font-bold ${kdaColor}`}>{kda}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {player.kills}/{player.deaths}/{player.assists}
                </div>
              </div>

              {/* Win Rate */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Win Rate</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{winRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {player.wins}W {player.losses}L
                </div>
              </div>

              {/* LP */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">PDL</span>
                </div>
                <div className="text-2xl font-bold text-primary">{player.leaguePoints}</div>
                <div className="text-xs text-muted-foreground mt-1">Pontos de Liga</div>
              </div>

              {/* Games */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Swords className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide">Partidas</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {player.wins + player.losses}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Esta season</div>
              </div>
            </div>
          </div>
          <div 
            className="relative w-full md:w-56 h-48 md:h-auto min-h-[200px] bg-muted/50 flex items-center justify-center group cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={player.summonerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="w-12 h-12" />
                <span className="text-xs">Adicionar foto</span>
              </div>
            )}
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-sm text-foreground">Clique para editar</span>
            </div>
            
            {isEditing && (
              <div className="absolute inset-0 bg-background/95 p-4 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="URL da imagem"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
