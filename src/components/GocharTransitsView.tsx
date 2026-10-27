import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  Eye, 
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Orbit,
  LayoutGrid
} from 'lucide-react';
import { CityLocation, Language } from '../types';
import { calculateGochar, getLocalizedPlaceName, CITIES, GocharPlanetInfo } from '../utils/panchanga';
import { SvgGrahaIcon, RealisticGraha, GRAHA_LOCALIZED_NAMES } from './RealisticGraha';

interface GocharTransitsViewProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity?: (city: CityLocation) => void;
  onOpenKundali?: () => void;
  isWidget?: boolean;
}

// 12 Zodiac signs clockwise starting from Aries (Mesha at 0°)
const ZODIAC_SIGNS = [
  { index: 0, en: 'Aries', kn: 'ಮೇಷ', hi: 'मेष', symbol: '♈', startAngle: 0 },
  { index: 1, en: 'Taurus', kn: 'ವೃಷಭ', hi: 'वृषभ', symbol: '♉', startAngle: 30 },
  { index: 2, en: 'Gemini', kn: 'ಮಿಥುನ', hi: 'मिथुन', symbol: '♊', startAngle: 60 },
  { index: 3, en: 'Cancer', kn: 'ಕರ್ಕ', hi: 'कर्क', symbol: '♋', startAngle: 90 },
  { index: 4, en: 'Leo', kn: 'ಸಿಂಹ', hi: 'सिंह', symbol: '♌', startAngle: 120 },
  { index: 5, en: 'Virgo', kn: 'ಕನ್ಯಾ', hi: 'कन्या', symbol: '♍', startAngle: 150 },
  { index: 6, en: 'Libra', kn: 'ತುಲಾ', hi: 'तुला', symbol: '♎', startAngle: 180 },
  { index: 7, en: 'Scorpio', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक', symbol: '♏', startAngle: 210 },
  { index: 8, en: 'Sagittarius', kn: 'ಧನುಸ್ಸು', hi: 'धनु', symbol: '♐', startAngle: 240 },
  { index: 9, en: 'Capricorn', kn: 'ಮಕರ', hi: 'मकर', symbol: '♑', startAngle: 270 },
  { index: 10, en: 'Aquarius', kn: 'ಕುಂಭ', hi: 'कुम्भ', symbol: '♒', startAngle: 300 },
  { index: 11, en: 'Pisces', kn: 'ಮೀನ', hi: 'मीन', symbol: '♓', startAngle: 330 },
];

export const GocharTransitsView: React.FC<GocharTransitsViewProps> = ({
  currentLang,
  selectedCity,
  onSelectCity,
  onOpenKundali,
  isWidget = false
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(!isWidget);
  const [viewMode, setViewMode] = useState<'orbital' | 'grid'>('orbital');
  const [inspectedPlanet, setInspectedPlanet] = useState<GocharPlanetInfo | null>(null);

  const gocharReport = useMemo(() => {
    return calculateGochar(selectedDate, selectedCity);
  }, [selectedDate, selectedCity]);

  // Set default inspected planet to Jupiter or first planet
  const activePlanet = inspectedPlanet || gocharReport.planets.find(p => p.name === 'Jupiter') || gocharReport.planets[0];

  const localizedCity = getLocalizedPlaceName(selectedCity, currentLang);

  // Styling accents for planet cards
  const planetAccents: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    Sun: { bg: 'bg-amber-500/10 dark:bg-amber-950/20', border: 'border-amber-400/50', text: 'text-amber-800 dark:text-amber-300', badge: 'bg-amber-500/20 text-amber-900 dark:text-amber-200' },
    Moon: { bg: 'bg-sky-500/10 dark:bg-sky-950/20', border: 'border-sky-400/50', text: 'text-sky-800 dark:text-sky-300', badge: 'bg-sky-500/20 text-sky-900 dark:text-sky-200' },
    Mars: { bg: 'bg-red-500/10 dark:bg-red-950/20', border: 'border-red-400/50', text: 'text-red-800 dark:text-red-300', badge: 'bg-red-500/20 text-red-900 dark:text-red-200' },
    Mercury: { bg: 'bg-emerald-500/10 dark:bg-emerald-950/20', border: 'border-emerald-400/50', text: 'text-emerald-800 dark:text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200' },
    Jupiter: { bg: 'bg-yellow-500/10 dark:bg-yellow-950/20', border: 'border-yellow-400/50', text: 'text-yellow-800 dark:text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-200' },
    Venus: { bg: 'bg-rose-500/10 dark:bg-rose-950/20', border: 'border-rose-400/50', text: 'text-rose-800 dark:text-rose-300', badge: 'bg-rose-500/20 text-rose-900 dark:text-rose-200' },
    Saturn: { bg: 'bg-indigo-500/10 dark:bg-indigo-950/20', border: 'border-indigo-400/50', text: 'text-indigo-800 dark:text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-200' },
    Rahu: { bg: 'bg-stone-500/10 dark:bg-stone-900/30', border: 'border-stone-400/50', text: 'text-stone-800 dark:text-stone-300', badge: 'bg-stone-500/20 text-stone-900 dark:text-stone-200' },
    Ketu: { bg: 'bg-purple-500/10 dark:bg-purple-950/20', border: 'border-purple-400/50', text: 'text-purple-800 dark:text-purple-300', badge: 'bg-purple-500/20 text-purple-900 dark:text-purple-200' }
  };

  return (
    <div className={`rounded-2xl border-2 border-amber-300 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md overflow-hidden transition-all ${
      isWidget ? 'p-3 sm:p-5' : 'p-6 space-y-6'
    }`}>
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200/80 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>
                  {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಗ್ರಹ ಗೋಚಾರ (Gochar Transits)' : currentLang === 'hi' ? 'वर्तमान ग्रह गोचर (Gochar Transits)' : 'Current Planetary Transits (Gochar)'}
                </span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                Lahiri Ayanamsha
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                <span>{localizedCity}</span>
              </span>
              <span>•</span>
              <span>
                {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ:' : currentLang === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'} <strong>{gocharReport.moonRashi[currentLang]}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Orbital / Grid Toggle */}
          <div className="inline-flex rounded-lg border border-amber-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('orbital')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'orbital'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Circular Celestial Orbital View"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಕಕ್ಷಾ ಮಂಡಲ' : 'Orbital'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title="Detailed Cards Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಪಟ್ಟಿ' : 'Grid'}</span>
            </button>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg px-2.5 py-1 border border-stone-200 dark:border-stone-700 text-xs">
            <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-stone-800 dark:text-stone-200 font-medium focus:outline-hidden cursor-pointer"
            />
          </div>

          {isWidget && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          {onOpenKundali && (
            <button
              onClick={onOpenKundali}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
              title="Open Full Lagna Kundali Chart"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentLang === 'kn' ? 'ಕುಂಡಲಿ ನಕ್ಷೆ' : currentLang === 'hi' ? 'कुण्डली' : 'Kundali'}
              </span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* ========================================================================= */}
          {/* VIEW MODE 1: CIRCULAR / REALISTIC CELESTIAL ORBITAL LAYOUT */}
          {/* ========================================================================= */}
          {viewMode === 'orbital' && (
            <div className="space-y-4">
              
              {/* Orbital Canvas with Dark Space Backdrop */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#060a14] via-[#0d1424] to-[#060a14] border border-amber-500/40 p-3 sm:p-5 shadow-2xl flex flex-col xl:flex-row items-center justify-center gap-6 overflow-hidden">
                
                {/* Subtle Cosmic Starfield & Nebula Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-44 h-44 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* 360-degree Celestial Zodiac Orbit Wheel (SVG Canvas) */}
                <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] aspect-square flex items-center justify-center shrink-0 select-none">
                  <svg viewBox="0 0 440 440" className="w-full h-full overflow-visible">
                    <defs>
                      <radialGradient id="orbit-center-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#1e3a8a" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="orbit-track" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* Concentric Guide Orbits */}
                    <circle cx="220" cy="220" r="210" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
                    <circle cx="220" cy="220" r="185" fill="none" stroke="url(#orbit-track)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="220" cy="220" r="155" fill="none" stroke="url(#orbit-track)" strokeWidth="1" strokeDasharray="4,4" />
                    <circle cx="220" cy="220" r="125" fill="none" stroke="url(#orbit-track)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="220" cy="220" r="95" fill="none" stroke="url(#orbit-track)" strokeWidth="1" strokeDasharray="2,2" />
                    <circle cx="220" cy="220" r="65" fill="url(#orbit-center-glow)" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />

                    {/* 12 Rashi Radial Sectors & Boundary Lines */}
                    {ZODIAC_SIGNS.map((sign, i) => {
                      const angleDeg = i * 30 - 90;
                      const rad = (angleDeg * Math.PI) / 180;
                      const x1 = 220 + 65 * Math.cos(rad);
                      const y1 = 220 + 65 * Math.sin(rad);
                      const x2 = 220 + 210 * Math.cos(rad);
                      const y2 = 220 + 210 * Math.sin(rad);

                      // Label position (mid-sector at i * 30 + 15)
                      const midAngleDeg = i * 30 + 15 - 90;
                      const midRad = (midAngleDeg * Math.PI) / 180;
                      const lx = 220 + 198 * Math.cos(midRad);
                      const ly = 220 + 198 * Math.sin(midRad);

                      return (
                        <g key={sign.index}>
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#d97706"
                            strokeWidth="0.8"
                            strokeOpacity="0.35"
                          />
                          {/* Rashi Glyph & Name around outer ring */}
                          <text
                            x={lx}
                            y={ly}
                            fill="#fef08a"
                            fontSize="9"
                            fontFamily="sans-serif"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="central"
                            opacity="0.85"
                          >
                            {sign.symbol}
                          </text>
                        </g>
                      );
                    })}

                    {/* Center Earth/Moon Anchor */}
                    <g className="cursor-pointer" onClick={() => setInspectedPlanet(gocharReport.planets[1])}>
                      <circle cx="220" cy="220" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      <text x="220" y="216" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                        🌙 {currentLang === 'kn' ? 'ಚಂದ್ರ' : 'Moon'}
                      </text>
                      <text x="220" y="228" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {gocharReport.moonRashi[currentLang].split('(')[0].trim()}
                      </text>
                    </g>
                  </svg>

                  {/* Absolute Placed Realistic SVG Grahas along the Orbital Ring */}
                  {gocharReport.planets.map((planet, pIdx) => {
                    // Calculate exact 360-degree angle: rashiIndex * 30 + degrees
                    const totalDegrees = (planet.rashiIndex * 30 + (planet.degrees % 30));
                    // 0° (Mesha) at top (-90 degrees)
                    const angleRad = ((totalDegrees - 90) * Math.PI) / 180;

                    // Stagger orbital radii across planets to prevent collisions
                    const orbitRadii = [150, 125, 168, 110, 158, 138, 178, 120, 162];
                    const radius = orbitRadii[pIdx % orbitRadii.length];

                    // Pixel coordinates (center at 50% = 220px of 440px box)
                    const leftPercent = 50 + (radius / 220) * 50 * Math.cos(angleRad);
                    const topPercent = 50 + (radius / 220) * 50 * Math.sin(angleRad);

                    const isSelected = activePlanet.name === planet.name;

                    return (
                      <div
                        key={planet.name}
                        onClick={() => setInspectedPlanet(planet)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                          isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                        }`}
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`
                        }}
                      >
                        {/* Glow ring around selected planet */}
                        {isSelected && (
                          <div className="absolute -inset-2 rounded-full border-2 border-amber-300 animate-ping opacity-75 pointer-events-none" />
                        )}

                        <div className="flex flex-col items-center">
                          {/* Custom SVG Graha Icon */}
                          <RealisticGraha
                            name={planet.name}
                            degrees={planet.degrees}
                            isRetrograde={planet.isRetrograde}
                            currentLang={currentLang}
                            size={isSelected ? 'md' : 'sm'}
                            showDegree={false}
                          />

                          {/* Quick Degree Pill */}
                          <span className={`mt-0.5 px-1 py-0.2 rounded-full text-[7.5px] font-mono font-bold leading-none border ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 border-white'
                              : 'bg-black/80 text-amber-200 border-amber-500/40'
                          }`}>
                            {planet.degrees}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right / Bottom: Interactive Inspected Planet Celestial Card */}
                {activePlanet && (
                  <div className="w-full xl:max-w-xs bg-stone-900/90 rounded-2xl border-2 border-amber-400/80 p-4 sm:p-5 text-white shadow-2xl space-y-3 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <div className="flex items-center gap-3">
                        <SvgGrahaIcon name={activePlanet.name} size={42} isRetrograde={activePlanet.isRetrograde} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-black text-base text-amber-200">
                              {activePlanet.sanskritName[currentLang]}
                            </h4>
                            <span className="text-xs font-mono text-stone-400">
                              ({activePlanet.name})
                            </span>
                          </div>
                          <p className="text-xs font-bold text-amber-400">
                            {activePlanet.rashiName[currentLang]} • <span className="font-mono">{activePlanet.formattedDegree}</span>
                          </p>
                        </div>
                      </div>

                      {activePlanet.isRetrograde && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] animate-pulse">
                          {currentLang === 'kn' ? 'ವಕ್ರಿ (R)' : 'Retrograde'}
                        </span>
                      )}
                    </div>

                    {/* Planet Astrological Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
                        <span className="text-[10px] text-stone-400 block">
                          {currentLang === 'kn' ? 'ಚಂದ್ರನಿಂದ ಭಾವ:' : 'House from Moon:'}
                        </span>
                        <span className="text-sm font-bold text-amber-300 font-serif">
                          {activePlanet.houseFromMoon}
                          {currentLang === 'en' ? 'th House' : 'ನೇ ಭಾವ'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
                        <span className="text-[10px] text-stone-400 block">
                          {currentLang === 'kn' ? 'ಗ್ರಹ ಸ್ಥಿತಿ (Dignity):' : 'Dignity:'}
                        </span>
                        <span className="text-xs font-bold text-emerald-300 font-serif">
                          {activePlanet.dignity[currentLang]}
                        </span>
                      </div>

                      <div className="col-span-2 p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
                        <span className="text-[10px] text-stone-400 block">
                          {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ & ಪಾದ:' : 'Nakshatra & Pada:'}
                        </span>
                        <span className="text-xs font-semibold text-stone-200">
                          {activePlanet.nakshatra[currentLang]} (ಪಾದ {activePlanet.pada})
                        </span>
                      </div>
                    </div>

                    {/* Transit Impact Guidance */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-100 space-y-1">
                      <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಪ್ರಭಾವ & ಫಲ:' : 'Transit Phala:'}</span>
                      </span>
                      <p className="text-[11.5px] leading-relaxed text-stone-300">
                        {activePlanet.transitEffect[currentLang]}
                      </p>
                    </div>

                    <p className="text-[10px] text-stone-400 text-center italic">
                      {currentLang === 'kn' ? 'ಆಕಾಶ ವೃತ್ತದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Tap any orbital Graha to view detailed transit effects'}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 2: DETAILED CARDS GRID */}
          {/* ========================================================================= */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gocharReport.planets.map((planet) => {
                const styling = planetAccents[planet.name] || planetAccents.Sun;

                return (
                  <div
                    key={planet.name}
                    onClick={() => {
                      setInspectedPlanet(planet);
                      setViewMode('orbital');
                    }}
                    className={`p-3.5 rounded-xl border ${styling.border} ${styling.bg} flex flex-col justify-between transition-transform hover:scale-[1.01] cursor-pointer`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <SvgGrahaIcon name={planet.name} size={36} isRetrograde={planet.isRetrograde} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                              {planet.sanskritName[currentLang]}
                            </span>
                            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                              ({planet.name})
                            </span>
                          </div>
                          <div className="text-sm font-bold text-amber-900 dark:text-amber-200 mt-0.5">
                            {planet.rashiName[currentLang]} • <span className="font-mono">{planet.formattedDegree}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${styling.badge}`}>
                          {planet.dignity[currentLang]}
                        </span>
                        {planet.isRetrograde && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white uppercase">
                            {currentLang === 'kn' ? 'ವಕ್ರಿ (R)' : currentLang === 'hi' ? 'वक्री (R)' : 'Retrograde (R)'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                      <div>
                        <span className="text-stone-400 dark:text-stone-500 mr-1">
                          {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : currentLang === 'hi' ? 'नक्षत्र:' : 'Star:'}
                        </span>
                        <span className="font-semibold">{planet.nakshatra[currentLang]}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-stone-400 dark:text-stone-500 mr-1">
                          {currentLang === 'kn' ? 'ಚಂದ್ರನಿಂದ:' : currentLang === 'hi' ? 'चन्द्र से:' : 'House:'}
                        </span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {planet.houseFromMoon}
                          {currentLang === 'en' ? 'th' : 'ನೇ'}
                        </span>
                      </div>
                    </div>

                    {/* Transit effect pill */}
                    <div className="mt-1.5 text-[10px] font-medium text-stone-500 dark:text-stone-400">
                      <span>{planet.transitEffect[currentLang]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Vedic Gochar Principles Note */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-stone-800 flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              {currentLang === 'kn'
                ? 'ಗೋಚಾರ ನಿಯಮ: ಜನ್ಮ ಚಂದ್ರ ರಾಶಿಯಿಂದ ಗುರು (೨, ೫, ೭, ೯, ೧೧), ಶನಿ (೩, ೬, ೧೧), ಸೂರ್ಯ/ಮಂಗಳ (೩, ೬, ೧೧) ಮತ್ತು ಶುಕ್ರ (೧-೫, ೮, ೯, ೧೧, ೧೨) ಸ್ಥಾನಗಳಲ್ಲಿ ಶುಭ ಫಲ ನೀಡುತ್ತಾರೆ.'
                : currentLang === 'hi'
                ? 'गोचर सिद्धान्त: जन्म चन्द्र राशि से गुरु (२, ५, ७, ९, ११), शनि (३, ६, ११), सूर्य/मंगल (३, ६, ११) एवं शुक्र स्थिति अनुसार शुभ फल प्रदान करते हैं।'
                : 'Vedic Gochar Principle: Planetary transits are calculated relative to the natal/current Moon sign. Jupiter is favorable in houses 2, 5, 7, 9, 11; Saturn and Mars in houses 3, 6, 11; Sun in 3, 6, 10, 11.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
