import React, { useState, useMemo } from 'react';
import { 
  X, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Award, 
  HeartHandshake, 
  BookOpen, 
  Layers, 
  Info, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Maximize2,
  Minimize2,
  CheckCircle2,
  HelpCircle,
  Star
} from 'lucide-react';
import { Language, KundaliData } from '../types';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { SvgGrahaIcon } from './RealisticGraha';
import { BHAVA_DETAILS, BhavaMeta } from './BhavaExplorer';
import { getDetailedGrahaBhavaEffect } from '../utils/bhavaDetails';

interface BhavaExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  kundaliData: KundaliData;
  planetaryBalas?: PlanetaryBalaBreakdown[];
  initialBhava?: number;
}

const ALL_GRAHAS = [
  { key: 'Sun', en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ' },
  { key: 'Moon', en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ' },
  { key: 'Mars', en: 'Mars (Mangala)', kn: 'ಕುಜ' },
  { key: 'Mercury', en: 'Mercury (Budha)', kn: 'ಬುಧ' },
  { key: 'Jupiter', en: 'Jupiter (Guru)', kn: 'ಗುರು' },
  { key: 'Venus', en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ' },
  { key: 'Saturn', en: 'Saturn (Shani)', kn: 'ಶನಿ' },
  { key: 'Rahu', en: 'Rahu', kn: 'ರಾಹು' },
  { key: 'Ketu', en: 'Ketu', kn: 'ಕೇತು' }
];

export const BhavaExplorerModal: React.FC<BhavaExplorerModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  kundaliData,
  planetaryBalas = [],
  initialBhava = 1
}) => {
  const [selectedBhava, setSelectedBhava] = useState<number>(initialBhava);
  const [selectedGrahaFilter, setSelectedGrahaFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'grahasInBhava' | 'bhavaPhilosophy' | 'userPlanets'>('grahasInBhava');

  if (!isOpen) return null;

  const currentBhavaMeta = BHAVA_DETAILS.find(b => b.bhava === selectedBhava) || BHAVA_DETAILS[0];

  // Native's planets placed in this house
  const nativePlanets = kundaliData.planets.filter(p => p.bhava === selectedBhava);
  const houseData = kundaliData.houses.find(h => h.bhava === selectedBhava);
  const rashiName = houseData ? houseData.rashiName[currentLang] : '';
  const balaMap = new Map(planetaryBalas.map(b => [b.planet.name, b]));

  // 9 Graha impacts for this selected house
  const grahaEffectsList = useMemo(() => {
    return ALL_GRAHAS.map(g => getDetailedGrahaBhavaEffect(g.key, selectedBhava));
  }, [selectedBhava]);

  // Filtered effects based on planet filter and search
  const filteredEffects = useMemo(() => {
    return grahaEffectsList.filter(effect => {
      const matchesGraha = selectedGrahaFilter === 'ALL' || effect.planet === selectedGrahaFilter;
      if (!matchesGraha) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (effect.title[currentLang] || '').toLowerCase();
      const summary = (effect.summary[currentLang] || '').toLowerCase();
      const career = (effect.effects.careerAndWealth[currentLang] || '').toLowerCase();
      const health = (effect.effects.relationshipsAndHealth[currentLang] || '').toLowerCase();
      const planet = effect.planet.toLowerCase();

      return title.includes(q) || summary.includes(q) || career.includes(q) || health.includes(q) || planet.includes(q);
    });
  }, [grahaEffectsList, selectedGrahaFilter, searchQuery, currentLang]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className={`bg-white dark:bg-stone-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[92vh]'
      }`}>

        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-950 to-purple-950 text-white border-b border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shrink-0">
              <Compass className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                  {currentLang === 'kn' ? 'ಭವ ದರ್ಶನ ಗವಾಕ್ಷಿ' : 'Interactive Bhava Explorer'}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  House #{selectedBhava} of 12
                </span>
              </div>
              <h3 className="font-serif font-black text-base sm:text-xl text-amber-300 tracking-tight">
                {currentLang === 'kn'
                  ? '೯ ಪ್ರಮುಖ ಭಾವಗಳು & ಪ್ರತಿಯೊಂದು ಗ್ರಹದ ಶಾಸ್ತ್ರೋಕ್ತ ಫಲಗಳು'
                  : 'Core Bhavas & Impact of Each Planet (Graha) When Positioned Within'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 12 Bhavas Quick Navigation Bar (Horizontal Carousel / Grid) */}
        <div className="p-3 bg-stone-100 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {BHAVA_DETAILS.map((b) => {
              const isSelected = b.bhava === selectedBhava;
              const hasNativePlanet = kundaliData.planets.some(p => p.bhava === b.bhava);
              const isKendra = [1, 4, 7, 10].includes(b.bhava);
              const isTrikona = [1, 5, 9].includes(b.bhava);

              return (
                <button
                  key={b.bhava}
                  type="button"
                  onClick={() => setSelectedBhava(b.bhava)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50 scale-102'
                      : isTrikona
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                      : isKendra
                      ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800 hover:bg-purple-100'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-mono font-black text-xs">#{b.bhava}</span>
                  <span className="font-serif">
                    {b.sanskritName[currentLang].split(' ')[0]}
                  </span>
                  {hasNativePlanet && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Has planet in native chart" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 select-text">

          {/* Selected Bhava Identity Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-purple-50/60 dark:from-stone-850 dark:via-stone-900 dark:to-stone-850 border border-amber-300 dark:border-stone-700 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-600 text-white">
                    House #{currentBhavaMeta.bhava}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300">
                    {currentBhavaMeta.categoryLocalized[currentLang]}
                  </span>
                  {rashiName && (
                    <span className="text-xs font-serif font-bold text-stone-600 dark:text-stone-300">
                      • {currentLang === 'kn' ? 'ರಾಶಿ:' : 'Sign:'} <strong>{rashiName}</strong>
                    </span>
                  )}
                </div>

                <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {currentBhavaMeta.sanskritName[currentLang]} — {currentBhavaMeta.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-4xl">
                  {currentBhavaMeta.significations[currentLang]}
                </p>
              </div>

              {/* Natural Karaka Badge */}
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-300 dark:border-stone-700 shrink-0 text-center space-y-0.5">
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                  {currentLang === 'kn' ? 'ನೈಸರ್ಗಿಕ ಕಾರಕ ಗ್ರಹ' : 'Natural Karaka'}
                </span>
                <span className="font-serif font-bold text-amber-800 dark:text-amber-400 text-sm">
                  {currentBhavaMeta.karakaPlanet[currentLang]}
                </span>
              </div>
            </div>

            {/* 3 Pillars Grid: Purpose, Anatomy, Life Domains */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-200/60 dark:border-stone-800 text-xs">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ಯಾವ ಉದ್ದೇಶಕ್ಕೆ ನೋಡಬೇಕು?' : 'Purpose of Analysis'}</span>
                </span>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {currentBhavaMeta.purpose[currentLang]}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-rose-600" />
                  <span>{currentLang === 'kn' ? 'ಶರೀರದ ಅಂಗಗಳು (Anatomy)' : 'Governed Body Parts'}</span>
                </span>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {currentBhavaMeta.bodyParts[currentLang]}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentLang === 'kn' ? 'ಪ್ರಮುಖ ಕ್ಷೇತ್ರಗಳು' : 'Core Life Domains'}</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentBhavaMeta.lifeDomains[currentLang].map((d: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-800">
                      • {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: 1. Grahas in Bhava | 2. Native's Chart Planets | 3. Bhava Philosophy */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-2">
            <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-800 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('grahasInBhava')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'grahasInBhava'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ಪ್ರಭಾವ (All 9 Graha Impacts)' : 'Impact of All 9 Grahas'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('userPlanets')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'userPlanets'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <span>{currentLang === 'kn' ? 'ನಿಮ್ಮ ಜಾತಕಸ್ಥ ಗ್ರಹಗಳು' : 'Planets in Your Chart'}</span>
                <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-900 text-[10px] flex items-center justify-center font-mono">
                  {nativePlanets.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bhavaPhilosophy')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bhavaPhilosophy'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಭಾವ ತತ್ವಶಾಸ್ತ್ರ' : 'Bhava Philosophy'}</span>
              </button>
            </div>

            {/* Quick Prev / Next House Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedBhava(prev => prev > 1 ? prev - 1 : 12)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಹಿಂದಿನ ಭಾವ' : 'Prev House'}</span>
              </button>
              <button
                onClick={() => setSelectedBhava(prev => prev < 12 ? prev + 1 : 1)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>{currentLang === 'kn' ? 'ಮುಂದಿನ ಭಾವ' : 'Next House'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* TAB 1: IMPACT OF EACH GRAHA IN THIS HOUSE */}
          {activeTab === 'grahasInBhava' && (
            <div className="space-y-4">
              
              {/* Filter by Planet & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 dark:bg-stone-850 p-3 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-500 mr-1 text-[11px] uppercase">Filter:</span>
                  <button
                    onClick={() => setSelectedGrahaFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedGrahaFilter === 'ALL'
                        ? 'bg-purple-700 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    All 9 Planets
                  </button>
                  {ALL_GRAHAS.map(g => (
                    <button
                      key={g.key}
                      onClick={() => setSelectedGrahaFilter(g.key)}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                        selectedGrahaFilter === g.key
                          ? 'bg-purple-700 text-white font-bold'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <SvgGrahaIcon name={g.key} size={14} />
                      <span>{currentLang === 'kn' ? g.kn : g.en.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={currentLang === 'kn' ? 'ಹುಡುಕಿ (ಧನ, ದಾಂಪತ್ಯ, ಆರೋಗ್ಯ...)' : 'Search effects, remedies...'}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Graha Impact Cards List */}
              <div className="space-y-4">
                {filteredEffects.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-dashed border-stone-200 dark:border-stone-700">
                    No results match your search query. Try clearing the search or filter.
                  </div>
                ) : (
                  filteredEffects.map((effect) => {
                    const isNativePlaced = nativePlanets.some(p => p.name === effect.planet);

                    return (
                      <div
                        key={effect.planet}
                        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3.5 ${
                          isNativePlaced
                            ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-400 dark:border-purple-800 shadow-md ring-1 ring-purple-300'
                            : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-amber-300 shadow-xs'
                        }`}
                      >
                        {/* Header: Planet Icon, Title & Nature Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                          <div className="flex items-center gap-3">
                            <SvgGrahaIcon name={effect.planet} size={32} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                                  {effect.title[currentLang]}
                                </h5>
                                {isNativePlaced && (
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                                    ★ {currentLang === 'kn' ? 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿದೆ' : 'In Your Chart'}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-stone-500 font-mono">
                                {effect.planetName[currentLang]} in House #{currentBhavaMeta.bhava} ({currentBhavaMeta.sanskritName[currentLang]})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              effect.nature === 'Auspicious'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                                : effect.nature === 'Mixed'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300'
                            }`}>
                              {effect.natureLocalized[currentLang]}
                            </span>
                          </div>
                        </div>

                        {/* Parashari Summary */}
                        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700">
                          <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                            {effect.summary[currentLang]}
                          </p>
                        </div>

                        {/* 3 Impact Domains */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-amber-600" />
                              <span>{currentLang === 'kn' ? 'ಸ್ವಭಾವ & ವ್ಯಕ್ತಿತ್ವ' : 'Persona & Nature'}</span>
                            </span>
                            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                              {effect.effects.general[currentLang]}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{currentLang === 'kn' ? 'ವೃತ್ತಿ & ಸಂಪತ್ತು' : 'Career & Wealth'}</span>
                            </span>
                            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                              {effect.effects.careerAndWealth[currentLang]}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                              <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                              <span>{currentLang === 'kn' ? 'ದಾಂಪತ್ಯ & ಆರೋಗ್ಯ' : 'Relationships & Health'}</span>
                            </span>
                            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                              {effect.effects.relationshipsAndHealth[currentLang]}
                            </p>
                          </div>
                        </div>

                        {/* Prescribed Remedy Panel */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900 border border-amber-200 dark:border-stone-700 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-[11px] uppercase">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                              <span>{currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ & ಬೀಜ ಮಂತ್ರ' : 'Classical Vedic Remedy'}</span>
                            </span>
                            <span className="font-mono text-[10.5px] text-stone-500">
                              Day: <strong>{effect.remedy.charityDay[currentLang]}</strong>
                            </span>
                          </div>
                          <p className="text-stone-700 dark:text-stone-300">
                            {effect.remedy.action[currentLang]}
                          </p>
                          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11.5px] font-mono text-amber-900 dark:text-amber-300">
                            <span>{effect.remedy.mantra}</span>
                            <span className="text-[10px] font-semibold text-stone-500">
                              Count: {effect.remedy.mantraCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NATIVE'S CHART PLANETS IN THIS HOUSE */}
          {activeTab === 'userPlanets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                <span className="font-bold text-xs text-stone-700 dark:text-stone-300">
                  {currentLang === 'kn'
                    ? `ಜಾತಕ ಕುಂಡಲಿಯಲ್ಲಿ ${selectedBhava}ನೇ ಭಾವದಲ್ಲಿ ನೆಲೆಸಿರುವ ಗ್ರಹಗಳು:`
                    : `Planets Situated in House #${selectedBhava} for Entered Horoscope:`}
                </span>
                <span className="text-xs font-mono font-bold text-purple-600">
                  Count: {nativePlanets.length}
                </span>
              </div>

              {nativePlanets.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-dashed border-stone-300 dark:border-stone-700 space-y-2">
                  <p className="font-semibold text-sm text-stone-700 dark:text-stone-300">
                    {currentLang === 'kn'
                      ? `ಈ ಜಾತಕದಲ್ಲಿ ${selectedBhava}ನೇ ಭಾವವು ಶೂನ್ಯವಾಗಿದೆ (ಯಾವುದೇ ಗ್ರಹವಿಲ್ಲ).`
                      : `This house is vacant (no planets situated in native's chart).`}
                  </p>
                  <p className="max-w-lg mx-auto leading-relaxed">
                    {currentLang === 'kn'
                      ? `ಖಾಲಿ ಭಾವಗಳ ಫಲಗಳನ್ನು ಅದರ ರಾಶ್ಯಾಧಿಪತಿ (${rashiName || 'ಭಾವಾಧಿಪತಿ'}) ಹಾಗೂ ಈ ಭಾವದ ಮೇಲೆ ಬೀಳುವ ದೃಷ್ಟಿ ಗ್ರಹಗಳಿಂದ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಗ್ರಹ ಇಲ್ಲಿದ್ದರೆ ಏನು ಫಲ ನೀಡುತ್ತದೆ ಎಂದು ನೋಡಲು "೯ ಗ್ರಹಗಳ ಪ್ರಭಾವ" ಟ್ಯಾಬ್ ಕ್ಲಿಕ್ ಮಾಡಿ.`
                      : `A vacant house is governed primarily by its sign lord (${rashiName}) and planetary aspects casting upon it. Click "Impact of All 9 Grahas" to explore what each planet does here.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('grahasInBhava')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-purple-700 text-white font-bold text-xs cursor-pointer hover:bg-purple-800 inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ಪ್ರಭಾವವನ್ನು ವೀಕ್ಷಿಸಿ' : 'Explore All 9 Grahas Here'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {nativePlanets.map((planet) => {
                    const bala = balaMap.get(planet.name);
                    const effect = getDetailedGrahaBhavaEffect(planet.name, selectedBhava);

                    return (
                      <div
                        key={planet.name}
                        className="p-4 rounded-2xl bg-white dark:bg-stone-850 border-2 border-purple-400 dark:border-purple-800 shadow-md space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                          <div className="flex items-center gap-2.5">
                            <SvgGrahaIcon name={planet.name} size={30} isRetrograde={planet.isRetrograde} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h6 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                                  {planet.sanskritName[currentLang]} ({planet.name})
                                </h6>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-bold">
                                  {planet.degrees}° in {planet.nakshatra[currentLang]}
                                </span>
                              </div>
                              <span className="text-xs text-stone-500 font-mono">
                                Sign: {planet.rashiName[currentLang]} • {planet.isRetrograde ? '⚡ Retrograde (ವಕ್ರ)' : 'Direct'}
                              </span>
                            </div>
                          </div>

                          {bala && (
                            <div className="text-left sm:text-right">
                              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block">
                                Bala: {bala.totalScore}/100 ({bala.level.toUpperCase()})
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                          {effect.summary[currentLang]}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750">
                            <strong className="text-amber-700 dark:text-amber-400 block mb-1">
                              {currentLang === 'kn' ? 'ವೃತ್ತಿ & ಧನಾರ್ಜನೆ' : 'Career & Wealth'}:
                            </strong>
                            {effect.effects.careerAndWealth[currentLang]}
                          </div>
                          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-750">
                            <strong className="text-rose-700 dark:text-rose-400 block mb-1">
                              {currentLang === 'kn' ? 'ಬಾಂಧವ್ಯ & ದಾಂಪತ್ಯ' : 'Relationships & Marriage'}:
                            </strong>
                            {effect.effects.relationshipsAndHealth[currentLang]}
                          </div>
                        </div>

                        {/* Prescribed Remedy */}
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>{currentLang === 'kn' ? 'ಸೂಚಿತ ಪರಿಹಾರ:' : 'Prescribed Remedy:'}</span>
                          </div>
                          <p className="text-stone-700 dark:text-stone-300">{effect.remedy.action[currentLang]}</p>
                          <p className="text-[11px] font-mono text-amber-900 dark:text-amber-300 mt-1">
                            ಮಂತ್ರ: <strong>{effect.remedy.mantra}</strong> ({effect.remedy.mantraCount})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BHAVA PHILOSOPHY & PURUSHARTHAS */}
          {activeTab === 'bhavaPhilosophy' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ತತ್ವಶಾಸ್ತ್ರ' : 'Vedic Philosophy of Bhavas'}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-amber-300">
                  {currentLang === 'kn' ? 'ಭಾವ ಎಂದರೇನು? (What is a Bhava?)' : 'What is a Bhava in Vedic Astrology?'}
                </h4>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ "ಭಾವ" ಎಂದರೆ ಕೇವಲ ಒಂದು ಮನೆಯಲ್ಲ; ಅದು ಮಾನವ ಜೀವನದ ಪ್ರಜ್ಞೆಯ ಒಂದು ಆಯಾಮ ಅಥವಾ ಅನುಭವದ ರಂಗ. ಜನನದ ಕ್ಷಣದಲ್ಲಿ ಪೂರ್ವ ದಿಗಂತದಲ್ಲಿ ಉದಯಿಸುತ್ತಿರುವ ರಾಶಿಯು ಮೊದಲನೇ ಭಾವ (ಲಗ್ನ - ತನು ಭಾವ) ಆಗುತ್ತದೆ. ಅಲ್ಲಿಂದ ಆರಂಭಿಸಿ ಇಡೀ ೩೬೦ ಡಿಗ್ರಿಗಳ ಆಕಾಶವನ್ನು ೧೨ ಸಮಾನ ಭಾವಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗುತ್ತದೆ.'
                    : 'In Parashari Vedic Astrology, a "Bhava" translates as a state of existence, realm of experience, or house of consciousness. At the moment of birth, the exact degree of the zodiac rising on the eastern horizon marks the 1st House (Lagna / Tanu Bhava). From this vantage point, the entire 360° celestial sphere is segmented into 12 Bhavas.'}
                </p>
              </div>

              {/* 4 Purusharthas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1">
                  <strong className="text-amber-900 dark:text-amber-300 font-bold block text-sm">
                    ೧) ಧರ್ಮ ತ್ರಿಕೋಣ (Houses 1, 5, 9)
                  </strong>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    ಕರ್ತವ್ಯ, ಸತ್ಚಾರಿತ್ರ್ಯ, ಪೂರ್ವ ಪುಣ್ಯ, ಮಂತ್ರ ಸಿದ್ಧಿ, ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನ ಮತ್ತು ಭಗವತ್ ಕೃಪೆಯ ಸ್ಥಾನಗಳು.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <strong className="text-emerald-900 dark:text-emerald-300 font-bold block text-sm">
                    ೨) ಅರ್ಥ ತ್ರಿಕೋಣ (Houses 2, 6, 10)
                  </strong>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    ಸಂಪತ್ತು, ಆರ್ಥಿಕ ಸ್ಥಿರತೆ, ಉದ್ಯೋಗ ಕರ್ತವ್ಯ, ಶ್ರಮ ಮತ್ತು ಸಾಮಾಜಿಕ ಪ್ರತಿಷ್ಠೆಯ ಸ್ಥಾನಗಳು.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-1">
                  <strong className="text-rose-900 dark:text-rose-300 font-bold block text-sm">
                    ೩) ಕಾಮ ತ್ರಿಕೋಣ (Houses 3, 7, 11)
                  </strong>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    ಆಸೆ-ಆಕಾಂಕ್ಷೆಗಳು, ಒಡಹುಟ್ಟಿದವರು, ದಾಂಪತ್ಯ ಪ್ರೇಮ, ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಲಾಭ-ಸಿದ್ಧಿ.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-1">
                  <strong className="text-purple-900 dark:text-purple-300 font-bold block text-sm">
                    ೪) ಮೋಕ್ಷ ತ್ರಿಕೋಣ (Houses 4, 8, 12)
                  </strong>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    ಆಂತರಿಕ ಮನಃಶಾಂತಿ, ಗೂಢ ಆಧ್ಯಾತ್ಮಿಕ ರಹಸ್ಯಗಳು, ವೈರಾಗ್ಯ, ಸಾಧನೆ ಮತ್ತು ಅಂತಿಮ ಮುಕ್ತಿ.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>House #{selectedBhava}: {currentBhavaMeta.sanskritName[currentLang]}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
          >
            {currentLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Done / Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
