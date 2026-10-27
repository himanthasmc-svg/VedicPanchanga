import { Language } from '../types';

export type LunarPhaseCode = 
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'third_quarter'
  | 'waning_crescent';

export interface LunarPhaseResult {
  dateStr: string;
  phaseCode: LunarPhaseCode;
  phaseName: string;
  phaseNameEn: string;
  phaseNameKn: string;
  phaseNameHi: string;
  symbol: string;
  illumination: number; // 0 to 100%
  lunarAgeDays: number; // 0 to 29.53 days
  cycleProgressPercent: number; // 0 to 100%
  isWaxing: boolean;
  paksha: 'Shukla' | 'Krishna';
  pakshaLabel: string;
  summary: string;
  spiritualSignificance: string;
  daysToNextFullMoon: number;
  daysToNextNewMoon: number;
  phaseIndex: number; // 0 to 7
}

/**
 * Astronomical constants for synodic lunar cycle calculation
 * Mean synodic month = 29.53058867 days (approx 29 days, 12 hours, 44 minutes)
 * Reference Epoch: Astronomical New Moon on Jan 6, 2000 at 18:14 UTC (JD 2451549.5)
 */
export const SYNODIC_MONTH = 29.53058867;
const KNOWN_NEW_MOON_EPOCH = new Date('2000-01-06T18:14:00Z').getTime();

export interface PhaseDefinition {
  code: LunarPhaseCode;
  nameEn: string;
  nameKn: string;
  nameHi: string;
  symbol: string;
  summaryEn: string;
  summaryKn: string;
  summaryHi: string;
  significanceEn: string;
  significanceKn: string;
  significanceHi: string;
}

