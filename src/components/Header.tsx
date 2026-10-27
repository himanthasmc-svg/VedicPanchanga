import React, { useState, useMemo, useEffect } from 'react';
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
  Bell,
  Activity,
  Layers,
  Globe,
  Navigation,
  Unlock
} from 'lucide-react';
import { CityLocation, Festival, Language, MantraItem } from '../types';
import { CITIES } from '../utils/panchanga';
import { findClosestCity } from '../utils/worldPlaces';
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
  onOpenGoogleMapModal?: () => void;
  activeView: 'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta' | 'dasha';
  onNavigate: (view: 'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta' | 'dasha') => void;
  mantrasList: MantraItem[];
  onSelectFestivalFromSearch: (fest: Festival) => void;
  isAstroDiagnosticActive?: boolean;
  onToggleAstroDiagnostic?: () => void;
  isGlobalLocked?: boolean;
  onToggleGlobalLock?: () => void;
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
  onOpenGoogleMapModal,
  activeView,
  onNavigate,
  mantrasList,
  onSelectFestivalFromSearch,
  isAstroDiagnosticActive = false,
  onToggleAstroDiagnostic,
  isGlobalLocked = false,
  onToggleGlobalLock
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dailyNotifyActive, setDailyNotifyActive] = useState<boolean>(() => {
    return isDailyNotificationEnabled() && getNotificationPermission() === 'granted';
  });
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  // Auto-hide mobile header immediately on downward scroll to provide full view of the screen
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 20 && currentScrollY > lastScrollY) {
        setIsScrolledDown(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 15) {
        setIsScrolledDown(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      {/* Quick summon pill on mobile when header is scrolled away for full vision */}
      {isScrolledDown && (
        <button
          onClick={() => setIsScrolledDown(false)}
          className="fixed top-1.5 left-1/2 -translate-x-1/2 z-50 md:hidden px-3 py-1 rounded-full bg-amber-700/95 text-white text-[10.5px] font-bold shadow-lg backdrop-blur-xs flex items-center gap-1.5 animate-in fade-in transition-transform hover:scale-105"
        >
          <span>HCMM Menu ▾</span>
        </button>
      )}

      <header className={`sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-all duration-300 shadow-xs ${
        isScrolledDown ? '-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'translate-y-0 opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-1 sm:py-2">
          
          {/* Main Top Row: Brand, Quick Actions, City & Lang */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo & Brand Title */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onOpenHcmmAdmin}
                title="Webmaster Source Code & Embed Hub • Full Interactive Program Code"
                className="group relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                {hcmmLogoUrl ? (
                  <img
                    src={hcmmLogoUrl}
                    alt="HCMM Logo"
                    className="w-full h-full object-cover rounded-[6px] sm:rounded-[10px]"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-900 rounded-[6px] sm:rounded-[10px] flex flex-col items-center justify-center text-amber-300 font-extrabold text-[9px] sm:text-xs tracking-tighter">
                    <span className="text-[10px] sm:text-[13px] leading-tight font-serif text-amber-400">HCMM</span>
                    <span className="text-[6.5px] sm:text-[8px] text-amber-200/80 -mt-0.5 hidden xs:inline">VEDIC</span>
                  </div>
                )}
                {/* Small Lock Symbol on Logo */}
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full ring-1 ring-white dark:ring-stone-900 group-hover:bg-amber-400 shadow-xs" title="Webmaster Source Code & Embed Hub">
                  <Lock className="w-2.5 sm:w-3 h-2.5 sm:h-3 stroke-[2.5]" />
                </span>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs xs:text-sm sm:text-lg font-bold font-serif tracking-tight text-stone-900 dark:text-amber-100 flex items-center gap-1 truncate">
                    <span className="truncate">{title.main}</span>
                  </h1>
                  <span className="text-[8.5px] sm:text-[9.5px] font-semibold uppercase tracking-wider px-1 py-0.2 rounded-sm bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0">
                    HCMM
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10.5px] text-stone-600 dark:text-stone-400 font-medium truncate hidden sm:block">
                  {title.sub}
                </p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative flex-1 max-w-md mx-4 hidden lg:block">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder={currentLang === 'kn' ? 'ಹಬ್ಬಗಳು, ಮಂತ್ರಗಳು ಹುಡುಕಿ...' : currentLang === 'hi' ? 'त्योहार, मन्त्र खोजें...' : 'Search festivals, mantras...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-amber-500 transition-all shadow-2xs"
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
            </div>

            {/* Right controls: Location + Lang + Mobile Search/Tools toggle */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
                title="Search & Utilities"
              >
                <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </button>

              {/* Location selector with Google Maps & Auto GPS Integration */}
              <div className="relative flex items-center">
                <button
                  onClick={() => {
                    if (onOpenGoogleMapModal) onOpenGoogleMapModal();
                    else setShowCityDropdown(!showCityDropdown);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] sm:text-xs font-bold rounded-l-lg border border-r-0 border-amber-300 dark:border-amber-700/80 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-800 dark:to-stone-850 text-amber-900 dark:text-amber-300 hover:border-amber-500 hover:bg-amber-100/70 transition-all shadow-2xs group cursor-pointer"
                  title="Open Google Maps & Auto GPS Location Picker"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:rotate-45 transition-transform shrink-0" />
                  <span className="font-bold max-w-[80px] sm:max-w-none truncate">
                    {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}
                  </span>
                  <span className="text-[8.5px] bg-amber-200/90 dark:bg-stone-700 text-amber-950 dark:text-amber-200 px-1 py-0.2 rounded font-mono font-semibold hidden md:inline">
                    MAP
                  </span>
                </button>
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="px-1.5 py-1 text-[10px] font-bold rounded-r-lg border border-amber-300 dark:border-amber-700/80 bg-amber-100/70 dark:bg-stone-750 text-amber-900 dark:text-amber-300 hover:bg-amber-200/80 transition-colors shadow-2xs cursor-pointer"
                  title="Quick Location Menu"
                >
                  ▼
                </button>

                {showCityDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-white dark:bg-stone-850 border-2 border-amber-400 dark:border-stone-700 shadow-2xl py-2 z-50 divide-y divide-stone-100 dark:divide-stone-800">
                    <div className="p-2 space-y-1.5">
                      <button
                        onClick={() => {
                          if (onOpenGoogleMapModal) onOpenGoogleMapModal();
                          setShowCityDropdown(false);
                        }}
                        className="w-full p-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{currentLang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ ಸ್ಥಳ ಆಯ್ಕೆ' : currentLang === 'hi' ? 'गूगल मैप स्थान चयन' : 'Open Google Maps'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const lat = pos.coords.latitude;
                                const lng = pos.coords.longitude;
                                const closest = findClosestCity(lat, lng);
                                const newCity: CityLocation = {
                                  name: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
                                  nameLocalized: { en: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`, kn: `ಜಿಪಿಎಸ್ ಸ್ಥಳ (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`, hi: `जीपीएस स्थान (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)` },
                                  state: closest.state || 'Detected Area',
                                  country: closest.country || 'India',
                                  lat,
                                  lng,
                                  timezone: closest.timezone || 'Asia/Kolkata'
                                };
                                onSelectCity(newCity);
                                localStorage.setItem('hcmm_city', JSON.stringify(newCity));
                                setShowCityDropdown(false);
                              },
                              (err) => {
                                alert(currentLang === 'kn' ? `ಜಿಪಿಎಸ್ ದೋಷ: ${err.message}` : `GPS Error: ${err.message}`);
                              },
                              { enableHighAccuracy: true }
                            );
                          }
                        }}
                        className="w-full p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{currentLang === 'kn' ? 'ಸ್ವಯಂ ಜಿಪಿಎಸ್ ಸ್ಥಳ' : currentLang === 'hi' ? 'स्वतः जीपीएस स्थान' : 'Auto Detect GPS'}</span>
                      </button>
                    </div>

                    <div className="pt-1.5">
                      <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        {currentLang === 'kn' ? 'ತ್ವರಿತ ನಗರಗಳು' : 'Quick Cities'}
                      </div>
                      <div className="max-h-52 overflow-y-auto">
                        {CITIES.map(c => (
                          <button
                            key={c.name}
                            onClick={() => {
                              onSelectCity(c);
                              localStorage.setItem('hcmm_city', JSON.stringify(c));
                              setShowCityDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                              selectedCity.name === c.name
                                ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold'
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
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
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="flex items-center rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5 shadow-2xs">
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-1.5 py-0.5 text-[10.5px] sm:text-xs font-medium rounded-md transition-colors ${
                    currentLang === 'en'
                      ? 'bg-amber-500 text-white font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  onClick={() => onLanguageChange('kn')}
                  className={`px-1.5 py-0.5 text-[10.5px] sm:text-xs font-medium rounded-md transition-colors ${
                    currentLang === 'kn'
                      ? 'bg-amber-500 text-white font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="ಕನ್ನಡ (Kannada)"
                >
                  KN
                </button>
                <button
                  onClick={() => onLanguageChange('hi')}
                  className={`px-1.5 py-0.5 text-[10.5px] sm:text-xs font-medium rounded-md transition-colors ${
                    currentLang === 'hi'
                      ? 'bg-amber-500 text-white font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="हिंदी (Hindi)"
                >
                  HI
                </button>
              </div>

              {/* Global Administrative Lock State Button */}
              {onToggleGlobalLock && (
                <button
                  onClick={onToggleGlobalLock}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    isGlobalLocked
                      ? 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-400/50'
                      : 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/50'
                  }`}
                  title={
                    isGlobalLocked
                      ? currentLang === 'kn' ? 'ವ್ಯವಸ್ಥೆ ಲಾಕ್ ಆಗಿದೆ (ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ)' : 'Locked Mode Active (Click to Unlock with password)'
                      : currentLang === 'kn' ? 'ವ್ಯವಸ್ಥೆ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ (ಮರು-ಲಾಕ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ)' : 'System Unlocked (Click to Re-lock)'
                  }
                >
                  {isGlobalLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      <span className="text-[11px] font-mono uppercase">
                        {currentLang === 'kn' ? 'ಲಾಕ್' : 'Locked'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[11px] font-mono uppercase">
                        {currentLang === 'kn' ? 'ಅನ್‌ಲಾಕ್' : 'Unlocked'}
                      </span>
                    </>
                  )}
                </button>
              )}

              {/* Dark mode, Notifications & Widget (visible on larger screens or toggled) */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={onToggleDarkMode}
                  className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors shadow-2xs"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
                </button>

                <button
                  onClick={handleToggleDailyNotification}
                  className={`p-1.5 rounded-lg border transition-colors shadow-2xs relative ${
                    dailyNotifyActive 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                  }`}
                  title="Daily Alerts"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {dailyNotifyActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Collapsible Mobile Tools Drawer (Only opens when user taps Search icon) */}
          {mobileToolsOpen && (
            <div className="lg:hidden mt-2 pt-2 border-t border-amber-200/60 dark:border-stone-800 space-y-2 animate-in fade-in duration-200">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder={currentLang === 'kn' ? 'ಹಬ್ಬಗಳು, ಮಂತ್ರಗಳು ಹುಡುಕಿ...' : currentLang === 'hi' ? 'त्योहार, मन्त्र खोजें...' : 'Search festivals, mantras...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onToggleDarkMode}
                    className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-xs font-semibold flex items-center gap-1"
                  >
                    {isDarkMode ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3" />}
                    <span>{isDarkMode ? 'Light' : 'Dark'}</span>
                  </button>
                  <button
                    onClick={handleToggleDailyNotification}
                    className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-xs font-semibold flex items-center gap-1"
                  >
                    <Bell className="w-3 h-3 text-amber-600" />
                    <span>Alerts</span>
                  </button>
                  <button
                    onClick={onOpenWidgetModal}
                    className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-xs font-semibold flex items-center gap-1"
                  >
                    <LayoutGrid className="w-3 h-3 text-amber-600" />
                    <span>Widget</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileToolsOpen(false);
                      if (onOpenPageSourceCode) onOpenPageSourceCode();
                      else onOpenHcmmAdmin();
                    }}
                    className="px-2.5 py-1 rounded-lg border border-amber-400 bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1"
                  >
                    <FileCode className="w-3 h-3 stroke-[2.5]" />
                    <span>HTML</span>
                  </button>
                </div>
                <button
                  onClick={() => setMobileToolsOpen(false)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 px-2 py-0.5"
                >
                  Close ✕
                </button>
              </div>
            </div>
          )}

          {/* Row 2: Navigation Views Switcher — Always neat single horizontal scrollable strip */}
          <div className="mt-1.5 flex items-center overflow-x-auto max-w-full pb-0.5 scrollbar-none rounded-lg border border-amber-300/50 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/60 p-0.5 gap-0.5">
            <button
              onClick={() => onNavigate('calendar')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'calendar'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್' : currentLang === 'hi' ? 'कैलेंडर' : 'Calendar'}</span>
            </button>

            <button
              onClick={() => onNavigate('mantras')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'mantras'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಮಂತ್ರಗಳು' : currentLang === 'hi' ? 'मन्त्र' : 'Mantras'}</span>
            </button>

            <button
              onClick={() => onNavigate('sankalpa')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'sankalpa'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಸಂಕಲ್ಪ ಮತ್ತು ಸ್ಥಾಪನೆ' : currentLang === 'hi' ? 'संकल्प एवं स्थापना' : 'Sankalpa and Sthaapana'}</span>
            </button>

            <button
              onClick={() => onNavigate('kundali')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'kundali'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ' : currentLang === 'hi' ? 'लग्न कुण्डली' : 'Kundali'}</span>
            </button>

            <button
              onClick={() => onNavigate('gochar')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'gochar'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Planetary Transits (Gochar) - Under Sacred Vedic Remedies & Jyotisha"
            >
              <Compass className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಗ್ರಹ ಗೋಚಾರ' : currentLang === 'hi' ? 'ग्रह गोचर' : 'Gochar'}</span>
              <Lock className="w-2.5 h-2.5 opacity-70 ml-0.5 text-amber-500" />
            </button>

            <button
              onClick={() => onNavigate('muhurta')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'muhurta'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Muhurta Finder"
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{currentLang === 'kn' ? 'ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'मुहूर्त' : 'Muhurta'}</span>
            </button>

            <button
              onClick={() => onNavigate('dasha')}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'dasha'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Vimshottari Dasha Calculator (Maha Dasha, Antardasha & Pratyantardasha)"
            >
              <Sparkles className="w-3 h-3 shrink-0 text-amber-400" />
              <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ' : currentLang === 'hi' ? 'विंशोत्तरी दशा' : 'Vimshottari Dasha'}</span>
            </button>
          </div>

        </div>

        {/* Global Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-2 right-2 max-w-lg mx-auto mt-1 rounded-2xl bg-white dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-2">
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

      </header>
    </>
  );
};
