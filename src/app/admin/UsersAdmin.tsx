import { useState, useEffect } from 'react';
import { api } from '../api';
import type { User } from '../types';

export function UsersAdmin() {
  const [rows, setRows] = useState<User[]>([]);
  
  useEffect(() => {
    api<User[]>('/api/admin/users').then(setRows).catch(() => {});
  }, []);

  const setRole = async (id: number, role: string) => {
    await api(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ role }) });
    setRows(rows.map((x) => (x.id === id ? { ...x, role: role as User['role'] } : x)));
  };

  return (
    <>
      <div className="admin-title">
        <div>
          <p>БАСҚАРУ</p>
          <h1>Пайдаланушылар</h1>
        </div>
      </div>
      <div className="admin-table">
        {rows.map((x) => (
          <div className="admin-row" key={x.id}>
            <div>
              <b>{x.name}</b>
              <small>{x.email}</small>
            </div>
            <select value={x.role} onChange={(e) => setRole(x.id, e.target.value)}>
              <option>USER</option>
              <option>TEACHER</option>
              <option>ADMIN</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
}
