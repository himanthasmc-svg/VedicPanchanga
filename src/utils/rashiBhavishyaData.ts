import { CityLocation, KundaliData, Language, LocalizedString, PanchangaDay, PlanetPosition } from '../types';
import { calculateKundali, getPanchangaForDate, RASHIS, RASHI_NAKSHATRA_CHART } from './panchanga';

export interface RashiGocharPlanetDetail {
  planetName: string;
  sanskritName: LocalizedString;
  symbol: string;
  color: string;
  rashiIndex: number;
  rashiName: LocalizedString;
  degrees: number;
  nakshatra: LocalizedString;
  pada: number;
  isRetrograde: boolean;
  transitBhava: number; // 1 to 12 from this Rashi
  isBeneficGochar: boolean;
  effectSummary: LocalizedString;
}

export interface SingleRashiDailyForecast {
  rashiIndex: number;
  rashiName: LocalizedString;
  symbolGlyph: string;
  rashiLord: LocalizedString;
  element: LocalizedString; // Fire, Earth, Air, Water
  compatibilityFriend: LocalizedString;
  
  // Overall Day Score & Auspicious Tier
  scorePercent: number; // 0 to 100
  ratingTier: 'supreme' | 'favorable' | 'moderate' | 'caution';
  ratingTierText: LocalizedString;
  badgeColor: string;
  bgGradient: string;

  // Astrological Alerts (e.g., Chandrashtama, Sade Sati, Kantaka Shani, Guru Bala)
  specialAstrologicalAlert?: {
    type: 'chandrashtama' | 'sade_sati' | 'ashtama_shani' | 'guru_bala' | 'raja_yoga';
    title: LocalizedString;
    description: LocalizedString;
    severity: 'warning' | 'alert' | 'positive' | 'supreme';
  };

  // Detailed Domain Forecasts
  careerForecast: LocalizedString;
  financeForecast: LocalizedString;
  healthForecast: LocalizedString;
  familyForecast: LocalizedString;

  // Auspicious Day Parameters
  luckyNumber: number;
  luckyColor: LocalizedString;
  luckyDirection: LocalizedString;
  favorableTime: LocalizedString;
  cautionTime: LocalizedString;

  // Daily Astrological Remedy & Mantra
  dailyRemedy: {
    deity: LocalizedString;
    mantra: LocalizedString;
    charityAction: LocalizedString;
    mindsetTip: LocalizedString;
  };

  // Real-time Planetary Positions & Gochar Transits relative to this Rashi
  planetaryTransits: RashiGocharPlanetDetail[];
}

export interface DayRashiBhavishyaReport {
  dateStr: string;
  dateFormatted: string;
  city: CityLocation;
  panchanga: PanchangaDay;
  kundali: KundaliData;
  moonRashiIndex: number;
  moonRashiName: LocalizedString;
  sunRashiIndex: number;
  sunRashiName: LocalizedString;
  predictions: SingleRashiDailyForecast[];
}

// Classical Benefic Gochar Houses from Janma Rashi (Moon Sign):
// Sun: 3, 6, 10, 11
// Moon: 1, 3, 6, 7, 10, 11
// Mars: 3, 6, 11
// Mercury: 2, 4, 6, 8, 10, 11
// Jupiter: 2, 5, 7, 9, 11
// Venus: 1, 2, 3, 4, 5, 8, 9, 11, 12
// Saturn: 3, 6, 11
// Rahu: 3, 6, 11
// Ketu: 3, 9, 11

const FAVORABLE_GOCHAR_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 11],
  Ketu: [3, 9, 11]
};

