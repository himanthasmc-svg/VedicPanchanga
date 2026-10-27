import { CityLocation, Language, LocalizedString } from '../types';
import { CITIES, calculateKundali, RASHI_NAKSHATRA_CHART, RASHIS } from './panchanga';

export interface UserProfile {
  name: string;
  birthDate: string; // "YYYY-MM-DD" e.g., "1995-04-14"
  birthTime: string; // "HH:MM" e.g., "06:30"
  birthPlace: string; // City name e.g., "Bengaluru, Karnataka"
  latitude: number;
  longitude: number;
  timezone: string;
  gender?: 'male' | 'female' | 'other';
  // Calculated or explicitly provided Nirayana astrological attributes
  janmaNakshatraIndex?: number; // 0 to 26
  janmaPada?: number; // 1 to 4
  chandraRashiIndex?: number; // 0 to 11
  moonLongitude?: number; // 0 to 360 degrees
}

export interface ProfileAstrologySummary {
  profile: UserProfile;
  moonLongitude: number;
  nakshatraIndex: number;
  nakshatraName: LocalizedString;
  pada: number;
  rashiIndex: number;
  rashiName: LocalizedString;
  rashiLord: LocalizedString;
  birthDateObj: Date;
}

export const USER_PROFILE_STORAGE_KEY = 'hcmm_user_profile';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Devotee / Sadhaka',
  birthDate: '1995-04-14',
  birthTime: '06:30',
  birthPlace: 'Bengaluru, Karnataka',
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: 'Asia/Kolkata',
  gender: 'other',
  janmaNakshatraIndex: 13, // Chitra
  janmaPada: 2,
  chandraRashiIndex: 5, // Kanya
  moonLongitude: 180.5
};

export const SAMPLE_PROFILES: { id: string; label: LocalizedString; profile: UserProfile }[] = [
  {
    id: 'default',
    label: {
      en: 'Primary Profile (Bengaluru)',
      kn: 'ಪ್ರಾಥಮಿಕ ಪ್ರೊಫೈಲ್ (ಬೆಂಗಳೂರು)',
      hi: 'प्राथमिक प्रोफ़ाइल (बेंगलुरु)'
    },
    profile: DEFAULT_USER_PROFILE
  },
  {
    id: 'vivekananda',
    label: {
      en: 'Swami Vivekananda (Kolkata)',
      kn: 'ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ (ಕೋಲ್ಕತ್ತಾ)',
      hi: 'स्वामी विवेकानन्द (कोलकाता)'
    },
    profile: {
      name: 'Swami Vivekananda',
      birthDate: '1863-01-12',
      birthTime: '06:33',
      birthPlace: 'Kolkata, West Bengal',
      latitude: 22.5726,
      longitude: 88.3639,
      timezone: 'Asia/Kolkata',
      gender: 'male',
      janmaNakshatraIndex: 12, // Hasta
      janmaPada: 2,
      chandraRashiIndex: 5, // Kanya
      moonLongitude: 167.3
    }
  },
  {
    id: 'ramakrishna',
    label: {
      en: 'Sri Ramakrishna Paramahamsa',
      kn: 'ಶ್ರೀ ರಾಮಕೃಷ್ಣ ಪರಮಹಂಸ',
      hi: 'श्री रामकृष्ण परमहंस'
    },
    profile: {
      name: 'Sri Ramakrishna Paramahamsa',
      birthDate: '1836-02-18',
      birthTime: '06:23',
      birthPlace: 'Kamarpukur, West Bengal',
      latitude: 22.8986,
      longitude: 87.6497,
      timezone: 'Asia/Kolkata',
      gender: 'male',
      janmaNakshatraIndex: 24, // Purva Bhadrapada
      janmaPada: 2,
      chandraRashiIndex: 10, // Kumbha
      moonLongitude: 326.8
    }
  },
  {
    id: 'krishna',
    label: {
      en: 'Sri Krishna (Janmashtami)',
      kn: 'ಶ್ರೀ ಕೃಷ್ಣ (ಜನ್ಮಾಷ್ಟಮಿ)',
      hi: 'श्री कृष्ण (जन्माष्टमी)'
    },
    profile: {
      name: 'Bhagavan Sri Krishna',
      birthDate: '1990-08-14',
      birthTime: '00:00',
      birthPlace: 'Mathura, Uttar Pradesh',
      latitude: 27.4924,
      longitude: 77.6737,
      timezone: 'Asia/Kolkata',
      gender: 'male',
      janmaNakshatraIndex: 3, // Rohini
      janmaPada: 2,
      chandraRashiIndex: 1, // Vrishabha
      moonLongitude: 44.8
    }
  }
];

