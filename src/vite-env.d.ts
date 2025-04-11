
/// <reference types="vite/client" />

// Define Telegram WebApp interface for TypeScript globally
interface TelegramWebApp {
  WebApp: {
    ready: () => void;
    initData: string;
    MainButton: {
      setText: (text: string) => void;
      show: () => void;
      hide: () => void;
      onClick: (callback: () => void) => void;
    };
    onEvent: (eventType: string, callback: () => void) => void;
    openTelegramLink: (url: string) => void;
  };
}

// Add to global Window interface
interface Window {
  Telegram?: TelegramWebApp;
}
