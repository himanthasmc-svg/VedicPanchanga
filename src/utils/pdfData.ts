export interface SamvatsaraRecord {
  index: number;
  nameKn: string;
  nameHi: string;
  nameEn: string;
  sampleYear: number;
}

export interface NakshatraRashiRecord {
  index: number;
  rashiKn: string;
  rashiHi: string;
  rashiEn: string;
  lordKn: string;
  lordHi: string;
  lordEn: string;
  nakshatraKn: string;
  nakshatraHi: string;
  nakshatraEn: string;
  charanaSyllables: string;
}

export interface BharatiyaSankhyaRecord {
  sanskrit: string;
  kannadaTranslit: string;
  power: string;
  arabicName: string;
  indianNotation: string;
}

export interface PanchaPeethaRecord {
  peethaKn: string;
  peethaEn: string;
  mukha: string;
  ganadheeshwara: string;
  ugamaSthana: string;
  gotraPurusha: string;
  gotra: string;
  sutra: string;
  tattva: string;
  dik: string;
  simhasana: string;
  danda: string;
  beejakshara: string;
  mantra: string;
  varna: string;
}

// 60 Samvatsaras list exactly as in PDF Page 3
export const SAMVATSARA_LIST: SamvatsaraRecord[] = [
  { index: 1, nameKn: "ಪ್ರಭವ", nameHi: "प्रभव", nameEn: "Prabhava", sampleYear: 1987 },
  { index: 2, nameKn: "ವಿಭವ", nameHi: "विभव", nameEn: "Vibhava", sampleYear: 1988 },
  { index: 3, nameKn: "ಶುಕ್ಲ", nameHi: "शुक्ल", nameEn: "Shukla", sampleYear: 1989 },
  { index: 4, nameKn: "ಪ್ರಮೋದೂತ", nameHi: "प्रमोदूत", nameEn: "Pramadoota", sampleYear: 1990 },
  { index: 5, nameKn: "ಪ್ರಜೋತ್ಪತ್ತಿ", nameHi: "प्रजोत्पत्ति", nameEn: "Prajotpatti", sampleYear: 1991 },
  { index: 6, nameKn: "ಅಂಗೀರಸ", nameHi: "अंगीरस", nameEn: "Aangirasa", sampleYear: 1992 },
  { index: 7, nameKn: "ಶ್ರೀಮುಖ", nameHi: "श्रीमुख", nameEn: "Shrimukha", sampleYear: 1993 },
  { index: 8, nameKn: "ಭಾವ", nameHi: "भाव", nameEn: "Bhava", sampleYear: 1994 },
  { index: 9, nameKn: "ಯುವ", nameHi: "युवा", nameEn: "Yuva", sampleYear: 1995 },
  { index: 10, nameKn: "ಧಾತ", nameHi: "धाता", nameEn: "Dhata", sampleYear: 1996 },
  { index: 11, nameKn: "ಈಶ್ವರ", nameHi: "ईश्वर", nameEn: "Ishvara", sampleYear: 1997 },
  { index: 12, nameKn: "ಬಹುಧಾನ್ಯ", nameHi: "बहुधान्य", nameEn: "Bahudhanya", sampleYear: 1998 },
  { index: 13, nameKn: "ಪ್ರಮಾದಿ", nameHi: "प्रमादी", nameEn: "Pramadi", sampleYear: 1999 },
  { index: 14, nameKn: "ವಿಕ್ರಮ", nameHi: "विक्रम", nameEn: "Vikrama", sampleYear: 2000 },
  { index: 15, nameKn: "ವೃಷ", nameHi: "वृष", nameEn: "Vrisha", sampleYear: 2001 },
  { index: 16, nameKn: "ಚಿತ್ರಭಾನು", nameHi: "चित्रभानु", nameEn: "Chitrabhanu", sampleYear: 2002 },
  { index: 17, nameKn: "ಸ್ವಭಾನು", nameHi: "स्वभानु", nameEn: "Svabhanu", sampleYear: 2003 },
  { index: 18, nameKn: "ತಾರಣ", nameHi: "तारण", nameEn: "Tarana", sampleYear: 2004 },
  { index: 19, nameKn: "ಪಾರ್ಥಿವ", nameHi: "पार्थिव", nameEn: "Parthiva", sampleYear: 2005 },
  { index: 20, nameKn: "ವ್ಯಯ", nameHi: "व्यय", nameEn: "Vyaya", sampleYear: 2006 },
  { index: 21, nameKn: "ಸರ್ವಜಿತ್", nameHi: "सर्वजित", nameEn: "Sarvajit", sampleYear: 2007 },
  { index: 22, nameKn: "ಸರ್ವಧಾರಿ", nameHi: "सर्वधारी", nameEn: "Sarvadhari", sampleYear: 2008 },
  { index: 23, nameKn: "ವಿರೋಧಿ", nameHi: "विरोधी", nameEn: "Virodhi", sampleYear: 2009 },
  { index: 24, nameKn: "ವಿಕೃತಿ", nameHi: "विकृति", nameEn: "Vikriti", sampleYear: 2010 },
  { index: 25, nameKn: "ಖರ", nameHi: "खर", nameEn: "Khara", sampleYear: 2011 },
  { index: 26, nameKn: "ನಂದನ", nameHi: "नन्दन", nameEn: "Nandana", sampleYear: 2012 },
  { index: 27, nameKn: "ವಿಜಯ", nameHi: "विजय", nameEn: "Vijaya", sampleYear: 2013 },
  { index: 28, nameKn: "ಜಯ", nameHi: "जय", nameEn: "Jaya", sampleYear: 2014 },
  { index: 29, nameKn: "ಮನ್ಮಥ", nameHi: "मन्मथ", nameEn: "Manmatha", sampleYear: 2015 },
  { index: 30, nameKn: "ದುರ್ಮುಖಿ", nameHi: "दुर्मुखी", nameEn: "Durmukhi", sampleYear: 2016 },
  { index: 31, nameKn: "ಹೇಮಲಂಬ", nameHi: "हेमलम्ब", nameEn: "Hemalambi", sampleYear: 2017 },
  { index: 32, nameKn: "ವಿಳಂಬಿ", nameHi: "विलम्बी", nameEn: "Vilambi", sampleYear: 2018 },
  { index: 33, nameKn: "ವಿಕಾರಿ", nameHi: "विकारी", nameEn: "Vikari", sampleYear: 2019 },
  { index: 34, nameKn: "ಶಾರ್ವರಿ", nameHi: "शार्वरी", nameEn: "Sharvari", sampleYear: 2020 },
  { index: 35, nameKn: "ಪ್ಲವ", nameHi: "प्लव", nameEn: "Plava", sampleYear: 2021 },
  { index: 36, nameKn: "ಶುಭಕೃತ", nameHi: "शुभकृत", nameEn: "Shubhakrit", sampleYear: 2022 },
  { index: 37, nameKn: "ಶೋಭಕೃತ", nameHi: "शोभकृत", nameEn: "Shobhakrit", sampleYear: 2023 },
  { index: 38, nameKn: "ಕ್ರೋಧಿ", nameHi: "क्रोधी", nameEn: "Krodhi", sampleYear: 2024 },
  { index: 39, nameKn: "ವಿಶ್ವಾವಸು", nameHi: "विश्वावसु", nameEn: "Vishvavasu", sampleYear: 2025 },
  { index: 40, nameKn: "ಪರಾಭವ", nameHi: "पराभव", nameEn: "Parabhava", sampleYear: 2026 },
  { index: 41, nameKn: "ಪ್ಲವಂಗ", nameHi: "प्लवंग", nameEn: "Plavanga", sampleYear: 2027 },
  { index: 42, nameKn: "ಕೀಲಕ", nameHi: "कीलक", nameEn: "Keelaka", sampleYear: 2028 },
  { index: 43, nameKn: "ಸೌಮ್ಯ", nameHi: "सौम्य", nameEn: "Saumya", sampleYear: 2029 },
  { index: 44, nameKn: "ಸಾಧಾರಣ", nameHi: "साधारण", nameEn: "Sadharana", sampleYear: 2030 },
  { index: 45, nameKn: "ವಿರೋಧಿಕೃತ", nameHi: "विरोधिकृत", nameEn: "Virodhikrit", sampleYear: 2031 },
  { index: 46, nameKn: "ಪರಿಧಾವಿ", nameHi: "परिधावी", nameEn: "Paridhavi", sampleYear: 2032 },
  { index: 47, nameKn: "ಪ್ರಮಾದ", nameHi: "प्रमाद", nameEn: "Pramadicha", sampleYear: 2033 },
  { index: 48, nameKn: "ಆನಂದ", nameHi: "आनन्द", nameEn: "Ananda", sampleYear: 2034 },
  { index: 49, nameKn: "ರಾಕ್ಷಸ", nameHi: "राक्षस", nameEn: "Rakshasa", sampleYear: 2035 },
  { index: 50, nameKn: "ನಳ", nameHi: "नल", nameEn: "Nala", sampleYear: 2036 },
  { index: 51, nameKn: "ಪಿಂಗಳ", nameHi: "पिंगल", nameEn: "Pingala", sampleYear: 2037 },
  { index: 52, nameKn: "ಕಾಳಯುಕ್ತಿ", nameHi: "कालयुक्ति", nameEn: "Kalayukti", sampleYear: 2038 },
  { index: 53, nameKn: "ಸಿದ್ಧಾರ್ಥಿ", nameHi: "सिद्धार्थी", nameEn: "Siddharthi", sampleYear: 2039 },
  { index: 54, nameKn: "ರೌದ್ರಿ", nameHi: "रौद्री", nameEn: "Raudri", sampleYear: 2040 },
  { index: 55, nameKn: "ದುರ್ಮತಿ", nameHi: "दुर्मति", nameEn: "Durmati", sampleYear: 2041 },
  { index: 56, nameKn: "ದುಂದುಭಿ", nameHi: "दुन्दुभि", nameEn: "Dundubhi", sampleYear: 2042 },
  { index: 57, nameKn: "ರುಧಿರೋದಾಗಾರಿ", nameHi: "रुधिरोद्गारी", nameEn: "Rudhirodgari", sampleYear: 2043 },
  { index: 58, nameKn: "ರಕ್ತಾಕ್ಷಿ", nameHi: "रक्ताक्षी", nameEn: "Raktakshi", sampleYear: 2044 },
  { index: 59, nameKn: "ಕ್ರೋಧನ", nameHi: "क्रोधन", nameEn: "Krodhana", sampleYear: 2045 },
  { index: 60, nameKn: "ಅಕ್ಷಯ", nameHi: "अक्षय", nameEn: "Akshaya", sampleYear: 2046 }
];

