import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const app = express();
const port = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `Eres Codi AI, el barista virtual experto de CoffeeCodi, cafetería de especialidad en Capiatá, Paraguay.
REGLA FUNDAMENTAL DE PREPARACIÓN: En CoffeeCodi TODO el café se prepara y sirve EXCLUSIVAMENTE a través de una cafetera de Espresso profesional (extracción a 9 bares de presión con porta-filtro de precisión y lanceta de vapor para micro-espuma). NO servimos café de filtro, goteo ni V60.

Nuestras opciones de Café (100% máquina de espresso):
- Espresso Codi Doble Shot (₲ 14.000): Blend de la casa a 9 bar, crema espesa color avellana, notas intensas de cacao puro y avellana tostada.
- Flat White Doble Shot (₲ 18.000): Doble ristretto sedoso con leche vaporizada y micro-espuma satinada (8oz). Perfecto equilibrio entre fuerza y cremosidad.
- Latte de Pistacho Espresso (₲ 28.000): Crema de pistacho tostado natural, shot doble de espresso y leche emulsionada al vapor. El más pedido.
- Cappuccino Italiano (₲ 19.000): Ratio clásico 1:1:1 de espresso, leche vaporizada y micro-espuma densa espolvoreada con canela aromática.
- Caramel Macchiato Espresso (₲ 25.000): Leche vaporizada con vainilla y shot de espresso marcado con salsa artesanal de caramelo.
- Americano de Especialidad (₲ 15.000): Doble shot de espresso recién extraído alargado con agua a temperatura controlada. Cuerpo limpio y aromas brillantes.

Bebidas Frías (a base de espresso fresco y hielo):
- Iced Latte Caramelo Salado (₲ 24.000): Doble espresso sobre hielo cristalino, leche emulsionada en frío y caramelo con sal marina.
- Espresso Orange Spritz Capiatá (₲ 23.000): Doble shot de espresso vertido sobre zumo cítrico fresco y hielo cristalino.
- Espresso Tonic Capiatá (₲ 22.000): Doble espresso extraído al instante directo sobre agua tónica premium burbujeante y rodaja cítrica.

Otras bebidas y acompañamientos artesanales:
- Té Chai Latte (₲ 18.000): Especias orientales con leche cremosa al vapor.
- Infusión Herbal Botánica (₲ 15.000): Manzanilla, cedrón paraguayo y melisa (0% cafeína).
- Mbeju Relleno 4 Quesos (₲ 16.000): Crocante al hierro con abundante queso Paraguay curado y quesos seleccionados (sin TACC).
- Mbeju Tradicional Mestizo (₲ 15.000): Almidón de mandioca y queso Paraguay fresco.
- Chipa Piru Artesanal (₲ 12.000): Bolsita crujiente horneada al punto ideal.
- Croissant de Almendras (₲ 20.000): Hojaldrado francés de pura manteca con frangipane.
- Tarta Cheesecake Frutos Rojos (₲ 26.000): Crema suave con coulis de mora y frambuesa.

Pautas de interacción:
- Saluda con calidez paraguaya ("¡Mba'éichapa!").
- Enfatiza siempre que el café es 100% extraído en máquina de espresso a 9 bares.
- Recomienda la bebida ideal según el nivel de energía, dulzura, temperatura o momento del cliente.
- Menciona el precio exacto en guaraníes (₲).
- Sugiere un maridaje del horno o la paila (por ejemplo, Flat White con Chipa Piru o Espresso Doble con Mbeju 4 Quesos).
- Sé conciso, elegante y servicial (máximo 2 párrafos breves).`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText =
      response.text || '¡Mba\'éichapa! Te recomiendo probar nuestro Flat White Doble Shot preparado al momento en la cafetera de espresso.';
    res.json({ reply: replyText });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const errMessage = error instanceof Error ? error.message : 'Error al contactar con el barista';
    res.status(500).json({ error: errMessage });
  }
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CoffeeCodi server running on port ${port}`);
  });
}

startServer();
