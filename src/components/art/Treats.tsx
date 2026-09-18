import { useId } from 'react';

/* ==========================================================================
   Treats — ilustrações dos produtos em destaque (queridinhos).
   Cada uma é um SVG desenhado à mão, com vidro translúcido, calda com brilho
   e chantilly em camadas: o objetivo é dar água na boca sem depender de foto.
   ========================================================================== */

type Props = { className?: string; label?: string };

/* Chantilly: círculos sobrepostos que diminuem para cima viram um redemoinho. */
function Whip({
  cx,
  cy,
  scale = 1,
  fill,
}: {
  cx: number;
  cy: number;
  scale?: number;
  fill: string;
}) {
  const blobs: [number, number, number][] = [
    [0, 0, 20],
    [-9, -10, 15],
    [9, -12, 13],
    [-2, -22, 12],
    [5, -31, 9],
    [-3, -39, 6.5],
  ];
  return (
    <g fill={fill}>
      {blobs.map(([dx, dy, r], i) => (
        <circle key={i} cx={cx + dx * scale} cy={cy + dy * scale} r={r * scale} />
      ))}
    </g>
  );
}

/* Cereja com cabinho — o toque final de praticamente toda sobremesa. */
function Cherry({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g>
      <path
        d={`M${cx + 1} ${cy - 4 * scale} C${cx + 4 * scale} ${cy - 18 * scale} ${cx + 14 * scale} ${cy - 22 * scale} ${cx + 18 * scale} ${cy - 26 * scale}`}
        stroke="#7c5a35"
        strokeWidth={2 * scale}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={cx} cy={cy + 3 * scale} r={9 * scale} fill="#e03f63" />
      <circle cx={cx} cy={cy + 3 * scale} r={9 * scale} fill="#ff6b86" fillOpacity="0.45" />
      <circle
        cx={cx - 3 * scale}
        cy={cy - 1 * scale}
        r={2.6 * scale}
        fill="#fff"
        fillOpacity="0.75"
      />
    </g>
  );
}

/* --------------------------------------------------------------------------
   Sundae LUNÉA — taça alta com três camadas, calda quente e castanhas.
   -------------------------------------------------------------------------- */