// PDF Page 4: Rashis, Lords, Nakshatras & Charana Syllables
export const RASHI_NAKSHATRA_CHART: NakshatraRashiRecord[] = [
  { index: 1, rashiKn: "ಮೇಷ", rashiHi: "मेष", rashiEn: "Mesha (Aries)", lordKn: "ಕುಜ (ಮಂಗಳ)", lordHi: "मंगल", lordEn: "Mars (Kuja)", nakshatraKn: "ಅಶ್ವಿನಿ", nakshatraHi: "अश्विनी", nakshatraEn: "Ashwini", charanaSyllables: "ಚು, ಚೆ, ಚೋ, ಲ (Chu, Che, Cho, La)" },
  { index: 2, rashiKn: "ಮೇಷ", rashiHi: "मेष", rashiEn: "Mesha (Aries)", lordKn: "ಕುಜ (ಮಂಗಳ)", lordHi: "मंगल", lordEn: "Mars (Kuja)", nakshatraKn: "ಭರಣಿ", nakshatraHi: "भरणी", nakshatraEn: "Bharani", charanaSyllables: "ಲಿ, ಲು, ಲೆ, ಲೋ (Li, Lu, Le, Lo)" },
  { index: 3, rashiKn: "ಮೇಷ / ವೃಷಭ", rashiHi: "मेष / वृषभ", rashiEn: "Mesha / Vrishabha", lordKn: "ಶುಕ್ರ / ಕುಜ", lordHi: "शुक्र / मंगल", lordEn: "Mars / Venus", nakshatraKn: "ಕೃತಿಕಾ", nakshatraHi: "कृत्तिका", nakshatraEn: "Krittika", charanaSyllables: "ಅ, ಇ, ಉ, ಎ (A, I, U, E)" },
  { index: 4, rashiKn: "ವೃಷಭ", rashiHi: "वृषभ", rashiEn: "Vrishabha (Taurus)", lordKn: "ಶುಕ್ರ", lordHi: "शुक्र", lordEn: "Venus (Shukra)", nakshatraKn: "ರೋಹಿಣಿ", nakshatraHi: "रोहिणी", nakshatraEn: "Rohini", charanaSyllables: "ಒ, ವ, ವಿ, ವು (O, Va, Vi, Vu)" },
  { index: 5, rashiKn: "ವೃಷಭ / ಮಿಥುನ", rashiHi: "वृषभ / मिथुन", rashiEn: "Vrishabha / Mithuna", lordKn: "ಬುಧ / ಶುಕ್ರ", lordHi: "बुध / शुक्र", lordEn: "Venus / Mercury", nakshatraKn: "ಮೃಗಶಿರ", nakshatraHi: "मृगशिरा", nakshatraEn: "Mrigashira", charanaSyllables: "ವೆ, ವೋ, ಕಾ, ಕಿ (Ve, Vo, Kaa, Ki)" },
  { index: 6, rashiKn: "ಮಿಥುನ", rashiHi: "मिथुन", rashiEn: "Mithuna (Gemini)", lordKn: "ಬುಧ", lordHi: "बुध", lordEn: "Mercury (Budha)", nakshatraKn: "ಆರಿದ್ರ", nakshatraHi: "आर्द्रा", nakshatraEn: "Aridra (Ardra)", charanaSyllables: "ಕು, ಘ, ಙ, ಛ (Ku, Gha, Nga, Chha)" },
  { index: 7, rashiKn: "ಮಿಥುನ / ಕರ್ಕ", rashiHi: "मिथुन / कर्क", rashiEn: "Mithuna / Karka", lordKn: "ಚಂದ್ರ / ಬುಧ", lordHi: "चन्द्र / बुध", lordEn: "Mercury / Moon", nakshatraKn: "ಪುನರ್ವಸು", nakshatraHi: "पुनर्वसु", nakshatraEn: "Punarvasu", charanaSyllables: "ಕೆ, ಕೋ, ಹ, ಹಿ (Ke, Ko, Ha, Hi)" },
  { index: 8, rashiKn: "ಕರ್ಕ", rashiHi: "कर्क", rashiEn: "Karka (Cancer)", lordKn: "ಚಂದ್ರ", lordHi: "चन्द्र", lordEn: "Moon (Chandra)", nakshatraKn: "ಪುಷ್ಯ", nakshatraHi: "पुष्य", nakshatraEn: "Pushya", charanaSyllables: "ಹು, ಹೆ, ಹೋ, ಡ (Hu, He, Ho, Da)" },
  { index: 9, rashiKn: "ಕರ್ಕ", rashiHi: "कर्क", rashiEn: "Karka (Cancer)", lordKn: "ಚಂದ್ರ", lordHi: "चन्द्र", lordEn: "Moon (Chandra)", nakshatraKn: "ಆಶ್ಲೇಷ", nakshatraHi: "आश्लेषा", nakshatraEn: "Ashlesha", charanaSyllables: "ಡಿ, ಡು, ಡೇ, ಡೋ (Di, Du, De, Do)" },
  { index: 10, rashiKn: "ಸಿಂಹ", rashiHi: "सिंह", rashiEn: "Simha (Leo)", lordKn: "ರವಿ (ಸೂರ್ಯ)", lordHi: "सूर्य", lordEn: "Sun (Surya)", nakshatraKn: "ಮಘ", nakshatraHi: "मघा", nakshatraEn: "Magha", charanaSyllables: "ಮ, ಮಿ, ಮು, ಮೆ (Ma, Mi, Mu, Me)" },
  { index: 11, rashiKn: "ಸಿಂಹ", rashiHi: "सिंह", rashiEn: "Simha (Leo)", lordKn: "ರವಿ (ಸೂರ್ಯ)", lordHi: "सूर्य", lordEn: "Sun (Surya)", nakshatraKn: "ಹುಬ್ಬ (ಪೂರ್ವ ಫಲ್ಗುಣಿ)", nakshatraHi: "पूर्वा फाल्गुनी", nakshatraEn: "Purva Phalguni (Hubba)", charanaSyllables: "ಮೋ, ಟ, ಟಿ, ಟು (Mo, Ta, Ti, Tu)" },
  { index: 12, rashiKn: "ಸಿಂಹ / ಕನ್ಯಾ", rashiHi: "सिंह / कन्या", rashiEn: "Simha / Kanya", lordKn: "ಬುಧ / ರವಿ", lordHi: "बुध / सूर्य", lordEn: "Sun / Mercury", nakshatraKn: "ಉತ್ತರ (ಉತ್ತರ ಫಲ್ಗುಣಿ)", nakshatraHi: "उत्तरा फाल्गुनी", nakshatraEn: "Uttara Phalguni", charanaSyllables: "ಟೆ, ಟೋ, ಪ, ಪಿ (Te, To, Pa, Pi)" },
  { index: 13, rashiKn: "ಕನ್ಯಾ", rashiHi: "कन्या", rashiEn: "Kanya (Virgo)", lordKn: "ಬುಧ", lordHi: "बुध", lordEn: "Mercury (Budha)", nakshatraKn: "ಹಸ್ತ", nakshatraHi: "हस्त", nakshatraEn: "Hasta", charanaSyllables: "ಪು, ಷ, ಣ, ಠ (Pu, Sha, Na, Tha)" },
  { index: 14, rashiKn: "ಕನ್ಯಾ / ತುಲಾ", rashiHi: "कन्या / तुला", rashiEn: "Kanya / Tula", lordKn: "ಶುಕ್ರ / ಬುಧ", lordHi: "शुक्र / बुध", lordEn: "Mercury / Venus", nakshatraKn: "ಚಿತ್ತ", nakshatraHi: "चित्रा", nakshatraEn: "Chitra", charanaSyllables: "ಪೆ, ಪೋ, ರ, ರಿ (Pe, Po, Ra, Ri)" },
  { index: 15, rashiKn: "ತುಲಾ", rashiHi: "तुला", rashiEn: "Tula (Libra)", lordKn: "ಶುಕ್ರ", lordHi: "शुक्र", lordEn: "Venus (Shukra)", nakshatraKn: "ಸ್ವಾತಿ", nakshatraHi: "स्वाति", nakshatraEn: "Swati", charanaSyllables: "ರು, ರೆ, ರೋ, ತ (Ru, Re, Ro, Ta)" },
  { index: 16, rashiKn: "ತುಲಾ / ವೃಶ್ಚಿಕ", rashiHi: "तुला / वृश्चिक", rashiEn: "Tula / Vrischika", lordKn: "ಕುಜ / ಶುಕ್ರ", lordHi: "मंगल / शुक्र", lordEn: "Venus / Mars", nakshatraKn: "ವಿಶಾಖ", nakshatraHi: "विशाखा", nakshatraEn: "Vishakha", charanaSyllables: "ತಿ, ತು, ತೆ, ತೋ (Ti, Tu, Te, To)" },
  { index: 17, rashiKn: "ವೃಶ್ಚಿಕ", rashiHi: "वृश्चिक", rashiEn: "Vrischika (Scorpio)", lordKn: "ಕುಜ", lordHi: "मंगल", lordEn: "Mars (Kuja)", nakshatraKn: "ಅನುರಾಧ", nakshatraHi: "अनुराधा", nakshatraEn: "Anuradha", charanaSyllables: "ನ, ನಿ, ನು, ನೆ (Na, Ni, Nu, Ne)" },
  { index: 18, rashiKn: "ವೃಶ್ಚಿಕ", rashiHi: "वृश्चिक", rashiEn: "Vrischika (Scorpio)", lordKn: "ಕುಜ", lordHi: "मंगल", lordEn: "Mars (Kuja)", nakshatraKn: "ಜ್ಯೇಷ್ಠ", nakshatraHi: "ज्येष्ठा", nakshatraEn: "Jyeshtha", charanaSyllables: "ನೋ, ಯ, ಯಿ, ಯು (No, Ya, Yi, Yu)" },
  { index: 19, rashiKn: "ಧನುಸ್ಸು", rashiHi: "धनु", rashiEn: "Dhanus (Sagittarius)", lordKn: "ಗುರು", lordHi: "गुरु", lordEn: "Jupiter (Guru)", nakshatraKn: "ಮೂಲ", nakshatraHi: "मूल", nakshatraEn: "Moola", charanaSyllables: "ಯೆ, ಯೋ, ಭ, ಭಿ (Ye, Yo, Bha, Bhi)" },
  { index: 20, rashiKn: "ಧನುಸ್ಸು", rashiHi: "धनु", rashiEn: "Dhanus (Sagittarius)", lordKn: "ಗುರು", lordHi: "गुरु", lordEn: "Jupiter (Guru)", nakshatraKn: "ಪೂರ್ವಾಷಾಢ", nakshatraHi: "पूर्वाषाढ़ा", nakshatraEn: "Purvashadha", charanaSyllables: "ಭು, ಧ, ಫ, ಢ (Bhu, Dha, Pha, Dha)" },
  { index: 21, rashiKn: "ಧನುಸ್ಸು / ಮಕರ", rashiHi: "धनु / मकर", rashiEn: "Dhanus / Makara", lordKn: "ಶನಿ / ಗುರು", lordHi: "शनि / गुरु", lordEn: "Jupiter / Saturn", nakshatraKn: "ಉತ್ತರಾಷಾಢ", nakshatraHi: "उत्तराषाढ़ा", nakshatraEn: "Uttarashadha", charanaSyllables: "ಭೆ, ಭೋ, ಜ, ಜಿ (Bhe, Bho, Ja, Ji)" },
  { index: 22, rashiKn: "ಮಕರ", rashiHi: "मकर", rashiEn: "Makara (Capricorn)", lordKn: "ಶನಿ", lordHi: "शनि", lordEn: "Saturn (Shani)", nakshatraKn: "ಶ್ರವಣ", nakshatraHi: "श्रवण", nakshatraEn: "Shravana", charanaSyllables: "ಖಿ, ಖೂ, ಖೆ, ಖೋ (Khi, Khoo, Khe, Kho)" },
  { index: 23, rashiKn: "ಮಕರ / ಕುಂಭ", rashiHi: "मकर / कुम्भ", rashiEn: "Makara / Kumbha", lordKn: "ಶನಿ", lordHi: "शनि", lordEn: "Saturn (Shani)", nakshatraKn: "ಧನಿಷ್ಠಾ", nakshatraHi: "धनिष्ठा", nakshatraEn: "Dhanishtha", charanaSyllables: "ಗ, ಗಿ, ಗು, ಗೆ (Ga, Gi, Gu, Ge)" },
  { index: 24, rashiKn: "ಕುಂಭ", rashiHi: "कुम्भ", rashiEn: "Kumbha (Aquarius)", lordKn: "ಶನಿ", lordHi: "शनಿ", lordEn: "Saturn (Shani)", nakshatraKn: "ಶತತಾರ (ಶತಭಿಷ)", nakshatraHi: "शतभिषा", nakshatraEn: "Shatabhisha (Shatatara)", charanaSyllables: "ಗೋ, ಸ, ಸಿ, ಸು (Go, Sa, Si, Su)" },
  { index: 25, rashiKn: "ಕುಂಭ / ಮೀನ", rashiHi: "कुम्भ / मीन", rashiEn: "Kumbha / Meena", lordKn: "ಗುರು / ಶನಿ", lordHi: "गुरु / शनि", lordEn: "Saturn / Jupiter", nakshatraKn: "ಪೂರ್ವಭಾದ್ರ", nakshatraHi: "पूर्वभाद्रपद", nakshatraEn: "Purvabhadra", charanaSyllables: "ಸೆ, ಸೋ, ದ, ದಿ (Se, So, Da, Di)" },
  { index: 26, rashiKn: "ಮೀನ", rashiHi: "मीन", rashiEn: "Meena (Pisces)", lordKn: "ಗುರು", lordHi: "गुरु", lordEn: "Jupiter (Guru)", nakshatraKn: "ಉತ್ತರಭಾದ್ರ", nakshatraHi: "उत्तरभाद्रपद", nakshatraEn: "Uttarabhadra", charanaSyllables: "ದು, ಶ್ಯಂ, ಝ, ಥ (Du, Shyam, Jha, Tha)" },
  { index: 27, rashiKn: "ಮೀನ", rashiHi: "मीन", rashiEn: "Meena (Pisces)", lordKn: "ಗುರು", lordHi: "गुरु", lordEn: "Jupiter (Guru)", nakshatraKn: "ರೇವತಿ", nakshatraHi: "रेवती", nakshatraEn: "Revati", charanaSyllables: "ದೆ, ದೋ, ಚ, ಚಿ (De, Do, Cha, Chi)" }
];

