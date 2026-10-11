import { Language, LocalizedString } from '../types';
import { RASHI_NAKSHATRA_CHART, RASHIS } from './panchanga';

export interface KootaScore {
  name: LocalizedString;
  maxPoints: number;
  obtainedPoints: number;
  description: LocalizedString;
  status: 'excellent' | 'good' | 'average' | 'dosha';
}

export interface GunaMilanResult {
  totalScore: number; // 0 to 36
  percentage: number;
  verdict: LocalizedString;
  verdictColor: string;
  kootas: {
    varna: KootaScore;
    vashya: KootaScore;
    tara: KootaScore;
    yoni: KootaScore;
    grahaMaitri: KootaScore;
    gana: KootaScore;
    bhakoot: KootaScore;
    nadi: KootaScore;
  };
  manglikStatus: {
    groomIsManglik: boolean;
    brideIsManglik: boolean;
    isCompatible: boolean;
    description: LocalizedString;
  };
  nadiDoshaCancelled: boolean;
  nadiCancellationReason?: LocalizedString;
  recommendations: LocalizedString[];
}

// -------------------------------------------------------------
// Ashtakoota Reference Tables
// -------------------------------------------------------------

// 1. Varna: Brahmin (Water), Kshatriya (Fire), Vaishya (Earth), Shudra (Air)
// Rashis: 0 Mesha(Fire/Kshatriya), 1 Vrishabha(Earth/Vaishya), 2 Mithuna(Air/Shudra), 3 Karka(Water/Brahmin), etc.
const RASHI_VARNA = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]; // 0: Brahmin, 1: Kshatriya, 2: Vaishya, 3: Shudra
const VARNA_NAMES: LocalizedString[] = [
  { en: 'Brahmin (Intellectual)', kn: 'ಬ್ರಾಹ್ಮಣ ವರ್ಣ', hi: 'ब्राह्मण वर्ण' },
  { en: 'Kshatriya (Protective)', kn: 'ಕ್ಷತ್ರಿಯ ವರ್ಣ', hi: 'क्षत्रिय वर्ण' },
  { en: 'Vaishya (Enterprising)', kn: 'ವೈಶ್ಯ ವರ್ಣ', hi: 'वैश्य वर्ण' },
  { en: 'Shudra (Dedicated)', kn: 'ಶೂದ್ರ ವರ್ಣ', hi: 'शूद्र वर्ण' }
];

// 2. Vashya Categories: 0: Chatushpada (Quadruped), 1: Manava (Human), 2: Jalachara (Water), 3: Vanachara (Wild), 4: Keeta (Insect)
const RASHI_VASHYA = [0, 0, 1, 2, 3, 1, 1, 4, 1, 0, 1, 2];

