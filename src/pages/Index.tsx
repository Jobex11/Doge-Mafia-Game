
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import CardShowcase from '@/components/CardShowcase';
import GameMechanics from '@/components/GameMechanics';
import Commands from '@/components/Commands';
import TONWallet from '@/components/TONWallet';
import Footer from '@/components/Footer';
import { ArrowUp, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/useSound';
import IdleGameSystem from '@/components/IdleGameSystem';
import MafiaMystery from '@/components/MafiaMystery';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';

// Type for supported languages
export type Language = 'en' | 'es' | 'ja' | 'zh';

// Language context
export const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}>({
  language: 'en',
  setLanguage: () => {},
});

const translations = {
  en: {
    welcome: "Welcome to Doge Legends",
    welcomeDesc: "Connect your TON wallet to access NFTs and game features",
    loading: "Application starting with multilingual support",
    donateButton: "Donate to Unlock Characters",
    donateDesc: "Support the game and unlock special characters"
  },
  es: {
    welcome: "Bienvenido a Doge Legends",
    welcomeDesc: "Conecta tu billetera TON para acceder a NFTs y funciones del juego",
    loading: "Aplicación iniciando con soporte multilingüe",
    donateButton: "Donar para Desbloquear Personajes",
    donateDesc: "Apoya el juego y desbloquea personajes especiales"
  },
  ja: {
    welcome: "Doge Legendsへようこそ",
    welcomeDesc: "TONウォレットを接続してNFTとゲーム機能にアクセスしてください",
    loading: "多言語サポートでアプリケーションを開始しています",
    donateButton: "キャラクターをアンロックするために寄付する",
    donateDesc: "ゲームをサポートして特別なキャラクターをアンロック"
  },
  zh: {
    welcome: "欢迎来到 Doge Legends",
    welcomeDesc: "连接您的TON钱包以访问NFT和游戏功能",
    loading: "应用程序正在启动，支持多语言",
    donateButton: "捐赠解锁角色",
    donateDesc: "支持游戏并解锁特殊角色"
  }
};

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSound();
  const { gameState } = useGameState();
  const t = translations[language];

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for the navbar
          behavior: 'smooth'
        });
        
        // Play sound when clicking navigation links
        playSound('button');
      });
    });

    // Add animations for elements when they enter viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    // Show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);

    // Log initial loading for debugging
    console.info(t.loading);

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function (e) {
          e.preventDefault();
        });
      });
      
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
      
      window.removeEventListener('scroll', handleScroll);
    };
  }, [playSound, t.loading]);

  // Add HTML5 metadata for better compatibility with Telegram
  useEffect(() => {
    document.documentElement.lang = language;
    
    // Ensure correct viewport for Telegram WebApp
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add meta tag for Telegram WebApp
    let tgColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (!tgColorScheme) {
      tgColorScheme = document.createElement('meta');
      tgColorScheme.setAttribute('name', 'color-scheme');
      tgColorScheme.setAttribute('content', 'dark');
      document.head.appendChild(tgColorScheme);
    }
    
    // Add meta tag for web-app
    let tgWebApp = document.querySelector('meta[name="viewport-fit"]');
    if (!tgWebApp) {
      tgWebApp = document.createElement('meta');
      tgWebApp.setAttribute('name', 'viewport-fit');
      tgWebApp.setAttribute('content', 'cover');
      document.head.appendChild(tgWebApp);
    }

    // Display welcome toast when page loads
    toast({
      title: t.welcome,
      description: t.welcomeDesc,
    });
  }, [language, toast, t.welcome, t.welcomeDesc]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    playSound('button');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-background text-foreground">
        <NavBar />
        <Hero />
        
        {/* Donation Banner */}
        <div className="bg-purple-900/20 py-8 border-y border-purple-900/30">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-display font-bold mb-2 text-white">
                {t.donateButton}
              </h3>
              <p className="text-purple-100/70">
                {t.donateDesc}
              </p>
            </div>
            <Link to="/donation-gate">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => playSound('button')}
              >
                <Gift className="mr-2 h-5 w-5" />
                {t.donateButton}
              </Button>
            </Link>
          </div>
        </div>
        
        <CardShowcase />
        <IdleGameSystem />
        <GameMechanics />
        <Commands />
        <MafiaMystery />
        <TONWallet />
        <Footer />
        
        {/* Scroll to top button */}
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary/80 text-white shadow-lg transition-all duration-300 z-40 ${
            showScrollTop ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </LanguageContext.Provider>
  );
};

export default Index;
