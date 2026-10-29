import { KundaliData, Language, LocalizedString, PlanetPosition } from '../types';

export interface AspectInfo {
  aspectingPlanet: PlanetPosition;
  aspectType: string; // e.g. "7th Aspect (ಸಪ್ತಮ ದೃಷ್ಟಿ)", "4th Special Aspect (ಚತುರ್ಥ ದೃಷ್ಟಿ)", etc.
  aspectTypeLocalized: LocalizedString;
  distanceFromPlanet: number; // e.g. 7, 4, 8, 5, 9, 3, 10
  nature: 'benefic' | 'malefic' | 'neutral';
  natureLocalized: LocalizedString;
  effectOnHouse: LocalizedString;
  effectOnOccupants?: LocalizedString;
}

export interface HouseDrishtiAnalysis {
  bhava: number;
  bhavaName: LocalizedString;
  rashiIndex: number;
  rashiName: LocalizedString;
  occupantPlanets: PlanetPosition[];
  aspectingPlanets: AspectInfo[];
  beneficAspectCount: number;
  maleficAspectCount: number;
  overallDrishtiTone: 'highly_auspicious' | 'auspicious' | 'mixed' | 'challenging' | 'intense';
  overallDrishtiToneLocalized: LocalizedString;
  physicalImpact: {
    governedOrgans: LocalizedString;
    vulnerabilities: LocalizedString;
    symptomsToWatch: LocalizedString;
    vitalityEffect: LocalizedString;
  };
  mentalImpact: {
    temperament: LocalizedString;
    emotionalTendencies: LocalizedString;
    stressTriggers: LocalizedString;
    cognitiveStrength: LocalizedString;
  };
  nutritionalTherapy: {
    recommendedFoods: LocalizedString;
    vitaminsAndNutrients: LocalizedString;
    ayurvedicHerbs: LocalizedString;
    foodsToAvoid: LocalizedString;
    dietaryRitual: LocalizedString;
  };
  astrologicalRemedies: {
    vedicMantra: LocalizedString;
    gemstoneAndRudraksha: LocalizedString;
    daanamCharity: LocalizedString;
    spiritualPractice: LocalizedString;
  };
}

// Parashari rules:
// All Grahas: 7th aspect
// Mars: 4th, 7th, 8th
// Jupiter: 5th, 7th, 9th
// Saturn: 3rd, 7th, 10th
// Rahu / Ketu: 5th, 7th, 9th
export function getAspectingHousesForGraha(planetName: string, fromBhava: number): { targetBhava: number; distance: number; label: LocalizedString }[] {
  const normName = planetName.toLowerCase();
  const aspects: { targetBhava: number; distance: number; label: LocalizedString }[] = [];

  const calcTarget = (dist: number) => ((fromBhava - 1 + (dist - 1)) % 12) + 1;

  // Universal 7th aspect
  aspects.push({
    targetBhava: calcTarget(7),
    distance: 7,
    label: {
      en: '7th Full Aspect (Saptama Drishti - 180°)',
      kn: '೭ನೇ ಪೂರ್ಣ ದೃಷ್ಟಿ (ಸಪ್ತಮ ದೃಷ್ಟಿ - ೧೮೦°)',
      hi: '७वीं पूर्ण दृष्टि (सप्तम दृष्टि - १८०°)'
    }
  });

  // Mars: 4th and 8th
  if (normName.includes('mars') || normName.includes('kuja') || normName.includes('mangal')) {
    aspects.push({
      targetBhava: calcTarget(4),
      distance: 4,
      label: {
        en: '4th Special Aspect (Chaturtha Vishesha Drishti)',
        kn: '೪ನೇ ವಿಶೇಷ ದೃಷ್ಟಿ (ಚತುರ್ಥ ದೃಷ್ಟಿ - ರಕ್ಷಣಾ/ಅಧಿಕಾರ ಪ್ರಭಾವ)',
        hi: '४थी विशेष दृष्टि (चतुर्थ दृष्टि)'
      }
    });
    aspects.push({
      targetBhava: calcTarget(8),
      distance: 8,
      label: {
        en: '8th Special Aspect (Ashtama Vishesha Drishti)',
        kn: '೮ನೇ ವಿಶೇಷ ದೃಷ್ಟಿ (ಅಷ್ಟಮ ದೃಷ್ಟಿ - ಆಳವಾದ ಪರಿವರ್ತನೆ/ಎಚ್ಚರಿಕೆ)',
        hi: '८वीं विशेष दृष्टि (अष्टम दृष्टि)'
      }
    });
  }

  // Jupiter: 5th and 9th
  if (normName.includes('jupiter') || normName.includes('guru') || normName.includes('brihaspati')) {
    aspects.push({
      targetBhava: calcTarget(5),
      distance: 5,
      label: {
        en: '5th Trinal Grace (Panchama Trikona Drishti - Dharma & Intellect)',
        kn: '೫ನೇ ತ್ರಿಕೋಣ ದೃಷ್ಟಿ (ಪಂಚಮ ದೃಷ್ಟಿ - ಜ್ಞಾನ, ಸಂತಾನ & ಪೂರ್ವಪುಣ್ಯ)',
        hi: '५वीं त्रिकोण दृष्टि (पंचम दृष्टि - ज्ञान व पूर्वपुण्य)'
      }
    });
    aspects.push({
      targetBhava: calcTarget(9),
      distance: 9,
      label: {
        en: '9th Trinal Grace (Navama Trikona Drishti - Divine Luck & Prosperity)',
        kn: '೯ನೇ ತ್ರಿಕೋಣ ದೃಷ್ಟಿ (ನವಮ ದೃಷ್ಟಿ - ದೈವಾನುಗ್ರಹ, ಧರ್ಮ & ಭಾಗ್ಯೋದಯ)',
        hi: '९वीं त्रिकोण दृष्टि (नवम दृष्टि - भाग्योदय व धर्म)'
      }
    });
  }

  // Saturn: 3rd and 10th
  if (normName.includes('saturn') || normName.includes('shani')) {
    aspects.push({
      targetBhava: calcTarget(3),
      distance: 3,
      label: {
        en: '3rd Special Aspect (Tritiya Vishesha Drishti - Effort & Tenacity)',
        kn: '೩ನೇ ವಿಶೇಷ ದೃಷ್ಟಿ (ತೃತೀಯ ದೃಷ್ಟಿ - ಸಾಹಸ, ಶ್ರಮ & ಶಿಸ್ತು)',
        hi: '३री विशेष दृष्टि (तृतीय दृष्टि - पराक्रम व श्रम)'
      }
    });
    aspects.push({
      targetBhava: calcTarget(10),
      distance: 10,
      label: {
        en: '10th Special Aspect (Dashama Vishesha Drishti - Karma & Duty)',
        kn: '೧೦ನೇ ವಿಶೇಷ ದೃಷ್ಟಿ (ದಶಮ ದೃಷ್ಟಿ - ಕರ್ಮ ಜವಾಬ್ದಾರಿ & ಸತತ ಕರ್ತವ್ಯ)',
        hi: '१०वीं विशेष दृष्टि (दशम दृष्टि - कर्म व उत्तरदायित्व)'
      }
    });
  }

  // Rahu & Ketu: 5th and 9th
  if (normName.includes('rahu') || normName.includes('ketu')) {
    aspects.push({
      targetBhava: calcTarget(5),
      distance: 5,
      label: {
        en: '5th Trinal Aspect (Subtle Karmic Activation)',
        kn: '೫ನೇ ತ್ರಿಕೋಣ ದೃಷ್ಟಿ (ಕಾರ್ಮಿಕ್ ಆಕಾಂಕ್ಷೆ & ಅಂತಃಪ್ರಜ್ಞೆ)',
        hi: '५वीं त्रिकोण दृष्टि (गूढ़ कर्म प्रेरणा)'
      }
    });
    aspects.push({
      targetBhava: calcTarget(9),
      distance: 9,
      label: {
        en: '9th Trinal Aspect (Spiritual Awakening / Transformation)',
        kn: '೯ನೇ ತ್ರಿಕೋಣ ದೃಷ್ಟಿ (ಆಧ್ಯಾತ್ಮಿಕ ಶೋಧನೆ & ಭೌತಿಕ ಭ್ರಮೆ ನಿವಾರಣೆ)',
        hi: '९वीं त्रिकोण दृष्टि (अध्यात्म व कर्म शुद्धि)'
      }
    });
  }

  return aspects;
}

// Check planetary aspect nature
function getDrishtiNature(planetName: string): 'benefic' | 'malefic' | 'neutral' {
  const norm = planetName.toLowerCase();
  if (norm.includes('jupiter') || norm.includes('guru') || norm.includes('venus') || norm.includes('shukra')) {
    return 'benefic';
  }
  if (norm.includes('mercury') || norm.includes('budha') || norm.includes('moon') || norm.includes('chandra')) {
    return 'benefic'; // Generally benefic, Mercury adapts
  }
  return 'malefic'; // Sun, Mars, Saturn, Rahu, Ketu
}

