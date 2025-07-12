import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
// import rewardIcon from '@assets/reward-icon.png';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimReward: () => void;
  canClaimReward: boolean;
  rewardAmount: number;
  nextRewardTime: number;
}

export function RewardModal({ 
  isOpen, 
  onClose, 
  onClaimReward, 
  canClaimReward, 
  rewardAmount, 
  nextRewardTime 
}: RewardModalProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!canClaimReward) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = nextRewardTime - now;
        
        if (remaining <= 0) {
          setTimeLeft('');
          clearInterval(interval);
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [canClaimReward, nextRewardTime]);

  const handleClaimReward = () => {
    onClaimReward();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">🎁 Ежедневная награда</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center text-4xl">🎁</div>
          </div>

          <Card className="glass-dark">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-bold text-green-500">{rewardAmount}</span>
                <span className="text-green-500 text-2xl">💵</span>
              </div>
              
              <div className="text-muted-foreground mb-4">
                Награда равна доходу за 10 часов
              </div>

              {canClaimReward ? (
                <Button 
                  onClick={handleClaimReward}
                  className="w-full glass-button bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Получить награду
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Следующая награда через:
                  </div>
                  <div className="text-xl font-mono text-yellow-500">
                    {timeLeft}
                  </div>
                  <Button 
                    onClick={onClose}
                    className="w-full glass-button"
                    variant="outline"
                  >
                    Закрыть
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}