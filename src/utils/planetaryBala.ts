import { PlanetPosition, Language } from '../types';

export interface PlanetaryBalaBreakdown {
  planet: PlanetPosition;
  totalScore: number; // 0 to 100
  level: 'supreme' | 'strong' | 'moderate' | 'weak';
  levelText: Record<Language, string>;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    bar: string;
  };
  sthanaBala: {
    dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
    dignityText: Record<Language, string>;
    points: number; // max 35
    maxPoints: number;
    description: Record<Language, string>;
  };
  bhavaBala: {
    houseType: 'kendra' | 'trikona' | 'kendra_trikona' | 'upachaya' | 'dusthana' | 'dhana' | 'neutral';
    houseTypeText: Record<Language, string>;
    points: number; // max 35
    maxPoints: number;
    description: Record<Language, string>;
  };
  digbala: {
    hasDigbala: boolean;
    points: number; // max 20
    maxPoints: number;
    idealHouse: number;
    description: Record<Language, string>;
  };
  cheshtaBala: {
    isVakri: boolean;
    points: number; // max 10
    maxPoints: number;
    description: Record<Language, string>;
  };
  insight: Record<Language, string>;
  remedy: Record<Language, string>;
}

// Planetary Dignities data
interface PlanetDignityRule {
  ownSigns: number[]; // 0-based rashiIndex (0 = Mesha, 11 = Meena)
  exaltedSign: number;
  exaltedDegree: number;
  debilitatedSign: number;
  friendlySigns: number[];
  enemySigns: number[];
  digbalaHouse: number; // 1-12
  naturalMalefic: boolean;
}

const PLANET_RULES: Record<string, PlanetDignityRule> = {
  Sun: {
    ownSigns: [4], // Simha
    exaltedSign: 0, // Mesha (Aries)
    exaltedDegree: 10,
    debilitatedSign: 6, // Tula (Libra)
    friendlySigns: [3, 0, 7, 8, 11], // Karka, Mesha, Vrischika, Dhanus, Meena
    enemySigns: [1, 6, 9, 10], // Vrishabha, Tula, Makara, Kumbha
    digbalaHouse: 10, // South / Midheaven
    naturalMalefic: true,
  },
  Moon: {
    ownSigns: [3], // Karka
    exaltedSign: 1, // Vrishabha (Taurus)
    exaltedDegree: 3,
    debilitatedSign: 7, // Vrischika (Scorpio)
    friendlySigns: [4, 2, 5], // Simha, Mithuna, Kanya
    enemySigns: [], // Moon has no natural enemies
    digbalaHouse: 4, // North / Midnight
    naturalMalefic: false,
  },
  Mars: {
    ownSigns: [0, 7], // Mesha, Vrischika
    exaltedSign: 9, // Makara (Capricorn)
    exaltedDegree: 28,
    debilitatedSign: 3, // Karka (Cancer)
    friendlySigns: [4, 3, 8, 11], // Simha, Karka, Dhanus, Meena
    enemySigns: [2, 5], // Mithuna, Kanya
    digbalaHouse: 10, // South
    naturalMalefic: true,
  },
  Mercury: {
    ownSigns: [2, 5], // Mithuna, Kanya
    exaltedSign: 5, // Kanya (Virgo)
    exaltedDegree: 15,
    debilitatedSign: 11, // Meena (Pisces)
    friendlySigns: [4, 1, 6], // Simha, Vrishabha, Tula
    enemySigns: [3], // Karka
    digbalaHouse: 1, // East / Lagna
    naturalMalefic: false,
  },
  Jupiter: {
    ownSigns: [8, 11], // Dhanus, Meena
    exaltedSign: 3, // Karka (Cancer)
    exaltedDegree: 5,
    debilitatedSign: 9, // Makara (Capricorn)
    friendlySigns: [4, 3, 0, 7], // Simha, Karka, Mesha, Vrischika
    enemySigns: [2, 5, 1, 6], // Mithuna, Kanya, Vrishabha, Tula
    digbalaHouse: 1, // East / Lagna
    naturalMalefic: false,
  },
  Venus: {
    ownSigns: [1, 6], // Vrishabha, Tula
    exaltedSign: 11, // Meena (Pisces)
    exaltedDegree: 27,
    debilitatedSign: 5, // Kanya (Virgo)
    friendlySigns: [2, 9, 10], // Mithuna, Makara, Kumbha
    enemySigns: [4, 3], // Simha, Karka
    digbalaHouse: 4, // North
    naturalMalefic: false,
  },
  Saturn: {
    ownSigns: [9, 10], // Makara, Kumbha
    exaltedSign: 6, // Tula (Libra)
    exaltedDegree: 20,
    debilitatedSign: 0, // Mesha (Aries)
    friendlySigns: [2, 5, 1, 6], // Mithuna, Kanya, Vrishabha, Tula
    enemySigns: [4, 3, 0, 7], // Simha, Karka, Mesha, Vrischika
    digbalaHouse: 7, // West / Descendant
    naturalMalefic: true,
  },
  Rahu: {
    ownSigns: [10], // Kumbha (co-lord)
    exaltedSign: 1, // Vrishabha / Mithuna
    exaltedDegree: 15,
    debilitatedSign: 7, // Vrischika
    friendlySigns: [2, 5, 1, 6, 9],
    enemySigns: [4, 3],
    digbalaHouse: 10,
    naturalMalefic: true,
  },
  Ketu: {
    ownSigns: [7], // Vrischika (co-lord)
    exaltedSign: 7, // Vrischika / Dhanus
    exaltedDegree: 15,
    debilitatedSign: 1, // Vrishabha
    friendlySigns: [8, 11, 0, 7],
    enemySigns: [2, 5],
    digbalaHouse: 12,
    naturalMalefic: true,
  },
};

