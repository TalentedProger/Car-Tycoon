// Initialize Telegram WebApp and prevent runtime errors
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
    TelegramGameProxy?: {
      receiveEvent: (event: string, data?: any) => void;
    };
  }
}

// Initialize TelegramGameProxy to prevent runtime errors
if (typeof window !== 'undefined' && !window.TelegramGameProxy) {
  window.TelegramGameProxy = {
    receiveEvent: (event: string, data?: any) => {
      console.log('TelegramGameProxy.receiveEvent:', event, data);
    }
  };
}

// Add error handling for Telegram WebApp
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('TelegramGameProxy')) {
    console.warn('TelegramGameProxy error handled:', event.message);
    event.preventDefault();
  }
});

export {};