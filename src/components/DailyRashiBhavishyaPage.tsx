import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Printer, 
  Download, 
  Compass, 
  TrendingUp, 
  Heart, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ChevronRight, 
  Check, 
  Share2,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { CityLocation, Language, LocalizedString } from '../types';
import { CITIES } from '../utils/panchanga';
import { 
  calculateDailyRashiBhavishya, 
  DayRashiBhavishyaReport, 
  SingleRashiDailyForecast 
} from '../utils/rashiBhavishyaData';

interface DailyRashiBhavishyaPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onBackToCalendar: () => void;
  onNavigateToKundali?: () => void;
}

export const DailyRashiBhavishyaPage: React.FC<DailyRashiBhavishyaPageProps> = ({
  currentLang,
  selectedCity,
  onSelectCity,
  onBackToCalendar,
  onNavigateToKundali
}) => {
  const now = new Date();
  const defaultDateStr = now.toISOString().split('T')[0];

  const [selectedDateStr, setSelectedDateStr] = useState<string>(defaultDateStr);
  const [selectedRashiIndex, setSelectedRashiIndex] = useState<number>(0); // Default Mesha
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [showSkyChart, setShowSkyChart] = useState<boolean>(false);

  // Compute daily bhavishya report for selected date & city
  const report: DayRashiBhavishyaReport = useMemo(() => {
    const parts = selectedDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
    return calculateDailyRashiBhavishya(isNaN(d.getTime()) ? new Date() : d, selectedCity);
  }, [selectedDateStr, selectedCity]);

  const activeRashiData = report.predictions[selectedRashiIndex] || report.predictions[0];

  const handlePrint = () => {
    window.print();
  };

  const handleSetToday = () => {
    setSelectedDateStr(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      
      {/* Top Banner (Hidden in Print) */}
      <div className="no-print rounded-3xl bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 text-white p-5 sm:p-7 shadow-2xl border border-amber-500/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-mono font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>VEDIC SIDEREAL ASTROLOGY • ದೈನಂದಿನ ರಾಶಿ ಭವಿಷ್ಯ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight">
              {currentLang === 'kn' ? 'ದೈನಂದಿನ ರಾಶಿ ಭವಿಷ್ಯ & ಗ್ರಹ ಗೋಚಾರ' : currentLang === 'hi' ? 'दैनिक राशिफल एवं ग्रह गोचर' : 'Daily Rashi Bhavishya & Planetary Transits'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1.5 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? 'ಪ್ರಸ್ತುತ ದಿನಾಂಕದ ನಿಖರ ಚಂದ್ರ, ಸೂರ್ಯ ಹಾಗೂ ನವಗ್ರಹಗಳ ನೈಜ ಗೋಚಾರ ಸ್ಥಾನಗಳ ಆಧಾರದ ಮೇಲೆ ೧೨ ರಾಶಿಗಳ ಆಳವಾದ ಜೀವನ ಭವಿಷ್ಯ, ಶುಭ ಸಮಯ ಹಾಗೂ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರಗಳು.'
                : currentLang === 'hi'
                ? 'आज के चन्द्र, सूर्य एवं नवग्रहों के शुद्ध गोचर स्थिति अनुसार १२ राशियों का सर्वांगीण दैनिक भविष्य, शुभ मुहूर्त एवं वैदिक उपाय।'
                : 'Exact daily horoscopic forecasts for all 12 Rashis based on real-time sidereal Lahiri planetary transits, Moon house placements, and classical Gochar Shastra.'}
            </p>
          </div>

          {/* Date & City Picker Controls */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/25 p-3 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
            
            {/* Date Input */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl">
              <Calendar className="w-4 h-4 text-amber-300" />
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              />
            </div>

            {/* Today Button */}
            <button
              onClick={handleSetToday}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors shadow-sm cursor-pointer"
            >
              {currentLang === 'kn' ? 'ಇಂದು' : currentLang === 'hi' ? 'आज' : 'Today'}
            </button>

            {/* City Selector */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl">
              <MapPin className="w-4 h-4 text-amber-300" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const c = CITIES.find(item => item.name === e.target.value);
                  if (c) onSelectCity(c);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name} className="text-stone-900 bg-white">
                    {c.nameLocalized ? c.nameLocalized[currentLang] : c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1 text-xs font-bold rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Print Daily Bhavishya Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Back to Calendar */}
            <button
              onClick={onBackToCalendar}
              className="px-3 py-1 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>

          </div>
        </div>

        {/* Current Sky Panchanga & Cosmic Pulse Strip */}
        <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-amber-100">
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] block">
                {currentLang === 'kn' ? 'ಇಂದಿನ ತಿಥಿ:' : 'Today\'s Tithi:'}
              </span>
              <span className="font-semibold">{report.panchanga.tithiName[currentLang]} ({report.panchanga.pakshaName[currentLang]})</span>
            </div>
            <div className="hidden sm:block text-amber-400/40">•</div>
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] block">
                {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : 'Nakshatra:'}
              </span>
              <span className="font-semibold">{report.panchanga.nakshatra[currentLang]}</span>
            </div>
            <div className="hidden sm:block text-amber-400/40">•</div>
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] block">
                {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ:' : 'Moon Sign:'}
              </span>
              <span className="font-bold text-white bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                {report.moonRashiName[currentLang]}
              </span>
            </div>
            <div className="hidden sm:block text-amber-400/40">•</div>
            <div>
              <span className="text-amber-300 font-bold uppercase tracking-wider text-[10px] block">
                {currentLang === 'kn' ? 'ಸೂರ್ಯ ರಾಶಿ:' : 'Sun Sign:'}
              </span>
              <span className="font-semibold">{report.sunRashiName[currentLang]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSkyChart(!showSkyChart)}
              className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSkyChart ? 'Hide Sky Chart' : 'View Sky Kundali'}</span>
            </button>
            {onNavigateToKundali && (
              <button
                onClick={onNavigateToKundali}
                className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Full Lagna Kundali</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Real-time Sky Ephemeris Chart */}
        {showSkyChart && (
          <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-white space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-serif font-bold text-sm text-amber-300">
                {currentLang === 'kn' ? 'ಇಂದಿನ ಆಕಾಶದ ಗ್ರಹಗಳ ನಕ್ಷತ್ರ ಹಾಗೂ ಅಂಶ ಸ್ಥಿತಿ' : 'Planetary Ephemeris in the Sky Today'}
              </span>
              <span className="text-[10px] font-mono text-stone-300">Sidereal Lahiri Ayanamsha</span>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {report.kundali.planets.map((planet) => (
                <div key={planet.name} className="p-2 rounded-xl bg-white/5 border border-white/10 text-center space-y-0.5">
                  <div className="text-xs font-bold text-amber-200 flex items-center justify-center gap-1">
                    <span>{planet.sanskritName[currentLang]}</span>
                    {planet.isRetrograde && <span className="text-[9px] text-red-400 font-mono font-bold" title="Retrograde (ವಕ್ರ)">[R]</span>}
                  </div>
                  <div className="text-[11px] font-bold text-white">{planet.rashiName[currentLang]}</div>
                  <div className="text-[10px] font-mono text-stone-300">{planet.degrees}°</div>
                  <div className="text-[9px] text-amber-300/80 truncate">{planet.nakshatra[currentLang]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 12 Rashi Interactive Selector Carousel & View Switcher */}
      <div className="no-print space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentLang === 'kn' ? 'ನಿಮ್ಮ ರಾಶಿ ಆಯ್ಕೆಮಾಡಿ (Select Your Rashi):' : currentLang === 'hi' ? 'अपनी राशि चुनें:' : 'Select Your Moon Sign / Rashi:'}</span>
          </span>

          <div className="inline-flex rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-850 p-0.5 text-xs font-bold">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {currentLang === 'kn' ? 'ಆಯ್ದ ರಾಶಿ ವಿವರ' : 'Single Rashi'}
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {currentLang === 'kn' ? 'ಎಲ್ಲಾ ೧೨ ರಾಶಿಗಳು' : 'All 12 Rashis'}
            </button>
          </div>
        </div>

        {/* 12 Rashis Horizontal Strip */}
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          {report.predictions.map((p) => {
            const isSelected = p.rashiIndex === selectedRashiIndex;
            const isMoonSign = p.rashiIndex === report.moonRashiIndex;

            return (
              <button
                key={p.rashiIndex}
                onClick={() => {
                  setSelectedRashiIndex(p.rashiIndex);
                  setViewMode('single');
                }}
                className={`p-2 rounded-2xl text-center transition-all cursor-pointer border relative overflow-hidden flex flex-col items-center justify-between min-h-[74px] sm:min-h-[82px] ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-500 ring-2 ring-amber-400 shadow-md dark:bg-stone-800'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                {/* Chandrashtama Alert Dot */}
                {p.specialAstrologicalAlert?.type === 'chandrashtama' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Chandrashtama Today" />
                )}

                {/* Moon Sign Badge */}
                {isMoonSign && (
                  <span className="text-[8px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1 rounded-sm uppercase tracking-tighter">
                    Chandra
                  </span>
                )}

                <span className="text-xl sm:text-2xl mt-0.5 leading-none">{p.symbolGlyph}</span>
                
                <div>
                  <div className={`text-xs font-serif font-bold ${isSelected ? 'text-amber-900 dark:text-amber-300' : 'text-stone-800 dark:text-stone-200'}`}>
                    {p.rashiName[currentLang]}
                  </div>
                  <div className="text-[9.5px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                    {p.scorePercent}%
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: SINGLE RASHI DEEP-DIVE (DEFAULT) */}
      {/* ========================================================================= */}
      {viewMode === 'single' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Rashi Hero Card */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-300/80 dark:border-stone-800 shadow-xl p-5 sm:p-7 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-bl ${activeRashiData.bgGradient} blur-3xl pointer-events-none`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-stone-200 dark:border-stone-800 pb-5">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 ring-4 ring-amber-400/40">
                  {activeRashiData.symbolGlyph}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      RASHI #{activeRashiData.rashiIndex + 1} • {activeRashiData.element[currentLang]}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeRashiData.badgeColor}`}>
                      {activeRashiData.ratingTierText[currentLang]}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                    {activeRashiData.rashiName[currentLang]} ({activeRashiData.rashiName.en})
                  </h2>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn' ? 'ರಾಶ್ಯಾಧಿಪತಿ:' : 'Rashi Lord:'} <strong className="text-amber-800 dark:text-amber-300 font-bold">{activeRashiData.rashiLord[currentLang]}</strong> • 
                    <span className="ml-1.5">{currentLang === 'kn' ? 'ಮಿತ್ರ ರಾಶಿಗಳು:' : 'Allied Signs:'} {activeRashiData.compatibilityFriend[currentLang]}</span>
                  </p>
                </div>
              </div>

              {/* Day Score Dial */}
              <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-mono font-black text-amber-600 dark:text-amber-400">
                    {activeRashiData.scorePercent}%
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mt-0.5">
                    {currentLang === 'kn' ? 'ಶುಭ ಬಲ ಸೂಚ್ಯಂಕ' : 'Daily Auspicious Score'}
                  </span>
                </div>

                <div className="w-24 sm:w-28 space-y-1.5">
                  <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${activeRashiData.scorePercent >= 75 ? 'bg-emerald-500' : activeRashiData.scorePercent >= 55 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${activeRashiData.scorePercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block text-right font-mono">
                    Gochar Strength
                  </span>
                </div>
              </div>

            </div>

            {/* Special Alert Banner (e.g. Chandrashtama, Guru Bala, Sade Sati) */}
            {activeRashiData.specialAstrologicalAlert && (
              <div className={`mt-5 p-4 rounded-2xl border flex items-start gap-3.5 ${
                activeRashiData.specialAstrologicalAlert.severity === 'warning'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-950 dark:text-rose-200'
                  : activeRashiData.specialAstrologicalAlert.severity === 'supreme'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-200'
              }`}>
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  activeRashiData.specialAstrologicalAlert.severity === 'warning' ? 'text-rose-600' : 'text-amber-500'
                }`} />
                <div>
                  <h4 className="font-serif font-bold text-sm">
                    {activeRashiData.specialAstrologicalAlert.title[currentLang]}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {activeRashiData.specialAstrologicalAlert.description[currentLang]}
                  </p>
                </div>
              </div>
            )}

            {/* 4 Core Life Domains Forecasts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              
              {/* Domain 1: Career & Business */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>{currentLang === 'kn' ? '೧. ವೃತ್ತಿ & ವ್ಯಾಪಾರ (Career & Business)' : '1. Career & Profession'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {activeRashiData.careerForecast[currentLang]}
                </p>
              </div>

              {/* Domain 2: Finance & Wealth */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{currentLang === 'kn' ? '೨. ಆರ್ಥಿಕ & ಸಂಪತ್ತು (Finance & Wealth)' : '2. Finance & Investments'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {activeRashiData.financeForecast[currentLang]}
                </p>
              </div>

              {/* Domain 3: Health & Energy */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>{currentLang === 'kn' ? '೩. ಆರೋಗ್ಯ & ಶಕ್ತಿ (Health & Vitality)' : '3. Health & Well-being'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {activeRashiData.healthForecast[currentLang]}
                </p>
              </div>

              {/* Domain 4: Family & Love */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4" />
                  <span>{currentLang === 'kn' ? '೪. ಕುಟುಂಬ & ಪ್ರೇಮ (Family & Relationships)' : '4. Family & Harmony'}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {activeRashiData.familyForecast[currentLang]}
                </p>
              </div>

            </div>

            {/* Auspicious Daily Parameters (Lucky Number, Color, Direction, Time Window) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs">
              
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {currentLang === 'kn' ? 'ಶುಭ ಸಂಖ್ಯೆ (Lucky No):' : 'Lucky Number:'}
                </span>
                <strong className="text-base font-bold text-amber-950 dark:text-amber-200 font-mono block mt-0.5">
                  #{activeRashiData.luckyNumber}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {currentLang === 'kn' ? 'ಶುಭ ವರ್ಣ (Lucky Color):' : 'Lucky Color:'}
                </span>
                <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5 truncate">
                  {activeRashiData.luckyColor[currentLang]}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {currentLang === 'kn' ? 'ಶುಭ ದಿಕ್ಕು (Direction):' : 'Favorable Direction:'}
                </span>
                <strong className="text-xs font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5">
                  {activeRashiData.luckyDirection[currentLang]}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  {currentLang === 'kn' ? 'ಶುಭ ಕಾಲಾವಧಿ (Best Time):' : 'Auspicious Window:'}
                </span>
                <strong className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono block mt-0.5 truncate">
                  {activeRashiData.favorableTime[currentLang]}
                </strong>
              </div>

            </div>

            {/* Daily Astrological Remedy & Divine Chanting Box */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-900/90 via-orange-950 to-stone-900 text-white border border-amber-500/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif font-bold text-base text-amber-300">
                    {currentLang === 'kn' ? 'ದಿನದ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ & ಇಷ್ಟದೇವತಾ ಮಂತ್ರ' : currentLang === 'hi' ? 'दैनिक वैदिक उपाय एवं इष्टदेवता मन्त्र' : 'Daily Vedic Remedy & Chanting'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/30">
                  {activeRashiData.dailyRemedy.deity[currentLang]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-stone-400 text-[11px] font-semibold block">
                    {currentLang === 'kn' ? 'ಜಪಿಸಬೇಕಾದ ಮಂತ್ರ:' : 'Sacred Mantra:'}
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 font-serif font-bold text-sm">
                    {activeRashiData.dailyRemedy.mantra[currentLang]}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-stone-400 text-[11px] font-semibold block">
                    {currentLang === 'kn' ? 'ದಿನದ ದಾನ / ಸೇವೆ:' : 'Recommended Charity:'}
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-stone-200 font-serif">
                    {activeRashiData.dailyRemedy.charityAction[currentLang]}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-amber-200/90 font-serif italic border-t border-white/10 flex items-center gap-2">
                <span>💡</span>
                <span>{activeRashiData.dailyRemedy.mindsetTip[currentLang]}</span>
              </div>
            </div>

          </div>

          {/* Detailed Real-time Planetary Transits Table for this Rashi */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-5 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <span>
                    {currentLang === 'kn'
                      ? `${activeRashiData.rashiName.kn} ರಾಶಿಗೆ ಇಂದಿನ ನವಗ್ರಹ ಗೋಚಾರ ಸ್ಥಾನಗಳು`
                      : `Real-time Planetary Transits (Gochar) from ${activeRashiData.rashiName.en}`}
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {currentLang === 'kn'
                    ? 'ಪ್ರತಿಯೊಂದು ಗ್ರಹವು ನಿಮ್ಮ ರಾಶಿಯಿಂದ ಯಾವ ಭಾವದಲ್ಲಿ ಕುಳಿತಿದೆ ಮತ್ತು ಅದರ ನಿಖರ ಫಲವೇನು?'
                    : 'Exact house placements and classical Gochar outcomes for all 9 celestial bodies.'}
                </p>
              </div>

              <span className="text-[11px] font-mono text-stone-400 font-semibold self-start sm:self-auto">
                {report.dateFormatted}
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-100/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-3">ಗ್ರಹ (Graha)</th>
                    <th className="p-3">ಸ್ಥಿತ ರಾಶಿ (Rashi)</th>
                    <th className="p-3">ಅಂಶ (Deg)</th>
                    <th className="p-3">ನಕ್ಷತ್ರ (Nakshatra Pada)</th>
                    <th className="p-3 text-center">ಗೋಚಾರ ಭಾವ (House)</th>
                    <th className="p-3">ಗೋಚಾರ ಫಲ (Transit Outcome)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {activeRashiData.planetaryTransits.map((planet) => (
                    <tr key={planet.planetName} className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-3 font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: planet.color }} />
                        <span>{planet.sanskritName[currentLang]}</span>
                        {planet.isRetrograde && (
                          <span className="text-[9px] text-red-600 font-bold" title="Retrograde (ವಕ್ರ)">[R]</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-stone-700 dark:text-stone-300">
                        {planet.rashiName[currentLang]}
                      </td>
                      <td className="p-3 font-mono text-stone-600 dark:text-stone-400">
                        {planet.degrees}°
                      </td>
                      <td className="p-3 text-stone-600 dark:text-stone-400 font-serif">
                        {planet.nakshatra[currentLang]}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                          planet.isBeneficGochar
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                            : planet.transitBhava === 8
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300'
                        }`}>
                          ಭಾವ {planet.transitBhava} ({planet.transitBhava}H)
                        </span>
                      </td>
                      <td className="p-3 text-stone-700 dark:text-stone-300 max-w-sm leading-relaxed">
                        {planet.effectSummary[currentLang]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: ALL 12 RASHIS COMPARATIVE GRID */}
      {/* ========================================================================= */}
      {viewMode === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-200">
          {report.predictions.map((p) => (
            <div 
              key={p.rashiIndex}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg p-5 flex flex-col justify-between hover:border-amber-400 transition-all hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.symbolGlyph}</span>
                    <div>
                      <h3 className="font-serif font-black text-lg text-stone-900 dark:text-stone-100">
                        {p.rashiName[currentLang]}
                      </h3>
                      <span className="text-[11px] text-stone-500 font-serif">
                        {p.rashiLord[currentLang]} • {p.element[currentLang]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-mono font-black text-amber-600 dark:text-amber-400">
                      {p.scorePercent}%
                    </span>
                    <span className={`block text-[9px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${p.badgeColor}`}>
                      {p.ratingTierText[currentLang].split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Special Alert if any */}
                {p.specialAstrologicalAlert && (
                  <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                    {p.specialAstrologicalAlert.title[currentLang]}
                  </div>
                )}

                {/* Snippets */}
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                  <p className="line-clamp-2 leading-relaxed">
                    <strong>ವೃತ್ತಿ:</strong> {p.careerForecast[currentLang]}
                  </p>
                  <p className="line-clamp-2 leading-relaxed">
                    <strong>ಆರ್ಥಿಕ:</strong> {p.financeForecast[currentLang]}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-stone-500">
                  ಶುಭ ಸಂಖ್ಯೆ: <strong>#{p.luckyNumber}</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedRashiIndex(p.rashiIndex);
                    setViewMode('single');
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>ವಿವರ ನೋಡಿ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
