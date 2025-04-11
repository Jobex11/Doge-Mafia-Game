import React, { useRef, useEffect, useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Zap, Shield, PenTool, RotateCw, Award, Star, ArrowRight } from 'lucide-react';
import { LanguageContext, Language } from '@/pages/Index';
import { useSound } from '@/hooks/useSound';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface GameplayFeature {
  icon: React.ReactNode;
  title: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  description: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
}

interface GameLevel {
  level: number;
  name: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  difficulty: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  description: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  rewards: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
}

interface UserGuideStep {
  title: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  description: {
    en: string;
    es: string;
    ja: string;
    zh: string;
  };
  icon: React.ReactNode;
}

const translations = {
  gameTitle: {
    en: "Game Mechanics",
    es: "Mecánica del Juego",
    ja: "ゲームの仕組み",
    zh: "游戏机制"
  },
  gameSubtitle: {
    en: "Strategic Card Battles",
    es: "Batallas Estratégicas de Cartas",
    ja: "戦略的カードバトル",
    zh: "战略卡牌对战"
  },
  gameDescription: {
    en: "Master the art of turn-based combat with unique abilities, strategic alliances, and powerful card combinations.",
    es: "Domina el arte del combate por turnos con habilidades únicas, alianzas estratégicas y poderosas combinaciones de cartas.",
    ja: "ユニークな能力、戦略的な同盟、強力なカードの組み合わせで、ターン制バトルの技術を習得しましょう。",
    zh: "掌握回合制战斗的艺术，运用独特能力、战略联盟和强大的卡牌组合。"
  },
  gameFeatures: {
    en: "Game Features",
    es: "Características del Juego",
    ja: "ゲーム機能",
    zh: "游戏特色"
  },
  gameLevels: {
    en: "Game Levels",
    es: "Niveles del Juego",
    ja: "ゲームレベル",
    zh: "游戏等级"
  },
  userGuide: {
    en: "User Guide",
    es: "Guía del Usuario",
    ja: "ユーザーガイド",
    zh: "用户指南"
  },
  uniqueScenarios: {
    en: "Battle in Unique Scenarios",
    es: "Batalla en Escenarios Únicos",
    ja: "ユニークなシナリオでバトル",
    zh: "在独特场景中战斗"
  },
  scenariosDescription: {
    en: "From the dark streets of Tokyo to hidden dragon sanctuaries, each battle takes place in a unique scenario with its own rules and bonuses.",
    es: "Desde las oscuras calles de Tokio hasta santuarios de dragones ocultos, cada batalla tiene lugar en un escenario único con sus propias reglas y bonificaciones.",
    ja: "東京の暗い通りから隠れた龍の聖域まで、各バトルは独自のルールとボーナスを持つ独特なシナリオで行われます。",
    zh: "从东京的黑暗街道到隐藏的龙sanctuary，每场战斗都在独特的场景中进行，拥有自己的规则和奖励。"
  },
  streetsTokyo: {
    en: "Streets of Tokyo",
    es: "Calles de Tokio",
    ja: "東京の通り",
    zh: "东京街头"
  },
  streetsTokyoDesc: {
    en: "Battle in the dark streets where mafiosos receive an attack boost (+10).",
    es: "Batalla en las calles oscuras donde los mafiosos reciben un impulso de ataque (+10).",
    ja: "マフィアが攻撃ブースト(+10)を受ける暗い通りでバトルします。",
    zh: "在黑帮获得攻击加成(+10)的黑暗街道上战斗。"
  },
  osakaShelter: {
    en: "Osaka Shelter",
    es: "Refugio de Osaka",
    ja: "大阪のシェルター",
    zh: "大阪庇护所"
  },
  osakaShelterDesc: {
    en: "Protect the greyhound shelter where dragons receive a defense boost (+20).",
    es: "Protege el refugio de galgos donde los dragones reciben un impulso de defensa (+20).",
    ja: "ドラゴンが防御ブースト(+20)を受けるグレイハウンドシェルターを守ります。",
    zh: "保护灰狗收容所，龙获得防御加成(+20)。"
  },
  battleArena: {
    en: "Battle Arena",
    es: "Arena de Batalla",
    ja: "バトルアリーナ",
    zh: "战斗竞技场"
  },
  mafiososVsRescuers: {
    en: "Mafiosos vs Rescuers",
    es: "Mafiosos vs Rescatadores",
    ja: "マフィアVSレスキュー隊",
    zh: "黑帮VS救援者"
  },
  vs: {
    en: "VS",
    es: "VS",
    ja: "VS",
    zh: "对决"
  },
  startPlaying: {
    en: "Start Playing Now",
    es: "Comienza a Jugar Ahora",
    ja: "今すぐプレイを始める",
    zh: "立即开始游戏"
  }
};

