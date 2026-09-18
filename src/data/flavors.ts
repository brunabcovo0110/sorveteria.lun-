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
  /* foto do sabor na vitrine (as dimensões evitam salto de layout) */
  photo: { src: string; alt: string; width: number; height: number };
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
    photo: {
      src: '/fotos/sabor-morango.webp',
      alt: 'Bolas de sorvete de morango em uma taça de vidro',
      width: 700,
      height: 700,
    },
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
    photo: {
      src: '/fotos/sabor-chocolate.webp',
      alt: 'Casquinha com duas bolas de sorvete de chocolate',
      width: 700,
      height: 700,
    },
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
    photo: {
      src: '/fotos/sabor-baunilha.webp',
      alt: 'Colher de sorvete tirando uma bola de creme de baunilha',
      width: 700,
      height: 700,
    },
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
    photo: {
      src: '/fotos/sabor-manga.webp',
      alt: 'Casquinha waffle com sorvete de manga',
      width: 700,
      height: 700,
    },
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
    photo: {
      src: '/fotos/sabor-cookies.webp',
      alt: 'Casquinha de sorvete de cookies and cream com farelo de biscoito',
      width: 700,
      height: 700,
    },
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
    photo: {
      src: '/fotos/sabor-limao.webp',
      alt: 'Bola de sorvete de limão siciliano em um potinho amarelo',
      width: 700,
      height: 700,
    },
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
