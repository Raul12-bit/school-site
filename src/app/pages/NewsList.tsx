import { useApp, useData } from '../context';
import { localizedUrl } from '../api';
import { Page, NewsCard, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { News } from '../types';

export function NewsList() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<News[]>(localizedUrl('/api/news', locale));
  return (
    <Page label={t.newsLabel} title={t.newsTitle}>
      {data ? (
        <div className="news-grid full-grid">
          {data.map((x) => (
            <NewsCard key={x.id} item={x} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