// 3. Yoni Animals for 27 Nakshatras (0 to 26)
// 0:Horse, 1:Elephant, 2:Sheep, 3:Serpent, 4:Serpent, 5:Dog, 6:Cat, 7:Sheep, 8:Cat,
// 9:Rat, 10:Rat, 11:Cow, 12:Buffalo, 13:Tiger, 14:Buffalo, 15:Tiger, 16:Deer, 17:Deer,
// 18:Dog, 19:Monkey, 20:Mongoose, 21:Monkey, 22:Lion, 23:Horse, 24:Lion, 25:Cow, 26:Elephant
const NAKSHATRA_YONI = [
  0, 1, 2, 3, 3, 4, 5, 2, 5,
  6, 6, 7, 8, 9, 8, 9, 10, 10,
  4, 11, 12, 11, 13, 0, 13, 7, 1
];
const YONI_NAMES: LocalizedString[] = [
  { en: 'Ashwa (Horse)', kn: 'ಅಶ್ವ (ಕುದುರೆ)', hi: 'अश्व (घोड़ा)' },
  { en: 'Gaja (Elephant)', kn: 'ಗಜ (ಆನೆ)', hi: 'गज (हाथी)' },
  { en: 'Mesha (Sheep)', kn: 'ಮೇಷ (ಕುರಿ)', hi: 'मेष (भेड़)' },
  { en: 'Sarpa (Serpent)', kn: 'ಸರ್ಪ (ಹಾವು)', hi: 'सर्प (सांप)' },
  { en: 'Shwana (Dog)', kn: 'ಶ್ವಾನ (ನಾಯಿ)', hi: 'श्वान (कुत्ता)' },
  { en: 'Marjara (Cat)', kn: 'ಮಾರ್ಜಾಲ (ಬೆಕ್ಕು)', hi: 'मार्जार (बिल्ली)' },
  { en: 'Mushaka (Rat)', kn: 'ಮೂಷಿಕ (ಇಲಿ)', hi: 'मूषक (चूहा)' },
  { en: 'Gau (Cow)', kn: 'ಗೌ (ಹಸು)', hi: 'गौ (गाय)' },
  { en: 'Mahisha (Buffalo)', kn: 'ಮಹಿಷ (ಎಮ್ಮೆ)', hi: 'महिष (भैंस)' },
  { en: 'Vyaghra (Tiger)', kn: 'ವ್ಯಾಘ್ರ (ಹುಲಿ)', hi: 'व्याघ्र (बाघ)' },
  { en: 'Mriga (Deer)', kn: 'ಮೃಗ (ಜಿಂಕೆ)', hi: 'मृग (हिरण)' },
  { en: 'Vanara (Monkey)', kn: 'ವಾನರ (ಕೋತಿ)', hi: 'वानर (बंदर)' },
  { en: 'Nakula (Mongoose)', kn: 'ನಕುಲ (ಮುಂಗುಸಿ)', hi: 'नकुल (नेवला)' },
  { en: 'Simha (Lion)', kn: 'ಸಿಂಹ (ಸಿಂಹ)', hi: 'सिंह (शेर)' }
];

// Enemy Yoni pairs (Hostile animal archetypes)
const ENEMY_YONI_PAIRS: [number, number][] = [
  [0, 8], // Horse & Buffalo
  [1, 13], // Elephant & Lion
  [2, 11], // Sheep & Monkey
  [3, 12], // Serpent & Mongoose
  [4, 10], // Dog & Deer
  [5, 6], // Cat & Rat
  [7, 9] // Cow & Tiger
];

// 4. Gana for 27 Nakshatras: 0: Deva (Divine), 1: Manushya (Human), 2: Rakshasa (Demonic)
const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2,
  2, 1, 1, 0, 2, 0, 2, 0, 2,
  2, 1, 1, 0, 2, 2, 1, 1, 0
];
const GANA_NAMES: LocalizedString[] = [
  { en: 'Deva Gana (Divine & Gentle)', kn: 'ದೇವ ಗಣ (ಸಾತ್ವಿಕ)', hi: 'देव गण (सात्विक)' },
  { en: 'Manushya Gana (Human & Practical)', kn: 'ಮನುಷ್ಯ ಗಣ (ಕರ್ಮಯೋಗಿ)', hi: 'मनुष्य गण (मध्यम)' },
  { en: 'Rakshasa Gana (Dynamic & Assertive)', kn: 'ರಾಕ್ಷಸ ಗಣ (ಪ್ರಚಂಡ)', hi: 'राक्षस गण (उग्र)' }
];

// 5. Nadi for 27 Nakshatras: 0: Adi (Vata), 1: Madhya (Pitta), 2: Antya (Kapha)
// Sequential 1-2-3-3-2-1 snake order or standard 3-pattern:
// Standard: Ashwini (Adi), Bharani (Madhya), Krittika (Antya), Rohini (Antya), Mriga (Madhya), Ardra (Adi)...
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2
];
const NADI_NAMES: LocalizedString[] = [
  { en: 'Adi Nadi (Vata Constitution)', kn: 'ಆದಿ ನಾಡಿ (ವಾತ ಪ್ರಕೃತಿ)', hi: 'आदि नाड़ी (वात)' },
  { en: 'Madhya Nadi (Pitta Constitution)', kn: 'ಮಧ್ಯ ನಾಡಿ (ಪಿತ್ತ ಪ್ರಕೃತಿ)', hi: 'मध्य नाड़ी (पित्त)' },
  { en: 'Antya Nadi (Kapha Constitution)', kn: 'ಅಂತ್ಯ ನಾಡಿ (ಕಫ ಪ್ರಕೃತಿ)', hi: 'अन्त्य नाड़ी (कफ)' }
];

