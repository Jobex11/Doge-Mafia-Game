
import React, { useState, useEffect } from 'react';
import { Clock, Gem, ArrowRight, CheckCircle, CreditCard, Trophy, Coins, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Type for staking info
interface StakingInfo {
  amount: number;
  duration: number;
  apy: number;
  reward: number;
  unlockDate: Date;
}

// Staking plans
const stakingPlans = [
  { id: 1, duration: 30, apy: 5, name: "Beginner" },
  { id: 2, duration: 60, apy: 7.5, name: "Standard" },
  { id: 3, duration: 90, apy: 10, name: "Premium" },
  { id: 4, duration: 180, apy: 15, name: "Elite" }
];

const StakingSystem = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [stakingAmount, setStakingAmount] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState(stakingPlans[0]);
  const [stakedInfo, setStakedInfo] = useState<StakingInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTelegramConnected, setIsTelegramConnected] = useState(false);

  // Check if Telegram is available
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      setIsTelegramConnected(true);
      
      // Initialize the WebApp if in Telegram environment
      window.Telegram.WebApp.ready();
    }
  }, []);

  // Connect wallet
  const connectWallet = () => {
    setIsConnected(true);
    toast({
      title: "Wallet Connected",
      description: "Your TON wallet has been successfully connected!",
    });
  };

  // Calculate staking reward
  const calculateReward = (amount: number, duration: number, apy: number): number => {
    return (amount * apy * duration) / (100 * 365);
  };

  // Handle staking
  const handleStake = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const unlockDate = new Date();
    unlockDate.setDate(now.getDate() + selectedPlan.duration);
    
    const reward = calculateReward(stakingAmount, selectedPlan.duration, selectedPlan.apy);
    
    const newStakingInfo: StakingInfo = {
      amount: stakingAmount,
      duration: selectedPlan.duration,
      apy: selectedPlan.apy,
      reward: reward,
      unlockDate: unlockDate
    };
    
    setStakedInfo(newStakingInfo);
    
    toast({
      title: "Staking Successful",
      description: `You have staked ${stakingAmount} TON for ${selectedPlan.duration} days.`,
    });
  };

  // Calculate time left for staking
  useEffect(() => {
    if (!stakedInfo) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const timeDiff = stakedInfo.unlockDate.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        clearInterval(timer);
        setTimeLeft('Unlocked');
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [stakedInfo]);
  
  // Handle claiming rewards
  const handleClaim = () => {
    if (!stakedInfo) return;
    
    toast({
      title: "Rewards Claimed",
      description: `You have claimed ${stakedInfo.reward.toFixed(2)} TON in rewards!`,
    });
    
    // Reset staking info
    setStakedInfo(null);
  };
  
  return (
    <section id="staking" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary mb-4">
            <span className="text-sm font-medium text-foreground">TON Staking</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Stake Your TON</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Earn passive income by staking your TON tokens. Choose from different staking plans and earn rewards.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Staking Input */}
          <div className="glass-card rounded-xl p-6 col-span-1 md:col-span-2">
            <h3 className="text-xl font-display font-bold mb-6">Stake TON</h3>
            
            {!isConnected ? (
              <div className="text-center p-8">
                <Button onClick={connectWallet} className="action-button">
                  Connect Wallet
                </Button>
              </div>
            ) : stakedInfo ? (
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-success/10 border border-success/30">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="text-green-500 mr-2" />
                    <h4 className="text-lg font-semibold">Staking Active</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Staked</p>
                      <p className="text-xl font-semibold">{stakedInfo.amount} TON</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-xl font-semibold">{stakedInfo.duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">APY</p>
                      <p className="text-xl font-semibold">{stakedInfo.apy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Reward</p>
                      <p className="text-xl font-semibold text-primary">{stakedInfo.reward.toFixed(2)} TON</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                    <div>
                      <p className="text-sm text-muted-foreground">Time until unlock</p>
                      <p className="text-lg font-semibold">{timeLeft}</p>
                    </div>
                    <Button
                      onClick={handleClaim}
                      disabled={timeLeft !== 'Unlocked'}
                      className={`${timeLeft === 'Unlocked' ? 'bg-green-600 hover:bg-green-700' : 'bg-muted cursor-not-allowed'}`}
                    >
                      Claim Rewards
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount to Stake (TON)</label>
                  <input
                    type="number"
                    min="10"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(Number(e.target.value))}
                    className="w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Select Staking Plan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {stakingPlans.map(plan => (
                      <div
                        key={plan.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                          selectedPlan.id === plan.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background/50 hover:bg-background'
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="text-center">
                          <h5 className="font-semibold mb-1">{plan.name}</h5>
                          <p className="text-xl font-bold text-primary">{plan.apy}%</p>
                          <p className="text-sm text-muted-foreground">{plan.duration} days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/10">
                  <div className="flex justify-between items-center mb-2">
                    <span>Staking Amount</span>
                    <span>{stakingAmount} TON</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Staking Duration</span>
                    <span>{selectedPlan.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>APY</span>
                    <span>{selectedPlan.apy}%</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span>Estimated Reward</span>
                    <span className="text-primary">
                      {calculateReward(stakingAmount, selectedPlan.duration, selectedPlan.apy).toFixed(2)} TON
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={handleStake}
                  className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Stake Now
                </Button>
              </div>
            )}
          </div>
          
          {/* Staking Info */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-display font-bold mb-6">Staking Benefits</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-blue-500/10 mr-3">
                  <Gem className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Earn Passive Income</h4>
                  <p className="text-sm text-muted-foreground">Earn up to 15% APY by staking your TON tokens</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-purple-500/10 mr-3">
                  <Trophy className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Exclusive NFT Rewards</h4>
                  <p className="text-sm text-muted-foreground">Get access to exclusive NFTs by staking</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-green-500/10 mr-3">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Flexible Duration</h4>
                  <p className="text-sm text-muted-foreground">Choose staking duration that works best for you</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-orange-500/10 mr-3">
                  <Coins className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Compound Interest</h4>
                  <p className="text-sm text-muted-foreground">Reinvest your rewards for exponential growth</p>
                </div>
              </div>
            </div>
            
            {isTelegramConnected && (
              <div className="mt-8 p-4 rounded-lg bg-blue-900/20 border border-blue-800/30">
                <div className="flex items-center mb-2">
                  <CreditCard className="text-blue-400 mr-2" />
                  <h4 className="font-medium">Telegram Integration</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You're using our Telegram mini app. Receive notifications about your staking rewards directly in Telegram.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Notifications Enabled",
                      description: "You'll receive updates about your staking rewards in Telegram"
                    });
                  }}
                >
                  Enable Notifications
                </Button>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Total Staked</h4>
                  <p className="text-2xl font-bold">1,245,678 TON</p>
                </div>
                <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Staking is a great way to earn passive income while supporting the Doge Mafia Heroes ecosystem.
          </p>
          <Button className="action-button">
            Learn More About Staking
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StakingSystem;
