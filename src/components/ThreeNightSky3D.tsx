import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Compass,
  Eye,
  Layers,
  Orbit,
  RotateCcw,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { KundaliData, Language } from '../types';
import { RASHIS } from '../utils/panchanga';
import { RASHI_CONSTELLATIONS } from '../utils/rashiConstellations';
import { NAKSHATRA_SKY_PATTERNS } from './CelestialSkyMandala3D';

export type CameraPresetKey = 'iso' | 'top' | 'side' | 'under';

export interface ThreeNightSky3DProps {
  currentLang: Language;
  kundaliData: KundaliData;
  showConstellations: boolean;
  showPadas: boolean;
  showDirections: boolean;
  onSelectItem: (item: {
    type: 'planet' | 'rashi' | 'nakshatra';
    index?: number;
    name?: string;
    data: any;
  }) => void;
}

interface CameraGoal {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  active: boolean;
}

const CAMERA_PRESETS: Record<CameraPresetKey, { pos: [number, number, number]; target: [number, number, number] }> = {
  iso: { pos: [0, 175, 345], target: [0, 0, 0] },
  top: { pos: [0, 420, 18], target: [0, 0, 0] },
  side: { pos: [370, 26, 45], target: [0, 0, 0] },
  under: { pos: [0, -185, 330], target: [0, 0, 0] },
};

// Reusable scratch vectors (zero per-frame allocations)
const _pointerNdc = new THREE.Vector2();
const _focusPos = new THREE.Vector3();

function circularAngleDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function createProceduralEarthTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Deep ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 256);
    oceanGrad.addColorStop(0, '#bae6fd');
    oceanGrad.addColorStop(0.12, '#0369a1');
    oceanGrad.addColorStop(0.5, '#075985');
    oceanGrad.addColorStop(0.88, '#0369a1');
    oceanGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Stylized continental landmasses (India, Eurasia, Africa, Americas, Australia)
    ctx.fillStyle = '#15803d';
    const blobs: Array<[number, number, number, number, number]> = [
      [340, 118, 22, 28, 0.2],   // India subcontinent
      [330, 82, 78, 30, -0.05],  // Eurasia
      [272, 132, 34, 42, 0.12],  // Africa
      [130, 92, 46, 36, -0.25],  // North America
      [172, 166, 28, 42, 0.18],  // South America
      [428, 174, 28, 20, -0.1],  // Australia
    ];
    blobs.forEach(([x, y, rx, ry, rot]) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Desert golden highlights
    ctx.fillStyle = 'rgba(217, 179, 98, 0.55)';
    ctx.beginPath();
    ctx.ellipse(275, 112, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(322, 102, 26, 10, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Subtle atmospheric cloud wisps
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const y = 32 + i * 28;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(140, y - 10, 340, y + 12, 512, y - 4);
      ctx.stroke();
    }

    // Fine latitude/longitude meridians
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.24)';
    ctx.lineWidth = 1;
    for (let lon = 0; lon <= 512; lon += 32) {
      ctx.beginPath();
      ctx.moveTo(lon, 0);
      ctx.lineTo(lon, 256);
      ctx.stroke();
    }
    for (let lat = 32; lat < 256; lat += 32) {
      ctx.beginPath();
      ctx.moveTo(0, lat);
      ctx.lineTo(512, lat);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

function createTextSprite(
  text: string,
  color: string,
  fontSize = 24,
  bgColor?: string,
  scaleX = 32,
  scaleY = 10,
  maxAnisotropy = 4
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 92;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 14);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.stroke();
    }
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, maxAnisotropy);
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(scaleX, scaleY, 1);
  return sprite;
}

