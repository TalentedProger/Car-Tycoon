import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementCard } from '@/components/AchievementCard';
import { useAchievements } from '@/hooks/useAchievements';
import { achievementCategories } from '@/data/achievements';
import { useTelegram } from '@/hooks/useTelegram';

interface ProfileProps {
  userId: string;
  gameState: {
    coins: number;
    level: number;
    energy: number;
    maxEnergy: number;
    hourlyIncome: number;
    boostsUsedToday: number;
    boostActive: boolean;
    totalClicks: number;
  };
  updateGameState: (updates: any) => void;
}

export default function Profile({ userId, gameState, updateGameState }: ProfileProps) {
  const { userName, userPhoto, sendDataToBot } = useTelegram();
  const [finalUserPhoto, setFinalUserPhoto] = useState<string>('');
  const { 
    achievements, 
    totalXPEarned, 
    claimAchievement, 
    getAchievementsByCategory, 
    getAchievementStats 
  } = useAchievements();

  // Try to get user photo from Telegram WebApp first, then fallback to API
  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (userPhoto) {
        // Use WebApp photo if available
        setFinalUserPhoto(userPhoto);
      } else {
        // Fallback to API
        try {
          const response = await fetch(`/api/user-photo/${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.photoUrl) {
              setFinalUserPhoto(data.photoUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user photo:', error);
        }
      }
    };

    fetchUserPhoto();
  }, [userPhoto, userId]);

  const stats = getAchievementStats();

  const handleSaveProgress = () => {
    sendDataToBot({
      action: 'save_progress',
      coins: gameState.coins,
      level: gameState.level,
      totalXP: totalXPEarned,
      achievements: stats,
      userId
    });
  };

  const handleClaimAchievement = (achievementId: string) => {
    claimAchievement(achievementId, (coins: number, xp: number) => {
      // Add coins to game state
      updateGameState({
        coins: gameState.coins + coins,
        // XP is handled by the useGameState hook via totalClicks
        totalClicks: gameState.totalClicks + xp
      });
    });
  };
  return (
    <div className="p-6 pb-24">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">👤 Профиль</TabsTrigger>
          <TabsTrigger value="achievements">🏆 Достижения</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden relative">
                  {finalUserPhoto ? (
                    <>
                      <img 
                        src={finalUserPhoto} 
                        alt={`${userName} аватар`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.currentTarget as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.querySelector('.fallback-emoji')?.classList.remove('hidden');
                            target.style.display = 'none';
                          }
                        }}
                      />
                      <span className="fallback-emoji text-white text-2xl absolute inset-0 flex items-center justify-center hidden">👤</span>
                    </>
                  ) : (
                    <span className="text-white text-2xl">👤</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-dark">{userName}</h2>
                <p className="text-gray-500 text-sm">ID: {userId}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Уровень:</span>
                  <span className="font-bold text-foreground">{gameState.level}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Всего монет:</span>
                  <span className="font-bold text-foreground">{gameState.coins.toLocaleString()} <span className="text-green-700 text-xs">₽</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Энергия:</span>
                  <span className="font-bold text-foreground">{gameState.energy}/{gameState.maxEnergy}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Доход/час:</span>
                  <span className="font-bold text-foreground">{gameState.hourlyIncome} <span className="text-green-700 text-xs">₽</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Бустов использовано:</span>
                  <span className="font-bold text-foreground">{gameState.boostsUsedToday}/2</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Общий XP:</span>
                  <span className="font-bold text-blue-400">{totalXPEarned.toLocaleString()} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Stats */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                🏆 Статистика достижений
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                  <div className="text-sm text-muted-foreground">Выполнено</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{stats.claimed}</div>
                  <div className="text-sm text-muted-foreground">Получено</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">{stats.availableToClaim}</div>
                  <div className="text-sm text-muted-foreground">Доступно</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{stats.completionPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Прогресс</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Кнопка сохранения прогресса */}
          <Card>
            <CardContent className="p-6 text-center">
              <Button
                onClick={handleSaveProgress}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl w-full mb-3"
              >
                📤 Поделиться прогрессом
              </Button>
              <p className="text-gray-500 text-sm">
                Отправьте данные о своем прогрессе в Telegram
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-3">
          {/* Available to Claim */}
          {stats.availableToClaim > 0 && (
            <Card className="border-green-500/50 bg-green-950/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
                  🎁 Готово к получению
                </h3>
                <div className="grid gap-3">
                  {achievements
                    .filter(a => a.completed && !a.claimed)
                    .sort((a, b) => {
                      const rarityOrder = { basic: 1, rare: 2, epic: 3, legendary: 4 };
                      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                    })
                    .map(achievement => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onClaim={handleClaimAchievement}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements by Category */}
          <Tabs defaultValue="tuning" className="w-full">
            {/* Category Selection Card */}
            <Card className="bg-muted/30 border-muted">
              <CardContent className="p-8 pt-[32px] pb-[32px] px-6">
                <h3 className="text-lg font-bold mb-6 text-center">Категории достижений</h3>
                
                {/* Category Tabs - 2 columns with 3 rows */}
                <TabsList className="grid grid-cols-2 gap-1 bg-transparent h-auto p-1">
                  <TabsTrigger value="tuning" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white bg-background/50">🔧 Тюнинг</TabsTrigger>
                  <TabsTrigger value="earnings" className="data-[state=active]:bg-green-600 data-[state=active]:text-white bg-background/50">💰 Доход</TabsTrigger>
                  
                  <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-background/50">🚗 Торговля</TabsTrigger>
                  <TabsTrigger value="racing" className="data-[state=active]:bg-red-600 data-[state=active]:text-white bg-background/50">🏁 Гонки</TabsTrigger>
                  
                  <TabsTrigger value="numbers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white bg-background/50">🔠 Номера</TabsTrigger>
                  <TabsTrigger value="detailing" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white bg-background/50">🧽 Детейлинг</TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>

            {/* Achievement Cards Content */}
            <div className="mt-6">
              {Object.entries(achievementCategories).map(([categoryKey, categoryName]) => (
                <TabsContent key={categoryKey} value={categoryKey} className="space-y-3">
                  <h3 className="text-lg font-bold mb-3 text-center">{categoryName}</h3>
                  <div className="grid gap-3">
                    {getAchievementsByCategory(categoryKey).map(achievement => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        onClaim={handleClaimAchievement}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
