import React, { useState, useEffect } from 'react';
import { ClientProfile } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  triggerPresetNotification,
  NOTIFICATION_PRESETS,
} from '../services/notificationService';

interface HeaderProps {
  user: ClientProfile;
  onOpenProfile: () => void;
  showToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenProfile, showToast }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSending, setIsSending] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
    }
  }, [showNotifications]);

  const handleRequestPermission = async () => {
    setIsSending(true);
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result === 'granted') {
        showToast?.('¡Notificaciones locales activadas exitosamente!');
      } else if (result === 'denied') {
        showToast?.('Permiso denegado en el navegador');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleTriggerPreset = async (presetId: string, title: string) => {
    setIsSending(true);
    try {
      const success = await triggerPresetNotification(presetId);
      if (success) {
        showToast?.(`Notificación enviada: ${title}`);
      } else {
        showToast?.('Por favor activa los permisos de notificación primero');
      }
    } catch {
      showToast?.('No se pudo enviar la notificación');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#fef8f4]/90 dark:bg-[#150e0b]/90 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(43,24,16,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border-b border-[#e8e1d9]/60 dark:border-[#342721]/70 transition-colors duration-200">
        <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#2b1810] text-[#ff9241] shadow-xs border border-[#ff9241]/20">
                <span className="font-mono text-sm font-bold tracking-tighter">
                  &lt;☕&gt;
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0] tracking-tight leading-none">
                  CoffeeCodi
                </span>
                <span className="font-mono text-[11px] text-[#964900] dark:text-[#ff9241] flex items-center gap-1 leading-none mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9241] animate-pulse"></span>
                  Capiatá, PY
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#4f4440] dark:text-[#bcaea6] hover:text-[#070100] dark:hover:text-[#f8f4f0] hover:bg-[#f3ede9] dark:hover:bg-[#281c16] transition-colors"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications Center Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notificaciones"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#4f4440] dark:text-[#bcaea6] hover:text-[#070100] dark:hover:text-[#f8f4f0] hover:bg-[#f3ede9] dark:hover:bg-[#281c16] transition-colors relative"
            >
              <span className="material-symbols-outlined text-[21px]">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff9241] ring-2 ring-[#fef8f4] dark:ring-[#150e0b]"></span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={onOpenProfile}
              className="flex items-center justify-center p-0.5 rounded-full ring-2 ring-[#ff9241]/40 hover:ring-[#ff9241] transition-all ml-0.5"
              title={`Perfil de ${user.displayName}`}
              aria-label="Perfil del usuario"
            >
              <img
                alt={user.displayName}
                className="w-8 h-8 rounded-full object-cover shadow-[0_2px_8px_rgba(43,24,16,0.12)]"
                src={user.photoURL}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBacARDoNwzPQO4--gb6Ud12m-qRu3c8akNb2iJfhTVqge8tn3qsWO3Zp1gnurkiDvPdgjiKFBoJLXps63ypLtZwz6YgebES7TQb5DNDrOhOJVApeULh3M2R_5X5LFbb1xURSZySwfm29M8yfLf5TbU2rhKlZcPSKp8N6rueiBSKKfLUYqVAan1RR-GzJ9gaKFdecgr9sHnKj4Yg24d-BU_UhmLaCGu1t1LPtu5jwufwcNSfOHD0uA';
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Popover */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="mt-16 mr-3 max-w-sm w-[92vw] sm:w-88 max-h-[82vh] overflow-y-auto bg-white dark:bg-[#1e1511] rounded-2xl shadow-2xl border border-[#e8e1d9] dark:border-[#382820] p-4 text-[#1d1b19] dark:text-[#f8f4f0] animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#f3ede9] dark:border-[#2e2019]">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-semibold">
                  // NOTIFICACIONES_LOCALES
                </span>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-[#817470] dark:text-[#bcaea6] hover:text-[#1d1b19] dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            {/* Service Worker Status Box */}
            <div className="p-3 rounded-xl bg-[#f8f2ee] dark:bg-[#281b16] border border-transparent dark:border-[#382820] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#070100] dark:text-[#f8f4f0] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff9241] text-[18px]">
                    notifications_active
                  </span>
                  Avisos de Promos y Horarios
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    permission === 'granted'
                      ? 'bg-[#bcefc0] dark:bg-[#18391d] text-[#00210a] dark:text-[#80e58c]'
                      : permission === 'denied'
                      ? 'bg-[#ffdad6] dark:bg-[#410002] text-[#410002] dark:text-[#ffb4ab]'
                      : 'bg-[#ffdcc7] dark:bg-[#3d2315] text-[#311300] dark:text-[#ffb787]'
                  }`}
                >
                  {permission === 'granted'
                    ? 'Activas'
                    : permission === 'denied'
                    ? 'Bloqueadas'
                    : 'Pendiente'}
                </span>
              </div>

              <p className="text-[11px] text-[#4f4440] dark:text-[#bcaea6] leading-relaxed">
                Recibe recordatorios amistosos cuando empiece el Happy Hour de espresso, salgan tandas de mbeju caliente o hayan actualizaciones de horario.
              </p>

              {permission !== 'granted' && (
                <button
                  onClick={handleRequestPermission}
                  disabled={isSending}
                  className="mt-1 w-full py-2 px-3 rounded-xl bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#311300] font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#6a3200] dark:hover:bg-[#ffa257] active:scale-98 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    notifications
                  </span>
                  <span>Activar notificaciones en el navegador</span>
                </button>
              )}
            </div>

            {/* Quick Recordatorios / Presets */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-mono text-[10px] text-[#817470] dark:text-[#a09088] uppercase tracking-wider">
                // PROBAR RECORDATORIOS AMISTOSOS:
              </span>

              <div className="flex flex-col gap-2">
                {NOTIFICATION_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="p-2.5 rounded-xl bg-[#f8f2ee] dark:bg-[#241914] border border-[#e8e1d9] dark:border-[#382820] flex items-start justify-between gap-2.5 transition-all hover:border-[#ff9241]/50"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-sans text-xs font-bold text-[#070100] dark:text-[#f8f4f0] line-clamp-1">
                        {preset.title}
                      </span>
                      <span className="font-sans text-[11px] text-[#4f4440] dark:text-[#bcaea6] line-clamp-2 mt-0.5 leading-snug">
                        {preset.body}
                      </span>
                    </div>

                    <button
                      onClick={() => handleTriggerPreset(preset.id, preset.title)}
                      disabled={isSending}
                      title="Disparar recordatorio"
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#34241d] text-[#964900] dark:text-[#ff9241] border border-[#e8e1d9] dark:border-[#4a3429] font-sans text-[11px] font-bold flex items-center gap-1 hover:bg-[#ff9241] hover:text-white dark:hover:bg-[#ff9241] dark:hover:text-[#28160c] transition-colors flex-shrink-0 shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        send
                      </span>
                      <span>Probar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Worker Info Footer */}
            <div className="pt-2 border-t border-[#f3ede9] dark:border-[#2e2019] flex items-center justify-between text-[10px] font-mono text-[#817470] dark:text-[#a09088]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18391d] dark:bg-[#80e58c]"></span>
                Service Worker v1.0
              </span>
              <span>CoffeeCodi Capiatá</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