export const LUNAR_PHASES: PhaseDefinition[] = [
  {
    code: 'new_moon',
    nameEn: 'New Moon',
    nameKn: 'ಅಮಾವಾಸ್ಯೆ (ನವಚಂದ್ರ)',
    nameHi: 'अमावस्या (नव चन्द्र)',
    symbol: '🌑',
    summaryEn: 'The Moon is positioned directly between Earth and Sun, with its illuminated face turned away.',
    summaryKn: 'ಚಂದ್ರನು ಸೂರ್ಯ ಮತ್ತು ಭೂಮಿಯ ನಡುವೆ ಇರುತ್ತಾನೆ; ಬೆಳಕಿನ ಮುಖವು ಗೋಚರಿಸುವುದಿಲ್ಲ.',
    summaryHi: 'चन्द्रमा सूर्य और पृथ्वी के बीच स्थित होता है; इसका प्रकाशित भाग अदृश्य रहता है।',
    significanceEn: 'A powerful sacred day for Pitru Tarpana, ancestral prayers, stillness, and deep inner meditation.',
    significanceKn: 'ಪಿತೃ ತರ್ಪಣ, ಪೂರ್ವಜರ ಸ್ಮರಣೆ, ಮೌನ ಮತ್ತು ಆಂತರಿಕ ಧ್ಯಾನಕ್ಕೆ ಅತ್ಯಂತ ಪವಿತ್ರವಾದ ದಿನ.',
    significanceHi: 'पितृ तर्पण, पूर्वज स्मृति, शान्ति और गम्भीर आन्तरिक ध्यान हेतु अति पावन काल।'
  },
  {
    code: 'waxing_crescent',
    nameEn: 'Waxing Crescent',
    nameKn: 'ಶುಕ್ಲ ಬಾಲಚಂದ್ರ',
    nameHi: 'शुक्ल बालचन्द्र',
    symbol: '🌒',
    summaryEn: 'A delicate silver sliver appears on the western horizon after sunset, growing brighter every night.',
    summaryKn: 'ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಪಶ್ಚಿಮ ದಿಗಂತದಲ್ಲಿ ಸಣ್ಣ ಹೊಂಬೆಳಕಿನ ಬಾಲಚಂದ್ರ ಮೂಡಿ ದಿನೇದಿನೆ ಬೆಳೆಯುತ್ತದೆ.',
    summaryHi: 'सूर्यास्त के उपरान्त पश्चिमी क्षितिज पर बाल चन्द्र प्रकट होकर नित्य प्रकाशमान होता है।',
    significanceEn: 'Auspicious time to plant seeds, begin creative endeavors, make new resolutions, and seek growth.',
    significanceKn: 'ಹೊಸ ಆರಂಭ, ಸತ್ಸಂಕಲ್ಪ, ವಿದ್ಯಾಭ್ಯಾಸ ಹಾಗೂ ಕ್ರಿಯಾಶೀಲ ಕಾರ್ಯಗಳಿಗೆ ಶುಭಪ್ರದ ಕಾಲ.',
    significanceHi: 'नवीन संकल्प, सृजनात्मक कार्य तथा ज्ञानार्जन आरम्भ करने हेतु शुभ समय।'
  },
  {
    code: 'first_quarter',
    nameEn: 'First Quarter (Half Moon)',
    nameKn: 'ಶುಕ್ಲ ಅರ್ಧಚಂದ್ರ (ಪ್ರಥಮ ಪಾದ)',
    nameHi: 'प्रथम पाद (शुक्ल अर्धचन्द्र)',
    symbol: '🌓',
    summaryEn: 'Exactly half of the visible lunar disc is illuminated as the Moon completes one-quarter of its orbit.',
    summaryKn: 'ಚಂದ್ರನ ಬಲಾರ್ಧವು ಪೂರ್ಣ ಪ್ರಕಾಶಮಾನವಾಗಿ ಕಾಣುತ್ತದೆ; ಚಂದ್ರ ಕಕ್ಷೆಯ ಕಾಲು ಭಾಗ ಪೂರ್ಣಗೊಂಡಿದೆ.',
    summaryHi: 'चन्द्रमा का आधा भाग प्रकाशित होता है; यह चांद्र चक्र का प्रथम चतुर्थांश है।',
    significanceEn: 'Moment of balance, decisive action, overcoming spiritual inertia, and determined progress.',
    significanceKn: 'ಸಂಕಲ್ಪ ಸಿದ್ಧಿ, ದೃಢ ನಿರ್ಧಾರ ಹಾಗೂ ಕಾರ್ಯಸಾಧನೆಗೆ ಪ್ರೇರಣಾದಾಯಕ ದಿನ.',
    significanceHi: 'दृढ़ संकल्प, निर्णय क्षमता तथा आध्यात्मिक प्रगति हेतु शुभ वेला।'
  },
  {
    code: 'waxing_gibbous',
    nameEn: 'Waxing Gibbous',
    nameKn: 'ಶುಕ್ಲ ಕುಬ್ಜ ಚಂದ್ರ (ಪೂರ್ಣಪ್ರಾಯ)',
    nameHi: 'शुक्ल कुब्ज चन्द्र',
    symbol: '🌔',
    summaryEn: 'Over 50% illuminated and swelling towards the radiant majesty of the Full Moon.',
    summaryKn: 'ಅರ್ಧಕ್ಕಿಂತ ಹೆಚ್ಚು ಬೆಳಕಿನಿಂದ ಕೂಡಿದ್ದು, ಪೌರ್ಣಮಿಯ ಸಂಪೂರ್ಣ ಪ್ರಕಾಶದತ್ತ ವೃದ್ಧಿಸುತ್ತಿದೆ.',
    summaryHi: 'आधे से अधिक प्रकाशित होकर पूर्णमासी के दिव्य प्रकाश की ओर बढ़ रहा है।',
    significanceEn: 'High spiritual receptivity, expanding energy, ideal for devotional chanting, pujas, and mantra sadhana.',
    significanceKn: 'ಅಭಿವೃದ್ಧಿ ಮತ್ತು ಸಮೃದ್ಧಿಯ ಶಕ್ತಿ; ದೇವತಾರಾಧನೆ, ಜಪ-ತಪ ಮತ್ತು ಹೋಮ-ಹವನಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.',
    significanceHi: 'आध्यात्मिक ऊर्जा की वृद्धि; मंत्र जप, भगवदाराधना एवं पूजा हेतु अति उत्तम।'
  },
  {
    code: 'full_moon',
    nameEn: 'Full Moon (Purnima)',
    nameKn: 'ಹುಣ್ಣಿಮೆ (ಪೌರ್ಣಮೀ / ಪೂರ್ಣಚಂದ್ರ)',
    nameHi: 'पूर्णिमा (पूर्ण चन्द्र)',
    symbol: '🌕',
    summaryEn: 'The Moon stands in total opposition to the Sun, fully illuminated in celestial radiance.',
    summaryKn: 'ಚಂದ್ರನು ಸೂರ್ಯನಿಗೆ ನೇರ ವಿರುದ್ಧವಾಗಿ ಸಂಪೂರ್ಣ ಅಮೃತಮಯ ಬೆಳಕಿನಲ್ಲಿ ಕಂಗೊಳಿಸುತ್ತಾನೆ.',
    summaryHi: 'चन्द्रमा पूर्ण रूप से प्रकाशित होकर अमृतमयी चांदनी बरसाता है।',
    significanceEn: 'Peak spiritual energy, ideal for Satyanarayana Vrata, Mahalakshmi worship, fasting, and charity.',
    significanceKn: 'ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ವ್ರತ, ಮಹಾಲಕ್ಷ್ಮಿ ಪೂಜೆ, ದಾನ-ಧರ್ಮ ಹಾಗೂ ಜಾಗರಣೆಗೆ ಪರಮ ಪವಿತ್ರ ದಿನ.',
    significanceHi: 'सत्यनारायण व्रत, महालक्ष्मी आराधना, दीपदान एवं दान-पुण्य हेतु परम पावन दिन।'
  },
  {
    code: 'waning_gibbous',
    nameEn: 'Waning Gibbous',
    nameKn: 'ಕೃಷ್ಣ ಕುಬ್ಜ ಚಂದ್ರ (ಹ್ರಾಸ ಕುಬ್ಜ)',
    nameHi: 'कृष्ण कुब्ज चन्द्र',
    symbol: '🌖',
    summaryEn: 'The illuminated face begins gently decreasing as the Moon embarks on its journey towards darkness.',
    summaryKn: 'ಹುಣ್ಣಿಮೆಯ ನಂತರ ಚಂದ್ರನ ಬೆಳಕು ಕ್ರಮೇಣ ಕ್ಷೀಣಿಸಲು ಆರಂಭಿಸುತ್ತದೆ.',
    summaryHi: 'पूर्णिमा के उपरान्त चन्द्रमा की कांति धीरे-धीरे क्षीण होने लगती है।',
    significanceEn: 'A time of gratitude, sharing divine knowledge, releasing negative thoughts, and humble reflection.',
    significanceKn: 'ಕೃತಜ್ಞತೆ, ಜ್ಞಾನದ ಹಂಚಿಕೆ, ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳ ವಿಸರ್ಜನೆ ಹಾಗೂ ಶಾಂತ ಚಿಂತನೆಗೆ ಸೂಕ್ತ.',
    significanceHi: 'कृतज्ञता ज्ञापन, ज्ञान दान एवं नकारात्मक भावों के शमन का उत्तम समय।'
  },
  {
    code: 'third_quarter',
    nameEn: 'Third Quarter (Last Quarter)',
    nameKn: 'ಕೃಷ್ಣ ಅರ್ಧಚಂದ್ರ (ತೃತೀಯ ಪಾದ)',
    nameHi: 'तृतीय पाद (कृष्ण अर्धचन्द्र)',
    symbol: '🌗',
    summaryEn: 'The opposite half of the Moon is illuminated, shining in the midnight and morning sky.',
    summaryKn: 'ಚಂದ್ರನ ಎಡಾರ್ಧವು ಪ್ರಕಾಶಮಾನವಾಗಿ ಕಾಣುತ್ತದೆ; ರಾತ್ರಿಯ ಉತ್ತರಾರ್ಧದಲ್ಲಿ ಮೂಡುತ್ತದೆ.',
    summaryHi: 'चन्द्रमा का दूसरा आधा भाग प्रकाशित होता है, जो अर्धरात्रि के बाद उदित होता है।',
    significanceEn: 'Letting go of burdens, forgiveness, spiritual cleansing, and disciplined self-control.',
    significanceKn: 'ಕ್ಷಮೆ, ಮನಸ್ಸಿನ ಶುದ್ಧೀಕರಣ, ಹಳೆಯ ಕ್ಲೇಶಗಳ ನಿವಾರಣೆ ಹಾಗೂ ಸಂಯಮದ ಸಾಧನೆಗೆ ಪ್ರಶಸ್ತ.',
    significanceHi: 'क्षमाशीलता, आत्म-शुद्धि तथा आंतरिक संयम की साधना हेतु अनुकूल समय।'
  },
  {
    code: 'waning_crescent',
    nameEn: 'Waning Crescent',
    nameKn: 'ಕೃಷ್ಣ ಕ್ಷೀಣಚಂದ್ರ',
    nameHi: 'कृष्ण क्षीण चन्द्र',
    symbol: '🌘',
    summaryEn: 'A slender sliver rising shortly before dawn, signaling the approach of the sacred New Moon.',
    summaryKn: 'ಬೆಳಗಿನ ಜಾವ ಸೂರ್ಯೋದಯಕ್ಕೂ ಮುನ್ನ ಪೂರ್ವ ದಿಗಂತದಲ್ಲಿ ಸೂಕ್ಷ್ಮವಾಗಿ ಗೋಚರಿಸುವ ಕ್ಷೀಣ ಚಂದ್ರ.',
    summaryHi: 'सूर्योदय से पूर्व प्रात:काल पूर्वी क्षितिज पर दृश्यमान सूक्ष्म चन्द्र रेखा।',
    significanceEn: 'Rest, deep spiritual recharge, surrender to the Divine, and preparation for new beginnings.',
    significanceKn: 'ವಿಶ್ರಾಂತಿ, ಈಶ್ವರಾರ್ಪಣ ಭಾವ, ಶರಣಾಗತಿ ಹಾಗೂ ಮುಂಬರುವ ನವ ಮಾಸದ ಸಿದ್ಧತೆಗೆ ಪವಿತ್ರ ಕಾಲ.',
    significanceHi: 'ईश्वर समर्पण, आध्यात्मिक शांति तथा नवीन मास के स्वागत की पावन वेला।'
  }
];

