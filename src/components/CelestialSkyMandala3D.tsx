import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Compass, 
  RotateCw, 
  Info, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Layers, 
  Star, 
  Eye, 
  ChevronRight,
  X,
  Globe,
  Orbit
} from 'lucide-react';
import { KundaliData, Language, PlanetPosition } from '../types';
import { RASHIS, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';
import { getNakshatraPadaAkshara } from '../utils/nakshatraAksharas';
import { ThreeNightSky3D } from './ThreeNightSky3D';

interface CelestialSkyMandala3DProps {
  currentLang: Language;
  kundaliData: KundaliData;
  dateStr: string;
  timeStr: string;
  cityName: string;
}

// 27 Nakshatras with authentic astronomical star constellation patterns (relative 2D coordinates for canvas/SVG plotting)
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
  // Local star points inside bounding box [dx, dy] normalized -10 to +10
  stars: Array<[number, number]>;
  lines: Array<[number, number]>; // pairs of indices in stars array
}

export const NAKSHATRA_SKY_PATTERNS: NakshatraSkyPattern[] = [
  {
    index: 0,
    nameEn: 'Ashwini',
    nameKn: 'ಅಶ್ವಿನಿ',
    nameHi: 'अश्विनी',
    spanStartDeg: 0,
    spanEndDeg: 13.333,
    principalStar: 'Hamal (Alpha Arietis)',
    patternType: 'Horse Head (೩ ತಾರೆಗಳು)',
    descriptionEn: '3 bright stars in Aries shaped like a horse head. Look east in autumn/winter skies.',
    descriptionKn: 'ಮೇಷ ರಾಶಿಯಲ್ಲಿ ಕುದುರೆಯ ಮುಖದ ಆಕಾರದಲ್ಲಿರುವ ೩ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -5], [1, 1], [5, 5]],
    lines: [[0, 1], [1, 2]]
  },
  {
    index: 1,
    nameEn: 'Bharani',
    nameKn: 'ಭರಣಿ',
    nameHi: 'भरणी',
    spanStartDeg: 13.333,
    spanEndDeg: 26.666,
    principalStar: '35 & 41 Arietis',
    patternType: 'Triangle / Yoni (೩ ತಾರೆಗಳು)',
    descriptionEn: '3 triangular faint stars south of Hamal.',
    descriptionKn: 'ಅಶ್ವಿನಿ ತಾರೆಗಳ ಕೆಳಭಾಗದಲ್ಲಿ ತ್ರಿಕೋನಾಕಾರದಲ್ಲಿ ಕಾಣುವ ೩ ತಾರೆಗಳು.',
    stars: [[-3, -4], [4, -1], [0, 5]],
    lines: [[0, 1], [1, 2], [2, 0]]
  },
  {
    index: 2,
    nameEn: 'Krittika',
    nameKn: 'ಕೃತ್ತಿಕಾ',
    nameHi: 'कृत्तिका',
    spanStartDeg: 26.666,
    spanEndDeg: 40.0,
    principalStar: 'Alcyone (Pleiades M45)',
    patternType: 'Pleiades Star Cluster (೬ ತಾರೆಗಳು)',
    descriptionEn: 'The famous "Seven Sisters" open cluster. Visible as a sparkling tiny dipper with the naked eye.',
    descriptionKn: 'ಬರಿಗಣ್ಣಿಗೆ ಪುಟ್ಟ ದೀಪದಂತೆ ಮಿನುಗುವ ೬ ನಕ್ಷತ್ರಗಳ ಕೃತ್ತಿಕಾ ಪುಂಜ (ಪ್ಲಿಯೇಡಿಸ್).',
    stars: [[-6, -2], [-3, -4], [0, -3], [3, -1], [5, 2], [1, 4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]]
  },
  {
    index: 3,
    nameEn: 'Rohini',
    nameKn: 'ರೋಹಿಣಿ',
    nameHi: 'रोहिणी',
    spanStartDeg: 40.0,
    spanEndDeg: 53.333,
    principalStar: 'Aldebaran (Alpha Tauri)',
    patternType: 'V-shaped Cart (Hyades Cluster)',
    descriptionEn: 'Bright reddish-orange Aldebaran anchors the V-shaped Hyades cluster (the Bull\'s Eye).',
    descriptionKn: 'ಕೆಂಪು ದೈತ್ಯ ತಾರೆ ರೋಹಿಣಿ (ಆಲ್ಡೆಬರಾನ್) ನೇತೃತ್ವದ "ವಿ" ಆಕಾರದ ಬಂಡಿ ಪುಂಜ.',
    stars: [[-5, -5], [-2, 0], [4, 4], [-2, 4], [2, -2]],
    lines: [[0, 1], [1, 2], [1, 3], [1, 4]]
  },
  {
    index: 4,
    nameEn: 'Mrigashira',
    nameKn: 'ಮೃಗಶಿರ',
    nameHi: 'मृगशिरा',
    spanStartDeg: 53.333,
    spanEndDeg: 66.666,
    principalStar: 'Meissa (Lambda Orionis)',
    patternType: 'Deer Head (೩ ತಾರೆಗಳು)',
    descriptionEn: '3 stars atop Orion\'s head forming an inverted triangle pointing down.',
    descriptionKn: 'ಮೃಗಶಿರ: ಒರಾಯನ್ ಬೇಟೆಗಾರನ ಶಿರಸ್ಸಿನಲ್ಲಿ ಜಿಂಕೆಯ ಮುಖದಂತಿರುವ ೩ ತಾರೆಗಳು.',
    stars: [[0, -5], [-4, 3], [4, 3]],
    lines: [[0, 1], [1, 2], [2, 0]]
  },
  {
    index: 5,
    nameEn: 'Aridra',
    nameKn: 'ಆರಿದ್ರಾ',
    nameHi: 'आर्द्रा',
    spanStartDeg: 66.666,
    spanEndDeg: 80.0,
    principalStar: 'Betelgeuse (Alpha Orionis)',
    patternType: 'Radiant Jewel / Teardrop',
    descriptionEn: 'The colossal red supergiant Betelgeuse in Orion\'s right shoulder. Flashing crimson-amber.',
    descriptionKn: 'ಒರಾಯನ್ ಭುಜದ ಪ್ರಕಾಶಮಾನ ಕೆಂಪು ಮಹಾತಾರೆ ಆರಿದ್ರಾ (ಬೆಟೆಲ್‌ಗ್ಯೂಸ್).',
    stars: [[0, 0]],
    lines: []
  },
  {
    index: 6,
    nameEn: 'Punarvasu',
    nameKn: 'ಪುನರ್ವಸು',
    nameHi: 'पुनर्वसु',
    spanStartDeg: 80.0,
    spanEndDeg: 93.333,
    principalStar: 'Castor & Pollux (Gemini)',
    patternType: 'The Twin Stars / Bow (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Castor and Pollux, the luminous twin heads of Gemini.',
    descriptionKn: 'ಮಿಥುನ ರಾಶಿಯ ಕಣ್ಣಿಗೆ ಎದ್ದು ಕಾಣುವ ಅವಳಿ ನಕ್ಷತ್ರಗಳು (ಕ್ಯಾಸ್ಟರ್ & ಪೋಲಕ್ಸ್).',
    stars: [[-4, -4], [-3, 3], [3, -3], [4, 4]],
    lines: [[0, 1], [2, 3], [0, 2], [1, 3]]
  },
  {
    index: 7,
    nameEn: 'Pushya',
    nameKn: 'ಪುಷ್ಯ',
    nameHi: 'पुष्य',
    spanStartDeg: 93.333,
    spanEndDeg: 106.666,
    principalStar: 'Delta Cancri (Asellus Australis)',
    patternType: 'Beehive / Arrow (೩ ತಾರೆಗಳು)',
    descriptionEn: 'Surrounds the Praesepe (Beehive Cluster M44) in the heart of Cancer.',
    descriptionKn: 'ಕರ್ಕಾಟಕದ ಹೃದಯದಲ್ಲಿ ಜೇನುಗೂಡಿನಂತಿರುವ ಪವಿತ್ರ ಪುಷ್ಯ ತಾರಾ ಸಮೂಹ.',
    stars: [[0, -4], [-4, 3], [4, 3]],
    lines: [[0, 1], [0, 2]]
  },
  {
    index: 8,
    nameEn: 'Ashlesha',
    nameKn: 'ಆಶ್ಲೇಷಾ',
    nameHi: 'आश्लेषा',
    spanStartDeg: 106.666,
    spanEndDeg: 120.0,
    principalStar: 'Epsilon Hydrae',
    patternType: 'Coiled Serpent (೬ ತಾರೆಗಳು)',
    descriptionEn: 'Ring of 5-6 stars forming the head of Hydra serpent.',
    descriptionKn: 'ಸುರುಳಿ ಸುತ್ತಿದ ಸರ್ಪದ ಹೆಡೆಯಂತಿರುವ ೬ ತಾರೆಗಳು.',
    stars: [[-5, -2], [-2, -5], [3, -4], [5, 0], [2, 4], [-2, 3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  },
  {
    index: 9,
    nameEn: 'Magha',
    nameKn: 'ಮಘಾ',
    nameHi: 'मघा',
    spanStartDeg: 120.0,
    spanEndDeg: 133.333,
    principalStar: 'Regulus (Alpha Leonis)',
    patternType: 'Sickle & Royal Throne (೬ ತಾರೆಗಳು)',
    descriptionEn: 'The Sickle of Leo anchored by dazzling blue-white Regulus (The King Star).',
    descriptionKn: 'ಸಿಂಹ ರಾಶಿಯ ರಾಜಮುಕುಟ ಹಾಗೂ ಕುಡುಗೋಲಿನ ಆಕಾರದ ೬ ತಾರೆಗಳು.',
    stars: [[-4, 5], [-4, 0], [-2, -4], [2, -5], [5, -2], [3, 1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
  },
  {
    index: 10,
    nameEn: 'Purva Phalguni',
    nameKn: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ (ಹುಬ್ಬಾ)',
    nameHi: 'पूर्व फाल्गुनी',
    spanStartDeg: 133.333,
    spanEndDeg: 146.666,
    principalStar: 'Zosma & Chertan (Delta & Theta Leonis)',
    patternType: 'Front Legs of Cot (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Two bright stars marking the hindquarter flank of Leo.',
    descriptionKn: 'ಮಂಚದ ಮುಂಭಾಗದ ಕಾಲುಗಳಂತಿರುವ ೨ ತಾರೆಗಳು.',
    stars: [[-3, -4], [3, 4]],
    lines: [[0, 1]]
  },
  {
    index: 11,
    nameEn: 'Uttara Phalguni',
    nameKn: 'ಉತ್ತರ ಫಲ್ಗುಣಿ',
    nameHi: 'उत्तर फाल्गुनी',
    spanStartDeg: 146.666,
    spanEndDeg: 160.0,
    principalStar: 'Denebola (Beta Leonis)',
    patternType: 'Back Legs of Cot (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Denebola (Lion\'s tail) forms the second part of the cosmic couch.',
    descriptionKn: 'ಸಿಂಹದ ಬಾಲದ ಡೆನೆಬೋಲಾ ತಾರೆ ಒಳಗೊಂಡ ಮಂಚದ ಹಿಂಭಾಗದ ತಾರೆಗಳು.',
    stars: [[-4, -3], [4, 3]],
    lines: [[0, 1]]
  },
  {
    index: 12,
    nameEn: 'Hasta',
    nameKn: 'ಹಸ್ತ',
    nameHi: 'हस्त',
    spanStartDeg: 160.0,
    spanEndDeg: 173.333,
    principalStar: 'Delta Corvi (Corvus constellation)',
    patternType: 'Open Hand / Crow (೫ ತಾರೆಗಳು)',
    descriptionEn: '5 stars of Corvus the Crow, resembling fingers of a blessing open hand.',
    descriptionKn: 'ಆಕಾಶದಲ್ಲಿ ಆಶೀರ್ವದಿಸುವ ಕೈಬೆರಳುಗಳಂತೆ ಕಾಣುವ ೫ ತಾರೆಗಳು (ಕಾಗೆ ಪುಂಜ).',
    stars: [[-4, -3], [3, -5], [5, 0], [0, 5], [-5, 2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]
  },
  {
    index: 13,
    nameEn: 'Chitra',
    nameKn: 'ಚಿತ್ತಾ (ಚಿತ್ರಾ)',
    nameHi: 'चित्रा',
    spanStartDeg: 173.333,
    spanEndDeg: 186.666,
    principalStar: 'Spica (Alpha Virginis)',
    patternType: 'Single Radiant Pearl (೧ ತಾರೆ)',
    descriptionEn: 'The brilliant blue-white diamond star Spica in Virgo. One of the night sky\'s brightest beacons.',
    descriptionKn: 'ಕನ್ಯಾ ರಾಶಿಯಲ್ಲಿ ಪ್ರಕಾಶಿಸುವ ಏಕೈಕ ದಿವ್ಯ ಮುತ್ತು ಚಿತ್ರಾ (ಸ್ಪೈಕಾ).',
    stars: [[0, 0]],
    lines: []
  },
  {
    index: 14,
    nameEn: 'Swati',
    nameKn: 'ಸ್ವಾತಿ',
    nameHi: 'स्वाती',
    spanStartDeg: 186.666,
    spanEndDeg: 200.0,
    principalStar: 'Arcturus (Alpha Boötis)',
    patternType: 'Golden Coral / Drop (೧ ತಾರೆ)',
    descriptionEn: 'Blazing reddish-amber Arcturus, 4th brightest star in the sky.',
    descriptionKn: 'ಉತ್ತರ ಆಕಾಶದ ೪ನೇ ಅತಿ ಪ್ರಕಾಶಮಾನ ಕಿತ್ತಳೆ-ಕೆಂಪು ಮಹಾತಾರೆ ಸ್ವಾತಿ (ಆರ್ಕ್ಟುರಸ್).',
    stars: [[0, 0]],
    lines: []
  },
  {
    index: 15,
    nameEn: 'Vishakha',
    nameKn: 'ವಿಶಾಖಾ',
    nameHi: 'विशाखा',
    spanStartDeg: 200.0,
    spanEndDeg: 213.333,
    principalStar: 'Alpha & Beta Librae',
    patternType: 'Triumphal Arch / Scales (೪ ತಾರೆಗಳು)',
    descriptionEn: '4 stars forming a grand gateway or balance scales.',
    descriptionKn: 'ವಿಜಯ ತೋರಣದಂತೆ ಕಾಣುವ ತುಲಾ ರಾಶಿಯ ೪ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -4], [-3, 3], [3, -3], [4, 4]],
    lines: [[0, 1], [1, 3], [3, 2], [2, 0]]
  },
  {
    index: 16,
    nameEn: 'Anuradha',
    nameKn: 'ಅನುರಾಧಾ',
    nameHi: 'अनुराधा',
    spanStartDeg: 213.333,
    spanEndDeg: 226.666,
    principalStar: 'Beta, Delta, Pi Scorpii',
    patternType: 'Lotus Staff / Arch (೪ ತಾರೆಗಳು)',
    descriptionEn: 'The striking vertical row of 3-4 stars standing guard before Antares in Scorpio.',
    descriptionKn: 'ವೃಶ್ಚಿಕದ ಮುಂಭಾಗದಲ್ಲಿ ನೇರ ಸಾಲಾಗಿ ನಿಂತಿರುವ ೪ ರಕ್ಷಕ ತಾರೆಗಳು.',
    stars: [[-4, -5], [-2, -1], [1, 2], [4, 5]],
    lines: [[0, 1], [1, 2], [2, 3]]
  },
  {
    index: 17,
    nameEn: 'Jyeshtha',
    nameKn: 'ಜ್ಯೇಷ್ಠಾ',
    nameHi: 'ज्येष्ठा',
    spanStartDeg: 226.666,
    spanEndDeg: 240.0,
    principalStar: 'Antares (Alpha Scorpii)',
    patternType: 'Ear Pendant / Heart of Scorpion',
    descriptionEn: 'Fiery ruby-red Antares flanked by two guardian stars.',
    descriptionKn: 'ವೃಶ್ಚಿಕದ ಹೃದಯದಲ್ಲಿರುವ ಕೆಂಪು ರತ್ನ ಜ್ಯೇಷ್ಠಾ (ಆಂಟಾರಿಸ್) ಮತ್ತು ಪಕ್ಕದ ಎರಡು ತಾರೆಗಳು.',
    stars: [[-4, -3], [0, 0], [4, 3]],
    lines: [[0, 1], [1, 2]]
  },
  {
    index: 18,
    nameEn: 'Moola',
    nameKn: 'ಮೂಲಾ',
    nameHi: 'मूल',
    spanStartDeg: 240.0,
    spanEndDeg: 253.333,
    principalStar: 'Shaula & Lesath (Lambda & Upsilon Scorpii)',
    patternType: 'Scorpion Tail & Sting (೬ ತಾರೆಗಳು)',
    descriptionEn: 'The majestic hook of the Scorpion\'s sting pointing to the Milky Way Galactic Center.',
    descriptionKn: 'ಆಕಾಶಗಂಗೆಯ ಕೇಂದ್ರದೆಡೆಗೆ ಬಾಗಿದ ಚೇಳಿನ ಬಾಲದ ತುದಿಯ ೬ ತಾರೆಗಳು.',
    stars: [[-5, -4], [-2, -2], [1, -2], [3, 0], [4, 3], [1, 5]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
  },
  {
    index: 19,
    nameEn: 'Purvashadha',
    nameKn: 'ಪೂರ್ವಾಷಾಢ',
    nameHi: 'पूर्वाषाढ़ा',
    spanStartDeg: 253.333,
    spanEndDeg: 266.666,
    principalStar: 'Kaus Media & Kaus Australis',
    patternType: 'Winnowing Basket / Bow (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Stars forming the bow and teapot handle of Sagittarius.',
    descriptionKn: 'ಧನುಸ್ಸು ರಾಶಿಯ ಬಿಲ್ಲು ಹಾಗೂ ಚಹಾ ಪಾತ್ರೆಯ ಹ್ಯಾಂಡಲ್ ಆಕಾರದ ತಾರೆಗಳು.',
    stars: [[-4, -3], [-1, -5], [3, -2], [1, 4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    index: 20,
    nameEn: 'Uttarashadha',
    nameKn: 'ಉತ್ತರಾಷಾಢ',
    nameHi: 'उत्तराषाढ़ा',
    spanStartDeg: 266.666,
    spanEndDeg: 280.0,
    principalStar: 'Nunki (Sigma Sagittarii)',
    patternType: 'Elephant Tusk (೪ ತಾರೆಗಳು)',
    descriptionEn: 'Bright stars Nunki and Ascella shining in eastern Sagittarius.',
    descriptionKn: 'ಆನೆಯ ದಂತದ ಆಕಾರದಲ್ಲಿ ಮಿನುಗುವ ಧನುಸ್ಸಿನ ತಾರೆಗಳು.',
    stars: [[-4, -4], [0, -2], [3, 1], [5, 4]],
    lines: [[0, 1], [1, 2], [2, 3]]
  },
  {
    index: 21,
    nameEn: 'Shravana',
    nameKn: 'ಶ್ರವಣ',
    nameHi: 'श्रवण',
    spanStartDeg: 280.0,
    spanEndDeg: 293.333,
    principalStar: 'Altair (Alpha Aquilae)',
    patternType: 'Eagle & 3 Footsteps (೩ ತಾರೆಗಳು)',
    descriptionEn: 'Altair (the Flying Eagle) with Tarazed and Alshain in a straight diagonal line.',
    descriptionKn: 'ಮೂರು ಹೆಜ್ಜೆಗಳಂತಿರುವ ಪ್ರಖರ ಹದ್ದಿನ ತಾರೆ ಶ್ರವಣ (ಆಲ್ಟೇರ್) ಹಾಗೂ ಪಾರ್ಶ್ವ ತಾರೆಗಳು.',
    stars: [[-4, -4], [0, 0], [4, 4]],
    lines: [[0, 1], [1, 2]]
  },
  {
    index: 22,
    nameEn: 'Dhanishta',
    nameKn: 'ಧನಿಷ್ಠಾ',
    nameHi: 'धनिष्ठा',
    spanStartDeg: 293.333,
    spanEndDeg: 306.666,
    principalStar: 'Alpha Delphini',
    patternType: 'Musical Drum (Damaru) / Dolphin (೪ ತಾರೆಗಳು)',
    descriptionEn: 'The neat diamond shape of Delphinus the Dolphin jumping above the Milky Way.',
    descriptionKn: 'ಡಮರು ಅಥವಾ ಡಾಲ್ಫಿನ್ ಆಕಾರದಲ್ಲಿ ಆಕಾಶದಲ್ಲಿ ಹಾರುವ ೪ ತಾರೆಗಳು.',
    stars: [[0, -5], [4, 0], [0, 5], [-4, 0]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    index: 23,
    nameEn: 'Shatabhisha',
    nameKn: 'ಶತಭಿಷಾ',
    nameHi: 'शतभिषा',
    spanStartDeg: 306.666,
    spanEndDeg: 320.0,
    principalStar: 'Gamma Aquarii',
    patternType: 'Circle of 100 Physicians (ವರ್ತುಲ)',
    descriptionEn: 'A delicate circle of faint stars in Aquarius representing cosmic healing.',
    descriptionKn: 'ಕುಂಭ ರಾಶಿಯಲ್ಲಿ ನೂರು ತಾರೆಗಳ ವೃತ್ತಾಕಾರದ ದಿವ್ಯ ಗುಣಪಡಿಸುವ ಮಂಡಲ.',
    stars: [[0, -4], [3, -3], [4, 0], [3, 3], [0, 4], [-3, 3], [-4, 0], [-3, -3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]]
  },
  {
    index: 24,
    nameEn: 'Purvabhadra',
    nameKn: 'ಪೂರ್ವಾಭಾದ್ರ',
    nameHi: 'पूर्वभाद्रपद',
    spanStartDeg: 320.0,
    spanEndDeg: 333.333,
    principalStar: 'Markab & Scheat (Pegasus Square)',
    patternType: 'Front Legs of Pegasus Square (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Western pair of stars in the Great Square of Pegasus.',
    descriptionKn: 'ಪೆಗಾಸಸ್ ಆಕಾಶ ಚೌಕದ ಮುಂಭಾಗದ ೨ ಪ್ರಮುಖ ತಾರೆಗಳು.',
    stars: [[-4, -4], [4, 4]],
    lines: [[0, 1]]
  },
  {
    index: 25,
    nameEn: 'Uttarabhadra',
    nameKn: 'ಉತ್ತರಾಭಾದ್ರ',
    nameHi: 'उत्तरभाद्रपद',
    spanStartDeg: 333.333,
    spanEndDeg: 346.666,
    principalStar: 'Algenib & Alpheratz',
    patternType: 'Back Legs of Pegasus Square (೨ ತಾರೆಗಳು)',
    descriptionEn: 'Eastern pair of stars in the Great Square of Pegasus.',
    descriptionKn: 'ಪೆಗಾಸಸ್ ಆಕಾಶ ಚೌಕದ ಹಿಂಭಾಗದ ೨ ತಾರೆಗಳು.',
    stars: [[-4, -4], [4, 4]],
    lines: [[0, 1]]
  },
  {
    index: 26,
    nameEn: 'Revati',
    nameKn: 'ರೇವತಿ',
    nameHi: 'रेवती',
    spanStartDeg: 346.666,
    spanEndDeg: 360.0,
    principalStar: 'Zeta Piscium',
    patternType: 'Swimming Fish (ಮತ್ಸ್ಯ)',
    descriptionEn: 'Final nakshatra marking the junction of Pisces and Aries, like two fish tied by a cord.',
    descriptionKn: 'ಮೀನ ರಾಶಿಯ ಅಂತಿಮ ಬಿಂದುವಿನಲ್ಲಿ ಈಜುವ ಜೋಡಿ ಮೀನಿನಂತಿರುವ ತಾರೆಗಳು.',
    stars: [[-5, 0], [-2, -3], [2, -3], [5, 0], [2, 3], [-2, 3]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  }
];

// Planet visual styling definition with realistic colors & 3D attributes
interface PlanetVisualConfig {
  name: string;
  sanskritName: { en: string; kn: string; hi: string };
  color: string;
  haloColor: string;
  textureGradient: [string, string];
  hasRings?: boolean;
  ringColor?: string;
  radius: number;
  orbitDistanceRatio: number; // for visual distribution
}

const PLANET_VISUALS: Record<string, PlanetVisualConfig> = {
  Sun: {
    name: 'Sun',
    sanskritName: { en: 'Surya', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    color: '#fbbf24',
    haloColor: 'rgba(251, 191, 36, 0.45)',
    textureGradient: ['#fef08a', '#ea580c'],
    radius: 13,
    orbitDistanceRatio: 0.52
  },
  Moon: {
    name: 'Moon',
    sanskritName: { en: 'Chandra', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    color: '#f8fafc',
    haloColor: 'rgba(241, 245, 249, 0.5)',
    textureGradient: ['#ffffff', '#94a3b8'],
    radius: 9,
    orbitDistanceRatio: 0.38
  },
  Mars: {
    name: 'Mars',
    sanskritName: { en: 'Mangala', kn: 'ಕುಜ (ಮಂಗಳ)', hi: 'मंगल' },
    color: '#ef4444',
    haloColor: 'rgba(239, 68, 68, 0.4)',
    textureGradient: ['#f87171', '#991b1b'],
    radius: 10,
    orbitDistanceRatio: 0.65
  },
  Mercury: {
    name: 'Mercury',
    sanskritName: { en: 'Budha', kn: 'ಬುಧ', hi: 'बुध' },
    color: '#34d399',
    haloColor: 'rgba(52, 211, 153, 0.35)',
    textureGradient: ['#6ee7b7', '#065f46'],
    radius: 8.5,
    orbitDistanceRatio: 0.45
  },
  Jupiter: {
    name: 'Jupiter',
    sanskritName: { en: 'Guru', kn: 'ಗುರು', hi: 'गुरु' },
    color: '#fb923c',
    haloColor: 'rgba(251, 146, 60, 0.45)',
    textureGradient: ['#fdba74', '#c2410c'],
    radius: 14,
    orbitDistanceRatio: 0.72
  },
  Venus: {
    name: 'Venus',
    sanskritName: { en: 'Shukra', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    color: '#fde047',
    haloColor: 'rgba(253, 224, 71, 0.45)',
    textureGradient: ['#fef08a', '#ca8a04'],
    radius: 10,
    orbitDistanceRatio: 0.48
  },
  Saturn: {
    name: 'Saturn',
    sanskritName: { en: 'Shani', kn: 'ಶನಿ', hi: 'शनि' },
    color: '#eab308',
    haloColor: 'rgba(234, 179, 8, 0.35)',
    textureGradient: ['#fef08a', '#854d0e'],
    hasRings: true,
    ringColor: 'rgba(250, 204, 21, 0.7)',
    radius: 12,
    orbitDistanceRatio: 0.60
  },
  Rahu: {
    name: 'Rahu',
    sanskritName: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु' },
    color: '#94a3b8',
    haloColor: 'rgba(148, 163, 184, 0.35)',
    textureGradient: ['#cbd5e1', '#334155'],
    radius: 9,
    orbitDistanceRatio: 0.32
  },
  Ketu: {
    name: 'Ketu',
    sanskritName: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु' },
    color: '#a855f7',
    haloColor: 'rgba(168, 85, 247, 0.35)',
    textureGradient: ['#d8b4fe', '#581c87'],
    radius: 9,
    orbitDistanceRatio: 0.32
  }
};

export const CelestialSkyMandala3D: React.FC<CelestialSkyMandala3DProps> = ({
  currentLang,
  kundaliData,
  dateStr,
  timeStr,
  cityName
}) => {
  const [selectedItem, setSelectedItem] = useState<{
    type: 'planet' | 'rashi' | 'nakshatra';
    data: any;
  } | null>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConstellations, setShowConstellations] = useState<boolean>(true);
  const [showPadas, setShowPadas] = useState<boolean>(true);
  const [viewAngle, setViewAngle] = useState<'top' | 'isometric'>('top');
  const [liveTimestamp, setLiveTimestamp] = useState<string>(() => new Date().toLocaleString());

  // Update live clock badge every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute absolute ecliptic longitudes (0° to 360°) for each Graha
  const planetLongitudes = useMemo(() => {
    return kundaliData.planets.map(planet => {
      const absLong = (planet.rashiIndex * 30 + planet.degrees) % 360;
      const degPart = Math.floor(planet.degrees);
      const minPart = Math.floor((planet.degrees - degPart) * 60);
      return {
        ...planet,
        absLong,
        degPart,
        minPart,
        formattedDeg: `${degPart}° ${minPart}'`
      };
    });
  }, [kundaliData.planets]);

  // Dimensions of the circular SVG canvas
  const size = 940;
  const cx = size / 2;
  const cy = size / 2;

  // Concentric circle radii
  const earthRadius = 42;
  const innerOrbitRadius = 90;
  const middleOrbitRadius = 160;
  const outerOrbitRadius = 240;
  const rashiInnerRadius = 260;
  const rashiOuterRadius = 320;
  const nakshatraInnerRadius = 330;
  const nakshatraOuterRadius = 430;

  // Convert an angle in degrees to (x, y) on a circle of given radius
  // 0° is North (Top) in traditional compass, but in astronomical ecliptic 0° Mesha starts at the top (0°)
  // Angle rotates clockwise matching the attached picture
  const getCoordinates = (deg: number, radius: number): [number, number] => {
    // 0° at top (12 o'clock), 90° at right (3 o'clock), 180° at bottom (6 o'clock), 270° at left (9 o'clock)
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  // Helper to generate SVG arc path for Rashi segments
  const describeArc = (startDeg: number, endDeg: number, innerR: number, outerR: number): string => {
    const [x1, y1] = getCoordinates(startDeg, outerR);
    const [x2, y2] = getCoordinates(endDeg, outerR);
    const [x3, y3] = getCoordinates(endDeg, innerR);
    const [x4, y4] = getCoordinates(startDeg, innerR);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className={`relative bg-stone-950 text-white rounded-3xl border-2 border-amber-500/50 shadow-2xl overflow-hidden select-none transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
    }`}>
      
      {/* Top Header Bar with Live Badge & Controls */}
      <div className="p-4 sm:p-5 border-b border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg">
            <Globe className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-amber-300 tracking-tight flex items-center gap-2">
                <span>{currentLang === 'kn' ? 'ಖಗೋಳೀಯ ೩D ಗ್ರಹ ಮಂಡಲ • ರಾಶಿ, ನಕ್ಷತ್ರ & ನಕ್ಷತ್ರ ಪುಂಜಗಳು' : '3D Celestial Graha Mandala: Planets, Signs & Sky Constellations'}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Live 3D Sky
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {currentLang === 'kn'
                ? 'ಆಕಾಶದಲ್ಲಿ ನಕ್ಷತ್ರಗಳನ್ನು ಗುರುತಿಸಲು ನೈಜ ನಕ್ಷತ್ರ ಪುಂಜಗಳ ವಿನ್ಯಾಸ (Star Constellations), ರಾಶಿಗಳು, ಪಾದಗಳು ಮತ್ತು ಭೂಮಿಯ ನಾಲ್ಕು ದಿಕ್ಕುಗಳು (N, S, E, W).'
                : 'Recognize constellations in the night sky with authentic star clusters, 27 Nakshatras with 108 Padas, 12 Rashis & Cardinal Directions.'}
            </p>
          </div>
        </div>

        {/* View Switchers & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Constellation Toggle */}
          <button
            onClick={() => setShowConstellations(!showConstellations)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showConstellations
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="Toggle Constellation Star Patterns"
          >
            <Star className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ತಾರಾ ಪುಂಜಗಳು' : 'Stars'}</span>
          </button>

          {/* Pada Toggle */}
          <button
            onClick={() => setShowPadas(!showPadas)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showPadas
                ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="Toggle 108 Nakshatra Padas"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? '೧೦೮ ಪಾದಗಳು' : '108 Padas'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Sky Visualizer Canvas Wrapper */}
      <div className="relative w-full aspect-square max-w-[840px] mx-auto p-2 sm:p-6 flex items-center justify-center overflow-hidden">
        
        {/* Deep Space Background Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0c1a3b_0%,#050814_60%,#02040a_100%)] pointer-events-none" />

        {/* The Master SVG Celestial Sphere */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full relative z-10 transition-transform duration-500 select-none"
        >
          <defs>
            {/* Atmospheric Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Earth Gradient */}
            <radialGradient id="earth-gradient" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>

            {/* Planet Gradients */}
            {Object.entries(PLANET_VISUALS).map(([key, config]) => (
              <radialGradient key={key} id={`planet-grad-${key}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor={config.textureGradient[0]} />
                <stop offset="100%" stopColor={config.textureGradient[1]} />
              </radialGradient>
            ))}

            {/* Radial Line Dash Pattern */}
            <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
            </pattern>
          </defs>

          {/* Background Background Celestial Grid */}
          <rect width={size} height={size} fill="url(#grid-dots)" />

          {/* Radial Angle Guidelines every 30° matching the screenshot */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
            const [x1, y1] = getCoordinates(angle, earthRadius);
            const [x2, y2] = getCoordinates(angle, nakshatraOuterRadius + 10);
            const [tx, ty] = getCoordinates(angle, rashiOuterRadius + 14);

            return (
              <g key={angle}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(217, 119, 6, 0.25)"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                />
                {/* Degree Label */}
                <text
                  x={tx}
                  y={ty}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                  opacity="0.8"
                >
                  {angle}°
                </text>
              </g>
            );
          })}

          {/* Concentric Coordinate Orbit Rings */}
          <circle cx={cx} cy={cy} r={innerOrbitRadius} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx={cx} cy={cy} r={middleOrbitRadius} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx={cx} cy={cy} r={outerOrbitRadius} fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="4,4" />

          {/* ========================================================================= */}
          {/* THE 12 RASHIS BELT (IN GOLDEN AMBER SEGMENTS) */}
          {/* ========================================================================= */}
          <g id="rashis-belt">
            {RASHIS.map((rashi, idx) => {
              const startDeg = idx * 30;
              const endDeg = (idx + 1) * 30;
              const midDeg = startDeg + 15;
              const [tx, ty] = getCoordinates(midDeg, (rashiInnerRadius + rashiOuterRadius) / 2);
              const isSelected = selectedItem?.type === 'rashi' && selectedItem.data.en === rashi.en;

              return (
                <g 
                  key={rashi.en}
                  onClick={() => setSelectedItem({ type: 'rashi', data: rashi })}
                  className="cursor-pointer group"
                >
                  <path
                    d={describeArc(startDeg, endDeg, rashiInnerRadius, rashiOuterRadius)}
                    fill={isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(15, 23, 42, 0.75)'}
                    stroke={isSelected ? '#fbbf24' : 'rgba(217, 119, 6, 0.5)'}
                    strokeWidth={isSelected ? '2' : '1.2'}
                    className="transition-colors group-hover:fill-amber-950/40"
                  />
                  {/* Rashi Name in Gold matching screenshot */}
                  <text
                    x={tx}
                    y={ty}
                    fill="#fbbf24"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="group-hover:fill-amber-300"
                    transform={`rotate(${midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg}, ${tx}, ${ty})`}
                  >
                    {rashi[currentLang] || rashi.en}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 108 NAKSHATRA PADAS (4 PADAS PER NAKSHATRA, 3°20' EACH) */}
          {/* ========================================================================= */}
          {showPadas && (
            <g id="nakshatra-padas">
              {Array.from({ length: 108 }).map((_, pIdx) => {
                const padaDeg = pIdx * (360 / 108); // 3.333333°
                const [x1, y1] = getCoordinates(padaDeg, rashiOuterRadius);
                const [x2, y2] = getCoordinates(padaDeg, rashiOuterRadius + 6);
                const isMajor = pIdx % 4 === 0;

                return (
                  <line
                    key={pIdx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth={isMajor ? '1.5' : '0.8'}
                  />
                );
              })}
            </g>
          )}

          {/* ========================================================================= */}
          {/* 27 NAKSHATRAS OUTER RING WITH REAL RECOGNIZABLE STAR CONSTELLATIONS */}
          {/* ========================================================================= */}
          <g id="nakshatras-ring">
            {NAKSHATRA_SKY_PATTERNS.map((nak) => {
              const midDeg = (nak.spanStartDeg + nak.spanEndDeg) / 2;
              const [tx, ty] = getCoordinates(midDeg, nakshatraOuterRadius + 8);
              const [clusterCenter_x, clusterCenter_y] = getCoordinates(midDeg, (nakshatraInnerRadius + nakshatraOuterRadius) / 2);
              const isSelected = selectedItem?.type === 'nakshatra' && selectedItem.data.index === nak.index;

              return (
                <g 
                  key={nak.index}
                  onClick={() => setSelectedItem({ type: 'nakshatra', data: nak })}
                  className="cursor-pointer group"
                >
                  {/* Outer Nakshatra Name */}
                  <text
                    x={tx}
                    y={ty}
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize="9.5"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="group-hover:fill-sky-300 transition-colors"
                    transform={`rotate(${midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg}, ${tx}, ${ty})`}
                  >
                    {currentLang === 'kn' ? nak.nameKn : nak.nameEn}
                  </text>

                  {/* Authentic Constellation Star Cluster Pattern */}
                  {showConstellations && (
                    <g transform={`translate(${clusterCenter_x}, ${clusterCenter_y})`}>
                      {/* Lines connecting stars in the constellation */}
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
                            stroke="rgba(255, 255, 255, 0.45)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Star Dots */}
                      {nak.stars.map(([sx, sy], sIdx) => (
                        <circle
                          key={sIdx}
                          cx={sx}
                          cy={sy}
                          r={sIdx === 0 ? '2.4' : '1.7'}
                          fill="#ffffff"
                          filter="url(#glow)"
                          className="animate-pulse"
                        />
                      ))}
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* THE 9 GRAHAS PLOTTED WITH EXACT REALISTIC 3D LIGHTING & ALIGNMENT RAYS */}
          {/* ========================================================================= */}
          <g id="grahas-alignment">
            {planetLongitudes.map((planet) => {
              const cfg = PLANET_VISUALS[planet.name] || PLANET_VISUALS.Sun;
              // Visual orbit radius distributed between inner and outer zones
              const orbitR = innerOrbitRadius + (outerOrbitRadius - innerOrbitRadius) * cfg.orbitDistanceRatio;
              const [px, py] = getCoordinates(planet.absLong, orbitR);
              const [earthBorderX, earthBorderY] = getCoordinates(planet.absLong, earthRadius);
              const isSelected = selectedItem?.type === 'planet' && selectedItem.data.name === planet.name;

              // Planet label position offset outward
              const [labelX, labelY] = getCoordinates(planet.absLong, orbitR + 24);

              return (
                <g 
                  key={planet.name}
                  onClick={() => setSelectedItem({ type: 'planet', data: planet })}
                  className="cursor-pointer group"
                >
                  {/* Ray connecting planet to Earth */}
                  <line
                    x1={earthBorderX}
                    y1={earthBorderY}
                    x2={px}
                    y2={py}
                    stroke={cfg.haloColor}
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />

                  {/* Atmospheric Glow Halo */}
                  <circle
                    cx={px}
                    cy={py}
                    r={cfg.radius + 7}
                    fill={cfg.haloColor}
                    filter="url(#glow)"
                  />

                  {/* Saturn 3D Ring System */}
                  {cfg.hasRings && (
                    <ellipse
                      cx={px}
                      cy={py}
                      rx={cfg.radius + 12}
                      ry={cfg.radius * 0.45}
                      fill="none"
                      stroke={cfg.ringColor}
                      strokeWidth="3.5"
                      transform={`rotate(-25, ${px}, ${py})`}
                      filter="url(#glow)"
                    />
                  )}

                  {/* 3D Sphere Sphere with Radial Lighting */}
                  <circle
                    cx={px}
                    cy={py}
                    r={cfg.radius}
                    fill={`url(#planet-grad-${planet.name})`}
                    stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={isSelected ? '2.5' : '1'}
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Saturn 3D Ring Front Overlay */}
                  {cfg.hasRings && (
                    <path
                      d={`M ${px - (cfg.radius + 12)} ${py} A ${cfg.radius + 12} ${cfg.radius * 0.45} 0 0 0 ${px + (cfg.radius + 12)} ${py}`}
                      fill="none"
                      stroke={cfg.ringColor}
                      strokeWidth="3.5"
                      transform={`rotate(-25, ${px}, ${py})`}
                    />
                  )}

                  {/* Planet Name and Degree Badge */}
                  <g transform={`translate(${labelX}, ${labelY})`}>
                    <text
                      x="0"
                      y="-4"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="serif"
                      textAnchor="middle"
                      className="group-hover:fill-amber-300"
                    >
                      {currentLang === 'kn' ? cfg.sanskritName.kn : cfg.sanskritName.en}
                    </text>
                    <text
                      x="0"
                      y="7"
                      fill="#38bdf8"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {planet.formattedDeg}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* CENTRAL 3D EARTH GLOBE WITH CARDINAL DIRECTIONS (N, S, E, W) */}
          {/* ========================================================================= */}
          <g id="central-earth">
            {/* Earth Atmospheric Glow */}
            <circle
              cx={cx}
              cy={cy}
              r={earthRadius + 6}
              fill="rgba(56, 189, 248, 0.25)"
              filter="url(#glow)"
            />

            {/* Earth 3D Sphere */}
            <circle
              cx={cx}
              cy={cy}
              r={earthRadius}
              fill="url(#earth-gradient)"
              stroke="#38bdf8"
              strokeWidth="2"
            />

            {/* Earth Longitude / Latitude Coordinate Rings */}
            <ellipse cx={cx} cy={cy} rx={earthRadius * 0.8} ry={earthRadius * 0.35} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <ellipse cx={cx} cy={cy} rx={earthRadius * 0.35} ry={earthRadius * 0.8} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <line x1={cx - earthRadius} y1={cy} x2={cx + earthRadius} y2={cy} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <line x1={cx} y1={cy - earthRadius} x2={cx} y2={cy + earthRadius} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

            {/* Central Earth Label */}
            <text
              x={cx}
              y={cy}
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              letterSpacing="1"
            >
              EARTH
            </text>

            {/* CARDINAL DIRECTIONS (N, S, E, W) */}
            {/* North at Top */}
            <g transform={`translate(${cx}, ${cy - earthRadius - 14})`}>
              <rect x="-24" y="-8" width="48" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="0" y="3" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                N (North)
              </text>
            </g>

            {/* South at Bottom */}
            <g transform={`translate(${cx}, ${cy + earthRadius + 14})`}>
              <rect x="-24" y="-8" width="48" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="0" y="3" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                S (South)
              </text>
            </g>

            {/* East at Right */}
            <g transform={`translate(${cx + earthRadius + 20}, ${cy})`}>
              <rect x="-22" y="-8" width="44" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="0" y="3" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                E (East)
              </text>
            </g>

            {/* West at Left */}
            <g transform={`translate(${cx - earthRadius - 20}, ${cy})`}>
              <rect x="-22" y="-8" width="44" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="0" y="3" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                W (West)
              </text>
            </g>
          </g>

        </svg>

        {/* Bottom-Left Live Timestamp Badge matching the screenshot */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900/90 border border-sky-500/40 backdrop-blur-md text-sky-400 font-mono text-[11px] sm:text-xs font-bold shadow-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>Time: <strong>{liveTimestamp}</strong></span>
          </div>
        </div>

        {/* Bottom-Right Coordinates Badge */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 hidden xs:block">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-md text-amber-300 font-mono text-[11px] sm:text-xs font-bold shadow-xl">
            <span>{cityName} • Lagna: {kundaliData.houses[0].rashiName[currentLang]}</span>
          </div>
        </div>

      </div>

      {/* Interactive Detail Modal / Inspector Drawer for Selected Planet, Rashi, or Nakshatra */}
      {selectedItem && (
        <div className="p-4 sm:p-5 border-t border-amber-500/30 bg-stone-900/95 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-4">
            
            {/* If Planet Selected */}
            {selectedItem.type === 'planet' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: PLANET_VISUALS[selectedItem.data.name]?.color || '#f59e0b' }} />
                  <h4 className="font-serif font-bold text-base text-amber-300">
                    {PLANET_VISUALS[selectedItem.data.name]?.sanskritName[currentLang]} ({selectedItem.data.name})
                  </h4>
                  <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                    {selectedItem.data.formattedDeg} in {selectedItem.data.rashiName[currentLang]}
                  </span>
                  <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">
                    House {selectedItem.data.bhava}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  {currentLang === 'kn'
                    ? `ಖಗೋಳೀಯ ದ್ರಷ್ಟಿಕೋನ: ${selectedItem.data.name} ಗ್ರಹವು ಪ್ರಸ್ತುತ ${selectedItem.data.rashiName.kn} ರಾಶಿಯಲ್ಲಿ ${selectedItem.data.formattedDeg} ಅಂಶದಲ್ಲಿದೆ. ನಕ್ಷತ್ರ: ${selectedItem.data.nakshatra.kn}. ಆಕಾಶದಲ್ಲಿ ಇದನ್ನು ವೀಕ್ಷಿಸುವಾಗ ಈ ರಾಶಿ ನಕ್ಷತ್ರದ ರೇಖಾಂಶದಲ್ಲಿ ಕಾಣಬಹುದು.`
                    : `Astronomical Coordinate: ${selectedItem.data.name} is positioned at ${selectedItem.data.formattedDeg} in ${selectedItem.data.rashiName.en} (${selectedItem.data.nakshatra.en} Nakshatra). To locate it in the night sky, look towards the cardinal azimuth aligned with this ecliptic degree.`}
                </p>
              </div>
            )}

            {/* If Nakshatra Selected */}
            {selectedItem.type === 'nakshatra' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-sky-400" />
                  <h4 className="font-serif font-bold text-base text-sky-300">
                    {currentLang === 'kn' ? selectedItem.data.nameKn : selectedItem.data.nameEn} Nakshatra
                  </h4>
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                    {selectedItem.data.spanStartDeg.toFixed(1)}° - {selectedItem.data.spanEndDeg.toFixed(1)}°
                  </span>
                  <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                    {selectedItem.data.patternType}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  {currentLang === 'kn' ? selectedItem.data.descriptionKn : selectedItem.data.descriptionEn}
                  <span className="block mt-1 text-stone-400 font-mono text-[11px]">
                    Principal Star (ಮುಖ್ಯ ತಾರೆ): <strong>{selectedItem.data.principalStar}</strong> • 4 Padas: 3°20' each.
                  </span>
                </p>
              </div>
            )}

            {/* If Rashi Selected */}
            {selectedItem.type === 'rashi' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif font-bold text-base text-amber-300">
                    {selectedItem.data[currentLang]} ({selectedItem.data.en})
                  </h4>
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                    Lord: {selectedItem.data.lordEn} ({selectedItem.data.lordKn})
                  </span>
                  <span className="text-xs font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                    Element: {selectedItem.data.element}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  {currentLang === 'kn'
                    ? `${selectedItem.data.kn} ರಾಶಿಯು ೩೦° ವ್ಯಾಪ್ತಿಯನ್ನು ಹೊಂದಿದ್ದು, ರಾಶ್ಯಾಧಿಪತಿ ${selectedItem.data.lordKn}. ಗುಣ: ${selectedItem.data.element} ತತ್ವ.`
                    : `${selectedItem.data.en} spans 30° of the zodiac, ruled by ${selectedItem.data.lordEn}. Element: ${selectedItem.data.element}.`}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedItem(null)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cardinal Direction Sky Legend & Compass Explainer */}
      <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="font-bold text-stone-300 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Kundali Compass Alignment:</span>
          </span>
          <span className="text-sky-300 font-mono"><strong>E (East):</strong> House 1 (Lagna / Ascendant)</span>
          <span className="text-amber-300 font-mono"><strong>N (North):</strong> House 4 (Nadir / Sukha)</span>
          <span className="text-rose-300 font-mono"><strong>W (West):</strong> House 7 (Descendant / Kalatra)</span>
          <span className="text-emerald-300 font-mono"><strong>S (South):</strong> House 10 (Midheaven / Zenith)</span>
        </div>

        <span className="text-[10.5px] text-stone-500 font-mono">
          Hover or tap any Graha, Rashi, or Star cluster for details
        </span>
      </div>

    </div>
  );
};
