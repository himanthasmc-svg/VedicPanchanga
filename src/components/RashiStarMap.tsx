import React, { useMemo, useState } from 'react';
import {
  Compass,
  Eye,
  MapPin,
  Sparkles,
  Star,
  Clock,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CityLocation, KundaliData, Language } from '../types';
import {
  RASHI_CONSTELLATIONS,
  getAllRashisSkyPositions,
} from '../utils/rashiConstellations';
import { NAKSHATRA_AKSHARAS } from '../utils/nakshatraAksharas';
import { SvgGrahaIcon } from './RealisticGraha';

interface RashiStarMapProps {
  currentLang: Language;
  kundaliData: KundaliData;
  dateStr: string;
  timeStr: string;
  selectedCity: CityLocation;
  initialRashiIndex?: number;
}

export const RashiStarMap: React.FC<RashiStarMapProps> = ({
  currentLang,
  kundaliData,
  dateStr,
  timeStr,
  selectedCity,
  initialRashiIndex = 0,
}) => {
  const [selectedRashiIdx, setSelectedRashiIdx] = useState<number>(initialRashiIndex);
  const [useEveningSkyPreview, setUseEveningSkyPreview] = useState<boolean>(false);

  const effectiveTimeStr = useEveningSkyPreview ? '21:00' : timeStr || '21:00';

  const allSkyPositions = useMemo(
    () => getAllRashisSkyPositions(dateStr, effectiveTimeStr, selectedCity),
    [dateStr, effectiveTimeStr, selectedCity]
  );

  const activeConstellation = RASHI_CONSTELLATIONS[selectedRashiIdx] || RASHI_CONSTELLATIONS[0];
  const activeSkyPos = allSkyPositions[selectedRashiIdx] || allSkyPositions[0];

  // Constituent 9 Padas & Nakshatras belonging to this Rashi
  const rashiPadas = useMemo(
    () => NAKSHATRA_AKSHARAS.filter((p) => p.rashiIndex === selectedRashiIdx),
    [selectedRashiIdx]
  );

  // Planets currently located in this Rashi
  const planetsInRashi = useMemo(
    () => kundaliData.planets.filter((p) => p.rashiIndex === selectedRashiIdx),
    [kundaliData.planets, selectedRashiIdx]
  );

  // Visible Rashis right now above horizon
  const visibleNowCount = allSkyPositions.filter((s) => s.visibilityStatus !== 'below_horizon').length;

  // Compass dial pointer angle (0° North at top, clockwise)
  const azRad = ((activeSkyPos.azimuthDeg - 90) * Math.PI) / 180;
  const pointerR = 52;
  const px = 75 + pointerR * Math.cos(azRad);
  const py = 75 + pointerR * Math.sin(azRad);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/90 to-stone-950 text-white border-2 border-sky-500/45 shadow-2xl overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-sky-500/25 pb-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400 text-sky-300 flex items-center justify-center shrink-0 shadow-md">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                {currentLang === 'kn'
                  ? 'ರಾಶಿ ನಕ್ಷತ್ರ ವಿನ್ಯಾಸ & ಆಕಾಶ ದಿಕ್ಕು ಮಾರ್ಗದರ್ಶಿ (Rashi Star Map & Sky Direction)'
                  : currentLang === 'hi'
                  ? 'राशि तारा-विन्यास एवं आकाश दिशा दर्शक (Rashi Star Map)'
                  : 'Interactive Rashi Star Map & Night Sky Direction Finder'}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                {visibleNowCount}/12 {currentLang === 'kn' ? 'ಆಕಾಶದಲ್ಲಿ ಗೋಚರ' : 'Above Horizon'}
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              {currentLang === 'kn'
                ? 'ಪ್ರತಿಯೊಂದು ರಾಶಿಯನ್ನು ಗುರುತಿಸುವ ಆಕಾಶದ ನೈಜ ತಾರಾ ವಿನ್ಯಾಸ, ಮುಖ್ಯ ತಾರೆಗಳು ಮತ್ತು ನಿಮ್ಮ ನಗರದಿಂದ ಯಾವ ದಿಕ್ಕಿನಲ್ಲಿ ನೋಡಬೇಕು ಎಂಬ ನಿಖರ ದಿಕ್ಸೂಚಿ.'
                : 'Explore the real star constellation pattern that identifies each Rashi and see the exact compass direction & elevation to spot it from your location.'}
            </p>
          </div>
        </div>

        {/* Time Mode Switcher (Selected Kundali Time vs 9:00 PM Night Sky) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 font-mono text-[11px] text-sky-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {selectedCity.name} • {dateStr} • {effectiveTimeStr}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseEveningSkyPreview(!useEveningSkyPreview)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
              useEveningSkyPreview
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-white/10 text-stone-200 border-white/20 hover:bg-white/15'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {useEveningSkyPreview
                ? currentLang === 'kn'
                  ? 'ರಾತ್ರಿ ೯ ಗಂಟೆ ಆಕಾಶ (ON)'
                  : '9:00 PM Night Sky (ON)'
                : currentLang === 'kn'
                ? 'ರಾತ್ರಿ ೯ ಗಂಟೆ ನೋಟಕ್ಕೆ ಬದಲಿಸಿ'
                : 'Preview 9:00 PM Night Sky'}
            </span>
          </button>
        </div>
      </div>

      {/* 12-Rashi Interactive Selector Strip */}
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
        {RASHI_CONSTELLATIONS.map((rashi) => {
          const skyPos = allSkyPositions[rashi.rashiIndex];
          const isSelected = selectedRashiIdx === rashi.rashiIndex;
          const isVisible = skyPos.visibilityStatus !== 'below_horizon';

          return (
            <button
              key={rashi.rashiIndex}
              type="button"
              onClick={() => setSelectedRashiIdx(rashi.rashiIndex)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-0.5 ${
                isSelected
                  ? 'bg-amber-500/25 border-amber-400 text-white ring-1 ring-amber-400 shadow-md'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:border-sky-400/50'
              }`}
            >
              <div className="flex items-center justify-between w-full text-[9.5px] font-mono">
                <span className="text-amber-300 font-bold">{rashi.symbol}</span>
                <span
                  className={`px-1 rounded text-[8.5px] font-bold ${
                    isVisible
                      ? 'bg-emerald-500/25 text-emerald-300'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {isVisible ? skyPos.compassCode : 'LOW'}
                </span>
              </div>
              <span className="font-serif font-bold text-[11px] truncate max-w-full">
                {rashi.rashiName[currentLang].split('(')[0].trim()}
              </span>
              <span className="text-[9px] font-mono text-sky-300">
                {skyPos.altitudeDeg > 0 ? `+${skyPos.altitudeDeg}°` : `${skyPos.altitudeDeg}°`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Display: Star Arrangement SVG + Live Direction Compass Helper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left (7 Cols): Authentic Constellation Star Arrangement Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-sky-500/35 p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg text-amber-400">{activeConstellation.symbol}</span>
                <h4 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                  {activeConstellation.rashiName[currentLang]}
                </h4>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {activeConstellation.siderealStartDeg}° – {activeConstellation.siderealEndDeg}°
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5 font-semibold">
                {activeConstellation.shapeTitle[currentLang]}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedRashiIdx((selectedRashiIdx + 11) % 12)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
                title="Previous Rashi"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedRashiIdx((selectedRashiIdx + 1) % 12)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 cursor-pointer"
                title="Next Rashi"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* High-Contrast Astronomical Constellation Star Field SVG */}
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-sky-400/30 bg-[radial-gradient(circle_at_50%_45%,#0f2347_0%,#060d1f_65%,#020612_100%)]">
            <svg viewBox="-56 -36 112 72" className="w-full h-full">
              <defs>
                <filter id="star-halo" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.1" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Subtle Celestial Coordinate Grid */}
              <line x1="-56" y1="0" x2="56" y2="0" stroke="rgba(148,163,184,0.12)" strokeWidth="0.25" strokeDasharray="1.5,1.5" />
              <line x1="0" y1="-36" x2="0" y2="36" stroke="rgba(148,163,184,0.12)" strokeWidth="0.25" strokeDasharray="1.5,1.5" />
              <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="0.25" strokeDasharray="1.5,1.5" />

              {/* Deterministic Faint Background Field Stars */}
              {Array.from({ length: 38 }).map((_, i) => {
                const sx = (((i * 37 + selectedRashiIdx * 19) % 104) - 52);
                const sy = (((i * 53 + selectedRashiIdx * 23) % 64) - 32);
                return (
                  <circle
                    key={`bg-${i}`}
                    cx={sx}
                    cy={sy}
                    r={(i % 3 === 0 ? 0.45 : 0.25)}
                    fill="#cbd5e1"
                    opacity={0.22 + (i % 4) * 0.12}
                  />
                );
              })}

              {/* Constellation Connecting Figure Lines */}
              {activeConstellation.lines.map(([a, b], idx) => {
                const sA = activeConstellation.stars[a];
                const sB = activeConstellation.stars[b];
                if (!sA || !sB) return null;
                return (
                  <line
                    key={`line-${idx}`}
                    x1={sA.x}
                    y1={sA.y}
                    x2={sB.x}
                    y2={sB.y}
                    stroke="#38bdf8"
                    strokeWidth="0.55"
                    strokeOpacity="0.72"
                  />
                );
              })}

              {/* Named Real Constellation Stars */}
              {activeConstellation.stars.map((star, sIdx) => {
                const r = Math.max(0.95, 2.5 - star.mag * 0.32);
                const labelY = star.y > 18 ? star.y - r - 2.2 : star.y + r + 3.4;
                return (
                  <g key={`st-${sIdx}`}>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={r * 2.1}
                      fill={star.color}
                      opacity={star.isPrimary ? 0.3 : 0.18}
                      filter="url(#star-halo)"
                    />
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={r}
                      fill={star.color}
                      stroke="#ffffff"
                      strokeWidth={star.isPrimary ? '0.35' : '0.15'}
                    />
                    {/* 4-point diffraction spikes on bright anchor stars */}
                    {star.isPrimary && (
                      <>
                        <line x1={star.x - r * 2.4} y1={star.y} x2={star.x + r * 2.4} y2={star.y} stroke={star.color} strokeWidth="0.25" opacity="0.85" />
                        <line x1={star.x} y1={star.y - r * 2.4} x2={star.x} y2={star.y + r * 2.4} stroke={star.color} strokeWidth="0.25" opacity="0.85" />
                      </>
                    )}
                    <text
                      x={star.x}
                      y={labelY}
                      fill={star.isPrimary ? '#fef08a' : '#e2e8f0'}
                      fontSize={star.isPrimary ? '2.7' : '2.15'}
                      fontWeight={star.isPrimary ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {star.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Corner Labels */}
            <div className="absolute top-2 left-2.5 text-[10px] font-mono text-sky-300/90 bg-slate-950/75 px-2 py-0.5 rounded border border-sky-500/30">
              {activeConstellation.stars.length} {currentLang === 'kn' ? 'ಪ್ರಮುಖ ತಾರೆಗಳು' : 'Key Stars'}
            </div>
            <div className="absolute bottom-2 right-2.5 text-[10px] font-mono text-amber-300/90 bg-slate-950/75 px-2 py-0.5 rounded border border-amber-500/30">
              RA {activeConstellation.raHours.toFixed(1)}h • Dec {activeConstellation.decDeg >= 0 ? `+${activeConstellation.decDeg}°` : `${activeConstellation.decDeg}°`}
            </div>
          </div>

          {/* Recognition & Star-Hopping Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <strong className="text-amber-300 flex items-center gap-1.5 font-serif">
                <Eye className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಆಕಾಶದಲ್ಲಿ ಹೇಗೆ ಗುರುತಿಸಬೇಕು?' : 'How to Recognize This Star Pattern'}</span>
              </strong>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {activeConstellation.howToIdentify[currentLang]}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-sky-400/20 space-y-1">
              <strong className="text-sky-300 flex items-center gap-1.5 font-serif">
                <Navigation className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಹತ್ತಿರದ ತಾರೆಗಳಿಂದ ಹುಡುಕುವ ವಿಧಾನ:' : 'Star-Hopping Trick (Sky Landmark)'}</span>
              </strong>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {activeConstellation.starHoppingGuide[currentLang]}
              </p>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Live Local Sky Direction Helper & Horizon Compass Dial */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/95 border border-amber-500/35 p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>{currentLang === 'kn' ? 'ಆಕಾಶ ದಿಕ್ಕು ಮಾರ್ಗದರ್ಶಿ' : 'Live Sky Direction Helper'}</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeSkyPos.visibilityStatus === 'high'
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                    : activeSkyPos.visibilityStatus === 'rising_or_low'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                }`}
              >
                {activeSkyPos.visibilityStatus === 'high'
                  ? currentLang === 'kn'
                    ? 'ಗೋಚರ'
                    : 'Visible High'
                  : activeSkyPos.visibilityStatus === 'rising_or_low'
                  ? currentLang === 'kn'
                    ? 'ದಿಗಂತದ ಬಳಿ'
                    : 'Near Horizon'
                  : currentLang === 'kn'
                  ? 'ದಿಗಂತದ ಕೆಳಗೆ'
                  : 'Below Horizon'}
              </span>
            </div>

            {/* Visual Horizon Compass Dial */}
            <div className="flex items-center gap-4">
              <div className="w-[130px] h-[130px] shrink-0 mx-auto sm:mx-0">
                <svg viewBox="0 0 150 150" className="w-full h-full">
                  <circle cx="75" cy="75" r="64" fill="#020617" stroke="rgba(251,191,36,0.45)" strokeWidth="2" />
                  <circle cx="75" cy="75" r="42" fill="none" stroke="rgba(56,189,248,0.22)" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="75" cy="75" r="20" fill="none" stroke="rgba(56,189,248,0.18)" strokeWidth="1" />
                  <line x1="75" y1="15" x2="75" y2="135" stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
                  <line x1="15" y1="75" x2="135" y2="75" stroke="rgba(148,163,184,0.22)" strokeWidth="1" />

                  <text x="75" y="10" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
                  <text x="142" y="78" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">E</text>
                  <text x="75" y="147" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">S</text>
                  <text x="8" y="78" fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="middle">W</text>

                  {/* Azimuth Direction Pointer */}
                  <line
                    x1="75"
                    y1="75"
                    x2={px}
                    y2={py}
                    stroke={activeSkyPos.visibilityStatus === 'below_horizon' ? '#f43f5e' : '#fbbf24'}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="5.5"
                    fill={activeSkyPos.visibilityStatus === 'below_horizon' ? '#f43f5e' : '#34d399'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="75" cy="75" r="4" fill="#38bdf8" />
                </svg>
              </div>

              <div className="space-y-1.5 text-xs flex-1 min-w-0">
                <div className="text-base font-serif font-black text-amber-300">
                  {activeSkyPos.compassLabel[currentLang]}
                </div>
                <div className="font-mono text-[11px] text-sky-300">
                  Azimuth: <strong>{activeSkyPos.azimuthDeg}°</strong> • Altitude:{' '}
                  <strong>{activeSkyPos.altitudeDeg}°</strong>
                </div>
                <div className="text-[11px] text-emerald-300 font-semibold">
                  {activeSkyPos.visibilityLabel[currentLang]}
                </div>
                <div className="text-[10.5px] text-stone-400">
                  {activeSkyPos.culminationHint[currentLang]}
                </div>
              </div>
            </div>

            {/* Clear Human-Readable Instruction Box */}
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-100 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">
                {currentLang === 'kn' ? 'ಈಗ ಆಕಾಶದಲ್ಲಿ ಎಲ್ಲಿ ನೋಡಬೇಕು?' : 'Where to Look in the Sky:'}
              </strong>
              <span>{activeSkyPos.directionAdvice[currentLang]}</span>
            </div>
          </div>

          {/* Best Viewing Season & Grahas Currently in This Rashi */}
          <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-stone-400">
                {currentLang === 'kn' ? 'ಉತ್ತಮ ದರ್ಶನ ತಿಂಗಳು:' : 'Best Evening Viewing:'}
              </span>
              <strong className="text-sky-300 font-mono">
                {activeConstellation.bestViewingMonths[currentLang]}
              </strong>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-stone-400">
                {currentLang === 'kn' ? 'ರಾಶ್ಯಾಧಿಪತಿ & ತತ್ವ:' : 'Rashi Lord & Element:'}
              </span>
              <strong className="text-amber-200">
                {activeConstellation.lord[currentLang]} • {activeConstellation.element[currentLang]}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-black/35 border border-white/10 space-y-1.5">
              <span className="text-[10.5px] font-mono uppercase text-emerald-300 font-bold block">
                {currentLang === 'kn'
                  ? `ಈ ರಾಶಿಯಲ್ಲಿರುವ ಗ್ರಹಗಳು (${dateStr}):`
                  : `Grahas Currently in ${activeConstellation.rashiName.en.split(' ')[0]}:`}
              </span>
              {planetsInRashi.length === 0 ? (
                <span className="text-[11px] text-stone-400">
                  {currentLang === 'kn'
                    ? 'ಈ ದಿನ ಯಾವುದೇ ಗ್ರಹಗಳು ಈ ರಾಶಿಯಲ್ಲಿಲ್ಲ.'
                    : 'No planets currently occupy this constellation.'}
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {planetsInRashi.map((p) => (
                    <span
                      key={p.name}
                      className="px-2 py-1 rounded-lg bg-white/10 border border-emerald-400/35 text-[11px] flex items-center gap-1.5"
                    >
                      <SvgGrahaIcon name={p.name} size={15} isRetrograde={p.isRetrograde} />
                      <strong className="text-white">{p.sanskritName[currentLang]}</strong>
                      <span className="font-mono text-amber-300">{p.degrees}°</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Constituent 9 Nakshatra Padas & Akshara Letters Belonging to This Rashi */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? `${activeConstellation.rashiName.kn} ರಾಶಿಯ ೯ ನಕ್ಷತ್ರ ಪಾದಗಳು & ಪಾದಾಕ್ಷರಗಳು`
                : `All 9 Nakshatra Padas & Letters Composing ${activeConstellation.rashiName.en}`}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
          {rashiPadas.map((pd, i) => (
            <div
              key={i}
              className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/30 space-y-0.5"
            >
              <div className="text-[9.5px] text-sky-300 font-semibold truncate">
                {pd.nakshatraName[currentLang].split('(')[0].trim()}
              </div>
              <div className="text-[9px] font-mono text-stone-400">P{pd.pada}</div>
              <div className="text-sm font-serif font-black text-amber-300">
                {currentLang === 'kn'
                  ? pd.aksharaKannada
                  : currentLang === 'hi'
                  ? pd.aksharaDevanagari
                  : pd.akshara}
              </div>
              <div className="text-[9px] font-mono text-stone-300">
                {pd.aksharaKannada}/{pd.akshara}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