/**
 * Retrieves the stored UserProfile from localStorage, falling back to DEFAULT_USER_PROFILE
 */
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.birthDate === 'string') {
        return {
          ...DEFAULT_USER_PROFILE,
          ...parsed
        };
      }
    }
  } catch (e) {
    console.warn('Error reading user profile from localStorage:', e);
  }
  return DEFAULT_USER_PROFILE;
}

/**
 * Saves user profile to localStorage and notifies subscribers via window event
 */
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('hcmm_user_profile_updated', { detail: profile }));
  } catch (e) {
    console.error('Error saving user profile to localStorage:', e);
  }
}

/**
 * Computes exact astronomical Nirayana Moon Longitude, Janma Nakshatra, Pada, and Chandra Rashi
 * for a given UserProfile using the Panchanga astronomical engine
 */
export function computeProfileAstrology(profile: UserProfile): ProfileAstrologySummary {
  const [yearStr, monthStr, dayStr] = (profile.birthDate || '1995-04-14').split('-');
  const [hoursStr, minsStr] = (profile.birthTime || '06:30').split(':');

  const year = parseInt(yearStr, 10) || 1995;
  const month = (parseInt(monthStr, 10) || 4) - 1;
  const day = parseInt(dayStr, 10) || 14;
  const hours = parseInt(hoursStr, 10) || 6;
  const mins = parseInt(minsStr, 10) || 30;

  const birthDateObj = new Date(year, month, day, hours, mins, 0);

  // If explicit moon longitude is provided and valid, use it; otherwise compute from Kundali
  let moonLong = profile.moonLongitude;

  if (typeof moonLong !== 'number' || isNaN(moonLong)) {
    const city: CityLocation = {
      name: profile.birthPlace || 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      lat: profile.latitude || 12.9716,
      lng: profile.longitude || 77.5946,
      timezone: profile.timezone || 'Asia/Kolkata'
    };

    try {
      const kundali = calculateKundali(birthDateObj.toISOString(), city);
      const moonPlanet = kundali.planets.find(p => p.name === 'Moon');
      if (moonPlanet) {
        moonLong = (moonPlanet.rashiIndex * 30) + moonPlanet.degrees;
      }
    } catch (e) {
      console.warn('Fallback to default moon longitude calculation:', e);
    }
  }

  if (typeof moonLong !== 'number' || isNaN(moonLong)) {
    // If still undefined, derive from nakshatraIndex & pada if present
    const nakIdx = profile.janmaNakshatraIndex ?? 13;
    const pada = profile.janmaPada ?? 1;
    moonLong = (nakIdx * (360 / 27)) + ((pada - 0.5) * (360 / 108));
  }

  // Normalize moon longitude to 0 - 360
  const normalizedLong = ((moonLong % 360) + 360) % 360;

  // 27 Nakshatras: 13°20' = 13.33333333 degrees each
  const nakSpan = 360 / 27;
  const nakshatraIndex = Math.floor(normalizedLong / nakSpan) % 27;

  // 108 Padas: 3°20' = 3.33333333 degrees each
  const padaSpan = 360 / 108;
  const padaInNakshatra = Math.floor((normalizedLong % nakSpan) / padaSpan) + 1;
  const pada = Math.min(4, Math.max(1, padaInNakshatra));

  // 12 Rashis: 30 degrees each
  const rashiIndex = Math.floor(normalizedLong / 30) % 12;

  // Names from charts
  const nakRecord = RASHI_NAKSHATRA_CHART[nakshatraIndex] || RASHI_NAKSHATRA_CHART[0];
  const nakshatraName: LocalizedString = {
    en: `${nakRecord.nakshatraEn} (Pada ${pada})`,
    kn: `${nakRecord.nakshatraKn} (ಪಾದ ${pada})`,
    hi: `${nakRecord.nakshatraHi} (चरण ${pada})`
  };

  const rashiMeta = RASHIS[rashiIndex] || RASHIS[0];
  const rashiName: LocalizedString = {
    en: rashiMeta.en,
    kn: rashiMeta.kn,
    hi: rashiMeta.hi
  };

  const rashiLord: LocalizedString = {
    en: rashiMeta.lordEn,
    kn: rashiMeta.lordKn,
    hi: rashiMeta.lordHi
  };

  return {
    profile: {
      ...profile,
      moonLongitude: normalizedLong,
      janmaNakshatraIndex: nakshatraIndex,
      janmaPada: pada,
      chandraRashiIndex: rashiIndex
    },
    moonLongitude: normalizedLong,
    nakshatraIndex,
    nakshatraName,
    pada,
    rashiIndex,
    rashiName,
    rashiLord,
    birthDateObj
  };
}
