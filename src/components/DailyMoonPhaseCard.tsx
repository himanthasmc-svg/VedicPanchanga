import React from 'react';
import { Language } from '../types';
import { calculateMoonPhaseFromDate, LUNAR_PHASES, LunarPhaseResult } from '../utils/lunarPhase';
import { formatJustNumber } from '../utils/panchanga';

interface DailyMoonPhaseCardProps {
  date: Date | string;
  currentLang: Language;
  className?: string;
  showCycleTimeline?: boolean;
}

export const DailyMoonPhaseCard: React.FC<DailyMoonPhaseCardProps> = ({
  date,
  currentLang,
  className = '',
  showCycleTimeline = true
}) => {
  const moonPhase: LunarPhaseResult = calculateMoonPhaseFromDate(date, currentLang);

  // SVG representation for the Moon Disk based on phase and illumination
  const renderMoonSvg = () => {
    const radius = 38;
    const center = 45;
    const { illumination, isWaxing, phaseCode } = moonPhase;

    // Radius of curvature for the terminator ellipse
    // At New Moon: cx=center, r=radius (all dark)
    // At Quarter: terminator is a straight line
    // At Full Moon: all illuminated
    const k = (illumination / 100) * 2 - 1; // -1 (new) to 0 (half) to 1 (full)
    const rx = Math.abs(k * radius);

    // SVG path construction
    // For Waxing: illuminated on Right
    // For Waning: illuminated on Left
    let pathD = '';
    if (phaseCode === 'new_moon') {
      pathD = '';
    } else if (phaseCode === 'full_moon') {
      pathD = `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`;
    } else if (isWaxing) {
      // Waxing: right semicircle is always lit; terminator adds or subtracts from left
      if (k >= 0) {
        // Waxing Gibbous (>50%): right semicircle + left ellipse
        pathD = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} A ${rx} ${radius} 0 0 1 ${center} ${center - radius} Z`;
      } else {
        // Waxing Crescent (<50%): right semicircle minus left ellipse
        pathD = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} A ${rx} ${radius} 0 0 0 ${center} ${center - radius} Z`;
      }
    } else {
      // Waning: left semicircle is always lit; terminator adds or subtracts from right
      if (k >= 0) {
        // Waning Gibbous (>50%): left semicircle + right ellipse
        pathD = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} A ${rx} ${radius} 0 0 0 ${center} ${center - radius} Z`;
      } else {
        // Waning Crescent (<50%): left semicircle minus right ellipse
        pathD = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} A ${rx} ${radius} 0 0 1 ${center} ${center - radius} Z`;
      }
    }

    return (
      <svg viewBox="0 0 90 90" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_15px_rgba(253,224,71,0.25)] shrink-0">
        <defs>
          {/* Subtle 3D lunar glow */}
          <radialGradient id="lunarSurface" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="60%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="darkSide" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* Ambient Outer Halo */}
        <circle cx={center} cy={center} r={radius + 3} className="fill-amber-300/10 animate-pulse" />

        {/* Base Dark Moon Sphere */}
        <circle cx={center} cy={center} r={radius} fill="url(#darkSide)" stroke="#334155" strokeWidth="1" />

        {/* Subtle Dark Craters on unlit side */}
        <circle cx={center - 10} cy={center - 8} r="5" fill="#0f172a" opacity="0.4" />
        <circle cx={center + 12} cy={center + 10} r="7" fill="#0f172a" opacity="0.3" />

        {/* Illuminated portion */}
        {pathD && (
          <path d={pathD} fill="url(#lunarSurface)" />
        )}

        {/* Lunar Maria (seas) and craters on illuminated portion */}
        {illumination > 25 && (
          <g opacity="0.18">
            <ellipse cx={center - 6} cy={center - 5} rx="8" ry="6" fill="#78350f" />
            <ellipse cx={center + 8} cy={center + 2} rx="10" ry="7" fill="#78350f" />
            <circle cx={center - 2} cy={center + 12} r="5" fill="#78350f" />
          </g>
        )}

        {/* Limb rim highlight */}
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-stone-900 border-2 border-indigo-400/40 shadow-xl text-white relative overflow-hidden backdrop-blur-md ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-400/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 shadow-xs">
              {moonPhase.symbol}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wide">
                  {currentLang === 'kn' ? 'ದೈನಂದಿನ ಚಂದ್ರ ಕಲೆ & ಹಂತ' : currentLang === 'hi' ? 'दैनिक चन्द्र कला व चरण' : 'Daily Moon Phase & Lunar Cycle'}
                </h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  {currentLang === 'kn' ? 'ಖಗೋಳ ಚಾಂದ್ರಮಾನ' : 'Synodic Lunar Cycle'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                {currentLang === 'kn' 
                  ? 'ದಿನಾಂಕ ಆಧಾರಿತ ಚಂದ್ರನ ನಿಖರ ಕಲೆ, ಪ್ರಕಾಶಮಾನ ಶೇಕಡಾವಾರು ಮತ್ತು ಪಕ್ಷ ಪ್ರಗತಿ' 
                  : currentLang === 'hi'
                  ? 'दिनांक अनुसार चन्द्रमा की सटीक कला, प्रकाश प्रतिशत एवं चंद्र-चक्र'
                  : 'Calculated daily moon phase, optical illumination, and synodic lunar orbit progress'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-xs ${
              moonPhase.isWaxing 
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/40' 
                : 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40'
            }`}>
              <span>{moonPhase.isWaxing ? '📈' : '📉'}</span>
              <span>{moonPhase.pakshaLabel}</span>
            </span>
          </div>
        </div>

        {/* Main Moon Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Visual Moon Disk & Primary Name */}
          <div className="md:col-span-5 flex items-center gap-4 p-3.5 rounded-xl bg-black/40 border border-indigo-400/20 shadow-inner">
            {renderMoonSvg()}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                {moonPhase.symbol} {moonPhase.phaseCode.replace('_', ' ').toUpperCase()}
              </span>
              <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5 leading-snug">
                {moonPhase.phaseName}
              </h3>
              {currentLang !== 'en' && (
                <p className="text-xs text-indigo-200/70 font-sans">
                  ({moonPhase.phaseNameEn})
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  🌕 {moonPhase.illumination}% {currentLang === 'kn' ? 'ಪ್ರಕಾಶ' : currentLang === 'hi' ? 'प्रकाश' : 'Illumination'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Lunar Metrics Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {/* Metric 1: Lunar Age */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-indigo-400/20">
              <span className="text-[10px] text-indigo-200 font-sans block">
                🗓️ {currentLang === 'kn' ? 'ಚಾಂದ್ರ ವಯಸ್ಸು' : currentLang === 'hi' ? 'चन्द्र आयु' : 'Lunar Age'}
              </span>
              <p className="font-bold text-amber-200 text-sm mt-0.5">
                {formatJustNumber(moonPhase.lunarAgeDays, currentLang)} {currentLang === 'kn' ? 'ದಿನಗಳು' : currentLang === 'hi' ? 'दिन' : 'days'}
              </p>
              <span className="text-[9.5px] text-stone-400 font-sans block mt-0.5">
                {currentLang === 'kn' ? '೨೯.೫೩ ದಿನಗಳ ಚಕ್ರದಲ್ಲಿ' : 'of 29.53-day cycle'}
              </span>
            </div>

            {/* Metric 2: Orbit Progress */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-indigo-400/20">
              <span className="text-[10px] text-indigo-200 font-sans block">
                🔄 {currentLang === 'kn' ? 'ಕಕ್ಷೆ ಪ್ರಗತಿ' : currentLang === 'hi' ? 'चक्र प्रगति' : 'Cycle Progress'}
              </span>
              <p className="font-bold text-emerald-300 text-sm mt-0.5">
                {formatJustNumber(moonPhase.cycleProgressPercent, currentLang)}%
              </p>
              <span className="text-[9.5px] text-stone-400 font-sans block mt-0.5">
                {moonPhase.isWaxing ? (currentLang === 'kn' ? 'ವೃದ್ಧಿ ಹಂತ (ಬೆಳಕು)' : 'Waxing (Growing)') : (currentLang === 'kn' ? 'ಹ್ರಾಸ ಹಂತ (ಕತ್ತಲು)' : 'Waning (Shrinking)')}
              </span>
            </div>

            {/* Metric 3: Next Full Moon */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-indigo-400/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-300 font-sans block">
                🌕 {currentLang === 'kn' ? 'ಮುಂದಿನ ಹುಣ್ಣಿಮೆ' : currentLang === 'hi' ? 'अगली पूर्णिमा' : 'Next Full Moon'}
              </span>
              <p className="font-bold text-white text-sm mt-0.5">
                {moonPhase.daysToNextFullMoon <= 0.5 
                  ? (currentLang === 'kn' ? 'ಇಂದೇ ಹುಣ್ಣಿಮೆ!' : currentLang === 'hi' ? 'आज ही पूर्णिमा!' : 'Today (Full Moon)!')
                  : `${formatJustNumber(moonPhase.daysToNextFullMoon, currentLang)} ${currentLang === 'kn' ? 'ದಿನ' : 'days'}`}
              </p>
              <span className="text-[9.5px] text-stone-400 font-sans block mt-0.5">
                🌑 {currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆಗೆ:' : 'New Moon in:'} {formatJustNumber(moonPhase.daysToNextNewMoon, currentLang)}d
              </span>
            </div>
          </div>
        </div>

        {/* Phase Summary & Vedic Spiritual Guidance */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-400/20 text-xs space-y-1.5">
          <p className="text-stone-200 leading-relaxed">
            <span className="font-bold text-amber-300">
              {currentLang === 'kn' ? 'ಖಗೋಳ ವಿವರಣೆ:' : currentLang === 'hi' ? 'खगोलीय स्थिति:' : 'Astronomical Position:'}{' '}
            </span>
            {moonPhase.summary}
          </p>
          <p className="text-indigo-200/90 leading-relaxed">
            <span className="font-bold text-emerald-300">
              {currentLang === 'kn' ? 'ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವ:' : currentLang === 'hi' ? 'आध्यात्मिक महत्व:' : 'Spiritual & Sadhana Significance:'}{' '}
            </span>
            {moonPhase.spiritualSignificance}
          </p>
        </div>

        {/* 8-Phase Visual Track / Timeline */}
        {showCycleTimeline && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-300 mb-2">
              <span className="flex items-center gap-1.5">
                <span>🌒</span>
                <span>{currentLang === 'kn' ? '೮ ಚಾಂದ್ರ ಕಲೆಗಳ ಪರಿಕ್ರಮಣ ಪಥ' : currentLang === 'hi' ? '८ चंद्र कलाओं का परिक्रमण चक्र' : '8-Phase Synodic Lunar Sequence'}</span>
              </span>
              <span className="font-mono text-[10px] text-amber-300">
                {currentLang === 'kn' ? `ಪ್ರಸ್ತುತ: ${moonPhase.phaseName}` : `Active: ${moonPhase.phaseNameEn}`}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {LUNAR_PHASES.map((p, idx) => {
                const isActive = p.code === moonPhase.phaseCode;
                const phaseTitle = currentLang === 'kn' ? p.nameKn : currentLang === 'hi' ? p.nameHi : p.nameEn;
                return (
                  <div
                    key={p.code}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-amber-500/30 to-indigo-600/30 border-amber-400 shadow-md ring-1 ring-amber-300 scale-[1.03]'
                        : 'bg-black/30 border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                    title={phaseTitle}
                  >
                    <span className="text-xl block">{p.symbol}</span>
                    <span className={`text-[9.5px] font-semibold block mt-1 line-clamp-1 ${isActive ? 'text-amber-200 font-bold' : 'text-stone-300'}`}>
                      {phaseTitle}
                    </span>
                    {isActive && (
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-1 py-0.2 rounded mt-0.5 inline-block">
                        {currentLang === 'kn' ? 'ಇಂದು' : 'Today'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMoonPhaseCard;
