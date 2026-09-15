import { useApp, useData, date, fallback } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';

export function Events() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<Event[]>(localizedUrl('/api/events', locale));
  return (
    <Page label={t.eventsLabel} title={t.eventsTitle}>
      {data ? (
        <div className="event-page-grid">
          {data.map((x) => (
            <Link to={`/events/${x.slug}`} className="event-card" key={x.id}>
              <img src={x.image_url || fallback} alt="" />
              <time>
                {date(x.event_date)} · {x.event_time}
              </time>
              <h2>{x.title}</h2>
              <p>{x.description}</p>
              <span>
                <MapPin size={15} />
                {x.location}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
