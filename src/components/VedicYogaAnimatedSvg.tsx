import React, { useState, useEffect } from 'react';
import { Sparkles, Wind, Flame, Sun, Moon, Play, Pause, RotateCcw, Heart, Shield, Activity, Compass } from 'lucide-react';
import { Language } from '../types';

export interface VedicYogaAnimatedSvgProps {
  currentLang: Language;
  selectedPlanet?: string;
  onSelectPlanet?: (planet: string) => void;
  activePose?: 'padmasana' | 'vrikshasana' | 'suryanamaskar' | 'bhujangasana' | 'balasana';
  onSelectPose?: (pose: 'padmasana' | 'vrikshasana' | 'suryanamaskar' | 'bhujangasana' | 'balasana') => void;
  isBreathingActive?: boolean;
}

interface ChakraInfo {
  id: string;
  name: { en: string; kn: string; hi: string };
  sanskrit: string;
  bija: string;
  color: string;
  glowColor: string;
  planet: string;
  cy: number; // Y position in SVG
  element: { en: string; kn: string; hi: string };
  balancingPose: { en: string; kn: string; hi: string };
}

const CHAKRAS: ChakraInfo[] = [
  {
    id: 'sahasrara',
    name: { en: 'Sahasrara (Crown)', kn: 'ಸಹಸ್ರಾರ ಚಕ್ರ', hi: 'सहस्रार चक्र' },
    sanskrit: 'सहस्रार',
    bija: 'ॐ (AUM)',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    planet: 'Jupiter',
    cy: 68,
    element: { en: 'Pure Cosmic Consciousness', kn: 'ಪರಬ್ರಹ್ಮ ಚೈತನ್ಯ', hi: 'परम चेतना' },
    balancingPose: { en: 'Shirshasana & Padmasana', kn: 'ಶೀರ್ಷಾಸನ ಮತ್ತು ಪದ್ಮಾಸನ', hi: 'शीर्षासन व पद्मासन' }
  },
  {
    id: 'ajna',
    name: { en: 'Ajna (Third Eye)', kn: 'ಆಜ್ಞಾ ಚಕ್ರ', hi: 'आज्ञा चक्र' },
    sanskrit: 'आज्ञा',
    bija: 'ॐ (OM)',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.8)',
    planet: 'Sun & Moon',
    cy: 104,
    element: { en: 'Mind & Intuitive Wisdom', kn: 'ಮನಸ್ಸು ಮತ್ತು ಜ್ಞಾನ', hi: 'मन व अंतर्ज्ञान' },
    balancingPose: { en: 'Balasana & Trataka', kn: 'ಬಾಲಾಸನ ಮತ್ತು ತ್ರಾಟಕ', hi: 'बालासन व त्राटक' }
  },
  {
    id: 'vishuddha',
    name: { en: 'Vishuddha (Throat)', kn: 'ವಿಶುದ್ಧ ಚಕ್ರ', hi: 'विशुद्ध चक्र' },
    sanskrit: 'विशुद्ध',
    bija: 'हं (HAM)',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    planet: 'Mercury',
    cy: 140,
    element: { en: 'Akasha (Ether / Space)', kn: 'ಆಕಾಶ ತತ್ತ್ವ', hi: 'आकाश तत्त्व' },
    balancingPose: { en: 'Sarvangasana & Matsyasana', kn: 'ಸರ್ವಾಂಗಾಸನ ಮತ್ತು ಮತ್ಸ್ಯಾಸನ', hi: 'सर्वांगासन व मत्स्यासन' }
  },
  {
    id: 'anahata',
    name: { en: 'Anahata (Heart)', kn: 'ಅನಾಹತ ಚಕ್ರ', hi: 'अनाहत चक्र' },
    sanskrit: 'अनाहत',
    bija: 'यं (YAM)',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    planet: 'Venus',
    cy: 180,
    element: { en: 'Vayu (Air)', kn: 'ವಾಯು ತತ್ತ್ವ', hi: 'वायु तत्त्व' },
    balancingPose: { en: 'Bhujangasana & Ustrasana', kn: 'ಭುಜಂಗಾಸನ ಮತ್ತು ಉಷ್ಟ್ರಾಸನ', hi: 'भुजंगासन व उष्ट्रासन' }
  },
  {
    id: 'manipura',
    name: { en: 'Manipura (Solar Plexus)', kn: 'ಮಣಿಪೂರ ಚಕ್ರ', hi: 'मणिपूर चक्र' },
    sanskrit: 'मणिपूर',
    bija: 'रां (RAM)',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.85)',
    planet: 'Sun & Mars',
    cy: 222,
    element: { en: 'Agni (Fire / Vitality)', kn: 'ಅಗ್ನಿ ತತ್ತ್ವ', hi: 'अग्नि तत्त्व' },
    balancingPose: { en: 'Surya Namaskar & Dhanurasana', kn: 'ಸೂರ್ಯ ನಮಸ್ಕಾರ ಮತ್ತು ಧನುರಾಸನ', hi: 'सूर्य नमस्कार व धनुरासन' }
  },
  {
    id: 'svadhisthana',
    name: { en: 'Svadhisthana (Sacral)', kn: 'ಸ್ವಾಧಿಷ್ಠಾನ ಚಕ್ರ', hi: 'स्वाधिष्ठान चक्र' },
    sanskrit: 'स्वाधिष्ठान',
    bija: 'वं (VAM)',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.8)',
    planet: 'Moon & Venus',
    cy: 260,
    element: { en: 'Jala (Water / Fluids)', kn: 'ಜಲ ತತ್ತ್ವ', hi: 'जल तत्त्व' },
    balancingPose: { en: 'Baddha Konasana & Bhujangasana', kn: 'ಬದ್ಧ ಕೋಣಾಸನ ಮತ್ತು ಭುಜಂಗಾಸನ', hi: 'बद्ध कोणासन' }
  },
  {
    id: 'muladhara',
    name: { en: 'Muladhara (Root)', kn: 'ಮೂಲಾಧಾರ ಚಕ್ರ', hi: 'मूलाधार चक्र' },
    sanskrit: 'मूलाधार',
    bija: 'लं (LAM)',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.85)',
    planet: 'Saturn & Mars',
    cy: 298,
    element: { en: 'Prithvi (Earth / Stability)', kn: 'ಪೃಥ್ವಿ ತತ್ತ್ವ', hi: 'पृथ्वी तत्त्व' },
    balancingPose: { en: 'Vrikshasana & Tadasana', kn: 'ವೃಕ್ಷಾಸನ ಮತ್ತು ತಡಾಸನ', hi: 'वृक्षासन व ताड़ासन' }
  }
];

