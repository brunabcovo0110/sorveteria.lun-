# LUNÉA — Sorveteria artesanal

Site institucional completo de uma sorveteria fictícia, criado como peça de
portfólio: identidade visual própria, fotografia de produto, Canvas animado e um
montador de sorvete funcional.

> **Um novo jeito de saborear o verão.**

---

## Como rodar

```bash
npm install
npm run dev
```

Outros comandos:

| Comando           | O que faz                                        |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | ambiente de desenvolvimento (Vite)               |
| `npm run build`   | checagem de tipos + build de produção em `dist/` |
| `npm run preview` | serve o build de produção localmente             |
| `npm run lint`    | análise estática com oxlint                      |

---

## Stack e por que cada peça está aqui

| Tecnologia              | Motivo                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| **React + TypeScript**  | componentes reutilizáveis e tipagem nos dados dos produtos                     |
| **Vite**                | build rápido e otimização de assets                                            |
| **framer-motion**       | scroll reveal, transições de lista e paralaxe. Dispensa o GSAP                 |
| **Canvas 2D** (sem lib) | os campos de partículas, escritos à mão para caber no orçamento de performance |

São só duas dependências de produção (`react` e `framer-motion`). Nenhuma
biblioteca de ícones, de UI ou de carrossel: os ícones são SVG inline
(`src/components/ui/Icons.tsx`) e o sorvete do montador é um SVG paramétrico
autoral, porque precisa mudar de forma conforme as escolhas do cliente.

### Fotos

As fotos de produto vêm do Unsplash, sob licença livre para uso comercial, e
estão versionadas em `public/fotos/` (≈900 KB no total, já em WebP e recortadas
no tamanho exato de exibição). A lista completa com os créditos e os critérios
de escolha está em [`public/fotos/CREDITOS.md`](public/fotos/CREDITOS.md).

Para usar as fotos da sorveteria real, basta trocar os arquivos dessa pasta
mantendo os mesmos nomes.

---

## Estrutura

```
src/
├── data/             ← conteúdo do negócio (é aqui que o cliente mexe)
│   ├── site.ts           marca, endereço, horário, telefone, WhatsApp
│   ├── flavors.ts        sabores da vitrine, preços e cores
│   ├── favorites.ts      os três queridinhos
│   ├── builder.ts        tamanhos, coberturas e complementos
│   └── features.ts       os diferenciais
├── hooks/            ← comportamento reaproveitável
│   ├── useDeviceTier.ts   decide quanto efeito o aparelho aguenta
│   ├── useCanvasLoop.ts   ciclo de vida de um canvas animado
│   ├── usePointer.ts      posição do mouse sem causar re-render
│   ├── useScrolled.ts     estado da navbar
│   └── useActiveSection.ts link ativo no menu
├── components/
│   ├── ui/            Button, Reveal, SectionHeading, Icons
│   ├── art/           SVG autoral (sorvete do montador, mapa, logo, selo)
│   ├── canvas/        ParticleField e GlowField
│   ├── media/         Photo (imagem otimizada) e a composição da Hero
│   ├── layout/        Navbar e Footer
│   └── sections/      uma pasta por seção da página (.tsx + .css juntos)
└── styles/
    ├── tokens.css     cores, tipografia, espaçamento, sombras, curvas
    └── base.css       reset e fundamentos
```

Cada componente tem o seu próprio CSS ao lado do arquivo. Nada de folha de
estilo gigante — para mexer no visual de uma seção, basta abrir a pasta dela.

---

## Onde mudar as coisas

- **Cores, fontes, espaçamentos, sombras** → `src/styles/tokens.css`.
  Trocar `--violet` e `--turquoise` já muda a marca inteira.
- **Sabores, preços, produtos** → `src/data/`.
- **Endereço, horário, telefone, Instagram, WhatsApp** → `src/data/site.ts`.
- **Mapa real:** substituir `<MapArt />` em `sections/Location.tsx` por um
  `<iframe>` do Google Maps. O layout já está preparado.

### Ligando o pedido a um sistema de verdade

O montador já produz o pedido completo em estrutura de dados. O envio passa por
uma única função:

```ts
// src/data/site.ts
export function buildWhatsAppLink(message: string) { ... }
```

Hoje ela abre o WhatsApp com o pedido escrito. Para integrar com uma API, um
banco de dados ou uma plataforma de delivery, basta trocar o que acontece no
`onClick` do botão "Enviar pedido" em `sections/Builder.tsx` — nenhum outro
arquivo precisa mudar.

---

## Performance

As imagens e os canvas foram tratados como custo, não como enfeite.

- **Fotos em WebP, recortadas no servidor** exatamente no tamanho em que
  aparecem, com `width` e `height` declarados: o navegador reserva o espaço e a
  página não "pula" enquanto elas carregam.
- **Só a foto da Hero carrega com prioridade.** Todas as outras são `lazy`, para
  que nada abaixo da dobra dispute banda com a primeira pintura.
- **Nada é desenhado fora da tela.** Os canvas pausam via
  `IntersectionObserver` e quando a aba perde o foco.
- **Partículas são sprites.** Cada cor é um degradê renderizado uma única vez;
  por quadro só acontecem cópias de imagem.
- **`devicePixelRatio` limitado** a 1.4–1.7, onde o ganho visual já satura.
- **Um só `useDeviceTier`** decide, para o site inteiro, quantas partículas
  existem e se os efeitos pesados entram.

Medição local com tudo rodando: **60 FPS estáveis, nenhum quadro acima de
17 ms**.

---

## Acessibilidade

- HTML semântico, um único `<h1>` e hierarquia de títulos coerente.
- Contraste conferido: todos os textos passam em **4.5:1** (WCAG AA) — os tons
  auxiliares foram escurecidos justamente por causa disso.
- Foco visível e consistente; as opções do montador são `input` de verdade
  (rádio e checkbox), então funcionam no teclado sem nenhuma gambiarra.
- Alvos de toque de no mínimo 44 px.
- Link "pular para o conteúdo", `lang="pt-BR"`, todas as fotos com texto
  alternativo descritivo e elementos decorativos marcados como `aria-hidden`.
- **`prefers-reduced-motion` é respeitado de verdade:** as animações são
  desligadas, os canvas não são renderizados e o paralaxe da Hero fica parado.

---

## Responsividade

Testado de 360 px a 1920 px, sem estouro horizontal em nenhuma largura.
O celular não é o desktop espremido: a Hero se reorganiza, o montador vira uma
faixa compacta, o menu vira painel e a quantidade de partículas cai para ~40%.

---

Projeto fictício, criado para demonstração de portfólio.
