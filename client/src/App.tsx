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
import { RewardModal } from './components/RewardModal';

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
    updateGameState
  } = useGameState();
  const { userId, userName, sendDataToBot } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handlePurchaseService = (serviceId: string, cost: number) => {
    if (gameState.coins >= cost) {
      updateGameState({
        coins: gameState.coins - cost
      });
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
    switch (activeTab) {
      case 'home':
        return (
          <Home
            gameState={gameState}
            onEarnCoins={earnCoins}
            onActivateBoost={activateBoost}
            canClick={canClick}
            canBoost={canBoost}
            levelProgress={levelProgress}
            boostTimeLeft={boostTimeLeft}
            onOpenReward={() => setShowRewardModal(true)}
            canClaimReward={canClaimReward()}
          />
        );
      case 'factories':
        return <Garage />;
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
          />
        );
      default:
        return (
          <Home
            gameState={gameState}
            onEarnCoins={earnCoins}
            onActivateBoost={activateBoost}
            canClick={canClick}
            canBoost={canBoost}
            levelProgress={levelProgress}
            boostTimeLeft={boostTimeLeft}
            onOpenReward={() => setShowRewardModal(true)}
            canClaimReward={canClaimReward()}
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
        
        <RewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          onClaimReward={claimReward}
          canClaimReward={canClaimReward()}
          rewardAmount={Math.floor(gameState.hourlyIncome * 10)}
          nextRewardTime={gameState.lastRewardTime + 12 * 60 * 60 * 1000}
        />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
