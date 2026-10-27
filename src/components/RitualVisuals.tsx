import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Info, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Flame, 
  Layers,
  ChevronRight,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';

export interface RitualVisualsProps {
  activeVisual?: 'kalasha' | 'akhandaDeepa' | 'both';
  language: Language;
  className?: string;
}

export const RitualVisuals: React.FC<RitualVisualsProps> = ({
  activeVisual = 'both',
  language,
  className = ''
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'kalasha' | 'akhandaDeepa'>(
    activeVisual === 'akhandaDeepa' ? 'akhandaDeepa' : 'kalasha'
  );
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showDeityMap, setShowDeityMap] = useState<boolean>(true);

  // Localization labels
  const text = {
    title: {
      kn: 'ವೇದೋಕ್ತ ಪೂಜಾ ರೇಖಾಚಿತ್ರಗಳು & ಪ್ರತಿಷ್ಠಾಪನಾ ದರ್ಶನ (Ritual Visuals)',
      hi: 'वेदोक्त पूजन रेखाचित्र एवं प्रतिष्ठा दर्शन (Ritual Visuals)',
      en: 'Vedic Ritual Schematics & Visual Installation Guide (Ritual Visuals)'
    },
    subtitle: {
      kn: 'ಪಿಡಿಎಫ್ ಆಧಾರಿತ ಕಲಶ ಸ್ಥಾಪನೆ ಹಾಗೂ ಅಖಂಡ ದೀಪದ ವಾಸ್ತು ರಚನೆಯ ನಿಖರ ದೃಶ್ಯ ನಿರೂಪಣೆ',
      hi: 'प्रामाणिक कलश स्थापना एवं अखण्ड दीप वास्तु रेखाचित्र का दृश्य निरूपण',
      en: 'High-fidelity visual schematics for Kalasha Sthapana & Akhanda Deepa Vastu alignment'
    },
    kalashaTab: {
      kn: '🏺 ಕಲಶ ಸ್ಥಾಪನಾ ರೇಖಾಚಿತ್ರ (Kalasha Architecture)',
      hi: '🏺 कलश प्रतिष्ठा रेखाचित्र (Kalasha Architecture)',
      en: '🏺 Kalasha Sthapana Visual Diagram'
    },
    deepaTab: {
      kn: '🪔 ಅಖಂಡ ದೀಪ & ವಾಸ್ತು ದಿಕ್ಸೂಚಿ (Akhanda Deepa & Vastu)',
      hi: '🪔 अखण्ड दीप एवं वास्तु दिशा (Akhanda Deepa & Vastu)',
      en: '🪔 Akhanda Deepa & Vastu Alignment'
    },
    deityOverlayToggle: {
      kn: 'ದೇವತಾ ಸ್ಥಾನಗಳನ್ನು ತೋರಿಸು',
      hi: 'देवता स्थान दर्शाएं',
      en: 'Show Resident Deity Invocations'
    },
    clickInstruction: {
      kn: 'ರೇಖಾಚಿತ್ರದ ಯಾವುದೇ ಭಾಗದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಆ ಭಾಗದ ವೇದೋಕ್ತ ಮಂತ್ರ ಮತ್ತು ರಹಸ್ಯವನ್ನು ವೀಕ್ಷಿಸಿ.',
      hi: 'चित्र के किसी भी अंग पर क्लिक करके उसका वैदिक मन्त्र एवं रहस्य देखें।',
      en: 'Click on any part of the diagram to view its Vedic mantra and symbolism.'
    }
  };

  // Kalasha anatomical nodes for interactive explanation
  const kalashaNodes: Record<string, { title: Record<Language, string>; deity: Record<Language, string>; mantra: Record<Language, string>; desc: Record<Language, string> }> = {
    coconut: {
      title: {
        kn: 'ಶ್ರೀಫಲ / ಪೂರ್ಣ ತೆಂಗಿನಕಾಯಿ (Coconut & Shikha)',
        hi: 'श्रीफल / शिखा युक्त नारियल',
        en: 'Shrikhanda Coconut with Intact Husk'
      },
      deity: {
        kn: 'ಸರ್ವದೇವತಾ ಆವಾಸ & ಜಗನ್ಮಾತೆ ಮಹಾಮಾಯಾ',
        hi: 'सर्वदेवता आवास एवं महामाया',
        en: 'Universal Consciousness & Mother Divine'
      },
      mantra: {
        kn: 'ಓಂ ಶ್ರೀಫಲಾಯ ನಮಃ | ಕೌತುಕ ಸೂತ್ರೇಣ ಆವೇಷ್ಟಿತಮ್',
        hi: 'ॐ श्रीफलाय नमः । कौतुक सूत्रेण आवेष्टितम्',
        en: 'Om Sriphalaya Namah | Wrapped in red silk thread'
      },
      desc: {
        kn: 'ತೆಂಗಿನಕಾಯಿಯ ಕುಡಿ (ಶಿಖೆ) ಯಾವಾಗಲೂ ಮೇಲ್ಮುಖವಾಗಿರಬೇಕು. ಕೆಂಪು ರೇಷ್ಮೆ ವಸ್ತ್ರ ಮತ್ತು ಕೌತುಕ ಸೂತ್ರದಿಂದ ಸುತ್ತಿ ಮಾವಿನೆಲೆಗಳ ಮಧ್ಯೆ ಸ್ಥಿರವಾಗಿ ನಿಲ್ಲಿಸಬೇಕು.',
        hi: 'नारियल की शिखा सदैव ऊपर की ओर होनी चाहिए। इसे लाल कल्पसूत्र/वस्त्र से आवेष्टित कर पत्तों के मध्य प्रतिष्ठित करें।',
        en: 'The coconut tuft (shikha) must point upwards towards the heavens, sanctified with sacred red silk thread (raksha sutra).'
      }
    },
    leaves: {
      title: {
        kn: 'ಪಂಚ / ಸಪ್ತ ಆಮ್ರಪಲ್ಲವ (Mango Leaves)',
        hi: 'पञ्च / सप्त आम्रपल्लव (आम के पत्ते)',
        en: '5 or 7 Fresh Mango / Betel Leaves'
      },
      deity: {
        kn: 'ವರದ ರಾಜ, ಕಾಮಧೇನು & ಪ್ರಕೃತಿ ಶಕ್ತಿ',
        hi: 'कामधेनु एवं प्रकृति शक्ति',
        en: 'Kamadhenu & Divine Nature (Prakriti)'
      },
      mantra: {
        kn: 'ಓಂ ಆಮ್ರಪಲ್ಲವೇಭ್ಯೋ ನಮಃ | ಪಂಚಪಲ್ಲವ ಸಮನ್ವಿತಮ್',
        hi: 'ॐ आम्रपल्लवेभ्यो नमः । पञ्चपल्लव समन्वितम्',
        en: 'Om Amrapallavebhyo Namah'
      },
      desc: {
        kn: '೫ ಅಥವಾ ೭ ತಾಜಾ ಮಾವಿನ ಚಿಗುರೆಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳನ್ನು ಕಲಶದ ಕಂಠದ ಸುತ್ತ ವೃತ್ತಾಕಾರವಾಗಿ ಹರಡಬೇಕು. ಇವು ಪ್ರಕೃತಿಯ ಜೀವಂತ ಚೈತನ್ಯವನ್ನು ಸಂಕೇತಿಸುತ್ತವೆ.',
        hi: '५ या ७ हरे आम अथवा पान के पत्तों को कलश के मुख के चारों ओर सजाएं। यह प्राणवायु और दिव्यता के संचारक हैं।',
        en: 'Leaves are arranged in a circular radiating pattern around the rim, funneling cosmic prana into the sanctified water.'
      }
    },
    neck: {
      title: {
        kn: 'ಕಲಶದ ಕಂಠ ಭಾಗ (Kalasha Neck - Shiva Sthana)',
        hi: 'कलश का कण्ठ भाग (कण्ठे रुद्रः)',
        en: 'Kalasha Neck (Abode of Lord Shiva / Rudra)'
      },
      deity: {
        kn: 'ಭಗವಾನ್ ರುದ್ರ / ಪರಮಶಿವ',
        hi: 'भगवान रुद्र / शिव',
        en: 'Lord Shiva / Rudra'
      },
      mantra: {
        kn: 'ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ',
        hi: 'कण्ठे रुद्रः समाश्रितः',
        en: 'Kanthe Rudrah Samashritah'
      },
      desc: {
        kn: 'ಕಲಶದ ಕಂಠದಲ್ಲಿ ಲಯಕಾರಕನಾದ ಪರಮಶಿವನು ನೆಲೆಸಿದ್ದಾನೆ. ಕಂಠಕ್ಕೆ ತ್ರಿಗುಣಾತ್ಮಕ ಕೆಂಪು-ಹಳದಿ ರಕ್ಷಾಸೂತ್ರವನ್ನು ೩ ಸುತ್ತು ಕಟ್ಟಲಾಗುತ್ತದೆ.',
        hi: 'कलश के कण्ठ में भगवान रुद्र निवास करते हैं। यहां त्रिगुण रूपी मौली (कलावा) को तीन बार लपेटा जाता है।',
        en: 'Lord Rudra abides in the neck of the Kalasha. Three rounds of red-yellow sacred thread (Mouli) are wound around this part.'
      }
    },
    rim: {
      title: {
        kn: 'ಕಲಶದ ಮುಖ ಭಾಗ (Kalasha Rim - Vishnu Sthana)',
        hi: 'कलश का मुख भाग (मुखे विष्णुः)',
        en: 'Kalasha Rim / Mouth (Abode of Lord Vishnu)'
      },
      deity: {
        kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು / ನಾರಾಯಣ',
        hi: 'श्री महाविष्णु / नारायण',
        en: 'Lord Maha Vishnu / Narayana'
      },
      mantra: {
        kn: 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ',
        hi: 'कलशस्य मुखे विष्णुः',
        en: 'Kalashasya Mukhe Vishnuh'
      },
      desc: {
        kn: 'ಕಲಶದ ಮುಖಭಾಗದಲ್ಲಿ ಜಗತ್ಪಾಲಕನಾದ ಶ್ರೀ ಮಹಾವಿಷ್ಣುವು ನೆಲೆಸಿದ್ದಾನೆ. ಇಲ್ಲಿಂದಲೇ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ ಮತ್ತು ಆಶೀರ್ವಾದದ ಜಲವು ಪ್ರವಹಿಸುತ್ತದೆ.',
        hi: 'कलश के मुख पर जगत्पालक श्रीहरि विष्णु का वास है। यहीं से अमृतमय पवित्र जल का संचरण होता है।',
        en: 'Lord Vishnu presides over the mouth of the vessel, sustaining all life and showering auspicious nectar.'
      }
    },
    water: {
      title: {
        kn: 'ಗರ್ಭೋದಕ & ಸಪ್ತ ಪವಿತ್ರ ನದಿಗಳು (Sacred Ganga Water & Oceans)',
        hi: 'गर्भोदक एवं सप्त नदियां (सप्तद्वीपा वसुंधरा)',
        en: 'Sanctified Teertha & 7 Sacred Rivers'
      },
      deity: {
        kn: 'ಗಂಗಾ, ಯಮುನಾ, ಗೋದಾವರಿ, ಸರಸ್ವತೀ, ನರ್ಮದಾ, ಸಿಂಧು, ಕಾವೇರೀ & ಸಪ್ತ ಸಮುದ್ರಗಳು',
        hi: 'गंगा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु, कावेरी',
        en: '7 Holy Rivers & Cosmic Waters'
      },
      mantra: {
        kn: 'ಕುಕ್ಷೌ ತು ಸಾಗರಾಃ ಸರ್ವೇ ಸಪ್ತದ್ವೀಪಾ ವಸುಂಧರಾ | ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ...',
        hi: 'कुक्षौ तु सागराः सर्वे सप्तद्वीपा वसुंधरा । गङ्गे च यमुने चैव...',
        en: 'Gange cha Yamune chaiva Godavari Saraswati...'
      },
      desc: {
        kn: 'ಕಲಶದ ಒಳಗೆ ಶುದ್ಧ ಗಂಗಾಜಲ, ಏಲಕ್ಕಿ, ಲವಂಗ, ಜವ್ರಾದಿ ಸುಗಂಧ ದ್ರವ್ಯ, ಅಡಿಕೆ ಮತ್ತು ನಾಣ್ಯವನ್ನು ಹಾಕಿ ಸಪ್ತ ನದಿಗಳ ತೀರ್ಥವನ್ನು ಆವಾಹಿಸಲಾಗುತ್ತದೆ.',
        hi: 'कलश में गंगाजल, सुपारी, सिक्का, इलायची, लौंग व सुगन्धित द्रव्य डालकर सप्त पवित्र नदियों का आह्वान किया जाता है।',
        en: 'Pure Ganga water enriched with betel nut, gold/silver coin, cardamom, clove, and perfumed water representing the cosmic oceans.'
      }
    },
    base: {
      title: {
        kn: 'ಕಲಶದ ಮೂಲ ಭಾಗ (Kalasha Base - Brahma Sthana)',
        hi: 'कलश का मूल भाग (मूले तत्र स्थितो ब्रह्मा)',
        en: 'Kalasha Base (Abode of Lord Brahma)'
      },
      deity: {
        kn: 'ಸೃಷ್ಟಿಕರ್ತ ಬ್ರಹ್ಮದೇವ',
        hi: 'सृष्टिकर्ता ब्रह्मा',
        en: 'Lord Brahma the Creator'
      },
      mantra: {
        kn: 'ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ',
        hi: 'मूले तत्र स्थितो ब्रह्मा',
        en: 'Moole Tatro Sthito Brahma'
      },
      desc: {
        kn: 'ಕಲಶದ ತಳಭಾಗದಲ್ಲಿ ಸೃಷ್ಟಿಕರ್ತನಾದ ಬ್ರಹ್ಮದೇವನು ನೆಲೆಸಿದ್ದಾನೆ. ಸ್ಥಿರತೆ ಮತ್ತು ಬ್ರಹ್ಮಾಂಡದ ಉಗಮವನ್ನು ಇದು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.',
        hi: 'कलश के आधार में सृष्टिकर्ता चतुर्मुख ब्रह्मा का वास है, जो स्थिरता एवं नवीन सृजन के द्योतक हैं।',
        en: 'Lord Brahma presides at the root/base of the pot, grounding the divine energy into the material plane.'
      }
    },
    altar: {
      title: {
        kn: 'ನವಧಾನ್ಯ ವೇದಿಕೆ / ಅಷ್ಟದಲ ಕಮಲ ಪೀಠ (Grain Altar & Lotus Base)',
        hi: 'नवधान्य वेदी / अष्टदल कमल पीठ',
        en: 'Navadhanya 9-Grain Altar / Ashta-Dala Lotus Bed'
      },
      deity: {
        kn: 'ಭೂಮಿ ತಾಯಿ (ಪೃಥ್ವೀ) & ನವಗ್ರಹ ದೇವತೆಗಳು',
        hi: 'माता पृथ्वी एवं नवग्रह देवता',
        en: 'Mother Earth (Bhoomi Devi) & 9 Planetary Deities'
      },
      mantra: {
        kn: 'ಓಂ ಪೃಥ್ವ್ಯೈ ನಮಃ | ನವಧಾನ್ಯ ಮಂಡಲ ಸ್ಥಾಪಯಾಮಿ',
        hi: 'ॐ पृथ्व्यै नमः । नवधान्य मण्डलं स्थापयामि',
        en: 'Om Prithvyai Namah | Navadhanya Mandala'
      },
      desc: {
        kn: 'ತಾಮ್ರ ಅಥವಾ ಮಣ್ಣಿನ ತಟ್ಟೆಯಲ್ಲಿ ೯ ಪವಿತ್ರ ನವಧಾನ್ಯಗಳನ್ನು ಹರಡಿ ಅಥವಾ ಅಕ್ಷತೆಯಿಂದ ೮ ದಳಗಳ ಕಮಲವನ್ನು ರಚಿಸಿ ಅದರ ಮೇಲೆ ಕಲಶವನ್ನು ಸ್ಥಾಪಿಸಬೇಕು. ಕಲಶವನ್ನು ಎಂದಿಗೂ ಬರೀ ನೆಲದ ಮೇಲೆ ಇಡಬಾರದು.',
        hi: 'तांबे या मिट्टी की थाली में नवधान्य बिछाकर अथवा अक्षत से अष्टदल कमल बनाकर कलश स्थापित करें। कलश कभी भी सीधे फर्श पर न रखें।',
        en: 'Nine sacred grains or an 8-petaled rice lotus is laid on an earthen or brass tray. The Kalasha must NEVER be placed directly on the bare floor.'
      }
    }
  };

  // Akhanda Deepa nodes
  const deepaNodes: Record<string, { title: Record<Language, string>; rule: Record<Language, string>; desc: Record<Language, string>; color: string }> = {
    east: {
      title: {
        kn: 'ಪೂರ್ವ ದಿಕ್ಕು (East Facing Jyoti)',
        hi: 'पूर्व दिशा (East Facing)',
        en: 'East Direction (Purva Mukha)'
      },
      rule: {
        kn: 'ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ • ಆಯುರ್ವೃದ್ಧಿ & ಆರೋಗ್ಯ (Highly Auspicious)',
        hi: 'अत्युत्तम • आयुर्वृद्धि एवं स्वास्थ्य',
        en: 'Supreme Auspiciousness • Longevity & Health'
      },
      desc: {
        kn: 'ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಪೂರ್ವ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿ ಬೆಳಗಿಸುವುದರಿಂದ ಆಯಸ್ಸು, ಆರೋಗ್ಯ, ಕಾಂತಿ ಮತ್ತು ಸಕಲ ಕಾರ್ಯಗಳಲ್ಲಿ ವಿಜಯ ಲಭಿಸುತ್ತದೆ.',
        hi: 'पूर्व मुखी ज्योति प्रज्वलित करने से दीर्घायु, उत्तम स्वास्थ्य, मानसिक शान्ति एवं समस्त कार्यों में विजय प्राप्त होती है।',
        en: 'Facing the flame East attracts divine solar prana, promoting vitality, disease-free longevity, and spiritual clarity.'
      },
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400'
    },
    north: {
      title: {
        kn: 'ಉತ್ತರ ದಿಕ್ಕು (North Facing Jyoti)',
        hi: 'उत्तर दिशा (North Facing)',
        en: 'North Direction (Uttara Mukha)'
      },
      rule: {
        kn: 'ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ • ಧನಪ್ರಾಪ್ತಿ & ಸುಖ-ಸಮೃದ್ಧಿ (Wealth & Wisdom)',
        hi: 'अत्युत्तम • धन-समृद्धि एवं ज्ञान',
        en: 'Supreme Auspiciousness • Wealth & Knowledge'
      },
      desc: {
        kn: 'ದೀಪದ ಜ್ಯೋತಿಯು ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿದ್ದರೆ ಕುಬೇರ ಮತ್ತು ಮಹಾಲಕ್ಷ್ಮಿಯ ಕೃಪೆ ಲಭಿಸಿ ಆರ್ಥಿಕ ಅಭಿವೃದ್ಧಿ ಮತ್ತು ಜ್ಞಾನ ವೃದ್ಧಿಯಾಗುತ್ತದೆ.',
        hi: 'उत्तर मुखी दीप जलाने से कुबेर व महालक्ष्मी की कृपा से अटूट धन, व्यापार में वृद्धि एवं ज्ञान की प्राप्ति होती है।',
        en: 'Facing the flame North channels Kubera and Lakshmi energies, augmenting spiritual wisdom and righteous wealth.'
      },
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400'
    },
    west: {
      title: {
        kn: 'ಪಶ್ಚಿಮ ದಿಕ್ಕು (West Facing Jyoti)',
        hi: 'पश्चिम दिशा (West Facing)',
        en: 'West Direction (Pashchima Mukha)'
      },
      rule: {
        kn: 'ಮಧ್ಯಮ ಫಲ • ಶತ್ರು ನಾಶ (Moderate / Secondary)',
        hi: 'मध्यम फल • शत्रु शमन',
        en: 'Moderate • Overcoming Adversaries'
      },
      desc: {
        kn: 'ಪಶ್ಚಿಮ ದಿಕ್ಕಿನ ಜ್ಯೋತಿಯು ಸಾಧಾರಣ ಫಲಪ್ರದ. ಕೇವಲ ಶತ್ರು ಬಾಧೆ ನಿವಾರಣೆಗಾಗಿ ಮಾತ್ರ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.',
        hi: 'पश्चिम दिशा में दीप ज्योति रखना सामान्य फलदायी है, यह मुख्य रूप से विघ्न शान्ति हेतु मानी जाती है।',
        en: 'Facing West is considered moderate; traditionally used for neutralizing adversarial hurdles.'
      },
      color: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-400'
    },
    south: {
      title: {
        kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕು (South Facing Jyoti - ವರ್ಜ್ಯ / ನಿಷೇಧ)',
        hi: 'दक्षिण दिशा (South Facing - वर्जित / निषेध)',
        en: 'South Direction (Strictly Prohibited for Puja)'
      },
      rule: {
        kn: 'ನಿಷೇಧಿಸಲಾಗಿದೆ • ವರ್ಜ್ಯ (Strictly Prohibited)',
        hi: 'कदापि न करें • सर्वथा वर्जित',
        en: 'Strictly Inauspicious • Never Point South'
      },
      desc: {
        kn: 'ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಎಂದಿಗೂ ದಕ್ಷಿಣ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿ ಇಡಬಾರದು! ಇದು ಯಮ ದಿಕ್ಕಾಗಿದ್ದು, ಕೇವಲ ಪಿತೃ ಕರ್ಮಗಳಲ್ಲಿ ಮಾತ್ರ ದಕ್ಷಿಣ ದಿಕ್ಕು ಬಳಸಲಾಗುತ್ತದೆ.',
        hi: 'दक्षिण दिशा यम की दिशा है। मांगलिक एवं नवरात्रि दीप की ज्योति दक्षिण मुखी कभी न रखें, यह हानि व अशान्ति कारक है।',
        en: 'The flame must NEVER face South. South is the realm of Yama and is reserved exclusively for ancestral Shraaddha rites, never auspicious Pujas.'
      },
      color: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-500'
    }
  };

  return (
    <div className={`w-full rounded-2xl border-2 border-amber-300/80 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 shadow-xl overflow-hidden transition-all ${className}`}>
      
      {/* Component Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-800 via-orange-800 to-amber-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-400/40">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-stone-950 font-black text-xl shadow-md shrink-0">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200 bg-black/40 px-2 py-0.5 rounded-md border border-white/20">
                PDF Visual Schematics
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                Responsive Vectors
              </span>
            </div>
            <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5">
              {text.title[language]}
            </h3>
            <p className="text-xs text-amber-100/90 mt-0.5">
              {text.subtitle[language]}
            </p>
          </div>
        </div>

        {/* Sub-Tab Selector: Kalasha Sthapana vs Akhanda Deepa */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/20 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setSelectedSubTab('kalasha');
              setHighlightedPart(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSubTab === 'kalasha'
                ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold'
                : 'text-amber-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏺</span>
            <span>{language === 'kn' ? 'ಕಲಶ ರೇಖಾಚಿತ್ರ' : language === 'hi' ? 'कलश रेखाचित्र' : 'Kalasha Diagram'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSubTab('akhandaDeepa');
              setHighlightedPart(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSubTab === 'akhandaDeepa'
                ? 'bg-amber-400 text-stone-950 shadow-md font-extrabold'
                : 'text-amber-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🪔</span>
            <span>{language === 'kn' ? 'ಅಖಂಡ ದೀಪ ದಿಕ್ಸೂಚಿ' : language === 'hi' ? 'अखण्ड दीप दिशा' : 'Akhanda Deepa & Vastu'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Zoom & Overlay Toggles */}
      <div className="px-4 py-2.5 bg-amber-100/60 dark:bg-stone-950/80 border-b border-amber-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="hidden sm:inline font-medium">{text.clickInstruction[language]}</span>
          <span className="sm:hidden font-medium">{language === 'kn' ? 'ಭಾಗಗಳ ಮೇಲೆ ಸ್ಪರ್ಶಿಸಿ ವಿವರ ನೋಡಿ' : 'Tap parts for details'}</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedSubTab === 'kalasha' && (
            <button
              type="button"
              onClick={() => setShowDeityMap(!showDeityMap)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                showDeityMap 
                  ? 'bg-amber-600 text-white border-amber-600' 
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{text.deityOverlayToggle[language]}</span>
            </button>
          )}

          <div className="flex items-center bg-white dark:bg-stone-800 rounded-md border border-stone-300 dark:border-stone-700 p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.85, prev - 0.15))}
              className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-stone-500">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
              className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 lg:p-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: KALASHA STHAPANA VISUAL SCHEMATIC                                 */}
        {/* ========================================================================= */}
        {selectedSubTab === 'kalasha' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SVG Visual Canvas (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-950 p-4 sm:p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
              <div 
                className="w-full max-w-[420px] transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG ILLUSTRATION OF SACRED VEDIC KALASHA */}
                <svg
                  viewBox="0 0 400 500"
                  className="w-full h-auto drop-shadow-md select-none"
                  aria-label="Vedic Kalasha Sthapana Sacred Diagram"
                >
                  <defs>
                    <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8d5b2d" />
                      <stop offset="50%" stopColor="#6e3e15" />
                      <stop offset="100%" stopColor="#452309" />
                    </linearGradient>

                    <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="35%" stopColor="#f59e0b" />
                      <stop offset="70%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>

                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>

                    <radialGradient id="waterGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
                    </radialGradient>

                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* 1. Base Altar: Earthen Tray & Navadhanya / Lotus */}
                  <g 
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => setHighlightedPart('altar')}
                  >
                    <ellipse cx="200" cy="460" rx="170" ry="28" fill="#e2b170" stroke="#b47d3c" strokeWidth="3" />
                    <ellipse cx="200" cy="458" rx="155" ry="22" fill="#c48a43" opacity="0.4" />
                    {/* Grains representation */}
                    {Array.from({ length: 32 }).map((_, i) => {
                      const angle = (i / 32) * Math.PI * 2;
                      const rx = 135 * Math.cos(angle) + 200;
                      const ry = 16 * Math.sin(angle) + 458;
                      return (
                        <circle key={i} cx={rx} cy={ry} r="3" fill="#fef08a" />
                      );
                    })}
                    <text x="200" y="488" textAnchor="middle" className="text-[11px] font-sans font-bold fill-stone-700 dark:fill-stone-300">
                      {language === 'kn' ? 'ನವಧಾನ್ಯ ಮಂಡಲ ಪೀಠ (Navadhanya Base)' : 'Navadhanya / Ashta-Dala Lotus Base'}
                    </text>
                  </g>

                  {/* 2. Pot Base (Lord Brahma) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setHighlightedPart('base')}
                  >
                    <ellipse cx="200" cy="425" rx="75" ry="16" fill="#b45309" stroke="#92400e" strokeWidth="2" />
                  </g>

                  {/* 3. Main Pot Body & Inside Water (Belly of Kalasha) */}
                  <g 
                    className="cursor-pointer transition-all hover:opacity-95"
                    onClick={() => setHighlightedPart('water')}
                  >
                    <path
                      d="M 140 270 C 100 320 100 410 160 430 C 180 435 220 435 240 430 C 300 410 300 320 260 270 Z"
                      fill="url(#potGrad)"
                      stroke="#92400e"
                      strokeWidth="3"
                    />

                    {/* Sacred Swastika / Tilaka on Belly */}
                    <g transform="translate(182, 325) scale(0.9)">
                      <path d="M 20 0 L 20 40 M 0 20 L 40 20 M 20 0 L 40 0 M 40 20 L 40 40 M 20 40 L 0 40 M 0 20 L 0 0" stroke="#dc2626" strokeWidth="4" strokeLinecap="square" fill="none" />
                      <circle cx="10" cy="10" r="2.5" fill="#dc2626" />
                      <circle cx="30" cy="10" r="2.5" fill="#dc2626" />
                      <circle cx="10" cy="30" r="2.5" fill="#dc2626" />
                      <circle cx="30" cy="30" r="2.5" fill="#dc2626" />
                    </g>
                  </g>

                  {/* 4. Kalasha Neck (Lord Shiva) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setHighlightedPart('neck')}
                  >
                    <rect x="155" y="240" width="90" height="32" rx="4" fill="url(#potGrad)" stroke="#92400e" strokeWidth="2.5" />
                    {/* Sacred Raksha Sutra / Mouli (3 red/yellow threads) */}
                    <line x1="155" y1="248" x2="245" y2="248" stroke="#dc2626" strokeWidth="2.5" />
                    <line x1="155" y1="256" x2="245" y2="256" stroke="#fbbf24" strokeWidth="2" />
                    <line x1="155" y1="264" x2="245" y2="264" stroke="#dc2626" strokeWidth="2.5" />
                  </g>

                  {/* 5. Kalasha Rim (Lord Vishnu) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => setHighlightedPart('rim')}
                  >
                    <ellipse cx="200" cy="240" rx="55" ry="14" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
                    <ellipse cx="200" cy="240" rx="42" ry="10" fill="#78350f" />
                  </g>

                  {/* 6. Five Radiating Mango Leaves (Amrapallava) */}
                  <g 
                    className="cursor-pointer transition-all hover:brightness-110"
                    onClick={() => setHighlightedPart('leaves')}
                  >
                    {/* Far Left Leaf */}
                    <path d="M 165 240 C 110 215 70 170 65 140 C 95 155 145 200 175 235 Z" fill="url(#leafGrad)" stroke="#065f46" strokeWidth="1.5" />
                    {/* Mid Left Leaf */}
                    <path d="M 180 235 C 145 190 120 130 125 90 C 150 120 180 180 190 230 Z" fill="url(#leafGrad)" stroke="#065f46" strokeWidth="1.5" />
                    {/* Center Leaf (Behind Coconut) */}
                    <path d="M 195 230 C 185 160 190 90 200 50 C 210 90 215 160 205 230 Z" fill="url(#leafGrad)" stroke="#065f46" strokeWidth="1.5" />
                    {/* Mid Right Leaf */}
                    <path d="M 210 230 C 220 180 250 120 275 90 C 280 130 255 190 220 235 Z" fill="url(#leafGrad)" stroke="#065f46" strokeWidth="1.5" />
                    {/* Far Right Leaf */}
                    <path d="M 225 235 C 255 200 305 155 335 140 C 330 170 290 215 235 240 Z" fill="url(#leafGrad)" stroke="#065f46" strokeWidth="1.5" />
                  </g>

                  {/* 7. Coconut (Shrikhanda / Sriphala) with Husk & Silk */}
                  <g 
                    className="cursor-pointer transition-all hover:scale-[1.02] origin-center"
                    onClick={() => setHighlightedPart('coconut')}
                  >
                    {/* Coconut Body */}
                    <ellipse cx="200" cy="180" rx="42" ry="54" fill="url(#coconutGrad)" stroke="#3e1c04" strokeWidth="2.5" />
                    
                    {/* Upper Shikha / Tuft */}
                    <path d="M 175 140 C 190 100 195 65 200 55 C 205 65 210 100 225 140 Z" fill="#6e3e15" stroke="#3e1c04" strokeWidth="1.5" />
                    
                    {/* Red Silk Band (Vastram) around coconut */}
                    <path d="M 162 175 C 180 190 220 190 238 175 L 235 195 C 215 210 185 210 165 195 Z" fill="#dc2626" opacity="0.9" />
                    <line x1="165" y1="185" x2="235" y2="185" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" />
                    
                    {/* Sacred Tilaka on Coconut */}
                    <circle cx="200" cy="160" r="5" fill="#fcd34d" />
                    <circle cx="200" cy="160" r="2.5" fill="#dc2626" />
                  </g>

                  {/* Resident Deity Labels when overlay is active */}
                  {showDeityMap && (
                    <g className="font-serif font-black text-[10px] pointer-events-none select-none">
                      {/* Vishnu at Rim */}
                      <rect x="260" y="222" width="130" height="22" rx="4" fill="#0f172a" opacity="0.85" />
                      <text x="265" y="237" fill="#fbbf24">
                        {language === 'kn' ? 'ಮುಖೇ ವಿಷ್ಣುಃ' : 'Mukhe Vishnuh (Rim)'}
                      </text>

                      {/* Shiva at Neck */}
                      <rect x="250" y="255" width="140" height="22" rx="4" fill="#0f172a" opacity="0.85" />
                      <text x="255" y="270" fill="#f87171">
                        {language === 'kn' ? 'ಕಂಠೇ ರುದ್ರಃ' : 'Kanthe Rudrah (Neck)'}
                      </text>

                      {/* Brahma at Base */}
                      <rect x="250" y="415" width="140" height="22" rx="4" fill="#0f172a" opacity="0.85" />
                      <text x="255" y="430" fill="#a7f3d0">
                        {language === 'kn' ? 'ಮೂಲೇ ಬ್ರಹ್ಮಾ' : 'Moole Brahma (Base)'}
                      </text>

                      {/* Oceans in Water */}
                      <rect x="15" y="325" width="125" height="22" rx="4" fill="#0f172a" opacity="0.85" />
                      <text x="20" y="340" fill="#7dd3fc">
                        {language === 'kn' ? 'ಕುಕ್ಷೌ ಸಾಗರಾಃ' : 'Kukshau Sagarah'}
                      </text>

                      {/* Coconut / Devi */}
                      <rect x="15" y="160" width="135" height="22" rx="4" fill="#0f172a" opacity="0.85" />
                      <text x="20" y="175" fill="#fde047">
                        {language === 'kn' ? 'ಶ್ರೀಫಲಂ • ಜಗನ್ಮಾತಾ' : 'Shriphalam (Coconut)'}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <div className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-amber-700 dark:text-amber-300">
                  {language === 'kn' ? 'ಪ್ರತಿಷ್ಠಾಪನಾ ಸೂತ್ರ: ' : 'Vedic Injunction: '}
                </span>
                <span>
                  {language === 'kn'
                    ? 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ | ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ||'
                    : 'Kalashasya Mukhe Vishnuh Kanthe Rudrah Samashritah | Moole Tatro Sthito Brahma Madhye Matriganah Smritah ||'}
                </span>
              </div>
            </div>

            {/* Interactive Detail Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60">
                <h4 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'kn' ? 'ಕಲಶದ ಅಂಗರಚನೆ & ರಹಸ್ಯ ವಿವರಣೆ' : 'Kalasha Anatomical Key & Invocations'}
                  </span>
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {language === 'kn'
                    ? 'ಕೆಳಗಿನ ಪಟ್ಟಿಯಿಂದ ಆಯ್ದು ಅಥವಾ ರೇಖಾಚಿತ್ರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಪ್ರತಿಯೊಂದು ಅಂಗದ ವೈದಿಕ ಮಹತ್ವವನ್ನು ಪರಿಶೀಲಿಸಿ:'
                    : 'Select any part below to review its scriptural significance, resident deity, and chant:'}
                </p>
              </div>

              {/* Part Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(kalashaNodes).map((nodeKey) => {
                  const node = kalashaNodes[nodeKey];
                  const isSelected = highlightedPart === nodeKey || (!highlightedPart && nodeKey === 'coconut');
                  return (
                    <button
                      key={nodeKey}
                      type="button"
                      onClick={() => setHighlightedPart(nodeKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {node.title[language]}
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Node Details */}
              {(() => {
                const activeKey = highlightedPart || 'coconut';
                const node = kalashaNodes[activeKey];
                return (
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-400/80 dark:border-amber-600/60 shadow-md space-y-3 animate-in fade-in">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/60">
                        {language === 'kn' ? 'ಆವಾಸ ದೇವತೆ' : 'Resident Divinity'}
                      </span>
                      <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 mt-1">
                        {node.title[language]}
                      </h4>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                        ✨ {node.deity[language]}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700/60 text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                        🕉️ {language === 'kn' ? 'ವೇದೋಕ್ತ ಮಂತ್ರ' : 'Sacred Mantra'}:
                      </span>
                      <p className="font-mono text-stone-800 dark:text-stone-200 italic font-semibold">
                        {node.mantra[language]}
                      </p>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      {node.desc[language]}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: AKHANDA DEEPA & VASTU DIRECTIONAL COMPASS                         */}
        {/* ========================================================================= */}
        {selectedSubTab === 'akhandaDeepa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* SVG Visual Compass Canvas (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-stone-950 p-4 sm:p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
              <div 
                className="w-full max-w-[420px] transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG ILLUSTRATION OF AKHANDA DEEPA & VASTU DIRECTIONS */}
                <svg
                  viewBox="0 0 400 450"
                  className="w-full h-auto drop-shadow-md select-none"
                  aria-label="Akhanda Deepa & Vastu Directional Diagram"
                >
                  <defs>
                    <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="35%" stopColor="#f59e0b" />
                      <stop offset="70%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="40%" stopColor="#eab308" />
                      <stop offset="70%" stopColor="#ca8a04" />
                      <stop offset="100%" stopColor="#854d0e" />
                    </linearGradient>
                  </defs>

                  {/* Compass Outer Ring */}
                  <circle cx="200" cy="225" r="185" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 6" className="dark:stroke-stone-800" />
                  <circle cx="200" cy="225" r="145" fill="none" stroke="#fed7aa" strokeWidth="1.5" opacity="0.6" />

                  {/* DIRECTION ARROWS & BADGES */}
                  
                  {/* NORTH (UP) - AUSPICIOUS */}
                  <g 
                    className="cursor-pointer transition-transform hover:scale-105 origin-center"
                    onClick={() => setHighlightedPart('north')}
                  >
                    <rect x="130" y="8" width="140" height="36" rx="8" fill="#15803d" stroke="#22c55e" strokeWidth="2" />
                    <text x="200" y="24" textAnchor="middle" className="text-[11px] font-sans font-bold fill-white">
                      ⬆ NORTH (ಉತ್ತರ)
                    </text>
                    <text x="200" y="37" textAnchor="middle" className="text-[9px] font-sans font-semibold fill-emerald-100">
                      {language === 'kn' ? 'ಧನ & ಜ್ಞಾನ ಪ್ರಾಪ್ತಿ' : 'Wealth & Wisdom'}
                    </text>
                    <line x1="200" y1="48" x2="200" y2="110" stroke="#16a34a" strokeWidth="3" strokeDasharray="4 3" markerEnd="url(#arrow)" />
                  </g>

                  {/* EAST (RIGHT) - AUSPICIOUS */}
                  <g 
                    className="cursor-pointer transition-transform hover:scale-105 origin-center"
                    onClick={() => setHighlightedPart('east')}
                  >
                    <rect x="260" y="205" width="135" height="38" rx="8" fill="#15803d" stroke="#22c55e" strokeWidth="2" />
                    <text x="327" y="222" textAnchor="middle" className="text-[11px] font-sans font-bold fill-white">
                      ➡ EAST (ಪೂರ್ವ)
                    </text>
                    <text x="327" y="235" textAnchor="middle" className="text-[9px] font-sans font-semibold fill-emerald-100">
                      {language === 'kn' ? 'ಆಯುಷ್ಯ & ಆರೋಗ್ಯ' : 'Health & Longevity'}
                    </text>
                  </g>

                  {/* SOUTH (DOWN) - PROHIBITED */}
                  <g 
                    className="cursor-pointer transition-transform hover:scale-105 origin-center"
                    onClick={() => setHighlightedPart('south')}
                  >
                    <rect x="130" y="405" width="140" height="36" rx="8" fill="#b91c1c" stroke="#ef4444" strokeWidth="2" />
                    <text x="200" y="421" textAnchor="middle" className="text-[11px] font-sans font-bold fill-white">
                      ⬇ SOUTH (ದಕ್ಷಿಣ)
                    </text>
                    <text x="200" y="434" textAnchor="middle" className="text-[9px] font-sans font-bold fill-red-200">
                      {language === 'kn' ? 'ವರ್ಜ್ಯ / ನಿಷೇಧ!' : 'PROHIBITED / YAMA'}
                    </text>
                    <line x1="200" y1="340" x2="200" y2="400" stroke="#dc2626" strokeWidth="3" strokeDasharray="4 3" />
                  </g>

                  {/* WEST (LEFT) - MODERATE */}
                  <g 
                    className="cursor-pointer transition-transform hover:scale-105 origin-center"
                    onClick={() => setHighlightedPart('west')}
                  >
                    <rect x="5" y="205" width="135" height="38" rx="8" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
                    <text x="72" y="222" textAnchor="middle" className="text-[11px] font-sans font-bold fill-white">
                      ⬅ WEST (ಪಶ್ಚಿಮ)
                    </text>
                    <text x="72" y="235" textAnchor="middle" className="text-[9px] font-sans font-semibold fill-amber-100">
                      {language === 'kn' ? 'ಮಧ್ಯಮ ಫಲ' : 'Moderate / Obstacles'}
                    </text>
                  </g>

                  {/* CENTRAL AKHANDA DEEPA OIL LAMP (Brass Deepam) */}
                  <g className="cursor-pointer" onClick={() => setHighlightedPart('east')}>
                    {/* Outer Glow Halo */}
                    <circle cx="200" cy="180" r="55" fill="url(#flameGlow)" opacity="0.6" />

                    {/* Lamp Base Pedestal */}
                    <ellipse cx="200" cy="325" rx="50" ry="12" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="2" />
                    <path d="M 175 325 L 188 280 L 212 280 L 225 325 Z" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="1.5" />
                    
                    {/* Middle Stem with ornamentation */}
                    <ellipse cx="200" cy="280" rx="20" ry="6" fill="#fde047" stroke="#78350f" strokeWidth="1.5" />
                    <rect x="194" y="235" width="12" height="45" fill="url(#brassGrad)" />
                    <ellipse cx="200" cy="240" rx="16" ry="5" fill="#fde047" stroke="#78350f" strokeWidth="1.5" />

                    {/* Oil Cup / Reservoir */}
                    <ellipse cx="200" cy="225" rx="42" ry="14" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="2" />
                    {/* Golden Ghee / Sesame Oil Pool */}
                    <ellipse cx="200" cy="223" rx="34" ry="10" fill="#f59e0b" />

                    {/* Cotton Wick Spout */}
                    <path d="M 200 220 C 196 205 198 190 200 180 C 202 190 204 205 200 220 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Sacred Flame (Akhanda Jyoti) */}
                    <path
                      d="M 200 135 C 185 165 188 185 200 195 C 212 185 215 165 200 135 Z"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                    <path
                      d="M 200 148 C 192 170 194 185 200 192 C 206 185 208 170 200 148 Z"
                      fill="#fef08a"
                    />
                    <circle cx="200" cy="180" r="4" fill="#38bdf8" opacity="0.8" />
                  </g>

                  {/* Glass Guard / Akhanda Raksha Shield Indicator */}
                  <rect x="155" y="125" width="90" height="110" rx="8" fill="#38bdf8" opacity="0.15" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="200" y="118" textAnchor="middle" className="text-[9px] font-mono font-bold fill-sky-700 dark:fill-sky-300">
                    {language === 'kn' ? 'ದೀಪದ ರಕ್ಷಣಾ ಕವಚ (Glass Guard)' : 'Protective Glass Chimney'}
                  </text>
                </svg>
              </div>

              <div className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-amber-700 dark:text-amber-300">
                  {language === 'kn' ? 'ದೀಪ ಮಂತ್ರ: ' : 'Deepa Shloka: '}
                </span>
                <span>
                  {language === 'kn'
                    ? 'ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ | ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ಸಂಧ್ಯಾ ದೀಪ ನಮೋಽಸ್ತು ತೇ ||'
                    : 'Deepajyotih Parabrahma Deepajyotir Janardanah | Deepo Haratu Me Papam Sandhya Deepa Namostu Te ||'}
                </span>
              </div>
            </div>

            {/* Vastu Rules Detail Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60">
                <h4 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'kn' ? 'ವಾಸ್ತು ದಿಕ್ಸೂಚಿ & ಫಲ ನಿರ್ಣಯ' : 'Vastu Directional Guidance & Fruit'}
                  </span>
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {language === 'kn'
                    ? 'ದೀಪದ ಮುಖವನ್ನು ಯಾವ ದಿಕ್ಕಿನಲ್ಲಿ ಇಡಬೇಕೆಂಬ ವೈದಿಕ ನಿಯಮಗಳು:'
                    : 'Authentic scriptural tenets for orienting the sacred eternal flame:'}
                </p>
              </div>

              {/* Direction Card List */}
              <div className="space-y-3">
                {['east', 'north', 'west', 'south'].map((dirKey) => {
                  const node = deepaNodes[dirKey];
                  const isSelected = highlightedPart === dirKey || (!highlightedPart && dirKey === 'east');
                  return (
                    <div
                      key={dirKey}
                      onClick={() => setHighlightedPart(dirKey)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${node.color} ${
                        isSelected ? 'ring-2 ring-amber-400 shadow-md scale-[1.01]' : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif font-black text-sm">
                          {node.title[language]}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/50">
                          {node.rule[language]}
                        </span>
                      </div>
                      <p className="text-xs mt-1.5 leading-relaxed">
                        {node.desc[language]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Crucial Maintenance Rules Card */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300/80 dark:border-stone-800 text-xs space-y-2">
                <h5 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'kn' ? 'ಅಖಂಡ ದೀಪ ಪಾಲನೆಯ ಸುವರ್ಣ ನಿಯಮಗಳು' : 'Golden Rules for Akhanda Deepa'}</span>
                </h5>
                <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                  <li>
                    {language === 'kn'
                      ? 'ಬತ್ತಿ ಸರಿಪಡಿಸುವಾಗ ಅಥವಾ ಎಣ್ಣೆ ತುಂಬುವಾಗ ಪಕ್ಕದಲ್ಲಿ "ಸಾಕ್ಷಿ ದೀಪ"ವನ್ನು ಬೆಳಗಿಸಿಕೊಂಡು ನಂತರವೇ ಮುಖ್ಯ ದೀಪದ ಬತ್ತಿಯನ್ನು ಸರಿಪಡಿಸಬೇಕು.'
                      : 'Always light an auxiliary "Sakshi Deepa" before trimming or adjusting the wick of the Akhanda Deepa.'}
                  </li>
                  <li>
                    {language === 'kn'
                      ? 'ದೀಪದ ಕೆಳಗೆ ನೇರವಾಗಿ ನೆಲಕ್ಕೆ ತಾಗದಂತೆ ತಾಮ್ರದ ಅಥವಾ ಹಿತ್ತಾಳೆಯ ತಟ್ಟೆಯಲ್ಲಿ ಅಕ್ಕಿ/ಧಾನ್ಯಗಳನ್ನು ಹರಡಿ ಅದರ ಮೇಲೆ ಇಡಬೇಕು.'
                      : 'Never place the lamp directly on bare floor; place on a brass/copper platter bedded with raw rice.'}
                  </li>
                  <li>
                    {language === 'kn'
                      ? 'ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ ಅಥವಾ ಕಪ್ಪು ಎಳ್ಳೆಣ್ಣೆ (ತಿಲ ತೈಲ) ಮಾತ್ರ ಬಳಸಬೇಕು.'
                      : 'Use only pure cow ghee or unadulterated sesame (til) oil.'}
                  </li>
                </ul>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COMPREHENSIVE GUIDE: POOJA SEATING, ROOM VASTU & RIGHT VS LEFT HAND DEEPA */}
            {/* ========================================================================= */}
            <div className="lg:col-span-12 mt-6 pt-6 border-t-2 border-amber-300/80 dark:border-stone-800 space-y-6">
              
              {/* Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
                    🧭
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-base sm:text-lg">
                      {language === 'kn'
                        ? 'ಪೂಜಾ ಆಸನ, ದೇವರ ಕೋಣೆ ವಾಸ್ತು & ದೀಪದ ಬಲ-ಎಡ ಕೈ ಸ್ಥಾನ ನಿರ್ಣಯ'
                        : language === 'hi'
                        ? 'पूजा आसन दिशा, देवगृह वास्तु एवं दीप का दायां-बायां स्थान विधान'
                        : 'Puja Seating Direction, Room Vastu & Deepa Right vs Left Hand Placement'}
                    </h4>
                    <p className="text-xs text-amber-100 mt-0.5">
                      {language === 'kn'
                        ? 'ವ್ಯಕ್ತಿಯ ಮುಖಸ್ಥಿತಿ, ದೇವರ ಕೋಣೆಯ ದಿಕ್ಕು, ದೇವತೆಯ ಬಲ-ಎಡ ಹಾಗೂ ದೀಪದ ಮುಖದ ನಿಖರ ಶಾಸ್ತ್ರೀಯ ನಿಯಮಗಳು.'
                        : 'Authentic Agama and Vastu tenets governing seating posture, shrine alignment, and right vs left hand lamp placement.'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/25 text-amber-200 self-start sm:self-auto border border-white/20">
                  {language === 'kn' ? 'ಆಗಮ & ವಾಸ್ತು ಶಾಸ್ತ್ರ ಪ್ರಮೇಯ' : 'Agama & Vastu Shastra'}
                </div>
              </div>

              {/* 3 Core Pillars: Room Direction, Seating Direction, Right vs Left Hand */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Pooja Room Direction (ದೇವರ ಕೋಣೆ ದಿಕ್ಕು) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-300 dark:border-stone-700 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                      ೧
                    </span>
                    <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {language === 'kn' ? 'ದೇವರ ಕೋಣೆಯ ವಾಸ್ತು ದಿಕ್ಕು' : language === 'hi' ? 'पूजा कक्ष (देवगृह) की दिशा' : 'Pooja Room Vastu Direction'}
                    </h5>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        ⭐ {language === 'kn' ? 'ಈಶಾನ್ಯ ಕೋನ (North-East - ಈಶಾನ ಮೂಲೆ):' : 'North-East Corner (Ishanya):'}
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 mt-0.5 text-[11.5px]">
                        {language === 'kn'
                          ? 'ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಹಾಗೂ ಪ್ರಶಸ್ತ ದಿಕ್ಕು (ದೇವ ಮೂಲ). ಗುರು ಮತ್ತು ಶಿವನ ಆವಾಸಸ್ಥಾನವಾಗಿದ್ದು ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿಯ ಉಗಮ.'
                          : 'Supreme and foremost location (Deva Moola). Ruled by Ishana (Shiva) & Brihaspati (Jupiter).'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        ✔ {language === 'kn' ? 'ಪೂರ್ವ (East) ಅಥವಾ ಉತ್ತರ (North):' : 'East or North Alternative:'}
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 mt-0.5 text-[11px]">
                        {language === 'kn'
                          ? 'ಈಶಾನ್ಯ ಅಸಾಧ್ಯವಾದರೆ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿನ ಗೋಡೆಯಲ್ಲಿ ದೇವರ ಕೋಣೆ ನಿರ್ಮಿಸಬಹುದು.'
                          : 'Second best alternatives if North-East corner is physically unviable.'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-800 dark:text-red-300 text-[11px] font-medium">
                      ⛔ {language === 'kn' ? 'ನೈಋತ್ಯ (South-West) ಹಾಗೂ ದಕ್ಷಿಣದಲ್ಲಿ ದೇವರ ಕೋಣೆ ಇರಬಾರದು.' : 'Strictly avoid South-West (Nairutya) or South.'}
                    </div>
                  </div>
                </div>

                {/* 2. Person Seating Direction (ಪೂಜೆ ಮಾಡುವ ವ್ಯಕ್ತಿ ಕುಳಿತುಕೊಳ್ಳಬೇಕಾದ ದಿಕ್ಕು) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border-2 border-orange-300 dark:border-stone-700 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-orange-500 text-white text-xs font-black flex items-center justify-center">
                      ೨
                    </span>
                    <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {language === 'kn' ? 'ವ್ಯಕ್ತಿಯ ಮುಖಸ್ಥಿತಿ (ಯಾವ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಬೇಕು)' : language === 'hi' ? 'पूजाकर्ता का मुख (बैठने की दिशा)' : 'Devotee Seating Direction'}
                    </h5>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        👑 {language === 'kn' ? 'ಪೂರ್ವ ಮುಖ (East Facing) — ಅತ್ಯುತ್ತಮ:' : 'East Facing — Supreme (Uttama):'}
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 mt-0.5 text-[11.5px]">
                        {language === 'kn'
                          ? 'ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತು ಪೂಜಿಸುವುದು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ. ಇದು ಸೂರ್ಯ ತೇಜಸ್ಸು, ಜ್ಞಾನೋದಯ, ಆಯುಷ್ಯ, ಹಾಗೂ ಏಕಾಗ್ರತೆ ನೀಡುತ್ತದೆ.'
                          : 'Sitting facing East attracts solar prana, spiritual intellect, memory retention, and vitality.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        ✔ {language === 'kn' ? 'ಉತ್ತರ ಮುಖ (North Facing) — ಶುಭ:' : 'North Facing — Auspicious:'}
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 mt-0.5 text-[11px]">
                        {language === 'kn'
                          ? 'ಕುಬೇರ ಮತ್ತು ಸೋಮ (ಚಂದ್ರ)ನ ದಿಕ್ಕು. ಧನ-ಧಾನ್ಯ, ಆರ್ಥಿಕ ಸಮೃದ್ಧಿ ಹಾಗೂ ಮನಃಶಾಂತಿಗೆ ಪ್ರಶಸ್ತ.'
                          : 'Channels Kubera and Soma energies for righteous wealth and peace.'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-800 dark:text-red-300 text-[11px] font-bold">
                      🚫 {language === 'kn' ? 'ದಕ್ಷಿಣ ಮುಖವಾಗಿ ಕುಳಿತು ದೇವಪೂಜೆ ಎಂದಿಗೂ ಮಾಡಬಾರದು! (ಕೇವಲ ಪಿತೃ ಕರ್ಮಕ್ಕೆ ಮಾತ್ರ).' : 'Never sit facing South for divine worship (reserved solely for Pitru tarpana).'}
                    </div>
                  </div>
                </div>

                {/* 3. Right Hand vs Left Hand Deepa Rule */}
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-600 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-600 text-white text-xs font-black flex items-center justify-center">
                      ೩
                    </span>
                    <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {language === 'kn' ? 'ಬಲಗೈ vs ಎಡಗೈ ಕಡೆ ದೀಪದ ನಿಯಮ' : language === 'hi' ? 'दायां हाथ बनाम बायां हाथ दीप विधान' : 'Right vs Left Hand Deepa Rule'}
                    </h5>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-300 dark:border-stone-700">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block">
                        📜 {language === 'kn' ? 'ಮೂಲ ಶಾಸ್ತ್ರೀಯ ನಿಯಮ (ಆಗಮ ಸೂತ್ರ):' : 'Scriptural Agamic Principle:'}
                      </span>
                      <p className="font-mono text-stone-800 dark:text-stone-200 mt-0.5 text-[11px] italic">
                        {language === 'kn'
                          ? '«ದೇವಸ್ಯ ದಕ್ಷಿಣೇ ದೀಪಃ» — ದೇವತೆಯ ಬಲಭಾಗದಲ್ಲಿ ದೀಪವನ್ನು ಸ್ಥಾಪಿಸಬೇಕು.'
                          : '«Devasya Dakshine Deepah» — Place lamp to the Deity’s Right.'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-[11.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                      {language === 'kn' ? (
                        <>
                          ವ್ಯಕ್ತಿಯು <strong>ಪೂರ್ವ ಮುಖವಾಗಿ</strong> ಕುಳಿತಾಗ:
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li>ವ್ಯಕ್ತಿಯ <strong>ಎಡಗೈ ಕಡೆ (Left Hand)</strong> = <strong>ಉತ್ತರ ದಿಕ್ಕು (North)</strong> = <strong>ದೇವತೆಯ ಬಲಭಾಗ</strong>!</li>
                            <li>ವ್ಯಕ್ತಿಯ <strong>ಬಲಗೈ ಕಡೆ (Right Hand)</strong> = <strong>ದಕ್ಷಿಣ ದಿಕ್ಕು (South)</strong> = <strong>ದೇವತೆಯ ಎಡಭಾಗ</strong>!</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          When devotee sits <strong>facing East</strong>:
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li>Devotee’s <strong>Left Hand Side</strong> = <strong>North</strong> = <strong>Deity’s Right</strong>!</li>
                            <li>Devotee’s <strong>Right Hand Side</strong> = <strong>South</strong> = <strong>Deity’s Left</strong>!</li>
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-[11px] font-bold">
                      💡 {language === 'kn' ? 'ತುಪ್ಪದ ದೀಪ / ಅಖಂಡ ದೀಪ: ದೇವತೆಯ ಬಲಕ್ಕೆ = ವ್ಯಕ್ತಿಯ ಎಡಗೈ ಕಡೆ (ಉತ್ತರ ದಿಕ್ಕಿನಲ್ಲಿ) ಇಡಬೇಕು!' : 'Ghee / Akhanda Deepa: Place on Deity’s Right = Devotee’s Left Hand side (North)!'}
                    </div>
                  </div>
                </div>

              </div>

              {/* Graphical Layout & Detailed Orientation Diagram */}
              <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-stone-900/90 border border-amber-300/80 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-800 pb-3">
                  <h5 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span className="text-xl">🪑</span>
                    <span>
                      {language === 'kn'
                        ? 'ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತಾಗ: ಬಲಗೈ (ದಕ್ಷಿಣ) vs ಎಡಗೈ (ಉತ್ತರ) ದೀಪ ವಿನ್ಯಾಸ ರೇಖಾಚಿತ್ರ'
                        : 'East-Facing Seating: Right Hand (South) vs Left Hand (North) Diagram'}
                    </span>
                  </h5>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    Vedic Orientation
                  </span>
                </div>

                {/* Visual Spatial Box Representation */}
                <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl bg-white dark:bg-stone-950 border-2 border-dashed border-amber-400 dark:border-stone-700 relative">
                  
                  {/* Top: EAST (PUJA ALTAR / DEITY) */}
                  <div className="text-center p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700">
                    <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 block">
                      ⬆ ಪೂರ್ವ ದಿಕ್ಕು (EAST) — ದೇವರ ಮಂಟಪ / ಪೂಜಾ ವೇದಿಕೆ (DEITY FACING WEST)
                    </span>
                    <span className="text-sm font-serif font-black text-stone-900 dark:text-stone-100">
                      🔱 ಶ್ರೀ ದೇವರ ಪೀಠ (Mandir / Murti / Kalasha)
                    </span>
                  </div>

                  {/* Middle Row: Left (North) vs Right (South) */}
                  <div className="grid grid-cols-2 gap-4 my-4">
                    
                    {/* LEFT HAND SIDE: NORTH (DEITY'S RIGHT) */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-700 text-center space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                        ⬅ ಎಡಗೈ ಕಡೆ (DEVOTEE'S LEFT HAND)
                      </span>
                      <div className="font-serif font-black text-sm text-emerald-900 dark:text-emerald-100">
                        ಉತ್ತರ ದಿಕ್ಕು (NORTH)
                      </div>
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        «ದೇವತೆಯ ಬಲಭಾಗ (Deity's Right)»
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-emerald-300 text-left text-[11px] space-y-0.5 mt-2">
                        <span className="font-black text-stone-900 dark:text-stone-100 block">
                          🧈 ತುಪ್ಪದ ದೀಪ (Ghee Lamp) / ಅಖಂಡ ದೀಪ
                        </span>
                        <span className="text-emerald-800 dark:text-emerald-300 font-semibold block">
                          ಫಲ: ಮಹಾಲಕ್ಷ್ಮಿ & ಕುಬೇರ ಕೃಪೆ, ಅಷ್ಟೈಶ್ವರ್ಯ, ಧನವೃದ್ಧಿ.
                        </span>
                      </div>
                    </div>

                    {/* RIGHT HAND SIDE: SOUTH (DEITY'S LEFT) */}
                    <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 border-2 border-orange-400 dark:border-orange-700 text-center space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300 block">
                        ಬಲಗೈ ಕಡೆ (DEVOTEE'S RIGHT HAND) ➡
                      </span>
                      <div className="font-serif font-black text-sm text-orange-900 dark:text-orange-100">
                        ದಕ್ಷಿಣ ದಿಕ್ಕು (SOUTH)
                      </div>
                      <div className="text-xs font-bold text-orange-700 dark:text-orange-400">
                        «ದೇವತೆಯ ಎಡಭಾಗ (Deity's Left)»
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-orange-300 text-left text-[11px] space-y-0.5 mt-2">
                        <span className="font-black text-stone-900 dark:text-stone-100 block">
                          🪔 ಎಳ್ಳೆಣ್ಣೆ ದೀಪ (Sesame Oil Lamp)
                        </span>
                        <span className="text-orange-800 dark:text-orange-300 font-semibold block">
                          ಫಲ: ಶತ್ರು ಶಮನ, ದೃಷ್ಟಿ ದೋಷ ಹಾಗೂ ಗ್ರಹ ಪೀಡಾ ಪರಿಹಾರ.
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom: DEVOTEE SEATED FACING EAST (WEST BEHIND) */}
                  <div className="text-center p-3.5 rounded-xl bg-amber-500/20 border-2 border-amber-500 text-stone-900 dark:text-stone-100 space-y-1">
                    <span className="text-2xl block">🧘</span>
                    <span className="font-serif font-black text-sm block text-amber-950 dark:text-amber-200">
                      {language === 'kn'
                        ? 'ಪೂಜಕ / ಭಕ್ತರ ಆಸನ (ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತಿರುವುದು)'
                        : 'Devotee Seated Position (Facing Eastwards)'}
                    </span>
                    <span className="text-xs text-stone-600 dark:text-stone-400 block font-medium">
                      ⬇ ಪಶ್ಚಿಮ ದಿಕ್ಕು (WEST — ಭಕ್ತರ ಬೆನ್ನಿನ ಕಡೆ)
                    </span>
                  </div>

                </div>

                {/* 4-Direction Deepa Flame Results Table (ದೀಪದ ಮುಖ & ಫಲಗಳು) */}
                <div className="space-y-3 pt-2">
                  <h6 className="font-serif font-black text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>🔥</span>
                    <span>
                      {language === 'kn'
                        ? 'ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಯಾವ ದಿಕ್ಕಿಗೆ ಇಟ್ಟರೆ ಏನು ಫಲ? (೪ ದಿಕ್ಕುಗಳ ನಿಖರ ಫಲ)'
                        : 'Results of Deepa Flame Orientations Across 4 Cardinal Directions'}
                    </span>
                  </h6>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    {/* East */}
                    <div className="p-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs text-emerald-900 dark:text-emerald-200">
                          ೧. ಪೂರ್ವ ಮುಖ (East)
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                          ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        {language === 'kn' ? 'ಆಯುಷ್ಯ & ಆರೋಗ್ಯ ವೃದ್ಧಿ' : 'Health & Longevity'}
                      </p>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                        {language === 'kn'
                          ? 'ದೀರ್ಘಾಯುಷ್ಯ, ಉತ್ತಮ ಆರೋಗ್ಯ, ತೇಜಸ್ಸು ಹಾಗೂ ಮನಃಶಾಂತಿ ಲಭಿಸುತ್ತದೆ. ದುಃಖ ಹಾಗೂ ರೋಗ ನಿವಾರಣೆ.'
                          : 'Confers longevity, radiant health, vitality, dispels sorrow and diseases.'}
                      </p>
                    </div>

                    {/* North */}
                    <div className="p-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs text-emerald-900 dark:text-emerald-200">
                          ೨. ಉತ್ತರ ಮುಖ (North)
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                          ಅತ್ಯಂತ ಶುಭ
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        {language === 'kn' ? 'ಧನ ಪ್ರಾಪ್ತಿ & ಸಮೃದ್ಧಿ' : 'Wealth & Prosperity'}
                      </p>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                        {language === 'kn'
                          ? 'ಕುಬೇರ ಮತ್ತು ಮಹಾಲಕ್ಷ್ಮಿಯ ಕೃಪೆ ಲಭಿಸಿ ಆರ್ಥಿಕ ಅಭಿವೃದ್ಧಿ, ವ್ಯಾಪಾರ ಲಾಭ ಹಾಗೂ ದಾರಿದ್ರ್ಯ ನಾಶವಾಗುತ್ತದೆ.'
                          : 'Channels Kubera and Lakshmi blessings for boundless wealth, growth, and eliminating poverty.'}
                      </p>
                    </div>

                    {/* West */}
                    <div className="p-3.5 rounded-xl border-2 border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs text-amber-900 dark:text-amber-200">
                          ೩. ಪಶ್ಚಿಮ ಮುಖ (West)
                        </span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-white">
                          ಮಧ್ಯಮ / ವರ್ಜ್ಯ
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        {language === 'kn' ? 'ಋಣ & ಶತ್ರು ಬಾಧೆ' : 'Debts & Hostility'}
                      </p>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                        {language === 'kn'
                          ? 'ಸಾಮಾನ್ಯ ಪೂಜೆಗೆ ವರ್ಜ್ಯ. ಪಶ್ಚಿಮ ಮುಖದ ಜ್ಯೋತಿಯು ಸಾಲದ ಬಾಧೆ ಅಥವಾ ಮಾನಸಿಕ ಅಶಾಂತಿ ಉಂಟುಮಾಡಬಹುದು.'
                          : 'Discouraged for regular puja; can attract lingering debts and mental unrest.'}
                      </p>
                    </div>

                    {/* South */}
                    <div className="p-3.5 rounded-xl border-2 border-red-500 bg-red-50/60 dark:bg-red-950/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-black text-xs text-red-900 dark:text-red-200">
                          ೪. ದಕ್ಷಿಣ ಮುಖ (South)
                        </span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                          ಸಂಪೂರ್ಣ ನಿಷೇಧ!
                        </span>
                      </div>
                      <p className="text-xs font-bold text-red-700 dark:text-red-300">
                        {language === 'kn' ? 'ಹಾನಿ & ಕಷ್ಟ (ವರ್ಜ್ಯ)' : 'STRICTLY PROHIBITED'}
                      </p>
                      <p className="text-[11px] text-red-800 dark:text-red-300 leading-snug">
                        {language === 'kn'
                          ? 'ಜ್ಯೋತಿಯನ್ನು ಎಂದಿಗೂ ದಕ್ಷಿಣಕ್ಕೆ ಇಡಬಾರದು! ಇದು ಯಮನ ದಿಕ್ಕಾಗಿದ್ದು, ಅಪಮೃತ್ಯು ಭಯ ಮತ್ತು ನಷ್ಟ ತರಬಹುದು.'
                          : 'Never point wick flame South. Realm of Yama; causes grief, loss, and spiritual impediment.'}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Final Golden Summary */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-2 border-amber-400 dark:border-amber-700 text-xs text-stone-900 dark:text-stone-100 flex items-start gap-3">
                  <span className="text-2xl mt-0.5 shrink-0">✨</span>
                  <div className="space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-300 text-sm block">
                      {language === 'kn' ? 'ಶ್ರೇಷ್ಠ ದೀಪ ಪಾಲನೆಯ ಅಂತಿಮ ಸಾರಾಂಶ (Golden Summary):' : 'Golden Summary of Deepa Placement:'}
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-stone-800 dark:text-stone-200">
                      {language === 'kn'
                        ? 'ನೀವು ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತು ಪೂಜಿಸುವಾಗ, ದೇವರ ಕೋಣೆಯ ಈಶಾನ್ಯ ಅಥವಾ ಉತ್ತರ ಭಾಗದಲ್ಲಿ (ನಿಮ್ಮ ಎಡಗೈ ಕಡೆಗೆ ಬರುವಂತೆ) ಅಕ್ಕಿ ಹರಡಿದ ತಟ್ಟೆಯ ಮೇಲೆ ದೀಪವನ್ನು ಸ್ಥಾಪಿಸಿ. ದೀಪದ ಬತ್ತಿಯ ಮುಖವನ್ನು ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ಇರಿಸಿ ಬೆಳಗಿಸುವುದು ಅತ್ಯಂತ ಶುಭಪ್ರದ ಹಾಗೂ ಸಕಲ ಸಿದ್ಧಿದಾಯಕ.'
                        : 'When sitting facing East, place the sacred lamp on a grain platter situated towards the North or North-East (which falls on your LEFT HAND side). Orient the wick tip towards East or North for maximum spiritual illumination and auspicious prosperity.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
