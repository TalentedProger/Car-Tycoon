import React, { useState, useEffect, useCallback } from 'react';

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
  totalClicks: number;
  lastRewardTime: number;
  lastProfitClaim: number;
  dailyStreak: number;
  selectedStarterCar?: any;
  ownedCars: any[];
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
  totalClicks: 0,
  lastRewardTime: 0,
  lastProfitClaim: 0,
  dailyStreak: 0,
  selectedStarterCar: undefined,
  ownedCars: [],
};

// Вспомогательные функции
const ENERGY_REGEN_RATE = 1000 / (10 * 60 * 1000); // 1000 энергии за 10 минут
const BOOST_DURATION = 5 * 60 * 1000; // 5 минут
const BOOST_MULTIPLIER = 1.5;
const COINS_PER_LEVEL = 100;
const REWARD_INTERVAL = 12 * 60 * 60 * 1000; // 12 часов

// Функция для вычисления требуемых кликов для уровня
const getClicksForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(1000 * Math.pow(3, level - 2));
};

// Функция для вычисления уровня по кликам
const getLevelFromClicks = (clicks: number): number => {
  let level = 1;
  let totalClicks = 0;
  
  while (totalClicks + getClicksForLevel(level + 1) <= clicks) {
    totalClicks += getClicksForLevel(level + 1);
    level++;
  }
  
  return level;
};