const GameMechanics = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'levels' | 'guide'>('features');
  const { language } = useContext(LanguageContext);
  const { playSound } = useSound();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features: GameplayFeature[] = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: {
        en: 'Turn-Based Combat',
        es: 'Combate por Turnos',
        ja: 'ターン制バトル',
        zh: '回合制战斗'
      },
      description: {
        en: 'Strategic battles where players take turns attacking, defending, or using special abilities.',
        es: 'Batallas estratégicas donde los jugadores se turnan para atacar, defender o usar habilidades especiales.',
        ja: 'プレイヤーが攻撃、防御、特殊能力の使用を交代で行う戦略的なバトル。',
        zh: '战略性战斗，玩家轮流攻击、防御或使用特殊能力。'
      }
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: {
        en: 'Faction-Based Gameplay',
        es: 'Jugabilidad Basada en Facciones',
        ja: '派閥ベースのゲームプレイ',
        zh: '阵营基础游戏玩法'
      },
      description: {
        en: 'Choose between Mafiosos or Rescuers, each with unique abilities and gameplay styles.',
        es: 'Elige entre Mafiosos o Rescatadores, cada uno con habilidades y estilos de juego únicos.',
        ja: 'マフィアかレスキュー隊を選択し、それぞれ独自の能力とゲームプレイスタイルを持っています。',
        zh: '在黑帮或救援者之间选择，每个阵营都有独特的能力和游戏风格。'
      }
    },
    {
      icon: <PenTool className="h-6 w-6 text-primary" />,
      title: {
        en: 'NFT Collectible Cards',
        es: 'Cartas Coleccionables NFT',
        ja: 'NFTコレクションカード',
        zh: 'NFT收藏卡牌'
      },
      description: {
        en: 'Each card is a unique NFT that can be traded, sold, or upgraded on OpenSea.',
        es: 'Cada carta es un NFT único que se puede intercambiar, vender o mejorar en OpenSea.',
        ja: '各カードはOpenSeaで取引、販売、アップグレード可能なユニークなNFTです。',
        zh: '每张卡都是一个独特的NFT，可以在OpenSea上交易、出售或升级。'
      }
    },
    {
      icon: <RotateCw className="h-6 w-6 text-primary" />,
      title: {
        en: 'Day/Night Cycle',
        es: 'Ciclo de Día/Noche',
        ja: '昼夜サイクル',
        zh: '日夜循环'
      },
      description: {
        en: 'Game mechanics change between day and night, offering different advantages to each faction.',
        es: 'La mecánica del juego cambia entre el día y la noche, ofreciendo diferentes ventajas a cada facción.',
        ja: 'ゲームメカニクスは昼と夜で変化し、各派閥に異なる利点を提供します。',
        zh: '游戏机制在白天和黑夜之间变化，为每个阵营提供不同的优势。'
      }
    }
  ];

  const levels: GameLevel[] = [
    {
      level: 1,
      name: {
        en: 'Streets of Tokyo',
        es: 'Calles de Tokio',
        ja: '東京の通り',
        zh: '东京街头'
      },
      difficulty: {
        en: 'Easy',
        es: 'Fácil',
        ja: '簡単',
        zh: '简单'
      },
      description: {
        en: 'Battle in the dark streets of Tokyo, where mafiosos try to dominate the black market.',
        es: 'Batalla en las oscuras calles de Tokio, donde los mafiosos intentan dominar el mercado negro.',
        ja: '東京の暗い通りでバトル。マフィアが闇市場を支配しようとしています。',
        zh: '在东京黑暗的街道上战斗，黑帮试图主宰黑市。'
      },
      rewards: {
        en: 'Mafiosos receive an attack boost (+10)',
        es: 'Los mafiosos reciben un impulso de ataque (+10)',
        ja: 'マフィアは攻撃ブースト(+10)を受けます',
        zh: '黑帮获得攻击加成(+10)'
      }
    },
    {
      level: 2,
      name: {
        en: 'Osaka Shelter',
        es: 'Refugio de Osaka',
        ja: '大阪のシェルター',
        zh: '大阪庇护所'
      },
      difficulty: {
        en: 'Medium',
        es: 'Medio',
        ja: '中級',
        zh: '中等'
      },
      description: {
        en: 'The rescuers try to protect the last greyhound shelter in Osaka.',
        es: 'Los rescatadores intentan proteger el último refugio de galgos en Osaka.',
        ja: 'レスキュー隊は大阪最後のグレイハウンドシェルターを守ろうとしています。',
        zh: '救援者试图保护大阪最后的灰狗收容所。'
      },
      rewards: {
        en: 'Dragons receive a defense boost (+20)',
        es: 'Los dragones reciben un impulso de defensa (+20)',
        ja: 'ドラゴンは防御ブースト(+20)を受けます',
        zh: '龙获得防御加成(+20)'
      }
    },
    {
      level: 3,
      name: {
        en: 'Mafia Tower',
        es: 'Torre de la Mafia',
        ja: 'マフィアタワー',
        zh: '黑帮大楼'
      },
      difficulty: {
        en: 'Hard',
        es: 'Difícil',
        ja: '難しい',
        zh: '困难'
      },
      description: {
        en: 'Face off against a Supreme Capo in the mafia headquarters, battling for control of resources.',
        es: 'Enfréntate a un Capo Supremo en la sede de la mafia, luchando por el control de los recursos.',
        ja: 'マフィア本部で最高カポと対決し、資源の支配権を巡って戦います。',
        zh: '在黑帮总部与最高头目对抗，争夺资源控制权。'
      },
      rewards: {
        en: 'Mafia gains extra attack cards',
        es: 'La mafia gana cartas de ataque adicionales',
        ja: 'マフィアは追加の攻撃カードを獲得します',
        zh: '黑帮获得额外攻击卡'
      }
    },
    {
      level: 4,
      name: {
        en: 'Dragon Sanctuary',
        es: 'Santuario del Dragón',
        ja: '龍の聖域',
        zh: '龙之圣殿'
      },
      difficulty: {
        en: 'Very Hard',
        es: 'Muy Difícil',
        ja: '非常に難しい',
        zh: '非常困难'
      },
      description: {
        en: 'The rescuers must defend a hidden dragon sanctuary.',
        es: 'Los rescatadores deben defender un santuario de dragones oculto.',
        ja: 'レスキュー隊は隠された龍の聖域を守らなければなりません。',
        zh: '救援者必须保卫隐藏的龙圣殿。'
      },
      rewards: {
        en: 'The sanctuary provides extra resistance to dragon cards',
        es: 'El santuario proporciona resistencia adicional a las cartas de dragón',
        ja: '聖域はドラゴンカードに追加の抵抗力を提供します',
        zh: '圣殿为龙卡提供额外抵抗力'
      }
    }
  ];

  const userGuideSteps: UserGuideStep[] = [
    {
      title: {
        en: "Choose Your Faction",
        es: "Elige Tu Facción",
        ja: "派閥を選ぶ",
        zh: "选择你的阵营"
      },
      description: {
        en: "Select either the Mafiosos or the Dragon Rescuers. Each faction has unique cards and abilities.",
        es: "Selecciona los Mafiosos o los Rescatadores de Dragones. Cada facción tiene cartas y habilidades únicas.",
        ja: "マフィアかドラゴンレスキュー隊を選びましょう。各派閥は独自のカードと能力を持っています。",
        zh: "选择黑帮或龙之救援者。每个阵营都有独特的卡牌和能力。"
      },
      icon: <Shield className="h-10 w-10 text-primary" />
    },
    {
      title: {
        en: "Build Your Deck",
        es: "Construye Tu Mazo",
        ja: "デッキを構築する",
        zh: "构建你的卡组"
      },
      description: {
        en: "Collect cards and build a 30-card deck with attack, defense, and special ability cards.",
        es: "Colecciona cartas y construye un mazo de 30 cartas con cartas de ataque, defensa y habilidades especiales.",
        ja: "カードを集め、攻撃、防御、特殊能力カードで30枚のデッキを構築します。",
        zh: "收集卡牌并构建一副包含攻击、防御和特殊能力卡的30张卡组。"
      },
      icon: <PenTool className="h-10 w-10 text-primary" />
    },
    {
      title: {
        en: "Join Battles",
        es: "Únete a Batallas",
        ja: "バトルに参加する",
        zh: "参加战斗"
      },
      description: {
        en: "Enter PvP matches or campaign missions. Win to earn rewards and new cards.",
        es: "Participa en partidas PvP o misiones de campaña. Gana para obtener recompensas y nuevas cartas.",
        ja: "PvP対戦やキャンペーンミッションに参加しましょう。勝利して報酬や新しいカードを獲得します。",
        zh: "参加PVP对战或战役任务。获胜赢取奖励和新卡牌。"
      },
      icon: <Zap className="h-10 w-10 text-primary" />
    },
    {
      title: {
        en: "Support Greyhound Rescue",
        es: "Apoya el Rescate de Galgos",
        ja: "グレイハウンドレスキューを支援する",
        zh: "支持灰狗救援"
      },
      description: {
        en: "30% of all proceeds go to greyhound shelters. Buy special NFTs to receive additional game benefits and real-world rewards.",
        es: "El 30% de todas las ganancias van a refugios de galgos. Compra NFTs especiales para recibir beneficios adicionales en el juego y recompensas en el mundo real.",
        ja: "収益の30%はグレイハウンドシェルターに寄付されます。特別なNFTを購入して、ゲーム内の追加特典や現実世界の報酬を受け取りましょう。",
        zh: "所有收益的30%捐给灰狗收容所。购买特殊NFT可获得额外游戏福利和现实世界奖励。"
      },
      icon: <Award className="h-10 w-10 text-primary" />
    }
  ];

  const handleTabChange = (tab: 'features' | 'levels' | 'guide') => {
    playSound('button');
    setActiveTab(tab);
  };

  const startPlaying = () => {
    playSound('success');
    navigate('/tutorial');
  };

  const openOpenSea = () => {
    window.open('https://opensea.io/collection/doge-mafia-legends', '_blank');
  };

  return (
    <section id="gameplay" ref={sectionRef} className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">{translations.gameTitle[language]}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{translations.gameSubtitle[language]}</h2>
          <p className="text-muted-foreground text-lg">
            {translations.gameDescription[language]}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'features'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
              } ${activeTab === 'features' ? 'rounded-l-lg' : ''}`}
              onClick={() => handleTabChange('features')}
            >
              {translations.gameFeatures[language]}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'levels'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
              }`}
              onClick={() => handleTabChange('levels')}
            >
              {translations.gameLevels[language]}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'guide'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
              } ${activeTab === 'guide' ? 'rounded-r-lg' : ''}`}
              onClick={() => handleTabChange('guide')}
            >
              {translations.userGuide[language]}
            </button>
          </div>
        </div>

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card rounded-xl p-6 card-hover opacity-0",
                  isVisible && "animate-card-appear"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 p-3 inline-block rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{feature.title[language]}</h3>
                <p className="text-muted-foreground">{feature.description[language]}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'levels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {levels.map((level, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card rounded-xl p-6 card-hover opacity-0",
                  isVisible && "animate-card-appear"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => playSound('button')}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 inline-block rounded-lg bg-primary/10 mr-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold">Level {level.level}: {level.name[language]}</h3>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: level.level }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ))}
                      <span className="ml-2 text-sm bg-secondary/50 px-2 py-0.5 rounded-full">
                        {level.difficulty[language]}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{level.description[language]}</p>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    <span className="text-primary">Rewards:</span> {level.rewards[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-8">
            {userGuideSteps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card rounded-xl p-6 opacity-0",
                  isVisible && "animate-card-appear"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-semibold mb-3">
                      <span className="text-primary">Step {index + 1}:</span> {step.title[language]}
                    </h3>
                    <p className="text-muted-foreground text-lg">{step.description[language]}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-12 text-center">
              <Button 
                className="btn-primary flex items-center mx-auto group"
                onClick={startPlaying}
              >
                <span>{translations.startPlaying[language]}</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-20 glass-card rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-6">
                {translations.uniqueScenarios[language]}
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                {translations.scenariosDescription[language]}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-mafia/10 rounded-full p-2 mt-1">
                    <span className="text-mafia text-lg">🏙️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{translations.streetsTokyo[language]}</h4>
                    <p className="text-muted-foreground">{translations.streetsTokyoDesc[language]}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-rescuer/10 rounded-full p-2 mt-1">
                    <span className="text-rescuer text-lg">🏯</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{translations.osakaShelter[language]}</h4>
                    <p className="text-muted-foreground">{translations.osakaShelterDesc[language]}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-background to-secondary min-h-[300px] flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-video glass-card mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl">
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-mafia-gradient opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-display font-bold text-white mb-2">{translations.battleArena[language]}</h3>
                      <p className="text-sm text-white/80">{translations.mafiososVsRescuers[language]}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute bottom-8 right-8 w-32 h-32 glass-card rounded-xl transform rotate-6 hover:rotate-0 transition-transform duration-500 shadow-lg overflow-hidden cursor-pointer"
                onClick={openOpenSea}
              >
                <div className="absolute inset-0 bg-rescuer-gradient opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-display font-bold text-white">{translations.vs[language]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameMechanics;
