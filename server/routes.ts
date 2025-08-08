import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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
