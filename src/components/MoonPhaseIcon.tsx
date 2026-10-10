import React from 'react';
import { Language } from '../types';

export interface MoonPhaseIconProps {
  paksha: 'Shukla' | 'Krishna';
  tithiNumber: number;
  size?: number;
  showLabel?: boolean;
  currentLang?: Language;
  className?: string;
}

export function getMoonPhaseDetails(paksha: 'Shukla' | 'Krishna', tithiNumber: number, lang: Language = 'en') {
  const isShukla = paksha === 'Shukla';
  const safeTithi = Math.max(1, Math.min(15, tithiNumber));
  
  // Calculate percentage of illumination (0% to 100%)
  let illumination: number;
  let phaseNameEn: string;
  let phaseNameKn: string;
  let phaseNameHi: string;

  if (isShukla) {
    if (safeTithi === 15) {
      illumination = 100;
      phaseNameEn = 'Full Moon (Purnima)';
      phaseNameKn = 'ಹುಣ್ಣಿಮೆ (ಪೌರ್ಣಮೀ)';
      phaseNameHi = 'पूर्णिमा (पूर्ण चन्द्र)';
    } else if (safeTithi === 1) {
      illumination = 5;
      phaseNameEn = 'Waxing Crescent (Prathama)';
      phaseNameKn = 'ಶುಕ್ಲ ಪಾಡ್ಯ (ಬಾಲಚಂದ್ರ)';
      phaseNameHi = 'शुक्ल प्रतिपदा (बाल चन्द्र)';
    } else if (safeTithi <= 6) {
      illumination = Math.round((safeTithi / 15) * 100);
      phaseNameEn = `Waxing Crescent (${safeTithi}/15)`;
      phaseNameKn = `ಶುಕ್ಲ ವೃದ್ಧಿ ಚಂದ್ರ (${safeTithi}/೧೫)`;
      phaseNameHi = `शुक्ल वर्धमान चन्द्र (${safeTithi}/१५)`;
    } else if (safeTithi <= 8) {
      illumination = Math.round((safeTithi / 15) * 100);
      phaseNameEn = 'First Quarter (Half Moon)';
      phaseNameKn = 'ಶುಕ್ಲ ಅರ್ಧಚಂದ್ರ (ಅಷ್ಟಮೀ)';
      phaseNameHi = 'शुक्ल अर्धचन्द्र (अष्टमी)';
    } else {
      illumination = Math.round((safeTithi / 15) * 100);
      phaseNameEn = `Waxing Gibbous (${safeTithi}/15)`;
      phaseNameKn = `ಶುಕ್ಲ ಪೂರ್ಣಪ್ರಾಯ ಚಂದ್ರ (${safeTithi}/೧೫)`;
      phaseNameHi = `शुक्ल कुब्ज चन्द्र (${safeTithi}/१५)`;
    }
  } else {
    // Krishna Paksha (waning)
    if (safeTithi === 15) {
      illumination = 0;
      phaseNameEn = 'New Moon (Amavasya)';
      phaseNameKn = 'ಅಮಾವಾಸ್ಯೆ (ಸರ್ವ ಕೃಷ್ಣ)';
      phaseNameHi = 'अमावस्या (नव चन्द्र)';
    } else if (safeTithi === 1) {
      illumination = 95;
      phaseNameEn = 'Waning Gibbous (Krishna Prathama)';
      phaseNameKn = 'ಕೃಷ್ಣ ಪಾಡ್ಯ';
      phaseNameHi = 'कृष्ण प्रतिपदा';
    } else if (safeTithi <= 6) {
      illumination = Math.round(((15 - safeTithi) / 15) * 100);
      phaseNameEn = `Waning Gibbous (${safeTithi}/15)`;
      phaseNameKn = `ಕೃಷ್ಣ ಹ್ರಾಸ ಚಂದ್ರ (${safeTithi}/೧೫)`;
      phaseNameHi = `कृष्ण ह्रासमान चन्द्र (${safeTithi}/१५)`;
    } else if (safeTithi <= 8) {
      illumination = Math.round(((15 - safeTithi) / 15) * 100);
      phaseNameEn = 'Third Quarter (Half Moon)';
      phaseNameKn = 'ಕೃಷ್ಣ ಅರ್ಧಚಂದ್ರ (ಅಷ್ಟಮೀ)';
      phaseNameHi = 'कृष्ण अर्धचन्द्र (अष्टमी)';
    } else {
      illumination = Math.round(((15 - safeTithi) / 15) * 100);
      phaseNameEn = `Waning Crescent (${safeTithi}/15)`;
      phaseNameKn = `ಕೃಷ್ಣ ಕ್ಷೀಣ ಚಂದ್ರ (${safeTithi}/೧೫)`;
      phaseNameHi = `कृष्ण क्षीण चन्द्र (${safeTithi}/१५)`;
    }
  }

  const localizedName = lang === 'kn' ? phaseNameKn : lang === 'hi' ? phaseNameHi : phaseNameEn;
  const pakshaLabel = isShukla 
    ? (lang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳು)' : lang === 'hi' ? 'शुक्ल पक्ष (वैक्सिंग)' : 'Shukla Paksha (Waxing)')
    : (lang === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕತ್ತಲು)' : lang === 'hi' ? 'कृष्ण पक्ष (वेनिंग)' : 'Krishna Paksha (Waning)');

  return {
    illumination,
    isShukla,
    phaseNameEn,
    phaseNameKn,
    phaseNameHi,
    localizedName,
    pakshaLabel
  };
}

