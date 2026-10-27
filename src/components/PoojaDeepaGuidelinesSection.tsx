import React, { useState } from 'react';
import {
  Compass,
  Flame,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Grid,
  Table,
  User,
  HelpCircle,
  Check,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Language } from '../types';

export interface PoojaDeepaGuidelinesSectionProps {
  language: Language;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}

export type CardinalDirection = 'east' | 'north' | 'west' | 'south';

export interface DirectionTooltipData {
  name: Record<Language, string>;
  rulingDeity: Record<Language, string>;
  element: Record<Language, string>;
  sthaapanaSignificance: Record<Language, string>;
  seatingSignificance: Record<Language, string>;
  doshaOrFruit: Record<Language, string>;
}

export interface GridCombinationData {
  roomDir: CardinalDirection;
  seatDir: CardinalDirection;
  rating: 'supreme' | 'auspicious' | 'moderate' | 'inauspicious' | 'prohibited';
  ratingLabel: Record<Language, string>;
  deepaHandPlacement: Record<Language, string>;
  deepaCompassDirection: Record<Language, string>;
  flameDirection: Record<Language, string>;
  spiritualOutcome: Record<Language, string>;
  detailedExplanation: Record<Language, string>;
  shastricRule: Record<Language, string>;
}

// Direction Tooltips Data (for interactive hover cards)
export const DIRECTION_TOOLTIPS: Record<CardinalDirection, DirectionTooltipData> = {
  east: {
    name: {
      kn: 'ಪೂರ್ವ (East / ಇಂದ್ರ & ಸೂರ್ಯ ದಿಕ್ಕು)',
      hi: 'पूर्व दिशा (East / इन्द्र एवं सूर्य)',
      en: 'East Direction (Purva / Solar Axis)'
    },
    rulingDeity: {
      kn: 'ದೇವತೆ: ಇಂದ್ರ ಹಾಗೂ ಭಗವಾನ್ ಸೂರ್ಯ ನಾರಾಯಣ',
      hi: 'देवता: देवराज इन्द्र एवं भगवान सूर्यनारायण',
      en: 'Deities: Lord Indra & Lord Surya Narayana'
    },
    element: {
      kn: 'ತತ್ವ: ಅಗ್ನಿ/ಪ್ರಾಣ ತತ್ವ • ಉಷಃಕಾಲದ ಚೈತನ್ಯ',
      hi: 'तत्त्व: अग्नि/प्राण तत्त्व • प्रभात ऊर्जा',
      en: 'Element: Prana & Solar Radiance'
    },
    sthaapanaSignificance: {
      kn: 'ಪೂರ್ವದಲ್ಲಿ ದೇವರ ಕೋಣೆ ಅಥವಾ ಪೂಜಾ ವೇದಿಕೆ ಸ್ಥಾಪಿಸಿದರೆ ಸೂರ್ಯೋದಯದ ಮೊದಲ ಶುದ್ಧ ಕಿರಣಗಳು ಪೂಜಾ ಕೋಣೆಯನ್ನು ಪಾವನಗೊಳಿಸುತ್ತವೆ. ಆರೋಗ್ಯ, ಯಶಸ್ಸು ಹಾಗೂ ಜ್ಞಾನ ವೃದ್ಧಿಯಾಗುತ್ತದೆ.',
      hi: 'पूर्व दिशा में पूजा गृह स्थापित करने से प्रातःकालीन सूर्य की पावन रश्मियां मंदिर को पवित्र करती हैं। यह आरोग्य, ज्ञान और कीर्ति प्रदाता है।',
      en: 'Setting the shrine in the East welcomes sunrise vibrations, dispelling stagnant energy and consecrating the sanctum with life-giving vitality.'
    },
    seatingSignificance: {
      kn: 'ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ (Paramottama): ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತು ಪೂಜಿಸುವುದು ಸರ್ವೋತ್ತಮ. ಇದು ಬುದ್ಧಿ ಶಕ್ತಿ, ಏಕಾಗ್ರತೆ, ಜ್ಞಾನೋದಯ ಹಾಗೂ ದೀರ್ಘಾಯುಷ್ಯವನ್ನು ನೀಡುತ್ತದೆ.',
      hi: 'परमोत्तम (Supreme): पूर्व दिशा की ओर मुख करके बैठना सर्वश्रेष्ठ है। यह तीक्ष्ण मेधा, ध्यान, दीर्घायु एवं आत्मबल प्रदान करता है।',
      en: 'Supreme Posture (Paramottama): Sitting facing East aligns the practitioner with the solar meridian, sharpening intellect, focus, and longevity.'
    },
    doshaOrFruit: {
      kn: 'ಶುಭ ಫಲ: ಆಯುರ್ವೃದ್ಧಿ, ಆರೋಗ್ಯ ಭಾಗ್ಯ ಹಾಗೂ ತೇಜಸ್ಸು. ಯಾವುದೇ ದೋಷವಿಲ್ಲ.',
      hi: 'शुभ फल: दीर्घायु, तेजस्विता एवं आरोग्यता। सर्वथा दोषरहित।',
      en: 'Fruit: Longevity, vitality, radiant health, and spiritual intellect.'
    }
  },
  north: {
    name: {
      kn: 'ಉತ್ತರ (North / ಕುಬೇರ & ಸೋಮ ದಿಕ್ಕು)',
      hi: 'उत्तर दिशा (North / कुबेर एवं सोम)',
      en: 'North Direction (Uttara / Kubera Axis)'
    },
    rulingDeity: {
      kn: 'ದೇವತೆ: ಯಕ್ಷರಾಜ ಕುಬೇರ ಹಾಗೂ ಚಂದ್ರ/ಬುಧ ದೇವತೆ',
      hi: 'देवता: कुबेर देव एवं चंद्र/बुध ग्रह',
      en: 'Deities: Lord Kubera (Treasurer) & Soma (Moon)'
    },
    element: {
      kn: 'ತತ್ವ: ಜಲ/ಚೈತನ್ಯ ತತ್ವ • ಕಾಂತೀಯ ಶಕ್ತಿ (Magnetic Axis)',
      hi: 'तत्त्व: जल/शीतलता • चुम्बकीय ऊर्जा प्रवाह',
      en: 'Element: Magnetic Polar Axis & Abundance'
    },
    sthaapanaSignificance: {
      kn: 'ಉತ್ತರದಲ್ಲಿ ದೇವರ ಕೋಣೆ ಇರಿಸುವುದು ಮಹಾಲಕ್ಷ್ಮಿ ಮತ್ತು ಕುಬೇರನ ಅಧಿಷ್ಠಾನ. ಇದು ವ್ಯಾಪಾರಾಭಿವೃದ್ಧಿ, ಹಣಕಾಸಿನ ಸಮೃದ್ಧಿ ಮತ್ತು ಸ್ಥಿರ ಸಂಪತ್ತನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ.',
      hi: 'उत्तर में पूजा स्थान स्थापित करना कुबेर एवं महालक्ष्मी का आह्वान है। यह व्यापार वृद्धि, अटूट धन एवं ऐश्वर्य प्रदान करता है।',
      en: 'Shrines in the North draw magnetic abundance and celestial liquid wealth, supporting commerce, debt relief, and serene domestic bliss.'
    },
    seatingSignificance: {
      kn: 'ಅತ್ಯಂತ ಶುಭ (Highly Auspicious): ಉತ್ತರ ಮುಖವಾಗಿ ಕುಳಿತು ಪೂಜಿಸುವುದು ಆರ್ಥಿಕ ಸಮೃದ್ಧಿ, ದಾರಿದ್ರ್ಯ ನಾಶ ಹಾಗೂ ಮನಸ್ಸಿಗೆ ಅಖಂಡ ಶಾಂತಿಯನ್ನು ತರುತ್ತದೆ.',
      hi: 'अत्यंत शुभ (Auspicious): उत्तर मुखी बैठकर पूजन करने से दारिद्र्य नाश, वित्तीय संवृद्धि एवं मानसिक शान्ति प्राप्त होती है।',
      en: 'Highly Auspicious (Shubha): Facing North synchronizes with Earth’s magnetic flux, calming thoughts and ushering material prosperity.'
    },
    doshaOrFruit: {
      kn: 'ಶುಭ ಫಲ: ಅಷ್ಟೈಶ್ವರ್ಯ, ಧನಲಾಭ ಹಾಗೂ ಕುಬೇರ ಕೃಪೆ.',
      hi: 'शुभ फल: अष्टैश्वर्य, व्यापारिक लाभ एवं धन स्थिरता।',
      en: 'Fruit: Ashta Aishwarya (8-fold wealth), prosperity, and mental clarity.'
    }
  },
  west: {
    name: {
      kn: 'ಪಶ್ಚಿಮ (West / ವರುಣ & ಶನಿ ದಿಕ್ಕು)',
      hi: 'पश्चिम दिशा (West / वरुण एवं शनि)',
      en: 'West Direction (Pashchima / Varuna Axis)'
    },
    rulingDeity: {
      kn: 'ದೇವತೆ: ವರುಣ ದೇವ (ಜಲಪತಿ) ಹಾಗೂ ಶನೈಶ್ಚರ',
      hi: 'देवता: वरुण देव (जलपति) एवं शनि देव',
      en: 'Deities: Lord Varuna (Waters) & Shani (Saturn)'
    },
    element: {
      kn: 'ತತ್ವ: ವಾಯು/ಸಂಜೆ ತತ್ವ • ಕರ್ಮ ಫಲ ನಿಯಾಮಕ',
      hi: 'तत्त्व: वायु/संध्या काल • कर्मफल नियंता',
      en: 'Element: Dusk, Introspection & Karma'
    },
    sthaapanaSignificance: {
      kn: 'ಪಶ್ಚಿಮದಲ್ಲಿ ಪೂಜಾ ಕೋಣೆ ಸಾಧಾರಣ/ಮಧ್ಯಮ ಫಲಪ್ರದ. ಇದು ಸಂಧ್ಯಾಕಾಲದ ಪೂಜೆ ಹಾಗೂ ಕರ್ಮ ಶುದ್ಧಿಗೆ ಸಹಕಾರಿ, ಆದರೆ ಪ್ರಾತಃಕಾಲದ ಚೈತನ್ಯ ಕಡಿಮೆ.',
      hi: 'पश्चिम में पूजा कक्ष मध्यम फलदायी है। यह संध्याकालीन साधना व आत्मनिरीक्षण हेतु उपयुक्त है किन्तु प्रातःकालीन ऊर्जा क्षीण रहती है।',
      en: 'West shrines are moderate; suitable for evening sandhyavandana and disciplined sadhana, but lack the vibrant morning prana.'
    },
    seatingSignificance: {
      kn: 'ಮಧ್ಯಮ ಫಲ (Madhyama): ಪಶ್ಚಿಮಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತು ಪೂಜಿಸುವುದು ಸಾಧಾರಣ. ಶತ್ರು ಶಮನ ಮತ್ತು ವಿವಾದ ಪರಿಹಾರಕ್ಕೆ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ, ಆದರೆ ದೈನಂದಿನ ದೇವಪೂಜೆಗೆ ಪೂರ್ವ/ಉತ್ತರವೇ ಶ್ರೇಷ್ಠ.',
      hi: 'मध्यम (Moderate): पश्चिम मुखी बैठकर पूजन करना सामान्य फल देता है। यह विघ्न-शत्रु शमन हेतु उपयोगी है, नित्य पूजा हेतु पूर्व/उत्तर श्रेष्ठ हैं।',
      en: 'Moderate (Madhyama): Permissible for overcoming obstacles or evening meditation, but requires extra effort to sustain mental dynamism.'
    },
    doshaOrFruit: {
      kn: 'ಮಧ್ಯಮ ಫಲ: ವಿಳಂಬ ಫಲ, ಸಾಧಾರಣ ಪ್ರಗತಿ. ಸತತ ಪ್ರಯತ್ನ ಅಗತ್ಯ.',
      hi: 'मध्यम फल: सामान्य फल एवं विलम्ब। अधिक तपस्या की आवश्यकता।',
      en: 'Fruit: Moderate progress, endurance, neutralization of adversaries.'
    }
  },
  south: {
    name: {
      kn: 'ದಕ್ಷಿಣ (South / ಯಮ & ಪಿತೃ ದಿಕ್ಕು - ವರ್ಜ್ಯ)',
      hi: 'दक्षिण दिशा (South / यम एवं पितृ - वर्जित)',
      en: 'South Direction (Dakshina / Yama Realm)'
    },
    rulingDeity: {
      kn: 'ದೇವತೆ: ಯಮಧರ್ಮರಾಜ ಹಾಗೂ ಪಿತೃ ದೇವತೆಗಳು',
      hi: 'देवता: यमराज एवं पितृगण',
      en: 'Deities: Lord Yama (Dharma/Death) & Ancestral Pitrus'
    },
    element: {
      kn: 'ತತ್ವ: ಭೂಮಿ/ತಾಮಸಿಕ ತತ್ವ • ಪಿತೃ ಕಾರ್ಯ ಕ್ಷೇತ್ರ',
      hi: 'तत्त्व: पृथ्वी/तामसिक तत्त्व • पितृ कर्म क्षेत्र',
      en: 'Element: Transition & Ancestral Realm'
    },
    sthaapanaSignificance: {
      kn: 'ಸಂಪೂರ್ಣ ನಿಷೇಧ (Strictly Prohibited): ದಕ್ಷಿಣದಲ್ಲಿ ದೇವಪೂಜಾ ಮಂದಿರ ಸ್ಥಾಪಿಸಬಾರದು! ಇದು ಯಮನ ದಿಕ್ಕಾಗಿದ್ದು, ಮನೆಯಲ್ಲಿ ಕಲಹ, ಅನಾರೋಗ್ಯ ಮತ್ತು ಆರ್ಥಿಕ ನಷ್ಟ ತರಬಹುದು.',
      hi: 'सर्वथा वर्जित (Prohibited): दक्षिण दिशा में देव मंदिर कदापि स्थापित न करें। यह यम की दिशा होने से गृह-क्लेश, रोग एवं धनहानि कराती है।',
      en: 'Strictly Prohibited for Devapuja: South is the realm of departure. Placing deities here causes financial drain, friction, and loss of aura.'
    },
    seatingSignificance: {
      kn: 'ದೇವಪೂಜೆಗೆ ನಿಷಿದ್ಧ (Nishiddha): ದಕ್ಷಿಣ ಮುಖವಾಗಿ ಕುಳಿತು ಎಂದಿಗೂ ದೇವಪೂಜೆ ಮಾಡಬಾರದು. ಇದು ಕೇವಲ ಪಿತೃ ತರ್ಪಣ/ಶ್ರಾದ್ಧ ಕರ್ಮಗಳಿಗೆ ಮಾತ್ರ ಸೀಮಿತ.',
      hi: 'देवपूजन में निषेध (Prohibited): दक्षिण मुखी होकर देवपूजा कभी न करें। यह केवल पितृ तर्पण एवं श्राद्ध कर्म हेतु निर्दिष्ट है।',
      en: 'Strictly Forbidden for Divine Worship: Sitting facing South induces spiritual depression and vital fatigue; strictly reserved for ancestral Shraddha rites.'
    },
    doshaOrFruit: {
      kn: 'ದೋಷ: ಅಪಮೃತ್ಯು ಭಯ, ಕಷ್ಟ-ನಷ್ಟ ಹಾಗೂ ಅಶಾಂತಿ (ಕಡ್ಡಾಯವಾಗಿ ವರ್ಜಿಸಿ).',
      hi: 'दोष: अशान्ति, धनहानि एवं अमंगल। सर्वथा त्यागें।',
      en: 'Severity: Inauspicious for puja; causes energy depletion and obstacles.'
    }
  }
};

