# Руководство по сбросу базы данных и пользовательских данных

## Текущее состояние проекта

На данный момент в проекте Auto Arena **НЕ ИСПОЛЬЗУЕТСЯ** база данных PostgreSQL. Все данные пользователей хранятся в браузере (localStorage).

## Как сбросить данные пользователей

### 1. Сброс данных через localStorage (текущий метод)

Поскольку все данные хранятся в localStorage браузера, сброс происходит на стороне клиента:

#### Способ 1: Через консоль браузера
```javascript
// Очистить все данные игры
localStorage.removeItem('gameState');
localStorage.removeItem('selectedStarterCar');
localStorage.removeItem('introCompleted');

// Или очистить весь localStorage
localStorage.clear();

// Перезагрузить страницу
window.location.reload();
```

#### Способ 2: Через код приложения
Добавить кнопку сброса в настройки игры:

```javascript
const resetGameData = () => {
  localStorage.removeItem('gameState');
  localStorage.removeItem('selectedStarterCar');
  localStorage.removeItem('introCompleted');
  window.location.reload();
};
```

### 2. Если в будущем будет настроена PostgreSQL база данных

#### Создание базы данных
```bash
# В терминале Replit
npx drizzle-kit generate
npx drizzle-kit push
```

#### SQL команды для сброса
```sql
-- Удалить все данные из таблиц (сохранить структуру)
DELETE FROM game_profiles;
DELETE FROM users;
DELETE FROM sessions;

-- Или полностью пересоздать таблицы
DROP TABLE IF EXISTS game_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS sessions CASCADE;

-- Затем пересоздать схему
-- (выполнить миграции заново)
```

#### Через интерфейс Replit
1. Откройте панель "Database" в Replit
2. Выберите PostgreSQL базу данных
3. Выполните SQL команды выше
4. Или используйте кнопку "Reset Database" если доступна

### 3. Программный сброс данных

Создать endpoint для сброса всех данных:

```typescript
// В server/routes.ts
app.post('/api/reset-all-data', async (req, res) => {
  try {
    // Если используется база данных
    await db.delete(gameProfiles);
    await db.delete(users);
    
    res.json({ success: true, message: 'Все данные сброшены' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сброса данных' });
  }
});
```

### 4. Автоматический сброс при обновлении

Добавить версионирование в localStorage:

```javascript
const GAME_VERSION = '1.0.0';
const currentVersion = localStorage.getItem('gameVersion');

if (currentVersion !== GAME_VERSION) {
  // Сбросить данные при обновлении версии
  localStorage.clear();
  localStorage.setItem('gameVersion', GAME_VERSION);
}
```

## Быстрые команды для разработчика

### Очистка всех данных localStorage
```javascript
// В консоли браузера
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('game') || key.startsWith('intro') || key.startsWith('selected')) {
    localStorage.removeItem(key);
  }
});
window.location.reload();
```

### Проверка текущих данных
```javascript
// Посмотреть все данные игры
console.log('Game State:', localStorage.getItem('gameState'));
console.log('Selected Car:', localStorage.getItem('selectedStarterCar'));
console.log('Intro Completed:', localStorage.getItem('introCompleted'));
```

## Рекомендации

1. **Для разработки**: Используйте кнопку сброса в интерфейсе разработчика
2. **Для продакшена**: Создайте административную панель с возможностью сброса данных
3. **Для пользователей**: Добавьте опцию "Начать заново" в настройки игры
4. **Безопасность**: Никогда не давайте пользователям прямой доступ к сбросу базы данных

## Важные замечания

- ⚠️ Сброс данных **НЕОБРАТИМ**
- 🔄 После сброса все пользователи увидят экран знакомства заново
- 💾 localStorage очищается при переустановке браузера/приложения
- 🔒 В продакшене обязательно добавьте подтверждение перед сбросом

## Текущий статус
- ✅ localStorage используется для хранения данных
- ❌ PostgreSQL база данных не настроена
- 🟡 Требуется создание административных инструментов для управления данными