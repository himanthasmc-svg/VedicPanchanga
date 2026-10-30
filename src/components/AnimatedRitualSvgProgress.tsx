import React, { useMemo } from 'react';
import { Check, Sparkles, Droplets, Flame, BookOpen, Gift, RotateCcw, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { RITUAL_STEPS, RitualStepMeta } from './RitualProgressIndicator';

export interface AnimatedRitualSvgProgressProps {
  currentLang: Language;
  activeStep: number; // 1 to 6
  completedSteps: number[]; // array of stepNumbers
  onStepSelect: (stepNumber: number, tabKey: any) => void;
  onToggleComplete: (stepNumber: number) => void;
}

export const AnimatedRitualSvgProgress: React.FC<AnimatedRitualSvgProgressProps> = ({
  currentLang,
  activeStep,
  completedSteps,
  onStepSelect,
  onToggleComplete
}) => {
  const totalSteps = RITUAL_STEPS.length;
  const completedCount = completedSteps.length;
  const percentComplete = Math.round((completedCount / totalSteps) * 100);

  // Calculate coordinates along the SVG horizontal timeline (viewBox 0 0 760 110)
  // 6 nodes spaced horizontally: x = 60, 192, 324, 456, 588, 700 (or evenly across 760)
  const nodeCoords = useMemo(() => {
    const startX = 65;
    const endX = 695;
    const spacing = (endX - startX) / (totalSteps - 1);
    return RITUAL_STEPS.map((_, i) => ({
      x: startX + i * spacing,
      y: 50
    }));
  }, [totalSteps]);

  // Compute filled path length: fills up to activeStep or completed steps
  const maxReachedIndex = useMemo(() => {
    let maxIdx = activeStep - 1;
    completedSteps.forEach(s => {
      if (s - 1 > maxIdx) maxIdx = s - 1;
    });
    return Math.max(0, Math.min(totalSteps - 1, maxIdx));
  }, [activeStep, completedSteps, totalSteps]);

  const activeCoord = nodeCoords[activeStep - 1] || nodeCoords[0];
  const filledEndX = nodeCoords[maxReachedIndex]?.x || nodeCoords[0].x;

  return (
    <div className="w-full select-none">
      
      {/* Interactive Responsive Animated SVG */}
      <div className="w-full overflow-x-auto scrollbar-none py-1">
        <div className="min-w-[620px] sm:min-w-full">
          <svg
            viewBox="0 0 760 106"
            className="w-full h-auto drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="sacred-river-bg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#292524" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#44403c" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#292524" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="sacred-river-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>

              <linearGradient id="active-pulse-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              <radialGradient id="node-active-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="85%" stopColor="#d97706" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="node-done-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Filters */}
              <filter id="svg-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Liquid Wave Ripple Pattern for Completed Step Medallions */}
              <clipPath id="circle-clip-base">
                <circle cx="0" cy="0" r="22" />
              </clipPath>
            </defs>

            {/* ============================================================= */}
            {/* 1. BACKGROUND SACRED PATHWAY TRACK (DARK CHANNEL) */}
            {/* ============================================================= */}
            <path
              d={`M ${nodeCoords[0].x} 50 L ${nodeCoords[nodeCoords.length - 1].x} 50`}
              stroke="url(#sacred-river-bg)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Subtle inner guideline */}
            <path
              d={`M ${nodeCoords[0].x} 50 L ${nodeCoords[nodeCoords.length - 1].x} 50`}
              stroke="#57534e"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* ============================================================= */}
            {/* 2. FLUID ANIMATED FILLED LIQUID STREAM (AMRITA ENERGY FLOW) */}
            {/* ============================================================= */}
            {filledEndX > nodeCoords[0].x && (
              <g>
                {/* Glow under-layer */}
                <path
                  d={`M ${nodeCoords[0].x} 50 L ${filledEndX} 50`}
                  stroke="url(#sacred-river-fill)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  opacity="0.4"
                  filter="url(#svg-glow)"
                />
                {/* Main filled stream */}
                <path
                  d={`M ${nodeCoords[0].x} 50 L ${filledEndX} 50`}
                  stroke="url(#sacred-river-fill)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Flowing particle dash overlay */}
                <path
                  d={`M ${nodeCoords[0].x} 50 L ${filledEndX} 50`}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                  opacity="0.8"
                >
                  <animate attributeName="stroke-dashoffset" from="56" to="0" dur="1.2s" repeatCount="indefinite" />
                </path>
              </g>
            )}

            {/* ============================================================= */}
            {/* 3. FLUID ENERGY BEACON TRAVELING TO ACTIVE NODE */}
            {/* ============================================================= */}
            <circle cx={activeCoord.x} cy="50" r="18" fill="url(#node-active-halo)">
              <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* ============================================================= */}
            {/* 4. RITUAL STEP NODES (MEDALLIONS ALONG THE STREAM) */}
            {/* ============================================================= */}
            {RITUAL_STEPS.map((step, idx) => {
              const coord = nodeCoords[idx];
              const isDone = completedSteps.includes(step.stepNumber);
              const isActive = step.stepNumber === activeStep;

              return (
                <g
                  key={step.id}
                  transform={`translate(${coord.x}, ${coord.y})`}
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => onStepSelect(step.stepNumber, step.tabKey)}
                >
                  {/* Outer Pulsing Halo when active */}
                  {isActive && (
                    <circle r="26" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" opacity="0.9">
                      <animate attributeName="r" values="22;28;22" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="stroke-dashoffset" from="28" to="0" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Completed Green Halo */}
                  {isDone && (
                    <circle r="24" fill="url(#node-done-halo)" opacity="0.7">
                      <animate attributeName="r" values="22;25;22" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Medallion Base Circle */}
                  <circle
                    r="20"
                    fill={isDone ? '#064e3b' : isActive ? '#78350f' : '#1c1917'}
                    stroke={isDone ? '#34d399' : isActive ? '#fbbf24' : '#44403c'}
                    strokeWidth={isActive ? '3' : isDone ? '2.5' : '2'}
                    filter={isActive || isDone ? 'url(#svg-glow)' : undefined}
                  />

                  {/* Fluid Fill Animation Simulation inside Circle Clip */}
                  {isDone ? (
                    <g clipPath="url(#circle-clip-base)">
                      {/* Fluid wave in emerald green */}
                      <rect x="-24" y="-24" width="48" height="48" fill="#059669" opacity="0.45" />
                      <path
                        d="M -24 4 Q -12 -2 0 4 Q 12 10 24 4 L 24 24 L -24 24 Z"
                        fill="#10b981"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="d"
                          values="
                            M -24 4 Q -12 -2 0 4 Q 12 10 24 4 L 24 24 L -24 24 Z;
                            M -24 4 Q -12 10 0 4 Q 12 -2 24 4 L 24 24 L -24 24 Z;
                            M -24 4 Q -12 -2 0 4 Q 12 10 24 4 L 24 24 L -24 24 Z
                          "
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  ) : isActive ? (
                    <g clipPath="url(#circle-clip-base)">
                      {/* Fluid golden wave for currently active step */}
                      <path
                        d="M -24 6 Q -12 2 0 6 Q 12 10 24 6 L 24 24 L -24 24 Z"
                        fill="#f59e0b"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="d"
                          values="
                            M -24 6 Q -12 2 0 6 Q 12 10 24 6 L 24 24 L -24 24 Z;
                            M -24 6 Q -12 10 0 6 Q 12 2 24 6 L 24 24 L -24 24 Z;
                            M -24 6 Q -12 2 0 6 Q 12 10 24 6 L 24 24 L -24 24 Z
                          "
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  ) : null}

                  {/* Node Icon / Checkmark */}
                  {isDone ? (
                    <text y="5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ffffff">
                      ✓
                    </text>
                  ) : (
                    <text y="5" textAnchor="middle" fontSize="13" pointerEvents="none">
                      {step.icon}
                    </text>
                  )}

                  {/* Step Number Tag Above Node */}
                  <g transform="translate(0, -26)">
                    <rect
                      x="-13"
                      y="-8"
                      width="26"
                      height="15"
                      rx="7.5"
                      fill={isActive ? '#f59e0b' : isDone ? '#10b981' : '#292524'}
                      stroke={isActive ? '#fef08a' : isDone ? '#6ee7b7' : '#57534e'}
                      strokeWidth="1"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={isActive ? '#1c1917' : '#ffffff'}
                    >
                      {step.stepNumber}
                    </text>
                  </g>

                  {/* Step Title Label Below Node */}
                  <text
                    y="36"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="serif"
                    fontWeight={isActive ? '900' : isDone ? '700' : '500'}
                    fill={isActive ? '#fef08a' : isDone ? '#6ee7b7' : '#a8a29e'}
                  >
                    {step.name[currentLang].split('(')[0].replace(/^[೧-೬1-6]\.\s*/, '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Synchronous Interactive Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
        
        {/* Left: Overall Circular Radial Progress Indicator & Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Circular Radial Gauge */}
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-stone-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500 transition-all duration-500 ease-out"
                strokeDasharray={`${percentComplete}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-amber-300">
              {percentComplete}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-200">
                {currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಿ ಅನುಷ್ಠಾನ ಪ್ರಗತಿ' : currentLang === 'hi' ? 'पूजा विधान अनुष्ठान प्रगति' : 'Ritual Fulfillment Stream'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {completedCount} / {totalSteps} {currentLang === 'kn' ? 'ಮುಗಿದಿದೆ' : 'Steps Done'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 truncate max-w-sm">
              {RITUAL_STEPS[activeStep - 1]?.actionSummary[currentLang]}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Toggle for Current Step */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onToggleComplete(activeStep)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              completedSteps.includes(activeStep)
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {completedSteps.includes(activeStep)
                ? (currentLang === 'kn' ? 'ಹಂತ ಪೂರ್ಣಗೊಂಡಿದೆ ✓' : 'Step Completed ✓')
                : (currentLang === 'kn' ? 'ಈ ಹಂತವನ್ನು ಮುಗಿಸಿ' : 'Mark Step Complete')}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
