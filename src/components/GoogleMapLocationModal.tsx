import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Search,
  Navigation,
  Loader2,
  X,
  Check,
  Compass,
  Globe,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  Layers,
  Info,
  Clock,
  RotateCcw,
  Crosshair
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { getPanchangaForDate } from '../utils/panchanga';
import { findClosestCity } from '../utils/worldPlaces';

declare const google: any;

interface GoogleMapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

// Sacred Hindu pilgrimage centers & major Indian/world hubs
const POPULAR_SACRED_PLACES: { name: string; en: string; kn: string; hi: string; state: string; lat: number; lng: number; tz: string }[] = [
  { name: 'Bengaluru', en: 'Bengaluru', kn: 'ಬೆಂಗಳೂರು', hi: 'बेंगलुरु', state: 'Karnataka', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Mysuru', en: 'Mysuru', kn: 'ಮೈಸೂರು', hi: 'मैसूरु', state: 'Karnataka', lat: 12.2958, lng: 76.6394, tz: 'Asia/Kolkata' },
  { name: 'Udupi Sri Krishna Matha', en: 'Udupi Sri Krishna Matha', kn: 'ಉಡುಪಿ ಶ್ರೀಕೃಷ್ಣ ಮಠ', hi: 'उडुपी श्रीकृष्ण मठ', state: 'Karnataka', lat: 13.3409, lng: 74.7421, tz: 'Asia/Kolkata' },
  { name: 'Dharmasthala Manjunatha', en: 'Dharmasthala Manjunatha', kn: 'ಧರ್ಮಸ್ಥಳ ಮಂಜುನಾಥ', hi: 'धर्मस्थल मंजुनाथ', state: 'Karnataka', lat: 12.9497, lng: 75.3789, tz: 'Asia/Kolkata' },
  { name: 'Gokarna Mahabaleshwara', en: 'Gokarna Mahabaleshwara', kn: 'ಗೋಕರ್ಣ ಮಹಾಬಲೇಶ್ವರ', hi: 'गोकर्ण महाबलेश्वर', state: 'Karnataka', lat: 14.5426, lng: 74.3188, tz: 'Asia/Kolkata' },
  { name: 'Sringeri Sharada Peetham', en: 'Sringeri Sharada Peetham', kn: 'ಶೃಂಗೇರಿ ಶಾರದಾ ಪೀಠ', hi: 'शृंगेरी शारदा पीठ', state: 'Karnataka', lat: 13.4189, lng: 75.2570, tz: 'Asia/Kolkata' },
  { name: 'Kashi Vishwanath (Varanasi)', en: 'Kashi Vishwanath', kn: 'ಕಾಶಿ ವಿಶ್ವನಾಥ (ವಾರಣಾಸಿ)', hi: 'काशी विश्वनाथ (वाराणसी)', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, tz: 'Asia/Kolkata' },
  { name: 'Ayodhya Ram Mandir', en: 'Ayodhya Ram Mandir', kn: 'ಅಯೋಧ್ಯೆ ರಾಮ ಮಂದಿರ', hi: 'अयोध्या राम मन्दिर', state: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998, tz: 'Asia/Kolkata' },
  { name: 'Tirupati Balaji', en: 'Tirupati Balaji', kn: 'ತಿರುಪತಿ ತಿರುಮಲ', hi: 'तिरुपति बालाजी', state: 'Andhra Pradesh', lat: 13.6833, lng: 79.3472, tz: 'Asia/Kolkata' },
  { name: 'Haridwar Ganga Ghat', en: 'Haridwar Ganga Ghat', kn: 'ಹರಿದ್ವಾರ ಗಂಗಾ ಘಾಟ್', hi: 'हरिद्वार गंगा घाट', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, tz: 'Asia/Kolkata' },
  { name: 'New Delhi', en: 'New Delhi', kn: 'ನವದೆಹಲಿ', hi: 'नई दिल्ली', state: 'Delhi', lat: 28.6139, lng: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', en: 'Mumbai', kn: 'ಮುಂಬೈ', hi: 'मुम्बई', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'London', en: 'London', kn: 'ಲಂಡನ್', hi: 'लंदन', state: 'United Kingdom', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York', en: 'New York', kn: 'ನ್ಯೂಯಾರ್ಕ್', hi: 'न्यूयॉर्क', state: 'USA', lat: 40.7128, lng: -74.0060, tz: 'America/New_York' },
  { name: 'Singapore', en: 'Singapore', kn: 'ಸಿಂಗಾಪುರ', hi: 'सिंगापुर', state: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Sydney', en: 'Sydney', kn: 'ಸಿಡ್ನಿ', hi: 'सिडनी', state: 'Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' }
];

// Inner component with access to Google Maps instance
const MapInnerController: React.FC<{
  currentPos: { lat: number; lng: number };
  onMapClickPos: (lat: number, lng: number) => void;
  tempCity: CityLocation;
}> = ({ currentPos, onMapClickPos, tempCity }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo({ lat: currentPos.lat, lng: currentPos.lng });
    }
  }, [map, currentPos.lat, currentPos.lng]);

  return (
    <>
      <Map
        id="google-maps-panchanga-picker"
        mapId="DEMO_MAP_ID"
        defaultCenter={{ lat: currentPos.lat, lng: currentPos.lng }}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        streetViewControl={false}
        fullscreenControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        onClick={(e) => {
          if (e.detail?.latLng) {
            onMapClickPos(e.detail.latLng.lat, e.detail.latLng.lng);
          }
        }}
        className="w-full h-full"
      >
        <AdvancedMarker
          position={{ lat: currentPos.lat, lng: currentPos.lng }}
          title={tempCity.name}
        >
          <Pin
            background="#d97706"
            glyphColor="#ffffff"
            borderColor="#78350f"
            scale={1.2}
          />
        </AdvancedMarker>
      </Map>
    </>
  );
};

