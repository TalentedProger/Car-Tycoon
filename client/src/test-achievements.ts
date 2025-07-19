// Test function to set some achievements as completed for testing
export function testAchievements() {
  const testData = {
    achievements: [
      // Set some achievements as completed for testing
      {
        id: 'washed_new',
        title: 'Помыл — как новенькая',
        description: 'Пройдите мойку авто',
        category: 'detailing',
        rarity: 'basic',
        progress: 1,
        maxProgress: 1,
        coinReward: 500,
        xpReward: 50,
        completed: true,
        claimed: false,
        icon: '🧼'
      },
      {
        id: 'polishing_plus',
        title: 'Полировка+',
        description: 'Сделайте полировку кузова 3 раза',
        category: 'detailing',
        rarity: 'basic',
        progress: 2,
        maxProgress: 3,
        coinReward: 1000,
        xpReward: 50,
        completed: false,
        claimed: false,
        icon: '🧴'
      },
      {
        id: 'working_days',
        title: 'Рабочие будни',
        description: 'Получите 30 ежедневных выплат',
        category: 'earnings',
        rarity: 'epic',
        progress: 5,
        maxProgress: 30,
        coinReward: 20000,
        xpReward: 200,
        completed: false,
        claimed: false,
        icon: '📆'
      }
    ],
    totalXPEarned: 150
  };

  localStorage.setItem('carTycoonAchievements', JSON.stringify(testData));
  console.log('Test achievements data set!');
}

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).testAchievements = testAchievements;
}