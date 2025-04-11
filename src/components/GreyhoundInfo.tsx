
import React from 'react';
import { Heart, Ticket, Award, ExternalLink, Paintbrush, PawPrint, DollarSign } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const GreyhoundInfo = () => {
  const { toast } = useToast();

  const handleDonation = () => {
    window.open('https://www.dogslution.org', '_blank');
    toast({
      title: "Thank you for your support!",
      description: "You're being redirected to our donation page. 30% of all proceeds go directly to greyhound shelters.",
    });
  };

  const donationBenefits = [
    {
      icon: <Ticket className="h-6 w-6 text-primary" />,
      title: "Art Exhibition Tickets",
      description: "Exclusive access to digital and physical art exhibitions featuring our greyhound-inspired artwork."
    },
    {
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      title: "Personalized NFTs",
      description: "Custom-designed NFT with your name as a special reward for major contributors."
    },
    {
      icon: <Paintbrush className="h-6 w-6 text-pink-500" />,
      title: "Artist Collaborations",
      description: "Meet the artists behind our unique greyhound character designs."
    },
    {
      icon: <PawPrint className="h-6 w-6 text-green-500" />,
      title: "Metaverse Access",
      description: "Exclusive access to our upcoming greyhound-themed metaverse experience."
    }
  ];

  const facts = [
    {
      title: "Coat Characteristics",
      description: "Greyhounds have short, smooth coats that require minimal maintenance, coming in a variety of colors and patterns."
    },
    {
      title: "Abandonment Rate",
      description: "Thousands of racing greyhounds are abandoned each year after their racing careers end, often at just 2-5 years old."
    },
    {
      title: "Gentle Temperament",
      description: "Despite their racing background, greyhounds are surprisingly gentle, calm, and make excellent companions."
    },
    {
      title: "Shelter Support",
      description: "30% of all proceeds from this project go directly to supporting greyhound shelters and adoption programs."
    }
  ];

  return (
    <section id="greyhound-info" className="py-24 relative overflow-hidden">
      {/* Background with animated paw prints */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="paw-print-animation">
          {Array(20).fill(0).map((_, i) => (
            <PawPrint 
              key={i} 
              className="absolute text-primary" 
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 1.5 + 0.5})`,
                animation: `float ${Math.random() * 10 + 20}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 mb-4">
            <span className="text-sm font-medium text-primary">Greyhound Rescue Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Saving Greyhounds Through Gaming</h2>
          <p className="text-muted-foreground text-lg">
            Learn about the plight of racing greyhounds and how your participation helps fund their rescue and rehabilitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-display font-semibold mb-6">About Greyhounds</h3>
            <div className="space-y-6">
              {facts.map((fact, index) => (
                <div key={index} className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                  <h4 className="text-lg font-semibold mb-2">{fact.title}</h4>
                  <p className="text-muted-foreground">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="glass-card rounded-xl overflow-hidden mb-6">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/lovable-uploads/5e94d4ae-e50a-4330-9c4d-3036b0aec7fa.png" 
                  alt="Greyhound Rescue" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium">
                    Meet our NFT greyhound characters, designed to raise awareness about greyhound rescue
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground mb-4">
                  30% of all proceeds from NFT sales and game revenue go directly to greyhound shelters around the world. 
                  Together, we can make a difference in these elegant dogs' lives.
                </p>
                <div className="flex justify-end">
                  <a 
                    href="https://www.dogslution.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Learn more
                    <ExternalLink className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Benefits Section */}
        <div className="bg-donation-gradient rounded-xl p-8 mb-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-display font-bold mb-3">Donation Benefits</h3>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              When you donate to our cause, you'll receive exclusive rewards while helping greyhounds in need
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="rounded-full bg-background/30 w-12 h-12 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-white/70 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={handleDonation}
              className="bg-white text-purple-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              <Heart className="mr-2 text-pink-500" /> Make a Donation
            </button>
          </div>
        </div>
        
        {/* Statistics Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="glass-card p-6 rounded-xl">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="counter text-3xl font-bold">30%</div>
            <p className="text-sm text-muted-foreground">Proceeds to Shelters</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <PawPrint className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="counter text-3xl font-bold">1000+</div>
            <p className="text-sm text-muted-foreground">Greyhounds Helped</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <Award className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="counter text-3xl font-bold">100+</div>
            <p className="text-sm text-muted-foreground">Unique NFT Cards</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <Ticket className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="counter text-3xl font-bold">5+</div>
            <p className="text-sm text-muted-foreground">Art Exhibitions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreyhoundInfo;
