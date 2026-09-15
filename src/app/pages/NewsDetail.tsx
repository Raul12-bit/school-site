import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp, useData, date, fallback } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { NotFound } from './NotFound';
import { translations } from '../../i18n/translations';
import type { News } from '../types';

export function NewsDetail() {
  const { locale } = useApp();
  const t = translations[locale];
  const { slug = '' } = useParams();
  const { data, failed } = useData<News>(localizedUrl(`/api/news/${slug}`, locale));
  if (failed) return <NotFound />;
  return (
    <Page label={t.newsDetailLabel} title={data?.title || t.loading}>
      {data ? (
        <article className="detail">
          <img src={data.image_url || fallback} alt="" />
          <time>{date(data.published_at)}</time>
          <p>{data.content}</p>
          <Link className="text-link" to="/news">
            <ArrowLeft size={18} />
            {t.newsDetailBack}
          </Link>
        </article>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
