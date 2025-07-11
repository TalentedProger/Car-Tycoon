import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  };
}

export default function Profile({ userId, gameState }: ProfileProps) {
  const { userName, sendDataToBot } = useTelegram();

  const handleSaveProgress = () => {
    sendDataToBot({
      action: 'save_progress',
      coins: gameState.coins,
      level: gameState.level,
      userId
    });
  };
  return (
    <div className="p-6 pb-24">
      <Card className="mb-6">
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
              <span className="font-bold text-foreground">{gameState.coins.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Энергия:</span>
              <span className="font-bold text-foreground">{gameState.energy}/{gameState.maxEnergy}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Доход/час:</span>
              <span className="font-bold text-foreground">{gameState.hourlyIncome}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Бустов использовано:</span>
              <span className="font-bold text-foreground">{gameState.boostsUsedToday}/2</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Кнопка сохранения прогресса */}
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <Button
            onClick={handleSaveProgress}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl w-full mb-3"
          >
            📤 Поделиться прогрессом
          </Button>
          <p className="text-gray-500 text-sm">
            Отправить результаты в чат с ботом
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200">
        <CardContent className="p-6 text-center">
          <span className="text-yellow-600 text-3xl mb-3 block">🏅</span>
          <h3 className="text-lg font-bold text-dark mb-2">Достижения</h3>
          <p className="text-gray-600 text-sm">Скоро появятся новые награды!</p>
        </CardContent>
      </Card>
    </div>
  );
}
