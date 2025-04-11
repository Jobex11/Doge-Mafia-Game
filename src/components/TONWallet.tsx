
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Wallet, Coins, Plus, ArrowRight, ExternalLink, Heart, Gift } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import TONWalletConnector from './TONWalletConnector';

interface NFTCard {
  id: number;
  name: string;
  type: 'mafioso' | 'dragon';
  collection: string;
  price: number;
  image: string;
  rarity: string;
}

const nftCards: NFTCard[] = [
  // Asian-themed greyhound mafia characters
  { id: 1, name: 'Dragon Greyhound', type: 'mafioso', collection: 'Genesis', price: 250, image: '/lovable-uploads/2c606d71-9212-4ee3-be4e-61a137ec6e1b.png', rarity: 'Legendary' },
  { id: 2, name: 'Spike The Rebel', type: 'dragon', collection: 'Genesis', price: 180, image: '/lovable-uploads/8a5d0761-a398-48a4-a22b-6389e80280b7.png', rarity: 'Rare' },
  { id: 3, name: 'Rocco The Defender', type: 'mafioso', collection: 'Genesis', price: 150, image: '/lovable-uploads/5309056f-7930-4da3-81b2-9e1f0e64420a.png', rarity: 'Rare' },
  { id: 4, name: 'Blaze The Gamer', type: 'dragon', collection: 'Genesis', price: 220, image: '/lovable-uploads/f5446118-737e-43bb-968e-c722b550ec04.png', rarity: 'Epic' },
  { id: 5, name: 'Mafia Boss #5', type: 'mafioso', collection: 'Genesis', price: 250, image: '/lovable-uploads/18ea957f-89aa-441e-9d24-eca6b292e6c1.png', rarity: 'Legendary' },
  { id: 6, name: 'Dragon Rebelde', type: 'dragon', collection: 'Genesis', price: 190, image: '/lovable-uploads/73810ab4-70e1-415b-b132-8884d5140364.png', rarity: 'Epic' },
  { id: 7, name: 'The Intrepid Canine', type: 'dragon', collection: 'Genesis', price: 230, image: '/lovable-uploads/871677f1-850d-44dc-8ae0-574da67db572.png', rarity: 'Epic' },
  { id: 8, name: 'Crypto Dragon', type: 'mafioso', collection: 'Genesis', price: 210, image: '/lovable-uploads/3a0b2a75-ac69-4618-8659-4db4e2e19706.png', rarity: 'Epic' },
];

const upcomingCollections = [
  "Yakuza Elite",
  "Dragon Masters",
  "Silk Road Legends",
  "Jade Guardians",
  "Tokyo Nights",
  "Temple Defenders",
  "Asian Legends",
  "Dynasty Warriors"
];

const donationBenefits = [
  {
    icon: <Gift className="h-5 w-5 text-white" />,
    title: "Custom NFT",
    description: "Personalized NFT with your name as a reward for major contributors"
  }
];

