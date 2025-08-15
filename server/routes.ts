import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all upgrade cards
  app.get('/api/upgrade-cards', async (req, res) => {
    try {
      const cards = await storage.getAllUpgradeCards();
      res.json(cards);
    } catch (error) {
      console.error('Error fetching upgrade cards:', error);
      res.status(500).json({ error: 'Failed to fetch upgrade cards' });
    }
  });

  // Get user's purchased cards
  app.get('/api/user-cards/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const cards = await storage.getUserCards(userId);
      res.json(cards);
    } catch (error) {
      console.error('Error fetching user cards:', error);
      res.status(500).json({ error: 'Failed to fetch user cards' });
    }
  });

  // Purchase a card
  app.post('/api/purchase-card', async (req, res) => {
    try {
      const { userId, cardId } = req.body;
      
      if (!userId || !cardId) {
        return res.status(400).json({ error: 'userId and cardId are required' });
      }

      // Get the card details to check price
      const allCards = await storage.getAllUpgradeCards();
      const card = allCards.find(c => c.id === parseInt(cardId));
      
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      // Purchase the card (balance is handled on frontend for localStorage approach)
      const userCard = await storage.purchaseCard(userId, parseInt(cardId));
      
      // Return the user card with card details
      res.json({ ...userCard, cardId: parseInt(cardId) });
    } catch (error) {
      console.error('Error purchasing card:', error);
      res.status(500).json({ error: 'Failed to purchase card' });
    }
  });

  // Check offline income
  app.get('/api/offline-income/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const offlineData = await storage.calculateOfflineIncome(userId);
      res.json(offlineData);
    } catch (error) {
      console.error('Error calculating offline income:', error);
      res.status(500).json({ error: 'Failed to calculate offline income' });
    }
  });

  // Update last seen timestamp
  app.post('/api/update-last-seen', async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      await storage.updateGameProfile(parseInt(userId), {
        lastSeenAt: Math.floor(Date.now() / 1000)
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating last seen:', error);
      res.status(500).json({ error: 'Failed to update last seen' });
    }
  });

  // Update user's hourly income based on car configuration
  app.post('/api/update-hourly-income', async (req, res) => {
    try {
      const { userId, carPrice, upgradeCardBonus } = req.body;
      
      if (!userId || !carPrice) {
        return res.status(400).json({ error: 'userId and carPrice are required' });
      }

      await storage.updateUserHourlyIncome(userId, carPrice, upgradeCardBonus || 0);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating hourly income:', error);
      res.status(500).json({ error: 'Failed to update hourly income' });
    }
  });

  // Initialize default cards (run once)
  app.post('/api/init-cards', async (req, res) => {
    try {
      // Check if cards already exist
      const existingCards = await storage.getAllUpgradeCards();
      if (existingCards.length > 0) {
        return res.json({ message: 'Cards already initialized' });
      }

      // Create default upgrade cards with logical pricing
      const defaultCards = [
        // Common Cards (+1 income/hour)
        { name: 'Мойка машин', description: 'Простая мойка приносит базовый доход', rarity: 'common', incomeBoost: 1, price: 50, imageUrl: null },
        { name: 'Парковка', description: 'Место для парковки авто', rarity: 'common', incomeBoost: 1, price: 75, imageUrl: null },
        { name: 'Заправка', description: 'Заправочная станция для автомобилей', rarity: 'common', incomeBoost: 1, price: 100, imageUrl: null },
        
        // Rare Cards (+5 income/hour)  
        { name: 'СТО', description: 'Станция технического обслуживания', rarity: 'rare', incomeBoost: 5, price: 500, imageUrl: null },
        { name: 'Автомагазин', description: 'Магазин запчастей и аксессуаров', rarity: 'rare', incomeBoost: 5, price: 750, imageUrl: null },
        { name: 'Детейлинг-центр', description: 'Профессиональная химчистка авто', rarity: 'rare', incomeBoost: 5, price: 1000, imageUrl: null },
        
        // Epic Cards (+20 income/hour)
        { name: 'Автосалон', description: 'Продажа новых автомобилей', rarity: 'epic', incomeBoost: 20, price: 5000, imageUrl: null },
        { name: 'Тюнинг-ателье', description: 'Профессиональный тюнинг авто', rarity: 'epic', incomeBoost: 20, price: 7500, imageUrl: null },
        { name: 'Гоночная трасса', description: 'Сдача трассы в аренду для гонок', rarity: 'epic', incomeBoost: 20, price: 10000, imageUrl: null },
        
        // Legendary Cards (+50 income/hour)
        { name: 'Автозавод', description: 'Собственное производство автомобилей', rarity: 'legendary', incomeBoost: 50, price: 25000, imageUrl: null },
        { name: 'Суперкар-дилер', description: 'Эксклюзивная продажа суперкаров', rarity: 'legendary', incomeBoost: 50, price: 35000, imageUrl: null },
        { name: 'Автоимперия', description: 'Целая сеть автобизнеса', rarity: 'legendary', incomeBoost: 50, price: 50000, imageUrl: null }
      ];

      for (const card of defaultCards) {
        await storage.createUpgradeCard(card);
      }

      res.json({ message: `Created ${defaultCards.length} default upgrade cards` });
    } catch (error) {
      console.error('Error initializing cards:', error);
      res.status(500).json({ error: 'Failed to initialize cards' });
    }
  });

  // Get user profile photo from Telegram
  app.get('/api/user-photo/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // For development/testing, return a demo avatar for demonstration
      if (userId === 'anon' || userId === 'dev-user-123' || userId.startsWith('telegram_user_')) {
        // Return a demo avatar URL for testing purposes
        const demoAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
        return res.json({ photoUrl: demoAvatarUrl });
      }

      // In a real implementation, you would use Telegram Bot API here:
      // const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}`);
      // const data = await response.json();
      // if (data.ok && data.result.total_count > 0) {
      //   const fileId = data.result.photos[0][0].file_id;
      //   const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
      //   const fileData = await fileResponse.json();
      //   if (fileData.ok) {
      //     const photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
      //     return res.json({ photoUrl });
      //   }
      // }

      res.json({ photoUrl: null });
    } catch (error) {
      console.error('Error fetching user photo:', error);
      res.status(500).json({ error: 'Failed to fetch user photo' });
    }
  });

  // Admin endpoint to reset all users (for testing)
  app.post('/api/admin/reset-users', (req, res) => {
    try {
      console.log('🔄 Запрос на сброс всех пользователей получен');
      res.json({ 
        status: 'success', 
        message: 'Клиенты должны очистить localStorage и перезагрузить страницу',
        instruction: 'localStorage.clear(); window.location.reload();'
      });
    } catch (error) {
      console.error('Ошибка при сбросе пользователей:', error);
      res.status(500).json({ status: 'error', message: 'Не удалось сбросить пользователей' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
