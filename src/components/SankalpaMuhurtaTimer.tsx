import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Sun, 
  Moon, 
  Compass, 
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { CityLocation, Language, LocalizedString, PanchangaDay } from '../types';

export interface SankalpaMuhurtaTimerProps {
  currentLang: Language;
  selectedCity: CityLocation;
  selectedDateStr: string; // YYYY-MM-DD
  panchangDay: PanchangaDay;
}

interface MuhurtaWindowItem {
  id: string;
  name: LocalizedString;
  category: 'auspicious' | 'inauspicious' | 'tithi' | 'custom';
  startTimeStr: string; // e.g. "11:48 AM"
  endTimeStr: string;   // e.g. "12:36 PM"
  significance: LocalizedString;
  recommendedAction: LocalizedString;
}

export const SankalpaMuhurtaTimer: React.FC<SankalpaMuhurtaTimerProps> = ({
  currentLang,
  selectedCity,
  selectedDateStr,
  panchangDay
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('abhijit');
  const [audioChimeEnabled, setAudioChimeEnabled] = useState<boolean>(true);
  
  // Custom Japa / Sankalpa hold timer
  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(300); // 5 mins default
  const [customTimerRunning, setCustomTimerRunning] = useState<boolean>(false);
  const [customTimerInitial, setCustomTimerInitial] = useState<number>(300);

  // Current real-time clock in user's selected city timezone
  const [currentCityTime, setCurrentCityTime] = useState<Date>(() => new Date());

  // Keep audio context ref for chime
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play pleasant Vedic brass temple bell chime
  const playTempleChime = () => {
    if (!audioChimeEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 harmonic bell
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.2);
      });
    } catch {
      // Audio not permitted or supported
    }
  };

  // 1-second interval ticker updating city time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom Sankalpa Meditation timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (customTimerRunning && customTimerSeconds > 0) {
      interval = setInterval(() => {
        setCustomTimerSeconds(prev => {
          if (prev <= 1) {
            setCustomTimerRunning(false);
            playTempleChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [customTimerRunning, customTimerSeconds, audioChimeEnabled]);

  // Format current time in city timezone
  const cityTimeFormatted = useMemo(() => {
    try {
      const tz = selectedCity.timezone || 'Asia/Kolkata';
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      return formatter.format(currentCityTime);
    } catch {
      return currentCityTime.toLocaleTimeString();
    }
  }, [currentCityTime, selectedCity.timezone]);

  // Current City Date string (YYYY-MM-DD)
  const cityDateYMD = useMemo(() => {
    try {
      const tz = selectedCity.timezone || 'Asia/Kolkata';
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const parts = formatter.formatToParts(currentCityTime);
      const y = parts.find(p => p.type === 'year')?.value || '';
      const m = parts.find(p => p.type === 'month')?.value || '';
      const d = parts.find(p => p.type === 'day')?.value || '';
      return `${y}-${m}-${d}`;
    } catch {
      return selectedDateStr;
    }
  }, [currentCityTime, selectedCity.timezone, selectedDateStr]);

  // Build complete list of Muhurta windows from panchangDay
  const muhurtaWindows: MuhurtaWindowItem[] = useMemo(() => {
    const items: MuhurtaWindowItem[] = [
      {
        id: 'abhijit',
        name: {
          kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಮಂಗಳಕರ)',
          hi: 'अभिजित मुहूर्त (परम शुभ)',
          en: 'Abhijit Muhurta (Supreme)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.abhijitMuhurta?.start || '11:45 AM',
        endTimeStr: panchangDay.abhijitMuhurta?.end || '12:35 PM',
        significance: {
          kn: 'ಮಧ್ಯಾಹ್ನದ ಪರಮ ಮಂಗಳಕರ ಕಾಲ; ಸಂಕಲ್ಪ, ಕಲಶ ಸ್ಥಾಪನೆ ಹಾಗೂ ದೀಪಾರಾಧನೆಗೆ ಸರ್ವಶ್ರೇಷ್ಠ.',
          hi: 'मध्याह्न का सर्वश्रेष्ठ मुहूर्त; संकल्प, कलश स्थापना एवं पूजन हेतु अति शुभ।',
          en: 'Peak auspicious midday window; eradicates planetary blemishes for Sankalpa.'
        },
        recommendedAction: {
          kn: 'ಈ ಸಮಯದಲ್ಲಿ ಸಂಕಲ್ಪ ಮಂತ್ರ ಪಠಿಸಿ ಕಲಶ/ದೀಪ ಸ್ಥಾಪನೆ ಮಾಡಿ.',
          hi: 'इस समय में संकल्प पाठ व कलश/दीप स्थापना करें।',
          en: 'Commence your main Sankalpa and sacred installations.'
        }
      },
      {
        id: 'amrit',
        name: {
          kn: 'ಅಮೃತ ಕಾಲ (ಸಂಜೀವಿನಿ)',
          hi: 'अमृत काल (कल्याणकारी)',
          en: 'Amrit Kaal (Nectar Window)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.amritKaal?.start || '02:15 PM',
        endTimeStr: panchangDay.amritKaal?.end || '03:45 PM',
        significance: {
          kn: 'ಅಮೃತ ತರಂಗಗಳ ಶುಭ ಕಾಲ; ನೈವೇದ್ಯ ಸಮರ್ಪಣೆ ಮತ್ತು ಜಪ-ಧ್ಯಾನಕ್ಕೆ ಅತ್ಯಂತ ಫಲದಾಯಕ.',
          hi: 'अमृत ऊर्जा का काल; नैवेद्य अर्पण व मन्त्र जप हेतु अत्यंत फलदायी।',
          en: 'Nectarine celestial flow; enhances spiritual retention and peace.'
        },
        recommendedAction: {
          kn: 'ಇಷ್ಟದೇವತಾ ಮಂತ್ರ ಜಪಿಸಿ ಹಾಗೂ ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ.',
          hi: 'इष्टदेवता मन्त्र जप एवं नैवेद्य अर्पण करें।',
          en: 'Engage in dedicated mantra chanting and devotional offerings.'
        }
      },
      {
        id: 'brahma',
        name: {
          kn: 'ಬ್ರಹ್ಮ ಮುಹೂರ್ತ (ಪ್ರಾತಃಕಾಲ)',
          hi: 'ब्रह्म मुहूर्त (प्रातःकाल)',
          en: 'Brahma Muhurta (Pre-Dawn)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.brahmaMuhurta?.start || '04:30 AM',
        endTimeStr: panchangDay.brahmaMuhurta?.end || '05:18 AM',
        significance: {
          kn: 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುನ್ನ ಸತ್ವಗುಣ ಪ್ರಧಾನ ಕಾಲ; ಆಚಮನ, ಧ್ಯಾನ ಹಾಗೂ ಸಂಕಲ್ಪಕ್ಕೆ ಆದರ್ಶ.',
          hi: 'सूर्योदय पूर्व सात्विक बेला; आचमन, ध्यान एवं संकल्पारंभ हेतु श्रेष्ठ।',
          en: 'Pre-dawn divine stillness; ideal for meditation and pure vows.'
        },
        recommendedAction: {
          kn: 'ಸ್ನಾನ-ಶುದ್ಧರಾಗಿ ಆಚಮನ ಮತ್ತು ಪ್ರಾಣಾಯಾಮ ಆರಂಭಿಸಿ.',
          hi: 'स्नान कर आचमन एवं प्राणायाम से साधना आरम्भ करें।',
          en: 'Perform holy Achamana, Pranayama, and initial vow recitation.'
        }
      },
      {
        id: 'vijaya',
        name: {
          kn: 'ವಿಜಯ ಮುಹೂರ್ತ (ಕಾರ್ಯಸಿದ್ಧಿ)',
          hi: 'विजय मुहूर्त (कार्यसिद्धि)',
          en: 'Vijaya Muhurta (Victory)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.vijayaMuhurta?.start || '02:00 PM',
        endTimeStr: panchangDay.vijayaMuhurta?.end || '02:48 PM',
        significance: {
          kn: 'ಸರ್ವ ಕಾರ್ಯಗಳಲ್ಲಿ ಜಯ ತರುವ ಅಪರಾಹ್ನ ಕಾಲ; ಸಂಕಷ್ಟ ನಿವಾರಣೆಗೆ ಪೂಜೆ ನಡೆಸಿ.',
          hi: 'सर्व कार्य सिद्धि प्रदायक समय; विघ्न निवारण हेतु विशेष अनुकूल।',
          en: 'Victory window; dissolves persistent obstacles in enterprises.'
        },
        recommendedAction: {
          kn: 'ಸಂಕಲ್ಪ ಸಿದ್ಧಿಗಾಗಿ ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಪುಷ್ಪಾರ್ಚನೆ ಮಾಡಿ.',
          hi: 'संकल्प सिद्धि हेतु प्रार्थना एवं पुष्पांजलि करें।',
          en: 'Offer Pushpanjali for successful culmination of your vow.'
        }
      },
      {
        id: 'godhuli',
        name: {
          kn: 'ಗೋಧೂಳಿ ಮುಹೂರ್ತ (ಸಂಧ್ಯಾ ಕಾಲ)',
          hi: 'गोधूलि मुहूर्त (संध्या वेला)',
          en: 'Godhuli Muhurta (Twilight)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.godhuliMuhurta?.start || '05:55 PM',
        endTimeStr: panchangDay.godhuliMuhurta?.end || '06:20 PM',
        significance: {
          kn: 'ಸೂರ್ಯಾಸ್ತದ ಮಂಗಳ ಸಂಧ್ಯಾ ಕಾಲ; ದೀಪಾರಾಧನೆ, ಆರತಿ ಮತ್ತು ಶಾಂತಿ ಪಾಠಕ್ಕೆ ಶ್ರೇಷ್ಠ.',
          hi: 'सूर्यास्त कालीन पावन समय; संध्या दीप, आरती व शान्ति पाठ हेतु अनुकूल।',
          en: 'Twilight dusk window; revered for evening lamp lighting & Arati.'
        },
        recommendedAction: {
          kn: 'ಸಂಜೆ ದೀಪ ಬೆಳಗಿಸಿ, ಮಂಗಳಾರತಿ ಹಾಗೂ ಶಾಂತಿ ಪಾಠ ಪಠಿಸಿ.',
          hi: 'संध्या दीप जलाएं, मङ्गलारती एवं शान्ति मन्त्र पाठ करें।',
          en: 'Light the evening Deepa, perform Arati, and chant Shanti Patha.'
        }
      },
      {
        id: 'rahu',
        name: {
          kn: '⚠️ ರಾಹು ಕಾಲ (ತ್ಯಾಜ್ಯ/ಎಚ್ಚರಿಕೆ)',
          hi: '⚠️ राहु काल (वर्ज्य समय)',
          en: '⚠️ Rahu Kaal (Inauspicious Period)'
        },
        category: 'inauspicious',
        startTimeStr: panchangDay.rahuKaal?.start || '04:30 PM',
        endTimeStr: panchangDay.rahuKaal?.end || '06:00 PM',
        significance: {
          kn: 'ಅಶುಭ ಕಾಲಾವಧಿ; ಈ ಸಮಯದಲ್ಲಿ ಹೊಸ ಸಂಕಲ್ಪ, ಕಲಶ ಸ್ಥಾಪನೆ ಆರಂಭಿಸಬಾರದು.',
          hi: 'अशुभ वेला; इस समय में नया संकल्प अथवा कलश स्थापना न करें।',
          en: 'Inauspicious window; do not begin primary Sankalpa or installations.'
        },
        recommendedAction: {
          kn: 'ಕೇವಲ ದುರ್ಗಾ ಜಪ ಅಥವಾ ಶಾಂತತೆಯಿಂದ ಇರಿ; ಹೊಸ ಪೂಜೆ ಆರಂಭಿಸಬೇಡಿ.',
          hi: 'केवल दुर्गा जप करें; नवीन अनुष्ठान का आरम्भ न करें।',
          en: 'Avoid initiating new rituals; maintain silent prayer if already underway.'
        }
      }
    ];

    return items;
  }, [panchangDay]);

  const activeWindowItem = muhurtaWindows.find(w => w.id === selectedWindowId) || muhurtaWindows[0];

  // Helper: Parse HH:MM AM/PM string into city date timestamp
  const parseTimeToCityTimestamp = (timeStr: string, dateStr: string): number => {
    try {
      const clean = timeStr.trim().toUpperCase();
      const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
      if (!match) return 0;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridian = match[3];

      if (meridian === 'PM' && hours < 12) hours += 12;
      if (meridian === 'AM' && hours === 12) hours = 0;

      const dateParts = dateStr.split('-');
      const y = parseInt(dateParts[0], 10);
      const m = parseInt(dateParts[1], 10) - 1;
      const d = parseInt(dateParts[2], 10);

      // Create UTC base timestamp
      const target = new Date(Date.UTC(y, m, d, hours, minutes, 0));
      return target.getTime();
    } catch {
      return 0;
    }
  };

  // Calculate real-time status of the selected Muhurta window
  const windowStatus = useMemo(() => {
    // Current time in selected city as minutes from midnight
    const tz = selectedCity.timezone || 'Asia/Kolkata';
    const nowParts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(currentCityTime);

    const nowH = parseInt(nowParts.find(p => p.type === 'hour')?.value || '0', 10);
    const nowM = parseInt(nowParts.find(p => p.type === 'minute')?.value || '0', 10);
    const nowS = parseInt(nowParts.find(p => p.type === 'second')?.value || '0', 10);
    const nowSecondsInDay = nowH * 3600 + nowM * 60 + nowS;

    // Helper to get seconds in day from "HH:MM AM/PM"
    const getSecondsFromTimeStr = (str: string): number => {
      const match = str.trim().toUpperCase().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const meridian = match[3];
      if (meridian === 'PM' && h < 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      return h * 3600 + m * 60;
    };

    const startSec = getSecondsFromTimeStr(activeWindowItem.startTimeStr);
    const endSec = getSecondsFromTimeStr(activeWindowItem.endTimeStr);

    // Is the viewed date today in the city?
    const isTodayInCity = selectedDateStr === cityDateYMD;

    let state: 'active' | 'upcoming' | 'passed' = 'upcoming';
    let remainingSeconds = 0;
    let totalWindowDuration = Math.max(60, endSec - startSec);
    let elapsedPercent = 0;

    if (!isTodayInCity) {
      // Future or past date
      state = selectedDateStr > cityDateYMD ? 'upcoming' : 'passed';
      remainingSeconds = 0;
    } else {
      if (nowSecondsInDay >= startSec && nowSecondsInDay <= endSec) {
        state = 'active';
        remainingSeconds = endSec - nowSecondsInDay;
        const elapsed = nowSecondsInDay - startSec;
        elapsedPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalWindowDuration) * 100)));
      } else if (nowSecondsInDay < startSec) {
        state = 'upcoming';
        remainingSeconds = startSec - nowSecondsInDay;
      } else {
        state = 'passed';
        remainingSeconds = 0;
        elapsedPercent = 100;
      }
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;

    return {
      state,
      isTodayInCity,
      remainingSeconds,
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
      elapsedPercent,
      startSec,
      endSec
    };
  }, [activeWindowItem, currentCityTime, selectedCity.timezone, selectedDateStr, cityDateYMD]);

  return (
    <div className="no-print my-4 w-full">
      <div className="rounded-3xl border-2 border-amber-500/70 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white shadow-2xl p-3 sm:p-5 relative overflow-hidden transition-all">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Title, City Clock & Expand Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg shadow-md shrink-0 ring-2 ${
              activeWindowItem.category === 'inauspicious'
                ? 'bg-rose-600/30 ring-rose-500/50 text-rose-300'
                : 'bg-amber-500/20 ring-amber-400/40 text-amber-300'
            }`}>
              <TimerIcon className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {currentLang === 'kn' ? 'ಮುಹೂರ್ತ ಕ್ಷಣಗಣನೆ' : currentLang === 'hi' ? 'मुहूर्त उल्टी गिनती' : 'Muhurta Countdown'}
                </span>

                <span className="text-[10px] sm:text-xs font-mono text-stone-300 flex items-center gap-1">
                  <span>📍 {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}</span>
                  <span className="text-amber-400 font-bold">({cityTimeFormatted})</span>
                </span>
              </div>

              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-200 mt-0.5">
                {activeWindowItem.name[currentLang]}
              </h3>
            </div>
          </div>

          {/* Right Action Icons: Sound Chime Toggle & Expand Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            
            {/* Audio Bell Chime Toggle */}
            <button
              onClick={() => setAudioChimeEnabled(!audioChimeEnabled)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                audioChimeEnabled
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                  : 'border-stone-700 bg-stone-800 text-stone-400'
              }`}
              title="Temple Bell Chime alert when window starts"
            >
              {audioChimeEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px] font-mono">Chime</span>
            </button>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-700 bg-stone-850 hover:bg-stone-800 text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title={isExpanded ? 'Collapse Timer' : 'Expand Full Muhurta Panel'}
            >
              <span className="hidden sm:inline text-[11px] font-semibold">{isExpanded ? 'Compact' : 'Expand'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Dynamic Countdown Section (Adjusts seamlessly on all mobile screens) */}
        <div className="py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Digital Segmented Countdown Cards */}
          <div className="space-y-2">
            
            <div className="flex items-center gap-2 flex-wrap">
              {windowStatus.state === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentLang === 'kn' ? '🔴 ಸದ್ಯ ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ACTIVE NOW)' : currentLang === 'hi' ? '🔴 वर्तमान में सक्रिय' : '🔴 ACTIVE NOW'}</span>
                </span>
              ) : windowStatus.state === 'upcoming' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'kn' ? '⏳ ಪ್ರಾರಂಭವಾಗಲಿದೆ (STARTS IN)' : currentLang === 'hi' ? '⏳ प्रारम्भ होने में शेष' : '⏳ STARTS IN'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-800 text-stone-400 border border-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentLang === 'kn' ? '✓ ಇಂದಿಗೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ' : currentLang === 'hi' ? '✓ आज समाप्त हो चुका है' : '✓ ENDED TODAY'}</span>
                </span>
              )}

              <span className="text-xs font-mono font-bold text-amber-300/90">
                {activeWindowItem.startTimeStr} - {activeWindowItem.endTimeStr}
              </span>
            </div>

            {/* Segmented Digital Flip Clock Displays */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-14 xs:w-16 sm:w-20 py-2 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-2xl xs:text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-tight">
                    {windowStatus.hours}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ಗಂಟೆ' : currentLang === 'hi' ? 'घंटे' : 'Hours'}
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-500/70 pb-5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-14 xs:w-16 sm:w-20 py-2 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-2xl xs:text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-tight">
                    {windowStatus.mins}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ನಿಮಿಷ' : currentLang === 'hi' ? 'मिनट' : 'Minutes'}
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-500/70 pb-5">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-14 xs:w-16 sm:w-20 py-2 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-2xl xs:text-3xl sm:text-4xl font-mono font-black text-orange-400 tracking-tight">
                    {windowStatus.secs}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ಸೆಕೆಂಡ್' : currentLang === 'hi' ? 'सेकंड' : 'Seconds'}
                </span>
              </div>

            </div>

          </div>

          {/* Right: Significance & Action Prompt Box */}
          <div className="max-w-md w-full p-3 sm:p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{activeWindowItem.significance[currentLang]}</span>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed font-serif">
              {activeWindowItem.recommendedAction[currentLang]}
            </p>

            {/* Active Progress Line */}
            {windowStatus.state === 'active' && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <span>Window Progress</span>
                  <span className="text-emerald-400 font-bold">{windowStatus.elapsedPercent}%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${windowStatus.elapsedPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Quick Selectable Muhurta Pills Grid (Seamless Mobile Scroll / Wrap) */}
        {isExpanded && (
          <div className="mt-2 pt-3 border-t border-stone-800/80 space-y-3 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {currentLang === 'kn' ? 'ಮುಹೂರ್ತ ಕಾಲಾವಧಿಗಳ ಆಯ್ಕೆ (Select Window):' : currentLang === 'hi' ? 'मुहूर्त चयन:' : 'Select Muhurta Window:'}
              </span>

              <span className="text-[10px] font-mono text-stone-400">
                Timezone: {selectedCity.timezone || 'Asia/Kolkata'}
              </span>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-2">
              {muhurtaWindows.map((item) => {
                const isSelected = item.id === selectedWindowId;
                const isInauspicious = item.category === 'inauspicious';

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedWindowId(item.id)}
                    className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between min-h-[70px] ${
                      isSelected
                        ? isInauspicious
                          ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-400/50 shadow-md'
                          : 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                        : 'bg-stone-850/60 border-stone-750 hover:bg-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold truncate text-[11px] sm:text-xs">
                        {item.name[currentLang].split('(')[0]}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                    </div>

                    <div className="text-[10px] font-mono text-stone-300 mt-1">
                      {item.startTimeStr}
                    </div>

                    {isSelected && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isInauspicious ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Sankalpa / Japa Meditation Hold Timer Option */}
            <div className="p-3 rounded-2xl bg-black/40 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <span className="font-serif font-bold text-amber-200">
                    {currentLang === 'kn' ? 'ವೈಯಕ್ತಿಕ ಸಂಕಲ್ಪ ಧ್ಯಾನ & ಜಪ ಟೈಮರ್' : currentLang === 'hi' ? 'व्यक्तिगत संकल्प ध्यान एवं जप टाइमर' : 'Personal Sankalpa Meditation Timer'}
                  </span>
                  <p className="text-[10px] text-stone-400">
                    {currentLang === 'kn' ? 'ನಿಗದಿತ ನಿಮಿಷಗಳ ಕಾಲ ಶಾಂತಿಯಿಂದ ಸಂಕಲ್ಪ ಹಿಡಿದು ಜಪಿಸಲು ಬಳಸಿ' : 'Set dedicated focus time for internal prayer and vow completion.'}
                  </p>
                </div>
              </div>

              {/* Preset buttons: 5m, 11m, 21m */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex rounded-xl bg-stone-800 p-0.5 border border-stone-700">
                  {[
                    { label: '5m', sec: 300 },
                    { label: '11m', sec: 660 },
                    { label: '21m', sec: 1260 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setCustomTimerRunning(false);
                        setCustomTimerSeconds(preset.sec);
                        setCustomTimerInitial(preset.sec);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        customTimerInitial === preset.sec ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-stone-850 border border-stone-700 font-mono font-bold text-amber-300 text-xs">
                  {Math.floor(customTimerSeconds / 60)}:{(customTimerSeconds % 60).toString().padStart(2, '0')}
                </div>

                <button
                  onClick={() => setCustomTimerRunning(!customTimerRunning)}
                  className={`p-1.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                    customTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  title={customTimerRunning ? 'Pause Timer' : 'Start Meditation Timer'}
                >
                  {customTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setCustomTimerRunning(false);
                    setCustomTimerSeconds(customTimerInitial);
                  }}
                  className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                  title="Reset Meditation Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
