import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface GIBDDProps {
  onBack: () => void;
}

const REGIONS_DATA = {
  "01": "Республика Адыгея",
  "02": "Республика Башкортостан",
  "03": "Республика Бурятия",
  "04": "Республика Алтай",
  "05": "Республика Дагестан",
  "06": "Республика Ингушетия",
  "07": "Кабардино-Балкарская Республика",
  "08": "Республика Калмыкия",
  "09": "Карачаево-Черкесская Республика",
  "10": "Республика Карелия",
  "11": "Республика Коми",
  "12": "Республика Марий Эл",
  "13": "Республика Мордовия",
  "14": "Республика Саха (Якутия)",
  "15": "Республика Северная Осетия — Алания",
  "16": "Республика Татарстан",
  "17": "Республика Тыва",
  "18": "Удмуртская Республика",
  "19": "Республика Хакасия",
  "21": "Чувашская Республика",
  "22": "Алтайский край",
  "23": "Краснодарский край",
  "24": "Красноярский край",
  "25": "Приморский край",
  "26": "Ставропольский край",
  "27": "Хабаровский край",
  "28": "Амурская область",
  "29": "Архангельская область",
  "30": "Астраханская область",
  "31": "Белгородская область",
  "32": "Брянская область",
  "33": "Владимирская область",
  "34": "Волгоградская область",
  "35": "Вологодская область",
  "36": "Воронежская область",
  "37": "Ивановская область",
  "38": "Иркутская область",
  "39": "Калининградская область",
  "40": "Калужская область",
  "41": "Камчатский край",
  "42": "Кемеровская область",
  "43": "Кировская область",
  "44": "Костромская область",
  "45": "Курганская область",
  "46": "Курская область",
  "47": "Ленинградская область",
  "48": "Липецкая область",
  "49": "Магаданская область",
  "50": "Московская область",
  "51": "Мурманская область",
  "52": "Нижегородская область",
  "53": "Новгородская область",
  "54": "Новосибирская область",
  "55": "Омская область",
  "56": "Оренбургская область",
  "57": "Орловская область",
  "58": "Пензенская область",
  "59": "Пермский край",
  "60": "Псковская область",
  "61": "Ростовская область",
  "62": "Рязанская область",
  "63": "Самарская область",
  "64": "Саратовская область",
  "65": "Сахалинская область",
  "66": "Свердловская область",
  "67": "Смоленская область",
  "68": "Тамбовская область",
  "69": "Тверская область",
  "70": "Томская область",
  "71": "Тульская область",
  "72": "Тюменская область",
  "73": "Ульяновская область",
  "74": "Челябинская область",
  "75": "Забайкальский край",
  "76": "Ярославская область",
  "77": "Москва",
  "78": "Санкт-Петербург",
  "79": "Еврейская автономная область",
  "80": "Донецкая Народная Республика",
  "81": "Луганская Народная Республика",
  "82": "Республика Крым",
  "83": "Ненецкий автономный округ",
  "84": "Херсонская область",
  "85": "Запорожская область",
  "86": "Ханты-Мансийский автономный округ — Югра",
  "87": "Чукотский автономный округ",
  "89": "Ямало-Ненецкий автономный округ",
  "90": "Московская область",
  "92": "Севастополь",
  "93": "Краснодарский край",
  "95": "Чеченская республика",
  "96": "Свердловская область",
  "97": "Москва",
  "98": "Санкт-Петербург",
  "99": "Москва",
  "102": "Республика Башкортостан",
  "113": "Республика Мордовия",
  "116": "Республика Татарстан",
  "121": "Чувашская Республика",
  "123": "Краснодарский край",
  "124": "Красноярский край",
  "125": "Приморский край",
  "126": "Ставропольский край",
  "134": "Волгоградская область",
  "136": "Воронежская область",
  "138": "Иркутская область",
  "142": "Кемеровская область",
  "147": "Ленинградская область",
  "150": "Московская область",
  "152": "Нижегородская область",
  "154": "Новосибирская область",
  "155": "Омская область",
  "156": "Оренбургская область",
  "159": "Пермский край",
  "161": "Ростовская область",
  "163": "Самарская область",
  "164": "Саратовская область",
  "173": "Ульяновская область",
  "174": "Челябинская область",
  "177": "Москва",
  "178": "Санкт-Петербург",
  "184": "Херсонская область",
  "185": "Запорожская область",
  "186": "Ханты-Мансийский автономный округ — Югра",
  "190": "Московская область",
  "193": "Краснодарский край",
  "196": "Свердловская область",
  "197": "Москва",
  "198": "Санкт-Петербург",
  "199": "Москва",
  "702": "Республика Башкортостан",
  "716": "Республика Татарстан",
  "750": "Московская область",
  "761": "Ростовская область",
  "763": "Самарская область",
  "777": "Москва",
  "790": "Московская область",
  "797": "Москва",
  "799": "Москва"
};

// Sort regions by numeric order
const REGIONS = Object.entries(REGIONS_DATA)
  .sort(([a], [b]) => parseInt(a) - parseInt(b))
  .reduce((acc, [code, name]) => ({ ...acc, [code]: name }), {} as Record<string, string>);

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

  // License plate component
  const LicensePlateComponent = ({ plate }: { plate: LicensePlate }) => {
    // Extract plate number and region from plateNumber
    const parts = plate.plateNumber.split(' ');
    const plateText = parts[0] || plate.plateNumber;
    const regionCode = parts[1] || plate.regionCode;
    
    return (
      <div className="mx-auto max-w-sm">
        <div className="bg-white text-black rounded-lg p-4 border-2 border-gray-400 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-black tracking-wider">
              {plateText}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-black mb-1">
                {regionCode}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold">RUS</span>
                <span className="text-sm">🇷🇺</span>
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
        {/* Header */}
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
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚔</span>
            <h1 className="text-lg font-bold">ГИБДД</h1>
          </div>
          
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
            <p className="text-gray-300">Стоимость номера: 2,500 ₽</p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {Object.entries(REGIONS).map(([code, name]) => (
              <Button
                key={code}
                onClick={() => handleRegionSelect(code)}
                className="w-full text-left justify-start bg-blue-900/30 hover:bg-blue-800/50 border border-blue-400/30"
                variant="ghost"
              >
                <span className="font-mono mr-3 text-yellow-400">{code}</span>
                <span>{name}</span>
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
        {/* Header */}
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
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚔</span>
            <h1 className="text-lg font-bold">ГИБДД</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-300">Баланс:</div>
            <div className="text-lg font-bold text-green-400 flex items-center gap-1">
              <span>{coins.toLocaleString()}</span>
              <span className="text-sm">₽</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Подтвердите покупку</h2>
            <p className="text-gray-300 mb-4">
              Регион: {regionName} ({selectedRegion})
            </p>
            <div className="text-3xl font-bold text-yellow-400 mb-4">
              2,500 ₽
            </div>
          </div>

          <Button
            onClick={handlePurchase}
            disabled={!canAfford || generatePlateMutation.isPending}
            className={`text-lg px-8 py-4 ${
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
    );
  }

  if (currentStep === 'generated-plate' && generatedPlate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-blue-400/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚔</span>
            <h1 className="text-lg font-bold">ГИБДД</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-4">Ваш номер готов!</h2>
            <LicensePlateComponent plate={generatedPlate} />
          </div>

          <Button
            onClick={handleGetPlate}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4"
            size="lg"
          >
            Получить
          </Button>
        </div>
      </div>
    );
  }

  // My plates view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
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
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚔</span>
          <h1 className="text-lg font-bold">ГИБДД</h1>
        </div>
        
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