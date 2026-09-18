import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import './SectionHeading.css';

/* ==========================================================================
   SectionHeading — cabeçalho padrão das seções.
   Mantém a mesma hierarquia (etiqueta → título → apoio) em todo o site.
   ========================================================================== */

type Props = {
  /* etiqueta pequena acima do título */
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: 'left' | 'center';
  /* versão para seções com fundo escuro */
  onDark?: boolean;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  onDark = false,
  id,
}: Props) {
  return (
    <header
      className={[
        'heading',
        `heading--${align}`,
        onDark ? 'heading--dark' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? (
        <Reveal y={14}>
          <p className="heading__eyebrow">
            <span className="heading__dot" aria-hidden="true" />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}

      <Reveal y={22} delay={0.06}>
        <h2 className="heading__title" id={id}>
          {title}
        </h2>
      </Reveal>

      {lead ? (
        <Reveal y={18} delay={0.12}>
          <p className="heading__lead">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
