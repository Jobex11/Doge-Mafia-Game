
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Card {
  id: number;
  name: string;
  type: 'mafioso' | 'dragon';
  subtype: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  power: number;
  defense: number;
  image: string;
}

const cards: Card[] = [
  {
    id: 1,
    name: 'Dragon Greyhound',
    type: 'mafioso',
    subtype: 'Mafia Boss',
    description: 'A powerful greyhound mafia leader with strategic combat abilities.',
    rarity: 'Legendary',
    power: 95,
    defense: 80,
    image: '/lovable-uploads/2c606d71-9212-4ee3-be4e-61a137ec6e1b.png'
  },
  {
    id: 2,
    name: 'Spike The Rebel',
    type: 'dragon',
    subtype: 'Punk Rocker',
    description: 'Rebellious greyhound with neon aesthetics and powerful abilities.',
    rarity: 'Epic',
    power: 85,
    defense: 90,
    image: '/lovable-uploads/8a5d0761-a398-48a4-a22b-6389e80280b7.png'
  },
  {
    id: 3,
    name: 'Rocco The Defender',
    type: 'mafioso',
    subtype: 'Hitman',
    description: 'Specializes in stealth attacks and protecting fellow greyhounds.',
    rarity: 'Rare',
    power: 90,
    defense: 60,
    image: '/lovable-uploads/5309056f-7930-4da3-81b2-9e1f0e64420a.png'
  },
  {
    id: 4,
    name: 'Blaze The Gamer',
    type: 'dragon',
    subtype: 'Tech Wizard',
    description: 'Gaming-obsessed greyhound with powerful defensive abilities.',
    rarity: 'Epic',
    power: 80,
    defense: 95,
    image: '/lovable-uploads/f5446118-737e-43bb-968e-c722b550ec04.png'
  },
  {
    id: 5,
    name: 'Doge Dragon Mafia Boss',
    type: 'mafioso',
    subtype: 'Kingpin',
    description: 'The ultimate boss with supreme authority in the greyhound underworld.',
    rarity: 'Legendary',
    power: 99,
    defense: 85,
    image: '/lovable-uploads/18ea957f-89aa-441e-9d24-eca6b292e6c1.png'
  },
  {
    id: 6,
    name: 'Dragon Rebelde',
    type: 'dragon',
    subtype: 'Anarchist',
    description: 'Rebellious punk greyhound who follows no rules but his own.',
    rarity: 'Epic',
    power: 88,
    defense: 75,
    image: '/lovable-uploads/73810ab4-70e1-415b-b132-8884d5140364.png'
  },
  {
    id: 7,
    name: 'The Intrepid Canine',
    type: 'dragon',
    subtype: 'Mystic',
    description: 'Wise greyhound with ancient knowledge and mystical abilities.',
    rarity: 'Legendary',
    power: 92,
    defense: 88,
    image: '/lovable-uploads/871677f1-850d-44dc-8ae0-574da67db572.png'
  },
];

const CardShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && !flippedCards.length) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating, flippedCards]);

  const handleCardClick = (id: number) => {
    setIsAnimating(true);
    if (flippedCards.includes(id)) {
      setFlippedCards(flippedCards.filter((cardId) => cardId !== id));
    } else {
      setFlippedCards([...flippedCards, id]);
    }
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    setFlippedCards([]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    setFlippedCards([]);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getRarityColor = (rarity: Card['rarity']) => {
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

  const getTypeStyle = (type: Card['type']) => {
    return type === 'mafioso'
      ? 'bg-mafia-gradient text-white'
      : 'bg-rescuer-gradient text-white';
  };

  return (
    <section
      id="cards"
      ref={containerRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Card floating particles - adds visual interest */}
      <div className="absolute inset-0 pointer-events-none">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">NFT Greyhound Cards</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Collect Unique Greyhound NFTs</h2>
          <p className="text-muted-foreground text-lg">
            Build your deck with unique Mafiosos and Dragon Greyhounds, each with special abilities and stats.
            Trade, upgrade, and battle with your NFT cards while supporting greyhound rescue efforts.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-sm rounded-full p-3 
                     text-foreground hover:text-primary transition-colors"
            aria-label="Previous card"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/50 backdrop-blur-sm rounded-full p-3 
                     text-foreground hover:text-primary transition-colors"
            aria-label="Next card"
          >
            <ArrowRight size={24} />
          </button>

          {/* Cards display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 perspective">
            {[-1, 0, 1].map((offset) => {
              const index = (activeIndex + offset + cards.length) % cards.length;
              const card = cards[index];
              const isCenter = offset === 0;
              const isFlipped = flippedCards.includes(card.id);

              return (
                <div
                  key={card.id}
                  className={`transform transition-all duration-500 ease-out preserve-3d
                           ${isVisible ? 'opacity-100' : 'opacity-0'}
                           ${isCenter ? 'scale-100 z-20' : 'scale-90 opacity-70 z-10'}
                           ${offset === -1 ? '-translate-x-4 md:-translate-x-8' : ''}
                           ${offset === 1 ? 'translate-x-4 md:translate-x-8' : ''}
                           ${isVisible && offset === -1 ? 'animate-slide-right' : ''}
                           ${isVisible && offset === 0 ? 'animate-fade-in' : ''}
                           ${isVisible && offset === 1 ? 'animate-slide-left' : ''}`}
                  style={{ animationDelay: `${(offset + 2) * 200}ms` }}
                  onClick={() => isCenter && handleCardClick(card.id)}
                >
                  <div
                    className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden perspective shadow-2xl
                             transition-transform duration-700 card-hover preserve-3d cursor-pointer
                             ${isFlipped ? 'flip-y-180' : ''}`}
                  >
                    {/* Card Front */}
                    <div className={`absolute inset-0 backface-hidden glass-card border-2 
                                 ${card.type === 'mafioso' ? 'border-mafia' : 'border-rescuer'}`}>
                      <div className="relative h-full flex flex-col">
                        {/* Card Image */}
                        <div className="relative h-2/3 overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm">
                            <span className={getRarityColor(card.rarity)}>{card.rarity}</span>
                          </div>
                          
                          {/* NFT badge */}
                          <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm rounded-full animate-pulse-soft"></div>
                            <span className="text-xs font-bold text-white">NFT</span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-display font-semibold text-foreground">{card.name}</h3>
                          </div>
                          
                          <div className={`inline-block px-2 py-0.5 rounded-full text-xs mb-2 ${getTypeStyle(card.type)}`}>
                            {card.subtype}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 flex-1">{card.description}</p>
                          
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center">
                              <span className="text-red-500 mr-1">⚔️</span>
                              <span>{card.power}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-blue-500 mr-1">🛡️</span>
                              <span>{card.defense}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Back */}
                    <div className="absolute inset-0 backface-hidden flip-y-180 glass-card border-2 
                                 border-primary flex items-center justify-center">
                      <div className="p-6 text-center">
                        <h4 className="text-xl font-display font-bold mb-4">Card Details</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Type:</span> {card.type === 'mafioso' ? 'Mafioso' : 'Dragon'}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Subtype:</span> {card.subtype}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Rarity:</span> <span className={getRarityColor(card.rarity)}>{card.rarity}</span>
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Power</span>
                            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 shimmer"
                                style={{ width: `${card.power}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Defense</span>
                            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 shimmer"
                                style={{ width: `${card.defense}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-center opacity-70">
                          <p>30% of sales support greyhound rescue efforts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Collect, trade, and battle with original NFT greyhound cards. Each purchase supports greyhound rescue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn-mafia">
              View All Cards
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center">
              Support Rescue Efforts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardShowcase;
