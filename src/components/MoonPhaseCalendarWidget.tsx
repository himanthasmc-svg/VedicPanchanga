import React, { useMemo } from 'react';
import { 
  Moon, 
  Sparkles, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Clock, 
  Info,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Language, PanchangaDay } from '../types';
import { formatNumberWithEnglishBracket, formatJustNumber } from '../utils/panchanga';
import { MoonPhaseIcon } from './MoonPhaseIcon';

interface MoonPhaseCalendarWidgetProps {
  selectedDay: PanchangaDay;
  currentLang: Language;
  onSelectDayByOffset?: (daysOffset: number) => void;
  className?: string;
}

export const MoonPhaseCalendarWidget: React.FC<MoonPhaseCalendarWidgetProps> = ({
  selectedDay,
  currentLang,
  className = ''
}) => {
  const { paksha, tithiNumber } = selectedDay;
  const isShukla = paksha === 'Shukla';

  // Calculate percentage illumination:
  // Amavasya (Krishna 15) = 0%
  // Purnima (Shukla 15) = 100%
  // Shukla: goes from 0% (or ~3% on Pratipada) to 100% (Purnima)
  // Krishna: goes from 100% to 0% (Amavasya)
  const illuminationPct = useMemo(() => {
    if (isShukla) {
      if (tithiNumber === 15) return 100;
      return Math.round((tithiNumber / 15) * 100);
    } else {
      if (tithiNumber === 15) return 0;
      return Math.round(((15 - tithiNumber) / 15) * 100);
    }
  }, [isShukla, tithiNumber]);

  // Days until Next Purnima & Next Amavasya
  const daysToPurnima = useMemo(() => {
    if (isShukla) {
      return 15 - tithiNumber;
    } else {
      return 15 + (15 - tithiNumber);
    }
  }, [isShukla, tithiNumber]);

  const daysToAmavasya = useMemo(() => {
    if (!isShukla) {
      return 15 - tithiNumber;
    } else {
      return 15 + (15 - tithiNumber);
    }
  }, [isShukla, tithiNumber]);

  // Phase Name
  const phaseTitle = useMemo(() => {
    if (tithiNumber === 15) {
      if (isShukla) {
        return currentLang === 'kn' ? 'ಹುಣ್ಣಿಮೆ (ಪೂರ್ಣ ಚಂದ್ರ)' : currentLang === 'hi' ? 'पूर्णिमा (पूर्ण चन्द्र)' : 'Purnima (Full Moon)';
      } else {
        return currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ (ಸರ್ವಪಿತೃ ದರ್ಶನ)' : currentLang === 'hi' ? 'अमावस्या (नव चन्द्र)' : 'Amavasya (New Moon)';
      }
    }
    if (isShukla) {
      return currentLang === 'kn' ? `ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳ ಕಾಲ - Waxing Moon)` : currentLang === 'hi' ? `शुक्ल पक्ष (वैक्सिंग मून)` : `Shukla Paksha (Waxing Phase)`;
    } else {
      return currentLang === 'kn' ? `ಕೃಷ್ಣ ಪಕ್ಷ (ಕತ್ತಲೆ ಕಾಲ - Waning Moon)` : currentLang === 'hi' ? `कृष्ण पक्ष (वेनिंग मून)` : `Krishna Paksha (Waning Phase)`;
    }
  }, [isShukla, tithiNumber, currentLang]);

  // 15 Tithis progression steps from Amavasya (0) to Purnima (15)
  const shuklaTithis = [
    { num: 0, name: { kn: 'ಅಮಾವಾಸ್ಯೆ', hi: 'अमावस्या', en: 'Amavasya' }, pct: 0 },
    { num: 1, name: { kn: 'ಪಾಡ್ಯ', hi: 'प्रतिपदा', en: 'Pratipada' }, pct: 7 },
    { num: 2, name: { kn: 'ಬಿದಿಗೆ', hi: 'द्वितीया', en: 'Dvitiya' }, pct: 14 },
    { num: 3, name: { kn: 'ತದಿಗೆ', hi: 'तृतीया', en: 'Tritiya' }, pct: 21 },
    { num: 4, name: { kn: 'ಚೌತಿ', hi: 'चतुर्थी', en: 'Chaturthi' }, pct: 28 },
    { num: 5, name: { kn: 'ಪಂಚಮಿ', hi: 'पञ्चमी', en: 'Panchami' }, pct: 35 },
    { num: 6, name: { kn: 'ಷಷ್ಠಿ', hi: 'षष्ठी', en: 'Shashti' }, pct: 42 },
    { num: 7, name: { kn: 'ಸಪ್ತಮಿ', hi: 'सप्तमी', en: 'Saptami' }, pct: 49 },
    { num: 8, name: { kn: 'ಅಷ್ಟಮಿ', hi: 'अष्टमी', en: 'Ashtami' }, pct: 56 },
    { num: 9, name: { kn: 'ನವಮಿ', hi: 'नवमी', en: 'Navami' }, pct: 63 },
    { num: 10, name: { kn: 'ದಶಮಿ', hi: 'दशमी', en: 'Dashami' }, pct: 70 },
    { num: 11, name: { kn: 'ಏಕಾದಶಿ', hi: 'एकादशी', en: 'Ekadashi' }, pct: 78 },
    { num: 12, name: { kn: 'ದ್ವಾದಶಿ', hi: 'द्वादशी', en: 'Dvadashi' }, pct: 85 },
    { num: 13, name: { kn: 'ತ್ರಯೋದಶಿ', hi: 'त्रयोदशी', en: 'Trayodashi' }, pct: 92 },
    { num: 14, name: { kn: 'ಚತುರ್ದಶಿ', hi: 'चतुर्दशी', en: 'Chaturdashi' }, pct: 97 },
    { num: 15, name: { kn: 'ಹುಣ್ಣಿಮೆ', hi: 'पूर्णिमा', en: 'Purnima' }, pct: 100 }
  ];

  return (
    <div className={`rounded-2xl border-2 border-amber-300 dark:border-stone-800 bg-gradient-to-br from-amber-50/70 via-white to-stone-50/80 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 p-5 shadow-md ${className}`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200/80 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ದಿನದ ಚಂದ್ರ ದರ್ಶನ (Moon Phase)' : currentLang === 'hi' ? 'चयनित तिथि चन्द्र दर्शन (Moon Phase)' : 'Selected Date Moon Phase Visualizer'}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isShukla 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
              }`}>
                {selectedDay.pakshaName[currentLang]}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {selectedDay.vara[currentLang]} • {selectedDay.gregorianDate} • {selectedDay.tithiName[currentLang]} ({formatJustNumber(selectedDay.tithiNumber, currentLang)})
            </p>
          </div>
        </div>

        {/* Illumination Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10.5px] uppercase font-bold text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಪ್ರಕಾಶಮಾನತೆ' : 'Illumination'}
            </span>
            <span className="font-mono font-extrabold text-lg sm:text-xl text-amber-600 dark:text-amber-400">
              {illuminationPct}%
            </span>
          </div>

          <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md shrink-0 flex items-center justify-center">
            <MoonPhaseIcon
              paksha={paksha}
              tithiNumber={tithiNumber}
              size={44}
              currentLang={currentLang}
            />
          </div>
        </div>
      </div>

      {/* Main Visual Display: Amavasya to Purnima Cycle Ribbon */}
      <div className="py-4 space-y-4">
        
        {/* Cycle Track Title */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
          <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-600 inline-block"></span>
            <span>{currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ (0% ಕತ್ತಲೆ)' : currentLang === 'hi' ? 'अमावस्या (0%)' : 'Amavasya (0%)'}</span>
          </span>

          <span className="text-center font-serif text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
            {phaseTitle}
          </span>

          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span>{currentLang === 'kn' ? 'ಹುಣ್ಣಿಮೆ (100% ಪೂರ್ಣ)' : currentLang === 'hi' ? 'पूर्णिमा (100%)' : 'Purnima (100%)'}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-amber-500 shadow-xs inline-block"></span>
          </span>
        </div>

        {/* Visual Progression Track with 16 Step Nodes */}
        <div className="relative w-full py-2">
          {/* Background Bar */}
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-stone-900 via-amber-500/70 to-yellow-300 dark:from-stone-950 dark:via-amber-600 dark:to-yellow-200 shadow-inner relative overflow-hidden">
            {/* Active Position Indicator Fill */}
            <div 
              className="absolute top-0 bottom-0 left-0 bg-white/25 transition-all duration-300"
              style={{ width: `${isShukla ? illuminationPct : 100 - illuminationPct}%` }}
            />
          </div>

          {/* 16 Step Nodes (Amavasya to Purnima) */}
          <div className="flex justify-between items-center -mt-2.5 px-0.5">
            {shuklaTithis.map((item) => {
              const isCurrent = isShukla 
                ? (item.num === (tithiNumber === 15 ? 15 : tithiNumber))
                : (item.num === (tithiNumber === 15 ? 0 : 15 - tithiNumber));

              return (
                <div 
                  key={item.num}
                  className="flex flex-col items-center group relative cursor-pointer"
                  title={`${item.name[currentLang] || item.name.en} (~${item.pct}%)`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full transition-transform flex items-center justify-center ${
                    isCurrent 
                      ? 'ring-3 ring-amber-500 bg-amber-400 scale-125 z-10 shadow-md' 
                      : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:scale-110'
                  }`}>
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                  </div>
                  
                  {/* Subtle label on key phases: Amavasya (0), Ashtami (8), Purnima (15) */}
                  {(item.num === 0 || item.num === 8 || item.num === 15) && (
                    <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 mt-1 whitespace-nowrap">
                      {item.name[currentLang]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Details Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          
          <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಪಕ್ಷ (Lunar Fortnight)' : 'Lunar Paksha'}
            </span>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-0.5 flex items-center gap-1.5">
              <span>{selectedDay.pakshaName[currentLang]}</span>
              <span className="text-xs font-mono font-normal text-amber-600">
                ({isShukla ? 'Waxing' : 'Waning'})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ತಿಥಿ ಸಂಖ್ಯೆ' : 'Tithi Index'}
            </span>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-0.5 font-mono">
              {formatNumberWithEnglishBracket(selectedDay.tithiNumber, currentLang)} / 15
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಮುಂದಿನ ಹುಣ್ಣಿಮೆಗೆ ದಿನಗಳು' : 'Days to Full Moon'}
            </span>
            <div className="font-bold text-amber-700 dark:text-amber-400 text-sm mt-0.5 font-mono">
              {daysToPurnima === 0 
                ? (currentLang === 'kn' ? 'ಇಂದೇ ಹುಣ್ಣಿಮೆ!' : 'Today is Purnima!') 
                : `${formatJustNumber(daysToPurnima, currentLang)} ${currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}`}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              {currentLang === 'kn' ? 'ಮುಂದಿನ ಅಮಾವಾಸ್ಯೆಗೆ ದಿನಗಳು' : 'Days to New Moon'}
            </span>
            <div className="font-bold text-stone-700 dark:text-stone-300 text-sm mt-0.5 font-mono">
              {daysToAmavasya === 0 
                ? (currentLang === 'kn' ? 'ಇಂದೇ ಅಮಾವಾಸ್ಯೆ!' : 'Today is Amavasya!') 
                : `${formatJustNumber(daysToAmavasya, currentLang)} ${currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}`}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
