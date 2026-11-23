import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  ArrowRight,
  Compass,
  ShieldCheck,
  Target,
  Gem
} from 'lucide-react';
import { Language } from '../types';
import {
  VimshottariDashaResult,
  MahadashaPeriod,
  AntardashaPeriod
} from '../utils/vimshottariDasha';
import { SvgGrahaIcon } from './RealisticGraha';
import { MAHADASHA_EFFECTS } from '../utils/dashaEffects';

interface DashaHorizontalTimelineProps {
  dashaResult: VimshottariDashaResult;
  birthDateStr: string;
  currentLang: Language;
  selectedDate: Date;
  onSelectMahadasha?: (maha: MahadashaPeriod) => void;
  onSelectAntardasha?: (antar: AntardashaPeriod) => void;
  onInspectShiftDate?: (dateStr: string) => void;
}

export const DashaHorizontalTimeline: React.FC<DashaHorizontalTimelineProps> = ({
  dashaResult,
  birthDateStr,
  currentLang,
  selectedDate,
  onSelectMahadasha,
  onSelectAntardasha,
  onInspectShiftDate
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    const idx = dashaResult.mahadashas.findIndex((m) => m.isCurrent);
    return idx !== -1 ? idx : 0;
  }, [dashaResult]);

  const [selectedIndex, setSelectedIndex] = useState<number>(activeIndex);

  useEffect(() => {
    setSelectedIndex(activeIndex);
  }, [activeIndex]);

  const birthDateObj = useMemo(() => {
    const parsed = new Date(`${birthDateStr}T12:00:00`);
    return isNaN(parsed.getTime())
      ? dashaResult.mahadashas[0]?.startDate || new Date()
      : parsed;
  }, [birthDateStr, dashaResult]);

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString(
      currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  const getAgeLabel = (targetDate: Date) => {
    const diffMs = Math.max(0, targetDate.getTime() - birthDateObj.getTime());
    const totalMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));
    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    if (yrs === 0 && mos === 0) {
      return currentLang === 'kn' ? 'ಜನ್ಮ' : currentLang === 'hi' ? 'जन्म' : 'Birth';
    }
    if (currentLang === 'kn') return `${yrs} ವ ${mos > 0 ? `${mos} ತಿ` : ''}`.trim();
    if (currentLang === 'hi') return `${yrs} व ${mos > 0 ? `${mos} मा` : ''}`.trim();
    return `${yrs}y ${mos > 0 ? `${mos}m` : ''}`.trim();
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -320 : 320;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToNode = (index: number) => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current.querySelector(
      `[data-shift-node="${index}"]`
    ) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Auto-center active Mahadasha node on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current.querySelector(
          `[data-shift-node="${activeIndex}"]`
        ) as HTMLElement | null;
        if (el) {
          const container = scrollContainerRef.current;
          const targetScroll =
            el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
          container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const selectedMaha = dashaResult.mahadashas[selectedIndex] || dashaResult.currentMahadasha;
  const previousMaha = selectedIndex > 0 ? dashaResult.mahadashas[selectedIndex - 1] : null;
  const selectedEffect = MAHADASHA_EFFECTS[selectedMaha.lord.name];

  const handleNodeClick = (maha: MahadashaPeriod, idx: number) => {
    setSelectedIndex(idx);
    scrollToNode(idx);
    if (onSelectMahadasha) {
      onSelectMahadasha(maha);
    }
  };

  return (
    <section
      aria-label="Horizontal Vimshottari Mahadasha Shift Timeline"
      className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-6 shadow-sm space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
            <span>
              {currentLang === 'kn'
                ? '೧೨೦ ವರ್ಷಗಳ ಪರಾಶರ ಚಕ್ರ'
                : currentLang === 'hi'
                ? '१२० वर्षीय पाराशर चक्र'
                : '120-Year Parashara Cycle'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {dashaResult.mahadashas.length}{' '}
              {currentLang === 'kn'
                ? 'ಮಹಾದಶಾ ಪರಿವರ್ತನೆಗಳು'
                : currentLang === 'hi'
                ? 'महादशा परिवर्तन'
                : 'Major Mahadasha Shifts'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            {currentLang === 'kn'
              ? 'ಅಡ್ಡ ಮಹಾದಶಾ ಪರಿವರ್ತನಾ ಕಾಲರೇಖೆ (ಗ್ರಹ ಚಿಹ್ನೆಗಳೊಂದಿಗೆ)'
              : currentLang === 'hi'
              ? 'क्षैतिज महादशा परिवर्तन समयरेखा (ग्रह प्रतीकों सहित)'
              : 'Horizontal Mahadasha Shift Timeline'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
            {currentLang === 'kn'
              ? 'ಪ್ರತಿ ಮಹಾದಶಾ ಅವಧಿಯ ಅಧಿಪತಿ ಗ್ರಹದ ಚಿಹ್ನೆ ಮತ್ತು ಪರಿವರ್ತನಾ ದಿನಾಂಕವನ್ನು ವೀಕ್ಷಿಸಿ. ವಿವರಗಳಿಗಾಗಿ ಯಾವುದೇ ಗ್ರಹದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.'
              : currentLang === 'hi'
              ? 'प्रत्येक महादशा के स्वामी ग्रह के प्रतीक और परिवर्तन तिथि को देखें। विवरण के लिए किसी भी ग्रह पर क्लिक करें।'
              : 'Track every major Mahadasha shift across your lifespan with planetary ruler icons. Select any shift node to inspect transition dates and Antardasha sub-periods.'}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setSelectedIndex(activeIndex);
              scrollToNode(activeIndex);
              if (onSelectMahadasha && dashaResult.mahadashas[activeIndex]) {
                onSelectMahadasha(dashaResult.mahadashas[activeIndex]);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Target className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn'
                ? 'ಪ್ರಸ್ತುತ ದಶಾ'
                : currentLang === 'hi'
                ? 'वर्तमान दशा'
                : 'Active Shift'}
            </span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              aria-label="Scroll timeline left"
              className="w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              aria-label="Scroll timeline right"
              className="w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Planetary Shift Track */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 pt-2 scroll-smooth"
        >
          <div className="relative inline-flex items-stretch min-w-max px-2 sm:px-4">
            {/* Continuous Horizontal Baseline Spine */}
            <div
              className="absolute left-12 right-12 top-[68px] h-1 bg-stone-200 dark:bg-stone-700 rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {dashaResult.mahadashas.map((maha, idx) => {
              const isSelected = idx === selectedIndex;
              const isPast = maha.endDate < selectedDate && !maha.isCurrent;
              const isCurrent = maha.isCurrent;
              const prevLord = idx > 0 ? dashaResult.mahadashas[idx - 1].lord : null;
              const statusText = isCurrent
                ? currentLang === 'kn'
                  ? 'ಸಕ್ರಿಯ'
                  : currentLang === 'hi'
                  ? 'सक्रिय'
                  : 'Active'
                : isPast
                ? currentLang === 'kn'
                  ? 'ಮುಗಿದಿದೆ'
                  : currentLang === 'hi'
                  ? 'पूर्ण'
                  : 'Past'
                : currentLang === 'kn'
                ? 'ಮುಂದಿನ'
                : currentLang === 'hi'
                ? 'आगामी'
                : 'Upcoming';

              return (
                <div
                  key={`h-shift-${idx}-${maha.lord.name}`}
                  data-shift-node={idx}
                  className="relative flex flex-col items-center w-[176px] sm:w-[192px] shrink-0 px-2"
                >
                  {/* Completed Progress Connector Segment before current or past nodes */}
                  {idx > 0 && (isPast || isCurrent) && (
                    <div
                      className="absolute left-0 right-1/2 top-[68px] h-1 bg-amber-500 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                  {idx < dashaResult.mahadashas.length - 1 && isPast && (
                    <div
                      className="absolute left-1/2 right-0 top-[68px] h-1 bg-amber-500 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  {/* Top Shift Date & Transition Callout */}
                  <div className="text-center mb-2 h-9 flex flex-col justify-end">
                    <span className="text-[11px] font-mono font-bold tabular-nums text-stone-900 dark:text-stone-100 whitespace-nowrap">
                      {maha.startDate.getFullYear()} · {getAgeLabel(maha.startDate)}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[164px]">
                      {idx === 0
                        ? currentLang === 'kn'
                          ? 'ಜನ್ಮ ದಶಾ ಆರಂಭ'
                          : currentLang === 'hi'
                          ? 'जन्म दशा प्रारंभ'
                          : 'Birth Epoch'
                        : `${prevLord?.symbol || ''} → ${maha.lord.symbol} ${
                            currentLang === 'kn'
                              ? 'ಪರಿವರ್ತನೆ'
                              : currentLang === 'hi'
                              ? 'संक्रमण'
                              : 'Shift'
                          }`}
                    </span>
                  </div>

                  {/* Interactive Planet Medallion Node */}
                  <button
                    type="button"
                    onClick={() => handleNodeClick(maha, idx)}
                    aria-pressed={isSelected}
                    className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900 ${
                      isSelected
                        ? 'scale-105 bg-stone-900 dark:bg-stone-950 border-2 border-amber-500 shadow-md'
                        : isCurrent
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-500 hover:scale-105'
                        : isPast
                        ? 'bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 hover:border-amber-400 hover:scale-105'
                        : 'bg-white dark:bg-stone-850 border border-stone-300 dark:border-stone-700 hover:border-amber-400 hover:scale-105'
                    }`}
                  >
                    <SvgGrahaIcon name={maha.lord.name} size={42} />

                    {/* Shift Index Corner Marker */}
                    <span
                      className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-mono font-bold tabular-nums flex items-center justify-center border ${
                        isCurrent
                          ? 'bg-amber-600 text-white border-amber-400'
                          : isSelected
                          ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 border-amber-400'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>

                  {/* Vertical Connector Tick */}
                  <div
                    className={`w-px h-3 my-1 ${
                      isSelected || isCurrent
                        ? 'bg-amber-500'
                        : 'bg-stone-200 dark:bg-stone-700'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Bottom Info Card under Node */}
                  <button
                    type="button"
                    onClick={() => handleNodeClick(maha, idx)}
                    className={`w-full text-left rounded-2xl p-2.5 border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-500'
                        : isCurrent
                        ? 'bg-stone-50 dark:bg-stone-800/80 border-amber-400/70'
                        : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 truncate">
                        {maha.lord.sanskrit[currentLang]}
                      </span>
                      <span className="text-[10px] font-mono font-bold tabular-nums text-amber-700 dark:text-amber-400 shrink-0">
                        {maha.durationYears}y
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                      <span>{formatShortDate(maha.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                      <span>→ {formatShortDate(maha.endDate)}</span>
                    </div>

                    {/* Text-first Semantic Status Line */}
                    <div className="mt-2 pt-1.5 border-t border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between text-[10px] font-semibold">
                      <span
                        className={
                          isCurrent
                            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                            : isPast
                            ? 'text-stone-500 dark:text-stone-400'
                            : 'text-amber-700 dark:text-amber-400'
                        }
                      >
                        {isCurrent ? '● ' : ''}
                        {statusText}
                      </span>
                      {isCurrent && (
                        <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">
                          {dashaResult.progress.mahadashaPercent}%
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Mahadasha Shift Inspector Panel */}
      {selectedMaha && (
        <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-700 pb-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-stone-900 dark:bg-stone-950 border border-amber-500/50 flex items-center justify-center shrink-0">
                <SvgGrahaIcon name={selectedMaha.lord.name} size={40} />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                  {previousMaha ? (
                    <>
                      <span>{previousMaha.lord.sanskrit[currentLang]}</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {selectedMaha.lord.sanskrit[currentLang]}
                      </span>
                    </>
                  ) : (
                    <span>
                      {currentLang === 'kn'
                        ? 'ಜನ್ಮ ನಕ್ಷತ್ರ ಪ್ರಥಮ ಮಹಾದಶಾ'
                        : currentLang === 'hi'
                        ? 'जन्म नक्षत्र प्रथम महादशा'
                        : 'Initial Janma Nakshatra Mahadasha'}
                    </span>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>
                    {selectedMaha.durationYears}{' '}
                    {currentLang === 'kn'
                      ? 'ವರ್ಷಗಳು'
                      : currentLang === 'hi'
                      ? 'वर्ष'
                      : 'Years'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
                  {selectedMaha.lord.sanskrit[currentLang]}{' '}
                  {currentLang === 'kn'
                    ? 'ಮಹಾದಶಾ'
                    : currentLang === 'hi'
                    ? 'महादशा'
                    : 'Mahadasha'}
                </h3>
                <div className="text-xs text-stone-600 dark:text-stone-400 font-mono tabular-nums flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    {formatShortDate(selectedMaha.startDate)} — {formatShortDate(selectedMaha.endDate)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {currentLang === 'kn' ? 'ವಯಸ್ಸು:' : currentLang === 'hi' ? 'आयु:' : 'Age:'}{' '}
                    {getAgeLabel(selectedMaha.startDate)} → {getAgeLabel(selectedMaha.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {onInspectShiftDate && (
              <button
                type="button"
                onClick={() =>
                  onInspectShiftDate(selectedMaha.startDate.toISOString().split('T')[0])
                }
                className="px-3.5 py-2 rounded-xl bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start lg:self-auto whitespace-nowrap shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'kn'
                    ? 'ಪರಿವರ್ತನಾ ದಿನಾಂಕ ಪರಿಶೀಲಿಸಿ'
                    : currentLang === 'hi'
                    ? 'परिवर्तन तिथि जाँचें'
                    : 'Inspect Shift Date'}
                </span>
              </button>
            )}
          </div>

          {/* Summary & Remedy Metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            <div className="lg:col-span-2 space-y-1.5">
              <div className="font-bold text-stone-900 dark:text-stone-100">
                {selectedEffect?.archetype[currentLang] ||
                  selectedMaha.lord.generalSignificance[currentLang]}
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                {selectedEffect?.generalEffects[currentLang] ||
                  selectedMaha.lord.generalSignificance[currentLang]}
              </p>
            </div>

            <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-700 pt-3 lg:pt-0 lg:pl-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಗ್ರಹ ಮಂತ್ರ' : currentLang === 'hi' ? 'ग्रह मंत्र' : 'Planetary Mantra'}
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {selectedMaha.lord.mantra[currentLang]}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Gem className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ರತ್ನ & ಶುಭ ವಾರ' : currentLang === 'hi' ? 'रत्न एवं शुभ वार' : 'Gemstone & Day'}
                  </div>
                  <div className="font-semibold text-stone-800 dark:text-stone-200">
                    {selectedMaha.lord.gemstone[currentLang]} · {selectedMaha.lord.auspiciousDay[currentLang]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Antardasha Sub-Shift Ribbon with Planet Icons */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {currentLang === 'kn'
                  ? `${selectedMaha.lord.sanskrit[currentLang]} ಮಹಾದಶಾದ ೯ ಅಂತರ್ದಶಾ (ಭುಕ್ತಿ) ಪರಿವರ್ತನೆಗಳು`
                  : currentLang === 'hi'
                  ? `${selectedMaha.lord.sanskrit[currentLang]} महादशा के ९ अन्तर्दशा (भुक्ति) परिवर्तन`
                  : `9 Antardasha (Bhukti) Sub-Shifts within ${selectedMaha.lord.name} Mahadasha`}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {currentLang === 'kn'
                  ? 'ಫಲ ವೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ'
                  : currentLang === 'hi'
                  ? 'प्रभाव हेतु क्लिक करें'
                  : 'Click to inspect effects'}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {selectedMaha.antardashas.map((antar, aIdx) => (
                <button
                  key={`sub-antar-${aIdx}-${antar.lord.name}`}
                  type="button"
                  onClick={() => {
                    if (onSelectMahadasha) onSelectMahadasha(selectedMaha);
                    if (onSelectAntardasha) onSelectAntardasha(antar);
                  }}
                  className={`flex flex-col items-center p-2 rounded-xl border text-center transition-colors cursor-pointer ${
                    antar.isCurrent
                      ? 'bg-amber-100/80 dark:bg-amber-950/50 border-amber-500 text-stone-900 dark:text-stone-100'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <SvgGrahaIcon name={antar.lord.name} size={24} />
                  <span className="text-[11px] font-bold mt-1 truncate max-w-full">
                    {antar.lord.sanskrit[currentLang]}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-stone-500 dark:text-stone-400">
                    {antar.startDate.getFullYear()}
                  </span>
                  <span className="text-[9px] font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    {antar.durationMonths}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