export function calculatePlanetaryBala(planet: PlanetPosition): PlanetaryBalaBreakdown {
  const rule = PLANET_RULES[planet.name] || PLANET_RULES.Sun;
  const house = planet.bhava;
  const rashi = planet.rashiIndex;

  // 1. Sthana Bala (Sign Placement & Dignity - max 35)
  let sthanaDignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' = 'neutral';
  let sthanaPoints = 20;

  if (rashi === rule.exaltedSign) {
    sthanaDignity = 'exalted';
    sthanaPoints = 35;
  } else if (rule.ownSigns.includes(rashi)) {
    sthanaDignity = 'own';
    sthanaPoints = 30;
  } else if (rule.friendlySigns.includes(rashi)) {
    sthanaDignity = 'friendly';
    sthanaPoints = 25;
  } else if (rashi === rule.debilitatedSign) {
    sthanaDignity = 'debilitated';
    sthanaPoints = 6;
  } else if (rule.enemySigns.includes(rashi)) {
    sthanaDignity = 'enemy';
    sthanaPoints = 12;
  } else {
    sthanaDignity = 'neutral';
    sthanaPoints = 18;
  }

  // 2. Bhava Bala (House Type Placement - max 35)
  let houseType: 'kendra' | 'trikona' | 'kendra_trikona' | 'upachaya' | 'dusthana' | 'dhana' | 'neutral' = 'neutral';
  let bhavaPoints = 20;

  if (house === 1) {
    houseType = 'kendra_trikona';
    bhavaPoints = 35; // Lagna is supreme both Kendra & Trikona
  } else if ([4, 7, 10].includes(house)) {
    houseType = 'kendra';
    bhavaPoints = 30;
  } else if ([5, 9].includes(house)) {
    houseType = 'trikona';
    bhavaPoints = 32;
  } else if ([3, 6, 11].includes(house)) {
    houseType = 'upachaya';
    if (rule.naturalMalefic) {
      bhavaPoints = 31; // Malefics in upachaya houses give immense worldly victory
    } else {
      bhavaPoints = house === 11 ? 28 : 22; // 11th is house of gains for all
    }
  } else if (house === 2) {
    houseType = 'dhana';
    bhavaPoints = 25;
  } else if ([8, 12].includes(house)) {
    houseType = 'dusthana';
    if (planet.name === 'Ketu' && (house === 8 || house === 12)) {
      bhavaPoints = 30; // Ketu in Moksha / occult houses excels
    } else if (planet.name === 'Venus' && house === 12) {
      bhavaPoints = 28; // Shukra in 12 gives luxury and bed comforts
    } else {
      bhavaPoints = 12; // Dusthana challenge
    }
  }

  // 3. Digbala (Directional Strength - max 20)
  const isDirectDigbala = house === rule.digbalaHouse;
  let digbalaPoints = 6;
  if (isDirectDigbala) {
    digbalaPoints = 20;
  } else {
    // Distance from digbala house
    const dist = Math.min(
      Math.abs(house - rule.digbalaHouse),
      12 - Math.abs(house - rule.digbalaHouse)
    );
    if (dist === 1) digbalaPoints = 15;
    else if (dist === 2) digbalaPoints = 11;
    else if (dist === 3) digbalaPoints = 8;
    else digbalaPoints = 5;
  }

  // 4. Cheshta Bala (Retrograde motion - max 10)
  let cheshtaPoints = 7;
  if (planet.isRetrograde) {
    if (['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(planet.name)) {
      cheshtaPoints = 10; // Retrograde grahas attain heightened luminosity & chestha bala
    }
  }

  // Total Score (max 100)
  const totalScore = Math.min(100, Math.max(15, sthanaPoints + bhavaPoints + digbalaPoints + cheshtaPoints));

  let level: 'supreme' | 'strong' | 'moderate' | 'weak' = 'moderate';
  if (totalScore >= 82) level = 'supreme';
  else if (totalScore >= 66) level = 'strong';
  else if (totalScore >= 48) level = 'moderate';
  else level = 'weak';

  // Localized texts
  const levelText: Record<Language, string> = {
    kn: level === 'supreme' ? 'ಅತ್ಯುನ್ನತ ಬಲ' : level === 'strong' ? 'ಉತ್ತಮ ಬಲ' : level === 'moderate' ? 'ಮಧ್ಯಮ ಬಲ' : 'ದುರ್ಬಲ',
    hi: level === 'supreme' ? 'अत्युच्च बल' : level === 'strong' ? 'उत्तम बल' : level === 'moderate' ? 'मध्यम बल' : 'दुर्बल',
    en: level === 'supreme' ? 'Supreme Strength' : level === 'strong' ? 'Strong' : level === 'moderate' ? 'Moderate' : 'Weak',
  };

  const colorTheme = {
    supreme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
      bar: 'bg-emerald-500',
    },
    strong: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
      bar: 'bg-blue-500',
    },
    moderate: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
      bar: 'bg-amber-500',
    },
    weak: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-800',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
      bar: 'bg-rose-500',
    },
  }[level];

  // Dignity text
  const dignityText: Record<Language, string> = {
    kn: {
      exalted: 'ಉಚ್ಚ ಕ್ಷೇತ್ರ (Exalted)',
      own: 'ಸ್ವಕ್ಷೇತ್ರ (Own Sign)',
      friendly: 'ಮಿತ್ರ ಕ್ಷೇತ್ರ (Friendly)',
      neutral: 'ಸಮ ಕ್ಷೇತ್ರ (Neutral)',
      enemy: 'ಶತ್ರು ಕ್ಷೇತ್ರ (Enemy)',
      debilitated: 'ನೀಚ ಕ್ಷೇತ್ರ (Debilitated)',
    }[sthanaDignity],
    hi: {
      exalted: 'उच्च राशि (Exalted)',
      own: 'स्वराशि (Own Sign)',
      friendly: 'मित्र राशि (Friendly)',
      neutral: 'सम राशि (Neutral)',
      enemy: 'शत्रु राशि (Enemy)',
      debilitated: 'नीच राशि (Debilitated)',
    }[sthanaDignity],
    en: {
      exalted: 'Exalted Sign (Uccha)',
      own: 'Own Sign (Swakshetra)',
      friendly: 'Friendly Sign (Mitra)',
      neutral: 'Neutral Sign (Sama)',
      enemy: 'Enemy Sign (Shatru)',
      debilitated: 'Debilitated Sign (Neecha)',
    }[sthanaDignity],
  };

  // House Type text
  const houseTypeText: Record<Language, string> = {
    kn: {
      kendra_trikona: 'ಲಗ್ನ (ಕೇಂದ್ರ & ತ್ರಿಕೋಣ)',
      kendra: `ಭಾವ ${house} (ಕೇಂದ್ರ ಸ್ಥಾನ)`,
      trikona: `ಭಾವ ${house} (ತ್ರಿಕೋಣ - ಲಕ್ಷ್ಮೀ ಸ್ಥಾನ)`,
      upachaya: `ಭಾವ ${house} (ಉಪಚಯ - ಜಯ ಸ್ಥಾನ)`,
      dhana: `ಭಾವ ${house} (ಧನ ಸ್ಥಾನ)`,
      dusthana: `ಭಾವ ${house} (ತ್ರಿಕ / ದುಃಸ್ಥಾನ)`,
      neutral: `ಭಾವ ${house}`,
    }[houseType],
    hi: {
      kendra_trikona: 'लग्न (केन्द्र व त्रिकोण)',
      kendra: `भाव ${house} (केन्द्र स्थान)`,
      trikona: `भाव ${house} (त्रिकोण - लक्ष्मी स्थान)`,
      upachaya: `भाव ${house} (उपचय - वृद्धि स्थान)`,
      dhana: `भाव ${house} (धन स्थान)`,
      dusthana: `भाव ${house} (त्रिक / दुष्ट स्थान)`,
      neutral: `भाव ${house}`,
    }[houseType],
    en: {
      kendra_trikona: 'Lagna (Kendra & Trikona)',
      kendra: `House ${house} (Kendra Angle)`,
      trikona: `House ${house} (Trikona Trine)`,
      upachaya: `House ${house} (Upachaya Growth)`,
      dhana: `House ${house} (Dhana Wealth)`,
      dusthana: `House ${house} (Dusthana Challenge)`,
      neutral: `House ${house}`,
    }[houseType],
  };

  // Detailed astrological insight generators based on planet and house
  const insight = generateAstrologicalInsight(planet.name, house, sthanaDignity, isDirectDigbala, planet.isRetrograde);
  const remedy = generatePlanetaryRemedy(planet.name, level === 'weak' || sthanaDignity === 'debilitated');

  return {
    planet,
    totalScore,
    level,
    levelText,
    colorTheme,
    sthanaBala: {
      dignity: sthanaDignity,
      dignityText,
      points: sthanaPoints,
      maxPoints: 35,
      description: {
        kn: `${dignityText.kn}ದಲ್ಲಿ ಸ್ಥಿತನಾಗಿದ್ದಾನೆ (${sthanaPoints}/35 ಅಂಕ)`,
        hi: `${dignityText.hi} में स्थित (${sthanaPoints}/35 अंक)`,
        en: `Placed in ${dignityText.en} (${sthanaPoints}/35 pts)`,
      },
    },
    bhavaBala: {
      houseType,
      houseTypeText,
      points: bhavaPoints,
      maxPoints: 35,
      description: {
        kn: `${houseTypeText.kn} ಫಲದಾಯಕತೆ (${bhavaPoints}/35 ಅಂಕ)`,
        hi: `${houseTypeText.hi} प्रभाव (${bhavaPoints}/35 अंक)`,
        en: `${houseTypeText.en} placement strength (${bhavaPoints}/35 pts)`,
      },
    },
    digbala: {
      hasDigbala: isDirectDigbala,
      points: digbalaPoints,
      maxPoints: 20,
      idealHouse: rule.digbalaHouse,
      description: {
        kn: isDirectDigbala
          ? `ಭಾವ ${rule.digbalaHouse}ರಲ್ಲಿ ಪೂರ್ಣ ದಿಗ್ಬಲ ಲಭಿಸಿದೆ (${digbalaPoints}/20)`
          : `ಆದರ್ಶ ದಿಗ್ಬಲ ಭಾವ: ${rule.digbalaHouse} (${digbalaPoints}/20)`,
        hi: isDirectDigbala
          ? `भाव ${rule.digbalaHouse} में पूर्ण दिग्बल प्राप्त (${digbalaPoints}/20)`
          : `आदर्श दिग्बल भाव: ${rule.digbalaHouse} (${digbalaPoints}/20)`,
        en: isDirectDigbala
          ? `Full Directional Strength (Digbala) in House ${rule.digbalaHouse} (${digbalaPoints}/20)`
          : `Ideal Digbala in House ${rule.digbalaHouse} (${digbalaPoints}/20)`,
      },
    },
    cheshtaBala: {
      isVakri: planet.isRetrograde,
      points: cheshtaPoints,
      maxPoints: 10,
      description: {
        kn: planet.isRetrograde ? 'ವಕ್ರ ಚಲನೆ (ಹೆಚ್ಚಿದ ತೇಜಸ್ಸು ಹಾಗೂ ಚೇಷ್ಟಾ ಬಲ)' : 'ಸಾಮಾನ್ಯ ನೇರ ಚಲನೆ (ಮಾರ್ಗಿ)',
        hi: planet.isRetrograde ? 'वक्री गति (उच्च चेष्टा बल)' : 'सामान्य मार्गी गति',
        en: planet.isRetrograde ? 'Retrograde (Heightened Radiant Power / Cheshta Bala)' : 'Direct Motion (Margi)',
      },
    },
    insight,
    remedy,
  };
}

