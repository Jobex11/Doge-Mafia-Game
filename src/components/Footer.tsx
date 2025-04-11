
import React, { useContext } from 'react';
import { Github, MessageCircle, ExternalLink } from 'lucide-react';
import { LanguageContext } from '@/pages/Index';

const Footer = () => {
  const { language } = useContext(LanguageContext);
  
  const translations = {
    en: {
      about: "About Doge Legends",
      description: "A strategic card battle game set in the world of mafia dogs and NFTs.",
      sections: "Sections",
      resources: "Resources",
      telegram: "Play on Telegram",
      copyright: "© 2023-2025 Doge Mafia Legends. All rights reserved.",
      openSeaCollection: "OpenSea Collection"
    },
    es: {
      about: "Acerca de Doge Legends",
      description: "Un juego de batalla de cartas estratégicas ambientado en el mundo de los perros mafiosos y NFTs.",
      sections: "Secciones",
      resources: "Recursos",
      telegram: "Jugar en Telegram",
      copyright: "© 2023-2025 Doge Mafia Legends. Todos los derechos reservados.",
      openSeaCollection: "Colección en OpenSea"
    },
    ja: {
      about: "Doge Legendsについて",
      description: "マフィア犬とNFTの世界を舞台にした戦略的カードバトルゲーム。",
      sections: "セクション",
      resources: "リソース",
      telegram: "Telegramでプレイ",
      copyright: "© 2023-2025 Doge Mafia Legends. 全著作権所有。",
      openSeaCollection: "OpenSeaコレクション"
    },
    zh: {
      about: "关于Doge Legends",
      description: "以黑手党狗和NFT为背景的战略卡牌对战游戏。",
      sections: "部分",
      resources: "资源",
      telegram: "在Telegram上玩",
      copyright: "© 2023-2025 Doge Mafia Legends. 版权所有。",
      openSeaCollection: "OpenSea收藏品"
    }
  };
  
  const t = translations[language] || translations.en;
  
  const goToTelegram = () => window.open('https://t.me/dogemafiagame', '_blank');
  const goToOpenSea = () => window.open('https://opensea.io/es/collection/doge-mafia-legends', '_blank');
  
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold">{t.about}</h3>
            <p className="text-muted-foreground">
              {t.description}
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/dogemafiagame" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="https://opensea.io/es/collection/doge-mafia-legends" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.sections}</h4>
            <ul className="space-y-2">
              <li><a href="#cards" className="text-muted-foreground hover:text-foreground transition-colors">Cards</a></li>
              <li><a href="#gameplay" className="text-muted-foreground hover:text-foreground transition-colors">Game Mechanics</a></li>
              <li><a href="#commands" className="text-muted-foreground hover:text-foreground transition-colors">Commands</a></li>
              <li><a href="#idle-game" className="text-muted-foreground hover:text-foreground transition-colors">Idle Game</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.resources}</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={goToOpenSea} className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <ExternalLink size={16} className="mr-2" /> 
                  {t.openSeaCollection}
                </button>
              </li>
              <li>
                <button onClick={goToTelegram} className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <MessageCircle size={16} className="mr-2" /> 
                  {t.telegram}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
