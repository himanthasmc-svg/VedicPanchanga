export type Language = 'en' | 'kn' | 'hi';

export interface LocalizedString {
  en: string;
  kn: string;
  hi: string;
}

export interface RitualTimingItem {
  periodName: LocalizedString; // e.g. Brahma Muhurta, Pradosha Kala, Abhijit Muhurta, Nishita Kala
  approxTime: string; // e.g. '04:24 AM - 05:12 AM'
  significance: LocalizedString;
  recommendedRituals: LocalizedString;
}

export interface Festival {
  id: string;
  name: LocalizedString;
  tagColor: string;
  badgeBg: string;
  shortDesc: LocalizedString;
  howCelebrated: LocalizedString;
  story: LocalizedString;
  mantras: LocalizedString[];
  poojaVidhi: LocalizedString[];
  poojaSamagri?: LocalizedString[]; // Items required for Pooja and Kalasha Sthapana
  ritualTimings?: RitualTimingItem[]; // Chronological ritual guide with timings throughout the day
  isNavaratri?: boolean;
  navaratriColor?: {
    colorName: LocalizedString;
    hex: string;
    significance: LocalizedString;
  };
}

export interface TithiTimingInfo {
  startTime: string; // e.g. "Oct 18, 08:18 AM"
  endTime: string;   // e.g. "Oct 19, 10:48 AM"
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
  startTimeFormatted: LocalizedString; // Localized formatted string
  endTimeFormatted: LocalizedString;   // Localized formatted string
  isPrevDayStart: boolean;
  isNextDayEnd: boolean;
  durationHours: number;
  durationFormatted: LocalizedString; // e.g. "26 hrs 30 mins" / "೨೬ ಗಂಟೆ ೩೦ ನಿಮಿಷ"
  nextTithiName: LocalizedString;
  summary: LocalizedString;
}

export interface PadaTimingInfo {
  padaNumber: number;
  nakshatraName: LocalizedString;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  startDateFormatted: LocalizedString;
  endDateFormatted: LocalizedString;
  durationMinutes: number;
  durationHours: number;
  durationFormatted: LocalizedString;
  charanaLetter: string;
}

export interface NakshatraTimingInfo {
  nakshatraNumber: number;
  nakshatraName: LocalizedString;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  startDateFormatted: LocalizedString;
  endDateFormatted: LocalizedString;
  durationMinutes: number;
  durationHours: number;
  durationFormatted: LocalizedString;
}

export interface PanchangaDay {
  gregorianDate: string; // YYYY-MM-DD
  year: number;
  month: number;
  day: number;
  samvatsaraIndex: number; // 1 to 60
  samvatsara: LocalizedString;
  gregorianYear: number;
  hinduYearSaka: number;
  hinduYearVikram: number;
  ayana: LocalizedString;
  ritu: LocalizedString;
  masa: LocalizedString;
  isAdhikaMasa: boolean;
  paksha: 'Shukla' | 'Krishna';
  pakshaName: LocalizedString;
  tithiNumber: number; // 1 to 15
  tithiName: LocalizedString;
  tithiSanskrit: string;
  tithiTiming?: TithiTimingInfo;
  vara: LocalizedString;
  varaIndex: number; // 0 (Sunday) - 6 (Saturday)
  nakshatra: LocalizedString;
  nakshatraIndex: number;
  nakshatraTiming?: NakshatraTimingInfo;
  pada: number;
  padaTiming?: PadaTimingInfo;
  charanaLetter: string;
  yoga: LocalizedString;
  karana: LocalizedString;
  chandraRashi: LocalizedString;
  chandraRashiLord: LocalizedString;
  suryaRashi: LocalizedString;
  suryaRashiLord: LocalizedString;
  sunrise: string;
  sunset: string;
  nextDaySunrise: string;
  dinaManaMinutes: number;
  dinaManaGhatis: string; // e.g. "30 Ghatis 15 Vighatis"
  rahuKaal: {
    start: string;
    end: string;
    startGhati: string;
    endGhati: string;
  };
  gulikaKaal: {
    start: string;
    end: string;
    startGhati: string;
    endGhati: string;
  };
  yamagandaKaal: {
    start: string;
    end: string;
    startGhati: string;
    endGhati: string;
  };
  abhijitMuhurta: {
    start: string;
    end: string;
  };
  brahmaMuhurta: {
    start: string;
    end: string;
  };
  amritKaal: {
    start: string;
    end: string;
  };
  vijayaMuhurta: {
    start: string;
    end: string;
  };
  godhuliMuhurta: {
    start: string;
    end: string;
  };
  durmuhurta?: {
    start: string;
    end: string;
  };
  varjyam?: {
    start: string;
    end: string;
  };
  festivals: Festival[];
  colorTheme: string;
}

export interface MantraItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: string;
  lyrics?: LocalizedString;
  isCustom?: boolean;
  addedAt?: number;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  url: string;
  description: string;
  category: string;
}

export interface CustomEventItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'pooja' | 'vrat' | 'shraddha' | 'auspicious' | 'personal';
  reminderTime?: string;
  hasNotification?: boolean;
}

export interface CityLocation {
  name: string;
  nameLocalized?: LocalizedString;
  state: string;
  stateLocalized?: LocalizedString;
  country: string;
  countryLocalized?: LocalizedString;
  lat: number;
  lng: number;
  timezone: string;
}

export interface PlanetPosition {
  name: string;
  sanskritName: LocalizedString;
  symbol: string;
  rashiIndex: number; // 0 = Mesha, 11 = Meena
  rashiName: LocalizedString;
  degrees: number; // 0 to 30
  nakshatra: LocalizedString;
  pada: number;
  isRetrograde: boolean;
  bhava: number; // 1 to 12
  isLordOf: number[];
  color?: string;
  speed?: number; // Daily motion in degrees per day (negative indicates retrograde / vakri)
}

export interface KundaliData {
  dateTime: string;
  location: CityLocation;
  lagnaRashiIndex: number;
  lagnaDegree: number;
  lagnaNakshatra: LocalizedString;
  planets: PlanetPosition[];
  houses: {
    bhava: number;
    rashiIndex: number;
    rashiName: LocalizedString;
    planets: PlanetPosition[];
  }[];
}
