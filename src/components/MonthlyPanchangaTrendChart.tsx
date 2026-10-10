import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Sparkles, TrendingUp, Moon, Compass, ChevronDown, ChevronUp, Info, Calendar } from 'lucide-react';
import { PanchangaDay, Language } from '../types';

interface MonthlyPanchangaTrendChartProps {
  days: PanchangaDay[];
  currentLang: Language;
  onSelectDay: (day: PanchangaDay) => void;
  selectedDay?: PanchangaDay | null;
}

// Astrological Tithi Influence scoring (Classical Panchanga Shastra)
function getTithiIntensity(day: PanchangaDay): { score: number; category: string; categoryKn: string; categoryHi: string } {
  const num = day.tithiNumber;
  const isPurnima = day.paksha === 'Shukla' && num === 15;
  const isAmavasya = day.paksha === 'Krishna' && num === 15;

  if (isPurnima) {
    return { score: 98, category: 'Purna (Supreme Fullness)', categoryKn: 'ಪೂರ್ಣ (ಪರಮ ತೇಜಸ್ಸು)', categoryHi: 'पूर्ण (सर्वोच्च आभा)' };
  }
  if (isAmavasya) {
    return { score: 50, category: 'Amavasya (Introspection & Tarpan)', categoryKn: 'ಅಮಾವಾಸ್ಯೆ (ಧ್ಯಾನ & ತರ್ಪಣ)', categoryHi: 'अमावस्या (आत्मनिरीक्षण)' };
  }

  // Classical 5-fold Tithi classification:
  // Nanda (1, 6, 11) - Joy, prosperity
  if ([1, 6, 11].includes(num)) {
    return { score: 85, category: 'Nanda (Joy & Expansion)', categoryKn: 'ನಂದಾ (ಸಂತೋಷ & ವೃದ್ಧಿ)', categoryHi: 'नन्दा (आनंद व समृद्धि)' };
  }
  // Bhadra (2, 7, 12) - Fortunate, steady
  if ([2, 7, 12].includes(num)) {
    return { score: 82, category: 'Bhadra (Auspicious & Fortunate)', categoryKn: 'ಭದ್ರಾ (ಮಂಗಳಕರ & ಸ್ಥಿರ)', categoryHi: 'भद्रा (कल्याणकारी)' };
  }
  // Jaya (3, 8, 13) - Victory, courage
  if ([3, 8, 13].includes(num)) {
    return { score: 88, category: 'Jaya (Victory & Triumph)', categoryKn: 'ಜಯಾ (ವಿಜಯ & ಸಾಹಸ)', categoryHi: 'जया (विजय व सिद्धि)' };
  }
  // Rikta (4, 9, 14) - Clearing obstacles, fierce
  if ([4, 9, 14].includes(num)) {
    return { score: 55, category: 'Rikta (Clearing & Purification)', categoryKn: 'ರಿಕ್ತಾ (ಶುದ್ಧೀಕರಣ & ರಕ್ಷಣೆ)', categoryHi: 'रिक्ता (दोष निवारण)' };
  }
  // Purna (5, 10) - Fullness
  if ([5, 10].includes(num)) {
    return { score: 92, category: 'Purna (Fulfilment)', categoryKn: 'ಪೂರ್ಣಾ (ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ)', categoryHi: 'पूर्णा (मनोरथ सिद्धि)' };
  }

  return { score: 75, category: 'Madhyama', categoryKn: 'ಮಧ್ಯಮ', categoryHi: 'मध्यम' };
}

