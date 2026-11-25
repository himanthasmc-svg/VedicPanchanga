import { KundaliData, LocalizedString, PlanetPosition } from '../types';
import { getNakshatraPadaAkshara } from './nakshatraAksharas';
import { RASHI_NAKSHATRA_CHART } from './panchanga';

export interface KaalSarpaTypeInfo {
  id: string;
  rahuHouse: number;
  ketuHouse: number;
  name: LocalizedString;
  effects: LocalizedString;
  remedies: LocalizedString;
}

export const TWELVE_KAAL_SARPA_TYPES: KaalSarpaTypeInfo[] = [
  {
    id: 'anant',
    rahuHouse: 1,
    ketuHouse: 7,
    name: { en: 'Anant Kaal Sarpa Dosha', kn: 'ಅನಂತ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'अनन्त कालसर्प दोष' },
    effects: {
      en: 'Rahu in 1st (Lagna) & Ketu in 7th creates intense self-drive, sudden shifts in partnerships/marriage, and restless mental energy, yet gives strong spiritual awakening after age 36.',
      kn: 'ಲಗ್ನದಲ್ಲಿ ರಾಹು ಮತ್ತು ೭ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ದಾಂಪತ್ಯ/ಪಾಲುದಾರಿಕೆಯಲ್ಲಿ ಏರುಪೇರು, ಮಾನಸಿಕ ಚಂಚಲತೆ ಕಂಡುಬರುತ್ತದೆ; ೩೬ನೇ ವಯಸ್ಸಿನ ನಂತರ ಉತ್ತಮ ಪ್ರಗತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ ಸಿದ್ಧಿಸುತ್ತದೆ.',
      hi: 'लग्न में राहु व सप्तम में केतु से दांपत्य व साझेदारी में उतार-चढ़ाव तथा मानसिक अस्थिरता आती है, परंतु ३६ वर्ष के बाद उन्नति व आध्यात्मिक प्रगति होती है।'
    },
    remedies: {
      en: 'Worship Lord Shiva with Rudrabhisheka on Mondays, chant Maha Mrityunjaya Mantra 108 times, and donate black sesame or urad dal on Saturdays.',
      kn: 'ಸೋಮವಾರ ಶಿವಲಿಂಗಕ್ಕೆ ರುದ್ರಾಭಿಷೇಕ, ಪ್ರತಿದಿನ ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ೧೦೮ ಬಾರಿ ಜಪ ಹಾಗೂ ಶನಿವಾರ ಕಪ್ಪು ಎಳ್ಳು/ಉದ್ದು ದಾನ ಮಾಡಿ.',
      hi: 'सोमवार को रुद्राभिषेक, प्रतिदिन महामृत्युंजय मंत्र का १०८ बार जप तथा शनिवार को काले तिल या उड़द दान करें।'
    }
  },
  {
    id: 'kulik',
    rahuHouse: 2,
    ketuHouse: 8,
    name: { en: 'Kulik Kaal Sarpa Dosha', kn: 'ಕುಳಿಕ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'कुलिक कालसर्प दोष' },
    effects: {
      en: 'Rahu in 2nd (Dhana/Vak) & Ketu in 8th brings fluctuations in accumulated wealth, family misunderstandings, and harsh speech if unchecked, while granting deep research intuition.',
      kn: '೨ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೮ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಧನ ಸಂಚಯದಲ್ಲಿ ಅಡೆತಡೆ, ಕುಟುಂಬದಲ್ಲಿ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಮತ್ತು ಮಾತಿನ ಕಠಿಣತೆ ಉಂಟಾಗಬಹುದು; ಗೂಢ ವಿದ್ಯೆಗಳಲ್ಲಿ ಆಸಕ್ತಿ ಹೆಚ್ಚುತ್ತದೆ.',
      hi: 'द्वितीय में राहु व अष्टम में केतु से धन संचय में उतार-चढ़ाव, पारिवारिक तनाव व वाणी दोष हो सकता है, किंतु गूढ़ विषयों में अंतर्दृष्टि मिलती है।'
    },
    remedies: {
      en: 'Offer milk to Nagadevata/Shiva on Nag Panchami, recite Durga Saptashati or Rahu Kavacham, and practice gentle truthful speech.',
      kn: 'ನಾಗಪಂಚಮಿಯಂದು ನಾಗದೇವತೆ/ಶಿವನಿಗೆ ಹಾಲು ಅಭಿಷೇಕ, ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಠಣ ಮತ್ತು ಮೃದು-ಸತ್ಯ ವಚನ ಪಾಲಿಸಿ.',
      hi: 'नागपंचमी पर शिव/नागदेवता को दुग्धाभिषेक, दुर्गा सप्तशती पाठ और मधुर वाणी का अभ्यास करें।'
    }
  },
  {
    id: 'vasuki',
    rahuHouse: 3,
    ketuHouse: 9,
    name: { en: 'Vasuki Kaal Sarpa Dosha', kn: 'ವಾಸುಕಿ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'वासुकि कालसर्प दोष' },
    effects: {
      en: 'Rahu in 3rd (Parakrama) & Ketu in 9th (Bhagya) creates extra effort in career, friction with siblings, and delayed luck, though it grants remarkable courage and self-made success.',
      kn: '೩ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೯ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಸಹೋದರರೊಂದಿಗೆ ಭಿನ್ನಾಭಿಪ್ರಾಯ, ಭಾಗ್ಯೋದಯದಲ್ಲಿ ವಿಳಂಬ ಮತ್ತು ಅಧಿಕ ಪರಿಶ್ರಮ ಅಗತ್ಯ; ಆದರೆ ಧೈರ್ಯ ಮತ್ತು ಸ್ವಯಂ ಸಾಧನೆ ನೀಡುತ್ತದೆ.',
      hi: 'तृतीय में राहु व नवम में केतु से भाई-बहनों से मतभेद, भाग्योदय में विलंब और अधिक संघर्ष रहता है, पर अद्भुत साहस मिलता है।'
    },
    remedies: {
      en: 'Recite Hanuman Chalisa on Tuesdays, worship Lord Subrahmanya / Kartikeya, and serve elders/mentors.',
      kn: 'ಮಂಗಳವಾರ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ, ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ ಆರಾಧನೆ ಮತ್ತು ಗುರು-ಹಿರಿಯರ ಸೇವೆ ಮಾಡಿ.',
      hi: 'मंगलवार को हनुमान चालीसा पाठ, कार्तिकेय/सुब्रह्मण्य पूजा और गुरुजनों की सेवा करें।'
    }
  },
  {
    id: 'shankhpal',
    rahuHouse: 4,
    ketuHouse: 10,
    name: { en: 'Shankhpal Kaal Sarpa Dosha', kn: 'ಶಂಖಪಾಲ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'शंखपाल कालसर्प दोष' },
    effects: {
      en: 'Rahu in 4th (Sukha) & Ketu in 10th (Karma) causes domestic restlessness, property delays, or sudden career changes, while giving strong determination to build lasting assets.',
      kn: '೪ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೧೦ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಗೃಹಸುಖದಲ್ಲಿ ಅಶಾಂತಿ, ಆಸ್ತಿ ವಿಚಾರದಲ್ಲಿ ವಿಳಂಬ ಮತ್ತು ವೃತ್ತಿಯಲ್ಲಿ ದಿಢೀರ್ ಬದಲಾವಣೆಗಳು ಕಂಡುಬರಬಹುದು.',
      hi: 'चतुर्थ में राहु व दशम में केतु से गृह सुख में अस्थिरता, संपत्ति कार्यों में विलंब और कार्यक्षेत्र में आकस्मिक परिवर्तन होते हैं।'
    },
    remedies: {
      en: 'Chant "Om Namah Shivaya" 108 times daily, worship Goddess Durga, and offer raw milk and bilva leaves to Shiva on Mondays.',
      kn: 'ಪ್ರತಿದಿನ ೧೦೮ ಬಾರಿ "ಓಂ ನಮಃ ಶಿವಾಯ" ಜಪ, ದುರ್ಗಾ ದೇವಿ ಪೂಜೆ ಮತ್ತು ಸೋಮವಾರ ಶಿವನಿಗೆ ಬಿಲ್ವಪತ್ರೆ ಅರ್ಪಿಸಿ.',
      hi: 'प्रतिदिन १०८ बार "ॐ नमः शिवाय" जप, माँ दुर्गा आराधना और सोमवार को शिवजी को बिल्वपत्र अर्पित करें।'
    }
  },
  {
    id: 'padma',
    rahuHouse: 5,
    ketuHouse: 11,
    name: { en: 'Padma Kaal Sarpa Dosha', kn: 'ಪದ್ಮ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'पद्म कालसर्प दोष' },
    effects: {
      en: 'Rahu in 5th (Vidya/Putra) & Ketu in 11th (Labha) brings interruptions in education, speculative risks, or worries about children, yet confers creative originality and sudden gains when disciplined.',
      kn: '೫ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೧೧ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ವಿದ್ಯಾಭ್ಯಾಸದಲ್ಲಿ ಅಡೆತಡೆ, ಸಂತಾನ ಚಿಂತೆ ಮತ್ತು ಹಣಕಾಸು ಹೂಡಿಕೆಯಲ್ಲಿ ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ; ಸೃಜನಶೀಲತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      hi: 'पंचम में राहु व एकादश में केतु से शिक्षा में बाधा, संतान चिंता और सट्टे/निवेश में जोखिम रहता है, परंतु रचनात्मक प्रतिभा मिलती है।'
    },
    remedies: {
      en: 'Worship Lord Ganesha and Goddess Saraswati, perform Nag Pratima Puja, and avoid impulsive speculative ventures.',
      kn: 'ಶ್ರೀ ಗಣಪತಿ ಮತ್ತು ಸರಸ್ವತಿ ಆರಾಧನೆ, ನಾಗಪ್ರತಿಷ್ಠಾ/ಆಶ್ಲೇಷ ಬಲಿ ಸೇವೆ ಹಾಗೂ ಹಠಾತ್ ಹೂಡಿಕೆಗಳಿಂದ ದೂರವಿರಿ.',
      hi: 'श्री गणेश व सरस्वती पूजा, नाग पूजन करें और जोखिम भरे निवेश से बचें।'
    }
  },
  {
    id: 'mahapadma',
    rahuHouse: 6,
    ketuHouse: 12,
    name: { en: 'Mahapadma Kaal Sarpa Dosha', kn: 'ಮಹಾಪದ್ಮ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'महापद्म कालसर्प दोष' },
    effects: {
      en: 'Rahu in 6th (Shatru/Roga) & Ketu in 12th (Vyaya/Moksha) grants victory over hidden rivals, but can bring unexpected expenses, sleep disturbance, or chronic fatigue if health is neglected.',
      kn: '೬ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೧೨ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಶತ್ರು ಜಯ ಸಿಕ್ಕರೂ ಅನಿರೀಕ್ಷಿತ ವೆಚ್ಚ, ನಿದ್ರಾಹೀನತೆ ಮತ್ತು ಆರೋಗ್ಯದ ಕಡೆ ಹೆಚ್ಚಿನ ಗಮನ ಅಗತ್ಯ; ಮೋಕ್ಷ ಚಿಂತನೆ ಹೆಚ್ಚುತ್ತದೆ.',
      hi: 'षष्ठ में राहु व द्वादश में केतु से शत्रुओं पर विजय मिलती है, किंतु अनावश्यक व्यय, अनिद्रा व स्वास्थ्य का विशेष ध्यान आवश्यक है।'
    },
    remedies: {
      en: 'Recite Vishnu Sahasranama or Rahu Stotra, feed birds/dogs, and donate blankets or food to the needy on Saturdays.',
      kn: 'ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ, ಶನಿವಾರ ಬಡವರಿಗೆ ಅನ್ನದಾನ/ವಸ್ತ್ರದಾನ ಹಾಗೂ ಪ್ರಾಣಿ-ಪಕ್ಷಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ.',
      hi: 'विष्णु सहस्रनाम पाठ, शनिवार को अन्न-वस्त्र दान तथा पक्षियों को दाना डालें।'
    }
  },
  {
    id: 'takshak',
    rahuHouse: 7,
    ketuHouse: 1,
    name: { en: 'Takshak Kaal Sarpa Dosha', kn: 'ತಕ್ಷಕ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'तक्षक कालसर्प दोष' },
    effects: {
      en: 'Ketu in 1st (Lagna) & Rahu in 7th (Kalatra) gives deep spiritual detachment and sharp intuition, while creating testing periods in marriage, business partnerships, and public dealings.',
      kn: 'ಲಗ್ನದಲ್ಲಿ ಕೇತು ಮತ್ತು ೭ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಇರುವುದರಿಂದ ವೈರಾಗ್ಯ/ಆಧ್ಯಾತ್ಮಿಕ ಬುದ್ಧಿ ಮತ್ತು ತೀಕ್ಷ್ಣ ಒಳನೋಟ ಸಿಗುತ್ತದೆ; ಆದರೆ ವಿವಾಹ, ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಜನಸಂಪರ್ಕದಲ್ಲಿ ತಾಳ್ಮೆ ಅತ್ಯಗತ್ಯ.',
      hi: 'लग्न में केतु व सप्तम में राहु से आध्यात्मिक अंतर्दृष्टि मिलती है, किंतु विवाह, व्यापारिक साझेदारी व सार्वजनिक संबंधों में धैर्य आवश्यक है।'
    },
    remedies: {
      en: 'Perform Shiva Abhisheka and Subrahmanya / Nagashanti Puja, recite Ganesha Atharvashirsha for Ketu in Lagna, and chant Rahu Beej Mantra.',
      kn: 'ಲಗ್ನ ಕೇತು ಶಾಂತಿಗಾಗಿ ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಪಠಣ, ಶಿವಾಭಿಷೇಕ, ಸುಬ್ರಹ್ಮಣ್ಯ/ನಾಗಶಾಂತಿ ಪೂಜೆ ಮತ್ತು ರಾಹು ಬೀಜ ಮಂತ್ರ ಜಪಿಸಿ.',
      hi: 'लग्न केतु शांति हेतु गणपति अथर्वशीर्ष पाठ, शिवाभिषेक, नागशांति पूजन एवं राहु बीज मंत्र जप करें।'
    }
  },
  {
    id: 'karkotak',
    rahuHouse: 8,
    ketuHouse: 2,
    name: { en: 'Karkotak Kaal Sarpa Dosha', kn: 'ಕರ್ಕೋಟಕ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'कर्कोटक कालसर्प दोष' },
    effects: {
      en: 'Rahu in 8th (Ayur/Randhra) & Ketu in 2nd (Dhana) produces sudden life transformations, inheritance disputes, or health cautions, while empowering occult mastery and crisis resilience.',
      kn: '೮ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೨ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಜೀವನದಲ್ಲಿ ದಿಢೀರ್ ತಿರುವುಗಳು, ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿ ವಿಳಂಬ ಮತ್ತು ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ; ಸಂಕಷ್ಟ ನಿವಾರಿಸುವ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.',
      hi: 'अष्टम में राहु व द्वितीय में केतु से आकस्मिक परिवर्तन, पैतृक संपत्ति विवाद व स्वास्थ्य सावधानी आवश्यक है, पर गूढ़ विद्या में सिद्धि मिलती है।'
    },
    remedies: {
      en: 'Chant Maha Mrityunjaya Mantra daily, perform Rudra Homa / Shanti, and offer sesame oil lamp to Lord Shiva on Saturdays.',
      kn: 'ಪ್ರತಿದಿನ ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಜಪ, ರುದ್ರಹೋಮ/ಶಾಂತಿ ಹಾಗೂ ಶನಿವಾರ ಶಿವನಿಗೆ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ.',
      hi: 'प्रतिदिन महामृत्युंजय मंत्र जप, रुद्र शांति तथा शनिवार को शिव मंदिर में तिल के तेल का दीपक जलाएं।'
    }
  },
  {
    id: 'shankhachud',
    rahuHouse: 9,
    ketuHouse: 3,
    name: { en: 'Shankhachud Kaal Sarpa Dosha', kn: 'ಶಂಖಚೂಡ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'शंखचूड़ कालसर्प दोष' },
    effects: {
      en: 'Rahu in 9th (Bhagya/Pitru) & Ketu in 3rd brings unconventional beliefs, delays in fortune or father’s support, and frequent travel, yet sparks independent philosophical leadership.',
      kn: '೯ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೩ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಭಾಗ್ಯಫಲದಲ್ಲಿ ವಿಳಂಬ, ಪಿತೃ-ಗುರು ವಿಚಾರದಲ್ಲಿ ಭಿನ್ನಮತ ಮತ್ತು ದೂರ ಪ್ರಯಾಣಗಳು ಉಂಟಾಗಬಹುದು; ಸ್ವತಂತ್ರ ಚಿಂತನೆ ಬೆಳೆಯುತ್ತದೆ.',
      hi: 'नवम में राहु व तृतीय में केतु से भाग्य में विलंब, पिता से वैचारिक मतभेद और यात्राएं होती हैं, परंतु स्वतंत्र दृष्टिकोण मिलता है।'
    },
    remedies: {
      en: 'Serve parents and teachers, perform Pitru Tarpana on Amavasya, and worship Lord Shiva and Lord Vishnu.',
      kn: 'ತಂದೆ-ತಾಯಿ ಮತ್ತು ಗುರುಗಳ ಸೇವೆ, ಅಮಾವಾಸ್ಯೆಯಂದು ಪಿತೃ ತರ್ಪಣ ಹಾಗೂ ಶಿವ-ವಿಷ್ಣು ಆರಾಧನೆ ಮಾಡಿ.',
      hi: 'माता-पिता व गुरुजनों की सेवा, अमावस्या पर पितृ तर्पण एवं शिव-विष्णु पूजा करें।'
    }
  },
  {
    id: 'ghatak',
    rahuHouse: 10,
    ketuHouse: 4,
    name: { en: 'Ghatak Kaal Sarpa Dosha', kn: 'ಘಾತಕ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'घातक कालसर्प दोष' },
    effects: {
      en: 'Rahu in 10th (Karma) & Ketu in 4th (Matru/Sukha) drives high professional ambition with periodic workplace politics or distance from birthplace, leading to high status through perseverance.',
      kn: '೧೦ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೪ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ವೃತ್ತಿಯಲ್ಲಿ ಉನ್ನತ ಮಹತ್ವಾಕಾಂಕ್ಷೆ, ಕಾರ್ಯಕ್ಷೇತ್ರದ ಸ್ಪರ್ಧೆ ಮತ್ತು ಜನ್ಮಸ್ಥಳದಿಂದ ದೂರ ವಾಸ ಸಂಭವಿಸುತ್ತದೆ; ನಿರಂತರ ಪರಿಶ್ರಮದಿಂದ ಉನ್ನತ ಪದವಿ ಲಭಿಸುತ್ತದೆ.',
      hi: 'दशम में राहु व चतुर्थ में केतु से कार्यक्षेत्र में उच्च महत्वाकांक्षा, प्रतिस्पर्धा और घर से दूर निवास के योग बनते हैं; निरंतर परिश्रम से पद-प्रतिष्ठा मिलती है।'
    },
    remedies: {
      en: 'Worship Goddess Durga / Chamundeshwari, recite Shiva Tandava or Panchakshari Stotra, and maintain ethical harmony at work.',
      kn: 'ಶ್ರೀ ದುರ್ಗಾ/ಚಾಮುಂಡೇಶ್ವರಿ ಆರಾಧನೆ, ಶಿವ ಪಂಚಾಕ್ಷರಿ ಸ್ತೋತ್ರ ಪಠಣ ಹಾಗೂ ವೃತ್ತಿಯಲ್ಲಿ ಧರ್ಮಪಾಲನೆ ಮಾಡಿ.',
      hi: 'माँ दुर्गा आराधना, शिव पंचाक्षरी स्तोत्र पाठ तथा कर्मक्षेत्र में नैतिकता बनाए रखें।'
    }
  },
  {
    id: 'vishdhar',
    rahuHouse: 11,
    ketuHouse: 5,
    name: { en: 'Vishdhar Kaal Sarpa Dosha', kn: 'ವಿಷಧರ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'विषधर कालसर्प दोष' },
    effects: {
      en: 'Rahu in 11th (Labha) & Ketu in 5th (Putra/Buddhi) brings strong networking and foreign income opportunities, mixed with mental restlessness, eye/nerve strain, or elder-sibling friction.',
      kn: '೧೧ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೫ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಉತ್ತಮ ಆದಾಯ ಮತ್ತು ವಿದೇಶ ಸಂಪರ್ಕ ಸಾಧ್ಯವಾದರೂ ಮಾನಸಿಕ ಒತ್ತಡ, ಸಂತಾನ/ವಿದ್ಯಾ ಚಿಂತೆ ಮತ್ತು ಮಿತ್ರರೊಂದಿಗೆ ಭಿನ್ನಾಭಿಪ್ರಾಯ ಕಂಡುಬರಬಹುದು.',
      hi: 'एकादश में राहु व पंचम में केतु से आय व बाहरी संपर्कों से लाभ होता है, पर मानसिक अस्थिरता व शिक्षा/संतान संबंधी चिंता रह सकती है।'
    },
    remedies: {
      en: 'Worship Lord Shiva and Lord Ganesha, perform Sarpa Samskara or Ashlesha Bali if severely afflicted, and meditate daily.',
      kn: 'ಶಿವ ಮತ್ತು ಗಣಪತಿ ಪೂಜೆ, ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಆಶ್ಲೇಷ ಬಲಿ/ನಾಗಶಾಂತಿ ಹಾಗೂ ಪ್ರತಿದಿನ ಪ್ರಾಣಾಯಾಮ-ಧ್ಯಾನ ಅಭ್ಯಸಿಸಿ.',
      hi: 'शिव-गणेश आराधना, नागशांति पूजन तथा नियमित ध्यान-प्राणायाम करें।'
    }
  },
  {
    id: 'sheshnag',
    rahuHouse: 12,
    ketuHouse: 6,
    name: { en: 'Sheshnag Kaal Sarpa Dosha', kn: 'ಶೇಷನಾಗ ಕಾಲಸರ್ಪ ದೋಷ', hi: 'शेषनाग कालसर्प दोष' },
    effects: {
      en: 'Rahu in 12th (Vyaya) & Ketu in 6th (Shatru) causes hidden expenses, foreign settlement tendencies, or litigation cautions, while bestowing ultimate victory over adversity and deep Moksha leanings.',
      kn: '೧೨ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು ಮತ್ತು ೬ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು ಇರುವುದರಿಂದ ಅನಿರೀಕ್ಷಿತ ವೆಚ್ಚ, ವಿದೇಶ ಪ್ರಯಾಣ/ವಾಸ ಮತ್ತು ಕಾನೂನು/ಶತ್ರು ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ; ಅಂತಿಮವಾಗಿ ಸಂಕಷ್ಟ ಜಯಿಸಿ ಆಧ್ಯಾತ್ಮಿಕ ಉನ್ನತಿ ದೊರೆಯುತ್ತದೆ.',
      hi: 'द्वादश में राहु व षष्ठ में केतु से गुप्त व्यय, विदेश प्रवास व शत्रु-विवाद से सावधानी आवश्यक है, पर अंततः संघर्षों पर विजय व आध्यात्मिक उन्नति मिलती है।'
    },
    remedies: {
      en: 'Offer prayers to Lord Vishnu (Ananta Padmanabha) and Lord Shiva, donate food/blankets, and chant Rahu-Ketu Shanti Mantras.',
      kn: 'ಶ್ರೀ ಅನಂತಪದ್ಮನಾಭ ಸ್ವಾಮಿ ಮತ್ತು ಶಿವನ ಆರಾಧನೆ, ಅನ್ನದಾನ ಹಾಗೂ ರಾಹು-ಕೇತು ಶಾಂತಿ ಮಂತ್ರ ಜಪಿಸಿ.',
      hi: 'भगवान अनंतपद्मनाभ व शिव पूजा, अन्नदान एवं राहु-केतु शांति मंत्र जप करें।'
    }
  }
];

// Nakshatras ruled by Rahu (indices: 5 Ardra, 14 Swati, 23 Shatabhisha) and Ketu (0 Ashwini, 9 Magha, 18 Moola)
export const RAHU_RULED_NAKSHATRAS = [5, 14, 23];
export const KETU_RULED_NAKSHATRAS = [0, 9, 18];

export interface KaalSarpaPlanetArcInfo {
  planet: PlanetPosition;
  exactLong: number;
  nakshatraIndex: number;
  nakshatraName: LocalizedString;
  pada: number;
  akshara: { en: string; kn: string; hi: string };
  arcSide: 'rahu-to-ketu' | 'ketu-to-rahu';
  isOnRahuKetuNakshatra: boolean;
  isConjunctNode: boolean;
}

export interface KaalSarpaAnalysis {
  status: 'complete' | 'partial' | 'none';
  direction: 'udit' | 'anudit' | 'mixed'; // Udit = Rahu->Ketu (Rising), Anudit = Ketu->Rahu (Setting)
  rahu: PlanetPosition;
  ketu: PlanetPosition;
  rahuLong: number;
  ketuLong: number;
  rahuNakshatra: LocalizedString;
  ketuNakshatra: LocalizedString;
  rahuAkshara: { en: string; kn: string; hi: string };
  ketuAkshara: { en: string; kn: string; hi: string };
  matchingType: KaalSarpaTypeInfo;
  planetsOnRahuToKetu: KaalSarpaPlanetArcInfo[];
  planetsOnKetuToRahu: KaalSarpaPlanetArcInfo[];
  breakingPlanets: KaalSarpaPlanetArcInfo[];
  allSevenPlanets: KaalSarpaPlanetArcInfo[];
  nodeNakshatraPlanets: KaalSarpaPlanetArcInfo[];
  summary: LocalizedString;
}

export function analyzeKaalSarpaDosha(kundaliData: KundaliData): KaalSarpaAnalysis {
  const rahu = kundaliData.planets.find(p => p.name === 'Rahu') || kundaliData.planets[7];
  const ketu = kundaliData.planets.find(p => p.name === 'Ketu') || kundaliData.planets[8];

  const rahuLong = (rahu.rashiIndex * 30 + rahu.degrees) % 360;
  const ketuLong = (ketu.rashiIndex * 30 + ketu.degrees) % 360;

  const nakSpan = 360 / 27;
  const getNakMeta = (long: number, pada: number) => {
    const nIdx = Math.floor(long / nakSpan) % 27;
    const rec = RASHI_NAKSHATRA_CHART[nIdx] || RASHI_NAKSHATRA_CHART[0];
    const ak = getNakshatraPadaAkshara(nIdx, pada);
    return {
      nIdx,
      name: { en: rec.nakshatraEn, kn: rec.nakshatraKn, hi: rec.nakshatraHi },
      akshara: { en: ak.akshara, kn: ak.aksharaKannada, hi: ak.aksharaDevanagari }
    };
  };

  const rahuMeta = getNakMeta(rahuLong, rahu.pada);
  const ketuMeta = getNakMeta(ketuLong, ketu.pada);

  const sevenPlanets = kundaliData.planets.filter(p => p.name !== 'Rahu' && p.name !== 'Ketu');

  const allSevenPlanets: KaalSarpaPlanetArcInfo[] = sevenPlanets.map(p => {
    const exactLong = (p.rashiIndex * 30 + p.degrees) % 360;
    const degFromRahu = (exactLong - rahuLong + 360) % 360;
    const arcSide: 'rahu-to-ketu' | 'ketu-to-rahu' = degFromRahu < 180 ? 'rahu-to-ketu' : 'ketu-to-rahu';
    const distToRahu = Math.min(degFromRahu, 360 - degFromRahu);
    const degFromKetu = (exactLong - ketuLong + 360) % 360;
    const distToKetu = Math.min(degFromKetu, 360 - degFromKetu);
    const isConjunctNode = distToRahu <= 5 || distToKetu <= 5;
    const meta = getNakMeta(exactLong, p.pada);
    const isOnRahuKetuNakshatra =
      RAHU_RULED_NAKSHATRAS.includes(meta.nIdx) || KETU_RULED_NAKSHATRAS.includes(meta.nIdx);

    return {
      planet: p,
      exactLong,
      nakshatraIndex: meta.nIdx,
      nakshatraName: meta.name,
      pada: p.pada,
      akshara: meta.akshara,
      arcSide,
      isOnRahuKetuNakshatra,
      isConjunctNode
    };
  });

  const planetsOnRahuToKetu = allSevenPlanets.filter(p => p.arcSide === 'rahu-to-ketu');
  const planetsOnKetuToRahu = allSevenPlanets.filter(p => p.arcSide === 'ketu-to-rahu');
  const nodeNakshatraPlanets = allSevenPlanets.filter(p => p.isOnRahuKetuNakshatra);

  const matchingType =
    TWELVE_KAAL_SARPA_TYPES.find(t => t.rahuHouse === rahu.bhava && t.ketuHouse === ketu.bhava) ||
    TWELVE_KAAL_SARPA_TYPES[0];

  let status: 'complete' | 'partial' | 'none' = 'none';
  let direction: 'udit' | 'anudit' | 'mixed' = 'mixed';
  let breakingPlanets: KaalSarpaPlanetArcInfo[] = [];

  if (planetsOnRahuToKetu.length === 7) {
    status = 'complete';
    direction = 'udit';
  } else if (planetsOnKetuToRahu.length === 7) {
    status = 'complete';
    direction = 'anudit';
  } else if (planetsOnRahuToKetu.length === 6) {
    status = 'partial';
    direction = 'udit';
    breakingPlanets = planetsOnKetuToRahu;
  } else if (planetsOnKetuToRahu.length === 6) {
    status = 'partial';
    direction = 'anudit';
    breakingPlanets = planetsOnRahuToKetu;
  } else {
    status = 'none';
    direction = 'mixed';
    breakingPlanets =
      planetsOnRahuToKetu.length <= planetsOnKetuToRahu.length
        ? planetsOnRahuToKetu
        : planetsOnKetuToRahu;
  }

  let summary: LocalizedString;
  if (status === 'complete') {
    summary = {
      en: `Complete (Purna) ${matchingType.name.en} is formed! All 7 Grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are hemmed on one side of the Rahu (House ${rahu.bhava}) – Ketu (House ${ketu.bhava}) axis (${direction === 'udit' ? 'Udit / Rising Arc' : 'Anudit / Setting Arc'}).`,
      kn: `ಪೂರ್ಣ ${matchingType.name.kn} ಯೋಗವಿದೆ! ರಾಹು (${rahu.bhava}ನೇ ಭಾವ) ಮತ್ತು ಕೇತು (${ketu.bhava}ನೇ ಭಾವ) ಅಕ್ಷದ ಒಂದೇ ಬದಿಯಲ್ಲಿ ಸೂರ್ಯಾದಿ ಎಲ್ಲಾ ೭ ಗ್ರಹಗಳು ಬಂಧಿತವಾಗಿವೆ (${direction === 'udit' ? 'ಉದಿತ ಗೋಳಾರ್ಧ' : 'ಅನುದಿತ ಗೋಳಾರ್ಧ'}).`,
      hi: `पूर्ण ${matchingType.name.hi} बन रहा है! राहु (${rahu.bhava}वां भाव) व केतु (${ketu.bhava}वां भाव) के अक्ष के एक ही तरफ सभी ७ ग्रह स्थित हैं (${direction === 'udit' ? 'उदित गोलार्ध' : 'अनुदित गोलार्ध'})।`
    };
  } else if (status === 'partial') {
    const bp = breakingPlanets[0]?.planet;
    summary = {
      en: `Partial (Anshik) ${matchingType.name.en} is indicated: 6 of 7 Grahas lie on one side of the Rahu (H${rahu.bhava}) – Ketu (H${ketu.bhava}) axis, while ${bp?.sanskritName.en || '1 planet'} (House ${bp?.bhava}) steps outside the axis and softens the Dosha.`,
      kn: `ಆಂಶಿಕ ${matchingType.name.kn} ಸೂಚಿತವಾಗಿದೆ: ರಾಹು (${rahu.bhava}ನೇ ಭಾವ) – ಕೇತು (${ketu.bhava}ನೇ ಭಾವ) ನಡುವೆ ೬ ಗ್ರಹಗಳು ಒಂದೇ ಬದಿಯಲ್ಲಿದ್ದು, ${bp?.sanskritName.kn || '೧ ಗ್ರಹ'} (${bp?.bhava}ನೇ ಭಾವ) ಹೊರಗಿರುವುದರಿಂದ ದೋಷದ ತೀವ್ರತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.`,
      hi: `आंशिक ${matchingType.name.hi} के संकेत हैं: राहु (भाव ${rahu.bhava}) – केतु (भाव ${ketu.bhava}) के एक तरफ ६ ग्रह हैं, जबकि ${bp?.sanskritName.hi || '१ ग्रह'} (भाव ${bp?.bhava}) बाहर होने से दोष की तीव्रता कम होती है।`
    };
  } else {
    summary = {
      en: `No Kaal Sarpa Dosha in this Lagna Kundali! Your 7 Grahas are distributed across both sides of the Rahu (House ${rahu.bhava}, ${rahu.rashiName.en}) – Ketu (House ${ketu.bhava}, ${ketu.rashiName.en}) axis (${planetsOnRahuToKetu.length} on Rahu→Ketu arc, ${planetsOnKetuToRahu.length} on Ketu→Rahu arc).`,
      kn: `ಈ ಲಗ್ನ ಕುಂಡಲಿಯಲ್ಲಿ ಕಾಲಸರ್ಪ ದೋಷವಿಲ್ಲ! ರಾಹು (${rahu.bhava}ನೇ ಭಾವ, ${rahu.rashiName.kn}) – ಕೇತು (${ketu.bhava}ನೇ ಭಾವ, ${ketu.rashiName.kn}) ಅಕ್ಷದ ಎರಡೂ ಬದಿಗಳಲ್ಲಿ ಗ್ರಹಗಳು ಹಂಚಿಕೆಯಾಗಿವೆ (ರಾಹು→ಕೇತು ಬದಿ: ${planetsOnRahuToKetu.length}, ಕೇತು→ರಾಹು ಬದಿ: ${planetsOnKetuToRahu.length}).`,
      hi: `इस लग्न कुण्डली में कालसर्प दोष नहीं है! राहु (भाव ${rahu.bhava}, ${rahu.rashiName.hi}) – केतु (भाव ${ketu.bhava}, ${ketu.rashiName.hi}) अक्ष के दोनों ओर ग्रह वितरित हैं (राहु→केतु: ${planetsOnRahuToKetu.length}, केतु→राहु: ${planetsOnKetuToRahu.length})।`
    };
  }

  return {
    status,
    direction,
    rahu,
    ketu,
    rahuLong,
    ketuLong,
    rahuNakshatra: rahuMeta.name,
    ketuNakshatra: ketuMeta.name,
    rahuAkshara: rahuMeta.akshara,
    ketuAkshara: ketuMeta.akshara,
    matchingType,
    planetsOnRahuToKetu,
    planetsOnKetuToRahu,
    breakingPlanets,
    allSevenPlanets,
    nodeNakshatraPlanets,
    summary
  };
}
