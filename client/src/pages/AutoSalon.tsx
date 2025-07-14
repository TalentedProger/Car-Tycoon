import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Zap, Shield } from 'lucide-react';

export default function AutoSalon() {
  const cars = [
    // Эконом класс
    {
      id: 1,
      name: 'ВАЗ 2107',
      price: '85,000 💵',
      image: '🚗',
      rating: 3.2,
      power: '75 л.с.',
      maxSpeed: '155 км/ч',
      weight: '1050 кг',
      category: 'Эконом',
      available: true
    },
    {
      id: 2,
      name: 'ВАЗ 2110',
      price: '125,000 💵',
      image: '🚙',
      rating: 3.5,
      power: '82 л.с.',
      maxSpeed: '170 км/ч',
      weight: '1080 кг',
      category: 'Эконом',
      available: true
    },
    // Бюджет класс
    {
      id: 3,
      name: 'LADA Granta',
      price: '850,000 💵',
      image: '🚗',
      rating: 3.8,
      power: '106 л.с.',
      maxSpeed: '183 км/ч',
      weight: '1160 кг',
      category: 'Бюджет',
      available: true
    },
    {
      id: 4,
      name: 'Renault Logan',
      price: '900,000 💵',
      image: '🚙',
      rating: 4.0,
      power: '113 л.с.',
      maxSpeed: '180 км/ч',
      weight: '1135 кг',
      category: 'Бюджет',
      available: true
    },
    // Стандарт класс
    {
      id: 5,
      name: 'Toyota Corolla',
      price: '575,000 💵',
      image: '🚗',
      rating: 4.3,
      power: '132 л.с.',
      maxSpeed: '195 км/ч',
      weight: '1315 кг',
      category: 'Стандарт',
      available: true
    },
    {
      id: 6,
      name: 'Mazda 3',
      price: '650,000 💵',
      image: '🚙',
      rating: 4.4,
      power: '150 л.с.',
      maxSpeed: '200 км/ч',
      weight: '1345 кг',
      category: 'Стандарт',
      available: true
    },
    // Средний класс
    {
      id: 7,
      name: 'Toyota Camry',
      price: '3,900,000 💵',
      image: '🚗',
      rating: 4.6,
      power: '249 л.с.',
      maxSpeed: '210 км/ч',
      weight: '1590 кг',
      category: 'Средний класс',
      available: false
    },
    {
      id: 8,
      name: 'Skoda Octavia',
      price: '1,100,000 💵',
      image: '🚙',
      rating: 4.5,
      power: '150 л.с.',
      maxSpeed: '205 км/ч',
      weight: '1395 кг',
      category: 'Средний класс',
      available: true
    },
    // Премиум класс
    {
      id: 9,
      name: 'BMW 5 серии',
      price: '2,650,000 💵',
      image: '🏎️',
      rating: 4.7,
      power: '252 л.с.',
      maxSpeed: '250 км/ч',
      weight: '1650 кг',
      category: 'Премиум',
      available: false
    },
    {
      id: 10,
      name: 'Mercedes E-класс',
      price: '2,900,000 💵',
      image: '🚗',
      rating: 4.8,
      power: '299 л.с.',
      maxSpeed: '250 км/ч',
      weight: '1680 кг',
      category: 'Премиум',
      available: false
    },
    // Люкс класс
    {
      id: 11,
      name: 'Mercedes S-класс',
      price: '7,500,000 💵',
      image: '🏁',
      rating: 4.9,
      power: '469 л.с.',
      maxSpeed: '250 км/ч',
      weight: '2110 кг',
      category: 'Люкс',
      available: false
    },
    {
      id: 12,
      name: 'Porsche 911',
      price: '12,000,000 💵',
      image: '🏎️',
      rating: 5.0,
      power: '379 л.с.',
      maxSpeed: '293 км/ч',
      weight: '1505 кг',
      category: 'Люкс',
      available: false
    }
  ];

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
            <div className="text-lg font-bold text-green-400">{cars.filter(car => car.available).length}</div>
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
            <div className="text-lg font-bold text-yellow-400">5M 💵</div>
          </CardContent>
        </Card>
      </div>

      {/* Cars Grid */}
      <div className="space-y-4">
        {cars.map((car) => {
          const categoryColor = getCategoryColor(car.category);
          return (
            <Card 
              key={car.id} 
              className="overflow-hidden group hover:scale-105 transition-all duration-300 relative border-0 shadow-none"
              style={{
                border: `2px solid ${categoryColor.hex}60`,
                boxShadow: `0 0 20px ${categoryColor.hex}60, 0 0 40px ${categoryColor.hex}30, inset 0 0 20px ${categoryColor.hex}10`
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 ${categoryColor.bg}`} />
              
              <CardContent className="p-4 relative z-10">
                <div className="flex">
                  {/* Car Image */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center text-3xl backdrop-blur-sm border border-white/10 flex-shrink-0">
                    {car.image}
                  </div>

                  {/* Car Info - Main Content */}
                  <div className="flex-1 min-w-0 ml-4">
                    {/* Top row with car name and category */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">{car.name}</h3>
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
                      <span className="text-xs font-bold text-green-400">{car.price}</span>
                    </div>

                    {/* Car Specifications */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-xs bg-white/5 text-muted-foreground px-2 py-1 rounded-md">
                        {car.power}
                      </span>
                      <span className="text-xs bg-white/5 text-muted-foreground px-2 py-1 rounded-md">
                        {car.maxSpeed}
                      </span>
                      <span className="text-xs bg-white/5 text-muted-foreground px-2 py-1 rounded-md">
                        {car.weight}
                      </span>
                    </div>

                    {/* Bottom row with buy button */}
                    <div className="flex justify-end">
                      <Button 
                        className={`text-xs h-8 px-4 ${
                          car.available 
                            ? 'glass-button group-hover:bg-green-500/20' 
                            : 'glass-button opacity-50 cursor-not-allowed'
                        }`}
                        size="sm"
                        disabled={!car.available}
                      >
                        {car.available ? (
                          <>
                            <ShoppingCart className="mr-1 h-3 w-3" />
                            Купить
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Заблокировано
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Зарабатывай больше монет, чтобы разблокировать новые автомобили
        </p>
      </div>
    </div>
  );
}