// 6. Rashi Planetary Lords:
// 0: Mars, 1: Venus, 2: Mercury, 3: Moon, 4: Sun, 5: Mercury, 6: Venus, 7: Mars, 8: Jupiter, 9: Saturn, 10: Saturn, 11: Jupiter
const RASHI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];

// Planetary Friendships (Graha Maitri matrix)
const PLANET_FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus']
};

const PLANET_ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars']
};

/**
 * Calculates complete 36 Guna Ashtakoota Milan between Groom and Bride
 */
export function calculateGunaMilan(
  groomNakshatraIndex: number, // 0 to 26
  groomRashiIndex: number,     // 0 to 11
  brideNakshatraIndex: number, // 0 to 26
  brideRashiIndex: number,     // 0 to 11
  groomMarsHouse: number = 1,  // 1-12
  brideMarsHouse: number = 1
): GunaMilanResult {
  // -------------------------------------------------------------
  // 1. VARNA KOOTA (Max 1 Point)
  // Groom's Varna should be equal or superior to Bride's Varna
  // -------------------------------------------------------------
  const groomVarna = RASHI_VARNA[groomRashiIndex];
  const brideVarna = RASHI_VARNA[brideRashiIndex];
  let varnaPoints = 0;
  if (groomVarna <= brideVarna) {
    varnaPoints = 1; // Groom higher or equal (0 is Brahmin, 3 is Shudra)
  }

  const varnaKoota: KootaScore = {
    name: { en: 'Varna (Spiritual Ego)', kn: 'ವರ್ಣ ಕೂಟ', hi: 'वर्ण कूट' },
    maxPoints: 1,
    obtainedPoints: varnaPoints,
    status: varnaPoints === 1 ? 'excellent' : 'dosha',
    description: {
      en: `Groom is ${VARNA_NAMES[groomVarna].en}, Bride is ${VARNA_NAMES[brideVarna].en}. ${varnaPoints === 1 ? 'Favorable spiritual hierarchy.' : 'Moderate ego adjustment needed.'}`,
      kn: `ವರ: ${VARNA_NAMES[groomVarna].kn}, ವಧು: ${VARNA_NAMES[brideVarna].kn}. ${varnaPoints === 1 ? 'ಉತ್ತಮ ಅಹಂ ಸಮನ್ವಯ.' : 'ಸಣ್ಣ ಹೊಂದಾಣಿಕೆ ಅಗತ್ಯ.'}`,
      hi: `वर: ${VARNA_NAMES[groomVarna].hi}, वधू: ${VARNA_NAMES[brideVarna].hi}। ${varnaPoints === 1 ? 'शुभ वर्ण सामंजस्य।' : 'परस्पर आदर आवश्यक।'}`
    }
  };

  // -------------------------------------------------------------
  // 2. VASHYA KOOTA (Max 2 Points)
  // Mutual attraction and compliance
  // -------------------------------------------------------------
  const groomVashya = RASHI_VASHYA[groomRashiIndex];
  const brideVashya = RASHI_VASHYA[brideRashiIndex];
  let vashyaPoints = 0;
  if (groomVashya === brideVashya) {
    vashyaPoints = 2;
  } else if (
    (groomVashya === 1 && brideVashya === 0) || // Manava controls Chatushpada
    (groomVashya === 0 && brideVashya === 1)
  ) {
    vashyaPoints = 1;
  } else if (groomRashiIndex === (brideRashiIndex + 6) % 12) {
    vashyaPoints = 1;
  } else {
    vashyaPoints = 0.5;
  }

  const vashyaKoota: KootaScore = {
    name: { en: 'Vashya (Mutual Attraction)', kn: 'ವಶ್ಯ ಕೂಟ', hi: 'वश्य कूट' },
    maxPoints: 2,
    obtainedPoints: vashyaPoints,
    status: vashyaPoints >= 1.5 ? 'excellent' : vashyaPoints >= 1 ? 'good' : 'average',
    description: {
      en: `Mutual magnetism and behavioral control score: ${vashyaPoints}/2.`,
      kn: `ಪರಸ್ಪರ ಆಕರ್ಷಣೆ ಮತ್ತು ಪ್ರಭಾವ ಹೊಂದಾಣಿಕೆ ಅಂಕ: ${vashyaPoints}/೨.`,
      hi: `परस्पर आकर्षण एवं आत्मीयता प्राप्तांक: ${vashyaPoints}/२।`
    }
  };

  // -------------------------------------------------------------
  // 3. TARA KOOTA (Max 3 Points)
  // Destiny, longevity, and mutual auspiciousness
  // -------------------------------------------------------------
  // Count from Bride to Groom mod 9
  const taraFromBride = ((groomNakshatraIndex - brideNakshatraIndex + 27) % 27) % 9;
  // Count from Groom to Bride mod 9
  const taraFromGroom = ((brideNakshatraIndex - groomNakshatraIndex + 27) % 27) % 9;

  // Auspicious Taras: 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 0 (Parama Mitra)
  const isAuspiciousTara = (t: number) => t === 1 || t === 3 || t === 5 || t === 7 || t === 8;
  const brideGood = isAuspiciousTara(taraFromBride);
  const groomGood = isAuspiciousTara(taraFromGroom);

  let taraPoints = 0;
  if (brideGood && groomGood) taraPoints = 3;
  else if (brideGood || groomGood) taraPoints = 1.5;
  else taraPoints = 0;

  const taraKoota: KootaScore = {
    name: { en: 'Tara (Destiny & Health)', kn: 'ತಾರಾ ಕೂಟ', hi: 'तारा कूट' },
    maxPoints: 3,
    obtainedPoints: taraPoints,
    status: taraPoints === 3 ? 'excellent' : taraPoints === 1.5 ? 'good' : 'dosha',
    description: {
      en: `Tara compatibility reflects longevity and mutual fortunes: ${taraPoints}/3 points.`,
      kn: `ಆಯುಷ್ಯ, ಆರೋಗ್ಯ ಮತ್ತು ಪರಸ್ಪರ ಅದೃಷ್ಟದ ತಾರಾ ಬಲ: ${taraPoints}/೩ ಅಂಕಗಳು.`,
      hi: `आयु, आरोग्य एवं सौभाग्य की तारा अनुकूलता: ${taraPoints}/३ अंक।`
    }
  };

  // -------------------------------------------------------------
  // 4. YONI KOOTA (Max 4 Points)
  // Biological, temperamental & physical harmony
  // -------------------------------------------------------------
  const groomYoni = NAKSHATRA_YONI[groomNakshatraIndex];
  const brideYoni = NAKSHATRA_YONI[brideNakshatraIndex];
  let yoniPoints = 0;

  const isEnemyYoni = ENEMY_YONI_PAIRS.some(
    ([a, b]) => (a === groomYoni && b === brideYoni) || (b === groomYoni && a === brideYoni)
  );

  if (groomYoni === brideYoni) {
    yoniPoints = 4; // Same animal archetype = perfect harmony
  } else if (isEnemyYoni) {
    yoniPoints = 0; // Natural animal enemies
  } else {
    yoniPoints = 2; // Neutral / friendly animals
  }

  const yoniKoota: KootaScore = {
    name: { en: 'Yoni (Physical & Intimacy)', kn: 'ಯೋನಿ ಕೂಟ', hi: 'योनि कूट' },
    maxPoints: 4,
    obtainedPoints: yoniPoints,
    status: yoniPoints === 4 ? 'excellent' : yoniPoints === 2 ? 'good' : 'dosha',
    description: {
      en: `Groom archetype: ${YONI_NAMES[groomYoni].en}, Bride archetype: ${YONI_NAMES[brideYoni].en}. ${yoniPoints === 0 ? 'Natural enemy archetypes (Yoni Dosha).' : 'Favorable emotional and physical harmony.'}`,
      kn: `ವರ ಯೋನಿ: ${YONI_NAMES[groomYoni].kn}, ವಧು ಯೋನಿ: ${YONI_NAMES[brideYoni].kn}. ${yoniPoints === 0 ? 'ವೈರ ಯೋನಿ (ದೋಷ).' : 'ಉತ್ತಮ ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮೀಪ್ಯ.'}`,
      hi: `वर योनि: ${YONI_NAMES[groomYoni].hi}, वधू योनि: ${YONI_NAMES[brideYoni].hi}। ${yoniPoints === 0 ? 'शत्रु योनि दोष।' : 'उत्तम स्वाभाविक सामंजस्य।'}`
    }
  };

  // -------------------------------------------------------------
  // 5. GRAHA MAITRI (Max 5 Points)
  // Mental friendship and psychological affinity
  // -------------------------------------------------------------
  const groomLord = RASHI_LORDS[groomRashiIndex];
  const brideLord = RASHI_LORDS[brideRashiIndex];
  let grahaPoints = 0;

  if (groomLord === brideLord) {
    grahaPoints = 5;
  } else {
    const groomViewsBrideFriend = PLANET_FRIENDS[groomLord]?.includes(brideLord);
    const brideViewsGroomFriend = PLANET_FRIENDS[brideLord]?.includes(groomLord);
    const groomViewsBrideEnemy = PLANET_ENEMIES[groomLord]?.includes(brideLord);
    const brideViewsGroomEnemy = PLANET_ENEMIES[brideLord]?.includes(groomLord);

    if (groomViewsBrideFriend && brideViewsGroomFriend) grahaPoints = 5;
    else if ((groomViewsBrideFriend && !brideViewsGroomEnemy) || (brideViewsGroomFriend && !groomViewsBrideEnemy)) grahaPoints = 4;
    else if (!groomViewsBrideEnemy && !brideViewsGroomEnemy) grahaPoints = 3;
    else if ((groomViewsBrideFriend && brideViewsGroomEnemy) || (brideViewsGroomFriend && groomViewsBrideEnemy)) grahaPoints = 1;
    else grahaPoints = 0.5;
  }

  const grahaMaitriKoota: KootaScore = {
    name: { en: 'Graha Maitri (Mental Harmony)', kn: 'ಗ್ರಹ ಮೈತ್ರಿ ಕೂಟ', hi: 'ग्रह मैत्री कूट' },
    maxPoints: 5,
    obtainedPoints: grahaPoints,
    status: grahaPoints >= 4 ? 'excellent' : grahaPoints >= 3 ? 'good' : 'dosha',
    description: {
      en: `Rashi Lords: ${groomLord} & ${brideLord}. Mental compatibility score: ${grahaPoints}/5.`,
      kn: `ರಾಶ್ಯಾಧಿಪತಿಗಳು: ${groomLord} ಮತ್ತು ${brideLord}. ಮಾನಸಿಕ ಹೊಂದಾಣಿಕೆ: ${grahaPoints}/೫.`,
      hi: `राशीश: ${groomLord} एवं ${brideLord}। मानसिक मित्रता: ${grahaPoints}/५।`
    }
  };

  // -------------------------------------------------------------
  // 6. GANA KOOTA (Max 6 Points)
  // Temperament & lifestyle alignment
  // -------------------------------------------------------------
  const groomGana = NAKSHATRA_GANA[groomNakshatraIndex];
  const brideGana = NAKSHATRA_GANA[brideNakshatraIndex];
  let ganaPoints = 0;

  if (groomGana === brideGana) {
    ganaPoints = 6;
  } else if (
    (groomGana === 0 && brideGana === 1) || // Deva & Manushya
    (groomGana === 1 && brideGana === 0)
  ) {
    ganaPoints = 5;
  } else if (
    (groomGana === 2 && brideGana === 1) || // Rakshasa groom & Manushya bride
    (groomGana === 1 && brideGana === 2)
  ) {
    ganaPoints = 1;
  } else {
    // Deva & Rakshasa conflict
    ganaPoints = 0;
  }

  const ganaKoota: KootaScore = {
    name: { en: 'Gana (Temperament & Values)', kn: 'ಗಣ ಕೂಟ', hi: 'गण कूट' },
    maxPoints: 6,
    obtainedPoints: ganaPoints,
    status: ganaPoints >= 5 ? 'excellent' : ganaPoints >= 1 ? 'average' : 'dosha',
    description: {
      en: `Groom is ${GANA_NAMES[groomGana].en}, Bride is ${GANA_NAMES[brideGana].en}. Score: ${ganaPoints}/6.`,
      kn: `ವರ: ${GANA_NAMES[groomGana].kn}, ವಧು: ${GANA_NAMES[brideGana].kn}. ಅಂಕ: ${ganaPoints}/೬.`,
      hi: `वर: ${GANA_NAMES[groomGana].hi}, वधू: ${GANA_NAMES[brideGana].hi}। प्राप्तांक: ${ganaPoints}/६।`
    }
  };

  // -------------------------------------------------------------
  // 7. BHAKOOT KOOTA (Max 7 Points)
  // Family longevity, prosperity and emotional bond
  // -------------------------------------------------------------
  const rashiDiff = (Math.abs(groomRashiIndex - brideRashiIndex) % 12);
  let bhakootPoints = 7;
  // Inauspicious differences: 2/12 (Dwidwadasha), 6/8 (Shadashtaka), 9/5 (Navapanchama without shared lord)
  if (rashiDiff === 1 || rashiDiff === 11) {
    bhakootPoints = 0; // 2/12 dosha (financial strain)
  } else if (rashiDiff === 5 || rashiDiff === 7) {
    // 6/8 dosha (health / friction)
    // Exception: If both signs owned by same planet or mutual friends (e.g. Mesha & Vrishchika both Mars)
    if (groomLord === brideLord) {
      bhakootPoints = 7; // Cancelled
    } else {
      bhakootPoints = 0;
    }
  } else if (rashiDiff === 4 || rashiDiff === 8) {
    // 9/5 dosha
    if (groomLord === brideLord) bhakootPoints = 7;
    else bhakootPoints = 0;
  }

  const bhakootKoota: KootaScore = {
    name: { en: 'Bhakoot (Emotional & Family Bond)', kn: 'ಭಕೂಟ ಕೂಟ', hi: 'भकूट कूट' },
    maxPoints: 7,
    obtainedPoints: bhakootPoints,
    status: bhakootPoints === 7 ? 'excellent' : 'dosha',
    description: {
      en: bhakootPoints === 7 
        ? 'Excellent emotional bond and domestic happiness.' 
        : 'Bhakoot Dosha present (relative sign distance requires remedies).',
      kn: bhakootPoints === 7
        ? 'ಪರಸ್ಪರ ಕುಟುಂಬ ಸೌಖ್ಯ, ಧನ ವೃದ್ಧಿ ಹಾಗೂ ಪ್ರೇಮ ಸಮೃದ್ಧಿ.'
        : 'ಭಕೂಟ ದೋಷವಿದೆ (ರಾಶಿಗಳ ೬/೮ ಅಥವಾ ೨/೧೨ ಅಂತರಕ್ಕೆ ಶಾಂತಿ ಅಗತ್ಯ).',
      hi: bhakootPoints === 7
        ? 'उत्तम भावात्मक तालमेल एवं पारिवारिक सुख।'
        : 'भकूट दोष विद्यमान (शान्ति उपाय श्रेयस्कर)।'
    }
  };

  // -------------------------------------------------------------
  // 8. NADI KOOTA (Max 8 Points)
  // Genetics, health & progeny compatibility
  // -------------------------------------------------------------
  const groomNadi = NAKSHATRA_NADI[groomNakshatraIndex];
  const brideNadi = NAKSHATRA_NADI[brideNakshatraIndex];
  let nadiPoints = 0;
  let nadiDoshaCancelled = false;
  let cancellationReason: LocalizedString | undefined;

  if (groomNadi !== brideNadi) {
    nadiPoints = 8;
  } else {
    // Same Nadi = Nadi Dosha, check classical cancellations:
    // Cancellation 1: Different Rashis despite same Nakshatra (e.g. Krittika in Mesha & Vrishabha)
    // Cancellation 2: Different Nakshatras with same Lord
    if (groomRashiIndex !== brideRashiIndex) {
      nadiPoints = 8;
      nadiDoshaCancelled = true;
      cancellationReason = {
        en: 'Nadi Dosha is cancelled because Moon Rashis are different.',
        kn: 'ವರ ಮತ್ತು ವಧುವಿನ ಚಂದ್ರ ರಾಶಿಗಳು ಬೇರೆಯಾಗಿರುವುದರಿಂದ ನಾಡಿ ದೋಷ ಪರಿಹಾರವಾಗಿದೆ.',
        hi: 'चन्द्र राशियाँ भिन्न होने के कारण नाड़ी दोष निष्प्रभावी हो जाता है।'
      };
    } else {
      nadiPoints = 0;
    }
  }

  const nadiKoota: KootaScore = {
    name: { en: 'Nadi (Genetics & Progeny)', kn: 'ನಾಡಿ ಕೂಟ', hi: 'नाड़ी कूट' },
    maxPoints: 8,
    obtainedPoints: nadiPoints,
    status: nadiPoints === 8 ? 'excellent' : 'dosha',
    description: {
      en: `Groom is ${NADI_NAMES[groomNadi].en}, Bride is ${NADI_NAMES[brideNadi].en}. ${nadiDoshaCancelled ? 'Cancelled by Rashi difference.' : nadiPoints === 8 ? 'Full genetic harmony.' : 'Nadi Dosha present.'}`,
      kn: `ವರ: ${NADI_NAMES[groomNadi].kn}, ವಧು: ${NADI_NAMES[brideNadi].kn}. ${nadiDoshaCancelled ? 'ರಾಶಿ ಭೇದದಿಂದ ದೋಷ ಪರಿಹಾರವಾಗಿದೆ.' : nadiPoints === 8 ? 'ಪೂರ್ಣ ಆರೋಗ್ಯ-ಸಂತಾನ ಹೊಂದಾಣಿಕೆ.' : 'ಏಕ ನಾಡಿ ದೋಷವಿದೆ.'}`,
      hi: `वर: ${NADI_NAMES[groomNadi].hi}, वधू: ${NADI_NAMES[brideNadi].hi}। ${nadiDoshaCancelled ? 'राशि भेद से नाड़ी दोष परिहार।' : nadiPoints === 8 ? 'पूर्ण आनुवंशिक अनुकूलता।' : 'नाड़ी दोष विद्यमान।'}`
    }
  };

  // Total Score out of 36
  const totalScore = Number(
    (
      varnaKoota.obtainedPoints +
      vashyaKoota.obtainedPoints +
      taraKoota.obtainedPoints +
      yoniKoota.obtainedPoints +
      grahaMaitriKoota.obtainedPoints +
      ganaKoota.obtainedPoints +
      bhakootKoota.obtainedPoints +
      nadiKoota.obtainedPoints
    ).toFixed(1)
  );

  const percentage = Math.round((totalScore / 36) * 100);

  // Verdict evaluation
  let verdict: LocalizedString;
  let verdictColor: string;
  if (totalScore >= 28) {
    verdict = {
      en: 'Uttama (Superior & Highly Auspicious Match)',
      kn: 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ (ಶ್ರೇಷ್ಠ ಹಾಗೂ ಮಂಗಳಕರ ದಾಂಪತ್ಯ)',
      hi: 'उत्तम मिलान (अति श्रेष्ठ एवं मांगलिक योग)'
    };
    verdictColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
  } else if (totalScore >= 18) {
    verdict = {
      en: 'Madhyama (Approved & Good Compatibility)',
      kn: 'ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ (ಶುಭಕರ — ವಿವಾಹ ಪ್ರಶಸ್ತ)',
      hi: 'मध्यम मिलान (शुभ विवाह योग्य)'
    };
    verdictColor = 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30';
  } else {
    verdict = {
      en: 'Adhama (Low Score — Astrological Consultation Advised)',
      kn: 'ನ್ಯೂನ ಹೊಂದಾಣಿಕೆ (ದೋಷ ನಿವಾರಣಾ ಶಾಂತಿ ಅಗತ್ಯ)',
      hi: 'अधम मिलान (दोष शान्ति उपाय आवश्यक)'
    };
    verdictColor = 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30';
  }

  // Manglik Dosha check (Houses 1, 2, 4, 7, 8, 12)
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const groomIsManglik = manglikHouses.includes(groomMarsHouse);
  const brideIsManglik = manglikHouses.includes(brideMarsHouse);
  const manglikCompatible = (groomIsManglik && brideIsManglik) || (!groomIsManglik && !brideIsManglik);

  const manglikStatus = {
    groomIsManglik,
    brideIsManglik,
    isCompatible: manglikCompatible,
    description: {
      en: manglikCompatible
        ? groomIsManglik
          ? 'Both charts have Manglik alignment; mutual cancellation occurs.'
          : 'Neither chart has Manglik Dosha; smooth compatibility.'
        : `Only one partner is Manglik (${groomIsManglik ? 'Groom' : 'Bride'}); Kumbha Vivaha or remedial prayer recommended.`,
      kn: manglikCompatible
        ? groomIsManglik
          ? 'ಇಬ್ಬರಲ್ಲೂ ಕುಜ ದೋಷ ಸಮತೋಲನವಿದೆ; ಪರಸ್ಪರ ಪರಿಹಾರವಾಗುತ್ತದೆ.'
          : 'ಇಬ್ಬರಲ್ಲೂ ಕುಜ ದೋಷವಿಲ್ಲ; ಉತ್ತಮ ಶುಭಫಲ.'
        : `ಒಬ್ಬರಲ್ಲಿ ಮಾತ್ರ ಕುಜ ದೋಷವಿದೆ (${groomIsManglik ? 'ವರ' : 'ವಧು'}); ಶಾಂತಿ ಹೋಮ ಅಥವಾ ಕುಂಭ ವಿವಾಹ ಸಲಹೆ ನೀಡಲಾಗುತ್ತದೆ.`,
      hi: manglikCompatible
        ? groomIsManglik
          ? 'दोनों कुंडलियों में मांगलिक साम्य है, दोष परिहार स्वतः मान्य।'
          : 'किसी भी कुंडली में मांगलिक दोष नहीं है, शुभ योग।'
        : `एक पक्ष मांगलिक है (${groomIsManglik ? 'वर' : 'वधू'}); दोष शान्ति उपाय संस्तुत।`
    }
  };

  const recommendations: LocalizedString[] = [];
  if (totalScore >= 18 && manglikCompatible) {
    recommendations.push({
      en: 'Classical Vedic astrology approves this sacred union for lifelong harmony, prosperity, and spiritual growth.',
      kn: 'ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಈ ಜಾತಕ ಹೊಂದಾಣಿಕೆಯು ಸುಖಕರ ದಾಂಪತ್ಯ, ಸಂಪತ್ತು ಹಾಗೂ ವಂಶಾಭಿವೃದ್ಧಿಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾಗಿದೆ.',
      hi: 'शास्त्रानुसार यह वैवाहिक मिलान दीर्घायु, सुख-समृद्धि एवं वंशवृद्धि हेतु पूर्णतया अनुकूल है।'
    });
  } else {
    if (nadiPoints === 0) {
      recommendations.push({
        en: 'Nadi Dosha present: Donate gold/cow or chant Maha Mrityunjaya Mantra 108 times prior to marriage.',
        kn: 'ಏಕ ನಾಡಿ ದೋಷ: ಮಹಾಮೃತ್ಯುಂಜಯ ಜಪ ಹಾಗೂ ಸುವರ್ಣ/ಧಾನ್ಯ ದಾನ ಮಾಡುವುದು ಶ್ರೇಯಸ್ಕರ.',
        hi: 'नाड़ी दोष शान्ति हेतु महामृत्युंजय जप एवं गो/स्वर्ण दान श्रेयस्कर।'
      });
    }
    if (bhakootPoints === 0) {
      recommendations.push({
        en: 'Bhakoot Dosha present: Perform Shiva-Parvati or Lakshmi-Narayana puja for emotional and financial stability.',
        kn: 'ಭಕೂಟ ದೋಷ: ಲಕ್ಷ್ಮೀ-ನಾರಾಯಣ ಅಥವಾ ಗೌರಿ-ಶಂಕರ ಪೂಜೆ ಮಾಡುವುದರಿಂದ ಸಕಲ ದೋಷಗಳು ಶಾಂತವಾಗುತ್ತವೆ.',
        hi: 'भकूट दोष शमन हेतु गौरी-शंकर अथवा सत्यनारायण पूजन करें।'
      });
    }
  }

  return {
    totalScore,
    percentage,
    verdict,
    verdictColor,
    kootas: {
      varna: varnaKoota,
      vashya: vashyaKoota,
      tara: taraKoota,
      yoni: yoniKoota,
      grahaMaitri: grahaMaitriKoota,
      gana: ganaKoota,
      bhakoot: bhakootKoota,
      nadi: nadiKoota
    },
    manglikStatus,
    nadiDoshaCancelled,
    nadiCancellationReason: cancellationReason,
    recommendations
  };
}