function generateAstrologicalInsight(
  planetName: string,
  house: number,
  dignity: string,
  hasDigbala: boolean,
  isRetrograde: boolean
): Record<Language, string> {
  // Customized Vedic insight summaries
  if (planetName === 'Sun') {
    if (hasDigbala || house === 10) {
      return {
        kn: 'ಸೂರ್ಯನು ೧೦ನೇ ಭಾವದಲ್ಲಿ ಪೂರ್ಣ ದಿಗ್ಬಲನಾಗಿದ್ದು, ಅತ್ಯುನ್ನತ ಕೀರ್ತಿ, ನಾಯಕತ್ವ ಸಾಮರ್ಥ್ಯ ಹಾಗೂ ಸರ್ಕಾರಿ/ವೃತ್ತಿಪರ ಮನ್ನಣೆಯನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.',
        hi: 'सूर्य १०वें भाव में पूर्ण दिग्बल प्राप्त करता है। यह राजयोग, प्रशासनिक अधिकार और उच्च पद-प्रतिष्ठा का कारक बनता है।',
        en: 'Sun attains supreme Digbala in the 10th house, granting administrative authority, leadership vigor, and high career distinction.',
      };
    }
    if (house === 1) {
      return {
        kn: 'ಲಗ್ನದಲ್ಲಿ ಸೂರ್ಯನು ತೇಜಸ್ವಿ ವ್ಯಕ್ತಿತ್ವ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ದೃಢ ಸಂಕಲ್ಪವನ್ನು ನೀಡುತ್ತಾನೆ. ಆರೋಗ್ಯ ಮತ್ತು ಕಣ್ಣಿನ ಕಾಳಜಿ ಅಗತ್ಯ.',
        hi: 'लग्न में सूर्य तेजस्वी व्यक्तित्व, आत्मविश्वास और उच्च आत्मसम्मान प्रदान करता है।',
        en: 'Sun in Lagna gives a commanding aura, high self-esteem, vibrant vitality, and natural authority.',
      };
    }
    if ([5, 9].includes(house)) {
      return {
        kn: 'ತ್ರಿಕೋಣ ಭಾವದಲ್ಲಿ ಸೂರ್ಯನು ಧರ್ಮ, ಉನ್ನತ ವಿದ್ಯೆ, ಪೂರ್ವಪುಣ್ಯ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಗೌರವವನ್ನು ಹೆಚ್ಚಿಸುತ್ತಾನೆ.',
        hi: 'त्रिकोण भाव में सूर्य धर्म, उच्च ज्ञान एवं पूर्वपुण्य की वृद्धि करता है।',
        en: 'Sun in a Trikona house fosters righteous living, higher learning, and paternal blessings.',
      };
    }
    if ([3, 6, 11].includes(house)) {
      return {
        kn: 'ಉಪಚಯ ಭಾವದಲ್ಲಿ ಸೂರ್ಯನು ಶತ್ರುನಾಶಕನಾಗಿ, ಅದ್ಭುತ ಧೈರ್ಯ ಮತ್ತು ಸಾಹಸದಿಂದ ಲಾಭವನ್ನು ತರುತ್ತಾನೆ.',
        hi: 'उपचय भाव में सूर्य शत्रुओं पर विजय, अदम्य साहस और आर्थिक उन्नति दिलाता है।',
        en: 'Sun in Upachaya shatters opposition, giving resolute courage, health resilience, and steady gains.',
      };
    }
    return {
      kn: `ಸೂರ್ಯನು ಭಾವ ${house}ರಲ್ಲಿ ಸ್ಥಿತನಾಗಿದ್ದು, ಸ್ವಪ್ರಯತ್ನ ಮತ್ತು ತಂದೆಯ ಆಶೀರ್ವಾದದಿಂದ ಶುಭ ಫಲಗಳನ್ನು ಪಡೆಯುತ್ತಾನೆ.`,
      hi: `सूर्य भाव ${house} में स्थित होकर व्यक्तिगत पराक्रम से उन्नति कराता है।`,
      en: `Sun in House ${house} channels vitality through self-discipline and ancestral grace.`,
    };
  }

  if (planetName === 'Moon') {
    if (hasDigbala || house === 4) {
      return {
        kn: 'ಚಂದ್ರನು ೪ನೇ ಭಾವದಲ್ಲಿ ಸುಖೇಶನಾಗಿ ಪೂರ್ಣ ದಿಗ್ಬಲ ಹೊಂದಿದ್ದು, ಮಾತೃವಾತ್ಸಲ್ಯ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಹಾಗೂ ವಾಹನ-ಗೃಹ ಸೌಖ್ಯ ನೀಡುತ್ತಾನೆ.',
        hi: 'चन्द्र ४थे भाव में पूर्ण दिग्बल प्राप्त कर मानसिक शांति, मातृसुख और गृह-वाहन समृद्धि प्रदान करता है।',
        en: 'Moon achieves full Digbala in the 4th house, conferring emotional tranquility, maternal blessings, and home comfort.',
      };
    }
    if ([1, 5, 9].includes(house)) {
      return {
        kn: 'ಲಗ್ನ ಅಥವಾ ತ್ರಿಕೋಣದಲ್ಲಿ ಚಂದ್ರನು ಸೌಮ್ಯ ಸ್ವಭಾವ, ತೀಕ್ಷ್ಣ ಕಲ್ಪನಾಶಕ್ತಿ ಮತ್ತು ಜನಪ್ರಿಯತೆಯನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.',
        hi: 'लग्न या त्रिकोण में चन्द्रमा शांत स्वभाव, उच्च संवेदनशीलता और सामाजिक आकर्षण देता है।',
        en: 'Moon in Dharma/Kendra houses confers intuitive empathy, gentle grace, and popular charm.',
      };
    }
    if ([6, 8, 12].includes(house)) {
      return {
        kn: 'ತ್ರಿಕ ಭಾವದಲ್ಲಿ ಚಂದ್ರನು ಅನಿಶ್ಚಿತ ಮನಸ್ಥಿತಿ ತರಬಹುದು; ಶಿವ ಉಪಾಸನೆ ಮತ್ತು ಧ್ಯಾನದಿಂದ ಮಾನಸಿಕ ಶಾಂತಿ ಲಭಿಸುತ್ತದೆ.',
        hi: 'त्रिक भाव में चन्द्रमा मन की अस्थिरता दे सकता है; शिव आराधना से मन एकाग्र होता है।',
        en: 'Moon in Dusthana houses requires emotional grounding through meditation and Shiva sadhana.',
      };
    }
    return {
      kn: `ಚಂದ್ರನು ಭಾವ ${house}ರಲ್ಲಿ ಮನೋಬಲ ಮತ್ತು ಕುಟುಂಬದ ಸಾಮೀಪ್ಯವನ್ನು ಪ್ರಭಾವಿಸುತ್ತಾನೆ.`,
      hi: `चन्द्र भाव ${house} में संवेदनशीलता और पारिवारिक समरसता को बल देता है।`,
      en: `Moon in House ${house} enriches empathetic connections and creative perception.`,
    };
  }

  if (planetName === 'Mars') {
    if (hasDigbala || house === 10) {
      return {
        kn: 'ಕುಜನು ೧೦ನೇ ಭಾವದಲ್ಲಿ ಕುಲದೀಪಕ ಯೋಗ ಸೃಷ್ಟಿಸುತ್ತಾನೆ; ಕಾರ್ಯಕ್ಷೇತ್ರದಲ್ಲಿ ನಿರ್ಭೀತ ನಿರ್ಧಾರ ಮತ್ತು ಅದ್ಭುತ ಯಶಸ್ಸು ಲಭಿಸುತ್ತದೆ.',
        hi: 'मंगल १०वें भाव में कुलदीपक योग बनाता है। यह अदम्य पराक्रम, तकनीकी दक्षता और विजय दिलाता है।',
        en: 'Mars in the 10th house produces Kuladeepaka Yoga, yielding heroic drive, executive boldness, and victory in enterprise.',
      };
    }
    if ([3, 6, 11].includes(house)) {
      return {
        kn: 'ಉಪಚಯ ಭಾವಗಳಲ್ಲಿ ಕುಜನು ಶತ್ರುನಾಶ, ಭೂಮಿ-ಆಸ್ತಿ ಲಾಭ ಮತ್ತು ಕ್ರೀಡೆ/ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ ಜಯ ನೀಡುತ್ತಾನೆ.',
        hi: 'उपचय भावों में मंगल शत्रुओं का दमन, भूमि-सम्पत्ति का लाभ और प्रतियोगी सफलता दिलाता है।',
        en: 'Mars in Upachaya houses destroys rivalries, bestows real estate strength, and guarantees athletic/competitive triumph.',
      };
    }
    if ([1, 4, 7, 8, 12].includes(house)) {
      return {
        kn: `ಭಾವ ${house}ರಲ್ಲಿ ಮಂಗಳನ ಪ್ರಭಾವವಿದ್ದು, ಮಾತು ಮತ್ತು ಸಂಬಂಧಗಳಲ್ಲಿ ಸಂಯಮ ಹಾಗೂ ಸುಬ್ರಹ್ಮಣ್ಯ ಆರಾಧನೆ ಶ್ರೇಯಸ್ಕರ.`,
        hi: `भाव ${house} में मंगल का प्रभाव वाणी व वैवाहिक जीवन में धैर्य की अपेक्षा रखता है।`,
        en: `Mars in House ${house} imparts passionate dynamic force; patience and Subramanya sadhana balance aggressive impulses.`,
      };
    }
    return {
      kn: `ಕುಜನು ಭಾವ ${house}ರಲ್ಲಿ ಸಾಹಸ ಮತ್ತು ರಕ್ಷಣಾ ಶಕ್ತಿಯನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತಾನೆ.`,
      hi: `मंगल भाव ${house} में कर्मठता और दृढ़ता का संचार करता है।`,
      en: `Mars in House ${house} stimulates decisive action and resilient endurance.`,
    };
  }

  if (planetName === 'Mercury') {
    if (hasDigbala || house === 1) {
      return {
        kn: 'ಬುಧನು ಲಗ್ನದಲ್ಲಿ ಪೂರ್ಣ ದಿಗ್ಬಲನಾಗಿದ್ದು, ಅದ್ಭುತ ವಾಕ್ಚಾತುರ್ಯ, ಗಣಿತ-ವ್ಯಾಪಾರ ಬುದ್ಧಿ ಹಾಗೂ ಹಾಸ್ಯಪ್ರಜ್ಞೆಯನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.',
        hi: 'बुध लग्न में पूर्ण दिग्बल पाता है। यह प्रखर बुद्धि, वाकपटुता, व्यापारिक चातुर्य और भद्र योग फल देता है।',
        en: 'Mercury attains full Digbala in the 1st house, blessing sharp intellectual acumen, eloquent speech, and commercial success.',
      };
    }
    if ([2, 4, 5, 9, 10, 11].includes(house)) {
      return {
        kn: 'ಬುಧನ ಶುಭ ಸ್ಥಿತಿಯು ಉನ್ನತ ವಿದ್ಯಾಭ್ಯಾಸ, ಲೆಕ್ಕಪತ್ರ, ಲೇಖನ ಮತ್ತು ಸಂವಹನ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಯಶಸ್ಸು ನೀಡುತ್ತದೆ.',
        hi: 'बुध की यह स्थिति विद्या, वाणिज्य, लेखन और संचार कौशल में श्रेष्ठ परिणाम देती है।',
        en: 'Mercury here strengthens analytical clarity, articulate communications, financial acumen, and literary talents.',
      };
    }
    return {
      kn: `ಬುಧನು ಭಾವ ${house}ರಲ್ಲಿ ವಿವೇಚನೆ ಮತ್ತು ಹೊಸ ಕೌಶಲ್ಯಗಳ ಕಲಿಕೆಗೆ ಪ್ರೇರಣೆ ನೀಡುತ್ತಾನೆ.`,
      hi: `बुध भाव ${house} में विवेक और ज्ञान संवर्धन का योग बनाता है।`,
      en: `Mercury in House ${house} encourages adaptability, logical inquiry, and continuous learning.`,
    };
  }

  if (planetName === 'Jupiter') {
    if (hasDigbala || house === 1) {
      return {
        kn: 'ಗುರುವು ಲಗ್ನದಲ್ಲಿ ಹಂಸ ಮಹಾಪುರುಷ ಯೋಗದಂತೆ ಪರಮ ರಕ್ಷಣೆ, ಧಾರ್ಮಿಕ ಜ್ಞಾನ, ದೈವಾನುಗ್ರಹ ಮತ್ತು ಗೌರವವನ್ನು ತರುತ್ತಾನೆ.',
        hi: 'गुरु लग्न में सर्वोच्च दिग्बल प्राप्त करता है। यह हंस योग के समान पूर्ण दैवीय सुरक्षा, विवेक और मान-सम्मान देता है।',
        en: 'Jupiter reaches peak Digbala in Lagna, showering divine protection, supreme wisdom, spotless character, and moral authority.',
      };
    }
    if ([5, 9].includes(house)) {
      return {
        kn: 'ಗುರುವು ತ್ರಿಕೋಣದಲ್ಲಿ ಅತ್ಯಂತ ಮಂಗಳಕರನಾಗಿದ್ದು, ಸಂತಾನ ಸೌಖ್ಯ, ಧರ್ಮ ಚಿಂತನೆ ಹಾಗೂ ಗುರು-ಹಿರಿಯರ ಆಶೀರ್ವಾದ ನೀಡುತ್ತಾನೆ.',
        hi: 'त्रिकोण में देवगुरु का वास संतान सुख, भाग्योदय और आध्यात्मिक समृद्धि का अचूक मार्ग प्रशस्त करता है।',
        en: 'Jupiter in Trikona brings Lakshmi-Narayana grace, high dharmic merit, noble progeny, and scholarly honor.',
      };
    }
    return {
      kn: `ಗುರುವು ಭಾವ ${house}ರಲ್ಲಿ ಮಂಗಳಕರ ದೃಷ್ಟಿ ಬೀರಿ ಸಂಕಷ್ಟಗಳಿಂದ ಪಾರುಮಾಡುತ್ತಾನೆ.`,
      hi: `गुरु भाव ${house} में अपनी अमृत दृष्टि से जीवन में शांति और स्थिरता लाते हैं।`,
      en: `Jupiter in House ${house} casts expansive benefic light, shielding against adversity and fostering generosity.`,
    };
  }

  if (planetName === 'Venus') {
    if (hasDigbala || house === 4) {
      return {
        kn: 'ಶುಕ್ರನು ೪ನೇ ಭಾವದಲ್ಲಿ ಪೂರ್ಣ ದಿಗ್ಬಲನಾಗಿದ್ದು, ಸುಖ-ಭೋಗಗಳು, ಸುಂದರ ಗೃಹ, ವಾಹನ ಹಾಗೂ ಕಲಾತ್ಮಕ ಆನಂದವನ್ನು ಒದಗಿಸುತ್ತಾನೆ.',
        hi: 'शुक्र ४थे भाव में पूर्ण दिग्बल पाकर मालव्य योग तुल्य ऐश्वर्य, सुंदर भवन, वाहन और कलात्मक सुख देता है।',
        en: 'Venus commands full Digbala in the 4th house, bestowing aesthetic elegance, opulent comforts, luxury vehicles, and joy.',
      };
    }
    if (house === 12) {
      return {
        kn: '೧೨ನೇ ಭಾವದಲ್ಲಿ ಶುಕ್ರನು ಜ್ಯೋತಿಷ್ಯಶಾಸ್ತ್ರದ ಪ್ರಕಾರ ಅಪರೂಪದ ಭೋಗ-ಭಾಗ್ಯ, ಸುಖ ನಿದ್ರೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸೌಂದರ್ಯ ನೀಡುತ್ತಾನೆ.',
        hi: '१२वें भाव में शुक्र शास्त्रों के अनुसार परम शुभ फल, भोग-विलास और शयन सुख प्रदाता होता है।',
        en: 'Venus in the 12th house is an auspicious Vedic exception, conferring rich sensory comforts and philanthropic generosity.',
      };
    }
    return {
      kn: `ಶುಕ್ರನು ಭಾವ ${house}ರಲ್ಲಿ ಪ್ರೇಮ, ಸೌಹಾರ್ದ ಹಾಗೂ ಆಕರ್ಷಕ ಕಲಾತ್ಮಕ ಪ್ರತಿಭೆಯನ್ನು ಉದ್ದೀಪಿಸುತ್ತಾನೆ.`,
      hi: `शुक्र भाव ${house} में आकर्षण, मधुर सम्बंध और सौन्दर्य बोध को विकसित करता है।`,
      en: `Venus in House ${house} enriches harmonious relationships, refinement, and artistic sensibility.`,
    };
  }

  if (planetName === 'Saturn') {
    if (hasDigbala || house === 7) {
      return {
        kn: 'ಶನಿಯು ೭ನೇ ಭಾವದಲ್ಲಿ ಪೂರ್ಣ ದಿಗ್ಬಲನಾಗಿದ್ದು, ಶಶ ಯೋಗದ ಶಕ್ತಿ, ದೀರ್ಘಕಾಲೀನ ಸಹನೆ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ಪಾಲುದಾರಿಕೆ ನೀಡುತ್ತಾನೆ.',
        hi: 'शनि ७वें भाव में पूर्ण दिग्बल प्राप्त करता है। यह शश योग के समान अनुशासन, जनसम्पर्क और स्थायी सफलता देता है।',
        en: 'Saturn achieves full Digbala in the 7th house, endowing unshakeable patience, diplomatic maturity, and enduring achievements.',
      };
    }
    if ([3, 6, 11].includes(house)) {
      return {
        kn: 'ಉಪಚಯ ಭಾವದಲ್ಲಿ ಶನಿಯು ಅತ್ಯಂತ ಬಲಿಷ್ಠನಾಗಿ ಕಠಿಣ ಶ್ರಮಕ್ಕೆ ಅಪಾರ ಪ್ರತಿಫಲ, ಶತ್ರುಜಯ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯವನ್ನು ನೀಡುತ್ತಾನೆ.',
        hi: 'उपचय भावों में शनि परम बलशाली होकर शत्रुओं का नाश, दीर्घायु और अटूट कर्मठता का वरदान देता है।',
        en: 'Saturn in Upachaya houses is formidable, grinding down obstacles, granting longevity, and rewarding honest hard work.',
      };
    }
    return {
      kn: `ಶನಿಯು ಭಾವ ${house}ರಲ್ಲಿ ಶಿಸ್ತು ಮತ್ತು ಕರ್ಮಫಲ ಪ್ರಜ್ಞೆಯನ್ನು ಬೆಳೆಸುತ್ತಾನೆ.`,
      hi: `शनि भाव ${house} में धैर्य, साधना और न्यायप्रियता की प्रेरणा देता है।`,
      en: `Saturn in House ${house} teaches perseverance, karmic maturity, and methodical discipline.`,
    };
  }

  if (planetName === 'Rahu') {
    if ([3, 6, 10, 11].includes(house)) {
      return {
        kn: 'ರಾಹುವು ಉಪಚಯ/ಕೇಂದ್ರದಲ್ಲಿ ಅಪ್ರತಿಮ ಲೌಕಿಕ ಯಶಸ್ಸು, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ದೂರದೃಷ್ಟಿಯ ಜಯ ನೀಡುತ್ತಾನೆ.',
        hi: 'राहु उपचय अथवा दशम भाव में अप्रत्याशित सफलता, तकनीकी दक्षता और राजनीतिक प्रभाव देता है।',
        en: 'Rahu in Upachaya or 10th house fuels worldly ambition, tech innovation, high worldly prominence, and unconventional victory.',
      };
    }
    return {
      kn: `ರಾಹುವು ಭಾವ ${house}ರಲ್ಲಿ ಮಹತ್ವಾಕಾಂಕ್ಷೆಯನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತಾನೆ; ದುರ್ಗಾ ದೇವಿಯ ಪ್ರಾರ್ಥನೆ ಶುಭಕರ.`,
      hi: `राहु भाव ${house} में तीव्र आकांक्षाएं देता है; माँ दुर्गा की उपासना से शांति मिलती है।`,
      en: `Rahu in House ${house} amplifies worldly hunger; propitiation of Durga Ma channels erratic energies into focused genius.`,
    };
  }

  // Ketu
  if ([8, 9, 12].includes(house)) {
    return {
      kn: 'ಕೇತುವು ಮೋಕ್ಷ/ಧರ್ಮ ಭಾವಗಳಲ್ಲಿ ಅಪೂರ್ವ ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನ, ಅಂತಃಪ್ರಜ್ಞೆ ಮತ್ತು ವೈರಾಗ್ಯವನ್ನು ಕರುಣಿಸುತ್ತಾನೆ.',
      hi: 'केतु मोक्ष व धर्म भावों में उच्च आध्यात्मिक चेतना, सूक्ष्म अंतर्ज्ञान और वैराग्य प्रदान करता है।',
      en: 'Ketu in spiritual houses unlocks piercing intuition, occult knowledge, and profound spiritual liberation (Moksha).',
    };
  }
  return {
    kn: `ಕೇತುವು ಭಾವ ${house}ರಲ್ಲಿ ನಿರಾಸಕ್ತಿ ಮತ್ತು ಗಣೇಶ ಭಕ್ತಿಯಿಂದ ರಕ್ಷಣೆಯನ್ನು ನೀಡುತ್ತಾನೆ.`,
    hi: `केतु भाव ${house} में वैराग्य और आत्मनिरीक्षण की प्रेरणा देता है; गणेश पूजा शुभ है।`,
    en: `Ketu in House ${house} guides detachment from transient matters; Ganesha worship brings grounding and insight.`,
  };
}

