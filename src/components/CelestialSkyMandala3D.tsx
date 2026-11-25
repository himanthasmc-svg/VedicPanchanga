import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Compass,
  Maximize2,
  Minimize2,
  Clock,
  Layers,
  Star,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ZoomOut,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Orbit,
  Navigation,
  Box,
} from 'lucide-react';
import { CityLocation, KundaliData, Language } from '../types';
import { CITIES, RASHIS } from '../utils/panchanga';
import { NAKSHATRA_AKSHARAS, getNakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { SvgGrahaIcon } from './RealisticGraha';
import { ThreeNightSky3D } from './ThreeNightSky3D';
import { RashiStarMap } from './RashiStarMap';

interface CelestialSkyMandala3DProps {
  currentLang: Language;
  kundaliData: KundaliData;
  dateStr: string;
  timeStr: string;
  cityName: string;
  selectedCity?: CityLocation;
  defaultViewMode?: '3d' | '2d' | 'starmap';
  showRashiStarMapInline?: boolean;
}

export interface NakshatraSkyPattern {
  index: number;
  nameEn: string;
  nameKn: string;
  nameHi: string;
  spanStartDeg: number;
  spanEndDeg: number;
  principalStar: string;
  patternType: string;
  descriptionEn: string;
  descriptionKn: string;
  stars: Array<[number, number]>;
  lines: Array<[number, number]>;
}

export const NAKSHATRA_SKY_PATTERNS: NakshatraSkyPattern[] = [
  {
    index: 0,
    nameEn: 'Ashwini',
    nameKn: 'ಅಶ್ವಿನಿ',
    nameHi: 'अश्विनी',
    spanStartDeg: 0,
    spanEndDeg: 13.3333,
    principalStar: 'Hamal (Alpha Arietis)',
    patternType: 'Horse Head (೩ ತಾರೆಗಳು)',
    descriptionEn: '3 bright stars in Aries shaped like a horse head. Look east in autumn/winter skies.',
    descriptionKn: 'ಮೇಷ ರಾಶಿಯಲ್ಲಿ ಕುದುರೆಯ ಮುಖದ ಆಕಾರದಲ್ಲಿರುವ ೩ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -5], [1, 1], [5, 5]],
    lines: [[0, 1], [1, 2]],
  },
  {
    index: 1,
    nameEn: 'Bharani',
    nameKn: 'ಭರಣಿ',
    nameHi: 'भरणी',
    spanStartDeg: 13.3333,
    spanEndDeg: 26.6667,
    principalStar: '35 & 41 Arietis',
    patternType: 'Triangle / Yoni (೩ ತಾರೆಗಳು)',
    descriptionEn: '3 triangular faint stars south of Hamal.',
    descriptionKn: 'ಅಶ್ವಿನಿ ತಾರೆಗಳ ಕೆಳಭಾಗದಲ್ಲಿ ತ್ರಿಕೋನಾಕಾರದಲ್ಲಿ ಕಾಣುವ ೩ ತಾರೆಗಳು.',
    stars: [[-3, -4], [4, -1], [0, 5]],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    index: 2,
    nameEn: 'Krittika',
    nameKn: 'ಕೃತ್ತಿಕಾ',
    nameHi: 'कृत्तिका',
    spanStartDeg: 26.6667,
    spanEndDeg: 40.0,
    principalStar: 'Alcyone (Pleiades M45)',
    patternType: 'Pleiades Star Cluster (೬ ತಾರೆಗಳು)',
    descriptionEn: 'The famous "Seven Sisters" open cluster. Visible as a sparkling tiny dipper with the naked eye.',
    descriptionKn: 'ಬರಿಗಣ್ಣಿಗೆ ಪುಟ್ಟ ದೀಪದಂತೆ ಮಿನುಗುವ ೬ ನಕ್ಷತ್ರಗಳ ಕೃತ್ತಿಕಾ ಪುಂಜ (ಪ್ಲಿಯೇಡಿಸ್).',
    stars: [[-6, -2], [-3, -4], [0, -3], [3, -1], [5, 2], [1, 4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]],
  },
  {
    index: 3,
    nameEn: 'Rohini',
    nameKn: 'ರೋಹಿಣಿ',
    nameHi: 'रोहिणी',
    spanStartDeg: 40.0,
    spanEndDeg: 53.3333,
    principalStar: 'Aldebaran (Alpha Tauri)',
    patternType: 'V-shaped Cart (Hyades Cluster)',
    descriptionEn: "Bright reddish-orange Aldebaran anchors the V-shaped Hyades cluster (the Bull's Eye).",
    descriptionKn: 'ಕೆಂಪು ದೈತ್ಯ ತಾರೆ ರೋಹಿಣಿ (ಆಲ್ಡೆಬರಾನ್) ನೇತೃತ್ವದ "ವಿ" ಆಕಾರದ ಬಂಡಿ ಪುಂಜ.',
    stars: [[-5, -5], [-2, 0], [4, 4], [-2, 4], [2, -2]],
    lines: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    index: 4,
    nameEn: 'Mrigashira',
    nameKn: 'ಮೃಗಶಿರ',
    nameHi: 'मृगशिरा',
    spanStartDeg: 53.3333,
    spanEndDeg: 66.6667,
    principalStar: 'Meissa (Lambda Orionis)',
    patternType: 'Deer Head (೩ ತಾರೆಗಳು)',
    descriptionEn: "3 stars atop Orion's head forming an inverted triangle pointing down.",
    descriptionKn: 'ಮೃಗಶಿರ: ಒರಾಯನ್ ಬೇಟೆಗಾರನ ಶಿರಸ್ಸಿನಲ್ಲಿ ಜಿಂಕೆಯ ಮುಖದಂತಿರುವ ೩ ತಾರೆಗಳು.',
    stars: [[0, -5], [-4, 3], [4, 3]],
    lines: [[0, 1], [1, 2], [2, 0]],
  },
  {
    index: 5,
    nameEn: 'Aridra',
    nameKn: 'ಆರಿದ್ರಾ',
    nameHi: 'आर्द्रा',
    spanStartDeg: 66.6667,
    spanEndDeg: 80.0,
    principalStar: 'Betelgeuse (Alpha Orionis)',
    patternType: 'Radiant Jewel / Teardrop',
    descriptionEn: "The colossal red supergiant Betelgeuse in Orion's right shoulder. Flashing crimson-amber.",
    descriptionKn: 'ಒರಾಯನ್ ಭುಜದ ಪ್ರಕಾಶಮಾನ ಕೆಂಪು ಮಹಾತಾರೆ ಆರಿದ್ರಾ (ಬೆಟೆಲ್‌ಗ್ಯೂಸ್).',
    stars: [[0, 0]],
    lines: [],
  },
  {
    index: 6,
    nameEn: 'Punarvasu',
    nameKn: 'ಪುನರ್ವಸು',
    nameHi: 'पुनर्वसु',
    spanStartDeg: 80.0,
    spanEndDeg: 93.3333,
    principalStar: 'Castor & Pollux (Gemini)',
    patternType: 'The Twin Stars / Bow (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Castor and Pollux, the luminous twin heads of Gemini.',
    descriptionKn: 'ಮಿಥುನ ರಾಶಿಯ ಕಣ್ಣಿಗೆ ಎದ್ದು ಕಾಣುವ ಅವಳಿ ನಕ್ಷತ್ರಗಳು (ಕ್ಯಾಸ್ಟರ್ & ಪೋಲಕ್ಸ್).',
    stars: [[-4, -4], [-3, 3], [3, -3], [4, 4]],
    lines: [[0, 1], [2, 3], [0, 2], [1, 3]],
  },
  {
    index: 7,
    nameEn: 'Pushya',
    nameKn: 'ಪುಷ್ಯ',
    nameHi: 'पुष्य',
    spanStartDeg: 93.3333,
    spanEndDeg: 106.6667,
    principalStar: 'Delta Cancri (Asellus Australis)',
    patternType: 'Beehive / Arrow (೩ ತಾರೆಗಳು)',
    descriptionEn: 'Surrounds the Praesepe (Beehive Cluster M44) in the heart of Cancer.',
    descriptionKn: 'ಕರ್ಕಾಟಕದ ಹೃದಯದಲ್ಲಿ ಜೇನುಗೂಡಿನಂತಿರುವ ಪವಿತ್ರ ಪುಷ್ಯ ತಾರಾ ಸಮೂಹ.',
    stars: [[0, -4], [-4, 3], [4, 3]],
    lines: [[0, 1], [0, 2]],
  },
  {
    index: 8,
    nameEn: 'Ashlesha',
    nameKn: 'ಆಶ್ಲೇಷಾ',
    nameHi: 'आश्लेषा',
    spanStartDeg: 106.6667,
    spanEndDeg: 120.0,
    principalStar: 'Epsilon Hydrae',
    patternType: 'Coiled Serpent (೬ ತಾರೆಗಳು)',
    descriptionEn: 'Ring of 5-6 stars forming the head of Hydra serpent.',
    descriptionKn: 'ಸುರುಳಿ ಸುತ್ತಿದ ಸರ್ಪದ ಹೆಡೆಯಂತಿರುವ ೬ ತಾರೆಗಳು.',
    stars: [[-5, -2], [-2, -5], [3, -4], [5, 0], [2, 4], [-2, 3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    index: 9,
    nameEn: 'Magha',
    nameKn: 'ಮಘಾ',
    nameHi: 'मघा',
    spanStartDeg: 120.0,
    spanEndDeg: 133.3333,
    principalStar: 'Regulus (Alpha Leonis)',
    patternType: 'Sickle & Royal Throne (೬ ತಾರೆಗಳು)',
    descriptionEn: 'The Sickle of Leo anchored by dazzling blue-white Regulus (The King Star).',
    descriptionKn: 'ಸಿಂಹ ರಾಶಿಯ ರಾಜಮುಕುಟ ಹಾಗೂ ಕುಡುಗೋಲಿನ ಆಕಾರದ ೬ ತಾರೆಗಳು.',
    stars: [[-4, 5], [-4, 0], [-2, -4], [2, -5], [5, -2], [3, 1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    index: 10,
    nameEn: 'Purva Phalguni',
    nameKn: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ (ಹುಬ್ಬಾ)',
    nameHi: 'पूर्व फाल्गुनी',
    spanStartDeg: 133.3333,
    spanEndDeg: 146.6667,
    principalStar: 'Zosma & Chertan (Delta & Theta Leonis)',
    patternType: 'Front Legs of Cot (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Two bright stars marking the hindquarter flank of Leo.',
    descriptionKn: 'ಮಂಚದ ಮುಂಭಾಗದ ಕಾಲುಗಳಂತಿರುವ ೨ ತಾರೆಗಳು.',
    stars: [[-3, -4], [3, 4]],
    lines: [[0, 1]],
  },
  {
    index: 11,
    nameEn: 'Uttara Phalguni',
    nameKn: 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
    nameHi: 'उत्तर फाल्गुनी',
    spanStartDeg: 146.6667,
    spanEndDeg: 160.0,
    principalStar: 'Denebola (Beta Leonis)',
    patternType: 'Back Legs of Cot (೨ ತಾರೆಗಳು)',
    descriptionEn: "Denebola (Lion's tail) forms the second part of the cosmic couch.",
    descriptionKn: 'ಸಿಂಹದ ಬಾಲದ ಡೆನೆಬೋಲಾ ತಾರೆ ಒಳಗೊಂಡ ಮಂಚದ ಹಿಂಭಾಗದ ತಾರೆಗಳು.',
    stars: [[-4, -3], [4, 3]],
    lines: [[0, 1]],
  },
  {
    index: 12,
    nameEn: 'Hasta',
    nameKn: 'ಹಸ್ತ',
    nameHi: 'हस्त',
    spanStartDeg: 160.0,
    spanEndDeg: 173.3333,
    principalStar: 'Delta Corvi (Corvus constellation)',
    patternType: 'Open Hand / Crow (೫ ತಾರೆಗಳು)',
    descriptionEn: '5 stars of Corvus the Crow, resembling fingers of a blessing open hand.',
    descriptionKn: 'ಆಕಾಶದಲ್ಲಿ ಆಶೀರ್ವದಿಸುವ ಕೈಬೆರಳುಗಳಂತೆ ಕಾಣುವ ೫ ತಾರೆಗಳು (ಕಾಗೆ ಪುಂಜ).',
    stars: [[-4, -3], [3, -5], [5, 0], [0, 5], [-5, 2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  {
    index: 13,
    nameEn: 'Chitra',
    nameKn: 'ಚಿತ್ತಾ (ಚಿತ್ರಾ)',
    nameHi: 'चित्रा',
    spanStartDeg: 173.3333,
    spanEndDeg: 186.6667,
    principalStar: 'Spica (Alpha Virginis)',
    patternType: 'Single Radiant Pearl (೧ ತಾರೆ)',
    descriptionEn: "The brilliant blue-white diamond star Spica in Virgo. One of the night sky's brightest beacons.",
    descriptionKn: 'ಕನ್ಯಾ ರಾಶಿಯಲ್ಲಿ ಪ್ರಕಾಶಿಸುವ ಏಕೈಕ ದಿವ್ಯ ಮುತ್ತು ಚಿತ್ರಾ (ಸ್ಪೈಕಾ).',
    stars: [[0, 0]],
    lines: [],
  },
  {
    index: 14,
    nameEn: 'Swati',
    nameKn: 'ಸ್ವಾತಿ',
    nameHi: 'स्वाती',
    spanStartDeg: 186.6667,
    spanEndDeg: 200.0,
    principalStar: 'Arcturus (Alpha Boötis)',
    patternType: 'Golden Coral / Drop (೧ ತಾರೆ)',
    descriptionEn: 'Blazing reddish-amber Arcturus, 4th brightest star in the sky.',
    descriptionKn: 'ಉತ್ತರ ಆಕಾಶದ ೪ನೇ ಅತಿ ಪ್ರಕಾಶಮಾನ ಕಿತ್ತಳೆ-ಕೆಂಪು ಮಹಾತಾರೆ ಸ್ವಾತಿ (ಆರ್ಕ್ಟುರಸ್).',
    stars: [[0, 0]],
    lines: [],
  },
  {
    index: 15,
    nameEn: 'Vishakha',
    nameKn: 'ವಿಶಾಖಾ',
    nameHi: 'विशाखा',
    spanStartDeg: 200.0,
    spanEndDeg: 213.3333,
    principalStar: 'Alpha & Beta Librae',
    patternType: 'Triumphal Arch / Scales (೪ ತಾರೆಗಳು)',
    descriptionEn: '4 stars forming a grand gateway or balance scales.',
    descriptionKn: 'ವಿಜಯ ತೋರಣದಂತೆ ಕಾಣುವ ತುಲಾ ರಾಶಿಯ ೪ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -4], [-3, 3], [3, -3], [4, 4]],
    lines: [[0, 1], [1, 3], [3, 2], [2, 0]],
  },
  {
    index: 16,
    nameEn: 'Anuradha',
    nameKn: 'ಅನುರಾಧಾ',
    nameHi: 'अनुराधा',
    spanStartDeg: 213.3333,
    spanEndDeg: 226.6667,
    principalStar: 'Beta, Delta, Pi Scorpii',
    patternType: 'Lotus Staff / Arch (೪ ತಾರೆಗಳು)',
    descriptionEn: 'The striking vertical row of 3-4 stars standing guard before Antares in Scorpio.',
    descriptionKn: 'ವೃಶ್ಚಿಕದ ಮುಂಭಾಗದಲ್ಲಿ ನೇರ ಸಾಲಾಗಿ ನಿಂತಿರುವ ೪ ರಕ್ಷಕ ತಾರೆಗಳು.',
    stars: [[-4, -5], [-2, -1], [1, 2], [4, 5]],
    lines: [[0, 1], [1, 2], [2, 3]],
  },
  {
    index: 17,
    nameEn: 'Jyeshtha',
    nameKn: 'ಜ್ಯೇಷ್ಠಾ',
    nameHi: 'ज्येष्ठा',
    spanStartDeg: 226.6667,
    spanEndDeg: 240.0,
    principalStar: 'Antares (Alpha Scorpii)',
    patternType: 'Ear Pendant / Heart of Scorpion',
    descriptionEn: 'Fiery ruby-red Antares flanked by two guardian stars.',
    descriptionKn: 'ವೃಶ್ಚಿಕದ ಹೃದಯದಲ್ಲಿರುವ ಕೆಂಪು ರತ್ನ ಜ್ಯೇಷ್ಠಾ (ಆಂಟಾರಿಸ್) ಮತ್ತು ಪಕ್ಕದ ಎರಡು ತಾರೆಗಳು.',
    stars: [[-4, -3], [0, 0], [4, 3]],
    lines: [[0, 1], [1, 2]],
  },
  {
    index: 18,
    nameEn: 'Moola',
    nameKn: 'ಮೂಲಾ',
    nameHi: 'मूल',
    spanStartDeg: 240.0,
    spanEndDeg: 253.3333,
    principalStar: 'Shaula & Lesath (Lambda & Upsilon Scorpii)',
    patternType: 'Scorpion Tail & Sting (೬ ತಾರೆಗಳು)',
    descriptionEn: "The majestic hook of the Scorpion's sting pointing to the Milky Way Galactic Center.",
    descriptionKn: 'ಆಕಾಶಗಂಗೆಯ ಕೇಂದ್ರದೆಡೆಗೆ ಬಾಗಿದ ಚೇಳಿನ ಬಾಲದ ತುದಿಯ ೬ ತಾರೆಗಳು.',
    stars: [[-5, -4], [-2, -2], [1, -2], [3, 0], [4, 3], [1, 5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    index: 19,
    nameEn: 'Purvashadha',
    nameKn: 'ಪೂರ್ವಾಷಾಢ',
    nameHi: 'पूर्वाषाढ़ा',
    spanStartDeg: 253.3333,
    spanEndDeg: 266.6667,
    principalStar: 'Kaus Media & Kaus Australis',
    patternType: 'Winnowing Basket / Bow (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Stars forming the bow and teapot handle of Sagittarius.',
    descriptionKn: 'ಧನುಸ್ಸು ರಾಶಿಯ ಬಿಲ್ಲು ಹಾಗೂ ಚಹಾ ಪಾತ್ರೆಯ ಹ್ಯಾಂಡಲ್ ಆಕಾರದ ತಾರೆಗಳು.',
    stars: [[-4, -3], [-1, -5], [3, -2], [1, 4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    index: 20,
    nameEn: 'Uttarashadha',
    nameKn: 'ಉತ್ತರಾಷಾಢ',
    nameHi: 'उत्तराषाढ़ा',
    spanStartDeg: 266.6667,
    spanEndDeg: 280.0,
    principalStar: 'Nunki (Sigma Sagittarii)',
    patternType: 'Elephant Tusk (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Bright stars Nunki and Ascella shining in eastern Sagittarius.',
    descriptionKn: 'ಆನೆಯ ದಂತದ ಆಕಾರದಲ್ಲಿ ಮಿನುಗುವ ಧನುಸ್ಸಿನ ತಾರೆಗಳು.',
    stars: [[-4, -4], [0, -2], [3, 1], [5, 4]],
    lines: [[0, 1], [1, 2], [2, 3]],
  },
  {
    index: 21,
    nameEn: 'Shravana',
    nameKn: 'ಶ್ರವಣ',
    nameHi: 'श्रवण',
    spanStartDeg: 280.0,
    spanEndDeg: 293.3333,
    principalStar: 'Altair (Alpha Aquilae)',
    patternType: 'Eagle & 3 Footsteps (೩ ತಾರೆಗಳು)',
    descriptionEn: 'Altair (the Flying Eagle) with Tarazed and Alshain in a straight diagonal line.',
    descriptionKn: 'ಮೂರು ಹೆಜ್ಜೆಗಳಂತಿರುವ ಪ್ರಖರ ಹದ್ದಿನ ತಾರೆ ಶ್ರವಣ (ಆಲ್ಟೇರ್) ಹಾಗೂ ಪಾರ್ಶ್ವ ತಾರೆಗಳು.',
    stars: [[-4, -4], [0, 0], [4, 4]],
    lines: [[0, 1], [1, 2]],
  },
  {
    index: 22,
    nameEn: 'Dhanishta',
    nameKn: 'ಧನಿಷ್ಠಾ',
    nameHi: 'धनिष्ठा',
    spanStartDeg: 293.3333,
    spanEndDeg: 306.6667,
    principalStar: 'Alpha Delphini',
    patternType: 'Musical Drum (Damaru) / Dolphin (೪ ತಾರೆಗಳು)',
    descriptionEn: 'The neat diamond shape of Delphinus the Dolphin jumping above the Milky Way.',
    descriptionKn: 'ಡಮರು ಅಥವಾ ಡಾಲ್ಫಿನ್ ಆಕಾರದಲ್ಲಿ ಆಕಾಶದಲ್ಲಿ ಹಾರುವ ೪ ತಾರೆಗಳು.',
    stars: [[0, -5], [4, 0], [0, 5], [-4, 0]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    index: 23,
    nameEn: 'Shatabhisha',
    nameKn: 'ಶತಭಿಷಾ',
    nameHi: 'शतभिषा',
    spanStartDeg: 306.6667,
    spanEndDeg: 320.0,
    principalStar: 'Gamma Aquarii',
    patternType: 'Circle of 100 Physicians (ವರ್ತುಲ)',
    descriptionEn: 'A delicate circle of faint stars in Aquarius representing cosmic healing.',
    descriptionKn: 'ಕುಂಭ ರಾಶಿಯಲ್ಲಿ ನೂರು ತಾರೆಗಳ ವೃತ್ತಾಕಾರದ ದಿವ್ಯ ಗುಣಪಡಿಸುವ ಮಂಡಲ.',
    stars: [[0, -4], [3, -3], [4, 0], [3, 3], [0, 4], [-3, 3], [-4, 0], [-3, -3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
  },
  {
    index: 24,
    nameEn: 'Purvabhadra',
    nameKn: 'ಪೂರ್ವಾಭಾದ್ರ',
    nameHi: 'पूर्वभाद्रपद',
    spanStartDeg: 320.0,
    spanEndDeg: 333.3333,
    principalStar: 'Markab & Scheat (Pegasus Square)',
    patternType: 'Front Legs of Pegasus Square (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Western pair of stars in the Great Square of Pegasus.',
    descriptionKn: 'ಪೆಗಾಸಸ್ ಆಕಾಶ ಚೌಕದ ಮುಂಭಾಗದ ೨ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -4], [4, 4]],
    lines: [[0, 1]],
  },
  {
    index: 25,
    nameEn: 'Uttarabhadra',
    nameKn: 'ಉತ್ತರಾಭಾದ್ರ',
    nameHi: 'उत्तरभाद्रपद',
    spanStartDeg: 333.3333,
    spanEndDeg: 346.6667,
    principalStar: 'Algenib & Alpheratz',
    patternType: 'Back Legs of Pegasus Square (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Eastern pair of stars in the Great Square of Pegasus.',
    descriptionKn: 'ಪೆಗಾಸಸ್ ಆಕಾಶ ಚೌಕದ ಹಿಂಭಾಗದ ೨ ತಾರೆಗಳು.',
    stars: [[-4, -4], [4, 4]],
    lines: [[0, 1]],
  },
  {
    index: 26,
    nameEn: 'Revati',
    nameKn: 'ರೇವತಿ',
    nameHi: 'रेवती',
    spanStartDeg: 346.6667,
    spanEndDeg: 360.0,
    principalStar: 'Zeta Piscium',
    patternType: 'Swimming Fish (ಮತ್ಸ್ಯ)',
    descriptionEn: 'Final nakshatra marking the junction of Pisces and Aries, like two fish tied by a cord.',
    descriptionKn: 'ಮೀನ ರಾಶಿಯ ಅಂತಿಮ ಬಿಂದುವಿನಲ್ಲಿ ಈಜುವ ಜೋಡಿ ಮೀನಿನಂತಿರುವ ತಾರೆಗಳು.',
    stars: [[-5, 0], [-2, -3], [2, -3], [5, 0], [2, 3], [-2, 3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
];

interface PlanetVisualConfig {
  name: string;
  sanskritName: { en: string; kn: string; hi: string };
  shortName: { en: string; kn: string; hi: string };
  color: string;
  haloColor: string;
  textureGradient: [string, string];
  hasRings?: boolean;
  ringColor?: string;
  radius: number;
  preferredTrack: number; // 0 (innermost) to 8 (outermost)
}

const PLANET_VISUALS: Record<string, PlanetVisualConfig> = {
  Moon: {
    name: 'Moon',
    sanskritName: { en: 'Chandra', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    shortName: { en: 'Chandra', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    color: '#f8fafc',
    haloColor: 'rgba(241, 245, 249, 0.5)',
    textureGradient: ['#ffffff', '#94a3b8'],
    radius: 8.5,
    preferredTrack: 1,
  },
  Mercury: {
    name: 'Mercury',
    sanskritName: { en: 'Budha', kn: 'ಬುಧ', hi: 'बुध' },
    shortName: { en: 'Budha', kn: 'ಬುಧ', hi: 'बुध' },
    color: '#34d399',
    haloColor: 'rgba(52, 211, 153, 0.42)',
    textureGradient: ['#6ee7b7', '#065f46'],
    radius: 8,
    preferredTrack: 2,
  },
  Venus: {
    name: 'Venus',
    sanskritName: { en: 'Shukra', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    shortName: { en: 'Shukra', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    color: '#fde047',
    haloColor: 'rgba(253, 224, 71, 0.45)',
    textureGradient: ['#fef08a', '#ca8a04'],
    radius: 9,
    preferredTrack: 3,
  },
  Sun: {
    name: 'Sun',
    sanskritName: { en: 'Surya', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    shortName: { en: 'Surya', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    color: '#fbbf24',
    haloColor: 'rgba(251, 191, 36, 0.5)',
    textureGradient: ['#fef08a', '#ea580c'],
    radius: 11.5,
    preferredTrack: 4,
  },
  Mars: {
    name: 'Mars',
    sanskritName: { en: 'Mangala', kn: 'ಮಂಗಳ', hi: 'मंगल' },
    shortName: { en: 'Kuja', kn: 'ಕುಜ', hi: 'मंगल' },
    color: '#ef4444',
    haloColor: 'rgba(239, 68, 68, 0.45)',
    textureGradient: ['#f87171', '#991b1b'],
    radius: 9,
    preferredTrack: 5,
  },
  Jupiter: {
    name: 'Jupiter',
    sanskritName: { en: 'Guru', kn: 'ಗುರು', hi: 'गुरु' },
    shortName: { en: 'Guru', kn: 'ಗುರು', hi: 'गुरु' },
    color: '#fb923c',
    haloColor: 'rgba(251, 146, 60, 0.48)',
    textureGradient: ['#fdba74', '#c2410c'],
    radius: 12,
    preferredTrack: 6,
  },
  Saturn: {
    name: 'Saturn',
    sanskritName: { en: 'Shani', kn: 'ಶನಿ', hi: 'शनि' },
    shortName: { en: 'Shani', kn: 'ಶನಿ', hi: 'शनि' },
    color: '#eab308',
    haloColor: 'rgba(234, 179, 8, 0.4)',
    textureGradient: ['#fef08a', '#854d0e'],
    hasRings: true,
    ringColor: 'rgba(250, 204, 21, 0.78)',
    radius: 10,
    preferredTrack: 7,
  },
  Rahu: {
    name: 'Rahu',
    sanskritName: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु' },
    shortName: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु' },
    color: '#94a3b8',
    haloColor: 'rgba(148, 163, 184, 0.42)',
    textureGradient: ['#cbd5e1', '#334155'],
    radius: 8.5,
    preferredTrack: 0,
  },
  Ketu: {
    name: 'Ketu',
    sanskritName: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु' },
    shortName: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु' },
    color: '#a855f7',
    haloColor: 'rgba(168, 85, 247, 0.42)',
    textureGradient: ['#d8b4fe', '#581c87'],
    radius: 8.5,
    preferredTrack: 8,
  },
};

type ZoomTarget =
  | { type: 'nakshatra'; index: number }
  | { type: 'rashi'; index: number }
  | { type: 'planet'; name: string }
  | null;

interface ViewBoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CANVAS_SIZE = 940;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;
const EARTH_R = 40;
const ORBIT_MIN_R = 88;
const ORBIT_MAX_R = 236;
const RASHI_INNER_R = 262;
const RASHI_OUTER_R = 324;
const NAK_INNER_R = 336;
const NAK_OUTER_R = 434;

const FULL_VIEWBOX: ViewBoxRect = { x: 0, y: 0, w: CANVAS_SIZE, h: CANVAS_SIZE };

function getCoords(deg: number, radius: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
}

function circularAngleDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function describeArc(startDeg: number, endDeg: number, innerR: number, outerR: number): string {
  const [x1, y1] = getCoords(startDeg, outerR);
  const [x2, y2] = getCoords(endDeg, outerR);
  const [x3, y3] = getCoords(endDeg, innerR);
  const [x4, y4] = getCoords(startDeg, innerR);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export const CelestialSkyMandala3D: React.FC<CelestialSkyMandala3DProps> = ({
  currentLang,
  kundaliData,
  dateStr,
  timeStr,
  cityName,
  selectedCity,
  defaultViewMode = '3d',
  showRashiStarMapInline = false,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'starmap'>(defaultViewMode);
  const [zoomTarget, setZoomTarget] = useState<ZoomTarget>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showHowToUse, setShowHowToUse] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showPadas, setShowPadas] = useState<boolean>(true);
  const [liveTimestamp, setLiveTimestamp] = useState<string>(() => new Date().toLocaleString());

  const resolvedCity: CityLocation = useMemo(() => {
    if (selectedCity) return selectedCity;
    const match = CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
    return match || CITIES[0];
  }, [selectedCity, cityName]);

  // Smoothly animated SVG viewBox for genuine in-place zoom directly from the clicked Star / Rashi / Graha
  const [currentViewBox, setCurrentViewBox] = useState<ViewBoxRect>(FULL_VIEWBOX);
  const animFrameRef = useRef<number | null>(null);
  const viewBoxRef = useRef<ViewBoxRect>(FULL_VIEWBOX);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute exact sidereal coordinates, collision-free radial tracks, and collision-free label pill coordinates
  const placedPlanets = useMemo(() => {
    const trackCount = 9;
    const trackStep = (ORBIT_MAX_R - ORBIT_MIN_R) / (trackCount - 1);
    const trackRadii = Array.from({ length: trackCount }, (_, i) => ORBIT_MIN_R + i * trackStep);

    const raw = kundaliData.planets.map((planet) => {
      const absLong = ((planet.rashiIndex * 30 + planet.degrees) % 360 + 360) % 360;
      const degPart = Math.floor(planet.degrees);
      const minPart = Math.floor((planet.degrees - degPart) * 60);
      const nakSpan = 360 / 27;
      const nakIndex = Math.floor(absLong / nakSpan) % 27;
      const padaNumber = Math.min(4, Math.max(1, Math.floor((absLong % nakSpan) / (nakSpan / 4)) + 1));
      const aksharaInfo = getNakshatraPadaAkshara(nakIndex, padaNumber);
      const cfg = PLANET_VISUALS[planet.name] || PLANET_VISUALS.Sun;
      return {
        ...planet,
        absLong,
        degPart,
        minPart,
        nakIndex,
        padaNumber,
        aksharaInfo,
        formattedDeg: `${degPart}°${String(minPart).padStart(2, '0')}'`,
        cfg,
      };
    });

    // Assign collision-free radial tracks while keeping exact astronomical longitude angle!
    const placed: Array<
      (typeof raw)[number] & {
        orbitR: number;
        px: number;
        py: number;
        lx: number;
        ly: number;
      }
    > = [];

    const sorted = [...raw].sort((a, b) => a.absLong - b.absLong);
    for (const p of sorted) {
      const nearby = placed.filter((other) => circularAngleDiff(other.absLong, p.absLong) < 22);
      const usedRadii = nearby.map((n) => n.orbitR);

      // Score candidate tracks: maximize distance from nearby occupied tracks, break ties by preferred track
      let bestR = trackRadii[p.cfg.preferredTrack] ?? trackRadii[4];
      let bestScore = -Infinity;
      for (let t = 0; t < trackCount; t++) {
        const candR = trackRadii[t];
        const minDistToUsed =
          usedRadii.length === 0
            ? 999
            : Math.min(...usedRadii.map((ur) => Math.abs(ur - candR)));
        const prefPenalty = Math.abs(t - p.cfg.preferredTrack) * 1.8;
        const score = (minDistToUsed < 26 ? minDistToUsed * 4 - 200 : minDistToUsed) - prefPenalty;
        if (score > bestScore) {
          bestScore = score;
          bestR = candR;
        }
      }

      const [px, py] = getCoords(p.absLong, bestR);
      // Initial label anchor slightly outside the planet sphere
      const initialLabelR = bestR + 22 > RASHI_INNER_R - 18 ? bestR - 22 : bestR + 22;
      const [lx, ly] = getCoords(p.absLong, initialLabelR);
      placed.push({ ...p, orbitR: bestR, px, py, lx, ly });
    }

    // Iterative 2D label collision repulsion so NO two planet name pills ever overlap
    const BOX_W = 72;
    const BOX_H = 26;
    for (let iter = 0; iter < 70; iter++) {
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          const a = placed[i];
          const b = placed[j];
          const dx = b.lx - a.lx;
          const dy = b.ly - a.ly;
          const overlapX = BOX_W - Math.abs(dx);
          const overlapY = BOX_H - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            // Push apart gently along the axis of minimum penetration (with deterministic tie-breaker)
            if (overlapX < overlapY) {
              const push = (overlapX / 2 + 1.5) * (dx >= 0 ? 1 : -1);
              a.lx -= push;
              b.lx += push;
            } else {
              const push = (overlapY / 2 + 1.5) * (dy >= 0 ? 1 : -1);
              a.ly -= push;
              b.ly += push;
            }
          }
        }
      }

      // Also gently keep labels away from planet spheres and within [EARTH_R+28, RASHI_INNER_R-16]
      for (const p of placed) {
        // Soft spring back toward its own planet so leader lines stay short & neat
        const dxToPlanet = p.px - p.lx;
        const dyToPlanet = p.py - p.ly;
        const distToPlanet = Math.hypot(dxToPlanet, dyToPlanet) || 1;
        if (distToPlanet > 36) {
          p.lx += (dxToPlanet / distToPlanet) * 0.6;
          p.ly += (dyToPlanet / distToPlanet) * 0.6;
        } else if (distToPlanet < 22) {
          p.lx -= (dxToPlanet / distToPlanet) * 1.4;
          p.ly -= (dyToPlanet / distToPlanet) * 1.4;
        }

        // Clamp radial distance inside the planetary zone
        const rFromCenter = Math.hypot(p.lx - CX, p.ly - CY) || 1;
        const minR = EARTH_R + 28;
        const maxR = RASHI_INNER_R - 18;
        if (rFromCenter < minR) {
          p.lx = CX + ((p.lx - CX) / rFromCenter) * minR;
          p.ly = CY + ((p.ly - CY) / rFromCenter) * minR;
        } else if (rFromCenter > maxR) {
          p.lx = CX + ((p.lx - CX) / rFromCenter) * maxR;
          p.ly = CY + ((p.ly - CY) / rFromCenter) * maxR;
        }
      }
    }

    return placed;
  }, [kundaliData.planets]);

  // Compute desired target viewBox whenever zoomTarget changes
  const targetViewBox = useMemo<ViewBoxRect>(() => {
    if (!zoomTarget) return FULL_VIEWBOX;

    if (zoomTarget.type === 'nakshatra') {
      const nak = NAKSHATRA_SKY_PATTERNS[zoomTarget.index];
      const midDeg = (nak.spanStartDeg + nak.spanEndDeg) / 2;
      const [fx, fy] = getCoords(midDeg, (NAK_INNER_R + NAK_OUTER_R) / 2 - 12);
      const span = 270;
      return {
        x: Math.max(0, Math.min(CANVAS_SIZE - span, fx - span / 2)),
        y: Math.max(0, Math.min(CANVAS_SIZE - span, fy - span / 2)),
        w: span,
        h: span,
      };
    }

    if (zoomTarget.type === 'rashi') {
      const midDeg = zoomTarget.index * 30 + 15;
      const [fx, fy] = getCoords(midDeg, (RASHI_INNER_R + NAK_OUTER_R) / 2 - 15);
      const span = 410;
      return {
        x: Math.max(0, Math.min(CANVAS_SIZE - span, fx - span / 2)),
        y: Math.max(0, Math.min(CANVAS_SIZE - span, fy - span / 2)),
        w: span,
        h: span,
      };
    }

    if (zoomTarget.type === 'planet') {
      const found = placedPlanets.find((p) => p.name === zoomTarget.name);
      if (!found) return FULL_VIEWBOX;
      const [fx, fy] = getCoords(found.absLong, Math.min(found.orbitR + 40, RASHI_INNER_R));
      const span = 380;
      return {
        x: Math.max(0, Math.min(CANVAS_SIZE - span, fx - span / 2)),
        y: Math.max(0, Math.min(CANVAS_SIZE - span, fy - span / 2)),
        w: span,
        h: span,
      };
    }

    return FULL_VIEWBOX;
  }, [zoomTarget, placedPlanets]);

  // Animate SVG viewBox smoothly using cubic ease-out so it zooms directly from the clicked item!
  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const startRect = { ...viewBoxRef.current };
    const endRect = targetViewBox;
    const duration = 420;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const next: ViewBoxRect = {
        x: startRect.x + (endRect.x - startRect.x) * ease,
        y: startRect.y + (endRect.y - startRect.y) * ease,
        w: startRect.w + (endRect.w - startRect.w) * ease,
        h: startRect.h + (endRect.h - startRect.h) * ease,
      };
      viewBoxRef.current = next;
      setCurrentViewBox(next);
      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetViewBox]);

  const getLocalizedAkshara = (entry: (typeof NAKSHATRA_AKSHARAS)[number]) => {
    if (currentLang === 'kn') return `${entry.aksharaKannada} (${entry.akshara})`;
    if (currentLang === 'hi') return `${entry.aksharaDevanagari} (${entry.akshara})`;
    return `${entry.akshara} (${entry.aksharaKannada})`;
  };

  // Active zoomed details data (rendered inline inside the mandala, never as a floating popup)
  const zoomedNakshatra =
    zoomTarget?.type === 'nakshatra' ? NAKSHATRA_SKY_PATTERNS[zoomTarget.index] : null;
  const zoomedNakshatraPadas = useMemo(() => {
    if (!zoomedNakshatra) return [];
    return NAKSHATRA_AKSHARAS.filter((a) => a.nakshatraIndex === zoomedNakshatra.index);
  }, [zoomedNakshatra]);

  const zoomedRashi = zoomTarget?.type === 'rashi' ? RASHIS[zoomTarget.index] : null;
  const zoomedRashiPadas = useMemo(() => {
    if (zoomTarget?.type !== 'rashi') return [];
    return NAKSHATRA_AKSHARAS.filter((a) => a.rashiIndex === zoomTarget.index);
  }, [zoomTarget]);
  const zoomedRashiNakshatras = useMemo(() => {
    if (zoomTarget?.type !== 'rashi') return [];
    const nakIndices = Array.from(new Set(zoomedRashiPadas.map((p) => p.nakshatraIndex)));
    return nakIndices.map((idx) => ({
      pattern: NAKSHATRA_SKY_PATTERNS[idx],
      padas: zoomedRashiPadas.filter((p) => p.nakshatraIndex === idx),
    }));
  }, [zoomTarget, zoomedRashiPadas]);

  const zoomedPlanet =
    zoomTarget?.type === 'planet'
      ? placedPlanets.find((p) => p.name === zoomTarget.name) || null
      : null;

  // Determine which Pada indices (0..107) should show their Akshara letters directly on the zoomed SVG arc
  const highlightedPadaIndices = useMemo(() => {
    const set = new Set<number>();
    if (zoomTarget?.type === 'nakshatra') {
      for (let k = 0; k < 4; k++) set.add(zoomTarget.index * 4 + k);
    } else if (zoomTarget?.type === 'rashi') {
      for (let k = 0; k < 9; k++) set.add(zoomTarget.index * 9 + k);
    }
    return set;
  }, [zoomTarget]);

  const activeHoveredPlanetData = hoveredPlanet
    ? placedPlanets.find((p) => p.name === hoveredPlanet) || null
    : null;

  return (
    <div
      className={`relative bg-stone-950 text-white rounded-3xl border-2 border-amber-500/50 shadow-2xl overflow-hidden select-none transition-all max-w-full ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto' : 'w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 border-b border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300 tracking-tight">
                {currentLang === 'kn'
                  ? 'ಖಗೋಳೀಯ ೩D ಗ್ರಹ ಮಂಡಲ • ರಾಶಿ, ನಕ್ಷತ್ರ & ನಕ್ಷತ್ರ ಪುಂಜಗಳು'
                  : '3D Celestial Graha Mandala: Planets, Signs & Sky Constellations'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
                Sidereal Lahiri Sky
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentLang === 'kn'
                ? 'ಯಾವುದೇ ತಾರೆ (ನಕ್ಷತ್ರ) ಅಥವಾ ರಾಶಿಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ನೇರವಾಗಿ ಅಲ್ಲಿಂದಲೇ ಜೂಮ್ ಮಾಡಿ ಪಾದಾಕ್ಷರ ಮತ್ತು ನಕ್ಷತ್ರ ವಿನ್ಯಾಸ ವೀಕ್ಷಿಸಿ.'
                : 'Click any Star (Nakshatra), Rashi, or Graha to zoom in-place and inspect its constellation stars, Pada letters, and exact positions.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* How to Use Toggle Button (Hidden by Default) */}
          <button
            type="button"
            onClick={() => setShowHowToUse(!showHowToUse)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showHowToUse
                ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                : 'bg-sky-500/15 text-sky-300 border-sky-500/40 hover:bg-sky-500/25'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? 'ಬಳಸುವ ವಿಧಾನ'
                : currentLang === 'hi'
                ? 'उपयोग विधि'
                : 'How to Use'}
            </span>
            {showHowToUse ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowConstellations(!showConstellations)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showConstellations
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ತಾರಾ ಪುಂಜಗಳು' : 'Stars'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPadas(!showPadas)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showPadas
                ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? '೧೦೮ ಪಾದಗಳು' : '108 Padas'}</span>
          </button>

          {zoomTarget && (
            <button
              type="button"
              onClick={() => setZoomTarget(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all cursor-pointer shadow-md"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? '೩೬೦° ಪೂರ್ಣ ವೀಕ್ಷಣೆ' : 'Reset 360° Zoom'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLLAPSIBLE "HOW TO USE" GUIDE (ALWAYS HIDDEN BY DEFAULT, EXPANDS INLINE) */}
      {/* ========================================================================= */}
      {showHowToUse && (
        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 border-b border-sky-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between gap-2 border-b border-sky-500/20 pb-2">
            <h4 className="font-serif font-bold text-sm sm:text-base text-sky-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {currentLang === 'kn'
                  ? '೩D ಖಗೋಳೀಯ ಗ್ರಹ ಮಂಡಲವನ್ನು ಬಳಸುವ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ'
                  : currentLang === 'hi'
                  ? '3D खगोलीय ग्रह मण्डल उपयोग मार्गदर्शिका'
                  : 'Complete Guide: How to Use the 3D Celestial Graha Mandala'}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setShowHowToUse(false)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 cursor-pointer"
            >
              {currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Hide'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-amber-500/25 space-y-1">
              <strong className="text-amber-300 block font-serif">
                {currentLang === 'kn' ? '೧. ತಾರೆ / ನಕ್ಷತ್ರ ಜೂಮ್' : '1. Click Any Star (Nakshatra)'}
              </strong>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {currentLang === 'kn'
                  ? 'ಹೊರ ವೃತ್ತದಲ್ಲಿರುವ ಯಾವುದೇ ೨೭ ನಕ್ಷತ್ರ ಅಥವಾ ತಾರಾ ಪುಂಜದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ. ಮಂಡಲವು ಅಲ್ಲಿಂದಲೇ ಜೂಮ್ ಆಗಿ ಆ ನಕ್ಷತ್ರದ ಆಕಾರ ಮತ್ತು ೪ ಪಾದಗಳ ಅಕ್ಷರಗಳನ್ನು (ಉದಾ: ಚು, ಚೆ, ಚೊ, ಲಾ) ತೋರಿಸುತ್ತದೆ.'
                  : 'Click any of the 27 outer Nakshatra star clusters. The wheel smoothly zooms right onto that star pattern, showing its 4 Padas and exact Pada Akshara letters.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-emerald-500/25 space-y-1">
              <strong className="text-emerald-300 block font-serif">
                {currentLang === 'kn' ? '೨. ರಾಶಿ & ನಕ್ಷತ್ರ ಸಂಯೋಜನೆ ಜೂಮ್' : '2. Click Any Rashi (Zodiac Sign)'}
              </strong>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {currentLang === 'kn'
                  ? 'ಚಿನ್ನದ ವೃತ್ತದಲ್ಲಿರುವ ಯಾವುದೇ ೧೨ ರಾಶಿಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ. ಆ ರಾಶಿಯು ಯಾವ ೨.೨೫ ನಕ್ಷತ್ರಗಳು (೯ ಪಾದಗಳು) ಮತ್ತು ತಾರಾ ವಿನ್ಯಾಸಗಳಿಂದ ರಚಿತವಾಗಿದೆ, ಪ್ರತಿ ಪಾದದ ಅಕ್ಷರ ಮತ್ತು ಆ ರಾಶಿಯಲ್ಲಿರುವ ಗ್ರಹಗಳನ್ನು ಜೂಮ್ ಮಾಡಿ ನೋಡಬಹುದು.'
                  : 'Click any of the 12 golden Rashi segments to zoom into its 30° arc, revealing its constituent star constellations, all 9 Padas with letters, and Grahas positioned inside it.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-sky-500/25 space-y-1">
              <strong className="text-sky-300 block font-serif">
                {currentLang === 'kn' ? '೩. ನಿಖರ ಗ್ರಹ ಸ್ಥಾನ & ಹೆಸರುಗಳು' : '3. Exact Graha Positions'}
              </strong>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {currentLang === 'kn'
                  ? 'ಪ್ರತಿಯೊಂದು ಗ್ರಹವೂ ಆ ದಿನದ ನಿಖರ ಲಾಹಿರಿ ಅಂಶದ ರೇಖೆಯ ಮೇಲೆಯೇ ಇರುತ್ತದೆ. ಒಂದೇ ರಾಶಿಯಲ್ಲಿ ಹಲವು ಗ್ರಹಗಳಿದ್ದಾಗಲೂ ಹೆಸರುಗಳು ಒಂದರ ಮೇಲೊಂದು ಬರದಂತೆ ಪ್ರತ್ಯೇಕ ರೇಖೆಗಳೊಂದಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸಲಾಗಿದೆ.'
                  : 'Each planet sits strictly on its true sidereal longitude ray from Earth to the zodiac ring. Even during close conjunctions, planets use staggered tracks and clean callout labels so nothing overlaps.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-purple-500/25 space-y-1">
              <strong className="text-purple-300 block font-serif">
                {currentLang === 'kn' ? '೪. ಆಕಾಶ ದಿಕ್ಕು & ಪೂರ್ಣ ವೀಕ್ಷಣೆ' : '4. Sky Compass & Reset'}
              </strong>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {currentLang === 'kn'
                  ? 'ಮಧ್ಯದಲ್ಲಿ ಭೂಮಿ ಇದ್ದು ೦° ಮೇಷದಿಂದ ೩೬೦° ಮೀನದವರೆಗೆ ವೃತ್ತವಿದೆ. ಜೂಮ್ ಮಾಡಿದ ನಂತರ "೩೬೦° ಪೂರ್ಣ ವೀಕ್ಷಣೆ" ಬಟನ್ ಒತ್ತಿ ಮತ್ತೆ ಸಂಪೂರ್ಣ ಆಕಾಶವನ್ನು ನೋಡಬಹುದು.'
                  : 'Earth sits at the center surrounded by 0° Mesha to 360° Revati. Whenever zoomed into a Star, Rashi, or Planet, tap "Reset 360° Zoom" to smoothly return to the full sky.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE SWITCHER: ALL-SIDES 3D WEBGL • 2D ZOOM WHEEL • RASHI STAR MAP  */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-5 py-3 bg-stone-900/90 border-b border-amber-500/25 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              viewMode === '3d'
                ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md'
                : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? 'ಸರ್ವದಿಕ್ಕು ೩D ಖಗೋಳ (All-Sides 3D)'
                : currentLang === 'hi'
                ? 'संपूर्ण 3D खगोल मण्डल'
                : 'All-Sides 3D Celestial Sphere'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              viewMode === '2d'
                ? 'bg-sky-500 text-stone-950 border-sky-300 shadow-md'
                : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? '೨D ಜೂಮ್ ಚಕ್ರ & ಪಾದಾಕ್ಷರ'
                : currentLang === 'hi'
                ? '2D ज़ूम चक्र एवं पदाक्षर'
                : '2D In-Place Zoom Sky Wheel'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('starmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              viewMode === 'starmap'
                ? 'bg-emerald-500 text-stone-950 border-emerald-300 shadow-md'
                : 'bg-stone-800/90 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? 'ರಾಶಿ ತಾರಾ ವಿನ್ಯಾಸ & ಆಕಾಶ ದಿಕ್ಕು'
                : currentLang === 'hi'
                ? 'राशि तारा मानचित्र एवं आकाश दिशा'
                : 'Rashi Star Map & Sky Direction'}
            </span>
          </button>
        </div>

        <span className="text-[10.5px] font-mono text-stone-400">
          {resolvedCity.name} ({resolvedCity.lat.toFixed(2)}°N, {resolvedCity.lng.toFixed(2)}°E) • {dateStr} {timeStr}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: FULL ALL-SIDES INTERACTIVE 3D WEBGL CELESTIAL ARMILLARY SPHERE   */}
      {/* ========================================================================= */}
      {viewMode === '3d' && (
        <div className="p-3 sm:p-4 space-y-4 bg-[#040712]">
          <ThreeNightSky3D
            currentLang={currentLang}
            kundaliData={kundaliData}
            showConstellations={showConstellations}
            showPadas={showPadas}
            showDirections={true}
            onSelectItem={(item) => {
              if (item.type === 'planet' && item.name) {
                setZoomTarget({ type: 'planet', name: item.name });
              } else if (item.type === 'rashi' && typeof item.index === 'number') {
                setZoomTarget({ type: 'rashi', index: item.index });
              } else if (item.type === 'nakshatra' && typeof item.index === 'number') {
                setZoomTarget({ type: 'nakshatra', index: item.index });
              }
            }}
          />

          {/* Descriptive 3D Celestial Mechanics & Layer Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/30 space-y-1">
              <div className="text-[10.5px] font-mono font-bold uppercase text-amber-300">
                {currentLang === 'kn' ? '೧. ಸುವರ್ಣ ಕ್ರಾಂತಿವೃತ್ತ (Ecliptic 360°)' : '1. Golden Ecliptic Belt (360°)'}
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {currentLang === 'kn'
                  ? '೧೨ ರಾಶಿಗಳು (ತಲಾ ೩೦°), ೨೭ ನಕ್ಷತ್ರಗಳು (ತಲಾ ೧೩°೨೦′) ಮತ್ತು ೧೦೮ ಪಾದಗಳು (ತಲಾ ೩°೨೦′) ಭೂಮಿಯ ಸುತ್ತ ೩೬೦° ವೃತ್ತದಲ್ಲಿ ನಿಖರವಾಗಿ ಜೋಡಿಸಲ್ಪಟ್ಟಿವೆ.'
                  : '12 Rashis (30° each), 27 Nakshatras (13°20′ each), and 108 Padas (3°20′ each) encircle Earth along the sidereal Lahiri ecliptic plane.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-sky-500/30 space-y-1">
              <div className="text-[10.5px] font-mono font-bold uppercase text-sky-300">
                {currentLang === 'kn' ? '೨. ಭೂಮಿ ಅಕ್ಷ & ಖಗೋಳ ವೃತ್ತಗಳು' : '2. 23.4° Earth Axis & Armillary'}
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {currentLang === 'kn'
                  ? 'ಭೂಮಿಯ ೨೩.೪° ಓರೆಯ ಅಕ್ಷ (ಉತ್ತರ-ದಕ್ಷಿಣ ಧ್ರುವ), ನೀಲಿ ಖಗೋಳ ವಿಷುವದ್ವೃತ್ತ ಮತ್ತು ಚಿನ್ನದ ಯಾಮ್ಯೋತ್ತರ ವೃತ್ತಗಳನ್ನು ಮೇಲಿನಿಂದ, ಪಕ್ಕದಿಂದ ಹಾಗೂ ಕೆಳಗಿನಿಂದ ೩೬೦° ತಿರುಗಿಸಿ ನೋಡಬಹುದು.'
                  : 'Earth’s 23.4° tilted polar axis (NCP–SCP), cyan Celestial Equator, and brass Meridian rings let you inspect top, side, and southern underside views.'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-rose-500/30 space-y-1">
              <div className="text-[10.5px] font-mono font-bold uppercase text-rose-300">
                {currentLang === 'kn' ? '೩. ಪೂರ್ವ ಉದಯ ಲಗ್ನ & ಗ್ರಹ ರೇಖೆಗಳು' : '3. Lagna Beacon & Planet Stems'}
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {currentLang === 'kn'
                  ? `ಕೆಂಪು ರತ್ನದ ಲಗ್ನ ಗುರುತು (${kundaliData.houses[0].rashiName.kn} ${kundaliData.lagnaDegree.toFixed(1)}°) ಪೂರ್ವ ದಿಗಂತವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಪ್ರತಿ ಗ್ರಹದ ಲಂಬ ರೇಖೆಯು ಅದರ ನಿಖರ ರೇಖಾಂಶವನ್ನು ತೋರಿಸುತ್ತದೆ.`
                  : `The crimson Lagna beacon (${kundaliData.houses[0].rashiName.en} ${kundaliData.lagnaDegree.toFixed(1)}°) marks the eastern rising horizon. Vertical drop-stems show each planet’s exact ecliptic longitude.`}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/90 border border-emerald-500/30 space-y-1">
              <div className="text-[10.5px] font-mono font-bold uppercase text-emerald-300">
                {currentLang === 'kn' ? '೪. ೩D ರಾಶಿ & ನಕ್ಷತ್ರ ತಾರಾ ಪುಂಜ' : '4. 3D Sky Star Constellations'}
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {currentLang === 'kn'
                  ? 'ಹೊರ ಆಕಾಶ ಗೋಳದಲ್ಲಿ ೧೨ ರಾಶಿಗಳ ತಾರಾ ವಿನ್ಯಾಸಗಳು ಮತ್ತು ೨೭ ನಕ್ಷತ್ರ ಪುಂಜಗಳನ್ನು ೩D ಆಳದಲ್ಲಿ ಜೋಡಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಗ್ರಹ, ರಾಶಿ ಅಥವಾ ನಕ್ಷತ್ರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ವಿವರ ಪಡೆಯಿರಿ.'
                  : 'Both 12 Rashi star constellations and 27 Nakshatra clusters float in 3D depth around the zodiac ring. Click any object to smoothly focus and inspect details below.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: INTERACTIVE RASHI STAR MAP & LIVE SKY DIRECTION HELPER           */}
      {/* ========================================================================= */}
      {viewMode === 'starmap' && (
        <div className="p-3 sm:p-5 bg-slate-950">
          <RashiStarMap
            currentLang={currentLang}
            kundaliData={kundaliData}
            dateStr={dateStr}
            timeStr={timeStr}
            selectedCity={resolvedCity}
            initialRashiIndex={zoomTarget?.type === 'rashi' ? zoomTarget.index : kundaliData.houses[0]?.rashiIndex ?? 0}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE IN-PLACE ZOOMABLE 2D SVG CELESTIAL SPHERE            */}
      {/* ========================================================================= */}
      {viewMode === '2d' && (
      <div className="relative w-full aspect-square max-w-[820px] mx-auto p-1.5 sm:p-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0c1a3b_0%,#050814_62%,#02040a_100%)] pointer-events-none" />

        {/* Zoom Status & Reset Pill Inside Canvas Top */}
        {zoomTarget && (
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto px-3 py-1.5 rounded-xl bg-stone-950/90 border border-amber-400/60 backdrop-blur-md text-xs font-bold text-amber-300 flex items-center gap-2 shadow-xl">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {zoomTarget.type === 'nakshatra' && zoomedNakshatra
                  ? `${currentLang === 'kn' ? zoomedNakshatra.nameKn : zoomedNakshatra.nameEn} (${zoomedNakshatra.spanStartDeg.toFixed(1)}°–${zoomedNakshatra.spanEndDeg.toFixed(1)}°)`
                  : zoomTarget.type === 'rashi' && zoomedRashi
                  ? `${zoomedRashi[currentLang]} (${zoomTarget.index * 30}°–${(zoomTarget.index + 1) * 30}°)`
                  : zoomedPlanet
                  ? `${zoomedPlanet.cfg.sanskritName[currentLang]} • ${zoomedPlanet.rashiName[currentLang]} ${zoomedPlanet.formattedDeg}`
                  : ''}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5">
              {(zoomTarget.type === 'nakshatra' || zoomTarget.type === 'rashi') && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (zoomTarget.type === 'nakshatra') {
                        setZoomTarget({ type: 'nakshatra', index: (zoomTarget.index + 26) % 27 });
                      } else {
                        setZoomTarget({ type: 'rashi', index: (zoomTarget.index + 11) % 12 });
                      }
                    }}
                    className="p-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-600 text-stone-200 cursor-pointer"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (zoomTarget.type === 'nakshatra') {
                        setZoomTarget({ type: 'nakshatra', index: (zoomTarget.index + 1) % 27 });
                      } else {
                        setZoomTarget({ type: 'rashi', index: (zoomTarget.index + 1) % 12 });
                      }
                    }}
                    className="p-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-600 text-stone-200 cursor-pointer"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setZoomTarget(null)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer shadow-lg"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಪೂರ್ಣ ೩೬೦°' : 'Full 360°'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Fixed Non-Jumping Hover Coordinate Readout Top-Left (when not zoomed) */}
        {!zoomTarget && activeHoveredPlanetData && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-stone-950/92 border border-sky-400/60 backdrop-blur-md text-[11px] font-mono text-sky-200 shadow-xl pointer-events-none">
            <strong className="text-amber-300">{activeHoveredPlanetData.cfg.sanskritName[currentLang]}</strong>{' '}
            • {activeHoveredPlanetData.rashiName[currentLang]} {activeHoveredPlanetData.formattedDeg} •{' '}
            {activeHoveredPlanetData.nakshatra[currentLang]} • P{activeHoveredPlanetData.padaNumber} (
            {activeHoveredPlanetData.aksharaInfo
              ? getLocalizedAkshara(activeHoveredPlanetData.aksharaInfo)
              : ''}
            ) • H#{activeHoveredPlanetData.bhava}
          </div>
        )}

        {/* MASTER SVG CELESTIAL SPHERE WITH ANIMATED IN-PLACE VIEWBOX ZOOM */}
        <svg
          viewBox={`${currentViewBox.x.toFixed(1)} ${currentViewBox.y.toFixed(1)} ${currentViewBox.w.toFixed(1)} ${currentViewBox.h.toFixed(1)}`}
          className="w-full h-full relative z-10 select-none"
        >
          <defs>
            <filter id="sky-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="earth-gradient" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            {Object.entries(PLANET_VISUALS).map(([key, config]) => (
              <radialGradient key={key} id={`planet-grad-${key}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor={config.textureGradient[0]} />
                <stop offset="100%" stopColor={config.textureGradient[1]} />
              </radialGradient>
            ))}

            <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.06)" />
            </pattern>
          </defs>

          <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="url(#grid-dots)" />

          {/* 30° Zodiac Divider Rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const [x1, y1] = getCoords(angle, EARTH_R);
            const [x2, y2] = getCoords(angle, NAK_OUTER_R + 14);
            const [tx, ty] = getCoords(angle, RASHI_OUTER_R + 10);
            return (
              <g key={angle}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(217, 119, 6, 0.25)"
                  strokeWidth="1.1"
                  strokeDasharray="3,3"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity="0.85"
                >
                  {angle}°
                </text>
              </g>
            );
          })}

          {/* Concentric Orbital Reference Rings */}
          <circle cx={CX} cy={CY} r={108} fill="none" stroke="rgba(56, 189, 248, 0.16)" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx={CX} cy={CY} r={162} fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx={CX} cy={CY} r={216} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="4,4" />

          {/* ========================================================================= */}
          {/* 12 RASHIS BELT (CLICK ANY RASHI TO ZOOM IN-PLACE) */}
          {/* ========================================================================= */}
          <g id="rashis-belt">
            {RASHIS.map((rashi, idx) => {
              const startDeg = idx * 30;
              const endDeg = (idx + 1) * 30;
              const midDeg = startDeg + 15;
              const [tx, ty] = getCoords(midDeg, (RASHI_INNER_R + RASHI_OUTER_R) / 2);
              const isSelected = zoomTarget?.type === 'rashi' && zoomTarget.index === idx;
              const hasPlanets = placedPlanets.some((p) => p.rashiIndex === idx);

              return (
                <g
                  key={rashi.en}
                  onClick={() =>
                    setZoomTarget((prev) =>
                      prev?.type === 'rashi' && prev.index === idx ? null : { type: 'rashi', index: idx }
                    )
                  }
                  className="cursor-pointer"
                >
                  <path
                    d={describeArc(startDeg, endDeg, RASHI_INNER_R, RASHI_OUTER_R)}
                    fill={
                      isSelected
                        ? 'rgba(245, 158, 11, 0.34)'
                        : hasPlanets
                        ? 'rgba(30, 41, 59, 0.85)'
                        : 'rgba(15, 23, 42, 0.72)'
                    }
                    stroke={isSelected ? '#fde047' : 'rgba(217, 119, 6, 0.55)'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill={isSelected ? '#fef08a' : '#fbbf24'}
                    fontSize={isSelected ? '13.5' : '12'}
                    fontWeight="bold"
                    fontFamily="serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg}, ${tx}, ${ty})`}
                  >
                    {rashi[currentLang] || rashi.en}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 108 NAKSHATRA PADAS RING (SHOWS PADA LETTERS DIRECTLY ON ARC WHEN ZOOMED!) */}
          {/* ========================================================================= */}
          {showPadas && (
            <g id="nakshatra-padas">
              {NAKSHATRA_AKSHARAS.map((padaEntry, pIdx) => {
                const startDeg = pIdx * (360 / 108);
                const endDeg = (pIdx + 1) * (360 / 108);
                const midDeg = (startDeg + endDeg) / 2;
                const [x1, y1] = getCoords(startDeg, RASHI_OUTER_R);
                const [x2, y2] = getCoords(startDeg, NAK_INNER_R);
                const isMajor = pIdx % 4 === 0;
                const isHighlighted = highlightedPadaIndices.has(pIdx);
                const [ptx, pty] = getCoords(midDeg, (RASHI_OUTER_R + NAK_INNER_R) / 2 + 1);

                return (
                  <g key={pIdx}>
                    {isHighlighted && (
                      <path
                        d={describeArc(startDeg, endDeg, RASHI_OUTER_R, NAK_INNER_R + 22)}
                        fill={pIdx % 2 === 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)'}
                        stroke="rgba(125, 211, 252, 0.75)"
                        strokeWidth="0.9"
                      />
                    )}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)'}
                      strokeWidth={isMajor ? '1.5' : '0.7'}
                    />
                    {isHighlighted && (
                      <text
                        x={ptx}
                        y={pty}
                        fill="#fef08a"
                        fontSize="6.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg}, ${ptx}, ${pty})`}
                      >
                        P{padaEntry.pada}:{currentLang === 'kn' ? padaEntry.aksharaKannada : currentLang === 'hi' ? padaEntry.aksharaDevanagari : padaEntry.akshara}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 27 NAKSHATRAS OUTER RING WITH CONSTELLATION STARS (CLICK ANY STAR TO ZOOM!) */}
          {/* ========================================================================= */}
          <g id="nakshatras-ring">
            {NAKSHATRA_SKY_PATTERNS.map((nak) => {
              const midDeg = (nak.spanStartDeg + nak.spanEndDeg) / 2;
              const [tx, ty] = getCoords(midDeg, NAK_OUTER_R + 12);
              const [clusterX, clusterY] = getCoords(midDeg, (NAK_INNER_R + NAK_OUTER_R) / 2 + 6);
              const isSelectedNak = zoomTarget?.type === 'nakshatra' && zoomTarget.index === nak.index;
              const isPartOfZoomedRashi =
                zoomTarget?.type === 'rashi' &&
                zoomedRashiNakshatras.some((n) => n.pattern.index === nak.index);

              return (
                <g
                  key={nak.index}
                  onClick={() =>
                    setZoomTarget((prev) =>
                      prev?.type === 'nakshatra' && prev.index === nak.index
                        ? null
                        : { type: 'nakshatra', index: nak.index }
                    )
                  }
                  className="cursor-pointer"
                >
                  {/* Clickable Sector Background for Easy Mobile & Desktop Tap */}
                  <path
                    d={describeArc(nak.spanStartDeg, nak.spanEndDeg, NAK_INNER_R, NAK_OUTER_R + 22)}
                    fill={
                      isSelectedNak
                        ? 'rgba(56, 189, 248, 0.22)'
                        : isPartOfZoomedRashi
                        ? 'rgba(251, 191, 36, 0.14)'
                        : 'transparent'
                    }
                    stroke={
                      isSelectedNak
                        ? '#38bdf8'
                        : isPartOfZoomedRashi
                        ? 'rgba(251, 191, 36, 0.5)'
                        : 'rgba(148, 163, 184, 0.14)'
                    }
                    strokeWidth={isSelectedNak ? '2' : '0.8'}
                  />

                  {/* Outer Nakshatra Name */}
                  <text
                    x={tx}
                    y={ty}
                    fill={isSelectedNak ? '#7dd3fc' : isPartOfZoomedRashi ? '#fde047' : '#cbd5e1'}
                    fontSize={isSelectedNak ? '10.5' : '9'}
                    fontWeight={isSelectedNak || isPartOfZoomedRashi ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg}, ${tx}, ${ty})`}
                  >
                    {currentLang === 'kn' ? nak.nameKn : currentLang === 'hi' ? nak.nameHi : nak.nameEn}
                  </text>

                  {/* Authentic Constellation Star Cluster Pattern */}
                  {showConstellations && (
                    <g
                      transform={`translate(${clusterX}, ${clusterY}) scale(${isSelectedNak ? 1.55 : isPartOfZoomedRashi ? 1.25 : 1})`}
                    >
                      {nak.lines.map(([idxA, idxB], lineIdx) => {
                        const ptA = nak.stars[idxA];
                        const ptB = nak.stars[idxB];
                        if (!ptA || !ptB) return null;
                        return (
                          <line
                            key={lineIdx}
                            x1={ptA[0]}
                            y1={ptA[1]}
                            x2={ptB[0]}
                            y2={ptB[1]}
                            stroke={isSelectedNak ? '#38bdf8' : isPartOfZoomedRashi ? '#fcd34d' : 'rgba(255, 255, 255, 0.5)'}
                            strokeWidth={isSelectedNak ? '1.3' : '0.95'}
                          />
                        );
                      })}

                      {nak.stars.map(([sx, sy], sIdx) => (
                        <circle
                          key={sIdx}
                          cx={sx}
                          cy={sy}
                          r={sIdx === 0 ? '2.5' : '1.7'}
                          fill={sIdx === 0 && (isSelectedNak || isPartOfZoomedRashi) ? '#fef08a' : '#ffffff'}
                          filter="url(#sky-glow)"
                        />
                      ))}
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* THE 9 GRAHAS — EXACT SIDEREAL LONGITUDE + ZERO OVERLAP SPHERES & NAMES */}
          {/* ========================================================================= */}
          <g id="grahas-alignment">
            {/* Layer 1: Exact Sidereal Alignment Rays (Earth → Planet → Exact Zodiac Degree Tick) */}
            {placedPlanets.map((planet) => {
              const [ex, ey] = getCoords(planet.absLong, EARTH_R);
              const [zrx, zry] = getCoords(planet.absLong, RASHI_INNER_R);
              const isFocus =
                hoveredPlanet === planet.name ||
                (zoomTarget?.type === 'planet' && zoomTarget.name === planet.name);

              return (
                <g key={`ray-${planet.name}`}>
                  {/* True Astronomical Line from Earth through Planet to Rashi Inner Edge */}
                  <line
                    x1={ex}
                    y1={ey}
                    x2={zrx}
                    y2={zry}
                    stroke={isFocus ? planet.cfg.color : planet.cfg.haloColor}
                    strokeWidth={isFocus ? '2' : '1'}
                    strokeDasharray={isFocus ? 'none' : '3,3'}
                    opacity={isFocus ? '0.95' : '0.45'}
                  />
                  {/* Exact Degree Marker Dot on the Rashi Inner Border */}
                  <circle
                    cx={zrx}
                    cy={zry}
                    r={isFocus ? '4' : '2.6'}
                    fill={planet.cfg.color}
                    stroke="#020617"
                    strokeWidth="0.9"
                  />
                  {/* Thin Leader Line from Planet Sphere to Non-Overlapping Label Pill */}
                  <line
                    x1={planet.px}
                    y1={planet.py}
                    x2={planet.lx}
                    y2={planet.ly}
                    stroke={isFocus ? '#fde047' : 'rgba(203, 213, 225, 0.55)'}
                    strokeWidth={isFocus ? '1.4' : '0.85'}
                  />
                </g>
              );
            })}

            {/* Layer 2: 3D Planet Spheres (Strictly Anchored — NEVER Jumps on Hover!) */}
            {placedPlanets.map((planet) => {
              const cfg = planet.cfg;
              const isSelected = zoomTarget?.type === 'planet' && zoomTarget.name === planet.name;
              const isHovered = hoveredPlanet === planet.name;

              return (
                <g
                  key={`sphere-${planet.name}`}
                  onClick={() =>
                    setZoomTarget((prev) =>
                      prev?.type === 'planet' && prev.name === planet.name
                        ? null
                        : { type: 'planet', name: planet.name }
                    )
                  }
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet((cur) => (cur === planet.name ? null : cur))}
                  className="cursor-pointer"
                >
                  {/* Anchored Hover / Selection Ring (Strictly centered at px, py — Zero Movement!) */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={planet.px}
                      cy={planet.py}
                      r={cfg.radius + 7}
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                  )}

                  {/* Soft Atmospheric Glow */}
                  <circle
                    cx={planet.px}
                    cy={planet.py}
                    r={cfg.radius + 4}
                    fill={cfg.haloColor}
                    filter="url(#sky-glow)"
                  />

                  {/* Saturn Rings Back */}
                  {cfg.hasRings && (
                    <ellipse
                      cx={planet.px}
                      cy={planet.py}
                      rx={cfg.radius + 10}
                      ry={cfg.radius * 0.42}
                      fill="none"
                      stroke={cfg.ringColor}
                      strokeWidth="3"
                      transform={`rotate(-25, ${planet.px}, ${planet.py})`}
                    />
                  )}

                  {/* 3D Planet Sphere */}
                  <circle
                    cx={planet.px}
                    cy={planet.py}
                    r={cfg.radius}
                    fill={`url(#planet-grad-${planet.name})`}
                    stroke={isSelected || isHovered ? '#ffffff' : 'rgba(255,255,255,0.5)'}
                    strokeWidth={isSelected || isHovered ? '2' : '1'}
                  />

                  {/* Saturn Rings Front */}
                  {cfg.hasRings && (
                    <path
                      d={`M ${planet.px - (cfg.radius + 10)} ${planet.py} A ${cfg.radius + 10} ${cfg.radius * 0.42} 0 0 0 ${planet.px + (cfg.radius + 10)} ${planet.py}`}
                      fill="none"
                      stroke={cfg.ringColor}
                      strokeWidth="3"
                      transform={`rotate(-25, ${planet.px}, ${planet.py})`}
                    />
                  )}
                </g>
              );
            })}

            {/* Layer 3: Collision-Free Planet Name & Degree Callout Pills (Rendered Above Spheres) */}
            {placedPlanets.map((planet) => {
              const cfg = planet.cfg;
              const isFocus =
                hoveredPlanet === planet.name ||
                (zoomTarget?.type === 'planet' && zoomTarget.name === planet.name);

              return (
                <g
                  key={`label-${planet.name}`}
                  transform={`translate(${planet.lx}, ${planet.ly})`}
                  onClick={() =>
                    setZoomTarget((prev) =>
                      prev?.type === 'planet' && prev.name === planet.name
                        ? null
                        : { type: 'planet', name: planet.name }
                    )
                  }
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet((cur) => (cur === planet.name ? null : cur))}
                  className="cursor-pointer"
                >
                  <rect
                    x="-33"
                    y="-12"
                    width="66"
                    height="24"
                    rx="7"
                    fill={isFocus ? 'rgba(30, 41, 59, 0.96)' : 'rgba(15, 23, 42, 0.88)'}
                    stroke={isFocus ? '#fde047' : cfg.color}
                    strokeWidth={isFocus ? '1.6' : '1'}
                  />
                  <text
                    x="0"
                    y="-2.5"
                    fill={isFocus ? '#fef08a' : '#ffffff'}
                    fontSize="8.8"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                  >
                    {cfg.shortName[currentLang]}
                    {planet.isRetrograde ? ' (R)' : ''}
                  </text>
                  <text
                    x="0"
                    y="8"
                    fill="#7dd3fc"
                    fontSize="7.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {planet.formattedDeg}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* CENTRAL 3D EARTH GLOBE */}
          {/* ========================================================================= */}
          <g id="central-earth">
            <circle cx={CX} cy={CY} r={EARTH_R + 5} fill="rgba(56, 189, 248, 0.25)" filter="url(#sky-glow)" />
            <circle cx={CX} cy={CY} r={EARTH_R} fill="url(#earth-gradient)" stroke="#38bdf8" strokeWidth="1.8" />
            <ellipse cx={CX} cy={CY} rx={EARTH_R * 0.78} ry={EARTH_R * 0.34} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" />
            <ellipse cx={CX} cy={CY} rx={EARTH_R * 0.34} ry={EARTH_R * 0.78} fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" />
            <text
              x={CX}
              y={CY}
              fill="#ffffff"
              fontSize="8.5"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              letterSpacing="1"
            >
              EARTH
            </text>
          </g>
        </svg>

        {/* Bottom Canvas Info Badges */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-20 pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-stone-900/90 border border-sky-500/40 backdrop-blur-md text-sky-300 font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-sky-300" />
            <span>
              {dateStr} • {timeStr}
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 hidden sm:block pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-md text-amber-300 font-mono text-[10px] sm:text-xs font-bold">
            {cityName} • Lagna: {kundaliData.houses[0].rashiName[currentLang]}
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* IN-PLACE ZOOMED DETAIL EXPANSION (DIRECTLY INSIDE MANDALA — NO POPUP!) */}
      {/* ========================================================================= */}
      {zoomTarget && (
        <div className="p-4 sm:p-5 border-t-2 border-amber-500/50 bg-gradient-to-br from-slate-900 via-stone-950 to-indigo-950/80 space-y-4 animate-in fade-in">
          {/* 1. ZOOMED NAKSHATRA (STAR) DETAILS & 4 PADA LETTERS */}
          {zoomTarget.type === 'nakshatra' && zoomedNakshatra && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/25 pb-3">
                <div className="flex items-center gap-3">
                  {/* Enlarged Star Constellation Preview */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-sky-400/60 flex items-center justify-center shrink-0 shadow-inner">
                    <svg viewBox="-12 -12 24 24" className="w-14 h-14">
                      {zoomedNakshatra.lines.map(([a, b], i) => {
                        const pa = zoomedNakshatra.stars[a];
                        const pb = zoomedNakshatra.stars[b];
                        if (!pa || !pb) return null;
                        return (
                          <line
                            key={i}
                            x1={pa[0]}
                            y1={pa[1]}
                            x2={pb[0]}
                            y2={pb[1]}
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                          />
                        );
                      })}
                      {zoomedNakshatra.stars.map(([sx, sy], i) => (
                        <circle
                          key={i}
                          cx={sx}
                          cy={sy}
                          r={i === 0 ? '2.1' : '1.4'}
                          fill={i === 0 ? '#fde047' : '#ffffff'}
                        />
                      ))}
                    </svg>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                        Nakshatra #{zoomedNakshatra.index + 1} / 27
                      </span>
                      <span className="text-[11px] font-mono text-amber-300 font-bold">
                        {zoomedNakshatra.spanStartDeg.toFixed(2)}° – {zoomedNakshatra.spanEndDeg.toFixed(2)}°
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-white mt-0.5">
                      {currentLang === 'kn'
                        ? `${zoomedNakshatra.nameKn} (${zoomedNakshatra.nameEn})`
                        : currentLang === 'hi'
                        ? `${zoomedNakshatra.nameHi} (${zoomedNakshatra.nameEn})`
                        : `${zoomedNakshatra.nameEn} (${zoomedNakshatra.nameKn})`}
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {currentLang === 'kn' ? zoomedNakshatra.descriptionKn : zoomedNakshatra.descriptionEn}
                    </p>
                    <span className="text-[11px] font-mono text-sky-300 block mt-1">
                      {currentLang === 'kn' ? 'ಮುಖ್ಯ ತಾರೆ:' : 'Principal Star:'}{' '}
                      <strong>{zoomedNakshatra.principalStar}</strong> • {zoomedNakshatra.patternType}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setZoomTarget(null)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start shrink-0 border border-stone-600"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>{currentLang === 'kn' ? 'ಜೂಮ್ ಮುಚ್ಚಿ' : 'Zoom Out'}</span>
                </button>
              </div>

              {/* 4 Padas & Pada Letters (Aksharas) */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  {currentLang === 'kn'
                    ? 'ಈ ನಕ್ಷತ್ರದ ೪ ಪಾದಗಳು ಮತ್ತು ಪಾದಾಕ್ಷರಗಳು (4 Padas & Letters):'
                    : 'All 4 Padas & Pada Letters (Aksharas) of this Nakshatra:'}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {zoomedNakshatraPadas.map((padaItem) => {
                    const pStart = zoomedNakshatra.spanStartDeg + (padaItem.pada - 1) * (360 / 108);
                    const pEnd = pStart + 360 / 108;
                    const grahasInPada = placedPlanets.filter(
                      (p) => p.nakIndex === zoomedNakshatra.index && p.padaNumber === padaItem.pada
                    );

                    return (
                      <div
                        key={padaItem.pada}
                        className="p-3 rounded-xl bg-white/5 border border-sky-400/35 space-y-1.5 text-center"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-sky-300">
                          <span className="font-bold">Pada {padaItem.pada}</span>
                          <span>
                            {pStart.toFixed(1)}°–{pEnd.toFixed(1)}°
                          </span>
                        </div>
                        <div className="py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50">
                          <div className="text-xl font-serif font-black text-amber-300">
                            {currentLang === 'kn'
                              ? padaItem.aksharaKannada
                              : currentLang === 'hi'
                              ? padaItem.aksharaDevanagari
                              : padaItem.akshara}
                          </div>
                          <div className="text-[10.5px] font-mono text-stone-200 mt-0.5">
                            {padaItem.aksharaKannada} • {padaItem.aksharaDevanagari} • {padaItem.akshara}
                          </div>
                        </div>
                        <div className="text-[10.5px] text-stone-300 font-semibold">
                          {padaItem.rashiName[currentLang]}
                        </div>
                        {grahasInPada.length > 0 && (
                          <div className="pt-1 border-t border-white/10 flex flex-wrap justify-center gap-1">
                            {grahasInPada.map((g) => (
                              <span
                                key={g.name}
                                className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-200 border border-emerald-400/40"
                              >
                                {g.cfg.shortName[currentLang]} ({g.formattedDeg})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. ZOOMED RASHI DETAILS: CONSTITUENT STAR ARRANGEMENT + ALL 9 PADAS & LETTERS + DAY'S GRAHAS */}
          {zoomTarget.type === 'rashi' && zoomedRashi && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      Rashi #{zoomTarget.index + 1} / 12 • {zoomTarget.index * 30}°–{(zoomTarget.index + 1) * 30}°
                    </span>
                    <span className="text-[11px] font-mono text-sky-300 font-bold">
                      {(() => {
                        const elementsEn = ['Fire (Agni)', 'Earth (Prithvi)', 'Air (Vayu)', 'Water (Jala)'];
                        const elementsKn = ['ಅಗ್ನಿ (Fire)', 'ಪೃಥ್ವಿ (Earth)', 'ವಾಯು (Air)', 'ಜಲ (Water)'];
                        const elIdx = zoomTarget.index % 4;
                        return currentLang === 'kn'
                          ? `ಅಧಿಪತಿ: ${zoomedRashi.lordKn} • ತತ್ವ: ${elementsKn[elIdx]}`
                          : `Lord: ${zoomedRashi.lordEn} • Element: ${elementsEn[elIdx]}`;
                      })()}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-amber-300 mt-0.5">
                    {zoomedRashi[currentLang]} ({zoomedRashi.en}) —{' '}
                    {currentLang === 'kn' ? 'ತಾರಾ ವಿನ್ಯಾಸ ಮತ್ತು ೯ ಪಾದಾಕ್ಷರಗಳು' : 'Star Arrangement & 9 Padas'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setZoomTarget(null)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start shrink-0 border border-stone-600"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>{currentLang === 'kn' ? 'ಜೂಮ್ ಮುಚ್ಚಿ' : 'Zoom Out'}</span>
                </button>
              </div>

              {/* Constituent Nakshatras Star Arrangement & Their Belonging Padas in this Rashi */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {zoomedRashiNakshatras.map(({ pattern, padas }) => (
                  <div
                    key={pattern.index}
                    className="p-3.5 rounded-xl bg-white/5 border border-amber-400/35 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-sky-400/50 flex items-center justify-center shrink-0">
                          <svg viewBox="-11 -11 22 22" className="w-10 h-10">
                            {pattern.lines.map(([a, b], i) => {
                              const pa = pattern.stars[a];
                              const pb = pattern.stars[b];
                              if (!pa || !pb) return null;
                              return (
                                <line
                                  key={i}
                                  x1={pa[0]}
                                  y1={pa[1]}
                                  x2={pb[0]}
                                  y2={pb[1]}
                                  stroke="#fcd34d"
                                  strokeWidth="1.2"
                                />
                              );
                            })}
                            {pattern.stars.map(([sx, sy], i) => (
                              <circle
                                key={i}
                                cx={sx}
                                cy={sy}
                                r={i === 0 ? '2' : '1.3'}
                                fill={i === 0 ? '#fef08a' : '#ffffff'}
                              />
                            ))}
                          </svg>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => setZoomTarget({ type: 'nakshatra', index: pattern.index })}
                            className="font-serif font-bold text-sm text-sky-300 hover:underline text-left cursor-pointer"
                          >
                            {currentLang === 'kn' ? pattern.nameKn : pattern.nameEn}
                          </button>
                          <div className="text-[10px] text-stone-400">{pattern.patternType}</div>
                          <div className="text-[10px] font-mono text-amber-300">{pattern.principalStar}</div>
                        </div>
                      </div>
                    </div>

                    {/* Padas belonging to this Rashi */}
                    <div className="flex flex-wrap gap-1.5">
                      {padas.map((pd) => (
                        <div
                          key={pd.pada}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40 text-center min-w-[68px]"
                        >
                          <div className="text-[9.5px] font-mono text-sky-300 font-bold">
                            Pada {pd.pada}
                          </div>
                          <div className="text-sm font-serif font-black text-amber-300">
                            {currentLang === 'kn'
                              ? pd.aksharaKannada
                              : currentLang === 'hi'
                              ? pd.aksharaDevanagari
                              : pd.akshara}
                          </div>
                          <div className="text-[9.5px] font-mono text-stone-300">
                            {pd.aksharaKannada}/{pd.akshara}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Day's Grahas Inside This Rashi */}
              {(() => {
                const grahasInRashi = placedPlanets.filter((p) => p.rashiIndex === zoomTarget.index);
                return (
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-300 block">
                      {currentLang === 'kn'
                        ? `${dateStr} ರಂದು ಈ ರಾಶಿಯಲ್ಲಿರುವ ಗ್ರಹಗಳು (${grahasInRashi.length}):`
                        : `Grahas Positioned in ${zoomedRashi.en} on ${dateStr} (${grahasInRashi.length}):`}
                    </span>
                    {grahasInRashi.length === 0 ? (
                      <p className="text-xs text-stone-400">
                        {currentLang === 'kn'
                          ? 'ಈ ದಿನದಂದು ಈ ರಾಶಿಯಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹಗಳಿಲ್ಲ.'
                          : 'No Grahas occupy this Rashi on the selected date.'}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {grahasInRashi.map((g) => (
                          <button
                            key={g.name}
                            type="button"
                            onClick={() => setZoomTarget({ type: 'planet', name: g.name })}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-emerald-400/40 text-xs flex items-center gap-2 cursor-pointer"
                          >
                            <SvgGrahaIcon name={g.name} size={18} isRetrograde={g.isRetrograde} />
                            <strong className="text-white">{g.cfg.sanskritName[currentLang]}</strong>
                            <span className="font-mono text-amber-300">{g.formattedDeg}</span>
                            <span className="text-sky-300 text-[11px]">
                              {g.nakshatra[currentLang]} (P{g.padaNumber})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 3. ZOOMED GRAHA (PLANET) EXACT SKY POSITION */}
          {zoomTarget.type === 'planet' && zoomedPlanet && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-2xl bg-white/10 border border-amber-400/40 shrink-0">
                  <SvgGrahaIcon
                    name={zoomedPlanet.name}
                    size={36}
                    isRetrograde={zoomedPlanet.isRetrograde}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-serif font-bold text-lg text-amber-300">
                      {zoomedPlanet.cfg.sanskritName[currentLang]} ({zoomedPlanet.name})
                    </h4>
                    {zoomedPlanet.isRetrograde && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/25 text-rose-200 border border-rose-400/40">
                        Retrograde (ವಕ್ರಿ)
                      </span>
                    )}
                    <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                      {zoomedPlanet.rashiName[currentLang]} • {zoomedPlanet.formattedDeg}
                    </span>
                    <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                      House #{zoomedPlanet.bhava}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {currentLang === 'kn'
                      ? `ನಕ್ಷತ್ರ: ${zoomedPlanet.nakshatra.kn} • ಪಾದ ${zoomedPlanet.padaNumber} • ಪಾದಾಕ್ಷರ: ${
                          zoomedPlanet.aksharaInfo ? getLocalizedAkshara(zoomedPlanet.aksharaInfo) : ''
                        } • ಸಂಪೂರ್ಣ ರೇಖಾಂಶ: ${zoomedPlanet.absLong.toFixed(2)}° (ಲಾಹಿರಿ ಅಯನಾಂಶ)`
                      : `Nakshatra: ${zoomedPlanet.nakshatra.en} • Pada ${zoomedPlanet.padaNumber} • Letter: ${
                          zoomedPlanet.aksharaInfo ? getLocalizedAkshara(zoomedPlanet.aksharaInfo) : ''
                        } • Sidereal Longitude: ${zoomedPlanet.absLong.toFixed(2)}° (Lahiri)`}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setZoomTarget({ type: 'rashi', index: zoomedPlanet.rashiIndex })}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ಈ ರಾಶಿ ಜೂಮ್ ಮಾಡಿ' : `Zoom ${zoomedPlanet.rashiName.en}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomTarget({ type: 'nakshatra', index: zoomedPlanet.nakIndex })}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-500/30 cursor-pointer"
                    >
                      {currentLang === 'kn' ? 'ಈ ನಕ್ಷತ್ರ ಜೂಮ್ ಮಾಡಿ' : `Zoom ${zoomedPlanet.nakshatra.en}`}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setZoomTarget(null)}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start shrink-0 border border-stone-600"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>{currentLang === 'kn' ? 'ಜೂಮ್ ಮುಚ್ಚಿ' : 'Zoom Out'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SELECTED DAY'S EXACT POSITIONS OF ALL 9 GRAHAS IN RASHIS */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-stone-900/95 border-t border-amber-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>
                {currentLang === 'kn'
                  ? `ಆಯ್ಕೆಮಾಡಿದ ದಿನದ (${dateStr}) ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳ ರಾಶಿ & ನಕ್ಷತ್ರ ಸ್ಥಾನಗಳು`
                  : currentLang === 'hi'
                  ? `चयनित तिथि (${dateStr}) के सभी ९ ग्रहों की राशि एवं नक्षत्र स्थिति`
                  : `Selected Day (${dateStr}) Positions of All 9 Grahas in Rashis`}
              </span>
            </h4>
            <p className="text-[11px] text-stone-400">
              {currentLang === 'kn'
                ? 'ಯಾವುದೇ ಗ್ರಹದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಕಾಶ ಮಂಡಲದಲ್ಲಿ ಅದರ ನಿಖರ ಸ್ಥಾನಕ್ಕೆ ಜೂಮ್ ಮಾಡಿ.'
                : 'Tap any Graha card to zoom directly to its astronomical position on the sky wheel above.'}
            </p>
          </div>
          <span className="text-[10.5px] font-mono text-stone-400 shrink-0">
            {timeStr} • {cityName}
          </span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2">
          {placedPlanets.map((p) => {
            const isSelected = zoomTarget?.type === 'planet' && zoomTarget.name === p.name;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  setZoomTarget((prev) =>
                    prev?.type === 'planet' && prev.name === p.name
                      ? null
                      : { type: 'planet', name: p.name }
                  )
                }
                onMouseEnter={() => setHoveredPlanet(p.name)}
                onMouseLeave={() => setHoveredPlanet((cur) => (cur === p.name ? null : cur))}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <SvgGrahaIcon name={p.name} size={22} isRetrograde={p.isRetrograde} />
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-xs text-white truncate">
                      {p.cfg.sanskritName[currentLang]}
                      {p.isRetrograde && <span className="text-rose-400 ml-1 text-[10px]">[R]</span>}
                    </div>
                    <div className="text-[10.5px] text-amber-300 font-semibold truncate">
                      {p.rashiName[currentLang]} • <span className="font-mono text-sky-300">{p.formattedDeg}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono font-bold text-emerald-300">
                    H#{p.bhava}
                  </div>
                  <div className="text-[9.5px] text-stone-300 truncate max-w-[105px]">
                    {p.nakshatra[currentLang]} • P{p.padaNumber}
                    {p.aksharaInfo ? ` (${currentLang === 'kn' ? p.aksharaInfo.aksharaKannada : p.aksharaInfo.akshara})` : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Rashi Star Map & Sky Direction Helper (Shown below 3D/2D view when requested) */}
      {showRashiStarMapInline && viewMode !== 'starmap' && (
        <div className="p-4 sm:p-5 bg-slate-950 border-t-2 border-sky-500/40">
          <RashiStarMap
            currentLang={currentLang}
            kundaliData={kundaliData}
            dateStr={dateStr}
            timeStr={timeStr}
            selectedCity={resolvedCity}
            initialRashiIndex={zoomTarget?.type === 'rashi' ? zoomTarget.index : kundaliData.houses[0]?.rashiIndex ?? 0}
          />
        </div>
      )}

      {/* Footer Cardinal Alignment Legend */}
      <div className="px-4 py-3 bg-stone-950 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-[10.5px] font-mono">
          <span className="text-sky-300"><strong>E:</strong> H1 Lagna</span>
          <span className="text-amber-300"><strong>N:</strong> H4 Sukha</span>
          <span className="text-rose-300"><strong>W:</strong> H7 Kalatra</span>
          <span className="text-emerald-300"><strong>S:</strong> H10 Karma</span>
        </div>
        <span className="text-[10px] text-stone-500 font-mono">
          Live Clock: {liveTimestamp}
        </span>
      </div>
    </div>
  );
};
