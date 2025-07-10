import TelegramBot from 'node-telegram-bot-api';

interface TelegramBotConfig {
  token: string;
  webAppUrl: string;
}

export class CarTycoonBot {
  private bot: TelegramBot;
  private webAppUrl: string;

  constructor(config: TelegramBotConfig) {
    this.bot = new TelegramBot(config.token, { polling: true });
    this.webAppUrl = config.webAppUrl;
    this.setupCommands();
    this.setupHandlers();
  }

  private setupCommands() {
    // Устанавливаем команды бота
    this.bot.setMyCommands([
      { command: 'start', description: '🚗 Запустить Car Tycoon игру' },
      { command: 'help', description: '❓ Помощь по игре' },
      { command: 'stats', description: '📊 Статистика игрока' }
    ]);
  }

  private setupHandlers() {
    // Команда /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Игрок';
      
      try {
        // Проверяем является ли URL HTTPS для WebApp
        const isHttps = this.webAppUrl.startsWith('https://');
        
        let keyboard;
        let message = `🎮 Привет, ${firstName}!\n\n` +
          `Добро пожаловать в **Car Tycoon** — самую захватывающую игру про автомобильную империю!\n\n` +
          `🚗 Кликай, зарабатывай монеты\n` +
          `🏭 Покупай и улучшай заводы\n` +
          `💰 Строй автомобильную империю\n\n`;

        if (isHttps) {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🚗 Играть в Car Tycoon',
                web_app: { url: this.webAppUrl }
              }
            ]]
          };
          message += `Нажми кнопку ниже, чтобы начать играть!`;
        } else {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🔗 Открыть игру',
                url: this.webAppUrl
              }
            ]]
          };
          message += `Открой игру по ссылке ниже:\n${this.webAppUrl}`;
        }

        await this.bot.sendMessage(chatId, message, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      } catch (error) {
        console.error('Ошибка в команде /start:', error);
        // Отправляем простое сообщение без кнопок
        await this.bot.sendMessage(chatId,
          `🎮 Привет, ${firstName}!\n\n` +
          `Добро пожаловать в Car Tycoon!\n\n` +
          `Игра: ${this.webAppUrl}\n\n` +
          `Команды: /help /stats`
        );
      }
    });

    // Команда /help
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      
      try {
        const isHttps = this.webAppUrl.startsWith('https://');
        let keyboard;

        if (isHttps) {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🚗 Играть сейчас',
                web_app: { url: this.webAppUrl }
              }
            ]]
          };
        } else {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🔗 Открыть игру',
                url: this.webAppUrl
              }
            ]]
          };
        }

        await this.bot.sendMessage(chatId,
          `🎮 **Car Tycoon - Помощь**\n\n` +
          `🎯 **Цель игры:**\n` +
          `Построй самую большую автомобильную империю!\n\n` +
          `🎲 **Как играть:**\n` +
          `• Нажимай кнопку "Заработать монеты"\n` +
          `• Покупай автозаводы для пассивного дохода\n` +
          `• Улучшай машины и заводы\n` +
          `• Следи за статистикой в профиле\n\n` +
          `💡 **Советы:**\n` +
          `• Чем больше кликов - тем больше монет\n` +
          `• Заводы приносят монеты автоматически\n` +
          `• Следи за достижениями\n\n` +
          `Удачи в построении империи! 🏆`,
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard
          }
        );
      } catch (error) {
        console.error('Ошибка в команде /help:', error);
      }
    });

    // Команда /stats
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      
      try {
        const isHttps = this.webAppUrl.startsWith('https://');
        let keyboard;

        if (isHttps) {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🚗 Открыть игру',
                web_app: { url: this.webAppUrl }
              }
            ]]
          };
        } else {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🔗 Открыть игру',
                url: this.webAppUrl
              }
            ]]
          };
        }

        await this.bot.sendMessage(chatId,
          `📊 **Твоя статистика в Car Tycoon**\n\n` +
          `👤 ID игрока: \`${userId}\`\n` +
          `🎮 Игра: Car Tycoon\n` +
          `📱 Платформа: Telegram WebApp\n\n` +
          `Открой игру, чтобы увидеть подробную статистику!`,
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard
          }
        );
      } catch (error) {
        console.error('Ошибка в команде /stats:', error);
      }
    });

    // Обработка данных из WebApp
    this.bot.on('web_app_data', (msg) => {
      const chatId = msg.chat.id;
      const data = msg.web_app_data?.data;
      
      try {
        const gameData = JSON.parse(data || '{}');
        
        // Обрабатываем данные из игры
        if (gameData.action === 'save_progress') {
          this.bot.sendMessage(chatId, 
            `💾 Прогресс сохранен!\n\n` +
            `💰 Монеты: ${gameData.coins || 0}\n` +
            `🖱️ Кликов: ${gameData.totalClicks || 0}`
          );
        } else if (gameData.action === 'achievement') {
          this.bot.sendMessage(chatId,
            `🏆 Поздравляем! Новое достижение!\n\n` +
            `${gameData.achievement || 'Неизвестное достижение'}`
          );
        }
      } catch (error) {
        console.error('Ошибка обработки данных WebApp:', error);
      }
    });

    // Обработка обычных сообщений
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      
      // Игнорируем команды и данные WebApp
      if (text?.startsWith('/') || msg.web_app_data) {
        return;
      }

      try {
        const isHttps = this.webAppUrl.startsWith('https://');
        let keyboard;

        if (isHttps) {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🚗 Играть в Car Tycoon',
                web_app: { url: this.webAppUrl }
              }
            ]]
          };
        } else {
          keyboard = {
            inline_keyboard: [[
              {
                text: '🔗 Открыть игру',
                url: this.webAppUrl
              }
            ]]
          };
        }

        await this.bot.sendMessage(chatId,
          `🎮 Привет! Я бот игры Car Tycoon.\n\n` +
          `Используй команды:\n` +
          `/start - Начать игру\n` +
          `/help - Помощь\n` +
          `/stats - Статистика\n\n` +
          `Или сразу запускай игру!`,
          { reply_markup: keyboard }
        );
      } catch (error) {
        console.error('Ошибка в обработке сообщения:', error);
      }
    });

    // Обработка ошибок
    this.bot.on('polling_error', (error) => {
      console.error('Ошибка Telegram бота:', error);
    });
  }

  // Метод для отправки уведомлений игрокам
  public async sendNotification(chatId: number, message: string) {
    try {
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Ошибка отправки уведомления:', error);
    }
  }

  // Метод для получения информации о пользователе
  public async getUserInfo(userId: number) {
    try {
      return await this.bot.getChat(userId);
    } catch (error) {
      console.error('Ошибка получения информации о пользователе:', error);
      return null;
    }
  }
}

// Функция для запуска бота
export function createTelegramBot(token: string, webAppUrl: string): CarTycoonBot {
  return new CarTycoonBot({ token, webAppUrl });
}