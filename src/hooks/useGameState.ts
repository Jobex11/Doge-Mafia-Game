
import { useState, useEffect } from 'react';
import gameStateManager, { GameState, Character, characterDatabase } from '../utils/gameStateManager';
import { useSound } from './useSound';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(gameStateManager.getState());
  const { playSound } = useSound();
  
  useEffect(() => {
    // Subscribe to game state changes
    const unsubscribe = gameStateManager.subscribe((newState) => {
      setGameState(newState);
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, []);
  
  // Calculate donation tiers and unlockable characters
  const donationTiers = [
    { amount: 10, characterId: 3, name: "Rescue Hound" },
    { amount: 25, characterId: 2, name: "Shadow Greyhound" },
    { amount: 50, characterId: 5, name: "Yakuza Pug" },
    { amount: 100, characterId: 1, name: "Akita Boss" },
    { amount: 200, characterId: 4, name: "Samurai Shiba" },
  ];
  
  // Find next unlockable character based on current donations
  const getNextUnlockableCharacter = (): { character: Character | null, donationNeeded: number } => {
    return gameStateManager.getNextUnlockableCharacter();
  };
  
  // Optimize donation to unlock specific character
  const donateToUnlock = (characterId: number): boolean => {
    return gameStateManager.donateToUnlock(characterId);
  };

  return {
    gameState,
    
    // Make characterDatabase available through the hook
    characterDatabase,
    
    // Enhanced user experience features
    getNextUnlockableCharacter,
    donateToUnlock,
    getDonationTiers: () => gameStateManager.getDonationTiers(),
    
    // Original wallet functions
    connectWallet: (address: string) => gameStateManager.connectWallet(address),
    disconnectWallet: () => gameStateManager.disconnectWallet(),
    
    // Telegram functions
    linkTelegram: () => gameStateManager.linkTelegram(),
    
    // Faction selection
    selectFaction: (faction: 'Mafia' | 'Rescuers') => gameStateManager.selectFaction(faction),
    
    // Gacha system
    pullGacha: (amount: number) => gameStateManager.pullGacha(amount),
    
    // Character management
    unlockCharacter: (id: number) => gameStateManager.unlockCharacter(id),
    
    // Currency management
    addCurrency: (type: 'ton' | 'dogeCoin', amount: number) => gameStateManager.addCurrency(type, amount),
    
    // Staking system
    startStaking: (amount: number) => gameStateManager.startStaking(amount),
    claimStakingRewards: () => gameStateManager.claimStakingRewards(),
    
    // Feature unlocking
    unlockFeature: (feature: keyof GameState['unlockedFeatures']) => gameStateManager.unlockFeature(feature),
    
    // Experience and level
    addExperience: (amount: number) => gameStateManager.addExperience(amount),
    
    // Debug functions
    resetGameState: () => gameStateManager.resetGameState()
  };
};
