/* ==========================================================================
   "Os queridinhos da LUNÉA" — três produtos em destaque.
   O campo `art` escolhe qual ilustração SVG é usada no card.
   ========================================================================== */

export type FavoriteArt = 'sundae' | 'milkshake' | 'split';

export type Favorite = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  art: FavoriteArt;
  /* cores do fundo do card — mantêm cada destaque com personalidade própria */
  from: string;
  to: string;
  glow: string;
};

export const favorites: Favorite[] = [
  {
    id: 'sundae-lunea',
    name: 'Sundae LUNÉA',
    tagline: 'A assinatura da casa',
    description:
      'Três camadas de creme, calda quente de chocolate belga, chantilly e castanhas caramelizadas.',
    price: 24,
    art: 'sundae',
    from: '#efe6ff',
    to: '#d9caff',
    glow: 'rgba(124, 92, 245, 0.45)',
  },
  {
    id: 'milkshake-morango',
    name: 'Milkshake de Morango',
    tagline: 'Cremoso de verdade',
    description:
      'Morangos frescos batidos com nosso gelato de baunilha e finalizados com chantilly.',
    price: 19,
    art: 'milkshake',
    from: '#ffeaf1',
    to: '#ffd2de',
    glow: 'rgba(255, 146, 180, 0.45)',
  },
  {
    id: 'banana-split',
    name: 'Banana Split',
    tagline: 'O clássico eterno',
    description:
      'Banana caramelizada com três bolas, calda de morango, granulado e uma cereja no topo.',
    price: 27,
    art: 'split',
    from: '#e4f7f6',
    to: '#c3ecea',
    glow: 'rgba(47, 201, 194, 0.45)',
  },
];
