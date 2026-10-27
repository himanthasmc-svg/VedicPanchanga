import { CityLocation, Language, LocalizedString, PanchangaDay } from '../types';
import { calculateNavaratriColorForDay, getNavaratriColorsForYear, NavaratriDayInfo } from './navaratriColors';
import { getExactSandhiKalaWindow } from './panchanga';

export interface KalashaSamagriItem {
  id: string;
  name: LocalizedString;
  category: 'patre' | 'dhanya' | 'pallava' | 'coconut' | 'inner' | 'alankara';
  essential: boolean;
  notes: LocalizedString;
}

export interface NavaratriRitualData {
  dayNumber: number; // 1 to 10
  festivalId: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  tithiName: LocalizedString;
  goddessAvatar: LocalizedString;
  muhurtas: {
    primaryName: LocalizedString;
    primaryWindow: string;
    secondaryName?: LocalizedString;
    secondaryWindow?: string;
    explanation: LocalizedString;
  };
  summary: LocalizedString;
  mantras: Array<{
    title: LocalizedString;
    sanskritText: string;
    kannadaText: string;
    englishTransliteration: string;
    meaning: LocalizedString;
  }>;
  stepByStepVidhi: Array<{
    stepNumber: number;
    title: LocalizedString;
    instruction: LocalizedString;
    significance?: LocalizedString;
  }>;
}

// -------------------------------------------------------------
// 1. KALASHA STHAPANA (GHATASTHAPANA) SAMAGRI LIST
// -------------------------------------------------------------
export const KALASHA_SAMAGRI_LIST: KalashaSamagriItem[] = [
  {
    id: 'kalasha_patre',
    name: {
      en: 'Kalasha Pot (Copper, Silver, or Brass Chompu / Pot - strictly NO iron or steel)',
      kn: 'ಕಲಶ ಪಾತ್ರೆ: ಶುದ್ಧ ತಾಮ್ರ, ಬೆಳ್ಳಿ ಅಥವಾ ಹಿತ್ತಾಳೆಯ ಚೊಂಬು (ಕಬ್ಬಿಣ ಅಥವಾ ಸ್ಟೀಲ್ ಬಳಸಬಾರದು)',
      hi: 'कलश पात्र: तांबा, पीतल अथवा चांदी का लोटा (लोहा अथवा स्टील वर्जित)'
    },
    category: 'patre',
    essential: true,
    notes: {
      en: 'Copper and brass conduct sattvik cosmic energy into the sacred water.',
      kn: 'ತಾಮ್ರ ಮತ್ತು ಹಿತ್ತಾಳೆಯು ದೈವಿಕ ಸಾತ್ವಿಕ ತರಂಗಗಳನ್ನು ಆಕರ್ಷಿಸಿ ತೀರ್ಥದಲ್ಲಿ ಸಂಗ್ರಹಿಸುತ್ತವೆ.',
      hi: 'ताम्र एवं पीतल ब्रह्माण्डीय सात्त्विक ऊर्जा को जल में आकर्षित करते हैं।'
    }
  },
  {
    id: 'dhanya_peetha',
    name: {
      en: 'Sacred Grains: Raw unbroken white rice (Akki) to prepare the altar seat (Dhanya Peetha)',
      kn: 'ಧಾನ್ಯ ಪೀಠ: ಮಣೆಯ ಮೇಲೆ ಹರಡಲು ಹಸನಾದ ಮುರಿಯದ ಬಿಳಿ ಅಕ್ಕಿ',
      hi: 'अक्षत वेदी: आसन निर्माण हेतु अखण्ड सफेद चावल'
    },
    category: 'dhanya',
    essential: true,
    notes: {
      en: 'Represents Mother Earth and nourishment supporting the cosmic vessel.',
      kn: 'ಭೂಮಾತೆ ಮತ್ತು ಅನ್ನಪೂರ್ಣೆಯ ಸಂಕೇತವಾಗಿ ಕಲಶಕ್ಕೆ ಸ್ಥಿರ ಪೀಠವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ.',
      hi: 'अन्नपूर्णा एवं पृथ्वी का प्रतीक जो कलश को स्थिरता प्रदान करता है।'
    }
  },
  {
    id: 'pallava_leaves',
    name: {
      en: 'Leaves: 5 fresh mango leaves or betel leaves (ವೀಳ್ಯದೆಲೆ / ಮಾವಿನೆಲೆ)',
      kn: 'ಪಲ್ಲವ (ಎಲೆಗಳು): ೫ ತಾಜಾ ಮಾವಿನ ಎಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳು',
      hi: 'पल्लव: ५ आम के पत्ते अथवा पान के पत्ते'
    },
    category: 'pallava',
    essential: true,
    notes: {
      en: 'Arranged facing upwards around the neck representing the 5 elements (Pancha Bhootas).',
      kn: 'ಕಲಶದ ಕಂಠದಲ್ಲಿ ಮೇಲ್ಮುಖವಾಗಿ ಜೋಡಿಸುವ ೫ ಎಲೆಗಳು ಪಂಚಭೂತಗಳ ದೈವಿಕ ಸಂಕೇತ.',
      hi: 'ऊपर की ओर मुख किए हुए ५ पत्ते पंचमहाभूतों का प्रतिनिधित्व करते हैं।'
    }
  },
  {
    id: 'sacred_coconut',
    name: {
      en: 'Intact Coconut with tuft/husk (ಜುಟ್ಟು ಇರುವ, ದೋಷವಿಲ್ಲದ ಮಟೆ ತೆಂಗಿನಕಾಯಿ)',
      kn: 'ತೆಂಗಿನಕಾಯಿ: ಜುಟ್ಟು ಇರುವ, ಯಾವುದೇ ಬಿರುಕು/ದೋಷವಿಲ್ಲದ ಮಟೆ ತೆಂಗಿನಕಾಯಿ',
      hi: 'श्रीफल: जटा युक्त, निर्दोष एवं अखण्ड नारियल'
    },
    category: 'coconut',
    essential: true,
    notes: {
      en: 'The tuft pointing upwards symbolizes the Sahasrara Chakra and cosmic antenna.',
      kn: 'ಮೇಲ್ಮುಖವಾದ ಜುಟ್ಟು ಸಹಸ್ರಾರ ಚಕ್ರ ಮತ್ತು ದೈವಿಕ ಶಕ್ತಿ ಆಕರ್ಷಿಸುವ ಗೋಪುರದ ಸಂಕೇತ.',
      hi: 'ऊर्ध्वमुखी शिखा सहस्रार चक्र और चेतना के उत्थान का प्रतीक है।'
    }
  },
  {
    id: 'inner_theertha',
    name: {
      en: 'Sacred Water: Pure clean drinking water mixed with holy Ganga jal',
      kn: 'ಕಲಶದ ತೀರ್ಥ: ಶುದ್ಧ ಗಂಗಾಜಲ ಅಥವಾ ಪವಿತ್ರ ಬಾವಿ/ಶುದ್ಧ ನೀರು',
      hi: 'पवित्र जल: शुद्ध गंगाजल मिश्रित निर्मल जल'
    },
    category: 'inner',
    essential: true,
    notes: {
      en: 'Fills 3/4th of the pot, inviting the sapta nadis (7 sacred rivers).',
      kn: 'ಕಲಶದ ಮುಕ್ಕಾಲು ಭಾಗಕ್ಕೆ ತುಂಬಿ ಸಪ್ತ ನದಿಗಳಾದ ಗಂಗೆ, ಯಮುನೆ, ಗೋದಾವರಿಯನ್ನು ಆವಾಹಿಸಲಾಗುತ್ತದೆ.',
      hi: 'सप्त नदियों का आह्वान कर कलश में तीन-चौथाई जल भरा जाता है।'
    }
  },
  {
    id: 'inner_mangala_dravya',
    name: {
      en: 'Inner Auspicious Items: Turmeric, Kumkuma, Akshate, 1 Coin (Gold/Silver/Metal), Betel nut (ಅಡಿಕೆ), Clove, Cardamom',
      kn: 'ಮಂಗಳ ದ್ರವ್ಯಗಳು: ಅರಿಶಿನ, ಕುಂಕುಮ, ಅಕ್ಷತೆ, ಒಂದು ನಾಣ್ಯ (ಚಿನ್ನ/ಬೆಳ್ಳಿ/ನಾಣ್ಯ), ಅಡಿಕೆ, ಲವಂಗ ಹಾಗೂ ಏಲಕ್ಕಿ',
      hi: 'मङ्गल द्रव्य: हल्दी, कुंकुम, अक्षत, सिक्का, साबुत सुपारी, लौंग एवं इलायची'
    },
    category: 'inner',
    essential: true,
    notes: {
      en: 'Each represents prosperity, aromatic purity, and invocation of Lakshmi-Kubera.',
      kn: 'ಲಕ್ಷ್ಮೀ-ಕುಬೇರ ತತ್ತ್ವ, ಸುವಾಸನೆ ಹಾಗೂ ಮಂಗಳ ಶಕ್ತಿಗಳನ್ನು ತೀರ್ಥದಲ್ಲಿ ಜಾಗೃತಗೊಳಿಸುತ್ತವೆ.',
      hi: 'लक्ष्मी-कुबेर तत्त्व और सुगंधित पवित्रता का संचार करते हैं।'
    }
  },
  {
    id: 'alankara_vastra',
    name: {
      en: 'Adornment: Turmeric paste, Kumkuma, Sandalwood paste, New blouse piece / cloth (ರವಿಕೆ ಕಣ / ವಸ್ತ್ರ), Flower garland',
      kn: 'ಅಲಂಕಾರಕ್ಕೆ: ಅರಿಶಿನ, ಕುಂಕುಮ, ಶ್ರೀಗಂಧ, ಹೊಸ ರವಿಕೆ ಕಣ (ವಸ್ತ್ರ) ಹಾಗೂ ತಾಜಾ ಹೂವಿನ ಹಾರ',
      hi: 'शृंगार सामग्री: चन्दन, हल्दी, रोली, नवीन वस्त्र (चुनरी) एवं ताजे पुष्पों की माला'
    },
    category: 'alankara',
    essential: true,
    notes: {
      en: 'Devi face mask (ಮುಖವಾಡ) can be fastened to the front of coconut if tradition permits.',
      kn: 'ದೇವಿಯ ಮುಖವಾಡವಿದ್ದರೆ ತೆಂಗಿನಕಾಯಿಯ ಮುಂಭಾಗಕ್ಕೆ ಜೋಡಿಸಿ ಸುಂದರವಾಗಿ ಶೃಂಗಾರ ಮಾಡಬಹುದು.',
      hi: 'माता का मुखौटा होने पर नारियल के सम्मुख स्थापित कर शृंगार करें।'
    }
  }
];

// -------------------------------------------------------------
// 1B. KALASHA STHAPANA STEP-BY-STEP METHOD (ಕಲಶ ಸ್ಥಾಪನಾ ಹಂತ-ಹಂತದ ವಿಧಾನ)
// -------------------------------------------------------------
export interface KalashaStepItem {
  stepNumber: number;
  title: LocalizedString;
  instruction: LocalizedString;
  mantra?: {
    sanskritText: string;
    kannadaText: string;
    englishTransliteration: string;
    meaning: LocalizedString;
  };
}

export const KALASHA_STHAPANA_STEPS: KalashaStepItem[] = [
  {
    stepNumber: 1,
    title: {
      en: 'Step 1: Altar & Mandapa Preparation (ಸ್ಥಳ ಮತ್ತು ಮಂಟಪ ಸಿದ್ಧತೆ)',
      kn: '೧. ಸ್ಥಳ ಮತ್ತು ಮಂಟಪ ಸಿದ್ಧತೆ:',
      hi: '१. वेदी एवं मण्डप सज्जा (स्थान निर्माण):'
    },
    instruction: {
      en: 'Place a clean wooden plank (Mane) facing Ishanya (North-East corner) or East direction. Draw a sacred Rangoli or Swastika. Place an auspicious brass, silver or bronze plate on top and spread unbroken raw rice (Akki) evenly to construct the Dhanya Peetha.',
      kn: 'ಈಶಾನ್ಯ (ಈಶಾನ್ಯ ಮೂಲೆ) ಅಥವಾ ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ಮಣೆಯನ್ನು ಇಟ್ಟು, ಅದರ ಮೇಲೆ ರಂಗೋಲಿ ಹಾಕಿ. ಮಣೆಯ ಮೇಲೆ ಒಂದು ತಟ್ಟೆಯನ್ನು ಇಟ್ಟು, ಅದರಲ್ಲಿ ಅಕ್ಷತೆ ಅಥವಾ ಹಸನಾದ ಅಕ್ಕಿಯನ್ನು ಹರಡಿ (ಧಾನ್ಯ ಪೀಠ).',
      hi: 'ईशान कोण (उत्तर-पूर्व) अथवा पूर्व दिशा में लकड़ी की पाटी रखकर उस पर रंगोली बनाएं। उस पर पीतल अथवा चांदी की थाली रखकर अखण्ड श्वेत चावल फैलाकर धान्य पीठ (अक्षत वेदी) तैयार करें।'
    }
  },
  {
    stepNumber: 2,
    title: {
      en: 'Step 2: Preparing the Kalasha Pot (ಕಲಶ ಪಾತ್ರೆಯ ಸಿದ್ಧತೆ)',
      kn: '೨. ಕಲಶ ಪಾತ್ರೆಯ ಸಿದ್ಧತೆ:',
      hi: '२. कलश पात्र की शुद्धि एवं सज्जा:'
    },
    instruction: {
      en: 'Take a copper, brass, or silver Chompu/pot (ತಾಮ್ರ, ಹಿತ್ತಾಳೆ ಅಥವಾ ಬೆಳ್ಳಿಯ ಚೊಂಬು). Mark an auspicious Swastika or Chandana tilaka on the outer surface using pure sandalwood paste, turmeric, and kumkuma. Tie a turmeric-dyed sacred thread (Kankana) around the neck of the pot. Place the pot steadily atop the rice seat.',
      kn: 'ತಾಮ್ರ, ಹಿತ್ತಾಳೆ ಅಥವಾ ಬೆಳ್ಳಿಯ ಚೊಂಬಿನ ಹೊರಭಾಗಕ್ಕೆ ಶ್ರೀಗಂಧ, ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮದಿಂದ ತಿಲಕ ಅಥವಾ ಸ್ವಸ್ತಿಕ ಚಿಹ್ನೆಯನ್ನು ಇಡಿ. ಚೊಂಬಿನ ಕುತ್ತಿಗೆಗೆ ಅರಿಶಿನ ದಾರ (ಕಂಕಣ) ಕಟ್ಟಿ. ಚೊಂಬನ್ನು ಅಕ್ಕಿಯ ಮೇಲೆ ಸ್ಥಿರವಾಗಿ ಇಡಿ.',
      hi: 'ताम्र, पीतल अथवा चांदी के लोटे के बाह्य भाग पर चन्दन, हल्दी एवं रोली से स्वस्तिक अथवा तिलक अंकित करें। कलश के कण्ठ में हल्दी युक्त रक्षासूत्र (कंकण) बांधें और कलश को अक्षत वेदी पर स्थिरतापूर्वक स्थापित करें।'
    }
  },
  {
    stepNumber: 3,
    title: {
      en: 'Step 3: Filling Holy Theertha & Mangala Dravyas (ತೀರ್ಥ ಮತ್ತು ಮಂಗಳ ದ್ರವ್ಯ ತುಂಬುವುದು)',
      kn: '೩. ತೀರ್ಥ ಮತ್ತು ಮಂಗಳ ದ್ರವ್ಯ ತುಂಬುವುದು:',
      hi: '३. तीर्थ जल एवं मंगल द्रव्य स्थापन:'
    },
    instruction: {
      en: 'Fill 3/4th of the pot with pure water mixed with sanctified Ganga jal. Add a pinch of turmeric, kumkuma, unbroken akshata, 1 coin (gold, silver or metal), one whole betel nut (supari), cardamom, and clove into the water.',
      kn: 'ಕಲಶದ ಮುಕ್ಕಾಲು ಭಾಗಕ್ಕೆ ಶುದ್ಧ ಜಲವನ್ನು (ಸ್ವಲ್ಪ ಗಂಗಾಜಲ ಬೆರೆಸಿ) ತುಂಬಿ. ಅದಕ್ಕೆ ಸ್ವಲ್ಪ ಅರಿಶಿನ, ಕುಂಕುಮ, ಅಕ್ಷತೆ, ಒಂದು ನಾಣ್ಯ, ಅಡಿಕೆ ಮತ್ತು ಏಲಕ್ಕಿ-ಲವಂಗವನ್ನು ಹಾಕಿ.',
      hi: 'कलश में तीन-चौथाई भाग तक शुद्ध जल (गंगाजल मिश्रित) भरें। इसमें थोड़ी हल्दी, कुंकुम, अक्षत, एक सिक्का, साबुत सुपारी, इलायची एवं लौंग श्रद्धापूर्वक अर्पित करें।'
    }
  },
  {
    stepNumber: 4,
    title: {
      en: 'Step 4: Arranging Mango Leaves & Coconut (ಪಲ್ಲವ ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಜೋಡಣೆ)',
      kn: '೪. ಪಲ್ಲವ (ಎಲೆ) ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಜೋಡಣೆ:',
      hi: '४. पल्लव (आम्र पत्र) एवं श्रीफल विन्यास:'
    },
    instruction: {
      en: 'Arrange 5 fresh mango leaves or betel leaves around the mouth of the pot pointing upwards in a circular blossom. Anoint an unbroken coconut with turmeric and kumkuma; place it securely amidst the leaves with its tuft pointing upwards. Drape a new unstitched blouse piece (Ravike Kana) or silk cloth, adorn with fresh flower garland. (If you have a Devi face mask, affix it to the front of the coconut).',
      kn: 'ಕಲಶದ ಬಾಯಿಯ ಸುತ್ತಲೂ ೫ ಮಾವಿನ ಎಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳನ್ನು ಮೇಲ್ಮುಖವಾಗಿ, ಸುಂದರವಾಗಿ ವೃತ್ತಾಕಾರದಲ್ಲಿ ಜೋಡಿಸಿ. ತೆಂಗಿನಕಾಯಿಗೆ ಅರಿಶಿನ-ಕುಂಕುಮ ಹಚ್ಚಿ, ಅದರ ಜುಟ್ಟು ಮೇಲ್ಮುಖವಾಗಿರುವಂತೆ ಎಲೆಗಳ ಮಧ್ಯದಲ್ಲಿ ಭದ್ರವಾಗಿ ಇರಿಸಿ. ಕಾಯಿಗೆ ಅಥವಾ ಕಲಶಕ್ಕೆ ಹೊಸ ರವಿಕೆ ಕಣ (ವಸ್ತ್ರ) ಸುತ್ತಿ, ಹೂವಿನ ಹಾರ ಹಾಕಿ ಶೃಂಗಾರ ಮಾಡಿ (ದೇವಿ ಮುಖವಾಡ ಇದ್ದರೆ ಕಾಯಿಯ ಮುಂಭಾಗಕ್ಕೆ ಜೋಡಿಸಬಹುದು).',
      hi: 'कलश के मुख पर ५ आम के पत्ते अथवा पान के पत्ते ऊर्ध्वमुखी कर गोलाकार सजाएं। जटा युक्त निर्दोष नारियल पर हल्दी-कुंकुम लगाकर शिखा ऊपर की ओर रखते हुए पत्तों के मध्य स्थापित करें। नवीन चुनरी/वस्त्र लपेटें एवं पुष्पमाला से शृंगार करें (माता का मुखौटा हो तो सम्मुख लगाएं)।'
    }
  },
  {
    stepNumber: 5,
    title: {
      en: 'Step 5: Invocation of Sacred Rivers & Devi Durga (ವರುಣ ಮತ್ತು ದೇವತಾ ಆವಾಹನೆ)',
      kn: '೫. ವರುಣ ಮತ್ತು ದೇವತಾ ಆವಾಹನೆ:',
      hi: '५. सप्त नदी एवं माँ भगवती का प्राण-प्रतिष्ठा आह्वान:'
    },
    instruction: {
      en: 'Fold hands before the Kalasha and pray to the Seven Sacred Rivers: "Gange Cha Yamune Chaiva Godavari Saraswati | Narmade Sindhu Kaveri Jalesmin Sannidhim Kuru ||". Then meditate upon your chosen Goddess (Durga, Lakshmi, or Gauri) and invoke Her into the Kalasha: "Kalashe Mahalakshmeem / Durgam Aavahayami, Sthapayami, Poojayami."',
      kn: 'ಕಲಶಕ್ಕೆ ಕೈಮುಗಿದು ಸಪ್ತ ನದಿಗಳನ್ನು ಪ್ರಾರ್ಥಿಸಿ: "ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ | ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ||" ನಂತರ ನೀವು ಪೂಜಿಸುವ ದೇವಿಯ (ದುರ್ಗಾ, ಲಕ್ಷ್ಮಿ ಅಥವಾ ಗೌರಿ) ಧ್ಯಾನ ಮಾಡಿ: "ಕಲಶೇ ಮಹಾಲಕ್ಷ್ಮೀಂ/ದುರ್ಗಾಂ ಆವಾಹಯಾಮಿ, ಸ್ಥಾಪಯಾಮಿ, ಪೂಜಯಾಮಿ."',
      hi: 'हाथ जोड़कर सप्त पवित्र नदियों का स्मरण करें: "गङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥" तदुपरान्त इष्ट देवी (दुर्गा, लक्ष्मी अथवा गौरी) का कलश में ध्यान करें: "कलशे महालक्ष्मीं/दुर्गाम् आवाहयामि, स्थापयामि, पूजयामि।कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः। मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः॥"'
    },
    mantra: {
      sanskritText: 'गङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nकलशे महालक्ष्मीं / दुर्गाम् आवाहयामि, स्थापयामि, पूजयामि ॥\nकलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥',
      kannadaText: 'ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ | ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ||\nಕಲಶೇ ಮಹಾಲಕ್ಷ್ಮೀಂ / ದುರ್ಗಾಂ ಆವಾಹಯಾಮಿ, ಸ್ಥಾಪಯಾಮಿ, ಪೂಜಯಾಮಿ ||\nಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ | ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ||',
      englishTransliteration: 'Gange Cha Yamune Chaiva Godavari Saraswati | Narmade Sindhu Kaveri Jalesmin Sannidhim Kuru ||\nKalashe Mahalakshmeem / Durgam Aavahayami, Sthapayami, Poojayami ||\nKalashasya Mukhe Vishnuh Kanthe Rudrah Samashritah | Moole Tatra Sthito Brahma Madhye Matrigana Smritah ||',
      meaning: {
        en: 'May the sacred rivers Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri sanctify this water. In this Kalasha, I invoke, establish, and worship Divine Mother Durga/Mahalakshmi. Lord Vishnu resides at the rim, Lord Shiva at the neck, Lord Brahma at the base, and Mother Divine in the centre.',
        kn: 'ಗಂಗೆ, ಯಮುನೆ, ಗೋದಾವರಿ, ಸರಸ್ವತಿ, ನರ್ಮದೆ, ಸಿಂಧು ಮತ್ತು ಕಾವೇರಿ ನದಿಗಳು ಈ ತೀರ್ಥದಲ್ಲಿ ಸನ್ನಿಹಿತರಾಗಲಿ. ಕಲಶದಲ್ಲಿ ದುರ್ಗಾ/ಮಹಾಲಕ್ಷ್ಮಿಯನ್ನು ಆವಾಹಿಸಿ ಪೂಜಿಸುತ್ತೇನೆ. ಕಲಶದ ಮುಖದಲ್ಲಿ ವಿಷ್ಣು, ಕಂಠದಲ್ಲಿ ರುದ್ರ, ಮೂಲದಲ್ಲಿ ಬ್ರಹ್ಮ ಹಾಗೂ ಮಧ್ಯದಲ್ಲಿ ಮಾತೃಗಣಗಳು ನೆಲೆಸಿರುತ್ತಾರೆ.',
        hi: 'हे गङ्गा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु एवं कावेरी! आप इस जल में पधारें। कलश में माँ दुर्गा/लक्ष्मी का आह्वान कर स्थापित करता हूँ। कलश के मुख में विष्णु, कण्ठ में रुद्र, मूल में ब्रह्मा एवं मध्य में समस्त मातृकाएं विराजमान हैं।'
      }
    }
  }
];

