import type { ReactNode } from 'react';
import './Button.css';

/* ==========================================================================
   Button — um único componente para todos os botões e CTAs do site.
   Vira <a> quando recebe href e <button> quando recebe onClick.
   ========================================================================== */

type Variant = 'primary' | 'outline' | 'light' | 'dark';
type Size = 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /* ícone opcional à direita (uma seta, por exemplo) */
  icon?: ReactNode;
  full?: boolean;
};

type Props = BaseProps &
  (
    | { href: string; onClick?: never; type?: never; disabled?: never; external?: boolean }
    | {
        href?: never;
        onClick?: () => void;
        type?: 'button' | 'submit';
        disabled?: boolean;
        external?: never;
      }
  );

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  full = false,
  ...rest
}: Props) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    full ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className="btn__label">{children}</span>
      {icon ? (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  );

  if ('href' in rest && rest.href) {
    const { href, external } = rest;
    /* links externos abrem em nova aba com rel seguro */
    const isExternal = external ?? /^https?:/.test(href);
    return (
      <a
        className={classes}
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  const { onClick, type = 'button', disabled } = rest as {
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
  };

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
