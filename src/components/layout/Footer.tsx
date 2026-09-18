import { MoonMark } from '../art/MoonMark';
import { InstagramIcon, WhatsappIcon } from '../ui/Icons';
import { site, whatsappGeneric } from '../../data/site';
import './Footer.css';

/* ==========================================================================
   Footer — fecha o site em tom escuro, o que também ajuda a "assentar" a
   página depois de tanto creme.
   ========================================================================== */

const footerLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sabores', href: '#sabores' },
  { label: 'Pedidos', href: '#monte' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo">
            <MoonMark size={36} onDark />
            <span className="footer__wordmark">LUNÉA</span>
          </div>
          <p className="footer__tagline">{site.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Navegação do rodapé">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="footer__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer__social">
          <a
            className="footer__social-link"
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            Instagram
          </a>
          <a
            className="footer__social-link"
            href={whatsappGeneric}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© 2026 {site.name}. Todos os direitos reservados.</p>
        <p className="footer__note">
          Projeto fictício criado como demonstração de portfólio.
        </p>
      </div>
    </footer>
  );
}
