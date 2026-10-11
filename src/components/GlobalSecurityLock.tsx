import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, Shield, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface GlobalSecurityLockProps {
  currentLang: Language;
  isLocked: boolean;
  onUnlock: () => void;
  onSetPassword: (newPass: string) => void;
  currentPasswordHash: string;
}

export const GlobalSecurityLock: React.FC<GlobalSecurityLockProps> = ({
  currentLang,
  isLocked,
  onUnlock,
  onSetPassword,
  currentPasswordHash
}) => {
  const [inputPass, setInputPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const entered = inputPass.trim();
    // Default password is HCMM if not explicitly set
    const valid = entered.toUpperCase() === currentPasswordHash.toUpperCase();

    if (valid) {
      setInputPass('');
      onUnlock();
    } else {
      setErrorMessage(
        currentLang === 'kn' 
          ? 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್! ದಯವಿಟ್ಟು ಸರಿಯಾದ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ (Default: HCMM).' 
          : currentLang === 'hi'
          ? 'गलत पासवर्ड! कृपया सही पासवर्ड दर्ज करें (Default: HCMM)।'
          : 'Incorrect password! Please enter the correct password (Default: HCMM).'
      );
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setChangeSuccess('');

    if (oldPass.trim().toUpperCase() !== currentPasswordHash.toUpperCase()) {
      setErrorMessage(
        currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.' : 'Current password is incorrect.'
      );
      return;
    }

    if (newPass.length < 3) {
      setErrorMessage(
        currentLang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ ೩ ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.' : 'New password must be at least 3 characters.'
      );
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMessage(
        currentLang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : 'New passwords do not match.'
      );
      return;
    }

    onSetPassword(newPass.trim());
    setChangeSuccess(
      currentLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಗಿದೆ!' : 'Password updated successfully!'
    );
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => {
      setIsChangingPass(false);
      setChangeSuccess('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-500/40 dark:border-amber-700/60 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Glow & Vedic Background Motif */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HCMM Vedic Privacy Security</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            {currentLang === 'kn' ? 'ವೈದಿಕ ಪಂಚಾಂಗ ಸುರಕ್ಷತಾ ಲಾಕ್' : currentLang === 'hi' ? 'वैदिक पंचांग सुरक्षा लॉक' : 'Application Security Lock'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xs">
            {currentLang === 'kn' 
              ? 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ಮಾರ್ಪಡಿಸಲು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' 
              : currentLang === 'hi'
              ? 'विवरण देखने एवं संशोधन हेतु पासवर्ड दर्ज करें।'
              : 'Enter password to access your horoscope, sankalpa, and panchanga details.'}
          </p>
        </div>

        {/* Error / Success Notices */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{changeSuccess}</span>
          </div>
        )}

        {!isChangingPass ? (
          /* Main Unlock Form */
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {currentLang === 'kn' ? 'ರಹಸ್ಯ ಪಾಸ್‌ವರ್ಡ್ (Security Password)' : currentLang === 'hi' ? 'सुरक्षा पासवर्ड (Security Password)' : 'Security Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder={currentLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ (Default: HCMM)' : 'Enter password (Default: HCMM)'}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Unlock className="w-4 h-4" />
              <span>{currentLang === 'kn' ? 'ಅನ್‌ಲಾಕ್ ಮಾಡಿ (Unlock App)' : currentLang === 'hi' ? 'अनलॉक करें (Unlock)' : 'Unlock Application'}</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-stone-400 dark:text-stone-500">
                Hint: <strong className="text-amber-600 dark:text-amber-400">HCMM</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setIsChangingPass(true);
                }}
                className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                {currentLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ' : currentLang === 'hi' ? 'पासवर्ड बदलें' : 'Change Password'}
              </button>
            </div>
          </form>
        ) : (
          /* Change Password Form */
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್' : 'Current Password'}
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {currentLang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್' : 'New Password'}
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password (min 3 chars)"
                className="w-full px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {currentLang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-sm font-mono"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                {currentLang === 'kn' ? 'ಉಳಿಸಿ' : 'Save New Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setIsChangingPass(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs"
              >
                {currentLang === 'kn' ? 'ರದ್ದು' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
