import { useEffect, useRef } from 'react';

/* ==========================================================================
   Posição do ponteiro guardada em ref (e não em state): o mouse pode se mover
   120x por segundo sem provocar um único re-render no React. Quem precisa do
   valor lê dentro do próprio requestAnimationFrame.
   ========================================================================== */

export type PointerState = {
  /* -1 .. 1 em relação ao centro da janela */
  nx: number;
  ny: number;
  /* posição em pixels dentro da janela */
  x: number;
  y: number;
  /* há um ponteiro ativo na tela */
  active: boolean;
};

export function usePointer(enabled = true) {
  const pointer = useRef<PointerState>({ nx: 0, ny: 0, x: 0, y: 0, active: false });

  useEffect(() => {
    if (!enabled) return;

    const set = (x: number, y: number) => {
      const p = pointer.current;
      p.x = x;
      p.y = y;
      p.nx = (x / window.innerWidth) * 2 - 1;
      p.ny = (y / window.innerHeight) * 2 - 1;
      p.active = true;
    };

    const onMove = (event: PointerEvent) => set(event.clientX, event.clientY);
    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  return pointer;
}