// Функция для вычисления прогресса уровня
const getLevelProgress = (clicks: number, level: number): number => {
  const currentLevelClicks = getClicksForLevel(level);
  const nextLevelClicks = getClicksForLevel(level + 1);
  
  let totalClicksToCurrentLevel = 0;
  for (let i = 2; i <= level; i++) {
    totalClicksToCurrentLevel += getClicksForLevel(i);
  }
  
  const clicksInCurrentLevel = clicks - totalClicksToCurrentLevel;
  return (clicksInCurrentLevel / nextLevelClicks) * 100;
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      // Проверяем флаг принудительного сброса
      const forceReset = localStorage.getItem('forceReset');
      if (forceReset === 'true') {
        // Очищаем все данные и удаляем флаг сброса
        localStorage.clear();
        console.log('Выполнен принудительный сброс всех пользователей');
        return INITIAL_STATE;
      }

      const savedState = localStorage.getItem('carTycoonGame');
      const savedIntro = localStorage.getItem('carTycoonIntro');
      
      let initialState = { ...INITIAL_STATE };
      
      if (savedState) {
        const parsed = JSON.parse(savedState);
        initialState = { ...initialState, ...parsed };
      }
      
      if (savedIntro === 'true') {
        initialState = { ...initialState, introShown: true };
      }
      
      return initialState;
    } catch (error) {
      console.error('Error loading game state:', error);
      return INITIAL_STATE;
    }
  });

  // Save game state to localStorage
  const saveGameState = useCallback((state: GameState) => {
    try {
      localStorage.setItem('carTycoonGame', JSON.stringify(state));
      
      if (state.introShown) {
        localStorage.setItem('carTycoonIntro', 'true');
      }
    } catch (error) {
      console.error('Error saving game state:', error);
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
  const updateLevel = useCallback((totalClicks: number) => {
    const newLevel = getLevelFromClicks(totalClicks);
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
    const newTotalClicks = gameState.totalClicks + 1;
    
    updateGameState({
      coins: newCoins,
      energy: gameState.energy - 1,
      totalClicks: newTotalClicks,
    });

    updateLevel(newTotalClicks);
    return true;
  }, [gameState.coins, gameState.energy, gameState.boostActive, gameState.totalClicks, updateGameState, updateLevel]);

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
  const completeIntro = useCallback((selectedCar?: any) => {
    const updates: Partial<GameState> = { introShown: true };
    
    // If a car was selected, store it as owned car (no money given)
    if (selectedCar) {
      updates.selectedStarterCar = selectedCar;
      // Add the car to owned cars array
      updates.ownedCars = [selectedCar];
      // Set starting coins to default amount (no car price bonus)
      updates.coins = 100; // Small starting amount for game progression
    }
    
    updateGameState(updates);
  }, [updateGameState]);

  // Reset intro for all users (admin function)
  const resetIntroForAllUsers = useCallback(() => {
    // Clear localStorage intro flag
    localStorage.removeItem('carTycoonIntro');
    // Reset intro state
    updateGameState({ introShown: false });
  }, [updateGameState]);

  // Reset all users to initial screen (admin function)
  const resetAllUsersToInitial = useCallback(() => {
    // Set force reset flag - will trigger on next app load
    localStorage.setItem('forceReset', 'true');
    // Also immediately reset current user
    localStorage.clear();
    setGameState(INITIAL_STATE);
    console.log('Все пользователи будут сброшены при следующей загрузке приложения');
    // Force page reload to apply changes
    window.location.reload();
  }, []);

  // Проверка доступности награды
  const canClaimReward = useCallback(() => {
    const now = Date.now();
    return now - gameState.lastRewardTime >= REWARD_INTERVAL;
  }, [gameState.lastRewardTime]);

  // Получить награду (старая система)
  const claimReward = useCallback(() => {
    const canClaim = Date.now() - gameState.lastRewardTime >= REWARD_INTERVAL;
    if (!canClaim) return false;

    const rewardAmount = Math.floor(gameState.hourlyIncome * 10);
    const newCoins = gameState.coins + rewardAmount;
    
    updateGameState({
      coins: newCoins,
      lastRewardTime: Date.now(),
    });

    return true;
  }, [gameState.coins, gameState.hourlyIncome, gameState.lastRewardTime, updateGameState]);

  // Проверка доступности ежедневной прибыли
  const canClaimDailyProfit = useCallback(() => {
    const now = Date.now();
    return now - gameState.lastProfitClaim >= REWARD_INTERVAL;
  }, [gameState.lastProfitClaim]);

  // Получить ежедневную прибыль
  const claimDailyProfit = useCallback((amount: number, isDoubled: boolean) => {
    const now = Date.now();
    const canClaim = now - gameState.lastProfitClaim >= REWARD_INTERVAL;
    if (!canClaim) return false;

    const newCoins = gameState.coins + amount;
    
    // Update daily streak logic
    const lastClaimDate = new Date(gameState.lastProfitClaim).toDateString();
    const todayDate = new Date().toDateString();
    const yesterdayDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    let newStreak = gameState.dailyStreak;
    
    if (gameState.lastProfitClaim === 0) {
      // First time claiming
      newStreak = 1;
    } else if (lastClaimDate === yesterdayDate) {
      // Claimed yesterday, continue streak
      newStreak = Math.min(gameState.dailyStreak + 1, 7);
    } else if (lastClaimDate !== todayDate) {
      // Missed days, reset streak
      newStreak = 1;
    }
    
    updateGameState({
      coins: newCoins,
      lastProfitClaim: now,
      dailyStreak: newStreak,
    });

    return true;
  }, [gameState.coins, gameState.lastProfitClaim, gameState.dailyStreak, updateGameState]);

  // Сброс ежедневных бустов (можно вызывать в начале нового дня)
  const resetDailyBoosts = useCallback(() => {
    updateGameState({ boostsUsedToday: 0 });
  }, [updateGameState]);

  // Get current owned car (primary car for garage display)
  const getCurrentCar = useCallback(() => {
    // First check owned cars array
    if (gameState.ownedCars && gameState.ownedCars.length > 0) {
      return gameState.ownedCars[0]; // Return the first (primary) owned car
    }
    
    // Fallback to selected starter car
    if (gameState.selectedStarterCar) {
      return gameState.selectedStarterCar;
    }
    
    // Last fallback - check localStorage for legacy data
    try {
      const storedCar = localStorage.getItem('selectedStarterCar');
      if (storedCar) {
        const car = JSON.parse(storedCar);
        // Migrate to owned cars array
        updateGameState({ ownedCars: [car] });
        return car;
      }
    } catch (error) {
      console.error('Error retrieving stored car:', error);
    }
    
    return null;
  }, [gameState.ownedCars, gameState.selectedStarterCar, updateGameState]);

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
  const levelProgress = getLevelProgress(gameState.totalClicks, gameState.level);
  const boostTimeLeft = gameState.boostActive ? Math.max(0, gameState.boostEndTime - Date.now()) : 0;

  return {
    gameState,
    earnCoins,
    activateBoost,
    completeIntro,
    updateGameState,
    resetDailyBoosts,
    resetIntroForAllUsers,
    resetAllUsersToInitial,
    canClaimReward,
    claimReward,
    canClaimDailyProfit,
    claimDailyProfit,
    getCurrentCar,
    canClick,
    canBoost,
    levelProgress,
    boostTimeLeft,
  };
}
