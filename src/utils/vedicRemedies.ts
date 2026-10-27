import { KundaliData, Language, LocalizedString, PlanetPosition } from '../types';

export interface GemstoneInfo {
  name: LocalizedString;
  sanskritName: string;
  planet: string;
  weightRatti: string;
  metal: LocalizedString;
  finger: LocalizedString;
  day: LocalizedString;
  mantra: string;
  benefit: LocalizedString;
  caution: LocalizedString;
}

export interface RudrakshaInfo {
  mukhi: number;
  name: LocalizedString;
  rulingPlanet: string;
  rulingDeity: LocalizedString;
  mantra: string;
  benefits: LocalizedString;
}

export interface MantraRemedyInfo {
  planet: string;
  deity: LocalizedString;
  beejMantra: string;
  gayatriMantra: string;
  recommendedCount: number;
  rosaryType: LocalizedString;
  bestDay: LocalizedString;
}

export interface DaanRemedyInfo {
  planet: string;
  items: LocalizedString;
  day: LocalizedString;
  time: LocalizedString;
  recipient: LocalizedString;
  significance: LocalizedString;
}

export interface DoshaReport {
  name: LocalizedString;
  detected: boolean;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  description: LocalizedString;
  remedyAction: LocalizedString;
}

export interface VedicRemediesResult {
  lagnaRashi: LocalizedString;
  lagnaLord: LocalizedString;
  lagnaLordHouse: number;
  lagnaLordDignity: LocalizedString;
  moonRashi: LocalizedString;
  moonNakshatra: LocalizedString;
  favorableColors: LocalizedString;
  unfavorableColors: LocalizedString;
  favorableDirections: LocalizedString;
  primaryDeity: LocalizedString;
  doshas: DoshaReport[];
  gemstones: GemstoneInfo[];
  rudraksha: RudrakshaInfo[];
  mantras: MantraRemedyInfo[];
  charities: DaanRemedyInfo[];
  generalGuidance: LocalizedString;
}

// Classical Lords of 12 Rashis
const RASHI_LORDS = [
  'Mars',     // 0: Mesha
  'Venus',    // 1: Vrishabha
  'Mercury',  // 2: Mithuna
  'Moon',     // 3: Karka
  'Sun',      // 4: Simha
  'Mercury',  // 5: Kanya
  'Venus',    // 6: Tula
  'Mars',     // 7: Vrishchika
  'Jupiter',  // 8: Dhanu
  'Saturn',   // 9: Makara
  'Saturn',   // 10: Kumbha
  'Jupiter'   // 11: Meena
];

const PLANET_NAMES_LOCALIZED: Record<string, LocalizedString> = {
  Sun: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ರವಿ)', hi: 'सूर्य' },
  Moon: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
  Mars: { en: 'Mars (Mangala/Kuja)', kn: 'ಕುಜ (ಮಂಗಳ)', hi: 'मंगल (भौम)' },
  Mercury: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' },
  Jupiter: { en: 'Jupiter (Guru)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'गुरु (बृहस्पति)' },
  Venus: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
  Saturn: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' },
  Rahu: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु' },
  Ketu: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु' }
};

