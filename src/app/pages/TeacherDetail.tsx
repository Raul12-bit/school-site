import { useParams } from 'react-router-dom';
import { useApp, useData, fallback } from '../context';
import { localizedUrl } from '../api';
import { Page, Loading } from '../components/ui';
import { NotFound } from './NotFound';
import { translations } from '../../i18n/translations';
import type { Teacher } from '../types';

export function TeacherDetail() {
  const { locale } = useApp();
  const t = translations[locale];
  const { slug = '' } = useParams();
  const { data, failed } = useData<Teacher>(localizedUrl(`/api/teachers/${slug}`, locale));
  if (failed) return <NotFound />;
  return (
    <Page label={t.teacherLabel} title={data?.name || t.loading}>
      {data ? (
        <article className="teacher-detail">
          <img src={data.image_url || fallback} alt={data.name} />
          <div>
            <p className="accent">{data.subject}</p>
            <h2>{data.position}</h2>
            <p>{data.bio}</p>
          </div>
        </article>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
