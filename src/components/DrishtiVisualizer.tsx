import React, { useState, useEffect } from 'react';
import {
  Eye,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Play,
  Pause,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { KundaliData, Language } from '../types';
import { SvgGrahaIcon } from './RealisticGraha';
import { calculateHouseDrishti, getAspectingHousesForGraha } from '../utils/grahaDrishti';

export interface DrishtiVisualizerProps {
  currentLang: Language;
  kundaliData: KundaliData;
  selectedPlanetName: string;
  onSelectPlanet: (planetName: string) => void;
  showAspectLines: boolean;
  onToggleAspectLines: (show: boolean) => void;
  onSelectHouse?: (bhavaNum: number) => void;
}

interface GrahaDrishtiRule {
  planetKey: string;
  name: Record<Language, string>;
  houses: Record<Language, string>;
  nature: 'Benefic' | 'Karmic' | 'Neutral';
  effect: Record<Language, string>;
}

const GRAHA_DRISHTI_RULES: GrahaDrishtiRule[] = [
  {
    planetKey: 'Sun',
    name: { en: 'Surya (Sun)', kn: 'ಸೂರ್ಯ (Sun)', hi: 'सूर्य (Sun)' },
    houses: { en: '7th House', kn: '೭ನೇ ಭಾವ (ಸಪ್ತಮ ದೃಷ್ಟಿ)', hi: '७वाँ भाव' },
    nature: 'Karmic',
    effect: {
      en: 'Illuminates the opposite house with leadership, authority, and clarity, though its fiery heat can create ego friction in partnerships.',
      kn: 'ಎದುರಿನ ಭಾವಕ್ಕೆ ಆತ್ಮವಿಶ್ವಾಸ, ನಾಯಕತ್ವ ಮತ್ತು ಸ್ಪಷ್ಟತೆಯನ್ನು ನೀಡುತ್ತದೆ; ಆದರೆ ತೀಕ್ಷ್ಣ ತೇಜಸ್ಸಿನಿಂದ ಅಹಂಕಾರದ ಘರ್ಷಣೆ ಉಂಟಾಗಬಹುದು.',
      hi: 'सप्तम भाव को नेतृत्व, तेज और स्पष्टता प्रदान करता है, पर तीव्र अग्नि से साझेदारी में अहं का टकराव हो सकता है।',
    },
  },
  {
    planetKey: 'Moon',
    name: { en: 'Chandra (Moon)', kn: 'ಚಂದ್ರ (Moon)', hi: 'चन्द्र (Moon)' },
    houses: { en: '7th House', kn: '೭ನೇ ಭಾವ (ಸಪ್ತಮ ದೃಷ್ಟಿ)', hi: '७वाँ भाव' },
    nature: 'Benefic',
    effect: {
      en: 'Nurtures the 7th house from itself with emotional warmth, intuition, public charm, and fluid adaptability.',
      kn: 'ತನ್ನಿಂದ ೭ನೇ ಭಾವಕ್ಕೆ ಭಾವನಾತ್ಮಕ ಶಾಂತಿ, ಆಕರ್ಷಣೆ, ಅಂತಃಪ್ರಜ್ಞೆ ಮತ್ತು ಸೌಮ್ಯ ಫಲಗಳನ್ನು ನೀಡುತ್ತದೆ.',
      hi: 'सप्तम भाव में भावनात्मक सौम्यता, आकर्षण, अंतर्ज्ञान और अनुकूलनशीलता बढ़ाता है।',
    },
  },
  {
    planetKey: 'Mars',
    name: { en: 'Mangala (Mars)', kn: 'ಮಂಗಳ / ಕುಜ (Mars)', hi: 'मंगल (Mars)' },
    houses: { en: '4th, 7th & 8th Houses', kn: '೪, ೭ ಮತ್ತು ೮ನೇ ಭಾವಗಳು (ವಿಶೇಷ ದೃಷ್ಟಿ)', hi: '४, ७ और ८वाँ भाव (विशेष दृष्टि)' },
    nature: 'Karmic',
    effect: {
      en: '4th aspect brings drive for property & protective courage; 7th fuels passion & assertion; 8th triggers sudden transformation, surgery, or deep research.',
      kn: '೪ನೇ ದೃಷ್ಟಿ ಭೂಮಿ-ಧೈರ್ಯ; ೭ನೇ ದೃಷ್ಟಿ ಉತ್ಸಾಹ ಮತ್ತು ಸಂಘರ್ಷ; ೮ನೇ ದೃಷ್ಟಿ ಹಠಾತ್ ಬದಲಾವಣೆ, ರಹಸ್ಯ ಶಕ್ತಿ ಮತ್ತು ರಕ್ಷಣಾತ್ಮಕ ಜಾಗರೂಕತೆ ತರುತ್ತದೆ.',
      hi: '४थी दृष्टि भूमि व साहस, ७वीं ऊर्जा व आवेश, और ८वीं अचानक परिवर्तन तथा गहन शोध प्रदान करती है।',
    },
  },
  {
    planetKey: 'Mercury',
    name: { en: 'Budha (Mercury)', kn: 'ಬುಧ (Mercury)', hi: 'बुध (Mercury)' },
    houses: { en: '7th House', kn: '೭ನೇ ಭಾವ (ಸಪ್ತಮ ದೃಷ್ಟಿ)', hi: '७वाँ भाव' },
    nature: 'Benefic',
    effect: {
      en: 'Sharpens intellect, speech, business acumen, analytical skill, and witty communication in the aspected house.',
      kn: 'ದೃಷ್ಟಿ ಬೀರುವ ಭಾವದಲ್ಲಿ ಬುದ್ಧಿವಂತಿಕೆ, ವ್ಯಾಪಾರ ಕೌಶಲ್ಯ, ವಾಕ್ಚಾತುರ್ಯ ಮತ್ತು ವಿಶ್ಲೇಷಣಾ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      hi: 'दृष्टिगत भाव में बुद्धि, वाणी, व्यापार कौशल और तार्किक क्षमता को प्रखर बनाता है।',
    },
  },
  {
    planetKey: 'Jupiter',
    name: { en: 'Guru (Jupiter)', kn: 'ಗುರು (Jupiter)', hi: 'गुरु (Jupiter)' },
    houses: { en: '5th, 7th & 9th Houses', kn: '೫, ೭ ಮತ್ತು ೯ನೇ ಭಾವಗಳು (ಅಮೃತ ದೃಷ್ಟಿ)', hi: '५, ७ और ९वाँ भाव (अमृत दृष्टि)' },
    nature: 'Benefic',
    effect: {
      en: 'Most auspicious Amrita Drishti: 5th blesses wisdom & progeny, 7th brings ethical partnerships & prosperity, 9th grants Dharma, luck, and divine protection.',
      kn: 'ಅತ್ಯಂತ ಶುಭವಾದ ಅಮೃತ ದೃಷ್ಟಿ: ೫ನೇ ದೃಷ್ಟಿ ಜ್ಞಾನ-ಸಂತಾನ, ೭ನೇ ದೃಷ್ಟಿ ಶುಭ ಬಾಂಧವ್ಯ-ಸಂಪತ್ತು, ೯ನೇ ದೃಷ್ಟಿ ಭಾಗ್ಯ, ಧರ್ಮ ಮತ್ತು ದೈವಾನುಗ್ರಹ ನೀಡುತ್ತದೆ.',
      hi: 'परम शुभ अमृत दृष्टि: ५वीं ज्ञान व संतान, ७वीं समृद्ध साझेदारी, और ९वीं धर्म, भाग्य व दैवीय रक्षा प्रदान करती है।',
    },
  },
  {
    planetKey: 'Venus',
    name: { en: 'Shukra (Venus)', kn: 'ಶುಕ್ರ (Venus)', hi: 'शुक्र (Venus)' },
    houses: { en: '7th House', kn: '೭ನೇ ಭಾವ (ಸಪ್ತಮ ದೃಷ್ಟಿ)', hi: '७वाँ भाव' },
    nature: 'Benefic',
    effect: {
      en: 'Bestows beauty, artistic refinement, romance, material comforts, and diplomatic harmony to the opposite house.',
      kn: 'ಎದುರಿನ ಭಾವಕ್ಕೆ ಸೌಂದರ್ಯ, ಕಲೆ, ಪ್ರೇಮ, ಭೌತಿಕ ಸುಖಸಂಪತ್ತು ಮತ್ತು ಸಾಮರಸ್ಯವನ್ನು ಅನುಗ್ರಹಿಸುತ್ತದೆ.',
      hi: 'सप्तम भाव को सौंदर्य, कला, प्रेम, भौतिक सुख और मधुर सामंजस्य से समृद्ध करता है।',
    },
  },
  {
    planetKey: 'Saturn',
    name: { en: 'Shani (Saturn)', kn: 'ಶನಿ (Saturn)', hi: 'शनि (Saturn)' },
    houses: { en: '3rd, 7th & 10th Houses', kn: '೩, ೭ ಮತ್ತು ೧೦ನೇ ಭಾವಗಳು (ಕರ್ಮ ದೃಷ್ಟಿ)', hi: '३, ७ और १०वाँ भाव (कर्म दृष्टि)' },
    nature: 'Karmic',
    effect: {
      en: '3rd demands persistent effort & discipline; 7th tests commitments for long-term durability; 10th builds enduring career mastery through patience.',
      kn: '೩ನೇ ದೃಷ್ಟಿ ಸತತ ಪರಿಶ್ರಮ; ೭ನೇ ದೃಷ್ಟಿ ಸಂಬಂಧಗಳಲ್ಲಿ ತಾಳ್ಮೆ-ಸ್ಥಿರತೆ ಪರೀಕ್ಷೆ; ೧೦ನೇ ದೃಷ್ಟಿ ನಿಧಾನವಾದರೂ ಶಾಶ್ವತ ವೃತ್ತಿ ಯಶಸ್ಸು ನೀಡುತ್ತದೆ.',
      hi: '३री दृष्टि निरंतर परिश्रम, ७वीं संबंधों में धैर्य व स्थायित्व, और १०वीं कर्मक्षेत्र में दीर्घकालिक सफलता देती है।',
    },
  },
  {
    planetKey: 'Rahu',
    name: { en: 'Rahu (North Node)', kn: 'ರಾಹು (Rahu)', hi: 'राहु (Rahu)' },
    houses: { en: '5th, 7th & 9th Houses', kn: '೫, ೭ ಮತ್ತು ೯ನೇ ಭಾವಗಳು', hi: '५, ७ और ९वाँ भाव' },
    nature: 'Karmic',
    effect: {
      en: 'Amplifies worldly ambition, unconventional ideas, foreign connections, and sudden breakthroughs while warning against illusion or excess.',
      kn: 'ಅಸಾಮಾನ್ಯ ಆಕಾಂಕ್ಷೆ, ನವೀನ ಆಲೋಚನೆ, ವಿದೇಶಿ ಸಂಪರ್ಕ ಮತ್ತು ಹಠಾತ್ ಉನ್ನತಿ ನೀಡುತ್ತದೆ; ಆದರೆ ಭ್ರಮೆ ಮತ್ತು ಅತಿಯಾದ ಆಸೆಯಿಂದ ಎಚ್ಚರವಿರಬೇಕು.',
      hi: 'महत्वाकांक्षा, नवीन विचार, विदेशी संबंध और आकस्मिक सफलता बढ़ाता है, पर भ्रम से सावधानी आवश्यक है।',
    },
  },
  {
    planetKey: 'Ketu',
    name: { en: 'Ketu (South Node)', kn: 'ಕೇತು (Ketu)', hi: 'केतु (Ketu)' },
    houses: { en: '5th, 7th & 9th Houses', kn: '೫, ೭ ಮತ್ತು ೯ನೇ ಭಾವಗಳು', hi: '५, ७ और ९वाँ भाव' },
    nature: 'Karmic',
    effect: {
      en: 'Inspires spiritual detachment, past-life intuition, mystical insight, and inner liberation by dissolving shallow attachments.',
      kn: 'ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ, ಪೂರ್ವಜನ್ಮದ ಅಂತಃಪ್ರಜ್ಞೆ, ಗೂಢಜ್ಞಾನ ಮತ್ತು ಭೌತಿಕ ಮೋಹದಿಂದ ಮುಕ್ತಿಯನ್ನು ನೀಡುತ್ತದೆ.',
      hi: 'आध्यात्मिक वैराग्य, पूर्वजन्म का अंतर्ज्ञान, गूढ़ विद्या और आंतरिक मुक्ति की ओर प्रेरित करता है।',
    },
  },
];

export const DrishtiVisualizer: React.FC<DrishtiVisualizerProps> = ({
  currentLang,
  kundaliData,
  selectedPlanetName,
  onSelectPlanet,
  showAspectLines,
  onToggleAspectLines,
  onSelectHouse,
}) => {
  const [isAutoAnimating, setIsAutoAnimating] = useState<boolean>(false);
  const [showDrishtiGuide, setShowDrishtiGuide] = useState<boolean>(false);

  const activePlanet =
    kundaliData.planets.find(
      (p) => p.name.toLowerCase() === selectedPlanetName.toLowerCase()
    ) || kundaliData.planets[0];

  // Auto-cycle animation across all 9 Grahas on the Lagna Kundali
  useEffect(() => {
    if (!isAutoAnimating) return;
    if (!showAspectLines) {
      onToggleAspectLines(true);
    }
    const timer = setInterval(() => {
      const idx = kundaliData.planets.findIndex(
        (p) => p.name.toLowerCase() === activePlanet.name.toLowerCase()
      );
      const nextIdx = (idx + 1) % kundaliData.planets.length;
      onSelectPlanet(kundaliData.planets[nextIdx].name);
    }, 2800);
    return () => clearInterval(timer);
  }, [isAutoAnimating, activePlanet.name, kundaliData.planets, onSelectPlanet, showAspectLines, onToggleAspectLines]);

  const aspects = getAspectingHousesForGraha(activePlanet.name, activePlanet.bhava);

  const isBenefic = ['jupiter', 'guru', 'venus', 'shukra', 'mercury', 'budha', 'moon', 'chandra'].some(
    (n) => activePlanet.name.toLowerCase().includes(n)
  );

  // Clean display label preventing duplicate "(Jupiter) (Jupiter)"
  const activePlanetLabel = activePlanet.sanskritName[currentLang]
    .toLowerCase()
    .includes(activePlanet.name.toLowerCase())
    ? activePlanet.sanskritName[currentLang]
    : `${activePlanet.sanskritName[currentLang]} (${activePlanet.name})`;

  const activeRule = GRAHA_DRISHTI_RULES.find(
    (r) => r.planetKey.toLowerCase() === activePlanet.name.toLowerCase()
  );

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/80 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-rose-400/80 dark:border-rose-900/60 shadow-xl space-y-4">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Eye className="w-5 h-5 text-rose-100" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70 px-2 py-0.5 rounded-full">
                Interactive Drishti Visualizer
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                Parashari Ray Tracing
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentLang === 'kn'
                ? 'ಗ್ರಹ ದೃಷ್ಟಿ ಅನಿಮೇಷನ್ ಮತ್ತು ವಿವರಣೆ (Drishti Animation & Effects)'
                : currentLang === 'hi'
                ? 'ग्रह दृष्टि एनिमेशन एवं फल विवरण (Drishti Visualizer)'
                : 'Planetary Drishti Animation & Aspect Effects'}
            </h4>
          </div>
        </div>

        {/* Action Buttons: Auto-Animate Tour + Rays Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const nextState = !isAutoAnimating;
              setIsAutoAnimating(nextState);
              if (nextState && !showAspectLines) {
                onToggleAspectLines(true);
              }
            }}
            className={`px-3 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border ${
              isAutoAnimating
                ? 'bg-amber-600 text-white border-amber-700 animate-pulse'
                : 'bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-stone-700 hover:bg-amber-200'
            }`}
            title="Auto-animate Drishti rays for all 9 Grahas on the Kundali"
          >
            {isAutoAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>
              {isAutoAnimating
                ? currentLang === 'kn'
                  ? 'ಅನಿಮೇಷನ್ ನಿಲ್ಲಿಸಿ'
                  : 'Pause Tour'
                : currentLang === 'kn'
                ? 'ದೃಷ್ಟಿ ಅನಿಮೇಷನ್'
                : 'Animate Drishti'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onToggleAspectLines(!showAspectLines)}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all ${
              showAspectLines
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
            }`}
            title="Toggle SVG Aspect Lines on the Kundali Chart"
          >
            {showAspectLines ? (
              <ToggleRight className="w-5 h-5 text-rose-100" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-stone-400" />
            )}
            <span>
              {showAspectLines
                ? currentLang === 'kn'
                  ? 'ದೃಷ್ಟಿ ರೇಖೆ: ON'
                  : 'Aspect Rays: ON'
                : currentLang === 'kn'
                ? 'ದೃಷ್ಟಿ ರೇಖೆ: OFF'
                : 'Aspect Rays: OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Select Graha to Visualize Aspect Rays */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
          <span>
            {currentLang === 'kn'
              ? 'ದೃಷ್ಟಿ ರೇಖೆ ಮತ್ತು ಫಲ ವೀಕ್ಷಿಸಲು ಗ್ರಹವನ್ನು ಆಯ್ಕೆಮಾಡಿ:'
              : 'Select Graha to Trace Aspect Rays on Chart:'}
          </span>
          <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 hidden sm:inline">
            {currentLang === 'kn' ? 'ಯಾವುದೇ ಗ್ರಹದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click any Graha below'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
          {kundaliData.planets.map((planet) => {
            const isSelected = planet.name.toLowerCase() === activePlanet.name.toLowerCase();
            return (
              <button
                key={planet.name}
                type="button"
                onClick={() => {
                  setIsAutoAnimating(false);
                  onSelectPlanet(planet.name);
                  if (!showAspectLines) onToggleAspectLines(true);
                }}
                className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400/50 scale-102 font-bold'
                    : 'bg-white dark:bg-stone-850 hover:bg-rose-50 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                <SvgGrahaIcon name={planet.name} size={22} isRetrograde={planet.isRetrograde} />
                <span className="font-serif text-[11px] truncate max-w-full">
                  {planet.sanskritName[currentLang]}
                </span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  H#{planet.bhava}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Graha's Aspected Houses & Detailed Effects Panel */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <SvgGrahaIcon name={activePlanet.name} size={30} isRetrograde={activePlanet.isRetrograde} />
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100">
                  {activePlanetLabel}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  House #{activePlanet.bhava} ({activePlanet.rashiName[currentLang]})
                </span>
              </div>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                {currentLang === 'kn'
                  ? `ಈ ಗ್ರಹವು ಒಟ್ಟು ${aspects.length} ಭಾವಗಳ ಮೇಲೆ ಪರಾಶರಿ ದೃಷ್ಟಿ ಬೀರುತ್ತಿದೆ`
                  : `Casting ${aspects.length} Parashari Aspect Rays across the horoscope`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                isBenefic
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {isBenefic
                ? currentLang === 'kn'
                  ? 'ಶುಭ ದೃಷ್ಟಿ (Benefic Rays)'
                  : 'Benefic Glances'
                : currentLang === 'kn'
                ? 'ಕ್ರೂರ / ಕರ್ಮ ದೃಷ್ಟಿ (Fiery/Karmic Rays)'
                : 'Fiery / Karmic Glances'}
            </span>
          </div>
        </div>

        {/* Active Graha Drishti Principle */}
        {activeRule && (
          <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 dark:text-amber-300">
                {activeRule.houses[currentLang]}:{' '}
              </strong>
              <span>{activeRule.effect[currentLang]}</span>
            </div>
          </div>
        )}

        {/* Aspect Destination Cards with Exact Effect on Each House */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {aspects.map((asp, idx) => {
            const targetHouseData = kundaliData.houses.find((h) => h.bhava === asp.targetBhava);
            const targetOccupants = kundaliData.planets.filter((p) => p.bhava === asp.targetBhava);
            const houseDrishtiAnalysis = calculateHouseDrishti(kundaliData, asp.targetBhava);
            const matchedAspectDetail = houseDrishtiAnalysis.aspectingPlanets.find(
              (a) => a.aspectingPlanet.name.toLowerCase() === activePlanet.name.toLowerCase()
            );

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-900 dark:to-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{asp.targetBhava}
                      </span>
                      <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                        {targetHouseData ? targetHouseData.rashiName[currentLang] : `H#${asp.targetBhava}`}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900 shrink-0">
                      {asp.distance}th Aspect
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-rose-900 dark:text-rose-300">
                    {asp.label[currentLang]}
                  </div>

                  {/* Specific House Effect Explanation */}
                  {matchedAspectDetail && (
                    <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed bg-white/80 dark:bg-stone-950/50 p-2 rounded-lg border border-stone-200/70 dark:border-stone-700/70">
                      {matchedAspectDetail.effectOnHouse[currentLang]}
                    </p>
                  )}
                </div>

                {/* Target House Occupants */}
                <div className="pt-1.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-stone-500 dark:text-stone-400">
                    {targetOccupants.length > 0
                      ? `${currentLang === 'kn' ? 'ಭಾವಸ್ಥ:' : 'Occupants:'} ${targetOccupants
                          .map((o) => o.sanskritName[currentLang])
                          .join(', ')}`
                      : currentLang === 'kn'
                      ? 'ಖಾಲಿ ಭಾವ (Unoccupied)'
                      : 'Unoccupied House'}
                  </span>

                  {onSelectHouse && (
                    <button
                      type="button"
                      onClick={() => onSelectHouse(asp.targetBhava)}
                      className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                    >
                      <span>{currentLang === 'kn' ? 'ಭಾವ' : 'House'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Concise Planetary Drishti Summary Table (All 9 Grahas at a Glance) */}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-rose-200/90 dark:border-stone-700 shadow-sm overflow-hidden">
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-rose-50 via-amber-50/70 to-rose-50 dark:from-stone-850 dark:to-stone-800 border-b border-rose-200/80 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h5 className="text-xs sm:text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
              {currentLang === 'kn'
                ? 'ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳ ನೇರ ದೃಷ್ಟಿ ಸಾರಾಂಶ ಪಟ್ಟಿ (Quick Drishti Summary Table)'
                : currentLang === 'hi'
                ? 'सभी ९ ग्रहों की सीधी दृष्टि संक्षिप्त तालिका (Quick Drishti Summary)'
                : 'Quick Planetary Drishti Summary Table — All 9 Grahas'}
            </h5>
            <p className="text-[10.5px] text-stone-500 dark:text-stone-400">
              {currentLang === 'kn'
                ? 'ಅನಿಮೇಷನ್ ನೋಡದೆಯೇ ಪ್ರತಿ ಗ್ರಹದ ನೇರ ದೃಷ್ಟಿ ಭಾವಗಳನ್ನು ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ. ಯಾವುದೇ ಸಾಲನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಚಾರ್ಟ್‌ನಲ್ಲಿ ರೇಖೆ ನೋಡಿ.'
                : 'Check every planet’s direct aspects at a glance without waiting for the animation. Click any row to trace its rays on the chart.'}
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {currentLang === 'kn' ? '೯ ಗ್ರಹಗಳು • ಪರಾಶರಿ ನಿಯಮ' : '9 Grahas • Parashari Aspects'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[560px]">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-850 text-[10.5px] font-mono uppercase tracking-wide text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700">
                <th className="py-2 px-3 font-bold">
                  {currentLang === 'kn' ? 'ಗ್ರಹ (Graha)' : currentLang === 'hi' ? 'ग्रह' : 'Graha'}
                </th>
                <th className="py-2 px-2.5 font-bold">
                  {currentLang === 'kn' ? 'ಸ್ಥಾನ (House)' : currentLang === 'hi' ? 'भाव / राशि' : 'Placed In'}
                </th>
                <th className="py-2 px-2.5 font-bold">
                  {currentLang === 'kn' ? 'ದೃಷ್ಟಿ ನಿಯಮ' : currentLang === 'hi' ? 'दृष्टि नियम' : 'Direct Aspects'}
                </th>
                <th className="py-2 px-3 font-bold">
                  {currentLang === 'kn' ? 'ದೃಷ್ಟಿ ಬೀರುವ ಭಾವಗಳು & ರಾಶಿಗಳು' : currentLang === 'hi' ? 'दृष्टिगत भाव एवं राशि' : 'Aspected Houses & Rashis'}
                </th>
                <th className="py-2 px-2.5 font-bold text-right">
                  {currentLang === 'kn' ? 'ಸ್ವಭಾವ' : currentLang === 'hi' ? 'प्रकृति' : 'Nature'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {kundaliData.planets.map((planet) => {
                const rowAspects = getAspectingHousesForGraha(planet.name, planet.bhava);
                const isRowActive = planet.name.toLowerCase() === activePlanet.name.toLowerCase();
                const rowIsBenefic = ['jupiter', 'guru', 'venus', 'shukra', 'mercury', 'budha', 'moon', 'chandra'].some(
                  (n) => planet.name.toLowerCase().includes(n)
                );
                const aspectDistancesLabel = rowAspects.map((a) => `${a.distance}th`).join(', ');

                return (
                  <tr
                    key={planet.name}
                    onClick={() => {
                      setIsAutoAnimating(false);
                      onSelectPlanet(planet.name);
                      if (!showAspectLines) onToggleAspectLines(true);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isRowActive
                        ? 'bg-rose-50/90 dark:bg-rose-950/35'
                        : 'hover:bg-amber-50/50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <SvgGrahaIcon name={planet.name} size={18} isRetrograde={planet.isRetrograde} />
                        <span className={`font-serif font-bold ${isRowActive ? 'text-rose-700 dark:text-rose-300' : 'text-stone-900 dark:text-stone-100'}`}>
                          {planet.sanskritName[currentLang]}
                        </span>
                        {planet.isRetrograde && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            R
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200">
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          H#{planet.bhava}
                        </span>
                        <span className="font-sans font-semibold text-stone-600 dark:text-stone-400">
                          {planet.rashiName[currentLang]}
                        </span>
                      </span>
                    </td>

                    <td className="py-2 px-2.5 whitespace-nowrap">
                      <span className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400">
                        {aspectDistancesLabel}
                      </span>
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {rowAspects.map((asp, aIdx) => {
                          const targetHouse = kundaliData.houses.find((h) => h.bhava === asp.targetBhava);
                          return (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAutoAnimating(false);
                                onSelectPlanet(planet.name);
                                if (!showAspectLines) onToggleAspectLines(true);
                                if (onSelectHouse) onSelectHouse(asp.targetBhava);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-stone-700 text-[10.5px] font-semibold text-stone-800 dark:text-stone-200 cursor-pointer transition-colors"
                              title={asp.label[currentLang]}
                            >
                              <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                                H#{asp.targetBhava}
                              </span>
                              <span>
                                {targetHouse ? targetHouse.rashiName[currentLang] : ''}
                              </span>
                              <span className="text-[9px] font-mono text-stone-500">
                                ({asp.distance}th)
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-2 px-2.5 text-right whitespace-nowrap">
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                          rowIsBenefic
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {rowIsBenefic
                          ? currentLang === 'kn'
                            ? 'ಶುಭ'
                            : 'Benefic'
                          : currentLang === 'kn'
                          ? 'ಕರ್ಮ / ತೀಕ್ಷ್ಣ'
                          : 'Karmic'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible Guide: Complete Parashari Drishti Rules & Effects (Hidden by Default) */}
      <div className="rounded-2xl border border-rose-200 dark:border-stone-700 bg-white/80 dark:bg-stone-900/70 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDrishtiGuide(!showDrishtiGuide)}
          className="w-full px-4 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-bold text-rose-900 dark:text-rose-300 hover:bg-rose-50/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {currentLang === 'kn'
                ? 'ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳ ದೃಷ್ಟಿ ನಿಯಮಗಳು ಮತ್ತು ಫಲಗಳ ವಿವರಣೆ (Which Graha Aspects Which Houses)'
                : currentLang === 'hi'
                ? 'सभी ९ ग्रहों की दृष्टि नियम और प्रभाव (Drishti Guide)'
                : 'Complete Drishti Guide: Which Graha Aspects Which Houses & Their Effects'}
            </span>
          </span>
          {showDrishtiGuide ? (
            <ChevronUp className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" />
          )}
        </button>

        {showDrishtiGuide && (
          <div className="p-3.5 sm:p-4 border-t border-rose-200/70 dark:border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs animate-in fade-in">
            {GRAHA_DRISHTI_RULES.map((rule) => (
              <div
                key={rule.planetKey}
                onClick={() => {
                  setIsAutoAnimating(false);
                  onSelectPlanet(rule.planetKey);
                  if (!showAspectLines) onToggleAspectLines(true);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  activePlanet.name.toLowerCase() === rule.planetKey.toLowerCase()
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 ring-1 ring-rose-400'
                    : 'bg-stone-50/70 dark:bg-stone-850 border-stone-200 dark:border-stone-700 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <SvgGrahaIcon name={rule.planetKey} size={18} />
                    <strong className="font-serif text-stone-900 dark:text-stone-100">
                      {rule.name[currentLang]}
                    </strong>
                  </div>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                      rule.nature === 'Benefic'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {rule.nature === 'Benefic'
                      ? currentLang === 'kn'
                        ? 'ಶುಭ'
                        : 'Benefic'
                      : currentLang === 'kn'
                      ? 'ತೀಕ್ಷ್ಣ'
                      : 'Karmic'}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400">
                  {rule.houses[currentLang]}
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {rule.effect[currentLang]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
