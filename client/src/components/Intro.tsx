import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import carIntroImage from '@assets/Flux_Dev_a_lush_3d_render_of_Create_an_isolated_composition_of_3 (1)-Photoroom_1754120888358.png';

interface IntroProps {
  onComplete: (selectedCar?: any) => void;
}

// Car data for the wheel - Real cars from AutoSalon
const wheelCars = [
  // Economy cars (4 cars, ~20% each)
  { id: 'car-1', name: 'ВАЗ 2107', price: 85000, brand: 'ВАЗ', category: 'economy', chance: 0.2, horsepower: 75, acceleration: 14.0, maxSpeed: 155 },
  { id: 'car-2', name: 'ВАЗ 2110', price: 125000, brand: 'ВАЗ', category: 'economy', chance: 0.2, horsepower: 82, acceleration: 13.2, maxSpeed: 170 },
  { id: 'car-3', name: 'Audi 100', price: 140000, brand: 'Audi', category: 'economy', chance: 0.2, horsepower: 115, acceleration: 11.5, maxSpeed: 195 },
  { id: 'car-4', name: 'Hyundai Sonata IV', price: 135000, brand: 'Hyundai', category: 'economy', chance: 0.2, horsepower: 136, acceleration: 12.0, maxSpeed: 185 },
  // Budget car (1 car, 15% chance)
  { id: 'car-8', name: 'Honda Accord 7', price: 750000, brand: 'Honda', category: 'budget', chance: 0.15, horsepower: 156, acceleration: 9.5, maxSpeed: 205 },
  // Standard car (1 car, 5% chance)
  { id: 'car-9', name: 'Toyota Corolla', price: 575000, brand: 'Toyota', category: 'standard', chance: 0.05, horsepower: 132, acceleration: 10.2, maxSpeed: 195 },
];

// Standard 5-color palette for all cars
const standardColors = ['#FFFFFF', '#000000', '#0000FF', '#FF0000', '#808080']; // Белый, Чёрный, Синий, Красный, Серый

