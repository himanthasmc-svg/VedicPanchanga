import React from 'react';
import { Language } from '../types';

export interface RealisticGrahaProps {
  name: string;
  sanskritName?: string;
  degrees?: number;
  isRetrograde?: boolean;
  currentLang?: Language;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDegree?: boolean;
  showNameInside?: boolean;
  className?: string;
  onClick?: () => void;
}

// Localized planet labels
export const GRAHA_LOCALIZED_NAMES: Record<string, { en: string; kn: string; hi: string; fullEn: string }> = {
  Sun: { en: 'Sun', kn: 'ಸೂರ್ಯ', hi: 'सूर्य', fullEn: 'Surya (Sun)' },
  Moon: { en: 'Moon', kn: 'ಚಂದ್ರ', hi: 'चन्द्र', fullEn: 'Chandra (Moon)' },
  Mars: { en: 'Mars', kn: 'ಕುಜ', hi: 'मंगल', fullEn: 'Mangala / Kuja (Mars)' },
  Mercury: { en: 'Merc', kn: 'ಬುಧ', hi: 'बुध', fullEn: 'Budha (Mercury)' },
  Jupiter: { en: 'Guru', kn: 'ಗುರು', hi: 'गुरु', fullEn: 'Guru / Brihaspati (Jupiter)' },
  Venus: { en: 'Ven', kn: 'ಶುಕ್ರ', hi: 'शुक्र', fullEn: 'Shukra (Venus)' },
  Saturn: { en: 'Sat', kn: 'ಶನಿ', hi: 'शनि', fullEn: 'Shani (Saturn)' },
  Rahu: { en: 'Rahu', kn: 'ರಾಹು', hi: 'राहु', fullEn: 'Rahu (North Node)' },
  Ketu: { en: 'Ketu', kn: 'ಕೇತು', hi: 'केतु', fullEn: 'Ketu (South Node)' },
  Lagna: { en: 'Asc', kn: 'ಲಗ್ನ', hi: 'लग्न', fullEn: 'Lagna (Ascendant)' }
};

/**
 * Custom High-Quality SVG Graha Icon
 * Renders realistic planetary textures, corona rays, rings, craters, and atmospheric bands
 */
