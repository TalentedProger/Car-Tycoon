import { useState, useEffect, useCallback } from 'react';

interface GameState {
  coins: number;
  totalClicks: number;
  introShown: boolean;
}

const INITIAL_STATE: GameState = {
  coins: 0,
  totalClicks: 0,
  introShown: false,
};

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
    localStorage.setItem('carTycoonGame', JSON.stringify({
      coins: state.coins,
      totalClicks: state.totalClicks,
    }));
    
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

  // Earn coins
  const earnCoins = useCallback(() => {
    updateGameState({
      coins: gameState.coins + 1,
      totalClicks: gameState.totalClicks + 1,
    });
  }, [gameState.coins, gameState.totalClicks, updateGameState]);

  // Complete intro
  const completeIntro = useCallback(() => {
    updateGameState({ introShown: true });
  }, [updateGameState]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveGameState(gameState);
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState, saveGameState]);

  return {
    gameState,
    earnCoins,
    completeIntro,
    updateGameState,
  };
}
