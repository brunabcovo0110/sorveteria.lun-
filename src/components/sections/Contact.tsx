import { motion, useReducedMotion } from 'framer-motion';
import { Photo } from '../media/Photo';
import { Button } from '../ui/Button';
import { ArrowIcon, WhatsappIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';
import { site, whatsappGeneric } from '../../data/site';
import './Contact.css';

/* ==========================================================================
   Ficou com vontade? — o fechamento.
   Um painel com o gradiente da marca em movimento lento, dois sorvetes
   entrando pelas laterais e o par de CTAs. É a última impressão do site, por
   isso ganha o tratamento visual mais forte da página.
   ========================================================================== */

const FOTO_ESQUERDA = {
  src: '/fotos/contato-b.webp',
  alt: 'Casquinha com granulado colorido sobre fundo amarelo',
  width: 480,
  height: 600,
};

const FOTO_DIREITA = {
  src: '/fotos/contato-a.webp',
  alt: 'Três casquinhas de sorvete de morango com frutas frescas em uma travessa',
  width: 480,
  height: 600,
};

export function Contact() {
  const reduce = useReducedMotion();

  const slide = (from: number, delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: from, y: 30, rotate: from > 0 ? 8 : -8 },
          whileInView: { opacity: 1, x: 0, y: 0, rotate: from > 0 ? 4 : -4 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="section contact" id="contato">
      <div className="container">
        <div className="contact__panel">
          {/* brilhos e granulado do fundo */}
          <span className="contact__sheen" aria-hidden="true" />
          <span className="contact__sparkles" aria-hidden="true" />

          {/* o nó de fora faz a entrada (framer-motion) e o de dentro a
              flutuação contínua (CSS) — transforms separados não se anulam */}
          <motion.div className="contact__art contact__art--left" {...slide(-70, 0.1)}>
            <div className="contact__art-float">
              <Photo photo={FOTO_ESQUERDA} className="contact__photo" placeholder="#ffdf8a" />
            </div>
          </motion.div>

          <motion.div className="contact__art contact__art--right" {...slide(70, 0.18)}>
            <div className="contact__art-float contact__art-float--slow">
              <Photo photo={FOTO_DIREITA} className="contact__photo" placeholder="#e8e2ee" />
            </div>
          </motion.div>

          <div className="contact__content">
            <Reveal y={18}>
              <p className="contact__eyebrow">Estamos esperando você</p>
            </Reveal>

            <Reveal y={26} delay={0.08}>
              <h2 className="contact__title">Ficou com vontade?</h2>
            </Reveal>

            <Reveal y={22} delay={0.16}>
              <p className="contact__text">
                Faça seu pedido ou venha viver essa experiência com a gente.
              </p>
            </Reveal>

            <Reveal y={20} delay={0.24}>
              <div className="contact__actions">
                <Button href="#monte" variant="light" size="lg" icon={<ArrowIcon />}>
                  Fazer pedido
                </Button>
                <Button
                  href={whatsappGeneric}
                  variant="dark"
                  size="lg"
                  icon={<WhatsappIcon size={18} />}
                >
                  WhatsApp
                </Button>
              </div>
            </Reveal>

            <Reveal y={16} delay={0.32}>
              <p className="contact__note">
                {site.address.street} · {site.address.district} — {site.phoneLabel}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
