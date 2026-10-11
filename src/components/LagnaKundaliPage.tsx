import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Eye, 
  Bell, 
  Compass, 
  ShieldCheck, 
  Info, 
  Download,
  Share2,
  Printer,
  FileDown,
  Image as ImageIcon,
  Loader2,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Heart,
  Users,
  TrendingUp
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CityLocation, KundaliData, Language, PlanetPosition } from '../types';
import { calculateKundali, CITIES, formatJustNumber, getPanchangaForDate, RASHIS, RASHI_NAKSHATRA_CHART } from '../utils/panchanga';
import { calculatePlanetaryBala, PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { calculateVimshottariDasha, VimshottariDashaResult } from '../utils/vimshottariDasha';
import { calculateGunaMilan, GunaMilanResult } from '../utils/jatakaCompatibility';

interface LagnaKundaliPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onBackToCalendar: () => void;
}

export const LagnaKundaliPage: React.FC<LagnaKundaliPageProps> = ({
  currentLang,
  selectedCity,
  onSelectCity,
  onBackToCalendar
}) => {
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultHours = String(now.getHours()).padStart(2, '0');
  const defaultMins = String(now.getMinutes()).padStart(2, '0');

  const [dateStr, setDateStr] = useState<string>(defaultDate);
  const [timeStr, setTimeStr] = useState<string>(`${defaultHours}:${defaultMins}`);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [notificationArmed, setNotificationArmed] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [balaFilter, setBalaFilter] = useState<'all' | 'strong' | 'moderate' | 'weak'>('all');
  const [activeSectionTab, setActiveSectionTab] = useState<'chart' | 'dasha' | 'compatibility' | 'transits'>('chart');

  // Jataka Compatibility State
  const [groomNakshatra, setGroomNakshatra] = useState<number>(12); // Hasta
  const [groomRashi, setGroomRashi] = useState<number>(5); // Kanya
  const [groomMarsHouse, setGroomMarsHouse] = useState<number>(1);
  const [brideNakshatra, setBrideNakshatra] = useState<number>(13); // Chitra
  const [brideRashi, setBrideRashi] = useState<number>(6); // Tula
  const [brideMarsHouse, setBrideMarsHouse] = useState<number>(7);

  // Compute Kundali data
  const kundaliData: KundaliData = useMemo(() => {
    const combinedStr = `${dateStr}T${timeStr}:00`;
    return calculateKundali(combinedStr, selectedCity);
  }, [dateStr, timeStr, selectedCity]);

  // Compute Planetary Strengths (Bala)
  const planetaryBalas: PlanetaryBalaBreakdown[] = useMemo(() => {
    return kundaliData.planets.map(planet => calculatePlanetaryBala(planet));
  }, [kundaliData.planets]);

  // Planetary Bala Statistics
  const balaStats = useMemo(() => {
    if (planetaryBalas.length === 0) return null;
    const sorted = [...planetaryBalas].sort((a, b) => b.totalScore - a.totalScore);
    const strongest = sorted[0];
    const digbalaPlanets = planetaryBalas.filter(b => b.digbala.hasDigbala);
    const kendraTrikonaCount = planetaryBalas.filter(b => [1, 4, 7, 10, 5, 9].includes(b.planet.bhava)).length;
    const avgScore = Math.round(planetaryBalas.reduce((acc, b) => acc + b.totalScore, 0) / planetaryBalas.length);

    return {
      strongest,
      digbalaPlanets,
      kendraTrikonaCount,
      avgScore
    };
  }, [planetaryBalas]);

  // Filtered Planetary Balas
  const filteredBalas = useMemo(() => {
    if (balaFilter === 'strong') {
      return planetaryBalas.filter(b => b.level === 'supreme' || b.level === 'strong');
    }
    if (balaFilter === 'moderate') {
      return planetaryBalas.filter(b => b.level === 'moderate');
    }
    if (balaFilter === 'weak') {
      return planetaryBalas.filter(b => b.level === 'weak');
    }
    return planetaryBalas;
  }, [planetaryBalas, balaFilter]);

  // Compute Day Panchanga for the selected date
  const panchangDay = useMemo(() => {
    const parts = dateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return getPanchangaForDate(d, selectedCity);
  }, [dateStr, selectedCity]);

  // Vimshottari Dasha calculation
  const vimshottariDasha: VimshottariDashaResult = useMemo(() => {
    const moon = kundaliData.planets.find(p => p.name === 'Moon');
    const moonLong = moon ? (moon.rashiIndex * 30 + moon.degrees) : 0;
    const bDate = new Date(`${dateStr}T${timeStr}:00`);
    return calculateVimshottariDasha(isNaN(bDate.getTime()) ? new Date() : bDate, moonLong);
  }, [dateStr, timeStr, kundaliData]);

  // Planetary Transit (Gochar) Alerts relative to Lagna House
  const transitAlerts = useMemo(() => {
    const lagna = kundaliData.lagnaRashiIndex;
    const saturnHouse = ((11 - lagna + 12) % 12) + 1; // Saturn in Meena
    const jupiterHouse = ((2 - lagna + 12) % 12) + 1;  // Jupiter in Mithuna
    const rahuHouse = ((10 - lagna + 12) % 12) + 1;    // Rahu in Kumbha
    const ketuHouse = ((4 - lagna + 12) % 12) + 1;     // Ketu in Simha

    return [
      {
        planet: 'Jupiter (Guru)',
        symbol: 'Ju',
        currentRashi: 'Mithuna (Gemini)',
        houseFromLagna: jupiterHouse,
        isBenefic: true,
        impactTitle: {
          en: `Jupiter Transiting House ${jupiterHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${jupiterHouse}ನೇ ಭಾವದಲ್ಲಿ ಗುರು ಸಂಚಾರ`,
          hi: `लग्न से ${jupiterHouse}वें भाव में गुरु गोचर`
        },
        impactDesc: {
          en: [1, 5, 9, 11].includes(jupiterHouse)
            ? 'Supreme Bhagya and Trine activation! Excellent period for wisdom, auspicious rituals, academic accolades, and spiritual progress.'
            : 'Favorable transit supporting dharmic focus, expanded perspective, and steady professional gains.',
          kn: [1, 5, 9, 11].includes(jupiterHouse)
            ? 'ಪರಮ ಭಾಗ್ಯ ಮತ್ತು ತ್ರಿಕೋಣ ಬಲ ಜಾಗೃತ! ವಿದ್ಯಾಭ್ಯಾಸ, ಧರ್ಮ ಕಾರ್ಯಗಳು ಹಾಗೂ ಆರ್ಥಿಕ ಸಮೃದ್ಧಿಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಕಾಲ.'
            : 'ಧರ್ಮ ಕಾರ್ಯಗಳಿಗೆ ಅನುಕೂಲಕರ ಸಂಚಾರ; ವೃತ್ತಿಯಲ್ಲಿ ಸ್ಥಿರ ಪ್ರಗತಿ ಹಾಗೂ ಆಂತರಿಕ ನೆಮ್ಮದಿ.',
          hi: 'परम भाग्य एवं त्रिकोण शक्ति जागृत! शिक्षा, धार्मिक कार्य एवं समृद्धि हेतु श्रेष्ठ काल।'
        }
      },
      {
        planet: 'Saturn (Shani)',
        symbol: 'Sa',
        currentRashi: 'Meena (Pisces)',
        houseFromLagna: saturnHouse,
        isBenefic: false,
        impactTitle: {
          en: `Saturn Transiting House ${saturnHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${saturnHouse}ನೇ ಭಾವದಲ್ಲಿ ಶನಿ ಸಂಚಾರ`,
          hi: `लग्न से ${saturnHouse}वें भाव में शनि गोचर`
        },
        impactDesc: {
          en: [1, 4, 7, 8].includes(saturnHouse)
            ? 'Kendra / Kantaka Shani influence. Requires patience, meticulous contracts, health discipline, and ethical perseverance.'
            : 'Productive karmic transit strengthening work foundations and long-term stamina.',
          kn: [1, 4, 7, 8].includes(saturnHouse)
            ? 'ಕೇಂದ್ರ / ಕಂಟಕ ಶನಿ ಪ್ರಭಾವ. ತಾಳ್ಮೆ, ಸಂಯಮ, ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ಶನೈಶ್ಚರ ಸ್ತೋತ್ರ ಪಾರಾಯಣ ಅತ್ಯಾವಶ್ಯಕ.'
            : 'ದೀರ್ಘಾವಧಿ ಕಾರ್ಯಗಳಿಗೆ ಶಿಸ್ತಿನ ಶ್ರಮ ನೀಡುವ ಕರ್ಮಫಲ ಸಂಚಾರ.',
          hi: 'केन्द्र / कंटक शनि प्रभाव। धैर्य, अनुशासन एवं हनुमान चालीसा पाठ श्रेयस्कर।'
        }
      },
      {
        planet: 'Rahu - Ketu Axis',
        symbol: 'Ra-Ke',
        currentRashi: 'Kumbha / Simha Axis',
        houseFromLagna: rahuHouse,
        isBenefic: false,
        impactTitle: {
          en: `Rahu in House ${rahuHouse} & Ketu in House ${ketuHouse} from Lagna`,
          kn: `ಲಗ್ನದಿಂದ ${rahuHouse}ನೇ ಮನೆಯಲ್ಲಿ ರಾಹು & ${ketuHouse}ನೇ ಮನೆಯಲ್ಲಿ ಕೇತು`,
          hi: `लग्न से ${rahuHouse}वें भाव में राहु एवं ${ketuHouse}वें में केतु`
        },
        impactDesc: {
          en: 'Karmic axis highlighting unexpected career breakthroughs alongside spiritual introspection.',
          kn: 'ಆಕಸ್ಮಿಕ ಬದಲಾವಣೆಗಳು, ವಿದೇಶ ಸಂಪರ್ಕ ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗೆ ಪ್ರೇರಣೆ ನೀಡುವ ಸಂಚಾರ.',
          hi: 'आकस्मिक परिवर्तन, तकनीक उन्नति एवं आध्यात्मिक चेतना का समय।'
        }
      }
    ];
  }, [kundaliData.lagnaRashiIndex]);

  // Jataka Compatibility Guna Milan calculation
  const gunaMilan: GunaMilanResult = useMemo(() => {
    return calculateGunaMilan(
      groomNakshatra,
      groomRashi,
      brideNakshatra,
      brideRashi,
      groomMarsHouse,
      brideMarsHouse
    );
  }, [groomNakshatra, groomRashi, brideNakshatra, brideRashi, groomMarsHouse, brideMarsHouse]);

  const handleArmAlerts = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationArmed(true);
        new Notification('HCMM Planetary Timing Alert', {
          body: `Planetary period armed: Rahu Kaal (${panchangDay.rahuKaal.start} - ${panchangDay.rahuKaal.end}), Gulika Kaal (${panchangDay.gulikaKaal.start} - ${panchangDay.gulikaKaal.end})`
        });
      }
    } else {
      setNotificationArmed(!notificationArmed);
    }
  };

  // Dedicated Image (PNG) Export using html2canvas
  const handleExportImage = async () => {
    setIsExportingImage(true);
    try {
      const element = document.getElementById('printable-kundali-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const cleanCityName = selectedCity.name.replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.download = `HCMM_Lagna_Kundali_${cleanCityName}_${dateStr}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  // Dedicated PDF Export using jsPDF & html2canvas
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const element = document.getElementById('printable-kundali-content');
      if (!element) {
        window.print();
        return;
      }

      // Capture element with high pixel ratio for print sharpness
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanCityName = selectedCity.name.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`HCMM_Lagna_Kundali_${cleanCityName}_${dateStr}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Helper to get planet abbreviation/name in the selected language
  const getPlanetLabel = (planet: PlanetPosition) => {
    if (currentLang === 'kn') {
      const knMap: Record<string, string> = {
        Sun: 'ಸೂರ್ಯ',
        Moon: 'ಚಂದ್ರ',
        Mars: 'ಕುಜ',
        Mercury: 'ಬುಧ',
        Jupiter: 'ಗುರು',
        Venus: 'ಶುಕ್ರ',
        Saturn: 'ಶನಿ',
        Rahu: 'ರಾಹು',
        Ketu: 'ಕೇತು'
      };
      return knMap[planet.name] || planet.sanskritName.kn;
    }
    if (currentLang === 'hi') {
      const hiMap: Record<string, string> = {
        Sun: 'सूर्य',
        Moon: 'चन्द्र',
        Mars: 'मंगल',
        Mercury: 'बुध',
        Jupiter: 'गुरु',
        Venus: 'शुक्र',
        Saturn: 'शनि',
        Rahu: 'राहु',
        Ketu: 'केतु'
      };
      return hiMap[planet.name] || planet.sanskritName.hi;
    }
    // English
    const enMap: Record<string, string> = {
      Sun: 'Sun',
      Moon: 'Moon',
      Mars: 'Mars',
      Mercury: 'Merc',
      Jupiter: 'Jup',
      Venus: 'Ven',
      Saturn: 'Sat',
      Rahu: 'Rahu',
      Ketu: 'Ketu'
    };
    return enMap[planet.name] || planet.name;
  };

  // Helper to render planet acronyms inside a Bhava
  const renderHousePlanets = (houseNum: number, orientation: 'horizontal' | 'vertical' | 'diamond' = 'diamond') => {
    const house = kundaliData.houses.find(h => h.bhava === houseNum);
    if (!house || house.planets.length === 0) return null;

    const retrogradeLabel = currentLang === 'kn' ? '[ವ]' : currentLang === 'hi' ? '[व]' : '[R]';

    return (
      <div className={`flex ${orientation === 'vertical' ? 'flex-col items-center gap-0.5' : 'flex-wrap items-center justify-center gap-0.5'} max-w-full`}>
        {house.planets.map((p) => (
          <span
            key={p.name}
            className="font-bold text-[7.5px] sm:text-[8.5px] px-1 py-0.5 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-amber-600/75 shadow-2xs whitespace-nowrap inline-flex items-center gap-0.5 leading-none shrink-0"
            title={`${p.name} (${p.degrees}°) in ${p.rashiName[currentLang]}`}
          >
            <span>{getPlanetLabel(p)}</span>
            {p.isRetrograde && <span className="text-[7px] text-red-600 font-extrabold">{retrogradeLabel}</span>}
          </span>
        ))}
      </div>
    );
  };

  // House Rashi number (1 to 12)
  const getHouseRashiNum = (houseNum: number) => {
    const house = kundaliData.houses.find(h => h.bhava === houseNum);
    return house ? house.rashiIndex + 1 : 1;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      
      {/* Top Banner (Hidden in Print) */}
      <div className="no-print rounded-2xl bg-gradient-to-r from-indigo-800 via-purple-800 to-amber-700 text-white p-4 sm:p-6 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>VEDIC ASTROLOGY • SIDEREAL LAHIRI AYANAMSHA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಬಲ ವಿಶ್ಲೇಷಣೆ' : currentLang === 'hi' ? 'लग्न कुण्डली एवं ग्रह बल विश्लेषण' : 'Lagna Kundali Chart & Planetary Strength (Bala)'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? 'ಪ್ರಸ್ತುತ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಆಧಾರದ ಮೇಲೆ ನಿಖರ ಲಗ್ನ, ೧೨ ಭಾವಗಳು, ನವಗ್ರಹ ಸ್ಥಾನ ಮತ್ತು ಸ್ಥಾನ-ದಿಗ್ಬಲ-ಚೇಷ್ಟಾ ಬಲಗಳ ಆಳವಾದ ಜ್ಯೋತಿಷ್ಯ ಒಳನೋಟಗಳು.'
                : currentLang === 'hi'
                ? 'दिनांक व समय अनुसार शुद्ध लग्न, १२ भाव, नवग्रह स्थिति एवं स्थान-दिग्बल-चेष्टा बल का पूर्ण ज्योतिषीय विश्लेषण।'
                : 'Real-time Vedic ascendant, 12 Bhavas, 9 Grahas, and deep planetary strength (Bala) based on house placement.'}
            </p>
          </div>

          {/* Date, Time & City Controls + PDF Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/25 p-3 rounded-xl backdrop-blur-xs border border-white/10">
            
            {/* Date Input */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-300" />
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* Time Input */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              />
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <select
                value={selectedCity.name}
                onChange={(e) => {
                  const c = CITIES.find(item => item.name === e.target.value);
                  if (c) onSelectCity(c);
                }}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-white text-stone-900 border border-stone-300 focus:outline-hidden cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.nameLocalized ? c.nameLocalized[currentLang] : c.name} ({c.stateLocalized ? c.stateLocalized[currentLang] : c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Export Image Button */}
            <button
              onClick={handleExportImage}
              disabled={isExportingImage}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
              title="Export complete formatted Lagna Kundali as high-res Image (PNG)"
            >
              {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <span>{isExportingImage ? 'Exporting...' : 'Export Image'}</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
              title="Export complete formatted Lagna Kundali & Planetary Strength report as PDF"
            >
              {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              title="Print chart using browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Back to Calendar */}
            <button
              onClick={onBackToCalendar}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Calendar</span>
            </button>

          </div>

        </div>
      </div>

      {/* Lagna & Auspicious Periods Bar (Hidden in Print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lagna Card */}
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20">
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ಲಗ್ನ (Ascendant):' : currentLang === 'hi' ? 'लग्न (Lagna):' : 'Ascendant (Lagna):'}
          </span>
          <div className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
            {kundaliData.houses[0].rashiName[currentLang]}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {kundaliData.lagnaDegree}° • {kundaliData.lagnaNakshatra[currentLang]}
          </p>
        </div>

        {/* Rahu Kaal */}
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20">
          <span className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal):' : currentLang === 'hi' ? 'राहु काल:' : 'Rahu Kaal:'}
          </span>
          <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
            {panchangDay.rahuKaal.start} - {panchangDay.rahuKaal.end}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
            {panchangDay.rahuKaal.startGhati.split('(')[0]}
          </p>
        </div>

        {/* Gulika Kaal */}
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
            {currentLang === 'kn' ? 'ಗುಳಿಕ ಕಾಲ (Gulika Kaal):' : currentLang === 'hi' ? 'गुलिक काल:' : 'Gulika Kaal:'}
          </span>
          <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
            {panchangDay.gulikaKaal.start} - {panchangDay.gulikaKaal.end}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
            {panchangDay.gulikaKaal.startGhati.split('(')[0]}
          </p>
        </div>

        {/* Yamaganda Kaal & Alert Trigger */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
              {currentLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda):' : currentLang === 'hi' ? 'यमगण्ड काल:' : 'Yamaganda Kaal:'}
            </span>
            <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100 mt-1">
              {panchangDay.yamagandaKaal.start} - {panchangDay.yamagandaKaal.end}
            </div>
          </div>

          <button
            onClick={handleArmAlerts}
            className={`mt-2 py-1 px-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              notificationArmed
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-amber-500'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{notificationArmed ? 'Alert Armed' : 'Set Timing Notification'}</span>
          </button>
        </div>

      </div>

      {/* Active Section Tabs Navigation */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800 scrollbar-none">
        <button
          onClick={() => setActiveSectionTab('chart')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSectionTab === 'chart'
              ? 'bg-indigo-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{currentLang === 'kn' ? '೧. ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಬಲ' : currentLang === 'hi' ? '१. लग्न कुण्डली एवं ग्रह बल' : '1. Kundali Chart & Bala'}</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('dasha')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSectionTab === 'dasha'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{currentLang === 'kn' ? '೨. ವಿಂಶೋತ್ತರಿ ದಶಾ ಮತ್ತು ಒಳನೋಟಗಳು' : currentLang === 'hi' ? '२. विंशोत्तरी दशा एवं अंतर्दशा' : '2. Vimshottari Dasha Insights'}</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('compatibility')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSectionTab === 'compatibility'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{currentLang === 'kn' ? '೩. ಜಾತಕ ಮೈತ್ರಿ (ಗುಣ ಮಿಲನ)' : currentLang === 'hi' ? '३. जातक गुण मिलान' : '3. Jataka Compatibility'}</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('transits')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSectionTab === 'transits'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{currentLang === 'kn' ? '೪. ಗ್ರಹ ಗೋಚಾರ & ಲಗ್ನ ಪ್ರಭಾವ' : currentLang === 'hi' ? '४. गोचर फल एवं लग्न प्रभाव' : '4. Transit Alerts on Lagna'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* WRAPPER FOR PDF GENERATION & SCREEN RENDERING */}
      {/* ========================================================================= */}
      <div id="printable-kundali-content" className="space-y-8 bg-white dark:bg-stone-900 p-2 sm:p-4 rounded-2xl">
        
        {/* Printable Official Header (Shows when exported to PDF or printed) */}
        <div className="print-only border-b-2 border-amber-600 pb-4 mb-4 text-center">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                SRI HCMM VEDIC PANCHANGA • LAHIRI AYANAMSHA
              </span>
              <h1 className="text-2xl font-serif font-black text-stone-950">
                {currentLang === 'kn' ? 'ಲಗ್ನ ಕುಂಡಲಿ ಮತ್ತು ಗ್ರಹ ಬಲ ಪತ್ರಿಕೆ' : currentLang === 'hi' ? 'लग्न कुण्डली एवं ग्रह बल पत्रिका' : 'Lagna Kundali Birth & Astrological Chart'}
              </h1>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-stone-900">
                {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name} ({selectedCity.state})
              </div>
              <div className="font-mono text-stone-600">
                {dateStr} • {timeStr}
              </div>
              <div className="text-[11px] text-stone-500">
                Lat: {selectedCity.lat.toFixed(2)}° N, Lng: {selectedCity.lng.toFixed(2)}° E
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-left bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs">
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Lagna (Ascendant):</span>
              <span className="font-bold text-stone-950">{kundaliData.houses[0].rashiName[currentLang]} ({kundaliData.lagnaDegree}°)</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Lagna Nakshatra:</span>
              <span className="font-bold text-stone-950">{kundaliData.lagnaNakshatra[currentLang]}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Rahu Kaal:</span>
              <span className="font-bold text-red-700">{panchangDay.rahuKaal.start} - {panchangDay.rahuKaal.end}</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block uppercase">Gulika Kaal:</span>
              <span className="font-bold text-amber-800">{panchangDay.gulikaKaal.start} - {panchangDay.gulikaKaal.end}</span>
            </div>
          </div>
        </div>

        {/* TAB 1: Lagna Kundali Chart & Planetary Bala */}
        {activeSectionTab === 'chart' && (
          <>
        {/* Main Kundali Chart Display & Style Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start page-break-inside-avoid">
          
          {/* Left: SVG Kundali Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  {chartStyle === 'north' ? 'ಉತ್ತರ ಭಾರತ ಶೈಲಿ (North Indian Diamond Chart)' : 'ದಕ್ಷಿಣ ಭಾರತ ಶೈಲಿ (South Indian Chart)'}
                </h2>
              </div>

              {/* Toggle North vs South Indian Style */}
              <div className="no-print inline-flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
                <button
                  onClick={() => setChartStyle('north')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    chartStyle === 'north'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  North Style (Diamond)
                </button>
                <button
                  onClick={() => setChartStyle('south')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    chartStyle === 'south'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  South Style (Square)
                </button>
              </div>
            </div>

            {/* North Indian Diamond Chart */}
            {chartStyle === 'north' ? (
              <div className="relative w-full aspect-square max-w-[330px] xs:max-w-[390px] sm:max-w-[500px] mx-auto bg-amber-50/60 rounded-2xl p-1.5 sm:p-2 border-2 border-amber-500 shadow-xl overflow-hidden select-none">
                <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect x="0" y="0" width="500" height="500" fill="#fefce8" stroke="#b45309" strokeWidth="3" />
                  <line x1="0" y1="0" x2="500" y2="500" stroke="#d97706" strokeWidth="2" />
                  <line x1="500" y1="0" x2="0" y2="500" stroke="#d97706" strokeWidth="2" />
                  <polygon points="250,0 500,250 250,500 0,250" fill="none" stroke="#b45309" strokeWidth="2.5" />
                </svg>

                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* House 1: Lagna */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '50%', top: '25%', maxWidth: '140px' }}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9.5px] font-black uppercase text-red-700 bg-red-100/90 px-1 py-0.2 rounded shadow-2xs">
                        {currentLang === 'kn' ? 'ಲಗ್ನ' : currentLang === 'hi' ? 'लग्न' : 'LAGNA'}
                      </span>
                      <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none">
                        {getHouseRashiNum(1)}
                      </span>
                    </div>
                    <div className="max-w-[135px]">
                      {renderHousePlanets(1, 'diamond')}
                    </div>
                  </div>

                  {/* House 2 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '25%', top: '9%', maxWidth: '85px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(2)}
                    </span>
                    <div className="max-w-[82px]">
                      {renderHousePlanets(2, 'horizontal')}
                    </div>
                  </div>

                  {/* House 3 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '9%', top: '25%', maxWidth: '56px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(3)}
                    </span>
                    <div className="max-w-[54px]">
                      {renderHousePlanets(3, 'vertical')}
                    </div>
                  </div>

                  {/* House 4 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '25%', top: '50%', maxWidth: '140px' }}
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(4)}
                    </span>
                    <div className="max-w-[130px]">
                      {renderHousePlanets(4, 'diamond')}
                    </div>
                  </div>

                  {/* House 5 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '9%', top: '75%', maxWidth: '56px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(5)}
                    </span>
                    <div className="max-w-[54px]">
                      {renderHousePlanets(5, 'vertical')}
                    </div>
                  </div>

                  {/* House 6 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '25%', top: '91%', maxWidth: '85px' }}
                  >
                    <div className="max-w-[82px] mb-0.5">
                      {renderHousePlanets(6, 'horizontal')}
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none">
                      {getHouseRashiNum(6)}
                    </span>
                  </div>

                  {/* House 7 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '50%', top: '75%', maxWidth: '140px' }}
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(7)}
                    </span>
                    <div className="max-w-[135px]">
                      {renderHousePlanets(7, 'diamond')}
                    </div>
                  </div>

                  {/* House 8 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '75%', top: '91%', maxWidth: '85px' }}
                  >
                    <div className="max-w-[82px] mb-0.5">
                      {renderHousePlanets(8, 'horizontal')}
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none">
                      {getHouseRashiNum(8)}
                    </span>
                  </div>

                  {/* House 9 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '91%', top: '75%', maxWidth: '56px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(9)}
                    </span>
                    <div className="max-w-[54px]">
                      {renderHousePlanets(9, 'vertical')}
                    </div>
                  </div>

                  {/* House 10 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '75%', top: '50%', maxWidth: '140px' }}
                  >
                    <span className="text-[10.5px] font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.2 rounded shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(10)}
                    </span>
                    <div className="max-w-[130px]">
                      {renderHousePlanets(10, 'diamond')}
                    </div>
                  </div>

                  {/* House 11 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '91%', top: '25%', maxWidth: '56px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(11)}
                    </span>
                    <div className="max-w-[54px]">
                      {renderHousePlanets(11, 'vertical')}
                    </div>
                  </div>

                  {/* House 12 */}
                  <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-auto z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: '75%', top: '9%', maxWidth: '85px' }}
                  >
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1 rounded-xs shadow-2xs leading-none mb-0.5">
                      {getHouseRashiNum(12)}
                    </span>
                    <div className="max-w-[82px]">
                      {renderHousePlanets(12, 'horizontal')}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* South Indian Fixed Zodiac Square Chart */
              <div className="relative w-full aspect-square max-w-[330px] xs:max-w-[390px] sm:max-w-[500px] mx-auto bg-amber-50 rounded-xl p-1.5 sm:p-2 border-2 border-amber-600 shadow-xl">
                <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1 p-1 bg-amber-100/70 border border-amber-300">
                  {/* Row 1 */}
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮೀನ (Meena)' : currentLang === 'hi' ? 'मीन (Meena)' : 'Pisces (Meena)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 11)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮೇಷ (Mesha)' : currentLang === 'hi' ? 'मेष (Mesha)' : 'Aries (Mesha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 0)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ವೃಷಭ (Vrishabha)' : currentLang === 'hi' ? 'वृषभ (Vrishabha)' : 'Taurus (Vrishabha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 1)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮಿಥುನ (Mithuna)' : currentLang === 'hi' ? 'मिथुन (Mithuna)' : 'Gemini (Mithuna)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 2)?.bhava || 0)}</div>
                  </div>

                  {/* Row 2 */}
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕುಂಭ (Kumbha)' : currentLang === 'hi' ? 'कुम्भ (Kumbha)' : 'Aquarius (Kumbha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 10)?.bhava || 0)}</div>
                  </div>
                  <div className="col-span-2 row-span-2 p-4 border border-amber-400/80 rounded bg-amber-50 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-base font-serif font-bold text-amber-950">
                      {currentLang === 'kn' ? 'ದಕ್ಷಿಣ ಭಾರತ ಕುಂಡಲಿ' : currentLang === 'hi' ? 'दक्षिण भारतीय कुण्डली' : 'South Indian Kundali'}
                    </span>
                    <span className="text-xs text-amber-800 font-bold mt-1 bg-amber-200/60 px-2 py-0.5 rounded-md">
                      Lagna: {kundaliData.houses[0].rashiName[currentLang]}
                    </span>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕರ್ಕ (Karka)' : currentLang === 'hi' ? 'कर्क (Karka)' : 'Cancer (Karka)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 3)?.bhava || 0)}</div>
                  </div>

                  {/* Row 3 */}
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಮಕರ (Makara)' : currentLang === 'hi' ? 'मकर (Makara)' : 'Capricorn (Makara)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 9)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಸಿಂಹ (Simha)' : currentLang === 'hi' ? 'सिंह (Simha)' : 'Leo (Simha)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 4)?.bhava || 0)}</div>
                  </div>

                  {/* Row 4 */}
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಧನುಸ್ಸು (Dhanus)' : currentLang === 'hi' ? 'धनु (Dhanu)' : 'Sagittarius (Dhanus)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 8)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ವೃಶ್ಚಿಕ (Vrischika)' : currentLang === 'hi' ? 'वृश्चिक (Vrischika)' : 'Scorpio (Vrischika)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 7)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ತುಲಾ (Tula)' : currentLang === 'hi' ? 'तुला (Tula)' : 'Libra (Tula)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 6)?.bhava || 0)}</div>
                  </div>
                  <div className="p-1.5 border border-amber-400 rounded bg-white flex flex-col justify-between overflow-hidden shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-900 border-b border-amber-200 pb-0.5">
                      {currentLang === 'kn' ? 'ಕನ್ಯಾ (Kanya)' : currentLang === 'hi' ? 'कन्या (Kanya)' : 'Virgo (Kanya)'}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">{renderHousePlanets(kundaliData.houses.find(h => h.rashiIndex === 5)?.bhava || 0)}</div>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Right: Planetary Ephemeris Table (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-amber-200/80 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {currentLang === 'kn' ? 'ನವಗ್ರಹ ಸ್ಥಿತಿ (Planetary Ephemeris)' : currentLang === 'hi' ? 'नवग्रह स्थिति' : 'Planetary Positions'}
              </h3>
              <span className="text-[11px] font-mono text-stone-400">
                Sidereal Lahiri
              </span>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold border-b border-stone-200 dark:border-stone-700">
                  <tr>
                    <th className="p-2">ಗ್ರಹ (Graha)</th>
                    <th className="p-2">ರಾಶಿ (Rashi)</th>
                    <th className="p-2">ಅಂಶ (Deg)</th>
                    <th className="p-2">ನಕ್ಷತ್ರ (Nakshatra)</th>
                    <th className="p-2 text-center">ಭಾವ (H)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {kundaliData.planets.map((planet) => (
                    <tr key={planet.name} className="hover:bg-amber-500/5">
                      <td className="p-2 font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                          {planet.symbol.split(' ')[0]}
                        </span>
                        <span>{planet.sanskritName[currentLang]}</span>
                        {planet.isRetrograde && (
                          <span className="text-[9px] text-red-500 font-bold" title="Retrograde (ವಕ್ರ)">
                            [R]
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-semibold text-stone-700 dark:text-stone-300">
                        {planet.rashiName[currentLang]}
                      </td>
                      <td className="p-2 font-mono text-stone-600 dark:text-stone-400">
                        {planet.degrees}°
                      </td>
                      <td className="p-2 text-stone-600 dark:text-stone-400 text-[11px]">
                        {planet.nakshatra[currentLang]}
                      </td>
                      <td className="p-2 text-center font-bold font-mono text-amber-700 dark:text-amber-400">
                        {planet.bhava}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 12 Bhavas Quick Summary */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs space-y-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 block border-b border-stone-200 dark:border-stone-700 pb-1">
                {currentLang === 'kn' ? '೧೨ ಭಾವಗಳ ಸಾರಾಂಶ:' : currentLang === 'hi' ? '१२ भावों का संक्षिप्त विवरण:' : '12 Bhavas (Houses) Overview:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div>೧: ತನು ಭಾವ (Lagna - Self)</div>
                <div>೨: ಧನ ಭಾವ (Wealth)</div>
                <div>೩: ಸಹಜ ಭಾವ (Siblings)</div>
                <div>೪: ಸುಖ ಭಾವ (Mother & Home)</div>
                <div>೫: ಪುತ್ರ ಭಾವ (Intellect & Children)</div>
                <div>೬: ಶತ್ರು ಭಾವ (Health & Obstacles)</div>
                <div>೭: ಕಳತ್ರ ಭಾವ (Spouse & Partnership)</div>
                <div>೮: ಆಯುಷ್ಯ ಭಾವ (Longevity)</div>
                <div>೯: ಭಾಗ್ಯ ಭಾವ (Fortune & Dharma)</div>
                <div>೧೦: ಕರ್ಮ ಭಾವ (Profession)</div>
                <div>೧೧: ಲಾಭ ಭಾವ (Gains)</div>
                <div>೧೨: ವ್ಯಯ ಭಾವ (Expenditure & Moksha)</div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* NEW SECTION: PLANETARY STRENGTH (BALA) BASED ON HOUSE PLACEMENT */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t-2 border-amber-200/70 dark:border-stone-800 space-y-6 page-break-inside-avoid">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                <Activity className="w-4 h-4" />
                <span>BHAVA BALA & STHANA BALA • ASTROLOGICAL INSIGHTS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-950 dark:text-white mt-1">
                {currentLang === 'kn' 
                  ? 'ಗ್ರಹ ಬಲ ವಿಶ್ಲೇಷಣೆ (Planetary Strength / Bala)' 
                  : currentLang === 'hi' 
                  ? 'ग्रह बल एवं भाव स्थिति विश्लेषण (Planetary Strength)' 
                  : 'Planetary Strength (Bala) by House Placement'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl">
                {currentLang === 'kn'
                  ? 'ಭಾವ ಸ್ಥಿತಿ (ಕೇಂದ್ರ, ತ್ರಿಕೋಣ, ಉಪಚಯ, ದುಃಸ್ಥಾನ), ದಿಗ್ಬಲ (ದಿಕ್ಕುಗಳ ಬಲ), ಉಚ್ಚ-ನೀಚ-ಸ್ವಕ್ಷೇತ್ರ ಮತ್ತು ಚೇಷ್ಟಾ ಬಲಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರತಿಯೊಂದು ಗ್ರಹದ ನಿಖರ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಶುಭ-ಅಶುಭ ಪ್ರಭಾವ.'
                  : currentLang === 'hi'
                  ? 'भाव स्थिति (केन्द्र, त्रिकोण, उपचय, त्रिक), दिग्बल, उच्च-नीच-स्वराशि एवं चेष्टा बल अनुसार नवग्रहों की वास्तविक शक्ति एवं फल।'
                  : 'Calculated using classical Vedic Jyotish principles: Sthana Bala (Sign Dignity), Bhava Bala (Angle/Trine Placement), Digbala (Directional Strength), and Cheshta Bala (Luminosity/Retrograde).'}
              </p>
            </div>

            {/* Quick Filter Buttons (Hidden in print) */}
            <div className="no-print inline-flex rounded-xl border border-stone-300 dark:border-stone-700 p-1 bg-stone-100 dark:bg-stone-800 text-xs font-bold self-start md:self-auto">
              <button
                onClick={() => setBalaFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳು' : currentLang === 'hi' ? 'सभी ९ ग्रह' : 'All 9 Grahas'}
              </button>
              <button
                onClick={() => setBalaFilter('strong')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'strong'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಬಲಿಷ್ಠ (Strong)' : currentLang === 'hi' ? 'बलवान (Strong)' : 'Strong'}
              </button>
              <button
                onClick={() => setBalaFilter('moderate')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'moderate'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಮಧ್ಯಮ (Moderate)' : currentLang === 'hi' ? 'मध्यम' : 'Moderate'}
              </button>
              <button
                onClick={() => setBalaFilter('weak')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  balaFilter === 'weak'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {currentLang === 'kn' ? 'ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ (Remedy)' : currentLang === 'hi' ? 'उपाय योग्य' : 'Remedy'}
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          {balaStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Strongest Planet */}
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಅತ್ಯಧಿಕ ಬಲಿಷ್ಠ ಗ್ರಹ:' : currentLang === 'hi' ? 'सर्वाधिक बलवान ग्रह:' : 'Strongest Graha:'}
                  </span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1 flex items-center gap-2">
                  <span>{balaStats.strongest.planet.sanskritName[currentLang]}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-mono font-bold">
                    {balaStats.strongest.totalScore}/100
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  ಭಾವ {balaStats.strongest.planet.bhava} • {balaStats.strongest.sthanaBala.dignityText[currentLang]}
                </p>
              </div>

              {/* 2. Digbala Planets */}
              <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ದಿಗ್ಬಲ ಪಡೆದ ಗ್ರಹಗಳು:' : currentLang === 'hi' ? 'दिग्बल प्राप्त ग्रह:' : 'Digbala Attained:'}
                  </span>
                  <Compass className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1">
                  {balaStats.digbalaPlanets.length > 0 ? (
                    balaStats.digbalaPlanets.map(b => b.planet.sanskritName[currentLang]).join(', ')
                  ) : (
                    currentLang === 'kn' ? 'ಸಮೀಪದ ದಿಗ್ಬಲ' : currentLang === 'hi' ? 'समीपस्थ दिग्बल' : 'Proximity Digbala'
                  )}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn'
                    ? 'ಗುರು/ಬುಧ (೧), ಚಂದ್ರ/ಶುಕ್ರ (೪), ಶನಿ (೭), ಸೂರ್ಯ/ಕುಜ (೧೦)'
                    : 'Devaguru/Budh (1), Chandra/Shukra (4), Shani (7), Surya/Kuja (10)'}
                </p>
              </div>

              {/* 3. Kendra & Trikona Occupancy */}
              <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಕೇಂದ್ರ-ತ್ರಿಕೋಣ ಪ್ರಭಾವ:' : currentLang === 'hi' ? 'केन्द्र-त्रिकोण योग:' : 'Kendra & Trines:'}
                  </span>
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1">
                  {balaStats.kendraTrikonaCount} / 9 {currentLang === 'kn' ? 'ಗ್ರಹಗಳು' : currentLang === 'hi' ? 'ग्रह' : 'Grahas'}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn' ? 'ಭಾವ ೧, ೪, ೫, ೭, ೯, ೧೦ ರಲ್ಲಿ ಸ್ಥಿತಿ' : currentLang === 'hi' ? 'शुभ स्तम्भ व भाग्य भाव' : 'Pillars of chart & Divine Lakshmi grace'}
                </p>
              </div>

              {/* 4. Chart Average Strength */}
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    {currentLang === 'kn' ? 'ಸರಾಸರಿ ಕುಂಡಲಿ ಬಲ:' : currentLang === 'hi' ? 'औसत कुण्डली बल:' : 'Avg Chart Bala:'}
                  </span>
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-bold font-serif text-stone-950 dark:text-white mt-1 flex items-center gap-2">
                  <span>{balaStats.avgScore}%</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                    {balaStats.avgScore >= 65 ? 'ಉತ್ತಮ (Strong)' : 'ಮಧ್ಯಮ (Balanced)'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                  {currentLang === 'kn' ? 'ಸಮಗ್ರ ಜ್ಯೋತಿಷ್ಯ ಬಲ ಸೂಚ್ಯಂಕ' : 'Composite Vedic planetary index'}
                </p>
              </div>

            </div>
          )}

          {/* Cards Grid: 9 Planets Detailed Bala & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBalas.map((bala) => {
              const p = bala.planet;
              return (
                <div
                  key={p.name}
                  className={`rounded-2xl border p-5 shadow-md flex flex-col justify-between transition-all hover:shadow-lg ${bala.colorTheme.bg} ${bala.colorTheme.border} page-break-inside-avoid`}
                >
                  
                  {/* Top: Planet Name, Symbol & Total Score Ring */}
                  <div>
                    <div className="flex items-start justify-between border-b border-black/10 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-bold text-lg text-amber-600 dark:text-amber-400 shadow-xs">
                          {p.symbol.split(' ')[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif font-black text-base text-stone-950 dark:text-white leading-tight">
                              {p.sanskritName[currentLang]}
                            </h3>
                            {p.isRetrograde && (
                              <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded shadow-2xs" title="Retrograde (ವಕ್ರ)">
                                {currentLang === 'kn' ? 'ವಕ್ರ' : currentLang === 'hi' ? 'वक्री' : 'Vakri [R]'}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {p.name} • {p.rashiName[currentLang]} ({p.degrees}°)
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-right">
                        <div className="font-mono font-black text-lg text-stone-900 dark:text-white leading-tight">
                          {bala.totalScore}<span className="text-xs font-normal text-stone-500">/100</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${bala.colorTheme.badge}`}>
                          {bala.levelText[currentLang]}
                        </span>
                      </div>
                    </div>

                    {/* House Placement & Dignity Tag */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        {bala.bhavaBala.houseTypeText[currentLang]}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-bold bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        {bala.sthanaBala.dignityText[currentLang]}
                      </span>
                      {bala.digbala.hasDigbala && (
                        <span className="px-2 py-0.5 rounded-md font-bold bg-blue-600 text-white shadow-2xs">
                          {currentLang === 'kn' ? 'ಪೂರ್ಣ ದಿಗ್ಬಲ' : currentLang === 'hi' ? 'पूर्ण दिग्बल' : 'Full Digbala'}
                        </span>
                      )}
                    </div>

                    {/* 4 Score Breakdown Bars */}
                    <div className="mt-4 space-y-2 text-xs">
                      
                      {/* Sthana Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಸ್ಥಾನ ಬಲ (Sign Dignity)' : currentLang === 'hi' ? 'स्थान बल' : 'Sthana Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.sthanaBala.points}/{bala.sthanaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.sthanaBala.points / bala.sthanaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Bhava Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಭಾವ ಬಲ (House Placement)' : currentLang === 'hi' ? 'भाव बल' : 'Bhava Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.bhavaBala.points}/{bala.bhavaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.bhavaBala.points / bala.bhavaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Digbala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ದಿಗ್ಬಲ (Directional Power)' : currentLang === 'hi' ? 'दिग्बल' : 'Digbala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.digbala.points}/{bala.digbala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.digbala.points / bala.digbala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Cheshta Bala */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-stone-600 dark:text-stone-400">
                          <span>{currentLang === 'kn' ? 'ಚೇಷ್ಟಾ ಬಲ (Motion/Luminosity)' : currentLang === 'hi' ? 'चेष्टा बल' : 'Cheshta Bala'}:</span>
                          <span className="font-mono font-bold text-stone-900 dark:text-stone-200">{bala.cheshtaBala.points}/{bala.cheshtaBala.maxPoints}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className={`h-full ${bala.colorTheme.bar}`} 
                            style={{ width: `${(bala.cheshtaBala.points / bala.cheshtaBala.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Astrological Insight Quote */}
                    <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-black/5 dark:border-white/5 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಫಲ:' : currentLang === 'hi' ? 'ज्योतिषीय फल:' : 'Astrological Insight:'}</span>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                        {bala.insight[currentLang]}
                      </p>
                    </div>

                  </div>

                  {/* Remedial Guidance Box */}
                  <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] text-stone-700 dark:text-stone-300">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                      {currentLang === 'kn' ? 'ಉಪಾಧೇಯ / ಪರಿಹಾರ ಮಾರ್ಗ:' : currentLang === 'hi' ? 'उपाय एवं अनुकूलता:' : 'Remedy & Harmonization:'}
                    </span>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {bala.remedy[currentLang]}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
        </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VIMSHOTTARI DASHA & DASHA INSIGHTS WITH RECHARTS */}
        {/* ========================================================================= */}
        {activeSectionTab === 'dasha' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Current Active Mahadasha & Antardasha Highlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 text-white shadow-xl border border-purple-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ದಶಾ ಅವಧಿ' : 'CURRENTLY ACTIVE DASHA PERIOD'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                    <span>{vimshottariDasha.currentMahadasha.lord.sanskrit[currentLang]} ಮಹಾದಶಾ</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      ACTIVE
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
                    {vimshottariDasha.currentMahadasha.lord.generalSignificance[currentLang]}
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-purple-400/20 shrink-0 text-xs space-y-1.5">
                  <div>
                    <span className="text-purple-300 font-bold block">Current Sub-period (ಅಂತರ್ದಶಾ):</span>
                    <span className="text-base font-bold text-amber-300 font-serif">
                      {vimshottariDasha.currentAntardasha.lord.sanskrit[currentLang]} ಅಂತರ್ದಶಾ
                    </span>
                  </div>
                  <div className="text-stone-300 text-[11px] pt-1 border-t border-white/10">
                    <span>ರತ್ನ: <strong>{vimshottariDasha.currentMahadasha.lord.gemstone[currentLang]}</strong></span> • 
                    <span className="ml-1">ಮಂತ್ರ: <span className="font-mono text-purple-200">{vimshottariDasha.currentMahadasha.lord.mantra[currentLang]}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dasha Insights Recharts Visualization */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-900/60 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span>{currentLang === 'kn' ? 'ದಶಾ ಪ್ರಭಾವ ಮತ್ತು ತೀವ್ರತೆಯ ಹರಿವು (Dasha Insights)' : currentLang === 'hi' ? 'दशा प्रभाव एवं प्रवाह विश्लेषण (Dasha Insights)' : 'Vimshottari Dasha Intensity & Planetary Flow (Dasha Insights)'}</span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn' 
                      ? '೧೨೦ ವರ್ಷಗಳ ವಿಂಶೋತ್ತರಿ ಚಕ್ರದಲ್ಲಿ ಪ್ರತಿ ಗ್ರಹದ ಮಹಾದಶಾ ಅವಧಿ ಮತ್ತು ಪ್ರಭಾವ ತೀವ್ರತೆಯ ರೇಖಾಚಿತ್ರ' 
                      : 'Monthly & yearly planetary period intensity flow across the complete 120-year cycle.'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0">
                  Total Cycle: 120 Years
                </span>
              </div>

              {/* AreaChart Component */}
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vimshottariDasha.chartData} margin={{ top: 10, right: 15, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="dashaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="periodName" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-3 bg-stone-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-purple-500/40">
                              <p className="font-bold text-purple-300 font-serif text-sm">{data.lord} Mahadasha</p>
                              <p className="text-stone-300">Period: {data.yearStart} - {data.yearEnd}</p>
                              <p>Influence Intensity: <strong className="text-amber-300 font-bold">{data.intensity} / 100</strong></p>
                              {data.isActive && <p className="text-emerald-400 font-bold">● Currently Running</p>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="intensity" stroke="#7e22ce" strokeWidth={3} fillOpacity={1} fill="url(#dashaGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Complete 9 Mahadashas Lifecycle Breakdown Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-3">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>{currentLang === 'kn' ? '೯ ಗ್ರಹಗಳ ಮಹಾದಶಾ ಕಾಲಾವಧಿ ಕೋಷ್ಟಕ (Complete 9 Mahadashas)' : 'Complete 9 Planetary Mahadasha Periods (120 Years)'}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 font-bold">
                      <th className="py-2.5 px-3">Planet (ದಶಾ ನಾಯಕ)</th>
                      <th className="py-2.5 px-3">Duration (ವರ್ಷಗಳು)</th>
                      <th className="py-2.5 px-3">Start Date</th>
                      <th className="py-2.5 px-3">End Date</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {vimshottariDasha.mahadashas.map((md, idx) => {
                      const nowTime = new Date().getTime();
                      const isPast = md.endDate.getTime() < nowTime;
                      const isCurrent = md.isCurrent;

                      return (
                        <tr key={idx} className={isCurrent ? 'bg-purple-500/10 font-bold' : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'}>
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full shrink-0" 
                              style={{ backgroundColor: md.lord.color }} 
                            />
                            <span className="font-serif">{md.lord.sanskrit[currentLang]}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">{md.durationYears} Years</td>
                          <td className="py-2.5 px-3 font-mono">{md.startDate.toISOString().split('T')[0]}</td>
                          <td className="py-2.5 px-3 font-mono">{md.endDate.toISOString().split('T')[0]}</td>
                          <td className="py-2.5 px-3">
                            {isCurrent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                Current Active
                              </span>
                            ) : isPast ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-500">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                                Upcoming
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: JATAKA COMPATIBILITY (ASHTAKOOTA GUNA MILAN CALCULATOR) */}
        {/* ========================================================================= */}
        {activeSectionTab === 'compatibility' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-pink-900 to-amber-900 text-white shadow-xl border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-amber-300" />
                <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಜಾತಕ ಮೈತ್ರಿ • ಅಷ್ಟಕೂಟ ಗುಣ ಮಿಲನ' : 'ASHTAKOOTA GUNA MILAN • MARRIAGE COMPATIBILITY'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {currentLang === 'kn' ? 'ವರ ಮತ್ತು ವಧು ಜಾತಕ ಗುಣ ಮಿಲನ ಪರೀಕ್ಷಕ' : 'Groom & Bride Astrological Compatibility'}
              </h2>
              <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-2xl">
                {currentLang === 'kn'
                  ? 'ನಕ್ಷತ್ರ ಮತ್ತು ರಾಶಿ ಆಧಾರಿತ ೩೬ ಗುಣಗಳ ಅಷ್ಟಕೂಟ (ವರ್ಣ, ವಶ್ಯ, ತಾರಾ, ಯೋನಿ, ಗ್ರಹಮೈತ್ರಿ, ಗಣ, ಭಕೂಟ, ನಾಡಿ) ಹಾಗೂ ಮಾಂಗಲ್ಯ ದೋಷ ವಿಶ್ಲೇಷಣೆ.'
                  : 'Traditional 36-point Guna Milan matching covering Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi with Manglik dosha.'}
              </p>
            </div>

            {/* Interactive Selectors: Groom & Bride Chart Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Groom (ವರ) Box */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-indigo-200 dark:border-indigo-900 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold border-b pb-2">
                  <Users className="w-5 h-5" />
                  <h3 className="font-serif text-base">{currentLang === 'kn' ? '೧. ವರನ ಜಾತಕ ವಿವರಗಳು (Groom)' : '1. Groom Birth Profile'}</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ವರನ ಜನ್ಮ ನಕ್ಷತ್ರ (Nakshatra):' : 'Groom Nakshatra:'}
                    </label>
                    <select
                      value={groomNakshatra}
                      onChange={(e) => setGroomNakshatra(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {RASHI_NAKSHATRA_CHART.map((n) => (
                        <option key={n.index} value={n.index}>
                          {n.index + 1}. {currentLang === 'kn' ? n.nakshatraKn : n.nakshatraEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ವರನ ಚಂದ್ರ ರಾಶಿ (Moon Rashi):' : 'Groom Moon Rashi:'}
                    </label>
                    <select
                      value={groomRashi}
                      onChange={(e) => setGroomRashi(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {RASHIS.map((r, rIdx) => (
                        <option key={rIdx} value={rIdx}>
                          {rIdx + 1}. {r.kn} ({r.en})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಕುಜ ಸ್ಥಾನ (Mars House / Manglik):' : 'Mars House (Manglik):'}
                    </label>
                    <select
                      value={groomMarsHouse}
                      onChange={(e) => setGroomMarsHouse(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      <option value={1}>House 1 (Tanu - Manglik)</option>
                      <option value={4}>House 4 (Sukha - Manglik)</option>
                      <option value={7}>House 7 (Kalatra - Manglik)</option>
                      <option value={8}>House 8 (Ayur - Manglik)</option>
                      <option value={12}>House 12 (Vyaya - Manglik)</option>
                      <option value={5}>House 5 (Non-Manglik)</option>
                      <option value={9}>House 9 (Non-Manglik)</option>
                      <option value={10}>House 10 (Non-Manglik)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bride (ವಧು) Box */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border-2 border-rose-200 dark:border-rose-900 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold border-b pb-2">
                  <Users className="w-5 h-5" />
                  <h3 className="font-serif text-base">{currentLang === 'kn' ? '೨. ವಧುವಿನ ಜಾತಕ ವಿವರಗಳು (Bride)' : '2. Bride Birth Profile'}</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ವಧುವಿನ ಜನ್ಮ ನಕ್ಷತ್ರ (Nakshatra):' : 'Bride Nakshatra:'}
                    </label>
                    <select
                      value={brideNakshatra}
                      onChange={(e) => setBrideNakshatra(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {RASHI_NAKSHATRA_CHART.map((n) => (
                        <option key={n.index} value={n.index}>
                          {n.index + 1}. {currentLang === 'kn' ? n.nakshatraKn : n.nakshatraEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ವಧುವಿನ ಚಂದ್ರ ರಾಶಿ (Moon Rashi):' : 'Bride Moon Rashi:'}
                    </label>
                    <select
                      value={brideRashi}
                      onChange={(e) => setBrideRashi(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      {RASHIS.map((r, rIdx) => (
                        <option key={rIdx} value={rIdx}>
                          {rIdx + 1}. {r.kn} ({r.en})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                      {currentLang === 'kn' ? 'ಕುಜ ಸ್ಥಾನ (Mars House / Manglik):' : 'Mars House (Manglik):'}
                    </label>
                    <select
                      value={brideMarsHouse}
                      onChange={(e) => setBrideMarsHouse(Number(e.target.value))}
                      className="w-full p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer"
                    >
                      <option value={7}>House 7 (Kalatra - Manglik)</option>
                      <option value={1}>House 1 (Tanu - Manglik)</option>
                      <option value={4}>House 4 (Sukha - Manglik)</option>
                      <option value={8}>House 8 (Ayur - Manglik)</option>
                      <option value={12}>House 12 (Vyaya - Manglik)</option>
                      <option value={5}>House 5 (Non-Manglik)</option>
                      <option value={9}>House 9 (Non-Manglik)</option>
                      <option value={10}>House 10 (Non-Manglik)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-stone-500">Quick Test Pairs:</span>
              <button
                onClick={() => {
                  setGroomNakshatra(12); // Hasta
                  setGroomRashi(5); // Kanya
                  setBrideNakshatra(13); // Chitra
                  setBrideRashi(6); // Tula
                }}
                className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-stone-800 border border-amber-300 hover:bg-amber-100 font-semibold transition-colors cursor-pointer"
              >
                Hasta (Kanya) & Chitra (Tula)
              </button>
              <button
                onClick={() => {
                  setGroomNakshatra(3); // Rohini
                  setGroomRashi(1); // Vrishabha
                  setBrideNakshatra(4); // Mrigashira
                  setBrideRashi(2); // Mithuna
                }}
                className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-stone-800 border border-amber-300 hover:bg-amber-100 font-semibold transition-colors cursor-pointer"
              >
                Rohini & Mrigashira
              </button>
              <button
                onClick={() => {
                  setGroomNakshatra(0); // Ashwini
                  setGroomRashi(0); // Mesha
                  setBrideNakshatra(1); // Bharani
                  setBrideRashi(0); // Mesha
                }}
                className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-stone-800 border border-amber-300 hover:bg-amber-100 font-semibold transition-colors cursor-pointer"
              >
                Ashwini & Bharani
              </button>
            </div>

            {/* Ashtakoota Guna Milan Scorecard (Big Results Banner) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 border-2 border-amber-400 dark:border-stone-700 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 dark:border-stone-700 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    TOTAL ASHTAKOOTA SCORE (ಒಟ್ಟು ಗುಣ ಮಿಲನ)
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-extrabold font-serif text-stone-950 dark:text-white">
                      {gunaMilan.totalScore}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-stone-500 font-serif">
                      / 36 Points ({gunaMilan.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span 
                    className="inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: gunaMilan.verdictColor }}
                  >
                    {gunaMilan.verdict[currentLang]}
                  </span>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {gunaMilan.totalScore >= 18 ? 'Auspicious score for marital harmony.' : 'Requires astrological remedies & counseling.'}
                  </p>
                </div>
              </div>

              {/* 8 Kootas Detailed Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {Object.entries(gunaMilan.kootas).map(([key, koota]) => {
                  const isFull = koota.obtainedPoints === koota.maxPoints;
                  const isZero = koota.obtainedPoints === 0;

                  return (
                    <div 
                      key={key} 
                      className={`p-3.5 rounded-xl border bg-white dark:bg-stone-900 shadow-xs flex flex-col justify-between ${
                        isFull 
                          ? 'border-emerald-300 dark:border-emerald-800' 
                          : isZero 
                          ? 'border-red-300 dark:border-red-800 bg-red-50/20' 
                          : 'border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-900 dark:text-stone-100 font-serif">
                          {koota.name[currentLang]}
                        </span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          isFull 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : isZero 
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {koota.obtainedPoints} / {koota.maxPoints}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                        {koota.description[currentLang]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Manglik Analysis Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 font-serif">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಮಾಂಗಲ್ಯ (ಕುಜ) ದೋಷ ವಿಶ್ಲೇಷಣೆ:' : 'Manglik Dosha Verification:'}</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    gunaMilan.manglikStatus.isCompatible 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {gunaMilan.manglikStatus.isCompatible ? 'Harmonized / Balanced' : 'Requires Remedy'}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-[11.5px]">
                  {gunaMilan.manglikStatus.description[currentLang]}
                </p>
              </div>

              {/* Classical Recommendations */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  {currentLang === 'kn' ? 'ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶನ:' : 'Astrological Recommendations:'}
                </span>
                <ul className="list-disc pl-5 space-y-1 text-stone-700 dark:text-stone-300 text-[11.5px]">
                  {gunaMilan.recommendations.map((rec, i) => (
                    <li key={i}>{rec[currentLang]}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PLANETARY TRANSITS (GOCHAR) ALERTS ON LAGNA HOUSE */}
        {/* ========================================================================= */}
        {activeSectionTab === 'transits' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-800 via-orange-800 to-stone-900 text-white shadow-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'kn' ? 'ಗೋಚಾರ ಗ್ರಹ ಸಂಚಾರ ಎಚ್ಚರಿಕೆಗಳು' : 'PLANETARY GOCHAR TRANSIT ALERTS'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {currentLang === 'kn' ? 'ಲಗ್ನ ಭಾವಗಳ ಮೇಲೆ ಮುಖ್ಯ ಗ್ರಹಗಳ ಸಂಚಾರ ಪ್ರಭಾವ' : 'Transit Alerts on Your Lagna House'}
                </h2>
                <p className="text-xs sm:text-sm text-amber-200 mt-1 max-w-2xl">
                  {currentLang === 'kn'
                    ? `ನಿಮ್ಮ ಲಗ್ನ ರಾಶಿ: ${kundaliData.houses[0].rashiName[currentLang]} (${kundaliData.lagnaDegree}°). ಗುರು, ಶನಿ, ರಾಹು ಮತ್ತು ಕೇತು ಸಂಚಾರಗಳು ನಿಮ್ಮ ಜೀವಮಾನದ ಲಗ್ನ ಭಾವಗಳ ಮೇಲೆ ಬೀರುವ ಪ್ರಭಾವಗಳು.`
                    : `Your Ascendant Lagna is ${kundaliData.houses[0].rashiName[currentLang]}. Real-time impact of Jupiter and Saturn entering new signs on your natal houses.`}
                </p>
              </div>

              <button
                onClick={handleArmAlerts}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer ${
                  notificationArmed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-stone-900 hover:bg-amber-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{notificationArmed ? 'Alerts Active' : 'Arm Browser Transit Alert'}</span>
              </button>
            </div>

            {/* Transit Alerts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transitAlerts.map((alert, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold font-serif text-amber-700 dark:text-amber-300 text-sm">
                        {alert.symbol}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm font-serif">
                          {alert.planet}
                        </h3>
                        <p className="text-[11px] text-stone-500">
                          Current Sign: {alert.currentRashi}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                      House {alert.houseFromLagna}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-amber-800 dark:text-amber-300">
                      {alert.impactTitle[currentLang]}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                      {alert.impactDesc[currentLang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Printable Shanti Sloka & Blessing (Appears on print & PDF) */}
        <div className="print-only border-t-2 border-stone-300 pt-4 mt-6 text-center text-xs text-stone-600">
          <div className="font-serif font-bold text-sm text-stone-900 mb-1">
            ॥ ನವಗ್ರಹ ದೇವತಾಭ್ಯೋ ನಮಃ • ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು ॥
          </div>
          <div className="text-[10px] text-stone-500">
            HCMM Vedic Calendar & Panchanga Engine • Generated on {dateStr} at {timeStr} for {selectedCity.name}
          </div>
        </div>

      </div>

      {/* Bottom Navigation & Export Action Bar (Hidden in Print) */}
      <div className="no-print pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToCalendar}
          className="px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ (Back to Calendar)' : 'Back to Calendar'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportImage}
            disabled={isExportingImage}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isExportingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            <span>{isExportingImage ? 'Exporting Image...' : 'Export as Image (PNG)'}</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Export Kundali & Bala as PDF'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:border-amber-500 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Chart</span>
          </button>
        </div>
      </div>

    </div>
  );
};
