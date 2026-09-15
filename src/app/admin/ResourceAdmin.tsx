import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../api';
import { Editor } from './Editor';

export function ResourceAdmin({ resource }: { resource: { key: string; name: string; fields: string[] } }) {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);

  const refresh = () => api<any[]>(`/api/admin/${resource.key}`).then(setRows);
  useEffect(() => { refresh(); }, [resource.key]);

  const save = async (value: any) => {
    if (editing) await api(`/api/admin/${resource.key}/${editing.id}`, { method: 'PATCH', body: JSON.stringify(value) });
    else await api(`/api/admin/${resource.key}`, { method: 'POST', body: JSON.stringify(value) });
    setEditing(null);
    setAdding(false);
    refresh();
  };

  const remove = async (id: number) => {
    if (confirm('Бұл жазбаны жою керек пе?')) {
      await api(`/api/admin/${resource.key}/${id}`, { method: 'DELETE' });
      refresh();
    }
  };

  return (
    <>
      <div className="admin-title">
        <div>
          <p>БАСҚАРУ</p>
          <h1>{resource.name}</h1>
        </div>
        {resource.key !== 'feedback' && (
          <button className="button primary" onClick={() => setAdding(true)}>
            <Plus size={17} />Қосу
          </button>
        )}
      </div>
      {(adding || editing) && (
        <Editor fields={resource.fields} initial={editing || {}} cancel={() => { setAdding(false); setEditing(null); }} save={save} />
      )}
      <div className="admin-table">
        {rows.map((row) => (
          <div className="admin-row" key={row.id}>
            <div>
              <b>{row.title_kk || row.name_kk || row.grade || row.subject_kk || row.message?.slice(0, 60) || `#${row.id}`}</b>
              <small>{row.created_at || row.event_date || row.status || ''}</small>
            </div>
            <div>
              <button onClick={() => setEditing(row)}>Өңдеу</button>
              {resource.key !== 'feedback' && (
                <button className="danger" onClick={() => remove(row.id)}>Жою</button>
              )}
            </div>
          </div>
        ))}
        {!rows.length && <p className="empty">Жазбалар әзірге жоқ.</p>}
      </div>
    </>
  );
}