// Astrological Nakshatra Influence scoring
function getNakshatraIntensity(day: PanchangaDay): { score: number; nature: string; natureKn: string; natureHi: string } {
  const nakName = day.nakshatra.en.toLowerCase();

  // Mridu (Tender / Auspicious): Rohini, Mrigashirsha, Chitra, Anuradha, Revati
  if (nakName.includes('rohini') || nakName.includes('mrigashirsha') || nakName.includes('chitra') || nakName.includes('anuradha') || nakName.includes('revati')) {
    return { score: 94, nature: 'Mridu (Tender & Highly Auspicious)', natureKn: 'ಮೃದು (ಅತ್ಯಂತ ಮಂಗಳಕರ)', natureHi: 'मृदु (अति शुभ)' };
  }
  // Dhruva / Sthira (Fixed / Permanent): Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada
  if (nakName.includes('uttara')) {
    return { score: 92, nature: 'Dhruva (Fixed & Enduring Strength)', natureKn: 'ಧ್ರುವ (ಸ್ಥಿರ & ದೀರ್ಘಾವಧಿ)', natureHi: 'ध्रुव (स्थायी बल)' };
  }
  // Kshipra / Laghu (Swift / Favorable): Ashwini, Pushya, Hasta
  if (nakName.includes('ashwini') || nakName.includes('pushya') || nakName.includes('hasta')) {
    return { score: 96, nature: 'Kshipra (Swift & Fruitful Results)', natureKn: 'ಕ್ಷಿಪ್ರ (ಶೀಘ್ರ ಫಲದಾಯಕ)', natureHi: 'क्षिप्र (शीघ्र फलदायी)' };
  }
  // Chara (Movable): Punarvasu, Swati, Shravana, Dhanishta, Shatabhisha
  if (nakName.includes('punarvasu') || nakName.includes('swati') || nakName.includes('shravana') || nakName.includes('dhanishta') || nakName.includes('shatabhisha')) {
    return { score: 86, nature: 'Chara (Movable & Dynamic)', natureKn: 'ಚರ (ಚಲನಶೀಲ & ಪ್ರಗತಿ)', natureHi: 'चर (गतिशील)' };
  }
  // Mishra (Mixed): Krittika, Vishakha
  if (nakName.includes('krittika') || nakName.includes('vishakha')) {
    return { score: 72, nature: 'Mishra (Mixed Energies)', natureKn: 'ಮಿಶ್ರ (ಸಾಧಾರಣ ಫಲ)', natureHi: 'मिश्र (मिश्रित ऊर्जा)' };
  }
  // Ugra / Teekshna (Fierce): Bharani, Magha, Purva Phalguni, Purva Ashadha, Purva Bhadrapada, Ardra, Ashlesha, Jyeshtha, Moola
  return { score: 60, nature: 'Ugra / Teekshna (Courage & Dissolution)', natureKn: 'ಉಗ್ರ / ತೀಕ್ಷ್ಣ (ರಕ್ಷಣಾತ್ಮಕ)', natureHi: 'उग्र / तीक्ष्ण (साहस)' };
}

