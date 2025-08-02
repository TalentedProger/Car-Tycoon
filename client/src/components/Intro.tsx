import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import carIntroImage from '@assets/Flux_Dev_a_lush_3d_render_of_Create_an_isolated_composition_of_3 (1)-Photoroom_1754120888358.png';

interface IntroProps {
  onComplete: (selectedCar?: any) => void;
}

// Car data for the wheel - 5 economy + 1 budget (Honda Accord 7)
const wheelCars = [
  // Economy cars (5 cars, 19% each = 95% total)
  { id: 'car-5', name: 'LADA GRANTA', price: 850000, brand: 'LADA', category: 'economy', chance: 0.19, horsepower: 87, acceleration: 11.2, maxSpeed: 167 },
  { id: 'car-6', name: 'RENAULT LOGAN', price: 950000, brand: 'Renault', category: 'economy', chance: 0.19, horsepower: 102, acceleration: 10.5, maxSpeed: 180 },
  { id: 'car-9', name: 'TOYOTA COROLLA', price: 1400000, brand: 'Toyota', category: 'economy', chance: 0.19, horsepower: 122, acceleration: 10.9, maxSpeed: 190 },
  { id: 'car-11', name: 'KIA RIO', price: 1100000, brand: 'Kia', category: 'economy', chance: 0.19, horsepower: 100, acceleration: 12.1, maxSpeed: 173 },
  { id: 'car-13', name: 'FORD FOCUS', price: 1300000, brand: 'Ford', category: 'economy', chance: 0.19, horsepower: 125, acceleration: 9.4, maxSpeed: 195 },
  // Budget car (1 car, 5% chance)
  { id: 'car-8', name: 'HONDA ACCORD 7', price: 1800000, brand: 'Honda', category: 'budget', chance: 0.05, horsepower: 156, acceleration: 8.7, maxSpeed: 210 },
];

// Available colors for each car
const carColors = {
  'car-5': ['#FFFFFF', '#000000', '#FF0000', '#0000FF'],
  'car-6': ['#FFFFFF', '#808080', '#FF0000', '#000000'],
  'car-9': ['#FFFFFF', '#000000', '#C0C0C0', '#FF0000'],
  'car-11': ['#FF0000', '#FFFFFF', '#000000', '#FFA500'],
  'car-13': ['#000000', '#FFFFFF', '#0000FF', '#808080'],
  'car-8': ['#000000', '#FFFFFF', '#C0C0C0', '#8B4513', '#FF0000', '#000080'],
};

// Game mechanics data
const gameMechanics = [
  {
    icon: '🛠',
    title: 'Улучшай детали',
    description: 'Прокачивай свой автомобиль по-настоящему: от замены тормозов и подвески до полной смены двигателя и установки турбины. Собери технику, которая будет не просто ехать, а летать.'
  },
  {
    icon: '🏁',
    title: 'Соревнуйся в гонках 1 на 1',
    description: 'Твой навык — твоя победа. Вступай в дуэли с другими игроками и докажи, что именно ты достоин быть первым. Выигрывай, зарабатывай, получай респект.'
  },
  {
    icon: '💸',
    title: 'Зарабатывай пассивно',
    description: 'Твоя машина может приносить прибыль даже когда ты не в игре. Улучшай автопарк, строй пассивный доход и получай стабильный заработок каждый день.'
  },
  {
    icon: '🚗',
    title: 'Продавай и покупай авто и номера',
    description: 'Торгуй на виртуальном рынке: ищи выгодные авто, продавай редкие номера, скупай редкие модели и собирай свою коллекцию. Каждый ход может стать инвестицией.'
  },
  {
    icon: '✨',
    title: 'Делай детейлинг',
    description: 'Не забывай о внешности: полировка, химчистка, пленка, уход за деталями — всё это влияет на статус и цену твоей машины. Пусть твой авто сияет даже в темноте.'
  }
];

type IntroState = 'welcome' | 'mechanics' | 'carIntro' | 'wheelSpin' | 'colorSelection' | 'celebration';