// PDF Page 5: Bharatiya Sankhya Shastra
export const BHARATIYA_SANKHYA: BharatiyaSankhyaRecord[] = [
  { sanskrit: "एक", kannadaTranslit: "ಏಕ", power: "10⁰", arabicName: "One", indianNotation: "೧" },
  { sanskrit: "दश", kannadaTranslit: "ದಶ", power: "10¹", arabicName: "Ten", indianNotation: "೧೦" },
  { sanskrit: "शत", kannadaTranslit: "ಶತ", power: "10²", arabicName: "One hundred", indianNotation: "೧೦೦" },
  { sanskrit: "सहस्र", kannadaTranslit: "ಸಹಸ್ರ", power: "10³", arabicName: "One thousand", indianNotation: "೧,೦೦೦" },
  { sanskrit: "अयुत", kannadaTranslit: "ಅಯುತ", power: "10⁴", arabicName: "Ten thousand", indianNotation: "೧೦,೦೦೦" },
  { sanskrit: "लक्ष", kannadaTranslit: "ಲಕ್ಷ", power: "10⁵", arabicName: "One hundred thousand", indianNotation: "೧,೦೦,೦೦೦" },
  { sanskrit: "कोटि", kannadaTranslit: "ಕೋಟಿ", power: "10⁷", arabicName: "Ten million", indianNotation: "೧,೦೦,೦೦,೦೦೦ (೧೦೦ ಲಕ್ಷ)" },
  { sanskrit: "शङ्कु", kannadaTranslit: "ಶಂಕು", power: "10¹²", arabicName: "One trillion", indianNotation: "೧,೦೦,೦೦೦ ಕೋಟಿ" },
  { sanskrit: "महाशङ्कु", kannadaTranslit: "ಮಹಾಶಂಕು", power: "10¹⁷", arabicName: "One hundred quadrillion", indianNotation: "೧,೦೦,೦೦೦ ಶಂಖ" },
  { sanskrit: "वृन्द", kannadaTranslit: "ವೃಂದ", power: "10²²", arabicName: "Ten sextillion", indianNotation: "೧,೦೦,೦೦೦ ಮಹಾಶಂಖ" },
  { sanskrit: "महावृन्द", kannadaTranslit: "ಮಹಾವೃಂದ", power: "10²⁷", arabicName: "One octillion", indianNotation: "೧,೦೦,೦೦೦ ವೃಂದ" },
  { sanskrit: "पद्म", kannadaTranslit: "ಪದ್ಮ", power: "10³²", arabicName: "One hundred nonillion", indianNotation: "೧,೦೦,೦೦೦ ಮಹಾವೃಂದ" },
  { sanskrit: "महापद्म", kannadaTranslit: "ಮಹಾಪದ್ಮ", power: "10³⁷", arabicName: "Ten undecillion", indianNotation: "೧,೦೦,೦೦೦ ಪದ್ಮ" },
  { sanskrit: "खर्व", kannadaTranslit: "ಖರ್ವ", power: "10⁴²", arabicName: "One tredecillion", indianNotation: "೧,೦೦,೦೦೦ ಮಹಾಪದ್ಮ" },
  { sanskrit: "महाखर्व", kannadaTranslit: "ಮಹಾಖರ್ವ", power: "10⁴⁷", arabicName: "One hundred quattuordecillion", indianNotation: "೧,೦೦,೦೦೦ ಖರ್ವ" },
  { sanskrit: "समुद्र", kannadaTranslit: "ಸಮುದ್ರ", power: "10⁵²", arabicName: "Ten sexdecillion", indianNotation: "೧,೦೦,೦೦೦ ಮಹಾಖರ್ವ" },
  { sanskrit: "ओघ", kannadaTranslit: "ಓಘ", power: "10⁵⁷", arabicName: "One octodecillion", indianNotation: "೧,೦೦,೦೦೦ ಸಮುದ್ರ" },
  { sanskrit: "महौघ", kannadaTranslit: "ಮಹೌಘ", power: "10⁶²", arabicName: "One hundred novemdecillion", indianNotation: "೧,೦೦,೦೦೦ ಓಘ" }
];

