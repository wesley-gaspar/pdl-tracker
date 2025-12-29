import { Header } from '@/components/Header';
import { PlayerCard } from '@/components/PlayerCard';
import { fetchMultiplePlayers, PlayerConfig, PlayerWithConfig } from '@/services/riotApi';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// Configuração dos jogadores para buscar da API
const playersConfig: PlayerConfig[] = [
  { gameName: 'é o gas amor', tagLine: '1742', lane: 'Mid', secondaryLane: 'Jungle' },
  { gameName: 'Trinda', tagLine: 'sad', lane: 'Adc', secondaryLane: 'Mid' },
  { gameName: 'vem na mão fdp', tagLine: 'br1', lane: 'Support'},
  { gameName: 'Hacksan', tagLine: 'kekw', lane: 'Support', secondaryLane: 'Jungle' },
  { gameName: 'mourasan', tagLine: 'kekw', lane: 'Top', secondaryLane: 'Jungle' },
  { gameName: 'é o JZ', tagLine: 'amor', lane: 'Mid', secondaryLane: 'Jungle' },
  // Adicione mais jogadores aqui conforme necessário
];

const Index = () => {
  const { data: players, isLoading, error } = useQuery({
    queryKey: ['players', playersConfig],
    queryFn: () => fetchMultiplePlayers(playersConfig),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pb-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Carregando dados dos jogadores...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-destructive mb-2">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
          </div>
        )}

        {players && players.length > 0 && (
          <div className="space-y-6">
            {players.map((player, index) => (
              <PlayerCard key={player.puuid} player={player} index={index} />
            ))}
          </div>
        )}

        {players && players.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum jogador encontrado</p>
          </div>
        )}
        
        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Dados em tempo real da API Riot Games • Solo/Duo Queue
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
