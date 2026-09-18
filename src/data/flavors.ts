/* ==========================================================================
   Sabores da vitrine.
   Cada sabor carrega sua própria paleta — é ela que pinta a ilustração SVG,
   o brilho do card e o fundo no hover. Adicionar um sabor novo é só
   acrescentar um objeto aqui.
   ========================================================================== */

export type ScoopPattern = 'plain' | 'chips' | 'swirl' | 'speckle' | 'ribbon';

export type ScoopPalette = {
  /* cor de fundo do card na vitrine (independente das cores da bola) */
  tint: string;
  light: string;
  base: string;
  deep: string;
  accent: string;
  pattern: ScoopPattern;
};

export type Flavor = {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  palette: ScoopPalette;
};

export const flavors: Flavor[] = [
  {
    id: 'morango',
    name: 'Morango',
    description: 'Leve, cremoso e feito para refrescar.',
    price: 12,
    badge: 'Mais pedido',
    palette: {
      tint: '#ffe9f0',
      light: '#ffe4ec',
      base: '#ff92b4',
      deep: '#e4628c',
      accent: '#c33a63',
      pattern: 'speckle',
    },
  },
  {
    id: 'chocolate-belga',
    name: 'Chocolate Belga',
    description: 'Intenso e aveludado, com cacau nobre.',
    price: 14,
    palette: {
      tint: '#f7ece1',
      light: '#a8785f',
      base: '#7c4c38',
      deep: '#4f2c1e',
      accent: '#f3dfc9',
      pattern: 'ribbon',
    },
  },
  {
    id: 'baunilha',
    name: 'Baunilha',
    description: 'Fava de baunilha em creme sedoso.',
    price: 12,
    palette: {
      tint: '#fff6e0',
      light: '#fff8e6',
      base: '#ffe9bd',
      deep: '#e8c88d',
      accent: '#6b4b2a',
      pattern: 'speckle',
    },
  },
  {
    id: 'manga',
    name: 'Manga',
    description: 'Doce na medida, com um toque tropical.',
    price: 13,
    badge: 'Novidade',
    palette: {
      tint: '#fff1da',
      light: '#ffe9bf',
      base: '#ffbe6b',
      deep: '#f39a35',
      accent: '#ff8a4c',
      pattern: 'swirl',
    },
  },
  {
    id: 'cookies-cream',
    name: 'Cookies & Cream',
    description: 'Creme suave com lascas crocantes de cookie.',
    price: 14,
    palette: {
      tint: '#f6f1ea',
      light: '#fffaf2',
      base: '#f2e6dc',
      deep: '#d6c3b6',
      accent: '#2f2233',
      pattern: 'chips',
    },
  },
  {
    id: 'limao-siciliano',
    name: 'Limão Siciliano',
    description: 'Cítrico, vibrante e absurdamente refrescante.',
    price: 13,
    palette: {
      tint: '#f1fadf',
      light: '#f2ffe0',
      base: '#c8ef9c',
      deep: '#8fd06a',
      accent: '#f6e05e',
      pattern: 'swirl',
    },
  },
];
