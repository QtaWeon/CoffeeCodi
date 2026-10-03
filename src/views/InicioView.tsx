import React from 'react';
import { MenuItem, ClientProfile } from '../types';
import { formatGuarani } from '../utils/format';
import { InicioSkeleton } from '../components/SkeletonLoaders';

interface InicioViewProps {
  user: ClientProfile;
  products: MenuItem[];
  loading?: boolean;
  onOpenCustomizer: (product: MenuItem) => void;
  onNavigateTab: (tab: 'inicio' | 'menu' | 'ideal', filterCategory?: string) => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  user,
  products,
  loading = false,
  onOpenCustomizer,
  onNavigateTab,
}) => {
  if (loading) {
    return <InicioSkeleton />;
  }

  const firstName = user.displayName.split(' ')[0] || 'amigo';

  // Signature espresso drink (no lote del dia, only 100% espresso machine)
  const signatureEspresso =
    products.find((p) => p.id === 'espresso-codi-doble') || products[0];

  const bestsellers = products.filter((p) =>
    [
      'flat-white-doble',
      'cold-brew-caramelo-salado',
      'mbeju-relleno-4-quesos',
      'croissant-almendras',
    ].includes(p.id)
  );

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Saludo cálido personalizado */}
      <section className="px-4 pt-3 pb-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#964900]/10 dark:bg-[#ff9241]/15 text-[#964900] dark:text-[#ff9241] font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#964900] dark:bg-[#ff9241]"></span>
            // coffee_and_code
          </span>
          <span className="font-mono text-[11px] text-[#4f4440] dark:text-[#bcaea6] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#964900] dark:text-[#ff9241]">
              thermostat
            </span>
            24°C Capiatá
          </span>
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#070100] dark:text-[#f8f4f0] tracking-tight">
          ¡Mba'éichapa, {firstName}! ☕
        </h1>
        <p className="font-sans text-xs text-[#4f4440] dark:text-[#bcaea6] leading-relaxed">
          Café de especialidad extraído exclusivamente en cafetera de espresso a 9 bares de presión en Capiatá.
        </p>
      </section>

      {/* Tarjeta destacada: Barra de Espresso de Especialidad */}
      <section className="px-4 py-2">
        <div className="relative overflow-hidden rounded-2xl bg-[#2b1810] dark:bg-[#201511] text-white shadow-md border border-transparent dark:border-[#ff9241]/25">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#ff9241]/20 blur-2xl pointer-events-none"></div>

          <div className="p-4 flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ff9241] bg-[#070100]/60 px-2.5 py-1 rounded-full backdrop-blur-md font-semibold border border-[#ff9241]/20">
                <span className="material-symbols-outlined text-[15px] animate-pulse">
                  precision_manufacturing
                </span>
                ESPRESSO BAR // 9 BAR
              </span>
              <span className="font-mono text-[11px] text-[#e7e1dd]/80 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  speed
                </span>
                Porta-filtro 18g
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-xl font-bold text-white leading-snug">
                {signatureEspresso.name}
              </h2>
              <p className="font-sans text-xs text-[#e7e1dd]/90 leading-relaxed">
                {signatureEspresso.description}
              </p>
            </div>

            {/* Sensory notes pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {(signatureEspresso.sensoryNotes || [
                '#cacao_puro',
                '#avellana_tostada',
                '#crema_espesa',
              ]).map((note) => (
                <span
                  key={note}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-lg bg-white/10 text-white backdrop-blur-xs"
                >
                  {note}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <span className="font-sans text-[11px] text-[#e7e1dd]/80 leading-none">
                  Precio de barra
                </span>
                <span className="font-mono text-base text-[#ff9241] font-bold leading-tight mt-0.5">
                  {formatGuarani(signatureEspresso.price)}
                </span>
              </div>
              <button
                onClick={() => onOpenCustomizer(signatureEspresso)}
                className="px-4 py-2.5 rounded-xl bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#311300] font-sans text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-[#6a3200] dark:hover:bg-[#ffa257]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
                <span>Personalizar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías con Scroll Horizontal */}
      <section className="py-2.5 flex flex-col gap-2">
        <div className="px-4 flex items-center justify-between">
          <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-semibold uppercase tracking-wider">
            // CATEGORIAS_CODI
          </span>
          <span className="font-sans text-[11px] text-[#817470] dark:text-[#a09088]">
            Deslizar para explorar
          </span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto px-4 no-scrollbar py-1">
          <button
            onClick={() => onNavigateTab('menu', 'cafe')}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2b1810] text-white shadow-xs active:scale-95 transition-all border border-[#ff9241]/20"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ff9241]">
              local_cafe
            </span>
            <span className="font-sans text-xs font-semibold">Espresso Caliente</span>
          </button>

          <button
            onClick={() => onNavigateTab('menu', 'frias')}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f3ede9] dark:bg-[#1f1612] text-[#1d1b19] dark:text-[#f8f4f0] shadow-xs active:scale-95 transition-all hover:bg-[#ede7e3] dark:hover:bg-[#2c201a] border border-transparent dark:border-[#382820]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#964900] dark:text-[#ff9241]">
              ac_unit
            </span>
            <span className="font-sans text-xs">Espresso en Frío</span>
          </button>

          <button
            onClick={() => onNavigateTab('ideal')}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] shadow-xs active:scale-95 transition-all border border-transparent dark:border-[#ff9241]/30"
          >
            <span className="material-symbols-outlined text-[18px] text-[#964900] dark:text-[#ff9241]">
              smart_toy
            </span>
            <span className="font-sans text-xs font-bold">Barista AI</span>
          </button>

          <button
            onClick={() => onNavigateTab('menu', 'pasteleria')}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f3ede9] dark:bg-[#1f1612] text-[#1d1b19] dark:text-[#f8f4f0] shadow-xs active:scale-95 transition-all hover:bg-[#ede7e3] dark:hover:bg-[#2c201a] border border-transparent dark:border-[#382820]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#964900] dark:text-[#ff9241]">
              bakery_dining
            </span>
            <span className="font-sans text-xs">Pastelería</span>
          </button>

          <button
            onClick={() => onNavigateTab('menu', 'snacks')}
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f3ede9] dark:bg-[#1f1612] text-[#1d1b19] dark:text-[#f8f4f0] shadow-xs active:scale-95 transition-all hover:bg-[#ede7e3] dark:hover:bg-[#2c201a] border border-transparent dark:border-[#382820]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#964900] dark:text-[#ff9241]">
              skillet
            </span>
            <span className="font-sans text-xs">Mbeju &amp; Chipa</span>
          </button>
        </div>
      </section>

      {/* Banner interactivo: Barista Chat AI */}
      <section className="px-4 py-2">
        <div className="relative overflow-hidden rounded-2xl bg-[#ede7e3] dark:bg-[#1c1410] p-4 flex flex-col gap-3 shadow-xs border border-[#e8e1d9] dark:border-[#382820]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 pr-2">
              <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[15px]">
                  auto_awesome
                </span>
                // codi_ai: barista_virtual
              </span>
              <h3 className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0]">
                ¿Qué café te apetece hoy?
              </h3>
              <p className="font-sans text-xs text-[#4f4440] dark:text-[#bcaea6] leading-relaxed">
                Conversa con nuestro Barista de Inteligencia Artificial para encontrar tu extracción de espresso perfecta según tu ánimo y momento.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ff9241]/20 dark:bg-[#ff9241]/10 flex items-center justify-center flex-shrink-0 text-[#964900] dark:text-[#ff9241]">
              <span className="material-symbols-outlined text-[26px]">chat</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigateTab('ideal')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#070100] dark:bg-[#ff9241] text-white dark:text-[#311300] font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all hover:bg-[#2b1810] dark:hover:bg-[#ffa257]"
            >
              <span>Hablar con Codi AI</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Sección: Los favoritos de Capiatá */}
      <section className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-semibold">
              // bestsellers
            </span>
            <h2 className="font-serif text-xl font-bold text-[#070100] dark:text-[#f8f4f0]">
              Los favoritos de Capiatá
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#4f4440] dark:text-[#bcaea6] bg-[#f3ede9] dark:bg-[#241914] px-2.5 py-1 rounded-full border border-transparent dark:border-[#382820]">
            Top 4 más pedidos
          </span>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 gap-2.5">
          {bestsellers.map((item) => (
            <article
              key={item.id}
              className="p-3 rounded-2xl bg-white dark:bg-[#1c1410] shadow-xs border border-[#e8e1d9] dark:border-[#342721] flex gap-3 items-center transition-all hover:shadow-sm"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative bg-[#f3ede9] dark:bg-[#241914]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {item.badge && (
                  <span className="absolute bottom-1 right-1 font-mono text-[10px] bg-[#070100]/80 text-white px-1.5 py-0.5 rounded backdrop-blur-xs font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-sans text-sm font-bold text-[#070100] dark:text-[#f8f4f0] truncate">
                      {item.name}
                    </h4>
                    <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-bold flex-shrink-0">
                      {formatGuarani(item.price)}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#4f4440] dark:text-[#bcaea6] line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="font-mono text-[11px] text-[#4f4440] dark:text-[#a09088] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#964900] dark:text-[#ff9241]">
                      {item.category === 'snacks' ? 'whatshot' : 'bolt'}
                    </span>
                    {item.specs || 'Espresso'}
                  </span>
                  <button
                    onClick={() => onOpenCustomizer(item)}
                    aria-label={`Personalizar ${item.name}`}
                    className="w-8 h-8 rounded-lg bg-[#f3ede9] dark:bg-[#281b16] hover:bg-[#964900] dark:hover:bg-[#ff9241] hover:text-white dark:hover:text-[#311300] text-[#070100] dark:text-[#f8f4f0] flex items-center justify-center transition-colors shadow-xs active:scale-95 border border-transparent dark:border-[#382820]"
                    title="Ver personalización"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      tune
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
