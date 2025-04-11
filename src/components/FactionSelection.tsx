
import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Skull, Check, Coins, Users } from 'lucide-react';

const FactionSelection: React.FC = () => {
  const { gameState, selectFaction } = useGameState();
  const { playSound } = useSound();
  const [hoveredFaction, setHoveredFaction] = useState<string | null>(null);

  const handleSelectFaction = (faction: 'Mafia' | 'Rescuers') => {
    playSound('button');
    selectFaction(faction);
  };

  // Check if faction feature is unlocked and a faction has not been selected yet
  const showSelection = gameState.unlockedFeatures.factions && !gameState.faction;

  // Benefits for each faction
  const factionBenefits = {
    Mafia: [
      { description: "Starting bonus of 200 Doge Coins", icon: <Coins className="h-4 w-4" /> },
      { description: "10% attack bonus in night phases", icon: <Skull className="h-4 w-4" /> },
      { description: "Access to Mafia-exclusive missions", icon: <Users className="h-4 w-4" /> },
    ],
    Rescuers: [
      { description: "Free 'Rescue Hound' character on join", icon: <Shield className="h-4 w-4" /> },
      { description: "10% defense bonus in day phases", icon: <Shield className="h-4 w-4" /> },
      { description: "Better NFT drop rates from missions", icon: <Coins className="h-4 w-4" /> },
    ]
  };

  if (!showSelection && !gameState.faction) return null;

  return (
    <section id="faction-selection" className="py-16 bg-gradient-to-b from-background/80 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">Choose Your Faction</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your choice will determine your gameplay style, available missions, and special abilities. 
            Choose wisely, as this decision cannot be changed later.
          </p>
        </div>

        {gameState.faction ? (
          // Already selected faction display
          <Card className="max-w-md mx-auto p-6">
            <div className="flex items-center gap-4">
              {gameState.faction === 'Mafia' ? (
                <div className="w-16 h-16 rounded-full bg-red-950/30 flex items-center justify-center">
                  <Skull className="h-8 w-8 text-red-400" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-950/30 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{gameState.faction} Faction</h3>
                <p className="text-muted-foreground">You have joined the {gameState.faction} faction</p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center text-green-500">
                  <Check className="h-5 w-5 mr-1" />
                  <span className="text-sm">Joined</span>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          // Faction selection UI
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Mafia Faction */}
            <Card 
              className={`p-6 border-2 transition-all duration-300 ${
                hoveredFaction === 'Mafia' 
                  ? 'border-red-600 shadow-lg shadow-red-900/30' 
                  : 'border-border'
              }`}
              onMouseEnter={() => setHoveredFaction('Mafia')}
              onMouseLeave={() => setHoveredFaction(null)}
            >
              <div className="flex items-center mb-4">
                <div className="p-4 rounded-full bg-red-950/30 mr-4">
                  <Skull className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-display font-semibold">Mafia</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Join the shadowy underworld of the Mafia. Use stealth, cunning, and intimidation to build your criminal empire and control the streets.
              </p>
              
              <div className="mb-6 space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">FACTION BENEFITS:</h4>
                {factionBenefits.Mafia.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="rounded-full p-1 bg-red-950/20 mr-2">
                      {benefit.icon}
                    </div>
                    <span className="text-sm">{benefit.description}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-red-900 hover:bg-red-800"
                onClick={() => handleSelectFaction('Mafia')}
              >
                Join Mafia
              </Button>
            </Card>
            
            {/* Rescuers Faction */}
            <Card 
              className={`p-6 border-2 transition-all duration-300 ${
                hoveredFaction === 'Rescuers' 
                  ? 'border-blue-600 shadow-lg shadow-blue-900/30' 
                  : 'border-border'
              }`}
              onMouseEnter={() => setHoveredFaction('Rescuers')}
              onMouseLeave={() => setHoveredFaction(null)}
            >
              <div className="flex items-center mb-4">
                <div className="p-4 rounded-full bg-blue-950/30 mr-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-display font-semibold">Rescuers</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Become a protector of greyhounds and join the forces of good. Use courage, compassion, and teamwork to rescue animals and bring peace to the city.
              </p>
              
              <div className="mb-6 space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">FACTION BENEFITS:</h4>
                {factionBenefits.Rescuers.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="rounded-full p-1 bg-blue-950/20 mr-2">
                      {benefit.icon}
                    </div>
                    <span className="text-sm">{benefit.description}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800"
                onClick={() => handleSelectFaction('Rescuers')}
              >
                Join Rescuers
              </Button>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default FactionSelection;
