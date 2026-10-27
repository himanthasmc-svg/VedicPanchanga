import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { KundaliData, Language } from '../types';
import { RASHIS } from '../utils/panchanga';
import { NAKSHATRA_SKY_PATTERNS } from './CelestialSkyMandala3D';

interface ThreeNightSky3DProps {
  currentLang: Language;
  kundaliData: KundaliData;
  showConstellations: boolean;
  showPadas: boolean;
  showDirections: boolean;
  onSelectItem: (item: { type: 'planet' | 'rashi' | 'nakshatra'; data: any }) => void;
}

export const ThreeNightSky3D: React.FC<ThreeNightSky3DProps> = ({
  currentLang,
  kundaliData,
  showConstellations,
  showPadas,
  showDirections,
  onSelectItem
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Compute absolute ecliptic longitudes (0° to 360°) for each Graha
  const planetLongitudes = React.useMemo(() => {
    return kundaliData.planets.map(planet => {
      const absLong = (planet.rashiIndex * 30 + planet.degrees) % 360;
      const degPart = Math.floor(planet.degrees);
      const minPart = Math.floor((planet.degrees - degPart) * 60);
      return {
        ...planet,
        absLong,
        degPart,
        minPart,
        formattedDeg: `${degPart}° ${minPart}'`
      };
    });
  }, [kundaliData.planets]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050711);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 180, 360);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff3cc, 2.5, 1200);
    sunLight.position.set(0, 50, 0);
    scene.add(sunLight);

    // 4. Background Starfield (1,200 particle stars)
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 600 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = radius * Math.cos(phi);

      const colorType = Math.random();
      if (colorType > 0.8) {
        // Warm blue-white
        starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0;
      } else if (colorType > 0.5) {
        // Pure white
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      } else if (colorType > 0.25) {
        // Amber gold
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.5;
      } else {
        // Crimson red
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.5; starColors[i * 3 + 2] = 0.5;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);

    // 5. Central 3D Earth Globe
    const earthGroup = new THREE.Group();
    const earthRadius = 18;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 32, 32);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25,
      specular: 0x38bdf8,
      shininess: 40
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth wireframe lat/long
    const earthWireGeo = new THREE.SphereGeometry(earthRadius + 0.2, 16, 16);
    const earthWireMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    earthGroup.add(new THREE.Mesh(earthWireGeo, earthWireMat));

    // Earth Atmosphere Glow ring
    const atmosphereGeo = new THREE.RingGeometry(earthRadius + 0.5, earthRadius + 5, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereMesh.rotation.x = Math.PI / 2;
    earthGroup.add(atmosphereMesh);

    scene.add(earthGroup);

    // Helper to create text billboard sprite
    const createTextSprite = (text: string, color: string, fontSize = 28, bgColor?: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 256, 80);
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.roundRect(10, 10, 236, 60, 12);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 40);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(30, 9.5, 1);
      return sprite;
    };

    // 6. Cardinal Directions (North, South, East, West) with 3D Beacons
    const directionGroup = new THREE.Group();
    const dirDistance = 160;

    if (showDirections) {
      // East (E / ಪೂರ್ವ - 1st House Lagna Rising Horizon at Right +X)
      const eastSprite = createTextSprite('E (East • ಪೂರ್ವ)', '#fbbf24', 24, 'rgba(15, 23, 42, 0.85)');
      eastSprite.position.set(dirDistance + 12, 4, 0);
      directionGroup.add(eastSprite);

      // West (W / ಪಶ್ಚಿಮ - 7th House Setting Horizon at Left -X)
      const westSprite = createTextSprite('W (West • ಪಶ್ಚಿಮ)', '#f87171', 24, 'rgba(15, 23, 42, 0.85)');
      westSprite.position.set(-dirDistance - 12, 4, 0);
      directionGroup.add(westSprite);

      // North (N / ಉತ್ತರ - 4th House Nadir at -Z)
      const northSprite = createTextSprite('N (North • ಉತ್ತರ)', '#38bdf8', 24, 'rgba(15, 23, 42, 0.85)');
      northSprite.position.set(0, 4, -dirDistance - 12);
      directionGroup.add(northSprite);

      // South (S / ದಕ್ಷಿಣ - 10th House Zenith at +Z)
      const southSprite = createTextSprite('S (South • ದಕ್ಷಿಣ)', '#34d399', 24, 'rgba(15, 23, 42, 0.85)');
      southSprite.position.set(0, 4, dirDistance + 12);
      directionGroup.add(southSprite);

      // Crosshairs Lines connecting Cardinal Directions
      const lineMat = new THREE.LineDashedMaterial({
        color: 0x94a3b8,
        dashSize: 4,
        gapSize: 3,
        transparent: true,
        opacity: 0.35
      });

      const eastWestGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-dirDistance, 0, 0),
        new THREE.Vector3(dirDistance, 0, 0)
      ]);
      const eastWestLine = new THREE.Line(eastWestGeo, lineMat);
      eastWestLine.computeLineDistances();
      directionGroup.add(eastWestLine);

      const northSouthGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -dirDistance),
        new THREE.Vector3(0, 0, dirDistance)
      ]);
      const northSouthLine = new THREE.Line(northSouthGeo, lineMat);
      northSouthLine.computeLineDistances();
      directionGroup.add(northSouthLine);
    }
    scene.add(directionGroup);

    // 7. Concentric Orbit Reference Rings
    const orbitRadii = [60, 95, 135];
    orbitRadii.forEach(r => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let a = 0; a <= 360; a += 5) {
        const rad = (a * Math.PI) / 180;
        points.push(new THREE.Vector3(r * Math.cos(rad), 0, r * Math.sin(rad)));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 3,
        gapSize: 2,
        transparent: true,
        opacity: 0.2
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.computeLineDistances();
      scene.add(ringLine);
    });

    // 8. 12 Rashis Golden Ecliptic Belt
    const rashiGroup = new THREE.Group();
    const rashiRadius = 145;

    // Ecliptic circle ring
    const eclipticGeo = new THREE.RingGeometry(rashiRadius - 10, rashiRadius + 10, 64);
    const eclipticMat = new THREE.MeshBasicMaterial({
      color: 0xb45309,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const eclipticMesh = new THREE.Mesh(eclipticGeo, eclipticMat);
    eclipticMesh.rotation.x = Math.PI / 2;
    rashiGroup.add(eclipticMesh);

    // 12 Rashi labels & dividing radial ticks
    RASHIS.forEach((rashi, idx) => {
      const angleDeg = idx * 30 + 15;
      const rad = ((angleDeg - 90) * Math.PI) / 180;
      const x = rashiRadius * Math.cos(rad);
      const z = rashiRadius * Math.sin(rad);

      const label = currentLang === 'kn' ? rashi.kn : rashi.en;
      const rashiSprite = createTextSprite(label, '#fbbf24', 22);
      rashiSprite.position.set(x, 3, z);
      rashiSprite.userData = { type: 'rashi', data: rashi };
      rashiGroup.add(rashiSprite);

      // Radial divider line
      const divDeg = idx * 30;
      const divRad = ((divDeg - 90) * Math.PI) / 180;
      const divGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3((rashiRadius - 12) * Math.cos(divRad), 0, (rashiRadius - 12) * Math.sin(divRad)),
        new THREE.Vector3((rashiRadius + 12) * Math.cos(divRad), 0, (rashiRadius + 12) * Math.sin(divRad))
      ]);
      const divLine = new THREE.Line(divGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 }));
      rashiGroup.add(divLine);
    });
    scene.add(rashiGroup);

    // 9. 108 Nakshatra Padas (3°20' increments)
    if (showPadas) {
      const padaGroup = new THREE.Group();
      const padaR = rashiRadius + 12;

      for (let p = 0; p < 108; p++) {
        const pDeg = p * (360 / 108);
        const pRad = ((pDeg - 90) * Math.PI) / 180;
        const isMajor = p % 4 === 0;
        const len = isMajor ? 5 : 2.5;

        const pGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(padaR * Math.cos(pRad), 0, padaR * Math.sin(pRad)),
          new THREE.Vector3((padaR + len) * Math.cos(pRad), 0, (padaR + len) * Math.sin(pRad))
        ]);
        const pLine = new THREE.Line(pGeo, new THREE.LineBasicMaterial({
          color: isMajor ? 0xf59e0b : 0x94a3b8,
          transparent: true,
          opacity: isMajor ? 0.7 : 0.3
        }));
        padaGroup.add(pLine);
      }
      scene.add(padaGroup);
    }

    // 10. 27 Nakshatras Outer Ring with Star Constellations
    const nakshatraGroup = new THREE.Group();
    const nakshatraRadius = 185;

    NAKSHATRA_SKY_PATTERNS.forEach((nak) => {
      const midDeg = (nak.spanStartDeg + nak.spanEndDeg) / 2;
      const rad = ((midDeg - 90) * Math.PI) / 180;
      const nx = nakshatraRadius * Math.cos(rad);
      const nz = nakshatraRadius * Math.sin(rad);

      // Nakshatra text label sprite
      const nakName = currentLang === 'kn' ? nak.nameKn : nak.nameEn;
      const nakSprite = createTextSprite(nakName, '#7dd3fc', 18);
      nakSprite.position.set(nx, 2, nz);
      nakSprite.userData = { type: 'nakshatra', data: nak };
      nakshatraGroup.add(nakSprite);

      // 3D Star Constellation Cluster
      if (showConstellations) {
        const clusterGroup = new THREE.Group();
        clusterGroup.position.set(nx * 0.9, 5, nz * 0.9);

        // Individual star dots
        const starMeshMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        nak.stars.forEach(([sx, sy], sIdx) => {
          const sGeo = new THREE.SphereGeometry(sIdx === 0 ? 1.4 : 0.9, 8, 8);
          const sMesh = new THREE.Mesh(sGeo, starMeshMat);
          sMesh.position.set(sx * 0.8, sy * 0.4, 0);
          clusterGroup.add(sMesh);
        });

        // Connecting constellation lines
        const linePoints: THREE.Vector3[] = [];
        nak.lines.forEach(([iA, iB]) => {
          const ptA = nak.stars[iA];
          const ptB = nak.stars[iB];
          if (ptA && ptB) {
            linePoints.push(
              new THREE.Vector3(ptA[0] * 0.8, ptA[1] * 0.4, 0),
              new THREE.Vector3(ptB[0] * 0.8, ptB[1] * 0.4, 0)
            );
          }
        });

        if (linePoints.length > 0) {
          const cLineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
          const cLineMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.45
          });
          const cLine = new THREE.LineSegments(cLineGeo, cLineMat);
          clusterGroup.add(cLine);
        }

        nakshatraGroup.add(clusterGroup);
      }
    });
    scene.add(nakshatraGroup);

    // 11. 9 Grahas Placed at Exact Ecliptic Longitudes in 3D
    const grahaGroup = new THREE.Group();
    const planetVisualDefs: Record<string, { color: number; radius: number; orbitR: number; hasRings?: boolean }> = {
      Sun: { color: 0xfbbf24, radius: 7.5, orbitR: 70 },
      Moon: { color: 0xf1f5f9, radius: 5.0, orbitR: 50 },
      Mars: { color: 0xef4444, radius: 5.5, orbitR: 85 },
      Mercury: { color: 0x34d399, radius: 4.5, orbitR: 60 },
      Jupiter: { color: 0xfb923c, radius: 8.0, orbitR: 110 },
      Venus: { color: 0xfde047, radius: 5.5, orbitR: 65 },
      Saturn: { color: 0xeab308, radius: 7.0, orbitR: 125, hasRings: true },
      Rahu: { color: 0x94a3b8, radius: 5.0, orbitR: 45 },
      Ketu: { color: 0xa855f7, radius: 5.0, orbitR: 45 }
    };

    const interactableObjects: THREE.Object3D[] = [];

    planetLongitudes.forEach((planet) => {
      const def = planetVisualDefs[planet.name] || { color: 0xffffff, radius: 5, orbitR: 75 };
      const rad = ((planet.absLong - 90) * Math.PI) / 180;
      const px = def.orbitR * Math.cos(rad);
      const pz = def.orbitR * Math.sin(rad);

      // Planet Sphere Mesh
      const pGeo = new THREE.SphereGeometry(def.radius, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.2
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(px, 3, pz);
      pMesh.userData = { type: 'planet', data: planet };
      grahaGroup.add(pMesh);
      interactableObjects.push(pMesh);

      // Saturn 3D Tilted Ring
      if (def.hasRings) {
        const ringGeo = new THREE.RingGeometry(def.radius + 3, def.radius + 9, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfde047,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(px, 3, pz);
        ringMesh.rotation.x = Math.PI / 3;
        ringMesh.rotation.y = Math.PI / 6;
        grahaGroup.add(ringMesh);
      }

      // Alignment ray connecting planet to central Earth
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(earthRadius * Math.cos(rad), 0, earthRadius * Math.sin(rad)),
        new THREE.Vector3(px, 3, pz)
      ]);
      const rayMat = new THREE.LineDashedMaterial({
        color: def.color,
        dashSize: 2,
        gapSize: 2,
        transparent: true,
        opacity: 0.4
      });
      const rayLine = new THREE.Line(rayGeo, rayMat);
      rayLine.computeLineDistances();
      grahaGroup.add(rayLine);

      // Floating Planet Label
      const pLabel = `${planet.sanskritName[currentLang]} ${planet.formattedDeg}`;
      const pSprite = createTextSprite(pLabel, '#ffffff', 20, 'rgba(15, 23, 42, 0.7)');
      pSprite.position.set(px, def.radius + 10, pz);
      pSprite.userData = { type: 'planet', data: planet };
      grahaGroup.add(pSprite);
      interactableObjects.push(pSprite);
    });
    scene.add(grahaGroup);

    // 12. Interactive Mouse Drag Orbit Controls & Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0;
    let sphericalPhi = Math.PI / 3;
    let cameraRadius = 380;

    const updateCameraPosition = () => {
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalPhi));
      camera.position.x = cameraRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      camera.position.y = cameraRadius * Math.cos(sphericalPhi);
      camera.position.z = cameraRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPosition();

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      sphericalTheta -= deltaX * 0.007;
      sphericalPhi -= deltaY * 0.007;
      updateCameraPosition();

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRadius += e.deltaY * 0.3;
      cameraRadius = Math.max(120, Math.min(800, cameraRadius));
      updateCameraPosition();
    };

    // Raycaster for clicking items
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...interactableObjects, ...rashiGroup.children, ...nakshatraGroup.children], true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          if (hit.object.userData?.type) {
            onSelectItem({
              type: hit.object.userData.type,
              data: hit.object.userData.data
            });
            break;
          }
        }
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // 13. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate Earth slowly
      earthGroup.rotation.y += 0.003;

      // Subtle celestial rotation if enabled and not actively dragging
      if (isRotating && !isDragging) {
        sphericalTheta += 0.001;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [kundaliData, showConstellations, showPadas, showDirections, currentLang, isRotating, onSelectItem]);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden bg-black cursor-grab active:cursor-grabbing border border-amber-500/40 shadow-inner">
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating 3D Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-xl border border-stone-700 text-xs">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            isRotating ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'
          }`}
          title="Toggle Auto Rotation"
        >
          {isRotating ? 'Auto-Rotate ON' : 'Rotate OFF'}
        </button>
      </div>

      {/* Floating Compass Tip */}
      <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-sky-500/40 text-[11px] text-stone-300 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Drag to rotate 3D sphere • Scroll to zoom • Click planet/star to inspect</span>
      </div>
    </div>
  );
};
