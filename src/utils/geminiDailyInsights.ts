import { Language } from '../types';

export interface DailyInsightRequest {
  tithiName: string;
  tithiPaksha: string;
  nakshatraName: string;
  padaNumber?: number;
  rashiName?: string;
  dateStr?: string;
  language: Language;
}

export interface DailyInsightResponse {
  tip: string;
  source: 'gemini' | 'classical_jyotisha';
  model?: string;
}

// In-memory cache to prevent redundant API calls
const insightsCache = new Map<string, DailyInsightResponse>();

/**
 * Classical Vedic Jyotisha Muhurtha rules fallback for each of the 27 Nakshatras & Tithis
 */
export function getClassicalVedicTip(
  tithiName: string,
  tithiPaksha: string,
  nakshatraName: string,
  padaNumber?: number,
  language: Language = 'en'
): string {
  const nakshatraLower = (nakshatraName || '').toLowerCase().trim();
  const isKrishna = (tithiPaksha || '').toLowerCase().includes('krishna') || (tithiPaksha || '').toLowerCase().includes('ಕೃಷ್ಣ') || (tithiPaksha || '').toLowerCase().includes('कृष्ण');

  // Multi-lingual Nakshatra Guidance mapping
  const nakshatraTips: Record<string, { en: string; kn: string; hi: string }> = {
    ashwini: {
      en: 'Under swift Ashwini Nakshatra, initiate health treatments, prompt journeys, or new educational learning with resolute focus.',
      kn: 'ಕ್ಷಿಪ್ರ ಅಶ್ವಿನಿ ನಕ್ಷತ್ರದ ಪ್ರಭಾವದಿಂದ ಆರೋಗ್ಯ ಚಿಕಿತ್ಸೆ, ತ್ವರಿತ ಪ್ರಯಾಣ ಹಾಗೂ ನೂತನ ವಿದ್ಯಾರಂಭಕ್ಕೆ ಇಂದಿನ ದಿನ ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾಗಿದೆ.',
      hi: 'अश्विनी नक्षत्र के शुभ प्रभाव से नवीन चिकित्सा, यात्रा एवं विद्यारम्भ हेतु आज का दिन विशेष लाभकारी है।'
    },
    bharani: {
      en: 'Bharani Nakshatra calls for calm introspection, settling pending duties, and invoking Mother Mahakali for inner resilience.',
      kn: 'ಭರಣಿ ನಕ್ಷತ್ರದ ಸಂದರ್ಭದಲ್ಲಿ ತಾಳ್ಮೆಯಿಂದ ಬಾಕಿ ಉಳಿದ ಕೆಲಸಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ, ಶ್ರೀ ಮಹಾಕಾಳಿ ಅಥವಾ ದುರ್ಗಾದೇವಿಯ ಧ್ಯಾನದಿಂದ ಆಂತರಿಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸಿ.',
      hi: 'भरणी नक्षत्र में संयमपूर्वक रुके हुए कार्य सम्पन्न करें एवं देवी दुर्गा की आराधना से मनोबल सुदृढ़ करें।'
    },
    krittika: {
      en: 'Krittika Nakshatra radiates purifying fire energy; ideal for disciplined spiritual focus, homa rituals, and decisive leadership.',
      kn: 'ಅಗ್ನಿದೇವತೆಯ ಕೃತ್ತಿಕಾ ನಕ್ಷತ್ರವು ತೇಜಸ್ಸು ತರುತ್ತದೆ; ಶುದ್ಧ ಧಾರ್ಮಿಕ ಹೋಮ, ಧ್ಯಾನ ಹಾಗೂ ದೃಢ ನಾಯಕತ್ವದ ನಿರ್ಧಾರಗಳಿಗೆ ಇದು ಶ್ರೇಷ್ಠ.',
      hi: 'कृत्तिका नक्षत्र में आध्यात्मिक अग्नि-पूजा, ध्यान एवं दृढ संकल्प से कठिन कार्यों में विजय प्राप्त होगी।'
    },
    rohini: {
      en: 'Auspicious Rohini Nakshatra blesses creative endeavors, financial savings, nature planting, and heartfelt prayers to Sri Krishna.',
      kn: 'ಅತ್ಯಂತ ಶುಭಕರ ರೋಹಿಣಿ ನಕ್ಷತ್ರವು ಸೃಜನಶೀಲತೆ, ಆರ್ಥಿಕ ಹೂಡಿಕೆ, ಗಿಡಮರ ನೆಡುವಿಕೆ ಹಾಗೂ ಶ್ರೀಕೃಷ್ಣನ ಪೂಜೆಗೆ ವಿಶೇಷ ಸಮೃದ್ಧಿ ತರುತ್ತದೆ.',
      hi: 'शुभ रोहिणी नक्षत्र रचनात्मक कार्यों, आर्थिक समृद्धि एवं भगवान श्रीकृष्ण की कृपा प्राप्ति हेतु सर्वोत्तम है।'
    },
    mrigashira: {
      en: 'Curious Mrigashira Nakshatra is favorable for friendly communications, gentle travels, art exploration, and seeking divine guidance.',
      kn: 'ಸೌಮ್ಯ ಮೃಗಶಿರಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಮಧುರ ಸಂಭಾಷಣೆ, ಹೊಸ ಸ್ನೇಹ, ಲಲಿತಕಲೆಗಳ ಅಭ್ಯಾಸ ಹಾಗೂ ಶುಭ ಪ್ರಯಾಣಗಳು ಸುಖಕರವಾಗಿರುತ್ತವೆ.',
      hi: 'मृगशिरा नक्षत्र में सौम्य संवाद, कला-संगीत एवं शांतिपूर्ण यात्रा से विशेष प्रसन्नता मिलेगी।'
    },
    ardra: {
      en: 'Transformative Ardra Nakshatra urges cleansing negativity through Mahamrityunjaya japa, patience, and Lord Shiva worship.',
      kn: 'ತೀವ್ರ ಆರ್ದ್ರಾ ನಕ್ಷತ್ರದಂದು ಶ್ರೀ ರುದ್ರದೇವರಿಗೆ ರುದ್ರಾಭಿಷೇಕ ಅಥವಾ ಮಹಾಮೃತ್ಯುಂಜಯ ಜಪ ಮಾಡಿ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳನ್ನು ದೂರವಿರಿಸಿ.',
      hi: 'आर्द्रा नक्षत्र में भगवान शिव का रुद्राभिषेक एवं महामृत्युंजय जप मानसिक शांति और सुरक्षा प्रदान करेगा।'
    },
    punarvasu: {
      en: 'Benevolent Punarvasu Nakshatra brings renewal; an ideal day to restart halted projects, purchase books, and worship Sri Rama.',
      kn: 'ಪುನರ್ವಸು ನಕ್ಷತ್ರವು ನವೀಕರಣದ ಶಕ್ತಿ ನೀಡುತ್ತದೆ; ಅಪೂರ್ಣ ಕಾರ್ಯಗಳನ್ನು ಪುನರಾರಂಭಿಸಲು ಹಾಗೂ ಶ್ರೀರಾಮ ನಾಮ ಸ್ಮರಣೆಗೆ ಶುಭ ದಿನ.',
      hi: 'पुनर्वसु नक्षत्र में रुके कार्यों को पुनः प्रारम्भ करना तथा श्रीराम स्तुति करना अत्यंत कल्याणकारी है।'
    },
    pushya: {
      en: 'Divine Pushya Nakshatra (King of Nakshatras) empowers all auspicious deeds, spiritual initiations, gold purchase, and Guru prayers.',
      kn: 'ನಕ್ಷತ್ರಗಳ ರಾಜ ಪುಷ್ಯ ನಕ್ಷತ್ರದಲ್ಲಿ ಯಾವುದೇ ಸತ್ಕಾರ್ಯ, ಚಿನ್ನಾಭರಣ ಖರೀದಿ, ವಿದ್ಯಾರಂಭ ಹಾಗೂ ಗುರುದರ್ಶನ ಮಾಡಿದರೆ ಸರ್ವಸಿದ್ಧಿ ಲಭಿಸುತ್ತದೆ.',
      hi: 'नक्षत्रराज पुष्य में शुभ कार्य, स्वर्ण-क्रय, ज्ञानार्जन एवं गुरु-पूजन से सर्वतोमुखी उन्नति होगी।'
    },
    ashlesha: {
      en: 'Mystic Ashlesha Nakshatra favors meditation, honoring sacred Nagas, avoiding harsh arguments, and strengthening self-protection.',
      kn: 'ಆಶ್ಲೇಷಾ ನಕ್ಷತ್ರದಂದು ನಾಗದೇವತೆಯ ಆರಾಧನೆ, ಮೌನ ವ್ರತ ಹಾಗೂ ಅನಗತ್ಯ ವಾದ-ವಿವಾದಗಳಿಂದ ದೂರವಿರುವುದು ಶಾಂತಿ ತರುತ್ತದೆ.',
      hi: 'अश्लेषा नक्षत्र में नागदेवता का स्मरण करें तथा वाद-विवाद से दूर रहकर आत्ममंथन करें।'
    },
    magha: {
      en: 'Royal Magha Nakshatra encourages ancestral reverence (Pitru Tarpana), taking blessings of elders, and upholding family dignity.',
      kn: 'ಪಿತೃದೇವತೆಗಳ ಪ್ರೀತಿಯ ಮಘಾ ನಕ್ಷತ್ರದಂದು ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ ಮತ್ತು ಪಿತೃಗಳಿಗೆ ತರ್ಪಣ/ನಮನ ಸಲ್ಲಿಸಿ ಪುಣ್ಯ ಗಳಿಸಿ.',
      hi: 'मघा नक्षत्र में पितृ-तर्पण, बड़ों का चरण-स्पर्श एवं पारिवारिक प्रतिष्ठा के संवर्धन हेतु कार्य करें।'
    },
    purva_phalguni: {
      en: 'Charming Purva Phalguni Nakshatra supports joy, artistic expression, cultural harmony, and seeking blessings of Bhagya Devata.',
      kn: 'ಪೂರ್ವಫಲ್ಗುಣೀ ನಕ್ಷತ್ರವು ಕಲೆ, ಸಂಗೀತ, ಕೌಟುಂಬಿಕ ಸೌಖ್ಯ ಹಾಗೂ ಸಂತೋಷದ ಕ್ಷಣಗಳನ್ನು ಆಸ್ವಾದಿಸಲು ಪ್ರೇರೇಪಿಸುತ್ತದೆ.',
      hi: 'पूर्वाफाल्गुनी नक्षत्र में ललित कलाएं, पारिवारिक सौहार्द एवं उत्सव का आनंद मन को प्रफुल्लित रखेगा।'
    },
    uttara_phalguni: {
      en: 'Noble Uttara Phalguni Nakshatra is propitious for signing partnerships, altruistic giving, and entering lasting commitments.',
      kn: 'ಉತ್ತರಫಲ್ಗುಣೀ ನಕ್ಷತ್ರದಲ್ಲಿ ಸಮಾಜಸೇವೆ, ದಾನಧರ್ಮ, ಸತ್ಯನಿಷ್ಠೆ ಹಾಗೂ ದೀರ್ಘಕಾಲೀನ ಒಪ್ಪಂದಗಳಿಗೆ ಶುಭ ಫಲ ದೊರೆಯುತ್ತದೆ.',
      hi: 'उत्तराफाल्गुनी नक्षत्र में परोपकार, दान तथा दीर्घकालिक अनुबंधों में सफलता का योग बनता है।'
    },
    hasta: {
      en: 'Hasta Nakshatra is blessed with divine dexterity; highly auspicious for commerce, skilled work, healing, and invoking Surya Deva.',
      kn: 'ಹಸ್ತಾ ನಕ್ಷತ್ರದ ಶುಭ ಸಮಯದಲ್ಲಿ ವ್ಯಾಪಾರ ವ್ಯವಹಾರ, ಕೈಕೆಲಸ, ಬರವಣಿಗೆ ಹಾಗೂ ಸೂರ್ಯನಮಸ್ಕಾರ ಕೈಗೊಂಡರೆ ಸಿದ್ಧಿ ಲಭಿಸುತ್ತದೆ.',
      hi: 'हस्त नक्षत्र में व्यापारिक लेन-देन, शिल्प एवं आदित्य हृदय स्तोत्र पाठ से विजय प्राप्त होगी।'
    },
    chitra: {
      en: 'Radiant Chitra Nakshatra shines for architectural planning, innovative designs, jewelry, and prayers to divine architect Vishwakarma.',
      kn: 'ಚಿತ್ರಾ ನಕ್ಷತ್ರದ ಅದ್ಭುತ ಪ್ರಭಾವದಿಂದ ನೂತನ ವಿನ್ಯಾಸ, ವಾಸ್ತು ಯೋಜನೆ, ಕಲಾತ್ಮಕ ವಸ್ತುಗಳ ಖರೀದಿ ಹಾಗೂ ಸೃಜನಶೀಲತೆಗೆ ಶುಭ.',
      hi: 'चित्रा नक्षत्र में वास्तु-योजना, नवीन रचना एवं सौन्दर्य-कला से जुड़े कार्यों में यश मिलेगा।'
    },
    swati: {
      en: 'Independent Swati Nakshatra fosters business travel, learning science or music, financial prudence, and prayers to Goddess Saraswati.',
      kn: 'ಸ್ವಾತಿ ನಕ್ಷತ್ರದ ಚಲನಶೀಲತೆಯು ವ್ಯಾಪಾರ ಪ್ರಯಾಣ, ವಿದ್ಯಾರ್ಜನೆ, ಸಂಗೀತ ಸಾಧನೆ ಹಾಗೂ ಶ್ರೀ ಸರಸ್ವತೀ ದೇವಿಯ ಕೃಪೆಗೆ ಕಾರಣವಾಗುತ್ತದೆ.',
      hi: 'स्वाति नक्षत्र में स्वतंत्र विचार, व्यापारिक यात्रा एवं माँ सरस्वती की आराधना से मेधा शक्ति बढ़ेगी।'
    },
    vishakha: {
      en: 'Determined Vishakha Nakshatra grants perseverance; ideal for setting milestones, competitive focus, and chanting Indragni mantras.',
      kn: 'ವಿಶಾಖಾ ನಕ್ಷತ್ರದಲ್ಲಿ ದೃಢ ಸಂಕಲ್ಪದಿಂದ ಶ್ರಮಿಸಿದರೆ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆ ಮತ್ತು ಕಠಿಣ ಗುರಿಗಳಲ್ಲಿ ಖಂಡಿತ ವಿಜಯ ಪ್ರಾಪ್ತಿಯಾಗುತ್ತದೆ.',
      hi: 'विशाखा नक्षत्र में एकाग्रता और सतत परिश्रम से कठिन लक्ष्यों को साधने में अपार सफलता मिलेगी।'
    },
    anuradha: {
      en: 'Friendly Anuradha Nakshatra inspires devotion, spiritual pilgrimages, collaborative teamwork, and hearty prayers to Sri Radha-Krishna.',
      kn: 'ಮಿತ್ರ ಭಾವದ ಅನುರಾಧಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಸತ್ಸಂಗ, ತೀರ್ಥಯಾತ್ರೆ, ಭಕ್ತಿ ಗಾಯನ ಹಾಗೂ ಪರಸ್ಪರ ಸಹಕಾರದಿಂದ ಕಾರ್ಯಸಿದ್ಧಿ ಸುಲಭ.',
      hi: 'अनुराधा नक्षत्र में भक्ति-साधना, तीर्थ-स्मरण एवं आत्मीय संबंधों में मधुरता का संचार होता है।'
    },
    jyeshtha: {
      en: 'Powerful Jyeshtha Nakshatra encourages leadership responsibilities, protecting dependents, and invoking Lord Indra for wisdom.',
      kn: 'ಜ್ಯೇಷ್ಠಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಧೈರ್ಯದಿಂದ ಜವಾಬ್ದಾರಿ ನಿರ್ವಹಿಸಿ, ಅಹಂಕಾರ ತ್ಯಜಿಸಿ ಇಷ್ಟದೇವತಾ ರಕ್ಷಾ ಕವಚ ಪಠಿಸುವುದು ಶ್ರೇಯಸ್ಕರ.',
      hi: 'ज्येष्ठा नक्षत्र में अहंकार से बचें, नेतृत्व के दायित्व निभाएं तथा संकटमोचन का पाठ करें।'
    },
    mula: {
      en: 'Rooted Mula Nakshatra urges planting seeds of truth, deep research, discarding unhealthy habits, and honoring Sri Narasimha.',
      kn: 'ಮೂಲಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಮೂಲಭೂತ ಸತ್ಯಗಳ ಅನ್ವೇಷಣೆ, ಹಳೆಯ ದುಶ್ಚಟಗಳ ತ್ಯಾಗ ಹಾಗೂ ಶ್ರೀ ನರಸಿಂಹ ದೇವರ ಆರಾಧನೆ ಶಾಂತಿ ತರುತ್ತದೆ.',
      hi: 'मूल नक्षत्र में आत्मसंयम रखें, व्यर्थ आदतों का त्याग करें तथा नृसिंह स्तोत्र का जप करें।'
    },
    purva_ashadha: {
      en: 'Victorious Purva Ashadha Nakshatra promotes overcoming inner doubts, resolving estrangements, and devotional water offerings.',
      kn: 'ಪೂರ್ವಾಷಾಢಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮುನ್ನಡೆದು, ಸಂಧಾನ ಮಾತುಕತೆ ನಡೆಸಿ ವರುಣ ದೇವರಿಗೆ ಜಲಾರ್ಪಣೆ ಮಾಡಿ.',
      hi: 'पूर्वाषाढ़ा नक्षत्र में आत्मविश्वास रखें, मनोबल ऊँचा रखें तथा वरुण देव का स्मरण करें।'
    },
    uttara_ashadha: {
      en: 'Everlasting Uttara Ashadha Nakshatra promises stable triumphs, starting foundation stones, and invoking the universal Vishwadevas.',
      kn: 'ಉತ್ತರಾಷಾಢಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಆರಂಭಿಸಿದ ಸತ್ಕಾರ್ಯಗಳು ದೀರ್ಘಕಾಲಿಕ ಯಶಸ್ಸು ನೀಡುತ್ತವೆ; ಧರ್ಮಕಾರ್ಯ ಮತ್ತು ಗೃಹಪ್ರವೇಶಕ್ಕೆ ಪವಿತ್ರ ಕಾಲ.',
      hi: 'उत्तराषाढ़ा नक्षत्र में प्रारम्भ किए गए सत्कर्म चिरस्थायी सफलता एवं समाज में सम्मान दिलाते हैं।'
    },
    shravana: {
      en: 'Sacred Shravana Nakshatra is supreme for listening to scriptures, receiving Guru upadesha, and seeking Sri Maha Vishnu’s grace.',
      kn: 'ಶ್ರವಣ ನಕ್ಷತ್ರದ ಪವಿತ್ರ ಪ್ರಭಾವದಿಂದ ಸತ್ಶಾಸ್ತ್ರ ಶ್ರವಣ, ಗುರುೋಪದೇಶ ಸ್ವೀಕಾರ ಹಾಗೂ ಶ್ರೀ ಮಹಾವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣಕ್ಕೆ ಅಮೃತ ಕಾಲ.',
      hi: 'श्रवण नक्षत्र में गुरु-वचन श्रवण, गीता पाठ एवं भगवान विष्णु की अर्चना से परम कल्याण होता है।'
    },
    dhanishta: {
      en: 'Prosperous Dhanishta Nakshatra enhances musical talents, gathering material wealth, social unity, and worship of the Eight Vasus.',
      kn: 'ಧನಿಷ್ಠಾ ನಕ್ಷತ್ರವು ಸಂಗೀತ ಸಾಧನೆ, ಧನಧಾನ್ಯ ಸಂಗ್ರಹ, ನೂತನ ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳ ಖರೀದಿ ಹಾಗೂ ಬಂಧುಮಿತ್ರರ ಸಹಯೋಗಕ್ಕೆ ಅನುಕೂಲ.',
      hi: 'धनिष्ठा नक्षत्र में संगीत, वाद्य, धन-सम्पदा की वृद्धि एवं अष्टवसुओं की कृपा का योग है।'
    },
    shatabhisha: {
      en: 'Healing Shatabhisha Nakshatra aids natural cures, meditation, solitude, and invoking Varuna Deva for physical rejuvenation.',
      kn: 'ಶತಭಿಷಾ ನಕ್ಷತ್ರದಲ್ಲಿ ಯೋಗ, ಆಯುರ್ವೇದೀಯ ಔಷಧ ಸೇವನೆ, ಏಕಾಂತ ಧ್ಯಾನ ಹಾಗೂ ಮಾನಸಿಕ ಪ್ರಶಾಂತತೆ ಲಭಿಸುತ್ತದೆ.',
      hi: 'शतभिषा नक्षत्र में प्राकृतिक चिकित्सा, ध्यान, योग एवं मानसिक विश्राम से आरोग्य लाभ होगा।'
    },
    purva_bhadrapada: {
      en: 'Ascetic Purva Bhadrapada Nakshatra inspires philosophical clarity, overcoming illusions, and earnest tapasya.',
      kn: 'ಪೂರ್ವಭಾದ್ರಪದ ನಕ್ಷತ್ರದಲ್ಲಿ ಆಧ್ಯಾತ್ಮಿಕ ತತ್ವಜ್ಞಾನ ಚಿಂತನೆ, ದಾನ ಹಾಗೂ ಈಶ್ವರ ಧ್ಯಾನದಿಂದ ಮಾನಸಿಕ ಗೊಂದಲಗಳು ಶಮನವಾಗುತ್ತವೆ.',
      hi: 'पूर्वभाद्रपद नक्षत्र में तात्त्विक चिंतन, सात्त्विक तपस्या एवं दान-पुण्य से चित्त शुद्ध रहता है।'
    },
    uttara_bhadrapada: {
      en: 'Benevolent Uttara Bhadrapada Nakshatra fosters oceanic tranquility, deep meditation, compassion, and honoring Ahirbudhnya.',
      kn: 'ಉತ್ತರಭಾದ್ರಪದ ನಕ್ಷತ್ರವು ಅಪಾರ ಶಾಂತಿ, ಸತ್ಪಾತ್ರ ದಾನ, ಗಂಭೀರ ಚಿಂತನೆ ಹಾಗೂ ಶಿವಾರಾಧನೆಗೆ ಪರಮ ಮಂಗಳಕರ.',
      hi: 'उत्तरभाद्रपद नक्षत्र में गम्भीर साधना, परोपकार एवं भगवान शिव की अर्चना से परमानन्द प्राप्त होगा।'
    },
    revati: {
      en: 'Nourishing Revati Nakshatra marks graceful completion, safe journeys, caring for cattle, and prosperous new beginnings.',
      kn: 'ಪೂರ್ಣಫಲದ ರೇವತಿ ನಕ್ಷತ್ರದಲ್ಲಿ ಸಕಲ ಶುಭ ಪ್ರಯಾಣ, ಗೋಸೇವೆ, ವ್ಯಾಪಾರ ವೃದ್ಧಿ ಹಾಗೂ ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿಗೆ ಶ್ರೀ ಪುಷ್ಯನ್ ದೇವತೆ ಅನುಗ್ರಹಿಸುತ್ತಾನೆ.',
      hi: 'रेवती नक्षत्र में यात्राएं सफल होती हैं, गौ-सेवा एवं नवीन योजनाओं का शुभारम्भ अत्यंत कल्याणकारी है।'
    }
  };

  // Find matching nakshatra
  let matchedNakshatra = Object.keys(nakshatraTips).find(k => nakshatraLower.includes(k.replace('_', '')) || nakshatraLower.includes(k));
  if (!matchedNakshatra) {
    if (nakshatraLower.includes('ashw') || nakshatraLower.includes('ಅಶ್ವಿನಿ') || nakshatraLower.includes('अश्विनी')) matchedNakshatra = 'ashwini';
    else if (nakshatraLower.includes('bhar') || nakshatraLower.includes('ಭರಣಿ') || nakshatraLower.includes('भरणी')) matchedNakshatra = 'bharani';
    else if (nakshatraLower.includes('krit') || nakshatraLower.includes('ಕೃತ್ತಿಕಾ') || nakshatraLower.includes('कृत्तिका')) matchedNakshatra = 'krittika';
    else if (nakshatraLower.includes('roh') || nakshatraLower.includes('ರೋಹಿಣಿ') || nakshatraLower.includes('रोहिणी')) matchedNakshatra = 'rohini';
    else if (nakshatraLower.includes('mrig') || nakshatraLower.includes('ಮೃಗಶಿರಾ') || nakshatraLower.includes('मृगशिरा')) matchedNakshatra = 'mrigashira';
    else if (nakshatraLower.includes('ardr') || nakshatraLower.includes('ಆರ್ದ್ರಾ') || nakshatraLower.includes('आर्द्रा')) matchedNakshatra = 'ardra';
    else if (nakshatraLower.includes('punar') || nakshatraLower.includes('ಪುನರ್ವಸು') || nakshatraLower.includes('पुनर्वसु')) matchedNakshatra = 'punarvasu';
    else if (nakshatraLower.includes('push') || nakshatraLower.includes('ಪುಷ್ಯ') || nakshatraLower.includes('पुष्य')) matchedNakshatra = 'pushya';
    else if (nakshatraLower.includes('ashl') || nakshatraLower.includes('ಆಶ್ಲೇಷಾ') || nakshatraLower.includes('आश्लेषा')) matchedNakshatra = 'ashlesha';
    else if (nakshatraLower.includes('magh') || nakshatraLower.includes('ಮಘಾ') || nakshatraLower.includes('मघा')) matchedNakshatra = 'magha';
    else if (nakshatraLower.includes('purva phal') || nakshatraLower.includes('ಪೂರ್ವಫಲ್ಗುಣೀ') || nakshatraLower.includes('पूर्वाफाल्गुनी')) matchedNakshatra = 'purva_phalguni';
    else if (nakshatraLower.includes('uttara phal') || nakshatraLower.includes('ಉತ್ತರಫಲ್ಗುಣೀ') || nakshatraLower.includes('उत्तराफाल्गुनी')) matchedNakshatra = 'uttara_phalguni';
    else if (nakshatraLower.includes('hast') || nakshatraLower.includes('ಹಸ್ತಾ') || nakshatraLower.includes('हस्त')) matchedNakshatra = 'hasta';
    else if (nakshatraLower.includes('chit') || nakshatraLower.includes('ಚಿತ್ರಾ') || nakshatraLower.includes('चित्रा')) matchedNakshatra = 'chitra';
    else if (nakshatraLower.includes('swat') || nakshatraLower.includes('ಸ್ವಾತಿ') || nakshatraLower.includes('स्वाति')) matchedNakshatra = 'swati';
    else if (nakshatraLower.includes('vish') || nakshatraLower.includes('ವಿಶಾಖಾ') || nakshatraLower.includes('विशाखा')) matchedNakshatra = 'vishakha';
    else if (nakshatraLower.includes('anur') || nakshatraLower.includes('ಅನುರಾಧಾ') || nakshatraLower.includes('अनुराधा')) matchedNakshatra = 'anuradha';
    else if (nakshatraLower.includes('jyes') || nakshatraLower.includes('ಜ್ಯೇಷ್ಠಾ') || nakshatraLower.includes('ज्येष्ठा')) matchedNakshatra = 'jyeshtha';
    else if (nakshatraLower.includes('mul') || nakshatraLower.includes('ಮೂಲಾ') || nakshatraLower.includes('मूल')) matchedNakshatra = 'mula';
    else if (nakshatraLower.includes('purva ash') || nakshatraLower.includes('ಪೂರ್ವಾಷಾಢಾ') || nakshatraLower.includes('पूर्वाषाढ़ा')) matchedNakshatra = 'purva_ashadha';
    else if (nakshatraLower.includes('uttara ash') || nakshatraLower.includes('ಉತ್ತರಾಷಾಢಾ') || nakshatraLower.includes('उत्तराषाढ़ा')) matchedNakshatra = 'uttara_ashadha';
    else if (nakshatraLower.includes('shrav') || nakshatraLower.includes('ಶ್ರವಣ') || nakshatraLower.includes('श्रवण')) matchedNakshatra = 'shravana';
    else if (nakshatraLower.includes('dhan') || nakshatraLower.includes('ಧನಿಷ್ಠಾ') || nakshatraLower.includes('धनिष्ठा')) matchedNakshatra = 'dhanishta';
    else if (nakshatraLower.includes('shat') || nakshatraLower.includes('ಶತಭಿಷಾ') || nakshatraLower.includes('शतभिषा')) matchedNakshatra = 'shatabhisha';
    else if (nakshatraLower.includes('purva bha') || nakshatraLower.includes('ಪೂರ್ವಭಾದ್ರಪದ') || nakshatraLower.includes('पूर्वभाद्रपद')) matchedNakshatra = 'purva_bhadrapada';
    else if (nakshatraLower.includes('uttara bha') || nakshatraLower.includes('ಉತ್ತರಭಾದ್ರಪದ') || nakshatraLower.includes('उत्तरभाद्रपद')) matchedNakshatra = 'uttara_bhadrapada';
    else if (nakshatraLower.includes('rev') || nakshatraLower.includes('ರೇವತಿ') || nakshatraLower.includes('रेवती')) matchedNakshatra = 'revati';
  }

  if (matchedNakshatra && nakshatraTips[matchedNakshatra]) {
    const tipObj = nakshatraTips[matchedNakshatra];
    return tipObj[language] || tipObj.en;
  }

  // Universal Vedic Jyotisha insight when exact nakshatra key is generic
  if (language === 'kn') {
    return isKrishna
      ? `ಇಂದಿನ ${tithiName || 'ತಿಥಿ'} ಮತ್ತು ${nakshatraName || 'ನಕ್ಷತ್ರ'} ಪ್ರಭಾವದಿಂದ ಆಂತರಿಕ ಧ್ಯಾನ, ನಿಯಮಿತ ಪೂಜೆ ಮತ್ತು ಶಾಂತಚಿತ್ತದ ಕರ್ತವ್ಯ ನಿರ್ವಹಣೆಗೆ ಶುಭಕರ.`
      : `ಇಂದಿನ ಶುಭ ${tithiName || 'ತಿಥಿ'} ಮತ್ತು ${nakshatraName || 'ನಕ್ಷತ್ರ'} ಸಂಯೋಗವು ಹೊಸ ಕಾರ್ಯಾರಂಭ, ದೇವತಾರಾಧನೆ ಮತ್ತು ಸಕಾರಾತ್ಮಕ ನಿರ್ಧಾರಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.`;
  } else if (language === 'hi') {
    return isKrishna
      ? `आज की ${tithiName || 'तिथि'} एवं ${nakshatraName || 'नक्षत्र'} में आत्म-निरीक्षण, नित्य पूजा तथा शांत मन से किए गए कार्य शुभ फलदायी होंगे।`
      : `आज की पावन ${tithiName || 'तिथि'} एवं ${nakshatraName || 'नक्षत्र'} का संयोग नवीन सत्कर्म, देव-पूजन एवं सकारात्मक निर्णयों हेतु अत्यंत कल्याणकारी है।`;
  }

  return isKrishna
    ? `Today's ${tithiName || 'Tithi'} and ${nakshatraName || 'Nakshatra'} channel introspective wisdom; focus on steady duties, calm reflection, and devotional prayer.`
    : `Today's auspicious ${tithiName || 'Tithi'} and ${nakshatraName || 'Nakshatra'} alignment blesses new initiatives, sacred worship, and positive forward decisions.`;
}

