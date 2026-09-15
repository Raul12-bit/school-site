import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { User } from './types';
import type { Locale } from '../i18n/translations';

export type ContextValue = {
  locale: Locale;
  setLocale: (x: Locale) => void;
  user: User | null;
  setUser: (x: User | null) => void;
};

export const Context = createContext<ContextValue | null>(null);

export const useApp = () => {
  const value = useContext(Context);
  if (!value) throw Error('Missing context');
  return value;
};

export const fallback = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=85';

export const date = (value?: string) => 
  value ? new Intl.DateTimeFormat('kk-KZ', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value)) : '';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  
  useEffect(() => {
    let live = true;
    setData(null);
    api<T>(url)
      .then((x) => live && setData(x))
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [url]);
  
  return { data, failed };
}
