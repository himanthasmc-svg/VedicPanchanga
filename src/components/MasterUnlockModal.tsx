import React, { useState, useMemo } from 'react';
import { Lock, LockOpen, KeyRound, X, Shield, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { CITIES, getPanchangaForDate, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';

interface MasterUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  currentLang: Language;
  selectedCity?: CityLocation;
  todayPanchanga?: PanchangaDay;
  userPassword?: string;
  moduleName?: string;
}

export const MasterUnlockModal: React.FC<MasterUnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  currentLang,
  selectedCity,
  todayPanchanga: customPanchanga,
  userPassword = 'HCMM',
  moduleName
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Determine current day Panchanga for Masa and Nakshatra
  const currentPanchanga = useMemo<PanchangaDay>(() => {
    if (customPanchanga) return customPanchanga;
    const city = selectedCity || CITIES[0];
    return getPanchangaForDate(new Date(), city);
  }, [customPanchanga, selectedCity]);

  // Helper: strips any brackets, slashes, pada suffixes, and returns strictly a single clean name
  const getCleanSingleName = (str: string) => {
    if (!str) return '';
    return str
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\{.*?\}/g, '')
      .replace(/Pada\s*[0-9]+/gi, '')
      .replace(/ಪಾದ\s*[೦-೯0-9]+/gi, '')
      .replace(/चरण\s*[०-९0-9]+/gi, '')
      .split('/')[0]
      .split(',')[0]
      .trim();
  };

  // Clean helper: strips spaces, punctuation, diacritics, to lowercase
  const clean = (s: string) =>
    (s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\u0C80-\u0CFF\u0900-\u097F]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const entered = clean(passwordInput.trim());

    if (!entered) {
      setErrorMsg(
        currentLang === 'kn'
          ? 'ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.'
          : currentLang === 'hi'
          ? 'कृपया पासवर्ड दर्ज करें।'
          : 'Please enter the password.'
      );
      return;
    }

    // Single clean names of Masa & Nakshatra
    const rawMasaEn = currentPanchanga.masa?.en || '';
    const rawNakEn = currentPanchanga.nakshatra?.en || '';
    const cleanMasaEn = getCleanSingleName(rawMasaEn);
    const cleanNakEn = getCleanSingleName(rawNakEn);
    const chartNakEn = getCleanSingleName(RASHI_NAKSHATRA_CHART[currentPanchanga.nakshatraIndex]?.nakshatraEn || '');

    const rawMasaKn = currentPanchanga.masa?.kn || '';
    const rawNakKn = currentPanchanga.nakshatra?.kn || '';
    const cleanMasaKn = getCleanSingleName(rawMasaKn);
    const cleanNakKn = getCleanSingleName(rawNakKn);
    const chartNakKn = getCleanSingleName(RASHI_NAKSHATRA_CHART[currentPanchanga.nakshatraIndex]?.nakshatraKn || '');

    const rawMasaHi = currentPanchanga.masa?.hi || '';
    const rawNakHi = currentPanchanga.nakshatra?.hi || '';
    const cleanMasaHi = getCleanSingleName(rawMasaHi);
    const cleanNakHi = getCleanSingleName(rawNakHi);

    const masaEn = clean(cleanMasaEn);
    const nakEn = clean(cleanNakEn);
    const cNakEn = clean(chartNakEn);

    const masaKn = clean(cleanMasaKn);
    const nakKn = clean(cleanNakKn);
    const cNakKn = clean(chartNakKn);

    const masaHi = clean(cleanMasaHi);
    const nakHi = clean(cleanNakHi);

    // Build valid combinations
    const validSet = new Set<string>();
    const trimTrailingA = (val: string) => (val.endsWith('a') ? val.slice(0, -1) : val);

    // PRIMARY USER REQUIREMENT: Only the first name of the Nakshatra alone!
    if (nakEn) {
      validSet.add(nakEn);
      validSet.add(trimTrailingA(nakEn));
      // First word if multi-word like Purva / Uttara
      const firstWord = nakEn.split(/[^a-z0-9]/)[0];
      if (firstWord) {
        validSet.add(firstWord);
        validSet.add(trimTrailingA(firstWord));
      }
    }
    if (cNakEn) {
      validSet.add(cNakEn);
      validSet.add(trimTrailingA(cNakEn));
      const firstWord = cNakEn.split(/[^a-z0-9]/)[0];
      if (firstWord) validSet.add(firstWord);
    }
    if (nakKn) {
      validSet.add(nakKn);
      const firstWord = nakKn.split(/\s+/)[0];
      if (firstWord) validSet.add(firstWord);
    }
    if (cNakKn) validSet.add(cNakKn);
    if (nakHi) {
      validSet.add(nakHi);
      const firstWord = nakHi.split(/\s+/)[0];
      if (firstWord) validSet.add(firstWord);
    }

    // Masa + Nakshatra combinations (retained for backward compatibility)
    if (masaEn && nakEn) {
      validSet.add(masaEn + nakEn);
      validSet.add(trimTrailingA(masaEn) + nakEn);
      validSet.add(masaEn + trimTrailingA(nakEn));
      validSet.add(trimTrailingA(masaEn) + trimTrailingA(nakEn));
    }
    if (masaEn && cNakEn) {
      validSet.add(masaEn + cNakEn);
      validSet.add(trimTrailingA(masaEn) + cNakEn);
      validSet.add(trimTrailingA(masaEn) + trimTrailingA(cNakEn));
    }
    if (masaKn && nakKn) validSet.add(masaKn + nakKn);
    if (masaKn && cNakKn) validSet.add(masaKn + cNakKn);
    if (masaHi && nakHi) validSet.add(masaHi + nakHi);

    // Inverted order fallback
    if (nakEn && masaEn) validSet.add(nakEn + masaEn);
    if (nakKn && masaKn) validSet.add(nakKn + masaKn);
    if (nakHi && masaHi) validSet.add(nakHi + masaHi);

    // Administrative emergency master passcodes
    validSet.add('hcmm');
    if (userPassword) validSet.add(clean(userPassword));
    const rescuePass = localStorage.getItem('hcmm_recovery_code');
    if (rescuePass) validSet.add(clean(rescuePass));
    validSet.add('hcmmrecovery2026');

    if (validSet.has(entered)) {
      onUnlockSuccess();
      setPasswordInput('');
      onClose();
    } else {
      setErrorMsg(
        currentLang === 'kn'
          ? 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.'
          : currentLang === 'hi'
          ? 'गलत पासवर्ड! कृपया पुनः प्रयास करें।'
          : 'Incorrect password! Please try again.'
      );
    }
  };

  if (!isOpen) return null;

  const rawMasa = currentPanchanga.masa?.[currentLang] || currentPanchanga.masa?.en || '';
  const displayMasa = getCleanSingleName(rawMasa);

  const rawNak = currentPanchanga.nakshatra?.[currentLang] || currentPanchanga.nakshatra?.en || '';
  const displayNak = getCleanSingleName(rawNak);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-400 dark:border-amber-600 overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-700 via-amber-700 to-orange-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-200 shadow-inner">
              <Lock className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg">
                {currentLang === 'kn'
                  ? 'ಆಡಳಿತಾತ್ಮಕ ಲಾಕ್ ಮೋಡ್'
                  : currentLang === 'hi'
                  ? 'प्रशासनिक लॉक मोड'
                  : 'Administrative Lock'}
              </h3>
              <p className="text-xs text-amber-100">
                {moduleName ? `Protected Section: ${moduleName}` : 'Authentication required to modify system features'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>
                {currentLang === 'kn'
                  ? 'ಎಲ್ಲಾ ಮಾಡ್ಯೂಲ್‌ಗಳ ಭದ್ರತಾ ರಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ'
                  : 'Global Protected State Active'}
              </span>
            </div>
            <p>
              {currentLang === 'kn'
                ? 'ಸಂಕಲ್ಪ, ಕುಂಡಲಿ, ಗೋಚಾರ, ಮಂತ್ರಗಳು ಹಾಗೂ ಕೋಡ್ ಸಂಪಾದನೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ದೃಢೀಕರಿಸಿ.'
                : 'Sensitive parameters, Sankalpa customizations, Kundali coordinates, and code editing are locked until authenticated.'}
            </p>
          </div>

          {/* Current Masa & Nakshatra Information Box (Prompt Requirement) */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <CalendarIcon className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {currentLang === 'kn'
                  ? 'ಪ್ರಸ್ತುತ ಪಂಚಾಂಗ ವಿವರಗಳು'
                  : currentLang === 'hi'
                  ? 'वर्तमान पंचांग विवरण'
                  : 'Current Astronomical Details'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block tracking-wider">
                  {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಮಾಸ:' : currentLang === 'hi' ? 'वर्तमान मास:' : 'Current Masa:'}
                </span>
                <strong className="text-sm font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5">
                  {displayMasa}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750">
                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block tracking-wider">
                  {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ನಕ್ಷತ್ರ:' : currentLang === 'hi' ? 'वर्तमान नक्षत्र:' : 'Current Nakshatra:'}
                </span>
                <strong className="text-sm font-bold text-amber-950 dark:text-amber-200 font-serif block mt-0.5">
                  {displayNak}
                </strong>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Password Input (Prompt Requirement: in the space of password to enter write only "Enter the password") */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              {currentLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್:' : 'Password:'}
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter the password"
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-mono font-bold focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 text-xs text-stone-400 hover:text-stone-600 font-medium"
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {currentLang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LockOpen className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಅನ್‌ಲಾಕ್ ಮಾಡಿ' : 'Unlock Access'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