// Rashi Elements
const RASHI_ELEMENTS: LocalizedString[] = [
  { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' }, // Mesha
  { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' }, // Vrishabha
  { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' }, // Mithuna
  { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' }, // Karka
  { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' }, // Simha
  { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' }, // Kanya
  { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' }, // Tula
  { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' }, // Vrischika
  { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' }, // Dhanu
  { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' }, // Makara
  { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' }, // Kumbha
  { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' } // Meena
];

// Rashi Glyphs
const RASHI_GLYPHS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];

// Lucky Colors & Numbers mapping
const RASHI_LUCKY_ATTRIBUTES: {
  number: number;
  color: LocalizedString;
  direction: LocalizedString;
}[] = [
  { number: 9, color: { en: 'Crimson Red & Coral', kn: 'ಕೆಂಪು ಮತ್ತು ಹವಳದ ಬಣ್ಣ', hi: 'लाल एवं मूंगा वर्ण' }, direction: { en: 'East', kn: 'ಪೂರ್ವ', hi: 'पूर्व' } },
  { number: 6, color: { en: 'Pure White & Cream', kn: 'ಬಿಳಿ ಮತ್ತು ಕೆನೆ ಬಣ್ಣ', hi: 'श्वेत एवं क्रीमी' }, direction: { en: 'South-East', kn: 'ಆಗ್ನೇಯ', hi: 'दक्षिण-पूर्व' } },
  { number: 5, color: { en: 'Emerald Green', kn: 'ಹಸಿರು ಮತ್ತು ಗಿಳಿ ಹಸಿರು', hi: 'हरा एवं धानी' }, direction: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' } },
  { number: 2, color: { en: 'Pearl White & Silver', kn: 'ಮುತ್ತಿನ ಬಿಳಿ ಮತ್ತು ಬೆಳ್ಳಿ ಬಣ್ಣ', hi: 'मोती श्वेत एवं रजत' }, direction: { en: 'North-West', kn: 'ವಾಯುವ್ಯ', hi: 'उत्तर-पश्चिम' } },
  { number: 1, color: { en: 'Royal Gold & Orange', kn: 'ಕೇಸರಿ, ಚಿನ್ನದ ಹಳದಿ', hi: 'केसरिया एवं स्वर्णिम' }, direction: { en: 'East', kn: 'ಪೂರ್ವ', hi: 'पूर्व' } },
  { number: 5, color: { en: 'Parrot Green & Navy', kn: 'ಪಚ್ಚೆ ಹಸಿರು ಮತ್ತು ನೀಲಿ', hi: 'हरा एवं गहरा नीला' }, direction: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' } },
  { number: 6, color: { en: 'Pastel Blue & White', kn: 'ತಿಳಿ ನೀಲಿ, ರೇಷ್ಮೆ ಬಿಳಿ', hi: 'हल्का नीला व श्वेत' }, direction: { en: 'West', kn: 'ಪಶ್ಚಿಮ', hi: 'पश्चिम' } },
  { number: 9, color: { en: 'Dark Red & Ochre', kn: 'ಗಾಢ ಕೆಂಪು, ಮಣ್ಣಿನ ಬಣ್ಣ', hi: 'गहरा लाल एवं गेरुआ' }, direction: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' } },
  { number: 3, color: { en: 'Golden Yellow', kn: 'ಪೀತಾಂಬರ ಹಳದಿ, ಕೇಸರಿ', hi: 'पीला एवं केसरिया' }, direction: { en: 'North-East (Ishanya)', kn: 'ಈಶಾನ್ಯ', hi: 'ईशान' } },
  { number: 8, color: { en: 'Royal Blue & Black', kn: 'ಗಾಢ ನೀಲಿ, ಕಪ್ಪು ಮಿಶ್ರಿತ', hi: 'गहरा नीला व श्याम' }, direction: { en: 'West', kn: 'ಪಶ್ಚಿಮ', hi: 'पश्चिम' } },
  { number: 8, color: { en: 'Electric Blue & Violet', kn: 'ಆಕಾಶ ನೀಲಿ ಮತ್ತು ನೇರಳೆ', hi: 'नीला एवं जामुनी' }, direction: { en: 'West', kn: 'ಪಶ್ಚಿಮ', hi: 'पश्चिम' } },
  { number: 3, color: { en: 'Yellow & Saffron', kn: 'ಹಳದಿ ಮತ್ತು ಕೇಸರಿ', hi: 'पीला एवं सुनहरी' }, direction: { en: 'North-East (Ishanya)', kn: 'ಈಶಾನ್ಯ', hi: 'ईशान' } }
];

export function calculateDailyRashiBhavishya(
  date: Date,
  city: CityLocation
): DayRashiBhavishyaReport {
  const parts = date.toISOString().split('T')[0].split('-');
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  const dateObj = new Date(y, m - 1, d, 12, 0, 0);

  const panchanga = getPanchangaForDate(dateObj, city);
  const kundali = calculateKundali(dateObj.toISOString(), city);

  const moonPlanet = kundali.planets.find(p => p.name === 'Moon') || kundali.planets[1];
  const sunPlanet = kundali.planets.find(p => p.name === 'Sun') || kundali.planets[0];
  const jupPlanet = kundali.planets.find(p => p.name === 'Jupiter');
  const satPlanet = kundali.planets.find(p => p.name === 'Saturn');

  const moonRashiIdx = moonPlanet.rashiIndex;
  const sunRashiIdx = sunPlanet.rashiIndex;
  const jupRashiIdx = jupPlanet ? jupPlanet.rashiIndex : 1;
  const satRashiIdx = satPlanet ? satPlanet.rashiIndex : 10;

  // Process all 12 Rashis
  const predictions: SingleRashiDailyForecast[] = RASHIS.map((rashiMeta, rashiIdx) => {
    // 1. Calculate transit house for all planets from this Rashi
    const transits: RashiGocharPlanetDetail[] = kundali.planets.map(planet => {
      const transitBhava = ((planet.rashiIndex - rashiIdx + 12) % 12) + 1;
      const favorableHouses = FAVORABLE_GOCHAR_HOUSES[planet.name] || [3, 6, 11];
      const isBeneficGochar = favorableHouses.includes(transitBhava);

      const effectSummary = getPlanetGocharEffect(planet.name, transitBhava, isBeneficGochar);

      return {
        planetName: planet.name,
        sanskritName: planet.sanskritName,
        symbol: planet.symbol,
        color: planet.color || '#f59e0b',
        rashiIndex: planet.rashiIndex,
        rashiName: planet.rashiName,
        degrees: planet.degrees,
        nakshatra: planet.nakshatra,
        pada: planet.pada,
        isRetrograde: planet.isRetrograde,
        transitBhava,
        isBeneficGochar,
        effectSummary
      };
    });

    // 2. Specific key transit placements for this Rashi
    const moonTransitBhava = ((moonRashiIdx - rashiIdx + 12) % 12) + 1;
    const sunTransitBhava = ((sunRashiIdx - rashiIdx + 12) % 12) + 1;
    const jupTransitBhava = ((jupRashiIdx - rashiIdx + 12) % 12) + 1;
    const satTransitBhava = ((satRashiIdx - rashiIdx + 12) % 12) + 1;

    // 3. Score calculation based on classical Gochar
    let baseScore = 65; // base moderate

    // Moon transit impact (Moon is mind & daily luck)
    if ([1, 3, 6, 7, 10, 11].includes(moonTransitBhava)) baseScore += 16;
    if (moonTransitBhava === 8) baseScore -= 28; // Chandrashtama is severe
    if ([4, 12].includes(moonTransitBhava)) baseScore -= 12;

    // Jupiter transit impact (Guru Bala)
    if ([2, 5, 7, 9, 11].includes(jupTransitBhava)) baseScore += 15;
    else baseScore -= 5;

    // Sun transit impact
    if ([3, 6, 10, 11].includes(sunTransitBhava)) baseScore += 10;
    else baseScore -= 4;

    // Saturn transit impact
    if ([3, 6, 11].includes(satTransitBhava)) baseScore += 10;
    else if ([12, 1, 2].includes(satTransitBhava)) baseScore -= 8; // Sade Sati
    else if (satTransitBhava === 8) baseScore -= 10; // Ashtama Shani

    // Normalize score to 30 - 98%
    const scorePercent = Math.min(98, Math.max(30, Math.round(baseScore)));

    // Rating tier
    let ratingTier: 'supreme' | 'favorable' | 'moderate' | 'caution' = 'moderate';
    let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    let bgGradient = 'from-amber-500/10 via-amber-600/5 to-transparent';
    let ratingTierText: LocalizedString = {
      kn: 'ಮಧ್ಯಮ / ಮಿಶ್ರ ಫಲ (Moderate)',
      hi: 'मध्यम / मिश्र फल',
      en: 'Balanced / Moderate'
    };

    if (scorePercent >= 84) {
      ratingTier = 'supreme';
      badgeColor = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400';
      bgGradient = 'from-emerald-500/15 via-emerald-600/5 to-transparent';
      ratingTierText = {
        kn: 'ಅತ್ಯುತ್ತಮ ಶುಭ ದಿನ (Golden Day)',
        hi: 'अत्युत्तम शुभ दिन',
        en: 'Highly Auspicious & Auspicious'
      };
    } else if (scorePercent >= 68) {
      ratingTier = 'favorable';
      badgeColor = 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-400';
      bgGradient = 'from-blue-500/15 via-blue-600/5 to-transparent';
      ratingTierText = {
        kn: 'ಉತ್ತಮ ಫಲ (Favorable)',
        hi: 'अनुकूल एवं शुभ फल',
        en: 'Favorable & Productive'
      };
    } else if (scorePercent < 52 || moonTransitBhava === 8) {
      ratingTier = 'caution';
      badgeColor = 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-400';
      bgGradient = 'from-rose-500/15 via-rose-600/5 to-transparent';
      ratingTierText = {
        kn: 'ಎಚ್ಚರಿಕೆ & ಶಾಂತಿ ಅಪೇಕ್ಷಿತ (Caution Needed)',
        hi: 'सावधानी एवं धैर्य आवश्यक',
        en: 'Caution & Restraint Advised'
      };
    }

    // Special Alert Detection
    let specialAstrologicalAlert: SingleRashiDailyForecast['specialAstrologicalAlert'] = undefined;
    if (moonTransitBhava === 8) {
      specialAstrologicalAlert = {
        type: 'chandrashtama',
        title: {
          kn: '⚠️ ಚಂದ್ರಾಷ್ಟಮ ಪ್ರಭಾವ (Chandrashtama Today)',
          hi: '⚠️ चन्द्राष्टम प्रभाव (सावधानी रखें)',
          en: '⚠️ Chandrashtama Alert (Moon in 8th House)'
        },
        description: {
          kn: 'ಇಂದು ಚಂದ್ರನು ನಿಮ್ಮ ರಾಶಿಯಿಂದ ೮ನೇ ಭಾವದಲ್ಲಿದ್ದಾನೆ. ಮಹತ್ವದ ನಿರ್ಧಾರಗಳು, ಹೊಸ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಸಾಲ ಕೊಡುವುದನ್ನು ಮುಂದೂಡಿ. ಶಾಂತರಾಗಿರಿ ಮತ್ತು ಶಿವ ನಮಸ್ಕಾರ ಮಾಡಿ.',
          hi: 'आज चन्द्रमा आपकी राशि से अष्टम भाव में गोचर कर रहा है। महत्वपूर्ण निर्णय टालें और मानसिक शांति हेतु शिव आराधना करें।',
          en: 'Moon transits the vulnerable 8th house today. Postpone major financial investments or contentious debates; practice meditation and invoke Lord Shiva.'
        },
        severity: 'warning'
      };
    } else if ([2, 5, 7, 9, 11].includes(jupTransitBhava)) {
      specialAstrologicalAlert = {
        type: 'guru_bala',
        title: {
          kn: '✨ ಶುಭ ಗುರು ಬಲ ಪ್ರಾಪ್ತಿ (Auspicious Guru Bala)',
          hi: '✨ शुभ गुरु बल की अनुकूलता',
          en: '✨ Auspicious Jupiter Blessing (Guru Bala)'
        },
        description: {
          kn: 'ಗುರುವು ನಿಮ್ಮ ರಾಶಿಗೆ ಅತ್ಯಂತ ಶುಭ ಭಾವದಲ್ಲಿದ್ದು, ದೈವಾನುಗ್ರಹ, ಹಿರಿಯರ ಪ್ರೋತ್ಸಾಹ, ವಿದ್ಯಾಭ್ಯಾಸ ಹಾಗೂ ಹಣಕಾಸಿನ ಯಶಸ್ಸನ್ನು ವೃದ್ಧಿಸುತ್ತಾನೆ.',
          hi: 'देवगुरु बृहस्पति की कृपा से कार्यों में सफलता, मान-सम्मान एवं भाग्य वृद्धि के शुभ योग हैं।',
          en: 'Jupiter casts expansive protective light on your sign. Superb period for investments, exams, mentorship, and spiritual ceremonies.'
        },
        severity: 'supreme'
      };
    } else if ([12, 1, 2].includes(satTransitBhava)) {
      specialAstrologicalAlert = {
        type: 'sade_sati',
        title: {
          kn: '⚖️ ಸಾಡೇಸಾತಿ ಶನಿ ಪ್ರಭಾವ (Saturn Sade Sati)',
          hi: '⚖️ साढ़ेसाती शनि प्रभाव',
          en: '⚖️ Saturn Transit (Sade Sati Phase)'
        },
        description: {
          kn: 'ಶಿಸ್ತು, ಪ್ರಾಮಾಣಿಕ ಪರಿಶ್ರಮ ಮತ್ತು ಸಂಯಮಕ್ಕೆ ಶನಿ ದೇವನು ಶ್ರೇಷ್ಠ ಫಲ ನೀಡುತ್ತಾನೆ. ಆತುರ ಬೇಡ.',
          hi: 'धैर्य और अनुशासन से कार्य करें, शनि देव परिश्रम का उत्तम फल प्रदान करेंगे।',
          en: 'Saturn demands consistent ethical work and patience. Sincere efforts yield steady foundational success.'
        },
        severity: 'alert'
      };
    }

    // Domain predictions
    const { career, finance, health, family } = generateDomainPredictions(
      rashiMeta.en,
      moonTransitBhava,
      sunTransitBhava,
      jupTransitBhava,
      satTransitBhava
    );

    // Remedies
    const remedy = generateRashiRemedy(rashiIdx);

    const attrs = RASHI_LUCKY_ATTRIBUTES[rashiIdx];

    return {
      rashiIndex: rashiIdx,
      rashiName: { en: rashiMeta.en, kn: rashiMeta.kn, hi: rashiMeta.hi },
      symbolGlyph: RASHI_GLYPHS[rashiIdx],
      rashiLord: { en: rashiMeta.lordEn, kn: rashiMeta.lordKn, hi: rashiMeta.lordHi },
      element: RASHI_ELEMENTS[rashiIdx],
      compatibilityFriend: {
        en: `${RASHIS[(rashiIdx + 4) % 12].en} & ${RASHIS[(rashiIdx + 8) % 12].en}`,
        kn: `${RASHIS[(rashiIdx + 4) % 12].kn} ಮತ್ತು ${RASHIS[(rashiIdx + 8) % 12].kn}`,
        hi: `${RASHIS[(rashiIdx + 4) % 12].hi} एवं ${RASHIS[(rashiIdx + 8) % 12].hi}`
      },
      scorePercent,
      ratingTier,
      ratingTierText,
      badgeColor,
      bgGradient,
      specialAstrologicalAlert,
      careerForecast: career,
      financeForecast: finance,
      healthForecast: health,
      familyForecast: family,
      luckyNumber: attrs.number,
      luckyColor: attrs.color,
      luckyDirection: attrs.direction,
      favorableTime: {
        en: '10:15 AM - 11:45 AM (Amrita/Abhijit Window)',
        kn: 'ಬೆಳಿಗ್ಗೆ ೧೦:೧೫ ರಿಂದ ೧೧:೪೫ (ಅಮೃತ/ಅಭಿಜಿತ್ ಕಾಲ)',
        hi: 'प्रातः १०:१५ से ११:४५ (अमृत/अभिजित मुहूर्त)'
      },
      cautionTime: {
        en: `${panchanga.rahuKaal.start} - ${panchanga.rahuKaal.end} (Rahu Kaal)`,
        kn: `${panchanga.rahuKaal.start} ರಿಂದ ${panchanga.rahuKaal.end} (ರಾಹು ಕಾಲ)`,
        hi: `${panchanga.rahuKaal.start} से ${panchanga.rahuKaal.end} (राहु काल)`
      },
      dailyRemedy: remedy,
      planetaryTransits: transits
    };
  });

  return {
    dateStr: date.toISOString().split('T')[0],
    dateFormatted: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    city,
    panchanga,
    kundali,
    moonRashiIndex: moonRashiIdx,
    moonRashiName: RASHIS[moonRashiIdx] ? { en: RASHIS[moonRashiIdx].en, kn: RASHIS[moonRashiIdx].kn, hi: RASHIS[moonRashiIdx].hi } : { en: 'Aries', kn: 'ಮೇಷ', hi: 'मेष' },
    sunRashiIndex: sunRashiIdx,
    sunRashiName: RASHIS[sunRashiIdx] ? { en: RASHIS[sunRashiIdx].en, kn: RASHIS[sunRashiIdx].kn, hi: RASHIS[sunRashiIdx].hi } : { en: 'Aries', kn: 'ಮೇಷ', hi: 'मेष' },
    predictions
  };
}

// Classical Gochar effect summaries for each planet and house
function getPlanetGocharEffect(planetName: string, house: number, isBenefic: boolean): LocalizedString {
  if (planetName === 'Moon') {
    switch (house) {
      case 1:
        return {
          kn: '೧ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಶಾರೀರಿಕ ಉಲ್ಲಾಸ, ಉತ್ತಮ ಭೋಜನ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ.',
          hi: '१म भाव में चन्द्र: शारीरिक स्फूर्ति, उत्तम भोजन, मानसिक शान्ति।',
          en: 'Moon in 1st: Physical vitality, savory meals, mental delight.'
        };
      case 2:
        return {
          kn: '೨ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಖರ್ಚುಗಳ ಮೇಲೆ ನಿಗಾ ಇರಿಸಿ, ಕುಟುಂಬದಲ್ಲಿ ಮೃದು ಮಾತು ಅಗತ್ಯ.',
          hi: '२य भाव में चन्द्र: व्यय पर नियंत्रण रखें, पारिवारिक सौहार्द बनाए रखें।',
          en: 'Moon in 2nd: Guard expenditures, speak gently with family.'
        };
      case 3:
        return {
          kn: '೩ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಅಪ್ರತಿಮ ಧೈರ್ಯ, ಸೋದರರ ಸಹಕಾರ, ಸ್ಪರ್ಧಾತ್ಮಕ ಜಯ.',
          hi: '३य भाव में चन्द्र: पराक्रम वृद्धि, भाइयों का सहयोग, कार्यों में विजय।',
          en: 'Moon in 3rd: Unshakable courage, sibling warmth, competitive success.'
        };
      case 4:
        return {
          kn: '೪ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಮನಸ್ಸಿನಲ್ಲಿ ಚಂಚಲತೆ, ವಾಹನ ಚಾಲನೆಯಲ್ಲಿ ಜಾಗರೂಕತೆ ವಹಿಸಿ.',
          hi: '४थे भाव में चन्द्र: मानसिक चंचलता, वाहन संचालन में सावधानी बरतें।',
          en: 'Moon in 4th: Emotional sensitivity, drive carefully, seek inner stillness.'
        };
      case 5:
        return {
          kn: '೫ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಬುದ್ಧಿಶಕ್ತಿಯ ಉದಯ, ಕಲಾತ್ಮಕ ಆಸಕ್ತಿ, ಮಕ್ಕಳಿಂದ ಸಂತೋಷ.',
          hi: '५वें भाव में चन्द्र: बौद्धिक प्रखरता, रचनात्मक कार्य, सन्तान सुख।',
          en: 'Moon in 5th: Spark of creative genius, artistic joy, children blessings.'
        };
      case 6:
        return {
          kn: '೬ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಶತ್ರುಗಳ ಮೇಲೆ ಜಯ, ರೋಗ ನಿವಾರಣೆ, ಸಾಲ ಬಾಧೆಯಿಂದ ಮುಕ್ತಿ.',
          hi: '६ठे भाव में चन्द्र: शत्रुओं पर विजय, स्वास्थ्य लाभ, ऋण मुक्ति का मार्ग।',
          en: 'Moon in 6th: Victory over hurdles, healing of ailments, debt relief.'
        };
      case 7:
        return {
          kn: '೭ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಆನಂದದಾಯಕ ಪ್ರಯಾಣ, ದಾಂಪತ್ಯ ಪ್ರೀತಿ, ಸಾರ್ವಜನಿಕ ಗೌರವ.',
          hi: '७वें भाव में चन्द्र: सुखद यात्रा, दाम्पत्य मधुरता, समाज में सम्मान।',
          en: 'Moon in 7th: Joyous travel, marital romance, harmonious partnerships.'
        };
      case 8:
        return {
          kn: '೮ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರಾಷ್ಟಮ: ಮಾನಸಿಕ ಸಂಯಮವಿರಲಿ, ವಾದ-ವಿವಾದಗಳಿಂದ ದೂರವಿರಿ, ಶಿವ ಪೂಜೆ ಮಾಡಿ.',
          hi: '८वें भाव में चन्द्राष्टम: वाद-विवाद से बचें, शान्त रहें एवं शिव पूजन करें।',
          en: 'Moon in 8th (Chandrashtama): Avoid arguments, rest mind, pray to Shiva.'
        };
      case 9:
        return {
          kn: '೯ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಧಾರ್ಮಿಕ ಚಿಂತನೆ, ದೈವ ದರ್ಶನ, ಭಾಗ್ಯೋದಯ ಮತ್ತು ತಂದೆಯ ಆಶೀರ್ವಾದ.',
          hi: '९वें भाव में चन्द्र: धार्मिक कार्य, तीर्थ दर्शन, भाग्योदय एवं पितृ कृपा।',
          en: 'Moon in 9th: Dharmic inspiration, divine blessings, fortunate breaks.'
        };
      case 10:
        return {
          kn: '೧೦ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ವೃತ್ತಿಯಲ್ಲಿ ಯಶಸ್ಸು, ಮೇಲಧಿಕಾರಿಗಳ ಮೆಚ್ಚುಗೆ, ಅಧಿಕಾರ ಪ್ರಾಪ್ತಿ.',
          hi: '१०वें भाव में चन्द्र: कार्यक्षेत्र में उन्नति, अधिकारियों से प्रशंसा।',
          en: 'Moon in 10th: Professional honors, executive distinction, productive momentum.'
        };
      case 11:
        return {
          kn: '೧೧ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಧನಲಾಭ, ನೂತನ ಮಿತ್ರರ ಭೇಟಿ, ಸಕಲ ಇಷ್ಟಾರ್ಥಗಳ ಸಿದ್ಧಿ.',
          hi: '११वें भाव में चन्द्र: धन लाभ, नए मित्रों का सहयोग, मनोकामना सिद्धि।',
          en: 'Moon in 11th: Financial inflows, loyal allies, wish fruition.'
        };
      case 12:
        return {
          kn: '೧೨ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಖರ್ಚು ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ, ಆಧ್ಯಾತ್ಮಿಕ ಧ್ಯಾನದಿಂದ ಶಾಂತಿ.',
          hi: '१२वें भाव में चन्द्र: अनावश्यक व्यय से बचें, ध्यान व योग से शान्ति।',
          en: 'Moon in 12th: Rising expenses, practice mindful breathing & meditation.'
        };
    }
  }

  if (planetName === 'Jupiter') {
    return isBenefic
      ? {
          kn: `ಗುರು ${house}ನೇ ಭಾವದಲ್ಲಿದ್ದು ದೈವಿಕ ರಕ್ಷಣೆ ಮತ್ತು ಆರ್ಥಿಕ ವಿಸ್ತರಣೆಯನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.`,
          hi: `गुरु ${house}वें भाव में होकर दैवीय सुरक्षा एवं आर्थिक समृद्धि प्रदान करते हैं।`,
          en: `Jupiter in House ${house} showers divine wisdom, luck, and expansion.`
        }
      : {
          kn: `ಗುರು ${house}ನೇ ಭಾವದಲ್ಲಿದ್ದು ಶ್ರಮದಾಯಕ ಅಧ್ಯಯನ ಮತ್ತು ತಾಳ್ಮೆಯನ್ನು ಬಯಸುತ್ತಾನೆ.`,
          hi: `गुरु ${house}वें भाव में संयम और ज्ञान संवर्धन का संदेश देते हैं।`,
          en: `Jupiter in House ${house} counsels patience and ethical discipline.`
        };
  }

  if (planetName === 'Saturn') {
    return isBenefic
      ? {
          kn: `ಶನಿ ${house}ನೇ ಭಾವದಲ್ಲಿದ್ದು ದೃಢ ಸಂಕಲ್ಪ ಮತ್ತು ಶಾಶ್ವತ ಯಶಸ್ಸನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.`,
          hi: `शनि ${house}वें भाव में अडिग संकल्प और स्थिर सफलता प्रदान करते हैं।`,
          en: `Saturn in House ${house} rewards dedicated perseverance and discipline.`
        }
      : {
          kn: `ಶನಿ ${house}ನೇ ಭಾವದಲ್ಲಿದ್ದು ಕಾಯಕದಲ್ಲಿ ಶಿಸ್ತು ಮತ್ತು ನಮ್ರತೆಯನ್ನು ಪರೀಕ್ಷಿಸುತ್ತಾನೆ.`,
          hi: `शनि ${house}वें भाव में धैर्य, कर्तव्यनिष्ठा और सेवा की अपेक्षा रखते हैं।`,
          en: `Saturn in House ${house} exercises karmic testing; maintain humility and hard work.`
        };
  }

  if (planetName === 'Sun') {
    return isBenefic
      ? {
          kn: `ಸೂರ್ಯನು ${house}ನೇ ಭಾವದಲ್ಲಿ ತೇಜಸ್ಸು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಗೌರವವನ್ನು ಹೆಚ್ಚಿಸುತ್ತಾನೆ.`,
          hi: `सूर्य ${house}वें भाव में यश, मान-प्रतिष्ठा एवं आत्मबल बढ़ाते हैं।`,
          en: `Sun in House ${house} bestows executive vitality, prestige, and leadership.`
        }
      : {
          kn: `ಸೂರ್ಯನು ${house}ನೇ ಭಾವದಲ್ಲಿದ್ದು ಅಹಂಕಾರ ತ್ಯಜಿಸಿ ಶಾಂತತೆಯಿಂದ ವ್ಯವಹರಿಸಲು ಸೂಚಿಸುತ್ತಾನೆ.`,
          hi: `सूर्य ${house}वें भाव में अहंकार से दूर रहकर धैर्य की प्रेरणा देते हैं।`,
          en: `Sun in House ${house} counsels humility and avoiding aggressive ego clashes.`
        };
  }

  return {
    kn: `${planetName} ಗ್ರಹವು ${house}ನೇ ಭಾವದಲ್ಲಿ ತನ್ನ ಕಾರಕತ್ವದ ಪ್ರಭಾವ ಬೀರುತ್ತಾನೆ.`,
    hi: `${planetName} ग्रह ${house}वें भाव में अपना प्रभाव डाल रहे हैं।`,
    en: `${planetName} transits House ${house}, influencing daily rhythms.`
  };
}

// Generate realistic localized predictions for the 4 life domains
function generateDomainPredictions(
  rashiEn: string,
  moonHouse: number,
  sunHouse: number,
  jupHouse: number,
  satHouse: number
): {
  career: LocalizedString;
  finance: LocalizedString;
  health: LocalizedString;
  family: LocalizedString;
} {
  const isAuspiciousDay = [1, 3, 6, 7, 10, 11].includes(moonHouse);
  const isChandrashtama = moonHouse === 8;
  const isHighCareerDay = [3, 6, 10, 11].includes(sunHouse) || moonHouse === 10;

  const career: LocalizedString = isChandrashtama
    ? {
        kn: 'ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ತಾಳ್ಮೆ ಅತ್ಯಂತ ಮುಖ್ಯ. ಮೇಲಧಿಕಾರಿಗಳೊಂದಿಗೆ ಅಥವಾ ಸಹೋದ್ಯೋಗಿಗಳೊಂದಿಗೆ ವಾದಕ್ಕೆ ಇಳಿಯಬೇಡಿ. ಬಾಕಿ ಇರುವ ಸಾಮಾನ್ಯ ಕೆಲಸಗಳನ್ನು ಮುಗಿಸಿ, ಹೊಸ ಯೋಜನೆಗಳಿಗೆ ಸಹಿ ಹಾಕಬೇಡಿ.',
        hi: 'कार्यक्षेत्र में धैर्य बनाए रखें। उच्चाधिकारियों या सहकर्मियों के साथ तर्क-वितर्क से बचें। नए अनुबंधों पर हस्ताक्षर आज टालें।',
        en: 'Exercise diplomatic patience at work. Refrain from ego conflicts with superiors; focus on clearing pending tasks rather than launching new ventures.'
      }
    : isHighCareerDay
    ? {
        kn: 'ವೃತ್ತಿ ಮತ್ತು ವ್ಯಾಪಾರದಲ್ಲಿ ಮಹತ್ವದ ಯಶಸ್ಸು! ಹೊಸ ಜವಾಬ್ದಾರಿಗಳು, ನಾಯಕತ್ವದ ಅವಕಾಶಗಳು ಹಾಗೂ ವಹಿವಾಟಿನಲ್ಲಿ ಲಾಭ ಲಭಿಸುತ್ತದೆ. ಸಂದರ್ಶನ ಅಥವಾ ವ್ಯಾಪಾರ ಸಭೆಗಳಿಗೆ ಅತ್ಯಂತ ಶುಭ ದಿನ.',
        hi: 'कार्यक्षेत्र में शानदार प्रगति! नई जिम्मेदारियां, पदोन्नति के योग एवं व्यावसायिक लाभ मिलेगा। महत्वपूर्ण बैठकों के लिए उत्तम दिन है।',
        en: 'Auspicious professional momentum! Favorable for executive meetings, negotiations, and leadership initiatives. Recognition from colleagues is assured.'
      }
    : {
        kn: 'ದೈನಂದಿನ ವೃತ್ತಿ ಚಟುವಟಿಕೆಗಳು ಸುಲಲಿತವಾಗಿ ಸಾಗಲಿವೆ. ಯೋಜನೆಗಳನ್ನು ಕ್ರಮಬದ್ಧವಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿ. ಸಂವಹನದಲ್ಲಿ ಸ್ಪಷ್ಟತೆ ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
        hi: 'दैनिक कार्य सामान्य गति से चलेंगे। योजनाओं को व्यवस्थित रूप से पूरा करें। सहकर्मियों से सहयोग मिलेगा।',
        en: 'Steady workflow in your professional realm. Maintain methodical focus on deliverables and clear correspondence.'
      };

  const finance: LocalizedString = isChandrashtama || moonHouse === 12
    ? {
        kn: 'ಆಕಸ್ಮಿಕ ಖರ್ಚುಗಳು ಅಥವಾ ಸಾಲ ನೀಡುವ ಸಂದರ್ಭ ಎದುರಾಗಬಹುದು. ಅನಿರೀಕ್ಷಿತ ಹೂಡಿಕೆಗಳು ಮತ್ತು ಷೇರು ಮಾರುಕಟ್ಟೆಯ ಆತುರದ ನಿರ್ಧಾರಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ತಪ್ಪಿಸಿ.',
        hi: 'आकस्मिक व्यय की संभावना है। सट्टा या जोखिम भरे निवेश से बचें। धन का लेन-देन आज बहुत सावधानी से करें।',
        en: 'Guard your wallet against impulse spending. Avoid speculative investments or lending funds; stick strictly to budgeted necessities.'
      }
    : [2, 11].includes(moonHouse) || [2, 5, 9, 11].includes(jupHouse)
    ? {
        kn: 'ಆರ್ಥಿಕವಾಗಿ ಸಮೃದ್ಧಿಯ ದಿನ! ಬಾಕಿ ಇದ್ದ ಹಣ ಕೈಸೇರುವ ಯೋಗವಿದೆ. ನೂತನ ಹೂಡಿಕೆಗಳು ಅಥವಾ ಆಸ್ತಿ ಖರೀದಿಯ ಮಾತುಕತೆಗೆ ಶುಭ ಕಾಲಾವಕಾಶ.',
        hi: 'आर्थिक दृष्टि से उत्तम दिन! रुका हुआ धन प्राप्त हो सकता है। नए निवेश या संपत्ति विचार के लिए अनुकूल समय है।',
        en: 'Strong financial vitality! Inflow from unexpected sources and successful closing of commercial transactions. Safe for planned investments.'
      }
    : {
        kn: 'ಆದಾಯ ಮತ್ತು ಖರ್ಚು ಸಮತೋಲನದಲ್ಲಿರುತ್ತವೆ. ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳ ಖರೀದಿಗೆ ಸಾಧಾರಣ ವೆಚ್ಚವಾಗಬಹುದು. ಉಳಿತಾಯಕ್ಕೆ ಒತ್ತು ನೀಡಿ.',
        hi: 'आय एवं व्यय में संतुलन रहेगा। घरेलू आवश्यकताओं पर सामान्य खर्च संभव है। बचत पर ध्यान दें।',
        en: 'Financial balance remains stable. Routine domestic expenses are managed smoothly. Prioritize consistent savings.'
      };

  const health: LocalizedString = isChandrashtama
    ? {
        kn: 'ಮಾನಸಿಕ ಒತ್ತಡ, ನಿದ್ರಾಹೀನತೆ ಅಥವಾ ತಲೆನೋವು ಕಾಣಿಸಿಕೊಳ್ಳಬಹುದು. ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಿರಿ, ಮಸಾಲೆಯುಕ್ತ ಆಹಾರ ತ್ಯಜಿಸಿ ಹಾಗೂ ಪ್ರಾಣಾಯಾಮದಿಂದ ಶಾಂತಿ ಪಡೆಯಿರಿ.',
        hi: 'मानसिक तनाव या अनिद्रा से बचें। पर्याप्त जल पिएं, हल्का सात्विक भोजन लें एवं प्राणायाम से मन को स्थिर रखें।',
        en: 'Watch for mental fatigue, neck tension, or mild restlessness. Hydrate generously, prefer fresh sattvic meals, and practice calming breathwork.'
      }
    : {
        kn: 'ದೈಹಿಕ ಚೈತನ್ಯ ಮತ್ತು ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಉತ್ತಮವಾಗಿರುತ್ತದೆ. ಮುಂಜಾನೆಯ ವಾಯುವಿಹಾರ ಮತ್ತು ಹಿತಮಿತ ಆಹಾರ ನಿಮ್ಮ ಉತ್ಸಾಹವನ್ನು ಇಮ್ಮಡಿಗೊಳಿಸುತ್ತದೆ.',
        hi: 'शारीरिक स्फूर्ति एवं ऊर्जा बनी रहेगी। प्रातःकालीन भ्रमण और संतुलित आहार से स्वास्थ्य उत्तम रहेगा।',
        en: 'Robust physical vigor and mental optimism. Morning outdoor walk and balanced nutrition sustain your high energy throughout the day.'
      };

  const family: LocalizedString = isChandrashtama
    ? {
        kn: 'ಕುಟುಂಬದಲ್ಲಿ ಅನಗತ್ಯ ತಪ್ಪು ಕಲ್ಪನೆಗಳಿಗೆ ಎಡೆಮಾಡಿಕೊಡಬೇಡಿ. ಸಂಗಾತಿಯ ಭಾವನೆಗಳನ್ನು ಗೌರವಿಸಿ, ಮನೆಯಲ್ಲಿ ಪ್ರಶಾಂತ ವಾತಾವರಣ ಕಾಪಾಡಿ.',
        hi: 'परिवार में गलतफहमी से बचें। जीवनसाथी की बातों को ध्यान से सुनें और घर में सौहार्द बनाए रखें।',
        en: 'Cultivate empathy and patient listening at home. Avoid minor domestic squabbles; show loving appreciation for your spouse and elders.'
      }
    : {
        kn: 'ಕುಟುಂಬದಲ್ಲಿ ಸಡಗರ, ಪ್ರೀತಿ ಮತ್ತು ಸೌಹಾರ್ದತೆಯ ವಾತಾವರಣ. ಸಂಗಾತಿಯೊಂದಿಗೆ ಆಹ್ಲಾದಕರ ಕ್ಷಣಗಳನ್ನು ಕಳೆಯುವಿರಿ. ಶುಭ ಕಾರ್ಯಗಳ ಚರ್ಚೆ ಸಾಧ್ಯ.',
        hi: 'परिवार में प्रसन्नता और प्रेम का वातावरण रहेगा। जीवनसाथी से सहयोग मिलेगा। पारिवारिक चर्चाएं सफल होंगी।',
        en: 'Warm, joyous atmosphere with family members. Domestic affection and mutual respect will brighten your evening.'
      };

  return { career, finance, health, family };
}

// Generate targeted daily Vedic remedies and mantras for each Rashi
function generateRashiRemedy(rashiIdx: number): SingleRashiDailyForecast['dailyRemedy'] {
  const remedies: SingleRashiDailyForecast['dailyRemedy'][] = [
    // 0: Mesha (Aries - Mars)
    {
      deity: { en: 'Lord Hanuman & Kartikeya', kn: 'ಶ್ರೀ ಹನುಮಂತ ದೇವರು & ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ', hi: 'श्री हनुमान जी एवं कार्तिकेय' },
      mantra: { en: 'Om Hanumate Namaha / Om Saravanabhavaya Namah', kn: 'ಓಂ ಹನುಮತೇ ನಮಃ । ಓಂ ಶರವಣಭವಾಯ ನಮಃ ॥', hi: 'ॐ हनुमते नमः । ॐ शरवणभवाय नमः ॥' },
      charityAction: { en: 'Feed birds with red grains or donate jaggery', kn: 'ಪಕ್ಷಿಗಳಿಗೆ ಕೆಂಪು ಧಾನ್ಯಗಳನ್ನು ನೀಡಿ ಅಥವಾ ಬೆಲ್ಲ ದಾನ ಮಾಡಿ', hi: 'पक्षियों को लाल अनाज डालें या गुड़ का दान करें' },
      mindsetTip: { en: 'Channel your natural fiery courage into constructive discipline; avoid impulsive anger.', kn: 'ಆತುರದ ಕೋಪ ತ್ಯಜಿಸಿ, ಧೈರ್ಯವನ್ನು ರಚನಾತ್ಮಕ ಕಾರ್ಯಗಳಿಗೆ ವಿನಿಯೋಗಿಸಿ.', hi: 'क्रोध पर नियंत्रण रखें और अपने पराक्रम का सकारात्मक उपयोग करें।' }
    },
    // 1: Vrishabha (Taurus - Venus)
    {
      deity: { en: 'Devi Mahalakshmi', kn: 'ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಿ', hi: 'श्री महालक्ष्मी देवी' },
      mantra: { en: 'Om Shreem Mahalakshmyai Namah', kn: 'ಓಂ ಶ್ರೀಂ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ನಮಃ ॥', hi: 'ॐ श्रीं महालक्ष्म्यै नमः ॥' },
      charityAction: { en: 'Offer white flowers or donate white rice/sugar to temple', kn: 'ಬಿಳಿ ಹೂವುಗಳನ್ನು ಅರ್ಪಿಸಿ ಅಥವಾ ಅಕ್ಕಿ/ಸಕ್ಕರೆ ದಾನ ಮಾಡಿ', hi: 'श्वेत पुष्प अर्पित करें अथवा चावल व मिश्री का दान करें' },
      mindsetTip: { en: 'Practice joyful gratitude and aesthetic cleanliness in your living space.', kn: 'ಮನೆಯಲ್ಲಿ ಸ್ವಚ್ಛತೆ, ಸುಗಂಧ ಮತ್ತು ಕೃತಜ್ಞತಾ ಭಾವನೆ ಕಾಪಾಡಿಕೊಳ್ಳಿ.', hi: 'सकारात्मक दृष्टिकोण रखें और घर में शुचिता व सौन्दर्य बनाए रखें।' }
    },
    // 2: Mithuna (Gemini - Mercury)
    {
      deity: { en: 'Lord Ganesha & Mahavishnu', kn: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ & ವಿಷ್ಣು', hi: 'श्री गणेश जी एवं भगवान विष्णु' },
      mantra: { en: 'Om Gam Ganapataye Namah / Om Namo Narayanaya', kn: 'ಓಂ ಗಂ ಗಣಪತಯೇ ನಮಃ । ಓಂ ನಮೋ ನಾರಾಯಣಾಯ ॥', hi: 'ॐ गं गणपतये नमः । ॐ नमो नारायणाय ॥' },
      charityAction: { en: 'Feed green grass or spinach to cows', kn: 'ಗೋವುಗಳಿಗೆ ಹಸಿರು ಹುಲ್ಲು ಅಥವಾ ಪಾಲಕ್ ಸೊಪ್ಪು ನೀಡಿ', hi: 'गौमाता को हरा चारा या पालक खिलाएं' },
      mindsetTip: { en: 'Focus on thoughtful communication and active listening rather than multitasking.', kn: 'ಸ್ಪಷ್ಟ ಮಾತು ಮತ್ತು ಮುಕ್ತ ಆಲಿಸುವಿಕೆಗೆ ಆದ್ಯತೆ ನೀಡಿ.', hi: 'अपनी वाणी में मधुरता रखें और एकाग्रचित्त होकर कार्य करें।' }
    },
    // 3: Karka (Cancer - Moon)
    {
      deity: { en: 'Lord Shiva & Devi Parvati', kn: 'ಶ್ರೀ ಪರಮೇಶ್ವರ & ಪಾರ್ವತೀ ದೇವಿ', hi: 'भगवान शिव एवं माता पार्वती' },
      mantra: { en: 'Om Namah Shivaya / Om Somaya Namah', kn: 'ಓಂ ನಮಃ ಶಿವಾಯ । ಓಂ ಸೋಮಾಯ ನಮಃ ॥', hi: 'ॐ नमः शिवाय । ॐ सोमाय नमः ॥' },
      charityAction: { en: 'Offer milk/water to Shiva Linga or distribute drinking water', kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಜಲಾಭಿಷೇಕ ಮಾಡಿ ಅಥವಾ ಬಾಯಾರಿದವರಿಗೆ ನೀರು ನೀಡಿ', hi: 'शिवलिंग पर जल या दूध अर्पित करें एवं जल सेवा करें' },
      mindsetTip: { en: 'Keep your emotional heart calm like a serene lake; avoid overthinking past events.', kn: 'ಹಳೆಯ ಕಹಿ ನೆನಪುಗಳನ್ನು ಮರೆತು ಮನಸ್ಸನ್ನು ಪ್ರಶಾಂತವಾಗಿಡಿ.', hi: 'अनावश्यक चिंताओं से बचें और मन को शांत व स्थिर रखें।' }
    },
    // 4: Simha (Leo - Sun)
    {
      deity: { en: 'Surya Narayana', kn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ', hi: 'भगवान सूर्य नारायण' },
      mantra: { en: 'Om Suryaya Namah / Om Ghrinih Suryaya Namah', kn: 'ಓಂ ಸೂರ್ಯಾಯ ನಮಃ । ಓಂ ಘೃಣಿಃ ಸೂರ್ಯಾಯ ನಮಃ ॥', hi: 'ॐ सूर्याय नमः । ॐ घृणिः सूर्याय नमः ॥' },
      charityAction: { en: 'Offer Arghya (water with red kumkum) to rising Sun', kn: 'ತಾಮ್ರದ ಪಾತ್ರೆಯಲ್ಲಿ ಸೂರ್ಯದೇವನಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸಿ', hi: 'तांबे के पात्र से सूर्य देव को कुंकुम मिश्रित जल अर्पित करें' },
      mindsetTip: { en: 'Lead with quiet humility and respect elders; true authority is gentle.', kn: 'ವಿನಯತೆಯಿಂದ ಮುನ್ನಡೆಯಿರಿ; ಅಹಂಕಾರವನ್ನು ತ್ಯಜಿಸಿ ಎಲ್ಲರ ಗೌರವ ಗಳಿಸಿ.', hi: 'अहंकार से बचें और विनम्रतापूर्वक अपने नेतृत्व कौशल का प्रदर्शन करें।' }
    },
    // 5: Kanya (Virgo - Mercury)
    {
      deity: { en: 'Devi Saraswati & Lord Ganesha', kn: 'ಶ್ರೀ ಸರಸ್ವತೀ ದೇವಿ & ಗಣಪತಿ', hi: 'माँ सरस्वती एवं श्री गणेश' },
      mantra: { en: 'Om Aim Saraswatyai Namah', kn: 'ಓಂ ಐಂ ಸರಸ್ವತ್ಯೈ ನಮಃ ॥', hi: 'ॐ ऐं सरस्वत्यै नमः ॥' },
      charityAction: { en: 'Donate notebooks or stationery to a student in need', kn: 'ಬಡ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪುಸ್ತಕ ಅಥವಾ ಲೇಖನ ಸಾಮಗ್ರಿ ದಾನ ಮಾಡಿ', hi: 'विद्यार्थियों को पुस्तकें या अध्ययन सामग्री दान करें' },
      mindsetTip: { en: 'Avoid over-analyzing minor flaws; celebrate steady progress over perfection.', kn: 'ಪರಿಪೂರ್ಣತೆಯ ಹಠ ಬಿಟ್ಟು, ಕ್ರಮಬದ್ಧ ಪ್ರಗತಿಯನ್ನು ಆನಂದಿಸಿ.', hi: 'अति-आलोचनात्मक होने से बचें और सरलता अपनाएं।' }
    },
    // 6: Tula (Libra - Venus)
    {
      deity: { en: 'Devi Durga & Mahalakshmi', kn: 'ಶ್ರೀ ದುರ್ಗಾದೇವಿ & ಮಹಾಲಕ್ಷ್ಮೀ', hi: 'माँ दुर्गा एवं महालक्ष्मी' },
      mantra: { en: 'Om Dum Durgayai Namah', kn: 'ಓಂ ದುಂ ದುರ್ಗಾಯೈ ನಮಃ ॥', hi: 'ॐ दुं दुर्गायै नमः ॥' },
      charityAction: { en: 'Offer sweet milk sweets to young girls or women in need', kn: 'ಮಕ್ಕಳಿಗೆ ಅಥವಾ ಹೆಣ್ಣುಮಕ್ಕಳಿಗೆ ಸಿಹಿ ಪದಾರ್ಥ ಹಂಚಿ', hi: 'कन्याओं को मीठा प्रसाद या खीर का वितरण करें' },
      mindsetTip: { en: 'Seek balanced harmony without compromising on your core values.', kn: 'ನಿಮ್ಮ ಮೌಲ್ಯಗಳನ್ನು ಕಾಪಾಡಿಕೊಂಡು ಪರಸ್ಪರ ನ್ಯಾಯಯುತ ಸಮತೋಲನ ಸಾಧಿಸಿ.', hi: 'न्यायप्रियता बनाए रखें और अपने मूल्यों से समझौता न करें।' }
    },
    // 7: Vrischika (Scorpio - Mars)
    {
      deity: { en: 'Lord Subramanya (Murugan) & Narasimha', kn: 'ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ & ನರಸಿಂಹ', hi: 'श्री कार्तिकेय एवं नृसिंह देव' },
      mantra: { en: 'Om Saravanabhavaya Namah / Om Narasimhaya Namah', kn: 'ಓಂ ಶರವಣಭವಾಯ ನಮಃ । ಓಂ ನರಸಿಂಹಾಯ ನಮಃ ॥', hi: 'ॐ शरवणभवाय नमः । ॐ नृसिंहाय नमः ॥' },
      charityAction: { en: 'Donate red lentils (Masoor Dal) or light deepa', kn: 'ಕೆಂಪು ಬೇಳೆ ದಾನ ಮಾಡಿ ಅಥವಾ ಸಂಜೆ ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ', hi: 'मसूर की दाल का दान करें अथवा संध्या समय घी का दीपक जलाएं' },
      mindsetTip: { en: 'Transform intense passions into focused spiritual perseverance.', kn: 'ಆಂತರಿಕ ತೀವ್ರತೆಯನ್ನು ಧ್ಯಾನ ಮತ್ತು ಸಾಧನೆಯ ಶಕ್ತಿಯಾಗಿ ಪರಿವರ್ತಿಸಿ.', hi: 'अपनी ऊर्जा को रचनात्मक कार्यों और आत्म-चिंतन में लगाएं।' }
    },
    // 8: Dhanus (Sagittarius - Jupiter)
    {
      deity: { en: 'Lord Dakshinamurthy & Dattatreya', kn: 'ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ & ದತ್ತಾತ್ರೇಯ', hi: 'भगवान दक्षिणामूर्ति एवं दत्तात्रेय' },
      mantra: { en: 'Om Dakshinamurtaye Namah / Om Gurave Namah', kn: 'ಓಂ ದಕ್ಷಿಣಾಮೂರ್ತಯೇ ನಮಃ । ಓಂ ಗುರವೇ ನಮಃ ॥', hi: 'ॐ दक्षिणामूर्तये नमः । ॐ गुरवे नमः ॥' },
      charityAction: { en: 'Feed yellow chana dal to birds or offer yellow flowers to teachers', kn: 'ಹಳದಿ ಕಡಲೆಕಾಳು ಅಥವಾ ಹಳದಿ ಹೂವು ಅರ್ಪಿಸಿ', hi: 'चने की दाल का दान करें या गुरुजनों का चरण स्पर्श कर आशीर्वाद लें' },
      mindsetTip: { en: 'Stay grounded in dharmic truth; combine broad optimism with disciplined follow-through.', kn: 'ಧರ್ಮನಿಷ್ಠೆ ಕಾಪಾಡಿ, ವಿಶಾಲ ಆಶಾವಾದದೊಂದಿಗೆ ಕರ್ತವ್ಯ ನಿರ್ವಹಿಸಿ.', hi: 'धर्म का पालन करें और ज्ञान को व्यवहार में उतारें।' }
    },
    // 9: Makara (Capricorn - Saturn)
    {
      deity: { en: 'Lord Shiva & Shani Devata', kn: 'ಶ್ರೀ ಪರಮೇಶ್ವರ & ಶನೈಶ್ಚರ', hi: 'भगवान शिव एवं शनि देव' },
      mantra: { en: 'Om Sham Shanaishcharaya Namah / Om Tryambakam', kn: 'ಓಂ ಶಂ ಶನೈಶ್ಚರಾಯ ನಮಃ । ಓಂ ತ್ರ್ಯಂಬಕಂ ಯಜಾಮಹೇ ॥', hi: 'ॐ शं शनैश्चराय नमः । महामृत्युंजय मन्त्र' },
      charityAction: { en: 'Help an elderly person or feed black sesame seeds to ants/crows', kn: 'ಹಿರಿಯರಿಗೆ ಸಹಾಯ ಮಾಡಿ ಅಥವಾ ಕಾಗೆಗಳಿಗೆ ಎಳ್ಳನ್ನ ಅರ್ಪಿಸಿ', hi: 'वृद्धजनों की सेवा करें अथवा कौवों को भोजन दें' },
      mindsetTip: { en: 'Patience and duty are your greatest strengths; trust in continuous perseverance.', kn: 'ತಾಳ್ಮೆ ಮತ್ತು ಕರ್ತವ್ಯನಿಷ್ಠೆಯು ನಿಮ್ಮ ಬಲ; ಹತಾಶೆಯಾಗದೆ ಮುಂದುವರಿಯಿರಿ.', hi: 'धैर्य और कर्मनिष्ठा को अपनी शक्ति बनाएं।' }
    },
    // 10: Kumbha (Aquarius - Saturn)
    {
      deity: { en: 'Lord Shiva & Sri Hanuman', kn: 'ಶ್ರೀ ಕಾಲಭೈರವ & ಹನುಮಂತ ದೇವರು', hi: 'भगवान कालभैरव एवं श्री हनुमान' },
      mantra: { en: 'Om Hanumate Namah / Om Kalabhairavaya Namah', kn: 'ಓಂ ಹನುಮತೇ ನಮಃ । ಓಂ ಕಾಲಭೈರವಾಯ ನಮಃ ॥', hi: 'ॐ हनुमते नमः । ॐ कालभैरवाय नमः ॥' },
      charityAction: { en: 'Donate warm clothes, footwear, or food to underprivileged workers', kn: 'ಶ್ರಮಿಕರಿಗೆ ಆಹಾರ ಅಥವಾ ವಸ್ತ್ರ ಸಹಾಯ ಮಾಡಿ', hi: 'श्रमिकों या असहाय लोगों को भोजन या वस्त्र प्रदान करें' },
      mindsetTip: { en: 'Harness your visionary innovation for the collective welfare of society.', kn: 'ನಿಮ್ಮ ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಸಮಾಜದ ಒಳಿತಿಗಾಗಿ ಬಳಸಿ.', hi: 'मानवता और सेवा भाव से समाज के कल्याण हेतु कार्य करें।' }
    },
    // 11: Meena (Pisces - Jupiter)
    {
      deity: { en: 'Lord Vishnu & Sri Ranganatha', kn: 'ಶ್ರೀ ರಂಗನಾಥ & ಮಹಾವಿಷ್ಣು', hi: 'भगवान विष्णु एवं श्री रंगनाथ' },
      mantra: { en: 'Om Namo Bhagavate Vasudevaya', kn: 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ ॥', hi: 'ॐ नमो भगवते वासुदेवाय ॥' },
      charityAction: { en: 'Donate yellow sweets or feed fish in a natural pond/river', kn: 'ಮೀನುಗಳಿಗೆ ಆಹಾರ ಹಾಕಿ ಅಥವಾ ಹಳದಿ ಸಿಹಿ ಪದಾರ್ಥ ದಾನ ಮಾಡಿ', hi: 'मछलियों को दाना डालें या पीले फल व मिष्ठान्न का दान करें' },
      mindsetTip: { en: 'Embrace compassionate detachment; let divine surrender dissolve all mental fatigue.', kn: 'ಕರುಣೆ ಮತ್ತು ಈಶ್ವರಾರ್ಪಣಾ ಬುದ್ಧಿಯಿಂದ ಮನಸ್ಸನ್ನು ಹಗುರಗೊಳಿಸಿ.', hi: 'सहानुभूति और ईश्वर के प्रति समर्पण भाव से मन को शांत रखें।' }
    }
  ];

  return remedies[rashiIdx] || remedies[0];
}
