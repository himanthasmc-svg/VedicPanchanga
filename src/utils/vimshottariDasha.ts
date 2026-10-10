import { Language, LocalizedString } from '../types';

export interface DashaLordInfo {
  name: string;
  sanskrit: LocalizedString;
  symbol: string;
  color: string;
  years: number;
  rulingPlanet: string;
  generalSignificance: LocalizedString;
  gemstone: LocalizedString;
  mantra: LocalizedString;
}

export const DASHA_LORDS: DashaLordInfo[] = [
  {
    name: 'Ketu',
    sanskrit: { en: 'Ketu (South Node)', kn: 'ಕೇತು', hi: 'केतु' },
    symbol: 'Ke',
    color: '#78716c',
    years: 7,
    rulingPlanet: 'Ketu',
    generalSignificance: {
      en: 'Spiritual detachment, introspection, occult wisdom, sudden transformations, and moksha aspiration.',
      kn: 'ಅಧ್ಯಾತ್ಮ ಸಾಧನೆ, ವೈರಾಗ್ಯ, ಆಂತರಿಕ ಪರಿವರ್ತನೆ, ಮೋಕ್ಷ ಚಿಂತನೆ ಹಾಗೂ ಹಠಾತ್ ಘಟನೆಗಳು.',
      hi: 'अध्यात्म, वैराग्य, आत्मचिंतन, गूढ़ विद्या एवं मोक्ष की प्रेरणा।'
    },
    gemstone: { en: "Cat's Eye (Vaidurya)", kn: 'ವೈಡೂರ್ಯ', hi: 'लहसुनिया' },
    mantra: { en: 'Om Kem Ketave Namah', kn: 'ಓಂ ಕೇಂ ಕೇತವೇ ನಮಃ', hi: 'ॐ कें केतवे नमः' }
  },
  {
    name: 'Venus',
    sanskrit: { en: 'Shukra (Venus)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    symbol: 'Ve',
    color: '#ec4899',
    years: 20,
    rulingPlanet: 'Venus',
    generalSignificance: {
      en: 'Artistic creativity, romance, marriage, prosperity, vehicle acquisition, luxury, and social magnetism.',
      kn: 'ಕಲಾತ್ಮಕತೆ, ಪ್ರೇಮ, ವಿವಾಹ ಯೋಗ, ಭೌತಿಕ ಸುಖ-ಸಂಪತ್ತು, ವಾಹನ ಲಾಭ ಹಾಗೂ ಸಾಮಾಜಿಕ ಗೌರವ.',
      hi: 'कला, प्रेम, विवाह, भौतिक सुख-सम्पत्ति, वाहन लाभ एवं ऐश्वर्य।'
    },
    gemstone: { en: 'Diamond (Heera) / White Zircon', kn: 'ವಜ್ರ / ಬಿಳಿ ಜಿರ್ಕಾನ್', hi: 'हीरा / श्वेत जरकन' },
    mantra: { en: 'Om Shum Shukraya Namah', kn: 'ಓಂ ಶುಂ ಶುಕ್ರಾಯ ನಮಃ', hi: 'ॐ शुं शुक्राय नमः' }
  },
  {
    name: 'Sun',
    sanskrit: { en: 'Surya (Sun)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    symbol: 'Su',
    color: '#f59e0b',
    years: 6,
    rulingPlanet: 'Sun',
    generalSignificance: {
      en: 'Vitality, leadership authority, career ascension, government recognition, fatherly blessings, and self-confidence.',
      kn: 'ಆತ್ಮಬಲ, ರಾಜಕೀಯ/ಆಡಳಿತ ಅಧಿಕಾರ, ಉದ್ಯೋಗೋನ್ನತಿ, ಕೀರ್ತಿ, ತಂದೆಯ ಆಶೀರ್ವಾದ.',
      hi: 'आत्मबल, नेतृत्व, पदोन्नति, राजकीय सम्मान, पितृ कृपा एवं तेजस्विता।'
    },
    gemstone: { en: 'Ruby (Manikya)', kn: 'ಮಾಣಿಕ್ಯ', hi: 'माणिक्य' },
    mantra: { en: 'Om Hram Hreem Hroum Sah Suryaya Namah', kn: 'ಓಂ ಹ್ರಾಂ ಹ್ರೀಂ ಸ್ರೌಂ ಸಃ ಸೂರ್ಯಾಯ ನಮಃ', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' }
  },
  {
    name: 'Moon',
    sanskrit: { en: 'Chandra (Moon)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    symbol: 'Mo',
    color: '#06b6d4',
    years: 10,
    rulingPlanet: 'Moon',
    generalSignificance: {
      en: 'Emotional peace, travel, domestic happiness, maternal blessings, public popularity, and intuitive imagination.',
      kn: 'ಮನಃಶಾಂತಿ, ತಾಯಿಯ ಸುಖ, ಜನಪ್ರಿಯತೆ, ಪ್ರಯಾಣ ಯೋಗ, ಕಲ್ಪನಾ ಶಕ್ತಿ ಮತ್ತು ಭಾವನಾತ್ಮಕ ನೆಮ್ಮದಿ.',
      hi: 'मानसिक शान्ति, मातृ सुख, जनप्रियता, यात्रा एवं सौम्यता।'
    },
    gemstone: { en: 'Pearl (Moti)', kn: 'ಮುತ್ತು', hi: 'मोती' },
    mantra: { en: 'Om Shram Shreem Shroum Sah Chandraya Namah', kn: 'ಓಂ ಶ್ರಾಂ ಶ್ರೀಂ ಶ್ರೌಂ ಸಃ ಚಂದ್ರಾಯ ನಮಃ', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः' }
  },
  {
    name: 'Mars',
    sanskrit: { en: 'Mangala (Mars)', kn: 'ಮಂಗಳ (ಕುಜ)', hi: 'मंगल' },
    symbol: 'Ma',
    color: '#ef4444',
    years: 7,
    rulingPlanet: 'Mars',
    generalSignificance: {
      en: 'Physical courage, real estate / land acquisition, sibling relations, competitive triumphs, and technical prowess.',
      kn: 'ಶೌರ್ಯ, ಭೂಮಿ/ಆಸ್ತಿ ಸಂಪಾದನೆ, ಸಾಹಸ, ಸಹೋದರರ ನೆರವು, ಸ್ಪರ್ಧಾ ವಿಜಯ.',
      hi: 'शौर्य, भूमि/सम्पत्ति लाभ, पराक्रम, भ्रातृ सुख एवं विजय।'
    },
    gemstone: { en: 'Red Coral (Moonga)', kn: 'ಹವಳ', hi: 'मूंगा' },
    mantra: { en: 'Om Kram Kreem Kroum Sah Bhaumaya Namah', kn: 'ಓಂ ಕ್ರಾಂ ಕ್ರೀಂ ಕ್ರೌಂ ಸಃ ಭೌಮಾಯ ನಮಃ', hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' }
  },
  {
    name: 'Rahu',
    sanskrit: { en: 'Rahu (North Node)', kn: 'ರಾಹು', hi: 'राहु' },
    symbol: 'Ra',
    color: '#6366f1',
    years: 18,
    rulingPlanet: 'Rahu',
    generalSignificance: {
      en: 'Foreign journeys, groundbreaking innovation, unconventional gains, worldly ambitions, and unexpected shifts.',
      kn: 'ವಿದೇಶ ಪ್ರಯಾಣ, ಆಕಸ್ಮಿಕ ಲಾಭ, ತಂತ್ರಜ್ಞಾನ ಯಶಸ್ಸು, ಲೌಕಿಕ ಮಹತ್ವಾಕಾಂಕ್ಷೆ.',
      hi: 'विदेश गमन, आकस्मिक सफलता, तकनीकी उन्नति एवं महत्त्वाकांक्षा।'
    },
    gemstone: { en: 'Hessonite (Gomed)', kn: 'ಗೋಮೇಧಿಕ', hi: 'गोमेद' },
    mantra: { en: 'Om Bhram Bhreem Bhroum Sah Rahave Namah', kn: 'ಓಂ ಭ್ರಾಂ ಭ್ರೀಂ ಭ್ರೌಂ ಸಃ ರಾಹವೇ ನಮಃ', hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः' }
  },
  {
    name: 'Jupiter',
    sanskrit: { en: 'Guru (Jupiter)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'बृहस्पति (गुरु)' },
    symbol: 'Ju',
    color: '#eab308',
    years: 16,
    rulingPlanet: 'Jupiter',
    generalSignificance: {
      en: 'Wisdom, progeny happiness, spiritual teacher grace, financial abundance, dharmic deeds, and scholastic prestige.',
      kn: 'ಜ್ಞಾನ, ಸಂತಾನ ಸುಖ, ಗುರುಕೃಪೆ, ಧನ ಸಮೃದ್ಧಿ, ಧರ್ಮ ಕಾರ್ಯಗಳು ಹಾಗೂ ವಿದ್ವತ್ತು.',
      hi: 'ज्ञान, सन्तान सुख, गुरु कृपा, धन-ऐश्वर्य, धार्मिक कार्य एवं सम्मान।'
    },
    gemstone: { en: 'Yellow Sapphire (Pukhraj)', kn: 'ಪುಷ್ಯರಾಗ', hi: 'पुखराज' },
    mantra: { en: 'Om Gram Greem Groum Sah Gurave Namah', kn: 'ಓಂ ಗ್ರಾಂ ಗ್ರೀಂ ಗ್ರೌಂ ಸಃ ಗುರವೇ ನಮಃ', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' }
  },
  {
    name: 'Saturn',
    sanskrit: { en: 'Shani (Saturn)', kn: 'ಶನಿ', hi: 'शनि' },
    symbol: 'Sa',
    color: '#3b82f6',
    years: 19,
    rulingPlanet: 'Saturn',
    generalSignificance: {
      en: 'Discipline, enduring patience, karmic justice, longevity, foundation building, and hard-earned mastery.',
      kn: 'ಶಿಸ್ತು, ಸಂಯಮ, ಕರ್ಮಫಲ ಸಿದ್ಧಿ, ದೀರ್ಘಾಯುಷ್ಯ, ಕಠಿಣ ಪರಿಶ್ರಮದಿಂದ ಶಾಶ್ವತ ಯಶಸ್ಸು.',
      hi: 'अनुशासन, धैर्य, कर्मफल, दीर्घायु, स्थिर सफलता एवं तपस्या।'
    },
    gemstone: { en: 'Blue Sapphire (Neelam)', kn: 'ನೀಲಮಣಿ', hi: 'नीलम' },
    mantra: { en: 'Om Pram Preem Proum Sah Shanaischaraya Namah', kn: 'ಓಂ ಪ್ರಾಂ ಪ್ರೀಂ ಪ್ರೌಂ ಸಃ ಶನೈಶ್ಚರಾಯ ನಮಃ', hi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' }
  },
  {
    name: 'Mercury',
    sanskrit: { en: 'Budha (Mercury)', kn: 'ಬುಧ', hi: 'बुध' },
    symbol: 'Me',
    color: '#10b981',
    years: 17,
    rulingPlanet: 'Mercury',
    generalSignificance: {
      en: 'Intellect, commerce, eloquence, diplomatic communication, analytical studies, and versatile networking.',
      kn: 'ಬುದ್ಧಿಶಕ್ತಿ, ವ್ಯಾಪಾರ-ವ್ಯವಹಾರ, ವಾಕ್ಚಾತುರ್ಯ, ಗಣಿತ, ಸಂವಹನ ಕಲೆ ಮತ್ತು ಅಧ್ಯಯನ.',
      hi: 'बुद्धि, व्यापार, वाक्चातुर्य, विद्या, संचार कला एवं विवेक।'
    },
    gemstone: { en: 'Emerald (Panna)', kn: 'ಪಚ್ಚೆ', hi: 'पन्ना' },
    mantra: { en: 'Om Bram Breem Broum Sah Budhaya Namah', kn: 'ಓಂ ಬ್ರಾಂ ಬ್ರೀಂ ಬ್ರೌಂ ಸಃ ಬುಧಾಯ ನಮಃ', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' }
  }
];

export interface AntardashaPeriod {
  lord: DashaLordInfo;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  isCurrent: boolean;
  intensityScore: number; // 0 to 100 for Recharts visualization
}

export interface MahadashaPeriod {
  lord: DashaLordInfo;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
  antardashas: AntardashaPeriod[];
  currentAntardasha?: AntardashaPeriod;
  intensityScore: number; // 0 to 100
}

export interface VimshottariDashaResult {
  birthNakshatraIndex: number;
  birthNakshatraLord: DashaLordInfo;
  balanceYearsAtBirth: number;
  mahadashas: MahadashaPeriod[];
  currentMahadasha: MahadashaPeriod;
  currentAntardasha: AntardashaPeriod;
  chartData: Array<{
    periodName: string;
    lord: string;
    intensity: number;
    yearStart: number;
    yearEnd: number;
    isActive: boolean;
  }>;
}

/**
 * Calculates accurate Vimshottari Dasha periods starting from birth moon position
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonSiderealLongitude: number
): VimshottariDashaResult {
  // 27 Nakshatras: 13°20' each = 13.333333 degrees
  const nakshatraSpan = 360 / 27; // 13.33333333
  const rawNakIndex = Math.floor(moonSiderealLongitude / nakshatraSpan) % 27;
  const nakshatraIndex = (rawNakIndex + 27) % 27;

  // The 9 lords sequence repeats every 9 nakshatras:
  // 0: Ashwini -> Ketu (0)
  // 1: Bharani -> Venus (1)
  // ...
  const lordIndex = nakshatraIndex % 9;
  const firstLord = DASHA_LORDS[lordIndex];

  // Fraction of nakshatra elapsed
  const degPassedInNak = moonSiderealLongitude % nakshatraSpan;
  const fractionElapsed = degPassedInNak / nakshatraSpan;
  const fractionRemaining = Math.max(0.01, 1 - fractionElapsed);

  // Balance of initial Mahadasha at birth
  const initialBalanceYears = firstLord.years * fractionRemaining;

  const mahadashas: MahadashaPeriod[] = [];
  let currentDate = new Date(birthDate);
  const now = new Date();

  // Generate a full 120-year cycle across 9 lords starting with the first lord
  for (let i = 0; i < 9; i++) {
    const currentLordIndex = (lordIndex + i) % 9;
    const lord = DASHA_LORDS[currentLordIndex];
    const durationYears = i === 0 ? initialBalanceYears : lord.years;

    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + Math.round(durationYears * 365.25));

    // Antardashas within this Mahadasha
    const antardashas: AntardashaPeriod[] = [];
    let subStart = new Date(startDate);

    for (let j = 0; j < 9; j++) {
      const subLordIndex = (currentLordIndex + j) % 9;
      const subLord = DASHA_LORDS[subLordIndex];
      // Formula: (MahaYears * AntarYears) / 120
      const antarYears = (lord.years * subLord.years) / 120;
      // Pro-rate if first lord is partial
      const effectiveYears = i === 0 ? (antarYears * (initialBalanceYears / lord.years)) : antarYears;
      const subEnd = new Date(subStart);
      subEnd.setDate(subEnd.getDate() + Math.round(effectiveYears * 365.25));

      const isSubCurrent = now >= subStart && now <= subEnd;

      // Base intensity based on natural benefic/malefic harmony
      const intensity = Math.round(
        45 + (subLord.years / 20) * 35 + (subLord.name === 'Jupiter' || subLord.name === 'Venus' ? 18 : 5)
      );

      antardashas.push({
        lord: subLord,
        startDate: new Date(subStart),
        endDate: new Date(subEnd),
        durationMonths: Math.round(effectiveYears * 12),
        isCurrent: isSubCurrent,
        intensityScore: Math.min(100, Math.max(20, intensity))
      });

      subStart = new Date(subEnd);
    }

    const isCurrent = now >= startDate && now <= endDate;
    const curAntar = antardashas.find(a => a.isCurrent) || antardashas[0];

    const mahaIntensity = Math.round(
      50 + (lord.years / 20) * 30 + (lord.name === 'Jupiter' || lord.name === 'Venus' || lord.name === 'Mercury' ? 15 : 0)
    );

    mahadashas.push({
      lord,
      startDate,
      endDate,
      durationYears: Number(durationYears.toFixed(2)),
      isCurrent,
      antardashas,
      currentAntardasha: curAntar,
      intensityScore: Math.min(100, Math.max(25, mahaIntensity))
    });

    currentDate = new Date(endDate);
  }

  const currentMahadasha = mahadashas.find(m => m.isCurrent) || mahadashas[0];
  const currentAntardasha = currentMahadasha.currentAntardasha || currentMahadasha.antardashas[0];

  // Recharts chart data
  const chartData = mahadashas.map(m => ({
    periodName: `${m.lord.name} Dasha`,
    lord: m.lord.name,
    intensity: m.intensityScore,
    yearStart: m.startDate.getFullYear(),
    yearEnd: m.endDate.getFullYear(),
    isActive: m.isCurrent
  }));

  return {
    birthNakshatraIndex: nakshatraIndex,
    birthNakshatraLord: firstLord,
    balanceYearsAtBirth: Number(initialBalanceYears.toFixed(2)),
    mahadashas,
    currentMahadasha,
    currentAntardasha,
    chartData
  };
}