// PDF Page 6: Panchapeethagala Sutra Gotragala Pravara
export const PANCHA_PEETHA_TABLE: PanchaPeethaRecord[] = [
  {
    peethaKn: "ಶ್ರೀ ರಂಭಾಪುರಿ (ಬಾಳೆಹೊನ್ನೂರು)",
    peethaEn: "Sri Rambhapuri (Balehonnur)",
    mukha: "ಸದ್ಯೋಜಾತ (Sadyojata)",
    ganadheeshwara: "ರೇಣುಕಾಚಾರ್ಯ (Renukacharya)",
    ugamaSthana: "ಶ್ರೀ ಸೋಮೇಶ್ವರ (Sri Someshwara)",
    gotraPurusha: "ರೇವಣಾರಾಧ್ಯ (Revanaradhya)",
    gotra: "ವೀರ (Veera)",
    sutra: "ಪಡಿವಿಡಿ (Padividi)",
    tattva: "ಪೃಥ್ವಿ (Prithvi - Earth)",
    dik: "ಪೂರ್ವ (East)",
    simhasana: "ವೀರ (Veera)",
    danda: "ಅರಳಿ (Arali - Peepal)",
    beejakshara: "ನ-ಕಾರ (Na-kara)",
    mantra: "ಪ್ರಸಾದ ಪಂಚಾಕ್ಷರೀ (Prasada Panchakshari)",
    varna: "ಹಸಿರು (Green)"
  },
  {
    peethaKn: "ಶ್ರೀ ಉಜ್ಜಯಿನಿ",
    peethaEn: "Sri Ujjayani",
    mukha: "ವಾಮದೇವ (Vamadeva)",
    ganadheeshwara: "ದಾರುಕಾಚಾರ್ಯ (Darukacharya)",
    ugamaSthana: "ಶ್ರೀ ಸಿದ್ಧೇಶ್ವರ (Sri Siddheshwara)",
    gotraPurusha: "ಮರುಳಾರಾಧ್ಯ (Marularadhya)",
    gotra: "ನಂದಿ (Nandi)",
    sutra: "ವೃಷ್ಟಿ (Vrishti)",
    tattva: "ಜಲ (Jala - Water)",
    dik: "ದಕ್ಷಿಣ (South)",
    simhasana: "ಸದ್ಧರ್ಮ (Saddharma)",
    danda: "ಮುತ್ತುಗ (Muttuga - Flame of forest)",
    beejakshara: "ಮ-ಕಾರ (Ma-kara)",
    mantra: "ಮಾಯಾ ಪಂಚಾಕ್ಷರೀ (Maya Panchakshari)",
    varna: "ಕೆಂಪು (Red)"
  },
  {
    peethaKn: "ಶ್ರೀ ಕೇದಾರ",
    peethaEn: "Sri Kedara (Himalayas)",
    mukha: "ಅಘೋರ (Aghora)",
    ganadheeshwara: "ಘಂಟಕರ್ಣ (Ghantakarna)",
    ugamaSthana: "ಶ್ರೀ ರಾಮನಾಥ (Sri Ramanatha)",
    gotraPurusha: "ಏಕೋರಾಮಾರಾಧ್ಯ (Ekoramaradhya)",
    gotra: "ಭೃಂಗಿ (Bhringi)",
    sutra: "ಲಂಬನ (Lambana)",
    tattva: "ಅಗ್ನಿ (Agni - Fire)",
    dik: "ಪಶ್ಚಿಮ (West)",
    simhasana: "ವೈರಾಗ್ಯ (Vairagya)",
    danda: "ಬಿದಿರು (Bidiru - Bamboo)",
    beejakshara: "ಶಿ-ಕಾರ (Shi-kara)",
    mantra: "ಸೂಕ್ಷ್ಮ ಪಂಚಾಕ್ಷರೀ (Sukshma Panchakshari)",
    varna: "ನೀಲ (Blue)"
  },
  {
    peethaKn: "ಶ್ರೀ ಶೈಲ",
    peethaEn: "Sri Shaila (Srisailam)",
    mukha: "ತತ್ಪುರುಷ (Tatpurusha)",
    ganadheeshwara: "ಧೇನುಕರ್ಣ (Dhenukarna)",
    ugamaSthana: "ಶ್ರೀ ಮಲ್ಲಿಕಾರ್ಜುನ (Sri Mallikarjuna)",
    gotraPurusha: "ಪಂಡಿತಾರಾಧ್ಯ (Panditaradhya)",
    gotra: "ವೃಷಭ (Vrishabha)",
    sutra: "ಮುಕ್ತಗುಚ್ಛ (Muktaguchha)",
    tattva: "ವಾಯು (Vayu - Air)",
    dik: "ಉತ್ತರ (North)",
    simhasana: "ಸೂರ್ಯ (Surya)",
    danda: "ಆಲ (Aala - Banyan)",
    beejakshara: "ವಾ-ಕಾರ (Va-kara)",
    mantra: "ಸ್ಥೂಲ ಪಂಚಾಕ್ಷರೀ (Sthoola Panchakshari)",
    varna: "ಶ್ವೇತ (White)"
  },
  {
    peethaKn: "ಶ್ರೀ ಕಾಶಿ",
    peethaEn: "Sri Kashi (Varanasi)",
    mukha: "ಈಶಾನ (Eeshana)",
    ganadheeshwara: "ವಿಶ್ವಕರ್ಣ (Vishwakarna)",
    ugamaSthana: "ಶ್ರೀ ವಿಶ್ವನಾಥ (Sri Vishwanatha)",
    gotraPurusha: "ವಿಶ್ವಾರಾಧ್ಯ (Vishwaradhya)",
    gotra: "ಸ್ಕಂದ (Skanda)",
    sutra: "ಪಂಚವರ್ಣ (Panchavarna)",
    tattva: "ಆಕಾಶ (Akasha - Ether)",
    dik: "ಊರ್ಧ್ವ (Zenith/Upward)",
    simhasana: "ಜ್ಞಾನ (Jnana)",
    danda: "ಬಿಲ್ವ (Bilva - Bael)",
    beejakshara: "ಯ-ಕಾರ (Ya-kara)",
    mantra: "ಮೂಲ ಪಂಚಾಕ್ಷರೀ (Moola Panchakshari)",
    varna: "ಹಳದಿ (Yellow)"
  }
];

