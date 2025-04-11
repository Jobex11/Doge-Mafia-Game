
import React, { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TONWalletConnector from './TONWalletConnector';
import TelegramIntegration from './TelegramIntegration';
import DiscordIntegration from './DiscordIntegration';
import { useTonConnectUI } from '@tonconnect/ui-react';

const GameplayTutorial = () => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const [tonConnectUI] = useTonConnectUI();
  
  // Callback for when wallet is connected
  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
    console.log("Wallet connected with address:", address);
  };

  return (
    <div className="min-h-screen japanese-pattern">
      <NavBar />
      
      <section className="py-10 md:py-20 pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto fade-in">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 neon-text">
              Gameplay Tutorial & Connections
            </h1>
            <p className="text-muted-foreground text-lg">
              Learn how to play Doge Mafia Heroes and connect your accounts for the full experience.
            </p>
          </div>
          
          <Tabs defaultValue="connections" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connections">Account Connections</TabsTrigger>
              <TabsTrigger value="tutorial">Game Tutorial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connections" className="mt-6 space-y-6">
              <h2 className="text-2xl font-display font-bold mb-6">Connect Your Accounts</h2>
              
              {tonConnectUI && (
                <TONWalletConnector 
                  onConnected={handleWalletConnected} 
                  className="mb-6"
                />
              )}
              
              <TelegramIntegration 
                walletAddress={walletAddress} 
                className="mb-6"
              />
              
              <DiscordIntegration 
                className="mb-6"
              />
              
              <div className="glass-card rounded-xl p-6 mt-8">
                <h3 className="text-xl font-display font-semibold mb-4">Why Connect?</h3>
                <p className="text-muted-foreground mb-4">
                  Connecting your accounts provides these benefits:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access to exclusive NFTs and in-game items</li>
                  <li>Participate in community events and governance</li>
                  <li>Receive notifications for game updates</li>
                  <li>Earn rewards through our staking system</li>
                  <li>Trade items with other players securely</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="tutorial" className="mt-6">
              <h2 className="text-2xl font-display font-bold mb-6">Gameplay Tutorial</h2>
              
              <div className="glass-card rounded-xl p-6 mb-6">
                <h3 className="text-xl font-display font-semibold mb-4">Getting Started</h3>
                <p className="text-muted-foreground mb-4">
                  Doge Mafia Heroes is a strategy card game where you build your criminal empire.
                  Here's how to get started:
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">1. Build Your Deck</h4>
                    <p className="text-muted-foreground">
                      Start by collecting Doge Hero cards and building a deck of 30 cards.
                      Balance your deck with different card types: Heroes, Actions, and Properties.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">2. Understanding Card Types</h4>
                    <p className="text-muted-foreground">
                      <strong>Heroes:</strong> Your main characters with unique abilities.<br />
                      <strong>Actions:</strong> One-time effects that can change the game state.<br />
                      <strong>Properties:</strong> Ongoing effects that provide resources or abilities.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">3. Basic Gameplay</h4>
                    <p className="text-muted-foreground">
                      - Each player starts with 3 cards and 1 resource point<br />
                      - On your turn, draw a card and gain +1 resource point<br />
                      - Play cards by spending resource points<br />
                      - Use Hero abilities to attack opponents or defend yourself<br />
                      - The last player with Heroes remaining wins
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-display font-semibold mb-4">Advanced Strategies</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Faction Synergies</h4>
                    <p className="text-muted-foreground">
                      Cards of the same faction work better together. Build your deck around
                      one or two factions for maximum effectiveness.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Resource Management</h4>
                    <p className="text-muted-foreground">
                      Don't spend all your resources in one turn. Keep some in reserve
                      to respond to your opponent's plays.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">NFT Advantages</h4>
                    <p className="text-muted-foreground">
                      NFT cards have unique abilities that can give you an edge in gameplay.
                      Stake your NFTs to earn passive rewards even when not playing.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default GameplayTutorial;
