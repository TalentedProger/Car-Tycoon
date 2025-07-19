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
    shadowColor: 'shadow-gray-500/20',
    name: 'Базовая',
    order: 1
  },
  rare: {
    color: '#3446C7',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-500',
    shadowColor: 'shadow-blue-500/20',
    name: 'Редкая',
    order: 2
  },
  epic: {
    color: '#6D2EBF',
    textColor: 'text-purple-100',
    borderColor: 'border-purple-500',
    shadowColor: 'shadow-purple-500/20',
    name: 'Эпическая',
    order: 3
  },
  legendary: {
    color: '#FFD700',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-400',
    shadowColor: 'shadow-yellow-500/20',
    name: 'Легендарная',
    order: 4
  }
};

export function AchievementCard({ achievement, onClaim }: AchievementCardProps) {
  const config = rarityConfig[achievement.rarity];
  const progressPercentage = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
  const isCompleted = achievement.completed || achievement.progress >= achievement.maxProgress;
  const canClaim = isCompleted && !achievement.claimed;

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${config.borderColor} ${config.shadowColor} ${
        isCompleted ? 'shadow-xl' : 'opacity-85'
      } ${achievement.claimed ? 'opacity-60' : ''}`}
      style={{ backgroundColor: config.color }}
    >
      {/* Completed indicator */}
      {achievement.claimed && (
        <div className="absolute top-3 left-3 text-green-400 text-lg">
          ✅
        </div>
      )}

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Icon - Centered */}
          <div className="text-center space-y-1">
            <div className="text-xl">{achievement.icon}</div>
            <h3 className={`font-bold text-lg ${config.textColor} tracking-wide`}>
              {achievement.title}
            </h3>
          </div>

          {/* Description */}
          <p className={`text-center text-xs ${config.textColor} opacity-90 font-light leading-relaxed`}>
            {achievement.description}
          </p>

          {/* Progress Section */}
          <div className="space-y-2 py-2">
            <div className={`text-xs ${config.textColor} flex items-center justify-between`}>
              <span className="font-light">📊 Прогресс:</span>
              <span className="font-mono font-medium">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-1.5 bg-black/40"
            />
            
            <div className={`text-xs ${config.textColor} opacity-90 font-mono text-center`}>
              🔢 {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
            </div>
          </div>

          {/* Reward */}
          <div className={`text-xs ${config.textColor} text-center space-y-1`}>
            <div className="font-light opacity-80">🎁 Награда</div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">
                {achievement.coinReward.toLocaleString()} <span className="text-green-400 text-xs">₽</span>
              </span>
              <span className="text-blue-400 font-semibold">
                +{achievement.xpReward} XP
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {achievement.claimed ? (
              <Button 
                disabled
                className="w-full bg-green-600/20 text-green-300 opacity-60 cursor-not-allowed border border-green-600/30 h-8 text-xs"
                size="sm"
              >
                ✅ Получено
              </Button>
            ) : canClaim ? (
              <Button 
                onClick={() => onClaim(achievement.id)}
                className="w-full bg-green-600/80 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/40 animate-pulse border border-green-500/50 h-8 text-xs"
                size="sm"
              >
                Получить награду ▶
              </Button>
            ) : (
              <Button 
                disabled
                className="w-full bg-gray-700/50 text-gray-400 opacity-70 cursor-not-allowed border border-gray-600/30 h-8 text-xs"
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