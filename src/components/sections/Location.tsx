import { useMemo } from 'react';
import { MapArt } from '../art/MapArt';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { ArrowIcon, InstagramIcon, PhoneIcon } from '../ui/Icons';
import { isOpenNow, site, todayScheduleIndex } from '../../data/site';
import './Location.css';

/* ==========================================================================
   Venha nos visitar.
   A seção deixa claro que existe uma loja de verdade: endereço, horário com o
   dia de hoje destacado, selo de "aberto agora" calculado na hora, telefone,
   Instagram e um mapa ilustrado com o ponto marcado.
   ========================================================================== */

export function Location() {
  /* calculado uma vez por renderização — basta para um selo informativo */
  const open = useMemo(() => isOpenNow(), []);
  const today = useMemo(() => todayScheduleIndex(), []);

  return (
    <section className="section location" id="visitar">
      <div className="container">
        <SectionHeading
          eyebrow="Onde nos encontrar"
          title="Venha nos visitar"
          lead="Uma loja pequena no Centro, com mesinhas na calçada e vitrine cheia todos os dias."
        />

        <div className="location__grid">
          {/* ---------------- informações ---------------- */}
          <Reveal className="location__info" y={28}>
            <div className="location__card">
              <div className="location__status-row">
                <span className={`location__status ${open ? 'location__status--open' : ''}`}>
                  <span className="location__status-dot" aria-hidden="true" />
                  {open ? 'Aberto agora' : 'Fechado agora'}
                </span>
                <span className="location__store-type">Loja física</span>
              </div>

              <address className="location__address">
                <strong>{site.address.street}</strong>
                <span>
                  {site.address.district} · {site.address.city}
                </span>
              </address>

              <ul className="location__hours">
                {site.hours.map((entry, index) => (
                  <li
                    key={entry.days}
                    className={`location__hour ${index === today ? 'location__hour--today' : ''}`}
                  >
                    <span className="location__hour-days">{entry.days}</span>
                    <span className="location__hour-dots" aria-hidden="true" />
                    <span className="location__hour-time">{entry.time}</span>
                  </li>
                ))}
              </ul>

              <div className="location__contact">
                <a className="location__contact-link" href={site.phoneHref}>
                  <PhoneIcon />
                  {site.phoneLabel}
                </a>
                <a
                  className="location__contact-link"
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                  {site.instagramHandle}
                </a>
              </div>

              <div className="location__actions">
                <Button href={site.mapsUrl} icon={<ArrowIcon />}>
                  Como chegar
                </Button>
                <Button href="#monte" variant="outline">
                  Fazer pedido
                </Button>
              </div>
            </div>
          </Reveal>

          {/* ---------------- mapa ---------------- */}
          <Reveal className="location__map-wrap" y={28} delay={0.1}>
            <div className="location__map">
              <MapArt />
              <div className="location__map-chip">
                <span className="location__map-chip-dot" aria-hidden="true" />
                Rua das Flores, 245
              </div>
              <a
                className="location__map-link"
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no mapa
                <ArrowIcon />
              </a>
            </div>
            <p className="location__map-note">
              Estacionamento conveniado a 50 m · acesso acessível por rampa
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
