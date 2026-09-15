import { Link } from 'react-router-dom';
import { Send, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context';
import { translations } from '../../i18n/translations';

export function Footer() {
  const { locale } = useApp();
  const t = translations[locale];
  
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <img src="/public-school-logo.png" alt="" />
            <span>
              <b>{t.schoolName}</b>
              <small>{t.schoolCity}</small>
            </span>
          </Link>
          <p>{t.footerText}</p>
        </div>
        <div className="footer-links">
          <Link to="/about">{t.nav[1]}</Link>
          <Link to="/news">{t.nav[2]}</Link>
          <Link to="/events">{t.nav[5]}</Link>
          <Link to="/contacts">{t.nav[7]}</Link>
          <Link to="/feedback">{t.feedbackLabel}</Link>
        </div>
        <div className="socials">
          <a href="https://instagram.com" aria-label="Instagram">
            <Send />
          </a>
          <Link to="/gallery" aria-label={t.nav[6]}>
            <ImageIcon />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t.copyright}</span>
        <span>{t.rights}</span>
      </div>
    </footer>
  );
}
