
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Factions = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'mafia' | 'rescuers'>('mafia');

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

  const mafiosos = [
    {
      title: 'Capos',
      description: 'Mafia leaders with strategic and tactical abilities.',
      features: [
        'Command other mafia members',
        'Strategic battle bonuses',
        'Resource control abilities'
      ]
    },
    {
      title: 'Hitmen',
      description: 'Fast attack units with abilities like assassination and stealth.',
      features: [
        'Stealth attack bonuses',
        'Critical hit abilities',
        'Target specific enemy cards'
      ]
    },
    {
      title: 'Informants',
      description: 'Characters that can gather intel on enemies or weaken opponents.',
      features: [
        'Reveal enemy cards',
        'Weaken opponent abilities',
        'Provide tactical advantages'
      ]
    }
  ];

  const rescuers = [
    {
      title: 'Elemental Dragons',
      description: 'Powerful dragons with magical abilities for defense and offense.',
      features: [
        'Elemental attack bonuses',
        'Area effect abilities',
        'Protective auras for allies'
      ]
    },
    {
      title: 'Greyhound Guardians',
      description: 'Mystical beings that protect the greyhound shelters.',
      features: [
        'Strong defensive stats',
        'Healing abilities',
        'Counter-attack mechanisms'
      ]
    },
    {
      title: 'Shelter Allies',
      description: 'Support characters that enhance dragon and guardian abilities.',
      features: [
        'Buff team members',
        'Resource generation',
        'Special combination attacks'
      ]
    }
  ];

  return (
    <section
      id="factions"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-mafia-gradient opacity-5 blur-3xl -z-10 transform -translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-rescuer-gradient opacity-5 blur-3xl -z-10 transform translate-x-1/4"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">Choose Your Faction</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Mafiosos vs. Rescuers</h2>
          <p className="text-muted-foreground text-lg">
            Choose your allegiance between the powerful Mafia organization or the mystical Greyhound Rescuers, each with unique characters and abilities.
          </p>
        </div>

        {/* Faction Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg p-1 bg-secondary">
            <button
              onClick={() => setActiveTab('mafia')}
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-all duration-300",
                activeTab === 'mafia'
                  ? "bg-mafia text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mafiosos
            </button>
            <button
              onClick={() => setActiveTab('rescuers')}
              className={cn(
                "px-6 py-2 rounded-md font-medium transition-all duration-300",
                activeTab === 'rescuers'
                  ? "bg-rescuer text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Rescuers
            </button>
          </div>
        </div>

        {/* Faction Content */}
        <div className="relative">
          {/* Mafiosos Content */}
          <div
            className={cn(
              "transition-all duration-500 transform",
              activeTab === 'mafia' ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20 absolute inset-0 pointer-events-none"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 order-2 md:order-1">
                <div className="space-y-8">
                  {mafiosos.map((item, index) => (
                    <div
                      key={item.title}
                      className={cn(
                        "glass-card p-6 rounded-xl opacity-0",
                        isVisible && activeTab === 'mafia' && "animate-slide-right"
                      )}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <h3 className="text-xl font-display font-semibold mb-3 text-gradient-mafia">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-mafia mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 order-1 md:order-2">
                <div
                  className={cn(
                    "glass-card rounded-xl overflow-hidden h-full opacity-0",
                    isVisible && activeTab === 'mafia' && "animate-fade-in"
                  )}
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-mafia-gradient opacity-20"></div>
                    <div className="relative p-8 md:p-12 h-full flex flex-col">
                      <h3 className="text-3xl font-display font-bold mb-6 text-gradient-mafia">
                        The Mafia Organization
                      </h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        A powerful criminal organization with a hierarchical structure, the mafiosos seek control of resources and territory. Led by cunning capos, they employ hitmen for their dirty work and informants to stay one step ahead of their enemies.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Hierarchy & Power</h4>
                          <p className="text-muted-foreground">
                            Mafiosos operate in a strict hierarchy where loyalty is rewarded and betrayal is punished. Each member has their role, from the supreme capos to the street-level informants.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Strategic Gameplay</h4>
                          <p className="text-muted-foreground">
                            Playing as the Mafia faction rewards strategic thinking, resource control, and offensive tactics. Use your hitmen to take out key enemy cards and your informants to gain tactical advantages.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <button className="btn-mafia">
                          Join the Mafia
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rescuers Content */}
          <div
            className={cn(
              "transition-all duration-500 transform",
              activeTab === 'rescuers' ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20 absolute inset-0 pointer-events-none"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 order-1">
                <div
                  className={cn(
                    "glass-card rounded-xl overflow-hidden h-full opacity-0",
                    isVisible && activeTab === 'rescuers' && "animate-fade-in"
                  )}
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-rescuer-gradient opacity-20"></div>
                    <div className="relative p-8 md:p-12 h-full flex flex-col">
                      <h3 className="text-3xl font-display font-bold mb-6 text-gradient-rescuer">
                        The Greyhound Rescuers
                      </h3>
                      <p className="text-lg text-muted-foreground mb-8">
                        Led by mystical dragons, the rescuers fight to protect greyhounds and their shelters. With a focus on defensive tactics and healing abilities, they stand as the last line of defense against the mafia's aggression.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Dragon Protectors</h4>
                          <p className="text-muted-foreground">
                            Elemental dragons serve as the primary protectors, each with unique magical abilities tied to their element. They form spiritual bonds with the greyhounds they protect.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Defensive Gameplay</h4>
                          <p className="text-muted-foreground">
                            Playing as the Rescuers rewards defensive positioning, healing strategies, and counterattack timing. Build a strong defensive line with guardians and support them with elemental dragons.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <button className="btn-rescuer">
                          Become a Rescuer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 order-2">
                <div className="space-y-8">
                  {rescuers.map((item, index) => (
                    <div
                      key={item.title}
                      className={cn(
                        "glass-card p-6 rounded-xl opacity-0",
                        isVisible && activeTab === 'rescuers' && "animate-slide-left"
                      )}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <h3 className="text-xl font-display font-semibold mb-3 text-gradient-rescuer">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-rescuer mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Factions;