interface PlanetOrb {
  name: string;
  label: { en: string; kn: string; hi: string };
  symbol: string;
  color: string;
  glow: string;
  angle: number; // degrees for orbital placement
  rx: number;
  ry: number;
  speed: string; // CSS animation duration
}

const PLANET_ORBS: PlanetOrb[] = [
  { name: 'Sun', label: { en: 'Surya (Sun)', kn: 'ಸೂರ್ಯ (ರವಿ)', hi: 'सूर्य' }, symbol: '☀️', color: '#f59e0b', glow: '#fbbf24', angle: 0, rx: 175, ry: 75, speed: '14s' },
  { name: 'Moon', label: { en: 'Chandra (Moon)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' }, symbol: '🌙', color: '#e0e7ff', glow: '#ffffff', angle: 40, rx: 185, ry: 80, speed: '16s' },
  { name: 'Mars', label: { en: 'Mangala (Mars)', kn: 'ಮಂಗಳ (ಕುಜ)', hi: 'मंगल' }, symbol: '🔥', color: '#ef4444', glow: '#f87171', angle: 80, rx: 195, ry: 85, speed: '18s' },
  { name: 'Mercury', label: { en: 'Budha (Mercury)', kn: 'ಬುಧ', hi: 'बुध' }, symbol: '🌿', color: '#10b981', glow: '#34d399', angle: 120, rx: 165, ry: 70, speed: '13s' },
  { name: 'Jupiter', label: { en: 'Guru (Jupiter)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'गुरु' }, symbol: '🌟', color: '#fbbf24', glow: '#fde047', angle: 160, rx: 205, ry: 90, speed: '22s' },
  { name: 'Venus', label: { en: 'Shukra (Venus)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' }, symbol: '💎', color: '#ec4899', glow: '#f472b6', angle: 200, rx: 170, ry: 75, speed: '15s' },
  { name: 'Saturn', label: { en: 'Shani (Saturn)', kn: 'ಶನಿ', hi: 'शनि' }, symbol: '🪐', color: '#8b5cf6', glow: '#a78bfa', angle: 240, rx: 215, ry: 95, speed: '26s' },
  { name: 'Rahu', label: { en: 'Rahu (North Node)', kn: 'ರಾಹು', hi: 'राहु' }, symbol: '🌪️', color: '#64748b', glow: '#94a3b8', angle: 285, rx: 190, ry: 82, speed: '20s' },
  { name: 'Ketu', label: { en: 'Ketu (South Node)', kn: 'ಕೇತು', hi: 'केतु' }, symbol: '✨', color: '#d97706', glow: '#f59e0b', angle: 325, rx: 180, ry: 78, speed: '20s' }
];

export const VedicYogaAnimatedSvg: React.FC<VedicYogaAnimatedSvgProps> = ({
  currentLang,
  selectedPlanet,
  onSelectPlanet,
  activePose = 'padmasana',
  onSelectPose,
  isBreathingActive = true
}) => {
  const [currentChakra, setCurrentChakra] = useState<ChakraInfo>(CHAKRAS[3]); // Default Anahata Heart
  const [internalPose, setInternalPose] = useState<'padmasana' | 'vrikshasana' | 'suryanamaskar' | 'bhujangasana' | 'balasana'>(activePose);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Sync prop changes
  useEffect(() => {
    if (activePose) setInternalPose(activePose);
  }, [activePose]);

  // Breathing pacer loop: Inhale 4s -> Hold 4s -> Exhale 4s -> Pause 2s (Sama Vritti Pranayama)
  useEffect(() => {
    if (isPaused) return;
    let timer: NodeJS.Timeout;
    
    if (breathPhase === 'inhale') {
      timer = setTimeout(() => {
        setBreathPhase('hold');
        setBreathSeconds(4);
      }, 4000);
    } else if (breathPhase === 'hold') {
      timer = setTimeout(() => {
        setBreathPhase('exhale');
        setBreathSeconds(4);
      }, 4000);
    } else if (breathPhase === 'exhale') {
      timer = setTimeout(() => {
        setBreathPhase('pause');
        setBreathSeconds(2);
      }, 4000);
    } else {
      timer = setTimeout(() => {
        setBreathPhase('inhale');
        setBreathSeconds(4);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [breathPhase, isPaused]);

  const handlePoseSwitch = (pose: 'padmasana' | 'vrikshasana' | 'suryanamaskar' | 'bhujangasana' | 'balasana') => {
    setInternalPose(pose);
    if (onSelectPose) onSelectPose(pose);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 border-2 border-amber-500/40 shadow-2xl p-4 sm:p-6 text-stone-100 overflow-hidden relative">
      
      {/* Background Decorative Cosmic Starfield & Rings */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-pulse" />
      </div>

      {/* Top Controls Bar: Pose Selector & Pranayama Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Animated Cosmic Asana Visualizer</span>
            </span>
            <span className="text-xs font-mono text-stone-400">• Kundalini & 7 Chakras</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-black text-amber-100 mt-1">
            {currentLang === 'kn'
              ? 'ವೈದಿಕ ಯೋಗಾಸನ ಮತ್ತು ಶರೀರ-ಗ್ರಹ ಸಮತೋಲನ'
              : currentLang === 'hi'
              ? 'वैदिक योगासन एवं ग्रह-संतुलन ऊर्जा चक्र'
              : 'Vedic Asana & Planetary Energy Balancing'}
          </h3>
        </div>

        {/* Pose Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none bg-stone-900/80 p-1 rounded-2xl border border-stone-800">
          <button
            onClick={() => handlePoseSwitch('padmasana')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              internalPose === 'padmasana'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Lotus Pose - Master Meditation & Jupiter Wisdom"
          >
            🧘 Padmasana
          </button>
          <button
            onClick={() => handlePoseSwitch('vrikshasana')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              internalPose === 'vrikshasana'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Tree Pose - Saturn & Rahu Grounding"
          >
            🌳 Vrikshasana
          </button>
          <button
            onClick={() => handlePoseSwitch('suryanamaskar')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              internalPose === 'suryanamaskar'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Sun Salutation - Surya Vitality & Fire"
          >
            ☀️ Surya Namaskar
          </button>
          <button
            onClick={() => handlePoseSwitch('bhujangasana')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              internalPose === 'bhujangasana'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Cobra Pose - Mars Vitality & Spine Fire"
          >
            🐍 Bhujangasana
          </button>
          <button
            onClick={() => handlePoseSwitch('balasana')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              internalPose === 'balasana'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-stone-950 shadow-md font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Child's Pose - Moon Cooling & Nervous System Calming"
          >
            🌙 Balasana
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] my-3 flex items-center justify-center">
        <svg
          viewBox="0 0 540 360"
          className="w-full h-full max-h-[480px] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glow Filters */}
            <filter id="chakra-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="aura-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial Gradients for Aura and Energy Halos */}
            <radialGradient id="pranic-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="crown-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#c084fc" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#7e22ce" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Kundalini Gradients */}
            <linearGradient id="ida-stream" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>

            <linearGradient id="pingala-stream" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="sushumna-core" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
            </linearGradient>

            {/* Breathing Ring Keyframe CSS Simulation */}
            <style>
              {`
                @keyframes pulseNadi {
                  0% { stroke-dashoffset: 400; opacity: 0.6; }
                  50% { opacity: 1; }
                  100% { stroke-dashoffset: 0; opacity: 0.6; }
                }
                @keyframes orbitSpinSlow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes breathExpand {
                  0% { r: 52px; opacity: 0.25; }
                  50% { r: 85px; opacity: 0.75; }
                  100% { r: 52px; opacity: 0.25; }
                }
                @keyframes chakraRayPulse {
                  0%, 100% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(1.18); opacity: 1; }
                }
                @keyframes plumbLineFlow {
                  0% { stroke-dashoffset: 40; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes alignmentPulse {
                  0%, 100% { opacity: 0.35; stroke-width: 1.2px; }
                  50% { opacity: 0.85; stroke-width: 2px; }
                }
                @keyframes poseFadeIn {
                  from { opacity: 0; transform: scale(0.97); }
                  to { opacity: 1; transform: scale(1); }
                }
                .flow-nadi-ida {
                  stroke-dasharray: 12 6;
                  animation: pulseNadi 4s linear infinite;
                }
                .flow-nadi-pingala {
                  stroke-dasharray: 12 6;
                  animation: pulseNadi 4s linear infinite reverse;
                }
                .flow-plumb-line {
                  stroke-dasharray: 6 4;
                  animation: plumbLineFlow 2s linear infinite;
                }
                .alignment-guide-vector {
                  animation: alignmentPulse 3s ease-in-out infinite;
                }
                .posture-group {
                  animation: poseFadeIn 0.45s ease-out;
                  transform-origin: 0 180px;
                }
              `}
            </style>
          </defs>

          {/* ================================================================= */}
          {/* BACKGROUND: SACRED GEOMETRY MANDALA RINGS */}
          {/* ================================================================= */}
          <g transform="translate(270, 185)" opacity="0.4">
            <circle r="145" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 4" />
            <circle r="165" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="6 6" />
            <circle r="185" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="2 5" />
            
            {/* 12-Spoke Vedic Rashi & Kalachakra Star */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="-135"
                x2="0"
                y2="-165"
                stroke="#ca8a04"
                strokeWidth="1"
                transform={`rotate(${i * 30})`}
                opacity="0.5"
              />
            ))}
          </g>

          {/* ================================================================= */}
          {/* PLANETARY ORBITS WITH ROTATING CELESTIAL ORBS */}
          {/* ================================================================= */}
          <g transform="translate(270, 185)">
            {/* Elliptical Orbital Tracks */}
            <ellipse rx="175" ry="75" fill="none" stroke="rgba(245, 158, 11, 0.18)" strokeWidth="1" strokeDasharray="4 4" />
            <ellipse rx="195" ry="85" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
            <ellipse rx="215" ry="95" fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" strokeDasharray="6 6" />

            {/* Orbiting Planetary Nodes */}
            {PLANET_ORBS.map((orb, idx) => {
              const rad = (orb.angle * Math.PI) / 180;
              const ox = Math.cos(rad) * orb.rx;
              const oy = Math.sin(rad) * orb.ry;
              const isSelected = selectedPlanet && selectedPlanet.toLowerCase() === orb.name.toLowerCase();

              return (
                <g
                  key={orb.name}
                  transform={`translate(${ox}, ${oy})`}
                  onClick={() => onSelectPlanet && onSelectPlanet(orb.name)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Planet Pulse Animation */}
                  <circle
                    r={isSelected ? '14' : '10'}
                    fill={orb.color}
                    opacity={isSelected ? '0.5' : '0.25'}
                  >
                    <animate attributeName="r" values={isSelected ? '12;18;12' : '8;13;8'} dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.4s" repeatCount="indefinite" />
                  </circle>

                  {/* Planet Core Orb */}
                  <circle
                    r={isSelected ? '9' : '6.5'}
                    fill={orb.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2' : '1'}
                    filter="url(#chakra-glow)"
                  />

                  {/* Symbol Label */}
                  <text
                    y="3"
                    textAnchor="middle"
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight="bold"
                    fill="#ffffff"
                    pointerEvents="none"
                  >
                    {orb.symbol}
                  </text>

                  {/* Name Tag */}
                  <text
                    y={oy > 0 ? '16' : '-12'}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="serif"
                    fontWeight="bold"
                    fill={isSelected ? '#fef08a' : '#d6d3d1'}
                    pointerEvents="none"
                  >
                    {orb.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ================================================================= */}
          {/* PRANAYAMA BREATHING AURA (EXPANDING / CONTRACTING RING) */}
          {/* ================================================================= */}
          <g transform="translate(270, 185)">
            <circle
              r="70"
              fill="url(#pranic-aura)"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values={breathPhase === 'inhale' ? '50;90' : breathPhase === 'hold' ? '90;90' : breathPhase === 'exhale' ? '90;50' : '50;50'}
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Glowing Breath Boundary Ring */}
            <circle
              r="70"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values={breathPhase === 'inhale' ? '50;90' : breathPhase === 'hold' ? '90;90' : breathPhase === 'exhale' ? '90;50' : '50;50'}
                dur="4s"
                repeatCount="indefinite"
              />
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* ================================================================= */}
          {/* YOGIC SILHOUETTE POSTURE OVERLAYS */}
          {/* ================================================================= */}
          <g transform="translate(270, 0)">
            
            {/* POSE 1: PADMASANA (Lotus Meditation Pose - Default) */}
            {internalPose === 'padmasana' && (
              <g id="pose-padmasana" className="posture-group">
                {/* Sacred Meditative Base Triangle (Equilateral Postural Stability) */}
                <polygon
                  points="0,60 -60,305 60,305"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  className="alignment-guide-vector"
                />

                {/* Torso & Head Silhouette */}
                <path
                  d="M0,60 C-14,60 -18,74 -18,88 C-18,102 -10,118 -5,124 L-28,150 C-36,158 -32,185 -30,220 C-29,235 -24,260 -16,275 C-30,285 -60,295 -75,305 C-82,310 -76,322 -62,322 C-20,322 0,318 0,318 C0,318 20,322 62,322 C76,322 82,310 75,305 C60,295 30,285 16,275 C24,260 29,235 30,220 C32,185 36,158 28,150 L5,124 C10,118 18,102 18,88 C18,74 14,60 0,60 Z"
                  fill="rgba(254, 240, 138, 0.12)"
                  stroke="rgba(251, 191, 36, 0.45)"
                  strokeWidth="2.5"
                />

                {/* Folded Crossed Legs (Padmasana Base) */}
                <ellipse cx="0" cy="308" rx="82" ry="18" fill="rgba(251, 191, 36, 0.15)" stroke="#fbbf24" strokeWidth="1.5" />
                <path d="M-60,305 Q0,328 60,305" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                {/* Arms in Chin Mudra resting on knees */}
                <path d="M-26,160 Q-58,220 -60,288" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M26,160 Q58,220 60,288" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                {/* Mudra Hand circles */}
                <circle cx="-60" cy="288" r="6" fill="#fbbf24" opacity="0.8" />
                <circle cx="60" cy="288" r="6" fill="#fbbf24" opacity="0.8" />

                {/* Vertical Plumb Line Alignment Guideline */}
                <line x1="0" y1="60" x2="0" y2="310" stroke="#fef08a" strokeWidth="1.5" className="flow-plumb-line" opacity="0.5" />
              </g>
            )}

            {/* POSE 2: VRIKSHASANA (Tree Pose - Saturn & Rahu Grounding) */}
            {internalPose === 'vrikshasana' && (
              <g id="pose-vrikshasana" className="posture-group">
                {/* Vertical Plumb Line for Balance from fingertips through core to ground */}
                <line x1="0" y1="32" x2="0" y2="330" stroke="#34d399" strokeWidth="1.5" className="flow-plumb-line" opacity="0.75" />

                {/* Standing Leg & Torso */}
                <path
                  d="M0,60 C-12,60 -15,74 -15,86 C-15,98 -8,110 -4,116 L-16,140 C-22,150 -20,180 -18,210 L-14,260 L-12,324 L-2,324 L-2,260 L0,260 L2,260 L2,324 L12,324 L14,260 L18,210 C20,180 22,150 16,140 L4,116 C8,110 15,98 15,86 C15,74 12,60 0,60 Z"
                  fill="rgba(52, 211, 153, 0.12)"
                  stroke="rgba(52, 211, 153, 0.55)"
                  strokeWidth="2.5"
                />
                {/* Folded Right Leg at knee (Tree Pose) */}
                <path d="M6,220 L38,245 L10,260" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                {/* Knee alignment balance arc */}
                <path d="M0,245 L38,245" stroke="#34d399" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                {/* Hands folded overhead in Anjali Mudra */}
                <path d="M-14,136 Q-28,95 0,38 Q28,95 14,136" fill="none" stroke="#34d399" strokeWidth="2.5" />
                <polygon points="0,32 -6,45 6,45" fill="#34d399" />
                {/* Grounding roots into Muladhara */}
                <path d="M-20,325 Q0,338 20,325" fill="none" stroke="#ef4444" strokeWidth="3" />
                <path d="M-30,330 Q0,345 30,330" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}

            {/* POSE 3: SURYA NAMASKAR (Pranamasana to Urdhva Hastasana - Solar Activation) */}
            {internalPose === 'suryanamaskar' && (
              <g id="pose-suryanamaskar" className="posture-group">
                {/* Arching Back Spine & Radiating Solar Flares */}
                <path
                  d="M0,58 C-14,58 -16,74 -16,88 C-16,105 -5,120 0,128 C-8,145 -14,175 -12,210 L-8,270 L-8,324 L8,324 L8,270 C10,240 14,175 12,145 C16,120 16,105 16,88 C16,74 14,58 0,58 Z"
                  fill="rgba(245, 158, 11, 0.15)"
                  stroke="rgba(245, 158, 11, 0.65)"
                  strokeWidth="2.5"
                />
                {/* Sun Arms Raised to Sky */}
                <path d="M-12,130 Q-40,80 -25,25 Q0,40 25,25 Q40,80 12,130" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                {/* Golden Rising Sun Aura behind chest */}
                <circle cx="0" cy="180" r="38" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" opacity="0.8">
                  <animate attributeName="r" values="32;46;32" dur="3s" repeatCount="indefinite" />
                </circle>
                {/* Thoracic Expansion Curve Vector */}
                <path d="M0,60 Q-25,140 0,220" fill="none" stroke="#fef08a" strokeWidth="1.5" className="flow-plumb-line" opacity="0.6" />
              </g>
            )}

            {/* POSE 4: BHUJANGASANA (Cobra Pose - Heart & Mars Spine Vitality) */}
            {internalPose === 'bhujangasana' && (
              <g id="pose-bhujangasana" className="posture-group">
                {/* Upward arched torso from prone position */}
                <path
                  d="M-40,110 C-40,95 -30,85 -20,85 C-10,85 0,95 0,110 C0,135 -15,160 -25,185 C-35,210 -40,245 -40,285 L40,305 L80,315 L-40,315 Z"
                  fill="rgba(244, 63, 94, 0.12)"
                  stroke="rgba(244, 63, 94, 0.6)"
                  strokeWidth="2.5"
                />
                {/* Supporting hands pushing off ground */}
                <path d="M-30,175 L-45,260 L-35,260" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                <path d="M-10,175 L15,260 L25,260" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                {/* Cobra Arch Spinal Guideline */}
                <path d="M-40,285 Q-20,170 -10,100" fill="none" stroke="#fb7185" strokeWidth="1.5" className="flow-plumb-line" opacity="0.75" />
              </g>
            )}

            {/* POSE 5: BALASANA (Child Pose - Moon Cooling Calm) */}
            {internalPose === 'balasana' && (
              <g id="pose-balasana" className="posture-group">
                {/* Gentle rounded spine folded over thighs */}
                <path
                  d="M-50,295 C-50,240 -20,210 20,210 C50,210 70,245 70,295 Z"
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="rgba(99, 102, 241, 0.6)"
                  strokeWidth="2.5"
                />
                {/* Rested head on ground & outstretched arms */}
                <circle cx="-55" cy="285" r="14" fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="2" />
                <path d="M-45,280 L-95,295" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
                {/* Restorative Lunar Arc */}
                <path d="M-50,295 Q10,195 70,295" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
              </g>
            )}

            {/* =============================================================== */}
            {/* SUSHUMNA CENTRAL SPINAL NADI WITH FLOWING KUNDALINI STREAM */}
            {/* =============================================================== */}
            {/* Sushumna Main Axis Line */}
            <line x1="0" y1="65" x2="0" y2="305" stroke="url(#sushumna-core)" strokeWidth="4" filter="url(#chakra-glow)" />

            {/* Ida Nadi (Lunar Cool Flow - Left to Right Sinusoid) */}
            <path
              d="M0,68 Q-22,86 0,104 Q22,122 0,140 Q-22,160 0,180 Q22,201 0,222 Q-22,241 0,260 Q22,279 0,298"
              fill="none"
              stroke="url(#ida-stream)"
              strokeWidth="2.5"
              className="flow-nadi-ida"
              opacity="0.85"
            />

            {/* Pingala Nadi (Solar Warm Flow - Right to Left Sinusoid) */}
            <path
              d="M0,68 Q22,86 0,104 Q-22,122 0,140 Q22,160 0,180 Q-22,201 0,222 Q22,241 0,260 Q-22,279 0,298"
              fill="none"
              stroke="url(#pingala-stream)"
              strokeWidth="2.5"
              className="flow-nadi-pingala"
              opacity="0.85"
            />

            {/* Crown Sahasrara Halo */}
            <circle cx="0" cy="62" r="24" fill="url(#crown-halo)" opacity="0.75">
              <animate attributeName="r" values="20;28;20" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* =============================================================== */}
            {/* THE 7 CHAKRAS (CLICKABLE ENERGY CENTERS) */}
            {/* =============================================================== */}
            {CHAKRAS.map((chk) => {
              const isSelected = currentChakra.id === chk.id;
              return (
                <g
                  key={chk.id}
                  transform={`translate(0, ${chk.cy})`}
                  onClick={() => setCurrentChakra(chk)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer Pulsing Aura Ring */}
                  <circle
                    r={isSelected ? '18' : '12'}
                    fill={chk.color}
                    opacity={isSelected ? '0.5' : '0.2'}
                  >
                    <animate
                      attributeName="r"
                      values={isSelected ? '14;22;14' : '10;15;10'}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Lotus Petals Simulation for Selected Chakra */}
                  {isSelected && (
                    <g opacity="0.85">
                      {Array.from({ length: 8 }).map((_, pIdx) => (
                        <circle
                          key={pIdx}
                          cx="0"
                          cy="-14"
                          r="4"
                          fill={chk.color}
                          transform={`rotate(${pIdx * 45})`}
                          filter="url(#chakra-glow)"
                        />
                      ))}
                    </g>
                  )}

                  {/* Core Chakra Jewel */}
                  <circle
                    r={isSelected ? '9' : '6.5'}
                    fill={chk.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    filter="url(#chakra-glow)"
                  />

                  {/* Bija Seed Syllable */}
                  <text
                    y="3"
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="bold"
                    fill="#ffffff"
                    pointerEvents="none"
                  >
                    {chk.bija.charAt(0)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Interactive Bottom Intelligence Bar: Selected Chakra & Astrological Balancing Info */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
        
        {/* Card 1: Active Energy Center (Chakra) */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-stone-400">
              Selected Chakra (ಶಕ್ತಿ ಕೇಂದ್ರ)
            </span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentChakra.color, boxShadow: `0 0 10px ${currentChakra.glowColor}` }}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="font-serif font-black text-sm text-white">
              {currentChakra.name[currentLang]}
            </strong>
            <span className="font-mono text-amber-300 font-bold">
              Bija: {currentChakra.bija}
            </span>
          </div>
          <p className="text-[11px] text-stone-400">
            {currentChakra.element[currentLang]}
          </p>
        </div>

        {/* Card 2: Astrological Balancing Asana */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-300">
              Prescribed Balancing Asana (ಸಮತೋಲನ ಆಸನ)
            </span>
            <span className="text-xs">🧘</span>
          </div>
          <strong className="font-serif font-black text-sm text-amber-100 block">
            {currentChakra.balancingPose[currentLang]}
          </strong>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-300">
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Governing Graha: <strong>{currentChakra.planet}</strong></span>
          </div>
        </div>

        {/* Card 3: Pranayama Sama Vritti Breathing Pacer */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-stone-400 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Pranayama Pacer</span>
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold flex items-center gap-1 cursor-pointer"
            >
              {isPaused ? <Play className="w-2.5 h-2.5 text-emerald-400" /> : <Pause className="w-2.5 h-2.5 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                breathPhase === 'inhale' ? 'bg-teal-400' : breathPhase === 'hold' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <strong className="text-sm font-bold uppercase tracking-wider text-white">
                {breathPhase === 'inhale'
                  ? (currentLang === 'kn' ? 'ಉಸಿರೆಳೆದುಕೊಳ್ಳಿ (Inhale)' : 'Inhale')
                  : breathPhase === 'hold'
                  ? (currentLang === 'kn' ? 'ಉಸಿರು ಹಿಡಿದಿಡಿ (Hold)' : 'Hold / Kumbhaka')
                  : breathPhase === 'exhale'
                  ? (currentLang === 'kn' ? 'ಉಸಿರು ಹೊರಹಾಕಿ (Exhale)' : 'Exhale')
                  : (currentLang === 'kn' ? 'ವಿರಾಮ (Pause)' : 'Rest')}
              </strong>
            </div>
            <span className="font-mono font-black text-amber-400 text-base">
              4s
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
