import { useEffect, useRef } from 'react';

/* ==========================================================================
   Toda a "encanação" de um canvas animado em um só lugar:
   - resolução correta em telas retina, com DPR limitado por performance;
   - redimensionamento via ResizeObserver;
   - loop que PAUSA quando o canvas sai da tela ou a aba perde o foco.
   Assim cada componente de canvas só se preocupa em desenhar um quadro.
   ========================================================================== */

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D;
  /* dimensões em pixels CSS — o contexto já vem escalado pelo DPR */
  width: number;
  height: number;
  /* segundos desde o início da animação */
  time: number;
  /* segundos desde o último quadro, limitado para evitar saltos */
  dt: number;
  /* true no primeiro quadro depois de um redimensionamento */
  resized: boolean;
};

type Options = {
  enabled?: boolean;
  maxDpr?: number;
};

export function useCanvasLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onFrame: (frame: CanvasFrame) => void,
  { enabled = true, maxDpr = 2 }: Options = {},
) {
  /* callback guardado em ref: o loop nunca reinicia só porque a função foi
     recriada a cada render. A atribuição acontece em um efeito (e não durante
     a renderização) para ficar correta também no modo concorrente do React. */
  const frameCb = useRef(onFrame);
  useEffect(() => {
    frameCb.current = onFrame;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let resized = true;
    let raf = 0;
    let start = 0;
    let last = 0;
    let onScreen = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resized = true;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);

      /* fora da tela ou aba em segundo plano: não desenha nada */
      if (!onScreen || document.hidden) {
        last = now;
        return;
      }

      if (!start) start = now;
      const time = (now - start) / 1000;
      const dt = Math.min((now - (last || now)) / 1000, 1 / 20);
      last = now;

      frameCb.current({ ctx, width, height, time, dt, resized });
      resized = false;
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibility = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
      },
      { rootMargin: '120px' },
    );
    visibility.observe(canvas);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [canvasRef, enabled, maxDpr]);
}