// Descriptive effect of planet's aspect on this house
function getPlanetAspectEffect(planetName: string, distance: number, targetBhava: number): LocalizedString {
  const norm = planetName.toLowerCase();

  if (norm.includes('jupiter') || norm.includes('guru')) {
    return {
      en: `Jupiter casts sublime nectar-like grace (Amrita Drishti) on House ${targetBhava}. It shields this house from afflictions, bestows divine wisdom, purifies biological doshas, and brings moral expansion and spiritual healing.`,
      kn: `ದೇವಗುರು ಬೃಹಸ್ಪತಿಯ ಅಮೃತ ಸಮಾನ ದೃಷ್ಟಿ ${targetBhava}ನೇ ಭಾವದ ಮೇಲೆ ಬಿದ್ದಿದೆ. ಇದು ಆ ಭಾವದ ದೋಷಗಳನ್ನು ಶಮನಗೊಳಿಸಿ, ದೈವಿಕ ರಕ್ಷಣೆ, ಸಾತ್ವಿಕ ಬುದ್ಧಿ, ರೋಗನಿರೋಧಕ ಜೀವಕೋಶೀಯ ಆರೋಗ್ಯ ಮತ್ತು ಸದ್ಗುಣಗಳನ್ನು ವೃದ್ಧಿಸುತ್ತದೆ.`,
      hi: `देवगुरु बृहस्पति की अमृतमयी दृष्टि भाव ${targetBhava} पर है। यह सभी अनिष्टों का शमन कर सात्त्विक बुद्धि, शारीरिक आरोग्यता, रोग प्रतिरोधक क्षमता और भाग्योन्नति प्रदान करती है।`
    };
  }

  if (norm.includes('venus') || norm.includes('shukra')) {
    return {
      en: `Venus bestows radiant beauty, refinement, emotional harmony, and hormonal vitality to House ${targetBhava}. Enhances artistic talent, diplomacy, and interpersonal grace.`,
      kn: `ದೈತ್ಯಗುರು ಶುಕ್ರನ ಸೌಮ್ಯ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವಕ್ಕೆ ಕಾಂತಿ, ರಸಾಯನಿಕ ಸಮತೋಲನ, ಪ್ರಣಯ-ದಾಂಪತ್ಯ ಸೌಹಾರ್ದತೆ ಮತ್ತು ಸೌಂದರ್ಯ ಪ್ರಜ್ಞೆಯನ್ನು ತುಂಬುತ್ತದೆ.`,
      hi: `शुक्र देव की सौम्य दृष्टि भाव ${targetBhava} में तेज, सौन्दर्य, हार्मोनल संतुलन, माधुर्य एवं कलात्मक समृद्धि लाती है।`
    };
  }

  if (norm.includes('mercury') || norm.includes('budha')) {
    return {
      en: `Mercury infuses sharp analytical agility, communicative eloquence, cognitive balance, and nervous coordination into House ${targetBhava}.`,
      kn: `ಬುಧನ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವದಲ್ಲಿ ತೀಕ್ಷ್ಣ ಬುದ್ಧಿವಂತಿಕೆ, ವಾಕ್ ಚಾತುರ್ಯ, ನರಮಂಡಲದ ಚುರುಕುತನ ಮತ್ತು ಲೆಕ್ಕಾಚಾರದ ಕೌಶಲ್ಯವನ್ನು ಜಾಗೃತಗೊಳಿಸುತ್ತದೆ.`,
      hi: `बुध की दृष्टि भाव ${targetBhava} में तीक्ष्ण बुद्धि, वाकपटुता, तार्किक कुशलता एवं स्नायु शक्ति का विकास करती है।`
    };
  }

  if (norm.includes('moon') || norm.includes('chandra')) {
    return {
      en: `Moon blesses House ${targetBhava} with emotional receptivity, mental calmness, empathetic intuition, and healthy body fluid circulation.`,
      kn: `ಚಂದ್ರನ ಶೀತಲ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವಕ್ಕೆ ಮನಃಶಾಂತಿ, ತಾಯಿಯ ವಾತ್ಸಲ್ಯ, ಅಂತರ್ಮುಖಿ ಕಲ್ಪನಾಶಕ್ತಿ ಮತ್ತು ಶಾರೀರಿಕ ದ್ರವ ಸಮತೋಲನವನ್ನು ನೀಡುತ್ತದೆ.`,
      hi: `चन्द्रमा की शीतल दृष्टि भाव ${targetBhava} में मानसिक शान्ति, संवेदनशीलता, सौम्यता एवं जल-तत्व का संतुलन बनाती है।`
    };
  }

  if (norm.includes('sun') || norm.includes('surya')) {
    return {
      en: `Sun shines blazing solar radiance and soul-will into House ${targetBhava}. Heightens self-respect, bone strength, and leadership, but creates Pitta heat, impatience, and ego sensitivity.`,
      kn: `ಸೂರ್ಯನ ತೇಜೋಮಯ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವಕ್ಕೆ ಆತ್ಮಗೌರವ, ನಾಯಕತ್ವ ಮತ್ತು ಮೂಳೆಗಳ ಬಲವನ್ನು ತರುತ್ತದೆ; ಆದರೆ ಪಿತ್ತ ಪ್ರಕೋಪ, ಅತಿಯಾದ ಕಾವು ಮತ್ತು ಸ್ವಾಭಿಮಾನದ ಘರ್ಷಣೆಗೆ ಕಾರಣವಾಗಬಹುದು.`,
      hi: `सूर्य की प्रखर दृष्टि भाव ${targetBhava} में आत्मबल, नेतृत्व व अस्थि पुष्टि देती है; किन्तु पित्त की अधिकता व अहं की संवेदनशीलता बढ़ा सकती है।`
    };
  }

  if (norm.includes('mars') || norm.includes('kuja') || norm.includes('mangal')) {
    return {
      en: `Mars unleashes intense fiery drive (Agni) on House ${targetBhava}. Provides warrior courage and metabolic drive, but predisposes this house to inflammation, muscular tension, high blood pressure, and impulsiveness.`,
      kn: `ಕುಜನ ಕೆಂಡದಂತಹ ತೀಕ್ಷ್ಣ ದೃಷ್ಟಿ (ಅಗ್ನಿ ತತ್ವ) ${targetBhava}ನೇ ಭಾವದ ಮೇಲೆ ಬಿದ್ದಿದೆ. ಇದು ಅದ್ಭುತ ಧೈರ್ಯ ಮತ್ತು ಸಾಹಸ ನೀಡಿದರೂ, ರಕ್ತದೊತ್ತಡ, ಆವೇಶ, ಉರಿ-ಉರಿಯಾಗುವಿಕೆ ಮತ್ತು ಸ್ನಾಯು ಬಿಗಿತವನ್ನು ತರಬಹುದು.`,
      hi: `मंगल की उग्र अग्नि दृष्टि भाव ${targetBhava} में अदम्य साहस देती है, परन्तु रक्तचाप, दाह, क्रोध एवं मांसपेशियों में तनाव की प्रवृत्ति पैदा करती है।`
    };
  }

  if (norm.includes('saturn') || norm.includes('shani')) {
    return {
      en: `Saturn casts rigorous, disciplined gaze (Vata Drishti) on House ${targetBhava}. Demands patience, realism, and endurance, but causes delays, joint stiffness, melancholy, sluggish digestion, or periodic self-doubt.`,
      kn: `ಶನೀಶ್ವರನ ನಿಷ್ಠುರ ಮತ್ತು ಶಿಸ್ತಿನ ವಾತ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವದ ಮೇಲೆ ಬಿದ್ದಿದೆ. ಇದು ಜೀವನದಲ್ಲಿ ಸತತ ಪರಿಶ್ರಮ ಮತ್ತು ಸಹನೆ ಕಲಿಸುತ್ತದೆ; ಆದರೆ ವಿಳಂಬ, ಕೀಲು ನೋವು, ಅತಿಯಾದ ಆತಂಕ ಮತ್ತು ನಿರುತ್ಸಾಹದ ಅನುಭವ ತರಬಹುದು.`,
      hi: `शनि की कठोर दृष्टि भाव ${targetBhava} पर धैर्य, संयम व कर्मठता सिखाती है; किन्तु कार्यों में विलम्ब, जोड़ों का दर्द, वात विकार एवं उदासी ला सकती है।`
    };
  }

  if (norm.includes('rahu')) {
    return {
      en: `Rahu casts shadowy, electrifying obsession on House ${targetBhava}. Generates immense unconventional ambitions, but triggers sudden illusions, anxiety spikes, mysterious digestive upsets, and mental restlessness.`,
      kn: `ರಾಹುವಿನ ಛಾಯಾ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವಕ್ಕೆ ಅಸಾಮಾನ್ಯ ಮಹತ್ವಾಕಾಂಕ್ಷೆ ತುಂಬುತ್ತದೆ; ಆದರೆ ಭ್ರಮೆ, ನಿದ್ರಾಭಂಗ, ಅನಿರೀಕ್ಷಿತ ಅಲರ್ಜಿ ಮತ್ತು ಮನಸ್ಸಿನ ತಳಮಳವನ್ನು ಉಂಟುಮಾಡಬಹುದು.`,
      hi: `राहु की दृष्टि भाव ${targetBhava} में तीव्र महत्वाकांक्षा भरती है; किन्तु भ्रम, अनिद्रा, अज्ञात भय और पाचन सम्बन्धी अनपेक्षित विकार दे सकती है।`
    };
  }

  // Ketu
  return {
    en: `Ketu casts piercing spiritual detachment on House ${targetBhava}. Heightens psychic intuition and liberation instinct, but can trigger sudden disinterest, viral sensitivity, or localized nerve hypersensitivity.`,
    kn: `ಕೇತುವಿನ ಮೋಕ್ಷ ದೃಷ್ಟಿಯು ${targetBhava}ನೇ ಭಾವದಲ್ಲಿ ಲೌಕಿಕ ನಿರಾಸಕ್ತಿ ಮತ್ತು ತೀವ್ರ ಆಧ್ಯಾತ್ಮಿಕ ಅಂತಃಪ್ರಜ್ಞೆ ಮೂಡಿಸುತ್ತದೆ; ಆದರೆ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ/ಗಾಯಗಳ ಸಂವೇದನೆ ಅಥವಾ ರೋಗನಿರೋಧಕ ಏರುಪೇರು ತರಬಹುದು.`,
    hi: `केतु की दृष्टि भाव ${targetBhava} में वैराग्य व आत्मबोध जगाती है; परन्तु रहस्यमय संवेदनशीलता या अचानक विरक्ति ला सकती है।`
  };
}

