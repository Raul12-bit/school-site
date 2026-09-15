import { useApp, useData } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';

export function About() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<any>(localizedUrl('/api/school', locale));
  return (
    <Page label={t.aboutLabel} title={data?.title || t.loading}>
      {data ? (
        <article className="prose">
          <h2>{t.aboutTitle}</h2>
          <p>{data.description}</p>
          <h2>История</h2>
          <p>{data.history}</p>
        </article>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
