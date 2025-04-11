// Game State Management for Doge Mafia Heroes

import { toast } from "@/components/ui/use-toast";
import soundManager from './soundEffects';

// Player character type definition
export interface Character {
  id: number;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  faction: 'Mafia' | 'Rescuers';
  power: number;
  unlocked: boolean;
  imageUrl: string;
  skills: {
    name: string;
    description: string;
    unlockLevel: number;
  }[];
}

// Player progress and game state
export interface GameState {
  unlockedFeatures: {
    gacha: boolean;
    staking: boolean;
    battle: boolean;
    marketplace: boolean;
    missions: boolean;
    events: boolean;
    factions: boolean;
    nftRewards: boolean;
  };
  currency: {
    ton: number;
    dogeCoin: number;
  };
  characters: Character[];
  selectedDeck: number[];
  level: number;
  experience: number;
  faction: 'Mafia' | 'Rescuers' | null;
  completedMissions: string[];
  gameEvents: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    completed: boolean;
  }[];
  stakingInfo: {
    isStaking: boolean;
    stakedAmount: number;
    stakingStartDate: Date | null;
    rewardsRate: number;
  };
  walletConnected: boolean;
  walletAddress: string | null;
  telegramLinked: boolean;
  lastDonationDate: Date | null;
  totalDonations: number;
  donationMilestones: number[];
}

// Initial state with locked features
const initialState: GameState = {
  unlockedFeatures: {
    gacha: true, // Basic feature unlocked by default
    staking: false,
    battle: false,
    marketplace: false,
    missions: false,
    events: false, 
    factions: false,
    nftRewards: false
  },
  currency: {
    ton: 0, // Starting with no currency, will be earned through donations
    dogeCoin: 100
  },
  characters: [],
  selectedDeck: [],
  level: 1,
  experience: 0,
  faction: null,
  completedMissions: [],
  gameEvents: [],
  stakingInfo: {
    isStaking: false,
    stakedAmount: 0,
    stakingStartDate: null,
    rewardsRate: 0.05 // 5% return
  },
  walletConnected: false,
  walletAddress: null,
  telegramLinked: false,
  lastDonationDate: null,
  totalDonations: 0,
  donationMilestones: [10, 25, 50, 100, 200]
};

// Sample characters that can be unlocked through gacha
export const characterDatabase: Character[] = [
  {
    id: 1,
    name: "Akita Boss",
    rarity: 'epic',
    level: 1,
    faction: 'Mafia',
    power: 450,
    unlocked: false,
    imageUrl: "/lovable-uploads/e01a4cf8-fade-4973-a943-82cab1bad514.png",
    skills: [
      { name: "Mafia Command", description: "Order lower rank members to attack", unlockLevel: 1 },
      { name: "Protection Racket", description: "Extort local businesses for resources", unlockLevel: 3 },
      { name: "Godfather's Blessing", description: "Increase all Mafia allies' power", unlockLevel: 5 }
    ]
  },
  {
    id: 2,
    name: "Shadow Greyhound",
    rarity: 'rare',
    level: 1,
    faction: 'Mafia',
    power: 320,
    unlocked: false,
    imageUrl: "/lovable-uploads/5e94d4ae-e50a-4330-9c4d-3036b0aec7fa.png",
    skills: [
      { name: "Silent Strike", description: "Attack without being detected", unlockLevel: 1 },
      { name: "Escape Artist", description: "High chance to escape danger", unlockLevel: 4 }
    ]
  },
  {
    id: 3,
    name: "Rescue Hound",
    rarity: 'rare',
    level: 1,
    faction: 'Rescuers',
    power: 310,
    unlocked: false,
    imageUrl: "/lovable-uploads/3b85fedc-243a-4a05-b130-6c8e729e88ec.png",
    skills: [
      { name: "Healing Touch", description: "Restore health to an ally", unlockLevel: 1 },
      { name: "Guardian's Shield", description: "Protect allies from damage", unlockLevel: 3 }
    ]
  },
  {
    id: 4,
    name: "Samurai Shiba",
    rarity: 'legendary',
    level: 1,
    faction: 'Rescuers',
    power: 550,
    unlocked: false,
    imageUrl: "/lovable-uploads/2c606d71-9212-4ee3-be4e-61a137ec6e1b.png",
    skills: [
      { name: "Katana Slash", description: "Powerful cutting attack", unlockLevel: 1 },
      { name: "Bushido Code", description: "Gain strength when defending allies", unlockLevel: 2 },
      { name: "Honor Bound", description: "Ultimate sacrifice that deals massive damage", unlockLevel: 5 }
    ]
  },
  {
    id: 5,
    name: "Yakuza Pug",
    rarity: 'epic',
    level: 1,
    faction: 'Mafia',
    power: 430,
    unlocked: false,
    imageUrl: "/lovable-uploads/8a5d0761-a398-48a4-a22b-6389e80280b7.png",
    skills: [
      { name: "Tattooed Fury", description: "Intimidate enemies, reducing their power", unlockLevel: 1 },
      { name: "Underground Connections", description: "Call for reinforcements", unlockLevel: 4 }
    ]
  }
];

