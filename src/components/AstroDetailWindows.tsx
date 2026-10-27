import React from 'react';
import {
  Compass,
  Clock,
  Sparkles,
  Moon,
  TrendingUp,
  Printer,
  X,
  Flame,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CityLocation, Festival, Language, PanchangaDay } from '../types';
import { getLocalizedPlaceName } from '../utils/panchanga';
import { DashboardWidget } from './DashboardWidget';
import { GocharTransitsView } from './GocharTransitsView';
import { MoonPhaseCalendarWidget } from './MoonPhaseCalendarWidget';

export interface AstroDetailWindowsProps {
  currentLang: Language;
  selectedCity: CityLocation;
  selectedYear: number;
  selectedMonth: number;
  currentMonthName: string;
  samvatsaraName: string;
  masaName: string;
  monthDays: PanchangaDay[];
  monthlyHighlights: {
    ekadashis: PanchangaDay[];
    pradoshas: PanchangaDay[];
    amavasyas: PanchangaDay[];
    purnimas: PanchangaDay[];
    sankashtis: PanchangaDay[];
    festivalsInMonth: { day: PanchangaDay; fest: Festival }[];
  };
  monthlyTrendData: Array<{
    day: number;
    dateLabel: string;
    tithiName: string;
    nakshatraName: string;
    paksha: string;
    tithiIntensity: number;
    nakshatraEnergy: number;
  }>;
  showMonthlyOverview: boolean;
  setShowMonthlyOverview: (val: boolean) => void;
  showDashboardWidget: boolean;
  setShowDashboardWidget: (val: boolean) => void;
  showGocharWidget: boolean;
  setShowGocharWidget: (val: boolean) => void;
  showMoonPhaseWidget: boolean;
  setShowMoonPhaseWidget: (val: boolean) => void;
  showTrendChart: boolean;
  setShowTrendChart: (val: boolean) => void;
  trendMetric: 'tithi' | 'nakshatra';
  setTrendMetric: (val: 'tithi' | 'nakshatra') => void;
  selectedMoonDay: PanchangaDay;
  setSelectedMoonDay: (d: PanchangaDay) => void;
  onSelectDay: (day: PanchangaDay) => void;
  onSelectFestival: (festival: Festival) => void;
  onOpenKundali: (panchanga?: PanchangaDay) => void;
  onOpenMantras: () => void;
  onOpenSankalpa: () => void;
}

