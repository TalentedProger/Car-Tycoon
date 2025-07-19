import { useState, useEffect, useCallback } from 'react';
import { Achievement } from '@/components/AchievementCard';
import { achievements as initialAchievements } from '@/data/achievements';

interface AchievementData {
  achievements: Achievement[];
  totalXPEarned: number;
}

export function useAchievements() {
  const [achievementData, setAchievementData] = useState<AchievementData>(() => {
    try {
      const saved = localStorage.getItem('carTycoonAchievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          achievements: parsed.achievements || initialAchievements,
          totalXPEarned: parsed.totalXPEarned || 0
        };
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
    
    return {
      achievements: initialAchievements,
      totalXPEarned: 0
    };
  });

  // Save to localStorage whenever data changes
  const saveAchievements = useCallback((data: AchievementData) => {
    try {
      localStorage.setItem('carTycoonAchievements', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }, []);

  // Update achievement progress
  const updateAchievementProgress = useCallback((achievementId: string, newProgress: number) => {
    setAchievementData(prev => {
      const updated = {
        ...prev,
        achievements: prev.achievements.map(achievement => {
          if (achievement.id === achievementId) {
            const updatedAchievement = {
              ...achievement,
              progress: Math.min(newProgress, achievement.maxProgress),
              completed: newProgress >= achievement.maxProgress
            };
            return updatedAchievement;
          }
          return achievement;
        })
      };
      
      saveAchievements(updated);
      return updated;
    });
  }, [saveAchievements]);

  // Increment achievement progress
  const incrementAchievementProgress = useCallback((achievementId: string, increment: number = 1) => {
    setAchievementData(prev => {
      const achievement = prev.achievements.find(a => a.id === achievementId);
      if (achievement) {
        const newProgress = achievement.progress + increment;
        return {
          ...prev,
          achievements: prev.achievements.map(a => 
            a.id === achievementId 
              ? {
                  ...a,
                  progress: Math.min(newProgress, a.maxProgress),
                  completed: newProgress >= a.maxProgress
                }
              : a
          )
        };
      }
      return prev;
    });
  }, []);

  // Claim achievement reward
  const claimAchievement = useCallback((achievementId: string, onReward: (coins: number, xp: number) => void) => {
    setAchievementData(prev => {
      const achievement = prev.achievements.find(a => a.id === achievementId);
      if (achievement && achievement.completed && !achievement.claimed) {
        // Grant the rewards
        onReward(achievement.coinReward, achievement.xpReward);
        
        const updated = {
          ...prev,
          achievements: prev.achievements.map(a => 
            a.id === achievementId ? { ...a, claimed: true } : a
          ),
          totalXPEarned: prev.totalXPEarned + achievement.xpReward
        };
        
        saveAchievements(updated);
        return updated;
      }
      return prev;
    });
  }, [saveAchievements]);

  // Get achievements by category, sorted by rarity (ascending)
  const getAchievementsByCategory = useCallback((category: string) => {
    const rarityOrder = { basic: 1, rare: 2, epic: 3, legendary: 4 };
    return achievementData.achievements
      .filter(a => a.category === category)
      .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  }, [achievementData.achievements]);

  // Get achievement stats
  const getAchievementStats = useCallback(() => {
    const total = achievementData.achievements.length;
    const completed = achievementData.achievements.filter(a => a.completed).length;
    const claimed = achievementData.achievements.filter(a => a.claimed).length;
    const availableToClaim = achievementData.achievements.filter(a => a.completed && !a.claimed).length;
    
    return {
      total,
      completed,
      claimed,
      availableToClaim,
      completionPercentage: Math.round((completed / total) * 100)
    };
  }, [achievementData.achievements]);

  // Helper functions for common achievement triggers
  const trackDetailingService = useCallback((serviceType: string) => {
    switch (serviceType) {
      case 'wash':
        updateAchievementProgress('washed_new', 1);
        incrementAchievementProgress('clean_play', 1);
        break;
      case 'polish':
        incrementAchievementProgress('polishing_plus', 1);
        incrementAchievementProgress('clean_play', 1);
        break;
      case 'interior':
        updateAchievementProgress('salon_new', 1);
        incrementAchievementProgress('clean_play', 1);
        break;
      case 'full_detailing':
        updateAchievementProgress('better_factory', 1);
        incrementAchievementProgress('clean_play', 1);
        break;
    }
  }, [updateAchievementProgress, incrementAchievementProgress]);

  const trackDailyProfitClaim = useCallback(() => {
    incrementAchievementProgress('working_days', 1);
  }, [incrementAchievementProgress]);

  const trackAdWatch = useCallback(() => {
    incrementAchievementProgress('viewer_investor', 1);
  }, [incrementAchievementProgress]);

  const trackTotalEarnings = useCallback((amount: number) => {
    setAchievementData(prev => {
      const current = prev.achievements.find(a => a.id === 'financial_genius');
      if (current) {
        const newProgress = current.progress + amount;
        updateAchievementProgress('financial_genius', newProgress);
      }
      return prev;
    });
  }, [updateAchievementProgress]);

  const trackCarPurchase = useCallback(() => {
    incrementAchievementProgress('collector_pts', 1);
    // Add logic for different car classes when implemented
  }, [incrementAchievementProgress]);

  const trackTuningUpgrade = useCallback((upgradeType: string) => {
    switch (upgradeType) {
      case 'turbine':
        incrementAchievementProgress('turbine_heart', 1);
        break;
      case 'exterior':
        incrementAchievementProgress('beauty_details', 1);
        break;
      case 'engine_swap':
        updateAchievementProgress('full_swap', 1);
        break;
      case 'wheels':
        updateAchievementProgress('tire_service', 1);
        break;
      case 'audio':
        updateAchievementProgress('audio_pro', 1);
        break;
    }
  }, [updateAchievementProgress, incrementAchievementProgress]);

  return {
    achievements: achievementData.achievements,
    totalXPEarned: achievementData.totalXPEarned,
    updateAchievementProgress,
    incrementAchievementProgress,
    claimAchievement,
    getAchievementsByCategory,
    getAchievementStats,
    // Helper functions
    trackDetailingService,
    trackDailyProfitClaim,
    trackAdWatch,
    trackTotalEarnings,
    trackCarPurchase,
    trackTuningUpgrade
  };
}