const TONWallet = () => {
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mafioso' | 'dragon'>('all');
  const [showDonationModal, setShowDonationModal] = useState(false);

  const connectWallet = () => {
    setWalletConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your TON wallet has been successfully connected!",
    });
  };

  const buyNFT = (nft: NFTCard) => {
    if (balance >= nft.price) {
      setBalance(balance - nft.price);
      toast({
        title: "NFT Purchased!",
        description: `You have successfully purchased ${nft.name} for ${nft.price} TON! 30% will go to greyhound rescue.`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough TON to purchase this NFT.",
        variant: "destructive",
      });
    }
  };

  const viewOnOpenSea = () => {
    window.open('https://opensea.io/collection/doge-mafia-legends', '_blank');
    toast({
      title: "Redirecting to OpenSea",
      description: "You'll be redirected to our Doge Mafia Legends collection on OpenSea.",
    });
  };
  
  const handleDonation = () => {
    setShowDonationModal(true);
    setTimeout(() => {
      window.open('https://opensea.io/collection/doge-mafia-legends', '_blank');
      setShowDonationModal(false);
      toast({
        title: "Thank you for your support!",
        description: "You're being redirected to make a donation. 30% of all funds go to greyhound shelters.",
      });
    }, 1500);
  };

  const filteredNFTs = activeFilter === 'all' 
    ? nftCards 
    : nftCards.filter(card => card.type === activeFilter);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-400';
      case 'Rare':
        return 'text-blue-400';
      case 'Epic':
        return 'text-purple-400';
      case 'Legendary':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section id="wallet" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">TON Wallet & NFT Market</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Connect Your Wallet & Support Greyhounds</h2>
          <p className="text-muted-foreground text-lg">
            Connect your TON wallet to purchase, trade, and collect unique greyhound NFTs. 30% of proceeds support greyhound shelters.
            Original NFTs are auctioned on OpenSea.
          </p>
        </div>

        {/* Donation Benefits */}
        <div className="glass-card rounded-xl p-8 mb-12 bg-gradient-to-r from-[#D946EF]/20 to-[#8B5CF6]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
            <PawAnimations />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-display font-semibold mb-2">Support Greyhound Rescue</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              30% of all proceeds go directly to greyhound shelters, helping rescued dogs find loving homes. 
              The elegant greyhound has a short, smooth coat and gentle temperament, but thousands are abandoned yearly after racing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {donationBenefits.map((benefit, index) => (
              <div key={index} className="bg-primary/10 p-5 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-primary/20 mr-3">
                    {benefit.icon}
                  </div>
                  <h4 className="font-medium">{benefit.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto animate-pulse-soft"
              onClick={handleDonation}
            >
              <Heart className="mr-2" /> Donate Now
            </button>
          </div>
        </div>

        {/* OpenSea Auction Banner */}
        <div className="glass-card rounded-xl p-6 mb-12 max-w-4xl mx-auto bg-gradient-to-r from-[#0066ff]/20 to-[#8B5CF6]/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-display font-semibold mb-2">Doge Mafia Legends on OpenSea</h3>
              <p className="text-muted-foreground">
                Check out our official Ethereum NFT collection on OpenSea. Bid on exclusive Mafia-themed Greyhound NFTs.
              </p>
            </div>
            <button 
              onClick={viewOnOpenSea}
              className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#8B5CF6] text-white rounded-full font-medium flex items-center"
            >
              Visit OpenSea
              <ExternalLink className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Wallet Connection */}
        <TONWalletConnector className="max-w-4xl mx-auto mb-12" />

        {/* Collection Info */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">Genesis Collection</h3>
              <p className="text-muted-foreground">Unique NFTs featuring Greyhound Mafiosos and Dragons</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
                  } rounded-l-lg`}
                  onClick={() => setActiveFilter('all')}
                >
                  All Cards
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === 'mafioso'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
                  }`}
                  onClick={() => setActiveFilter('mafioso')}
                >
                  Mafiosos
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${
                    activeFilter === 'dragon'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-primary/80 hover:text-primary-foreground'
                  } rounded-r-lg`}
                  onClick={() => setActiveFilter('dragon')}
                >
                  Dragons
                </button>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNFTs.map((nft, index) => (
              <div
                key={nft.id}
                className={`glass-card rounded-xl overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-lg animate-card-appear`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm">
                    <span className={getRarityColor(nft.rarity)}>{nft.rarity}</span>
                  </div>
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm">
                    {nft.type === 'mafioso' ? (
                      <span className="text-mafia">Mafioso</span>
                    ) : (
                      <span className="text-rescuer">Dragon</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-xs">30% supports greyhound rescue</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-display font-semibold mb-2">{nft.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-primary mr-1" />
                      <span className="font-medium">{nft.price} TON</span>
                    </div>
                    <button
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        walletConnected
                          ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      onClick={() => walletConnected && buyNFT(nft)}
                      disabled={!walletConnected}
                    >
                      Buy NFT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Collections */}
        <div className="mt-20 glass-card rounded-xl overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-display font-bold mb-6">Upcoming Collections</h3>
            <p className="text-muted-foreground mb-8">
              Get ready for 8 more exciting collections coming soon to the Doge Mafia Legends universe!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {upcomingCollections.map((collection, index) => (
                <div 
                  key={collection} 
                  className="bg-primary/5 p-4 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors transform hover:scale-105 duration-300"
                >
                  <p className="font-medium mb-1">{collection}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Donation modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background rounded-xl p-8 max-w-md w-full text-center">
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-display font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-6">
              Your contribution makes a huge difference in the lives of rescued greyhounds.
              Redirecting you to our OpenSea collection...
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 animate-shimmer"></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Animation component for paw prints
const PawAnimations = () => {
  return (
    <div className="relative w-full h-full">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i}
          viewBox="0 0 100 100" 
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 20 + 20}px`,
            height: `${Math.random() * 20 + 20}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
            opacity: Math.random() * 0.5 + 0.5
          }}
        >
          <path 
            d="M50,20 C55,10 65,10 70,15 C75,20 75,30 70,35 C65,40 55,40 50,35 C45,30 45,30 50,20 Z M30,30 C35,20 45,20 50,25 C55,30 55,40 50,45 C45,50 35,50 30,45 C25,40 25,40 30,30 Z M70,30 C75,20 85,20 90,25 C95,30 95,40 90,45 C85,50 75,50 70,45 C65,40 65,40 70,30 Z M40,60 C45,50 55,50 60,55 C65,60 65,70 60,75 C55,80 45,80 40,75 C35,70 35,70 40,60 Z M60,60 C65,50 75,50 80,55 C85,60 85,70 80,75 C75,80 65,80 60,75 C55,70 55,70 60,60 Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
};

export default TONWallet;
