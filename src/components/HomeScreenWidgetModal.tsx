import React, { useState } from 'react';
import { 
  X, 
  LayoutGrid, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Flame, 
  Smartphone, 
  Check, 
  Copy,
  Download
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { formatJustNumber, formatNumberWithEnglishBracket } from '../utils/panchanga';

interface HomeScreenWidgetModalProps {
  todayPanchanga: PanchangaDay;
  currentLang: Language;
  selectedCity: CityLocation;
  onClose: () => void;
}

export const HomeScreenWidgetModal: React.FC<HomeScreenWidgetModalProps> = ({
  todayPanchanga,
  currentLang,
  selectedCity,
  onClose
}) => {
  const [widgetSize, setWidgetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [widgetTheme, setWidgetTheme] = useState<'saffron' | 'temple' | 'midnight' | 'gold'>('saffron');
  const [showRahuKaal, setShowRahuKaal] = useState(true);
  const [showGulikaKaal, setShowGulikaKaal] = useState(true);
  const [showSunrise, setShowSunrise] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const getThemeClasses = () => {
    switch (widgetTheme) {
      case 'temple':
        return 'bg-gradient-to-br from-red-900 via-rose-950 to-stone-900 text-white border-red-500/40';
      case 'midnight':
        return 'bg-gradient-to-br from-stone-950 via-slate-900 to-stone-900 text-amber-100 border-amber-500/30';
      case 'gold':
        return 'bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-900 text-white border-yellow-400/50';
      default:
        return 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white border-amber-400/50';
    }
  };

  const handleCopyWidgetCode = () => {
    const snippet = `<!-- HCMM Vedic Panchanga Widget -->\n<div id="hcmm-panchanga-widget" data-city="${selectedCity.name}" data-theme="${widgetTheme}" data-size="${widgetSize}"></div>\n<script src="${window.location.origin}/widget.js" async></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-amber-200/80 dark:border-stone-700 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-5 h-5 text-amber-200" />
            <div>
              <h2 className="font-serif font-bold text-lg text-white">
                {currentLang === 'kn' ? 'ಹೋಮ್ ಸ್ಕ್ರೀನ್ ವಿಜೆಟ್ (Home Screen Widget)' : currentLang === 'hi' ? 'होम स्क्रीन विजेट' : 'Home Screen Widget for Quick Access'}
              </h2>
              <p className="text-xs text-amber-100">
                Panchanga glance, auspicious times & quick access
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Controls: Size & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Widget Size
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold">
                <button
                  onClick={() => setWidgetSize('small')}
                  className={`py-1.5 rounded-lg transition-all ${widgetSize === 'small' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Small (2x2)
                </button>
                <button
                  onClick={() => setWidgetSize('medium')}
                  className={`py-1.5 rounded-lg transition-all ${widgetSize === 'medium' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Medium (4x2)
                </button>
                <button
                  onClick={() => setWidgetSize('large')}
                  className={`py-1.5 rounded-lg transition-all ${widgetSize === 'large' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Large (4x4)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Widget Visual Theme
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold">
                <button
                  onClick={() => setWidgetTheme('saffron')}
                  className={`py-1.5 rounded-lg transition-all ${widgetTheme === 'saffron' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Saffron
                </button>
                <button
                  onClick={() => setWidgetTheme('gold')}
                  className={`py-1.5 rounded-lg transition-all ${widgetTheme === 'gold' ? 'bg-yellow-600 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Gold
                </button>
                <button
                  onClick={() => setWidgetTheme('temple')}
                  className={`py-1.5 rounded-lg transition-all ${widgetTheme === 'temple' ? 'bg-red-800 text-white shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Temple
                </button>
                <button
                  onClick={() => setWidgetTheme('midnight')}
                  className={`py-1.5 rounded-lg transition-all ${widgetTheme === 'midnight' ? 'bg-stone-900 text-amber-300 shadow-xs' : 'text-stone-600 dark:text-stone-400'}`}
                >
                  Night
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700 dark:text-stone-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showRahuKaal} 
                onChange={(e) => setShowRahuKaal(e.target.checked)}
                className="accent-amber-600 rounded" 
              />
              <span>Rahu Kaal</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showGulikaKaal} 
                onChange={(e) => setShowGulikaKaal(e.target.checked)}
                className="accent-amber-600 rounded" 
              />
              <span>Gulika Kaal</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showSunrise} 
                onChange={(e) => setShowSunrise(e.target.checked)}
                className="accent-amber-600 rounded" 
              />
              <span>Suryodaya / Suryasta</span>
            </label>
          </div>

          {/* Live Simulated Widget Canvas */}
          <div className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-950 flex flex-col items-center justify-center border border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-3">
              Home Screen Live Preview
            </span>

            {/* Small Widget */}
            {widgetSize === 'small' && (
              <div className={`w-44 h-44 rounded-3xl p-4 shadow-xl border flex flex-col justify-between ${getThemeClasses()}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {selectedCity.name}
                    </span>
                    <div className="text-2xl font-bold font-serif leading-none mt-0.5">
                      {formatNumberWithEnglishBracket(todayPanchanga.day, currentLang)}
                    </div>
                  </div>
                  <Sun className="w-5 h-5 text-amber-200 animate-spin-slow" />
                </div>

                <div>
                  <div className="text-xs font-bold truncate">
                    {todayPanchanga.tithiName[currentLang]}
                  </div>
                  <div className="text-[10px] opacity-85 truncate">
                    {todayPanchanga.nakshatra[currentLang]}
                  </div>
                  {showRahuKaal && (
                    <div className="text-[9.5px] mt-1 pt-1 border-t border-white/20 font-mono">
                      RK: {todayPanchanga.rahuKaal.start}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medium Widget */}
            {widgetSize === 'medium' && (
              <div className={`w-full max-w-md h-44 rounded-3xl p-4 sm:p-5 shadow-xl border flex flex-col justify-between ${getThemeClasses()}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-85">
                      <span>{selectedCity.name}</span>
                      <span>•</span>
                      <span>{todayPanchanga.vara[currentLang]}</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-serif leading-none mt-1">
                      {formatNumberWithEnglishBracket(todayPanchanga.day, currentLang)} {todayPanchanga.tithiName[currentLang]}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {todayPanchanga.samvatsara[currentLang]} • {todayPanchanga.masa[currentLang]} ಮಾಸ
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/20">
                    HCMM
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-xs">
                  {showSunrise && (
                    <div>
                      <span className="text-[9.5px] opacity-80 block">🌅 Suryodaya</span>
                      <span className="font-mono font-bold">{todayPanchanga.sunrise}</span>
                    </div>
                  )}
                  {showRahuKaal && (
                    <div>
                      <span className="text-[9.5px] opacity-80 block">⚠️ Rahu Kaal</span>
                      <span className="font-mono font-bold">{todayPanchanga.rahuKaal.start.split(' ')[0]}</span>
                    </div>
                  )}
                  {showGulikaKaal && (
                    <div>
                      <span className="text-[9.5px] opacity-80 block">✨ Gulika</span>
                      <span className="font-mono font-bold">{todayPanchanga.gulikaKaal.start.split(' ')[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Large Widget */}
            {widgetSize === 'large' && (
              <div className={`w-full max-w-md rounded-3xl p-6 shadow-xl border space-y-4 ${getThemeClasses()}`}>
                <div className="flex items-start justify-between border-b border-white/20 pb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-85">
                      {selectedCity.name} • {todayPanchanga.vara[currentLang]}
                    </div>
                    <div className="text-3xl font-bold font-serif mt-1">
                      {formatNumberWithEnglishBracket(todayPanchanga.day, currentLang)} {todayPanchanga.tithiName[currentLang]}
                    </div>
                    <div className="text-xs opacity-90">
                      {todayPanchanga.samvatsara[currentLang]} ಸಂವತ್ಸರ • {todayPanchanga.masa[currentLang]} ಮಾಸ
                    </div>
                  </div>
                  <Sun className="w-8 h-8 text-amber-200" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] opacity-80 block">ನಕ್ಷತ್ರ (Nakshatra)</span>
                    <span className="font-bold">{todayPanchanga.nakshatra[currentLang]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-80 block">ಚಂದ್ರ ರಾಶಿ (Moon Sign)</span>
                    <span className="font-bold">{todayPanchanga.chandraRashi[currentLang]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-80 block">🌅 ಸೂರ್ಯೋದಯ / ಸೂರ್ಯಾಸ್ತ</span>
                    <span className="font-mono font-bold">{todayPanchanga.sunrise} - {todayPanchanga.sunset}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-80 block">⚠️ ರಾಹು ಕಾಲ (Rahu Kaal)</span>
                    <span className="font-mono font-bold">{todayPanchanga.rahuKaal.start} - {todayPanchanga.rahuKaal.end}</span>
                  </div>
                </div>

                {todayPanchanga.festivals.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>ಹಬ್ಬ: {todayPanchanga.festivals[0].name[currentLang]}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Instructions & Embed Option */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>
                To add this widget directly to your phone: Open in Chrome/Safari & tap <strong>"Add to Home Screen"</strong> (PWA).
              </span>
            </div>

            <button
              onClick={handleCopyWidgetCode}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Widget'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
