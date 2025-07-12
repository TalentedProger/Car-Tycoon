import { useEffect, useState } from 'react';

interface TelegramWebApp {
  expand: () => void;
  ready: () => void;
  close: () => void;
  sendData: (data: string) => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  colorScheme: 'light' | 'dark';
  initDataUnsafe?: {
    user?: {
      id: string | number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
    TelegramGameProxy?: {
      receiveEvent: (event: string, data?: any) => void;
    };
  }
}

export function useTelegram() {
  const [userId, setUserId] = useState<string>('anon');
  const [userName, setUserName] = useState<string>('Игрок');
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    // Initialize TelegramGameProxy if it doesn't exist
    if (!window.TelegramGameProxy) {
      window.TelegramGameProxy = {
        receiveEvent: (event: string, data?: any) => {
          console.log('TelegramGameProxy.receiveEvent:', event, data);
        }
      };
    }

    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      
      // Initialize Telegram WebApp
      try {
        tgWebApp.ready();
        tgWebApp.expand();
        
        // Get user data
        const user = tgWebApp.initDataUnsafe?.user;
        if (user) {
          setUserId(String(user.id));
          setUserName(user.first_name || user.username || 'Игрок');
        }
      } catch (error) {
        console.error('Ошибка инициализации Telegram WebApp:', error);
      }
    } else {
      // Development mode - use mock data
      console.log('Telegram WebApp не найден, используем тестовые данные');
      setUserId('dev-user-123');
      setUserName('Тестовый игрок');
    }
  }, []);

  // Функция для отправки данных обратно в бота
  const sendDataToBot = (data: any) => {
    if (webApp && webApp.sendData) {
      try {
        webApp.sendData(JSON.stringify(data));
      } catch (error) {
        console.error('Ошибка отправки данных в бота:', error);
      }
    }
  };

  // Функция для закрытия WebApp
  const closeApp = () => {
    if (webApp && webApp.close) {
      webApp.close();
    }
  };

  // Получение темы Telegram
  const getTheme = () => {
    return webApp ? {
      colorScheme: webApp.colorScheme || 'light',
      themeParams: webApp.themeParams || {}
    } : { colorScheme: 'light' as const, themeParams: {} };
  };

  return { 
    userId, 
    userName,
    webApp, 
    sendDataToBot, 
    closeApp, 
    getTheme 
  };
}