// Singleton class to manage game state
class GameStateManager {
  private gameState: GameState = { ...initialState };
  private subscribers: ((state: GameState) => void)[] = [];
  
  constructor() {
    this.loadState();
  }
  
  // Get character by ID from database
  getCharacterById(id: number): Character | null {
    const character = characterDatabase.find(c => c.id === id);
    if (!character) return null;
    return { ...character };
  }
  
  // Save state to localStorage
  private saveState(): void {
    try {
      localStorage.setItem('dogeGameState', JSON.stringify(this.gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }
  
  // Load state from localStorage
  private loadState(): void {
    try {
      const savedState = localStorage.getItem('dogeGameState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsedState.stakingInfo?.stakingStartDate) {
          parsedState.stakingInfo.stakingStartDate = new Date(parsedState.stakingInfo.stakingStartDate);
        }
        if (parsedState.lastDonationDate) {
          parsedState.lastDonationDate = new Date(parsedState.lastDonationDate);
        }
        if (parsedState.gameEvents) {
          parsedState.gameEvents.forEach((event: any) => {
            event.startDate = new Date(event.startDate);
            event.endDate = new Date(event.endDate);
          });
        }
        this.gameState = { ...this.gameState, ...parsedState };
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  }
  
  // Get current state
  getState(): GameState {
    return { ...this.gameState };
  }
  
  // Update state and notify subscribers
  private setState(newState: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...newState };
    this.saveState();
    this.notifySubscribers();
  }
  
  // Subscribe to state changes
  subscribe(callback: (state: GameState) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  // Notify all subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.getState()));
  }
  
  // Connect wallet
  connectWallet(address: string): void {
    this.setState({ 
      walletConnected: true, 
      walletAddress: address 
    });
    toast({
      title: "Wallet Connected",
      description: "Your TON wallet has been successfully connected!"
    });
    
    // First time connection bonus
    if (this.gameState.currency.ton === 0) {
      this.addCurrency('ton', 5); // Give initial bonus
      toast({
        title: "Connection Bonus",
        description: "You received 5 TON as a welcome bonus!"
      });
    }
  }
  
  // Disconnect wallet
  disconnectWallet(): void {
    this.setState({ 
      walletConnected: false, 
      walletAddress: null 
    });
  }
  
  // Link Telegram
  linkTelegram(): void {
    this.setState({ telegramLinked: true });
    toast({
      title: "Telegram Linked",
      description: "Your Telegram account has been successfully linked!"
    });
    
    // Telegram linking bonus
    if (!this.gameState.unlockedFeatures.factions) {
      this.unlockFeature('factions');
      toast({
        title: "Feature Unlocked",
        description: "Factions feature is now available!"
      });
    }
  }
  
  // Record donation and check for milestones
  recordDonation(amount: number): void {
    const newTotal = this.gameState.totalDonations + amount;
    const milestones = [...this.gameState.donationMilestones];
    
    // Check for newly reached milestones
    const reachedMilestones = milestones.filter(m => 
      this.gameState.totalDonations < m && newTotal >= m
    );
    
    // Update state
    this.setState({
      totalDonations: newTotal,
      lastDonationDate: new Date()
    });
    
    // Process each reached milestone
    reachedMilestones.forEach(milestone => {
      // Determine which character to unlock based on milestone
      let characterId = 0;
      
      if (milestone === 10) characterId = 3; // Rescue Hound at 10 TON
      else if (milestone === 25) characterId = 2; // Shadow Greyhound at 25 TON
      else if (milestone === 50) characterId = 5; // Yakuza Pug at 50 TON
      else if (milestone === 100) characterId = 1; // Akita Boss at 100 TON
      else if (milestone === 200) characterId = 4; // Samurai Shiba at 200 TON
      
      if (characterId > 0) {
        this.unlockCharacter(characterId);
        toast({
          title: "Donation Milestone Reached!",
          description: `You've reached ${milestone} TON in donations and unlocked a special character!`,
          variant: "default"
        });
        
        soundManager.playSound('unlock');
      }
    });
  }
  
  // Select faction
  selectFaction(faction: 'Mafia' | 'Rescuers'): void {
    this.setState({ faction });
    
    // Unlock faction feature
    const unlockedFeatures = { 
      ...this.gameState.unlockedFeatures,
      factions: true
    };
    
    this.setState({ unlockedFeatures });
    
    soundManager.playSound('success');
    toast({
      title: "Faction Selected",
      description: `You have joined the ${faction} faction!`
    });
    
    // Additional bonuses based on faction
    if (faction === 'Mafia') {
      this.addCurrency('dogeCoin', 200);
    } else {
      this.addCurrency('dogeCoin', 100);
      // Grant bonus character for Rescuers
      this.unlockCharacter(3); // Rescue Hound
    }
  }
  
  // Gacha system - pull a random character
  pullGacha(tonAmount: number): Character | null {
    // Check if player has enough TON
    if (this.gameState.currency.ton < tonAmount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough TON for this gacha pull!",
        variant: "destructive"
      });
      soundManager.playSound('error');
      return null;
    }
    
    // Deduct TON
    this.addCurrency('ton', -tonAmount);
    
    // Rarity odds based on amount spent
    let rarityOdds: { [key: string]: number } = {
      legendary: 0.01,
      epic: 0.05,
      rare: 0.15,
      uncommon: 0.30,
      common: 0.49
    };
    
    // Better odds for bulk purchases
    if (tonAmount >= 35) { // 10 pulls
      rarityOdds.legendary = 0.03;
      rarityOdds.epic = 0.10;
    } else if (tonAmount >= 20) { // 5 pulls
      rarityOdds.legendary = 0.02;
      rarityOdds.epic = 0.07;
    }
    
    // Determine rarity
    const random = Math.random();
    let selectedRarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common' = 'common';
    let cumulativeProb = 0;
    
    for (const [rarity, probability] of Object.entries(rarityOdds)) {
      cumulativeProb += probability;
      if (random <= cumulativeProb) {
        selectedRarity = rarity as any;
        break;
      }
    }
    
    // Filter available characters by rarity
    const availableCharacters = characterDatabase.filter(
      char => char.rarity === selectedRarity && !this.gameState.characters.some(c => c.id === char.id)
    );
    
    // If no characters available in this rarity, try another rarity
    if (availableCharacters.length === 0) {
      // Try a different rarity
      for (const rarity of ['epic', 'rare', 'uncommon', 'common'] as const) {
        const fallbackCharacters = characterDatabase.filter(
          char => char.rarity === rarity && !this.gameState.characters.some(c => c.id === char.id)
        );
        if (fallbackCharacters.length > 0) {
          const character = { ...fallbackCharacters[Math.floor(Math.random() * fallbackCharacters.length)], unlocked: true };
          this.addCharacter(character);
          return character;
        }
      }
      
      // All characters already obtained, give duplicate with higher level
      const allCharacters = characterDatabase;
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
      
      // Find if player already has this character
      const existingIndex = this.gameState.characters.findIndex(c => c.id === randomChar.id);
      if (existingIndex !== -1) {
        // Increase level
        const updatedCharacters = [...this.gameState.characters];
        updatedCharacters[existingIndex] = {
          ...updatedCharacters[existingIndex],
          level: updatedCharacters[existingIndex].level + 1,
          power: Math.floor(updatedCharacters[existingIndex].power * 1.1) // 10% power increase
        };
        
        this.setState({ characters: updatedCharacters });
        
        soundManager.playSound('levelup');
        toast({
          title: "Character Level Up!",
          description: `${randomChar.name} is now level ${updatedCharacters[existingIndex].level}!`
        });
        return updatedCharacters[existingIndex];
      }
      
      return null;
    }
    
    // Pick random character from available ones
    const character = { ...availableCharacters[Math.floor(Math.random() * availableCharacters.length)], unlocked: true };
    
    // Add character to collection
    this.addCharacter(character);
    
    return character;
  }
  
  // Add a character to collection
  private addCharacter(character: Character): void {
    const updatedCharacters = [...this.gameState.characters, character];
    this.setState({ characters: updatedCharacters });
    
    soundManager.playSound('unlock');
    toast({
      title: "New Character Unlocked!",
      description: `${character.name} (${character.rarity}) has joined your collection!`
    });
    
    // Unlock battle feature when player has 2 or more characters
    if (updatedCharacters.length >= 2 && !this.gameState.unlockedFeatures.battle) {
      this.unlockFeature('battle');
    }
  }
  
  // Unlock a specific character by ID
  unlockCharacter(characterId: number): void {
    // Check if character is already unlocked
    const existingChar = this.gameState.characters.find(c => c.id === characterId);
    if (existingChar) {
      toast({
        title: "Already Unlocked",
        description: `${existingChar.name} is already in your collection!`
      });
      return;
    }
    
    // Find character from database
    const character = characterDatabase.find(c => c.id === characterId);
    if (!character) {
      console.error(`Character with ID ${characterId} not found!`);
      return;
    }
    
    // Add character to collection
    const updatedCharacters = [...this.gameState.characters, { ...character, unlocked: true }];
    this.setState({ characters: updatedCharacters });
    
    soundManager.playSound('unlock');
    toast({
      title: "New Character Unlocked!",
      description: `${character.name} (${character.rarity}) has joined your collection!`
    });
    
    // Unlock battle feature when player has 2 or more characters
    if (updatedCharacters.length >= 2 && !this.gameState.unlockedFeatures.battle) {
      this.unlockFeature('battle');
    }
    
    // Add experience for unlocking a character
    this.addExperience(character.rarity === 'legendary' ? 50 :
                       character.rarity === 'epic' ? 30 :
                       character.rarity === 'rare' ? 20 : 10);
  }
  
  // Add currency (ton or dogeCoin)
  addCurrency(type: 'ton' | 'dogeCoin', amount: number): void {
    const currency = { ...this.gameState.currency };
    currency[type] += amount;
    
    this.setState({ currency });
    
    // Record donations if adding TON
    if (type === 'ton' && amount > 0) {
      this.recordDonation(amount);
    }
    
    if (amount > 0) {
      soundManager.playSound('coin');
      toast({
        title: "Currency Added",
        description: `${amount} ${type === 'ton' ? 'TON' : 'Doge Coins'} have been added to your wallet!`
      });
    }
  }
  
  // Check if the game is unlocked
  isGameUnlocked(): boolean {
    return this.gameState.characters.length > 0;
  }
  
  // Get the unlockable character based on donation amount
  getNextUnlockableCharacter(): { character: Character | null, donationNeeded: number } {
    const totalDonations = this.gameState.currency.ton;
    const unlockedIds = this.gameState.characters.map(c => c.id);
    
    // Find next character to unlock
    for (const milestone of this.gameState.donationMilestones) {
      if (totalDonations < milestone) {
        // Find which character corresponds to this milestone
        let characterId = 0;
        
        if (milestone === 10) characterId = 3;
        else if (milestone === 25) characterId = 2;
        else if (milestone === 50) characterId = 5;
        else if (milestone === 100) characterId = 1;
        else if (milestone === 200) characterId = 4;
        
        if (characterId > 0 && !unlockedIds.includes(characterId)) {
          const character = this.getCharacterById(characterId);
          if (character) {
            return {
              character,
              donationNeeded: milestone - totalDonations
            };
          }
        }
      }
    }
    
    // All characters unlocked or no valid next milestone
    return { character: null, donationNeeded: 0 };
  }
  
  // Directly donate to unlock a specific character
  donateToUnlock(characterId: number): boolean {
    // Check if character is already unlocked
    if (this.gameState.characters.some(c => c.id === characterId)) {
      return false;
    }
    
    // Find which milestone corresponds to this character
    let targetMilestone = 0;
    if (characterId === 3) targetMilestone = 10;
    else if (characterId === 2) targetMilestone = 25;
    else if (characterId === 5) targetMilestone = 50;
    else if (characterId === 1) targetMilestone = 100;
    else if (characterId === 4) targetMilestone = 200;
    
    if (targetMilestone === 0) return false;
    
    // Check if player already has enough donations
    if (this.gameState.currency.ton >= targetMilestone) {
      this.unlockCharacter(characterId);
      return true;
    }
    
    return false;
  }
  
  // Get donation tiers information
  getDonationTiers() {
    return [
      { amount: 10, characterId: 3, name: "Rescue Hound" },
      { amount: 25, characterId: 2, name: "Shadow Greyhound" },
      { amount: 50, characterId: 5, name: "Yakuza Pug" },
      { amount: 100, characterId: 1, name: "Akita Boss" },
      { amount: 200, characterId: 4, name: "Samurai Shiba" },
    ];
  }
  
  // Start staking
  startStaking(amount: number): void {
    // Check if player has enough TON
    if (this.gameState.currency.ton < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough TON for staking!",
        variant: "destructive"
      });
      soundManager.playSound('error');
      return;
    }
    