// -------------------------------------------------------------
// 1B. AKHANDA DEEPA STHAPANA & DIRECTION GUIDE (ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ & ದಿಕ್ಕು)
// -------------------------------------------------------------
export interface AkhandaDeepaSamagriItem {
  name: LocalizedString;
  details: LocalizedString;
  icon?: string;
}

export interface AkhandaDeepaStep {
  stepNumber: number;
  title: LocalizedString;
  instruction: LocalizedString;
  directionHighlight?: LocalizedString;
}

export interface AkhandaDeepaRule {
  ruleNumber: number;
  title: LocalizedString;
  instruction: LocalizedString;
  prohibition?: LocalizedString;
}

export interface AkhandaDeepaDetails {
  title: LocalizedString;
  subtitle: LocalizedString;
  intro: LocalizedString;
  directionSignificance: LocalizedString;
  samagriList: AkhandaDeepaSamagriItem[];
  stepByStepVidhi: AkhandaDeepaStep[];
  deepaMantra: {
    sanskritText: string;
    kannadaText: string;
    englishTransliteration: string;
    meaning: LocalizedString;
  };
  goldenRules: AkhandaDeepaRule[];
}

export const AKHANDA_DEEPA_STHAPANA_DETAILS: AkhandaDeepaDetails = {
  title: {
    en: 'Akhanda Deepa Sthapana & Directions (Navaratri Day 1)',
    kn: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ, ದಿಕ್ಕು & ಬೆಳಗಿಸುವ ಸಂಪೂರ್ಣ ವಿಧಿ (ನವರಾತ್ರಿ ದಿನ ೧)',
    hi: 'अखण्ड दीप स्थापना, दिशा एवं प्रज्वलन महाविधान (नवरात्रि प्रथम दिवस)'
  },
  subtitle: {
    en: 'Sacred Eternal Flame Consecration for All 9/10 Days of Navaratri',
    kn: 'ನವರಾತ್ರಿಯ ೯/೧೦ ದಿನಗಳು ನಿರಂತರವಾಗಿ ಬೆಳಗುವ ಮಂಗಳಕರ ಅಖಂಡ ಜ್ಯೋತಿ',
    hi: 'समस्त नवरात्रि पर्यन्त अनवरत प्रज्वलित रहने वाला मङ्गलमय अखण्ड दीप'
  },
  intro: {
    en: 'The Akhanda Deepa (perpetual flame) represents the uninterrupted cosmic effulgence of Mahashakti dispelling darkness, ignorance, and negative forces throughout Navaratri. Lighting it on Day 1 (Prathama) alongside Kalasa Sthapana bestows health, prosperity, and spiritual sovereignty upon the household.',
    kn: 'ನವರಾತ್ರಿಯ ಮೊದಲ ದಿನ ಕಲಶ ಸ್ಥಾಪನೆಯೊಂದಿಗೆ ಅಖಂಡ ದೀಪವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ ೯ ದಿನಗಳ ಕಾಲ ಜ್ಯೋತಿಯನ್ನು ನಿರಂತರವಾಗಿ ಬೆಳಗಿಸುವುದು ಅತ್ಯಂತ ಪುಣ್ಯಪ್ರದ. ಇದು ಜ್ಞಾನ, ಅಂಧಕಾರ ನಿವಾರಣೆ, ಶಾಂತಿ ಮತ್ತು ಅಷ್ಟೈಶ್ವರ್ಯಗಳನ್ನು ತರುತ್ತದೆ.',
    hi: 'नवरात्रि के प्रथम दिन घटस्थापना के साथ अखण्ड दीप प्रज्वलित करना अत्यंत पुण्यदायी व मंगलकारी है। यह अंधकार, दारिद्र्य एवं नकारात्मक ऊर्जा का विनाश कर घर में माँ भगवती की प्रत्यक्ष कृपा स्थापित करता है।'
  },
  directionSignificance: {
    en: 'Primary Directions: The lamp must be placed in the Northeast (Ishanya / ಈಶಾನ್ಯ) or Southeast (Agneya / ಆಗ್ನೇಯ ಮೂಲೆ) corner of the puja room atop a grain pedestal. The flame (wick tip) must strictly face East (Purva) or North (Uttara). Never face the wick towards the South.',
    kn: 'ದಿಕ್ಕಿನ ನಿಯಮ: ದೀಪವನ್ನು ಪೂಜಾ ಕೋಣೆಯ ಈಶಾನ್ಯ (ಈಶಾನ್ಯ ದಿಕ್ಕು / Northeast) ಅಥವಾ ಆಗ್ನೇಯ (ಅಗ್ನಿ ಮೂಲೆ / Southeast) ಭಾಗದಲ್ಲಿ ಮಣೆ ಅಥವಾ ತಟ್ಟೆಯ ಮೇಲೆ ಸ್ಥಾಪಿಸಬೇಕು. ಬತ್ತಿಯ ಜ್ಯೋತಿಯ ಮುಖವು ಕಡ್ಡಾಯವಾಗಿ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಇರಬೇಕು; ಎಂದಿಗೂ ದಕ್ಷಿಣ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿರಬಾರದು.',
    hi: 'दिशा विधान: दीप को पूजा कक्ष के ईशान कोण (उत्तर-पूर्व) अथवा आग्नेय कोण (दक्षिण-पूर्व) में वेदी पर स्थापित करें। ज्योति का मुख सदैव पूर्व अथवा उत्तर दिशा की ओर होना चाहिए; दक्षिण दिशा की ओर कभी न रखें।'
  },
  samagriList: [
    {
      name: {
        en: '1. Lamp Vessel (ದೀಪ)',
        kn: '೧. ದೀಪ ಪಾತ್ರೆ:',
        hi: '१. दीप पात्र:'
      },
      details: {
        en: 'Brass (ಹಿತ್ತಾಳೆ), Copper (ತಾಮ್ರ), or Bronze (ಕಂಚು) lamp. An Akhanda deepa with a glass chimney/cover is supreme to prevent wind disturbance.',
        kn: 'ಹಿತ್ತಾಳೆ, ತಾಮ್ರ ಅಥವಾ ಕಂಚಿನ ದೀಪ (ಗಾಳಿಯಿಂದ ಆರಿಹೋಗದಂತೆ ಗಾಜಿನ ಕವಚ/ಚಿಮಣಿ ಇರುವ ಅಖಂಡ ದೀಪ ಅತ್ಯುತ್ತಮ).',
        hi: 'पीतल, तांबा अथवा कांस्य का दीप (कांच के आवरण/चिमनी युक्त अखण्ड दीप सर्वश्रेष्ठ)।'
      },
      icon: '🪔'
    },
    {
      name: {
        en: '2. Sacred Fuel / Oil (ತೈಲ)',
        kn: '೨. ತೈಲ (ಎಣ್ಣೆ / ತುಪ್ಪ):',
        hi: '२. पवित्र तेल / घृत:'
      },
      details: {
        en: 'Pure cow ghee (ಹಸುವಿನ ತುಪ್ಪ) or sesame/til oil (ಎಳ್ಳೆಣ್ಣೆ). Neem, mustard, or Pancha-deepa mixed oils may also be used.',
        kn: 'ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ ಅಥವಾ ಎಳ್ಳೆಣ್ಣೆ (ಕಹಿಬೇವು, ಸಾಸಿವೆ, ಅಥವಾ ಪಂಚದೀಪ ಮಿಶ್ರ ಎಣ್ಣೆಗಳನ್ನೂ ಬಳಸಬಹುದು).',
        hi: 'शुद्ध गाय का घी अथवा तिल का तेल (सरसों, नीम अथवा पंचदीप तेल भी ग्राह्य)।'
      },
      icon: '🧈'
    },
    {
      name: {
        en: '3. Sacred Wick (ಬತ್ತಿ)',
        kn: '೩. ಪವಿತ್ರ ಬತ್ತಿ:',
        hi: '३. पावन बत्ती:'
      },
      details: {
        en: 'Thick rolled raw cotton wick (ದಪ್ಪವಾದ ಹತ್ತಿಯ ಬತ್ತಿ) or sacred lotus stem fiber wick (ಕಮಲದ ನಾರಿನ ಬತ್ತಿ - Kalama Naara).',
        kn: 'ದಪ್ಪವಾದ ಹತ್ತಿಯ ಬತ್ತಿ ಅಥವಾ ಕಮಲದ ನಾರಿನ ಬತ್ತಿ (ದೀರ್ಘಾವಧಿ ಜ್ಯೋತಿಗಾಗಿ ದಪ್ಪನೆಯ ಬತ್ತಿ ಶ್ರೇಷ್ಠ).',
        hi: 'मोटी सूती रुई की बत्ती अथवा कमलनाल के रेशों की बत्ती।'
      },
      icon: '🧵'
    },
    {
      name: {
        en: '4. Pedestal Base & Puja Dravya (ಆಧಾರ & ಸಾಮಗ್ರಿ)',
        kn: '೪. ಆಧಾರ ಪೀಠ ಮತ್ತು ಪೂಜಾ ಸಾಮಗ್ರಿ:',
        hi: '४. आधार थाली एवं पूजन सामग्री:'
      },
      details: {
        en: 'A copper/brass plate (ತಾಮ್ರ/ಹಿತ್ತಾಳೆಯ ತಟ್ಟೆ), raw rice or wheat grains for grain altar (ಧಾನ್ಯ ಪೀಠ), turmeric, kumkuma, and fresh flowers.',
        kn: 'ಒಂದು ತಾಮ್ರ ಅಥವಾ ಹಿತ್ತಾಳೆಯ ತಟ್ಟೆ, ಸ್ವಲ್ಪ ಅಕ್ಕಿ ಅಥವಾ ಗೋಧಿ (ಧಾನ್ಯ ಪೀಠ), ಅರಿಶಿನ, ಕುಂಕುಮ ಮತ್ತು ತಾಜಾ ಹೂವುಗಳು.',
        hi: 'तांबे अथवा पीतल की थाली, अक्षत अथवा गेहूं (धान्य पीठ), हल्दी, कुंकुम एवं ताजे पुष्प।'
      },
      icon: '🌾'
    }
  ],
  stepByStepVidhi: [
    {
      stepNumber: 1,
      title: {
        en: '1. Place & Pedestal Preparation (ಸ್ಥಳ ಹಾಗೂ ಆಧಾರ ಸಿದ್ಧತೆ)',
        kn: '೧. ಸ್ಥಳ ಹಾಗೂ ಆಧಾರ ಸಿದ್ಧತೆ:',
        hi: '१. स्थान एवं वेदी सज्जता:'
      },
      instruction: {
        en: 'Never place the lamp directly on the bare floor. In the Northeast (Ishanya / ಈಶಾನ್ಯ) or Southeast (Agneya / ಆಗ್ನೇಯ ಮೂಲೆ) of the puja altar, place a wooden chowki or copper/brass plate. Spread raw rice or wheat grains atop it to create the auspicious Dhanya Peetha.',
        kn: 'ದೀಪವನ್ನು ಎಂದಿಗೂ ನೇರವಾಗಿ ನೆಲದ ಮೇಲೆ ಇಡಬಾರದು. ಪೂಜಾ ಕೋಣೆಯ ಈಶಾನ್ಯ (ಈಶಾನ್ಯ ದಿಕ್ಕು) ಅಥವಾ ಆಗ್ನೇಯ (ಅಗ್ನಿ ಮೂಲೆ) ಭಾಗದಲ್ಲಿ ಒಂದು ಮಣೆ ಅಥವಾ ತಟ್ಟೆಯನ್ನು ಇಡಿ. ತಟ್ಟೆಯ ಮೇಲೆ ಸ್ವಲ್ಪ ಅಕ್ಕಿ ಅಥವಾ ಗೋಧಿಯನ್ನು ಹರಡಿ (ಧಾನ್ಯ ಪೀಠ ಸಿದ್ಧತೆ).',
        hi: 'दीप को कभी भी सीधे भूमि पर न रखें। पूजा कक्ष के ईशान कोण (उत्तर-पूर्व) अथवा आग्नेय कोण (दक्षिण-पूर्व) में चौकी या थाली रखें। थाली पर अक्षत या गेहूं फैलाकर पवित्र धान्य पीठ बनाएं।'
      },
      directionHighlight: {
        en: 'Location: Northeast (Ishanya) or Southeast (Agneya)',
        kn: 'ಸ್ಥಾನ: ಈಶಾನ್ಯ ಮೂಲೆ ಅಥವಾ ಆಗ್ನೇಯ ಮೂಲೆ',
        hi: 'स्थान: ईशान कोण अथवा आग्नेय कोण'
      }
    },
    {
      stepNumber: 2,
      title: {
        en: '2. Cleansing & Anointing the Lamp (ದೀಪಕ್ಕೆ ಪೂಜೆ)',
        kn: '೨. ದೀಪಕ್ಕೆ ಪೂಜೆ ಮಾಡಿ:',
        hi: '२. दीप शुद्धि एवं अर्चना:'
      },
      instruction: {
        en: 'Clean the brass, copper, or bronze lamp thoroughly. Apply sacred sandalwood paste (Gandha), turmeric (Arishina), and kumkuma dots to its body. Offer fresh flowers and install the lamp securely in the center of the grain plate.',
        kn: 'ಸ್ವಚ್ಛಗೊಳಿಸಿದ ದೀಪಕ್ಕೆ ಗಂಧ, ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮದ ಬೊಟ್ಟುಗಳನ್ನು ಇಟ್ಟು, ಹೂವನ್ನು ಸಮರ್ಪಿಸಿ ಧಾನ್ಯ ತಟ್ಟೆಯ ಮಧ್ಯಭಾಗದಲ್ಲಿ ಸ್ಥಾಪಿಸಿ.',
        hi: 'स्वच्छ किए दीप पात्र पर चन्दन, हल्दी एवं रोली-कुमकुम का तिलक लगाएं। पुष्प समर्पित कर थाली के मध्य में दीप को स्थिरतापूर्वक स्थापित करें।'
      }
    },
    {
      stepNumber: 3,
      title: {
        en: '3. Oil Filling & Wick Alignment (ಎಣ್ಣೆ ಮತ್ತು ಬತ್ತಿ ಜೋಡಣೆ)',
        kn: '೩. ಎಣ್ಣೆ ಮತ್ತು ಬತ್ತಿ ಜೋಡಣೆ:',
        hi: '३. घृत/तैल पूरण एवं बत्ती विन्यास:'
      },
      instruction: {
        en: 'Fill the lamp fully with pure sesame (til) oil or cow ghee. Soak the thick cotton wick thoroughly in oil before placing it. Align the tip of the wick so it faces East (Purva) or North (Uttara). Never align towards the South.',
        kn: 'ದೀಪಕ್ಕೆ ಶುದ್ಧವಾದ ಎಳ್ಳೆಣ್ಣೆ ಅಥವಾ ಹಸುವಿನ ತುಪ್ಪವನ್ನು ಪೂರ್ಣವಾಗಿ ತುಂಬಿಸಿ. ದಪ್ಪನೆಯ ಬತ್ತಿಯನ್ನು ಚೆನ್ನಾಗಿ ಎಣ್ಣೆಯಲ್ಲಿ ನೆನೆಸಿ, ಬತ್ತಿಯ ತುದಿ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡುವಂತೆ ಜೋಡಿಸಿ.',
        hi: 'दीप में शुद्ध तिल का तेल अथवा गाय का घी पूर्णतः भरें। मोटी बत्ती को अच्छी तरह तेल में भिगोकर रखें। बत्ती की नोक का मुख पूर्व अथवा उत्तर दिशा की ओर रखें।'
      },
      directionHighlight: {
        en: 'Wick Direction: East (Purva) or North (Uttara) ONLY',
        kn: 'ಬತ್ತಿಯ ಮುಖ: ಕಡ್ಡಾಯವಾಗಿ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕು (ದಕ್ಷಿಣ ವರ್ಜ್ಯ)',
        hi: 'बत्ती की दिशा: केवल पूर्व अथवा उत्तर दिशा (दक्षिण वर्जित)'
      }
    },
    {
      stepNumber: 4,
      title: {
        en: '4. Consecrated Lighting (ದೀಪ ಪ್ರಜ್ವಲನೆ)',
        kn: '೪. ದೀಪ ಪ್ರಜ್ವಲನೆ:',
        hi: '४. पवित्र दीप प्रज्वलन:'
      },
      instruction: {
        en: 'Do NOT light the Akhanda Deepa directly with a matchstick. First light a small individual cotton wick or Ekarati lamp with the matchstick, and using that sacred intermediary flame, lovingly kindle the Akhanda Deepa.',
        kn: 'ದೀಪವನ್ನು ನೇರವಾಗಿ ಬೆಂಕಿಕಡ್ಡಿಯಿಂದ ಹಚ್ಚಬೇಡಿ. ಮೊದಲು ಒಂದು ಸಣ್ಣ ಏಕಾರತಿ ಅಥವಾ ಹತ್ತಿಯ ಬತ್ತಿಯನ್ನು ಬೆಳಗಿಸಿ, ಆ ಪವಿತ್ರ ಜ್ಯೋತಿಯಿಂದ ಅಖಂಡ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ.',
        hi: 'अखण्ड दीप को सीधे माचिस की तीली से प्रज्वलित न करें। पहले एक छोटी बत्ती या एकारती जलाएं, फिर उस पावन ज्योति से अखण्ड दीप को प्रज्वलित करें।'
      }
    },
    {
      stepNumber: 5,
      title: {
        en: '5. Glass Chimney Placement (ಗಾಜಿನ ಕವಚ ಅಳವಡಿಕೆ)',
        kn: '೫. ಗಾಜಿನ ಕವಚ ಅಳವಡಿಕೆ:',
        hi: '५. कांच का सुरक्षा आवरण (चिमनी) लगाना:'
      },
      instruction: {
        en: 'Carefully position the glass chimney over the burning lamp to shield the flame from sudden drafts, wind, or insects, ensuring it burns steadily day and night.',
        kn: 'ದೀಪ ಆರದಂತೆ ಮತ್ತು ಗಾಳಿಯಿಂದ ರಕ್ಷಿಸಲು ಗಾಜಿನ ಕವಚವನ್ನು (Glass Chimney) ಮೆಲ್ಲನೆ ಜೋಡಿಸಿ, ಜ್ಯೋತಿಯು ನಿರಂತರವಾಗಿ ಬೆಳಗುವಂತೆ ಮಾಡಿ.',
        hi: 'हवा के झोंकों व कीट-पतंगों से दीप को सुरक्षित रखने हेतु कांच की चिमनी को सावधानीपूर्वक दीप के ऊपर स्थापित करें।'
      }
    }
  ],
  deepaMantra: {
    sanskritText: 'दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ।\nदीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥\nशुभं करोति कल्याणमारोग्यं धनसंपदः ।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
    kannadaText: 'ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ |\nದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||\nಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ |\nಶತ್ರುಬುದ್ಧಿವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||',
    englishTransliteration: 'Deepajyotih Parabrahma Deepajyotir Janardanah |\nDeepo Haratu Me Papam Deepajyotir Namostu Te ||\nShubham Karoti Kalyanam Aarogyam Dhanasampadah |\nShatrubuddhi Vinashaya Deepajyotir Namostu Te ||',
    meaning: {
      en: 'The light of the lamp is Supreme Brahman, the light of the lamp is Lord Janardana. May this divine light remove all my sins; salutations to the Akhanda Deepajyoti. Bestow auspiciousness, prosperity, health, and spiritual victory.',
      kn: 'ದೀಪದ ಜ್ಯೋತಿಯು ಪರಬ್ರಹ್ಮ ಸ್ವರೂಪ ಮತ್ತು ಶ್ರೀಮನ್ನಾರಾಯಣ (ಜನಾರ್ದನ) ಸ್ವರೂಪ. ಈ ದೀಪವು ನನ್ನ ಸರ್ವ ಪಾಪಗಳನ್ನು ನಿವಾರಿಸಲಿ; ಅಖಂಡ ದೀಪಜ್ಯೋತಿಗೆ ನನ್ನ ಸಾಷ್ಟಾಂಗ ಪ್ರಣಾಮಗಳು. ಸಕಲ ಶುಭ, ಆರೋಗ್ಯ, ಐಶ್ವರ್ಯ ವೃದ್ಧಿಸಲಿ.',
      hi: 'दीपक की पावन ज्योति ही परब्रह्म है, वही जनार्दन श्रीहरि का स्वरूप है। हे दीपज्योति! मेरे समस्त पापों का हरण करो, तुम्हें मेरा नमस्कार है। सर्वकल्याण, आरोग्य एवं धनसम्पत्ति प्रदान कर नकारात्मक बुद्धि का शमन करें।'
    }
  },
  goldenRules: [
    {
      ruleNumber: 1,
      title: {
        en: 'Rule 1: Never Let the Flame Extinguish (ದೀಪ ನಂದದಂತೆ ಕಾಪಾಡುವುದು)',
        kn: 'ನಿಯಮ ೧: ದೀಪ ನಂದದಂತೆ ಕಾಪಾಡುವುದು',
        hi: 'नियम १: दीप को कभी बुझने न दें'
      },
      instruction: {
        en: 'Monitor the oil/ghee level periodically every few hours and gently pour fresh oil or melted cow ghee along the rim without agitating the wick.',
        kn: 'ಎಣ್ಣೆ ಕಡಿಮೆಯಾಗದಂತೆ ನಿಯಮಿತವಾಗಿ ಗಮನಿಸಿ ಎಣ್ಣೆ/ತುಪ್ಪವನ್ನು ಸೇರಿಸುತ್ತಿರಬೇಕು. ಎಂದಿಗೂ ದೀಪದಲ್ಲಿ ತೈಲ ಬರಿದಾಗಬಾರದು.',
        hi: 'नियमित अंतराल पर दीप में तेल अथवा पिघला हुआ घी डालते रहें ताकि तैल का स्तर कभी समाप्त न हो।'
      },
      prohibition: {
        en: 'Never pour cold heavy butter directly on top of the flame.',
        kn: 'ಜ್ಯೋತಿಯ ಮೇಲೆ ನೇರವಾಗಿ ಗಟ್ಟಿಯಾದ ತಣ್ಣನೆಯ ತುಪ್ಪವನ್ನು ಸುರಿಯಬಾರದು.',
        hi: 'जलती ज्योति के ऊपर सीधे ठोस घी न डालें।'
      }
    },
    {
      ruleNumber: 2,
      title: {
        en: 'Rule 2: Safely Trimming & Advancing the Wick (ಬತ್ತಿ ಸರಿಪಡಿಸುವ ಸೂಕ್ಷ್ಮ ವಿಧಾನ)',
        kn: 'ನಿಯಮ ೨: ಬತ್ತಿ ಸರಿಪಡಿಸುವ ವಿಧಾನ (ಜ್ಯೋತಿ ನಂದಬಾರದು)',
        hi: 'नियम २: बत्ती संवारने की शास्त्रसम्मत विधि'
      },
      instruction: {
        en: 'When the tip of the wick collects black carbon (kajal), never extinguish the flame to trim it. Light a small auxiliary wick/lamp first, gently push the new wick forward with tongs/needle, and only then clip away the charred tip.',
        kn: 'ಬತ್ತಿಯ ತುದಿ ಕಪ್ಪಾಗಿ ಕಾಡಿಗೆ ಕಟ್ಟಿದಾಗ, ಮತ್ತೊಂದು ಸಣ್ಣ ಬತ್ತಿಯನ್ನು ಬೆಳಗಿಸಿ ಅದರ ಸಹಾಯದಿಂದ ಹೊಸ ಬತ್ತಿಯನ್ನು ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ತಳ್ಳಿ, ನಂತರ ಹಳೆಯದನ್ನು ತೆಗೆಯಬೇಕು (ಜ್ಯೋತಿ ನಂದಬಾರದು).',
        hi: 'जब बत्ती पर कालिख जम जाए, तो दूसरी छोटी बत्ती जलाकर सहायता लें, नई बत्ती को थोड़ा आगे बढ़ाएं और फिर पुरानी जली हुई नोक हटाएं ताकि अखण्ड ज्योति कभी खंडित न हो।'
      },
      prohibition: {
        en: 'The flame must never be extinguished even for a fraction of a second.',
        kn: 'ಒಂದು ಕ್ಷಣವೂ ಮೂಲ ಜ್ಯೋತಿ ನಂದಬಾರದು.',
        hi: 'मुख्य ज्योति एक पल के लिए भी बुझनी नहीं चाहिए।'
      }
    },
    {
      ruleNumber: 3,
      title: {
        en: 'Rule 3: Strict Direction Guidance (ದಿಕ್ಕಿನ ಸುವರ್ಣ ನಿಯಮ)',
        kn: 'ನಿಯಮ ೩: ದಿಕ್ಕಿನ ಕಡ್ಡಾಯ ನಿಯಮ',
        hi: 'नियम ३: दिशा का अनिवार्य नियम'
      },
      instruction: {
        en: 'The flame must strictly face EAST (Purva - for wisdom and longevity) or NORTH (Uttara - for wealth and prosperity). It must NEVER face SOUTH (Dakshina), as south-facing flames invite obstacles.',
        kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಯಾವಾಗಲೂ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಇರಬೇಕು; ಎಂದಿಗೂ ದಕ್ಷಿಣ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿರಬಾರದು (ದಕ್ಷಿಣವು ಯಮ ದಿಕ್ಕಾಗಿರುವುದರಿಂದ ಅಶುಭ).',
        hi: 'ज्योति का मुख सदैव पूर्व (ज्ञान, दीर्घायु) अथवा उत्तर (धन-समृद्धि) की ओर होना चाहिए। दक्षिण दिशा की ओर मुख कभी न रखें।'
      },
      prohibition: {
        en: 'Facing South is strictly prohibited.',
        kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕು ವರ್ಜ್ಯ.',
        hi: 'दक्षिण दिशा वर्जित है।'
      }
    }
  ]
};

