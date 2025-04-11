
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Award, Heart, ArrowLeft, Star, Wallet, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from "@/components/ui/progress";
import { toast } from '@/components/ui/use-toast';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import TONWalletConnector from './TONWalletConnector';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

const CharacterUnlocks: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, addCurrency, getDonationTiers, getNextUnlockableCharacter, characterDatabase } = useGameState();
  const { playSound } = useSound();
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [showConnectWalletPrompt, setShowConnectWalletPrompt] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState(10);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const donationTiers = getDonationTiers();
  const nextUnlockable = getNextUnlockableCharacter();
  const isWalletConnected = !!userAddress;

  // Check if wallet is connected on component mount
  useEffect(() => {
    if (!isWalletConnected && !showConnectWalletPrompt) {
      // Small delay to show the connect wallet prompt after the page loads
      const timer = setTimeout(() => setShowConnectWalletPrompt(true), 1500);
      return () => clearTimeout(timer);
    } else if (isWalletConnected) {
      setShowConnectWalletPrompt(false);
    }
  }, [isWalletConnected, showConnectWalletPrompt]);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      playSound('button');
      await tonConnectUI.openModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Function to handle donation
  const handleDonation = () => {
    if (!isWalletConnected) {
      // If wallet is not connected, prompt to connect
      setShowConnectWalletPrompt(true);
      setShowDonationDialog(false);
      return;
    }
    
    if (donationAmount > 0) {
      addCurrency('ton', donationAmount);
      setShowDonationDialog(false);
      playSound('success');
      toast({
        title: "Thank You!",
        description: `Your donation of ${donationAmount} TON has been processed.`,
      });
      
      // Check if any characters were unlocked by this donation
      setTimeout(() => {
        const newNextUnlockable = getNextUnlockableCharacter();
        if (newNextUnlockable.character?.id !== nextUnlockable.character?.id) {
          toast({
            title: "Character Unlocked!",
            description: `You have unlocked a new character!`,
            variant: "default"
          });
          playSound('unlock');
        }
      }, 1000);
    }
  };
  
  // Calculate specific character progress
  const calculateCharacterProgress = (characterId: number) => {
    const tier = donationTiers.find(t => t.characterId === characterId);
    if (!tier) return 0;
    
    const currentTon = gameState.currency.ton;
    return Math.min(100, (currentTon / tier.amount) * 100);
  };
  
  // Check if character is unlocked
  const isCharacterUnlocked = (characterId: number) => {
    return gameState.characters.some(c => c.id === characterId);
  };
  
  // Open donation dialog for specific character
  const openDonationForCharacter = (characterId: number) => {
    if (!isWalletConnected) {
      // If wallet is not connected, prompt to connect first
      setShowConnectWalletPrompt(true);
      return;
    }
    
    setSelectedCharacter(characterId);
    
    // Find the tier for this character
    const tier = donationTiers.find(t => t.characterId === characterId);
    if (!tier) return;
    
    // Calculate how much more TON is needed
    const neededAmount = Math.max(0, tier.amount - gameState.currency.ton);
    
    // Suggest a donation amount that would unlock this character
    setDonationAmount(neededAmount > 0 ? neededAmount : 5);
    setShowDonationDialog(true);
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" size={16} />
        Back
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Character Unlocks
          </h1>
          <p className="text-xl text-muted-foreground">
            Donate TON to unlock special characters for your collection
          </p>
        </div>
        
        {/* Wallet Connection Status */}
        <div className={`glass-card rounded-lg p-6 mb-8 transition-all duration-500 ${isWalletConnected ? 'border-green-500/50' : 'border-primary/30 animate-pulse-slow'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center">
                {isWalletConnected ? (
                  <>
                    <Wallet className="mr-2 text-green-500" />
                    Wallet Connected
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 text-primary" />
                    Connect Wallet to Donate
                  </>
                )}
              </h2>
              {isWalletConnected ? (
                <p className="text-muted-foreground">
                  Current balance: {gameState.currency.ton} TON
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Connect your TON wallet to make donations and unlock characters
                </p>
              )}
            </div>
            
            {isWalletConnected ? (
              <Button 
                onClick={() => setShowDonationDialog(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Gift className="mr-2" size={16} /> Donate TON
              </Button>
            ) : (
              <Button 
                onClick={handleConnectWallet}
                className="bg-primary hover:bg-primary/90"
                disabled={isConnecting}
              >
                <Wallet className="mr-2" size={16} /> 
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
        
        {/* Character unlocks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {donationTiers.map((tier) => {
            const character = characterDatabase.find(c => c.id === tier.characterId);
            if (!character) return null;
            
            const unlocked = isCharacterUnlocked(tier.characterId);
            const progress = calculateCharacterProgress(tier.characterId);
            
            return (
              <div 
                key={tier.characterId}
                className={`glass-card rounded-lg overflow-hidden ${unlocked ? 'border-2 border-green-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={character.imageUrl} 
                      alt={character.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{character.name}</h3>
                      <div className="flex items-center">
                        {Array.from({ length: character.rarity === 'legendary' ? 5 : 
                                            character.rarity === 'epic' ? 4 :
                                            character.rarity === 'rare' ? 3 : 2 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={`
                              ${character.rarity === 'legendary' ? 'text-yellow-400' : 
                                character.rarity === 'epic' ? 'text-purple-400' :
                                character.rarity === 'rare' ? 'text-blue-400' : 'text-green-400'}
                              mr-0.5
                            `}
                            fill="currentColor"
                          />
                        ))}
                        <span className="ml-1 text-xs capitalize">{character.rarity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Donation milestone: {tier.amount} TON</span>
                      <span>{Math.min(gameState.currency.ton, tier.amount)} / {tier.amount} TON</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {unlocked ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-center">
                      <Award className="inline-block mr-1 text-yellow-400" size={16} />
                      <span className="text-sm font-medium">Character Unlocked!</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => openDonationForCharacter(tier.characterId)}
                      className={`w-full ${isWalletConnected ? '' : 'bg-muted hover:bg-muted/90'}`}
                    >
                      {isWalletConnected ? (
                        <>Donate to Unlock ({Math.max(0, tier.amount - gameState.currency.ton)} TON needed)</>
                      ) : (
                        <>Connect Wallet to Unlock</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Donation Dialog */}
      <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Donate TON</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your donations help us develop the game and unlock special characters for you.
              Current donation total: {gameState.currency.ton} TON
            </p>
            
            <div>
              <label className="text-sm font-medium">Donation Amount</label>
              <div className="flex gap-2 mt-2">
                {[5, 10, 25, 50, 100].map((amount) => (
                  <Button 
                    key={amount} 
                    variant={donationAmount === amount ? "default" : "outline"}
                    onClick={() => setDonationAmount(amount)}
                    className="flex-1"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={handleDonation}
              >
                Confirm Donation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Wallet Connect Prompt Dialog */}
      <Dialog open={showConnectWalletPrompt} onOpenChange={setShowConnectWalletPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect your TON Wallet</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To donate and unlock characters, you'll need to connect your TON wallet first.
              It only takes a moment and is completely secure.
            </p>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <TONWalletConnector />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowConnectWalletPrompt(false)}
              >
                Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterUnlocks;