export const SvgGrahaIcon: React.FC<{
  name: string;
  size?: number;
  isRetrograde?: boolean;
  className?: string;
}> = ({ name, size = 32, isRetrograde = false, className = '' }) => {
  const cleanName = name.trim();
  const idPrefix = `graha-${cleanName.toLowerCase()}-${size}`;

  // Dimensions & scaling
  const viewBoxSize = 100;

  switch (cleanName) {
    case 'Sun':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(245,158,11,0.65)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-sun`} cx="38%" cy="35%" r="62%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <filter id={`${idPrefix}-blur`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
          </defs>
          {/* Outer Sun Corona Rays */}
          <circle cx="50" cy="50" r="48" fill={`url(#${idPrefix}-glow)`} />
          {/* Solar Flares around rim */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <polygon
              key={deg}
              points="50,6 53,16 47,16"
              fill="#fbbf24"
              opacity="0.85"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          {/* Sun Core Disc */}
          <circle cx="50" cy="50" r="32" fill={`url(#${idPrefix}-sun)`} />
          {/* Sun Granulation & Luminosity Highlights */}
          <circle cx="42" cy="40" r="14" fill="#ffffff" opacity="0.35" filter={`url(#${idPrefix}-blur)`} />
          <circle cx="36" cy="34" r="5" fill="#ffffff" opacity="0.65" />
        </svg>
      );

    case 'Moon':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(226,232,240,0.6)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-moon`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Soft Lunar Halo */}
          <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-glow)`} />
          {/* Moon Body */}
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-moon)`} />
          {/* Maria / Lunar Craters (Mare Tranquillitatis & Oceanus) */}
          <ellipse cx="40" cy="38" rx="8" ry="6" fill="#64748b" opacity="0.4" />
          <ellipse cx="60" cy="52" rx="10" ry="7" fill="#475569" opacity="0.45" />
          <circle cx="48" cy="62" r="5" fill="#475569" opacity="0.4" />
          <circle cx="34" cy="56" r="3.5" fill="#475569" opacity="0.3" />
          <circle cx="62" cy="36" r="4" fill="#475569" opacity="0.35" />
          {/* Specular Glint */}
          <circle cx="36" cy="32" r="7" fill="#ffffff" opacity="0.5" />
        </svg>
      );

    case 'Mars':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(234,88,12,0.6)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-mars`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="35%" stopColor="#ea580c" />
              <stop offset="70%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Mars Fiery Halo */}
          <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-glow)`} />
          {/* Mars Sphere */}
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-mars)`} />
          {/* Polar Ice Cap */}
          <ellipse cx="50" cy="20" rx="10" ry="4" fill="#fef2f2" opacity="0.85" />
          {/* Iron Oxide Dark Highlands / Valles Marineris Canyon */}
          <path
            d="M 32 46 Q 52 52 70 44 Q 54 62 32 46 Z"
            fill="#7f1d1d"
            opacity="0.6"
          />
          <ellipse cx="44" cy="62" rx="7" ry="4" fill="#450a0a" opacity="0.5" />
          {/* Highlights */}
          <circle cx="36" cy="32" r="6" fill="#ffedd5" opacity="0.4" />
        </svg>
      );

    case 'Mercury':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-merc`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#34d399" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Emerald Aura */}
          <circle cx="50" cy="50" r="45" fill={`url(#${idPrefix}-glow)`} />
          {/* Sphere */}
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-merc)`} />
          {/* Crater texture */}
          <circle cx="44" cy="42" r="6" fill="#065f46" opacity="0.5" />
          <circle cx="62" cy="54" r="5" fill="#047857" opacity="0.6" />
          <ellipse cx="36" cy="60" rx="4" ry="3" fill="#064e3b" opacity="0.4" />
          <circle cx="34" cy="30" r="7" fill="#ffffff" opacity="0.5" />
        </svg>
      );

    case 'Jupiter':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_9px_rgba(245,158,11,0.65)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-jup`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${idPrefix}-clip`}>
              <circle cx="50" cy="50" r="36" />
            </clipPath>
          </defs>
          {/* Royal Aura */}
          <circle cx="50" cy="50" r="47" fill={`url(#${idPrefix}-glow)`} />
          {/* Base Disc */}
          <circle cx="50" cy="50" r="36" fill={`url(#${idPrefix}-jup)`} />
          {/* Atmospheric Jovian Bands inside sphere */}
          <g clipPath={`url(#${idPrefix}-clip)`}>
            <rect x="10" y="28" width="80" height="7" fill="#92400e" opacity="0.4" />
            <rect x="10" y="42" width="80" height="10" fill="#78350f" opacity="0.5" />
            <rect x="10" y="60" width="80" height="8" fill="#92400e" opacity="0.45" />
            {/* The Great Red Spot (Anticyclonic Storm) */}
            <ellipse cx="64" cy="47" rx="8" ry="5" fill="#dc2626" opacity="0.85" />
            <ellipse cx="64" cy="47" rx="4" ry="2.5" fill="#b91c1c" />
          </g>
          {/* Highlight */}
          <circle cx="36" cy="30" r="8" fill="#ffffff" opacity="0.4" />
        </svg>
      );

    case 'Venus':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_9px_rgba(234,179,8,0.7)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-ven`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#fef08a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Radiant Dazzling Glow */}
          <circle cx="50" cy="50" r="47" fill={`url(#${idPrefix}-glow)`} />
          {/* Venus Cloud Atmosphere */}
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-ven)`} />
          {/* Swirling Golden Clouds */}
          <path
            d="M 24 45 Q 50 30 76 42 Q 50 56 24 45 Z"
            fill="#ca8a04"
            opacity="0.3"
          />
          {/* Diamond Specular Sparkle */}
          <polygon
            points="38,20 40,28 48,30 40,32 38,40 36,32 28,30 36,28"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>
      );

    case 'Saturn':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(148,163,184,0.6)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-sat`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id={`${idPrefix}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          {/* Back Ring Half */}
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="14"
            fill="none"
            stroke={`url(#${idPrefix}-ring)`}
            strokeWidth="5"
            transform="rotate(-25 50 50)"
            opacity="0.8"
          />
          {/* Saturn Body */}
          <circle cx="50" cy="50" r="30" fill={`url(#${idPrefix}-sat)`} />
          {/* Subtle Ring Shadow on Planet */}
          <ellipse
            cx="50"
            cy="50"
            rx="30"
            ry="4"
            fill="#0f172a"
            opacity="0.5"
            transform="rotate(-25 50 50)"
          />
          {/* Front Ring Half (Masked/Drawn over front) */}
          <path
            d="M 12 66 A 46 14 0 0 0 88 34"
            fill="none"
            stroke={`url(#${idPrefix}-ring)`}
            strokeWidth="5"
            transform="rotate(-25 50 50)"
            opacity="0.95"
          />
          {/* Thin Outer Cassini Ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="49"
            ry="16"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.2"
            transform="rotate(-25 50 50)"
            opacity="0.6"
          />
        </svg>
      );

    case 'Rahu':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(147,51,234,0.7)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-rahu`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="35%" stopColor="#7c3aed" />
              <stop offset="70%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#09090b" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Eclipse Corona Halo */}
          <circle cx="50" cy="50" r="47" fill={`url(#${idPrefix}-glow)`} />
          {/* Eclipse Disc */}
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-rahu)`} />
          {/* Serpentine Mystical Nodes */}
          <path
            d="M 30 35 C 40 25, 60 25, 70 35 C 60 45, 40 45, 30 55 C 40 65, 60 65, 70 55"
            fill="none"
            stroke="#c084fc"
            strokeWidth="2.5"
            opacity="0.5"
          />
          {/* Dark Shadow Eclipse Arc */}
          <path
            d="M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 0 50 15 Z"
            fill="#09090b"
            opacity="0.75"
          />
        </svg>
      );

    case 'Ketu':
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(225,29,72,0.7)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-ketu`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#fecdd3" />
              <stop offset="35%" stopColor="#e11d48" />
              <stop offset="70%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#18181b" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Comet Tail Emanations */}
          <circle cx="50" cy="50" r="47" fill={`url(#${idPrefix}-glow)`} />
          {/* Trailing Tail Rays */}
          <path
            d="M 35 70 Q 50 92 65 70"
            fill="none"
            stroke="#fb7185"
            strokeWidth="3"
            opacity="0.7"
          />
          <path
            d="M 42 75 Q 50 96 58 75"
            fill="none"
            stroke="#fda4af"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* Comet Nucleus Sphere */}
          <circle cx="50" cy="46" r="32" fill={`url(#${idPrefix}-ketu)`} />
          {/* Third Eye Moksha Point */}
          <circle cx="50" cy="42" r="5" fill="#ffffff" opacity="0.85" />
        </svg>
      );

    case 'Lagna':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className={`shrink-0 overflow-visible drop-shadow-[0_0_8px_rgba(6,182,212,0.65)] ${className}`}
        >
          <defs>
            <radialGradient id={`${idPrefix}-lagna`} cx="36%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#cffafe" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#164e63" />
            </radialGradient>
            <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill={`url(#${idPrefix}-glow)`} />
          <circle cx="50" cy="50" r="35" fill={`url(#${idPrefix}-lagna)`} />
          {/* Ascendant Rising Arrow */}
          <polygon points="50,22 62,40 54,40 54,62 46,62 46,40 38,40" fill="#ffffff" opacity="0.9" />
        </svg>
      );
  }
};

