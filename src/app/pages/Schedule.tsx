import { useState, useEffect } from 'react';
import { useApp, useData } from '../context';
import { api, localizedUrl } from '../api';
import { Page, ScheduleTable, Loading } from '../components/ui';
import { translations } from '../../i18n/translations';
import type { ScheduleEntry } from '../types';

export function Schedule() {
  const { locale } = useApp();
  const t = translations[locale];
  const [grade, setGrade] = useState('7A');
  const [weekday, setDay] = useState(1);
  const { data } = useData<ScheduleEntry[]>(localizedUrl(`/api/schedule?grade=${grade}&weekday=${weekday}`, locale));
  const [grades, setGrades] = useState<string[]>(['7A','7B','8A']);

  useEffect(() => {
    api<string[]>('/api/schedule/grades').then(setGrades).catch(() => {});
  }, []);

  return (
    <Page label={t.scheduleLabel} title={t.scheduleTitle}>
      <div className="filters">
        <label>
          {t.scheduleClass}
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            {grades.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label>
          {t.scheduleDay}
          <select value={weekday} onChange={(e) => setDay(Number(e.target.value))}>
            {t.days.map((x, i) => (
              <option key={x} value={i + 1}>
                {x}
              </option>
            ))}
          </select>
        </label>
      </div>
      {data ? <ScheduleTable data={data} /> : <Loading />}
    </Page>
  );
}