export const ThreeNightSky3D: React.FC<ThreeNightSky3DProps> = ({
  currentLang,
  kundaliData,
  showConstellations,
  showPadas,
  showDirections,
  onSelectItem,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const onSelectItemRef = useRef(onSelectItem);
  onSelectItemRef.current = onSelectItem;

  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const isAutoOrbitRef = useRef<boolean>(true);
  isAutoOrbitRef.current = isAutoOrbit;

  const [showArmillary, setShowArmillary] = useState<boolean>(true);
  const [showZodiacFigures, setShowZodiacFigures] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<CameraPresetKey>('iso');
  const [dockExpanded, setDockExpanded] = useState<boolean>(true);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const cameraGoalRef = useRef<CameraGoal>({
    pos: new THREE.Vector3(...CAMERA_PRESETS.iso.pos),
    target: new THREE.Vector3(...CAMERA_PRESETS.iso.target),
    active: false,
  });

  const triggerPreset = (preset: CameraPresetKey) => {
    setActivePreset(preset);
    const p = CAMERA_PRESETS[preset];
    cameraGoalRef.current.pos.set(p.pos[0], p.pos[1], p.pos[2]);
    cameraGoalRef.current.target.set(p.target[0], p.target[1], p.target[2]);
    cameraGoalRef.current.active = true;
  };

  // Compute collision-free 3D planetary coordinates at exact Sidereal Lahiri longitudes
  const placedPlanets3D = useMemo(() => {
    const trackRadii = [44, 54, 64, 74, 85, 96, 108, 119, 130];
    const visualDefs: Record<
      string,
      { color: number; emissive: number; radius: number; preferredTrack: number; tiltY: number; hasRings?: boolean }
    > = {
      Rahu: { color: 0x94a3b8, emissive: 0x475569, radius: 4.8, preferredTrack: 0, tiltY: 11 },
      Moon: { color: 0xf8fafc, emissive: 0xcbd5e1, radius: 5.0, preferredTrack: 1, tiltY: 6.5 },
      Mercury: { color: 0x34d399, emissive: 0x059669, radius: 4.6, preferredTrack: 2, tiltY: -7 },
      Venus: { color: 0xfde047, emissive: 0xca8a04, radius: 5.5, preferredTrack: 3, tiltY: 5.2 },
      Sun: { color: 0xfbbf24, emissive: 0xf59e0b, radius: 8.2, preferredTrack: 4, tiltY: 0 },
      Mars: { color: 0xef4444, emissive: 0xb91c1c, radius: 5.6, preferredTrack: 5, tiltY: -5.5 },
      Jupiter: { color: 0xfb923c, emissive: 0xc2410c, radius: 8.4, preferredTrack: 6, tiltY: 7.5 },
      Saturn: { color: 0xeab308, emissive: 0xa16207, radius: 7.2, preferredTrack: 7, tiltY: -8.5, hasRings: true },
      Ketu: { color: 0xa855f7, emissive: 0x7e22ce, radius: 4.8, preferredTrack: 8, tiltY: -11 },
    };

    const raw = kundaliData.planets.map((planet) => {
      const absLong = ((planet.rashiIndex * 30 + planet.degrees) % 360 + 360) % 360;
      const degPart = Math.floor(planet.degrees);
      const minPart = Math.floor((planet.degrees - degPart) * 60);
      const def = visualDefs[planet.name] || {
        color: 0xffffff,
        emissive: 0x94a3b8,
        radius: 5,
        preferredTrack: 4,
        tiltY: 0,
      };
      return {
        ...planet,
        absLong,
        formattedDeg: `${degPart}°${String(minPart).padStart(2, '0')}'`,
        def,
      };
    });

    const assigned: Array<(typeof raw)[number] & { orbitR: number; yOffset: number }> = [];
    const sorted = [...raw].sort((a, b) => a.absLong - b.absLong);

    for (const p of sorted) {
      const nearby = assigned.filter((other) => circularAngleDiff(other.absLong, p.absLong) < 20);
      const usedRadii = nearby.map((n) => n.orbitR);

      let bestR = trackRadii[p.def.preferredTrack] ?? trackRadii[4];
      let bestScore = -Infinity;
      for (let t = 0; t < trackRadii.length; t++) {
        const candR = trackRadii[t];
        const minDist =
          usedRadii.length === 0
            ? 999
            : Math.min(...usedRadii.map((ur) => Math.abs(ur - candR)));
        const score = (minDist < 12 ? minDist * 6 - 120 : minDist) - Math.abs(t - p.def.preferredTrack) * 1.6;
        if (score > bestScore) {
          bestScore = score;
          bestR = candR;
        }
      }

      // Separate vertical height gently when planets share a close conjunction
      const extraY = nearby.length % 2 === 1 ? 8 * Math.sign(p.def.tiltY || 1) : 0;
      assigned.push({
        ...p,
        orbitR: bestR,
        yOffset: p.def.tiltY + extraY,
      });
    }

    return assigned;
  }, [kundaliData.planets]);

  const lagnaAbsLong = useMemo(() => {
    const h1 = kundaliData.houses[0];
    return (((h1?.rashiIndex ?? 0) * 30 + (kundaliData.lagnaDegree ?? 0)) % 360 + 360) % 360;
  }, [kundaliData.houses, kundaliData.lagnaDegree]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = Math.max(mount.clientWidth || 780, 320);
    const height = Math.max(mount.clientHeight || 560, 320);

    // 1. Renderer with Software WebGL guard & ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpuName);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.replaceChildren(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // 2. Scene, Studio PBR Environment & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040712);
    scene.fog = new THREE.FogExp2(0x040712, 0.00055);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.65;

    const camera = new THREE.PerspectiveCamera(44, width / height, 1, 2800);
    camera.position.set(...CAMERA_PRESETS.iso.pos);

    // 3. Full All-Sides OrbitControls (Top, Horizon Side, Isometric, AND Underneath South Pole)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = true;
    controls.minDistance = 115;
    controls.maxDistance = 760;
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    controls.target.set(0, 0, 0);

    const onControlsStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlsStart);

    // 4. Cinematic Studio & Cosmic Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5d6, 1.9);
    keyLight.position.set(160, 240, 180);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-220, -140, -180);
    scene.add(rimLight);

    const coreGlowLight = new THREE.PointLight(0xfbbf24, 1.6, 520);
    coreGlowLight.position.set(0, 24, 0);
    scene.add(coreGlowLight);

    // 5. Deep 3D Spherical Starfield (1,800 multi-spectral stars around all sides)
    const starCount = isSoftwareGl ? 900 : 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 560 + Math.random() * 520;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const spectral = Math.random();
      if (spectral > 0.78) {
        starCol[i * 3] = 0.72; starCol[i * 3 + 1] = 0.88; starCol[i * 3 + 2] = 1.0;
      } else if (spectral > 0.45) {
        starCol[i * 3] = 1.0; starCol[i * 3 + 1] = 0.98; starCol[i * 3 + 2] = 0.95;
      } else if (spectral > 0.2) {
        starCol[i * 3] = 1.0; starCol[i * 3 + 1] = 0.84; starCol[i * 3 + 2] = 0.52;
      } else {
        starCol[i * 3] = 1.0; starCol[i * 3 + 1] = 0.62; starCol[i * 3 + 2] = 0.5;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    const bgStars = new THREE.Points(starGeo, starMat);
    scene.add(bgStars);

    // 6. Central Composite Earth Globe with 23.4° Axial Tilt Rod & Polar Finials
    const earthRadius = 20;
    const earthTiltPivot = new THREE.Group();
    earthTiltPivot.rotation.z = THREE.MathUtils.degToRad(23.44);

    const earthSpinGroup = new THREE.Group();
    const earthTex = createProceduralEarthTexture(maxAniso);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.52,
      metalness: 0.08,
    });
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 36, 36), earthMat);
    earthSpinGroup.add(earthMesh);

    const atmoMesh = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius + 1.8, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
      })
    );
    earthSpinGroup.add(atmoMesh);
    earthTiltPivot.add(earthSpinGroup);

    // Golden Polar Axis Rod (North Celestial Pole to South Celestial Pole)
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd99b26,
      metalness: 0.84,
      roughness: 0.24,
    });
    const poleRod = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 365, 12), brassMat);
    earthTiltPivot.add(poleRod);

    const northPoleCap = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8, 12), brassMat);
    northPoleCap.position.y = 184;
    earthTiltPivot.add(northPoleCap);

    const southPoleCap = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8, 12), brassMat);
    southPoleCap.position.y = -184;
    southPoleCap.rotation.x = Math.PI;
    earthTiltPivot.add(southPoleCap);

    const northPoleLabel = createTextSprite(
      currentLang === 'kn' ? 'ಉತ್ತರ ಧ್ರುವ (NCP)' : 'North Pole (NCP)',
      '#7dd3fc',
      20,
      'rgba(10, 18, 36, 0.88)',
      34,
      9.5,
      maxAniso
    );
    northPoleLabel.position.set(0, 196, 0);
    earthTiltPivot.add(northPoleLabel);

    const southPoleLabel = createTextSprite(
      currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಧ್ರುವ (SCP)' : 'South Pole (SCP)',
      '#c4b5fd',
      20,
      'rgba(10, 18, 36, 0.88)',
      34,
      9.5,
      maxAniso
    );
    southPoleLabel.position.set(0, -196, 0);
    earthTiltPivot.add(southPoleLabel);

    scene.add(earthTiltPivot);

    // 7. Full All-Sides Golden Armillary Sphere Cage (Meridian, Prime Vertical, Celestial Equator)
    if (showArmillary) {
      const armillaryGroup = new THREE.Group();

      // Celestial Equator tilted at 23.44° (High-Contrast Neon Yellow-Gold)
      const eqTorus = new THREE.Mesh(
        new THREE.TorusGeometry(182, 1.2, 12, 96),
        new THREE.MeshStandardMaterial({
          color: 0xffea00,
          emissive: 0xfacc15,
          emissiveIntensity: 0.72,
          metalness: 0.25,
          roughness: 0.2,
          transparent: true,
          opacity: 0.92,
        })
      );
      eqTorus.rotation.x = Math.PI / 2;
      eqTorus.rotation.y = THREE.MathUtils.degToRad(23.44);
      armillaryGroup.add(eqTorus);

      // Vertical Meridian Ring (High-Contrast Radiant Gold Arch)
      const meridianTorus = new THREE.Mesh(
        new THREE.TorusGeometry(182, 1.1, 12, 96),
        new THREE.MeshStandardMaterial({
          color: 0xfde047,
          emissive: 0xeab308,
          emissiveIntensity: 0.65,
          metalness: 0.35,
          roughness: 0.22,
          transparent: true,
          opacity: 0.85,
        })
      );
      armillaryGroup.add(meridianTorus);

      // Prime Vertical Ring (High-Contrast Warm Gold Arch)
      const primeTorus = new THREE.Mesh(
        new THREE.TorusGeometry(182, 1.1, 12, 96),
        new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xca8a04,
          emissiveIntensity: 0.6,
          metalness: 0.35,
          roughness: 0.22,
          transparent: true,
          opacity: 0.85,
        })
      );
      primeTorus.rotation.y = Math.PI / 2;
      armillaryGroup.add(primeTorus);

      // Outer 3D Celestial Sphere Wireframe Cage (High-Contrast Luminous Gold)
      const cageMesh = new THREE.Mesh(
        new THREE.SphereGeometry(225, 24, 16),
        new THREE.MeshBasicMaterial({
          color: 0xfacc15,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        })
      );
      armillaryGroup.add(cageMesh);

      scene.add(armillaryGroup);
    }

    // 8. Cardinal Horizon Compass & Concentric Planetary Orbital Paths (High-Contrast Neon Yellow)
    const orbitRadii = [54, 85, 119];
    orbitRadii.forEach((r) => {
      const ringTorus = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.42, 8, 96),
        new THREE.MeshBasicMaterial({
          color: 0xffea00,
          transparent: true,
          opacity: 0.78,
        })
      );
      ringTorus.rotation.x = Math.PI / 2;
      scene.add(ringTorus);
    });

    if (showDirections) {
      const dirR = 232;
      const dirs: Array<{ label: string; color: string; x: number; z: number }> = [
        { label: currentLang === 'kn' ? 'E • ಪೂರ್ವ (East)' : 'E • East (Rising)', color: '#fde047', x: dirR, z: 0 },
        { label: currentLang === 'kn' ? 'W • ಪಶ್ಚಿಮ (West)' : 'W • West (Setting)', color: '#fb7185', x: -dirR, z: 0 },
        { label: currentLang === 'kn' ? 'N • ಉತ್ತರ (North)' : 'N • North', color: '#fef08a', x: 0, z: -dirR },
        { label: currentLang === 'kn' ? 'S • ದಕ್ಷಿಣ (South)' : 'S • South', color: '#34d399', x: 0, z: dirR },
      ];
      dirs.forEach((d) => {
        const sp = createTextSprite(d.label, d.color, 21, 'rgba(9, 13, 26, 0.92)', 38, 10.5, maxAniso);
        sp.position.set(d.x, 4, d.z);
        scene.add(sp);
      });

      const axisLineMat = new THREE.LineDashedMaterial({
        color: 0xfef08a,
        dashSize: 5,
        gapSize: 4,
        transparent: true,
        opacity: 0.82,
      });
      const ewGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-212, 0, 0),
        new THREE.Vector3(212, 0, 0),
      ]);
      const ewLine = new THREE.Line(ewGeo, axisLineMat);
      ewLine.computeLineDistances();
      scene.add(ewLine);

      const nsGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -212),
        new THREE.Vector3(0, 0, 212),
      ]);
      const nsLine = new THREE.Line(nsGeo, axisLineMat);
      nsLine.computeLineDistances();
      scene.add(nsLine);
    }

    // 9. Golden Ecliptic Zodiac Belt (12 Interactive Rashis) + Lagna Beacon
    const interactableObjects: THREE.Object3D[] = [];
    const rashiInnerR = 140;
    const rashiOuterR = 166;
    const rashiMidR = (rashiInnerR + rashiOuterR) / 2;

    // Metallic brass ecliptic rims (inner + outer)
    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(rashiInnerR, 1.1, 12, 96), brassMat);
    innerRim.rotation.x = Math.PI / 2;
    scene.add(innerRim);

    const outerRim = new THREE.Mesh(new THREE.TorusGeometry(rashiOuterR, 1.25, 12, 96), brassMat);
    outerRim.rotation.x = Math.PI / 2;
    scene.add(outerRim);

    const elementTints = [0xc2410c, 0x15803d, 0xd97706, 0x9333ea]; // Bright Fire, Earth, Air-Gold, Water-Violet

    RASHIS.forEach((rashi, idx) => {
      const startDeg = idx * 30;
      const midDeg = startDeg + 15;
      const midRad = ((midDeg - 90) * Math.PI) / 180;

      // Translucent colored Rashi arc plate (double-sided for top & underside visibility!)
      const startRad = ((startDeg - 90) * Math.PI) / 180;
      const arcGeo = new THREE.RingGeometry(rashiInnerR + 0.8, rashiOuterR - 0.8, 12, 1, -startRad - Math.PI / 6, Math.PI / 6);
      const arcMat = new THREE.MeshStandardMaterial({
        color: elementTints[idx % 4],
        roughness: 0.42,
        metalness: 0.2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.rotation.x = Math.PI / 2;
      arcMesh.userData = {
        type: 'rashi',
        index: idx,
        data: rashi,
        label: `${rashi[currentLang]} (${startDeg}°–${startDeg + 30}°)`,
        focusTarget: new THREE.Vector3(rashiMidR * Math.cos(midRad), 6, rashiMidR * Math.sin(midRad)),
      };
      scene.add(arcMesh);
      interactableObjects.push(arcMesh);

      // Rashi Label Sprite
      const rashiText = currentLang === 'kn' ? `${idx + 1}. ${rashi.kn}` : currentLang === 'hi' ? `${idx + 1}. ${rashi.hi}` : `${idx + 1}. ${rashi.en}`;
      const rSprite = createTextSprite(rashiText, '#fde047', 21, 'rgba(15, 23, 42, 0.86)', 34, 9.5, maxAniso);
      rSprite.position.set(rashiMidR * Math.cos(midRad), 6, rashiMidR * Math.sin(midRad));
      rSprite.userData = arcMesh.userData;
      scene.add(rSprite);
      interactableObjects.push(rSprite);

      // Radial 30° divider spoke (High-Contrast Neon Yellow-Gold)
      const divGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(rashiInnerR * Math.cos(startRad), 0, rashiInnerR * Math.sin(startRad)),
        new THREE.Vector3(rashiOuterR * Math.cos(startRad), 0, rashiOuterR * Math.sin(startRad)),
      ]);
      scene.add(
        new THREE.Line(
          divGeo,
          new THREE.LineBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0.9 })
        )
      );

      // 3D Rashi Constellation Stars plotted above/around each 30° zodiac sector
      if (showConstellations && showZodiacFigures) {
        const rc = RASHI_CONSTELLATIONS[idx];
        if (rc) {
          const figGroup = new THREE.Group();
          const figR = 198;
          // Alternate gentle 3D elevation so constellations wrap naturally across upper & lower hemispheres
          const elevY = idx % 2 === 0 ? 28 : -24;
          figGroup.position.set(figR * Math.cos(midRad), elevY, figR * Math.sin(midRad));
          figGroup.lookAt(0, elevY * 0.4, 0);

          const starPts: THREE.Vector3[] = [];
          rc.stars.forEach((st) => {
            const lx = (st.x / 45) * 20;
            const ly = (-st.y / 35) * 14;
            const lz = (st.mag < 1.8 ? 2.2 : 0) + Math.sin(st.x * 0.15) * 1.4;
            const pt = new THREE.Vector3(lx, ly, lz);
            starPts.push(pt);

            const stRadius = st.mag < 1.5 ? 2.0 : st.mag < 2.6 ? 1.4 : 0.95;
            const stMesh = new THREE.Mesh(
              new THREE.SphereGeometry(stRadius, 10, 10),
              new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color || '#fef08a') })
            );
            stMesh.position.copy(pt);
            stMesh.userData = arcMesh.userData;
            figGroup.add(stMesh);
            interactableObjects.push(stMesh);
          });

          const segPts: THREE.Vector3[] = [];
          rc.lines.forEach(([a, b]) => {
            if (starPts[a] && starPts[b]) {
              segPts.push(starPts[a], starPts[b]);
            }
          });
          if (segPts.length > 0) {
            const cGeo = new THREE.BufferGeometry().setFromPoints(segPts);
            const cMat = new THREE.LineBasicMaterial({
              color: 0xffea00,
              transparent: true,
              opacity: 0.95,
            });
            figGroup.add(new THREE.LineSegments(cGeo, cMat));
          }

          // Vertical tie-line connecting 3D Rashi constellation down to its Ecliptic Rashi plate
          const tieGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(rashiOuterR * Math.cos(midRad), 0, rashiOuterR * Math.sin(midRad)),
            new THREE.Vector3(figR * Math.cos(midRad), elevY, figR * Math.sin(midRad)),
          ]);
          const tieLine = new THREE.Line(
            tieGeo,
            new THREE.LineDashedMaterial({
              color: 0xfde047,
              dashSize: 3,
              gapSize: 3,
              transparent: true,
              opacity: 0.72,
            })
          );
          tieLine.computeLineDistances();
          scene.add(tieLine);

          scene.add(figGroup);
        }
      }
    });

    // Lagna (Ascendant) Glowing Golden Beacon on the Ecliptic
    const lagnaRad = ((lagnaAbsLong - 90) * Math.PI) / 180;
    const lagnaBeaconGroup = new THREE.Group();
    const lagnaX = rashiInnerR * Math.cos(lagnaRad);
    const lagnaZ = rashiInnerR * Math.sin(lagnaRad);
    const lagnaGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(4.5, 0),
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.5,
      })
    );
    lagnaGem.position.set(lagnaX, 7, lagnaZ);
    lagnaBeaconGroup.add(lagnaGem);

    const lagnaRayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(earthRadius * Math.cos(lagnaRad), 0, earthRadius * Math.sin(lagnaRad)),
      new THREE.Vector3(rashiOuterR * Math.cos(lagnaRad), 0, rashiOuterR * Math.sin(lagnaRad)),
    ]);
    lagnaBeaconGroup.add(
      new THREE.Line(
        lagnaRayGeo,
        new THREE.LineBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.9 })
      )
    );

    const lagnaSprite = createTextSprite(
      `${currentLang === 'kn' ? 'ಲಗ್ನ' : 'LAGNA'} ${kundaliData.houses[0].rashiName[currentLang]}`,
      '#fda4af',
      20,
      'rgba(136, 19, 55, 0.92)',
      38,
      10,
      maxAniso
    );
    lagnaSprite.position.set(lagnaX * 0.94, 19, lagnaZ * 0.94);
    lagnaBeaconGroup.add(lagnaSprite);
    scene.add(lagnaBeaconGroup);

    // 10. 108 Nakshatra Padas (3°20' increments)
    if (showPadas) {
      const padaR = rashiOuterR + 1.5;
      const majorPts: THREE.Vector3[] = [];
      const minorPts: THREE.Vector3[] = [];
      for (let p = 0; p < 108; p++) {
        const pDeg = p * (360 / 108);
        const pRad = ((pDeg - 90) * Math.PI) / 180;
        const isMajor = p % 4 === 0;
        const len = isMajor ? 7.5 : 3.6;
        const a = new THREE.Vector3(padaR * Math.cos(pRad), 0, padaR * Math.sin(pRad));
        const b = new THREE.Vector3((padaR + len) * Math.cos(pRad), 0, (padaR + len) * Math.sin(pRad));
        if (isMajor) {
          majorPts.push(a, b);
        } else {
          minorPts.push(a, b);
        }
      }
      scene.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(majorPts),
          new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 })
        )
      );
      scene.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(minorPts),
          new THREE.LineBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.72 })
        )
      );
    }

    // 11. 27 Nakshatras Outer Ring with Star Clusters
    const nakRadius = 186;
    NAKSHATRA_SKY_PATTERNS.forEach((nak) => {
      const midDeg = (nak.spanStartDeg + nak.spanEndDeg) / 2;
      const rad = ((midDeg - 90) * Math.PI) / 180;
      const nx = nakRadius * Math.cos(rad);
      const nz = nakRadius * Math.sin(rad);

      const nakName = currentLang === 'kn' ? nak.nameKn : currentLang === 'hi' ? nak.nameHi : nak.nameEn;
      const nakSprite = createTextSprite(nakName, '#7dd3fc', 19, 'rgba(8, 18, 36, 0.78)', 28, 8.2, maxAniso);
      nakSprite.position.set(nx, -2, nz);
      nakSprite.userData = {
        type: 'nakshatra',
        index: nak.index,
        data: nak,
        label: `${nakName} (${nak.principalStar})`,
        focusTarget: new THREE.Vector3(nx, 2, nz),
      };
      scene.add(nakSprite);
      interactableObjects.push(nakSprite);

      if (showConstellations) {
        const clusterGroup = new THREE.Group();
        clusterGroup.position.set(nx * 0.96, 7.5, nz * 0.96);
        clusterGroup.lookAt(0, 7.5, 0);

        const starMatLocal = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
        nak.stars.forEach(([sx, sy], sIdx) => {
          const sMesh = new THREE.Mesh(new THREE.SphereGeometry(sIdx === 0 ? 1.3 : 0.85, 8, 8), starMatLocal);
          sMesh.position.set(sx * 0.75, sy * 0.55, 0);
          sMesh.userData = nakSprite.userData;
          clusterGroup.add(sMesh);
          interactableObjects.push(sMesh);
        });

        const linePts: THREE.Vector3[] = [];
        nak.lines.forEach(([iA, iB]) => {
          const ptA = nak.stars[iA];
          const ptB = nak.stars[iB];
          if (ptA && ptB) {
            linePts.push(
              new THREE.Vector3(ptA[0] * 0.75, ptA[1] * 0.55, 0),
              new THREE.Vector3(ptB[0] * 0.75, ptB[1] * 0.55, 0)
            );
          }
        });
        if (linePts.length > 0) {
          clusterGroup.add(
            new THREE.LineSegments(
              new THREE.BufferGeometry().setFromPoints(linePts),
              new THREE.LineBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.88 })
            )
          );
        }
        scene.add(clusterGroup);
      }
    });

    // 12. 9 Composite 3D Grahas with Orbital Drop-Stems, Sightlines & Non-Overlapping Labels
    const animatedPlanets: Array<{ mesh: THREE.Object3D; speed: number }> = [];

    placedPlanets3D.forEach((planet) => {
      const rad = ((planet.absLong - 90) * Math.PI) / 180;
      const px = planet.orbitR * Math.cos(rad);
      const pz = planet.orbitR * Math.sin(rad);
      const py = planet.yOffset;

      const pGroup = new THREE.Group();
      pGroup.position.set(px, py, pz);

      const pMat = new THREE.MeshStandardMaterial({
        color: planet.def.color,
        emissive: planet.def.emissive,
        emissiveIntensity: planet.name === 'Sun' ? 0.95 : 0.35,
        roughness: planet.name === 'Sun' ? 0.2 : 0.34,
        metalness: planet.name === 'Sun' ? 0.05 : 0.28,
      });
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(planet.def.radius, 24, 24), pMat);
      pMesh.userData = {
        type: 'planet',
        name: planet.name,
        data: planet,
        label: `${planet.sanskritName[currentLang]} • ${planet.rashiName[currentLang]} ${planet.formattedDeg} (H#${planet.bhava})`,
        focusTarget: new THREE.Vector3(px, py, pz),
      };
      pGroup.add(pMesh);
      interactableObjects.push(pMesh);

      // Sun golden corona halo
      if (planet.name === 'Sun') {
        const corona = new THREE.Mesh(
          new THREE.SphereGeometry(planet.def.radius + 3.2, 20, 20),
          new THREE.MeshBasicMaterial({
            color: 0xfde047,
            transparent: true,
            opacity: 0.24,
            side: THREE.BackSide,
          })
        );
        pGroup.add(corona);
      }

      // Saturn multi-band tilted 3D rings
      if (planet.def.hasRings) {
        const ring1 = new THREE.Mesh(
          new THREE.RingGeometry(planet.def.radius + 2.4, planet.def.radius + 6.2, 36),
          new THREE.MeshStandardMaterial({
            color: 0xfef08a,
            roughness: 0.4,
            metalness: 0.4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.78,
          })
        );
        ring1.rotation.x = Math.PI / 2.6;
        ring1.rotation.y = Math.PI / 6;
        pGroup.add(ring1);

        const ring2 = new THREE.Mesh(
          new THREE.RingGeometry(planet.def.radius + 6.8, planet.def.radius + 9.4, 36),
          new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.5,
            metalness: 0.3,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.52,
          })
        );
        ring2.rotation.x = Math.PI / 2.6;
        ring2.rotation.y = Math.PI / 6;
        pGroup.add(ring2);
      }

      scene.add(pGroup);
      animatedPlanets.push({ mesh: pGroup, speed: planet.name === 'Sun' ? 0.008 : 0.005 });

      // Vertical Drop-Stem down to the Ecliptic Plane (High-Contrast Gold)
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(px, py, pz),
        new THREE.Vector3(px, 0, pz),
      ]);
      scene.add(
        new THREE.Line(
          stemGeo,
          new THREE.LineBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.85 })
        )
      );
      const footDot = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffea00 })
      );
      footDot.position.set(px, 0, pz);
      scene.add(footDot);

      // True Sidereal Sightline Ray (Earth → Ecliptic Projection → Rashi Inner Edge, High-Contrast Neon Gold)
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(earthRadius * Math.cos(rad), 0, earthRadius * Math.sin(rad)),
        new THREE.Vector3(rashiInnerR * Math.cos(rad), 0, rashiInnerR * Math.sin(rad)),
      ]);
      const rayLine = new THREE.Line(
        rayGeo,
        new THREE.LineDashedMaterial({
          color: 0xfde047,
          dashSize: 4,
          gapSize: 3,
          transparent: true,
          opacity: 0.65,
        })
      );
      rayLine.computeLineDistances();
      scene.add(rayLine);

      // Floating Non-Overlapping Planet Name & Degree Label
      const pLabelText = `${planet.sanskritName[currentLang]}${planet.isRetrograde ? ' [R]' : ''} ${planet.formattedDeg}`;
      const pSprite = createTextSprite(pLabelText, '#ffffff', 20, 'rgba(9, 13, 26, 0.88)', 33, 9.2, maxAniso);
      pSprite.position.set(px, py + (py >= 0 ? planet.def.radius + 9.5 : -(planet.def.radius + 9.5)), pz);
      pSprite.userData = pMesh.userData;
      scene.add(pSprite);
      interactableObjects.push(pSprite);
    });

    // 13. Pointer Raycasting (Click vs Drag distinction + Hover readout)
    const raycaster = new THREE.Raycaster();
    let pointerDownX = 0;
    let pointerDownY = 0;

    const getHitObject = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactableObjects, false);
      for (const hit of hits) {
        if (hit.object.userData?.type) {
          return hit.object;
        }
      }
      return null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (moved > 6) return;
      const obj = getHitObject(e.clientX, e.clientY);
      if (obj && obj.userData?.type) {
        const ud = obj.userData;
        if (ud.focusTarget instanceof THREE.Vector3) {
          _focusPos.copy(ud.focusTarget);
          const dir = _focusPos.clone().normalize();
          if (dir.lengthSq() < 0.001) dir.set(0, 0.4, 1).normalize();
          cameraGoalRef.current.target.copy(_focusPos);
          cameraGoalRef.current.pos
            .copy(_focusPos)
            .addScaledVector(dir, 105)
            .add(new THREE.Vector3(0, 52, 0));
          cameraGoalRef.current.active = true;
        }
        onSelectItemRef.current({
          type: ud.type,
          index: ud.index,
          name: ud.name,
          data: ud.data,
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const obj = getHitObject(e.clientX, e.clientY);
      renderer.domElement.style.cursor = obj ? 'pointer' : 'grab';
      setHoveredLabel(obj?.userData?.label || null);
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 14. ResizeObserver for responsive container sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 300);
        const h = Math.max(entry.contentRect.height, 300);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(mount);

    // 15. Animation Loop (Software-GL safe pacing + smooth damped camera presets)
    let disposed = false;
    let rafId = 0;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      if (isSoftwareGl) {
        rafId = requestAnimationFrame(() => {
          if (!disposed) rafId = requestAnimationFrame(cb);
        });
      } else {
        rafId = requestAnimationFrame(cb);
      }
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Spin Earth & subtle planet spin
      earthSpinGroup.rotation.y += dt * 0.25;
      lagnaGem.rotation.y += dt * 1.1;
      for (const item of animatedPlanets) {
        item.mesh.rotation.y += item.speed;
      }

      // Smooth damped camera preset / click-focus glide
      if (cameraGoalRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraGoalRef.current.pos.x, 5.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraGoalRef.current.pos.y, 5.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraGoalRef.current.pos.z, 5.5, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, cameraGoalRef.current.target.x, 5.5, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, cameraGoalRef.current.target.y, 5.5, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, cameraGoalRef.current.target.z, 5.5, dt);

        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 1.2 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.8
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.autoRotate = isAutoOrbitRef.current && !cameraGoalRef.current.active;
      controls.autoRotateSpeed = 0.55;
      controls.update();

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    rafId = requestAnimationFrame(tick);

    // 16. Complete GPU Disposal on unmount or dependency rebuild
    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlsStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);

      scene.traverse((obj) => {
        const meshLike = obj as THREE.Mesh;
        if (meshLike.geometry) {
          meshLike.geometry.dispose();
        }
        const mat = meshLike.material as THREE.Material | THREE.Material[] | undefined;
        if (mat) {
          const mats = Array.isArray(mat) ? mat : [mat];
          mats.forEach((m) => {
            const anyM = m as unknown as Record<string, unknown>;
            if (anyM.map instanceof THREE.Texture) anyM.map.dispose();
            m.dispose();
          });
        }
      });

      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [
    placedPlanets3D,
    lagnaAbsLong,
    kundaliData.houses,
    showConstellations,
    showPadas,
    showDirections,
    showArmillary,
    showZodiacFigures,
    currentLang,
  ]);

  return (
    <div className="space-y-3 select-none">
      {/* Unobstructed Full-View 3D Visual Animation Window (Zero Floating Overlays Inside) */}
      <div className="relative w-full h-[500px] sm:h-[620px] rounded-2xl overflow-hidden bg-[#040712] border-2 border-amber-400/55 shadow-inner">
        <div ref={canvasMountRef} className="w-full h-full touch-none" />
      </div>

      {/* External Control Bar Placed Cleanly Below the 3D Visual Window */}
      <div className="w-full rounded-2xl bg-[#090d1a] border border-amber-500/45 shadow-xl px-3.5 py-2.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-amber-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {currentLang === 'kn'
                  ? '೩೬೦° ಸರ್ವದಿಕ್ಕು ೩D ಖಗೋಳ ನಿಯಂತ್ರಣಗಳು (Drag • Zoom • Click)'
                  : 'All-Sides 360° Celestial Armillary Controls • Drag Any Side, Zoom & Click'}
              </span>
            </span>

            {hoveredLabel && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/60 text-amber-200 text-[10.5px]">
                {hoveredLabel} • {currentLang === 'kn' ? 'ವಿವರಕ್ಕಾಗಿ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click to inspect'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setDockExpanded(!dockExpanded)}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer border border-stone-600"
          >
            <span>{dockExpanded ? (currentLang === 'kn' ? 'ಕಿರಿದುಗೊಳಿಸಿ' : 'Minimize') : (currentLang === 'kn' ? 'ನಿಯಂತ್ರಣಗಳು' : 'Controls')}</span>
            {dockExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {dockExpanded && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-800">
            {/* All-Sides Camera View Presets */}
            {(
              [
                { id: 'iso', en: '3D Isometric', kn: '೩D ನೋಟ' },
                { id: 'top', en: 'Top 360°', kn: 'ಮೇಲಿನ ನೋಟ' },
                { id: 'side', en: 'Side Ecliptic', kn: 'ಪಾರ್ಶ್ವ ನೋಟ' },
                { id: 'under', en: 'Under / South Pole', kn: 'ಕೆಳಗಿನ / ದಕ್ಷಿಣ ಧ್ರುವ' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => triggerPreset(preset.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                  activePreset === preset.id
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-stone-900 text-stone-200 border-stone-700 hover:bg-stone-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? preset.kn : preset.en}</span>
              </button>
            ))}

            <span className="h-4 w-px bg-stone-700 mx-0.5 hidden sm:inline-block" />

            {/* Toggles */}
            <button
              type="button"
              onClick={() => setIsAutoOrbit(!isAutoOrbit)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                isAutoOrbit
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-900 text-stone-400 border-stone-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isAutoOrbit ? (currentLang === 'kn' ? 'ಸ್ವಯಂ ತಿರುಗುವಿಕೆ: ON' : 'Auto-Orbit: ON') : (currentLang === 'kn' ? 'ತಿರುಗುವಿಕೆ: OFF' : 'Auto-Orbit: OFF')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowArmillary(!showArmillary)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                showArmillary
                  ? 'bg-amber-500/25 text-amber-200 border-amber-400/70'
                  : 'bg-stone-900 text-stone-400 border-stone-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಖಗೋಳ ವೃತ್ತಗಳು' : 'Armillary'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowZodiacFigures(!showZodiacFigures)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                showZodiacFigures
                  ? 'bg-amber-600/30 text-amber-200 border-amber-400/60'
                  : 'bg-stone-900 text-stone-400 border-stone-700'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ರಾಶಿ ತಾರಾ ಪುಂಜ' : 'Rashi Stars'}</span>
            </button>

            <button
              type="button"
              onClick={() => triggerPreset('iso')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer flex items-center gap-1"
              title="Reset 3D Camera View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