// -------------------------------------------------------------
// 1C. UNIVERSAL DAILY NAVADURGA PUJA VIDHI (ದಿನನಿತ್ಯದ ನವದುರ್ಗಾ ಪೂಜಾ ಕ್ರಮ)
// -------------------------------------------------------------
export interface DailyNavadurgaKramaStep {
  step: number;
  title: LocalizedString;
  desc: LocalizedString;
}

export const DAILY_NAVADURGA_PUJA_KRAMA: DailyNavadurgaKramaStep[] = [
  {
    step: 1,
    title: {
      en: '1. Pratah Snana, Shaucha & Altar Cleansing',
      kn: '೧. ಪ್ರಾತಃ ಸ್ನಾನ, ಶೌಚ & ಪೂಜಾ ಮಂಟಪ ಶುದ್ಧಿ:',
      hi: '१. प्रातः स्नान, शुद्धि एवं वेदी प्रक्षालन:'
    },
    desc: {
      en: 'Wake during Brahma Muhurta or before sunrise. Bathe with theertha contemplation, wear clean washed traditional puja attire. Clean the puja room, wipe the brass lamps, and light an Akhanda Deepa or pure cow ghee lamp.',
      kn: 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುನ್ನ ಅಥವಾ ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದಲ್ಲಿ ಎದ್ದು, ನದಿ ಸ್ಮರಣೆ ಮಾಡಿ ಸ್ನಾನ ಮುಗಿಸಿ ಶುದ್ಧ ಪೂಜಾ ವಸ್ತ್ರ ಧರಿಸಿ. ಪೂಜಾ ಮಂಟಪವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ, ತುಪ್ಪದ ದೀಪ ಬೆಳಗಿಸಿ.',
      hi: 'सूर्योदय से पूर्व उठकर पवित्र स्नान करें, धुले वस्त्र पहनें। मन्दिर की स्वच्छता कर अखण्ड ज्योति अथवा गौघृत का दीपक प्रज्वलित करें।'
    }
  },
  {
    step: 2,
    title: {
      en: '2. Achamana, Pranayama & Sankalpa',
      kn: '೨. ಆಚಮನ, ಪ್ರಾಣಾಯಾಮ & ದೈನಂದಿನ ಸಂಕಲ್ಪ:',
      hi: '२. आचमन, प्राणायाम एवं दैनिक संकल्प:'
    },
    desc: {
      en: 'Perform three-fold achamana chanting "Om Keshavaya Svaha, Om Narayanaya Svaha, Om Madhavaya Svaha...". Take akshata, water, and flower in right palm and make the solemn vow for the day’s Navadurga archana.',
      kn: '"ಓಂ ಕೇಶವಾಯ ಸ್ವಾಹಾ, ಓಂ ನಾರಾಯಣಾಯ ಸ್ವಾಹಾ..." ಎಂದು ೩ ಬಾರಿ ಆಚಮನ ಮಾಡಿ. ಬಲಗೈಯಲ್ಲಿ ನೀರು, ಅಕ್ಷತೆ, ಹೂವು ಹಿಡಿದು ಅಂದಿನ ನವದುರ್ಗಾ ದೇವಿಯ ಪ್ರೀತ್ಯರ್ಥವಾಗಿ ಪೂಜಾ ಸಂಕಲ್ಪ ಮಾಡಿ.',
      hi: 'आचमन मन्त्रों से त्रि-आचमन करें। दाहिने हाथ में जल, अक्षत व पुष्प लेकर उस दिन की नवदुर्गा आराधना का शुभ संकल्प लें।'
    }
  },
  {
    step: 3,
    title: {
      en: '3. Kalasha Puja & Sacred Water Prokshana',
      kn: '೩. ಕಲಶ ಪೂಜೆ & ಆತ್ಮಾರಾಧನೆ (ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ):',
      hi: '३. कलश पूजा एवं पवित्र जल प्रोक्षण:'
    },
    desc: {
      en: 'Offer akshata and flowers to the Kalasha established on Day 1. Chant the Sapta Nadi mantra and lightly sprinkle the holy water with a flower over yourself and all puja items for consecration.',
      kn: 'ಪಾಡ್ಯದಂದು ಸ್ಥಾಪಿಸಿದ ಕಲಶಕ್ಕೆ ಗಂಧ, ಅಕ್ಷತೆ, ಹೂವು ಸಮರ್ಪಿಸಿ ಕೈಮುಗಿಯಿರಿ. ಸಪ್ತ ನದಿಗಳನ್ನು ಸ್ಮರಿಸಿ ಪುಷ್ಪದಿಂದ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಮೇಲೆ ಹಾಗೂ ಶರೀರದ ಮೇಲೆ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ ಮಾಡಿ.',
      hi: 'प्रतिपदा को स्थापित कलश को चन्दन, अक्षत, पुष्प अर्पित करें। सप्त नदी मन्त्र से समस्त पूजन सामग्री एवं स्वयं पर पवित्र जल छिड़कें।'
    }
  },
  {
    step: 4,
    title: {
      en: '4. Shodashopachara / Panchopachara Offerings',
      kn: '೪. ಷೋಡಶೋಪಚಾರ / ಪಂಚೋಪಚಾರ ಅರ್ಪಣೆ:',
      hi: '४. षोडशोपचार / पंचोपचार अर्पण:'
    },
    desc: {
      en: 'Offer Asana, Padya, Arghya, Snana (or panchamrita chintana), Chandana, Kumkuma, Akshata, and fragrant fresh flowers (matching the day’s color recommendation). Burn natural dhoop / agarbatti and wave deepa.',
      kn: 'ದೇವಿಗೆ ಆಸನ, ಪಾದ್ಯ, ಅರ್ಘ್ಯ, ಆಚಮನ, ಶ್ರೀಗಂಧ, ಕುಂಕುಮ, ಅಕ್ಷತೆ ಹಾಗೂ ದಿನದ ಬಣ್ಣಕ್ಕೆ ತಕ್ಕಂತೆ ಸುಗಂಧ ಹೂವುಗಳನ್ನು ಸಮರ್ಪಿಸಿ. ಧೂಪ ಮತ್ತು ದೀಪವನ್ನು ಭಕ್ತಿಯಿಂದ ಬೆಳಗಿಸಿ.',
      hi: 'देवी को आसन, पाद्य, अर्घ्य, आचमनीय, चन्दन, रोली, अक्षत एवं उस दिन के विशेष वर्ण के ताजे पुष्प अर्पित करें। सुगन्धित धूप एवं दीप दिखाएं।'
    }
  },
  {
    step: 5,
    title: {
      en: '5. Specific Navadurga Dhyana Mantra & Japa',
      kn: '೫. ಅಂದಿನ ನವದುರ್ಗಾ ದೇವಿಯ ಧ್ಯಾನ ಮಂತ್ರ & ಜಪ:',
      hi: '५. उस दिवस की नवदुर्गा का विशेष ध्यान मन्त्र एवं जप:'
    },
    desc: {
      en: 'Meditate on the specific form of the Goddess for that day (e.g. Shailaputri, Brahmacharini, Chandraghanta, etc.) reciting Her Dhyana Shloka and chant the Navarna Mantra "Om Aim Hreem Kleem Chamundayai Vichche" (108 times).',
      kn: 'ಅಂದಿನ ದಿನದ ದೇವಿಯ (ಉದಾ: ಶೈಲಪುತ್ರಿ, ಬ್ರಹ್ಮಚಾರಿಣಿ...) ಧ್ಯಾನ ಮಂತ್ರವನ್ನು ಭಕ್ತಿಯಿಂದ ಪಠಿಸಿ, ನವಾರ್ಣ ಮಂತ್ರವಾದ "ಓಂ ಐಂ ಹ್ರೀಂ ಕ್ಲೀಂ ಚಾಮುಂಡಾಯೈ ವಿಚ್ಚೇ" ಮಂತ್ರವನ್ನು ೧೦೮ ಬಾರಿ ಜಪಿಸಿ.',
      hi: 'उस दिन की देवी के ध्यान श्लोक का पाठ करें तथा नवार्ण मन्त्र "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे" का कम से कम १०८ बार जप करें।'
    }
  },
  {
    step: 6,
    title: {
      en: '6. Maha Naivedya, Camphor Aarti & Kshama Prarthana',
      kn: '೬. ಮಹಾ ನೈವೇದ್ಯ, ಕರ್ಪೂರ ಮಂಗಳಾರತಿ & ಕ್ಷಮಾ ಪ್ರಾರ್ಥನೆ:',
      hi: '६. महा नैवेद्य, कर्पूर आरती एवं क्षमा प्रार्थना:'
    },
    desc: {
      en: 'Present the specific traditional sweet or fruit naivedya assigned to that day (e.g., Ghee/fruit on Day 1, Sugar/Panchamrita on Day 2, Kheer on Day 3, Malpua on Day 4, Banana on Day 5, Honey on Day 6, Jaggery on Day 7, Halwa/Chana on Day 8, Kadle Puri/Sweets on Day 9). Ring the bell during Camphor Aarti, do pradakshina, and recite the forgiveness mantra "Aparadha Sahasrani...".',
      kn: 'ಅಂದಿನ ದಿನದ ವಿಶೇಷ ನೈವೇದ್ಯವನ್ನು (ದಿನ ೧-ತುಪ್ಪ/ಹಣ್ಣು, ದಿನ ೨-ಕಲ್ಲುಸಕ್ಕರೆ/ಪಂಚಾಮೃತ, ದಿನ ೩-ಪಾಯಸ, ದಿನ ೪-ಮಾಲ್ಪುವಾ, ದಿನ ೫-ಬಾಳೆಹಣ್ಣು, ದಿನ ೬-ಜೇನುತುಪ್ಪ, ದಿನ ೭-ಬೆಲ್ಲ, ದಿನ ೮-ಹಲ್ವಾ/ಕಡಲೆ, ದಿನ ೯-ಕಡಲೆಪುರಿ/ಸಿಹಿ) ಅರ್ಪಿಸಿ ಘಂಟಾನಾದದೊಂದಿಗೆ ಮಂಗಳಾರತಿ ಮಾಡಿ ಕ್ಷಮಾ ಪ್ರಾರ್ಥನೆ ಮಾಡಿ.',
      hi: 'उस दिन का विशेष भोग अर्पित करें। घण्टा नाद के साथ कर्पूर आरती करें, प्रदक्षिणा कर "अपराधसहस्राणि क्रियन्तेऽहर्निशं मया। दासोऽयमिति मां मत्वा क्षमस्व परमेश्वरि॥" से क्षमा याचना करें।'
    }
  }
];

