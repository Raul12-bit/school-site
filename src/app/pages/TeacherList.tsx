import { useApp, useData } from '../context';
import { localizedUrl } from '../api';
import { Page, TeacherCard, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { Teacher } from '../types';

export function TeacherList() {
  const { locale } = useApp();
  const t = translations[locale];
  const { data } = useData<Teacher[]>(localizedUrl('/api/teachers', locale));
  return (
    <Page label={t.teachersLabel} title={t.teachersTitle}>
      {data ? (
        <div className="teacher-grid full-grid">
          {data.map((x) => (
            <TeacherCard key={x.id} item={x} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}
