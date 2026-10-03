import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { formatGuarani } from '../utils/format';

interface CustomizerModalProps {
  product: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [cupSize, setCupSize] = useState<'regular' | 'grande'>('regular');
  const [milkType, setMilkType] = useState<string>('entera');
  const [sugarLevel, setSugarLevel] = useState<string>('0');
  const [extraEspresso, setExtraEspresso] = useState<boolean>(false);
  const [extraCream, setExtraCream] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setCupSize('regular');
      if (product.name.toLowerCase().includes('pistacho')) {
        setMilkType('avena');
      } else {
        setMilkType('entera');
      }
      setSugarLevel('0');
      setExtraEspresso(false);
      setExtraCream(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Pricing calculations
  const basePrice = product.price;
  const sizeExtra = cupSize === 'grande' ? 4000 : 0;

  let milkExtra = 0;
  if (milkType === 'avena') milkExtra = 3000;
  else if (milkType === 'almendras') milkExtra = 3500;

  const espressoExtra = extraEspresso ? 4000 : 0;
  const creamExtra = extraCream ? 3000 : 0;

  const totalCalculated = basePrice + sizeExtra + milkExtra + espressoExtra + creamExtra;

  const isBeverage =
    product.category === 'cafe' || product.category === 'frias' || product.category === 'te';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto bg-white dark:bg-[#19110d] text-[#1d1b19] dark:text-[#f8f4f0] rounded-t-3xl shadow-[0_-10px_35px_rgba(43,24,16,0.3)] max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-transparent dark:border-[#382820]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle bar */}
        <div className="w-full flex flex-col items-center pt-3 pb-1 cursor-grab">
          <div className="w-10 h-1.5 rounded-full bg-[#d3c3be] dark:bg-[#4a362c]"></div>
        </div>

        {/* Sheet Header */}
        <div className="px-4 py-2 flex items-start justify-between border-b border-[#f3ede9] dark:border-[#2a1d17]">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-semibold">
                // custom_craft
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#964900] dark:bg-[#ff9241]"></span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#070100] dark:text-[#f8f4f0] leading-tight mt-0.5">
              {product.name}
            </h3>
            <p className="font-sans text-xs text-[#4f4440] dark:text-[#bcaea6]">
              Personalizá tu extracción, leche y temperatura al milímetro.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 rounded-full bg-[#f3ede9] dark:bg-[#281b15] flex items-center justify-center text-[#4f4440] dark:text-[#bcaea6] hover:text-[#070100] dark:hover:text-white hover:bg-[#ede7e3] dark:hover:bg-[#34241d] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Config Scrollable Body */}
        <div className="overflow-y-auto px-4 py-3.5 flex flex-col gap-5 flex-1">
          {isBeverage ? (
            <>
              {/* Option 1: Tamaño */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-[#070100] dark:text-[#f8f4f0]">
                    Tamaño de la taza
                  </span>
                  <span className="font-mono text-xs text-[#817470] dark:text-[#a09088]">
                    ratio: 1:2
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCupSize('regular')}
                    className={`flex flex-col p-3 rounded-xl text-left transition-all border ${
                      cupSize === 'regular'
                        ? 'bg-[#2b1810] dark:bg-[#ff9241] text-white dark:text-[#201511] border-[#2b1810] dark:border-[#ff9241] shadow-sm font-semibold'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-xs font-semibold">
                        Regular 250ml
                      </span>
                      <span className="font-mono text-[13px] opacity-90">
                        +₲ 0
                      </span>
                    </div>
                    <span className="text-[11px] opacity-75 mt-0.5">
                      Doble ristretto suave
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCupSize('grande')}
                    className={`flex flex-col p-3 rounded-xl text-left transition-all border ${
                      cupSize === 'grande'
                        ? 'bg-[#2b1810] dark:bg-[#ff9241] text-white dark:text-[#201511] border-[#2b1810] dark:border-[#ff9241] shadow-sm font-semibold'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-sans text-xs font-semibold">
                        Grande 400ml
                      </span>
                      <span className="font-mono text-[13px] opacity-90">
                        +₲ 4.000
                      </span>
                    </div>
                    <span className="text-[11px] opacity-75 mt-0.5">
                      Triple shot intenso
                    </span>
                  </button>
                </div>
              </div>

              {/* Option 2: Tipo de Leche */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-[#070100] dark:text-[#f8f4f0]">
                    Base de Leche &amp; Textura
                  </span>
                  <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241]">
                    temp: 65°C
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    onClick={() => setMilkType('entera')}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                      milkType === 'entera'
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241]/40 shadow-xs'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="milkType"
                        checked={milkType === 'entera'}
                        onChange={() => setMilkType('entera')}
                        className="accent-[#964900] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold">
                          Leche Entera Cremosa
                        </span>
                        <span className="text-[10px] opacity-75">
                          Texturizada al vapor con lanceta a 1.2bar
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
                      Incluido
                    </span>
                  </label>

                  <label
                    onClick={() => setMilkType('avena')}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                      milkType === 'avena'
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241]/40 shadow-xs'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="milkType"
                        checked={milkType === 'avena'}
                        onChange={() => setMilkType('avena')}
                        className="accent-[#964900] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold">
                          Bebida de Avena Barista Edition (🌱)
                        </span>
                        <span className="text-[10px] opacity-75">
                          Sin lactosa, micro-espuma satinada
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
                      +₲ 3.000
                    </span>
                  </label>

                  <label
                    onClick={() => setMilkType('almendras')}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                      milkType === 'almendras'
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241]/40 shadow-xs'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="milkType"
                        checked={milkType === 'almendras'}
                        onChange={() => setMilkType('almendras')}
                        className="accent-[#964900] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-semibold">
                          Bebida de Almendras Tostadas (🌱)
                        </span>
                        <span className="text-[10px] opacity-75">
                          Toque sutil de frutos secos
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
                      +₲ 3.500
                    </span>
                  </label>
                </div>
              </div>

              {/* Option 3: Nivel de Dulzor */}
              <div className="flex flex-col gap-2">
                <span className="font-sans text-sm font-semibold text-[#070100] dark:text-[#f8f4f0]">
                  Endulzante
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: '0', label: 'Sin azúcar' },
                    { id: '1', label: '1 sobre' },
                    { id: '2', label: '2 sobres' },
                    { id: 'stevia', label: 'Stevia' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSugarLevel(s.id)}
                      className={`py-2 px-1 rounded-xl text-center font-sans text-xs transition-all border ${
                        sugarLevel === s.id
                          ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241] font-bold shadow-xs'
                          : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#4f4440] dark:text-[#bcaea6] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#2b1f19]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 4: Extras */}
              <div className="flex flex-col gap-2">
                <span className="font-sans text-sm font-semibold text-[#070100] dark:text-[#f8f4f0]">
                  Extras Barista
                </span>
                <div className="flex flex-col gap-1.5">
                  <label
                    onClick={() => setExtraEspresso(!extraEspresso)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      extraEspresso
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241]/40'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extraEspresso}
                        onChange={(e) => setExtraEspresso(e.target.checked)}
                        className="accent-[#964900] w-4 h-4 rounded"
                      />
                      <span className="font-sans text-xs font-medium">
                        Extra shot de espresso (+9 bar)
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
                      +₲ 4.000
                    </span>
                  </label>

                  <label
                    onClick={() => setExtraCream(!extraCream)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      extraCream
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] border-[#ff9241]/40'
                        : 'bg-[#f8f2ee] dark:bg-[#221813] text-[#1d1b19] dark:text-[#f8f4f0] border-transparent dark:border-[#342721]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={extraCream}
                        onChange={(e) => setExtraCream(e.target.checked)}
                        className="accent-[#964900] w-4 h-4 rounded"
                      />
                      <span className="font-sans text-xs font-medium">
                        Crema batida
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#964900] dark:text-[#ff9241]">
                      +₲ 3.000
                    </span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              <div className="p-3.5 rounded-xl bg-[#f8f2ee] dark:bg-[#221813] flex flex-col gap-1.5 border border-transparent dark:border-[#342721]">
                <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-semibold">
                  // notas_de_cocina
                </span>
                <p className="text-xs text-[#4f4440] dark:text-[#bcaea6] leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-[#1d1b19] dark:text-[#f8f4f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#964900] dark:text-[#ff9241]">
                    skillet
                  </span>
                  <span>Elaboración artesanal capiateña en el día.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar showing calculated price */}
        <div className="p-4 bg-[#f8f2ee] dark:bg-[#150e0b] border-t border-[#e8e1d9] dark:border-[#2a1d17] flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(43,24,16,0.06)]">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-[#4f4440] dark:text-[#a09088]">
              Precio según opciones
            </span>
            <span className="font-mono text-xl font-bold text-[#070100] dark:text-[#ff9241]">
              {formatGuarani(totalCalculated)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-6 h-12 rounded-xl bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#311300] font-sans text-sm font-bold shadow-md hover:bg-[#6a3200] dark:hover:bg-[#ffa257] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Listo</span>
            <span className="material-symbols-outlined text-[18px]">
              check
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
