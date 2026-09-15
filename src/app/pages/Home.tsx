import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Users } from 'lucide-react';
import { useApp, useData } from '../context';
import { localizedUrl } from '../api';
import { translations } from '../../i18n/translations';
import { Feature, NewsCard, EventRow, TeacherCard, ScheduleTable, ContactsBlock, Heading, Loading } from '../components/ui';
import type { News, Event, Teacher, Album, ScheduleEntry } from '../types';

function AboutSnippet() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<any>(localizedUrl('/api/school', locale));
  return (
    <section className="container about-section">
      <div className="about-photo">
        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85" alt="Сабақ үстіндегі оқушылар" />
        <div className="photo-mark">
          <BookOpen />
          <span>
            {t.aboutBadgeLine1}<br />· {t.aboutBadgeLine2} ·<br />{t.aboutBadgeLine3}
          </span>
        </div>
      </div>
      <div className="about-copy">
        <Heading label={t.aboutLabel} title={t.aboutTitle} />
        <p>{data?.description || t.aboutText}</p>
        <div className="stats">
          <div>
            <b>850+</b>
            <span>{t.statStudents}</span>
          </div>
          <div>
            <b>75</b>
            <span>{t.statTeachers}</span>
          </div>
          <div>
            <b>2010</b>
            <span>{t.statFounded}</span>
          </div>
        </div>
        <Link className="text-link" to="/about">
          {t.more}
          <ChevronRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function SchedulePreview() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<ScheduleEntry[]>(localizedUrl('/api/schedule?grade=7A&weekday=1', locale));
  return (
    <section className="schedule-preview">
      <div className="container">
        <div className="section-row">
          <Heading label={t.scheduleLabel} title={t.scheduleTitle} />
          <Link className="text-link" to="/schedule">
            {t.viewSchedule}
            <ChevronRight size={18} />
          </Link>
        </div>
        {data ? <ScheduleTable data={data} /> : <Loading />}
      </div>
    </section>
  );
}

export function Home() {
  const { locale } = useApp();
  const t = translations[locale];
  const news = useData<News[]>(localizedUrl('/api/news?limit=3', locale));
  const events = useData<Event[]>(localizedUrl('/api/events?limit=3', locale));
  const teachers = useData<Teacher[]>(localizedUrl('/api/teachers', locale));
  const albums = useData<Album[]>(localizedUrl('/api/gallery', locale));
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-content container">
          <div className="eyebrow">
            <span /> {t.welcome}
          </div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-buttons">
            <Link className="button primary" to="/about">
              {t.explore}
              <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/schedule">
              {t.schedule}
            </Link>
          </div>
          <div className="hero-note">
            <span className="line" />
            {t.since}
          </div>
        </div>
        <div className="hero-image" />
        <div className="hero-wave" />
      </section>
      <AboutSnippet />
      <section className="directions-section">
        <div className="container">
          <Heading label={t.directionsLabel} title={t.directionsTitle} />
          <div className="direction-grid">
            <Feature icon={<BookOpen />} no="01" title={t.dir1Title} text={t.dir1Text} />
            <Feature icon={<Users />} no="02" title={t.dir2Title} text={t.dir2Text} />
            <Feature icon={<CalendarDays />} no="03" title={t.dir3Title} text={t.dir3Text} />
          </div>
        </div>
      </section>
      <section className="container content-section">
        <div className="section-row">
          <Heading label={t.newsLabel} title={t.newsTitle} />
          <Link className="text-link" to="/news">
            {t.allNews}
            <ChevronRight size={18} />
          </Link>
        </div>
        {news.data ? (
          <div className="news-grid">
            {news.data.map((x) => (
              <NewsCard key={x.id} item={x} />
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </section>
      <section className="events-section">
        <div className="container events-layout">
          <div>
            <Heading label={t.eventsLabel} title={t.eventsTitle} />
            <p className="events-intro">{t.eventsIntro}</p>
            <Link className="button secondary compact-button" to="/events">
              {t.allEvents}
            </Link>
          </div>
          <div className="event-list">
            {events.data ? events.data.map((x) => <EventRow key={x.id} event={x} />) : <Loading />}
          </div>
        </div>
      </section>
      <section className="container content-section">
        <div className="section-row">
          <Heading label={t.teachersLabel} title={t.teachersTitle} />
          <Link className="text-link" to="/teachers">
            {t.allTeachers}
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="teacher-grid">
          {teachers.data?.slice(0, 3).map((x) => (
            <TeacherCard key={x.id} item={x} />
          ))}
        </div>
      </section>
      <SchedulePreview />
      <section className="gallery-strip">
        <div className="container">
          <div className="section-row">
            <Heading label={t.galleryLabel} title={t.galleryTitle} />
            <Link className="text-link" to="/gallery">
              {t.allGallery}
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="gallery-preview">
            {albums.data?.flatMap((x) => x.items).slice(0, 4).map((x) => (
              <img key={x.id} src={x.image_url} alt={x.title} />
            ))}
          </div>
        </div>
      </section>
      <section className="container feedback-teaser">
        <div>
          <Heading label={t.feedbackLabel} title={t.feedbackTitle} />
          <p>{t.feedbackText}</p>
        </div>
        <Link className="button primary" to="/feedback">
          {t.feedbackTeaser}
          <ArrowRight size={18} />
        </Link>
      </section>
      <ContactsBlock />
    </main>
  );
}
