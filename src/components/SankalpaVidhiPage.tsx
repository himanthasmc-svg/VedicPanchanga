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
import { getPanchangaForDate, getLocalizedPlaceName, CITIES } from '../utils/panchanga';

interface SankalpaVidhiPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onBackToCalendar: () => void;
  onSelectCity?: (city: CityLocation) => void;
}

export const SankalpaVidhiPage: React.FC<SankalpaVidhiPageProps> = ({
  currentLang,
  selectedCity,
  onBackToCalendar,
  onSelectCity
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
  const [deityName, setDeityName] = useState<string>('ಶ್ರೀ ಇಷ್ಟದೇವತಾ / ಶ್ರೀ ದುರ್ಗಾ / ಶ್ರೀ ಪರಮೇಶ್ವರ');
  const [granthaName, setGranthaName] = useState<string>('ಶ್ರೀ ದೇವೀ ಮಾಹಾತ್ಮ್ಯೆ / ಶ್ರೀ ರುದ್ರ ಪಾರಾಯಣ');

  // Active view tab for the PDF reference sections
  const [activeTab, setActiveTab] = useState<'stotra' | 'vidhana' | 'samvatsara' | 'nakshatra' | 'sankhya' | 'peetha'>('stotra');
  const [stotraLang, setStotraLang] = useState<Language>(currentLang);
  const [copiedStotra, setCopiedStotra] = useState(false);

  // Sync stotraLang with currentLang when currentLang changes
  useEffect(() => {
    setStotraLang(currentLang);
  }, [currentLang]);

  // Calculate day-dependent Hindu Panchanga elements automatically for selected date!
  const panchangDay: PanchangaDay = useMemo(() => {
    const parts = selectedDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return getPanchangaForDate(d, selectedCity);
  }, [selectedDateStr, selectedCity]);

  // Localized Place Name in the active stotra language
  const resolvedCityName = useMemo(() => {
    if (customCityName.trim()) return customCityName.trim();
    return getLocalizedPlaceName(selectedCity, stotraLang);
  }, [customCityName, selectedCity, stotraLang]);

  // Localized Dashed numbers 1 through 9 exact mapping from PDF:
  const dashedValues = useMemo(() => {
    if (stotraLang === 'hi') {
      return {
        c1: resolvedCityName,
        c2: panchangDay.samvatsara.hi,
        c3: panchangDay.ayana.hi,
        c4: `${panchangDay.masa.hi} ${panchangDay.isAdhikaMasa ? '(अधिक)' : ''}`,
        c5: panchangDay.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण',
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
        c5: panchangDay.paksha === 'Shukla' ? 'Shukla' : 'Krishna',
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
      c5: panchangDay.paksha === 'Shukla' ? 'ಶುಕ್ಲ' : 'ಕೃಷ್ಣ',
      c6: panchangDay.tithiSanskrit || panchangDay.tithiName.kn,
      c7: panchangDay.vara.kn.replace('ವಾರ', ''),
      c8: panchangDay.nakshatra.kn.split('(')[0].trim(),
      c9: panchangDay.suryaRashi.kn
    };
  }, [stotraLang, resolvedCityName, panchangDay]);

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
      
      {/* Top Banner & Date Picker Bar (Hidden in Print) */}
      <div className="no-print rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white p-6 shadow-xl border border-red-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4" />
              <span>SANKALPA VIDHI • AS PER ATTACHED PDF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ಮಂತ್ರ ಮತ್ತು ಪೂಜಾ ವಿಧಾನ' : currentLang === 'hi' ? 'संकल्प मन्त्र एवं पूजन विधान' : 'Sankalpa Mantra & Pooja Vidhi'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? 'ದಿನಾಂಕ ಆಯ್ಕೆ ಮಾಡಿದಾಗ ೨, ೩, ೪, ೫, ೬, ೭, ೮, ೯ ವಿವರಗಳು ಹಿಂದೂ ಪಂಚಾಂಗದಂತೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿ ನಮೂದಾಗುತ್ತವೆ.'
                : currentLang === 'hi'
                ? 'दिनांक चुनने पर २, ३, ४, ५, ६, ७, ८, ९ क्रमांक के तिथि-वार-नक्षत्र विवरण स्वतः नीले रंग में प्रविष्ट हो जाते हैं।'
                : 'Selecting any date automatically populates lines 2-9 in prominent blue color based on authentic astronomical panchang.'}
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

              {/* Optional Custom Place Override */}
              <input
                type="text"
                value={customCityName}
                onChange={(e) => setCustomCityName(e.target.value)}
                placeholder={getLocalizedPlaceName(selectedCity, stotraLang)}
                title="Custom village / place override (leave blank to use auto localized city)"
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

            {/* Language Dropdown Selector in Header */}
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20">
              <Languages className="w-4 h-4 text-amber-300" />
              <select
                value={stotraLang}
                onChange={(e) => setStotraLang(e.target.value as Language)}
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

      {/* Reference Tabs Navigation (Hidden in Print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('stotra')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stotra'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ಸಂಕಲ್ಪ ಮಂತ್ರ (Auto-filled Stotra)</span>
        </button>

        <button
          onClick={() => setActiveTab('vidhana')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'vidhana'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ಸಂಕಲ್ಪ ವಿಧಾನ (Instructions: Kn, Hi, En)</span>
        </button>

        <button
          onClick={() => setActiveTab('samvatsara')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'samvatsara'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>೬೦ ಸಂವತ್ಸರಗಳು (PDF Page 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('nakshatra')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'nakshatra'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ರಾಶಿ, ಅಧಿಪತಿ & ನಕ್ಷತ್ರ ಚರಣ (PDF Page 4)</span>
        </button>

        <button
          onClick={() => setActiveTab('sankhya')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sankhya'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <span>ಭಾರತೀಯ ಸಂಖ್ಯಾ ಶಾಸ್ತ್ರ (PDF Page 5)</span>
        </button>

        <button
          onClick={() => setActiveTab('peetha')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'peetha'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
          }`}
        >
          <span>ಪಂಚಪೀಠ ಪ್ರವರ (PDF Page 6)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE SANKALPA STOTRA CONTAINER (Export to PDF Target) */}
      {/* ========================================================================= */}
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
                onClick={() => setStotraLang('kn')}
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
                onClick={() => setStotraLang('hi')}
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
                onClick={() => setStotraLang('en')}
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

        {/* Optional Editable Fields for Puja Devata & Grantha */}
        <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 text-xs">
          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              — {stotraLang === 'kn' ? 'ಪೂಜೆ ಮಾಡುವ ದೇವರ ಹೆಸರು' : stotraLang === 'hi' ? 'पूज्य देवता का नाम' : 'Worshipped Deity Name'} (Deity Name) —
            </label>
            <input
              type="text"
              value={deityName}
              onChange={(e) => setDeityName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
              — {stotraLang === 'kn' ? 'ಓದುವ ಗ್ರಂಥದ ಅಥವಾ ಮಂತ್ರದ ಹೆಸರು' : stotraLang === 'hi' ? 'पठित ग्रन्थ अथवा मन्त्र का नाम' : 'Recited Scripture/Mantra Name'} (Grantha/Mantra Name) —
            </label>
            <input
              type="text"
              value={granthaName}
              onChange={(e) => setGranthaName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
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
                  {stotraLang === 'kn' ? 'ವ್ರತ ಮಾಡುವ ಊರು (Current City/Region)' : stotraLang === 'hi' ? 'स्थान / नगर (Current City/Region)' : 'Place / City (Current City/Region)'}
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

      {/* ========================================================================= */}
      {/* OTHER TABS FROM PDF (Hidden in Print) */}
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

      {/* TAB 3: 60 SAMVATSARAS TABLE (PDF Page 3) */}
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
