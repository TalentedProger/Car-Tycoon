// Script to reset intro for all users
// This will clear the localStorage flag that tracks if intro was shown
console.log('Сброс данных интро для всех пользователей...');

// Clear the intro flag
localStorage.removeItem('carTycoonIntro');
localStorage.removeItem('selectedStarterCar');

// Also reset the game state intro flag
const gameState = localStorage.getItem('carTycoonGame');
if (gameState) {
  try {
    const parsed = JSON.parse(gameState);
    parsed.introShown = false;
    parsed.selectedStarterCar = undefined;
    localStorage.setItem('carTycoonGame', JSON.stringify(parsed));
    console.log('✅ Данные интро сброшены. Пользователи увидят новый начальный экран.');
  } catch (error) {
    console.error('Ошибка при сбросе:', error);
  }
} else {
  console.log('✅ Данные интро сброшены. Новые пользователи увидят начальный экран.');
}

console.log('Обновите страницу, чтобы увидеть новый интро.');