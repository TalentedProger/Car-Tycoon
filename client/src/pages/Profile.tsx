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
  const { userName, sendDataToBot } = useTelegram();
  const { 
    achievements, 
    totalXPEarned, 
    claimAchievement, 
    getAchievementsByCategory, 
    getAchievementStats 
  } = useAchievements();

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
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">👤</span>
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

        <TabsContent value="achievements" className="space-y-6">
          {/* Available to Claim */}
          {stats.availableToClaim > 0 && (
            <Card className="border-green-500/50 bg-green-950/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center gap-2">
                  🎁 Готово к получению ({stats.availableToClaim})
                </h3>
                <div className="grid gap-3">
                  {achievements
                    .filter(a => a.completed && !a.claimed)
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tuning">🔧 Тюнинг</TabsTrigger>
              <TabsTrigger value="earnings">💰 Доход</TabsTrigger>
              <TabsTrigger value="trading">🚗 Торговля</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-3 mt-2">
              <TabsTrigger value="racing">🏁 Гонки</TabsTrigger>
              <TabsTrigger value="numbers">🔠 Номера</TabsTrigger>
              <TabsTrigger value="detailing">🧽 Детейлинг</TabsTrigger>
            </TabsList>

            {Object.entries(achievementCategories).map(([categoryKey, categoryName]) => (
              <TabsContent key={categoryKey} value={categoryKey} className="space-y-4 mt-4">
                <h3 className="text-lg font-bold mb-4">{categoryName}</h3>
                <div className="grid gap-4">
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
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
