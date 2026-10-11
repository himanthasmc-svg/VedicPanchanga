import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Compass, 
  RotateCcw, 
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Language, CityLocation } from '../types';
import { getAstroDiagnosticData, AstroDiagnosticInfo, CITIES, validatePanchangaAgainstEphemeris } from '../utils/panchanga';

interface AstroDiagnosticModalProps {
  currentLang: Language;
  selectedDate: Date;
  selectedCity: CityLocation;
  onClose: () => void;
}

export const AstroDiagnosticModal: React.FC<AstroDiagnosticModalProps> = ({
  currentLang,
  selectedDate,
  selectedCity,
  onClose
}) => {
  const [testDateStr, setTestDateStr] = useState<string>(
    selectedDate.toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'current' | 'suite'>('current');

  const currentDateObj = new Date(`${testDateStr}T12:00:00`);
  const diagnosticData: AstroDiagnosticInfo = getAstroDiagnosticData(currentDateObj, selectedCity);
  const suiteResult = validatePanchangaAgainstEphemeris();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-amber-300 dark:border-stone-700 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with prominent close button */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  {currentLang === 'kn' ? 'ಖಗೋಳ ಪಂಚಾಂಗ ನಿಖರತೆ ಪರೀಕ್ಷಕ (Astro-Diagnostic)' : currentLang === 'hi' ? 'खगोल पंचांग निदान एवं शुद्धता (Astro-Diagnostic)' : 'Astro-Diagnostic & Ephemeris Verification'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  v2026.10
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                {currentLang === 'kn' ? 'ತಿಥಿ, ಪಕ್ಷ ಮತ್ತು ನಕ್ಷತ್ರ ನೈಜ-ಸಮಯದ ಲೆಕ್ಕಾಚಾರಗಳ ಸತ್ಯಾಪನೆ' : 'Real-time astronomical Tithi, Paksha, Nakshatra & Elongation logs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Diagnostic"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Date Input */}
        <div className="p-3 sm:p-4 bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'current'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ದಿನಾಂಕ ಲೆಕ್ಕಾಚಾರ' : 'Selected Date Diagnostics'}
            </button>
            <button
              onClick={() => setActiveTab('suite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'suite'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{currentLang === 'kn' ? 'ಐತಿಹಾಸಿಕ ಪರೀಕ್ಷಾ ವರದಿ' : 'Historical Test Suite'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${suiteResult.allPassed ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-600'}`}>
                {suiteResult.passCount}/{suiteResult.totalTests}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-600 dark:text-stone-400 font-semibold">{currentLang === 'kn' ? 'ದಿನಾಂಕ ಪರೀಕ್ಷಿಸಿ:' : 'Test Date:'}</span>
            <input
              type="date"
              value={testDateStr}
              onChange={(e) => setTestDateStr(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 font-mono text-xs text-stone-900 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800 dark:text-stone-200">
          {activeTab === 'current' ? (
            <div className="space-y-5">
              
              {/* Highlight summary card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Paksha (ಪಕ್ಷ)</span>
                  <span className={`text-base font-bold font-mono ${diagnosticData.isShukla ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {diagnosticData.paksha} Paksha
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {diagnosticData.isShukla ? 'ಶುಕ್ಲ ಪಕ್ಷ (Bright)' : 'ಕೃಷ್ಣ ಪಕ್ಷ (Dark)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Tithi (ತಿಥಿ)</span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {diagnosticData.tithiNumber}. {diagnosticData.tithiName[currentLang]}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 block">
                    Raw: {diagnosticData.rawTithiCalc.toFixed(2)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Nakshatra (ನಕ್ಷತ್ರ)</span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100 truncate block">
                    {diagnosticData.nakshatraName[currentLang]}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 block">
                    Pada {diagnosticData.pada} ({diagnosticData.padaDeg.toFixed(2)}°)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Elongation (ಕೋನಾಂತರ)</span>
                  <span className="text-base font-mono font-bold text-amber-700 dark:text-amber-300">
                    {diagnosticData.elongationDeg.toFixed(2)}°
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {diagnosticData.elongationDeg < 180 ? '< 180° = Shukla' : '≥ 180° = Krishna'}
                  </span>
                </div>
              </div>

              {/* Detailed Mathematical Ephemeris Breakdown */}
              <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
                <div className="bg-stone-100 dark:bg-stone-800 px-4 py-2.5 font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center justify-between">
                  <span>ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಗಣಿತ ಸಮೀಕರಣಗಳ ವಿವರ (Astronomical Parameters)</span>
                  <span className="text-amber-600 font-mono">Location: {diagnosticData.locationName}</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Julian Day (JD):</span>
                      <span className="font-bold">{diagnosticData.julianDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Centuries from J2000 (T):</span>
                      <span className="font-bold">{diagnosticData.T}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Lahiri Ayanamsha:</span>
                      <span className="font-bold text-amber-600">{diagnosticData.ayanamshaDeg}°</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Sun Sidereal Longitude:</span>
                      <span className="font-bold">{diagnosticData.sunSidDeg}° ({diagnosticData.sunRashi})</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Moon Sidereal Longitude:</span>
                      <span className="font-bold">{diagnosticData.moonSidDeg}° ({diagnosticData.moonRashi})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Moon - Sun Elongation:</span>
                      <span className="font-bold text-amber-600">{diagnosticData.elongationDeg}°</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Tithi Formula:</span>
                      <span className="font-bold">floor((Elong mod 180) / 12) + 1</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 font-sans">Karana Formula:</span>
                      <span className="font-bold">floor(Elong / 6) mod 11</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Historical Test Suite Results */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100">
                    Ephemeris Benchmark Test Results (1900 - 2125+)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Validated against standard Nirayana ephemeris for key historical transition days.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-600">
                    {suiteResult.passCount}/{suiteResult.totalTests}
                  </span>
                  <span className="block text-[11px] text-stone-400">Tests Passing</span>
                </div>
              </div>

              <div className="space-y-2">
                {suiteResult.report.map((log, idx) => {
                  const isPass = log.startsWith('[PASS]');
                  return (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                        isPass 
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'
                      }`}
                    >
                      {isPass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1">{log}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer with easy close button */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {currentLang === 'kn' ? 'ಖಗೋಳ ಗಣಿತ: ಲಾಹಿರಿ ಅಯನಾಂಶ (ಚಿತ್ರಾಪಕ್ಷ)' : 'Astronomical Basis: Lahiri Nirayana (Chitra Paksha)'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          >
            {currentLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Close Diagnostic'}
          </button>
        </div>

      </div>
    </div>
  );
};
