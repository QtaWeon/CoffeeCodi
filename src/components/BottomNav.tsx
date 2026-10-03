import React from 'react';

export type NavTab = 'inicio' | 'menu' | 'ideal';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fef8f4]/92 dark:bg-[#150e0b]/92 backdrop-blur-xl border-t border-[#e8e1d9]/70 dark:border-[#342721]/70 shadow-[0_-4px_24px_rgba(43,24,16,0.07)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)] transition-colors duration-200">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-around">
        {/* Tab 1: Inicio */}
        <button
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-3 py-1 rounded-xl transition-all ${
            activeTab === 'inicio'
              ? 'text-[#964900] dark:text-[#ff9241] font-bold scale-105'
              : 'text-[#4f4440] dark:text-[#8e7f77] hover:text-[#070100] dark:hover:text-[#f8f4f0]'
          }`}
          aria-label="Ir a Inicio"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'inicio' ? 'fill-1' : ''
            }`}
          >
            coffee
          </span>
          <span className="font-sans text-[11px] font-medium tracking-tight">
            Inicio
          </span>
        </button>

        {/* Tab 2: Menú */}
        <button
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-3 py-1 rounded-xl transition-all ${
            activeTab === 'menu'
              ? 'text-[#964900] dark:text-[#ff9241] font-bold scale-105'
              : 'text-[#4f4440] dark:text-[#8e7f77] hover:text-[#070100] dark:hover:text-[#f8f4f0]'
          }`}
          aria-label="Ir a Menú"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'menu' ? 'fill-1' : ''
            }`}
          >
            local_cafe
          </span>
          <span className="font-sans text-[11px] font-medium tracking-tight">
            Menú
          </span>
        </button>

        {/* Tab 3: Mi Ideal */}
        <button
          onClick={() => onTabChange('ideal')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] px-3 py-1 rounded-xl transition-all relative ${
            activeTab === 'ideal'
              ? 'text-[#964900] dark:text-[#ff9241] font-bold scale-105'
              : 'text-[#4f4440] dark:text-[#8e7f77] hover:text-[#070100] dark:hover:text-[#f8f4f0]'
          }`}
          aria-label="Ir a Mi Ideal Barista"
        >
          <span className="absolute top-1 right-2.5 w-1.5 h-1.5 rounded-full bg-[#ff9241] animate-pulse"></span>
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'ideal' ? 'fill-1' : ''
            }`}
          >
            smart_toy
          </span>
          <span className="font-sans text-[11px] font-medium tracking-tight">
            Mi Ideal AI
          </span>
        </button>
      </div>
    </nav>
  );
};
