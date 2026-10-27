import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  Info, 
  Layers, 
  Calendar,
  CheckCircle2,
  Hourglass,
  Activity,
  Flame,
  Droplets,
  Wind,
  Mountain
} from 'lucide-react';
import { Language, PanchangaDay, LocalizedString } from '../types';
import { getNakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { calculatePadaTimings } from '../utils/panchanga';
import { MoonPhaseIcon } from './MoonPhaseIcon';

interface CreativeTithiPadaVisualizerProps {
  day: PanchangaDay;
  currentLang: Language;
}

// 15 Tithi Vedic Classifications & Deities
const TITHI_VEDIC_PROPERTIES: Record<number, {
  category: LocalizedString;
  categoryDesc: LocalizedString;
  deity: LocalizedString;
  nature: LocalizedString;
  tagColor: string;
}> = {
  1: {
    category: { en: 'Nanda (Joyful)', kn: 'ನಂದಾ (ಆನಂದದಾಯಿನಿ)', hi: 'नन्दा (आनन्ददायिनी)' },
    categoryDesc: { en: 'Auspicious for inaugurations, festivities, and new beginnings.', kn: 'ಹೊಸ ಕೆಲಸ, ಉತ್ಸವ, ಗೃಹಪ್ರವೇಶ ಮತ್ತು ಶುಭಾರಂಭಕ್ಕೆ ಪ್ರಶಸ್ತ.', hi: 'नवीन कार्य, उत्सव एवं शुभांरभ हेतु प्रशस्त।' },
    deity: { en: 'Agni (Fire God)', kn: 'ಅಗ್ನಿದೇವ', hi: 'अग्निदेव' },
    nature: { en: 'Auspicious / Creative', kn: 'ಶುಭ / ಸೃಜನಶೀಲ', hi: 'शुभ / सृजनात्मक' },
    tagColor: 'from-amber-500 to-orange-600'
  },
  2: {
    category: { en: 'Bhadra (Auspicious)', kn: 'ಭದ್ರಾ (ಮಂಗಳಕಾರಿ)', hi: 'भद्रा (मंगलकारिणी)' },
    categoryDesc: { en: 'Favorable for learning, education, treaties, and marriages.', kn: 'ವಿದ್ಯಾರಂಭ, ವಿವಾಹ, ವಾಹನ ಖರೀದಿ ಮತ್ತು ಒಪ್ಪಂದಗಳಿಗೆ ಉತ್ತಮ.', hi: 'विद्यारम्भ, विवाह एवं स्थायी कार्यों हेतु उत्तम।' },
    deity: { en: 'Brahma / Ashwini Kumaras', kn: 'ಬ್ರಹ್ಮದೇವ / ಅಶ್ವಿನೀ ಕುಮಾರರು', hi: 'ब्रह्मा / अश्विनी कुमार' },
    nature: { en: 'Gentle & Steady', kn: 'ಮೃದು & ಸ್ಥಿರ', hi: 'मृदु एवं स्थिर' },
    tagColor: 'from-blue-500 to-indigo-600'
  },
  3: {
    category: { en: 'Jaya (Victorious)', kn: 'ಜಯಾ (ವಿಜಯದಾಯಿನಿ)', hi: 'जया (विजयदायिनी)' },
    categoryDesc: { en: 'Ideal for courage, legal matters, arts, and triumph over obstacles.', kn: 'ಸಾಹಸ, ನ್ಯಾಯಾಲಯ ವ್ಯವಹಾರ, ಕಲೆ ಮತ್ತು ವಿಜಯ ಸಾಧನೆಗೆ ಶ್ರೇಷ್ಠ.', hi: 'साहस, कला, विजय एवं बाधा निवारण हेतु श्रेष्ठ।' },
    deity: { en: 'Gauri / Shiva', kn: 'ಗೌರೀದೇವಿ / ಈಶ್ವರ', hi: 'गौरी / शिव' },
    nature: { en: 'Dynamic / Victorious', kn: 'ಕ್ರಿಯಾಶೀಲ / ವಿಜಯಪ್ರದ', hi: 'क्रियाशील / विजयप्रद' },
    tagColor: 'from-emerald-500 to-teal-600'
  },
  4: {
    category: { en: 'Rikta (Cleansing / Emptying)', kn: 'ರಿಕ್ತಾ (ತ್ಯಾಗ / ಶುದ್ಧೀಕರಣ)', hi: 'रिक्ता (शोधन)' },
    categoryDesc: { en: 'Powerful for spiritual discipline, Ganesha worship, and removing hurdles.', kn: 'ಗಣೇಶ ಆರಾಧನೆ, ಸಂಕಷ್ಟ ನಿವಾರಣೆ ಹಾಗೂ ಹಠಾತ್ ಅಡೆತಡೆ ನಾಶಕ್ಕೆ ಶ್ರೇಷ್ಠ.', hi: 'गणेश आराधना एवं विघ्न विनाश हेतु फलदायी।' },
    deity: { en: 'Sri Mahaganapati', kn: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ', hi: 'श्री महागणपति' },
    nature: { en: 'Intense / Transformative', kn: 'ತೀಕ್ಷ್ಣ / ಸಂಕಷ್ಟನಾಶಕ', hi: 'तीक्ष्ण / संकटविनाशक' },
    tagColor: 'from-rose-500 to-red-600'
  },
  5: {
    category: { en: 'Poorna (Fullness / Fruition)', kn: 'ಪೂರ್ಣಾ (ಪರಿಪೂರ್ಣ)', hi: 'पूर्णा (सम्पूर्ण)' },
    categoryDesc: { en: 'Supreme for all religious vows, spiritual study, and medicine.', kn: 'ಸಮಸ್ತ ಶುಭ ಕಾರ್ಯ, ಶಾಂತಿ, ನಾಗಪೂಜೆ ಮತ್ತು ದೇವತಾ ಆರಾಧನೆಗೆ ಅತ್ಯುತ್ಕೃಷ್ಟ.', hi: 'समस्त शुभ कार्य, शांति एवं समृद्धि हेतु फलप्रद।' },
    deity: { en: 'Sarpa / Nagadevatas', kn: 'ನಾಗದೇವರು', hi: 'नागदेवता' },
    nature: { en: 'Nourishing & Fertile', kn: 'ಪೌಷ್ಟಿಕ & ಪೂರ್ಣ', hi: 'पौष्टिक एवं परिपूर्ण' },
    tagColor: 'from-purple-500 to-pink-600'
  },
  6: {
    category: { en: 'Nanda (Joyful)', kn: 'ನಂದಾ (ಆನಂದದಾಯಿನಿ)', hi: 'नन्दा (आनन्ददायिनी)' },
    categoryDesc: { en: 'Auspicious for leadership, military, building, and victory.', kn: 'ಕಾರ್ತಿಕೇಯ ಪೂಜೆ, ನಾಯಕತ್ವ, ಮನೆ ಕಟ್ಟುವಿಕೆ ಮತ್ತು ಕೀರ್ತಿಗೆ ಶುಭ.', hi: 'कार्तिकेय पूजन एवं यश-कीर्ति वृद्धि।' },
    deity: { en: 'Kartikeya (Subrahmanya)', kn: 'ಸುಬ್ರಹ್ಮಣ್ಯ / ಕಾರ್ತಿಕೇಯ', hi: 'कार्तिकेय (सुब्रह्मण्य)' },
    nature: { en: 'Valor & Leadership', kn: 'ಶೌರ್ಯ & ನಾಯಕತ್ವ', hi: 'शौर्य एवं नेतृत्व' },
    tagColor: 'from-amber-500 to-orange-600'
  },
  7: {
    category: { en: 'Bhadra (Auspicious)', kn: 'ಭದ್ರಾ (ಮಂಗಳಕಾರಿ)', hi: 'भद्रा (मंगलकारिणी)' },
    categoryDesc: { en: 'Supreme for health, vitality, travel, and solar invocations.', kn: 'ಆರೋಗ್ಯ, ಸೂರ್ಯೋಪಾಸನೆ, ದೀರ್ಘಾಯುಷ್ಯ ಮತ್ತು ಪ್ರಯಾಣಕ್ಕೆ ಶುಭ.', hi: 'आरोग्य, सूर्योपासना एवं यात्रा हेतु श्रेष्ठ।' },
    deity: { en: 'Surya (Sun God)', kn: 'ಸೂರ್ಯನಾರಾಯಣ', hi: 'सूर्यनारायण' },
    nature: { en: 'Radiant & Healing', kn: 'ತೇಜಸ್ವಿ & ಆರೋಗ್ಯಪ್ರದ', hi: 'तेजस्वी एवं आरोग्यप्रद' },
    tagColor: 'from-yellow-500 to-amber-600'
  },
  8: {
    category: { en: 'Jaya (Victorious / Durgashtami)', kn: 'ಜಯಾ (ವಿಜಯ / ದುರ್ಗಾಷ್ಟಮಿ)', hi: 'जया (दुर्गाष्टमी)' },
    categoryDesc: { en: 'Immense spiritual power; dedicated to Mahadurga & Lord Shiva.', kn: 'ಮಹಾದೇವಿ ದುರ್ಗೆ ಮತ್ತು ಶಿವನ ಆರಾಧನೆ, ಧ್ಯಾನ, ಅಷ್ಟಮಿ ವ್ರತಕ್ಕೆ ಪರಮ ಪವಿತ್ರ.', hi: 'भगवती दुर्गा एवं शिव की महापूजा हेतु परम पवित्र।' },
    deity: { en: 'Maha Rudra / Durga', kn: 'ಮಹಾ ರುದ್ರ / ದುರ್ಗಾದೇವಿ', hi: 'महारुद्र / भगवती दुर्गा' },
    nature: { en: 'Supremely Powerful', kn: 'ಮಹಾ ಶಕ್ತಿಪ್ರದ', hi: 'अत्यंत शक्तिप्रद' },
    tagColor: 'from-red-600 to-rose-700'
  },
  9: {
    category: { en: 'Rikta (Mahanavami / Shakti)', kn: 'ರಿಕ್ತಾ (ಮಹಾನವಮಿ / ಶಕ್ತಿ)', hi: 'रिक्ತಾ (महानवमी)' },
    categoryDesc: { en: 'Celebrates triumph of Good over Evil, Ayudha Puja, and Devi worship.', kn: 'ದುಷ್ಟಶಿಕ್ಷಣ, ಶಿಷ್ಟರಕ್ಷಣ, ಆಯುಧ ಪೂಜೆ ಮತ್ತು ಶಕ್ತಿ ಉಪಾಸನೆಗೆ ಪ್ರಸಿದ್ಧ.', hi: 'अधर्म पर धर्म की विजय, आयुध पूजा एवं शक्ति उपासना।' },
    deity: { en: 'Mahishasuramardini Durga', kn: 'ಮಹಿಷಾಸುರಮರ್ದಿನಿ ದುರ್ಗಾ', hi: 'महिषासुरमर्दिनी दुर्गा' },
    nature: { en: 'Victorious Triumph', kn: 'ದುಷ್ಟನಿಗ್ರಹ / ವಿಜಯ', hi: 'विजय एवं शक्ति' },
    tagColor: 'from-crimson-600 to-rose-800'
  },
  10: {
    category: { en: 'Poorna (Vijayadashami)', kn: 'ಪೂರ್ಣಾ (ವಿಜಯದಶಮಿ)', hi: 'पूर्णा (विजयादशमी)' },
    categoryDesc: { en: 'The great day of victory; all endeavors started today bear fruit.', kn: 'ಸಮಸ್ತ ಶುಭಾರಂಭ, ವಿದ್ಯಾಭ್ಯಾಸ, ಶಮಿ ಪೂಜೆ ಮತ್ತು ವಿಜಯಪ್ರಸ್ಥಾನಕ್ಕೆ ಅತ್ಯುನ್ನತ.', hi: 'अक्षय विजय, विद्यारम्भ एवं सर्वकार्य सिद्धि।' },
    deity: { en: 'Yama (Dharmaraja) & Mahashakti', kn: 'ಯಮಧರ್ಮರಾಜ & ಅಪರಾಜಿತಾ ದೇವಿ', hi: 'धर्मराज एवं अपराजिता देवी' },
    nature: { en: 'Eternal Victory (Aparajita)', kn: 'ಅಪರಾಜಿತಾ ಸಿದ್ಧಿ', hi: 'अक्षय विजय' },
    tagColor: 'from-emerald-500 to-teal-700'
  },
  11: {
    category: { en: 'Nanda (Ekadashi Vrata)', kn: 'ನಂದಾ (ಏಕಾದಶೀ ಮಹಾವ್ರತ)', hi: 'नन्दा (एकादशी महाव्रत)' },
    categoryDesc: { en: 'The supreme Vaishnava vrata for fasting, mental clarity, and moksha.', kn: 'ಶ್ರೀ ಹರಿವಾಸರ, ಉಪವಾಸ, ಧ್ಯಾನ, ಪಾಪಕ್ಷಯ ಮತ್ತು ಮುಕ್ತಿದಾಯಕ ಪರಮ ಪವಿತ್ರ ದಿನ.', hi: 'हरिवासर, उपवास, मानसिक शुद्धि एवं मोक्षप्रद।' },
    deity: { en: 'Sri Maha Vishnu', kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು', hi: 'श्री महाविष्णु' },
    nature: { en: 'Sacred & Spiritual', kn: 'ಮೋಕ್ಷದಾಯಕ & ಶುದ್ಧ', hi: 'मोक्षदायक एवं पवित्र' },
    tagColor: 'from-amber-400 to-yellow-600'
  },
  12: {
    category: { en: 'Bhadra (Dvadashi)', kn: 'ಭದ್ರಾ (ದ್ವಾದಶೀ ಪಾರಣೆ)', hi: 'भद्रा (द्वादशी)' },
    categoryDesc: { en: 'Day of charity, sacred feast (Parane), and feeding the needy.', kn: 'ತುಳಸಿ ಪೂಜೆ, ದಾನ-ಧರ್ಮ, ಹರಿಪಾರಣೆ ಮತ್ತು ಲೋಕಕಲ್ಯಾಣಕ್ಕೆ ಶ್ರೇಷ್ಠ.', hi: 'तुलसी पूजन, दान-पुण्य एवं पारण हेतु प्रशस्त।' },
    deity: { en: 'Sri Hari (Narayana)', kn: 'ಶ್ರೀಹರಿ ನಾರಾಯಣ', hi: 'श्रीहरि नारायण' },
    nature: { en: 'Benevolent & Sustaining', kn: 'ಕಲ್ಯಾಣಕಾರಿ & ತೃಪ್ತಿದಾಯಕ', hi: 'कल्याणकारी' },
    tagColor: 'from-blue-500 to-sky-600'
  },
  13: {
    category: { en: 'Jaya (Pradosha Trayodashi)', kn: 'ಜಯಾ (ಪ್ರದೋಷ ತ್ರಯೋದಶಿ)', hi: 'ಜಯಾ (प्रदोष त्रयोदशी)' },
    categoryDesc: { en: 'Auspicious Pradosha Kala for worship of Lord Shiva and friendship.', kn: 'ಸಾಯಂಕಾಲ ಪ್ರದೋಷ ಪೂಜೆ, ಶಿವನ ನಂದಿ ವಾಹನ ದರ್ಶನ ಹಾಗೂ ಸಕಲ ಸಂಕಷ್ಟ ಪರಿಹಾರ.', hi: 'सायं प्रदोष काल में शिव पूजन एवं सर्वकष्ट निवारण।' },
    deity: { en: 'Kamadeva & Lord Shiva', kn: 'ಕಾಮದೇವ & ಪರಮೇಶ್ವರ', hi: 'कामदेव एवं परमेश्वर' },
    nature: { en: 'Harmony & Grace', kn: 'ಸೌಹಾರ್ದ & ಶಿವಾನುಗ್ರಹ', hi: 'सौहार्द एवं शिवकृपा' },
    tagColor: 'from-teal-500 to-emerald-600'
  },
  14: {
    category: { en: 'Rikta (Shivaratri / Deepa)', kn: 'ರಿಕ್ತಾ (ಮಾಸ ಶಿವರಾತ್ರಿ / ಯಮದೀಪ)', hi: 'रिक्ता (मास शिवरात्रि)' },
    categoryDesc: { en: 'Night of intense contemplation, meditation, and Shiva abhisheka.', kn: 'ನಿಶೀಥ ಕಾಲ ರುದ್ರಾಭಿಷೇಕ, ತಪಸ್ಸು ಮತ್ತು ಆಂತರಿಕ ಜಾಗೃತಿಗೆ ಅತ್ಯಂತ ಫಲಪ್ರದ.', hi: 'निशीथ काल रुद्राभिषेक एवं आत्मिक जाग्रति।' },
    deity: { en: 'Lord Shiva / Rudra', kn: 'ಶಿವ / ಕಾಲಭೈರವ', hi: 'शिव / कालभैरव' },
    nature: { en: 'Mystical & Transcendental', kn: 'ತಪಸ್ವಿ & ಅಲೌಕಿಕ', hi: 'तपस्वी एवं अलौकिक' },
    tagColor: 'from-indigo-600 to-purple-800'
  },
  15: {
    category: { en: 'Poorna (Purnima / Amavasya)', kn: 'ಪೂರ್ಣಾ (ಹುಣ್ಣಿಮೆ / ಅಮಾವಾಸ್ಯೆ)', hi: 'पूर्णा (पूर्णिमा / अमावस्या)' },
    categoryDesc: { en: 'Peak lunar illumination / deep ancestral silence and cosmic energy.', kn: 'ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ, ದೇವೀ ದರ್ಶನ (ಹುಣ್ಣಿಮೆ) ಅಥವಾ ಪಿತೃತರ್ಪಣ (ಅಮಾವಾಸ್ಯೆ).', hi: 'सत्यनारायण पूजन, देवी दर्शन अथवा पितृ तर्पण।' },
    deity: { en: 'Chandra / Lalita Devi / Pitrus', kn: 'ಚಂದ್ರದೇವ / ಶ್ರೀ ಲಲಿತಾದೇವಿ / ಪಿತೃಗಳು', hi: 'चन्द्रदेव / ललिता देवी / पितृगण' },
    nature: { en: 'Infinite Completeness', kn: 'ಪರಿಪೂರ್ಣ ಚೈತನ್ಯ', hi: 'अनंत पूर्णता' },
    tagColor: 'from-amber-400 to-rose-600'
  }
};

export const CreativeTithiPadaVisualizer: React.FC<CreativeTithiPadaVisualizerProps> = ({
  day,
  currentLang
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'tithi' | 'pada'>('both');
  const [selectedPadaNumber, setSelectedPadaNumber] = useState<number>(day.pada || 1);

  // Compute all 4 Pada timings and details for the current Nakshatra
  const fourPadas = useMemo(() => {
    const padasList = [];
    const dateObj = new Date(day.gregorianDate + 'T06:00:00');

    for (let p = 1; p <= 4; p++) {
      const aksharaData = getNakshatraPadaAkshara(day.nakshatraIndex, p);
      const timings = calculatePadaTimings(
        dateObj,
        day.nakshatraIndex,
        p,
        aksharaData.aksharaKannada || aksharaData.akshara,
        day.nakshatra
      );

      // Determine element for pada (1: Fire/Dharma, 2: Earth/Artha, 3: Air/Kama, 4: Water/Moksha)
      const elementNames: Record<number, LocalizedString> = {
        1: { en: 'Fire (Dharma)', kn: 'ಅಗ್ನಿ ತತ್ವ (ಧರ್ಮ)', hi: 'अग्नि तत्त्व (धर्म)' },
        2: { en: 'Earth (Artha)', kn: 'ಪೃಥ್ವಿ ತತ್ವ (ಅರ್ಥ)', hi: 'पृथ्वी तत्त्व (अर्थ)' },
        3: { en: 'Air (Kama)', kn: 'ವಾಯು ತತ್ವ (ಕಾಮ)', hi: 'वायु तत्त्व (काम)' },
        4: { en: 'Water (Moksha)', kn: 'ಜಲ ತತ್ವ (ಮೋಕ್ಷ)', hi: 'जल तत्त्व (मोक्ष)' }
      };

      padasList.push({
        padaNumber: p,
        isActive: p === day.pada,
        akshara: aksharaData.akshara,
        aksharaKannada: aksharaData.aksharaKannada,
        aksharaDevanagari: aksharaData.aksharaDevanagari,
        rashiName: aksharaData.rashiName,
        rashiLord: aksharaData.rashiLord,
        element: elementNames[p],
        timings
      });
    }
    return padasList;
  }, [day.gregorianDate, day.nakshatraIndex, day.nakshatra, day.pada]);

  const activePadaData = fourPadas.find(p => p.padaNumber === selectedPadaNumber) || fourPadas[0];

  // Tithi properties
  const tithiVedicInfo = TITHI_VEDIC_PROPERTIES[day.tithiNumber] || TITHI_VEDIC_PROPERTIES[1];

  // Total Tithi Ghatis (1 Ghati = 24 mins)
  const tithiDurationMins = day.tithiTiming ? Math.round(day.tithiTiming.durationHours * 60) : 1440;
  const tithiGhatis = Math.floor(tithiDurationMins / 24);
  const tithiVighatis = Math.round(((tithiDurationMins % 24) / 24) * 60);

  // Pada Duration Ghatis
  // Live dynamic clock updating every second
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nowMs = currentTime.getTime();

  // Tithi Live Elapsed Progress
  const tithiProgress = useMemo(() => {
    if (!day.tithiTiming?.startDateTime || !day.tithiTiming?.endDateTime) {
      return { percent: 50, remainingText: '', elapsedText: '', isCurrent: false };
    }
    const start = new Date(day.tithiTiming.startDateTime).getTime();
    const end = new Date(day.tithiTiming.endDateTime).getTime();
    const total = Math.max(1, end - start);
    
    const isCurrent = nowMs >= start && nowMs <= end;
    const progressMs = nowMs < start ? 0 : nowMs > end ? total : (nowMs - start);
    const percent = Math.min(100, Math.max(0, Math.round((progressMs / total) * 100)));
    
    const remMins = Math.max(0, Math.round((end - nowMs) / 60000));
    const elapMins = Math.max(0, Math.round((nowMs - start) / 60000));
    const remHrs = Math.floor(remMins / 60);
    const remRMins = remMins % 60;
    const elapHrs = Math.floor(elapMins / 60);
    const elapRMins = elapMins % 60;

    return {
      percent,
      isCurrent,
      remainingText: currentLang === 'kn' ? `${remHrs}ಗಂ ${remRMins}ನಿ ಬಾಕಿ` : `${remHrs}h ${remRMins}m remaining`,
      elapsedText: currentLang === 'kn' ? `${elapHrs}ಗಂ ${elapRMins}ನಿ ಸಂದಿದೆ` : `${elapHrs}h ${elapRMins}m elapsed`
    };
  }, [day.tithiTiming, nowMs, currentLang]);

  // Pada Live Elapsed Progress
  const padaProgress = useMemo(() => {
    if (!activePadaData.timings?.startDateTime || !activePadaData.timings?.endDateTime) {
      return { percent: 50, remainingText: '', elapsedText: '', isCurrent: false };
    }
    const start = new Date(activePadaData.timings.startDateTime).getTime();
    const end = new Date(activePadaData.timings.endDateTime).getTime();
    const total = Math.max(1, end - start);
    
    const isCurrent = nowMs >= start && nowMs <= end;
    const progressMs = nowMs < start ? 0 : nowMs > end ? total : (nowMs - start);
    const percent = Math.min(100, Math.max(0, Math.round((progressMs / total) * 100)));
    
    const remMins = Math.max(0, Math.round((end - nowMs) / 60000));
    const elapMins = Math.max(0, Math.round((nowMs - start) / 60000));
    const remHrs = Math.floor(remMins / 60);
    const remRMins = remMins % 60;

    return {
      percent,
      isCurrent,
      remainingText: currentLang === 'kn' ? `${remMins} ನಿಮಿಷ ಬಾಕಿ` : `${remMins}m remaining`,
      elapsedText: currentLang === 'kn' ? `${elapMins} ನಿಮಿಷ ಸಂದಿದೆ` : `${elapMins}m elapsed`
    };
  }, [activePadaData.timings, nowMs, currentLang]);

  // Pada Duration Ghatis
  const padaDurationMins = activePadaData.timings.durationMinutes;
  const padaGhatis = Math.floor(padaDurationMins / 24);

  return (
    <div className="space-y-4">
      {/* Visual Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-100 dark:bg-stone-850 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-lg bg-amber-500 text-stone-950 font-black text-xs">
            ✨
          </span>
          <span className="font-serif font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100">
            {currentLang === 'kn' ? 'ಸಚಿತ್ರ ಖಗೋಳ ದರ್ಶಕ' : currentLang === 'hi' ? 'सचित्र खगोल दर्शन' : 'Creative Celestial Visualizer'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'both'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {currentLang === 'kn' ? 'ಎರಡೂ (Dual Orbit)' : 'Dual View'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tithi')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'tithi'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            🌕 {currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರವೇಶ & ಕಾಲ' : 'Tithi Orbit'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pada')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'pada'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            🌟 {currentLang === 'kn' ? '೪ ನಕ್ಷತ್ರ ಪಾದ ಚಕ್ರ' : '4-Pada Wheel'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATIVE TITHI CELESTIAL TIMELINE & ORBITAL GAUGE */}
      {/* ========================================================================= */}
      {(activeTab === 'both' || activeTab === 'tithi') && day.tithiTiming && (
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/90 dark:border-amber-700/80 bg-gradient-to-b from-amber-500/10 via-stone-50/80 to-white dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-950 shadow-xl p-4 sm:p-6 space-y-5">
          
          {/* Subtle cosmic background starlight overlay */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-400/15 via-orange-500/5 to-transparent blur-2xl pointer-events-none" />

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-stone-800 pb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 flex items-center justify-center text-2xl shadow-lg border-2 border-white/40 shrink-0 font-serif font-black">
                <MoonPhaseIcon
                  paksha={day.paksha}
                  tithiNumber={day.tithiNumber}
                  size={28}
                  currentLang={currentLang}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    {day.pakshaName[currentLang]} • {tithiVedicInfo.category[currentLang]}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                    {currentLang === 'kn' ? `ತಿಥಿ ಸಂಖ್ಯೆ: ${day.tithiNumber}` : `Tithi #${day.tithiNumber}`}
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
                  {day.tithiName[currentLang]} ({day.tithiSanskrit})
                </h3>
              </div>
            </div>

            {/* Total Duration Badge */}
            <div className="flex flex-col items-start sm:items-end bg-white/90 dark:bg-stone-850 p-2.5 rounded-2xl border border-amber-300 dark:border-stone-700 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400">
                {currentLang === 'kn' ? 'ಒಟ್ಟು ಅವಧಿ (Total Stay Duration):' : 'Total Tithi Duration:'}
              </span>
              <div className="text-base sm:text-lg font-mono font-black text-amber-700 dark:text-amber-400">
                ⏱️ {day.tithiTiming.durationHours} {currentLang === 'kn' ? 'ಗಂಟೆಗಳು' : 'Hours'}
              </div>
              <span className="text-[10px] font-mono font-semibold text-stone-600 dark:text-stone-300">
                ({tithiGhatis} {currentLang === 'kn' ? 'ಘಟಿ' : 'Ghatis'} {tithiVighatis} {currentLang === 'kn' ? 'ವಿಘಟಿ' : 'Vighatis'})
              </span>
            </div>
          </div>

          {/* CREATIVE CELESTIAL TIMELINE BAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white shadow-inner relative overflow-hidden border border-stone-800 space-y-4">
            
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>{currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರವೇಶ (ENTRY START)' : 'TITHI ENTRY (STARTS)'}</span>
              </span>
              <span className="text-amber-300 font-bold text-[11px] uppercase tracking-wider hidden sm:inline">
                {currentLang === 'kn' ? 'ಸೂರ್ಯ-ಚಂದ್ರ ಕೋನೀಯ ಭ್ರಮಣೆ (12° Elongation Arc)' : '12° Solar-Lunar Elongation Arc'}
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span>{currentLang === 'kn' ? 'ತಿಥಿ ಮುಕ್ತಾಯ (EXIT END)' : 'TITHI EXIT (ENDS)'}</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              </span>
            </div>

            {/* Glowing Timeline Arc Slider Graphic with Live Elapsed Progress */}
            <div className="relative py-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{tithiProgress.percent}% {currentLang === 'kn' ? 'ಕಾಲಾವಧಿ ಸಂದಿದೆ (Elapsed)' : 'Duration Elapsed'}</span>
                </span>
                <span className="text-stone-300 font-medium">
                  ⏳ {tithiProgress.elapsedText} • {tithiProgress.remainingText}
                </span>
              </div>

              {/* Timeline Track & Active Progress Fill */}
              <div className="h-4 w-full bg-stone-800 rounded-full relative overflow-hidden shadow-inner border border-stone-700/60">
                {/* Background track gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.max(4, tithiProgress.percent)}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 animate-pulse" />
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                </div>
              </div>

              {/* Waypoints along the timeline */}
              <div className="relative flex justify-between mt-2.5 text-[11px] font-mono">
                {/* Start Station */}
                <div className="text-left max-w-[45%]">
                  <span className="text-[10px] text-emerald-400 block font-bold uppercase flex items-center gap-1">
                    <span>🟢</span>
                    <span>{day.tithiTiming.isPrevDayStart 
                      ? (currentLang === 'kn' ? 'ಹಿಂದಿನ ದಿನ ಆರಂಭ' : 'Prev Day Start') 
                      : (currentLang === 'kn' ? 'ಇಂದು ಆರಂಭ' : 'Starts Today')}</span>
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                    {day.tithiTiming.startTimeFormatted[currentLang]}
                  </div>
                </div>

                {/* Midday / Suryodaya Marker in Center */}
                <div className="text-center px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[10.5px] shrink-0 self-center shadow-xs">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}: {day.sunrise}</span>
                  </div>
                  <span className="text-[9.5px] text-stone-300 block">
                    {currentLang === 'kn' ? 'ಉದಯ ತಿಥಿ ಪ್ರಾಧಾನ್ಯ' : 'Udaya Tithi'}
                  </span>
                </div>

                {/* End Station */}
                <div className="text-right max-w-[45%]">
                  <span className="text-[10px] text-rose-400 block font-bold uppercase flex items-center justify-end gap-1">
                    <span>{day.tithiTiming.isNextDayEnd 
                      ? (currentLang === 'kn' ? 'ಮರುದಿನ ಮುಕ್ತಾಯ' : 'Next Day End') 
                      : (currentLang === 'kn' ? 'ಇಂದು ಮುಕ್ತಾಯ' : 'Ends Today')}</span>
                    <span>🔴</span>
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                    {day.tithiTiming.endTimeFormatted[currentLang]}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Tithi Transition Footer */}
            <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-stone-400">
                {currentLang === 'kn' ? 'ಮುಕ್ತಾಯದ ನಂತರ ಆರಂಭವಾಗುವ ತಿಥಿ:' : 'Directly Followed by Next Tithi:'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1.5">
                <span>{day.tithiTiming.nextTithiName[currentLang]}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>

          {/* 3-Card Vedic Devas & Nature Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 1. Ruling Deity */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {currentLang === 'kn' ? 'ಅಧಿದೇವತೆ (Ruling Deity):' : 'Presiding Deity:'}
              </span>
              <div className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>🔱</span>
                <span>{tithiVedicInfo.deity[currentLang]}</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                {currentLang === 'kn' ? 'ಈ ತಿಥಿಯಲ್ಲಿ ಈ ದೇವತೆಯ ಆರಾಧನೆಯು ಸಕಲ ಸಿದ್ಧಿಪ್ರದ.' : 'Worship of this deity grants auspicious spiritual fruits.'}
              </p>
            </div>

            {/* 2. Nature & Category */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರಕೃತಿ (Cosmic Nature):' : 'Cosmic Quality:'}
              </span>
              <div className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>⚡</span>
                <span>{tithiVedicInfo.nature[currentLang]}</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                {tithiVedicInfo.categoryDesc[currentLang]}
              </p>
            </div>

            {/* 3. Astronomical Elongation Span */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {currentLang === 'kn' ? 'ಖಗೋಳ ಕೋನ (Solar-Lunar Span):' : 'Astronomical Elongation:'}
              </span>
              <div className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                {((day.tithiNumber - 1) * 12)}° ➔ {(day.tithiNumber * 12)}°
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                {currentLang === 'kn' 
                  ? 'ಸೂರ್ಯ-ಚಂದ್ರರ ನಡುವೆ ಪ್ರತಿ ೧೨° ಅಂತರವು ಒಂದು ತಿಥಿಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.' 
                  : 'Every 12° angular distance between Sun and Moon defines one Tithi.'}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATIVE 4-PADA NAKSHATRA CONSTELLATION WHEEL & STEPPER */}
      {/* ========================================================================= */}
      {(activeTab === 'both' || activeTab === 'pada') && (
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/80 dark:border-emerald-700/80 bg-gradient-to-b from-emerald-500/10 via-stone-50/80 to-white dark:from-emerald-950/30 dark:via-stone-900 dark:to-stone-950 shadow-xl p-4 sm:p-6 space-y-5">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-2xl shadow-lg border-2 border-white/40 shrink-0 font-serif font-black">
                🌟
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ಪಾದ ಚಕ್ರ' : 'Nakshatra Pada Wheel'}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {currentLang === 'kn' ? `ಪ್ರಸ್ತುತ: ಪಾದ ${day.pada}` : `Current: Pada ${day.pada}`}
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
                  {day.nakshatra[currentLang]} • {currentLang === 'kn' ? `ಪಾದ ${day.pada}` : `Pada ${day.pada}`}
                </h3>
              </div>
            </div>

            {/* Active Pada Stay Duration Badge */}
            <div className="flex flex-col items-start sm:items-end bg-white/90 dark:bg-stone-850 p-2.5 rounded-2xl border border-emerald-300 dark:border-stone-700 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400">
                {currentLang === 'kn' ? `ಪಾದ ${selectedPadaNumber} ಒಟ್ಟು ಅವಧಿ:` : `Pada ${selectedPadaNumber} Stay:`}
              </span>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-700 dark:text-emerald-400">
                ⏱️ {padaDurationMins} {currentLang === 'kn' ? 'ನಿಮಿಷಗಳು' : 'Minutes'}
              </div>
              <span className="text-[10px] font-mono font-semibold text-stone-600 dark:text-stone-300">
                ({Math.floor(padaDurationMins / 60)}h {padaDurationMins % 60}m • {padaGhatis} {currentLang === 'kn' ? 'ಘಟಿ' : 'Ghatis'})
              </span>
            </div>
          </div>

          {/* VISUAL 4-PADA SEGMENTED STEPPER / SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-stone-800 dark:text-stone-200 px-1">
              <span>{currentLang === 'kn' ? '೪ ಪಾದಗಳ ಸಚಿತ್ರ ವಿಭಜನೆ (ಕ್ಲಿಕ್ ಮಾಡಿ ವೀಕ್ಷಿಸಿ):' : 'The 4 Quarters / Padas (Click any pada to inspect):'}</span>
              <span className="text-[10.5px] font-mono font-normal text-stone-500">
                {currentLang === 'kn' ? '೧ ನಕ್ಷತ್ರ = ೧೩°೨೦\' (ಪ್ರತಿ ಪಾದ = ೩°೨೦\')' : '1 Nakshatra = 13°20\' (Each Pada = 3°20\')'}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {fourPadas.map((padaItem) => {
                const isSelected = padaItem.padaNumber === selectedPadaNumber;
                const isCurrentActive = padaItem.isActive;

                return (
                  <button
                    key={padaItem.padaNumber}
                    type="button"
                    onClick={() => setSelectedPadaNumber(padaItem.padaNumber)}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-200 border-2 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-[1.02]'
                        : isCurrentActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100 border-emerald-400 shadow-xs'
                        : 'bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-emerald-300'
                    }`}
                  >
                    {/* Top Row: Pada Number & Active Beacon */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-xs font-serif font-black px-2 py-0.5 rounded-lg ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-stone-100 dark:bg-stone-800 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {currentLang === 'kn' ? `ಪಾದ ${padaItem.padaNumber}` : `Pada ${padaItem.padaNumber}`}
                      </span>

                      {isCurrentActive && (
                        <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isSelected ? 'bg-amber-400 text-stone-950' : 'bg-emerald-500 text-white'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>{currentLang === 'kn' ? 'ಚಾಲ್ತಿ' : 'ACTIVE'}</span>
                        </span>
                      )}
                    </div>

                    {/* Syllable Letter Prominent Display */}
                    <div className="my-1">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl sm:text-3xl font-serif font-black ${
                          isSelected ? 'text-amber-200' : 'text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {currentLang === 'kn' 
                            ? (padaItem.aksharaKannada || padaItem.akshara)
                            : currentLang === 'hi'
                            ? (padaItem.aksharaDevanagari || padaItem.akshara)
                            : padaItem.akshara}
                        </span>
                        <span className={`text-xs font-mono font-bold ${
                          isSelected ? 'text-white/80' : 'text-stone-500'
                        }`}>
                          ({padaItem.akshara})
                        </span>
                      </div>
                      <span className={`text-[10px] block mt-0.5 ${
                        isSelected ? 'text-emerald-100' : 'text-stone-500'
                      }`}>
                        {currentLang === 'kn' ? 'ನಾಮಾಕ್ಷರ / ಚರಣ ಅಕ್ಷರ' : 'Namakshara Syllable'}
                      </span>
                    </div>

                    {/* Timing & Minutes Footer */}
                    <div className={`mt-2 pt-2 border-t text-[11px] font-mono ${
                      isSelected ? 'border-white/20 text-emerald-100' : 'border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}>
                      <div className="font-bold">
                        ⏱️ {padaItem.timings.durationMinutes} {currentLang === 'kn' ? 'ನಿಮಿಷ' : 'mins'}
                      </div>
                      <div className="text-[10px] opacity-90 truncate">
                        {padaItem.timings.startTime} ➔ {padaItem.timings.endTime}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SELECTED PADA DEEP DIVE SHOWCASE CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-emerald-400 dark:border-emerald-700 shadow-md space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  {activePadaData.padaNumber}
                </span>
                <div>
                  <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                    {day.nakshatra[currentLang]} — {currentLang === 'kn' ? `ಪಾದ ${activePadaData.padaNumber}` : `Pada ${activePadaData.padaNumber}`} {currentLang === 'kn' ? 'ವಿವರ' : 'Details'}
                  </h4>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                    {activePadaData.element[currentLang]} • {activePadaData.rashiName[currentLang]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                  ⏱️ {currentLang === 'kn' 
                    ? `ಒಟ್ಟು ಕಾಲಾವಧಿ: ${activePadaData.timings.durationMinutes} ನಿಮಿಷಗಳು` 
                    : `Total Stay: ${activePadaData.timings.durationMinutes} Minutes`}
                </span>
              </div>
            </div>

            {/* Entry vs Exit Timestamps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Window */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🟢</span>
                    <span>{currentLang === 'kn' ? 'ಪಾದ ಆರಂಭ ದಿನಾಂಕ & ಸಮಯ (Entry):' : 'Pada Starts Date & Time:'}</span>
                  </span>
                </div>
                <div className="text-base sm:text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                  {activePadaData.timings.startDateFormatted[currentLang]}
                </div>
                <p className="text-[11px] text-stone-500">
                  {currentLang === 'kn' ? 'ಚಂದ್ರನು ಈ ಪಾದದ ಪರಿಧಿಯನ್ನು ಪ್ರವೇಶಿಸುವ ನಿಖರ ಸಮಯ.' : 'Astronomical instant Moon enters this Pada sector.'}
                </p>
              </div>

              {/* End Window */}
              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-stone-900 border border-rose-300 dark:border-stone-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔴</span>
                    <span>{currentLang === 'kn' ? 'ಪಾದ ಮುಕ್ತಾಯ ದಿನಾಂಕ & ಸಮಯ (Exit):' : 'Pada Ends Date & Time:'}</span>
                  </span>
                </div>
                <div className="text-base sm:text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                  {activePadaData.timings.endDateFormatted[currentLang]}
                </div>
                <p className="text-[11px] text-stone-500">
                  {currentLang === 'kn' ? 'ಈ ಪಾದವು ಮುಗಿದು ಮುಂದಿನ ಪಾದ/ನಕ್ಷತ್ರ ಪ್ರವೇಶವಾಗುವ ಸಮಯ.' : 'Instant when Moon transitions into the next Pada.'}
                </p>
              </div>
            </div>

            {/* Pada Timeline & Visual Progress Bar */}
            <div className="p-3.5 rounded-xl bg-stone-900 text-white space-y-2.5 border border-stone-800 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{padaProgress.percent}% {currentLang === 'kn' ? 'ಪಾದದ ಕಾಲಾವಧಿ ಸಂದಿದೆ (Elapsed)' : 'Pada Duration Elapsed'}</span>
                </span>
                <span className="text-stone-300 font-medium">
                  ⏱️ {padaProgress.elapsedText} • {padaProgress.remainingText}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-3.5 w-full bg-stone-800 rounded-full relative overflow-hidden shadow-inner border border-stone-700/60">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.max(4, padaProgress.percent)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                <span>🟢 {activePadaData.timings.startTime}</span>
                <span className="text-emerald-300 font-bold uppercase">{day.nakshatra[currentLang]} - {currentLang === 'kn' ? `ಪಾದ ${activePadaData.padaNumber}` : `Pada ${activePadaData.padaNumber}`}</span>
                <span>🔴 {activePadaData.timings.endTime}</span>
              </div>
            </div>

            {/* Baby Naming Syllables & Astrological Metrics */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔤</span>
                <div>
                  <span className="text-[10.5px] font-bold uppercase text-stone-500 block">
                    {currentLang === 'kn' ? 'ಜನನ ನಾಮಾಕ್ಷರ (Baby Naming Letter):' : 'Vedic Naming Syllable:'}
                  </span>
                  <span className="font-serif font-black text-base text-emerald-800 dark:text-emerald-300">
                    {activePadaData.aksharaKannada} / {activePadaData.aksharaDevanagari} ({activePadaData.akshara})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    {currentLang === 'kn' ? 'ರಾಶಿ (Rashi):' : 'Zodiac Sign:'}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {activePadaData.rashiName[currentLang]}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    {currentLang === 'kn' ? 'ರಾಶ್ಯಾಧಿಪತಿ (Lord):' : 'Rashi Lord:'}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {activePadaData.rashiLord[currentLang]}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CreativeTithiPadaVisualizer;
