import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonMark } from '../art/MoonMark';
import { Button } from '../ui/Button';
import { useScrolled } from '../../hooks/useScrolled';
import { useActiveSection } from '../../hooks/useActiveSection';
import { navLinks, whatsappGeneric } from '../../data/site';
import './Navbar.css';

/* ==========================================================================
   Navbar — minimalista, fixa, com três comportamentos:
   1. ao rolar, ganha fundo translúcido, sombra e fica mais compacta;
   2. destaca o link da seção em que o visitante está;
   3. no celular, vira um menu em painel com abertura animada.
   ========================================================================== */

const SECTION_IDS = navLinks.map((link) => link.href.replace('#', ''));

export function Navbar() {
  const scrolled = useScrolled(20);
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);

  /* com o menu aberto, a página atrás não deve rolar */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  /* voltar ao desktop com o menu aberto não pode deixar o painel preso */
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 961px)');
    const close = () => setOpen(false);
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#inicio" className="nav__logo" aria-label="LUNÉA — início">
          <MoonMark size={32} />
          <span className="nav__wordmark">LUNÉA</span>
        </a>

        <nav className="nav__links" aria-label="Navegação principal">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = active === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav__link ${isActive ? 'nav__link--active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="nav__actions">
          <Button href={whatsappGeneric} className="nav__cta">
            Fazer pedido
          </Button>

          <button
            type="button"
            className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ---------- painel mobile ---------- */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            className="nav__panel"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="nav__panel-links" aria-label="Navegação principal (celular)">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="nav__panel-link"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + index * 0.05, duration: 0.35 }}
                >
                  <span className="nav__panel-index">0{index + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <Button href={whatsappGeneric} size="lg" full>
              Fazer pedido
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