/**
 * Fetch Daily Astrological Tip from Gemini API backend with classical Vedic fallback
 */
export async function fetchDailyAstrologicalTip(
  request: DailyInsightRequest,
  forceRefresh: boolean = false
): Promise<DailyInsightResponse> {
  const cacheKey = `${request.dateStr || 'today'}_${request.tithiName}_${request.nakshatraName}_${request.padaNumber || 1}_${request.language}`;

  if (!forceRefresh && insightsCache.has(cacheKey)) {
    return insightsCache.get(cacheKey)!;
  }

  try {
    const response = await fetch('/api/gemini/daily-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.tip) {
        const result: DailyInsightResponse = {
          tip: data.tip,
          source: data.source || 'gemini',
          model: data.model || 'gemini-3.8-flash'
        };
        insightsCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API unreachable, using authentic classical Jyotisha engine:', err);
  }

  // Classical fallback for standalone offline mode or network outage
  const fallbackTip = getClassicalVedicTip(
    request.tithiName,
    request.tithiPaksha,
    request.nakshatraName,
    request.padaNumber,
    request.language
  );

  const fallbackResult: DailyInsightResponse = {
    tip: fallbackTip,
    source: 'classical_jyotisha',
    model: 'classical-rules'
  };

  insightsCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

/**
 * Speech readout helper for astrological tips
 */
export function speakAstrologicalTip(tip: string, language: Language): boolean {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(tip);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (language === 'kn') {
    utterance.lang = 'kn-IN';
  } else if (language === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
  return true;
}
