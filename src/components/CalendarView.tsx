import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Flame, 
  Compass, 
  BookOpen, 
  Info,
  Layers,
  ChevronDown,
  Bell,
  Printer,
  Download,
  X
} from 'lucide-react';
import { CityLocation, Festival, Language, PanchangaDay } from '../types';
import { 
  formatJustNumber, 
  formatNumberWithEnglishBracket, 
  getPanchangaForDate, 
  getLocalizedPlaceName,
  toIndicNumeral 
} from '../utils/panchanga';
import { FESTIVALS_CATALOG } from '../utils/festivals';
import { GocharTransitsView } from './GocharTransitsView';
import { DashboardWidget } from './DashboardWidget';
import { MoonPhaseIcon } from './MoonPhaseIcon';
import { MoonPhaseCalendarWidget } from './MoonPhaseCalendarWidget';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

interface CalendarViewProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectDay: (day: PanchangaDay) => void;
  onSelectFestival: (festival: Festival) => void;
  onOpenMantras: () => void;
  onOpenSankalpa: () => void;
  onOpenKundali: () => void;
  isAstroDiagnosticActive?: boolean;
  onOpenAstroDiagnostic?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentLang,
  selectedCity,
  onSelectDay,
  onSelectFestival,
  onOpenMantras,
  onOpenSankalpa,
  onOpenKundali,
  isAstroDiagnosticActive = false,
  onOpenAstroDiagnostic
}) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth()); // 0-11
  const [showTrendChart, setShowTrendChart] = useState<boolean>(false);
  const [trendMetric, setTrendMetric] = useState<'tithi' | 'nakshatra'>('tithi');

  // Year range from 1900 to 2100+
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = 1900; y <= 2125; y++) {
      list.push(y);
    }
    return list;
  }, []);

  const monthNames = useMemo(() => [
    { en: 'January', kn: 'ಜನವರಿ', hi: 'जनवरी' },
    { en: 'February', kn: 'ಫೆಬ್ರವರಿ', hi: 'फ़रवरी' },
    { en: 'March', kn: 'ಮಾರ್ಚ್', hi: 'मार्च' },
    { en: 'April', kn: 'ಏಪ್ರಿಲ್', hi: 'अप्रैल' },
    { en: 'May', kn: 'ಮೇ', hi: 'मई' },
    { en: 'June', kn: 'ಜೂನ್', hi: 'जून' },
    { en: 'July', kn: 'ಜುಲೈ', hi: 'जुलाई' },
    { en: 'August', kn: 'ಆಗಸ್ಟ್', hi: 'अगस्त' },
    { en: 'September', kn: 'ಸೆಪ್ಟೆಂಬರ್', hi: 'सितम्बर' },
    { en: 'October', kn: 'ಅಕ್ಟೋಬರ್', hi: 'अक्टूबर' },
    { en: 'November', kn: 'ನವೆಂಬರ್', hi: 'नवम्बर' },
    { en: 'December', kn: 'ಡಿಸೆಂಬರ್', hi: 'दिसम्बर' }
  ], []);

  const weekDayHeaders = useMemo(() => [
    { en: 'Sun', kn: 'ಭಾನು', hi: 'रवि' },
    { en: 'Mon', kn: 'ಸೋಮ', hi: 'सोम' },
    { en: 'Tue', kn: 'ಮಂಗಳ', hi: 'मंगल' },
    { en: 'Wed', kn: 'ಬುಧ', hi: 'बुध' },
    { en: 'Thu', kn: 'ಗುರು', hi: 'गुरु' },
    { en: 'Fri', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    { en: 'Sat', kn: 'ಶನಿ', hi: 'शनि' }
  ], []);

  // Compute Panchanga days for the entire selected month
  const { monthDays, leadingEmptyDays, currentMonthPanchangaSample } = useMemo(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const leadingEmpty = firstDayOfMonth.getDay(); // 0 is Sunday

    const days: PanchangaDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      days.push(getPanchangaForDate(dateObj, selectedCity));
    }

    const sample = days[Math.min(14, days.length - 1)] || getPanchangaForDate(firstDayOfMonth, selectedCity);

    return {
      monthDays: days,
      leadingEmptyDays: leadingEmpty,
      currentMonthPanchangaSample: sample
    };
  }, [selectedYear, selectedMonth, selectedCity]);

  // Aggregate all festivals occurring this month
  const monthlyFestivals = useMemo(() => {
    const map = new Map<string, { festival: Festival; dateStr: string; dayNum: number }>();
    monthDays.forEach(day => {
      day.festivals.forEach(fest => {
        if (!map.has(fest.id)) {
          map.set(fest.id, {
            festival: fest,
            dateStr: day.gregorianDate,
            dayNum: day.day
          });
        }
      });
    });
    return Array.from(map.values());
  }, [monthDays]);

  const monthlyTrendData = useMemo(() => {
    return monthDays.map((d) => {
      let tithiIntensity = 50;
      if (d.paksha === 'Shukla') {
        tithiIntensity = Math.round((d.tithiNumber / 15) * 100);
      } else {
        tithiIntensity = Math.round(((15 - d.tithiNumber) / 15) * 100);
      }

      const nakIndex = (d.nakshatraIndex - 1 + 27) % 27;
      const auspiciousNakshatras = [0, 3, 4, 7, 12, 13, 14, 16, 21, 23, 25, 26];
      const nakshatraEnergy = auspiciousNakshatras.includes(nakIndex) ? 88 + (nakIndex % 10) : 60 + (nakIndex % 15);

      return {
        day: d.day,
        dateLabel: `${d.day} ${monthNames[selectedMonth][currentLang]}`,
        tithiName: d.tithiName[currentLang],
        nakshatraName: d.nakshatra[currentLang],
        paksha: d.paksha,
        tithiIntensity,
        nakshatraEnergy
      };
    });
  }, [monthDays, selectedMonth, currentLang, monthNames]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > 1900) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      if (selectedYear < 2125) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleGoToToday = () => {
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
  };

  const currentMonthName = monthNames[selectedMonth][currentLang];
  const masaName = currentMonthPanchangaSample.masa[currentLang];
  const samvatsaraName = currentMonthPanchangaSample.samvatsara[currentLang];

  const [showMonthlyOverview, setShowMonthlyOverview] = useState<boolean>(false);
  const [showGocharWidget, setShowGocharWidget] = useState<boolean>(true);
  const [showDashboardWidget, setShowDashboardWidget] = useState<boolean>(true);
  const [showMoonPhaseWidget, setShowMoonPhaseWidget] = useState<boolean>(true);
  const [selectedMoonDay, setSelectedMoonDay] = useState<PanchangaDay>(() => {
    return getPanchangaForDate(today, selectedCity);
  });

  useEffect(() => {
    setSelectedMoonDay(getPanchangaForDate(new Date(), selectedCity));
  }, [selectedCity]);

  // Consolidated highlights for the selected month
  const monthlyHighlights = useMemo(() => {
    const ekadashis = monthDays.filter(d => d.tithiNumber === 11);
    const pradoshas = monthDays.filter(d => d.tithiNumber === 13);
    const amavasyas = monthDays.filter(d => d.paksha === 'Krishna' && d.tithiNumber === 15);
    const purnimas = monthDays.filter(d => d.paksha === 'Shukla' && d.tithiNumber === 15);
    const sankashtis = monthDays.filter(d => d.paksha === 'Krishna' && d.tithiNumber === 4);

    const festivalsInMonth = monthDays
      .filter(d => d.festivals.length > 0)
      .flatMap(d => d.festivals.map(fest => ({ day: d, fest })));

    return {
      ekadashis,
      pradoshas,
      amavasyas,
      purnimas,
      sankashtis,
      festivalsInMonth
    };
  }, [monthDays]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Vedic Date Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 dark:from-stone-900 dark:via-amber-950 dark:to-stone-900 p-5 text-white shadow-lg border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>
                {currentLang === 'kn' ? 'ಸಂವತ್ಸರ ಮತ್ತು ಅಯನ' : currentLang === 'hi' ? 'संवत्सर एवं अयन' : 'Samvatsara & Solar Course'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {currentMonthName} {formatJustNumber(selectedYear, currentLang)}
              <span className="ml-2 font-normal text-amber-200">
                ({masaName} {currentMonthPanchangaSample.isAdhikaMasa ? (currentLang === 'kn' ? 'ಅಧಿಕ ಮಾಸ' : currentLang === 'hi' ? 'अधिक मास' : 'Adhika Masa') : (currentLang === 'kn' ? 'ಮಾಸ' : currentLang === 'hi' ? 'मास' : 'Masa')})
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-amber-100">
              <span className="font-semibold text-amber-300">
                {currentLang === 'kn' ? 'ಸಂವತ್ಸರ:' : currentLang === 'hi' ? 'संवत्सर:' : 'Samvatsara:'} {samvatsaraName}
              </span>
              <span>•</span>
              <span>{currentMonthPanchangaSample.ayana[currentLang]}</span>
              <span>•</span>
              <span className="font-bold text-amber-200 bg-black/20 px-2 py-0.5 rounded">
                ಋತು (Rutu): {currentMonthPanchangaSample.ritu[currentLang]}
              </span>
              <span>•</span>
              <span>
                {currentLang === 'kn' ? 'ಶಾಲಿವಾಹನ ಶಕ:' : currentLang === 'hi' ? 'शालिवाहन शक:' : 'Shaka:'} {formatJustNumber(currentMonthPanchangaSample.hinduYearSaka, currentLang)}
              </span>
              <span>•</span>
              <span className="font-mono text-amber-200 bg-black/20 px-2 py-0.5 rounded">
                📍 {getLocalizedPlaceName(selectedCity, currentLang)}: 🌅 {currentMonthPanchangaSample.sunrise} • 🌇 {currentMonthPanchangaSample.sunset}
              </span>
            </div>
          </div>

          {/* Month / Year Navigator Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGoToToday}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors backdrop-blur-xs flex items-center gap-1.5"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಇಂದು' : currentLang === 'hi' ? 'आज' : 'Today'}</span>
            </button>

            <button
              onClick={handlePrevMonth}
              disabled={selectedYear === 1900 && selectedMonth === 0}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors disabled:opacity-30"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Month Select */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-lg px-2.5 py-1.5 border border-white/20 backdrop-blur-xs focus:outline-hidden cursor-pointer"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx} className="text-stone-900 bg-white">
                  {m[currentLang]}
                </option>
              ))}
            </select>

            {/* Year Select (1900 to 2125+) */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-lg px-2.5 py-1.5 border border-white/20 backdrop-blur-xs focus:outline-hidden cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y} className="text-stone-900 bg-white">
                  {formatJustNumber(y, currentLang)}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextMonth}
              disabled={selectedYear === 2125 && selectedMonth === 11}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors disabled:opacity-30"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* NEW FEATURE: Export Current Monthly View to Printable PDF */}
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1"
              title="Export current monthly view (Panchanga & Festivals) to printable PDF format"
            >
              <Printer className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ PDF ರಫ್ತು' : currentLang === 'hi' ? 'मासिक PDF निर्यात' : 'Export Monthly PDF'}</span>
            </button>

            {/* NEW FEATURE: Monthly Overview */}
            <button
              onClick={() => setShowMonthlyOverview(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs"
              title="Consolidated list of important Tithis, Nakshatras & festivals for this month"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ ಅವಲೋಕನ' : currentLang === 'hi' ? 'मासिक अवलोकन' : 'Monthly Overview'}</span>
            </button>

            {/* Live Dashboard Widget Toggle */}
            <button
              onClick={() => setShowDashboardWidget(!showDashboardWidget)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs ${
                showDashboardWidget ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Today's Live Tithi, Nakshatra & Yoga Dashboard Widget"
            >
              <Clock className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಲೈವ್ ಪಂಚಾಂಗ' : currentLang === 'hi' ? 'लाइव पंचांग' : 'Live Panchanga'}</span>
            </button>

            {/* NEW FEATURE: Gochar Planetary Transits Widget Toggle */}
            <button
              onClick={() => setShowGocharWidget(!showGocharWidget)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs ${
                showGocharWidget ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Current Planetary Transits (Gochar) based on selected city"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ' : currentLang === 'hi' ? 'ग्रह गोचर' : 'Planetary Gochar'}</span>
            </button>

            {/* NEW FEATURE: Moon Phase Visualizer Toggle (Amavasya to Purnima) */}
            <button
              onClick={() => setShowMoonPhaseWidget(!showMoonPhaseWidget)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs ${
                showMoonPhaseWidget ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Moon Phase Visualizer for selected date (Amavasya to Purnima progression)"
            >
              <Moon className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ದರ್ಶನ' : currentLang === 'hi' ? 'चन्द्र दर्शन' : 'Moon Phase'}</span>
            </button>

            {/* NEW FEATURE: Recharts Monthly Trend Line Toggle */}
            <button
              onClick={() => setShowTrendChart(!showTrendChart)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs ${
                showTrendChart ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Monthly trend line for Tithi and Nakshatra influence intensity (Recharts)"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ ರೇಖಾಚಿತ್ರ' : currentLang === 'hi' ? 'मासिक प्रभाव रेखा' : 'Cosmic Trends'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Astro-Diagnostic Banner when enabled */}
      {isAstroDiagnosticActive && (
        <div className="p-4 rounded-2xl bg-stone-900 text-white border-2 border-amber-500/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 font-mono text-xs uppercase tracking-wider">Astro-Diagnostic Mode Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Live Ephemeris</span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Real-time Moon-Sun elongation, astronomical Tithi, Paksha, and Nakshatra logs are displayed beneath every calendar cell.
              </p>
            </div>
          </div>

          {onOpenAstroDiagnostic && (
            <button
              onClick={onOpenAstroDiagnostic}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors shrink-0"
            >
              Open Full Diagnostic Suite
            </button>
          )}
        </div>
      )}

      {/* Recharts Monthly Trend Line Component */}
      {showTrendChart && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono">
                <TrendingUp className="w-4 h-4" />
                <span>RECHARTS DATA VISUALIZATION • MONTHLY INTENSITY FLOW</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                {currentLang === 'kn' 
                  ? `${monthNames[selectedMonth][currentLang]} ಮಾಸದ ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರ ಪ್ರಭಾವ ರೇಖಾಚಿತ್ರ` 
                  : `${monthNames[selectedMonth][currentLang]} Monthly Tithi & Nakshatra Influence Intensity`}
              </h3>
            </div>

            <div className="inline-flex rounded-xl border border-stone-200 dark:border-stone-700 p-1 bg-stone-100 dark:bg-stone-800 text-xs font-bold">
              <button
                onClick={() => setTrendMetric('tithi')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  trendMetric === 'tithi'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರಭಾವ (Lunar Curve)' : 'Tithi Intensity'}
              </button>
              <button
                onClick={() => setTrendMetric('nakshatra')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  trendMetric === 'nakshatra'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ತಾರಾಬಲ (Nakshatra Energy)' : 'Nakshatra Energy'}
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

      {/* NEW FEATURE: Live Dynamic Dashboard Widget (Tithi, Nakshatra, Yoga) */}
      {showDashboardWidget && (
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
      )}

      {/* NEW FEATURE: Visual Moon Phase Component for Selected Date (Amavasya to Purnima) */}
      {showMoonPhaseWidget && (
        <MoonPhaseCalendarWidget
          selectedDay={selectedMoonDay}
          currentLang={currentLang}
        />
      )}

      {/* NEW FEATURE: Current Planetary Transits (Gochar) Dashboard Widget */}
      {showGocharWidget && (
        <GocharTransitsView
          currentLang={currentLang}
          selectedCity={selectedCity}
          onOpenKundali={onOpenKundali}
          isWidget={true}
        />
      )}

      {/* Main Calendar Grid */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-md border border-amber-200/80 dark:border-stone-800 overflow-hidden">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-amber-200/60 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-950/60 text-center">
          {weekDayHeaders.map((head, i) => (
            <div 
              key={i} 
              className={`py-3 text-xs font-bold uppercase tracking-wider ${
                i === 0 ? 'text-red-600 dark:text-red-400' : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              {head[currentLang]}
            </div>
          ))}
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-amber-100/80 dark:divide-stone-800/80 bg-stone-50/30 dark:bg-stone-900/30">
          
          {/* Empty cells for leading days */}
          {Array.from({ length: leadingEmptyDays }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[110px] sm:min-h-[125px] p-2 bg-stone-100/30 dark:bg-stone-950/20 opacity-40 select-none" />
          ))}

          {/* Actual Month Days */}
          {monthDays.map((panchangDay) => {
            const isToday = 
              panchangDay.year === today.getFullYear() &&
              panchangDay.month === today.getMonth() + 1 &&
              panchangDay.day === today.getDate();

            const isSunday = panchangDay.varaIndex === 0;

            return (
              <div
                key={panchangDay.gregorianDate}
                onClick={() => {
                  setSelectedMoonDay(panchangDay);
                  onSelectDay(panchangDay);
                }}
                className={`min-h-[78px] xs:min-h-[92px] sm:min-h-[110px] md:min-h-[125px] p-1 sm:p-2 transition-all relative flex flex-col justify-between cursor-pointer group border-t border-l ${
                  panchangDay.colorTheme
                } ${
                  isToday 
                    ? 'ring-2 ring-amber-500 ring-inset bg-amber-50/60 dark:bg-amber-950/30' 
                    : ''
                }`}
              >
                {/* Cell Top Bar: Gregorian Date with localized & English bracket */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className={`text-sm xs:text-base sm:text-lg font-bold font-serif leading-none ${
                      isToday 
                        ? 'text-amber-700 dark:text-amber-300' 
                        : isSunday 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-stone-800 dark:text-stone-100'
                    }`}>
                      {formatNumberWithEnglishBracket(panchangDay.day, currentLang)}
                    </span>
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                      {panchangDay.paksha === 'Shukla' ? (currentLang === 'kn' ? 'ಶು' : currentLang === 'hi' ? 'शु' : 'Sh') : (currentLang === 'kn' ? 'ಕೃ' : currentLang === 'hi' ? 'कृ' : 'Kr')} {formatJustNumber(panchangDay.tithiNumber, currentLang)}
                    </span>
                  </div>

                  {/* CSS-based Moon Phase (waxing/waning) integrated with Panchanga */}
                  <div className="flex items-center gap-1 shrink-0">
                    <MoonPhaseIcon
                      paksha={panchangDay.paksha}
                      tithiNumber={panchangDay.tithiNumber}
                      size={15}
                      currentLang={currentLang}
                    />
                  </div>
                </div>

                {/* Sanskrit Tithi Name prominently displayed */}
                <div className="my-0.5 sm:my-1 space-y-0.5">
                  <div className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-semibold text-stone-800 dark:text-stone-200 truncate leading-tight">
                    {panchangDay.tithiName[currentLang]}
                  </div>
                  <div className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] text-stone-500 dark:text-stone-400 truncate leading-tight">
                    {panchangDay.nakshatra[currentLang]}
                  </div>
                  <div className="text-[7px] xs:text-[8px] sm:text-[8.5px] font-bold text-amber-700 dark:text-amber-400 truncate leading-tight hidden xs:block">
                    {panchangDay.ritu[currentLang].split('(')[0].trim()}
                  </div>
                </div>

                {/* Festival Tags if any */}
                {panchangDay.festivals.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {/* Special Highlight for Navaratri Day 1: Kalash Sthapana with explicit timing */}
                    {panchangDay.festivals.some(f => f.id === 'navaratri_day1') && (
                      <div className="px-1.5 py-1 rounded-sm bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 text-white font-extrabold text-[8.5px] sm:text-[9.5px] shadow-2xs flex flex-col gap-0.5 border border-amber-300">
                        <div className="flex items-center gap-1">
                          <span>🏺</span>
                          <span className="font-bold truncate">
                            {currentLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'कलश स्थापना मुहूर्त:' : 'Kalash Sthapana:'}
                          </span>
                        </div>
                        <div className="text-[7.5px] sm:text-[8.5px] text-amber-100 font-mono font-bold leading-tight truncate">
                          <span>🌅 {panchangDay.sunrise} - 08:45 AM</span>
                          <span className="block text-yellow-200">☀️ ಅಭಿಜಿತ್: {panchangDay.abhijitMuhurta.start} - {panchangDay.abhijitMuhurta.end}</span>
                        </div>
                      </div>
                    )}
                    {panchangDay.festivals.map(fest => (
                      <button
                        key={fest.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFestival(fest);
                        }}
                        className={`w-full text-left text-[10px] font-bold px-1.5 py-0.5 rounded-sm truncate transition-transform hover:scale-[1.02] border flex items-center gap-1 ${
                          fest.badgeBg
                        }`}
                        title="Click to view Festival Story, Pooja Vidhi & Mantras"
                      >
                        <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{fest.name[currentLang]}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Real-time Tithi & Paksha calculation logs when Astro-Diagnostic is active */}
                {isAstroDiagnosticActive && (
                  <div className="mt-1 px-1 py-0.5 rounded bg-stone-900/95 text-amber-300 font-mono text-[7px] sm:text-[8px] leading-tight border border-amber-500/40 shadow-xs">
                    <span className="font-bold text-yellow-300">{panchangDay.paksha === 'Shukla' ? 'Shukla' : 'Krishna'}</span> T{panchangDay.tithiNumber}
                    <div className="truncate text-stone-300">N{panchangDay.nakshatraIndex} P{panchangDay.pada}</div>
                  </div>
                )}

                {/* Quick daily timings preview: Sunrise / Rahu Kaal icon */}
                <div className="mt-auto pt-1 flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500 font-mono">
                  <span title={`Suryodaya: ${panchangDay.sunrise}`}>
                    🌅 {panchangDay.sunrise.split(' ')[0]}
                  </span>
                  <span title={`Rahu Kaal: ${panchangDay.rahuKaal.start} - ${panchangDay.rahuKaal.end}`} className="text-amber-600 dark:text-amber-400 font-semibold">
                    RK
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Festivals Section Below Calendar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-amber-200/80 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base sm:text-lg">
              {currentLang === 'kn' ? 'ಈ ತಿಂಗಳ ಪ್ರಮುಖ ಹಬ್ಬಗಳು ಮತ್ತು ವ್ರತಗಳು' : currentLang === 'hi' ? 'इस माह के प्रमुख पर्व एवं व्रत' : 'Significant Festivals & Observances this Month'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            {formatJustNumber(monthlyFestivals.length, currentLang)} {currentLang === 'kn' ? 'ಹಬ್ಬಗಳು' : currentLang === 'hi' ? 'त्योहार' : 'Events'}
          </span>
        </div>

        {monthlyFestivals.length === 0 ? (
          <p className="text-xs text-stone-500 dark:text-stone-400 italic py-2">
            {currentLang === 'kn' 
              ? 'ಈ ತಿಂಗಳಲ್ಲಿ ನಿತ್ಯ ಪೂಜೆ, ಪ್ರದೋಷ, ಏಕಾದಶಿ ಹಾಗೂ ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ವ್ರತಗಳನ್ನು ದಿನದ ವಿವರಗಳಲ್ಲಿ ಕಾಣಬಹುದು.' 
              : currentLang === 'hi'
              ? 'इस माह के नित्य नियम, एकादशी व प्रदोष व्रत दैनिक विवरण में देखें।'
              : 'Regular Ekadashi, Pradosha, and Sankashti observances are detailed inside daily views.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {monthlyFestivals.map(({ festival, dayNum }) => (
              <div
                key={festival.id}
                onClick={() => onSelectFestival(festival)}
                className="group p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 bg-amber-50/20 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 transition-all cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: festival.tagColor }} 
                    />
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {festival.name[currentLang]}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 shrink-0">
                    Day {formatJustNumber(dayNum, currentLang)}
                  </span>
                </div>
                
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 line-clamp-2">
                  {festival.shortDesc[currentLang]}
                </p>

                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                  <span>
                    {currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಾನ ಮತ್ತು ಕಥೆ ನೋಡಿ →' : currentLang === 'hi' ? 'पूजा विधि व कथा देखें →' : 'View Puja Vidhi & Katha →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* THREE PROMINENT BOTTOM BUTTONS AS EXPLICITLY REQUESTED */}
      <div className="pt-2">
        <div className="text-center mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400">
            {currentLang === 'kn' ? 'ಮುಖ್ಯ ವೈದಿಕ ಪರಿಕರಗಳು' : currentLang === 'hi' ? 'मुख्य वैदिक अनुभाग' : 'Sacred Vedic Portals'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Button 1: Mantras */}
          <button
            onClick={onOpenMantras}
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all text-left border border-amber-400/30"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <Sparkles className="w-6 h-6" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold">
                MANTRAMALA
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold tracking-tight">
              {currentLang === 'kn' ? 'ಮಂತ್ರಗಳು (Mantras)' : currentLang === 'hi' ? 'मन्त्र माला (Mantras)' : 'Mantras Library'}
            </h3>
            <p className="text-xs text-amber-100 mt-1 leading-relaxed">
              {currentLang === 'kn'
                ? 'ವೇದ ಸೂಕ್ತಗಳು, ಸ್ತೋತ್ರಗಳು, ನಿಮ್ಮದೇ ಮಂತ್ರ ಲಿಂಕ್‌ಗಳು ಮತ್ತು ಎಚ್‌ಸಿಎಂಎಂ ಕೋಡ್ ಆಯ್ಕೆ.'
                : currentLang === 'hi'
                ? 'वैदिक सूक्त, स्तोत्र, आपके अपने मन्त्र लिंक एवं एचसीएमएम कोड विकल्प।'
                : 'Vedic hymns, stotras, custom user mantra links, and HCMM embed options.'}
            </p>
          </button>

          {/* Button 2: Sankalpa Vidhi */}
          <button
            onClick={onOpenSankalpa}
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all text-left border border-rose-400/30"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <BookOpen className="w-6 h-6" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold">
                PDF VIDHANA
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold tracking-tight">
              {currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ವಿಧಿ (Sankalpa Vidhi)' : currentLang === 'hi' ? 'संकल्प विधि (Sankalpa Vidhi)' : 'Sankalpa Vidhi'}
            </h3>
            <p className="text-xs text-rose-100 mt-1 leading-relaxed">
              {currentLang === 'kn'
                ? 'ದಿನಾಂಕ ಆಧಾರಿತ ೨-೯ ಸ್ವಯಂಚಾಲಿತ ನೀಲಿ ವಿವರಗಳು, ೬೦ ಸಂವತ್ಸರ, ಪಂಚಪೀಠ ಪ್ರವರ ಮತ್ತು ಪಿಡಿಎಫ್ ರಫ್ತು.'
                : currentLang === 'hi'
                ? 'तिथि अनुसार २-९ स्वतः नीले रंग में प्रविष्ट विवरण, ६० संवत्सर, पंचपीठ प्रवर व पीडीएफ निर्यात।'
                : 'Auto date-populated blue dashed details (2-9), 60 Samvatsaras, Panchapeetha, and PDF export.'}
            </p>
          </button>

          {/* Button 3: Lagna Kundali */}
          <button
            onClick={onOpenKundali}
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-700 via-purple-700 to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all text-left border border-indigo-400/30"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                <Layers className="w-6 h-6" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold">
                VEDIC CHART
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold tracking-tight">
              {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ (Lagna Kundali)' : currentLang === 'hi' ? 'लग्न कुण्डली (Lagna Kundali)' : 'Lagna Kundali'}
            </h3>
            <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
              {currentLang === 'kn'
                ? 'ಉತ್ತರ/ದಕ್ಷಿಣ ಭಾರತ ಶೈಲಿಯ ಡೈಮಂಡ್ ಕುಂಡಲಿ, ನವಗ್ರಹ ಸ್ಥಿತಿ, ರಾಹು/ಗುಳಿಕ ಕಾಲ ಮತ್ತು ಡಾರ್ಕ್ ಮೋಡ್.'
                : currentLang === 'hi'
                ? 'उत्तर/दक्षिण भारतीय शैली डायमण्ड कुण्डली, नवग्रह स्थिति, राहु/गुलिक काल एवं डार्क मोड।'
                : 'North/South Indian diamond style birth chart, planetary positions, Rahu Kaal alerts & dark mode.'}
            </p>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MONTHLY OVERVIEW MODAL (Consolidated Tithis, Nakshatras & Auspicious Days) */}
      {/* ========================================================================= */}
      {showMonthlyOverview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-amber-200/80 dark:border-stone-700 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
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
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{currentLang === 'kn' ? 'ಮುದ್ರಿಸಿ' : currentLang === 'hi' ? 'प्रिंट' : 'Print'}</span>
                </button>
                <button
                  onClick={() => setShowMonthlyOverview(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
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
                              className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[11px]"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE MONTHLY CALENDAR CONTAINER (Visible only during PDF Print) */}
      {/* ========================================================================= */}
      <div 
        id="printable-month-calendar" 
        className="hidden print:block text-black bg-white p-6 space-y-4 font-sans"
      >
        <div className="border-b-2 border-stone-800 pb-3 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-serif font-extrabold text-stone-900 tracking-tight">
              HCMM VEDIC PANCHANGA CALENDAR
            </h1>
            <p className="text-xs font-serif font-semibold text-stone-700 mt-0.5">
              {currentMonthName} {selectedYear} • {samvatsaraName} ಸಂವತ್ಸರ • {masaName} ಮಾಸ ({currentMonthPanchangaSample.ayana[currentLang]})
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">📍 {getLocalizedPlaceName(selectedCity, currentLang)}</p>
            <p className="text-[11px] text-stone-600">ಶಾಲಿವಾಹನ ಶಕ: {currentMonthPanchangaSample.hinduYearSaka}</p>
          </div>
        </div>

        {/* Printable Month Table */}
        <table className="w-full border-collapse border border-stone-400 text-xs">
          <thead>
            <tr className="bg-stone-100 text-stone-900 border-b border-stone-400 font-bold">
              <th className="border border-stone-300 p-1.5 text-center w-12">ದಿನಾಂಕ</th>
              <th className="border border-stone-300 p-1.5 text-left w-20">ವಾರ</th>
              <th className="border border-stone-300 p-1.5 text-left">ತಿಥಿ & ಪಕ್ಷ</th>
              <th className="border border-stone-300 p-1.5 text-left">ನಕ್ಷತ್ರ (ಅಕ್ಷರ)</th>
              <th className="border border-stone-300 p-1.5 text-left w-24">ರಾಹು ಕಾಲ</th>
              <th className="border border-stone-300 p-1.5 text-left">ವಿಶೇಷ ಹಬ್ಬಗಳು / ಆಚರಣೆಗಳು</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300">
            {monthDays.map((d) => (
              <tr key={d.gregorianDate} className={d.festivals.length > 0 ? 'bg-amber-50/70 font-semibold' : ''}>
                <td className="border border-stone-300 p-1.5 text-center font-bold">{d.day}</td>
                <td className="border border-stone-300 p-1.5">{d.vara[currentLang].split(' ')[0]}</td>
                <td className="border border-stone-300 p-1.5">
                  <span>{d.tithiName[currentLang]}</span>
                  <span className="text-[10px] text-stone-500 ml-1">({d.paksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'})</span>
                </td>
                <td className="border border-stone-300 p-1.5">
                  {d.nakshatra[currentLang].split('(')[0].trim()} ({d.charanaLetter})
                </td>
                <td className="border border-stone-300 p-1.5 font-mono text-[11px]">{d.rahuKaal.start}-{d.rahuKaal.end}</td>
                <td className="border border-stone-300 p-1.5 text-amber-900 font-bold">
                  {d.festivals.map(f => f.name[currentLang]).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Note */}
        <div className="pt-2 border-t border-stone-400 flex justify-between text-[10px] text-stone-500">
          <span>Authentic Astrological Sidereal Calculations • HCMM Vedic Panchanga</span>
          <span>Printed on: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

    </div>
  );
};
