import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { NewsList } from '../pages/NewsList';
import { NewsDetail } from '../pages/NewsDetail';
import { TeacherList } from '../pages/TeacherList';
import { TeacherDetail } from '../pages/TeacherDetail';
import { Schedule } from '../pages/Schedule';
import { Events } from '../pages/Events';
import { EventDetail } from '../pages/EventDetail';
import { Gallery } from '../pages/Gallery';
import { Contacts } from '../pages/Contacts';
import { Feedback } from '../pages/Feedback';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Profile } from '../pages/Profile';
import { NotFound } from '../pages/NotFound';
import { AdminPanel } from '../admin/AdminPanel';

export function Layout({ theme, setTheme }: { theme: 'light' | 'dark'; setTheme: (x: 'light' | 'dark') => void }) {
  return (
    <div className="site-shell">
      <Header theme={theme} setTheme={setTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/teachers" element={<TeacherList />} />
        <Route path="/teachers/:slug" element={<TeacherDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
