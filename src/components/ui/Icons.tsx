/* ==========================================================================
   Ícones do site.
   São poucos e simples — não justificam uma biblioteca inteira de ícones no
   bundle. Todos herdam a cor do texto (currentColor) e o tamanho por prop.
   ========================================================================== */

type IconProps = { size?: number };

export function ArrowIcon({ size = 16 }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M4 10h11M11 5.5 15.5 10 11 14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 17 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function WhatsappIcon({ size = 17 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3A8.5 8.5 0 1 1 20.5 11.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.4c-.4.9-.2 2 .7 3.2 1 1.3 2.2 2 3.2 2.2.6.1 1.2-.2 1.5-.7l-1.7-1-.7.6c-.6-.3-1.4-1.1-1.8-1.9l.7-.6-.9-1.8c-.4 0-.8 0-1 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PhoneIcon({ size = 17 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a10.5 10.5 0 0 0 6 6l1.5-2 4 1.5v3c0 1-.8 1.8-1.8 1.7C11.6 19.6 4.4 12.4 3.8 5.3 3.7 4.3 4.5 3.5 5.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PointerIcon({ size = 15 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M6 3.5 18 11l-5.4 1.4L10.8 18 6 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
