import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Calendar as CalendarIcon, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Table, 
  Layers, 
  Check, 
  Copy,
  Share2,
  FileText,
  Languages
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { 
  BHARATIYA_SANKHYA, 
  PANCHA_PEETHA_TABLE, 
  RASHI_NAKSHATRA_CHART, 
  SAMVATSARA_LIST, 
  SANKALPA_EXPLANATION, 
  SANKALPA_MANTRA_MULTILINGUAL,
  SANKALPA_MANTRA_PARTS 
} from '../utils/pdfData';
import { getPanchangaForDate, getLocalizedPlaceName, lookupLocalizedPlaceName, CITIES } from '../utils/panchanga';
import { 
  KALASHA_SAMAGRI_LIST, 
  KALASHA_STHAPANA_STEPS, 
  AKHANDA_DEEPA_STHAPANA_DETAILS, 
  VIJAYADASHAMI_VISARJANA_DETAILS 
} from '../utils/navaratriRitualsData';
import { VisarjanaMuhurtaCalculator } from './VisarjanaMuhurtaCalculator';
import { RitualVisuals } from './RitualVisuals';
import { PoojaDeepaGuidelinesSection } from './PoojaDeepaGuidelinesSection';
import { PoojaAudioGuide } from './PoojaAudioGuide';
import { DigitalOfferingLog } from './DigitalOfferingLog';
import { RitualProgressIndicator, RitualStepMeta } from './RitualProgressIndicator';
import { Lock, Volume2, BookMarked, Sun, Moon, Compass } from 'lucide-react';

interface SankalpaVidhiPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onBackToCalendar: () => void;
  onSelectCity?: (city: CityLocation) => void;
  onOpenGoogleMap?: () => void;
  isGlobalLocked?: boolean;
  onRequestUnlock?: (moduleName?: string) => void;
}

