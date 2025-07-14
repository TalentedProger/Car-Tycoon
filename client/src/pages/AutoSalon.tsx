import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Zap, Shield } from 'lucide-react';

export default function AutoSalon() {
  const cars = [
    {
      id: 1,
      name: 'BMW M4 Competition',
      price: '12,500,000 💵',
      image: '🏎️',
      rating: 4.9,
      features: ['510 л.с.', 'Полный привод', '3.9 сек 0-100'],
      category: 'Спорт',
      available: true
    },
    {
      id: 2,
      name: 'Mercedes AMG GT63',
      price: '15,800,000 💵',
      image: '🚗',
      rating: 4.8,
      features: ['630 л.с.', 'Полный привод', '3.2 сек 0-100'],
      category: 'Премиум',
      available: true
    },
    {
      id: 3,
      name: 'Audi RS6 Avant',
      price: '9,200,000 💵',
      image: '🚙',
      rating: 4.7,
      features: ['600 л.с.', 'Полный привод', '3.6 сек 0-100'],
      category: 'Универсал',
      available: true
    },
    {
      id: 4,
      name: 'Porsche 911 Turbo S',
      price: '18,500,000 💵',
      image: '🏁',
      rating: 5.0,
      features: ['650 л.с.', 'Полный привод', '2.7 сек 0-100'],
      category: 'Супер',
      available: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Спорт': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Премиум': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Универсал': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Супер': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
            <div className="text-lg font-bold text-green-400">3</div>
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
            <div className="text-lg font-bold text-yellow-400">50M 💵</div>
          </CardContent>
        </Card>
      </div>

      {/* Cars Grid */}
      <div className="space-y-4">
        {cars.map((car) => (
          <Card 
            key={car.id} 
            className={`overflow-hidden group hover:scale-105 transition-all duration-300 relative border-0 shadow-none ${
              car.available ? 'car-available' : 'car-unavailable'
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 ${
              car.available 
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10' 
                : 'bg-gradient-to-br from-gray-500/10 to-gray-700/10'
            }`} />
            
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Car Image */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center text-3xl backdrop-blur-sm border border-white/10">
                  {car.image}
                </div>

                {/* Car Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-sm truncate">{car.name}</h3>
                    <Badge className={`text-xs px-2 py-1 ${getCategoryColor(car.category)}`}>
                      {car.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{car.rating}</span>
                    </div>
                    <span className="text-xs font-bold text-green-400">{car.price}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {car.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-white/5 text-muted-foreground px-2 py-1 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col gap-2">
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
            </CardContent>
          </Card>
        ))}
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