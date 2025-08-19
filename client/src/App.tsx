import React, { useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Intro from './components/Intro';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Garage from './pages/Factories';
import Profile from './pages/Profile';
import Detailing from './pages/Detailing';
import AutoSalon from './pages/AutoSalon';
import UpgradeCards from './pages/UpgradeCards';
import GIBDD from './pages/GIBDD';
import { DailyProfitModal } from './components/DailyProfitModal';
import OfflineIncomeModal from './components/OfflineIncomeModal';

import { useGameState } from './hooks/useGameState';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { 
    gameState, 
    earnCoins, 
    activateBoost, 
    completeIntro, 
    canClick, 
    canBoost, 
    levelProgress, 
    boostTimeLeft,
    canClaimReward,
    claimReward,
    canClaimDailyProfit,
    claimDailyProfit,
    getCurrentCar,
    updateGameState,
    resetIntroForAllUsers,
    resetAllUsersToInitial,
    addUpgradeSpending
  } = useGameState();

  // Reset intro data immediately for all users
  React.useEffect(() => {
    // Force reset intro data on app load to show new intro system
    const shouldReset = localStorage.getItem('forceIntroReset') !== 'done-v3';
    if (shouldReset) {
      localStorage.removeItem('carTycoonIntro');
      localStorage.removeItem('selectedStarterCar');
      localStorage.removeItem('forceIntroReset'); // Remove old flag
      
      const gameState = localStorage.getItem('carTycoonGame');
      if (gameState) {
        try {
          const parsed = JSON.parse(gameState);
          parsed.introShown = false;
          parsed.selectedStarterCar = undefined;
          localStorage.setItem('carTycoonGame', JSON.stringify(parsed));
        } catch (error) {
          console.error('Error resetting intro:', error);
        }
      }
      
      localStorage.setItem('forceIntroReset', 'done-v3');
      window.location.reload(); // Reload to apply changes
    }
  }, []);
  const { userId, userName, sendDataToBot } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState<'home' | 'upgrade-cards' | 'gibdd'>('home');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [offlineIncomeData, setOfflineIncomeData] = useState<{ hours: number; income: number } | null>(null);

  const handlePurchaseService = (serviceId: string, cost: number) => {
    if (gameState.coins >= cost) {
      updateGameState({
        coins: gameState.coins - cost
      });
    }
  };

  // Check for offline income on app load
  React.useEffect(() => {
    const checkOfflineIncome = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/offline-income/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.hours > 0 && data.income > 0) {
            setOfflineIncomeData(data);
          }
        }
      } catch (error) {
        console.error('Error checking offline income:', error);
      }
    };

    if (gameState.introShown) {
      checkOfflineIncome();
    }
  }, [userId, gameState.introShown]);

  // Claim offline income
  const claimOfflineIncome = async () => {
    if (!offlineIncomeData || !userId) return;

    try {
      // Update user's coins
      updateGameState({
        coins: gameState.coins + offlineIncomeData.income
      });

      // Update last seen timestamp
      await fetch('/api/update-last-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      setOfflineIncomeData(null);
    } catch (error) {
      console.error('Error claiming offline income:', error);
    }
  };

  // Show intro screens if not shown before
  if (!gameState.introShown) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Intro onComplete={completeIntro} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const renderScreen = () => {
    // Handle upgrade cards view
    if (currentView === 'upgrade-cards') {
      return <UpgradeCards onBack={() => setCurrentView('home')} />;
    }

    // Handle GIBDD view
    if (currentView === 'gibdd') {
      return <GIBDD onBack={() => setCurrentView('home')} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home
            gameState={{
              ...gameState,
              ownedCars: gameState.ownedCars,
              selectedStarterCar: gameState.selectedStarterCar
            }}
            onEarnCoins={earnCoins}
            onActivateBoost={activateBoost}
            canClick={canClick}
            canBoost={canBoost}
            levelProgress={levelProgress}
            boostTimeLeft={boostTimeLeft}
            onOpenReward={() => setShowRewardModal(true)}
            canClaimReward={canClaimDailyProfit()}
            setCurrentView={setCurrentView}
            onShowGIBDD={() => setCurrentView('gibdd')}
          />
        );
      case 'factories':
        return <Garage onNavigate={setActiveTab} getCurrentCar={getCurrentCar} gameState={gameState} />;
      case 'autosalon':
        return <AutoSalon gameState={gameState} />;
      case 'detailing':
        return (
          <Detailing 
            gameState={gameState} 
            onPurchaseService={handlePurchaseService}
          />
        );
      case 'profile':
        return (
          <Profile
            userId={userId}
            gameState={gameState}
            updateGameState={updateGameState}
          />
        );
      default:
        return (
          <Home
            gameState={{
              ...gameState,
              ownedCars: gameState.ownedCars,
              selectedStarterCar: gameState.selectedStarterCar
            }}
            onEarnCoins={earnCoins}
            onActivateBoost={activateBoost}
            canClick={canClick}
            canBoost={canBoost}
            levelProgress={levelProgress}
            boostTimeLeft={boostTimeLeft}
            onOpenReward={() => setShowRewardModal(true)}
            canClaimReward={canClaimDailyProfit()}
            setCurrentView={setCurrentView}
            onShowGIBDD={() => setCurrentView('gibdd')}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          {/* Main Content */}
          <main className="flex-1">
            {renderScreen()}
          </main>

          {/* Bottom Navigation */}
          <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        <DailyProfitModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          onClaimProfit={claimDailyProfit}
          gameState={gameState}
        />

        <OfflineIncomeModal
          isOpen={!!offlineIncomeData}
          hours={offlineIncomeData?.hours || 0}
          income={offlineIncomeData?.income || 0}
          onClaim={claimOfflineIncome}
        />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
