import { useId } from 'react';

/* ==========================================================================
   MoonMark — o símbolo da LUNÉA.
   Uma lua crescente que também lê como uma bola de sorvete vista de lado:
   é a referência ao nome, discreta o suficiente para não virar "tema
   espacial". Aparece na navbar, no footer e no favicon.
   ========================================================================== */

type Props = {
  size?: number;
  className?: string;
  /* versão clara, para fundos escuros */
  onDark?: boolean;
};

export function MoonMark({ size = 34, className, onDark = false }: Props) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={onDark ? '#d9caff' : '#a88cff'} />
          <stop offset="0.55" stopColor="#7c5cf5" />
          <stop offset="1" stopColor="#2fc9c2" />
        </linearGradient>
        <mask id={`${uid}-m`}>
          <circle cx="17" cy="21" r="13" fill="#fff" />
          <circle cx="27" cy="15" r="11.5" fill="#000" />
        </mask>
      </defs>

      <circle cx="17" cy="21" r="13" fill={`url(#${uid}-g)`} mask={`url(#${uid}-m)`} />
      <circle cx="29" cy="9" r="2.1" fill={onDark ? '#ffe7a8' : '#ffdf8a'} />
      <circle cx="34.5" cy="15" r="1.1" fill={onDark ? '#ffe7a8' : '#ffc29b'} />
    </svg>
  );
}
