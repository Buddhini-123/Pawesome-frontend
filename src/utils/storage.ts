// Local storage wrapper with error handling and type safety

export class StorageService {
  private prefix: string = 'pawsome_';

  // Generic get method with type safety
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue || null;
    }
  }

  // Generic set method
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  }

  // Remove item
  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  }

  // Clear all items with prefix
  clearAll(): boolean {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }

  // Check if storage is available
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage size (approximate)
  getSize(): number {
    let size = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
          size += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage size', error);
    }
    return size;
  }
}

// Create singleton instance
export const storage = new StorageService();

// Specific storage keys
export const STORAGE_KEYS = {
  CART: 'cart',
  USER: 'user',
  TOKEN: 'token',
  WISHLIST: 'wishlist',
  RECENT_SEARCHES: 'recent_searches',
  PREFERENCES: 'preferences',
  SELECTED_ADDRESS: 'selected_address',
  CHECKOUT_DATA: 'checkout_data'
} as const;