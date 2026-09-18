import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { features } from '../../data/features';
import './Features.css';

/* ==========================================================================
   Mais que sorvete — os diferenciais.
   Em vez de quatro quadrados idênticos, as colunas ficam desalinhadas em
   altura (composição escalonada), cada uma com um número enorme ao fundo e
   um traço colorido que cresce no hover.
   ========================================================================== */

export function Features() {
  return (
    <section className="section features" id="diferenciais">
      <div className="container">
        <div className="features__head">
          <SectionHeading eyebrow="Por que a LUNÉA" title="Mais que sorvete." />
          <Reveal className="features__aside" delay={0.12} y={18}>
            <p>
              Gelato é simples: leite bom, fruta boa e paciência. O resto é o cuidado que
              a gente coloca em cada etapa — e é isso que dá para sentir na primeira
              colherada.
            </p>
          </Reveal>
        </div>

        <ul className="features__grid">
          {features.map((feature, index) => (
            <li key={feature.id} className="features__cell">
              <Reveal delay={index * 0.09} y={30}>
                <article
                  className="feature"
                  style={{ '--accent': feature.accent } as React.CSSProperties}
                >
                  <span className="feature__ghost" aria-hidden="true">
                    {feature.index}
                  </span>
                  <span className="feature__index">{feature.index}</span>
                  <span className="feature__rule" aria-hidden="true" />
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__desc">{feature.description}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
