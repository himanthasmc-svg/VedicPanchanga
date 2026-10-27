import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Heart, 
  ChevronRight, 
  Check, 
  X, 
  Sun, 
  Layers, 
  Flame, 
  Clock, 
  BookOpen,
  Volume2
} from 'lucide-react';
import { CityLocation, Language, Festival } from '../types';
import { getNavaratriColorsForYear, NavaratriDayInfo } from '../utils/navaratriColors';
import { formatNumberWithEnglishBracket } from '../utils/panchanga';
import { FESTIVALS_CATALOG } from '../utils/festivals';

interface NavaratriColorsFeatureProps {
  currentLang: Language;
  selectedYear: number;
  selectedCity?: CityLocation;
  onSelectDayDate?: (dateStr: string) => void;
  onSelectFestival?: (fest: Festival) => void;
  onClose?: () => void;
}

export const NavaratriColorsFeature: React.FC<NavaratriColorsFeatureProps> = ({
  currentLang,
  selectedYear,
  selectedCity,
  onSelectDayDate,
  onSelectFestival,
  onClose
}) => {
  const daysList = getNavaratriColorsForYear(selectedYear, selectedCity);
  
  // Find if today is one of the days
  const todayMatch = daysList.find(d => d.isToday);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    return todayMatch ? todayMatch.dayNumber : 1;
  });

  const activeDay = daysList.find(d => d.dayNumber === selectedDayNumber) || daysList[0];

  const handleOpenFestival = (festId: string) => {
    if (!onSelectFestival) return;
    const found = FESTIVALS_CATALOG.find(f => f.id === festId);
    if (found) {
      onSelectFestival(found);
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/20 dark:via-stone-900 rounded-3xl p-4 sm:p-7 border-2 border-amber-500/50 shadow-xl animate-in fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-300 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>
              {currentLang === 'kn' ? 'ವರ್ಷದ ನವರಾತ್ರಿ ೯ ದಿನಗಳ ಮಂಗಳಕರ ಬಣ್ಣಗಳು' : currentLang === 'hi' ? 'वर्ष की नवरात्रि के ९ पावन रंग' : 'SACRED NAVARATRI 9 COLORS OF THE YEAR'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
              {selectedYear}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {currentLang === 'kn' 
              ? `ಶರನ್ನವರಾತ್ರಿ ೯ ದಿನಗಳ ದೇವೀ ರೂಪ ಹಾಗೂ ಶುಭ ವರ್ಣ ವೈಭವ (${selectedYear})` 
              : currentLang === 'hi'
              ? `शारदीय नवरात्रि ९ दिवसीय देवी स्वरूप एवं शुभ रंग विधान (${selectedYear})`
              : `Auspicious Colors for the 9 Days of Navaratri (${selectedYear})`}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl leading-relaxed">
            {currentLang === 'kn'
              ? 'ಹಿಂದೂ ಪಂಚಾಂಗ ಶಾಸ್ತ್ರಾನುಸಾರ ನವರಾತ್ರಿಯ ಪ್ರತಿ ವರ್ಷವೂ ಪಾಡ್ಯದ ದಿನ ಪ್ರಾರಂಭವಾಗುವ ವಾರದ (ವಾರ/Vara) ಆಧಾರದ ಮೇಲೆ ಮಂಗಳಕರ ಬಣ್ಣಗಳು ನಿರ್ಧಾರವಾಗುತ್ತವೆ. ೨೦೨೬ರಲ್ಲಿ ಭಾನುವಾರ ಪ್ರಾರಂಭವಾಗುವುದರಿಂದ ಪ್ರಥಮ ದಿನ ಕಿತ್ತಳೆ (ಸೂರ್ಯ), ಸೋಮವಾರ ಶ್ವೇತ, ಮಂಗಳವಾರ ಕೆಂಪು ಹೀಗೆ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಪರಿಭ್ರಮಿಸುತ್ತವೆ.'
              : currentLang === 'hi'
              ? 'शास्त्र सम्मत परम्परानुसार प्रतिपदा के दिन पड़ने वाले वार (Weekday) के आधार पर नवरात्रि के रंगों का चक्र निर्धारित होता है। वर्ष २०२६ में रविवार से आरम्भ होने के कारण प्रथम दिवस नारंगी, द्वितीय दिवस श्वेत एवं तृतीय दिवस लाल रंग विहित है।'
              : 'According to classical Shastra rules, the 9 colors of Navaratri dynamically rotate each year based on the specific weekday (Vara) of Pratipada. In 2026, commencing on Sunday, Day 1 is Orange (Surya), followed by White on Monday, Red on Tuesday, etc.'}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end md:self-start p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 text-stone-500 hover:text-stone-900 text-xs font-bold transition-colors cursor-pointer"
            title="Close Navaratri Colors"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* TODAY'S AUSPICIOUS COLOR BANNER (Highlighted if today is in Navaratri) */}
      {todayMatch && (
        <div 
          className="relative overflow-hidden p-5 sm:p-6 rounded-2xl text-white shadow-2xl border-2 border-white/60 animate-in zoom-in-95 duration-200"
          style={{ backgroundColor: todayMatch.hex }}
        >
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-xs text-xs font-mono font-bold tracking-widest uppercase">
                <Sun className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>
                  {currentLang === 'kn' ? 'ಇಂದಿನ ನವರಾತ್ರಿ ಶುಭ ಬಣ್ಣ (TODAY)' : currentLang === 'hi' ? 'आज का पावन रंग (TODAY)' : "TODAY'S AUSPICIOUS NAVARATRI COLOR"}
                </span>
                <span>• Day {todayMatch.dayNumber}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight" style={{ color: todayMatch.hex === '#f8fafc' ? '#1e293b' : '#ffffff' }}>
                {todayMatch.colorName[currentLang]} • {todayMatch.goddessAvatar[currentLang]}
              </h3>

              <p className="text-xs sm:text-sm max-w-2xl font-medium leading-relaxed" style={{ color: todayMatch.hex === '#f8fafc' ? '#334155' : '#fef08a' }}>
                {todayMatch.significance[currentLang]}
              </p>

              <div className="pt-1 text-xs flex flex-wrap items-center gap-x-4 gap-y-1" style={{ color: todayMatch.hex === '#f8fafc' ? '#475569' : '#ffffff' }}>
                <span><strong>Date:</strong> {todayMatch.gregorianDateStr}</span>
                <span>•</span>
                <span><strong>Bhog / Offering:</strong> {todayMatch.sacredOffering[currentLang]}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenFestival(todayMatch.festivalId)}
                className="px-4 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs shadow-lg hover:bg-stone-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಿ & ಕಥೆ ನೋಡಿ' : 'View Full Pooja Vidhi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9-COLOR INTERACTIVE SWATCH PALETTE RIBBON */}
      <div>
        <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>{currentLang === 'kn' ? '೯ ದಿನಗಳ ವರ್ಣ ಮಾಲಿಕೆ (Select Day)' : currentLang === 'hi' ? '९ दिवसीय रंग पट्टिका' : '9-Day Color Palette'}</span>
          <span className="text-[11px] text-stone-400 font-normal">
            Click any color circle to inspect Goddess details
          </span>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {daysList.map((day) => {
            const isSelected = selectedDayNumber === day.dayNumber;
            const isWhite = day.hex === '#f8fafc';
            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'scale-105 ring-3 ring-amber-500 shadow-xl border-amber-600 bg-white dark:bg-stone-800'
                    : 'hover:scale-102 border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60'
                }`}
              >
                {/* Visual Color Dot */}
                <div 
                  className={`w-10 h-10 rounded-full shadow-md border-2 mb-2 flex items-center justify-center relative ${
                    isWhite ? 'border-stone-300' : 'border-white'
                  }`}
                  style={{ backgroundColor: day.hex }}
                >
                  <span className={`text-[11px] font-black font-mono ${
                    isWhite ? 'text-stone-900' : 'text-white'
                  }`}>
                    {day.dayNumber}
                  </span>
                  {day.isToday && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full ring-2 ring-white animate-ping" />
                  )}
                </div>

                <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 uppercase">
                  Day {day.dayNumber}
                </span>
                <span className="text-[11px] font-serif font-black text-stone-900 dark:text-stone-100 text-center line-clamp-1">
                  {day.colorName[currentLang].split('(')[0].trim()}
                </span>
                <span className="text-[9px] text-stone-400 font-mono mt-0.5">
                  {day.gregorianDateStr.slice(5)}
                </span>

                {day.isToday && (
                  <span className="mt-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-extrabold uppercase">
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY IN-DEPTH SPOTLIGHT CARD */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-400/80 shadow-xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-white border-2 border-white ring-4 ring-amber-400/40 shrink-0"
              style={{ backgroundColor: activeDay.hex }}
            >
              <span className={`text-xl font-serif font-black ${
                activeDay.hex === '#f8fafc' ? 'text-stone-900' : 'text-white'
              }`}>
                {activeDay.dayNumber}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
                  Day {activeDay.dayNumber} of Navaratri ({activeDay.tithiName[currentLang]})
                </span>
                {activeDay.isToday && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    TODAY
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {activeDay.goddessAvatar[currentLang]}
              </h3>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                📅 Gregorian Date: <strong className="text-stone-800 dark:text-stone-200">{activeDay.gregorianDateStr}</strong> ({selectedYear})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span 
              className="px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 border"
              style={{ 
                backgroundColor: activeDay.hex, 
                color: activeDay.hex === '#f8fafc' ? '#1e293b' : '#ffffff',
                borderColor: activeDay.hex === '#f8fafc' ? '#cbd5e1' : 'transparent'
              }}
            >
              <span>🎨 {activeDay.colorName[currentLang]}</span>
            </span>

            {onSelectDayDate && (
              <button
                onClick={() => onSelectDayDate(activeDay.gregorianDateStr)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Go to Date →
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Auspicious Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Significance */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
              1. Color Significance (ವರ್ಣ ಮಹಿಮೆ)
            </span>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {activeDay.significance[currentLang]}
            </p>
          </div>

          {/* Clothing Guidance */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
              2. Attire / Clothing (ಧರಿಸಬೇಕಾದ ವಸ್ತ್ರ)
            </span>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {activeDay.clothingGuidance[currentLang]}
            </p>
          </div>

          {/* Bhog / Offering */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
              3. Sacred Bhog (ದೇವಿಗೆ ಪ್ರಿಯ ನೈವೇದ್ಯ)
            </span>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {activeDay.sacredOffering[currentLang]}
            </p>
          </div>

          {/* Dhyana Sloka */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200 dark:border-stone-700 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
              4. Dhyana Mantra (ಧ್ಯಾನ ಮಂತ್ರ)
            </span>
            <p className="font-mono text-amber-900 dark:text-amber-200 font-semibold text-[11px] leading-relaxed">
              {activeDay.dhyanaMantra[currentLang]}
            </p>
          </div>

        </div>

        {/* Action Button for Full Ritual Details */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="text-[11px] text-stone-500">
            Panchanga Tithi: <strong className="text-stone-700 dark:text-stone-300">{activeDay.tithiName[currentLang]}</strong> • Sharannavaratri Mahotsava
          </div>

          <button
            onClick={() => handleOpenFestival(activeDay.festivalId)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ಪೂಜಾ ಕಥೆ ಮತ್ತು ಮಂತ್ರಗಳು →' : 'Read Full Katha, Mantras & Rituals →'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
