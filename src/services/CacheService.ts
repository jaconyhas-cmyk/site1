interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
}

class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set item in cache with optional TTL
   */
  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const { ttl = this.defaultTTL, storage = 'localStorage' } = config;
    
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };

    try {
      switch (storage) {
        case 'localStorage':
          localStorage.setItem(key, JSON.stringify(cacheItem));
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, JSON.stringify(cacheItem));
          break;
        case 'memory':
          this.memoryCache.set(key, cacheItem);
          break;
      }
    } catch (error) {
      console.warn('Cache storage failed:', error);
      // Fallback to memory cache
      this.memoryCache.set(key, cacheItem);
    }
  }

  /**
   * Get item from cache
   */
  get<T>(key: string, storage: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage'): T | null {
    try {
      let cacheItem: CacheItem<T> | null = null;

      switch (storage) {
        case 'localStorage':
          const localItem = localStorage.getItem(key);
          cacheItem = localItem ? JSON.parse(localItem) : null;
          break;
        case 'sessionStorage':
          const sessionItem = sessionStorage.getItem(key);
          cacheItem = sessionItem ? JSON.parse(sessionItem) : null;
          break;
        case 'memory':
          cacheItem = this.memoryCache.get(key) || null;
          break;
      }

      if (!cacheItem) return null;

      // Check if expired
      if (Date.now() > cacheItem.expiry) {
        this.delete(key, storage);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  }

  /**
   * Delete item from cache
   */
  delete(key: string, storage: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage'): void {
    try {
      switch (storage) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'memory':
          this.memoryCache.delete(key);
          break;
      }
    } catch (error) {
      console.warn('Cache deletion failed:', error);
    }
  }

  /**
   * Clear all cache for a specific storage
   */
  clear(storage: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage'): void {
    try {
      switch (storage) {
        case 'localStorage':
          // Only clear our cache keys
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('video_') || key.startsWith('videos_') || key.startsWith('cache_')) {
              localStorage.removeItem(key);
            }
          });
          break;
        case 'sessionStorage':
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('video_') || key.startsWith('videos_') || key.startsWith('cache_')) {
              sessionStorage.removeItem(key);
            }
          });
          break;
        case 'memory':
          this.memoryCache.clear();
          break;
      }
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }

  /**
   * Get or set with a factory function
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    config: CacheConfig = {}
  ): Promise<T> {
    const cached = this.get<T>(key, config.storage);
    
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, config);
    return data;
  }

  /**
   * Check if item exists and is not expired
   */
  has(key: string, storage: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage'): boolean {
    return this.get(key, storage) !== null;
  }

  /**
   * Get cache statistics
   */
  getStats(): { localStorage: number; sessionStorage: number; memory: number } {
    let localStorageCount = 0;
    let sessionStorageCount = 0;

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('video_') || key.startsWith('videos_') || key.startsWith('cache_')) {
          localStorageCount++;
        }
      });

      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('video_') || key.startsWith('videos_') || key.startsWith('cache_')) {
          sessionStorageCount++;
        }
      });
    } catch (error) {
      console.warn('Cache stats failed:', error);
    }

    return {
      localStorage: localStorageCount,
      sessionStorage: sessionStorageCount,
      memory: this.memoryCache.size
    };
  }

  /**
   * Preload data into cache
   */
  async preload<T>(key: string, factory: () => Promise<T>, config: CacheConfig = {}): Promise<void> {
    if (!this.has(key, config.storage)) {
      try {
        const data = await factory();
        this.set(key, data, config);
      } catch (error) {
        console.warn('Cache preload failed:', error);
      }
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
