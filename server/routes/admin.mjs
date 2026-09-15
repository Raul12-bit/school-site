import express from 'express'
import multer from 'multer'
import { z } from 'zod'
import { extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { auth, admin } from '../auth.mjs'
import { all, one, run, slug, uploadsDir } from '../db.mjs'

const imageUpload = multer({ storage: multer.diskStorage({ destination: uploadsDir, filename: (_req, file, done) => done(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`) }), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, done) => done(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) })

const resources = {
  news: { table:'news', fields:['slug','title_kk','title_ru','title_en','excerpt_kk','excerpt_ru','excerpt_en','content_kk','content_ru','content_en','image_url','published','published_at'], order:'id DESC' },
  teachers: { table:'teachers', fields:['slug','name_kk','name_ru','name_en','position_kk','position_ru','position_en','subject_kk','subject_ru','subject_en','bio_kk','bio_ru','bio_en','image_url'], order:'id DESC' },
  events: { table:'events', fields:['slug','title_kk','title_ru','title_en','description_kk','description_ru','description_en','event_date','event_time','location_kk','location_ru','location_en','image_url','published'], order:'event_date ASC' },
  schedules: { table:'schedule_entries', fields:['grade','weekday','lesson_number','time_start','subject_kk','subject_ru','subject_en','teacher','classroom'], order:'grade,weekday,lesson_number' },
  albums: { table:'gallery_albums', fields:['slug','title_kk','title_ru','title_en','description_kk','description_ru','description_en','cover_url'], order:'id DESC' },
  photos: { table:'gallery_items', fields:['album_id','title_kk','title_ru','title_en','description_kk','description_ru','description_en','image_url'], order:'id DESC' },
  feedback: { table:'feedback_messages', fields:['status','reply'], order:'id DESC' }
}

function payloadFor(resource, body, isNew=false) { const config=resources[resource]; const values={}; for(const field of config.fields) if(body[field] !== undefined) values[field]=typeof body[field] === 'string' ? body[field].trim() : body[field]; if(isNew && config.fields.includes('slug') && !values.slug) values.slug=slug(values.title_kk || values.name_kk); if(values.published !== undefined) values.published=values.published ? 1 : 0; if(resource==='news' && values.published && !values.published_at) values.published_at=new Date().toISOString(); return values }

export function createAdminRouter() {
  const router = express.Router()

  router.get('/dashboard', auth, admin, (_req,res) => { const count=t=>Number(one(`SELECT COUNT(*) AS total FROM ${t}`).total); res.json({news:count('news'),teachers:count('teachers'),events:count('events'),feedback:count('feedback_messages'),users:count('users')}) })
  router.get('/users', auth, admin, (_req,res) => res.json(all('SELECT id,name,email,role,created_at FROM users ORDER BY id DESC')))
  router.patch('/users/:id', auth, admin, (req,res) => { const role=z.enum(['USER','TEACHER','ADMIN']).safeParse(req.body.role); if(!role.success)return res.status(400).json({error:'INVALID_ROLE'}); if(Number(req.params.id)===req.user.id && role.data!=='ADMIN')return res.status(400).json({error:'CANNOT_REMOVE_OWN_ADMIN'}); run('UPDATE users SET role=? WHERE id=?',[role.data,Number(req.params.id)]); res.json(one('SELECT id,name,email,role FROM users WHERE id=?',[Number(req.params.id)])) })
  router.get('/school', auth, admin, (_req,res) => res.json(one('SELECT * FROM school_information WHERE id=1')))
  router.put('/school', auth, admin, (req,res) => { const allowed=['title_kk','title_ru','title_en','description_kk','description_ru','description_en','history_kk','history_ru','history_en','address','phone','email','working_hours','social_links']; const values=allowed.filter(k=>req.body[k]!==undefined).reduce((o,k)=>({...o,[k]:String(req.body[k]).trim()}),{}); if(!Object.keys(values).length)return res.status(400).json({error:'INVALID_INPUT'}); run(`UPDATE school_information SET ${Object.keys(values).map(k=>`${k}=?`).join(',')},updated_at=CURRENT_TIMESTAMP WHERE id=1`,Object.values(values)); res.json(one('SELECT * FROM school_information WHERE id=1')) })
  router.post('/upload', auth, admin, imageUpload.single('image'), (req,res) => { if(!req.file)return res.status(400).json({error:'IMAGE_REQUIRED'}); res.status(201).json({url:`/uploads/${req.file.filename}`}) })
  router.get('/:resource', auth, admin, (req,res) => { const c=resources[req.params.resource]; if(!c)return res.status(404).json({error:'NOT_FOUND'}); res.json(all(`SELECT * FROM ${c.table} ORDER BY ${c.order}`)) })
  router.post('/:resource', auth, admin, (req,res) => { const c=resources[req.params.resource]; if(!c || req.params.resource==='feedback')return res.status(404).json({error:'NOT_FOUND'}); const values=payloadFor(req.params.resource,req.body,true); const keys=Object.keys(values); if(!keys.length)return res.status(400).json({error:'INVALID_INPUT'}); const id=run(`INSERT INTO ${c.table}(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`,Object.values(values)); res.status(201).json(one(`SELECT * FROM ${c.table} WHERE id=?`,[id])) })
  router.patch('/:resource/:id', auth, admin, (req,res) => { const c=resources[req.params.resource]; if(!c)return res.status(404).json({error:'NOT_FOUND'}); const values=payloadFor(req.params.resource,req.body); const keys=Object.keys(values); if(!keys.length)return res.status(400).json({error:'INVALID_INPUT'}); run(`UPDATE ${c.table} SET ${keys.map(k=>`${k}=?`).join(',')} WHERE id=?`,[...Object.values(values),Number(req.params.id)]); res.json(one(`SELECT * FROM ${c.table} WHERE id=?`,[Number(req.params.id)])) })
  router.delete('/:resource/:id', auth, admin, (req,res) => { const c=resources[req.params.resource]; if(!c)return res.status(404).json({error:'NOT_FOUND'}); run(`DELETE FROM ${c.table} WHERE id=?`,[Number(req.params.id)]); res.status(204).end() })

  return router
}
