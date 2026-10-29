import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Apple, 
  Pill, 
  Flame, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Sun, 
  HeartHandshake, 
  Award, 
  Eye, 
  Info,
  Layers,
  Heart,
  Calendar,
  Compass
} from 'lucide-react';
import { Language, KundaliData } from '../types';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { SvgGrahaIcon } from './RealisticGraha';
import { 
  calculateAllGrahasRemedyNutrition, 
  calculateGrahaRemedyNutrition, 
  GrahaRemedyNutritionProfile 
} from '../utils/grahaRemedyNutrition';

interface GrahaRemedyNutritionViewProps {
  currentLang: Language;
  kundaliData: KundaliData;
  planetaryBalas?: PlanetaryBalaBreakdown[];
  selectedGrahaName?: string;
  onSelectGraha?: (grahaName: string) => void;
}

export const GrahaRemedyNutritionView: React.FC<GrahaRemedyNutritionViewProps> = ({
  currentLang,
  kundaliData,
  planetaryBalas = [],
  selectedGrahaName: externalSelectedGraha,
  onSelectGraha
}) => {
  const [internalSelectedGraha, setInternalSelectedGraha] = useState<string>('Sun');
  const [filterMode, setFilterMode] = useState<'all' | 'weak' | 'strong' | 'moderate'>('all');
  const [activeCategory, setActiveCategory] = useState<'nutrition' | 'lifestyle' | 'astrology'>('nutrition');

  const selectedPlanetName = externalSelectedGraha || internalSelectedGraha;

  const handleSelect = (name: string) => {
    setInternalSelectedGraha(name);
    if (onSelectGraha) onSelectGraha(name);
  };

  const allProfiles: GrahaRemedyNutritionProfile[] = useMemo(() => {
    return calculateAllGrahasRemedyNutrition(kundaliData, planetaryBalas);
  }, [kundaliData, planetaryBalas]);

  const activeProfile = useMemo(() => {
    return allProfiles.find(p => p.planet.name.toLowerCase() === selectedPlanetName.toLowerCase()) || allProfiles[0];
  }, [allProfiles, selectedPlanetName]);

  const filteredProfiles = useMemo(() => {
    if (filterMode === 'all') return allProfiles;
    return allProfiles.filter(p => p.strengthCategory === filterMode);
  }, [allProfiles, filterMode]);

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-400/80 dark:border-stone-800 shadow-2xl space-y-6 animate-in fade-in page-break-inside-avoid">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 text-white flex items-center justify-center shadow-lg shrink-0">
            <Apple className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                {currentLang === 'kn' ? 'ನವಗ್ರಹ ಪೋಷಕಾಂಶ & ಜೀವನಶೈಲಿ ನಕ್ಷೆ' : 'Graha Remedy & Nutrition Mapping'}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-mono font-bold text-stone-500">
                Personalized Dinacharya
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentLang === 'kn'
                ? 'ಗ್ರಹ ಬಲ & ಭಾವ ಸ್ಥಿತಿ ಆಧಾರಿತ ಆಹಾರ, ಜೀವನಶೈಲಿ ಹಾಗೂ ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳು'
                : currentLang === 'hi'
                ? 'ग्रह बल एवं भाव स्थिति अनुसार व्यक्तिगत पोषण, जीवनशैली एवं ज्योतिषीय उपाय'
                : 'Astrological Remedy & Nutrition Mapping by Planetary Strength & House'}
            </h3>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start md:self-auto text-xs font-bold flex-wrap">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {currentLang === 'kn' ? 'ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳು' : 'All 9 Grahas'}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('weak')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'weak'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ (Remedy)' : 'Needs Remedy'}</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('strong')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'strong'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            {currentLang === 'kn' ? 'ಬಲಿಷ್ಠ (Strong)' : 'Strong'}
          </button>
        </div>
      </div>

      {/* Graha Selector Pills Bar */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-stone-600 dark:text-stone-400 block">
          {currentLang === 'kn' ? 'ಪರಿಶೀಲಿಸಲು ಗ್ರಹವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Graha):' : 'Select Graha to View Personalized Recommendations:'}
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {allProfiles.map((p) => {
            const isSelected = p.planet.name.toLowerCase() === activeProfile.planet.name.toLowerCase();
            const score = p.balaBreakdown?.totalScore || 60;
            return (
              <button
                key={p.planet.name}
                type="button"
                onClick={() => handleSelect(p.planet.name)}
                className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-600 shadow-md scale-102 ring-2 ring-amber-400/50'
                    : 'bg-stone-50 dark:bg-stone-850 hover:bg-amber-50 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                <SvgGrahaIcon 
                  name={p.planet.name} 
                  size={26} 
                  isRetrograde={p.planet.isRetrograde} 
                />
                <span className="font-serif font-bold text-xs">
                  {p.planet.sanskritName[currentLang]}
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : p.strengthCategory === 'strong'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : p.strengthCategory === 'weak'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}>
                  H#{p.planet.bhava} • {score}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Profile Main Card */}
      <div className="space-y-5">
        
        {/* Profile Overview Header Card */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-stone-850 dark:via-stone-800 dark:to-stone-850 border border-amber-300 dark:border-stone-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-700 flex items-center justify-center shadow-md shrink-0">
                <SvgGrahaIcon name={activeProfile.planet.name} size={40} isRetrograde={activeProfile.planet.isRetrograde} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white">
                    {activeProfile.planet.name} ({activeProfile.planet.sanskritName[currentLang]})
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    activeProfile.strengthCategory === 'strong'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      : activeProfile.strengthCategory === 'weak'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                  }`}>
                    {activeProfile.strengthCategoryLocalized[currentLang]}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {activeProfile.planet.rashiName[currentLang]} ({activeProfile.planet.degrees}°) • Nakshatra: {activeProfile.planet.nakshatra[currentLang]} (Pada {activeProfile.planet.pada})
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                  {currentLang === 'kn'
                    ? `${activeProfile.planet.bhava}ನೇ ಭಾವದಲ್ಲಿ ${activeProfile.planet.sanskritName[currentLang]} ಗ್ರಹದ ಕಾರಕತ್ವ & ಪ್ರಭಾವ`
                    : currentLang === 'hi'
                    ? `${activeProfile.planet.bhava}वें भाव में ${activeProfile.planet.sanskritName[currentLang]} का प्रभाव`
                    : `${activeProfile.planet.name} in House #${activeProfile.planet.bhava} • Natal Significations`}
                </h4>
              </div>
            </div>

            {/* Bala Breakdown KPI */}
            {activeProfile.balaBreakdown && (
              <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-amber-200 dark:border-stone-700 text-right shrink-0">
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                  {currentLang === 'kn' ? 'ಒಟ್ಟಾರೆ ಗ್ರಹ ಬಲ' : 'Total Shadbala Score'}
                </span>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xl font-serif font-black text-amber-700 dark:text-amber-400">
                    {activeProfile.balaBreakdown.totalScore}
                  </span>
                  <span className="text-xs font-mono text-stone-400">/ 100</span>
                </div>
                <div className="w-28 bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-700"
                    style={{ width: `${activeProfile.balaBreakdown.totalScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {activeProfile.currentHouseSignificance[currentLang]}
          </p>
        </div>

        {/* Sub-Category Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
          <button
            type="button"
            onClick={() => setActiveCategory('nutrition')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCategory === 'nutrition'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>{currentLang === 'kn' ? '೧. ಆಹಾರ & ಪೋಷಕಾಂಶ ಚಿಕಿತ್ಸೆ' : '1. Nutrition & Diet Therapy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('lifestyle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCategory === 'lifestyle'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{currentLang === 'kn' ? '೨. ಆಯುರ್ವೇದ ದಿನಚರ್ಯ & ಜೀವನಶೈಲಿ' : '2. Lifestyle & Dinacharya'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('astrology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeCategory === 'astrology'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentLang === 'kn' ? '೩. ವೈದಿಕ ಪರಿಹಾರ & ದಾನ-ಧರ್ಮ' : '3. Astrological Remedies & Daanam'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 1: NUTRITIONAL & DIETARY THERAPY */}
        {/* ========================================================================= */}
        {activeCategory === 'nutrition' && (
          <div className="space-y-4 animate-in fade-in">
            
            {/* Top Philosophy Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-stone-850 border border-emerald-300 dark:border-stone-700 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಆಹಾರ ಸಿದ್ಧಾಂತ & ಜೀವಕೋಶೀಯ ಪೋಷಣೆ:' : 'Dietary Philosophy & Cellular Nutrition:'}</span>
              </span>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-semibold leading-relaxed">
                {activeProfile.nutritionalTherapy.dietaryPhilosophy[currentLang]}
              </p>
            </div>

            {/* Grid: Superfoods & Micronutrients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-stone-700 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'kn' ? 'ವಿಶಿಷ್ಟ ಸೂಪರ್-ಫುಡ್ಸ್ (Superfoods)' : 'Superfoods & Sacred Grains'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.nutritionalTherapy.superfoods[currentLang]}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-teal-200 dark:border-stone-700 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider text-xs">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>{currentLang === 'kn' ? 'ಗುರಿತ ಪೋಷಕಾಂಶಗಳು & ವಿಟಮಿನ್‌ಗಳು' : 'Targeted Micronutrients & Vitamins'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.nutritionalTherapy.targetedNutrients[currentLang]}
                </p>
              </div>

            </div>

            {/* Foods to Consume vs Avoid Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Foods to Consume */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-stone-900 border border-emerald-300 dark:border-emerald-800 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider text-xs border-b border-emerald-200 dark:border-stone-800 pb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'kn' ? 'ಸೇವಿಸಬೇಕಾದ ಆಹಾರಗಳು (Recommended Foods)' : 'Foods to Actively Consume'}</span>
                </div>
                <ul className="space-y-1.5">
                  {activeProfile.nutritionalTherapy.foodsToConsume.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item[currentLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-stone-900 border border-rose-300 dark:border-rose-900 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold uppercase tracking-wider text-xs border-b border-rose-200 dark:border-stone-800 pb-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{currentLang === 'kn' ? 'ತ್ಯಜಿಸಬೇಕಾದ/ಮಿತಗೊಳಿಸಬೇಕಾದ ಆಹಾರಗಳು' : 'Foods to Strictly Limit / Avoid'}</span>
                </div>
                <ul className="space-y-1.5">
                  {activeProfile.nutritionalTherapy.foodsToAvoid.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>{item[currentLang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Herbal Decoctions & Meal Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 block">
                  {currentLang === 'kn' ? 'ಆಯುರ್ವೇದೀಯ ಗಿಡಮೂಲಿಕೆ ಕಷಾಯಗಳು & ಪಾನೀಯ:' : 'Herbal Decoctions & Teas:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.nutritionalTherapy.herbalDecoctions[currentLang]}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-800 dark:text-indigo-400 block">
                  {currentLang === 'kn' ? 'ಪ್ರಶಸ್ತ ಊಟದ ಸಮಯ (Chronobiology):' : 'Optimal Meal Timings:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.nutritionalTherapy.optimalMealTimings[currentLang]}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-SECTION 2: LIFESTYLE & DINACHARYA */}
        {/* ========================================================================= */}
        {activeCategory === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in">
            
            {/* 1. Daily Routine */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ದೈನಂದಿನ ದಿನಚರ್ಯ & ನಿದ್ರಾ ಶಿಸ್ತು' : 'Daily Regimen & Wake-up Routine'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {activeProfile.lifestyleRegimen.idealDailyRoutine[currentLang]}
              </p>
            </div>

            {/* 2. Exercise & Movement */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-orange-200 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400 font-bold uppercase tracking-wider text-xs">
                <Activity className="w-4 h-4 text-orange-600" />
                <span>{currentLang === 'kn' ? 'ವ್ಯಾಯಾಮ, ಯೋಗಾಸನ & ಚಲನೆ' : 'Physical Exercise & Yoga Asanas'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {activeProfile.lifestyleRegimen.exerciseAndMovement[currentLang]}
              </p>
            </div>

            {/* 3. Solar & Nature Therapy */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                <Sun className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'kn' ? 'ಸೂರ್ಯ ಕಿರಣ & ಪ್ರಕೃತಿ ಚಿಕಿತ್ಸೆ' : 'Sun Exposure & Nature Grounding'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {activeProfile.lifestyleRegimen.sunAndNatureTherapy[currentLang]}
              </p>
            </div>

            {/* 4. Color Therapy */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-purple-200 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold uppercase tracking-wider text-xs">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>{currentLang === 'kn' ? 'ವರ್ಣ ಚಿಕಿತ್ಸೆ & ವಸ್ತ್ರ ಧಾರಣೆ (Color Therapy)' : 'Color Therapy & Recommended Attire'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {activeProfile.lifestyleRegimen.colorTherapy[currentLang]}
              </p>
            </div>

            {/* 5. Mindful Relaxation */}
            <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-700 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
                <Heart className="w-4 h-4 text-indigo-600" />
                <span>{currentLang === 'kn' ? 'ಮಾನಸಿಕ ಶಾಂತಿ & ಪ್ರಾಣಾಯಾಮ ಧ್ಯಾನ' : 'Mental Peace & Pranayama Meditation'}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                {activeProfile.lifestyleRegimen.mindfulRelaxation[currentLang]}
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-SECTION 3: ASTROLOGICAL REMEDIES & DAANAM */}
        {/* ========================================================================= */}
        {activeCategory === 'astrology' && (
          <div className="space-y-4 animate-in fade-in">
            
            {/* Mantras & Japa Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-850 dark:to-stone-800 border-2 border-amber-400 dark:border-amber-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ಮುಖ್ಯ ವೈದಿಕ ಮಂತ್ರ & ಬೀಜ ಮಂತ್ರ:' : 'Primary Vedic & Beeja Mantra:'}</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                  {activeProfile.astrologicalRemedies.mantraCount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/90 dark:bg-stone-900 border border-amber-200 dark:border-stone-700">
                <div className="font-serif font-black text-sm sm:text-base text-amber-950 dark:text-amber-200">
                  {activeProfile.astrologicalRemedies.primaryMantra[currentLang]}
                </div>
                <div className="text-xs font-serif font-bold text-amber-800 dark:text-amber-400 mt-1">
                  ಬೀಜ ಮಂತ್ರ: <strong>{activeProfile.astrologicalRemedies.beejaMantra}</strong>
                </div>
              </div>
            </div>

            {/* Gemstone, Rudraksha & Deity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Gemstone */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-purple-200 dark:border-stone-700 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-purple-800 dark:text-purple-400 block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>{currentLang === 'kn' ? 'ರತ್ನ ಧಾರಣೆ ಸಲಹೆ (Gemstone)' : 'Gemstone Recommendation'}</span>
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.astrologicalRemedies.gemstoneAdvice[currentLang]}
                </p>
              </div>

              {/* Rudraksha */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ರುದ್ರಾಕ್ಷಿ ಮುಖಿ (Rudraksha)' : 'Rudraksha Mukhi Guidance'}</span>
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.astrologicalRemedies.rudrakshaMukhi[currentLang]}
                </p>
              </div>

              {/* Deity Veneration */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-700 shadow-2xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-rose-800 dark:text-rose-400 block flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>{currentLang === 'kn' ? 'ಇಷ್ಟ ದೇವತಾ ಆರಾಧನೆ' : 'Deity Veneration'}</span>
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {activeProfile.astrologicalRemedies.deityVeneration[currentLang]}
                </p>
              </div>

            </div>

            {/* Daanam Charity Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 dark:from-stone-850 dark:to-stone-800 border border-indigo-200 dark:border-stone-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold uppercase tracking-wider text-xs">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <span>{currentLang === 'kn' ? 'ದಾನ-ಧರ್ಮ, ದಿನ ಹಾಗೂ ಫಲಾನುಭವಿ (Daanam Vidhi)' : 'Auspicious Daanam (Charity) Protocol'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900 border border-indigo-100 dark:border-stone-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">
                    {currentLang === 'kn' ? 'ದಾನ ಸಾಮಗ್ರಿಗಳು:' : 'Charity Items:'}
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {activeProfile.astrologicalRemedies.daanamCharity.items[currentLang]}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900 border border-indigo-100 dark:border-stone-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">
                    {currentLang === 'kn' ? 'ಶುಭ ದಿನ & ಸಮಯ:' : 'Auspicious Timing:'}
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {activeProfile.astrologicalRemedies.daanamCharity.dayAndTime[currentLang]}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900 border border-indigo-100 dark:border-stone-800 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase">
                    {currentLang === 'kn' ? 'ಸ್ವೀಕರಿಸುವವರು (Recipient):' : 'Ideal Recipient:'}
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {activeProfile.astrologicalRemedies.daanamCharity.recipient[currentLang]}
                  </span>
                </div>
              </div>
            </div>

            {/* Sacred Ritual */}
            <div className="p-3.5 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <div className="text-stone-800 dark:text-stone-200">
                <strong>{currentLang === 'kn' ? 'ವಿಶೇಷ ದೈನಂದಿನ ಧಾರ್ಮಿಕ ಪೂಜಾ ಆಚರಣೆ:' : 'Sacred Daily Ritual:'}</strong> {activeProfile.astrologicalRemedies.sacredRitual[currentLang]}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
