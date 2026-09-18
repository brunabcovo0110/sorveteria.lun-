import { motion, useReducedMotion } from 'framer-motion';
import { IceCream } from '../art/IceCream';
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

const LEFT_SCOOPS = [
  { light: '#fff6db', base: '#ffdf8a', deep: '#eebd4e' },
  { light: '#fff2f6', base: '#ff9ebb', deep: '#e4628c' },
];

const RIGHT_SCOOPS = [
  { light: '#e9fbfa', base: '#8ce6e1', deep: '#2fc9c2' },
  { light: '#f3edff', base: '#c4b1ff', deep: '#9a83e8' },
  { light: '#fff2f6', base: '#ff9ebb', deep: '#e4628c' },
];

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
              <IceCream scoops={LEFT_SCOOPS} extras={['#ffffff']} />
            </div>
          </motion.div>

          <motion.div className="contact__art contact__art--right" {...slide(70, 0.18)}>
            <div className="contact__art-float contact__art-float--slow">
              <IceCream scoops={RIGHT_SCOOPS} toppings={['#5b3220']} />
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
