import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, MapPin } from 'lucide-react';
import type { News, Event, Teacher, ScheduleEntry } from '../types';
import { useApp, fallback, date } from '../context';
import { translations } from '../../i18n/translations';

export function Heading({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-heading">
      <p>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}

export function Loading() {
  const { locale } = useApp();
  const t = translations[locale];
  return <div className="loading">{t.loading}</div>;
}

export function Page({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p>{label}</p>
          <h1>{title}</h1>
        </div>
      </section>
      <section className="container page-content">{children}</section>
    </main>
  );
}

export function Feature({ icon, no, title, text }: { icon: ReactNode; no: string; title: string; text: string }) {
  return (
    <article className="feature">
      <div className="feature-top">
        <span>{icon}</span>
        <b>{no}</b>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function NewsCard({ item }: { item: News }) {
  return (
    <article className="news-card">
      <img src={item.image_url || fallback} alt="" />
      <div>
        <time>{date(item.published_at)}</time>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <Link to={`/news/${item.slug}`} aria-label={item.title}>
          <ArrowRight size={19} />
        </Link>
      </div>
    </article>
  );
}

export function EventRow({ event }: { event: Event }) {
  const d = new Date(event.event_date);
  return (
    <Link className="event-item" to={`/events/${event.slug}`}>
      <div className="event-date">
        <b>{String(d.getDate()).padStart(2, '0')}</b>
        <span>{new Intl.DateTimeFormat('kk-KZ', { month: 'long' }).format(d).toUpperCase()}</span>
      </div>
      <div>
        <h3>{event.title}</h3>
        <p>
          <Clock3 size={15} />
          {event.event_time || '10:00'} · {event.location}
        </p>
      </div>
      <ArrowRight className="event-arrow" />
    </Link>
  );
}

export function TeacherCard({ item }: { item: Teacher }) {
  return (
    <Link className="teacher-card" to={`/teachers/${item.slug}`}>
      <img src={item.image_url || fallback} alt={item.name} />
      <div>
        <p>{item.subject}</p>
        <h3>{item.name}</h3>
        <span>{item.position}</span>
      </div>
    </Link>
  );
}

export function ScheduleTable({ data }: { data: ScheduleEntry[] }) {
  return (
    <div className="schedule-table">
      {data.map((x) => (
        <div className="schedule-row" key={x.id}>
          <b>{x.lesson_number}</b>
          <time>{x.time_start}</time>
          <span>{x.subject}</span>
          <span>{x.teacher}</span>
          <em>{x.classroom}</em>
        </div>
      ))}
    </div>
  );
}

export function ContactsBlock() {
  const { locale } = useApp();
  const { data } = useData<any>(localizedUrl('/api/school', locale));
  const t = translations[locale];

  return (
    <section className="container contact-section">
      <div>
        <Heading label={t.contactsLabel} title={t.contactsTitle} />
        <p>{t.feedbackTeaserText}</p>
        <Link className="button primary" to="/feedback">
          {t.feedbackTeaser}
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="contact-card">
        <div>
          <MapPin />
          <span>
            <small>{t.addressLabel}</small>
            {data?.address}
          </span>
        </div>
        <div>
          <Phone />
          <span>
            <small>{t.phoneLabel}</small>
            {data?.phone}
          </span>
        </div>
        <div>
          <Mail />
          <span>
            <small>{t.emailLabel}</small>
            {data?.email}
          </span>
        </div>
      </div>
    </section>
  );
}

import { localizedUrl } from '../api';
import { useData as rawUseData } from '../context';
import { Phone, Mail } from 'lucide-react';
function useData<T>(url: string) { return rawUseData<T>(url); }
