import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowIcon } from '../ui/Icons';
import { HeroPhoto } from '../media/HeroPhoto';
import { ParticleField } from '../canvas/ParticleField';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import { site } from '../../data/site';
import './Hero.css';

/* ==========================================================================
   Hero — a primeira tela.
   Composição em duas colunas: tipografia grande à esquerda, sorvete 3D à
   direita. No celular vira uma coluna só, e o 3D entra logo abaixo do texto.
   ========================================================================== */

const WORDMARK = ['L', 'U', 'N', 'É', 'A'];

const FACTS = [
  'Gelato feito todos os dias',
  '12 sabores na vitrine',
  'Rua das Flores, 245 · Centro',
];

type Props = { tier: DeviceTier };

export function Hero({ tier }: Props) {
  const reduce = useReducedMotion();

  /* entrada escalonada; com reduced motion tudo já começa no lugar */
  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="hero" id="inicio">
      {/* fundo: manchas de cor em CSS + poeira de luz no canvas */}
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__blob hero__blob--violet" />
        <span className="hero__blob hero__blob--turquoise" />
        <span className="hero__blob hero__blob--rose" />
      </div>
      <ParticleField tier={tier} density={1} />

      <div className="hero__inner container">
        <div className="hero__copy">
          <motion.p className="hero__eyebrow" {...appear(0.05)}>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            Gelateria artesanal · Verão 2026
          </motion.p>

          <h1 className="hero__title">
            <span className="hero__wordmark" aria-hidden="true">
              {WORDMARK.map((letter, index) => (
                <motion.span
                  key={index}
                  className="hero__letter"
                  {...(reduce
                    ? {}
                    : {
                        initial: { opacity: 0, y: 54, rotate: -4 },
                        animate: { opacity: 1, y: 0, rotate: 0 },
                        transition: {
                          duration: 0.9,
                          delay: 0.12 + index * 0.075,
                          ease: [0.22, 1, 0.36, 1] as const,
                        },
                      })}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            <span className="sr-only">LUNÉA — sorveteria artesanal</span>
          </h1>

          <motion.p className="hero__tagline" {...appear(0.5)}>
            {site.tagline}
          </motion.p>

          <motion.p className="hero__text" {...appear(0.58)}>
            Sorvetes artesanais, sabores irresistíveis e momentos feitos para você.
          </motion.p>

          <motion.div className="hero__actions" {...appear(0.66)}>
            <Button href="#sabores" size="lg" icon={<ArrowIcon />}>
              Ver sabores
            </Button>
            <Button href="#monte" variant="outline" size="lg">
              Fazer pedido
            </Button>
          </motion.div>

          <motion.ul className="hero__facts" {...appear(0.76)}>
            {FACTS.map((fact) => (
              <li key={fact} className="hero__fact">
                {fact}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className="hero__visual"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.92 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const },
              })}
        >
          <HeroPhoto />
        </motion.div>
      </div>

      {/* indicador de scroll */}
      <motion.a
        className="hero__scroll"
        href="#sabores"
        aria-label="Ir para os sabores"
        {...appear(1)}
      >
        <span className="hero__scroll-label">role para descobrir</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
