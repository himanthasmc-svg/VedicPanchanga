import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  Sparkles, 
  Bell, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  ShieldAlert, 
  Flame,
  Info,
  CheckSquare,
  Square,
  Sunrise,
  HeartHandshake,
  Minimize2,
  Maximize2,
  Volume2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { CustomEventItem, Festival, Language, PanchangaDay } from '../types';
import { formatJustNumber, formatNumberWithEnglishBracket, calculatePadaTimings } from '../utils/panchanga';
import { MoonPhaseIcon } from './MoonPhaseIcon';
import { calculateMoonPhaseFromDate } from '../utils/lunarPhase';
import { DailyMoonPhaseCard } from './DailyMoonPhaseCard';
import { 
  fetchDailyAstrologicalTip, 
  speakAstrologicalTip, 
  DailyInsightResponse 
} from '../utils/geminiDailyInsights';
import { 
  SANDHI_PUJA_DETAILS, 
  NAVARATRI_10_DAYS_RITUALS, 
  KALASHA_STHAPANA_STEPS,
  AKHANDA_DEEPA_STHAPANA_DETAILS,
  AYUDHA_PUJA_DETAILS,
  VIJAYADASHAMI_VISARJANA_DETAILS,
  DAILY_NAVADURGA_PUJA_KRAMA,
  getCalculatedSandhiTiming 
} from '../utils/navaratriRitualsData';
import { NavaratriRitualsModal } from './NavaratriRitualsModal';
import CreativeTithiPadaVisualizer from './CreativeTithiPadaVisualizer';

interface DayDetailModalProps {
  day: PanchangaDay | null;
  currentLang: Language;
  onClose: () => void;
  onSelectFestival: (festival: Festival) => void;
  customEvents: CustomEventItem[];
  onAddEvent: (event: CustomEventItem) => void;
  onDeleteEvent: (id: string) => void;
  onOpenNavaratriRituals?: (dayNumber?: number, tab?: 'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami') => void;
  onOpenDasha?: () => void;
}

