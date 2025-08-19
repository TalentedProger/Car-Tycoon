import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GIBDDProps {
  onBack: () => void;
}

// Use array to maintain exact order - regions 01-09 first, then all others
const REGIONS_LIST = [
  { code: "01", name: "Республика Адыгея" },
  { code: "02", name: "Республика Башкортостан" },
  { code: "03", name: "Республика Бурятия" },
  { code: "04", name: "Республика Алтай" },
  { code: "05", name: "Республика Дагестан" },
  { code: "06", name: "Республика Ингушетия" },
  { code: "07", name: "Кабардино-Балкарская Республика" },
  { code: "08", name: "Республика Калмыкия" },
  { code: "09", name: "Карачаево-Черкесская Республика" },
  { code: "10", name: "Республика Карелия" },
  { code: "11", name: "Республика Коми" },
  { code: "12", name: "Республика Марий Эл" },
  { code: "13", name: "Республика Мордовия" },
  { code: "14", name: "Республика Саха (Якутия)" },
  { code: "15", name: "Республика Северная Осетия — Алания" },
  { code: "16", name: "Республика Татарстан" },
  { code: "17", name: "Республика Тыва" },
  { code: "18", name: "Удмуртская Республика" },
  { code: "19", name: "Республика Хакасия" },
  { code: "21", name: "Чувашская Республика" },
  { code: "22", name: "Алтайский край" },
  { code: "23", name: "Краснодарский край" },
  { code: "24", name: "Красноярский край" },
  { code: "25", name: "Приморский край" },
  { code: "26", name: "Ставропольский край" },
  { code: "27", name: "Хабаровский край" },
  { code: "28", name: "Амурская область" },
  { code: "29", name: "Архангельская область" },
  { code: "30", name: "Астраханская область" },
  { code: "31", name: "Белгородская область" },
  { code: "32", name: "Брянская область" },
  { code: "33", name: "Владимирская область" },
  { code: "34", name: "Волгоградская область" },
  { code: "35", name: "Вологодская область" },
  { code: "36", name: "Воронежская область" },
  { code: "37", name: "Ивановская область" },
  { code: "38", name: "Иркутская область" },
  { code: "39", name: "Калининградская область" },
  { code: "40", name: "Калужская область" },
  { code: "41", name: "Камчатский край" },
  { code: "42", name: "Кемеровская область" },
  { code: "43", name: "Кировская область" },
  { code: "44", name: "Костромская область" },
  { code: "45", name: "Курганская область" },
  { code: "46", name: "Курская область" },
  { code: "47", name: "Ленинградская область" },
  { code: "48", name: "Липецкая область" },
  { code: "49", name: "Магаданская область" },
  { code: "50", name: "Московская область" },
  { code: "51", name: "Мурманская область" },
  { code: "52", name: "Нижегородская область" },
  { code: "53", name: "Новгородская область" },
  { code: "54", name: "Новосибирская область" },
  { code: "55", name: "Омская область" },
  { code: "56", name: "Оренбургская область" },
  { code: "57", name: "Орловская область" },
  { code: "58", name: "Пензенская область" },
  { code: "59", name: "Пермский край" },
  { code: "60", name: "Псковская область" },
  { code: "61", name: "Ростовская область" },
  { code: "62", name: "Рязанская область" },
  { code: "63", name: "Самарская область" },
  { code: "64", name: "Саратовская область" },
  { code: "65", name: "Сахалинская область" },
  { code: "66", name: "Свердловская область" },
  { code: "67", name: "Смоленская область" },
  { code: "68", name: "Тамбовская область" },
  { code: "69", name: "Тверская область" },
  { code: "70", name: "Томская область" },
  { code: "71", name: "Тульская область" },
  { code: "72", name: "Тюменская область" },
  { code: "73", name: "Ульяновская область" },
  { code: "74", name: "Челябинская область" },
  { code: "75", name: "Забайкальский край" },
  { code: "76", name: "Ярославская область" },
  { code: "77", name: "Москва" },
  { code: "78", name: "Санкт-Петербург" },
  { code: "79", name: "Еврейская автономная область" },
  { code: "80", name: "Донецкая Народная Республика" },
  { code: "81", name: "Луганская Народная Республика" },
  { code: "82", name: "Республика Крым" },
  { code: "83", name: "Ненецкий автономный округ" },
  { code: "84", name: "Херсонская область" },
  { code: "85", name: "Запорожская область" },
  { code: "86", name: "Ханты-Мансийский автономный округ — Югра" },
  { code: "87", name: "Чукотский автономный округ" },
  { code: "89", name: "Ямало-Ненецкий автономный округ" },
  { code: "90", name: "Московская область" },
  { code: "92", name: "Севастополь" },
  { code: "93", name: "Краснодарский край" },
  { code: "95", name: "Чеченская республика" },
  { code: "96", name: "Свердловская область" },
  { code: "97", name: "Москва" },
  { code: "98", name: "Санкт-Петербург" },
  { code: "99", name: "Москва" },
  { code: "102", name: "Республика Башкортостан" },
  { code: "113", name: "Республика Мордовия" },
  { code: "116", name: "Республика Татарстан" },
  { code: "121", name: "Чувашская Республика" },
  { code: "123", name: "Краснодарский край" },
  { code: "124", name: "Красноярский край" },
  { code: "125", name: "Приморский край" },
  { code: "126", name: "Ставропольский край" },
  { code: "134", name: "Волгоградская область" },
  { code: "136", name: "Воронежская область" },
  { code: "138", name: "Иркутская область" },
  { code: "142", name: "Кемеровская область" },
  { code: "147", name: "Ленинградская область" },
  { code: "150", name: "Московская область" },
  { code: "152", name: "Нижегородская область" },
  { code: "154", name: "Новосибирская область" },
  { code: "155", name: "Омская область" },
  { code: "156", name: "Оренбургская область" },
  { code: "159", name: "Пермский край" },
  { code: "161", name: "Ростовская область" },
  { code: "163", name: "Самарская область" },
  { code: "164", name: "Саратовская область" },
  { code: "173", name: "Ульяновская область" },
  { code: "174", name: "Челябинская область" },
  { code: "177", name: "Москва" },
  { code: "178", name: "Санкт-Петербург" },
  { code: "184", name: "Херсонская область" },
  { code: "185", name: "Запорожская область" },
  { code: "186", name: "Ханты-Мансийский автономный округ — Югра" },
  { code: "190", name: "Московская область" },
  { code: "196", name: "Свердловская область" },
  { code: "197", name: "Москва" },
  { code: "198", name: "Санкт-Петербург" },
  { code: "199", name: "Москва" },
  { code: "702", name: "Республика Башкортостан" },
  { code: "716", name: "Республика Татарстан" },
  { code: "750", name: "Московская область" },
  { code: "761", name: "Ростовская область" },
  { code: "763", name: "Самарская область" },
  { code: "777", name: "Москва" },
  { code: "790", name: "Московская область" },
  { code: "797", name: "Москва" },
  { code: "799", name: "Москва" }
];

