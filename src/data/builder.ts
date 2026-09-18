/* ==========================================================================
   "Monte seu sorvete" — catálogo do montador.
   Estrutura pensada para virar pedido de verdade: cada opção tem id, nome e
   preço, e o tamanho define quantas bolas o cliente pode escolher.
   ========================================================================== */

export type Option = {
  id: string;
  name: string;
  price: number;
};

export type SizeOption = Option & {
  /* quantas bolas o tamanho comporta */
  scoops: number;
  hint: string;
};

export const sizes: SizeOption[] = [
  { id: 'pequeno', name: 'Pequeno', price: 10, scoops: 1, hint: '1 bola' },
  { id: 'medio', name: 'Médio', price: 14, scoops: 2, hint: '2 bolas' },
  { id: 'grande', name: 'Grande', price: 18, scoops: 3, hint: '3 bolas' },
];

/* Cores usadas para desenhar a bola no preview ao vivo. */
export const builderFlavors: (Option & { light: string; base: string; deep: string })[] = [
  { id: 'morango', name: 'Morango', price: 0, light: '#ffe4ec', base: '#ff92b4', deep: '#e4628c' },
  { id: 'chocolate', name: 'Chocolate', price: 0, light: '#a8785f', base: '#7c4c38', deep: '#4f2c1e' },
  { id: 'baunilha', name: 'Baunilha', price: 0, light: '#fff8e6', base: '#ffe9bd', deep: '#e8c88d' },
  { id: 'manga', name: 'Manga', price: 0, light: '#ffe9bf', base: '#ffbe6b', deep: '#f39a35' },
  { id: 'cookies', name: 'Cookies', price: 0, light: '#fffaf2', base: '#f2e6dc', deep: '#cbb7a8' },
];

export const toppings: (Option & { color: string })[] = [
  { id: 'chocolate', name: 'Chocolate', price: 2, color: '#5b3220' },
  { id: 'caramelo', name: 'Caramelo', price: 2, color: '#d08a34' },
  { id: 'morango', name: 'Morango', price: 2, color: '#e4628c' },
  { id: 'leite-condensado', name: 'Leite condensado', price: 2, color: '#fff6e2' },
];

export const extras: (Option & { color: string })[] = [
  { id: 'granulado', name: 'Granulado', price: 3, color: '#7c5cf5' },
  { id: 'oreo', name: 'Oreo', price: 3, color: '#2f2233' },
  { id: 'brownie', name: 'Brownie', price: 3, color: '#6b4230' },
  { id: 'castanhas', name: 'Castanhas', price: 3, color: '#c99a5b' },
];