export function calculateVedicRemedies(kundali: KundaliData): VedicRemediesResult {
  const lagnaRashiIdx = kundali.lagnaRashiIndex;
  const lagnaLordName = RASHI_LORDS[lagnaRashiIdx];
  const lagnaLordLocalized = PLANET_NAMES_LOCALIZED[lagnaLordName] || { en: lagnaLordName, kn: lagnaLordName, hi: lagnaLordName };

  const lagnaLordPlanet = kundali.planets.find(p => p.name === lagnaLordName) || kundali.planets[0];
  const moonPlanet = kundali.planets.find(p => p.name === 'Moon') || kundali.planets[1];
  const marsPlanet = kundali.planets.find(p => p.name === 'Mars');
  const saturnPlanet = kundali.planets.find(p => p.name === 'Saturn');
  const sunPlanet = kundali.planets.find(p => p.name === 'Sun');
  const rahuPlanet = kundali.planets.find(p => p.name === 'Rahu');
  const ketuPlanet = kundali.planets.find(p => p.name === 'Ketu');

  // Lagna Lord Dignity
  let lordDignity: LocalizedString = { en: 'Neutral Sign', kn: 'ಸಮ ಕ್ಷೇತ್ರ', hi: 'सम भाव' };
  if (lagnaLordPlanet) {
    if ([1, 4, 7, 10].includes(lagnaLordPlanet.bhava)) {
      lordDignity = { en: 'Powerful Kendra Placement', kn: 'ಬಲಿಷ್ಠ ಕೇಂದ್ರ ಸ್ಥಾನ (೧,೪,೭,೧೦)', hi: 'बलवान केन्द्र स्थिति' };
    } else if ([5, 9].includes(lagnaLordPlanet.bhava)) {
      lordDignity = { en: 'Auspicious Trikona Placement', kn: 'ಪರಮ ಶುಭ ತ್ರಿಕೋಣ ಸ್ಥಾನ (೫,೯)', hi: 'परम शुभ त्रिकोण स्थिति' };
    } else if ([6, 8, 12].includes(lagnaLordPlanet.bhava)) {
      lordDignity = { en: 'Trik Dusthana (Requires Care)', kn: 'ತ್ರಿಕ ದುಸ್ಥಾನ (೬,೮,೧೨) - ಶಾಂತಿ ಅಗತ್ಯ', hi: 'त्रिक भाव (शान्ति आवश्यक)' };
    }
  }

  // 1. Manglik Dosha Verification (Mars in 1, 4, 7, 8, 12 from Lagna or Moon)
  const marsHouseFromLagna = marsPlanet ? marsPlanet.bhava : 1;
  const marsHouseFromMoon = marsPlanet && moonPlanet 
    ? ((marsPlanet.rashiIndex - moonPlanet.rashiIndex + 12) % 12) + 1 
    : 1;

  const isManglikFromLagna = [1, 4, 7, 8, 12].includes(marsHouseFromLagna);
  const isManglikFromMoon = [1, 4, 7, 8, 12].includes(marsHouseFromMoon);
  const hasManglik = isManglikFromLagna || isManglikFromMoon;

  const manglikSeverity = (isManglikFromLagna && isManglikFromMoon) 
    ? 'Severe' 
    : hasManglik 
    ? 'Moderate' 
    : 'None';

  const manglikDoshaReport: DoshaReport = {
    name: {
      en: 'Manglik (Kuja) Dosha',
      kn: 'ಮಾಂಗಲ್ಯ (ಕುಜ) ದೋಷ',
      hi: 'माङ्गलिक (भौम) दोष'
    },
    detected: hasManglik,
    severity: manglikSeverity as any,
    description: hasManglik
      ? {
          en: `Mars is placed in House ${marsHouseFromLagna} from Lagna and House ${marsHouseFromMoon} from Moon, indicating Kuja Dosha impact on marital harmony and temperament.`,
          kn: `ಕುಜ ಗ್ರಹವು ಲಗ್ನದಿಂದ ${marsHouseFromLagna}ನೇ ಮನೆ ಮತ್ತು ಚಂದ್ರನಿಂದ ${marsHouseFromMoon}ನೇ ಮನೆಯಲ್ಲಿದ್ದು, ದಾಂಪತ್ಯ ಮತ್ತು ಸ್ವಭಾವದಲ್ಲಿ ಉಷ್ಣತೆ/ಹೊಂದಾಣಿಕೆಗೆ ಪರಿಹಾರ ಅಗತ್ಯವಿದೆ.`,
          hi: `मंगल ग्रह लग्न से ${marsHouseFromLagna}वें एवं चन्द्र से ${marsHouseFromMoon}वें भाव में स्थित है, जो वैवाहिक सामंजस्य हेतु शान्ति का संकेत देता है।`
        }
      : {
          en: 'Mars is placed in non-sensitive houses. No harmful Kuja Dosha present.',
          kn: 'ಕುಜ ಗ್ರಹವು ಶುಭ ಸ್ಥಾನಗಳಲ್ಲಿದ್ದು, ಯಾವುದೇ ಕುಜ ದೋಷವಿಲ್ಲ.',
          hi: 'मंगल शुभ स्थानों में स्थित है, कुण्डली भौम दोष से मुक्त है।'
        },
    remedyAction: {
      en: 'Chant Angaraka Gayatri Mantra daily; perform Tuesday Kuja Shanti Puja with red coral or red lentils daan, and recite Hanuman Chalisa.',
      kn: 'ಪ್ರತಿದಿನ ಅಂಗಾರಕ ಗಾಯತ್ರಿ ಮಂತ್ರ ಜಪಿಸಿ; ಮಂಗಳವಾರ ಕುಜ ಶಾಂತಿ ಪೂಜೆ, ಕೆಂಪು ತೊಗರಿಬೇಳೆ ದಾನ ಹಾಗೂ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಿಸಿ.',
      hi: 'नित्य अंगारक गायत्री मन्त्र जपें; मंगलवार को मसूर दाल का दान एवं हनुमान चालीसा का पाठ करें।'
    }
  };

  // 2. Kaal Sarp Dosha Check
  // Check if all planets are on one side of Rahu-Ketu axis
  let hasKaalSarp = false;
  if (rahuPlanet && ketuPlanet) {
    const rahuRashi = rahuPlanet.rashiIndex;
    const ketuRashi = ketuPlanet.rashiIndex;
    const otherPlanets = kundali.planets.filter(p => !['Rahu', 'Ketu'].includes(p.name));
    
    // Check clockwise segment
    const insideClockwise = otherPlanets.every(p => {
      const diff = (p.rashiIndex - rahuRashi + 12) % 12;
      return diff > 0 && diff < 6;
    });
    const insideCounterClockwise = otherPlanets.every(p => {
      const diff = (p.rashiIndex - ketuRashi + 12) % 12;
      return diff > 0 && diff < 6;
    });
    hasKaalSarp = insideClockwise || insideCounterClockwise;
  }

  const kaalSarpReport: DoshaReport = {
    name: {
      en: 'Kaal Sarp Dosha',
      kn: 'ಕಾಲ ಸರ್ಪ ದೋಷ',
      hi: 'काल सर्प दोष'
    },
    detected: hasKaalSarp,
    severity: hasKaalSarp ? 'Moderate' : 'None',
    description: hasKaalSarp
      ? {
          en: 'Planets are hemmed between the Rahu-Ketu axis. May cause delayed fruit of hard labor and sudden career/health fluctuations.',
          kn: 'ಎಲ್ಲಾ ಗ್ರಹಗಳು ರಾಹು ಮತ್ತು ಕೇತುಗಳ ಅಕ್ಷದ ಮಧ್ಯದಲ್ಲಿ ಬಂಧಿತವಾಗಿವೆ. ಶ್ರಮಕ್ಕೆ ತಕ್ಕ ಫಲ ವಿಳಂಬವಾಗಬಹುದು.',
          hi: 'समस्त ग्रह राहु-केतु अक्ष के मध्य स्थित हैं। परिश्रम का फल विलम्ब से प्राप्त होने का संकेत है।'
        }
      : {
          en: 'Planets are freely positioned on both hemispheres of the zodiac. No Kaal Sarp Dosha detected.',
          kn: 'ಗ್ರಹಗಳು ಮುಕ್ತವಾಗಿವೆ; ಜಾತಕದಲ್ಲಿ ಕಾಲ ಸರ್ಪ ದೋಷವಿಲ್ಲ.',
          hi: 'समस्त ग्रह स्वतंत्र रूप से स्थित हैं; काल सर्प दोष अनुपस्थित है।'
        },
    remedyAction: {
      en: 'Perform Maha Mrityunjaya Japa and Nag Pratishtha / Rudrabhisheka on Mondays or during Pradosha.',
      kn: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಜಪ ಮಾಡಿ; ಸೋಮವಾರ ಅಥವಾ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಶಿವನಿಗೆ ರುದ್ರಾಭಿಷೇಕ ನೆರವೇರಿಸಿ.',
      hi: 'महामृत्युंजय मन्त्र का नित्य जप एवं सोमवार अथवा प्रदोष काल में रुद्राभिषेक कराएं।'
    }
  };

  // 3. Shani Sade Sati / Dhaiya Status
  // Saturn in 12th, 1st, or 2nd house from natal Moon
  let sadeSatiStage: 'none' | 'rising' | 'peak' | 'setting' = 'none';
  if (saturnPlanet && moonPlanet) {
    const diff = (saturnPlanet.rashiIndex - moonPlanet.rashiIndex + 12) % 12;
    if (diff === 11) sadeSatiStage = 'rising';  // 12th from Moon
    else if (diff === 0) sadeSatiStage = 'peak'; // In Moon sign
    else if (diff === 1) sadeSatiStage = 'setting'; // 2nd from Moon
  }

  const hasSadeSati = sadeSatiStage !== 'none';
  const sadeSatiReport: DoshaReport = {
    name: {
      en: 'Shani Sade Sati (7.5 Years)',
      kn: 'ಶನಿ ಸಾಡೇ ಸಾತಿ (ಏಳೂವರೆ ವರ್ಷದ ಶನಿ)',
      hi: 'शनि साढ़े साती'
    },
    detected: hasSadeSati,
    severity: sadeSatiStage === 'peak' ? 'Severe' : hasSadeSati ? 'Moderate' : 'None',
    description: hasSadeSati
      ? {
          en: `Active Sade Sati stage (${sadeSatiStage.toUpperCase()}). Saturn transit over Moon activates karmic lessons, resilience testing, and spiritual purification.`,
          kn: `ಪ್ರಸ್ತುತ ಸಾಡೇ ಸಾತಿಯ ಪ್ರಭಾವವಿದೆ (${sadeSatiStage === 'peak' ? 'ಮಧ್ಯಮ ಶಿಖರ ಹಂತ' : sadeSatiStage === 'rising' ? 'ಆರಂಭದ ಹಂತ' : 'ಕೊನೆಯ ಹಂತ'}). ತಾಳ್ಮೆ ಮತ್ತು ಸತ್ಕರ್ಮಗಳು ಅತ್ಯಗತ್ಯ.`,
          hi: `शनि की साढ़े साती प्रभाव में है (${sadeSatiStage === 'peak' ? 'मध्य शिखर चरण' : sadeSatiStage === 'rising' ? 'प्रारम्भिक चरण' : 'उतरती साढ़े साती'})।`
        }
      : {
          en: 'Saturn is comfortably positioned away from your Moon sign. No Sade Sati influence currently.',
          kn: 'ಚಂದ್ರನಿಂದ ಶನಿಯು ದೂರವಿದ್ದು, ಪ್ರಸ್ತುತ ಸಾಡೇ ಸಾತಿ ಇಲ್ಲ.',
          hi: 'चन्द्र राशि से शनि अनुकूल दूरी पर है; साढ़े साती का प्रभाव नहीं है।'
        },
    remedyAction: {
      en: 'Light sesame oil lamp before Shani Yantra on Saturdays; recite Dasharatha Shani Stotra and feed crows and dogs.',
      kn: 'ಶನಿವಾರ ಸಂಜೆ ಕಾಗೆಗಳಿಗೆ ಅನ್ನ ಇರಿಸಿ; ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಬೆಳಗಿಸಿ ದಶರಥ ಕೃತ ಶನಿ ಸ್ತೋತ್ರ ಪಠಿಸಿ.',
      hi: 'शनिवार को तिल के तेल का दीपक प्रज्वलित करें; दशरथ कृत शनि स्तोत्र का पाठ करें।'
    }
  };

  // Gemstone Recommendations based on Lagna Lord and Trikona Lords
  const gemstones: GemstoneInfo[] = [];

  // Primary Gemstone for Lagna Lord
  const GEMSTONE_MAP: Record<string, GemstoneInfo> = {
    Sun: {
      name: { en: 'Ruby (Manikya)', kn: 'ಮಾಣಿಕ್ಯ (Ruby)', hi: 'माणिक्य' },
      sanskritName: 'माणिक्यम्',
      planet: 'Sun',
      weightRatti: '4.5 - 6.5 Ratti',
      metal: { en: 'Gold or Copper', kn: 'ಚಿನ್ನ ಅಥವಾ ತಾಮ್ರ', hi: 'स्वर्ण अथवा तांबा' },
      finger: { en: 'Ring Finger (Right Hand)', kn: 'ಉಂಗುರದ ಬೆರಳು (ಅನಾಮಿಕಾ)', hi: 'अनामिका' },
      day: { en: 'Sunday Morning during Shukla Paksha', kn: 'ಭಾನುವಾರ ಮುಂಜಾನೆ ಶುಕ್ಲ ಪಕ್ಷ', hi: 'रविवार प्रातः' },
      mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      benefit: { en: 'Enhances vitality, authority, leadership, and digestive fire.', kn: 'ಆರೋಗ್ಯ, ಆತ್ಮವಿಶ್ವಾಸ, ಕೀರ್ತಿ ಹಾಗೂ ತೇಜಸ್ಸನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.', hi: 'आत्मविश्वास, ओज, सम्मान एवं स्वास्थ्य प्रदायक।' },
      caution: { en: 'Avoid if Saturn or Venus is severely afflicted in Lagna.', kn: 'ಶುಕ್ರ ಅಥವಾ ಶನಿ ಲಗ್ನದಲ್ಲಿದ್ದರೆ ಜಾಗ್ರತೆವಹಿಸಿ.', hi: 'शनि की दृष्टि होने पर ज्योतिषी परामर्श लें।' }
    },
    Moon: {
      name: { en: 'Natural Pearl (Moti)', kn: 'ಮುತ್ತು (Natural Pearl)', hi: 'मोती' },
      sanskritName: 'मुक्ताफलम्',
      planet: 'Moon',
      weightRatti: '5.0 - 7.0 Ratti',
      metal: { en: 'Pure Silver', kn: 'ಬೆಳ್ಳಿ', hi: 'चांदी' },
      finger: { en: 'Little Finger (Right Hand)', kn: 'ಕಿರುಬೆರಳು (ಕನಿಷ್ಠಿಕಾ)', hi: 'कनिष्ठिका' },
      day: { en: 'Monday Evening or Purnima', kn: 'ಸೋಮವಾರ ಸಂಜೆ ಅಥವಾ ಹುಣ್ಣಿಮೆ', hi: 'सोमवार सायं' },
      mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रಮಸೇ ನಮಃ',
      benefit: { en: 'Pacifies emotional unrest, anxiety, insomnia, and promotes peace.', kn: 'ಮನಃಶಾಂತಿ, ಆತಂಕ ನಿವಾರಣೆ ಹಾಗೂ ತಾಯಿಯ ಪ್ರೀತಿಯನ್ನು ವೃದ್ಧಿಸುತ್ತದೆ.', hi: 'मानसिक शान्ति, एकाग्रता एवं सुखद निद्रा प्रदायक।' },
      caution: { en: 'Ensure pearl is natural and unblemished.', kn: 'ನೈಸರ್ಗಿಕ ದೋಷರಹಿತ ಮುತ್ತನ್ನು ಧರಿಸಿ.', hi: 'प्राकृतिक निर्दोष मोती ही धारण करें।' }
    },
    Mars: {
      name: { en: 'Red Coral (Moonga)', kn: 'ಹವಳ (Red Coral)', hi: 'मूंगा' },
      sanskritName: 'प्रवालम्',
      planet: 'Mars',
      weightRatti: '6.0 - 8.5 Ratti',
      metal: { en: 'Gold, Copper, or Panchadhatu', kn: 'ತಾಮ್ರ ಅಥವಾ ಚಿನ್ನ', hi: 'तांबा अथवा सोना' },
      finger: { en: 'Ring Finger (Right Hand)', kn: 'ಉಂಗುರದ ಬೆರಳು (ಅನಾಮಿಕಾ)', hi: 'अनामिका' },
      day: { en: 'Tuesday Morning', kn: 'ಮಂಗಳವಾರ ಸೂರ್ಯೋದಯ ಕಾಲ', hi: 'मंगलवार प्रातः' },
      mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      benefit: { en: 'Ignites courage, physical vigor, property gains, and blood vitality.', kn: 'ಧೈರ್ಯ, ಭೂಮಿ ಲಾಭ, ರಕ್ತ ಶುದ್ಧಿ ಹಾಗೂ ಸಾಹಸ ಗುಣವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.', hi: 'साहस, भूमि लाभ, पराक्रम एवं स्फूर्ति प्रदायक।' },
      caution: { en: 'Do not wear if prone to uncontrolled anger or high blood pressure.', kn: 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡವಿದ್ದರೆ ಶಾಂತಿಯುತವಾಗಿ ಧರಿಸಿ.', hi: 'अति क्रोध होने पर परामर्श लें।' }
    },
    Mercury: {
      name: { en: 'Emerald (Panna)', kn: 'ಪಚ್ಚೆ (Emerald)', hi: 'पन्ना' },
      sanskritName: 'मरकतम्',
      planet: 'Mercury',
      weightRatti: '4.0 - 6.0 Ratti',
      metal: { en: 'Gold or Bronze', kn: 'ಚಿನ್ನ ಅಥವಾ ಕಂಚು', hi: 'स्वर्ण अथवा कांस्य' },
      finger: { en: 'Little Finger (Right Hand)', kn: 'ಕಿರುಬೆರಳು (ಕನಿಷ್ಠಿಕಾ)', hi: 'कनिष्ठिका' },
      day: { en: 'Wednesday Morning', kn: 'ಬುಧವಾರ ಮುಂಜಾನೆ', hi: 'बुधवार प्रातः' },
      mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधಾಯ ನಮಃ',
      benefit: { en: 'Boosts intellect, memory, oratorical skill, and business acumen.', kn: 'ಬುದ್ಧಿಶಕ್ತಿ, ವ್ಯಾಪಾರ ಚಾತುರ್ಯ, ಮಾತುಗಾರಿಕೆ ಹಾಗೂ ಜ್ಞಾಪಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸುತ್ತದೆ.', hi: 'बुद्धि, व्यापार, विद्या एवं वाणी में सफलता।' },
      caution: { en: 'Avoid combining with Red Coral without chart harmony.', kn: 'ಹವಳದೊಂದಿಗೆ ಧರಿಸುವ ಮುನ್ನ ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲಿಸಿ.', hi: 'मूंगा के साथ सावधानी से धारण करें।' }
    },
    Jupiter: {
      name: { en: 'Yellow Sapphire (Pukhraj)', kn: 'ಪುಷ್ಯರಾಗ (Yellow Sapphire)', hi: 'पुखराज' },
      sanskritName: 'पुष्परागम्',
      planet: 'Jupiter',
      weightRatti: '4.5 - 7.0 Ratti',
      metal: { en: 'Pure Gold', kn: 'ಅಪರಂಜಿ ಚಿನ್ನ', hi: 'शुद्ध स्वर्ण' },
      finger: { en: 'Index Finger (Right Hand)', kn: 'ತೋರುಬೆರಳು (ತರ್ಜನೀ)', hi: 'तर्जनी' },
      day: { en: 'Thursday Morning during Guru Hora', kn: 'ಗುರುವಾರ ಮುಂಜಾನೆ ಗುರು ಹೋರಾ', hi: 'गुरुवार प्रातः' },
      mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      benefit: { en: 'Supreme blessing for wisdom, spiritual growth, progeny, and prosperity.', kn: 'ಪರಮ ಜ್ಞಾನ, ಸಂತಾನ ಭಾಗ್ಯ, ಧಾರ್ಮಿಕ ಏಳಿಗೆ ಹಾಗೂ ಆರ್ಥಿಕ ಸಮೃದ್ಧಿ ನೀಡುತ್ತದೆ.', hi: 'ज्ञान, धर्म, संतति एवं अपार समृद्धि प्रदायक।' },
      caution: { en: 'Do not pair with Blue Sapphire or Diamond.', kn: 'ನೀಲಂ ಅಥವಾ ವಜ್ರದೊಂದಿಗೆ ಧರಿಸಬಾರದು.', hi: 'नीलम अथवा हीरा के साथ न पहनें।' }
    },
    Venus: {
      name: { en: 'Diamond or White Zircon', kn: 'ವಜ್ರ ಅಥವಾ ಬಿಳಿ ಜಿರ್ಕಾನ್ (Diamond)', hi: 'हीरा अथवा श्वेत जरकन' },
      sanskritName: 'वज्रम्',
      planet: 'Venus',
      weightRatti: '0.75 - 1.5 Carats (Diamond) / 5+ Ratti (Zircon)',
      metal: { en: 'White Gold, Platinum, or Silver', kn: 'ಬೆಳ್ಳಿ ಅಥವಾ ಬಿಳಿ ಚಿನ್ನ', hi: 'चांदी अथवा प्लेटिनम' },
      finger: { en: 'Middle or Little Finger', kn: 'ಮಧ್ಯದ ಬೆರಳು ಅಥವಾ ಕಿರುಬೆರಳು', hi: 'मध्यमा अथवा कनिष्ठिका' },
      day: { en: 'Friday Morning', kn: 'ಶುಕ್ರವಾರ ಮುಂಜಾನೆ', hi: 'शुक्रवार प्रातः' },
      mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्रಾಯ ನಮಃ',
      benefit: { en: 'Enhances artistic creativity, marital charm, luxury, and grace.', kn: 'ಕಲಾತ್ಮಕತೆ, ಸೌಂದರ್ಯ, ಸುಖ-ಭೋಗ ಹಾಗೂ ಆಕರ್ಷಕ ವ್ಯಕ್ತಿತ್ವ ನೀಡುತ್ತದೆ.', hi: 'कला, प्रेम, आकर्षण एवं भौतिक सुख-साधन प्रदायक।' },
      caution: { en: 'Ensure diamond has no deep cracks or black spots.', kn: 'ಕಪ್ಪು ಕಲೆಗಳಿಲ್ಲದ ವಜ್ರ ಆಯ್ದುಕೊಳ್ಳಿ.', hi: 'निर्दोष हीरा ही धारण करें।' }
    },
    Saturn: {
      name: { en: 'Blue Sapphire (Neelam)', kn: 'ನೀಲಂ (Blue Sapphire)', hi: 'नीलम' },
      sanskritName: 'नीलमणिः',
      planet: 'Saturn',
      weightRatti: '4.5 - 6.5 Ratti',
      metal: { en: 'Panchadhatu, Iron, or Silver', kn: 'ಪಂಚಲೋಹ ಅಥವಾ ಬೆಳ್ಳಿ', hi: 'पंचधातु अथवा चांदी' },
      finger: { en: 'Middle Finger (Right Hand)', kn: 'ಮಧ್ಯದ ಬೆರಳು (ಮಧ್ಯಮಾ)', hi: 'मध्यमा' },
      day: { en: 'Saturday Evening', kn: 'ಶನಿವಾರ ಸಂಜೆ ಸೂರ್ಯಾಸ್ತದ ನಂತರ', hi: 'शनिवार सायं' },
      mantra: 'ॐ प्रां प्रीं प्रौं सः शनೈಶ್ಚರಾಯ ನಮಃ',
      benefit: { en: 'Fast-acting stone for discipline, focus, deep intuition, and sudden fortune.', kn: 'ಶಿಸ್ತು, ಏಕಾಗ್ರತೆ, ದೃಢತೆ ಹಾಗೂ ಅಪಾರ ಕರ್ಮ ವಿಮೋಚನೆ ನೀಡುತ್ತದೆ.', hi: 'अनुशासन, धैर्य, स्थिरता एवं आकस्मिक लाभ।' },
      caution: { en: 'Always test by keeping under pillow for 3 nights before wearing.', kn: 'ಧರಿಸುವ ಮುನ್ನ ೩ ದಿನ ಪರೀಕ್ಷಾರ್ಥವಾಗಿ ಇಟ್ಟುಕೊಳ್ಳಿ.', hi: 'पहनने से पूर्व ३ दिन परीक्षण अवश्य करें।' }
    }
  };

  const primaryGem = GEMSTONE_MAP[lagnaLordName];
  if (primaryGem) gemstones.push(primaryGem);

  // 9th House Lord (Bhagya Lord) Gemstone
  const bhagyaRashiIdx = (lagnaRashiIdx + 8) % 12;
  const bhagyaLordName = RASHI_LORDS[bhagyaRashiIdx];
  if (bhagyaLordName !== lagnaLordName && GEMSTONE_MAP[bhagyaLordName]) {
    gemstones.push(GEMSTONE_MAP[bhagyaLordName]);
  }

  // Rudraksha recommendations
  const rudrakshaList: RudrakshaInfo[] = [
    {
      mukhi: 5,
      name: { en: '5-Mukhi Rudraksha (Panchamukhi)', kn: '೫-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಪಂಚಮುಖಿ)', hi: '५-मुखी रुद्राक्ष' },
      rulingPlanet: 'Jupiter',
      rulingDeity: { en: 'Lord Kalagni Rudra', kn: 'ಕಾಲಾಗ್ನಿ ರುದ್ರ', hi: 'कालाग्नि रुद्र' },
      mantra: 'ॐ ह्रीं नमः',
      benefits: { en: 'Universal purifier; calms heart rate, lowers blood pressure, enhances spiritual peace.', kn: 'ಸರ್ವ ಶ್ರೇಷ್ಠ ರುದ್ರಾಕ್ಷಿ; ಶಾಂತಿ, ಆರೋಗ್ಯ ಹಾಗೂ ಧರ್ಮ ಬುದ್ಧಿ ನೀಡುತ್ತದೆ.', hi: 'सर्वकल्याणकारी, रक्तचाप नियंत्रण एवं शान्ति प्रदायक।' }
    },
    {
      mukhi: lagnaLordName === 'Saturn' ? 7 : lagnaLordName === 'Mars' ? 3 : lagnaLordName === 'Mercury' ? 4 : lagnaLordName === 'Moon' ? 2 : 1,
      name: { 
        en: `${lagnaLordName === 'Saturn' ? '7' : lagnaLordName === 'Mars' ? '3' : lagnaLordName === 'Mercury' ? '4' : '6'}-Mukhi Lagnesha Rudraksha`, 
        kn: `${lagnaLordName === 'Saturn' ? '೭' : lagnaLordName === 'Mars' ? '೩' : '೪'}-ಮುಖಿ ಲಗ್ನಾಧಿಪತಿ ರುದ್ರಾಕ್ಷಿ`, 
        hi: 'लग्नेश रुद्राक्ष' 
      },
      rulingPlanet: lagnaLordName,
      rulingDeity: { en: 'Lord Shiva & Divine Shakti', kn: 'ಪರಮೇಶ್ವರ ಮತ್ತು ಆದಿಶಕ್ತಿ', hi: 'भगवान शिव एवं शक्ति' },
      mantra: 'ॐ नमः शिवाय',
      benefits: { en: 'Empowers your natal Lagna, protecting your aura and aligning planetary rays.', kn: 'ಲಗ್ನ ಬಲವನ್ನು ಹೆಚ್ಚಿಸಿ ದೈವಿಕ ರಕ್ಷಣಾ ಕವಚ ನೀಡುತ್ತದೆ.', hi: 'लग्न शक्ति संवर्धन एवं सुरक्षा कवच निर्माण।' }
    }
  ];

  // Mantras
  const mantrasList: MantraRemedyInfo[] = [
    {
      planet: lagnaLordName,
      deity: { en: 'Lagna Lord Adhishthana Devata', kn: 'ಲಗ್ನಾಧಿಪತಿ ದೇವತೆ', hi: 'लग्नेश इष्टदेवता' },
      beejMantra: GEMSTONE_MAP[lagnaLordName]?.mantra || 'ॐ नमः शिवाय',
      gayatriMantra: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्',
      recommendedCount: 108,
      rosaryType: { en: 'Rudraksha Rosary (108 beads)', kn: 'ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ', hi: 'रुद्राक्ष माला' },
      bestDay: { en: 'Every Morning after Bath', kn: 'ಪ್ರತಿದಿನ ಪ್ರಾತಃಕಾಲ ಸ್ನಾನದ ನಂತರ', hi: 'नित्य प्रातःकाल' }
    },
    {
      planet: 'Navagraha',
      deity: { en: 'Sri Navagraha Mandala', kn: 'ಶ್ರೀ ನವಗ್ರಹ ದೇವತೆಗಳು', hi: 'श्री नवग्रह मण्डल' },
      beejMantra: 'ब्रह्मामुरारिस्त्रिपुरान्तकारी भानुः शशी भूमिसुतो बुधश्च । गुरुश्च शुक्रः शनिराहुकेतवः सर्वे ग्रहाः शान्तिकरा भवन्तु ॥',
      gayatriMantra: 'ॐ नवग्रहाय विद्महे सुखदाय धीमहि तन्नो ग्रहाः प्रचोदयात्',
      recommendedCount: 21,
      rosaryType: { en: 'Tulsi or Rudraksha Rosary', kn: 'ತುಳಸಿ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ', hi: 'तुलसी अथवा रुद्राक्ष माला' },
      bestDay: { en: 'Sundays and Saturdays', kn: 'ಭಾನುವಾರ ಮತ್ತು ಶನಿವಾರ', hi: 'रविवार एवं शनिवार' }
    }
  ];

  // Daan (Charities)
  const charitiesList: DaanRemedyInfo[] = [
    {
      planet: lagnaLordName,
      items: { en: 'Food grains, clothes, or fruits associated with Lagna Lord', kn: 'ಲಗ್ನಾಧಿಪತಿಗೆ ಪ್ರಿಯವಾದ ಧಾನ್ಯ, ವಸ್ತ್ರ ಅಥವಾ ಹಣ್ಣುಗಳು', hi: 'अन्न, वस्त्र अथवा फल' },
      day: { en: 'Every Weekday of Lagnesha', kn: 'ವಾರದ ಆಯಾ ದಿನದಂದು', hi: 'सम्बन्धित वार को' },
      time: { en: 'Morning before noon', kn: 'ಮುಂಜಾನೆ ೧೨ ಗಂಟೆಯೊಳಗೆ', hi: 'मध्याह्न से पूर्व' },
      recipient: { en: 'Needy persons, students, or temple cows (Gau Seva)', kn: 'ಅಗತ್ಯವಿರುವವರಿಗೆ ಅಥವಾ ಗೋಶಾಲೆಗೆ (ಗೋಸೇವೆ)', hi: 'जरूरतमंद अथवा गौशाला' },
      significance: { en: 'Charity purifies karmic debts and activates positive planetary rays.', kn: 'ದಾನವು ಕರ್ಮ ದೋಷಗಳನ್ನು ಕಳೆದು ಆಯುಷ್ಯ ಮತ್ತು ನೆಮ್ಮದಿ ತರುತ್ತದೆ.', hi: 'दान से पूर्व संचित कर्म दोष शान्त होते हैं।' }
    }
  ];

  // Colors & Directions
  const RASHI_COLORS: Record<number, { fav: LocalizedString; unfav: LocalizedString; dir: LocalizedString; deity: LocalizedString }> = {
    0: { fav: { en: 'Red, Coral, Saffron', kn: 'ಕೆಂಪು, ಕೇಸರಿ', hi: 'लाल, केसरिया' }, unfav: { en: 'Black, Dark Blue', kn: 'ಕಪ್ಪು, ಕಡು ನೀಲಿ', hi: 'काला, गहरा नीला' }, dir: { en: 'East', kn: 'ಪೂರ್ವ', hi: 'पूर्व' }, deity: { en: 'Lord Kartikeya / Hanuman', kn: 'ಸುಬ್ರಹ್ಮಣ್ಯ / ಹನುಮಂತ', hi: 'कार्तिकेय / हनुमान' } },
    1: { fav: { en: 'White, Cream, Light Pink', kn: 'ಬಿಳಿ, ತಿಳಿ ಗುಲಾಬಿ', hi: 'सफेद, गुलाबी' }, unfav: { en: 'Fiery Red', kn: 'ಅತಿ ಕೆಂಪು', hi: 'तीखा लाल' }, dir: { en: 'South-East (Agneya)', kn: 'ಆಗ್ನೇಯ', hi: 'आग्नेय' }, deity: { en: 'Maha Lakshmi', kn: 'ಮಹಾಲಕ್ಷ್ಮೀ', hi: 'महालक्ष्मी' } },
    2: { fav: { en: 'Green, Emerald, Parrot Green', kn: 'ಹಸಿರು, ಗಿಳಿ ಹಸಿರು', hi: 'हरा, धानी' }, unfav: { en: 'Dark Maroon', kn: 'ಗಾಢ ಕಂದು', hi: 'गहरा भूरा' }, dir: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' }, deity: { en: 'Maha Vishnu / Narayana', kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು', hi: 'श्री विष्णु' } },
    3: { fav: { en: 'Pearl White, Silver, Cream', kn: 'ಮುತ್ತಿನ ಬಿಳಿ, ಬೆಳ್ಳಿ ಬಣ್ಣ', hi: 'मोतिया सफेद, चांदी' }, unfav: { en: 'Black, Dark Grey', kn: 'ಕಪ್ಪು, ಬೂದು', hi: 'काला, स्लेटी' }, dir: { en: 'North-West (Vayavya)', kn: 'ವಾಯುವ್ಯ', hi: 'वायव्य' }, deity: { en: 'Lord Shiva / Gauri', kn: 'ಪರಮೇಶ್ವರ / ಗೌರಿ', hi: 'शिव / गौरी' } },
    4: { fav: { en: 'Gold, Orange, Copper Yellow', kn: 'ಬಂಗಾರದ ಹಳದಿ, ಕಿತ್ತಳೆ', hi: 'सुनहरा, नारंगी' }, unfav: { en: 'Dark Blue, Black', kn: 'ಕಪ್ಪು, ನೀಲಿ', hi: 'काला, नीला' }, dir: { en: 'East', kn: 'ಪೂರ್ವ', hi: 'पूर्व' }, deity: { en: 'Lord Surya / Gayatri', kn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ', hi: 'सूर्य / गायत्री' } },
    5: { fav: { en: 'Dark Green, Jade, Floral Tones', kn: 'ಹಸಿರು, ತಳಿರು ತೋರಣ ಬಣ್ಣ', hi: 'गहरा हरा' }, unfav: { en: 'Red', kn: 'ಕೆಂಪು', hi: 'लाल' }, dir: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' }, deity: { en: 'Maha Vishnu', kn: 'ಮಹಾವಿಷ್ಣು / ಬುಧ', hi: 'विष्णु' } },
    6: { fav: { en: 'Sky Blue, Pastel Pink, White', kn: 'ಆಕಾಶ ನೀಲಿ, ಬಿಳಿ', hi: 'आसमानी, सफेद' }, unfav: { en: 'Yellow, Saffron', kn: 'ಹಳದಿ', hi: 'पीला' }, dir: { en: 'West', kn: 'ಪಶ್ಚಿಮ', hi: 'पश्चिम' }, deity: { en: 'Goddess Durga / Lakshmi', kn: 'ದುರ್ಗಾದೇವಿ / ಲಕ್ಷ್ಮೀ', hi: 'दुर्गा / लक्ष्मी' } },
    7: { fav: { en: 'Blood Red, Maroon, Rust', kn: 'ಕಡುಗೆಂಪು, ತಾಮ್ರ ವರ್ಣ', hi: 'लाल, महरून' }, unfav: { en: 'Green', kn: 'ಹಸಿರು', hi: 'हरा' }, dir: { en: 'North', kn: 'ಉತ್ತರ', hi: 'उत्तर' }, deity: { en: 'Lord Shiva / Kartikeya', kn: 'ಶಿವ / ಸುಬ್ರಹ್ಮಣ್ಯ', hi: 'शिव / मुरुगन' } },
    8: { fav: { en: 'Bright Yellow, Turmeric Gold', kn: 'ಅರಿಶಿನ ಹಳದಿ, ಬಂಗಾರ', hi: 'हल्दी पीला, स्वर्ण' }, unfav: { en: 'Black', kn: 'ಕಪ್ಪು', hi: 'काला' }, dir: { en: 'North-East (Eshanya)', kn: 'ಈಶಾನ್ಯ', hi: 'ईशान' }, deity: { en: 'Lord Dattatreya / Brihaspati', kn: 'ಶ್ರೀ ದತ್ತಾತ್ರೇಯ / ಗುರು', hi: 'दत्तात्रेय' } },
    9: { fav: { en: 'Navy Blue, Slate Grey, Khaki', kn: 'ಕಡು ನೀಲಿ, ಬೂದು', hi: 'गहरा नीला, स्लेटी' }, unfav: { en: 'Bright Red', kn: 'ಕೆಂಪು', hi: 'लाल' }, dir: { en: 'South', kn: 'ದಕ್ಷಿಣ', hi: 'दक्षिण' }, deity: { en: 'Lord Hanuman / Shani', kn: 'ಹನುಮಂತ / ಶನಿಶ್ವರ', hi: 'हनुमान' } },
    10: { fav: { en: 'Electric Blue, Violet, Black', kn: 'ನೀಲಿ, ನೇರಳೆ', hi: 'नीला, जामुनी' }, unfav: { en: 'Orange, Gold', kn: 'ಕಿತ್ತಳೆ, ಬಂಗಾರ', hi: 'नारंगी, पीला' }, dir: { en: 'West', kn: 'ಪಶ್ಚಿಮ', hi: 'पश्चिम' }, deity: { en: 'Lord Shiva / Rudra', kn: 'ರುದ್ರ ದೇವರು', hi: 'रुद्र' } },
    11: { fav: { en: 'Golden Yellow, Saffron, Coral', kn: 'ಹಳದಿ, ಕೇಸರಿ', hi: 'पीला, केसरिया' }, unfav: { en: 'Dark Maroon, Grey', kn: 'ಕಪ್ಪು, ಬೂದು', hi: 'काला' }, dir: { en: 'North-East (Eshanya)', kn: 'ಈಶಾನ್ಯ', hi: 'ईशान' }, deity: { en: 'Lord Narayana / Dakshinamurthy', kn: 'ದಕ್ಷಿಣಾಮೂರ್ತಿ / ನಾರಾಯಣ', hi: 'नारायण' } }
  };

  const meta = RASHI_COLORS[lagnaRashiIdx] || RASHI_COLORS[0];

  return {
    lagnaRashi: kundali.houses[0].rashiName,
    lagnaLord: lagnaLordLocalized,
    lagnaLordHouse: lagnaLordPlanet ? lagnaLordPlanet.bhava : 1,
    lagnaLordDignity: lordDignity,
    moonRashi: moonPlanet.rashiName,
    moonNakshatra: kundali.lagnaNakshatra,
    favorableColors: meta.fav,
    unfavorableColors: meta.unfav,
    favorableDirections: meta.dir,
    primaryDeity: meta.deity,
    doshas: [manglikDoshaReport, kaalSarpReport, sadeSatiReport],
    gemstones,
    rudraksha: rudrakshaList,
    mantras: mantrasList,
    charities: charitiesList,
    generalGuidance: {
      en: 'Perform daily sandhyavandana or morning prayer facing East. Respect elders, maintain truthfulness in speech, and worship the Ishta Devata to overcome planetary afflictions.',
      kn: 'ಪ್ರತಿದಿನ ಪ್ರಾತಃಕಾಲ ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಪ್ರಾರ್ಥಿಸಿ; ಹಿರಿಯರಿಗೆ ಗೌರವ ನೀಡಿ, ಧರ್ಮ ಮಾರ್ಗದಲ್ಲಿ ಸಾಗಿದರೆ ಗ್ರಹ ಬಾಧೆಗಳು ತಾವಾಗಿಯೇ ಶಮನಗೊಳ್ಳುತ್ತವೆ.',
      hi: 'नित्य प्रातः पूर्व दिशा की ओर मुख कर देव उपासना करें; सत्य आचरण एवं इष्टदेव कृपा से समस्त अनिष्ट शांत होते हैं।'
    }
  };
}