/**
 * RealisticGraha Component
 * Combines the custom SVG Graha icon with the authentic localized name, degrees, and retrograde indicators
 */
export const RealisticGraha: React.FC<RealisticGrahaProps> = ({
  name,
  sanskritName,
  degrees,
  isRetrograde = false,
  currentLang = 'kn',
  size = 'md',
  showDegree = false,
  showNameInside = true,
  className = '',
  onClick
}) => {
  const cleanName = name.trim();
  const localizedInfo = GRAHA_LOCALIZED_NAMES[cleanName] || {
    en: cleanName,
    kn: cleanName,
    hi: cleanName,
    fullEn: cleanName
  };

  const displayName = localizedInfo[currentLang] || localizedInfo.en;

  // Icon pixel size
  const iconPixelSize = {
    xs: 22,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64
  }[size];

  // Font size for name text inside or beside
  const textSize = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center group shrink-0 select-none cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${className}`}
      title={`${localizedInfo.fullEn} ${degrees !== undefined ? `• ${degrees}°` : ''} ${isRetrograde ? '[Retrograde / ವಕ್ರ]' : ''}`}
    >
      {/* SVG Graha Icon + Label overlay container */}
      <div className="relative flex items-center justify-center">
        <SvgGrahaIcon
          name={cleanName}
          size={iconPixelSize}
          isRetrograde={isRetrograde}
        />

        {/* Retrograde Ring Indicator */}
        {isRetrograde && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white font-mono font-black text-[7.5px] flex items-center justify-center border border-white shadow-xs z-20">
            R
          </div>
        )}

        {/* Name centered inside with high-contrast backing */}
        {showNameInside && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span
              className={`font-black tracking-tight leading-none text-white bg-black/65 px-1 py-0.5 rounded shadow-sm border border-white/30 truncate max-w-full ${textSize}`}
            >
              {displayName}
            </span>
          </div>
        )}
      </div>

      {/* Degrees & Retrograde indicator tag below if requested */}
      {showDegree && degrees !== undefined && (
        <span className="mt-0.5 px-1 py-0.2 rounded-full bg-stone-900/90 text-amber-300 font-mono text-[7px] sm:text-[8px] font-bold border border-amber-500/40 leading-none shadow-xs">
          {degrees}°{isRetrograde ? ' R' : ''}
        </span>
      )}
    </div>
  );
};
