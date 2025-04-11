
import React, { useState } from 'react';
import { Coins, Stars, Gift, Sparkles, Wallet, Lock, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSound } from '@/hooks/useSound';
import { useGameState } from '@/hooks/useGameState';
import { Character } from '@/utils/gameStateManager';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

const GachaSystem: React.FC = () => {
  const { toast } = useToast();
  const { playSound } = useSound();
  const { gameState, pullGacha } = useGameState();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulledCharacter, setPulledCharacter] = useState<Character | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  
  // Check if gacha is unlocked
  const isUnlocked = gameState.unlockedFeatures.gacha;
  
  // Helper function for rarity color and background
  const getRarityStyle = (rarity: string) => {
    switch(rarity) {
      case 'legendary':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/50',
          sparkColor: '#FFD700'
        };
      case 'epic':
        return {
          text: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/50',
          sparkColor: '#9370DB'
        };
      case 'rare':
        return {
          text: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/50',
          sparkColor: '#4169E1'
        };
      case 'uncommon':
        return {
          text: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/50',
          sparkColor: '#3CB371'
        };
      default:
        return {
          text: 'text-gray-400',
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/50',
          sparkColor: '#A9A9A9'
        };
    }
  };
  
  // Perform gacha pull
  const doPull = (amount: number) => {
    if (!isUnlocked) {
      toast({
        title: "Feature Locked",
        description: "Complete the tutorial to unlock the Gacha feature!",
        variant: "destructive"
      });
      playSound('error');
      return;
    }
    
    // Start animation
    setIsAnimating(true);
    playSound('gacha');
    
    // Delay to show animation
    setTimeout(() => {
      const character = pullGacha(amount);
      
      if (character) {
        setPulledCharacter(character);
        setShowResultDialog(true);
        playSound(character.rarity === 'legendary' ? 'gong' : 'success');
      }
      
      setIsAnimating(false);
    }, 1500);
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-red-950/20 via-background to-background" id="gacha">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-red-950/30 mb-4">
            <span className="text-sm font-medium text-red-400">Summon Characters</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Doge Heroes Gacha</h2>
          <p className="text-muted-foreground text-lg">
            Summon powerful Greyhound heroes to join your collection! Each character has unique abilities and faction alignments.
          </p>
        </div>
        
        {isUnlocked ? (
          <>
            <div className="max-w-4xl mx-auto mb-8">
              <Card className="glass-card overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-500/20 mr-4">
                      <Gift className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Summoning Portal</h3>
                      <p className="text-sm text-muted-foreground">Try your luck and add heroes to your collection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/30">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{gameState.currency.ton} TON</span>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="flex items-center justify-between py-6 bg-red-900/20 hover:bg-red-900/40 text-white border border-red-900/30"
                    onClick={() => doPull(5)}
                    disabled={isAnimating || gameState.currency.ton < 5}
                  >
                    <span className="flex flex-col items-start">
                      <span className="text-lg font-semibold">Single Pull</span>
                      <span className="text-xs text-gray-300">Standard rates</span>
                    </span>
                    <span className="flex items-center font-semibold text-lg">
                      5 <Coins className="ml-1 h-4 w-4" />
                    </span>
                  </Button>
                  
                  <Button
                    className="flex items-center justify-between py-6 bg-purple-900/20 hover:bg-purple-900/40 text-white border border-purple-900/30"
                    onClick={() => doPull(20)}
                    disabled={isAnimating || gameState.currency.ton < 20}
                  >
                    <span className="flex flex-col items-start">
                      <span className="text-lg font-semibold">5x Pull</span>
                      <span className="text-xs text-gray-300">Better rare rates</span>
                    </span>
                    <span className="flex items-center font-semibold text-lg">
                      20 <Coins className="ml-1 h-4 w-4" />
                    </span>
                  </Button>
                  
                  <Button
                    className="flex items-center justify-between py-6 bg-yellow-900/20 hover:bg-yellow-900/40 text-white border border-yellow-900/30"
                    onClick={() => doPull(35)}
                    disabled={isAnimating || gameState.currency.ton < 35}
                  >
                    <span className="flex flex-col items-start">
                      <span className="text-lg font-semibold">10x Pull</span>
                      <span className="text-xs text-gray-300">Highest epic chance</span>
                    </span>
                    <span className="flex items-center font-semibold text-lg">
                      35 <Coins className="ml-1 h-4 w-4" />
                    </span>
                  </Button>
                </div>
                
                {isAnimating && (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-4 text-lg font-medium">Summoning hero...</span>
                  </div>
                )}
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-1 p-2 border-t border-border bg-secondary/10">
                  {gameState.characters.length > 0 ? (
                    gameState.characters.map((character) => (
                      <div 
                        key={character.id} 
                        className={`relative p-2 rounded-md ${getRarityStyle(character.rarity).bg} ${getRarityStyle(character.rarity).border} border`}
                      >
                        <img 
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <div className="mt-1">
                          <div className={`text-xs font-semibold truncate ${getRarityStyle(character.rarity).text}`}>
                            {character.name}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">Lv. {character.level}</span>
                            <span className={`text-xs flex items-center ${getRarityStyle(character.rarity).text}`}>
                              <Stars className="h-3 w-3 mr-0.5" /> {character.power}
                            </span>
                          </div>
                        </div>
                        {character.rarity === 'legendary' && (
                          <div className="absolute top-0 right-0 -mt-1 -mr-1 p-0.5 bg-yellow-400 rounded-full">
                            <Sparkles className="h-3 w-3 text-black" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center p-6 text-muted-foreground">
                      <p>No characters summoned yet. Make your first pull!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          
            {/* Rates information section */}
            <div className="max-w-2xl mx-auto text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    View Summoning Rates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Summoning Rates</DialogTitle>
                    <DialogDescription>
                      The probability of obtaining each character rarity.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-yellow-400 font-semibold">Legendary</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">1%</span>
                        <span className="text-muted-foreground ml-1">(3% for 10x Pull)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-purple-400 rounded-full mr-3"></div>
                        <span className="text-purple-400 font-semibold">Epic</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">5%</span>
                        <span className="text-muted-foreground ml-1">(10% for 10x Pull)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-blue-400 font-semibold">Rare</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">15%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-green-400 font-semibold">Uncommon</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">30%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-400 rounded-full mr-3"></div>
                        <span className="text-gray-400 font-semibold">Common</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">49%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Higher tier pulls provide better chances for rare characters. If you already own all characters of a rarity, you'll receive a character of a different rarity or level up an existing character.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          // Locked gacha UI
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center bg-secondary/10">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-950/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">Gacha System Locked</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet and complete the tutorial to unlock the gacha system and begin summoning characters.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button className="flex items-center gap-2" onClick={() => playSound('button')}>
                  <Wallet className="h-5 w-5" />
                  <span>Connect Wallet</span>
                </Button>
                
                <Button variant="outline" onClick={() => playSound('button')}>
                  View Tutorial
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      {/* Character pull result dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-md">
          {pulledCharacter && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-center ${getRarityStyle(pulledCharacter.rarity).text}`}>
                  {pulledCharacter.rarity.toUpperCase()} CHARACTER OBTAINED!
                </DialogTitle>
              </DialogHeader>
              
              <div className={`rounded-lg p-6 ${getRarityStyle(pulledCharacter.rarity).bg} ${getRarityStyle(pulledCharacter.rarity).border} border-2 relative overflow-hidden`}>
                {/* Animated sparkles for legendary characters */}
                {pulledCharacter.rarity === 'legendary' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 3}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <img 
                    src={pulledCharacter.imageUrl}
                    alt={pulledCharacter.name}
                    className="w-32 h-32 object-cover rounded-lg mb-4 border-4 border-secondary/50"
                  />
                  
                  <h3 className="text-xl font-bold mb-2">{pulledCharacter.name}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-2 py-0.5 rounded-full text-xs ${getRarityStyle(pulledCharacter.rarity).bg}`}>
                      {pulledCharacter.rarity}
                    </div>
                    
                    <div className="px-2 py-0.5 rounded-full bg-secondary/20 text-xs">
                      {pulledCharacter.faction}
                    </div>
                  </div>
                  
                  <div className="flex w-full justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-1">Level:</span>
                      <span className="font-semibold">{pulledCharacter.level}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-1">Power:</span>
                      <span className="font-semibold flex items-center">
                        {pulledCharacter.power}
                        <Stars className="ml-1 h-4 w-4 text-yellow-500" />
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <h4 className="text-sm font-semibold mb-2">Skills:</h4>
                    <ul className="space-y-2">
                      {pulledCharacter.skills.map((skill, index) => (
                        <li key={index} className="text-sm">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-xs text-muted-foreground">{skill.description}</div>
                          {skill.unlockLevel > 1 && (
                            <div className="text-xs text-primary">Unlocks at level {skill.unlockLevel}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowResultDialog(false)}>
                  Add to Collection
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GachaSystem;
