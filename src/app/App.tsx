import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context } from './context';
import { Layout } from './components/Layout';
import { api } from './api';
import type { User } from './types';
import type { Locale } from '../i18n/translations';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('school-theme') as 'light' | 'dark') || 'light');
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('school-locale') as Locale) || 'kk');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
    localStorage.setItem('school-theme', theme);
    localStorage.setItem('school-locale', locale);
  }, [theme, locale]);

  useEffect(() => {
    api<{ user: User }>('/api/auth/me')
      .then((x) => setUser(x.user))
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <Context.Provider value={{ locale, setLocale, user, setUser }}>
        <Layout theme={theme} setTheme={setTheme} />
      </Context.Provider>
    </BrowserRouter>
  );
}
