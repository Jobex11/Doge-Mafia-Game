
import React, { useState, useEffect } from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { Wallet, Coins, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/useSound";
import { useGameState } from "@/hooks/useGameState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface TONWalletConnectorProps {
  onConnected?: (address: string) => void;
  className?: string;
}

const TONWalletConnector: React.FC<TONWalletConnectorProps> = ({ 
  onConnected,
  className = ""
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const { toast } = useToast();
  const { playSound } = useSound();
  const [balance, setBalance] = useState<number | null>(null);
  const { gameState, connectWallet, disconnectWallet, addCurrency } = useGameState();
  const navigate = useNavigate();
  
  const isConnected = !!userFriendlyAddress;

  useEffect(() => {
    if (isConnected && userFriendlyAddress) {
      // Call the onConnected callback if provided
      if (onConnected) {
        onConnected(userFriendlyAddress);
      }
      
      // Update game state with wallet connection
      connectWallet(userFriendlyAddress);
      
      // Play sound effect
      playSound('success');
      
      // Show toast notification
      toast({
        title: "Wallet Connected",
        description: "Your TON wallet has been successfully connected!",
      });
      
      // For demo purposes, simulate a balance retrieval
      // In a real app, you would fetch this from the TON blockchain
      setBalance(gameState.currency.ton);
    }
  }, [isConnected, userFriendlyAddress, onConnected, toast, playSound, connectWallet, gameState.currency.ton]);

  const connectWalletHandler = async () => {
    playSound('button');
    try {
      await tonConnectUI.openModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWalletHandler = async () => {
    playSound('button');
    try {
      await tonConnectUI.disconnect();
      disconnectWallet();
      setBalance(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your TON wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const addFunds = () => {
    playSound('coin');
    addCurrency('ton', 500);
    setBalance(gameState.currency.ton);
    toast({
      title: "Funds Added",
      description: "500 TON has been added to your wallet for demo purposes.",
    });
  };

  const viewOpenSea = () => {
    window.open('https://opensea.io/collection/doge-mafia-legends', '_blank');
    toast({
      title: "OpenSea Collection",
      description: "Exploring the Doge Mafia Legends NFT collection on OpenSea.",
    });
  };
  
  const goToStaking = () => {
    playSound('button');
    navigate('/staking');
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="p-4 rounded-full bg-primary/10 mr-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold">TON Wallet</h3>
            <p className="text-muted-foreground">Connect to access NFT marketplace</p>
          </div>
        </div>
        
        {isConnected ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-2">
              <Coins className="h-5 w-5 text-primary mr-2" />
              <span className="text-xl font-semibold">{gameState.currency.ton} TON</span>
            </div>
            <div className="flex space-x-2 flex-wrap justify-end">
              <Button 
                variant="outline"
                size="sm"
                onClick={addFunds}
              >
                Add Funds
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={viewOpenSea}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                OpenSea
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={goToStaking}
                className="flex items-center"
              >
                <Coins className="h-4 w-4 mr-1" />
                Staking
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={disconnectWalletHandler}
              >
                Disconnect
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 truncate max-w-[300px]">
              {userFriendlyAddress}
            </p>
          </div>
        ) : (
          <Button 
            className="btn-primary"
            onClick={connectWalletHandler}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TONWalletConnector;
