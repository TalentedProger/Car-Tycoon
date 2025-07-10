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
  }
}

export function useTelegram() {
  const [userId, setUserId] = useState<string>('anon');
  const [userName, setUserName] = useState<string>('Игрок');
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      
      // Initialize Telegram WebApp
      tgWebApp.ready();
      tgWebApp.expand();
      
      // Get user data
      const user = tgWebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(String(user.id));
        setUserName(user.first_name || user.username || 'Игрок');
      }
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
