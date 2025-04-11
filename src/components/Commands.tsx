
import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, Zap, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/useSound";
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/pages/Index';

interface Command {
  command: string;
  description: string;
  example?: string;
}

const Commands = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSound();
  const { language } = React.useContext(LanguageContext);

  // Translations
  const translations = {
    en: {
      title: "Command Reference",
      subtitle: "Interact with the game through these Telegram bot commands",
      joinTelegram: "Join on Telegram",
      groupInfo: "Join our Telegram groups to interact with other players"
    },
    es: {
      title: "Referencia de Comandos",
      subtitle: "Interactúa con el juego a través de estos comandos del bot de Telegram",
      joinTelegram: "Únete en Telegram",
      groupInfo: "Únete a nuestros grupos de Telegram para interactuar con otros jugadores"
    },
    ja: {
      title: "コマンドリファレンス",
      subtitle: "これらのTelegramボットコマンドを通じてゲームと対話する",
      joinTelegram: "Telegramに参加",
      groupInfo: "他のプレイヤーと交流するには、Telegramグループに参加してください"
    },
    zh: {
      title: "命令参考",
      subtitle: "通过这些Telegram机器人命令与游戏互动",
      joinTelegram: "加入Telegram",
      groupInfo: "加入我们的Telegram群组与其他玩家互动"
    }
  };
  
  const t = translations[language] || translations.en;

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

  const commands: Command[] = [
    {
      command: '/start',
      description: 'Start the game and show available options.',
      example: '/start'
    },
    {
      command: '/mycards',
      description: 'View your NFT cards collection.',
      example: '/mycards'
    },
    {
      command: '/gacha',
      description: 'Summon a new card using TON tokens.',
      example: '/gacha'
    },
    {
      command: '/attack',
      description: 'Attack another player with selected cards.',
      example: '/attack @player'
    },
    {
      command: '/shop',
      description: 'Access the NFT store and game items.',
      example: '/shop'
    },
    {
      command: '/leaderboard',
      description: 'View the player ranking.',
      example: '/leaderboard'
    }
  ];

  const handleCommandClick = (cmd: Command) => {
    playSound('button');
    navigator.clipboard.writeText(cmd.command);
    toast({
      title: "Command copied!",
      description: `${cmd.command} has been copied to clipboard.`,
    });
  };

  const openTelegram = () => {
    playSound('button');
    window.open('https://t.me/dogemafiagame', '_blank');
    toast({
      title: "Joining Telegram group",
      description: "Opening the Telegram group in a new tab.",
    });
  };

  return (
    <section
      id="commands"
      ref={sectionRef}
      className="py-16 bg-secondary/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">Telegram Bot</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t.title}</h2>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-border flex items-center">
            <MessageSquare size={20} className="mr-2 text-primary" />
            <h3 className="text-lg font-semibold">Telegram Bot Commands</h3>
          </div>
          
          <div className="divide-y divide-border">
            {commands.map((cmd, index) => (
              <div
                key={cmd.command}
                className={cn(
                  "px-6 py-4 transition-all duration-300 hover:bg-secondary/50 opacity-0 cursor-pointer",
                  isVisible && "animate-slide-up"
                )}
                style={{ animationDelay: `${index * 70}ms` }}
                onClick={() => handleCommandClick(cmd)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <code className="bg-secondary px-2 py-1 rounded text-primary font-mono">
                        {cmd.command}
                      </code>
                      {cmd.example && cmd.example !== cmd.command && (
                        <span className="ml-2 text-muted-foreground text-sm">
                          Example: <code className="bg-secondary/50 px-1 rounded">{cmd.example}</code>
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground">{cmd.description}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20"
                    aria-label="Copy command"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommandClick(cmd);
                    }}
                  >
                    <Zap size={14} className="text-primary" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t.groupInfo}
          </p>
          <Button 
            onClick={openTelegram}
            className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md 
                      shadow-lg transition-all duration-300 hover:shadow-primary/30 hover:shadow-xl"
          >
            <MessageSquare size={18} className="mr-2" />
            {t.joinTelegram}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Commands;
