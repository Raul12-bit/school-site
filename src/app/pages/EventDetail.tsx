import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useApp, useData, date, fallback } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { NotFound } from './NotFound';
import { translations } from '../../i18n/translations';
import type { Event } from '../types';

export function EventDetail() {
  const { locale } = useApp();
  const t = translations[locale];
  const { slug = '' } = useParams();
  const { data, failed } = useData<Event>(localizedUrl(`/api/events/${slug}`, locale));
  if (failed) return <NotFound />;
  return (
    <Page label={t.eventLabel} title={data?.title || t.loading}>
      {data ? (
        <article className="detail">
          <img src={data.image_url || fallback} alt="" />
          <time>{date(data.event_date)} · {data.event_time}</time>
          <p><MapPin size={15}/> {data.location}</p>
          <p>{data.description}</p>
          <Link className="text-link" to="/events">
            <ArrowLeft size={18} />
            {t.eventBack}
          </Link>
        </article>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