export const AstroDetailWindows: React.FC<AstroDetailWindowsProps> = ({
  currentLang,
  selectedCity,
  selectedYear,
  selectedMonth: _selectedMonth,
  currentMonthName,
  samvatsaraName,
  masaName,
  monthDays,
  monthlyHighlights,
  monthlyTrendData,
  showMonthlyOverview,
  setShowMonthlyOverview,
  showDashboardWidget,
  setShowDashboardWidget,
  showGocharWidget,
  setShowGocharWidget,
  showMoonPhaseWidget,
  setShowMoonPhaseWidget,
  showTrendChart,
  setShowTrendChart,
  trendMetric,
  setTrendMetric,
  selectedMoonDay,
  setSelectedMoonDay,
  onSelectDay,
  onSelectFestival,
  onOpenKundali,
  onOpenMantras,
  onOpenSankalpa
}) => {
  return (
    <div id="astro-detail-windows" className="space-y-4 pt-2">
      {/* Detail Windows Control Bar (The 5 Buttons Hub) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-900 text-white border-2 border-amber-500/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 font-black shadow-xs shrink-0">
            <Compass className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                {currentLang === 'kn' ? 'ಖಗೋಳ ವಿವರಗಳ ವಿಂಡೋಗಳು' : currentLang === 'hi' ? 'खगोलीय विवरण विंडो' : 'ASTRONOMICAL DETAIL WINDOWS'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9.5px] bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {currentLang === 'kn' ? 'ನೇರ ವೀಕ್ಷಣೆ' : currentLang === 'hi' ? 'प्रत्यक्ष दर्शन' : 'Interactive'}
              </span>
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-amber-200 mt-0.5">
              {currentLang === 'kn' 
                ? 'ಮಾಸಿಕ ಅವಲೋಕನ, ಲೈವ್ ಪಂಚಾಂಗ, ಗ್ರಹ ಗೋಚಾರ, ಚಂದ್ರ ದರ್ಶನ & ರೇಖಾಚಿತ್ರ ಸಾಧನಗಳು' 
                : currentLang === 'hi' 
                ? 'मासिक अवलोकन, लाइव पंचांग, ग्रह गोचर, चन्द्र दर्शन व प्रभाव रेखा' 
                : 'Monthly Overview, Live Panchanga, Gochar Transits, Moon Phase & Cosmic Trends'}
            </h3>
          </div>
        </div>

        {/* The 5 Relocated Buttons at the Windows */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Button 1: Monthly Overview */}
          <button
            onClick={() => setShowMonthlyOverview(!showMonthlyOverview)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
              showMonthlyOverview 
                ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 shadow-amber-500/20' 
                : 'bg-stone-800 hover:bg-stone-750 text-white border-stone-700 hover:border-amber-400/60'
            }`}
            title="Consolidated list of important Tithis, Nakshatras & festivals for this month"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ ಅವಲೋಕನ' : currentLang === 'hi' ? 'मासिक अवलोकन' : 'Monthly Overview'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${showMonthlyOverview ? 'bg-stone-900 text-amber-300' : 'bg-stone-700 text-stone-300'}`}>
              {showMonthlyOverview ? '✕' : '▼'}
            </span>
          </button>

          {/* Button 2: Live Panchanga */}
          <button
            onClick={() => setShowDashboardWidget(!showDashboardWidget)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
              showDashboardWidget 
                ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 shadow-amber-500/20' 
                : 'bg-stone-800 hover:bg-stone-750 text-white border-stone-700 hover:border-amber-400/60'
            }`}
            title="Today's Live Tithi, Nakshatra & Yoga Dashboard Widget"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{currentLang === 'kn' ? 'ಲೈವ್ ಪಂಚಾಂಗ' : currentLang === 'hi' ? 'लाइव पंचांग' : 'Live Panchanga'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${showDashboardWidget ? 'bg-stone-900 text-emerald-300' : 'bg-stone-700 text-stone-300'}`}>
              {showDashboardWidget ? '✕' : '▼'}
            </span>
          </button>

          {/* Button 3: Planetary Gochar */}
          <button
            onClick={() => setShowGocharWidget(!showGocharWidget)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
              showGocharWidget 
                ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 shadow-amber-500/20' 
                : 'bg-stone-800 hover:bg-stone-750 text-white border-stone-700 hover:border-amber-400/60'
            }`}
            title="Current Planetary Transits (Gochar) based on selected city"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ' : currentLang === 'hi' ? 'ग्रह गोचर' : 'Planetary Gochar'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${showGocharWidget ? 'bg-stone-900 text-purple-300' : 'bg-stone-700 text-stone-300'}`}>
              {showGocharWidget ? '✕' : '▼'}
            </span>
          </button>

          {/* Button 4: Moon Phase */}
          <button
            onClick={() => setShowMoonPhaseWidget(!showMoonPhaseWidget)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
              showMoonPhaseWidget 
                ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 shadow-amber-500/20' 
                : 'bg-stone-800 hover:bg-stone-750 text-white border-stone-700 hover:border-amber-400/60'
            }`}
            title="Moon Phase Visualizer for selected date (Amavasya to Purnima progression)"
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ದರ್ಶನ' : currentLang === 'hi' ? 'चन्द्र दर्शन' : 'Moon Phase'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${showMoonPhaseWidget ? 'bg-stone-900 text-sky-300' : 'bg-stone-700 text-stone-300'}`}>
              {showMoonPhaseWidget ? '✕' : '▼'}
            </span>
          </button>

          {/* Button 5: Cosmic Trends */}
          <button
            onClick={() => setShowTrendChart(!showTrendChart)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer border ${
              showTrendChart 
                ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-300/60 shadow-amber-500/20' 
                : 'bg-stone-800 hover:bg-stone-750 text-white border-stone-700 hover:border-amber-400/60'
            }`}
            title="Monthly trend line for Tithi and Nakshatra influence intensity (Recharts)"
          >
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ ರೇಖಾಚಿತ್ರ' : currentLang === 'hi' ? 'मासिक प्रभाव रेखा' : 'Cosmic Trends'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${showTrendChart ? 'bg-stone-900 text-rose-300' : 'bg-stone-700 text-stone-300'}`}>
              {showTrendChart ? '✕' : '▼'}
            </span>
          </button>
        </div>
      </div>

      {/* WINDOW 1: MONTHLY OVERVIEW */}
      {showMonthlyOverview && (
        <div className="rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border-2 border-amber-400 dark:border-stone-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs">
                <Compass className="w-6 h-6 text-amber-200" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {currentLang === 'kn' 
                    ? `${currentMonthName} ${selectedYear} - ಮಾಸಿಕ ಅವಲೋಕನ` 
                    : currentLang === 'hi' 
                    ? `${currentMonthName} ${selectedYear} - मासिक अवलोकन` 
                    : `${currentMonthName} ${selectedYear} - Monthly Overview`}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  {samvatsaraName} ಸಂವತ್ಸರ • {masaName} ಮಾಸ • 📍 {getLocalizedPlaceName(selectedCity, currentLang)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಮುದ್ರಿಸಿ' : currentLang === 'hi' ? 'प्रिंट' : 'Print'}</span>
              </button>
              <button
                onClick={() => setShowMonthlyOverview(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800 dark:text-stone-200">
            {/* Section 1: Important Tithis of the Month */}
            <div className="rounded-xl border border-amber-200/80 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-850 p-4 space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-amber-200/60 dark:border-stone-700 pb-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ಪ್ರಮುಖ ತಿಥಿಗಳು ಮತ್ತು ವ್ರತಗಳು' : currentLang === 'hi' ? 'प्रमुख तिथियाँ एवं व्रत' : 'Important Tithis & Fasting Days'}
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {/* Ekadashis */}
                <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    🌿 {currentLang === 'kn' ? 'ಏಕಾದಶಿ (Ekadashi)' : currentLang === 'hi' ? 'एकादशी' : 'Ekadashi'}
                  </span>
                  {monthlyHighlights.ekadashis.length > 0 ? (
                    monthlyHighlights.ekadashis.map(d => (
                      <div key={d.day} onClick={() => { setShowMonthlyOverview(false); onSelectDay(d); }} className="cursor-pointer hover:text-amber-600 py-0.5">
                        • <span className="font-bold">{d.day} {currentMonthName}</span> ({d.vara[currentLang]}) - {d.pakshaName[currentLang]}
                      </div>
                    ))
                  ) : <span className="text-stone-400">None this month</span>}
                </div>

                {/* Pradosha */}
                <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    🔱 {currentLang === 'kn' ? 'ಪ್ರದೋಷ ವ್ರತ (Pradosha)' : currentLang === 'hi' ? 'प्रदोष व्रत' : 'Pradosha Vrata'}
                  </span>
                  {monthlyHighlights.pradoshas.length > 0 ? (
                    monthlyHighlights.pradoshas.map(d => (
                      <div key={d.day} onClick={() => { setShowMonthlyOverview(false); onSelectDay(d); }} className="cursor-pointer hover:text-amber-600 py-0.5">
                        • <span className="font-bold">{d.day} {currentMonthName}</span> ({d.vara[currentLang]}) - {d.pakshaName[currentLang]}
                      </div>
                    ))
                  ) : <span className="text-stone-400">None this month</span>}
                </div>

                {/* Sankashti */}
                <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    🐘 {currentLang === 'kn' ? 'ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (Sankashti)' : currentLang === 'hi' ? 'संकष्टी चतुर्थी' : 'Sankashti Chaturthi'}
                  </span>
                  {monthlyHighlights.sankashtis.length > 0 ? (
                    monthlyHighlights.sankashtis.map(d => (
                      <div key={d.day} onClick={() => { setShowMonthlyOverview(false); onSelectDay(d); }} className="cursor-pointer hover:text-amber-600 py-0.5">
                        • <span className="font-bold">{d.day} {currentMonthName}</span> ({d.vara[currentLang]})
                      </div>
                    ))
                  ) : <span className="text-stone-400">None this month</span>}
                </div>

                {/* Purnima */}
                <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    🌕 {currentLang === 'kn' ? 'ಹುಣ್ಣಿಮೆ (Purnima)' : currentLang === 'hi' ? 'पूर्णिमा' : 'Full Moon (Purnima)'}
                  </span>
                  {monthlyHighlights.purnimas.length > 0 ? (
                    monthlyHighlights.purnimas.map(d => (
                      <div key={d.day} onClick={() => { setShowMonthlyOverview(false); onSelectDay(d); }} className="cursor-pointer hover:text-amber-600 py-0.5">
                        • <span className="font-bold">{d.day} {currentMonthName}</span> ({d.vara[currentLang]}) - {d.nakshatra[currentLang]}
                      </div>
                    ))
                  ) : <span className="text-stone-400">None this month</span>}
                </div>

                {/* Amavasya */}
                <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    🌑 {currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ (Amavasya)' : currentLang === 'hi' ? 'अमावस्या' : 'New Moon (Amavasya)'}
                  </span>
                  {monthlyHighlights.amavasyas.length > 0 ? (
                    monthlyHighlights.amavasyas.map(d => (
                      <div key={d.day} onClick={() => { setShowMonthlyOverview(false); onSelectDay(d); }} className="cursor-pointer hover:text-amber-600 py-0.5">
                        • <span className="font-bold">{d.day} {currentMonthName}</span> ({d.vara[currentLang]}) - {d.nakshatra[currentLang]}
                      </div>
                    ))
                  ) : <span className="text-stone-400">None this month</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Consolidated Festivals of the Month */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ಈ ತಿಂಗಳ ಹಬ್ಬಗಳು ಮತ್ತು ಆಚರಣೆಗಳು' : currentLang === 'hi' ? 'इस माह के पर्व एवं त्योहार' : 'Festivals & Special Celebrations'}
                </span>
              </h4>

              {monthlyHighlights.festivalsInMonth.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {monthlyHighlights.festivalsInMonth.map(({ day, fest }, idx) => (
                    <div
                      key={`${day.day}-${fest.id}-${idx}`}
                      onClick={() => {
                        setShowMonthlyOverview(false);
                        onSelectFestival(fest);
                      }}
                      className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-amber-400 transition-all cursor-pointer flex items-start gap-3 shadow-2xs"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center text-stone-900 dark:text-stone-100 font-bold shrink-0">
                        <span className="text-base font-serif leading-none">{day.day}</span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">{day.vara[currentLang].slice(0, 3)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {fest.name[currentLang]}
                        </h5>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                          {fest.shortDesc[currentLang]}
                        </p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 underline">
                          {currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಿ ಮತ್ತು ಮಂತ್ರ ವೀಕ್ಷಿಸಿ →' : currentLang === 'hi' ? 'पूजा विधि व मन्त्र देखें →' : 'View Puja Vidhi & Mantra →'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic p-4 text-center">
                  {currentLang === 'kn' ? 'ಈ ತಿಂಗಳು ಯಾವುದೇ ಪ್ರಮುಖ ಹಬ್ಬಗಳು ದಾಖಲಾಗಿಲ್ಲ.' : currentLang === 'hi' ? 'इस माह कोई प्रमुख त्योहार नहीं है।' : 'No major festivals recorded for this month.'}
                </p>
              )}
            </div>

            {/* Section 3: Month's Complete Daily Panchanga Table */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ದೈನಂದಿನ ಪಂಚಾಂಗ ಸೂಚಿ (ತಿಥಿ, ನಕ್ಷತ್ರ & ಚಂದ್ರ ರಾಶಿ)' : currentLang === 'hi' ? 'दैनिक पंचांग सूची (तिथि, नक्षत्र व चन्द्र राशि)' : 'Daily Panchanga Table (Tithi, Nakshatra & Moon Sign)'}
                </span>
              </h4>

              <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-x-auto text-xs max-h-72">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-stone-100 dark:bg-stone-800 shadow-2xs z-10">
                    <tr className="border-b border-stone-200 dark:border-stone-700 font-bold text-stone-700 dark:text-stone-300">
                      <th className="p-2.5 text-center w-14">
                        {currentLang === 'kn' ? 'ದಿನಾಂಕ' : currentLang === 'hi' ? 'दिनांक' : 'Date'}
                      </th>
                      <th className="p-2.5 w-20">
                        {currentLang === 'kn' ? 'ವಾರ' : currentLang === 'hi' ? 'वार' : 'Day'}
                      </th>
                      <th className="p-2.5">
                        {currentLang === 'kn' ? 'ತಿಥಿ & ಪಕ್ಷ' : currentLang === 'hi' ? 'तिथि व पक्ष' : 'Tithi & Paksha'}
                      </th>
                      <th className="p-2.5">
                        {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ (ಅಕ್ಷರ)' : currentLang === 'hi' ? 'नक्षत्र' : 'Nakshatra'}
                      </th>
                      <th className="p-2.5">
                        {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ' : currentLang === 'hi' ? 'चन्द्र राशि' : 'Moon Sign'}
                      </th>
                      <th className="p-2.5 text-right w-24">
                        {currentLang === 'kn' ? 'ವಿವರ' : currentLang === 'hi' ? 'विवरण' : 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {monthDays.map(d => (
                      <tr 
                        key={d.gregorianDate}
                        className="hover:bg-amber-50/60 dark:hover:bg-stone-800/60 transition-colors"
                      >
                        <td className="p-2.5 text-center font-bold text-stone-900 dark:text-stone-100">
                          {d.day}
                        </td>
                        <td className="p-2.5 text-stone-600 dark:text-stone-400">
                          {d.vara[currentLang]}
                        </td>
                        <td className="p-2.5 font-semibold text-stone-800 dark:text-stone-200">
                          {d.pakshaName[currentLang]} • {d.tithiName[currentLang]}
                        </td>
                        <td className="p-2.5 text-stone-700 dark:text-stone-300">
                          {d.nakshatra[currentLang]} <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">({d.charanaLetter})</span>
                        </td>
                        <td className="p-2.5 text-stone-700 dark:text-stone-300">
                          {d.chandraRashi[currentLang]}
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              setShowMonthlyOverview(false);
                              onSelectDay(d);
                            }}
                            className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[11px] cursor-pointer"
                          >
                            {currentLang === 'kn' ? 'ನೋಡಿ' : currentLang === 'hi' ? 'देखें' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WINDOW 2: LIVE PANCHANGA DASHBOARD */}
      {showDashboardWidget && (
        <div className="rounded-2xl border-2 border-emerald-500/50 dark:border-stone-700 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 relative">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 px-4 py-2.5 text-white flex items-center justify-between border-b border-emerald-600/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-300" />
              <span className="font-serif font-bold text-sm">
                {currentLang === 'kn' ? 'ಲೈವ್ ದೈನಂದಿನ ಪಂಚಾಂಗ ವಿಂಡೋ' : currentLang === 'hi' ? 'लाइव दैनिक पंचांग विंडो' : 'Live Daily Panchanga Window'}
              </span>
            </div>
            <button
              onClick={() => setShowDashboardWidget(false)}
              className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2"
              title="Close Live Panchanga Window"
            >
              <span>✕</span>
              <span>{currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}</span>
            </button>
          </div>
          <DashboardWidget
            currentLang={currentLang}
            selectedCity={selectedCity}
            onOpenDayDetail={(day) => {
              setSelectedMoonDay(day);
              onSelectDay(day);
            }}
            onOpenKundali={onOpenKundali}
            onOpenMantras={onOpenMantras}
            onOpenSankalpa={onOpenSankalpa}
          />
        </div>
      )}

      {/* WINDOW 3: PLANETARY GOCHAR TRANSITS */}
      {showGocharWidget && (
        <div className="rounded-2xl border-2 border-purple-500/50 dark:border-stone-700 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 relative">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 px-4 py-2.5 text-white flex items-center justify-between border-b border-purple-600/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="font-serif font-bold text-sm">
                {currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ ಸಂಚಾರ ವಿಂಡೋ' : currentLang === 'hi' ? 'ग्रह गोचर संचार विंडो' : 'Planetary Gochar Transits Window'}
              </span>
            </div>
            <button
              onClick={() => setShowGocharWidget(false)}
              className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2"
              title="Close Gochar Window"
            >
              <span>✕</span>
              <span>{currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}</span>
            </button>
          </div>
          <GocharTransitsView
            currentLang={currentLang}
            selectedCity={selectedCity}
            onOpenKundali={onOpenKundali}
            isWidget={true}
          />
        </div>
      )}

      {/* WINDOW 4: MOON PHASE VISUALIZER */}
      {showMoonPhaseWidget && (
        <div className="rounded-2xl border-2 border-sky-500/50 dark:border-stone-700 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 relative">
          <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 px-4 py-2.5 text-white flex items-center justify-between border-b border-sky-600/40">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-sky-300" />
              <span className="font-serif font-bold text-sm">
                {currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲೆ & ತಿಥಿ ಪ್ರಗತಿ ದರ್ಶಕ' : currentLang === 'hi' ? 'चन्द्र कला व तिथि प्रगति दर्शन' : 'Moon Phase & Tithi Visualizer Window'}
              </span>
            </div>
            <button
              onClick={() => setShowMoonPhaseWidget(false)}
              className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2"
              title="Close Moon Phase Window"
            >
              <span>✕</span>
              <span>{currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}</span>
            </button>
          </div>
          <MoonPhaseCalendarWidget
            selectedDay={selectedMoonDay}
            currentLang={currentLang}
          />
        </div>
      )}

      {/* WINDOW 5: RECHARTS COSMIC TRENDS */}
      {showTrendChart && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-rose-400 dark:border-stone-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>RECHARTS DATA VISUALIZATION • MONTHLY INTENSITY FLOW</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {currentLang === 'kn' 
                  ? `${currentMonthName} ಮಾಸದ ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರ ಪ್ರಭಾವ ರೇಖಾಚಿತ್ರ` 
                  : `${currentMonthName} Monthly Tithi & Nakshatra Influence Intensity`}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-stone-200 dark:border-stone-700 p-1 bg-stone-100 dark:bg-stone-800 text-xs font-bold">
                <button
                  onClick={() => setTrendMetric('tithi')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    trendMetric === 'tithi'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರಭಾವ (Lunar Curve)' : 'Tithi Intensity'}
                </button>
                <button
                  onClick={() => setTrendMetric('nakshatra')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    trendMetric === 'nakshatra'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ತಾರಾಬಲ (Nakshatra Energy)' : 'Nakshatra Energy'}
                </button>
              </div>

              <button
                onClick={() => setShowTrendChart(false)}
                className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer text-xs flex items-center gap-1 px-2.5 font-bold"
                title="Close Trend Chart"
              >
                <span>✕</span>
                <span>{currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}</span>
              </button>
            </div>
          </div>

          <div className="h-56 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tithiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="nakshatraGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-stone-900 text-white text-xs rounded-xl shadow-xl border border-amber-500/30 space-y-1">
                          <p className="font-bold text-amber-300 font-serif">{data.dateLabel}</p>
                          <p className="text-stone-300">ತಿಥಿ: <strong className="text-white">{data.tithiName}</strong> ({data.paksha})</p>
                          <p className="text-stone-300">ನಕ್ಷತ್ರ: <strong className="text-white">{data.nakshatraName}</strong></p>
                          <p className="text-amber-400 font-mono font-bold">
                            {trendMetric === 'tithi' ? `Lunar Intensity: ${data.tithiIntensity}%` : `Nakshatra Energy: ${data.nakshatraEnergy}%`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey={trendMetric === 'tithi' ? 'tithiIntensity' : 'nakshatraEnergy'} 
                  stroke={trendMetric === 'tithi' ? '#f59e0b' : '#8b5cf6'} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill={`url(#${trendMetric === 'tithi' ? 'tithiGrad' : 'nakshatraGrad'})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
