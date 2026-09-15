import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { api } from '../api';
import { Page } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { User } from '../types';

export function Profile() {
  const { locale, user, setUser } = useApp();
  const t = translations[locale];
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) navigate('/auth/login');
  }, [user, navigate]);

  if (!user) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ user: User }>('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(form)
      });
      setUser(res.user);
      setMsg(t.profileSaved);
    } catch {
      setMsg(t.feedbackError);
    }
  };

  return (
    <Page label={t.profileLabel} title={t.profileTitle}>
      <form className="form-card auth-card" onSubmit={save}>
        <div className="profile-role-badge">
          <span>{t.profileRole}: <b>{user.role}</b></span>
        </div>
        <label>
          {t.authName}
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          {t.authEmail}
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <button className="button primary">{t.profileSave}</button>
        {msg && <p className="form-message">{msg}</p>}
      </form>
    </Page>
  );
}
