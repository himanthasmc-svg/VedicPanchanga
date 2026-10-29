import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Activity, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Compass, 
  Printer, 
  ChevronRight, 
  Layers, 
  Zap, 
  Award,
  Info
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { KundaliData, Language, LocalizedString } from '../types';
import { calculatePlanetaryBala, PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { 
  calculateVedicYogaPlan, 
  GRAHA_YOGA_PROFILES, 
  GrahaYogaProfile, 
  PersonalizedVedicYogaPlan, 
  VedicAsana 
} from '../utils/vedicYogaData';

interface VedicYogaPostureModuleProps {
  kundali: KundaliData;
  currentLang: Language;
  onBackToChart?: () => void;
}

export const VedicYogaPostureModule: React.FC<VedicYogaPostureModuleProps> = ({
  kundali,
  currentLang,
  onBackToChart
}) => {
  // Compute planetary bala breakdown
  const balaBreakdown = useMemo(() => {
    return kundali.planets.map(planet => calculatePlanetaryBala(planet));
  }, [kundali]);

  // Compute personalized Vedic Yoga plan
  const yogaPlan: PersonalizedVedicYogaPlan = useMemo(() => {
    return calculateVedicYogaPlan(kundali, balaBreakdown);
  }, [kundali, balaBreakdown]);

  // Active module tab
  const [activeTab, setActiveTab] = useState<'routine' | 'directory' | 'diagnostic' | 'practice'>('routine');

  // Directory selected planet
  const [selectedPlanetKey, setSelectedPlanetKey] = useState<string>(yogaPlan.weakestPlanet.name || 'Sun');

  // Practice mode state
  const [activePracticeAsana, setActivePracticeAsana] = useState<VedicAsana>(yogaPlan.constitutionalAsana);
  const [timerDuration, setTimerDuration] = useState<number>(45); // seconds
  const [timerRemaining, setTimerRemaining] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathRef = useRef<NodeJS.Timeout | null>(null);

  // Play peaceful bell tone using Web Audio API
  const playBellSound = (freq = 528) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {
      // AudioContext autoplay restriction fallback
    }
  };

  // Timer handling
  useEffect(() => {
    if (isTimerRunning && timerRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerRemaining === 0) {
      setIsTimerRunning(false);
      playBellSound(432); // completion chime
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timerRemaining]);

  // Breathing pacer: 4s inhale, 4s hold, 6s exhale
  useEffect(() => {
    if (!isTimerRunning) return;
    let mounted = true;

    const cycle = () => {
      if (!mounted) return;
      setBreathPhase('inhale');
      breathRef.current = setTimeout(() => {
        if (!mounted) return;
        setBreathPhase('hold');
        breathRef.current = setTimeout(() => {
          if (!mounted) return;
          setBreathPhase('exhale');
          breathRef.current = setTimeout(() => {
            if (mounted) cycle();
          }, 6000);
        }, 3000);
      }, 4000);
    };

    cycle();

    return () => {
      mounted = false;
      if (breathRef.current) clearTimeout(breathRef.current);
    };
  }, [isTimerRunning]);

  const handleStartPractice = (asana: VedicAsana, seconds = 45) => {
    setActivePracticeAsana(asana);
    setTimerDuration(seconds);
    setTimerRemaining(seconds);
    setIsTimerRunning(true);
    setActiveTab('practice');
    playBellSound(528);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerRemaining(timerDuration);
  };

  // Radar chart data
  const radarData = useMemo(() => {
    return [
      {
        subject: currentLang === 'kn' ? 'ಬೆನ್ನೆಲುಬು' : currentLang === 'hi' ? 'मेरुदण्ड' : 'Spine',
        A: yogaPlan.physicalBalanceScores.spinalAlignment,
        fullMark: 100
      },
      {
        subject: currentLang === 'kn' ? 'ಸ್ನಾಯು ತ್ರಾಣ' : currentLang === 'hi' ? 'मांसपेशियां' : 'Muscles',
        A: yogaPlan.physicalBalanceScores.muscularStamina,
        fullMark: 100
      },
      {
        subject: currentLang === 'kn' ? 'ಕೀಲು ನಮ್ಯತೆ' : currentLang === 'hi' ? 'जोड़ लचीलापन' : 'Joints',
        A: yogaPlan.physicalBalanceScores.jointFlexibility,
        fullMark: 100
      },
      {
        subject: currentLang === 'kn' ? 'ನರಮಂಡಲ' : currentLang === 'hi' ? 'तंत्रिका तंत्र' : 'Nerves',
        A: yogaPlan.physicalBalanceScores.nervousStability,
        fullMark: 100
      },
      {
        subject: currentLang === 'kn' ? 'ಹೃದಯ ಚೈತನ್ಯ' : currentLang === 'hi' ? 'हृदय ओज' : 'Cardio',
        A: yogaPlan.physicalBalanceScores.cardioVitality,
        fullMark: 100
      },
      {
        subject: currentLang === 'kn' ? 'ಜಠರಾಗ್ನಿ' : currentLang === 'hi' ? 'जठराग्नि' : 'Agni/Digestion',
        A: yogaPlan.physicalBalanceScores.digestiveAgni,
        fullMark: 100
      }
    ];
  }, [yogaPlan, currentLang]);

  const selectedProfile: GrahaYogaProfile = GRAHA_YOGA_PROFILES[selectedPlanetKey] || GRAHA_YOGA_PROFILES.Sun;

  return (
    <div className="space-y-6">
      {/* Module Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 border-2 border-indigo-500/40 p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Ambient subtle light circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-stone-950 shadow-md">
                <span className="text-xl">🧘</span>
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-amber-200 tracking-wide">
                {currentLang === 'kn' 
                  ? 'ವೈದಿಕ ಯೋಗಾಸನ ಮತ್ತು ದೈಹಿಕ ಸಮತೋಲನ' 
                  : currentLang === 'hi' 
                  ? 'वैदिक योगासन एवं शारीरिक संतुलन' 
                  : 'Vedic Yoga & Posture Balancing'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Patanjali • Jyotish Shastra
              </span>
            </div>

            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl">
              {currentLang === 'kn'
                ? 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯ ಗ್ರಹಸ್ಥಿತಿ, ಲಗ್ನಾಧಿಪತಿ ಮತ್ತು ದುರ್ಬಲ ಗ್ರಹಗಳ ದೋಷ ಪರಿಹಾರಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾದ ವೈದಿಕ ಯೋಗಾಸನಗಳು ಹಾಗೂ ಪ್ರಾಣಾಯಾಮ ಮಾರ್ಗದರ್ಶಿ.'
                : currentLang === 'hi'
                ? 'आपकी जन्म कुण्डली की ग्रह स्थिति, लग्नेश एवं निर्बल ग्रहों के शारीरिक संतुलन हेतु विशेष रूप से निर्धारित पावन वैदिक योगासन एवं प्राणायाम।'
                : "Personalized therapeutic Yogasanas and breathwork tailored to balance planetary strengths, align spinal chakras, and counteract physical vulnerabilities in your Janma Kundali."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Print your Vedic Yoga Prescription"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentLang === 'kn' ? 'ಮುದ್ರಿಸಿ / PDF' : currentLang === 'hi' ? 'प्रिंट / PDF' : 'Print Routine'}</span>
            </button>

            {onBackToChart && (
              <button
                onClick={onBackToChart}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಕುಂಡಲಿಗೆ ಮರಳಿ' : currentLang === 'hi' ? 'कुण्डली पर वापस' : 'Back to Chart'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Constitutional Diagnostic Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-400/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ಲಗ್ನ & ಲಗ್ನಾಧಿಪತಿ' : currentLang === 'hi' ? 'लग्न व लग्नेश' : 'Lagna & Lord'}
            </span>
            <div className="font-bold text-amber-300 text-xs sm:text-sm">
              {yogaPlan.lagnaRashi} • {yogaPlan.lagnaLord}
            </div>
            <span className="text-[10px] text-stone-300 block">
              {currentLang === 'kn' ? 'ದೇಹ ಪ್ರಕೃತಿ (ತನು ಭಾವ)' : currentLang === 'hi' ? 'शारीरिक प्रकृति' : 'Tanu Constitution'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-rose-300 font-mono uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ದುರ್ಬಲ ಗ್ರಹ (ಚಿಕಿತ್ಸೆ)' : currentLang === 'hi' ? 'निर्बल ग्रह (चिकित्सा)' : 'Weakest Planet'}
            </span>
            <div className="font-bold text-rose-400 text-xs sm:text-sm">
              {yogaPlan.weakestPlanet.name} ({yogaPlan.weakestPlanet.score}/100)
            </div>
            <span className="text-[10px] text-stone-300 block">
              {currentLang === 'kn' ? 'ಪರಿಹಾರಾಸನ ಅಗತ್ಯ' : currentLang === 'hi' ? 'चिकित्सकीय आसन' : 'Therapeutic Focus'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ಪ್ರಬಲ ಗ್ರಹ (ಚೈತನ್ಯ)' : currentLang === 'hi' ? 'बलवान ग्रह (ओज)' : 'Strongest Planet'}
            </span>
            <div className="font-bold text-emerald-400 text-xs sm:text-sm">
              {yogaPlan.strongestPlanet.name} ({yogaPlan.strongestPlanet.score}/100)
            </div>
            <span className="text-[10px] text-stone-300 block">
              {currentLang === 'kn' ? 'ಉತ್ಸಾಹದಾಯಕ ಆಸನ' : currentLang === 'hi' ? 'ओज वर्धक आसन' : 'Energizing Potential'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[10px] text-sky-300 font-mono uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ಪ್ರಮುಖ ಪಂಚಭೂತ ತತ್ವ' : currentLang === 'hi' ? 'प्रधान पंचभूत' : 'Dominant Element'}
            </span>
            <div className="font-bold text-sky-300 text-xs sm:text-sm">
              {yogaPlan.elementalBreakdown.dominantElement}
            </div>
            <span className="text-[10px] text-stone-300 block truncate" title={yogaPlan.elementalBreakdown.balancingAdvice[currentLang]}>
              {currentLang === 'kn' ? 'ಪೋಷಕ ಆಸನಗಳು' : currentLang === 'hi' ? 'संतुलनकारी आसन' : 'Balancing Priority'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'routine'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{currentLang === 'kn' ? 'ವೈಯಕ್ತಿಕ ದಿನಚರಿ (೪ ಹಂತಗಳು)' : currentLang === 'hi' ? 'व्यक्तिगत दिनचर्या (४ चरण)' : 'Personalized Routine'}</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-indigo-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-300" />
          <span>{currentLang === 'kn' ? 'ಗ್ರಹಾವಾರು ಯೋಗಾಸನ ಮಂಡಲ (೯ ಗ್ರಹಗಳು)' : currentLang === 'hi' ? 'ग्रहानुसार योगासन मण्डल (९ ग्रह)' : 'Graha-to-Asana Directory'}</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'diagnostic'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-300" />
          <span>{currentLang === 'kn' ? 'ದೈಹಿಕ ಸಮತೋಲನ ಪರೀಕ್ಷೆ' : currentLang === 'hi' ? 'शारीरिक संतुलन विश्लेषण' : 'Physical Balance Diagnostic'}</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Play className="w-4 h-4 text-rose-300" />
          <span>{currentLang === 'kn' ? 'ಅಭ್ಯಾಸ & ಪ್ರಾಣಾಯಾಮ ಗಡಿಯಾರ' : currentLang === 'hi' ? 'अभ्यास व प्राणायाम टाइमर' : 'Practice & Breath Timer'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONALIZED DAILY ROUTINE */}
      {/* ========================================================================= */}
      {activeTab === 'routine' && (
        <div className="space-y-6">
          {/* Elemental Balancing Alert Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-400/40 text-stone-800 dark:text-stone-200 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                {currentLang === 'kn' ? 'ಪಂಚಭೂತ ತತ್ವ ಸಮತೋಲನ ಸಲಹೆ' : currentLang === 'hi' ? 'पंचभूत तत्त्व संतुलन परामर्श' : 'Planetary Elemental Guidance'}
              </h4>
              <p className="text-xs leading-relaxed">
                {yogaPlan.elementalBreakdown.balancingAdvice[currentLang]}
              </p>
            </div>
          </div>

          {/* 4 Sequential Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogaPlan.customSequence.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-md hover:border-amber-400 dark:hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                      {item.title[currentLang]}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                      {item.grahaSource}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white">
                      {item.asana.sanskritName}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      {item.asana.name[currentLang]}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.rationale[currentLang]}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">
                        {currentLang === 'kn' ? 'ಚಕ್ರ' : currentLang === 'hi' ? 'चक्र' : 'Chakra'}
                      </span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {item.asana.targetChakra[currentLang]}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">
                        {currentLang === 'kn' ? 'ಹಿಡಿಯುವ ಅವಧಿ' : currentLang === 'hi' ? 'अवधि' : 'Duration'}
                      </span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {item.asana.holdDuration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <span className="text-[10px] text-stone-400 font-mono">
                    {item.asana.poseLevel} Pose
                  </span>

                  <button
                    onClick={() => handleStartPractice(item.asana, 45)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{currentLang === 'kn' ? 'ಅಭ್ಯಾಸ ಆರಂಭಿಸಿ' : currentLang === 'hi' ? 'अभ्यास शुरू करें' : 'Practice Now'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Pranayama & Mudra Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-stone-900 border-2 border-indigo-500/30 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-400/20">
              <span className="text-2xl">🌬️</span>
              <div>
                <h3 className="font-serif font-black text-base sm:text-lg text-amber-200">
                  {currentLang === 'kn' ? 'ದೈನಂದಿನ ಪ್ರಾಣಾಯಾಮ ಹಾಗೂ ಮುದ್ರಾ ಚಿಕಿತ್ಸೆ' : currentLang === 'hi' ? 'दैनिक प्राणायाम एवं मुद्रा साधना' : 'Prescribed Pranayama & Mudra Therapy'}
                </h3>
                <p className="text-xs text-indigo-200/80">
                  {currentLang === 'kn'
                    ? `ನಿಮ್ಮ ಜಾತಕದ ದುರ್ಬಲ ಗ್ರಹವಾದ ${yogaPlan.weakestPlanet.name} ದೋಷ ಶಾಂತಿಗಾಗಿ ವಿಶೇಷ ಉಸಿರಾಟ ಹಾಗೂ ಮುದ್ರೆ.`
                    : currentLang === 'hi'
                    ? `आपकी कुण्डली के निर्बल ग्रह ${yogaPlan.weakestPlanet.name} की शांति हेतु विशेष श्वास-प्रश्वास साधना।`
                    : `Specific breath and hand gesture therapy prescribed to harmonize ${yogaPlan.weakestPlanet.name}.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                    Pranayama (Breath Control)
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {yogaPlan.dailyPranayama.duration[currentLang]}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">
                  {yogaPlan.dailyPranayama.name[currentLang]}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {yogaPlan.dailyPranayama.instructions[currentLang]}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Hasta Mudra (Energy Seal)
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">Daily 15m</span>
                </div>
                <h4 className="font-bold text-sm text-white">
                  {yogaPlan.dailyMudra.name[currentLang]}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {yogaPlan.dailyMudra.instructions[currentLang]}
                </p>
                <p className="text-[11px] text-emerald-300/90 font-medium">
                  ✦ {yogaPlan.dailyMudra.benefits[currentLang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GRAHA-TO-ASANA DIRECTORY (ALL 9 PLANETS) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Planet Selection Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {Object.keys(GRAHA_YOGA_PROFILES).map((pKey) => {
              const profile = GRAHA_YOGA_PROFILES[pKey];
              const isSelected = selectedPlanetKey === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setSelectedPlanetKey(pKey)}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md border-amber-400 scale-[1.03] ring-2 ring-amber-400/60 font-black'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                  }`}
                >
                  <span className="text-base sm:text-lg mb-0.5">
                    {pKey === 'Sun' ? '☀️' : pKey === 'Moon' ? '🌙' : pKey === 'Mars' ? '🔥' : pKey === 'Mercury' ? '🌿' : pKey === 'Jupiter' ? '🌟' : pKey === 'Venus' ? '💎' : pKey === 'Saturn' ? '🪐' : pKey === 'Rahu' ? '🌪️' : '✨'}
                  </span>
                  <span className="text-[11px] font-bold leading-tight truncate w-full">
                    {pKey}
                  </span>
                  <span className="text-[8px] text-stone-400 dark:text-stone-500 font-mono">
                    {profile.element.en.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Planet Comprehensive Detail Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {selectedPlanetKey === 'Sun' ? '☀️' : selectedPlanetKey === 'Moon' ? '🌙' : selectedPlanetKey === 'Mars' ? '🔥' : selectedPlanetKey === 'Mercury' ? '🌿' : selectedPlanetKey === 'Jupiter' ? '🌟' : selectedPlanetKey === 'Venus' ? '💎' : selectedPlanetKey === 'Saturn' ? '🪐' : selectedPlanetKey === 'Rahu' ? '🌪️' : '✨'}
                  </span>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-stone-900 dark:text-white">
                    {selectedProfile.grahaTitle[currentLang]}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                  <span>{selectedProfile.element[currentLang]}</span>
                  <span>•</span>
                  <span>{selectedProfile.chakra[currentLang]}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 text-xs">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Bija Mantra</span>
                <span className="font-serif font-bold text-amber-700 dark:text-amber-400">
                  {selectedProfile.bijaMantra}
                </span>
              </div>
            </div>

            {/* Governed Parts & Imbalances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                  {currentLang === 'kn' ? 'ಆಳ್ವಿಕೆಯ ದೇಹಭಾಗಗಳು' : currentLang === 'hi' ? 'शासित शारीरिक अंग' : 'Governed Body Parts'}
                </span>
                <p className="font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
                  {selectedProfile.governedBodyParts[currentLang]}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-300/40 dark:border-rose-900/40 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  {currentLang === 'kn' ? 'ಗ್ರಹ ದೋಷದ ದೈಹಿಕ ಲಕ್ಷಣಗಳು' : currentLang === 'hi' ? 'ग्रह दोष के शारीरिक लक्षण' : 'Imbalance Symptoms'}
                </span>
                <ul className="space-y-1 text-stone-700 dark:text-stone-300">
                  {selectedProfile.imbalanceSymptoms.map((sym, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                      <span>{sym[currentLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Yogasanas */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                {currentLang === 'kn' 
                  ? `${selectedPlanetKey} ಗ್ರಹದ ಸಮತೋಲನ ಆಸನಗಳು` 
                  : currentLang === 'hi' 
                  ? `${selectedPlanetKey} ग्रह हेतु निर्धारित योगासन` 
                  : `Prescribed Postures for ${selectedPlanetKey}`}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProfile.suggestedAsanas.map((asana) => (
                  <div
                    key={asana.id}
                    className="p-4 rounded-2xl bg-amber-500/5 dark:bg-stone-800/60 border border-amber-300/50 dark:border-stone-700/60 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-base text-stone-900 dark:text-white">
                          {asana.sanskritName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
                          {asana.poseLevel}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {asana.name[currentLang]}
                      </p>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {asana.astrologicalBalancing[currentLang]}
                      </p>

                      <div className="space-y-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <div className="font-bold text-stone-700 dark:text-stone-200">
                          {currentLang === 'kn' ? 'ವಿಧಿ ವಿಧಾನಗಳು:' : currentLang === 'hi' ? 'विधि:' : 'Execution Steps:'}
                        </div>
                        <ol className="space-y-1 pl-1">
                          {asana.steps.map((st, sIdx) => (
                            <li key={sIdx} className="leading-tight">
                              {st[currentLang]}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-500 dark:text-stone-400 space-y-1">
                        <div>
                          <strong className="text-stone-700 dark:text-stone-300">
                            {currentLang === 'kn' ? 'ಉಸಿರಾಟ:' : currentLang === 'hi' ? 'श्वास:' : 'Breath:'}
                          </strong>{' '}
                          {asana.breathingCues[currentLang]}
                        </div>
                        <div>
                          <strong className="text-rose-600 dark:text-rose-400">
                            {currentLang === 'kn' ? 'ಎಚ್ಚರಿಕೆ:' : currentLang === 'hi' ? 'सावधानी:' : 'Caution:'}
                          </strong>{' '}
                          {asana.contraindications[currentLang]}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartPractice(asana, 45)}
                      className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{currentLang === 'kn' ? 'ಈ ಆಸನವನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ (ಗಡಿಯಾರ)' : currentLang === 'hi' ? 'इस आसन का अभ्यास करें' : 'Practice This Asana with Timer'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PHYSICAL BALANCING DIAGNOSTIC */}
      {/* ========================================================================= */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white">
                {currentLang === 'kn' ? 'ದೈಹಿಕ ಮತ್ತು ಶಾರೀರಿಕ ಸಮತೋಲನ ಪರೀಕ್ಷೆ' : currentLang === 'hi' ? 'शारीरिक संतुलन एवं बायो-एनर्जी रडार' : 'Physical Balancing & Bio-Energetic Diagnostic'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {currentLang === 'kn'
                  ? 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯಲ್ಲಿರುವ ಗ್ರಹಗಳ ಬಲ ಹಾಗೂ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಶರೀರದ ಪ್ರಮುಖ ೬ ವ್ಯವಸ್ಥೆಗಳ ಸಮತೋಲನ ಮಟ್ಟ.'
                  : currentLang === 'hi'
                  ? 'आपकी कुण्डली के ग्रहों के षड्बल एवं तत्त्वों के आधार पर शरीर की ६ प्रमुख प्रणालियों का विश्लेषण।'
                  : "Bio-energetic assessment of your body's 6 physiological systems calculated from planetary strength and house placements."}
              </p>
            </div>

            {/* Radar Chart */}
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#a8a29e" strokeOpacity={0.3} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#a8a29e', fontSize: 9 }} />
                  <Radar
                    name="Body Balance Score"
                    dataKey="A"
                    stroke="#d97706"
                    fill="#f59e0b"
                    fillOpacity={0.45}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', borderColor: '#d97706', borderRadius: '12px', color: '#fff', fontSize: '11px' }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* System Scores Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: { en: 'Spinal Alignment', kn: 'ಬೆನ್ನೆಲುಬು ನೇರತೆ', hi: 'मेरुदण्ड संरेखण' }, score: yogaPlan.physicalBalanceScores.spinalAlignment, planet: 'Sun', color: 'text-amber-500' },
                { label: { en: 'Muscular Stamina', kn: 'ಸ್ನಾಯು ತ್ರಾಣ', hi: 'मांसपेशीय बल' }, score: yogaPlan.physicalBalanceScores.muscularStamina, planet: 'Mars', color: 'text-red-500' },
                { label: { en: 'Joint Flexibility', kn: 'ಕೀಲು ನಮ್ಯತೆ', hi: 'जोड़ लचीलापन' }, score: yogaPlan.physicalBalanceScores.jointFlexibility, planet: 'Saturn', color: 'text-blue-500' },
                { label: { en: 'Nervous Stability', kn: 'ನರಮಂಡಲ ಸ್ಥಿರತೆ', hi: 'तंत्रिका स्थिरता' }, score: yogaPlan.physicalBalanceScores.nervousStability, planet: 'Mercury', color: 'text-emerald-500' },
                { label: { en: 'Cardio Vitality', kn: 'ಹೃದಯ ಚೈತನ್ಯ', hi: 'हृदय ओज' }, score: yogaPlan.physicalBalanceScores.cardioVitality, planet: 'Sun/Moon', color: 'text-rose-500' },
                { label: { en: 'Digestive Agni', kn: 'ಜಠರಾಗ್ನಿ', hi: 'जठराग्नि' }, score: yogaPlan.physicalBalanceScores.digestiveAgni, planet: 'Mars/Jupiter', color: 'text-orange-500' }
              ].map((sys, sIdx) => (
                <div key={sIdx} className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>{sys.planet}</span>
                    <span className={`font-bold ${sys.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : sys.score >= 55 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {sys.score}%
                    </span>
                  </div>
                  <div className="font-bold text-xs text-stone-800 dark:text-stone-200 truncate">
                    {sys.label[currentLang]}
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sys.score >= 70 ? 'bg-emerald-500' : sys.score >= 55 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${sys.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRACTICE & BREATH TIMER */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-950 border-2 border-indigo-500/40 text-white shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-400/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                Vedic Asana Meditation & Breath Tracker
              </span>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                {activePracticeAsana.sanskritName} • {activePracticeAsana.name[currentLang]}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                  soundEnabled 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
                    : 'bg-white/10 text-stone-400 border-white/20'
                }`}
                title="Toggle Bell Chime Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Time selection buttons */}
              {[30, 45, 60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setTimerDuration(sec);
                    setTimerRemaining(sec);
                    setIsTimerRunning(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                    timerDuration === sec && !isTimerRunning
                      ? 'bg-amber-500 text-stone-950 border-amber-400'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Central Breath Guide Circle & Timer */}
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Expanding and contracting pulse circle based on breath phase */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathPhase === 'inhale' 
                    ? 'scale-110 bg-amber-500/20 ring-4 ring-amber-400/60' 
                    : breathPhase === 'hold'
                    ? 'scale-105 bg-indigo-500/20 ring-4 ring-indigo-400/60'
                    : 'scale-90 bg-rose-500/20 ring-4 ring-rose-400/60'
                }`} 
              />

              <div className="relative z-10 text-center space-y-1">
                <div className="font-mono font-black text-4xl sm:text-5xl text-white tracking-wider">
                  {Math.floor(timerRemaining / 60)}:{String(timerRemaining % 60).padStart(2, '0')}
                </div>
                <div className="text-xs uppercase font-mono font-bold tracking-widest text-amber-300">
                  {isTimerRunning ? (
                    breathPhase === 'inhale' ? '🌬️ Inhale (ಪೂರಕ)' :
                    breathPhase === 'hold' ? '⏳ Hold (ಕುಂಭಕ)' : '💨 Exhale (ರೇಚಕ)'
                  ) : (
                    'Ready to Begin'
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (timerRemaining === 0) setTimerRemaining(timerDuration);
                  setIsTimerRunning(!isTimerRunning);
                  if (!isTimerRunning) playBellSound(528);
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-stone-950 font-black text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
              >
                {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Posture Cues & Alignment Guidance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-amber-200">
              {currentLang === 'kn' ? 'ಆಸನದ ಸೂಚನೆಗಳು ಹಾಗೂ ಉಸಿರಾಟದ ಸಮನ್ವಯ' : currentLang === 'hi' ? 'आसन निर्देश एवं श्वास समन्वय' : 'Alignment Cues & Breathing Harmony'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-300">
              <div>
                <strong className="text-white block mb-0.5">
                  {currentLang === 'kn' ? 'ಉಸಿರಾಟ ವಿಧಾನ:' : currentLang === 'hi' ? 'श्वास:' : 'Breath Sync:'}
                </strong>
                <p>{activePracticeAsana.breathingCues[currentLang]}</p>
              </div>

              <div>
                <strong className="text-white block mb-0.5">
                  {currentLang === 'kn' ? 'ಮುಖ್ಯ ಪ್ರಯೋಜನ:' : currentLang === 'hi' ? 'लाभ:' : 'Key Benefit:'}
                </strong>
                <p>{activePracticeAsana.physicalBenefits[currentLang]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
