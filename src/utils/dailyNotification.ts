import { CityLocation, Language, LocalizedString, PanchangaDay } from '../types';
import { getPanchangaForDate, getLocalizedPlaceName } from './panchanga';

const STORAGE_KEY_ENABLED = 'hcmm_daily_notify_enabled';
const STORAGE_KEY_LAST_DATE = 'hcmm_last_daily_notification_date';
const STORAGE_KEY_SANDHYA_CONFIG = 'hcmm_sandhya_alerts_config';
const STORAGE_KEY_SANDHYA_FIRED_PREFIX = 'hcmm_sandhya_fired_';

export type AuspiciousAlertType =
  | 'pratah_sandhya'
  | 'madhyahnika_sandhya'
  | 'sayam_sandhya'
  | 'shiva_pradosha_puja'
  | 'devi_sandhya_deepa'
  | 'brahma_muhurta'
  | 'abhijit_puja';

export interface SandhyaNotificationConfig {
  enabled: boolean;
  advanceMinutes: number; // 0, 5, 10, or 15 minutes before
  activeAlertTypes: AuspiciousAlertType[];
  soundChime: boolean;
  vibration: boolean;
  shivaDeviFocus: boolean;
}

export interface AuspiciousAlertWindow {
  id: AuspiciousAlertType;
  name: LocalizedString;
  subtitle: LocalizedString;
  deityFocus: 'shiva' | 'devi' | 'shiva_devi' | 'surya_gayatri';
  shivaDeviMantra: string;
  recommendedRitual: LocalizedString;
  startMinutes: number; // Minutes from 00:00 midnight in city's local time
  endMinutes: number;
  startTimeStr: string;
  endTimeStr: string;
  category: 'sandhya' | 'puja' | 'muhurta';
}

export const DEFAULT_SANDHYA_CONFIG: SandhyaNotificationConfig = {
  enabled: true,
  advanceMinutes: 5,
  activeAlertTypes: [
    'pratah_sandhya',
    'madhyahnika_sandhya',
    'sayam_sandhya',
    'shiva_pradosha_puja',
    'devi_sandhya_deepa',
    'brahma_muhurta'
  ],
  soundChime: true,
  vibration: true,
  shivaDeviFocus: true
};

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export function isDailyNotificationEnabled(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
  return saved === null || saved === 'true';
}

export function setDailyNotificationEnabled(enabled: boolean): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
  }
}

export function getSandhyaNotificationConfig(): SandhyaNotificationConfig {
  if (typeof localStorage === 'undefined') return DEFAULT_SANDHYA_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SANDHYA_CONFIG);
    if (raw) {
      return { ...DEFAULT_SANDHYA_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading sandhya config:', e);
  }
  return DEFAULT_SANDHYA_CONFIG;
}

export function saveSandhyaNotificationConfig(config: SandhyaNotificationConfig): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SANDHYA_CONFIG, JSON.stringify(config));
  }
}

/**
 * Web Audio API Bell Chime for Sandhyavandana & Shiva-Devi Auspicious Alerts
 */
export function playSacredTempleBell(durationSec: number = 2.5): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    // Harmonic frequencies for rich bronze temple bell chime (D5 fundamental, A5, D6, F#6)
    const freqs = [587.33, 880.0, 1174.66, 1479.98];
    const gains = [0.35, 0.22, 0.14, 0.07];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec);
    });
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

/**
 * Parses "HH:MM AM/PM" to minutes from 00:00 midnight
 */