// -------------------------------------------------------------
// 1D. NAVAMI AYUDHA PUJA & SARASWATI PUJA DETAILS
// -------------------------------------------------------------
export const AYUDHA_PUJA_DETAILS = {
  title: {
    en: 'Maha Navami • Ayudha Puja & Saraswati Pustaka Puja',
    kn: 'ಮಹಾನವಮಿ • ಆಯುಧ ಪೂಜೆ & ಮಹಾಸರಸ್ವತೀ ಪುಸ್ತಕ ಪೂಜೆ',
    hi: 'महानवमी • आयुध पूजन एवं महासरस्वती पुस्तक पूजन'
  },
  significance: {
    en: 'Ayudha Puja is the sacred Vedic consecration of all instruments of livelihood, craft, defense, technology, books, and vehicles. Work is worship (Kayakave Kailasa). By seeing the Divine Energy (Chandi, Saraswati, Vishwakarma) manifested in our tools and knowledge, we remove all obstacles, ego, and professional hazards.',
    kn: 'ಆಯುಧ ಪೂಜೆಯು ಜೀವನೋಪಾಯಕ್ಕೆ ಬಳಸುವ ವಾಹನಗಳು, ಯಂತ್ರಗಳು, ಲೇಖನಿ, ಕಂಪ್ಯೂಟರ್ ಹಾಗೂ ಶ್ರಮದ ಉಪಕರಣಗಳನ್ನು ದೈವಿಕ ಶಕ್ತಿಯ ಸಂಕೇತವೆಂದು ಭಾವಿಸಿ ಪೂಜಿಸುವ ಪರಮ ಪವಿತ್ರ ಹಬ್ಬ. ಕಾಯಕವೇ ಕೈಲಾಸ ಎಂಬ ತತ್ತ್ವದಂತೆ ಸಕಲ ಸಾಧನಗಳಲ್ಲಿ ಜಗನ್ಮಾತೆ ಹಾಗೂ ವಿಶ್ವಕರ್ಮನನ್ನು ಆವಾಹಿಸಿ ಆರಾಧಿಸಲಾಗುತ್ತದೆ.',
    hi: 'आयुध पूजा आजीविका के समस्त साधनों, वाहनों, यन्त्रों, कम्प्यूटर, शिल्प उपकरणों एवं ग्रन्थों की पवित्र प्राण-प्रतिष्ठा है। "कर्म ही पूजा है" के भाव से सभी उपकरणों में माँ चण्डी, सरस्वती एवं विश्वकर्मा का दर्शन किया जाता है।'
  },
  muhurtaDesc: {
    en: 'Morning Auspicious Window: 06:15 AM - 08:45 AM | Midday Abhijit Window: 11:45 AM - 12:35 PM',
    kn: 'ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ: ೦೬:೧೫ AM - ೦೮:೪೫ AM | ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ: ೧೧:೪೫ AM - ೧೨:೩೫ PM',
    hi: 'प्रातः शुभ मुहूर्त: ०६:१५ AM - ०८:४५ AM | दोपहर अभिजित वेला: ११:४५ AM - १२:३५ PM'
  },
  samagri: {
    en: 'Sandalwood paste, vermilion (kumkuma), turmeric, marigold/chrysanthemum garlands, lemons, puffed rice (Kadle Puri), jaggery, bananas, coconut, betel leaves, camphor, ash gourd with camphor.',
    kn: 'ಶ್ರೀಗಂಧ, ಕುಂಕುಮ, ಅರಿಶಿನ, ಸೇವಂತಿಗೆ ಮತ್ತು ಚೆಂಡುಹೂವಿನ ಹಾರಗಳು, ನಿಂಬೆಹಣ್ಣುಗಳು, ಕಡಲೆಪುರಿ, ಸಾವಯವ ಬೆಲ್ಲ, ಬಾಳೆಹಣ್ಣು, ತೆಂಗಿನಕಾಯಿ, ವೀಳ್ಯದೆಲೆ, ಕರ್ಪೂರ, ದೃಷ್ಟಿ ನಿವಾರಣೆಗೆ ಕುಂಬಳಕಾಯಿ.',
    hi: 'चन्दन, कुंकुम, हल्दी, गेंदा व सेवंती पुष्पमालाएं, नींबू, खील (मुरमुरा), गुड़, केले, नारियल, पान, कर्पूर एवं दृष्टि निवारण हेतु पेठा।'
  },
  steps: [
    {
      step: 1,
      title: { en: 'Cleaning & Purification', kn: '೧. ಉಪಕರಣ & ವಾಹನಗಳ ಶುಚಿಗೊಳಿಸುವಿಕೆ:', hi: '१. वाहनों व यन्त्रों का प्रक्षालन:' },
      desc: {
        en: 'Wash all vehicles (cars, bikes, cycles), clean machinery, computers, pens, books, and kitchen or artisanal tools with water and wipe dry.',
        kn: 'ವಾಹನಗಳು (ಕಾರು, ಬೈಕ್, ಸೈಕಲ್), ಕಚೇರಿಯ ಕಂಪ್ಯೂಟರ್, ಲೇಖನಿಗಳು, ಕಾರ್ಖಾನೆಯ ಯಂತ್ರಗಳು ಹಾಗೂ ಕರಕುಶಲ ಪರಿಕರಗಳನ್ನು ಶುದ್ಧ ನೀರಿನಿಂದ ತೊಳೆದು ಒರೆಸಿ.',
        hi: 'समस्त वाहनों, यन्त्रों, कम्प्यूटर, औजारों एवं पुस्तकों को स्वच्छ जल से धोकर अथवा पोंछकर शुद्ध करें।'
      }
    },
    {
      step: 2,
      title: { en: 'Sandalwood & Kumkuma Tilaka', kn: '೨. ಶ್ರೀಗಂಧ & ಕುಂಕುಮ ತಿಲಕ ಧಾರಣೆ:', hi: '२. चन्दन एवं कुंकुम तिलक:' },
      desc: {
        en: 'Apply three broad sacred stripes of sandalwood paste and bold red kumkuma tilakas on the steering wheels, bonnets, engines, blades, and tools.',
        kn: 'ವಾಹನಗಳ ಮುಂಭಾಗ, ಸ್ಟೀರಿಂಗ್, ಯಂತ್ರಗಳು ಹಾಗೂ ಲೇಖನಿಗಳ ಮೇಲೆ ಶ್ರೀಗಂಧ ಮತ್ತು ಕೆಂಪು ಕುಂಕುಮದ ಪವಿತ್ರ ತಿಲಕ ಅಥವಾ ಸ್ವಸ್ತಿಕ ಇಡಿ.',
        hi: 'वाहनों, स्टीयरिंग, यन्त्रों एवं लेखनी पर चन्दन व कुंकुम से तिलक अथवा स्वस्तिक बनाएं।'
      }
    },
    {
      step: 3,
      title: { en: 'Floral Decoration & Lemon Placement', kn: '೩. ಹೂವಿನ ಹಾರ & ನಿಂಬೆಹಣ್ಣು ಜೋಡಣೆ:', hi: '३. पुष्पमाला एवं नींबू स्थापन:' },
      desc: {
        en: 'Adorn vehicles and instruments with yellow marigold and chrysanthemum garlands. Place fresh green lemons under the tyres of vehicles and hang a lemon-chilli thread for protection.',
        kn: 'ಚೆಂಡುಹೂವು ಮತ್ತು ಸೇವಂತಿಗೆ ಹೂವಿನ ಹಾರಗಳನ್ನು ವಾಹನ-ಯಂತ್ರಗಳಿಗೆ ಹಾಕಿ. ವಾಹನದ ಎಲ್ಲ ಚಕ್ರಗಳ ಕೆಳಗೆ ತಾಜಾ ನಿಂಬೆಹಣ್ಣುಗಳನ್ನು ಇರಿಸಿ.',
        hi: 'गेंदे की पुष्पमालाओं से वाहनों व यन्त्रों को सजाएं। वाहनों के सभी टायरों के नीचे ताजा नींबू रखें।'
      }
    },
    {
      step: 4,
      title: { en: 'Saraswati Pustaka Puja', kn: '೪. ಮಹಾಸರಸ್ವತೀ ಪುಸ್ತಕ ಪೂಜೆ:', hi: '४. सरस्वती पुस्तक पूजन:' },
      desc: {
        en: 'Place holy scriptures, academic books, notebooks, laptops, and musical instruments before Goddess Saraswati. Offer white flowers and do not touch or read until Vijayadashami morning.',
        kn: 'ಪವಿತ್ರ ಗ್ರಂಥಗಳು, ಶಾಲಾ ಪುಸ್ತಕಗಳು, ಲ್ಯಾಪ್‌ಟಾಪ್ ಮತ್ತು ಸಂಗೀತ ವಾದ್ಯಗಳನ್ನು ಸರಸ್ವತಿ ದೇವಿಯ ಮುಂದೆ ಇರಿಸಿ ಬಿಳಿ ಹೂಗಳಿಂದ ಪೂಜಿಸಿ. ವಿಜಯದಶಮಿಯವರೆಗೂ ಪುಸ್ತಕಗಳನ್ನು ಮುಟ್ಟಬಾರದು.',
        hi: 'पवित्र ग्रन्थों, अध्ययन पुस्तकों, लैपटॉप व वाद्यों को माँ सरस्वती के चरणों में रखें। विजयादशमी तक इन्हें विश्राम दें।'
      }
    },
    {
      step: 5,
      title: { en: 'Kadle Puri Naivedya, Camphor Aarti & Drishti Ash Gourd', kn: '೫. ಕಡಲೆಪುರಿ-ಬೆಲ್ಲ ನೈವೇದ್ಯ, ಆರತಿ & ದೃಷ್ಟಿ ನಿವಾರಣೆ:', hi: '५. खील-गुड़ भोग, आरती एवं दृष्टि निवारण:' },
      desc: {
        en: 'Offer Kadle Puri (puffed rice), jaggery, fruits, and sweets. Perform a grand Camphor Mangalarati. For commercial vehicles and premises, wave an ash gourd with burning camphor to banish all evil eyes, then break it outside.',
        kn: 'ಕಡಲೆಪುರಿ, ಸಾವಯವ ಬೆಲ್ಲ, ಬಾಳೆಹಣ್ಣು ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ ಕರ್ಪೂರ ಮಂಗಳಾರತಿ ಮಾಡಿ. ವಾಹನ ಹಾಗೂ ಅಂಗಡಿ-ಕಚೇರಿಗಳಿಗೆ ಕುಂಬಳಕಾಯಿಗೆ ಕರ್ಪೂರ ಹಚ್ಚಿ ದೃಷ್ಟಿ ತೆಗೆದು ಹೊಡೆದು ನಿಂಬೆಹಣ್ಣನ್ನು ತುಳಿಯಿರಿ.',
        hi: 'खील, बताशे, गुड़ व फल का भोग लगाकर कर्पूर आरती करें। वाहनों व प्रतिष्ठानों की नजर उतारने हेतु पेठे पर कर्पूर जलाकर दृष्टि निवारण करें।'
      }
    }
  ],
  mantra: {
    sanskritText: 'शस्त्राणि चैव शस्त्रास्त्राणि सर्वाणि विविधानि च । पूजार्थं मयि नीतानि तानि रक्षन्तु मां सदा ॥\nसरस्वति नमस्तुभ्यं वरदे कामरूपिणि । विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥',
    kannadaText: 'ಶಸ್ತ್ರಾಣಿ ಚೈವ ಶಸ್ತ್ರಾಸ್ತ್ರಾಣಿ ಸರ್ವಾಣಿ ವಿವಿಧಾನಿ ಚ | ಪೂಜಾರ್ಥಂ ಮಯಿ ನೀತಾನಿ ತಾನಿ ರಕ್ಷಂತು ಮಾಂ ಸದಾ ||\nಸರಸ್ವತಿ ನಮಸ್ತುಭ್ಯಂ ವರದೇ ಕಾಮರೂಪಿಣಿ | ವಿದ್ಯಾರಂಭಂ ಕರಿಷ್ಯಾಮಿ ಸಿದ್ಧಿರ್ಭವತು ಮೇ ಸದಾ ||',
    englishTransliteration: 'Shastrani Chaiva Shastrastrani Sarvani Vividhani Cha | Poojartham Mayi Neetani Tani Rakshantu Mam Sada ||\nSaraswati Namastubhyam Varade Kamaroopini | Vidyarambham Karishyami Siddhirbhavatu Me Sada ||',
    meaning: {
      en: 'O sacred instruments and weapons of noble livelihood, consecrated here in worship, protect me and my work always! Salutations to Goddess Saraswati, bestower of boons; I initiate my knowledge seeking eternal success.',
      kn: 'ಪೂಜೆಗಾಗಿ ಇಲ್ಲಿ ಸಮರ್ಪಿಸಿರುವ ಸಕಲ ಕಾಯಕದ ಉಪಕರಣಗಳೇ, ನೀವು ನಮ್ಮನ್ನು ಸದಾ ರಕ್ಷಿಸಿ. ವರಪ್ರದಾಯಿನಿ ಸರಸ್ವತಿಯೇ ನಿನಗೆ ನಮಸ್ಕಾರ; ನಾನು ವಿದ್ಯೆಯನ್ನು ಆರಂಭಿಸುತ್ತೇನೆ, ನನಗೆ ಸದಾ ಸಿದ್ಧಿ ದೊರೆಯಲಿ.',
      hi: 'हे पूजनार्थ समर्पित समस्त शस्त्र व आजीविका के साधन! आप सदैव मेरी रक्षा करें। हे वरदायिनी माँ सरस्वती! आपको नमन, मैं विद्या आरम्भ करता हूँ, मुझे सदा सफलता प्राप्त हो।'
    }
  }
};