// Anatomical & Physical details per Bhava
const BHAVA_PHYSICAL_DATA: Record<number, { organs: LocalizedString; vulnerabilities: LocalizedString }> = {
  1: {
    organs: { en: 'Head, brain, skull, facial structure, overall immune constitution', kn: 'ತಲೆ, ಮಿದುಳು, ಕಪಾಲ, ಮುಖಲಕ್ಷಣ, ಒಟ್ಟಾರೆ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ', hi: 'शीर्ष, मस्तिष्क, कपाल, मुखमण्डल एवं सम्पूर्ण देह' },
    vulnerabilities: { en: 'Headaches, migraines, vertigo, fever, cerebral circulation, general vitality drops', kn: 'ತಲೆನೋವು, ಮೈಗ್ರೇನ್, ತಲೆತಿರುಗುವಿಕೆ, ಜ್ವರ, ರಕ್ತಸಂಚಾರ ಏರುಪೇರು', hi: 'शिरोवेदना, माइग्रेन, चक्कर, ज्वर, मानसिक थकान' }
  },
  2: {
    organs: { en: 'Throat, vocal cords, thyroid gland, teeth, gums, tongue, right eye', kn: 'ಗಂಟಲು, ಧ್ವನಿಪೆಟ್ಟಿಗೆ, ಥೈರಾಯ್ಡ್ ಗ್ರಂಥಿ, ಹಲ್ಲುಗಳು, ನಾಲಿಗೆ, ಬಲಗಣ್ಣು', hi: 'कण्ठ, स्वरयंत्र, थायरॉयड, दन्त, जिह्वा, दाहिनी आँख' },
    vulnerabilities: { en: 'Thyroid imbalances, tonsillitis, dental decay, voice strain, eye dryness', kn: 'ಥೈರಾಯ್ಡ್ ಸಮಸ್ಯೆ, ಗಂಟಲು ಊತ, ಹಲ್ಲುಗಳ ಹುಳುಕು, ಧ್ವನಿ ಸೀಳು, ಕಣ್ಣಿನ ಶುಷ್ಕತೆ', hi: 'थायरॉयड विकार, गले में खराश, दन्तरोग, दृष्टि दोष' }
  },
  3: {
    organs: { en: 'Shoulders, collarbones, arms, hands, respiratory bronchi, hearing (ears)', kn: 'ಭುಜಗಳು, ಕೊರಳು ಮೂಳೆ, ತೋಳುಗಳು, ಕೈಗಳು, ಶ್ವಾಸನಾಳ, ಕಿವಿಗಳು (ಶ್ರವಣ)', hi: 'कन्धे, बाहें, हाथ, श्वासनलिका, कर्ण (कान)' },
    vulnerabilities: { en: 'Frozen shoulder, carpal tunnel, bronchial spasms, hearing sensitivities, nervous tremors', kn: 'ಭುಜದ ನೋವು, ತೋಳುಗಳ ಸೆಳೆತ, ಉಸಿರಾಟದ ಕಿರಿಕಿರಿ, ಕಿವಿ ಗುಯ್ಗುಟ್ಟುವುದು', hi: 'कंधे में जकड़न, श्वास विकार, कान में बजना, स्नायु कम्पन' }
  },
  4: {
    organs: { en: 'Chest, lungs, pericardium, cardiac muscle, ribs, diaphragm, breast tissue', kn: 'ಎದೆ, ಶ್ವಾಸಕೋಶಗಳು, ಹೃದಯ, ಪಕ್ಕೆಲುಬುಗಳು, ಡಯಾಫ್ರಾಮ್, ಸ್ತನ ಭಾಗ', hi: 'वक्षस्थल, फेफड़े, हृदय, पसलियाँ, छाती' },
    vulnerabilities: { en: 'Cardiac palpitations, asthma, chest congestion, fluid retention, emotional hypertension', kn: 'ಹೃದಯ ಬಡಿತ ಏರುಪೇರು, ಅಸ್ತಮಾ, ಕಫದ ಕಟ್ಟುವಿಕೆ, ಎದೆಯ ಭಾರ', hi: 'हृदय कम्पन, दमा, कफ जमाव, मानसिक तनावजन्य उच्च रक्तचाप' }
  },
  5: {
    organs: { en: 'Stomach, epigastrium, upper digestive fire (Jatharagni), liver, spleen, pancreas', kn: 'ಹೊಟ್ಟೆ, ಜಠರಾಗ್ನಿ (ಜೀರ್ಣ ಶಕ್ತಿ), ಪಿತ್ತಕೋಶ, ಯಕೃತ್ತು, ಗುಲ್ಮ, ಮೇದೋಜೀರಕ ಗ್ರಂಥಿ', hi: 'आमाशय, जठराग्नि, यकृत (लिवर), प्लीहा, अग्न्याशय' },
    vulnerabilities: { en: 'Acidity, GERD, enzyme deficiency, metabolic sluggishness, bile reflux, insulin fluctuations', kn: 'ಅಸಿಡಿಟಿ, ಜೀರ್ಣಶಕ್ತಿ ಮಂದತೆ, ಪಿತ್ತ ಪ್ರಕೋಪ, ಗ್ಯಾಸ್ಟ್ರಿಕ್, ಸಕ್ಕರೆ ಅಂಶ ವ್ಯತ್ಯಾಸ', hi: 'अम्लपित्त (एसिडिटी), मन्दाग्नि, यकृत विकार, पित्त वृद्धि' }
  },
  6: {
    organs: { en: 'Small and large intestines, kidneys, abdominal wall, appendix, immune leukocyte defense', kn: 'ಸಣ್ಣ ಮತ್ತು ದೊಡ್ಡ ಕರುಳು, ಮೂತ್ರಪಿಂಡಗಳು (ಕಿಡ್ನಿ), ಹೊಟ್ಟೆಯ ಒಳಪದರ, ರೋಗನಿರೋಧಕ ಕಣಗಳು', hi: 'छोटी व बड़ी आंत, वृक्क (किडनी), उदर भित्ति, रोग प्रतिरोध' },
    vulnerabilities: { en: 'IBS, colitis, renal stones, autoimmune inflammation, toxic accumulation, chronic fatigue', kn: 'ಕರುಳಿನ ಸೋಂಕು, ಕಿಡ್ನಿ ಕಲ್ಲು, ರಕ್ತಹೀನತೆ, ನಿಶ್ಯಕ್ತಿ, ಜೀರ್ಣಾಂಗಗಳ ಉರಿಯೂತ', hi: 'कोलाइटिस, पथरी, विषाक्तता, पाचन विकार, दीर्घकालिक रोग' }
  },
  7: {
    organs: { en: 'Lower abdomen, urinary bladder, reproductive pelvic organs, lumbar spine', kn: 'ಕಿಬ್ಬೊಟ್ಟೆ, ಮೂತ್ರಕೋಶ, ಜನನೇಂದ್ರಿಯಗಳು, ಗರ್ಭಾಶಯ, ಸೊಂಟದ ಮೂಳೆ', hi: 'मूत्राशय, प्रजनन अंग, गर्भाशय, कटि प्रदेश' },
    vulnerabilities: { en: 'Urinary tract infections, hormonal imbalances, pelvic congestion, lower back strain', kn: 'ಮೂತ್ರನಾಳದ ಉರಿ, ಹಾರ್ಮೋನು ಅಸಮತೋಲನ, ಬೆನ್ನುಹುರಿ ಸೆಳೆತ, ವಾತ ನೋವು', hi: 'मूत्र विकार, हार्मोनल असंतुलन, कमर दर्द, गर्भाशय शोथ' }
  },
  8: {
    organs: { en: 'Excretory system, colon, prostate, perineum, bone marrow, cellular regenerative stamina', kn: 'ಮಲವಿಸರ್ಜನಾ ಅಂಗಗಳು, ಪ್ರಾಸ್ಟೇಟ್, ಮೂಳೆ ಮಜ್ಜೆ, ದೀರ್ಘಕಾಲಿಕ ಜೀವಕೋಶೀಯ ರಕ್ಷಣೆ', hi: 'गुदा, मलाशय, प्रोस्टेट, अस्थि मज्जा, गूढ़ अंग' },
    vulnerabilities: { en: 'Piles, fissures, chronic deep-seated inflammation, regenerative exhaustion, toxicity', kn: 'ಮೂಲವ್ಯಾಧಿ (ಪೈಲ್ಸ್), ದೀರ್ಘಕಾಲದ ಮಲಬದ್ಧತೆ, ನರದೌರ್ಬಲ್ಯ, ಹಠಾತ್ ದಣಿವು', hi: 'अर्श (बवासीर), कब्ज, धातु क्षय, दीर्घकालिक वात विकार' }
  },
  9: {
    organs: { en: 'Hips, thighs, femoral arteries, sciatic nerve, sacral plexus, musculoskeletal alignment', kn: 'ಸೊಂಟದ ಭಾಗ, ತೊಡೆಗಳು, ಮುಖ್ಯ ರಕ್ತನಾಳಗಳು, ಸಯಾಟಿಕಾ ನರ, ಮೂಳೆ ಜೋಡಣೆ', hi: 'कूल्हे, जांघें, ऊरु धमनियां, सायटिका नाड़ी' },
    vulnerabilities: { en: 'Sciatica, arterial circulation stiffness, hip joint inflammation, liver-lipid imbalances', kn: 'ಸಯಾಟಿಕಾ ನರಶೂಲೆ, ತೊಡೆಯ ಸೆಳೆತ, ಸೊಂಟದ ಕೀಲು ನೋವು, ರಕ್ತಪರಿಚಲನೆ ಮಂದತೆ', hi: 'सायटिका, जांघों में दर्द, यकृत से सम्बद्ध वसा विकार' }
  },
  10: {
    organs: { en: 'Knees, patella, skeletal joints, vertebral spinal column, structural postural framework', kn: 'ಮೊಣಕಾಲುಗಳು, ಕೀಲುಗಳು, ಬೆನ್ನೆಲುಬು, ಶರೀರದ ನೇರ ನಿಲುವು & ಎಲುಬಿನ ಸಾಂದ್ರತೆ', hi: 'घुटने, संधियां (जोड़), रीढ़ की हड्डी, अस्थि ढांचा' },
    vulnerabilities: { en: 'Knee osteoarthritis, ligament strain, postural spondylitis, chronic fatigue from overwork', kn: 'ಮೊಣಕಾಲು ಸವೆತ, ಕೀಲುಗಳ ಶಬ್ದ/ನೋವು, ಸ್ಪಾಂಡಿಲೈಟಿಸ್, ಅತಿಯಾದ ಕೆಲಸದ ದಣಿವು', hi: 'घुटनों का दर्द, गठिया, स्पॉन्डिलाइटिस, कार्यभार जन्य थकान' }
  },
  11: {
    organs: { en: 'Calves, shins, ankles, peripheral circulation, lymphatic channels, left ear', kn: 'ಹಿಂಗಾಲುಗಳು, ಮೀನಖಂಡ, ಕಣಕಾಲು, ಬಾಹ್ಯ ರಕ್ತನಾಳಗಳು, ಎಡಕಿವಿ', hi: 'पिंडलियां, टखने, परिधीय रक्त संचार, बायां कान' },
    vulnerabilities: { en: 'Varicose veins, leg cramps, ankle swelling, peripheral neuropathy, lymphatic stagnation', kn: 'ಉಬ್ಬಿದ ರಕ್ತನಾಳಗಳು (ವೇರಿಕೋಸ್ ವೇನ್ಸ್), ಕಾಲಿನ ಸೆಳೆತ, ಕಣಕಾಲು ಊತ, ಎಡಕಿವಿ ದೋಷ', hi: 'वेरिकोज वेन्स, पैरों में ऐंठन, टखने की सूजन, वात विकार' }
  },
  12: {
    organs: { en: 'Feet, soles, toes, left eye, pineal circadian regulator, lymphatic drainage', kn: 'ಪಾದಗಳು, ಅಡಿಗಾಲು, ಕಾಲ್ಬೆರಳುಗಳು, ಎಡಗಣ್ಣು, ನಿದ್ರಾ ಚಕ್ರ (ಮೆಲಟೋನಿನ್), ದುಗ್ಧರಸ ನಾಳಗಳು', hi: 'पैर के तलवे, पैर की उंगलियां, बायीं आँख, पीनियल ग्रंथि' },
    vulnerabilities: { en: 'Insomnia, restless leg syndrome, plantar fasciitis, eye strain, immune drainage exhaustion', kn: 'ನಿದ್ರಾಹೀನತೆ (ನಿದ್ದೆ ಬಾರದಿರುವುದು), ಅಂಗಾಲು ಉರಿ, ಪಾದದ ನೋವು, ಎಡಗಣ್ಣಿನ ದಣಿವು', hi: 'अनिद्रा, तलवों में जलन, पैरों का दर्द, नेत्र विकार' }
  }
};

