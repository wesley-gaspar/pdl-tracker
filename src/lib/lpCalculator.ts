import type { Tier, Division } from "@/types/player";

const TIER_ORDER: Tier[] = [
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

const DIVISION_ORDER: Division[] = ["IV", "III", "II", "I"];

const LP_PER_DIVISION = 100;
const LP_PER_TIER = 400;

const MASTER_BASE_LP = 2800;

export function calculateTotalLP(
  tier: Tier,
  rank: Division,
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

export function calculateLPDifference(
  currentTotalLP: number,
  baselineTotalLP: number
): number {
  return currentTotalLP - baselineTotalLP;
}

export function formatLPDifference(difference: number): string {
  if (difference > 0) {
    return `+${difference}`;
  }
  return difference.toString();
}

export function getLPDifferenceColor(difference: number): string {
  if (difference > 0) {
    return "text-green-500";
  } else if (difference < 0) {
    return "text-red-500";
  }
  return "text-muted-foreground";
}
