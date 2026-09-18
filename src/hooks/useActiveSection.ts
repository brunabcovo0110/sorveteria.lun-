import { useEffect, useState } from 'react';

/* ==========================================================================
   Diz qual seção está em foco na tela, para a navbar marcar o link atual.
   Usa IntersectionObserver (nada de cálculo no evento de scroll) e considera
   ativa a seção que cruza a faixa central da janela.
   ========================================================================== */

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        /* entre as seções visíveis, vence a que aparece mais */
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        /* faixa central: evita que a seção seguinte "roube" o destaque cedo */
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.2, 0.5, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
