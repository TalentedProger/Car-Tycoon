import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Eye, Settings } from 'lucide-react';
import CarConfiguration from '@/components/CarConfiguration';
import { getCarImages, getCarMainImage, getCarEmoji } from '@/utils/imageLoader';
import { trimLevels, trimMultipliers, calculatePrice, calculateHourlyIncome } from '@/data/carData';

interface AutoSalonProps {
  gameState?: {
    coins: number;
    level: number;
    energy: number;
    maxEnergy: number;
    hourlyIncome: number;
    boostsUsedToday: number;
  };
}

export default function AutoSalon({ gameState }: AutoSalonProps = {}) {
  const [carTrims, setCarTrims] = useState<{ [key: number]: string }>({});
  const [selectedCarForConfig, setSelectedCarForConfig] = useState<number | null>(null);
  
  const getCarTrim = (carId: number) => carTrims[carId] || 'Base';
  
  const handleConfigurationSave = (carId: number, configuration: string, finalPrice: number) => {
    setCarTrims(prev => ({ ...prev, [carId]: configuration }));
    setSelectedCarForConfig(null);
    // Here you could also save to game state or backend
  };

  // Helper function to add default specs to cars that don't have them
  const addDefaultSpecs = (car: any) => ({
    ...car,
    bodyType: car.bodyType || 'Седан',
    engineType: car.engineType || 'Бензин',
    engineVolume: car.engineVolume || '1.6',
    basePower: car.basePower || parseInt(car.power) || 100,
    driveType: car.driveType || 'Передний (FWD)',
    transmission: car.transmission || 'Механика (МКПП)',
    fuelConsumption: car.fuelConsumption || '8.0 л/100 км',
    baseAcceleration: car.baseAcceleration || 12.0,
    baseMaxSpeed: car.baseMaxSpeed || parseInt(car.maxSpeed) || 180,
    fuelType: car.fuelType || 'АИ-95',
    images: getCarImages(car.id)
  });

  const carCategories = [
    {
      name: 'Эконом',
      priceRange: '20,000 – 150,000 ₽',
      cars: [
        {
          id: 1,
          name: 'ВАЗ 2107',
          year: '2012',
          basePrice: 85000,
          image: '🚗',
          rating: 3.2,
          power: '75 л.с.',
          maxSpeed: '155 км/ч',
          weight: '1050 кг',
          category: 'Эконом',
          available: true,
          bodyType: 'Седан',
          engineType: 'Бензин',
          engineVolume: '1.6',
          basePower: 75,
          driveType: 'Задний (RWD)',
          transmission: 'Механика (МКПП)',
          fuelConsumption: '8.5 л/100 км',
          baseAcceleration: 14.0,
          baseMaxSpeed: 155,
          fuelType: 'АИ-92',
          images: ['🚗', '🏎️', '🚙']
        },
        {
          id: 2,
          name: 'ВАЗ 2110',
          year: '2009',
          basePrice: 125000,
          image: '🚙',
          rating: 3.5,
          power: '82 л.с.',
          maxSpeed: '170 км/ч',
          weight: '1080 кг',
          category: 'Эконом',
          available: true,
          bodyType: 'Седан',
          engineType: 'Бензин',
          engineVolume: '1.5',
          basePower: 82,
          driveType: 'Передний (FWD)',
          transmission: 'Механика (МКПП)',
          fuelConsumption: '7.8 л/100 км',
          baseAcceleration: 13.2,
          baseMaxSpeed: 170,
          fuelType: 'АИ-95',
          images: ['🚙', '🚗', '🏎️']
        },
        {
          id: 3,
          name: 'Audi 100',
          year: '1994',
          basePrice: 140000,
          image: '🚗',
          rating: 3.8,
          power: '115 л.с.',
          maxSpeed: '195 км/ч',
          weight: '1420 кг',
          category: 'Эконом',
          available: true,
          bodyType: 'Седан',
          engineType: 'Бензин',
          engineVolume: '2.0',
          basePower: 115,
          driveType: 'Передний (FWD)',
          transmission: 'Автомат (АКПП)',
          fuelConsumption: '9.2 л/100 км',
          baseAcceleration: 11.5,
          baseMaxSpeed: 195,
          fuelType: 'АИ-95',
          images: ['🚗', '🏎️']
        },
        {
          id: 4,
          name: 'Hyundai Sonata IV',
          year: '2004',
          basePrice: 135000,
          image: '🚙',
          rating: 3.6,
          power: '136 л.с.',
          maxSpeed: '185 км/ч',
          weight: '1395 кг',
          category: 'Эконом',
          available: true
        }
      ]
    },
    {
      name: 'Бюджет',
      priceRange: '150,000 – 400,000 ₽',
      cars: [
        {
          id: 5,
          name: 'LADA Granta',
          year: '2022',
          basePrice: 850000,
          image: '🚗',
          rating: 3.8,
          power: '106 л.с.',
          maxSpeed: '183 км/ч',
          weight: '1160 кг',
          category: 'Бюджет',
          available: true
        },
        {
          id: 6,
          name: 'Renault Logan',
          year: '2021',
          basePrice: 900000,
          image: '🚙',
          rating: 4.0,
          power: '113 л.с.',
          maxSpeed: '180 км/ч',
          weight: '1135 кг',
          category: 'Бюджет',
          available: true
        },
        {
          id: 7,
          name: 'Nissan Teana',
          year: '2018',
          basePrice: 1200000,
          image: '🚗',
          rating: 4.2,
          power: '182 л.с.',
          maxSpeed: '200 км/ч',
          weight: '1510 кг',
          category: 'Бюджет',
          available: false
        },
        {
          id: 8,
          name: 'Honda Accord 7',
          year: '2008',
          basePrice: 750000,
          image: '🚙',
          rating: 4.1,
          power: '156 л.с.',
          maxSpeed: '205 км/ч',
          weight: '1465 кг',
          category: 'Бюджет',
          available: true
        }
      ]
    },
    {
      name: 'Стандарт',
      priceRange: '400,000 – 800,000 ₽',
      cars: [
        {
          id: 9,
          name: 'Toyota Corolla',
          year: '2019',
          basePrice: 575000,
          image: '🚗',
          rating: 4.3,
          power: '132 л.с.',
          maxSpeed: '195 км/ч',
          weight: '1315 кг',
          category: 'Стандарт',
          available: true,
          bodyType: 'Седан',
          engineType: 'Бензин',
          engineVolume: '1.8',
          basePower: 132,
          driveType: 'Передний (FWD)',
          transmission: 'Вариатор (CVT)',
          fuelConsumption: '6.8 л/100 км',
          baseAcceleration: 10.2,
          baseMaxSpeed: 195,
          fuelType: 'АИ-95',
          images: ['🚗', '🚙', '🏎️']
        },
        {
          id: 10,
          name: 'Mazda 3',
          year: '2017',
          basePrice: 650000,
          image: '🚙',
          rating: 4.4,
          power: '150 л.с.',
          maxSpeed: '200 км/ч',
          weight: '1345 кг',
          category: 'Стандарт',
          available: true
        },
        {
          id: 11,
          name: 'Toyota Mark II',
          year: '2015',
          basePrice: 720000,
          image: '🏎️',
          rating: 4.5,
          power: '280 л.с.',
          maxSpeed: '235 км/ч',
          weight: '1520 кг',
          category: 'Стандарт',
          available: false
        }
      ]
    },
    {
      name: 'Средний класс',
      priceRange: '800,000 – 1,500,000 ₽',
      cars: [
        {
          id: 12,
          name: 'Toyota Camry',
          year: '2020',
          basePrice: 3900000,
          image: '🚗',
          rating: 4.6,
          power: '249 л.с.',
          maxSpeed: '210 км/ч',
          weight: '1590 кг',
          category: 'Средний класс',
          available: false,
          bodyType: 'Седан',
          engineType: 'Бензин',
          engineVolume: '2.5',
          basePower: 249,
          driveType: 'Передний (FWD)',
          transmission: 'Автомат (АКПП)',
          fuelConsumption: '7.2 л/100 км',
          baseAcceleration: 8.4,
          baseMaxSpeed: 210,
          fuelType: 'АИ-95',
          images: ['🚗', '🏎️', '🚙', '🚘']
        },
        {
          id: 13,
          name: 'Skoda Octavia',
          year: '2019',
          basePrice: 1100000,
          image: '🚙',
          rating: 4.5,
          power: '150 л.с.',
          maxSpeed: '205 км/ч',
          weight: '1395 кг',
          category: 'Средний класс',
          available: true
        },
        {
          id: 14,
          name: 'KIA K5',
          year: '2021',
          basePrice: 1350000,
          image: '🏎️',
          rating: 4.4,
          power: '180 л.с.',
          maxSpeed: '210 км/ч',
          weight: '1475 кг',
          category: 'Средний класс',
          available: false
        }
      ]
    },
    {
      name: 'Премиум',
      priceRange: '1,500,000 – 4,000,000 ₽',
      cars: [
        {
          id: 15,
          name: 'BMW 5 серии',
          year: '2018',
          basePrice: 2650000,
          image: '🏎️',
          rating: 4.7,
          power: '252 л.с.',
          maxSpeed: '250 км/ч',
          weight: '1650 кг',
          category: 'Премиум',
          available: false
        },
        {
          id: 16,
          name: 'Mercedes E-класс',
          year: '2019',
          basePrice: 2900000,
          image: '🚗',
          rating: 4.8,
          power: '299 л.с.',
          maxSpeed: '250 км/ч',
          weight: '1680 кг',
          category: 'Премиум',
          available: false
        }
      ]
    },
    {
      name: 'Люкс',
      priceRange: '4,000,000 ₽ и выше',
      cars: [
        {
          id: 17,
          name: 'Mercedes S-класс',
          year: '2020',
          basePrice: 7500000,
          image: '🏁',
          rating: 4.9,
          power: '469 л.с.',
          maxSpeed: '250 км/ч',
          weight: '2110 кг',
          category: 'Люкс',
          available: false
        },
        {
          id: 18,
          name: 'Porsche 911',
          year: '2021',
          basePrice: 12000000,
          image: '🏎️',
          rating: 5.0,
          power: '379 л.с.',
          maxSpeed: '293 км/ч',
          weight: '1505 кг',
          category: 'Люкс',
          available: false
        }
      ]
    }
  ];

  const allCars = carCategories.flatMap(category => category.cars);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Эконом': return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', hex: '#9E9E9E' };
      case 'Бюджет': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', hex: '#4CAF50' };
      case 'Стандарт': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', hex: '#2196F3' };
      case 'Средний класс': return { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', hex: '#3F51B5' };
      case 'Премиум': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', hex: '#9C27B0' };
      case 'Люкс': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', hex: '#F44336' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', hex: '#9E9E9E' };
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Автосалон</h1>
        <p className="text-muted-foreground">Покупай новые автомобили для своей коллекции</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="glass-dark border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Доступно</div>
            <div className="text-lg font-bold text-green-400">{allCars.filter(car => car.available).length}</div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">В гараже</div>
            <div className="text-lg font-bold text-blue-400">1</div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-0 shadow-none">
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Бюджет</div>
            <div className="text-lg font-bold text-yellow-400">{gameState?.coins ? gameState.coins.toLocaleString() : '0'} <span className="text-green-700 text-base">₽</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Cars by Category */}
      <div className="space-y-8">
        {carCategories.map((category) => {
          const categoryColor = getCategoryColor(category.name);
          return (
            <div key={category.name} className="space-y-4">
              {/* Category Header */}
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${categoryColor.text} mb-1`}>
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {category.priceRange}
                </p>
              </div>

              {/* Cars in Category */}
              <div className="space-y-6">
                {category.cars.map((car) => {
                  const currentTrim = getCarTrim(car.id);
                  const currentPrice = calculatePrice(car.basePrice, currentTrim);
                  const hourlyIncome = calculateHourlyIncome(currentPrice);
                  
                  return (
                  <Card 
                    key={car.id} 
                    className="overflow-hidden group hover:scale-105 transition-all duration-300 relative border-0 shadow-none"
                    style={{
                      border: `2px solid ${categoryColor.hex}40`,
                      boxShadow: `0 0 8px ${categoryColor.hex}30, 0 0 16px ${categoryColor.hex}15, inset 0 0 8px ${categoryColor.hex}5, 0 4px 20px ${categoryColor.hex}25`
                    }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 ${categoryColor.bg}`} />
                    
                    <CardContent className="p-4 relative z-10">
                      <div className="flex flex-col">
                        {/* Top section with car image and info */}
                        <div className="flex mb-4">
                          {/* Car Image */}
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center backdrop-blur-sm border border-white/10 flex-shrink-0 overflow-hidden">
                            <img 
                              src={getCarMainImage(car.id)} 
                              alt={car.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  target.style.display = 'none';
                                  parent.innerHTML = `<span class="text-3xl">${getCarEmoji(car.id)}</span>`;
                                }
                              }}
                            />
                          </div>

                          {/* Car Info - Main Content */}
                          <div className="flex-1 min-w-0 ml-4">
                            {/* Top row with car name and category */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-foreground text-sm leading-tight">{car.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">{car.year}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{currentTrim}</span>
                                </div>
                              </div>
                              <Badge className={`text-xs px-2 py-1 ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border} flex-shrink-0 ml-2`}>
                                {car.category}
                              </Badge>
                            </div>
                            
                            {/* Rating and Price */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">{car.rating}</span>
                              </div>
                              <span className="text-xs font-bold text-green-400">{currentPrice.toLocaleString()} <span className="text-green-700 text-xs">₽</span></span>
                              <span className="text-xs text-blue-400">+{hourlyIncome}/час</span>
                            </div>

                            {/* Car Specifications */}
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs bg-purple-500/20 text-muted-foreground px-2 py-1 rounded-md">
                                {car.power}
                              </span>
                              <span className="text-xs bg-cyan-500/20 text-muted-foreground px-2 py-1 rounded-md">
                                {car.maxSpeed}
                              </span>
                              <span className="text-xs bg-red-500/20 text-muted-foreground px-2 py-1 rounded-md">
                                {car.weight}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom row with buttons - centered relative to entire container */}
                        <div className="flex justify-center gap-2 items-center">
                          <Button 
                            className="text-xs h-8 px-3 glass-button"
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Осмотреть
                          </Button>
                          <Button 
                            className="text-xs h-8 px-3 glass-button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCarForConfig(car.id)}
                            disabled={!car.available}
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            Комплектация
                          </Button>
                          {!car.available && (
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Зарабатывай больше монет, чтобы разблокировать новые автомобили
        </p>
      </div>

      {/* Configuration Modal */}
      {selectedCarForConfig && (
        <CarConfiguration
          car={addDefaultSpecs(allCars.find(car => car.id === selectedCarForConfig)!)}
          onClose={() => setSelectedCarForConfig(null)}
          onSave={handleConfigurationSave}
        />
      )}
    </div>
  );
}