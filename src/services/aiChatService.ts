import { MenuItem } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedProduct?: MenuItem;
}

export async function sendChatMessage(
  messages: { role: string; content: string }[],
  catalog: MenuItem[]
): Promise<{ reply: string; suggestedProduct?: MenuItem }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data.reply as string;

      // Detect if a menu product is mentioned in the reply
      const matched = catalog.find((item) =>
        reply.toLowerCase().includes(item.name.toLowerCase())
      );

      return { reply, suggestedProduct: matched };
    }
  } catch (err) {
    console.warn('Backend /api/chat error, falling back to local barista logic:', err);
  }

  // Graceful barista intelligent fallback
  const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
  let fallbackReply =
    '¡Mba\'éichapa! En CoffeeCodi extraemos todo nuestro café en máquina de espresso a 9 bares de presión. Te recomiendo probar nuestro **Flat White Doble Shot** (₲ 18.000) con micro-espuma aterciopelada.';
  let fallbackItem = catalog.find((c) => c.id === 'flat-white-doble');

  if (lastUserMsg.includes('frio') || lastUserMsg.includes('calor') || lastUserMsg.includes('refresc')) {
    fallbackReply =
      'Para refrescarte con pura potencia de espresso, te sugiero el **Iced Latte Caramelo Salado** (₲ 24.000) o un **Espresso Tonic Capiatá** (₲ 22.000). Ambos se extraen al instante en la cafetera de espresso directamente sobre hielo cristalino.';
    fallbackItem = catalog.find((c) => c.id === 'cold-brew-caramelo-salado');
  } else if (lastUserMsg.includes('dulce') || lastUserMsg.includes('suave') || lastUserMsg.includes('postre')) {
    fallbackReply =
      'Si buscas algo dulce y sedoso, el **Latte de Pistacho Espresso** (₲ 28.000) es nuestra estrella indiscutible, preparado con crema de pistacho natural y doble shot de espresso.';
    fallbackItem = catalog.find((c) => c.id === 'latte-de-pistacho');
  } else if (lastUserMsg.includes('fuerte') || lastUserMsg.includes('despertar') || lastUserMsg.includes('codigo') || lastUserMsg.includes('programar')) {
    fallbackReply =
      'Para concentración profunda de código, nada supera nuestro **Espresso Codi Doble Shot** (₲ 14.000) extraído a 9 bar en porta-filtro de precisión, con densa crema avellana.';
    fallbackItem = catalog.find((c) => c.id === 'espresso-codi-doble');
  } else if (lastUserMsg.includes('comer') || lastUserMsg.includes('mbeju') || lastUserMsg.includes('snack') || lastUserMsg.includes('chipa')) {
    fallbackReply =
      'Te recomiendo acompañar tu espresso con nuestro **Mbeju Relleno 4 Quesos** (₲ 16.000) recién salido de la paila de hierro, o una bolsita de **Chipa Piru Artesanal** (₲ 12.000).';
    fallbackItem = catalog.find((c) => c.id === 'mbeju-relleno-4-quesos');
  }

  return { reply: fallbackReply, suggestedProduct: fallbackItem };
}