// -------------------------------------------------------------
// 1E. DAY 10: VIJAYADASHAMI & KALASHA VISARJANA (UDWASANA) DETAILS
// -------------------------------------------------------------
export const VIJAYADASHAMI_VISARJANA_DETAILS = {
  title: {
    en: 'Day 10: Vijayadashami • Vidyarambha, Shami Puja & Kalasha Visarjana (Udwasana)',
    kn: 'ದಿನ ೧೦: ವಿಜಯದಶಮಿ • ವಿದ್ಯಾರಂಭ, ಶಮೀ ಪೂಜೆ & ಕಲಶ ವಿಸರ್ಜನೆ (ಉದ್ವಾಸನ)',
    hi: 'दिवस १०: विजयादशमी • अक्षराभ्यास, शमी पूजन एवं कलश विसर्जन (उद्वासन)'
  },
  significance: {
    en: 'The supreme festival celebrating the victory of Dharma over adharma — Goddess Durga annihilating Mahishasura and Lord Rama vanquishing Ravana. On this triumphant day, we initiate children into literacy (Vidyarambha), worship the sacred Shami tree for prosperity, and respectfully conclude the 10-day festival through Kalasha Visarjana, spreading the sanctified waters throughout our homes.',
    kn: 'ಅಧರ್ಮದ ಮೇಲೆ ಧರ್ಮದ ವಿಜಯದ ಸಂಕೇತ — ಶ್ರೀರಾಮನು ರಾವಣನನ್ನು ಮತ್ತು ದುರ್ಗೆಯು ಮಹಿಷಾಸುರನನ್ನು ಸಂಹರಿಸಿದ ಪವಿತ್ರ ವಿಜಯೋತ್ಸವ. ಈ ದಿನ ಪುಟ್ಟ ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರಂಭ (ಅಕ್ಷರಾಭ್ಯಾಸ), ಬಂಗಾರದ ಸಂಕೇತವಾದ ಬನ್ನಿ (ಶಮೀ) ಪೂಜೆ ಹಾಗೂ ೯ ದಿನಗಳ ಕಲಶವನ್ನು ಗೌರವದಿಂದ ಉದ್ವಾಸನ (ವಿಸರ್ಜನೆ) ಮಾಡಿ ಇಡೀ ಮನೆಗೆ ಪವಿತ್ರ ತೀರ್ಥ ಪ್ರೋಕ್ಷಿಸಲಾಗುತ್ತದೆ.',
    hi: 'अधर्म पर धर्म की विजय का महापर्व — माँ दुर्गा द्वारा महिषासुर का संहार एवं श्रीराम द्वारा रावण वध। इस दिन विद्यारम्भ (अक्षराभ्यास), शमी पूजन एवं ९ दिवसीय कलश का विधिवत उद्वासन (विसर्जन) कर समस्त घर में तीर्थ जल का छिड़काव किया जाता है।'
  },
  muhurtas: {
    vijayaMuhurta: '02:02 PM - 02:49 PM',
    vidyarambhaWindow: '08:30 AM - 10:45 AM',
    kalashaVisarjanaWindow: 'Morning Shubh (07:30 AM - 10:30 AM) or Vijaya Muhurta (02:02 PM - 02:49 PM)'
  },
  kalashaVisarjanaSteps: [
    {
      step: 1,
      title: {
        en: '1. Final Mangalarati & Kalasha Udwasana (Moving the Pot)',
        kn: '೧. ಅಂತಿಮ ಮಂಗಳಾರತಿ & ಕಲಶ ಉದ್ವಾಸನೆ (ಕಲಶ ಚಲನೆ):',
        hi: '१. अन्तिम आरती एवं कलश उद्वासन (कलश संचलन):'
      },
      desc: {
        en: 'Perform a final heartfelt Mangalarati to the Kalasha offering fresh flowers, betel leaves, and sweet naivedya. With utmost reverence, gently shift the Kalasha a few inches towards the North (Uttara) or North-East direction chanting the Visarjana Mantra.',
        kn: 'ಕಲಶಕ್ಕೆ ತಾಜಾ ಹೂವು ಮತ್ತು ಸಿಹಿ ನೈವೇದ್ಯ ಅರ್ಪಿಸಿ ಅಂತಿಮ ಮಂಗಳಾರತಿ ಮಾಡಿ. ನಂತರ ಭಕ್ತಿಯಿಂದ ಕೈಮುಗಿದು, ವಿಸರ್ಜನಾ ಮಂತ್ರ ಪಠಿಸುತ್ತಾ ಕಲಶವನ್ನು ಉತ್ತರ ಅಥವಾ ಈಶಾನ್ಯ ದಿಕ್ಕಿನ ಕಡೆಗೆ ಕೆಲವು ಇಂಚುಗಳಷ್ಟು ನಿಧಾನವಾಗಿ ಚಲಿಸಿ (ಉದ್ವಾಸನೆ ಮಾಡಿ).',
        hi: 'कलश की अन्तिम कर्पूर आरती करें। विसर्जन मन्त्र का उच्चारण करते हुए कलश को श्रद्धापूर्वक उत्तर अथवा ईशान दिशा की ओर कुछ इंच धीरे से आगे बढ़ाएं (उद्वासन करें)।'
      }
    },
    {
      step: 2,
      title: {
        en: '2. Sacred Visarjana Mantras',
        kn: '೨. ಪವಿತ್ರ ವಿಸರ್ಜನಾ ಮಂತ್ರಗಳು:',
        hi: '२. पवित्र विसर्जन मन्त्र:'
      },
      desc: {
        en: 'Chant: "Gachha Gachha Param Sthanam Swasthanam Parameshwari | Yatpoojitam Maya Devi Paripoornam Tadastu Me ||" and "Yantu Devaganah Sarve Poojam Aadaya Mamakeem | Ishtakama Samriddhyartham Punaragamanaya Cha ||".',
        kn: 'ಮಂತ್ರ ಪಠಿಸಿ: "ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ | ಯತ್ಪೂಜಿತಂ ಮಯಾ ದೇವಿ ಪರಿಪೂರ್ಣಂ ತದಸ್ತು ಮೇ ||" ಮತ್ತು "ಯಾಂತು ದೇವಗಣಾಃ ಸರ್ವೇ ಪೂಜಾಮಾದಾಯ ಮಾಮಕೀಮ್ | ಇಷ್ಟಕಾಮಸಮೃದ್ಧರ್ಥಂ ಪುನರಾಗಮನಾಯ ಚ ||".',
        hi: 'मन्त्र पाठ करें: "गच्छ गच्छ परं स्थानं स्वस्थानं परमेश्वरि। यत्पूजितं मया देवि परिपूर्णं तदस्तु मे॥" तथा "यान्तु देवगणाः सर्वे पूजामादाय मामकीम्। इष्टकामसमृद्ध्यर्थं पुनरागमनाय च॥"'
      }
    },
    {
      step: 3,
      title: {
        en: '3. Holy Theertha Prokshana (Sanctifying the Household)',
        kn: '೩. ಪವಿತ್ರ ಕಲಶ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ (ಮನೆ-ಮನಗಳ ಪಾವಿತ್ರ್ಯ):',
        hi: '३. कलश तीर्थ जल प्रोक्षण (गृह पवित्रीकरण):'
      },
      desc: {
        en: 'Dip the 5 sacred mango leaves into the sanctified Kalasha water. Sprinkle this energized divine water generously throughout every room, kitchen, front door, balcony, and courtyard of your home, and over the heads of all family members. This invites perennial prosperity, shields the home from negative energies, and bestows divine grace.',
        kn: 'ಕಲಶದ ಬಾಯಿಯಲ್ಲಿದ್ದ ೫ ಮಾವಿನೆಲೆಗಳನ್ನು ಕಲಶದ ಪವಿತ್ರ ಜಲದಲ್ಲಿ ಅದ್ದಿ. ಆ ತೀರ್ಥೋದಕವನ್ನು ಮನೆಯ ಎಲ್ಲ ಕೊಠಡಿಗಳು, ಪ್ರವೇಶ ದ್ವಾರ, ಅಡುಗೆ ಮನೆ ಮತ್ತು ಕುಟುಂಬದ ಎಲ್ಲ ಸದಸ್ಯರ ತಲೆಯ ಮೇಲೆ ಪ್ರೋಕ್ಷಿಸಿ. ಇದು ಮನೆಯ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳನ್ನು ಹೋಗಲಾಡಿಸಿ ಸಕಲ ಸುಖ-ಶಾಂತಿ ನೀಡುತ್ತದೆ.',
        hi: 'कलश के ५ आम के पत्तों को कलश के अभिमन्त्रित जल में डुबोएं। इस पवित्र जल को घर के प्रत्येक कक्ष, मुख्य द्वार, रसोई तथा परिवार के सभी सदस्यों पर छिड़कें। इससे घर में सकारात्मक ऊर्जा व सुख-समृद्धि का वास होता है।'
      }
    },
    {
      step: 4,
      title: {
        en: '4. Sacred Coconut & Mangala Dravya Prasadam',
        kn: '೪. ತೆಂಗಿನಕಾಯಿ & ಮಂಗಳ ದ್ರವ್ಯ ಪ್ರಸಾದ ಸ್ವೀಕಾರ:',
        hi: '४. श्रीफल एवं मंगल द्रव्य प्रसाद ग्रहण:'
      },
      desc: {
        en: 'Break the consecrated coconut from the Kalasha and distribute it as divine prasada or use it to prepare holy payasam/sweets. The coin, supari, and sacred rice (Akshata) from the Kalasha should be respectfully wrapped in a red or yellow cloth and placed inside your wealth safe, cash locker, or puja altar for lasting Lakshmi-Kubera blessings.',
        kn: 'ಕಲಶದ ತೆಂಗಿನಕಾಯಿಯನ್ನು ಒಡೆದು ದೇವಿಯ ಪ್ರಸಾದವಾಗಿ ಸೇವಿಸಿ ಅಥವಾ ಸಿಹಿ ಪಾಯಸ ತಯಾರಿಸಿ. ಕಲಶದ ಒಳಗಿದ್ದ ನಾಣ್ಯ, ಅಡಿಕೆ ಮತ್ತು ಅಕ್ಷತೆಯನ್ನು ಕೆಂಪು ಅಥವಾ ಹಳದಿ ವಸ್ತ್ರದಲ್ಲಿ ಕಟ್ಟಿ ತಿಜೋರಿ ಅಥವಾ ನಗದು ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಇರಿಸಿದರೆ ಲಕ್ಷ್ಮೀ ಕೃಪೆ ಸದಾ ನೆಲೆಸುತ್ತದೆ.',
        hi: 'कलश के नारियल को फोड़कर प्रसाद रूप में बांटें अथवा खीर बनाएं। कलश के भीतर रखे सिक्के, सुपारी एवं अक्षत को लाल/पीले वस्त्र में लपेटकर अपनी तिजोरी अथवा पूजा स्थान में रखें; इससे धन-धान्य की वृद्धि होती है।'
      }
    }
  ],
  vidyarambhaVidhi: {
    title: {
      en: 'Vidyarambha / Aksharabhyasa Vidhi (ಅಕ್ಷರಾಭ್ಯಾಸ)',
      kn: 'ವಿದ್ಯಾರಂಭ / ಅಕ್ಷರಾಭ್ಯಾಸ ವಿಧಾನ:',
      hi: 'विद्यारम्भ / अक्षराभ्यास विधान:'
    },
    desc: {
      en: 'Spread raw unbroken rice on a plate. The parents or guru hold the child’s right index finger and trace the sacred invocation: "Om Harih Sri Ganapataye Namah | Avighnamastu ||" followed by the primary vowels (A, Aa, I, Ee...), offering sweets and prayers to Goddess Saraswati.',
      kn: 'ತಟ್ಟೆಯಲ್ಲಿ ಹಸನಾದ ಬಿಳಿ ಅಕ್ಕಿಯನ್ನು ಹರಡಿ. ತಂದೆ-ತಾಯಿ ಅಥವಾ ಗುರುಗಳು ಮಗುವಿನ ಬಲಗೈ ತೋರುಬೆರಳು ಹಿಡಿದು "ಓಂ ಹರಿಃ ಶ್ರೀ ಗಣಪತಯೇ ನಮಃ | ಅವಿಘ್ನಮಸ್ತು ||" ಹಾಗೂ ಸ್ವರಾಕ್ಷರಗಳನ್ನು (ಅ, ಆ, ಇ, ಈ...) ಬರೆಸಿ ಸರಸ್ವತಿಗೆ ಪ್ರಾರ್ಥಿಸಿ ಸಿಹಿ ತಿನ್ನಿಸುವುದು.',
      hi: 'चावल से भरी थाली पर पिता, माता अथवा गुरु बालक की तर्जनी उंगली पकड़कर "ॐ हरिः श्री गणपतये नमः। अविघ्नमस्तु॥" लिखाएं तथा माँ सरस्वती की स्तुति कर बालक को मिष्ठान्न खिलाएं।'
    }
  },
  shamiPujaVidhi: {
    title: {
      en: 'Shami (Banni) Puja & Leaf Exchange Tradition',
      kn: 'ಶಮೀ (ಬನ್ನಿ) ಪೂಜೆ & "ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಪರಂಪರೆ:',
      hi: 'शमी पूजन एवं स्वर्ण सम पत्र विनिमय परंपरा:'
    },
    desc: {
      en: 'Worship the sacred Shami tree reciting the mantra "Shami Shamayate Papam Shami Shatruvinashini | Arjunasya Dhanurdhari Ramasya Priyadarshini ||". Devotees exchange Shami leaves with elders and loved ones reciting "Banni Thagoli Bangardhangiri" (Take Banni leaves and live like precious gold), seeking elders\' blessings.',
      kn: '"ಶಮೀ ಶಮಯತೇ ಪಾಪಂ ಶಮೀ ಶತ್ರುವಿನಾಶಿನೀ | ಅರ್ಜುನಸ್ಯ ಧನುರ್ಧಾರಿ ರಾಮಸ್ಯ ಪ್ರಿಯದರ್ಶಿನೀ ||" ಮಂತ್ರದಿಂದ ಬನ್ನಿ ಮರವನ್ನು ಪೂಜಿಸಿ. ನಂತರ ಹಿರಿಯರಿಗೆ "ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಎಂದು ಬನ್ನಿ ಎಲೆಗಳನ್ನು ನೀಡಿ ಪಾದಗಳಿಗೆ ನಮಸ್ಕರಿಸಿ ಆಶೀರ್ವಾದ ಪಡೆಯುವುದು ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಪರಂಪರೆ.',
      hi: '"शमी शमयते पापं शमी शत्रुविनाशिनी। अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी॥" मन्त्र से शमी वृक्ष की पूजा करें। बड़ों को शमी पत्र भेंट कर चरण स्पर्श करें तथा स्वर्णवत समृद्ध जीवन की मंगलकामनाएं प्राप्त करें।'
    }
  }
};

