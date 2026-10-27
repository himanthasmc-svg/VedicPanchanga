import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import {
  Sparkles,
  Activity,
  Layers,
  Clock,
  TrendingUp,
  Heart,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  RefreshCw,
  Zap,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Language, KundaliData } from '../types';
import { VimshottariDashaResult, MahadashaPeriod } from '../utils/vimshottariDasha';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { SvgGrahaIcon } from './RealisticGraha';

export interface DashaDashboardProps {
  currentLang: Language;
  vimshottariDasha: VimshottariDashaResult;
  planetaryBalas?: PlanetaryBalaBreakdown[];
  kundaliData: KundaliData;
  janmaVivara?: any;
}

// 120-Year Vimshottari Cycle Constant Data
const DASHA_CYCLE_TOTAL_YEARS = 120;

export const DashaDashboard: React.FC<DashaDashboardProps> = ({
  currentLang,
  vimshottariDasha,
  planetaryBalas = [],
  kundaliData,
  janmaVivara
}) => {
  const [selectedMahadashaIndex, setSelectedMahadashaIndex] = useState<number | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiInsightVersion, setAiInsightVersion] = useState<number>(1);

  // Map planetary balas by planet name for rapid lookup
  const balaMap = useMemo(() => {
    return new Map(planetaryBalas.map(b => [b.planet.name, b]));
  }, [planetaryBalas]);

  // Current Mahadasha and Antardasha lords
  const currentMaha = vimshottariDasha.currentMahadasha;
  const currentAntar = vimshottariDasha.currentAntardasha;

  // Active lords' names and planets
  const mahaPlanetName = currentMaha.lord.rulingPlanet || currentMaha.lord.name;
  const antarPlanetName = currentAntar.lord.rulingPlanet || currentAntar.lord.name;

  // Find their placements in Kundali
  const mahaKundaliPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === mahaPlanetName.toLowerCase());
  const antarKundaliPlanet = kundaliData.planets.find(p => p.name.toLowerCase() === antarPlanetName.toLowerCase());

  // Balas
  const mahaBala = balaMap.get(mahaPlanetName) || balaMap.get(currentMaha.lord.name);
  const antarBala = balaMap.get(antarPlanetName) || balaMap.get(currentAntar.lord.name);

  const mahaBhava = mahaKundaliPlanet?.bhava || 1;
  const antarBhava = antarKundaliPlanet?.bhava || 1;

  // Prepare Pie Chart data (120 years distribution)
  const pieChartData = useMemo(() => {
    return vimshottariDasha.mahadashas.map(m => {
      const isCurrent = m.isCurrent;
      const percentage = ((m.durationYears / DASHA_CYCLE_TOTAL_YEARS) * 100).toFixed(1);

      return {
        name: m.lord.name,
        sanskrit: m.lord.sanskrit[currentLang],
        years: m.durationYears,
        percentage: Number(percentage),
        color: m.lord.color || '#9333ea',
        isCurrent,
        startDate: m.startDate.toISOString().split('T')[0],
        endDate: m.endDate.toISOString().split('T')[0]
      };
    });
  }, [vimshottariDasha, currentLang]);

  // Handle AI reading re-synthesis
  const handleRegenerateAi = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiInsightVersion(v => v + 1);
    }, 600);
  };

  // AI-Powered Personalized Interpretation computed dynamically from planetary strength and house placements
  const aiInterpretation = useMemo(() => {
    const mScore = mahaBala?.totalScore || 65;
    const aScore = antarBala?.totalScore || 60;
    const isMahaStrong = mScore >= 70;
    const isAntarStrong = aScore >= 65;

    // Kendra / Trikona checks
    const isMahaKendraTrikona = [1, 4, 5, 7, 9, 10].includes(mahaBhava);
    const isAntarKendraTrikona = [1, 4, 5, 7, 9, 10].includes(antarBhava);

    let careerTitleKn = '';
    let careerTitleEn = '';
    let careerDescKn = '';
    let careerDescEn = '';

    if (isMahaStrong && isMahaKendraTrikona) {
      careerTitleKn = `${currentMaha.lord.sanskrit[currentLang]} ಮಹಾದಶೆಯಲ್ಲಿ ಶ್ರೇಷ್ಠ ಉದ್ಯೋಗ ಪ್ರಗತಿ & ನಾಯಕತ್ವ ಯೋಗ`;
      careerTitleEn = `Peak Professional Advancement & Authority under Strong ${currentMaha.lord.name} Period`;
      careerDescKn = `ಮಹಾದಶಾ ನಾಯಕ ${currentMaha.lord.sanskrit[currentLang]} ಗ್ರಹವು ಕುಂಡಲಿಯ ${mahaBhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ${mScore}/100 ಅತ್ಯುನ್ನತ ಬಲವನ್ನು ಹೊಂದಿದೆ. ಇದು ಅಧಿಕಾರ ಪ್ರಾಪ್ತಿ, ವ್ಯಾಪಾರ ವಿಸ್ತರಣೆ, ಸರ್ಕಾರಿ ಗೌರವ ಮತ್ತು ಸ್ಥಿರ ಧನಾಗಮನಕ್ಕೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾಗಿದೆ. ಅಂತರ್ದಶಾ ನಾಯಕ ${currentAntar.lord.sanskrit[currentLang]}ನ ಸಹಯೋಗದಿಂದ ಹೊಸ ಯೋಜನೆಗಳು ಸುಲಭವಾಗಿ ಈಡೇರುತ್ತವೆ.`;
      careerDescEn = `Mahadasha lord ${currentMaha.lord.name} occupies House #${mahaBhava} with robust planetary strength (${mScore}/100). This aligns auspiciously for career promotions, commercial expansion, and financial consolidation. The current sub-period of ${currentAntar.lord.name} in House #${antarBhava} accelerates momentum.`;
    } else if (!isMahaStrong) {
      careerTitleKn = `${currentMaha.lord.sanskrit[currentLang]} ದಶೆಯಲ್ಲಿ ಜಾಗರೂಕತೆಯ ಕಾರ್ಯತಂತ್ರ ಅಗತ್ಯ`;
      careerTitleEn = `Strategic Caution & Calculated Moves under ${currentMaha.lord.name} Period`;
      careerDescKn = `ದಶಾಧಿಪತಿ ${currentMaha.lord.sanskrit[currentLang]}ನ ಬಲವು ಸಾಧಾರಣವಾಗಿದ್ದು (${mScore}/100), ${mahaBhava}ನೇ ಭಾವದಲ್ಲಿದ್ದಾನೆ. ಆತುರದ ಹೂಡಿಕೆ ಅಥವಾ ಉದ್ಯೋಗ ಬದಲಾವಣೆಗೆ ಇದು ಸಕಾಲವಲ್ಲ. ಸ್ಥಿರ ಪರಿಶ್ರಮ ಮತ್ತು ಶಾಂತಿ ಪರಿಹಾರಗಳಿಂದ ಉಂಟಾಗಬಹುದಾದ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಬಹುದು.`;
      careerDescEn = `Mahadasha lord ${currentMaha.lord.name} operates with moderate strength (${mScore}/100) from House #${mahaBhava}. Avoid speculative investments or hasty career shifts. Disciplined perseverance and planetary pacification will turn obstacles into stepping stones.`;
    } else {
      careerTitleKn = `${currentMaha.lord.sanskrit[currentLang]} ಮಹಾದಶಾ • ಸ್ಥಿರ ಉದ್ಯೋಗ & ಆರ್ಥಿಕ ವೃದ್ಧಿ`;
      careerTitleEn = `Steady Professional Equilibrium & Resource Consolidation`;
      careerDescKn = `ಪ್ರಸ್ತುತ ಮಹಾದಶೆಯು ನಿಮ್ಮ ವೃತ್ತಿಜೀವನದಲ್ಲಿ ಸ್ಥಿರತೆಯನ್ನು ತರುತ್ತದೆ. ${mahaBhava}ನೇ ಭಾವದ ಕಾರಕತ್ವಗಳು ನಿಮ್ಮ ಕರ್ಮಕ್ಷೇತ್ರದಲ್ಲಿ ಹೊಸ ಅವಕಾಶಗಳನ್ನು ತೆರೆಯುತ್ತವೆ.`;
      careerDescEn = `Current period sustains professional stability. House #${mahaBhava} themes are activated, providing steady resource inflows and structured opportunities.`;
    }

    // Health Analysis
    const healthDescKn = isMahaStrong
      ? `ಮಹಾದಶಾಧಿಪತಿ ಬಲಿಷ್ಠವಾಗಿರುವುದರಿಂದ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಉತ್ತಮವಾಗಿರುತ್ತದೆ. ಆದಾಗ್ಯೂ ${currentAntar.lord.sanskrit[currentLang]} ಅಂತರ್ದಶೆಯ ಪ್ರಭಾವದಿಂದ ನಿದ್ರಾ ಚಕ್ರ ಮತ್ತು ಜೀರ್ಣಾಂಗಗಳ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸುವುದು ಉತ್ತಮ.`
      : `ದಶಾಧಿಪತಿಯ ಬಲವು ಕಡಿಮೆಯಿರುವುದರಿಂದ ದೈಹಿಕ ಆಯಾಸ ಮತ್ತು ಮಾನಸಿಕ ಒತ್ತಡ ಉಂಟಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಸಾತ್ವಿಕ ಆಹಾರ, ಪ್ರಾಣಾಯಾಮ ಮತ್ತು ಧ್ಯಾನದಿಂದ ಪ್ರಾಣಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.`;
    const healthDescEn = isMahaStrong
      ? `Robust planetary vitality reinforces physical endurance and immunity. Maintain a balanced daily circadian rhythm during this ${currentAntar.lord.name} sub-cycle.`
      : `Lower planetary strength suggests managing mental fatigue and stress levels proactively. Incorporate pranayama, restful sleep, and sattvic nutrition to protect vitality.`;

    // Relationship Analysis
    const domesticDescKn = isAntarKendraTrikona
      ? `ಕುಟುಂಬದಲ್ಲಿ ಮಂಗಳಕರ ವಾತಾವರಣ, ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಮತ್ತು ದಾಂಪತ್ಯ ಸೌಹಾರ್ದತೆ ಇರುತ್ತದೆ. ಪರಸ್ಪರ ಗೌರವದಿಂದ ಸಂಬಂಧಗಳು ಬಲಗೊಳ್ಳುತ್ತವೆ.`
      : `ದಾಂಪತ್ಯ ಹಾಗೂ ಕುಟುಂಬ ಸಂಬಂಧಗಳಲ್ಲಿ ಸಣ್ಣಪುಟ್ಟ ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳು ಉಂಟಾಗದಂತೆ ಸಂಯಮ ಮತ್ತು ಮೌನವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವುದು ಒಳಿತು.`;
    const domesticDescEn = isAntarKendraTrikona
      ? `Harmonious alignment fostering domestic peace, familial support, and deeper partnership understanding.`
      : `Sub-period calls for heightened patience and mindful communication to avoid misunderstandings in close relationships.`;

    // Spiritual / Karmic evolution
    const spiritualDescKn = `ಈ ದಶಾ ಕಾಲವು ನಿಮ್ಮ ಜನ್ಮ ಕರ್ಮವನ್ನು ಕರಗಿಸಿ ಆಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿಗೆ ದಾರಿ ಮಾಡಿಕೊಡುತ್ತದೆ. ${currentMaha.lord.sanskrit[currentLang]} ಗ್ರಹದ ಮಂತ್ರ ಜಪವು ಮಾನಸಿಕ ಶಾಂತಿ ಕರುಣಿಸುತ್ತದೆ.`;
    const spiritualDescEn = `This planetary epoch catalyzes karmic resolution and higher consciousness. Dedicated mantra sadhana of ${currentMaha.lord.name} dissolves residual obstacles.`;

    return {
      careerTitle: { kn: careerTitleKn, en: careerTitleEn, hi: careerTitleEn },
      careerDesc: { kn: careerDescKn, en: careerDescEn, hi: careerDescEn },
      healthDesc: { kn: healthDescKn, en: healthDescEn, hi: healthDescEn },
      domesticDesc: { kn: domesticDescKn, en: domesticDescEn, hi: domesticDescEn },
      spiritualDesc: { kn: spiritualDescKn, en: spiritualDescEn, hi: spiritualDescEn },
      isMahaStrong,
      isAntarStrong,
      mScore,
      aScore
    };
  }, [currentMaha, currentAntar, mahaBala, antarBala, mahaBhava, antarBhava, currentLang, aiInsightVersion]);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* ========================================================================= */}
      {/* 1. AGGREGATED DASHBOARD HERO BANNER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-7 shadow-2xl border-2 border-purple-500/40 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DASHA DASHBOARD • 120-YEAR VIMSHOTTARI</span>
              </span>
              {janmaVivara && (
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-purple-200">
                  {janmaVivara.dateFormatted} • {janmaVivara.cityName}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>{currentMaha.lord.sanskrit[currentLang]} ಮಹಾದಶಾ</span>
              <span className="text-sm px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE NOW</span>
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
              {currentMaha.lord.generalSignificance[currentLang]}
            </p>
          </div>

          {/* Quick Active Dasha Pill */}
          <div className="bg-black/35 p-4 rounded-2xl border border-white/10 shrink-0 text-xs space-y-2 backdrop-blur-xs min-w-[240px]">
            <div>
              <span className="text-purple-300 font-bold block text-[11px] uppercase tracking-wider">
                Current Sub-Period (ಅಂತರ್ದಶಾ):
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span 
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" 
                  style={{ backgroundColor: currentAntar.lord.color || '#f59e0b' }} 
                />
                <span className="text-base font-bold text-amber-300 font-serif">
                  {currentAntar.lord.sanskrit[currentLang]} ಅಂತರ್ದಶಾ
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-purple-200 pt-1.5 border-t border-white/10 flex justify-between">
              <span>Start: {currentAntar.startDate.toISOString().split('T')[0]}</span>
              <span className="text-amber-300 font-bold">End: {currentAntar.endDate.toISOString().split('T')[0]}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CIRCULAR PIE CHART & LIFETIME HORIZONTAL TIMELINE AGGREGATION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left (5 Cols): Circular Pie Chart of 120-Year Vimshottari Cycle */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-purple-300/80 dark:border-stone-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn' ? '೧೨೦ ವರ್ಷಗಳ ಮಹಾದಶಾ ಚಕ್ರ (Pie Chart)' : '120-Year Mahadasha Cycle Pie'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ಅನುಪಾತದ ಅವಧಿ ವಿತರಣೆ' : 'Relative duration of 9 cycles'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                120 Years
              </span>
            </div>

            {/* Recharts Circular Pie Chart */}
            <div className="h-64 sm:h-72 w-full pt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-stone-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-purple-500/40">
                            <p className="font-bold text-purple-300 font-serif text-sm">
                              {data.sanskrit} ({data.name})
                            </p>
                            <p className="text-stone-300">Duration: <strong className="text-amber-300">{data.years} Years</strong> ({data.percentage}%)</p>
                            <p className="text-[11px] text-stone-400">Span: {data.startDate} to {data.endDate}</p>
                            {data.isCurrent && (
                              <p className="text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Currently Running
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="years"
                    nameKey="sanskrit"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.isCurrent ? '#ffffff' : 'transparent'}
                        strokeWidth={entry.isCurrent ? 3 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Overlay Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-400">
                  Current
                </span>
                <span className="text-xs font-serif font-black text-purple-900 dark:text-purple-300">
                  {currentMaha.lord.sanskrit[currentLang].split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {currentMaha.durationYears}y
                </span>
              </div>
            </div>
          </div>

          {/* Quick Micro Legend */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-1.5 text-[10px] text-stone-600 dark:text-stone-400">
            {pieChartData.map((p, idx) => (
              <div key={idx} className="flex items-center gap-1 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className={p.isCurrent ? 'font-bold text-purple-700 dark:text-purple-300' : ''}>
                  {p.sanskrit.split(' ')[0]} ({p.years}y)
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Right (7 Cols): Visual Horizontal Timeline of User's Lifetime Dasha Sequence */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-purple-300/80 dark:border-stone-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn' ? 'ಜೀವಮಾನದ ವಿಂಶೋತ್ತರಿ ದಶಾ ಕಾಲರೇಖೆ (Horizontal Timeline)' : 'Lifetime Vimshottari Sequence Timeline'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {currentLang === 'kn' ? 'ಎಲ್ಲಾ ೯ ಮಹಾದಶೆಗಳು ನೇರವಾಗಿ ವೀಕ್ಷಣೆಗೆ ಲಭ್ಯ • ಕಾರ್ಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'All 9 Mahadashas visible simultaneously • Click any period'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                {vimshottariDasha.mahadashas.length} Mahadashas
              </span>
            </div>

            {/* 100% Visible Timeline Grid - Zero Side Scrolling */}
            <div className="relative pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-1 px-1">
                {vimshottariDasha.mahadashas.map((md, idx) => {
                  const nowTime = new Date().getTime();
                  const isPast = md.endDate.getTime() < nowTime;
                  const isCurrent = md.isCurrent;
                  const isSelected = selectedMahadashaIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedMahadashaIndex(isSelected ? null : idx)}
                      className={`w-full p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isCurrent
                          ? 'bg-gradient-to-br from-purple-50 via-amber-50 to-indigo-50 dark:from-stone-800 dark:via-purple-950/40 dark:to-stone-850 border-purple-500 shadow-lg ring-2 ring-purple-400/30'
                          : isSelected
                          ? 'bg-amber-50 dark:bg-stone-800 border-amber-500 shadow-md'
                          : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                            style={{ backgroundColor: md.lord.color || '#9333ea' }} 
                          />
                          <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                            {md.lord.sanskrit[currentLang]}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-stone-500">
                          {md.durationYears} Yrs
                        </span>
                      </div>

                      <div className="text-[11px] font-mono space-y-0.5">
                        <div className="flex justify-between text-stone-500">
                          <span>Start:</span>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {md.startDate.toISOString().split('T')[0]}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                          <span>End:</span>
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {md.endDate.toISOString().split('T')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        {isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                            ● Active Now
                          </span>
                        ) : isPast ? (
                          <span className="text-stone-400 font-semibold">Completed</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">Upcoming</span>
                        )}

                        <span className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                          {isSelected ? 'Collapse ▲' : 'Antars ▼'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expanded Antardashas Drawer for Clicked Mahadasha */}
            {selectedMahadashaIndex !== null && (
              <div className="mt-3 p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-purple-300 dark:border-stone-700 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>
                      {vimshottariDasha.mahadashas[selectedMahadashaIndex].lord.sanskrit[currentLang]} ಮಹಾದಶೆಯ ೯ ಅಂತರ್ದಶೆಗಳು (Sub-periods):
                    </span>
                  </span>
                  <button
                    onClick={() => setSelectedMahadashaIndex(null)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 font-bold"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {vimshottariDasha.mahadashas[selectedMahadashaIndex].antardashas.map((ad, adIdx) => {
                    const isAdCurrent = ad.isCurrent;

                    return (
                      <div
                        key={adIdx}
                        className={`p-2 rounded-xl border flex flex-col justify-between ${
                          isAdCurrent
                            ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-[11px]">
                            {ad.lord.sanskrit[currentLang]}
                          </span>
                          <span className="font-mono text-[10px] opacity-80">
                            {ad.durationMonths}m
                          </span>
                        </div>
                        <span className="text-[10px] font-mono mt-1 opacity-90">
                          {ad.startDate.toISOString().split('T')[0]} ➔ {ad.endDate.toISOString().split('T')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
            <span>💡 Click any Mahadasha above to drill down into its sub-period sequence.</span>
            <span className="font-mono font-bold text-purple-700 dark:text-purple-300">Lahiri Ayanamsha</span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. AI-POWERED DASHA INTERPRETER (PLANETARY STRENGTH & HOUSE PLACEMENT) */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/15 dark:from-stone-900 dark:via-purple-950/40 dark:to-stone-900 border-2 border-purple-400 dark:border-purple-600/60 shadow-2xl space-y-6">
        
        {/* Interpreter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-700 to-amber-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                  AI-POWERED DASHA INTERPRETER
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  Strength + House Synthesizer
                </span>
              </div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-stone-950 dark:text-white mt-0.5">
                {currentLang === 'kn'
                  ? 'ಪ್ರಸ್ತುತ ದಶಾ ಫಲಗಳ ಎಐ ಜ್ಯೋತಿಷ್ಯ ವಿಶ್ಲೇಷಣೆ (Personalized AI Reading)'
                  : currentLang === 'hi'
                  ? 'वर्तमान विंशोत्तरी दशा का एआई ज्योतिषीय विश्लेषण'
                  : 'Personalized AI Karmic Interpretation Based on Planetary Strength & Houses'}
              </h3>
            </div>
          </div>

          {/* Regenerate AI Button */}
          <button
            type="button"
            onClick={handleRegenerateAi}
            disabled={isAiGenerating}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{currentLang === 'kn' ? 'ಎಐ ವಿಶ್ಲೇಷಣೆ ಮರುಪಡೆ (Regenerate)' : 'Re-synthesize AI Insights'}</span>
          </button>
        </div>

        {/* Synthesis Anchor: Planetary Strength (Bala) & House Placements Badge Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Mahadasha Lord Assessment */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-purple-200 dark:border-stone-800 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentMaha.lord.color || '#9333ea' }} />
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">Mahadasha Lord</span>
                <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {currentMaha.lord.sanskrit[currentLang]} ({currentMaha.lord.name})
                </span>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400 block">
                House #{mahaBhava} • Bala: {aiInterpretation.mScore}/100
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-block ${
                aiInterpretation.isMahaStrong ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {aiInterpretation.isMahaStrong ? 'EXALTED / STRONG' : 'MODERATE / BALANCED'}
              </span>
            </div>
          </div>

          {/* Antardasha Lord Assessment */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-800 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: currentAntar.lord.color || '#f59e0b' }} />
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold">Antardasha Lord</span>
                <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  {currentAntar.lord.sanskrit[currentLang]} ({currentAntar.lord.name})
                </span>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 block">
                House #{antarBhava} • Bala: {aiInterpretation.aScore}/100
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-block ${
                aiInterpretation.isAntarStrong ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {aiInterpretation.isAntarStrong ? 'ACTIVE BENEFIC' : 'NEUTRAL / CAUTION'}
              </span>
            </div>
          </div>

        </div>

        {/* 4 Core AI Prediction Domains */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Career & Wealth */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-300 dark:border-stone-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? '೧. ವೃತ್ತಿ & ಆರ್ಥಿಕತೆ' : '1. Career & Wealth'}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                {aiInterpretation.careerTitle[currentLang]}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {aiInterpretation.careerDesc[currentLang]}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <span>✨ {currentLang === 'kn' ? 'ಸ್ಥಾನ ಬಲ ಆಧಾರಿತ ಫಲ' : 'House Bala Synthesized'}</span>
            </div>
          </div>

          {/* 2. Health & Prana */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-300 dark:border-stone-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>{currentLang === 'kn' ? '೨. ಆರೋಗ್ಯ & ಪ್ರಾಣಶಕ್ತಿ' : '2. Health & Vitality'}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ದೈಹಿಕ ಶಕ್ತಿ ಮತ್ತು ಮಾನಸಿಕ ಶಾಂತಿ' : 'Immunity & Mental Equilibrium'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {aiInterpretation.healthDesc[currentLang]}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1">
              <span>🌿 {currentLang === 'kn' ? 'ಸಾತ್ವಿಕ ದಿನಚರಿ ಪಾಲಿಸಿ' : 'Ayurvedic Advice'}</span>
            </div>
          </div>

          {/* 3. Relationships & Family */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-300 dark:border-stone-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>{currentLang === 'kn' ? '೩. ಕುಟುಂಬ & ದಾಂಪತ್ಯ' : '3. Family & Bonds'}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ದಾಂಪತ್ಯ ಸೌಖ್ಯ ಮತ್ತು ಸಾಮಾಜಿಕ ಗೌರವ' : 'Domestic Harmony & Social Ties'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {aiInterpretation.domesticDesc[currentLang]}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
              <span>🕊️ {currentLang === 'kn' ? 'ಸಂಯಮ & ಪರಸ್ಪರ ಗೌರವ' : 'Compassion & Patience'}</span>
            </div>
          </div>

          {/* 4. Spiritual Awakening */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-purple-300 dark:border-stone-800 shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{currentLang === 'kn' ? '೪. ಕರ್ಮ & ಅಧ್ಯಾತ್ಮ' : '4. Karmic Evolution'}</span>
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ಆತ್ಮ ಜಾಗೃತಿ ಮತ್ತು ದೈವಾನುಗ್ರಹ' : 'Soul Evolution & Divine Grace'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                {aiInterpretation.spiritualDesc[currentLang]}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-1">
              <span>☸️ {currentLang === 'kn' ? 'ಕರ್ಮಫಲ ಮುಕ್ತಿ' : 'Karmic Alignment'}</span>
            </div>
          </div>

        </div>

        {/* Personalized Remedial Cross-Reference Footer Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-purple-900/40 border border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block">
                {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ದಶಾ ಶಾಂತಿ ಮಂತ್ರ & ಪರಿಹಾರ:' : 'Personalized Active Dasha Remedial Prescription:'}
              </span>
              <span className="text-stone-700 dark:text-stone-300">
                {currentLang === 'kn'
                  ? `${currentMaha.lord.sanskrit[currentLang]} ಬೀಜ ಮಂತ್ರ: ${currentMaha.lord.mantra[currentLang]} • ರತ್ನ: ${currentMaha.lord.gemstone[currentLang]}`
                  : `Lord ${currentMaha.lord.name} Beeja Mantra: ${currentMaha.lord.mantra.en} • Recommended Gem: ${currentMaha.lord.gemstone.en}`}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-purple-900 dark:text-purple-200 bg-white/70 dark:bg-black/50 px-3 py-1.5 rounded-xl border border-purple-400/50 shrink-0 font-bold">
            {currentLang === 'kn' ? 'ದೈನಂದಿನ ೧೦೮ ಜಪ' : 'Recite 108 Times Daily'}
          </div>
        </div>

      </div>

    </div>
  );
};
