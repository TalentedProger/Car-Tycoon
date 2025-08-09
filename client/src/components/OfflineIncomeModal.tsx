import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Coins } from 'lucide-react';

interface OfflineIncomeModalProps {
  isOpen: boolean;
  hours: number;
  income: number;
  onClaim: () => void;
}

export default function OfflineIncomeModal({ isOpen, hours, income, onClaim }: OfflineIncomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-purple-800 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-purple-400/30">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="bg-green-500/20 p-4 rounded-full">
              <Gift className="h-12 w-12 text-green-400" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Получите доход за {hours} {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-300 mb-6">
            Пока вас не было, ваш бизнес работал!
          </p>

          {/* Income Display */}
          <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 p-4 rounded-xl mb-6 border border-green-400/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-400" />
              <span className="text-green-100">Время офлайн:</span>
            </div>
            <div className="text-lg text-green-200 mb-3">
              {hours} {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-6 w-6 text-yellow-400" />
              <span className="text-yellow-100">Заработано:</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {income.toLocaleString()} ₽
            </div>
          </div>

          {/* Claim Button */}
          <Button
            onClick={onClaim}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Забрать
          </Button>

          {/* Additional Info */}
          <p className="text-xs text-gray-400 mt-4">
            Максимальный офлайн доход: 24 часа
          </p>
        </div>
      </div>
    </div>
  );
}