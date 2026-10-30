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
import { CITIES, getPanchangaForDate, calculateKundali } from './utils/panchanga';
import { INITIAL_BOOKS, INITIAL_MANTRAS } from './utils/mantrasData';
import { checkAndTriggerDailyNotification, initAuspiciousNotificationService } from './utils/dailyNotification';
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
import { AstroDiagnosticModal } from './components/AstroDiagnosticModal';
import { GoogleMapLocationModal } from './components/GoogleMapLocationModal';
import { MasterUnlockModal } from './components/MasterUnlockModal';
import { VimshottariDashaCalculator } from './components/VimshottariDashaCalculator';
import { DailyRashiBhavishyaPage } from './components/DailyRashiBhavishyaPage';
import { VedicYogaPostureModule } from './components/VedicYogaPostureModule';
import { findClosestCity } from './utils/worldPlaces';

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
      try { 
        const parsed = JSON.parse(saved);
        const canonical = CITIES.find(c => c.name.toLowerCase() === parsed.name?.toLowerCase());
        if (canonical) return canonical;
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return CITIES[0]; // Bengaluru default
  });

  // Active Main View: calendar | mantras | sankalpa | kundali | gochar | muhurta | dasha | bhavishya | yoga
  const [activeView, setActiveView] = useState<'calendar' | 'mantras' | 'sankalpa' | 'kundali' | 'gochar' | 'muhurta' | 'dasha' | 'bhavishya' | 'yoga'>('calendar');

  // Modals state
  const [selectedDay, setSelectedDay] = useState<PanchangaDay | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showHcmmAdmin, setShowHcmmAdmin] = useState<boolean>(false);
  const [showBiometric, setShowBiometric] = useState<boolean>(false);
  const [showCloudSync, setShowCloudSync] = useState<boolean>(false);
  const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);
  const [openCodeDirectly, setOpenCodeDirectly] = useState<boolean>(false);
  const [showGoogleMapModal, setShowGoogleMapModal] = useState<boolean>(false);

  // Biometric Lock status
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => {
    return localStorage.getItem('hcmm_bio_locked') === 'true';
  });

  // Administrator Password (Protects alterations when clicking the HCMM logo)
  const [userPassword, setUserPassword] = useState<string>(() => {
    return localStorage.getItem('hcmm_user_password') || 'HCMM';
  });

  // Global Administrative Lock Mode across modules (Sankalpa, Kundali, Gochar)
  const [isGlobalLocked, setIsGlobalLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('hcmm_global_locked');
    return saved !== null ? saved === 'true' : true; // Locked by default until authenticated
  });
  const [showGlobalUnlockModal, setShowGlobalUnlockModal] = useState<boolean>(false);
  const [lockedModuleName, setLockedModuleName] = useState<string>('');

  // Astro-Diagnostic real-time logs & modal state
  const [isAstroDiagnosticActive, setIsAstroDiagnosticActive] = useState<boolean>(() => {
    return localStorage.getItem('hcmm_astro_diag') === 'true';
  });
  const [showAstroDiagnosticModal, setShowAstroDiagnosticModal] = useState<boolean>(false);

  // HCMM custom logo URL
  const [hcmmLogoUrl, setHcmmLogoUrl] = useState<string>(() => {
    return localStorage.getItem('hcmm_logo_url') || '';
  });

  // Mantras List
  const [mantrasList, setMantrasList] = useState<MantraItem[]>(() => {
    const saved = localStorage.getItem('hcmm_mantras');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge all predefined blog items from INITIAL_MANTRAS to ensure they exist
          const existingUrls = new Set(parsed.map((m: any) => m.url));
          const missingBlogItems = INITIAL_MANTRAS.filter(m => !existingUrls.has(m.url));
          const cleaned = parsed.map((m: any) => ({
            ...m,
            imageUrl: typeof m.imageUrl === 'string' && m.imageUrl.includes('images.unsplash.com') ? '' : (m.imageUrl || '')
          }));
          return [...missingBlogItems, ...cleaned];
        }
      } catch (e) { /* ignore */ }
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

  // Auto-detect GPS location on startup if enabled
  useEffect(() => {
    const autoDetect = localStorage.getItem('hcmm_auto_detect_location') === 'true';
    if (autoDetect && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const closest = findClosestCity(lat, lng);
          const autoCity: CityLocation = {
            name: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            nameLocalized: {
              en: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
              kn: `ಜಿಪಿಎಸ್ ಸ್ಥಳ (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
              hi: `जीपीएस स्थान (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
            },
            state: closest.state || 'Local Region',
            country: closest.country || 'India',
            lat,
            lng,
            timezone: closest.timezone || 'Asia/Kolkata'
          };
          setSelectedCity(autoCity);
          localStorage.setItem('hcmm_city', JSON.stringify(autoCity));
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Initial and periodic sync with full-stack backend so logo and added mantras are visible on all systems over the internet
  useEffect(() => {
    const fetchGlobalSync = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const data = await res.json();
          if (data.logoUrl) {
            setHcmmLogoUrl(data.logoUrl);
            localStorage.setItem('hcmm_logo_url', data.logoUrl);
          }
          if (Array.isArray(data.mantrasList) && data.mantrasList.length > 0) {
            setMantrasList(prev => {
              const existingIds = new Set(data.mantrasList.map((m: any) => m.id));
              const nonDuplicatedDefaults = prev.filter(m => !existingIds.has(m.id));
              return [...data.mantrasList, ...nonDuplicatedDefaults];
            });
          } else {
            // Populate server store with current mantras so backend stays in sync
            fetch('/api/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mantrasList })
            }).catch(() => {});
          }
          if (Array.isArray(data.booksList) && data.booksList.length > 0) {
            setBooksList(prev => {
              const existingIds = new Set(data.booksList.map((b: any) => b.id));
              const nonDuplicatedDefaults = prev.filter(b => !existingIds.has(b.id));
              return [...data.booksList, ...nonDuplicatedDefaults];
            });
          }
          if (Array.isArray(data.customEvents) && data.customEvents.length > 0) {
            setCustomEvents(data.customEvents);
          }
        }
      } catch (err) {
        // Standalone or offline fallback: local state is already loaded from localStorage
      }
    };

    fetchGlobalSync();
  }, []);

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

  useEffect(() => {
    localStorage.setItem('hcmm_user_password', userPassword);
  }, [userPassword]);

  useEffect(() => {
    localStorage.setItem('hcmm_astro_diag', isAstroDiagnosticActive ? 'true' : 'false');
  }, [isAstroDiagnosticActive]);

  useEffect(() => {
    localStorage.setItem('hcmm_global_locked', isGlobalLocked ? 'true' : 'false');
  }, [isGlobalLocked]);

  useEffect(() => {
    localStorage.setItem('hcmm_mantras', JSON.stringify(mantrasList));
  }, [mantrasList]);

  // Request Unlock across modules
  const handleRequestUnlock = (moduleName?: string) => {
    if (!isGlobalLocked) return;
    setLockedModuleName(moduleName || 'Administrative Section');
    setShowGlobalUnlockModal(true);
  };

  const handleToggleGlobalLock = () => {
    if (isGlobalLocked) {
      setLockedModuleName('All Modules (Sankalpa, Kundali, Gochar)');
      setShowGlobalUnlockModal(true);
    } else {
      setIsGlobalLocked(true);
      localStorage.setItem('hcmm_global_locked', 'true');
      localStorage.removeItem('hcmm_astro_unlocked');
      localStorage.removeItem('hcmm_remedies_unlocked');
    }
  };

  // In-app live auspicious alert toast banner state
  const [liveAuspiciousAlert, setLiveAuspiciousAlert] = useState<{
    window: any;
    cityName: string;
    isAdvance: boolean;
    advanceMinutes: number;
    isTest?: boolean;
  } | null>(null);

  // Auspicious Sandhyavandana & Shiva/Devi Puja Recurring Notification Service
  useEffect(() => {
    // Starts recurring 30s background check based on saved location sunrise/sunset
    const cleanup = initAuspiciousNotificationService(selectedCity, currentLang);

    // In-app event listener for live notifications
    const handleAuspiciousEvent = (e: any) => {
      if (e.detail) {
        setLiveAuspiciousAlert(e.detail);
        setTimeout(() => setLiveAuspiciousAlert(null), 14000);
      }
    };

    window.addEventListener('hcmm_auspicious_alert', handleAuspiciousEvent);

    return () => {
      cleanup();
      window.removeEventListener('hcmm_auspicious_alert', handleAuspiciousEvent);
    };
  }, [selectedCity, currentLang]);

  // Compute Today's Panchanga for widget
  const todayPanchanga = getPanchangaForDate(new Date(), selectedCity);

  // Mantras management
  const handleAddMantra = (mantra: MantraItem) => {
    setMantrasList(prev => {
      const idx = prev.findIndex(m => m.id === mantra.id || (mantra.url && m.url === mantra.url));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = mantra;
        return copy;
      }
      return [mantra, ...prev];
    });
    // Sync to backend so available online anywhere
    fetch('/api/mantras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mantra })
    }).catch(() => {});
  };

  const handleDeleteMantra = (id: string) => {
    setMantrasList(prev => prev.filter(m => m.id !== id));
    fetch(`/api/mantras/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleUpdateLogoUrl = (newUrl: string) => {
    setHcmmLogoUrl(newUrl);
    localStorage.setItem('hcmm_logo_url', newUrl);
    fetch('/api/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: newUrl })
    }).catch(() => {});
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
        onOpenGoogleMapModal={() => setShowGoogleMapModal(true)}
        activeView={activeView}
        onNavigate={setActiveView}
        mantrasList={mantrasList}
        onSelectFestivalFromSearch={(fest) => setSelectedFestival(fest)}
        isAstroDiagnosticActive={isAstroDiagnosticActive}
        onToggleAstroDiagnostic={() => {
          const nextVal = !isAstroDiagnosticActive;
          setIsAstroDiagnosticActive(nextVal);
          if (nextVal) {
            setShowAstroDiagnosticModal(true);
          }
        }}
        isGlobalLocked={isGlobalLocked}
        onToggleGlobalLock={handleToggleGlobalLock}
      />

      {/* Live Auspicious Sandhyavandana & Shiva/Devi Puja Alert Banner (Floating Toast) */}
      {liveAuspiciousAlert && (
        <div className="no-print mx-auto max-w-4xl w-full px-3 pt-2 z-40 animate-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-700 via-rose-700 to-amber-800 text-white shadow-2xl border-2 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/30 border border-amber-300/50 flex items-center justify-center text-xl shrink-0">
                🔔
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                    {liveAuspiciousAlert.isTest ? 'TEST ALERT' : liveAuspiciousAlert.isAdvance ? `STARTS IN ${liveAuspiciousAlert.advanceMinutes}M` : 'ACTIVE NOW'}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-amber-100">
                    {liveAuspiciousAlert.window.name[currentLang] || liveAuspiciousAlert.window.name.en}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    ({liveAuspiciousAlert.window.startTimeStr} - {liveAuspiciousAlert.window.endTimeStr})
                  </span>
                </div>
                <p className="text-xs text-rose-100 font-serif mt-0.5 line-clamp-2">
                  {liveAuspiciousAlert.window.recommendedRitual[currentLang] || liveAuspiciousAlert.window.recommendedRitual.en}
                </p>
                {liveAuspiciousAlert.window.shivaDeviMantra && (
                  <span className="text-[11px] font-mono text-amber-200 block mt-0.5">
                    🔱 {liveAuspiciousAlert.window.shivaDeviMantra}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveView('sankalpa');
                  setLiveAuspiciousAlert(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                {currentLang === 'kn' ? 'ಪೂಜೆ ಆರಂಭಿಸಿ' : currentLang === 'hi' ? 'पूजा आरम्भ करें' : 'Start Puja'}
              </button>

              <button
                type="button"
                onClick={() => setLiveAuspiciousAlert(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer text-xs"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Dynamically responsive for mobile and desktop windows */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6 overflow-x-hidden">
        
        {/* VIEW 1: Main Calendar View (1900 to 2100+) */}
        {activeView === 'calendar' && (
          <CalendarView
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectDay={() => {}}
            onSelectFestival={() => {}}
            onOpenMantras={() => setActiveView('mantras')}
            onOpenSankalpa={() => setActiveView('sankalpa')}
            onOpenKundali={() => setActiveView('kundali')}
            isAstroDiagnosticActive={isAstroDiagnosticActive}
            onOpenAstroDiagnostic={() => setShowAstroDiagnosticModal(true)}
            onOpenGoogleMap={() => setShowGoogleMapModal(true)}
            onOpenBhavishya={() => setActiveView('bhavishya')}
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
            onSetMantrasList={setMantrasList}
            booksList={booksList}
            onOpenCodeCopyModal={() => {
              setOpenCodeDirectly(true);
              setShowHcmmAdmin(true);
            }}
          />
        )}

        {/* VIEW 3: Sankalpa Vidhi Page with Visarjana Muhurta Calculator & auto-filled blue values */}
        {activeView === 'sankalpa' && (
          <SankalpaVidhiPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
            onOpenGoogleMap={() => setShowGoogleMapModal(true)}
            isGlobalLocked={isGlobalLocked}
            onRequestUnlock={handleRequestUnlock}
          />
        )}

        {/* VIEW 4: Lagna Kundali Page with North/South chart */}
        {activeView === 'kundali' && (
          <LagnaKundaliPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
            userPassword={userPassword}
            onOpenAdmin={() => {
              setOpenCodeDirectly(false);
              setShowHcmmAdmin(true);
            }}
          />
        )}

        {/* VIEW 5: Gochar (Planetary Transits) under Locked Vedic Remedies & Advanced Jyotisha */}
        {activeView === 'gochar' && (
          <LagnaKundaliPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
            userPassword={userPassword}
            onOpenAdmin={() => {
              setOpenCodeDirectly(false);
              setShowHcmmAdmin(true);
            }}
            initialSectionTab="remedies"
            initialRemediesSubTab="transits"
          />
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

        {/* VIEW 7: Vimshottari Dasha Calculator (Maha Dasha, Antardasha & Pratyantardasha) */}
        {activeView === 'dasha' && (
          <VimshottariDashaCalculator
            currentLang={currentLang}
            onBackToCalendar={() => setActiveView('calendar')}
            onNavigateToKundali={() => setActiveView('kundali')}
          />
        )}

        {/* VIEW 8: Daily Rashi Bhavishya & Planetary Transits */}
        {activeView === 'bhavishya' && (
          <DailyRashiBhavishyaPage
            currentLang={currentLang}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onBackToCalendar={() => setActiveView('calendar')}
            onNavigateToKundali={() => setActiveView('kundali')}
          />
        )}

        {/* VIEW 9: Vedic Yoga & Posture Library with Animated SVG Balancing & Practice Mode */}
        {activeView === 'yoga' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between no-print">
              <button
                onClick={() => setActiveView('calendar')}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                ← {currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ' : currentLang === 'hi' ? 'कैलेंडर पर वापस' : 'Back to Calendar'}
              </button>
            </div>
            <VedicYogaPostureModule
              kundali={calculateKundali(new Date().toISOString(), selectedCity)}
              currentLang={currentLang}
              onBackToChart={() => setActiveView('kundali')}
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

          <div className="flex items-center gap-4 flex-wrap">
            <button 
              onClick={() => setActiveView('bhavishya')} 
              className="hover:text-amber-600 transition-colors font-bold text-amber-700 dark:text-amber-400"
            >
              Daily Rashi Bhavishya
            </button>
            <button 
              onClick={() => setActiveView('sankalpa')} 
              className="hover:text-amber-600 transition-colors"
            >
              Sankalpa and Sthaapana
            </button>
            <button 
              onClick={() => setActiveView('kundali')} 
              className="hover:text-amber-600 transition-colors"
            >
              Lagna Kundali
            </button>
            <button 
              onClick={() => setActiveView('kundali')} 
              className="hover:text-emerald-600 transition-colors font-medium text-emerald-700 dark:text-emerald-400"
            >
              Vedic Yoga & Postures
            </button>
            <button 
              onClick={() => setActiveView('dasha')} 
              className="hover:text-amber-600 transition-colors font-medium text-amber-700 dark:text-amber-400"
            >
              Vimshottari Dasha
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
          onOpenDasha={() => setActiveView('dasha')}
        />
      )}

      {showHcmmAdmin && (
        <HcmmAdminModal
          currentLang={currentLang}
          selectedCity={selectedCity}
          onClose={() => setShowHcmmAdmin(false)}
          hcmmLogoUrl={hcmmLogoUrl}
          onUpdateLogoUrl={handleUpdateLogoUrl}
          mantrasList={mantrasList}
          onAddMantra={handleAddMantra}
          onDeleteMantra={handleDeleteMantra}
          booksList={booksList}
          onAddBook={handleAddBook}
          onDeleteBook={handleDeleteBook}
          customEvents={customEvents}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          userPassword={userPassword}
          onUpdatePassword={setUserPassword}
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

      {/* Astro-Diagnostic & Ephemeris Verification Modal */}
      {showAstroDiagnosticModal && (
        <AstroDiagnosticModal
          currentLang={currentLang}
          selectedDate={selectedDay ? new Date(selectedDay.gregorianDate) : new Date()}
          selectedCity={selectedCity}
          onClose={() => setShowAstroDiagnosticModal(false)}
        />
      )}

      {/* Google Maps & Auto GPS Location Picker Modal */}
      <GoogleMapLocationModal
        isOpen={showGoogleMapModal}
        onClose={() => setShowGoogleMapModal(false)}
        currentLang={currentLang}
        selectedCity={selectedCity}
        onSelectCity={(newCity) => {
          setSelectedCity(newCity);
          localStorage.setItem('hcmm_city', JSON.stringify(newCity));
        }}
      />

      {/* Global Master Administrative Unlock Modal */}
      <MasterUnlockModal
        isOpen={showGlobalUnlockModal}
        onClose={() => setShowGlobalUnlockModal(false)}
        onUnlockSuccess={() => {
          setIsGlobalLocked(false);
          localStorage.setItem('hcmm_global_locked', 'false');
          localStorage.setItem('hcmm_astro_unlocked', 'true');
          localStorage.setItem('hcmm_remedies_unlocked', 'true');
          setShowGlobalUnlockModal(false);
        }}
        currentLang={currentLang}
        selectedCity={selectedCity}
        todayPanchanga={todayPanchanga}
        userPassword={userPassword}
        moduleName={lockedModuleName}
      />

    </div>
  );
}
