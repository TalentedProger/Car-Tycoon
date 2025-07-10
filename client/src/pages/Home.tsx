import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HomeProps {
  coins: number;
  totalClicks: number;
  onEarnCoins: () => void;
}

export default function Home({ coins, totalClicks, onEarnCoins }: HomeProps) {
  const handleEarnCoins = () => {
    onEarnCoins();
    
    // Add button animation
    const button = document.getElementById('earn-coins-btn');
    if (button) {
      button.classList.add('animate-pulse-button');
      setTimeout(() => {
        button.classList.remove('animate-pulse-button');
      }, 500);
    }
    
    // Add coin counter animation
    const counter = document.getElementById('coin-counter');
    if (counter) {
      counter.classList.add('animate-bounce-coin');
      setTimeout(() => {
        counter.classList.remove('animate-bounce-coin');
      }, 300);
    }
  };

  return (
    <div className="p-6 pb-24">
      {/* Coins Display */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <span className="text-3xl mr-3">💰</span>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Монеты</p>
              <p id="coin-counter" className="text-3xl font-bold text-dark">
                {coins.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earn Coins Button */}
      <div className="text-center mb-8">
        <Button
          id="earn-coins-btn"
          onClick={handleEarnCoins}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold text-xl px-16 py-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 w-full max-w-sm h-16"
        >
          <span className="mr-3">👆</span>
          Заработать монеты
        </Button>
        <p className="text-gray-500 text-sm mt-3">+1 монета за клик</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <span className="text-primary text-2xl mb-2 block">🖱️</span>
              <p className="text-gray-600 text-sm">Всего кликов</p>
              <p className="text-xl font-bold text-dark">{totalClicks.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <span className="text-green-600 text-2xl mb-2 block">📈</span>
              <p className="text-gray-600 text-sm">Доход/сек</p>
              <p className="text-xl font-bold text-dark">0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
