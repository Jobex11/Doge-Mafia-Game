import React, { useState, useContext, useEffect } from 'react';
import { Moon, Sun, Shield, User, UserX, Search, ScrollText, CreditCard, MessageCircle, VolumeX, Volume2, Award, Gift, Heart } from 'lucide-react';
import { LanguageContext } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useSound } from '@/hooks/useSound';
import { useGameState } from '@/hooks/useGameState';
import { Progress } from "@/components/ui/progress";

const translations = {
  en: {
    title: "Mafia Mystery",
    subtitle: "A game of deception and detective work",
    waitingForPlayers: "Waiting for players to join...",
    startGame: "Start Game",
    endGame: "End Game",
    gameEnded: "Game Ended",
    gameInProgress: "Game is in progress",
    yourRole: "Your Role",
    votePlayer: "Vote to Eliminate",
    useAbility: "Use Ability",
    chat: "Game Chat",
    sendMessage: "Send",
    messagePlaceholder: "Type your message...",
    nightPhase: "Night Phase",
    dayPhase: "Day Phase",
    nightDesc: "The town sleeps. Mafia and special roles are active.",
    dayDesc: "The town is awake. Discuss and vote to eliminate suspects.",
    doctorDesc: "You can protect one player each night from being eliminated",
    detectiveDesc: "You can investigate one player each night to determine their role",
    vigilanteDesc: "You can eliminate one player during the night",
    godfatherDesc: "You lead the Mafia. You appear innocent to investigations.",
    mafiaGoal: "Eliminate all citizens to win the game",
    citizensGoal: "Find and eliminate all Mafia members to win the game",
    playerEliminated: "has been eliminated from the game",
    nightPhaseDesc: "Night has fallen. Special roles are now active.",
    dayPhaseDesc: "The day has begun. Discuss and vote to eliminate suspects.",
    muteSound: "Mute Sound",
    unmuteSound: "Unmute Sound",
    mafiaWin: "The Mafia has taken over the town. Mafia wins!",
    citizensWin: "All Mafia members have been eliminated. Citizens win!",
    cardInvoked: "Card Invoked",
    nftReward: "NFT Reward",
    nftRewardDesc: "You've earned a special NFT for completing the game!",
    nftClaimed: "NFT Claimed",
    claimNft: "Claim NFT",
    donate: "Donate",
    donationThankYou: "Thank You!",
    donationProcessed: "Your donation has been processed. Check your character collection for new unlocks!",
    yourCharacters: "Your Characters",
    noCharacters: "No characters unlocked yet. Donate TON or use the Gacha system to acquire characters!",
    walletRequired: "Wallet Required",
    walletRequiredDesc: "Please connect your TON wallet to receive your NFT reward"
  },
  es: {
    title: "Misterio de la Mafia",
    subtitle: "Un juego de engaño y trabajo de detective",
    waitingForPlayers: "Esperando a que se unan los jugadores...",
    startGame: "Iniciar Juego",
    endGame: "Finalizar Juego",
    gameEnded: "Juego Terminado",
    gameInProgress: "El juego está en progreso",
    yourRole: "Tu Rol",
    votePlayer: "Votar para Eliminar",
    useAbility: "Usar Habilidad",
    chat: "Chat del Juego",
    sendMessage: "Enviar",
    messagePlaceholder: "Escribe tu mensaje...",
    nightPhase: "Fase Nocturna",
    dayPhase: "Fase Diurna",
    nightDesc: "La ciudad duerme. La Mafia y roles especiales están activos.",
    dayDesc: "La ciudad está despierta. Discutan y voten para eliminar sospechosos.",
    doctorDesc: "Puedes proteger a un jugador cada noche de ser eliminado",
    detectiveDesc: "Puedes investigar a un jugador cada noche para determinar su rol",
    vigilanteDesc: "Puedes eliminar a un jugador durante la noche",
    godfatherDesc: "Lideras la Mafia. Apareces inocente en las investigaciones.",
    mafiaGoal: "Elimina a todos los ciudadanos para ganar",
    citizensGoal: "Encuentra y elimina a todos los miembros de la Mafia para ganar",
    playerEliminated: "ha sido eliminado del juego",
    nightPhaseDesc: "Ha caído la noche. Los roles especiales están ahora activos.",
    dayPhaseDesc: "Ha comenzado el día. Discutan y voten para eliminar sospechosos.",
    muteSound: "Silenciar Sonido",
    unmuteSound: "Activar Sonido",
    mafiaWin: "La Mafia ha tomado el control de la ciudad. ¡Gana la Mafia!",
    citizensWin: "Todos los miembros de la Mafia han sido eliminados. ¡Ganan los Ciudadanos!",
    cardInvoked: "Carta Invocada",
    nftReward: "Recompensa NFT",
    nftRewardDesc: "¡Has ganado un NFT especial por completar el juego!",
    nftClaimed: "NFT Reclamado",
    claimNft: "Reclamar NFT",
    donate: "Donar",
    donationThankYou: "¡Gracias!",
    donationProcessed: "Tu donación ha sido procesada. ¡Revisa tu colección de personajes para ver los nuevos desbloqueos!",
    yourCharacters: "Tus Personajes",
    noCharacters: "Aún no has desbloqueado personajes. ¡Dona TON o usa el sistema Gacha para adquirir personajes!",
    walletRequired: "Billetera Requerida",
    walletRequiredDesc: "Por favor conecta tu billetera TON para recibir tu recompensa NFT"
  },
  ja: {
    title: "マフィアミステリー",
    subtitle: "欺瞞と探偵作業のゲーム",
    waitingForPlayers: "プレイヤーの参加を待っています...",
    startGame: "ゲーム開始",
    endGame: "ゲーム終了",
    gameEnded: "ゲーム終了",
    gameInProgress: "ゲームが進行中です",
    yourRole: "あなたの役割",
    votePlayer: "排除に投票する",
    useAbility: "能力を使う",
    chat: "ゲームチャット",
    sendMessage: "送信",
    messagePlaceholder: "メッセージを入力...",
    nightPhase: "夜のフェーズ",
    dayPhase: "昼のフェーズ",
    nightDesc: "町は眠っています。マフィアと特殊な役割が活動中です。",
    dayDesc: "町は目覚めています。議論して容疑者を排除するために投票してください。",
    doctorDesc: "毎晩一人のプレイヤーを排除から保護できます",
    detectiveDesc: "毎晩一人のプレイヤーを調査してその役割を特定できます",
    vigilanteDesc: "夜間に一人のプレイヤーを排除できます",
    godfatherDesc: "マフィアをリードします。調査では無実に見えます。",
    mafiaGoal: "すべての市民を排除して勝利する",
    citizensGoal: "すべてのマフィアメンバーを見つけて排除して勝利する",
    playerEliminated: "はゲームから排除されました",
    nightPhaseDesc: "夜が来ました。特殊な役割が活動を開始します。",
    dayPhaseDesc: "昼になりました。議論して容疑者を排除するために投票してください。",
    muteSound: "サウンドをミュート",
    unmuteSound: "サウンドをオン",
    mafiaWin: "マフィアが町を掌握しました。マフィアの勝利！",
    citizensWin: "すべてのマフィアメンバーが排除されました。市民の勝利！",
    cardInvoked: "カード発動",
    nftReward: "NFT報酬",
    nftRewardDesc: "ゲーム完了で特別なNFTを獲得しました！",
    nftClaimed: "NFT獲得",
    claimNft: "NFTを受け取る",
    donate: "寄付する",
    donationThankYou: "ありがとうございます！",
    donationProcessed: "寄付が処理されました。新しく解除されたキャラクターをコレクションで確認してください！",
    yourCharacters: "あなたのキャラクター",
    noCharacters: "まだキャラクターが解除されていません。TONを寄付するかガチャシステムを使ってキャラクターを入手してください！",
    walletRequired: "ウォレットが必要です",
    walletRequiredDesc: "NFT報酬を受け取るにはTONウォレットを接続してください"
  },
  zh: {
    title: "黑手党谜案",
    subtitle: "一个关于欺骗和侦探工作的游戏",
    waitingForPlayers: "等待玩家加入...",
    startGame: "开始游戏",
    endGame: "结束游戏",
    gameEnded: "游戏结束",
    gameInProgress: "游戏正在进行中",
    yourRole: "你的角色",
    votePlayer: "投票淘汰",
    useAbility: "使用能力",
    chat: "游戏聊天",
    sendMessage: "发送",
    messagePlaceholder: "输入你的消息...",
    nightPhase: "夜晚阶段",
    dayPhase: "白天阶段",
    nightDesc: "小镇睡着了。黑手党和特殊角色现在活跃。",
    dayDesc: "小镇醒来了。讨论并投票淘汰嫌疑人。",
    doctorDesc: "你可以在每晚保护一名玩家免于被淘汰",
    detectiveDesc: "你可以在每晚调查一名玩家以确定他们的角色",
    vigilanteDesc: "你可以在夜间淘汰一名玩家",
    godfatherDesc: "你领导黑手党。在调查中你看起来是无辜的。",
    mafiaGoal: "淘汰所有平民以赢得游戏",
    citizensGoal: "找出并淘汰所有黑手党成员以赢得游戏",
    playerEliminated: "已被从游戏中淘汰",
    nightPhaseDesc: "夜晚降临。特殊角色现在活跃。",
    dayPhaseDesc: "白天开始了。讨论并投票淘汰嫌疑人。",
    muteSound: "静音",
    unmuteSound: "取消静音",
    mafiaWin: "黑手党已经控制了小镇。黑手党胜利！",
    citizensWin: "所有黑手党成员都被淘汰了。平民胜利！",
    cardInvoked: "卡牌已激活",
    nftReward: "NFT奖励",
    nftRewardDesc: "你因完成游戏获得了特殊NFT！",
    nftClaimed: "NFT已领取",
    claimNft: "领取NFT",
    donate: "捐赠",
    donationThankYou: "谢谢你！",
    donationProcessed: "您的捐款已处理。查看您的角色收藏以获取新解锁！",
    yourCharacters: "你的角色",
    noCharacters: "尚未解锁任何角色。捐赠TON或使用抽奖系统获取角色！",
    walletRequired: "需要钱包",
    walletRequiredDesc: "请连接您的TON钱包以接收NFT奖励"
  }
};

