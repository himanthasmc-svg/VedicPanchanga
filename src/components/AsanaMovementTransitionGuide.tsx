import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Compass, 
  Sparkles, 
  Wind, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Activity,
  Zap,
  Shield
} from 'lucide-react';
import { Language, LocalizedString } from '../types';
import { VedicAsana } from '../utils/vedicYogaData';

export interface AsanaMovementTransitionGuideProps {
  asana: VedicAsana;
  currentLang: Language;
  onClose?: () => void;
  onFinish?: () => void;
  initialStepIndex?: number;
}

// 4 Classic Krama Phases of Vedic Asana Movement
interface MovementPhaseMeta {
  phase: 'sthiti' | 'puraka' | 'kumbhaka' | 'rechaka';
  title: Record<Language, string>;
  subTitle: Record<Language, string>;
  breathText: Record<Language, string>;
  pranaDirection: 'upward' | 'holding' | 'downward' | 'grounded';
  color: string;
  glow: string;
  bgGrad: string;
}

const PHASES: MovementPhaseMeta[] = [
  {
    phase: 'sthiti',
    title: { kn: '೧. ಸ್ಥಿತಿ (ತಳಹದಿ & ಸ್ಥಿರತೆ)', hi: '१. स्थिति (आरम्भ व आधार)', en: '1. Sthiti (Grounding Foundation)' },
    subTitle: { kn: 'ಆರಂಭಿಕ ಭಂಗಿ, ತಟಸ್ಥ ಬೆನ್ನೆಲುಬು ಮತ್ತು ದೃಢತೆ', hi: 'प्रारंभिक मुद्रा, सम-मेरुदण्ड एवं स्थिरता', en: 'Initial stance, neutral spine alignment & mental centering' },
    breathText: { kn: 'ಶಾಂತ ಸಹಜ ಉಸಿರಾಟ', hi: 'सहज सम-श्वास', en: 'Calm natural breath' },
    pranaDirection: 'grounded',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    bgGrad: 'from-emerald-950/60 to-stone-900/80'
  },
  {
    phase: 'puraka',
    title: { kn: '೨. ಪೂರಕ (ಉಸಿರೆಳೆತ & ಚಲನೆ)', hi: '२. पूरक (श्वास ग्रहण व प्रसार)', en: '2. Puraka (Inhale & Extension)' },
    subTitle: { kn: 'ಉಸಿರು ಒಳತೆಗೆದುಕೊಳ್ಳುತ್ತಾ ಅಂಗಾಂಗಗಳ ವಿಸ್ತರಣೆ', hi: 'गहरी श्वास के साथ अंगों का विस्तार व आरोहण', en: 'Deep conscious inhale while expanding limbs and lifting the spine' },
    breathText: { kn: 'ಆಳವಾದ ಉಸಿರೆಳೆತ (೪ ಸೆ)', hi: 'गहरी अन्तःश्वास (४ सेकंड)', en: 'Deep Inhalation (4s)' },
    pranaDirection: 'upward',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    bgGrad: 'from-amber-950/60 to-stone-900/80'
  },
  {
    phase: 'kumbhaka',
    title: { kn: '೩. ಕುಂಭಕ (ಆಸನ ಸ್ಥಿತಿ & ಧಾರಣೆ)', hi: '३. कुम्भक (पूर्ण आसन व धारणा)', en: '3. Kumbhaka (Peak Posture & Drishti)' },
    subTitle: { kn: 'ಸ್ಥಿರ ಭಂಗಿಯಲ್ಲಿ ಏಕಾಗ್ರತೆ ಹಾಗೂ ಚಕ್ರ ಜಾಗೃತಿ', hi: 'स्थिर मुद्रा, एकाग्र दृष्टि व चक्र जागरण', en: 'Holding sacred posture geometry, focused Drishti & planetary chakra activation' },
    breathText: { kn: 'ಆಂತರಿಕ ಸ್ಥಿರ ಧಾರಣೆ', hi: 'शान्त श्वास-सन्तुलन', en: 'Steady held alignment' },
    pranaDirection: 'holding',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    bgGrad: 'from-purple-950/60 to-stone-900/80'
  },
  {
    phase: 'rechaka',
    title: { kn: '೪. ರೇಚಕ (ಉಸಿರು ಬಿಡುವಿಕೆ & ವಿಶ್ರಾಂತಿ)', hi: '४. रेचक (श्वास त्याग व विश्राम)', en: '4. Rechaka (Exhale & Grounding Release)' },
    subTitle: { kn: 'ಉಸಿರು ನಿಧಾನವಾಗಿ ಹೊರಹಾಕುತ್ತಾ ಮೂಲಸ್ಥಿತಿಗೆ ಮರಳುವುದು', hi: 'मन्द श्वास त्यागते हुए मूल स्थिति में वापसी', en: 'Slow controlled exhale, returning to center and absorbing restorative prana' },
    breathText: { kn: 'ನಿಧಾನ ಉಸಿರು ಬಿಡುವಿಕೆ (೬ ಸೆ)', hi: 'मन्द प्रश्वास (६ सेकंड)', en: 'Slow Exhalation (6s)' },
    pranaDirection: 'downward',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    bgGrad: 'from-cyan-950/60 to-stone-900/80'
  }
];

