import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';

interface GarageProps {
  onNavigate?: (tab: string) => void;
}

export default function Garage({ onNavigate }: GarageProps = {}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const carPhotos = [
    '/car.svg',
    '/car.svg', 
    '/car.svg',
    '/car.svg'
  ];

  const carData = {
    name: 'BMW M3 Competition',
    drivetrain: 'Полный привод',
    weight: '1,730 кг',
    mileage: '45,230 км'
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % carPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + carPhotos.length) % carPhotos.length);
  };

  const upgradeCategories = [
    {
      id: 'engine',
      name: 'Двигатель',
      description: 'Увеличение мощности и крутящего момента для скорости',
      icon: '⚙️',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'transmission',
      name: 'Трансмиссия',
      description: 'Улучшение переключения передач для плавной езды',
      icon: '🔧',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'suspension',
      name: 'Подвеска',
      description: 'Настройка управляемости и комфорта для комфорта',
      icon: '🛠️',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'brakes',
      name: 'Тормоза',
      description: 'Усиление тормозной системы для безопасности',
      icon: '🛑',
      gradient: 'from-gray-500 to-gray-700'
    },
    {
      id: 'exhaust',
      name: 'Выхлоп',
      description: 'Спортивная выхлопная система для мощного звука',
      icon: '💨',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      description: 'Современные системы управления для комфорта',
      icon: '🔋',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'body',
      name: 'Кузов',
      description: 'Аэродинамические улучшения для стиля и скорости',
      icon: '🏁',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'interior',
      name: 'Интерьер',
      description: 'Спортивный салон и отделка для премиального вида',
      icon: '🪑',
      gradient: 'from-amber-500 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Гараж</h1>
        <p className="text-muted-foreground">Управляй своим автопарком</p>
      </div>

      {/* Car Name */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold car-name-simple">{carData.name}</h2>
      </div>

      {/* Car Photo Container - Full width square */}
      <div className="mb-4">
        <div className="aspect-square w-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden car-photo-container">
          <img 
            src={carPhotos[currentPhotoIndex]} 
            alt="Car" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Navigation Buttons - Below photo */}
      <div className="flex justify-center items-center gap-8 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevPhoto}
          className="glass-button"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextPhoto}
          className="glass-button"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Car Characteristics - Bottom */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">Привод</div>
            <div className="text-sm font-semibold text-blue-400">{carData.drivetrain}</div>
          </CardContent>
        </Card>
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">Масса</div>
            <div className="text-sm font-semibold text-red-400">{carData.weight}</div>
          </CardContent>
        </Card>
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">Пробег</div>
            <div className="text-sm font-semibold text-green-400">{carData.mileage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Car Characteristics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">Мощность</div>
            <div className="text-sm font-semibold text-purple-400">510 л.с.</div>
          </CardContent>
        </Card>
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">0-100 км/ч</div>
            <div className="text-sm font-semibold text-orange-400">3.9 сек</div>
          </CardContent>
        </Card>
        <Card className="car-info-card border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-2">Макс. скорость</div>
            <div className="text-sm font-semibold text-cyan-400">280 км/ч</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailing Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground text-center mb-6">Детейлинг</h3>
        
        <Card className="detailing-card group hover:scale-105 transition-all duration-300 relative border-0 shadow-none">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-15" />
          
          <CardContent className="p-4 relative z-10">
            <div className="h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm truncate">Детейлинг автомобиля</h4>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed h-10 flex items-center">
                Профессиональная чистка и уход за автомобилем
              </p>
              
              <Button 
                className="w-full glass-button text-xs h-8 group-hover:bg-primary/20 transition-colors mt-auto"
                size="sm"
                onClick={() => onNavigate?.('detailing')}
              >
                Перейти
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Categories */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground text-center mb-6">Улучшить компоненты</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {upgradeCategories.map((category) => (
            <Card key={category.id} className={`overflow-hidden group hover:scale-105 transition-all duration-300 upgrade-card-${category.id} relative border-0 shadow-none`}>
              {/* Gradient Background - Full Card Coverage */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-15`} />
              
              <CardContent className="p-4 relative z-10">
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">{category.name}</h4>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed h-10 flex items-center">
                    {category.description}
                  </p>
                  
                  <Button 
                    className="w-full glass-button text-xs h-8 group-hover:bg-primary/20 transition-colors mt-auto"
                    size="sm"
                  >
                    Перейти
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