interface Player {
  id: number;
  name: string;
  role?: string;
  isAlive: boolean;
  avatarUrl: string;
}

const samplePlayers: Player[] = [
  { id: 1, name: "Alice", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Diana", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Eve", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Frank", isAlive: true, avatarUrl: "https://i.pravatar.cc/150?img=6" }
];

interface GameMessage {
  id: number;
  player: Player | null;
  content: string;
  timestamp: Date;
}

interface NFTCard {
  id: number;
  name: string;
  imageSrc: string;
  ability: string;
  faction: string;
}

const nftCards: NFTCard[] = [
  {
    id: 1,
    name: "Mafia Enforcer",
    imageSrc: "/lovable-uploads/5e94d4ae-e50a-4330-9c4d-3036b0aec7fa.png",
    ability: "Eliminate one player during the night.",
    faction: "Mafia"
  },
  {
    id: 2,
    name: "Guardian Angel",
    imageSrc: "/lovable-uploads/3b85fedc-243a-4a05-b130-6c8e729e88ec.png",
    ability: "Protect one player from being eliminated during the night.",
    faction: "Rescuers"
  },
  {
    id: 3,
    name: "Master Detective",
    imageSrc: "/lovable-uploads/2c606d71-9212-4ee3-be4e-61a137ec6e1b.png",
    ability: "Investigate one player each night to learn their role.",
    faction: "Rescuers"
  }
];

type GameState = 'waiting' | 'night' | 'day' | 'results' | 'ended';

const MafiaMystery: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language as keyof typeof translations] || translations.en;
  const { playSound, toggleMute, isMuted } = useSound();
  const { gameState: appGameState, addExperience, unlockFeature, addCurrency, getNextUnlockableCharacter, getDonationTiers, characterDatabase } = useGameState();
  
  const [isDay, setIsDay] = useState(true);
  const [selectedCard, setSelectedCard] = useState<NFTCard | null>(null);
  const [invokedCard, setInvokedCard] = useState<NFTCard | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [gameMessages, setGameMessages] = useState<GameMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);
  const [votingOpen, setVotingOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNftReward, setShowNftReward] = useState(false);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState(10);
  const nextUnlockable = getNextUnlockableCharacter();
  const donationTiers = getDonationTiers();
  
  useEffect(() => {
    addSystemMessage(t.waitingForPlayers);
    return () => {};
  }, []);
  
  useEffect(() => {
    if (gameState === 'night') {
      playSound('night');
    } else if (gameState === 'day') {
      playSound('day');
    }
  }, [gameState, playSound]);
  
  const nftRewardsUnlocked = appGameState.unlockedFeatures.nftRewards;
  
  const addSystemMessage = (content: string) => {
    const newSystemMessage: GameMessage = {
      id: Date.now(),
      player: null,
      content,
      timestamp: new Date()
    };
    setGameMessages(prev => [...prev, newSystemMessage]);
  };
  
  const addPlayerMessage = (playerId: number, content: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    const newPlayerMessage: GameMessage = {
      id: Date.now(),
      player,
      content,
      timestamp: new Date()
    };
    setGameMessages(prev => [...prev, newPlayerMessage]);
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    addPlayerMessage(1, newMessage);
    setNewMessage('');
    playSound('button');
  };

  const toggleDayNight = () => {
    setIsDay(!isDay);
    setGameState(prev => prev === 'night' ? 'day' : 'night');
    
    playSound(isDay ? 'night' : 'day');
    
    addSystemMessage(isDay ? t.nightPhaseDesc : t.dayPhaseDesc);
    
    addExperience(5);
  };
  
  const startGame = () => {
    playSound('success');
    setGameState('night');
    setIsDay(false);
    setRoundNumber(1);
    
    setPlayers(samplePlayers);
    
    const roles = ['Doctor', 'Detective', 'Vigilante', 'Citizen', 'Mafia', 'Godfather'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    setUserRole(randomRole);
    
    addSystemMessage(t.gameInProgress);
    addSystemMessage(`${t.yourRole} ${randomRole}`);
    
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toggleDayNight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    addExperience(10);
  };
  
  const endGame = () => {
    playSound('gong');
    setGameState('ended');
    
    const mafiaWins = Math.random() > 0.5;
    addSystemMessage(t.gameEnded);
    addSystemMessage(mafiaWins ? t.mafiaWin : t.citizensWin);
    
    if (nftRewardsUnlocked) {
      setShowNftReward(true);
    } else if (appGameState.level >= 10) {
      unlockFeature('nftRewards');
    }
    
    addExperience(50);
  };
  
  const votePlayer = () => {
    if (!selectedPlayer) return;
    
    playSound('button');
    
    setPlayers(prev => prev.map(player => 
      player.id === selectedPlayer.id ? { ...player, isAlive: false } : player
    ));
    
    addSystemMessage(`${selectedPlayer.name} ${t.playerEliminated}`);
    
    setSelectedPlayer(null);
    setVotingOpen(false);
    
    addExperience(5);
    
    const remainingPlayers = players.filter(p => p.id !== selectedPlayer.id && p.isAlive);
    const mafiaCount = remainingPlayers.filter(p => p.role === 'Mafia' || p.role === 'Godfather').length;
    const citizenCount = remainingPlayers.filter(p => p.role !== 'Mafia' && p.role !== 'Godfather').length;
    
    if (mafiaCount === 0 || mafiaCount >= citizenCount) {
      setTimeout(endGame, 3000);
    }
  };
  
  const toggleVoting = () => {
    setVotingOpen(!votingOpen);
    playSound('button');
  };

  const invokeCard = (card: NFTCard) => {
    setSelectedCard(card);
    setInvokedCard(card);
    playSound('card');
    
    let effect = "";
    if (card.faction === "Mafia") {
      effect = "Eliminated a random player";
      
      const alivePlayers = players.filter(p => p.isAlive && p.id !== 1);
      if (alivePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * alivePlayers.length);
        const targetPlayer = alivePlayers[randomIndex];
        
        setPlayers(prev => prev.map(player => 
          player.id === targetPlayer.id ? { ...player, isAlive: false } : player
        ));
        
        addSystemMessage(`${card.name} eliminated ${targetPlayer.name}`);
      }
    } else {
      effect = "Protected you from elimination";
      addSystemMessage(`${card.name} is protecting you from elimination for this round`);
    }
    
    toast({
      title: t.cardInvoked,
      description: `${card.name}: ${effect}`,
      duration: 3000
    });
    
    addExperience(15);
  };
  
  const handleToggleMute = () => {
    const muted = toggleMute();
    setSoundEnabled(!muted);
  };
  
  const claimNftReward = () => {
    playSound('success');
    
    if (!appGameState.walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your TON wallet to receive your NFT reward",
        variant: "destructive"
      });
      setShowNftReward(false);
      return;
    }
    
    toast({
      title: t.nftClaimed,
      description: "Your NFT has been sent to your connected wallet address. Check your collection!",
      duration: 5000
    });
    
    if (appGameState.characters.findIndex(c => c.id === 4) === -1) {
      setTimeout(() => {
        unlockFeature('nftRewards');
        addSystemMessage("You've received a special character as a reward!");
        playSound('unlock');
      }, 2000);
    }
    
    setShowNftReward(false);
  };

  const handleDonation = () => {
    if (donationAmount > 0) {
      addCurrency('ton', donationAmount);
      setShowDonationDialog(false);
      playSound('success');
      toast({
        title: "Thank You!",
        description: `Your donation of ${donationAmount} TON has been processed. Check your character collection for new unlocks!`,
      });
      addExperience(donationAmount);
    }
  };

  const calculateDonationProgress = () => {
    if (!nextUnlockable.character) return 100;
    
    const currentTon = appGameState.currency.ton;
    const targetAmount = donationTiers.find(tier => tier.characterId === nextUnlockable.character?.id)?.amount || 0;
    
    if (targetAmount === 0) return 0;
    return Math.min(100, (currentTon / targetAmount) * 100);
  };

  const donationProgress = calculateDonationProgress();

  const handleShowDonationDialog = () => {
    setShowDonationDialog(true);
    playSound('button');
  };

  return (
    <section id="mafia-mystery" className="py-20 bg-gradient-to-b from-background/90 to-background japanese-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">{t.title}</h2>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="glass-card rounded-lg p-4 mb-8">
            <div className="flex flex-wrap justify-between items-center">
              <button
                onClick={toggleDayNight}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-500 ${
                  isDay 
                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20" 
                    : "bg-blue-900/20 text-blue-300 hover:bg-blue-900/30"
                }`}
                disabled={gameState === 'waiting' || gameState === 'ended'}
              >
                {isDay ? (
                  <>
                    <Sun size={18} className="mr-2" />
                    <span>Day Phase</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="mr-2" />
                    <span>Night Phase</span>
                  </>
                )}
              </button>
              
              {gameState !== 'waiting' && gameState !== 'ended' && (
                <div className="text-center px-4">
                  <div className="text-sm text-muted-foreground">Round {roundNumber}</div>
                  <div className="text-xl font-medium">{countdown}s</div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-full bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  aria-label={soundEnabled ? t.muteSound : t.unmuteSound}
                >
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                
                <Button 
                  onClick={handleShowDonationDialog} 
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Gift size={16} className="mr-2" /> Donate
                </Button>
                
                {gameState === 'waiting' || gameState === 'ended' ? (
                  <Button onClick={startGame} variant="default" className="bg-green-600 hover:bg-green-700">
                    {t.startGame}
                  </Button>
                ) : (
                  <Button onClick={endGame} variant="default" className="bg-red-600 hover:bg-red-700">
                    {t.endGame}
                  </Button>
                )}
              </div>
            </div>
            
            {nextUnlockable.character && (
              <div className="mt-4 px-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Next character: {nextUnlockable.character.name}</span>
                  <span>{appGameState.currency.ton} / {donationTiers.find(tier => tier.characterId === nextUnlockable.character?.id)?.amount || 0} TON</span>
                </div>
                <Progress value={donationProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="glass-card rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Players</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {players.map(player => (
                <div 
                  key={player.id}
                  onClick={() => gameState !== 'waiting' && gameState !== 'ended' && setSelectedPlayer(player)}
                  className={`
                    relative p-2 rounded-lg text-center cursor-pointer
                    transition-all duration-300 transform hover:scale-105
                    ${!player.isAlive ? 'opacity-50 grayscale' : ''}
                    ${selectedPlayer?.id === player.id ? 'ring-2 ring-primary' : ''}
                    ${player.id === 1 ? 'bg-primary/20' : 'bg-secondary/20'}
                  `}
                >
                  <img 
                    src={player.avatarUrl} 
                    alt={player.name}
                    className="w-16 h-16 mx-auto rounded-full object-cover mb-2"
                  />
                  <div className="text-sm font-medium">{player.name}</div>
                  {player.id === 1 && <div className="text-xs text-primary">(You)</div>}
                  {!player.isAlive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                      <UserX className="text-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {gameState !== 'waiting' && gameState !== 'ended' && (
              <div className="flex justify-center mt-6 space-x-4">
                <Button 
                  onClick={toggleVoting}
                  variant="default"
                  disabled={!selectedPlayer || gameState !== 'day'}
                  className={gameState !== 'day' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {t.votePlayer}
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={!selectedPlayer || gameState !== 'night'}
                  className={gameState !== 'night' ? 'opacity-50 cursor-not-allowed' : ''}
                  onClick={() => selectedPlayer && gameState === 'night' && votePlayer()}
                >
                  {t.useAbility}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium flex items-center">
                  <MessageCircle size={18} className="mr-2" />
                  {t.chat}
                </h3>
              </div>
              
              <div className="h-60 overflow-y-auto p-4">
                {gameMessages.map(message => (
                  <div key={message.id} className="mb-3">
                    {message.player ? (
                      <div className="flex items-start">
                        <img 
                          src={message.player.avatarUrl} 
                          alt={message.player.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-medium text-sm">{message.player.name}</div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded bg-secondary/10 text-sm italic">
                        {message.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-border">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    className="flex-1 bg-background rounded-l-md px-3 py-2 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={gameState === 'waiting' || gameState === 'ended'}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={gameState === 'waiting' || gameState === 'ended'}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md"
                  >
                    {t.sendMessage}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              {gameState === 'waiting' && (
                <div className="text-center p-8">
                  <p className="text-xl">{t.waitingForPlayers}</p>
                  <p className="text-muted-foreground mt-2">{t.startGame}</p>
                </div>
              )}
              
              {gameState === 'ended' && (
                <div className="text-center p-8">
                  <h3 className="text-2xl mb-4">{t.gameEnded}</h3>
                  
                  {nftRewardsUnlocked && (
                    <div className="mb-6 p-4 border border-primary/30 rounded-lg bg-primary/10">
                      <h4 className="text-lg font-semibold mb-2">{t.nftReward}</h4>
                      <p className="text-sm mb-3">{t.nftRewardDesc}</p>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setShowNftReward(true)}
                      >
                        {t.claimNft}
                      </Button>
                    </div>
                  )}
                  
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                    {t.startGame}
                  </Button>
                </div>
              )}
              
              {(gameState === 'day' || gameState === 'night') && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t.yourRole}</h3>
                  <div className="p-4 rounded-lg bg-secondary/10 mb-6">
                    <div className="flex items-center">
                      {userRole === 'Mafia' || userRole === 'Godfather' ? (
                        <UserX className="text-red-400 mr-2" size={20} />
                      ) : userRole === 'Doctor' ? (
                        <Shield className="text-blue-400 mr-2" size={20} />
                      ) : userRole === 'Detective' ? (
                        <Search className="text-purple-400 mr-2" size={20} />
                      ) : (
                        <User className="text-green-400 mr-2" size={20} />
                      )}
                      <span className={`font-medium ${
                        userRole === 'Mafia' || userRole === 'Godfather' 
                          ? 'text-red-400' 
                          : userRole === 'Doctor' 
                            ? 'text-blue-400'
                            : userRole === 'Detective'
                              ? 'text-purple-400'
                              : 'text-green-400'
                      }`}>
                        {userRole}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{
                      userRole === 'Doctor' ? t.doctorDesc :
                      userRole === 'Detective' ? t.detectiveDesc :
                      userRole === 'Vigilante' ? t.vigilanteDesc :
                      userRole === 'Godfather' ? t.godfatherDesc :
                      userRole === 'Mafia' ? t.mafiaGoal :
                      t.citizensGoal
                    }</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      {gameState === 'night' ? (
                        <div className="flex items-center">
                          <Moon className="text-blue-400 mr-2" size={18} />
                          {t.nightPhase}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sun className="text-yellow-400 mr-2" size={18} />
                          {t.dayPhase}
                        </div>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {gameState === 'night' ? t.nightDesc : t.dayDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Player Level: {appGameState.level} • XP: {appGameState.experience}/
            {appGameState.level * 100}</p>
            <div className="h-1 w-full mt-1 bg-secondary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${(appGameState.experience / (appGameState.level * 100)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="glass-card rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">{t.yourCharacters}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {appGameState.characters.map((character) => (
                <div 
                  key={character.id}
                  className="bg-secondary/10 p-3 rounded-lg text-center hover:bg-secondary/20 transition-colors"
                >
                  <img 
                    src={character.imageUrl} 
                    alt={character.name}
                    className="w-16 h-16 mx-auto rounded-full object-cover mb-2"
                  />
                  <div className="text-sm font-medium">{character.name}</div>
                  <div className={`text-xs ${
                    character.rarity === 'legendary' ? 'text-yellow-400' : 
                    character.rarity === 'epic' ? 'text-purple-400' : 
                    character.rarity === 'rare' ? 'text-blue-400' : 
                    'text-green-400'
                  }`}>
                    {character.rarity}
                  </div>
                </div>
              ))}
              
              {appGameState.characters.length === 0 && (
                <div className="col-span-full text-center p-4 text-muted-foreground">
                  <p>{t.noCharacters}</p>
                </div>
              )}
            </div>
          </div>
          
          <Dialog open={showNftReward} onOpenChange={setShowNftReward}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-purple-400">
                  {t.nftReward}
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex flex-col items-center">
                  <img 
                    src="/lovable-uploads/e01a4cf8-fade-4973-a943-82cab1bad514.png" 
                    alt="NFT Reward" 
                    className="w-32 h-32 rounded-lg border-4 border-purple-600/50 mb-4"
                  />
                  
                  <h3 className="text-xl font-bold mb-2">Winner's Trophy</h3>
                  <p className="text-sm text-center mb-4">
                    This NFT commemorates your victory in Mafia Mystery. 
                    Display it proudly in your collection!
                  </p>
                  
                  <Button 
                    onClick={claimNftReward} 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {t.claimNft}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Support Game Development
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Your donations help us develop new features and characters. 
                  Donate TON to unlock special characters!
                </p>
                
                {nextUnlockable.character && (
                  <div className="mb-4 p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/10">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-secondary/50 mr-3 overflow-hidden">
                        {nextUnlockable.character.imageUrl && (
                          <img 
                            src={nextUnlockable.character.imageUrl} 
                            alt={nextUnlockable.character.name}
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-500">
                          {nextUnlockable.character.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {nextUnlockable.donationNeeded} TON needed
                        </p>
                      </div>
                    </div>
                    <Progress value={donationProgress} className="h-1.5 mb-2" />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Donation Amount (TON)</label>
                    <div className="flex">
                      <input 
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="flex-1 rounded-l-md px-3 py-2 text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={handleDonation}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md"
                      >
                        Donate
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[10, 25, 50].map(amount => (
                      <button 
                        key={amount}
                        onClick={() => setDonationAmount(amount)}
                        className={`py-1 px-2 text-sm border rounded ${
                          donationAmount === amount 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border'
                        }`}
                      >
                        {amount} TON
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default MafiaMystery;
