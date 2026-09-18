import { GlowField } from '../canvas/GlowField';
import { Reveal } from '../ui/Reveal';
import { PointerIcon } from '../ui/Icons';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import './Experience.css';

/* ==========================================================================
   Experiência — a pausa visual do site.
   Uma faixa escura onde o canvas interativo é o protagonista: as auroras
   respondem ao movimento do ponteiro e mudam de profundidade no scroll.
   O texto fica curto e centralizado justamente para não competir com a luz.
   ========================================================================== */

const WORDS = ['Frescor', 'Criatividade', 'Cuidado'];

type Props = { tier: DeviceTier };

export function Experience({ tier }: Props) {
  return (
    <section className="experience" id="experiencia">
      <GlowField tier={tier} />

      <div className="experience__ring" aria-hidden="true" />
      <div className="experience__ring experience__ring--small" aria-hidden="true" />

      <div className="container experience__inner">
        <Reveal y={20}>
          <p className="experience__eyebrow">
            <span className="experience__dot" aria-hidden="true" />
            Experiência LUNÉA
          </p>
        </Reveal>

        <Reveal y={28} delay={0.08}>
          <h2 className="experience__title">
            O verão em <span className="experience__accent">movimento</span>.
          </h2>
        </Reveal>

        <Reveal y={22} delay={0.16}>
          <p className="experience__lead">
            Luz, cor e um pouco de brilho — a mesma sensação de entrar na loja num fim de
            tarde de janeiro.
          </p>
        </Reveal>

        <Reveal y={18} delay={0.24}>
          <ul className="experience__words">
            {WORDS.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </Reveal>

        {tier.particleScale > 0 ? (
          <Reveal y={14} delay={0.34}>
            <p className="experience__hint">
              <PointerIcon />
              {tier.isMobile ? 'arraste para mover a luz' : 'a luz acompanha o seu movimento'}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
