import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGameState } from '@/hooks/useGameState';
import { LanguageContext } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSound } from '@/hooks/useSound';
import { Coins, TrendingUp, Users, Award, BadgeDollarSign, BadgePlus, Timer, Zap, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Hero {
  id: number;
  name: string;
  level: number;
  baseCost: number;
  baseProduction: number;
  owned: boolean;
  collection: string;
  description: string;
  upgradeMultiplier: number;
  image: string;
  role: 'IncomeGenerator' | 'Support' | 'AbilitySpecialist' | 'CollectionLead';
  tags: string[];
  abilities: CharacterAbility[];
}

interface CharacterAbility {
  id: number;
  name: string;
  description: string;
  type: 'Active' | 'Passive';
  effect: {
    type: 'Multiplier' | 'FlatBonus' | 'Special';
    value: number;
  };
  target: 'Self' | 'Global' | 'Collection';
  targetCollection?: string;
  duration: number;
  cooldown: number;
  currentCooldown: number;
  isActive: boolean;
}

interface Collection {
  id: string;
  name: string;
  bonus: string;
  bonusValue: number;
  requiredHeroes: number[];
  completed: boolean;
}

interface MiniGame {
  id: string;
  name: string;
  description: string;
  rewardType: 'IncomeBoost' | 'LumpSum';
  rewardValue: number;
  rewardDuration?: number;
  active: boolean;
  completed: boolean;
}

interface GameCurrency {
  bones: number;
  dollars: number;
  gems: number;
}

interface UpgradeNode {
  id: number;
  name: string;
  cost: number;
  prerequisiteLevel: number;
  prerequisiteUpgrade?: number;
  effect: {
    type: 'UnlockAbility' | 'EnhanceAbility' | 'AddPassiveBonus' | 'ModifyRole';
    value: number;
    abilityId?: number;
  };
  purchased: boolean;
}

const translations = {
  en: {
    idleGameTitle: "Doge Idle Game",
    idleGameSubtitle: "Build your mafia empire and collect resources",
    bones: "Bones",
    dollars: "Dollars",
    gems: "Gems",
    production: "Production",
    perSecond: "bones/sec",
    tapToCollect: "Tap to collect",
    heroes: "Heroes",
    collections: "Collections",
    upgradesTab: "Upgrades",
    buy: "Buy",
    upgrade: "Upgrade",
    level: "Lvl",
    nextLevel: "Next level",
    complete: "Complete",
    incomplete: "Incomplete",
    progress: "Progress",
    requiredHeroes: "Required heroes",
    notEnoughResources: "Not enough resources",
    youNeed: "You need",
    toUpgrade: "to upgrade",
    heroUnlocked: "Hero Unlocked!",
    heroUpgraded: "Hero Upgraded!",
    isNowLevel: "is now level",
    collectionCompleted: "Collection Completed!",
    abilityReady: "Ability Ready",
    abilityActive: "Ability Active",
    abilityOnCooldown: "On Cooldown",
    secondsLeft: "seconds left",
    activateAbility: "Activate",
    miniGameAvailable: "Mini-Game Available!",
    playMiniGame: "Play Mini-Game",
    miniGameWon: "Mini-Game Completed!",
    miniGameFailed: "Try Again!",
    miniGameInstructions: "Tap the targets quickly to win!",
    miniGameReward: "You earned",
    upgrades: "Upgrades",
    availableUpgrades: "Available Upgrades",
    purchasedUpgrades: "Purchased Upgrades",
    noUpgradesAvailable: "No upgrades available yet",
    upgradeUnlocked: "Upgrade Unlocked!",
    gemFound: "Gem Found!",
    gameLoaded: "Game Loaded",
    welcomeBack: "Welcome back to Doge Legends Idle Game!",
    locked: "Game Locked",
    lockedDescription: "Donate TON to unlock game features and characters. Your support helps us continue development!",
    unlockButton: "Donate to Unlock",
  },
  es: {
    idleGameTitle: "Doge Idle Game",
    idleGameSubtitle: "Construye tu imperio mafioso y recolecta recursos",
    bones: "Huesos",
    dollars: "Dólares",
    gems: "Gemas",
    production: "Producción",
    perSecond: "huesos/seg",
    tapToCollect: "Toca para recolectar",
    heroes: "Héroes",
    collections: "Colecciones",
    upgradesTab: "Mejoras",
    buy: "Comprar",
    upgrade: "Mejorar",
    level: "Nvl",
    nextLevel: "Siguiente nivel",
    complete: "Completado",
    incomplete: "Incompleto",
    progress: "Progreso",
    requiredHeroes: "Héroes requeridos",
    notEnoughResources: "Recursos insuficientes",
    youNeed: "Necesitas",
    toUpgrade: "para mejorar",
    heroUnlocked: "¡Héroe Desbloqueado!",
    heroUpgraded: "¡Héroe Mejorado!",
    isNowLevel: "ahora es nivel",
    collectionCompleted: "¡Colección Completada!",
    abilityReady: "Habilidad Lista",
    abilityActive: "Habilidad Activa",
    abilityOnCooldown: "En Recarga",
    secondsLeft: "segundos restantes",
    activateAbility: "Activar",
    miniGameAvailable: "¡Mini-Juego Disponible!",
    playMiniGame: "Jugar Mini-Juego",
    miniGameWon: "¡Mini-Juego Completado!",
    miniGameFailed: "¡Inténtalo Otra Vez!",
    miniGameInstructions: "¡Toca los objetivos rápidamente para ganar!",
    miniGameReward: "Has ganado",
    upgrades: "Mejoras",
    availableUpgrades: "Mejoras Disponibles",
    purchasedUpgrades: "Mejoras Adquiridas",
    noUpgradesAvailable: "No hay mejoras disponibles aún",
    upgradeUnlocked: "¡Mejora Desbloqueada!",
    gemFound: "¡Gema Encontrada!",
    gameLoaded: "Juego Cargado",
    welcomeBack: "¡Bienvenido de nuevo a Doge Legends Idle Game!",
    locked: "Juego Bloqueado",
    lockedDescription: "Dona TON para desbloquear las funciones del juego y personajes. ¡Tu apoyo nos ayuda a continuar el desarrollo!",
    unlockButton: "Donar para Desbloquear",
  },
  ja: {
    idleGameTitle: "ドゲアイドルゲーム",
    idleGameSubtitle: "マフィア帝国を構築してリソースを収集",
    bones: "ボーン",
    dollars: "ドル",
    gems: "ジェム",
    production: "生産",
    perSecond: "ボーン/秒",
    tapToCollect: "タップして収集",
    heroes: "ヒéroー",
    collections: "コレクション",
    upgradesTab: "アップグレード",
    buy: "購入",
    upgrade: "アップグレード",
    level: "Lv",
    nextLevel: "次のレベル",
    complete: "完了",
    incomplete: "未完了",
    progress: "進行状況",
    requiredHeroes: "必要なヒéroー",
    notEnoughResources: "リソースが不足しています",
    youNeed: "必要なもの：",
    toUpgrade: "をアップグレードするために",
    heroUnlocked: "ヒーロー解放！",
    heroUpgraded: "ヒーローアップグレード！",
    isNowLevel: "は現在レベル",
    collectionCompleted: "コレクション完了！",
    abilityReady: "能力準備完了",
    abilityActive: "能力発動中",
    abilityOnCooldown: "クールダウン中",
    secondsLeft: "秒残り",
    activateAbility: "発動",
    miniGameAvailable: "ミニゲーム利用可能！",
    playMiniGame: "ミニゲームをプレイ",
    miniGameWon: "ミニゲーム完了！",
    miniGameFailed: "もう一度挑戦！",
    miniGameInstructions: "素早くターゲットをタップして勝利しよう！",
    miniGameReward: "獲得した報酬：",
    upgrades: "アップグレード",
    availableUpgrades: "利用可能なアップグレード",
    purchasedUpgrades: "購入済みアップグレード",
    noUpgradesAvailable: "まだアップグレードはありません",
    upgradeUnlocked: "アップグレード解放！",
    gemFound: "ジ���ムを発見！",
    gameLoaded: "ゲーム読み込み完了",
    welcomeBack: "Doge Legends Idle Gameへようこそ！",
    locked: "ゲームがロックされています",
    lockedDescription: "ゲーム機能とキャラクターのロックを解除するには、TONを寄付してください。あなたのサポートが開発を続けるのに役立ちます！",
    unlockButton: "寄付してロック解除",
  },
  zh: {
    idleGameTitle: "Doge放置游戏",
    idleGameSubtitle: "建立你的黑手党���国并收集资源",
    bones: "骨头",
    dollars: "美元",
    gems: "宝石",
    production: "生产",
    perSecond: "骨头/秒",
    tapToCollect: "点击收集",
    heroes: "英雄",
    collections: "收藏",
    upgradesTab: "升级",
    buy: "购买",
    upgrade: "升级",
    level: "等级",
    nextLevel: "下一级",
    complete: "已完成",
    incomplete: "未完成",
    progress: "进度",
    requiredHeroes: "所需英雄",
    notEnoughResources: "资源不足",
    youNeed: "你需要",
    toUpgrade: "来升级",
    heroUnlocked: "英雄解锁！",
    heroUpgraded: "英雄升级！",
    isNowLevel: "现在是等级",
    collectionCompleted: "收藏完成！",
    abilityReady: "技能准备就绪",
    abilityActive: "技能激活中",
    abilityOnCooldown: "冷却中",
    secondsLeft: "秒剩余",
    activateAbility: "激活",
    miniGameAvailable: "小游戏可用！",
    playMiniGame: "玩小游戏",
    miniGameWon: "小游戏完成！",
    miniGameFailed: "再试一次！",
    miniGameInstructions: "快速点击目标来获胜！",
    miniGameReward: "你获得了",
    upgrades: "升级",
    availableUpgrades: "可用升级",
    purchasedUpgrades: "已购买的升级",
    noUpgradesAvailable: "暂无可用升级",
    upgradeUnlocked: "升级已解锁！",
    gemFound: "发现宝石！",
    gameLoaded: "游戏已加载",
    welcomeBack: "欢迎回到Doge Legends放置游戏！",
    locked: "游戏已锁定",
    lockedDescription: "捐赠TON以解锁游戏功能和角色。您的支持帮助我们继续开发！",
    unlockButton: "捐赠解锁",
  }
};

const IdleGameSystem = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language as keyof typeof translations] || translations.en;
  const { toast } = useToast();
  const { playSound } = useSound();
  const { gameState, addCurrency, addExperience } = useGameState();
  
  const [currency, setCurrency] = useState<GameCurrency>({ 
    bones: 10, 
    dollars: 0, 
    gems: 0 
  });
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [productionPerSecond, setProductionPerSecond] = useState(0);
  const [activeTab, setActiveTab] = useState('heroes');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [activeAbilities, setActiveAbilities] = useState<number[]>([]);
  const [miniGame, setMiniGame] = useState<MiniGame | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameTargets, setMiniGameTargets] = useState<{id: number, x: number, y: number}[]>([]);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [upgradeNodes, setUpgradeNodes] = useState<UpgradeNode[]>([]);
  const [productionMultiplier, setProductionMultiplier] = useState(1);
  const [incomeBoostActive, setIncomeBoostActive] = useState(false);
  const [incomeBoostEndTime, setIncomeBoostEndTime] = useState<number | null>(null);
  
  useEffect(() => {
    const initialHeroes: Hero[] = [
      {
        id: 1,
        name: "Doge Rookie",
        level: 0,
        baseCost: 5,
        baseProduction: 1,
        owned: false,
        collection: "Mafia Beginners",
        description: "A novice member of the Doge Family",
        upgradeMultiplier: 1.1,
        image: "/lovable-uploads/e01a4cf8-fade-4973-a943-82cab1bad514.png",
        role: "IncomeGenerator",
        tags: ["Rookie", "Shiba"],
        abilities: [
          {
            id: 101,
            name: "Tap Frenzy",
            description: "Increases tap value by 500% for 10 seconds",
            type: "Active",
            effect: {
              type: "Multiplier",
              value: 5
            },
            target: "Self",
            duration: 10,
            cooldown: 60,
            currentCooldown: 0,
            isActive: false
          }
        ]
      },
      {
        id: 2,
        name: "Shadow Greyhound",
        level: 0,
        baseCost: 25,
        baseProduction: 5,
        owned: false,
        collection: "Mafia Specialists",
        description: "Fast and silent enforcer",
        upgradeMultiplier: 1.15,
        image: "/lovable-uploads/5e94d4ae-e50a-4330-9c4d-3036b0aec7fa.png",
        role: "AbilitySpecialist",
        tags: ["Specialist", "Muscle"],
        abilities: [
          {
            id: 102,
            name: "Income Rush",
            description: "Doubles all income for 15 seconds",
            type: "Active",
            effect: {
              type: "Multiplier",
              value: 2
            },
            target: "Global",
            duration: 15,
            cooldown: 120,
            currentCooldown: 0,
            isActive: false
          }
        ]
      },
      {
        id: 3,
        name: "Rescue Hound",
        level: 0,
        baseCost: 100,
        baseProduction: 20,
        owned: false,
        collection: "Dragon Allies",
        description: "A loyal ally from the Dragon faction",
        upgradeMultiplier: 1.2,
        image: "/lovable-uploads/3b85fedc-243a-4a05-b130-6c8e729e88ec.png",
        role: "Support",
        tags: ["Support", "Dragon"],
        abilities: [
          {
            id: 103,
            name: "Find Gems",
            description: "High chance to find gems over the next 30 seconds",
            type: "Active",
            effect: {
              type: "Special",
              value: 0.5
            },
            target: "Global",
            duration: 30,
            cooldown: 300,
            currentCooldown: 0,
            isActive: false
          }
        ]
      }
    ];
    
    const initialCollections: Collection[] = [
      {
        id: "mafia-beginners",
        name: "Mafia Beginners",
        bonus: "Increase bone production by 25%",
        bonusValue: 0.25,
        requiredHeroes: [1],
        completed: false
      },
      {
        id: "mafia-specialists",
        name: "Mafia Specialists",
        bonus: "Increase dollar production by 30%",
        bonusValue: 0.3,
        requiredHeroes: [1, 2],
        completed: false
      },
      {
        id: "dragon-allies",
        name: "Dragon Allies",
        bonus: "Occasional gem drops",
        bonusValue: 0.1,
        requiredHeroes: [3],
        completed: false
      }
    ];
    
    const initialUpgradeNodes: UpgradeNode[] = [
      {
        id: 1,
        name: "Tap Power",
        cost: 50,
        prerequisiteLevel: 5,
        effect: {
          type: "AddPassiveBonus",
          value: 2
        },
        purchased: false
      },
      {
        id: 2,
        name: "Tax Evasion Secrets",
        cost: 100,
        prerequisiteLevel: 10,
        effect: {
          type: "AddPassiveBonus",
          value: 0.05
        },
        purchased: false
      },
      {
        id: 3,
        name: "Enhanced Tap Frenzy",
        cost: 200,
        prerequisiteLevel: 15,
        prerequisiteUpgrade: 1,
        effect: {
          type: "EnhanceAbility",
          value: 2,
          abilityId: 101
        },
        purchased: false
      }
    ];
    
    setHeroes(initialHeroes);
    setCollections(initialCollections);
    setUpgradeNodes(initialUpgradeNodes);
    
    const savedGame = localStorage.getItem('dogeIdleGame');
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        setCurrency(parsed.currency || currency);
        
        const updatedHeroes = initialHeroes.map(hero => {
          const savedHero = parsed.heroes.find((h: Hero) => h.id === hero.id);
          if (savedHero) {
            return {
              ...hero,
              level: savedHero.level,
              owned: savedHero.level > 0
            };
          }
          return hero;
        });
        setHeroes(updatedHeroes);
        
        if (parsed.upgradeNodes && Array.isArray(parsed.upgradeNodes)) {
          const updatedUpgradeNodes = initialUpgradeNodes.map(node => {
            const savedNode = parsed.upgradeNodes.find((n: UpgradeNode) => n.id === node.id);
            if (savedNode) {
              return {
                ...node,
                purchased: savedNode.purchased
              };
            }
            return node;
          });
          setUpgradeNodes(updatedUpgradeNodes);
        }
        
        toast({
          title: t.gameLoaded,
          description: t.welcomeBack,
        });
        
        calculateProduction(
          parsed.heroes || initialHeroes, 
          initialCollections,
          parsed.upgradeNodes || initialUpgradeNodes
        );
      } catch (e) {
        console.error("Error loading saved game:", e);
      }
    }
    
    const gameInterval = setInterval(() => {
      updateGameState();
    }, 1000);
    
    const miniGameInterval = setInterval(() => {
      if (Math.random() < 0.1 && !miniGame) {
        spawnMiniGame();
      }
    }, 30000);
    
    const abilityCooldownInterval = setInterval(() => {
      updateAbilityCooldowns();
    }, 1000);
    
    return () => {
      clearInterval(gameInterval);
      clearInterval(miniGameInterval);
      clearInterval(abilityCooldownInterval);
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem('dogeIdleGame', JSON.stringify({
      currency,
      heroes: heroes.filter(h => h.owned),
      upgradeNodes
    }));
  }, [currency, heroes, upgradeNodes]);
  
  useEffect(() => {
    updateCollections();
    calculateProduction(heroes, collections, upgradeNodes);
  }, [heroes, collections]);
  
  const updateAbilityCooldowns = () => {
    const updatedHeroes = [...heroes];
    let updated = false;
    
    updatedHeroes.forEach(hero => {
      hero.abilities.forEach(ability => {
        if (ability.currentCooldown > 0) {
          ability.currentCooldown -= 1;
          updated = true;
        }
        
        if (ability.isActive && activeAbilities.includes(ability.id)) {
          const index = activeAbilities.indexOf(ability.id);
          if (index !== -1) {
            const activationTime = Date.now() - ability.duration * 1000;
            if (activationTime <= 0) {
              ability.isActive = false;
              setActiveAbilities(prev => prev.filter(id => id !== ability.id));
              updated = true;
              
              toast({
                title: `${ability.name} Ended`,
                description: `The effect has worn off.`,
              });
            }
          }
        }
      });
    });
    
    if (updated) {
      setHeroes(updatedHeroes);
    }
    
    if (incomeBoostActive && incomeBoostEndTime && Date.now() >= incomeBoostEndTime) {
      setIncomeBoostActive(false);
      setIncomeBoostEndTime(null);
      setProductionMultiplier(1);
    }
  };
  
  const calculateProduction = (currentHeroes: Hero[], currentCollections: Collection[], currentUpgrades: UpgradeNode[] = []) => {
    let total = 0;
    
    currentHeroes.forEach(hero => {
      if (hero.owned) {
        let heroProduction = hero.baseProduction * hero.level;
        
        if (hero.role === 'IncomeGenerator') {
          heroProduction *= 1.2;
        }
        
        const muscleTags = currentHeroes.filter(h => h.owned && h.tags.includes('Muscle')).length;
        if (muscleTags >= 2) {
          heroProduction *= 1.1;
        }
        
        total += heroProduction;
        
        hero.abilities.forEach(ability => {
          if (ability.type === 'Passive') {
            if (ability.target === 'Global') {
              total += total * ability.effect.value;
            } else if (ability.target === 'Self') {
              total += heroProduction * ability.effect.value;
            }
          }
        });
      }
    });
    
    currentCollections.forEach(collection => {
      if (collection.completed) {
        total += total * collection.bonusValue;
      }
    });
    
    currentUpgrades.forEach(upgrade => {
      if (upgrade.purchased && upgrade.effect.type === 'AddPassiveBonus') {
        total += total * upgrade.effect.value;
      }
    });
    
    if (incomeBoostActive) {
      total *= productionMultiplier;
    }
    
    setProductionPerSecond(total);
  };
  
  const updateCollections = () => {
    const updatedCollections = collections.map(collection => {
      const allOwned = collection.requiredHeroes.every(heroId => {
        const hero = heroes.find(h => h.id === heroId);
        return hero && hero.owned;
      });
      
      if (allOwned && !collection.completed) {
        toast({
          title: t.collectionCompleted,
          description: `${collection.name}: ${collection.bonus}`,
          variant: "default"
        });
        playSound('success');
      }
      
      return {
        ...collection,
        completed: allOwned
      };
    });
    
    setCollections(updatedCollections);
  };
  
  const updateGameState = () => {
    const now = Date.now();
    const deltaTime = (now - lastUpdate) / 1000;
    setLastUpdate(now);
    
    const gained = Math.floor(productionPerSecond * deltaTime);
    if (gained > 0) {
      setCurrency(prev => ({
        ...prev,
        bones: prev.bones + gained
      }));
      
      if (Math.random() < 0.05) {
        const dollarsGained = Math.floor(gained / 10);
        if (dollarsGained > 0) {
          setCurrency(prev => ({
            ...prev,
            dollars: prev.dollars + dollarsGained
          }));
        }
      }
      
      if ((collections.find(c => c.id === "dragon-allies")?.completed && Math.random() < 0.01) || 
          (activeAbilities.some(id => {
            const hero = heroes.find(h => h.abilities.some(a => a.id === id));
            return hero && hero.abilities.some(a => a.id === id && a.name === "Find Gems");
          }) && Math.random() < 0.05)) {
        
        setCurrency(prev => ({
          ...prev,
          gems: prev.gems + 1
        }));
        toast({
          title: t.gemFound,
          description: "Your Dragon Allies found a precious gem!",
        });
        playSound('coin');
      }
    }
  };
  
  const handleClickResource = () => {
    let clickValue = 1;
    
    if (activeAbilities.some(id => {
      const hero = heroes.find(h => h.abilities.some(a => a.id === id));
      return hero && hero.abilities.some(a => a.id === id && a.name === "Tap Frenzy");
    })) {
      clickValue *= 5;
    }
    
    setCurrency(prev => ({
      ...prev,
      bones: prev.bones + clickValue
    }));
    playSound('button');
    
    addExperience(1);
  };
  
  const handleHeroUpgrade = (hero: Hero) => {
    const heroIndex = heroes.findIndex(h => h.id === hero.id);
    if (heroIndex === -1) return;
    
    const cost = Math.ceil(hero.baseCost * Math.pow(hero.upgradeMultiplier, hero.level));
    
    if (currency.bones < cost) {
      toast({
        title: t.notEnoughResources,
        description: `${t.youNeed} ${cost} ${t.bones} ${t.toUpgrade} ${hero.name}`,
        variant: "destructive"
      });
      playSound('error');
      return;
    }
    
    setCurrency(prev => ({
      ...prev,
      bones: prev.bones - cost
    }));
    
    const updatedHeroes = [...heroes];
    updatedHeroes[heroIndex] = {
      ...hero,
      level: hero.level + 1,
      owned: true
    };
    
    setHeroes(updatedHeroes);
    playSound('coin');
    
    toast({
      title: hero.level === 0 ? t.heroUnlocked : t.heroUpgraded,
      description: `${hero.name} ${t.isNowLevel} ${hero.level + 1}!`,
    });
    
    addExperience(hero.level === 0 ? 5 : 2);
    
    if (hero.level === 0) {
      addCurrency('dogeCoin', 5);
    }
  };
  
  const activateAbility = (heroId: number, abilityId: number) => {
    const heroIndex = heroes.findIndex(h => h.id === heroId);
    if (heroIndex === -1) return;
    
    const hero = heroes[heroIndex];
    const abilityIndex = hero.abilities.findIndex(a => a.id === abilityId);
    if (abilityIndex === -1) return;
    
    const ability = hero.abilities[abilityIndex];
    
    if (ability.currentCooldown > 0) {
      toast({
        title: t.abilityOnCooldown,
        description: `${ability.currentCooldown} ${t.secondsLeft}`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedHeroes = [...heroes];
    updatedHeroes[heroIndex].abilities[abilityIndex].isActive = true;
    updatedHeroes[heroIndex].abilities[abilityIndex].currentCooldown = ability.cooldown;
    
    setHeroes(updatedHeroes);
    setActiveAbilities(prev => [...prev, ability.id]);
    
    if (ability.name === "Income Rush") {
      setProductionMultiplier(2);
      setIncomeBoostActive(true);
      setIncomeBoostEndTime(Date.now() + ability.duration * 1000);
    }
    
    playSound('success');
    toast({
      title: t.abilityActive,
      description: `${ability.name}: ${ability.description}`,
    });
    
    addExperience(3);
  };
  
  const spawnMiniGame = () => {
    const miniGames = [
      {
        id: "target-tapping",
        name: "Target Tapping",
        description: "Tap 10 targets quickly to win a bonus!",
        rewardType: "IncomeBoost" as const,
        rewardValue: 3,
        rewardDuration: 60,
        active: true,
        completed: false
      },
      {
        id: "quick-collect",
        name: "Quick Collect",
        description: "Tap quickly to collect bonus resources!",
        rewardType: "LumpSum" as const,
        rewardValue: 500,
        active: true,
        completed: false
      }
    ];
    
    const randomGame = miniGames[Math.floor(Math.random() * miniGames.length)];
    setMiniGame(randomGame);
    
    if (randomGame.id === "target-tapping") {
      const targets = [];
      for (let i = 0; i < 10; i++) {
        targets.push({
          id: i,
          x: Math.floor(Math.random() * 80) + 10,
          y: Math.floor(Math.random() * 80) + 10
        });
      }
      setMiniGameTargets(targets);
    }
    
    toast({
      title: t.miniGameAvailable,
      description: randomGame.name,
    });
    playSound('success');
  };
  
  const playMiniGame = () => {
    setShowMiniGame(true);
    setMiniGameScore(0);
  };
  
  const handleTargetClick = (targetId: number) => {
    setMiniGameTargets(prev => prev.filter(t => t.id !== targetId));
    setMiniGameScore(prev => prev + 1);
    playSound('coin');
    
    if (miniGameScore + 1 >= 10) {
      completeMiniGame(true);
    }
  };
  
  const completeMiniGame = (success: boolean) => {
    if (!miniGame) return;
    
    setShowMiniGame(false);
    
    if (success) {
      if (miniGame.rewardType === "IncomeBoost") {
        setProductionMultiplier(miniGame.rewardValue);
        setIncomeBoostActive(true);
        setIncomeBoostEndTime(Date.now() + (miniGame.rewardDuration || 60) * 1000);
        
        toast({
          title: t.miniGameWon,
          description: `${t.miniGameReward} ${miniGame.rewardValue}x ${t.production} ${t.bones} for ${miniGame.rewardDuration} seconds!`,
        });
      } else if (miniGame.rewardType === "LumpSum") {
        setCurrency(prev => ({
          ...prev,
          bones: prev.bones + miniGame.rewardValue
        }));
        
        toast({
          title: t.miniGameWon,
          description: `${t.miniGameReward} ${miniGame.rewardValue} ${t.bones}!`,
        });
      }
      
      playSound('success');
      addExperience(10);
    } else {
      toast({
        title: t.miniGameFailed,
        description: "Better luck next time!",
        variant: "destructive"
      });
      playSound('error');
    }
    
    setMiniGame(null);
  };
  
  const purchaseUpgrade = (upgradeId: number) => {
    const upgradeIndex = upgradeNodes.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return;
    
    const upgrade = upgradeNodes[upgradeIndex];
    
    if (currency.dollars < upgrade.cost) {
      toast({
        title: t.notEnoughResources,
        description: `${t.youNeed} ${upgrade.cost} ${t.dollars} ${t.toUpgrade}`,
        variant: "destructive"
      });
      playSound('error');
      return;
    }
    
    if (upgrade.prerequisiteUpgrade) {
      const prereqUpgrade = upgradeNodes.find(u => u.id === upgrade.prerequisiteUpgrade);
      if (prereqUpgrade && !prereqUpgrade.purchased) {
        toast({
          title: "Prerequisite Required",
          description: `You need to purchase ${prereqUpgrade.name} first`,
          variant: "destructive"
        });
        playSound('error');
        return;
      }
    }
    
    setCurrency(prev => ({
      ...prev,
      dollars: prev.dollars - upgrade.cost
    }));
    
    const updatedUpgradeNodes = [...upgradeNodes];
    updatedUpgradeNodes[upgradeIndex].purchased = true;
    setUpgradeNodes(updatedUpgradeNodes);
    
    if (upgrade.effect.type === "EnhanceAbility" && upgrade.effect.abilityId) {
      const updatedHeroes = [...heroes];
      for (let hero of updatedHeroes) {
        const abilityIndex = hero.abilities.findIndex(a => a.id === upgrade.effect.abilityId);
        if (abilityIndex !== -1) {
          hero.abilities[abilityIndex].effect.value += upgrade.effect.value;
          break;
        }
      }
      setHeroes(updatedHeroes);
    }
    
    calculateProduction(heroes, collections, updatedUpgradeNodes);
    
    toast({
      title: t.upgradeUnlocked,
      description: upgrade.name,
    });
    playSound('success');
    addExperience(5);
  };
  
  const getUpgradeCost = (hero: Hero) => {
    return Math.ceil(hero.baseCost * Math.pow(hero.upgradeMultiplier, hero.level));
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  const getCollectionProgress = (collection: Collection) => {
    const total = collection.requiredHeroes.length;
    const owned = collection.requiredHeroes.filter(heroId => {
      const hero = heroes.find(h => h.id === heroId);
      return hero && hero.owned;
    }).length;
    
    return (owned / total) * 100;
  };

  return (
    <div id="idle-game" className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-background/60 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-primary/20">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-display font-bold mb-1">{t.idleGameTitle}</h2>
          <p className="text-muted-foreground text-sm mb-4">{t.idleGameSubtitle}</p>
          
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-6">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1">
                <Coins className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="font-medium">{formatNumber(currency.bones)}</div>
              <div className="text-xs text-muted-foreground">{t.bones}</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1">
                <BadgeDollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="font-medium">{formatNumber(currency.dollars)}</div>
              <div className="text-xs text-muted-foreground">{t.dollars}</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 text-center">
              <div className="flex justify-center mb-1">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div className="font-medium">{formatNumber(currency.gems)}</div>
              <div className="text-xs text-muted-foreground">{t.gems}</div>
            </div>
          </div>
          
          <div className="w-full max-w-md mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">{t.production}</span>
              <span className="text-sm font-medium">
                {formatNumber(productionPerSecond)} {t.perSecond}
                {incomeBoostActive && (
                  <span className="ml-1 text-green-500">
                    ({productionMultiplier}x)
                  </span>
                )}
              </span>
            </div>
            <Progress value={100} className={`h-2 ${incomeBoostActive ? 'bg-green-500/30' : ''}`} />
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleClickResource}
            className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-all duration-200 border-primary/20 mb-6 flex flex-col items-center justify-center gap-1 ${
              activeAbilities.some(id => {
                const hero = heroes.find(h => h.abilities.some(a => a.id === id));
                return hero && hero.abilities.some(a => a.id === id && a.name === "Tap Frenzy");
              }) ? 'animate-pulse from-yellow-400/30 to-yellow-500/10' : ''
            }`}
          >
            <Coins className="h-8 w-8 text-primary" />
            <span className="text-xs">{t.tapToCollect}</span>
          </Button>
          
          {miniGame && !showMiniGame && (
            <Button
              variant="default"
              className="mb-4 bg-purple-600 hover:bg-purple-700 animate-pulse"
              onClick={playMiniGame}
            >
              <Zap className="mr-2 h-4 w-4" />
              {t.playMiniGame}: {miniGame.name}
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="heroes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="heroes" className="flex-1">
              <Users className="h-4 w-4 mr-1" /> {t.heroes}
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1">
              <Award className="h-4 w-4 mr-1" /> {t.collections}
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-1" /> {t.upgradesTab}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="heroes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroes.map(hero => (
                <Card key={hero.id} className={`${hero.owned ? 'border-primary/30' : 'border-gray-500/30'}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{hero.name}</CardTitle>
                        <CardDescription>{hero.description}</CardDescription>
                        <div className="flex mt-1 space-x-2">
                          {hero.tags.map((tag, index) => (
                            <div key={index} className="text-xs px-2 py-0.5 bg-secondary/20 rounded-full">
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{t.level} {hero.level}</div>
                        <div className="text-xs text-muted-foreground">{hero.collection}</div>
                        <div className="text-xs text-primary">{hero.role}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t.production}:</span>
                      <span>
                        {hero.owned 
                          ? `${formatNumber(hero.baseProduction * hero.level)} ${t.perSecond}` 
                          : `${formatNumber(hero.baseProduction)} ${t.perSecond}`
                        }
                      </span>
                    </div>
                    {hero.owned && (
                      <div className="flex justify-between text-sm">
                        <span>{t.nextLevel}:</span>
                        <span>+{formatNumber(hero.baseProduction)} {t.perSecond}</span>
                      </div>
                    )}
                    
                    {hero.owned && hero.abilities.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-sm font-medium mb-2">Abilities:</div>
                        {hero.abilities.map(ability => (
                          <div key={ability.id} className="mb-2 last:mb-0">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium">{ability.name}</div>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 ${
                                  ability.isActive ? 'bg-green-500/20 text-green-500' :
                                  ability.currentCooldown > 0 ? 'bg-gray-500/20 text-gray-400' :
                                  'bg-primary/20 text-primary'
                                }`}
                                disabled={ability.currentCooldown > 0 || ability.isActive}
                                onClick={() => activateAbility(hero.id, ability.id)}
                              >
                                {ability.isActive ? t.abilityActive :
                                 ability.currentCooldown > 0 ? `${ability.currentCooldown}s` :
                                 t.activateAbility}
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">{ability.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center justify-center gap-2" 
                      onClick={() => handleHeroUpgrade(hero)}
                      disabled={currency.bones < getUpgradeCost(hero)}
                      variant={hero.owned ? "default" : "outline"}
                    >
                      {hero.owned ? (
                        <>
                          <TrendingUp className="h-4 w-4" />
                          <span>{t.upgrade} ({formatNumber(getUpgradeCost(hero))} {t.bones})</span>
                        </>
                      ) : (
                        <>
                          <BadgePlus className="h-4 w-4" />
                          <span>{t.buy} ({formatNumber(getUpgradeCost(hero))} {t.bones})</span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="collections">
            <div className="grid grid-cols-1 gap-4">
              {collections.map(collection => (
                <Card key={collection.id} className={`${collection.completed ? 'border-green-500/30' : 'border-gray-500/30'}`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{collection.name}</CardTitle>
                      <div className={`px-2 py-1 rounded-full text-xs ${collection.completed ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                        {collection.completed ? t.complete : t.incomplete}
                      </div>
                    </div>
                    <CardDescription>{collection.bonus}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t.progress}:</span>
                        <span>
                          {collection.requiredHeroes.filter(id => heroes.find(h => h.id === id)?.owned).length}/
                          {collection.requiredHeroes.length} {t.heroes}
                        </span>
                      </div>
                      <Progress value={getCollectionProgress(collection)} className="h-2" />
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t.requiredHeroes}:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {collection.requiredHeroes.map(heroId => {
                          const hero = heroes.find(h => h.id === heroId);
                          return hero ? (
                            <div 
                              key={heroId}
                              className={`px-2 py-1 rounded-md text-xs ${
                                hero.owned ? 'bg-primary/20 text-primary' : 'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {hero.name}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upgrades">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t.availableUpgrades}</CardTitle>
                </CardHeader>
                <CardContent>
                  {upgradeNodes.filter(u => !u.purchased).length > 0 ? (
                    <div className="space-y-4">
                      {upgradeNodes.filter(u => !u.purchased).map(upgrade => {
                        const meetsLevelReq = heroes.some(h => h.level >= upgrade.prerequisiteLevel);
                        const meetsUpgradeReq = !upgrade.prerequisiteUpgrade || 
                                              upgradeNodes.find(u => u.id === upgrade.prerequisiteUpgrade)?.purchased;
                        const prereqMet = meetsLevelReq && meetsUpgradeReq;
                        
                        return (
                          <div 
                            key={upgrade.id} 
                            className={`p-4 rounded-lg border ${prereqMet ? 'border-primary/30' : 'border-gray-500/30 opacity-50'}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{upgrade.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {upgrade.effect.type === 'AddPassiveBonus' && 
                                    `+${upgrade.effect.value * 100}% global income`}
                                  {upgrade.effect.type === 'EnhanceAbility' && 
                                    `Enhances ability effect by ${upgrade.effect.value}x`}
                                </div>
                                {!prereqMet && (
                                  <div className="text-xs text-red-400 mt-1">
                                    {!meetsLevelReq && `Requires hero level ${upgrade.prerequisiteLevel}`}
                                    {!meetsUpgradeReq && upgrade.prerequisiteUpgrade && 
                                      `Requires ${upgradeNodes.find(u => u.id === upgrade.prerequisiteUpgrade)?.name}`}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => purchaseUpgrade(upgrade.id)}
                                disabled={!prereqMet || currency.dollars < upgrade.cost}
                              >
                                {upgrade.cost} {t.dollars}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {t.noUpgradesAvailable}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {upgradeNodes.filter(u => u.purchased).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.purchasedUpgrades}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {upgradeNodes.filter(u => u.purchased).map(upgrade => (
                        <div 
                          key={upgrade.id} 
                          className="p-3 rounded-lg bg-primary/10"
                        >
                          <div className="font-medium">{upgrade.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {upgrade.effect.type === 'AddPassiveBonus' && 
                              `+${upgrade.effect.value * 100}% global income`}
                            {upgrade.effect.type === 'EnhanceAbility' && 
                              `Enhances ability effect by ${upgrade.effect.value}x`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showMiniGame} onOpenChange={setShowMiniGame}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{miniGame?.name}</DialogTitle>
          </DialogHeader>
          <div className="h-64 relative bg-background/50 rounded-md border border-border">
            {miniGame?.id === "target-tapping" && (
              <>
                <div className="text-center pt-2 text-sm">{t.miniGameInstructions}</div>
                <div className="text-center text-lg font-bold">{miniGameScore}/10</div>
                {miniGameTargets.map(target => (
                  <button
                    key={target.id}
                    className="absolute w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors animate-pulse"
                    style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => handleTargetClick(target.id)}
                  >
                    <Target className="h-6 w-6 text-white" />
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="flex justify-between">
            <Button variant="destructive" onClick={() => completeMiniGame(false)}>
              Cancel
            </Button>
            <div className="text-sm text-muted-foreground">
              {miniGame?.rewardType === 'IncomeBoost' ? 
                `Reward: ${miniGame?.rewardValue}x income for ${miniGame?.rewardDuration}s` : 
                miniGame ? `Reward: ${miniGame?.rewardValue} bones` : ''}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdleGameSystem;
