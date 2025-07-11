import { useState, useEffect, useCallback } from 'react';

interface GameState {
  coins: number;
  level: number;
  energy: number;
  maxEnergy: number;
  hourlyIncome: number;
  boostsUsedToday: number;
  boostActive: boolean;
  boostEndTime: number;
  lastEnergyUpdate: number;
  introShown: boolean;
}

const INITIAL_STATE: GameState = {
  coins: 0,
  level: 1,
  energy: 1000,
  maxEnergy: 1000,
  hourlyIncome: 10,
  boostsUsedToday: 0,
  boostActive: false,
  boostEndTime: 0,
  lastEnergyUpdate: Date.now(),
  introShown: false,
};

// Вспомогательные функции
const ENERGY_REGEN_RATE = 1000 / (10 * 60 * 1000); // 1000 энергии за 10 минут
const BOOST_DURATION = 5 * 60 * 1000; // 5 минут
const BOOST_MULTIPLIER = 1.5;
const COINS_PER_LEVEL = 100;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('carTycoonGame');
    const savedIntro = localStorage.getItem('carTycoonIntro');
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState(prev => ({ ...prev, ...parsed }));
    }
    
    if (savedIntro === 'true') {
      setGameState(prev => ({ ...prev, introShown: true }));
    }
  }, []);

  // Save game state to localStorage
  const saveGameState = useCallback((state: GameState) => {
    localStorage.setItem('carTycoonGame', JSON.stringify(state));
    
    if (state.introShown) {
      localStorage.setItem('carTycoonIntro', 'true');
    }
  }, []);

  // Update game state and save
  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      saveGameState(newState);
      return newState;
    });
  }, [saveGameState]);

  // Восстановление энергии
  const updateEnergy = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - gameState.lastEnergyUpdate;
    const energyToAdd = Math.floor(timeDiff * ENERGY_REGEN_RATE);
    
    if (energyToAdd > 0) {
      const newEnergy = Math.min(gameState.energy + energyToAdd, gameState.maxEnergy);
      updateGameState({
        energy: newEnergy,
        lastEnergyUpdate: now,
      });
    }
  }, [gameState.energy, gameState.maxEnergy, gameState.lastEnergyUpdate, updateGameState]);

  // Проверка и завершение буста
  const checkBoostExpired = useCallback(() => {
    if (gameState.boostActive && Date.now() > gameState.boostEndTime) {
      updateGameState({
        boostActive: false,
        boostEndTime: 0,
      });
    }
  }, [gameState.boostActive, gameState.boostEndTime, updateGameState]);

  // Обновление уровня
  const updateLevel = useCallback((coins: number) => {
    const newLevel = Math.floor(coins / COINS_PER_LEVEL) + 1;
    if (newLevel !== gameState.level) {
      updateGameState({ level: newLevel });
    }
  }, [gameState.level, updateGameState]);

  // Заработать монеты (клик)
  const earnCoins = useCallback(() => {
    if (gameState.energy <= 0) return false;

    const multiplier = gameState.boostActive ? BOOST_MULTIPLIER : 1;
    const coinsEarned = Math.floor(1 * multiplier);
    const newCoins = gameState.coins + coinsEarned;
    
    updateGameState({
      coins: newCoins,
      energy: gameState.energy - 1,
    });

    updateLevel(newCoins);
    return true;
  }, [gameState.coins, gameState.energy, gameState.boostActive, updateGameState, updateLevel]);

  // Активировать буст
  const activateBoost = useCallback(() => {
    if (gameState.boostsUsedToday >= 2 || gameState.boostActive) return false;

    const boostEndTime = Date.now() + BOOST_DURATION;
    const newMaxEnergy = Math.floor(gameState.maxEnergy * BOOST_MULTIPLIER);
    
    updateGameState({
      boostActive: true,
      boostEndTime,
      boostsUsedToday: gameState.boostsUsedToday + 1,
      maxEnergy: newMaxEnergy,
      energy: Math.min(gameState.energy, newMaxEnergy),
    });

    return true;
  }, [gameState.boostsUsedToday, gameState.boostActive, gameState.maxEnergy, gameState.energy, updateGameState]);

  // Complete intro
  const completeIntro = useCallback(() => {
    updateGameState({ introShown: true });
  }, [updateGameState]);

  // Сброс ежедневных бустов (можно вызывать в начале нового дня)
  const resetDailyBoosts = useCallback(() => {
    updateGameState({ boostsUsedToday: 0 });
  }, [updateGameState]);

  // Периодические обновления
  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy();
      checkBoostExpired();
      saveGameState(gameState);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, updateEnergy, checkBoostExpired, saveGameState]);

  // Вычисляемые значения
  const canClick = gameState.energy > 0;
  const canBoost = gameState.boostsUsedToday < 2 && !gameState.boostActive;
  const levelProgress = (gameState.coins % COINS_PER_LEVEL) / COINS_PER_LEVEL * 100;
  const boostTimeLeft = gameState.boostActive ? Math.max(0, gameState.boostEndTime - Date.now()) : 0;

  return {
    gameState,
    earnCoins,
    activateBoost,
    completeIntro,
    updateGameState,
    resetDailyBoosts,
    canClick,
    canBoost,
    levelProgress,
    boostTimeLeft,
  };
}
