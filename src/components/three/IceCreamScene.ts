import * as THREE from 'three';
import { makeEnvironmentTexture, makeShadowTexture, makeWaffleTexture } from './textures';

/* ==========================================================================
   IceCreamScene — o sorvete 3D da Hero.
   Escrito em three.js puro, sem framework em volta: o arquivo é carregado
   sob demanda (import dinâmico), então o peso do 3D não entra no bundle
   inicial do site e a primeira pintura continua rápida.

   Princípios do movimento: lento, contínuo e "vivo" — flutuação senoidal,
   giro suave e uma inclinação que segue o mouse com amortecimento. Nada de
   rotação rápida ou sacudida, que é o que faz um 3D parecer amador.
   ========================================================================== */

type PointerLike = { current: { nx: number; ny: number; active: boolean } };

export type SceneOptions = {
  pointer: PointerLike;
  /* 'low' = celular ou aparelho modesto: menos partículas e shader mais leve */
  quality: 'low' | 'high';
  /* usuário pediu menos movimento: monta a cena, mas praticamente parada */
  calm?: boolean;
};

/* Cores das três bolas — a mesma família de cores da identidade. */
const SCOOPS = [
  { color: '#ff87ab', sheen: '#ffd9e5', radius: 0.84, y: 1.02 },
  { color: '#ffe6b4', sheen: '#ffffff', radius: 0.71, y: 1.94 },
  { color: '#b49dff', sheen: '#e9e0ff', radius: 0.57, y: 2.68 },
];

const BIT_COLORS = ['#7c5cf5', '#2fc9c2', '#ffdf8a', '#ff92b4', '#a9d9ff'];

type Bit = {
  mesh: THREE.Mesh;
  radius: number;
  angle: number;
  speed: number;
  y: number;
  bob: number;
  bobSpeed: number;
  spin: THREE.Vector3;
};

/* Deforma a esfera para virar uma bola de sorvete de verdade: pequenas
   lombadas contínuas (sem emenda visível) e um leve achatamento. */
