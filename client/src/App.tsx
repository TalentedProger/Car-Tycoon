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
  const { gameState, earnCoins, completeIntro } = useGameState();
  const { userId } = useTelegram();
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
            coins={gameState.coins}
            totalClicks={gameState.totalClicks}
            onEarnCoins={earnCoins}
          />
        );
      case 'factories':
        return <Factories />;
      case 'profile':
        return (
          <Profile
            userId={userId}
            coins={gameState.coins}
            totalClicks={gameState.totalClicks}
          />
        );
      default:
        return (
          <Home
            coins={gameState.coins}
            totalClicks={gameState.totalClicks}
            onEarnCoins={earnCoins}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 p-4">
            <h1 className="text-2xl font-bold text-center text-dark">
              🚗 Car Tycoon
            </h1>
          </header>

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
