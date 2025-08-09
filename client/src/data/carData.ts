// Shared car data structure to ensure consistency across all pages
export interface CarData {
  id: number;
  name: string;
  basePrice: number;
  category: string;
  available: boolean;
}

export const carDatabase: { [key: string]: CarData } = {
  'vaz-2107': { id: 1, name: 'ВАЗ 2107', basePrice: 85000, category: 'Эконом', available: true },
  'mercedes-benz': { id: 2, name: 'Mercedes-Benz', basePrice: 300000, category: 'Премиум', available: true },
  'bmw': { id: 3, name: 'BMW', basePrice: 280000, category: 'Премиум', available: true },
  'audi': { id: 4, name: 'Audi 100', basePrice: 140000, category: 'Средний класс', available: true },
  'hyundai-sonata': { id: 8, name: 'Hyundai Sonata IV', basePrice: 135000, category: 'Средний класс', available: true }
};

// Trim levels and multipliers - shared across all components
export const trimLevels = ['Base', 'Comfort', 'Elegance', 'Premium', 'Sport'];
export const trimMultipliers = { 
  'Base': 1, 
  'Comfort': 1.3, 
  'Elegance': 1.6, 
  'Premium': 2.0, 
  'Sport': 2.5 
};

// Shared calculation functions
export const calculatePrice = (basePrice: number, trim: string): number => {
  const multiplier = trimMultipliers[trim as keyof typeof trimMultipliers] || 1;
  return Math.round(basePrice * multiplier);
};

export const calculateHourlyIncome = (price: number): number => {
  // 0.25% (0.0025) of car price, rounded up
  return Math.ceil(price * 0.0025);
};

// Get car data by key
export const getCarData = (carKey: string): CarData => {
  return carDatabase[carKey] || carDatabase['vaz-2107'];
};

// Get car trim from localStorage
export const getCarTrim = (carId: number): string => {
  const carTrimsData = localStorage.getItem('carTrims');
  if (carTrimsData) {
    const trims = JSON.parse(carTrimsData);
    return trims[carId] || 'Base';
  }
  return 'Base';
};

// Get selected car configuration from localStorage  
export const getSelectedCarConfiguration = () => {
  const gameState = localStorage.getItem('carTycoonGame');
  let selectedCar = 'vaz-2107';
  
  if (gameState) {
    const parsed = JSON.parse(gameState);
    selectedCar = parsed.selectedStarterCar || 'vaz-2107';
  }
  
  const carData = getCarData(selectedCar);
  const trim = getCarTrim(carData.id);
  const finalPrice = calculatePrice(carData.basePrice, trim);
  const hourlyIncome = calculateHourlyIncome(finalPrice);
  
  return {
    carData,
    trim,
    finalPrice,
    hourlyIncome
  };
};