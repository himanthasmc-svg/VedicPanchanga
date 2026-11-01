import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Clock, Calendar, Sparkles, ZoomIn, ZoomOut, RotateCcw, ChevronRight, Eye } from 'lucide-react';
import { Language } from '../types';
import { MahadashaPeriod, AntardashaPeriod, VimshottariDashaResult } from '../utils/vimshottariDasha';

interface DashaD3TimelineProps {
  dashaResult: VimshottariDashaResult;
  currentLang: Language;
  selectedDate: Date;
  onSelectMahadasha?: (maha: MahadashaPeriod) => void;
  onSelectAntardasha?: (antar: AntardashaPeriod) => void;
}

export const DashaD3Timeline: React.FC<DashaD3TimelineProps> = ({
  dashaResult,
  currentLang,
  selectedDate,
  onSelectMahadasha,
  onSelectAntardasha
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Active view window filter: 'all' (120 years) | 'activeMaha' | 'tenYears'
  const [viewFilter, setViewFilter] = useState<'all' | 'activeMaha' | 'tenYears'>('all');
  const [selectedMaha, setSelectedMaha] = useState<MahadashaPeriod>(dashaResult.currentMahadasha);
  const [hoveredSegment, setHoveredSegment] = useState<{
    type: 'mahadasha' | 'antardasha';
    lord: string;
    lordSanskrit: string;
    start: Date;
    end: Date;
    duration: string;
    isCurrent: boolean;
    color: string;
    x: number;
    y: number;
  } | null>(null);

  // Sync selected Mahadasha with dashaResult changes
  useEffect(() => {
    setSelectedMaha(dashaResult.currentMahadasha);
  }, [dashaResult]);

  // Overall birth to 120 years extent
  const timeExtent = useMemo<[Date, Date]>(() => {
    const firstMaha = dashaResult.mahadashas[0];
    const lastMaha = dashaResult.mahadashas[dashaResult.mahadashas.length - 1];
    const birthDate = firstMaha ? new Date(firstMaha.startDate) : new Date();
    const endDate = lastMaha ? new Date(lastMaha.endDate) : new Date(birthDate.getTime() + 120 * 365.25 * 86400000);

    if (viewFilter === 'activeMaha' && selectedMaha) {
      return [new Date(selectedMaha.startDate), new Date(selectedMaha.endDate)];
    }

    if (viewFilter === 'tenYears') {
      const now = selectedDate.getTime();
      const fiveYrsBefore = new Date(now - 3 * 365.25 * 86400000);
      const sevenYrsAfter = new Date(now + 7 * 365.25 * 86400000);
      return [fiveYrsBefore, sevenYrsAfter];
    }

    return [birthDate, endDate];
  }, [dashaResult, viewFilter, selectedMaha, selectedDate]);

  // Render D3 Interactive Visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 190;
    const margin = { top: 25, right: 30, bottom: 35, left: 30 };
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale based on time extent
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, innerWidth])
      .clamp(true);

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.max(5, Math.floor(width / 95)))
      .tickFormat((d) => d3.timeFormat('%Y')(d as Date))
      .tickSizeOuter(0);

    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0, 130)`)
      .attr('class', 'text-[10px] font-mono opacity-80')
      .call(xAxis);

    xAxisGroup.selectAll('text').style('fill', '#94a3b8');
    xAxisGroup.selectAll('line').style('stroke', '#475569');
    xAxisGroup.select('.domain').style('stroke', '#475569');

    // Track 1: Mahadashas (Y: 10, Height: 38)
    const mahaY = 10;
    const mahaHeight = 38;

    // Track 1 Label
    g.append('text')
      .attr('x', 0)
      .attr('y', -6)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '10.5px')
      .attr('font-weight', 'bold')
      .attr('letter-spacing', '0.5px')
      .text(currentLang === 'kn' ? '೧. ಮಹಾದಶಾ ಚಕ್ರ (Mahadashas)' : currentLang === 'hi' ? '१. महादशा चक्र' : '1. Mahadashas (120-Year Timeline)');

    // Track 2 Label
    g.append('text')
      .attr('x', 0)
      .attr('y', 60)
      .attr('fill', '#cbd5e1')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(currentLang === 'kn' ? `೨. ಅಂತರ್ದಶಾ ವಿಭಾಗಗಳು (${selectedMaha.lord.sanskrit[currentLang]})` : currentLang === 'hi' ? `२. अन्तर्दशा खण्ड (${selectedMaha.lord.sanskrit[currentLang]})` : `2. Antardashas within ${selectedMaha.lord.sanskrit[currentLang]} Mahadasha`);

    // Draw Mahadasha Rectangles
    dashaResult.mahadashas.forEach((maha) => {
      const startX = xScale(new Date(maha.startDate));
      const endX = xScale(new Date(maha.endDate));
      const segWidth = Math.max(1, endX - startX);

      // Skip segments completely outside view
      if (endX < 0 || startX > innerWidth) return;

      const isSelected = selectedMaha.lord.name === maha.lord.name;
      const isCurrent = maha.isCurrent;

      const segGroup = g.append('g').attr('class', 'cursor-pointer');

      // Segment Rect
      const rect = segGroup.append('rect')
        .attr('x', Math.max(0, startX))
        .attr('y', mahaY)
        .attr('width', Math.min(innerWidth - Math.max(0, startX), segWidth))
        .attr('height', mahaHeight)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', maha.lord.color)
        .attr('fill-opacity', isSelected ? 0.95 : isCurrent ? 0.85 : 0.6)
        .attr('stroke', isSelected ? '#ffffff' : isCurrent ? '#fbbf24' : '#0f172a')
        .attr('stroke-width', isSelected ? 2.5 : isCurrent ? 2 : 1)
        .style('transition', 'all 0.2s ease');

      // Segment Text Label
      if (segWidth > 32) {
        segGroup.append('text')
          .attr('x', Math.max(0, startX) + segWidth / 2)
          .attr('y', mahaY + mahaHeight / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', segWidth > 60 ? '11px' : '9.5px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text(maha.lord.sanskrit[currentLang].split(' ')[0]);
      }

      // Hover and Click events
      segGroup
        .on('mouseenter', (event) => {
          rect.attr('fill-opacity', 1).attr('stroke', '#ffffff').attr('stroke-width', 2.5);
          const [mx, my] = d3.pointer(event, container);
          setHoveredSegment({
            type: 'mahadasha',
            lord: maha.lord.name,
            lordSanskrit: maha.lord.sanskrit[currentLang],
            start: new Date(maha.startDate),
            end: new Date(maha.endDate),
            duration: `${maha.durationYears} Years`,
            isCurrent: maha.isCurrent,
            color: maha.lord.color,
            x: mx,
            y: my
          });
        })
        .on('mouseleave', () => {
          rect
            .attr('fill-opacity', isSelected ? 0.95 : isCurrent ? 0.85 : 0.6)
            .attr('stroke', isSelected ? '#ffffff' : isCurrent ? '#fbbf24' : '#0f172a')
            .attr('stroke-width', isSelected ? 2.5 : isCurrent ? 2 : 1);
          setHoveredSegment(null);
        })
        .on('click', () => {
          setSelectedMaha(maha);
          if (onSelectMahadasha) onSelectMahadasha(maha);
        });
    });

    // Track 2: Antardashas of the Selected Mahadasha (Y: 74, Height: 30)
    const antarY = 74;
    const antarHeight = 30;

    selectedMaha.antardashas.forEach((antar) => {
      const startX = xScale(new Date(antar.startDate));
      const endX = xScale(new Date(antar.endDate));
      const segWidth = Math.max(1, endX - startX);

      if (endX < 0 || startX > innerWidth) return;

      const isCurrent = antar.isCurrent;

      const segGroup = g.append('g').attr('class', 'cursor-pointer');

      const rect = segGroup.append('rect')
        .attr('x', Math.max(0, startX))
        .attr('y', antarY)
        .attr('width', Math.min(innerWidth - Math.max(0, startX), segWidth))
        .attr('height', antarHeight)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', antar.lord.color)
        .attr('fill-opacity', isCurrent ? 0.95 : 0.65)
        .attr('stroke', isCurrent ? '#fbbf24' : '#1e293b')
        .attr('stroke-width', isCurrent ? 2 : 1)
        .style('transition', 'all 0.2s ease');

      if (segWidth > 24) {
        segGroup.append('text')
          .attr('x', Math.max(0, startX) + segWidth / 2)
          .attr('y', antarY + antarHeight / 2 + 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', segWidth > 45 ? '10px' : '8px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text(antar.lord.sanskrit[currentLang].split(' ')[0]);
      }

      segGroup
        .on('mouseenter', (event) => {
          rect.attr('fill-opacity', 1).attr('stroke', '#ffffff').attr('stroke-width', 2);
          const [mx, my] = d3.pointer(event, container);
          setHoveredSegment({
            type: 'antardasha',
            lord: `${selectedMaha.lord.name} - ${antar.lord.name}`,
            lordSanskrit: `${selectedMaha.lord.sanskrit[currentLang]} / ${antar.lord.sanskrit[currentLang]}`,
            start: new Date(antar.startDate),
            end: new Date(antar.endDate),
            duration: `${antar.durationMonths} Months`,
            isCurrent: antar.isCurrent,
            color: antar.lord.color,
            x: mx,
            y: my
          });
        })
        .on('mouseleave', () => {
          rect
            .attr('fill-opacity', isCurrent ? 0.95 : 0.65)
            .attr('stroke', isCurrent ? '#fbbf24' : '#1e293b')
            .attr('stroke-width', isCurrent ? 2 : 1);
          setHoveredSegment(null);
        })
        .on('click', () => {
          if (onSelectAntardasha) onSelectAntardasha(antar);
        });
    });

    // Draw TODAY / Current Query Date Line Marker
    const targetDateX = xScale(selectedDate);
    if (targetDateX >= 0 && targetDateX <= innerWidth) {
      const nowGroup = g.append('g').attr('pointer-events', 'none');

      // Glowing pulsing vertical needle line
      nowGroup.append('line')
        .attr('x1', targetDateX)
        .attr('y1', 5)
        .attr('x2', targetDateX)
        .attr('y2', 130)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '3 2');

      // Top Needle Marker Badge
      nowGroup.append('circle')
        .attr('cx', targetDateX)
        .attr('cy', 8)
        .attr('r', 5)
        .attr('fill', '#ef4444')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);

      // Bottom Date Label Badge
      nowGroup.append('rect')
        .attr('x', targetDateX - 22)
        .attr('y', 133)
        .attr('width', 44)
        .attr('height', 15)
        .attr('rx', 4)
        .attr('fill', '#ef4444');

      nowGroup.append('text')
        .attr('x', targetDateX)
        .attr('y', 144)
        .attr('fill', '#ffffff')
        .attr('font-size', '8.5px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text('NOW');
    }
  }, [timeExtent, dashaResult, selectedMaha, selectedDate, currentLang, viewFilter]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-indigo-950 border border-stone-800 p-4 sm:p-5 text-white shadow-xl space-y-3 relative">
      
      {/* Header with Title and Filter Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
              {currentLang === 'kn'
                ? 'ಡಿ೩ ಇಂಟರಾಕ್ಟಿವ್ ದಶಾ ಟೈಮ್‌ಲೈನ್ (D3.js Visualization)'
                : currentLang === 'hi'
                ? 'डी३ इंटरैक्टिव दशा कालक्रम (D3.js Timeline)'
                : 'Interactive Parashara Dasha Timeline (D3.js)'}
            </h4>
            <p className="text-[11px] text-stone-400">
              {currentLang === 'kn'
                ? '೧೨೦ ವರ್ಷಗಳ ಮಹಾದಶಾ ಮತ್ತು ಅಂತರ್ದಶಾಗಳ ಸಮನ್ವಯ ಹಾಗೂ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ'
                : 'Visualizing duration, overlap, and real-time transition of Mahadashas & Antardashas'}
            </p>
          </div>
        </div>

        {/* Zoom / Viewport Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-stone-850 p-1 rounded-xl border border-stone-700/80 text-xs">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewFilter === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            {currentLang === 'kn' ? '೧೨೦ ವರ್ಷ (All)' : '120 Years'}
          </button>

          <button
            onClick={() => setViewFilter('activeMaha')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewFilter === 'activeMaha'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            {selectedMaha.lord.sanskrit[currentLang].split(' ')[0]}
          </button>

          <button
            onClick={() => setViewFilter('tenYears')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewFilter === 'tenYears'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            ±5 {currentLang === 'kn' ? 'ವರ್ಷ' : 'Yrs'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div ref={containerRef} className="w-full relative overflow-x-auto select-none pt-1">
        <svg ref={svgRef} className="w-full h-auto drop-shadow-md" />

        {/* Hover Floating Tooltip */}
        {hoveredSegment && (
          <div
            className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-stone-900/95 border border-amber-400 text-white text-xs shadow-2xl backdrop-blur-md max-w-xs transition-opacity animate-in fade-in"
            style={{
              left: Math.min(Math.max(10, hoveredSegment.x - 70), (containerRef.current?.clientWidth || 300) - 170),
              top: Math.max(0, hoveredSegment.y - 85)
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredSegment.color }} />
              <strong className="text-amber-300 font-serif">{hoveredSegment.lordSanskrit}</strong>
              {hoveredSegment.isCurrent && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-black">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-stone-300 space-y-0.5">
              <div>📅 {formatDate(hoveredSegment.start)} — {formatDate(hoveredSegment.end)}</div>
              <div>⏳ {hoveredSegment.duration}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>{currentLang === 'kn' ? 'ಇಂದಿನ ಸ್ಥಾನ' : 'Active Date Indicator'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಮಹಾದಶಾ' : 'Selected Dasha Window'}</span>
          </span>
        </div>

        <span className="text-[10px] text-stone-500 font-mono">
          Click any segment to drill down into Antardashas
        </span>
      </div>

    </div>
  );
};
