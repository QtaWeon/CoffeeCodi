/**
 * CoffeeCodi Local Notifications Service (Service Worker & Web Notifications API)
 */

export interface NotificationPreset {
  id: string;
  category: 'promo' | 'schedule' | 'bakery' | 'barista';
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag: string;
  data?: Record<string, unknown>;
}

export const NOTIFICATION_PRESETS: NotificationPreset[] = [
  {
    id: 'promo-happy-hour',
    category: 'promo',
    title: '☕ Happy Hour de Espresso en CoffeeCodi',
    body: '¡2x1 en Flat White Doble Shot y Mbeju artesanal de 15:00 a 17:00 hs para tu sesión de código!',
    tag: 'promo-happy-hour',
    data: { url: '/', tab: 'menu' },
  },
  {
    id: 'schedule-update',
    category: 'schedule',
    title: '⏰ Horario CoffeeCodi Capiatá',
    body: 'Atendemos hoy de 07:00 a 21:00 hs. Extracción en máquina de espresso a 9 bares y Wi-Fi de alta velocidad activos.',
    tag: 'schedule-update',
    data: { url: '/' },
  },
  {
    id: 'bakery-fresh',
    category: 'bakery',
    title: '🥐 ¡Mbeju 4 Quesos Recién Salido!',
    body: 'Nueva tanda artesanal dorándose al momento en la paila. Acompáñalo con tu americano doble.',
    tag: 'bakery-fresh',
    data: { url: '/', tab: 'menu' },
  },
  {
    id: 'barista-tip',
    category: 'barista',
    title: '⚡ Recomendación del Barista Codi AI',
    body: 'Pruébalo frío: Cold Brew Caramelo Salado macerado 18h con notas a chocolate y avellana.',
    tag: 'barista-tip',
    data: { url: '/', tab: 'ideal' },
  },
];

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Checks if browser supports Notifications and Service Workers
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status ('default' | 'granted' | 'denied')
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Registers the Service Worker for local notifications and caching
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;
    return reg;
  } catch (error) {
    console.warn('Service Worker registration skipped or failed:', error);
    return null;
  }
}

/**
 * Requests permission from the user to display notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Send a welcoming confirmation notification
      await sendLocalNotification(
        '☕ ¡Notificaciones de CoffeeCodi activadas!',
        'Te avisaremos de promociones especiales, café recién tostado y novedades de horario en Capiatá.',
        {
          tag: 'welcome-notification',
          data: { url: '/' },
        }
      );
    }
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return Notification.permission;
  }
}

/**
 * Dispatches a local notification via Service Worker or Notification constructor
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  options: Partial<NotificationOptions> = {}
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  if (Notification.permission !== 'granted') {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') return false;
  }

  const notificationOptions: NotificationOptions = {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    // vibrate is supported in Chrome/Android
    ...(options as Record<string, unknown>),
  };

  try {
    if (!swRegistration && 'serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.ready;
    }

    if (swRegistration && 'showNotification' in swRegistration) {
      await swRegistration.showNotification(title, notificationOptions);
      return true;
    } else {
      // Fallback
      new Notification(title, notificationOptions);
      return true;
    }
  } catch (err) {
    console.warn('Fallback displaying notification:', err);
    try {
      new Notification(title, notificationOptions);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Triggers one of the predefined CoffeeCodi promotion / schedule presets
 */
export async function triggerPresetNotification(presetId: string): Promise<boolean> {
  const preset = NOTIFICATION_PRESETS.find((p) => p.id === presetId);
  if (!preset) return false;

  return sendLocalNotification(preset.title, preset.body, {
    tag: preset.tag,
    data: preset.data,
  });
}
