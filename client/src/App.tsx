import { useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Intro from './components/Intro';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Factories from './pages/Factories';
import Profile from './pages/Profile';

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
    boostTimeLeft 
  } = useGameState();
  const { userId, userName, sendDataToBot } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');

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
          />
        );
      case 'factories':
        return <Factories />;
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
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
