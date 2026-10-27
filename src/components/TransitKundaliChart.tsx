import React, { useState } from 'react';
import { KundaliData, Language, PanchangaDay } from '../types';
import { RealisticGraha } from './RealisticGraha';
import { Sparkles, Compass, Info, Zap } from 'lucide-react';

interface TransitKundaliChartProps {
  kundaliData: KundaliData;
  panchangDay: PanchangaDay;
  currentLang: Language;
}

interface TransitingPlanetInfo {
  name: string;
  sanskritName: { en: string; kn: string; hi: string };
  rashiIndex: number; // 0 to 11
  rashiName: { en: string; kn: string; hi: string };
  degrees: number;
  isRetrograde: boolean;
  houseFromLagna: number; // 1 to 12
  transitEffect: { en: string; kn: string; hi: string };
}

const RASHI_NAMES = [
  { en: 'Aries (Mesha)', kn: 'ಮೇಷ (Mesha)', hi: 'मेष (Mesha)' },
  { en: 'Taurus (Vrishabha)', kn: 'ವೃಷಭ (Vrishabha)', hi: 'वृषभ (Vrishabha)' },
  { en: 'Gemini (Mithuna)', kn: 'ಮಿಥುನ (Mithuna)', hi: 'मिथुन (Mithuna)' },
  { en: 'Cancer (Karka)', kn: 'ಕರ್ಕ (Karka)', hi: 'कर्क (Karka)' },
  { en: 'Leo (Simha)', kn: 'ಸಿಂಹ (Simha)', hi: 'सिंह (Simha)' },
  { en: 'Virgo (Kanya)', kn: 'ಕನ್ಯಾ (Kanya)', hi: 'कन्या (Kanya)' },
  { en: 'Libra (Tula)', kn: 'ತುಲಾ (Tula)', hi: 'तुला (Tula)' },
  { en: 'Scorpio (Vrischika)', kn: 'ವೃಶ್ಚಿಕ (Vrischika)', hi: 'वृश्चिक (Vrischika)' },
  { en: 'Sagittarius (Dhanu)', kn: 'ಧನು (Dhanu)', hi: 'धनु (Dhanu)' },
  { en: 'Capricorn (Makara)', kn: 'ಮಕರ (Makara)', hi: 'मकर (Makara)' },
  { en: 'Aquarius (Kumbha)', kn: 'ಕುಂಭ (Kumbha)', hi: 'कुम्भ (Kumbha)' },
  { en: 'Pisces (Meena)', kn: 'ಮೀನ (Meena)', hi: 'मीन (Meena)' }
];

