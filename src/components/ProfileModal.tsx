import React, { useState } from 'react';
import { ClientProfile } from '../types';
import { DEMO_CLIENTS } from '../data/menuData';
import { loginWithGoogle, logoutUser } from '../firebase';
import { saveUserProfile } from '../services/firestoreService';
import { useTheme } from '../context/ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ClientProfile;
  onUserChange: (user: ClientProfile) => void;
  showToast: (msg: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  showToast,
}) => {
  const [loading, setLoading] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        const saved = await saveUserProfile({
          id: fbUser.uid,
          displayName: fbUser.displayName || 'Cliente',
          email: fbUser.email || 'holanoteimporta16@gmail.com',
          photoURL:
            fbUser.photoURL ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBacARDoNwzPQO4--gb6Ud12m-qRu3c8akNb2iJfhTVqge8tn3qsWO3Zp1gnurkiDvPdgjiKFBoJLXps63ypLtZwz6YgebES7TQb5DNDrOhOJVApeULh3M2R_5X5LFbb1xURSZySwfm29M8yfLf5TbU2rhKlZcPSKp8N6rueiBSKKfLUYqVAan1RR-GzJ9gaKFdecgr9sHnKj4Yg24d-BU_UhmLaCGu1t1LPtu5jwufwcNSfOHD0uA',
          role: 'customer',
          favoriteCoffee: 'Flat White Doble Shot',
        });
        onUserChange(saved);
        showToast(`¡Bienvenido/a, ${saved.displayName}!`);
        onClose();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al conectar con Google';
      console.error('Login error:', err);
      showToast(`Error al iniciar sesión: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = async (demo: ClientProfile) => {
    setLoading(true);
    try {
      const saved = await saveUserProfile(demo);
      onUserChange(saved);
      showToast(`Cliente activo: ${demo.displayName}`);
      onClose();
    } catch {
      onUserChange(demo);
      showToast(`Cliente activo: ${demo.displayName}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Fallback
    }
    const fallback = DEMO_CLIENTS[0];
    onUserChange(fallback);
    showToast('Sesión cerrada');
    onClose();
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        showToast('¡CoffeeCodi instalada con éxito en tu teléfono!');
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm max-h-[90vh] bg-white dark:bg-[#19110d] rounded-2xl shadow-2xl border border-[#e8e1d9] dark:border-[#382820] overflow-hidden flex flex-col text-[#1d1b19] dark:text-[#f8f4f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#f8f2ee] dark:bg-[#201511] border-b border-[#e8e1d9] dark:border-[#2f2018] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#964900] dark:text-[#ff9241] font-bold">
              // CUENTA_CLIENTE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#2c1e17] flex items-center justify-center text-[#4f4440] dark:text-[#bcaea6] hover:text-[#070100] dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Current User Card */}
          <div className="p-5 flex flex-col items-center text-center border-b border-[#f3ede9] dark:border-[#2f2018]">
            <div className="relative mb-3">
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-[#ff9241]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBacARDoNwzPQO4--gb6Ud12m-qRu3c8akNb2iJfhTVqge8tn3qsWO3Zp1gnurkiDvPdgjiKFBoJLXps63ypLtZwz6YgebES7TQb5DNDrOhOJVApeULh3M2R_5X5LFbb1xURSZySwfm29M8yfLf5TbU2rhKlZcPSKp8N6rueiBSKKfLUYqVAan1RR-GzJ9gaKFdecgr9sHnKj4Yg24d-BU_UhmLaCGu1t1LPtu5jwufwcNSfOHD0uA';
                }}
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#964900] dark:bg-[#ff9241] text-white dark:text-[#201511] flex items-center justify-center text-xs shadow-sm">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-[#070100] dark:text-[#f8f4f0]">
              {currentUser.displayName}
            </h3>
            <p className="font-mono text-xs text-[#817470] dark:text-[#a09088] mt-0.5">
              {currentUser.email || 'holanoteimporta16@gmail.com'}
            </p>
            <p className="text-xs text-[#4f4440] dark:text-[#bcaea6] mt-1">
              Ubicación: {currentUser.city || 'Capiatá, Central, PY'}
            </p>

            {/* Dark Mode Toggle in Profile */}
            <div className="mt-4 w-full pt-3 border-t border-[#f3ede9] dark:border-[#2f2018] flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-[18px] text-[#ff9241]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="font-sans font-medium">Tema Oscuro</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                  isDark ? 'bg-[#ff9241]' : 'bg-[#d3c3be]'
                }`}
                aria-label="Alternar tema oscuro"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* PWA Install App Section */}
          <div className="p-4 border-b border-[#f3ede9] dark:border-[#2f2018] flex flex-col gap-2.5">
            <span className="font-mono text-[11px] text-[#964900] dark:text-[#ff9241] font-semibold">
              // ACCESO RÁPIDO & PWA
            </span>

            {isInstalled ? (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#bcefc0]/40 dark:bg-[#18391d]/60 border border-[#bcefc0] dark:border-[#18391d] text-[#00210a] dark:text-[#80e58c] text-xs">
                <span className="material-symbols-outlined text-[20px] text-[#00210a] dark:text-[#80e58c]">
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="font-bold">App instalada</span>
                  <span className="text-[11px] opacity-85">
                    CoffeeCodi ya está activa como aplicación en este dispositivo.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ff9241] text-[#311300] font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#ffa257] active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    install_mobile
                  </span>
                  <span>Instalar App en tu teléfono</span>
                </button>

                <p className="text-[11px] text-[#817470] dark:text-[#a09088] text-center px-1">
                  {isIOS
                    ? 'Disponible para iPhone e iPad sin pasar por la App Store.'
                    : 'Instalación instantánea con ícono directo en tu pantalla de inicio.'}
                </p>
              </div>
            )}

            {/* iOS or Manual Installation Guide Modal / Card */}
            {showInstallGuide && !isInstalled && (
              <div className="p-3.5 rounded-xl bg-[#f8f2ee] dark:bg-[#201511] border border-[#e8e1d9] dark:border-[#382820] flex flex-col gap-2 mt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-[#e8e1d9] dark:border-[#2f2018]">
                  <span className="font-sans text-xs font-bold text-[#070100] dark:text-[#f8f4f0] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ff9241] text-[18px]">
                      {isIOS ? 'phone_iphone' : 'info'}
                    </span>
                    {isIOS ? 'Pasos para instalar en iOS' : 'Instrucciones de instalación'}
                  </span>
                  <button
                    onClick={() => setShowInstallGuide(false)}
                    className="text-[#817470] hover:text-[#070100] dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                {isIOS ? (
                  <ol className="text-xs text-[#4f4440] dark:text-[#bcaea6] flex flex-col gap-1.5 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-[#ff9241]">1.</span>
                      <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-[#ff9241]">2.</span>
                      <span>Desplázate hacia abajo y elige <strong>"Agregar a la pantalla de inicio"</strong>.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-bold text-[#ff9241]">3.</span>
                      <span>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</span>
                    </li>
                  </ol>
                ) : (
                  <p className="text-xs text-[#4f4440] dark:text-[#bcaea6]">
                    En tu navegador, abre el menú de tres puntos (o la barra de direcciones) y selecciona <strong>"Instalar CoffeeCodi"</strong> o <strong>"Añadir a la pantalla de inicio"</strong>.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Auth Actions */}
          <div className="p-4 flex flex-col gap-3">
            {/* Real Firebase Google Sign-in */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#070100] dark:bg-[#2b1810] text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#2b1810] dark:hover:bg-[#3d2419] active:scale-98 transition-all shadow-sm disabled:opacity-50 border border-transparent dark:border-[#ff9241]/30"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {loading
                  ? 'Conectando con Google...'
                  : 'Iniciar sesión con Google'}
              </span>
            </button>

            {/* Quick Demo Switcher Section */}
            <div className="pt-2 flex flex-col gap-2">
              <span className="font-mono text-[11px] text-[#964900] dark:text-[#ff9241] font-semibold">
                // O CAMBIAR A CLIENTE DE PRUEBA:
              </span>
              <div className="flex flex-col gap-1.5">
                {DEMO_CLIENTS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => handleSelectDemo(demo)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                      currentUser.id === demo.id
                        ? 'bg-[#ffdcc7] dark:bg-[#3d2315] border-[#ff9241] font-semibold'
                        : 'bg-[#f8f2ee] dark:bg-[#201511] border-transparent dark:border-[#342721] hover:bg-[#ede7e3] dark:hover:bg-[#281c16]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={demo.photoURL}
                        alt={demo.displayName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-[#070100] dark:text-[#f8f4f0]">
                          {demo.displayName}
                        </span>
                        <span className="text-[10px] text-[#4f4440] dark:text-[#bcaea6]">
                          {demo.email}
                        </span>
                      </div>
                    </div>
                    {currentUser.id === demo.id && (
                      <span className="material-symbols-outlined text-[16px] text-[#964900] dark:text-[#ff9241]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mt-1 w-full py-2 rounded-xl text-xs text-[#ba1a1a] dark:text-[#ffb4ab] hover:bg-[#ffdad6]/40 dark:hover:bg-[#ffdad6]/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