// PDF Page 1: Explanation & Procedure (Sankalpa Maduva Uddesha mattu Vidhana)
export const SANKALPA_EXPLANATION = {
  kn: {
    title: "ಸಂಕಲ್ಪ ಮಾಡುವ ಉದ್ದೇಶ ಮತ್ತು ವಿಧಾನ",
    content: [
      "ನಾವು ಯಾವುದೇ ಕಾರ್ಯ ಮಾಡುವಾಗ, ನಮ್ಮ ಕಾರ್ಯಗಳು ನಿರ್ವಿಘ್ನದಿಂದ ಹಾಗೂ ನಮ್ಮ ಮತ್ತು ನಮ್ಮ ಕುಟುಂಬದ ಮನೋಭೀಷ್ಟ ಸಿದ್ಧಿಗಾಗಿ ಮಾಡುತ್ತೇವೆ.",
      "ಯಾವುದೇ ಪೂಜೆ, ಅಭಿಷೇಕ ಹಾಗೂ ಶುಭಕಾರ್ಯಗಳು ಮಾಡುವಾಗ ನಾವು ಎಚ್ಚರದಿಂದ ಸಂಕಲ್ಪಿಸುವುದು ಬಹಳ ಮುಖ್ಯ ಹಾಗೂ ಸಂಕಲ್ಪಿಸಿದಂತೆ ನಾವು ನಡೆದುಕೊಳ್ಳುವುದು ಮುಖ್ಯವಾಗಿರುತ್ತದೆ. ಪೂಜೆ ಮಾಡುವಾಗ ಸಂಕಲ್ಪಿಸಿದರೆ, ಪೂಜೆ ಮುಗಿಯುವ ತನಕ ಪೂಜಾ ಆಸನದಿಂದ ಎದ್ದು ಹೋಗದಿರುವುದು ಒಳಿತು ಎಂದೆನಿಸದು.",
      "ಸಂಕಲ್ಪ ಮಾಡುವಾಗ, ನಾವು ನಮ್ಮ ಇಷ್ಟ ದೇವರನ್ನೂ, ಮನೆಯ ದೇವರನ್ನೂ ಹಾಗೂ ನಾವು ಪೂಜಿಸುವ ದೇವರನ್ನು ನೆನೆದು, ನಾವು ಪೂಜಿಸುವ ಉದ್ದೇಶವನ್ನೂ ಮನನ ಮಾಡಿ, ದೇವರಲ್ಲಿ ನಮ್ಮ ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿಗಾಗಿ ದೇವರ ಕಾರ್ಯವನ್ನು ಮಾಡುತ್ತಿರುವುದಾಗಿ ನೆನೆಯಬೇಕು.",
      "ನಾವು ನಮ್ಮ ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿಯ ಆಶಯವನ್ನು ಸಂಕಲ್ಪ ಮಾಡುವಾಗ ನೆನೆಯುವುದು ಮುಖ್ಯ. ಸಂಕಲ್ಪ ಮಾಡುವಾಗ ನಮ್ಮ ಬಯಕೆಗಳನ್ನು ಮನನ ಮಾಡಿ ಆ ನಮ್ಮ ಬಯಕೆಗಳ ಸಿದ್ಧಿಗಾಗಿಯೇ ಈ ಪೂಜಾ ಕೈಂಕರ್ಯವನ್ನು ಮಾಡುವುದಾಗಿ ದೇವರಲ್ಲಿ ಕೇಳುವುದೇ ಸಂಕಲ್ಪ.",
      "ಈ ಸಮಯದಲ್ಲಿ ನಮಗೆ ಬೇಕಾಗಿರುವುದನ್ನು ಮಾತ್ರ ನೆನೆಯುವುದು ಮುಖ್ಯ. ಆದ್ದರಿಂದ ನಮ್ಮ ಇಷ್ಟಾರ್ಥ ಮನನ ಮಾಡುವಾಗ ನಮ್ಮ ಹೆಸರು, ನಮ್ಮ ಕುಟುಂಬದವರ ಹೆಸರು, ಮಾತಾ-ಪಿತೃವಿನ ಹೆಸರು, ಕುಲ ಗೋತ್ರ ಹೇಳಿ ನಮಗೆಲ್ಲಾ ಸಿದ್ಧಿ ಕೊಡಬೇಕಾಗಿ ಕೇಳಿಕೊಳ್ಳಬೇಕು.",
      "ಸಂಕಲ್ಪಿಸುವಾಗ, ಹಸ್ತದಲ್ಲಿ ಅಕ್ಷತೆ, ಬಿಲ್ವ ಅಥವಾ ಪುಷ್ಪ ಹಿಡಿದು ಸಂಕಲ್ಪ ಮುಗಿದ ನಂತರ ಹಸ್ತದ ಮೇಲೆ ಜಲವನ್ನು ಹಾಕುತ್ತಾ, ಯಾವುದಾದರೂ ಪಾತ್ರೆಯಲ್ಲಿ ಅಕ್ಷತೆ ಮತ್ತು ಪುಷ್ಪವನ್ನು ಬಿಡತಕ್ಕದ್ದು."
    ],
    note: "** ಮೇಲಿರುವ ವಿಷಯವು ನಾನು ತಿಳಿದಂತೆ. ಏನಾದರೂ ಸರಿ ಮಾಡಬೇಕಾದರೆ ತಿಳಿಸಿ."
  },
  hi: {
    title: "संकल्प करने का उद्देश्य और विधान",
    content: [
      "हम जब भी कोई धार्मिक या शुभ कार्य करते हैं, वह निर्विघ्न संपन्न हो तथा हमारे और हमारे परिवार की समस्त मनोकामनाएं पूर्ण हों, इसी भावना से करते हैं।",
      "किसी भी पूजा, अभिषेक अथवा मांगलिक कार्य के समय पूरी एकाग्रता और सावधानी से संकल्प करना अत्यंत आवश्यक है। एक बार संकल्प लेने के बाद पूजा पूर्ण होने तक आसन से बिना कारण नहीं उठना चाहिए।",
      "संकल्प करते समय अपने इष्टदेव, कुलदेवता तथा पूज्य देव का स्मरण कर पूजा के पावन उद्देश्य का मनन करना चाहिए और प्रभु से कार्यसिद्धि की प्रार्थना करनी चाहिए।",
      "संकल्प लेते समय मन में पवित्र इच्छा का स्मरण रखें। अपनी सात्विक कामनाओं की पूर्ति हेतु ही प्रभु की सेवा में यह पूजा समर्पित कर रहे हैं, यही दृढ़ भावना संकल्प है।",
      "इस समय केवल कल्याणकारी विचारों को ही मन में रखें। संकल्प के समय अपना नाम, परिवारजनों के नाम, माता-पिता का नाम, गोत्र व कुल का उच्चारण कर अभीष्ट फल प्राप्ति की प्रार्थना करें।",
      "संकल्प करते समय दाहिने हाथ में अक्षत, पुष्प अथवा बिल्वपत्र और जल लें। संकल्प मन्त्र उच्चारण के उपरांत हाथ में जल छोड़ते हुए किसी शुद्ध पात्र में अक्षत-पुष्प समर्पित करें।"
    ],
    note: "** यह प्रामाणिक वैदिक पद्धति के अनुसार प्रस्तुत किया गया है।"
  },
  en: {
    title: "Purpose and Procedure of Performing Sankalpa",
    content: [
      "Whenever we undertake any sacred ritual, we perform it so that our endeavours proceed smoothly without obstacles and fulfill our cherished desires and family well-being.",
      "During any Puja, Abhisheka, or auspicious ceremony, undertaking Sankalpa with pure awareness is paramount. Once the Sankalpa is solemnized, it is traditionally advised to remain on the sacred Puja asana until completion.",
      "While taking Sankalpa, invoke your Ishta Devata, Kula Devata, and the deity being worshipped, meditating deeply upon the divine intent and dedicating the sacred action to the Almighty.",
      "Sankalpa means dedicating our heartfelt intentions and virtuous wishes to God, resolving firmly that this worship is offered for spiritual fulfillment and righteous fruits.",
      "At this momentous time, keep only noble and peaceful thoughts in mind. Pronounce your name, family members' names, parents' names, and Gotra (lineage) with devotion.",
      "Hold Akshata (sacred rice grains), Bilva leaves or flowers in your right palm. After completing the sacred vow, gently pour water over your palm into an Arghya vessel and release the Akshata and flowers with reverence."
    ],
    note: "** Preserved traditionally as passed down through timeless Vedic custom."
  }
};

