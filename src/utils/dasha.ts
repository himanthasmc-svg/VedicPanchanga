import { Language, LocalizedString } from '../types';

export interface DashaLord {
  planet: string;
  name: LocalizedString;
  symbol: string;
  years: number;
  color: string;
  chartColor: string;
  rashiLords: number[];
  characteristics: {
    en: string;
    kn: string;
    hi: string;
  };
  remedy: {
    en: string;
    kn: string;
    hi: string;
  };
}

export const VIMSHOTTARI_LORDS: DashaLord[] = [
  {
    planet: 'Ketu',
    name: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु' },
    symbol: 'Ke',
    years: 7,
    color: '#78716c',
    chartColor: '#a8a29e',
    rashiLords: [7], // Co-lord Scorpio
    characteristics: {
      en: 'Period of spiritual introspection, detachment, sudden shifts, and intuitive breakthroughs.',
      kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಅನ್ವೇಷಣೆ, ವೈರಾಗ್ಯ ಭಾವನೆ, ಅನಿರೀಕ್ಷಿತ ತಿರುವುಗಳು ಮತ್ತು ಅಂತಃಪ್ರಜ್ಞೆಯ ಜಾಗೃತಿ ಕಾಲ.',
      hi: 'आध्यात्मिक चेतना, वैराग्य, अप्रत्याशित परिवर्तन एवं सूक्ष्म अंतर्ज्ञान का समय।'
    },
    remedy: {
      en: 'Ganesha worship, chanting Sankata Nashana Stotra, feeding street animals.',
      kn: 'ಸಂಕಷ್ಟಹರ ಗಣಪತಿ ಪೂಜೆ, ಗರಿಕಾರ್ಚನೆ ಹಾಗೂ ನಾಯಿಗಳಿಗೆ ಅನ್ನದಾನ.',
      hi: 'गणेश आराधना, संकट नाशन स्तोत्र जप एवं श्वान को भोजन।'
    }
  },
  {
    planet: 'Venus',
    name: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    symbol: 'Ve',
    years: 20,
    color: '#ec4899',
    chartColor: '#f472b6',
    rashiLords: [1, 6], // Taurus, Libra
    characteristics: {
      en: 'Long period of worldly comforts, marriage, luxury, artistic creativity, vehicles, and harmony.',
      kn: 'ಲೌಕಿಕ ಸುಖ-ಭೋಗಗಳು, ವಿವಾಹ, ವಾಹನ ಲಾಭ, ಕಲಾತ್ಮಕ ಪ್ರತಿಭೆ ಮತ್ತು ಸಮೃದ್ಧಿಯ ೨೦ ವರ್ಷಗಳ ಸುವರ್ಣ ಕಾಲ.',
      hi: 'वैवाहिक सुख, ऐश्वर्य, कला-साहित्य, वाहन सुख एवं भौतिक उन्नति का २० वर्षीय समय।'
    },
    remedy: {
      en: 'Mahalakshmi worship, offering white flowers, respecting women.',
      kn: 'ಮಹಾಲಕ್ಷ್ಮೀ ಅಷ್ಟಕ ಪಠಣ, ಶುಕ್ರವಾರ ಬಿಳಿ ಹೂವು ಸಮರ್ಪಣೆ, ಸ್ತ್ರೀಯರಿಗೆ ಗೌರವ.',
      hi: 'महालक्ष्मी स्तोत्र, शुक्रवार श्वेत पुष्प अर्पण एवं स्त्री सम्मान।'
    }
  },
  {
    planet: 'Sun',
    name: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    symbol: 'Su',
    years: 6,
    color: '#ea580c',
    chartColor: '#fb923c',
    rashiLords: [4], // Leo
    characteristics: {
      en: 'Period of authority, leadership, government favor, self-realization, and paternal focus.',
      kn: 'ನಾಯಕತ್ವ, ಸರ್ಕಾರಿ/ವೃತ್ತಿಪರ ಮನ್ನಣೆ, ಕೀರ್ತಿ, ತಂದೆಯ ಹಿತಚಿಂತನೆ ಮತ್ತು ಆತ್ಮಗೌರವದ ಕಾಲ.',
      hi: 'प्रशासनिक अधिकार, मान-सम्मान, पदोन्नति एवं आत्मविश्वास वृद्धि काल।'
    },
    remedy: {
      en: 'Daily Surya Namaskar, Aditya Hridaya Stotra, offering water in a copper vessel.',
      kn: 'ನಿತ್ಯ ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಣ, ತಾಮ್ರದ ಪಾತ್ರೆಯಲ್ಲಿ ಸೂರ್ಯಾರ್ಘ್ಯ.',
      hi: 'सूर्य नमस्कार, आदित्य हृदय स्तोत्र पाठ एवं ताम्र पात्र से अर्घ्य।'
    }
  },
  {
    planet: 'Moon',
    name: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    symbol: 'Mo',
    years: 10,
    color: '#0284c7',
    chartColor: '#38bdf8',
    rashiLords: [3], // Cancer
    characteristics: {
      en: 'Period of emotional growth, public popularity, mental creativity, maternal care, and travel.',
      kn: 'ಮಾನಸಿಕ ಪ್ರಶಾಂತತೆ, ಕಾವ್ಯ-ಕಲ್ಪನಾಶಕ್ತಿ, ತಾಯಿಯ ಸಾಮೀಪ್ಯ, ಜನಪ್ರಿಯತೆ ಮತ್ತು ಜಲ ಸಂಚಾರ ಕಾಲ.',
      hi: 'मानसिक शांति, रचनात्मकता, जनसम्पर्क, मातृसुख एवं सुखद यात्राएं।'
    },
    remedy: {
      en: 'Shiva Abhisheka on Mondays, meditation, drinking water from silver utensils.',
      kn: 'ಸೋಮವಾರ ಶಿವಲಿಂಗಕ್ಕೆ ಕ್ಷೀರಾಭಿಷೇಕ, ಧ್ಯಾನ, ಬೆಳ್ಳಿಯ ಲೋಟದಲ್ಲಿ ನೀರು ಸೇವನೆ.',
      hi: 'सोमवार को शिवलिंग पर दुग्धाभिषेक, ध्यान एवं चांदी पात्र का उपयोग।'
    }
  },
  {
    planet: 'Mars',
    name: { en: 'Mars (Mangala)', kn: 'ಮಂಗಳ (ಕುಜ)', hi: 'मंगल' },
    symbol: 'Ma',
    years: 7,
    color: '#dc2626',
    chartColor: '#f87171',
    rashiLords: [0, 7], // Aries, Scorpio
    characteristics: {
      en: 'Period of dynamic courage, property/land acquisitions, technical drive, and competitive victory.',
      kn: 'ಅಪಾರ ಧೈರ್ಯ, ಭೂಮಿ-ಆಸ್ತಿ ಖರೀದಿ, ತಾಂತ್ರಿಕ ಕಾರ್ಯಗಳಲ್ಲಿ ಯಶಸ್ಸು ಮತ್ತು ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ ವಿಜಯ ಕಾಲ.',
      hi: 'पराक्रम, भूमि-सम्पत्ति क्रय, तकनीकी सफलता एवं प्रतिद्वंद्वियों पर विजय।'
    },
    remedy: {
      en: 'Subramanya / Kartikeya worship, Hanuman Chalisa, donating red lentils on Tuesdays.',
      kn: 'ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ ಆರಾಧನೆ, ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ, ಮಂಗಳವಾರ ತೊಗರಿಬೇಳೆ ದಾನ.',
      hi: 'कार्तिकेय पूजा, हनुमान चालीसा पाठ एवं मंगलवार लाल मसूर दान।'
    }
  },
  {
    planet: 'Rahu',
    name: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु' },
    symbol: 'Ra',
    years: 18,
    color: '#4f46e5',
    chartColor: '#818cf8',
    rashiLords: [10], // Co-lord Aquarius
    characteristics: {
      en: 'Intense period of worldly ambitions, foreign connections, tech innovation, and unconventional rises.',
      kn: 'ವಿದೇಶ ಪ್ರಯಾಣ, ನವೀನ ತಂತ್ರಜ್ಞಾನ, ಅನಿರೀಕ್ಷಿತ ಕೀರ್ತಿ ಹಾಗೂ ತೀವ್ರ ಮಹತ್ವಾಕಾಂಕ್ಷೆಯ ೧೮ ವರ್ಷಗಳ ಕಾಲ.',
      hi: 'विदेशी सम्बंध, तकनीकी शोध, उच्च महत्वाकांक्षा एवं अप्रत्याशित ख्याति।'
    },
    remedy: {
      en: 'Durga Saptashati, worship of Goddess Durga during Rahu Kaal, donating black urad dal.',
      kn: 'ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಾರಾಯಣ, ರಾಹು ಕಾಲದಲ್ಲಿ ದುರ್ಗಾ ಪೂಜೆ, ಕಪ್ಪು ಉದ್ದು ದಾನ.',
      hi: 'दुर्गा सप्तशती, राहुकाल में देवी पूजन एवं उड़द दाल दान।'
    }
  },
  {
    planet: 'Jupiter',
    name: { en: 'Jupiter (Guru)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'गुरु' },
    symbol: 'Ju',
    years: 16,
    color: '#d97706',
    chartColor: '#fbbf24',
    rashiLords: [8, 11], // Sagittarius, Pisces
    characteristics: {
      en: 'Supreme benefic period of wisdom, ethical expansion, children, spiritual learning, and wealth.',
      kn: 'ದೈವಾನುಗ್ರಹ, ಜ್ಞಾನಾರ್ಜನೆ, ಸತ್ಸಂತಾನ ಲಾಭ, ಗುರುಕೃಪೆ, ಧಾರ್ಮಿಕ ಯಾತ್ರೆ ಮತ್ತು ಭಾಗ್ಯೋದಯದ ಕಾಲ.',
      hi: 'ज्ञान, विवेक, उत्तम संतान सुख, धार्मिक यात्राएं, गुरु कृपा एवं समृद्धि।'
    },
    remedy: {
      en: 'Guru Charitra reading, Raghavendra / Dattatreya worship, donating yellow chana dal.',
      kn: 'ಗುರು ಚರಿತ್ರೆ ಪಠಣ, ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ/ದತ್ತಾತ್ರೇಯ ಆರಾಧನೆ, ಗುರುವಾರ ಕಡಲೆಕಾಳು ದಾನ.',
      hi: 'गुरु चरित्र पाठ, दत्तात्रेय उपासना एवं गुरुवार चने की दाल दान।'
    }
  },
  {
    planet: 'Saturn',
    name: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' },
    symbol: 'Sa',
    years: 19,
    color: '#0f766e',
    chartColor: '#2dd4bf',
    rashiLords: [9, 10], // Capricorn, Aquarius
    characteristics: {
      en: 'Period of discipline, karmic lessons, perseverance, grounded foundation, and enduring success.',
      kn: 'ಶಿಸ್ತು, ಕಠಿಣ ಕರ್ಮಫಲ ಪ್ರಜ್ಞೆ, ಧೀಮಂತ ಸಹನೆ, ಜನಸೇವೆ ಮತ್ತು ದೀರ್ಘಕಾಲೀನ ಶಾಶ್ವತ ಯಶಸ್ಸಿನ ಕಾಲ.',
      hi: 'कठिन परिश्रम, अनुशासन, कर्मशुद्धि, जनसेवा एवं दीर्घकालिक स्थायित्व।'
    },
    remedy: {
      en: 'Lighting sesame oil lamp on Saturdays, Dasharatha Shani Stotra, serving the elderly/laborers.',
      kn: 'ಶನಿವಾರ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ, ದಶರಥ ಕೃತ ಶನಿ ಸ್ತೋತ್ರ, ಹಿರಿಯರಿಗೆ ಹಾಗೂ ಶ್ರಮಿಕರಿಗೆ ಸೇವೆ.',
      hi: 'शनिवार तिल तेल दीप, दशरथ शनि स्तोत्र एवं वृद्ध व श्रमिकों की सेवा।'
    }
  },
  {
    planet: 'Mercury',
    name: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' },
    symbol: 'Me',
    years: 17,
    color: '#059669',
    chartColor: '#34d399',
    rashiLords: [2, 5], // Gemini, Virgo
    characteristics: {
      en: 'Period of sharp intellect, business commerce, communication skills, writing, and analytical growth.',
      kn: 'ಬುದ್ಧಿ ಚಾತುರ್ಯ, ವ್ಯಾಪಾರ-ವಾಣಿಜ್ಯ ವೃದ್ಧಿ, ವಾಕ್ಸಿಂಹಾಸನ, ಗಣಿತ-ವಿಜ್ಞಾನ ಮತ್ತು ಸಂವಹನ ಕಲೆಯ ಕಾಲ.',
      hi: 'प्रखर बुद्धि, व्यापार वृद्धि, संचार कुशलता, उच्च अध्ययन एवं विश्लेषणात्मक सफलता।'
    },
    remedy: {
      en: 'Vishnu Sahasranama chanting, feeding green fodder to cows, watering Tulsi plant.',
      kn: 'ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ, ಬುಧವಾರ ಗೋವುಗಳಿಗೆ ಹಸಿರು ಹುಲ್ಲು ನೀಡುವುದು, ತುಳಸಿ ಸೇವೆ.',
      hi: 'विष्णु सहस्रनाम पाठ, गायों को हरा चारा एवं तुलसी सेवा।'
    }
  }
];

// Mapping of 27 Nakshatras (0 = Ashwini to 26 = Revati) to initial Vimshottari Lord
// Ashwini (Ketu), Bharani (Venus), Krittika (Sun), Rohini (Moon), Mrigashirsha (Mars),
// Ardra (Rahu), Punarvasu (Jupiter), Pushya (Saturn), Ashlesha (Mercury)...
export const NAKSHATRA_LORD_INDICES = [
  0, // 0: Ashwini -> Ketu
  1, // 1: Bharani -> Venus
  2, // 2: Krittika -> Sun
  3, // 3: Rohini -> Moon
  4, // 4: Mrigashirsha -> Mars
  5, // 5: Ardra -> Rahu
  6, // 6: Punarvasu -> Jupiter
  7, // 7: Pushya -> Saturn
  8, // 8: Ashlesha -> Mercury
  0, // 9: Magha -> Ketu
  1, // 10: Purva Phalguni -> Venus
  2, // 11: Uttara Phalguni -> Sun
  3, // 12: Hasta -> Moon
  4, // 13: Chitra -> Mars
  5, // 14: Swati -> Rahu
  6, // 15: Vishakha -> Jupiter
  7, // 16: Anuradha -> Saturn
  8, // 17: Jyeshtha -> Mercury
  0, // 18: Moola -> Ketu
  1, // 19: Purvashadha -> Venus
  2, // 20: Uttarashadha -> Sun
  3, // 21: Shravana -> Moon
  4, // 22: Dhanishta -> Mars
  5, // 23: Shatabhisha -> Rahu
  6, // 24: Purva Bhadrapada -> Jupiter
  7, // 25: Uttara Bhadrapada -> Saturn
  8  // 26: Revati -> Mercury
];

export interface AntardashaPeriod {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  isActive: boolean;
  intensity: number; // 0 to 100
}

export interface MahadashaPeriod {
  lord: DashaLord;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  startAge: number;
  endAge: number;
  isActive: boolean;
  completionPercentage: number;
  antardashas: AntardashaPeriod[];
  activeAntardasha?: AntardashaPeriod;
}

export interface VimshottariDashaResult {
  birthDate: Date;
  targetDate: Date;
  userAge: number;
  nakshatraIndex: number;
  nakshatraProgress: number; // 0 to 1
  balanceAtBirthYears: number;
  activeMahadasha: MahadashaPeriod;
  activeAntardasha: AntardashaPeriod;
  mahadashas: MahadashaPeriod[];
  chartData: {
    name: string;
    startAge: number;
    endAge: number;
    duration: number;
    intensity: number;
    color: string;
    isActive: boolean;
    planet: string;
  }[];
  radarData: {
    area: string;
    areaKn: string;
    areaHi: string;
    score: number;
    fullMark: number;
  }[];
}

/**
 * Calculates complete Vimshottari Dasha cycle for a given birth date,
 * Moon longitude (degrees in zodiac 0-360), and target query date (defaults to now).
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonLongitude: number,
  targetDate: Date = new Date()
): VimshottariDashaResult {
  const nakshatraSpan = 360 / 27; // 13.333333333333334 degrees
  const normLong = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normLong / nakshatraSpan) % 27;
  const degreesInNakshatra = normLong % nakshatraSpan;
  const nakshatraFractionSpent = degreesInNakshatra / nakshatraSpan;
  const nakshatraFractionRemaining = 1 - nakshatraFractionSpent;

  // Determine starting Mahadasha lord index (0 to 8 in VIMSHOTTARI_LORDS)
  const initialLordIndex = NAKSHATRA_LORD_INDICES[nakshatraIndex] || 0;
  const initialLord = VIMSHOTTARI_LORDS[initialLordIndex];

  // Balance of initial Dasha remaining at birth
  const initialBalanceYears = initialLord.years * nakshatraFractionRemaining;

  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const birthTimeMs = birthDate.getTime();
  const targetTimeMs = targetDate.getTime();
  const userAge = Math.max(0, (targetTimeMs - birthTimeMs) / msPerYear);

  // Generate complete 120-year cycle of Mahadashas starting from initial balance
  const mahadashas: MahadashaPeriod[] = [];
  let currentStartMs = birthTimeMs;
  let currentStartAge = 0;

  for (let i = 0; i < 9; i++) {
    const lordIdx = (initialLordIndex + i) % 9;
    const lord = VIMSHOTTARI_LORDS[lordIdx];
    const durationYears = i === 0 ? initialBalanceYears : lord.years;
    const durationMs = durationYears * msPerYear;
    const currentEndMs = currentStartMs + durationMs;
    const currentEndAge = currentStartAge + durationYears;

    const isCurrentActive = targetTimeMs >= currentStartMs && targetTimeMs <= currentEndMs;
    let completionPercentage = 0;
    if (targetTimeMs > currentEndMs) {
      completionPercentage = 100;
    } else if (isCurrentActive) {
      completionPercentage = Math.min(100, Math.max(0, ((targetTimeMs - currentStartMs) / durationMs) * 100));
    }

    // Subdivide into 9 Antardashas
    const antardashas: AntardashaPeriod[] = [];
    let antarStartMs = currentStartMs;
    let activeAntar: AntardashaPeriod | undefined = undefined;

    for (let a = 0; a < 9; a++) {
      const antarLordIdx = (lordIdx + a) % 9;
      const antarLord = VIMSHOTTARI_LORDS[antarLordIdx];
      // Formula: (Maha years * Antar years) / 120
      const antarYears = (lord.years * antarLord.years) / 120;
      // Pro-rate for the very first Dasha if born with partial balance
      const effectiveAntarYears = i === 0 ? antarYears * nakshatraFractionRemaining : antarYears;
      const antarDurationMs = effectiveAntarYears * msPerYear;
      const antarEndMs = antarStartMs + antarDurationMs;

      const isAntarActive = targetTimeMs >= antarStartMs && targetTimeMs <= antarEndMs;
      
      // Calculate astrological intensity score for this Dasha/Antardasha pair
      let intensityScore = 55;
      if (lord.planet === antarLord.planet) intensityScore += 20; // Svadasha has strong focal clarity
      if (['Jupiter', 'Venus', 'Moon'].includes(lord.planet)) intensityScore += 15;
      if (['Sun', 'Mars'].includes(antarLord.planet)) intensityScore += 10;
      intensityScore = Math.min(95, Math.max(30, intensityScore));

      const antarPeriod: AntardashaPeriod = {
        lord: antarLord,
        startDate: new Date(antarStartMs),
        endDate: new Date(antarEndMs),
        durationMonths: Number((effectiveAntarYears * 12).toFixed(1)),
        isActive: isAntarActive,
        intensity: intensityScore
      };

      if (isAntarActive) activeAntar = antarPeriod;
      antardashas.push(antarPeriod);
      antarStartMs = antarEndMs;
    }

    const mdPeriod: MahadashaPeriod = {
      lord,
      startDate: new Date(currentStartMs),
      endDate: new Date(currentEndMs),
      durationYears: Number(durationYears.toFixed(2)),
      startAge: Number(currentStartAge.toFixed(1)),
      endAge: Number(currentEndAge.toFixed(1)),
      isActive: isCurrentActive,
      completionPercentage: Number(completionPercentage.toFixed(1)),
      antardashas,
      activeAntardasha: activeAntar || antardashas[0]
    };

    mahadashas.push(mdPeriod);
    currentStartMs = currentEndMs;
    currentStartAge = currentEndAge;
  }

  // Active Mahadasha
  const activeMahadasha = mahadashas.find(m => m.isActive) || mahadashas[0];
  const activeAntardasha = activeMahadasha.activeAntardasha || activeMahadasha.antardashas[0];

  // Recharts timeline series data
  const chartData = mahadashas.map(m => ({
    name: m.lord.name.en.split(' ')[0],
    startAge: m.startAge,
    endAge: m.endAge,
    duration: m.durationYears,
    intensity: m.isActive ? 90 : 50,
    color: m.lord.chartColor,
    isActive: m.isActive,
    planet: m.lord.planet
  }));

  // Recharts radar data for active dasha
  const activePlanet = activeMahadasha.lord.planet;
  const radarData = [
    {
      area: 'Career & Authority',
      areaKn: 'ವೃತ್ತಿ & ಅಧಿಕಾರ',
      areaHi: 'आजीविका व पद',
      score: ['Sun', 'Mars', 'Jupiter', 'Saturn'].includes(activePlanet) ? 88 : 65,
      fullMark: 100
    },
    {
      area: 'Wealth & Prosperity',
      areaKn: 'ಧನ & ಸಮೃದ್ಧಿ',
      areaHi: 'धन व समृद्धि',
      score: ['Venus', 'Jupiter', 'Mercury', 'Moon'].includes(activePlanet) ? 92 : 68,
      fullMark: 100
    },
    {
      area: 'Intellect & Learning',
      areaKn: 'ವಿದ್ಯೆ & ಜ್ಞಾನ',
      areaHi: 'ज्ञान व बुद्धि',
      score: ['Mercury', 'Jupiter', 'Ketu'].includes(activePlanet) ? 94 : 60,
      fullMark: 100
    },
    {
      area: 'Relationships & Harmony',
      areaKn: 'ಸಂಬಂಧ & ಸೌಹಾರ್ದ',
      areaHi: 'सम्बन्ध व सौहार्द',
      score: ['Venus', 'Moon', 'Jupiter'].includes(activePlanet) ? 89 : 58,
      fullMark: 100
    },
    {
      area: 'Spiritual Insight',
      areaKn: 'ಆಧ್ಯಾತ್ಮ & ಮೋಕ್ಷ',
      areaHi: 'अध्यात्म व मोक्ष',
      score: ['Ketu', 'Jupiter', 'Saturn'].includes(activePlanet) ? 95 : 55,
      fullMark: 100
    },
    {
      area: 'Courage & Endurance',
      areaKn: 'ಧೈರ್ಯ & ಸಹನೆ',
      areaHi: 'साहस व धैर्य',
      score: ['Mars', 'Saturn', 'Sun', 'Rahu'].includes(activePlanet) ? 90 : 62,
      fullMark: 100
    }
  ];

  return {
    birthDate,
    targetDate,
    userAge: Number(userAge.toFixed(1)),
    nakshatraIndex,
    nakshatraProgress: Number(nakshatraFractionSpent.toFixed(3)),
    balanceAtBirthYears: Number(initialBalanceYears.toFixed(2)),
    activeMahadasha,
    activeAntardasha,
    mahadashas,
    chartData,
    radarData
  };
}