// Available colors for each car - all cars get the standard palette
const carColors = {
  'car-1': standardColors, // ВАЗ 2107
  'car-2': standardColors, // ВАЗ 2110
  'car-3': standardColors, // Audi 100
  'car-4': standardColors, // Hyundai Sonata IV
  'car-8': standardColors, // Honda Accord 7
  'car-9': standardColors, // Toyota Corolla
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
  
  // Case opening hooks - moved to top level to avoid conditional hooks
  const [casePhase, setCasePhase] = useState<'closed' | 'opening' | 'scrolling' | 'result'>('closed');
  const [isScrolling, setIsScrolling] = useState(false);
  const [cardScrollPosition, setCardScrollPosition] = useState(0);
  const [finalWinningCar, setFinalWinningCar] = useState<typeof wheelCars[0] | null>(null);
  
  // Generate truly random card list with no adjacent duplicates
  const generateRandomScrollCards = () => {
    const cards = [];
    const totalCards = 51; // Odd number to have clear center
    
    for (let i = 0; i < totalCards; i++) {
      let randomCar;
      let attempts = 0;
      
      do {
        randomCar = wheelCars[Math.floor(Math.random() * wheelCars.length)];
        attempts++;
        
        // If we've tried too many times, just use any car to avoid infinite loop
        if (attempts > 20) {
          break;
        }
      } while (
        // Check if previous card is the same (avoid adjacent duplicates)
        (i > 0 && cards[i - 1].name === randomCar.name) ||
        // Check if next planned position would create duplicate (for index 0, check index 1)
        (i === 0 && i + 1 < totalCards && Math.random() < 0.3 && cards.length > 0) // Small chance to add extra randomness
      );
      
      cards.push({ ...randomCar, id: `scroll-${i}` });
    }
    
    return cards;
  };
  
  const [scrollCards, setScrollCards] = useState(() => generateRandomScrollCards());
  
  // Format price properly - under 1M show as thousands
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ₽`;
    } else {
      return `${Math.round(price / 1000)} тыс. ₽`;
    }
  };
  
  // Determine winning car based on final arrow position
  const determineWinnerByPosition = (scrollPosition: number) => {
    const cardWidth = 160; // 144px + 16px margin
    const containerWidth = 1024; // max-w-4xl container
    const centerPosition = containerWidth / 2;
    
    // Calculate which card index is at the center
    const relativePosition = -scrollPosition + centerPosition;
    const cardIndex = Math.round(relativePosition / cardWidth);
    
    // Ensure index is within bounds
    const clampedIndex = Math.max(0, Math.min(cardIndex, scrollCards.length - 1));
    
    return scrollCards[clampedIndex];
  };
  
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
    // Don't auto-proceed, just set the selected color for radio button behavior
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
      <div className="min-h-screen hero-gradient-bg animate-gradient-flow flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center z-10 max-w-4xl mx-auto animate-fade-in">
            {/* Первый текстовый блок вверху */}
            <p 
              className="text-2xl font-bold mb-6 leading-tight intro-text"
              style={{
                color: '#FFD700',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15)',
              }}
            >
              Ты оказался в мире, где каждая машина — это не просто транспорт, а путь к успеху
            </p>
            
            {/* Фото машины в центре */}
            <div className="mb-6 h-80 flex items-center justify-center">
              <img 
                src="/attached_assets/Flux_Dev_a_lush_3d_render_of_A_futuristic_sports_car_rendered__3-Photoroom-min_1754136948792.png"
                alt="Futuristic Sports Car"
                className="max-w-lg max-h-80 mx-auto object-contain transition-opacity duration-300"
                style={{ 
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 20, 147, 0.6)) drop-shadow(0 0 60px rgba(138, 43, 226, 0.4))',
                  opacity: 1,
                  minHeight: '200px',
                }}
                onError={(e) => {
                  console.error('Image failed to load:', (e.target as HTMLImageElement).src);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully')}
                loading="eager"
                decoding="sync"
              />
            </div>
            
            {/* Второй текстовый блок внизу */}
            <p className="text-lg opacity-90 leading-snug max-w-3xl mx-auto text-gray-300 intro-text">
              Покупай, продавай, улучшай, соревнуйся и строй свою империю скорости. 
              Всё начинается прямо сейчас — с твоей первой машины.
            </p>
          </div>
        </div>
        
        {/* Кнопка внизу экрана */}
        <div className="mb-8 z-20 relative">
          <Button
            onClick={handleNext}
            className="font-bold text-xl px-16 py-6 rounded-full border-0 text-white intro-button animate-pulse-subtle"
            style={{
              background: '#00FFFF',
              color: '#0C011C',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          >
            Далее
          </Button>
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
      <div className="min-h-screen hero-gradient-bg animate-gradient-flow flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
        {/* Neon glow effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="flex-1 flex items-center justify-center">
          <div key={currentMechanic} className="text-center z-10 max-w-3xl mx-auto animate-slide-in">
            <div className="text-8xl mb-6 animate-float">
              {mechanic.icon}
            </div>
            
            <h2 
              className="text-4xl font-bold mb-6 intro-title"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)',
              }}
            >
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
            className="text-4xl font-bold mb-8 hero-title-montserrat intro-title"
            style={{
              color: '#F5F5F5',
              textShadow: '0px 4px 12px rgba(255, 105, 180, 0.25), 0 0 30px rgba(255, 105, 180, 0.5)',
            }}
          >
            Твоя первая машина уже ждёт тебя !
          </h1>
        </div>
        
        {/* Central image */}
        <div className="flex-1 flex items-start justify-center pb-8">
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
        <div className="flex justify-center items-center mb-16 z-20 relative">
          <Button
            onClick={handleNext}
            className="font-bold text-xl px-12 py-4 rounded-full transform hover:scale-110 transition-all duration-300 border-0 cursor-pointer hover:opacity-90 animate-pulse-subtle intro-button"
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

  // Case Opening Screen - CS2 Style
  if (state === 'wheelSpin') {
    // Play sound function
    const playSound = (soundPath: string, volume: number = 0.5) => {
      try {
        const audio = new Audio(soundPath);
        audio.volume = volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (e) {
        console.log('Audio not available:', e);
      }
    };

    const handleOpenCase = () => {
      // Reset for new opening and regenerate cards
      setCardScrollPosition(0);
      setFinalWinningCar(null);
      setScrollCards(generateRandomScrollCards());
      
      playSound('/sounds/case/button_click.mp3', 0.3);
      setTimeout(() => {
        playSound('/sounds/case/case_lock_click.mp3', 0.4);
        setCasePhase('opening');
        
        setTimeout(() => {
          playSound('/sounds/case/case_opening.mp3', 0.5);
          setCasePhase('scrolling');
          setIsScrolling(true);
          
          // Start scrolling animation
          setTimeout(() => {
            playSound('/sounds/case/cards_scroll.mp3', 0.2);
            
            // Calculate exact position to center the winning card
            // Each card is w-36 (144px) + mx-2 (8px each side) = 160px total
            const cardWidth = 160; // 144px + 16px margin  
            // Remove centerIndex - we'll calculate random position
            const containerWidth = 1024; // max-w-4xl container
            
            // Position to center the winning card in the container
            const maxScroll = (scrollCards.length - 3) * cardWidth; // Leave some cards visible
            const minScroll = -cardWidth * 2; // Don't scroll too far left
            
            // Generate truly random scroll position
            const randomScrollPosition = -(Math.random() * (maxScroll - minScroll) + minScroll);
            
            console.log('🎲 Random scroll position:', randomScrollPosition);
            
            setCardScrollPosition(randomScrollPosition);
            
            setTimeout(() => {
              setIsScrolling(false);
              playSound('/sounds/case/scroll_stop.mp3', 0.4);
              setCasePhase('result');
              
              // Log for debugging - verify the winning card is in center
              // NOW determine the winner based on where the arrow points
              const winner = determineWinnerByPosition(randomScrollPosition);
              setFinalWinningCar(winner);
              
              console.log('🎯 Winner determined by arrow position:', winner.name, 'Price:', winner.price);
              
              setTimeout(() => {
                playSound('/sounds/case/win_sound.mp3', 0.6);
              }, 500);
            }, 3000); // 3 seconds scrolling
          }, 500);
        }, 800);
      }, 150);
    };

    const handleTakeReward = () => {
      if (finalWinningCar) {
        setSelectedCar(finalWinningCar);
        setState('colorSelection');
      }
    };

    // Get rarity color for car based on price
    const getRarityColor = (price: number) => {
      if (price >= 1500000) return { color: '#FFD700', name: 'Legendary' }; // Gold
      if (price >= 1200000) return { color: '#8A2BE2', name: 'Epic' }; // Purple  
      if (price >= 1000000) return { color: '#00BFFF', name: 'Rare' }; // Blue
      return { color: '#808080', name: 'Common' }; // Gray
    };

    return (
      <div className="min-h-screen flex flex-col text-white relative overflow-hidden"
           style={{ 
             background: 'radial-gradient(circle at center, #2D1B69 0%, #1a0d3d 50%, #0a0520 100%)'
           }}>
        
        {/* Animated neon background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.6,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
        
        {/* Neon lines background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent" />
          <div className="absolute left-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
          <div className="absolute right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent" />
        </div>

        {/* Phase 1: Closed Case */}
        {casePhase === 'closed' && (
          <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
            {/* 3D Case */}
            <div className="relative mb-12">
              <img 
                src="/attached_assets/Leonardo_Phoenix_10_A_vibrant_cartoonstyle_3D_render_of_a_clos_3-Photoroom (1)_1754150180830.png"
                alt="AUTO ARENA Case"
                className="w-80 h-80 object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 60px rgba(255, 0, 255, 0.3))',
                  animation: 'breathing 3s ease-in-out infinite'
                }}
              />
              
              {/* Neon glow around case */}
              <div className="absolute inset-0 rounded-2xl opacity-50"
                   style={{
                     background: 'conic-gradient(from 0deg, #00FFFF, #FF00FF, #FFFF00, #00FF00, #00FFFF)',
                     filter: 'blur(20px)',
                     transform: 'scale(1.1)',
                     zIndex: -1
                   }} />
            </div>
            
            {/* Open Button - positioned at bottom */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={handleOpenCase}
                className="font-bold text-lg px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 border-0 intro-button"
                style={{ 
                  background: 'linear-gradient(45deg, #00FFFF, #FF00FF)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  animation: 'pulse 2s infinite'
                }}
              >
                Открыть кейс
              </Button>
            </div>
          </div>
        )}

        {/* Phase 2: Case Opening Animation */}
        {casePhase === 'opening' && (
          <div className="flex-1 flex items-center justify-center z-10">
            <div className="relative animate-case-disappear">
              <img 
                src="/attached_assets/Leonardo_Phoenix_10_A_vibrant_cartoonstyle_3D_render_of_a_clos_3-Photoroom (1)_1754150180830.png"
                alt="AUTO ARENA Case"
                className="w-80 h-80 object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.5))',
                }}
              />
            </div>
          </div>
        )}

        {/* Phase 3: Card Scrolling */}
        {(casePhase === 'scrolling' || casePhase === 'result') && (
          <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
            
            {/* Arrow pointer */}
            <div className="mb-4 z-20">
              <div className="w-0 h-0" 
                   style={{ 
                     borderLeft: '15px solid transparent',
                     borderRight: '15px solid transparent',
                     borderTop: '25px solid #FFFFFF',
                     filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))'
                   }} />
            </div>
            
            {/* Card scrolling container */}
            <div className="relative w-full max-w-4xl h-48 overflow-hidden rounded-xl"
                 style={{ 
                   background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)',
                   boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
                 }}>
              
              {/* Cards strip */}
              <div 
                className="flex absolute left-0 top-0 h-full transition-transform ease-out"
                style={{ 
                  transform: `translateX(${cardScrollPosition}px)`,
                  transitionDuration: isScrolling ? '3s' : '0.5s'
                }}
              >
                {scrollCards.map((car, index) => {
                  const rarity = getRarityColor(car.price);
                  const isWinning = car.id === 'winning-car' && casePhase === 'result';
                  
                  return (
                    <div
                      key={car.id}
                      className={`flex-shrink-0 w-36 h-44 mx-2 rounded-lg border-2 flex flex-col items-center justify-between p-3 transition-all duration-500 ${
                        isWinning ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: rarity.color,
                        boxShadow: isWinning 
                          ? `0 0 25px ${rarity.color}, 0 0 50px ${rarity.color}` 
                          : `0 0 10px ${rarity.color}40`
                      }}
                    >
                      {/* Car logo */}
                      <div className="flex items-center justify-center h-12 mb-2">
                        <img 
                          src={`/assets/cars/${car.id.replace('scroll-', '').replace('winning-car', car.id)}/logotype.png`}
                          alt={`${car.brand} logo`}
                          className="w-8 h-8 object-contain"
                          style={{ 
                            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6)) brightness(1.2)',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling!.textContent = '🚗';
                          }}
                        />
                        <span className="text-2xl" style={{ display: 'none' }}>🚗</span>
                      </div>
                      
                      {/* Car name */}
                      <div className="text-center mb-2">
                        <div className="text-white font-bold text-sm leading-tight intro-text" 
                             style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}>
                          {car.name}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-center">
                        <div className="font-bold text-xs intro-text"
                             style={{ 
                               color: '#FFD700',
                               textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                             }}>
                          {formatPrice(car.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Center highlight overlay */}
              <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-40 pointer-events-none"
                   style={{ 
                     background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                   }} />
            </div>
            
            {/* Take reward button - only show after result */}
            {casePhase === 'result' && finalWinningCar && (
              <div className="mt-8 px-4">
                <Button
                  onClick={handleTakeReward}
                  className="font-bold text-lg sm:text-xl px-6 sm:px-12 py-3 sm:py-4 rounded-xl transform hover:scale-105 transition-all duration-300 border-0 intro-button w-full max-w-xs mx-auto"
                  style={{ 
                    background: `linear-gradient(45deg, ${getRarityColor(finalWinningCar.price).color}, #FFFFFF)`,
                    color: '#000000',
                    boxShadow: `0 0 20px ${getRarityColor(finalWinningCar.price).color}80`,
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                    minHeight: '48px'
                  }}
                >
                  <span className="truncate">Забрать {finalWinningCar.name}</span>
                </Button>
              </div>
            )}
          </div>
        )}
        
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
    const availableColors = carColors[selectedCar.id as keyof typeof carColors] || standardColors;
    
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
          <div className="w-full max-w-sm mb-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10 h-20 flex flex-col justify-between" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text leading-tight">Мощность авто</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.horsepower}</div>
                <div className="text-xs text-gray-400 intro-text">л.с.</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10 h-20 flex flex-col justify-between" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text leading-tight">0-100<br />км/ч</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.acceleration}</div>
                <div className="text-xs text-gray-400 intro-text">сек</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10 h-20 flex flex-col justify-between" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text leading-tight">Макс. скорость</div>
                <div className="text-lg font-bold text-white intro-text">{selectedCar.maxSpeed}</div>
                <div className="text-xs text-gray-400 intro-text">км/ч</div>
              </div>
            </div>
            
            {/* Selected color display */}
            {selectedColor && (
              <div className="mt-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10" style={{ boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-bold text-white mb-1 intro-text">Выбранный цвет</div>
                <div className="text-sm text-gray-300 intro-text">
                  {selectedColor === '#FFFFFF' ? 'Белый' : 
                   selectedColor === '#000000' ? 'Чёрный' : 
                   selectedColor === '#FF0000' ? 'Красный' : 
                   selectedColor === '#0000FF' ? 'Синий' : 
                   selectedColor === '#808080' ? 'Серый' :
                   'Особый'}
                </div>
              </div>
            )}
          </div>

          {/* Color selection block */}
          <div className="w-full max-w-sm mb-8">
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto px-2" style={{ minHeight: '60px', paddingBottom: '10px' }}>
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
                playSound('win.mp3');
                
                // Stop intro music
                if (introMusicRef.current) {
                  introMusicRef.current.pause();
                }
              }
            }}
            disabled={!selectedColor}
            className="font-bold text-base sm:text-lg rounded-3xl transition-all duration-300 transform hover:scale-105 border-0 disabled:opacity-50 disabled:cursor-not-allowed intro-button w-full max-w-xs mx-auto px-4 sm:px-6"
            style={{ 
              backgroundColor: selectedColor ? '#00FFFF' : '#666666',
              color: '#0C011C',
              height: '48px',
              boxShadow: selectedColor ? '0px 0px 14px rgba(0,255,255,0.5)' : 'none'
            }}
          >
            <span className="truncate">Подтвердить выбор</span>
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
      <div className="min-h-screen hero-gradient-bg animate-gradient-flow flex flex-col items-center justify-between text-white p-6 relative overflow-hidden">
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
            <h1 
              className="text-4xl font-bold mb-6 intro-title"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)',
              }}
            >
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
                'Особый'
              }</p>
            </div>
            
            <Button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-xl shadow-green-500/25 transform hover:scale-105 transition-all duration-300 border-0 text-white animate-pulse-green intro-button w-full max-w-xs mx-auto"
              style={{ minHeight: '48px' }}
            >
              <span className="truncate">В путь!</span>
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