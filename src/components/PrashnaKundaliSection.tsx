import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  Layers, 
  Compass, 
  Calendar,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CityLocation, KundaliData, Language, LocalizedString } from '../types';
import { PrashnaJudgmentResult, PRASHNA_CATEGORIES } from '../utils/prashnaKundali';
import { NAKSHATRA_AKSHARAS, NakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { COUNTRIES_AND_CITIES } from '../utils/worldPlaces';
import { calculateKundali, CITIES, RASHIS } from '../utils/panchanga';
import { RealisticGraha } from './RealisticGraha';

interface PrashnaKundaliSectionProps {
  currentLang: Language;
  prashnaResult: PrashnaJudgmentResult;
  prashnaDateStr: string;
  onDateChange: (date: string) => void;
  prashnaTimeStr: string;
  onTimeChange: (time: string) => void;
  onSetNow: () => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  renderHousePlanets: (houseNum: number, orientation?: 'horizontal' | 'vertical' | 'diamond', targetData?: KundaliData) => React.ReactNode;
  getHouseRashiNum: (houseNum: number, targetData?: KundaliData) => number;
}

export const PrashnaKundaliSection: React.FC<PrashnaKundaliSectionProps> = ({
  currentLang,
  prashnaResult,
  prashnaDateStr,
  onDateChange,
  prashnaTimeStr,
  onTimeChange,
  onSetNow,
  selectedCategory,
  onSelectCategory,
  renderHousePlanets,
  getHouseRashiNum
}) => {
  const [prashnaChartStyle, setPrashnaChartStyle] = useState<'north' | 'south'>('north');
  const [personChartStyle, setPersonChartStyle] = useState<'north' | 'south'>('north');

  // Mode: General Prashna (default) vs Personalized Prashna for Person
  const [queryMode, setQueryMode] = useState<'general' | 'personalized'>('general');
  
  // Person input details
  const [personName, setPersonName] = useState<string>('');
  const [customQuestionText, setCustomQuestionText] = useState<string>('');
  const [birthInputMode, setBirthInputMode] = useState<'dob' | 'akshara'>('dob');

  // Person Date & Time of Birth
  const [personDob, setPersonDob] = useState<string>('1995-05-15');
  const [personTob, setPersonTob] = useState<string>('09:30');
  const [personCountryCode, setPersonCountryCode] = useState<string>('IN');
  const [personCity, setPersonCity] = useState<CityLocation>(CITIES[0]);

  // Name Akshara Picker
  const [aksharaSearch, setAksharaSearch] = useState<string>('');
  const [selectedAkshara, setSelectedAkshara] = useState<NakshatraPadaAkshara>(NAKSHATRA_AKSHARAS[0]);

  // Filter countries and cities for Person
  const currentCountry = useMemo(() => {
    return COUNTRIES_AND_CITIES.find(c => c.code === personCountryCode) || COUNTRIES_AND_CITIES[0];
  }, [personCountryCode]);

  // Calculate Person's Janma Kundali when in DOB mode
  const personKundaliData: KundaliData = useMemo(() => {
    if (birthInputMode === 'dob') {
      const dt = `${personDob}T${personTob}:00`;
      return calculateKundali(dt, personCity);
    } else {
      // In Akshara mode: Create a chart referenced to the derived Janma Rashi
      const derivedRashi = selectedAkshara.rashiIndex;
      const fakeDt = `${prashnaDateStr}T${prashnaTimeStr}:00`;
      const base = calculateKundali(fakeDt, personCity);
      // Align houses starting from derived Rashi
      const adjustedHouses = base.houses.map((h, idx) => ({
        ...h,
        rashiIndex: (derivedRashi + idx) % 12,
        rashiName: RASHIS[(derivedRashi + idx) % 12]
      }));
      return {
        ...base,
        lagnaRashiIndex: derivedRashi,
        lagnaRashiName: RASHIS[derivedRashi],
        houses: adjustedHouses
      };
    }
  }, [birthInputMode, personDob, personTob, personCity, selectedAkshara, prashnaDateStr, prashnaTimeStr]);

  // Person's Derived Moon and Rashi
  const personMoon = useMemo(() => {
    return personKundaliData.planets.find(p => p.name === 'Moon') || personKundaliData.planets[1];
  }, [personKundaliData]);

  // Filtered 108 Aksharas
  const filteredAksharas = useMemo(() => {
    if (!aksharaSearch.trim()) return NAKSHATRA_AKSHARAS;
    const q = aksharaSearch.trim().toLowerCase();
    return NAKSHATRA_AKSHARAS.filter(a => 
      a.akshara.toLowerCase().includes(q) ||
      a.aksharaDevanagari.includes(q) ||
      a.aksharaKannada.includes(q) ||
      a.nakshatraName.en.toLowerCase().includes(q) ||
      a.nakshatraName.kn.includes(q)
    );
  }, [aksharaSearch]);

  // Comparative Horary Analysis (Natal vs Prashna)
  const comparativeAnalysis = useMemo(() => {
    const personMoonRashi = birthInputMode === 'akshara' ? selectedAkshara.rashiIndex : personMoon.rashiIndex;
    const prashnaLagnaRashi = prashnaResult.kundaliData.lagnaRashiIndex;
    const karyaHouse = prashnaResult.category.primaryHouse;
    const karyaRashi = (prashnaLagnaRashi + (karyaHouse - 1)) % 12;

    // Angle between Person Moon and Prashna Lagna
    const moonToPrashnaLagna = ((prashnaLagnaRashi - personMoonRashi + 12) % 12) + 1;
    // Angle between Person Moon and Prashna Karya Bhava
    const moonToKarya = ((karyaRashi - personMoonRashi + 12) % 12) + 1;

    let synergyScore = 70;
    let relationshipNature: LocalizedString = {
      en: 'Favorable Harmony (Shubha Sambandha)',
      kn: 'ಶುಭ ಯೋಗ ಮತ್ತು ಸಾತ್ವಿಕ ಅನುಕೂಲ',
      hi: 'शुभ सम्बन्ध एवं अनुकूलता'
    };

    // Evaluate Kendra/Trikona vs Trika
    if ([1, 4, 7, 10, 5, 9].includes(moonToPrashnaLagna)) {
      synergyScore += 18;
      relationshipNature = {
        en: 'Highly Favorable Kendra/Trikona Alignment (Rapid Karya Siddhi)',
        kn: 'ಕೇಂದ್ರ-ತ್ರಿಕೋಣ ಶುಭ ಯೋಗ (ಶೀಘ್ರ ಕಾರ್ಯಸಿದ್ಧಿ)',
        hi: 'केन्द्र-त्रिकोण राजयोग (शीघ्र कार्यसिद्धि)'
      };
    } else if ([6, 8, 12].includes(moonToPrashnaLagna)) {
      synergyScore -= 22;
      relationshipNature = {
        en: 'Trika Obstacle (Requires Specific Vedic Remedy)',
        kn: 'ತ್ರಿಕ ಭಾವ ದೋಷ (ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ)',
        hi: 'त्रिक भाव बाधा (उपाय आवश्यक)'
      };
    } else if ([3, 11].includes(moonToPrashnaLagna)) {
      synergyScore += 10;
      relationshipNature = {
        en: 'Upachaya Growth through Effort & Persistence',
        kn: 'ಉಪಚಯ ಭಾವ ಯಶಸ್ಸು (ಪ್ರಯತ್ನದಿಂದ ಲಾಭ)',
        hi: 'उपचय भाव सफलता (प्रयत्न से लाभ)'
      };
    }

    const finalPersonalScore = Math.min(98, Math.max(25, Math.round((prashnaResult.verdictScore * 0.55) + (synergyScore * 0.45))));

    let verdictTitle: LocalizedString = {
      en: 'Favorable Success Expected',
      kn: 'ಕಾರ್ಯಸಿದ್ಧಿ ನಿರೀಕ್ಷಿತ (ಅನುಕೂಲಕರ)',
      hi: 'कार्यसिद्धि योग (अनुकूल)'
    };
    let verdictColor = '#10b981';

    if (finalPersonalScore >= 78) {
      verdictTitle = {
        en: 'Direct Karya Siddhi (High Probability of Success)',
        kn: 'ಖಚಿತ ಕಾರ್ಯಸಿದ್ಧಿ (ಉತ್ತಮ ಯಶಸ್ಸು)',
        hi: 'निश्चित कार्यसिद्धि (उत्तम सफलता)'
      };
      verdictColor = '#059669';
    } else if (finalPersonalScore >= 55) {
      verdictTitle = {
        en: 'Success with Moderate Delay / Effort',
        kn: 'ಸ್ವಲ್ಪ ವಿಳಂಬದೊಂದಿಗೆ ಯಶಸ್ಸು',
        hi: 'मध्यम विलम्ब से कार्यसिद्धि'
      };
      verdictColor = '#f59e0b';
    } else {
      verdictTitle = {
        en: 'Challenging Outcome (Patience & Remedy Required)',
        kn: 'ಪ್ರತಿಬಂಧಕ ಯೋಗ (ಶಾಂತಿ-ಪರಿಹಾರ ಅಗತ್ಯ)',
        hi: 'कठिन योग (शान्ति एवं उपाय आवश्यक)'
      };
      verdictColor = '#ef4444';
    }

    return {
      moonToPrashnaLagna,
      moonToKarya,
      finalPersonalScore,
      verdictTitle,
      verdictColor,
      relationshipNature
    };
  }, [birthInputMode, personMoon, selectedAkshara, prashnaResult]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white shadow-xl border border-emerald-500/30">
        <div className="flex items-center gap-2 text-emerald-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{currentLang === 'kn' ? 'ಪ್ರಶ್ನ ಕುಂಡಲಿ • ಕಾರ್ಯಸಿದ್ಧಿ & ಕಾಲನಿರ್ಣಯ' : currentLang === 'hi' ? 'प्रश्न कुण्डली • कार्यसिद्धि एवं कालनिर्णय' : 'PRASHNA KUNDALI • VEDIC HORARY ASTROLOGY'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          {currentLang === 'kn' ? 'ಪ್ರಶ್ನ ಕಾಲ ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ವ್ಯಕ್ತಿಗತ ಫಲ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'प्रश्न काल लग्न कुण्डली एवं व्यक्तिगत परिणाम' : 'Horary Prashna Chart & Personalized Query Judgment'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
          {currentLang === 'kn'
            ? 'ಪ್ರಶ್ನೆ ಕೇಳಿದ ಕ್ಷಣದ ಗೋಚಾರ ಲಗ್ನ ಹಾಗೂ ವ್ಯಕ್ತಿಯ ಜನ್ಮ ಕುಂಡಲಿ (ಅಥವಾ ನಾಮಾಕ್ಷರ) ಎರಡನ್ನೂ ಹೋಲಿಸಿ, ಪ್ರಶ್ನ ಲಗ್ನಾಧಿಪತಿ ಮತ್ತು ಕಾರ್ಯ ಕಾರಕ ಗ್ರಹದ ಬಲದ ಆಧಾರದ ಮೇಲೆ ನಿಖರ ಫಲ ನಿರ್ಣಯ.'
            : currentLang === 'hi'
            ? 'प्रश्न काल के लग्न एवं जातक की जन्म कुण्डली (अथवा नामाक्षर) की युति से कार्यसिद्धि एवं समय का शास्त्रीय निर्णय।'
            : 'Synthesizes the query moment horary Ascendant with the querent birth chart (or name syllable) to determine exact Karya Siddhi, timing, and prescribed remedies.'}
        </p>

        {/* Mode Selector Toggle: General vs Personalized */}
        <div className="mt-4 pt-3 border-t border-emerald-500/30 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-emerald-200 mr-1">
            {currentLang === 'kn' ? 'ವಿಶ್ಲೇಷಣಾ ವಿಧಾನ:' : 'Analysis Mode:'}
          </span>
          <button
            type="button"
            onClick={() => setQueryMode('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              queryMode === 'general'
                ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-emerald-950/70 text-emerald-200 hover:bg-emerald-900 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentLang === 'kn' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನ (General Horary)' : 'General Prashna Chart'}</span>
          </button>
          <button
            type="button"
            onClick={() => setQueryMode('personalized')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              queryMode === 'personalized'
                ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300'
                : 'bg-emerald-950/70 text-emerald-200 hover:bg-emerald-900 border border-emerald-500/30'
            }`}
          >
            <User className="w-3.5 h-3.5 text-indigo-900" />
            <span>{currentLang === 'kn' ? 'ವ್ಯಕ್ತಿಗತ ಪ್ರಶ್ನ (Person Birth Details)' : 'Personalized Querent Prashna'}</span>
          </button>
        </div>
      </div>

      {/* Query Question Input & Category Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        
        {/* Custom Question Text Input */}
        <div>
          <label className="font-bold text-stone-800 dark:text-stone-200 text-xs flex items-center gap-1.5 mb-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>{currentLang === 'kn' ? 'ನಿಮ್ಮ ನಿಖರ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ (Type Your Question):' : 'Type Your Inquiry / Question:'}</span>
          </label>
          <input
            type="text"
            value={customQuestionText}
            onChange={(e) => setCustomQuestionText(e.target.value)}
            placeholder={
              currentLang === 'kn'
                ? 'ಉದಾ: ನನ್ನ ಹೊಸ ಉದ್ಯೋಗ ಸಂದರ್ಶನ ಯಶಸ್ವಿಯಾಗುವುದೇ? ಅಥವಾ ಕಂಕಣ ಭಾಗ್ಯ ಯಾವಾಗ ಕೂಡಿಬರುವುದು?'
                : 'e.g. Will I get the promotion this quarter? Will my health recover soon?'
            }
            className="w-full p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 shadow-inner"
          />
        </div>

        {/* Prashna Category, Date, and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          {/* Category Selection */}
          <div className="sm:col-span-1">
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ಪ್ರಶ್ನೆ ವಿಷಯ (Query Category):' : currentLang === 'hi' ? 'प्रश्न विषय:' : 'Question Category:'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
            >
              {PRASHNA_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name[currentLang]}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ಪ್ರಶ್ನ ದಿನಾಂಕ (Query Date):' : 'Prashna Date:'}
            </label>
            <input
              type="date"
              value={prashnaDateStr}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Time & Set Now */}
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ಪ್ರಶ್ನ ಸಮಯ (Query Time):' : 'Prashna Time:'}
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={prashnaTimeStr}
                onChange={(e) => onTimeChange(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={onSetNow}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1"
                title="Set to Current Exact Moment"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಈಗಿನ ಸಮಯ' : 'Set Now'}</span>
              </button>
            </div>
          </div>

        </div>

        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
          <strong>Category Scope:</strong> {prashnaResult.category.description[currentLang]} • <strong>Primary House:</strong> House {prashnaResult.category.primaryHouse} • <strong>Karaka Planet:</strong> {prashnaResult.karakaPlanetName[currentLang]}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSONALIZED SECTION: PERSON DETAILS & BIRTH PROFILE OR AKSHARA PICKER */}
      {/* ========================================================================= */}
      {queryMode === 'personalized' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-600 shadow-lg space-y-5 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-stone-700 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <h3 className="font-serif font-bold text-base text-stone-950 dark:text-white">
                  {currentLang === 'kn' ? 'ಪ್ರಶ್ನೆ ಕೇಳುವ ವ್ಯಕ್ತಿಯ ಜಾತಕ ವಿವರಗಳು (Querent Profile)' : 'Querent Birth Profile & Nakshatra Derivation'}
                </h3>
                <span className="text-[11px] text-stone-600 dark:text-stone-400">
                  {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ ಲಭ್ಯವಿದ್ದರೆ ನಮೂದಿಸಿ, ಇಲ್ಲದಿದ್ದರೆ ಹೆಸರಿನ ಮೊದಲ ಅಕ್ಷರ ಆಯ್ಕೆ ಮಾಡಿ' : 'Enter birth details or choose name first letter to auto-select Rashi & Nakshatra'}
                </span>
              </div>
            </div>

            {/* Sub-selector: DOB vs Akshara */}
            <div className="inline-flex rounded-xl border border-amber-400/80 p-0.5 bg-white dark:bg-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBirthInputMode('dob')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  birthInputMode === 'dob'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-amber-700'
                }`}
              >
                {currentLang === 'kn' ? 'ದಿನಾಂಕ & ಸಮಯ ಲಭ್ಯ (DOB Available)' : '1. Enter DOB & Time'}
              </button>
              <button
                type="button"
                onClick={() => setBirthInputMode('akshara')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  birthInputMode === 'akshara'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-amber-700'
                }`}
              >
                {currentLang === 'kn' ? 'ದಿನಾಂಕ ಲಭ್ಯವಿಲ್ಲ (ನಾಮಾಕ್ಷರ ಆಯ್ಕೆ)' : '2. DOB Not Available (Name Akshara)'}
              </button>
            </div>
          </div>

          {/* Name input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {currentLang === 'kn' ? 'ವ್ಯಕ್ತಿಯ ಹೆಸರು (Querent Name):' : 'Person Name:'}
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Himanth / ಸುದರ್ಶನ"
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
              />
            </div>

            {birthInputMode === 'dob' ? (
              <>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth):' : 'Date of Birth:'}
                  </label>
                  <input
                    type="date"
                    value={personDob}
                    onChange={(e) => setPersonDob(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth):' : 'Time of Birth:'}
                  </label>
                  <input
                    type="time"
                    value={personTob}
                    onChange={(e) => setPersonTob(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
                  />
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 p-3 rounded-xl bg-amber-100/70 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950 dark:text-amber-200 block">
                    {currentLang === 'kn' ? 'ಆಯ್ಕೆ ಮಾಡಲಾದ ನಾಮಾಕ್ಷರ:' : 'Selected Name Syllable:'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-bold font-serif text-amber-900 dark:text-amber-300">
                      {selectedAkshara.aksharaKannada} ({selectedAkshara.akshara})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10.5px] font-bold">
                      {selectedAkshara.nakshatraName[currentLang]} Pada {selectedAkshara.pada}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-[10.5px] font-bold">
                      Rashi: {selectedAkshara.rashiName[currentLang]}
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-600 dark:text-stone-400">
                  Rashi Lord: <strong>{selectedAkshara.rashiLord[currentLang]}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Place of Birth: Country & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {currentLang === 'kn' ? 'ಜನ್ಮ ದೇಶ (Country of Birth):' : 'Birth Country:'}
              </label>
              <select
                value={personCountryCode}
                onChange={(e) => {
                  setPersonCountryCode(e.target.value);
                  const matched = COUNTRIES_AND_CITIES.find(c => c.code === e.target.value);
                  if (matched && matched.cities.length > 0) {
                    setPersonCity(matched.cities[0]);
                  }
                }}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
              >
                {COUNTRIES_AND_CITIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name[currentLang] || country.name.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                {currentLang === 'kn' ? 'ಜನ್ಮ ನಗರ (City of Birth):' : 'Birth City:'}
              </label>
              <select
                value={personCity.name}
                onChange={(e) => {
                  const city = currentCountry.cities.find(c => c.name === e.target.value);
                  if (city) setPersonCity(city);
                }}
                className="w-full p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold"
              >
                {currentCountry.cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 108 Nakshatra Aksharas Selection Palette (When DOB is Not Available) */}
          {birthInputMode === 'akshara' && (
            <div className="p-4 rounded-xl bg-white dark:bg-stone-800/80 border border-amber-300 dark:border-stone-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                <span className="font-bold text-xs text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentLang === 'kn' ? '೨೭ ನಕ್ಷತ್ರಗಳ ೧೦೮ ನಾಮಾಕ್ಷರಗಳ ಪಟ್ಟಿ (Select Starting Letter):' : 'Select Name Initial / Nakshatra Pada Syllable:'}</span>
                </span>
                
                <input
                  type="text"
                  value={aksharaSearch}
                  onChange={(e) => setAksharaSearch(e.target.value)}
                  placeholder="Search letter / Nakshatra..."
                  className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 max-w-xs"
                />
              </div>

              {/* Akshara Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-1.5 max-h-56 overflow-y-auto p-1 border border-stone-100 dark:border-stone-700 rounded-lg">
                {filteredAksharas.map((a, idx) => {
                  const isSelected = selectedAkshara.akshara === a.akshara && selectedAkshara.pada === a.pada;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAkshara(a)}
                      className={`p-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white font-bold shadow-md ring-2 ring-amber-400 scale-105'
                          : 'bg-stone-50 dark:bg-stone-900 hover:bg-amber-100 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800'
                      }`}
                      title={`${a.aksharaKannada} (${a.akshara}) - ${a.nakshatraName.en} Pada ${a.pada} - ${a.rashiName.en}`}
                    >
                      <div className="text-sm font-bold font-serif leading-none">{a.aksharaKannada}</div>
                      <div className="text-[9px] font-mono opacity-80">{a.akshara}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPARATIVE HORARY JUDGMENT SCORECARD (Natal vs Prashna) */}
      {/* ========================================================================= */}
      {queryMode === 'personalized' ? (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50 dark:from-stone-900 dark:to-stone-800 border-2 border-emerald-500 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 dark:border-stone-700 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                {currentLang === 'kn' ? 'ವ್ಯಕ್ತಿಗತ ಪ್ರಶ್ನ ಕಾರ್ಯಸಿದ್ಧಿ ನಿರ್ಣಯ (Personalized Karya Siddhi)' : 'PERSONALIZED KARYA SIDDHI VERDICT'}
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-950 dark:text-white">
                  {comparativeAnalysis.verdictTitle[currentLang]}
                </span>
                <span className="text-lg font-bold font-mono" style={{ color: comparativeAnalysis.verdictColor }}>
                  ({comparativeAnalysis.finalPersonalScore}/100)
                </span>
              </div>
              {customQuestionText && (
                <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 mt-1 italic">
                  &ldquo;{customQuestionText}&rdquo;
                </p>
              )}
            </div>

            <div className="text-right space-y-1">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-md"
                style={{ backgroundColor: comparativeAnalysis.verdictColor }}
              >
                Timeline: {prashnaResult.timeline[currentLang]}
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-mono">
                Person Moon: {personMoon.rashiName[currentLang]} → Prashna Lagna: House {comparativeAnalysis.moonToPrashnaLagna}
              </p>
            </div>
          </div>

          {/* Comparative Astrological Reasoning */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">
              {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೀಯ ಗ್ರಹ ಸಂಬಂಧ ಮತ್ತು ಕಾರ್ಯಯೋಗ ವಿಶ್ಲೇಷಣೆ:' : 'Classical Astrological Reasoning & Synergy:'}
            </span>
            <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-emerald-200 dark:border-stone-700 space-y-1 text-stone-700 dark:text-stone-300 text-[11.5px] leading-relaxed">
              <p>
                ● <strong>Relationship:</strong> {comparativeAnalysis.relationshipNature[currentLang]}.
              </p>
              <p>
                ● <strong>Natal Moon to Horary Lagna:</strong> Positioned in House {comparativeAnalysis.moonToPrashnaLagna}, indicating the mental focus and receptive receptivity of the querent.
              </p>
              <p>
                ● <strong>Prashna Karaka Lord:</strong> {prashnaResult.karakaPlanetName[currentLang]} occupies House {prashnaResult.karakaHouse}, governing the exact matter of inquiry ({prashnaResult.category.name[currentLang]}).
              </p>
              <p>
                ● <strong>Classical Conclusion:</strong> {prashnaResult.astrologicalReasoning[0][currentLang]}
              </p>
            </div>
          </div>

          {/* Prescribed Remedy */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300/80 dark:border-stone-700 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              {currentLang === 'kn' ? 'ಕಾರ್ಯಸಿದ್ಧಿಗಾಗಿ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಮಾರ್ಗ:' : 'Prescribed Action & Sacred Remedy for Success:'}
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {prashnaResult.remedialAdvice[currentLang]}
            </p>
          </div>
        </div>
      ) : (
        /* General Prashna Scorecard (Default) */
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-stone-900 dark:to-stone-800 border-2 border-emerald-500 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 dark:border-stone-700 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                PRASHNA KARYA SIDDHI VERDICT (ಪ್ರಶ್ನ ಕಾರ್ಯಸಿದ್ಧಿ ಫಲ)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-950 dark:text-white">
                  {prashnaResult.verdictTitle[currentLang]}
                </span>
                <span className="text-lg font-bold text-stone-500 font-mono">
                  ({prashnaResult.verdictScore}/100)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span 
                className="inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: prashnaResult.verdictColor }}
              >
                Timeline: {prashnaResult.timeline[currentLang]}
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                Prashna Lagna: {prashnaResult.prashnaLagnaName[currentLang]} ({prashnaResult.prashnaLagnaDegree}°) • {prashnaResult.lagnaNature[currentLang]}
              </p>
            </div>
          </div>

          {/* Astrological Reasoning */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">
              {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಜ್ಯೋತಿಷ್ಯ ಕಾರಣಗಳು ಮತ್ತು ಗ್ರಹ ಸ್ಥಿತಿ:' : 'Classical Astrological Reasoning:'}
            </span>
            <ul className="list-disc pl-5 space-y-1 text-stone-700 dark:text-stone-300 text-[11.5px] leading-relaxed">
              {prashnaResult.astrologicalReasoning.map((r, idx) => (
                <li key={idx}>{r[currentLang]}</li>
              ))}
            </ul>
          </div>

          {/* Remedial Advice */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-emerald-300/80 dark:border-stone-700 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              {currentLang === 'kn' ? 'ಪ್ರಶ್ನ ಕಾರ್ಯಸಿದ್ಧಿ ಪರಿಹಾರ ಮಾರ್ಗ:' : 'Prescribed Action for Success:'}
            </span>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {prashnaResult.remedialAdvice[currentLang]}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DUAL KUNDALIS: PERSON JANMA KUNDALI & PRESENT PRASHNA KUNDALI */}
      {/* ========================================================================= */}
      <div className={`grid grid-cols-1 ${queryMode === 'personalized' ? 'lg:grid-cols-2' : ''} gap-6`}>
        
        {/* CHART 1: Person's Janma / Rashi Kundali (Shown in Personalized Mode) */}
        {queryMode === 'personalized' && (
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700/60 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {personName ? `${personName} - ` : ''}
                  {currentLang === 'kn' ? 'ವ್ಯಕ್ತಿಯ ಜನ್ಮ ಕುಂಡಲಿ' : 'Querent Janma Kundali'}
                </h3>
              </div>

              {/* North / South Switcher */}
              <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPersonChartStyle('north')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    personChartStyle === 'north'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  North
                </button>
                <button
                  type="button"
                  onClick={() => setPersonChartStyle('south')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    personChartStyle === 'south'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  South
                </button>
              </div>
            </div>

            {/* Drawn Chart for Person */}
            {personChartStyle === 'north' ? (
              <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[420px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 sm:p-2 border-2 border-amber-500 shadow-xl overflow-hidden select-none">
                <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect x="0" y="0" width="500" height="500" fill="#fffbeb" stroke="#d97706" strokeWidth="3" />
                  <line x1="0" y1="0" x2="500" y2="500" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="500" y1="0" x2="0" y2="500" stroke="#f59e0b" strokeWidth="2" />
                  <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#d97706" strokeWidth="2.5" />
                </svg>

                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* House 1: Lagna */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '50%', top: '25%', maxWidth: '140px' }}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9.5px] font-black uppercase text-amber-700 bg-amber-100 px-1 py-0.2 rounded shadow-2xs">
                        LAGNA
                      </span>
                      <span className="text-[10.5px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded shadow-2xs leading-none">
                        {getHouseRashiNum(1, personKundaliData)}
                      </span>
                    </div>
                    <div className="max-w-[135px]">
                      {renderHousePlanets(1, 'diamond', personKundaliData)}
                    </div>
                  </div>

                  {/* Houses 2 to 12 */}
                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '9%', maxWidth: '85px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(2, personKundaliData)}</span>
                    <div className="max-w-[82px]">{renderHousePlanets(2, 'horizontal', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '25%', maxWidth: '56px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(3, personKundaliData)}</span>
                    <div className="max-w-[54px]">{renderHousePlanets(3, 'vertical', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '50%', maxWidth: '140px' }}>
                    <span className="text-[10.5px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(4, personKundaliData)}</span>
                    <div className="max-w-[130px]">{renderHousePlanets(4, 'diamond', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '75%', maxWidth: '56px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(5, personKundaliData)}</span>
                    <div className="max-w-[54px]">{renderHousePlanets(5, 'vertical', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '91%', maxWidth: '85px' }}>
                    <div className="max-w-[82px] mb-0.5">{renderHousePlanets(6, 'horizontal', personKundaliData)}</div>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs">{getHouseRashiNum(6, personKundaliData)}</span>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '75%', maxWidth: '140px' }}>
                    <span className="text-[10.5px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(7, personKundaliData)}</span>
                    <div className="max-w-[135px]">{renderHousePlanets(7, 'diamond', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '91%', maxWidth: '85px' }}>
                    <div className="max-w-[82px] mb-0.5">{renderHousePlanets(8, 'horizontal', personKundaliData)}</div>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs">{getHouseRashiNum(8, personKundaliData)}</span>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '75%', maxWidth: '56px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(9, personKundaliData)}</span>
                    <div className="max-w-[54px]">{renderHousePlanets(9, 'vertical', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '50%', maxWidth: '140px' }}>
                    <span className="text-[10.5px] font-extrabold text-stone-900 bg-amber-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(10, personKundaliData)}</span>
                    <div className="max-w-[130px]">{renderHousePlanets(10, 'diamond', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '25%', maxWidth: '56px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(11, personKundaliData)}</span>
                    <div className="max-w-[54px]">{renderHousePlanets(11, 'vertical', personKundaliData)}</div>
                  </div>

                  <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '9%', maxWidth: '85px' }}>
                    <span className="text-[10px] font-extrabold text-stone-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(12, personKundaliData)}</span>
                    <div className="max-w-[82px]">{renderHousePlanets(12, 'horizontal', personKundaliData)}</div>
                  </div>

                </div>
              </div>
            ) : (
              /* South Indian Fixed Zodiac Chart for Person */
              <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[420px] mx-auto bg-amber-50 rounded-xl p-1.5 sm:p-2 border-2 border-amber-600 shadow-xl">
                <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-amber-100/70 border border-amber-300">
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Meena (12)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 11)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Mesha (1)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 0)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Vrishabha (2)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 1)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Mithuna (3)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 2)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Kumbha (11)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 10)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="col-span-2 row-span-2 p-3 border border-amber-400 rounded bg-amber-50 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-sm font-serif font-bold text-amber-950">Natal Kundali</span>
                    <span className="text-[11px] text-amber-800 font-bold mt-1 bg-amber-200/60 px-2 py-0.5 rounded-md">
                      Lagna: {personKundaliData.houses[0].rashiName[currentLang]}
                    </span>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Karka (4)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 3)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Makara (10)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 9)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Simha (5)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 4)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Dhanu (9)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 8)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Vrishchika (8)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 7)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Tula (7)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 6)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                  <div className="p-1 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[9px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">Kanya (6)</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(personKundaliData.houses.find(h => h.rashiIndex === 5)?.bhava || 0, 'diamond', personKundaliData)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHART 2: Prashna Moment Horary Kundali */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಪ್ರಶ್ನ ಕಾಲದ ಲಗ್ನ ಕುಂಡಲಿ (Query Moment Chart)' : 'Prashna Moment Horary Chart'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 hidden sm:inline">
                Lagna: {prashnaResult.prashnaLagnaName[currentLang]}
              </span>
              <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPrashnaChartStyle('north')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    prashnaChartStyle === 'north'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  North
                </button>
                <button
                  type="button"
                  onClick={() => setPrashnaChartStyle('south')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    prashnaChartStyle === 'south'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  South
                </button>
              </div>
            </div>
          </div>

          {/* Drawn Prashna Chart */}
          {prashnaChartStyle === 'north' ? (
            <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[420px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 sm:p-2 border-2 border-emerald-600 shadow-xl overflow-hidden select-none">
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                <rect x="0" y="0" width="500" height="500" fill="#f0fdf4" stroke="#059669" strokeWidth="3" />
                <line x1="0" y1="0" x2="500" y2="500" stroke="#10b981" strokeWidth="2" />
                <line x1="500" y1="0" x2="0" y2="500" stroke="#10b981" strokeWidth="2" />
                <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#059669" strokeWidth="2.5" />
              </svg>

              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* House 1: Lagna */}
                <div 
                  className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '50%', top: '25%', maxWidth: '140px' }}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9.5px] font-black uppercase text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded shadow-2xs">
                      PRASHNA LAGNA
                    </span>
                    <span className="text-[10.5px] font-extrabold text-stone-900 bg-emerald-100 px-1 py-0.2 rounded shadow-2xs leading-none">
                      {getHouseRashiNum(1, prashnaResult.kundaliData)}
                    </span>
                  </div>
                  <div className="max-w-[135px]">
                    {renderHousePlanets(1, 'diamond', prashnaResult.kundaliData)}
                  </div>
                </div>

                {/* Houses 2 to 12 */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '9%', maxWidth: '85px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(2, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[82px]">{renderHousePlanets(2, 'horizontal', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '25%', maxWidth: '56px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(3, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[54px]">{renderHousePlanets(3, 'vertical', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '50%', maxWidth: '140px' }}>
                  <span className="text-[10.5px] font-extrabold text-stone-900 bg-emerald-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(4, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[130px]">{renderHousePlanets(4, 'diamond', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '9%', top: '75%', maxWidth: '56px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(5, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[54px]">{renderHousePlanets(5, 'vertical', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '25%', top: '91%', maxWidth: '85px' }}>
                  <div className="max-w-[82px] mb-0.5">{renderHousePlanets(6, 'horizontal', prashnaResult.kundaliData)}</div>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs">{getHouseRashiNum(6, prashnaResult.kundaliData)}</span>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '75%', maxWidth: '140px' }}>
                  <span className="text-[10.5px] font-extrabold text-stone-900 bg-emerald-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(7, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[135px]">{renderHousePlanets(7, 'diamond', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '91%', maxWidth: '85px' }}>
                  <div className="max-w-[82px] mb-0.5">{renderHousePlanets(8, 'horizontal', prashnaResult.kundaliData)}</div>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs">{getHouseRashiNum(8, prashnaResult.kundaliData)}</span>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '75%', maxWidth: '56px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(9, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[54px]">{renderHousePlanets(9, 'vertical', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '50%', maxWidth: '140px' }}>
                  <span className="text-[10.5px] font-extrabold text-stone-900 bg-emerald-100 px-1 py-0.2 rounded mb-0.5">{getHouseRashiNum(10, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[130px]">{renderHousePlanets(10, 'diamond', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '91%', top: '25%', maxWidth: '56px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(11, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[54px]">{renderHousePlanets(11, 'vertical', prashnaResult.kundaliData)}</div>
                </div>

                <div className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '75%', top: '9%', maxWidth: '85px' }}>
                  <span className="text-[10px] font-extrabold text-stone-900 bg-emerald-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(12, prashnaResult.kundaliData)}</span>
                  <div className="max-w-[82px]">{renderHousePlanets(12, 'horizontal', prashnaResult.kundaliData)}</div>
                </div>

              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-square max-w-[320px] xs:max-w-[380px] sm:max-w-[420px] mx-auto bg-emerald-50 rounded-xl p-1.5 sm:p-2 border-2 border-emerald-600 shadow-xl">
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-emerald-100/70 border border-emerald-300">
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Meena (12)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 11)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Mesha (1)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 0)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Vrishabha (2)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 1)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Mithuna (3)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 2)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Kumbha (11)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 10)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="col-span-2 row-span-2 p-3 border border-emerald-400 rounded bg-emerald-50 flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="text-sm font-serif font-bold text-emerald-950">Prashna Kundali</span>
                  <span className="text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                    Lagna: {prashnaResult.prashnaLagnaName[currentLang]}
                  </span>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Karka (4)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 3)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Makara (10)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 9)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Simha (5)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 4)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Dhanu (9)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 8)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Vrishchika (8)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 7)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Tula (7)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 6)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
                <div className="p-1 border border-emerald-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                  <span className="text-[9px] font-bold text-emerald-900 border-b border-emerald-200 pb-0.5">Kanya (6)</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">{renderHousePlanets(prashnaResult.kundaliData.houses.find(h => h.rashiIndex === 5)?.bhava || 0, 'diamond', prashnaResult.kundaliData)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
