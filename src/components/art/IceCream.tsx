import { Fragment, useId } from 'react';
import type { ScoopPattern } from '../../data/flavors';

/* ==========================================================================
   IceCream — ilustração SVG paramétrica.
   Recebe de 1 a 3 bolas (com as cores de cada sabor), coberturas e
   complementos, e desenha a composição inteira. É a MESMA peça usada nos
   cards de sabores e no preview ao vivo do "Monte seu sorvete" — por isso
   o site tem uma linguagem visual única em vez de imagens avulsas.

   Nada de fotos de banco de imagens: gradientes vetoriais pesam poucos KB,
   escalam sem perder nitidez e usam exatamente a paleta da marca.
   ========================================================================== */

export type ScoopSpec = {
  light: string;
  base: string;
  deep: string;
  accent?: string;
  pattern?: ScoopPattern;
};

type Props = {
  /* índice 0 é a bola de baixo */
  scoops: ScoopSpec[];
  /* cores das coberturas escorrendo por cima */
  toppings?: string[];
  /* cores dos complementos (granulado, oreo...) */
  extras?: string[];
  className?: string;
  /* descrição para leitores de tela; sem ela o SVG é decorativo */
  label?: string;
};

type Geo = { cx: number; cy: number; r: number };

/* Posições pensadas para a torre ficar equilibrada em qualquer quantidade. */
const LAYOUTS: Record<number, Geo[]> = {
  1: [{ cx: 100, cy: 132, r: 58 }],
  2: [
    { cx: 100, cy: 146, r: 48 },
    { cx: 100, cy: 92, r: 44 },
  ],
  3: [
    { cx: 100, cy: 152, r: 44 },
    { cx: 100, cy: 108, r: 40 },
    { cx: 100, cy: 68, r: 36 },
  ],
};

/* Lombadas que quebram o círculo perfeito e dão o aspecto de bola raspada.
   Valores relativos ao raio: [deslocamento x, deslocamento y, raio]. */
const BUMPS: [number, number, number][] = [
  [-0.66, -0.34, 0.46],
  [0.64, -0.36, 0.44],
  [-0.12, -0.74, 0.42],
  [0.5, 0.42, 0.4],
  [-0.56, 0.4, 0.38],
];

const SPECKLES: [number, number][] = [
  [-0.38, -0.08],
  [0.18, -0.34],
  [0.46, 0.12],
  [-0.16, 0.36],
  [0.04, 0.02],
  [-0.52, 0.22],
  [0.32, 0.46],
  [-0.24, -0.44],
];

const CHIPS: [number, number, number][] = [
  [-0.34, -0.2, -18],
  [0.22, -0.36, 24],
  [0.4, 0.18, -8],
  [-0.1, 0.32, 36],
  [-0.5, 0.14, 12],
  [0.06, -0.04, -30],
];

