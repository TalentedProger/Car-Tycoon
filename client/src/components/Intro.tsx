import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [currentScreen, setCurrentScreen] = useState(1);

  useEffect(() => {
    // Auto-advance intro screens every 3 seconds, except the last one
    if (currentScreen < 3) {
      const timer = setTimeout(() => {
        setCurrentScreen(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleScreenClick = () => {
    if (currentScreen < 3) {
      setCurrentScreen(prev => prev + 1);
    }
  };

  const handleStartGame = () => {
    onComplete();
  };

  const screens = [
    {
      bg: 'bg-gradient-to-br from-primary to-blue-600',
      icon: '🚗',
      title: 'Auto Arena',
      subtitle: 'Собери автоимперию!',
      iconClass: 'text-8xl mb-4 text-yellow-300',
    },
    {
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: '🔧🚙💰',
      title: 'Покупай, улучшай машины',
      subtitle: 'зарабатывай!',
      iconClass: 'text-6xl mb-4',
    },
    {
      bg: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: '🏆',
      title: 'Готов начать путь?',
      subtitle: 'Стань автомобильным магнатом!',
      iconClass: 'text-8xl mb-4 text-yellow-300',
    },
  ];

  const currentScreenData = screens[currentScreen - 1];

  return (
    <div 
      className={`min-h-screen ${currentScreenData.bg} flex flex-col items-center justify-center text-white p-6 animate-fade-in cursor-pointer`}
      onClick={handleScreenClick}
    >
      <div className="text-center">
        <div className="mb-8">
          <div className={currentScreenData.iconClass}>
            {currentScreenData.icon}
          </div>
        </div>
        
        <h1 className={currentScreen === 1 ? 'text-5xl font-bold mb-4' : 'text-4xl font-bold mb-4'}>
          {currentScreenData.title}
        </h1>
        
        <p className={currentScreen === 1 ? 'text-xl opacity-90 mb-8' : 'text-2xl opacity-90 mb-8'}>
          {currentScreenData.subtitle}
        </p>
        
        {currentScreen === 3 && (
          <Button
            onClick={handleStartGame}
            className="bg-white text-green-600 hover:bg-gray-100 font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-8"
          >
            Начать
          </Button>
        )}
        
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-3 h-3 rounded-full ${
                num === currentScreen ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
