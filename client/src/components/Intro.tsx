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

  // Auto-advance screens
  useEffect(() => {
    if (state === 'screen1' || state === 'screen2') {
      const timer = setTimeout(() => {
        if (state === 'screen1') setState('screen2');
        else if (state === 'screen2') setState('screen3');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

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
      subtitle: 'Добро пожаловать в мир автомобильного бизнеса! Здесь вы сможете построить свою автомобильную империю, начиная с простого кликера и развиваясь до владельца роскошного автопарка. Покупайте машины, улучшайте их, зарабатывайте деньги и становитесь настоящим автомобильным магнатом.',
      icon: '🚗',
    },
    {
      title: 'Развивайте бизнес',
      subtitle: 'В Auto Arena вас ждет увлекательный процесс развития. Кликайте, чтобы зарабатывать монеты, покупайте новые автомобили из разных категорий - от эконом-класса до люксовых суперкаров. Каждая машина приносит пассивный доход, а улучшения увеличивают прибыль в разы.',
      icon: '💰',
    },
    {
      title: 'Станьте магнатом',
      subtitle: 'Управляйте своим гаражом, улучшайте автомобили в автосалоне, заказывайте детейлинг услуги и следите за достижениями. Откройте для себя мир возможностей и постройте автомобильную империю своей мечты!',
      icon: '🏆',
    },
  ];

  if (state === 'screen1' || state === 'screen2' || state === 'screen3') {
    const screenIndex = state === 'screen1' ? 0 : state === 'screen2' ? 1 : 2;
    const screen = screens[screenIndex];
    
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6 cursor-pointer relative overflow-hidden"
        onClick={handleNext}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-12">
            <div className="text-8xl mb-6 animate-bounce-slow text-blue-400">
              {screen.icon}
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            {screen.title}
          </h1>
          
          <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-3xl mx-auto text-gray-300">
            {screen.subtitle}
          </p>
          
          {state === 'screen3' && (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold text-xl px-16 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white"
            >
              Продолжить
            </Button>
          )}
          
          <div className="flex justify-center space-x-3 mt-12">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  num === screenIndex + 1 ? 'bg-blue-400 scale-125' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'carSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        
        <div className={`text-center z-10 transition-all duration-500 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
            А теперь давайте узнаем на какой машине вам предстоит начать свой путь
          </h1>
          
          <Button
            onClick={handleForward}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold text-2xl px-20 py-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-0 text-white animate-pulse"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Колесо фортуны
          </h1>
          
          {/* Wheel */}
          <div className="relative mb-12">
            <div className="w-96 h-96 mx-auto relative">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400" />
              </div>
              
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className={`w-full h-full rounded-full border-8 border-yellow-400 relative transition-transform ${isSpinning ? 'duration-[10s] ease-out' : 'duration-300'}`}
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                {wheelCars.map((car, index) => {
                  const angle = (360 / wheelCars.length) * index;
                  const hue = (360 / wheelCars.length) * index;
                  
                  return (
                    <div
                      key={car.id}
                      className="absolute w-full h-full"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div 
                        className="absolute top-0 left-1/2 w-32 h-48 transform -translate-x-1/2 flex flex-col items-center justify-start pt-4"
                        style={{ 
                          background: `linear-gradient(180deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 70%, 30%) 100%)`,
                          clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
                        }}
                      >
                        <div className="text-white text-center px-2" style={{ transform: `rotate(-${angle}deg)` }}>
                          <div className="text-xs font-bold mb-1">{car.name}</div>
                          <div className="text-xs mb-1">{(car.price / 1000000).toFixed(1)}M ₽</div>
                          <div className="text-lg">
                            {/* Placeholder for brand logo */}
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
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold text-2xl px-16 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? 'Крутится...' : 'Запустить'}
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'celebration' && selectedCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Fireworks animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center z-10 animate-fade-in">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Поздравляем!
          </h1>
          
          <div className="mb-8">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-blue-400/30">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">{selectedCar.name}</h2>
            <p className="text-xl text-gray-300 mb-2">Стоимость: {selectedCar.price.toLocaleString()} ₽</p>
            <p className="text-lg text-gray-400">Категория: {selectedCar.category === 'economy' ? 'Эконом' : 'Бюджет'}</p>
          </div>
          
          {/* Car animation placeholder */}
          <div className="mb-8">
            <div className="text-8xl animate-slide-in-right">🚗</div>
          </div>
          
          <Button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold text-2xl px-20 py-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-white"
          >
            В путь
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
