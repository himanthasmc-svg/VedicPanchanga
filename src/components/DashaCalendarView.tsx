import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Flame,
  ArrowRight,
  Layers,
  X,
  Compass,
  Star,
  Activity,
  Heart,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Language, LocalizedString } from '../types';
import {
  VimshottariDashaResult,
  MahadashaPeriod,
  AntardashaPeriod,
  DASHA_LORDS,
  DashaLordInfo
} from '../utils/vimshottariDasha';
import { UserProfile } from '../utils/userProfile';
import { MAHADASHA_EFFECTS, getDashaAntardashaSynthesis } from '../utils/dashaEffects';

export interface MahadashaShiftEvent {
  id: string;
  shiftDate: Date;
  dateStr: string; // YYYY-MM-DD
  outgoingLord: DashaLordInfo;
  incomingLord: DashaLordInfo;
  ageAtShiftYears: number;
  ageAtShiftMonths: number;
  durationYears: number;
  isPast: boolean;
  isActive: boolean;
  isNextUpcoming: boolean;
  daysUntilShift: number;
  index: number;
}

interface DashaCalendarViewProps {
  dashaResult: VimshottariDashaResult;
  profile: UserProfile;
  currentLang: Language;
  onSelectDate?: (dateStr: string) => void;
}

export const DashaCalendarView: React.FC<DashaCalendarViewProps> = ({
  dashaResult,
  profile,
  currentLang,
  onSelectDate
}) => {
  const [viewMode, setViewMode] = useState<'shifts' | 'calendar'>('shifts');
  const [selectedShift, setSelectedShift] = useState<MahadashaShiftEvent | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  // Compute all Mahadasha Shift Events across the 120-year cycle
  const shiftEvents: MahadashaShiftEvent[] = useMemo(() => {
    const now = new Date();
    const birth = new Date(`${profile.birthDate}T${profile.birthTime || '12:00'}:00`);
    const events: MahadashaShiftEvent[] = [];

    let foundNext = false;

    dashaResult.mahadashas.forEach((maha, idx) => {
      // The start of this Mahadasha is a shift event from the previous lord
      // For index 0, this is the birth epoch starting point
      const prevMaha = idx > 0 ? dashaResult.mahadashas[idx - 1] : null;
      const outgoing = prevMaha ? prevMaha.lord : maha.lord; // for birth epoch, self
      const incoming = maha.lord;

      const shiftDate = new Date(maha.startDate);
      const isPast = shiftDate < now && !maha.isCurrent;
      const isActive = maha.isCurrent;
      const daysUntilShift = Math.round((shiftDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let isNextUpcoming = false;
      if (!isPast && !isActive && !foundNext && daysUntilShift > 0) {
        isNextUpcoming = true;
        foundNext = true;
      }

      // Age calculation
      const ageMs = shiftDate.getTime() - birth.getTime();
      const ageTotalMonths = Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.4375)));
      const ageYears = Math.floor(ageTotalMonths / 12);
      const ageMonths = ageTotalMonths % 12;

      events.push({
        id: `shift-${idx}-${maha.lord.name}`,
        shiftDate,
        dateStr: shiftDate.toISOString().split('T')[0],
        outgoingLord: outgoing,
        incomingLord: incoming,
        ageAtShiftYears: ageYears,
        ageAtShiftMonths: ageMonths,
        durationYears: maha.durationYears,
        isPast,
        isActive,
        isNextUpcoming,
        daysUntilShift,
        index: idx
      });
    });

    return events;
  }, [dashaResult, profile]);

  // Current or next upcoming shift for quick jump
  const nextShift = useMemo(() => {
    return shiftEvents.find(s => s.isNextUpcoming) || shiftEvents.find(s => s.isActive) || shiftEvents[0];
  }, [shiftEvents]);

  // Calendar month state: initialized to the next shift or current month
  const [currentCalYear, setCurrentCalYear] = useState<number>(() => {
    if (nextShift) return nextShift.shiftDate.getFullYear();
    return new Date().getFullYear();
  });
  const [currentCalMonth, setCurrentCalMonth] = useState<number>(() => {
    if (nextShift) return nextShift.shiftDate.getMonth();
    return new Date().getMonth();
  });

  // Jump to specific month/year
  const handleJumpToShift = (shift: MahadashaShiftEvent) => {
    setCurrentCalYear(shift.shiftDate.getFullYear());
    setCurrentCalMonth(shift.shiftDate.getMonth());
    setViewMode('calendar');
    setSelectedShift(shift);
  };

  // Helper: Format full date
  const formatFullDate = (d: Date) => {
    return d.toLocaleDateString(currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Days in month calculation for the interactive calendar grid
  const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentCalYear, currentCalMonth, 1).getDay(); // 0 = Sun

  // Map of shifts in the currently selected month
  const monthShiftsMap = useMemo(() => {
    const map = new Map<number, MahadashaShiftEvent>();
    shiftEvents.forEach(shift => {
      if (
        shift.shiftDate.getFullYear() === currentCalYear &&
        shift.shiftDate.getMonth() === currentCalMonth
      ) {
        map.set(shift.shiftDate.getDate(), shift);
      }
    });
    return map;
  }, [shiftEvents, currentCalYear, currentCalMonth]);

  // Also collect all Antardasha shifts in this month for comprehensive astronomical granularity
  const monthAntardashaShifts = useMemo(() => {
    const map = new Map<number, { mahaLord: string; antarLord: DashaLordInfo; date: Date }>();
    dashaResult.mahadashas.forEach(maha => {
      maha.antardashas.forEach(antar => {
        const aDate = new Date(antar.startDate);
        if (
          aDate.getFullYear() === currentCalYear &&
          aDate.getMonth() === currentCalMonth
        ) {
          map.set(aDate.getDate(), {
            mahaLord: maha.lord.name,
            antarLord: antar.lord,
            date: aDate
          });
        }
      });
    });
    return map;
  }, [dashaResult, currentCalYear, currentCalMonth]);

  const monthNames = [
    { en: 'January', kn: 'ಜನವರಿ', hi: 'जनवरी' },
    { en: 'February', kn: 'ಫೆಬ್ರವರಿ', hi: 'फरवरी' },
    { en: 'March', kn: 'ಮಾರ್ಚ್', hi: 'मार्च' },
    { en: 'April', kn: 'ಏಪ್ರಿಲ್', hi: 'अप्रैल' },
    { en: 'May', kn: 'ಮೇ', hi: 'मई' },
    { en: 'June', kn: 'ಜೂನ್', hi: 'जून' },
    { en: 'July', kn: 'ಜುಲೈ', hi: 'जुलाई' },
    { en: 'August', kn: 'ಆಗಸ್ಟ್', hi: 'अगस्त' },
    { en: 'September', kn: 'ಸೆಪ್ಟೆಂಬರ್', hi: 'सितंबर' },
    { en: 'October', kn: 'ಅಕ್ಟೋಬರ್', hi: 'अक्टूबर' },
    { en: 'November', kn: 'ನವೆಂಬರ್', hi: 'नवंबर' },
    { en: 'December', kn: 'ಡಿಸೆಂಬರ್', hi: 'दिसंबर' }
  ];

  const weekdayNames = [
    { en: 'Sun', kn: 'ಭಾನು', hi: 'रवि' },
    { en: 'Mon', kn: 'ಸೋಮ', hi: 'सोम' },
    { en: 'Tue', kn: 'ಮಂಗಳ', hi: 'मंगल' },
    { en: 'Wed', kn: 'ಬುಧ', hi: 'बुध' },
    { en: 'Thu', kn: 'ಗುರು', hi: 'गुरु' },
    { en: 'Fri', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    { en: 'Sat', kn: 'ಶನಿ', hi: 'शनि' }
  ];

  const handlePrevMonth = () => {
    if (currentCalMonth === 0) {
      setCurrentCalMonth(11);
      setCurrentCalYear(prev => prev - 1);
    } else {
      setCurrentCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentCalMonth === 11) {
      setCurrentCalMonth(0);
      setCurrentCalYear(prev => prev + 1);
    } else {
      setCurrentCalMonth(prev => prev + 1);
    }
  };

  // Copy shift details to clipboard
  const handleCopyShiftInfo = (shift: MahadashaShiftEvent) => {
    const text = `🔱 VEDIC DASHA SHIFT MILESTONE
📅 Shift Date: ${formatFullDate(shift.shiftDate)}
🔄 Transition: ${shift.outgoingLord.name} ➔ ${shift.incomingLord.name} Mahadasha
⏳ Native Age: ${shift.ageAtShiftYears} Years, ${shift.ageAtShiftMonths} Months
💎 Incoming Gemstone: ${shift.incomingLord.gemstone[currentLang]}
🕉️ Prescribed Mantra: ${shift.incomingLord.mantra[currentLang]}
🙏 Auspicious Deity: ${shift.incomingLord.deity[currentLang]}`.trim();

    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-stone-850 border-2 border-amber-300 dark:border-stone-700 p-4 sm:p-6 shadow-md space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700/80 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold border border-amber-300 dark:border-amber-700">
              <Sparkles className="w-3 h-3" />
              <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಪರಿವರ್ತನಾ ಮೈಲಿಗಲ್ಲುಗಳು' : 'Planetary Transition Milestones'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1 flex items-center gap-2">
              <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಕ್ಯಾಲೆಂಡರ್' : currentLang === 'hi' ? 'विंशोत्तरी दशा कैलेंडर' : 'Vimshottari Dasha Calendar'}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {currentLang === 'kn'
                ? 'ಮಹಾದಶಾ ಬದಲಾಗುವ ನಿರ್ದಿಷ್ಟ ದಿನಾಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಹಾಗೂ ದಿನಾಂಕದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಗ್ರಹ ಬದಲಾವಣೆಯ ಫಲಗಳನ್ನು ನೋಡಿ.'
                : 'Interactive timeline highlighting exact Mahadasha transition dates. Click any date to examine the planetary shift effects and Sandhi remedies.'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Quick Navigation */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {nextShift && (
            <button
              onClick={() => handleJumpToShift(nextShift)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Jump to the next upcoming Mahadasha shift"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {currentLang === 'kn' ? 'ಮುಂದಿನ ದಶಾ ಬದಲಾವಣೆ' : 'Next Shift:'} {nextShift.incomingLord.name} ({nextShift.shiftDate.getFullYear()})
              </span>
            </button>
          )}

          <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('shifts')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'shifts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {currentLang === 'kn' ? 'ದಶಾ ಮೈಲಿಗಲ್ಲುಗಳು' : 'Shift Milestones (120-Yr)'}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್ ಗ್ರಿಡ್' : 'Monthly Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: 120-YEAR MAHADASHA SHIFT MILESTONES TIMELINE                  */}
      {/* ========================================================================= */}
      {viewMode === 'shifts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {shiftEvents.map((shift, idx) => {
              const effect = MAHADASHA_EFFECTS[shift.incomingLord.name];

              return (
                <div
                  key={shift.id}
                  onClick={() => setSelectedShift(shift)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between hover:shadow-md ${
                    shift.isActive
                      ? 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-stone-50 dark:from-stone-800 dark:via-stone-800 dark:to-stone-850 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                      : shift.isNextUpcoming
                      ? 'bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white dark:from-stone-800 dark:via-indigo-950/20 dark:to-stone-850 border-indigo-400 dark:border-indigo-600'
                      : shift.isPast
                      ? 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700/60 opacity-80 hover:opacity-100'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {/* Top Status Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        #{idx + 1} {idx === 0 ? (currentLang === 'kn' ? 'ಜನ್ಮ ಆರಂಭ' : 'Birth Epoch') : (currentLang === 'kn' ? 'ದಶಾ ಪರಿವರ್ತನೆ' : 'Shift Milestone')}
                      </span>

                      {shift.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ' : 'Current Era'}
                        </span>
                      ) : shift.isNextUpcoming ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          {currentLang === 'kn' ? 'ಮುಂದಿನ ಪರಿವರ್ತನೆ' : 'Next Upcoming'}
                        </span>
                      ) : shift.isPast ? (
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold text-[9px] uppercase">
                          {currentLang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Past'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 font-medium text-[9px] uppercase">
                          {currentLang === 'kn' ? 'ಭವಿಷ್ಯ' : 'Future'}
                        </span>
                      )}
                    </div>

                    {/* Transition Header with Planet Glyphs */}
                    <div className="flex items-center justify-between py-2 border-y border-stone-100 dark:border-stone-700/60 my-1">
                      {idx > 0 ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-2xs"
                            style={{ backgroundColor: shift.outgoingLord.color }}
                            title={shift.outgoingLord.name}
                          >
                            {shift.outgoingLord.symbol}
                          </div>
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                            {shift.outgoingLord.sanskrit[currentLang]}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                          <div
                            className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-2xs"
                            style={{ backgroundColor: shift.incomingLord.color }}
                            title={shift.incomingLord.name}
                          >
                            {shift.incomingLord.symbol}
                          </div>
                          <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                            {shift.incomingLord.sanskrit[currentLang]}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-sm"
                            style={{ backgroundColor: shift.incomingLord.color }}
                          >
                            {shift.incomingLord.symbol}
                          </div>
                          <div>
                            <span className="text-xs font-black text-stone-900 dark:text-stone-100 block">
                              {shift.incomingLord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶಾ' : 'Mahadasha'}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {currentLang === 'kn' ? 'ಜನ್ಮ ನಕ್ಷತ್ರದ ಮೊದಲ ದಶಾ' : 'Initial Janma Nakshatra Dasha'}
                            </span>
                          </div>
                        </div>
                      )}

                      <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                        {shift.durationYears} {currentLang === 'kn' ? 'ವರ್ಷ' : 'Yrs'}
                      </span>
                    </div>

                    {/* Date and Age Information */}
                    <div className="mt-2.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">{currentLang === 'kn' ? 'ದಿನಾಂಕ:' : 'Shift Date:'}</span>
                        <span className="font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                          {formatFullDate(shift.shiftDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">{currentLang === 'kn' ? 'ಜಾತಕರ ವಯಸ್ಸು:' : 'Native Age:'}</span>
                        <span className="font-bold text-stone-700 dark:text-stone-300">
                          {shift.ageAtShiftYears} {currentLang === 'kn' ? 'ವರ್ಷ' : 'y'} {shift.ageAtShiftMonths} {currentLang === 'kn' ? 'ತಿಂಗಳು' : 'm'}
                        </span>
                      </div>
                      {shift.isNextUpcoming && (
                        <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 font-semibold pt-1">
                          <span>{currentLang === 'kn' ? 'ಸಮಯ ಬಾಕಿ:' : 'Time Until Shift:'}</span>
                          <span>{Math.round(shift.daysUntilShift / 365.25)} {currentLang === 'kn' ? 'ವರ್ಷಗಳು' : 'years'} ({shift.daysUntilShift} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action link */}
                  <div className="mt-4 pt-2.5 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                      <span>{currentLang === 'kn' ? 'ಬದಲಾವಣೆಯ ಫಲಗಳು' : 'View Shift Effects'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJumpToShift(shift);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-[10px] font-bold text-stone-600 dark:text-stone-300"
                      title="Jump to this date in the monthly calendar grid"
                    >
                      {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್' : 'Calendar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: INTERACTIVE MONTHLY CALENDAR GRID WITH HIGHLIGHTED SHIFTS    */}
      {/* ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Calendar Month & Year Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-100 cursor-pointer shadow-2xs"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center px-3">
                <span className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  {monthNames[currentCalMonth][currentLang]} {currentCalYear}
                </span>
                <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ಮಾಸಿಕ ಗ್ರಿಡ್' : 'Vimshottari Planetary Grid'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-100 cursor-pointer shadow-2xs"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump to shifts dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                {currentLang === 'kn' ? 'ದಶಾ ಪರಿವರ್ತನೆಗೆ ಜಿಗಿಯಿರಿ:' : 'Jump to Shift:'}
              </label>
              <select
                onChange={(e) => {
                  const s = shiftEvents.find(ev => ev.id === e.target.value);
                  if (s) handleJumpToShift(s);
                }}
                className="px-2.5 py-1 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 font-semibold cursor-pointer"
              >
                <option value="">Select Milestone...</option>
                {shiftEvents.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx === 0 ? 'Birth' : `${s.outgoingLord.name} ➔ ${s.incomingLord.name}`} ({s.shiftDate.getFullYear()})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  const n = new Date();
                  setCurrentCalYear(n.getFullYear());
                  setCurrentCalMonth(n.getMonth());
                }}
                className="px-2.5 py-1 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 cursor-pointer"
              >
                {currentLang === 'kn' ? 'ಈ ತಿಂಗಳು' : 'This Month'}
              </button>
            </div>
          </div>

          {/* Monthly Calendar Grid */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-850 shadow-sm">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 text-center py-2 text-xs font-black text-stone-700 dark:text-stone-300">
              {weekdayNames.map((wd, i) => (
                <div key={i} className={i === 0 ? 'text-amber-700 dark:text-amber-400' : ''}>
                  {wd[currentLang]}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[85px] bg-stone-50/40 dark:bg-stone-900/40 p-1" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(currentCalYear, currentCalMonth, dayNum);
                const isToday =
                  dateObj.getDate() === new Date().getDate() &&
                  dateObj.getMonth() === new Date().getMonth() &&
                  dateObj.getFullYear() === new Date().getFullYear();

                const mahaShift = monthShiftsMap.get(dayNum);
                const antarShift = monthAntardashaShifts.get(dayNum);

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => {
                      if (mahaShift) {
                        setSelectedShift(mahaShift);
                      } else if (onSelectDate) {
                        onSelectDate(dateObj.toISOString().split('T')[0]);
                      }
                    }}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 sm:p-2 transition-all flex flex-col justify-between relative ${
                      mahaShift
                        ? 'bg-amber-100/90 dark:bg-amber-950/60 ring-2 ring-amber-400 border-amber-500 cursor-pointer hover:bg-amber-200/80 shadow-xs'
                        : antarShift
                        ? 'bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-100/60 cursor-pointer'
                        : isToday
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 font-bold'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer'
                    }`}
                  >
                    {/* Day number & indicators */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          mahaShift
                            ? 'bg-amber-600 text-white shadow-xs font-black'
                            : isToday
                            ? 'bg-emerald-600 text-white font-black'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {mahaShift && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </div>

                    {/* Mahadasha Shift Badge on Calendar Day */}
                    {mahaShift && (
                      <div className="mt-1 p-1 rounded-lg bg-amber-500 text-stone-950 font-black text-[9px] shadow-xs leading-tight">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">
                            {mahaShift.incomingLord.name} {currentLang === 'kn' ? 'ಮಹಾದಶಾ' : 'Maha'}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono block opacity-90 truncate">
                          {mahaShift.index === 0 ? 'Birth Dasha' : `From ${mahaShift.outgoingLord.name}`}
                        </span>
                      </div>
                    )}

                    {/* Antardasha Shift Badge if no Mahadasha shift on this day */}
                    {!mahaShift && antarShift && (
                      <div className="mt-1 p-1 rounded-lg bg-orange-100 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 text-[9px] font-bold leading-tight border border-orange-300 dark:border-orange-700">
                        <span className="truncate block font-semibold">
                          {antarShift.antarLord.name}
                        </span>
                        <span className="text-[8px] text-stone-500 block truncate">
                          {currentLang === 'kn' ? 'ಅಂತರ್ದಶಾ' : 'Antar'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400 p-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-2xs" />
              <span>{currentLang === 'kn' ? 'ಮಹಾದಶಾ ಪರಿವರ್ತನಾ ದಿನಾಂಕ (ಕ್ಲಿಕ್ ಮಾಡಿ ಫಲ ವೀಕ್ಷಿಸಿ)' : 'Mahadasha Shift Date (Click to view effects)'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-200 border border-orange-400 inline-block" />
              <span>{currentLang === 'kn' ? 'ಅಂತರ್ದಶಾ ಬದಲಾವಣೆ ದಿನಾಂಕ' : 'Antardasha Sub-period Shift'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
              <span>{currentLang === 'kn' ? 'ಇಂದಿನ ದಿನ' : 'Today'}</span>
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL / DIALOG: PLANETARY TRANSITION EFFECTS & SANDHI GUIDANCE             */}
      {/* ========================================================================= */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full border-2 border-amber-400 dark:border-stone-700 shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div
              className="p-5 sm:p-6 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${selectedShift.incomingLord.color} 0%, #1c1917 100%)`
              }}
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold mb-2 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {selectedShift.index === 0
                        ? (currentLang === 'kn' ? 'ಜನ್ಮ ದಶಾ ಆರಂಭ' : 'Initial Janma Nakshatra Dasha Epoch')
                        : (currentLang === 'kn' ? 'ಮಹಾದಶಾ ಸಂಧಿಕಾಲ & ಪರಿವರ್ತನೆ' : 'Mahadasha Transition & Sandhi Dynamics')}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    {selectedShift.index > 0 ? (
                      <>
                        <span>{selectedShift.outgoingLord.sanskrit[currentLang]}</span>
                        <ArrowRight className="w-5 h-5 text-amber-300" />
                        <span>{selectedShift.incomingLord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶಾ' : 'Mahadasha'}</span>
                      </>
                    ) : (
                      <span>{selectedShift.incomingLord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶಾ (ಜನ್ಮ ಕಾಲ)' : 'Mahadasha (Birth Epoch)'}</span>
                    )}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-200 mt-1">
                    📅 <strong>{formatFullDate(selectedShift.shiftDate)}</strong> • {currentLang === 'kn' ? 'ಜಾತಕರ ವಯಸ್ಸು:' : 'Native Age:'} <strong>{selectedShift.ageAtShiftYears} {currentLang === 'kn' ? 'ವರ್ಷ' : 'Yrs'}, {selectedShift.ageAtShiftMonths} {currentLang === 'kn' ? 'ತಿಂಗಳು' : 'Mo'}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedShift(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm cursor-pointer shrink-0 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-stone-800 dark:text-stone-200">
              {/* Planetary Archetype & Core Rulership */}
              <div className="rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 p-4 border border-amber-200 dark:border-stone-700">
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                    style={{ backgroundColor: selectedShift.incomingLord.color }}
                  >
                    {selectedShift.incomingLord.symbol}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
                      {currentLang === 'kn' ? 'ಆಗಮಿಸುವ ಗ್ರಹದ ತೇಜಸ್ಸು' : 'Incoming Planetary Archetype'}
                    </span>
                    <h4 className="text-sm font-black text-stone-900 dark:text-stone-100">
                      {MAHADASHA_EFFECTS[selectedShift.incomingLord.name]?.archetype[currentLang] || `${selectedShift.incomingLord.name} Energy`}
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {MAHADASHA_EFFECTS[selectedShift.incomingLord.name]?.generalEffects[currentLang] || ''}
                </p>
              </div>

              {/* Dasha Sandhi (Junction Period) Explanation */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs sm:text-sm font-black text-indigo-900 dark:text-indigo-200">
                    {currentLang === 'kn' ? 'ಪರಾಶರ ಶಾಸ್ತ್ರೋಕ್ತ ದಶಾ ಸಂಧಿಯ ಮಹತ್ವ (Sandhi Kala)' : 'Parashara Dasha Sandhi (Transition Junction Period)'}
                  </h4>
                </div>
                <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  {currentLang === 'kn'
                    ? `ಯಾವುದೇ ಮಹಾದಶೆ ಮುಗಿಯುವ ಕಡೆಯ ೬ ತಿಂಗಳು ಮತ್ತು ಹೊಸ ಮಹಾದಶೆ ಆರಂಭವಾಗುವ ಮೊದಲ ೬ ತಿಂಗಳುಗಳನ್ನು "ದಶಾ ಸಂಧಿ" ಎನ್ನಲಾಗುತ್ತದೆ. ಈ ಸಂಧಿಕಾಲದಲ್ಲಿ ಹಳೆಯ ${selectedShift.outgoingLord.sanskrit[currentLang]} ದಶೆಯ ಪ್ರಭಾವ ಕಡಿಮೆಯಾಗಿ ಹೊಸ ${selectedShift.incomingLord.sanskrit[currentLang]} ಗ್ರಹದ ರಶ್ಮಿಗಳು ಕ್ರಮೇಣ ಜೀವದ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರಲು ಪ್ರಾರಂಭಿಸುತ್ತವೆ. ಈ ಅವಧಿಯಲ್ಲಿ ಶಾಂತಿಯುತ ಶಿವ ಮತ್ತು ದೇವಿ ಪೂಜೆ ಅತ್ಯಂತ ಶ್ರೇಯಸ್ಕರ.`
                    : `In Vedic astrology, the final 6 months of ${selectedShift.outgoingLord.name} Mahadasha and first 6 months of incoming ${selectedShift.incomingLord.name} Mahadasha constitute the Dasha Sandhi (cusp). As the previous planetary cycle dissolves, life patterns realign with the new planetary ruler. Auspicious rituals and meditative alignment prevent friction during this karmic threshold.`}
                </p>
              </div>

              {/* 2-Column Life Domains Impact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-black text-amber-700 dark:text-amber-400 block mb-1">
                    💼 {currentLang === 'kn' ? 'ವೃತ್ತಿ & ಆರ್ಥಿಕ ಪ್ರಭಾವ' : 'Career & Finances'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {MAHADASHA_EFFECTS[selectedShift.incomingLord.name]?.careerFinance[currentLang] || ''}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-400 block mb-1">
                    🌿 {currentLang === 'kn' ? 'ಆರೋಗ್ಯ & ಪ್ರಾಣಶಕ್ತಿ' : 'Health & Vitality'}
                  </span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {MAHADASHA_EFFECTS[selectedShift.incomingLord.name]?.healthWellness[currentLang] || ''}
                  </p>
                </div>
              </div>

              {/* Shiva & Devi Sampradaya Remedies for this Shift */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <h4 className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn' ? 'ಪರಿವರ್ತನಾ ದಿನದ ಶಾಂತಿ & ಶಿವ-ದೇವಿ ಉಪಾಸನೆ' : 'Shift Day Upasana & Shiva-Devi Remedies'}
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">🕉️ Mantra:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {selectedShift.incomingLord.mantra[currentLang]}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">🙏 Upasana:</span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {MAHADASHA_EFFECTS[selectedShift.incomingLord.name]?.spiritualFocus[currentLang] || ''}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">💎 Gemstone:</span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {selectedShift.incomingLord.gemstone[currentLang]}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">🎁 Dana:</span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {selectedShift.incomingLord.charityDaana[currentLang]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopyShiftInfo(selectedShift)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100 cursor-pointer shadow-2xs"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotice ? (currentLang === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (currentLang === 'kn' ? 'ವಿವರ ನಕಲಿಸಿ' : 'Copy Details')}</span>
              </button>

              <div className="flex items-center gap-2">
                {onSelectDate && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDate(selectedShift.dateStr);
                      setSelectedShift(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{currentLang === 'kn' ? 'ಈ ದಿನಾಂಕದ ದಶಾ ಪರಿಶೀಲಿಸಿ' : 'Inspect Dasha on This Date'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedShift(null)}
                  className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-bold cursor-pointer"
                >
                  {currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
