import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  ChevronRight,
  MapPin,
  Flame,
  Award
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { getPanchangaForDate, getLocalizedPlaceName, toIndicNumeral } from '../utils/panchanga';
import { MoonPhaseIcon } from './MoonPhaseIcon';

interface DashboardWidgetProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onOpenDayDetail?: (day: PanchangaDay) => void;
  onOpenKundali?: () => void;
  onOpenMantras?: () => void;
  onOpenSankalpa?: () => void;
  className?: string;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  currentLang,
  selectedCity,
  onOpenDayDetail,
  onOpenKundali,
  onOpenMantras,
  className = ''
}) => {
  // Live dynamic clock updating every second
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live Panchanga for the current minute and city
  const todayPanchanga: PanchangaDay = useMemo(() => {
    return getPanchangaForDate(currentTime, selectedCity);
  }, [currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), selectedCity]);

  // Format current live time string
  const timeString = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const standardStr = `${pad(formattedHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    return {
      standard: standardStr,
      indic: toIndicNumeral(standardStr, currentLang)
    };
  }, [currentTime, currentLang]);

  // Current minute of day for active Muhurta checking
  const currentMinuteOfDay = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Helper to parse "HH:MM AM/PM" to minutes from midnight
  const parseTimeStringToMinutes = (timeStr: string): number => {
    if (!timeStr) return -1;
    const parts = timeStr.trim().split(/[:\s]/);
    if (parts.length < 2) return -1;
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const ampm = parts[2] ? parts[2].toUpperCase() : '';
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  // Active Muhurta Status Checks
  const rahuStartMin = parseTimeStringToMinutes(todayPanchanga.rahuKaal.start);
  const rahuEndMin = parseTimeStringToMinutes(todayPanchanga.rahuKaal.end);
  const isRahuKaalActive = currentMinuteOfDay >= rahuStartMin && currentMinuteOfDay <= rahuEndMin;

  const abhijitStartMin = parseTimeStringToMinutes(todayPanchanga.abhijitMuhurta.start);
  const abhijitEndMin = parseTimeStringToMinutes(todayPanchanga.abhijitMuhurta.end);
  const isAbhijitActive = currentMinuteOfDay >= abhijitStartMin && currentMinuteOfDay <= abhijitEndMin;

  const amritStartMin = todayPanchanga.amritKaal ? parseTimeStringToMinutes(todayPanchanga.amritKaal.start) : -1;
  const amritEndMin = todayPanchanga.amritKaal ? parseTimeStringToMinutes(todayPanchanga.amritKaal.end) : -1;
  const isAmritKaalActive = amritStartMin !== -1 && currentMinuteOfDay >= amritStartMin && currentMinuteOfDay <= amritEndMin;

  // Auspiciousness of current Yoga
  const INAUSPICIOUS_YOGAS = [
    'Vishkambha', 'Atiganda', 'Shoola', 'Ganda', 'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti'
  ];
  // Real-time elapsed progress calculations
  const nowMs = currentTime.getTime();

  const tithiProgress = useMemo(() => {
    if (!todayPanchanga.tithiTiming?.startDateTime || !todayPanchanga.tithiTiming?.endDateTime) {
      return { percent: 50, remainingText: '', elapsedText: '' };
    }
    const start = new Date(todayPanchanga.tithiTiming.startDateTime).getTime();
    const end = new Date(todayPanchanga.tithiTiming.endDateTime).getTime();
    const total = Math.max(1, end - start);
    const elapsed = Math.min(Math.max(0, nowMs - start), total);
    const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    const remMins = Math.max(0, Math.round((end - nowMs) / 60000));
    const elapMins = Math.max(0, Math.round(elapsed / 60000));
    const remHrs = Math.floor(remMins / 60);
    const remRMins = remMins % 60;
    const elapHrs = Math.floor(elapMins / 60);
    const elapRMins = elapMins % 60;

    return {
      percent,
      remainingText: currentLang === 'kn' ? `${remHrs}ಗಂ ${remRMins}ನಿಮಿಷ ಬಾಕಿ` : `${remHrs}h ${remRMins}m left`,
      elapsedText: currentLang === 'kn' ? `${elapHrs}ಗಂ ${elapRMins}ನಿಮಿಷ ಸಂದಿದೆ` : `${elapHrs}h ${elapRMins}m elapsed`
    };
  }, [todayPanchanga.tithiTiming, nowMs, currentLang]);

  const padaProgress = useMemo(() => {
    if (!todayPanchanga.padaTiming?.startDateTime || !todayPanchanga.padaTiming?.endDateTime) {
      return { percent: 50, remainingText: '', elapsedText: '' };
    }
    const start = new Date(todayPanchanga.padaTiming.startDateTime).getTime();
    const end = new Date(todayPanchanga.padaTiming.endDateTime).getTime();
    const total = Math.max(1, end - start);
    const elapsed = Math.min(Math.max(0, nowMs - start), total);
    const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
    const remMins = Math.max(0, Math.round((end - nowMs) / 60000));
    const elapMins = Math.max(0, Math.round(elapsed / 60000));
    const remHrs = Math.floor(remMins / 60);
    const remRMins = remMins % 60;

    return {
      percent,
      remainingText: currentLang === 'kn' ? `${remMins} ನಿಮಿಷ ಬಾಕಿ (${remHrs}ಗಂ ${remRMins}ನಿ)` : `${remMins}m left (${remHrs}h ${remRMins}m)`,
      elapsedText: currentLang === 'kn' ? `${elapMins} ನಿಮಿಷ ಸಂದಿದೆ` : `${elapMins}m elapsed`
    };
  }, [todayPanchanga.padaTiming, nowMs, currentLang]);

  const isYogaAuspicious = useMemo(() => {
    const inauspiciousYogas = ['Vishkambha', 'Atiganda', 'Shula', 'Ganda', 'Vyaghata', 'Vajra', 'Vyatipata', 'Parigha', 'Vaidhriti'];
    const engYoga = todayPanchanga.yoga.en || '';
    return !inauspiciousYogas.some(y => engYoga.toLowerCase().includes(y.toLowerCase()));
  }, [todayPanchanga.yoga]);

  // Localized Labels
  const labels = {
    liveTitle: currentLang === 'kn' ? 'ಇಂದಿನ ದೈನಂದಿನ ಪಂಚಾಂಗ ದಿಕ್ಸೂಚಿ' : currentLang === 'hi' ? 'आज का दैनिक पंचांग सूचक' : "Today's Live Panchanga Dashboard",
    liveSubtitle: currentLang === 'kn' ? 'ನಿಜ-ಸಮಯದ ತಿಥಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಯೋಗ' : currentLang === 'hi' ? 'वास्तविक समय तिथि, नक्षत्र एवं योग' : 'Real-time Tithi, Nakshatra & Yoga Status',
    tithiTitle: currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ತಿಥಿ' : currentLang === 'hi' ? 'वर्तमान तिथि' : 'Current Tithi',
    nakshatraTitle: currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ಹಾಗೂ ಪಾದ' : currentLang === 'hi' ? 'नक्षत्र एवं चरण' : 'Nakshatra & Pada',
    yogaTitle: currentLang === 'kn' ? 'ದೈನಿಕ ಯೋಗ ಮತ್ತು ಕರಣ' : currentLang === 'hi' ? 'दैनिक योग एवं करण' : 'Yoga & Karana',
    muhurtaTitle: currentLang === 'kn' ? 'ಸದ್ಯದ ಮುಹೂರ್ತ ಸ್ಥಿತಿ' : currentLang === 'hi' ? 'वर्तमान मुहूर्त स्थिति' : 'Live Muhurta Status',
    viewDetails: currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ವಿವರ' : currentLang === 'hi' ? 'विस्तृत पंचांग देखें' : 'View Full Day Details',
    openKundali: currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ವೀಕ್ಷಿಸಿ' : currentLang === 'hi' ? 'लग्न कुण्डली देखें' : 'View Lagna Kundali',
    shukla: currentLang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳು)' : currentLang === 'hi' ? 'शुक्ल पक्ष' : 'Shukla Paksha (Waxing)',
    krishna: currentLang === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ' : currentLang === 'hi' ? 'कृष्ण पक्ष' : 'Krishna Paksha (Waning)',
    auspicious: currentLang === 'kn' ? 'ಶುಭ ಯೋಗ' : currentLang === 'hi' ? 'शुभ योग' : 'Auspicious Yoga',
    inauspicious: currentLang === 'kn' ? 'ವರ್ಜ್ಯ / ಅಶುಭ ಯೋಗ' : currentLang === 'hi' ? 'अशुभ योग' : 'Inauspicious Yoga',
  };

  return (
    <div className={`rounded-2xl border border-amber-300/80 dark:border-stone-700 bg-gradient-to-b from-amber-500/10 via-white to-amber-50/20 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 shadow-md p-4 sm:p-5 space-y-4 ${className}`}>
      
      {/* Top Header Bar with Live Clock and Location */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="font-serif font-bold text-base sm:text-lg text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <span>{labels.liveTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-sans font-semibold">
                LIVE
              </span>
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 flex items-center gap-2">
            <span>{labels.liveSubtitle}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400">
              <MapPin className="w-3 h-3" />
              <span>{getLocalizedPlaceName(selectedCity, currentLang)}</span>
            </span>
          </p>
        </div>

        {/* Live Clock Display */}
        <div className="flex items-center gap-2.5 bg-white/80 dark:bg-stone-800/80 px-3.5 py-1.5 rounded-xl border border-amber-200 dark:border-stone-700 shadow-2xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex flex-col text-right">
            <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100 tracking-wider">
              {timeString.standard}
            </span>
            {currentLang !== 'en' && (
              <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 -mt-0.5">
                {timeString.indic}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main 3-Card Grid for Tithi, Nakshatra, and Yoga */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* CARD 1: Current Tithi */}
        <div className="p-4 rounded-xl border border-amber-200/90 dark:border-stone-750 bg-white/90 dark:bg-stone-800/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-amber-500/5 group-hover:scale-125 transition-transform pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-600" />
                <span>{labels.tithiTitle}</span>
              </span>

              {/* CSS-based Moon Phase Icon */}
              <MoonPhaseIcon 
                paksha={todayPanchanga.paksha} 
                tithiNumber={todayPanchanga.tithiNumber} 
                size={22}
                currentLang={currentLang}
              />
            </div>

            <div className="mt-1">
              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                {todayPanchanga.tithiName[currentLang]}
              </h4>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                {todayPanchanga.paksha === 'Shukla' ? labels.shukla : labels.krishna} • {todayPanchanga.tithiNumber}/15
              </p>
            </div>

            {/* Tithi Start & End Timestamps Box with Visual Progress Bar (Requested in Red Rectangle) */}
            {todayPanchanga.tithiTiming && (
              <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 dark:bg-stone-900 border border-amber-300 dark:border-amber-700/70 space-y-1.5 shadow-2xs">
                <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono leading-tight">
                  <div className="text-left bg-white/80 dark:bg-stone-850 p-1.5 rounded-lg border border-amber-200 dark:border-stone-750">
                    <span className="text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>{currentLang === 'kn' ? 'ಆರಂಭ:' : 'Starts:'}</span>
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px] block mt-0.5">
                      {todayPanchanga.tithiTiming.startTimeFormatted[currentLang]}
                    </span>
                  </div>

                  <div className="text-right bg-white/80 dark:bg-stone-850 p-1.5 rounded-lg border border-amber-200 dark:border-stone-750">
                    <span className="text-[9px] font-bold uppercase text-rose-700 dark:text-rose-400 block">
                      {currentLang === 'kn' ? 'ಮುಕ್ತಾಯ:' : 'Ends:'}
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px] block mt-0.5">
                      {todayPanchanga.tithiTiming.endTimeFormatted[currentLang]}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1 px-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {tithiProgress.percent}% {currentLang === 'kn' ? 'ಸಂದಿದೆ' : 'elapsed'}
                    </span>
                    <span className="text-[9.5px]">
                      ⏱️ {tithiProgress.remainingText}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${tithiProgress.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-750 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="text-[11px] font-sans">
              {todayPanchanga.masa[currentLang]} ಮಾಸ / मास
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-stone-700 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
              {todayPanchanga.paksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ'}
            </span>
          </div>
        </div>

        {/* CARD 2: Current Nakshatra & Pada */}
        <div className="p-4 rounded-xl border border-amber-200/90 dark:border-stone-750 bg-white/90 dark:bg-stone-800/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-orange-500/5 group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{labels.nakshatraTitle}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-800 dark:text-orange-300 font-bold text-[10px]">
                {currentLang === 'kn' ? `ಪಾದ ${todayPanchanga.pada}` : currentLang === 'hi' ? `चरण ${todayPanchanga.pada}` : `Pada ${todayPanchanga.pada}`}
              </span>
            </div>

            <div className="mt-1">
              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                {todayPanchanga.nakshatra[currentLang]}
              </h4>
              <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-0.5 flex items-center gap-1.5">
                <span>{currentLang === 'kn' ? 'ರಾಶಿ' : 'Rashi'}: {todayPanchanga.chandraRashi[currentLang]}</span>
                <span>•</span>
                <span>{todayPanchanga.chandraRashiLord[currentLang]}</span>
              </p>
            </div>

            {/* Pada Start & End Timestamps Box with Visual Progress Bar (Requested in Green Rectangle) */}
            {todayPanchanga.padaTiming && (
              <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700/70 space-y-1.5 shadow-2xs">
                <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono leading-tight">
                  <div className="text-left bg-white/80 dark:bg-stone-850 p-1.5 rounded-lg border border-emerald-200 dark:border-stone-750">
                    <span className="text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span>{currentLang === 'kn' ? 'ಪಾದ ಆರಂಭ:' : 'Starts:'}</span>
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px] block mt-0.5">
                      {todayPanchanga.padaTiming.startDateFormatted[currentLang]}
                    </span>
                  </div>

                  <div className="text-right bg-white/80 dark:bg-stone-850 p-1.5 rounded-lg border border-emerald-200 dark:border-stone-750">
                    <span className="text-[9px] font-bold uppercase text-rose-700 dark:text-rose-400 block">
                      {currentLang === 'kn' ? 'ಪಾದ ಮುಕ್ತಾಯ:' : 'Ends:'}
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-[11px] block mt-0.5">
                      {todayPanchanga.padaTiming.endDateFormatted[currentLang]}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1 px-0.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {padaProgress.percent}% {currentLang === 'kn' ? 'ಸಂದಿದೆ' : 'elapsed'}
                    </span>
                    <span className="text-[9.5px]">
                      ⏱️ {padaProgress.remainingText}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${padaProgress.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-750 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="text-[11px]">
              {currentLang === 'kn' ? 'ನಾಮ ಅಕ್ಷರ' : currentLang === 'hi' ? 'नामाक्षर' : 'Name Syllables'}:
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">
              {Array.isArray(todayPanchanga.charanaLetter) ? todayPanchanga.charanaLetter.join(', ') : todayPanchanga.charanaLetter}
            </span>
          </div>
        </div>

        {/* CARD 3: Current Yoga & Karana */}
        <div className="p-4 rounded-xl border border-amber-200/90 dark:border-stone-750 bg-white/90 dark:bg-stone-800/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-emerald-500/5 group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>{labels.yogaTitle}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 ${
                isYogaAuspicious 
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-rose-500/15 text-rose-800 dark:text-rose-300'
              }`}>
                {isYogaAuspicious ? <CheckCircle2 className="w-2.5 h-2.5" /> : <ShieldAlert className="w-2.5 h-2.5" />}
                <span>{isYogaAuspicious ? (currentLang === 'kn' ? 'ಶುಭ' : currentLang === 'hi' ? 'शुभ' : 'Shubha') : (currentLang === 'kn' ? 'ಅಶುಭ' : currentLang === 'hi' ? 'अशुभ' : 'Ashubha')}</span>
              </span>
            </div>

            <div className="mt-1">
              <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 leading-tight">
                {todayPanchanga.yoga[currentLang]}
              </h4>
              <p className="text-xs font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                {currentLang === 'kn' ? 'ಕರಣ' : currentLang === 'hi' ? 'करण' : 'Karana'}: <span className="font-bold text-stone-800 dark:text-stone-200">{todayPanchanga.karana[currentLang]}</span>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-750 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="text-[11px]">
              {todayPanchanga.vara[currentLang]}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
              {todayPanchanga.ritu[currentLang].split('(')[0].trim()}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Live Timings Status Bar with Active Muhurta Highlights */}
      <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-stone-800/60 border border-amber-300/60 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        
        {/* Active Muhurta Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rahu Kaal Alert */}
          {isRahuKaalActive ? (
            <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold flex items-center gap-1.5 animate-pulse shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ರಾಹು ಕಾಲ ಚಾಲ್ತಿಯಲ್ಲಿದೆ!' : currentLang === 'hi' ? 'राहु काल चल रहा है!' : 'Rahu Kaal Active!'} ({todayPanchanga.rahuKaal.start} - {todayPanchanga.rahuKaal.end})</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300 font-medium">
              {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ' : currentLang === 'hi' ? 'राहु काल' : 'Rahu Kaal'}: <strong className="font-mono text-rose-700 dark:text-rose-400">{todayPanchanga.rahuKaal.start} - {todayPanchanga.rahuKaal.end}</strong>
            </span>
          )}

          {/* Abhijit Muhurta Alert */}
          {isAbhijitActive ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-2xs animate-pulse">
              <Award className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ಅತ್ಯಂತ ಶುಭ)!' : currentLang === 'hi' ? 'अभिजीत मुहूर्त सक्रिय है!' : 'Abhijit Muhurta Active (Auspicious)!'} ({todayPanchanga.abhijitMuhurta.start} - {todayPanchanga.abhijitMuhurta.end})</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-medium">
              {currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'अभिजीत मुहूर्त' : 'Abhijit'}: <strong className="font-mono">{todayPanchanga.abhijitMuhurta.start} - {todayPanchanga.abhijitMuhurta.end}</strong>
            </span>
          )}

          {/* Amrit Kaal Alert if present */}
          {todayPanchanga.amritKaal && (
            isAmritKaalActive ? (
              <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಅಮೃತ ಕಾಲ ಚಾಲ್ತಿಯಲ್ಲಿದೆ!' : currentLang === 'hi' ? 'अमृत काल चल रहा है!' : 'Amrit Kaal Active!'} ({todayPanchanga.amritKaal.start} - {todayPanchanga.amritKaal.end})</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-medium hidden sm:inline-block">
                {currentLang === 'kn' ? 'ಅಮೃತ ಕಾಲ' : currentLang === 'hi' ? 'अमृत काल' : 'Amrit Kaal'}: <strong className="font-mono">{todayPanchanga.amritKaal.start} - {todayPanchanga.amritKaal.end}</strong>
              </span>
            )
          )}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenKundali && (
            <button
              onClick={onOpenKundali}
              className="px-2.5 py-1 rounded-lg border border-amber-400/80 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{labels.openKundali}</span>
            </button>
          )}

          {onOpenDayDetail && (
            <button
              onClick={() => onOpenDayDetail(todayPanchanga)}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>{labels.viewDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
