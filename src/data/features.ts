/* ==========================================================================
   "Mais que sorvete." — os quatro diferenciais da casa.
   ========================================================================== */

export type Feature = {
  id: string;
  index: string;
  title: string;
  description: string;
  accent: string;
};

export const features: Feature[] = [
  {
    id: 'artesanais',
    index: '01',
    title: 'Sabores artesanais',
    description:
      'Cada receita nasce na nossa cozinha, em pequenos lotes, batida devagar para ficar sedosa.',
    accent: 'var(--violet)',
  },
  {
    id: 'ingredientes',
    index: '02',
    title: 'Ingredientes selecionados',
    description:
      'Fruta de verdade, leite fresco e cacau nobre. Nada de essência artificial.',
    accent: 'var(--rose)',
  },
  {
    id: 'todos-os-dias',
    index: '03',
    title: 'Feito todos os dias',
    description:
      'A vitrine abre sempre com gelato do dia. O que não sai fresquinho, não sai.',
    accent: 'var(--turquoise)',
  },
  {
    id: 'momentos',
    index: '04',
    title: 'Momentos especiais',
    description:
      'Uma loja pensada para sentar, conversar e esticar aquela tarde de verão.',
    accent: 'var(--peach)',
  },
];
