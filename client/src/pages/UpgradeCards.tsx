import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Zap, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type UpgradeCard } from '@shared/schema';

interface UpgradeCardsProps {
  onBack: () => void;
}

interface UserCard {
  id: number;
  userId: string;
  cardId: number;
  quantity: number;
  purchasedAt: number;
  card: UpgradeCard;
}

const rarityConfig = {
  common: {
    bgColor: 'bg-gray-700/40',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-100',
    glowColor: 'shadow-gray-400/20',
    icon: '⚪',
  },
  rare: {
    bgColor: 'bg-blue-700/40',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    glowColor: 'shadow-blue-400/30',
    icon: '🔵',
  },
  epic: {
    bgColor: 'bg-purple-700/40',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-100',
    glowColor: 'shadow-purple-400/30',
    icon: '🟣',
  },
  legendary: {
    bgColor: 'bg-yellow-600/40',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-100',
    glowColor: 'shadow-yellow-400/40',
    icon: '🟡',
  },
  mythic: {
    bgColor: 'bg-red-700/40',
    borderColor: 'border-red-400',
    textColor: 'text-red-100',
    glowColor: 'shadow-red-400/40',
    icon: '🔴',
  },
};

export default function UpgradeCards({ onBack }: UpgradeCardsProps) {
  const [coins, setCoins] = useState(0);
  const [userId, setUserId] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get user data from localStorage
    const gameState = localStorage.getItem('carTycoonGame');
    if (gameState) {
      const parsed = JSON.parse(gameState);
      setCoins(parsed.coins || 0);
    }
    
    const userIdFromStorage = localStorage.getItem('userId') || 'telegram_user_1';
    setUserId(userIdFromStorage);
  }, []);

  // Get base car income
  const getBaseCarIncome = () => {
    const gameState = localStorage.getItem('carTycoonGame');
    if (gameState) {
      const parsed = JSON.parse(gameState);
      const selectedCar = parsed.selectedStarterCar;
      
      // Car-specific base income rates
      const carIncomeRates: { [key: string]: number } = {
        'vaz-2107': 50,
        'mercedes-benz': 100,
        'bmw': 120,
        'audi': 110,
        'default': 50
      };
      
      return carIncomeRates[selectedCar] || carIncomeRates.default;
    }
    return 50; // Default for VAZ 2107
  };

  // Fetch all available upgrade cards
  const { data: upgradeCards = [], isLoading: cardsLoading } = useQuery<UpgradeCard[]>({
    queryKey: ['/api/upgrade-cards'],
    queryFn: async () => {
      const response = await fetch('/api/upgrade-cards');
      if (!response.ok) throw new Error('Failed to fetch cards');
      return response.json();
    },
  });

  // Fetch user's purchased cards
  const { data: userCards = [], refetch: refetchUserCards } = useQuery<UserCard[]>({
    queryKey: ['/api/user-cards', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user-cards/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user cards');
      return response.json();
    },
    enabled: !!userId,
  });

  // Purchase card mutation
  const purchaseCardMutation = useMutation({
    mutationFn: async ({ cardId, price }: { cardId: number; price: number }) => {
      if (coins < price) {
        throw new Error('Недостаточно монет');
      }

      const response = await fetch('/api/purchase-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cardId }),
      });

      if (!response.ok) throw new Error('Failed to purchase card');
      return response.json();
    },
    onSuccess: (result, { price }) => {
      // Update coins in localStorage and state
      const newCoins = coins - price;
      setCoins(newCoins);
      
      const gameState = localStorage.getItem('carTycoonGame');
      if (gameState) {
        const parsed = JSON.parse(gameState);
        parsed.coins = newCoins;
        // Update hourly income in game state
        const cardBoost = upgradeCards.find(c => c.id === result.cardId)?.incomeBoost || 0;
        parsed.hourlyIncome = (parsed.hourlyIncome || getBaseCarIncome()) + cardBoost;
        localStorage.setItem('carTycoonGame', JSON.stringify(parsed));
      }

      // Refetch user cards
      refetchUserCards();
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['/api/user-cards', userId] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const handlePurchase = (card: UpgradeCard) => {
    purchaseCardMutation.mutate({ cardId: card.id, price: card.price });
  };

  const canAfford = (price: number) => coins >= price;

  const getCardQuantity = (cardId: number) => {
    const userCard = userCards.find(uc => uc.cardId === cardId);
    return userCard?.quantity || 0;
  };

  const totalIncome = getBaseCarIncome() + userCards.reduce((total, userCard) => {
    return total + (userCard.card.incomeBoost * userCard.quantity);
  }, 0);

  if (cardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Загрузка карточек...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-start p-4 border-b border-gray-700/50">
        <Button 
          onClick={onBack}
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
      </div>
      
      {/* Title */}
      <div className="text-center py-4">
        <h1 className="text-xl font-bold text-white">Карточки улучшений</h1>
      </div>

      {/* Income Summary */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-lg">Доход в час: </span>
            <span className="text-xl font-bold text-green-400">{totalIncome} ₽</span>
          </div>
          <div className="text-sm text-gray-300">
            {userCards.length} карт куплено
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upgradeCards.map((card) => {
            const rarity = rarityConfig[card.rarity as keyof typeof rarityConfig] || rarityConfig.common;
            const quantity = getCardQuantity(card.id);
            const affordable = canAfford(card.price);

            return (
              <div
                key={card.id}
                className={`p-4 rounded-xl border-2 ${rarity.borderColor} ${rarity.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 ${rarity.glowColor} shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rarity.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{card.name}</h3>
                      <p className="text-xs capitalize opacity-80">{card.rarity}</p>
                    </div>
                  </div>
                  {quantity > 0 && (
                    <div className="bg-green-600/80 text-white text-xs px-2 py-1 rounded-full">
                      x{quantity}
                    </div>
                  )}
                </div>

                <p className="text-sm opacity-80 mb-4 line-clamp-2">
                  {card.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">+{card.incomeBoost} ₽/час</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-green-400">
                    {card.price.toLocaleString()} ₽
                  </div>
                  <Button
                    onClick={() => handlePurchase(card)}
                    disabled={!affordable || purchaseCardMutation.isPending}
                    className={`${
                      affordable 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } transition-colors`}
                    size="sm"
                  >
                    {purchaseCardMutation.isPending ? 'Покупка...' : 'Купить'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}