import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Moon, Sparkles, ChevronRight, Info } from 'lucide-react';
import { Language, PanchangaDay } from '../types';

interface MonthlyMoonPhaseGraphProps {
  monthDays: PanchangaDay[];
  currentLang: Language;
  onSelectDay?: (day: PanchangaDay) => void;
}

interface LunarGraphPoint {
  idx: number;
  day: PanchangaDay;
  illumination: number;       // 0.0 to 100.0 exact %
  phaseCyclePct: number;      // 0.0 to 100.0 synodic phase % (0=New, 50=Full, 100=Next New)
  phaseName: Record<Language, string>;
  isShukla: boolean;
  isToday: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isPradosha: boolean;
  isShivaratri: boolean;
  isEkadashi: boolean;
  phaseIcon: string;
}

function getMoonPhaseName(isShukla: boolean, tithiNumber: number): Record<Language, string> {
  if (isShukla && tithiNumber === 15) {
    return { kn: 'ಹುಣ್ಣಿಮೆ (ಪೂರ್ಣ ಚಂದ್ರ)', hi: 'पूर्णिमा (पूर्ण चन्द्र)', en: 'Full Moon (Purnima)' };
  }
  if (!isShukla && tithiNumber === 15) {
    return { kn: 'ಅಮಾವಾಸ್ಯೆ (ನವ ಚಂದ್ರ)', hi: 'अमावस्या (नव चन्द्र)', en: 'New Moon (Amavasya)' };
  }
  if (isShukla) {
    if (tithiNumber <= 6) {
      return { kn: 'ಶುಕ್ಲ ಬಾಲಚಂದ್ರ (Waxing Crescent)', hi: 'शुक्ल बालचन्द्र (बढ़ता अर्धचन्द्र)', en: 'Waxing Crescent' };
    }
    if (tithiNumber <= 8) {
      return { kn: 'ಶುಕ್ಲ ಅರ್ಧಚಂದ್ರ (First Quarter)', hi: 'शुक्ल अर्धचन्द्र (प्रथम चतुर्थांश)', en: 'First Quarter' };
    }
    return { kn: 'ಶುಕ್ಲ ಪೂರ್ಣೋನ್ಮುಖ (Waxing Gibbous)', hi: 'शुक्ल वर्धमान (पूर्णिमोन्मुख)', en: 'Waxing Gibbous' };
  } else {
    if (tithiNumber <= 6) {
      return { kn: 'ಕೃಷ್ಣ ಕ್ಷಯೋನ್ಮುಖ (Waning Gibbous)', hi: 'कृष्ण क्षयोन्मुख (घटता चन्द्र)', en: 'Waning Gibbous' };
    }
    if (tithiNumber <= 8) {
      return { kn: 'ಕೃಷ್ಣ ಅರ್ಧಚಂದ್ರ (Last Quarter)', hi: 'कृष्ण अर्धचन्द्र (अंतिम चतुर्थांश)', en: 'Last Quarter' };
    }
    return { kn: 'ಕೃಷ್ಣ ಕ್ಷೀಣಚಂದ್ರ (Waning Crescent)', hi: 'कृष्ण क्षीणचन्द्र (अंतिम कला)', en: 'Waning Crescent' };
  }
}

