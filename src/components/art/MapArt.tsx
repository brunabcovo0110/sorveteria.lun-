import { useId } from 'react';
import './MapArt.css';

/* ==========================================================================
   MapArt — mapa ilustrado da região da loja.
   Faz o papel do mapa real: quando o cliente conectar a API do Google Maps,
   este componente é substituído pelo iframe. Enquanto isso, entrega uma peça
   desenhada na paleta da marca em vez do retângulo cinza de sempre.
   ========================================================================== */

type Props = { className?: string };

export function MapArt({ className }: Props) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 400 300"
      className={['map-art', className].filter(Boolean).join(' ')}
      role="img"
      aria-label="Mapa ilustrado do Centro, com a LUNÉA na Rua das Flores, 245"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7f1ff" />
          <stop offset="0.55" stopColor="#eef5ff" />
          <stop offset="1" stopColor="#e6f9f7" />
        </linearGradient>
        <linearGradient id={`${uid}-pin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a88cff" />
          <stop offset="1" stopColor="#5f3fe0" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${uid}-bg)`} />

      {/* quadras */}
      <g fill="#ffffff" opacity="0.72">
        <rect x="24" y="26" width="112" height="76" rx="8" />
        <rect x="152" y="26" width="96" height="76" rx="8" />
        <rect x="264" y="26" width="112" height="52" rx="8" />
        <rect x="24" y="118" width="112" height="64" rx="8" />
        <rect x="152" y="118" width="96" height="64" rx="8" />
        <rect x="264" y="94" width="112" height="88" rx="8" />
        <rect x="24" y="198" width="150" height="78" rx="8" />
        <rect x="190" y="198" width="186" height="78" rx="8" />
      </g>

      {/* praça arborizada */}
      <g>
        <rect x="264" y="94" width="112" height="88" rx="10" fill="#d8f1e4" />
        <g fill="#9fdcc0">
          <circle cx="292" cy="122" r="11" />
          <circle cx="318" cy="140" r="14" />
          <circle cx="348" cy="118" r="10" />
          <circle cx="302" cy="160" r="9" />
          <circle cx="346" cy="156" r="12" />
        </g>
        <text x="320" y="176" textAnchor="middle" className="map-art__label">
          Praça
        </text>
      </g>

      {/* avenida principal (a rua da loja) */}
      <rect x="0" y="182" width="400" height="18" fill="#ffffff" />
      <rect x="0" y="190" width="400" height="2" fill="#e5dcf5" strokeDasharray="10 8" />
      <text x="40" y="195" className="map-art__street">
        RUA DAS FLORES
      </text>

      {/* ruas transversais */}
      <g fill="#ffffff">
        <rect x="136" y="0" width="16" height="300" />
        <rect x="248" y="0" width="16" height="300" />
        <rect x="0" y="102" width="400" height="16" />
      </g>

      {/* faixas de pedestre */}
      <g fill="#e9e2f8">
        {[0, 1, 2, 3].map((i) => (
          <rect key={`c1-${i}`} x={138} y={184 + i * 4} width="12" height="2" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={`c2-${i}`} x={250} y={184 + i * 4} width="12" height="2" />
        ))}
      </g>

      {/* marcador da loja */}
      <g className="map-art__marker">
        <circle cx="200" cy="176" r="26" className="map-art__pulse" fill="#7c5cf5" />
        <path
          d="M200 146c-11.6 0-21 9.2-21 20.6 0 14.6 21 30.4 21 30.4s21-15.8 21-30.4c0-11.4-9.4-20.6-21-20.6Z"
          fill={`url(#${uid}-pin)`}
        />
        <circle cx="200" cy="166" r="7.6" fill="#fffcf8" />
        <circle cx="200" cy="166" r="3.2" fill="#7c5cf5" />
      </g>

      <g className="map-art__tag">
        <rect x="150" y="118" width="100" height="24" rx="12" fill="#1c142e" />
        <text x="200" y="134" textAnchor="middle" className="map-art__tag-text">
          LUNÉA · nº 245
        </text>
      </g>
    </svg>
  );
}