// -------------------------------------------------------------
// 2. SANDHI PUJA & KUSHMANDA (PUMPKIN) BALI DATA
// -------------------------------------------------------------
export const SANDHI_PUJA_DETAILS = {
  title: {
    en: 'Sandhi Puja & Kushmanda Bali (Maha Ashtami / Durgashtami)',
    kn: 'ಸಂಧಿ ಪೂಜೆ & ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಬಲಿ ಮಹಾವಿಧಿ',
    hi: 'सन्धि पूजा एवं कूष्माण्ड (पेठा) सात्त्विक बलि महाविधान'
  },
  subtitle: {
    en: 'The 48-Minute Confluence Window where Devi Durga manifests as Chamunda to vanquish darkness',
    kn: 'ಮಹಾಷ್ಟಮಿ ಮತ್ತು ಮಹಾನವಮಿಯ ಸಂಧಿಕಾಲದಲ್ಲಿ ಚಾಮುಂಡೇಶ್ವರಿಯ ಆವಿರ್ಭಾವ ಹಾಗೂ ಅಹಂಕಾರ ದಹನದ ಬಲಿ',
    hi: 'महाष्टमी एवं महानवमी के मिलन काल में चामुण्डा प्राकट्य एवं अहंकार नाश की पावन बलि'
  },
  whatIsSandhiKala: {
    en: 'Sandhi Kala is the exact 48-minute astronomical and scriptural junction where Maha Ashtami ends and Maha Navami begins (spanning the final 24 minutes of Ashtami and the first 24 minutes of Navami).',
    kn: 'ಸಂಧಿಕಾಲವೆಂದರೆ ಮಹಾ ಅಷ್ಟಮಿ ತಿಥಿ ಮುಕ್ತಾಯವಾಗುವ ಕೊನೆಯ ೨೪ ನಿಮಿಷಗಳು ಮತ್ತು ಮಹಾ ನವಮಿ ತಿಥಿ ಪ್ರಾರಂಭವಾಗುವ ಮೊದಲ ೨೪ ನಿಮಿಷಗಳು ಸೇರಿ ಒಟ್ಟು ೪೮ ನಿಮಿಷಗಳ ಕಾಲಾವಧಿ.',
    hi: 'महाष्टमी के समापन के अन्तिम २४ मिनट और महानवमी के आरम्भ के प्रथम २४ मिनट का कुल ४८ मिनट का समय "सन्धिकाळ" कहलाता है।'
  },
  auspiciousReason: {
    en: 'Legend in Markandeya Purana and Devi Mahatmyam holds that at this exact planetary confluence, Goddess Durga manifested Her fiercest form as Chamunda to slay the demonic forces Chanda and Munda. It is the absolute peak of Navaratri Shakti energy.',
    kn: 'ದೇವಿ ಮಹಾತ್ಮ್ಯೆ ಮತ್ತು ಮಾರ್ಕಂಡೇಯ ಪುರಾಣದ ಪ್ರಕಾರ, ಈ ನಿಖರ ಕಾಲಘಟ್ಟದಲ್ಲಿ ದುರ್ಗಾದೇವಿಯು ಚಂಡ-ಮುಂಡರೆಂಬ ಅಸುರರನ್ನು ಸಂಹರಿಸಲು ರೌದ್ರಾವತಾರಿ ಚಾಮುಂಡಿಯಾಗಿ ಆವಿರ್ಭವಿಸಿದಳು. ಆದ್ದರಿಂದ ಇದು ನವರಾತ್ರಿಯ ಅತ್ಯಂತ ಶಕ್ತಿಶಾಲಿ ಸಮಯ.',
    hi: 'देवी महात्म्य के अनुसार इसी क्षण में माँ दुर्गा ने चण्ड-मुण्ड का वध करने हेतु विकराल चामुण्डा स्वरूप धारण किया था। अतः यह समय ऊर्जा का सर्वोच्च शिखर है।'
  },
  whyPeopleConfuse: {
    en: 'People often get confused because the 48-minute Sandhi transition rarely matches standard calendar midnight; it is determined by the exact tithi transition degree of Moon and Sun. If the transition occurs during deep night or is missed, classical texts sanction Pradosha Kala (sunset transition) on Ashtami evening as the authorized alternative.',
    kn: 'ಸೂರ್ಯ-ಚಂದ್ರರ ಅಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಅಷ್ಟಮಿ-ನವಮಿ ತಿಥಿಯ ಬದಲಾವಣೆ ದಿನದ ಯಾವುದೇ ಹೊತ್ತಿನಲ್ಲಿ (ಅಥವಾ ಮಧ್ಯರಾತ್ರಿ) ಸಂಭವಿಸಬಹುದು. ಆದ್ದರಿಂದ ಮುಹೂರ್ತ ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ ಗೊಂದಲವುಂಟಾಗುತ್ತದೆ. ಸಂಧಿಕಾಲ ಸಾಧ್ಯವಾಗದಿದ್ದಲ್ಲಿ, ಅಷ್ಟಮಿಯ ಸಂಜೆ ಸೂರ್ಯಾಸ್ತದ "ಪ್ರದೋಷ ಕಾಲ"ದಲ್ಲಿ ಬಲಿ ನೀಡುವುದು ಶಾಸ್ತ್ರಸಮ್ಮತ ಪರ್ಯಾಯವಾಗಿದೆ.',
    hi: 'तिथि प्रवेश का समय सौर-चान्द्र गति पर निर्भर होता है। यदि मध्यरात्रि की सन्धि में सम्भव न हो, तो अष्टमी की सायंकालीन "प्रदोष वेला" में बलि देना शास्त्रसम्मत विकल्प है।'
  },
  kushmandaSignificance: {
    en: 'In Vedic rituals, animal sacrifice (pashu bali) is replaced by Satvik Bali using a white ash gourd (Kushmanda). The pumpkin represents the ego (ಅಹಂಕಾರ), pride (ದರ್ಪ), and dormant tamasic tendencies. Splitting it before the Goddess symbolizes the total destruction of darkness, evil eye (drishti dosha), and household negativity.',
    kn: 'ವೈದಿಕ ಧರ್ಮದಲ್ಲಿ ಹಿಂಸಾತ್ಮಕ ಪಶು ಬಲಿಯ ಬದಲಿಗೆ ಸಾತ್ವಿಕವಾಗಿ ಬೂದುಕುಂಬಳಕಾಯಿ (ಕೂಷ್ಮಾಂಡ) ಬಲಿ ನೀಡಲಾಗುತ್ತದೆ. ಕುಂಬಳಕಾಯಿಯು ಮಾನವನ ಅಹಂಕಾರ, ತಮೋಗುಣ ಮತ್ತು ದರ್ಪದ ಸಂಕೇತ. ಇದನ್ನು ದೇವಿಯ ಮುಂದೆ ಕತ್ತರಿಸುವುದರಿಂದ ಮನೆಯ ಸುತ್ತಲಿನ ಸಕಲ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳು, ದೃಷ್ಟಿ ದೋಷಗಳು ಮತ್ತು ಸಂಕಷ್ಟಗಳು ನಿವಾರಣೆಯಾಗುತ್ತವೆ.',
    hi: 'वैदिक विधान में पशु बलि के स्थान पर सात्त्विक कूष्माण्ड (पेठा) बलि का विधान है। यह अहंकार एवं तमोगुण का प्रतीक है। इसे काटने से घर की समस्त नकारात्मक ऊर्जा और दृष्टिक्षति का शमन होता है।'
  },
  baliMantra: {
    sanskritText: 'बलिस्वरूप नमस्तुभ्यं सर्वकल्याणकारक । दुर्गाप्रीतिकरं तुभ्यं बलिं दास्यामि शान्तये ॥',
    kannadaText: 'ಬಲಿರೂಪ ನಮಸ್ತುಭ್ಯಂ ಸರ್ವಕಲ್ಯಾಣಕಾರಕ | ದುರ್ಗಾಪ್ರೀತಿಕರಂ ತುಭ್ಯಂ ಬಲಿಂ ದಾಸ್ಯಾಮಿ ಶಾಂತಯೇ ||',
    englishTransliteration: 'Bali-rupa Namastubhyam Sarva-kalyana-karaka | Durga-preeti-karam Tubhyam Balim Dasyami Shantaye ||',
    meaning: {
      en: 'O sacred offering, source of peace and universal welfare! I present this Satvik Bali to please Divine Mother Durga and dissolve all afflictions.',
      kn: 'ಎಲೈ ಸರ್ವ ಕಲ್ಯಾಣಕಾರಕವಾದ ಬಲಿರೂಪವೇ, ನಿನಗೆ ನಮಸ್ಕಾರ. ಶ್ರೀ ದುರ್ಗಾದೇವಿಯ ಪ್ರೀತಿಗಾಗಿ ಹಾಗೂ ಸಕಲ ಶಾಂತಿ-ನೆಮ್ಮದಿಗಾಗಿ ನಾನು ಈ ಸಾತ್ವಿಕ ಬಲಿಯನ್ನು ಸಮರ್ಪಿಸುತ್ತೇನೆ.',
      hi: 'हे सर्वकल्याणकारी पवित्र बलि स्वरूप! माँ दुर्गा की प्रसन्नता एवं घर में शान्ति हेतु मैं यह सात्त्विक बलि समर्पित करता हूँ।'
    }
  },
  stepByStepBaliVidhi: [
    {
      step: 1,
      title: { en: 'Purification & Surface Preparation', kn: 'ಶುದ್ಧೀಕರಣ & ಕುಂಬಳಕಾಯಿ ಸಿದ್ಧತೆ', hi: 'शुद्धिकरण एवं कूष्माण्ड सज्जा' },
      desc: {
        en: 'Wash the intact ash gourd with water and dry it. Apply three broad stripes of turmeric paste, sandalwood paste, and bold vermilion (kumkuma) dots around the middle circumference.',
        kn: 'ದೋಷವಿಲ್ಲದ ಬೂದು ಕುಂಬಳಕಾಯಿಯನ್ನು ತೊಳೆದು, ಒರೆಸಿ, ಅದರ ಸುತ್ತಲೂ ಅರಿಶಿನ, ಶ್ರೀಗಂಧದ ೩ ಪಟ್ಟೆಗಳು ಹಾಗೂ ಪ್ರಮುಖ ಕುಂಕುಮದ ಬೊಟ್ಟುಗಳನ್ನು ಇಡಿ.',
        hi: 'कूष्माण्ड को धोकर सुखाएं और उस पर हल्दी, चन्दन की तीन रेखाएं एवं कुंकुम के तिलक लगाएं।'
      }
    },
    {
      step: 2,
      title: { en: 'Holy Thread & Supari Consecration', kn: 'ಕಂಕಣ ಬಂಧನ & ಮಂಗಳ ದ್ರವ್ಯ ಜೋಡಣೆ', hi: 'कंकण एवं मंगल द्रव्य प्रतिष्ठा' },
      desc: {
        en: 'Wind a holy yellow/red thread (kankana / raksha sutra) around the middle axis. Place 5 or 9 split beetle nuts (supari) and auspicious coins touched with vermilion.',
        kn: 'ಕುಂಬಳಕಾಯಿಯ ಮಧ್ಯಭಾಗಕ್ಕೆ ಅರಿಶಿನದ ರಕ್ಷಾಸೂತ್ರ (ಕಂಕಣ) ಕಟ್ಟಿ, ೫ ಅಥವಾ ೯ ಅಡಿಕೆಗಳು ಮತ್ತು ನಾಣ್ಯಗಳನ್ನು ಕುಂಕುಮ ಸಹಿತ ಇರಿಸಿ.',
        hi: 'मध्य भाग में रक्षासूत्र बांधें और ५ अथवा ९ सुपारी एवं सिक्के कुंकुम लगाकर समर्पित करें।'
      }
    },
    {
      step: 3,
      title: { en: 'Sankalpa & Offering Mantra', kn: 'ಸಂಕಲ್ಪ & ಬಲಿ ಆವಾಹನಾ ಮಂತ್ರ', hi: 'संकल्प एवं बलि मन्त्र पाठ' },
      desc: {
        en: 'Place on a banana leaf or wooden plank outside the entrance threshold or before Durga altar. Light camphor, oil lamp, offer red flowers, and chant: "ಬಲಿರೂಪ ನಮಸ್ತುಭ್ಯಂ ಸರ್ವಕಲ್ಯಾಣಕಾರಕ..."',
        kn: 'ಮನೆಯ ಮುಖ್ಯ ಹೊಸ್ತಿಲ ಹೊರಗೆ ಬಾಳೆಎಲೆಯ ಮೇಲೆ ಕುಂಬಳಕಾಯಿಯನ್ನು ಇಟ್ಟು, ದೀಪ-ಧೂಪ ಬೆಳಗಿ "ಬಲಿರೂಪ ನಮಸ್ತುಭ್ಯಂ..." ಮಂತ್ರವನ್ನು ಭಕ್ತಿಯಿಂದ ಪಠಿಸಿ.',
        hi: 'मुख्य द्वार की देहरी पर केले के पत्ते पर रखकर दीप प्रज्वलित करें एवं बलि मन्त्र का उच्चारण करें।'
      }
    },
    {
      step: 4,
      title: { en: 'The Sacred Single-Stroke Cut (Bali Chedana)', kn: 'ಏಕಮುಖ ಛೇದನ (ಬಲಿ ಕೊಯ್ಯುವುದು)', hi: 'एक ही प्रहार में छेदन' },
      desc: {
        en: 'Using a dedicated sharp knife marked with kumkuma, cut the pumpkin into two clean equal halves across its center in a single smooth stroke.',
        kn: 'ಕುಂಕುಮ ಹಚ್ಚಿದ ಶುದ್ಧ ಚಾಕುವಿನಿಂದ ಒಂದೇ ನಯವಾದ ಕಟ್‌ನಲ್ಲಿ ಕುಂಬಳಕಾಯಿಯನ್ನು ಎರಡು ಸಮಭಾಗಗಳಾಗಿ ಸೀಳಿ (ಕೊಯ್ಯಿರಿ).',
        hi: 'कुंकुम लगे स्वच्छ खड्ग अथवा चाकू से कूष्माण्ड को एक ही झटके में दो बराबर भागों में काटें।'
      }
    },
    {
      step: 5,
      title: { en: 'Kumkuma Smearing & Threshold Placement', kn: 'ಕುಂಕುಮ ಲೇಪನ & ಹೊಸ್ತಿಲ ಇಕ್ಕೆಲಗಳಲ್ಲಿ ರಕ್ಷಣೆ', hi: 'रक्त वर्ण कुंकुम अर्पण एवं द्वार रक्षा' },
      desc: {
        en: 'Immediately smear fresh red vermilion (kumkuma) across the cut white surfaces, symbolizing Satvik red blood-sacrifice without animal harm. Place the two halves on either side of the entrance threshold.',
        kn: 'ಕೊಯ್ದ ಬಿಳಿ ಭಾಗಗಳಿಗೆ ತಕ್ಷಣವೇ ಕೆಂಪು ಕುಂಕುಮವನ್ನು ದಟ್ಟವಾಗಿ ಲೇಪಿಸಿ (ಸಾತ್ವಿಕ ರಕ್ತವರ್ಣದ ಸಂಕೇತ). ನಂತರ ಎರಡೂ ಭಾಗಗಳನ್ನು ಮನೆಯ ಮುಖ್ಯ ಬಾಗಿಲಿನ ಇಕ್ಕೆಲಗಳಲ್ಲಿ ಇರಿಸಿ.',
        hi: 'कटे हुए श्वेत भाग पर प्रचुर कुंकुम लगाएं और दोनों अर्धभागों को मुख्य द्वार के दोनों ओर स्थापित करें।'
      }
    }
  ]
};