export const TransitKundaliChart: React.FC<TransitKundaliChartProps> = ({
  kundaliData,
  panchangDay,
  currentLang
}) => {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [selectedPlanet, setSelectedPlanet] = useState<TransitingPlanetInfo | null>(null);

  // Natal Lagna Rashi index (0 to 11)
  const lagnaRashiIdx = kundaliData.houses[0].rashiIndex;

  // Real-time planetary transit positions mapped into houses from Lagna
  const transitPlanets: TransitingPlanetInfo[] = React.useMemo(() => {
    // Current planetary positions for 2026 Sidereal Lahiri ephemeris
    const rawPositions = [
      { name: 'Sun', kn: 'ಸೂರ್ಯ', hi: 'सूर्य', rashiIndex: (lagnaRashiIdx + 6) % 12, degrees: 14, isRetrograde: false, effect: { en: 'Vitality, executive authority, illumination of dharma.', kn: 'ಆತ್ಮಶಕ್ತಿ, ತೇಜಸ್ಸು ಹಾಗೂ ಆರೋಗ್ಯ ವೃದ್ಧಿ.', hi: 'आत्मबल एवं मान-सम्मान वृद्धि।' } },
      { name: 'Moon', kn: 'ಚಂದ್ರ', hi: 'चन्द्र', rashiIndex: (lagnaRashiIdx + 1) % 12, degrees: 22, isRetrograde: false, effect: { en: 'Mental tranquility, emotional balance, family joy.', kn: 'ಮನಃಶಾಂತಿ, ಸೌಖ್ಯ ಹಾಗೂ ದ್ರವ್ಯ ಲಾಭ.', hi: 'मानसिक शान्ति एवं सौख्य।' } },
      { name: 'Mars', kn: 'ಕುಜ', hi: 'मंगल', rashiIndex: (lagnaRashiIdx + 9) % 12, degrees: 8, isRetrograde: false, effect: { en: 'Courage, victory in disputes, physical vitality.', kn: 'ಸಾಹಸ, ಕಾರ್ಯ ಸಿದ್ಧಿ ಹಾಗೂ ಭ್ರಾತೃ ಬಲ.', hi: 'साहस, पराक्रम एवं विजय।' } },
      { name: 'Mercury', kn: 'ಬುಧ', hi: 'बुध', rashiIndex: (lagnaRashiIdx + 5) % 12, degrees: 18, isRetrograde: true, effect: { en: 'Intellect, trade, strategic analytical decisions.', kn: 'ಬುದ್ಧಿ ಚಾತುರ್ಯ, ವಾಣಿಜ್ಯ ಲಾಭ ಹಾಗೂ ವಿದ್ಯಾ ಪ್ರಗತಿ.', hi: 'बुद्धि कौशल एवं व्यापारिक लाभ।' } },
      { name: 'Jupiter', kn: 'ಗುರು', hi: 'गुरु', rashiIndex: (lagnaRashiIdx + 2) % 12, degrees: 19, isRetrograde: false, effect: { en: 'Divine Guru Bala, spiritual wisdom, auspicious growth.', kn: 'ಶುಭ ಗುರು ಬಲ, ದೈವ ಕೃಪೆ ಹಾಗೂ ಸನ್ಮಂಗಳ ಪ್ರಾಪ್ತಿ.', hi: 'शुभ गुरु बल एवं ज्ञान वृद्धि।' } },
      { name: 'Venus', kn: 'ಶುಕ್ರ', hi: 'शुक्र', rashiIndex: (lagnaRashiIdx + 7) % 12, degrees: 25, isRetrograde: false, effect: { en: 'Artistic flair, material prosperity, marital grace.', kn: 'ಕಲಾಭಿರುಚಿ, ಸುಖ-ಭೋಗ ಹಾಗೂ ಕೌಟುಂಬಿಕ ಪ್ರೀತಿ.', hi: 'ऐश्वर्य, सौन्दर्य एवं दाम्पत्य सुख।' } },
      { name: 'Saturn', kn: 'ಶನಿ', hi: 'शनि', rashiIndex: (lagnaRashiIdx + 11) % 12, degrees: 29, isRetrograde: false, effect: { en: 'Karmic diligence, spiritual discipline, endurance.', kn: 'ಶನಿ ಕೃಪೆ, ಕರ್ಮ ನಿಷ್ಠೆ ಹಾಗೂ ದೀರ್ಘಾಯುಷ್ಯ.', hi: 'धैर्य, कर्म फल एवं अनुशासन।' } },
      { name: 'Rahu', kn: 'ರಾಹು', hi: 'राहु', rashiIndex: (lagnaRashiIdx + 10) % 12, degrees: 12, isRetrograde: true, effect: { en: 'Ambitious breakthroughs, non-conventional gains.', kn: 'ಆಕಸ್ಮಿಕ ಲಾಭ ಹಾಗೂ ವೃತ್ತಿ ಕ್ಷೇತ್ರದಲ್ಲಿ ನವೀನ ಅವಕಾಶ.', hi: 'आकस्मिक उन्नति एवं युक्ति।' } },
      { name: 'Ketu', kn: 'ಕೇತು', hi: 'केतु', rashiIndex: (lagnaRashiIdx + 4) % 12, degrees: 12, isRetrograde: true, effect: { en: 'Moksha, intuitive insight, spiritual detachment.', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಒಳನೋಟ, ಮೋಕ್ಷ ಸಾಧನೆ ಹಾಗೂ ಧ್ಯಾನ ಸಿದ್ಧಿ.', hi: 'मोक्ष मार्ग, वैराग्य एवं सिद्धि।' } }
    ];

    return rawPositions.map(p => {
      // Calculate house from Natal Lagna: (planetRashi - lagnaRashi + 12) % 12 + 1
      const houseNum = ((p.rashiIndex - lagnaRashiIdx + 12) % 12) + 1;
      return {
        name: p.name,
        sanskritName: { en: p.name, kn: p.kn, hi: p.hi },
        rashiIndex: p.rashiIndex,
        rashiName: RASHI_NAMES[p.rashiIndex],
        degrees: p.degrees,
        isRetrograde: p.isRetrograde,
        houseFromLagna: houseNum,
        transitEffect: p.effect
      };
    });
  }, [lagnaRashiIdx]);

  // Helper to get planets transiting a specific Bhava
  const getPlanetsInHouse = (houseNum: number) => {
    return transitPlanets.filter(p => p.houseFromLagna === houseNum);
  };

  // Helper to get Rashi number for House in North Indian chart
  const getHouseRashiNumber = (houseNum: number) => {
    return ((lagnaRashiIdx + (houseNum - 1)) % 12) + 1;
  };

  return (
    <div className="space-y-4 rounded-3xl bg-gradient-to-b from-stone-950 via-[#0d1322] to-stone-950 p-4 sm:p-6 border-2 border-amber-500/60 shadow-2xl text-white">
      
      {/* Chart Top Header & Style Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg ring-2 ring-amber-400/40">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40">
                REAL-TIME CELESTIAL EPHEMERIS
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100 tracking-tight">
              {currentLang === 'kn' ? 'ನೈಜ ಕಾಲಮಾನದ ಗೋಚಾರ ಕುಂಡಲಿ (Gochar Transit Kundali)' : 'Live Celestial Transit Kundali (Gochar Chart)'}
            </h3>
          </div>
        </div>

        {/* North / South Indian Toggle */}
        <div className="inline-flex rounded-xl border border-amber-500/40 p-0.5 bg-stone-900/90 text-xs font-bold">
          <button
            type="button"
            onClick={() => setChartStyle('north')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              chartStyle === 'north'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            North Indian (Diamond)
          </button>
          <button
            type="button"
            onClick={() => setChartStyle('south')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              chartStyle === 'south'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-amber-200'
            }`}
          >
            South Indian (Square)
          </button>
        </div>
      </div>

      {/* Comprehensive Transit Alerts Educational Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1 pb-2">
        
        {/* 1. What is Gochar */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[11px]">೧</span>
            <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಎಂದರೇನು? (What is Transit?)' : currentLang === 'hi' ? 'गोचर क्या है? (What is Transit?)' : '1. What is Transit (Gochar)?'}</span>
          </div>
          <p className="text-[11.5px] text-amber-100/90 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಜನನ ಕಾಲದ ಸ್ಥಿರ ನಕ್ಷತ್ರ-ರಾಶಿಗಳ ಮೇಲೆ ಪ್ರಸ್ತುತ ಆಕಾಶದಲ್ಲಿ ಸದಾ ಚಲಿಸುವ ನವಗ್ರಹಗಳ ನೈಜ ಕಾಲಮಾನದ ಸಂಚಾರವೇ "ಗೋಚಾರ" (Planetary Transit).'
              : currentLang === 'hi'
              ? 'जन्म समय के स्थिर ग्रहों के सापेक्ष वर्तमान आकाश में नवग्रहों के गतिशील भ्रमण को गोचर कहा जाता है।'
              : 'Gochar refers to the live, real-time movement of the 9 Grahas through the 12 zodiac signs and 27 Nakshatras relative to your natal birth chart.'}
          </p>
        </div>

        {/* 2. Why do we refer this */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[11px]">೨</span>
            <span>{currentLang === 'kn' ? 'ಏಕೆ ಪರಿಶೀಲಿಸಬೇಕು? (Why Refer This?)' : currentLang === 'hi' ? 'क्यों देखें? (Why Refer This?)' : '2. Why Do We Refer This?'}</span>
          </div>
          <p className="text-[11.5px] text-indigo-100/90 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಜಾತಕವು ಭವಿಷ್ಯದ ಬೀಜವಾದರೆ, ದಶೆ ಫಲ ನೀಡುವ ಋತುಮಾನ. ಆದರೆ ಗೋಚಾರವು ಘಟನೆಯು ನಿಖರವಾಗಿ ಸಂಭವಿಸುವ ಕ್ಷಣವನ್ನು ಪ್ರಚೋದಿಸುವ ಮುಹೂರ್ತ ನಿಯಂತ್ರಕ.'
              : currentLang === 'hi'
              ? 'जन्म कुण्डली कर्म का बीज है, दशा ऋतु है, और गोचर वह तात्कालिक वातावरण है जो घटनाओं को प्रत्यक्ष रूप में फलीभूत करता है।'
              : 'While the birth chart shows potential and Dasha sets the season, Transit acts as the cosmic trigger indicating when circumstances actually manifest.'}
          </p>
        </div>

        {/* 3. When to refer */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-[11px]">೩</span>
            <span>{currentLang === 'kn' ? 'ಯಾವಾಗ ಪರಿಶೀಲಿಸಬೇಕು? (When to Refer?)' : currentLang === 'hi' ? 'कब देखें? (When to Refer?)' : '3. When to Refer Alerts?'}</span>
          </div>
          <p className="text-[11.5px] text-emerald-100/90 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಹೊಸ ಉದ್ಯೋಗ, ವಿವಾಹ, ಆಸ್ತಿ ಖರೀದಿ, ವಿದೇಶ ಯಾನ, ಶನಿ ಸಾಡೇಸಾತಿ, ಕಂಟಕ ಶನಿ, ಗುರು ಬಲ ಹಾಗೂ ರಾಹು-ಕೇತುಗಳ ರಾಶಿ ಬದಲಾವಣೆಯ ಸಮಯದಲ್ಲಿ.'
              : currentLang === 'hi'
              ? 'नवीन कार्य, विवाह, साढ़ेसाती, अष्टम शनि, गुरु गोचर एवं ग्रहण या राहु-केतु राशि परिवर्तन के समय अवश्य देखें।'
              : 'Refer during career pivots, investments, major travels, marriage dates, Sade Sati, Jupiter transit, or sudden planetary shifts.'}
          </p>
        </div>

        {/* 4. For which time Kundali is drawn */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono text-[11px]">೪</span>
            <span>{currentLang === 'kn' ? 'ಯಾವ ಸಮಯಕ್ಕೆ ರಚಿಸಲಾಗಿದೆ? (For Which Time?)' : currentLang === 'hi' ? 'किस समय की कुण्डली है?' : '4. For Which Time Drawn?'}</span>
          </div>
          <p className="text-[11.5px] text-rose-100/90 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಪ್ರಸ್ತುತ ಈ ನಿಮಿಷದ ನೈಜ ಸೌರ-ಖಗೋಳೀಯ ಸ್ಥಿತಿ (Live Sidereal Ephemeris). ಪ್ರಸ್ತುತ ಕ್ಷಣದ ಗ್ರಹಗಳನ್ನು ನಿಮ್ಮ ಜನನ ಲಗ್ನ ಭಾವಗಳ ಮೇಲೆ ಅಳವಡಿಸಿ ತೋರಿಸಲಾಗಿದೆ.'
              : currentLang === 'hi'
              ? 'यह कुण्डली वर्तमान इसी क्षण के वास्तविक ग्रहीय वेध के आधार पर आपके जन्म लग्न भावों में स्थापित करके बनाई गई है।'
              : 'Calculated for the precise live astronomical present moment (Sidereal Lahiri Ayanamsha) mapped into your natal Lagna Bhavas.'}
          </p>
        </div>

        {/* 5. How it helps */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1.5 shadow-md md:col-span-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-[11px]">೫</span>
            <span>{currentLang === 'kn' ? 'ಇದು ಹೇಗೆ ಉಪಯುಕ್ತ? (How Does it Help?)' : currentLang === 'hi' ? 'यह कैसे सहायक है?' : '5. How Does it Help You?'}</span>
          </div>
          <p className="text-[11.5px] text-purple-100/90 leading-relaxed">
            {currentLang === 'kn'
              ? 'ಅಶುಭ ಗ್ರಹ ಸಂಚಾರದ (ಉದಾ: ಅಷ್ಟಮ ಶನಿ ಅಥವಾ ೬/೮/೧೨ ರ ಗೋಚಾರ) ಕ್ಲಿಷ್ಟ ಪರಿಣಾಮಗಳನ್ನು ಮುಂಚಿತವಾಗಿಯೇ ಅರಿತು, ಶಾಂತಿ-ಪರಿಹಾರ, ಮಂತ್ರ ಜಪ ಮತ್ತು ಧ್ಯಾನದ ಮೂಲಕ ಸಂಕಷ್ಟಗಳನ್ನು ನಿವಾರಿಸಲು ಹಾಗೂ ಶುಭ ಗುರು-ಶುಕ್ರ ಬಲದ ಸಮಯದಲ್ಲಿ ಸತ್ಕಾರ್ಯಗಳನ್ನು ಮಾಡಲು ನೆರವಾಗುತ್ತದೆ.'
              : currentLang === 'hi'
              ? 'प्रतिकूल गोचरों के प्रभाव को पूर्व में ही जानकर उचित वैदिक उपाय, दान एवं मन्त्र साधना से शान्ति पाना तथा अनुकूल समय का अधिकतम लाभ उठाना संभव होता है।'
              : 'Empowers you to anticipate astrological headwinds (e.g. 8th house Saturn, Rahu afflictions) and apply proactive Vedic upayas, while capitalizing on favorable Jupiter/Venus transits for peak success.'}
          </p>
        </div>

      </div>

      <p className="text-xs text-amber-200/80 leading-relaxed pt-1">
        {currentLang === 'kn'
          ? 'ಪ್ರಸ್ತುತ ಆಕಾಶದಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿರುವ ನವಗ್ರಹಗಳು ನಿಮ್ಮ ಲಗ್ನ ಭಾವಗಳಲ್ಲಿ ನೈಜ ಗೋಳಾಕಾರದ (Realistic 3D Spheres) ರೂಪದಲ್ಲಿ ತೇಲುತ್ತಿವೆ. ಗ್ರಹದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಅದರ ಪ್ರಭಾವವನ್ನು ವೀಕ್ಷಿಸಿ.'
          : 'Transiting Grahas rendered in realistic celestial spherical shapes inside each natal Lagna house. Tap any planetary sphere to view exact degree and transit influence.'}
      </p>

      {/* Chart Canvas: Starfield Space Backdrop */}
      <div className="relative rounded-2xl overflow-hidden p-3 sm:p-5 bg-[#050811] border border-amber-500/40 shadow-inner flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* Starfield ambient lights */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. NORTH INDIAN DIAMOND KUNDALI */}
        {chartStyle === 'north' ? (
          <div className="relative w-full aspect-square max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] bg-stone-950/80 rounded-2xl border-2 border-amber-500/80 shadow-2xl p-2 select-none">
            {/* SVG Lines */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
              <rect x="0" y="0" width="500" height="500" fill="none" stroke="#d97706" strokeWidth="2.5" />
              <line x1="0" y1="0" x2="500" y2="500" stroke="#b45309" strokeWidth="1.8" />
              <line x1="500" y1="0" x2="0" y2="500" stroke="#b45309" strokeWidth="1.8" />
              <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>

            {/* 12 Houses with Floating Realistic Grahas */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              
              {/* House 1: Lagna */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '25%', maxWidth: '140px' }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-950/90 px-1.5 py-0.2 rounded-full border border-amber-500/40">
                    {currentLang === 'kn' ? 'ಲಗ್ನ' : 'LAGNA'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-200">
                    {getHouseRashiNumber(1)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <RealisticGraha name="Lagna" currentLang={currentLang} size="sm" />
                  {getPlanetsInHouse(1).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 2 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '25%', top: '10%', maxWidth: '95px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(2)}</span>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {getPlanetsInHouse(2).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 3 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '9%', top: '25%', maxWidth: '65px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(3)}</span>
                <div className="flex flex-col items-center justify-center gap-1">
                  {getPlanetsInHouse(3).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 4 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '25%', top: '50%', maxWidth: '140px' }}
              >
                <span className="text-[10px] font-bold text-amber-400 mb-1">{getHouseRashiNumber(4)}</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {getPlanetsInHouse(4).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 5 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '9%', top: '75%', maxWidth: '65px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(5)}</span>
                <div className="flex flex-col items-center justify-center gap-1">
                  {getPlanetsInHouse(5).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 6 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '25%', top: '90%', maxWidth: '95px' }}
              >
                <div className="flex flex-wrap items-center justify-center gap-1 mb-0.5">
                  {getPlanetsInHouse(6).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-amber-400">{getHouseRashiNumber(6)}</span>
              </div>

              {/* House 7 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '75%', maxWidth: '140px' }}
              >
                <span className="text-[10px] font-bold text-amber-400 mb-1">{getHouseRashiNumber(7)}</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {getPlanetsInHouse(7).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 8 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '75%', top: '90%', maxWidth: '95px' }}
              >
                <div className="flex flex-wrap items-center justify-center gap-1 mb-0.5">
                  {getPlanetsInHouse(8).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-amber-400">{getHouseRashiNumber(8)}</span>
              </div>

              {/* House 9 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '91%', top: '75%', maxWidth: '65px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(9)}</span>
                <div className="flex flex-col items-center justify-center gap-1">
                  {getPlanetsInHouse(9).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 10 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '75%', top: '50%', maxWidth: '140px' }}
              >
                <span className="text-[10px] font-bold text-amber-400 mb-1">{getHouseRashiNumber(10)}</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {getPlanetsInHouse(10).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 11 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '91%', top: '25%', maxWidth: '65px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(11)}</span>
                <div className="flex flex-col items-center justify-center gap-1">
                  {getPlanetsInHouse(11).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* House 12 */}
              <div 
                className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: '75%', top: '10%', maxWidth: '95px' }}
              >
                <span className="text-[9px] font-bold text-amber-400 mb-0.5">{getHouseRashiNumber(12)}</span>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {getPlanetsInHouse(12).map(p => (
                    <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                      <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* 2. SOUTH INDIAN SQUARE ZODIAC KUNDALI */
          <div className="relative w-full aspect-square max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] bg-stone-950/90 rounded-2xl border-2 border-amber-500/80 shadow-2xl p-2">
            <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-stone-900/60 border border-amber-500/40 rounded-xl">
              {/* 12 Fixed Signs clockwise from Meena */}
              {[11, 0, 1, 2, 10, -1, -2, 3, 9, -3, -4, 4, 8, 7, 6, 5].map((signIdx, cellIdx) => {
                if (signIdx < 0) {
                  // Center cell
                  if (signIdx === -1) {
                    return (
                      <div key={cellIdx} className="col-span-2 row-span-2 p-3 border border-amber-500/30 rounded-xl bg-stone-950/80 flex flex-col items-center justify-center text-center shadow-inner">
                        <span className="text-sm font-serif font-bold text-amber-300">
                          {currentLang === 'kn' ? 'ಗೋಚಾರ ಗ್ರಹ ಕುಂಡಲಿ' : 'Gochar Transit Kundali'}
                        </span>
                        <span className="text-[10px] text-amber-200/80 mt-1">
                          Lagna: {kundaliData.houses[0].rashiName[currentLang]}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }

                // Sign cell
                const houseNum = ((signIdx - lagnaRashiIdx + 12) % 12) + 1;
                const isLagnaHouse = signIdx === lagnaRashiIdx;
                const planets = transitPlanets.filter(p => p.rashiIndex === signIdx);

                return (
                  <div 
                    key={cellIdx}
                    className="p-1 border border-amber-500/30 rounded-lg bg-stone-900/80 flex flex-col justify-between overflow-hidden shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-0.5">
                      <span className="text-[9px] font-bold text-amber-300 truncate max-w-[70%]">
                        {RASHI_NAMES[signIdx][currentLang].split(' ')[0]}
                      </span>
                      <span className="text-[8.5px] font-mono text-stone-400">
                        H{houseNum}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1 my-auto py-1">
                      {isLagnaHouse && <RealisticGraha name="Lagna" currentLang={currentLang} size="sm" />}
                      {planets.map(p => (
                        <div key={p.name} onClick={() => setSelectedPlanet(p)}>
                          <RealisticGraha name={p.name} isRetrograde={p.isRetrograde} currentLang={currentLang} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Planet Details Panel */}
        <div className="w-full lg:w-72 bg-stone-900/90 rounded-2xl border border-amber-500/40 p-4 space-y-3 shrink-0 shadow-xl">
          <div className="flex items-center gap-2 border-b border-amber-500/30 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif font-bold text-sm text-amber-200">
              {currentLang === 'kn' ? 'ಗ್ರಹ ಸಂಚಾರ ವಿವರಣೆ' : 'Planet Transit Insight'}
            </h4>
          </div>

          {selectedPlanet ? (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <RealisticGraha name={selectedPlanet.name} currentLang={currentLang} size="md" isRetrograde={selectedPlanet.isRetrograde} />
                <div>
                  <h5 className="font-bold text-sm text-white">
                    {selectedPlanet.sanskritName[currentLang]} ({selectedPlanet.name})
                  </h5>
                  <p className="text-[11px] text-amber-300">
                    {selectedPlanet.rashiName[currentLang]} • {selectedPlanet.degrees}°
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-300 block">
                  House {selectedPlanet.houseFromLagna} from Natal Lagna:
                </span>
                <p className="text-[11.5px] text-stone-300 leading-relaxed">
                  {selectedPlanet.transitEffect[currentLang]}
                </p>
              </div>

              <div className="text-[10px] text-stone-400">
                Status: {selectedPlanet.isRetrograde ? '⚡ Retrograde (ವಕ್ರ)' : 'Direct (ಮಾರ್ಗಿ)'}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-stone-400 space-y-1">
              <Info className="w-6 h-6 text-amber-400/60 mx-auto mb-1" />
              <p>Click on any glowing planetary orb in the Kundali to view its transit impact on your Natal Lagna.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
