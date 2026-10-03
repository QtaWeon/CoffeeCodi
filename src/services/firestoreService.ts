import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MenuItem, ClientProfile } from '../types';
import { INITIAL_MENU_ITEMS, DEMO_CLIENTS } from '../data/menuData';

const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';

/**
 * Initializes Firestore products and demo client profiles if empty.
 */
export async function initializeFirestoreData(): Promise<MenuItem[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.log('Seeding initial CoffeeCodi products to Firestore...');
      for (const item of INITIAL_MENU_ITEMS) {
        const itemDoc = doc(db, PRODUCTS_COLLECTION, item.id);
        await setDoc(itemDoc, item);
      }

      for (const client of DEMO_CLIENTS) {
        const clientDoc = doc(db, USERS_COLLECTION, client.id);
        await setDoc(clientDoc, {
          ...client,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      return INITIAL_MENU_ITEMS;
    } else {
      const items: MenuItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as MenuItem);
      });
      return items;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
    return INITIAL_MENU_ITEMS;
  }
}

/**
 * Loads or subscribes to menu products from Firestore
 */
export function subscribeToProducts(
  onUpdate: (items: MenuItem[]) => void,
  onError?: (error: Error) => void
) {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    productsRef,
    (snapshot) => {
      const items: MenuItem[] = [];
      snapshot.forEach((d) => items.push(d.data() as MenuItem));
      if (items.length > 0) {
        onUpdate(items);
      } else {
        onUpdate(INITIAL_MENU_ITEMS);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
      if (onError) onError(error as Error);
    }
  );
}

/**
 * Saves or updates a user profile in Firestore
 */
export async function saveUserProfile(
  user: Partial<ClientProfile> & { id: string }
): Promise<ClientProfile> {
  const userRef = doc(db, USERS_COLLECTION, user.id);
  try {
    const existingSnap = await getDoc(userRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as ClientProfile;
      const updated: ClientProfile = {
        ...existingData,
        ...user,
      };
      await updateDoc(userRef, {
        displayName: user.displayName || existingData.displayName,
        photoURL: user.photoURL || existingData.photoURL,
        email: user.email || existingData.email,
        updatedAt: new Date().toISOString(),
      });
      return updated;
    } else {
      const newProfile: ClientProfile = {
        id: user.id,
        displayName: user.displayName || 'Cliente CoffeeCodi',
        email: user.email || '',
        photoURL:
          user.photoURL ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBacARDoNwzPQO4--gb6Ud12m-qRu3c8akNb2iJfhTVqge8tn3qsWO3Zp1gnurkiDvPdgjiKFBoJLXps63ypLtZwz6YgebES7TQb5DNDrOhOJVApeULh3M2R_5X5LFbb1xURSZySwfm29M8yfLf5TbU2rhKlZcPSKp8N6rueiBSKKfLUYqVAan1RR-GzJ9gaKFdecgr9sHnKj4Yg24d-BU_UhmLaCGu1t1LPtu5jwufwcNSfOHD0uA',
        role: user.role || 'customer',
        favoriteCoffee: user.favoriteCoffee || 'Flat White Doble Shot',
        city: user.city || '[por definir]',
      };
      await setDoc(userRef, {
        ...newProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${user.id}`);
    return user as ClientProfile;
  }
}
