import React, { useState, useMemo } from 'react';
import { Moon, Sun, Sparkles, ChevronRight, Calendar, Info, Compass, ShieldCheck } from 'lucide-react';
import { Language, PanchangaDay } from '../types';

interface MonthlyMoonPhaseGraphProps {
  monthDays: PanchangaDay[];
  currentLang: Language;
  onSelectDay?: (day: PanchangaDay) => void;
}

export const MonthlyMoonPhaseGraph: React.FC<MonthlyMoonPhaseGraphProps> = ({
  monthDays,
  currentLang,
  onSelectDay
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute lunar metrics for each day
  const graphPoints = useMemo(() => {
    return monthDays.map((day, idx) => {
      // Calculate Moon Illumination % based on Paksha & Tithi
      // Shukla Paksha: 1 (Prathama ~6.7%) -> 15 (Purnima 100%)
      // Krishna Paksha: 1 (Prathama ~93.3%) -> 15 (Amavasya 0%)
      const isShukla = day.paksha === 'Shukla';
      let illumination = 0;
      if (isShukla) {
        illumination = Math.round((day.tithiNumber / 15) * 100);
      } else {
        illumination = Math.round(((15 - day.tithiNumber) / 15) * 100);
      }
      illumination = Math.max(0, Math.min(100, illumination));

      const isToday = day.gregorianDate === todayStr;
      const isPurnima = isShukla && day.tithiNumber === 15;
      const isAmavasya = !isShukla && day.tithiNumber === 15;
      const isPradosha = day.tithiNumber === 13;
      const isShivaratri = !isShukla && day.tithiNumber === 14;
      const isEkadashi = day.tithiNumber === 11;

      // Phase icon representation
      let phaseIcon = '🌔';
      if (illumination >= 95) phaseIcon = '🌕';
      else if (illumination <= 5) phaseIcon = '🌑';
      else if (isShukla) {
        if (illumination < 40) phaseIcon = '🌒';
        else if (illumination < 60) phaseIcon = '🌓';
        else phaseIcon = '🌔';
      } else {
        if (illumination > 60) phaseIcon = '🌖';
        else if (illumination > 40) phaseIcon = '🌗';
        else phaseIcon = '🌘';
      }

      return {
        idx,
        day,
        illumination,
        isShukla,
        isToday,
        isPurnima,
        isAmavasya,
        isPradosha,
        isShivaratri,
        isEkadashi,
        phaseIcon
      };
    });
  }, [monthDays, todayStr]);

  // Set default selected to today or day 0
  const activePoint = useMemo(() => {
    if (selectedDayIndex !== null && graphPoints[selectedDayIndex]) {
      return graphPoints[selectedDayIndex];
    }
    const todayPt = graphPoints.find(p => p.isToday);
    return todayPt || graphPoints[0] || null;
  }, [selectedDayIndex, graphPoints]);

  // Key Milestones in Current Month
  const milestones = useMemo(() => {
    const purnima = graphPoints.find(p => p.isPurnima);
    const amavasya = graphPoints.find(p => p.isAmavasya);
    const pradoshas = graphPoints.filter(p => p.isPradosha);
    const shivaratri = graphPoints.find(p => p.isShivaratri);
    return { purnima, amavasya, pradoshas, shivaratri };
  }, [graphPoints]);

  if (!monthDays || monthDays.length === 0) return null;

  // Graph dimensions
  const svgWidth = 840;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 45;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const totalPoints = graphPoints.length;
  const getX = (i: number) => paddingLeft + (i / Math.max(1, totalPoints - 1)) * plotWidth;
  const getY = (val: number) => paddingTop + plotHeight - (val / 100) * plotHeight;

  // Generate smooth SVG cubic bezier path
  let pathD = '';
  let areaD = '';
  if (totalPoints > 1) {
    const coords = graphPoints.map(p => ({ x: getX(p.idx), y: getY(p.illumination) }));
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = i > 0 ? coords[i - 1] : coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = i < coords.length - 2 ? coords[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const baseY = getY(0);
    areaD = `${pathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-slate-900 to-indigo-950 border-2 border-indigo-400/40 text-white shadow-2xl p-4 sm:p-6 space-y-5 overflow-hidden backdrop-blur-md">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-indigo-300 text-stone-950 flex items-center justify-center font-bold text-xl shadow-lg ring-2 ring-amber-300/40 shrink-0">
            <Moon className="w-5 h-5 fill-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-base sm:text-lg text-amber-200 tracking-wide">
                {currentLang === 'kn' ? 'ಮಾಸಿಕ ಚಂದ್ರ ಕಲಾ ರೇಖೆ (Waxing & Waning Moon Phase Curve)' : currentLang === 'hi' ? 'मासिक चन्द्र कला आरेख (शुक्ल व कृष्ण पक्ष)' : 'Monthly Moon Phase & Illumination Curve'}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {currentLang === 'kn' ? 'ತಿಥಿ & ಕಲೆಗಳ ಬೆಳವಣಿಗೆ' : 'Tithi & Illumination Progression'}
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              {currentLang === 'kn'
                ? 'ಶುಕ್ಲ ಪಕ್ಷದ ಪ್ರಥಮೆಯಿಂದ ಹುಣ್ಣಿಮೆಯವರೆಗೆ (ಅಮೃತ ಕಲೆ ವೃದ್ಧಿ) ಮತ್ತು ಕೃಷ್ಣ ಪಕ್ಷದ ಪ್ರಥಮೆಯಿಂದ ಅಮಾವಾಸ್ಯೆಯವರೆಗೆ (ಕ್ಷಯ ಕಲೆ) ದಿನನಿತ್ಯದ ಚಂದ್ರ ಪ್ರಕಾಶಮಾನತೆ'
                : 'Progression from New Moon (Amavasya) to Full Moon (Purnima) and back across all days of the month'}
            </p>
          </div>
        </div>

        {/* Milestone Quick Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {milestones.purnima && (
            <button
              onClick={() => {
                setSelectedDayIndex(milestones.purnima!.idx);
                if (onSelectDay) onSelectDay(milestones.purnima!.day);
              }}
              className="px-3 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Jump to Purnima"
            >
              <span>🌕</span>
              <span>{currentLang === 'kn' ? 'ಹುಣ್ಣಿಮೆ:' : 'Purnima:'} {milestones.purnima.day.day}</span>
            </button>
          )}

          {milestones.amavasya && (
            <button
              onClick={() => {
                setSelectedDayIndex(milestones.amavasya!.idx);
                if (onSelectDay) onSelectDay(milestones.amavasya!.day);
              }}
              className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Jump to Amavasya"
            >
              <span>🌑</span>
              <span>{currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ:' : 'Amavasya:'} {milestones.amavasya.day.day}</span>
            </button>
          )}

          {milestones.shivaratri && (
            <button
              onClick={() => {
                setSelectedDayIndex(milestones.shivaratri!.idx);
                if (onSelectDay) onSelectDay(milestones.shivaratri!.day);
              }}
              className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Jump to Masa Shivaratri"
            >
              <span>🔱</span>
              <span>{currentLang === 'kn' ? 'ಮಾಸ ಶಿವರಾತ್ರಿ:' : 'Shivaratri:'} {milestones.shivaratri.day.day}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Responsive SVG Curve */}
      <div className="relative overflow-x-auto select-none pb-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[700px] sm:min-w-0"
        >
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id="moonAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </linearGradient>

            {/* Line Stroke Gradient */}
            <linearGradient id="moonLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#fbbf24" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={svgWidth - paddingRight}
                y2={getY(val)}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
                opacity="0.4"
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 3}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* 50% Shukla/Krishna Midline */}
          <line
            x1={paddingLeft}
            y1={getY(50)}
            x2={svgWidth - paddingRight}
            y2={getY(50)}
            stroke="#64748b"
            strokeDasharray="2 4"
            strokeWidth="1.2"
            opacity="0.6"
          />

          {/* Area fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#moonAreaGrad)"
            />
          )}

          {/* Progression Curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#moonLineGrad)"
              strokeWidth="3"
              filter="url(#glow)"
            />
          )}

          {/* Data Nodes for Each Day */}
          {graphPoints.map((pt) => {
            const cx = getX(pt.idx);
            const cy = getY(pt.illumination);
            const isSelected = activePoint?.idx === pt.idx;

            return (
              <g
                key={pt.idx}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedDayIndex(pt.idx);
                  if (onSelectDay) onSelectDay(pt.day);
                }}
              >
                {/* Vertical hover ray */}
                <line
                  x1={cx}
                  y1={paddingTop}
                  x2={cx}
                  y2={svgHeight - paddingBottom}
                  stroke={isSelected ? '#f59e0b' : '#64748b'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray={isSelected ? 'none' : '2 2'}
                  opacity={isSelected ? 0.8 : 0.25}
                />

                {/* Outer halo for Today or Selected */}
                {pt.isToday && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '6s' }}
                  />
                )}

                {/* Milestone Special Outer Ring */}
                {(pt.isPurnima || pt.isAmavasya || pt.isShivaratri) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill="none"
                    stroke={pt.isPurnima ? '#fef08a' : pt.isShivaratri ? '#f87171' : '#c084fc'}
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : pt.isPurnima || pt.isAmavasya ? 5 : 3.5}
                  fill={
                    isSelected
                      ? '#ffffff'
                      : pt.isPurnima
                      ? '#fef08a'
                      : pt.isAmavasya
                      ? '#6366f1'
                      : pt.isToday
                      ? '#fbbf24'
                      : '#38bdf8'
                  }
                  stroke={isSelected ? '#f59e0b' : '#0f172a'}
                  strokeWidth="2"
                  filter="url(#glow)"
                />

                {/* Day Number on X Axis */}
                <text
                  x={cx}
                  y={svgHeight - paddingBottom + 16}
                  fill={isSelected ? '#fbbf24' : pt.isToday ? '#f59e0b' : '#94a3b8'}
                  fontSize={isSelected || pt.isToday ? '10' : '9'}
                  fontWeight={isSelected || pt.isToday ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {pt.day.day}
                </text>

                {/* Milestone Icon on bottom */}
                {pt.isPurnima && (
                  <text x={cx} y={svgHeight - 6} fontSize="11" textAnchor="middle">🌕</text>
                )}
                {pt.isAmavasya && (
                  <text x={cx} y={svgHeight - 6} fontSize="11" textAnchor="middle">🌑</text>
                )}
                {pt.isShivaratri && (
                  <text x={cx} y={svgHeight - 6} fontSize="10" textAnchor="middle">🔱</text>
                )}
                {pt.isPradosha && !pt.isShivaratri && (
                  <text x={cx} y={svgHeight - 6} fontSize="9" textAnchor="middle">✨</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Day Astrological & Ritual Summary Card */}
      {activePoint && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{activePoint.phaseIcon}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-black text-base text-amber-200">
                    {activePoint.day.gregorianDate} (Day {activePoint.day.day}) • {activePoint.day.vara?.[currentLang] || activePoint.day.vara?.en}
                  </h4>
                  {activePoint.isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wide">
                      {currentLang === 'kn' ? 'ಇಂದು' : 'Today'}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activePoint.isShukla ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {activePoint.day.pakshaName?.[currentLang] || activePoint.day.paksha} Paksha ({activePoint.isShukla ? (currentLang === 'kn' ? 'ಶುಕ್ಲ - ವೃದ್ಧಿ' : 'Waxing') : (currentLang === 'kn' ? 'ಕೃಷ್ಣ - ಕ್ಷಯ' : 'Waning')})
                  </span>
                </div>

                <div className="text-xs text-stone-300 flex items-center gap-2 flex-wrap mt-1">
                  <span><strong>{currentLang === 'kn' ? 'ತಿಥಿ:' : 'Tithi:'}</strong> {activePoint.day.tithiName?.[currentLang] || activePoint.day.tithiSanskrit} ({activePoint.day.tithiNumber})</span>
                  <span>•</span>
                  <span><strong>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : 'Nakshatra:'}</strong> {activePoint.day.nakshatra?.[currentLang] || activePoint.day.nakshatra?.en}</span>
                  <span>•</span>
                  <span><strong>{currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ:' : 'Moon Sign:'}</strong> {activePoint.day.chandraRashi?.[currentLang] || activePoint.day.chandraRashi?.en}</span>
                </div>
              </div>
            </div>

            {/* Special Puja & Upasana Guidance */}
            <div className="text-xs text-amber-300/90 pt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {activePoint.isPurnima
                  ? (currentLang === 'kn' ? '🌕 ಪೂರ್ಣಿಮಾ ಮಹಾವ್ರತ: ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ & ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರಸುಂದರೀ ಮಹಾದೇವಿ ಆರಾಧನೆಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ದಿನ.' : 'Full Moon: Auspicious for Satyanarayana Puja and Sri Lalita Tripura Sundari Upasana.')
                  : activePoint.isAmavasya
                  ? (currentLang === 'kn' ? '🌑 ಅಮಾವಾಸ್ಯೆ: ಪಿತೃ ತರ್ಪಣ, ಆಂತರಿಕ ಧ್ಯಾನ ಮತ್ತು ಶ್ರೀ ಮಹಾಕಾಳಿ-ಶಿವ ಪೂಜೆ.' : 'New Moon: Ancestral Tarpana, inner contemplation, and Mahakali-Shiva Upasana.')
                  : activePoint.isShivaratri
                  ? (currentLang === 'kn' ? '🔱 ಮಾಸ ಶಿವರಾತ್ರಿ: ಶಿವಲಿಂಗಕ್ಕೆ ಕ್ಷೀರಾಭಿಷೇಕ ಮತ್ತು ಬಿಲ್ವಾರ್ಚನೆಯಿಂದ ಸಕಲ ಪಾಪ ನಿವಾರಣೆ.' : 'Masa Shivaratri: Continuous Bilva archana and milk abhisheka to Shiva Linga.')
                  : activePoint.isPradosha
                  ? (currentLang === 'kn' ? '🔱 ಪ್ರದೋಷ ಕಾಲ: ಸಾಯಂಕಾಲ ೪:೩೦ ರಿಂದ ೬:೩೦ ರವರೆಗೆ ಮಹಾದೇವನ ನಂದಿ ವಾಹನ ಪೂಜೆ.' : 'Pradosha: Sandhya window for Shiva-Parvati puja.')
                  : activePoint.isEkadashi
                  ? (currentLang === 'kn' ? '✨ ಏಕಾದಶೀ ವ್ರತ: ಉಪವಾಸ, ಧ್ಯಾನ ಮತ್ತು ಸಾತ್ವಿಕ ಸಾಧನೆ.' : 'Ekadashi: Fasting and devotional meditation.')
                  : (currentLang === 'kn' ? 'ದೈನಂದಿನ ಸಂಧ್ಯಾ ವಂದನೆ ಮತ್ತು ಸೂರ್ಯೋದಯ-ಸೂರ್ಯಾಸ್ತಮಯ ಧ್ಯಾನ.' : 'Standard auspicious daily Sandhyavandana and meditation.')}
              </span>
            </div>
          </div>

          {/* Illumination Meter & Navigation Button */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                {currentLang === 'kn' ? 'ಚಂದ್ರ ಪ್ರಕಾಶಮಾನತೆ' : 'Illumination'}
              </span>
              <div className="text-2xl font-mono font-black text-amber-300">
                {activePoint.illumination}%
              </div>
              <span className="text-[10px] text-stone-400">
                {activePoint.isShukla ? 'Waxing' : 'Waning'}
              </span>
            </div>

            {onSelectDay && (
              <button
                onClick={() => onSelectDay(activePoint.day)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <span>{currentLang === 'kn' ? 'ದಿನದ ಪಂಚಾಂಗ' : 'View Day'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
