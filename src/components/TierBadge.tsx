import { Tier, Division } from '@/types/player';

interface TierBadgeProps {
  tier: Tier;
  division: Division;
}

const tierColors: Record<Tier, string> = {
  IRON: 'bg-tier-iron/20 text-tier-iron border-tier-iron/40',
  BRONZE: 'bg-tier-bronze/20 text-tier-bronze border-tier-bronze/40',
  SILVER: 'bg-tier-silver/20 text-tier-silver border-tier-silver/40',
  GOLD: 'bg-tier-gold/20 text-tier-gold border-tier-gold/40',
  PLATINUM: 'bg-tier-platinum/20 text-tier-platinum border-tier-platinum/40',
  EMERALD: 'bg-tier-emerald/20 text-tier-emerald border-tier-emerald/40',
  DIAMOND: 'bg-tier-diamond/20 text-tier-diamond border-tier-diamond/40',
  MASTER: 'bg-tier-master/20 text-tier-master border-tier-master/40',
  GRANDMASTER: 'bg-tier-grandmaster/20 text-tier-grandmaster border-tier-grandmaster/40',
  CHALLENGER: 'bg-tier-challenger/20 text-tier-challenger border-tier-challenger/40 animate-pulse-gold',
};

const tierLabels: Record<Tier, string> = {
  IRON: 'Iron',
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  EMERALD: 'Emerald',
  DIAMOND: 'Diamond',
  MASTER: 'Master',
  GRANDMASTER: 'Grandmaster',
  CHALLENGER: 'Challenger',
};

export function TierBadge({ tier, division }: TierBadgeProps) {
  const showDivision = !['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier);

  return (
    <div
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg border font-bold text-sm ${tierColors[tier]}`}
    >
      <span>{tierLabels[tier]}</span>
      {showDivision && <span>{division}</span>}
    </div>
  );
}