export function IceCream({ scoops, toppings = [], extras = [], className, label }: Props) {
  /* useId garante ids únicos: várias ilustrações na mesma página nunca
     "roubam" o gradiente uma da outra. */
  const uid = useId().replace(/:/g, '');
  const count = Math.min(Math.max(scoops.length, 1), 3) as 1 | 2 | 3;
  const layout = LAYOUTS[count];
  const visible = scoops.slice(0, count);
  const top = layout[layout.length - 1];

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        {/* casquinha */}
        <linearGradient id={`${uid}-cone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c893" />
          <stop offset="0.45" stopColor="#dfa869" />
          <stop offset="1" stopColor="#b97c45" />
        </linearGradient>

        <pattern
          id={`${uid}-waffle`}
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 0h13M0 6.5h13" stroke="#8f5c2e" strokeOpacity="0.28" strokeWidth="1.1" />
          <path d="M0 0v13M6.5 0v13" stroke="#8f5c2e" strokeOpacity="0.18" strokeWidth="1.1" />
        </pattern>

        <clipPath id={`${uid}-cone-clip`}>
          <path d="M44 184 Q100 203 156 184 L108 288 Q100 297 92 288 Z" />
        </clipPath>

        {/* sombra de contato no chão */}
        <radialGradient id={`${uid}-ground`}>
          <stop offset="0" stopColor="#3a2c5c" stopOpacity="0.2" />
          <stop offset="1" stopColor="#3a2c5c" stopOpacity="0" />
        </radialGradient>

        {/* brilho especular reaproveitado por todas as bolas */}
        <radialGradient id={`${uid}-shine`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {visible.map((scoop, i) => {
          const g = layout[i];
          return (
            <Fragment key={`defs-${i}`}>
              <radialGradient
                id={`${uid}-body-${i}`}
                gradientUnits="userSpaceOnUse"
                cx={g.cx - g.r * 0.32}
                cy={g.cy - g.r * 0.4}
                r={g.r * 1.7}
              >
                <stop offset="0" stopColor={scoop.light} />
                <stop offset="0.52" stopColor={scoop.base} />
                <stop offset="1" stopColor={scoop.deep} />
              </radialGradient>

              <radialGradient
                id={`${uid}-shade-${i}`}
                gradientUnits="userSpaceOnUse"
                cx={g.cx + g.r * 0.55}
                cy={g.cy + g.r * 0.68}
                r={g.r * 1.25}
              >
                <stop offset="0" stopColor={scoop.deep} stopOpacity="0.5" />
                <stop offset="1" stopColor={scoop.deep} stopOpacity="0" />
              </radialGradient>

              <clipPath id={`${uid}-clip-${i}`}>
                <circle cx={g.cx} cy={g.cy} r={g.r} />
                {BUMPS.map(([bx, by, br], b) => (
                  <circle
                    key={b}
                    cx={g.cx + g.r * bx}
                    cy={g.cy + g.r * by}
                    r={g.r * br}
                  />
                ))}
              </clipPath>
            </Fragment>
          );
        })}
      </defs>

      {/* ---------- sombra no chão ---------- */}
      <ellipse cx="100" cy="291" rx="62" ry="10" fill={`url(#${uid}-ground)`} />

      {/* ---------- casquinha ---------- */}
      <g>
        <path
          d="M44 184 Q100 203 156 184 L108 288 Q100 297 92 288 Z"
          fill={`url(#${uid}-cone)`}
        />
        <g clipPath={`url(#${uid}-cone-clip)`}>
          <rect x="30" y="170" width="140" height="130" fill={`url(#${uid}-waffle)`} />
          {/* sombra interna do lado direito, para dar volume */}
          <path d="M118 184 L156 184 L112 292 Z" fill="#8f5c2e" fillOpacity="0.16" />
          {/* reflexo suave do lado esquerdo */}
          <path d="M56 186 L74 186 L92 284 L80 284 Z" fill="#fff" fillOpacity="0.16" />
        </g>
      </g>

      {/* ---------- bolas (de baixo para cima) ---------- */}
      {visible.map((scoop, i) => {
        const g = layout[i];
        return (
          <g key={`scoop-${i}`}>
            {/* silhueta: círculo principal + lombadas, todos com o MESMO
                gradiente em coordenadas absolutas, o que faz o conjunto
                parecer um único corpo sólido */}
            <circle cx={g.cx} cy={g.cy} r={g.r} fill={`url(#${uid}-body-${i})`} />
            {BUMPS.map(([bx, by, br], b) => (
              <circle
                key={b}
                cx={g.cx + g.r * bx}
                cy={g.cy + g.r * by}
                r={g.r * br}
                fill={`url(#${uid}-body-${i})`}
              />
            ))}

            <g clipPath={`url(#${uid}-clip-${i})`}>
              {/* volume */}
              <circle cx={g.cx} cy={g.cy} r={g.r * 1.6} fill={`url(#${uid}-shade-${i})`} />

              {/* textura do sabor */}
              <ScoopTexture scoop={scoop} geo={g} />

              {/* brilho */}
              <ellipse
                cx={g.cx - g.r * 0.36}
                cy={g.cy - g.r * 0.46}
                rx={g.r * 0.42}
                ry={g.r * 0.3}
                fill={`url(#${uid}-shine)`}
                transform={`rotate(-26 ${g.cx - g.r * 0.36} ${g.cy - g.r * 0.46})`}
              />
              <circle
                cx={g.cx - g.r * 0.5}
                cy={g.cy - g.r * 0.54}
                r={g.r * 0.07}
                fill="#fff"
                fillOpacity="0.75"
              />
            </g>
          </g>
        );
      })}

      {/* ---------- saia derretida sobre a casquinha ---------- */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={62 + i * 19}
            cy={186 + (i % 2 === 0 ? 0 : 4)}
            r={11}
            fill={`url(#${uid}-body-0)`}
          />
        ))}
        <circle cx="72" cy="196" r="5" fill={`url(#${uid}-body-0)`} />
        <circle cx="128" cy="198" r="4" fill={`url(#${uid}-body-0)`} />
      </g>

      {/* ---------- coberturas escorrendo ---------- */}
      {toppings.slice(0, 4).map((color, i) => (
        <Drizzle key={color + i} color={color} geo={top} index={i} />
      ))}

      {/* ---------- complementos ---------- */}
      {extras.slice(0, 4).map((color, i) => (
        <Extras key={color + i} color={color} geo={top} index={i} />
      ))}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Texturas por sabor: raias, lascas e pontinhos.
   -------------------------------------------------------------------------- */
function ScoopTexture({ scoop, geo }: { scoop: ScoopSpec; geo: Geo }) {
  const { pattern = 'plain', accent } = scoop;
  if (pattern === 'plain' || !accent) return null;
  const { cx, cy, r } = geo;

  if (pattern === 'speckle') {
    return (
      <g fill={accent} fillOpacity="0.7">
        {SPECKLES.map(([sx, sy], i) => (
          <circle
            key={i}
            cx={cx + r * sx}
            cy={cy + r * sy}
            r={r * (i % 3 === 0 ? 0.052 : 0.036)}
          />
        ))}
      </g>
    );
  }

  if (pattern === 'chips') {
    return (
      <g fill={accent} fillOpacity="0.88">
        {CHIPS.map(([px, py, rot], i) => (
          <rect
            key={i}
            x={cx + r * px}
            y={cy + r * py}
            width={r * 0.26}
            height={r * 0.17}
            rx={r * 0.05}
            transform={`rotate(${rot} ${cx + r * px} ${cy + r * py})`}
          />
        ))}
      </g>
    );
  }

  if (pattern === 'swirl') {
    return (
      <g
        stroke={accent}
        strokeOpacity="0.5"
        strokeLinecap="round"
        fill="none"
        strokeWidth={r * 0.15}
      >
        <path
          d={`M${cx - r * 0.85} ${cy + r * 0.08} Q${cx} ${cy - r * 0.6} ${cx + r * 0.8} ${cy - r * 0.02}`}
        />
        <path
          d={`M${cx - r * 0.72} ${cy + r * 0.56} Q${cx + r * 0.1} ${cy + r * 0.04} ${cx + r * 0.86} ${cy + r * 0.46}`}
        />
      </g>
    );
  }

  /* ribbon: uma faixa larga em S, boa para chocolate e doce de leite */
  return (
    <path
      d={`M${cx - r} ${cy + r * 0.3} C${cx - r * 0.3} ${cy - r * 0.1} ${cx - r * 0.1} ${cy + r * 0.5} ${cx + r * 0.95} ${cy - r * 0.1}`}
      stroke={accent}
      strokeOpacity="0.62"
      strokeWidth={r * 0.2}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/* --------------------------------------------------------------------------
   Cobertura: uma poça no topo da bola com pingos escorrendo.
   -------------------------------------------------------------------------- */
function Drizzle({ color, geo, index }: { color: string; geo: Geo; index: number }) {
  const { cx, cy, r } = geo;
  /* cada cobertura extra gira um pouco para não empilhar no mesmo lugar */
  const rot = -14 + index * 13;

  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`} fill={color} opacity={0.94}>
      <path
        d={`M${cx - r * 0.82} ${cy - r * 0.42}
            Q${cx - r * 0.2} ${cy - r * 1.02} ${cx + r * 0.74} ${cy - r * 0.5}
            Q${cx + r * 0.9} ${cy - r * 0.1} ${cx + r * 0.6} ${cy + r * 0.04}
            Q${cx + r * 0.2} ${cy - r * 0.3} ${cx - r * 0.3} ${cy + r * 0.06}
            Q${cx - r * 0.86} ${cy - r * 0.02} ${cx - r * 0.82} ${cy - r * 0.42} Z`}
      />
      {/* pingos */}
      <circle cx={cx - r * 0.64} cy={cy + r * 0.12} r={r * 0.11} />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.2} r={r * 0.09} />
      <circle cx={cx - r * 0.08} cy={cy + r * 0.22} r={r * 0.08} />
      {/* brilho da calda */}
      <ellipse
        cx={cx - r * 0.24}
        cy={cy - r * 0.62}
        rx={r * 0.26}
        ry={r * 0.09}
        fill="#fff"
        fillOpacity="0.3"
      />
    </g>
  );
}

/* --------------------------------------------------------------------------
   Complementos: granulado, farelos e castanhas polvilhados sobre a bola.
   -------------------------------------------------------------------------- */
const SPRINKLES: [number, number, number][] = [
  [-0.72, -0.5, 24],
  [-0.3, -0.9, -36],
  [0.26, -0.86, 14],
  [0.7, -0.44, -22],
  [0.86, -0.02, 44],
  [-0.88, -0.06, -12],
  [0.02, -1.02, 8],
  [-0.54, -0.74, 60],
  [0.52, -0.72, -50],
];

function Extras({ color, geo, index }: { color: string; geo: Geo; index: number }) {
  const { cx, cy, r } = geo;
  /* cada complemento ocupa um subconjunto diferente dos pontos */
  const picks = SPRINKLES.filter((_, i) => i % 4 === index % 4);

  return (
    <g fill={color}>
      {picks.map(([px, py, rot], i) => (
        <rect
          key={i}
          x={cx + r * px}
          y={cy + r * py}
          width={r * 0.2}
          height={r * 0.09}
          rx={r * 0.045}
          transform={`rotate(${rot} ${cx + r * px} ${cy + r * py})`}
        />
      ))}
    </g>
  );
}
