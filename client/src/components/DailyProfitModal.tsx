import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Shield } from 'lucide-react';

interface DailyProfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimProfit: (amount: number, isDoubled: boolean) => void;
  gameState: {
    coins: number;
    level: number;
    totalClicks: number;
    hourlyIncome: number;
    lastProfitClaim?: number;
    dailyStreak?: number;
    timeInGame?: number;
    totalUpgradeSpent?: number;
    ownedCars?: any[];
    selectedStarterCar?: any;
  };
}

interface ProfitBreakdown {
  carFleetIncome: number;
  tuningCashback: number;
  activityBonus: number;
  streakBonus: number;
  total: number;
}

export function DailyProfitModal({ 
  isOpen, 
  onClose, 
  onClaimProfit,
  gameState
}: DailyProfitModalProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [canClaim, setCanClaim] = useState(false);
  const [canDoubleReward, setCanDoubleReward] = useState(true);

  const PROFIT_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
  const lastClaimTime = gameState.lastProfitClaim || 0;
  const nextClaimTime = lastClaimTime + PROFIT_INTERVAL;
  const dailyStreak = gameState.dailyStreak || 0;

  // Calculate profit breakdown
  const calculateProfitBreakdown = (): ProfitBreakdown => {
    // 🚗 Доход с автопарка: 1% от общей стоимости текущего автомобиля
    const getCurrentCarValue = () => {
      const currentCar = gameState.ownedCars?.[0] || gameState.selectedStarterCar;
      if (!currentCar) return 50000; // Базовое значение если нет машины
      
      // Расчет стоимости на основе характеристик автомобиля
      const basePower = currentCar.horsepower || currentCar.basePower || 100;
      const baseAcceleration = parseFloat(currentCar.acceleration || currentCar.baseAcceleration || '12.0');
      const baseMaxSpeed = currentCar.maxSpeed || currentCar.baseMaxSpeed || 180;
      
      // Формула стоимости: мощность * 500 + (300 - разгон) * 1000 + макс.скорость * 300
      const carValue = Math.floor(
        basePower * 500 + 
        (300 - baseAcceleration) * 1000 + 
        baseMaxSpeed * 300
      );
      
      return Math.max(carValue, 50000); // Минимум 50,000
    };
    
    const carValue = getCurrentCarValue();
    const carFleetIncome = Math.floor(carValue * 0.01); // 1% от стоимости автомобиля

    // 💰 Кэшбек с тюнинга: 10% от всех покупок улучшений
    const tuningCashback = Math.floor((gameState.totalUpgradeSpent || 0) * 0.1);

    // 📊 Бонус за активность: +50 за каждую минуту в игре
    const timeInGameMinutes = gameState.timeInGame || 0;
    const activityBonus = Math.floor(timeInGameMinutes * 50);

    // Base total before streak
    const baseTotal = carFleetIncome + tuningCashback + activityBonus;

    // Streak bonus - +5% per day up to 7 days (35% max)
    const streakMultiplier = Math.min(dailyStreak * 0.05, 0.35);
    const streakBonus = Math.floor(baseTotal * streakMultiplier);

    const total = baseTotal + streakBonus;

    return {
      carFleetIncome,
      tuningCashback,
      activityBonus,
      streakBonus,
      total
    };
  };

  const profitBreakdown = calculateProfitBreakdown();

  // Update timer and claim availability
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = nextClaimTime - now;
      
      if (remaining <= 0) {
        setCanClaim(true);
        setTimeLeft('');
      } else {
        setCanClaim(false);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}ч ${minutes}м`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextClaimTime]);

  const handleClaimProfit = () => {
    onClaimProfit(profitBreakdown.total, false);
    onClose();
  };

  const handleDoubleReward = () => {
    if (canDoubleReward) {
      onClaimProfit(profitBreakdown.total * 2, true);
      setCanDoubleReward(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="tracking-tight text-center font-bold flex items-center justify-center gap-2 mb-4 text-[26px]">
            <span style={{
              background: 'linear-gradient(135deg, #8B5CF6, #A855F7, #C084FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
              filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))'
            }}>
              Твой ежедневный доход
            </span>
            <span>💸</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="glass-dark">
            <CardContent className="p-4">
              {/* Profit Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    🚗 Доход с автопарка:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {profitBreakdown.carFleetIncome.toLocaleString()} <span className="text-green-700 text-xs">₽</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    💰 Кэшбек с тюнинга:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {profitBreakdown.tuningCashback.toLocaleString()} <span className="text-green-700 text-xs">₽</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    📊 Бонус за активность:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {profitBreakdown.activityBonus.toLocaleString()} <span className="text-green-700 text-xs">₽</span>
                  </span>
                </div>

                {profitBreakdown.streakBonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      🔥 Серия дней ({dailyStreak}/7):
                    </span>
                    <span className="text-sm font-semibold text-green-400">
                      +{profitBreakdown.streakBonus.toLocaleString()} <span className="text-green-700 text-xs">₽</span>
                    </span>
                  </div>
                )}

                {/* Separator */}
                <div className="border-t border-muted-foreground/20 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground flex items-center gap-2">
                      💵 ИТОГО:
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {profitBreakdown.total.toLocaleString()} <span className="text-green-700 text-lg">₽</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canClaim ? (
                <div className="space-y-3">
                  <Button 
                    onClick={handleClaimProfit}
                    className="w-full glass-button bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30 text-white font-bold"
                    size="lg"
                  >
                    Получить прибыль ▶
                  </Button>
                  
                  {canDoubleReward && (
                    <Button 
                      onClick={handleDoubleReward}
                      className="w-full glass-button bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 text-white font-bold"
                      size="lg"
                    >
                      📺 Увеличить x2
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    disabled
                    className="w-full glass-button opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <Shield className="h-4 w-4" />
                    Получить прибыль
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      🔁 Следующее начисление: через {timeLeft}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Streak Info */}
          {dailyStreak > 0 && (
            <Card className="glass-dark border-yellow-500/30">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-yellow-400 font-semibold text-sm mb-1">
                    🔥 Серия: {dailyStreak} {dailyStreak === 1 ? 'день' : dailyStreak < 5 ? 'дня' : 'дней'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Бонус: +{Math.min(dailyStreak * 5, 35)}% к доходу
                  </div>
                  <div className="text-xs text-muted-foreground">
                    До максимума: {Math.max(0, 7 - dailyStreak)} {Math.max(0, 7 - dailyStreak) === 1 ? 'день' : 'дней'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close button for non-claimable state */}
          {!canClaim && (
            <Button 
              onClick={onClose}
              className="w-full glass-button"
              variant="outline"
            >
              Закрыть
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}