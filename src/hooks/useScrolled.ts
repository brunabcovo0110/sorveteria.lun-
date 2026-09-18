import { useEffect, useState } from 'react';

/* Diz se a página já passou de um certo ponto de scroll.
   A navbar usa isso para ganhar fundo e sombra sem ficar piscando. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;

    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > threshold);
    };

    /* agrupa vários eventos de scroll num único cálculo por quadro */
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return scrolled;
}
