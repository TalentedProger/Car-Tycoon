import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';

export default function Garage() {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  const cars = [
    {
      name: 'BMW M3 Competition',
      image: '🏎️',
      specs: {
        power: '510 л.с.',
        acceleration: '3.9 сек',
        topSpeed: '280 км/ч'
      }
    },
    {
      name: 'Mercedes AMG GT',
      image: '🚗',
      specs: {
        power: '469 л.с.',
        acceleration: '4.0 сек',
        topSpeed: '310 км/ч'
      }
    },
    {
      name: 'Audi RS6 Avant',
      image: '🚙',
      specs: {
        power: '600 л.с.',
        acceleration: '3.6 сек',
        topSpeed: '305 км/ч'
      }
    }
  ];

  const upgradeCategories = [
    {
      id: 'engine',
      name: 'Двигатель',
      description: 'Увеличение мощности и крутящего момента',
      icon: '⚙️',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      id: 'transmission',
      name: 'Трансмиссия',
      description: 'Улучшение переключения передач',
      icon: '🔧',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'suspension',
      name: 'Подвеска',
      description: 'Настройка управляемости и комфорта',
      icon: '🛠️',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'brakes',
      name: 'Тормоза',
      description: 'Усиление тормозной системы',
      icon: '🛑',
      gradient: 'from-gray-500 to-gray-700'
    },
    {
      id: 'exhaust',
      name: 'Выхлоп',
      description: 'Спортивная выхлопная система',
      icon: '💨',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      description: 'Современные системы управления',
      icon: '🔋',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'body',
      name: 'Кузов',
      description: 'Аэродинамические улучшения',
      icon: '🏁',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'interior',
      name: 'Интерьер',
      description: 'Спортивный салон и отделка',
      icon: '🪑',
      gradient: 'from-amber-500 to-yellow-600'
    }
  ];

  const nextCar = () => {
    setCurrentCarIndex((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    setCurrentCarIndex((prev) => (prev - 1 + cars.length) % cars.length);
  };

  const currentCar = cars[currentCarIndex];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Гараж</h1>
        <p className="text-muted-foreground">Управляй своим автопарком</p>
      </div>

      {/* Car Display Section */}
      <div className="mb-8">
        <Card className="glass-dark overflow-hidden">
          <CardContent className="p-6">
            {/* Car Name */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{currentCar.name}</h2>
            </div>

            {/* Car Image with Navigation */}
            <div className="relative mb-6">
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevCar}
                  className="absolute left-0 z-10 glass-button"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="w-64 h-40 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl flex items-center justify-center text-7xl backdrop-blur-sm border border-white/10">
                  {currentCar.image}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextCar}
                  className="absolute right-0 z-10 glass-button"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Car Navigation Dots */}
              <div className="flex justify-center mt-4 gap-2">
                {cars.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentCarIndex 
                        ? 'bg-primary w-6' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Car Specs */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-dark rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">Мощность</div>
                <div className="text-sm font-semibold text-red-400">{currentCar.specs.power}</div>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">0-100 км/ч</div>
                <div className="text-sm font-semibold text-blue-400">{currentCar.specs.acceleration}</div>
              </div>
              <div className="glass-dark rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-1">Макс. скорость</div>
                <div className="text-sm font-semibold text-green-400">{currentCar.specs.topSpeed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Categories */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground text-center mb-6">Улучшить компоненты</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {upgradeCategories.map((category) => (
            <Card key={category.id} className={`glass-dark overflow-hidden group hover:scale-105 transition-all duration-300 upgrade-card-${category.id}`}>
              <CardContent className="p-4">
                <div className="relative h-full">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-15 rounded-lg`} />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white text-lg`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{category.name}</h4>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed flex-1">
                      {category.description}
                    </p>
                    
                    <Button 
                      className="w-full glass-button text-xs h-8 group-hover:bg-primary/20 transition-colors"
                      size="sm"
                    >
                      Перейти
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
