import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context';
import { api } from '../api';
import { Page } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { User } from '../types';

export function Login() {
  const { locale, setUser } = useApp();
  const t = translations[locale];
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setUser(res.user);
      navigate(res.user.role === 'ADMIN' ? '/admin' : '/');
    } catch {
      setError(t.authLoginError);
    }
  };

  return (
    <Page label={t.profileLabel} title={t.authLogin}>
      <form className="form-card auth-card" onSubmit={submit}>
        <label>
          {t.authEmail}
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          {t.authPassword}
          <input type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="button primary">{t.authLogin}</button>
        {error && <p className="form-message error">{error}</p>}
        <Link className="plain-button" to="/auth/register">{t.authRegisterLink}</Link>
      </form>
    </Page>
  );
}
