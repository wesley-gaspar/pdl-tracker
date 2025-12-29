import { PlayerWithConfig } from '@/services/riotApi';
import { LaneBadge } from './LaneBadge';
import { TierBadge } from './TierBadge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Trophy, ImagePlus, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

interface PlayerCardProps {
  player: PlayerWithConfig;
  index: number;
}

export function PlayerCard({ player, index }: PlayerCardProps) {
  const [imageUrl, setImageUrl] = useState(player.photoUrl || '');
  const [isEditing, setIsEditing] = useState(false);

  // Usa dados do Solo Queue, ou Flex se não tiver Solo
  const queueData = player.soloQueue || player.flexQueue;
  const queueType = player.soloQueue ? 'Solo/Duo' : player.flexQueue ? 'Flex' : 'Unranked';

  const winRate = queueData 
    ? ((queueData.wins / (queueData.wins + queueData.losses)) * 100).toFixed(1)
    : '0';

  const totalGames = queueData ? queueData.wins + queueData.losses : 0;

  return (
    <Card
      className="glass-card card-glow overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Player Photo Section */}
          <div 
            className="relative w-full md:w-48 h-48 md:h-auto bg-muted/50 flex items-center justify-center group cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={player.gameName}
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

          {/* Player Info Section */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gold-gradient mb-2">
                  {player.gameName}
                  <span className="text-muted-foreground font-normal text-lg ml-1">#{player.tagLine}</span>
                </h3>
                <div className="flex items-center gap-2">
                  <LaneBadge lane={player.lane} />
                  {player.secondaryLane && <LaneBadge lane={player.secondaryLane} />}
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {queueType}
                  </span>
                </div>
              </div>
              {queueData && (
                <TierBadge tier={queueData.tier} division={queueData.rank} />
              )}
            </div>

            {queueData ? (
              /* Stats Grid */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Win Rate */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Win Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{winRate}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {queueData.wins}W {queueData.losses}L
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">PDL</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{queueData.leaguePoints}</div>
                  <div className="text-xs text-muted-foreground mt-1">Pontos de Liga</div>
                </div>

                {/* Games */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Gamepad2 className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Partidas</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{totalGames}</div>
                  <div className="text-xs text-muted-foreground mt-1">Esta season</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Jogador não ranqueado esta season</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
