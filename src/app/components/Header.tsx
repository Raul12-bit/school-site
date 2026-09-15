import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, Moon, ShieldCheck, Sun, X, User as UserIcon } from 'lucide-react';
import { useApp } from '../context';
import { translations, type Locale } from '../../i18n/translations';
import { api } from '../api';

export function Header({ theme, setTheme }: { theme: 'light' | 'dark'; setTheme: (x: 'light' | 'dark') => void }) {
  const { locale, setLocale, user, setUser } = useApp();
  const [open, setOpen] = useState(false);
  const t = translations[locale];

  const nav = [
    ['/', t.nav[0]],
    ['/about', t.nav[1]],
    ['/news', t.nav[2]],
    ['/teachers', t.nav[3]],
    ['/schedule', t.nav[4]],
    ['/events', t.nav[5]],
    ['/gallery', t.nav[6]],
    ['/contacts', t.nav[7]]
  ];

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <header className="header">
      <Link className="brand" to="/">
        <img src="/public-school-logo.png" alt={`${t.schoolCity} ${t.schoolName}`} />
        <span>
          <b>{t.schoolName}</b>
          <small>{t.schoolCity}</small>
        </span>
      </Link>
      <nav className={open ? 'nav nav-open' : 'nav'}>
        {nav.map(([to, label]) => (
          <NavLink onClick={() => setOpen(false)} to={to} key={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <div className="locale-switcher">
          {(['kk', 'ru', 'en'] as Locale[]).map((x) => (
            <button className={locale === x ? 'active' : ''} onClick={() => setLocale(x)} key={x}>
              {x.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
        </button>
        {user?.role === 'ADMIN' && (
          <Link className="admin-link" to="/admin">
            <ShieldCheck size={18} />
          </Link>
        )}
        {user ? (
          <>
            <Link className="icon-button" to="/profile">
              <UserIcon size={19} />
            </Link>
            <button className="login-button" onClick={logout}>
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link className="login-button" to="/auth/login">
            {t.login}
          </Link>
        )}
        <button className="menu-button" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
