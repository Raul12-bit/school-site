import express from 'express'
import { z } from 'zod'
import { all, one, run, localized } from '../db.mjs'

export function localeFrom(req) { return ['kk', 'ru', 'en'].includes(req.query.locale) ? req.query.locale : 'kk' }

function publicNews(locale, limit) { return all(`SELECT * FROM news WHERE published=1 ORDER BY published_at DESC, id DESC ${limit ? 'LIMIT ?' : ''}`, limit ? [limit] : []).map(row => localized(row, locale, ['title', 'excerpt', 'content'])) }
function publicTeachers(locale) { return all('SELECT * FROM teachers ORDER BY id DESC').map(row => localized(row, locale, ['name', 'position', 'subject', 'bio'])) }
function publicEvents(locale, limit) { return all(`SELECT * FROM events WHERE published=1 AND event_date >= date('now') ORDER BY event_date, event_time ${limit ? 'LIMIT ?' : ''}`, limit ? [limit] : []).map(row => localized(row, locale, ['title', 'description', 'location'])) }

export function createPublicRouter() {
  const router = express.Router()

  router.get('/school', (req,res) => { const row=one('SELECT * FROM school_information WHERE id=1'); res.json({...localized(row,localeFrom(req),['title','description','history']), working_hours: row.working_hours, social_links: row.social_links}) })
  router.get('/news', (req,res) => res.json(publicNews(localeFrom(req), Math.min(Number(req.query.limit)||0,12))))
  router.get('/news/:slug', (req,res) => { const row=one('SELECT * FROM news WHERE slug=? AND published=1',[req.params.slug]); if (!row) return res.status(404).json({error:'NOT_FOUND'}); res.json(localized(row,localeFrom(req),['title','excerpt','content'])) })
  router.get('/teachers', (req,res) => res.json(publicTeachers(localeFrom(req))))
  router.get('/teachers/:slug', (req,res) => { const row=one('SELECT * FROM teachers WHERE slug=?',[req.params.slug]); if (!row) return res.status(404).json({error:'NOT_FOUND'}); res.json(localized(row,localeFrom(req),['name','position','subject','bio'])) })
  router.get('/events', (req,res) => res.json(publicEvents(localeFrom(req), Math.min(Number(req.query.limit)||0,12))))
  router.get('/events/:slug', (req,res) => { const row=one('SELECT * FROM events WHERE slug=? AND published=1',[req.params.slug]); if (!row) return res.status(404).json({error:'NOT_FOUND'}); res.json(localized(row,localeFrom(req),['title','description','location'])) })
  router.get('/gallery', (req,res) => { const locale=localeFrom(req); const albums=all('SELECT * FROM gallery_albums ORDER BY id DESC').map(a => ({...localized(a,locale,['title','description']),items:all('SELECT * FROM gallery_items WHERE album_id=? ORDER BY id DESC',[a.id]).map(i=>localized(i,locale,['title','description']))})); res.json(albums) })
  router.get('/schedule', (req,res) => { const locale=localeFrom(req); const grade=String(req.query.grade||'7A'); const weekday=Number(req.query.weekday||1); res.json(all('SELECT * FROM schedule_entries WHERE grade=? AND weekday=? ORDER BY lesson_number',[grade,weekday]).map(x=>localized(x,locale,['subject']))) })
  router.get('/schedule/grades', (req,res) => { res.json(all('SELECT DISTINCT grade FROM schedule_entries ORDER BY grade').map(row => row.grade)) })
  router.post('/feedback', (req,res) => { const parsed=z.object({name:z.string().trim().min(2).max(100),contact:z.string().trim().min(3).max(200),subject:z.string().trim().min(3).max(160),message:z.string().trim().min(10).max(5000)}).safeParse(req.body); if(!parsed.success)return res.status(400).json({error:'INVALID_INPUT'}); const id=run('INSERT INTO feedback_messages(name,contact,subject,message) VALUES(?,?,?,?)',Object.values(parsed.data)); res.status(201).json({id}) })

  return router
}
