import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { db, one, run } from './db.mjs'

export const secret = process.env.JWT_SECRET || 'local-development-secret-change-before-deploy'

export function auth(req, res, next) { try { const token = (req.headers.cookie || '').split('; ').find(v => v.startsWith('school_token='))?.split('=')[1]; if (!token) throw new Error(); req.user = jwt.verify(token, secret); next() } catch { res.status(401).json({ error: 'AUTH_REQUIRED' }) } }
export function admin(req, res, next) { if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'ADMIN_REQUIRED' }); next() }
export function setSession(res, user) { const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, secret, { expiresIn: '8h' }); const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''; res.setHeader('Set-Cookie', `school_token=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure}`) }

export const accountSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), password: z.string().min(8).max(128) })

export function createAuthRouter() {
  const router = express.Router()

  router.post('/register', async (req, res) => { const parsed = accountSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' }); if (one('SELECT id FROM users WHERE email=?',[parsed.data.email.toLowerCase()])) return res.status(409).json({ error: 'EMAIL_EXISTS' }); const id = run('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)',[parsed.data.name,parsed.data.email.toLowerCase(),await bcrypt.hash(parsed.data.password,12),'USER']); const user = one('SELECT id,name,email,role FROM users WHERE id=?',[id]); setSession(res,user); res.status(201).json({ user }) })
  router.post('/login', async (req, res) => { const input = z.object({ email:z.string().email(), password:z.string().min(1).max(128) }).safeParse(req.body); if (!input.success) return res.status(400).json({ error:'INVALID_INPUT' }); const user = one('SELECT * FROM users WHERE email=?',[input.data.email.toLowerCase()]); if (!user || !(await bcrypt.compare(input.data.password,user.password_hash))) return res.status(401).json({ error:'INVALID_CREDENTIALS' }); const safe = {id:user.id,name:user.name,email:user.email,role:user.role}; setSession(res,safe); res.json({user:safe}) })
  router.post('/logout', (_req,res) => { res.setHeader('Set-Cookie','school_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'); res.status(204).end() })
  router.get('/me', auth, (req,res) => { const user=one('SELECT id,name,email,role FROM users WHERE id=?',[req.user.id]); if (!user) return res.status(401).json({error:'AUTH_REQUIRED'}); res.json({user}) })
  
  router.patch('/profile', auth, async (req,res) => {
    const input = z.object({ name: z.string().trim().min(2).max(100).optional(), email: z.string().trim().email().max(254).optional(), password: z.string().min(8).max(128).optional() }).safeParse(req.body);
    if (!input.success) return res.status(400).json({ error: 'INVALID_INPUT' });
    const user = one('SELECT * FROM users WHERE id=?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
    let name = input.data.name || user.name;
    let email = input.data.email ? input.data.email.toLowerCase() : user.email;
    let passwordHash = user.password_hash;
    if (input.data.password) {
      passwordHash = await bcrypt.hash(input.data.password, 12);
    }
    if (email !== user.email && one('SELECT id FROM users WHERE email=?', [email])) {
      return res.status(409).json({ error: 'EMAIL_EXISTS' });
    }
    run('UPDATE users SET name=?, email=?, password_hash=? WHERE id=?', [name, email, passwordHash, req.user.id]);
    const updatedUser = one('SELECT id,name,email,role FROM users WHERE id=?', [req.user.id]);
    setSession(res, updatedUser);
    res.json({ user: updatedUser });
  })

  return router
}
