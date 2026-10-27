import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Gem, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Compass, 
  Sun, 
  Moon, 
  Layers,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Loader2,
  Info,
  HelpCircle,
  Award,
  Zap,
  Activity,
  Flame,
  Globe,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { CityLocation, KundaliData, Language } from '../types';
import { VedicRemediesResult } from '../utils/vedicRemedies';
import { COUNTRIES_AND_CITIES } from '../utils/worldPlaces';
import { CITIES, RASHIS, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';
import { BHAVA_LIST, getGrahaBhavaEffect, WHAT_IS_BHAVA_GUIDE } from '../utils/bhavaDetails';
import { WorldwidePlacePicker } from './WorldwidePlacePicker';
import { ChandraKundaliChart } from './ChandraKundaliChart';
import { getNakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { VimshottariDashaResult } from '../utils/vimshottariDasha';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';

interface VedicRemediesSectionProps {
  currentLang: Language;
  remediesData: VedicRemediesResult;
  kundaliData: KundaliData;
  dateStr: string;
  setDateStr: (val: string) => void;
  timeStr: string;
  setTimeStr: (val: string) => void;
  selectedCountryCode: string;
  setSelectedCountryCode: (val: string) => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onDetectGps: () => void;
  isGpsLoading: boolean;
  gpsStatus: string;
  chartStyle: 'north' | 'south';
  setChartStyle: (val: 'north' | 'south') => void;
  renderHousePlanets: (houseNum: number, layout?: 'diamond' | 'horizontal' | 'vertical') => React.ReactNode;
  getHouseRashiNum: (houseNum: number) => number;
  vimshottariDasha?: VimshottariDashaResult;
  planetaryBalas?: PlanetaryBalaBreakdown[];
}

export const VedicRemediesSection: React.FC<VedicRemediesSectionProps> = ({
  currentLang,
  remediesData,
  kundaliData,
  dateStr,
  setDateStr,
  timeStr,
  setTimeStr,
  selectedCountryCode,
  setSelectedCountryCode,
  selectedCity,
  onSelectCity,
  onDetectGps,
  isGpsLoading,
  gpsStatus,
  chartStyle,
  setChartStyle,
  renderHousePlanets,
  getHouseRashiNum,
  vimshottariDasha,
  planetaryBalas
}) => {
  // Currently highlighted Bhava for in-depth inspection (1 to 12)
  const [selectedBhava, setSelectedBhava] = useState<number>(1);
  const [showWhatIsBhava, setShowWhatIsBhava] = useState<boolean>(true);
  const [activeChartTab, setActiveChartTab] = useState<'lagna' | 'chandra' | 'both'>('lagna');
  const [selectedTimelineMahadasha, setSelectedTimelineMahadasha] = useState<number | null>(null);

  // Find country metadata for city dropdowns
  const currentCountry = COUNTRIES_AND_CITIES.find(c => c.code === selectedCountryCode) || COUNTRIES_AND_CITIES[0];

  // Selected Bhava Information
  const bhavaMeta = BHAVA_LIST.find(b => b.bhava === selectedBhava) || BHAVA_LIST[0];
  const houseData = kundaliData.houses.find(h => h.bhava === selectedBhava);
  const planetsInSelectedHouse = kundaliData.planets.filter(p => p.bhava === selectedBhava);

  // Derived Janma Vivara (Birth Details) based on entered Date, Time and Place
  const janmaVivara = useMemo(() => {
    const moon = kundaliData.planets.find(p => p.name === 'Moon') || kundaliData.planets[1];
    const moonLong = (moon.rashiIndex * 30 + moon.degrees);
    const nakSpan = 360 / 27; // 13.33333333 degrees per nakshatra
    const padaSpan = nakSpan / 4; // 3.33333333 degrees per pada

    const nakIndex = Math.floor(moonLong / nakSpan) % 27;
    const padaNumber = Math.min(4, Math.max(1, Math.floor((moonLong % nakSpan) / padaSpan) + 1));
    const rashiIndex = moon.rashiIndex;
    const rashiMeta = RASHIS[rashiIndex] || RASHIS[0];

    const padaAksharaInfo = getNakshatraPadaAkshara(nakIndex, padaNumber);

    const lagnaHouse = kundaliData.houses[0];
    const lagnaDeg = kundaliData.lagnaDegree;
    const lagnaNakName = kundaliData.lagnaNakshatra;
    const sun = kundaliData.planets.find(p => p.name === 'Sun');

    return {
      moonLong,
      rashiIndex,
      rashiName: { en: rashiMeta.en, kn: rashiMeta.kn, hi: rashiMeta.hi },
      rashiLord: { en: rashiMeta.lordEn, kn: rashiMeta.lordKn, hi: rashiMeta.lordHi },
      nakshatraIndex: nakIndex,
      nakshatraName: {
        en: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraEn || 'Ashwini',
        kn: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraKn || 'ಅಶ್ವಿನಿ',
        hi: RASHI_NAKSHATRA_CHART[nakIndex]?.nakshatraHi || 'अश्विनी'
      },
      padaNumber,
      akshara: padaAksharaInfo.akshara,
      aksharaKannada: padaAksharaInfo.aksharaKannada,
      aksharaDevanagari: padaAksharaInfo.aksharaDevanagari,
      lagnaRashi: lagnaHouse.rashiName,
      lagnaDegree: lagnaDeg,
      lagnaNakshatra: lagnaNakName,
      sunRashi: sun?.rashiName || { en: 'Aries', kn: 'ಮೇಷ', hi: 'मेष' },
      dateFormatted: dateStr,
      timeFormatted: timeStr,
      cityName: selectedCity.name,
      cityLocation: selectedCity
    };
  }, [kundaliData, dateStr, timeStr, selectedCity]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-700 via-orange-700 to-stone-900 text-white shadow-xl border border-amber-500/30">
        <div className="flex items-center gap-2 text-amber-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>{currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಆಧಾರಿತ ವೈದಿಕ ಪರಿಹಾರಗಳು & ಜನ್ಮ ಭಾವ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'लग्न कुण्डली आधारित वैदिक उपचार एवं भाव फल' : 'VEDIC REMEDIES & BIRTH CHART BHAVA ANALYSIS'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
          {currentLang === 'kn' ? 'ಜನ್ಮ ಕುಂಡಲಿ, ಭಾವ ಪ್ರಭಾವ ಮತ್ತು ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ ಮಾರ್ಗ' : currentLang === 'hi' ? 'जन्म कुण्डली, भाव प्रभाव एवं शास्त्रीय वैदिक उपाय' : 'Birth Kundali, Bhava Effects & Vedic Remedial Harmony'}
        </h2>
        <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-3xl leading-relaxed">
          {currentLang === 'kn'
            ? `ವ್ಯಕ್ತಿಯ ಜನ್ಮ ದಿನಾಂಕ, ಸಮಯ ಮತ್ತು ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ರಚಿಸಲಾದ ಲಗ್ನ ಕುಂಡಲಿ (${remediesData.lagnaRashi[currentLang]} ಲಗ್ನ, ಅಧಿಪತಿ: ${remediesData.lagnaLord[currentLang]}), ೧೨ ಭಾವಗಳ ಪರಿಶೀಲನೆ, ನವಗ್ರಹಗಳ ಭಾವ ಫಲಗಳು ಮತ್ತು ದೋಷ ಶಾಂತಿ ಪರಿಹಾರಗಳು.`
            : currentLang === 'hi'
            ? `जातक की जन्म तिथि, समय एवं स्थान अनुसार निर्मित लग्न कुण्डली (${remediesData.lagnaRashi[currentLang]} लग्न, स्वामी: ${remediesData.lagnaLord[currentLang]}), १२ भावों का परीक्षण एवं शास्त्रीय उपाय।`
            : `Comprehensive Vedic remedies based on your drawn Birth Kundali (${remediesData.lagnaRashi[currentLang]} Lagna, Lord: ${remediesData.lagnaLord[currentLang]}), 12 Bhavas examination, and planet-by-house effects.`}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. BIRTH DETAILS CONFIGURATOR (DATE, TIME, WORLDWIDE PLACE & GPS) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-400/60 dark:border-amber-600/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Calendar className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಜನ್ಮ ವಿವರಗಳು (Date, Time & Worldwide Place of Birth)' : 'Birth Coordinates Configurator'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {currentLang === 'kn'
                  ? 'ಯಾವುದೇ ವ್ಯಕ್ತಿಯ ನಿಖರ ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ (ಪ್ರಪಂಚದ ಯಾವುದೇ ನಗರ/ಗೂಗಲ್ ಮ್ಯಾಪ್ ರೆಫರೆನ್ಸ್) ಕುಂಡಲಿ, ಚಂದ್ರ ಚಾರ್ಟ್ ಮತ್ತು ನಾಮಾಕ್ಷರ ತಿಳಿಯಿರಿ.'
                  : 'Enter birth date, time, and location (worldwide city search, Google Maps coordinates or GPS) to compute exact Kundali.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDetectGps}
            disabled={isGpsLoading}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50 shrink-0"
            title="Detect GPS coordinates to recalculate Kundali"
          >
            {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>{currentLang === 'kn' ? 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ (GPS)' : 'Use GPS Location'}</span>
          </button>
        </div>

        {gpsStatus && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-2 border border-amber-300 dark:border-amber-800">
            <Navigation className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span>{gpsStatus}</span>
          </div>
        )}

        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs">
          {/* Date Picker */}
          <div className="md:col-span-3">
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth):' : 'Date of Birth:'}
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Time Picker */}
          <div className="md:col-span-3">
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth):' : 'Time of Birth:'}
            </label>
            <input
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Worldwide Location Picker with Google Maps & GPS */}
          <div className="md:col-span-6">
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1 flex items-center justify-between">
              <span>{currentLang === 'kn' ? 'ಜನ್ಮ ಸ್ಥಳ (Place / Google Maps / GPS):' : 'Birth Place (Worldwide / Maps):'}</span>
              <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Worldwide Search & Coordinates</span>
              </span>
            </label>
            <WorldwidePlacePicker
              currentLang={currentLang}
              selectedCity={selectedCity}
              onSelectCity={onSelectCity}
              selectedCountryCode={selectedCountryCode}
              setSelectedCountryCode={setSelectedCountryCode}
              compact={false}
            />
          </div>
        </div>

        {/* Live Calculation Indicator */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {currentLang === 'kn' ? 'ಕುಂಡಲಿ ಗಣಿತ ಸಿದ್ಧವಾಗಿದೆ:' : 'Kundali Calculated:'} <strong>{kundaliData.houses[0].rashiName[currentLang]} ({kundaliData.lagnaDegree}°)</strong> • 
              Moon: <strong>{kundaliData.planets.find(p => p.name === 'Moon')?.nakshatra[currentLang]}</strong>
            </span>
          </div>
          <span className="font-mono text-[11px] bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg font-bold">
            Lat: {selectedCity.lat.toFixed(2)}°N • Lng: {selectedCity.lng.toFixed(2)}°E
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* JANMA VIVARA (BIRTH DETAILS: RASHI, NAKSHATRA, PADA & NAMA AKSHARA) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white shadow-xl border-2 border-amber-400/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-serif text-xl font-bold shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {currentLang === 'kn' ? 'ಜನ್ಮ ವಿವರಗಳು • ರಾಶಿ, ನಕ್ಷತ್ರ, ಪಾದ & ನಾಮಾಕ್ಷರ' : 'Birth Details: Rashi, Nakshatra, Pada & Name Starting Letter'}
              </h3>
              <p className="text-xs text-amber-100">
                {currentLang === 'kn'
                  ? `ದಿನಾಂಕ: ${janmaVivara.dateFormatted} • ಸಮಯ: ${janmaVivara.timeFormatted} • ಸ್ಥಳ: ${janmaVivara.cityName} (${selectedCity.lat.toFixed(2)}°N, ${selectedCity.lng.toFixed(2)}°E)`
                  : `Birth Date: ${janmaVivara.dateFormatted} • Time: ${janmaVivara.timeFormatted} • Place: ${janmaVivara.cityName} (${selectedCity.lat.toFixed(2)}°N, ${selectedCity.lng.toFixed(2)}°E)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/20 text-amber-200 border border-amber-400/30">
              Lagna: {janmaVivara.lagnaRashi[currentLang]} ({janmaVivara.lagnaDegree}°)
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Chandra Rashi */}
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
              {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ (Moon Sign)' : 'Chandra Rashi'}
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-bold font-serif text-white block">
                {janmaVivara.rashiName[currentLang]}
              </span>
              <span className="text-[11px] text-amber-100 font-medium">
                {currentLang === 'kn' ? `ಅಧಿಪತಿ: ${janmaVivara.rashiLord[currentLang]}` : `Lord: ${janmaVivara.rashiLord[currentLang]}`}
              </span>
            </div>
          </div>

          {/* Janma Nakshatra & Pada */}
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
              {currentLang === 'kn' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ & ಪಾದ' : 'Janma Nakshatra & Pada'}
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-bold font-serif text-white block">
                {janmaVivara.nakshatraName[currentLang]}
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-bold text-[10px]">
                {currentLang === 'kn' ? `ಪಾದ ${janmaVivara.padaNumber}` : `Pada ${janmaVivara.padaNumber}`}
              </span>
            </div>
          </div>

          {/* Nama Akshara (Prominently Highlighted with Name Starting Letter explanation) */}
          <div className="p-3.5 rounded-xl bg-amber-950/70 border-2 border-amber-300 flex flex-col justify-between relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300">
                {currentLang === 'kn' ? 'ನಾಮಾಕ್ಷರ (Name Start Letter)' : 'Namakarana Letter'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 font-mono">
                Pada {janmaVivara.padaNumber}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-100">
                {janmaVivara.aksharaKannada || janmaVivara.akshara}
              </span>
              <span className="text-sm font-bold text-amber-200 font-mono">
                ({janmaVivara.akshara})
              </span>
            </div>
            <span className="text-[9.5px] text-amber-200/90 leading-tight block mt-0.5">
              {currentLang === 'kn' 
                ? 'ಈ ನಕ್ಷತ್ರ ಪಾದದ ಹೆಸರಿನ ಪ್ರಾರಂಭಿಕ ಅಕ್ಷರ (ನಾಮಕರಣಕ್ಕೆ)' 
                : 'Name starting letter for this Nakshatra Pada'}
            </span>
          </div>

          {/* Lagna & Sun Sign */}
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
              {currentLang === 'kn' ? 'ಲಗ್ನ & ಸೂರ್ಯ ರಾಶಿ' : 'Lagna & Sun Sign'}
            </span>
            <div className="mt-1">
              <span className="text-base sm:text-lg font-bold font-serif text-white block">
                {janmaVivara.lagnaRashi[currentLang]}
              </span>
              <span className="text-[11px] text-amber-100">
                {janmaVivara.lagnaDegree}° • {janmaVivara.sunRashi[currentLang]} (ಸೂರ್ಯ)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WHAT IS BHAVA? (MASTER EDUCATIONAL VEDIC GUIDE) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 text-white border-2 border-amber-500/50 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-serif text-lg font-bold shadow-lg shrink-0">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                {WHAT_IS_BHAVA_GUIDE.title[currentLang]}
              </h3>
              <p className="text-xs text-stone-300">
                {currentLang === 'kn' ? 'ಭಾವ ಎಂದರೇನು? ಕುಂಡಲಿಯ ೧೨ ಭಾವಗಳ ಉದ್ದೇಶ ಮತ್ತು ಅವುಗಳ ಮಹತ್ವ' : 'The cosmic philosophy and life purpose of the 12 Bhavas (houses) in Jyotisha.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatIsBhava(!showWhatIsBhava)}
            className="text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg border border-amber-500/40 bg-white/5 cursor-pointer self-start sm:self-auto"
          >
            {showWhatIsBhava ? 'Hide Guide' : 'Read Full Bhava Guide'}
          </button>
        </div>

        {showWhatIsBhava && (
          <div className="space-y-4 animate-in fade-in">
            {/* Meaning & Origin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-amber-400 text-sm block font-serif">
                  ೧. ಭಾವ ಎಂದರೇನು? (Definition & Meaning)
                </span>
                <p className="text-stone-200 leading-relaxed text-[11.5px] sm:text-xs">
                  {WHAT_IS_BHAVA_GUIDE.meaning[currentLang]}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="font-bold text-amber-400 text-sm block font-serif">
                  ೨. ರಾಶಿ ಮತ್ತು ಭಾವಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ (Rashi vs Bhava)
                </span>
                <p className="text-stone-200 leading-relaxed text-[11.5px] sm:text-xs">
                  {WHAT_IS_BHAVA_GUIDE.differenceRashiBhava[currentLang]}
                </p>
              </div>
            </div>

            {/* The 4 Purusharthas (Dharma, Artha, Kama, Moksha) */}
            <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-3">
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block font-mono">
                {currentLang === 'kn' ? '೪ ಪುರುಷಾರ್ಥಗಳು: ೧೨ ಭಾವಗಳ ಆಧ್ಯಾತ್ಮಿಕ ವರ್ಗೀಕರಣ' : 'The 4 Purusharthas: Classification of 12 Bhavas'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-amber-500/20">
                  <strong className="text-amber-400 block mb-1">👑 ಧರ್ಮ (Dharma)</strong>
                  <p className="text-[11px] text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.dharma[currentLang]}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-emerald-500/20">
                  <strong className="text-emerald-400 block mb-1">💰 ಅರ್ಥ (Artha)</strong>
                  <p className="text-[11px] text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.artha[currentLang]}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-purple-500/20">
                  <strong className="text-purple-400 block mb-1">💖 ಕಾಮ (Kama)</strong>
                  <p className="text-[11px] text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.kama[currentLang]}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-blue-500/20">
                  <strong className="text-blue-400 block mb-1">🕊️ ಮೋಕ್ಷ (Moksha)</strong>
                  <p className="text-[11px] text-stone-300">{WHAT_IS_BHAVA_GUIDE.fourPurusharthas.moksha[currentLang]}</p>
                </div>
              </div>
            </div>

            {/* The 12 Bhavas and the 9 Grahas Relation */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-amber-400 text-sm block font-serif">
                ೩. ೧೨ ಭಾವಗಳು ಮತ್ತು ೯ ನವಗ್ರಹಗಳ ಸಂಬಂಧ (The 12 Bhavas & 9 Nava Grahas)
              </span>
              <p className="text-stone-200 leading-relaxed text-[11.5px] sm:text-xs">
                {currentLang === 'kn'
                  ? 'ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಮನುಷ್ಯನ ಸಮಗ್ರ ಜೀವನವನ್ನು ೧೨ ಭಾವಗಳಾಗಿ (ಮನೆಗಳು) ವಿಭಾಗಿಸಲಾಗಿದೆ. ಸೂರ್ಯ, ಚಂದ್ರ, ಮಂಗಳ, ಬುಧ, ಗುರು, ಶುಕ್ರ, ಶನಿ, ರಾಹು ಮತ್ತು ಕೇತು ಎಂಬ ೯ ನವಗ್ರಹಗಳು ಈ ೧೨ ಭಾವಗಳಲ್ಲಿ ಸಂಚರಿಸುತ್ತಾ, ತಮ್ಮ ಕಾರಕತ್ವ ಮತ್ತು ಸ್ಥಾನ ಬಲಕ್ಕೆ ತಕ್ಕಂತೆ ಫಲಗಳನ್ನು ನೀಡುತ್ತವೆ. ಪ್ರತಿಯೊಂದು ಭಾವಕ್ಕೂ ನಿರ್ದಿಷ್ಟ ಕಾರಕ ಗ್ರಹ ಮತ್ತು ಉದ್ದೇಶವಿರುತ್ತದೆ.'
                  : 'In Vedic Astrology, human life is structured into 12 Bhavas (houses). The 9 Nava Grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) occupy and aspect these 12 Bhavas, delivering karmic fruit according to their natural attributes, lordships, and house positions.'}
              </p>
            </div>

            {/* Quick 12-Bhava Purpose Grid */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block font-mono">
                {currentLang === 'kn' ? 'ಪ್ರತಿಯೊಂದು ಭಾವದಲ್ಲಿ ಏನು ನೋಡಬೇಕು? (Each Bhava - What Purpose to See):' : 'Each Bhava - What Purpose to See:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {BHAVA_LIST.map((b) => (
                  <div
                    key={b.bhava}
                    onClick={() => {
                      setSelectedBhava(b.bhava);
                      if (activeChartTab === 'chandra') setActiveChartTab('lagna');
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedBhava === b.bhava
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-[10px] text-amber-400 mb-0.5">
                      <span>House {b.bhava}</span>
                      <span className="text-[9px] text-stone-400">{b.sanskritName.split(' ')[0]}</span>
                    </div>
                    <strong className="block text-stone-100 text-[11px] truncate">{b.name[currentLang]}</strong>
                    <p className="text-[10px] text-stone-300 line-clamp-2 mt-0.5 leading-snug">
                      {b.purposeToInspect[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. DRAWN CHARTS: LAGNA KUNDALI & CHANDRA KUNDALI SELECTOR */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/90 dark:bg-stone-900 border border-amber-300 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              {currentLang === 'kn' ? 'ಕುಂಡಲಿ ನಕ್ಷೆ ವೀಕ್ಷಣೆ (Chart Selection)' : 'Kundali Chart Selection'}
            </h4>
            <span className="text-[11px] text-stone-600 dark:text-stone-400">
              {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಅಥವಾ ಚಂದ್ರ ಕುಂಡಲಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪರಿಶೀಲಿಸಿ' : 'Switch between Lagna Chart and Chandra (Moon) Chart'}
            </span>
          </div>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold shadow-xs">
          <button
            type="button"
            onClick={() => setActiveChartTab('lagna')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'lagna'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ (Lagna)' : 'Lagna Chart'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChartTab('chandra')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'chandra'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕುಂಡಲಿ (Chandra)' : 'Chandra Chart'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChartTab('both')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === 'both'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ಎರಡೂ (Both)' : 'Both Charts'}</span>
          </button>
        </div>
      </div>

      {/* CHANDRA KUNDALI (If Chandra or Both selected) */}
      {(activeChartTab === 'chandra' || activeChartTab === 'both') && (
        <div className="animate-in fade-in">
          <ChandraKundaliChart
            kundaliData={kundaliData}
            currentLang={currentLang}
          />
        </div>
      )}

      {/* LAGNA KUNDALI & INTERACTIVE BHAVA EXPLORER (If Lagna or Both selected) */}
      {(activeChartTab === 'lagna' || activeChartTab === 'both') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start page-break-inside-avoid">
        
        {/* Left (7 Cols): Drawn Birth Chart (North & South Style) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-amber-300/80 dark:border-stone-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  {chartStyle === 'north' ? 'ಲಗ್ನ ಕುಂಡಲಿ (North Indian Diamond Chart)' : 'ಲಗ್ನ ಕುಂಡಲಿ (South Indian Square Chart)'}
                </h3>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {currentLang === 'kn' ? 'ಯಾವುದೇ ಭಾವವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಆ ಭಾವದ ಫಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ' : 'Click any house in the chart to inspect its Bhava details'}
                </span>
              </div>
            </div>

            {/* Style Switcher */}
            <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold shrink-0">
              <button
                onClick={() => setChartStyle('north')}
                className={`px-3 py-1 rounded-md transition-all ${
                  chartStyle === 'north' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                North Style
              </button>
              <button
                onClick={() => setChartStyle('south')}
                className={`px-3 py-1 rounded-md transition-all ${
                  chartStyle === 'south' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                South Style
              </button>
            </div>
          </div>

          {/* North Indian Diamond Chart */}
          {chartStyle === 'north' ? (
            <div className="relative w-full aspect-square max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] mx-auto bg-amber-50/70 rounded-2xl p-2 border-2 border-amber-500 shadow-xl overflow-hidden select-none">
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                <rect x="0" y="0" width="500" height="500" fill="#fefce8" stroke="#b45309" strokeWidth="3" />
                <line x1="0" y1="0" x2="500" y2="500" stroke="#d97706" strokeWidth="2" />
                <line x1="500" y1="0" x2="0" y2="500" stroke="#d97706" strokeWidth="2" />
                <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#b45309" strokeWidth="2.5" />
              </svg>

              <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* House 1: Lagna */}
                <div 
                  onClick={() => setSelectedBhava(1)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 1 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '50%', top: '25%', maxWidth: '140px' }}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9.5px] font-black uppercase text-red-700 bg-red-100/90 px-1 py-0.2 rounded shadow-2xs">LAGNA</span>
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none">
                      {getHouseRashiNum(1)}
                    </span>
                  </div>
                  <div className="max-w-[135px]">{renderHousePlanets(1, 'diamond')}</div>
                </div>

                {/* House 2 */}
                <div 
                  onClick={() => setSelectedBhava(2)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 2 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '25%', top: '14%', maxWidth: '90px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(2)}</span>
                  <div className="max-w-[85px]">{renderHousePlanets(2, 'horizontal')}</div>
                </div>

                {/* House 3 */}
                <div 
                  onClick={() => setSelectedBhava(3)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 3 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '12%', top: '25%', maxWidth: '65px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(3)}</span>
                  <div className="max-w-[60px]">{renderHousePlanets(3, 'vertical')}</div>
                </div>

                {/* House 4 */}
                <div 
                  onClick={() => setSelectedBhava(4)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 4 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '25%', top: '50%', maxWidth: '140px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(4)}</span>
                  <div className="max-w-[130px]">{renderHousePlanets(4, 'diamond')}</div>
                </div>

                {/* House 5 */}
                <div 
                  onClick={() => setSelectedBhava(5)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 5 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '12%', top: '75%', maxWidth: '65px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(5)}</span>
                  <div className="max-w-[60px]">{renderHousePlanets(5, 'vertical')}</div>
                </div>

                {/* House 6 */}
                <div 
                  onClick={() => setSelectedBhava(6)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 6 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '25%', top: '86%', maxWidth: '90px' }}
                >
                  <div className="max-w-[85px] mb-0.5">{renderHousePlanets(6, 'horizontal')}</div>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs">{getHouseRashiNum(6)}</span>
                </div>

                {/* House 7 */}
                <div 
                  onClick={() => setSelectedBhava(7)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 7 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '50%', top: '75%', maxWidth: '140px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(7)}</span>
                  <div className="max-w-[135px]">{renderHousePlanets(7, 'diamond')}</div>
                </div>

                {/* House 8 */}
                <div 
                  onClick={() => setSelectedBhava(8)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 8 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '75%', top: '86%', maxWidth: '90px' }}
                >
                  <div className="max-w-[85px] mb-0.5">{renderHousePlanets(8, 'horizontal')}</div>
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs">{getHouseRashiNum(8)}</span>
                </div>

                {/* House 9 */}
                <div 
                  onClick={() => setSelectedBhava(9)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 9 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '88%', top: '75%', maxWidth: '65px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(9)}</span>
                  <div className="max-w-[60px]">{renderHousePlanets(9, 'vertical')}</div>
                </div>

                {/* House 10 */}
                <div 
                  onClick={() => setSelectedBhava(10)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 10 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '75%', top: '50%', maxWidth: '140px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(10)}</span>
                  <div className="max-w-[130px]">{renderHousePlanets(10, 'diamond')}</div>
                </div>

                {/* House 11 */}
                <div 
                  onClick={() => setSelectedBhava(11)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 11 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '88%', top: '25%', maxWidth: '65px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(11)}</span>
                  <div className="max-w-[60px]">{renderHousePlanets(11, 'vertical')}</div>
                </div>

                {/* House 12 */}
                <div 
                  onClick={() => setSelectedBhava(12)}
                  className={`absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2 p-1 rounded-xl transition-all cursor-pointer ${
                    selectedBhava === 12 ? 'ring-2 ring-amber-600 bg-amber-200/50 scale-105' : 'hover:bg-amber-100/40'
                  }`}
                  style={{ left: '75%', top: '14%', maxWidth: '90px' }}
                >
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-1 rounded-xs mb-0.5">{getHouseRashiNum(12)}</span>
                  <div className="max-w-[85px]">{renderHousePlanets(12, 'horizontal')}</div>
                </div>
              </div>
            </div>
          ) : (
            /* South Indian Square Chart */
            <div className="relative w-full aspect-square max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] mx-auto bg-amber-50 rounded-2xl p-2 border-2 border-amber-600 shadow-xl select-none">
              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 p-1 bg-amber-100/60 border border-amber-300 rounded-xl">
                {/* 12 Signs layout for South Indian style */}
                {[
                  { rashiIdx: 11, label: 'Meena (12)' },
                  { rashiIdx: 0, label: 'Mesha (1)' },
                  { rashiIdx: 1, label: 'Vrishabha (2)' },
                  { rashiIdx: 2, label: 'Mithuna (3)' },
                  { rashiIdx: 10, label: 'Kumbha (11)' },
                  null, // Center 1
                  null, // Center 2
                  { rashiIdx: 3, label: 'Karka (4)' },
                  { rashiIdx: 9, label: 'Makara (10)' },
                  null, // Center 3
                  null, // Center 4
                  { rashiIdx: 4, label: 'Simha (5)' },
                  { rashiIdx: 8, label: 'Dhanu (9)' },
                  { rashiIdx: 7, label: 'Vrishchika (8)' },
                  { rashiIdx: 6, label: 'Tula (7)' },
                  { rashiIdx: 5, label: 'Kanya (6)' }
                ].map((slot, idx) => {
                  if (!slot) {
                    if (idx === 5) {
                      return (
                        <div key={idx} className="col-span-2 row-span-2 p-2 rounded-xl bg-amber-50/80 border border-amber-400 flex flex-col items-center justify-center text-center shadow-inner">
                          <span className="text-base font-serif font-bold text-amber-950">Lagna Kundali</span>
                          <span className="text-xs text-amber-900 font-bold mt-1 bg-amber-200/70 px-2 py-0.5 rounded-md">
                            Lagna: {kundaliData.houses[0].rashiName[currentLang]}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }

                  const house = kundaliData.houses.find(h => h.rashiIndex === slot.rashiIdx);
                  const isSelected = house && selectedBhava === house.bhava;

                  return (
                    <div 
                      key={idx} 
                      onClick={() => house && setSelectedBhava(house.bhava)}
                      className={`p-1.5 border rounded-lg bg-white flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-amber-600 ring-2 ring-amber-500 bg-amber-100/60 scale-105 z-10' 
                          : 'border-amber-300 hover:border-amber-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-amber-900 truncate">{slot.label}</span>
                        {house?.bhava === 1 && (
                          <span className="text-[8px] font-black text-red-600 bg-red-100 px-1 rounded">LAGNA</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-0.5 mt-0.5">
                        {house && renderHousePlanets(house.bhava)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right (5 Cols): Selected Bhava Deep Purpose & Graha Impact Card */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border-2 border-amber-400/80 dark:border-stone-800 shadow-xl space-y-4">
          
          {/* Quick House Selector Buttons (1 to 12) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1 font-mono">
                <Compass className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಭಾವ ಆಯ್ಕೆಮಾಡಿ (Select Bhava 1-12):' : 'Inspect Bhava (1-12):'}</span>
              </span>
              <span className="text-[11px] font-mono text-stone-500 font-bold">
                House {selectedBhava} of 12
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bNum) => (
                <button
                  key={bNum}
                  onClick={() => setSelectedBhava(bNum)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBhava === bNum
                      ? 'bg-amber-600 text-white shadow-xs scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'
                  }`}
                >
                  H{bNum}
                </button>
              ))}
            </div>
          </div>

          {/* Active Bhava Header */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-amber-700/15 border border-amber-400/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                BHAVA {bhavaMeta.bhava}
              </span>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                {bhavaMeta.category[currentLang]}
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              {bhavaMeta.name[currentLang]}
            </h4>
            <div className="text-xs text-stone-600 dark:text-stone-400 pt-1 flex items-center justify-between border-t border-amber-200/60 dark:border-stone-800">
              <span>Sign in Chart: <strong>{houseData?.rashiName[currentLang]}</strong></span>
              <span>Karaka: <strong>{bhavaMeta.karakas[currentLang]}</strong></span>
            </div>
          </div>

          {/* What Purpose to See in this Bhava */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
            <strong className="text-amber-800 dark:text-amber-300 flex items-center gap-1 font-serif text-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಈ ಭಾವದಲ್ಲಿ ಏನು ನೋಡಬೇಕು? (Purpose to Inspect):' : 'What Purpose to Inspect in this Bhava:'}</span>
            </strong>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11.5px]">
              {bhavaMeta.purposeToInspect[currentLang]}
            </p>
            <div className="text-[11px] text-stone-500 pt-1 border-t border-black/5 dark:border-white/5">
              <span>Body Parts: <strong>{bhavaMeta.bodyParts[currentLang]}</strong></span>
            </div>
          </div>

          {/* Occupying Grahas in this Bhava */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 block">
              {currentLang === 'kn' ? `ಭಾವ ${selectedBhava} ರಲ್ಲಿ ನೆಲೆಸಿದ ಗ್ರಹಗಳು & ಅವುಗಳ ಪ್ರಭಾವ:` : `Planets in House ${selectedBhava} & Their Effects:`}
            </span>

            {planetsInSelectedHouse.length === 0 ? (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-500 text-center space-y-1">
                <p className="font-semibold text-stone-700 dark:text-stone-300">
                  {currentLang === 'kn' ? 'ಈ ಭಾವದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹಗಳು ನೆಲೆಸಿಲ್ಲ (Empty House).' : 'No planets directly occupy this house.'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {currentLang === 'kn' 
                    ? `ಈ ಭಾವದ ಫಲಗಳು ರಾಶ್ಯಾಧಿಪತಿಯಾದ ${houseData?.rashiName[currentLang]} ಅಧಿಪತಿಯ ಸ್ಥಿತಿ ಮತ್ತು ದೃಷ್ಟಿಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರುತ್ತವೆ.` 
                    : `Results are governed by the house lord of ${houseData?.rashiName.en} and aspects received from other Grahas.`}
                </p>
              </div>
            ) : (
              planetsInSelectedHouse.map((p) => {
                const effect = getGrahaBhavaEffect(p.name, selectedBhava);
                return (
                  <div 
                    key={p.name}
                    className="p-3.5 rounded-xl border border-amber-300/80 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/80 space-y-2 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-stone-700 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || '#d97706' }} />
                        <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {p.sanskritName[currentLang]} ({p.name})
                        </span>
                        {p.isRetrograde && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1 rounded">R (ವಕ್ರಿ)</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        effect.nature === 'Auspicious' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : effect.nature === 'Remedy Needed'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {effect.nature}
                      </span>
                    </div>

                    <h5 className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                      {effect.title[currentLang]}
                    </h5>

                    <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
                      {effect.description[currentLang]}
                    </p>

                    <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 text-[10.5px]">
                      <strong className="text-amber-800 dark:text-amber-400 block mb-0.5">
                        {currentLang === 'kn' ? 'ಶಾಂತಿ ಪರಿಹಾರ:' : 'Prescribed Remedy:'}
                      </strong>
                      <span className="text-stone-600 dark:text-stone-300">
                        {effect.remedy[currentLang]}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
      )}

      {/* ========================================================================= */}
      {/* 3.2 VIMSHOTTARI DASHA HORIZONTAL TIMELINE & REMEDIAL CROSS-REFERENCE */}
      {/* ========================================================================= */}
      {vimshottariDasha && (
        <div className="space-y-5">
          {/* Visual Horizontal Timeline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-400/80 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Activity className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಕಾಲರೇಖೆ (Horizontal Timeline)' : 'Vimshottari Dasha Lifetime Horizontal Timeline'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800">
                      120 Years
                    </span>
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn'
                      ? 'ನಿಮ್ಮ ಜೀವಮಾನದ ೯ ಮಹಾದಶಾ ಕಾಲಾವಧಿಯ ಸಂಪೂರ್ಣ ಅನುಕ್ರಮ. ಎಲ್ಲಾ ದಶೆಗಳು ನೇರವಾಗಿ ವೀಕ್ಷಣೆಗೆ ಲಭ್ಯ. ಯಾವುದೇ ದಶೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಅದರ ಅಂತರ್ದಶೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.'
                      : 'Complete sequence of all 9 Mahadashas visible simultaneously with zero side-scrolling. Click any Mahadasha card to inspect its Antardasha sub-periods.'}
                  </p>
                </div>
              </div>

              {/* Active Dasha Quick Badge */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold bg-amber-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-stone-700 text-amber-900 dark:text-amber-200 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>
                  Active: {vimshottariDasha.currentMahadasha.lord.sanskrit[currentLang]} MD ({vimshottariDasha.currentAntardasha.lord.sanskrit[currentLang]} AD)
                </span>
              </div>
            </div>

            {/* 100% Visible Grid Container - Zero Side Scrolling */}
            <div className="relative">
              <div 
                id="vedic-dasha-grid-view"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-1 px-1"
              >
                {vimshottariDasha.mahadashas.map((md, idx) => {
                  const nowTime = new Date().getTime();
                  const isPast = md.endDate.getTime() < nowTime;
                  const isCurrent = md.isCurrent;
                  const isSelected = selectedTimelineMahadasha === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedTimelineMahadasha(isSelected ? null : idx)}
                      className={`w-full p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isCurrent
                          ? 'bg-gradient-to-br from-amber-50 via-purple-50 to-indigo-50 dark:from-stone-800 dark:via-purple-950/40 dark:to-stone-850 border-purple-500 shadow-lg ring-2 ring-purple-400/30'
                          : isSelected
                          ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 shadow-md'
                          : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {/* Top: Planet Indicator & Status */}
                      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                            style={{ backgroundColor: md.lord.color || '#9333ea' }} 
                          />
                          <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                            {md.lord.sanskrit[currentLang]}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-stone-500">
                          {md.durationYears}y
                        </span>
                      </div>

                      {/* Middle: Start & End Dates */}
                      <div className="space-y-1 text-[11px] font-mono">
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                          <span>Start:</span>
                          <strong>{md.startDate.toISOString().split('T')[0]}</strong>
                        </div>
                        <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                          <span>End:</span>
                          <strong>{md.endDate.toISOString().split('T')[0]}</strong>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="pt-1">
                        {isCurrent ? (
                          <div className="py-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold text-center flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
                            <span>Currently Active</span>
                          </div>
                        ) : isPast ? (
                          <div className="py-1 px-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px] font-bold text-center">
                            Completed
                          </div>
                        ) : (
                          <div className="py-1 px-2 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold text-center">
                            Upcoming Phase
                          </div>
                        )}
                      </div>

                      <div className="text-[9.5px] text-stone-400 text-center font-medium">
                        {isSelected ? '▲ Click to collapse sub-periods' : '▼ Click to view 9 Antardashas'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expanded Antardashas Drawer for Clicked Mahadasha */}
            {selectedTimelineMahadasha !== null && vimshottariDasha.mahadashas[selectedTimelineMahadasha] && (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-purple-300 dark:border-purple-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>
                      {vimshottariDasha.mahadashas[selectedTimelineMahadasha].lord.sanskrit[currentLang]} ಮಹಾದಶಾ • ೯ ಅಂತರ್ದಶಾ ಅವಧಿಗಳು (Sub-periods)
                    </span>
                  </span>
                  <button 
                    onClick={() => setSelectedTimelineMahadasha(null)}
                    className="text-stone-400 hover:text-stone-600 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-xs">
                  {vimshottariDasha.mahadashas[selectedTimelineMahadasha].antardashas.map((ad, adIdx) => (
                    <div 
                      key={adIdx}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                        ad.isCurrent
                          ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-400 text-purple-900 dark:text-purple-200 font-bold shadow-xs'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ad.lord.color || '#9333ea' }} />
                        <span className="font-semibold truncate">{ad.lord.sanskrit[currentLang]}</span>
                      </div>
                      <div className="text-[10px] font-mono text-stone-500">
                        <div>{ad.startDate.toISOString().split('T')[0]}</div>
                        <div>{ad.endDate.toISOString().split('T')[0]}</div>
                      </div>
                      {ad.isCurrent && (
                        <span className="mt-1 text-[8.5px] uppercase font-bold text-emerald-600">● Active Now</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dasha-Cross-Referenced Personalized Remedial Recommendations Based on Planetary Strength */}
          {(() => {
            const activeMahaLord = vimshottariDasha.currentMahadasha.lord;
            const activeAntarLord = vimshottariDasha.currentAntardasha.lord;
            const mahaName = activeMahaLord.name;
            const antarName = activeAntarLord.name;

            // Find matching mantras from remediesData library
            const mahaMantra = remediesData.mantras.find(m => m.planet.toLowerCase().includes(mahaName.toLowerCase()));
            const antarMantra = remediesData.mantras.find(m => m.planet.toLowerCase().includes(antarName.toLowerCase()));

            // Find matching gemstone & charity
            const mahaGem = remediesData.gemstones.find(g => g.name.en.toLowerCase().includes(mahaName.toLowerCase()) || g.sanskritName.toLowerCase().includes(mahaName.toLowerCase()));
            const mahaCharity = remediesData.charities.find(c => c.planet.toLowerCase().includes(mahaName.toLowerCase()));

            // Planetary strength score (Bala)
            const mahaBala = planetaryBalas?.find(b => b.planet.name.toLowerCase() === mahaName.toLowerCase());
            const score = mahaBala ? mahaBala.totalScore : 65;
            const isAfflictedOrWeak = score < 50;
            const isStrong = score >= 65;

            return (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-950 via-indigo-950 to-stone-900 text-white shadow-2xl border-2 border-purple-400/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-lg shrink-0">
                      <ShieldCheck className="w-6 h-6 text-stone-950" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300">
                        {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ದಶಾ ನಾಯಕರಿಗೆ ಶಾಸ್ತ್ರೋಕ್ತ ವೈದಿಕ ಪರಿಹಾರಗಳು' : 'Vedic Remedies Cross-Referenced for Current Dasha Lords'}
                      </h3>
                      <p className="text-xs text-purple-200">
                        {currentLang === 'kn'
                          ? `ಸಕ್ರಿಯ ಮಹಾದಶಾ ನಾಯಕ: ${activeMahaLord.sanskrit[currentLang]} • ಅಂತರ್ದಶಾ ನಾಯಕ: ${activeAntarLord.sanskrit[currentLang]} • ಗ್ರಹ ಬಲ: ${score}/100`
                          : `Active Mahadasha: ${activeMahaLord.name} • Antardasha: ${activeAntarLord.name} • Planetary Strength (Bala): ${score}/100`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                      isStrong 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : isAfflictedOrWeak 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isStrong ? 'Lord is Strong (ಬಲಿಷ್ಠ ಗ್ರಹ)' : isAfflictedOrWeak ? 'Lord Needs Shanti (ಶಾಂತಿ ಅಗತ್ಯ)' : 'Moderate Strength (ಮಧ್ಯಮ ಬಲ)'}
                    </span>
                  </div>
                </div>

                {/* Remedial Recommendations Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Card 1: Beeja & Gayatri Mantra Japa */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>{currentLang === 'kn' ? '೧. ದಶಾ ನಾಯಕ ಮಂತ್ರ ಸಾಧನೆ' : '1. Dasha Lord Mantra Sadhana'}</span>
                        </span>
                        <span className="font-mono text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-black">
                          {mahaMantra ? `${mahaMantra.recommendedCount.toLocaleString()} Japa` : '108 Daily'}
                        </span>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {mahaMantra ? mahaMantra.gayatriMantra : activeMahaLord.mantra[currentLang]}
                      </p>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-purple-400/40 font-mono text-xs text-amber-200 mt-2 font-bold text-center">
                        {mahaMantra ? mahaMantra.beejMantra : activeMahaLord.mantra[currentLang]}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10.5px] text-purple-200 flex items-center justify-between">
                      <span>Mala: {mahaMantra?.rosaryType[currentLang] || 'Rudraksha Mala'}</span>
                      <span>Day: {mahaMantra?.bestDay[currentLang] || 'Daily at Sunrise'}</span>
                    </div>
                  </div>

                  {/* Card 2: Prescribed Gemstone & Kavacha */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Gem className="w-4 h-4 text-emerald-400" />
                          <span>{currentLang === 'kn' ? '೨. ರತ್ನ & ಕವಚ ಧಾರಣೆ' : '2. Auspicious Gemstone'}</span>
                        </span>
                        <span className="font-mono text-[10px] bg-emerald-400 text-stone-950 px-2 py-0.5 rounded font-bold">
                          {mahaGem ? mahaGem.weightRatti : 'Consult'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-white">
                        {mahaGem ? `${mahaGem.name[currentLang]} (${mahaGem.sanskritName})` : activeMahaLord.gemstone[currentLang]}
                      </h4>
                      <p className="text-stone-300 text-[11px] leading-relaxed mt-1">
                        {mahaGem ? mahaGem.benefit[currentLang] : `Amplify the auspicious radiation of ${activeMahaLord.sanskrit[currentLang]} during its 120-year phase.`}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10.5px] text-purple-200 flex items-center justify-between">
                      <span>Metal: {mahaGem?.metal[currentLang] || 'Gold / Silver'}</span>
                      <span>Finger: {mahaGem?.finger[currentLang] || 'Ring Finger'}</span>
                    </div>
                  </div>

                  {/* Card 3: Planetary Charity & Karmic Harmony (Dāna) */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-purple-400/30 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span>{currentLang === 'kn' ? '೩. ಕರ್ಮ ಶಾಂತಿ ದಾನ (Dāna)' : '3. Karmic Charity (Dāna)'}</span>
                        </span>
                        <span className="font-mono text-[10px] bg-rose-400 text-stone-950 px-2 py-0.5 rounded font-bold">
                          {mahaCharity ? mahaCharity.day[currentLang] : 'Auspicious Days'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-white">
                        {currentLang === 'kn' ? 'ದೋಷ ಶಾಂತಿ ಹಾಗೂ ಪುಣ್ಯ ಪ್ರಾಪ್ತಿ' : 'Harmonize Planetary Vibration'}
                      </h4>
                      <p className="text-stone-300 text-[11px] leading-relaxed mt-1">
                        {mahaCharity 
                          ? `Offer: ${mahaCharity.items[currentLang]} to ${mahaCharity.recipient[currentLang]}.` 
                          : `Engage in charitable donations and feed sacred animals on the day ruled by ${activeMahaLord.sanskrit[currentLang]}.`}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10.5px] text-amber-200">
                      <span>Significance: {mahaCharity?.significance[currentLang] || 'Dissolves negative past karmic impressions'}</span>
                    </div>
                  </div>

                </div>

                {/* Tailored Strength Guidance */}
                <div className="p-3 rounded-xl bg-black/30 border border-purple-400/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-stone-200 text-[11.5px]">
                      {isAfflictedOrWeak
                        ? (currentLang === 'kn'
                          ? `⚠️ ಗಮನಿಸಿ: ${activeMahaLord.sanskrit[currentLang]} ಗ್ರಹದ ಬಲವು ${score}/100 ಇದ್ದು, ಈ ಅವಧಿಯಲ್ಲಿ ಸಂಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸಲು ನಿತ್ಯ ಮಂತ್ರ ಜಪ ಮತ್ತು ಶನಿವಾರ/ಮಂಗಳವಾರ ದಾನ ಅತ್ಯಂತ ಆವಶ್ಯಕ.`
                          : `⚠️ Notice: Lord ${activeMahaLord.name} holds strength ${score}/100. Prioritize daily Beeja Mantra recitation and charitable offerings to soften challenging periods.`)
                        : (currentLang === 'kn'
                          ? `✨ ಶುಭ ಸೂಚನೆ: ${activeMahaLord.sanskrit[currentLang]} ಗ್ರಹದ ಬಲವು ${score}/100 ಇದ್ದು ಅತ್ಯಂತ ಪ್ರಬಲವಾಗಿದೆ. ಈ ಅವಧಿಯಲ್ಲಿ ರತ್ನ ಧಾರಣೆ ಮತ್ತು ಇಷ್ಟದೇವತಾ ಪ್ರಾರ್ಥನೆಯಿಂದ ಗರಿಷ್ಠ ಯಶಸ್ಸು ಲಭಿಸುತ್ತದೆ.`
                          : `✨ Auspicious: Lord ${activeMahaLord.name} holds strong planetary score ${score}/100. Harness this favorable window with gemstone empowerment and purposeful ventures.`)}
                    </span>
                  </div>
                  <span className="font-mono text-[10.5px] text-amber-300 font-bold shrink-0">
                    Bala Score: {score}/100
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. NATAL PROFILE SUMMARY GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
            Lagna Lord (ಲಗ್ನಾಧಿಪತಿ)
          </span>
          <p className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
            {remediesData.lagnaLord[currentLang]}
          </p>
          <span className="text-[10px] text-stone-500">
            House {remediesData.lagnaLordHouse} ({remediesData.lagnaLordDignity[currentLang]})
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
            Chandra Rashi (ರಾಶಿ / ನಕ್ಷತ್ರ)
          </span>
          <p className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
            {remediesData.moonRashi[currentLang]}
          </p>
          <span className="text-[10px] text-stone-500">
            {remediesData.moonNakshatra[currentLang]}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
            Auspicious Colors (ಶುಭ ಬಣ್ಣಗಳು)
          </span>
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {remediesData.favorableColors[currentLang]}
          </p>
          <span className="text-[10px] text-rose-600 block mt-0.5">
            Avoid: {remediesData.unfavorableColors[currentLang]}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
            Ishta Devata (ಇಷ್ಟದೇವತಾ)
          </span>
          <p className="text-sm font-serif font-bold text-amber-900 dark:text-amber-200">
            {remediesData.primaryDeity[currentLang]}
          </p>
          <span className="text-[10px] text-stone-500">
            Direction: {remediesData.favorableDirections[currentLang]}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CLASSICAL DOSHAS ANALYSIS CARD */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-base">
            {currentLang === 'kn' ? 'ಜನ್ಮ ಕುಂಡಲಿಯ ಮುಖ್ಯ ದೋಷಗಳ ಪರಿಶೀಲನೆ' : currentLang === 'hi' ? 'कुण्डली के प्रमुख दोष विश्लेषण' : 'Natal Chart Primary Dosha Evaluation'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {remediesData.doshas.map((d, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 text-xs transition-all ${
                d.detected 
                  ? 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/20' 
                  : 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 dark:text-stone-100 font-serif text-sm">
                    {d.name[currentLang]}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    d.detected 
                      ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-400' 
                      : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {d.detected ? `${d.severity}` : 'Nirdosha (ಶುದ್ಧ)'}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-[11px]">
                  {d.description[currentLang]}
                </p>
              </div>

              {d.detected && (
                <div className="pt-2 border-t border-rose-200 dark:border-rose-900/60 text-[10.5px]">
                  <strong className="text-rose-900 dark:text-rose-300 block mb-0.5">
                    {currentLang === 'kn' ? 'ಸೂಚಿತ ಪರಿಹಾರ:' : 'Prescribed Remedy:'}
                  </strong>
                  <span className="text-stone-700 dark:text-stone-300">
                    {d.remedyAction[currentLang]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. GEMSTONES & RUDRAKSHA CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Gemstones */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2">
            <Gem className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-base">
              {currentLang === 'kn' ? 'ಜೀವ ರತ್ನ ಶಿಫಾರಸು (Prescribed Gemstones)' : currentLang === 'hi' ? 'रत्न धारण परामर्श' : 'Prescribed Vedic Gemstones'}
            </h3>
          </div>

          <div className="space-y-3">
            {remediesData.gemstones.map((gem, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-amber-200 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {gem.name[currentLang]} ({gem.sanskritName})
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    {gem.weightRatti}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  {gem.benefit[currentLang]}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10.5px] text-stone-500 pt-1.5 border-t border-black/5 dark:border-white/5">
                  <span>Metal: <strong>{gem.metal[currentLang]}</strong></span>
                  <span>Finger: <strong>{gem.finger[currentLang]}</strong></span>
                  <span>Day: <strong>{gem.day[currentLang]}</strong></span>
                  <span className="col-span-2 text-rose-600">Caution: {gem.caution[currentLang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rudraksha */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-base">
              {currentLang === 'kn' ? 'ಪವಿತ್ರ ರುದ್ರಾಕ್ಷಿ ಕವಚ (Rudraksha Blessings)' : currentLang === 'hi' ? 'पवित्र रुद्राक्ष विधान' : 'Sacred Rudraksha Prescription'}
            </h3>
          </div>

          <div className="space-y-3">
            {remediesData.rudraksha.map((rud, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {rud.name[currentLang]}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    Deity: {rud.rulingDeity[currentLang]}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  {rud.benefits[currentLang]}
                </p>
                <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>Mantra: <strong>{rud.mantra}</strong></span>
                  <span className="text-[10px] text-stone-500 font-sans">108 Chants</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. PLANETARY BEEJA & GAYATRI MANTRAS */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-base">
            {currentLang === 'kn' ? 'ಗ್ರಹ ಶಾಂತಿ ಬೀಜ & ಗಾಯತ್ರೀ ಮಂತ್ರಗಳು (Vedic Mantras)' : currentLang === 'hi' ? 'ग्रह शान्ति मन्त्र साधना' : 'Vedic Beeja & Gayatri Mantras'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {remediesData.mantras.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                  {m.planet} ({m.deity[currentLang]})
                </span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300">
                  {m.recommendedCount.toLocaleString()} Japa
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono text-[11px] text-amber-900 dark:text-amber-200 font-bold">
                {m.beejMantra}
              </div>
              <p className="text-[10.5px] text-stone-500">
                {m.gayatriMantra}
              </p>
              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-black/5 dark:border-white/5">
                <span>Mala: {m.rosaryType[currentLang]}</span>
                <span>Day: {m.bestDay[currentLang]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. CLASSICAL DANA (CHARITY OFFERINGS) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-800 pb-2">
          <Heart className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-base">
            {currentLang === 'kn' ? 'ಗ್ರಹ ಶಾಂತಿ ದಾನ ಪರಿಹಾರಗಳು (Dāna Upayas)' : currentLang === 'hi' ? 'ग्रह शान्ति दान उपाय' : 'Planetary Charity & Offerings (Dāna)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {remediesData.charities.map((ch, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                  {ch.planet} Shanti Dāna
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  {ch.day[currentLang]} • {ch.time[currentLang]}
                </span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-medium">
                <strong>Items to Offer:</strong> {ch.items[currentLang]}
              </p>
              <p className="text-[11px] text-stone-500">
                Recipient: {ch.recipient[currentLang]}
              </p>
              <p className="text-[11px] text-stone-500 italic">
                {ch.significance[currentLang]}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
