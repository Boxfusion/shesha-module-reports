import { useState, useEffect } from 'react';

export const useWindow = () => {
  const [localWindow, setWindow] = useState<Window & typeof globalThis>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindow(window);
    }
  }, []);

  return localWindow;
};