export const AsanaMovementTransitionGuide: React.FC<AsanaMovementTransitionGuideProps> = ({
  asana,
  currentLang,
  onClose,
  onFinish,
  initialStepIndex = 0
}) => {
  const stepsCount = asana.steps.length;
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(Math.min(initialStepIndex, stepsCount - 1));
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [stepDuration, setStepDuration] = useState<number>(6); // seconds per step in auto mode
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(6);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Map step index to movement phase
  const currentPhase = PHASES[currentStepIdx % PHASES.length];

  // Soft meditative singing bowl tone using Web Audio API
  const playChime = (freq = 528) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, ctx.currentTime + 2.0);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    } catch {}
  };

  // Step advancement in Auto-Play mode
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStepSecondsLeft(prev => {
        if (prev <= 1) {
          // Advance to next step
          setCurrentStepIdx(cIdx => {
            const nextIdx = cIdx + 1;
            if (nextIdx < stepsCount) {
              playChime(nextIdx === stepsCount - 1 ? 639 : 528);
              return nextIdx;
            } else {
              // Completed all steps!
              setIsAutoPlaying(false);
              playChime(432); // deep Om grounding chime
              if (onFinish) onFinish();
              return cIdx;
            }
          });
          return stepDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, stepsCount, stepDuration]);

  // Mark current step as completed
  useEffect(() => {
    if (!completedSteps.includes(currentStepIdx)) {
      setCompletedSteps(prev => [...prev, currentStepIdx]);
    }
  }, [currentStepIdx]);

  const handleManualStepSelect = (idx: number) => {
    setCurrentStepIdx(idx);
    setStepSecondsLeft(stepDuration);
    playChime(480 + idx * 30);
  };

  const handleNext = () => {
    if (currentStepIdx < stepsCount - 1) {
      handleManualStepSelect(currentStepIdx + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      handleManualStepSelect(currentStepIdx - 1);
    }
  };

  const handleToggleAutoPlay = () => {
    if (!isAutoPlaying) {
      setStepSecondsLeft(stepDuration);
      playChime(528);
    }
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setCurrentStepIdx(0);
    setStepSecondsLeft(stepDuration);
    setCompletedSteps([0]);
  };

  const progressPercent = Math.round(((currentStepIdx + 1) / stepsCount) * 100);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-indigo-950 border-2 border-amber-500/40 text-stone-100 shadow-2xl p-4 sm:p-6 space-y-5 overflow-hidden relative">
      
      {/* Background Sacred Geometric Mandala SVG */}
      <div className="absolute -right-16 -top-16 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_60s_linear_infinite]">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" />
          <polygon points="100,20 170,140 30,140" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <polygon points="100,180 170,60 30,60" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER: ASANA TITLE & MEDITATIVE AUDIO PACER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>
                {currentLang === 'kn' ? 'ಧ್ಯಾನಾತ್ಮಕ ಆಸನ ಚಲನಾ ಮಾರ್ಗದರ್ಶಿ' : currentLang === 'hi' ? 'ध्यानात्मक आसन संचलन संदर्शिका' : 'Meditative Movement Transition Flow'}
              </span>
            </span>

            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {asana.poseLevel}
            </span>
          </div>

          <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
            {asana.sanskritName} • <span className="text-white font-medium">{asana.name[currentLang]}</span>
          </h3>
        </div>

        {/* Quick controls: Chime toggle & Auto duration selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-xs'
                : 'bg-stone-800 text-stone-500 border-stone-700'
            }`}
            title="Toggle meditative transition chimes"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Step pacing duration in seconds */}
          <div className="flex items-center bg-stone-900 border border-stone-700/80 rounded-xl p-0.5 text-xs font-mono">
            {[4, 6, 8, 10].map(sec => (
              <button
                key={sec}
                onClick={() => {
                  setStepDuration(sec);
                  setStepSecondsLeft(sec);
                }}
                className={`px-2 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                  stepDuration === sec
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={`Pace each movement step at ${sec} seconds`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STEPPER PROGRESS BAR & PHASE TABS */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-stone-400">
            {currentLang === 'kn' ? `ಹಂತ ${currentStepIdx + 1} / ${stepsCount}` : currentLang === 'hi' ? `चरण ${currentStepIdx + 1} / ${stepsCount}` : `Step ${currentStepIdx + 1} of ${stepsCount}`}
          </span>
          <span className="text-amber-300 font-bold">
            {progressPercent}% {currentLang === 'kn' ? 'ಪ್ರಗತಿ' : currentLang === 'hi' ? 'प्रगति' : 'Complete'}
          </span>
        </div>

        {/* Animated continuous track */}
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        {/* Step buttons row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {asana.steps.map((st, sIdx) => {
            const isActive = currentStepIdx === sIdx;
            const isDone = completedSteps.includes(sIdx);
            const pMeta = PHASES[sIdx % PHASES.length];

            return (
              <button
                key={sIdx}
                onClick={() => handleManualStepSelect(sIdx)}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                    : isDone
                    ? 'bg-stone-800/80 border-emerald-500/40 text-stone-300 hover:border-emerald-400'
                    : 'bg-stone-800/40 border-stone-800 text-stone-500 hover:text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    Step {sIdx + 1}
                  </span>
                  {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                <div className="text-xs font-bold truncate text-white">
                  {pMeta.title[currentLang].split('(')[0].trim()}
                </div>

                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {pMeta.breathText[currentLang]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC ANIMATED MOVEMENT CARD (FRAMER MOTION / MOTION) */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIdx}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${currentPhase.bgGrad} border-2 border-stone-700/80 shadow-xl space-y-4 relative`}
        >
          {/* Phase Badge & Breath Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs shrink-0"
                style={{ backgroundColor: `${currentPhase.color}25`, color: currentPhase.color, border: `1px solid ${currentPhase.color}60` }}
              >
                {currentPhase.phase === 'sthiti' ? '🌱' : currentPhase.phase === 'puraka' ? '🌬️' : currentPhase.phase === 'kumbhaka' ? '⚡' : '🍃'}
              </span>

              <div>
                <h4 className="font-serif font-black text-base sm:text-lg text-white">
                  {currentPhase.title[currentLang]}
                </h4>
                <p className="text-xs text-stone-300">
                  {currentPhase.subTitle[currentLang]}
                </p>
              </div>
            </div>

            {/* Live Breath / Prana Sync Pill */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono self-start sm:self-auto">
              <Wind className="w-4 h-4 text-cyan-300 animate-pulse" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block">Breath Cue</span>
                <span className="font-bold text-amber-300">
                  {currentPhase.breathText[currentLang]}
                </span>
              </div>
            </div>
          </div>

          {/* Main Movement Instruction Text with Framer Motion Highlight */}
          <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {currentLang === 'kn' ? 'ಖಚಿತ ಚಲನೆಯ ನಿರ್ದೇಶನ (Movement Step)' : currentLang === 'hi' ? 'सटीक संचलन निर्देश' : 'Precise Physical Movement Direction'}
              </span>
            </div>
            
            <p className="text-base sm:text-lg font-medium text-stone-100 leading-relaxed font-serif">
              {asana.steps[currentStepIdx] ? asana.steps[currentStepIdx][currentLang] : ''}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* 4. PHYSICAL ALIGNMENT & ACCURACY ANATOMICAL CHECKS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            
            {/* Box 1: Spine & Joint Vector */}
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'kn' ? 'ಬೆನ್ನೆಲುಬು & ಭಂಗಿ' : currentLang === 'hi' ? 'मेरुदण्ड संरेखण' : 'Spinal Vector'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-snug">
                {currentLang === 'kn'
                  ? 'ಕಶೇರುಕಗಳನ್ನು ನೇರವಾಗಿರಿಸಿ, ಹೆಗಲನ್ನು ಸಡಿಲವಾಗಿ ಹಿಂದಕ್ಕೆ ತಿರುಗಿಸಿ.'
                  : currentLang === 'hi'
                  ? 'रीढ़ को सीधा रखें, कंधों को शिथिल कर पीछे की ओर घुमाएं।'
                  : 'Maintain axial elongation from tailbone to crown; soften shoulders away from ears.'}
              </p>
            </div>

            {/* Box 2: Drishti (Visual Focus Point) */}
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'kn' ? 'ದೃಷ್ಟಿ (ಏಕಾಗ್ರತೆ)' : currentLang === 'hi' ? 'दृष्टि बिन्दु' : 'Drishti (Focal Gaze)'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-snug">
                {currentLang === 'kn'
                  ? 'ನಾಸಾಗ್ರ (ಮೂಗಿನ ತುದಿ) ಅಥವಾ ಭ್ರೂಮಧ್ಯದ ಮೇಲೆ ಶಾಂತ ದೃಷ್ಟಿ ನೆಡಿ.'
                  : currentLang === 'hi'
                  ? 'नासाग्र (नाक के अग्रभाग) अथवा भ्रूमध्य पर शान्त स्थिर दृष्टि रखें।'
                  : 'Soft steady gaze fixed on Nasagra (tip of nose) or Bhrumadhya (third eye).'}
              </p>
            </div>

            {/* Box 3: Target Chakra Activation */}
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'kn' ? 'ಜಾಗೃತ ಚಕ್ರ' : currentLang === 'hi' ? 'सक्रिय चक्र' : 'Target Chakra'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-snug">
                <strong className="text-white block font-sans">{asana.targetChakra[currentLang]}</strong>
                <span>{asana.element[currentLang]} {currentLang === 'kn' ? 'ತತ್ತ್ವ ಸಮತೋಲನ' : 'Element Balance'}</span>
              </p>
            </div>

          </div>

          {/* Astrological & Restorative Shield Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Shield className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong className="text-amber-200">
                  {currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಸಮತೋಲನ: ' : currentLang === 'hi' ? 'ज्योतिषीय संतुलन: ' : 'Vedic Balancing: '}
                </strong>
                {asana.astrologicalBalancing[currentLang]}
              </span>
            </div>

            <div className="text-[11px] font-mono text-stone-400 shrink-0">
              Hold: <span className="text-white font-bold">{asana.holdDuration}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. MEDITATIVE PLAYBACK CONTROLS (AUTO-FLOW & MANUAL NAVIGATION) */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        
        {/* Left: Auto-Flow Toggle with Circular Second Ring */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAutoPlay}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white ring-2 ring-rose-400/50'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 hover:scale-105'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>
              {isAutoPlaying
                ? (currentLang === 'kn' ? 'ವಿರಾಮ (Pause Flow)' : currentLang === 'hi' ? 'विराम' : 'Pause Auto Flow')
                : (currentLang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಹರಿವು (Auto Flow)' : currentLang === 'hi' ? 'स्वचालित प्रवाह' : 'Start Auto Flow')}
            </span>
          </button>

          {isAutoPlaying && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-amber-400/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Next in {stepSecondsLeft}s</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            title="Reset to first movement step"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Previous / Next Step Manual Navigation */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentLang === 'kn' ? 'ಹಿಂದಿನ ಹಂತ' : currentLang === 'hi' ? 'पिछला' : 'Previous Step'}</span>
          </button>

          <button
            onClick={handleNext}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md ${
              currentStepIdx === stepsCount - 1
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-black'
            }`}
          >
            <span>
              {currentStepIdx === stepsCount - 1
                ? (currentLang === 'kn' ? 'ಪೂರ್ಣಗೊಳಿಸಿ ✓' : currentLang === 'hi' ? 'सम्पन्न ✓' : 'Complete Asana ✓')
                : (currentLang === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : currentLang === 'hi' ? 'अगला चरण' : 'Next Step')}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
