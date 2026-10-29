import React from 'react';
import { Eye, Sparkles, Compass, ShieldCheck, ShieldAlert, ArrowRight, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { KundaliData, Language, PlanetPosition } from '../types';
import { SvgGrahaIcon } from './RealisticGraha';
import { getAspectingHousesForGraha } from '../utils/grahaDrishti';

export interface DrishtiVisualizerProps {
  currentLang: Language;
  kundaliData: KundaliData;
  selectedPlanetName: string;
  onSelectPlanet: (planetName: string) => void;
  showAspectLines: boolean;
  onToggleAspectLines: (show: boolean) => void;
  onSelectHouse?: (bhavaNum: number) => void;
}

export const DrishtiVisualizer: React.FC<DrishtiVisualizerProps> = ({
  currentLang,
  kundaliData,
  selectedPlanetName,
  onSelectPlanet,
  showAspectLines,
  onToggleAspectLines,
  onSelectHouse
}) => {
  const activePlanet = kundaliData.planets.find(
    p => p.name.toLowerCase() === selectedPlanetName.toLowerCase()
  ) || kundaliData.planets[0];

  // Calculate aspects of currently selected planet
  const aspects = getAspectingHousesForGraha(activePlanet.name, activePlanet.bhava);

  const isBenefic = ['jupiter', 'guru', 'venus', 'shukra', 'mercury', 'budha', 'moon', 'chandra'].some(
    n => activePlanet.name.toLowerCase().includes(n)
  );

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/80 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-rose-400/80 dark:border-rose-900/60 shadow-xl space-y-4">
      
      {/* Top Bar: Title & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Eye className="w-5 h-5 text-rose-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70 px-2 py-0.5 rounded-full">
                Interactive Drishti Visualizer
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-mono font-bold text-stone-500">
                Parashari Ray Tracing
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentLang === 'kn'
                ? 'ಗ್ರಹ ದೃಷ್ಟಿ ವೀಕ್ಷಕ (Drishti Visualizer & Aspect Rays)'
                : currentLang === 'hi'
                ? 'ग्रह दृष्टि दृश्य उपकरण (Drishti Visualizer)'
                : 'Planetary Drishti Visualizer & Interactive Aspect Lines'}
            </h4>
          </div>
        </div>

        {/* Aspect Lines Show/Hide Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleAspectLines(!showAspectLines)}
          className={`px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all ${
            showAspectLines
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
          }`}
          title="Toggle SVG Aspect Lines on the Kundali Chart"
        >
          {showAspectLines ? <ToggleRight className="w-5 h-5 text-rose-100" /> : <ToggleLeft className="w-5 h-5 text-stone-400" />}
          <span>
            {showAspectLines
              ? (currentLang === 'kn' ? 'ದೃಷ್ಟಿ ರೇಖೆಗಳು: ಸಕ್ರಿಯ (ON)' : 'Aspect Rays: ON')
              : (currentLang === 'kn' ? 'ದೃಷ್ಟಿ ರೇಖೆಗಳು: ನಿಷ್ಕ್ರಿಯ (OFF)' : 'Aspect Rays: OFF')}
          </span>
        </button>
      </div>

      {/* Select Graha to Visualize Aspect Rays */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
          <span>{currentLang === 'kn' ? 'ದೃಷ್ಟಿ ರೇಖೆ ವೀಕ್ಷಿಸಲು ಗ್ರಹವನ್ನು ಆಯ್ಕೆಮಾಡಿ:' : 'Select Graha to Trace Aspect Rays on Chart:'}</span>
          <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400">
            Click any Graha below
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
          {kundaliData.planets.map((planet) => {
            const isSelected = planet.name.toLowerCase() === activePlanet.name.toLowerCase();
            return (
              <button
                key={planet.name}
                type="button"
                onClick={() => onSelectPlanet(planet.name)}
                className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400/50 scale-102 font-bold'
                    : 'bg-white dark:bg-stone-850 hover:bg-rose-50 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                <SvgGrahaIcon name={planet.name} size={22} isRetrograde={planet.isRetrograde} />
                <span className="font-serif text-[11px] truncate max-w-full">
                  {planet.sanskritName[currentLang]}
                </span>
                <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  H#{planet.bhava}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Graha's Aspected Houses Panel */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <SvgGrahaIcon name={activePlanet.name} size={28} isRetrograde={activePlanet.isRetrograde} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  {activePlanet.sanskritName[currentLang]} ({activePlanet.name})
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  House #{activePlanet.bhava} ({activePlanet.rashiName[currentLang]})
                </span>
              </div>
              <span className="text-[11px] text-stone-500">
                {currentLang === 'kn'
                  ? `ಈ ಗ್ರಹವು ಒಟ್ಟು ${aspects.length} ಭಾವಗಳ ಮೇಲೆ ಪರಾಶರಿ ದೃಷ್ಟಿ ಬೀರುತ್ತಿದೆ`
                  : `Casting ${aspects.length} Parashari Aspect Rays across the horoscope`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isBenefic 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {isBenefic 
                ? (currentLang === 'kn' ? 'ಶುಭ ದೃಷ್ಟಿ (Benefic Rays)' : 'Benefic Glances') 
                : (currentLang === 'kn' ? 'ಕ್ರೂರ / ತೀಕ್ಷ್ಣ ದೃಷ್ಟಿ (Fiery/Karmic Rays)' : 'Fiery / Karmic Glances')}
            </span>
          </div>
        </div>

        {/* Aspect Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {aspects.map((asp, idx) => {
            const targetHouseData = kundaliData.houses.find(h => h.bhava === asp.targetBhava);
            const targetOccupants = kundaliData.planets.filter(p => p.bhava === asp.targetBhava);

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-900 dark:to-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      #{asp.targetBhava}
                    </span>
                    <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                      {targetHouseData ? targetHouseData.rashiName[currentLang] : `H#${asp.targetBhava}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                    {asp.distance}th Aspect
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  {asp.label[currentLang]}
                </div>

                {/* Target House Occupants */}
                <div className="pt-1 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">
                    {targetOccupants.length > 0 
                      ? `${currentLang === 'kn' ? 'ಭಾವಸ್ಥ:' : 'Occupants:'} ${targetOccupants.map(o => o.sanskritName[currentLang]).join(', ')}`
                      : (currentLang === 'kn' ? 'ಖಾಲಿ ಭಾವ (Unoccupied)' : 'Unoccupied House')}
                  </span>

                  {onSelectHouse && (
                    <button
                      type="button"
                      onClick={() => onSelectHouse(asp.targetBhava)}
                      className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{currentLang === 'kn' ? 'ಭಾವ ವಿವರ' : 'Inspect'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