// Multilingual Sanskrit Sankalpa Stotra template from PDF Page 2
// Written in the exact Sanskrit phrases across Kannada, Hindi, and English (no meaning translation)
export const SANKALPA_MANTRA_MULTILINGUAL = {
  kn: {
    part1: "ಓಂ ನಮಃ ಪರಮಾತ್ಮನೇ, ಶ್ರೀ ಪುರಾಣಪುರುಷೋತ್ತಮಸ್ಯ ಶ್ರೀ ವಿಷ್ಣೋರಾಜ್ಞಯಾ ಪ್ರವರ್ತಮಾನಸ್ಯ ಆದ್ಯ ಶ್ರೀ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯ ಪರಾರ್ಧೇ ಶ್ರೀ ಶ್ವೇತವರಾಹಕಲ್ಪೇ ವೈವಸ್ವತ ಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮ ಚರಣೇ ಜಂಬೂ ದ್ವೀಪೇ ಭಾರತ ವರ್ಷೇ ಭರತ ಖಂಡೇ ಆರ್ಯಾವರ್ತಾಂತರ್ಗತ ಬ್ರಹ್ಮಾವರ್ತೈಕ ದೇಶೇ ",
    citySuffix: " ಪುಣ್ಯ ಪ್ರದೇಶೇ, ",
    samvatsaraSuffix: " ನಾಮ ಸಂವತ್ಸರೇ, ",
    ayanaSuffix: " ಅಯನೇ, ",
    masaSuffix: " ಮಾಸೇ, ",
    pakshaSuffix: " ಪಕ್ಷೇ, ",
    tithiSuffix: " ತಿಥೌ, ",
    vasaraSuffix: " ವಾಸರಾನ್ವಿತಾಯಾಂ, ",
    nakshatraSuffix: " ನಕ್ಷತ್ರೇ, ",
    rashiSuffix: " ರಾಶಿ ಸ್ಥಿತೇ ಭಾಸ್ಕರೇ ಅಸ್ಮಾಕಂ ಸರ್ವೇಷಾಂ ಸಹ ಕುಟುಂಬಾನಾಂ ಕ್ಷೇಮ ಸ್ಥೈರ್ಯ ವಿಜಯ ವೀರ್ಯಾಯುರಾರೋಗ್ಯೈಶ್ವರ್ಯಾದ್ಯಭಿವೃದ್ಧರ್ಥಂ ಸಮಸ್ತ ಮಂಗಳಾವಾಪ್ತ್ಯರ್ಥಂ ಆದಿತ್ಯಾದಿ ನವಗ್ರಹ ದೋಷ ಪೀಡಾಪರಿಹಾರಾರ್ಥಂ ಧರ್ಮಾರ್ಥ ಕಾಮ ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಪುಣ್ಯ ಪುರುಷಾರ್ಥ ಸಿದ್ಧ್ಯರ್ಥಂ ಚ ಶ್ರೀ ",
    deitySuffix: " ದೇವತಾ ಪ್ರೀತ್ಯರ್ಥಂ ",
    granthaSuffix: " ಪಾಠಾಖ್ಯಂ ಪೂಜನಂ ಕರಿಷ್ಯೇ."
  },
  hi: {
    part1: "ॐ नमः परमात्मने, श्री पुराणपुरुषोत्तमस्य श्री विष्णोराज्ञया प्रवर्तमानस्य आद्य श्री ब्रह्मणो द्वितीय परार्धे श्री श्वेतवराहकल्पे वैवस्वत मन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथम चरणे जम्बू द्वीपे भारत वर्षे भरत खण्डे आर्यावर्तान्तर्गत ब्रह्मावर्तैक देशे ",
    citySuffix: " पुण्य प्रदेशे, ",
    samvatsaraSuffix: " नाम संवत्सरे, ",
    ayanaSuffix: " अयने, ",
    masaSuffix: " मासे, ",
    pakshaSuffix: " पक्षे, ",
    tithiSuffix: " तिथौ, ",
    vasaraSuffix: " वासरान्वितायां, ",
    nakshatraSuffix: " नक्षत्रे, ",
    rashiSuffix: " राशि स्थिते भास्करे अस्माकं सर्वेषां सह कुटुंबानां क्षेम स्थैर्य विजय वीर्यायुरारोग्यैश्वर्याद्यभिवृद्ध्यर्थं समस्त मंगलावाप्त्यर्थं आदित्यादि नवग्रह दोष पीडापरिहारार्थं धर्मार्थ काम मोक्ष चतुर्विध पुण्य पुरुषार्थ सिद्ध्यर्थं च श्री ",
    deitySuffix: " देवता प्रीत्यर्थं ",
    granthaSuffix: " पाठाख्यं पूजनं करिष्ये।"
  },
  en: {
    part1: "Om Namah Paramatmane, Sri Purana-Purushottamasya Sri Vishnor-Aajnaya Pravartamanasya Aadya Sri Brahmano Dvitiya Parardhe Sri Shweta-Varaha-Kalpe Vaivasvata Manvantare Ashtavimshatitame Kaliyuge Prathama Charane Jambu Dweepe Bharata Varshe Bharata Khande Aaryavartantargata Brahmavartaika Deshe ",
    citySuffix: " Punya Pradeshe, ",
    samvatsaraSuffix: " Nama Samvatsare, ",
    ayanaSuffix: " Ayane, ",
    masaSuffix: " Mase, ",
    pakshaSuffix: " Pakshe, ",
    tithiSuffix: " Tithau, ",
    vasaraSuffix: " Vasaranvitayam, ",
    nakshatraSuffix: " Nakshatre, ",
    rashiSuffix: " Rashi Sthite Bhaskare Asmakam Sarvesham Saha Kutumbanam Kshema Sthairya Vijaya Veeryayurarogyaishvaryadyabhivriddhyartham Samasta Mangalavaptyartham Adityadi Navagraha Dosha Peedapariharartham Dharmartha Kama Moksha Chaturvidha Punya Purushartha Siddhyartham Cha Sri ",
    deitySuffix: " Devata Preetyartham ",
    granthaSuffix: " Paathaakhyam Pujanam Karishye."
  }
};

export const SANKALPA_MANTRA_PARTS = {
  header: "ಓಂ ನಮಃ ಪರಮಾತ್ಮನೇ...",
  closing: "ಶೋಭನೇ ಶುಭೇ ಶೋಭನ ಮುಹೂರ್ತೇ...",
  mainStotraTemplate: SANKALPA_MANTRA_MULTILINGUAL.kn.part1,
  purusharthaPortion: SANKALPA_MANTRA_MULTILINGUAL.kn.rashiSuffix
};
