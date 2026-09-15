import { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../api';
import { useApp } from '../context';
import { Page } from '../components/ui';
import { translations } from '../../i18n/translations';

export function Feedback() {
  const { locale } = useApp();
  const t = translations[locale];
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' });
  const [result, setResult] = useState('');

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/api/feedback', { method: 'POST', body: JSON.stringify(form) });
      setResult(t.feedbackSuccess);
      setForm({ name: '', contact: '', subject: '', message: '' });
    } catch {
      setResult(t.feedbackError);
    }
  };

  return (
    <Page label={t.feedbackLabel} title={t.feedbackTitle}>
      <form className="form-card" onSubmit={send}>
        <p>{t.feedbackText}</p>
        <label>
          {t.formName}
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          {t.formContact}
          <input required placeholder={t.formContactPlaceholder} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </label>
        <label>
          {t.formSubject}
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </label>
        <label>
          {t.formMessage}
          <textarea required minLength={10} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        <button className="button primary">
          {t.formSend} <Send size={17} />
        </button>
        {result && <p className="form-message">{result}</p>}
      </form>
    </Page>
  );
}
