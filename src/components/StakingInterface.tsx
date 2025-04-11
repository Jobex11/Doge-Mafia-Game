
import React, { useState, useEffect } from 'react';
import { Wallet, Clock, CreditCard, TrendingUp, Lock, ArrowRight, Info } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useSound } from '@/hooks/useSound';
import { useGameState } from '@/hooks/useGameState';

const StakingInterface: React.FC = () => {
  const { gameState, startStaking, claimStakingRewards } = useGameState();
  const { playSound } = useSound();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [estimatedReward, setEstimatedReward] = useState(0);

  // Check if staking is unlocked
  const isUnlocked = gameState.unlockedFeatures.staking;

  // Update time elapsed since staking started
  useEffect(() => {
    if (gameState.stakingInfo.isStaking && gameState.stakingInfo.stakingStartDate) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const startDate = new Date(gameState.stakingInfo.stakingStartDate!);
        const elapsedDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        
        setTimeElapsed(elapsedDays);
        
        // Calculate estimated rewards
        const annualRate = gameState.stakingInfo.rewardsRate;
        const dailyRate = annualRate / 365;
        const rewards = Math.floor(gameState.stakingInfo.stakedAmount * dailyRate * elapsedDays);
        setEstimatedReward(rewards);
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [gameState.stakingInfo.isStaking, gameState.stakingInfo.stakingStartDate, gameState.stakingInfo.stakedAmount, gameState.stakingInfo.rewardsRate]);

  const handleStakeAmountChange = (value: number[]) => {
    setStakeAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure we have a valid number
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= gameState.currency.ton) {
      setStakeAmount(value);
    }
  };

  const handleStake = () => {
    if (stakeAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than zero.",
        variant: "destructive"
      });
      playSound('error');
      return;
    }
    
    if (stakeAmount > gameState.currency.ton) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough TON to stake this amount.",
        variant: "destructive"
      });
      playSound('error');
      return;
    }
    
    playSound('button');
    startStaking(stakeAmount);
  };

  const handleClaimRewards = () => {
    playSound('button');
    claimStakingRewards();
  };

  if (!isUnlocked) {
    return (
      <section className="py-16 bg-gradient-to-b from-green-950/20 via-background to-background" id="staking">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-3">TON Staking</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stake your TON tokens to earn passive rewards while supporting the game ecosystem.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-green-950/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-green-500" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">Staking Locked</h3>
              <p className="text-muted-foreground mb-6">
                Reach level 3 to unlock the staking feature and start earning passive rewards with your TON tokens.
              </p>
              
              <div className="flex justify-center">
                <Button onClick={() => playSound('button')}>
                  Continue Playing to Level Up
                </Button>
              </div>
              
              <p className="mt-4 text-xs text-muted-foreground">
                Current level: {gameState.level} / 3 required
              </p>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-green-950/20 via-background to-background" id="staking">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-950/30 mb-4">
            <span className="text-sm font-medium text-green-500">Earn While You Play</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">TON Staking System</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stake your TON tokens to earn passive rewards while supporting the game ecosystem.
            5% APR with daily rewards calculation.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
          {/* Staking Benefits */}
          <Card className="p-6 bg-gradient-to-br from-green-950/10 to-background">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="mr-2 h-5 w-5 text-green-500" />
              Staking Benefits
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Earn 5% APR on your staked TON tokens</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Priority access to new game features and events</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Exclusive NFT drop opportunities for stakers</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Governance voting rights on game development</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                <span>Contribute to greyhound shelters initiatives</span>
              </li>
            </ul>
          </Card>
          
          {/* Staking Interface */}
          <Card className="p-6 col-span-2 bg-gradient-to-br from-green-950/5 to-background">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Stake Your TON</h3>
              <div className="flex items-center text-sm">
                <Wallet className="h-4 w-4 mr-1.5 text-primary" />
                <span>Balance: <strong>{gameState.currency.ton} TON</strong></span>
              </div>
            </div>
            
            {gameState.stakingInfo.isStaking ? (
              <div>
                <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Currently Staked:</span>
                    <span className="font-semibold">{gameState.stakingInfo.stakedAmount} TON</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Staking Since:</span>
                    <span className="font-semibold">
                      {gameState.stakingInfo.stakingStartDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Time Elapsed:</span>
                    <span className="font-semibold">
                      {timeElapsed.toFixed(2)} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Rewards:</span>
                    <span className="font-semibold text-green-500">
                      {estimatedReward.toFixed(2)} TON
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">Claim Rewards</h4>
                    <p className="text-xs text-muted-foreground">
                      Claim your accumulated staking rewards
                    </p>
                  </div>
                  <Button
                    onClick={handleClaimRewards}
                    disabled={estimatedReward < 1}
                    className="bg-green-700 hover:bg-green-800"
                  >
                    Claim {Math.floor(estimatedReward)} TON
                  </Button>
                </div>
                
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    To add more TON to your stake, claim your current rewards first, then stake a new amount.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Stake Amount</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={handleInputChange}
                      className="w-full"
                      min={1}
                      max={gameState.currency.ton}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setStakeAmount(Math.floor(gameState.currency.ton / 2))}
                      className="whitespace-nowrap"
                    >
                      Half
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setStakeAmount(gameState.currency.ton)}
                      className="whitespace-nowrap"
                    >
                      Max
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <Slider
                      value={[stakeAmount]}
                      min={0}
                      max={gameState.currency.ton}
                      step={1}
                      onValueChange={handleStakeAmountChange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 TON</span>
                      <span>{gameState.currency.ton} TON</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" /> APR:
                    </span>
                    <span className="font-semibold text-green-500">5.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1.5" /> Est. Monthly:
                    </span>
                    <span className="font-semibold">
                      {(stakeAmount * 0.05 / 12).toFixed(2)} TON
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStake} 
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={stakeAmount <= 0 || stakeAmount > gameState.currency.ton}
                >
                  Stake {stakeAmount} TON
                </Button>
                
                <p className="mt-4 text-xs text-center text-muted-foreground">
                  Staked TON tokens will be locked for rewards generation. You can claim rewards anytime.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StakingInterface;
