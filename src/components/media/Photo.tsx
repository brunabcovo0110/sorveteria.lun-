import './Photo.css';

/* ==========================================================================
   Photo — todas as fotos do site passam por aqui.

   O que este componente garante, sem a gente lembrar disso caso a caso:
   - `width`/`height` sempre presentes, para o navegador reservar o espaço e
     a página não "pular" enquanto a imagem carrega;
   - `loading="lazy"` por padrão, e carregamento prioritário só na Hero;
   - um fundo de cor enquanto a foto não chega, em vez de um buraco branco;
   - `object-fit: cover`, então o enquadramento nunca distorce.
   ========================================================================== */

export type PhotoSource = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Props = {
  photo: PhotoSource;
  className?: string;
  /* true apenas para a imagem principal da Hero (a primeira que aparece) */
  priority?: boolean;
  /* cor de espera, normalmente o tom do card onde a foto está */
  placeholder?: string;
  /* recorte dentro do quadro, quando o assunto não está no centro */
  objectPosition?: string;
};

export function Photo({
  photo,
  className,
  priority = false,
  placeholder,
  objectPosition,
}: Props) {
  return (
    <img
      className={['photo', className].filter(Boolean).join(' ')}
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      /* fetchPriority ajuda o navegador a buscar a imagem da Hero primeiro */
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      style={{
        backgroundColor: placeholder,
        objectPosition,
      }}
    />
  );
}
