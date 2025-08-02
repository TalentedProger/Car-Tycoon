import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DevTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Показать панель только если это dev режим или есть специальный URL параметр
  const isDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('devtools');
  
  if (!isDev) return null;

  const resetAllData = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }

    // Очистить все данные игры
    localStorage.removeItem('gameState');
    localStorage.removeItem('selectedStarterCar');
    localStorage.removeItem('introCompleted');
    
    // Можно также очистить весь localStorage
    // localStorage.clear();
    
    alert('Все данные игры сброшены! Страница будет перезагружена.');
    window.location.reload();
  };

  const showCurrentData = () => {
    const gameState = localStorage.getItem('gameState');
    const selectedCar = localStorage.getItem('selectedStarterCar');
    const introCompleted = localStorage.getItem('introCompleted');
    
    console.log('=== ДАННЫЕ ИГРЫ ===');
    console.log('Game State:', gameState ? JSON.parse(gameState) : 'Нет данных');
    console.log('Selected Car:', selectedCar ? JSON.parse(selectedCar) : 'Нет данных');
    console.log('Intro Completed:', introCompleted);
    console.log('==================');
    
    alert('Данные выведены в консоль браузера (F12)');
  };

  const forceIntroRestart = () => {
    localStorage.removeItem('introCompleted');
    localStorage.removeItem('selectedStarterCar');
    alert('Intro сброшен! Страница будет перезагружена.');
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
        >
          DEV
        </Button>
      ) : (
        <div className="bg-black/90 backdrop-blur-sm border border-red-500 rounded-lg p-4 min-w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-red-400 font-bold text-sm">Панель разработчика</h3>
            <Button
              onClick={() => {
                setIsVisible(false);
                setResetConfirm(false);
              }}
              className="bg-transparent hover:bg-red-600/20 text-red-400 text-xs px-2 py-1"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={showCurrentData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
            >
              Показать данные
            </Button>
            
            <Button
              onClick={forceIntroRestart}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-2"
            >
              Сбросить Intro
            </Button>
            
            <Button
              onClick={resetAllData}
              className={`w-full text-xs py-2 ${
                resetConfirm 
                  ? 'bg-red-800 hover:bg-red-900 animate-pulse' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              {resetConfirm ? 'ПОДТВЕРДИТЬ СБРОС!' : 'Сбросить всё'}
            </Button>
            
            {resetConfirm && (
              <p className="text-red-300 text-xs text-center">
                Повторно нажмите для подтверждения
              </p>
            )}
          </div>
          
          <div className="mt-4 pt-2 border-t border-red-500/30">
            <p className="text-gray-400 text-xs">
              Данные хранятся в localStorage
            </p>
          </div>
        </div>
      )}
    </div>
  );
}