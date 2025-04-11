
import React, { useContext } from 'react';
import { LanguageContext } from '@/pages/Index';
import { Play, Book, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const translations = {
  en: {
    title: "Game Guide",
    subtitle: "Learn how to play in a few simple steps",
    step1: "Choose your faction: Mafia or Dragon Rescuers",
    step2: "Build your deck with powerful cards",
    step3: "Challenge other players in strategic battles",
    step4: "Win matches to earn rewards and new cards",
    startPlaying: "Start Playing Now",
    advancedGuide: "View Advanced Guide",
    supportText: "30% of all proceeds support greyhound shelters",
    openSeaAuction: "View NFT Collection on OpenSea"
  },
  es: {
    title: "Guía del Juego",
    subtitle: "Aprende a jugar en unos simples pasos",
    step1: "Elige tu facción: Mafia o Rescatadores de Dragones",
    step2: "Construye tu mazo con cartas poderosas",
    step3: "Desafía a otros jugadores en batallas estratégicas",
    step4: "Gana partidas para obtener recompensas y nuevas cartas",
    startPlaying: "Comenzar a Jugar",
    advancedGuide: "Ver Guía Avanzada",
    supportText: "El 30% de todos los ingresos apoyan refugios de galgos",
    openSeaAuction: "Ver Colección NFT en OpenSea"
  },
  ja: {
    title: "ゲームガイド",
    subtitle: "簡単なステップでプレイ方法を学ぶ",
    step1: "派閥を選択：マフィアまたはドラゴンレスキュー",
    step2: "強力なカードでデッキを構築",
    step3: "戦略的なバトルで他のプレイヤーに挑戦",
    step4: "試合に勝って報酬と新しいカードを獲得",
    startPlaying: "今すぐプレイ",
    advancedGuide: "高度なガイドを見る",
    supportText: "収益の30％はグレイハウンドシェルターをサポートします",
    openSeaAuction: "OpenSeaでNFTコレクションを見る"
  },
  zh: {
    title: "游戏指南",
    subtitle: "通过几个简单的步骤学习如何玩",
    step1: "选择你的派系：黑手党或龙救援队",
    step2: "用强大的卡牌构建你的牌组",
    step3: "在策略战斗中挑战其他玩家",
    step4: "赢得比赛以获得奖励和新卡牌",
    startPlaying: "立即开始游戏",
    advancedGuide: "查看高级指南",
    supportText: "30%的所有收益支持灰狗收容所",
    openSeaAuction: "在OpenSea上查看NFT收藏"
  }
};

const GameGuide = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    navigate('/tutorial');
    toast({
      title: "Tutorial Loading",
      description: "Welcome to Doge Legends! Let's get started with the game.",
    });
  };

  const handleAdvancedGuide = () => {
    navigate('/tutorial');
    toast({
      title: "Advanced Guide Loading",
      description: "Loading the advanced game guide for experienced players.",
    });
  };

  const openOpenSeaCollection = () => {
    window.open('https://opensea.io/collection/doge-legends', '_blank');
  };

  return (
    <section id="game-guide" className="py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t.title}</h2>
            <p className="text-muted-foreground text-lg">{t.subtitle}</p>
          </div>
          
          <div className="glass-card rounded-xl p-8 mb-10 relative overflow-hidden">
            {/* Background dragon illustration */}
            <div className="absolute -right-20 -bottom-20 opacity-5">
              <svg viewBox="0 0 200 200" className="w-64 h-64">
                <path
                  d="M40,100 C40,80 60,60 80,70 C100,80 110,100 90,110 C70,120 60,110 70,130 C80,150 100,150 120,140 C140,130 150,110 130,90 C110,70 80,80 60,60 C40,40 60,20 80,30 C100,40 100,60 120,70 C140,80 160,70 140,50 C120,30 90,40 80,20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{t.step1}</h3>
                    <p className="text-muted-foreground">
                      {language === 'en' && "Choose between the organized crime syndicates or the dragon rescuers."}
                      {language === 'es' && "Elige entre los sindicatos del crimen organizado o los rescatadores de dragones."}
                      {language === 'ja' && "組織犯罪シンジケートとドラゴンレスキュー隊のどちらかを選択してください。"}
                      {language === 'zh' && "在有组织犯罪集团或龙救援队之间做出选择。"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{t.step2}</h3>
                    <p className="text-muted-foreground">
                      {language === 'en' && "Select powerful cards to create a balanced and effective deck."}
                      {language === 'es' && "Selecciona cartas poderosas para crear un mazo equilibrado y efectivo."}
                      {language === 'ja' && "強力なカードを選択して、バランスの取れた効果的なデッキを作成します。"}
                      {language === 'zh' && "选择强大的卡牌来创建一个平衡有效的牌组。"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{t.step3}</h3>
                    <p className="text-muted-foreground">
                      {language === 'en' && "Engage in tactical card battles with other players around the world."}
                      {language === 'es' && "Participa en batallas tácticas de cartas con otros jugadores de todo el mundo."}
                      {language === 'ja' && "世界中の他のプレイヤーと戦術的なカードバトルを行います。"}
                      {language === 'zh' && "与世界各地的其他玩家进行战术卡牌对战。"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">4</div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{t.step4}</h3>
                    <p className="text-muted-foreground">
                      {language === 'en' && "Winning matches rewards you with new cards and in-game currency."}
                      {language === 'es' && "Ganar partidas te recompensa con nuevas cartas y moneda del juego."}
                      {language === 'ja' && "試合に勝つと、新しいカードやゲーム内通貨が報酬として得られます。"}
                      {language === 'zh' && "赢得比赛可获得新卡牌和游戏内货币作为奖励。"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                className="action-button group animate-pulse-slow"
                onClick={handleStartPlaying}
              >
                <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                <span>{t.startPlaying}</span>
              </button>
              
              <button 
                onClick={handleAdvancedGuide}
                className="text-primary hover:text-primary/80 transition-colors flex items-center"
              >
                <Book className="w-4 h-4 mr-2" />
                <span>{t.advancedGuide}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              
              <button 
                onClick={openOpenSeaCollection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                <span>{t.openSeaAuction}</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600/20 via-transparent to-pink-600/20 py-3 px-6 rounded-full">
              <p className="text-sm text-center">
                <span className="text-purple-300">❤</span>
                {t.supportText}
                <span className="text-purple-300">❤</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameGuide;
