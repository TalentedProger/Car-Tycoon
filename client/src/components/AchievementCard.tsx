import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'basic' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  coinReward: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClaim: (achievementId: string) => void;
}

const rarityConfig = {
  basic: {
    color: '#2F2F2F',
    textColor: 'text-gray-100',
    borderColor: 'border-gray-600',
    icon: '🟫',
    name: 'Базовая'
  },
  rare: {
    color: '#3446C7',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-500',
    icon: '🟦',
    name: 'Редкая'
  },
  epic: {
    color: '#6D2EBF',
    textColor: 'text-purple-100',
    borderColor: 'border-purple-500',
    icon: '🟪',
    name: 'Эпическая'
  },
  legendary: {
    color: '#FFD700',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-400',
    icon: '🟨',
    name: 'Легендарная'
  }
};

export function AchievementCard({ achievement, onClaim }: AchievementCardProps) {
  const config = rarityConfig[achievement.rarity];
  const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  const isCompleted = achievement.completed || achievement.progress >= achievement.maxProgress;
  const canClaim = isCompleted && !achievement.claimed;

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${config.borderColor} ${
        isCompleted ? 'shadow-lg' : 'opacity-80'
      } ${achievement.claimed ? 'opacity-60' : ''}`}
      style={{ backgroundColor: config.color }}
    >
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2 text-lg">
        {config.icon}
      </div>

      {/* Completed indicator */}
      {achievement.claimed && (
        <div className="absolute top-2 left-2 text-green-400 text-lg">
          ✅
        </div>
      )}

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Icon */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{achievement.icon}</span>
            <h3 className={`font-bold text-lg ${config.textColor}`}>
              {achievement.title}
            </h3>
          </div>

          {/* Description */}
          <p className={`text-sm ${config.textColor} opacity-90`}>
            📌 {achievement.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className={`text-sm ${config.textColor} flex items-center gap-2`}>
              📊 Прогресс: 
              <span className="font-mono">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-black/30"
            />
            
            <div className={`text-xs ${config.textColor} opacity-80 font-mono`}>
              🔢 {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
            </div>
          </div>

          {/* Reward */}
          <div className={`text-sm ${config.textColor} flex items-center gap-1`}>
            🎁 Награда: 
            <span className="font-semibold">
              {achievement.coinReward.toLocaleString()} <span className="text-green-400 text-xs">₽</span>
            </span>
            <span className="text-blue-400 font-semibold">
              +{achievement.xpReward} XP
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {achievement.claimed ? (
              <Button 
                disabled
                className="w-full bg-green-600 text-white opacity-50 cursor-not-allowed"
                size="sm"
              >
                ✅ Получено
              </Button>
            ) : canClaim ? (
              <Button 
                onClick={() => onClaim(achievement.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-500/30 animate-pulse"
                size="sm"
              >
                Получить награду ▶
              </Button>
            ) : (
              <Button 
                disabled
                className="w-full bg-gray-600 text-gray-300 opacity-50 cursor-not-allowed"
                size="sm"
              >
                В процессе...
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}