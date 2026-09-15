import { useApp } from '../context';
import { Page, ContactsBlock } from '../components/ui';
import { translations } from '../../i18n/translations';

export function Contacts() {
  const { locale } = useApp();
  const t = translations[locale];
  return (
    <Page label={t.contactsLabel} title={t.contactText}>
      <ContactsBlock />
    </Page>
  );
}
