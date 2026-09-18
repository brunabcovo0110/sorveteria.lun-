/* ==========================================================================
   "Os queridinhos da LUNÉA" — três produtos em destaque.
   Cada um carrega a própria foto e o par de cores que pinta o fundo do card.
   ========================================================================== */

export type Favorite = {
  photo: { src: string; alt: string; width: number; height: number };
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  /* cores do fundo do card — mantêm cada destaque com personalidade própria */
  from: string;
  to: string;
  glow: string;
};

export const favorites: Favorite[] = [
  {
    id: 'sundae-lunea',
    photo: {
      src: '/fotos/queridinho-sundae.webp',
      alt: 'Taça alta de sundae com calda de chocolate, biscoitos e castanhas',
      width: 800,
      height: 900,
    },
    name: 'Sundae LUNÉA',
    tagline: 'A assinatura da casa',
    description:
      'Três camadas de creme, calda quente de chocolate belga, chantilly e castanhas caramelizadas.',
    price: 24,
    from: '#efe6ff',
    to: '#d9caff',
    glow: 'rgba(124, 92, 245, 0.45)',
  },
  {
    id: 'milkshake-morango',
    photo: {
      src: '/fotos/queridinho-milkshake.webp',
      alt: 'Milkshake de morango em copo alto com morangos frescos ao lado',
      width: 700,
      height: 700,
    },
    name: 'Milkshake de Morango',
    tagline: 'Cremoso de verdade',
    description:
      'Morangos frescos batidos com nosso gelato de baunilha e finalizados com chantilly.',
    price: 19,
    from: '#ffeaf1',
    to: '#ffd2de',
    glow: 'rgba(255, 146, 180, 0.45)',
  },
  {
    id: 'banana-split',
    photo: {
      src: '/fotos/queridinho-split.webp',
      alt: 'Banana split em travessa de vidro com chantilly, calda e cerejas',
      width: 700,
      height: 700,
    },
    name: 'Banana Split',
    tagline: 'O clássico eterno',
    description:
      'Banana caramelizada com três bolas, calda de morango, granulado e uma cereja no topo.',
    price: 27,
    from: '#e4f7f6',
    to: '#c3ecea',
    glow: 'rgba(47, 201, 194, 0.45)',
  },
];