/**
 * Helper function to calculate exact daily moon phase from date based on lunar cycle
 * @param date Target date as Date object or YYYY-MM-DD string
 * @param lang Language preference (en | kn | hi)
 */
export function calculateMoonPhaseFromDate(date: Date | string, lang: Language = 'en'): LunarPhaseResult {
  let targetDate: Date;
  if (typeof date === 'string') {
    // If string like "YYYY-MM-DD", anchor at noon UTC to prevent local timezone shifts
    const parts = date.split('-').map(Number);
    if (parts.length === 3) {
      targetDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
    } else {
      targetDate = new Date(date);
    }
  } else {
    targetDate = new Date(date);
  }

  const dateStr = targetDate.toISOString().split('T')[0];
  const targetTime = targetDate.getTime();

  // Elapsed days since reference New Moon
  const elapsedDays = (targetTime - KNOWN_NEW_MOON_EPOCH) / (1000 * 60 * 60 * 24);

  // Exact lunar age in days (0.00 to 29.53)
  const lunarAgeDays = ((elapsedDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // Normalized phase progress from 0.0 to 1.0 (0 = New Moon, 0.5 = Full Moon, 1.0 = Next New Moon)
  const phaseProgress = lunarAgeDays / SYNODIC_MONTH;
  const cycleProgressPercent = Math.round(phaseProgress * 100);

  // Optical illumination percentage: 0% at New Moon, 100% at Full Moon
  // Using standard astronomical formula: (1 - cos(angle)) / 2
  const illuminationFraction = (1 - Math.cos(phaseProgress * 2 * Math.PI)) / 2;
  const illumination = Math.round(illuminationFraction * 100);

  // Waxing vs Waning
  const isWaxing = phaseProgress < 0.5;
  const paksha: 'Shukla' | 'Krishna' = isWaxing ? 'Shukla' : 'Krishna';

  // 8 Phase segments (each is approx 3.69 days or 45 degrees)
  // Segment centers: 0: New Moon, 1: Waxing Crescent, 2: First Quarter, 3: Waxing Gibbous,
  // 4: Full Moon, 5: Waning Gibbous, 6: Third Quarter, 7: Waning Crescent
  // Boundary width = 29.53058867 / 8 = 3.6913 days
  // Shift by half segment so New Moon is centered at age 0 / 29.53
  const segmentWidth = SYNODIC_MONTH / 8; // ~3.691 days
  const shiftedAge = (lunarAgeDays + segmentWidth / 2) % SYNODIC_MONTH;
  const phaseIndex = Math.floor(shiftedAge / segmentWidth) % 8;

  const phaseDef = LUNAR_PHASES[phaseIndex];

  // Days until next milestones
  const fullMoonAge = SYNODIC_MONTH / 2; // ~14.765 days
  let daysToNextFullMoon: number;
  if (lunarAgeDays <= fullMoonAge) {
    daysToNextFullMoon = fullMoonAge - lunarAgeDays;
  } else {
    daysToNextFullMoon = (SYNODIC_MONTH - lunarAgeDays) + fullMoonAge;
  }

  const daysToNextNewMoon = SYNODIC_MONTH - lunarAgeDays;

  // Localized texts
  const phaseName = lang === 'kn' ? phaseDef.nameKn : lang === 'hi' ? phaseDef.nameHi : phaseDef.nameEn;
  const summary = lang === 'kn' ? phaseDef.summaryKn : lang === 'hi' ? phaseDef.summaryHi : phaseDef.summaryEn;
  const spiritualSignificance = lang === 'kn' ? phaseDef.significanceKn : lang === 'hi' ? phaseDef.significanceHi : phaseDef.significanceEn;

  const pakshaLabel = isWaxing
    ? (lang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ (ವೃದ್ಧಿ ಚಂದ್ರ / ಬೆಳದಿಂಗಳು)' : lang === 'hi' ? 'शुक्ल पक्ष (वर्धमान)' : 'Shukla Paksha (Waxing / Growing)')
    : (lang === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕ್ಷೀಣ ಚಂದ್ರ / ಕತ್ತಲು)' : lang === 'hi' ? 'कृष्ण पक्ष (क्षीयमान)' : 'Krishna Paksha (Waning / Shrinking)');

  return {
    dateStr,
    phaseCode: phaseDef.code,
    phaseName,
    phaseNameEn: phaseDef.nameEn,
    phaseNameKn: phaseDef.nameKn,
    phaseNameHi: phaseDef.nameHi,
    symbol: phaseDef.symbol,
    illumination,
    lunarAgeDays: Math.round(lunarAgeDays * 10) / 10,
    cycleProgressPercent,
    isWaxing,
    paksha,
    pakshaLabel,
    summary,
    spiritualSignificance,
    daysToNextFullMoon: Math.round(daysToNextFullMoon * 10) / 10,
    daysToNextNewMoon: Math.round(daysToNextNewMoon * 10) / 10,
    phaseIndex
  };
}