function makeScoopGeometry(radius: number, seed: number) {
  const geometry = new THREE.SphereGeometry(radius, 56, 40);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    n.copy(v).normalize();
    const lumps =
      Math.sin(n.x * 4.2 + seed) * Math.cos(n.y * 3.4 + seed * 1.7) +
      Math.sin(n.z * 5.1 + seed * 2.3) * 0.5 +
      Math.cos((n.x + n.z) * 6.1 + seed) * 0.3;
    v.multiplyScalar(1 + lumps * 0.033);
    v.y *= 0.95;
    position.setXYZ(i, v.x, v.y, v.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export class IceCreamScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  /* tempo medido a partir do timestamp do próprio requestAnimationFrame —
     dispensa THREE.Clock (depreciado) e mantém o console limpo */
  private elapsed = 0;
  private lastFrame = 0;

  private root = new THREE.Group();
  private ice = new THREE.Group();
  private orbits = new THREE.Group();
  private shadow: THREE.Mesh;

  private bits: Bit[] = [];
  private disposables: { dispose(): void }[] = [];

  private pointer: PointerLike;
  private quality: 'low' | 'high';
  private calm: boolean;

  private raf = 0;
  private running = false;
  private onScreen = true;
  private scrollNorm = 0;

  /* rotação suavizada: o alvo vem do mouse, o valor atual persegue o alvo */
  private tilt = { x: 0, y: 0 };
  private tiltTarget = { x: 0, y: 0 };

  private resizeObserver: ResizeObserver;
  private visibilityObserver: IntersectionObserver;

  private container: HTMLElement;

  constructor(container: HTMLElement, options: SceneOptions) {
    this.container = container;
    this.pointer = options.pointer;
    this.quality = options.quality;
    this.calm = options.calm ?? false;

    /* ---------------- renderer ---------------- */
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.quality === 'high',
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearAlpha(0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    /* o canvas é decorativo: não deve roubar foco nem ser lido por leitores */
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(this.renderer.domElement);

    /* ---------------- câmera ---------------- */
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.set(0, 0.15, 9.9);

    /* ---------------- ambiente (reflexos) ---------------- */
    const envSource = makeEnvironmentTexture();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envMap = pmrem.fromEquirectangular(envSource).texture;
    this.scene.environment = envMap;
    envSource.dispose();
    pmrem.dispose();
    this.disposables.push(envMap);

    /* ---------------- luz ---------------- */
    const hemi = new THREE.HemisphereLight(0xe8ecff, 0xffd9c4, 1.1);
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3.2, 5, 4.4);
    const fillViolet = new THREE.PointLight(0x7c5cf5, 26, 14, 2);
    fillViolet.position.set(-3.4, 1.4, 2.6);
    const fillTurquoise = new THREE.PointLight(0x2fc9c2, 18, 14, 2);
    fillTurquoise.position.set(3.2, -1.6, 2.8);
    this.scene.add(hemi, key, fillViolet, fillTurquoise);

    /* ---------------- sorvete ---------------- */
    this.buildIceCream();
    this.buildFloatingBits();

    /* sombra de contato (plano com degradê, não shadow map) */
    const shadowTexture = makeShadowTexture();
    const shadowGeometry = new THREE.PlaneGeometry(4.6, 4.6);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = -2.25;
    this.disposables.push(shadowTexture, shadowGeometry, shadowMaterial);

    this.root.add(this.ice, this.orbits, this.shadow);
    /* centraliza a torre (que vai de -2 a ~3.3) na altura da câmera */
    this.root.position.y = -0.55;
    this.scene.add(this.root);

    /* ---------------- reatividade ---------------- */
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        this.onScreen = entries[0].isIntersecting;
      },
      { rootMargin: '80px' },
    );
    this.visibilityObserver.observe(container);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    this.resize();
    this.onScroll();
  }

  /* ---------------------------------------------------------------- montagem */

  private buildIceCream() {
    const isHigh = this.quality === 'high';

    /* casquinha */
    const waffle = makeWaffleTexture();
    const coneGeometry = new THREE.ConeGeometry(0.92, 2.65, 48, 1, false);
    const coneMaterial = new THREE.MeshStandardMaterial({
      map: waffle,
      bumpMap: waffle,
      bumpScale: isHigh ? 0.35 : 0,
      roughness: 0.72,
      metalness: 0,
      envMapIntensity: 0.45,
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.rotation.x = Math.PI; /* ponta para baixo */
    cone.position.y = -0.7;
    this.ice.add(cone);
    this.disposables.push(waffle, coneGeometry, coneMaterial);

    /* borda derretida na boca da casquinha */
    const rimGeometry = new THREE.TorusGeometry(0.87, 0.13, 12, 44);
    const rimMaterial = this.makeCreamMaterial('#ffa8c2', '#ffe1ea');
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.6;
    this.ice.add(rim);
    this.disposables.push(rimGeometry, rimMaterial);

    /* as três bolas */
    SCOOPS.forEach((spec, index) => {
      const geometry = makeScoopGeometry(spec.radius, index * 12.7 + 1.3);
      const material = this.makeCreamMaterial(spec.color, spec.sheen);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = spec.y;
      /* cada bola gira um pouco no próprio eixo: as lombadas nunca alinham */
      mesh.rotation.y = index * 1.1;
      mesh.rotation.z = index * 0.18 - 0.16;
      this.ice.add(mesh);
      this.disposables.push(geometry, material);
    });

    /* cereja */
    const cherryGeometry = new THREE.SphereGeometry(0.15, 24, 18);
    const cherryMaterial = new THREE.MeshPhysicalMaterial({
      color: '#e03f63',
      roughness: 0.18,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
    });
    const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
    cherry.position.set(0.04, 3.32, 0.02);
    this.ice.add(cherry);

    const stemGeometry = new THREE.CylinderGeometry(0.014, 0.018, 0.4, 6);
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: '#7c5a35',
      roughness: 0.6,
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(0.1, 3.56, 0.02);
    stem.rotation.z = -0.4;
    this.ice.add(stem);

    this.disposables.push(cherryGeometry, cherryMaterial, stemGeometry, stemMaterial);
  }

  /* Material do gelato: fosco, mas com um brilho de superfície que faz o
     objeto parecer cremoso em vez de plástico. */
  private makeCreamMaterial(color: string, sheen: string) {
    if (this.quality === 'low') {
      /* shader mais leve para aparelhos modestos */
      return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.48,
        metalness: 0,
        envMapIntensity: 0.85,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.44,
      metalness: 0,
      clearcoat: 0.42,
      clearcoatRoughness: 0.4,
      sheen: 0.7,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color(sheen),
      envMapIntensity: 0.95,
    });
  }

  /* Confeitos e brilhos flutuando em volta — poucos, e em órbitas lentas. */
  private buildFloatingBits() {
    const count = this.quality === 'high' ? 15 : 7;

    const sprinkle = new THREE.CapsuleGeometry(0.042, 0.15, 3, 7);
    const pearl = new THREE.SphereGeometry(0.075, 14, 10);
    const gem = new THREE.IcosahedronGeometry(0.095, 0);
    const shapes = [sprinkle, pearl, gem];
    this.disposables.push(sprinkle, pearl, gem);

    const materials = BIT_COLORS.map((color) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
        envMapIntensity: 1.1,
      });
      this.disposables.push(material);
      return material;
    });

    for (let i = 0; i < count; i++) {
      const geometry = shapes[i % shapes.length];
      const material = materials[i % materials.length];
      const mesh = new THREE.Mesh(geometry, material);

      /* distribuição determinística: sempre a mesma composição, nunca
         um confeito nascendo na frente do texto */
      const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.4;
      const radius = 1.85 + ((i * 7) % 5) * 0.32;
      const y = -1.5 + ((i * 11) % 9) * 0.56;

      const bit: Bit = {
        mesh,
        radius,
        angle,
        speed: 0.055 + ((i * 3) % 5) * 0.016,
        y,
        bob: 0.09 + ((i * 5) % 4) * 0.05,
        bobSpeed: 0.4 + ((i * 7) % 5) * 0.12,
        spin: new THREE.Vector3(
          0.1 + (i % 3) * 0.08,
          0.14 + (i % 4) * 0.06,
          0.08 + (i % 5) * 0.05,
        ),
      };

      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.7);
      mesh.rotation.set(i * 0.7, i * 1.3, i * 0.4);
      this.orbits.add(mesh);
      this.bits.push(bit);
    }

    /* duas bolhas translúcidas só no modo completo: dão profundidade */
    if (this.quality === 'high') {
      const bubbleGeometry = new THREE.SphereGeometry(0.3, 24, 18);
      const bubbleMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.12,
        metalness: 0,
        transparent: true,
        opacity: 0.28,
        envMapIntensity: 1.6,
        clearcoat: 1,
      });
      this.disposables.push(bubbleGeometry, bubbleMaterial);

      [
        { angle: 2.1, radius: 2.5, y: 2.2 },
        { angle: 5.0, radius: 2.7, y: -0.6 },
      ].forEach((spec, i) => {
        const mesh = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        mesh.position.set(
          Math.cos(spec.angle) * spec.radius,
          spec.y,
          Math.sin(spec.angle) * spec.radius * 0.7,
        );
        this.orbits.add(mesh);
        this.bits.push({
          mesh,
          radius: spec.radius,
          angle: spec.angle,
          speed: 0.03 + i * 0.008,
          y: spec.y,
          bob: 0.16,
          bobSpeed: 0.3 + i * 0.1,
          spin: new THREE.Vector3(0.02, 0.05, 0.02),
        });
      });
    }
  }

  /* ---------------------------------------------------------------- eventos */

  private onScroll = () => {
    /* 0 no topo da página, 1 uma tela abaixo */
    this.scrollNorm = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
  };

  private onVisibility = () => {
    /* ao voltar para a aba, zeramos a referência de tempo para o primeiro
       quadro não vir com um delta gigante acumulado */
    if (!document.hidden) this.lastFrame = 0;
  };

  private resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;

    /* DPR limitado: o ganho visual acima de ~1.6 é mínimo e o custo, alto */
    const maxDpr = this.quality === 'high' ? 1.7 : 1.4;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    /* em telas estreitas afastamos a câmera para o sorvete não encostar nas
       bordas — o 3D é adaptado ao mobile, não apenas encolhido */
    this.camera.position.z = width < 520 ? 11.4 : 9.9;
    this.camera.updateProjectionMatrix();
  }

  /* ----------------------------------------------------------------- ciclo */

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);

    /* dt limitado: se a aba ficou parada, a animação retoma sem dar um salto */
    const dt = Math.min((now - (this.lastFrame || now)) / 1000, 1 / 20);
    this.lastFrame = now;

    /* fora da tela ou aba escondida: nada é desenhado */
    if (!this.onScreen || document.hidden) return;

    this.elapsed += dt;
    const t = this.elapsed;
    const motion = this.calm ? 0.12 : 1;

    /* inclinação perseguindo o ponteiro, com amortecimento exponencial
       (independente da taxa de quadros) */
    const p = this.pointer.current;
    this.tiltTarget.y = p.active ? p.nx * 0.4 * motion : 0;
    this.tiltTarget.x = p.active ? p.ny * 0.17 * motion : 0;
    const ease = 1 - Math.exp(-dt * 2.6);
    this.tilt.x += (this.tiltTarget.x - this.tilt.x) * ease;
    this.tilt.y += (this.tiltTarget.y - this.tilt.y) * ease;

    this.ice.rotation.y = t * 0.1 * motion + this.tilt.y;
    this.ice.rotation.x = this.tilt.x;
    this.ice.rotation.z = Math.sin(t * 0.4) * 0.018 * motion;

    /* flutuação lenta + parallax de scroll */
    const float = Math.sin(t * 0.62) * 0.1 * motion;
    this.ice.position.y = float;
    this.root.position.y = -0.55 - this.scrollNorm * 0.9;

    /* a sombra acompanha a flutuação: encolhe quando o sorvete sobe */
    const lift = (float + 0.1) / 0.2;
    this.shadow.scale.setScalar(1 - lift * 0.07);
    (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.9 - lift * 0.16;

    /* órbita dos confeitos, em sentido contrário ao giro do sorvete */
    this.orbits.rotation.y = -t * 0.035 * motion - this.tilt.y * 0.5;
    for (const bit of this.bits) {
      bit.angle += bit.speed * dt * motion;
      bit.mesh.position.set(
        Math.cos(bit.angle) * bit.radius,
        bit.y + Math.sin(t * bit.bobSpeed + bit.radius) * bit.bob * motion,
        Math.sin(bit.angle) * bit.radius * 0.7,
      );
      bit.mesh.rotation.x += bit.spin.x * dt * motion;
      bit.mesh.rotation.y += bit.spin.y * dt * motion;
      bit.mesh.rotation.z += bit.spin.z * dt * motion;
    }

    this.renderer.render(this.scene, this.camera);
  };

  /* Libera tudo: geometrias, materiais, texturas e o contexto WebGL.
     Sem isso, trocar de página no React deixa memória de GPU presa. */
  dispose() {
    this.stop();
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibility);

    for (const item of this.disposables) item.dispose();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