function generatePlanetaryRemedy(planetName: string, isWeakOrDebilitated: boolean): Record<Language, string> {
  const remedies: Record<string, Record<Language, string>> = {
    Sun: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ನಿತ್ಯ ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಣ ಹಾಗೂ ತಾಮ್ರ ಪಾತ್ರೆಯಲ್ಲಿ ಸೂರ್ಯನಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸಿ.'
        : 'ಶುಭ ಬಲ: ತಂದೆ-ಗುರುಗಳಿಗೆ ಗೌರವ, ಗಾಯತ್ರಿ ಜಪ ಹಾಗೂ ಭಾನುವಾರ ಗೋಧಿ ಅಥವಾ ಬೆಲ್ಲ ದಾನ ಶ್ರೇಯಸ್ಕರ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: नित्य सूर्य नमस्कार, आदित्य हृदय स्तोत्र पाठ एवं ताम्र पात्र से सूर्य को अर्घ्य दें।'
        : 'शुभ बल: पिता-गुरु का सम्मान, गायत्री जप एवं रविवार को गेहूं या गुड़ का दान करें।',
      en: isWeakOrDebilitated
        ? 'Remedy: Daily Surya Namaskar, Aditya Hridaya Stotra chanting, and offering water in a copper vessel at sunrise.'
        : 'Harmonize: Respect father and mentors, chant Gayatri Mantra, and donate wheat/jaggery on Sundays.',
    },
    Moon: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಸೋಮವಾರ ಶಿವಲಿಂಗಕ್ಕೆ ಕ್ಷೀರಾಭಿಷೇಕ, ಧ್ಯಾನ ಹಾಗೂ ಚಂದ್ರ ಮಂತ್ರ ("ಓಂ ಸೋಮಾಯ ನಮಃ") ಜಪಿಸಿ.'
        : 'ಶುಭ ಬಲ: ತಾಯಿಯ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ, ಬೆಳ್ಳಿ ಪಾತ್ರೆಯಲ್ಲಿ ನೀರು ಸೇವನೆ ಹಾಗೂ ಪೂರ್ಣಿಮೆಯಂದು ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ ಮಾಡಿ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: सोमवार को शिवलिंग पर दुग्धाभिषेक, ध्यान एवं "ॐ सोमाय नमः" का जप करें।'
        : 'शुभ बल: माता के चरण स्पर्श, चांदी के पात्र का उपयोग एवं पूर्णिमा व्रत शुभ फलदायी है।',
      en: isWeakOrDebilitated
        ? 'Remedy: Offer milk abhisheka to Shiva on Mondays, practice deep meditation, and chant "Om Somaya Namah".'
        : 'Harmonize: Seek mother\'s blessings, drink water from silver vessels, and celebrate Purnima with prayer.',
    },
    Mars: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಸುಬ್ರಹ್ಮಣ್ಯ ಅಥವಾ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ, ಮಂಗಳವಾರ ತೊಗರಿಬೇಳೆ ದಾನ ಹಾಗೂ ರಕ್ತದಾನ ಮಾಡಿ.'
        : 'ಶುಭ ಬಲ: ಶಾರೀರಿಕ ವ್ಯಾಯಾಮ, ಕ್ರೀಡೆ, ಸೋದರರಿಗೆ ಪ್ರೀತಿ ಹಾಗೂ ಹನುಮಂತನ ಸೇವೆ ಶಕ್ತಿವರ್ಧಕ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: हनुमान चालीसा या कार्तिकेय स्तोत्र का पाठ, मंगलवार को लाल मसूर का दान करें।'
        : 'शुभ बल: नियमित व्यायाम, भाइयों से सौहार्द एवं सुंदरकांड का पाठ साहस बढ़ाता है।',
      en: isWeakOrDebilitated
        ? 'Remedy: Recite Hanuman Chalisa or Kartikeya Stotra; donate red lentils or donate blood on Tuesdays.'
        : 'Harmonize: Maintain regular exercise, treat siblings with warmth, and venerate Lord Hanuman.',
    },
    Mercury: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಬುಧವಾರ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ, ಹಸಿರು ಹುಲ್ಲು ಅಥವಾ ಮೇವನ್ನು ಗೋವುಗಳಿಗೆ ನೀಡಿ.'
        : 'ಶುಭ ಬಲ: ತುಳಸಿ ಪೂಜೆ, ಹೊಸ ವಿದ್ಯೆಗಳ ಅಭ್ಯಾಸ ಹಾಗೂ ಬುಧ ಮಂತ್ರ ("ಓಂ ಬುಧಾಯ ನಮಃ") ಜಪಿಸಿ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: बुधवार को विष्णु सहस्रनाम पाठ एवं गायों को हरा चारा खिलाएं।'
        : 'शुभ बल: तुलसी सेवा, नई भाषाओं या गणित का अध्ययन एवं "ॐ बुधाय नमः" का जप करें।',
      en: isWeakOrDebilitated
        ? 'Remedy: Chant Vishnu Sahasranama on Wednesdays and feed green grass/spinach to cows.'
        : 'Harmonize: Water the Tulsi plant, cultivate intellectual study, and chant "Om Budhaya Namah".',
    },
    Jupiter: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಗುರುವಾರ ಗುರು ಚರಿತ್ರೆ ಪಠಣ, ದತ್ತಾತ್ರೇಯ/ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಆರಾಧನೆ ಹಾಗೂ ಕಡಲೆಕಾಳು ದಾನ ಮಾಡಿ.'
        : 'ಶುಭ ಬಲ: ಗುರು-ವಿದ್ವಾಂಸರಿಗೆ ವಂದನೆ, ಧರ್ಮಗ್ರಂಥಗಳ ಅಧ್ಯಯನ ಹಾಗೂ ಹಳದಿ ವಸ್ತ್ರ/ಹೂವು ಅರ್ಪಿಸಿ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: गुरुवार को गुरु चरित्र या दत्तात्रेय स्तोत्र पाठ एवं चने की दाल का दान करें।'
        : 'शुभ बल: गुरुजनों का सत्कार, धर्मशास्त्रों का स्वाध्याय एवं "ॐ बृहस्पतये नमः" का जप करें।',
      en: isWeakOrDebilitated
        ? 'Remedy: Chant Dattatreya or Raghavendra Stotra on Thursdays, and donate yellow chana dal to scholars.'
        : 'Harmonize: Honor your spiritual teachers, study sacred texts, and chant "Om Brihaspataye Namah".',
    },
    Venus: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಶುಕ್ರವಾರ ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ಅಷ್ಟಕ ಪಠಣ, ಬಿಳಿ ಹೂವು ಸಮರ್ಪಣೆ ಹಾಗೂ ಸಕ್ಕರೆ/ಅಕ್ಕಿ ದಾನ ಮಾಡಿ.'
        : 'ಶುಭ ಬಲ: ಸ್ತ್ರೀಯರಿಗೆ ಗೌರವ, ಸ್ವಚ್ಛತೆ, ಸುಗಂಧ ದ್ರವ್ಯಗಳ ಬಳಕೆ ಹಾಗೂ ಲಲಿತಾ ಸಹಸ್ರನಾಮ ಶ್ರವಣ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: शुक्रवार को महालक्ष्मी अष्टक पाठ एवं कन्याओं को खीर या मिश्री का दान करें।'
        : 'शुभ बल: नारी शक्ति का सम्मान, शुचिता, कला की साधना एवं "ॐ शुं शुक्राय नमः" का जप करें।',
      en: isWeakOrDebilitated
        ? 'Remedy: Recite Sri Mahalakshmi Ashtakam on Fridays; offer white flowers and donate rice/sugar to the needy.'
        : 'Harmonize: Respect women, maintain clean aesthetic surroundings, and chant "Om Shukraya Namah".',
    },
    Saturn: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ಶನಿವಾರ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ, ದಶರಥ ಕೃತ ಶನಿ ಸ್ತೋತ್ರ ಪಠಿಸಿ ಹಾಗೂ ಬಡವರಿಗೆ ಕಪ್ಪು ಎಳ್ಳು/ವಸ್ತ್ರ ದಾನ ಮಾಡಿ.'
        : 'ಶುಭ ಬಲ: ಶ್ರಮಿಕರಿಗೆ ಸಹಾಯ, ನಿಯಮಿತ ಶಿಸ್ತು, ಕರ್ತವ್ಯನಿಷ್ಠೆ ಹಾಗೂ ಹನುಮಾನ್ ಭಕ್ತಿ ಶನಿ ಕೃಪೆ ತರುತ್ತದೆ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: शनिवार को तिल के तेल का दीपक, दशरथ कृत शनि स्तोत्र पाठ एवं निर्धनों को भोजन कराएं।'
        : 'शुभ बल: श्रमजीवियों की सहायता, निष्ठावान कर्म एवं हनुमान जी की आराधना से शनि देव प्रसन्न होते हैं।',
      en: isWeakOrDebilitated
        ? 'Remedy: Light a sesame oil lamp on Saturdays, recite Dasharatha Shani Stotra, and feed underprivileged workers.'
        : 'Harmonize: Cultivate unswerving humility and discipline; sincere service to the elderly and needy pleases Shani.',
    },
    Rahu: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಠಣ, ರಾಹು ಕಾಲದಲ್ಲಿ ದುರ್ಗಾ ಪೂಜೆ ಹಾಗೂ ಕಪ್ಪು ಉದ್ದಿನ ಬೇಳೆ ದಾನ ಮಾಡಿ.'
        : 'ಶುಭ ಬಲ: ಸರಳತೆ ಪಾಲಿಸಿ, ದುಶ್ಚಟಗಳಿಂದ ದೂರವಿರಿ ಹಾಗೂ ಕಾಲಭೈರವ/ದುರ್ಗಾ ಆರಾಧನೆ ಮಾಡಿ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: दुर्गा सप्तशती का पाठ, राहुकाल में देवी पूजन एवं काले उड़द का दान करें।'
        : 'शुभ बल: सादगी, सदाचार एवं कालभैरव/दुर्गा जी की उपासना से मानसिक भ्रम दूर होता है।',
      en: isWeakOrDebilitated
        ? 'Remedy: Recite Durga Saptashati, worship Ma Durga during Rahu Kaal, and donate black urad dal.'
        : 'Harmonize: Maintain emotional honesty, avoid speculation, and pray to Lord Bhairava or Durga.',
    },
    Ketu: {
      kn: isWeakOrDebilitated
        ? 'ಪರಿಹಾರ: ನಿತ್ಯ ಸಂಕಷ್ಟನಾಶನ ಗಣೇಶ ಸ್ತೋತ್ರ ಪಠಣ, ಗಣಪತಿಗೆ ಗರಿಕೆ ಅರ್ಪಣೆ ಹಾಗೂ ನಾಯಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ.'
        : 'ಶುಭ ಬಲ: ಧ್ಯಾನ, ಆಧ್ಯಾತ್ಮಿಕ ಯಾತ್ರೆ, ಗಣೇಶ ಸಹಸ್ರನಾಮ ಜಪ ಹಾಗೂ ವೈರಾಗ್ಯ ಭಾವನೆ ಶ್ರೇಯಸ್ಕರ.',
      hi: isWeakOrDebilitated
        ? 'उपाय: नित्य संकट नाशन गणेश स्तोत्र का पाठ, दूर्वा अर्पण एवं श्वान (कुत्तों) को भोजन दें।'
        : 'शुभ बल: ध्यान, तीर्थयात्रा एवं गणेश जी की अनन्य भक्ति से आध्यात्मिक प्रज्ञा जागृत होती है।',
      en: isWeakOrDebilitated
        ? 'Remedy: Recite Sankata Nashana Ganesha Stotra, offer Durva grass to Lord Ganesha, and feed street dogs.'
        : 'Harmonize: Practice spiritual introspection, embrace detachment, and maintain steadfast devotion to Lord Ganesha.',
    },
  };

  return remedies[planetName] || remedies.Sun;
}