export function SundaeArt({ className, label }: Props) {
  const uid = useId().replace(/:/g, '');
  const glass = 'M64 128 C64 190 80 232 96 256 L124 256 C140 232 156 190 156 128 Z';

  return (
    <svg
      viewBox="0 0 220 300"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={`${uid}-glass`}>
          <path d={glass} />
        </clipPath>
        <linearGradient id={`${uid}-choc`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5638" />
          <stop offset="1" stopColor="#4a2617" />
        </linearGradient>
        <linearGradient id={`${uid}-van`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6e0" />
          <stop offset="1" stopColor="#f0d6a6" />
        </linearGradient>
        <linearGradient id={`${uid}-straw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb0c8" />
          <stop offset="1" stopColor="#ef6f96" />
        </linearGradient>
        <radialGradient id={`${uid}-scoopA`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fff3f7" />
          <stop offset="0.55" stopColor="#ffa8c4" />
          <stop offset="1" stopColor="#e4628c" />
        </radialGradient>
        <radialGradient id={`${uid}-scoopB`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.55" stopColor="#ffe9bd" />
          <stop offset="1" stopColor="#e0bb7f" />
        </radialGradient>
        <radialGradient id={`${uid}-ground`}>
          <stop offset="0" stopColor="#3a2c5c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3a2c5c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="286" rx="70" ry="11" fill={`url(#${uid}-ground)`} />

      {/* pé da taça */}
      <rect x="104" y="254" width="12" height="20" rx="4" fill="#e9e3f6" fillOpacity="0.85" />
      <ellipse cx="110" cy="276" rx="34" ry="8" fill="#e9e3f6" />
      <ellipse cx="110" cy="274" rx="34" ry="8" fill="#fff" fillOpacity="0.5" />

      {/* camadas dentro do vidro */}
      <g clipPath={`url(#${uid}-glass)`}>
        <path d="M56 200 H164 V262 H56 Z" fill={`url(#${uid}-choc)`} />
        <path
          d="M56 168 Q86 158 110 168 Q138 179 164 166 V204 H56 Z"
          fill={`url(#${uid}-van)`}
        />
        <path
          d="M56 128 Q88 120 112 130 Q140 140 164 128 V170 Q136 181 110 170 Q84 160 56 170 Z"
          fill={`url(#${uid}-straw)`}
        />
      </g>

      {/* vidro: contorno, reflexo e leve véu branco */}
      <path d={glass} fill="#fff" fillOpacity="0.14" />
      <path d={glass} stroke="#fff" strokeOpacity="0.75" strokeWidth="2.5" fill="none" />
      <path
        d="M78 134 C78 186 90 222 100 244"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="110" cy="128" rx="46" ry="9" fill="#fff" fillOpacity="0.5" />

      {/* bolas saindo da taça */}
      <circle cx="86" cy="112" r="30" fill={`url(#${uid}-scoopA)`} />
      <circle cx="132" cy="108" r="27" fill={`url(#${uid}-scoopB)`} />
      <circle cx="108" cy="96" r="24" fill={`url(#${uid}-scoopA)`} />

      {/* calda quente escorrendo por cima */}
      <path
        d="M70 100 Q92 78 118 84 Q142 89 152 104 Q150 118 138 116 Q124 104 106 108 Q86 112 76 118 Q66 114 70 100 Z"
        fill={`url(#${uid}-choc)`}
      />
      <ellipse cx="102" cy="90" rx="20" ry="6" fill="#fff" fillOpacity="0.22" />
      <circle cx="74" cy="124" r="5" fill="#5c3220" />
      <circle cx="140" cy="122" r="4" fill="#5c3220" />

      {/* chantilly + cereja */}
      <Whip cx={110} cy={78} scale={0.95} fill="#fffaf2" />
      <Whip cx={110} cy={74} scale={0.5} fill="#fff" />
      <Cherry cx={112} cy={38} scale={1} />

      {/* castanhas caramelizadas */}
      <g fill="#c99a5b">
        <ellipse cx="72" cy="96" rx="5" ry="3.4" transform="rotate(-24 72 96)" />
        <ellipse cx="148" cy="98" rx="5" ry="3.4" transform="rotate(18 148 98)" />
        <ellipse cx="128" cy="86" rx="4.4" ry="3" transform="rotate(-8 128 86)" />
        <ellipse cx="92" cy="122" rx="4.4" ry="3" transform="rotate(34 92 122)" />
      </g>

      {/* biscoito wafer */}
      <g transform="rotate(16 160 96)">
        <rect x="152" y="58" width="13" height="62" rx="3" fill="#e8c08a" />
        <path
          d="M152 70h13M152 82h13M152 94h13M152 106h13"
          stroke="#c79a5f"
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Milkshake de Morango — copo alto, canudo e chantilly.
   -------------------------------------------------------------------------- */
export function MilkshakeArt({ className, label }: Props) {
  const uid = useId().replace(/:/g, '');
  const cup = 'M72 112 L80 258 Q82 272 96 272 L124 272 Q138 272 140 258 L148 112 Z';

  return (
    <svg
      viewBox="0 0 220 300"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <clipPath id={`${uid}-cup`}>
          <path d={cup} />
        </clipPath>
        <linearGradient id={`${uid}-shake`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffc3d6" />
          <stop offset="0.5" stopColor="#ff9ebb" />
          <stop offset="1" stopColor="#e2648f" />
        </linearGradient>
        <radialGradient id={`${uid}-ground`}>
          <stop offset="0" stopColor="#3a2c5c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3a2c5c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="284" rx="62" ry="10" fill={`url(#${uid}-ground)`} />

      {/* canudo */}
      <g transform="rotate(14 132 120)">
        <rect x="126" y="40" width="14" height="110" rx="7" fill="#2fc9c2" />
        <g fill="#fff" fillOpacity="0.55">
          <rect x="126" y="52" width="14" height="9" />
          <rect x="126" y="76" width="14" height="9" />
          <rect x="126" y="100" width="14" height="9" />
          <rect x="126" y="124" width="14" height="9" />
        </g>
      </g>

      {/* líquido */}
      <g clipPath={`url(#${uid}-cup)`}>
        <path d="M66 118 H154 V276 H66 Z" fill={`url(#${uid}-shake)`} />
        {/* morangos batidos em suspensão */}
        <g fill="#c94a75" fillOpacity="0.5">
          <circle cx="94" cy="160" r="6" />
          <circle cx="126" cy="196" r="5" />
          <circle cx="100" cy="226" r="4.5" />
          <circle cx="130" cy="140" r="4" />
        </g>
        <ellipse cx="110" cy="120" rx="44" ry="10" fill="#fff" fillOpacity="0.3" />
      </g>

      {/* copo: véu, contorno, reflexo e condensação */}
      <path d={cup} fill="#fff" fillOpacity="0.12" />
      <path d={cup} stroke="#fff" strokeOpacity="0.8" strokeWidth="2.5" fill="none" />
      <path
        d="M86 120 L92 250"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <g fill="#fff" fillOpacity="0.4">
        <circle cx="128" cy="186" r="3" />
        <circle cx="134" cy="212" r="2.2" />
        <circle cx="124" cy="234" r="2.6" />
        <circle cx="132" cy="160" r="2" />
      </g>
      <ellipse cx="110" cy="112" rx="38" ry="8" fill="#fff" fillOpacity="0.55" />

      {/* chantilly, calda e cereja */}
      <Whip cx={108} cy={96} scale={1.1} fill="#fffaf2" />
      <Whip cx={110} cy={90} scale={0.55} fill="#fff" />
      <path
        d="M80 92 Q98 74 120 80 Q136 85 140 96 Q130 102 122 96 Q108 88 94 96 Q84 100 80 92 Z"
        fill="#e2648f"
      />
      <Cherry cx={106} cy={50} scale={0.95} />

      {/* morango na borda */}
      <g transform="rotate(-18 150 104)">
        <path
          d="M150 92 C160 92 166 100 164 110 C162 120 154 126 150 126 C146 126 138 120 136 110 C134 100 140 92 150 92 Z"
          fill="#ef5d84"
        />
        <path d="M144 92 L150 84 L157 92 Z" fill="#6cc48f" />
        <g fill="#fff" fillOpacity="0.6">
          <circle cx="146" cy="104" r="1.5" />
          <circle cx="154" cy="110" r="1.5" />
          <circle cx="150" cy="118" r="1.5" />
        </g>
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Banana Split — a travessa clássica com três bolas.
   -------------------------------------------------------------------------- */
export function SplitArt({ className, label }: Props) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 220 300"
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={`${uid}-ground`}>
          <stop offset="0" stopColor="#3a2c5c" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3a2c5c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-dish`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfd6f2" />
        </linearGradient>
        <linearGradient id={`${uid}-banana`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fff2c4" />
          <stop offset="1" stopColor="#f0cd72" />
        </linearGradient>
        <radialGradient id={`${uid}-pink`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fff3f7" />
          <stop offset="0.55" stopColor="#ffa8c4" />
          <stop offset="1" stopColor="#e4628c" />
        </radialGradient>
        <radialGradient id={`${uid}-cream`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="0.55" stopColor="#ffe9bd" />
          <stop offset="1" stopColor="#e0bb7f" />
        </radialGradient>
        <radialGradient id={`${uid}-cocoa`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#b3805f" />
          <stop offset="0.55" stopColor="#7c4c38" />
          <stop offset="1" stopColor="#452115" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="268" rx="82" ry="12" fill={`url(#${uid}-ground)`} />

      {/* travessa */}
      <path
        d="M22 196 Q22 236 110 254 Q198 236 198 196 Q198 174 110 174 Q22 174 22 196 Z"
        fill={`url(#${uid}-dish)`}
      />
      <ellipse cx="110" cy="188" rx="86" ry="24" fill="#f4eeff" />
      <ellipse cx="110" cy="190" rx="78" ry="19" fill="#e8dffa" />

      {/* bananas */}
      <path
        d="M34 186 Q70 166 118 170 Q160 174 186 190 Q160 202 116 198 Q68 194 34 186 Z"
        fill={`url(#${uid}-banana)`}
      />
      <path
        d="M40 190 Q76 176 118 180"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* três bolas */}
      <circle cx="68" cy="150" r="27" fill={`url(#${uid}-pink)`} />
      <circle cx="110" cy="142" r="28" fill={`url(#${uid}-cream)`} />
      <circle cx="152" cy="150" r="27" fill={`url(#${uid}-cocoa)`} />

      {/* caldas */}
      <path
        d="M46 140 Q64 122 88 132 Q94 142 86 146 Q70 136 54 150 Q44 150 46 140 Z"
        fill="#e4628c"
      />
      <path
        d="M132 140 Q152 120 176 134 Q180 146 170 148 Q154 136 140 152 Q130 150 132 140 Z"
        fill="#5c3220"
      />
      <path
        d="M90 126 Q110 108 132 122 Q136 134 126 136 Q112 124 98 138 Q88 136 90 126 Z"
        fill="#d08a34"
      />

      {/* granulado colorido */}
      <g>
        {[
          [58, 128, 20, '#7c5cf5'],
          [80, 118, -30, '#2fc9c2'],
          [104, 112, 12, '#ff92b4'],
          [128, 114, -18, '#ffdf8a'],
          [148, 126, 40, '#7c5cf5'],
          [168, 140, -10, '#2fc9c2'],
          [92, 150, 60, '#ffdf8a'],
          [122, 158, -44, '#ff92b4'],
        ].map(([x, y, rot, color], i) => (
          <rect
            key={i}
            x={x as number}
            y={y as number}
            width="7"
            height="3"
            rx="1.5"
            fill={color as string}
            transform={`rotate(${rot} ${x} ${y})`}
          />
        ))}
      </g>

      {/* chantilly nas pontas + cereja no centro */}
      <Whip cx={44} cy={164} scale={0.5} fill="#fffaf2" />
      <Whip cx={178} cy={164} scale={0.5} fill="#fffaf2" />
      <Cherry cx={110} cy={104} scale={0.9} />
    </svg>
  );
}
