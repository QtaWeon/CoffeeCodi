import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '../types';
import { formatGuarani } from '../utils/format';
import { ChatMessage, sendChatMessage } from '../services/aiChatService';

interface IdealQuizViewProps {
  products: MenuItem[];
  onOpenCustomizer: (product: MenuItem) => void;
  showToast: (msg: string) => void;
}

export const IdealQuizView: React.FC<IdealQuizViewProps> = ({
  products,
  onOpenCustomizer,
  showToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        '¡Mba\'éichapa! Soy Codi AI, tu barista especialista en CoffeeCodi Capiatá. Todo nuestro café se extrae exclusivamente en nuestra cafetera de espresso a 9 bares de presión. ¿Cómo te sientes hoy o qué sabores te provocan?',
      timestamp: 'Ahora',
      suggestedProduct: products.find((p) => p.id === 'flat-white-doble'),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Ahora',
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputMessage('');
    setIsTyping(true);

    try {
      const apiPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { reply, suggestedProduct } = await sendChatMessage(apiPayload, products);

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: 'Ahora',
        suggestedProduct,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch {
      showToast('No pudimos contactar al barista. Intenta de nuevo.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'model',
        content:
          '¡Mba\'éichapa! Soy Codi AI, tu barista especialista en CoffeeCodi Capiatá. Todo nuestro café se extrae exclusivamente en nuestra cafetera de espresso a 9 bares de presión. ¿Cómo te sientes hoy o qué sabores te provocan?',
        timestamp: 'Ahora',
        suggestedProduct: products.find((p) => p.id === 'flat-white-doble'),
      },
    ]);
    showToast('Conversación reiniciada');
  };

  const starterChips = [
    '☕ Necesito foco para programar',
    '🍯 Algo dulce y cremoso',
    '🧊 Opciones frías con espresso',
    '🌿 Algo suave sin cafeína',
  ];

  return (
    <div className="flex flex-col w-full px-4 pb-6 gap-3 min-h-[calc(100vh-9.5rem)]">
      {/* Header */}
      <section className="flex flex-col gap-1 pt-1 border-b border-[#e8e1d9] dark:border-[#342721] pb-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787] font-mono text-[11px] font-semibold border border-transparent dark:border-[#ff9241]/20">
            <span className="w-2 h-2 rounded-full bg-[#964900] dark:bg-[#ff9241] animate-ping"></span>
            <span>// codi_ai • barista_espresso</span>
          </div>
          <button
            onClick={handleResetChat}
            className="text-[11px] font-mono text-[#817470] dark:text-[#a09088] hover:text-[#964900] dark:hover:text-[#ff9241] flex items-center gap-1 transition-colors"
            title="Reiniciar conversación"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            <span>Reiniciar</span>
          </button>
        </div>
        <h1 className="font-serif text-xl font-bold text-[#070100] dark:text-[#f8f4f0] mt-1">
          Barista Virtual CoffeeCodi
        </h1>
        <p className="font-sans text-xs text-[#4f4440] dark:text-[#bcaea6] leading-relaxed">
          Recomendaciones personalizadas preparadas 100% en nuestra máquina de espresso.
        </p>
      </section>

      {/* Quick starter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {starterChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#f3ede9] dark:bg-[#1c1410] hover:bg-[#ffdcc7] dark:hover:bg-[#3d2315] text-[#070100] dark:text-[#f8f4f0] font-sans text-xs transition-colors border border-[#e8e1d9] dark:border-[#382820] active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 flex flex-col gap-3 py-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Tag */}
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#817470] dark:text-[#a09088] mb-1 px-1">
              {msg.role === 'model' ? (
                <>
                  <span className="material-symbols-outlined text-[13px] text-[#964900] dark:text-[#ff9241]">
                    smart_toy
                  </span>
                  <span>Codi AI // Barista</span>
                </>
              ) : (
                <span>Tú</span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-[#2b1810] dark:bg-[#ff9241] text-white dark:text-[#28160c] font-medium rounded-tr-xs'
                  : 'bg-white dark:bg-[#1c1410] border border-[#e8e1d9] dark:border-[#342721] text-[#1d1b19] dark:text-[#f8f4f0] rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {/* Recommended Drink Card attached to message */}
              {msg.suggestedProduct && (
                <div className="mt-2.5 pt-2.5 border-t border-[#f3ede9] dark:border-[#2c201a] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={msg.suggestedProduct.imageUrl}
                      alt={msg.suggestedProduct.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[11px] text-[#070100] dark:text-[#f8f4f0] truncate">
                        {msg.suggestedProduct.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#964900] dark:text-[#ff9241] font-bold">
                        {formatGuarani(msg.suggestedProduct.price)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenCustomizer(msg.suggestedProduct!)}
                    className="px-2.5 py-1 rounded-lg bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#311300] text-[10px] font-sans font-bold hover:bg-[#6a3200] dark:hover:bg-[#ffa35c] transition-colors flex-shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      tune
                    </span>
                    <span>Ver</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-[#1c1410] border border-[#e8e1d9] dark:border-[#342721] max-w-[140px] text-xs text-[#817470] dark:text-[#a09088]">
            <span className="material-symbols-outlined text-[16px] text-[#964900] dark:text-[#ff9241] animate-spin">
              progress_activity
            </span>
            <span>Codi AI escribe...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="pt-2 sticky bottom-0 bg-[#fef8f4]/95 dark:bg-[#120c09]/95 pb-1 transition-colors duration-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#1c1410] border border-[#d3c3be] dark:border-[#382820] shadow-xs focus-within:border-[#964900] dark:focus-within:border-[#ff9241]"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Pregunta a tu barista (ej: ¿Qué café frío me recomiendas?)..."
            className="flex-1 px-3 py-2 text-xs text-[#1d1b19] dark:text-[#f8f4f0] placeholder:text-[#817470] dark:placeholder:text-[#8e7f77] bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#311300] flex items-center justify-center hover:bg-[#6a3200] dark:hover:bg-[#ffa35c] disabled:opacity-40 transition-all flex-shrink-0"
            aria-label="Enviar mensaje"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_upward
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
