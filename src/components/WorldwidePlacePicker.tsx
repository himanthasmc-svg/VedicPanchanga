import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Loader2, 
  Globe, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles,
  Compass
} from 'lucide-react';
import { CityLocation, Language } from '../types';
import { COUNTRIES_AND_CITIES, findClosestCity } from '../utils/worldPlaces';
import { CITIES } from '../utils/panchanga';
import { GeocodedPlace, searchWorldwidePlaces, parseCoordinatesInput } from '../utils/worldwideGeocoder';
import { GoogleMapLocationModal } from './GoogleMapLocationModal';

interface WorldwidePlacePickerProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  selectedCountryCode: string;
  setSelectedCountryCode: (code: string) => void;
  className?: string;
  compact?: boolean;
}

export const WorldwidePlacePicker: React.FC<WorldwidePlacePickerProps> = ({
  currentLang,
  selectedCity,
  onSelectCity,
  selectedCountryCode,
  setSelectedCountryCode,
  className = '',
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');
  const [showCoordinateModal, setShowCoordinateModal] = useState(false);
  const [showGoogleMapModal, setShowGoogleMapModal] = useState(false);
  const [manualCoordsInput, setManualCoordsInput] = useState('');
  const [customPlaceName, setCustomPlaceName] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentCountry = COUNTRIES_AND_CITIES.find(c => c.code === selectedCountryCode) || COUNTRIES_AND_CITIES[0];

  // Handle clicking outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpenDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const places = await searchWorldwidePlaces(searchQuery);
        setSearchResults(places);
        setIsOpenDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectPlace = (place: GeocodedPlace) => {
    const newCity: CityLocation = {
      name: place.name,
      nameLocalized: { en: place.name, kn: place.name, hi: place.name },
      state: place.state || place.country,
      stateLocalized: { en: place.state || place.country, kn: place.state || place.country, hi: place.state || place.country },
      country: place.country,
      lat: place.lat,
      lng: place.lng,
      timezone: place.timezone || 'Asia/Kolkata'
    };
    onSelectCity(newCity);
    setSearchQuery('');
    setIsOpenDropdown(false);
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsMessage(currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ ಬೆಂಬಲವಿಲ್ಲ' : 'Geolocation not supported');
      return;
    }
    setIsGpsLoading(true);
    setGpsMessage(currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...' : 'Detecting GPS...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const closest = findClosestCity(lat, lng);

        const newCity: CityLocation = {
          name: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          nameLocalized: {
            en: `GPS Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            kn: `ಜಿಪಿಎಸ್ ಸ್ಥಳ (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            hi: `जीपीएस स्थान (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`
          },
          state: closest.state || 'Detected Area',
          stateLocalized: closest.stateLocalized || { en: 'Detected', kn: 'ಪತ್ತೆಯಾದ ಸ್ಥಳ', hi: 'प्राप्त स्थान' },
          country: closest.country || 'India',
          lat,
          lng,
          timezone: closest.timezone || 'Asia/Kolkata'
        };
        onSelectCity(newCity);
        setGpsMessage(currentLang === 'kn' ? `ಜಿಪಿಎಸ್ ಯಶಸ್ವಿ: ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E` : `GPS matched: ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
        setTimeout(() => setGpsMessage(''), 4000);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsMessage(currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ ದೋಷ: ಅನುಮತಿ ನೀಡಿ' : `GPS Error: ${err.message}`);
        setTimeout(() => setGpsMessage(''), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleApplyManualCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = parseCoordinatesInput(manualCoordsInput);
    if (!coords) {
      alert(currentLang === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ ನಮೂದಿಸಿ (ಉದಾ: 12.9716, 77.5946)' : 'Please enter valid coordinates (e.g. 12.9716, 77.5946 or paste Google Maps link)');
      return;
    }

    const closest = findClosestCity(coords.lat, coords.lng);
    const placeName = customPlaceName.trim() || `Place (${coords.lat.toFixed(2)}°, ${coords.lng.toFixed(2)}°)`;

    const newCity: CityLocation = {
      name: placeName,
      nameLocalized: { en: placeName, kn: placeName, hi: placeName },
      state: closest.state,
      stateLocalized: closest.stateLocalized,
      country: closest.country,
      lat: coords.lat,
      lng: coords.lng,
      timezone: closest.timezone || 'Asia/Kolkata'
    };

    onSelectCity(newCity);
    setShowCoordinateModal(false);
    setManualCoordsInput('');
    setCustomPlaceName('');
  };

  return (
    <div className={`space-y-3 ${className}`} ref={dropdownRef}>
      
      {/* Search Input Bar with Google Maps & GPS Integration */}
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setIsOpenDropdown(true)}
              placeholder={
                currentLang === 'kn'
                  ? 'ಯಾವುದೇ ಊರು, ಗ್ರಾಮ, ನಗರ ಅಥವಾ ಗೂಗಲ್ ಮ್ಯಾಪ್ ಅಕ್ಷಾಂಶ ನಮೂದಿಸಿ...'
                  : 'Search ANY city, town, village or paste Google Maps coordinates...'
              }
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-amber-600" />
            )}
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* GPS Button */}
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={isGpsLoading}
            className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50 shrink-0"
            title="Detect GPS coordinates directly"
          >
            {isGpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಜಿಪಿಎಸ್ (GPS)' : 'GPS'}</span>
          </button>

          {/* Google Maps Interactive Picker Button */}
          <button
            type="button"
            onClick={() => setShowGoogleMapModal(true)}
            className="px-3 py-2.5 rounded-xl bg-amber-100/80 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-750 text-amber-900 dark:text-amber-200 border-2 border-amber-300 dark:border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            title="Open Interactive Google Map & Pinpoint Location"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span className="hidden md:inline">{currentLang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ ಸ್ಥಳ' : 'Google Map'}</span>
          </button>
        </div>

        {/* Global Autocomplete Dropdown */}
        {isOpenDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-white dark:bg-stone-900 border-2 border-amber-500/80 shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
            <div className="p-2 bg-amber-50/80 dark:bg-stone-800 text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಜಾಗತಿಕ ಸ್ಥಳ ಹುಡುಕಾಟದ ಫಲಿತಾಂಶಗಳು:' : 'Worldwide Place Results:'}</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Found {searchResults.length} places</span>
            </div>

            {searchResults.map((place, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="w-full p-2.5 text-left text-xs hover:bg-amber-100/60 dark:hover:bg-stone-800/80 transition-colors flex items-start gap-2.5 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>{place.name}</span>
                    {place.state && <span className="text-stone-500 font-normal text-[11px]">({place.state})</span>}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {place.formattedAddress}
                  </p>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                    {place.lat.toFixed(4)}°N, {place.lng.toFixed(4)}°E
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {gpsMessage && (
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
          <Navigation className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{gpsMessage}</span>
        </div>
      )}

      {/* Preset Country and City Selectors (Complementary) */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ದೇಶ (Country):' : 'Preset Country:'}
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);
                const matched = COUNTRIES_AND_CITIES.find(c => c.code === e.target.value);
                if (matched && matched.cities.length > 0) {
                  onSelectCity(matched.cities[0]);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              {COUNTRIES_AND_CITIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name[currentLang] || c.name.en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              {currentLang === 'kn' ? 'ನಗರ / ಪಟ್ಟಣ (City):' : 'Preset City:'}
            </label>
            <select
              value={selectedCity.name}
              onChange={(e) => {
                const c = currentCountry.cities.find(item => item.name === e.target.value) || CITIES.find(item => item.name === e.target.value);
                if (c) onSelectCity(c);
              }}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value={selectedCity.name}>
                📍 {selectedCity.name} ({selectedCity.lat.toFixed(2)}°, {selectedCity.lng.toFixed(2)}°)
              </option>
              {currentCountry.cities.map((c) => (
                <option key={c.name} value={c.name}>{c.nameLocalized ? c.nameLocalized[currentLang] : c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Manual Coordinates / Google Map Modal */}
      {showCoordinateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 border-2 border-amber-500 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {currentLang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ ಕೋಆರ್ಡಿನೇಟ್ಸ್ ನಮೂದಿಸಿ' : 'Enter Custom Coordinates / Google Map Pin'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCoordinateModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyManualCoordinates} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {currentLang === 'kn' ? 'ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ (Latitude & Longitude):' : 'Coordinates (Latitude, Longitude):'}
                </label>
                <input
                  type="text"
                  value={manualCoordsInput}
                  onChange={(e) => setManualCoordsInput(e.target.value)}
                  placeholder="e.g. 12.9716, 77.5946 or paste Google Maps link"
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-xs focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  {currentLang === 'kn' 
                    ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ಯಾವುದೇ ಸ್ಥಳದ ಮೇಲೆ ರೈಟ್ ಕ್ಲಿಕ್ ಮಾಡಿ coordinates ಕಾಪಿ ಮಾಡಿ ಇಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ.' 
                    : 'Right-click any point on Google Maps to copy latitude/longitude and paste here.'}
                </span>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {currentLang === 'kn' ? 'ಸ್ಥಳದ ಹೆಸರು (ಐಚ್ಛಿಕ):' : 'Custom Place Name (Optional):'}
                </label>
                <input
                  type="text"
                  value={customPlaceName}
                  onChange={(e) => setCustomPlaceName(e.target.value)}
                  placeholder="e.g. My Native Village, Channarayapatna, etc."
                  className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Google Maps</span>
                </a>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  {currentLang === 'kn' ? 'ಸ್ಥಳ ದೃಢೀಕರಿಸಿ' : 'Apply Coordinates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Google Map Place Selector Modal */}
      <GoogleMapLocationModal
        isOpen={showGoogleMapModal}
        onClose={() => setShowGoogleMapModal(false)}
        currentLang={currentLang}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          onSelectCity(city);
          setShowGoogleMapModal(false);
        }}
      />
    </div>
  );
};