export interface ActivePopup {
  type: 'eventForm' | 'referenceMode' | 'festival' | 'muhurtaInfo' | 'padaDetail' | 'alertInfo';
  title: string;
  data?: any;
  top: number;
  left: number;
  width?: number;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  currentLang,
  onClose,
  onSelectFestival,
  customEvents,
  onAddEvent,
  onDeleteEvent,
  onOpenNavaratriRituals,
  onOpenDasha
}) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'pooja' | 'vrat' | 'shraddha' | 'auspicious' | 'personal'>('pooja');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [checkedDailyItems, setCheckedDailyItems] = useState<Record<string, boolean>>({});
  const [showDailyRituals, setShowDailyRituals] = useState(true);
  const [showLocalRitualsModal, setShowLocalRitualsModal] = useState(false);
  const [localRitualsTab, setLocalRitualsTab] = useState<'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami'>('kalasha');
  const [isWideView, setIsWideView] = useState(true);
  const [isCreativeTithiView, setIsCreativeTithiView] = useState(false);
  const [referenceMode, setReferenceMode] = useState<'live' | 'sunrise' | 'midday' | 'sunset'>('live');
  const [activePopup, setActivePopup] = useState<ActivePopup | null>(null);

  // Gemini AI Daily Astrological Insights State
  const [dailyInsight, setDailyInsight] = useState<DailyInsightResponse | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);
  const [isSpeakingTip, setIsSpeakingTip] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!day) return;

    const loadInsight = async () => {
      setIsGeneratingInsight(true);
      try {
        const result = await fetchDailyAstrologicalTip({
          tithiName: day.tithiName?.[currentLang] || day.tithiName?.en || '',
          tithiPaksha: day.pakshaName?.[currentLang] || day.paksha || 'Shukla',
          nakshatraName: day.nakshatra?.[currentLang] || day.nakshatra?.en || '',
          padaNumber: day.pada,
          rashiName: day.chandraRashi?.[currentLang] || day.chandraRashi?.en || '',
          dateStr: day.gregorianDate,
          language: currentLang
        });
        if (isMounted) {
          setDailyInsight(result);
        }
      } catch (e) {
        console.error('Failed to load daily insight:', e);
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
  }, [day?.gregorianDate, currentLang]);

  const handleRegenerateInsight = async () => {
    if (!day || isGeneratingInsight) return;
    setIsGeneratingInsight(true);
    try {
      const result = await fetchDailyAstrologicalTip({
        tithiName: day.tithiName?.[currentLang] || day.tithiName?.en || '',
        tithiPaksha: day.pakshaName?.[currentLang] || day.paksha || 'Shukla',
        nakshatraName: day.nakshatra?.[currentLang] || day.nakshatra?.en || '',
        padaNumber: day.pada,
        rashiName: day.chandraRashi?.[currentLang] || day.chandraRashi?.en || '',
        dateStr: day.gregorianDate,
        language: currentLang
      }, true);
      setDailyInsight(result);
    } catch (e) {
      console.error('Failed to regenerate insight:', e);
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

  if (!day) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = day.gregorianDate === todayStr;

  // Daily Moon Phase calculation from lunar cycle based on the date
  const calculatedMoonPhase = useMemo(() => {
    return calculateMoonPhaseFromDate(day.gregorianDate, currentLang);
  }, [day.gregorianDate, currentLang]);

  // Calculates exact reference timestamp based on user preference or live time
  const refTimeMs = useMemo(() => {
    if (isToday && referenceMode === 'live') {
      return Date.now();
    }

    const parseTimeOnDate = (timeStr?: string) => {
      if (!timeStr) return new Date(`${day.gregorianDate}T12:00:00`).getTime();
      const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return new Date(`${day.gregorianDate}T12:00:00`).getTime();
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      const d = new Date(`${day.gregorianDate}T00:00:00`);
      d.setHours(h, m, 0, 0);
      return d.getTime();
    };

    if (referenceMode === 'sunrise' && day.sunrise) {
      return parseTimeOnDate(day.sunrise);
    }
    if (referenceMode === 'sunset' && day.sunset) {
      return parseTimeOnDate(day.sunset);
    }
    if (referenceMode === 'midday') {
      return new Date(`${day.gregorianDate}T12:00:00`).getTime();
    }
    // Default fallback when viewing non-today dates in 'live' mode: evaluate at 12:00 PM noon
    return new Date(`${day.gregorianDate}T12:00:00`).getTime();
  }, [day.gregorianDate, day.sunrise, day.sunset, isToday, referenceMode]);

  // Open Pop-up window positioned directly below trigger button using fixed coordinate offsets
  const openPopupBelow = (e: React.MouseEvent<HTMLElement>, type: ActivePopup['type'], title: string, data?: any) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const top = rect.bottom + 8; // Fixed vertical coordinate offset directly below trigger button
    const screenW = window.innerWidth;
    const isMobile = screenW < 640;
    const popupW = isMobile ? Math.max(300, screenW - 24) : 400;
    
    // Clamp horizontally to prevent viewport clipping
    let left = rect.left;
    if (left + popupW > screenW - 12) {
      left = Math.max(12, screenW - popupW - 12);
    }
    if (left < 12) left = 12;

    setActivePopup({
      type,
      title,
      data,
      top,
      left,
      width: popupW
    });
  };

  const closePopup = () => setActivePopup(null);

  // -------------------------------------------------------------
  // REFACTORED TITHI DETAILS & ACCURATE ELAPSED PHASE CALCULATOR
  // -------------------------------------------------------------
  const tithiDetails = useMemo(() => {
    if (!day?.tithiTiming?.startDateTime || !day?.tithiTiming?.endDateTime) {
      return null;
    }
    const startMs = new Date(day.tithiTiming.startDateTime).getTime();
    const endMs = new Date(day.tithiTiming.endDateTime).getTime();
    const totalMs = Math.max(1, endMs - startMs);
    const totalMinutes = Math.round(totalMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalRemMinutes = totalMinutes % 60;

    let percent = 0;
    let phaseName = {
      en: 'Quarter 1: Prathama Phase (0-25%)',
      kn: '೧ನೇ ಪಾದ: ಆರಂಭಿಕ ಪ್ರವೇಶ ಕಾಲ (೦-೨೫%)',
      hi: 'प्रथम चरण: प्रारम्भिक काल (०-२५%)'
    };
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';

    if (refTimeMs >= endMs) {
      percent = 100;
      status = 'completed';
      phaseName = { en: 'Concluded Phase (100%)', kn: 'ಮುಕ್ತಾಯ ಹಂತ (೧೦೦%)', hi: 'समाप्त चरण (१००%)' };
    } else if (refTimeMs <= startMs) {
      percent = 0;
      status = 'upcoming';
      phaseName = { en: 'Upcoming (Yet to Begin)', kn: 'ಇನ್ನೂ ಆರಂಭವಾಗಬೇಕಿದೆ (೦%)', hi: 'आगामी (०%)' };
    } else {
      status = 'active';
      const elMs = refTimeMs - startMs;
      percent = Math.min(100, Math.max(0, Math.round((elMs / totalMs) * 100)));
      if (percent < 25) {
        phaseName = { en: 'Quarter 1: Prathama Phase (0-25%)', kn: '೧ನೇ ಪಾದ: ಆರಂಭಿಕ ಪ್ರವೇಶ ಕಾಲ (೦-೨೫%)', hi: 'प्रथम चरण: प्रारम्भ काल (०-२५%)' };
      } else if (percent < 50) {
        phaseName = { en: 'Quarter 2: Ascending Phase (25-50%)', kn: '೨ನೇ ಪಾದ: ವೃದ್ಧಿ ಕಾಲ (೨೫-೫೦%)', hi: 'द्वितीय चरण: वृद्धि काल (२५-५०%)' };
      } else if (percent < 75) {
        phaseName = { en: 'Quarter 3: Peak Madhya Phase (50-75%)', kn: '೩ನೇ ಪಾದ: ಮಧ್ಯಾಹ್ನ ಶಕ್ತಿ ಕಾಲ (೫೦-೭೫%)', hi: 'तृतीय चरण: मध्य वेला (५०-७५%)' };
      } else {
        phaseName = { en: 'Quarter 4: Concluding Phase (75-100%)', kn: '೪ನೇ ಪಾದ: ಮುಕ್ತಾಯ ಸಂಧ್ಯಾ ಕಾಲ (೭೫-೧೦೦%)', hi: 'चतुर्थ चरण: समापन वेला (७५-१००%)' };
      }
    }

    const elapsedMs = Math.max(0, Math.min(totalMs, refTimeMs - startMs));
    const elapsedMinutes = Math.round(elapsedMs / 60000);
    const elHrs = Math.floor(elapsedMinutes / 60);
    const elMins = elapsedMinutes % 60;

    const remainingMs = Math.max(0, Math.min(totalMs, endMs - refTimeMs));
    const remainingMinutes = Math.round(remainingMs / 60000);
    const remHrs = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;

    const durationText = currentLang === 'kn'
      ? `${totalHours} ಗಂಟೆ ${totalRemMinutes} ನಿಮಿಷ`
      : currentLang === 'hi'
      ? `${totalHours} घण्टे ${totalRemMinutes} मिनट`
      : `${totalHours} hrs ${totalRemMinutes} mins`;

    const elapsedText = currentLang === 'kn'
      ? `${elHrs}ಗಂ ${elMins}ನಿ ಸಂದಿದೆ`
      : `${elHrs}h ${elMins}m elapsed`;

    const remainingText = currentLang === 'kn'
      ? `${remHrs}ಗಂ ${remMins}ನಿ ಬಾಕಿ`
      : `${remHrs}h ${remMins}m remaining`;

    return {
      startDateTimeStr: day.tithiTiming.startTimeFormatted[currentLang] || day.tithiTiming.startTime,
      endDateTimeStr: day.tithiTiming.endTimeFormatted[currentLang] || day.tithiTiming.endTime,
      totalHours,
      totalRemMinutes,
      totalMinutes,
      durationText,
      percent,
      status,
      phaseName,
      elapsedText,
      remainingText
    };
  }, [day?.tithiTiming, refTimeMs, currentLang]);

  // Backward-compatible tithiProgress accessor
  const tithiProgress = useMemo(() => {
    if (!tithiDetails) {
      return { percent: 50, remainingText: '', elapsedText: '', durationText: '' };
    }
    return {
      percent: tithiDetails.percent,
      remainingText: tithiDetails.remainingText,
      elapsedText: tithiDetails.elapsedText,
      durationText: tithiDetails.durationText
    };
  }, [tithiDetails]);

  // ------------------------------------------------------------------
  // REFACTORED NAKSHATRA DETAILS & ACCURATE ELAPSED PHASE CALCULATOR
  // ------------------------------------------------------------------
  const nakshatraDetails = useMemo(() => {
    const timing = day?.nakshatraTiming || day?.padaTiming;
    if (!timing?.startDateTime || !timing?.endDateTime) {
      return null;
    }
    const startMs = new Date(timing.startDateTime).getTime();
    const endMs = new Date(timing.endDateTime).getTime();
    const totalMs = Math.max(1, endMs - startMs);
    const totalMinutes = Math.round(totalMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalRemMinutes = totalMinutes % 60;

    let percent = 0;
    let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
    let phaseName = {
      en: 'Quarter 1: Pada 1 Window (0-25%)',
      kn: '೧ನೇ ಪಾದ ಕಾಲ (೦-೨೫%)',
      hi: 'प्रथम चरण काल (०-२५%)'
    };

    if (refTimeMs >= endMs) {
      percent = 100;
      status = 'completed';
      phaseName = { en: 'Completed Phase (100%)', kn: 'ಮುಕ್ತಾಯ ಹಂತ (೧೦೦%)', hi: 'समाप्त चरण (१००%)' };
    } else if (refTimeMs <= startMs) {
      percent = 0;
      status = 'upcoming';
      phaseName = { en: 'Upcoming (Yet to Begin)', kn: 'ಇನ್ನೂ ಆರಂಭವಾಗಬೇಕಿದೆ (೦%)', hi: 'आगामी (०%)' };
    } else {
      status = 'active';
      const elMs = refTimeMs - startMs;
      percent = Math.min(100, Math.max(0, Math.round((elMs / totalMs) * 100)));
      if (percent < 25) {
        phaseName = { en: 'Quarter 1: Pada 1 Window (0-25%)', kn: '೧ನೇ ಪಾದ ಕಾಲಾವಧಿ (೦-೨೫%)', hi: 'प्रथम चरण वेला (०-२५%)' };
      } else if (percent < 50) {
        phaseName = { en: 'Quarter 2: Pada 2 Window (25-50%)', kn: '೨ನೇ ಪಾದ ಕಾಲಾವಧಿ (೨೫-೫೦%)', hi: 'द्वितीय चरण वेला (२५-५०%)' };
      } else if (percent < 75) {
        phaseName = { en: 'Quarter 3: Pada 3 Window (50-75%)', kn: '೩ನೇ ಪಾದ ಕಾಲಾವಧಿ (೫೦-೭೫%)', hi: 'तृतीय चरण वेला (५०-७೫%)' };
      } else {
        phaseName = { en: 'Quarter 4: Pada 4 Window (75-100%)', kn: '೪ನೇ ಪಾದ ಕಾಲಾವಧಿ (೭೫-೧೦೦%)', hi: 'चतुर्थ चरण वेला (७५-१००%)' };
      }
    }

    const elapsedMs = Math.max(0, Math.min(totalMs, refTimeMs - startMs));
    const elapsedMinutes = Math.round(elapsedMs / 60000);
    const elHrs = Math.floor(elapsedMinutes / 60);
    const elMins = elapsedMinutes % 60;

    const remainingMs = Math.max(0, Math.min(totalMs, endMs - refTimeMs));
    const remainingMinutes = Math.round(remainingMs / 60000);
    const remHrs = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;

    const durationText = currentLang === 'kn'
      ? `${totalHours} ಗಂಟೆ ${totalRemMinutes} ನಿಮಿಷ`
      : currentLang === 'hi'
      ? `${totalHours} घण्टे ${totalRemMinutes} मिनट`
      : `${totalHours} hrs ${totalRemMinutes} mins`;

    const elapsedText = currentLang === 'kn'
      ? `${elHrs}ಗಂ ${elMins}ನಿ ಸಂದಿದೆ`
      : `${elHrs}h ${elMins}m elapsed`;

    const remainingText = currentLang === 'kn'
      ? `${remHrs}ಗಂ ${remMins}ನಿ ಬಾಕಿ`
      : `${remHrs}h ${remMins}m remaining`;

    const startDateTimeStr = day?.nakshatraTiming?.startDateFormatted?.[currentLang] || (day?.padaTiming?.startDateFormatted?.[currentLang] ?? timing.startTime);
    const endDateTimeStr = day?.nakshatraTiming?.endDateFormatted?.[currentLang] || (day?.padaTiming?.endDateFormatted?.[currentLang] ?? timing.endTime);

    return {
      startDateTimeStr,
      endDateTimeStr,
      totalHours,
      totalRemMinutes,
      totalMinutes,
      durationText,
      percent,
      status,
      phaseName,
      elapsedText,
      remainingText
    };
  }, [day?.nakshatraTiming, day?.padaTiming, refTimeMs, currentLang]);

  // Backward-compatible nakshatraProgress accessor
  const nakshatraProgress = useMemo(() => {
    if (!nakshatraDetails) {
      return { percent: 50, remainingText: '', elapsedText: '', durationText: '' };
    }
    return {
      percent: nakshatraDetails.percent,
      remainingText: nakshatraDetails.remainingText,
      elapsedText: nakshatraDetails.elapsedText,
      durationText: nakshatraDetails.durationText
    };
  }, [nakshatraDetails]);

  // -----------------------------------------------------------------------------------
  // REFACTORED ALL 4 NAKSHATRA PADAS MATRIX: START/END, DURATION & ACTIVE PHASE TRACKER
  // -----------------------------------------------------------------------------------
  const padasList = useMemo(() => {
    if (!day) return [];
    const nakIndex = (day.nakshatraIndex - 1 + 27) % 27;
    const rawSyllables = (day.charanaLetter || '').split(/[\s,–-]+/).filter(Boolean);

    const list = [];
    const nakshatraName = day.nakshatra;
    const refDate = new Date(`${day.gregorianDate}T12:00:00`);

    for (let p = 1; p <= 4; p++) {
      const syllable = rawSyllables[p - 1] || `Pada ${p}`;
      const padaInfo = calculatePadaTimings(refDate, nakIndex, p, syllable, nakshatraName);

      const startMs = new Date(padaInfo.startDateTime).getTime();
      const endMs = new Date(padaInfo.endDateTime).getTime();
      const totalMs = Math.max(1, endMs - startMs);
      const totalMins = Math.round(totalMs / 60000);
      const totHrs = Math.floor(totalMins / 60);
      const totRemMins = totalMins % 60;

      let percent = 0;
      let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
      let elapsedMins = 0;
      let remainingMins = totalMins;

      if (refTimeMs >= endMs) {
        percent = 100;
        status = 'completed';
        elapsedMins = totalMins;
        remainingMins = 0;
      } else if (refTimeMs <= startMs) {
        percent = 0;
        status = 'upcoming';
        elapsedMins = 0;
        remainingMins = totalMins;
      } else {
        status = 'active';
        const elMs = refTimeMs - startMs;
        percent = Math.min(100, Math.max(1, Math.round((elMs / totalMs) * 100)));
        elapsedMins = Math.round(elMs / 60000);
        remainingMins = Math.max(0, Math.round((endMs - refTimeMs) / 60000));
      }

      const elHrs = Math.floor(elapsedMins / 60);
      const elRemMins = elapsedMins % 60;
      const remHrs = Math.floor(remainingMins / 60);
      const remRemMins = remainingMins % 60;

      list.push({
        padaNumber: p,
        syllable,
        startDateTime: padaInfo.startDateTime,
        endDateTime: padaInfo.endDateTime,
        startDateFormatted: padaInfo.startDateFormatted,
        endDateFormatted: padaInfo.endDateFormatted,
        durationHours: totHrs,
        durationMinutes: totRemMins,
        totalMinutes: totalMins,
        durationFormattedText: currentLang === 'kn'
          ? `${totHrs > 0 ? `${totHrs} ಗಂಟೆ ` : ''}${totRemMins} ನಿಮಿಷ`
          : currentLang === 'hi'
          ? `${totHrs > 0 ? `${totHrs} घण्टे ` : ''}${totRemMins} मिनट`
          : `${totHrs > 0 ? `${totHrs}h ` : ''}${totRemMins}m`,
        percent,
        status,
        isCurrentActive: status === 'active' || (day.pada === p && status !== 'completed'),
        elapsedText: currentLang === 'kn'
          ? `${elHrs > 0 ? `${elHrs}ಗಂ ` : ''}${elRemMins}ನಿ ಸಂದಿದೆ`
          : `${elHrs > 0 ? `${elHrs}h ` : ''}${elRemMins}m elapsed`,
        remainingText: currentLang === 'kn'
          ? `${remHrs > 0 ? `${remHrs}ಗಂ ` : ''}${remRemMins}ನಿ ಬಾಕಿ`
          : `${remHrs > 0 ? `${remHrs}h ` : ''}${remRemMins}m remaining`
      });
    }

    return list;
  }, [day, refTimeMs, currentLang]);

  const padaProgress = useMemo(() => {
    if (!day?.padaTiming?.startDateTime || !day?.padaTiming?.endDateTime) {
      return { percent: 50, remainingText: '', elapsedText: '' };
    }
    const start = new Date(day.padaTiming.startDateTime).getTime();
    const end = new Date(day.padaTiming.endDateTime).getTime();
    const total = Math.max(1, end - start);
    const progressMs = refTimeMs < start ? 0 : refTimeMs > end ? total : (refTimeMs - start);
    const percent = Math.min(100, Math.max(0, Math.round((progressMs / total) * 100)));
    const remMins = Math.max(0, Math.round((end - refTimeMs) / 60000));
    const elapMins = Math.max(0, Math.round((refTimeMs - start) / 60000));
    const remHrs = Math.floor(remMins / 60);
    const remRMins = remMins % 60;

    return {
      percent,
      remainingText: currentLang === 'kn' ? `${remMins} ನಿಮಿಷ ಬಾಕಿ (${remHrs}ಗಂ ${remRMins}ನಿ)` : `${remMins}m remaining (${remHrs}h ${remRMins}m)`,
      elapsedText: currentLang === 'kn' ? `${elapMins} ನಿಮಿಷ ಸಂದಿದೆ` : `${elapMins}m elapsed`
    };
  }, [day?.padaTiming, refTimeMs, currentLang]);

  const nakshatraTransition = useMemo(() => {
    const timing = day?.nakshatraTiming || day?.padaTiming;
    if (!timing?.startDateTime || !timing?.endDateTime) return null;
    const startDate = new Date(timing.startDateTime);
    const endDate = new Date(timing.endDateTime);
    const dayDate = new Date(day?.gregorianDate || '');
    
    const isPrevDayStart = startDate.getDate() !== dayDate.getDate();
    const isNextDayEnd = endDate.getDate() !== dayDate.getDate();
    const spansTwoDates = startDate.toDateString() !== endDate.toDateString();

    const startTimeFormatted = day?.nakshatraTiming?.startDateFormatted || (day?.padaTiming?.startDateFormatted ?? { en: timing.startTime, kn: timing.startTime, hi: timing.startTime });
    const endTimeFormatted = day?.nakshatraTiming?.endDateFormatted || (day?.padaTiming?.endDateFormatted ?? { en: timing.endTime, kn: timing.endTime, hi: timing.endTime });

    return {
      isPrevDayStart,
      isNextDayEnd,
      spansTwoDates,
      startTimeFormatted,
      endTimeFormatted,
      durationHours: day?.nakshatraTiming ? day.nakshatraTiming.durationHours : (day?.padaTiming ? day.padaTiming.durationHours : 0),
      durationFormatted: day?.nakshatraTiming ? day.nakshatraTiming.durationFormatted : (day?.padaTiming ? day.padaTiming.durationFormatted : { en: '', kn: '', hi: '' })
    };
  }, [day?.nakshatraTiming, day?.padaTiming, day?.gregorianDate]);

  const currentMuhurtaStatus = useMemo(() => {
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();

    const parseTimeToMin = (timeStr?: string) => {
      if (!timeStr) return -1;
      const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return -1;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const isWithin = (range?: { start: string; end: string }) => {
      if (!range?.start || !range?.end) return false;
      const s = parseTimeToMin(range.start);
      const e = parseTimeToMin(range.end);
      if (s === -1 || e === -1) return false;
      return curMin >= s && curMin <= e;
    };

    // Check Ashubh windows first
    if (isWithin(day?.rahuKaal)) {
      return {
        type: 'ashubh' as const,
        name: { kn: 'ರಾಹು ಕಾಲ', en: 'Rahu Kaal', hi: 'राहु काल' },
        time: `${day?.rahuKaal.start} - ${day?.rahuKaal.end}`,
        advice: {
          kn: 'ಯಾವುದೇ ಹೊಸ ಕೆಲಸ, ಒಪ್ಪಂದ, ಸಾಲ ಅಥವಾ ಪ್ರಯಾಣ ಆರಂಭಿಸಬೇಡಿ (ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ ಕಾಲ)',
          en: 'Strictly avoid commencing any new ventures, financial deeds, or agreements right now.',
          hi: 'कोई भी नवीन कार्य, अनुबंध या यात्रा आरम्भ न करें (वर्ज्य काल)।'
        }
      };
    }
    if (isWithin(day?.yamagandaKaal)) {
      return {
        type: 'ashubh' as const,
        name: { kn: 'ಯಮಗಂಡ ಕಾಲ', en: 'Yamaganda Kaal', hi: 'यमगण्ड काल' },
        time: `${day?.yamagandaKaal.start} - ${day?.yamagandaKaal.end}`,
        advice: {
          kn: 'ಪ್ರಯಾಣ ಮತ್ತು ಪ್ರಮುಖ ಹಣಕಾಸು ಒಪ್ಪಂದಗಳನ್ನು ತಪ್ಪಿಸಿ',
          en: 'Avoid journeys, critical agreements, and decisional life deeds right now.',
          hi: 'यात्रा एवं मुख्य अनुबंध टालें।'
        }
      };
    }
    if (isWithin(day?.durmuhurta)) {
      return {
        type: 'ashubh' as const,
        name: { kn: 'ದುರ್ಮುಹೂರ್ತ', en: 'Durmuhurta', hi: 'दुर्मुहूर्त' },
        time: `${day?.durmuhurta?.start} - ${day?.durmuhurta?.end}`,
        advice: {
          kn: 'ವಾರಾನುಗುಣ ಅಶುಭ ಸೌರ ಮುಹೂರ್ತ; ಶುಭ ಕಾರ್ಯ ಆರಂಭಿಸಬೇಡಿ',
          en: 'Adverse astrological period; do not commence auspicious ceremonies right now.',
          hi: 'अशुभ सौर्य वेला; मांगलिक कार्य आरम्भ न करें।'
        }
      };
    }
    if (isWithin(day?.varjyam)) {
      return {
        type: 'ashubh' as const,
        name: { kn: 'ವರ್ಜ್ಯಂ (ವಿಷ ಘಳಿಗೆ)', en: 'Varjyam (Visha Kaal)', hi: 'वर्ज्यम् (विष काल)' },
        time: `${day?.varjyam?.start} - ${day?.varjyam?.end}`,
        advice: {
          kn: 'ನಕ್ಷತ್ರದ ವಿಷಕಾರಿ ಕಾಲಾವಧಿ; ಮಾಂಗಲ್ಯ ಕಾರ್ಯ & ಗೃಹಪ್ರವೇಶ ನಿಷೇಧ',
          en: 'Poisonous Nakshatra window; strictly shunned for auspicious deeds.',
          hi: 'विष घटी; मांगलिक कार्य हेतु वर्जित।'
        }
      };
    }
    if (isWithin(day?.gulikaKaal)) {
      return {
        type: 'ashubh' as const,
        name: { kn: 'ಗುಳಿಕ ಕಾಲ', en: 'Gulika Kaal', hi: 'गुलिक काल' },
        time: `${day?.gulikaKaal.start} - ${day?.gulikaKaal.end}`,
        advice: {
          kn: 'ವಿಳಂಬಕಾರಿ ಶನಿ ಪ್ರಭಾವಿತ ಅವಧಿ; ಶುಭಾರಂಭ ತಪ್ಪಿಸಿ',
          en: 'Sluggish Saturn period; avoid starting new investments or ceremonies.',
          hi: 'शनि प्रभाव वेला; नवीन आरम्भ से बचें।'
        }
      };
    }

    // Check Shubh windows
    if (isWithin(day?.abhijitMuhurta)) {
      return {
        type: 'shubh' as const,
        name: { kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ', en: 'Abhijit Muhurta', hi: 'अभिजित मुहूर्त' },
        time: `${day?.abhijitMuhurta.start} - ${day?.abhijitMuhurta.end}`,
        advice: {
          kn: 'ಮಧ್ಯಾಹ್ನದ ಸರ್ವಸಿದ್ಧಿ ಕಾಲ! ಹೊಸ ವ್ಯಾಪಾರ, ಒಪ್ಪಂದ, ಖರೀದಿ & ಸತ್ಕಾರ್ಯಕ್ಕೆ ಪರಮೋತ್ಕೃಷ್ಟ',
          en: 'Supreme midday victory window! Highly auspicious for good deeds and new beginnings.',
          hi: 'मध्याह्न सर्वसिद्धि काल! नवीन आरम्भ व मांगलिक कार्यों हेतु सर्वश्रेष्ठ।'
        }
      };
    }
    if (isWithin(day?.brahmaMuhurta)) {
      return {
        type: 'shubh' as const,
        name: { kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ', en: 'Brahma Muhurta', hi: 'ब्रह्म मुहूर्त' },
        time: `${day?.brahmaMuhurta.start} - ${day?.brahmaMuhurta.end}`,
        advice: {
          kn: 'ಪ್ರಶಾಂತ ಅಮೃತ ವೇಳೆ! ಜಪ, ಧ್ಯಾನ, ವೇದಾಭ್ಯಾಸ ಹಾಗೂ ದೈವ ಚಿಂತನೆಗೆ ಶ್ರೇಷ್ಠ',
          en: 'Divine dawn nectar window! Best for spiritual meditation and study.',
          hi: 'अमृत वेला! ध्यान, जप व विद्यारम्भ हेतु प्रशस्त।'
        }
      };
    }
    if (isWithin(day?.amritKaal)) {
      return {
        type: 'shubh' as const,
        name: { kn: 'ಅಮೃತ ಕಾಲ', en: 'Amrit Kaal', hi: 'अमृत काल' },
        time: `${day?.amritKaal?.start} - ${day?.amritKaal?.end}`,
        advice: {
          kn: 'ನಕ್ಷತ್ರಾನುಸಾರ ಅಮೃತ ಘಳಿಗೆ! ದೇವತಾ ಪೂಜೆ, ಹೂಡಿಕೆ ಹಾಗೂ ಸತ್ಕಾರ್ಯಕ್ಕೆ ಶುಭ',
          en: 'Nectar window! Auspicious for prayers, investments, and sacred deeds.',
          hi: 'अमृत काल! पूजा, निवेश व शुभ कार्यों हेतु उत्तम।'
        }
      };
    }
    if (isWithin(day?.vijayaMuhurta)) {
      return {
        type: 'shubh' as const,
        name: { kn: 'ವಿಜಯ ಮುಹೂರ್ತ', en: 'Vijaya Muhurta', hi: 'विजय मुहूर्त' },
        time: `${day?.vijayaMuhurta?.start} - ${day?.vijayaMuhurta?.end}`,
        advice: {
          kn: 'ಅಪರಾಹ್ನದ ವಿಜಯ ಕಾಲ! ಒಪ್ಪಂದ, ಮಾತುಕತೆ, ಜಯ ಹಾಗೂ ಕಾರ್ಯಸಿದ್ಧಿಗೆ ಫಲದಾಯಕ',
          en: 'Afternoon victory window! Great for negotiations, contracts, and overcoming obstacles.',
          hi: 'विजय वेला! सफलता, बातचीत व अनुबंध हेतु मंगलकारी।'
        }
      };
    }
    if (isWithin(day?.godhuliMuhurta)) {
      return {
        type: 'shubh' as const,
        name: { kn: 'ಗೋಧೂಳಿ ಮುಹೂರ್ತ', en: 'Godhuli Muhurta', hi: 'गोधूलि मुहूर्त' },
        time: `${day?.godhuliMuhurta?.start} - ${day?.godhuliMuhurta?.end}`,
        advice: {
          kn: 'ಸಂಜೆಯ ಪವಿತ್ರ ಸಂಧಿಕಾಲ! ದೀಪ ಪ್ರಜ್ವಲನೆ, ಲಕ್ಷ್ಮೀ ಆರಾಧನೆಗೆ ಶ್ರೇಷ್ಠ',
          en: 'Twilight sunset window! Ideal for lighting the lamp and Lakshmi prayers.',
          hi: 'गोधूलि वेला! दीप प्रज्वलन एवं लक्ष्मी पूजन हेतु पावन।'
        }
      };
    }

    return {
      type: 'neutral' as const,
      name: { kn: 'ಸಾಮಾನ್ಯ ಕಾಲ', en: 'Standard Window', hi: 'सामान्य वेला' },
      time: '',
      advice: {
        kn: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ತೀವ್ರ ಅಶುಭ ಕಾಲವಿಲ್ಲ; ಶುಭ ಮುಹೂರ್ತ ಪಟ್ಟಿ ಪರಿಶೀಲಿಸಿ ಸತ್ಕಾರ್ಯಗಳನ್ನು ನಿರ್ಧರಿಸಿ.',
        en: 'No intense inauspicious window active right now; review the Shubh list to plan good deeds.',
        hi: 'वर्तमान में कोई तीव्र अशुभ काल नहीं है; शुभ मुहूर्त सूची देखकर कार्य सम्पन्न करें।'
      }
    };
  }, [day]);

  const toggleDailyItem = (index: number) => {
    setCheckedDailyItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Standardized universal daily pooja items (Samagri) applicable for every day of the year
  const dailyPoojaItems = [
    {
      en: '1. Diya / Deepa: Brass/Silver/Clay Oil or Ghee lamp with cotton wicks (ದೀಪ)',
      kn: '೧. ದೀಪ: ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ ಅಥವಾ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಮತ್ತು ಹತ್ತಿಯ ಬತ್ತಿಗಳು',
      hi: '१. दीप: शुद्ध गौघृत अथवा तिल तेल का दीपक एवं रुई की बत्तियां'
    },
    {
      en: '2. Agarbatti & Dhoopa: Natural fragrance incense sticks & camphor (ಧೂಪ/ಅಗರಬತ್ತಿ)',
      kn: '೨. ಅಗರಬತ್ತಿ ಮತ್ತು ಧೂಪ: ಶುದ್ಧ ಸುಗಂಧ ಧೂಪ ಹಾಗೂ ಮಂಗಳಾರತಿ ಕರ್ಪೂರ',
      hi: '२. अगरबत्ती एवं धूप: सुगन्धित धूपबत्ती एवं कर्पूर'
    },
    {
      en: '3. Fresh Flowers & Tulasi: Freshly picked sacred flowers and Tulasi leaves (ಪುಷ್ಪ-ತುಳಸಿ)',
      kn: '೩. ತಾಜಾ ಪುಷ್ಪ ಮತ್ತು ತುಳಸಿ: ಪೂಜೆಗೆ ಅರ್ಪಿಸಲು ಪರಿಮಳಯುಕ್ತ ಹೂವುಗಳು ಹಾಗೂ ತುಳಸೀದಳ',
      hi: '३. ताजे पुष्प एवं तुलसी दल: पूजा हेतु सुगन्धित पुष्प व पवित्र तुलसी'
    },
    {
      en: '4. Sacred Kumkum, Chandana & Haldi: Pure Vermilion, Sandalwood paste, Turmeric (ಗಂಧ-ಕುಂಕುಮ)',
      kn: '೪. ಗಂಧ, ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ: ಶ್ರೀಗಂಧದ ಲೇಪನ, ಶುದ್ಧ ಅರಿಶಿನ ಹಾಗೂ ಕುಂಕುಮ',
      hi: '४. चन्दन, रोली एवं हल्दी: शुद्ध चन्दन लेप, कुंकुम व हल्दी'
    },
    {
      en: '5. Akshata: Sacred unbroken raw rice mixed with a pinch of turmeric and ghee (ಅಕ್ಷತೆ)',
      kn: '೫. ಅಕ್ಷತೆ: ಅರಿಶಿನ ಮತ್ತು ತುಪ್ಪ ಮಿಶ್ರಿತ ಮುರಿಯದ ಪವಿತ್ರ ಬಿಳಿ ಅಕ್ಕಿ',
      hi: '५. अक्षत: हल्दी मिश्रित अखण्ड चावल'
    },
    {
      en: '6. Sacred Water (Theertha Patra): Pure Ganga water or clean drinking water with Uddharane (ತೀರ್ಥ)',
      kn: '೬. ಪಂಚಪಾತ್ರೆ-ಉದ್ಧರಣೆ: ಶುದ್ಧ ತೀರ್ಥೋದಕ (ಗಂಗಾಜಲ) ಹಾಗೂ ಆಚಮನ ಪಾತ್ರೆ',
      hi: '६. पंचपात्र एवं आचमनी: शुद्ध जल एवं गंगाजल'
    },
    {
      en: '7. Naivedya & Prasadam: Fresh fruits, milk, raisins, dry fruits, or jaggery (ನೈವೇದ್ಯ)',
      kn: '೭. ಮಹಾ ನೈವೇದ್ಯ: ಬಾಳೆಹಣ್ಣು, ಹಾಲು, ಬೆಲ್ಲ, ಗೋಡಂಬಿ, ದ್ರಾಕ್ಷಿ ಅಥವಾ ಸಾತ್ವಿಕ ಪ್ರಸಾದ',
      hi: '७. नैवेद्य एवं प्रसाद: ऋतुफल, गौदुग्ध, गुड़, मिश्री अथवा सात्त्विक भोग'
    },
    {
      en: '8. Ghanti & Shankha: Sacred puja bell and conch shell (ಘಂಟೆ-ಶಂಖ)',
      kn: '೮. ಪೂಜಾ ಘಂಟೆ ಮತ್ತು ಶಂಖ: ಆರಾಧನೆಯ ವೇಳೆ ನಾದ ಮಾಡಲು ಪವಿತ್ರ ಗಂಟೆ',
      hi: '८. पूजा घण्टी एवं शंख: आरती के समय नाद हेतु पवित्र घंटी'
    }
  ];

  // Generic chronological morning ritual guide applicable for any day of the year
  const genericMorningRituals = [
    {
      step: 1,
      title: {
        en: 'Brahma Muhurta Awakening & Karadarshana (04:30 AM - 05:30 AM)',
        kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ ಜಾಗರಣೆ ಮತ್ತು ಕರದರ್ಶನ (೪:೩೦ AM - ೫:೩೦ AM)',
        hi: 'ब्रह्म मुहूर्त जागरण एवं करदर्शन (४:३० AM - ५:३೦ AM)'
      },
      desc: {
        en: 'Wake up before sunrise, look at palms reciting "Karagre Vasate Lakshmi...", touch mother Earth seeking forgiveness, and meditate on the Supreme.',
        kn: 'ಸೂರ್ಯೋದಯಕ್ಕಿಂತ ಮುಂಚೆ ಎದ್ದು "ಕರಾಗ್ರೇ ವಸತೇ ಲಕ್ಷ್ಮೀಃ..." ಹೇಳುತ್ತಾ ಅಂಗೈಗಳನ್ನು ದರ್ಶಿಸಿ, ಭೂಮಿದೇವಿಗೆ ಕ್ಷಮೆ ಯಾಚಿಸಿ ಈಶ್ವರ ಧ್ಯಾನ ಮಾಡುವುದು.',
        hi: 'सूर्योदय पूर्व उठकर "कराग्रे वसते लक्ष्मीः..." श्लोक से हथेलियों का दर्शन करें एवं भूमि वन्दना करें।'
      }
    },
    {
      step: 2,
      title: {
        en: 'Shaucha, Snana & Clean Clothing (05:30 AM - 06:15 AM)',
        kn: 'ಶೌಚ, ಶರೀರ ಶುದ್ಧಿ, ಸ್ನಾನ ಮತ್ತು ಶುದ್ಧ ವಸ್ತ್ರಧಾರಣೆ (೫:೩೦ AM - ೬:೧೫ AM)',
        hi: 'शौच, पवित्र स्नान एवं शुद्ध वस्त्र धारण (५:३० AM - ६:१५ AM)'
      },
      desc: {
        en: 'Take a purifying bath invoking sacred rivers (Ganga, Yamuna, Godavari). Wear clean, washed traditional clothes suitable for puja.',
        kn: 'ತಣ್ಣೀರು ಅಥವಾ ಬೆಚ್ಚಗಿನ ನೀರಿನಲ್ಲಿ "ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ..." ನದಿಸ್ಮರಣೆ ಮಾಡಿ ಸ್ನಾನ ಮುಗಿಸಿ ಶುದ್ಧ ಪೂಜಾ ವಸ್ತ್ರ ಧರಿಸುವುದು.',
        hi: 'पवित्र तीर्थों का स्मरण करते हुए स्नान करें तथा धुले हुए शुद्ध वस्त्र धारण करें।'
      }
    },
    {
      step: 3,
      title: {
        en: 'Surya Arghya & Gayatri Sandhyavandana (At Sunrise)',
        kn: 'ಸೂರ್ಯೋದಯ ಕಾಲದಲ್ಲಿ ಸೂರ್ಯಾರ್ಘ್ಯ ಮತ್ತು ಗಾಯತ್ರೀ ಸಂಧ್ಯಾವಂದನೆ (ಸೂರ್ಯೋದಯಕ್ಕೆ)',
        hi: 'सूर्योदय काल में सूर्यार्घ्य एवं गायत्री सन्ध्यावन्दन (सूर्योदय समय)'
      },
      desc: {
        en: 'Offer water to the rising Sun facing East with a copper pot, chanting the Gayatri Mantra (108 or 28 times) for wisdom and vitality.',
        kn: 'ಪೂರ್ವಾಭಿಮುಖವಾಗಿ ನಿಂತು ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಸೂರ್ಯದೇವನಿಗೆ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ, ಗಾಯತ್ರಿ ಜಪ ಅಥವಾ ಆದಿತ್ಯ ಹೃದಯ ಪಠಣ ಮಾಡುವುದು.',
        hi: 'ताम्रपात्र से पूर्व दिशा में भगवान सूर्य को अर्घ्य दें तथा गायत्री मन्त्र का जप करें।'
      }
    },
    {
      step: 4,
      title: {
        en: 'Deepa Prajvalana & Altar Cleansing (06:30 AM - 07:00 AM)',
        kn: 'ದೀಪ ಪ್ರಜ್ವಲನೆ ಮತ್ತು ದೇವರ ಮನೆ ಶುದ್ಧೀಕರಣ (೬:೩೦ AM - ೭:೦೦ AM)',
        hi: 'दीप प्रज्वलन एवं पूजा गृह शुद्धि (६:३० AM - ७:०० AM)'
      },
      desc: {
        en: 'Clean the puja mandir, wipe deity vigrahas, light the holy Ghee/Oil lamp and incense. Ring the bell reciting "Agamartham tu devanam...".',
        kn: 'ದೇವರ ಮಂಟಪವನ್ನು ಶುದ್ಧಗೊಳಿಸಿ, ದೇವರಿಗೆ ಹಳೆಯ ಹೂಗಳನ್ನು ತೆಗೆದು, ಶುದ್ಧ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ, ಘಂಟಾನಾದದೊಂದಿಗೆ ಪೂಜೆಗೆ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳುವುದು.',
        hi: 'पूजा स्थान को स्वच्छ कर, दीपक व अगरबत्ती प्रज्वलित करें एवं घंटी बजाकर देवों का आह्वान करें।'
      }
    },
    {
      step: 5,
      title: {
        en: 'Pancha Upachara Puja: Gandha, Pushpa, Dhoopa, Deepa, Naivedya',
        kn: 'ಪಂಚೋಪಚಾರ ನಿತ್ಯ ಪೂಜೆ: ಗಂಧ, ಪುಷ್ಪ, ಧೂಪ, ದೀಪ ಮತ್ತು ನೈವೇದ್ಯ',
        hi: 'पंचोपचार नित्य पूजन: गन्ध, पुष्प, धूप, दीप एवं नैवेद्य'
      },
      desc: {
        en: 'Apply Chandana & Kumkum, offer fresh flowers and Tulasi, show incense, wave the lamp, offer Naivedya (fruits/milk/sweets), and recite your daily stotras.',
        kn: 'ದೇವರಿಗೆ ಗಂಧ-ಕುಂಕುಮ ಹಚ್ಚಿ, ತಾಜಾ ಪುಷ್ಪ-ತುಳಸಿ ಅರ್ಪಿಸಿ, ಧೂಪ-ದೀಪ ತೋರಿಸಿ, ಹಣ್ಣು-ಹಾಲು ನೈವೇದ್ಯವಿಟ್ಟು, ಇಷ್ಟದೇವತಾ ಸ್ತೋತ್ರಗಳನ್ನು ಪಠಿಸುವುದು.',
        hi: 'देवप्रतिमाओं को चन्दन-कुंकुम लगाएं, पुष्प अर्पित करें, धूप-दीप दर्शन कराएं तथा सात्त्विक नैवेद्य समर्पित करें।'
      }
    },
    {
      step: 6,
      title: {
        en: 'Maha Mangalarati & Pradakshina (07:30 AM - 08:00 AM)',
        kn: 'ಮಹಾ ಮಂಗಳಾರತಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮತ್ತು ಪ್ರಸಾದ ಸ್ವೀಕಾರ',
        hi: 'महा मङ्गलारती, प्रदक्षिणा नमस्कार एवं प्रसाद ग्रहण'
      },
      desc: {
        en: 'Perform Karpura Aarti waving circular-wise with ringing bell, perform 3 self-circumambulations (Pradakshina), accept sacred water (Theertha) and Prasada.',
        kn: 'ಕರ್ಪೂರಾರತಿ ಬೆಳಗಿಸಿ, ೩ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ ಸಾಷ್ಟಾಂಗ ನಮಸ್ಕರಿಸಿ, ತೀರ್ಥ-ಪ್ರಸಾದವನ್ನು ಭಕ್ತಿಯಿಂದ ಸ್ವೀಕರಿಸಿ ದಿನದ ಕರ್ತವ್ಯಗಳಿಗೆ ಶುಭಾರಂಭ ಮಾಡುವುದು.',
        hi: 'कर्पूर आरती करें, परिक्रमा कर दण्डवत् प्रणाम करें, तथा तीर्थ एवं प्रसाद श्रद्धापूर्वक ग्रहण करें।'
      }
    }
  ];

  const dayEvents = customEvents.filter(e => e.date === day.gregorianDate);

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const item: CustomEventItem = {
      id: `evt-${Date.now()}`,
      date: day.gregorianDate,
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      category: newEventCategory,
      hasNotification: notificationEnabled
    };

    onAddEvent(item);
    setNewEventTitle('');
    setNewEventDesc('');
    setShowEventForm(false);
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationEnabled(true);
        new Notification('HCMM Vedic Panchanga Alert', {
          body: `Notification armed for Rahu Kaal (${day.rahuKaal.start}) & Gulika Kaal (${day.gulikaKaal.start})!`
        });
      }
    } else {
      setNotificationEnabled(!notificationEnabled);
    }
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-1 sm:p-2 pt-1 sm:pt-3 pb-8 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[100vw] rounded-2xl sm:rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border-2 border-amber-300/80 dark:border-stone-700 overflow-hidden my-0 mt-0 sm:mt-0.5 max-h-[97vh] flex flex-col transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative shrink-0 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-amber-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {day.vara[currentLang]} • {day.gregorianDate}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight flex items-center gap-2.5">
                  <span>{formatNumberWithEnglishBracket(day.day, currentLang)} {day.tithiName[currentLang]}</span>
                  <MoonPhaseIcon 
                    paksha={day.paksha} 
                    tithiNumber={day.tithiNumber} 
                    size={26} 
                    currentLang={currentLang} 
                  />
                </h2>
                {calculatedMoonPhase && (
                  <a
                    href="#daily-moon-phase-section"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs border border-amber-300/50 text-xs font-semibold text-amber-200 shadow-sm transition-all cursor-pointer"
                    title={calculatedMoonPhase.summary}
                  >
                    <span className="text-sm">{calculatedMoonPhase.symbol}</span>
                    <span className="font-bold">{calculatedMoonPhase.phaseName}</span>
                    <span className="text-[10px] font-mono text-amber-300/90">({calculatedMoonPhase.illumination}% {currentLang === 'kn' ? 'ಪ್ರಕಾಶ' : currentLang === 'hi' ? 'प्रकाश' : 'Illumination'})</span>
                  </a>
                )}
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1">
                {day.samvatsara[currentLang]} ಸಂವತ್ಸರ • {day.masa[currentLang]} ಮಾಸ ({day.pakshaName[currentLang]})
              </p>

              {/* Tithi & Nakshatra Start & End Times Prominent Header Pills */}
              <div className="mt-2.5 flex flex-col gap-2">
                {day.tithiTiming && (
                  <div className="flex flex-wrap items-center gap-2 p-1.5 px-3 rounded-2xl bg-black/35 backdrop-blur-xs border border-amber-300/50 text-[11px] sm:text-xs font-mono text-amber-100 shadow-md">
                    <span className="font-sans font-bold text-amber-300 uppercase tracking-wider text-[10px] bg-amber-900/70 px-1.5 py-0.5 rounded border border-amber-400/40 shrink-0">
                      {currentLang === 'kn' ? 'ತಿಥಿ ಕಾಲ' : currentLang === 'hi' ? 'तिथि काल' : 'Tithi Time'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-sans font-bold text-emerald-300">
                        {currentLang === 'kn' ? 'ಪ್ರವೇಶ (ಆರಂಭ):' : currentLang === 'hi' ? 'प्रारम्भ:' : 'Starts:'}
                      </span>
                      <span className="text-white font-bold">{day.tithiTiming.startTimeFormatted[currentLang]}</span>
                      {day.tithiTiming.isPrevDayStart && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-400/40">
                          {currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನ' : currentLang === 'hi' ? 'पूर्व दिवस' : 'Prev Day'}
                        </span>
                      )}
                    </div>

                    <span className="text-amber-400/70 font-bold hidden sm:inline">|</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="font-sans font-bold text-rose-300">
                        {currentLang === 'kn' ? 'ಸಮಾಪ್ತಿ (ಮುಕ್ತಾಯ):' : currentLang === 'hi' ? 'समाप्ति:' : 'Ends:'}
                      </span>
                      <span className="text-white font-bold">{day.tithiTiming.endTimeFormatted[currentLang]}</span>
                      {day.tithiTiming.isNextDayEnd && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-900/80 text-rose-200 border border-rose-400/40">
                          {currentLang === 'kn' ? 'ಮರುದಿನ' : currentLang === 'hi' ? 'अगले दिन' : 'Next Day'}
                        </span>
                      )}
                    </div>

                    <span className="text-amber-400/70 font-bold hidden md:inline">|</span>

                    <span className="text-[10px] sm:text-[11px] text-amber-300 font-sans font-semibold bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-400/30">
                      ⏱️ {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${day.tithiTiming.durationHours} ಗಂಟೆ (${day.tithiTiming.durationFormatted[currentLang]})` : currentLang === 'hi' ? `अवधि: ${day.tithiTiming.durationHours} घण्टे (${day.tithiTiming.durationFormatted[currentLang]})` : `Span: ${day.tithiTiming.durationHours} Hours (${day.tithiTiming.durationFormatted[currentLang]})`}
                    </span>
                  </div>
                )}

                {nakshatraTransition && (
                  <div className="flex flex-wrap items-center gap-2 p-1.5 px-3 rounded-2xl bg-black/35 backdrop-blur-xs border border-emerald-400/50 text-[11px] sm:text-xs font-mono text-emerald-100 shadow-md">
                    <span className="font-sans font-bold text-emerald-300 uppercase tracking-wider text-[10px] bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-400/40 shrink-0">
                      {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ಕಾಲ' : currentLang === 'hi' ? 'नक्षत्र काल' : 'Nakshatra Time'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-sans font-bold text-emerald-300">
                        {currentLang === 'kn' ? 'ಪ್ರವೇಶ (ಆರಂಭ):' : currentLang === 'hi' ? 'प्रारम्भ:' : 'Starts:'}
                      </span>
                      <span className="text-white font-bold">{nakshatraTransition.startTimeFormatted[currentLang]}</span>
                      {nakshatraTransition.isPrevDayStart && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-400/40">
                          {currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನ' : currentLang === 'hi' ? 'पूर्व दिवस' : 'Prev Day'}
                        </span>
                      )}
                    </div>

                    <span className="text-emerald-400/70 font-bold hidden sm:inline">|</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="font-sans font-bold text-rose-300">
                        {currentLang === 'kn' ? 'ಸಮಾಪ್ತಿ (ಮುಕ್ತಾಯ):' : currentLang === 'hi' ? 'समाप्ति:' : 'Ends:'}
                      </span>
                      <span className="text-white font-bold">{nakshatraTransition.endTimeFormatted[currentLang]}</span>
                      {nakshatraTransition.isNextDayEnd && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-900/80 text-rose-200 border border-rose-400/40">
                          {currentLang === 'kn' ? 'ಮರುದಿನ' : currentLang === 'hi' ? 'अगले दिन' : 'Next Day'}
                        </span>
                      )}
                    </div>

                    {nakshatraTransition.durationHours > 0 && (
                      <>
                        <span className="text-emerald-400/70 font-bold hidden md:inline">|</span>
                        <span className="text-[10px] sm:text-[11px] text-emerald-300 font-sans font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                          ⏱️ {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${nakshatraTransition.durationHours} ಗಂಟೆ` : `Span: ${nakshatraTransition.durationHours} Hours`}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsWideView(!isWideView)}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all ring-1 ring-white/40 shrink-0 cursor-pointer hidden sm:flex"
                title={isWideView ? 'Normal Width' : 'Wide Window Width'}
              >
                {isWideView ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span>{isWideView ? (currentLang === 'kn' ? 'ಸಾಮಾನ್ಯ' : 'Standard') : (currentLang === 'kn' ? 'ವಿಸ್ತಾರ' : 'Wide')}</span>
              </button>

              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold text-xs flex items-center gap-1.5 transition-all ring-1 ring-white/40 shrink-0 cursor-pointer"
                title="Close Window (Esc)"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800 dark:text-stone-200">
          
          {/* Top Quick-Jump Navigation Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-850/90 border border-stone-200/80 dark:border-stone-750 overflow-x-auto text-xs font-bold scrollbar-none shadow-2xs">
            <a 
              href="#tithi-nakshatra-timeline" 
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white shadow-xs hover:bg-amber-600 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>⏱️</span>
              <span>{currentLang === 'kn' ? 'ತಿಥಿ & ನಕ್ಷತ್ರ ಟೈಮ್‌ಲೈನ್‌' : currentLang === 'hi' ? 'तिथि-नक्षत्र टाइमलाइन' : 'Tithi & Nakshatra Timeline'}</span>
            </a>
            <a 
              href="#shubh-ashubh-matrix" 
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>⚖️</span>
              <span>{currentLang === 'kn' ? 'ಶುಭ & ಅಶುಭ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'शुभ-अशुभ मुहूर्त सूची' : 'Shubh & Ashubh Timings'}</span>
            </a>
            {day.festivals.length > 0 && (
              <a 
                href="#festivals-rituals-section" 
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-red-400 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>🌺</span>
                <span>{currentLang === 'kn' ? 'ಹಬ್ಬಗಳು & ವಿಸರ್ಜನೆ' : currentLang === 'hi' ? 'पर्व व विसर्जन' : 'Festivals & Visarjan'}</span>
              </a>
            )}
            <a 
              href="#panchanga-limbs-section" 
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>📜</span>
              <span>{currentLang === 'kn' ? 'ಪಂಚಾಂಗ ಅಂಗಗಳು' : currentLang === 'hi' ? 'पंचांग के पांच अंग' : '5 Limbs'}</span>
            </a>
            <a 
              href="#daily-insights-section" 
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-indigo-400 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>{currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟ' : currentLang === 'hi' ? 'ज्योतिषीय परामर्श' : 'Daily Insights'}</span>
            </a>
            <a 
              href="#daily-moon-phase-section" 
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-purple-400 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>{calculatedMoonPhase?.symbol || '🌘'}</span>
              <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲೆ & ಹಂತ' : currentLang === 'hi' ? 'चन्द्र कला व चक्र' : 'Moon Phase'}</span>
            </a>
            <a 
              href="#sun-dinamana-section" 
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>🌅</span>
              <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ & ದಿನಮಾನ' : currentLang === 'hi' ? 'सूर्योदय व दिनमान' : 'Sun & Dina Mana'}</span>
            </a>
          </div>

          {/* Current Live Muhurta Status Banner */}
          {currentMuhurtaStatus && (
            <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-300 ${
              currentMuhurtaStatus.type === 'shubh'
                ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-100'
                : 'bg-gradient-to-r from-rose-500/15 via-red-500/10 to-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-100'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-stone-850 shadow-xs border border-current">
                  {currentMuhurtaStatus.type === 'shubh' ? '🌟' : '⚠️'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-white/80 dark:bg-stone-800 border border-current">
                      {currentMuhurtaStatus.type === 'shubh' ? (currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಚಾಲ್ತಿ: ಶುಭ ಮುಹೂರ್ತ' : 'CURRENT: SHUBH MUHURTA') : (currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಚಾಲ್ತಿ: ಅಶುಭ ಕಾಲ' : 'CURRENT: ASHUBH WINDOW')}
                    </span>
                    <span className="font-mono font-bold text-xs">
                      {currentMuhurtaStatus.time}
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-sm sm:text-base mt-0.5">
                    {currentMuhurtaStatus.name[currentLang]}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    {currentMuhurtaStatus.advice[currentLang]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DAILY INSIGHTS (GEMINI AI ASTROLOGICAL GUIDANCE) */}
          {/* ========================================================================= */}
          <div id="daily-insights-section" className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/85 via-purple-950/75 to-stone-900 border-2 border-indigo-500/40 shadow-xl text-white relative overflow-hidden backdrop-blur-md">
            {/* Ambient Background Aura */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* Top Row: Title, Badges & Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-indigo-400/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 text-stone-950 shadow-md">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wide">
                        {currentLang === 'kn' ? 'ದೈನಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟ' : currentLang === 'hi' ? 'दैनिक ज्योतिषीय परामर्श' : 'Daily Astrological Insights'}
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                        {dailyInsight?.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Vedic Muhurtha Shastra'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200/80">
                      {currentLang === 'kn'
                        ? 'ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರದ ಗ್ರಹಗತಿ ಆಧಾರಿತ ಶುಭ ಮುಹೂರ್ತ ಸಂದೇಶ'
                        : currentLang === 'hi'
                        ? 'तिथि एवं नक्षत्र आधारित पावन ज्योतिषीय मार्गदर्शन'
                        : 'Actionable astrological tip based on celestial Tithi & Nakshatra'}
                    </p>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleSpeakTip}
                    disabled={!dailyInsight?.tip || isSpeakingTip}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSpeakingTip
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-indigo-400/30 hover:border-indigo-300'
                    }`}
                    title="Read tip aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಆಲಿಸಿ' : currentLang === 'hi' ? 'सुने' : 'Listen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyTip}
                    disabled={!dailyInsight?.tip}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-100 border border-indigo-400/30 hover:border-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Copy tip text"
                  >
                    {copiedTip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTip ? (currentLang === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'Copied') : (currentLang === 'kn' ? 'ನಕಲಿಸಿ' : 'Copy')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRegenerateInsight}
                    disabled={isGeneratingInsight}
                    className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    title="Regenerate insight via Gemini AI"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingInsight ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಮತ್ತೊಮ್ಮೆ ರಚಿಸಿ' : currentLang === 'hi' ? 'पुनः बनाएँ' : 'Regenerate'}</span>
                  </button>
                </div>
              </div>

              {/* Celestial Context Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1">
                  <span>🌙</span>
                  <span>{day.tithiName?.[currentLang] || day.tithiName?.en} ({day.pakshaName?.[currentLang] || day.paksha})</span>
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <span>✨</span>
                  <span>{day.nakshatra?.[currentLang] || day.nakshatra?.en} {day.pada ? `(${currentLang === 'kn' ? 'ಪಾದ' : 'Pada'} ${day.pada})` : ''}</span>
                </span>
                {day.chandraRashi && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                    <span>🪐</span>
                    <span>{day.chandraRashi?.[currentLang] || day.chandraRashi?.en}</span>
                  </span>
                )}
              </div>

              {/* Main Astrological Tip Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-indigo-400/20 shadow-inner">
                {isGeneratingInsight ? (
                  <div className="flex items-center gap-3 py-2 text-indigo-200 animate-pulse">
                    <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                    <span className="text-sm font-medium">
                      {currentLang === 'kn'
                        ? 'ಜೆಮಿನಿ ಎಐ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...'
                        : currentLang === 'hi'
                        ? 'जेमिनी एआई द्वारा ज्योतिषीय परामर्श तैयार किया जा रहा है...'
                        : 'Gemini AI is analyzing celestial alignments for your daily tip...'}
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

                {onOpenDasha && (
                  <div className="mt-3 pt-2.5 border-t border-indigo-400/20 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-indigo-200">
                      {currentLang === 'kn' ? 'ನಿಮ್ಮ ಜನ್ಮ ಜಾತಕದ ಪ್ರಸ್ತುತ ದಶಾ-ಭುಕ್ತಿ ತಿಳಿಯಲು:' : 'Check your personal running Dasha-Bhukti:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDasha();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ನೋಡಿ' : currentLang === 'hi' ? 'विंशोत्तरी दशा देखें' : 'View Vimshottari Dasha'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DAILY MOON PHASE & SYNODIC LUNAR CYCLE (DATE-BASED) */}
          {/* Displays calculated astronomical lunar phase (e.g. Waxing Gibbous, Full Moon) */}
          {/* ========================================================================= */}
          <div id="daily-moon-phase-section">
            <DailyMoonPhaseCard 
              date={day.gregorianDate} 
              currentLang={currentLang} 
            />
          </div>

          {/* ========================================================================= */}
          {/* 1. DEDICATED VISUAL TIMELINE COMPONENT FOR CURRENT TITHI & NAKSHATRA */}
          {/* Calculates & displays elapsed percentage, start/end timestamps & progress bar */}
          {/* ========================================================================= */}
          <div id="tithi-nakshatra-timeline" className="space-y-4 pt-1">
            
            {/* Top Navigation & Timeline Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-400 dark:border-amber-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-xs shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? 'ತಿಥಿ & ನಕ್ಷತ್ರ ಟೈಮ್‌ಲೈನ್‌ ಹಾಗೂ ಪ್ರಗತಿ ರೇಖೆ' : currentLang === 'hi' ? 'तिथि एवं नक्षत्र टाइमलाइन व प्रगति रेखा' : 'Tithi & Nakshatra Visual Timeline & Progress Bar'}</span>
                    {isToday && referenceMode === 'live' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                    {currentLang === 'kn' 
                      ? 'ನಿಖರ ಆರಂಭ-ಮುಕ್ತಾಯ ಕಾಲಾಂಕ, ಒಟ್ಟು ಅವಧಿ, ಸಂದ ಸಮಯ ಮತ್ತು ನೈಜ-ಸಮಯದ ಪ್ರಗತಿ (Progress Bar)' 
                      : 'Accurate start & end timestamps, total duration, elapsed time & visual percentage progress'}
                  </p>
                </div>
              </div>

              {/* Reference Time Evaluation Mode Buttons */}
              <div className="flex items-center flex-wrap gap-1.5 self-start md:self-auto">
                <div className="flex items-center bg-white dark:bg-stone-850 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setReferenceMode('live')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      referenceMode === 'live'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                    title="Calculate relative to current live time"
                  >
                    <span>⚡</span>
                    <span>{isToday ? (currentLang === 'kn' ? 'ಲೈವ್' : 'Live') : (currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ' : 'Midday')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferenceMode('sunrise')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      referenceMode === 'sunrise'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                    title="Calculate relative to Sunrise"
                  >
                    <span>🌅</span>
                    <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReferenceMode('sunset')}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      referenceMode === 'sunset'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                    title="Calculate relative to Sunset"
                  >
                    <span>🌇</span>
                    <span>{currentLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreativeTithiView(!isCreativeTithiView)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isCreativeTithiView
                      ? 'bg-purple-600 text-white border-purple-700'
                      : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-purple-400'
                  }`}
                  title="Toggle 3D Astronomical Circular Orbit Visualizer"
                >
                  <span>✨</span>
                  <span>{currentLang === 'kn' ? 'ಖಗೋಳ ದರ್ಶಕ' : 'Celestial Orbit'}</span>
                </button>
              </div>
            </div>

            {/* DUAL TIMELINE PROGRESS CARDS: TITHI (AMBER) & NAKSHATRA (EMERALD) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
              
              {/* CARD 1: DEDICATED TITHI TIMELINE & ASTRONOMICAL DATE TRANSITION BAR */}
              {day.tithiTiming && tithiDetails ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-white to-amber-50/25 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-amber-400 dark:border-amber-700 shadow-md space-y-4 relative overflow-hidden group w-full min-w-0">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-amber-500/5 group-hover:scale-125 transition-transform pointer-events-none" />

                  {/* Card Header: Tithi Name, Sanskrit, Paksha, & Duration Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs shrink-0">
                        <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                            {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ತಿಥಿ ಕಾಲರೇಖೆ' : currentLang === 'hi' ? 'वर्तमान तिथि टाइमलाइन' : 'CURRENT TITHI TIMELINE'}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                            {day.pakshaName[currentLang]} • {formatJustNumber(day.tithiNumber, currentLang)}/15
                          </span>
                        </div>
                        <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-tight">
                          {day.tithiName[currentLang]} ({day.tithiSanskrit})
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <MoonPhaseIcon 
                        paksha={day.paksha} 
                        tithiNumber={day.tithiNumber} 
                        size={24}
                        currentLang={currentLang}
                      />
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-stone-700 shadow-2xs">
                        ⏱️ {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${tithiDetails.durationText}` : `Total: ${tithiDetails.durationText}`}
                      </span>
                    </div>
                  </div>

                  {/* ASTRONOMICAL DATE TRANSITION HIGHLIGHT BOX */}
                  <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-stone-800/90 border border-amber-400/60 dark:border-amber-600/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                        <span className="text-sm">🗓️</span>
                        <span>
                          {currentLang === 'kn' ? 'ಖಗೋಳ ದಿನಾಂಕ ಪರಿವರ್ತನೆ (Date Transition)' : currentLang === 'hi' ? 'खगोलीय दिनांक संक्रमण (Date Transition)' : 'Astronomical Date Transition Status'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        day.tithiTiming.isPrevDayStart || day.tithiTiming.isNextDayEnd
                          ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-400'
                          : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-400'
                      }`}>
                        {day.tithiTiming.isPrevDayStart || day.tithiTiming.isNextDayEnd 
                          ? (currentLang === 'kn' ? '೨ ದಿನಾಂಕಗಳ ವ್ಯಾಪ್ತಿ' : currentLang === 'hi' ? '२ दिनांकों में व्याप्त' : 'Spans 2 Calendar Dates')
                          : (currentLang === 'kn' ? 'ಏಕ ದಿನಾಂಕ ವ್ಯಾಪ್ತಿ' : 'Single Calendar Date')}
                      </span>
                    </div>

                    {/* Step Flow of Date Transition */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                      {/* Entry Box */}
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800/60 shadow-2xs">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                          🟢 {currentLang === 'kn' ? 'ಆರಂಭ (Pravesha)' : '1. Entry (Pravesha)'}
                        </span>
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                          {tithiDetails.startDateTimeStr}
                        </p>
                        <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                          {day.tithiTiming.isPrevDayStart 
                            ? (currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನಾಂಕದಿಂದ ಮುಂದುವರಿಕೆ' : 'Began on preceding date') 
                            : (currentLang === 'kn' ? 'ಇಂದಿನ ದಿನ ಆರಂಭ' : 'Began on today')}
                        </span>
                      </div>

                      {/* Midnight & Sunrise Pivot */}
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-amber-300 dark:border-amber-700/60 shadow-2xs">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block uppercase">
                          ☀️ {currentLang === 'kn' ? 'ಉದಯ ತಿಥಿ (Surya Siddhanta)' : '2. Udaya Determination'}
                        </span>
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                          {currentLang === 'kn' ? `ಸೂರ್ಯೋದಯ: ${day.sunrise}` : `Sunrise: ${day.sunrise}`}
                        </p>
                        <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                          {currentLang === 'kn' ? 'ದಿನದ ಪೂಜಾ-ಸಂಕಲ್ಪ ನಿರ್ಣಯ' : 'Governs ritual Sankalpa'}
                        </span>
                      </div>

                      {/* Exit Box */}
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-rose-300 dark:border-rose-800/60 shadow-2xs">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                          🔴 {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ (Samapti)' : '3. Exit (Samapti)'}
                        </span>
                        <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                          {tithiDetails.endDateTimeStr}
                        </p>
                        <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                          {day.tithiTiming.isNextDayEnd 
                            ? (currentLang === 'kn' ? 'ಮರುದಿನ ಮುಕ್ತಾಯ' : 'Concludes next day') 
                            : (currentLang === 'kn' ? 'ಇಂದೇ ಮುಕ್ತಾಯ' : 'Concludes today')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL TIMELINE PROGRESS BAR COMPONENT WITH ATTACHED START/END TIMESTAMPS */}
                  <div className="p-3.5 rounded-xl bg-white/95 dark:bg-stone-850 border border-amber-300 dark:border-amber-700/80 shadow-2xs space-y-3">
                    
                    {/* Timestamp Pins at Left & Right Ends */}
                    <div className="flex items-start sm:items-center justify-between text-xs font-mono gap-2 flex-wrap sm:flex-nowrap">
                      {/* Left: Start Date/Time */}
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{currentLang === 'kn' ? 'ಪ್ರವೇಶ (ಆರಂಭ / Starts):' : currentLang === 'hi' ? 'प्रारम्भ (प्रवेश):' : 'Starts (Tithi Entry):'}</span>
                        </span>
                        <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 mt-0.5">
                          {tithiDetails.startDateTimeStr}
                        </span>
                        {day.tithiTiming.isPrevDayStart && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 w-fit mt-0.5">
                            {currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನ' : 'Prev Day'}
                          </span>
                        )}
                      </div>

                      {/* Center: Dynamic Elapsed Percentage Badge & Phase */}
                      <div className="flex flex-col items-center mx-auto sm:mx-0 my-1 sm:my-0">
                        <span className="text-xs sm:text-sm font-mono font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-sm ring-2 ring-amber-300/40">
                          {tithiDetails.percent}%
                        </span>
                        <span className="text-[9.5px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mt-0.5 text-center">
                          {tithiDetails.phaseName[currentLang]}
                        </span>
                      </div>

                      {/* Right: End Date/Time */}
                      <div className="flex flex-col text-right ml-auto sm:ml-0">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center justify-end gap-1">
                          <span>{currentLang === 'kn' ? 'ಮುಕ್ತಾಯ (ಸಮಾಪ್ತಿ / Ends):' : currentLang === 'hi' ? 'समाप्ति (मुक्ताय):' : 'Ends (Tithi Exit):'}</span>
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        </span>
                        <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 mt-0.5">
                          {tithiDetails.endDateTimeStr}
                        </span>
                        {day.tithiTiming.isNextDayEnd && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 w-fit ml-auto mt-0.5">
                            {currentLang === 'kn' ? 'ಮರುದಿನ' : 'Next Day'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Glowing Progress Track with 25%, 50%, 75% Ghatis Milestones */}
                    <div className="relative pt-1 pb-1">
                      <div className="h-4 w-full bg-stone-100 dark:bg-stone-750 rounded-full overflow-hidden relative shadow-inner border border-stone-200 dark:border-stone-700">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full transition-all duration-700 relative"
                          style={{ width: `${Math.max(4, tithiDetails.percent)}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                        </div>
                      </div>

                      {/* Milestone Checkpoint Ticks */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 dark:text-stone-500 px-1 mt-1">
                        <span>0% (ಆರಂಭ)</span>
                        <span>25% (೧೫ ಘಳಿಗೆ)</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">50% (ಮಧ್ಯಕಾಲ)</span>
                        <span>75% (೪೫ ಘಳಿಗೆ)</span>
                        <span>100% (ಮುಕ್ತಾಯ)</span>
                      </div>
                    </div>

                    {/* Bottom Duration & Remaining Stats */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 dark:text-stone-300 pt-0.5 border-t border-stone-100 dark:border-stone-800 flex-wrap gap-1">
                      <span className="flex items-center gap-1">
                        <span>⏳</span>
                        <span>{tithiDetails.elapsedText}</span>
                      </span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${tithiDetails.durationText}` : `Total: ${tithiDetails.durationText}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏳</span>
                        <span>{tithiDetails.remainingText}</span>
                      </span>
                    </div>
                  </div>

                  {/* Footer & Next Tithi Transition */}
                  <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 pt-0.5">
                    <span>
                      {currentLang === 'kn' ? 'ಮುಕ್ತಾಯದ ನಂತರ:' : 'Followed By:'}{' '}
                      <strong className="text-amber-800 dark:text-amber-300">{day.tithiTiming.nextTithiName[currentLang]}</strong>
                    </span>
                    <span className="font-mono text-[10.5px]">
                      {currentLang === 'kn' ? 'ಉದಯ ತಿಥಿ:' : 'Udaya Tithi:'} {day.sunrise}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* CARD 2: CURRENT NAKSHATRA TIMELINE & PROGRESS BAR */}
              {(day.nakshatraTiming || day.padaTiming) && nakshatraDetails ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-white to-emerald-50/25 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-emerald-500 dark:border-emerald-700 shadow-md space-y-3.5 relative overflow-hidden group w-full min-w-0">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-500/5 group-hover:scale-125 transition-transform pointer-events-none" />

                  {/* Card Header: Nakshatra Name, Syllable & Duration Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-stone-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xs shrink-0 font-serif font-black">
                        🌟
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                            {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ನಕ್ಷತ್ರ ಕಾಲರೇಖೆ' : currentLang === 'hi' ? 'वर्तमान नक्षत्र टाइमलाइन' : 'CURRENT NAKSHATRA TIMELINE'}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                            #{day.nakshatraIndex}/27 • {currentLang === 'kn' ? `ಪಾದ ${day.pada}` : `Pada ${day.pada}`}
                          </span>
                        </div>
                        <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-tight">
                          {day.nakshatra[currentLang]}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span className="text-sm font-serif font-black px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                        {day.charanaLetter}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-stone-800 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-stone-700 shadow-2xs">
                        ⏱️ {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${nakshatraDetails.durationText}` : `Total: ${nakshatraDetails.durationText}`}
                      </span>
                    </div>
                  </div>

                  {/* ASTRONOMICAL DATE TRANSITION HIGHLIGHT BOX FOR NAKSHATRA */}
                  {nakshatraTransition && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-stone-800/90 border border-emerald-400/60 dark:border-emerald-600/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                          <span className="text-sm">🗓️</span>
                          <span>
                            {currentLang === 'kn' ? 'ಖಗೋಳ ದಿನಾಂಕ ಪರಿವರ್ತನೆ (Date Transition)' : currentLang === 'hi' ? 'खगोलीय दिनांक संक्रमण (Date Transition)' : 'Astronomical Date Transition Status'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          nakshatraTransition.isPrevDayStart || nakshatraTransition.isNextDayEnd
                            ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-400'
                            : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-400'
                        }`}>
                          {nakshatraTransition.isPrevDayStart || nakshatraTransition.isNextDayEnd 
                            ? (currentLang === 'kn' ? '೨ ದಿನಾಂಕಗಳ ವ್ಯಾಪ್ತಿ' : currentLang === 'hi' ? '२ दिनांकों में व्याप्त' : 'Spans 2 Calendar Dates')
                            : (currentLang === 'kn' ? 'ಏಕ ದಿನಾಂಕ ವ್ಯಾಪ್ತಿ' : 'Single Calendar Date')}
                        </span>
                      </div>

                      {/* Step Flow of Date Transition */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                        {/* Entry Box */}
                        <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800/60 shadow-2xs">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                            🟢 {currentLang === 'kn' ? 'ಆರಂಭ (Pravesha)' : '1. Entry (Pravesha)'}
                          </span>
                          <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                            {nakshatraDetails.startDateTimeStr}
                          </p>
                          <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                            {nakshatraTransition.isPrevDayStart 
                              ? (currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನಾಂಕದಿಂದ ಮುಂದುವರಿಕೆ' : 'Began on preceding date') 
                              : (currentLang === 'kn' ? 'ಇಂದಿನ ದಿನ ಆರಂಭ' : 'Began on today')}
                          </span>
                        </div>

                        {/* Midpoint / Rashi & Pada Pivot */}
                        <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                            🌕 {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ & ಪಾದ' : '2. Chandra Rashi & Pada'}
                          </span>
                          <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                            {day.chandraRashi[currentLang]} • {currentLang === 'kn' ? `ಪಾದ ${day.pada}` : `Pada ${day.pada}`}
                          </p>
                          <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                            {currentLang === 'kn' ? `ನಾಮಾಕ್ಷರ: ${day.charanaLetter}` : `Namakshara: ${day.charanaLetter}`}
                          </span>
                        </div>

                        {/* Exit Box */}
                        <div className="p-2 rounded-lg bg-white dark:bg-stone-850 border border-rose-300 dark:border-rose-800/60 shadow-2xs">
                          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                            🔴 {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ (Samapti)' : '3. Exit (Samapti)'}
                          </span>
                          <p className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                            {nakshatraDetails.endDateTimeStr}
                          </p>
                          <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block mt-0.5">
                            {nakshatraTransition.isNextDayEnd 
                              ? (currentLang === 'kn' ? 'ಮರುದಿನ ಮುಕ್ತಾಯ' : 'Concludes next day') 
                              : (currentLang === 'kn' ? 'ಇಂದೇ ಮುಕ್ತಾಯ' : 'Concludes today')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VISUAL TIMELINE PROGRESS BAR COMPONENT WITH ATTACHED START/END TIMESTAMPS */}
                  <div className="p-3.5 rounded-xl bg-white/95 dark:bg-stone-850 border border-emerald-300 dark:border-emerald-750 shadow-2xs space-y-2.5">
                    
                    {/* Timestamp Pins at Left & Right Ends */}
                    <div className="flex items-start sm:items-center justify-between text-xs font-mono gap-2 flex-wrap sm:flex-nowrap">
                      {/* Left: Start Date/Time */}
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{currentLang === 'kn' ? 'ಪ್ರವೇಶ (ಆರಂಭ / Starts):' : currentLang === 'hi' ? 'प्रारम्भ (प्रवेश):' : 'Starts (Nakshatra Entry):'}</span>
                        </span>
                        <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 mt-0.5">
                          {nakshatraDetails.startDateTimeStr}
                        </span>
                        {nakshatraTransition?.isPrevDayStart && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 w-fit mt-0.5">
                            {currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನ' : 'Prev Day'}
                          </span>
                        )}
                      </div>

                      {/* Center: Dynamic Elapsed Percentage Badge & Phase */}
                      <div className="flex flex-col items-center mx-auto sm:mx-0 my-1 sm:my-0">
                        <span className="text-xs sm:text-sm font-mono font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
                          {nakshatraDetails.percent}%
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mt-0.5 text-center">
                          {nakshatraDetails.phaseName[currentLang]}
                        </span>
                      </div>

                      {/* Right: End Date/Time */}
                      <div className="flex flex-col text-right ml-auto sm:ml-0">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center justify-end gap-1">
                          <span>{currentLang === 'kn' ? 'ಮುಕ್ತಾಯ (ಸಮಾಪ್ತಿ / Ends):' : currentLang === 'hi' ? 'समाप्ति (मुक्ताय):' : 'Ends (Nakshatra Exit):'}</span>
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        </span>
                        <span className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 mt-0.5">
                          {nakshatraDetails.endDateTimeStr}
                        </span>
                        {nakshatraTransition?.isNextDayEnd && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 w-fit ml-auto mt-0.5">
                            {currentLang === 'kn' ? 'ಮರುದಿನ' : 'Next Day'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Glowing Progress Track */}
                    <div className="h-3.5 w-full bg-stone-100 dark:bg-stone-750 rounded-full overflow-hidden relative shadow-inner border border-stone-200 dark:border-stone-700">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full transition-all duration-700 relative"
                        style={{ width: `${Math.max(4, nakshatraDetails.percent)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                      </div>
                    </div>

                    {/* Bottom Duration & Remaining Stats */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 dark:text-stone-300 pt-0.5 flex-wrap gap-1">
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{nakshatraDetails.elapsedText}</span>
                      </span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        {currentLang === 'kn' ? `ಒಟ್ಟು ಅವಧಿ: ${nakshatraDetails.durationText}` : `Total: ${nakshatraDetails.durationText}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{nakshatraDetails.remainingText}</span>
                      </span>
                    </div>
                  </div>

                  {/* Active Pada & Syllable Footer */}
                  {day.padaTiming && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                          {currentLang === 'kn' ? `ಪಾದ ${day.pada}` : `Pada ${day.pada}`}
                        </span>
                        <span className="text-stone-700 dark:text-stone-300 font-medium text-[11px]">
                          {currentLang === 'kn' ? `ನಾಮಾಕ್ಷರ: ${day.charanaLetter}` : `Namakshara: ${day.charanaLetter}`}
                        </span>
                      </div>
                      <span className="font-mono text-emerald-800 dark:text-emerald-300 text-[10.5px]">
                        ⏱️ {day.padaTiming.durationMinutes} {currentLang === 'kn' ? 'ನಿಮಿಷ' : 'mins'} ({day.padaTiming.startTime} - {day.padaTiming.endTime})
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

            </div>

            {/* ========================================================================= */}
            {/* 1.B DEDICATED ALL 4 NAKSHATRA PADAS MATRIX: ACCURATE TIMINGS & PROGRESS */}
            {/* Shows exact start/end date-time strings, total duration in h/m & active phase */}
            {/* ========================================================================= */}
            {padasList.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 border-2 border-emerald-500 dark:border-emerald-700 shadow-md space-y-4 w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs font-serif font-black text-lg shrink-0">
                      ☸️
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-base sm:text-lg text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                        <span>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರದ ೪ ಪಾದಗಳ ಸಂಪೂರ್ಣ ವಿಶ್ಲೇಷಣೆ ಹಾಗೂ ಪ್ರಗತಿ' : currentLang === 'hi' ? 'नक्षत्र के चारों चरणों का यथार्थ समय विस्तार एवं प्रगति' : 'Complete 4 Nakshatra Padas Duration & Elapsed Phases'}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold uppercase shadow-2xs">
                          {day.nakshatra[currentLang]}
                        </span>
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        {currentLang === 'kn'
                          ? 'ಪ್ರತಿಯೊಂದು ಪಾದವು ನಿಖರವಾಗಿ ೩°೨೦\' (೨೦೦ ಕಲೆಗಳು) ವ್ಯಾಪ್ತಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಪ್ರಸ್ತುತ ಚಾಲ್ತಿ ಪಾದ, ಆರಂಭ-ಮುಕ್ತಾಯ ದಿನಾಂಕ ಹಾಗೂ ಸಮಯ, ಒಟ್ಟು ಅವಧಿ ಮತ್ತು ಪ್ರಗತಿ ರೇಖೆಯನ್ನು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ.'
                          : 'Each Pada spans exactly 3°20\' arcminutes (1/4th of Nakshatra). Exact entry/exit timestamps, total duration in hours/minutes, and visual progress bars identifying current elapsed phases.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4-Column Responsive Grid for Pada 1, Pada 2, Pada 3, Pada 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0">
                  {padasList.map((p) => {
                    const isCurrent = p.isCurrentActive;
                    return (
                      <div 
                        key={p.padaNumber}
                        className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden shadow-xs ${
                          isCurrent
                            ? 'bg-gradient-to-b from-emerald-500/20 via-white to-emerald-50/40 dark:from-stone-850 dark:via-stone-800 dark:to-stone-850 border-emerald-500 ring-2 ring-emerald-400/40'
                            : p.status === 'completed'
                            ? 'bg-white/80 dark:bg-stone-850/80 border-stone-200 dark:border-stone-700 opacity-90'
                            : 'bg-white/60 dark:bg-stone-850/60 border-stone-200 dark:border-stone-750 opacity-80'
                        }`}
                      >
                        {/* Status Ribbon / Header */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-emerald-600 text-white animate-pulse shadow-xs'
                                : p.status === 'completed'
                                ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}>
                              <span>{isCurrent ? '🟢' : p.status === 'completed' ? '✓' : '⏳'}</span>
                              <span>
                                {isCurrent 
                                  ? (currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಚಾಲ್ತಿ ಪಾದ' : 'CURRENT ACTIVE') 
                                  : p.status === 'completed' 
                                  ? (currentLang === 'kn' ? 'ಮುಕ್ತಾಯಗೊಂಡಿದೆ' : 'Completed') 
                                  : (currentLang === 'kn' ? 'ಇನ್ನೂ ಆರಂಭವಾಗಿಲ್ಲ' : 'Upcoming')}
                              </span>
                            </span>

                            <span className="font-serif font-black text-xs px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-stone-700">
                              {p.syllable}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <h5 className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
                              {currentLang === 'kn' ? `ಪಾದ ${p.padaNumber}` : `Pada ${p.padaNumber}`}
                            </h5>
                            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                              ⏱️ {p.durationFormattedText}
                            </span>
                          </div>
                        </div>

                        {/* Start and End Date & Time Strings */}
                        <div className="space-y-1.5 text-[11px] font-mono bg-stone-50/90 dark:bg-stone-900/60 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700">
                          <div>
                            <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                              🟢 {currentLang === 'kn' ? 'ಆರಂಭ:' : 'Starts:'}
                            </span>
                            <span className="font-bold text-stone-900 dark:text-stone-100 block truncate" title={p.startDateFormatted[currentLang]}>
                              {p.startDateFormatted[currentLang]}
                            </span>
                          </div>
                          <div className="pt-1 border-t border-stone-200/60 dark:border-stone-750">
                            <span className="text-[9.5px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                              🔴 {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ:' : 'Ends:'}
                            </span>
                            <span className="font-bold text-stone-900 dark:text-stone-100 block truncate" title={p.endDateFormatted[currentLang]}>
                              {p.endDateFormatted[currentLang]}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar & Phase Percentage */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold text-stone-700 dark:text-stone-300">
                              {p.percent}% {currentLang === 'kn' ? 'ಸಂದಿದೆ' : 'elapsed'}
                            </span>
                            <span className="text-stone-500 text-[9.5px]">
                              {isCurrent ? p.remainingText : p.status === 'completed' ? '100%' : '0%'}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden relative shadow-inner">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCurrent 
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                                  : p.status === 'completed' 
                                  ? 'bg-stone-400 dark:bg-stone-500' 
                                  : 'bg-transparent'
                              }`}
                              style={{ width: `${p.percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Pop-up Trigger Button positioned directly below */}
                        <button
                          type="button"
                          onClick={(e) => openPopupBelow(e, 'padaDetail', `${day.nakshatra[currentLang]} - Pada ${p.padaNumber}`, p)}
                          className="w-full py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>{currentLang === 'kn' ? 'ಪಾದದ ವಿವರ (Popup)' : 'Pada Details'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CREATIVE VISUALIZER VIEW (Expanded when isCreativeTithiView is true) */}
            {isCreativeTithiView && (
              <div className="pt-2 animate-in fade-in duration-300">
                <CreativeTithiPadaVisualizer day={day} currentLang={currentLang} />
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* 2. COMPREHENSIVE SHUBH & ASHUBH TIMINGS LIST (DECISION MATRIX) */}
          {/* Explicitly identifies auspicious windows for good deeds vs timings to avoid */}
          {/* ========================================================================= */}
          <div id="shubh-ashubh-matrix" className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-stone-850 p-5 space-y-4">
            
            {/* Header with Title & Decision Guidance */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-300 dark:border-stone-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>
                      {currentLang === 'kn' ? 'ದಿನದ ಶುಭ & ಅಶುಭ ಮುಹೂರ್ತಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ' : currentLang === 'hi' ? 'दैनिक शुभ एवं अशुभ काल सूची' : 'Comprehensive Daily Shubh & Ashubh Timings Guide'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold uppercase border border-emerald-300 dark:border-emerald-700">
                      DECISION MATRIX
                    </span>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn'
                      ? 'ಶುಭ ಮುಹೂರ್ತಗಳಲ್ಲಿ ಹೊಸ ಆರಂಭ & ಸತ್ಕಾರ್ಯಗಳನ್ನು ನಿರ್ಧರಿಸಿ; ಅಶುಭ ಕಾಲಗಳಲ್ಲಿ ಯಾವುದೇ ಹೊಸ ಕೆಲಸ ಆರಂಭಿಸುವುದನ್ನು ಕಡ್ಡಾಯವಾಗಿ ತಪ್ಪಿಸಿ.'
                      : currentLang === 'hi'
                      ? 'शुभ मुहूर्त में मांगलिक कार्य एवं नवीन आरम्भ करें; अशुभ वेला में नए कार्य आरम्भ करने से बचें।'
                      : 'Choose Shubh timings for starting auspicious works and good deeds; strictly avoid commencing anything during Ashubh timings.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRequestNotification}
                className={`px-3 py-1.5 text-xs rounded-xl border flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs cursor-pointer ${
                  notificationEnabled 
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-400'
                }`}
                title="Enable local reminder notifications for this day's planetary periods"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notificationEnabled ? 'Alerts Armed' : (currentLang === 'kn' ? 'ಎಚ್ಚರಿಕೆ ಸೂಚನೆ' : currentLang === 'hi' ? 'सूचना सेट करें' : 'Set Alerts')}</span>
              </button>
            </div>

            {/* Quick Action Decision Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
              <div className="p-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                <span className="text-base shrink-0">🟢</span>
                <p className="text-[11.5px] leading-snug">
                  <strong>{currentLang === 'kn' ? 'ಶುಭ ಕಾಲಗಳು: ' : 'Shubh Timings: '}</strong>
                  {currentLang === 'kn'
                    ? 'ವ್ಯಾಪಾರಾರಂಭ, ಒಪ್ಪಂದ, ಪೂಜೆ, ಚಿನ್ನ/ವಾಹನ ಖರೀದಿ, ಪ್ರಯಾಣ ಮತ್ತು ಸತ್ಕಾರ್ಯಗಳನ್ನು ಈ ಶುಭ ಘಳಿಗೆಗಳಲ್ಲಿ ನಿರ್ಧರಿಸಿ.'
                    : 'Best for commencing business, contracts, pooja, asset purchases, travel, and sacred deeds.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-950 dark:text-rose-200 flex items-center gap-2">
                <span className="text-base shrink-0">🔴</span>
                <p className="text-[11.5px] leading-snug">
                  <strong>{currentLang === 'kn' ? 'ಅಶುಭ ಕಾಲಗಳು: ' : 'Ashubh Timings: '}</strong>
                  {currentLang === 'kn'
                    ? 'ಯಾವುದೇ ಹೊಸ ವ್ಯವಹಾರ, ಒಪ್ಪಂದ, ಸಾಲ, ಖರೀದಿ ಅಥವಾ ಪ್ರಯಾಣವನ್ನು ಈ ತ್ಯಾಜ್ಯ ಅವಧಿಗಳಲ್ಲಿ ಆರಂಭಿಸಬೇಡಿ.'
                    : 'Strictly avoid beginning any new venture, financial investment, signing contracts, or journeys during these windows.'}
                </p>
              </div>
            </div>

            {/* TWO-COLUMN MASTER MATRIX: SHUBHA (LEFT) VS ASHUBHA (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* 🟢 COLUMN 1: SHUBH TIMINGS (ಶುಭ ಮುಹೂರ್ತಗಳು - Auspicious Works & Good Deeds) */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-white to-emerald-50/30 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-emerald-500 dark:border-emerald-700 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-emerald-200 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h5 className="font-serif font-black text-sm sm:text-base text-emerald-950 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತಗಳು (Shubh Timings)' : currentLang === 'hi' ? 'शुभ मुहूर्त (Shubh Timings)' : 'Shubh Auspicious Windows'}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 uppercase">
                    {currentLang === 'kn' ? '✓ ಸತ್ಕಾರ್ಯಕ್ಕೆ ಶ್ರೇಷ್ಠ' : '✓ Good Deeds'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* 1. Abhijit Muhurta */}
                  <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🌟</span>
                        <span>{currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'अभिजित मुहूर्त' : 'Abhijit Muhurta'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                        {day.abhijitMuhurta.start} - {day.abhijitMuhurta.end}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong>{currentLang === 'kn' ? 'ಯಾವುದಕ್ಕೆ ಶ್ರೇಷ್ಠ: ' : 'Best for: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಮಧ್ಯಾಹ್ನದ ಸರ್ವಸಿದ್ಧಿ ಕಾಲ. ಹೊಸ ವ್ಯಾಪಾರ, ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ, ಚಿನ್ನ/ವಾಹನ ಖರೀದಿ, ಶುಭ ಪ್ರಯಾಣ ಮತ್ತು ಸಕಲ ಕಾರ್ಯಾರಂಭಕ್ಕೆ ಅತ್ಯುತ್ಕೃಷ್ಟ.'
                        : 'Supreme midday window. Commencing new business, signing contracts, gold/asset purchase, journey, and sacred rituals.'}
                    </p>
                  </div>

                  {/* 2. Brahma Muhurta */}
                  <div className="p-3 rounded-xl border border-teal-300 dark:border-teal-800/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-900 dark:text-teal-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🧘</span>
                        <span>{currentLang === 'kn' ? 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurta'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200">
                        {day.brahmaMuhurta.start} - {day.brahmaMuhurta.end}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong>{currentLang === 'kn' ? 'ಯಾವುದಕ್ಕೆ ಶ್ರೇಷ್ಠ: ' : 'Best for: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುಂಚಿನ ಪ್ರಶಾಂತ ಅಮೃತ ವೇಳೆ. ಜಪ, ಧ್ಯಾನ, ವೇದಾಭ್ಯಾಸ, ಪ್ರಾಣಾಯಾಮ ಹಾಗೂ ದೈವ ಚಿಂತನೆಗೆ ಪರಮೋತ್ಕೃಷ್ಟ.'
                        : 'Early dawn nectar window before sunrise. Prime time for yoga, dhyana, studying, memory retention, and spiritual awakening.'}
                    </p>
                  </div>

                  {/* 3. Amrit Kaal */}
                  <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🏺</span>
                        <span>{currentLang === 'kn' ? 'ಅಮೃತ ಕಾಲ' : currentLang === 'hi' ? 'अमृत काल' : 'Amrit Kaal'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200">
                        {day.amritKaal?.start || '10:45 AM'} - {day.amritKaal?.end || '12:15 PM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong>{currentLang === 'kn' ? 'ಯಾವುದಕ್ಕೆ ಶ್ರೇಷ್ಠ: ' : 'Best for: '}</strong>
                      {currentLang === 'kn'
                        ? 'ನಕ್ಷತ್ರಾನುಸಾರ ಅಮೃತ ಘಳಿಗೆ. ದೇವತಾ ಪೂಜೆ, ಔಷಧಿ ಸೇವನೆ ಆರಂಭ, ಧನ ಹೂಡಿಕೆ ಹಾಗೂ ಕೌಟುಂಬಿಕ ಸತ್ಕಾರ್ಯಗಳಿಗೆ ಪರಮ ಶುಭ.'
                        : 'Nectar period derived from Nakshatra transit. Auspicious for japa, remedies, starting medical treatment, and financial investments.'}
                    </p>
                  </div>

                  {/* 4. Vijaya Muhurta */}
                  <div className="p-3 rounded-xl border border-sky-300 dark:border-sky-800/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900 dark:text-sky-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🏹</span>
                        <span>{currentLang === 'kn' ? 'ವಿಜಯ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'विजय मुहूर्त' : 'Vijaya Muhurta'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200">
                        {day.vijayaMuhurta?.start || '02:15 PM'} - {day.vijayaMuhurta?.end || '03:03 PM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong>{currentLang === 'kn' ? 'ಯಾವುದಕ್ಕೆ ಶ್ರೇಷ್ಠ: ' : 'Best for: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಅಪರಾಹ್ನದ ವಿಜಯ ಕಾಲ. ವಾದ-ವಿವಾದ ಇತ್ಯರ್ಥ, ಕಠಿಣ ಕಾರ್ಯಗಳಲ್ಲಿ ಜಯ, ನೂತನ ಯೋಜನೆಗಳು ಹಾಗೂ ವ್ಯಾಪಾರ ವಿಸ್ತರಣೆಗೆ ಫಲದಾಯಕ.'
                        : 'Afternoon victory window. Excellent for negotiations, overcoming obstacles, legal victories, and major undertakings.'}
                    </p>
                  </div>

                  {/* 5. Godhuli Muhurta */}
                  <div className="p-3 rounded-xl border border-orange-300 dark:border-orange-800/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-900 dark:text-orange-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🌅</span>
                        <span>{currentLang === 'kn' ? 'ಗೋಧೂಳಿ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'गोधूलि मुहूर्त' : 'Godhuli Muhurta'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded border border-orange-200">
                        {day.godhuliMuhurta?.start || '06:05 PM'} - {day.godhuliMuhurta?.end || '06:53 PM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong>{currentLang === 'kn' ? 'ಯಾವುದಕ್ಕೆ ಶ್ರೇಷ್ಠ: ' : 'Best for: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಸಂಜೆಯ ಸಂಧಿಕಾಲ. ಮನೆಯಲ್ಲಿ ದೀಪ ಪ್ರಜ್ವಲನೆ, ಲಕ್ಷ್ಮೀ ಆರಾಧನೆ, ಸಂಧ್ಯಾವಂದನೆ ಹಾಗೂ ಗೃಹಪ್ರವೇಶದ ಸಂಜೆ ಕಾರ್ಯಗಳಿಗೆ ಶ್ರೇಷ್ಠ.'
                        : 'Twilight sunset window. Highly revered for lighting the evening lamp, Lakshmi aradhana, and peaceful domestic rites.'}
                    </p>
                  </div>

                  {/* 6. Dashami Special: Kalasa Visarjana & Udwasana Muhurta (10th Day) */}
                  {(day.tithiNumber === 10 || day.festivals.some(f => f.name.en.toLowerCase().includes('dashami') || f.name.en.toLowerCase().includes('vijaya'))) && (
                    <div className="p-3.5 rounded-xl border-2 border-emerald-500 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 shadow-2xs space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                          <span>🏺</span>
                          <span>{currentLang === 'kn' ? '೧೦ನೇ ದಿನದ ದಶಮಿ ಕಲಶ ವಿಸರ್ಜನಾ ಮುಹೂರ್ತ' : currentLang === 'hi' ? '१०वें दिन का दशमी कलश विसर्जन मुहूर्त' : '10th Day Dashami Kalasa Visarjan Window'}</span>
                        </span>
                        <span className="font-mono font-black text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 bg-white dark:bg-stone-850 px-2 py-0.5 rounded border border-emerald-300">
                          {day.sunrise} - 08:45 AM / {day.vijayaMuhurta?.start || '02:00 PM'} - {day.vijayaMuhurta?.end || '02:46 PM'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                        <strong>{currentLang === 'kn' ? 'ಸತ್ಕಾರ್ಯ & ವಿಧಿ: ' : 'Auspicious Work & Method: '}</strong>
                        {currentLang === 'kn'
                          ? `ಕಲಶ ಉದ್ವಾಸನೆ ಮಾಡಿ ಪವಿತ್ರ ತೀರ್ಥ ಪ್ರೋಕ್ಷಿಸಲು ಪ್ರಾತಃಕಾಲ (${day.sunrise} - 08:45 AM) ಅಥವಾ ಅಪರಾಹ್ನ ವಿಜಯ ಮುಹೂರ್ತ ಶ್ರೇಷ್ಠ. ದಶಮಿ ಮುಕ್ತಾಯ (${day.tithiTiming ? day.tithiTiming.endTimeFormatted[currentLang] : '02:46 PM'}) ಮುನ್ನ ಪೂರ್ಣಗೊಳಿಸಬೇಕು.`
                          : `Ideal morning (${day.sunrise} - 08:45 AM) or Vijaya window (${day.vijayaMuhurta?.start || '02:00 PM'} - ${day.vijayaMuhurta?.end || '02:46 PM'}) for moving the sacred pot and household theertha prokshana. Conclude before Dashami tithi limit.`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 🔴 COLUMN 2: ASHUBH TIMINGS (ಅಶುಭ ಕಾಲಗಳು - Strictly Avoid Starting Works) */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-500/10 via-white to-rose-50/30 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-rose-500 dark:border-rose-700 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-rose-200 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h5 className="font-serif font-black text-sm sm:text-base text-rose-950 dark:text-rose-300">
                      {currentLang === 'kn' ? 'ತ್ಯಾಜ್ಯ ಅಶುಭ ಕಾಲಗಳು (Ashubh Timings)' : currentLang === 'hi' ? 'वर्ज्य अशुभ काल (Ashubh Timings)' : 'Ashubh Inauspicious Windows'}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-700 uppercase">
                    {currentLang === 'kn' ? '✗ ಆರಂಭಿಸಬೇಡಿ' : '✗ Strictly Avoid'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* 1. Rahu Kaal */}
                  <div className="p-3 rounded-xl border-2 border-rose-300 dark:border-rose-900/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>{currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal)' : currentLang === 'hi' ? 'राहु काल' : 'Rahu Kaal'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-300">
                        {day.rahuKaal.start} - {day.rahuKaal.end}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong className="text-rose-700 dark:text-rose-400">{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ: ' : 'Strictly Avoid: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಹೊಸ ವ್ಯಾಪಾರ, ಹಣದ ಹೂಡಿಕೆ, ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ, ಚಿನ್ನ/ವಾಹನ ಖರೀದಿ ಹಾಗೂ ಪ್ರಯಾಣವನ್ನು ರಾಹು ಕಾಲದಲ್ಲಿ ತಪ್ಪಿಸಲೇಬೇಕು.'
                        : 'Strictly avoid commencing any new ventures, financial investment, signing contracts, buying assets, or travel.'}
                    </p>
                    <div className="text-[10px] font-mono text-stone-500 pt-0.5">
                      {currentLang === 'kn' ? 'ಹಿಂದು ಕಾಲಮಾನ: ' : 'Traditional: '} {day.rahuKaal.startGhati.split('(')[0]}
                    </div>
                  </div>

                  {/* 2. Yamaganda Kaal */}
                  <div className="p-3 rounded-xl border border-blue-300 dark:border-blue-900/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 dark:text-blue-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🛑</span>
                        <span>{currentLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda)' : currentLang === 'hi' ? 'यमगण्ड काल' : 'Yamaganda Kaal'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">
                        {day.yamagandaKaal.start} - {day.yamagandaKaal.end}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong className="text-blue-700 dark:text-blue-400">{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ: ' : 'Strictly Avoid: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಮುಖ್ಯ ಪ್ರಯಾಣ ಆರಂಭ, ಪ್ರಮುಖ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಮಹತ್ವದ ಕಾರ್ಯಗಳನ್ನು ಯಮಗಂಡ ಕಾಲದಲ್ಲಿ ಆರಂಭಿಸಬಾರದು.'
                        : 'Ketu sub-period. Avoid starting journeys, vital transactions, medical surgeries, or decisive life agreements.'}
                    </p>
                    <div className="text-[10px] font-mono text-stone-500 pt-0.5">
                      {currentLang === 'kn' ? 'ಹಿಂದು ಕಾಲಮಾನ: ' : 'Traditional: '} {day.yamagandaKaal.startGhati.split('(')[0]}
                    </div>
                  </div>

                  {/* 3. Gulika Kaal */}
                  <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-900/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>⏳</span>
                        <span>{currentLang === 'kn' ? 'ಗುಳಿಕ ಕಾಲ (Gulika Kaal)' : currentLang === 'hi' ? 'गुलिक काल' : 'Gulika Kaal'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200">
                        {day.gulikaKaal.start} - {day.gulikaKaal.end}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong className="text-amber-700 dark:text-amber-400">{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ: ' : 'Strictly Avoid: '}</strong>
                      {currentLang === 'kn'
                        ? 'ಶನಿ ಪ್ರಭಾವಿತ ಅವಧಿ. ಪುನರಾವರ್ತನೆ ಬಯಸದ ಕಾರ್ಯಗಳು (ವಿವಾಹ, ಸಾಲ ಮರುಪಾವತಿ, ಶುಭಾರಂಭ) ಇಲ್ಲಿ ತ್ಯಾಜ್ಯ.'
                        : 'Saturn sub-period. Anything started here tends to recur or face sluggish delays; avoid marriage or borrowing.'}
                    </p>
                    <div className="text-[10px] font-mono text-stone-500 pt-0.5">
                      {currentLang === 'kn' ? 'ಹಿಂದು ಕಾಲಮಾನ: ' : 'Traditional: '} {day.gulikaKaal.startGhati.split('(')[0]}
                    </div>
                  </div>

                  {/* 4. Durmuhurta */}
                  <div className="p-3 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>{currentLang === 'kn' ? 'ದುರ್ಮುಹೂರ್ತ (Durmuhurta)' : currentLang === 'hi' ? 'दुर्मुहूर्त' : 'Durmuhurta'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-300">
                        {day.durmuhurta?.start || '12:35 PM'} - {day.durmuhurta?.end || '01:22 PM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong className="text-rose-700 dark:text-rose-400">{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ: ' : 'Strictly Avoid: '}</strong>
                      {currentLang === 'kn'
                        ? 'ವಾರಾನುಗುಣ ಪ್ರತಿಕೂಲ ಸೌರ ಮುಹೂರ್ತ. ಯಾವುದೇ ಶುಭ ಮಂಗಳ ಕಾರ್ಯಗಳನ್ನು ಈ ಸಮಯದಲ್ಲಿ ಮಾಡಬಾರದು.'
                        : 'Adverse astrological planetary window based on weekday rules. All auspicious and sacred ceremonies are prohibited.'}
                    </p>
                  </div>

                  {/* 5. Varjyam (Visha Ghatika) */}
                  <div className="p-3 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-white dark:bg-stone-850 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🚫</span>
                        <span>{currentLang === 'kn' ? 'ವರ್ಜ್ಯಂ / ವಿಷ ಘಳಿಗೆ (Varjyam)' : currentLang === 'hi' ? 'वर्ज्यम् (विष काल)' : 'Varjyam (Visha Kaal)'}</span>
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-300">
                        {day.varjyam?.start || '07:45 PM'} - {day.varjyam?.end || '09:15 PM'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                      <strong className="text-rose-700 dark:text-rose-400">{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ: ' : 'Strictly Avoid: '}</strong>
                      {currentLang === 'kn'
                        ? 'ನಕ್ಷತ್ರದ ೪ ಘಟಿ (೯೬ ನಿಮಿಷಗಳ) ವಿಷಕಾರಿ ಕಾಲಾವಧಿ. ಸತ್ಕಾರ್ಯ, ಗೃಹಪ್ರವೇಶ ಅಥವಾ ಮಾಂಗಲ್ಯ ಕಾರ್ಯಗಳಿಗೆ ನಿಷೇಧ.'
                        : 'Poisonous Nakshatra window (~96 minutes). Strictly shunned for marriage, housewarming, or signing agreements.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. FESTIVALS, SPECIAL NAVARATRI MAHOTSAVA & DASHAMI KALASA VISARJANA */}
          {/* ========================================================================= */}
          <div id="festivals-rituals-section" className="space-y-4">
          
          {/* SPECIAL: Navaratri Mahotsava & Specific Rituals (Kalasha Sthapana, Kushmanda Bali, Ayudha Puja, Vijayadashami, Daily Durga) */}
          {day.festivals.some(f => f.isNavaratri || f.id.startsWith('navaratri_day')) && (() => {
            const navFest = day.festivals.find(f => f.isNavaratri || f.id.startsWith('navaratri_day'))!;
            const dayNum = parseInt(navFest.id.replace('navaratri_day', ''), 10) || 1;
            const ritualData = NAVARATRI_10_DAYS_RITUALS[dayNum] || NAVARATRI_10_DAYS_RITUALS[1];
            const sandhiTiming = getCalculatedSandhiTiming(day);

            const handleOpenRitualGuide = (tab?: 'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami') => {
              const targetTab = tab || (dayNum === 1 ? 'kalasha' : dayNum === 8 ? 'kushmandaBali' : dayNum === 9 ? 'ayudhaPuja' : dayNum === 10 ? 'vijayadashami' : 'dailyDurga');
              if (onOpenNavaratriRituals) {
                onOpenNavaratriRituals(dayNum, targetTab);
              } else {
                setLocalRitualsTab(targetTab);
                setShowLocalRitualsModal(true);
              }
            };

            return (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-red-500/15 via-amber-500/10 to-orange-500/15 border-2 border-red-500/50 dark:border-red-900 shadow-lg space-y-4">
                
                {/* Header Banner with Day Pill and Quick Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200 dark:border-red-900/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center text-2xl shadow-md border border-amber-300 shrink-0">
                      {dayNum === 1 ? '🏺' : dayNum === 8 ? '🗡️' : dayNum === 9 ? '🛠️' : dayNum === 10 ? '🏹' : '🌺'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold text-[10.5px]">
                          {currentLang === 'kn' ? `ನವರಾತ್ರಿ ದಿನ ${dayNum}` : `Navaratri Day ${dayNum}`}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {ritualData.tithiTitle[currentLang]}
                        </span>
                      </div>
                      <h3 className="font-serif font-black text-base sm:text-lg text-red-950 dark:text-red-200 tracking-tight mt-0.5">
                        {ritualData.name[currentLang]}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenRitualGuide()}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>📖 {currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ವಿಧಿ-ವಿಧಾನ ಗವಾಕ್ಷಿ' : 'Full Rituals Hub'}</span>
                  </button>
                </div>

                {/* ================================================================= */}
                {/* DAY 1: KALASHA STHAPANA & SHAILAPUTRI PUJA */}
                {/* ================================================================= */}
                {dayNum === 1 && (
                  <div className="space-y-3.5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850/90 border border-amber-300 dark:border-amber-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಶುಭ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಶ್ರೇಷ್ಠ ಕಾಲ):' : currentLang === 'hi' ? 'अभिजित मुहूर्त (सर्वश्रेष्ठ वेला):' : 'Abhijit Muhurta (Supreme Window):'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          {day.abhijitMuhurta.start} - {day.abhijitMuhurta.end}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನದ ಶುಭ ಕಾಲ — ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನೆಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತ.' : currentLang === 'hi' ? 'मध्याह्न की शुभ वेला — कलश प्रतिष्ठापना हेतु सर्वोत्तम।' : 'Midday window — Most auspicious for Kalasha Prathisthapana.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850/90 border border-amber-300 dark:border-amber-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'प्रातःकालीन शुभ वेला:' : 'Morning Shubh Window:'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          {day.sunrise} - 08:45 AM
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯದ ಶುಭ ಕಾಲ — ಧಾನ್ಯ ಪೀಠ ಸಿದ್ಧತೆ ಮತ್ತು ಕಲಶ ಸ್ಥಾಪನೆ.' : currentLang === 'hi' ? 'सूर्योदय वेला — वेदी निर्माण एवं कलश स्थापन।' : 'Sunrise window — Peetha preparation and initial grain sowing.'}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 border border-stone-200 dark:border-stone-700 text-xs leading-relaxed space-y-3">
                      <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                        <span>{currentLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆಯ ೫ ಮುಖ್ಯ ಹಂತಗಳು:' : currentLang === 'hi' ? 'कलश स्थापना के ५ मुख्य चरण:' : 'Kalasha Sthapana 5-Step Method:'}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenRitualGuide('kalasha')}
                          className="text-red-600 dark:text-red-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {currentLang === 'kn' ? 'ಸಾಮಗ್ರಿ ಚೆಕ್‌ಲಿಸ್ಟ್ & ಮಂತ್ರಗಳು →' : currentLang === 'hi' ? 'सामग्री चेकलिस्ट व मन्त्र →' : 'View Samagri Checklist →'}
                        </button>
                      </div>

                      {/* Explicit Kalasha Material Rule: Brass (Hittale), Copper (Tamra), Silver (Belli) */}
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 flex items-center gap-2">
                        <span className="text-base">🏺</span>
                        <span className="text-[11px] text-amber-950 dark:text-amber-200">
                          <strong>{currentLang === 'kn' ? 'ಕಲಶ ಪಾತ್ರೆ (ಧಾತು): ' : currentLang === 'hi' ? 'कलश पात्र (धातु): ' : 'Kalasha Vessel (Metals): '}</strong>
                          {currentLang === 'kn' 
                            ? 'ಹಿತ್ತಾಳೆ (Brass), ಶುದ್ಧ ತಾಮ್ರ (Copper), ಅಥವಾ ಬೆಳ್ಳಿಯ (Silver) ಚೊಂಬು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ. (ಸ್ಟೀಲ್ ಅಥವಾ ಪ್ಲಾಸ್ಟಿಕ್ ಪಾತ್ರೆಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಬಳಸಬಾರದು).' 
                            : currentLang === 'hi'
                            ? 'पीतल (Brass), शुद्ध तांबा (Copper), अथवा चांदी (Silver) का लोटा सर्वश्रेष्ठ है। (स्टील अथवा प्लास्टिक वर्जित है)।'
                            : 'Brass (Hittale), Pure Copper (Tamra), or Silver (Belli) pot is supreme. (Iron, steel, or plastic vessels are strictly prohibited).'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {KALASHA_STHAPANA_STEPS.map((step) => (
                          <div key={step.stepNumber} className="text-[11.5px] leading-relaxed">
                            <strong className="text-red-700 dark:text-red-400">{step.title[currentLang]} </strong>
                            <span className="text-stone-700 dark:text-stone-300">{step.instruction[currentLang]}</span>
                          </div>
                        ))}
                      </div>

                      {/* River Invocation & Devi Aavahana */}
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1.5 mt-2">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">
                          {currentLang === 'kn' ? 'ವರುಣ & ಸಪ್ತ ನದಿ ಆವಾಹನಾ ಮಂತ್ರ:' : currentLang === 'hi' ? 'सप्त नदी एवं देवी आवाहन मन्त्र:' : 'Sacred River & Devi Mantras:'}
                        </span>
                        <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">
                          {currentLang === 'kn' 
                            ? '"ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ | ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ||"'
                            : '"गङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥"'}
                        </p>
                        <p className="font-serif font-bold text-red-900 dark:text-red-300 text-xs mt-1">
                          {currentLang === 'kn'
                            ? '"ಕಲಶೇ ಮಹಾಲಕ್ಷ್ಮೀಂ / ದುರ್ಗಾಂ ಆವಾಹಯಾಮಿ, ಸ್ಥಾಪಯಾಮಿ, ಪೂಜಯಾಮಿ."'
                            : '"कलशे महालक्ष्मीं / दुर्गाम् आवाहयामि, स्थापयामि, पूजयामि।"'}
                        </p>
                      </div>
                    </div>

                    {/* AKHANDA DEEPA STHAPANA & DIRECTION CARD ON DAY 1 */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400 dark:border-amber-700/80 shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-300 dark:border-amber-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🪔</span>
                          <div>
                            <h4 className="font-serif font-bold text-sm sm:text-base text-amber-950 dark:text-amber-200">
                              {AKHANDA_DEEPA_STHAPANA_DETAILS.title[currentLang]}
                            </h4>
                            <p className="text-[10.5px] text-amber-800 dark:text-amber-400 font-medium">
                              {AKHANDA_DEEPA_STHAPANA_DETAILS.subtitle[currentLang]}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenRitualGuide('akhandaDeepa')}
                          className="text-amber-800 dark:text-amber-300 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          {currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ದೀಪ ವಿಧಿ →' : 'Full Deepa Vidhi →'}
                        </button>
                      </div>

                      {/* Direction Rule Banner */}
                      <div className="p-3 rounded-xl bg-red-600 text-white space-y-1 shadow-sm">
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                          <Compass className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>{currentLang === 'kn' ? 'ಕಡ್ಡಾಯ ದಿಕ್ಕಿನ ನಿಯಮ (Direction):' : 'Strict Direction Rule:'}</span>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-amber-50">
                          {AKHANDA_DEEPA_STHAPANA_DETAILS.directionSignificance[currentLang]}
                        </p>
                      </div>

                      {/* Samagri & Requirements */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {AKHANDA_DEEPA_STHAPANA_DETAILS.samagriList.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 space-y-0.5">
                            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                              <span>{item.icon || '🪔'}</span>
                              <span>{item.name[currentLang]}</span>
                            </span>
                            <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                              {item.details[currentLang]}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Deepa Lighting Mantra */}
                      <div className="p-3.5 rounded-xl bg-amber-100/80 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">
                          {currentLang === 'kn' ? 'ದೀಪ ಪ್ರಜ್ವಲನೆ ಮಾಡುವಾಗ ಹೇಳಬೇಕಾದ ಶ್ಲೋಕ (Mantra):' : 'Mantra to chant while kindling the flame:'}
                        </span>
                        <p className="font-serif font-black text-amber-950 dark:text-amber-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                          {currentLang === 'kn' ? AKHANDA_DEEPA_STHAPANA_DETAILS.deepaMantra.kannadaText : AKHANDA_DEEPA_STHAPANA_DETAILS.deepaMantra.sanskritText}
                        </p>
                        <p className="text-[10.5px] text-stone-600 dark:text-stone-400 italic">
                          {AKHANDA_DEEPA_STHAPANA_DETAILS.deepaMantra.meaning[currentLang]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* DAY 8: MAHA ASHTAMI, SANDHI PUJA & KUSHMANDA (PUMPKIN) BALI */}
                {/* ================================================================= */}
                {dayNum === 8 && (
                  <div className="space-y-3.5 animate-in fade-in">
                    
                    {/* Calculated Sandhi Windows */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-400 dark:border-purple-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                            {currentLang === 'kn' ? '೧. ಸಂಧಿ ಪೂಜಾ ಕಾಲ (೪೮ ನಿಮಿಷ):' : currentLang === 'hi' ? '१. सन्धि पूजा काल (४८ मिनट):' : '1. Sandhi Kala (48-Minute Confluence):'}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 font-bold">
                            Peak Shakti
                          </span>
                        </div>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          {sandhiTiming.sandhiStart} - {sandhiTiming.sandhiEnd}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-purple-950 dark:text-purple-200 bg-purple-100/80 dark:bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-300 dark:border-purple-800 font-medium mt-1">
                          <span>⏱️ {currentLang === 'kn' ? 'ಅಷ್ಟಮಿ ತಿಥಿ ಮುಕ್ತಾಯ:' : currentLang === 'hi' ? 'अष्टमी तिथि समाप्ति:' : 'Ashtami Tithi Ends:'}</span>
                          <span className="font-mono font-black">{sandhiTiming.ashtamiEndTimeStr}</span>
                        </div>
                        <div className="text-xs text-purple-900 dark:text-purple-300 font-bold mt-1">
                          {currentLang === 'kn' ? 'ಬಲಿ ಕೊಯ್ಯುವ ನಿಖರ ಕ್ಷಣ (ದ್ವಿತೀಯಾರ್ಧ):' : currentLang === 'hi' ? 'बलि छेदन का यथार्थ समय (द्वितीयार्ध):' : 'Bali Cutting Moment (2nd Half):'}{' '}
                          <span className="font-mono text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 px-1.5 py-0.5 rounded border border-purple-300">
                            {sandhiTiming.baliWindowStart} - {sandhiTiming.baliWindowEnd}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-tight">
                          {currentLang === 'kn' 
                            ? `ಅಷ್ಟಮಿ ಮುಕ್ತಾಯದ (${sandhiTiming.ashtamiEndTimeStr}) ಹಿಂದಿನ ೨೪ ನಿಮಿಷ ಮತ್ತು ನವಮಿಯ ಮೊದಲ ೨೪ ನಿಮಿಷಗಳ ನಿಖರ ಸಂಧಿ.` 
                            : currentLang === 'hi' 
                            ? `अष्टमी समाप्ति (${sandhiTiming.ashtamiEndTimeStr}) के पूर्व २४ मिनट एवं नवमी के प्रथम २४ मिनट का संगम।` 
                            : `Exact 48-minute scriptural junction around Ashtami end (${sandhiTiming.ashtamiEndTimeStr}) and Navami onset.`}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? '೨. ಪರ್ಯಾಯ ಕಾಲ (ಪ್ರದೋಷ ಕಾಲ):' : currentLang === 'hi' ? '२. शास्त्रसम्मत विकल्प (प्रदोष वेला):' : '2. Alternative Window (Pradosha Kala):'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          {sandhiTiming.pradoshaStart} - {sandhiTiming.pradoshaEnd}
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-normal">
                          {currentLang === 'kn' 
                            ? 'ಮಧ್ಯರಾತ್ರಿ ಸಂಧಿಕಾಲ ಆಚರಿಸಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ, ಅಷ್ಟಮಿಯ ಸೂರ್ಯಾಸ್ತದ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಅರ್ಚನೆ ಮುಗಿಸಿ ಕೂಷ್ಮಾಂಡ ಬಲಿ ಸಮರ್ಪಿಸಬಹುದು.' 
                            : currentLang === 'hi'
                            ? 'यदि मध्यरात्रि सन्धिकाल सम्भव न हो, तो अष्टमी की सायंकालीन प्रदोष वेला में पूजन कर सात्त्विक बलि समर्पित करें।'
                            : 'If midnight sandhi cannot be observed, the Bali is scripturally offered during sunset Pradosha transition.'}
                        </p>
                      </div>
                    </div>

                    {/* Kushmanda / Ash Gourd Significance & Method */}
                    <div className="p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 border border-purple-200 dark:border-stone-700 text-xs leading-relaxed space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-1.5">
                        <span className="font-bold text-purple-900 dark:text-purple-300 text-xs flex items-center gap-1.5">
                          <span>🎃</span>
                          <span>{currentLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಬಲಿಯ ಸಾತ್ವಿಕ ರಹಸ್ಯ & ವಿಧಾನ:' : currentLang === 'hi' ? 'कूष्माण्ड सात्त्विक बलि का रहस्य एवं विधान:' : 'Kushmanda (Ash Gourd) Satvik Bali Method:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenRitualGuide('kushmandaBali')}
                          className="text-purple-600 dark:text-purple-400 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          {currentLang === 'kn' ? 'ವಿವರವಾದ ಬಲಿ ವಿಧಿ →' : currentLang === 'hi' ? 'सम्पूर्ण बलि विधि →' : 'Detailed Bali Guide →'}
                        </button>
                      </div>

                      <p className="text-stone-700 dark:text-stone-300 text-[11.5px]">
                        {SANDHI_PUJA_DETAILS.kushmandaSignificance[currentLang]}
                      </p>

                      {/* Sacred Bali Invocation Mantra */}
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 space-y-1">
                        <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ ಬಲಿ ಸಮರ್ಪಣಾ ಮಂತ್ರ:' : currentLang === 'hi' ? 'कूष्माण्ड बलि समर्पण मन्त्र:' : 'Sacred Bali Invocation Mantra:'}
                        </span>
                        <p className="font-serif font-bold text-red-950 dark:text-red-200 text-xs sm:text-sm">
                          "{currentLang === 'kn' ? SANDHI_PUJA_DETAILS.baliMantra.kannadaText : SANDHI_PUJA_DETAILS.baliMantra.sanskritText}"
                        </p>
                        <p className="text-[11px] font-mono text-stone-500">
                          {SANDHI_PUJA_DETAILS.baliMantra.englishTransliteration}
                        </p>
                        <p className="text-[11px] text-stone-700 dark:text-stone-300 pt-1 border-t border-red-200 dark:border-stone-800">
                          <strong>{currentLang === 'kn' ? 'ಭಾವಾರ್ಥ:' : currentLang === 'hi' ? 'भावार्थ:' : 'Meaning:'}</strong> {SANDHI_PUJA_DETAILS.baliMantra.meaning[currentLang]}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-300 pt-1">
                        {SANDHI_PUJA_DETAILS.stepByStepBaliVidhi.map((stepItem) => (
                          <div key={stepItem.step}>
                            <strong className="text-purple-900 dark:text-purple-300">{stepItem.step}. {stepItem.title[currentLang]}:</strong>{' '}
                            <span>{stepItem.desc[currentLang]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ================================================================= */}
                {/* DAY 9: MAHA NAVAMI, AYUDHA PUJA & SARASWATI PUJA */}
                {/* ================================================================= */}
                {dayNum === 9 && (
                  <div className="space-y-3.5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಆಯುಧ ಪೂಜಾ ಪ್ರಾತಃಕಾಲ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'आयुध पूजा प्रातःकालीन मुहूर्त:' : 'Morning Auspicious Window:'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          06:15 AM - 08:45 AM
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {currentLang === 'kn' ? 'ಅಮೃತ ಮುಹೂರ್ತ — ವಾಹನ, ಯಂತ್ರ ಮತ್ತು ಗೃಹ ಪರಿಕರಗಳ ಪೂಜೆಗೆ ಶ್ರೇಷ್ಠ.' : currentLang === 'hi' ? 'अमृत वेला — वाहन, यन्त्र व औजार पूजन हेतु प्रशस्त।' : 'Amrit window for vehicles, tools, and artisanal instruments.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'मध्याह्न अभिजित वेला:' : 'Midday Abhijit Window:'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          11:45 AM - 12:35 PM
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {currentLang === 'kn' ? 'ಕಾರ್ಖಾನೆ, ಕಚೇರಿ, ವಾಣಿಜ್ಯ ಉಪಕರಣಗಳ ಪೂಜೆಗೆ ಪ್ರಶಸ್ತ ಸಮಯ.' : currentLang === 'hi' ? 'कारखाना, आईटी प्रतिष्ठान व व्यापारिक यन्त्र पूजन हेतु प्रशस्त।' : 'Ideal window for industrial, corporate, and commercial machinery.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 border border-sky-200 dark:border-stone-700 text-xs leading-relaxed space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-1.5">
                        <span className="font-bold text-sky-900 dark:text-sky-300 text-xs">
                          {currentLang === 'kn' ? 'ಆಯುಧ & ಸರಸ್ವತೀ ಪೂಜಾ ಕ್ರಮ (೫ ಮುಖ್ಯ ಹಂತಗಳು):' : currentLang === 'hi' ? 'आयुध एवं सरस्वती पूजा विधि (५ चरण):' : 'Ayudha & Saraswati Puja 5-Step Method:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenRitualGuide('ayudhaPuja')}
                          className="text-sky-600 dark:text-sky-400 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          {currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ವಿವರ →' : currentLang === 'hi' ? 'सम्पूर्ण विधि →' : 'Full Guide →'}
                        </button>
                      </div>
                      
                      <p className="text-stone-700 dark:text-stone-300 text-[11.5px]">
                        {AYUDHA_PUJA_DETAILS.significance[currentLang]}
                      </p>

                      <div className="space-y-2 pt-1">
                        {AYUDHA_PUJA_DETAILS.steps.map((st) => (
                          <div key={st.step} className="text-[11.5px] leading-relaxed">
                            <strong className="text-sky-800 dark:text-sky-300">{st.title[currentLang]} </strong>
                            <span className="text-stone-700 dark:text-stone-300">{st.desc[currentLang]}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sacred Ayudha & Saraswati Mantra */}
                      <div className="p-3 rounded-xl bg-sky-50 dark:bg-stone-900 border border-sky-200 dark:border-stone-700 space-y-1">
                        <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಆಯುಧ & ಸರಸ್ವತೀ ಮಂತ್ರಗಳು:' : currentLang === 'hi' ? 'आयुध व सरस्वती मन्त्र:' : 'Sacred Mantras:'}
                        </span>
                        <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs whitespace-pre-line">
                          {currentLang === 'kn' ? AYUDHA_PUJA_DETAILS.mantra.kannadaText : AYUDHA_PUJA_DETAILS.mantra.sanskritText}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* DAY 10: VIJAYADASHAMI, VIDYARAMBHA, SHAMI & KALASHA VISARJANA */}
                {/* ================================================================= */}
                {dayNum === 10 && (
                  <div className="space-y-4 animate-in fade-in">
                    
                    {/* DEDICATED KALASHA VISARJANA & UDWASANA MUHURTA BANNER (10TH DAY OF DASHAMI) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-amber-500/15 to-emerald-600/15 border-2 border-emerald-500 dark:border-emerald-600 shadow-md space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-300 dark:border-emerald-800 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl p-2 rounded-xl bg-emerald-600 text-white shadow-xs">🏺</span>
                          <div>
                            <h4 className="font-serif font-black text-base sm:text-lg text-emerald-950 dark:text-emerald-200">
                              {currentLang === 'kn' ? 'ದಶಮಿ ಕಲಶ ವಿಸರ್ಜನಾ (ಉದ್ವಾಸನಾ) ಶುಭ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'दशमी कलश विसर्जन (उद्वासन) शुभ मुहूर्त' : 'Dashami Kalasa Visarjana (Udwasana) Auspicious Muhurta'}
                            </h4>
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                              {currentLang === 'kn' ? '೧೦ನೇ ದಿನದ ಸಕಲ ಪಾಪಹರ ಕಲಶ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ & ದೇವೀ ವಿಸರ್ಜನಾ ಕಾಲ' : '10th Day Sacred Kalasha Visarjan, Udwasana & Theertha Consecration'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-emerald-600 text-white shadow-xs self-start sm:self-auto uppercase">
                          {currentLang === 'kn' ? 'ದಶಮಿ ವಿಸರ್ಜನೆ' : 'Dashami Visarjan'}
                        </span>
                      </div>

                      {/* Visarjana Timings Grid: Morning Shubh vs Afternoon Vijaya vs Tithi End Limit */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                        {/* 1. Morning Auspicious Window */}
                        <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border border-emerald-400 dark:border-emerald-700 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                              {currentLang === 'kn' ? '೧. ಪ್ರಾತಃಕಾಲ ಮುಹೂರ್ತ' : currentLang === 'hi' ? '१. प्रातःकाल मुहूर्त' : '1. Morning Shubh'}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-sans">
                              Ravi Yoga
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                            {day.sunrise} - 08:45 AM
                          </div>
                          <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                            {currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯದ ಶುಭ ಚೌಘಡಿಯದಲ್ಲಿ ಪೂಜೆ ಮುಗಿಸಿ ಶಾಂತಿಯುತ ವಿಸರ್ಜನೆಗೆ ಪ್ರಶಸ್ತ.' : 'Morning Shubh Choghadiya; ideal for peaceful morning visarjan.'}
                          </p>
                        </div>

                        {/* 2. Vijaya Muhurta Window */}
                        <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border-2 border-amber-500 dark:border-amber-600 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                              {currentLang === 'kn' ? '೨. ವಿಜಯ ಮುಹೂರ್ತ' : currentLang === 'hi' ? '२. विजय मुहूर्त' : '2. Vijaya Muhurta'}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-sans">
                              Peak Vijay
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                            {day.vijayaMuhurta?.start || '02:00 PM'} - {day.vijayaMuhurta?.end || '02:46 PM'}
                          </div>
                          <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                            {currentLang === 'kn' ? 'ದಶಮಿ ಮುಕ್ತಾಯದ ಮುನ್ನ ವಿಜಯ ಕಾಲದಲ್ಲಿ ವಿಸರ್ಜಿಸಿ ಶಮೀ ಪೂಜೆ ಮಾಡುವುದು.' : 'Auspicious afternoon victory window before Dashami concludes.'}
                          </p>
                        </div>

                        {/* 3. Dashami Tithi Deadline Window */}
                        <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border border-rose-300 dark:border-rose-800 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                              {currentLang === 'kn' ? 'ದಶಮಿ ಮುಕ್ತಾಯ ಕಾಲ' : currentLang === 'hi' ? 'दशमी समाप्ति काल' : 'Dashami Tithi Limit'}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-sans">
                              Tithi Limit
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                            {day.tithiTiming ? day.tithiTiming.endTimeFormatted[currentLang] : '02:46 PM'}
                          </div>
                          <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                            {currentLang === 'kn' ? 'ಧರ್ಮಶಾಸ್ತ್ರದಂತೆ ದಶಮಿ ತಿಥಿ ಇರುವಾಗಲೇ ಕಲಶ ವಿಸರ್ಜನೆ ಪೂರ್ಣಗೊಳಿಸಬೇಕು.' : 'Scriptures prescribe completing Kalasa Visarjan within Dashami.'}
                          </p>
                        </div>
                      </div>

                      {/* Step-by-Step Visarjana & Theertha Prokshane Guide */}
                      <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-emerald-300 dark:border-stone-700 space-y-2 text-xs">
                        <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 uppercase text-[11px]">
                          <span>✨</span>
                          <span>{currentLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನೆಯ ೫ ಹಂತದ ಶಾಸ್ತ್ರೋಕ್ತ ಕ್ರಮ (Step-by-Step Method):' : 'Kalasha Visarjana 5-Step Sacred Method:'}</span>
                        </span>
                        
                        <div className="space-y-1.5 text-[11.5px] text-stone-700 dark:text-stone-300 leading-relaxed">
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300">೧. ಮಹಾಮಂಗಳಾರತಿ: </strong>
                            <span>{currentLang === 'kn' ? 'ಕಲಶದಲ್ಲಿ ನೆಲೆಸಿರುವ ಜಗನ್ಮಾತೆಗೆ ಕರ್ಪೂರಾರತಿ ಬೆಳಗಿ, ನೈವೇದ್ಯ ಹಾಗೂ ಪ್ರಾರ್ಥನೆ ಸಲ್ಲಿಸಿ.' : 'Perform final Mahamangalarati to Mother Durga in the Kalasa.'}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300">೨. ವಿಸರ್ಜನಾ ಮಂತ್ರ: </strong>
                            <span>{currentLang === 'kn' ? 'ಭಕ್ತಿಯಿಂದ ಕೈಮುಗಿದು "ಉತ್ತಿಷ್ಠ ದೇವಿ ಗಚ್ಛ ತ್ವಂ ಪುನರಾಗಮನಾಯ ಚ..." ಅಥವಾ "ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ..." ಶ್ಲೋಕವನ್ನು ಪಠಿಸಿ.' : 'Chant the sacred Udwasana mantra inviting the Goddess to return again next year.'}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300">೩. ಉತ್ತರಾಭಿಮುಖ ಚಲನೆ: </strong>
                            <span>{currentLang === 'kn' ? 'ಕಲಶದ ಪಾತ್ರೆಯನ್ನು ಗೌರವದಿಂದ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಚಲಿಸಿ (ಉದ್ವಾಸನೆ).' : 'Gently nudge and move the Kalasa vessel northward to mark the conclusion of the 10-day stay.'}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300">೪. ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ: </strong>
                            <span>{currentLang === 'kn' ? 'ಮಾವಿನ ಎಲೆ ಅಥವಾ ದರ್ಭೆಯಿಂದ ಕಲಶದ ಪವಿತ್ರ ಗಂಗಾಜಲ ತೀರ್ಥವನ್ನು ಮನೆಯ ಎಲ್ಲಾ ಕೊಠಡಿಗಳಲ್ಲಿ, ಹೊಸ್ತಿಲಿನಲ್ಲಿ ಪ್ರೋಕ್ಷಣೆ ಮಾಡಿ (ಸಕಲ ದೃಷ್ಟಿದೋಷ ನಿವಾರಣೆ & ಸಮೃದ್ಧಿ).' : 'Sprinkle the consecrated Kalasa theertha with mango leaves across all rooms of the house for protection and prosperity.'}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300">೫. ಕಳಸದ ನಾರಿಕೇಳ (ತೆಂಗಿನಕಾಯಿ): </strong>
                            <span>{currentLang === 'kn' ? 'ಕಲಶದ ತೆಂಗಿನಕಾಯಿಯನ್ನು ಒಡೆದು ಸಿಹಿ ಪಾಯಸ ಅಥವಾ ಪ್ರಸಾದ ತಯಾರಿಸಿ ಇಡೀ ಕುಟುಂಬದವರು ಸ್ವೀಕರಿಸಿ.' : 'Break the consecrated Kalasa coconut to prepare sweet payasam prasad for the entire household.'}</span>
                          </div>
                        </div>

                        {/* Visarjana Shloka */}
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 text-center space-y-0.5 mt-2">
                          <p className="font-serif font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                            {currentLang === 'kn'
                              ? '"ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ | ಯತ್ಪೂಜಿತಂ ಮಯಾ ದೇವಿ ಪರಿಪೂರ್ಣಂ ತದಸ್ತು ಮೇ ||"'
                              : '"गच्छ गच्छ परं स्थानं स्वस्थानं परमेश्वरि । यत्पूजितं मया देवि परिपूर्णं तदस्तु मे ॥"'}
                          </p>
                          <p className="font-mono text-[10px] text-stone-500">
                            Gachha Gachha Param Sthanam Swasthanam Parameshwari | Yatpoojitam Maya Devi Paripoornam Tadastu Me ||
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vidyarambha & Shami Banni Tradition */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ವಿದ್ಯಾರಂಭ (ಅಕ್ಷರಾಭ್ಯಾಸ) ಕಾಲ:' : currentLang === 'hi' ? 'विद्यारम्भ (अक्षराभ्यास) काल:' : 'Vidyarambha (Aksharabhyasa) Window:'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          08:30 AM - 10:45 AM
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400">
                          {currentLang === 'kn' ? 'ಪುಟ್ಟ ಮಕ್ಕಳಿಗೆ ಅಕ್ಷರಾಭ್ಯಾಸ ಮಾಡಿಸಲು ಅತ್ಯಂತ ಪ್ರಶಸ್ತ ಮುಹೂರ್ತ (ತಟ್ಟೆಯ ಅಕ್ಕಿಯಲ್ಲಿ "ಓಂ ಹರಿಃ ಶ್ರೀ ಗಣಪತಯೇ ನಮಃ" ಬರೆಸುವುದು).' : 'Auspicious morning window to initiate children into reading & writing.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
                        <span className="text-[10.5px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
                          {currentLang === 'kn' ? 'ಶಮೀ (ಬನ್ನಿ) ಪೂಜೆ & ವಿನಿಮಯ:' : 'Shami (Banni) Puja & Exchange:'}
                        </span>
                        <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                          {currentLang === 'kn' ? 'ಸಾಯಂಕಾಲ ಪ್ರದೋಷ ಕಾಲ' : 'Evening Pradosha'}
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400">
                          {currentLang === 'kn' ? '"ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಎಂದು ಹಿರಿಯರಿಗೆ ಬನ್ನಿ ಕೊಟ್ಟು ನಮಸ್ಕರಿಸಿ ಆಶೀರ್ವಾದ ಪಡೆಯುವುದು.' : 'Exchanging sacred Shami leaves with elders wishing prosperous golden life.'}
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ================================================================= */}
                {/* DAYS 2 TO 7: DAILY NAVADURGA PUJA (BRAHMACHARINI TO KALARATRI) */}
                {/* ================================================================= */}
                {dayNum >= 2 && dayNum <= 7 && (
                  <div className="space-y-3.5 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-white/95 dark:bg-stone-850/95 border border-stone-200 dark:border-stone-700 text-xs leading-relaxed space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-1.5">
                        <div>
                          <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm block">
                            {ritualData.deity[currentLang]}
                          </span>
                          <span className="text-[10.5px] text-stone-500 font-mono">
                            {ritualData.defaultMuhurtaDesc[currentLang]}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenRitualGuide('dailyDurga')}
                          className="text-red-600 dark:text-red-400 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          {currentLang === 'kn' ? '೯ ದಿನಗಳ ಪೂಜಾ ವಿವರ →' : currentLang === 'hi' ? '९ देवियों की पूजा विधि →' : 'View Daily Puja →'}
                        </button>
                      </div>

                      <p className="text-stone-700 dark:text-stone-300 text-[11.5px]">
                        {ritualData.significance[currentLang]}
                      </p>

                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">
                          {currentLang === 'kn' ? 'ದಿನದ ಧ್ಯಾನ ಮಂತ್ರ:' : currentLang === 'hi' ? 'दैनिक ध्यान मन्त्र:' : 'Prescribed Dhyana Mantra:'}
                        </span>
                        <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">
                          {currentLang === 'kn' ? ritualData.dhyanaMantra.kannada : ritualData.dhyanaMantra.sanskrit}
                        </p>
                        <p className="font-mono text-[10px] text-stone-500">
                          {ritualData.dhyanaMantra.english}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* DEDICATED KALASHA VISARJANA & UDWASANA MUHURTA (10TH DAY OF DASHAMI) - Outside Navaratri Container */}
          {!day.festivals.some(f => f.isNavaratri || f.id.startsWith('navaratri_day')) && (day.tithiNumber === 10 || day.festivals.some(f => f.name.en.toLowerCase().includes('dashami') || f.name.en.toLowerCase().includes('vijaya'))) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-amber-500/15 to-emerald-600/15 border-2 border-emerald-500 dark:border-emerald-600 shadow-md space-y-3.5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-300 dark:border-emerald-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-emerald-600 text-white shadow-xs">🏺</span>
                  <div>
                    <h4 className="font-serif font-black text-base sm:text-lg text-emerald-950 dark:text-emerald-200">
                      {currentLang === 'kn' ? 'ದಶಮಿ ಕಲಶ ವಿಸರ್ಜನಾ (ಉದ್ವಾಸನಾ) ಶುಭ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'दशमी कलश विसर्जन (उद्वासन) शुभ मुहूर्त' : 'Dashami Kalasa Visarjana (Udwasana) Auspicious Muhurta'}
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      {currentLang === 'kn' ? '೧೦ನೇ ದಿನದ ಸಕಲ ಪಾಪಹರ ಕಲಶ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ & ದೇವೀ ವಿಸರ್ಜನಾ ಕಾಲ' : '10th Day Sacred Kalasha Visarjan, Udwasana & Theertha Consecration'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenNavaratriRituals) {
                      onOpenNavaratriRituals(10, 'vijayadashami');
                    } else {
                      setLocalRitualsTab('vijayadashami');
                      setShowLocalRitualsModal(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>📖</span>
                  <span>{currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ವಿಸರ್ಜನಾ ವಿಧಿ' : 'Full Visarjana Guide'}</span>
                </button>
              </div>

              {/* Visarjana Timings Grid: Morning Shubh vs Afternoon Vijaya vs Tithi End Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                {/* 1. Morning Auspicious Window */}
                <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border border-emerald-400 dark:border-emerald-700 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                      {currentLang === 'kn' ? '೧. ಪ್ರಾತಃಕಾಲ ಮುಹೂರ್ತ' : currentLang === 'hi' ? '१. प्रातःकाल मुहूर्त' : '1. Morning Shubh'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-sans">
                      Ravi Yoga
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                    {day.sunrise} - 08:45 AM
                  </div>
                  <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                    {currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯದ ಶುಭ ಚೌಘಡಿಯದಲ್ಲಿ ಪೂಜೆ ಮುಗಿಸಿ ಶಾಂತಿಯುತ ವಿಸರ್ಜನೆಗೆ ಪ್ರಶಸ್ತ.' : 'Morning Shubh Choghadiya; ideal for peaceful morning visarjan.'}
                  </p>
                </div>

                {/* 2. Vijaya Muhurta Window */}
                <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border-2 border-amber-500 dark:border-amber-600 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                      {currentLang === 'kn' ? '೨. ವಿಜಯ ಮುಹೂರ್ತ' : currentLang === 'hi' ? '२. विजय मुहूर्त' : '2. Vijaya Muhurta'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-sans">
                      Peak Vijay
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                    {day.vijayaMuhurta?.start || '02:00 PM'} - {day.vijayaMuhurta?.end || '02:46 PM'}
                  </div>
                  <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                    {currentLang === 'kn' ? 'ದಶಮಿ ಮುಕ್ತಾಯದ ಮುನ್ನ ವಿಜಯ ಕಾಲದಲ್ಲಿ ವಿಸರ್ಜಿಸಿ ಶಮೀ ಪೂಜೆ ಮಾಡುವುದು.' : 'Auspicious afternoon victory window before Dashami concludes.'}
                  </p>
                </div>

                {/* 3. Dashami Tithi Deadline Window */}
                <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-850 border border-rose-300 dark:border-rose-800 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                      {currentLang === 'kn' ? 'ದಶಮಿ ಮುಕ್ತಾಯ ಕಾಲ' : currentLang === 'hi' ? 'दशमी समाप्ति काल' : 'Dashami Tithi Limit'}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-sans">
                      Tithi Limit
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                    {day.tithiTiming ? day.tithiTiming.endTimeFormatted[currentLang] : '02:46 PM'}
                  </div>
                  <p className="text-[10.5px] font-sans text-stone-600 dark:text-stone-400 leading-tight">
                    {currentLang === 'kn' ? 'ಧರ್ಮಶಾಸ್ತ್ರದಂತೆ ದಶಮಿ ತಿಥಿ ಇರುವಾಗಲೇ ಕಲಶ ವಿಸರ್ಜನೆ ಪೂರ್ಣಗೊಳಿಸಬೇಕು.' : 'Scriptures prescribe completing Kalasa Visarjan within Dashami.'}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Visarjana & Theertha Prokshane Guide */}
              <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-emerald-300 dark:border-stone-700 space-y-2 text-xs">
                <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 uppercase text-[11px]">
                  <span>✨</span>
                  <span>{currentLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನೆಯ ೫ ಹಂತದ ಶಾಸ್ತ್ರೋಕ್ತ ಕ್ರಮ (Step-by-Step Method):' : 'Kalasha Visarjana 5-Step Sacred Method:'}</span>
                </span>
                
                <div className="space-y-1.5 text-[11.5px] text-stone-700 dark:text-stone-300 leading-relaxed">
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300">೧. ಮಹಾಮಂಗಳಾರತಿ: </strong>
                    <span>{currentLang === 'kn' ? 'ಕಲಶದಲ್ಲಿ ನೆಲೆಸಿರುವ ಜಗನ್ಮಾತೆಗೆ ಕರ್ಪೂರಾರತಿ ಬೆಳಗಿ, ನೈವೇದ್ಯ ಹಾಗೂ ಪ್ರಾರ್ಥನೆ ಸಲ್ಲಿಸಿ.' : 'Perform final Mahamangalarati to Mother Durga in the Kalasa.'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300">೨. ವಿಸರ್ಜನಾ ಮಂತ್ರ: </strong>
                    <span>{currentLang === 'kn' ? 'ಭಕ್ತಿಯಿಂದ ಕೈಮುಗಿದು "ಉತ್ತಿಷ್ಠ ದೇವಿ ಗಚ್ಛ ತ್ವಂ ಪುನರಾಗಮನಾಯ ಚ..." ಅಥವಾ "ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ..." ಶ್ಲೋಕವನ್ನು ಪಠಿಸಿ.' : 'Chant the sacred Udwasana mantra inviting the Goddess to return again next year.'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300">೩. ಉತ್ತರಾಭಿಮುಖ ಚಲನೆ: </strong>
                    <span>{currentLang === 'kn' ? 'ಕಲಶದ ಪಾತ್ರೆಯನ್ನು ಗೌರವದಿಂದ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಚಲಿಸಿ (ಉದ್ವಾಸನೆ).' : 'Gently nudge and move the Kalasa vessel northward to mark the conclusion of the 10-day stay.'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300">೪. ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ: </strong>
                    <span>{currentLang === 'kn' ? 'ಮಾವಿನ ಎಲೆ ಅಥವಾ ದರ್ಭೆಯಿಂದ ಕಲಶದ ಪವಿತ್ರ ಗಂಗಾಜಲ ತೀರ್ಥವನ್ನು ಮನೆಯ ಎಲ್ಲಾ ಕೊಠಡಿಗಳಲ್ಲಿ, ಹೊಸ್ತಿಲಿನಲ್ಲಿ ಪ್ರೋಕ್ಷಣೆ ಮಾಡಿ (ಸಕಲ ದೃಷ್ಟಿದೋಷ ನಿವಾರಣೆ & ಸಮೃದ್ಧಿ).' : 'Sprinkle the consecrated Kalasa theertha with mango leaves across all rooms of the house for protection and prosperity.'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-900 dark:text-emerald-300">೫. ಕಳಸದ ನಾರಿಕೇಳ (ತೆಂಗಿನಕಾಯಿ): </strong>
                    <span>{currentLang === 'kn' ? 'ಕಲಶದ ತೆಂಗಿನಕಾಯಿಯನ್ನು ಒಡೆದು ಸಿಹಿ ಪಾಯಸ ಅಥವಾ ಪ್ರಸಾದ ತಯಾರಿಸಿ ಇಡೀ ಕುಟುಂಬದವರು ಸ್ವೀಕರಿಸಿ.' : 'Break the consecrated Kalasa coconut to prepare sweet payasam prasad for the entire household.'}</span>
                  </div>
                </div>

                {/* Visarjana Shloka */}
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 text-center space-y-0.5 mt-2">
                  <p className="font-serif font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                    {currentLang === 'kn'
                      ? '"ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ | ಯತ್ಪೂಜಿತಂ ಮಯಾ ದೇವಿ ಪರಿಪೂರ್ಣಂ ತದಸ್ತು ಮೇ ||"'
                      : '"गच्छ गच्छ परं स्थानं स्वस्थानं परमेश्वरि । यत्पूजितं मया देवि परिपूर्णं तदस्तु मे ॥"'}
                  </p>
                  <p className="font-mono text-[10px] text-stone-500">
                    Gachha Gachha Param Sthanam Swasthanam Parameshwari | Yatpoojitam Maya Devi Paripoornam Tadastu Me ||
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Festivals on this day if any */}
          {day.festivals.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-orange-500/10 border border-amber-300 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>
                  {currentLang === 'kn' ? 'ಈ ದಿನದ ವಿಶೇಷ ಹಬ್ಬಗಳು / ಆಚರಣೆಗಳು:' : currentLang === 'hi' ? 'आज के विशेष पर्व:' : 'Festivals Today:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.festivals.map(fest => (
                  <button
                    key={fest.id}
                    onClick={(e) => openPopupBelow(e, 'festival', fest.name[currentLang], fest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${fest.badgeBg}`}
                  >
                    <span>{fest.name[currentLang]}</span>
                    <span className="text-[10px] underline">
                      {currentLang === 'kn' ? '(ವಿವರ ನೋಡಿ)' : currentLang === 'hi' ? '(विवरण देखें)' : '(View Details)'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Special Navaratri Day Color Highlight */}
              {day.festivals.find(f => f.isNavaratri && f.navaratriColor) && (() => {
                const navFest = day.festivals.find(f => f.isNavaratri && f.navaratriColor)!;
                const navCol = navFest.navaratriColor!;
                return (
                  <div 
                    onClick={() => onSelectFestival(navFest)}
                    className="p-3 rounded-xl border border-amber-300/80 dark:border-stone-700 bg-white/90 dark:bg-stone-800/90 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm shrink-0" 
                        style={{ backgroundColor: navCol.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>{currentLang === 'kn' ? 'ನವರಾತ್ರಿ ದಿನದ ಬಣ್ಣ:' : currentLang === 'hi' ? 'नवरात्रि का आज का रंग:' : 'Navaratri Color Today:'}</span>
                          <span className="text-amber-700 dark:text-amber-400 font-extrabold">{navCol.colorName[currentLang]}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {navCol.significance[currentLang]}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500 text-white shrink-0">
                      {currentLang === 'kn' ? 'ಬಣ್ಣದ ವಿವರ →' : 'Color Details →'}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
          </div>

          {/* Sun Times & Dina Mana (Ahoratra Calculation) */}
          <div id="sun-dinamana-section" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1">
                <Sun className="w-4 h-4" />
                <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ (Suryodaya)' : currentLang === 'hi' ? 'सूर्योदय' : 'Sunrise'}</span>
              </div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                {day.sunrise}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                {currentLang === 'kn' ? 'ಮುಂದಿನ ದಿನದ ಸೂರ್ಯೋದಯ:' : currentLang === 'hi' ? 'अगला सूर्योदय:' : 'Next Sunrise:'} {day.nextDaySunrise}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-bold text-xs mb-1">
                <Moon className="w-4 h-4" />
                <span>{currentLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ (Suryasta)' : currentLang === 'hi' ? 'सूर्यास्त' : 'Sunset'}</span>
              </div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                {day.sunset}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                {currentLang === 'kn' ? 'ಸಾಯಂಕಾಲ ಸಂಧ್ಯಾ ಕಾಲ' : currentLang === 'hi' ? 'सायं सन्ध्या काल' : 'Evening Sandhya'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold text-xs mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ದಿನಮಾನ (Dina Mana)' : currentLang === 'hi' ? 'दिनमान' : 'Day Length'}</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {Math.floor(day.dinaManaMinutes / 60)} hrs {day.dinaManaMinutes % 60} mins
              </div>
              <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mt-1 font-semibold">
                {day.dinaManaGhatis}
              </div>
            </div>
          </div>

          {/* Complete Panchanga 5 Limbs Breakdown */}
          <div id="panchanga-limbs-section" className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider border-b border-stone-200 dark:border-stone-700 pb-2">
              {currentLang === 'kn' ? 'ಪಂಚಾಂಗದ ಪಂಚಾಂಗ ವಿವರಗಳು' : currentLang === 'hi' ? 'पंचांग के पांच अंग' : 'The Five Limbs of Panchanga'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ತಿಥಿ (Tithi):' : currentLang === 'hi' ? 'तिथि:' : 'Tithi:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {day.tithiName[currentLang]} ({formatJustNumber(day.tithiNumber, currentLang)})
                  </span>
                  <MoonPhaseIcon
                    paksha={day.paksha}
                    tithiNumber={day.tithiNumber}
                    size={16}
                    currentLang={currentLang}
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">Sanskrit: {day.tithiSanskrit}</span>
                {day.tithiTiming && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-mono font-medium mt-0.5">
                    {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ:' : currentLang === 'hi' ? 'समाप्ति:' : 'Ends:'} {day.tithiTiming.endTimeFormatted[currentLang]}
                  </span>
                )}
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ವಾರ (Vara):' : currentLang === 'hi' ? 'वार:' : 'Vara:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {day.vara[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ (Nakshatra):' : currentLang === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {day.nakshatra[currentLang]}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-medium">
                  ಅಕ್ಷರ: {day.charanaLetter}
                </span>
              </div>

              {/* GREEN RECTANGLE: NAKSHATRA PADA EXACT ENTRY & EXIT & TOTAL STAY MINUTES */}
              {day.padaTiming && (
                <div className="col-span-full p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/20 border-2 border-emerald-500 dark:border-emerald-700 space-y-2 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-300 dark:border-emerald-800 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-emerald-600 text-white text-xs font-bold">🟢</span>
                      <span className="font-serif font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                        {currentLang === 'kn' 
                          ? `ನಕ್ಷತ್ರ ಪಾದ ಕಾಲಾವಧಿ (${day.nakshatra[currentLang]} - ಪಾದ ${day.pada})` 
                          : currentLang === 'hi' 
                          ? `नक्षत्र चरण समय विस्तार (${day.nakshatra[currentLang]} - चरण ${day.pada})` 
                          : `Nakshatra Pada Exact Window (${day.nakshatra[currentLang]} - Pada ${day.pada})`}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      ⏱️ {currentLang === 'kn' 
                        ? `ಒಟ್ಟು ಅವಧಿ: ${day.padaTiming.durationMinutes} ನಿಮಿಷಗಳು (${day.padaTiming.durationFormatted[currentLang]})` 
                        : currentLang === 'hi' 
                        ? `कुल अवधि: ${day.padaTiming.durationMinutes} मिनट (${day.padaTiming.durationFormatted[currentLang]})` 
                        : `Total Duration: ${day.padaTiming.durationMinutes} Minutes (${day.padaTiming.durationFormatted[currentLang]})`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800 space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                        {currentLang === 'kn' ? '🟢 ಪಾದ ಆರಂಭ ದಿನಾಂಕ & ಸಮಯ (Entry):' : currentLang === 'hi' ? '🟢 चरण प्रारम्भ दिनांक व समय:' : '🟢 Pada Starts Date & Time:'}
                      </span>
                      <div className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                        {day.padaTiming.startDateFormatted[currentLang]}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800 space-y-0.5">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                        {currentLang === 'kn' ? '🔴 ಪಾದ ಮುಕ್ತಾಯ ದಿನಾಂಕ & ಸಮಯ (Exit):' : currentLang === 'hi' ? '🔴 चरण समाप्ति दिनांक व समय:' : '🔴 Pada Ends Date & Time:'}
                      </span>
                      <div className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                        {day.padaTiming.endDateFormatted[currentLang]}
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar on Pada Box */}
                  <div className="p-2 rounded-lg bg-white/95 dark:bg-stone-850 border border-emerald-300 dark:border-emerald-800 space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                        <span>{padaProgress.percent}% {currentLang === 'kn' ? 'ಪಾದದ ಕಾಲಾವಧಿ ಸಂದಿದೆ' : 'Pada Duration Elapsed'}</span>
                      </span>
                      <span className="text-stone-600 dark:text-stone-300">
                        ⏱️ {padaProgress.elapsedText} • {padaProgress.remainingText}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 dark:bg-stone-750 rounded-full overflow-hidden relative shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full transition-all duration-500 relative"
                        style={{ width: `${Math.max(4, padaProgress.percent)}%` }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-xs rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10.5px] text-emerald-800 dark:text-emerald-300 font-medium flex flex-wrap items-center justify-between gap-1">
                    <span>
                      {currentLang === 'kn' ? `ನಾಮಾಕ್ಷರ / ಚರಣ ಅಕ್ಷರ: ${day.charanaLetter}` : currentLang === 'hi' ? `नामाक्षर / चरण अक्षर: ${day.charanaLetter}` : `Namakshara / Charana Syllables: ${day.charanaLetter}`}
                    </span>
                    <span className="font-bold">
                      {currentLang === 'kn' 
                        ? `(ಈ ಪಾದವು ಒಟ್ಟು ${day.padaTiming.durationMinutes} ನಿಮಿಷ ಇರುತ್ತದೆ)` 
                        : `(This Pada remains for a total of ${day.padaTiming.durationMinutes} minutes)`}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಯೋಗ (Yoga):' : currentLang === 'hi' ? 'योग:' : 'Yoga:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.yoga[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಕರಣ (Karana):' : currentLang === 'hi' ? 'करण:' : 'Karana:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.karana[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ (Moon Sign):' : currentLang === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.chandraRashi[currentLang]} ({day.chandraRashiLord[currentLang]})
                </span>
              </div>
            </div>
          </div>

          {/* NEW FEATURE: Standardized Daily Rituals & Pooja Items (Applicable Every Day) */}
          <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-stone-850 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-amber-300/80 dark:border-stone-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                  <Sunrise className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? 'ದೈನಂದಿನ ನಿತ್ಯ ಪೂಜಾ ವಿಧಿ ಮತ್ತು ಸಾಮಗ್ರಿಗಳು' : currentLang === 'hi' ? 'दैनिक नित्य पूजा विधि एवं सामग्री' : 'Daily Rituals & Pooja Requirements'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold uppercase">
                      Universal Guide
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn'
                      ? 'ವರ್ಷದ ಯಾವುದೇ ದಿನ ಪಾಲಿಸಬಹುದಾದ ಪ್ರಮಾಣಿತ ಪೂಜಾ ಪರಿಕರಗಳ ಪಟ್ಟಿ ಮತ್ತು ಮುಂಜಾನೆಯ ಹಂತ-ಹಂತದ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿ.'
                      : currentLang === 'hi'
                      ? 'वर्ष के प्रत्येक दिवस हेतु मानक पूजा सामग्री सूची एवं प्रातःकालीन नित्य पूजा की क्रमिक मार्गदर्शिका।'
                      : 'Standardized daily pooja essentials checklist and step-by-step generic morning ritual guide for any day of the year.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDailyRituals(!showDailyRituals)}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 underline hover:no-underline"
              >
                {showDailyRituals ? (currentLang === 'kn' ? 'ಮರೆಮಾಡು' : 'Hide') : (currentLang === 'kn' ? 'ತೋರಿಸು' : 'Show')}
              </button>
            </div>

            {showDailyRituals && (
              <div className="space-y-5 text-xs">
                {/* 1. Daily Pooja Requirements Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wide text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentLang === 'kn' ? 'ನಿತ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ (Checklist):' : currentLang === 'hi' ? 'नित्य पूजा सामग्री सूची:' : 'Daily Pooja Items (Samagri):'}</span>
                    </span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold font-mono">
                      {Object.values(checkedDailyItems).filter(Boolean).length} / {dailyPoojaItems.length} Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dailyPoojaItems.map((item, idx) => {
                      const isDone = !!checkedDailyItems[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleDailyItem(idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                            isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                              : 'bg-white dark:bg-stone-800/70 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
                            {isDone ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                          </span>
                          <span className={`leading-relaxed text-xs ${isDone ? 'line-through opacity-80' : 'font-medium'}`}>
                            {item[currentLang]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Step-by-Step Generic Morning Ritual Guide */}
                <div className="space-y-3 pt-2 border-t border-amber-200/80 dark:border-stone-700">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wide text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಮುಂಜಾನೆಯ ನಿತ್ಯ ಪೂಜಾ ಕ್ರಮ (Step-by-Step Morning Guide):' : currentLang === 'hi' ? 'प्रातःकालीन नित्य पूजन क्रम:' : 'Chronological Morning Ritual Procedure:'}</span>
                  </span>

                  <div className="space-y-2.5">
                    {genericMorningRituals.map((r) => (
                      <div
                        key={r.step}
                        className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3 shadow-2xs"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {r.step}
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold font-serif text-stone-900 dark:text-stone-100 text-xs text-amber-900 dark:text-amber-300">
                            {r.title[currentLang]}
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                            {r.desc[currentLang]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Custom Events & Scheduling for this day */}
          <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ನನ್ನ ವೈಯಕ್ತಿಕ ಪೂಜೆ / ಕಾರ್ಯಕ್ರಮಗಳು' : currentLang === 'hi' ? 'व्यक्तिगत पूजन एवं अनुष्ठान' : 'Custom Scheduled Events'}
                </span>
              </h4>

              <button
                type="button"
                onClick={(e) => openPopupBelow(e, 'eventForm', currentLang === 'kn' ? 'ಹೊಸ ಪೂಜೆ / ಕಾರ್ಯಕ್ರಮ ಸೇರಿಸಿ' : 'Add Custom Scheduled Event')}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold transition-colors flex items-center gap-1 cursor-pointer border border-amber-400/40 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಕಾರ್ಯಕ್ರಮ ಸೇರಿಸಿ' : 'Add Event'}</span>
              </button>
            </div>

            {/* Event Form (Inline fallback or when showEventForm is active) */}
            {showEventForm && (
              <form onSubmit={handleSaveEvent} className="p-3.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/60 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Event Title (e.g. Satyanarayana Puja, Shraddha, Vrat)"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                  />

                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500 cursor-pointer"
                  >
                    <option value="pooja">Pooja / Seva (ಪೂಜೆ)</option>
                    <option value="vrat">Vrata / Upavasa (ವ್ರತ)</option>
                    <option value="shraddha">Shraddha / Tarpan (ಶ್ರಾದ್ಧ)</option>
                    <option value="auspicious">Auspicious Muhurtha (ಶುಭ ಕಾರ್ಯ)</option>
                    <option value="personal">Personal Note (ಟಿಪ್ಪಣಿ)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Notes or mantras (optional)"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-3 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            )}

            {/* List of Custom Events */}
            {dayEvents.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-1">
                No custom personal events scheduled for this day yet.
              </p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{evt.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {evt.category}
                        </span>
                      </div>
                      {evt.description && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 pl-4">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            {currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : currentLang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE POP-UP WINDOWS POSITIONED DIRECTLY BELOW TRIGGER BUTTONS */}
      {/* USES FIXED COORDINATE OFFSETS & FULL-WIDTH RESPONSIVE CSS ON MOBILE */}
      {/* ========================================================================= */}
      {activePopup && (
        <>
          {/* Click-away backdrop */}
          <div 
            className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-[1px] animate-in fade-in duration-100"
            onClick={closePopup}
          />

          {/* Pop-up Window */}
          <div 
            className="fixed z-[60] bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-600 rounded-2xl shadow-2xl p-4 sm:p-5 overflow-y-auto max-h-[82vh] transition-all animate-in fade-in zoom-in-95 duration-150 text-stone-900 dark:text-stone-100 flex flex-col w-[calc(100vw-24px)] sm:w-[420px] max-w-[calc(100vw-24px)]"
            style={{
              top: `${Math.min(typeof window !== 'undefined' ? window.innerHeight - 300 : 400, Math.max(16, activePopup.top))}px`,
              left: `${activePopup.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm">
                  {activePopup.type === 'eventForm' ? '📝' : activePopup.type === 'padaDetail' ? '☸️' : activePopup.type === 'festival' ? '🌺' : activePopup.type === 'referenceMode' ? '⚡' : '🌟'}
                </span>
                <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-tight">
                  {activePopup.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Body */}
            <div className="pt-3 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {/* 1. Custom Event Form Pop-up */}
              {activePopup.type === 'eventForm' && (
                <form onSubmit={handleSaveEvent} className="space-y-3">
                  <p className="text-[11.5px] text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn'
                      ? 'ಈ ದಿನಾಂಕಕ್ಕೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪೂಜೆ, ವ್ರತ, ಶ್ರಾದ್ಧ ಅಥವಾ ಶುಭ ಕಾರ್ಯಕ್ರಮವನ್ನು ಸೇರಿಸಿ:'
                      : 'Schedule your personal puja, vrata, shraddha, or auspicious event for this day:'}
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Event Title (e.g. Satyanarayana Puja, Shraddha, Vrat)"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      autoFocus
                    />

                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-medium"
                    >
                      <option value="pooja">Pooja / Seva (ಪೂಜೆ)</option>
                      <option value="vrat">Vrata / Upavasa (ವ್ರತ)</option>
                      <option value="shraddha">Shraddha / Tarpan (ಶ್ರಾದ್ಧ)</option>
                      <option value="auspicious">Auspicious Muhurtha (ಶುಭ ಕಾರ್ಯ)</option>
                      <option value="personal">Personal Note (ಟಿಪ್ಪಣಿ)</option>
                    </select>

                    <textarea
                      rows={2}
                      placeholder="Notes, sankalpa details, or mantras (optional)"
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={closePopup}
                      className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ಸೇವ್ ಮಾಡಿ' : 'Save Event'}
                    </button>
                  </div>
                </form>
              )}

              {/* 2. Pada Details Pop-up */}
              {activePopup.type === 'padaDetail' && activePopup.data && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-stone-800 border border-emerald-400/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                        {currentLang === 'kn' ? `ನಕ್ಷತ್ರ: ${day.nakshatra[currentLang]}` : `Nakshatra: ${day.nakshatra[currentLang]}`}
                      </span>
                      <span className="font-serif font-black px-2 py-0.5 rounded bg-emerald-600 text-white text-xs">
                        {currentLang === 'kn' ? `ಪಾದ ${activePopup.data.padaNumber}` : `Pada ${activePopup.data.padaNumber}`}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-mono text-stone-800 dark:text-stone-200 space-y-1">
                      <div>
                        <strong>{currentLang === 'kn' ? 'ನಾಮಾಕ್ಷರ / ಚರಣ ಅಕ್ಷರ: ' : 'Namakshara: '}</strong>
                        <span className="font-serif font-black text-amber-700 dark:text-amber-400 text-sm">
                          {activePopup.data.syllable}
                        </span>
                      </div>
                      <div>
                        <strong>{currentLang === 'kn' ? 'ಒಟ್ಟು ಕಾಲಾವಧಿ: ' : 'Total Duration: '}</strong>
                        <span>{activePopup.data.durationFormattedText} ({activePopup.data.totalMinutes} {currentLang === 'kn' ? 'ನಿಮಿಷ' : 'mins'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11.5px] font-mono bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                        🟢 {currentLang === 'kn' ? 'ಆರಂಭ (Pravesha):' : 'Starts:'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {activePopup.data.startDateFormatted[currentLang]}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                        🔴 {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ (Samapti):' : 'Ends:'}
                      </span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {activePopup.data.endDateFormatted[currentLang]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-stone-700 dark:text-stone-300">
                        {activePopup.data.percent}% {currentLang === 'kn' ? 'ಕಾಲ ಸಂದಿದೆ' : 'elapsed'}
                      </span>
                      <span className="text-stone-500">
                        {activePopup.data.isCurrentActive ? activePopup.data.remainingText : activePopup.data.status === 'completed' ? '100%' : '0%'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                        style={{ width: `${activePopup.data.percent}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed bg-amber-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-amber-300/40">
                    💡 {currentLang === 'kn'
                      ? `ಈ ಪಾದದಲ್ಲಿ ಜನಿಸಿದ ಶಿಶುವಿಗೆ "${activePopup.data.syllable}" ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗುವ ಹೆಸರನ್ನು ನಾಮಕರಣ ಮಾಡುವುದು ಶಾಸ್ತ್ರೋಕ್ತ ಮತ್ತು ಶುಭದಾಯಕ.`
                      : `A child born during this Pada is traditionally named with syllables starting with "${activePopup.data.syllable}".`}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={closePopup}
                      className="px-4 py-1.5 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ಸರಿ' : 'Done'}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Festival Detail Pop-up */}
              {activePopup.type === 'festival' && activePopup.data && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${activePopup.data.badgeBg || ''}`}>
                      {activePopup.data.name[currentLang]}
                    </span>
                  </div>

                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {activePopup.data.description[currentLang]}
                  </p>

                  {activePopup.data.tradition && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-[11px] block uppercase">
                        {currentLang === 'kn' ? 'ಆಚರಣೆ & ಪರಂಪರೆ:' : 'Tradition & Rituals:'}
                      </span>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {activePopup.data.tradition[currentLang]}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFestival(activePopup.data);
                        closePopup();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>📖</span>
                      <span>{currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ಹಬ್ಬದ ಗವಾಕ್ಷಿ' : 'View Full Details'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={closePopup}
                      className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Reference Mode Pop-up */}
              {activePopup.type === 'referenceMode' && (
                <div className="space-y-3">
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರ ಪಾದಗಳ ಶೇಕಡಾವಾರು ಪ್ರಗತಿಯನ್ನು ಯಾವ ಕ್ಷಣಕ್ಕೆ ಆಧರಿಸಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಬೇಕು ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ:'
                      : 'Choose the reference time against which Tithi and Nakshatra Pada elapsed progress is calculated:'}
                  </p>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => { setReferenceMode('live'); closePopup(); }}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between cursor-pointer ${
                        referenceMode === 'live'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>⚡ {isToday ? (currentLang === 'kn' ? 'ಲೈವ್ (ನೈಜ ಸಮಯ)' : 'Live Real-Time') : (currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ (೧೨:೦೦ PM)' : 'Midday (12:00 PM)')}</span>
                      {referenceMode === 'live' && <span>✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setReferenceMode('sunrise'); closePopup(); }}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between cursor-pointer ${
                        referenceMode === 'sunrise'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>🌅 {currentLang === 'kn' ? `ಸೂರ್ಯೋದಯ ಕಾಲ (${day.sunrise})` : `Sunrise Moment (${day.sunrise})`}</span>
                      {referenceMode === 'sunrise' && <span>✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setReferenceMode('sunset'); closePopup(); }}
                      className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between cursor-pointer ${
                        referenceMode === 'sunset'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-200 font-bold'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>🌇 {currentLang === 'kn' ? `ಸೂರ್ಯಾಸ್ತ ಕಾಲ (${day.sunset})` : `Sunset Moment (${day.sunset})`}</span>
                      {referenceMode === 'sunset' && <span>✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {showLocalRitualsModal && (
        <NavaratriRitualsModal
          isOpen={showLocalRitualsModal}
          onClose={() => setShowLocalRitualsModal(false)}
          currentLang={currentLang}
          selectedYear={day.year}
          currentDay={day}
          initialTab={localRitualsTab}
          initialDayNumber={parseInt((day.festivals.find(f => f.isNavaratri || f.id.startsWith('navaratri_day'))?.id || 'navaratri_day1').replace('navaratri_day', ''), 10) || 1}
        />
      )}
    </div>
  );
};
