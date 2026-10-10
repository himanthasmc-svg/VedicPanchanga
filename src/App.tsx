import React, { useState, useEffect } from 'react';
import { 
  CityLocation, 
  CustomEventItem, 
  Festival, 
  Language, 
  PanchangaDay, 
  MantraItem, 
  BookItem 
} from './types';
import { CITIES, getPanchangaForDate } from './utils/panchanga';
import { INITIAL_BOOKS, INITIAL_MANTRAS } from './utils/mantrasData';
import { checkAndTriggerDailyNotification } from './utils/dailyNotification';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { FestivalModal } from './components/FestivalModal';
import { DayDetailModal } from './components/DayDetailModal';
import { MantrasPage } from './components/MantrasPage';
import { SankalpaVidhiPage } from './components/SankalpaVidhiPage';
import { LagnaKundaliPage } from './components/LagnaKundaliPage';
import { GocharTransitsView } from './components/GocharTransitsView';
import { MuhurtaFinderPage } from './components/MuhurtaFinderPage';
import { HomeScreenWidgetModal } from './components/HomeScreenWidgetModal';
import { HcmmAdminModal } from './components/HcmmAdminModal';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { CloudSyncModal } from './components/CloudSyncModal';

export default function App() {
  // Localization: English default, selectable to Kannada and Hindi
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('hcmm_lang') as Language) || 'en';
  });

  // Dark Mode support
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('hcmm_theme') === 'dark';
  });

  // Selected City / Location for astronomical timings
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('hcmm_city');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CITIES[0]; // Bengaluru default
  });

  // Active Main View: calendar | mantras | sankalpa | kundali | gochar | muhurta
  const [activeView, setActiveView] = useState<'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta'>('calendar');

  // Modals state
  const [selectedDay, setSelectedDay] = useState<PanchangaDay | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showHcmmAdmin, setShowHcmmAdmin] = useState<boolean>(false);
  const [showBiometric, setShowBiometric] = useState<boolean>(false);
  const [showCloudSync, setShowCloudSync] = useState<boolean>(false);
  const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);
  const [openCodeDirectly, setOpenCodeDirectly] = useState<boolean>(false);

  // Biometric Lock status
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => {
    return localStorage.getItem('hcmm_bio_locked') === 'true';
  });

  // HCMM custom logo URL
  const [hcmmLogoUrl, setHcmmLogoUrl] = useState<string>(() => {
    return localStorage.getItem('hcmm_logo_url') || '';
  });

  // Mantras List
  const [mantrasList, setMantrasList] = useState<MantraItem[]>(() => {
    const saved = localStorage.getItem('hcmm_mantras');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MANTRAS;
  });

  // Books / Helpful Viewer Resources List
  const [booksList, setBooksList] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem('hcmm_books');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BOOKS;
  });

  // Scheduled Custom Personal Events
  const [customEvents, setCustomEvents] = useState<CustomEventItem[]>(() => {
    const saved = localStorage.getItem('hcmm_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('hcmm_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('hcmm_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('hcmm_city', JSON.stringify(selectedCity));
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('hcmm_mantras', JSON.stringify(mantrasList));
  }, [mantrasList]);

  useEffect(() => {
    localStorage.setItem('hcmm_books', JSON.stringify(booksList));
  }, [booksList]);

  useEffect(() => {
    localStorage.setItem('hcmm_events', JSON.stringify(customEvents));
  }, [customEvents]);

  useEffect(() => {
    localStorage.setItem('hcmm_logo_url', hcmmLogoUrl);
  }, [hcmmLogoUrl]);

  useEffect(() => {
    localStorage.setItem('hcmm_bio_locked', isBiometricLocked ? 'true' : 'false');
  }, [isBiometricLocked]);

  // Daily browser notification: triggers once daily showing today's Tithi, Nakshatra, and key festival info based on selected city
  useEffect(() => {
    checkAndTriggerDailyNotification(selectedCity, currentLang);

    // Periodic check every 30 minutes in case application stays open past midnight
    const intervalId = setInterval(() => {
      checkAndTriggerDailyNotification(selectedCity, currentLang);
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedCity, currentLang]);

  // Compute Today's Panchanga for widget
  const todayPanchanga = getPanchangaForDate(new Date(), selectedCity);

  // Mantras management
  const handleAddMantra = (mantra: MantraItem) => {
    setMantrasList(prev => [mantra, ...prev]);
  };

  const handleDeleteMantra = (id: string) => {
    setMantrasList(prev => prev.filter(m => m.id !== id));
  };

  // Books management
  const handleAddBook = (book: BookItem) => {
    setBooksList(prev => [book, ...prev]);
  };

  const handleDeleteBook = (id: string) => {
    setBooksList(prev => prev.filter(b => b.id !== id));
  };

  // Custom events management
  const handleAddEvent = (evt: CustomEventItem) => {
    setCustomEvents(prev => [...prev, evt]);
  };

  const handleDeleteEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  };

  // Import cross-device backup
  const handleImportData = (data: { customEvents?: CustomEventItem[]; mantrasList?: MantraItem[]; booksList?: BookItem[] }) => {
    if (data.customEvents) setCustomEvents(data.customEvents);
    if (data.mantrasList) setMantrasList(data.mantrasList);
    if (data.booksList) setBooksList(data.booksList);
  };

  return (
    <div className={`min-h-screen bg-amber-50/30 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Top Application Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        hcmmLogoUrl={hcmmLogoUrl}
        onOpenHcmmAdmin={() => {
          setOpenCodeDirectly(false);
          setShowHcmmAdmin(true);
        }}
        onOpenBiometric={() => setShowBiometric(true)}
        isBiometricLocked={isBiometricLocked}
        onOpenCloudSync={() => setShowCloudSync(true)}
        onOpenWidgetModal={() => setShowWidgetModal(true)}
        onOpenPageSourceCode={() => {
          setOpenCodeDirectly(true);
          setShowHcmmAdmin(true);
        }}
        activeView={activeView}
        onNavigate={setActiveView}
        mantrasList={mantrasList}
        onSelectFestivalFromSearch={(fest) => setSelectedFestival(fest)}
      />

      {/* Main Content Area - Dynamically responsive for mobile and desktop windows */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6 overflow-x-hidden">
        
        {/* VIEW 1: Main Calendar View (1900 to 2100+) */}
        {activeView === 'calendar' && (
          <CalendarView
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectDay={setSelectedDay}
            onSelectFestival={setSelectedFestival}
            onOpenMantras={() => setActiveView('mantras')}
            onOpenSankalpa={() => setActiveView('sankalpa')}
            onOpenKundali={() => setActiveView('kundali')}
          />
        )}

        {/* VIEW 2: Mantras Page with weblink input & HCMM code export */}
        {activeView === 'mantras' && (
          <MantrasPage
            currentLang={currentLang}
            onBackToCalendar={() => setActiveView('calendar')}
            hcmmLogoUrl={hcmmLogoUrl}
            onOpenHcmmAdmin={() => {
              setOpenCodeDirectly(false);
              setShowHcmmAdmin(true);
            }}
            mantrasList={mantrasList}
            onAddMantra={handleAddMantra}
            onDeleteMantra={handleDeleteMantra}
            booksList={booksList}
            onOpenCodeCopyModal={() => {
              setOpenCodeDirectly(true);
              setShowHcmmAdmin(true);
            }}
          />
        )}

        {/* VIEW 3: Sankalpa Vidhi Page with auto-filled blue values & PDF export */}
        {activeView === 'sankalpa' && (
          <SankalpaVidhiPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
          />
        )}

        {/* VIEW 4: Lagna Kundali Page with North/South chart */}
        {activeView === 'kundali' && (
          <LagnaKundaliPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
          />
        )}

        {/* VIEW 5: Gochar (Planetary Transits) Dedicated Page */}
        {activeView === 'gochar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('calendar')}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                ← {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ' : currentLang === 'hi' ? 'कैलेंडर पर वापस' : 'Back to Calendar'}
              </button>
            </div>
            <GocharTransitsView
              currentLang={currentLang}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onOpenKundali={() => setActiveView('kundali')}
              isWidget={false}
            />
          </div>
        )}

        {/* VIEW 6: Muhurta Finder Page */}
        {activeView === 'muhurta' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('calendar')}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                ← {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ' : currentLang === 'hi' ? 'कैलेंडर पर वापस' : 'Back to Calendar'}
              </button>
            </div>
            <MuhurtaFinderPage
              currentLang={currentLang}
              selectedCity={selectedCity}
              onNavigateToCalendar={(targetDate) => {
                setActiveView('calendar');
                if (targetDate) {
                  const dayObj = getPanchangaForDate(targetDate, selectedCity);
                  setSelectedDay(dayObj);
                }
              }}
            />
          </div>
        )}

      </main>

      {/* Application Footer */}
      <footer className="no-print mt-auto border-t border-amber-200/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 dark:text-amber-200">
              HCMM Vedic Panchanga Calendar & Kundali
            </span>
            <span>•</span>
            <span>1900 - 2125+</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Offline Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveView('sankalpa')} 
              className="hover:text-amber-600 transition-colors"
            >
              Sankalpa Vidhi
            </button>
            <button 
              onClick={() => setActiveView('kundali')} 
              className="hover:text-amber-600 transition-colors"
            >
              Lagna Kundali
            </button>
            <button 
              onClick={() => setActiveView('gochar')} 
              className="hover:text-amber-600 transition-colors font-medium text-amber-700 dark:text-amber-400"
            >
              Planetary Gochar
            </button>
            <button 
              onClick={() => setActiveView('muhurta')} 
              className="hover:text-amber-600 transition-colors font-medium text-amber-700 dark:text-amber-400"
            >
              Muhurta Finder
            </button>
            <button 
              onClick={() => setActiveView('mantras')} 
              className="hover:text-amber-600 transition-colors"
            >
              Mantras & Books
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedFestival && (
        <FestivalModal
          festival={selectedFestival}
          currentLang={currentLang}
          onClose={() => setSelectedFestival(null)}
        />
      )}

      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          currentLang={currentLang}
          onClose={() => setSelectedDay(null)}
          onSelectFestival={(f) => {
            setSelectedDay(null);
            setSelectedFestival(f);
          }}
          customEvents={customEvents}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {showHcmmAdmin && (
        <HcmmAdminModal
          currentLang={currentLang}
          onClose={() => setShowHcmmAdmin(false)}
          hcmmLogoUrl={hcmmLogoUrl}
          onUpdateLogoUrl={setHcmmLogoUrl}
          booksList={booksList}
          onAddBook={handleAddBook}
          onDeleteBook={handleDeleteBook}
          initialCodeView={openCodeDirectly}
        />
      )}

      {showBiometric && (
        <BiometricAuthModal
          currentLang={currentLang}
          onClose={() => setShowBiometric(false)}
          isLocked={isBiometricLocked}
          onSetLockState={setIsBiometricLocked}
        />
      )}

      {showCloudSync && (
        <CloudSyncModal
          currentLang={currentLang}
          onClose={() => setShowCloudSync(false)}
          customEvents={customEvents}
          mantrasList={mantrasList}
          booksList={booksList}
          onImportData={handleImportData}
        />
      )}

      {showWidgetModal && (
        <HomeScreenWidgetModal
          todayPanchanga={todayPanchanga}
          currentLang={currentLang}
          selectedCity={selectedCity}
          onClose={() => setShowWidgetModal(false)}
        />
      )}

    </div>
  );
}
