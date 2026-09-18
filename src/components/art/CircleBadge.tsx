import { useId } from 'react';

/* ==========================================================================
   CircleBadge — selo circular com texto correndo na borda.
   É um detalhe típico de embalagem de gelateria artesanal e dá aquele ar de
   marca com história. Gira bem devagar (animação em CSS).
   ========================================================================== */

type Props = {
  text: string;
  size?: number;
  className?: string;
};

export function CircleBadge({ text, size = 132, className }: Props) {
  const uid = useId().replace(/:/g, '');
  /* repetimos o texto para dar a volta completa no círculo */
  const ring = `${text} • ${text} • `;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <path
          id={`${uid}-circle`}
          d="M60 60 m -44 0 a 44 44 0 1 1 88 0 a 44 44 0 1 1 -88 0"
          fill="none"
        />
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cf5" />
          <stop offset="1" stopColor="#2fc9c2" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="56" fill="#fffcf8" opacity="0.92" />
      <circle cx="60" cy="60" r="55" fill="none" stroke="#d9caff" strokeWidth="1" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="#efe6ff" strokeWidth="1" />

      <text
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="9.2"
        fontWeight="700"
        letterSpacing="2.6"
        fill={`url(#${uid}-fill)`}
      >
        <textPath href={`#${uid}-circle`} startOffset="0">
          {ring}
        </textPath>
      </text>

      {/* lua minúscula no centro: a assinatura da marca */}
      <g transform="translate(60 60)">
        <circle r="13" fill="#f6f1ff" />
        <path
          d="M4 -9 A 9 9 0 1 0 4 9 A 11 11 0 0 1 4 -9 Z"
          fill={`url(#${uid}-fill)`}
          transform="translate(1 0)"
        />
      </g>
    </svg>
  );
}
