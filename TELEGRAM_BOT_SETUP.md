# 🤖 Настройка Telegram бота для Car Tycoon

## Шаг 1: Создание бота

1. Найдите в Telegram бота **@BotFather**
2. Отправьте команду `/newbot`
3. Придумайте название для бота (например: "Car Tycoon Game")
4. Придумайте username для бота (например: "cartycoon_game_bot")
5. **Сохраните токен бота** - он понадобится для настройки

## Шаг 2: Настройка WebApp

1. В чате с @BotFather отправьте `/mybots`
2. Выберите вашего бота
3. Нажмите **"Bot Settings"**
4. Выберите **"Configure Mini App"**
5. Заполните данные:
   - **Short name**: cartycoon (3-30 символов, только буквы, цифры и подчеркивания)
   - **Title**: Car Tycoon
   - **Description**: Игра-кликер про автомобильную империю
   - **Photo**: Загрузите иконку игры (опционально)

## Шаг 3: Добавление токена в Replit

1. В Replit перейдите в **Secrets** (боковая панель)
2. Добавьте новый секрет:
   - **Key**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Ваш токен от BotFather
3. Сохраните секрет

## Шаг 4: Получение URL приложения

Ваше приложение уже запущено и доступно по адресу:
```
https://2d5e0313-e741-4525-a9b5-d108a71fcfc1-00-1mwv7oz3zeah7.picard.replit.dev
```

Этот URL автоматически определяется и используется ботом.

## Шаг 5: Обновление WebApp URL

1. Вернитесь к @BotFather
2. `/mybots` → Ваш бот → **"Bot Settings"** → **"Configure Mini App"**
3. Обновите **URL** на ваш Replit URL

## Шаг 6: Настройка Menu Button (опционально)

1. В @BotFather: `/mybots` → Ваш бот → **"Bot Settings"** → **"Menu Button"**
2. Включите Menu Button
3. Установите тот же URL что и для WebApp

## 🎮 Команды бота

После настройки ваш бот будет поддерживать:

- `/start` - Запуск игры с приветствием
- `/help` - Помощь по игре
- `/stats` - Статистика игрока
- Кнопка "Играть в Car Tycoon" для запуска WebApp

## 🔧 Функции интеграции

- **Автоматическая идентификация** пользователей через Telegram
- **Отправка прогресса** из игры в чат с ботом
- **Поддержка тем** Telegram (светлая/темная)
- **Полноэкранный режим** на мобильных устройствах

## 📱 Ссылка для запуска

После настройки игра будет доступна по ссылке:
```
https://t.me/[ваш_бот_username]/cartycoon
```

## ⚠️ Важные замечания

1. **HTTPS обязателен** - Telegram WebApp работает только по HTTPS
2. **Домен Replit** автоматически поддерживает HTTPS
3. **Токен бота** держите в секрете - не публикуйте его в коде
4. **Перезапустите сервер** после добавления токена в Secrets

## 🐛 Решение проблем

**Бот не отвечает:**
- Проверьте правильность токена в Secrets
- Убедитесь что сервер запущен
- Проверьте логи в консоли Replit

**WebApp не открывается:**
- Убедитесь что URL правильно настроен в @BotFather
- Проверьте что приложение доступно по HTTPS
- Очистите кеш Telegram (Settings → Advanced → Clear Cache)

**Не работает отправка данных:**
- Убедитесь что WebApp запущен через Telegram
- Проверьте что функция sendData вызывается корректно
- Посмотрите логи в Developer Tools браузера