export const GoogleMapLocationModal: React.FC<GoogleMapLocationModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  selectedCity,
  onSelectCity
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCZyYeIUnxBDoClVb-eAtO0l3jDO-_hPuk';

  // Current working marker position
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number }>({
    lat: selectedCity.lat,
    lng: selectedCity.lng
  });

  // Staging city object
  const [tempCity, setTempCity] = useState<CityLocation>(selectedCity);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ title: string; subtitle: string; placeId?: string; lat?: number; lng?: number }[]>([]);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  // GPS state
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('');

  // Auto-location on startup preference
  const [autoDetectOnStartup, setAutoDetectOnStartup] = useState<boolean>(() => {
    return localStorage.getItem('hcmm_auto_detect_location') === 'true';
  });

  // Today's Panchanga Preview for the staged coordinates
  const stagedPanchangaSample = React.useMemo<PanchangaDay>(() => {
    return getPanchangaForDate(new Date(), tempCity);
  }, [tempCity]);

  // Keep staged city in sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPos({ lat: selectedCity.lat, lng: selectedCity.lng });
      setTempCity(selectedCity);
      setSearchQuery('');
      setSearchResults([]);
      setShowResultsDropdown(false);
      setGpsStatusText('');
    }
  }, [isOpen, selectedCity]);

  // Handle GPS Auto-detect
  const handleAutoDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatusText(
        currentLang === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಜಿಪಿಎಸ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsGpsLoading(true);
    setGpsStatusText(
      currentLang === 'kn'
        ? 'ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...'
        : 'Detecting your high-precision GPS coordinates...'
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsGpsLoading(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPos({ lat, lng });

        // Reverse geocode via Google Geocoding or closest city
        try {
          // If google geocoder is available in window
          if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
              if (status === 'OK' && results && results[0]) {
                const res = results[0];
                let city = '';
                let state = '';
                let country = '';

                for (const comp of res.address_components) {
                  if (comp.types.includes('locality')) city = comp.long_name;
                  else if (!city && comp.types.includes('sublocality_level_1')) city = comp.long_name;
                  else if (!city && comp.types.includes('administrative_area_level_2')) city = comp.long_name;
                  if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
                  if (comp.types.includes('country')) country = comp.long_name;
                }

                if (!city) city = res.formatted_address.split(',')[0] || `GPS Location`;
                if (!state) state = country || 'Detected Area';

                const closest = findClosestCity(lat, lng);
                const tz = closest?.timezone || (country === 'India' ? 'Asia/Kolkata' : Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');

                const detectedCity: CityLocation = {
                  name: city,
                  nameLocalized: { en: city, kn: city, hi: city },
                  state,
                  stateLocalized: { en: state, kn: state, hi: state },
                  country: country || 'India',
                  countryLocalized: { en: country || 'India', kn: country || 'ಭಾರತ', hi: country || 'भारत' },
                  lat,
                  lng,
                  timezone: tz
                };
                setTempCity(detectedCity);
                setGpsStatusText(
                  currentLang === 'kn'
                    ? `ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ: ${city}, ${state} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`
                    : `GPS Pinpointed: ${city}, ${state} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`
                );
                return;
              }
            });
          }
        } catch (e) {
          // fallback
        }

        const closest = findClosestCity(lat, lng);
        const fallbackCity: CityLocation = {
          name: `Current Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          nameLocalized: {
            en: `Current Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            kn: `ಪ್ರಸ್ತುತ ಸ್ಥಳ (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            hi: `वर्तमान स्थान (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
          },
          state: closest.state || 'Local Region',
          country: closest.country || 'India',
          lat,
          lng,
          timezone: closest.timezone || 'Asia/Kolkata'
        };
        setTempCity(fallbackCity);
        setGpsStatusText(
          currentLang === 'kn'
            ? `ಜಿಪಿಎಸ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
            : `GPS Acquired: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
        );
      },
      (error) => {
        setIsGpsLoading(false);
        setGpsStatusText(
          currentLang === 'kn'
            ? `ಜಿಪಿಎಸ್ ದೋಷ: ${error.message}. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅನುಮತಿ ನೀಡಿ.`
            : `GPS Error: ${error.message}. Please allow location permission in your browser.`
        );
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [currentLang]);

  // Handle map click to place pin and reverse geocode
  const handleMapClickPos = useCallback((lat: number, lng: number) => {
    setCurrentPos({ lat, lng });

    // Try Google Maps Geocoder if available
    try {
      if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results && results[0]) {
            const res = results[0];
            let city = '';
            let state = '';
            let country = '';

            for (const comp of res.address_components) {
              if (comp.types.includes('locality')) city = comp.long_name;
              else if (!city && comp.types.includes('sublocality_level_1')) city = comp.long_name;
              else if (!city && comp.types.includes('administrative_area_level_2')) city = comp.long_name;
              if (comp.types.includes('administrative_area_level_1')) state = comp.long_name;
              if (comp.types.includes('country')) country = comp.long_name;
            }

            if (!city) city = res.formatted_address.split(',')[0] || `Map Pin (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
            if (!state) state = country || 'Region';

            const closest = findClosestCity(lat, lng);
            const tz = closest?.timezone || (country === 'India' ? 'Asia/Kolkata' : Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');

            setTempCity({
              name: city,
              nameLocalized: { en: city, kn: city, hi: city },
              state,
              stateLocalized: { en: state, kn: state, hi: state },
              country: country || 'Earth',
              countryLocalized: { en: country || 'Earth', kn: country || 'ಭೂಮಿ', hi: country || 'पृथ्वी' },
              lat,
              lng,
              timezone: tz
            });
            return;
          }
        });
      }
    } catch {
      // ignore
    }

    // Default fallback
    const closest = findClosestCity(lat, lng);
    setTempCity({
      name: `Map Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
      nameLocalized: {
        en: `Map Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        kn: `ನಕ್ಷೆಯ ಸ್ಥಳ (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        hi: `मानचित्र स्थान (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
      },
      state: closest.state || 'Selected Spot',
      country: closest.country || 'Earth',
      lat,
      lng,
      timezone: closest.timezone || 'Asia/Kolkata'
    });
  }, []);

  // Handle Search input
  const handlePerformSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      return;
    }

    setIsSearching(true);

    try {
      // 1. If Google Maps Places Autocomplete is available
      if (typeof google !== 'undefined' && google.maps) {
        // First try Geocoder for universal city/temple/village search
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, (results: any[], status: string) => {
          setIsSearching(false);
          if (status === 'OK' && results && results.length > 0) {
            const mapped = results.slice(0, 6).map((r: any) => {
              const lat = r.geometry.location.lat();
              const lng = r.geometry.location.lng();
              const parts = r.formatted_address.split(',');
              const title = parts[0] || query;
              const subtitle = parts.slice(1).join(',').trim();
              return { title, subtitle, lat, lng };
            });
            setSearchResults(mapped);
            setShowResultsDropdown(true);
          } else {
            // Local fallback match
            matchLocalPlaces(query);
          }
        });
        return;
      }
    } catch {
      // fallback
    }

    matchLocalPlaces(query);
    setIsSearching(false);
  }, []);

  const matchLocalPlaces = (q: string) => {
    const qLower = q.toLowerCase();
    const matched = POPULAR_SACRED_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.kn.toLowerCase().includes(qLower) ||
        p.hi.toLowerCase().includes(qLower) ||
        p.state.toLowerCase().includes(qLower)
    ).map((p) => ({
      title: p.name,
      subtitle: `${p.state}, India`,
      lat: p.lat,
      lng: p.lng
    }));

    setSearchResults(matched);
    setShowResultsDropdown(matched.length > 0);
  };

  const handleSelectSearchResult = (res: { title: string; subtitle: string; lat?: number; lng?: number }) => {
    if (res.lat !== undefined && res.lng !== undefined) {
      const lat = res.lat;
      const lng = res.lng;
      setCurrentPos({ lat, lng });

      const closest = findClosestCity(lat, lng);
      const isIndia = res.subtitle.includes('India') || (lat > 6 && lat < 38 && lng > 68 && lng < 98);
      const tz = isIndia ? 'Asia/Kolkata' : closest.timezone || 'Asia/Kolkata';

      setTempCity({
        name: res.title,
        nameLocalized: { en: res.title, kn: res.title, hi: res.title },
        state: res.subtitle.split(',')[0]?.trim() || closest.state,
        country: isIndia ? 'India' : closest.country,
        lat,
        lng,
        timezone: tz
      });

      setShowResultsDropdown(false);
      setSearchQuery(res.title);
    }
  };

  const handleApplyLocation = () => {
    onSelectCity(tempCity);
    localStorage.setItem('hcmm_city', JSON.stringify(tempCity));
    localStorage.setItem('hcmm_auto_detect_location', autoDetectOnStartup ? 'true' : 'false');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-300/80 dark:border-stone-700 overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-amber-100">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-serif tracking-tight">
                  {currentLang === 'kn'
                    ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ ಮತ್ತು ಸ್ವಯಂ ಸ್ಥಳ ಆಯ್ಕೆ'
                    : currentLang === 'hi'
                    ? 'गूगल मैप एवं स्वतः स्थान चयन'
                    : 'Google Maps & Auto-Location Place Selector'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-xs">
                  GPS Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-100 font-medium line-clamp-1">
                {currentLang === 'kn'
                  ? 'ನಿಖರವಾದ ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ, ತಿಥಿ ಮತ್ತು ನಕ್ಷತ್ರಕ್ಕಾಗಿ ವಿಶ್ವದ ಯಾವುದೇ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.'
                  : 'Pinpoint any city, town, temple, or coordinates on Google Maps for hyper-accurate local Panchanga.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">

          {/* Search Bar & 1-Click GPS Auto Detect */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
            
            {/* Live Autocomplete Search Input */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handlePerformSearch(e.target.value);
                  }}
                  onFocus={() => searchResults.length > 0 && setShowResultsDropdown(true)}
                  placeholder={
                    currentLang === 'kn'
                      ? 'ಯಾವುದೇ ಊರು, ದೇವಸ್ಥಾನ, ತಾಲೂಕು ಅಥವಾ ನಗರ ಹುಡುಕಿ (ಉದಾ: Udupi, Kashi, Tirupati)...'
                      : 'Search any city, temple, village, or landmark (e.g. Udupi, Kashi, Tirupati, London)...'
                  }
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-amber-600 animate-spin absolute right-3" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowResultsDropdown(false);
                    }}
                    className="absolute right-3 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {/* Autocomplete Results Dropdown */}
              {showResultsDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-amber-500 shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-750">
                  <div className="px-3 py-1.5 bg-amber-50 dark:bg-stone-800 text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <span>Google Maps Search Suggestions</span>
                    <span className="text-[10px] text-stone-400">Click to Fly Map</span>
                  </div>
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-amber-100/70 dark:hover:bg-stone-750 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100">{res.title}</div>
                        {res.subtitle && <div className="text-[11px] text-stone-500 dark:text-stone-400">{res.subtitle}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto Detect GPS Button */}
            <button
              type="button"
              onClick={handleAutoDetectLocation}
              disabled={isGpsLoading}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title="Detect your exact physical GPS coordinates automatically"
            >
              {isGpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Navigation className="w-4 h-4 text-emerald-200 animate-pulse" />
              )}
              <span>
                {currentLang === 'kn'
                  ? 'ಸ್ವಯಂ ಜಿಪಿಎಸ್ ಸ್ಥಳ (Auto GPS)'
                  : currentLang === 'hi'
                  ? 'स्वतः जीपीएस (Auto GPS)'
                  : 'Auto-Detect My GPS Location'}
              </span>
            </button>
          </div>

          {/* GPS feedback alert */}
          {gpsStatusText && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="flex-1">{gpsStatusText}</span>
              <button
                type="button"
                onClick={() => setGpsStatusText('')}
                className="text-stone-400 hover:text-stone-600 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sacred & Famous Regional Quick-Picks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>
                  {currentLang === 'kn'
                    ? 'ಪ್ರಸಿದ್ಧ ಪುಣ್ಯಕ್ಷೇತ್ರಗಳು ಮತ್ತು ನಗರಗಳು:'
                    : currentLang === 'hi'
                    ? 'प्रसिद्ध तीर्थ क्षेत्र एवं नगर:'
                    : 'Sacred Pilgrimage Sites & Key Cities:'}
                </span>
              </span>
              <span className="text-[10px] text-stone-400">Click to pin on map</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {POPULAR_SACRED_PLACES.map((p) => {
                const isSelected = tempCity.name === p.name || (Math.abs(tempCity.lat - p.lat) < 0.05 && Math.abs(tempCity.lng - p.lng) < 0.05);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setCurrentPos({ lat: p.lat, lng: p.lng });
                      setTempCity({
                        name: p.name,
                        nameLocalized: { en: p.name, kn: p.kn, hi: p.hi },
                        state: p.state,
                        country: p.tz.includes('Asia/Kolkata') ? 'India' : 'International',
                        lat: p.lat,
                        lng: p.lng,
                        timezone: p.tz
                      });
                      setSearchQuery(p.name);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    <span>{p[currentLang] || p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Google Map Box */}
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-stone-700 shadow-inner">
            <APIProvider apiKey={apiKey} libraries={['places', 'marker']}>
              <MapInnerController
                currentPos={currentPos}
                onMapClickPos={handleMapClickPos}
                tempCity={tempCity}
              />
            </APIProvider>

            {/* Over-Map Instruction Hint */}
            <div className="absolute top-3 left-3 pointer-events-none z-10 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {currentLang === 'kn'
                  ? 'ನಕ್ಷೆಯಲ್ಲಿ ಎಲ್ಲಿಯಾದರೂ ಕ್ಲಿಕ್ ಮಾಡಿ ಆ ಸ್ಥಳವನ್ನು ತಕ್ಷಣ ಪಿನ್ ಮಾಡಿ'
                  : 'Click anywhere on the map to drop the marker on that exact spot'}
              </span>
            </div>

            {/* Coordinates Floating Badge */}
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold shadow-md border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{currentPos.lat.toFixed(4)}°N, {currentPos.lng.toFixed(4)}°E</span>
            </div>
          </div>

          {/* Staged Location Details & Astronomical Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Selected Spot Details */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾದ ಸ್ಥಳದ ವಿವರ' : 'Selected Location Profile'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-200/70 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold">
                  {tempCity.timezone}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white">
                  {tempCity.nameLocalized ? tempCity.nameLocalized[currentLang] : tempCity.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {tempCity.stateLocalized ? tempCity.stateLocalized[currentLang] : tempCity.state}, {tempCity.countryLocalized ? tempCity.countryLocalized[currentLang] : tempCity.country}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-sans">Latitude</span>
                  <strong>{tempCity.lat.toFixed(4)}° N</strong>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 block font-sans">Longitude</span>
                  <strong>{tempCity.lng.toFixed(4)}° E</strong>
                </div>
              </div>
            </div>

            {/* Calculated Astronomical Preview (Sunrise, Sunset, Dina Mana, Rahu Kaal) */}
            <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-stone-800 border border-orange-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-orange-600" />
                  <span>{currentLang === 'kn' ? 'ಇಂದಿನ ಸೂರ್ಯೋದಯ ಮತ್ತು ಪಂಚಾಂಗ ಲೆಕ್ಕಾಚಾರ' : 'Today\'s Astronomical Calculations'}</span>
                </span>
                <span className="text-[10px] text-stone-400">Live Preview</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Sunrise</span>
                  </span>
                  <strong className="text-amber-800 dark:text-amber-300 font-mono text-xs">{stagedPanchangaSample.sunrise}</strong>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block flex items-center gap-1">
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Sunset</span>
                  </span>
                  <strong className="text-orange-800 dark:text-orange-300 font-mono text-xs">{stagedPanchangaSample.sunset}</strong>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Dina Mana</span>
                  <strong className="text-stone-800 dark:text-stone-200 font-mono text-[11px] truncate block">
                    {stagedPanchangaSample.dinaManaGhatis}
                  </strong>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-rose-500 dark:text-rose-400 block">Rahu Kaal Today</span>
                  <strong className="text-rose-700 dark:text-rose-300 font-mono text-[11px] truncate block">
                    {stagedPanchangaSample.rahuKaal.start} - {stagedPanchangaSample.rahuKaal.end}
                  </strong>
                </div>
              </div>
            </div>

          </div>

          {/* Auto-detect toggle checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <input
              type="checkbox"
              id="auto-detect-startup"
              checked={autoDetectOnStartup}
              onChange={(e) => setAutoDetectOnStartup(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="auto-detect-startup" className="text-xs text-stone-700 dark:text-stone-300 font-medium cursor-pointer">
              {currentLang === 'kn'
                ? 'ಪ್ರತಿದಿನ ಆಪ್ ತೆರೆದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ (Auto-detect location on app launch)'
                : 'Automatically detect my GPS location when launching the app'}
            </label>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-stone-50 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
            <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಸ್ಥಳ:' : 'Currently active:'} </span>
            <strong className="text-stone-800 dark:text-stone-200">
              {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}
            </strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {currentLang === 'kn' ? 'ರದ್ದುಮಾಡಿ (Cancel)' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleApplyLocation}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {currentLang === 'kn'
                  ? 'ಈ ಸ್ಥಳವನ್ನು ಅನ್ವಯಿಸಿ (Apply Location)'
                  : currentLang === 'hi'
                  ? 'यह स्थान लागू करें (Apply)'
                  : 'Apply & Set as Active Location'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
