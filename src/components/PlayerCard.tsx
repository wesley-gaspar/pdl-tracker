import { PlayerWithConfig } from "@/services/riotApi";
import { LaneBadge } from "./LaneBadge";
import { TierBadge } from "./TierBadge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Gamepad2,
  Minus,
  User,
} from "lucide-react";
import { formatLPDifference, getLPDifferenceColor } from "@/lib/lpCalculator";

interface PlayerCardProps {
  player: PlayerWithConfig;
  index: number;
}

const getPlayerPhotoPath = (gameName: string): string => {
  // Normaliza o nome para usar como nome de arquivo (lowercase, sem espaços)
  const normalizedName = gameName.toLowerCase().replace(/\s+/g, "-");
  return `/players/${normalizedName}.png`;
};

export function PlayerCard({ player, index }: PlayerCardProps) {
  // Usa dados do Solo Queue, ou Flex se não tiver Solo
  const queueData = player.soloQueue || player.flexQueue;
  const queueType = player.soloQueue
    ? "Solo/Duo"
    : player.flexQueue
    ? "Flex"
    : "Unranked";

  const winRate = queueData
    ? ((queueData.wins / (queueData.wins + queueData.losses)) * 100).toFixed(1)
    : "0";

  const totalGames = queueData ? queueData.wins + queueData.losses : 0;

  const photoPath = getPlayerPhotoPath(player.gameName);

  // LP difference icon and color
  const getLPIcon = (difference: number) => {
    if (difference > 0) return <TrendingUp className="w-3 h-3" />;
    if (difference < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <Card
      className="glass-card card-glow overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="relative w-full md:w-36 h-32 md:h-auto bg-muted/50 flex-shrink-0 overflow-hidden">
            <img
              src={photoPath}
              alt={player.gameName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const placeholder = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
            <div
              className="absolute inset-0 flex-col items-center justify-center gap-1 text-muted-foreground bg-muted/50"
              style={{ display: "none" }}
            >
              <User className="w-8 h-8" />
              <span className="text-[10px]">Sem foto</span>
            </div>
          </div>
          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gold-gradient mb-1">
                  {player.gameName}
                  <span className="text-muted-foreground font-normal text-sm ml-1">
                    #{player.tagLine}
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <LaneBadge lane={player.lane} />
                  {player.secondaryLane && (
                    <LaneBadge lane={player.secondaryLane} />
                  )}
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
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                    <Trophy className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">
                      Win Rate
                    </span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {winRate}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {queueData.wins}W {queueData.losses}L
                  </div>
                </div>

                {/* LP Difference */}
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                    {getLPIcon(queueData.lpDifference)}
                    <span className="text-[10px] uppercase tracking-wide">
                      PDL Saldo
                    </span>
                  </div>
                  <div
                    className={`text-lg font-bold ${getLPDifferenceColor(
                      queueData.lpDifference
                    )}`}
                  >
                    {queueData.hasBaseline
                      ? formatLPDifference(queueData.lpDifference)
                      : "—"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {queueData.hasBaseline
                      ? queueData.lpDifference > 0
                        ? "Ganhou"
                        : queueData.lpDifference < 0
                        ? "Perdeu"
                        : "Inalterado"
                      : "Primeira consulta"}
                  </div>
                </div>

                {/* Games */}
                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                    <Gamepad2 className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">
                      Partidas
                    </span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {totalGames}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Esta season
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Jogador não ranqueado esta season</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
