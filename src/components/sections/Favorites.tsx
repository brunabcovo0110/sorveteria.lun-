import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { treatArt } from '../art/treatArt';
import { favorites } from '../../data/favorites';
import { buildWhatsAppLink, formatPrice, site } from '../../data/site';
import './Favorites.css';

/* ==========================================================================
   Os queridinhos da LUNÉA — três destaques.
   Em vez de três cards iguais, o primeiro ocupa uma coluna inteira e alta
   (composição editorial) e os outros dois ficam ao lado, na horizontal.
   ========================================================================== */

export function Favorites() {
  return (
    <section className="section favorites" id="queridinhos">
      <div className="container">
        <SectionHeading
          eyebrow="Assinaturas da casa"
          title={
            <>
              Os queridinhos da <span className="text-grad">LUNÉA</span>
            </>
          }
          lead="As três criações que as pessoas voltam para comer de novo."
          align="center"
        />

        <div className="favorites__grid">
          {favorites.map((item, index) => {
            const Art = treatArt[item.art];
            const featured = index === 0;

            return (
              <Reveal
                key={item.id}
                className={`favorites__cell ${featured ? 'favorites__cell--featured' : ''}`}
                delay={index * 0.1}
                scale
              >
                <article
                  className={`treat ${featured ? 'treat--featured' : ''}`}
                  style={
                    {
                      '--treat-from': item.from,
                      '--treat-to': item.to,
                      '--treat-glow': item.glow,
                    } as React.CSSProperties
                  }
                >
                  <div className="treat__art-wrap">
                    <span className="treat__halo" aria-hidden="true" />
                    <Art className="treat__art" label={item.name} />
                  </div>

                  <div className="treat__body">
                    <p className="treat__tagline">{item.tagline}</p>
                    <h3 className="treat__name">{item.name}</h3>
                    <p className="treat__desc">{item.description}</p>

                    <div className="treat__foot">
                      <span className="treat__price">{formatPrice(item.price)}</span>
                      <a
                        className="treat__order"
                        href={buildWhatsAppLink(
                          `Olá, ${site.name}! Quero pedir um ${item.name}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Pedir ${item.name} pelo WhatsApp`}
                      >
                        <span>Pedir</span>
                        <svg viewBox="0 0 20 20" width="15" height="15" fill="none">
                          <path
                            d="M4 10h11M11 5.5 15.5 10 11 14.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
