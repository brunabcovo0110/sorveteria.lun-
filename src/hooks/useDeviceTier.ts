import { useEffect, useState } from 'react';

/* ==========================================================================
   Detecta a "capacidade" do aparelho para calibrar os efeitos.
   É daqui que sai a decisão de reduzir partículas, desligar sombras do 3D ou
   respeitar prefers-reduced-motion — em um lugar só, nunca espalhado.
   ========================================================================== */

export type DeviceTier = {
  /* usuário pediu menos movimento no sistema operacional */
  reduceMotion: boolean;
  /* largura de tela pequena (layout + toque) */
  isMobile: boolean;
  /* aparelho aparenta ser modesto (poucos núcleos / pouca memória) */
  isLowPower: boolean;
  /* atalho: pode rodar efeitos pesados (sombras, muitas partículas) */
  allowHeavy: boolean;
  /* multiplicador da quantidade de partículas — 0 desliga o canvas */
  particleScale: number;
};

const MOBILE_QUERY = '(max-width: 760px)';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function read(): DeviceTier {
  /* fora do browser assumimos o cenário mais conservador */
  if (typeof window === 'undefined') {
    return {
      reduceMotion: true,
      isMobile: false,
      isLowPower: true,
      allowHeavy: false,
      particleScale: 0,
    };
  }

  const reduceMotion = window.matchMedia(MOTION_QUERY).matches;
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;

  const cores = navigator.hardwareConcurrency ?? 4;
  /* deviceMemory só existe em navegadores Chromium; sem ele, não penalizamos */
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const isLowPower = cores <= 4 || memory <= 4;

  const allowHeavy = !reduceMotion && !isLowPower && !isMobile;

  let particleScale = 1;
  if (reduceMotion) particleScale = 0;
  else if (isMobile) particleScale = 0.4;
  else if (isLowPower) particleScale = 0.6;

  return { reduceMotion, isMobile, isLowPower, allowHeavy, particleScale };
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(read);

  useEffect(() => {
    const motion = window.matchMedia(MOTION_QUERY);
    const mobile = window.matchMedia(MOBILE_QUERY);
    const update = () => setTier(read());

    motion.addEventListener('change', update);
    mobile.addEventListener('change', update);
    update();

    return () => {
      motion.removeEventListener('change', update);
      mobile.removeEventListener('change', update);
    };
  }, []);

  return tier;
}
