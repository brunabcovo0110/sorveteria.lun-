import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { IceCream } from '../art/IceCream';
import { CircleBadge } from '../art/CircleBadge';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { ArrowIcon } from '../ui/Icons';
import './About.css';

/* ==========================================================================
   Sobre a LUNÉA.
   Composição em camadas com paralaxe de scroll: o painel grande, o cartão
   flutuante e o selo circular andam em velocidades diferentes conforme a
   página rola. É um efeito discreto — o texto nunca se move.
   ========================================================================== */

const STATS = [
  { value: '2019', label: 'primeira loja' },
  { value: '+40', label: 'receitas criadas' },
  { value: '100%', label: 'feito na casa' },
];

export function About() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* progresso do scroll dentro desta seção: 0 ao entrar, 1 ao sair */
  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ['start end', 'end start'],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['22%', '-18%']);
  const badgeY = useTransform(scrollYProgress, [0, 1], ['40%', '-30%']);

  return (
    <section className="section about" id="sobre">
      <div className="container about__inner">
        <div className="about__visual" ref={wrapper}>
          <motion.div
            className="about__panel"
            style={reduce ? undefined : { y: panelY }}
            aria-hidden="true"
          >
            <span className="about__panel-glow" />
            <IceCream
              scoops={[
                { light: '#fff2f6', base: '#ff9ebb', deep: '#e4628c' },
                { light: '#f3edff', base: '#c4b1ff', deep: '#9a83e8' },
              ]}
              className="about__panel-art"
            />
          </motion.div>

          <motion.div className="about__card" style={reduce ? undefined : { y: cardY }}>
            <ul className="about__stats">
              {STATS.map((stat) => (
                <li key={stat.value} className="about__stat">
                  <span className="about__stat-value">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* dois elementos aninhados de propósito: o de fora recebe o
              paralaxe do scroll, o de dentro a rotação contínua — se os dois
              transforms ficassem no mesmo nó, um anularia o outro */}
          <motion.div className="about__badge" style={reduce ? undefined : { y: badgeY }}>
            <div className="about__badge-spin">
              <CircleBadge text="feito à mão" />
            </div>
          </motion.div>
        </div>

        <div className="about__copy">
          <Reveal y={16}>
            <p className="about__eyebrow">
              <span className="about__eyebrow-dot" aria-hidden="true" />
              Nossa história
            </p>
          </Reveal>

          <Reveal y={24} delay={0.08}>
            <h2 className="about__title">
              Feito para adoçar
              <br />
              <span className="text-grad">seus momentos.</span>
            </h2>
          </Reveal>

          <Reveal y={20} delay={0.16}>
            <p className="about__text">
              Na LUNÉA, acreditamos que um bom sorvete transforma qualquer momento.
            </p>
          </Reveal>

          <Reveal y={20} delay={0.22}>
            <p className="about__text">
              Criamos sabores com ingredientes selecionados e muito cuidado para que cada
              visita seja uma experiência especial.
            </p>
          </Reveal>

          <Reveal y={20} delay={0.3}>
            <div className="about__actions">
              <Button href="#contato" variant="dark" icon={<ArrowIcon />}>
                Venha nos conhecer
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