    // Deduct TON and update staking info
    this.addCurrency('ton', -amount);
    
    const stakingInfo = {
      isStaking: true,
      stakedAmount: amount,
      stakingStartDate: new Date(),
      rewardsRate: 0.05 // 5% return
    };
    
    this.setState({ stakingInfo });
    
    // Unlock staking feature
    const unlockedFeatures = { 
      ...this.gameState.unlockedFeatures,
      staking: true 
    };
    this.setState({ unlockedFeatures });
    
    soundManager.playSound('success');
    toast({
      title: "Staking Started",
      description: `You have staked ${amount} TON. Check back later for rewards!`
    });
  }
  
  // Claim staking rewards
  claimStakingRewards(): number {
    if (!this.gameState.stakingInfo.isStaking || !this.gameState.stakingInfo.stakingStartDate) {
      toast({
        title: "No Active Staking",
        description: "You don't have any active staking to claim rewards from!",
        variant: "destructive"
      });
      return 0;
    }
    
    // Calculate elapsed time in days
    const now = new Date();
    const startDate = this.gameState.stakingInfo.stakingStartDate;
    const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate rewards (5% APR, prorated for elapsed time)
    const annualRate = this.gameState.stakingInfo.rewardsRate;
    const dailyRate = annualRate / 365;
    const rewards = Math.floor(this.gameState.stakingInfo.stakedAmount * dailyRate * elapsedDays);
    
    if (rewards <= 0) {
      toast({
        title: "No Rewards Yet",
        description: "Not enough time has passed to earn rewards. Check back later!",
        variant: "default"
      });
      return 0;
    }
    
    // Add rewards to player's balance
    this.addCurrency('ton', rewards);
    
    // Reset staking start time to now
    const stakingInfo = {
      ...this.gameState.stakingInfo,
      stakingStartDate: new Date()
    };
    this.setState({ stakingInfo });
    
    soundManager.playSound('success');
    toast({
      title: "Rewards Claimed",
      description: `You have claimed ${rewards} TON from staking!`
    });
    
    return rewards;
  }
  
  // Unlock a feature
  unlockFeature(feature: keyof GameState['unlockedFeatures']): void {
    if (this.gameState.unlockedFeatures[feature]) {
      return; // Already unlocked
    }
    
    const unlockedFeatures = { ...this.gameState.unlockedFeatures };
    unlockedFeatures[feature] = true;
    
    this.setState({ unlockedFeatures });
    
    soundManager.playSound('unlock');
    toast({
      title: "New Feature Unlocked!",
      description: `You can now access the ${feature} feature!`
    });
    
    // Progression logic - unlock other features based on this unlock
    if (feature === 'battle' && this.gameState.level >= 3) {
      this.unlockFeature('marketplace');
    } else if (feature === 'marketplace' && this.gameState.level >= 5) {
      this.unlockFeature('missions');
    } else if (feature === 'missions' && this.gameState.level >= 8) {
      this.unlockFeature('events');
    } else if (feature === 'events' && this.gameState.level >= 10) {
      this.unlockFeature('nftRewards');
    }
  }
  
  // Add experience and handle level up
  addExperience(amount: number): void {
    let { experience, level } = this.gameState;
    experience += amount;
    
    // Level up logic - each level requires more XP than the last
    const xpForNextLevel = level * 100;
    
    if (experience >= xpForNextLevel) {
      level += 1;
      experience -= xpForNextLevel;
      
      soundManager.playSound('levelup');
      toast({
        title: "Level Up!",
        description: `You are now level ${level}!`
      });
      
      // Unlock features based on level
      if (level === 3) {
        this.unlockFeature('staking');
      } else if (level === 5) {
        this.unlockFeature('marketplace');
      } else if (level === 8) {
        this.unlockFeature('missions');
      } else if (level >= 10) {
        this.unlockFeature('events');
      } else if (level >= 15) {
        this.unlockFeature('nftRewards');
      }
      
      // Bonus rewards for level milestones
      if (level % 5 === 0) {
        this.addCurrency('ton', level);
        this.addCurrency('dogeCoin', level * 10);
        toast({
          title: "Level Milestone Reward",
          description: `You received ${level} TON and ${level * 10} Doge Coins as a reward!`
        });
      }
    }
    
    this.setState({ experience, level });
  }
  
  // Reset game state (for debugging or testing)
  resetGameState(): void {
    this.gameState = { ...initialState };
    this.saveState();
    this.notifySubscribers();
    
    toast({
      title: "Game Reset",
      description: "Your game progress has been reset to the beginning."
    });
  }
}

// Create singleton instance
const gameStateManager = new GameStateManager();
export default gameStateManager;
