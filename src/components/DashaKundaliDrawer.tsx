import React, { useState, useMemo } from 'react';
import { Compass, Sparkles, MapPin, Calendar, Clock, Layers, Award } from 'lucide-react';
import { CityLocation, Language, LocalizedString, KundaliData, PlanetPosition } from '../types';
import { calculateKundali, RASHIS, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';

interface DashaKundaliDrawerProps {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthCity: CityLocation;
  currentLang: Language;
  activeMahadashaLord: string;
  activeAntardashaLord: string;
}

export const DashaKundaliDrawer: React.FC<DashaKundaliDrawerProps> = ({
  birthDate,
  birthTime,
  birthCity,
  currentLang,
  activeMahadashaLord,
  activeAntardashaLord
}) => {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');

  // Compute KundaliData for exact birth date, time, and coordinates
  const kundaliData: KundaliData = useMemo(() => {
    try {
      const dateTimeISO = `${birthDate}T${birthTime}:00`;
      return calculateKundali(dateTimeISO, birthCity);
    } catch (e) {
      // fallback
      return calculateKundali(new Date().toISOString(), birthCity);
    }
  }, [birthDate, birthTime, birthCity]);

  // Ascendant info
  const lagnaRashi = RASHIS[kundaliData.lagnaRashiIndex] || RASHIS[0];
  const moonPlanet = kundaliData.planets.find(p => p.name === 'Moon');
  const mahaPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === activeMahadashaLord.toLowerCase());
  const antarPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === activeAntardashaLord.toLowerCase());

  // South Indian Rashi Grid mapping (Fixed Signs 0 = Mesha at top row second col, clockwise)
  // Rashi index to (row, col) in a 4x4 grid:
  // Row 0: Meena (11), Mesha (0), Vrishabha (1), Mithuna (2)
  // Row 1: Kumbha (10), [CENTER], [CENTER], Karka (3)
  // Row 2: Makara (9),  [CENTER], [CENTER], Simha (4)
  // Row 3: Dhanu (8),   Vrischika (7), Tula (6), Kanya (5)
  const southGridCells = [
    { row: 0, col: 0, rashiIndex: 11 }, // Pisces
    { row: 0, col: 1, rashiIndex: 0 },  // Aries
    { row: 0, col: 2, rashiIndex: 1 },  // Taurus
    { row: 0, col: 3, rashiIndex: 2 },  // Gemini
    { row: 1, col: 3, rashiIndex: 3 },  // Cancer
    { row: 2, col: 3, rashiIndex: 4 },  // Leo
    { row: 3, col: 3, rashiIndex: 5 },  // Virgo
    { row: 3, col: 2, rashiIndex: 6 },  // Libra
    { row: 3, col: 1, rashiIndex: 7 },  // Scorpio
    { row: 3, col: 0, rashiIndex: 8 },  // Sagittarius
    { row: 2, col: 0, rashiIndex: 9 },  // Capricorn
    { row: 1, col: 0, rashiIndex: 10 }  // Aquarius
  ];

  // Helper to render planet badge with Dasha highlights
  const renderPlanetBadge = (p: PlanetPosition) => {
    const isMaha = p.name.toLowerCase() === activeMahadashaLord.toLowerCase();
    const isAntar = p.name.toLowerCase() === activeAntardashaLord.toLowerCase();

    return (
      <span
        key={p.name}
        className={`inline-flex items-center gap-1 text-[9.5px] px-1.5 py-0.5 rounded-md font-bold m-0.5 shadow-2xs ${
          isMaha && isAntar
            ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 font-black animate-pulse'
            : isMaha
            ? 'bg-amber-500 text-stone-950 ring-1.5 ring-amber-300 font-black'
            : isAntar
            ? 'bg-orange-500 text-white ring-1.5 ring-orange-300 font-black'
            : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700'
        }`}
        title={`${p.name} (${p.degrees}° in ${p.rashiName.en}) • House ${p.bhava} ${isMaha ? '[Active Mahadasha]' : ''} ${isAntar ? '[Active Antardasha]' : ''}`}
      >
        <span>{p.symbol}</span>
        <span className="text-[8px] opacity-80">{p.degrees}°</span>
        {p.isRetrograde && <span className="text-red-600 dark:text-red-400 text-[8px] font-black">R</span>}
        {isMaha && <span className="text-[7.5px] bg-stone-950 text-amber-300 px-1 py-0.2 rounded">MD</span>}
        {isAntar && !isMaha && <span className="text-[7.5px] bg-stone-950 text-orange-300 px-1 py-0.2 rounded">AD</span>}
      </span>
    );
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 p-4 sm:p-5 shadow-lg space-y-4">
      
      {/* Header with Title and Chart Style Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <Compass className="w-4 h-4" />
            </span>
            <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-white">
              {currentLang === 'kn'
                ? 'ಜನನ ಲಗ್ನ ಕುಂಡಲಿ (Janma Kundali Chart)'
                : currentLang === 'hi'
                ? 'जन्म लग्न कुण्डली (Janma Kundali)'
                : 'Birth Lagna Kundali Chart'}
            </h4>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {currentLang === 'kn'
              ? `ಜನನ ದಿನಾಂಕ: ${birthDate} ${birthTime} • ಸ್ಥಳ: ${birthCity.name}`
              : `DOB: ${birthDate} ${birthTime} at ${birthCity.name} (${birthCity.lat.toFixed(2)}°N, ${birthCity.lng.toFixed(2)}°E)`}
          </p>
        </div>

        {/* Toggle North / South Indian Style */}
        <div className="inline-flex rounded-xl border border-stone-200 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-850 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setChartStyle('north')}
            className={`px-3 py-1 rounded-lg transition-all ${
              chartStyle === 'north'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'kn' ? 'ಉತ್ತರ ಶೈಲಿ (Diamond)' : 'North (Diamond)'}
          </button>
          <button
            onClick={() => setChartStyle('south')}
            className={`px-3 py-1 rounded-lg transition-all ${
              chartStyle === 'south'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಶೈಲಿ (Square)' : 'South (Square)'}
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="flex flex-col lg:flex-row gap-5 items-center justify-center">
        
        {/* Left: Interactive Kundali Chart SVG */}
        <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[420px] aspect-square relative select-none">
          {chartStyle === 'north' ? (
            // ================= NORTH INDIAN DIAMOND CHART =================
            <div className="relative w-full h-full bg-[#fefce8] dark:bg-stone-950 rounded-2xl p-2 border-2 border-amber-500 shadow-md overflow-hidden">
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
                <rect x="0" y="0" width="400" height="400" fill="none" stroke="#b45309" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="400" y2="400" stroke="#d97706" strokeWidth="1.8" />
                <line x1="400" y1="0" x2="0" y2="400" stroke="#d97706" strokeWidth="1.8" />
                <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#b45309" strokeWidth="2" />
              </svg>

              {/* 12 House Overlays for North Chart */}
              <div className="absolute inset-0 w-full h-full">
                {[
                  { bhava: 1, left: '50%', top: '25%', name: 'Lagna' },
                  { bhava: 2, left: '25%', top: '13%' },
                  { bhava: 3, left: '13%', top: '25%' },
                  { bhava: 4, left: '25%', top: '50%' },
                  { bhava: 5, left: '13%', top: '75%' },
                  { bhava: 6, left: '25%', top: '87%' },
                  { bhava: 7, left: '50%', top: '75%' },
                  { bhava: 8, left: '75%', top: '87%' },
                  { bhava: 9, left: '87%', top: '75%' },
                  { bhava: 10, left: '75%', top: '50%' },
                  { bhava: 11, left: '87%', top: '25%' },
                  { bhava: 12, left: '75%', top: '13%' }
                ].map((item) => {
                  const houseObj = kundaliData.houses[item.bhava - 1];
                  const rashiNum = ((kundaliData.lagnaRashiIndex + item.bhava - 1) % 12) + 1;
                  const occupyingPlanets = houseObj?.planets || [];

                  return (
                    <div
                      key={item.bhava}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-0.5 text-center pointer-events-auto max-w-[90px]"
                      style={{ left: item.left, top: item.top }}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        {item.bhava === 1 && (
                          <span className="text-[8.5px] font-black uppercase text-red-700 bg-red-100 dark:bg-red-950 px-1 rounded">
                            {currentLang === 'kn' ? 'ಲಗ್ನ' : 'LAGNA'}
                          </span>
                        )}
                        <span className="text-[9px] font-bold text-amber-900 dark:text-amber-300 font-mono">
                          {rashiNum}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-0.5">
                        {occupyingPlanets.map(p => renderPlanetBadge(p))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // ================= SOUTH INDIAN SQUARE CHART =================
            <div className="w-full h-full grid grid-cols-4 grid-rows-4 bg-amber-50/50 dark:bg-stone-950 rounded-2xl border-2 border-amber-600 shadow-md p-1 gap-1">
              {Array.from({ length: 16 }).map((_, idx) => {
                const r = Math.floor(idx / 4);
                const c = idx % 4;

                // Center 2x2 square
                if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
                  if (r === 1 && c === 1) {
                    return (
                      <div key={idx} className="col-span-2 row-span-2 flex flex-col items-center justify-center p-2 text-center bg-white dark:bg-stone-900 rounded-xl border border-amber-300 dark:border-stone-800">
                        <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
                        <span className="font-serif font-black text-xs text-amber-950 dark:text-amber-200">
                          {currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಕುಂಡಲಿ' : 'Janma Kundali'}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {lagnaRashi.en} {kundaliData.lagnaDegree}°
                        </span>
                      </div>
                    );
                  }
                  return null;
                }

                // Outer border cells
                const cell = southGridCells.find(g => g.row === r && g.col === c);
                if (!cell) return <div key={idx} />;

                const rMeta = RASHIS[cell.rashiIndex];
                const isLagnaHere = cell.rashiIndex === kundaliData.lagnaRashiIndex;
                const occupyingPlanets = kundaliData.planets.filter(p => p.rashiIndex === cell.rashiIndex);

                return (
                  <div
                    key={idx}
                    className={`rounded-lg p-1 flex flex-col justify-between border relative overflow-hidden ${
                      isLagnaHere
                        ? 'bg-amber-100/80 dark:bg-amber-950/40 border-amber-500 font-bold'
                        : 'bg-white dark:bg-stone-900 border-amber-200/70 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] font-mono">
                      <span className="font-bold text-stone-600 dark:text-stone-400">
                        {rMeta.en.slice(0, 3)}
                      </span>
                      {isLagnaHere && (
                        <span className="bg-red-600 text-white font-black px-1 rounded text-[7.5px]">
                          LAG
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                      {occupyingPlanets.map(p => renderPlanetBadge(p))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Astrological Core Highlights & Active Dasha Placement */}
        <div className="w-full lg:flex-1 space-y-3">
          
          {/* Card: Lagna & Moon Placement */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-stone-800/60 border border-amber-300 dark:border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ascendant & Moon Signs</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">Sidereal Lahiri</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 dark:bg-stone-900 p-2 rounded-lg border border-amber-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block font-mono">Lagna (Ascendant):</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {lagnaRashi[currentLang]} ({kundaliData.lagnaDegree}°)
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5">
                  Lord: {lagnaRashi[`lord${currentLang === 'kn' ? 'Kn' : currentLang === 'hi' ? 'Hi' : 'En'}` as 'lordEn']}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-stone-900 p-2 rounded-lg border border-amber-200 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block font-mono">Janma Rashi (Moon):</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {moonPlanet ? moonPlanet.rashiName[currentLang] : ''} ({moonPlanet ? moonPlanet.degrees : ''}°)
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-0.5">
                  Nakshatra: {moonPlanet ? moonPlanet.nakshatra[currentLang] : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Active Mahadasha & Antardasha Placement Highlights */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
              <span>Active Dasha Lords in Birth Chart:</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Highlighted in Gold/Orange</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {mahaPlanet && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/15 border border-amber-400/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-amber-500 text-stone-950">MD</span>
                    <strong className="text-stone-900 dark:text-white">{mahaPlanet.sanskritName[currentLang]}</strong>
                  </div>
                  <span className="font-mono text-stone-700 dark:text-stone-300">
                    House {mahaPlanet.bhava} • {mahaPlanet.rashiName[currentLang]} ({mahaPlanet.degrees}°)
                  </span>
                </div>
              )}

              {antarPlanet && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/15 border border-orange-400/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-1.5 py-0.5 rounded bg-orange-500 text-white">AD</span>
                    <strong className="text-stone-900 dark:text-white">{antarPlanet.sanskritName[currentLang]}</strong>
                  </div>
                  <span className="font-mono text-stone-700 dark:text-stone-300">
                    House {antarPlanet.bhava} • {antarPlanet.rashiName[currentLang]} ({antarPlanet.degrees}°)
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
