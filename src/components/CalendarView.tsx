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
  X,
  Volume2,
  Copy,
  RefreshCw,
  Check
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
import { MoonPhaseIcon } from './MoonPhaseIcon';
import { NavaratriColorsFeature } from './NavaratriColorsFeature';
import { NavaratriRitualsModal } from './NavaratriRitualsModal';
import { AstroDetailWindows } from './AstroDetailWindows';
import { InlineDayDetailPanel } from './InlineDayDetailPanel';
import { Activity } from 'lucide-react';
import { 
  fetchDailyAstrologicalTip, 
  speakAstrologicalTip, 
  DailyInsightResponse 
} from '../utils/geminiDailyInsights';

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
  onOpenNavaratriRituals?: (dayNumber?: number, tab?: 'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami') => void;
  onOpenGoogleMap?: () => void;
  onOpenBhavishya?: () => void;
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
  onOpenAstroDiagnostic,
  onOpenNavaratriRituals,
  onOpenGoogleMap,
  onOpenBhavishya
}) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth()); // 0-11
  const [showTrendChart, setShowTrendChart] = useState<boolean>(false);
  const [trendMetric, setTrendMetric] = useState<'tithi' | 'nakshatra'>('tithi');
  const [showNavaratriRitualsModal, setShowNavaratriRitualsModal] = useState<boolean>(false);
  const [ritualsModalTab, setRitualsModalTab] = useState<'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami'>('kalasha');
  const [ritualsModalDayNum, setRitualsModalDayNum] = useState<number>(1);

  // Today's Panchanga calculation for Daily Insights
  const todayPanchangaDay = useMemo(() => getPanchangaForDate(today, selectedCity), [selectedCity]);
  const [dailyInsight, setDailyInsight] = useState<DailyInsightResponse | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<boolean>(false);
  const [copiedTip, setCopiedTip] = useState<boolean>(false);
  const [isSpeakingTip, setIsSpeakingTip] = useState<boolean>(false);

  // Inline Details State: Shows full details below the clicked button/cell instead of middle popup
  const [inlineSelectedDay, setInlineSelectedDay] = useState<PanchangaDay | null>(null);
  const [inlineSelectedFestival, setInlineSelectedFestival] = useState<Festival | null>(null);
  const [inlineActiveTab, setInlineActiveTab] = useState<'panchanga' | 'moonGowri' | 'rituals' | 'festivalDetail' | 'dasha'>('panchanga');
  const [inlineAnchor, setInlineAnchor] = useState<'quickToday' | 'grid' | 'festivalsList' | null>(null);

  const handleDayClick = (dayObj: PanchangaDay, anchor: 'quickToday' | 'grid' | 'festivalsList' = 'grid') => {
    setInlineSelectedDay(dayObj);
    setInlineSelectedFestival(dayObj.festivals.length > 0 ? dayObj.festivals[0] : null);
    setInlineActiveTab(dayObj.festivals.length > 0 ? 'festivalDetail' : 'panchanga');
    setInlineAnchor(anchor);
    setTimeout(() => {
      const el = document.getElementById(`inline-anchor-${anchor}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const handleFestivalClick = (fest: Festival, dayObj: PanchangaDay, anchor: 'quickToday' | 'grid' | 'festivalsList' = 'grid') => {
    setInlineSelectedDay(dayObj);
    setInlineSelectedFestival(fest);
    setInlineActiveTab('festivalDetail');
    setInlineAnchor(anchor);
    setTimeout(() => {
      const el = document.getElementById(`inline-anchor-${anchor}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  useEffect(() => {
    let isMounted = true;
    const loadInsight = async () => {
      setIsGeneratingInsight(true);
      try {
        const result = await fetchDailyAstrologicalTip({
          tithiName: todayPanchangaDay.tithiName?.[currentLang] || todayPanchangaDay.tithiName?.en || '',
          tithiPaksha: todayPanchangaDay.pakshaName?.[currentLang] || todayPanchangaDay.paksha || 'Shukla',
          nakshatraName: todayPanchangaDay.nakshatra?.[currentLang] || todayPanchangaDay.nakshatra?.en || '',
          padaNumber: todayPanchangaDay.pada,
          rashiName: todayPanchangaDay.chandraRashi?.[currentLang] || todayPanchangaDay.chandraRashi?.en || '',
          dateStr: todayPanchangaDay.gregorianDate,
          language: currentLang
        });
        if (isMounted) {
          setDailyInsight(result);
        }
      } catch (err) {
        console.error('Error fetching calendar daily insight:', err);
      } finally {
        if (isMounted) {
          setIsGeneratingInsight(false);
        }
      }
    };
    loadInsight();
    return () => {
      isMounted = false;
    };
  }, [todayPanchangaDay.gregorianDate, currentLang]);

  const handleRegenerateInsight = async () => {
    if (isGeneratingInsight) return;
    setIsGeneratingInsight(true);
    try {
      const result = await fetchDailyAstrologicalTip({
        tithiName: todayPanchangaDay.tithiName?.[currentLang] || todayPanchangaDay.tithiName?.en || '',
        tithiPaksha: todayPanchangaDay.pakshaName?.[currentLang] || todayPanchangaDay.paksha || 'Shukla',
        nakshatraName: todayPanchangaDay.nakshatra?.[currentLang] || todayPanchangaDay.nakshatra?.en || '',
        padaNumber: todayPanchangaDay.pada,
        rashiName: todayPanchangaDay.chandraRashi?.[currentLang] || todayPanchangaDay.chandraRashi?.en || '',
        dateStr: todayPanchangaDay.gregorianDate,
        language: currentLang
      }, true);
      setDailyInsight(result);
    } catch (err) {
      console.error('Error regenerating daily insight:', err);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleCopyTip = () => {
    if (!dailyInsight?.tip) return;
    navigator.clipboard.writeText(dailyInsight.tip);
    setCopiedTip(true);
    setTimeout(() => setCopiedTip(false), 2000);
  };

  const handleSpeakTip = () => {
    if (!dailyInsight?.tip) return;
    setIsSpeakingTip(true);
    speakAstrologicalTip(dailyInsight.tip, currentLang);
    setTimeout(() => setIsSpeakingTip(false), 4000);
  };

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
  const { monthDays, leadingEmptyDays, trailingEmptyDays, currentMonthPanchangaSample } = useMemo(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const leadingEmpty = firstDayOfMonth.getDay(); // 0 is Sunday
    const trailingEmpty = (7 - ((leadingEmpty + daysInMonth) % 7)) % 7;

    const days: PanchangaDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      days.push(getPanchangaForDate(dateObj, selectedCity));
    }

    const sample = days[Math.min(14, days.length - 1)] || getPanchangaForDate(firstDayOfMonth, selectedCity);

    return {
      monthDays: days,
      leadingEmptyDays: leadingEmpty,
      trailingEmptyDays: trailingEmpty,
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
  const [expandedPortal, setExpandedPortal] = useState<'mantras' | 'sankalpa' | 'kundali' | null>(null);
  const [showGocharWidget, setShowGocharWidget] = useState<boolean>(true);
  const [showDashboardWidget, setShowDashboardWidget] = useState<boolean>(true);
  const [showMoonPhaseWidget, setShowMoonPhaseWidget] = useState<boolean>(true);
  const [showNavaratriColors, setShowNavaratriColors] = useState<boolean>(false);
  const [showMonthSpecialFestivals, setShowMonthSpecialFestivals] = useState<boolean>(false);
  const [selectedMoonDay, setSelectedMoonDay] = useState<PanchangaDay>(() => {
    return getPanchangaForDate(today, selectedCity);
  });

  // Accurate check if current month has Navaratri / Dasera festivals
  const isNavaratriMonth = useMemo(() => {
    return monthDays.some(d =>
      d.festivals && d.festivals.some(f =>
        f.id.startsWith('navaratri_day') ||
        f.id.includes('navaratri') ||
        f.isNavaratri ||
        f.id === 'vijayadashami'
      )
    );
  }, [monthDays]);

  // If navigated to non-Navaratri month, automatically close Navaratri colors
  useEffect(() => {
    if (!isNavaratriMonth && showNavaratriColors) {
      setShowNavaratriColors(false);
    }
  }, [isNavaratriMonth, showNavaratriColors]);

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
              <button
                onClick={onOpenGoogleMap}
                className="font-mono text-amber-200 hover:text-white bg-black/25 hover:bg-black/45 px-2.5 py-0.5 rounded-lg border border-amber-300/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Click to open Google Maps Place Selector or Auto-GPS"
              >
                <span>📍 {getLocalizedPlaceName(selectedCity, currentLang)}</span>
                <span className="text-[11px] text-amber-300 font-sans hidden sm:inline">🌅 {currentMonthPanchangaSample.sunrise} • 🌇 {currentMonthPanchangaSample.sunset}</span>
                <span className="text-[9px] bg-amber-500/30 text-amber-100 px-1 py-0.2 rounded font-sans uppercase font-bold">Map</span>
              </button>
            </div>
          </div>

          {/* Month / Year Navigator Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenBhavishya && (
              <button
                onClick={onOpenBhavishya}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="View Daily Rashi Bhavishya & Planetary Transits"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                <span>{currentLang === 'kn' ? 'ರಾಶಿ ಭವಿಷ್ಯ' : currentLang === 'hi' ? 'राशिफल' : 'Daily Horoscope'}</span>
              </button>
            )}

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

            {/* Conditional Navaratri Controls vs Month's Special Festivals */}
            {isNavaratriMonth ? (
              <>
                {/* Navaratri 9 Colors Feature Toggle */}
                <button
                  onClick={() => setShowNavaratriColors(!showNavaratriColors)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs cursor-pointer ${
                    showNavaratriColors 
                      ? 'bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 text-white font-extrabold ring-2 ring-amber-300' 
                      : 'bg-gradient-to-r from-rose-600/90 to-amber-600/90 hover:from-rose-600 hover:to-amber-600 text-white hover:shadow-lg'
                  }`}
                  title="Specific auspicious colors for each of the nine days of Navaratri"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>{currentLang === 'kn' ? '🎨 ನವರಾತ್ರಿ ಬಣ್ಣಗಳು' : currentLang === 'hi' ? '🎨 नवरात्रि रंग' : '🎨 Navaratri Colors'}</span>
                </button>

                {/* Navaratri Sacred Rituals Hub Button */}
                <button
                  onClick={() => {
                    if (onOpenNavaratriRituals) {
                      onOpenNavaratriRituals(1, 'kalasha');
                    } else {
                      setRitualsModalTab('kalasha');
                      setRitualsModalDayNum(1);
                      setShowNavaratriRitualsModal(true);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs cursor-pointer bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-700 hover:to-orange-700 text-white hover:shadow-lg border border-amber-300/60"
                  title="Comprehensive Navaratri Rituals, Kalasa Sthapana, Kushmanda Bali & Ayudha Puja"
                >
                  <span className="text-sm">🌺</span>
                  <span>{currentLang === 'kn' ? 'ನವರಾತ್ರಿ ಪೂಜಾ ವಿಧಿಗಳು' : currentLang === 'hi' ? 'नवरात्रि पूजा विधान' : 'Navaratri Rituals'}</span>
                </button>
              </>
            ) : (
              /* Month's Special Festivals Button for all other months */
              <button
                onClick={() => setShowMonthSpecialFestivals(!showMonthSpecialFestivals)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center gap-1.5 ml-1 backdrop-blur-xs cursor-pointer ${
                  showMonthSpecialFestivals
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-extrabold ring-2 ring-amber-300'
                    : 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-lg border border-amber-300/60'
                }`}
                title={`Special festivals and sacred rituals for ${currentMonthName}`}
              >
                <span className="text-sm">🌺</span>
                <span>
                  {currentLang === 'kn' 
                    ? `${currentMonthName} ವಿಶೇಷ ಹಬ್ಬಗಳು (${monthlyFestivals.length})` 
                    : currentLang === 'hi' 
                    ? `${currentMonthName} विशेष त्यौहार (${monthlyFestivals.length})` 
                    : `${currentMonthName} Special Festivals (${monthlyFestivals.length})`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMonthSpecialFestivals ? 'rotate-180' : ''}`} />
              </button>
            )}
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

      {/* ========================================================================= */}
      {/* DAILY INSIGHTS (GEMINI AI ASTROLOGICAL GUIDANCE) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-stone-900 border-2 border-indigo-500/40 p-4 sm:p-5 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Ambient celestial glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Bar: Title & AI Model Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-indigo-400/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-400 to-indigo-500 text-stone-950 shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wide">
                    {currentLang === 'kn' ? 'ದೈನಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟ' : currentLang === 'hi' ? 'दैनिक ज्योतिषीय परामर्श' : 'Daily Astrological Insights'}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                    {dailyInsight?.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Vedic Muhurtha Shastra'}
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  {currentLang === 'kn'
                    ? 'ಇಂದಿನ ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರದ ಗ್ರಹಗತಿಗೆ ಅನುಗುಣವಾದ ದೈನಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ'
                    : currentLang === 'hi'
                    ? 'आज की तिथि एवं नक्षत्र के आधार पर पावन ज्योतिषीय मार्गदर्शन'
                    : "Today's personalized Vedic astrological tip based on active Tithi & Nakshatra"}
                </p>
              </div>
            </div>

            {/* Quick Actions: Audio, Copy, Regenerate, View Today's Modal */}
            <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
              <button
                type="button"
                onClick={handleSpeakTip}
                disabled={!dailyInsight?.tip || isSpeakingTip}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSpeakingTip
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-indigo-400/30 hover:border-indigo-300'
                }`}
                title="Read tip aloud with natural speech"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಆಲಿಸಿ' : currentLang === 'hi' ? 'सुने' : 'Listen'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTip}
                disabled={!dailyInsight?.tip}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 border border-indigo-400/30 hover:border-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy tip to clipboard"
              >
                {copiedTip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTip ? (currentLang === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'Copied') : (currentLang === 'kn' ? 'ನಕಲಿಸಿ' : 'Copy')}</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateInsight}
                disabled={isGeneratingInsight}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 hover:border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Regenerate with Gemini AI"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingInsight ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಮರುರಚಿಸಿ' : currentLang === 'hi' ? 'पुनः बनाएँ' : 'Regenerate'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDayClick(todayPanchangaDay, 'quickToday')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-1"
                title="Open detailed Day View with Timeline, Rituals & Muhurta below"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಇಂದಿನ ವಿವರ' : currentLang === 'hi' ? 'आज का विवरण' : "View Today's Details"}</span>
              </button>
            </div>
          </div>

          {/* Alignment Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-medium px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
              <span>🌙</span>
              <span>
                {currentLang === 'kn' ? 'ತಿಥಿ:' : currentLang === 'hi' ? 'तिथि:' : 'Tithi:'} {todayPanchangaDay.tithiName?.[currentLang] || todayPanchangaDay.tithiName?.en} ({todayPanchangaDay.pakshaName?.[currentLang] || todayPanchangaDay.paksha})
              </span>
            </span>
            <span className="font-medium px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <span>✨</span>
              <span>
                {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : currentLang === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'} {todayPanchangaDay.nakshatra?.[currentLang] || todayPanchangaDay.nakshatra?.en} {todayPanchangaDay.pada ? `(${currentLang === 'kn' ? 'ಪಾದ' : 'Pada'} ${todayPanchangaDay.pada})` : ''}
              </span>
            </span>
            {todayPanchangaDay.chandraRashi && (
              <span className="font-medium px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <span>🪐</span>
                <span>
                  {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ:' : currentLang === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'} {todayPanchangaDay.chandraRashi?.[currentLang] || todayPanchangaDay.chandraRashi?.en}
                </span>
              </span>
            )}
          </div>

          {/* Tip Display Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-indigo-400/25 shadow-inner">
            {isGeneratingInsight ? (
              <div className="flex items-center gap-3 py-2 text-indigo-200 animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span className="text-sm font-medium">
                  {currentLang === 'kn'
                    ? 'ಜೆಮಿನಿ ಎಐ ಇಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                    : currentLang === 'hi'
                    ? 'जेमिनी एआई द्वारा आज का ज्योतिषीय परामर्श तैयार किया जा रहा है...'
                    : "Gemini AI is analyzing today's celestial alignments..."}
                </span>
              </div>
            ) : dailyInsight?.tip ? (
              <p className="font-serif text-sm sm:text-base leading-relaxed text-stone-100 italic">
                "{dailyInsight.tip}"
              </p>
            ) : (
              <p className="text-sm text-stone-400">
                {currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.' : 'Astrological guidance unavailable.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Inline Day Details anchored directly below Quick Today Card */}
      <div id="inline-anchor-quickToday">
        {inlineSelectedDay && inlineAnchor === 'quickToday' && (
          <InlineDayDetailPanel
            day={inlineSelectedDay}
            festival={inlineSelectedFestival}
            currentLang={currentLang}
            initialTab={inlineActiveTab}
            onClose={() => {
              setInlineSelectedDay(null);
              setInlineAnchor(null);
            }}
            onOpenDasha={onOpenKundali}
          />
        )}
      </div>



      {/* NAVARATRI 9 COLORS FEATURE (Shown ONLY during Navaratri Month when toggled) */}
      {isNavaratriMonth && showNavaratriColors && (
        <NavaratriColorsFeature
          currentLang={currentLang}
          selectedYear={selectedYear}
          selectedCity={selectedCity}
          onSelectDayDate={(dateStr) => {
            const dt = new Date(dateStr);
            const foundDay = getPanchangaForDate(dt, selectedCity);
            setSelectedMoonDay(foundDay);
            onSelectDay(foundDay);
          }}
          onSelectFestival={onSelectFestival}
          onClose={() => setShowNavaratriColors(false)}
        />
      )}

      {/* MONTH'S SPECIAL FESTIVALS & RITUALS (Shown on non-Navaratri months when toggled) */}
      {!isNavaratriMonth && showMonthSpecialFestivals && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-stone-900 dark:to-stone-950 p-5 rounded-2xl border-2 border-amber-300/80 dark:border-amber-600/50 shadow-xl transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-amber-200/80 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 text-lg">
                🌺
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{currentMonthName} {selectedYear}</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-semibold">
                    {masaName} {currentLang === 'kn' ? 'ಮಾಸದ ವಿಶೇಷ ಹಬ್ಬಗಳು' : currentLang === 'hi' ? 'मास के विशेष पर्व' : 'Special Festivals'}
                  </span>
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {currentLang === 'kn'
                    ? 'ಈ ಮಾಸದ ಪವಿತ್ರ ಹಬ್ಬಗಳು, ಪೂಜಾ ವಿಧಾನಗಳು, ಪೌರಾಣಿಕ ಕಥೆಗಳು ಮತ್ತು ಮಂತ್ರಗಳು'
                    : currentLang === 'hi'
                    ? 'इस मास के पावन व्रत-त्यौहार, पूजा विधि, कथा एवं वैदिक मन्त्र'
                    : 'Sacred festivals, step-by-step Puja Vidhi, Puranic Katha, and Vedic mantras for this month'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMonthSpecialFestivals(false)}
              className="p-1.5 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-500 transition-colors"
              title="Close Special Festivals"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {monthlyFestivals.length === 0 ? (
            <div className="py-8 text-center text-stone-600 dark:text-stone-400">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {currentLang === 'kn'
                  ? 'ಈ ತಿಂಗಳಲ್ಲಿ ನಿತ್ಯ ಪೂಜೆ, ಶುಕ್ಲ/ಕೃಷ್ಣ ಏಕಾದಶಿ, ಪ್ರದೋಷ ಮತ್ತು ಅಮಾವಾಸ್ಯೆ/ಹುಣ್ಣಿಮೆ ಮುಖ್ಯ ಆಚರಣೆಗಳು.'
                  : currentLang === 'hi'
                  ? 'इस मास में नित्य पूजा, शुक्ल/कृष्ण एकादशी, प्रदोष एवं अमावस्या/पूर्णिमा मुख्य धार्मिक पर्व हैं।'
                  : 'This month focuses on sacred Vedic Nitya Aradhana, Shukla & Krishna Ekadashis, Pradosha Vrata, and Amavasya/Purnima.'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {currentLang === 'kn'
                  ? 'ದೈನಂದಿನ ತಿಥಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಮುಹೂರ್ತಗಳನ್ನು ಕ್ಯಾಲೆಂಡರ್ ಕೋಶಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ವೀಕ್ಷಿಸಿ.'
                  : 'Click on any calendar day cell to view complete Tithi entry-exit timings and muhurtas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {monthlyFestivals.map((item) => (
                <div
                  key={item.festival.id}
                  className="bg-white dark:bg-stone-900 rounded-xl p-4 sm:p-5 border border-amber-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 border-b border-amber-100 dark:border-stone-800 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 font-mono">
                            📅 {item.dateStr}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            Day {formatJustNumber(item.dayNum, currentLang)}
                          </span>
                        </div>

                        <h4 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                          {item.festival.name[currentLang] || item.festival.name.en}
                        </h4>
                        {item.festival.name.kn && currentLang !== 'kn' && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-serif mt-0.5">
                            {item.festival.name.kn}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectFestival(item.festival)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{currentLang === 'kn' ? 'ಪೂಜಾ ವಿವರ' : currentLang === 'hi' ? 'पूजा विवरण' : 'Ritual Guide'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 mb-3 leading-relaxed">
                      {item.festival.shortDesc?.[currentLang] || item.festival.shortDesc?.en}
                    </p>

                    {item.festival.story && (
                      <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/50 dark:border-stone-700/60 mb-2.5 text-xs">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                          📜 {currentLang === 'kn' ? 'ಪೌರಾಣಿಕ ಕಥೆ' : currentLang === 'hi' ? 'पौराणिक कथा' : 'Puranic Story'}:
                        </span>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                          {item.festival.story[currentLang] || item.festival.story.en}
                        </p>
                      </div>
                    )}

                    {item.festival.poojaVidhi && item.festival.poojaVidhi.length > 0 && (
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 mb-2.5 text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                          🪔 {currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಾನ' : currentLang === 'hi' ? 'पूजा विधान' : 'Puja Vidhi Highlights'}:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-300">
                          {item.festival.poojaVidhi.slice(0, 2).map((v, vIdx) => (
                            <li key={vIdx} className="line-clamp-2">{v[currentLang] || v.en}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.festival.mantras && item.festival.mantras.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-red-50/40 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-xs">
                        <span className="font-bold text-red-800 dark:text-red-400 block mb-0.5">
                          🕉️ {currentLang === 'kn' ? 'ಪ್ರಧಾನ ಮಂತ್ರ' : currentLang === 'hi' ? 'प्रधान मन्त्र' : 'Main Mantra'}:
                        </span>
                        <p className="font-mono text-red-900 dark:text-red-200 italic line-clamp-2">
                          {item.festival.mantras[0][currentLang] || item.festival.mantras[0].en}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                    <span>
                      {item.festival.poojaSamagri ? `🧺 ${item.festival.poojaSamagri.length} ${currentLang === 'kn' ? 'ಸಾಮಗ್ರಿಗಳು' : currentLang === 'hi' ? 'सामग्रियां' : 'Samagri items'}` : ''}
                    </span>
                    <button
                      onClick={() => onSelectFestival(item.festival)}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ವಿವರ ನೋಡಿ →' : currentLang === 'hi' ? 'पूर्ण विवरण देखें →' : 'View Full Details →'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXACTLY ABOVE THE CALENDAR: ASTRONOMICAL DETAIL WINDOWS (IMAGE_F73DD85D)   */}
      {/* ========================================================================= */}
      <AstroDetailWindows
        currentLang={currentLang}
        selectedCity={selectedCity}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        currentMonthName={currentMonthName}
        samvatsaraName={samvatsaraName}
        masaName={masaName}
        monthDays={monthDays}
        monthlyHighlights={monthlyHighlights}
        monthlyTrendData={monthlyTrendData}
        showMonthlyOverview={showMonthlyOverview}
        setShowMonthlyOverview={setShowMonthlyOverview}
        showDashboardWidget={showDashboardWidget}
        setShowDashboardWidget={setShowDashboardWidget}
        showGocharWidget={showGocharWidget}
        setShowGocharWidget={setShowGocharWidget}
        showMoonPhaseWidget={showMoonPhaseWidget}
        setShowMoonPhaseWidget={setShowMoonPhaseWidget}
        showTrendChart={showTrendChart}
        setShowTrendChart={setShowTrendChart}
        trendMetric={trendMetric}
        setTrendMetric={setTrendMetric}
        selectedMoonDay={selectedMoonDay}
        setSelectedMoonDay={setSelectedMoonDay}
        onSelectDay={onSelectDay}
        onSelectFestival={onSelectFestival}
        onOpenKundali={onOpenKundali}
        onOpenMantras={onOpenMantras}
        onOpenSankalpa={onOpenSankalpa}
      />

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

        {/* Calendar Cells Grid: Balanced Grid maintaining consistent aspect ratios across screen sizes */}
        <div className="grid grid-cols-7 divide-x divide-y divide-amber-100/80 dark:divide-stone-800/80 bg-stone-50/30 dark:bg-stone-900/30">
          
          {/* Empty cells for leading days */}
          {Array.from({ length: leadingEmptyDays }).map((_, i) => (
            <div
              key={`empty-lead-${i}`}
              className="aspect-square sm:aspect-[1/1.05] p-1 sm:p-1.5 bg-stone-100/30 dark:bg-stone-950/20 opacity-40 select-none border-t border-l"
            />
          ))}

          {/* Actual Month Days */}
          {monthDays.map((panchangDay) => {
            const isToday = 
              panchangDay.year === today.getFullYear() &&
              panchangDay.month === today.getMonth() + 1 &&
              panchangDay.day === today.getDate();

            const isSunday = panchangDay.varaIndex === 0;
            const hasFestivals = panchangDay.festivals.length > 0;

            return (
              <div
                key={panchangDay.gregorianDate}
                onClick={() => {
                  setSelectedMoonDay(panchangDay);
                  handleDayClick(panchangDay, 'grid');
                }}
                className={`min-h-[110px] xs:min-h-[120px] sm:min-h-[135px] md:min-h-[150px] p-1 sm:p-1.5 transition-all relative flex flex-col justify-between cursor-pointer group border-t border-l ${
                  panchangDay.colorTheme
                } ${
                  isToday 
                    ? 'ring-2 ring-amber-500 ring-inset bg-amber-50/70 dark:bg-amber-950/40' 
                    : hasFestivals
                    ? 'ring-1.5 ring-amber-400/80 bg-amber-50/40 dark:bg-amber-950/25 shadow-xs'
                    : ''
                }`}
              >
                {/* Cell Top Bar: Gregorian Date with localized & English bracket */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-bold font-serif leading-none ${
                      isToday 
                        ? 'text-amber-700 dark:text-amber-300' 
                        : isSunday 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-stone-800 dark:text-stone-100'
                    }`}>
                      {formatNumberWithEnglishBracket(panchangDay.day, currentLang)}
                    </span>
                    <span className="text-[7px] xs:text-[7.5px] sm:text-[9px] font-medium text-stone-500 dark:text-stone-400 mt-0.5 leading-none">
                      {panchangDay.paksha === 'Shukla' ? (currentLang === 'kn' ? 'ಶು' : currentLang === 'hi' ? 'शु' : 'Sh') : (currentLang === 'kn' ? 'ಕೃ' : currentLang === 'hi' ? 'कृ' : 'Kr')} {formatJustNumber(panchangDay.tithiNumber, currentLang)}
                    </span>
                  </div>

                  {/* CSS-based Moon Phase (waxing/waning) integrated with Panchanga */}
                  <div className="flex items-center gap-1 shrink-0">
                    <MoonPhaseIcon
                      paksha={panchangDay.paksha}
                      tithiNumber={panchangDay.tithiNumber}
                      size={13}
                      currentLang={currentLang}
                    />
                  </div>
                </div>

                {/* Sanskrit Tithi & Nakshatra Name */}
                <div className="my-0.5 space-y-0.5 overflow-hidden">
                  <div className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-semibold text-stone-800 dark:text-stone-200 truncate leading-tight">
                    {panchangDay.tithiName[currentLang]}
                  </div>
                  {panchangDay.tithiTiming && (
                    <div 
                      className="text-[6px] xs:text-[6.5px] sm:text-[7.5px] font-mono text-amber-700 dark:text-amber-400 truncate leading-tight font-medium"
                      title={panchangDay.tithiTiming.summary[currentLang]}
                    >
                      <span>{currentLang === 'kn' ? 'ಮುಕ್ತಾಯ: ' : currentLang === 'hi' ? 'समाप्ति: ' : 'Ends: '}</span>
                      <span>{panchangDay.tithiTiming.endTimeFormatted[currentLang]?.split(',')[1] || panchangDay.tithiTiming.endTime}</span>
                    </div>
                  )}
                  <div className="text-[6.5px] xs:text-[7px] sm:text-[8px] text-stone-500 dark:text-stone-400 truncate leading-tight">
                    {panchangDay.nakshatra[currentLang]}
                  </div>

                  {/* Visual Progress Bar / Timeline Indicator for Tithi & Nakshatra Transitions */}
                  {panchangDay.tithiTiming && (() => {
                    const cellRefTime = isToday 
                      ? Date.now() 
                      : new Date(panchangDay.year, panchangDay.month - 1, panchangDay.day, 12, 0, 0).getTime();
                    
                    const tStart = new Date(panchangDay.tithiTiming.startDateTime).getTime();
                    const tEnd = new Date(panchangDay.tithiTiming.endDateTime).getTime();
                    const tTotal = Math.max(1, tEnd - tStart);
                    const tElapsed = Math.min(tTotal, Math.max(0, cellRefTime - tStart));
                    const tithiPercent = Math.min(100, Math.max(0, Math.round((tElapsed / tTotal) * 100)));

                    const nTiming = panchangDay.nakshatraTiming || panchangDay.padaTiming;
                    let nakPercent = 50;
                    if (nTiming?.startDateTime && nTiming?.endDateTime) {
                      const nStart = new Date(nTiming.startDateTime).getTime();
                      const nEnd = new Date(nTiming.endDateTime).getTime();
                      const nTotal = Math.max(1, nEnd - nStart);
                      const nElapsed = Math.min(nTotal, Math.max(0, cellRefTime - nStart));
                      nakPercent = Math.min(100, Math.max(0, Math.round((nElapsed / nTotal) * 100)));
                    }

                    return (
                      <div 
                        className="my-0.5 space-y-0.5 bg-amber-500/10 dark:bg-stone-800/60 p-0.5 rounded border border-amber-200/50 dark:border-stone-700/50"
                        title={`Tithi: ${tithiPercent}% elapsed • Nakshatra: ${nakPercent}% elapsed`}
                      >
                        <div className="flex items-center justify-between text-[6px] xs:text-[6.5px] font-mono leading-none">
                          <span className="text-amber-800 dark:text-amber-400 font-bold">
                            {currentLang === 'kn' ? 'ತಿ' : 'T'}: {tithiPercent}%
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                            {currentLang === 'kn' ? 'ನ' : 'N'}: {nakPercent}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all rounded-full" 
                            style={{ width: `${Math.max(4, tithiPercent)}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Festival Tags rendered cleanly & prominently on each date cell */}
                {panchangDay.festivals.length > 0 && (
                  <div className="space-y-1 my-1">
                    {/* Special Navaratri Day Ritual Badge if present */}
                    {panchangDay.festivals.some(f => f.isNavaratri || f.id.startsWith('navaratri_day')) && (() => {
                      const nFest = panchangDay.festivals.find(f => f.isNavaratri || f.id.startsWith('navaratri_day'))!;
                      const dNum = parseInt(nFest.id.replace('navaratri_day', ''), 10) || 1;
                      const ritualBadge = 
                        dNum === 1 ? (currentLang === 'kn' ? '🏺 ಕಲಶ ಸ್ಥಾಪನೆ' : currentLang === 'hi' ? '🏺 कलश स्थापना' : '🏺 Kalasa Sthapana') :
                        dNum === 8 ? (currentLang === 'kn' ? '🗡️ ಸಂಧಿ / ಬಲಿ' : currentLang === 'hi' ? '🗡️ सन्धि / बलि' : '🗡️ Sandhi Bali') :
                        dNum === 9 ? (currentLang === 'kn' ? '🛠️ ಆಯುಧ ಪೂಜೆ' : currentLang === 'hi' ? '🛠️ आयुध पूजा' : '🛠️ Ayudha Puja') :
                        dNum === 10 ? (currentLang === 'kn' ? '🏺 ದಸರಾ ವಿಜಯದಶಮಿ' : currentLang === 'hi' ? '🏺 दशहरा विजयादशमी' : '🏺 Dasara Vijayadashami') :
                        (currentLang === 'kn' ? `🌺 ನವರಾತ್ರಿ ${dNum}` : currentLang === 'hi' ? `🌺 नवरात्रि ${dNum}` : `🌺 Navaratri ${dNum}`);

                      return (
                        <div
                          key={`nav-${dNum}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFestivalClick(nFest, panchangDay, 'grid');
                          }}
                          className="w-full text-left text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center gap-1 shadow-xs hover:scale-[1.02] cursor-pointer transition-transform border border-amber-300/60 leading-tight"
                          title={nFest.name[currentLang]}
                        >
                          <span className="line-clamp-2 break-words">{ritualBadge}</span>
                        </div>
                      );
                    })()}

                    {/* All Festivals on this Day (Deepavali, Naraka Chaturdashi, Dhanteras, Bali Padyami, Sharad Purnima, Karwa Chauth, etc.) */}
                    {panchangDay.festivals
                      .filter(f => !f.isNavaratri && !f.id.startsWith('navaratri_day'))
                      .map(fest => {
                        const isDeepavaliFest = ['deepavali', 'naraka_chaturdashi', 'dhanteras', 'bali_padyami', 'yama_dvitiya'].includes(fest.id);
                        const isPurnimaFest = fest.id === 'sharad_purnima';
                        const isChauthFest = fest.id === 'karwa_chauth';
                        const festIcon = isDeepavaliFest ? '🪔' : isPurnimaFest ? '🌕' : isChauthFest ? '🌙' : '✨';

                        const cellDisplayName = 
                          fest.id === 'deepavali'
                            ? (currentLang === 'kn' ? '🪔 ದೀಪಾವಳಿ ಲಕ್ಷ್ಮೀ ಪೂಜೆ' : currentLang === 'hi' ? '🪔 दीपावली लक्ष्मी पूजा' : '🪔 Deepavali Lakshmi Puja')
                            : fest.id === 'naraka_chaturdashi'
                            ? (currentLang === 'kn' ? '🪔 ನರಕ ಚತುರ್ದಶಿ (ಎಣ್ಣೆನೀರು)' : currentLang === 'hi' ? '🪔 नरक चतुर्दशी' : '🪔 Naraka Chaturdashi')
                            : fest.id === 'dhanteras'
                            ? (currentLang === 'kn' ? '🪔 ಧನ್ತೇರಸ್ (ಧನ್ವಂತರಿ)' : currentLang === 'hi' ? '🪔 धनतेरस (धन्वन्तरि)' : '🪔 Dhanteras')
                            : fest.id === 'bali_padyami'
                            ? (currentLang === 'kn' ? '🪔 ಬಲಿ ಪಾಡ್ಯಮಿ & ಗೋಪೂಜೆ' : currentLang === 'hi' ? '🪔 बलि प्रतिपदा व गोवर्धन' : '🪔 Bali Padyami & Go-Puja')
                            : fest.id === 'yama_dvitiya'
                            ? (currentLang === 'kn' ? '🪔 ಯಮ ಬಿದಿಗೆ (ಭಾಯಿ ದೂಜ್)' : currentLang === 'hi' ? '🪔 यम द्वितीया (भाई दूज)' : '🪔 Yama Dvitiya / Bhai Dooj')
                            : fest.id === 'sharad_purnima'
                            ? (currentLang === 'kn' ? '🌕 ಶರದ್ ಪೂರ್ಣಿಮಾ (ಹುಣ್ಣಿಮೆ)' : currentLang === 'hi' ? '🌕 शरद पूर्णिमा' : '🌕 Sharad Purnima')
                            : fest.id === 'karwa_chauth'
                            ? (currentLang === 'kn' ? '🌙 ಕರವಾ ಚೌತ್ (ಸಂಕಷ್ಟೀ)' : currentLang === 'hi' ? '🌙 करवा चौथ' : '🌙 Karwa Chauth')
                            : `${festIcon} ${fest.name[currentLang]}`;

                        return (
                          <button
                            key={fest.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFestivalClick(fest, panchangDay, 'grid');
                            }}
                            className={`w-full text-left text-[7px] xs:text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-md transition-all hover:scale-[1.02] border flex items-center gap-1 cursor-pointer shadow-xs leading-tight ${
                              isDeepavaliFest
                                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 border-amber-300 ring-1 ring-amber-400 font-black'
                                : isPurnimaFest
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-300 ring-1 ring-sky-400 font-black'
                                : isChauthFest
                                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-300 ring-1 ring-rose-400 font-black'
                                : fest.badgeBg || 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 border-amber-300'
                            }`}
                            title={`Click to view ${fest.name[currentLang]} below`}
                          >
                            <span className="line-clamp-2 break-words">{cellDisplayName}</span>
                          </button>
                        );
                      })}
                  </div>
                )}

                {/* Quick daily timings preview: Sunrise / Rahu Kaal icon */}
                <div className="mt-auto pt-0.5 flex items-center justify-between text-[7px] xs:text-[7.5px] sm:text-[8.5px] text-stone-400 dark:text-stone-500 font-mono leading-none">
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

          {/* Empty cells for trailing days */}
          {Array.from({ length: trailingEmptyDays }).map((_, i) => (
            <div
              key={`empty-trail-${i}`}
              className="aspect-square sm:aspect-[1/1.05] p-1 sm:p-1.5 bg-stone-100/30 dark:bg-stone-950/20 opacity-40 select-none border-t border-l"
            />
          ))}
        </div>
      </div>

      {/* Inline Details Section directly below the Calendar Grid */}
      <div id="inline-anchor-grid">
        {inlineSelectedDay && inlineAnchor === 'grid' && (
          <InlineDayDetailPanel
            day={inlineSelectedDay}
            festival={inlineSelectedFestival}
            currentLang={currentLang}
            initialTab={inlineActiveTab}
            onClose={() => {
              setInlineSelectedDay(null);
              setInlineAnchor(null);
            }}
            onOpenDasha={onOpenKundali}
          />
        )}
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
                onClick={() => {
                  const dayObj = monthDays.find(d => d.day === dayNum) || todayPanchangaDay;
                  handleFestivalClick(festival, dayObj, 'festivalsList');
                }}
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
                    {currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಾನ ಮತ್ತು ಕಥೆ ಕೆಳಗೆ ವೀಕ್ಷಿಸಿ ↓' : currentLang === 'hi' ? 'पूजा विधि व कथा नीचे देखें ↓' : 'View Puja Vidhi & Katha Below ↓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline Details Section directly below the Monthly Festivals */}
      <div id="inline-anchor-festivalsList">
        {inlineSelectedDay && inlineAnchor === 'festivalsList' && (
          <InlineDayDetailPanel
            day={inlineSelectedDay}
            festival={inlineSelectedFestival}
            currentLang={currentLang}
            initialTab="festivalDetail"
            onClose={() => {
              setInlineSelectedDay(null);
              setInlineAnchor(null);
            }}
            onOpenDasha={onOpenKundali}
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* SACRED VEDIC PORTALS: MANTRAS, SANKALPA & LAGNA KUNDALI                   */}
      {/* ========================================================================= */}
      {/* THREE PROMINENT BOTTOM BUTTONS AS EXPLICITLY REQUESTED */}
      <div className="pt-2">
        <div className="text-center mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400">
            {currentLang === 'kn' ? 'ಮುಖ್ಯ ವೈದಿಕ ಪರಿಕರಗಳು' : currentLang === 'hi' ? 'मुख्य वैदिक अनुभाग' : 'Sacred Vedic Portals'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Column 1: Mantras Button & Inline Elaboration */}
          <div className="flex flex-col">
            <button
              onClick={() => setExpandedPortal(prev => prev === 'mantras' ? null : 'mantras')}
              className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all text-left border cursor-pointer w-full ${
                expandedPortal === 'mantras'
                  ? 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 ring-4 ring-amber-400 border-white'
                  : 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border-amber-400/30'
              }`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                  <Sparkles className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold flex items-center gap-1">
                  <span>MANTRAMALA</span>
                  <span>{expandedPortal === 'mantras' ? '▲' : '▼'}</span>
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
              <span className="inline-block mt-3 text-[11px] font-bold text-amber-200 underline">
                {expandedPortal === 'mantras' ? '▲ Collapse Section' : '▼ Elaborate Below Button'}
              </span>
            </button>

            {/* Elaborated Mantras Portal Directly Below Button 1 */}
            {expandedPortal === 'mantras' && (
              <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-500 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ಮಂತ್ರ ಮಾಲೆ & ವೆಬ್‌ಲಿಂಕ್‌ಗಳು' : 'Mantras Library & Hymns'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setExpandedPortal(null)}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-[11.5px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ವೇದ ಸೂಕ್ತಗಳು (ಪುರುಷ ಸೂಕ್ತ, ಶ್ರೀ ಸೂಕ್ತ, ರುದ್ರಂ), ದೇವೀ ಮಾಹಾತ್ಮ್ಯೆ ಸ್ತೋತ್ರಗಳು ಹಾಗೂ ನಿಮ್ಮ ಸ್ವಂತ ಮಂತ್ರ ಲಿಂಕ್‌ಗಳನ್ನು ಆನ್‌ಲೈನ್‌ಗೆ ಸೇರಿಸಿ.'
                    : 'Explore Vedic Suktas, Devi Mahatmyam stotras, and custom user web links synced online.'}
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                    <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                      Vedic Suktas
                    </span>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Sri Rudram, Chamakam, Sri Sukta
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-stone-800 border border-orange-200 dark:border-stone-700">
                    <span className="text-[10px] uppercase font-bold text-orange-800 dark:text-orange-400 block mb-0.5">
                      Stotras & Sahasranama
                    </span>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Vishnu & Lalita Sahasranama
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-stone-800 border border-rose-200 dark:border-stone-700">
                    <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-400 block mb-0.5">
                      Online Added Links
                    </span>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Photo selection + instant web sync
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenMantras}
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ಮಂತ್ರ ಪುಟ ತೆರೆಯಿರಿ →' : 'Open Full Mantras Page →'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Sankalpa Vidhi Button & Inline Elaboration */}
          <div className="flex flex-col">
            <button
              onClick={() => setExpandedPortal(prev => prev === 'sankalpa' ? null : 'sankalpa')}
              className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all text-left border cursor-pointer w-full ${
                expandedPortal === 'sankalpa'
                  ? 'bg-gradient-to-br from-red-700 via-rose-700 to-amber-700 ring-4 ring-rose-400 border-white'
                  : 'bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border-rose-400/30'
              }`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                  <BookOpen className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold flex items-center gap-1">
                  <span>PDF VIDHANA</span>
                  <span>{expandedPortal === 'sankalpa' ? '▲' : '▼'}</span>
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold tracking-tight">
                {currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ಮತ್ತು ಸ್ಥಾಪನೆ (Sankalpa & Sthapana)' : currentLang === 'hi' ? 'संकल्प एवं स्थापना (Sankalpa & Sthapana)' : 'Sankalpa & Sthapana'}
              </h3>
              <p className="text-xs text-rose-100 mt-1 leading-relaxed">
                {currentLang === 'kn'
                  ? 'ದಿನಾಂಕ ಆಧಾರಿತ ೨-೯ ಸ್ವಯಂಚಾಲಿತ ನೀಲಿ ವಿವರಗಳು, ೬೦ ಸಂವತ್ಸರ, ಪಂಚಪೀಠ ಪ್ರವರ ಮತ್ತು ಪಿಡಿಎಫ್ ರಫ್ತು.'
                  : currentLang === 'hi'
                  ? 'तिथि अनुसार २-९ स्वतः नीले रंग में प्रविष्ट विवरण, ६० संवत्सर, पंचपीठ प्रवर व पीडीएफ निर्यात।'
                  : 'Auto date-populated blue dashed details (2-9), 60 Samvatsaras, Panchapeetha, and PDF export.'}
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-rose-200 underline">
                {expandedPortal === 'sankalpa' ? '▲ Collapse Section' : '▼ Elaborate Below Button'}
              </span>
            </button>

            {/* Elaborated Sankalpa Vidhi Portal Directly Below Button 2 */}
            {expandedPortal === 'sankalpa' && (
              <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-rose-500 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-200 dark:border-stone-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ಇಂದಿನ ಸಂಕಲ್ಪ ವಿವರಗಳು' : 'Daily Sankalpa Details'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setExpandedPortal(null)}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">1. Location:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}</strong>
                  </div>
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">2. Samvatsara:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentMonthPanchangaSample.samvatsara[currentLang]}</strong>
                  </div>
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">3. Ayana:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentMonthPanchangaSample.ayana[currentLang]}</strong>
                  </div>
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">4. Masa:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentMonthPanchangaSample.masa[currentLang]}</strong>
                  </div>
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">5. Paksha:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentMonthPanchangaSample.paksha}</strong>
                  </div>
                  <div className="p-2 bg-rose-50/70 dark:bg-stone-800 rounded-lg border border-rose-200 dark:border-stone-700">
                    <span className="text-stone-500 block text-[10px]">6. Tithi:</span>
                    <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentMonthPanchangaSample.tithiName[currentLang]}</strong>
                  </div>
                </div>

                <button
                  onClick={onOpenSankalpa}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ಸಂಕಲ್ಪ ಪುಟ ಹಾಗೂ ಪಿಡಿಎಫ್ →' : 'Open Sankalpa Page & PDF →'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Column 3: Lagna Kundali Button & Inline Elaboration */}
          <div className="flex flex-col">
            <button
              onClick={() => setExpandedPortal(prev => prev === 'kundali' ? null : 'kundali')}
              className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all text-left border cursor-pointer w-full ${
                expandedPortal === 'kundali'
                  ? 'bg-gradient-to-br from-indigo-800 via-purple-800 to-amber-800 ring-4 ring-indigo-400 border-white'
                  : 'bg-gradient-to-br from-indigo-700 via-purple-700 to-amber-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border-indigo-400/30'
              }`}
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="p-3 rounded-xl bg-white/20 backdrop-blur-xs text-white">
                  <Layers className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/20 font-bold flex items-center gap-1">
                  <span>VEDIC CHART</span>
                  <span>{expandedPortal === 'kundali' ? '▲' : '▼'}</span>
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
              <span className="inline-block mt-3 text-[11px] font-bold text-indigo-200 underline">
                {expandedPortal === 'kundali' ? '▲ Collapse Section' : '▼ Elaborate Below Button'}
              </span>
            </button>

            {/* Elaborated Lagna Kundali Portal Directly Below Button 3 */}
            {expandedPortal === 'kundali' && (
              <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-indigo-500 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-200 dark:border-stone-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ & ಪರಿಹಾರಗಳು' : 'Lagna Kundali & Remedies'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setExpandedPortal(null)}
                    className="p-1 text-stone-400 hover:text-stone-600 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-stone-800 border border-indigo-200 dark:border-stone-700">
                    <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider block mb-0.5">
                      Lagna Kundali
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      North & South Indian style charts with Lahiri Ephemeris.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-stone-800 border border-purple-200 dark:border-stone-700">
                    <span className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider block mb-0.5">
                      Vedic Remedies & Prashna
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      Dosha shanti, Gemstone recommendations, and Horary Prashna Kundali.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-stone-800 border border-rose-200 dark:border-stone-700">
                    <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider block mb-0.5">
                      Guna Milan
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                      36-point Ashtakoota marriage compatibility.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenKundali}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ಕುಂಡಲಿ ಪುಟ ತೆರೆಯಿರಿ →' : 'Open Full Kundali Page →'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

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
