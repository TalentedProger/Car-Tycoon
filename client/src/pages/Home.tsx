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
}

export default function Home({ 
  gameState, 
  onEarnCoins, 
  onActivateBoost, 
  canClick, 
  canBoost, 
  levelProgress, 
  boostTimeLeft 
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
        <div className="glass-dark rounded-2xl p-3 min-w-[140px]">
          <div className="text-xs text-muted-foreground mb-1">Уровень {gameState.level}</div>
          <Progress value={levelProgress} className="h-2 level-progress" />
          <div className="text-xs text-muted-foreground mt-1">{levelProgress.toFixed(0)}%</div>
        </div>

        {/* Hourly Income & Shop */}
        <div className="flex items-center gap-3">
          <div className="glass-dark rounded-2xl p-3 flex items-center gap-2">
            <span className="coin-display text-sm font-bold">
              💰 {gameState.hourlyIncome}/час
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
          <Zap className="h-5 w-5" />
          <span className="text-xs">Экх</span>
        </Button>
        <Button className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1">
          <Gift className="h-5 w-5" />
          <span className="text-xs">Награда</span>
        </Button>
      </div>

      {/* Coin Display */}
      <div className="text-center mb-8">
        <div id="coin-counter" className="coin-display text-6xl font-bold mb-2">
          {gameState.coins.toLocaleString()}
        </div>
        <div className="text-muted-foreground">монет</div>
      </div>

      {/* Main Car Circle */}
      <div className="flex justify-center mb-8">
        <Button
          id="car-circle"
          onClick={handleCarClick}
          disabled={!canClick}
          className={`car-circle w-48 h-48 rounded-full flex items-center justify-center text-6xl transition-all duration-200 ${
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
        <div className="glass-dark rounded-2xl p-4 min-w-[120px]">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Энергия</div>
            <div className="text-lg font-bold mb-2 flex items-center justify-center gap-1">
              <Zap className="h-4 w-4 text-blue-400" />
              {gameState.energy}/{gameState.maxEnergy}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="energy-bar h-full rounded-full transition-all duration-300"
                style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Boost Button */}
        <Button
          onClick={handleBoostClick}
          disabled={!canBoost}
          className={`boost-button rounded-2xl p-4 min-w-[120px] h-auto flex flex-col items-center gap-2 ${
            gameState.boostActive ? 'animate-glow' : ''
          }`}
        >
          <Zap className="h-6 w-6" />
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