// -------------------------------------------------------------
// 3. COMPLETE 10 DAYS RITUAL METADATA
// -------------------------------------------------------------
export const NAVARATRI_10_DAYS_RITUALS: Record<number, {
  dayNumber: number;
  festivalId: string;
  name: LocalizedString;
  deity: LocalizedString;
  tithiTitle: LocalizedString;
  defaultMuhurtaDesc: LocalizedString;
  samagriSummary: LocalizedString;
  significance: LocalizedString;
  dhyanaMantra: {
    sanskrit: string;
    kannada: string;
    english: string;
  };
  specialRituals: LocalizedString[];
}> = {
  1: {
    dayNumber: 1,
    festivalId: 'navaratri_day1',
    name: { en: 'Day 1: Kalasha Sthapana & Maa Shailaputri Puja', kn: 'ದಿನ ೧: ಕಲಶ ಸ್ಥಾಪನಾ & ಮಾತೆ ಶೈಲಪುತ್ರಿ ಪೂಜೆ', hi: 'दिवस १: कलश स्थापना एवं माँ शैलपुत्री पूजन' },
    deity: { en: 'Maa Shailaputri (Daughter of the Mountains)', kn: 'ಶ್ರೀ ಶೈಲಪುತ್ರಿ ದೇವಿ', hi: 'माँ शैलपुत्री' },
    tithiTitle: { en: 'Ashwina Shukla Pratipada (Padya)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಪಾಡ್ಯ', hi: 'आश्विन शुक्ल प्रतिपदा' },
    defaultMuhurtaDesc: {
      en: 'Abhijit Muhurta (11:45 AM - 12:35 PM) & Morning Shubh (06:12 AM - 08:45 AM)',
      kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಮಧ್ಯಾಹ್ನ ೧೧:೪೫ - ೧೨:೩೫) ಮತ್ತು ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ (೦೬:೧೨ - ೦೮:೪೫)',
      hi: 'अभिजित मुहूर्त (दोपहर ११:४५ - १२:३५) एवं प्रातः शुभ वेला'
    },
    samagriSummary: {
      en: 'Copper/brass pot, 5 mango leaves, unbroken coconut, rice peetha, water, turmeric, kumkuma, coin, supari.',
      kn: 'ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಚೊಂಬು, ೫ ಮಾವಿನೆಲೆ, ಜುಟ್ಟು ಇರುವ ತೆಂಗಿನಕಾಯಿ, ಅಕ್ಕಿ ಪೀಠ, ತೀರ್ಥ, ಅರಿಶಿನ, ಕುಂಕುಮ, ನಾಣ್ಯ, ಅಡಿಕೆ.',
      hi: 'ताम्र कलश, ५ आम्र पल्लव, नारियल, अक्षत, सुपारी, सिक्का, गंगाजल।'
    },
    significance: {
      en: 'Invoking the universal mother and cosmic waters into the Kalasha. Symbolizes stable spiritual foundation and health.',
      kn: 'ಸಕಲ ಬ್ರಹ್ಮಾಂಡದ ಸಂಕೇತವಾದ ಕಲಶದಲ್ಲಿ ಸಪ್ತ ನದಿಗಳು ಹಾಗೂ ಜಗನ್ಮಾತೆಯನ್ನು ಆವಾಹಿಸಿ ೯ ದಿನಗಳ ನವರಾತ್ರಿ ವ್ರತಕ್ಕೆ ಮಂಗಳ ನಾಂದಿ ಹಾಡುವುದು.',
      hi: 'ब्रह्माण्ड के प्रतीक कलश में भगवती एवं सप्त नदियों की प्राण-प्रतिष्ठा।'
    },
    dhyanaMantra: {
      sanskrit: 'वन्दे वाञ्छितलाभाय चन्द्रार्धकृतशेखराम् । वृषारूढां शूलधरां शैलपुत्रीं यशस्विनीम् ॥',
      kannada: 'ವಂದೇ ವಾಂಛಿತಲಾಭಾಯ ಚಂದ್ರಾರ್ಧಕೃತಶೇಖರಾಮ್ | ವೃಷಾರೂಢಾಂ ಶೂಲಧರಾಂ ಶೈಲಪುತ್ರೀಂ ಯಶಸ್ವಿನೀಮ್ ||',
      english: 'Vande Vanchhitalabhaya Chandrardhakritashekharam | Vrisharudham Shuladharam Shailaputrim Yashasvineem ||'
    },
    specialRituals: [
      { en: 'Prepare Ishanya / East altar, rangoli, wooden plank, rice bed (Dhanya Peetha)', kn: 'ಈಶಾನ್ಯ ಅಥವಾ ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ಮಣೆ, ರಂಗೋಲಿ, ಅಕ್ಕಿ ಪೀಠ ಸಿದ್ಧತೆ', hi: 'ईशान/पूर्व दिशा में अक्षत वेदी निर्माण' },
      { en: 'Chant River Invocation: Gange Cha Yamune Chaiva Godavari Saraswati...', kn: 'ಸಪ್ತ ನದಿಗಳ ಪ್ರಾರ್ಥನೆ: "ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ..."', hi: 'सप्त नदी आह्वान मन्त्र' },
      { en: 'Light Akhanda Deepa (perennial ghee lamp) to burn steadily for 9 nights', kn: '೯ ದಿನಗಳ ಕಾಲ ಬೆಳಗುವಂತೆ ಅಖಂಡ ತುಪ್ಪದ ದೀಪ ಪ್ರಜ್ವಲನೆ', hi: 'अखण्ड ज्योति प्रज्वलन' }
    ]
  },
  2: {
    dayNumber: 2,
    festivalId: 'navaratri_day2',
    name: { en: 'Day 2: Maa Brahmacharini Puja (Austerity & Penance)', kn: 'ದಿನ ೨: ಶ್ರೀ ಬ್ರಹ್ಮಚಾರಿಣಿ ದೇವಿ ಪೂಜೆ (ತಪಸ್ಸು & ಏಕಾಗ್ರತೆ)', hi: 'दिवस २: माँ ब्रह्मचारिणी पूजन' },
    deity: { en: 'Maa Brahmacharini (The Ascetic Goddess)', kn: 'ಶ್ರೀ ಬ್ರಹ್ಮಚಾರಿಣಿ ದೇವಿ', hi: 'माँ ब्रह्मचारिणी' },
    tithiTitle: { en: 'Ashwina Shukla Dvitiya (Bidigi)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಬಿದಿಗೆ', hi: 'आश्विन शुक्ल द्वितीया' },
    defaultMuhurtaDesc: {
      en: 'Morning Amrit Kaal (08:30 AM - 10:15 AM) & Evening Sandhya',
      kn: 'ಬೆಳಗಿನ ಅಮೃತ ಕಾಲ (೦೮:೩೦ - ೧೦:೧೫) ಹಾಗೂ ಸಂಧ್ಯಾ ಕಾಲ',
      hi: 'प्रातः अमृत वेला एवं सांध्यकाल'
    },
    samagriSummary: {
      en: 'Panchamrita, Sugar (Mishri), white flowers, camphor, white sandalwood.',
      kn: 'ಪಂಚಾಮೃತ, ಕಲ್ಲುಸಕ್ಕರೆ (ಮಿಶ್ರಿ), ಬಿಳಿ ಪುಷ್ಪಗಳು, ಕರ್ಪೂರ, ಶ್ವೇತ ಗಂಧ.',
      hi: 'पंचामृत, मिश्री, श्वेत पुष्प एवं चन्दन।'
    },
    significance: {
      en: 'Teaches mental mastery, single-pointed dedication, self-control, and moral purity.',
      kn: 'ಕಠಿಣ ತಪಸ್ಸು, ಇಂದ್ರಿಯ ನಿಗ್ರಹ, ಜ್ಞಾನಾರ್ಜನೆ ಮತ್ತು ಸಂಕಲ್ಪ ಬಲವನ್ನು ಕರುಣಿಸುವ ದೇವತೆ.',
      hi: 'तप, त्याग, वैराग्य, सदाचार एवं संयम की अधिष्ठात्री।'
    },
    dhyanaMantra: {
      sanskrit: 'दधाना करपद्माभ्यामक्षमालाकमण्डलू । देवी प्रसीदतु मयि ब्रह्मचारिण्यनुत्तमा ॥',
      kannada: 'ದಧಾನಾ ಕರಪದ್ಮಾಭ್ಯಾಮಕ್ಷಮಾಲಾ ಕಮಂಡಲೂ | ದೇವೀ ಪ್ರಸೀದತು ಮಯಿ ಬ್ರಹ್ಮಚಾರಿಣ್ಯನುತ್ತಮಾ ||',
      english: 'Dadhana Karapadmabhyam Akshamala Kamandalu | Devi Praseedatu Mayi Brahmacharinyanuttama ||'
    },
    specialRituals: [
      { en: 'Offer sugar, fruits, and panchamrita naivedya', kn: 'ಕಲ್ಲುಸಕ್ಕರೆ ಮತ್ತು ಪಂಚಾಮೃತ ನೈವೇದ್ಯ ಸಮರ್ಪಣೆ', hi: 'मिश्री व पंचामृत का भोग' },
      { en: 'Recite Brahmacharini Stotram for academic and meditative focus', kn: 'ವಿದ್ಯಾಭ್ಯಾಸ ಮತ್ತು ಏಕಾಗ್ರತೆಗಾಗಿ ಬ್ರಹ್ಮಚಾರಿಣಿ ಸ್ತೋತ್ರ ಪಠಣ', hi: 'विद्या व एकाग्रता हेतु मन्त्र जप' }
    ]
  },
  3: {
    dayNumber: 3,
    festivalId: 'navaratri_day3',
    name: { en: 'Day 3: Maa Chandraghanta Puja (Valour & Grace)', kn: 'ದಿನ ೩: ಶ್ರೀ ಚಂದ್ರಘಂಟಾ ದೇವಿ ಪೂಜೆ (ಶೌರ್ಯ & ಶಾಂತಿ)', hi: 'दिवस ३: माँ चन्द्रघण्टा पूजन' },
    deity: { en: 'Maa Chandraghanta (Crescent Bell Adorned)', kn: 'ಶ್ರೀ ಚಂದ್ರಘಂಟಾ ದೇವಿ', hi: 'माँ चन्द्रघण्टा' },
    tithiTitle: { en: 'Ashwina Shukla Tritiya (Tadige)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ತದಿಗೆ', hi: 'आश्विन शुक्ल तृतीया' },
    defaultMuhurtaDesc: {
      en: 'Morning Shubha Window (07:15 AM - 09:30 AM)',
      kn: 'ಬೆಳಗಿನ ಶುಭ ಮುಹೂರ್ತ (೦೭:೧೫ - ೦೯:೩೦)',
      hi: 'प्रातः शुभ वेला'
    },
    samagriSummary: {
      en: 'Milk kheer, honey, red hibiscus, brass bells, aromatic dhoop.',
      kn: 'ಹಾಲಿನ ಪಾಯಸ, ಜೇನುತುಪ್ಪ, ಕೆಂಪು ದಾಸವಾಳ ಹೂವುಗಳು, ಘಂಟಾನಾದ.',
      hi: 'दूध की खीर, शहद, लाल पुष्प एवं घण्टा वादन।'
    },
    significance: {
      en: 'The crescent bell chime dispels all fear, negative thoughts, ghosts, and demonic energies.',
      kn: 'ಮಸ್ತಕದ ಅರ್ಧಚಂದ್ರನ ಘಂಟಾನಾದವು ದುಷ್ಟ ಶಕ್ತಿಗಳು, ಭಯ ಮತ್ತು ಮಾನಸಿಕ ದುಗುಡಗಳನ್ನು ದೂರೀಕರಿಸುತ್ತದೆ.',
      hi: 'मस्तक पर घण्टाकार अर्धचन्द्र समस्त भयों का नाश करता है।'
    },
    dhyanaMantra: {
      sanskrit: 'पिण्डजप्रवरारूढा चण्डकोपास्त्रकैर्युता । प्रसादं तनुते मह्यं चन्द्रघण्टेति विश्रुता ॥',
      kannada: 'ಪಿಂಡಜಪ್ರವರಾರೂಢಾ ಚಂಡಕೋಪಾಸ್ತ್ರಕೈರ್ಯುತಾ | ಪ್ರಸಾದಂ ತನುತೇ ಮಹ್ಯಂ ಚಂದ್ರಘಂಟೇತಿ ವಿಶ್ರುತಾ ||',
      english: 'Pindajapravararudha Chandakopastrakairyuta | Prasadam Tanute Mahyam Chandraghanteti Vishruta ||'
    },
    specialRituals: [
      { en: 'Ring sacred bell (Ghanta) during aarti to cleanse psychic atmosphere', kn: 'ಆರತಿಯ ಸಮಯದಲ್ಲಿ ಶ್ರದ್ಧೆಯಿಂದ ಘಂಟಾನಾದ ಮಾಡಿ ಪರಿಸರ ಶುದ್ಧೀಕರಿಸುವುದು', hi: 'आरती में घण्टा वादन' },
      { en: 'Offer milk-based sweets for emotional courage and calm', kn: 'ಹಾಲಿನ ಪಾಯಸ ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ ಧೈರ್ಯ ಪ್ರಾರ್ಥಿಸುವುದು', hi: 'खीर का नैवेद्य' }
    ]
  },
  4: {
    dayNumber: 4,
    festivalId: 'navaratri_day4',
    name: { en: 'Day 4: Maa Kushmanda Puja (Cosmic Creator)', kn: 'ದಿನ ೪: ಶ್ರೀ ಕೂಷ್ಮಾಂಡಾ ದೇವಿ ಪೂಜೆ (ಬ್ರಹ್ಮಾಂಡ ಸೃಷ್ಟಿಕರ್ತೆ)', hi: 'दिवस ४: माँ कूष्माण्डा पूजन' },
    deity: { en: 'Maa Kushmanda (Cosmic Egg Creator)', kn: 'ಶ್ರೀ ಕೂಷ್ಮಾಂಡಾ ದೇವಿ', hi: 'माँ कूष्माण्डा' },
    tithiTitle: { en: 'Ashwina Shukla Chaturthi (Chouti)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಚೌತಿ', hi: 'आश्विन शुक्ल चतुर्थी' },
    defaultMuhurtaDesc: {
      en: 'Brahma Muhurta & Morning Shubh (06:30 AM - 09:00 AM)',
      kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ ಹಾಗೂ ಪ್ರಾತಃ ಶುಭ ಕಾಲ (೦೬:೩೦ - ೦೯:೦೦)',
      hi: 'ब्रह्म मुहूर्त एवं प्रातः शुभ काल'
    },
    samagriSummary: {
      en: 'Malpua, winter melon (Ash gourd) sweets, dry fruits, green cardamom.',
      kn: 'ಮಾಲ್ಪುವಾ, ಬೂದುಕುಂಬಳಕಾಯಿ ಸಿಹಿ (ಆಗ್ರಾದ ಪೇಠಾ), ಒಣಹಣ್ಣುಗಳು, ಏಲಕ್ಕಿ.',
      hi: 'मालपुआ, पेठा मिठाई एवं सूखे मेवे।'
    },
    significance: {
      en: 'Her divine smile produced the cosmic egg (Anda) of creation. Brings vitality, good vision, and health.',
      kn: 'ತನ್ನ ಮುಗುಳುನಗೆಯಿಂದ ಇಡೀ ಬ್ರಹ್ಮಾಂಡವನ್ನು ಸೃಷ್ಟಿಸಿದ ಆದಿಶಕ್ತಿ; ಆಯುಷ್ಯ, ಯಶಸ್ಸು ಮತ್ತು ದೃಷ್ಟಿ ತೇಜಸ್ಸು ನೀಡುವವಳು.',
      hi: 'मन्द मुस्कान से ब्रह्माण्ड की रचना करने वाली पराशक्ति।'
    },
    dhyanaMantra: {
      sanskrit: 'सुरासम्पूर्णकलशं रुधिराप्लुतमेव च । दधाना हस्तपद्माभ्यां कूष्माण्डा शुभदास्तु मे ॥',
      kannada: 'ಸುರಾಸಂಪೂರ್ಣಕಲಶಂ ರುಧಿರಪ್ಲುತಮೇವ ಚ | ದಧಾನಾ ಹಸ್ತಪದ್ಮಾಭ್ಯಾಂ ಕೂಷ್ಮಾಂಡಾ ಶುಭದಾಸ್ತು ಮೇ ||',
      english: 'Surasampurnakalasham Rudhiraplutameva Cha | Dadhana Hastapadmabhyam Kushmanda Shubhadastu Me ||'
    },
    specialRituals: [
      { en: 'Offer Malpua and ash gourd sweets (Petha)', kn: 'ಮಾಲ್ಪುವಾ ಮತ್ತು ಬೂದುಕುಂಬಳ ಸಿಹಿ ನೈವೇದ್ಯ', hi: 'मालपुए का नैवेद्य' },
      { en: 'Meditate on the Anahata Chakra for solar cosmic health', kn: 'ಅನಾಹತ ಚಕ್ರ ಧ್ಯಾನ ಹಾಗೂ ಆರೋಗ್ಯ ವೃದ್ಧಿ ಪ್ರಾರ್ಥನೆ', hi: 'अनाहत चक्र पर ध्यान' }
    ]
  },
  5: {
    dayNumber: 5,
    festivalId: 'navaratri_day5',
    name: { en: 'Day 5: Maa Skandamata Puja (Mother of Kartikeya)', kn: 'ದಿನ ೫: ಶ್ರೀ ಸ್ಕಂದಮಾತಾ ದೇವಿ ಪೂಜೆ (ವಾತ್ಸಲ್ಯ & ಮೋಕ್ಷ)', hi: 'दिवस ५: माँ स्कन्दमाता पूजन' },
    deity: { en: 'Maa Skandamata (Mother of Lord Subrahmanya / Skanda)', kn: 'ಶ್ರೀ ಸ್ಕಂದಮಾತಾ ದೇವಿ', hi: 'माँ स्कन्दमाता' },
    tithiTitle: { en: 'Ashwina Shukla Panchami', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಪಂಚಮಿ', hi: 'आश्विन शुक्ल पञ्चमी' },
    defaultMuhurtaDesc: {
      en: 'Morning Abhijit & Shubh Windows',
      kn: 'ಪ್ರಾತಃಕಾಲ & ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ',
      hi: 'प्रातः एवं अभिजित वेला'
    },
    samagriSummary: {
      en: 'Ripe bananas, banana kheer, yellow flowers, saffron chandan.',
      kn: 'ಬಲಿತ ಬಾಳೆಹಣ್ಣು, ಬಾಳೆಹಣ್ಣಿನ ಪಾಯಸ, ಹಳದಿ ಹೂವುಗಳು, ಕೇಸರಿ ಗಂಧ.',
      hi: 'पका केला, केले की खीर एवं पीले पुष्प।'
    },
    significance: {
      en: 'Holding infant Skanda in Her lap, She blesses childless couples, protects children, and grants supreme wisdom.',
      kn: 'ಮಡಿಲಲ್ಲಿ ಬಾಲ ಷಣ್ಮುಖನನ್ನು ಹೊತ್ತ ವಾತ್ಸಲ್ಯಮಯಿ ತಾಯಿ; ಸಂತಾನ ಸೌಭಾಗ್ಯ ಮತ್ತು ಕೌಟುಂಬಿಕ ರಕ್ಷಣೆ ನೀಡುತ್ತಾಳೆ.',
      hi: 'गोद में बाल स्कन्द को धारण करने वाली ममतामयी माता; सन्तान सुख प्रदाता।'
    },
    dhyanaMantra: {
      sanskrit: 'सिंहासनगता नित्यं पद्माश्रितकरद्वया । शुभदास्तु सदा देवी स्कन्दमाता यशस्विनी ॥',
      kannada: 'ಸಿಂಹಾಸನಗತಾ ನಿತ್ಯಂ ಪದ್ಮಾಶ್ರಿತಕರದ್ವಯಾ | ಶುಭದಾಸ್ತು ಸದಾ ದೇವೀ ಸ್ಕಂದಮಾತಾ ಯಶಸ್ವಿನೀ ||',
      english: 'Simhasanagata Nityam Padmashritakaradvaya | Shubhadastu Sada Devi Skandamata Yashasvini ||'
    },
    specialRituals: [
      { en: 'Worship Mother and Child together for children prosperity', kn: 'ಮಕ್ಕಳ ಶ್ರೇಯಸ್ಸಿಗಾಗಿ ಸ್ಕಂದ-ಮಾತೆಯರನ್ನು ಒಟ್ಟಾಗಿ ಆರಾಧಿಸುವುದು', hi: 'सन्तान रक्षा हेतु विशेष पूजन' },
      { en: 'Offer banana and yellow sweets', kn: 'ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಹಳದಿ ಬಣ್ಣದ ಸಿಹಿ ಸಮರ್ಪಣೆ', hi: 'केले का भोग' }
    ]
  },
  6: {
    dayNumber: 6,
    festivalId: 'navaratri_day6',
    name: { en: 'Day 6: Maa Katyayani Puja (Warrior Slaver of Mahishasura)', kn: 'ದಿನ ೬: ಶ್ರೀ ಕಾತ್ಯಾಯನೀ ದೇವಿ ಪೂಜೆ (ಶತ್ರುಜಯ & ಸೌಭಾಗ್ಯ)', hi: 'दिवस ६: माँ कात्यायनी पूजन' },
    deity: { en: 'Maa Katyayani (Sage Katyayana\'s Daughter)', kn: 'ಶ್ರೀ ಕಾತ್ಯಾಯನೀ ದೇವಿ', hi: 'माँ कात्यायनी' },
    tithiTitle: { en: 'Ashwina Shukla Shashthi', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಷಷ್ಠಿ', hi: 'आश्विन शुक्ल षष्ठी' },
    defaultMuhurtaDesc: {
      en: 'Morning Sunrise & Evening Godhuli Muhurta',
      kn: 'ಸೂರ್ಯೋದಯ ಕಾಲ ಮತ್ತು ಸಾಯಂಕಾಲದ ಗೋಧೂಳಿ ಮುಹೂರ್ತ',
      hi: 'सूर्योदय एवं गोधूलि मुहूर्त'
    },
    samagriSummary: {
      en: 'Pure honey (ಜೇನುತುಪ್ಪ), red pomegranate, red silk, fragrant ittar.',
      kn: 'ಶುದ್ಧ ಜೇನುತುಪ್ಪ, ಕೆಂಪು ದಾಳಿಂಬೆ ಹಣ್ಣು, ಕೆಂಪು ವಸ್ತ್ರ, ಸುಗಂಧ ಅತ್ತರು.',
      hi: 'शुद्ध शहद, अनार एवं लाल पुष्प।'
    },
    significance: {
      en: 'Removes marital delay, resolves Manglik afflictions, and bestows handsome/auspicious spouses and professional victory.',
      kn: 'ವಿವಾಹ ಸಂಬಂಧಿ ಅಡೆತಡೆಗಳು, ಕುಜ ದೋಷಗಳನ್ನು ನಿವಾರಿಸಿ ಸಕಾಲಿಕ ಕಲ್ಯಾಣ ಮತ್ತು ಧೈರ್ಯ ಕರುಣಿಸುವ ದೇವತೆ.',
      hi: 'शीघ्र विवाह एवं मांगलिक दोष निवारक परम कल्याणी स्वरूप।'
    },
    dhyanaMantra: {
      sanskrit: 'चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना । कात्यायनी शुभं दद्याद् देवी दानवघातिनी ॥',
      kannada: 'ಚಂದ್ರಹಾಸೋಜ್ಜ್ವಲಕರಾ ಶಾರ್ದೂಲವರವಾಹನಾ | ಕಾತ್ಯಾಯನೀ ಶುಭಂ ದದ್ಯಾದ್ ದೇವೀ ದಾನವಘಾತಿನೀ ||',
      english: 'Chandrahasojjvalakara Shardulavaravahana | Katyayani Shubham Dadyad Devi Danavaghatini ||'
    },
    specialRituals: [
      { en: 'Offer pure forest honey in silver or bronze bowl', kn: 'ಶುದ್ಧ ಜೇನುತುಪ್ಪವನ್ನು ನೈವೇದ್ಯವಾಗಿ ಅರ್ಪಿಸಿ ಪ್ರಾರ್ಥಿಸುವುದು', hi: 'शहद का नैवेद्य' },
      { en: 'Chant Katyayani Mantra for marriage hurdles removal', kn: 'ವಿವಾಹ ಸಿದ್ಧಿಗಾಗಿ ಕಾತ್ಯಾಯನೀ ಮಹಾಮಂತ್ರ ಜಪ', hi: 'विवाह बाधा निवारण मन्त्र' }
    ]
  },
  7: {
    dayNumber: 7,
    festivalId: 'navaratri_day7',
    name: { en: 'Day 7: Maa Kalaratri Puja (Subduer of Ignorance)', kn: 'ದಿನ ೭: ಶ್ರೀ ಕಾಳರಾತ್ರಿ ದೇವಿ ಪೂಜೆ (ಅಂಧಕಾರ ನಾಶಿನಿ)', hi: 'दिवस ७: माँ कालरात्रि पूजन' },
    deity: { en: 'Maa Kalaratri (The Fierce Night Form)', kn: 'ಶ್ರೀ ಕಾಳರಾತ್ರಿ ದೇವಿ', hi: 'माँ कालरात्रि' },
    tithiTitle: { en: 'Ashwina Shukla Saptami', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಸಪ್ತಮಿ', hi: 'आश्विन शुक्ल सप्तमी' },
    defaultMuhurtaDesc: {
      en: 'Nishita Kala (Midnight Window) & Evening Pradosha',
      kn: 'ನಿಶೀಥ ಕಾಲ (ಮಧ್ಯರಾತ್ರಿ) ಹಾಗೂ ಪ್ರದೋಷ ಕಾಲ',
      hi: 'निशीथ काल (मध्यरात्रि) एवं प्रदोष'
    },
    samagriSummary: {
      en: 'Jaggery (ಬೆಲ್ಲ), sesame laddu, black mustard seeds, night blooming jasmine.',
      kn: 'ಸಾವಯವ ಬೆಲ್ಲ, ಕಪ್ಪು ಎಳ್ಳುಂಡೆ, ಸಾಸಿವೆ, ಸುಗಂಧರಾಜ ಹೂವುಗಳು.',
      hi: 'गुड़, तिल के लड्डू, राई एवं रात्रि पुष्प।'
    },
    significance: {
      en: 'Though fearsome in appearance, She is Shubhankari (auspicious), instantly severing ghosts, evil spirits, and Rahu/Saturn doshas.',
      kn: 'ನೋಡಲು ಭಯಂಕರವಾಗಿದ್ದರೂ ಭಕ್ತರಿಗೆ ಸದಾ ಶುಭವನ್ನುಂಟು ಮಾಡುವ "ಶುಭಂಕರಿ"; ಶನಿ-ರಾಹು ಬಾಧೆ, ದುಷ್ಟ ಗ್ರಹ ದೋಷಗಳನ್ನು ಸುಟ್ಟು ಭಸ್ಮ ಮಾಡುತ್ತಾಳೆ.',
      hi: 'दुष्टों का संहार करने वाली किन्तु भक्तों पर सदैव शुभ फल बरसाने वाली शुभंकरी।'
    },
    dhyanaMantra: {
      sanskrit: 'एकवेणी जपाकर्णपूरा नग्ना खरास्थिता । लम्बोष्ठी कर्णिकाकर्णी तैलाभ्यक्तशरीरिणी ॥',
      kannada: 'ಏಕವೇಣೀ ಜಪಾಕರ್ಣಪೂರಾ ನಗ್ನಾಖರಸ್ಥಿತಾ | ಲಂಬೋಷ್ಠೀ ಕರ್ಣಿಕಾಕರ್ಣೀ ತೈಲಾಭ್ಯಕ್ತಶರೀರಿಣೀ ||',
      english: 'Ekaveni Japakarnapura Nagnakharasthita | Lamboshthi Karnikakarni Tailabhyaktasharirini ||'
    },
    specialRituals: [
      { en: 'Offer pure jaggery and sesame sweets to dissolve karmic debts', kn: 'ಕರ್ಮ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಬೆಲ್ಲ ಮತ್ತು ಕಪ್ಪು ಎಳ್ಳು ನೈವೇದ್ಯ', hi: 'गुड़ का नैवेद्य' },
      { en: 'Recite Devi Kavacha and Kilakam for total psychic protection', kn: 'ರಕ್ಷಣೆಗಾಗಿ ಶ್ರೀ ದೇವಿ ಕವಚ ಪಾರಾಯಣ', hi: 'देवी कवच पाठ' }
    ]
  },
  8: {
    dayNumber: 8,
    festivalId: 'navaratri_day8',
    name: { en: 'Day 8: Maha Ashtami • Maa Mahagauri & Kushmanda Bali', kn: 'ದಿನ ೮: ಮಹಾಷ್ಟಮಿ • ಶ್ರೀ ಮಹಾಗೌರಿ ಪೂಜೆ & ಕೂಷ್ಮಾಂಡ (ಕುಂಬಳಕಾಯಿ) ಬಲಿ', hi: 'दिवस ८: महाष्टमी • माँ महागौरी पूजन एवं कूष्माण्ड सात्त्विक बलि' },
    deity: { en: 'Maa Mahagauri (Pristine Radiant Mother)', kn: 'ಶ್ರೀ ಮಹಾಗೌರಿ ದೇವಿ', hi: 'माँ महागौरी' },
    tithiTitle: { en: 'Ashwina Shukla Ashtami (Durgashtami)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಅಷ್ಟಮಿ (ದುರ್ಗಾಷ್ಟಮಿ)', hi: 'आश्विन शुक्ल अष्टमी (दुर्गाष्टमी)' },
    defaultMuhurtaDesc: {
      en: 'Sandhi Puja Window (48 mins: Ashtami end to Navami start) & Pradosha Kala (Sunset)',
      kn: 'ಸಂಧಿ ಪೂಜಾ ಕಾಲ (೪೮ ನಿಮಿಷಗಳು: ಅಷ್ಟಮಿ ಅಂತ್ಯ & ನವಮಿ ಆರಂಭ) ಮತ್ತು ಪ್ರದೋಷ ಕಾಲ',
      hi: 'सन्धि पूजा काल (४८ मिनट) एवं प्रदोष वेला'
    },
    samagriSummary: {
      en: 'White ash gourd (Kushmanda), Halwa, Puri, Chana, coconut, turmeric, kumkuma, kankana, 9 supari, sharp knife.',
      kn: 'ಬೂದು ಕುಂಬಳಕಾಯಿ, ಸಜ್ಜಿಗೆ ಹಲ್ವಾ, ಕಡಲೆ ಕಾಳು, ಪೂರಿ, ತೆಂಗಿನಕಾಯಿ, ಅರಿಶಿನ-ಕುಂಕುಮ, ಕಂಕಣ, ೯ ಅಡಿಕೆ, ಚಾಕು.',
      hi: 'कूष्माण्ड (पेठा), हलवा-चना-पूरी, नारियल, हल्दी, कुंकुम, रक्षासूत्र, ९ सुपारी।'
    },
    significance: {
      en: 'Purification of all past sins. Performance of Sandhi Puja and Kushmanda Bali to dissolve household ego and drishti dosha.',
      kn: 'ಪೂರ್ವಜನ್ಮದ ಪಾಪಗಳ ಭಸ್ಮೀಕರಣ; ಸಂಧಿ ಪೂಜೆ ಹಾಗೂ ಕೂಷ್ಮಾಂಡ ಬಲಿ ನೀಡಿ ಮನೆಯ ಸಮಸ್ತ ಅಹಂಕಾರ ಮತ್ತು ದೃಷ್ಟಿದೋಷಗಳನ್ನು ಸಂಹರಿಸುವುದು.',
      hi: 'समस्त पापों का प्रक्षालन; सन्धि पूजा एवं सात्त्विक पेठा बलि द्वारा आसुरी शक्तियों का नाश।'
    },
    dhyanaMantra: {
      sanskrit: 'श्वेते वृषे समारूढा श्वेताम्बरधरा शुचिः । महागौरी शुभं दद्यान्महादेवप्रमोददा ॥',
      kannada: 'ಶ್ವೇತೇ ವೃಷೇಸಮಾರೂಢಾ ಶ್ವೇತಾಂಬರಧರಾ ಶುಚಿಃ | ಮಹಾಗೌರೀ ಶುಭಂ ದದ್ಯೋನ್ಮಹಾದೇವಪ್ರಮೋದದಾ ||',
      english: 'Shwete Vrishesamarudha Shwetambaradhara Shuchih | Mahagauri Shubham Dadyan Mahadevapramodada ||'
    },
    specialRituals: [
      { en: 'Kanya Puja: Washing feet and feeding 9 young girls symbolizing Navadurga', kn: 'ಕನ್ಯಾ ಪೂಜೆ: ೯ ಜನ ಪುಟ್ಟ ಬಾಲಕಿಯರಿಗೆ ಪಾದಪೂಜೆ ಮಾಡಿ ಭೋಜನ-ಉಡುಗೊರೆ ಸಮರ್ಪಣೆ', hi: 'कन्या पूजन' },
      { en: 'Sandhi Puja: Perform 48-minute Sandhi ritual with 108 lotus/red flowers and lamps', kn: 'ಸಂಧಿ ಪೂಜೆ: ೪೮ ನಿಮಿಷಗಳ ಕಾಲ ೧೦೮ ದೀಪ ಹಾಗೂ ಪುಷ್ಪಗಳಿಂದ ಮಹಾಪೂಜೆ', hi: '१०८ दीपों से सन्धि पूजा' },
      { en: 'Kushmanda Bali: Slice vermilion-anointed white pumpkin across threshold with Bali Mantra', kn: 'ಕೂಷ್ಮಾಂಡ ಬಲಿ: ಮಂತ್ರಪೂರ್ವಕವಾಗಿ ಕುಂಬಳಕಾಯಿಯನ್ನು ಸೀಳಿ ಹೊಸ್ತಿಲ ಇಕ್ಕೆಲಗಳಲ್ಲಿ ಇಡುವುದು', hi: 'कूष्माण्ड बलि छेदन' }
    ]
  },
  9: {
    dayNumber: 9,
    festivalId: 'navaratri_day9',
    name: { en: 'Day 9: Maha Navami • Maa Siddhidatri, Ayudha & Saraswati Puja', kn: 'ದಿನ ೯: ಮಹಾನವಮಿ • ಶ್ರೀ ಸಿದ್ಧಿದಾತ್ರಿ, ಆಯುಧ ಪೂಜೆ & ಮಹಾಸರಸ್ವತಿ ಪೂಜೆ', hi: 'दिवस ९: महानवमी • माँ सिद्धिदात्री, आयुध एवं सरस्वती पूजन' },
    deity: { en: 'Maa Siddhidatri (Bestower of All 18 Siddhis)', kn: 'ಶ್ರೀ ಸಿದ್ಧಿದಾತ್ರಿ ದೇವಿ', hi: 'माँ सिद्धिदात्री' },
    tithiTitle: { en: 'Ashwina Shukla Navami (Mahanavami)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ನವಮಿ', hi: 'आश्विन शुक्ल नवमी' },
    defaultMuhurtaDesc: {
      en: 'Ayudha Puja Muhurta: Morning Shubh (06:15 AM - 08:45 AM) & Abhijit (11:45 AM - 12:35 PM)',
      kn: 'ಆಯುಧ ಪೂಜಾ ಮುಹೂರ್ತ: ಪ್ರಾತಃಕಾಲ (೦೬:೧೫ - ೦೮:೪೫) ಹಾಗೂ ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಕಾಲ (೧೧:೪೫ - ೧೨:೩೫)',
      hi: 'आयुध पूजा मुहूर्त: प्रातः शुभ काल एवं दोपहर अभिजित'
    },
    samagriSummary: {
      en: 'Sandalwood paste, kumkuma, flower garlands, lemons, puffed rice (Kadle Puri), jaggery, work tools, books, vehicle keys.',
      kn: 'ಶ್ರೀಗಂಧ, ಕುಂಕುಮ, ಹೂವಿನ ಹಾರಗಳು, ನಿಂಬೆಹಣ್ಣು, ಕಡಲೆಪುರಿ, ಬೆಲ್ಲ, ಕೆಲಸದ ಉಪಕರಣಗಳು, ವಾಹನಗಳು, ಪುಸ್ತಕಗಳು.',
      hi: 'चन्दन, रोली, पुष्पमाला, नींबू, खील-बताशे, वाहन, यन्त्र एवं पुस्तकें।'
    },
    significance: {
      en: 'Consecration of all instruments of livelihood, craft, study, and defense. Lord Shiva attained all siddhis from Siddhidatri.',
      kn: 'ಜೀವನೋಪಾಯಕ್ಕೆ ಬಳಸುವ ವಾಹನಗಳು, ಯಂತ್ರಗಳು, ಲೇಖನಿ ಹಾಗೂ ಪರಿಕರಗಳನ್ನು ದೈವಿಕ ಶಕ್ತಿಯ ಸಂಕೇತವೆಂದು ಭಾವಿಸಿ ಪೂಜಿಸುವುದು.',
      hi: 'आजीविका के समस्त उपकरणों, वाहनों एवं ग्रन्थों का पूजन; समस्त सिद्धियों की प्राप्ति।'
    },
    dhyanaMantra: {
      sanskrit: 'सिद्धगन्धर्वयक्षाद्यैरसुरैरमरैरपि । सेव्यमाना सदा भूयात् सिद्धिदा सिद्धिदायिनी ॥',
      kannada: 'ಸಿದ್ಧಗಂಧರ್ವಯಕ್ಷಾದ್ಯೈರಸುರೈರಮರೈರಪಿ | ಸೇವ್ಯಮಾನಾ ಸದಾ ಭೂಯಾತ್ ಸಿದ್ಧಿದಾ ಸಿದ್ಧಿದಾಯಿನೀ ||',
      english: 'Siddhagandharvayakshadyairasurairamarairapi | Sevyamana Sada Bhuyat Siddhida Siddhidayini ||'
    },
    specialRituals: [
      { en: 'Ayudha Puja: Wash and decorate vehicles, tools, laptops with sandalwood, kumkuma, and lemons', kn: 'ಆಯುಧ ಪೂಜೆ: ವಾಹನ, ಯಂತ್ರ, ಕತ್ತರಿ, ಕಂಪ್ಯೂಟರ್‌ಗಳನ್ನು ತೊಳೆದು ಗಂಧ-ಕುಂಕುಮ-ಹೂವಿನಿಂದ ಅಲಂಕರಿಸುವುದು', hi: 'यन्त्र एवं वाहन पूजन' },
      { en: 'Saraswati Pustaka Puja: Keep sacred books and musical instruments before the Goddess', kn: 'ಸರಸ್ವತೀ ಪುಸ್ತಕ ಪೂಜೆ: ಪವಿತ್ರ ಗ್ರಂಥಗಳು ಹಾಗೂ ವಾದ್ಯಗಳನ್ನು ದೇವಿಯ ಮುಂದೆ ಇರಿಸಿ ಪೂಜೆ', hi: 'सरस्वती पुस्तक पूजन' },
      { en: 'Chandi Homa Purnahuti in temples and spiritual centres', kn: 'ಚಂಡಿ ಹೋಮದ ಮಹಾ ಪೂರ್ಣಾಹುತಿ ಸಮರ್ಪಣೆ', hi: 'चण्डी महायज्ञ पूर्णाहुति' }
    ]
  },
  10: {
    dayNumber: 10,
    festivalId: 'navaratri_day10',
    name: { en: 'Day 10: Vijayadashami / Dasera • Vidyarambha, Shami & Aparajita Puja', kn: 'ದಿನ ೧೦: ವಿಜಯದಶಮಿ / ದಸರಾ • ವಿದ್ಯಾರಂಭ, ಶಮೀ ಪೂಜೆ & ಅಪರಾಜಿತಾ ಪೂಜೆ', hi: 'दिवस १०: विजयादशमी / दशहरा • अक्षराभ्यास, शमी एवं अपराजिता पूजन' },
    deity: { en: 'Maa Aparajita & Lord Sri Rama (Triumph of Dharma)', kn: 'ಶ್ರೀ ಅಪರಾಜಿತಾ ದೇವಿ & ಶ್ರೀ ರಾಮಚಂದ್ರ ಪ್ರಭು', hi: 'माँ अपराजिता एवं श्रीराम' },
    tithiTitle: { en: 'Ashwina Shukla Dashami (Vijayadashami)', kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ದಶಮಿ', hi: 'आश्विन शुक्ल दशमी' },
    defaultMuhurtaDesc: {
      en: 'Vijaya Muhurta (02:02 PM - 02:49 PM) & Vidyarambha Morning (08:30 AM - 10:45 AM)',
      kn: 'ವಿಜಯ ಮುಹೂರ್ತ (ಮಧ್ಯಾಹ್ನ ೦೨:೦೨ - ೦೨:೪೯) ಮತ್ತು ಪ್ರಾತಃಕಾಲ ವಿದ್ಯಾರಂಭ (೦೮:೩೦ - ೧೦:೪೫)',
      hi: 'विजय मुहूर्त (दोपहर ०२:०२ - ०२:४९) एवं प्रातः अक्षराभ्यास काल'
    },
    samagriSummary: {
      en: 'Shami (Banni) leaves, raw unbroken rice plate for writing, slate/chalk, jalebi, gold sweets, betel leaves.',
      kn: 'ಶಮೀ (ಬನ್ನಿ) ಎಲೆಗಳು, ಅಕ್ಕಿ ಹರಡಿದ ತಟ್ಟೆ (ಅಕ್ಷರಾಭ್ಯಾಸಕ್ಕೆ), ಹಲಗೆ/ಬಳಪ, ಜಿಲೇಬಿ, ಬಂಗಾರದ ಸಿಹಿ.',
      hi: 'शमी पत्र, अक्षत थाली (अक्षराभ्यास हेतु), मिष्ठान्न एवं पान।'
    },
    significance: {
      en: 'Triumph of Durga over Mahishasura and Rama over Ravana. Any new endeavor, learning, or business started on Vijayadashami is guaranteed success.',
      kn: 'ಅಧರ್ಮದ ಮೇಲೆ ಧರ್ಮದ ಮಹಾವಿಜಯ; ಈ ಶುಭ ದಿನದಂದು ಆರಂಭಿಸಿದ ವಿದ್ಯಾಭ್ಯಾಸ, ಹೊಸ ಉದ್ಯೋಗ ಅಥವಾ ಸಂಕಲ್ಪಗಳಿಗೆ ಅಪ್ರತಿಮ ಜಯ ಖಚಿತ.',
      hi: 'बुराई पर अच्छाई की विजय; इस दिन आरम्भ किया गया प्रत्येक कार्य सिद्ध होता है।'
    },
    dhyanaMantra: {
      sanskrit: 'शमी शमयते पापं शमी शत्रुविनाशिनी । अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी ॥',
      kannada: 'ಶಮೀ ಶಮಯತೇ ಪಾಪಂ ಶಮೀ ಶತ್ರುವಿನಾಶಿನೀ | ಅರ್ಜುನಸ್ಯ ಧನುರ್ಧಾರಿ ರಾಮಸ್ಯ ಪ್ರಿಯದರ್ಶಿನೀ ||',
      english: 'Shami Shamayate Papam Shami Shatruvinashini | Arjunasya Dhanurdhari Ramasya Priyadarshini ||'
    },
    specialRituals: [
      { en: 'Vidyarambham / Aksharabhyasa: Initiate children into alphabet by writing "Om Hari Sri Ganapataye Namah" in raw rice', kn: 'ವಿದ್ಯಾರಂಭ / ಅಕ್ಷರಾಭ್ಯಾಸ: ತಟ್ಟೆಯ ಅಕ್ಕಿಯಲ್ಲಿ "ಓಂ ಹರಿಃ ಶ್ರೀ ಗಣಪತಯೇ ನಮಃ" ಎಂದು ಬರೆಸಿ ಅಕ್ಷರ ಕಲಿಕೆ ಆರಂಭ', hi: 'अक्षराभ्यास: चावल की थाली पर "ॐ हरिः श्री गणपतये नमः" लेखन' },
      { en: 'Shami Puja & Banni exchange: Exchange Shami leaves with elders: "Banni thagoli bangaradhangiri"', kn: 'ಶಮೀ ಪೂಜೆ: "ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಎಂದು ಹಿರಿಯರಿಗೆ ಬನ್ನಿ ಕೊಟ್ಟು ಪಾದನಮಸ್ಕಾರ', hi: 'शमी पूजन एवं बन्नी पत्र विनिमय' },
      { en: 'Kalasha Visarjana: Respectfully move the Kalasha northward concluding the 10-day Mahotsava', kn: 'ಕಲಶ ವಿಸರ್ಜನೆ: ಕಲಶವನ್ನು ಗೌರವದಿಂದ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಚಲಿಸಿ ವಿಸರ್ಜಿಸುವುದು', hi: 'कलश को उत्तर दिशा में हिलाकर विसर्जन' }
    ]
  }
};

// -------------------------------------------------------------
// 4. PRECISE TIMING CALCULATION HELPER
// -------------------------------------------------------------
export function getCalculatedSandhiTiming(day: PanchangaDay): {
  sandhiStart: string;
  sandhiEnd: string;
  baliWindowStart: string;
  baliWindowEnd: string;
  pradoshaStart: string;
  pradoshaEnd: string;
  ashtamiEndTimeStr: string;
  explanation: LocalizedString;
} {
  const sunsetStr = day.sunset || '18:05';
  const [sH, sM] = sunsetStr.split(':').map(n => parseInt(n, 10) || 0);
  const sunsetMin = sH * 60 + sM;

  // Pradosha window: Sunset to 72 minutes after sunset
  const pradoshaStartMin = sunsetMin;
  const pradoshaEndMin = sunsetMin + 72;

  const formatMin = (m: number) => {
    const hrs = Math.floor(m / 60) % 24;
    const mins = m % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const dispH = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${String(dispH).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
  };

  // Astronomical Calculation based on exact Moon-Sun elongation (crossing 96° at Ashtami-Navami junction)
  const refDate = new Date(`${day.gregorianDate}T06:00:00`);
  const exactSandhi = getExactSandhiKalaWindow(refDate);

  const sandhiStart = exactSandhi.sandhiStartStr;
  const sandhiEnd = exactSandhi.sandhiEndStr;
  const baliWindowStart = exactSandhi.baliStartStr;
  const baliWindowEnd = exactSandhi.baliEndStr;
  const ashtamiEndTimeStr = formatMin(exactSandhi.ashtamiEndTime.getHours() * 60 + exactSandhi.ashtamiEndTime.getMinutes());

  return {
    sandhiStart,
    sandhiEnd,
    baliWindowStart,
    baliWindowEnd,
    pradoshaStart: formatMin(pradoshaStartMin),
    pradoshaEnd: formatMin(pradoshaEndMin),
    ashtamiEndTimeStr,
    explanation: {
      en: `Exact Sandhi Kala spans 48 minutes (${sandhiStart} - ${sandhiEnd}), representing the final 24 minutes of Maha Ashtami and first 24 minutes of Maha Navami (Ashtami ends at ${ashtamiEndTimeStr}). The sacred Kushmanda (Ash Gourd) Satvik Bali is performed during the second half (${baliWindowStart} - ${baliWindowEnd}) or during Pradosha transition (${formatMin(pradoshaStartMin)} - ${formatMin(pradoshaEndMin)}).`,
      kn: `ನಿಖರ ಸಂಧಿಕಾಲ ಮುಹೂರ್ತ: ${sandhiStart} ರಿಂದ ${sandhiEnd} (ಒಟ್ಟು ೪೮ ನಿಮಿಷ: ಅಷ್ಟಮಿಯು ${ashtamiEndTimeStr} ಕ್ಕೆ ಮುಕ್ತಾಯವಾಗುವ ಮುನ್ನ ೨೪ ನಿಮಿಷ ಹಾಗೂ ನವಮಿಯ ಮೊದಲ ೨೪ ನಿಮಿಷ). ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಸಾತ್ವಿಕ ಬಲಿಯನ್ನು ಎರಡನೇ ಅರ್ಧಭಾಗದಲ್ಲಿ (${baliWindowStart} - ${baliWindowEnd}) ಅಥವಾ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ (${formatMin(pradoshaStartMin)} - ${formatMin(pradoshaEndMin)}) ಸಮರ್ಪಿಸಬೇಕು.`,
      hi: `यथार्थ सन्धिकाल: ${sandhiStart} से ${sandhiEnd} (कुल ४८ मिनट: अष्टमी समाप्ति ${ashtamiEndTimeStr} से पूर्व २४ मिनट एवं नवमी के आरम्भिक २४ मिनट)। सात्त्विक कूष्माण्ड बलि द्वितीयार्ध (${baliWindowStart} - ${baliWindowEnd}) अथवा प्रदोष वेला (${formatMin(pradoshaStartMin)} - ${formatMin(pradoshaEndMin)}) में अर्पित की जाती है।`
    }
  };
}
