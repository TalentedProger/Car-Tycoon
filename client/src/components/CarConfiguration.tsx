import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCarEmoji } from '@/utils/imageLoader';

interface CarSpec {
  id: number;
  name: string;
  year: string;
  basePrice: number;
  image: string;
  rating: number;
  category: string;
  bodyType: string;
  engineType: string;
  engineVolume: string;
  basePower: number;
  driveType: string;
  transmission: string;
  fuelConsumption: string;
  baseAcceleration: number;
  baseMaxSpeed: number;
  fuelType: string;
  images: string[];
}

interface ConfigurationProps {
  car: CarSpec;
  onClose: () => void;
  onSave: (carId: number, configuration: string, finalPrice: number) => void;
}

interface TrimLevel {
  name: string;
  multiplier: number;
  powerBonus: number;
  speedBonus: number;
  accelerationBonus: number;
  volumeBonus: number;
  priceIncrease: number;
}

export default function CarConfiguration({ car, onClose, onSave }: ConfigurationProps) {
  const [selectedTrim, setSelectedTrim] = useState('Base');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const trimLevels: TrimLevel[] = [
    {
      name: 'Base',
      multiplier: 1.0,
      powerBonus: 0,
      speedBonus: 0,
      accelerationBonus: 0,
      volumeBonus: 0,
      priceIncrease: 0
    },
    {
      name: 'Comfort',
      multiplier: 1.3,
      powerBonus: 15,
      speedBonus: 10,
      accelerationBonus: -0.3,
      volumeBonus: 0.1,
      priceIncrease: Math.round(car.basePrice * 0.3)
    },
    {
      name: 'Elegance', 
      multiplier: 1.6,
      powerBonus: 30,
      speedBonus: 20,
      accelerationBonus: -0.6,
      volumeBonus: 0.2,
      priceIncrease: Math.round(car.basePrice * 0.6)
    },
    {
      name: 'Premium',
      multiplier: 2.0,
      powerBonus: 50,
      speedBonus: 30,
      accelerationBonus: -1.0,
      volumeBonus: 0.3,
      priceIncrease: Math.round(car.basePrice * 1.0)
    },
    {
      name: 'Sport',
      multiplier: 2.5,
      powerBonus: 80,
      speedBonus: 45,
      accelerationBonus: -1.5,
      volumeBonus: 0.4,
      priceIncrease: Math.round(car.basePrice * 1.5)
    }
  ];

  const getCurrentTrim = () => trimLevels.find(trim => trim.name === selectedTrim) || trimLevels[0];
  const currentTrim = getCurrentTrim();
  const finalPrice = car.basePrice + currentTrim.priceIncrease;

  const getUpdatedSpecs = () => {
    const trim = getCurrentTrim();
    return {
      power: car.basePower + trim.powerBonus,
      maxSpeed: car.baseMaxSpeed + trim.speedBonus,
      acceleration: Math.max(0.1, car.baseAcceleration + trim.accelerationBonus),
      engineVolume: (parseFloat(car.engineVolume) + trim.volumeBonus).toFixed(1)
    };
  };

  const updatedSpecs = getUpdatedSpecs();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

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

  const categoryColor = getCategoryColor(car.category);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen p-4 pb-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-start mb-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </div>
          <h1 className="text-xl font-bold text-white text-center">{car.name}</h1>
        </div>

        {/* Car Images Swiper */}
        <div className="relative mb-6">
          <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/20 flex items-center justify-center relative overflow-hidden">
            <img 
              src={car.images[currentImageIndex]} 
              alt={`${car.name} - view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<div class="text-8xl">${getCarEmoji(car.id)}</div>`;
              }}
            />
            
            {car.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Navigation buttons */}
          {car.images.length > 1 && (
            <div className="flex justify-center mt-4 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white px-3 py-1"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white px-3 py-1"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
          
          {/* Image Dots */}
          {car.images.length > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {car.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Car Specifications */}
        <Card className="mb-12 bg-green-900 border border-green-700/30">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-white mb-4 text-center">Характеристики</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Марка / модель</span>
                <span className="text-white">{car.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Год выпуска</span>
                <span className="text-white">{car.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Тип кузова</span>
                <span className="text-white">{car.bodyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Тип двигателя</span>
                <span className="text-white">{car.engineType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Объем двигателя</span>
                <span className="text-white">{updatedSpecs.engineVolume}L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Мощность (л.с.)</span>
                <span className="text-white">{updatedSpecs.power} л.с.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Тип привода</span>
                <span className="text-white">{car.driveType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Коробка передач</span>
                <span className="text-white">{car.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Расход топлива</span>
                <span className="text-white">{car.fuelConsumption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Разгон до 100 км/ч</span>
                <span className="text-white">{updatedSpecs.acceleration.toFixed(1)} сек</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Макс. скорость</span>
                <span className="text-white">{updatedSpecs.maxSpeed} км/ч</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">• Тип топлива</span>
                <span className="text-white">{car.fuelType}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Selection */}
        <Card className="mb-8 bg-purple-950 border border-purple-700/30">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-white mb-2 text-center">Выбери комплектацию:</h2>
            <div className="text-2xl font-bold text-green-400 mb-4 text-center">
              {finalPrice.toLocaleString()} ₽
            </div>
            
            <RadioGroup value={selectedTrim} onValueChange={setSelectedTrim}>
              {trimLevels.map((trim) => {
                const isSelected = selectedTrim === trim.name;
                return (
                  <div key={trim.name} className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <RadioGroupItem 
                      value={trim.name} 
                      id={trim.name} 
                      className={`w-5 h-5 border-2 ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
                    />
                    <Label htmlFor={trim.name} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-white font-medium">{trim.name}</span>
                          {trim.priceIncrease > 0 && (
                            <span className="text-green-400 ml-2">+{trim.priceIncrease.toLocaleString()} ₽</span>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            
            {/* Save Button inside card - raised up */}
            <Button
              onClick={() => onSave(car.id, selectedTrim, finalPrice)}
              className="w-auto h-10 text-sm font-bold bg-green-600 hover:bg-green-700 text-white mt-6 px-8 mx-auto block"
            >
              Сохранить
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}