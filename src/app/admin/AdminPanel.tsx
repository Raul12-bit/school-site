import { useState, useEffect } from 'react';
import { LayoutDashboard, ChevronRight } from 'lucide-react';
import { useApp } from '../context';
import { api } from '../api';
import { Page } from '../components/ui';
import { Dashboard } from './Dashboard';
import { ResourceAdmin } from './ResourceAdmin';
import { UsersAdmin } from './UsersAdmin';
import { SchoolAdmin } from './SchoolAdmin';
import { SettingsAdmin } from './SettingsAdmin';
import { Login } from '../pages/Login';

const resources = [
  {key:'news',name:'Жаңалықтар',fields:['title_kk','title_ru','title_en','excerpt_kk','excerpt_ru','excerpt_en','content_kk','content_ru','content_en','image_url','published']},
  {key:'teachers',name:'Мұғалімдер',fields:['name_kk','name_ru','name_en','position_kk','position_ru','position_en','subject_kk','subject_ru','subject_en','bio_kk','bio_ru','bio_en','image_url']},
  {key:'schedules',name:'Кесте',fields:['grade','weekday','lesson_number','time_start','subject_kk','subject_ru','subject_en','teacher','classroom']},
  {key:'events',name:'Іс-шаралар',fields:['title_kk','title_ru','title_en','description_kk','description_ru','description_en','event_date','event_time','location_kk','location_ru','location_en','image_url','published']},
  {key:'albums',name:'Альбомдар',fields:['title_kk','title_ru','title_en','description_kk','description_ru','description_en','cover_url']},
  {key:'photos',name:'Фотосуреттер',fields:['album_id','title_kk','title_ru','title_en','description_kk','description_ru','description_en','image_url']},
  {key:'feedback',name:'Өтініштер',fields:['status','reply']}
];

export function AdminPanel() {
  const { user } = useApp();
  const [section, setSection] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api('/api/admin/dashboard').then(setStats).catch(() => {});
    }
  }, [user]);

  if (!user) return <Login />;
  if (user.role !== 'ADMIN') {
    return (
      <Page label="ҚОРҒАЛҒАН БӨЛІМ" title="Рұқсат жоқ">
        <p>Бұл бет тек әкімшілер үшін ашық.</p>
      </Page>
    );
  }

  const items = [
    ['dashboard', 'Dashboard'],
    ...resources.map((x) => [x.key, x.name]),
    ['users', 'Пайдаланушылар'],
    ['school', 'Мектеп ақпараты'],
    ['settings', 'Баптаулар']
  ];

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <p>БАСҚАРУ ПАНЕЛІ</p>
          <h2>№2 Мектеп</h2>
        </div>
        {items.map(([key, name]) => (
          <button className={section === key ? 'active' : ''} onClick={() => setSection(key)} key={key}>
            {key === 'dashboard' ? <LayoutDashboard size={17} /> : <ChevronRight size={17} />} {name}
          </button>
        ))}
      </aside>
      <section className="admin-main">
        {section === 'dashboard' ? <Dashboard stats={stats} /> :
         section === 'users' ? <UsersAdmin /> :
         section === 'school' ? <SchoolAdmin /> :
         section === 'settings' ? <SettingsAdmin /> :
         <ResourceAdmin resource={resources.find((x) => x.key === section)!} />
        }
      </section>
    </main>
  );
}
