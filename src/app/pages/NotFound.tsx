import { Link } from 'react-router-dom';
import { useApp } from '../context';
import { Page } from '../components/ui';
import { translations } from '../../i18n/translations';

export function NotFound() {
  const { locale } = useApp();
  const t = translations[locale];
  return (
    <Page label={t.notFoundLabel} title={t.notFoundTitle}>
      <Link className="button primary" to="/">{t.notFoundButton}</Link>
    </Page>
  );
}