// Create lookup object for backward compatibility
const REGIONS = Object.fromEntries(REGIONS_LIST.map(region => [region.code, region.name]));

interface LicensePlate {
  id: number;
  plateNumber: string;
  regionCode: string;
  regionName: string;
  userId: string;
  purchasedAt: number;
  price: number;
}

type GIBDDStep = 'select-region' | 'confirm-purchase' | 'generated-plate' | 'my-plates';

export default function GIBDD({ onBack }: GIBDDProps) {
  const [currentStep, setCurrentStep] = useState<GIBDDStep>('select-region');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [generatedPlate, setGeneratedPlate] = useState<LicensePlate | null>(null);
  const [coins, setCoins] = useState(0);
  const [userId, setUserId] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get user data from localStorage
    const gameState = localStorage.getItem('carTycoonGame');
    if (gameState) {
      const parsed = JSON.parse(gameState);
      setCoins(parsed.coins || 0);
    }
    
    const userIdFromStorage = localStorage.getItem('userId') || 'telegram_user_1';
    setUserId(userIdFromStorage);
  }, []);

  // Get user's license plates
  const { data: userPlates = [], refetch: refetchPlates } = useQuery<LicensePlate[]>({
    queryKey: ['/api/license-plates', userId],
    enabled: !!userId,
  });

  // Check if user has plates to show "my plates" initially
  useEffect(() => {
    if (userPlates.length > 0 && currentStep === 'select-region') {
      setCurrentStep('my-plates');
    }
  }, [userPlates, currentStep]);

  // Generate license plate mutation
  const generatePlateMutation = useMutation({
    mutationFn: async () => {
      const regionName = REGIONS[selectedRegion as keyof typeof REGIONS];
      
      const response = await fetch('/api/generate-license-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          regionCode: selectedRegion, 
          regionName 
        }),
      });

      if (!response.ok) throw new Error('Failed to generate license plate');
      return response.json();
    },
    onSuccess: (plate: LicensePlate) => {
      // Update coins in localStorage and state
      const newCoins = coins - 2500;
      setCoins(newCoins);
      
      const gameState = localStorage.getItem('carTycoonGame');
      if (gameState) {
        const parsed = JSON.parse(gameState);
        parsed.coins = newCoins;
        localStorage.setItem('carTycoonGame', JSON.stringify(parsed));
      }

      setGeneratedPlate(plate);
      setCurrentStep('generated-plate');
      refetchPlates();
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const canAfford = coins >= 2500;

  const handleRegionSelect = (regionCode: string) => {
    setSelectedRegion(regionCode);
    setCurrentStep('confirm-purchase');
  };

  const handlePurchase = () => {
    generatePlateMutation.mutate();
  };

  const handleGetPlate = () => {
    setCurrentStep('my-plates');
  };

  const handleBackToRegions = () => {
    setCurrentStep('select-region');
    setSelectedRegion('');
    setGeneratedPlate(null);
  };

  // License plate component - updated design
  const LicensePlateComponent = ({ plate }: { plate: LicensePlate }) => {
    // Extract plate number and region from plateNumber
    const parts = plate.plateNumber.split(' ');
    const plateText = parts[0] || plate.plateNumber;
    const regionCode = parts[1] || plate.regionCode;
    
    return (
      <div className="mx-auto max-w-lg">
        <div className="bg-white text-black rounded-lg p-4 border-2 border-gray-400 shadow-lg">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 text-center">
              <div className="text-4xl font-black tracking-wider">
                {plateText}
              </div>
            </div>
            <div className="flex flex-col items-center ml-4">
              <div className="text-3xl font-black mb-1">
                {regionCode}
              </div>
              <div className="text-xs font-bold">
                RUS
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'select-region') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Header - no title */}
        <div className="flex items-center justify-between p-4 border-b border-blue-400/30">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          
          <div className="w-16"></div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-300">Баланс:</div>
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              <span>{coins.toLocaleString()}</span>
              <span className="text-sm">₽</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Выберите регион</h2>
            <p className="text-gray-300">Стоимость номера: <span className="text-yellow-400">2,500 ₽</span></p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {REGIONS_LIST.map((region) => (
              <Button
                key={region.code}
                onClick={() => handleRegionSelect(region.code)}
                className="w-full text-left justify-start bg-blue-900/30 hover:bg-blue-800/50 border border-blue-400/30 overflow-hidden"
                variant="ghost"
              >
                <span className="font-mono mr-3 text-yellow-400 flex-shrink-0">{region.code}</span>
                <span className="truncate">{region.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirm-purchase') {
    const regionName = REGIONS[selectedRegion as keyof typeof REGIONS];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Header - no title */}
        <div className="flex items-center justify-between p-4 border-b border-blue-400/30">
          <Button 
            onClick={handleBackToRegions}
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          
          <div className="w-16"></div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-300">Баланс:</div>
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              <span>{coins.toLocaleString()}</span>
              <span className="text-sm">₽</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Top section with title, price and license plate preview */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Подтвердите покупку</h2>
              <p className="text-gray-300 mb-4">
                Регион: {regionName} ({selectedRegion})
              </p>
              <div className="text-3xl font-bold text-yellow-400 mb-8">
                2,500 ₽
              </div>
            </div>

            {/* License plate preview with question marks and neon glow */}
            <div className="flex justify-center mb-8">
              <div className="w-4/5">
                <div 
                  className="bg-white text-black rounded-lg px-4 py-3 border-2 border-gray-400 shadow-lg relative"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center space-x-1 text-gray-400 font-black">
                        <span className="text-2xl">?</span>
                        <span className="text-3xl">???</span>
                        <span className="text-2xl">??</span>
                      </div>
                    </div>
                    <div className="border-l-2 border-gray-300 pl-3 flex flex-col items-center">
                      <div className="text-2xl font-black mb-1">
                        {selectedRegion}
                      </div>
                      <div className="text-xs font-bold">
                        RUS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom button */}
          <div className="pb-4 flex justify-center">
            <Button
              onClick={handlePurchase}
              disabled={!canAfford || generatePlateMutation.isPending}
              className={`w-3/5 text-lg py-4 ${
                canAfford 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              size="lg"
            >
              {generatePlateMutation.isPending ? 'Генерация...' : 
               canAfford ? 'Купить' : 'Недостаточно средств'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'generated-plate' && generatedPlate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Header - no title */}
        <div className="flex items-center justify-center p-4 border-b border-blue-400/30">
          <div className="w-16"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4">
          {/* Top section with title and license plate */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-4">Ваш номер готов!</h2>
              <LicensePlateComponent plate={generatedPlate} />
            </div>
          </div>

          {/* Bottom button */}
          <div className="pb-4 flex justify-center">
            <Button
              onClick={handleGetPlate}
              className="bg-green-600 hover:bg-green-700 text-white text-lg w-3/5 py-4"
              size="lg"
            >
              Получить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // My plates view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header - no title */}
      <div className="flex items-center justify-between p-4 border-b border-blue-400/30">
        <Button 
          onClick={onBack}
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        
        <div className="w-16"></div>
        
        <div className="w-16"></div> {/* Empty space to maintain balance */}
      </div>

      {/* Content */}
      <div className="p-4">
        {userPlates.length > 0 ? (
          <div className="space-y-6">
            {/* Title moved to main container */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🚔</span>
                <h2 className="text-xl font-bold">Мои номера</h2>
              </div>
            </div>

            {userPlates.map((plate: LicensePlate) => (
              <div key={plate.id} className="space-y-4">
                <LicensePlateComponent plate={plate} />
                
                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    variant="default"
                  >
                    Продать
                  </Button>
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    variant="default"
                  >
                    Перевыпустить
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    variant="default"
                  >
                    Рынок
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    variant="default"
                  >
                    Налоги
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">У вас нет номеров</p>
            <Button
              onClick={handleBackToRegions}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Купить первый номер
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}