// Скрипт для сброса всех пользователей до первоначального экрана
console.log('Сбрасываем всех пользователей...');

// Очистить все данные localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
    console.log('LocalStorage очищен');
  }
} catch (error) {
  console.error('Ошибка при очистке localStorage:', error);
}

// Альтернативный способ - установить флаг сброса
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('forceReset', 'true');
    console.log('Установлен флаг принудительного сброса');
  }
} catch (error) {
  console.error('Ошибка при установке флага сброса:', error);
}

console.log('Сброс завершен. Обновите страницу для применения изменений.');