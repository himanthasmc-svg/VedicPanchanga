import React, { useState } from 'react';
import { Moon, Sparkles } from 'lucide-react';
import { KundaliData, Language, PlanetPosition } from '../types';
import { RASHIS } from '../utils/panchanga';

interface ChandraKundaliChartProps {
  kundaliData: KundaliData;
  currentLang: Language;
}

export const ChandraKundaliChart: React.FC<ChandraKundaliChartProps> = ({
  kundaliData,
  currentLang
}) => {
  const [style, setStyle] = useState<'north' | 'south'>('north');

  // Moon's sign index (0 to 11) becomes House 1 (Chandra Lagna)
  const moon = kundaliData.planets.find(p => p.name === 'Moon') || kundaliData.planets[1];
  const moonRashiIndex = moon.rashiIndex;
  const moonRashi = RASHIS[moonRashiIndex] || RASHIS[0];

  // Calculate the Rashi number (1 to 12) for any house (1 to 12) from Chandra Lagna
  const getChandraHouseRashiNum = (houseNum: number): number => {
    return ((moonRashiIndex + houseNum - 1) % 12) + 1;
  };

  // Find planets that fall into a house relative to Chandra Lagna
  const getChandraHousePlanets = (houseNum: number): PlanetPosition[] => {
    const targetRashiIndex = (moonRashiIndex + houseNum - 1) % 12;
    return kundaliData.planets.filter(p => p.rashiIndex === targetRashiIndex);
  };

  const renderHousePlanets = (houseNum: number, layout: 'diamond' | 'horizontal' | 'vertical' = 'horizontal') => {
    const planets = getChandraHousePlanets(houseNum);
    if (planets.length === 0) return null;

    return (
      <div className={`flex flex-wrap items-center justify-center gap-1 ${
        layout === 'vertical' ? 'flex-col' : ''
      }`}>
        {planets.map(p => (
          <span
            key={p.name}
            className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-xs font-serif"
            style={{ backgroundColor: p.color || '#4f46e5' }}
            title={`${p.name} (${p.degrees.toFixed(1)}°)`}
          >
            {p.sanskritName[currentLang]} {p.isRetrograde && 'Ⓡ'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-indigo-300 dark:border-indigo-900 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Moon className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕುಂಡಲಿ (Chandra Chart / Moon Ascendant)' : currentLang === 'hi' ? 'चन्द्र कुण्डली (Moon Chart)' : 'Chandra Kundali (Moon Chart)'}</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                Moon = 1st House
              </span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {currentLang === 'kn'
                ? `ಚಂದ್ರ ಲಗ್ನ: ${moonRashi[currentLang]} (${moonRashi.en}) • ಚಂದ್ರನನ್ನು ೧ನೇ ಭಾವವಾಗಿರಿಸಿ ಗ್ರಹಗಳ ಸ್ಥಿತಿ ಮತ್ತು ಮನಸ್ಸಿನ ಒಳನೋಟಗಳ ವಿಶ್ಲೇಷಣೆ.`
                : `Chandra Lagna: ${moonRashi[currentLang]} (${moonRashi.en}). Assesses psychological disposition, emotional karma, and transit triggers.`}
            </p>
          </div>
        </div>

        {/* Style Switcher */}
        <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setStyle('north')}
            className={`px-3 py-1 rounded-md transition-all ${
              style === 'north' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            North Style
          </button>
          <button
            onClick={() => setStyle('south')}
            className={`px-3 py-1 rounded-md transition-all ${
              style === 'south' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            South Style
          </button>
        </div>
      </div>

      {/* Canvas */}
      {style === 'north' ? (
        <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[440px] mx-auto bg-indigo-50/60 rounded-2xl p-2 border-2 border-indigo-600 shadow-xl overflow-hidden select-none">
          <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
            <rect x="0" y="0" width="500" height="500" fill="#f8fafc" stroke="#4338ca" strokeWidth="3" />
            <line x1="0" y1="0" x2="500" y2="500" stroke="#6366f1" strokeWidth="2" />
            <line x1="500" y1="0" x2="0" y2="500" stroke="#6366f1" strokeWidth="2" />
            <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#4338ca" strokeWidth="2.5" />
          </svg>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* House 1: Chandra Lagna */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '25%', maxWidth: '135px' }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-100 px-1 py-0.2 rounded">CHANDRA LAGNA</span>
                <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded">{getChandraHouseRashiNum(1)}</span>
              </div>
              <div className="max-w-[130px]">{renderHousePlanets(1, 'diamond')}</div>
            </div>

            {/* House 2 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '14%', maxWidth: '85px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(2)}</span>
              <div className="max-w-[80px]">{renderHousePlanets(2, 'horizontal')}</div>
            </div>

            {/* House 3 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '12%', top: '25%', maxWidth: '60px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(3)}</span>
              <div className="max-w-[55px]">{renderHousePlanets(3, 'vertical')}</div>
            </div>

            {/* House 4 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '50%', maxWidth: '130px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(4)}</span>
              <div className="max-w-[125px]">{renderHousePlanets(4, 'diamond')}</div>
            </div>

            {/* House 5 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '12%', top: '75%', maxWidth: '60px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(5)}</span>
              <div className="max-w-[55px]">{renderHousePlanets(5, 'vertical')}</div>
            </div>

            {/* House 6 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '86%', maxWidth: '85px' }}>
              <div className="max-w-[80px] mb-0.5">{renderHousePlanets(6, 'horizontal')}</div>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs">{getChandraHouseRashiNum(6)}</span>
            </div>

            {/* House 7 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '75%', maxWidth: '135px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(7)}</span>
              <div className="max-w-[130px]">{renderHousePlanets(7, 'diamond')}</div>
            </div>

            {/* House 8 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '86%', maxWidth: '85px' }}>
              <div className="max-w-[80px] mb-0.5">{renderHousePlanets(8, 'horizontal')}</div>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs">{getChandraHouseRashiNum(8)}</span>
            </div>

            {/* House 9 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '88%', top: '75%', maxWidth: '60px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(9)}</span>
              <div className="max-w-[55px]">{renderHousePlanets(9, 'vertical')}</div>
            </div>

            {/* House 10 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '50%', maxWidth: '130px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(10)}</span>
              <div className="max-w-[125px]">{renderHousePlanets(10, 'diamond')}</div>
            </div>

            {/* House 11 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '88%', top: '25%', maxWidth: '60px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(11)}</span>
              <div className="max-w-[55px]">{renderHousePlanets(11, 'vertical')}</div>
            </div>

            {/* House 12 */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '14%', maxWidth: '85px' }}>
              <span className="text-[10px] font-extrabold text-indigo-900 bg-indigo-100 px-1 rounded-xs mb-0.5">{getChandraHouseRashiNum(12)}</span>
              <div className="max-w-[80px]">{renderHousePlanets(12, 'horizontal')}</div>
            </div>
          </div>
        </div>
      ) : (
        /* South Indian Square Chart for Chandra Kundali */
        <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[440px] mx-auto bg-indigo-50/70 rounded-2xl p-2 border-2 border-indigo-600 shadow-xl select-none">
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 p-1 bg-indigo-100/60 border border-indigo-300 rounded-xl">
            {[
              { rashiIdx: 11, label: 'Meena (12)' },
              { rashiIdx: 0, label: 'Mesha (1)' },
              { rashiIdx: 1, label: 'Vrishabha (2)' },
              { rashiIdx: 2, label: 'Mithuna (3)' },
              { rashiIdx: 10, label: 'Kumbha (11)' },
              null,
              null,
              { rashiIdx: 3, label: 'Karka (4)' },
              { rashiIdx: 9, label: 'Makara (10)' },
              null,
              null,
              { rashiIdx: 4, label: 'Simha (5)' },
              { rashiIdx: 8, label: 'Dhanu (9)' },
              { rashiIdx: 7, label: 'Vrishchika (8)' },
              { rashiIdx: 6, label: 'Tula (7)' },
              { rashiIdx: 5, label: 'Kanya (6)' }
            ].map((slot, idx) => {
              if (!slot) {
                if (idx === 5) {
                  return (
                    <div key={idx} className="col-span-2 row-span-2 p-2 rounded-xl bg-indigo-50 border border-indigo-400 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-base font-serif font-bold text-indigo-950">Chandra Kundali</span>
                      <span className="text-[11px] text-indigo-800 font-bold mt-1 bg-indigo-200/70 px-2 py-0.5 rounded-md">
                        Moon: {moonRashi[currentLang]}
                      </span>
                    </div>
                  );
                }
                return null;
              }

              const isChandraLagna = slot.rashiIdx === moonRashiIndex;
              const rashiPlanets = kundaliData.planets.filter(p => p.rashiIndex === slot.rashiIdx);

              return (
                <div key={idx} className={`p-1.5 border rounded-lg bg-white flex flex-col justify-between overflow-hidden shadow-2xs ${
                  isChandraLagna ? 'border-indigo-600 ring-2 ring-indigo-400 bg-indigo-50/70' : 'border-indigo-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-indigo-900 truncate">{slot.label}</span>
                    {isChandraLagna && (
                      <span className="text-[7.5px] font-black text-indigo-700 bg-indigo-100 px-1 rounded">MOON</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {rashiPlanets.map(p => (
                      <span
                        key={p.name}
                        className="text-[8.5px] font-bold px-1 py-0.2 rounded text-white shadow-2xs"
                        style={{ backgroundColor: p.color || '#4f46e5' }}
                      >
                        {p.sanskritName[currentLang]}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
