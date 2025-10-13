import { useState, useEffect } from 'react';
import { cacheService } from '../services/CacheService';

interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  offlineQueue: Array<{
    id: string;
    action: () => Promise<any>;
    description: string;
  }>;
}

export const useOfflineSupport = () => {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    wasOffline: false,
    offlineQueue: [],
  });

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({
        ...prev,
        isOnline: true,
        wasOffline: prev.wasOffline || !prev.isOnline,
      }));

      // Processar fila offline quando voltar online
      processOfflineQueue();
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isOnline: false,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToOfflineQueue = (action: () => Promise<any>, description: string) => {
    const id = `offline-${Date.now()}-${Math.random()}`;
    setState(prev => ({
      ...prev,
      offlineQueue: [...prev.offlineQueue, { id, action, description }],
    }));
    return id;
  };

  const removeFromOfflineQueue = (id: string) => {
    setState(prev => ({
      ...prev,
      offlineQueue: prev.offlineQueue.filter(item => item.id !== id),
    }));
  };

  const processOfflineQueue = async () => {
    if (state.offlineQueue.length === 0) return;

    console.log(`Processing ${state.offlineQueue.length} offline actions...`);

    for (const item of state.offlineQueue) {
      try {
        await item.action();
        removeFromOfflineQueue(item.id);
        console.log(`Processed offline action: ${item.description}`);
      } catch (error) {
        console.error(`Failed to process offline action: ${item.description}`, error);
      }
    }
  };

  const getCachedData = <T>(key: string): T | null => {
    // Tentar buscar dados do cache quando offline
    return cacheService.get<T>(key) || cacheService.get<T>(key, 'sessionStorage');
  };

  const isDataStale = (key: string, maxAge: number = 30 * 60 * 1000): boolean => {
    // Verificar se os dados em cache estão muito antigos (30 min por padrão)
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return true;

      const data = JSON.parse(cached);
      return Date.now() - data.timestamp > maxAge;
    } catch {
      return true;
    }
  };

  return {
    isOnline: state.isOnline,
    wasOffline: state.wasOffline,
    offlineQueueLength: state.offlineQueue.length,
    addToOfflineQueue,
    removeFromOfflineQueue,
    processOfflineQueue,
    getCachedData,
    isDataStale,
  };
};

// Hook para operações que devem funcionar offline
export const useOfflineOperation = <T>(
  operation: () => Promise<T>,
  cacheKey: string,
  description: string
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, addToOfflineQueue, getCachedData } = useOfflineSupport();

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isOnline) {
        // Online: executar operação normalmente
        const result = await operation();
        setData(result);
        
        // Cache o resultado
        cacheService.set(cacheKey, result, { ttl: 30 * 60 * 1000 }); // 30 min
      } else {
        // Offline: tentar buscar do cache
        const cachedData = getCachedData<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
        } else {
          // Adicionar à fila offline
          addToOfflineQueue(async () => {
            const result = await operation();
            setData(result);
            cacheService.set(cacheKey, result, { ttl: 30 * 60 * 1000 });
            return result;
          }, description);
          
          setError('No cached data available. Operation queued for when online.');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Tentar buscar dados em cache mesmo com erro
      const cachedData = getCachedData<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        setError(`${errorMessage} (showing cached data)`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute,
    isOnline,
  };
};

export default useOfflineSupport;
