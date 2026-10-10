import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Languages, 
  Moon, 
  Sun, 
  MapPin, 
  ShieldCheck, 
  Cloud, 
  LayoutGrid, 
  Lock, 
  KeyRound,
  Sparkles,
  Search,
  X,
  BookOpen,
  ArrowRight,
  FileCode,
  Compass,
  Clock,
  Bell
} from 'lucide-react';
import { CityLocation, Festival, Language, MantraItem } from '../types';
import { CITIES } from '../utils/panchanga';
import { FESTIVALS_CATALOG } from '../utils/festivals';
import { 
  requestAndTriggerTestNotification, 
  isDailyNotificationEnabled, 
  getNotificationPermission 
} from '../utils/dailyNotification';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  hcmmLogoUrl: string;
  onOpenHcmmAdmin: () => void;
  onOpenBiometric: () => void;
  isBiometricLocked: boolean;
  onOpenCloudSync: () => void;
  onOpenWidgetModal: () => void;
  onOpenPageSourceCode?: () => void;
  activeView: 'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta';
  onNavigate: (view: 'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta') => void;
  mantrasList: MantraItem[];
  onSelectFestivalFromSearch: (fest: Festival) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  selectedCity,
  onSelectCity,
  hcmmLogoUrl,
  onOpenHcmmAdmin,
  onOpenBiometric,
  isBiometricLocked,
  onOpenCloudSync,
  onOpenWidgetModal,
  onOpenPageSourceCode,
  activeView,
  onNavigate,
  mantrasList,
  onSelectFestivalFromSearch
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dailyNotifyActive, setDailyNotifyActive] = useState<boolean>(() => {
    return isDailyNotificationEnabled() && getNotificationPermission() === 'granted';
  });

  const handleToggleDailyNotification = async () => {
    const success = await requestAndTriggerTestNotification(selectedCity, currentLang);
    if (success) {
      setDailyNotifyActive(true);
      alert(
        currentLang === 'kn'
          ? `ದೈನಂದಿನ ಪಂಚಾಂಗ ಅಧಿಸೂಚನೆ ಸಕ್ರಿಯಗೊಂಡಿದೆ! ಪ್ರತಿದಿನ ${selectedCity.nameLocalized?.kn || selectedCity.name} ನಗರದ ತಿಥಿ, ನಕ್ಷತ್ರ ಮತ್ತು ಹಬ್ಬದ ವಿವರಗಳು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಗುತ್ತವೆ.`
          : `Daily Panchanga Notification is enabled! You will receive daily alerts with Tithi, Nakshatra, and festival info for ${selectedCity.name}.`
      );
    } else {
      alert(
        currentLang === 'kn'
          ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅಧಿಸೂಚನೆ (Notification) ಅನುಮತಿಯನ್ನು ನೀಡಿ.'
          : 'Please allow notification permissions in your browser to receive daily Panchanga alerts.'
      );
    }
  };

  const getTitle = () => {
    switch (currentLang) {
      case 'kn':
        return {
          main: 'ವೈದಿಕ ಪಂಚಾಂಗ ಮತ್ತು ಲಗ್ನ ಕುಂಡಲಿ',
          sub: 'ಹಿಂದೂ ಕ್ಯಾಲೆಂಡರ್ • ಸಂಕಲ್ಪ ವಿಧಿ • ಮಂತ್ರ ಮಂಜರಿ (೧೯೦೦ - ಭವಿಷ್ಯ)'
        };
      case 'hi':
        return {
          main: 'वैदिक पंचांग एवं लग्न कुण्डली',
          sub: 'हिन्दू कैलेंडर • संकल्प विधि • मन्त्र मंजरी (१९०० - भविष्य)'
        };
      default:
        return {
          main: 'Vedic Panchanga & Lagna Kundali',
          sub: 'Hindu Calendar • Sankalpa Vidhi • Mantras (1900 - Future)'
        };
    }
  };

  const title = getTitle();

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { festivals: [], mantras: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedFestivals = FESTIVALS_CATALOG.filter(f => 
      f.name.en.toLowerCase().includes(q) ||
      f.name.kn.toLowerCase().includes(q) ||
      f.name.hi.toLowerCase().includes(q) ||
      f.shortDesc.en.toLowerCase().includes(q)
    );

    const matchedMantras = mantrasList.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );

    return { festivals: matchedFestivals, mantras: matchedMantras };
  }, [searchQuery, mantrasList]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenHcmmAdmin}
                title="HCMM Creator Portal & Full HTML Source Code"
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                {hcmmLogoUrl ? (
                  <img
                    src={hcmmLogoUrl}
                    alt="HCMM Logo"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-900 rounded-[10px] flex flex-col items-center justify-center text-amber-300 font-extrabold text-xs tracking-tighter">
                    <span className="text-[13px] leading-tight font-serif text-amber-400">HCMM</span>
                    <span className="text-[8px] text-amber-200/80 -mt-0.5">VEDIC</span>
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full ring-2 ring-white dark:ring-stone-900 group-hover:bg-amber-400">
                  <KeyRound className="w-2.5 h-2.5" />
                </span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-stone-900 dark:text-amber-100 flex items-center gap-2">
                    <span>{title.main}</span>
                  </h1>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    HCMM
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                  {title.sub}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="relative flex-1 max-w-md mx-auto lg:mx-4 w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder={currentLang === 'kn' ? 'ಹಬ್ಬಗಳು, ಮಂತ್ರಗಳು, ದಿನಾಂಕ ಹುಡುಕಿ (Navaratri, Deepavali, etc.)...' : currentLang === 'hi' ? 'त्योहार, मन्त्र या तिथि खोजें...' : 'Search festivals, mantras, or dates...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-amber-500 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-1.5 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-2">
                
                {/* Festivals Results */}
                {searchResults.festivals.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 px-2 py-1 block">
                      Festivals ({searchResults.festivals.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.festivals.map(fest => (
                        <button
                          key={fest.id}
                          onClick={() => {
                            onSelectFestivalFromSearch(fest);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-700/60 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-600">
                              {fest.name[currentLang]}
                            </div>
                            <div className="text-[10px] text-stone-500 line-clamp-1">
                              {fest.shortDesc[currentLang]}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mantras Results */}
                {searchResults.mantras.length > 0 && (
                  <div className="border-t border-stone-100 dark:border-stone-700 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 px-2 py-1 block">
                      Mantras ({searchResults.mantras.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.mantras.map(mantra => (
                        <button
                          key={mantra.id}
                          onClick={() => {
                            onNavigate('mantras');
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-50 dark:hover:bg-stone-700/60 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-600">
                              {mantra.title}
                            </div>
                            <div className="text-[10px] text-stone-500 line-clamp-1">
                              {mantra.category} • {mantra.description}
                            </div>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.festivals.length === 0 && searchResults.mantras.length === 0 && (
                  <p className="text-xs text-stone-400 text-center py-4">
                    No matching festival or mantra found for "{searchQuery}".
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center flex-wrap gap-2 justify-end">
            
            {/* View switcher buttons - Dynamically scrollable & adaptable on mobile */}
            <div className="flex items-center overflow-x-auto max-w-full pb-0.5 scrollbar-none rounded-lg border border-amber-300/60 dark:border-stone-700 bg-amber-50/50 dark:bg-stone-800/80 p-0.5 gap-0.5 sm:inline-flex shrink-0">
              <button
                onClick={() => onNavigate('calendar')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'calendar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್' : currentLang === 'hi' ? 'कैलेंडर' : 'Calendar'}</span>
              </button>

              <button
                onClick={() => onNavigate('mantras')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'mantras'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{currentLang === 'kn' ? 'ಮಂತ್ರಗಳು' : currentLang === 'hi' ? 'मन्त्र' : 'Mantras'}</span>
              </button>

              <button
                onClick={() => onNavigate('sankalpa')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'sankalpa'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>{currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ವಿಧಿ' : currentLang === 'hi' ? 'संकल्प विधि' : 'Sankalpa'}</span>
              </button>

              <button
                onClick={() => onNavigate('kundali')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'kundali'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <span>{currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ' : currentLang === 'hi' ? 'लग्न कुण्डली' : 'Kundali'}</span>
              </button>

              <button
                onClick={() => onNavigate('gochar')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'gochar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ' : currentLang === 'hi' ? 'ग्रह गोचर' : 'Gochar'}</span>
              </button>

              <button
                onClick={() => onNavigate('muhurta')}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 ${
                  activeView === 'muhurta'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="Auspicious Timings & Muhurta Finder"
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{currentLang === 'kn' ? 'ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'मुहूर्त' : 'Muhurta'}</span>
              </button>
            </div>

            {/* Location selector dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
                title="Change Regional City for Sunrise & Sunset calculation"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">
                  {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}
                </span>
              </button>

              {showCityDropdown && (
                <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-700 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಸ್ಥಳ ಆಯ್ಕೆ ಮಾಡಿ' : currentLang === 'hi' ? 'स्थान चुनें' : 'Select Location'}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {CITIES.map(c => (
                      <button
                        key={c.name}
                        onClick={() => {
                          onSelectCity(c);
                          setShowCityDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                          selectedCity.name === c.name
                            ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                        }`}
                      >
                        <span>{c.nameLocalized ? c.nameLocalized[currentLang] : c.name}</span>
                        <span className="text-[10px] text-stone-400">
                          {c.stateLocalized ? c.stateLocalized[currentLang] : c.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5 shadow-2xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentLang === 'en'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="English (Default)"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('kn')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentLang === 'kn'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="ಕನ್ನಡ (Kannada)"
              >
                ಕನ್ನಡ
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentLang === 'hi'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="हिंदी (Hindi)"
              >
                हिंदी
              </button>
            </div>

            {/* Home Screen Widget Preview */}
            <button
              onClick={onOpenWidgetModal}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
              title="Home Screen Widget & Quick Access"
            >
              <LayoutGrid className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>

            {/* Daily Browser Notification Toggle / Test */}
            <button
              onClick={handleToggleDailyNotification}
              className={`p-2 rounded-lg border transition-colors shadow-2xs relative ${
                dailyNotifyActive 
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
              }`}
              title={
                currentLang === 'kn'
                  ? 'ದೈನಂದಿನ ಪಂಚಾಂಗ ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆ (ತಿಥಿ, ನಕ್ಷತ್ರ, ಹಬ್ಬದ ವಿವರಗಳು)'
                  : currentLang === 'hi'
                  ? 'दैनिक पंचांग ब्राउज़र नोटिफिकेशन (तिथि, नक्षत्र, पर्व)'
                  : 'Daily Browser Panchanga Notification (Tithi, Nakshatra, Festivals)'
              }
            >
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {dailyNotifyActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900" />
              )}
            </button>

            {/* Cloud Sync & Export */}
            <button
              onClick={onOpenCloudSync}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
              title="Cross-Device Cloud Sync & Backup"
            >
              <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>

            {/* Biometric Privacy */}
            <button
              onClick={onOpenBiometric}
              className={`p-2 rounded-lg border transition-colors shadow-2xs ${
                isBiometricLocked
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title="Biometric & PIN Security"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
