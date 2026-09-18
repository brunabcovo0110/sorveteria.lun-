import { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Photo } from './Photo';
import type { PhotoSource } from './Photo';
import './HeroPhoto.css';

/* ==========================================================================
   HeroPhoto — a composição fotográfica da Hero.

   Três planos em profundidades diferentes (foto principal em arco, foto
   circular de apoio e uma etiqueta de vidro) que acompanham o mouse em
   velocidades distintas. É o paralaxe que mantém a primeira tela "viva"
   sem precisar de WebGL: o movimento é lento e amortecido por mola.

   Com prefers-reduced-motion, os valores simplesmente nunca mudam — os
   hooks continuam sendo chamados na mesma ordem, e nada se move.
   ========================================================================== */

const PRINCIPAL: PhotoSource = {
  src: '/fotos/hero-principal.webp',
  alt: 'Casquinha com duas bolas de sorvete cremoso sobre fundo rosa',
  width: 900,
  height: 1000,
};

const APOIO: PhotoSource = {
  src: '/fotos/contato-b.webp',
  alt: 'Mão segurando uma casquinha coberta de granulado colorido',
  width: 480,
  height: 600,
};

export function HeroPhoto() {
  const reduce = useReducedMotion();

  /* posição do ponteiro normalizada: -0.5 a 0.5 em cada eixo */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  /* a mola dá o atraso elegante: o conjunto persegue o mouse, não o copia */
  const spring = { stiffness: 55, damping: 18, mass: 0.7 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);

  /* amplitudes diferentes por plano = sensação de profundidade */
  const mainX = useTransform(smoothX, (v) => v * -20);
  const mainY = useTransform(smoothY, (v) => v * -14);
  const accentX = useTransform(smoothX, (v) => v * 34);
  const accentY = useTransform(smoothY, (v) => v * 24);
  const chipX = useTransform(smoothX, (v) => v * 46);
  const chipY = useTransform(smoothY, (v) => v * 30);

  useEffect(() => {
    if (reduce) return;

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointerX, pointerY, reduce]);

  return (
    <div className="hero-photo">
      <span className="hero-photo__halo hero-photo__halo--violet" aria-hidden="true" />
      <span className="hero-photo__halo hero-photo__halo--turquoise" aria-hidden="true" />
      <span className="hero-photo__ring" aria-hidden="true" />

      {/* a inclinação também vai pelo framer-motion: se ficasse no CSS, o
          transform do paralaxe a sobrescreveria */}
      <motion.div className="hero-photo__main" style={{ x: mainX, y: mainY, rotate: -1.5 }}>
        <Photo photo={PRINCIPAL} priority placeholder="#f4d3e0" />
      </motion.div>

      <motion.div className="hero-photo__accent" style={{ x: accentX, y: accentY }}>
        <Photo photo={APOIO} placeholder="#ffdf8a" />
      </motion.div>

      <motion.div className="hero-photo__chip" style={{ x: chipX, y: chipY }}>
        <span className="hero-photo__chip-dot" aria-hidden="true" />
        Gelato do dia · Pistache
      </motion.div>
    </div>
  );
}