// 4x4 Grid Matrix Combinations (16 Comprehensive Cells)
export const POOJA_DEEPA_4X4_GRID: GridCombinationData[] = [
  // ROW 1: EAST ROOM (ಪೂರ್ವ ಕೋಣೆ)
  {
    roomDir: 'east',
    seatDir: 'east',
    rating: 'supreme',
    ratingLabel: {
      kn: 'ಪರಮೋತ್ತಮ (Supreme / ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ)',
      hi: 'परमोत्तम (Supreme / सर्वश्रेष्ठ)',
      en: 'Paramottama (Supreme / Ideal Alignment)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು) = ದೇವತೆಯ ಬಲಭಾಗ',
      hi: 'भक्त के बाएं हाथ की ओर (उत्तर दिशा) = देव का दायां भाग',
      en: 'Devotee’s Left Hand Side (North) = Deity’s Right Side'
    },
    deepaCompassDirection: {
      kn: 'ಉತ್ತರ (North) ಅಥವಾ ಈಶಾನ್ಯ (North-East)',
      hi: 'उत्तर अथवा ईशान कोण',
      en: 'North (Uttara) or North-East (Ishanya)'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿಗೆ',
      hi: 'ज्योति का मुख पूर्व अथवा उत्तर दिशा',
      en: 'Flame Wicks pointing East or North'
    },
    spiritualOutcome: {
      kn: 'ಆಯುರ್ವೃದ್ಧಿ, ಉತ್ತಮ ಆರೋಗ್ಯ, ಮಹಾಲಕ್ಷ್ಮಿ & ಕುಬೇರ ಕೃಪೆ, ದಾರಿದ್ರ್ಯ ನಾಶ ಹಾಗೂ ಅಷ್ಟೈಶ್ವರ್ಯ ಪ್ರಾಪ್ತಿ.',
      hi: 'दीर्घायु, उत्तम स्वास्थ्य, महालक्ष्मी-कुबेर कृपा, दारिद्र्य नाश एवं अष्टैश्वर्य प्राप्ति।',
      en: 'Radiant longevity, supreme health, continuous flow of Lakshmi-Kubera wealth, and peace of mind.'
    },
    detailedExplanation: {
      kn: 'ಪೂರ್ವದಲ್ಲಿ ದೇವರ ಮಂದಿರವಿದ್ದು, ನೀವು ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತಾಗ ದೇವತೆಯು ಪಶ್ಚಿಮ ಮುಖವಾಗಿರುತ್ತದೆ. ಆಗ ದೇವತೆಯ ಬಲಭಾಗವು ಉತ್ತರವಾಗಿದ್ದು, ಅದು ನಿಮ್ಮ ಎಡಗೈ ಕಡೆಯಾಗುತ್ತದೆ. ತುಪ್ಪದ ದೀಪವನ್ನು ನಿಮ್ಮ ಎಡಗೈ ಕಡೆ (ಉತ್ತರದಲ್ಲಿ) ಸ್ಥಾಪಿಸಿ ಪೂರ್ವಕ್ಕೆ ಜ್ಯೋತಿ ಇಡುವುದು ಅಗ್ರಗಣ್ಯ.',
      hi: 'पूर्व के मंदिर में पूर्व मुखी बैठने पर देव पश्चिम मुखी होते हैं। देव का दायां भाग उत्तर है जो आपका बायां हाथ बनता है। घृत दीप बाएं हाथ (उत्तर) रखकर ज्योति पूर्व रखें।',
      en: 'In an East sanctum with devotee facing East, Deity faces West. Deity’s right is North (devotee’s left). Pure ghee lamp placed on devotee’s left facing East confers boundless bliss.'
    },
    shastricRule: {
      kn: '«ದೇವಸ್ಯ ದಕ್ಷಿಣೇ ಭಾಗೇ ದೀಪರಾಜಂ ನಿಧಾಪಯೇತ್» — ದೇವತೆಯ ಬಲಕ್ಕೆ (ವ್ಯಕ್ತಿಯ ಎಡಕ್ಕೆ) ತುಪ್ಪದ ದೀಪ.',
      hi: '«देवस्य दक्षिणे भागे दीपराजं निधापयेत्» — देव के दाएं (भक्त के बाएं) घृत दीप।',
      en: '«Devasya Dakshine Deepah» — Ghee lamp on Deity’s right hand side (devotee’s left).'
    }
  },
  {
    roomDir: 'east',
    seatDir: 'north',
    rating: 'auspicious',
    ratingLabel: {
      kn: 'ಶುಭಪ್ರದ (Highly Auspicious)',
      hi: 'अति शुभ (Highly Auspicious)',
      en: 'Shubha-Prada (Highly Auspicious)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಪಶ್ಚಿಮ ದಿಕ್ಕು) ಅಥವಾ ಈಶಾನ್ಯ ಕೋನದಲ್ಲಿ',
      hi: 'भक्त के बाएं हाथ (पश्चिम) अथवा ईशान कोण में',
      en: 'Devotee’s Left Hand Side (West) or North-East corner'
    },
    deepaCompassDirection: {
      kn: 'ಈಶಾನ್ಯ (North-East) ಅಥವಾ ಉತ್ತರ',
      hi: 'ईशान अथवा उत्तर दिशा',
      en: 'North-East (Ishanya) or North'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಕಡ್ಡಾಯವಾಗಿ ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ ಇರಬೇಕು (ಪಶ್ಚಿಮಕ್ಕೆ ತಿರುಗಿಸಬೇಡಿ)',
      hi: 'ज्योति का मुख उत्तर अथवा पूर्व रखें (पश्चिम न करें)',
      en: 'Flame Wicks strictly pointing North or East'
    },
    spiritualOutcome: {
      kn: 'ಧನ ಸಮೃದ್ಧಿ, ವ್ಯಾಪಾರ ಲಾಭ, ಸಾಲ ಮುಕ್ತಿ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಏಕಾಗ್ರತೆ.',
      hi: 'धन-धान्य, व्यापारिक संवृद्धि, ऋण मुक्ति एवं आध्यात्मिक एकाग्रता।',
      en: 'Financial stability, business growth, freedom from liabilities, and meditative calm.'
    },
    detailedExplanation: {
      kn: 'ಉತ್ತರ ಮುಖವಾಗಿ ಕುಳಿತಾಗ ಎಡಗೈ ಕಡೆ ಪಶ್ಚಿಮವಾಗುತ್ತದೆ. ದೀಪವನ್ನು ಪಶ್ಚಿಮದಲ್ಲಿದ್ದರೂ ಜ್ಯೋತಿಯನ್ನು ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಬೆಳಗಿಸಬೇಕು.',
      hi: 'उत्तर मुखी बैठने पर बायां हाथ पश्चिम होता है। दीप को ईशान या उत्तर कोण में रखकर ज्योति उत्तर रखें।',
      en: 'When sitting facing North, left hand faces West. Place lamp towards the North-East corner with wicks burning North.'
    },
    shastricRule: {
      kn: 'ಉತ್ತರ ಮುಖ ಪೂಜೆಯಲ್ಲಿ ದೀಪದ ಜ್ಯೋತಿಯು ಉತ್ತರಕ್ಕೇ ಮುಖ ಮಾಡಿರಬೇಕು.',
      hi: 'उत्तर मुखी पूजन में दीप ज्योति उत्तर मुखी ही फलदायी है।',
      en: 'In North-facing sadhana, the flame must direct its light towards the North.'
    }
  },
  {
    roomDir: 'east',
    seatDir: 'west',
    rating: 'moderate',
    ratingLabel: {
      kn: 'ಮಧ್ಯಮ ಫಲ (Moderate / Secondary)',
      hi: 'मध्यम फल (Moderate)',
      en: 'Madhyama (Moderate / Requires Care)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಬಲಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು) = ದೇವತೆಯ ಬಲಭಾಗ',
      hi: 'भक्त के दाएं हाथ की ओर (उत्तर) = देव का दायां भाग',
      en: 'Devotee’s Right Hand Side (North) = Deity’s Right'
    },
    deepaCompassDirection: {
      kn: 'ಉತ್ತರ ದಿಕ್ಕು (North)',
      hi: 'उत्तर दिशा (North)',
      en: 'North Direction'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಪೂರ್ವಕ್ಕೆ (ಮಂದಿರದ ಕಡೆಗೆ)',
      hi: 'ज्योति का मुख पूर्व की ओर',
      en: 'Flame facing East towards the shrine'
    },
    spiritualOutcome: {
      kn: 'ಶತ್ರು ಶಾಂತಿ, ಸಂಜೆ ಪೂಜೆಯಲ್ಲಿ ಸಾಧಾರಣ ಶುಭ, ಆದರೆ ತೇಜಸ್ಸು ಹಾಗೂ ಶೀಘ್ರ ಫಲ ಕಡಿಮೆ.',
      hi: 'शत्रु शमन, सामान्य फल प्राप्ति, प्रातःकालीन ऊर्जा की न्यूनता।',
      en: 'Subduing adversaries, moderate returns, slower manifestation of wishes.'
    },
    detailedExplanation: {
      kn: 'ಪಶ್ಚಿಮ ಮುಖವಾಗಿ ಕುಳಿತಾಗ ನಿಮ್ಮ ಬಲಗೈ ಕಡೆ ಉತ್ತರವಾಗುತ್ತದೆ. ದೇವತೆಯ ಬಲಭಾಗವನ್ನು ಕಾಪಾಡಲು ದೀಪವನ್ನು ನಿಮ್ಮ ಬಲಗೈ ಕಡೆ (ಉತ್ತರದಲ್ಲಿ) ಇರಿಸಿ ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಬೇಕು.',
      hi: 'पश्चिम मुखी बैठने पर दायां हाथ उत्तर होता है। दीप दाएं हाथ रखकर ज्योति पूर्व रखें।',
      en: 'Facing West places North to your right. Place the lamp to your right side (North) so flame faces the East altar.'
    },
    shastricRule: {
      kn: 'ಪಶ್ಚಿಮ ಮುಖ ದೀಪವು ಋಣ ಬಾಧೆ ತರಬಹುದು; ಆದ್ದರಿಂದ ಜ್ಯೋತಿಯನ್ನು ಪೂರ್ವಕ್ಕೆ ತಿರುಗಿಸಿ.',
      hi: 'पश्चिम मुखी ज्योति ऋण कारक है, अतः ज्योति पूर्व रखें।',
      en: 'Avoid westward flames; always direct wick toward the East altar.'
    }
  },
  {
    roomDir: 'east',
    seatDir: 'south',
    rating: 'prohibited',
    ratingLabel: {
      kn: 'ಸಂಪೂರ್ಣ ನಿಷಿದ್ಧ (Strictly Prohibited)',
      hi: 'सर्वथा वर्जित (Strictly Prohibited)',
      en: 'Nishiddha (Strictly Prohibited)'
    },
    deepaHandPlacement: {
      kn: 'ದೇವಪೂಜೆಗೆ ದಕ್ಷಿಣ ಮುಖ ನಿಷಿದ್ಧ — ದೀಪ ಹಚ್ಚುವುದು ವರ್ಜ್ಯ',
      hi: 'देवपूजा में दक्षिण मुख वर्जित है',
      en: 'South-facing seating strictly prohibited for devapuja'
    },
    deepaCompassDirection: {
      kn: 'ವರ್ಜ್ಯ (Inauspicious)',
      hi: 'अशुभ (Inauspicious)',
      en: 'Prohibited Orientation'
    },
    flameDirection: {
      kn: 'ದಕ್ಷಿಣಕ್ಕೆ ದೀಪ ಬೆಳಗಿಸಬಾರದು',
      hi: 'दक्षिण दिशा में दीप न जलाएं',
      en: 'Never direct flame toward South'
    },
    spiritualOutcome: {
      kn: 'ಅಶಾಂತಿ, ಮನೆಯಲ್ಲಿ ಕಲಹ, ಅಪಮೃತ್ಯು ಭಯ ಹಾಗೂ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಪ್ರವೇಶ.',
      hi: 'अशान्ति, क्लेश, नकारात्मक ऊर्जा का प्रवेश एवं विघ्न।',
      en: 'Severe spiritual obstruction, domestic strife, anxiety, and loss of aura.'
    },
    detailedExplanation: {
      kn: 'ದಕ್ಷಿಣಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತು ದೇವಪೂಜೆ ಮಾಡುವುದು ಸಂಪೂರ್ಣ ಶಾಸ್ತ್ರವಿರೋಧ. ಇದು ಕೇವಲ ಪಿತೃ ಕರ್ಮಕ್ಕೆ ಮಾತ್ರ. ದಯವಿಟ್ಟು ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      hi: 'दक्षिण मुखी होकर देवपूजा सर्वथा शास्त्रों में वर्जित है। कृपया पूर्व अथवा उत्तर मुखी होकर बैठें।',
      en: 'Sitting facing South for divine worship violates Agamic principles. Transition posture immediately to East or North.'
    },
    shastricRule: {
      kn: '«ದಕ್ಷಿಣಾಭಿಮುಖೋ ಭೂತ್ವಾ ನ ಕುರ್ಯಾದ್ದೇವತಾರ್ಚನಮ್» — ದಕ್ಷಿಣ ಮುಖವಾಗಿ ದೇವಪೂಜೆ ಮಾಡಬಾರದು.',
      hi: '«दक्षिणाभिमुखो भूत्वा न कुर्याद्देवार्चनम्» — दक्षिण मुखी देवपूजा न करें।',
      en: 'Agama injunction: Never perform divine worship facing South.'
    }
  },

  // ROW 2: NORTH ROOM (ಉತ್ತರ ಕೋಣೆ / ಈಶಾನ್ಯ)
  {
    roomDir: 'north',
    seatDir: 'east',
    rating: 'supreme',
    ratingLabel: {
      kn: 'ಪರಮೋತ್ತಮ (Supreme / ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ)',
      hi: 'परमोत्तम (Supreme / सर्वश्रेष्ठ)',
      en: 'Paramottama (Supreme / Most Fortunate)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು) = ಮಂದಿರದ ಪ್ರಧಾನ ಆಸನ',
      hi: 'भक्त के बाएं हाथ (उत्तर दिशा)',
      en: 'Devotee’s Left Hand Side (North / Altar Side)'
    },
    deepaCompassDirection: {
      kn: 'ಉತ್ತರ (North) ಅಥವಾ ಈಶಾನ್ಯ (North-East)',
      hi: 'उत्तर अथवा ईशान कोण',
      en: 'North or North-East'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ',
      hi: 'ज्योति का मुख पूर्व अथवा उत्तर',
      en: 'Flame pointing East or North'
    },
    spiritualOutcome: {
      kn: 'ಕುಬೇರ ಕೃಪೆ, ಅಗಾಧ ಐಶ್ವರ್ಯ ವೃದ್ಧಿ, ಉನ್ನತ ಪದವಿ, ಹಾಗೂ ಕುಟುಂಬದಲ್ಲಿ ಶಾಂತಿ-ಸೌಖ್ಯ.',
      hi: 'कुबेर कृपा, अपार धन संवृद्धि, पदोन्नति एवं पारिवारिक सुख।',
      en: 'Vast accumulation of wealth, high social honor, and undisturbed family peace.'
    },
    detailedExplanation: {
      kn: 'ಉತ್ತರ ಕೋಣೆಯಲ್ಲಿ ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತು ಪೂಜಿಸುವುದು ವಾಸ್ತುವಿನಲ್ಲಿ ಸ್ವರ್ಣ ಯೋಗ. ನಿಮ್ಮ ಎಡಗೈ ಕಡೆ ಉತ್ತರವಾಗಿದ್ದು, ಅಲ್ಲಿ ತುಪ್ಪದ ದೀಪ ಸ್ಥಾಪಿಸುವುದು ಅಕ್ಷಯ ಧನ ತರುತ್ತದೆ.',
      hi: 'उत्तर कक्ष में पूर्व मुखी बैठना वास्तु का स्वर्ण योग है। बाएं हाथ (उत्तर) घृत दीप स्थापित करने से धन अक्षय रहता है।',
      en: 'Sitting East-facing inside a North room forms the Golden Vastu Axis. Ghee lamp on left (North) opens the gateway of celestial abundance.'
    },
    shastricRule: {
      kn: 'ಉತ್ತರ ಮತ್ತು ಪೂರ್ವಗಳ ಸಂಗಮವು ಸಕಲ ದೇವತೆಗಳ ಆಶೀರ್ವಾದದ ನೆಲೆ.',
      hi: 'उत्तर एवं पूर्व का संगम समस्त देवों की कृपा स्थली है।',
      en: 'Convergence of North and East represents the divine throne of Brihaspati and Kubera.'
    }
  },
  {
    roomDir: 'north',
    seatDir: 'north',
    rating: 'auspicious',
    ratingLabel: {
      kn: 'ಅತಿ ಶುಭಪ್ರದ (Highly Auspicious)',
      hi: 'अति शुभप्रद (Highly Auspicious)',
      en: 'Ati-Shubha (Abundant Fortune)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಪಶ್ಚಿಮ/ಈಶಾನ್ಯ) ಅಥವಾ ನೇರವಾಗಿ ಮಂದಿರದ ಮುಂಭಾಗ',
      hi: 'भक्त के बाएं हाथ अथवा मंदिर के सम्मुख ईशान में',
      en: 'Devotee’s Left Hand Side (Ishanya Altar Corner)'
    },
    deepaCompassDirection: {
      kn: 'ಈಶಾನ್ಯ (North-East)',
      hi: 'ईशान कोण (North-East)',
      en: 'North-East (Ishanya Corner)'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಕಡ್ಡಾಯವಾಗಿ ಉತ್ತರ ದಿಕ್ಕಿಗೆ',
      hi: 'ज्योति का मुख उत्तर दिशा की ओर',
      en: 'Flame strictly facing North'
    },
    spiritualOutcome: {
      kn: 'ವ್ಯಾಪಾರದಲ್ಲಿ ದ್ವಿಗುಣ ಲಾಭ, ಸ್ಥಿರಾಸ್ತಿ ವೃದ್ಧಿ ಹಾಗೂ ತೇಜೋಮಯ ಜ್ಞಾನ.',
      hi: 'व्यापार में द्विगुण लाभ, संपत्ति वृद्धि एवं आध्यात्मिक ज्ञान।',
      en: 'Rapid commercial prosperity, asset appreciation, and meditative clarity.'
    },
    detailedExplanation: {
      kn: 'ಉತ್ತರ ಕೊಠಡಿಯಲ್ಲಿ ಉತ್ತರಕ್ಕೆ ಮುಖ ಮಾಡಿ ಮಂದಿರದ ಈಶಾನ್ಯದಲ್ಲಿ ದೀಪವಿರಿಸಿ ಜ್ಯೋತಿಯನ್ನು ಉತ್ತರಕ್ಕೆ ಬೆಳಗಿಸುವುದರಿಂದ ಕುಬೇರ ಕೃಪೆ ಸದಾ ನೆಲೆಸಿರುತ್ತದೆ.',
      hi: 'उत्तर कक्ष में उत्तर मुखी बैठकर ईशान में दीप रखें, ज्योति उत्तर रखने से कुबेर प्रसन्न रहते हैं।',
      en: 'North-facing devotion in a North room with flame pointing North invites continuous Lakshmi-Kubera resonance.'
    },
    shastricRule: {
      kn: '«ಉತ್ತರೇ ಧನಸಂಪತ್ತಿಃ» — ಉತ್ತರ ಮುಖಿ ದೀಪವು ಸಕಲ ಧನ-ಸಂಪತ್ತನ್ನು ತರುತ್ತದೆ.',
      hi: '«उत्तरे धनसंपत्तिः» — उत्तर मुखी दीप धनसंपत्ति प्रदाता है।',
      en: 'Scripture states: Northern flame produces inexhaustible prosperity.'
    }
  },
  {
    roomDir: 'north',
    seatDir: 'west',
    rating: 'moderate',
    ratingLabel: {
      kn: 'ಮಧ್ಯಮ ಫಲ (Moderate)',
      hi: 'मध्यम फल (Moderate)',
      en: 'Madhyama (Moderate)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಬಲಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು)',
      hi: 'भक्त के दाएं हाथ की ओर (उत्तर)',
      en: 'Devotee’s Right Hand Side (North)'
    },
    deepaCompassDirection: {
      kn: 'ಉತ್ತರ (North)',
      hi: 'उत्तर दिशा',
      en: 'North Direction'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಪೂರ್ವಕ್ಕೆ',
      hi: 'ज्योति का मुख पूर्व की ओर',
      en: 'Flame directed East'
    },
    spiritualOutcome: {
      kn: 'ಸಾಧಾರಣ ಧನಲಾಭ, ಆದರೆ ಕಠಿಣ ಪರಿಶ್ರಮ ಅಗತ್ಯ. ಶತ್ರು ಶಮನವಾಗುತ್ತದೆ.',
      hi: 'सामान्य लाभ, अधिक श्रम की आवश्यकता, विघ्न निवारण।',
      en: 'Moderate financial gains; requires extra diligence to manifest desires.'
    },
    detailedExplanation: {
      kn: 'ಉತ್ತರ ಕೊಠಡಿಯಲ್ಲಿದ್ದರೂ ಪಶ್ಚಿಮಕ್ಕೆ ಮುಖ ಮಾಡಿದಾಗ ಫಲವು ಮಂದಗತಿಯಾಗುತ್ತದೆ. ದೀಪವನ್ನು ನಿಮ್ಮ ಬಲಗೈ (ಉತ್ತರ) ಭಾಗದಲ್ಲಿ ಇರಿಸಿ ಜ್ಯೋತಿಯನ್ನು ಪೂರ್ವಕ್ಕೆ ಬೆಳಗಿಸಿ.',
      hi: 'उत्तर कक्ष में पश्चिम मुखी बैठने से गति मंद होती है। दीप दाएं हाथ उत्तर रखकर ज्योति पूर्व रखें।',
      en: 'Facing West in a North sanctum dampens speed. Keep lamp on right (North) with wicks turned East.'
    },
    shastricRule: {
      kn: 'ಸೂರ್ಯಾಭಿಮುಖ ಜ್ಯೋತಿಯು ಪಶ್ಚಿಮ ದಿಕ್ಕಿನ ಮಂದತೆಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ.',
      hi: 'पूर्वाभिमुखी ज्योति पश्चिम का दोष शमन करती है।',
      en: 'Directing the flame East counters the setting energy of West.'
    }
  },
  {
    roomDir: 'north',
    seatDir: 'south',
    rating: 'prohibited',
    ratingLabel: {
      kn: 'ಸಂಪೂರ್ಣ ನಿಷೇಧ (Strictly Prohibited)',
      hi: 'सर्वथा वर्जित (Prohibited)',
      en: 'Nishiddha (Strictly Prohibited)'
    },
    deepaHandPlacement: {
      kn: 'ದಕ್ಷಿಣ ಮುಖ ಪೂಜೆ ನಿಷೇಧ',
      hi: 'दक्षिण मुख पूजन वर्जित',
      en: 'South-facing seating prohibited'
    },
    deepaCompassDirection: {
      kn: 'ವರ್ಜ್ಯ (Inauspicious)',
      hi: 'अशुभ',
      en: 'Inauspicious'
    },
    flameDirection: {
      kn: 'ದಕ್ಷಿಣಕ್ಕೆ ದೀಪ ಬೆಳಗಿಸಬೇಡಿ',
      hi: 'दक्षिण में दीप न जलाएं',
      en: 'Never direct flame South'
    },
    spiritualOutcome: {
      kn: 'ಆರೋಗ್ಯ ಹಾನಿ, ಆರ್ಥಿಕ ಮುಗ್ಗಟ್ಟು, ಕೌಟುಂಬಿಕ ಕಿರಿಕಿರಿ.',
      hi: 'स्वास्थ्य हानि, वित्तीय संकट एवं मानसिक तनाव।',
      en: 'Financial constriction, chronic anxiety, and spiritual regression.'
    },
    detailedExplanation: {
      kn: 'ಕೊಠಡಿ ಉತ್ತರದಲ್ಲಿದ್ದರೂ ದಕ್ಷಿಣಕ್ಕೆ ಮುಖ ಮಾಡುವುದರಿಂದ ಯಮ ದೃಷ್ಟಿ ಉಂಟಾಗುತ್ತದೆ. ತಕ್ಷಣವೇ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಮುಖ ತಿರುಗಿಸಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      hi: 'उत्तर कक्ष में भी दक्षिण मुखी बैठना यम दृष्टि लाता है। पूर्व अथवा उत्तर मुखी होकर बैठें।',
      en: 'Even in an auspicious North room, sitting South-facing invokes ancestral Yama vibrations. Re-orient to East immediately.'
    },
    shastricRule: {
      kn: 'ದಕ್ಷಿಣ ಮುಖ ದೇವಪೂಜೆಗೆ ಶಾಸ್ತ್ರದಲ್ಲಿ ಅನುಮತಿಯಿಲ್ಲ.',
      hi: 'देवपूजा में दक्षिण मुख सर्वथा निषिद्ध है।',
      en: 'Canonical prohibition: No divine invocation may face South.'
    }
  },

  // ROW 3: WEST ROOM (ಪಶ್ಚಿಮ ಕೋಣೆ)
  {
    roomDir: 'west',
    seatDir: 'east',
    rating: 'auspicious',
    ratingLabel: {
      kn: 'ಉತ್ತಮ / ಶುಭಪ್ರದ (Good / Auspicious)',
      hi: 'उत्तम / शुभप्रद (Auspicious)',
      en: 'Shubha-Prada (Good / Rebalanced)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು)',
      hi: 'भक्त के बाएं हाथ (उत्तर दिशा)',
      en: 'Devotee’s Left Hand Side (North)'
    },
    deepaCompassDirection: {
      kn: 'ಉತ್ತರ (North) ಅಥವಾ ಈಶಾನ್ಯ',
      hi: 'उत्तर अथवा ईशान कोण',
      en: 'North or North-East'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಪೂರ್ವಕ್ಕೆ (ಮಂದಿರದ ಪೀಠದ ಕಡೆ)',
      hi: 'ज्योति का मुख पूर्व की ओर',
      en: 'Flame pointing East'
    },
    spiritualOutcome: {
      kn: 'ಕಷ್ಟಗಳ ನಿವಾರಣೆ, ಸ್ಥಿರ ಮನಸ್ಸು, ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಹಾಗೂ ಸಾಲ ಬಾಧೆಯಿಂದ ಮುಕ್ತಿ.',
      hi: 'कष्ट निवारण, स्थिर बुद्धि, मानसिक शान्ति एवं ऋणमुक्ति।',
      en: 'Overcoming adversity, emotional resilience, gradual debt clearance, and peace.'
    },
    detailedExplanation: {
      kn: 'ಪಶ್ಚಿಮದ ಕೊಠಡಿಯಲ್ಲಿ ಪೂರ್ವ ಮುಖವಾಗಿ ಕುಳಿತುಕೊಳ್ಳುವುದರಿಂದ ಪಶ್ಚಿಮದ ದೋಷ ಪರಿಹಾರವಾಗುತ್ತದೆ. ನಿಮ್ಮ ಎಡಗೈ ಕಡೆ (ಉತ್ತರದಲ್ಲಿ) ದೀಪವಿರಿಸಿ ಜ್ಯೋತಿಯನ್ನು ಪೂರ್ವಕ್ಕೆ ಬೆಳಗಿಸಿ.',
      hi: 'पश्चिम कक्ष में पूर्व मुखी बैठने से दोष निवारण होता है। बाएं हाथ (उत्तर) दीप रखकर ज्योति पूर्व रखें।',
      en: 'Facing East inside a West room neutralizes architectural flaws. Place lamp on left (North) with flame pointing East.'
    },
    shastricRule: {
      kn: 'ಪೂರ್ವ ಮುಖ ಆಸನವು ಪಶ್ಚಿಮದ ವಾಸ್ತು ದೋಷವನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ.',
      hi: 'पूर्वाभिमुख आसन पश्चिम के वास्तु दोष का शमन करता है।',
      en: 'East-facing devotee posture remediates Western room placement.'
    }
  },
  {
    roomDir: 'west',
    seatDir: 'north',
    rating: 'moderate',
    ratingLabel: {
      kn: 'ಮಧ್ಯಮ ಫಲ (Moderate)',
      hi: 'मध्यम फल (Moderate)',
      en: 'Madhyama (Moderate)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ ಅಥವಾ ಈಶಾನ್ಯದಲ್ಲಿ',
      hi: 'भक्त के बाएं हाथ अथवा ईशान में',
      en: 'Devotee’s Left Hand Side or Ishanya'
    },
    deepaCompassDirection: {
      kn: 'ಈಶಾನ್ಯ (North-East)',
      hi: 'ईशान कोण',
      en: 'North-East Corner'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ',
      hi: 'ज्योति का मुख उत्तर अथवा पूर्व',
      en: 'Flame facing North or East'
    },
    spiritualOutcome: {
      kn: 'ಆರ್ಥಿಕ ಸ್ಥಿರತೆ, ಆದರೆ ಫಲ ವಿಳಂಬ. ನಿರಂತರ ಜಪದಿಂದ ಶುಭ ಲಭ್ಯ.',
      hi: 'वित्तीय स्थिरता किन्तु विलम्ब, नित्य जप से सफलता।',
      en: 'Financial stability with deliberate, steady progress through regular japa.'
    },
    detailedExplanation: {
      kn: 'ಪಶ್ಚಿಮ ಕೋಣೆಯಲ್ಲಿ ಉತ್ತರ ಮುಖವಾಗಿ ಕುಳಿತು ಈಶಾನ್ಯದಲ್ಲಿ ದೀಪವಿಟ್ಟು ಉತ್ತರಕ್ಕೆ ಜ್ಯೋತಿ ಬೆಳಗಿಸುವುದು ಶುಭ.',
      hi: 'पश्चिम कक्ष में उत्तर मुखी बैठकर ईशान में दीप रखें, ज्योति उत्तर रखें।',
      en: 'Position lamp in the room’s North-East corner with wicks oriented North.'
    },
    shastricRule: {
      kn: 'ದೀಪದ ಜ್ಯೋತಿ ಉತ್ತರಕ್ಕಿದ್ದರೆ ಧನ ನಷ್ಟವಾಗುವುದಿಲ್ಲ.',
      hi: 'दीप ज्योति उत्तर रहने से धन हानि नहीं होती।',
      en: 'Northern wick alignment preserves wealth from expenditure.'
    }
  },
  {
    roomDir: 'west',
    seatDir: 'west',
    rating: 'inauspicious',
    ratingLabel: {
      kn: 'ವರ್ಜ್ಯ / ಅಶುಭ (Not Recommended)',
      hi: 'वर्जित / अवांछनीय (Avoid)',
      en: 'Varjya (Inauspicious / Unfavorable)'
    },
    deepaHandPlacement: {
      kn: 'ಪಶ್ಚಿಮ ಮುಖ ಆಸನ ಸಾಧಾರಣ ಪೂಜೆಗೆ ವರ್ಜ್ಯ',
      hi: 'पश्चिम मुख बैठकर नित्य पूजा अवांछनीय',
      en: 'West-facing sitting not recommended'
    },
    deepaCompassDirection: {
      kn: 'ವರ್ಜ್ಯ',
      hi: 'वर्जित',
      en: 'Unfavorable'
    },
    flameDirection: {
      kn: 'ಪಶ್ಚಿಮಕ್ಕೆ ಜ್ಯೋತಿ ಇಡಬೇಡಿ',
      hi: 'पश्चिम में ज्योति न रखें',
      en: 'Never direct wick Westward'
    },
    spiritualOutcome: {
      kn: 'ಸಾಲದ ಬಾಧೆ, ಶತ್ರು ಕಾಟ, ಮಾನಸಿಕ ಅಶಾಂತಿ ಹಾಗೂ ಅಪೂರ್ಣ ಕಾರ್ಯಗಳು.',
      hi: 'ऋण वृद्धि, शत्रु भय, मानसिक अशान्ति एवं कार्यों में बाधा।',
      en: 'Entanglement in debts, friction with rivals, and unfinished endeavors.'
    },
    detailedExplanation: {
      kn: 'ಪಶ್ಚಿಮ ಕೊಠಡಿಯಲ್ಲಿ ಪಶ್ಚಿಮಕ್ಕೆ ಮುಖ ಮಾಡಿ ಪೂಜಿಸುವುದು ಸೂರ್ಯಾಸ್ತದ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಿ ಆಲಸ್ಯ ಹಾಗೂ ಸಾಲಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು. ದಯವಿಟ್ಟು ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ.',
      hi: 'पश्चिम कक्ष में पश्चिम मुखी बैठना आलस्य एवं ऋण का कारण बन सकता है। कृपया पूर्व मुखी बैठें।',
      en: 'Sitting West-facing inside a West room accelerates sunset entropy. Pivot your seat to face East.'
    },
    shastricRule: {
      kn: '«ಪ್ರತೀಚ್ಯಾಂ ಋಣಸಂಭವಃ» — ಪಶ್ಚಿಮ ಮುಖಿ ದೀಪವು ಋಣವನ್ನು ತರಬಹುದು.',
      hi: '«प्रतीच्यां ऋणसंभवः» — पश्चिम मुखी दीप ऋण कारक हो सकता है।',
      en: 'Agama warning: Western wick direction can cultivate persistent debts.'
    }
  },
  {
    roomDir: 'west',
    seatDir: 'south',
    rating: 'prohibited',
    ratingLabel: {
      kn: 'ಸಂಪೂರ್ಣ ನಿಷೇಧ (Strictly Prohibited)',
      hi: 'सर्वथा वर्जित (Prohibited)',
      en: 'Nishiddha (Strictly Prohibited)'
    },
    deepaHandPlacement: {
      kn: 'ದೇವಪೂಜೆಗೆ ನಿಷಿದ್ಧ',
      hi: 'देवपूजा में वर्जित',
      en: 'Prohibited for puja'
    },
    deepaCompassDirection: {
      kn: 'ವರ್ಜ್ಯ',
      hi: 'अशुभ',
      en: 'Prohibited'
    },
    flameDirection: {
      kn: 'ದಕ್ಷಿಣಕ್ಕೆ ಜ್ಯೋತಿ ಇಡಬಾರದು',
      hi: 'दक्षिण में ज्योति न रखें',
      en: 'Never flame South'
    },
    spiritualOutcome: {
      kn: 'ತೀವ್ರ ಅಶಾಂತಿ, ಅಪಜಯ ಹಾಗೂ ಧನ ನಷ್ಟ.',
      hi: 'तीव्र अशान्ति, पराजय एवं धन हानि।',
      en: 'Severe mental anguish, financial losses, and failure in endeavors.'
    },
    detailedExplanation: {
      kn: 'ದಕ್ಷಿಣ ಮುಖವಾಗಿ ಕುಳಿತುಕೊಳ್ಳುವುದು ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ದೇವಪೂಜೆಗೆ ಅನುಮತಿಯಿಲ್ಲ.',
      hi: 'दक्षिण मुखी बैठकर पूजन किसी भी स्थिति में स्वीकार्य नहीं।',
      en: 'South-facing seating is strictly barred from all auspicious Vedic rituals.'
    },
    shastricRule: {
      kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕು ಯಮ ದಿಕ್ಕು — ದೇವಪೂಜೆಗೆ ವರ್ಜ್ಯ.',
      hi: 'दक्षिण यम की दिशा है, देवपूजा में त्याज्य।',
      en: 'South is Yama’s realm; strictly forbidden for divine invocations.'
    }
  },

  // ROW 4: SOUTH ROOM (ದಕ್ಷಿಣ ಕೋಣೆ - ವಾಸ್ತು ಪ್ರಕಾರ ದೇವರ ಕೋಣೆಗೆ ವರ್ಜ್ಯ)
  {
    roomDir: 'south',
    seatDir: 'east',
    rating: 'moderate',
    ratingLabel: {
      kn: 'ಶಾಂತಿ ಉಪಾಯದೊಂದಿಗೆ ಮಧ್ಯಮ (Remedial Moderate)',
      hi: 'शान्ति उपाय सहित मध्यम (Remedial)',
      en: 'Remedial Moderate (Needs Vastu Remedy)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ (ಉತ್ತರ ದಿಕ್ಕು) ಧಾನ್ಯ ತಟ್ಟೆಯ ಮೇಲೆ',
      hi: 'भक्त के बाएं हाथ (उत्तर) धान्य पीठ पर',
      en: 'Devotee’s Left Hand Side (North) atop Grain Pedestal'
    },
    deepaCompassDirection: {
      kn: 'ಈಶಾನ್ಯ (North-East) ಅಥವಾ ಉತ್ತರ',
      hi: 'ईशान अथवा उत्तर दिशा',
      en: 'North-East or North'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಕಡ್ಡಾಯವಾಗಿ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ',
      hi: 'ज्योति का मुख पूर्व अथवा उत्तर ही रखें',
      en: 'Flame strictly facing East or North'
    },
    spiritualOutcome: {
      kn: 'ದಕ್ಷಿಣದ ದೋಷವು ಪೂರ್ವ ಮುಖ ಆಸನದಿಂದ ಶಮನವಾಗುತ್ತದೆ; ಆರೋಗ್ಯ ಮತ್ತು ರಕ್ಷಣೆ ಲಭ್ಯ.',
      hi: 'पूर्व मुखी बैठने से दक्षिण का दोष शमित होता है, सुरक्षा प्राप्त होती है।',
      en: 'Eastward devotee posture counteracts the southern room flaw; protects health.'
    },
    detailedExplanation: {
      kn: 'ಸಾಮಾನ್ಯವಾಗಿ ದಕ್ಷಿಣದಲ್ಲಿ ದೇವರ ಕೋಣೆ ಇರಬಾರದು. ಅನಿವಾರ್ಯವಾದಲ್ಲಿ, ನೀವು ಕಡ್ಡಾಯವಾಗಿ ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತು, ಎಡಗೈ ಕಡೆ (ಉತ್ತರದಲ್ಲಿ) ದೀಪವಿಟ್ಟು ಪೂರ್ವಕ್ಕೆ ಜ್ಯೋತಿ ಬೆಳಗಿಸಬೇಕು.',
      hi: 'दक्षिण में पूजा घर नहीं होना चाहिए। विवशता में पूर्व मुखी बैठकर बाएं हाथ (उत्तर) दीप रखें, ज्योति पूर्व रखें।',
      en: 'South rooms are discouraged for mandirs. If unavoidable, strictly sit facing East and light a pure ghee lamp on your left (North) facing East.'
    },
    shastricRule: {
      kn: 'ಪೂರ್ವ ಮುಖ ಪ್ರಾರ್ಥನೆಯು ದಕ್ಷಿಣದ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಯನ್ನು ತಡೆದು ರಕ್ಷಿಸುತ್ತದೆ.',
      hi: 'पूर्वाभिमुख प्रार्थना दक्षिण की नकारात्मकता से रक्षा करती है।',
      en: 'East-facing meditation shields against south-facing environmental friction.'
    }
  },
  {
    roomDir: 'south',
    seatDir: 'north',
    rating: 'moderate',
    ratingLabel: {
      kn: 'ಶಾಂತಿ ಉಪಾಯದೊಂದಿಗೆ ಮಧ್ಯಮ (Remedial Moderate)',
      hi: 'उपाय सहित मध्यम (Remedial)',
      en: 'Remedial Moderate (Remedy Required)'
    },
    deepaHandPlacement: {
      kn: 'ಭಕ್ತರ ಎಡಗೈ ಕಡೆಗೆ ಅಥವಾ ಕೋಣೆಯ ಈಶಾನ್ಯ ಮೂಲೆಯಲ್ಲಿ',
      hi: 'भक्त के बाएं हाथ अथवा ईशान कोण में',
      en: 'Devotee’s Left Hand Side (Ishanya Corner)'
    },
    deepaCompassDirection: {
      kn: 'ಈಶಾನ್ಯ (North-East)',
      hi: 'ईशान कोण',
      en: 'North-East'
    },
    flameDirection: {
      kn: 'ಜ್ಯೋತಿಯ ಮುಖ ಉತ್ತರಕ್ಕೆ ಕಡ್ಡಾಯವಾಗಿ',
      hi: 'ज्योति का मुख अनिवार्यतः उत्तर रखें',
      en: 'Flame strictly pointing North'
    },
    spiritualOutcome: {
      kn: 'ಕುಬೇರ ಕೃಪೆಯಿಂದ ನಷ್ಟ ಪರಿಹಾರ, ಆದರೆ ಧಾರ್ಮಿಕ ವ್ರತ ಪಾಲನೆ ಅತ್ಯಗತ್ಯ.',
      hi: 'कुबेर कृपा से संकट शमन, नियमों का कठोर पालन आवश्यक।',
      en: 'Kubera energy mitigates loss, provided sacred cleanliness is upheld.'
    },
    detailedExplanation: {
      kn: 'ದಕ್ಷಿಣ ಕೋಣೆಯಲ್ಲಿದ್ದರೂ ಉತ್ತರಕ್ಕೆ ಮುಖ ಮಾಡಿ ಕುಳಿತು ಈಶಾನ್ಯದಲ್ಲಿ ದೀಪವಿಟ್ಟು ಉತ್ತರಕ್ಕೆ ಜ್ಯೋತಿ ಬೆಳಗಿಸುವುದು ಪರಿಹಾರ ಕ್ರಮ.',
      hi: 'दक्षिण कक्ष में उत्तर मुखी बैठकर ईशान में दीप रखें, ज्योति उत्तर रखें।',
      en: 'Counteract southern room dosha by sitting facing North with northern flame.'
    },
    shastricRule: {
      kn: 'ಉತ್ತರಾಭಿಮುಖ ಜ್ಯೋತಿಯು ಕುಬೇರ ರಕ್ಷಣೆ ಒದಗಿಸುತ್ತದೆ.',
      hi: 'उत्तराभिमुख ज्योति कुबेर रक्षा कवच बनाती है।',
      en: 'North-pointing flames construct a defensive aura against obstacles.'
    }
  },
  {
    roomDir: 'south',
    seatDir: 'west',
    rating: 'inauspicious',
    ratingLabel: {
      kn: 'ಅಶುಭ / ದೋಷಯುಕ್ತ (Inauspicious)',
      hi: 'अशुभ / दोषयुक्त (Inauspicious)',
      en: 'Inauspicious (Double Vastu Dosha)'
    },
    deepaHandPlacement: {
      kn: 'ವರ್ಜ್ಯ — ಸ್ಥಾನ ಬದಲಾಯಿಸಿ',
      hi: 'अशुभ — दिशा परिवर्तित करें',
      en: 'Inauspicious — Re-align posture'
    },
    deepaCompassDirection: {
      kn: 'ದೋಷಯುಕ್ತ',
      hi: 'दोषयुक्त',
      en: 'Afflicted'
    },
    flameDirection: {
      kn: 'ಪಶ್ಚಿಮ/ದಕ್ಷಿಣಕ್ಕೆ ದೀಪ ಬೆಳಗಿಸಬೇಡಿ',
      hi: 'पश्चिम अथवा दक्षिण में दीप न जलाएं',
      en: 'Do not burn wicks West or South'
    },
    spiritualOutcome: {
      kn: 'ಆರ್ಥಿಕ ಮುಗ್ಗಟ್ಟು, ಸಾಲ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಭಂಗ.',
      hi: 'आर्थिक संकट, ऋण वृद्धि, मानसिक अशान्ति।',
      en: 'Persistent financial strain, sluggish vitality, and domestic unease.'
    },
    detailedExplanation: {
      kn: 'ದಕ್ಷಿಣ ಕೊಠಡಿ ಮತ್ತು ಪಶ್ಚಿಮ ಮುಖ ಆಸನ ಎರಡೂ ಸೇರಿ ದ್ವಿಗುಣ ದೋಷ ಉಂಟಾಗುತ್ತದೆ. ಪೂಜಾ ಆಸನವನ್ನು ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಬದಲಾಯಿಸಿ.',
      hi: 'दक्षिण कक्ष एवं पश्चिम मुखी दोनों मिलकर द्विगुण वास्तु दोष बनाते हैं। आसन पूर्व या उत्तर बदलें।',
      en: 'Combines southern room placement with sunset westward facing. Transition seat immediately to East or North.'
    },
    shastricRule: {
      kn: 'ದ್ವಿಗುಣ ದೋಷ ನಿವಾರಣೆಗೆ ಪೂರ್ವಾಭಿಮುಖ ಆಸನ ಕಡ್ಡಾಯ.',
      hi: 'दोष निवारण हेतु पूर्व मुखी आसन अनिवार्य है।',
      en: 'Mandatory remedy: Pivot seating to face East.'
    }
  },
  {
    roomDir: 'south',
    seatDir: 'south',
    rating: 'prohibited',
    ratingLabel: {
      kn: 'ಮಹಾ ನಿಷಿದ್ಧ / ತೀವ್ರ ವರ್ಜ್ಯ (Severely Prohibited)',
      hi: 'महा निषिद्ध / सर्वथा त्याज्य (Severely Prohibited)',
      en: 'Maha-Nishiddha (Severely Prohibited)'
    },
    deepaHandPlacement: {
      kn: 'ಸಂಪೂರ್ಣ ನಿಷೇಧ — ದೇವಪೂಜೆ ಮಾಡಬಾರದು',
      hi: 'पूर्णतः वर्जित — देवपूजा न करें',
      en: 'Total Agamic prohibition'
    },
    deepaCompassDirection: {
      kn: 'ಸಂಪೂರ್ಣ ವರ್ಜ್ಯ',
      hi: 'पूर्णतः वर्जित',
      en: 'Completely Inauspicious'
    },
    flameDirection: {
      kn: 'ದಕ್ಷಿಣಕ್ಕೆ ಜ್ಯೋತಿ ಇಡಬಾರದು',
      hi: 'दक्षिण में ज्योति कदापि न रखें',
      en: 'Never direct wick toward South'
    },
    spiritualOutcome: {
      kn: 'ಘೋರ ದೋಷ, ಮನೆಯಲ್ಲಿ ಅನಾರೋಗ್ಯ, ಆಪತ್ತು ಹಾಗೂ ನಷ್ಟ. (ಕಡ್ಡಾಯವಾಗಿ ತ್ಯಜಿಸಿ).',
      hi: 'घोर दोष, रोग, संकट एवं सर्वनाश का भय। सर्वथा त्यागें।',
      en: 'Severe Agamic affliction, chronic illness, anxiety, and household discord.'
    },
    detailedExplanation: {
      kn: 'ದಕ್ಷಿಣ ಕೋಣೆಯಲ್ಲಿ ದಕ್ಷಿಣಕ್ಕೆ ಮುಖ ಮಾಡಿ ದೇವಪೂಜೆ ಮಾಡುವುದು ಸಂಪೂರ್ಣ ನಿಷೇಧ. ಇದು ಯಮ ದಿಕ್ಕಾಗಿದ್ದು ಕೇವಲ ಶ್ರಾದ್ಧ ಕರ್ಮಗಳಿಗೆ ಸೀಮಿತ. ದಯವಿಟ್ಟು ಕೂಡಲೇ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಬದಲಾಯಿಸಿ.',
      hi: 'दक्षिण कक्ष में दक्षिण मुखी बैठकर देवपूजा घोर निषिद्ध है। यह केवल श्राद्ध कर्म हेतु है। कृपया पूर्व अथवा उत्तर मुखी हों।',
      en: 'Sitting South-facing in a South room during devapuja causes severe Agamic dosha. Immediately adjust shrine and seating toward East or North.'
    },
    shastricRule: {
      kn: '«ಯಮಸ್ಯ ದಿಶಿ ದೀಪೋ ನ ಧಾತವ್ಯಃ ಕದಾಚನ» — ಯಮ ದಿಕ್ಕಿನಲ್ಲಿ ದೇವದೀಪ ಬೆಳಗಿಸಬಾರದು.',
      hi: '«यमस्य दिशि दीपो न धातव्यः कदाचन» — यम दिशा में देवदीप कभी न रखें।',
      en: 'Scriptural edict: No auspicious lamp shall ever face the quarter of Yama.'
    }
  }
];

