import { useState } from 'react';
import { useApp, useData, fallback } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { Album } from '../types';

export function Gallery() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<Album[]>(localizedUrl('/api/gallery', locale));
  const [active, setActive] = useState<string | null>(null);

  return (
    <Page label={t.galleryLabel} title={t.galleryTitle}>
      {data ? (
        <>
          <div className="album-grid">
            {data.map((x) => (
              <article className="album-card" key={x.id}>
                <img src={x.cover_url || x.items[0]?.image_url || fallback} alt="" />
                <h2>{x.title}</h2>
                <p>{x.description}</p>
              </article>
            ))}
          </div>
          <div className="gallery-grid">
            {data
              .flatMap((x) => x.items)
              .map((x) => (
                <button key={x.id} onClick={() => setActive(x.image_url)}>
                  <img src={x.image_url} alt={x.title} />
                </button>
              ))}
          </div>
          {active && (
            <div className="lightbox" onClick={() => setActive(null)}>
              <img src={active} alt="" />
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
