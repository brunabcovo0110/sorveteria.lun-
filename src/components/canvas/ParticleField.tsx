import { useEffect, useMemo, useRef } from 'react';
import { useCanvasLoop } from '../../hooks/useCanvasLoop';
import { usePointer } from '../../hooks/usePointer';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import './canvas.css';

/* ==========================================================================
   ParticleField — a poeira de luz que flutua atrás do conteúdo.

   Duas decisões que fazem esse canvas caber no orçamento de performance:
   1. cada partícula é um sprite desenhado UMA vez num canvas de 64px e depois
      só copiado com drawImage. Sem isso, seriam dezenas de gradientes
      radiais recalculados a cada quadro — o jeito mais fácil de derrubar
      o frame rate;
   2. a quantidade sai do useDeviceTier: no celular cai para ~40%, e com
      prefers-reduced-motion o componente nem é renderizado.
   ========================================================================== */

type Tone = 'light' | 'dark';

type Props = {
  tier: DeviceTier;
  tone?: Tone;
  /* multiplicador extra de densidade para calibrar seção por seção */
  density?: number;
  className?: string;
};

const PALETTES: Record<Tone, [number, number, number][]> = {
  light: [
    [124, 92, 245],
    [255, 146, 180],
    [47, 201, 194],
    [169, 217, 255],
    [255, 223, 138],
  ],
  dark: [
    [168, 140, 255],
    [255, 170, 198],
    [124, 234, 228],
    [190, 226, 255],
    [255, 231, 168],
  ],
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: number;
  alpha: number;
  phase: number;
  sway: number;
  /* fator de profundidade: partículas "próximas" reagem mais */
  depth: number;
};

export function ParticleField({ tier, tone = 'light', density = 1, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = usePointer(!tier.reduceMotion);
  const particles = useRef<Particle[]>([]);
  const sprites = useRef<HTMLCanvasElement[]>([]);
  const scroll = useRef({ y: 0, delta: 0 });
  /* posição do canvas na janela, guardada em cache.
     Ler getBoundingClientRect dentro do laço de partículas causaria reflow a
     cada quadro; então só medimos quando algo realmente muda. */
  const offset = useRef({ left: 0, top: 0 });

  const palette = useMemo(() => PALETTES[tone], [tone]);

  /* deslocamento do scroll: usado para dar profundidade durante a rolagem */
  useEffect(() => {
    if (tier.particleScale === 0) return;
    scroll.current.y = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      scroll.current.delta += y - scroll.current.y;
      scroll.current.y = y;
      /* o canvas andou junto com a página: a medida precisa ser refeita */
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) offset.current = { left: rect.left, top: rect.top };
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tier.particleScale]);

  /* sprites: um por cor, criados uma única vez */
  useEffect(() => {
    sprites.current = palette.map(([r, g, b]) => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
      gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.45)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      return canvas;
    });
  }, [palette]);

  useCanvasLoop(
    canvasRef,
    ({ ctx, width, height, dt, resized }) => {
      /* (re)popula ao montar e a cada mudança de tamanho */
      if (resized || particles.current.length === 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) offset.current = { left: rect.left, top: rect.top };

        const area = width * height;
        const target = Math.round(
          Math.min(54, Math.max(8, area / 28000)) * tier.particleScale * density,
        );
        const list: Particle[] = [];
        for (let i = 0; i < target; i++) {
          const depth = 0.35 + Math.random() * 0.65;
          list.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: (6 + Math.random() * 22) * depth,
            vx: (Math.random() - 0.5) * 6,
            vy: -(3 + Math.random() * 9) * depth,
            color: Math.floor(Math.random() * palette.length),
            alpha: 0.1 + Math.random() * 0.17,
            phase: Math.random() * Math.PI * 2,
            sway: 3 + Math.random() * 9,
            depth,
          });
        }
        particles.current = list;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = tone === 'dark' ? 'lighter' : 'source-over';

      const p = pointer.current;
      /* consome o scroll acumulado desde o último quadro */
      const scrollShift = scroll.current.delta;
      scroll.current.delta = 0;

      /* ponteiro convertido para coordenadas locais do canvas, uma vez só */
      const px = p.x - offset.current.left;
      const py = p.y - offset.current.top;

      for (const particle of particles.current) {
        /* deriva vertical suave + balanço lateral senoidal */
        particle.phase += dt * 0.6;
        particle.x += (particle.vx + Math.sin(particle.phase) * particle.sway) * dt;
        particle.y += particle.vy * dt;
        /* rolagem empurra as partículas no sentido contrário: parallax */
        particle.y -= scrollShift * 0.12 * particle.depth;

        /* o ponteiro afasta delicadamente o que está por perto */
        if (p.active) {
          const dx = particle.x - px;
          const dy = particle.y - py;
          const distance = Math.hypot(dx, dy);
          const radius = 150;
          if (distance < radius && distance > 0.01) {
            const force = (1 - distance / radius) * 26 * particle.depth;
            particle.x += (dx / distance) * force * dt;
            particle.y += (dy / distance) * force * dt;
          }
        }

        /* reciclagem nas bordas: o campo nunca "esvazia" */
        if (particle.y < -particle.r * 2) {
          particle.y = height + particle.r;
          particle.x = Math.random() * width;
        } else if (particle.y > height + particle.r * 2) {
          particle.y = -particle.r;
          particle.x = Math.random() * width;
        }
        if (particle.x < -particle.r * 2) particle.x = width + particle.r;
        else if (particle.x > width + particle.r * 2) particle.x = -particle.r;

        const sprite = sprites.current[particle.color];
        if (!sprite) continue;
        ctx.globalAlpha = particle.alpha;
        ctx.drawImage(
          sprite,
          particle.x - particle.r,
          particle.y - particle.r,
          particle.r * 2,
          particle.r * 2,
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
    { enabled: tier.particleScale > 0, maxDpr: tier.allowHeavy ? 2 : 1.5 },
  );

  /* reduced motion: nada de canvas — o gradiente de fundo já dá o clima */
  if (tier.particleScale === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className={['canvas-layer', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
