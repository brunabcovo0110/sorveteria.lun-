import type { ReactElement } from 'react';
import type { FavoriteArt } from '../../data/favorites';
import { MilkshakeArt, SplitArt, SundaeArt } from './Treats';

/* Liga o campo `art` do produto à ilustração correspondente.
   Fica em arquivo próprio para o Treats.tsx exportar apenas componentes —
   é o que mantém o hot reload do Vite funcionando direito. */
export const treatArt: Record<
  FavoriteArt,
  (props: { className?: string; label?: string }) => ReactElement
> = {
  sundae: SundaeArt,
  milkshake: MilkshakeArt,
  split: SplitArt,
};
