import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Eye, 
  Info,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { CityLocation, Language } from '../types';
import { calculateGochar, getLocalizedPlaceName, CITIES } from '../utils/panchanga';

interface GocharTransitsViewProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity?: (city: CityLocation) => void;
  onOpenKundali?: () => void;
  isWidget?: boolean;
}

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

  const gocharReport = useMemo(() => {
    return calculateGochar(selectedDate, selectedCity);
  }, [selectedDate, selectedCity]);

  // Planet color accents
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

  const localizedCity = getLocalizedPlaceName(selectedCity, currentLang);

  return (
    <div className={`rounded-2xl border-2 border-amber-300 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md overflow-hidden transition-all ${
      isWidget ? 'p-4 sm:p-5' : 'p-6 space-y-6'
    }`}>
      
      {/* Header Bar */}
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
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-2">
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

        {/* Controls: Date Picker & Collapse/Expand */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
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
              className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-xs flex items-center gap-1"
              title="Open Full Lagna Kundali Chart"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentLang === 'kn' ? 'ಕುಂಡಲಿ ನಕ್ಷೆ' : currentLang === 'hi' ? 'कुण्डली' : 'Chart'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Transits Grid */}
      {isExpanded && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gocharReport.planets.map((planet) => {
              const styling = planetAccents[planet.name] || planetAccents.Sun;

              return (
                <div
                  key={planet.name}
                  className={`p-3.5 rounded-xl border ${styling.border} ${styling.bg} flex flex-col justify-between transition-transform hover:scale-[1.01]`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          {planet.sanskritName[currentLang]}
                        </span>
                        <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          ({planet.name})
                        </span>
                      </div>
                      <div className="text-base font-bold text-amber-900 dark:text-amber-200 mt-0.5">
                        {planet.rashiName[currentLang]} • <span className="font-mono">{planet.formattedDegree}</span>
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
