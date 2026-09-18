import * as THREE from 'three';

/* ==========================================================================
   Texturas geradas em tempo de execução, com Canvas 2D.
   Motivo: zero download de imagens (nenhum .jpg, nenhum HDR), nitidez em
   qualquer tela e as cores saem exatamente da paleta da LUNÉA.
   ========================================================================== */

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d')! };
}

/* Casquinha: a malha quadriculada do waffle, em relevo suave. */
export function makeWaffleTexture() {
  const size = 256;
  const { canvas, ctx } = createCanvas(size, size);

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#edc182');
  base.addColorStop(0.5, '#d29a52');
  base.addColorStop(1, '#a96f37');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  /* losangos do waffle */
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-size, -size);
  const step = size / 8;
  ctx.lineWidth = 3;
  for (let i = 0; i <= 16; i++) {
    ctx.strokeStyle = 'rgba(122, 76, 36, 0.32)';
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, size * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step);
    ctx.lineTo(size * 2, i * step);
    ctx.stroke();

    /* um fio claro ao lado de cada linha simula o alto-relevo */
    ctx.strokeStyle = 'rgba(255, 240, 214, 0.34)';
    ctx.beginPath();
    ctx.moveTo(i * step + 3, 0);
    ctx.lineTo(i * step + 3, size * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step + 3);
    ctx.lineTo(size * 2, i * step + 3);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* Ambiente equiretangular: é ele que produz os reflexos e o brilho das bolas.
   Em vez de baixar um HDR de vários megabytes, pintamos um "estúdio" com as
   cores da marca — creme em cima, lilás nas laterais, turquesa embaixo. */
export function makeEnvironmentTexture() {
  const width = 512;
  const height = 256;
  const { canvas, ctx } = createCanvas(width, height);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#fffaf2');
  sky.addColorStop(0.35, '#e7ddff');
  sky.addColorStop(0.62, '#cfe8ff');
  sky.addColorStop(1, '#bff0ec');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  /* duas "luminárias" claras: viram os pontos de luz refletidos no gelato */
  const lamp = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };

  lamp(140, 70, 120, 'rgba(255,255,255,0.98)');
  lamp(400, 96, 96, 'rgba(255, 226, 246, 0.9)');
  lamp(300, 220, 110, 'rgba(160, 255, 246, 0.5)');

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* Sombra de contato: um degradê radial num plano no chão.
   Bem mais barato que shadow map e, num objeto flutuante, indistinguível. */
export function makeShadowTexture() {
  const size = 128;
  const { canvas, ctx } = createCanvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(74, 52, 120, 0.42)');
  g.addColorStop(0.55, 'rgba(74, 52, 120, 0.16)');
  g.addColorStop(1, 'rgba(74, 52, 120, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