export const PoojaDeepaGuidelinesSection: React.FC<PoojaDeepaGuidelinesSectionProps> = ({
  language,
  onNavigateToTab,
  className = ''
}) => {
  // Selected Room and Seating directions (Default: East Room + East Seating — The Gold Standard)
  const [selectedRoomDir, setSelectedRoomDir] = useState<CardinalDirection>('east');
  const [selectedSeatDir, setSelectedSeatDir] = useState<CardinalDirection>('east');

  // Hovered direction for tooltips
  const [hoveredRoomDir, setHoveredRoomDir] = useState<CardinalDirection | null>(null);
  const [hoveredSeatDir, setHoveredSeatDir] = useState<CardinalDirection | null>(null);

  // View Mode: 'interactiveGrid' or 'fullTable'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);

  // Get active combination from 4x4 matrix
  const activeCombination = POOJA_DEEPA_4X4_GRID.find(
    (item) => item.roomDir === selectedRoomDir && item.seatDir === selectedSeatDir
  ) || POOJA_DEEPA_4X4_GRID[0];

  const directionsList: CardinalDirection[] = ['east', 'north', 'west', 'south'];

  // Status color helpers
  const getRatingBadgeStyle = (rating: GridCombinationData['rating']) => {
    switch (rating) {
      case 'supreme':
        return 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300 shadow-sm';
      case 'auspicious':
        return 'bg-teal-600 text-white border-teal-400';
      case 'moderate':
        return 'bg-amber-500 text-stone-950 border-amber-300';
      case 'inauspicious':
        return 'bg-orange-600 text-white border-orange-400';
      case 'prohibited':
        return 'bg-red-700 text-white border-red-500';
      default:
        return 'bg-stone-500 text-white';
    }
  };

  const getCellBgStyle = (item: GridCombinationData, isSelected: boolean) => {
    if (isSelected) {
      return 'ring-3 ring-amber-500 scale-[1.03] z-10 shadow-lg border-amber-500 bg-amber-100/90 dark:bg-amber-950/80';
    }
    switch (item.rating) {
      case 'supreme':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40';
      case 'auspicious':
        return 'bg-teal-50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/40';
      case 'moderate':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30';
      case 'inauspicious':
        return 'bg-orange-50 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40';
      case 'prohibited':
        return 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40';
    }
  };

  return (
    <div className={`rounded-3xl border-2 border-amber-400/90 dark:border-stone-700 bg-white dark:bg-stone-900 p-4 sm:p-6 lg:p-8 space-y-6 shadow-xl ${className}`}>
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-700 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            🪔
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                4×4 Vedic Coordinate System • ೧೬ ದಿಶಾ ಸಂಯೋಗಗಳು
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Agama & Vastu Shastra Certified
              </span>
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mt-1">
              {language === 'kn'
                ? 'ಪೂಜಾ ದೀಪ ಮಾರ್ಗದರ್ಶಿ & ೪×೪ ದಿಶಾ ಗಣಕ (Pooja Deepa Guidelines)'
                : language === 'hi'
                ? 'पूजा दीप मार्गदर्शिका एवं ४×४ दिशा चक्र (Pooja Deepa Guidelines)'
                : 'Pooja Deepa Guidelines & 4×4 Coordinate Grid'}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 max-w-3xl">
              {language === 'kn'
                ? 'ದೇವರ ಕೋಣೆಯ ದಿಕ್ಕು ಹಾಗೂ ಪೂಜಕರು ಕುಳಿತುಕೊಳ್ಳುವ ದಿಕ್ಕಿನ ೧೬ ಸಂಯೋಗಗಳು, ದೀಪದ ಬಲ-ಎಡ ಕೈ (Left vs. Right) ನಿಖರ ನಿಯಮ, ಹಾಗೂ ಪವಿತ್ರ ಫಲಗಳ ಶಾಸ್ತ್ರೀಯ ವಿಶ್ಲೇಷಣೆ.'
                : 'Interactive 4×4 coordinate matrix analyzing all 16 combinations of Pooja room and devotee seating directions, Left vs. Right hand lamp placement, and Vedic spiritual outcomes.'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Grid vs Full Table */}
        <div className="no-print flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? '೪×೪ ಗ್ರಿಡ್ ವೀಕ್ಷಣೆ' : '4×4 Visual Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{language === 'kn' ? 'ಸಂಪೂರ್ಣ ಕೋಷ್ಟಕ' : 'Full 16-Row Table'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIRECTION SELECTION INPUTS WITH INTERACTIVE HOVER TOOLTIPS */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-amber-50/60 dark:bg-stone-850 border border-amber-300/80 dark:border-stone-700 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
              {language === 'kn'
                ? 'ದಿಕ್ಸೂಚಿ ನಿಯಂತ್ರಕ & ಪರಸ್ಪರ ಸಂವಾದಾತ್ಮಕ ಮಾಹಿತಿ (Interactive Direction Inputs)'
                : 'Direction Selector & Interactive Vedic Tooltips'}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'kn' ? 'ಮಾಹಿತಿ ನೋಡಲು ದಿಕ್ಕುಗಳ ಮೇಲೆ ಕರ್ಸರ್ ಇರಿಸಿ' : 'Hover over any direction for Vedic insights'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Input 1: Pooja Room Direction (ದೇವರ ಕೋಣೆ ದಿಕ್ಕು) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              {language === 'kn' ? '೧. ದೇವರ ಕೋಣೆಯ ದಿಕ್ಕು (Pooja Room Direction):' : '1. Pooja Room Direction:'}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {directionsList.map((dir) => {
                const isSelected = selectedRoomDir === dir;
                const tooltip = DIRECTION_TOOLTIPS[dir];
                const isHovered = hoveredRoomDir === dir;

                return (
                  <div key={`room-dir-${dir}`} className="relative">
                    <button
                      type="button"
                      onClick={() => setSelectedRoomDir(dir)}
                      onMouseEnter={() => setHoveredRoomDir(dir)}
                      onMouseLeave={() => setHoveredRoomDir(null)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-sm">
                        {dir === 'east' ? '🌅' : dir === 'north' ? '🧭' : dir === 'west' ? '🌇' : '⛔'}
                      </span>
                      <span className="capitalize">{dir}</span>
                      <span className="text-[10px] font-normal opacity-90">
                        {dir === 'east' ? 'ಪೂರ್ವ' : dir === 'north' ? 'ಉತ್ತರ' : dir === 'west' ? 'ಪಶ್ಚಿಮ' : 'ದಕ್ಷಿಣ'}
                      </span>
                    </button>

                    {/* Interactive Tooltip Card on Hover */}
                    {isHovered && (
                      <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 sm:w-72 p-3.5 rounded-xl bg-stone-900 text-white text-[11px] shadow-2xl border border-amber-400/80 pointer-events-none animate-in fade-in zoom-in-95">
                        <div className="font-bold text-amber-300 text-xs border-b border-stone-700 pb-1 mb-1.5 flex items-center justify-between">
                          <span>{tooltip.name[language]}</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black">Vedic</span>
                        </div>
                        <p className="text-amber-200/90 text-[10px] font-semibold mb-1">
                          {tooltip.rulingDeity[language]}
                        </p>
                        <p className="text-stone-200 text-[10.5px] leading-snug">
                          {tooltip.sthaapanaSignificance[language]}
                        </p>
                        <div className="mt-2 pt-1 border-t border-stone-800 text-[10px] text-emerald-300 font-medium">
                          {tooltip.doshaOrFruit[language]}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input 2: User Seating Direction (ಪೂಜಕರು ಕುಳಿತುಕೊಳ್ಳುವ ದಿಕ್ಕು) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              {language === 'kn' ? '೨. ಭಕ್ತರು ಕುಳಿತುಕೊಳ್ಳುವ ಮುಖಸ್ಥಿತಿ (User Seating Direction):' : '2. Devotee Seating Direction:'}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {directionsList.map((dir) => {
                const isSelected = selectedSeatDir === dir;
                const tooltip = DIRECTION_TOOLTIPS[dir];
                const isHovered = hoveredSeatDir === dir;

                return (
                  <div key={`seat-dir-${dir}`} className="relative">
                    <button
                      type="button"
                      onClick={() => setSelectedSeatDir(dir)}
                      onMouseEnter={() => setHoveredSeatDir(dir)}
                      onMouseLeave={() => setHoveredSeatDir(null)}
                      className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-700 ring-2 ring-orange-400 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-orange-400'
                      }`}
                    >
                      <span className="text-sm">
                        {dir === 'east' ? '👑' : dir === 'north' ? '✨' : dir === 'west' ? '🧘' : '🚫'}
                      </span>
                      <span className="capitalize">{dir}-Facing</span>
                      <span className="text-[10px] font-normal opacity-90">
                        {dir === 'east' ? 'ಪೂರ್ವ ಮುಖ' : dir === 'north' ? 'ಉತ್ತರ ಮುಖ' : dir === 'west' ? 'ಪಶ್ಚಿಮ ಮುಖ' : 'ದಕ್ಷಿಣ ಮುಖ'}
                      </span>
                    </button>

                    {/* Interactive Tooltip Card on Hover */}
                    {isHovered && (
                      <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 sm:w-72 p-3.5 rounded-xl bg-stone-900 text-white text-[11px] shadow-2xl border border-orange-400/80 pointer-events-none animate-in fade-in zoom-in-95">
                        <div className="font-bold text-orange-300 text-xs border-b border-stone-700 pb-1 mb-1.5 flex items-center justify-between">
                          <span>{tooltip.name[language]}</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-orange-400 text-stone-950 font-black">Seating</span>
                        </div>
                        <p className="text-stone-200 text-[10.5px] leading-snug">
                          {tooltip.seatingSignificance[language]}
                        </p>
                        <div className="mt-2 pt-1 border-t border-stone-800 text-[10px] text-amber-300 font-medium">
                          {tooltip.element[language]}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: THE VISUAL 4×4 COORDINATE MATRIX                                 */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Grid className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'kn'
                  ? '೪×೪ ಸಂಯೋಗ ದಿಕ್ಸೂಚಿ ಗ್ರಿಡ್ (೧೬ ಚೌಕಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಪರಿಶೀಲಿಸಿ)'
                  : '4×4 Vedic Coordinate Matrix (Click any cell to inspect)'}
              </span>
            </h3>

            {/* Legend Indicators */}
            <div className="flex items-center gap-2 flex-wrap text-[10.5px] font-bold">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>{language === 'kn' ? 'ಪರಮೋತ್ತಮ' : 'Supreme'}</span>
              </span>
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span>{language === 'kn' ? 'ಶುಭಪ್ರದ' : 'Auspicious'}</span>
              </span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{language === 'kn' ? 'ಮಧ್ಯಮ' : 'Moderate'}</span>
              </span>
              <span className="flex items-center gap-1 text-red-700 dark:text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>{language === 'kn' ? 'ವರ್ಜ್ಯ / ನಿಷೇಧ' : 'Prohibited'}</span>
              </span>
            </div>
          </div>

          {/* 4x4 Table Grid Wrapper */}
          <div className="overflow-x-auto rounded-2xl border-2 border-stone-200 dark:border-stone-700 shadow-sm bg-white dark:bg-stone-950">
            <table className="w-full border-collapse text-left min-w-[620px]">
              <thead>
                <tr className="bg-amber-100/70 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs">
                  <th className="p-3 font-black w-40 text-center border-r border-stone-200 dark:border-stone-700">
                    <div className="text-[10px] uppercase font-mono text-stone-500 dark:text-stone-400">
                      ROOM ➔ / SEATING ⬇
                    </div>
                    <div className="text-amber-900 dark:text-amber-300 font-extrabold mt-0.5">
                      {language === 'kn' ? 'ದೇವರ ಕೋಣೆ ದಿಕ್ಕು' : 'Pooja Room'}
                    </div>
                  </th>
                  {directionsList.map((seatDir) => (
                    <th key={`head-${seatDir}`} className="p-3 font-bold text-center border-r border-stone-200 dark:border-stone-700 last:border-r-0">
                      <div className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400">
                        {seatDir === 'east' ? '👑 SUPREME' : seatDir === 'north' ? '✨ AUSPICIOUS' : seatDir === 'west' ? '🧘 MODERATE' : '🚫 PROHIBITED'}
                      </div>
                      <div className="font-serif font-black text-xs sm:text-sm capitalize mt-0.5">
                        {seatDir}-Facing ({seatDir === 'east' ? 'ಪೂರ್ವ' : seatDir === 'north' ? 'ಉತ್ತರ' : seatDir === 'west' ? 'ಪಶ್ಚಿಮ' : 'ದಕ್ಷಿಣ'})
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                {directionsList.map((roomDir) => (
                  <tr key={`row-${roomDir}`} className="transition-colors">
                    {/* Row Header: Room Direction */}
                    <td className="p-3 bg-amber-50/50 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-700 font-bold text-center">
                      <div className="text-base">
                        {roomDir === 'east' ? '🌅' : roomDir === 'north' ? '🧭' : roomDir === 'west' ? '🌇' : '⛔'}
                      </div>
                      <div className="font-serif font-black text-stone-900 dark:text-stone-100 capitalize">
                        {roomDir} Room
                      </div>
                      <div className="text-[10px] text-stone-500 font-semibold">
                        ({roomDir === 'east' ? 'ಪೂರ್ವ ಕೋಣೆ' : roomDir === 'north' ? 'ಉತ್ತರ ಕೋಣೆ' : roomDir === 'west' ? 'ಪಶ್ಚಿಮ ಕೋಣೆ' : 'ದಕ್ಷಿಣ ಕೋಣೆ'})
                      </div>
                    </td>

                    {/* 4 Cells for this Room */}
                    {directionsList.map((seatDir) => {
                      const item = POOJA_DEEPA_4X4_GRID.find(
                        (g) => g.roomDir === roomDir && g.seatDir === seatDir
                      )!;
                      const isSelected = selectedRoomDir === roomDir && selectedSeatDir === seatDir;

                      return (
                        <td
                          key={`cell-${roomDir}-${seatDir}`}
                          onClick={() => {
                            setSelectedRoomDir(roomDir);
                            setSelectedSeatDir(seatDir);
                          }}
                          className={`p-2.5 sm:p-3 border-r border-stone-200 dark:border-stone-800 last:border-r-0 cursor-pointer transition-all ${getCellBgStyle(
                            item,
                            isSelected
                          )}`}
                          title={`Click to inspect ${roomDir} room + ${seatDir} seating`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${getRatingBadgeStyle(
                                  item.rating
                                )}`}
                              >
                                {item.rating === 'supreme' ? '🌟 SUPREME' : item.rating === 'auspicious' ? '✔ SHUBHA' : item.rating === 'moderate' ? '⚠ MODERATE' : '⛔ VERBOTEN'}
                              </span>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              )}
                            </div>

                            <div className="font-bold text-[11px] text-stone-900 dark:text-stone-100">
                              🪔 {item.deepaHandPlacement[language].split('=')[0].trim()}
                            </div>

                            <div className="text-[10px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-tight">
                              {item.spiritualOutcome[language]}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE VERDICT INSPECTOR: SELECTED CELL DEEP DIVE                         */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border-2 border-amber-400/90 dark:border-amber-600/60 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔱</span>
            <div>
              <div className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Active Selection Result • ಆಯ್ಕೆಯ ನಿಖರ ಶಾಸ್ತ್ರೀಯ ತೀರ್ಪು
              </div>
              <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
                {selectedRoomDir.toUpperCase()} Room + {selectedSeatDir.toUpperCase()}-Facing Seating
              </h4>
            </div>
          </div>

          <span className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border shadow-xs self-start sm:self-auto ${getRatingBadgeStyle(activeCombination.rating)}`}>
            {activeCombination.ratingLabel[language]}
          </span>
        </div>

        {/* 3 Strategic Placement Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          
          {/* Card A: Deepa Placement (Left vs Right) */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800/90 border border-amber-300 dark:border-stone-700 space-y-1 shadow-2xs">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              🪔 Deepa Hand Placement (ಬಲ vs ಎಡ ಕೈ)
            </span>
            <div className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
              {activeCombination.deepaHandPlacement[language]}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Compass Direction: <strong>{activeCombination.deepaCompassDirection[language]}</strong>
            </p>
          </div>

          {/* Card B: Flame Orientation */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800/90 border border-amber-300 dark:border-stone-700 space-y-1 shadow-2xs">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 block">
              🔥 Flame Wick Direction (ಜ್ಯೋತಿಯ ಮುಖ)
            </span>
            <div className="font-serif font-black text-sm text-stone-900 dark:text-stone-100">
              {activeCombination.flameDirection[language]}
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Vedic Rule: Never face wicks towards South.
            </p>
          </div>

          {/* Card C: Spiritual & Auspicious Outcome */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800/90 border border-amber-300 dark:border-stone-700 space-y-1 shadow-2xs">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              ✨ Spiritual Outcome (ಶಾಸ್ತ್ರೀಯ ಫಲ)
            </span>
            <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
              {activeCombination.spiritualOutcome[language]}
            </div>
          </div>

        </div>

        {/* Detailed Vedic Exegesis */}
        <div className="p-3.5 rounded-xl bg-amber-100/60 dark:bg-stone-800/70 border border-amber-300/70 dark:border-stone-700 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'kn' ? 'ಆಗಮಿಕ ವಿವರಣೆ & ವಾಸ್ತು ಮಾರ್ಗದರ್ಶನ:' : 'Agamic Explanation & Vastu Guidance:'}</span>
          </div>
          <p className="text-stone-800 dark:text-stone-200 text-[11.5px] leading-relaxed">
            {activeCombination.detailedExplanation[language]}
          </p>
          <div className="font-mono text-[11px] text-amber-800 dark:text-amber-400 italic pt-1 border-t border-amber-200 dark:border-stone-700">
            📜 {activeCombination.shastricRule[language]}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 2: FULL 16-ROW COMPARATIVE TABLE VIEW                                */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-black text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-600" />
              <span>
                {language === 'kn'
                  ? 'ಸಂಪೂರ್ಣ ೧೬ ಸಂಯೋಗಗಳ ವಿವರವಾದ ಕೋಷ್ಟಕ (Complete 16 Combinations)'
                  : 'Full 16-Combination Comparative Reference Table'}
              </span>
            </h3>
            <span className="text-xs text-stone-500 font-semibold">16 Coordinate Scenarios</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-300 dark:border-stone-700 shadow-sm bg-white dark:bg-stone-950">
            <table className="w-full border-collapse text-xs text-left min-w-[700px]">
              <thead>
                <tr className="bg-amber-100/70 dark:bg-stone-850 border-b border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold">
                  <th className="p-2.5 text-center">#</th>
                  <th className="p-2.5">Pooja Room</th>
                  <th className="p-2.5">Seating Direction</th>
                  <th className="p-2.5">Rating Status</th>
                  <th className="p-2.5">Deepa Hand (Left/Right)</th>
                  <th className="p-2.5">Flame Direction</th>
                  <th className="p-2.5">Spiritual Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {POOJA_DEEPA_4X4_GRID.map((item, idx) => {
                  const isSelected = selectedRoomDir === item.roomDir && selectedSeatDir === item.seatDir;

                  return (
                    <tr
                      key={`table-row-${idx}`}
                      onClick={() => {
                        setSelectedRoomDir(item.roomDir);
                        setSelectedSeatDir(item.seatDir);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-100/90 dark:bg-amber-950/80 font-semibold'
                          : 'hover:bg-amber-50/50 dark:hover:bg-stone-850'
                      }`}
                    >
                      <td className="p-2.5 text-center font-mono font-bold text-stone-500">{idx + 1}</td>
                      <td className="p-2.5 font-bold capitalize">
                        {item.roomDir} ({item.roomDir === 'east' ? 'ಪೂರ್ವ' : item.roomDir === 'north' ? 'ಉತ್ತರ' : item.roomDir === 'west' ? 'ಪಶ್ಚಿಮ' : 'ದಕ್ಷಿಣ'})
                      </td>
                      <td className="p-2.5 font-bold capitalize">
                        {item.seatDir}-Facing
                      </td>
                      <td className="p-2.5">
                        <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${getRatingBadgeStyle(item.rating)}`}>
                          {item.rating}
                        </span>
                      </td>
                      <td className="p-2.5 text-stone-900 dark:text-stone-100">
                        {item.deepaHandPlacement[language].split('=')[0].trim()}
                      </td>
                      <td className="p-2.5 font-semibold text-amber-700 dark:text-amber-400">
                        {item.flameDirection[language]}
                      </td>
                      <td className="p-2.5 text-stone-700 dark:text-stone-300">
                        {item.spiritualOutcome[language]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accordion Guide: Core Shastric Injunctions */}
      <div className="border border-stone-200 dark:border-stone-700 rounded-2xl overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full p-3.5 bg-stone-50 dark:bg-stone-850 font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              {language === 'kn'
                ? 'ವೇದೋಕ್ತ ದೀಪ ಪಾಲನೆಯ ಪ್ರಮುಖ ಸೂತ್ರಗಳು (Core Agamic Sutras)'
                : 'Core Agamic Sutras for Deepa Consecration'}
            </span>
          </div>
          {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isAccordionOpen && (
          <div className="p-4 bg-white dark:bg-stone-900 space-y-2.5 text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px]">
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 block">
                  🧈 ೧. ತುಪ್ಪದ ದೀಪ (Cow Ghee Lamp):
                </span>
                <p>
                  {language === 'kn'
                    ? 'ದೇವತೆಯ ಬಲಭಾಗದಲ್ಲಿ = ಪೂಜಕರ ಎಡಗೈ ಕಡೆಗೆ ಇಡಬೇಕು. ಇದು ಮಹಾಲಕ್ಷ್ಮಿ ಹಾಗೂ ಕುಬೇರನ ಕೃಪೆಯನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ.'
                    : 'Place on Deity’s Right = Devotee’s Left Hand side. Invokes Mahalakshmi and Kubera for prosperity.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-stone-800 border border-orange-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-orange-900 dark:text-orange-300 block">
                  🪔 ೨. ಎಳ್ಳೆಣ್ಣೆ ದೀಪ (Til / Sesame Oil Lamp):
                </span>
                <p>
                  {language === 'kn'
                    ? 'ದೇವತೆಯ ಎಡಭಾಗದಲ್ಲಿ = ಪೂಜಕರ ಬಲಗೈ ಕಡೆಗೆ ಇಡಬೇಕು. ಇದು ಶನಿ-ರಾಹು ಪೀಡೆ ಹಾಗೂ ಶತ್ರು ಬಾಧೆಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ.'
                    : 'Place on Deity’s Left = Devotee’s Right Hand side. Neutralizes planetary doshas and adversarial forces.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-stone-800 border border-emerald-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                  🌾 ೩. ಧಾನ್ಯ ಪೀಠ (Grain Altar Base):
                </span>
                <p>
                  {language === 'kn'
                    ? 'ದೀಪವನ್ನು ಎಂದಿಗೂ ನೇರವಾಗಿ ನೆಲದ ಮೇಲೆ ಇಡಬೇಡಿ. ತಾಮ್ರ ಅಥವಾ ಹಿತ್ತಾಳೆಯ ತಟ್ಟೆಯಲ್ಲಿ ಅಕ್ಕಿ/ಗೋಧಿಯನ್ನು ಹರಡಿ ಅದರ ಮೇಲೆ ಸ್ಥಾಪಿಸಿ.'
                    : 'Never place the lamp directly on bare floor; seat it atop raw rice or wheat bedded inside a metal platter.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-50/70 dark:bg-stone-800 border border-red-200 dark:border-stone-700 space-y-1">
                <span className="font-bold text-red-900 dark:text-red-300 block">
                  🚫 ೪. ದಕ್ಷಿಣ ಮುಖ ನಿಷೇಧ (South Facing Prohibition):
                </span>
                <p>
                  {language === 'kn'
                    ? 'ದೀಪದ ಬತ್ತಿಯನ್ನು ಎಂದಿಗೂ ದಕ್ಷಿಣಕ್ಕೆ ಮುಖ ಮಾಡಿ ಬೆಳಗಿಸಬೇಡಿ. ದಕ್ಷಿಣವು ಯಮ ದಿಕ್ಕಾಗಿದ್ದು ಕೇವಲ ಪಿತೃ ಕಾರ್ಯಗಳಿಗೆ ಸೀಮಿತ.'
                    : 'The wick flame must NEVER point towards the South. South belongs to Yama and is forbidden for devapuja.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