export default function Intro({ onComplete }: IntroProps) {
  const [state, setState] = useState<IntroState>('welcome');
  const [currentMechanic, setCurrentMechanic] = useState(0);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [showColorSelection, setShowColorSelection] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const introMusicRef = useRef<HTMLAudioElement>(null);

  // Start intro music on component mount
  useEffect(() => {
    const startIntroMusic = () => {
      try {
        if (introMusicRef.current) {
          introMusicRef.current.src = '/assets/sounds/intro_loop.mp3';
          introMusicRef.current.loop = true;
          introMusicRef.current.volume = 0.3;
          introMusicRef.current.play().catch(console.warn);
        }
      } catch (error) {
        console.warn('Intro music playback failed:', error);
      }
    };
    
    startIntroMusic();
    
    return () => {
      if (introMusicRef.current) {
        introMusicRef.current.pause();
      }
    };
  }, []);

  const playSound = (soundName: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.src = `/assets/sounds/${soundName}`;
        audioRef.current.play().catch(console.warn);
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('handleNext called, current state:', state, 'currentMechanic:', currentMechanic);
    
    if (state === 'welcome') {
      setState('mechanics');
      setCurrentMechanic(0);
    } else if (state === 'mechanics') {
      if (currentMechanic < gameMechanics.length - 1) {
        setCurrentMechanic(currentMechanic + 1);
      } else {
        setState('carIntro');
      }
    } else if (state === 'carIntro') {
      setTextVisible(false);
      setTimeout(() => {
        setState('wheelSpin');
        playSound('start.mp3');
      }, 500);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('handlePrevious called, current state:', state, 'currentMechanic:', currentMechanic);
    
    if (state === 'mechanics') {
      if (currentMechanic > 0) {
        setCurrentMechanic(currentMechanic - 1);
      } else {
        setState('welcome');
      }
    } else if (state === 'carIntro') {
      setState('mechanics');
      setCurrentMechanic(gameMechanics.length - 1);
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    playSound('engine_start.wav');
    
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
    const segmentAngle = 360 / wheelCars.length; // 60 degrees per segment
    
    // Calculate the target angle - we want to land in the CENTER of the segment
    // The pointer points to the TOP (0 degrees), so we need to calculate where the segment center should be
    // Segment 0 starts at 0°, segment 1 at 60°, etc.
    const segmentStartAngle = carIndex * segmentAngle;
    const segmentCenterAngle = segmentStartAngle + (segmentAngle / 2);
    
    // Since the pointer is at the top, we want the segment center to be at the top (0°)
    // So we need to rotate the wheel so that segmentCenterAngle becomes 0°
    const targetAngle = 360 - segmentCenterAngle;
    
    // Add multiple spins for effect
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const randomOffset = (Math.random() - 0.5) * 10; // Small random offset for realism
    const finalRotation = (spins * 360) + targetAngle + randomOffset;
    
    setWheelRotation(finalRotation);
    setSelectedCar(winner);
    
    // Play tick sound during spinning
    const tickInterval = setInterval(() => {
      playSound('tick.wav');
    }, 100);
    
    // After 10 seconds, show color selection
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setShowColorSelection(true);
      setTimeout(() => {
        setState('colorSelection');
      }, 1000);
    }, 10000);
  };

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
    setState('celebration');
    playSound('win.mp3');
    
    // Stop intro music
    if (introMusicRef.current) {
      introMusicRef.current.pause();
    }
  };

  const handleStartGame = () => {
    // Store selected car and color in localStorage
    if (selectedCar && selectedColor) {
      const carData = {
        ...selectedCar,
        color: selectedColor
      };
      localStorage.setItem('selectedStarterCar', JSON.stringify(carData));
    }
    onComplete(selectedCar);
  };

  // Welcome Screen
  if (state === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center z-10 max-w-4xl mx-auto animate-fade-in">
            <h1 
              className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 intro-title"
              style={{
                color: '#FFD700',
                textShadow: '0px 4px 12px rgba(255,255,255,0.15), 0 0 30px rgba(128, 0, 255, 0.4)',
              }}
            >
              Добро пожаловать в игру
            </h1>
            
            <p className="text-lg opacity-90 mb-12 leading-relaxed max-w-3xl mx-auto text-gray-300 intro-text">
              Ты оказался в мире, где каждая машина — это не просто транспорт, а путь к успеху. 
              Покупай, продавай, улучшай, соревнуйся и строй свою империю скорости. 
              Всё начинается прямо сейчас — с твоей первой машины.
            </p>
            
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-bold text-xl px-12 py-4 rounded-full shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 border-0 text-white intro-button"
            >
              Далее
            </Button>
          </div>
        </div>
        

        
        <audio ref={introMusicRef} preload="none" />
        <audio ref={audioRef} preload="none" />
      </div>
    );
  }

  // Mechanics Presentation Screen
  if (state === 'mechanics') {
    const mechanic = gameMechanics[currentMechanic];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="flex-1 flex items-center justify-center">
          <div key={currentMechanic} className="text-center z-10 max-w-3xl mx-auto animate-slide-in">
            <div className="text-8xl mb-6 animate-float">
              {mechanic.icon}
            </div>
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent intro-title">
              {mechanic.title}
            </h2>
            
            <p className="text-lg opacity-90 mb-12 leading-relaxed text-gray-300 intro-text">
              {mechanic.description}
            </p>
          </div>
        </div>
        
        {/* Navigation at bottom */}
        <div className="flex justify-center items-center space-x-4 mb-8 z-20 relative">
          <Button
            onClick={handlePrevious}
            className="text-lg px-8 py-3 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300 transform hover:scale-105 border-0 intro-button"
            style={{ 
              backgroundColor: '#FFD700',
              color: '#0C011C',
              width: '120px'
            }}
          >
            ← Назад
          </Button>
          
          <Button
            onClick={handleNext}
            className="font-bold text-lg px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300 border-0 cursor-pointer hover:opacity-90 animate-pulse-subtle intro-button"
            style={{ 
              backgroundColor: '#00FFFF',
              color: '#0C011C',
              boxShadow: '0px 0px 16px rgba(0,255,255,0.6)',
              width: '120px'
            }}
          >
            {currentMechanic === gameMechanics.length - 1 ? 'Продолжить' : 'Далее →'}
          </Button>
        </div>
        
        {/* Pagination circles at bottom */}
        <div className="flex justify-center space-x-2 pb-4 z-10 relative pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          {gameMechanics.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMechanic ? 'bg-cyan-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Car Selection Introduction Screen
  if (state === 'carIntro') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-between text-white p-6 relative overflow-hidden"
        style={{ backgroundColor: '#0C011C' }}
      >
        <div className={`text-center z-10 transition-all duration-500 pt-16 ${textVisible ? 'opacity-100' : 'opacity-0 transform translate-y-8'}`}>
          <h1 
            className="text-4xl font-bold mb-8 intro-title"
            style={{
              color: '#F5F5F5',
              textShadow: '0px 4px 12px rgba(255,255,255,0.15), 0 0 30px rgba(128, 0, 255, 0.4)',
            }}
          >
            Твоя первая машина уже ждёт тебя !
          </h1>
        </div>
        
        {/* Central image */}
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={carIntroImage} 
            alt="Car with neon effects" 
            className="max-w-lg max-h-96 object-contain transition-opacity duration-500"
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.8))',
              opacity: imageLoaded ? 1 : 0
            }}
            onLoad={() => setImageLoaded(true)}
            loading="eager"
          />
        </div>
        
        {/* Forward button at bottom - centered */}
        <div className="flex justify-center items-center mb-8 z-20 relative">
          <Button
            onClick={handleNext}
            className="font-bold text-xl px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 border-0 cursor-pointer hover:opacity-90 animate-pulse-subtle intro-button"
            style={{ 
              backgroundColor: '#00FFFF',
              color: '#0C011C',
              boxShadow: '0px 0px 16px rgba(0,255,255,0.6)'
            }}
          >
            Вперёд
          </Button>
        </div>
        
        {/* Pagination circles at bottom */}
        <div className="flex justify-center space-x-2 pb-4 z-10 relative pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>
    );
  }

  // Wheel Spin Screen
  if (state === 'wheelSpin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent intro-title">
            Колесо фортуны
          </h1>
          
          {/* Wheel */}
          <div className="relative mb-8">
            <div className="w-80 h-80 mx-auto relative">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
                <div className="w-0 h-0 animate-pulse-subtle" 
                     style={{ 
                       borderLeft: '6px solid transparent',
                       borderRight: '6px solid transparent',
                       borderBottom: '12px solid #00FFFF',
                       filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 16px rgba(34, 211, 238, 0.6))'
                     }} />
              </div>
              
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className={`w-full h-full rounded-full border-4 border-gray-300 relative transition-transform ${isSpinning ? '' : 'duration-300'} overflow-hidden`}
                style={{ 
                  transitionDuration: isSpinning ? '10s' : '300ms',
                  transform: `rotate(${wheelRotation}deg)`,
                  boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Background segments */}
                {wheelCars.map((car, index) => {
                  const angle = (360 / wheelCars.length) * index;
                  const segmentAngle = 360 / wheelCars.length;
                  
                  // Define segment colors
                  const segmentColors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF', '#44FFFF'];
                  const bgColor = segmentColors[index % segmentColors.length];
                  
                  return (
                    <div
                      key={`segment-${car.id}`}
                      className="absolute w-full h-full"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${bgColor} 0deg, ${bgColor} ${segmentAngle}deg, transparent ${segmentAngle}deg, transparent 360deg)`,
                        borderRadius: '50%'
                      }}
                    />
                  );
                })}
                
                {/* Segment borders */}
                {wheelCars.map((car, index) => {
                  const angle = (360 / wheelCars.length) * index;
                  const radians = (angle * Math.PI) / 180;
                  
                  return (
                    <div
                      key={`border-${car.id}`}
                      className="absolute bg-white"
                      style={{
                        width: '2px',
                        height: '50%',
                        left: '50%',
                        top: '0%',
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${angle}deg)`
                      }}
                    />
                  );
                })}
                
                {/* Car information */}
                {wheelCars.map((car, index) => {
                  const angle = (360 / wheelCars.length) * index;
                  const segmentAngle = 360 / wheelCars.length;
                  // Calculate center position of each segment - moved closer to center
                  const radius = 85; // Distance from center to content
                  const centerAngle = angle + (segmentAngle / 2);
                  const radians = (centerAngle * Math.PI) / 180;
                  const x = Math.cos(radians) * radius;
                  const y = Math.sin(radians) * radius;
                  
                  return (
                    <div
                      key={`content-${car.id}`}
                      className="text-white text-center absolute flex flex-col items-center justify-center" 
                      style={{ 
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: `translate(-50%, -50%)`,
                        zIndex: 10, 
                        width: '70px',
                        height: '60px'
                      }}
                    >
                      <div className="font-bold mb-1 leading-tight intro-text" style={{ 
                        fontSize: '9px',
                        lineHeight: '10px',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }}>{car.name}</div>
                      <div className="font-bold mb-1 intro-text" style={{ 
                        fontSize: '8px',
                        lineHeight: '9px',
                        textAlign: 'center',
                        color: '#000000',
                        textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                      }}>{(car.price / 1000000).toFixed(1)}M ₽</div>
                      <div className="text-lg" style={{ 
                        fontSize: '14px'
                      }}>
                        🚗
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
            className="font-bold text-xl px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed intro-button"
            style={{
              backgroundColor: '#4A90E2',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {isSpinning ? 'Крутится...' : 'Запустить'}
          </Button>
        </div>
        
        {/* Pagination circles at bottom */}
        <div className="flex justify-center space-x-2 pb-4">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>
    );
  }

  // Color Selection Screen
  if (state === 'colorSelection' && selectedCar) {
    const availableColors = carColors[selectedCar.id as keyof typeof carColors] || ['#FFFFFF', '#000000'];
    
    return (
      <div 
        className="min-h-screen flex flex-col text-white p-6 relative overflow-hidden"
        style={{ backgroundColor: '#0C011C' }}
      >
        {/* Top section - Car name and price */}
        <div className="text-center pt-8 pb-6">
          <h1 className="text-2xl font-bold mb-2 intro-title" style={{ color: '#F5F5F5', fontSize: '24px' }}>
            {selectedCar.name}
          </h1>
          <p className="text-base font-medium intro-text" style={{ color: '#C0C0C0', fontSize: '16px' }}>
            {selectedCar.price.toLocaleString()} ₽
          </p>
        </div>

        {/* Car image block */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Car preview with selected color and shadow */}
          <div className="relative mb-8">
            <div 
              className="text-8xl transition-all duration-300 relative z-10"
              style={{ 
                filter: selectedColor ? `hue-rotate(${
                  selectedColor === '#FF0000' ? '0deg' : 
                  selectedColor === '#0000FF' ? '240deg' : 
                  selectedColor === '#000000' ? '0deg' : 
                  selectedColor === '#FFFFFF' ? '0deg' :
                  selectedColor === '#808080' ? '0deg' :
                  selectedColor === '#C0C0C0' ? '0deg' :
                  selectedColor === '#FFA500' ? '30deg' :
                  selectedColor === '#8B4513' ? '20deg' :
                  selectedColor === '#000080' ? '240deg' :
                  '120deg'
                })` : 'none' 
              }}
            >
              🚗
            </div>
            {/* Soft shadow/ellipse under the car */}
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-32 h-8 rounded-full opacity-30"
              style={{ backgroundColor: '#000000', filter: 'blur(8px)' }}
            />
          </div>

          {/* Car characteristics */}
          <div className="w-full max-w-sm mb-8">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text">Мощность</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.horsepower}</div>
                <div className="text-xs text-gray-400 intro-text">л.с.</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text">0-100 км/ч</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.acceleration}</div>
                <div className="text-xs text-gray-400 intro-text">сек</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text">Макс. скорость</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.maxSpeed}</div>
                <div className="text-xs text-gray-400 intro-text">км/ч</div>
              </div>
            </div>
          </div>

          {/* Color selection block */}
          <div className="w-full max-w-sm mb-8">
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2">
              {availableColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorSelection(color)}
                  className={`w-10 h-10 rounded-sm border-2 transition-all duration-300 transform hover:scale-110 flex-shrink-0 ${
                    selectedColor === color ? 'scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: color, 
                    borderColor: selectedColor === color ? '#00FFFF' : 'rgba(255,255,255,0.3)',
                    boxShadow: selectedColor === color ? '0 0 10px rgba(0,255,255,0.6)' : '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <Button
            onClick={() => {
              if (selectedColor) {
                // Save selected color to the car object
                setSelectedCar({ ...selectedCar, color: selectedColor });
                setState('celebration');
              }
            }}
            disabled={!selectedColor}
            className="font-bold text-lg rounded-3xl transition-all duration-300 transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed intro-button"
            style={{ 
              backgroundColor: selectedColor ? '#00FFFF' : '#666666',
              color: '#0C011C',
              minWidth: '220px',
              height: '48px',
              boxShadow: selectedColor ? '0px 0px 14px rgba(0,255,255,0.5)' : 'none'
            }}
          >
            Подтвердить выбор
          </Button>
        </div>

        {/* Pagination circles at bottom */}
        <div className="flex justify-center space-x-2 pb-4 z-10 relative pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>
    );
  }

  // Celebration Screen
  if (state === 'celebration' && selectedCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon fireworks */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-firework"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center z-10 max-w-md mx-auto animate-celebration">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent intro-title">
              Поздравляем! 🎆
            </h1>
            
            {/* Car driving out animation */}
            <div className="mb-6">
              <div className="text-8xl animate-drive-in" style={{ 
                filter: selectedCar.color ? `hue-rotate(${
                  selectedCar.color === '#FF0000' ? '0deg' : 
                  selectedCar.color === '#0000FF' ? '240deg' : 
                  selectedCar.color === '#000000' ? '0deg' : 
                  selectedCar.color === '#FFFFFF' ? '0deg' :
                  selectedCar.color === '#808080' ? '0deg' :
                  selectedCar.color === '#C0C0C0' ? '0deg' :
                  selectedCar.color === '#FFA500' ? '30deg' :
                  selectedCar.color === '#8B4513' ? '20deg' :
                  selectedCar.color === '#000080' ? '240deg' :
                  '120deg'
                })` : 'none' 
              }}>
                🚗
              </div>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30">
              <h2 className="text-xl font-bold mb-2 text-yellow-400 intro-title">{selectedCar.name}</h2>
              <p className="text-sm text-gray-300 mb-1 intro-text">Стоимость: {selectedCar.price.toLocaleString()} ₽</p>
              <p className="text-sm text-gray-400 intro-text">Цвет: {
                selectedCar.color === '#FFFFFF' ? 'Белый' : 
                selectedCar.color === '#000000' ? 'Чёрный' : 
                selectedCar.color === '#FF0000' ? 'Красный' : 
                selectedCar.color === '#0000FF' ? 'Синий' : 
                selectedCar.color === '#808080' ? 'Серый' :
                selectedCar.color === '#C0C0C0' ? 'Серебристый' :
                selectedCar.color === '#FFA500' ? 'Оранжевый' :
                selectedCar.color === '#8B4513' ? 'Коричневый' :
                selectedCar.color === '#000080' ? 'Тёмно-синий' :
                'Особый'
              }</p>
            </div>
            
            <Button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold text-xl px-12 py-4 rounded-full shadow-xl shadow-green-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-white animate-pulse-green intro-button"
            >
              В путь!
            </Button>
          </div>
        </div>
        
        {/* Pagination circles at bottom */}
        <div className="flex justify-center space-x-2 pb-4">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>
    );
  }

  return null;
}