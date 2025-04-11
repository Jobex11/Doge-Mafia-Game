
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Gift, Coins, Unlock, Star, Sparkles, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { Character } from '@/utils/gameStateManager';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import TONWalletConnector from './TONWalletConnector';

const DonationGate: React.FC = () => {
  const { gameState, addCurrency, donateToUnlock, getNextUnlockableCharacter, getDonationTiers } = useGameState();
  const { playSound } = useSound();
  const { toast } = useToast();
  const [animateUnlock, setAnimateUnlock] = useState<number | null>(null);
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Get donation tiers and next unlockable character
  const donationTiers = getDonationTiers();
  const nextUnlockable = getNextUnlockableCharacter();
  const isWalletConnected = !!userAddress;
  
  // Animation state
  const [sparkles, setSparkles] = useState<{ id: number, x: number, y: number, size: number, delay: number, color: string }[]>([]);
  
  // Check game unlocked status
  const isGameUnlocked = gameState.characters.length > 0;
  
  // Create sparkle effect
  useEffect(() => {
    if (animateUnlock !== null) {
      const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // random position
        y: Math.random() * 100,
        size: Math.random() * 8 + 2, // random size
        delay: Math.random() * 1, // random animation delay
        color: ['#FFD700', '#FFA500', '#9370DB', '#e879f9', '#FFFFFF'][Math.floor(Math.random() * 5)] // random sparkle color
      }));
      
      setSparkles(newSparkles);
      
      // Reset animation after 3 seconds
      const timer = setTimeout(() => {
        setAnimateUnlock(null);
        setSparkles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [animateUnlock]);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      playSound('button');
      await tonConnectUI.openModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error de Conexión",
        description: "Hubo un error al conectar tu cartera. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle donation
  const handleDonate = (amount: number) => {
    if (!isWalletConnected) {
      toast({
        title: "Conecta tu Cartera",
        description: "Primero necesitas conectar tu cartera TON para realizar una donación.",
        variant: "default",
      });
      playSound('error');
      return;
    }
    
    addCurrency('ton', amount);
    playSound('coin');
    
    toast({
      title: "¡Gracias por tu donación!",
      description: `Has donado ${amount} TON.`,
    });
    
    // Check if donation unlocked any characters
    const previouslyUnlocked = gameState.characters.map(c => c.id);
    
    // Small delay to check for unlocked characters
    setTimeout(() => {
      const currentUnlocked = gameState.characters.map(c => c.id);
      const newlyUnlocked = currentUnlocked.filter(id => !previouslyUnlocked.includes(id));
      
      if (newlyUnlocked.length > 0) {
        setAnimateUnlock(newlyUnlocked[0]);
        playSound('unlock');
      }
    }, 500);
  };
  
  // Directly unlock a character with donation
  const unlockCharacter = (characterId: number) => {
    // Check if wallet is connected first
    if (!isWalletConnected) {
      toast({
        title: "Conecta tu Cartera",
        description: "Primero necesitas conectar tu cartera TON para desbloquear personajes.",
        variant: "default",
      });
      playSound('error');
      return;
    }
    
    // Get the tier for this character to calculate donation needed
    const tier = donationTiers.find(t => t.characterId === characterId);
    if (!tier) return;
    
    // Calculate how much more TON is needed
    const currentTon = gameState.currency.ton;
    const neededAmount = Math.max(0, tier.amount - currentTon);
    
    if (neededAmount > 0) {
      handleDonate(neededAmount);
    }
    
    // Try to unlock the character
    const success = donateToUnlock(characterId);
    
    if (success) {
      setAnimateUnlock(characterId);
      playSound('unlock');
      playSound('gong');
      
      toast({
        title: "¡Personaje Desbloqueado!",
        description: "¡Has desbloqueado un nuevo personaje para tu colección!",
        variant: "default",
      });
    }
  };
  
  // Get character by ID from game state
  const getCharacter = (characterId: number): Character | undefined => {
    return gameState.characters.find(c => c.id === characterId);
  };
  
  // Check if character is unlocked
  const isCharacterUnlocked = (characterId: number): boolean => {
    return gameState.characters.some(c => c.id === characterId);
  };
  
  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 mb-4">
            <span className="text-sm font-medium text-primary">Sistema de Donación</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Desbloquea el Juego con Donaciones
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Dona TON para desbloquear personajes y características especiales del juego. 
            Cada donación te acerca más a coleccionar todos los personajes.
          </p>
        </div>
        
        {/* Wallet Connection Status - NEW PROMINENT SECTION */}
        <div className={`max-w-xl mx-auto mb-10 glass-card p-6 rounded-xl border-2 ${isWalletConnected ? 'border-green-500 bg-green-500/5' : 'border-primary/40 bg-primary/5 animate-pulse-slow'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-4 ${isWalletConnected ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                <Wallet className={`w-8 h-8 ${isWalletConnected ? 'text-green-500' : 'text-primary'}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {isWalletConnected ? '¡Cartera Conectada!' : 'Conecta tu Cartera TON'}
                </h3>
                <p className="text-muted-foreground">
                  {isWalletConnected 
                    ? `Balance actual: ${gameState.currency.ton} TON`
                    : 'Necesitas conectar tu cartera para hacer donaciones y desbloquear personajes'}
                </p>
              </div>
            </div>
            
            {!isWalletConnected ? (
              <Button 
                onClick={handleConnectWallet}
                disabled={isConnecting}
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90"
              >
                <Wallet className="mr-2 h-5 w-5" />
                {isConnecting ? "Conectando..." : "Conectar Cartera"}
              </Button>
            ) : (
              <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                <Button 
                  onClick={() => handleDonate(10)} 
                  size="sm" 
                  className="bg-primary/90 hover:bg-primary"
                >
                  <Gift className="mr-2 h-4 w-4" /> Donar 10 TON
                </Button>
                <Button 
                  onClick={() => handleDonate(50)} 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Gift className="mr-2 h-4 w-4" /> Donar 50 TON
                </Button>
              </div>
            )}
          </div>
          
          {!isWalletConnected && (
            <div className="mt-4 bg-primary/10 rounded-lg p-4">
              <TONWalletConnector className="p-0 shadow-none border-0" />
            </div>
          )}
        </div>
        
        {/* Game lock status */}
        <div className="max-w-xl mx-auto mb-10 glass-card p-6 rounded-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-4 ${isGameUnlocked ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {isGameUnlocked ? 
                <Unlock className="w-8 h-8 text-green-500" /> : 
                <Lock className="w-8 h-8 text-red-500" />
              }
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {isGameUnlocked ? '¡Juego Desbloqueado!' : 'Juego Bloqueado'}
              </h3>
              <p className="text-muted-foreground">
                {isGameUnlocked 
                  ? 'Has desbloqueado el acceso básico al juego. ¡Sigue donando para desbloquear más personajes!'
                  : 'Dona al menos 10 TON para desbloquear el acceso al juego y tu primer personaje.'}
              </p>
            </div>
          </div>
          
          {!isGameUnlocked && (
            <Button 
              onClick={() => handleDonate(10)} 
              size="lg" 
              disabled={!isWalletConnected}
              className={`w-full mt-4 ${isWalletConnected ? 'bg-primary/90 hover:bg-primary' : 'bg-muted cursor-not-allowed'}`}
            >
              {isWalletConnected ? (
                <>
                  <Gift className="mr-2 h-5 w-5" /> Donar 10 TON para Desbloquear
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" /> Conecta tu cartera primero
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Total donations and progress */}
        <div className="max-w-xl mx-auto mb-10 glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Donaciones Totales</h3>
            <div className="flex items-center text-xl font-semibold">
              <span className="mr-2">{gameState.currency.ton}</span>
              <Coins className="h-5 w-5 text-yellow-400" />
            </div>
          </div>
          
          {nextUnlockable.character && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Próximo personaje: {nextUnlockable.character.name}
                </span>
                <span>
                  {gameState.currency.ton}/{gameState.currency.ton + nextUnlockable.donationNeeded} TON
                </span>
              </div>
              <Progress 
                value={(gameState.currency.ton / (gameState.currency.ton + nextUnlockable.donationNeeded)) * 100} 
                className="h-2" 
              />
              
              <div className="mt-2 flex justify-end">
                <Button 
                  onClick={() => handleDonate(nextUnlockable.donationNeeded)}
                  size="sm"
                  variant={isWalletConnected ? "outline" : "secondary"}
                  disabled={!isWalletConnected}
                  className="text-sm"
                >
                  {isWalletConnected ? (
                    <>
                      <Gift className="mr-1 h-4 w-4" /> Donar {nextUnlockable.donationNeeded} TON
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-1 h-4 w-4" /> Conecta tu cartera
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2 mt-6">
            <h4 className="text-sm font-semibold mb-2">Opciones de donación rápida:</h4>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 25, 50, 100, 200].map((amount) => (
                <Button 
                  key={amount}
                  variant={isWalletConnected ? "secondary" : "outline"} 
                  onClick={() => handleDonate(amount)}
                  disabled={!isWalletConnected}
                  className={`text-center ${!isWalletConnected ? 'opacity-50' : ''}`}
                >
                  {amount} TON
                </Button>
              ))}
            </div>
          </div>
          
          {!isWalletConnected && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-md text-center">
              <p className="text-sm text-muted-foreground">
                <Wallet className="inline-block mr-1 text-primary" size={16} />
                Conecta tu cartera TON para hacer donaciones
              </p>
            </div>
          )}
        </div>
        
        {/* Character unlock grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Personajes Desbloqueables</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {donationTiers.map((tier) => {
              const isUnlocked = isCharacterUnlocked(tier.characterId);
              const character = getCharacter(tier.characterId);
              const progress = Math.min(100, (gameState.currency.ton / tier.amount) * 100);
              
              return (
                <div 
                  key={tier.characterId}
                  className={`glass-card rounded-lg overflow-hidden transition-all duration-500 relative
                    ${animateUnlock === tier.characterId ? 'ring-4 ring-yellow-400 shadow-xl shadow-yellow-400/20 scale-105' : ''}
                    ${isUnlocked ? 'border-2 border-green-500' : 'opacity-90 hover:opacity-100'}
                  `}
                >
                  {/* Sparkle animation for newly unlocked character */}
                  {animateUnlock === tier.characterId && (
                    <>
                      {sparkles.map(sparkle => (
                        <div
                          key={`sparkle-${tier.characterId}-${sparkle.id}`}
                          className="absolute animate-ping rounded-full z-10"
                          style={{
                            top: `${sparkle.y}%`,
                            left: `${sparkle.x}%`,
                            width: `${sparkle.size}px`,
                            height: `${sparkle.size}px`,
                            backgroundColor: sparkle.color,
                            animationDelay: `${sparkle.delay}s`,
                            animationDuration: '1.5s',
                          }}
                        />
                      ))}
                      <div className="absolute inset-0 bg-yellow-400/10 animate-pulse z-0"></div>
                    </>
                  )}
                  
                  <div className="p-6 relative z-20">
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-primary/5 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                        {isUnlocked ? (
                          <img 
                            src={character?.imageUrl || "/placeholder.svg"} 
                            alt={tier.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Lock className="w-10 h-10 text-muted-foreground/50" />
                        )}
                      </div>
                      
                      <h4 className="text-lg font-semibold mb-1">{tier.name}</h4>
                      <div className="flex justify-center gap-1">
                        {Array(tier.characterId === 4 ? 5 : 
                              tier.characterId === 1 || tier.characterId === 5 ? 4 : 3)
                          .fill(0)
                          .map((_, i) => (
                            <Star 
                              key={i} 
                              size={14}
                              fill="currentColor"
                              className={`
                                ${tier.characterId === 4 ? 'text-yellow-400' : 
                                  tier.characterId === 1 || tier.characterId === 5 ? 'text-purple-400' : 'text-blue-400'}
                              `}
                            />
                          ))}
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progreso</span>
                            <span>{gameState.currency.ton}/{tier.amount} TON</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                        
                        <Button 
                          onClick={() => unlockCharacter(tier.characterId)}
                          className="w-full"
                          disabled={!isWalletConnected || gameState.currency.ton < tier.amount}
                        >
                          {!isWalletConnected ? (
                            <>
                              <Wallet className="mr-2 h-4 w-4" />
                              Conecta tu cartera
                            </>
                          ) : gameState.currency.ton >= tier.amount ? (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Necesitas {tier.amount - gameState.currency.ton} TON más
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    
                    {isUnlocked && (
                      <div className="px-3 py-2 bg-green-500/10 rounded-md flex items-center justify-center text-green-500 font-medium text-sm border border-green-500/20">
                        <Unlock className="mr-2 h-4 w-4" /> ¡Personaje desbloqueado!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Call to action for game */}
        <div className="text-center mt-16">
          <Link to="/character-unlocks">
            <Button size="lg" className="bg-primary/90 hover:bg-primary">
              <Gift className="mr-2 h-5 w-5" /> Ver pantalla de donaciones detalladas
            </Button>
          </Link>
          
          <div className="mt-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationGate;
