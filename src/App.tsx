/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { MenuItem, ClientProfile } from './types';
import { INITIAL_MENU_ITEMS, DEMO_CLIENTS } from './data/menuData';
import { initializeFirestoreData, saveUserProfile } from './services/firestoreService';
import { registerServiceWorker } from './services/notificationService';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { InicioView } from './views/InicioView';
import { MenuView } from './views/MenuView';
import { IdealQuizView } from './views/IdealQuizView';
import { CustomizerModal } from './components/CustomizerModal';
import { ProfileModal } from './components/ProfileModal';

const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.18,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [menuInitialCategory, setMenuInitialCategory] = useState<string>('todos');

  // Data State
  const [products, setProducts] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<ClientProfile>(DEMO_CLIENTS[0]);

  // Modals
  const [customizingProduct, setCustomizingProduct] = useState<MenuItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Sync with Firestore on mount and register Service Worker
  useEffect(() => {
    let isMounted = true;
    registerServiceWorker();

    const initData = async () => {
      try {
        setIsLoadingProducts(true);
        const loadedProducts = await initializeFirestoreData();
        if (isMounted && loadedProducts && loadedProducts.length > 0) {
          setProducts(loadedProducts);
        }
      } catch (err) {
        console.warn('Firestore initialization fallback:', err);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };
    initData();

    // Firebase Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await saveUserProfile({
            id: fbUser.uid,
            displayName: fbUser.displayName || 'Cliente',
            email: fbUser.email || 'holanoteimporta16@gmail.com',
            photoURL:
              fbUser.photoURL ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBacARDoNwzPQO4--gb6Ud12m-qRu3c8akNb2iJfhTVqge8tn3qsWO3Zp1gnurkiDvPdgjiKFBoJLXps63ypLtZwz6YgebES7TQb5DNDrOhOJVApeULh3M2R_5X5LFbb1xURSZySwfm29M8yfLf5TbU2rhKlZcPSKp8N6rueiBSKKfLUYqVAan1RR-GzJ9gaKFdecgr9sHnKj4Yg24d-BU_UhmLaCGu1t1LPtu5jwufwcNSfOHD0uA',
            role: 'customer',
          });
          setCurrentUser(profile);
        } catch {
          // Keep current
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleNavigateTab = (tab: NavTab, filterCategory?: string) => {
    setActiveTab(tab);
    if (filterCategory) {
      setMenuInitialCategory(filterCategory);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fef8f4] dark:bg-[#120c09] text-[#1d1b19] dark:text-[#f8f4f0] flex flex-col antialiased selection:bg-[#ff9241]/30 transition-colors duration-200">
      {/* Top Header */}
      <Header
        user={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        showToast={showToast}
      />

      {/* Main Content Area with fluid motion tab transitions */}
      <main className="flex-1 w-full max-w-md mx-auto pt-16 pb-20 bg-[#fef8f4] dark:bg-[#120c09] transition-colors duration-200">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === 'inicio' && (
            <motion.div
              key="inicio"
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <InicioView
                user={currentUser}
                products={products}
                loading={isLoadingProducts}
                onOpenCustomizer={(p) => setCustomizingProduct(p)}
                onNavigateTab={handleNavigateTab}
              />
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              key="menu"
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <MenuView
                products={products}
                loading={isLoadingProducts}
                initialCategory={menuInitialCategory}
                onOpenCustomizer={(p) => setCustomizingProduct(p)}
              />
            </motion.div>
          )}

          {activeTab === 'ideal' && (
            <motion.div
              key="ideal"
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <IdealQuizView
                products={products}
                onOpenCustomizer={(p) => setCustomizingProduct(p)}
                showToast={showToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Customizer Bottom Sheet Modal */}
      <CustomizerModal
        isOpen={!!customizingProduct}
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUserChange={(newUser) => setCurrentUser(newUser)}
        showToast={showToast}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#2b1810] dark:bg-[#221611] text-white px-4 py-2.5 rounded-full shadow-2xl border border-transparent dark:border-[#ff9241]/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none max-w-[90vw]">
          <span className="material-symbols-outlined text-[#ff9241] text-[18px]">
            check_circle
          </span>
          <span className="font-sans text-xs font-medium truncate">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
