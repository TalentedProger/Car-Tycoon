import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Settings, Store, Gift } from 'lucide-react';

const BOOST_MULTIPLIER = 1.5;

interface HomeProps {
  gameState: {
    coins: number;
    level: number;
    energy: number;
    maxEnergy: number;
    hourlyIncome: number;
    boostActive: boolean;
    ownedCars?: any[];
    selectedStarterCar?: any;
  };
  onEarnCoins: () => boolean;
  onActivateBoost: () => boolean;
  canClick: boolean;
  canBoost: boolean;
  levelProgress: number;
  boostTimeLeft: number;
  onOpenReward: () => void;
  canClaimReward: boolean;
  setCurrentView?: (view: 'home' | 'upgrade-cards') => void;
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
  canClaimReward,
  setCurrentView
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
        }, 400);
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

  // Calculate dynamic hourly income using shared car data structure
  const calculateHourlyIncome = () => {
    // Handle both object and string format for selectedStarterCar
    let selectedCarKey = 'hyundai-sonata'; // Default
    const selectedCarData = gameState.selectedStarterCar;
    
    if (typeof selectedCarData === 'string') {
      selectedCarKey = selectedCarData;
    } else if (selectedCarData && selectedCarData.name) {
      // Map car names to keys
      const carNameToKey: { [key: string]: string } = {
        'ВАЗ 2107': 'vaz-2107',
        'Mercedes-Benz': 'mercedes-benz',
        'BMW': 'bmw',
        'Audi 100': 'audi',
        'Hyundai Sonata IV': 'hyundai-sonata'
      };
      selectedCarKey = carNameToKey[selectedCarData.name] || 'hyundai-sonata';
    }
    
    // Car base prices - must match AutoSalon exactly
    const carDatabase: { [key: string]: { basePrice: number } } = {
      'vaz-2107': { basePrice: 85000 },
      'mercedes-benz': { basePrice: 300000 },
      'bmw': { basePrice: 280000 },
      'audi': { basePrice: 140000 },
      'hyundai-sonata': { basePrice: 135000 }
    };
    
    // Get car configuration from localStorage - same as AutoSalon
    const carTrimsData = localStorage.getItem('carTrims');
    let selectedConfiguration = 'Base';
    
    if (carTrimsData) {
      const trims = JSON.parse(carTrimsData);
      // Find the trim for the selected car specifically
      let carId = 1; // Default VAZ 2107
      if (selectedCarKey === 'hyundai-sonata') carId = 4; // Hyundai Sonata IV has ID 4
      else if (selectedCarKey === 'audi') carId = 3; // Audi 100 has ID 3  
      else if (selectedCarKey === 'bmw') carId = 15; // BMW 5 серии has ID 15
      else if (selectedCarKey === 'mercedes-benz') carId = 16; // Mercedes E-класс has ID 16
      
      selectedConfiguration = trims[carId] || 'Base';
    }
    
    // Configuration multipliers - same as AutoSalon
    const trimMultipliers: { [key: string]: number } = {
      'Base': 1,
      'Comfort': 1.3,
      'Elegance': 1.6,
      'Premium': 2.0,
      'Sport': 2.5
    };
    
    const carInfo = carDatabase[selectedCarKey] || carDatabase['hyundai-sonata'];
    const multiplier = trimMultipliers[selectedConfiguration] || 1;
    const finalPrice = Math.round(carInfo.basePrice * multiplier);
    
    // Calculate 0.25% (0.0025) of final price, rounded up - same as AutoSalon
    const baseIncome = Math.ceil(finalPrice * 0.0025);
    
    // Add any purchased upgrade cards bonus from localStorage
    const upgradeBonus = gameState.hourlyIncome || 0;
    
    return baseIncome + upgradeBonus;
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
            <span className="hourly-income text-sm font-bold flex items-center gap-1">
              <span>+{calculateHourlyIncome()}</span>
              <span className="text-green-700 text-sm">₽</span>
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
        <Button 
          className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1"
          onClick={() => setCurrentView?.('upgrade-cards')}
        >
          <Store className="h-5 w-5" />
          <span className="text-xs">Карточки</span>
        </Button>
        <Button className="glass-button rounded-2xl p-4 h-16 flex flex-col items-center gap-1">
          <div className="text-lg">🎁</div>
          <span className="text-xs">Подарки</span>
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
        <div id="coin-counter" className="coin-display text-4xl font-bold mb-2 flex items-baseline justify-center gap-2">
          <span>{gameState.coins.toLocaleString()}</span>
          <span className="text-green-700 text-3xl">₽</span>
        </div>
      </div>

      {/* Main Car Circle */}
      <div className="flex justify-center mb-8">
        <Button
          id="car-circle"
          onClick={handleCarClick}
          disabled={!canClick}
          className={`car-circle w-64 h-64 rounded-full flex items-center justify-center transition-all duration-200 ${
            canClick 
              ? 'hover:scale-105 active:scale-95 cursor-pointer animate-glow' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <img 
            src="/car.svg" 
            alt="Car" 
            className="w-24 h-24 object-contain"
          />
        </Button>
      </div>

      {/* Energy and Boost Controls */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {/* Energy Display */}
        <div className="glass-dark rounded-2xl p-2 px-4 min-w-[120px]">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Энергия</div>
            <div className="text-sm font-bold mb-2 flex items-center justify-center gap-1">
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
        <div className={`glass-dark rounded-2xl p-2 px-4 min-w-[120px] ${
          gameState.boostActive ? 'boost-glow' : ''
        }`}>
          <Button
            onClick={handleBoostClick}
            disabled={!canBoost}
            className="w-full h-full bg-transparent border-0 p-0 hover:bg-transparent"
          >
            <div className="text-center w-full">
              <div className="text-xs text-muted-foreground mb-1">Буст</div>
              <div className="text-sm font-bold mb-2 flex items-center justify-center gap-1">
                <span className="text-yellow-500">🔋</span>
                {gameState.boostActive ? (
                  <span>{formatTime(boostTimeLeft)}</span>
                ) : canBoost ? (
                  <span>x1.5</span>
                ) : (
                  <span>Лимит</span>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    gameState.boostActive ? 'bg-green-500' : canBoost ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: gameState.boostActive ? '100%' : canBoost ? '100%' : '0%' }}
                />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
