import { Lane } from '@/types/player';
import { Sword, Trees, Target, Crosshair, Shield } from 'lucide-react';

interface LaneBadgeProps {
  lane: Lane;
}

const laneConfig: Record<Lane, { icon: React.ElementType; label: string; className: string }> = {
  Top: {
    icon: Sword,
    label: 'Top',
    className: 'bg-lane-top/20 text-lane-top border-lane-top/40',
  },
  Jungle: {
    icon: Trees,
    label: 'Jungle',
    className: 'bg-lane-jungle/20 text-lane-jungle border-lane-jungle/40',
  },
  Mid: {
    icon: Target,
    label: 'Mid',
    className: 'bg-lane-mid/20 text-lane-mid border-lane-mid/40',
  },
  Adc: {
    icon: Crosshair,
    label: 'ADC',
    className: 'bg-lane-adc/20 text-lane-adc border-lane-adc/40',
  },
  Support: {
    icon: Shield,
    label: 'Support',
    className: 'bg-lane-support/20 text-lane-support border-lane-support/40',
  },
};

export function LaneBadge({ lane }: LaneBadgeProps) {
  const config = laneConfig[lane];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wide ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}