import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface IntroProps {
  onComplete: (selectedCar?: any) => void;
}

// Car data for the wheel
const wheelCars = [
  // Economy cars (5 cars, 70% total chance)
  { id: 'car-5', name: 'LADA Granta', price: 850000, brand: 'LADA', category: 'economy', chance: 0.20 },
  { id: 'car-6', name: 'Renault Logan', price: 950000, brand: 'Renault', category: 'economy', chance: 0.15 },
  { id: 'car-9', name: 'Toyota Corolla', price: 1400000, brand: 'Toyota', category: 'economy', chance: 0.15 },
  { id: 'car-11', name: 'Kia Rio', price: 1100000, brand: 'Kia', category: 'economy', chance: 0.12 },
  { id: 'car-13', name: 'Ford Focus', price: 1300000, brand: 'Ford', category: 'economy', chance: 0.08 },
  // Budget car (1 car, 30% chance)
  { id: 'car-8', name: 'Honda Accord 7', price: 1800000, brand: 'Honda', category: 'budget', chance: 0.30 },
];

type IntroState = 'screen1' | 'screen2' | 'screen3' | 'carSelection' | 'wheelSpin' | 'celebration';

export default function Intro({ onComplete }: IntroProps) {
  const [state, setState] = useState<IntroState>('screen1');
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Remove auto-advance - only manual navigation

  const playSound = (soundName: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.src = `/sounds/${soundName}.mp3`;
        audioRef.current.play().catch(console.warn);
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  const handleNext = () => {
    if (state === 'screen1') setState('screen2');
    else if (state === 'screen2') setState('screen3');
    else if (state === 'screen3') {
      setState('carSelection');
    }
  };

  const handleForward = () => {
    setTextVisible(false);
    setTimeout(() => {
      setState('wheelSpin');
      playSound('engine-ignition');
    }, 500);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Select random car based on chances
    const random = Math.random();
    let cumulativeChance = 0;
    let winner = wheelCars[0];
    
    for (const car of wheelCars) {
      cumulativeChance += car.chance;
      if (random <= cumulativeChance) {
        winner = car;
        break;
      }
    }
    
    // Calculate rotation to land on winner
    const carIndex = wheelCars.findIndex(car => car.id === winner.id);
    const segmentAngle = 360 / wheelCars.length;
    const targetAngle = (carIndex * segmentAngle) + (segmentAngle / 2);
    const spins = 5; // Number of full rotations
    const finalRotation = (spins * 360) + (360 - targetAngle);
    
    setWheelRotation(finalRotation);
    setSelectedCar(winner);
    
    // After 10 seconds, show celebration
    setTimeout(() => {
      setIsSpinning(false);
      setState('celebration');
      playSound('celebration');
    }, 10000);
  };

  const handleStartGame = () => {
    // Store selected car in localStorage for the game to use
    if (selectedCar) {
      localStorage.setItem('selectedStarterCar', JSON.stringify(selectedCar));
    }
    onComplete(selectedCar);
  };

  const screens = [
    {
      title: 'Auto Arena',
      subtitle: 'Добро пожаловать в мир автомобильного бизнеса! Здесь вы сможете построить свою автомобильную империю, начиная с простого кликера и развиваясь до владельца роскошного автопарка. Покупайте машины, улучшайте их, зарабатывайте деньги и становитесь настоящим автомобильным магнатом. Исследуйте различные категории автомобилей от бюджетных до премиальных, каждая из которых откроет новые возможности для роста вашего бизнеса.',
      icon: '🚗',
    },
    {
      title: 'Развивайте бизнес',
      subtitle: 'В Auto Arena вас ждет увлекательный процесс развития. Кликайте, чтобы зарабатывать монеты, покупайте новые автомобили из разных категорий - от эконом-класса до люксовых суперкаров. Каждая машина приносит пассивный доход, а улучшения увеличивают прибыль в разы. Используйте систему бустов для ускорения прогресса, собирайте ежедневные награды и прокачивайте свой уровень для разблокировки новых возможностей.',
      icon: '💰',
    },
    {
      title: 'Станьте магнатом',
      subtitle: 'Управляйте своим гаражом, улучшайте автомобили в автосалоне, заказывайте детейлинг услуги и следите за достижениями. Откройте для себя мир возможностей и постройте автомобильную империю своей мечты! Участвуйте в специальных событиях, достигайте новых рекордов и станьте настоящим автомобильным магнатом в этой захватывающей игре.',
      icon: '🏆',
    },
  ];

  if (state === 'screen1' || state === 'screen2' || state === 'screen3') {
    const screenIndex = state === 'screen1' ? 0 : state === 'screen2' ? 1 : 2;
    const screen = screens[screenIndex];
    
    return (
      <div className="min-h-screen intro-gradient-bg flex flex-col items-center justify-between text-white p-4 relative overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-3xl mx-auto">
          {/* Compact icon */}
          <div className="text-4xl mb-4 animate-bounce-gentle">
            {screen.icon}
          </div>
          
          {/* Compact title */}
          <h1 className="text-3xl font-bold mb-4 intro-title text-center">
            {screen.title}
          </h1>
          
          {/* Extended description with proper spacing */}
          <p className="text-sm opacity-90 mb-6 leading-relaxed text-center text-gray-200 px-2">
            {screen.subtitle}
          </p>
        </div>
        
        {/* Bottom navigation */}
        <div className="w-full flex flex-col items-center space-y-4">
          {/* Continue button for last screen */}
          {state === 'screen3' && (
            <Button
              onClick={handleNext}
              className="intro-compact-button font-semibold text-lg px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 border-0 text-white"
            >
              Продолжить
            </Button>
          )}
          
          {/* Manual navigation */}
          <div className="flex items-center space-x-6">
            {/* Previous button */}
            {screenIndex > 0 && (
              <Button
                onClick={() => {
                  if (state === 'screen2') setState('screen1');
                  else if (state === 'screen3') setState('screen2');
                }}
                variant="ghost"
                className="text-white/70 hover:text-white text-sm px-4 py-2"
              >
                ← Назад
              </Button>
            )}
            
            {/* Page indicators */}
            <div className="flex space-x-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    num === screenIndex + 1 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            {/* Next button */}
            {screenIndex < 2 && (
              <Button
                onClick={handleNext}
                variant="ghost"
                className="text-white/70 hover:text-white text-sm px-4 py-2"
              >
                Далее →
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'carSelection') {
    return (
      <div className="min-h-screen intro-gradient-bg flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <div className={`text-center z-10 transition-all duration-500 max-w-3xl mx-auto ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-2xl font-bold mb-6 intro-title animate-fade-in text-center px-2">
            А теперь давайте узнаем на какой машине вам предстоит начать свой путь
          </h1>
          
          <Button
            onClick={handleForward}
            className="intro-compact-button font-semibold text-lg px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 border-0 text-white"
          >
            Вперед
          </Button>
        </div>
        
        <audio ref={audioRef} preload="none" />
      </div>
    );
  }

  if (state === 'wheelSpin') {
    return (
      <div className="min-h-screen intro-gradient-bg flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="text-center z-10 max-w-sm mx-auto">
          <h1 className="text-2xl font-bold mb-6 intro-title">
            Колесо фортуны
          </h1>
          
          {/* Compact Wheel */}
          <div className="relative mb-6">
            <div className="w-64 h-64 mx-auto relative">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
                <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-yellow-400" />
              </div>
              
              {/* Wheel - fully filled circle */}
              <div 
                ref={wheelRef}
                className={`wheel-container w-full h-full relative transition-transform ${isSpinning ? 'duration-[10s] ease-out' : 'duration-300'}`}
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                {wheelCars.map((car, index) => {
                  const angle = (360 / wheelCars.length) * index;
                  const segmentAngle = 360 / wheelCars.length;
                  
                  return (
                    <div
                      key={car.id}
                      className="absolute w-full h-full"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div 
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 wheel-segment"
                        style={{ 
                          width: `${100 / wheelCars.length}%`,
                          height: '50%',
                          transformOrigin: 'bottom center',
                          clipPath: `polygon(${50 - (segmentAngle / 7.2)}% 0%, ${50 + (segmentAngle / 7.2)}% 0%, 50% 100%)`
                        }}
                      >
                        <div className="text-white text-center pt-2 px-1 z-10" style={{ transform: `rotate(-${angle}deg)`, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          <div className="text-xs font-bold mb-1 leading-tight drop-shadow-lg">{car.name}</div>
                          <div className="text-xs mb-1 drop-shadow-lg">{(car.price / 1000000).toFixed(1)}M ₽</div>
                          <div className="text-sm drop-shadow-lg">
                            {/* Placeholder for brand logo - will use logotype.png from assets */}
                            🚗
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`launch-button-pulsing font-semibold text-lg px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 border-0 text-white disabled:opacity-50 disabled:cursor-not-allowed ${!isSpinning ? 'hover:scale-105' : ''}`}
          >
            {isSpinning ? 'Крутится...' : 'Запустить'}
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'celebration' && selectedCar) {
    return (
      <div className="min-h-screen intro-gradient-bg flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        {/* Compact Fireworks animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-fireworks"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10 animate-fade-in max-w-sm mx-auto">
          <h1 className="text-3xl font-bold mb-4 intro-title flex items-center justify-center gap-2">
            Поздравляем! <span className="animate-bounce-gentle">🎉</span>
          </h1>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
            <h2 className="text-lg font-bold mb-2 text-white">{selectedCar.name}</h2>
            <p className="text-sm text-gray-300 mb-1">Стоимость: {selectedCar.price.toLocaleString()} ₽</p>
            <p className="text-sm text-gray-400">Категория: {selectedCar.category === 'economy' ? 'Эконом' : 'Бюджет'}</p>
          </div>
          
          {/* Car animation placeholder */}
          <div className="mb-6">
            <div className="text-4xl animate-slide-in-right">🚗</div>
          </div>
          
          <Button
            onClick={handleStartGame}
            className="launch-button-pulsing font-semibold text-lg px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 border-0 text-white hover:scale-105"
          >
            В путь
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