export const MonthlyPanchangaTrendChart: React.FC<MonthlyPanchangaTrendChartProps> = ({
  days,
  currentLang,
  onSelectDay,
  selectedDay
}) => {
  const [metricType, setMetricType] = useState<'tithi' | 'nakshatra'>('tithi');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Compute daily series for Recharts
  const chartData = useMemo(() => {
    return days.map((day) => {
      const tithiData = getTithiIntensity(day);
      const nakData = getNakshatraIntensity(day);

      // Moon illumination percentage (0 to 100)
      const moonIllumination = Math.round((day.moonPhaseDegree / 180) * 100);

      return {
        dayNum: day.day,
        label: `${day.day}`,
        fullDate: day.gregorianDate,
        dayName: day.vara.kn.split(' ')[0],
        tithiName: day.tithiName[currentLang],
        nakshatraName: day.nakshatra[currentLang].split('(')[0].trim(),
        tithiScore: tithiData.score,
        tithiCategory: currentLang === 'kn' ? tithiData.categoryKn : currentLang === 'hi' ? tithiData.categoryHi : tithiData.category,
        nakScore: nakData.score,
        nakNature: currentLang === 'kn' ? nakData.natureKn : currentLang === 'hi' ? nakData.natureHi : nakData.nature,
        moonIllumination,
        hasFestival: day.festivals.length > 0,
        festivalName: day.festivals[0] ? day.festivals[0].name[currentLang] : '',
        rawDay: day
      };
    });
  }, [days, currentLang]);

  // Statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    const scores = chartData.map(d => metricType === 'tithi' ? d.tithiScore : d.nakScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const peakDays = chartData.filter(d => (metricType === 'tithi' ? d.tithiScore : d.nakScore) >= 90);
    const cleanseDays = chartData.filter(d => (metricType === 'tithi' ? d.tithiScore : d.nakScore) <= 60);

    return { avgScore, peakCount: peakDays.length, cleanseCount: cleanseDays.length };
  }, [chartData, metricType]);

  const activeColor = metricType === 'tithi' ? '#d97706' : '#2563eb';
  const activeGradient = metricType === 'tithi' ? 'url(#tithiGradient)' : 'url(#nakGradient)';

  return (
    <div className="rounded-2xl border border-amber-300/80 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 p-4 sm:p-5 shadow-lg space-y-4 no-print transition-all">
      
      {/* Chart Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{currentLang === 'kn' ? 'ಮಾಸಿಕ ತಿಥಿ & ನಕ್ಷತ್ರ ತರಂಗ ರೇಖೆ' : currentLang === 'hi' ? 'मासिक तिथि व नक्षत्र प्रभाव तरंग' : 'Monthly Panchanga Influence Trend'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                Recharts
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {currentLang === 'kn'
                ? 'ಮಾಸದ ಪ್ರತಿ ದಿನದ ತಿಥಿ-ನಕ್ಷತ್ರಗಳ ಶುಭ ಪ್ರಭಾವ ಮತ್ತು ಚಂದ್ರ ಕಲೆಯ ತೀವ್ರತೆ'
                : 'Interactive monthly trend line for Tithi auspiciousness, Nakshatra power, and lunar illumination'}
            </p>
          </div>
        </div>

        {/* Metric Selector & Expand Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setMetricType('tithi')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                metricType === 'tithi'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ತಿಥಿ ಪ್ರಭಾವ' : currentLang === 'hi' ? 'तिथि प्रभाव' : 'Tithi Intensity'}</span>
            </button>
            <button
              onClick={() => setMetricType('nakshatra')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                metricType === 'nakshatra'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ ಶಕ್ತಿ' : currentLang === 'hi' ? 'नक्षत्र शक्ति' : 'Nakshatra Power'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
            title={isExpanded ? 'Collapse Chart' : 'Expand Chart'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Chart Body */}
      {isExpanded && (
        <div className="space-y-4">
          
          {/* KPI Summary Strip */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
              <div className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40">
                <span className="text-[10px] text-stone-500 font-bold block uppercase">
                  {currentLang === 'kn' ? 'ಮಾಸದ ಸರಾಸರಿ ಸೂಚ್ಯಂಕ:' : 'Monthly Average:'}
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  {stats.avgScore}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block uppercase">
                  {currentLang === 'kn' ? 'ಉತ್ಕೃಷ್ಟ ಶುಭ ದಿನಗಳು (≥90%):' : 'Peak Auspicious Days:'}
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {stats.peakCount} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold block uppercase">
                  {currentLang === 'kn' ? 'ಶುದ್ಧೀಕರಣ / ಧ್ಯಾನ ದಿನಗಳು:' : 'Cleansing / Introspection:'}
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                  {stats.cleanseCount} {currentLang === 'kn' ? 'ದಿನಗಳು' : 'days'}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Recharts Visualization Container */}
          <div className="w-full h-56 sm:h-64 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const clicked = e.activePayload[0].payload.rawDay;
                    if (clicked) onSelectDay(clicked);
                  }
                }}
              >
                <defs>
                  <linearGradient id="tithiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="nakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis 
                  dataKey="dayNum" 
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  tickLine={false}
                  axisLine={{ stroke: '#d6d3d1' }}
                />

                <YAxis 
                  domain={[30, 100]}
                  tick={{ fontSize: 10, fill: '#78716c' }}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />

                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-amber-300 dark:border-stone-700 bg-white/95 dark:bg-stone-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
                          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-1">
                            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-600" />
                              <span>{data.fullDate} ({data.dayName})</span>
                            </span>
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                              {metricType === 'tithi' ? `${data.tithiScore}%` : `${data.nakScore}%`}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Tithi:</span>
                              <span className="font-semibold text-stone-800 dark:text-stone-200">{data.tithiName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Classification:</span>
                              <span className="font-semibold text-amber-700 dark:text-amber-300">{data.tithiCategory}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Nakshatra:</span>
                              <span className="font-semibold text-stone-800 dark:text-stone-200">{data.nakshatraName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Nature:</span>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">{data.nakNature}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Moon Phase:</span>
                              <span className="font-mono text-stone-700 dark:text-stone-300">{data.moonIllumination}% Illum</span>
                            </div>
                            {data.hasFestival && (
                              <div className="pt-1 text-emerald-600 font-bold border-t border-stone-100 dark:border-stone-800">
                                🌟 {data.festivalName}
                              </div>
                            )}
                          </div>
                          <div className="text-[9.5px] text-stone-400 italic text-center pt-0.5">
                            Click point to open day details
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Average Reference Line */}
                {stats && (
                  <ReferenceLine 
                    y={stats.avgScore} 
                    stroke="#a8a29e" 
                    strokeDasharray="4 4" 
                    label={{ value: `Avg ${stats.avgScore}%`, position: 'insideTopRight', fill: '#78716c', fontSize: 10 }}
                  />
                )}

                {/* Main Area & Line */}
                <Area
                  type="monotone"
                  dataKey={metricType === 'tithi' ? 'tithiScore' : 'nakScore'}
                  stroke={activeColor}
                  strokeWidth={2.5}
                  fill={activeGradient}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2, fill: activeColor }}
                />

                {/* Secondary line showing Moon Illumination */}
                {metricType === 'tithi' && (
                  <Line
                    type="monotone"
                    dataKey="moonIllumination"
                    stroke="#94a3b8"
                    strokeDasharray="2 2"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeColor }} />
                <span>{metricType === 'tithi' ? 'Tithi Influence Intensity' : 'Nakshatra Energetic Power'}</span>
              </span>
              {metricType === 'tithi' && (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-400" />
                  <span>Moon Illumination %</span>
                </span>
              )}
            </div>
            <span>Tap any data point on chart to focus day in calendar</span>
          </div>

        </div>
      )}

    </div>
  );
};
