import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/* ==========================================================================
   Reveal — o "entra em cena" padrão do site.
   Um só componente cuida de todos os scroll reveals, o que mantém o ritmo das
   animações consistente de seção em seção (e fácil de ajustar em um lugar).
   ========================================================================== */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /* atraso em segundos — use para escalonar itens de uma lista */
  delay?: number;
  /* distância percorrida na entrada */
  y?: number;
  x?: number;
  /* fração do elemento visível necessária para disparar */
  amount?: number;
  /* entrada com leve zoom, para cards e imagens */
  scale?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  x = 0,
  amount = 0.25,
  scale = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  /* com reduced motion o conteúdo aparece direto, sem deslocamento */
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale: scale ? 0.96 : 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
