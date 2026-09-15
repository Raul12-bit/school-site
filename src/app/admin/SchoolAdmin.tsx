import { useState, useEffect } from 'react';
import { api } from '../api';
import { Editor } from './Editor';

export function SchoolAdmin() {
  const [item, setItem] = useState<any>(null);
  
  useEffect(() => {
    api('/api/admin/school').then(setItem).catch(() => {});
  }, []);

  return (
    <>
      {item && (
        <>
          <div className="admin-title">
            <div>
              <p>БАСҚАРУ</p>
              <h1>Мектеп ақпараты</h1>
            </div>
          </div>
          <Editor
            fields={['title_kk','title_ru','title_en','description_kk','description_ru','description_en','history_kk','history_ru','history_en','address','phone','email','working_hours','social_links']}
            initial={item}
            cancel={() => {}}
            save={async (value) => setItem(await api('/api/admin/school', { method: 'PUT', body: JSON.stringify(value) }))}
          />
        </>
      )}
    </>
  );
}
