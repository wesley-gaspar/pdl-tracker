import { Header } from '@/components/Header';
import { PlayerCard } from '@/components/PlayerCard';
import { mockPlayers } from '@/data/mockPlayers';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/rei-do-gado.jpg')" }}
      />
      <div className="relative z-10">
        <Header />
      
      <main className="container pb-16">
        <div className="space-y-6">
          {mockPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Dados de exemplo • Para dados reais, conecte a API da Riot Games
          </p>
        </div>
      </main>
      </div>
    </div>
  );
};

export default Index;