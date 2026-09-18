import { useEffect, useRef, useState } from 'react';
import { IceCream } from '../art/IceCream';
import { usePointer } from '../../hooks/usePointer';
import type { DeviceTier } from '../../hooks/useDeviceTier';
import './HeroVisual.css';

/* ==========================================================================
   HeroVisual — a composição 3D da Hero.

   Estratégia de carregamento (é o que mantém o site rápido):
   1. a ilustração SVG aparece de imediato, junto com o HTML;
   2. o three.js é baixado em segundo plano, por import dinâmico, só quando o
      navegador está ocioso;
   3. quando a cena está pronta, ela entra em fade por cima do SVG.

   Se o aparelho pediu menos movimento, ou não tem WebGL, o SVG simplesmente
   fica — e a Hero continua bonita e sem custo de GPU.
   ========================================================================== */

/* Mesmas cores das bolas da cena 3D, para a troca não "pular". */
const POSTER_SCOOPS = [
  { light: '#fff2f6', base: '#ff87ab', deep: '#e0537f' },
  { light: '#fffdf4', base: '#ffe6b4', deep: '#e2c078' },
  { light: '#f3edff', base: '#b49dff', deep: '#8a72e0' },
];

type Props = { tier: DeviceTier };

export function HeroVisual({ tier }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const pointer = usePointer(!tier.reduceMotion);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* respeita prefers-reduced-motion: nem baixamos a biblioteca 3D */
    if (tier.reduceMotion) return;

    let cancelled = false;
    let scene: { dispose(): void } | null = null;

    const load = async () => {
      try {
        const { IceCreamScene } = await import('./IceCreamScene');
        if (cancelled || !holder.current) return;

        const instance = new IceCreamScene(holder.current, {
          pointer,
          quality: tier.allowHeavy ? 'high' : 'low',
        });
        instance.start();
        scene = instance;
        setReady(true);
      } catch {
        /* sem WebGL (ou GPU bloqueada): seguimos com a ilustração SVG */
        setReady(false);
      }
    };

    /* espera o navegador ficar ocioso para não competir com a primeira pintura */
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void load(), { timeout: 1200 })
      : window.setTimeout(() => void load(), 320);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      scene?.dispose();
    };
  }, [tier.reduceMotion, tier.allowHeavy, pointer]);

  return (
    <div className="hero-visual">
      {/* halos de luz: dão profundidade e "assentam" o objeto na cena */}
      <div className="hero-visual__halo hero-visual__halo--violet" aria-hidden="true" />
      <div className="hero-visual__halo hero-visual__halo--turquoise" aria-hidden="true" />
      <div className="hero-visual__ring" aria-hidden="true" />

      <div
        className="hero-visual__stage"
        ref={holder}
        data-ready={ready ? 'true' : 'false'}
      />

      <IceCream
        scoops={POSTER_SCOOPS}
        className="hero-visual__poster"
        label="Casquinha LUNÉA com três bolas de sorvete artesanal"
      />
    </div>
  );
}
