
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wallet, MoonStar, Award, Scroll, ExternalLink, Gamepad2 } from 'lucide-react';
import { LanguageContext } from '@/pages/Index';
import LanguageSwitcher from './LanguageSwitcher';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSound } from '@/hooks/useSound';

// Type for translations
type NavTranslation = {
  cards: string;
  mechanics: string;
  commands: string;
  staking: string;
  opensea: string;
  tutorial: string;
  idleGame: string;
};

// Translations for navbar items
const translations: Record<string, NavTranslation> = {
  en: {
    cards: 'Cards',
    mechanics: 'Game Mechanics',
    commands: 'Commands',
    staking: 'Staking',
    opensea: 'OpenSea',
    tutorial: 'Tutorial',
    idleGame: 'Idle Game',
  },
  es: {
    cards: 'Cartas',
    mechanics: 'Mecánicas',
    commands: 'Comandos',
    staking: 'Staking',
    opensea: 'OpenSea',
    tutorial: 'Tutorial',
    idleGame: 'Juego Idle',
  },
  ja: {
    cards: 'カード',
    mechanics: 'メカニクス',
    commands: 'コマンド',
    staking: 'ステーキング',
    opensea: 'OpenSea',
    tutorial: 'チュートリアル',
    idleGame: 'アイドルゲーム',
  },
  zh: {
    cards: '卡牌',
    mechanics: '游戏机制',
    commands: '命令',
    staking: '质押',
    opensea: 'OpenSea',
    tutorial: '教程',
    idleGame: '放置游戏',
  },
};

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = React.useContext(LanguageContext);
  const isMobile = useIsMobile();
  const { playSound } = useSound();
  
  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    playSound('button');
  };
  
  // Close menu on link click
  const closeMenu = () => {
    setIsMenuOpen(false);
    playSound('button');
  };

  // Handle OpenSea navigation
  const goToOpenSea = () => {
    window.open('https://opensea.io/collection/doge-mafia-legends', '_blank');
    playSound('button');
  };
  
  // Get translations for current language
  const t = translations[language] || translations.en;
  
  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="font-display text-2xl font-bold text-primary">Doge Legends</span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <a href="#cards" className="navbar-item">{t.cards}</a>
            <a href="#idle-game" className="navbar-item flex items-center">
              <Gamepad2 className="h-4 w-4 mr-1" />
              {t.idleGame}
            </a>
            <a href="#gameplay" className="navbar-item">{t.mechanics}</a>
            <a href="#commands" className="navbar-item">{t.commands}</a>
            <Link to="/staking" className="navbar-item flex items-center">
              <Wallet className="h-4 w-4 mr-1" />
              {t.staking}
            </Link>
            <Link to="/tutorial" className="navbar-item flex items-center">
              <Scroll className="h-4 w-4 mr-1" />
              {t.tutorial}
            </Link>
            <button 
              onClick={goToOpenSea} 
              className="navbar-item flex items-center text-blue-500 hover:text-blue-600 font-medium"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              {t.opensea}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              className="ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-xl animate-in slide-in-from-top">
          <div className="container mx-auto px-4 pt-2 pb-4 space-y-1">
            <a 
              href="#cards" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <Award className="h-5 w-5 mr-3" />
              {t.cards}
            </a>
            <a 
              href="#idle-game" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <Gamepad2 className="h-5 w-5 mr-3" />
              {t.idleGame}
            </a>
            <a 
              href="#gameplay" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <MoonStar className="h-5 w-5 mr-3" />
              {t.mechanics}
            </a>
            <a 
              href="#commands" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <Scroll className="h-5 w-5 mr-3" />
              {t.commands}
            </a>
            <Link 
              to="/staking" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <Wallet className="h-5 w-5 mr-3" />
              {t.staking}
            </Link>
            <Link 
              to="/tutorial" 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10"
              onClick={closeMenu}
            >
              <Scroll className="h-5 w-5 mr-3" />
              {t.tutorial}
            </Link>
            <button 
              className="flex items-center px-4 py-3 rounded-md hover:bg-primary/10 w-full text-left text-blue-500"
              onClick={() => {
                goToOpenSea();
                closeMenu();
              }}
            >
              <ExternalLink className="h-5 w-5 mr-3" />
              {t.opensea}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