export const MoonPhaseIcon: React.FC<MoonPhaseIconProps> = ({
  paksha,
  tithiNumber,
  size = 18,
  showLabel = false,
  currentLang = 'en',
  className = ''
}) => {
  const isShukla = paksha === 'Shukla';
  const safeTithi = Math.max(1, Math.min(15, tithiNumber));
  const { illumination, localizedName, pakshaLabel } = getMoonPhaseDetails(paksha, safeTithi, currentLang);

  const radius = 10;
  const center = 12;

  // Generate SVG path for moon terminator curve
  const renderMoonDisk = () => {
    // 1. Purnima (Full Moon)
    if (isShukla && safeTithi === 15) {
      return (
        <g>
          {/* Subtle Outer Corona Glow */}
          <circle cx={center} cy={center} r={radius + 1.5} className="fill-amber-300/30 animate-pulse" />
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="url(#fullMoonGradient)" 
            stroke="#f59e0b" 
            strokeWidth="0.8" 
          />
          {/* Subtle Lunar Seas (Maria) craters effect */}
          <circle cx={center - 3} cy={center - 2} r="2.2" fill="#d97706" opacity="0.25" />
          <circle cx={center + 2} cy={center + 3} r="1.8" fill="#d97706" opacity="0.2" />
        </g>
      );
    }

    // 2. Amavasya (New Moon)
    if (!isShukla && safeTithi === 15) {
      return (
        <g>
          {/* Dark Disc with subtle celestial aura ring */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius} 
            fill="#0f172a" 
            stroke="#475569" 
            strokeWidth="0.8" 
          />
          <circle cx={center} cy={center} r={radius - 2} fill="#090d16" />
        </g>
      );
    }

    // 3. Intermediate phases (Waxing / Shukla on Right, Waning / Krishna on Left)
    const fraction = illumination / 100;
    const rx = Math.max(0.1, radius * Math.abs(2 * fraction - 1));

    let illuminatedPath = '';

    if (isShukla) {
      // Light is on the right side
      if (fraction < 0.5) {
        // Crescent: right arc + inner curve curving to the right
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} A ${rx.toFixed(2)} ${radius} 0 0 0 ${center} ${center - radius} Z`;
      } else if (fraction === 0.5) {
        // Quarter: right half
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} Z`;
      } else {
        // Gibbous: right arc + inner curve bulging to the left
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} A ${rx.toFixed(2)} ${radius} 0 0 1 ${center} ${center - radius} Z`;
      }
    } else {
      // Light is on the left side
      if (fraction > 0.5) {
        // Gibbous: left arc + inner curve bulging to the right
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} A ${rx.toFixed(2)} ${radius} 0 0 0 ${center} ${center - radius} Z`;
      } else if (fraction === 0.5) {
        // Quarter: left half
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} Z`;
      } else {
        // Crescent: left arc + inner curve curving to the left
        illuminatedPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} A ${rx.toFixed(2)} ${radius} 0 0 1 ${center} ${center - radius} Z`;
      }
    }

    return (
      <g>
        {/* Dark Lunar Background Body */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="#1e293b" 
          stroke="#475569" 
          strokeWidth="0.6" 
        />
        {/* Illuminated Section */}
        <path 
          d={illuminatedPath} 
          fill="url(#moonLightGradient)" 
        />
        {/* Outer boundary rim */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="none" 
          stroke={isShukla ? '#ca8a04' : '#64748b'} 
          strokeWidth="0.5" 
          opacity="0.6"
        />
      </g>
    );
  };

  const titleTooltip = `${localizedName} (${pakshaLabel} • ${illumination}% illumination)`;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 align-middle ${className}`}
      title={titleTooltip}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className="shrink-0 transition-transform hover:scale-110 drop-shadow-xs"
        aria-label={titleTooltip}
      >
        <defs>
          <radialGradient id="fullMoonGradient" cx="40%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="65%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
          <linearGradient id="moonLightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        {renderMoonDisk()}
      </svg>

      {showLabel && (
        <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
          {localizedName}
        </span>
      )}
    </span>
  );
};
