import { useEffect, useState } from 'react';

interface TelegramWebApp {
  expand: () => void;
  ready: () => void;
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
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      
      // Initialize Telegram WebApp
      tgWebApp.ready();
      tgWebApp.expand();
      
      // Get user ID
      const tgUserId = tgWebApp.initDataUnsafe?.user?.id;
      if (tgUserId) {
        setUserId(String(tgUserId));
      }
    }
  }, []);

  return { userId, webApp };
}