export const MonthlyMoonPhaseGraph: React.FC<MonthlyMoonPhaseGraphProps> = ({
  monthDays,
  currentLang,
  onSelectDay,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pinnedTooltipIdx, setPinnedTooltipIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  // Compute exact lunar illumination & synodic phase percentage for each day
  const graphPoints: LunarGraphPoint[] = useMemo(() => {
    return monthDays.map((day, idx) => {
      const isShukla = day.paksha === 'Shukla';
      // Synodic lunar angle: Shukla Tithi 1..15 -> 12°..180°; Krishna Tithi 1..15 -> 192°..360°
      const synodicStep = isShukla ? day.tithiNumber : 15 + day.tithiNumber; // 1..30
      const phaseAngleRad = (synodicStep / 30) * Math.PI * 2;
      // Astronomical cosine illumination formula: (1 - cos(theta)) / 2 * 100
      const rawIllum =
        isShukla && day.tithiNumber === 15
          ? 100
          : !isShukla && day.tithiNumber === 15
          ? 0
          : ((1 - Math.cos(phaseAngleRad)) / 2) * 100;
      const illumination = Math.round(Math.max(0, Math.min(100, rawIllum)) * 10) / 10;

      // Exact moon phase percentage across 0-100% synodic cycle (0%=New Moon, 50%=Full Moon)
      const phaseCyclePct =
        !isShukla && day.tithiNumber === 15
          ? 0
          : Math.round(((synodicStep / 30) * 100) * 10) / 10;

      const isToday = day.gregorianDate === todayStr;
      const isPurnima = isShukla && day.tithiNumber === 15;
      const isAmavasya = !isShukla && day.tithiNumber === 15;
      const isPradosha = day.tithiNumber === 13;
      const isShivaratri = !isShukla && day.tithiNumber === 14;
      const isEkadashi = day.tithiNumber === 11;

      let phaseIcon = '🌔';
      if (isPurnima || illumination >= 97) phaseIcon = '🌕';
      else if (isAmavasya || illumination <= 3) phaseIcon = '🌑';
      else if (isShukla) {
        if (illumination < 38) phaseIcon = '🌒';
        else if (illumination < 62) phaseIcon = '🌓';
        else phaseIcon = '🌔';
      } else {
        if (illumination > 62) phaseIcon = '🌖';
        else if (illumination > 38) phaseIcon = '🌗';
        else phaseIcon = '🌘';
      }

      return {
        idx,
        day,
        illumination,
        phaseCyclePct,
        phaseName: getMoonPhaseName(isShukla, day.tithiNumber),
        isShukla,
        isToday,
        isPurnima,
        isAmavasya,
        isPradosha,
        isShivaratri,
        isEkadashi,
        phaseIcon,
      };
    });
  }, [monthDays, todayStr]);

  // Active point for the detailed summary card below
  const activePoint = useMemo(() => {
    if (selectedDayIndex !== null && graphPoints[selectedDayIndex]) {
      return graphPoints[selectedDayIndex];
    }
    const todayPt = graphPoints.find((p) => p.isToday);
    return todayPt || graphPoints[0] || null;
  }, [selectedDayIndex, graphPoints]);

  // Tooltip target point (hover takes priority, else clicked/pinned point)
  const tooltipPoint = useMemo(() => {
    if (hoveredIdx !== null && graphPoints[hoveredIdx]) return graphPoints[hoveredIdx];
    if (pinnedTooltipIdx !== null && graphPoints[pinnedTooltipIdx]) return graphPoints[pinnedTooltipIdx];
    return null;
  }, [hoveredIdx, pinnedTooltipIdx, graphPoints]);

  // Milestones
  const milestones = useMemo(() => {
    const purnima = graphPoints.find((p) => p.isPurnima);
    const amavasya = graphPoints.find((p) => p.isAmavasya);
    const shivaratri = graphPoints.find((p) => p.isShivaratri);
    const ekadashi = graphPoints.find((p) => p.isEkadashi);
    return { purnima, amavasya, shivaratri, ekadashi };
  }, [graphPoints]);

  // D3 chart layout constants
  const svgWidth = Math.max(760, graphPoints.length * 28);
  const svgHeight = 250;
  const margin = { top: 34, right: 32, bottom: 52, left: 48 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  // D3 scales
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, Math.max(1, graphPoints.length - 1)])
        .range([margin.left, margin.left + plotWidth]),
    [graphPoints.length, margin.left, plotWidth]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 100])
        .range([margin.top + plotHeight, margin.top]),
    [margin.top, plotHeight]
  );

  // D3 Curve & Area Rendering via d3.select()
  useEffect(() => {
    if (!svgRef.current || graphPoints.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('.d3-layer').remove();

    const root = svg.append('g').attr('class', 'd3-layer');

    // Horizontal Y-Axis Gridlines (0%, 25%, 50%, 75%, 100%)
    const yTicks = [0, 25, 50, 75, 100];
    const gridGroup = root.append('g').attr('class', 'd3-grid');

    yTicks.forEach((val) => {
      const yPos = yScale(val);
      gridGroup
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', svgWidth - margin.right)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', val === 50 ? '#fbbf24' : '#475569')
        .attr('stroke-dasharray', val === 50 ? '3 4' : '4 4')
        .attr('stroke-width', val === 50 ? 1.2 : 1)
        .attr('opacity', val === 50 ? 0.55 : 0.35);

      gridGroup
        .append('text')
        .attr('x', margin.left - 10)
        .attr('y', yPos + 3.5)
        .attr('fill', val === 100 ? '#fde047' : '#cbd5e1')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'end')
        .text(`${val}%`);
    });

    // D3 Area Generator (smooth monotoneX curve)
    const areaGen = d3
      .area<LunarGraphPoint>()
      .x((d) => xScale(d.idx))
      .y0(yScale(0))
      .y1((d) => yScale(d.illumination))
      .curve(d3.curveMonotoneX);

    root
      .append('path')
      .datum(graphPoints)
      .attr('fill', 'url(#d3MoonAreaGrad)')
      .attr('d', areaGen);

    // D3 Line Generator (Illumination Curve)
    const lineGen = d3
      .line<LunarGraphPoint>()
      .x((d) => xScale(d.idx))
      .y((d) => yScale(d.illumination))
      .curve(d3.curveMonotoneX);

    root
      .append('path')
      .datum(graphPoints)
      .attr('fill', 'none')
      .attr('stroke', 'url(#d3MoonLineGrad)')
      .attr('stroke-width', 3.2)
      .attr('filter', 'url(#d3MoonGlow)')
      .attr('d', lineGen);

    // Baseline X-Axis bar
    root
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', svgWidth - margin.right)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.65);

    // Subtle secondary dashed curve for Moon Phase Cycle %
    const phaseLineGen = d3
      .line<LunarGraphPoint>()
      .x((d) => xScale(d.idx))
      .y((d) => yScale(d.phaseCyclePct))
      .curve(d3.curveStepAfter);

    root
      .append('path')
      .datum(graphPoints)
      .attr('fill', 'none')
      .attr('stroke', '#34d399')
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.35)
      .attr('d', phaseLineGen);
  }, [graphPoints, xScale, yScale, svgWidth, margin.left, margin.right]);

  if (!monthDays || monthDays.length === 0) return null;

  // Compute tooltip left % within SVG coordinate space so it never clips off edges
  const tooltipCoords = tooltipPoint
    ? {
        cx: xScale(tooltipPoint.idx),
        cy: yScale(tooltipPoint.illumination),
        pctX: (xScale(tooltipPoint.idx) / svgWidth) * 100,
      }
    : null;

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-950 via-slate-900 to-indigo-950 border-2 border-indigo-400/40 text-white shadow-2xl p-3.5 sm:p-5 space-y-4 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-indigo-500/25">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-200 to-indigo-300 text-stone-950 flex items-center justify-center font-bold text-xl shadow-lg ring-2 ring-amber-300/40 shrink-0">
            <Moon className="w-5 h-5 fill-stone-900" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-black text-sm sm:text-lg text-amber-200 tracking-wide">
                {currentLang === 'kn'
                  ? 'ಮಾಸಿಕ ಚಂದ್ರ ಪ್ರಕಾಶಮಾನತೆ & ಕಲಾ ರೇಖೆ (D3.js Moon Phase Curve)'
                  : currentLang === 'hi'
                  ? 'मासिक चन्द्र प्रकाश एवं कला आरेख (D3.js Moon Phase Curve)'
                  : 'Monthly Lunar Illumination & Moon Phase Curve (D3.js)'}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                D3.js Interactive
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-indigo-200/80 mt-0.5">
              {currentLang === 'kn'
                ? 'ಯಾವುದೇ ದಿನಾಂಕದ ಮೇಲೆ ಮೌಸ್ ಇಡಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ನಿಖರ ಚಂದ್ರ ಪ್ರಕಾಶಮಾನತೆ (%) ಮತ್ತು ಚಂದ್ರ ಕಲಾ ಶೇಕಡಾವಾರು ನೋಡಿ.'
                : currentLang === 'hi'
                ? 'सटीक चन्द्र प्रकाश (%) और चन्द्र कला प्रतिशत देखने के लिए किसी भी तिथि पर होवर या क्लिक करें।'
                : 'Hover or tap any day node to inspect exact Lunar Illumination % and Moon Phase Cycle %.'}
            </p>
          </div>
        </div>

        {/* Milestone Quick Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {milestones.purnima && (
            <button
              type="button"
              onClick={() => {
                setSelectedDayIndex(milestones.purnima!.idx);
                setPinnedTooltipIdx(milestones.purnima!.idx);
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>🌕</span>
              <span>
                {currentLang === 'kn' ? 'ಹುಣ್ಣಿಮೆ:' : currentLang === 'hi' ? 'पूर्णिमा:' : 'Purnima:'}{' '}
                {milestones.purnima.day.day}
              </span>
            </button>
          )}

          {milestones.amavasya && (
            <button
              type="button"
              onClick={() => {
                setSelectedDayIndex(milestones.amavasya!.idx);
                setPinnedTooltipIdx(milestones.amavasya!.idx);
              }}
              className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>🌑</span>
              <span>
                {currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ:' : currentLang === 'hi' ? 'अमावस्या:' : 'Amavasya:'}{' '}
                {milestones.amavasya.day.day}
              </span>
            </button>
          )}

          {milestones.shivaratri && (
            <button
              type="button"
              onClick={() => {
                setSelectedDayIndex(milestones.shivaratri!.idx);
                setPinnedTooltipIdx(milestones.shivaratri!.idx);
              }}
              className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>🔱</span>
              <span>
                {currentLang === 'kn' ? 'ಶಿವರಾತ್ರಿ:' : currentLang === 'hi' ? 'शिवरात्रि:' : 'Shivaratri:'}{' '}
                {milestones.shivaratri.day.day}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Legend + Mobile Scroll Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-purple-400 inline-block" />
            <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಪ್ರಕಾಶಮಾನತೆ %' : 'Lunar Illumination %'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t border-dashed border-emerald-400 inline-block" />
            <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲಾ ಚಕ್ರ %' : 'Synodic Phase Cycle %'}</span>
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-300/80 flex items-center gap-1 md:hidden">
          <Info className="w-3 h-3" />
          <span>{currentLang === 'kn' ? 'ಎಡ-ಬಲ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ • ಟ್ಯಾಪ್ ಮಾಡಿ' : 'Scroll horizontally • Tap any day'}</span>
        </span>
      </div>

      {/* Horizontally Scrollable Container for Compact Mobile UI + Full Width Desktop */}
      <div className="relative w-full overflow-x-auto pb-2 select-none scrollbar-thin">
        <div className="relative min-w-[740px] w-full">
          {/* Interactive Hover / Click Floating Tooltip */}
          {tooltipPoint && tooltipCoords && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-100"
              style={{
                left: `clamp(8px, calc(${tooltipCoords.pctX.toFixed(1)}% - 122px), calc(100% - 252px))`,
                top: tooltipCoords.cy > 130 ? `${Math.max(4, tooltipCoords.cy - 128)}px` : `${Math.min(110, tooltipCoords.cy + 16)}px`,
                width: '244px',
              }}
            >
              <div className="rounded-2xl bg-stone-950/95 border-2 border-amber-400/80 shadow-2xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-lg leading-none">{tooltipPoint.phaseIcon}</span>
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-amber-300 truncate">
                        {tooltipPoint.day.gregorianDate}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate">
                        {tooltipPoint.phaseName[currentLang]}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0 ${
                      tooltipPoint.isShukla
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-indigo-500/30 text-indigo-200'
                    }`}
                  >
                    {tooltipPoint.isShukla ? 'Shukla' : 'Krishna'}
                  </span>
                </div>

                {/* Exact Illumination & Phase Percentages */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-400/35">
                    <span className="block text-[9px] uppercase text-amber-200/80 font-mono">
                      {currentLang === 'kn' ? 'ಪ್ರಕಾಶಮಾನತೆ' : 'Illumination'}
                    </span>
                    <strong className="font-mono text-sm font-black text-amber-300">
                      {tooltipPoint.illumination.toFixed(1)}%
                    </strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/35">
                    <span className="block text-[9px] uppercase text-emerald-200/80 font-mono">
                      {currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲಾ %' : 'Moon Phase %'}
                    </span>
                    <strong className="font-mono text-sm font-black text-emerald-300">
                      {tooltipPoint.phaseCyclePct.toFixed(1)}%
                    </strong>
                  </div>
                </div>

                <div className="text-[10.5px] text-slate-300 space-y-0.5 pt-0.5">
                  <div className="truncate">
                    <strong className="text-white">{currentLang === 'kn' ? 'ತಿಥಿ:' : 'Tithi:'}</strong>{' '}
                    {tooltipPoint.day.tithiName?.[currentLang] || tooltipPoint.day.tithiSanskrit} ({tooltipPoint.day.tithiNumber})
                  </div>
                  <div className="truncate">
                    <strong className="text-white">{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : 'Nakshatra:'}</strong>{' '}
                    {tooltipPoint.day.nakshatra?.[currentLang] || tooltipPoint.day.nakshatra?.en}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* D3-Powered SVG Chart */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[230px] sm:h-[255px] block"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="d3MoonAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.48" />
                <stop offset="55%" stopColor="#6366f1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
              </linearGradient>

              <linearGradient id="d3MoonLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <filter id="d3MoonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Interactive Day Nodes & Hit Columns on Top of D3 Layer */}
            <g className="interactive-nodes">
              {graphPoints.map((pt) => {
                const cx = xScale(pt.idx);
                const cy = yScale(pt.illumination);
                const isSelected = activePoint?.idx === pt.idx;
                const isHovered = hoveredIdx === pt.idx || pinnedTooltipIdx === pt.idx;
                const colWidth = plotWidth / Math.max(1, graphPoints.length - 1);

                return (
                  <g
                    key={pt.idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(pt.idx)}
                    onClick={() => {
                      setSelectedDayIndex(pt.idx);
                      setPinnedTooltipIdx((prev) => (prev === pt.idx ? null : pt.idx));
                    }}
                  >
                    {/* Invisible full-column touch/hover hit strip */}
                    <rect
                      x={cx - colWidth / 2}
                      y={margin.top - 10}
                      width={Math.max(18, colWidth)}
                      height={plotHeight + 48}
                      fill="transparent"
                    />

                    {/* Vertical Guide Ray */}
                    <line
                      x1={cx}
                      y1={margin.top}
                      x2={cx}
                      y2={svgHeight - margin.bottom}
                      stroke={isHovered || isSelected ? '#fbbf24' : '#64748b'}
                      strokeWidth={isHovered || isSelected ? 1.6 : 0.8}
                      strokeDasharray={isHovered || isSelected ? 'none' : '2 3'}
                      opacity={isHovered || isSelected ? 0.85 : 0.22}
                    />

                    {/* Today Halo */}
                    {pt.isToday && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="11.5"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1.8"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Milestone Ring */}
                    {(pt.isPurnima || pt.isAmavasya || pt.isShivaratri) && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8.5"
                        fill="none"
                        stroke={pt.isPurnima ? '#fef08a' : pt.isShivaratri ? '#fb7185' : '#c084fc'}
                        strokeWidth="1.5"
                        opacity="0.92"
                      />
                    )}

                    {/* Node Dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered || isSelected ? 6.5 : pt.isPurnima || pt.isAmavasya ? 5 : 3.8}
                      fill={
                        isHovered || isSelected
                          ? '#ffffff'
                          : pt.isPurnima
                          ? '#fef08a'
                          : pt.isAmavasya
                          ? '#818cf8'
                          : pt.isToday
                          ? '#fbbf24'
                          : '#fde047'
                      }
                      stroke={isHovered || isSelected ? '#f59e0b' : '#0f172a'}
                      strokeWidth="2"
                    />

                    {/* Day Number on X Axis */}
                    <text
                      x={cx}
                      y={svgHeight - margin.bottom + 18}
                      fill={isHovered || isSelected ? '#fde047' : pt.isToday ? '#fbbf24' : '#cbd5e1'}
                      fontSize={isHovered || isSelected || pt.isToday ? '11' : '10'}
                      fontWeight={isHovered || isSelected || pt.isToday ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.day.day}
                    </text>

                    {/* Milestone Emoji Below Day */}
                    {pt.isPurnima && (
                      <text x={cx} y={svgHeight - 10} fontSize="12" textAnchor="middle">
                        🌕
                      </text>
                    )}
                    {pt.isAmavasya && (
                      <text x={cx} y={svgHeight - 10} fontSize="12" textAnchor="middle">
                        🌑
                      </text>
                    )}
                    {pt.isShivaratri && (
                      <text x={cx} y={svgHeight - 10} fontSize="11" textAnchor="middle">
                        🔱
                      </text>
                    )}
                    {pt.isEkadashi && !pt.isPurnima && !pt.isAmavasya && (
                      <text x={cx} y={svgHeight - 10} fontSize="10" textAnchor="middle">
                        ✨
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Selected Day Detailed Summary Card */}
      {activePoint && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">{activePoint.phaseIcon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-black text-sm sm:text-base text-amber-200">
                    {activePoint.day.gregorianDate} • {activePoint.day.vara?.[currentLang] || activePoint.day.vara?.en}
                  </h4>
                  {activePoint.isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase">
                      {currentLang === 'kn' ? 'ಇಂದು' : currentLang === 'hi' ? 'आज' : 'Today'}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activePoint.isShukla
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {activePoint.phaseName[currentLang]}
                  </span>
                </div>

                <div className="text-xs text-stone-300 flex items-center gap-2 flex-wrap mt-1">
                  <span>
                    <strong>{currentLang === 'kn' ? 'ತಿಥಿ:' : 'Tithi:'}</strong>{' '}
                    {activePoint.day.tithiName?.[currentLang] || activePoint.day.tithiSanskrit} ({activePoint.day.tithiNumber})
                  </span>
                  <span>•</span>
                  <span>
                    <strong>{currentLang === 'kn' ? 'ನಕ್ಷತ್ರ:' : 'Nakshatra:'}</strong>{' '}
                    {activePoint.day.nakshatra?.[currentLang] || activePoint.day.nakshatra?.en}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>{currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ:' : 'Moon Sign:'}</strong>{' '}
                    {activePoint.day.chandraRashi?.[currentLang] || activePoint.day.chandraRashi?.en}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-amber-300/90 pt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {activePoint.isPurnima
                  ? currentLang === 'kn'
                    ? '🌕 ಪೂರ್ಣಿಮಾ ಮಹಾವ್ರತ: ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ & ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರಸುಂದರೀ ಆರಾಧನೆಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ದಿನ.'
                    : 'Full Moon: Auspicious for Satyanarayana Puja and Sri Lalita Tripura Sundari Upasana.'
                  : activePoint.isAmavasya
                  ? currentLang === 'kn'
                    ? '🌑 ಅಮಾವಾಸ್ಯೆ: ಪಿತೃ ತರ್ಪಣ, ಆಂತರಿಕ ಧ್ಯಾನ ಮತ್ತು ಶ್ರೀ ಮಹಾಕಾಳಿ-ಶಿವ ಪೂಜೆ.'
                    : 'New Moon: Ancestral Tarpana, inner contemplation, and Mahakali-Shiva Upasana.'
                  : activePoint.isShivaratri
                  ? currentLang === 'kn'
                    ? '🔱 ಮಾಸ ಶಿವರಾತ್ರಿ: ಶಿವಲಿಂಗಕ್ಕೆ ಕ್ಷೀರಾಭಿಷೇಕ ಮತ್ತು ಬಿಲ್ವಾರ್ಚನೆ.'
                    : 'Masa Shivaratri: Bilva archana and milk abhisheka to Shiva Linga.'
                  : activePoint.isEkadashi
                  ? currentLang === 'kn'
                    ? '✨ ಏಕಾದಶೀ ವ್ರತ: ಉಪವಾಸ, ಧ್ಯಾನ ಮತ್ತು ಸಾತ್ವಿಕ ಸಾಧನೆ.'
                    : 'Ekadashi: Fasting and devotional meditation.'
                  : currentLang === 'kn'
                  ? 'ದೈನಂದಿನ ಸಂಧ್ಯಾ ವಂದನೆ ಮತ್ತು ಸೂರ್ಯೋದಯ-ಸೂರ್ಯಾಸ್ತಮಯ ಧ್ಯಾನ.'
                  : 'Standard auspicious daily Sandhyavandana and meditation.'}
              </span>
            </div>
          </div>

          {/* Exact Illumination + Phase Cycle % Meters */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/35 text-right">
              <span className="text-[9.5px] uppercase font-bold text-amber-200/80 block tracking-wider">
                {currentLang === 'kn' ? 'ಪ್ರಕಾಶಮಾನತೆ' : 'Illumination'}
              </span>
              <div className="text-xl font-mono font-black text-amber-300">
                {activePoint.illumination.toFixed(1)}%
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-right">
              <span className="text-[9.5px] uppercase font-bold text-emerald-200/80 block tracking-wider">
                {currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲಾ %' : 'Moon Phase %'}
              </span>
              <div className="text-xl font-mono font-black text-emerald-300">
                {activePoint.phaseCyclePct.toFixed(1)}%
              </div>
            </div>

            {onSelectDay && (
              <button
                type="button"
                onClick={() => onSelectDay(activePoint.day)}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
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