export function parseTimeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().toUpperCase().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const meridian = match[3];
  if (meridian === 'PM' && h < 12) h += 12;
  if (meridian === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Formats minutes from midnight to "HH:MM AM/PM"
 */
export function minutesToTimeStringFormat(minutes: number): string {
  let m = Math.round(minutes);
  while (m < 0) m += 1440;
  m = m % 1440;
  const hours24 = Math.floor(m / 60);
  const mins = m % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${period}`;
}

/**
 * Calculates all auspicious Sandhyavandana and Shiva/Devi Puja windows
 * for a specific date and location based on sunrise & sunset.
 */
export function calculateAuspiciousWindowsForDay(
  date: Date,
  selectedCity: CityLocation
): AuspiciousAlertWindow[] {
  const panchang = getPanchangaForDate(date, selectedCity);
  
  const sunriseMin = parseTimeStringToMinutes(panchang.sunrise) || 360; // Default 6:00 AM
  const sunsetMin = parseTimeStringToMinutes(panchang.sunset) || 1080;  // Default 6:00 PM

  // Day length in minutes
  const dayLengthMin = Math.max(600, sunsetMin - sunriseMin);
  const muhurtaLen = dayLengthMin / 15; // ~48 minutes per Vedic Muhurta

  // 1. Brahma Muhurta: 2 Muhurtas (96 min) before sunrise to 1 Muhurta (48 min) before sunrise
  const brahmaStartMin = Math.max(0, sunriseMin - 96);
  const brahmaEndMin = Math.max(0, sunriseMin - 48);

  // 2. Pratah Sandhyavandana: 30 minutes before sunrise until sunrise + 15 mins (Stars fading, Sun emerging)
  const pratahStartMin = Math.max(0, sunriseMin - 30);
  const pratahEndMin = sunriseMin + 15;

  // 3. Madhyahnika Sandhyavandana: Solar Midday / Abhijit Muhurta (8th Muhurta)
  const abhijitStartMin = parseTimeStringToMinutes(panchang.abhijitMuhurta?.start) || Math.round(sunriseMin + 7 * muhurtaLen);
  const abhijitEndMin = parseTimeStringToMinutes(panchang.abhijitMuhurta?.end) || Math.round(abhijitStartMin + muhurtaLen);

  // 4. Sayam Sandhyavandana: 24 minutes before sunset until 24 minutes after sunset (Godhuli Kaal)
  const sayamStartMin = Math.max(0, sunsetMin - 24);
  const sayamEndMin = sunsetMin + 24;

  // 5. Shiva Pradosha Kaal: 45 minutes before sunset until 45 minutes after sunset (Auspicious Shiva Abhishekam)
  const pradoshaStartMin = Math.max(0, sunsetMin - 45);
  const pradoshaEndMin = sunsetMin + 45;

  // 6. Devi Sandhya & Akhanda Deepa Puja: Sunset twilight (15 mins before sunset to 30 mins after sunset)
  const deviDeepaStartMin = Math.max(0, sunsetMin - 15);
  const deviDeepaEndMin = sunsetMin + 30;

  return [
    {
      id: 'brahma_muhurta',
      name: {
        kn: 'ಬ್ರಹ್ಮ ಮುಹೂರ್ತ (ಪ್ರಾತಃ ಶಿವ-ಶಕ್ತಿ ಸಾಧನ)',
        hi: 'ब्रह्म मुहूर्त (प्रातः शिव-शक्ति साधना)',
        en: 'Brahma Muhurta (Pre-Dawn Shiva-Shakti Stillness)'
      },
      subtitle: {
        kn: 'ಸೂರ್ಯೋದಯಕ್ಕೆ ೯೬-೪೮ ನಿಮಿಷ ಮುನ್ನ; ಸತ್ವಗುಣ ಪ್ರಧಾನ ಕಾಲ',
        hi: 'सूर्योदय से ९६-४८ मिनट पूर्व; सात्विक साधना काल',
        en: '96–48 mins before Sunrise; sacred pre-dawn meditation'
      },
      deityFocus: 'shiva_devi',
      shivaDeviMantra: 'ॐ नमः शिवाय । ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्यೋರ್ಮುಕ್ಷೀಯ ಮಾಮೃತಾತ್ ॥',
      recommendedRitual: {
        kn: 'ಸ್ನಾನ-ಶುದ್ಧರಾಗಿ ಶಿವ-ಪಾರ್ವತೀ ಪ್ರಾತಃಸ್ಮರಣೆ, ಮಹಾ ಮೃತ್ಯುಂಜಯ ಜಪ ಹಾಗೂ ಧ್ಯಾನ ಕೈಗೊಳ್ಳಿ.',
        hi: 'स्नान कर शिव-पार्वती प्रातःस्मरण, महामृत्युंजय मन्त्र जप एवं ध्यान करें।',
        en: 'Bathe and engage in Shiva-Parvati remembrance, Maha Mrityunjaya Japa, and silent meditation.'
      },
      startMinutes: brahmaStartMin,
      endMinutes: brahmaEndMin,
      startTimeStr: minutesToTimeStringFormat(brahmaStartMin),
      endTimeStr: minutesToTimeStringFormat(brahmaEndMin),
      category: 'sandhya'
    },
    {
      id: 'pratah_sandhya',
      name: {
        kn: 'ಪ್ರಾತಃ ಸಂಧ್ಯಾವಂದನ & ಶಿವ ಗಾಯತ್ರೀ ಕಾಲ',
        hi: 'प्रातः संध्यावन्दन एवं शिव-गायत्री काल',
        en: 'Pratah Sandhyavandana & Shiva-Gayatri Window'
      },
      subtitle: {
        kn: 'ಸೂರ್ಯೋದಯ ಸಂಧಿಕಾಲ; ಪ್ರಾತಃ ಅರ್ಘ್ಯ ಪ್ರದಾನ ಹಾಗೂ ಗಾಯತ್ರೀ ಜಪ',
        hi: 'सूर्योदय सन्धि वेला; प्रातः अर्घ्य एवं गायत्री जप',
        en: 'Dawn celestial junction; solar water oblations and Gayatri recitation'
      },
      deityFocus: 'shiva',
      shivaDeviMantra: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥',
      recommendedRitual: {
        kn: 'ಉದಯೋನ್ಮುಖ ಸೂರ್ಯನಿಗೆ ಪ್ರಾತಃ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ, ಶಿವ-ಗಾಯತ್ರೀ ಹಾಗೂ ಸಾವಿತ್ರೀ ಗಾಯತ್ರೀ ಜಪ ಪೂರೈಸಿ.',
        hi: 'उदयगामी सूर्य को प्रातः अर्घ्य दें, शिव-गायत्री व सावित्री गायत्री जप सम्पन्न करें।',
        en: 'Offer sacred morning Arghya to the rising Sun, completing Shiva-Gayatri and Savitri Gayatri japa.'
      },
      startMinutes: pratahStartMin,
      endMinutes: pratahEndMin,
      startTimeStr: minutesToTimeStringFormat(pratahStartMin),
      endTimeStr: minutesToTimeStringFormat(pratahEndMin),
      category: 'sandhya'
    },
    {
      id: 'madhyahnika_sandhya',
      name: {
        kn: 'ಮಾಧ್ಯಾಹ್ನಿಕ ಸಂಧ್ಯಾವಂದನ & ಸದಾಶಿವ ಅಭಿಜಿತ್ ಪೂಜೆ',
        hi: 'माध्याह्न संध्यावन्दन एवं सदाशिव अभिजित पूजा',
        en: 'Madhyahnika Sandhya & Sadashiva Abhijit Puja'
      },
      subtitle: {
        kn: 'ಸೂರ್ಯ-ಮಧ್ಯಾಹ್ನದ ಪರಮ ಮಂಗಳಕರ ಕಾಲ; ದೋಷಹಾರಿ ಮುಹೂರ್ತ',
        hi: 'मध्याह्न की परम पावन वेला; सर्व दोष निवारक मुहूर्त',
        en: 'Peak solar noon junction; removes planetary afflictions'
      },
      deityFocus: 'shiva_devi',
      shivaDeviMantra: 'ॐ साम्बसदाशिवाय नमः । दीपज्योतिः पराशक्तिः दीपज्योतिः सदाशिवः ॥',
      recommendedRitual: {
        kn: 'ಮಧ್ಯಾಹ್ನ ಸಂಧ್ಯಾವಂದನೆ, ಸೂರ್ಯಾರ್ಘ್ಯ ಪ್ರದಾನ ಮತ್ತು ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ಪೂಜೆ/ಸಂಕಲ್ಪ ನೆರವೇರಿಸಿ.',
        hi: 'मध्याह्न संध्या, सूर्य अर्घ्य एवं श्री साम्बसदाशिव पूजन/संकल्प सम्पन्न करें।',
        en: 'Perform midday Sandhya, solar water offering, and divine Samba Sadashiva worship.'
      },
      startMinutes: abhijitStartMin,
      endMinutes: abhijitEndMin,
      startTimeStr: minutesToTimeStringFormat(abhijitStartMin),
      endTimeStr: minutesToTimeStringFormat(abhijitEndMin),
      category: 'sandhya'
    },
    {
      id: 'sayam_sandhya',
      name: {
        kn: 'ಸಾಯಂ ಸಂಧ್ಯಾವಂದನ & ಗೋಧೂಳಿ ಸಂಧಿಕಾಲ',
        hi: 'सायं संध्यावन्दन एवं गोधूलि सन्धि काल',
        en: 'Sayam Sandhyavandana & Godhuli Twilight'
      },
      subtitle: {
        kn: 'ಸೂರ್ಯಾಸ್ತದ ಮಂಗಳ ಸಂಜೆ; ಸಾಯಂ ಅರ್ಘ್ಯ ಹಾಗೂ ದೇವೀ ಸ್ತುತಿ',
        hi: 'सूर्यास्त कालीन पावन वेला; सायं अर्घ्य एवं देवी स्तुति',
        en: 'Dusk celestial transition; evening Arghya & Mother Goddess invocations'
      },
      deityFocus: 'devi',
      shivaDeviMantra: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥',
      recommendedRitual: {
        kn: 'ಸೂರ್ಯಾಸ್ತಕ್ಕೆ ಮುನ್ನ ಸಾಯಂ ಅರ್ಘ್ಯ ನೀಡಿ, ಗಾಯತ್ರೀ ಜಪಿಸಿ, ದೇವೀ ದುರ್ಗಾ ಗಾಯತ್ರೀ ಪಠಿಸಿ.',
        hi: 'सूर्यास्त पूर्व सायं अर्घ्य प्रदान कर गायत्री एवं दुर्गा गायत्री जप करें।',
        en: 'Offer evening Arghya before sunset, chant Gayatri, and recite Sri Durga Gayatri.'
      },
      startMinutes: sayamStartMin,
      endMinutes: sayamEndMin,
      startTimeStr: minutesToTimeStringFormat(sayamStartMin),
      endTimeStr: minutesToTimeStringFormat(sayamEndMin),
      category: 'sandhya'
    },
    {
      id: 'shiva_pradosha_puja',
      name: {
        kn: 'ಪರಮ ಪಾವನ ಪ್ರದೋಷ ಕಾಲ (ಶಿವ ಪೂಜೆ & ಬಿಲ್ವಾರ್ಚನೆ)',
        hi: 'परम पावन प्रदोष काल (शिव पूजन एवं बिल्वार्चना)',
        en: 'Sacred Pradosha Kaal (Shiva Puja & Bilva Archana)'
      },
      subtitle: {
        kn: 'ಸೂರ್ಯಾಸ್ತದ ೪೫ ನಿಮಿಷಗಳ ಅಕ್ಕಪಕ್ಕ; ಸದಾಶಿವನ ನಂದಿ ನರ್ತನ ಕಾಲ',
        hi: 'सूर्यास्त के ४५ मिनट पूर्व-पश्चात्; सदाशिव की नन्दी नृत्य वेला',
        en: '45 mins around Sunset; sublime window for Lord Shiva’s grace'
      },
      deityFocus: 'shiva',
      shivaDeviMantra: 'ॐ नमः शिवाय । सर्वं श्री साम्बसदाशिवार्पणमस्तु ॥',
      recommendedRitual: {
        kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಜಲಾಭಿಷೇಕ/ಬಿಲ್ವಾರ್ಚನೆ ಮಾಡಿ, ರುದ್ರ ಗಾಯತ್ರೀ ಜಪಿಸಿ ಪ್ರದೋಷ ದೀಪ ಬೆಳಗಿಸಿ.',
        hi: 'शिवलिंग पर जलाभिषेक व बिल्वपत्र अर्पण करें, रुद्राक्ष माला से ॐ नमः शिवाय जपें।',
        en: 'Offer holy water and Bilva leaves to Shiva, lighting the sacred Pradosha lamp.'
      },
      startMinutes: pradoshaStartMin,
      endMinutes: pradoshaEndMin,
      startTimeStr: minutesToTimeStringFormat(pradoshaStartMin),
      endTimeStr: minutesToTimeStringFormat(pradoshaEndMin),
      category: 'puja'
    },
    {
      id: 'devi_sandhya_deepa',
      name: {
        kn: 'ದೇವೀ ದುರ್ಗಾ ಸಂಧ್ಯಾ & ಅಖಂಡ ದೀಪಾರಾಧನೆ',
        hi: 'देवी दुर्गा संध्या एवं अखण्ड दीपाराधना',
        en: 'Devi Durga Sandhya & Akhanda Deepa Aradhana'
      },
      subtitle: {
        kn: 'ಸಂಜೆ ದೀಪ ಬೆಳಗುವ ಪಾವನ ಕಾಲ; ಲಕ್ಷ್ಮೀ-ಪಾರ್ವತೀ ಆರಾಧನೆ',
        hi: 'संध्या दीप प्रज्वलन समय; लक्ष्मी-पार्वती आराधना',
        en: 'Sacred dusk hour for lighting home altars and invoking divine abundance'
      },
      deityFocus: 'devi',
      shivaDeviMantra: 'शुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
      recommendedRitual: {
        kn: 'ಪೂಜಾ ಮಂದಿರದಲ್ಲಿ ತುಪ್ಪ/ಎಣ್ಣೆ ದೀಪ ಬೆಳಗಿಸಿ, ಮಂಗಳಾರತಿ ಮಾಡಿ ಲಲಿತಾ ಸ್ತೋತ್ರ ಪಠಿಸಿ.',
        hi: 'पूजा मन्दिर में घृत दीप प्रज्वलित कर आरती करें व देवी स्तोत्र पाठ करें।',
        en: 'Light the sacred altar lamp, wave camphor Arati, and chant auspicious Devi stotrams.'
      },
      startMinutes: deviDeepaStartMin,
      endMinutes: deviDeepaEndMin,
      startTimeStr: minutesToTimeStringFormat(deviDeepaStartMin),
      endTimeStr: minutesToTimeStringFormat(deviDeepaEndMin),
      category: 'puja'
    },
    {
      id: 'abhijit_puja',
      name: {
        kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಕಲಶ & ಸಂಕಲ್ಪ ಸ್ಥಾಪನೆ)',
        hi: 'अभिजित मुहूर्त (कलश एवं संकल्प स्थापना)',
        en: 'Abhijit Muhurta (Kalasha & Primary Sankalpa)'
      },
      subtitle: {
        kn: 'ದಿನದ ಸರ್ವಶ್ರೇಷ್ಠ ವಿಜಯ ಕಾಲ; ಸಕಲ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶ್ರೇಷ್ಠ',
        hi: 'दिन का सर्वश्रेष्ठ विजय काल; समस्त शुभ कार्यों हेतु उत्तम',
        en: 'Supreme daytime victory window for solemnizing vows and installations'
      },
      deityFocus: 'shiva_devi',
      shivaDeviMantra: 'ॐ श्री साम्बसदाशिव दुर्गापरमेश्वर्यै नमः ।',
      recommendedRitual: {
        kn: 'ವೇದೋಕ್ತ ದೇಶ-ಕಾಲ ಸಂಕಲ್ಪ ಪಠಿಸಿ, ಕಲಶ ಸ್ಥಾಪನೆ ಹಾಗೂ ಪ್ರಧಾನ ಪೂಜೆ ಆರಂಭಿಸಿ.',
        hi: 'वेदोक्त देश-काल संकल्प पाठ करें, कलश स्थापना एवं प्रधान पूजा आरम्भ करें।',
        en: 'Chant personalized Vedic Desha-Kala Sankalpa and commence sacred rituals.'
      },
      startMinutes: abhijitStartMin,
      endMinutes: abhijitEndMin,
      startTimeStr: minutesToTimeStringFormat(abhijitStartMin),
      endTimeStr: minutesToTimeStringFormat(abhijitEndMin),
      category: 'muhurta'
    }
  ];
}

/**
 * Builds the localized daily notification message content
 */
export function buildDailyPanchangaNotificationData(
  selectedCity: CityLocation,
  currentLang: Language,
  customDate?: Date
): { title: string; body: string } {
  const date = customDate || new Date();
  const panchang: PanchangaDay = getPanchangaForDate(date, selectedCity);
  const cityName = getLocalizedPlaceName(selectedCity, currentLang);

  const tithiStr = `${panchang.pakshaName[currentLang]} ${panchang.tithiName[currentLang]}`;
  const nakshatraStr = `${panchang.nakshatra[currentLang]} (Pada ${panchang.pada})`;
  
  let festSnippet = '';
  if (panchang.festivals.length > 0) {
    const festNames = panchang.festivals.map(f => f.name[currentLang]).join(', ');
    festSnippet = currentLang === 'kn' ? `\n🎉 ಹಬ್ಬ: ${festNames}` : currentLang === 'hi' ? `\n🎉 पर्व: ${festNames}` : `\n🎉 Festival: ${festNames}`;
  }

  const sunriseLabel = currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ' : currentLang === 'hi' ? 'सूर्योदय' : 'Sunrise';
  const sunsetLabel = currentLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ' : currentLang === 'hi' ? 'सूर्यास्त' : 'Sunset';
  const abhijitLabel = currentLang === 'kn' ? 'ಅಭಿಜಿತ್' : currentLang === 'hi' ? 'अभिजित' : 'Abhijit';

  const title = `HCMM Vedic Panchanga • ${cityName}`;
  const body = `${tithiStr} • ${nakshatraStr}${festSnippet}\n🌅 ${sunriseLabel}: ${panchang.sunrise} | 🌇 ${sunsetLabel}: ${panchang.sunset}\n⚡ ${abhijitLabel}: ${panchang.abhijitMuhurta.start} - ${panchang.abhijitMuhurta.end}`;

  return { title, body };
}

/**
 * Fires daily overview notification once per day
 */
export function checkAndTriggerDailyNotification(
  selectedCity: CityLocation,
  currentLang: Language
): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  if (!isDailyNotificationEnabled()) return false;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE);

  if (lastDate === todayStr) {
    return false;
  }

  const { title, body } = buildDailyPanchangaNotificationData(selectedCity, currentLang);

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'hcmm-daily-panchanga'
    });

    notif.onclick = () => {
      window.focus();
    };

    localStorage.setItem(STORAGE_KEY_LAST_DATE, todayStr);
    return true;
  } catch (e) {
    console.error('Error firing daily notification:', e);
    return false;
  }
}

/**
 * Checks and fires pending auspicious Sandhyavandana & Puja alerts for the current minute.
 */
export function checkAndFirePendingAuspiciousAlerts(
  selectedCity: CityLocation,
  currentLang: Language
): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return false;
  
  const config = getSandhyaNotificationConfig();
  if (!config.enabled) return false;

  const now = new Date();
  const tz = selectedCity.timezone || 'Asia/Kolkata';

  // Format current local time in target city
  const cityParts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }).formatToParts(now);

  const y = cityParts.find(p => p.type === 'year')?.value || '';
  const m = cityParts.find(p => p.type === 'month')?.value || '';
  const d = cityParts.find(p => p.type === 'day')?.value || '';
  const h = parseInt(cityParts.find(p => p.type === 'hour')?.value || '0', 10);
  const min = parseInt(cityParts.find(p => p.type === 'minute')?.value || '0', 10);

  const cityDateKey = `${y}-${m}-${d}`;
  const currentCityMinutes = h * 60 + min;

  // Retrieve today's fired alerts list
  const firedStorageKey = `${STORAGE_KEY_SANDHYA_FIRED_PREFIX}${cityDateKey}`;
  let firedList: string[] = [];
  try {
    const saved = localStorage.getItem(firedStorageKey);
    if (saved) firedList = JSON.parse(saved);
  } catch (e) {
    firedList = [];
  }

  const windows = calculateAuspiciousWindowsForDay(now, selectedCity);
  let firedAny = false;

  for (const win of windows) {
    // Check if user has enabled this alert
    if (!config.activeAlertTypes.includes(win.id)) continue;

    // Advance reminder trigger time
    const triggerMin = win.startMinutes - config.advanceMinutes;
    const alertRecordKey = `${win.id}_${triggerMin}`;

    // Has it already fired today?
    if (firedList.includes(alertRecordKey)) continue;

    // Does current time match the trigger minute window (within 2 minutes tolerance)?
    const diff = currentCityMinutes - triggerMin;
    if (diff >= 0 && diff <= 2) {
      // Fire Notification!
      firedList.push(alertRecordKey);
      firedAny = true;

      const cityName = getLocalizedPlaceName(selectedCity, currentLang);
      const isAdvance = config.advanceMinutes > 0 && diff === 0;

      const advancePrefix = isAdvance
        ? (currentLang === 'kn' ? `⏳ ಇನ್ನಿಷ್ಟೇ ಕ್ಷಣದಲ್ಲಿ (${config.advanceMinutes} ನಿಮಿಷ): ` : currentLang === 'hi' ? `⏳ शीघ्र प्रारम्भ (${config.advanceMinutes} मिनट): ` : `⏳ Starts in ${config.advanceMinutes} mins: `)
        : (currentLang === 'kn' ? '🔴 ಆರಂಭವಾಗಿದೆ: ' : currentLang === 'hi' ? '🔴 प्रारम्भ हुआ: ' : '🔴 Active Now: ');

      const title = `${advancePrefix}${win.name[currentLang]} • ${cityName}`;
      const body = `${win.subtitle[currentLang]}\n⏰ ${win.startTimeStr} - ${win.endTimeStr}\n🔱 ${win.recommendedRitual[currentLang]}\n🕉️ ಮಂತ್ರ: ${win.shivaDeviMantra}`;

      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: `hcmm-sandhya-${win.id}-${cityDateKey}`
        });

        notif.onclick = () => {
          window.focus();
        };

        // Play authentic bronze temple bell chime
        if (config.soundChime) {
          playSacredTempleBell();
        }

        // Dispatch in-browser event so UI components can render an in-app banner/toast
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('hcmm_auspicious_alert', {
              detail: {
                window: win,
                cityName,
                isAdvance,
                advanceMinutes: config.advanceMinutes,
                timestamp: new Date().toISOString()
              }
            })
          );
        }
      } catch (err) {
        console.error('Error dispatching auspicious alert notification:', err);
      }
    }
  }

  if (firedAny) {
    try {
      localStorage.setItem(firedStorageKey, JSON.stringify(firedList));
    } catch (e) {
      // storage quota
    }
  }

  return firedAny;
}

/**
 * Initiates the recurring background notification ticker that runs every 30 seconds.
 * Returns a cleanup unsubscribe callback.
 */
export function initAuspiciousNotificationService(
  selectedCity: CityLocation,
  currentLang: Language
): () => void {
  // Fire daily overview if not fired today
  checkAndTriggerDailyNotification(selectedCity, currentLang);

  // Check immediately
  checkAndFirePendingAuspiciousAlerts(selectedCity, currentLang);

  // Recurring 30-second interval ticker
  const intervalId = setInterval(() => {
    checkAndFirePendingAuspiciousAlerts(selectedCity, currentLang);
  }, 30000);

  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Triggers an immediate test auspicious alert notification for user verification
 */
export async function triggerSandhyaNotificationTest(
  alertType: AuspiciousAlertType,
  selectedCity: CityLocation,
  currentLang: Language
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let perm = Notification.permission;
  if (perm !== 'granted') {
    perm = await Notification.requestPermission();
  }
  if (perm !== 'granted') return false;

  const windows = calculateAuspiciousWindowsForDay(new Date(), selectedCity);
  const targetWin = windows.find(w => w.id === alertType) || windows[0];
  const cityName = getLocalizedPlaceName(selectedCity, currentLang);

  const title = `🔔 [ಪರೀಕ್ಷೆ / Test] ${targetWin.name[currentLang]} • ${cityName}`;
  const body = `${targetWin.subtitle[currentLang]}\n⏰ ${targetWin.startTimeStr} - ${targetWin.endTimeStr}\n🔱 ${targetWin.recommendedRitual[currentLang]}\n🕉️ ಮಂತ್ರ: ${targetWin.shivaDeviMantra}`;

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: `hcmm-test-${alertType}-${Date.now()}`
    });

    notif.onclick = () => {
      window.focus();
    };

    playSacredTempleBell();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hcmm_auspicious_alert', {
          detail: {
            window: targetWin,
            cityName,
            isAdvance: false,
            advanceMinutes: 0,
            isTest: true,
            timestamp: new Date().toISOString()
          }
        })
      );
    }

    return true;
  } catch (e) {
    console.error('Error firing test sandhya alert:', e);
    return false;
  }
}

/**
 * Requests permission and fires today's daily notification immediately as a test / confirmation.
 */
export async function requestAndTriggerTestNotification(
  selectedCity: CityLocation,
  currentLang: Language
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let perm = Notification.permission;
  if (perm !== 'granted') {
    perm = await Notification.requestPermission();
  }

  if (perm !== 'granted') {
    return false;
  }

  setDailyNotificationEnabled(true);
  const { title, body } = buildDailyPanchangaNotificationData(selectedCity, currentLang);

  try {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'hcmm-daily-panchanga-test'
    });

    notif.onclick = () => {
      window.focus();
    };

    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(STORAGE_KEY_LAST_DATE, todayStr);
    return true;
  } catch (e) {
    console.error('Error firing notification:', e);
    return false;
  }
}
