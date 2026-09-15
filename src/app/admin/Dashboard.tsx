import { ShieldCheck } from 'lucide-react';
import { Loading } from '../components/ui';

export function Dashboard({ stats }: { stats: any }) {
  return (
    <>
      <div className="admin-title">
        <div>
          <p>DASHBOARD</p>
          <h1>Басқару панелі</h1>
        </div>
      </div>
      {stats ? (
        <div className="metric-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key}>
              <span>{key}</span>
              <b>{String(value)}</b>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
      <div className="admin-note">
        <ShieldCheck />
        <p>Барлық әкімшілік әрекеттер серверлік рөлдік тексеруден өтеді.</p>
      </div>
    </>
  );
}
