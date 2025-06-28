import { useState, useEffect, useCallback, useRef } from 'react';

interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useAsync<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    error: null,
    data: null,
  });

  // Track if component is mounted
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ loading: true, error: null, data: null });

      try {
        const response = await asyncFunction(...args);
        
        if (mountedRef.current) {
          setState({ loading: false, error: null, data: response });
        }
        
        return response;
      } catch (error) {
        if (mountedRef.current) {
          setState({ 
            loading: false, 
            error: error instanceof Error ? error : new Error(String(error)), 
            data: null 
          });
        }
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}