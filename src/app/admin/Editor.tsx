import { useState } from 'react';

export function Editor({ fields, initial, cancel, save }: { fields: string[]; initial: any; cancel: () => void; save: (x: any) => Promise<void> }) {
  const [value, setValue] = useState<any>(() => Object.fromEntries(fields.map((f) => [f, initial[f] ?? (f === 'published' ? true : '')])));
  const [busy, setBusy] = useState(false);

  const set = (key: string, v: any) => setValue({ ...value, [key]: v });
  
  const upload = async (file: File, key: string) => {
    const body = new FormData();
    body.append('image', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', credentials: 'include', body });
    const result = await response.json();
    if (response.ok) set(key, result.url);
  };

  return (
    <form className="editor" onSubmit={async (e) => { e.preventDefault(); setBusy(true); await save(value); setBusy(false); }}>
      <h2>{initial.id ? 'Өңдеу' : 'Жаңа жазба'}</h2>
      <div className="editor-grid">
        {fields.map((field) => (
          <label key={field}>
            {field}
            {field === 'published' ? (
              <input type="checkbox" checked={Boolean(value[field])} onChange={(e) => set(field, e.target.checked)} />
            ) : field.includes('content') || field.includes('description') || field.includes('bio') || field.includes('excerpt') || field === 'reply' ? (
              <textarea value={value[field]} onChange={(e) => set(field, e.target.value)} />
            ) : field === 'image_url' || field === 'cover_url' ? (
              <>
                <input value={value[field]} onChange={(e) => set(field, e.target.value)} placeholder="URL немесе файл жүктеңіз" />
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], field)} />
              </>
            ) : (
              <input type={field.includes('date') ? 'date' : field.includes('time') ? 'time' : field === 'weekday' || field === 'lesson_number' || field === 'album_id' ? 'number' : 'text'} value={value[field]} onChange={(e) => set(field, e.target.value)} />
            )}
          </label>
        ))}
      </div>
      <div className="editor-actions">
        <button className="button primary" disabled={busy}>{busy ? 'Сақталуда…' : 'Сақтау'}</button>
        <button className="plain-button" type="button" onClick={cancel}>Бас тарту</button>
      </div>
    </form>
  );
}
