
import React, { useEffect, useRef, useState, useContext } from 'react';
import { ChevronDown, Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageContext } from '@/pages/Index';
import LanguageSwitcher from './LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

// Translations
const translations = {
  en: {
    tagline: "Asian-Themed NFT Card Game on Telegram",
    title1: "Doge Mafia",
    title2: "Capos Legends",
    title3: "Rescue",
    description: "A strategic card battle with Asian aesthetics where Mafiosos and Dragons clash in an NFT-powered combat on Telegram. Original NFTs will be auctioned on OpenSea.",
    joinMafia: "Join the Mafia",
    becomeRescuer: "Join the Dragons",
    discoverMore: "Discover More",
    visitWebsite: "Visit dogslution.org",
    donate: "Make a Donation",
    openSeaAuction: "View NFT Collection"
  },
  es: {
    tagline: "Juego de Cartas NFT con Temática Asiática en Telegram",
    title1: "Doge Mafia",
    title2: "Capos Legends",
    title3: "Rescate",
    description: "Una batalla de cartas estratégica con estética asiática donde Mafiosos y Dragones se enfrentan en un combate con NFT en Telegram. Los NFTs originales se subastarán en OpenSea.",
    joinMafia: "Únete a la Mafia",
    becomeRescuer: "Únete a los Dragones",
    discoverMore: "Descubre Más",
    visitWebsite: "Visita dogslution.org",
    donate: "Hacer una Donación",
    openSeaAuction: "Ver Colección NFT"
  },
  ja: {
    tagline: "テレグラムでのアジアテーマNFTカードゲーム",
    title1: "ドージマフィア",
    title2: "カポス・レジェンド",
    title3: "レスキュー",
    description: "アジアの美学を持つ戦略的カードバトル。マフィアとドラゴンがテレグラム上のNFTパワードコンバットで激突。オリジナルNFTはOpenSeaでオークションされます。",
    joinMafia: "マフィアに参加",
    becomeRescuer: "ドラゴンに参加",
    discoverMore: "もっと詳しく",
    visitWebsite: "dogslution.orgにアクセス",
    donate: "寄付をする",
    openSeaAuction: "NFTコレクションを見る"
  },
  zh: {
    tagline: "电报上的亚洲主题NFT卡牌游戏",
    title1: "道奇黑手党",
    title2: "首领传奇",
    title3: "救援",
    description: "一款具有亚洲美学的战略卡牌对战，黑手党与龙在电报上的NFT驱动战斗中相互对抗。原创NFT将在OpenSea上拍卖。",
    joinMafia: "加入黑手党",
    becomeRescuer: "加入龙队",
    discoverMore: "了解更多",
    visitWebsite: "访问dogslution.org",
    donate: "进行捐赠",
    openSeaAuction: "查看NFT收藏"
  }
};

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-slide-up');
    }
    
    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.classList.add('animate-slide-up');
      }
    }, 300);

    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.classList.add('animate-slide-up');
      }
    }, 600);
  }, []);

  // Ensure we have text for the current language
  const t = translations[language];

  // Handle button actions
  const joinMafia = () => {
    navigate('/tutorial');
    toast({
      title: "Joining Mafia Faction", 
      description: "Welcome to the Mafia Faction! Your journey begins now.",
    });
  };

  const joinDragons = () => {
    navigate('/tutorial');
    toast({
      title: "Joining Dragon Rescuers", 
      description: "Welcome to the Dragon Rescuers! Your journey begins now.",
    });
  };

  const makeDonation = () => {
    window.open('https://www.dogslution.org/donate', '_blank');
    toast({
      title: "Thank You!",
      description: "You're being redirected to make a donation to support greyhound rescue.",
    });
  };

  const openOpenSeaCollection = () => {
    window.open('https://opensea.io/collection/doge-legends', '_blank');
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background with overlay and dragon */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat">
        {/* Dragon overlay SVG - Asian style */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full max-w-4xl"
            style={{ filter: 'drop-shadow(0 0 10px rgba(138, 75, 175, 0.7))' }}
          >
            <path 
              d="M60,30 C65,25 70,22 75,25 C80,28 85,35 82,40 C79,45 70,42 75,48 C80,54 85,52 83,58 C81,64 75,65 70,62 C65,59 62,55 58,60 C54,65 50,70 45,68 C40,66 38,60 40,55 C42,50 45,48 40,45 C35,42 30,45 27,40 C24,35 25,30 30,25 C35,20 45,20 50,25 C55,30 55,35 60,30 Z"
              fill="url(#dragon-gradient)" 
              className="animate-pulse-soft"
            />
            <path
              d="M20,55 C15,60 16,68 22,70 C28,72 35,68 38,60"
              stroke="url(#dragon-gradient)"
              strokeWidth="1.5"
              fill="none"
              className="animate-dash"
            />
            <path
              d="M80,40 C85,35 83,25 75,20 C67,15 60,18 55,25"
              stroke="url(#dragon-gradient)"
              strokeWidth="1.5"
              fill="none"
              className="animate-dash"
            />
            <defs>
              <linearGradient id="dragon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
              <style>
                {`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                  .animate-dash {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: dash 3s linear infinite;
                  }
                `}
              </style>
            </defs>
          </svg>
        </div>
      </div>

      {/* NFT card design in background */}
      <div className="absolute right-[5%] top-[20%] w-[300px] opacity-20 hidden lg:block">
        <img 
          src="/lovable-uploads/e01a4cf8-fade-4973-a943-82cab1bad514.png"
          alt="Jade Dragon NFT Card"
          className="w-full h-auto transform rotate-12"
        />
      </div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
      
      {/* Language selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">{t.tagline}</span>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold opacity-0"
          >
            <span className="text-gradient-mafia">{t.title1}</span> <br className="md:hidden" />
            <span className="text-gradient-rescuer">{t.title2}</span> <br />
            <span className="text-gradient-primary mt-2 inline-block">{t.title3}</span>
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground opacity-0 max-w-3xl mx-auto"
          >
            {t.description}
          </p>
          
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 pt-4"
          >
            <button 
              className="btn-mafia"
              onClick={joinMafia}
            >
              {t.joinMafia}
            </button>
            <button 
              className="btn-rescuer"
              onClick={joinDragons}
            >
              {t.becomeRescuer}
            </button>
          </div>
          
          {/* OpenSea Button */}
          <div className="pt-4 opacity-0 animate-fade-in" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
            <button 
              onClick={openOpenSeaCollection}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto"
            >
              <ExternalLink size={20} className="mr-2" />
              {t.openSeaAuction}
            </button>
          </div>
          
          {/* Donation Button */}
          <div className="pt-6 opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto"
              onClick={makeDonation}
            >
              <Heart size={20} className="mr-2 animate-pulse" />
              {t.donate}
            </button>
          </div>
          
          <div className="pt-4 opacity-80 hover:opacity-100 transition-opacity">
            <a 
              href="https://www.dogslution.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              {t.visitWebsite}
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Donation Banner */}
      <div className="absolute bottom-24 left-0 right-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 py-3 opacity-0 animate-fade-in" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">
            <span className="text-purple-300">♥</span> 
            {language === 'en' && "Support greyhound rescue efforts through our NFT auctions"}
            {language === 'es' && "Apoya los esfuerzos de rescate de galgos a través de nuestras subastas NFT"}
            {language === 'ja' && "NFTオークションを通じてグレイハウンドレスキューの取り組みをサポート"}
            {language === 'zh' && "通过我们的NFT拍卖支持灰狗救援工作"}
            <span className="text-purple-300">♥</span>
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#cards" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-sm mb-1">{t.discoverMore}</span>
          <ChevronDown size={20} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
