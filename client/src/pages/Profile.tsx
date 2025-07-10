import { Card, CardContent } from '@/components/ui/card';

interface ProfileProps {
  userId: string;
  coins: number;
  totalClicks: number;
}

export default function Profile({ userId, coins, totalClicks }: ProfileProps) {
  return (
    <div className="p-6 pb-24">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-bold text-dark">Игрок</h2>
            <p className="text-gray-500 text-sm">ID: {userId}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Всего кликов:</span>
              <span className="font-bold text-dark">{totalClicks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Всего монет:</span>
              <span className="font-bold text-dark">{coins.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Время в игре:</span>
              <span className="font-bold text-dark">Новичок</span>
            </div>
          </div>
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