export function calculateHouseDrishti(kundaliData: KundaliData, targetBhava: number): HouseDrishtiAnalysis {
  const houseData = kundaliData.houses.find(h => h.bhava === targetBhava);
  const rashiIndex = houseData ? houseData.rashiIndex : (targetBhava - 1) % 12;
  const rashiName = houseData ? houseData.rashiName : { en: 'Rashi', kn: 'ರಾಶಿ', hi: 'राशि' };

  // 1. Occupant planets
  const occupants = kundaliData.planets.filter(p => p.bhava === targetBhava);

  // 2. Scan all planets for aspects onto targetBhava
  const aspectingPlanets: AspectInfo[] = [];

  kundaliData.planets.forEach(planet => {
    // A planet does not cast Parashari drishti on its own house
    if (planet.bhava === targetBhava) return;

    const planetAspects = getAspectingHousesForGraha(planet.name, planet.bhava);
    const matched = planetAspects.find(a => a.targetBhava === targetBhava);

    if (matched) {
      const nature = getDrishtiNature(planet.name);
      const effect = getPlanetAspectEffect(planet.name, matched.distance, targetBhava);

      let occupantEffect: LocalizedString | undefined = undefined;
      if (occupants.length > 0) {
        const occNames = occupants.map(o => o.sanskritName.kn).join(', ');
        const occNamesEn = occupants.map(o => o.name).join(', ');
        occupantEffect = {
          en: `${planet.name}'s aspect illuminates and modifies ${occNamesEn} in House ${targetBhava}, creating dynamic planetary interaction.`,
          kn: `${planet.sanskritName.kn}ನ ದೃಷ್ಟಿಯು ಈ ಭಾವದಲ್ಲಿರುವ ${occNames} ಗ್ರಹಗಳ ಮೇಲೆ ಬಿದ್ದು, ಅವುಗಳ ಫಲವನ್ನು ಪರಿವರ್ತಿಸುತ್ತದೆ.`,
          hi: `${planet.sanskritName.hi} की दृष्टि इस भाव में स्थित ${occNamesEn} पर पड़कर उनकी कार्यशक्ति को प्रभावित करती है।`
        };
      }

      aspectingPlanets.push({
        aspectingPlanet: planet,
        aspectType: matched.label.en,
        aspectTypeLocalized: matched.label,
        distanceFromPlanet: matched.distance,
        nature,
        natureLocalized: {
          en: nature === 'benefic' ? 'Benefic Glance (Subha Drishti)' : 'Malefic/Intense Glance (Krura Drishti)',
          kn: nature === 'benefic' ? 'ಶುಭ ದೃಷ್ಟಿ (ಅನುಗ್ರಹ)' : 'ಕ್ರೂರ / ತೀಕ್ಷ್ಣ ದೃಷ್ಟಿ (ಪರೀಕ್ಷೆ & ಎಚ್ಚರಿಕೆ)',
          hi: nature === 'benefic' ? 'शुभ दृष्टि (अमृत)' : 'क्रूर / तीव्र दृष्टि (चुनौती)'
        },
        effectOnHouse: effect,
        effectOnOccupants: occupantEffect
      });
    }
  });

  const beneficCount = aspectingPlanets.filter(a => a.nature === 'benefic').length;
  const maleficCount = aspectingPlanets.filter(a => a.nature === 'malefic').length;

  let overallTone: 'highly_auspicious' | 'auspicious' | 'mixed' | 'challenging' | 'intense' = 'mixed';
  let overallToneLocalized: LocalizedString;

  if (beneficCount >= 2 && maleficCount === 0) {
    overallTone = 'highly_auspicious';
    overallToneLocalized = {
      en: 'Highly Auspicious & Protected (Subha Drig-Yoga)',
      kn: 'ಪರಮ ಶುಭ & ರಕ್ಷಿತ ದೃಷ್ಟಿ (ಶುಭ ದೃಗ್-ಯೋಗ)',
      hi: 'परम शुभ एवं रक्षित (शुभ दृग-योग)'
    };
  } else if (beneficCount > maleficCount) {
    overallTone = 'auspicious';
    overallToneLocalized = {
      en: 'Auspicious & Supportive Glance (Subha Prabhavita)',
      kn: 'ಶುಭ ಪ್ರಭಾವಿತ ದೃಷ್ಟಿ (ಹಿತಕರ ಬೆಂಬಲ)',
      hi: 'शुभ दृष्टि समर्थित (अनुकूल प्रभाव)'
    };
  } else if (beneficCount === 0 && maleficCount >= 2) {
    overallTone = 'challenging';
    overallToneLocalized = {
      en: 'Challenging / Karmic Pressure (Papa Drig-Yoga - Requires Remediation)',
      kn: 'ತೀವ್ರ ಕಾರ್ಮಿಕ್ ಒತ್ತಡ (ಪಾಪ ದೃಗ್-ಯೋಗ - ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ)',
      hi: 'कठिन कार्मिक दबाव (पाप दृग-योग - शांति उपाय आवश्यक)'
    };
  } else if (maleficCount > beneficCount) {
    overallTone = 'intense';
    overallToneLocalized = {
      en: 'Rigorous & Transformative Glance (Krutrim/Agni Drishti)',
      kn: 'ಕಠಿಣ ಪರಿಶ್ರಮ & ಪರಿವರ್ತಕ ದೃಷ್ಟಿ',
      hi: 'तपस्या एवं परिवर्तनकारी दृष्टि'
    };
  } else {
    overallTone = 'mixed';
    overallToneLocalized = {
      en: 'Balanced / Mixed Planetary Influences (Mishra Phala)',
      kn: 'ಮಿಶ್ರ ಫಲದಾಯಕ ದೃಷ್ಟಿ (ಸಮತೋಲಿತ ಪರಿಣಾಮ)',
      hi: 'मिश्रित दृष्टि प्रभाव (सन्तुलित)'
    };
  }

  // Synthesize physical impact based on Bhava + Drishtis
  const basePhys = BHAVA_PHYSICAL_DATA[targetBhava] || BHAVA_PHYSICAL_DATA[1];

  // Specific planetary modifiers for health
  const hasMars = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('mars'));
  const hasSaturn = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('saturn'));
  const hasJupiter = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('jupiter'));
  const hasSun = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('sun'));
  const hasRahu = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('rahu'));
  const hasMoon = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('moon'));
  const hasVenus = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('venus'));
  const hasMercury = aspectingPlanets.some(a => a.aspectingPlanet.name.toLowerCase().includes('mercury'));

  // Compose Physical Conditions Impact
  let vitalityTextEn = 'Balanced vitality with standard physiological responses.';
  let vitalityTextKn = 'ಶರೀರದ ಜೀವಶಕ್ತಿಯು ಸಮತೋಲನದಲ್ಲಿದೆ; ಸಾಧಾರಣ ಚಟುವಟಿಕೆಗಳು ಸುಲಲಿತವಾಗಿ ನಡೆಯುತ್ತವೆ.';
  let vitalityTextHi = 'शारीरिक जीवन ऊर्जा सामान्य एवं संतुलित स्थिति में है।';

  if (hasJupiter) {
    vitalityTextEn = 'Elevated cellular recovery, strong immune resilience, and enhanced healing capacity under Jupiter’s nectar aspect.';
    vitalityTextKn = 'ಗುರುವಿನ ಅಮೃತ ದೃಷ್ಟಿಯಿಂದ ರೋಗನಿರೋಧಕ ಜೀವಕೋಶಗಳು ತ್ವರಿತವಾಗಿ ಚೇತರಿಸಿಕೊಳ್ಳುತ್ತವೆ; ನೈಸರ್ಗಿಕ ಆರೋಗ್ಯ ವರ್ಧನೆ.';
    vitalityTextHi = 'गुरु की अमृत दृष्टि से रोग प्रतिरोधक क्षमता और कोशिकाओं की नवीनीकरण शक्ति अत्यधिक प्रबल होती है।';
  } else if (hasSaturn && hasMars) {
    vitalityTextEn = 'Fluctuating vitality: High drive counterbalanced by sudden muscular fatigue, joint stiffness, and stress-induced exhaustion.';
    vitalityTextKn = 'ಶನಿ-ಕುಜರ ಸಂಯುಕ್ತ ದೃಷ್ಟಿಯಿಂದ ಸ್ನಾಯುಗಳ ಬಿಗಿತ, ಕೀಲು ನೋವು ಮತ್ತು ಹಠಾತ್ ದೈಹಿಕ ದಣಿವು ಕಾಣಿಸಿಕೊಳ್ಳಬಹುದು.';
    vitalityTextHi = 'शनि-मंगल के संयुक्त प्रभाव से मांसपेशियों में जकड़न, जोड़ों का दर्द और अचानक थकान हो सकती है।';
  } else if (hasMars) {
    vitalityTextEn = 'High metabolic heat (Pitta), intense physical drive, but prone to inflammatory spikes and blood pressure surges.';
    vitalityTextKn = 'ಉನ್ನತ ಚಯಾಪಚಯ ಶಕ್ತಿ ಮತ್ತು ಚುರುಕುತನ; ಆದರೆ ಪಿತ್ತದ ಏರಿಕೆ, ದೇಹದಲ್ಲಿ ಅತಿಯಾದ ಕಾವು ಮತ್ತು ರಕ್ತದೊತ್ತಡದ ಏರಿಳಿತ ಸಾಧ್ಯತೆ.';
    vitalityTextHi = 'उच्च पित्त ऊर्जा और सक्रियता; किन्तु दाह, रक्तचाप में वृद्धि और सूजन की सम्भावना रहती है।';
  } else if (hasSaturn) {
    vitalityTextEn = 'Sluggish metabolic rate (Vata), dry tissue constitution, and cold tolerance sensitivity; requires warmth and joint lubrication.';
    vitalityTextKn = 'ವಾತ ದೋಷದ ಪ್ರಭಾವದಿಂದ ಕೀಲುಗಳಲ್ಲಿ ನಯ ನಾಶ, ಶುಷ್ಕತೆ ಮತ್ತು ನಿಧಾನ ಜೀರ್ಣಕ್ರಿಯೆ; ಶರೀರಕ್ಕೆ ಶಾಖ ಮತ್ತು ಎಣ್ಣೆ ಪೋಷಣೆ ಅಗತ್ಯ.';
    vitalityTextHi = 'वात विकार के कारण अंगों में रूखापन, जोड़ों में शिथिलता एवं मन्द गति; शरीर को उष्णता व पोषण की आवश्यकता है।';
  }

  // Compose Mental Conditions Impact
  let temperamentEn = 'Harmonious, adaptable, and emotionally receptive.';
  let temperamentKn = 'ಸೌಮ್ಯ, ಪರಿಸ್ಥಿತಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಸಮತೋಲನದ ಮನಸ್ಥಿತಿ.';
  let temperamentHi = 'सौम्य, संवेदनशील और परिस्थितियों के अनुकूल ढलने वाली मनोवृत्ति।';

  if (hasSaturn && hasRahu) {
    temperamentEn = 'Overly cautious, prone to deep analytical anxiety, overthinking worst-case scenarios, but possesses deep persevering grit.';
    temperamentKn = 'ಅತಿಯಾದ ಮುನ್ನೆಚ್ಚರಿಕೆ, ಭವಿಷ್ಯದ ಬಗ್ಗೆ ಅನಿಶ್ಚಿತ ಆತಂಕ, ಒಂಟಿತನದ ಭಾವನೆ; ಆದರೆ ಸತತ ಶ್ರಮಿಸುವ ಅದ್ಭುತ ಸಹನೆ.';
    temperamentHi = 'अत्यधिक सतर्क, अज्ञात चिंताओं से घिरने की प्रवृत्ति; किन्तु गहन धैर्य और विपत्तियों से जूझने की शक्ति।';
  } else if (hasMars) {
    temperamentEn = 'Courageous, assertive, rapid decision-maker, but quickly provoked by delays; needs cooling mental outlets.';
    temperamentKn = 'ಅಪಾರ ಧೈರ್ಯ, ತಕ್ಷಣ ತೀರ್ಮಾನ ಕೈಗೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯ; ಆದರೆ ವಿಳಂಬವಾದರೆ ಕೋಪ, ಅಸಹನೆ ಮತ್ತು ಆವೇಶದ ಪ್ರವೃತ್ತಿ.';
    temperamentHi = 'साहसी, स्वाभिमानी, तुरंत निर्णय लेने वाला; किन्तु अधीरता एवं शीघ्र क्रोधित होने की सम्भावना।';
  } else if (hasJupiter) {
    temperamentEn = 'Optimistic, philosophical, ethically rooted, patient, and naturally generous in disposition.';
    temperamentKn = 'ಆಶಾವಾದಿ, ತಾಳ್ಮೆ, ಧಾರ್ಮಿಕ ಚಿಂತನೆ, ವಿಶಾಲ ಹೃದಯ ಮತ್ತು ಯಾವುದೇ ಕಷ್ಟದಲ್ಲೂ ಧೈರ್ಯ ಕಳೆದುಕೊಳ್ಳದ ಸಮಾಧಾನ.';
    temperamentHi = 'सकारात्मक, धैर्यवान, धार्मिक आस्थावान और विशाल हृदय; कठिन समय में भी मानसिक शांति।';
  }

  // Compose Nutritional Therapy
  let recFoodsEn = 'Whole grains, seasonal local fruits, moong dal, steamed vegetables, and adequate pure water.';
  let recFoodsKn = 'ಹೆಸರು ಬೇಳೆ, ಹಸಿರು ತರಕಾರಿಗಳು, ದೇಶಿ ಹಸುವಿನ ತುಪ್ಪ, ದಾಳಿಂಬೆ, ಮಜ್ಜಿಗೆ ಮತ್ತು ಸಾಕಷ್ಟು ಶುದ್ಧ ನೀರು.';
  let recFoodsHi = 'मूंग दाल, हरी सब्जियां, देशी गाय का घी, अनार, छाछ एवं पर्याप्त जल।';

  let avoidFoodsEn = 'Excessive red chili, stale or reheated food, carbonated drinks, and extremely oily deep-fries.';
  let avoidFoodsKn = 'ಅತಿಯಾದ ಖಾರ, ಹಳೆಯ/ತಂಗಿಟ್ಟ ಆಹಾರ, ಕರಿದ ತಿಂಡಿಗಳು, ಕೃತಕ ತಂಪು ಪಾನೀಯಗಳು ಮತ್ತು ಅತಿಯಾದ ಕಾಫಿ-ಟೀ.';
  let avoidFoodsHi = 'अत्यधिक तीखा, बासी भोजन, गहरे तले पदार्थ एवं अधिक चाय-कॉफी।';

  let vitaminsEn = 'Vitamin B-Complex, Vitamin D3 (from morning sunlight), Magnesium, and Natural Antioxidants.';
  let vitaminsKn = 'ವಿಟಮಿನ್ ಬಿ-ಕಾಂಪ್ಲೆಕ್ಸ್, ವಿಟಮಿನ್ ಡಿ೩ (ಬೆಳಗಿನ ಬಿಸಿಲು), ಮೆಗ್ನೀಸಿಯಮ್ ಮತ್ತು ರೋಗನಿರೋಧಕ ಉತ್ಕರ್ಷಣ ನಿರೋಧಕಗಳು.';
  let vitaminsHi = 'विटामिन बी-कॉम्प्लेक्स, विटामिन डी३ (प्रातःकाल की धूप), मैग्नीशियम एवं प्राकृतिक एंटीऑक्सीडेंट।';

  let herbsEn = 'Ashwagandha, Tulasi, Amla (Indian Gooseberry), Brahmi, and Turmeric milk.';
  let herbsKn = 'ಅಶ್ವಗಂಧ, ತುಳಸಿ, ನೆಲ್ಲಿಕಾಯಿ (ಆಮ್ಲ), ಬ್ರಾಹ್ಮಿ, ಮತ್ತು ಹಾಲಿನೊಂದಿಗೆ ಅರಿಶಿನ (ಗೋಲ್ಡನ್ ಮಿಲ್ಕ್).';
  let herbsHi = 'अश्वगंधा, तुलसी, आंवला, ब्राह्मी एवं हल्दी युक्त दूध।';

  if (hasMars) {
    recFoodsEn = 'Cooling foods: Coconut water, pomegranate, fennel infusion, sweet melons, barley water, soaked raisins, cilantro/coriander.';
    recFoodsKn = 'ತಂಪಾದ ಆಹಾರಗಳು: ಎಳನೀರು, ದಾಳಿಂಬೆ ಹಣ್ಣು, ಸೋಂಪು ಕಷಾಯ, ಸೌತೆಕಾಯಿ, ಜವೆಗೋಧಿ (ಬಾರ್ಲಿ) ನೀರು, ನೆನೆಸಿದ ಒಣದ್ರಾಕ್ಷಿ, ಕೊತ್ತಂಬರಿ ಬೀಜದ ನೀರು.';
    recFoodsHi = 'शीतल आहार: नारियल पानी, अनार, सौंफ का पानी, खीरा, जौ का पानी, भीगी किशमिश एवं धनिया।';

    avoidFoodsEn = 'Pungent red chilies, mustard, excessive garlic, alcohol, vinegar, and heavy sour curds at night.';
    avoidFoodsKn = 'ಅತಿಯಾದ ಹಸಿಮೆಣಸಿನಕಾಯಿ, ಸಾಸಿವೆ, ರಾತ್ರಿ ಹೊತ್ತು ಹುಳಿ ಮೊಸರು, ಕರಿದ ಮಾಂಸಾಹಾರ ಮತ್ತು ಮದ್ಯಪಾನ ಕಡ್ಡಾಯವಾಗಿ ತ್ಯಜಿಸಿ.';
    avoidFoodsHi = 'अत्यधिक लाल मिर्च, सरसों, लहसुन की अधिकता, मद्यपान और रात में खट्टा दही।';

    vitaminsEn = 'Vitamin C (Amla), Iron (Beetroot, Dates), Electrolytes (Potassium & Sodium balance), and Zinc.';
    vitaminsKn = 'ವಿಟಮಿನ್ ಸಿ (ನೆಲ್ಲಿಕಾಯಿ), ಕಬ್ಬಿಣಾಂಶ (ಬೀಟ್‌ರೂಟ್, ಉತ್ತತ್ತಿ/ಖರ್ಜೂರ), ಪೊಟ್ಯಾಸಿಯಮ್ ಎಲೆಕ್ಟ್ರೋಲೈಟ್‌ಗಳು ಮತ್ತು ಸತು (Zinc).';
    vitaminsHi = 'विटामिन सी (आंवला), लौह तत्व (चुकंदर, खजूर), पोटैशियम एवं जिंक।';

    herbsEn = 'Shatavari, Chandana (Sandalwood water), Vetiver (Ushira) infusion, Coriander seed decoction, and Aloe vera juice.';
    herbsKn = 'ಶತಾವರಿ, ಶ್ರೀಗಂಧದ ನೀರು, ಲಾಮಂಚದ ಕಷಾಯ, ಕೊತ್ತಂಬರಿ ತಣ್ಣೀರು, ಮತ್ತು ಲೋಳೆಸರ (ಅಲೋವೆರಾ) ರಸ.';
    herbsHi = 'शतावरी, चन्दन जल, खस का शर्बत, धनिए का काढ़ा एवं घृतकुमारी (एलोवेरा) रस।';
  } else if (hasSaturn) {
    recFoodsEn = 'Warm, nourishing Vata-pacifying foods: Warm sesame oil preparations, cooked porridge, pumpkin seeds, soaked almonds, black raisins, pure A2 cow ghee.';
    recFoodsKn = 'ಉಷ್ಣ ಹಾಗೂ ಪೋಷಕ ಆಹಾರಗಳು: ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ, ಎಳ್ಳು, ಬಿಸಿ ಗಂಜಿ, ಕುಂಬಳಕಾಯಿ ಬೀಜಗಳು, ನೆನೆಸಿದ ಬಾದಾಮಿ, ಕಪ್ಪು ಒಣದ್ರಾಕ್ಷಿ, ಮಣ್ಣಿನ ಮಡಕೆಯ ಆಹಾರ.';
    recFoodsKn = 'ಉಷ್ಣ ಹಾಗೂ ಪೋಷಕ ಆಹಾರಗಳು: ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ, ಎಳ್ಳು, ಬಿಸಿ ಗಂಜಿ, ಕುಂಬಳಕಾಯಿ ಬೀಜಗಳು, ನೆನೆಸಿದ ಬಾದಾಮಿ, ಕಪ್ಪು ಒಣದ್ರಾಕ್ಷಿ.';
    recFoodsHi = 'उष्ण व स्निग्ध आहार: देशी गाय का घी, तिल, गर्म दलिया, कद्दू के बीज, बादाम, काली किशमिश एवं सुपाच्य सूप।';

    avoidFoodsEn = 'Cold iced drinks, dry crackers, raw uncooked salads, processed white flour, cabbage, and excess bitter astringents.';
    avoidFoodsKn = 'ಫ್ರಿಡ್ಜ್‌ನ ತಣ್ಣೀರು, ಒಣಗಿದ ತಿನಿಸುಗಳು, ಮೈದಾ ಪದಾರ್ಥಗಳು, ಹಸಿ ತರಕಾರಿ ಸಲಾಡ್, ಮತ್ತು ತಂಗಳು ಅನ್ನ.';
    avoidFoodsHi = 'अत्यधिक ठंडा जल, सूखे खाद्य पदार्थ, कच्चा सलाद, मैदा एवं बासी भोजन।';

    vitaminsEn = 'Magnesium Glycinate (muscle relaxation), Vitamin D3 + K2 (bone density), Calcium, and Omega-3 Fatty Acids.';
    vitaminsKn = 'ಮೆಗ್ನೀಸಿಯಮ್ (ಸ್ನಾಯು ವಿಶ್ರಾಂತಿ), ವಿಟಮಿನ್ ಡಿ೩ + ಕೆ೨ (ಮೂಳೆ ಬಲ), ಕ್ಯಾಲ್ಸಿಯಂ, ಮತ್ತು ಒಮೆಗಾ-೩ ಕೊಬ್ಬಿನಾಮ್ಲಗಳು.';
    vitaminsHi = 'मैग्नीशियम, विटामिन डी३ व के२ (अस्थि पुष्टि), कैल्शियम एवं ओमेगा-३ फैटी एसिड।';

    herbsEn = 'Ashwagandha with warm milk, Guggulu, Bala (Sida cordifolia), Ginger-dry ginger (Shunti) infusion, and Pippali.';
    herbsKn = 'ಅಶ್ವಗಂಧ ಚೂರ್ಣ (ಬಿಸಿ ಹಾಲಿನಲ್ಲಿ), ಗುಗ್ಗುಳು, ಬಲಾ ಮೂಲ, ಒಣಶುಂಠಿ ಕಷಾಯ, ಮತ್ತು ಹಿಪ್ಪಲಿ.';
    herbsHi = 'दूध के साथ अश्वगंधा, गुग्गुल, बला, सौंठ का काढ़ा एवं पिप्पली।';
  } else if (hasRahu) {
    recFoodsEn = 'Easily digestible detoxifying foods: Fresh vegetable broths, green mung soup, probiotic buttermilk with cumin, and herbal detox teas.';
    recFoodsKn = 'ಸುಲಭ ಜೀರ್ಣವಾಗುವ ಆಹಾರ: ಹೆಸರು ಬೇಳೆ ಕಟ್ಟು, ಜೀರಿಗೆ ಒಗ್ಗರಣೆ ಹಾಕಿದ ಮಜ್ಜಿಗೆ, ತರಕಾರಿ ಸೂಪ್, ಶುದ್ಧ ಗಿಡಮೂಲಿಕೆ ಚಹಾ.';
    recFoodsHi = 'सुपाच्य व विषाक्तता दूर करने वाला आहार: मूंग की दाल का सूप, जीरा युक्त ताजी छाछ, लौकी का सूप।';

    avoidFoodsEn = 'Artificially flavored junk foods, stale leftovers, fermented bakery yeasts, and irregular erratic meal timings.';
    avoidFoodsKn = 'ಕೃತಕ ಬಣ್ಣಗಳ ಜಂಕ್ ಫುಡ್, ಬೇಕರಿ ಪದಾರ್ಥಗಳು, ತಡರಾತ್ರಿಯ ಊಟ, ಮತ್ತು ನಿಗದಿತ ಸಮಯವಿಲ್ಲದೆ ತಿನ್ನುವ ಅಭ್ಯಾಸ.';
    avoidFoodsHi = 'कृत्रिम रंग वाले जंक फूड, बेकरी उत्पाद, रात में देर से भोजन एवं अनियमित खानपान।';

    vitaminsEn = 'Biotin, Vitamin B12, Gut-healing Probiotics, and Selenium for nervous stability.';
    vitaminsKn = 'ವಿಟಮಿನ್ ಬಿ೧೨, ಬಯೋಟಿನ್, ಹೊಟ್ಟೆಯ ಆರೋಗ್ಯಕ್ಕೆ ಪ್ರೋಬಯಾಟಿಕ್ಸ್, ಮತ್ತು ಸೆಲೆನಿಯಮ್.';
    vitaminsHi = 'विटामिन बी१२, प्रोबायोटिक्स, बायोटिन एवं सेलेनियम।';

    herbsEn = 'Brahmi, Shankhapushpi, Vacha (Acorus calamus), Tulasi tea, and Triphala at bedtime.';
    herbsKn = 'ಬ್ರಾಹ್ಮಿ, ಶಂಖಪುಷ್ಪಿ, ಬಜೆ (ವಚಾ), ತುಳಸಿ ಚಹಾ, ಮತ್ತು ರಾತ್ರಿ ಮಲಗುವಾಗ ತ್ರಿಫಲಾ ಚೂರ್ಣ.';
    herbsHi = 'ब्राह्मी, शंखपुष्पी, वचा, तुलसी चाय एवं रात्रि में त्रिफला चूर्ण।';
  }

  // Compose Astrological Remedies
  let mantraEn = 'Om Namah Shivaya (108 times daily for mind-body alignment)';
  let mantraKn = 'ಓಂ ನಮಃ ಶಿವಾಯ (ದಿನಕ್ಕೆ ೧೦೮ ಬಾರಿ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆಯಲ್ಲಿ ಜಪಿಸಿ)';
  let mantraHi = 'ॐ नमः शिवाय (नित्य १०८ बार जप)';

  let gemRudrakshaEn = '5-Mukhi Rudraksha (Universal health and mental balance)';
  let gemRudrakshaKn = '೫-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಆರೋಗ್ಯ ಮತ್ತು ಮನಃಶಾಂತಿಗಾಗಿ ಧಾರಣೆ)';
  let gemRudrakshaHi = '५-मुखी रुद्राक्ष (आरोग्य एवं मानसिक शांति हेतु)';

  let daanamEn = 'Anna Daanam (grain or food distribution) on Thursdays or Saturdays to the needy.';
  let daanamKn = 'ಗುರುವಾರ ಅಥವಾ ಶನಿವಾರದಂದು ನಿರ್ಗತಿಕರಿಗೆ ಅನ್ನದಾನ ಅಥವಾ ದಿನಸಿ ದಾನ.';
  let daanamHi = 'गुरुवार या शनिवार को जरूरतमंदों को अन्न दान करें।';

  let practiceEn = 'Early morning Surya Namaskar facing East followed by lighting a cow ghee Deepa at Sandhya kala.';
  let practiceKn = 'ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಹಾಗೂ ಸಂಧ್ಯಾ ಕಾಲದಲ್ಲಿ ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪದ ದೀಪ ಪ್ರಜ್ವಲನೆ.';
  let practiceHi = 'प्रातः सूर्य नमस्कार एवं संध्या समय शुद्ध घी का दीपक प्रज्वलित करें।';

  // Customize if aspected by specific Grahas
  if (hasMars) {
    mantraEn = 'Om Kram Kreem Kroum Sah Bhaumaya Namaha • Sri Durga Gayatri (108 times)';
    mantraKn = 'ಓಂ ಕ್ರಾಂ ಕ್ರೀಂ ಕ್ರೌಂ ಸಃ ಭೌಮಾಯ ನಮಃ • ಶ್ರೀ ದುರ್ಗಾ ಗಾಯತ್ರಿ ಮಂತ್ರ (೧೦೮ ಬಾರಿ)';
    mantraHi = 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः • श्री दुर्गा गायत्री';

    gemRudrakshaEn = '3-Mukhi Rudraksha (Purifies Agni and resolves anger/inflammation). Red Coral (Moonga) only after chart verification.';
    gemRudrakshaKn = '೩-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಅಗ್ನಿ ತತ್ವ ಶುದ್ಧಿ ಮತ್ತು ಶಾಂತಿ). ಕುಜ ಶುಭನಾಗಿದ್ದರೆ ಮಾತ್ರ ಹವಳ ರತ್ನ ಧಾರಣೆ.';
    gemRudrakshaHi = '३-मुखी रुद्राक्ष (अग्नि तत्व संतुलन हेतु)। कुण्डली जांचकर मूंगा धारण।';

    daanamEn = 'Donate red lentils (Masoor dal), jaggery, or copper vessels on Tuesday afternoons.';
    daanamKn = 'ಮಂಗಳವಾರ ಮಧ್ಯಾಹ್ನ ಕೆಂಪು ತೊಗರಿ/ಮಸೂರ ಬೇಳೆ, ಬೆಲ್ಲ, ಅಥವಾ ತಾಮ್ರದ ಪಾತ್ರೆ ದಾನ.';
    daanamHi = 'मंगलवार को लाल मसूर, गुड़ या तांबे का पात्र दान करें।';

    practiceEn = 'Cooling Sheetali & Sheetkari Pranayama to dissipate excess internal heat; walk barefoot on morning dew grass.';
    practiceKn = 'ಶೀತಲೀ & ಶೀತಕಾರೀ ಪ್ರಾಣಾಯಾಮ (ಪಿತ್ತ ತಗ್ಗಿಸಲು); ಬೆಳಗಿನ ಹಸಿರು ಹುಲ್ಲಿನ ಮೇಲೆ ಬರಿಗಾಲಿನ ನಡಿಗೆ.';
    practiceHi = 'शीतली एवं शीतकारी प्राणायाम; प्रातः हरी घास पर नंगे पैर भ्रमण।';
  } else if (hasSaturn) {
    mantraEn = 'Om Sham Shanaishcharaya Namaha • Maha Mrityunjaya Mantra (108 times)';
    mantraKn = 'ಓಂ ಶಂ ಶನೈಶ್ಚರಾಯ ನಮಃ • ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ (೧೦೮ ಬಾರಿ)';
    mantraHi = 'ॐ शं शनैश्चराय नमः • महामृत्युंजय मन्त्र';

    gemRudrakshaEn = '7-Mukhi or 14-Mukhi Rudraksha (Soothes Vata and brings long-term protection). Blue Sapphire (Neelam) strictly under guidance.';
    gemRudrakshaKn = '೭-ಮುಖಿ ಅಥವಾ ೧೪-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ವಾತ ಶಾಂತಿ & ಆಯುರ್ವೃದ್ಧಿ). ನೀಲ ರತ್ನ ಕೇವಲ ಪರಿಣಿತರ ಸಲಹೆಯಿಂದ ಮಾತ್ರ.';
    gemRudrakshaHi = '७-मुखी अथवा १४-मुखी रुद्राक्ष (वात दोष निवारण)। नीलम केवल विद्वान परामर्श से।';

    daanamEn = 'Donate black sesame seeds (Til), mustard oil, or warm iron/blankets to elderly laborers on Saturdays.';
    daanamKn = 'ಶನಿವಾರದಂದು ಕಪ್ಪು ಎಳ್ಳು, ಸಾಸಿವೆ ಎಣ್ಣೆ, ಅಥವಾ ಚಳಿಗಾಲದ ಕಂಬಳಿ/ಉಡುಪುಗಳನ್ನು ವೃದ್ಧ ಕಾರ್ಮಿಕರಿಗೆ ದಾನ ಮಾಡಿ.';
    daanamHi = 'शनिवार को काले तिल, सरसों का तेल अथवा ऊनी वस्त्र जरूरतमंदों को दान करें।';

    practiceEn = 'Abhyanga (warm sesame oil self-massage) on Saturdays before bath; lighting a Sesame/Mustard oil lamp facing West.';
    practiceKn = 'ಶನಿವಾರ ಅಭ್ಯಂಗ ಸ್ನಾನ (ಬಿಸಿ ಎಳ್ಳೆಣ್ಣೆ ಮಸಾಜ್); ಸಂಜೆ ಪಶ್ಚಿಮ ದಿಕ್ಕಿನಲ್ಲಿ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಪ್ರಜ್ವಲನೆ.';
    practiceHi = 'शनिवार को गुनगुने तिल के तेल से मालिश (अभ्यंग); पश्चिम दिशा में तिल के तेल का दीपक।';
  } else if (hasJupiter) {
    mantraEn = 'Om Gram Greem Groum Sah Gurave Namaha • Sri Dakshinamurthy Stotram';
    mantraKn = 'ಓಂ ಗ್ರಾಂ ಗ್ರೀಂ ಗ್ರೌಂ ಸಃ ಗುರವೇ ನಮಃ • ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ ಸ್ತೋತ್ರ';
    mantraHi = 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः • श्री दक्षिणामूर्ति स्तोत्र';

    gemRudrakshaEn = '5-Mukhi Rudraksha or Yellow Sapphire (Pukhraj) set in gold/panchadhatu on Index finger.';
    gemRudrakshaKn = '೫-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಅಥವಾ ಹಳದಿ ಪುಷ್ಯರಾಗ (ಪುಖ್‌ರಾಜ್) ರತ್ನವನ್ನು ತೋರುಬೆರಳಿಗೆ ಧಾರಣೆ.';
    gemRudrakshaHi = '५-मुखी रुद्राक्ष अथवा पुखराज तर्जनी उंगली में धारण करें।';

    daanamEn = 'Donate yellow split chickpeas (Chana dal), turmeric, or books to students on Thursdays.';
    daanamKn = 'ಗುರುವಾರ ಕಡಲೆಬೇಳೆ, ಅರಿಶಿನ ಕೊಂಬು, ಅಥವಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪುಸ್ತಕ/ವಿದ್ಯಾ ದಾನ.';
    daanamHi = 'गुरुवार को चने की दाल, हल्दी अथवा विद्यार्थियों को पुस्तकें दान करें।';

    practiceEn = 'Worship the Peepal (Ashvattha) or Banana tree on Thursday mornings with water and a pinch of turmeric.';
    practiceKn = 'ಗುರುವಾರ ಬೆಳಿಗ್ಗೆ ಅಶ್ವತ್ಥ ವೃಕ್ಷಕ್ಕೆ ಅರಿಶಿನ ಬೆರೆಸಿದ ಶುದ್ಧ ನೀರಿನ ಅರ್ಘ್ಯ ಅರ್ಪಣೆ.';
    practiceHi = 'गुरुवार प्रातः पीपल या केले के वृक्ष को हल्दी मिश्रित जल अर्पित करें।';
  }

  return {
    bhava: targetBhava,
    bhavaName: {
      en: `House ${targetBhava}`,
      kn: `${targetBhava}ನೇ ಭಾವ`,
      hi: `${targetBhava}वां भाव`
    },
    rashiIndex,
    rashiName,
    occupantPlanets: occupants,
    aspectingPlanets,
    beneficAspectCount: beneficCount,
    maleficAspectCount: maleficCount,
    overallDrishtiTone: overallTone,
    overallDrishtiToneLocalized: overallToneLocalized,
    physicalImpact: {
      governedOrgans: basePhys.organs,
      vulnerabilities: basePhys.vulnerabilities,
      symptomsToWatch: {
        en: `Watch for stress, inflammation, and fatigue concentrated around the governed organs of House ${targetBhava}.`,
        kn: `${targetBhava}ನೇ ಭಾವದ ಅಂಗಗಳಾದ ${basePhys.organs.kn} ಭಾಗದಲ್ಲಿ ಆಯಾಸ, ಸೆಳೆತ ಅಥವಾ ಉರಿಯೂತದ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ.`,
        hi: `${targetBhava}वें भाव से सम्बद्ध अंगों में थकान या खिंचाव के लक्षणों पर ध्यान दें।`
      },
      vitalityEffect: {
        en: vitalityTextEn,
        kn: vitalityTextKn,
        hi: vitalityTextHi
      }
    },
    mentalImpact: {
      temperament: {
        en: temperamentEn,
        kn: temperamentKn,
        hi: temperamentHi
      },
      emotionalTendencies: {
        en: hasMoon || hasVenus ? 'Deeply intuitive, romantic, sensitive, and emotionally expressive.' : 'Focused, self-reliant, guarded, and logically analytical.',
        kn: hasMoon || hasVenus ? 'ತೀವ್ರ ಅಂತರ್ಮುಖಿ, ಪ್ರೀತಿಯಿಂದ ಕೂಡಿದ, ಕಲಾತ್ಮಕ ಮತ್ತು ಭಾವನಾತ್ಮಕ ವ್ಯಕ್ತಿತ್ವ.' : 'ಏಕಾಗ್ರತೆ, ಸ್ವಾಭಿಮಾನ, ಮತ್ತು ತಾರ್ಕಿಕವಾಗಿ ಆಲೋಚಿಸುವ ಮನೋಧರ್ಮ.',
        hi: hasMoon || hasVenus ? 'संवेदनशील, कलाप्रिय एवं भावनात्मक।' : 'आत्मनिर्भर, केंद्रित एवं तार्किक।'
      },
      stressTriggers: {
        en: hasMars ? 'Impatience, disrespect, delays in execution, physical obstruction.' : hasSaturn ? 'Uncertainty, heavy burdens, fear of scarcity, loneliness.' : 'Chaos, lack of mental stimulation, or loss of harmony.',
        kn: hasMars ? 'ಕೆಲಸದಲ್ಲಿ ಅಡಚಣೆ, ತಾಳ್ಮೆ ಕಳೆದುಕೊಳ್ಳುವುದು, ಗೌರವಕ್ಕೆ ಧಕ್ಕೆ.' : hasSaturn ? 'ಅತಿಯಾದ ಜವಾಬ್ದಾರಿ, ಆರ್ಥಿಕ ಅಭದ್ರತೆಯ ಭಯ, ಒಂಟಿತನ.' : 'ಅಶಾಂತಿ ಮತ್ತು ಅಸಮರ್ಪಕತೆ.',
        hi: hasMars ? 'विलम्ब, अनादर एवं रुकावटें।' : hasSaturn ? 'असुरक्षा की भावना, अत्यधिक दायित्व एवं एकाकीपन।' : 'अव्यवस्था एवं कलह।'
      },
      cognitiveStrength: {
        en: hasMercury || hasJupiter ? 'High intellectual discernment, strategic foresight, and profound memory retention.' : 'Resilient practical grit, experiential wisdom, and instinctual caution.',
        kn: hasMercury || hasJupiter ? 'ಅದ್ಭುತ ಗ್ರಹಣ ಶಕ್ತಿ, ದೂರದೃಷ್ಟಿ, ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ನೆನಪಿನ ಶಕ್ತಿ.' : 'ಪ್ರಾಯೋಗಿಕ ಅನುಭವ, ಜಾಗರೂಕತೆ ಮತ್ತು ಸಹನೆ.',
        hi: hasMercury || hasJupiter ? 'कुशाग्र बुद्धि, दूरदर्शिता एवं उत्तम स्मरण शक्ति।' : 'व्यावहारिक समझ एवं संयम।'
      }
    },
    nutritionalTherapy: {
      recommendedFoods: {
        en: recFoodsEn,
        kn: recFoodsKn,
        hi: recFoodsHi
      },
      vitaminsAndNutrients: {
        en: vitaminsEn,
        kn: vitaminsKn,
        hi: vitaminsHi
      },
      ayurvedicHerbs: {
        en: herbsEn,
        kn: herbsKn,
        hi: herbsHi
      },
      foodsToAvoid: {
        en: avoidFoodsEn,
        kn: avoidFoodsKn,
        hi: avoidFoodsHi
      },
      dietaryRitual: {
        en: 'Consume warm, freshly prepared meals in a serene atmosphere without screen distractions. Drink lukewarm water sipping slowly.',
        kn: 'ಪ್ರಶಾಂತ ವಾತಾವರಣದಲ್ಲಿ, ಮೊಬೈಲ್/ಟಿವಿ ನೋಡದೆ, ಮೈಮನಸ್ಸು ಕೊಟ್ಟು ಬಿಸಿ ಸಾತ್ವಿಕ ಊಟ ಸೇವಿಸಿ. ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರನ್ನು ಗುಟುಕು ಗುಟುಕಾಗಿ ಕುಡಿಯಿರಿ.',
        hi: 'शान्त वातावरण में बिना किसी व्यवधान (मोबाइल/टीवी) के ताजा व सुपाच्य भोजन ग्रहण करें। गुनगुना जल पिएं।'
      }
    },
    astrologicalRemedies: {
      vedicMantra: {
        en: mantraEn,
        kn: mantraKn,
        hi: mantraHi
      },
      gemstoneAndRudraksha: {
        en: gemRudrakshaEn,
        kn: gemRudrakshaKn,
        hi: gemRudrakshaHi
      },
      daanamCharity: {
        en: daanamEn,
        kn: daanamKn,
        hi: daanamHi
      },
      spiritualPractice: {
        en: practiceEn,
        kn: practiceKn,
        hi: practiceHi
      }
    }
  };
}

export function calculateAllHousesDrishtiSummary(kundaliData: KundaliData): HouseDrishtiAnalysis[] {
  const results: HouseDrishtiAnalysis[] = [];
  for (let i = 1; i <= 12; i++) {
    results.push(calculateHouseDrishti(kundaliData, i));
  }
  return results;
}
