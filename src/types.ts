export type ProductCategory = 'cafe' | 'frias' | 'te' | 'pasteleria' | 'snacks';

export interface ProductCustomization {
  cupSize: {
    id: 'regular' | 'grande';
    name: string;
    extraPrice: number;
    description: string;
  };
  milkType: {
    id: string;
    name: string;
    extraPrice: number;
    description?: string;
  };
  sugarLevel: {
    id: string;
    name: string;
    description: string;
  };
  extras: {
    extraEspresso: boolean;
    extraCream: boolean;
    extraVanilla: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  description: string;
  imageUrl: string;
  badge?: string;
  specs?: string;
  tags: string[];
  sensoryNotes?: string[];
  customizable: boolean;
  available: boolean;
  flavorProfile: {
    acidity: number; // 1-5
    sweetness: number; // 1-5
    caffeine: number; // 1-5
    temperature: 'caliente' | 'frio' | 'ambas';
    preferredNotes: string[];
  };
}

export interface ClientProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'customer' | 'admin';
  favoriteCoffee?: string;
  city?: string;
  isDemo?: boolean;
}

export interface QuizState {
  step: 1 | 2 | 3;
  mood: string;
  intensityTemp: string;
  flavorNotes: string[];
}
