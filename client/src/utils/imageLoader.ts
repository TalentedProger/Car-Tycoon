// Utility functions for loading car images

export const getCarImages = (carId: number): string[] => {
  const baseUrl = '/cars/car-' + carId;
  const possibleImages = [
    'main.jpg',
    'side.jpg', 
    'interior.jpg',
    'back.jpg',
    'engine.jpg',
    'dashboard.jpg'
  ];
  
  // In a real application, you would check which images exist
  // For now, we'll assume at least main.jpg exists for each car
  return possibleImages.map(img => `${baseUrl}/${img}`);
};

export const getCarMainImage = (carId: number): string => {
  return `/cars/car-${carId}/main.jpg`;
};

export const getCarThumbnail = (carId: number): string => {
  return `/cars/car-${carId}/main.jpg`;
};

// Fallback emoji for when images are not available
export const getCarEmoji = (carId: number): string => {
  const emojiMap: { [key: number]: string } = {
    1: '🚗',   // BMW X5
    2: '🚙',   // Mercedes-Benz E-Class
    3: '🚗',   // Audi A4
    4: '🚙',   // Volkswagen Passat
    5: '🚗',   // LADA Granta
    6: '🚙',   // Renault Logan
    7: '🚗',   // Nissan Teana
    8: '🚙',   // Honda Accord
    9: '🚗',   // Toyota Corolla
    10: '🚙',  // Hyundai Elantra
    11: '🚗',  // Kia Rio
    12: '🚙',  // Skoda Octavia
    13: '🚗',  // Ford Focus
    14: '🚙',  // Mazda 3
    15: '🚗',  // Chevrolet Cruze
    16: '🚙',  // Infiniti Q50
    17: '🚗',  // Lexus ES
    18: '🚙',  // Genesis G80
    19: '🚗',  // Cadillac CTS
    20: '🚙'   // Lincoln Continental
  };
  
  return emojiMap[carId] || '🚗';
};

// Check if image exists (for fallback handling)
export const imageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};