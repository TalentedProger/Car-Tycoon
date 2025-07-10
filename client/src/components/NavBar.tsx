import { cn } from '@/lib/utils';

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const tabs = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'factories', label: 'Заводы', icon: '🏭' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'nav-btn flex flex-col items-center py-2 px-4 rounded-lg transition-colors duration-200',
              activeTab === tab.id && 'active'
            )}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
