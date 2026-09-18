import { IceCream } from '../art/IceCream';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { flavors } from '../../data/flavors';
import { formatPrice } from '../../data/site';
import './Flavors.css';

/* ==========================================================================
   Sabores — a vitrine.
   Cada card recebe as cores do próprio sabor via custom properties, então um
   único bloco de CSS atende todos eles (fundo, brilho e glow no hover).
   ========================================================================== */

export function Flavors() {
  return (
    <section className="section flavors" id="sabores">
      <div className="container">
        <div className="flavors__head">
          <SectionHeading
            eyebrow="Vitrine"
            title="Escolha seu sabor"
            lead="Clássicos, favoritos e combinações para deixar seu momento ainda mais doce."
          />
          <Reveal className="flavors__note" delay={0.15} x={20} y={0}>
            <p>
              Todos os sabores podem ser servidos na casquinha, no copinho ou para viagem
              — e a bola extra sai por {formatPrice(6)}.
            </p>
          </Reveal>
        </div>

        <ul className="flavors__grid">
          {flavors.map((flavor, index) => (
            <li key={flavor.id}>
              <Reveal delay={Math.min(index, 3) * 0.08} scale>
                <article
                  className="flavor"
                  style={
                    {
                      '--flavor-tint': flavor.palette.tint,
                      '--flavor-base': flavor.palette.base,
                      '--flavor-deep': flavor.palette.deep,
                    } as React.CSSProperties
                  }
                >
                  <div className="flavor__stage">
                    <span className="flavor__glow" aria-hidden="true" />
                    <span className="flavor__shine" aria-hidden="true" />
                    <IceCream
                      scoops={[flavor.palette]}
                      className="flavor__art"
                      label={`Sorvete de ${flavor.name}`}
                    />
                    {flavor.badge ? <span className="flavor__badge">{flavor.badge}</span> : null}
                  </div>

                  <div className="flavor__body">
                    <h3 className="flavor__name">{flavor.name}</h3>
                    <p className="flavor__desc">{flavor.description}</p>
                    <p className="flavor__price">
                      <span className="flavor__price-value">{formatPrice(flavor.price)}</span>
                      <span className="flavor__price-unit">/ bola</span>
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
