import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Droplets, Shield, Zap } from 'lucide-react';

interface DetailingProps {
  gameState: {
    coins: number;
  };
  onPurchaseService: (serviceId: string, cost: number) => void;
}

const services = [
  {
    id: 'wash',
    name: 'Мойка автомобиля',
    description: 'Тщательная мойка кузова и колес',
    cost: 50,
    icon: Droplets,
    benefit: '+2 к привлекательности',
    color: 'bg-blue-500'
  },
  {
    id: 'polish',
    name: 'Полировка кузова',
    description: 'Профессиональная полировка для блеска',
    cost: 150,
    icon: Sparkles,
    benefit: '+5 к привлекательности',
    color: 'bg-yellow-500'
  },
  {
    id: 'ceramic',
    name: 'Керамическое покрытие',
    description: 'Долговечная защита кузова',
    cost: 500,
    icon: Shield,
    benefit: '+10 к защите',
    color: 'bg-purple-500'
  },
  {
    id: 'tuning',
    name: 'Тюнинг двигателя',
    description: 'Увеличение мощности двигателя',
    cost: 1000,
    icon: Zap,
    benefit: '+20 к мощности',
    color: 'bg-red-500'
  }
];

export default function Detailing({ gameState, onPurchaseService }: DetailingProps) {
  const currentCar = {
    name: 'BMW M3 Competition',
    image: '🏎️',
    price: '₽8,500,000',
    power: '510 л.с.',
    drivetrain: 'Полный привод'
  };

  const handlePurchase = (serviceId: string, cost: number) => {
    if (gameState.coins >= cost) {
      onPurchaseService(serviceId, cost);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Детейлинг</h1>
        <p className="text-muted-foreground">Улучшите свой автомобиль</p>
      </div>

      {/* Current Car Display */}
      <div className="mb-8">
        <Card className="glass-dark">
          <CardContent className="p-6">
            {/* Car Image */}
            <div className="flex justify-center mb-4">
              <div className="w-48 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-6xl border-2 border-gray-600">
                {currentCar.image}
              </div>
            </div>
            
            {/* Car Info */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-foreground mb-2">{currentCar.name}</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-muted-foreground">Стоимость</div>
                  <div className="text-green-400 font-semibold">{currentCar.price}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Мощность</div>
                  <div className="text-red-400 font-semibold">{currentCar.power}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Привод</div>
                  <div className="text-blue-400 font-semibold">{currentCar.drivetrain}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground mb-4">Доступные услуги</h3>
        
        {services.map((service) => {
          const IconComponent = service.icon;
          const canAfford = gameState.coins >= service.cost;
          
          return (
            <Card key={service.id} className={`glass-dark ${!canAfford ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${service.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{service.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {service.benefit}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-foreground">{service.cost}</span>
                      <span className="text-green-500">₽</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(service.id, service.cost)}
                      disabled={!canAfford}
                      className={`glass-button ${canAfford ? 'hover:bg-green-600/20' : ''}`}
                      size="sm"
                    >
                      {canAfford ? 'Купить' : 'Не хватает ₽'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Balance */}
      <div className="fixed bottom-24 left-4 right-4">
        <Card className="glass-dark">
          <CardContent className="p-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Баланс:</span>
              <span className="text-lg font-bold text-foreground">{gameState.coins.toLocaleString()}</span>
              <span className="text-green-500">₽</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}