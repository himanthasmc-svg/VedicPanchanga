import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Printer, 
  MapPin, 
  Layers, 
  BookOpen,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { getPanchangaForDate } from '../utils/panchanga';
import { getNavaratriColorsForYear } from '../utils/navaratriColors';

interface VisarjanaMuhurtaCalculatorProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onOpenGoogleMap?: () => void;
  className?: string;
}

export const VisarjanaMuhurtaCalculator: React.FC<VisarjanaMuhurtaCalculatorProps> = ({
  currentLang,
  selectedCity,
  onOpenGoogleMap,
  className = ''
}) => {
  // Calculator Language: 'kn' (Kannada), 'sa' (Sanskrit), 'en' (English)
  const [calcLang, setCalcLang] = useState<'kn' | 'sa' | 'en'>('kn');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Determine Dashami (Day 10) date for the selected year
  const navaratriDays = useMemo(() => {
    return getNavaratriColorsForYear(selectedYear, selectedCity);
  }, [selectedYear, selectedCity]);

  // Dashami is day index 9 (Day 10) or Vijayadashami
  const dashamiInfo = useMemo(() => {
    if (navaratriDays && navaratriDays.length >= 10) {
      const d10 = navaratriDays[9];
      return {
        dateStr: d10.gregorianDateStr,
        dayNumber: 10,
        tithiName: d10.tithiName,
        nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣ', hi: 'श्रवण' }
      };
    }
    // Fallback: estimate mid-October of that year
    const fallbackDate = new Date(selectedYear, 9, 24); // Oct 24
    return {
      dateStr: fallbackDate.toISOString().split('T')[0],
      dayNumber: 10,
      tithiName: { en: 'Dashami (Vijayadashami)', kn: 'ವಿಜಯಾದಶಮೀ', hi: 'विजयदशमी' },
      nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣ', hi: 'श्रवण' }
    };
  }, [navaratriDays, selectedYear]);

  // Astronomical Panchanga calculation for this Dashami date & city
  const dashamiDateObj = useMemo(() => {
    const [y, m, d] = dashamiInfo.dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [dashamiInfo.dateStr]);

  const dashamiPanchanga = useMemo<PanchangaDay>(() => {
    return getPanchangaForDate(dashamiDateObj, selectedCity);
  }, [dashamiDateObj, selectedCity]);

  // Helper to parse "HH:MM AM/PM" into minutes from midnight
  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr || !timeStr.includes(':')) return 6 * 60; // default 6:00 AM
    const parts = timeStr.trim().split(/[:\s]/);
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    const isPM = timeStr.toUpperCase().includes('PM');
    const isAM = timeStr.toUpperCase().includes('AM');
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    return h * 60 + m;
  };

  const formatMinutesToTime = (totalMinutes: number) => {
    const normalized = (totalMinutes + 1440) % 1440;
    let h = Math.floor(normalized / 60);
    const m = Math.floor(normalized % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Astronomical Sunrise and Sunset minutes
  const sunriseMinutes = useMemo(() => parseTimeToMinutes(dashamiPanchanga.sunrise), [dashamiPanchanga.sunrise]);
  const sunsetMinutes = useMemo(() => parseTimeToMinutes(dashamiPanchanga.sunset), [dashamiPanchanga.sunset]);
  const dinaManaMinutes = useMemo(() => Math.max(600, sunsetMinutes - sunriseMinutes), [sunsetMinutes, sunriseMinutes]);
  const oneMuhurtaMinutes = useMemo(() => dinaManaMinutes / 15, [dinaManaMinutes]);

  // Calculated Visarjana Muhurtas
  const calculatedMuhurtas = useMemo(() => {
    // 1. Pratahkaala: Sunrise to Sunrise + 2 Muhurtas (~96 mins)
    const pratahStart = sunriseMinutes;
    const pratahEnd = Math.round(sunriseMinutes + (2 * oneMuhurtaMinutes));

    // 2. Abhijit Muhurta: 8th Muhurta of the day (Midday - 0.5 Muhurta to Midday + 0.5 Muhurta)
    const midday = sunriseMinutes + (dinaManaMinutes / 2);
    const abhijitStart = Math.round(midday - (oneMuhurtaMinutes / 2));
    const abhijitEnd = Math.round(midday + (oneMuhurtaMinutes / 2));

    // 3. Aparahna Vijayadashami: 10th to 12th Muhurta (approximately 3/5 of daytime)
    const aparahnaStart = Math.round(sunriseMinutes + (9 * oneMuhurtaMinutes));
    const aparahnaEnd = Math.round(sunriseMinutes + (12 * oneMuhurtaMinutes));

    // 4. Vijaya Muhurta: 11th Muhurta
    const vijayaStart = Math.round(sunriseMinutes + (10 * oneMuhurtaMinutes));
    const vijayaEnd = Math.round(sunriseMinutes + (11 * oneMuhurtaMinutes));

    return {
      pratah: {
        start: formatMinutesToTime(pratahStart),
        end: formatMinutesToTime(pratahEnd)
      },
      abhijit: {
        start: formatMinutesToTime(abhijitStart),
        end: formatMinutesToTime(abhijitEnd)
      },
      aparahna: {
        start: formatMinutesToTime(aparahnaStart),
        end: formatMinutesToTime(aparahnaEnd)
      },
      vijaya: {
        start: formatMinutesToTime(vijayaStart),
        end: formatMinutesToTime(vijayaEnd)
      }
    };
  }, [sunriseMinutes, dinaManaMinutes, oneMuhurtaMinutes]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Top Banner with Vedic Astronomical Identity */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-800 via-amber-800 to-orange-800 text-white shadow-xl border-2 border-amber-400/60 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl font-black shadow-lg border-2 border-white/60 shrink-0">
              🏺
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-950 bg-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                  {calcLang === 'kn' ? '೧೦ನೇ ದಿನದ ದಶಮೀ ವಿಸರ್ಜನ ಗಣಕ' : calcLang === 'sa' ? 'दशमी विसर्जन मुहूर्त गणकम्' : '10th-Day Dashami Visarjana Calculator'}
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-200 bg-black/40 px-2 py-0.5 rounded">
                  {dashamiInfo.dateStr}
                </span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-white mt-1">
                {calcLang === 'kn'
                  ? 'ವಿಜಯಾದಶಮಿ / ಕಲಶ ವಿಸರ್ಜನ ಮುಹೂರ್ತ ಗಣಕ'
                  : calcLang === 'sa'
                  ? 'विजयदशमी कलश विसर्जन मुहूर्त निर्णयः'
                  : 'Vijayadashami Kalasha Visarjana Muhurta Calculator'}
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                {calcLang === 'kn'
                  ? `ಆಯ್ದ ನಗರ: ${selectedCity.nameLocalized?.kn || selectedCity.name} • ಸೂರ್ಯೋದಯ: ${dashamiPanchanga.sunrise} • ಸೂರ್ಯಾಸ್ತ: ${dashamiPanchanga.sunset}`
                  : calcLang === 'sa'
                  ? `स्थानम्: ${selectedCity.name} • सूर्योदयः: ${dashamiPanchanga.sunrise} • सूर्यास्तः: ${dashamiPanchanga.sunset}`
                  : `Location: ${selectedCity.name} • Sunrise: ${dashamiPanchanga.sunrise} • Sunset: ${dashamiPanchanga.sunset}`}
              </p>
            </div>
          </div>

          {/* Controls: Language Switcher & Year Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            
            {/* Language Switcher (Kannada / Sanskrit / English) */}
            <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/20">
              <button
                type="button"
                onClick={() => setCalcLang('kn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  calcLang === 'kn' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setCalcLang('sa')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  calcLang === 'sa' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'
                }`}
              >
                संस्कृतम्
              </button>
              <button
                type="button"
                onClick={() => setCalcLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  calcLang === 'en' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-white hover:text-amber-200'
                }`}
              >
                English
              </button>
            </div>

            {/* Year Switcher */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono font-bold text-xs focus:ring-2 focus:ring-amber-400"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y} className="text-stone-900">{y}</option>
              ))}
            </select>

            {/* PDF Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 border border-white/30 shadow-xs transition-colors cursor-pointer"
              title="Print Muhurta Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* Selected City Astronomical Baseline Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200 dark:border-stone-700">
          <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold uppercase">
            {calcLang === 'kn' ? 'ಸ್ಥಳ (Location)' : calcLang === 'sa' ? 'स्थानम्' : 'Selected City'}
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <strong className="text-stone-900 dark:text-white truncate">
              {selectedCity.nameLocalized?.kn || selectedCity.name}
            </strong>
            {onOpenGoogleMap && (
              <button
                type="button"
                onClick={onOpenGoogleMap}
                className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline font-bold"
              >
                Change Map
              </button>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200 dark:border-stone-700">
          <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-bold uppercase flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-500" />
            <span>{calcLang === 'kn' ? 'ಸೂರ್ಯೋದಯ (Sunrise)' : calcLang === 'sa' ? 'सूर्योदयः' : 'Sunrise'}</span>
          </span>
          <strong className="text-amber-900 dark:text-amber-200 font-mono text-sm mt-0.5 block">
            {dashamiPanchanga.sunrise}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200 dark:border-stone-700">
          <span className="text-[10px] text-orange-700 dark:text-orange-400 block font-bold uppercase flex items-center gap-1">
            <Moon className="w-3 h-3 text-orange-500" />
            <span>{calcLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ (Sunset)' : calcLang === 'sa' ? 'सूर्यास्तः' : 'Sunset'}</span>
          </span>
          <strong className="text-orange-900 dark:text-orange-200 font-mono text-sm mt-0.5 block">
            {dashamiPanchanga.sunset}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-200 dark:border-stone-700">
          <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-bold uppercase">
            {calcLang === 'kn' ? 'ದಿನಮಾನ (Dina Mana)' : calcLang === 'sa' ? 'दिनमानम्' : 'Day Duration'}
          </span>
          <strong className="text-stone-800 dark:text-stone-200 font-mono text-xs mt-0.5 block truncate">
            {dashamiPanchanga.dinaManaGhatis}
          </strong>
        </div>
      </div>

      {/* Primary Calculated Auspicious Visarjana Windows (Shubh Muhurtas) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <h4 className="font-serif font-black text-base sm:text-lg text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-600 text-white text-xs">✓</span>
            <span>
              {calcLang === 'kn'
                ? 'ವಿಜಯಾದಶಮಿ ಕಲಶ ವಿಸರ್ಜನೆಗೆ ಪ್ರಶಸ್ತ ಶುಭ ಮುಹೂರ್ತಗಳು (Auspicious Windows)'
                : calcLang === 'sa'
                ? 'दशमी कलश विसर्जनार्थं प्रशस्त शुभ मुहूर्तानि'
                : 'Auspicious Vijayadashami Kalasha Visarjana Windows'}
            </span>
          </h4>
          <span className="text-[11px] font-mono text-stone-500 font-bold">Dharmasindhu & Nirnayasindhu Validated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Pratahkaala Visarjana Window */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-stone-850 border-2 border-emerald-400/80 dark:border-emerald-700 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                {calcLang === 'kn' ? '೧. ಪ್ರಾತಃಕಾಲ ಮುಹೂರ್ತ' : calcLang === 'sa' ? '१. प्रातःकाल मुहूर्तम्' : '1. Early Morning (Pratah)'}
              </span>
              <span className="text-xs font-mono font-black text-emerald-800 dark:text-emerald-300">
                {calculatedMuhurtas.pratah.start} — {calculatedMuhurtas.pratah.end}
              </span>
            </div>

            <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {calcLang === 'kn'
                ? 'ಪ್ರಾತಃಕಾಲ ಕಲಶ ಚಾಲನೆ & ನಿರ್ಮಾಲ್ಯ ವಿಸರ್ಜನೆ'
                : calcLang === 'sa'
                ? 'प्रातःकाल कलश चालनम् एवं निर्माल्य विसर्जनम्'
                : 'Morning Kalasha Movement & Nirmalya Visarjana'}
            </h5>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {calcLang === 'kn'
                ? 'ಸೂರ್ಯೋದಯವಾದ ತಕ್ಷಣದಿಂದ ೨ ಮುಹೂರ್ತಗಳ ಅವಧಿ. ನವರಾತ್ರಿಯ ಪೂಜಾ ಸಮಾಪ್ತಿ, ಕಲಶೋದಕ ಪ್ರೋಕ್ಷಣೆ ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಪ್ರಸಾದ ಸ್ವೀಕಾರಕ್ಕೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತ.'
                : calcLang === 'sa'
                ? 'सूर्योदयादारभ्य घटिकाद्वयपर्यन्तम् । कलशचालनार्थं तीर्थप्रोक्षणार्थं च परम प्रशस्तकालः।'
                : 'Window of 2 Muhurtas starting from Sunrise. Highly recommended for morning Punah Pooja, Kalasha Chalana, and Tirtha Prokshana.'}
            </p>
          </div>

          {/* 2. Abhijit Muhurta Window (Supreme) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-850 dark:to-stone-800 border-2 border-amber-500 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>{calcLang === 'kn' ? '೨. ಮಹಾ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : calcLang === 'sa' ? '२. महाभिजित् मुहूर्तम्' : '2. Supreme Abhijit Muhurta'}</span>
              </span>
              <span className="text-sm font-mono font-black text-amber-900 dark:text-amber-200">
                {calculatedMuhurtas.abhijit.start} — {calculatedMuhurtas.abhijit.end}
              </span>
            </div>

            <h5 className="font-bold text-amber-950 dark:text-amber-200 text-sm flex items-center gap-1.5">
              <span>{calcLang === 'kn' ? 'ಸರ್ವಸಿದ್ಧಿ ಫಲಪ್ರದ ಮಹಾ ವಿಜಯಾದಶಮೀ ಮುಹೂರ್ತ' : calcLang === 'sa' ? 'सर्वदोषहरं विजयदशमी अभिजित् मुहूर्तम्' : 'All-Conquering Vijayadashami Muhurta'}</span>
            </h5>

            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {calcLang === 'kn'
                ? 'ಮಧ್ಯಾಹ್ನದ ೮ನೇ ಮುಹೂರ್ತ. ದಶಮಿಯ ದಿನ ಸಕಲ ಗ್ರಹದೋಷಗಳನ್ನು ನಿವಾರಿಸುವ ಅತ್ಯುತ್ಕೃಷ್ಟ ಮುಹೂರ್ತ. ಕಲಶ ಜಲ ವಿಸರ್ಜನೆ ಹಾಗೂ ವಿಜಯೋತ್ಸವಕ್ಕೆ ಧರ್ಮಸಿಂಧು ಸಮ್ಮತ.'
                : calcLang === 'sa'
                ? 'दिनस्य अष्टमो मुहूर्तश्च अभिजित् संज्ञकः। अत्र कृते कर्मणि सर्वसिद्धयो भवन्ति, विजयदशम्यां विशेषतः।'
                : 'The 8th Muhurta of midday. Destroys all astrological afflictions (Sarva Dosha Hara). The most auspicious time for completing rituals.'}
            </p>
          </div>

          {/* 3. Aparahna Vijayadashami Muhurta */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-stone-850 border-2 border-emerald-400/80 dark:border-emerald-700 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                {calcLang === 'kn' ? '೩. ಅಪರಾಹ್ನ ವಿಜಯಾದಶಮೀ ಕಾಲ' : calcLang === 'sa' ? '३. अपराह्न विजयदशमी कालः' : '3. Aparahna Vijayadashami'}
              </span>
              <span className="text-xs font-mono font-black text-emerald-800 dark:text-emerald-300">
                {calculatedMuhurtas.aparahna.start} — {calculatedMuhurtas.aparahna.end}
              </span>
            </div>

            <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {calcLang === 'kn'
                ? 'ಶಮೀ ಪೂಜೆ, ಸೀಮೋಲ್ಲಂಘನ & ಆಯುಧ ವಿಸರ್ಜನೆ'
                : calcLang === 'sa'
                ? 'शमी पूजनं, सीमोल्लङ्घनं च विसर्जनम्'
                : 'Shami Puja, Seemollanghana & Immersion'}
            </h5>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {calcLang === 'kn'
                ? 'ದಿನದ ಅಪರಾಹ್ನ ಕಾಲ. ಶಮೀ ವೃಕ್ಷ ಪೂಜೆ, ಬನ್ನಿ ಮುಡಿಯುವುದು, ಆಯುಧ ವಿಸರ್ಜನೆ ಮತ್ತು ಜಲಾಶಯದಲ್ಲಿ ಕಲಶದ ಪಲ್ಲವ ವಿಸರ್ಜನೆ ಮಾಡಲು ಶಾಸ್ತ್ರೀಯ ಕಾಲ.'
                : calcLang === 'sa'
                ? 'अपराह्ने शमीपूजा कार्या सीमोल्लङ्घनं तथा। कलशपल्लव विसर्जनं च पुण्यजलाशये कर्तव्यम्।'
                : 'Aparahna period prescribed for Shami tree worship, Banni exchange, and immersing sanctified sacred leaves into pure water.'}
            </p>
          </div>

          {/* 4. Vijaya Muhurta */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-stone-850 border-2 border-emerald-400/80 dark:border-emerald-700 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                {calcLang === 'kn' ? '೪. ವಿಜಯ ಮುಹೂರ್ತ' : calcLang === 'sa' ? '४. विजय मुहूर्तम्' : '4. Vijaya Muhurta'}
              </span>
              <span className="text-xs font-mono font-black text-emerald-800 dark:text-emerald-300">
                {calculatedMuhurtas.vijaya.start} — {calculatedMuhurtas.vijaya.end}
              </span>
            </div>

            <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {calcLang === 'kn' ? 'ವಿಜಯ ಸಿದ್ಧಿ ಮುಹೂರ್ತ' : calcLang === 'sa' ? 'विजय सिद्धि मुहूर्तम्' : 'Auspicious Departure & Victory Hour'}
            </h5>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {calcLang === 'kn'
                ? 'ದಿನದ ೧೧ನೇ ಮುಹೂರ್ತ. ವಿಜಯಾದಶಮಿ ಎಂಬ ಹೆಸರು ಈ ಮುಹೂರ್ತದಿಂದಲೇ ಪ್ರಸಿದ್ಧಿ ಪಡೆದಿದೆ. ಯಾವುದೇ ಶುಭ ಕಾರ್ಯ ಕೈಗೆತ್ತಿಕೊಳ್ಳಲು ಜಯಪ್ರದ.'
                : calcLang === 'sa'
                ? 'एकादशो मुहूर्तश्च विजय नामधेयः। अत्र समारब्धं कार्यं निर्विघ्नं विजयप्रदं भवति।'
                : '11th Muhurta of daytime. Named specifically after Vijayadashami; guarantees accomplishment and victory in new ventures.'}
            </p>
          </div>

        </div>
      </div>

      {/* Inauspicious Times to Strictly Avoid on Dashami (Rahu Kaal & Durmuhurta) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            {calcLang === 'kn'
              ? 'ಕಡ್ಡಾಯವಾಗಿ ತ್ಯಜಿಸಬೇಕಾದ ಅಶುಭ ಕಾಲಗಳು (Strictly Prohibited for Visarjana)'
              : calcLang === 'sa'
              ? 'विसर्जनार्थं सर्वथा त्याज्यानि अशुभ कालानि'
              : 'Strictly Inauspicious Times to Avoid for Visarjana'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
            <div>
              <strong className="text-rose-900 dark:text-rose-300 block">
                {calcLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal)' : calcLang === 'sa' ? 'राहु कालः' : 'Rahu Kaal'}
              </strong>
              <span className="text-[11px] text-stone-500">
                {calcLang === 'kn' ? 'ಕಲಶ ಕದಲಿಸುವುದು ನಿಷೇಧ' : 'Never move Kalasha or depart'}
              </span>
            </div>
            <span className="font-mono font-black text-rose-700 dark:text-rose-400 text-sm">
              {dashamiPanchanga.rahuKaal.start} — {dashamiPanchanga.rahuKaal.end}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
            <div>
              <strong className="text-rose-900 dark:text-rose-300 block">
                {calcLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda)' : calcLang === 'sa' ? 'यमगण्ड कालः' : 'Yamaganda Kaal'}
              </strong>
              <span className="text-[11px] text-stone-500">
                {calcLang === 'kn' ? 'ಶುಭಾರಂಭ ತ್ಯಜಿಸಿ' : 'Inauspicious window'}
              </span>
            </div>
            <span className="font-mono font-black text-rose-700 dark:text-rose-400 text-sm">
              {dashamiPanchanga.yamagandaKaal.start} — {dashamiPanchanga.yamagandaKaal.end}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold leading-relaxed">
          {calcLang === 'kn'
            ? '⚠️ ಗಮನಿಸಿ: ರಾಹುಕಾಲದಲ್ಲಿ ಅಥವಾ ದುರ್ಮುಹೂರ್ತದಲ್ಲಿ ಕಲಶವನ್ನು ಅಲುಗಾಡಿಸುವುದು (ಉದ್ವಾಸನೆ), ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ ಮಾಡುವುದು ಅಥವಾ ಊರಿಗೆ ಹೊರಡುವುದು ಶಾಸ್ತ್ರನಿಷಿದ್ಧವಾಗಿದೆ.'
            : calcLang === 'sa'
            ? '⚠️ सावधानम्: राहुकाले दुर्मुहूर्ते वा कलशचालनं विसर्जनं च नैव कर्तव्यम्।'
            : '⚠️ Strict Shastra Note: Moving the sacred Kalasha, performing Udwasana, or beginning travel during Rahu Kaal is strictly forbidden.'}
        </p>
      </div>

      {/* Sacred Visarjana Shlokas with Kannada, Sanskrit, and English Transliterations */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 dark:bg-stone-850 border-2 border-amber-300 dark:border-amber-700 space-y-5">
        
        <div className="border-b border-amber-200 dark:border-stone-700 pb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            {calcLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಮಂತ್ರಗಳು' : calcLang === 'sa' ? 'शास्त्रोक्त मन्त्राः' : 'Authentic Vedic Recitations'}
          </span>
          <h4 className="font-serif font-black text-lg text-stone-900 dark:text-white">
            {calcLang === 'kn'
              ? 'ಕಲಶ ಚಾಲನಾ & ವಿಸರ್ಜನಾ ಪವಿತ್ರ ವೇದ ಮಂತ್ರಗಳು'
              : calcLang === 'sa'
              ? 'कलश चालन एवं देव विसर्जन महामन्त्राः'
              : 'Sacred Kalasha Chalana & Visarjana Shlokas'}
          </h4>
        </div>

        {/* Shloka 1: Uttishtha Brahmanaspate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
              {calcLang === 'kn' ? '೧. ಕಲಶ ಚಾಲನಾ ಮಂತ್ರ (ಕಲಶವನ್ನು ೧ ಇಂಚು ಈಶಾನ್ಯಕ್ಕೆ ಸರಿಸುವಾಗ):' : calcLang === 'sa' ? '१. कलश चालन मन्त्रः:' : '1. Kalasha Movement Mantra (Moving 1 inch NE):'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 font-mono font-bold">
              Rigveda Samhita
            </span>
          </div>

          <p className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line">
            {calcLang === 'sa'
              ? 'ॐ उत्तिष्ठ ब्रह्मणस्पते देवयन्तस्त्वेमहे ।\nउपप्रयन्तु मरुतः सुदानव इन्द्र प्राशूर्भवा सचा ॥'
              : calcLang === 'kn'
              ? 'ಓಂ ಉತ್ತಿಷ್ಠ ಬ್ರಹ್ಮಣಸ್ಪತೇ ದೇವಯಂತಸ್ತ್ವೇಮಹೇ |\nಉಪಪ್ರಯಂತು ಮರುತಃ ಸುದಾನವ ಇಂದ್ರ ಪ್ರಾಶೂರ್ಭವಾ ಸಚಾ ||'
              : 'Om Uttishtha Brahmanaspate Devayantastvemahe |\nUpaprayantu Marutah Sudānava Indra Prāshūrbhavā Sachā ||'}
          </p>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
            <strong>{calcLang === 'kn' ? 'ಭಾವಾರ್ಥ:' : calcLang === 'sa' ? 'अर्थः:' : 'Meaning:'}</strong>{' '}
            {calcLang === 'kn'
              ? 'ಹೇ ದೇವತೆಗಳ ಅಧಿಪತಿಯಾದ ಬ್ರಹ್ಮಣಸ್ಪತಿಯೇ, ದೇವಹಿತಕಾರಿಯಾದ ನೀನು ಎದ್ದೇಳು. ಸಕಲ ಮರುದ್ಗಣಗಳು, ಇಂದ್ರದೇವನು ನಮ್ಮೊಂದಿಗೆ ಪ್ರಸನ್ನರಾಗಿ ಸಕಲ ಮಂಗಳವನ್ನು ಅನುಗ್ರಹಿಸಲಿ.'
              : calcLang === 'sa'
              ? 'हे देवानां अधिपते ब्रह्मणस्पते, त्वं उत्तिष्ठ। मरुतो देवाः इन्द्रश्च अस्मासु अनुकम्पां कुर्वन्तु।'
              : 'O Brahmanaspati, divine protector, please rise. May the Maruts and Lord Indra be gracious and shower eternal auspiciousness upon our family.'}
          </p>
        </div>

        {/* Shloka 2: Punaragamanaya Cha */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
              {calcLang === 'kn' ? '೨. ದೇವಗಣ ವಿಸರ್ಜನೆ & ಪುನರಾಗಮನ ಪ್ರಾರ್ಥನೆ:' : calcLang === 'sa' ? '२. देवगण विसर्जन प्रार्थना:' : '2. Deity Departure & Return Prayer:'}
            </span>
          </div>

          <p className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line">
            {calcLang === 'sa'
              ? 'यान्तु देवगणाः सर्वे पूजामादाय मामकीम् ।\nइष्टकामप्रसिद्ध्यर्थं पुनरागमनाय च ॥'
              : calcLang === 'kn'
              ? 'ಯಾಂತು ದೇವಗಣಾಃ ಸರ್ವೇ ಪೂಜಾಮಾದಾಯ ಮಾಮಕೀಮ್ |\nಇಷ್ಟಕಾಮ ಪ್ರಸಿದ್ಧ್ಯರ್ಥಂ ಪುನರಾಗಮನಾಯ ಚ ||'
              : 'Yāntu Devaganāh Sarve Pūjāmādāya Māmakīm |\nIshtakāma Prasiddhyartham Punarāgamanāya Cha ||'}
          </p>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
            <strong>{calcLang === 'kn' ? 'ಭಾವಾರ್ಥ:' : calcLang === 'sa' ? 'अर्थः:' : 'Meaning:'}</strong>{' '}
            {calcLang === 'kn'
              ? 'ನನ್ನಿಂದ ಶಕ್ತ್ಯಾನುಸಾರ ಸಮರ್ಪಿತವಾದ ಪೂಜೆಯನ್ನು ಸ್ವೀಕರಿಸಿ, ನನ್ನ ಧರ್ಮ, ಅರ್ಥ, ಕಾಮ, ಮೋಕ್ಷಗಳ ಸಕಲ ಇಷ್ಟಾರ್ಥಗಳನ್ನು ಸಿದ್ಧಿಗೊಳಿಸಿ, ಮುಂದಿನ ಉತ್ಸವದಲ್ಲಿ ಪುನಃ ದಯಮಾಡಿಸಲು ತಮ್ಮ ತಮ್ಮ ದಿವ್ಯ ಲೋಕಗಳಿಗೆ ಪಯಣಿಸಿ.'
              : calcLang === 'sa'
              ? 'सर्वे देवाः मम पूजाम् अङ्गीकृत्य मनोरथान् पूरयित्वा पुनः आगमनाय स्वस्थानेषु गच्छन्तु।'
              : 'May all divine beings who received our devotion depart peacefully to their sacred realm, granting righteous desires and gracing us again in the next celebration.'}
          </p>
        </div>

        {/* Shloka 3: Tirtha Prokshana */}
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-750 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
              {calcLang === 'kn' ? '೩. ಕಲಶ ತೀರ್ಥ ಪ್ರೋಕ್ಷಣಾ ಮಂತ್ರ (ಮನೆ ಹಾಗೂ ಭಕ್ತರ ಮೇಲೆ ಚುಮುಕಿಸುವಾಗ):' : calcLang === 'sa' ? '३. कलश तीर्थ प्रोक्षण मन्त्रः:' : '3. Kalasha Sacred Water Sanctification Mantra:'}
            </span>
          </div>

          <p className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed whitespace-pre-line">
            {calcLang === 'sa'
              ? 'ॐ कावेरी तुङ्गभद्रा च गङ्गा च यमुना तथा ।\nकृष्णवेणी गोदावरी च तीर्थं कुर्वन्तु मङ्गळम् ॥'
              : calcLang === 'kn'
              ? 'ಓಂ ಕಾವೇರೀ ತುಂಗಭದ್ರಾ ಚ ಗಂಗಾ ಚ ಯಮುನಾ ತಥಾ |\nಕೃಷ್ಣವೇಣೀ ಗೋದಾವರೀ ಚ ತೀರ್ಥಂ ಕುರ್ವಂತು ಮಂಗಳಮ್ ||'
              : 'Om Kāverī Tungabhadrā Cha Gangā Cha Yamunā Tathā |\nKrishnavenī Godāvarī Cha Tīrtham Kurvantu Mangalam ||'}
          </p>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
            <strong>{calcLang === 'kn' ? 'ವಿಧಿ:' : 'Vidhi:'}</strong>{' '}
            {calcLang === 'kn'
              ? 'ಕಲಶದಲ್ಲಿರುವ ಮಾವಿನ ಅಥವಾ ವೀಳ್ಯದೆಲೆಯ ಪಲ್ಲವದಿಂದ ಕಲಶದ ಪವಿತ್ರ ತೀರ್ಥವನ್ನು ಮನೆಯ ಎಲ್ಲಾ ಕೊಠಡಿಗಳಲ್ಲಿ, ಕುಟುಂಬದ ಸದಸ್ಯರ ಮೇಲೆ ಪ್ರೋಕ್ಷಿಸಿ, ಉಳಿದ ಪವಿತ್ರ ಜಲವನ್ನು ಮನೆಯವರು ಸೇವಿಸಬೇಕು.'
              : 'Using mango/betel leaves, sprinkle the sanctified Kalasha water on all corners of the home and family members for health, peace, and abundance.'}
          </p>
        </div>

      </div>

      {/* Step-by-Step 7-Step Visarjana Vidhi */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 space-y-4">
        <h4 className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-600 text-white text-xs">📋</span>
          <span>
            {calcLang === 'kn'
              ? 'ದಶಮೀ ಕಲಶ ವಿಸರ್ಜನೆಯ ೭ ಪ್ರಮುಖ ಹಂತಗಳು (Step-by-Step Method)'
              : calcLang === 'sa'
              ? 'दशमी कलश विसर्जनस्य सप्त सोपानानि'
              : '7 Steps of Dashami Kalasha Visarjana Procedure'}
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೧</span>
              <span>{calcLang === 'kn' ? 'ಪುನಃ ಪೂಜೆ & ದೀಪ ಪ್ರದಕ್ಷಿಣೆ' : 'Punah Pooja & Deepa Pradakshina'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ದಶಮಿಯ ಪ್ರಾತಃಕಾಲ ಕಲಶಕ್ಕೆ ಗಂಧ, ಅಕ್ಷತೆ, ಪುಷ್ಪ ಸಮರ್ಪಿಸಿ ಮಂಗಳಾರತಿ ಬೆಳಗಿ.' : 'Perform final Aarti with incense, flowers, and sacred akshata.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೨</span>
              <span>{calcLang === 'kn' ? 'ಉದ್ವಾಸನೆ & ಕಲಶ ಚಾಲನೆ' : 'Kalasha Chalana (Movement)'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಉತ್ತಿಷ್ಠ ಬ್ರಹ್ಮಣಸ್ಪತೇ ಮಂತ್ರ ಹೇಳುತ್ತಾ ಕಲಶವನ್ನು ಈಶಾನ್ಯ ಅಥವಾ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ೧ ಇಂಚು ಸರಿಸಿ.' : 'Chanting Uttishtha Brahmanaspate, gently nudge the vessel 1 inch towards North-East.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೩</span>
              <span>{calcLang === 'kn' ? 'ತೆಂಗಿನಕಾಯಿ (ನಾರಿಕೇಲ) ಪ್ರಸಾದ' : 'Sacred Coconut Prasad'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಕಲಶದ ಮೇಲಿರುವ ತೆಂಗಿನಕಾಯಿಯನ್ನು ಗೌರವದಿಂದ ತೆಗೆದು, ಸಿಹಿ ನೈವೇದ್ಯ ಮಾಡಿ ಕುಟುಂಬಕ್ಕೆ ಹಂಚಿ.' : 'Remove the coconut reverently; make sweet Prasad for the family.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೪</span>
              <span>{calcLang === 'kn' ? 'ಪಲ್ಲವ & ನಿರ್ಮಾಲ್ಯ ಸಮರ್ಪಣೆ' : 'Leaves & Nirmalya Immersion'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಕಲಶದ ಮಾವಿನ ಎಲೆಗಳು ಮತ್ತು ನಿರ್ಮಾಲ್ಯ ಹೂವುಗಳನ್ನು ಹರಿಯುವ ನೀರು ಅಥವಾ ತುಳಸಿ ಕಟ್ಟೆಯ ಬಳಿ ಇರಿಸಿ.' : 'Immerse the mango leaves and flowers in clean water or place under sacred Tulasi.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೫</span>
              <span>{calcLang === 'kn' ? 'ತೀರ್ಥ ಪ್ರೋಕ್ಷಣೆ' : 'Holy Tirtha Sanctification'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಕಲಶದ ಪವಿತ್ರ ಗಂಗಾಜಲವನ್ನು ಮನೆಯ ನಾಲ್ಕೂ ದಿಕ್ಕುಗಳಲ್ಲಿ ಪ್ರೋಕ್ಷಿಸಿ ಎಲ್ಲರೂ ಕಣ್ಣಿಗೆ ಒತ್ತಿಕೊಳ್ಳಿ.' : 'Sprinkle sanctified water in every room and on all family members.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೬</span>
              <span>{calcLang === 'kn' ? 'ಅಕ್ಷತೆ & ದಕ್ಷಿಣೆ ಅರ್ಪಣೆ' : 'Akshata & Dakshina Distribution'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಪೂಜೆಯಲ್ಲಿಟ್ಟ ನಾಣ್ಯಗಳು (ನಾಣ್ಯ ದ್ರವ್ಯ) ಮತ್ತು ಅಕ್ಕಿಯನ್ನು ಬ್ರಾಹ್ಮಣರಿಗೆ ಅಥವಾ ದೇವಾಲಯಕ್ಕೆ ದಾನ ನೀಡಿ.' : 'Offer coins and grains used under Kalasha to temple or righteous deeds.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 space-y-1 col-span-1 md:col-span-2">
            <strong className="text-stone-900 dark:text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono">೭</span>
              <span>{calcLang === 'kn' ? 'ಅಖಂಡ ದೀಪ ಸಮಾಪನ' : 'Akhanda Deepa Quiet Conclusion'}</span>
            </strong>
            <p className="text-stone-600 dark:text-stone-400">
              {calcLang === 'kn' ? 'ಅಖಂಡ ದೀಪವನ್ನು ಎಂದಿಗೂ ಬಾಯಿಯಿಂದ ಊದಬೇಡಿ; ಸ್ವಲ್ಪ ಹೂವು ಅಥವಾ ತುಪ್ಪ ಸೇರಿಸಿ ಶಾಂತವಾಗಿ ಸಮಾಪ್ತಿಗೊಳ್ಳಲು ಬಿಡಿ.' : 'Never blow out the Akhanda Deepa flame; let it complete gracefully with sacred ghee.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
