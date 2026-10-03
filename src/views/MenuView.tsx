import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { formatGuarani } from '../utils/format';
import { MenuSkeleton } from '../components/SkeletonLoaders';

interface MenuViewProps {
  products: MenuItem[];
  initialCategory?: string;
  loading?: boolean;
  onOpenCustomizer: (product: MenuItem) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  initialCategory = 'todos',
  loading = false,
  onOpenCustomizer,
}) => {
  if (loading) {
    return <MenuSkeleton />;
  }

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const handleToggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setActiveTags([]);
  };

  // Filter products by category, search text, and active tags
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesNotes =
          item.sensoryNotes?.some((n) => n.toLowerCase().includes(query)) ||
          false;
        if (!matchesName && !matchesDesc && !matchesNotes) {
          return false;
        }
      }

      // Dietary & Quick Tags match
      if (activeTags.length > 0) {
        const hasAllTags = activeTags.every((t) => item.tags?.includes(t));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, activeTags]);

  // Section Grouping
  const cafeItems = filteredProducts.filter((p) => p.category === 'cafe');
  const coldAndTeaItems = filteredProducts.filter(
    (p) => p.category === 'frias' || p.category === 'te'
  );
  const foodItems = filteredProducts.filter(
    (p) => p.category === 'pasteleria' || p.category === 'snacks'
  );

  const featuredPick =
    products.find((p) => p.id === 'latte-de-pistacho') || products[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Search Header */}
      <section className="px-4 pt-3 pb-1 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-[#817470] dark:text-[#a09088]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cafés, espressos, masas..."
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#f3ede9] dark:bg-[#1c1410] text-[#1d1b19] dark:text-[#f8f4f0] font-sans text-xs placeholder:text-[#817470] dark:placeholder:text-[#a09088] border border-transparent dark:border-[#382820] focus:outline-none focus:bg-white dark:focus:bg-[#251b15] focus:ring-1 focus:ring-[#964900] dark:focus:ring-[#ff9241] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-[#817470] dark:text-[#a09088] hover:text-[#070100] dark:hover:text-white p-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  cancel
                </span>
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (activeTags.length > 0) setActiveTags([]);
              else setActiveTags(['vegetal', 'frio']);
            }}
            aria-label="Filtros rápidos"
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors relative border ${
              activeTags.length > 0
                ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#964900] dark:text-[#ff9241] border-[#ff9241]/30'
                : 'bg-[#f3ede9] dark:bg-[#1c1410] text-[#070100] dark:text-[#f8f4f0] hover:bg-[#ede7e3] dark:hover:bg-[#281c16] border-transparent dark:border-[#382820]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {activeTags.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff9241]"></span>
            )}
          </button>
        </div>

        {/* Micro-Status Bar */}
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[11px] text-[#4f4440] dark:text-[#bcaea6] flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#964900] dark:bg-[#ff9241] animate-pulse"></span>
            <span className="text-[#964900] dark:text-[#ff9241] font-semibold">Tostado local</span> // 100% Espresso Bar
          </span>
          <span className="font-mono text-[11px] text-[#817470] dark:text-[#a09088]">
            {filteredProducts.length} ítems disponibles
          </span>
        </div>
      </section>

      {/* Sticky Category Filter Horizontal Scroll Bar */}
      <section className="sticky top-16 z-30 w-full bg-[#fef8f4]/95 dark:bg-[#150e0b]/95 backdrop-blur-md border-b border-[#e8e1d9]/70 dark:border-[#342721]/70 py-2.5 px-4 shadow-[0_4px_16px_-4px_rgba(43,24,16,0.06)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.5)] transition-colors duration-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'todos', label: 'Todos', count: products.length },
            {
              id: 'cafe',
              label: 'Espresso Especialidad',
              count: products.filter((p) => p.category === 'cafe').length,
            },
            {
              id: 'frias',
              label: 'Espresso en Frío',
              count: products.filter((p) => p.category === 'frias').length,
            },
            {
              id: 'te',
              label: 'Té e Infusiones',
              count: products.filter((p) => p.category === 'te').length,
            },
            {
              id: 'pasteleria',
              label: 'Pastelería',
              count: products.filter((p) => p.category === 'pasteleria').length,
            },
            {
              id: 'snacks',
              label: 'Mbeju & Chipa',
              count: products.filter((p) => p.category === 'snacks').length,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-sans text-xs transition-all flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-[#ff9241] text-[#311300] font-bold shadow-xs scale-[1.02] border-[#ff9241]'
                  : 'bg-[#f3ede9] dark:bg-[#1f1612] text-[#4f4440] dark:text-[#bcaea6] font-medium hover:bg-[#ede7e3] dark:hover:bg-[#2b1f18] border-transparent dark:border-[#382820]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-[#311300]/15 font-bold'
                    : 'bg-black/5 dark:bg-white/10 opacity-80'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Dietary & Quick Tag Pills */}
      <section className="w-full overflow-x-auto no-scrollbar py-1 px-4 flex items-center gap-2 mt-1">
        {[
          { id: 'vegetal', icon: '🌱', label: 'Leche vegetal' },
          { id: 'frio', icon: '❄️', label: 'Frío' },
          { id: 'cafeina', icon: '⚡', label: 'Doble cafeína' },
          { id: 'glutenfree', icon: '🌾', label: 'Sin gluten' },
        ].map((tag) => {
          const isSelected = activeTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-lg font-sans text-xs flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241] font-semibold shadow-xs'
                  : 'bg-[#f8f2ee] dark:bg-[#1c1410] text-[#4f4440] dark:text-[#bcaea6] border-transparent dark:border-[#382820] hover:bg-[#ede7e3] dark:hover:bg-[#281c16]'
              }`}
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          );
        })}
      </section>

      {/* Catalog & Sections */}
      <div className="px-4 pt-3 flex flex-col gap-4">
        {selectedCategory === 'todos' && !searchQuery && (
          <div className="w-full rounded-2xl bg-gradient-to-r from-[#2b1810] to-[#964900] dark:from-[#201511] dark:to-[#6a3200] p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between border border-transparent dark:border-[#ff9241]/20">
            <div className="relative z-10 max-w-[65%]">
              <span className="font-mono text-[10px] text-[#ffdcc7] uppercase tracking-wider block mb-1 font-semibold">
                // RECOMENDACIÓN BARISTA
              </span>
              <h2 className="font-serif text-lg font-bold leading-tight text-white">
                {featuredPick.name}
              </h2>
              <p className="font-sans text-xs text-[#e7e1dd] opacity-90 mt-1 line-clamp-1">
                Crema artesanal tostada con shot de espresso doble.
              </p>
              <button
                onClick={() => onOpenCustomizer(featuredPick)}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#ff9241] text-[#311300] font-sans text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform hover:bg-[#ffa35c]"
              >
                <span>Personalizar</span>
                <span className="material-symbols-outlined text-[16px]">
                  tune
                </span>
              </button>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg flex-shrink-0 bg-[#f3ede9] dark:bg-[#251914] relative">
              <img
                src={featuredPick.imageUrl}
                alt={featuredPick.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Section 1: Extracción Espresso & Leches */}
        {cafeItems.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0]">
                Extracción Espresso &amp; Leches
              </h3>
              <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241]">
                // espresso_bar_9bar
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {cafeItems.map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  onOpenCustomizer={onOpenCustomizer}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Espresso en Frío & Refrescantes */}
        {coldAndTeaItems.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0]">
                Espresso en Frío &amp; Refrescantes
              </h3>
              <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241]">
                // iced_espresso_bar
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {coldAndTeaItems.map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  onOpenCustomizer={onOpenCustomizer}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Horno & Paila Tradicional */}
        {foodItems.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0]">
                Horno &amp; Paila Tradicional
              </h3>
              <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241]">
                // artesanal_py
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {foodItems.map((item) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  onOpenCustomizer={onOpenCustomizer}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f3ede9] dark:bg-[#1c1410] flex items-center justify-center text-[#964900] dark:text-[#ff9241] mb-3">
              <span className="material-symbols-outlined text-[28px]">
                search_off
              </span>
            </div>
            <p className="font-serif text-base font-bold text-[#070100] dark:text-[#f8f4f0]">
              No encontramos coincidencias
            </p>
            <p className="font-sans text-xs text-[#4f4440] dark:text-[#bcaea6] mt-1 max-w-[240px]">
              Probá buscar con otros términos como “espresso”, “mbeju” o “latte”.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-[#f3ede9] dark:bg-[#281b16] text-[#070100] dark:text-[#f8f4f0] font-sans text-xs font-semibold hover:bg-[#ede7e3] dark:hover:bg-[#34241d]"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductRowProps {
  item: MenuItem;
  onOpenCustomizer: (item: MenuItem) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ item, onOpenCustomizer }) => {
  return (
    <div className="w-full bg-white dark:bg-[#1c1410] rounded-2xl p-3 shadow-xs border border-[#e8e1d9] dark:border-[#342721] flex items-center gap-3 transition-transform active:scale-[0.99] hover:shadow-sm">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f3ede9] dark:bg-[#251914] flex-shrink-0 relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.badge && (
          <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-[#070100]/80 text-white px-1 py-0.5 rounded backdrop-blur-xs font-bold">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-sans text-xs font-bold text-[#070100] dark:text-[#f8f4f0] truncate">
              {item.name}
            </h4>
            {item.badge === 'POPULAR' && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] font-semibold flex-shrink-0">
                POPULAR
              </span>
            )}
            {item.badge === 'SIN TACC' && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#bcefc0] dark:bg-[#1b3a20] text-[#00210a] dark:text-[#90e299] font-semibold flex-shrink-0">
                SIN TACC
              </span>
            )}
          </div>
          <p className="font-sans text-[11px] text-[#4f4440] dark:text-[#bcaea6] line-clamp-1 mt-0.5">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
              {formatGuarani(item.price)}
            </span>
          </div>

          <button
            onClick={() => onOpenCustomizer(item)}
            aria-label={`Personalizar ${item.name}`}
            className="px-3 py-1 rounded-lg bg-[#f3ede9] dark:bg-[#281c16] text-[#070100] dark:text-[#f8f4f0] hover:bg-[#964900] dark:hover:bg-[#ff9241] hover:text-white dark:hover:text-[#311300] font-sans text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs active:scale-95 border border-transparent dark:border-[#382820]"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Personalizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
