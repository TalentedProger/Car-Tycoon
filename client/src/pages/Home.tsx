import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Settings, Store, Gift } from 'lucide-react';

interface HomeProps {
  gameState: {
    coins: number;
    level: number;
    energy: number;
    maxEnergy: number;
    hourlyIncome: number;
    boostActive: boolean;
  };
  onEarnCoins: () => boolean;
  onActivateBoost: () => boolean;
  canClick: boolean;
  canBoost: boolean;
  levelProgress: number;
  boostTimeLeft: number;
  onOpenReward: () => void;
  canClaimReward: boolean;
}

export default function Home({ 
  gameState, 
  onEarnCoins, 
  onActivateBoost, 
  canClick, 
  canBoost, 
  levelProgress, 
  boostTimeLeft,
  onOpenReward,
  canClaimReward
}: HomeProps) {
  const handleCarClick = () => {
    if (!canClick) return;
    
    const success = onEarnCoins();
    if (success) {
      // Add click animation
      const carCircle = document.getElementById('car-circle');
      if (carCircle) {
        carCircle.classList.add('animate-pulse-button');
        setTimeout(() => {
          carCircle.classList.remove('animate-pulse-button');
        }, 300);
      }
      
      // Add coin counter animation
      const counter = document.getElementById('coin-counter');
      if (counter) {
        counter.classList.add('animate-bounce-coin');
        setTimeout(() => {
          counter.classList.remove('animate-bounce-coin');
        }, 300);
      }
    }
  };

  const handleBoostClick = () => {
    if (!canBoost) return;
    onActivateBoost();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Top Section - Level Progress and Hourly Income */}
      <div className="flex justify-between items-center mb-6">
        {/* Level Progress */}
        <div className="glass-dark rounded-2xl p-3 min-w-[140px] relative">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-muted-foreground">Уровень {gameState.level}</div>
            <div className="text-xs text-muted-foreground">{levelProgress.toFixed(0)}%</div>
          </div>
          <Progress value={levelProgress} className="h-2 level-progress" />
        </div>

        {/* Hourly Income & Shop */}
        <div className="flex items-center gap-3">
          <div className="glass-dark rounded-2xl p-3 flex items-center gap-2">
            <span className="coin-display text-sm font-bold flex items-center gap-1">
              <span>{gameState.hourlyIncome}</span>
              <span className="text-yellow-500">🪙</span>
              <span>/час</span>
            </span>
          </div>
          <Button
            size="sm"
            className="glass-button rounded-xl p-3"
          >
            <Store className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Top Navigation Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <Button className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1">
          <Settings className="h-5 w-5" />
          <span className="text-xs">Гараж</span>
        </Button>
        <Button className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1">
          <Store className="h-5 w-5" />
          <span className="text-xs">Автосалон</span>
        </Button>
        <Button className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1">
          <div className="text-lg">🎁</div>
          <span className="text-xs">ЕКХ</span>
        </Button>
        <Button 
          className={`glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1 ${canClaimReward ? 'animate-pulse bg-green-600/20' : ''}`}
          onClick={onOpenReward}
        >
          <Gift className={`h-5 w-5 ${canClaimReward ? 'text-green-400' : ''}`} />
          <span className="text-xs">Награда</span>
        </Button>
      </div>

      {/* Coin Display */}
      <div className="text-center mb-8">
        <div id="coin-counter" className="coin-display text-6xl font-bold mb-2 flex items-center justify-center gap-2">
          <span>{gameState.coins.toLocaleString()}</span>
          <span className="text-yellow-500">🪙</span>
        </div>
      </div>

      {/* Main Car Circle */}
      <div className="flex justify-center mb-8">
        <Button
          id="car-circle"
          onClick={handleCarClick}
          disabled={!canClick}
          className={`car-circle w-56 h-56 rounded-full flex items-center justify-center text-8xl transition-all duration-200 ${
            canClick 
              ? 'hover:scale-105 active:scale-95 cursor-pointer animate-glow' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          🚗
        </Button>
      </div>

      {/* Energy and Boost Controls */}
      <div className="flex items-center justify-center gap-8 mb-8">
        {/* Energy Display */}
        <div className="glass-dark rounded-2xl p-3 min-w-[100px]">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Энергия</div>
            <div className="text-sm font-bold mb-1 flex items-center justify-center gap-1">
              <span className="text-yellow-500">⚡</span>
              {gameState.energy}/{gameState.maxEnergy}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Boost Button */}
        <Button
          onClick={handleBoostClick}
          disabled={!canBoost}
          className={`boost-button rounded-2xl p-3 min-w-[100px] h-auto flex flex-col items-center gap-1 ${
            gameState.boostActive ? 'animate-glow' : ''
          }`}
        >
          <span className="text-yellow-500 text-lg">⚡</span>
          <div className="text-center">
            {gameState.boostActive ? (
              <>
                <div className="text-xs">Активен</div>
                <div className="text-xs">{formatTime(boostTimeLeft)}</div>
              </>
            ) : canBoost ? (
              <>
                <div className="text-xs">BOOST</div>
                <div className="text-xs">x1.5</div>
              </>
            ) : (
              <>
                <div className="text-xs">Исчерпано</div>
                <div className="text-xs">сегодня</div>
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
