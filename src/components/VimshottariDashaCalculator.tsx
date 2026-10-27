import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  User,
  MapPin,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Flame,
  Activity,
  Layers,
  Heart,
  Briefcase,
  Gem,
  BookOpen,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Edit3,
  Search,
  ExternalLink,
  Info,
  Award,
  Sun,
  Moon,
  Compass,
  FileDown,
  Download,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Language, LocalizedString } from '../types';
import {
  calculateVimshottariDasha,
  VimshottariDashaResult,
  DASHA_LORDS,
  DashaLordInfo,
  MahadashaPeriod,
  AntardashaPeriod,
  PratyantardashaPeriod
} from '../utils/vimshottariDasha';
import {
  getUserProfile,
  saveUserProfile,
  computeProfileAstrology,
  UserProfile,
  SAMPLE_PROFILES
} from '../utils/userProfile';
import { CITIES } from '../utils/panchanga';
import { SvgGrahaIcon } from './RealisticGraha';

interface VimshottariDashaCalculatorProps {
  currentLang: Language;
  onBackToCalendar?: () => void;
  onNavigateToKundali?: () => void;
}

export const VimshottariDashaCalculator: React.FC<VimshottariDashaCalculatorProps> = ({
  currentLang,
  onBackToCalendar,
  onNavigateToKundali
}) => {
  // Current user profile state
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());

  // Listen to profile updates from elsewhere
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setProfile(e.detail);
      }
    };
    window.addEventListener('hcmm_user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('hcmm_user_profile_updated', handleProfileUpdate);
    };
  }, []);

  // Modal / Drawer state for editing birth details
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(profile.name);
  const [editDate, setEditDate] = useState<string>(profile.birthDate);
  const [editTime, setEditTime] = useState<string>(profile.birthTime);
  const [editCity, setEditCity] = useState<string>(profile.birthPlace);
  const [editSavedSuccess, setEditSavedSuccess] = useState<boolean>(false);

  // Target query date for Dasha calculations (defaults to today)
  const [queryDateStr, setQueryDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [isCustomDateActive, setIsCustomDateActive] = useState<boolean>(false);

  // Expanded Mahadasha and Antardasha indexes in the 120-year explorer
  const [expandedMahaIndex, setExpandedMahaIndex] = useState<number | null>(null);
  const [expandedAntarKey, setExpandedAntarKey] = useState<string | null>(null);

  // Copied alert state
  const [copiedText, setCopiedText] = useState<boolean>(false);
  // PDF Exporting progress state
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Sync edit form with profile changes
  useEffect(() => {
    setEditName(profile.name);
    setEditDate(profile.birthDate);
    setEditTime(profile.birthTime);
    setEditCity(profile.birthPlace);
  }, [profile]);

  // Compute astrological details for the profile
  const astroSummary = useMemo(() => {
    return computeProfileAstrology(profile);
  }, [profile]);

  // Compute full 120-year Vimshottari Dasha with Pratyantardashas
  const dashaResult: VimshottariDashaResult = useMemo(() => {
    const targetDate = isCustomDateActive ? new Date(queryDateStr + 'T12:00:00') : new Date();
    return calculateVimshottariDasha(
      astroSummary.birthDateObj,
      astroSummary.moonLongitude,
      targetDate
    );
  }, [astroSummary, queryDateStr, isCustomDateActive]);

  // Set the default expanded Mahadasha to the currently active one
  useEffect(() => {
    if (dashaResult.mahadashas.length > 0) {
      const activeIdx = dashaResult.mahadashas.findIndex(m => m.isCurrent);
      if (activeIdx !== -1) {
        setExpandedMahaIndex(activeIdx);
        const activeAntarIdx = dashaResult.mahadashas[activeIdx].antardashas.findIndex(a => a.isCurrent);
        if (activeAntarIdx !== -1) {
          setExpandedAntarKey(`${activeIdx}-${activeAntarIdx}`);
        }
      }
    }
  }, [dashaResult]);

  // Save edited profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCity = CITIES.find(c => c.name.toLowerCase() === editCity.toLowerCase()) || CITIES[0];
    const updated: UserProfile = {
      ...profile,
      name: editName.trim() || 'Devotee',
      birthDate: editDate,
      birthTime: editTime,
      birthPlace: matchedCity.name,
      latitude: matchedCity.lat,
      longitude: matchedCity.lng,
      timezone: matchedCity.timezone,
      moonLongitude: undefined // Force recalculation based on new birth parameters
    };
    saveUserProfile(updated);
    setProfile(updated);
    setEditSavedSuccess(true);
    setTimeout(() => {
      setEditSavedSuccess(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  // Quick preset profile switch
  const handleSelectPreset = (preset: typeof SAMPLE_PROFILES[0]) => {
    saveUserProfile(preset.profile);
    setProfile(preset.profile);
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const summary = `
🔱 VIMSHOTTARI DASHA SUMMARY
👤 Name: ${profile.name}
📅 DOB: ${profile.birthDate} ${profile.birthTime} (${profile.birthPlace})
✨ Janma Nakshatra: ${astroSummary.nakshatraName[currentLang]}
🌙 Moon Sign: ${astroSummary.rashiName[currentLang]} (Lord: ${astroSummary.rashiLord[currentLang]})

🌌 ACTIVE DASHA PERIOD (Today: ${formatDate(new Date())}):
1️⃣ Maha Dasha: ${dashaResult.currentMahadasha.lord.sanskrit[currentLang]} (${dashaResult.currentMahadasha.durationYears} Years)
   📅 ${formatDate(dashaResult.currentMahadasha.startDate)} — ${formatDate(dashaResult.currentMahadasha.endDate)}
   ⏳ Progress: ${dashaResult.progress.mahadashaPercent}% (${dashaResult.progress.mahadashaDaysRemaining} days remaining)

2️⃣ Antardasha (Bhukti): ${dashaResult.currentAntardasha.lord.sanskrit[currentLang]} (${dashaResult.currentAntardasha.durationMonths} Months)
   📅 ${formatDate(dashaResult.currentAntardasha.startDate)} — ${formatDate(dashaResult.currentAntardasha.endDate)}
   ⏳ Progress: ${dashaResult.progress.antardashaPercent}% (${dashaResult.progress.antardashaDaysRemaining} days remaining)

3️⃣ Pratyantardasha: ${dashaResult.currentPratyantardasha.lord.sanskrit[currentLang]} (${dashaResult.currentPratyantardasha.durationDays} Days)
   📅 ${formatDate(dashaResult.currentPratyantardasha.startDate)} — ${formatDate(dashaResult.currentPratyantardasha.endDate)}
   ⏳ Progress: ${dashaResult.progress.pratyantardashaPercent}% (${dashaResult.progress.pratyantardashaDaysRemaining} days remaining)

💎 Prescribed Gemstone: ${dashaResult.currentPratyantardasha.lord.gemstone[currentLang]}
🕉️ Beeja Mantra: ${dashaResult.currentPratyantardasha.lord.mantra[currentLang]}
🙏 Auspicious Deity: ${dashaResult.currentPratyantardasha.lord.deity[currentLang]}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  // Dedicated PDF Export using jsPDF & html2canvas with print styles fallback
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const element = document.getElementById('printable-dasha-report');
      if (!element) {
        window.print();
        return;
      }

      // Capture element with high pixel ratio for print sharpness
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanName = profile.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Devotee';
      const cleanDate = isCustomDateActive ? queryDateStr : new Date().toISOString().split('T')[0];
      pdf.save(`HCMM_Vimshottari_Dasha_${cleanName}_${cleanDate}.pdf`);
    } catch (err) {
      console.error('PDF export error, falling back to window.print():', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const currentMaha = dashaResult.currentMahadasha;
  const currentAntar = dashaResult.currentAntardasha;
  const currentPrat = dashaResult.currentPratyantardasha;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* Top Banner & Header */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Clock className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-200 text-xs font-semibold mb-2 border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>120-Year Parashara Vimshottari System • ೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ಗಣಿತ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಗಣಕ' : currentLang === 'hi' ? 'विंशोत्तरी दशा कैलकुलेटर' : 'Vimshottari Dasha Calculator'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mt-1">
              {currentLang === 'kn'
                ? 'ಬಳಕೆದಾರರ ಜನ್ಮ ಪ್ರೊಫೈಲ್ ಆಧರಿಸಿ ಪ್ರಸ್ತುತ ಮಹಾದಶಾ, ಅಂತರ್ದಶಾ (ಭುಕ್ತಿ) ಮತ್ತು ಪ್ರತ್ಯಂತರ್ದಶಾ ನಿಖರ ಗಣಿತ.'
                : currentLang === 'hi'
                ? 'उपयोगकर्ता जन्म विवरण के आधार पर वर्तमान महादशा, अन्तर्दशा (भुक्ति) एवं प्रत्यन्तर्दशा की सटीक गणना।'
                : 'Accurate Vedic astrological timing calculating current Maha Dasha, Antardasha (Bhukti), and Pratyantardasha from your stored birth profile.'}
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-all border border-amber-300/40 shadow-sm cursor-pointer disabled:opacity-50"
              title="Download PDF Dasha Report"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-amber-200" />
              )}
              <span>
                {isExportingPdf
                  ? (currentLang === 'kn' ? 'ಸಿದ್ಧವಾಗುತ್ತಿದೆ...' : currentLang === 'hi' ? 'तैयार हो रहा है...' : 'Generating...')
                  : (currentLang === 'kn' ? 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್' : currentLang === 'hi' ? 'पीडीएफ डाउनलोड' : 'Download PDF')}
              </span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/20 shadow-sm cursor-pointer"
              title="Copy Dasha Summary"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? (currentLang === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (currentLang === 'kn' ? 'ದಶಾ ಸಾರಾಂಶ ನಕಲಿಸಿ' : 'Copy Summary')}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/20 shadow-sm cursor-pointer"
              title="Print Dasha Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಮುದ್ರಿಸಿ' : currentLang === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>

            {onBackToCalendar && (
              <button
                onClick={onBackToCalendar}
                className="px-3.5 py-2 rounded-xl bg-black/25 hover:bg-black/35 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್' : 'Calendar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Container for Printable & PDF Export Report */}
      <div id="printable-dasha-report" className="space-y-6 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 p-2 sm:p-4 rounded-3xl">
        
        {/* Printable Document Header (Appears in Print & Downloaded PDF) */}
        <div className="print-only p-4 mb-4 border-b-2 border-stone-800 text-center space-y-1 bg-white text-stone-900">
          <div className="text-xs font-bold tracking-widest text-stone-600">
            || ಶ್ರೀ ಹರಿ ಸರ್ವೋತ್ತಮ • ಶ್ರೀ ವಾಯು ಜೀವೋತ್ತಮ ||
          </div>
          <h1 className="text-2xl font-black tracking-tight text-stone-950 font-serif">
            HERAMBHA CHITRABHANU MAHA MARUTHI PANCHANGA
          </h1>
          <h2 className="text-base font-extrabold text-amber-900">
            {currentLang === 'kn'
              ? 'ಪರಾಶರ ವಿಂಶೋತ್ತರಿ ದಶಾ ಸಾರಾಂಶ ಮತ್ತು ಜಾತಕ ವರದಿ (೧೨೦ ವರ್ಷಗಳ ಗಣಿತ)'
              : currentLang === 'hi'
              ? 'पाराशर विंशोत्तरी दशा सारांश एवं जन्म कुण्डली रिपोर्ट (१२० वर्षीय चक्र)'
              : 'Parashara Vimshottari Dasha Astrological Report (120-Year Cycle)'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-300 text-xs text-left">
            <div><strong>Devotee / ಜಾತಕರು:</strong> {profile.name}</div>
            <div><strong>DOB / ಜನ್ಮ ದಿನಾಂಕ:</strong> {profile.birthDate} ({profile.birthTime})</div>
            <div><strong>POB / ಜನ್ಮ ಸ್ಥಳ:</strong> {profile.birthPlace}</div>
            <div><strong>Evaluated / ಪರಿಶೀಲನೆ:</strong> {formatDate(isCustomDateActive ? new Date(queryDateStr) : new Date())}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-200 text-xs text-left">
            <div><strong>Janma Nakshatra:</strong> {astroSummary.nakshatraName[currentLang]}</div>
            <div><strong>Moon Sign (Rashi):</strong> {astroSummary.rashiName[currentLang]}</div>
            <div><strong>Rashi Lord:</strong> {astroSummary.rashiLord[currentLang]}</div>
            <div><strong>Moon Longitude:</strong> {astroSummary.moonLongitude.toFixed(2)}°</div>
          </div>
        </div>

        {/* User Profile Bar & Quick Switcher */}
        <div className="rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  {profile.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {currentLang === 'kn' ? 'ಸಕ್ರಿಯ ಜನ್ಮ ಪ್ರೊಫೈಲ್' : 'Active Birth Profile'}
                </span>
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <strong>DOB:</strong> {profile.birthDate} ({profile.birthTime})
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <strong>POB:</strong> {profile.birthPlace}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <strong>Nakshatra:</strong> {astroSummary.nakshatraName[currentLang]}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-amber-600" />
                  <strong>Moon Sign:</strong> {astroSummary.rashiName[currentLang]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
            {/* Quick Sample Profile Selector */}
            <select
              value={profile.name}
              onChange={(e) => {
                const found = SAMPLE_PROFILES.find(p => p.profile.name === e.target.value);
                if (found) handleSelectPreset(found);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold cursor-pointer"
              title="Quick sample profiles"
            >
              <option value="" disabled>Load Preset Profile...</option>
              {SAMPLE_PROFILES.map(p => (
                <option key={p.id} value={p.profile.name}>
                  {p.label[currentLang]}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಪ್ರೊಫೈಲ್ ತಿದ್ದುಪಡಿ' : currentLang === 'hi' ? 'प्रोफ़ाइल सम्पादन' : 'Edit Birth Details'}</span>
            </button>
          </div>
        </div>

        {/* Inline Profile Editor */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                {currentLang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                {currentLang === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (YYYY-MM-DD)' : 'Date of Birth (YYYY-MM-DD)'}
              </label>
              <input
                type="date"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                {currentLang === 'kn' ? 'ಜನ್ಮ ಸಮಯ (HH:MM)' : 'Time of Birth (HH:MM)'}
              </label>
              <input
                type="time"
                value={editTime}
                onChange={e => setEditTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                {currentLang === 'kn' ? 'ಜನ್ಮ ಸ್ಥಳ (ನಗರ)' : 'Place of Birth (City)'}
              </label>
              <select
                value={editCity}
                onChange={e => setEditCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer"
              >
                {currentLang === 'kn' ? 'ರದ್ದುಗೊಳಿಸಿ' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {editSavedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <SaveIcon className="w-3.5 h-3.5" />}
                <span>{editSavedSuccess ? (currentLang === 'kn' ? 'ಉಳಿಸಲಾಗಿದೆ!' : 'Saved!') : (currentLang === 'kn' ? 'ಉಳಿಸಿ ಮತ್ತು ಲೆಕ್ಕಿಸಿ' : 'Save & Recalculate')}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Date Query Controller (Allows user to inspect Dasha on any past/future milestone date) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/80 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
            {currentLang === 'kn' ? 'ದಶಾ ಪರಿಶೀಲನಾ ದಿನಾಂಕ:' : currentLang === 'hi' ? 'दशा निरीक्षण दिनांक:' : 'Viewing Active Dasha for Date:'}
          </span>
          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
            {formatDate(isCustomDateActive ? new Date(queryDateStr) : new Date())}
          </span>
          {!isCustomDateActive && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              {currentLang === 'kn' ? 'ಇಂದಿನ ಸಕ್ರಿಯ ದಶಾ' : 'Today (Real-time)'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={queryDateStr}
            onChange={(e) => {
              setQueryDateStr(e.target.value);
              setIsCustomDateActive(true);
            }}
            className="px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 font-medium"
            title="Choose any milestone date to check Dasha"
          />
          {isCustomDateActive && (
            <button
              onClick={() => {
                setQueryDateStr(new Date().toISOString().split('T')[0]);
                setIsCustomDateActive(false);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{currentLang === 'kn' ? 'ಇಂದಿಗೆ ಮರಳು' : 'Reset to Today'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL-TIME DASHA & ANTARDASHA COMPLETION PROGRESS BAR SECTION */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-stone-850 border-2 border-amber-300/80 dark:border-stone-700 p-5 sm:p-6 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  {currentLang === 'kn'
                    ? 'ಪ್ರಸ್ತುತ ಮಹಾದಶಾ & ಅಂತರ್ದಶಾ ಪ್ರಗತಿ ಸ್ಥಿತಿ (ಶೇಕಡಾವಾರು ಪೂರ್ಣತೆ)'
                    : currentLang === 'hi'
                    ? 'वर्तमान महादशा एवं अन्तर्दशा प्रगति स्थिति (प्रतिशत पूर्णता)'
                    : 'Current Dasha & Antardasha Real-time Completion Progress'}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentLang === 'kn' ? 'ನಿಖರ ಗಣಿತ' : 'Active Cycle'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {currentLang === 'kn'
                  ? `ದಿನಾಂಕ ${formatDate(isCustomDateActive ? new Date(queryDateStr) : new Date())} ಕ್ಕೆ ಒಟ್ಟು ಅವಧಿಯ ಶೇಕಡಾವಾರು ಪೂರ್ಣತೆ (ಪರಾಶರ ಪದ್ಧತಿ).`
                  : currentLang === 'hi'
                  ? `दिनांक ${formatDate(isCustomDateActive ? new Date(queryDateStr) : new Date())} अनुसार कुल अवधि की प्रतिशत पूर्णता (पाराशर पद्धति)।`
                  : `Percentage completion calculated against current date (${formatDate(isCustomDateActive ? new Date(queryDateStr) : new Date())}).`}
              </p>
            </div>
          </div>

          <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300/80 dark:border-stone-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              title="Download PDF Dasha Report"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentLang === 'kn' ? 'ವರದಿ ಡೌನ್‌ಲೋಡ್' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Progress Grid: Mahadasha vs Antardasha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mahadasha Progress Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50/70 via-stone-50/50 to-amber-50/30 dark:from-stone-800/60 dark:via-stone-850 dark:to-stone-800/40 p-4 sm:p-5 border border-amber-200/90 dark:border-stone-700 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-sm shrink-0"
                  style={{ backgroundColor: currentMaha.lord.color }}
                >
                  {currentMaha.lord.symbol}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
                    {currentLang === 'kn' ? 'ಪ್ರಮುಖ ದಶಾ ಅವಧಿ' : 'Major Period'}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                    {currentMaha.lord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶಾ' : 'Mahadasha'}
                  </h3>
                </div>
              </div>

              {/* Big Percentage Badge */}
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {dashaResult.progress.mahadashaPercent}%
                </span>
                <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {currentLang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="relative w-full h-5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                {/* 25%, 50%, 75% tick marks */}
                <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white/40 dark:bg-stone-900/40 z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-2/4 w-0.5 bg-white/50 dark:bg-stone-900/50 z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-white/40 dark:bg-stone-900/40 z-10 pointer-events-none" />

                {/* Filled Progress Bar with Shimmer */}
                <div
                  className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-1 shadow-sm relative overflow-hidden"
                  style={{
                    width: `${Math.min(100, Math.max(3, dashaResult.progress.mahadashaPercent))}%`,
                    backgroundColor: currentMaha.lord.color
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md shrink-0 ring-1 ring-black/20" />
                </div>
              </div>

              {/* Milestones beneath progress bar */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="font-mono text-stone-400">0%</span>
                  <span>{formatDate(currentMaha.startDate)}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold">
                  {currentMaha.durationYears} {currentLang === 'kn' ? 'ವರ್ಷಗಳ ಅವಧಿ' : 'Years Total'}
                </span>
                <span className="flex items-center gap-1">
                  <span>{formatDate(currentMaha.endDate)}</span>
                  <span className="font-mono text-stone-400">100%</span>
                </span>
              </div>
            </div>

            {/* Days Elapsed vs Remaining Stats */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700">
                <span className="text-[10px] font-bold text-stone-500 block">
                  {currentLang === 'kn' ? 'ಕಳೆದ ದಿನಗಳು' : 'Elapsed Time:'}
                </span>
                <span className="font-black text-stone-900 dark:text-stone-100 text-sm">
                  {dashaResult.progress.mahadashaDaysElapsed.toLocaleString()} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  ≈ {(dashaResult.progress.mahadashaDaysElapsed / 365.25).toFixed(1)} {currentLang === 'kn' ? 'ವರ್ಷಗಳು' : 'years'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                  {currentLang === 'kn' ? 'ಬಾಕಿ ಉಳಿದಿರುವ ಅವಧಿ' : 'Remaining Time:'}
                </span>
                <span className="font-black text-amber-700 dark:text-amber-300 text-sm">
                  {dashaResult.progress.mahadashaDaysRemaining.toLocaleString()} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </span>
                <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block mt-0.5">
                  ≈ {(dashaResult.progress.mahadashaDaysRemaining / 365.25).toFixed(1)} {currentLang === 'kn' ? 'ವರ್ಷಗಳು ಬಾಕಿ' : 'years left'}
                </span>
              </div>
            </div>
          </div>

          {/* Antardasha (Bhukti) Progress Card */}
          <div className="rounded-2xl bg-gradient-to-br from-orange-50/70 via-stone-50/50 to-orange-50/30 dark:from-stone-800/60 dark:via-stone-850 dark:to-stone-800/40 p-4 sm:p-5 border border-orange-200/90 dark:border-stone-700 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-sm shrink-0"
                  style={{ backgroundColor: currentAntar.lord.color }}
                >
                  {currentAntar.lord.symbol}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-orange-700 dark:text-orange-400">
                    {currentLang === 'kn' ? 'ಉಪಾವಧಿ (ಭುಕ್ತಿ)' : 'Sub-Period (Bhukti)'}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                    {currentAntar.lord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಅಂತರ್ದಶಾ' : 'Antardasha'}
                  </h3>
                </div>
              </div>

              {/* Big Percentage Badge */}
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  {dashaResult.progress.antardashaPercent}%
                </span>
                <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {currentLang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="relative w-full h-5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden p-0.5 shadow-inner">
                {/* 25%, 50%, 75% tick marks */}
                <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white/40 dark:bg-stone-900/40 z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-2/4 w-0.5 bg-white/50 dark:bg-stone-900/50 z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-white/40 dark:bg-stone-900/40 z-10 pointer-events-none" />

                {/* Filled Progress Bar */}
                <div
                  className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-1 shadow-sm relative overflow-hidden"
                  style={{
                    width: `${Math.min(100, Math.max(3, dashaResult.progress.antardashaPercent))}%`,
                    backgroundColor: currentAntar.lord.color
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md shrink-0 ring-1 ring-black/20" />
                </div>
              </div>

              {/* Milestones beneath progress bar */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="font-mono text-stone-400">0%</span>
                  <span>{formatDate(currentAntar.startDate)}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 text-[10px] font-bold">
                  {currentAntar.durationMonths} {currentLang === 'kn' ? 'ತಿಂಗಳುಗಳು' : 'Months'} ({currentAntar.durationDays} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'})
                </span>
                <span className="flex items-center gap-1">
                  <span>{formatDate(currentAntar.endDate)}</span>
                  <span className="font-mono text-stone-400">100%</span>
                </span>
              </div>
            </div>

            {/* Days Elapsed vs Remaining Stats */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700">
                <span className="text-[10px] font-bold text-stone-500 block">
                  {currentLang === 'kn' ? 'ಕಳೆದ ದಿನಗಳು' : 'Elapsed Days:'}
                </span>
                <span className="font-black text-stone-900 dark:text-stone-100 text-sm">
                  {dashaResult.progress.antardashaDaysElapsed.toLocaleString()} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {currentLang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣ' : 'Elapsed in period'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700">
                <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 block">
                  {currentLang === 'kn' ? 'ಬಾಕಿ ಉಳಿದಿರುವ ದಿನಗಳು' : 'Remaining Days:'}
                </span>
                <span className="font-black text-orange-700 dark:text-orange-300 text-sm">
                  {dashaResult.progress.antardashaDaysRemaining.toLocaleString()} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </span>
                <span className="text-[10px] text-orange-600/80 dark:text-orange-400/80 block mt-0.5">
                  {currentLang === 'kn' ? 'ಮುಂದಿನ ಅಂತರ್ದಶೆವರೆಗೆ' : 'Until next sub-period'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9-Bhukti Visual Timeline Journey across current Mahadasha */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {currentLang === 'kn'
                  ? `${currentMaha.lord.sanskrit[currentLang]} ಮಹಾದಶೆಯ ೯ ಅಂತರ್ದಶೆಗಳ ಪ್ರಗತಿ ಸರಪಳಿ`
                  : currentLang === 'hi'
                  ? `${currentMaha.lord.sanskrit[currentLang]} महादशा के ९ अन्तर्दशाओं की समय-रेखा`
                  : `All 9 Antardashas of ${currentMaha.lord.name} Mahadasha (Journey Timeline)`}
              </span>
            </span>
            <span className="text-[11px] font-semibold text-stone-500">
              {currentLang === 'kn' ? 'ಹಂತ ೧ ರಿಂದ ೯' : 'Phases 1 to 9'}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
            {currentMaha.antardashas.map((antar, idx) => {
              const isPast = !antar.isCurrent && antar.endDate < (isCustomDateActive ? new Date(queryDateStr) : new Date());
              const isCurrent = antar.isCurrent;

              return (
                <div
                  key={`timeline-antar-${idx}`}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-100/90 dark:bg-orange-950/70 ring-2 ring-orange-400 shadow-sm'
                      : isPast
                      ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 opacity-70'
                  }`}
                  title={`${antar.lord.name}: ${formatDate(antar.startDate)} - ${formatDate(antar.endDate)}`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: antar.lord.color }}
                    />
                    <span className="text-[11px] font-extrabold truncate text-stone-900 dark:text-stone-100">
                      {antar.lord.sanskrit[currentLang].split(' ')[0]}
                    </span>
                  </div>

                  {isCurrent ? (
                    <div className="space-y-0.5">
                      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-black bg-orange-500 text-white">
                        {dashaResult.progress.antardashaPercent}%
                      </span>
                      <span className="block text-[8.5px] font-bold text-orange-700 dark:text-orange-300 truncate">
                        {currentLang === 'kn' ? 'ಸಕ್ರಿಯ' : 'Active'}
                      </span>
                    </div>
                  ) : isPast ? (
                    <div className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ' : 'Done'}</span>
                    </div>
                  ) : (
                    <div className="text-[8.5px] font-semibold text-stone-400">
                      {formatDate(antar.startDate).split(' ')[1] || ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section: The Active Dasha Triad (Maha Dasha, Antardasha, Pratyantardasha) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ದಶಾ ತ್ರಯ (ಮಹಾ • ಅಂತರ್ • ಪ್ರತ್ಯಂತರ್)' : currentLang === 'hi' ? 'वर्तमान सक्रिय दशा त्रयी (महा • अन्तर् • प्रत्यन्तर्)' : 'Active Dasha Triad (Maha • Antar • Pratyantar)'}</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold">
            {currentLang === 'kn' ? 'ಪರಾಶರ ಪದ್ಧತಿ' : 'Parashara Hora System'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Maha Dasha */}
          <div className="rounded-3xl bg-white dark:bg-stone-850 border-2 border-amber-300 dark:border-amber-700/60 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-[11px] font-extrabold tracking-wide uppercase border border-amber-300 dark:border-amber-700">
                  1. {currentLang === 'kn' ? 'ಮಹಾದಶಾ (ಪ್ರಮುಖ ಅವಧಿ)' : 'Maha Dasha (Major)'}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {currentMaha.durationYears} {currentLang === 'kn' ? 'ವರ್ಷಗಳು' : 'Years'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 my-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                  style={{ backgroundColor: currentMaha.lord.color }}
                >
                  {currentMaha.lord.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                    {currentMaha.lord.sanskrit[currentLang]}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    {currentMaha.lord.name} • {currentMaha.lord.rulingPlanet}
                  </p>
                </div>
              </div>

              {/* Progress and Duration */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಪ್ರಗತಿ:' : 'Progress:'} {dashaResult.progress.mahadashaPercent}%
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {dashaResult.progress.mahadashaDaysRemaining} {currentLang === 'kn' ? 'ದಿನಗಳು ಬಾಕಿ' : 'days left'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dashaResult.progress.mahadashaPercent}%`,
                      backgroundColor: currentMaha.lord.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 font-medium pt-1">
                  <span>{formatDate(currentMaha.startDate)}</span>
                  <span>{formatDate(currentMaha.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Gemstone and Mantra */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Gem className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold">{currentLang === 'kn' ? 'ರತ್ನ:' : 'Gemstone:'}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{currentMaha.lord.gemstone[currentLang]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold">{currentLang === 'kn' ? 'ಅಧಿದೇವತೆ:' : 'Deity:'}</span>
                <span className="font-medium">{currentMaha.lord.deity[currentLang]}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Antardasha (Bhukti) */}
          <div className="rounded-3xl bg-white dark:bg-stone-850 border-2 border-orange-300 dark:border-orange-700/60 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200 text-[11px] font-extrabold tracking-wide uppercase border border-orange-300 dark:border-orange-700">
                  2. {currentLang === 'kn' ? 'ಅಂತರ್ದಶಾ (ಭುಕ್ತಿ)' : 'Antardasha (Bhukti)'}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {currentAntar.durationMonths} {currentLang === 'kn' ? 'ತಿಂಗಳುಗಳು' : 'Months'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 my-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                  style={{ backgroundColor: currentAntar.lord.color }}
                >
                  {currentAntar.lord.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                    {currentAntar.lord.sanskrit[currentLang]}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    {currentAntar.lord.name} ({currentMaha.lord.name} ಉಪಾವಧಿ)
                  </p>
                </div>
              </div>

              {/* Progress and Duration */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಪ್ರಗತಿ:' : 'Progress:'} {dashaResult.progress.antardashaPercent}%
                  </span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {dashaResult.progress.antardashaDaysRemaining} {currentLang === 'kn' ? 'ದಿನಗಳು ಬಾಕಿ' : 'days left'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dashaResult.progress.antardashaPercent}%`,
                      backgroundColor: currentAntar.lord.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 font-medium pt-1">
                  <span>{formatDate(currentAntar.startDate)}</span>
                  <span>{formatDate(currentAntar.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Element and Auspicious Day */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="font-semibold">{currentLang === 'kn' ? 'ತತ್ವ:' : 'Element:'}</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{currentAntar.lord.element[currentLang]}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="font-semibold">{currentLang === 'kn' ? 'ಶುಭ ವಾರ:' : 'Day:'}</span>
                <span className="font-medium">{currentAntar.lord.auspiciousDay[currentLang]}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Pratyantardasha (Sub-Sub Period) */}
          <div className="rounded-3xl bg-white dark:bg-stone-850 border-2 border-indigo-400 dark:border-indigo-600 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between ring-2 ring-indigo-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 text-[11px] font-extrabold tracking-wide uppercase border border-indigo-300 dark:border-indigo-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  3. {currentLang === 'kn' ? 'ಪ್ರತ್ಯಂತರ್ದಶಾ (ಸೂಕ್ಷ್ಮ ಅವಧಿ)' : 'Pratyantardasha (Sub-Sub)'}
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {currentPrat.durationDays} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'Days'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 my-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0"
                  style={{ backgroundColor: currentPrat.lord.color }}
                >
                  {currentPrat.lord.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                    {currentPrat.lord.sanskrit[currentLang]}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    {currentPrat.lord.name} • {currentLang === 'kn' ? 'ವಾರದ ಪ್ರಭಾವಿ ಗ್ರಹ' : 'Immediate Weekly Governor'}
                  </p>
                </div>
              </div>

              {/* Progress and Duration */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಪ್ರಗತಿ:' : 'Progress:'} {dashaResult.progress.pratyantardashaPercent}%
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {dashaResult.progress.pratyantardashaDaysRemaining} {currentLang === 'kn' ? 'ದಿನಗಳು ಬಾಕಿ' : 'days left'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-indigo-500"
                    style={{
                      width: `${dashaResult.progress.pratyantardashaPercent}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 font-medium pt-1">
                  <span>{formatDate(currentPrat.startDate)}</span>
                  <span>{formatDate(currentPrat.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Beeja Mantra */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1.5">
              <div className="flex items-start gap-1.5 text-stone-700 dark:text-stone-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-500">{currentLang === 'kn' ? 'ಬೀಜ ಮಂತ್ರ:' : 'Mantra:'} </span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
                    {currentPrat.lord.mantra[currentLang]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cosmic Triad Interpretation & Vedic Remedies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Astrological Synthesis (2 columns) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                {currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಸಂಯೋಜನೆ ಫಲ' : 'Astrological Triad Synthesis'}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100">
                {dashaResult.triadInterpretation.headline[currentLang]}
              </h3>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-amber-50/50 dark:bg-stone-800/40 p-3.5 rounded-2xl border border-amber-200/50 dark:border-stone-700">
            {dashaResult.triadInterpretation.generalDescription[currentLang]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಉದ್ಯೋಗ ಮತ್ತು ವೃತ್ತಿ' : 'Career & Ambition'}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {dashaResult.triadInterpretation.careerAndAmbition[currentLang]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>{currentLang === 'kn' ? 'ಆರೋಗ್ಯ ಮತ್ತು ಚೈತನ್ಯ' : 'Health & Vitality'}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {dashaResult.triadInterpretation.healthAndVitality[currentLang]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{currentLang === 'kn' ? 'ಧನ ಮತ್ತು ಸಮೃದ್ಧಿ' : 'Wealth & Prosperity'}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {dashaResult.triadInterpretation.wealthAndProsperity[currentLang]}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{currentLang === 'kn' ? 'ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ' : 'Spiritual Growth'}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {dashaResult.triadInterpretation.spiritualGrowth[currentLang]}
              </p>
            </div>
          </div>
        </div>

        {/* Prescribed Vedic Remedies Card (1 column) */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:bg-stone-850 border border-amber-300 dark:border-amber-700/60 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಪರಾಶರ ಶಾಂತಿ ಉಪಾಯಗಳು' : currentLang === 'hi' ? 'वैदिक शान्ति उपाय' : 'Vedic Dasha Remedies'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              {currentLang === 'kn'
                ? 'ಪ್ರಸ್ತುತ ಪ್ರತ್ಯಂತರ್ದಶಾ ದೋಷ ನಿವಾರಣೆ ಮತ್ತು ಶುಭ ಫಲ ವೃದ್ಧಿಗಾಗಿ ಉಪಾಯಗಳು.'
                : 'Remedies to harmonize current planetary energies and enhance auspicious blessings.'}
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  {currentLang === 'kn' ? 'ದೈನಂದಿನ ಜಪ ಮಂತ್ರ' : 'Daily Japa Mantra'}
                </span>
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 font-mono">
                  {currentPrat.lord.mantra[currentLang]}
                </p>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  {currentLang === 'kn' ? 'ಪ್ರತಿದಿನ ೧೦೮ ಬಾರಿ ಅಥವಾ ೨೮ ಬಾರಿ ಜಪಿಸಿ' : 'Chant 108 or 28 times daily in the morning'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  {currentLang === 'kn' ? 'ಪ್ರಶಸ್ತ ದಾನ (ಚಾರಿಟಿ)' : 'Recommended Daana (Charity)'}
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300">
                  {currentPrat.lord.charityDaana[currentLang]}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  {currentLang === 'kn' ? 'ಉಪವಾಸ / ವ್ರತ ದಿನ' : 'Auspicious Fasting Day'}
                </span>
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {currentPrat.lord.auspiciousDay[currentLang]}
                </p>
              </div>
            </div>
          </div>

          {onNavigateToKundali && (
            <button
              onClick={onNavigateToKundali}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ಲಗ್ನ ಕುಂಡಲಿ ವೀಕ್ಷಿಸಿ' : 'View Full Lagna Kundali'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive 120-Year 3-Tier Dasha Explorer */}
      <div className="rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>{currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ದಶಾ ಶ್ರೇಣಿ' : currentLang === 'hi' ? 'सम्पूर्ण १२० वर्षीय विंशोत्तरी दशा कालक्रम' : 'Complete 120-Year Vimshottari Hierarchy'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentLang === 'kn'
                ? 'ಯಾವುದೇ ಮಹಾದಶೆಯನ್ನು ವಿಸ್ತರಿಸಿ ೯ ಅಂತರ್ದಶೆಗಳು ಮತ್ತು ಪ್ರತಿ ಅಂತರ್ದಶೆಯ ೯ ಪ್ರತ್ಯಂತರ್ದಶೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
                : 'Click any Mahadasha to inspect its 9 Antardashas, and any Antardasha to inspect its 9 Pratyantardashas.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ' : 'Active'}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-600 inline-block" />
              <span>{currentLang === 'kn' ? 'ಇತರ ಅವಧಿಗಳು' : 'Other Periods'}</span>
            </span>
          </div>
        </div>

        {/* Mahadasha Accordion List */}
        <div className="space-y-2.5">
          {dashaResult.mahadashas.map((maha, mIdx) => {
            const isMahaExpanded = expandedMahaIndex === mIdx;

            return (
              <div
                key={`maha-${mIdx}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  maha.isCurrent
                    ? 'border-amber-400 dark:border-amber-600 bg-amber-50/30 dark:bg-amber-950/20'
                    : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {/* Mahadasha Row Header */}
                <button
                  onClick={() => setExpandedMahaIndex(isMahaExpanded ? null : mIdx)}
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0"
                      style={{ backgroundColor: maha.lord.color }}
                    >
                      {maha.lord.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                          {maha.lord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶಾ' : 'Mahadasha'}
                        </span>
                        {maha.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase">
                            {currentLang === 'kn' ? 'ಸಕ್ರಿಯ' : 'Active'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        {formatDate(maha.startDate)} — {formatDate(maha.endDate)} ({maha.durationYears} {currentLang === 'kn' ? 'ವರ್ಷಗಳು' : 'Years'})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-400">
                    <span className="text-xs font-semibold hidden sm:inline">
                      {isMahaExpanded ? (currentLang === 'kn' ? 'ಮರೆಮಾಡಿ' : 'Collapse') : (currentLang === 'kn' ? '೯ ಅಂತರ್ದಶೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View 9 Sub-periods')}
                    </span>
                    {isMahaExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {/* Sub-level: Antardashas within this Mahadasha */}
                {isMahaExpanded && (
                  <div className="p-3 sm:p-4 pt-1 border-t border-stone-200/80 dark:border-stone-700/80 space-y-2 bg-white/70 dark:bg-stone-850/70">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1 pt-1">
                      {maha.lord.sanskrit[currentLang]} {currentLang === 'kn' ? 'ಮಹಾದಶೆಯಲ್ಲಿನ ಅಂತರ್ದಶೆಗಳು' : 'Antardashas (Sub-periods)'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {maha.antardashas.map((antar, aIdx) => {
                        const antarKey = `${mIdx}-${aIdx}`;
                        const isAntarExpanded = expandedAntarKey === antarKey;

                        return (
                          <div
                            key={antarKey}
                            className={`rounded-xl border p-3 transition-all ${
                              antar.isCurrent
                                ? 'border-orange-400 dark:border-orange-600 bg-orange-50/50 dark:bg-orange-950/30 ring-1 ring-orange-400'
                                : 'border-stone-200 dark:border-stone-700/70 bg-stone-50/50 dark:bg-stone-800/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: antar.lord.color }}
                                />
                                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                                  {antar.lord.sanskrit[currentLang]}
                                </span>
                              </div>
                              {antar.isCurrent && (
                                <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400">
                                  {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ' : 'Current'}
                                </span>
                              )}
                            </div>

                            <div className="text-[10.5px] text-stone-500 mt-1">
                              {formatDate(antar.startDate)} – {formatDate(antar.endDate)}
                            </div>
                            <div className="text-[10px] font-semibold text-stone-400 mt-0.5">
                              {antar.durationMonths} {currentLang === 'kn' ? 'ತಿಂಗಳುಗಳು' : 'Months'} ({antar.durationDays} {currentLang === 'kn' ? 'ದಿನ' : 'days'})
                            </div>

                            {/* Button to toggle 9 Pratyantardashas */}
                            <button
                              onClick={() => setExpandedAntarKey(isAntarExpanded ? null : antarKey)}
                              className="mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isAntarExpanded ? 'Hide Pratyantardashas' : 'Explore 9 Pratyantardashas'}</span>
                              {isAntarExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </button>

                            {/* 3rd Level: Pratyantardashas list */}
                            {isAntarExpanded && (
                              <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-700 space-y-1.5">
                                <span className="text-[9.5px] font-extrabold uppercase text-stone-400 block">
                                  {currentLang === 'kn' ? 'ಪ್ರತ್ಯಂತರ್ದಶೆಗಳು (ಸೂಕ್ಷ್ಮ ಅವಧಿ):' : 'Pratyantardashas:'}
                                </span>
                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                  {antar.pratyantardashas.map((prat, pIdx) => (
                                    <div
                                      key={`prat-${pIdx}`}
                                      className={`p-1.5 rounded-lg text-[10px] flex items-center justify-between ${
                                        prat.isCurrent
                                          ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 font-bold border border-indigo-300 dark:border-indigo-700'
                                          : 'bg-white/60 dark:bg-stone-850/60 text-stone-700 dark:text-stone-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className="w-1.5 h-1.5 rounded-full"
                                          style={{ backgroundColor: prat.lord.color }}
                                        />
                                        <span>{prat.lord.sanskrit[currentLang]}</span>
                                      </div>
                                      <span className="text-[9px] text-stone-500">
                                        {formatDate(prat.startDate)} ({prat.durationDays}d)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Print-Only Complete 120-Year Mahadasha Schedule Table */}
        <div className="print-only mt-6 page-break-inside-avoid">
          <h3 className="text-sm font-black text-stone-900 border-b border-stone-800 pb-1 mb-2">
            {currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ಮಹಾದಶಾ ವಿವರ (ಪರಾಶರ ಪದ್ಧತಿ)' : 'Complete 120-Year Vimshottari Mahadasha Table'}
          </h3>
          <table className="w-full text-xs border border-stone-400 border-collapse">
            <thead>
              <tr className="bg-stone-200 border-b border-stone-400 text-stone-900 font-bold">
                <th className="p-1.5 border border-stone-300 text-center">#</th>
                <th className="p-1.5 border border-stone-300 text-left">Mahadasha Lord</th>
                <th className="p-1.5 border border-stone-300 text-center">Years</th>
                <th className="p-1.5 border border-stone-300 text-left">Start Date</th>
                <th className="p-1.5 border border-stone-300 text-left">End Date</th>
                <th className="p-1.5 border border-stone-300 text-left">Gemstone</th>
                <th className="p-1.5 border border-stone-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashaResult.mahadashas.map((m, idx) => (
                <tr key={`print-maha-${idx}`} className={`border-b border-stone-300 ${m.isCurrent ? 'bg-amber-100/80 font-bold' : ''}`}>
                  <td className="p-1.5 border border-stone-300 text-center">{idx + 1}</td>
                  <td className="p-1.5 border border-stone-300">{m.lord.sanskrit[currentLang]} ({m.lord.name})</td>
                  <td className="p-1.5 border border-stone-300 text-center">{m.durationYears}y</td>
                  <td className="p-1.5 border border-stone-300">{formatDate(m.startDate)}</td>
                  <td className="p-1.5 border border-stone-300">{formatDate(m.endDate)}</td>
                  <td className="p-1.5 border border-stone-300">{m.lord.gemstone[currentLang]}</td>
                  <td className="p-1.5 border border-stone-300 text-center">
                    {m.isCurrent ? (currentLang === 'kn' ? 'ಸಕ್ರಿಯ (Active)' : 'ACTIVE') : m.endDate < new Date() ? 'Completed' : 'Upcoming'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Report Footer */}
          <div className="mt-4 pt-2 border-t border-stone-400 text-[10px] text-stone-600 flex justify-between items-center">
            <span>Herambha Chitrabhanu Maha Maruthi Panchanga • Bangalore / Karnataka</span>
            <span>Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

      </div>
      {/* End of #printable-dasha-report */}
    </div>
    </div>
  );
};

// Mini Save icon helper
function SaveIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
