import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Info,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { KundaliData, Language } from '../types';
import { analyzeKaalSarpaDosha, TWELVE_KAAL_SARPA_TYPES } from '../utils/kaalSarpaDosha';
import { SvgGrahaIcon } from './RealisticGraha';

interface KaalSarpaDoshaSectionProps {
  currentLang: Language;
  kundaliData: KundaliData;
}

export const KaalSarpaDoshaSection: React.FC<KaalSarpaDoshaSectionProps> = ({
  currentLang,
  kundaliData
}) => {
  const [showAllTwelveTypes, setShowAllTwelveTypes] = useState(false);

  const analysis = useMemo(() => analyzeKaalSarpaDosha(kundaliData), [kundaliData]);

  // SVG circular axis visualization helper (0° Aries at top, clockwise)
  const cx = 130;
  const cy = 130;
  const radius = 92;
  const degToPt = (deg: number, r: number = radius) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const rahuPt = degToPt(analysis.rahuLong, radius);
  const ketuPt = degToPt(analysis.ketuLong, radius);

  const badgeTone =
    analysis.status === 'complete'
      ? 'bg-rose-600 text-white border-rose-400'
      : analysis.status === 'partial'
      ? 'bg-amber-600 text-white border-amber-400'
      : 'bg-emerald-600 text-white border-emerald-400';

  const containerBorder =
    analysis.status === 'complete'
      ? 'border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/70 dark:from-stone-900 dark:via-stone-900 dark:to-rose-950/20'
      : analysis.status === 'partial'
      ? 'border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/20'
      : 'border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/20';

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border-2 shadow-xl space-y-5 page-break-inside-avoid ${containerBorder}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
            analysis.status === 'none'
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
              : 'bg-gradient-to-tr from-rose-600 to-amber-600 text-white'
          }`}>
            {analysis.status === 'none' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300">
                {currentLang === 'kn' ? 'ಕಾಲಸರ್ಪ ದೋಷ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'कालसर्प दोष विश्लेषण' : 'KAAL SARPA DOSHA ANALYSIS'}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeTone}`}>
                {analysis.status === 'complete'
                  ? (currentLang === 'kn' ? 'ಪೂರ್ಣ ಕಾಲಸರ್ಪ ಯೋಗ' : currentLang === 'hi' ? 'पूर्ण कालसर्प योग' : 'Complete Kaal Sarpa')
                  : analysis.status === 'partial'
                  ? (currentLang === 'kn' ? 'ಆಂಶಿಕ ಕಾಲಸರ್ಪ ಯೋಗ' : currentLang === 'hi' ? 'आंशिक कालसर्प योग' : 'Partial (Anshik) Kaal Sarpa')
                  : (currentLang === 'kn' ? 'ಕಾಲಸರ್ಪ ದೋಷವಿಲ್ಲ' : currentLang === 'hi' ? 'कालसर्प दोष नहीं' : 'No Kaal Sarpa Dosha')}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100 mt-1">
              {currentLang === 'kn'
                ? 'ಕಾಲಸರ್ಪ ದೋಷ: ಗ್ರಹ-ನಕ್ಷತ್ರ-ಭಾವ ಸಂಯೋಜನೆ ಮತ್ತು ಪ್ರಭಾವ'
                : currentLang === 'hi'
                ? 'कालसर्प दोष: ग्रह-नक्षत्र-भाव संयोग एवं प्रभाव'
                : 'Kaal Sarpa Dosha: Graha, Nakshatra & House Combination Analysis'}
            </h3>
          </div>
        </div>
      </div>

      {/* Live Verdict Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
          {analysis.summary[currentLang]}
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          {currentLang === 'kn'
            ? 'ಕಾಲಸರ್ಪ ದೋಷ ಎಂದರೇನು? ಜನ್ಮ ಲಗ್ನ ಕುಂಡಲಿಯಲ್ಲಿ ಸೂರ್ಯ, ಚಂದ್ರ, ಮಂಗಳ, ಬುಧ, ಗುರು, ಶುಕ್ರ ಮತ್ತು ಶನಿ ಎಂಬ ಎಲ್ಲಾ ೭ ಪ್ರಮುಖ ಗ್ರಹಗಳು ರಾಹು (ಸರ್ಪದ ತಲೆ) ಮತ್ತು ಕೇತು (ಸರ್ಪದ ಬಾಲ) ನಡುವಿನ ೧೮೦° ಒಂದೇ ಅರ್ಧಗೋಳದಲ್ಲಿ ಬಂಧಿತವಾದಾಗ "ಕಾಲಸರ್ಪ ದೋಷ" ಉಂಟಾಗುತ್ತದೆ. ರಾಹು-ಕೇತು ಇರುವ ಭಾವದ ಜೋಡಿ (೧-೭ ರಿಂದ ೧೨-೬) ಪ್ರಕಾರ ೧೨ ಬಗೆಯ ಕಾಲಸರ್ಪ ಯೋಗಗಳನ್ನು ಗುರುತಿಸಲಾಗುತ್ತದೆ.'
            : currentLang === 'hi'
            ? 'कालसर्प दोष क्या है? जब जन्म लग्न कुण्डली में सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र और शनि — सभी ७ प्रमुख ग्रह राहु (सर्प मुख) और केतु (सर्प पुच्छ) के १८०° अक्ष के एक ही तरफ आ जाते हैं, तब कालसर्प दोष बनता है। राहु-केतु के भाव संयोग (१-७ से १२-६) से १२ प्रकार के कालसर्प योग निर्धारित होते हैं।'
            : 'What is Kaal Sarpa Dosha? In Vedic Jyotisha, when all 7 classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, and Saturn) are hemmed strictly on one 180° side of the Rahu (Serpent Head) – Ketu (Serpent Tail) lunar nodal axis in the Lagna Kundali, Kaal Sarpa Dosha is formed. The exact Rahu–Ketu house axis (1–7 through 12–6) determines which of the 12 classical Kaal Sarpa Yogas applies.'}
        </p>
      </div>

      {/* Visual Axis + Rahu/Ketu & Nakshatra Combination Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Exact Nodal Axis Hemisphere Diagram */}
        <div className="md:col-span-5 flex flex-col items-center bg-stone-950 rounded-2xl p-4 border border-amber-500/30 text-white shadow-inner">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold mb-1">
            {currentLang === 'kn' ? 'ರಾಹು – ಕೇತು ಅಕ್ಷ ಮತ್ತು ೭ ಗ್ರಹಗಳ ವಿತರಣೆ' : 'Rahu – Ketu Axis & 7-Graha Distribution'}
          </span>
          <svg viewBox="0 0 260 260" className="w-full max-w-[240px] h-auto">
            {/* Outer Zodiac Ring */}
            <circle cx={cx} cy={cy} r={radius + 14} fill="none" stroke="#334155" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={radius} fill="#0f172a" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* 12 Rashi ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const p1 = degToPt(i * 30, radius);
              const p2 = degToPt(i * 30, radius + 14);
              return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#475569" strokeWidth="1" />;
            })}

            {/* Rahu - Ketu Dividing Chord */}
            <line
              x1={rahuPt.x}
              y1={rahuPt.y}
              x2={ketuPt.x}
              y2={ketuPt.y}
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* 7 Planets plotted at exact sidereal ecliptic longitudes */}
            {analysis.allSevenPlanets.map((item, idx) => {
              // Stagger radius slightly when planets are very close so dots never collide
              const closeBefore = analysis.allSevenPlanets
                .slice(0, idx)
                .filter(prev => {
                  const diff = Math.abs(prev.exactLong - item.exactLong);
                  return Math.min(diff, 360 - diff) < 12;
                }).length;
              const rPlot = radius - 14 - closeBefore * 14;
              const pt = degToPt(item.exactLong, Math.max(26, rPlot));
              const fillColor = item.arcSide === 'rahu-to-ketu' ? '#38bdf8' : '#fbbf24';
              return (
                <g key={item.planet.name}>
                  <circle cx={pt.x} cy={pt.y} r="7" fill={fillColor} stroke="#020617" strokeWidth="1.5" />
                  <text
                    x={pt.x}
                    y={pt.y + 2.5}
                    fontSize="7"
                    fontWeight="bold"
                    fill="#020617"
                    textAnchor="middle"
                  >
                    {item.planet.name.slice(0, 2)}
                  </text>
                </g>
              );
            })}

            {/* Rahu Marker */}
            <circle cx={rahuPt.x} cy={rahuPt.y} r="10" fill="#0f766e" stroke="#5eead4" strokeWidth="2" />
            <text x={rahuPt.x} y={rahuPt.y + 3} fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              Ra
            </text>

            {/* Ketu Marker */}
            <circle cx={ketuPt.x} cy={ketuPt.y} r="10" fill="#78716c" stroke="#fda4af" strokeWidth="2" />
            <text x={ketuPt.x} y={ketuPt.y + 3} fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              Ke
            </text>
          </svg>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] mt-1">
            <span className="flex items-center gap-1 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              {currentLang === 'kn' ? `ರಾಹು→ಕೇತು (${analysis.planetsOnRahuToKetu.length})` : `Rahu→Ketu (${analysis.planetsOnRahuToKetu.length})`}
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              {currentLang === 'kn' ? `ಕೇತು→ರಾಹು (${analysis.planetsOnKetuToRahu.length})` : `Ketu→Rahu (${analysis.planetsOnKetuToRahu.length})`}
            </span>
          </div>
        </div>

        {/* Right: Exact Graha, Nakshatra & House Combination Details */}
        <div className="md:col-span-7 space-y-3">
          {/* Rahu & Ketu Axis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-teal-300/70 dark:border-teal-800 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <SvgGrahaIcon name="Rahu" size={24} isRetrograde={true} />
                <div>
                  <div className="text-xs font-extrabold text-teal-800 dark:text-teal-300">
                    {currentLang === 'kn' ? 'ರಾಹು (ಸರ್ಪ ಮುಖ)' : currentLang === 'hi' ? 'राहु (सर्प मुख)' : 'Rahu (Serpent Head)'}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300">
                    {currentLang === 'kn' ? `ಭಾವ #${analysis.rahu.bhava}` : `House #${analysis.rahu.bhava}`} • {analysis.rahu.rashiName[currentLang]} ({analysis.rahu.degrees}°)
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                <strong>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ & ಪಾದ:' : 'Nakshatra & Pada:'}</strong>{' '}
                {analysis.rahuNakshatra[currentLang]} (P{analysis.rahu.pada} • {analysis.rahuAkshara[currentLang]})
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-300 dark:border-stone-700 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <SvgGrahaIcon name="Ketu" size={24} isRetrograde={true} />
                <div>
                  <div className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                    {currentLang === 'kn' ? 'ಕೇತು (ಸರ್ಪ ಪುಚ್ಛ)' : currentLang === 'hi' ? 'केतु (सर्प पुच्छ)' : 'Ketu (Serpent Tail)'}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300">
                    {currentLang === 'kn' ? `ಭಾವ #${analysis.ketu.bhava}` : `House #${analysis.ketu.bhava}`} • {analysis.ketu.rashiName[currentLang]} ({analysis.ketu.degrees}°)
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                <strong>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ & ಪಾದ:' : 'Nakshatra & Pada:'}</strong>{' '}
                {analysis.ketuNakshatra[currentLang]} (P{analysis.ketu.pada} • {analysis.ketuAkshara[currentLang]})
              </div>
            </div>
          </div>

          {/* Matching House Axis Yoga & Effects */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300/70 dark:border-stone-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-serif font-bold text-sm sm:text-base text-amber-900 dark:text-amber-300">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn'
                    ? `ನಿಮ್ಮ ಕುಂಡಲಿಯ ರಾಹು-ಕೇತು ಅಕ್ಷ (${analysis.rahu.bhava}-${analysis.ketu.bhava}): ${analysis.matchingType.name.kn}`
                    : currentLang === 'hi'
                    ? `आपकी कुण्डली का राहु-केतु अक्ष (${analysis.rahu.bhava}-${analysis.ketu.bhava}): ${analysis.matchingType.name.hi}`
                    : `Your Chart's Rahu–Ketu Axis (H${analysis.rahu.bhava}–H${analysis.ketu.bhava}): ${analysis.matchingType.name.en}`}
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong>{currentLang === 'kn' ? 'ಭಾವ ಸಂಯೋಜನೆಯ ಪ್ರಭಾವ:' : currentLang === 'hi' ? 'भाव संयोग का प्रभाव:' : 'Axis Effects:'}</strong>{' '}
              {analysis.matchingType.effects[currentLang]}
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>{currentLang === 'kn' ? 'ವೈದಿಕ ಶಾಂತಿ ಪರಿಹಾರ:' : currentLang === 'hi' ? 'वैदिक शांति उपाय:' : 'Vedic Shanti Remedy:'}</strong>{' '}
                {analysis.matchingType.remedies[currentLang]}
              </div>
            </div>
          </div>

          {/* Nakshatra Trigger Explanation (Rahu & Ketu Ruled Nakshatras) */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/25 border border-indigo-200 dark:border-indigo-900/50 text-xs space-y-1.5">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {currentLang === 'kn'
                  ? 'ನಕ್ಷತ್ರ ಸಂಯೋಜನೆ (ರಾಹು-ಕೇತು ಅಧಿಪತ್ಯದ ನಕ್ಷತ್ರಗಳು)'
                  : currentLang === 'hi'
                  ? 'नक्षत्र संयोग (राहु-केतु स्वामी नक्षत्र)'
                  : 'Nakshatra Triggers (Rahu & Ketu Ruled Nakshatras)'}
              </span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {currentLang === 'kn'
                ? 'ರಾಹು ನಕ್ಷತ್ರಗಳು: ಆರ್ದ್ರಾ, ಸ್ವಾತಿ, ಶತಭಿಷಾ • ಕೇತು ನಕ್ಷತ್ರಗಳು: ಅಶ್ವಿನಿ, ಮಘಾ, ಮೂಲಾ. ಈ ನಕ್ಷತ್ರಗಳಲ್ಲಿ ಗ್ರಹಗಳು ಸ್ಥಿತವಾದಾಗ ರಾಹು-ಕೇತು ದಶಾ/ಭುಕ್ತಿ ಕಾಲದಲ್ಲಿ ಕಾಲಸರ್ಪ ಪ್ರಭಾವ ಹೆಚ್ಚಾಗಿ ಅನುಭವಕ್ಕೆ ಬರುತ್ತದೆ.'
                : currentLang === 'hi'
                ? 'राहु नक्षत्र: आर्द्रा, स्वाति, शतभिषा • केतु नक्षत्र: अश्विनी, मघा, मूल। इन नक्षत्रों में स्थित ग्रह राहु-केतु दशा में कालसर्प प्रभाव को सक्रिय करते हैं।'
                : 'Rahu Nakshatras: Ardra, Swati, Shatabhisha • Ketu Nakshatras: Ashwini, Magha, Moola. Planets occupying these Nakshatras amplify nodal karma during Rahu/Ketu Dasha periods.'}
            </p>
            {analysis.nodeNakshatraPlanets.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.nodeNakshatraPlanets.map(item => (
                  <span
                    key={item.planet.name}
                    className="px-2 py-0.5 rounded-lg bg-white dark:bg-stone-800 border border-indigo-300 dark:border-indigo-700 text-[11px] font-bold text-indigo-900 dark:text-indigo-200"
                  >
                    {item.planet.sanskritName[currentLang]} • {item.nakshatraName[currentLang]} (H{item.planet.bhava})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                {currentLang === 'kn'
                  ? 'ನಿಮ್ಮ ಕುಂಡಲಿಯಲ್ಲಿ ಯಾವುದೇ ಪ್ರಮುಖ ಗ್ರಹವು ರಾಹು-ಕೇತು ನಕ್ಷತ್ರದಲ್ಲಿ ಬಂಧಿತವಾಗಿಲ್ಲ.'
                  : 'None of the 7 classical planets occupy Rahu/Ketu-ruled Nakshatras in this chart.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Reference: All 12 Classical Kaal Sarpa Combinations */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
        <button
          type="button"
          onClick={() => setShowAllTwelveTypes(prev => !prev)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-amber-200 font-bold text-xs flex items-center justify-between sm:justify-center gap-2 cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {showAllTwelveTypes
                ? (currentLang === 'kn' ? '೧೨ ಬಗೆಯ ಕಾಲಸರ್ಪ ಯೋಗಗಳ ಪಟ್ಟಿ ಮುಚ್ಚಿ' : currentLang === 'hi' ? '१२ कालसर्प योग सूची बंद करें' : 'Hide 12 Classical Kaal Sarpa Types')
                : (currentLang === 'kn' ? '೧೨ ಬಗೆಯ ಕಾಲಸರ್ಪ ಯೋಗಗಳು (ಭಾವ ಸಂಯೋಜನೆ & ಫಲಗಳು) ವೀಕ್ಷಿಸಿ' : currentLang === 'hi' ? '१२ कालसर्प योग (भाव संयोग व फल) देखें' : 'View All 12 Classical Kaal Sarpa House Combinations & Effects')}
            </span>
          </span>
          {showAllTwelveTypes ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
        </button>

        {showAllTwelveTypes && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in">
            {TWELVE_KAAL_SARPA_TYPES.map((t) => {
              const isChartAxis = t.rahuHouse === analysis.rahu.bhava && t.ketuHouse === analysis.ketu.bhava;
              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    isChartAxis
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                      {t.name[currentLang]}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                      Ra H{t.rahuHouse} • Ke H{t.ketuHouse}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                    {t.effects[currentLang]}
                  </p>
                  <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-medium pt-1 border-t border-stone-100 dark:border-stone-800">
                    <strong>{currentLang === 'kn' ? 'ಪರಿಹಾರ:' : 'Remedy:'}</strong> {t.remedies[currentLang]}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
