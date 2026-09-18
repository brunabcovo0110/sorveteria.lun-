import { useEffect, useRef } from 'react';
import { useCanvasLoop } from '../../hooks/useCanvasLoop';
import { usePointer } from '../../hooks/usePointer';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import './canvas.css';

/* ==========================================================================
   GlowField — o canvas interativo da seção "experiência".

   São poucos elementos grandes (auroras de luz) em vez de muitos pequenos:
   dá sensação de profundidade sem sujar a tela. Cada aurora tem uma
   "profundidade" própria, então o mouse e o scroll movem as camadas em
   velocidades diferentes — é isso que cria o paralaxe.

   Como no ParticleField, os degradês são sprites prontos: por quadro só
   acontecem cópias de imagem, nunca recálculo de gradiente.
   ========================================================================== */

type Props = { tier: DeviceTier };

const ORB_COLORS: [number, number, number][] = [
  [124, 92, 245],
  [47, 201, 194],
  [255, 146, 180],
  [169, 217, 255],
  [255, 223, 138],
];

type Orb = {
  /* posição base em fração da área (0..1) */
  bx: number;
  by: number;
  radius: number;
  color: number;
  depth: number;
  speed: number;
  phase: number;
  /* amplitude do vaivém */
  ax: number;
  ay: number;
};

type Spark = {
  x: number;
  y: number;
  r: number;
  twinkle: number;
  phase: number;
  depth: number;
};

const ORBS: Orb[] = [
  { bx: 0.2, by: 0.3, radius: 0.5, color: 0, depth: 1, speed: 0.13, phase: 0, ax: 0.05, ay: 0.06 },
  { bx: 0.78, by: 0.26, radius: 0.42, color: 1, depth: 0.78, speed: 0.1, phase: 1.7, ax: 0.06, ay: 0.05 },
  { bx: 0.56, by: 0.72, radius: 0.46, color: 2, depth: 0.62, speed: 0.08, phase: 3.1, ax: 0.07, ay: 0.04 },
  { bx: 0.1, by: 0.78, radius: 0.34, color: 3, depth: 0.5, speed: 0.11, phase: 4.4, ax: 0.05, ay: 0.06 },
  { bx: 0.9, by: 0.68, radius: 0.3, color: 4, depth: 0.4, speed: 0.09, phase: 5.6, ax: 0.04, ay: 0.05 },
  { bx: 0.42, by: 0.14, radius: 0.26, color: 1, depth: 0.32, speed: 0.12, phase: 2.4, ax: 0.06, ay: 0.03 },
  { bx: 0.66, by: 0.48, radius: 0.22, color: 0, depth: 0.24, speed: 0.15, phase: 0.8, ax: 0.05, ay: 0.05 },
];

export function GlowField({ tier }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = usePointer(!tier.reduceMotion);
  const sprites = useRef<HTMLCanvasElement[]>([]);
  const sparks = useRef<Spark[]>([]);
  /* posição do ponteiro suavizada, em fração da área */
  const smooth = useRef({ x: 0, y: 0 });
  const offset = useRef({ left: 0, top: 0 });
  const progress = useRef(0);

  /* sprites das auroras e do brilho pequeno */
  useEffect(() => {
    sprites.current = ORB_COLORS.map(([r, g, b]) => {
      const size = 256;
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
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.55)`);
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.24)`);
      gradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.06)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      return canvas;
    });
  }, []);

  /* progresso da seção dentro da viewport: alimenta o paralaxe de scroll */
  useEffect(() => {
    if (tier.particleScale === 0) return;

    const measure = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      offset.current = { left: rect.left, top: rect.top };
      /* -1 = seção chegando por baixo, 0 = centralizada, 1 = saindo por cima */
      const center = rect.top + rect.height / 2;
      progress.current = (window.innerHeight / 2 - center) / window.innerHeight;
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [tier.particleScale]);

  useCanvasLoop(
    canvasRef,
    ({ ctx, width, height, time, dt, resized }) => {
      if (resized || sparks.current.length === 0) {
        const count = Math.round(26 * Math.max(tier.particleScale, 0.4));
        sparks.current = Array.from({ length: count }, () => ({
          x: Math.random(),
          y: Math.random(),
          r: 0.8 + Math.random() * 1.9,
          twinkle: 0.4 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          depth: 0.3 + Math.random() * 0.7,
        }));
      }

      const p = pointer.current;
      /* alvo em fração: -0.5..0.5 dentro do canvas */
      const targetX = p.active ? (p.x - offset.current.left) / width - 0.5 : 0;
      const targetY = p.active ? (p.y - offset.current.top) / height - 0.5 : 0;
      const ease = 1 - Math.exp(-dt * 2.2);
      smooth.current.x += (targetX - smooth.current.x) * ease;
      smooth.current.y += (targetY - smooth.current.y) * ease;

      const scrollShift = progress.current;
      const base = Math.min(width, height);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      /* auroras — em aparelho modesto usamos só as quatro maiores */
      const orbs = tier.allowHeavy ? ORBS : ORBS.slice(0, 4);
      for (const orb of orbs) {
        const sprite = sprites.current[orb.color];
        if (!sprite) continue;

        const radius = orb.radius * base;
        const drift = time * orb.speed + orb.phase;
        const x =
          orb.bx * width +
          Math.sin(drift) * orb.ax * width +
          smooth.current.x * 90 * orb.depth;
        const y =
          orb.by * height +
          Math.cos(drift * 0.8) * orb.ay * height +
          smooth.current.y * 70 * orb.depth -
          scrollShift * 130 * orb.depth;

        ctx.globalAlpha = 0.85;
        ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
      }

      /* brilhos pequenos piscando devagar */
      ctx.fillStyle = '#ffffff';
      for (const spark of sparks.current) {
        spark.phase += dt * spark.twinkle;
        const alpha = 0.18 + (Math.sin(spark.phase) * 0.5 + 0.5) * 0.55;
        const x = spark.x * width + smooth.current.x * 40 * spark.depth;
        const y =
          spark.y * height + smooth.current.y * 32 * spark.depth - scrollShift * 90 * spark.depth;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, spark.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
    { enabled: tier.particleScale > 0, maxDpr: tier.allowHeavy ? 1.75 : 1.4 },
  );

  /* com reduced motion a seção fica só com o gradiente CSS — que já é bonito */
  if (tier.particleScale === 0) return null;

  return <canvas ref={canvasRef} className="canvas-layer" aria-hidden="true" />;
}
