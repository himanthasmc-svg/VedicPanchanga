import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronRight, 
  Info, 
  Layers, 
  Clock, 
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { MahadashaPeriod, AntardashaPeriod, VimshottariDashaResult, DASHA_LORDS } from '../utils/vimshottariDasha';

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

  // Responsive container width state observed via ResizeObserver
  const [containerWidth, setContainerWidth] = useState<number>(850);

  // Active view window filter: 'all' (120 years) | 'activeMaha' | 'tenYears'
  const [viewFilter, setViewFilter] = useState<'all' | 'activeMaha' | 'tenYears'>('all');
  const [selectedMaha, setSelectedMaha] = useState<MahadashaPeriod>(dashaResult.currentMahadasha);
  const [showLegend, setShowLegend] = useState<boolean>(false);

  // Hovered segment data for interactive floating tooltip
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

  // Observe container width changes for fluid responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync selected Mahadasha with dashaResult changes
  useEffect(() => {
    if (dashaResult.currentMahadasha) {
      setSelectedMaha(dashaResult.currentMahadasha);
    }
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
      const fiveYrsBefore = new Date(now - 5 * 365.25 * 86400000);
      const fiveYrsAfter = new Date(now + 5 * 365.25 * 86400000);
      return [fiveYrsBefore, fiveYrsAfter];
    }

    return [birthDate, endDate];
  }, [dashaResult, viewFilter, selectedMaha, selectedDate]);

  // Render Responsive D3 Linear Timeline
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Minimum width of 680 to preserve linear readable blocks on mobile viewports
    const effectiveWidth = Math.max(680, containerWidth);
    const height = 210;
    const margin = { top: 28, right: 32, bottom: 40, left: 32 };
    const innerWidth = effectiveWidth - margin.left - margin.right;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', effectiveWidth)
      .attr('height', height)
      .attr('viewBox', `0 0 ${effectiveWidth} ${height}`);

    // Master SVG definitions: Drop shadows & Linear Gradients
    const defs = svg.append('defs');
    
    // Ambient drop shadow
    const filter = defs.append('filter')
      .attr('id', 'd3-timeline-glow')
      .attr('x', '-20%').attr('y', '-20%')
      .attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale based on time extent
    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, innerWidth])
      .clamp(true);

    // X Axis with formatted year/month ticks
    const numTicks = Math.max(5, Math.floor(effectiveWidth / 90));
    const xAxis = d3.axisBottom(xScale)
      .ticks(numTicks)
      .tickFormat((d) => {
        const date = d as Date;
        if (viewFilter === 'activeMaha') {
          return d3.timeFormat('%b %Y')(date);
        }
        return d3.timeFormat('%Y')(date);
      })
      .tickSizeOuter(0)
      .tickSizeInner(6);

    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0, 142)`)
      .attr('class', 'text-[10px] font-mono opacity-80')
      .call(xAxis);

    xAxisGroup.selectAll('text').style('fill', '#94a3b8').style('font-family', 'monospace');
    xAxisGroup.selectAll('line').style('stroke', '#475569').style('stroke-dasharray', '2 2');
    xAxisGroup.select('.domain').style('stroke', '#64748b').style('stroke-width', '1.5');

    // Grid vertical lines across timeline
    const ticks = xScale.ticks(numTicks);
    g.selectAll('.grid-line')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', d => xScale(d))
      .attr('y1', 10)
      .attr('x2', d => xScale(d))
      .attr('y2', 138)
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '3 3')
      .attr('opacity', 0.4);

    // Track 1: Mahadashas (Y: 10, Height: 42)
    const mahaY = 12;
    const mahaHeight = 42;

    // Track 1 Label
    const track1Label = g.append('g').attr('class', 'select-none');
    track1Label.append('text')
      .attr('x', 0)
      .attr('y', -6)
      .attr('fill', '#fde68a')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('letter-spacing', '0.5px')
      .text(currentLang === 'kn' ? '೧. ಮಹಾದಶಾ ರೇಖೆ (Mahadashas • 120-Year Parashara Cycle)' : currentLang === 'hi' ? '१. महादशा कालक्रम (१२० वर्षीय पाराशर चक्र)' : '1. Linear Mahadasha Timeline (120-Year Parashari Cycle)');

    // Track 2 Label
    const track2Label = g.append('g').attr('class', 'select-none');
    track2Label.append('text')
      .attr('x', 0)
      .attr('y', 72)
      .attr('fill', '#93c5fd')
      .attr('font-size', '10.5px')
      .attr('font-weight', 'bold')
      .text(
        currentLang === 'kn'
          ? `೨. ಅಂತರ್ದಶೆಗಳ ರೇಖೆ: ${selectedMaha.lord.sanskrit[currentLang]} (${selectedMaha.durationYears} ವರ್ಷಗಳು)`
          : currentLang === 'hi'
          ? `२. अन्तर्दशा खण्ड: ${selectedMaha.lord.sanskrit[currentLang]} (${selectedMaha.durationYears} वर्ष)`
          : `2. Antardashas within ${selectedMaha.lord.name} Mahadasha (${selectedMaha.durationYears} Years)`
      );

    // Connecting trapezoid / visual bracket showing how Track 2 Antardashas expand from Track 1 Mahadasha
    if (viewFilter === 'all') {
      const selectedStartX = Math.max(0, xScale(new Date(selectedMaha.startDate)));
      const selectedEndX = Math.min(innerWidth, xScale(new Date(selectedMaha.endDate)));
      
      if (selectedEndX > selectedStartX) {
        g.append('path')
          .attr('d', `
            M ${selectedStartX} ${mahaY + mahaHeight}
            L ${selectedEndX} ${mahaY + mahaHeight}
            L ${selectedEndX} 82
            L ${selectedStartX} 82
            Z
          `)
          .attr('fill', selectedMaha.lord.color)
          .attr('fill-opacity', 0.12)
          .attr('stroke', selectedMaha.lord.color)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2 2')
          .attr('pointer-events', 'none');
      }
    }

    // Draw Mahadasha Linear Rectangles
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
      const renderX = Math.max(0, startX);
      const renderWidth = Math.min(innerWidth - renderX, segWidth);

      const rect = segGroup.append('rect')
        .attr('x', renderX)
        .attr('y', mahaY)
        .attr('width', Math.max(1, renderWidth))
        .attr('height', mahaHeight)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', maha.lord.color)
        .attr('fill-opacity', isSelected ? 0.95 : isCurrent ? 0.85 : 0.6)
        .attr('stroke', isSelected ? '#ffffff' : isCurrent ? '#fbbf24' : '#0f172a')
        .attr('stroke-width', isSelected ? 2.5 : isCurrent ? 2 : 1)
        .style('transition', 'all 0.15s ease');

      // Segment Text Label (Name + Duration)
      if (renderWidth > 36) {
        const textGroup = segGroup.append('text')
          .attr('x', renderX + renderWidth / 2)
          .attr('y', mahaY + mahaHeight / 2 + 1)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('pointer-events', 'none')
          .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)');

        textGroup.append('tspan')
          .attr('x', renderX + renderWidth / 2)
          .attr('dy', '-0.1em')
          .attr('font-size', renderWidth > 64 ? '11px' : '9.5px')
          .attr('font-weight', 'bold')
          .text(maha.lord.sanskrit[currentLang].split(' ')[0]);

        if (renderWidth > 58) {
          textGroup.append('tspan')
            .attr('x', renderX + renderWidth / 2)
            .attr('dy', '1.15em')
            .attr('font-size', '8.5px')
            .attr('font-family', 'monospace')
            .attr('opacity', 0.9)
            .text(`${maha.durationYears}y`);
        }
      }

      // Active indicator star / crown on current Mahadasha
      if (isCurrent && renderWidth > 20) {
        segGroup.append('circle')
          .attr('cx', renderX + 8)
          .attr('cy', mahaY + 8)
          .attr('r', 3)
          .attr('fill', '#fbbf24')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1)
          .attr('pointer-events', 'none');
      }

      // Hover and Click events
      segGroup
        .on('mouseenter', (event) => {
          rect.attr('fill-opacity', 1).attr('stroke', '#ffffff').attr('stroke-width', 2.5);
          const [mx, my] = d3.pointer(event, containerRef.current);
          setHoveredSegment({
            type: 'mahadasha',
            lord: maha.lord.name,
            lordSanskrit: maha.lord.sanskrit[currentLang],
            start: new Date(maha.startDate),
            end: new Date(maha.endDate),
            duration: `${maha.durationYears} ${currentLang === 'kn' ? 'ವರ್ಷಗಳು' : 'Years'} (${maha.antardashas.length} Antardashas)`,
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

    // Track 2: Antardashas of the Selected Mahadasha (Y: 86, Height: 34)
    const antarY = 86;
    const antarHeight = 34;

    selectedMaha.antardashas.forEach((antar) => {
      const startX = xScale(new Date(antar.startDate));
      const endX = xScale(new Date(antar.endDate));
      const segWidth = Math.max(1, endX - startX);

      if (endX < 0 || startX > innerWidth) return;

      const isCurrent = antar.isCurrent;
      const renderX = Math.max(0, startX);
      const renderWidth = Math.min(innerWidth - renderX, segWidth);

      const segGroup = g.append('g').attr('class', 'cursor-pointer');

      const rect = segGroup.append('rect')
        .attr('x', renderX)
        .attr('y', antarY)
        .attr('width', Math.max(1, renderWidth))
        .attr('height', antarHeight)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', antar.lord.color)
        .attr('fill-opacity', isCurrent ? 0.95 : 0.72)
        .attr('stroke', isCurrent ? '#fbbf24' : '#1e293b')
        .attr('stroke-width', isCurrent ? 2 : 1)
        .style('transition', 'all 0.15s ease');

      // Text label on Antardasha
      if (renderWidth > 26) {
        const textGroup = segGroup.append('text')
          .attr('x', renderX + renderWidth / 2)
          .attr('y', antarY + antarHeight / 2 + 1)
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('pointer-events', 'none')
          .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)');

        textGroup.append('tspan')
          .attr('x', renderX + renderWidth / 2)
          .attr('dy', renderWidth > 48 ? '-0.1em' : '0.3em')
          .attr('font-size', renderWidth > 48 ? '10px' : '8.5px')
          .attr('font-weight', 'bold')
          .text(antar.lord.sanskrit[currentLang].split(' ')[0]);

        if (renderWidth > 48) {
          textGroup.append('tspan')
            .attr('x', renderX + renderWidth / 2)
            .attr('dy', '1.15em')
            .attr('font-size', '8px')
            .attr('font-family', 'monospace')
            .attr('opacity', 0.9)
            .text(`${antar.durationMonths}m`);
        }
      }

      segGroup
        .on('mouseenter', (event) => {
          rect.attr('fill-opacity', 1).attr('stroke', '#ffffff').attr('stroke-width', 2);
          const [mx, my] = d3.pointer(event, containerRef.current);
          setHoveredSegment({
            type: 'antardasha',
            lord: `${selectedMaha.lord.name} - ${antar.lord.name}`,
            lordSanskrit: `${selectedMaha.lord.sanskrit[currentLang]} / ${antar.lord.sanskrit[currentLang]}`,
            start: new Date(antar.startDate),
            end: new Date(antar.endDate),
            duration: `${antar.durationMonths} ${currentLang === 'kn' ? 'ತಿಂಗಳುಗಳು' : 'Months'} (${antar.durationDays} days)`,
            isCurrent: antar.isCurrent,
            color: antar.lord.color,
            x: mx,
            y: my
          });
        })
        .on('mouseleave', () => {
          rect
            .attr('fill-opacity', isCurrent ? 0.95 : 0.72)
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
        .attr('y1', 4)
        .attr('x2', targetDateX)
        .attr('y2', 142)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', 'none')
        .attr('filter', 'url(#d3-timeline-glow)');

      // Top Needle Indicator Flag
      nowGroup.append('polygon')
        .attr('points', `${targetDateX - 6},2 ${targetDateX + 6},2 ${targetDateX},9`)
        .attr('fill', '#ef4444');

      // Bottom Badge with NOW text
      nowGroup.append('rect')
        .attr('x', targetDateX - 22)
        .attr('y', 145)
        .attr('width', 44)
        .attr('height', 16)
        .attr('rx', 4)
        .attr('fill', '#ef4444')
        .attr('filter', 'url(#d3-timeline-glow)');

      nowGroup.append('text')
        .attr('x', targetDateX)
        .attr('y', 157)
        .attr('fill', '#ffffff')
        .attr('font-size', '8.5px')
        .attr('font-weight', 'black')
        .attr('letter-spacing', '0.5px')
        .attr('text-anchor', 'middle')
        .text('NOW');
    }

  }, [timeExtent, dashaResult, selectedMaha, selectedDate, currentLang, viewFilter, containerWidth]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-indigo-950 border border-stone-800 p-4 sm:p-5 text-white shadow-xl space-y-4 relative">
      
      {/* Header with Title and Linear Filter Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-inner shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-serif font-black text-sm sm:text-base text-amber-200">
                {currentLang === 'kn'
                  ? 'ಡಿ೩ ಇಂಟರಾಕ್ಟಿವ್ ದಶಾ ರೇಖಾಚಿತ್ರ (D3.js Linear Timeline)'
                  : currentLang === 'hi'
                  ? 'डी३ इंटरैक्टिव दशा कालक्रम (D3.js Linear Timeline)'
                  : 'Interactive Parashara Dasha Timeline (D3.js)'}
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Responsive D3
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {currentLang === 'kn'
                ? '೧೨೦ ವರ್ಷಗಳ ಮಾನವ ಆಯುಷ್ಯದ ಮಹಾದಶಾ ಮತ್ತು ಅಂತರ್ದಶಾ ಅವಧಿಗಳ ರೇಖೀಯ ನಕ್ಷೆ (Linear Duration Mapping)'
                : 'Linear mapping of planetary durations across the 120-year Parashara Vimshottari cycle'}
            </p>
          </div>
        </div>

        {/* Viewport Range Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-900/90 p-1 rounded-xl border border-stone-700/80 text-xs">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewFilter === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="View complete 120-year timeline"
          >
            {currentLang === 'kn' ? '೧೨೦ ವರ್ಷ (All)' : '120 Years'}
          </button>

          <button
            onClick={() => setViewFilter('activeMaha')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewFilter === 'activeMaha'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title={`Focus on active ${selectedMaha.lord.name} Mahadasha`}
          >
            {selectedMaha.lord.sanskrit[currentLang].split(' ')[0]} ({selectedMaha.durationYears}y)
          </button>

          <button
            onClick={() => setViewFilter('tenYears')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewFilter === 'tenYears'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Focus on ±5 years window around current date"
          >
            ±5 {currentLang === 'kn' ? 'ವರ್ಷ' : 'Yrs'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Container with horizontal touch scroll support */}
      <div 
        ref={containerRef} 
        className="w-full relative overflow-x-auto select-none pt-1 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900"
      >
        <svg ref={svgRef} className="w-full h-auto drop-shadow-md min-w-[680px]" />

        {/* Hover Floating Tooltip */}
        {hoveredSegment && (
          <div
            className="absolute z-30 pointer-events-none p-3 rounded-2xl bg-stone-900/95 border-2 border-amber-400 text-white text-xs shadow-2xl backdrop-blur-md max-w-xs transition-opacity animate-in fade-in"
            style={{
              left: Math.min(Math.max(12, hoveredSegment.x - 80), (containerWidth || 320) - 180),
              top: Math.max(0, hoveredSegment.y - 95)
            }}
          >
            <div className="flex items-center gap-2 mb-1.5 border-b border-stone-800 pb-1">
              <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: hoveredSegment.color }} />
              <strong className="text-amber-300 font-serif text-sm">{hoveredSegment.lordSanskrit}</strong>
              {hoveredSegment.isCurrent && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black uppercase tracking-wider ml-auto">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{formatDate(hoveredSegment.start)} ➔ {formatDate(hoveredSegment.end)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{hoveredSegment.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation & Graha Duration Legend */}
      <div className="space-y-2 pt-1 border-t border-stone-800 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400/40" />
              <strong className="text-stone-300">{currentLang === 'kn' ? 'ಇಂದಿನ ದಿನಾಂಕ' : 'Current Date (Now)'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-300/40" />
              <strong className="text-stone-300">{currentLang === 'kn' ? 'ಆಯ್ದ ಮಹಾದಶಾ' : 'Selected Mahadasha Window'}</strong>
            </span>
          </div>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showLegend ? (currentLang === 'kn' ? 'ವರ್ಣ ವಿವರ ಮರೆಮಾಡಿ' : 'Hide Lord Legend') : (currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ವರ್ಷಾವಧಿ ವಿವರ' : 'View 9 Graha Cycles (120y)')}</span>
          </button>
        </div>

        {/* 9 Grahas Canonical Duration Legend Strip */}
        {showLegend && (
          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-center animate-in fade-in">
            {DASHA_LORDS.map((lord) => (
              <div key={lord.name} className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[10px]">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lord.color }} />
                  <span className="font-bold text-stone-200 truncate">{lord.sanskrit[currentLang].split(' ')[0]}</span>
                </div>
                <div className="font-mono text-amber-400 font-extrabold">{lord.years}y</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
