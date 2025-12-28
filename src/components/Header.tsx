import { Trophy } from 'lucide-react';

export function Header() {
  return (
    <header className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-lol-blue/5 rounded-full blur-3xl" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary animate-float" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient">
              LoL Stats Tracker
            </h1>
            <Trophy className="w-10 h-10 text-primary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Acompanhe as estatísticas dos jogadores de League of Legends.
            Visualize ranking, KDA, PDL e muito mais.
          </p>
        </div>
      </div>
    </header>
  );
}