export const SankalpaVidhiPage: React.FC<SankalpaVidhiPageProps> = ({
  currentLang,
  selectedCity,
  onBackToCalendar,
  onSelectCity,
  onOpenGoogleMap,
  isGlobalLocked = false,
  onRequestUnlock
}) => {
  const todayStr = useMemo(() => {
    const d = new Date();
    const m = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  // Selected date for Sankalpa calculation
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [customCityName, setCustomCityName] = useState<string>('');
  const DEFAULT_DEITY: Record<Language, string> = {
    kn: 'ಶ್ರೀ ಇಷ್ಟದೇವತಾ / ಶ್ರೀ ದುರ್ಗಾ / ಶ್ರೀ ಪರಮೇಶ್ವರ',
    hi: 'श्री इष्टदेवता / श्री दुर्गा / श्री परमेश्वर',
    en: 'Sri Ishta Devata / Sri Durga / Sri Parameshwara'
  };

  const DEFAULT_GRANTHA: Record<Language, string> = {
    kn: 'ಶ್ರೀ ದೇವೀ ಮಾಹಾತ್ಮ್ಯೆ / ಶ್ರೀ ರುದ್ರ ಪಾರಾಯಣ',
    hi: 'श्री देवी माहात्म्ये / श्री रुद्र पारायण',
    en: 'Sri Devi Mahatmye / Sri Rudra Parayana'
  };

  const [deityName, setDeityName] = useState<string>(() => DEFAULT_DEITY[currentLang] || DEFAULT_DEITY.kn);
  const [granthaName, setGranthaName] = useState<string>(() => DEFAULT_GRANTHA[currentLang] || DEFAULT_GRANTHA.kn);

  // Active view tab for the PDF reference sections & Sthapana rituals
  const [activeTab, setActiveTab] = useState<'stotra' | 'audioGuide' | 'offeringLog' | 'vidhana' | 'kalasha' | 'akhandaDeepa' | 'deepaGuidelines' | 'visarjana' | 'visuals' | 'samvatsara' | 'nakshatra' | 'sankhya' | 'peetha'>('stotra');
  const [stotraLang, setStotraLang] = useState<Language>(currentLang);
  const [copiedStotra, setCopiedStotra] = useState(false);
  const [pakshaOverride, setPakshaOverride] = useState<'auto' | 'Shukla' | 'Krishna'>('auto');

  // Persistent Ritual Progress Indicator State
  const [activeRitualStep, setActiveRitualStep] = useState<number>(() => {
    const saved = localStorage.getItem('hcmm_sankalpa_active_step');
    return saved ? Math.max(1, Math.min(6, Number(saved))) : 1;
  });

  const [completedRitualSteps, setCompletedRitualSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('hcmm_sankalpa_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleStepSelect = (stepNumber: number, tabKey: RitualStepMeta['tabKey']) => {
    setActiveRitualStep(stepNumber);
    localStorage.setItem('hcmm_sankalpa_active_step', String(stepNumber));
    if (tabKey) {
      setActiveTab(tabKey);
    }
  };

  const handleToggleCompleteStep = (stepNumber: number) => {
    setCompletedRitualSteps(prev => {
      const isDone = prev.includes(stepNumber);
      const next = isDone ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber];
      localStorage.setItem('hcmm_sankalpa_completed_steps', JSON.stringify(next));
      if (!isDone && stepNumber < 6) {
        setActiveRitualStep(stepNumber + 1);
        localStorage.setItem('hcmm_sankalpa_active_step', String(stepNumber + 1));
      }
      return next;
    });
  };

  const handleResetRitualProgress = () => {
    const confirmMsg = currentLang === 'kn' 
      ? 'ಪೂಜಾ ಸಂಕಲ್ಪ ಪ್ರಗತಿಯನ್ನು ಪುನರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ?' 
      : currentLang === 'hi' 
      ? 'क्या आप अनुष्ठान प्रगति को पुनः आरंभ करना चाहते हैं?' 
      : 'Reset ritual progress back to Step 1?';
    if (window.confirm(confirmMsg)) {
      setActiveRitualStep(1);
      setCompletedRitualSteps([]);
      localStorage.setItem('hcmm_sankalpa_active_step', '1');
      localStorage.setItem('hcmm_sankalpa_completed_steps', JSON.stringify([]));
    }
  };

  const handleSwitchStotraLang = (lang: Language) => {
    setStotraLang(lang);
    setCustomCityName('');
    setDeityName(DEFAULT_DEITY[lang]);
    setGranthaName(DEFAULT_GRANTHA[lang]);
  };

  // Sync stotraLang with currentLang when currentLang changes
  useEffect(() => {
    handleSwitchStotraLang(currentLang);
  }, [currentLang]);

  // Calculate day-dependent Hindu Panchanga elements automatically for selected date!
  const panchangDay: PanchangaDay = useMemo(() => {
    const parts = selectedDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return getPanchangaForDate(d, selectedCity);
  }, [selectedDateStr, selectedCity]);

  // Effective Paksha (either auto-astronomical or devotee manual vow override)
  const effectivePaksha = useMemo<'Shukla' | 'Krishna'>(() => {
    return pakshaOverride === 'auto' ? panchangDay.paksha : pakshaOverride;
  }, [pakshaOverride, panchangDay.paksha]);

  // Localized Place Name in the active stotra language using localized dictionary lookup
  const resolvedCityName = useMemo(() => {
    if (customCityName.trim()) {
      return lookupLocalizedPlaceName(customCityName.trim(), stotraLang);
    }
    return lookupLocalizedPlaceName(selectedCity, stotraLang);
  }, [customCityName, selectedCity, stotraLang]);

  // Localized Dashed numbers 1 through 9 exact mapping from PDF:
  const dashedValues = useMemo(() => {
    if (stotraLang === 'hi') {
      return {
        c1: resolvedCityName,
        c2: panchangDay.samvatsara.hi,
        c3: panchangDay.ayana.hi,
        c4: `${panchangDay.masa.hi} ${panchangDay.isAdhikaMasa ? '(अधिक)' : ''}`,
        c5: effectivePaksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण',
        c6: panchangDay.tithiSanskrit ? panchangDay.tithiSanskrit.replace('ಂ', 'ं') : panchangDay.tithiName.hi,
        c7: panchangDay.vara.hi.split(' ')[0].replace('वार', ''),
        c8: panchangDay.nakshatra.hi.split('(')[0].trim(),
        c9: panchangDay.suryaRashi.hi
      };
    }
    if (stotraLang === 'en') {
      return {
        c1: resolvedCityName,
        c2: panchangDay.samvatsara.en,
        c3: panchangDay.ayana.en.split(' ')[0],
        c4: `${panchangDay.masa.en} ${panchangDay.isAdhikaMasa ? '(Adhika)' : ''}`,
        c5: effectivePaksha === 'Shukla' ? 'Shukla' : 'Krishna',
        c6: panchangDay.tithiName.en.split(' ')[0],
        c7: panchangDay.vara.en.split(' ')[0].replace('vara', ''),
        c8: panchangDay.nakshatra.en.split('(')[0].trim(),
        c9: panchangDay.suryaRashi.en.split(' ')[0]
      };
    }
    // Kannada (default)
    return {
      c1: resolvedCityName,
      c2: panchangDay.samvatsara.kn,
      c3: panchangDay.ayana.kn,
      c4: `${panchangDay.masa.kn} ${panchangDay.isAdhikaMasa ? '(ಅಧಿಕ)' : ''}`,
      c5: effectivePaksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ',
      c6: panchangDay.tithiSanskrit || panchangDay.tithiName.kn,
      c7: panchangDay.vara.kn.replace('ವಾರ', ''),
      c8: panchangDay.nakshatra.kn.split('(')[0].trim(),
      c9: panchangDay.suryaRashi.kn
    };
  }, [stotraLang, resolvedCityName, panchangDay, effectivePaksha]);

  const dashed1_City = dashedValues.c1;
  const dashed2_Samvatsara = dashedValues.c2;
  const dashed3_Ayana = dashedValues.c3;
  const dashed4_Masa = dashedValues.c4;
  const dashed5_Paksha = dashedValues.c5;
  const dashed6_Tithi = dashedValues.c6;
  const dashed7_Vasara = dashedValues.c7;
  const dashed8_Nakshatra = dashedValues.c8;
  const dashed9_Rashi = dashedValues.c9;

  const mantraTemplate = SANKALPA_MANTRA_MULTILINGUAL[stotraLang] || SANKALPA_MANTRA_MULTILINGUAL.kn;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyStotraOnly = () => {
    const text = `
${mantraTemplate.part1} (1. ${dashedValues.c1})${mantraTemplate.citySuffix}(2. ${dashedValues.c2})${mantraTemplate.samvatsaraSuffix}(3. ${dashedValues.c3})${mantraTemplate.ayanaSuffix}(4. ${dashedValues.c4})${mantraTemplate.masaSuffix}(5. ${dashedValues.c5})${mantraTemplate.pakshaSuffix}(6. ${dashedValues.c6})${mantraTemplate.tithiSuffix}(7. ${dashedValues.c7})${mantraTemplate.vasaraSuffix}(8. ${dashedValues.c8})${mantraTemplate.nakshatraSuffix}(9. ${dashedValues.c9})${mantraTemplate.rashiSuffix}(${deityName})${mantraTemplate.deitySuffix}(${granthaName})${mantraTemplate.granthaSuffix}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedStotra(true);
    setTimeout(() => setCopiedStotra(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* Persistent Ritual Progress Indicator (Sticky Top Bar) */}
      <RitualProgressIndicator
        currentLang={stotraLang}
        activeStep={activeRitualStep}
        onStepSelect={handleStepSelect}
        completedSteps={completedRitualSteps}
        onToggleComplete={handleToggleCompleteStep}
        onResetProgress={handleResetRitualProgress}
      />

      {/* Top Banner & Date Picker Bar (Hidden in Print) */}
      <div className="no-print rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-6 shadow-xl border border-red-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4" />
              <span>SANKALPA & STHAPANA VIDHI • ಕಲಶ & ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ಮತ್ತು ಸ್ಥಾಪನೆ (ಕಲಶ & ಅಖಂಡ ದೀಪ)' : currentLang === 'hi' ? 'संकल्प एवं स्थापना (कलश व अखण्ड दीप)' : 'Sankalpa & Sthapana (Kalasha & Akhanda Deepa)'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? 'ವೇದೋಕ್ತ ಸಂಕಲ್ಪ ಮಂತ್ರ, ಕಲಶ ಸ್ಥಾಪನೆ, ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಹಾಗೂ ವಿಸರ್ಜನೆಯ ಸಂಪೂರ್ಣ ಶಾಸ್ತ್ರೋಕ್ತ ಮಾರ್ಗದರ್ಶಿ.'
                : currentLang === 'hi'
                ? 'वेदोक्त संकल्प मन्त्र, कलश स्थापना, अखण्ड दीप प्रतिष्ठा एवं विसर्जन का सम्पूर्ण शास्त्रसम्मत विधान।'
                : 'Complete Vedic Sankalpa Stotra, Kalasha Sthapana, Akhanda Deepa installation, and Visarjana guides.'}
            </p>
          </div>

          {/* Interactive Date Picker & Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-black/20 p-3 rounded-xl backdrop-blur-xs border border-white/10">
            
            {/* Date Selector at Top */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-300" />
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* City / Location Selector & Custom Input in Active Language */}
            <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg border border-white/10">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const c = CITIES.find(item => item.name === e.target.value);
                  if (c) {
                    onSelectCity?.(c);
                    setCustomCityName('');
                  }
                }}
                className="bg-white text-stone-900 font-bold text-xs px-2 py-1 rounded-md border border-stone-300 focus:outline-hidden cursor-pointer"
                title="Select location for Sankalpa"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.nameLocalized ? c.nameLocalized[stotraLang] : c.name} ({c.stateLocalized ? c.stateLocalized[stotraLang] : c.state})
                  </option>
                ))}
              </select>

              {/* Optional Custom Place Override with Dictionary Lookup */}
              <input
                type="text"
                value={customCityName}
                onChange={(e) => setCustomCityName(e.target.value)}
                placeholder={lookupLocalizedPlaceName(selectedCity, stotraLang)}
                title="Enter any place or city to translate into the chosen language (e.g., Udupi, Kashi, Gokarna, Dharmasthala, Mysore, Tirupati)"
                className="px-2 py-1 text-xs font-bold rounded-md bg-white text-stone-900 border border-stone-300 focus:outline-hidden w-28 sm:w-36"
              />
              {customCityName && (
                <button
                  type="button"
                  onClick={() => setCustomCityName('')}
                  className="text-[10px] text-amber-200 hover:text-white underline font-bold"
                  title="Reset to default localized city"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Live Dictionary Lookup Indicator */}
            <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-amber-200">
              <span className="font-bold text-white">📍 {stotraLang === 'kn' ? 'ನಿಘಂಟು ಅನುವಾದ:' : stotraLang === 'hi' ? 'शब्दकोश अनुवाद:' : 'Translated Place:'}</span>
              <span className="font-mono font-bold text-amber-300 underline decoration-amber-400">{resolvedCityName}</span>
            </div>

            {/* Language Dropdown Selector in Header */}
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20">
              <Languages className="w-4 h-4 text-amber-300" />
              <select
                value={stotraLang}
                onChange={(e) => handleSwitchStotraLang(e.target.value as Language)}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer"
                title="Select language for Sankalpa Mantra and Instructions"
              >
                <option value="kn" className="text-stone-900 bg-white">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-stone-900 bg-white">हिन्दी (Hindi)</option>
                <option value="en" className="text-stone-900 bg-white">English</option>
              </select>
            </div>

            {/* Print to PDF Button */}
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5"
              title="Export complete Sankalpa Stotra for this day to PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF / Print</span>
            </button>

            {/* Back to Calendar */}
            <button
              onClick={onBackToCalendar}
              className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Calendar</span>
            </button>

          </div>

        </div>
      </div>

      {/* Reference Tabs Navigation (Hidden in Print) - All tabs wrapped and fully visible with NO horizontal scroll */}
      <div className="no-print flex flex-wrap items-center gap-2 pb-3 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        {/* Tab 1: Sankalpa Stotra */}
        <button
          onClick={() => setActiveTab('stotra')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'stotra'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>
            {stotraLang === 'kn' ? '೧. ಸಂಕಲ್ಪ ಮಂತ್ರ (Stotra)' : stotraLang === 'hi' ? '१. संकल्प मन्त्र' : '1. Sankalpa Stotra'}
          </span>
        </button>

        {/* Tab: Pooja Audio Guide */}
        <button
          onClick={() => setActiveTab('audioGuide')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'audioGuide'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300 font-bold'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>
            {stotraLang === 'kn' ? '🔊 ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ (Audio Guide)' : stotraLang === 'hi' ? '🔊 ध्वनि संदर्शिका (Audio Guide)' : '🔊 Pooja Audio Guide'}
          </span>
        </button>

        {/* Tab: Digital Offering Log */}
        <button
          onClick={() => setActiveTab('offeringLog')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'offeringLog'
              ? 'bg-rose-700 text-white shadow-md ring-2 ring-rose-300 font-bold'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-rose-300 dark:border-stone-700'
          }`}
        >
          <BookMarked className="w-4 h-4 text-rose-400" />
          <span>
            {stotraLang === 'kn' ? '📖 ನೈವೇದ್ಯ ಲಾಗ್ (Offering Log)' : stotraLang === 'hi' ? '📖 नैवेद्य अभिलेख (Offering Log)' : '📖 Offering Log'}
          </span>
        </button>

        {/* Tab 2: Sankalpa Vidhana */}
        <button
          onClick={() => setActiveTab('vidhana')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'vidhana'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>
            {stotraLang === 'kn' ? '೨. ಸಂಕಲ್ಪ ವಿಧಾನ (Vidhana)' : stotraLang === 'hi' ? '२. संकल्प विधान' : '2. Sankalpa Vidhana'}
          </span>
        </button>

        {/* Tab 3: Kalasha Sthapana & Visarjana */}
        <button
          onClick={() => setActiveTab('kalasha')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'kalasha'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-amber-300'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <span className="text-sm">🏺</span>
          <span>
            {stotraLang === 'kn' ? '೩. ಕಲಶ ಸ್ಥಾಪನೆ & ವಿಸರ್ಜನೆ' : stotraLang === 'hi' ? '३. कलश स्थापना एवं विसर्जन' : '3. Kalasha Sthapana & Visarjana'}
          </span>
        </button>

        {/* Tab 4: Akhanda Deepa Sthapana & Visarjana */}
        <button
          onClick={() => setActiveTab('akhandaDeepa')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'akhandaDeepa'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <span className="text-sm">🪔</span>
          <span>
            {stotraLang === 'kn' ? '೪. ಅಖಂಡ ದೀಪ ಸ್ಥಾಪನೆ & ವಿಸರ್ಜನೆ' : stotraLang === 'hi' ? '४. अखण्ड दीप स्थापना एवं विसर्जन' : '4. Akhanda Deepa Sthapana & Visarjana'}
          </span>
        </button>

        {/* Tab: Pooja Deepa Guidelines (4x4 Coordinate Grid) */}
        <button
          onClick={() => setActiveTab('deepaGuidelines')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'deepaGuidelines'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300 font-bold'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <span className="text-sm">🧭</span>
          <span>
            {stotraLang === 'kn' ? 'ದೀಪ & ದಿಕ್ಕು ನಿಯಮಾವಳಿ (4×4 Grid)' : stotraLang === 'hi' ? 'दीप व दिशा नियम (4×4 Grid)' : 'Deepa & Direction Guide (4×4 Grid)'}
          </span>
        </button>

        {/* Tab: Ritual Visuals (PDF Schematics) */}
        <button
          onClick={() => setActiveTab('visuals')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'visuals'
              ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-300 font-bold'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <span className="text-sm">🎨</span>
          <span>
            {stotraLang === 'kn' ? 'ಪೂಜಾ ರೇಖಾಚಿತ್ರಗಳು (Ritual Visuals)' : stotraLang === 'hi' ? 'पूजन रेखाचित्र (Ritual Visuals)' : 'Ritual Visuals (PDF Schematics)'}
          </span>
        </button>

        {/* Tab 5: 10th-Day Dashami Visarjana Muhurta Calculator */}
        <button
          onClick={() => setActiveTab('visarjana')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'visarjana'
              ? 'bg-red-700 text-white shadow-md ring-2 ring-amber-300'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-amber-300 dark:border-stone-700'
          }`}
        >
          <span className="text-sm">🏺</span>
          <span>
            {stotraLang === 'kn' ? '೫. ದಶಮೀ ವಿಸರ್ಜನ ಮುಹೂರ್ತ ಗಣಕ' : stotraLang === 'hi' ? '५. दशमी विसर्जन मुहूर्त गणक' : '5. Dashami Visarjana Calculator'}
          </span>
        </button>

        {/* Tab 6: 60 Samvatsaras */}
        <button
          onClick={() => setActiveTab('samvatsara')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'samvatsara'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <Table className="w-4 h-4 text-amber-500" />
          <span>
            {stotraLang === 'kn' ? '೬. ೬೦ ಸಂವತ್ಸರಗಳು (PDF)' : stotraLang === 'hi' ? '६. ६० संवत्सर (PDF)' : '6. 60 Samvatsaras (PDF)'}
          </span>
        </button>

        {/* Tab 7: Rashi & Nakshatra */}
        <button
          onClick={() => setActiveTab('nakshatra')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'nakshatra'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-500" />
          <span>
            {stotraLang === 'kn' ? '೭. ರಾಶಿ & ನಕ್ಷತ್ರ ಚರಣ (PDF)' : stotraLang === 'hi' ? '७. राशि व नक्षत्र चरण (PDF)' : '7. Rashi & Nakshatra (PDF)'}
          </span>
        </button>

        {/* Tab 8: Bharatiya Sankhya */}
        <button
          onClick={() => setActiveTab('sankhya')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'sankhya'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <span>
            {stotraLang === 'kn' ? '೮. ಭಾರತೀಯ ಸಂಖ್ಯಾ ಶಾಸ್ತ್ರ (PDF)' : stotraLang === 'hi' ? '८. भारतीय संख्या शास्त्र (PDF)' : '8. Vedic Numerology (PDF)'}
          </span>
        </button>

        {/* Tab 9: Panchapeetha */}
        <button
          onClick={() => setActiveTab('peetha')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'peetha'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <span>
            {stotraLang === 'kn' ? '೯. ಪಂಚಪೀಠ ಪ್ರವರ (PDF)' : stotraLang === 'hi' ? '९. पञ्चपीठ प्रवर (PDF)' : '9. Panchapeetha Pravara (PDF)'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE SANKALPA STOTRA CONTAINER (Export to PDF Target) */}
      {/* ========================================================================= */}
      {activeTab === 'stotra' && (
      <div 
        id="printable-sankalpa"
        className="rounded-2xl border-2 border-amber-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl space-y-6"
      >
        
        {/* Printable Header */}
        <div className="border-b-2 border-red-600/30 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
              {stotraLang === 'kn' ? 'ವೇದೋಕ್ತ ಶುಭ ಸಂಕಲ್ಪ ಮಂತ್ರ (Vedic Sankalpa Stotra)' : stotraLang === 'hi' ? 'वेदोक्त शुभ संकल्प मन्त्र (Vedic Sankalpa Stotra)' : 'Vedic Shubha Sankalpa Stotra'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-950 dark:text-white mt-0.5">
              {stotraLang === 'kn' ? 'ಸಂಕಲ್ಪ ಮಂತ್ರ (Sankalpa Mantra)' : stotraLang === 'hi' ? 'संकल्प मन्त्र (Sankalpa Mantra)' : 'Sankalpa Mantra'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {stotraLang === 'kn' ? 'ದಿನಾಂಕ:' : stotraLang === 'hi' ? 'दिनांक:' : 'Date:'} <span className="font-bold text-blue-600">{selectedDateStr}</span> • {stotraLang === 'kn' ? 'ಸ್ಥಳ:' : stotraLang === 'hi' ? 'स्थान:' : 'Place:'} <span className="font-bold text-blue-600">{dashed1_City}</span>
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2">
            {/* Direct Language Switcher on Sankalpa page */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-1.5 hidden sm:inline">
                {stotraLang === 'kn' ? 'ಭಾಷೆ:' : stotraLang === 'hi' ? 'भाषा:' : 'Lang:'}
              </span>
              <button
                type="button"
                onClick={() => handleSwitchStotraLang('kn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  stotraLang === 'kn'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => handleSwitchStotraLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  stotraLang === 'hi'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleSwitchStotraLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  stotraLang === 'en'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={handleCopyStotraOnly}
              className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center gap-1.5"
            >
              {copiedStotra ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedStotra ? 'Copied' : 'Copy Stotra'}</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Sensitive Customization Lock Warning Banner */}
        {isGlobalLocked && (
          <div className="no-print p-3.5 rounded-xl bg-amber-500/15 border-2 border-amber-400 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-600 text-white shrink-0">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <strong className="block font-bold">
                  {stotraLang === 'kn' ? 'ಆಡಳಿತಾತ್ಮಕ ಲಾಕ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (Global Locked Mode Active)' : 'Master Administrative Lock Active'}
                </strong>
                <span className="text-[11px] text-stone-600 dark:text-stone-300">
                  {stotraLang === 'kn'
                    ? 'ಸಂಕಲ್ಪ ದೇವತಾ ಹೆಸರು, ಗ್ರಂಥ ಪಾರಾಯಣ ಹಾಗೂ ಕಸ್ಟಮ್ ಸ್ಥಳ ಸಂಪಾದನೆಗಳನ್ನು ರಕ್ಷಿಸಲಾಗಿದೆ. ಬದಲಾವಣೆ ಮಾಡಲು ಅನ್‌ಲಾಕ್ ಮಾಡಿ.'
                    : 'Deity name, grantha, and custom location edits are protected. Authenticate with master password to modify.'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRequestUnlock?.('Sankalpa and Sthaapana')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{stotraLang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಅನ್‌ಲಾಕ್' : 'Unlock Access'}</span>
            </button>
          </div>
        )}

        {/* Interactive Paksha & Vrata Selection Bar (Address Shukla / Krishna user customization) */}
        <div className="no-print p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-900 border-2 border-amber-300 dark:border-amber-700/70 shadow-sm space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>
                  {stotraLang === 'kn' ? 'ಪಕ್ಷ ಆಯ್ಕೆ & ವ್ರತ ನಿಯಂತ್ರಣ (Paksha Selection):' : stotraLang === 'hi' ? 'पक्ष चयन एवं व्रत नियंत्रण:' : 'Paksha Selection & Vrata Control:'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-mono">
                  {stotraLang === 'kn' ? 'ಖಗೋಳೀಯ ಉದಯ:' : 'Astronomical:'} {panchangDay.paksha === 'Shukla' ? (stotraLang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ' : 'Shukla') : (stotraLang === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ' : 'Krishna')} ({panchangDay.tithiName[stotraLang] || panchangDay.tithiName.kn})
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                {stotraLang === 'kn'
                  ? 'ನಿಮ್ಮ ವ್ರತ ಅಥವಾ ನವರಾತ್ರಿ/ಪೌರ್ಣಮಿ ಸಂಕಲ್ಪಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಪಕ್ಷವನ್ನು ನೇರವಾಗಿ ಬದಲಾಯಿಸಬಹುದು.'
                  : 'Toggle between Shukla Paksha or Krishna Paksha directly to match your specific Vrata oath.'}
              </p>
            </div>

            {/* Paksha Mode Buttons */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setPakshaOverride('auto')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  pakshaOverride === 'auto'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
                title="Automatically follow astronomical ephemeris for the selected date"
              >
                <span>⚡ Auto ({panchangDay.paksha === 'Shukla' ? (stotraLang === 'kn' ? 'ಶುಕ್ಲ' : 'Shukla') : (stotraLang === 'kn' ? 'ಕೃಷ್ಣ' : 'Krishna')})</span>
              </button>

              <button
                type="button"
                onClick={() => setPakshaOverride('Shukla')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  effectivePaksha === 'Shukla' && pakshaOverride === 'Shukla'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
                title="Force Shukla Paksha (Bright Fortnight) for your Sankalpa Stotra"
              >
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{stotraLang === 'kn' ? '🌕 ಶುಕ್ಲ ಪಕ್ಷ' : stotraLang === 'hi' ? '🌕 शुक्ल पक्ष' : '🌕 Shukla'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPakshaOverride('Krishna')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  effectivePaksha === 'Krishna' && pakshaOverride === 'Krishna'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
                title="Force Krishna Paksha (Dark Fortnight) for your Sankalpa Stotra"
              >
                <Moon className="w-3.5 h-3.5 text-stone-400" />
                <span>{stotraLang === 'kn' ? '🌑 ಕೃಷ್ಣ ಪಕ್ಷ' : stotraLang === 'hi' ? '🌑 कृष्ण पक्ष' : '🌑 Krishna'}</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Action Bar: Audio Guide & Offering Log */}
          <div className="pt-2 border-t border-amber-200/80 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {stotraLang === 'kn' ? 'ತ್ವರಿತ ಪೂಜಾ ಸಹಾಯಕರು:' : 'Quick Ritual Aids:'}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('audioGuide')}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{stotraLang === 'kn' ? '🔊 ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ ಆಲಿಸಿ' : '🔊 Play in Audio Guide'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('offeringLog')}
                className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>{stotraLang === 'kn' ? '📖 ನೈವೇದ್ಯ ಲಾಗ್‌ನಲ್ಲಿ ದಾಖಲಿಸಿ' : '📖 Record in Offering Log'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Optional Editable Fields for Puja Devata & Grantha */}
        <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 text-xs">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              — {stotraLang === 'kn' ? 'ಪೂಜೆ ಮಾಡುವ ದೇವರ ಹೆಸರು' : stotraLang === 'hi' ? 'पूज्य देवता का नाम' : 'Worshipped Deity Name'} (Deity Name) —
            </label>
            <input
              type="text"
              value={deityName}
              readOnly={isGlobalLocked}
              onClick={() => {
                if (isGlobalLocked) onRequestUnlock?.('Sankalpa and Sthaapana');
              }}
              onChange={(e) => {
                if (isGlobalLocked) {
                  onRequestUnlock?.('Sankalpa and Sthaapana');
                } else {
                  setDeityName(e.target.value);
                }
              }}
              className={`w-full px-3 py-1.5 rounded-lg border font-semibold ${
                isGlobalLocked
                  ? 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-pointer'
                  : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'
              }`}
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              — {stotraLang === 'kn' ? 'ಓದುವ ಗ್ರಂಥದ ಅಥವಾ ಮಂತ್ರದ ಹೆಸರು' : stotraLang === 'hi' ? 'पठित ग्रन्थ अथवा मन्त्र का नाम' : 'Recited Scripture/Mantra Name'} (Grantha/Mantra Name) —
            </label>
            <input
              type="text"
              value={granthaName}
              readOnly={isGlobalLocked}
              onClick={() => {
                if (isGlobalLocked) onRequestUnlock?.('Sankalpa and Sthaapana');
              }}
              onChange={(e) => {
                if (isGlobalLocked) {
                  onRequestUnlock?.('Sankalpa and Sthaapana');
                } else {
                  setGranthaName(e.target.value);
                }
              }}
              className={`w-full px-3 py-1.5 rounded-lg border font-semibold ${
                isGlobalLocked
                  ? 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-pointer'
                  : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'
              }`}
            />
          </div>
        </div>

        {/* Complete Sankalpa Stotra Text with Automatically Populated Details Highlighted in Blue */}
        <div className="p-6 rounded-2xl bg-stone-50/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 leading-loose font-serif text-base sm:text-lg select-text">
          
          <p className="indent-6 text-justify">
            <span>{mantraTemplate.part1}</span>
            
            {/* 1. City */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೧' : stotraLang === 'hi' ? '१' : '1'}. {dashed1_City} ——)
            </span>
            <span>{mantraTemplate.citySuffix}</span>

            {/* 2. Samvatsara */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೨' : stotraLang === 'hi' ? '२' : '2'}. {dashed2_Samvatsara} ——)
            </span>
            <span>{mantraTemplate.samvatsaraSuffix}</span>

            {/* 3. Ayana */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೩' : stotraLang === 'hi' ? '३' : '3'}. {dashed3_Ayana} ——)
            </span>
            <span>{mantraTemplate.ayanaSuffix}</span>

            {/* 4. Masa */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೪' : stotraLang === 'hi' ? '४' : '4'}. {dashed4_Masa} ——)
            </span>
            <span>{mantraTemplate.masaSuffix}</span>

            {/* 5. Paksha */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೫' : stotraLang === 'hi' ? '५' : '5'}. {dashed5_Paksha} ——)
            </span>
            <span>{mantraTemplate.pakshaSuffix}</span>

            {/* 6. Tithi */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೬' : stotraLang === 'hi' ? '६' : '6'}. {dashed6_Tithi} ——)
            </span>
            <span>{mantraTemplate.tithiSuffix}</span>

            {/* 7. Vasara */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೭' : stotraLang === 'hi' ? '७' : '7'}. {dashed7_Vasara} ——)
            </span>
            <span>{mantraTemplate.vasaraSuffix}</span>

            {/* 8. Nakshatra */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೮' : stotraLang === 'hi' ? '८' : '8'}. {dashed8_Nakshatra} ——)
            </span>
            <span>{mantraTemplate.nakshatraSuffix}</span>

            {/* 9. Rashi */}
            <span className="text-blue-600 dark:text-blue-400 font-bold underline decoration-blue-500 underline-offset-4 px-1">
              (—— {stotraLang === 'kn' ? '೯' : stotraLang === 'hi' ? '९' : '9'}. {dashed9_Rashi} ——)
            </span>
            <span>{mantraTemplate.rashiSuffix}</span>

            {/* Deity Name */}
            <span className="text-amber-700 dark:text-amber-400 font-bold px-1">
              (— {deityName} —)
            </span>
            <span>{mantraTemplate.deitySuffix}</span>

            {/* Grantha / Mantra Name */}
            <span className="text-stone-700 dark:text-stone-300 font-semibold px-1">
              (— {granthaName} —)
            </span>
            <span>{mantraTemplate.granthaSuffix}</span>
          </p>

        </div>

        {/* Legend Table Explaining Lines 1 to 9 (from PDF Page 2) */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden text-xs">
          <div className="bg-amber-100/70 dark:bg-stone-800 p-2.5 font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center justify-between">
            <span>
              {stotraLang === 'kn' 
                ? 'ಮೇಲಿನ ಸಂಖ್ಯೆಗಳಿಗೆ ಸೇರಿಸಬೇಕಾದ ವಿವರಗಳು (Table of 1-9 Dashed Blanks)' 
                : stotraLang === 'hi'
                ? 'उपर्युक्त क्रमांकों के विवरण (Table of 1-9 Dashed Blanks)'
                : 'Table of 1-9 Dashed Blanks from Vedic Sankalpa'}
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
              Blue = {stotraLang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ವಿವರ' : stotraLang === 'hi' ? 'स्वतः प्रविष्ट' : 'Auto Populated'}
            </span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-left">
                <th className="p-2.5 font-bold w-16 text-center">
                  {stotraLang === 'kn' ? 'ಸಂಖ್ಯೆ' : stotraLang === 'hi' ? 'संख्या' : 'No.'}
                </th>
                <th className="p-2.5 font-bold">
                  {stotraLang === 'kn' ? 'ವಿವರ (Field Description)' : stotraLang === 'hi' ? 'विवरण (Field Description)' : 'Field Description'}
                </th>
                <th className="p-2.5 font-bold text-blue-600 dark:text-blue-400">
                  {stotraLang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ವಿವರ (Auto-filled Value)' : stotraLang === 'hi' ? 'स्वतः प्रविष्ट विवरण (Auto-filled Value)' : 'Auto-filled Value'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೧' : stotraLang === 'hi' ? '१' : '1'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ವ್ರತ ಮಾಡುವ ಊರು (ನಿಘಂಟು ಅನುವಾದಿತ ಸ್ಥಳ)' : stotraLang === 'hi' ? 'स्थान / नगर (शब्दकोश अनुवादित स्थल)' : 'Place / City (Dictionary Translated Location)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed1_City}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೨' : stotraLang === 'hi' ? '२' : '2'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ಸಂವತ್ಸರ (೬೦ ಸಂವತ್ಸರಗಳ ಪೈಕಿ)' : stotraLang === 'hi' ? 'संवत्सर (६० संवत्सरों में से)' : 'Samvatsara (60-year cycle)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed2_Samvatsara}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೩' : stotraLang === 'hi' ? '३' : '3'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ಅಯನ:- ಉತ್ತರಾಯಣ ಮತ್ತು ದಕ್ಷಿಣಾಯಣ' : stotraLang === 'hi' ? 'अयन:- उत्तरायण और दक्षिणायन' : 'Ayana (Uttarayana / Dakshinayana)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed3_Ayana}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೪' : stotraLang === 'hi' ? '४' : '4'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ಮಾಸ:- ಚೈತ್ರ, ವೈಶಾಖ, ಜ್ಯೇಷ್ಠ, ಆಷಾಢ, ಶ್ರಾವಣ...' : stotraLang === 'hi' ? 'मास:- चैत्र, वैशाख, ज्येष्ठ...' : 'Masa (Lunar Month)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed4_Masa}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೫' : stotraLang === 'hi' ? '५' : '5'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ಪಕ್ಷ:- ಕೃಷ್ಣ ಮತ್ತು ಶುಕ್ಲ' : stotraLang === 'hi' ? 'पक्ष:- कृष्ण और शुक्ल' : 'Paksha (Shukla / Krishna)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed5_Paksha}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೬' : stotraLang === 'hi' ? '६' : '6'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ತಿಥಿ:- ಪಾಡ್ಯ, ಬಿದಿಗೆ, ತದಿಗೆ... ಹುಣ್ಣಿಮೆ/ಅಮಾವಾಸ್ಯೆ' : stotraLang === 'hi' ? 'तिथि:- प्रतिपदा, द्वितीया... पूर्णिमा/अमावस्या' : 'Tithi (Lunar Day)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed6_Tithi}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೭' : stotraLang === 'hi' ? '७' : '7'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ವಾಸರ:- ಭಾನು, ಸೋಮ, ಮಂಗಳ, ಬುಧ, ಗುರು, ಶುಕ್ರ, ಶನಿ' : stotraLang === 'hi' ? 'वासर:- भानु, सोम, मंगल, बुध, गुरु, शुक्र, शनि' : 'Vasara (Weekday)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed7_Vasara}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೮' : stotraLang === 'hi' ? '८' : '8'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ನಕ್ಷತ್ರ:- ಅಶ್ವಿನಿ, ಭರಣಿ... ರೇವತಿ' : stotraLang === 'hi' ? 'नक्षत्र:- अश्विनी, भरणी... रेवती' : 'Nakshatra (Constellation)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed8_Nakshatra}</td>
              </tr>
              <tr>
                <td className="p-2.5 text-center font-bold">{stotraLang === 'kn' ? '೯' : stotraLang === 'hi' ? '९' : '9'}</td>
                <td className="p-2.5 font-semibold">
                  {stotraLang === 'kn' ? 'ರಾಶಿ:- ಮೇಷ, ವೃಷಭ, ಮಿಥುನ... ಮೀನ' : stotraLang === 'hi' ? 'राशि:- मेष, वृषभ, मिथुन... मीन' : 'Surya Rashi (Sun Sign)'}
                </td>
                <td className="p-2.5 text-blue-600 dark:text-blue-400 font-bold">{dashed9_Rashi}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: POOJA AUDIO GUIDE (7-Step Synchronous Chanting & Temple Bell SFX) */}
      {/* ========================================================================= */}
      {activeTab === 'audioGuide' && (
        <div className="no-print space-y-6 animate-in fade-in">
          <PoojaAudioGuide
            language={stotraLang}
            deityName={deityName}
            granthaName={granthaName}
            cityName={dashed1_City}
            samvatsaraName={dashed2_Samvatsara}
            ayanaName={dashed3_Ayana}
            masaName={dashed4_Masa}
            pakshaName={dashed5_Paksha}
            tithiName={dashed6_Tithi}
            varaName={dashed7_Vasara}
            nakshatraName={dashed8_Nakshatra}
            rashiName={dashed9_Rashi}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: DIGITAL OFFERING LOG (Historical Record of Deities, Pujas & Naivedya) */}
      {/* ========================================================================= */}
      {activeTab === 'offeringLog' && (
        <div className="no-print space-y-6 animate-in fade-in">
          <DigitalOfferingLog
            language={stotraLang}
            currentDeityName={deityName}
            currentGranthaName={granthaName}
            currentLocationName={resolvedCityName}
            currentDateStr={selectedDateStr}
            currentPaksha={effectivePaksha}
            currentTithi={panchangDay.tithiName[stotraLang] || panchangDay.tithiName.kn}
            currentNakshatra={panchangDay.nakshatra[stotraLang] || panchangDay.nakshatra.kn}
            onSelectDeity={(deity) => {
              setDeityName(deity);
              setActiveTab('stotra');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER TABS (Hidden in Print) */}
      {/* ========================================================================= */}

      {/* TAB 2: SANKALPA PURPOSE & INSTRUCTIONS (PDF Page 1) in Kn, Hi, En */}
      {activeTab === 'vidhana' && (
        <div className="no-print rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-700 pb-3 gap-3">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                {SANKALPA_EXPLANATION[stotraLang].title}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                {SANKALPA_EXPLANATION[stotraLang].note}
              </p>
            </div>
            
            {/* Direct selector on Vidhana tab */}
            <div className="flex items-center gap-1.5 self-start bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
              <span className="text-[10px] font-bold uppercase text-stone-500 px-1">Language:</span>
              <select
                value={stotraLang}
                onChange={(e) => setStotraLang(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer focus:outline-hidden"
              >
                <option value="kn" className="text-stone-900 bg-white">ಕನ್ನಡ (Kannada)</option>
                <option value="hi" className="text-stone-900 bg-white">हिन्दी (Hindi)</option>
                <option value="en" className="text-stone-900 bg-white">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-3.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {SANKALPA_EXPLANATION[stotraLang].content.map((para, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/60 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p>{para}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KALASHA STHAPANA & VISARJANA VIDHI */}
      {/* ========================================================================= */}
      {activeTab === 'kalasha' && (
        <div className="no-print rounded-2xl border-2 border-red-500/60 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-800 via-rose-800 to-amber-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-red-400/40">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/50 shrink-0">
                🏺
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-black/30 px-2 py-0.5 rounded">
                  {stotraLang === 'kn' ? 'ವೇದೋಕ್ತ ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನಾ & ವಿಸರ್ಜನಾ ಮಹಾವಿಧಾನ' : stotraLang === 'hi' ? 'वेदोक्त कलश प्रतिष्ठा एवं विसर्जन महाविधान' : 'Vedic Kalasha Sthapana & Visarjana Vidhi'}
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white mt-1">
                  {stotraLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆ & ವಿಸರ್ಜನೆ ಸಂಪೂರ್ಣ ವಿಧಿ' : stotraLang === 'hi' ? 'कलश स्थापना एवं विसर्जन सम्पूर्ण विधान' : 'Complete Kalasha Sthapana & Visarjana Procedure'}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  {stotraLang === 'kn' 
                    ? 'ತಾಮ್ರ, ಬೆಳ್ಳಿ ಅಥವಾ ಹಿತ್ತಾಳೆಯ ಕಲಶ ಪಾತ್ರೆ, ಸಪ್ತ ತೀರ್ಥ ಆವಾಹನೆ, ಪಲ್ಲವ-ತೆಂಗಿನಕಾಯಿ ಸ್ಥಾಪನೆ & ವಿಸರ್ಜನ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ' 
                    : stotraLang === 'hi'
                    ? 'ताम्र, रजत अथवा पीतल कलश, सप्त नदी आह्वान, पल्लव-श्रीफल प्रतिष्ठा एवं विसर्जन प्रोक्षण'
                    : 'Copper, Silver, or Brass Kalasha, Sacred Water Invocation, Coconut Placement & Holy Visarjana'}
                </p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/30 p-1 rounded-xl border border-white/20">
              <span className="text-[10px] font-bold uppercase text-amber-200 px-1">Lang:</span>
              <button
                type="button"
                onClick={() => setStotraLang('kn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'kn' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setStotraLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'hi' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                संस्कृत
              </button>
              <button
                type="button"
                onClick={() => setStotraLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'en' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* RITUAL VISUALS: Responsive PDF Schematic for Kalasha Sthapana */}
          <RitualVisuals activeVisual="kalasha" language={stotraLang} />

          {/* Section 1: Required Materials (ಸಾಮಗ್ರಿಗಳು) */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span className="p-1 rounded-md bg-red-600 text-white text-xs">೧</span>
              <span>
                {stotraLang === 'kn' ? 'ಬೇಕಾಗುವ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು (Required Materials)' : stotraLang === 'hi' ? 'आवश्यक पूजन सामग्री (Required Materials)' : 'Essential Puja Materials & Vessels'}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {KALASHA_SAMAGRI_LIST.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-850 space-y-1"
                >
                  <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>{item.name[stotraLang]}</span>
                    {item.essential && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-mono font-bold">
                        {stotraLang === 'kn' ? 'ಮುಖ್ಯ' : 'Essential'}
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {item.notes[stotraLang]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Step-by-Step Kalasha Sthapana */}
          <div className="space-y-4">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span className="p-1 rounded-md bg-red-600 text-white text-xs">೨</span>
              <span>
                {stotraLang === 'kn' ? 'ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನಾ ಹಂತಗಳು (Step-by-Step Installation)' : stotraLang === 'hi' ? 'कलश प्रतिष्ठा सोपान (Step-by-Step Installation)' : 'Step-by-Step Kalasha Installation Procedure'}
              </span>
            </h4>

            <div className="space-y-3">
              {KALASHA_STHAPANA_STEPS.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-2xs space-y-2"
                >
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-mono shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className="font-serif">{step.title[stotraLang]}</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                    {step.instruction[stotraLang]}
                  </p>

                  {step.mantra && (
                    <div className="mt-2 ml-8 p-3.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-amber-800/60 space-y-2 text-xs">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-400 block">
                        {stotraLang === 'kn' ? 'ಪವಿತ್ರ ಮಂತ್ರ (Chant during Step):' : 'Sacred Mantra:'}
                      </span>
                      <div className="font-serif font-bold text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                        {stotraLang === 'hi' ? step.mantra.sanskritText : step.mantra.kannadaText}
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400 italic">
                        <strong>Meaning:</strong> {step.mantra.meaning[stotraLang]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Sacred Shlokas (Kalasha Sthapana & Varuna Avahana) */}
          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border-2 border-amber-400/80 dark:border-amber-700/80 space-y-4">
            <h4 className="font-serif font-black text-base text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <span>📜</span>
              <span>
                {stotraLang === 'kn' ? 'ಕಲಶ ಪೂಜೆಯ ಪ್ರಧಾನ ವೈದಿಕ ಶ್ಲೋಕಗಳು (Sacred Vedic Shlokas)' : stotraLang === 'hi' ? 'कलश पूजन के प्रधान वैदिक श्लोक' : 'Core Vedic Kalasha Shlokas'}
              </span>
            </h4>

            {/* Shloka 1: Kalashasya Mukhe Vishnuh */}
            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 space-y-2 text-xs">
              <span className="text-[10.5px] font-bold uppercase text-amber-800 dark:text-amber-400">
                {stotraLang === 'kn' ? '೧. ಕಲಶ ದೇವತಾ ಸ್ವರೂಪ ಶ್ಲೋಕ:' : '1. Cosmic Deity Presence Shloka:'}
              </span>
              <p className="font-serif font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed">
                {stotraLang === 'hi' 
                  ? 'कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः ।\nमूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nकुक्षौ तु सागराः सर्वे सप्तद्वीपा वसुंधरा ।\nऋग्वेदोऽथ यजुर्वेदः सामवेदो ह्यथर्वणः ॥\nअङ्गैश्च सहिताः सर्वे कलशाम्बुसमाश्रिताः ॥'
                  : 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ |\nಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ||\nಕುಕ್ಷೌ ತು ಸಾಗರಾಃ ಸರ್ವೇ ಸಪ್ತದ್ವೀಪಾ ವಸುಂಧರಾ |\nಋಗ್ವೇದೋಽಥ ಯಜುರ್ವೇದಃ ಸಾಮವೇದೋ ಹ್ಯಥರ್ವಣಃ ||\nಅಂಗೈಶ್ಚ ಸಹಿತಾಃ ಸರ್ವೇ ಕಲಶಾಂಬು ಸಮಾಶ್ರಿತಾಃ ||'}
              </p>
              <p className="text-[11.5px] text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
                <strong>{stotraLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                {stotraLang === 'kn'
                  ? 'ಕಲಶದ ಮುಖದಲ್ಲಿ ವಿಷ್ಣು, ಕಂಠದಲ್ಲಿ ಶಿವ, ಮೂಲದಲ್ಲಿ ಬ್ರಹ್ಮ, ಮಧ್ಯಭಾಗದಲ್ಲಿ ಸಕಲ ಮಾತೃಗಣಗಳು ನೆಲೆಸಿರುತ್ತಾರೆ. ಇದರ ಗರ್ಭದಲ್ಲಿ ಸಪ್ತ ಸಮುದ್ರಗಳು, ಸಪ್ತ ದ್ವೀಪಗಳು, ಪೃಥ್ವಿ ಹಾಗೂ ೪ ವೇದಗಳು ಸರ್ವಾಂಗ ಸಮೇತವಾಗಿ ಈ ಕಲಶೋದಕದಲ್ಲಿ ಸನ್ನಿಹಿತವಾಗಿರುತ್ತವೆ.'
                  : stotraLang === 'hi'
                  ? 'कलश के मुख में विष्णु, कण्ठ में रुद्र, मूल में ब्रह्मा एवं मध्य में समस्त मातृकाएं विराजमान हैं। इसके उदर में सातों समुद्र, सप्तद्वीप वसुन्धरा एवं चारों वेद सदेह वास करते हैं।'
                  : 'Lord Vishnu resides at the rim, Lord Shiva at the neck, Lord Brahma at the base, and Mother Divine in the centre. The oceans, islands, Earth, and all four Vedas sanctify this holy water.'}
              </p>
            </div>

            {/* Shloka 2: Gange Cha Yamune */}
            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 space-y-2 text-xs">
              <span className="text-[10.5px] font-bold uppercase text-amber-800 dark:text-amber-400">
                {stotraLang === 'kn' ? '೨. ಸಪ್ತ ಪವಿತ್ರ ನದಿಗಳ ತೀರ್ಥ ಆವಾಹನಾ ಶ್ಲೋಕ:' : '2. Sacred Rivers Invocation:'}
              </span>
              <p className="font-serif font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed">
                {stotraLang === 'hi'
                  ? 'गङ्गे च यमुने चैव गोदावरि सरस्वति ।\nनर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥'
                  : 'ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ |\nನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ||'}
              </p>
            </div>
          </div>

          {/* Section 4: Kalasha Visarjana (Udwasana) Vidhi */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 space-y-4">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-600 text-white text-xs">೩</span>
              <span>
                {stotraLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನೆ (ಉದ್ವಾಸನೆ) ಹಾಗೂ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ ವಿಧಾನ' : stotraLang === 'hi' ? 'कलश विसर्जन (उद्वासन) एवं तीर्थ प्रोक्षण विधान' : 'Kalasha Visarjana (Udwasana) & House Sanctification'}
              </span>
            </h4>

            <div className="space-y-3 text-xs leading-relaxed">
              {VIJAYADASHAMI_VISARJANA_DETAILS.kalashaVisarjanaSteps.map((step) => (
                <div key={step.step} className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {step.title[stotraLang]}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    {step.desc[stotraLang]}
                  </p>
                </div>
              ))}
            </div>

            {/* Direct CTA to 10th-Day Dashami Visarjana Muhurta Calculator */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-700 via-amber-700 to-orange-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md mt-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏺</span>
                <div>
                  <h5 className="font-bold text-sm">
                    {stotraLang === 'kn' ? '೧೦ನೇ ದಿನದ ದಶಮೀ ವಿಸರ್ಜನ ಮುಹೂರ್ತ ಗಣಕ (Dashami Visarjana Calculator)' : stotraLang === 'hi' ? '१०वें दिन का दशमी विसर्जन मुहूर्त गणक' : '10th-Day Dashami Visarjana Muhurta Calculator'}
                  </h5>
                  <p className="text-xs text-amber-100">
                    {stotraLang === 'kn'
                      ? 'ಆಯ್ದ ನಗರದ ಸೂರ್ಯೋದಯ-ಸೂರ್ಯಾಸ್ತ ಆಧಾರಿತ ಪ್ರಾತಃಕಾಲ, ಅಭಿಜಿತ್ ಮತ್ತು ವಿಜಯ ಮುಹೂರ್ತಗಳ ನಿಖರ ಲೆಕ್ಕಾಚಾರ.'
                      : 'Astronomical calculations for Pratahkaala, Abhijit and Vijaya exit windows based on city sunrise and sunset.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('visarjana')}
                className="px-4 py-2 bg-white text-stone-900 rounded-xl font-bold text-xs shrink-0 hover:bg-amber-100 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>{stotraLang === 'kn' ? 'ಮುಹೂರ್ತ ಗಣಕ ತೆರೆಯಿರಿ' : 'Open Calculator'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AKHANDA DEEPA STHAPANA & VISARJANA VIDHI */}
      {/* ========================================================================= */}
      {activeTab === 'akhandaDeepa' && (
        <div className="no-print rounded-2xl border-2 border-amber-500/70 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in">
          
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-amber-400/40">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/50 shrink-0">
                🪔
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-black/30 px-2 py-0.5 rounded">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.title[stotraLang]}
                </span>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-white mt-1">
                  {stotraLang === 'kn' ? 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ, ದಿಕ್ಕು & ಬೆಳಗಿಸುವ ಸಂಪೂರ್ಣ ವಿಧಿ' : stotraLang === 'hi' ? 'अखण्ड दीप स्थापना, दिशा एवं प्रज्वलन महाविधान' : 'Akhanda Deepa Sthapana & Direction Guide'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.subtitle[stotraLang]}
                </p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-black/30 p-1 rounded-xl border border-white/20">
              <span className="text-[10px] font-bold uppercase text-amber-200 px-1">Lang:</span>
              <button
                type="button"
                onClick={() => setStotraLang('kn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'kn' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setStotraLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'hi' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                संस्कृत
              </button>
              <button
                type="button"
                onClick={() => setStotraLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${stotraLang === 'en' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* RITUAL VISUALS: Responsive PDF Schematic for Akhanda Deepa & Vastu Compass */}
          <RitualVisuals activeVisual="akhandaDeepa" language={stotraLang} />

          {/* Direction Significance Banner (IMPORTANT) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-400 dark:border-amber-700/80 space-y-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 shrink-0">🧭</span>
              <div>
                <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                  {stotraLang === 'kn' ? 'ಪವಿತ್ರ ದಿಕ್ಕು & ವಾಸ್ತು ನಿಯಮ (Sacred Direction Guide):' : stotraLang === 'hi' ? 'पवित्र दिशा एवं वास्तु विधान:' : 'Sacred Direction & Vastu Rules:'}
                </h5>
                <p className="font-medium text-xs text-stone-800 dark:text-stone-200">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.directionSignificance[stotraLang]}
                </p>
              </div>
            </div>

            {/* Quick Summary Grid for Seating & Hand Side Deepa Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  🏠 {stotraLang === 'kn' ? 'ದೇವರ ಕೋಣೆ ದಿಕ್ಕು:' : 'Pooja Room Direction:'}
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 block text-[11.5px]">
                  {stotraLang === 'kn' ? 'ಈಶಾನ್ಯ ಕೋನ (North-East - ಈಶಾನ ಮೂಲೆ)' : 'North-East (Ishanya / Deva Moola)'}
                </span>
                <p className="text-[10.5px] text-stone-600 dark:text-stone-400 mt-1">
                  {stotraLang === 'kn' ? 'ಪರ್ಯಾಯ: ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ಗೋಡೆ. ನೈಋತ್ಯ (ನೈಋತ್ಯ ಕೋನ) ಸಂಪೂರ್ಣ ನಿಷಿದ್ಧ.' : 'Alternative: East or North. Avoid South-West.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  🧘 {stotraLang === 'kn' ? 'ಭಕ್ತರ ಮುಖಸ್ಥಿತಿ (Seating):' : 'Devotee Seating Direction:'}
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-400 block text-[11.5px]">
                  {stotraLang === 'kn' ? 'ಪೂರ್ವ ಮುಖ (East Facing) — ಅತ್ಯುತ್ತಮ' : 'East-Facing (Purva Mukha) — Supreme'}
                </span>
                <p className="text-[10.5px] text-stone-600 dark:text-stone-400 mt-1">
                  {stotraLang === 'kn' ? 'ಸೂರ್ಯನ ತೇಜಸ್ಸು, ಜ್ಞಾನ ಮತ್ತು ಆಯುಷ್ಯ ವೃದ್ಧಿ. (ದಕ್ಷಿಣ ಮುಖವಾಗಿ ಎಂದಿಗೂ ಕುಳಿತು ಪೂಜಿಸಬೇಡಿ).' : 'Channels solar prana and wisdom. (Never sit facing South).'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  🪔 {stotraLang === 'kn' ? 'ದೀಪದ ಬಲ-ಎಡ ಕೈ ನಿಯಮ:' : 'Deepa Right vs Left Hand:'}
                </span>
                <span className="font-black text-amber-900 dark:text-amber-200 block text-[11.5px]">
                  {stotraLang === 'kn' ? 'ಎಡಗೈ ಕಡೆ = ಉತ್ತರ = ದೇವತೆಯ ಬಲ' : 'Left Hand = North = Deity’s Right'}
                </span>
                <p className="text-[10.5px] text-stone-600 dark:text-stone-400 mt-1">
                  {stotraLang === 'kn' ? 'ತುಪ್ಪದ/ಅಖಂಡ ದೀಪವನ್ನು ನಿಮ್ಮ ಎಡಗೈ ಕಡೆ (ಉತ್ತರಕ್ಕೆ) ಇಡಿ. ಎಣ್ಣೆ ದೀಪವನ್ನು ಬಲಗೈ ಕಡೆ (ದಕ್ಷಿಣಕ್ಕೆ) ಇಡಿ.' : 'Place Ghee/Akhanda deepa on Left (North); Oil lamp on Right (South).'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. Required Materials (ಸಾಮಗ್ರಿಗಳು) */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೧</span>
              <span>
                {stotraLang === 'kn' ? 'ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು (Essential Materials)' : stotraLang === 'hi' ? 'आवश्यक सामग्री (Essential Materials)' : 'Essential Materials for Akhanda Deepa'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {AKHANDA_DEEPA_STHAPANA_DETAILS.samagriList.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-850 flex items-start gap-3 shadow-2xs"
                >
                  <span className="text-xl shrink-0 mt-0.5">{item.icon || '🪔'}</span>
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-xs block">
                      {item.name[stotraLang]}
                    </span>
                    <p className="text-[11.5px] text-stone-600 dark:text-stone-400 leading-snug">
                      {item.details[stotraLang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Step-by-Step Installation & Lighting Procedure */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
              <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೨</span>
              <span>
                {stotraLang === 'kn' ? 'ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ಬೆಳಗಿಸುವ ವಿಧಾನ (Installation & Lighting)' : stotraLang === 'hi' ? 'दीप स्थापना एवं प्रज्वलन विधि' : 'Installation & Consecration Procedure'}
              </span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {AKHANDA_DEEPA_STHAPANA_DETAILS.stepByStepVidhi.map((step) => (
                <div 
                  key={step.stepNumber}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className="font-serif">{step.title[stotraLang]}</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                    {step.instruction[stotraLang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Sacred Shlokas during Lighting */}
          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border-2 border-amber-400 dark:border-amber-700 space-y-3 shadow-2xs">
            <h4 className="font-serif font-black text-base text-amber-950 dark:text-amber-200 flex items-center gap-2">
              <span>🔥</span>
              <span>
                {stotraLang === 'kn' ? 'ದೀಪ ಹಚ್ಚುವಾಗ ಹೇಳಬೇಕಾದ ಶ್ಲೋಕ (Sacred Lighting Shlokas)' : stotraLang === 'hi' ? 'दीप प्रज्वलन मन्त्र' : 'Sacred Mantras during Deepa Prajwalana'}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                  {stotraLang === 'kn' ? 'ಶ್ಲೋಕ ೧ (Deepa Jyoti Parabrahma):' : 'Shloka 1:'}
                </span>
                <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                  {stotraLang === 'hi' 
                    ? 'दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ।\nदीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥'
                    : 'ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ |\nದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                  <strong>{stotraLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                  {stotraLang === 'kn'
                    ? 'ದೀಪದ ಜ್ಯೋತಿಯೇ ಪರಬ್ರಹ್ಮ, ಜ್ಯೋತಿಯೇ ಜನಾರ್ದನ. ಈ ಜ್ಯೋತಿಯು ನನ್ನ ಸಮಸ್ತ ಪಾಪಗಳನ್ನು ಹೋಗಲಾಡಿಸಲಿ; ಪವಿತ್ರ ದೀಪಜ್ಯೋತಿಗೆ ನನ್ನ ನಮಸ್ಕಾರ.'
                    : 'The flame of this sacred lamp is Supreme Brahman and Lord Janardana. May this effulgent flame dissolve all sins; salutations to the sacred Deepa Jyoti.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                  {stotraLang === 'kn' ? 'ಶ್ಲೋಕ ೨ (Shubham Karoti Kalyanam):' : 'Shloka 2:'}
                </span>
                <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                  {stotraLang === 'hi'
                    ? 'शुभं करोति कल्याणमारोग्यं धनसम्पदः ।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥'
                    : 'ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ |\nಶತ್ರುಬುದ್ಧಿವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                  <strong>{stotraLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                  {stotraLang === 'kn'
                    ? 'ಶುಭ, ಕಲ್ಯಾಣ, ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಸಂಪತ್ತನ್ನು ಕರುಣಿಸುವ ಹಾಗೂ ದುಷ್ಟಬುದ್ಧಿ-ಶತ್ರುಭಾವನೆಯನ್ನು ನಾಶಮಾಡುವ ಮಂಗಳ ಜ್ಯೋತಿಗೆ ನಮಸ್ಕಾರ.'
                    : 'Bestowing auspiciousness, supreme welfare, radiant health, and abundant wealth while removing all negative thoughts; salutations to the divine flame.'}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Golden Rules for Maintenance */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 space-y-3 text-xs leading-relaxed">
            <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೪</span>
              <span>
                {stotraLang === 'kn' ? 'ಮುಖ್ಯವಾಗಿ ಗಮನಿಸಬೇಕಾದ ನಿಯಮಗಳು (Golden Rules)' : stotraLang === 'hi' ? 'महत्त्वपूर्ण सावधानियां एवं नियम' : 'Sacred Rules for Maintaining Akhanda Deepa'}
              </span>
            </h4>

            <div className="space-y-2">
              {AKHANDA_DEEPA_STHAPANA_DETAILS.goldenRules.map((rule) => (
                <div key={rule.ruleNumber} className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {rule.ruleNumber}. {rule.title[stotraLang]}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400">
                    {rule.instruction[stotraLang]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Visarjana */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
            <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300">
              {stotraLang === 'kn' ? '೫. ಅಖಂಡ ದೀಪ ವಿಸರ್ಜನೆ (Deepa Visarjana):' : '5. Akhanda Deepa Visarjana:'}
            </h5>
            <p className="leading-relaxed">
              {stotraLang === 'kn'
                ? 'ವ್ರತದ ಕೊನೆಯಲ್ಲಿ ದೀಪವನ್ನು ಎಂದಿಗೂ ಬಾಯಿಯಿಂದ ಊದಿ ಆರಿಸಬಾರದು. ಎಣ್ಣೆ/ತುಪ್ಪ ತಾನಾಗಿಯೇ ಶಾಂತವಾಗಲು ಬಿಡಬೇಕು, ಅಥವಾ ಹೂವಿನಿಂದ ಹಾಲು/ತುಪ್ಪದ ಹನಿ ಚಿಮುಕಿಸಿ ಗೌರವಪೂರ್ವಕವಾಗಿ ಶಾಂತಗೊಳಿಸಬೇಕು. ಆಧಾರ ಪೀಠದ ಧಾನ್ಯಗಳನ್ನು ಪ್ರಸಾದವಾಗಿ ಅಡುಗೆಯಲ್ಲಿ ಬಳಸಬೇಕು.'
                : 'At the conclusion of the vrata, the lamp must NEVER be blown out. Let it extinguish naturally as fuel finishes, or gently calm the flame using a flower dipped in milk/ghee. The foundation grains should be cooked as Prasad.'}
            </p>

            {/* Direct CTA to 4x4 Deepa & Direction Guidelines */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-amber-300 dark:border-stone-700">
              <span className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                {stotraLang === 'kn' ? 'ದೀಪದ ದಿಕ್ಕು, ಪೂಜಾ ಕೋಣೆ ಮತ್ತು ಎಡ/ಬಲ ನಿಯಮಾವಳಿ (4×4 Grid):' : 'Pooja Room, Seating Direction & Left/Right Deepa Guidelines (4×4 Grid):'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('deepaGuidelines')}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>🧭 {stotraLang === 'kn' ? '4×4 ದೀಪ ಮಾರ್ಗದರ್ಶಿ ವೀಕ್ಷಿಸಿ' : 'View 4×4 Deepa Matrix'}</span>
                <span>→</span>
              </button>
            </div>

            {/* Direct CTA to 10th-Day Dashami Visarjana Muhurta Calculator */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-amber-300 dark:border-stone-700">
              <span className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                {stotraLang === 'kn' ? '೧೦ನೇ ದಿನದ ದಶಮೀ ವಿಸರ್ಜನ ಮುಹೂರ್ತ ಗಣಕ (Dashami Visarjana Muhurta Calculator):' : '10th-Day Dashami Visarjana Muhurta Calculator:'}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('visarjana')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>🏺 {stotraLang === 'kn' ? 'ವಿಸರ್ಜನ ಮುಹೂರ್ತ ಲೆಕ್ಕಾಚಾರ' : 'Calculate Exit Times'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: POOJA DEEPA GUIDELINES (4x4 Coordinate Matrix of Room & Seating Directions) */}
      {/* ========================================================================= */}
      {activeTab === 'deepaGuidelines' && (
        <div className="no-print space-y-6 animate-in fade-in">
          <PoojaDeepaGuidelinesSection 
            language={stotraLang} 
            onNavigateToTab={(tab) => {
              if (tab === 'visuals') setActiveTab('visuals');
              else if (tab === 'akhandaDeepa') setActiveTab('akhandaDeepa');
              else if (tab === 'visarjana') setActiveTab('visarjana');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: 10TH-DAY DASHAMI VISARJANA MUHURTA CALCULATOR (Kannada, Sanskrit, English) */}
      {/* ========================================================================= */}
      {activeTab === 'visarjana' && (
        <div className="no-print space-y-6 animate-in fade-in">
          <VisarjanaMuhurtaCalculator
            currentLang={currentLang}
            selectedCity={selectedCity}
            onOpenGoogleMap={onOpenGoogleMap}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: RITUAL VISUALS (Dedicated Full Schematics for Kalasha & Akhanda Deepa) */}
      {/* ========================================================================= */}
      {activeTab === 'visuals' && (
        <div className="no-print space-y-6 animate-in fade-in">
          <RitualVisuals activeVisual="both" language={stotraLang} />
        </div>
      )}

      {/* TAB 6: 60 SAMVATSARAS TABLE (PDF Page 3) */}
      {activeTab === 'samvatsara' && (
        <div className="no-print rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              ಸಂವತ್ಸರಗಳು (The 60 Samvatsara Cycles as per PDF Page 3)
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              Cycle of 60 Lunar Years
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1 - 30 */}
            <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2 text-center w-12">ಸಂಖ್ಯೆ</th>
                    <th className="p-2">ಸಂವತ್ಸರ</th>
                    <th className="p-2 text-right">ಇಂಗ್ಲಿಷ್ ವರ್ಷ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {SAMVATSARA_LIST.slice(0, 30).map(s => (
                    <tr key={s.index} className={panchangDay.samvatsaraIndex === s.index ? 'bg-amber-500/15 font-bold text-amber-900 dark:text-amber-200' : ''}>
                      <td className="p-2 text-center font-bold">{s.index}</td>
                      <td className="p-2">{s.nameKn} ({s.nameEn})</td>
                      <td className="p-2 text-right font-mono">{s.sampleYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 31 - 60 */}
            <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2 text-center w-12">ಸಂಖ್ಯೆ</th>
                    <th className="p-2">ಸಂವತ್ಸರ</th>
                    <th className="p-2 text-right">ಇಂಗ್ಲಿಷ್ ವರ್ಷ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {SAMVATSARA_LIST.slice(30, 60).map(s => (
                    <tr key={s.index} className={panchangDay.samvatsaraIndex === s.index ? 'bg-amber-500/15 font-bold text-amber-900 dark:text-amber-200' : ''}>
                      <td className="p-2 text-center font-bold">{s.index}</td>
                      <td className="p-2">{s.nameKn} ({s.nameEn})</td>
                      <td className="p-2 text-right font-mono">{s.sampleYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RASHI, NAKSHATRA & CHARANA LETTERS (PDF Page 4) */}
      {activeTab === 'nakshatra' && (
        <div className="no-print rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              ರಾಶಿ, ರಾಶ್ಯಾಧಿಪತಿ, ನಕ್ಷತ್ರಗಳು ಮತ್ತು ಚರಣ (PDF Page 4)
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              27 Nakshatras & Pada Syllables
            </span>
          </div>

          <div className="overflow-x-auto border border-stone-200 dark:border-stone-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-2.5 text-center w-12">ಸಂಖ್ಯೆ</th>
                  <th className="p-2.5">ರಾಶಿ (Rashi)</th>
                  <th className="p-2.5">ರಾಶ್ಯಾಧಿಪತಿ (Lord)</th>
                  <th className="p-2.5">ನಕ್ಷತ್ರಗಳು (Nakshatra)</th>
                  <th className="p-2.5">ಚರಣ ಅಕ್ಷರಗಳು (Charana Syllables)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {RASHI_NAKSHATRA_CHART.map((r) => (
                  <tr key={r.index} className="hover:bg-amber-500/5">
                    <td className="p-2.5 text-center font-bold">{r.index}</td>
                    <td className="p-2.5 font-semibold">{r.rashiKn} ({r.rashiEn})</td>
                    <td className="p-2.5 text-stone-600 dark:text-stone-300">{r.lordKn}</td>
                    <td className="p-2.5 font-bold text-amber-800 dark:text-amber-300">{r.nakshatraKn}</td>
                    <td className="p-2.5 font-mono text-stone-700 dark:text-stone-300">{r.charanaSyllables}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BHARATIYA SANKHYA SHASTRA (PDF Page 5) */}
      {activeTab === 'sankhya' && (
        <div className="no-print rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              ಭಾರತೀಯ ಸಂಖ್ಯಾ ಶಾಸ್ತ್ರ (Bharatiya Sankhya Shastra - PDF Page 5)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ancient Vedic numerical power scale up to 10⁶² (Mahaugha).
            </p>
          </div>

          <div className="overflow-x-auto border border-stone-200 dark:border-stone-700 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">ಸಂಸ್ಕೃತ (Transliteration)</th>
                  <th className="p-2.5">ಭಾರತೀಯ ಸಂಖ್ಯೆ</th>
                  <th className="p-2.5 text-center">Power Notation</th>
                  <th className="p-2.5">Short Scale Arabic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-mono">
                {BHARATIYA_SANKHYA.map((num, i) => (
                  <tr key={i} className="hover:bg-amber-500/5">
                    <td className="p-2.5 font-serif font-bold text-stone-900 dark:text-stone-100">{num.sanskrit} ({num.kannadaTranslit})</td>
                    <td className="p-2.5">{num.indianNotation}</td>
                    <td className="p-2.5 text-center font-bold text-red-600 dark:text-red-400">{num.power}</td>
                    <td className="p-2.5">{num.arabicName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: PANCHAPEETHAGALA PRAVARA (PDF Page 6) */}
      {activeTab === 'peetha' && (
        <div className="no-print rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              ಪಂಚಪೀಠಗಳ ಸೂತ್ರ ಗೋತ್ರಗಳ ಪ್ರವರ (Panchapeetha Sutra Gotragala Pravara - PDF Page 6)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Sacred lineage and attributes of the Five Holy Peethas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {PANCHA_PEETHA_TABLE.map((p, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2 shadow-2xs"
              >
                <div className="border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    ಪೀಠ {idx + 1}
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {p.peethaKn}
                  </h4>
                </div>

                <div className="space-y-1 text-stone-700 dark:text-stone-300">
                  <div><strong>ಪರಶಿವನ ಮುಖ:</strong> {p.mukha}</div>
                  <div><strong>ಗಣಾಧೀಶ್ವರರು:</strong> {p.ganadheeshwara}</div>
                  <div><strong>ಉಗಮ ಸ್ಥಾನ:</strong> {p.ugamaSthana}</div>
                  <div><strong>ಗೋತ್ರ ಪುರುಷರು:</strong> {p.gotraPurusha}</div>
                  <div><strong>ಗೋತ್ರ:</strong> {p.gotra}</div>
                  <div><strong>ಸೂತ್ರ:</strong> {p.sutra}</div>
                  <div><strong>ತತ್ತ್ವ:</strong> {p.tattva}</div>
                  <div><strong>ದಿಕ್ಕು:</strong> {p.dik}</div>
                  <div><strong>ಸಿಂಹಾಸನ:</strong> {p.simhasana}</div>
                  <div><strong>ದಂಡ:</strong> {p.danda}</div>
                  <div><strong>ಬೀಜಾಕ್ಷರ:</strong> {p.beejakshara}</div>
                  <div><strong>ಮಂತ್ರ:</strong> {p.mantra}</div>
                  <div><strong>ವರ್ಣ:</strong> {p.varna}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation: Back to Calendar Button */}
      <div className="no-print pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <button
          onClick={onBackToCalendar}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ (Back to Calendar)</span>
        </button>

        <button
          onClick={handlePrintPdf}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Export Sankalpa Stotra Only to PDF</span>
        </button>
      </div>

    </div>
  );
};
