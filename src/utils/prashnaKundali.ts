import { CityLocation, KundaliData, Language, LocalizedString } from '../types';
import { calculateKundali } from './panchanga';

export interface PrashnaCategory {
  id: string;
  name: LocalizedString;
  karakaPlanet: string;
  primaryHouse: number;
  description: LocalizedString;
}

export const PRASHNA_CATEGORIES: PrashnaCategory[] = [
  {
    id: 'career',
    name: { en: 'Career / Job / Promotion', kn: 'ಉದ್ಯೋಗ & ರಾಜಕಾರ್ಯ (Career)', hi: 'नौकरी एवं व्यवसाय' },
    karakaPlanet: 'Sun',
    primaryHouse: 10,
    description: { en: 'Inquiry regarding job interview, promotion, new venture, or work changes.', kn: 'ಉದ್ಯೋಗ ಪ್ರಾಪ್ತಿ, ಬಡ್ತಿ, ಅಥವಾ ಹೊಸ ಉದ್ಯಮದ ಯಶಸ್ಸು.', hi: 'पदोन्नति, नई नौकरी अथवा व्यवसाय की सफलता।' }
  },
  {
    id: 'marriage',
    name: { en: 'Marriage / Proposal / Union', kn: 'ವಿವಾಹ & ಕಂಕಣ ಭಾಗ್ಯ (Marriage)', hi: 'विवाह एवं सम्बन्ध' },
    karakaPlanet: 'Venus',
    primaryHouse: 7,
    description: { en: 'Inquiry regarding marriage alliance, proposals, harmony, or partner.', kn: 'ವಿವಾಹ ಸಂಬಂಧ ಕೂಡಿಬರುವಿಕೆ, ಪ್ರೇಮ ಅಥವಾ ಕಂಕಣ ಭಾಗ್ಯದ ಸಮಯ.', hi: 'विवाह प्रस्ताव, जीवनसाथी एवं वैवाहिक योग।' }
  },
  {
    id: 'health',
    name: { en: 'Health & Illness Recovery', kn: 'ಆರೋಗ್ಯ & ರೋಗ ನಿವಾರಣೆ (Health)', hi: 'स्वास्थ्य एवं रोग मुक्ति' },
    karakaPlanet: 'Sun',
    primaryHouse: 1,
    description: { en: 'Inquiry regarding disease recovery, medical diagnosis, or surgery outcome.', kn: 'ಅನಾರೋಗ್ಯದಿಂದ ಗುಣಮುಖತೆ, ಚಿಕಿತ್ಸೆ ಮತ್ತು ಆಯುಷ್ಯ ಬಲ.', hi: 'स्वास्थ्य लाभ, रोग निदान अथवा शल्यक्रिया फल।' }
  },
  {
    id: 'wealth',
    name: { en: 'Wealth & Financial Growth', kn: 'ಧನ ಪ್ರಾಪ್ತಿ & ಹಣಕಾಸು (Wealth)', hi: 'धन लाभ एवं आर्थिक स्थिति' },
    karakaPlanet: 'Jupiter',
    primaryHouse: 2,
    description: { en: 'Inquiry regarding monetary inflow, debt clearance, investments, or profits.', kn: 'ಆರ್ಥಿಕ ಸಂಕಷ್ಟ ನಿವಾರಣೆ, ಲಾಭಾಂಶ, ಸಾಲ ಮುಕ್ತಿ ಹಾಗೂ ಧನಾಗಮನ.', hi: 'ऋण मुक्ति, धन प्राप्ति एवं व्यापारिक लाभ।' }
  },
  {
    id: 'lost_item',
    name: { en: 'Lost Item / Missing Article', kn: 'ಕಳೆದುಹೋದ ವಸ್ತು (Lost Article)', hi: 'खोई हुई वस्तु की प्राप्ति' },
    karakaPlanet: 'Mercury',
    primaryHouse: 4,
    description: { en: 'Inquiry whether a misplaced article, document, or treasure will be found.', kn: 'ಕಳೆದುಹೋದ ಅಮೂಲ್ಯ ವಸ್ತು, ಕಾಗದಪತ್ರ ಅಥವಾ ಹಣ ಮರಳಿ ದೊರೆಯುವುದೇ?', hi: 'गुम हुई वस्तु अथवा दस्तावेज पुनः मिलने का योग।' }
  },
  {
    id: 'litigation',
    name: { en: 'Litigation / Court Dispute', kn: 'ನ್ಯಾಯಾಲಯ & ವಿವಾದ ಜಯ (Litigation)', hi: 'मुकदमा एवं विवाद में विजय' },
    karakaPlanet: 'Mars',
    primaryHouse: 6,
    description: { en: 'Inquiry regarding court cases, disputes, enemies, or legal settlements.', kn: 'ಕೋರ್ಟ್ ಕೇಸು, ಶತ್ರು ಬಾಧೆ ನಿವಾರಣೆ ಹಾಗೂ ವ್ಯಾಜ್ಯದಲ್ಲಿ ವಿಜಯ.', hi: 'न्यायालयीन विवाद, शत्रु विजय एवं समझौता।' }
  },
  {
    id: 'travel',
    name: { en: 'Travel & Foreign Relocation', kn: 'ಪ್ರವಾಸ & ವಿದೇಶ ಯಾತ್ರೆ (Travel)', hi: 'विदेश यात्रा एवं स्थान परिवर्तन' },
    karakaPlanet: 'Moon',
    primaryHouse: 9,
    description: { en: 'Inquiry regarding overseas travel, visa, pilgrimage, or relocation.', kn: 'ವಿದೇಶ ಪ್ರಯಾಣ, ವೀಸಾ, ತೀರ್ಥಯಾತ್ರೆ ಅಥವಾ ಸ್ಥಳ ಬದಲಾವಣೆ.', hi: 'तीर्थ यात्रा, विदेश गमन अथवा वीजा प्राप्ति योग।' }
  },
  {
    id: 'education',
    name: { en: 'Education & Examinations', kn: 'ವಿದ್ಯಾಭ್ಯಾಸ & ಪರೀಕ್ಷಾ ಜಯ (Education)', hi: 'शिक्षा एवं प्रतियोगी परीक्षा' },
    karakaPlanet: 'Jupiter',
    primaryHouse: 5,
    description: { en: 'Inquiry regarding competitive exams, university admission, or study focus.', kn: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆ, ಪ್ರವೇಶ ಪರೀಕ್ಷೆ ಹಾಗೂ ಉನ್ನತ ವಿದ್ಯಾಭ್ಯಾಸದ ಫಲ.', hi: 'परीक्षा फल, प्रवेश एवं उच्च विद्या योग।' }
  }
];

export interface PrashnaJudgmentResult {
  kundaliData: KundaliData;
  category: PrashnaCategory;
  prashnaLagnaName: LocalizedString;
  prashnaLagnaDegree: number;
  lagnaNature: LocalizedString; // Movable / Fixed / Dual
  lagnaLordName: LocalizedString;
  lagnaLordHouse: number;
  moonRashiName: LocalizedString;
  moonNakshatraName: LocalizedString;
  moonHouse: number;
  karakaPlanetName: LocalizedString;
  karakaHouse: number;
  verdictScore: number;
  verdictLevel: 'karyasiddhi' | 'delayed' | 'difficult';
  verdictTitle: LocalizedString;
  verdictColor: string;
  timeline: LocalizedString;
  astrologicalReasoning: LocalizedString[];
  remedialAdvice: LocalizedString;
}

const RASHI_NATURE = [
  { en: 'Movable (Chara - Fast Outcome)', kn: 'ಚರ ರಾಶಿ (ಶೀಘ್ರ ಫಲ)', hi: 'चर राशि (शीघ्र फल)' }, // Mesha
  { en: 'Fixed (Sthira - Lasting Outcome)', kn: 'ಸ್ಥಿರ ರಾಶಿ (ಸ್ಥಿರ ಫಲ)', hi: 'स्थिर राशि (स्थिर फल)' }, // Vrishabha
  { en: 'Dual (Dwiswabhava - Fluctuating)', kn: 'ದ್ವಿಸ್ವಭಾವ ರಾಶಿ (ಮಿಶ್ರ ಫಲ)', hi: 'द्विस्वभाव राशि (मिश्र फल)' }, // Mithuna
  { en: 'Movable (Chara - Fast Outcome)', kn: 'ಚರ ರಾಶಿ (ಶೀಘ್ರ ಫಲ)', hi: 'चर राशि (शीघ्र फल)' }, // Karka
  { en: 'Fixed (Sthira - Lasting Outcome)', kn: 'ಸ್ಥಿರ ರಾಶಿ (ಸ್ಥಿರ ಫಲ)', hi: 'स्थिर राशि (स्थिर फल)' }, // Simha
  { en: 'Dual (Dwiswabhava - Fluctuating)', kn: 'ದ್ವಿಸ್ವಭಾವ ರಾಶಿ (ಮಿಶ್ರ ಫಲ)', hi: 'द्विस्वभाव राशि (मिश್ರ ಫಲ)' }, // Kanya
  { en: 'Movable (Chara - Fast Outcome)', kn: 'ಚರ ರಾಶಿ (ಶೀಘ್ರ ಫಲ)', hi: 'चर राशि (शीघ्र ಫಲ)' }, // Tula
  { en: 'Fixed (Sthira - Lasting Outcome)', kn: 'ಸ್ಥಿರ ರಾಶಿ (ಸ್ಥಿರ ಫಲ)', hi: 'स्थಿರ ರಾಶಿ (ಸ್ಥಿರ ಫಲ)' }, // Vrishchika
  { en: 'Dual (Dwiswabhava - Fluctuating)', kn: 'ದ್ವಿಸ್ವಭಾವ ರಾಶಿ (ಮಿಶ್ರ ಫಲ)', hi: 'ದ್ವಿಸ್ವಭಾವ' }, // Dhanu
  { en: 'Movable (Chara - Fast Outcome)', kn: 'ಚರ ರಾಶಿ (ಶೀಘ್ರ ಫಲ)', hi: 'चर राशि' }, // Makara
  { en: 'Fixed (Sthira - Lasting Outcome)', kn: 'ಸ್ಥಿರ ರಾಶಿ (ಸ್ಥಿರ ಫಲ)', hi: 'स्थिर राशि' }, // Kumbha
  { en: 'Dual (Dwiswabhava - Fluctuating)', kn: 'ದ್ವಿಸ್ವಭಾವ ರಾಶಿ (ಮಿಶ್ರ ಫಲ)', hi: 'द्विस्वभाव राशि' } // Meena
];

const RASHI_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

export function calculatePrashnaKundali(
  dateIsoStr: string,
  city: CityLocation,
  categoryId: string = 'career'
): PrashnaJudgmentResult {
  const kundali = calculateKundali(dateIsoStr, city);
  const category = PRASHNA_CATEGORIES.find(c => c.id === categoryId) || PRASHNA_CATEGORIES[0];

  const lagnaRashiIdx = kundali.lagnaRashiIndex;
  const lagnaNature = RASHI_NATURE[lagnaRashiIdx] || RASHI_NATURE[0];
  const lagnaLord = RASHI_LORDS[lagnaRashiIdx];

  const lagnaLordPlanet = kundali.planets.find(p => p.name === lagnaLord) || kundali.planets[0];
  const moonPlanet = kundali.planets.find(p => p.name === 'Moon') || kundali.planets[1];
  const karakaPlanet = kundali.planets.find(p => p.name === category.karakaPlanet) || kundali.planets[0];

  const reasons: LocalizedString[] = [];
  let score = 50;

  // 1. Lagna Nature Evaluation
  if (category.id === 'lost_item' || category.id === 'marriage') {
    if ([1, 4, 7, 10].includes(lagnaRashiIdx)) {
      score += 10;
      reasons.push({
        en: `Prashna Lagna is in a Fixed or Kendra Sign (${kundali.houses[0].rashiName.en}), promoting stability and recovery.`,
        kn: `ಪ್ರಶ್ನ ಲಗ್ನವು ಸ್ಥಿರ ಅಥವಾ ಕೇಂದ್ರ ರಾಶಿಯಲ್ಲಿದ್ದು (${kundali.houses[0].rashiName.kn}), ಕಾರ್ಯದಲ್ಲಿ ಸ್ಥಿರತೆ ಹಾಗೂ ಸಕಾರಾತ್ಮಕತೆಯನ್ನು ನೀಡುತ್ತದೆ.`,
        hi: `प्रश्न लग्न स्थिर एवं केन्द्र में होने से स्थिरता का योग बनता है।`
      });
    }
  } else if ([0, 3, 6, 9].includes(lagnaRashiIdx)) {
    score += 10;
    reasons.push({
      en: `Movable Ascendant indicates rapid movement and speedy resolution for ${category.name.en}.`,
      kn: `ಚರ ಲಗ್ನವಾಗಿದ್ದು, ಪ್ರಶ್ನಿಸಿದ ಕಾರ್ಯವು ಶೀಘ್ರವಾಗಿ ಚಲನೆ ಪಡೆದು ತೀರ್ಮಾನವಾಗುತ್ತದೆ.`,
      hi: `चर लग्न होने से कार्य में त्वरित प्रगति एवं शीघ्र निर्णय होगा।`
    });
  }

  // 2. Lagna Lord Placement
  if ([1, 4, 7, 10, 5, 9, 11].includes(lagnaLordPlanet.bhava)) {
    score += 20;
    reasons.push({
      en: `Lagna Lord ${lagnaLord} sits in auspicious House ${lagnaLordPlanet.bhava}, bestowing divine strength (Karyasiddhi).`,
      kn: `ಲಗ್ನಾಧಿಪತಿ ${lagnaLord} ಗ್ರಹವು ಶುಭ ಸ್ಥಾನವಾದ ${lagnaLordPlanet.bhava}ನೇ ಮನೆಯಲ್ಲಿದ್ದು, ಕಾರ್ಯಸಿದ್ಧಿ ಬಲವನ್ನು ಹೆಚ್ಚಿಸಿದೆ.`,
      hi: `लग्नेश शुभ भाव (${lagnaLordPlanet.bhava}) में स्थित होकर कार्यसिद्धि का योग बनाता है।`
    });
  } else if ([6, 8, 12].includes(lagnaLordPlanet.bhava)) {
    score -= 20;
    reasons.push({
      en: `Lagna Lord in Dusthana House ${lagnaLordPlanet.bhava} indicates obstacles and need for dedicated remedy.`,
      kn: `ಲಗ್ನಾಧಿಪತಿಯು ದುಸ್ಥಾನವಾದ ${lagnaLordPlanet.bhava}ನೇ ಮನೆಯಲ್ಲಿದ್ದು, ಆರಂಭದಲ್ಲಿ ತೊಡಕುಗಳು ಎದುರಾಗಬಹುದು.`,
      hi: `लग्नेश त्रिक भाव में स्थित होने से प्रारंभिक अड़चनें संभव हैं।`
    });
  }

  // 3. Moon (Chandra) Disposition (Mind of the Question)
  if ([3, 6, 10, 11].includes(moonPlanet.bhava)) {
    score += 15;
    reasons.push({
      en: `Chandra (Moon) in Upachaya House ${moonPlanet.bhava} signifies gradual victory and successful fruition.`,
      kn: `ಚಂದ್ರನು ಉಪಚಯ ಸ್ಥಾನವಾದ ${moonPlanet.bhava}ನೇ ಮನೆಯಲ್ಲಿದ್ದು, ಪ್ರಯತ್ನಕ್ಕೆ ತಕ್ಕಂತೆ ಜಯ ಲಭಿಸುತ್ತದೆ.`,
      hi: `चन्द्रमा उपचय भाव में होने से सतत प्रयास से विजय प्राप्त होगी।`
    });
  } else if ([8, 12].includes(moonPlanet.bhava)) {
    score -= 15;
    reasons.push({
      en: `Moon in House ${moonPlanet.bhava} signifies mental anxiety, doubts, or procedural delays.`,
      kn: `ಚಂದ್ರನು ${moonPlanet.bhava}ನೇ ಮನೆಯಲ್ಲಿದ್ದು, ಆತಂಕ ಮತ್ತು ವಿಳಂಬವನ್ನು ಸೂಚಿಸುತ್ತದೆ.`,
      hi: `चन्द्रमा के प्रतिकूल भाव में होने से मानसिक असमंजस का संकेत है।`
    });
  }

  // 4. Karaka & House Connection
  if ([1, 4, 7, 10, 5, 9, 11].includes(karakaPlanet.bhava)) {
    score += 15;
    reasons.push({
      en: `Karaka Planet (${category.karakaPlanet}) is strong in House ${karakaPlanet.bhava}, supporting favorable fruit.`,
      kn: `ಕಾರಕ ಗ್ರಹವಾದ ${category.karakaPlanet} ಬಲಿಷ್ಠ ಸ್ಥಾನದಲ್ಲಿದ್ದು, ಪ್ರಶ್ನಿತ ವಿಷಯದಲ್ಲಿ ಭರವಸೆ ಮೂಡಿಸುತ್ತದೆ.`,
      hi: `कारक ग्रह शुभ भाव में होकर अनुकूल परिणाम का संकेत दे रहा है।`
    });
  }

  // Clamp Score
  score = Math.max(15, Math.min(95, score));

  let verdictLevel: 'karyasiddhi' | 'delayed' | 'difficult' = 'delayed';
  let verdictTitle: LocalizedString;
  let verdictColor = '#f59e0b';
  let timeline: LocalizedString;

  if (score >= 70) {
    verdictLevel = 'karyasiddhi';
    verdictColor = '#10b981';
    verdictTitle = {
      en: 'Karyasiddhi — Highly Favorable (Success Guaranteed)',
      kn: 'ಕಾರ್ಯಸಿದ್ಧಿ — ಅತ್ಯಂತ ಶುಭ (ಯಶಸ್ಸು ಖಚಿತ)',
      hi: 'कार्यसिद्धि — परम शुभ (सफलता निश्चित)'
    };
    timeline = {
      en: 'Expected resolution within 7 to 21 days (or by next Shukla Paksha).',
      kn: '೭ ರಿಂದ ೨೧ ದಿನಗಳೊಳಗೆ (ಅಥವಾ ಮುಂದಿನ ಶುಕ್ಲ ಪಕ್ಷದೊಳಗೆ) ಶುಭ ಫಲ ದೊರೆಯುತ್ತದೆ.',
      hi: '७ से २१ दिनों के भीतर शुभ फल प्राप्त होगा।'
    };
  } else if (score >= 45) {
    verdictLevel = 'delayed';
    verdictColor = '#f59e0b';
    verdictTitle = {
      en: 'Delayed Success — Favorable with Persistence & Effort',
      kn: 'ವಿಳಂಬದ ನಂತರ ಯಶಸ್ಸು — ನಿರಂತರ ಶ್ರಮದಿಂದ ಶುಭ ಫಲ',
      hi: 'विलम्ब से सफलता — धैर्य एवं यत्न से कार्य पूर्ण'
    };
    timeline = {
      en: 'Expected resolution within 1 to 3 months with proper follow-up.',
      kn: '೧ ರಿಂದ ೩ ತಿಂಗಳುಗಳೊಳಗೆ ಪ್ರಯತ್ನ ಬಲದಿಂದ ಕಾರ್ಯ ಸಫಲವಾಗುತ್ತದೆ.',
      hi: '१ से ३ माह में धैर्यपूर्वक प्रयास से फल प्राप्त होगा।'
    };
  } else {
    verdictLevel = 'difficult';
    verdictColor = '#ef4444';
    verdictTitle = {
      en: 'Obstacles Indicated — Requires Remedy & Caution',
      kn: 'ತೊಡಕುಗಳಿವೆ — ಶಾಂತಿ ಪೂಜೆ ಮತ್ತು ಜಾಗರೂಕತೆ ಅತ್ಯಗತ್ಯ',
      hi: 'कठिनाइयां संभव — शान्ति एवं सतर्कता आवश्यक'
    };
    timeline = {
      en: 'Outcome delayed; re-attempt after remedial prayers or 45+ days.',
      kn: 'ಸದ್ಯಕ್ಕೆ ವಿಳಂಬ; ಪರಿಹಾರ ಪೂಜೆಯ ನಂತರ ೪೫ ದಿನಗಳ ಮೇಲೆ ಮರುಪ್ರಯತ್ನಿಸಿ.',
      hi: 'तत्काल फल में बाधा; शान्ति उपरान्त ४५ दिनों बाद अनुकूलता।'
    };
  }

  const remedialAdvice: LocalizedString = {
    en: `Offer prayers to ${category.karakaPlanet === 'Jupiter' ? 'Guru Raghavendra / Dattatreya' : category.karakaPlanet === 'Venus' ? 'Goddess Mahalakshmi' : category.karakaPlanet === 'Mars' ? 'Lord Subramanya / Hanuman' : 'Lord Shiva'}. Donate food on Wednesday or Friday to activate Karyasiddhi energy.`,
    kn: `ಇಷ್ಟದೇವತೆಗೆ ಪ್ರಾರ್ಥನೆ ಸಲ್ಲಿಸಿ; ಸಂಕಲ್ಪ ಪೂರ್ವಕವಾಗಿ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಅಥವಾ ಇಷ್ಟ ಮಂತ್ರ ಪಠಿಸಿ ಗೋಸೇವೆ ಮಾಡಿ.`,
    hi: `इष्टदेवता की आराधना करें एवं यथाशक्ति अन्नदान कर शुभ मुहूर्त में कार्य प्रारम्भ करें।`
  };

  return {
    kundaliData: kundali,
    category,
    prashnaLagnaName: kundali.houses[0].rashiName,
    prashnaLagnaDegree: kundali.lagnaDegree,
    lagnaNature,
    lagnaLordName: { en: lagnaLord, kn: lagnaLord, hi: lagnaLord },
    lagnaLordHouse: lagnaLordPlanet.bhava,
    moonRashiName: moonPlanet.rashiName,
    moonNakshatraName: kundali.lagnaNakshatra,
    moonHouse: moonPlanet.bhava,
    karakaPlanetName: { en: category.karakaPlanet, kn: category.karakaPlanet, hi: category.karakaPlanet },
    karakaHouse: karakaPlanet.bhava,
    verdictScore: score,
    verdictLevel,
    verdictTitle,
    verdictColor,
    timeline,
    astrologicalReasoning: reasons,
    remedialAdvice
  };
}
