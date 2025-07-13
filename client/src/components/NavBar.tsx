import { cn } from '@/lib/utils';

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const tabs = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'factories', label: 'Гараж', icon: '🏎️' },
    { id: 'detailing', label: 'Детейлинг', icon: '🚗' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-border px-4 py-3 pb-6 safe-area-inset-bottom z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-colors duration-200 text-muted-foreground min-h-[60px]',
              activeTab === tab.id 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'hover:bg-muted/20 hover:text-foreground'
            )}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-xs font-medium mt-1 leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
