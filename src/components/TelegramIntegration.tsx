
import React, { useEffect, useState } from 'react';
import { MessageSquare, Check, ExternalLink, Bell, BellOff, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSound } from '@/hooks/useSound';
import { useGameState } from '@/hooks/useGameState';

interface TelegramIntegrationProps {
  walletAddress?: string;
  className?: string;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({ 
  walletAddress,
  className = ""
}) => {
  const { toast } = useToast();
  const { playSound } = useSound();
  const { gameState, linkTelegram } = useGameState();
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [isLinked, setIsLinked] = useState(gameState.telegramLinked);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const botUsername = "doge_mafia_heroes_bot"; // replace with your actual bot username

  useEffect(() => {
    // Check if running in Telegram WebApp environment
    if (window.Telegram && window.Telegram.WebApp) {
      setIsTelegramApp(true);
      
      // Initialize the WebApp
      window.Telegram.WebApp.ready();
      
      // Set up Telegram UI if needed
      if (walletAddress) {
        window.Telegram.WebApp.MainButton.setText('Link Wallet');
        window.Telegram.WebApp.MainButton.show();
        window.Telegram.WebApp.MainButton.onClick(() => {
          linkWalletToTelegram();
        });
      }
    }
    
    // Update state from game state
    setIsLinked(gameState.telegramLinked);
  }, [walletAddress, gameState.telegramLinked]);

  const openTelegramBot = () => {
    playSound('button');
    setIsLoading(true);
    
    const telegramBotUrl = `https://t.me/${botUsername}`;
    
    if (isTelegramApp && window.Telegram?.WebApp) {
      // If inside Telegram, use the internal method
      window.Telegram.WebApp.openTelegramLink(botUsername);
    } else {
      // Otherwise open in a new tab
      window.open(telegramBotUrl, '_blank');
    }
    
    toast({
      title: "Opening Telegram Bot",
      description: "You'll be redirected to our Telegram bot.",
    });
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  const linkWalletToTelegram = () => {
    playSound('button');
    setIsLoading(true);
    
    // In a real implementation, this would communicate with your backend
    // to associate the Telegram user with their wallet address
    
    // For demo purposes, we'll simulate success
    setTimeout(() => {
      setIsLinked(true);
      linkTelegram();
      setIsLoading(false);
      playSound('success');
      toast({
        title: "Wallet Linked",
        description: "Your TON wallet has been successfully linked to your Telegram account!",
      });
    }, 1500);
  };
  
  const toggleNotifications = () => {
    playSound('button');
    setNotificationsEnabled(!notificationsEnabled);
    
    toast({
      title: notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
      description: notificationsEnabled 
        ? "You won't receive game updates via Telegram." 
        : "You'll receive game updates via Telegram!"
    });
  };
  
  const shareToTelegram = () => {
    playSound('button');
    
    // Create share URL
    const shareText = "Join me in Doge Mafia Heroes - an exciting NFT game with greyhound characters!";
    const shareUrl = "https://t.me/share/url?url=https://dogemafia.io&text=" + encodeURIComponent(shareText);
    
    // Open share dialog
    window.open(shareUrl, '_blank');
    
    toast({
      title: "Sharing to Telegram",
      description: "Opening Telegram share dialog...",
    });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="p-4 rounded-full bg-blue-500/10 mr-4">
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold">Telegram Integration</h3>
            <p className="text-muted-foreground">
              {isTelegramApp ? 
                "You're using our Telegram mini app" : 
                "Connect with our Telegram bot"
              }
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {isLinked ? (
            <div className="space-y-3">
              <div className="flex items-center text-green-500">
                <Check className="h-5 w-5 mr-2" />
                <span>Wallet Linked to Telegram</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleNotifications}
                  className="flex items-center"
                >
                  {notificationsEnabled ? (
                    <>
                      <BellOff className="h-4 w-4 mr-2" />
                      Disable Notifications
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Enable Notifications
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={shareToTelegram}
                  className="flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          ) : walletAddress ? (
            <Button 
              onClick={linkWalletToTelegram}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Link Wallet to Telegram"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={openTelegramBot}
              className="flex items-center"
              disabled={isLoading}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isLoading ? "Opening..." : "Open Telegram Bot"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Additional Telegram features */}
      {isLinked && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className="p-3 bg-blue-500/10 rounded-lg text-center cursor-pointer hover:bg-blue-500/20 transition-colors"
              onClick={() => playSound('button')}
            >
              <h4 className="font-medium mb-1">Game Notifications</h4>
              <p className="text-xs text-muted-foreground">Get notified about game events</p>
            </div>
            
            <div 
              className="p-3 bg-blue-500/10 rounded-lg text-center cursor-pointer hover:bg-blue-500/20 transition-colors" 
              onClick={() => playSound('button')}
            >
              <h4 className="font-medium mb-1">Find Friends</h4>
              <p className="text-xs text-muted-foreground">Invite Telegram contacts to play</p>
            </div>
            
            <div 
              className="p-3 bg-blue-500/10 rounded-lg text-center cursor-pointer hover:bg-blue-500/20 transition-colors" 
              onClick={() => playSound('button')}
            >
              <h4 className="font-medium mb-1">Telegram Chat</h4>
              <p className="text-xs text-muted-foreground">Join our community channel</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        <p>Use the command /start in our Telegram bot to begin your adventure!</p>
      </div>
    </Card>
  );
};

export default TelegramIntegration;
