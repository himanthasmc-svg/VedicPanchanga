import React, { useState, useMemo } from 'react';
import {
  Award,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  HeartPulse,
  Info,
  Layers,
  Salad,
  ShieldCheck,
  Sparkles,
  Sun
} from 'lucide-react';
import { KundaliData, Language } from '../types';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { BHAVA_LIST, getGrahaBhavaEffect, WHAT_IS_BHAVA_GUIDE } from '../utils/bhavaDetails';
import { calculateAllHousesDrishtiSummary, calculateHouseDrishti } from '../utils/grahaDrishti';
import { SvgGrahaIcon } from './RealisticGraha';

interface UnifiedBhavaSectionProps {
  currentLang: Language;
  kundaliData: KundaliData;
  planetaryBalas: PlanetaryBalaBreakdown[];
  selectedBhavaNumber?: number;
  onSelectBhava?: (bhava: number) => void;
}

/**
 * Single Consolidated Bhava Analysis & 12 Houses Explorer.
 * Combines all details previously split across "Astrological House Analysis"
 * and "Interactive Bhava Explorer" into ONE deduplicated collapsible section.
 * Always hidden by default — expands inline directly below its button on click.
 */
export const UnifiedBhavaSection: React.FC<UnifiedBhavaSectionProps> = ({
  currentLang,
  kundaliData,
  planetaryBalas,
  selectedBhavaNumber: externalBhava,
  onSelectBhava
}) => {
  // Always hidden by default per user instruction
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showBhavaPrimer, setShowBhavaPrimer] = useState<boolean>(false);
  const [internalBhava, setInternalBhava] = useState<number>(externalBhava || 1);

  const activeBhava = externalBhava || internalBhava;
  const handleSelectBhava = (bNum: number) => {
    setInternalBhava(bNum);
    if (onSelectBhava) onSelectBhava(bNum);
  };

  const allHousesAnalysis = useMemo(() => calculateAllHousesDrishtiSummary(kundaliData), [kundaliData]);
  const houseDrishti = useMemo(
    () => calculateHouseDrishti(kundaliData, activeBhava),
    [activeBhava, kundaliData]
  );

  const bhavaMeta = BHAVA_LIST.find(b => b.bhava === activeBhava) || BHAVA_LIST[0];
  const houseObj = kundaliData.houses.find(h => h.bhava === activeBhava);
  const occupantPlanets = houseDrishti.occupantPlanets;
  const aspectingPlanets = houseDrishti.aspectingPlanets;

  const getBala = (planetName: string) =>
    planetaryBalas.find(b => b.planet.name.toLowerCase() === planetName.toLowerCase());

  const getCategoryStyle = (categoryEn: string) => {
    const lower = categoryEn.toLowerCase();
    if (lower.includes('kendra') && lower.includes('trikona')) {
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700';
    }
    if (lower.includes('trikona')) {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
    }
    if (lower.includes('dusthana')) {
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border-rose-300 dark:border-rose-700';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-300 dark:border-amber-700';
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-indigo-300/80 dark:border-indigo-900/70 shadow-xl overflow-hidden page-break-inside-avoid">
      {/* SINGLE COLLAPSIBLE BHAVA HEADER BUTTON (ALWAYS HIDDEN UNTIL CLICKED) */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-expanded={isExpanded}
        className={`w-full p-4 sm:p-5 text-left transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isExpanded
            ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-stone-900 text-white'
            : 'bg-gradient-to-r from-indigo-50/90 via-white to-amber-50/80 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 hover:from-indigo-100/80 dark:hover:bg-stone-800/80 text-stone-900 dark:text-stone-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
            isExpanded
              ? 'bg-amber-400 text-stone-950'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
          }`}>
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                isExpanded
                  ? 'bg-white/15 text-amber-200 border border-amber-300/40'
                  : 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300'
              }`}>
                {currentLang === 'kn' ? 'ಸಮಗ್ರ ೧೨ ಭಾವಗಳ ವಿಭಾಗ' : currentLang === 'hi' ? 'समग्र १२ भाव अनुभाग' : 'UNIFIED 12 BHAVAS ANALYSIS'}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-serif font-black mt-0.5 leading-snug">
              {currentLang === 'kn'
                ? 'ಭಾವ ವಿಶ್ಲೇಷಣೆ & ೧೨ ಮನೆಗಳ ಸಮಗ್ರ ದರ್ಶನ (Bhava Analysis & Explorer)'
                : currentLang === 'hi'
                ? 'भाव विश्लेषण एवं १२ घरों का समग्र अध्ययन (Bhava Analysis)'
                : 'Bhava Analysis & 12 Houses Explorer (Occupants, Drishti, Health & Remedies)'}
            </h3>
            <p className={`text-xs mt-0.5 ${isExpanded ? 'text-indigo-100/90' : 'text-stone-600 dark:text-stone-400'}`}>
              {currentLang === 'kn'
                ? 'ಭಾವಗಳ ಅರ್ಥ, ಭಾವಸ್ಥ ಗ್ರಹಗಳ ಫಲ, ಗ್ರಹ ದೃಷ್ಟಿ ಪ್ರಭಾವ, ಶಾರೀರಿಕ-ಮಾನಸಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಆಯುರ್ವೇದೀಯ ಆಹಾರ ಪರಿಹಾರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ.'
                : currentLang === 'hi'
                ? 'सभी १२ भावों का फल, स्थित ग्रह, ग्रह दृष्टि, शारीरिक-मानसिक स्वास्थ्य एवं आयुर्वेदिक आहार मार्गदर्शन देखने के लिए क्लिक करें।'
                : 'Click to expand inline below: 12 Bhavas significations, planet-in-house effects, incoming Drishti, physical/mental impact & Ayurvedic nutrition.'}
            </p>
          </div>
        </div>

        <div className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-xs ${
          isExpanded
            ? 'bg-amber-400 text-stone-950'
            : 'bg-indigo-700 text-white'
        }`}>
          <span>
            {isExpanded
              ? (currentLang === 'kn' ? 'ಭಾವ ವಿವರ ಮುಚ್ಚಿ' : currentLang === 'hi' ? 'भाव विवरण बंद करें' : 'Hide Bhava Details')
              : (currentLang === 'kn' ? 'ಭಾವ ವಿವರ ತೆರೆಯಿರಿ' : currentLang === 'hi' ? 'भाव विवरण खोलें' : 'Open Bhava Details')}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* EXPANDED INLINE CONTENT DIRECTLY BELOW BUTTON (NO POPUP) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-b from-stone-50/70 to-white dark:from-stone-950/60 dark:to-stone-900 border-t border-indigo-200 dark:border-stone-800 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Optional Collapsible "What is Bhava?" Primer */}
          <div className="rounded-2xl border border-amber-300/70 dark:border-stone-700 bg-amber-50/60 dark:bg-stone-850 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBhavaPrimer(p => !p)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-bold text-amber-900 dark:text-amber-300 cursor-pointer hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{WHAT_IS_BHAVA_GUIDE.title[currentLang]}</span>
              </span>
              {showBhavaPrimer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showBhavaPrimer && (
              <div className="px-4 pb-4 pt-2 text-xs text-stone-700 dark:text-stone-300 space-y-2.5 border-t border-amber-200/70 dark:border-stone-700">
                <p className="leading-relaxed">{WHAT_IS_BHAVA_GUIDE.meaning[currentLang]}</p>
                <p className="leading-relaxed">{WHAT_IS_BHAVA_GUIDE.origin[currentLang]}</p>
                <p className="leading-relaxed font-medium text-amber-900 dark:text-amber-200">
                  {WHAT_IS_BHAVA_GUIDE.differenceRashiBhava[currentLang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700">
                    <div className="text-[11px] text-stone-700 dark:text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.dharma[currentLang]}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700">
                    <div className="text-[11px] text-stone-700 dark:text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.artha[currentLang]}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700">
                    <div className="text-[11px] text-stone-700 dark:text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.kama[currentLang]}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700">
                    <div className="text-[11px] text-stone-700 dark:text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.moksha[currentLang]}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 12 Houses Interactive Grid Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                {currentLang === 'kn' ? '೧೨ ಭಾವಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ:' : currentLang === 'hi' ? '१२ भावों में से चुनें:' : 'Select Any of the 12 Bhavas to Inspect:'}
              </span>
              <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 font-bold">
                {currentLang === 'kn' ? `ಆಯ್ಕೆಯಾದ ಭಾವ: #${activeBhava}` : `Inspecting House #${activeBhava}`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {BHAVA_LIST.map(b => {
                const hAnalysis = allHousesAnalysis.find(a => a.bhava === b.bhava);
                const isSelected = activeBhava === b.bhava;
                const planetCount = hAnalysis?.occupantPlanets.length || 0;
                const aspectCount = hAnalysis?.aspectingPlanets.length || 0;

                return (
                  <button
                    key={b.bhava}
                    type="button"
                    onClick={() => handleSelectBhava(b.bhava)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-indigo-700 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                        : 'bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-mono font-black ${isSelected ? 'text-amber-300' : 'text-indigo-700 dark:text-indigo-400'}`}>
                        H{b.bhava}
                      </span>
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                      }`}>
                        {planetCount}P • {aspectCount}D
                      </span>
                    </div>
                    <div className="text-[11px] font-serif font-bold truncate">
                      {b.name[currentLang].split('(')[0].trim()}
                    </div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-stone-500 dark:text-stone-400'}`}>
                      {hAnalysis?.rashiName[currentLang].split('(')[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Bhava Unified Deep-Dive Card */}
          <div className="rounded-2xl bg-white dark:bg-stone-900 border-2 border-indigo-200 dark:border-stone-700 shadow-lg p-4 sm:p-5 space-y-5">
            {/* Top Summary Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-700 text-white font-mono text-xs font-black">
                    {currentLang === 'kn' ? `ಭಾವ #${activeBhava}` : currentLang === 'hi' ? `भाव #${activeBhava}` : `House #${activeBhava}`}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryStyle(bhavaMeta.category.en)}`}>
                    {bhavaMeta.category[currentLang]}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10.5px] font-bold border border-amber-300/60">
                    {houseObj?.rashiName[currentLang]}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                  {bhavaMeta.name[currentLang]}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {bhavaMeta.purposeToInspect[currentLang]}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-stone-800 border border-indigo-200/80 dark:border-stone-700 text-xs shrink-0 sm:min-w-[220px] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-stone-400 font-semibold">{currentLang === 'kn' ? 'ಕಾರಕ ಗ್ರಹ:' : 'Karaka:'}</span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-right">{bhavaMeta.karakas[currentLang]}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500 dark:text-stone-400 font-semibold">{currentLang === 'kn' ? 'ದೃಷ್ಟಿ ಸ್ಥಿತಿ:' : 'Drishti Tone:'}</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300 text-right">{houseDrishti.overallDrishtiToneLocalized[currentLang]}</span>
                </div>
              </div>
            </div>

            {/* Key Significations, Ideal/Challenging Grahas & Body Parts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>{currentLang === 'kn' ? 'ಪ್ರಮುಖ ಜೀವನ ಕ್ಷೇತ್ರಗಳು & ಅಂಗಗಳು' : 'Key Significations & Body Parts'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {bhavaMeta.keySignifications[currentLang]}
                </p>
                <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
                  <strong>{currentLang === 'kn' ? 'ದೇಹದ ಭಾಗಗಳು:' : 'Body Parts:'}</strong> {bhavaMeta.bodyParts[currentLang]}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-stone-850 border border-amber-200/80 dark:border-stone-800 space-y-1.5">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ಶುಭ & ಸವಾಲಿನ ಗ್ರಹಗಳು' : 'Favorable & Challenging Grahas'}</span>
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  <strong>{currentLang === 'kn' ? 'ಶುಭ ಗ್ರಹಗಳು:' : 'Ideal:'}</strong> {bhavaMeta.idealGrahas[currentLang]}
                </p>
                <p className="text-rose-800 dark:text-rose-300 leading-relaxed">
                  <strong>{currentLang === 'kn' ? 'ಸವಾಲಿನ ಗ್ರಹಗಳು:' : 'Challenging:'}</strong> {bhavaMeta.challengingGrahas[currentLang]}
                </p>
              </div>
            </div>

            {/* 1. Occupant Planets in this Bhava (with Shadbala & House-Specific Predictions) */}
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-1.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn'
                    ? `ಭಾವಸ್ಥ ಗ್ರಹಗಳು & ಫಲಗಳು (${occupantPlanets.length})`
                    : currentLang === 'hi'
                    ? `भाव में स्थित ग्रह एवं फल (${occupantPlanets.length})`
                    : `Occupying Grahas & House-Specific Predictions (${occupantPlanets.length})`}
                </span>
              </h5>

              {occupantPlanets.length === 0 ? (
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-dashed border-stone-300 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>
                    {currentLang === 'kn'
                      ? `ಈ #${activeBhava} ಭಾವದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹವು ನೇರವಾಗಿ ಸ್ಥಿತವಾಗಿಲ್ಲ. ಇದರ ಫಲವು ರಾಶ್ಯಾಧಿಪತಿಯ ಬಲ ಮತ್ತು ಈ ಭಾವದ ಮೇಲೆ ಬೀಳುವ ಗ್ರಹ ದೃಷ್ಟಿಗಳ ಆಧಾರದ ಮೇಲೆ ನಿರ್ಧಾರವಾಗುತ್ತದೆ.`
                      : `No planets directly occupy House #${activeBhava}. Results for this Bhava are governed by its Rashi lord's strength and the incoming Parashari aspects listed below.`}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {occupantPlanets.map(p => {
                    const bala = getBala(p.name);
                    const effect = getGrahaBhavaEffect(p.name, activeBhava);
                    return (
                      <div
                        key={p.name}
                        className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50/70 to-white dark:from-stone-850 dark:to-stone-900 border border-amber-200 dark:border-stone-700 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <SvgGrahaIcon name={p.name} size={26} isRetrograde={p.isRetrograde} />
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                                {p.sanskritName[currentLang]} {p.isRetrograde ? '[R]' : ''}
                              </div>
                              <div className="text-[10.5px] font-mono text-stone-500 dark:text-stone-400">
                                {p.degrees}° • {p.nakshatra[currentLang]}
                              </div>
                            </div>
                          </div>
                          {bala && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 text-[10px] font-mono font-bold shrink-0">
                              <Award className="w-3 h-3 inline mr-0.5" />
                              {bala.totalScore}%
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          {effect.title[currentLang]}
                        </div>
                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                          {effect.description[currentLang]}
                        </p>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/25 p-2 rounded-lg border border-emerald-200/70 dark:border-emerald-900/50">
                          <strong>{currentLang === 'kn' ? 'ಪರಿಹಾರ:' : 'Remedy:'}</strong> {effect.remedy[currentLang]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Incoming Parashari Drishti on this Bhava */}
            <div className="space-y-3">
              <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-1.5">
                <Eye className="w-4 h-4 text-rose-600" />
                <span>
                  {currentLang === 'kn'
                    ? `ಈ ಭಾವದ ಮೇಲೆ ಬೀಳುವ ಗ್ರಹ ದೃಷ್ಟಿಗಳು & ಪ್ರಭಾವ (${aspectingPlanets.length})`
                    : currentLang === 'hi'
                    ? `इस भाव पर पड़ने वाली ग्रह दृष्टियाँ व प्रभाव (${aspectingPlanets.length})`
                    : `Incoming Planetary Drishti (Aspects) & Effects on House #${activeBhava} (${aspectingPlanets.length})`}
                </span>
              </h5>

              {aspectingPlanets.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-stone-50 dark:bg-stone-850">
                  {currentLang === 'kn' ? 'ಈ ಭಾವದ ಮೇಲೆ ಯಾವುದೇ ಗ್ರಹದ ನೇರ ದೃಷ್ಟಿ ಇಲ್ಲ.' : 'No direct planetary aspects fall upon this house.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aspectingPlanets.map((asp, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        asp.nature === 'benefic'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                          <SvgGrahaIcon name={asp.aspectingPlanet.name} size={22} isRetrograde={asp.aspectingPlanet.isRetrograde} />
                          <span>
                            {asp.aspectingPlanet.sanskritName[currentLang]} (H{asp.aspectingPlanet.bhava})
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          asp.nature === 'benefic'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}>
                          {asp.distanceFromPlanet}th {currentLang === 'kn' ? 'ದೃಷ್ಟಿ' : 'Aspect'}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        {asp.aspectTypeLocalized[currentLang]}
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                        {asp.effectOnHouse[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Physical Health, Mental Temperament & Ayurvedic Nutritional Therapy */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {/* Physical Health */}
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="font-serif font-bold text-sm text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{currentLang === 'kn' ? 'ಶಾರೀರಿಕ ಅಂಗಗಳು & ಆರೋಗ್ಯ' : 'Physical Health & Organs'}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಅಧೀನ ಅಂಗಗಳು:' : 'Governed Organs:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.physicalImpact.governedOrgans[currentLang]}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ:' : 'Sensitivities:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.physicalImpact.vulnerabilities[currentLang]}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಚೈತನ್ಯ ಪ್ರಭಾವ:' : 'Vitality Effect:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.physicalImpact.vitalityEffect[currentLang]}</p>
                </div>
              </div>

              {/* Mental Impact */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                <div className="font-serif font-bold text-sm text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{currentLang === 'kn' ? 'ಮಾನಸಿಕ ಸ್ಥಿತಿ & ಭಾವನೆ' : 'Mental & Emotional Impact'}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಮನಸ್ಥಿತಿ:' : 'Temperament:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.mentalImpact.temperament[currentLang]}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಭಾವನಾತ್ಮಕ ಪ್ರವೃತ್ತಿ:' : 'Emotional Tendencies:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.mentalImpact.emotionalTendencies[currentLang]}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಬೌದ್ಧಿಕ ಶಕ್ತಿ:' : 'Cognitive Strength:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.mentalImpact.cognitiveStrength[currentLang]}</p>
                </div>
              </div>

              {/* Nutritional Therapy */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                <div className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Salad className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentLang === 'kn' ? 'ಆಯುರ್ವೇದೀಯ ಆಹಾರ & ಪೋಷಕಾಂಶ' : 'Ayurvedic Nutrition & Therapy'}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಶಿಫಾರಸು ಆಹಾರ:' : 'Recommended Foods:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.nutritionalTherapy.recommendedFoods[currentLang]}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ಔಷಧೀಯ ಗಿಡಮೂಲಿಕೆ & ಪೋಷಕಾಂಶ:' : 'Herbs & Nutrients:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">
                    {houseDrishti.nutritionalTherapy.ayurvedicHerbs[currentLang]} • {houseDrishti.nutritionalTherapy.vitaminsAndNutrients[currentLang]}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ತಪ್ಪಿಸಬೇಕಾದ ಆಹಾರ:' : 'Foods to Limit:'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.nutritionalTherapy.foodsToAvoid[currentLang]}</p>
                </div>
              </div>
            </div>

            {/* 4. House Vedic Remedies Strip */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-300/70 dark:border-amber-900/60 text-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentLang === 'kn' ? 'ವೈದಿಕ ಮಂತ್ರ:' : 'Vedic Mantra:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.astrologicalRemedies.vedicMantra[currentLang]}</p>
              </div>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-300 block">
                  {currentLang === 'kn' ? 'ರತ್ನ & ರುದ್ರಾಕ್ಷಿ:' : 'Gemstone & Rudraksha:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.astrologicalRemedies.gemstoneAndRudraksha[currentLang]}</p>
              </div>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-300 block">
                  {currentLang === 'kn' ? 'ದಾನ ಧರ್ಮ:' : 'Charity (Daanam):'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.astrologicalRemedies.daanamCharity[currentLang]}</p>
              </div>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-300 block">
                  {currentLang === 'kn' ? 'ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ:' : 'Spiritual Practice:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 mt-0.5">{houseDrishti.astrologicalRemedies.spiritualPractice[currentLang]}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
