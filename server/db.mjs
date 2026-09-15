import initSqlJs from 'sql.js'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
export const dataDir = join(root, 'data')
export const uploadsDir = join(root, 'uploads')

for (const directory of [dataDir, uploadsDir]) {
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true })
}

export const databasePath = join(dataDir, 'school.sqlite')
const SQL = await initSqlJs()
export const db = existsSync(databasePath) ? new SQL.Database(readFileSync(databasePath)) : new SQL.Database()

const schema = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER','TEACHER','ADMIN')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS school_information (id INTEGER PRIMARY KEY CHECK(id=1), title_kk TEXT, title_ru TEXT, title_en TEXT, description_kk TEXT, description_ru TEXT, description_en TEXT, history_kk TEXT, history_ru TEXT, history_en TEXT, address TEXT, phone TEXT, email TEXT, working_hours TEXT, social_links TEXT, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title_kk TEXT NOT NULL, title_ru TEXT, title_en TEXT, excerpt_kk TEXT, excerpt_ru TEXT, excerpt_en TEXT, content_kk TEXT NOT NULL, content_ru TEXT, content_en TEXT, image_url TEXT, published INTEGER NOT NULL DEFAULT 0, published_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, name_kk TEXT NOT NULL, name_ru TEXT, name_en TEXT, position_kk TEXT, position_ru TEXT, position_en TEXT, subject_kk TEXT, subject_ru TEXT, subject_en TEXT, bio_kk TEXT, bio_ru TEXT, bio_en TEXT, image_url TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title_kk TEXT NOT NULL, title_ru TEXT, title_en TEXT, description_kk TEXT, description_ru TEXT, description_en TEXT, event_date TEXT NOT NULL, event_time TEXT, location_kk TEXT, location_ru TEXT, location_en TEXT, image_url TEXT, published INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS schedule_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, grade TEXT NOT NULL, weekday INTEGER NOT NULL CHECK(weekday BETWEEN 1 AND 6), lesson_number INTEGER NOT NULL, time_start TEXT NOT NULL, subject_kk TEXT NOT NULL, subject_ru TEXT, subject_en TEXT, teacher TEXT NOT NULL, classroom TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS gallery_albums (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT UNIQUE NOT NULL, title_kk TEXT NOT NULL, title_ru TEXT, title_en TEXT, description_kk TEXT, description_ru TEXT, description_en TEXT, cover_url TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS gallery_items (id INTEGER PRIMARY KEY AUTOINCREMENT, album_id INTEGER NOT NULL, title_kk TEXT, title_ru TEXT, title_en TEXT, description_kk TEXT, description_ru TEXT, description_en TEXT, image_url TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS feedback_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, contact TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW','IN_PROGRESS','ANSWERED','CLOSED')), reply TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`
db.run('PRAGMA foreign_keys = ON')
db.run(schema)

export function save() { writeFileSync(databasePath, Buffer.from(db.export())) }
export function all(query, params = []) { const statement = db.prepare(query); statement.bind(params); const rows = []; while (statement.step()) rows.push(statement.getAsObject()); statement.free(); return rows }
export function one(query, params = []) { return all(query, params)[0] }
export function run(query, params = []) { db.run(query, params); save(); return one('SELECT last_insert_rowid() AS id').id }
export function slug(value) { return `${String(value || 'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item'}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` }
export function localized(row, locale, keys) { const result = { ...row }; for (const key of keys) result[key] = row[`${key}_${locale}`] || row[`${key}_kk`] || ''; return result }
