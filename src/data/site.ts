/* ==========================================================================
   Configuração geral da marca.
   Tudo que um cliente real pediria para trocar (telefone, endereço, horário,
   links) vive aqui — em um único lugar.
   ========================================================================== */

export const site = {
  name: 'LUNÉA',
  tagline: 'Um novo jeito de saborear o verão.',
  description:
    'Sorvetes artesanais, sabores irresistíveis e momentos feitos para você.',

  /* Contato (fictício) */
  phoneLabel: '(11) 4002-8922',
  phoneHref: 'tel:+551140028922',
  whatsappNumber: '5511999990000',
  instagramHandle: '@lunea.gelato',
  instagramUrl: 'https://instagram.com/',

  /* Loja física (fictícia) */
  address: {
    street: 'Rua das Flores, 245',
    district: 'Centro',
    city: 'São Paulo — SP',
  },
  hours: [
    { days: 'Segunda a quinta', time: '12h às 22h' },
    { days: 'Sexta e sábado', time: '12h às 23h' },
    { days: 'Domingo', time: '13h às 21h' },
  ],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+das+Flores+245+Centro',
} as const;

export const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sabores', href: '#sabores' },
  { label: 'Monte seu sorvete', href: '#monte' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
] as const;

/* Formata centavos/reais no padrão brasileiro. */
export const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

/* Diz se a loja está aberta neste momento, a partir do mesmo horário exibido
   na seção de localização. Um detalhe pequeno que faz o site parecer vivo. */
export function isOpenNow(now = new Date()) {
  const day = now.getDay(); /* 0 = domingo */
  const hour = now.getHours() + now.getMinutes() / 60;

  if (day === 0) return hour >= 13 && hour < 21; /* domingo */
  if (day >= 1 && day <= 4) return hour >= 12 && hour < 22; /* segunda a quinta */
  return hour >= 12 && hour < 23; /* sexta e sábado */
}

/* Índice da linha de horário correspondente ao dia de hoje. */
export function todayScheduleIndex(now = new Date()) {
  const day = now.getDay();
  if (day === 0) return 2;
  if (day >= 1 && day <= 4) return 0;
  return 1;
}

/* Ponto único de integração: hoje abre o WhatsApp com o pedido montado,
   amanhã pode virar POST para uma API/banco sem tocar nos componentes. */
export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappGeneric = buildWhatsAppLink(
  `Olá, ${site.name}! Gostaria de fazer um pedido.`,
);
