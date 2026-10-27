import { Language, LocalizedString } from '../types';

export interface DashaLordInfo {
  name: string;
  sanskrit: LocalizedString;
  symbol: string;
  color: string;
  years: number;
  rulingPlanet: string;
  element: LocalizedString;
  deity: LocalizedString;
  generalSignificance: LocalizedString;
  gemstone: LocalizedString;
  mantra: LocalizedString;
  auspiciousDay: LocalizedString;
  charityDaana: LocalizedString;
}

export const DASHA_LORDS: DashaLordInfo[] = [
  {
    name: 'Ketu',
    sanskrit: { en: 'Ketu (South Node)', kn: 'ಕೇತು', hi: 'केतु' },
    symbol: 'Ke',
    color: '#78716c',
    years: 7,
    rulingPlanet: 'Ketu',
    element: { en: 'Fire / Subtle Ether', kn: 'ಅಗ್ನಿ / ಸೂಕ್ಷ್ಮ ಆಕಾಶ', hi: 'अग्नि / सूक्ष्म आकाश' },
    deity: { en: 'Lord Ganesha & Matsya Avatara', kn: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ & ಮತ್ಸ್ಯಾವತಾರ', hi: 'भगवान गणेश एवं मत्स्यावतार' },
    generalSignificance: {
      en: 'Spiritual detachment, introspection, occult wisdom, sudden transformations, and moksha aspiration.',
      kn: 'ಅಧ್ಯಾತ್ಮ ಸಾಧನೆ, ವೈರಾಗ್ಯ, ಆಂತರಿಕ ಪರಿವರ್ತನೆ, ಮೋಕ್ಷ ಚಿಂತನೆ ಹಾಗೂ ಹಠಾತ್ ಘಟನೆಗಳು.',
      hi: 'अध्यात्म, वैराग्य, आत्मचिंतन, गूढ़ विद्या एवं मोक्ष की प्रेरणा।'
    },
    gemstone: { en: "Cat's Eye (Vaidurya)", kn: 'ವೈಡೂರ್ಯ', hi: 'लहसुनिया' },
    mantra: { en: 'Om Kem Ketave Namah', kn: 'ಓಂ ಕೇಂ ಕೇತವೇ ನಮಃ', hi: 'ॐ कें केतवे नमः' },
    auspiciousDay: { en: 'Tuesday / Thursday', kn: 'ಮಂಗಳವಾರ / ಗುರುವಾರ', hi: 'मंगलवार / गुरुवार' },
    charityDaana: { en: 'Sesame seeds, black blankets, food to ascetics & street dogs', kn: 'ಕಪ್ಪು ಎಳ್ಳು, ಕಂಬಳಿ ದಾನ, ಸಾಧು-ಸಂತರ ಸೇವೆ', hi: 'काले तिल, कम्बल दान, साधु-सेवा एवं श्वान को भोजन' }
  },
  {
    name: 'Venus',
    sanskrit: { en: 'Shukra (Venus)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    symbol: 'Ve',
    color: '#ec4899',
    years: 20,
    rulingPlanet: 'Venus',
    element: { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्त्व' },
    deity: { en: 'Goddess Mahalakshmi & Parashurama', kn: 'ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ & ಪರಶುರಾಮ', hi: 'माँ महालक्ष्मी एवं परशुराम' },
    generalSignificance: {
      en: 'Artistic creativity, romance, marriage, prosperity, vehicle acquisition, luxury, and social magnetism.',
      kn: 'ಕಲಾತ್ಮಕತೆ, ಪ್ರೇಮ, ವಿವಾಹ ಯೋಗ, ಭೌತಿಕ ಸುಖ-ಸಂಪತ್ತು, ವಾಹನ ಲಾಭ ಹಾಗೂ ಸಾಮಾಜಿಕ ಗೌರವ.',
      hi: 'कला, प्रेम, विवाह, भौतिक सुख-सम्पत्ति, वाहन लाभ एवं ऐश्वर्य।'
    },
    gemstone: { en: 'Diamond (Heera) / White Zircon', kn: 'ವಜ್ರ / ಬಿಳಿ ಜಿರ್ಕಾನ್', hi: 'हीरा / श्वेत जरकन' },
    mantra: { en: 'Om Shum Shukraya Namah', kn: 'ಓಂ ಶುಂ ಶುಕ್ರಾಯ ನಮಃ', hi: 'ॐ शुं शुक्राय नमः' },
    auspiciousDay: { en: 'Friday', kn: 'ಶುಕ್ರವಾರ', hi: 'शुक्रवार' },
    charityDaana: { en: 'White garments, rice, sugar, silver, ghee', kn: 'ಬಿಳಿ ವಸ್ತ್ರ, ಅಕ್ಕಿ, ಸಕ್ಕರೆ, ತುಪ್ಪ ದಾನ', hi: 'श्वेत वस्त्र, चावल, चीनी, घी एवं चाँदी' }
  },
  {
    name: 'Sun',
    sanskrit: { en: 'Surya (Sun)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    symbol: 'Su',
    color: '#f59e0b',
    years: 6,
    rulingPlanet: 'Sun',
    element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्त्व' },
    deity: { en: 'Lord Surya Narayana & Lord Rama', kn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ & ಶ್ರೀ ರಾಮ', hi: 'सूर्य नारायण एवं श्री राम' },
    generalSignificance: {
      en: 'Vitality, leadership authority, career ascension, government recognition, fatherly blessings, and self-confidence.',
      kn: 'ಆತ್ಮಬಲ, ರಾಜಕೀಯ/ಆಡಳಿತ ಅಧಿಕಾರ, ಉದ್ಯೋಗೋನ್ನತಿ, ಕೀರ್ತಿ, ತಂದೆಯ ಆಶೀರ್ವಾದ.',
      hi: 'आत्मबल, नेतृत्व, पदोन्नति, राजकीय सम्मान, पितृ कृपा एवं तेजस्विता।'
    },
    gemstone: { en: 'Ruby (Manikya)', kn: 'ಮಾಣಿಕ್ಯ', hi: 'माणिक्य' },
    mantra: { en: 'Om Hram Hreem Hroum Sah Suryaya Namah', kn: 'ಓಂ ಹ್ರಾಂ ಹ್ರೀಂ ಸ್ರೌಂ ಸಃ ಸೂರ್ಯಾಯ ನಮಃ', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
    auspiciousDay: { en: 'Sunday', kn: 'ಭಾನುವಾರ', hi: 'रविवार' },
    charityDaana: { en: 'Wheat, jaggery, ruby, copper vessels', kn: 'ಗೋಧಿ, ಬೆಲ್ಲ, ತಾಮ್ರದ ಪಾತ್ರೆ ದಾನ', hi: 'गेहूँ, गुड़, ताँबे के पात्र एवं लाल वस्त्र' }
  },
  {
    name: 'Moon',
    sanskrit: { en: 'Chandra (Moon)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    symbol: 'Mo',
    color: '#06b6d4',
    years: 10,
    rulingPlanet: 'Moon',
    element: { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्त्व' },
    deity: { en: 'Goddess Parvati & Lord Krishna', kn: 'ಶ್ರೀ ಪಾರ್ವತೀ ದೇವಿ & ಶ್ರೀ ಕೃಷ್ಣ', hi: 'माँ पार्वती एवं श्री कृष्ण' },
    generalSignificance: {
      en: 'Emotional peace, travel, domestic happiness, maternal blessings, public popularity, and intuitive imagination.',
      kn: 'ಮನಃಶಾಂತಿ, ತಾಯಿಯ ಸುಖ, ಜನಪ್ರಿಯತೆ, ಪ್ರಯಾಣ ಯೋಗ, ಕಲ್ಪನಾ ಶಕ್ತಿ ಮತ್ತು ಭಾವನಾತ್ಮಕ ನೆಮ್ಮದಿ.',
      hi: 'मानसिक शान्ति, मातृ सुख, जनप्रियता, यात्रा एवं सौम्यता।'
    },
    gemstone: { en: 'Pearl (Moti) / Moonstone', kn: 'ಮುತ್ತು / ಚಂದ್ರಕಾಂತ ಶಿಲೆ', hi: 'मोती / चंद्रकांत मणि' },
    mantra: { en: 'Om Shram Shreem Shroum Sah Chandraya Namah', kn: 'ಓಂ ಶ್ರಾಂ ಶ್ರೀಂ ಶ್ರೌಂ ಸಃ ಚಂದ್ರಾಯ ನಮಃ', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः' },
    auspiciousDay: { en: 'Monday', kn: 'ಸೋಮವಾರ', hi: 'सोमवार' },
    charityDaana: { en: 'Milk, white rice, silver coin, conch shell (Shankha)', kn: 'ಹಾಲು, ಬಿಳಿ ಅಕ್ಕಿ, ಬೆಳ್ಳಿ, ಶಂಖ ದಾನ', hi: 'दूध, सफेद चावल, शंख एवं चाँदी' }
  },
  {
    name: 'Mars',
    sanskrit: { en: 'Mangala (Mars)', kn: 'ಮಂಗಳ (ಕುಜ)', hi: 'मंगल' },
    symbol: 'Ma',
    color: '#ef4444',
    years: 7,
    rulingPlanet: 'Mars',
    element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्त्व' },
    deity: { en: 'Lord Subrahmanya (Kartikeya) & Narasimha', kn: 'ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ & ನರಸಿಂಹ ಸ್ವಾಮಿ', hi: 'भगवान कार्तिकेय एवं नृसिंह' },
    generalSignificance: {
      en: 'Physical courage, real estate / land acquisition, sibling relations, competitive triumphs, and technical prowess.',
      kn: 'ಶೌರ್ಯ, ಭೂಮಿ/ಆಸ್ತಿ ಸಂಪಾದನೆ, ಸಾಹಸ, ಸಹೋದರರ ನೆರವು, ಸ್ಪರ್ಧಾ ವಿಜಯ.',
      hi: 'शौर्य, भूमि/सम्पत्ति लाभ, पराक्रम, भ्रातृ सुख एवं विजय।'
    },
    gemstone: { en: 'Red Coral (Moonga)', kn: 'ಹವಳ', hi: 'मूंगा' },
    mantra: { en: 'Om Kram Kreem Kroum Sah Bhaumaya Namah', kn: 'ಓಂ ಕ್ರಾಂ ಕ್ರೀಂ ಕ್ರೌಂ ಸಃ ಭೌಮಾಯ ನಮಃ', hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' },
    auspiciousDay: { en: 'Tuesday', kn: 'ಮಂಗಳವಾರ', hi: 'मंगलवार' },
    charityDaana: { en: 'Red lentils (Toor/Masoor dal), copper, red flowers', kn: 'ತೊಗರಿ ಬೇಳೆ / ಮಸೂರ, ಕೆಂಪು ವಸ್ತ್ರ, ತಾಮ್ರ', hi: 'मसूर दाल, लाल वस्त्र, ताँबा एवं गुड़' }
  },
  {
    name: 'Rahu',
    sanskrit: { en: 'Rahu (North Node)', kn: 'ರಾಹು', hi: 'राहु' },
    symbol: 'Ra',
    color: '#6366f1',
    years: 18,
    rulingPlanet: 'Rahu',
    element: { en: 'Air / Illusory Wind', kn: 'ವಾಯು / ಮಾಯಾ ತತ್ವ', hi: 'वायु / माया तत्त्व' },
    deity: { en: 'Goddess Durga & Lord Varaha', kn: 'ಶ್ರೀ ದುರ್ಗಾ ದೇವಿ & ವರಾಹ ಸ್ವಾಮಿ', hi: 'माँ दुर्गा एवं वराह अवतार' },
    generalSignificance: {
      en: 'Foreign journeys, groundbreaking innovation, unconventional gains, worldly ambitions, and unexpected shifts.',
      kn: 'ವಿದೇಶ ಪ್ರಯಾಣ, ಆಕಸ್ಮಿಕ ಲಾಭ, ತಂತ್ರಜ್ಞಾನ ಯಶಸ್ಸು, ಲೌಕಿಕ ಮಹತ್ವಾಕಾಂಕ್ಷೆ.',
      hi: 'विदेश गमन, आकस्मिक सफलता, तकनीकी उन्नति एवं महत्त्वाकांक्षा।'
    },
    gemstone: { en: 'Hessonite (Gomed)', kn: 'ಗೋಮೇಧಿಕ', hi: 'गोमेद' },
    mantra: { en: 'Om Bhram Bhreem Bhroum Sah Rahave Namah', kn: 'ಓಂ ಭ್ರಾಂ ಭ್ರೀಂ ಭ್ರೌಂ ಸಃ ರಾಹವೇ ನಮಃ', hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः' },
    auspiciousDay: { en: 'Saturday', kn: 'ಶನಿವಾರ', hi: 'शनिवार' },
    charityDaana: { en: 'Black mustard seeds, urad dal, lead, blue garments', kn: 'ಕರಿ ಸಾಸಿವೆ, ಉದ್ದಿನ ಬೇಳೆ, ನೀಲಿ ವಸ್ತ್ರ', hi: 'काले उड़द, सरसों, तिल एवं नीले वस्त्र' }
  },
  {
    name: 'Jupiter',
    sanskrit: { en: 'Guru (Jupiter)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'बृहस्पति (गुरु)' },
    symbol: 'Ju',
    color: '#eab308',
    years: 16,
    rulingPlanet: 'Jupiter',
    element: { en: 'Ether (Akasha)', kn: 'ಆಕಾಶ ತತ್ವ', hi: 'आकाश तत्त्व' },
    deity: { en: 'Lord Dakshinamurthy & Vamana Avatara', kn: 'ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ & ವಾಮನಾವತಾರ', hi: 'भगवान दक्षिणामूर्ति एवं वामन अवतार' },
    generalSignificance: {
      en: 'Wisdom, progeny happiness, spiritual teacher grace, financial abundance, dharmic deeds, and scholastic prestige.',
      kn: 'ಜ್ಞಾನ, ಸಂತಾನ ಸುಖ, ಗುರುಕೃಪೆ, ಧನ ಸಮೃದ್ಧಿ, ಧರ್ಮ ಕಾರ್ಯಗಳು ಹಾಗೂ ವಿದ್ವತ್ತು.',
      hi: 'ज्ञान, सन्तान सुख, गुरु कृपा, धन-ऐश्वर्य, धार्मिक कार्य एवं सम्मान।'
    },
    gemstone: { en: 'Yellow Sapphire (Pukhraj) / Citrine', kn: 'ಪುಷ್ಯರಾಗ / ಸುನಹಲಾ', hi: 'पुखराज / सुनहला' },
    mantra: { en: 'Om Gram Greem Groum Sah Gurave Namah', kn: 'ಓಂ ಗ್ರಾಂ ಗ್ರೀಂ ಗ್ರೌಂ ಸಃ ಗುರವೇ ನಮಃ', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
    auspiciousDay: { en: 'Thursday', kn: 'ಗುರುವಾರ', hi: 'गुरुवार' },
    charityDaana: { en: 'Chana dal, turmeric, yellow cloth, gold, sacred scriptures', kn: 'ಕಡಲೆ ಬೇಳೆ, ಅರಿಶಿನ, ಹಳದಿ ವಸ್ತ್ರ, ಧಾರ್ಮಿಕ ಗ್ರಂಥಗಳು', hi: 'चने की दाल, हल्दी, पीले वस्त्र एवं धार्मिक पुस्तकें' }
  },
  {
    name: 'Saturn',
    sanskrit: { en: 'Shani (Saturn)', kn: 'ಶನಿ', hi: 'शनि' },
    symbol: 'Sa',
    color: '#3b82f6',
    years: 19,
    rulingPlanet: 'Saturn',
    element: { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्त्व' },
    deity: { en: 'Lord Hanuman & Kurma Avatara', kn: 'ಶ್ರೀ ಹನುಮಂತ & ಕೂರ್ಮಾವತಾರ', hi: 'हनुमान जी एवं कूर्मावतार' },
    generalSignificance: {
      en: 'Discipline, enduring patience, karmic justice, longevity, foundation building, and hard-earned mastery.',
      kn: 'ಶಿಸ್ತು, ಸಂಯಮ, ಕರ್ಮಫಲ ಸಿದ್ಧಿ, ದೀರ್ಘಾಯುಷ್ಯ, ಕಠಿಣ ಪರಿಶ್ರಮದಿಂದ ಶಾಶ್ವತ ಯಶಸ್ಸು.',
      hi: 'अनुशासन, धैर्य, कर्मफल, दीर्घायु, स्थिर सफलता एवं तपस्या।'
    },
    gemstone: { en: 'Blue Sapphire (Neelam) / Amethyst', kn: 'ನೀಲಮಣಿ / ಜಾಂಬುನಿಯಾ', hi: 'नीलम / कटहला' },
    mantra: { en: 'Om Pram Preem Proum Sah Shanaischaraya Namah', kn: 'ಓಂ ಪ್ರಾಂ ಪ್ರೀಂ ಪ್ರೌಂ ಸಃ ಶನೈಶ್ಚರಾಯ ನಮಃ', hi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' },
    auspiciousDay: { en: 'Saturday', kn: 'ಶನಿವಾರ', hi: 'शनिवार' },
    charityDaana: { en: 'Sesame oil lamps, black sesame, iron pan, feeding disabled & crows', kn: 'ಎಳ್ಳೆಣ್ಣೆ ದೀಪ, ಕಬ್ಬಿಣದ ವಸ್ತು, ಕಾಗೆಗಳಿಗೆ ಅನ್ನ', hi: 'तिल का तेल, काले तिल, लोहा एवं निर्धनों को अन्नदान' }
  },
  {
    name: 'Mercury',
    sanskrit: { en: 'Budha (Mercury)', kn: 'ಬುಧ', hi: 'बुध' },
    symbol: 'Me',
    color: '#10b981',
    years: 17,
    rulingPlanet: 'Mercury',
    element: { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्त्व' },
    deity: { en: 'Lord Vishnu & Buddha Avatara', kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು & ಬುದ್ಧಾವತಾರ', hi: 'भगवान विष्णु एवं बुद्धावतार' },
    generalSignificance: {
      en: 'Intellect, commerce, eloquence, diplomatic communication, analytical studies, and versatile networking.',
      kn: 'ಬುದ್ಧಿಶಕ್ತಿ, ವ್ಯಾಪಾರ-ವ್ಯವಹಾರ, ವಾಕ್ಚಾತುರ್ಯ, ಗಣಿತ, ಸಂವಹನ ಕಲೆ ಮತ್ತು ಅಧ್ಯಯನ.',
      hi: 'बुद्धि, व्यापार, वाक्चातुर्य, विद्या, संचार कला एवं विवेक।'
    },
    gemstone: { en: 'Emerald (Panna) / Green Tourmaline', kn: 'ಪಚ್ಚೆ / ಮರಕತ', hi: 'पन्ना / हरा जेड' },
    mantra: { en: 'Om Bram Breem Broum Sah Budhaya Namah', kn: 'ಓಂ ಬ್ರಾಂ ಬ್ರೀಂ ಬ್ರೌಂ ಸಃ ಬುಧಾಯ ನಮಃ', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
    auspiciousDay: { en: 'Wednesday', kn: 'ಬುಧವಾರ', hi: 'बुधवार' },
    charityDaana: { en: 'Green moong dal, green vegetables, green cloth, stationery to students', kn: 'ಹೆಸರು ಕಾಳು, ಹಸಿರು ತರಕಾರಿ, ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪುಸ್ತಕ ದಾನ', hi: 'हरी मूँग दाल, हरी सब्जियाँ, हरे वस्त्र एवं छात्र-सहायता' }
  }
];

export interface PratyantardashaPeriod {
  lord: DashaLordInfo;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  isCurrent: boolean;
  intensityScore: number;
}

export interface AntardashaPeriod {
  lord: DashaLordInfo;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  durationDays: number;
  isCurrent: boolean;
  intensityScore: number;
  pratyantardashas: PratyantardashaPeriod[];
  currentPratyantardasha?: PratyantardashaPeriod;
}

export interface MahadashaPeriod {
  lord: DashaLordInfo;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
  antardashas: AntardashaPeriod[];
  currentAntardasha?: AntardashaPeriod;
  intensityScore: number;
}

export interface DashaProgressInfo {
  mahadashaPercent: number;
  mahadashaDaysElapsed: number;
  mahadashaDaysRemaining: number;
  antardashaPercent: number;
  antardashaDaysElapsed: number;
  antardashaDaysRemaining: number;
  pratyantardashaPercent: number;
  pratyantardashaDaysElapsed: number;
  pratyantardashaDaysRemaining: number;
}

export interface TriadInterpretation {
  headline: LocalizedString;
  generalDescription: LocalizedString;
  careerAndAmbition: LocalizedString;
  healthAndVitality: LocalizedString;
  wealthAndProsperity: LocalizedString;
  relationshipsAndFamily: LocalizedString;
  spiritualGrowth: LocalizedString;
  prescribedRemedies: LocalizedString;
}

export interface VimshottariDashaResult {
  birthNakshatraIndex: number;
  birthNakshatraLord: DashaLordInfo;
  balanceYearsAtBirth: number;
  targetDate: Date;
  mahadashas: MahadashaPeriod[];
  currentMahadasha: MahadashaPeriod;
  currentAntardasha: AntardashaPeriod;
  currentPratyantardasha: PratyantardashaPeriod;
  progress: DashaProgressInfo;
  triadInterpretation: TriadInterpretation;
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
 * Calculates accurate Vimshottari Dasha, Antardasha (Bhukti), and Pratyantardasha periods
 * following the classical Parashara system (120-year cycle).
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonSiderealLongitude: number,
  targetDate: Date = new Date()
): VimshottariDashaResult {
  // 27 Nakshatras: 13°20' each = 13.33333333 degrees
  const nakshatraSpan = 360 / 27;
  const normalizedLong = ((moonSiderealLongitude % 360) + 360) % 360;
  const rawNakIndex = Math.floor(normalizedLong / nakshatraSpan) % 27;
  const nakshatraIndex = (rawNakIndex + 27) % 27;

  // The 9 lords sequence repeats every 9 nakshatras:
  // Ashwini (0) -> Ketu (0)
  // Bharani (1) -> Venus (1)
  // Krittika (2) -> Sun (2)
  // Rohini (3) -> Moon (3)
  // Mrigashira (4) -> Mars (4)
  // Ardra (5) -> Rahu (5)
  // Punarvasu (6) -> Jupiter (6)
  // Pushya (7) -> Saturn (7)
  // Ashlesha (8) -> Mercury (8)
  const lordIndex = nakshatraIndex % 9;
  const firstLord = DASHA_LORDS[lordIndex];

  // Fraction of nakshatra elapsed
  const degPassedInNak = normalizedLong % nakshatraSpan;
  const fractionElapsed = degPassedInNak / nakshatraSpan;
  const fractionRemaining = Math.max(0.001, Math.min(0.999, 1 - fractionElapsed));

  // Balance of initial Mahadasha remaining at birth
  const initialBalanceYears = firstLord.years * fractionRemaining;

  // Classical starting point of the birth Mahadasha before birth
  const daysPerYear = 365.2422;
  const msPerDay = 86400 * 1000;
  const msPerYear = daysPerYear * msPerDay;

  const birthMs = birthDate.getTime();
  const targetMs = targetDate.getTime();

  // Theoretical start time of the initial Mahadasha
  const initialElapsedYears = firstLord.years * fractionElapsed;
  let runningStartMs = birthMs - Math.round(initialElapsedYears * msPerYear);

  const mahadashas: MahadashaPeriod[] = [];

  for (let i = 0; i < 9; i++) {
    const currentLordIndex = (lordIndex + i) % 9;
    const lord = DASHA_LORDS[currentLordIndex];
    const durationYears = lord.years;
    const mahaMs = Math.round(durationYears * msPerYear);
    const runningEndMs = runningStartMs + mahaMs;

    // For the initial cycle, the visible start for the native is birthDate
    const effectiveMahaStartMs = i === 0 ? birthMs : runningStartMs;
    const isMahaCurrent = targetMs >= effectiveMahaStartMs && targetMs < runningEndMs;

    // Build the 9 Antardashas within this Mahadasha
    const antardashas: AntardashaPeriod[] = [];
    let antarStartMs = runningStartMs;

    for (let j = 0; j < 9; j++) {
      const subLordIndex = (currentLordIndex + j) % 9;
      const subLord = DASHA_LORDS[subLordIndex];
      // Formula: (Maha Years * Antar Years) / 120
      const antarYears = (lord.years * subLord.years) / 120;
      const antarMs = Math.round(antarYears * msPerYear);
      const antarEndMs = antarStartMs + antarMs;

      // Antardasha visible effective start
      const effectiveAntarStartMs = (i === 0 && antarStartMs < birthMs) ? birthMs : antarStartMs;
      const isAntarActive = (targetMs >= effectiveAntarStartMs && targetMs < antarEndMs) && (effectiveAntarStartMs < antarEndMs);

      // Build 9 Pratyantardashas within this Antardasha
      const pratyantardashas: PratyantardashaPeriod[] = [];
      let pratStartMs = antarStartMs;

      for (let k = 0; k < 9; k++) {
        const pLordIndex = (subLordIndex + k) % 9;
        const pLord = DASHA_LORDS[pLordIndex];
        // Formula: Antar Duration * (Pratyantar Years / 120)
        const pratMs = Math.round(antarMs * (pLord.years / 120));
        const pratEndMs = pratStartMs + pratMs;

        const effectivePratStartMs = (i === 0 && pratStartMs < birthMs) ? birthMs : pratStartMs;
        const isPratActive = (targetMs >= effectivePratStartMs && targetMs < pratEndMs) && (effectivePratStartMs < pratEndMs);

        const pratDays = Math.max(1, Math.round((pratEndMs - effectivePratStartMs) / msPerDay));

        pratyantardashas.push({
          lord: pLord,
          startDate: new Date(effectivePratStartMs),
          endDate: new Date(pratEndMs),
          durationDays: pratDays,
          isCurrent: isPratActive,
          intensityScore: calculateHarmonyScore(lord.name, subLord.name, pLord.name)
        });

        pratStartMs = pratEndMs;
      }

      const activePrat = pratyantardashas.find(p => p.isCurrent) || pratyantardashas[0];
      const antarTotalDays = Math.max(1, Math.round((antarEndMs - effectiveAntarStartMs) / msPerDay));

      antardashas.push({
        lord: subLord,
        startDate: new Date(effectiveAntarStartMs),
        endDate: new Date(antarEndMs),
        durationMonths: Number((antarYears * 12).toFixed(1)),
        durationDays: antarTotalDays,
        isCurrent: isAntarActive,
        intensityScore: calculateHarmonyScore(lord.name, subLord.name, subLord.name),
        pratyantardashas,
        currentPratyantardasha: activePrat
      });

      antarStartMs = antarEndMs;
    }

    const curAntar = antardashas.find(a => a.isCurrent) || antardashas[0];
    const displayDurationYears = i === 0 ? Number(initialBalanceYears.toFixed(2)) : lord.years;

    mahadashas.push({
      lord,
      startDate: new Date(effectiveMahaStartMs),
      endDate: new Date(runningEndMs),
      durationYears: displayDurationYears,
      isCurrent: isMahaCurrent,
      antardashas,
      currentAntardasha: curAntar,
      intensityScore: calculateHarmonyScore(lord.name, lord.name, lord.name)
    });

    runningStartMs = runningEndMs;
  }

  // Find active periods
  const currentMahadasha = mahadashas.find(m => m.isCurrent) || mahadashas[0];
  const currentAntardasha = currentMahadasha.currentAntardasha || currentMahadasha.antardashas[0];
  const currentPratyantardasha = currentAntardasha.currentPratyantardasha || currentAntardasha.pratyantardashas[0];

  // Calculate Progress Percentages and Days
  const mStart = currentMahadasha.startDate.getTime();
  const mEnd = currentMahadasha.endDate.getTime();
  const mTotalMs = Math.max(1, mEnd - mStart);
  const mElapsedMs = Math.max(0, Math.min(mTotalMs, targetMs - mStart));
  const mPercent = Math.min(100, Math.max(0, Number(((mElapsedMs / mTotalMs) * 100).toFixed(1))));
  const mDaysElapsed = Math.round(mElapsedMs / msPerDay);
  const mDaysRemaining = Math.max(0, Math.round((mEnd - Math.max(mStart, targetMs)) / msPerDay));

  const aStart = currentAntardasha.startDate.getTime();
  const aEnd = currentAntardasha.endDate.getTime();
  const aTotalMs = Math.max(1, aEnd - aStart);
  const aElapsedMs = Math.max(0, Math.min(aTotalMs, targetMs - aStart));
  const aPercent = Math.min(100, Math.max(0, Number(((aElapsedMs / aTotalMs) * 100).toFixed(1))));
  const aDaysElapsed = Math.round(aElapsedMs / msPerDay);
  const aDaysRemaining = Math.max(0, Math.round((aEnd - Math.max(aStart, targetMs)) / msPerDay));

  const pStart = currentPratyantardasha.startDate.getTime();
  const pEnd = currentPratyantardasha.endDate.getTime();
  const pTotalMs = Math.max(1, pEnd - pStart);
  const pElapsedMs = Math.max(0, Math.min(pTotalMs, targetMs - pStart));
  const pPercent = Math.min(100, Math.max(0, Number(((pElapsedMs / pTotalMs) * 100).toFixed(1))));
  const pDaysElapsed = Math.round(pElapsedMs / msPerDay);
  const pDaysRemaining = Math.max(0, Math.round((pEnd - Math.max(pStart, targetMs)) / msPerDay));

  const progress: DashaProgressInfo = {
    mahadashaPercent: mPercent,
    mahadashaDaysElapsed: mDaysElapsed,
    mahadashaDaysRemaining: mDaysRemaining,
    antardashaPercent: aPercent,
    antardashaDaysElapsed: aDaysElapsed,
    antardashaDaysRemaining: aDaysRemaining,
    pratyantardashaPercent: pPercent,
    pratyantardashaDaysElapsed: pDaysElapsed,
    pratyantardashaDaysRemaining: pDaysRemaining
  };

  const triadInterpretation = synthesizeTriad(
    currentMahadasha.lord,
    currentAntardasha.lord,
    currentPratyantardasha.lord
  );

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
    targetDate,
    mahadashas,
    currentMahadasha,
    currentAntardasha,
    currentPratyantardasha,
    progress,
    triadInterpretation,
    chartData
  };
}

/**
 * Calculates a harmony / intensity score (0-100) based on planetary natural friendships
 */
function calculateHarmonyScore(maha: string, antar: string, prat: string): number {
  let score = 50;
  const benefics = ['Jupiter', 'Venus', 'Moon', 'Mercury'];
  if (benefics.includes(maha)) score += 15;
  if (benefics.includes(antar)) score += 12;
  if (benefics.includes(prat)) score += 8;

  // Swadasha (self-period) gives intense focus
  if (maha === antar) score += 5;
  if (antar === prat) score += 5;

  return Math.min(96, Math.max(25, score));
}

/**
 * Generates insightful localized classical Parashara interpretations
 * for the 3-tier triad: Maha Lord + Antar Lord + Pratyantar Lord
 */
function synthesizeTriad(
  maha: DashaLordInfo,
  antar: DashaLordInfo,
  prat: DashaLordInfo
): TriadInterpretation {
  const mName = maha.name;
  const aName = antar.name;
  const pName = prat.name;

  return {
    headline: {
      en: `${mName} Mahadasha • ${aName} Antardasha • ${pName} Pratyantardasha`,
      kn: `${maha.sanskrit.kn} ಮಹಾದಶಾ • ${antar.sanskrit.kn} ಅಂತರ್ದಶಾ • ${prat.sanskrit.kn} ಪ್ರತ್ಯಂತರ್ದಶಾ`,
      hi: `${maha.sanskrit.hi} महादशा • ${antar.sanskrit.hi} अन्तर्दशा • ${prat.sanskrit.hi} प्रत्यन्तर्दशा`
    },
    generalDescription: {
      en: `Under the supreme governance of ${mName}, channeled through ${aName}'s sub-influence, the immediate weekly cosmic wave is steered by ${pName}. This triad directs mental energy toward ${maha.generalSignificance.en.toLowerCase()}`,
      kn: `${maha.sanskrit.kn} ಮಹಾದಶೆಯಲ್ಲಿ ${antar.sanskrit.kn} ಅಂತರ್ದಶೆಯ ಒಳಗೆ ಪ್ರಸ್ತುತ ${prat.sanskrit.kn} ಪ್ರತ್ಯಂತರ್ದಶೆಯು ಸಕ್ರಿಯವಾಗಿದೆ. ಇದು ${maha.generalSignificance.kn}`,
      hi: `${maha.sanskrit.hi} महादशा के अंतर्गत ${antar.sanskrit.hi} भुक्ति में वर्तमान में ${prat.sanskrit.hi} प्रत्यन्तर्दशा संचालित हो रही है। यह ${maha.generalSignificance.hi}`
    },
    careerAndAmbition: {
      en: `High focus on ${mName}'s leadership tone. ${aName} activates strategic decisions, while ${pName} brings quick developments, meetings, or project milestones.`,
      kn: `ಉದ್ಯೋಗ ಮತ್ತು ವೃತ್ತಿಯಲ್ಲಿ ${maha.sanskrit.kn} ಪ್ರಭಾವದಿಂದ ಮಹತ್ತರ ಗುರಿಗಳು ಹಾಗೂ ${prat.sanskrit.kn} ಆಡಳಿತದಿಂದ ತ್ವರಿತ ಕಾರ್ಯಸಿದ್ಧಿ.`,
      hi: `कार्यक्षेत्र में ${maha.sanskrit.hi} का मुख्य प्रभाव। ${antar.sanskrit.hi} द्वारा निर्णय क्षमता एवं ${prat.sanskrit.hi} द्वारा त्वरित प्रगति।`
    },
    healthAndVitality: {
      en: `Pay attention to ${maha.element.en} balance. Stay hydrated, maintain regular sleep schedules, and avoid abrupt emotional or physical strain.`,
      kn: `${maha.element.kn} ಸಮತೋಲನ ಕಾಪಾಡಿಕೊಳ್ಳಿ. ನಿಯಮಿತ ಯೋಗಾಸನ, ಪ್ರಾಣಾಯಾಮ ಹಾಗೂ ದೈಹಿಕ ವಿಶ್ರಾಂತಿ ಅಗತ್ಯ.`,
      hi: `${maha.element.hi} का संतुलन रखें। योग, प्राणायाम एवं सात्त्विक आहार से स्वास्थ्य लाभ प्राप्त होगा।`
    },
    wealthAndProsperity: {
      en: `Financial decisions are influenced by ${aName}. Favorable time for calculated long-term investments and disciplined budget management.`,
      kn: `ಆರ್ಥಿಕ ವಿಚಾರಗಳಲ್ಲಿ ${antar.sanskrit.kn} ಅನುಗ್ರಹದಿಂದ ಸಕಾಲಿಕ ಧನಾಗಮನ ಹಾಗೂ ದೀರ್ಘಾವಧಿ ಹೂಡಿಕೆಗೆ ಪ್ರಶಸ್ತ ಸಮಯ.`,
      hi: `आर्थिक क्षेत्र में ${antar.sanskrit.hi} की अनुकूलता से धनार्जन के साधन बनेंगे एवं बचत की प्रवृत्ति बढ़ेगी।`
    },
    relationshipsAndFamily: {
      en: `Nurture harmony with patience. Transparent communication resolves misunderstandings swiftly during this sub-sub period.`,
      kn: `ಕುಟುಂಬದಲ್ಲಿ ಶಾಂತಿ ಮತ್ತು ಪ್ರೀತಿಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ. ವಾಕ್ಚಾತುರ್ಯ ಮತ್ತು ತಾಳ್ಮೆಯಿಂದ ಬಾಂಧವ್ಯ ಗಟ್ಟಿಯಾಗುತ್ತದೆ.`,
      hi: `पारिवारिक सौहार्द एवं प्रेम बना रहेगा। धैर्य व मधुर वाणी से सम्बंधों में प्रगाढ़ता आएगी।`
    },
    spiritualGrowth: {
      en: `Seek refuge in ${prat.deity.en}. Regular daily chanting of sacred mantras unlocks higher inner serenity and removes hidden obstacles.`,
      kn: `${prat.deity.kn} ಉಪಾಸನೆ ಮಾಡಿ. ಪ್ರತಿದಿನ ${prat.mantra.kn} ಜಪಿಸುವುದರಿಂದ ಮನಃಶಾಂತಿ ಮತ್ತು ದೈವಾನುಗ್ರಹ ಲಭಿಸುತ್ತದೆ.`,
      hi: `${prat.deity.hi} की आराधना करें। प्रतिदिन ${prat.mantra.hi} के जप से आत्मबल एवं मनोवांछित फल की प्राप्ति होगी।`
    },
    prescribedRemedies: {
      en: `Chant: "${prat.mantra.en}". Wear or meditate upon ${prat.gemstone.en}. Auspicious Day: ${prat.auspiciousDay.en}. Charity: ${prat.charityDaana.en}.`,
      kn: `ಜಪ ಮಂತ್ರ: "${prat.mantra.kn}". ರತ್ನ/ಧಾರಣೆ: ${prat.gemstone.kn}. ಪ್ರಶಸ್ತ ದಿನ: ${prat.auspiciousDay.kn}. ದಾನ: ${prat.charityDaana.kn}.`,
      hi: `जप मन्त्र: "${prat.mantra.hi}". रत्न/उपाय: ${prat.gemstone.hi}. शुभ वार: ${prat.auspiciousDay.hi}. दान: ${prat.charityDaana.hi}।`
    }
  };
}
