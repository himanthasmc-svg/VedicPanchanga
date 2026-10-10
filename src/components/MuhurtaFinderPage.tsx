import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Home, 
  Heart, 
  Car, 
  Briefcase, 
  GraduationCap, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Filter, 
  Search, 
  ChevronRight,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { getPanchangaForDate, getLocalizedPlaceName } from '../utils/panchanga';

export interface MuhurtaFinderPageProps {
  currentLang: Language;
  selectedCity: CityLocation;
  onNavigateToCalendar?: (date?: Date) => void;
}

export type ActivityType = 
  | 'grihapravesha' 
  | 'vivaha' 
  | 'kalashasthapana'
  | 'namakarana' 
  | 'vehicle' 
  | 'business' 
  | 'vidyarambha' 
  | 'upanayana';

interface ActivityDefinition {
  id: ActivityType;
  title: { en: string; kn: string; hi: string };
  desc: { en: string; kn: string; hi: string };
  icon: React.ComponentType<{ className?: string }>;
  idealNakshatras: string[];
  idealTithis: number[]; // 1 to 15
  allowedPaksha: ('Shukla' | 'Krishna')[];
  avoidDays: number[]; // 0: Sunday, 2: Tuesday, 6: Saturday
  recommendedLagna: string[];
  idealTimeWindow: { en: string; kn: string; hi: string };
}

const ACTIVITIES: ActivityDefinition[] = [
  {
    id: 'grihapravesha',
    title: {
      en: 'House Warming (Griha Pravesha)',
      kn: 'ಗೃಹ ಪ್ರವೇಶ ಮುಹೂರ್ತ (Griha Pravesha)',
      hi: 'गृह प्रवेश मुहूर्त (Griha Pravesha)'
    },
    desc: {
      en: 'Auspicious entry into a newly constructed or renovated home to invite Lakshmi, prosperity, and peace.',
      kn: 'ಹೊಸ ಮನೆ ಅಥವಾ ನವೀಕೃತ ಗೃಹಕ್ಕೆ ಶುಭ ಪ್ರವೇಶ. ಸುಖ, ಶಾಂತಿ ಮತ್ತು ಸಮೃದ್ಧಿಗಾಗಿ.',
      hi: 'नए या नवीनीकृत घर में शुभ प्रवेश। सुख, शांति और समृद्धि हेतु।'
    },
    icon: Home,
    idealNakshatras: ['Rohini', 'Mrigashirsha', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Revati', 'Pushya', 'Shravana'],
    idealTithis: [2, 3, 5, 7, 10, 11, 12, 13], // Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Dvadashi, Trayodashi
    allowedPaksha: ['Shukla'], // Shukla Paksha strongly favored
    avoidDays: [2, 6], // Avoid Tuesday, Saturday for first entry
    recommendedLagna: ['Tula (Libra)', 'Vrishabha (Taurus)', 'Dhanu (Sagittarius)', 'Kumbha (Aquarius)'],
    idealTimeWindow: {
      en: 'Early morning (Brahma Muhurta / Sunrise + 2 hours) or Abhijit Muhurta',
      kn: 'ಪ್ರಾತಃಕಾಲ ಸೂರ್ಯೋದಯದ ನಂತರ (ಅಭಿಜಿತ್ ಮುಹೂರ್ತ ಅಥವಾ ಪ್ರಾತಃ ಶುಭ ಕಾಲ)',
      hi: 'प्रातःकाल सूर्योदय के बाद (अभिजीत मुहूर्त अथवा प्रातः शुभ काल)'
    }
  },
  {
    id: 'vivaha',
    title: {
      en: 'Wedding & Marriage (Vivaha)',
      kn: 'ವಿವಾಹ ಮುಹೂರ್ತ (Vivaha Muhurta)',
      hi: 'विवाह मुहूर्त (Vivaha Muhurta)'
    },
    desc: {
      en: 'Sacred union of two souls with eternal blessings, Guru Bala, and Chandra Bala.',
      kn: 'ವರ-ವಧುವಿನ ಪವಿತ್ರ ಕಲ್ಯಾಣ ಮಹೋತ್ಸವ ಮತ್ತು ದಾಂಪತ್ಯ ಸುಖ ಸಮೃದ್ಧಿಗಾಗಿ.',
      hi: 'वर-वधू का पावन वैवाहिक बंधन, सुखद और समृद्ध दांपत्य जीवन हेतु।'
    },
    icon: Heart,
    idealNakshatras: ['Rohini', 'Mrigashirsha', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    idealTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedPaksha: ['Shukla', 'Krishna'],
    avoidDays: [2], // Avoid Tuesday
    recommendedLagna: ['Mithuna', 'Kanya', 'Tula', 'Dhanu'],
    idealTimeWindow: {
      en: 'Godhuli Muhurta (Sunset transition) or Morning Shubha Muhurta',
      kn: 'ಗೋಧೂಳಿ ಲಗ್ನ ಮುಹೂರ್ತ ಅಥವಾ ಪ್ರಾತಃ ಶುಭ ಲಗ್ನ ಕಾಲ',
      hi: 'गोधूलि लग्न मुहूर्त अथवा प्रातः शुभ लग्न काल'
    }
  },
  {
    id: 'kalashasthapana',
    title: {
      en: 'Navaratri Kalasha / Ghatasthapana (ಕಲಶ ಸ್ಥಾಪನೆ)',
      kn: 'ನವರಾತ್ರಿ ಕಲಶ ಸ್ಥಾಪನಾ ಮುಹೂರ್ತ (Ghatasthapana)',
      hi: 'नवरात्रि कलश स्थापना / घटस्थापना मुहूर्त'
    },
    desc: {
      en: 'Sacred invocation of Goddess Durga into the Kalasha on Pratipada (Padya) at the start of Navaratri.',
      kn: 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಪಾಡ್ಯದಂದು ನವರಾತ್ರಿ ಆರಾಧನೆಗಾಗಿ ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನೆ, ನವಧಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಅಖಂಡ ಜ್ಯೋತಿ ಪ್ರಜ್ವಲನೆ.',
      hi: 'आश्विन शुक्ल प्रतिपदा को माँ दुर्गा की पूजा हेतु घट/कलश स्थापना।'
    },
    icon: Flame,
    idealNakshatras: ['Hasta', 'Chitra', 'Swati', 'Rohini', 'Pushya', 'Shravana'],
    idealTithis: [1], // Pratipada (Padya)
    allowedPaksha: ['Shukla'],
    avoidDays: [],
    recommendedLagna: ['Kanya (Virgo)', 'Tula (Libra)', 'Vrishabha (Taurus)'],
    idealTimeWindow: {
      en: 'Pratahkaala (Sunrise - 08:45 AM) or Abhijit Muhurta (11:46 AM - 12:34 PM)',
      kn: 'ಪ್ರಾತಃಕಾಲ (ಸೂರ್ಯೋದಯ - ೦೮:೪೫ AM) ಅಥವಾ ಸರ್ವಶ್ರೇಷ್ಠ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (೧೧:೪೬ AM - ೧೨:೩೪ PM)',
      hi: 'प्रातःकाल (सूर्योदय - ०८:४५ AM) अथवा श्रेष्ठ अभिजित मुहूर्त (११:४६ AM - १२:३४ PM)'
    }
  },
  {
    id: 'vehicle',
    title: {
      en: 'Vehicle Purchase & Delivery (Vahana Kharidi)',
      kn: 'ವಾಹನ ಖರೀದಿ & ಪೂಜೆ (Vehicle Purchase)',
      hi: 'वाहन क्रय एवं पूजन (Vehicle Purchase)'
    },
    desc: {
      en: 'Safe travels, accident protection, and long-term utility for cars, bikes, or commercial vehicles.',
      kn: 'ಹೊಸ ಕಾರು, ಬೈಕ್ ಖರೀದಿ ಮತ್ತು ಆಯುಧ ಪೂಜೆ. ಪ್ರಯಾಣ ಸುಖಕರ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿರಲು.',
      hi: 'कार, बाइक अथवा व्यावसायिक वाहन क्रय। सुरक्षित यात्रा और समृद्धि हेतु।'
    },
    icon: Car,
    idealNakshatras: ['Ashwini', 'Rohini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Revati'],
    idealTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedPaksha: ['Shukla'],
    avoidDays: [2, 6], // Avoid Tuesday & Saturday
    recommendedLagna: ['Chara Lagna: Mesha, Karka, Tula, Makara'],
    idealTimeWindow: {
      en: 'Amrit Kaal, Abhijit Muhurta, or Shubha Hora',
      kn: 'ಅಮೃತ ಕಾಲ, ಅಭಿಜಿತ್ ಮುಹೂರ್ತ ಅಥವಾ ಶುಭ ಹೋರೆ',
      hi: 'अमृत काल, अभिजीत मुहूर्त अथवा शुभ होरा'
    }
  },
  {
    id: 'business',
    title: {
      en: 'New Business & Office Opening (Vyapara Arambha)',
      kn: 'ಹೊಸ ಉದ್ಯಮ / ಅಂಗಡಿ ಆರಂಭ (Business Launch)',
      hi: 'नया व्यापार / दुकान आरंभ (Business Launch)'
    },
    desc: {
      en: 'Grand inauguration of shops, corporate offices, startups, and signing major contracts.',
      kn: 'ಹೊಸ ವ್ಯಾಪಾರ, ಕಚೇರಿ ಉದ್ಘಾಟನೆ ಮತ್ತು ಮಹತ್ವದ ಒಪ್ಪಂದಗಳಿಗೆ ಶುಭ ಕಾಲ.',
      hi: 'दुकान, कार्यालय उद्घाटन और महत्वपूर्ण अनुबंध हेतु।'
    },
    icon: Briefcase,
    idealNakshatras: ['Ashwini', 'Rohini', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Revati'],
    idealTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedPaksha: ['Shukla'],
    avoidDays: [2, 0], // Avoid Tuesday, Sunday
    recommendedLagna: ['Sthira Lagna: Vrishabha, Simha, Vrishchika, Kumbha'],
    idealTimeWindow: {
      en: 'Morning Pushya / Labha Hora (10:00 AM - 12:30 PM)',
      kn: 'ಬೆಳಗ್ಗೆ ಲಾಭ / ಅಮೃತ ಹೋರೆ (ಅಭಿಜಿತ್ ಮುಹೂರ್ತ)',
      hi: 'प्रातः लाभ / अमृत होरा (अभिजीत मुहूर्त)'
    }
  },
  {
    id: 'namakarana',
    title: {
      en: 'Naming Ceremony (Namakarana)',
      kn: 'ನಾಮಕರಣ ಮುಹೂರ್ತ (Namakarana)',
      hi: 'नामकरण मुहूर्त (Namakarana)'
    },
    desc: {
      en: 'Bestowing a sacred Vedic name on newborn on 11th, 12th, or 16th day with planetary harmony.',
      kn: 'ಮಗುವಿಗೆ ಮಂಗಳಕರ ಹೆಸರು ಇಡುವ ನಾಮಕರಣ ಶಾಸ್ತ್ರ.',
      hi: 'नवजात शिशु के कल्याण हेतु शुभ नामकरण संस्कार।'
    },
    icon: Sparkles,
    idealNakshatras: ['Ashwini', 'Rohini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Uttara Bhadrapada', 'Revati'],
    idealTithis: [1, 2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedPaksha: ['Shukla'],
    avoidDays: [2, 6],
    recommendedLagna: ['Subha Lagna with Guru in Kendra'],
    idealTimeWindow: {
      en: 'Sunrise to Noon (Forenoon Auspicious Hours)',
      kn: 'ಸೂರ್ಯೋದಯದಿಂದ ಮಧ್ಯಾಹ್ನದ ಒಳಗೆ',
      hi: 'सूर्योदय से दोपहर के मध्य'
    }
  },
  {
    id: 'vidyarambha',
    title: {
      en: 'Learning & Schooling Start (Aksharabhyasa)',
      kn: 'ಅಕ್ಷರಾಭ್ಯಾಸ & ವಿದ್ಯಾರಂಭ (Aksharabhyasa)',
      hi: 'अक्षराभ्यास एवं विद्यारंभ (Vidyarambha)'
    },
    desc: {
      en: 'Initiating child into education, music, arts, or Saraswati Pooja with heightened intellect.',
      kn: 'ಸರಸ್ವತಿ ಕೃಪೆ, ಬುದ್ಧಿ ಶಕ್ತಿ ಮತ್ತು ವಿದ್ಯಾಭ್ಯಾಸದ ಶುಭಾರಂಭ.',
      hi: 'सरस्वती कृपा, बुद्धि और अध्ययन का शुभारंभ।'
    },
    icon: GraduationCap,
    idealNakshatras: ['Ashwini', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Shravana', 'Revati'],
    idealTithis: [2, 3, 5, 7, 10, 11],
    allowedPaksha: ['Shukla'],
    avoidDays: [2, 6],
    recommendedLagna: ['Mithuna, Kanya, Dhanu'],
    idealTimeWindow: {
      en: 'Morning Brahma Muhurta / Abhijit Muhurta',
      kn: 'ಬೆಳಗ್ಗೆ ಸರಸ್ವತಿ ಮುಹೂರ್ತ (ಪ್ರಾತಃಕಾಲ)',
      hi: 'प्रातः सरस्वती मुहूर्त (ब्रह्म अथवा अभिजीत)'
    }
  }
];

export function MuhurtaFinderPage({
  currentLang,
  selectedCity,
  onNavigateToCalendar
}: MuhurtaFinderPageProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('grihapravesha');
  const [searchDaysRange, setSearchDaysRange] = useState<number>(30); // 30, 60, or 90 days
  const [onlyShuklaPaksha, setOnlyShuklaPaksha] = useState<boolean>(true);

  const activity = useMemo(() => {
    return ACTIVITIES.find(a => a.id === selectedActivity) || ACTIVITIES[0];
  }, [selectedActivity]);

  // Compute upcoming auspicious dates based on Panchanga data for selected city
  const computedMuhurtas = useMemo(() => {
    const results: Array<{
      day: PanchangaDay;
      score: number;
      suitability: 'High' | 'Moderate' | 'Fair';
      reasons: string[];
      cautions: string[];
      bestTimings: string[];
    }> = [];

    const now = new Date();

    for (let i = 1; i <= searchDaysRange; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const panchang = getPanchangaForDate(targetDate, selectedCity);

      // Check Paksha filter
      if (onlyShuklaPaksha && panchang.paksha !== 'Shukla') {
        continue;
      }

      let score = 50; // base score
      const reasons: string[] = [];
      const cautions: string[] = [];

      // 1. Tithi check
      if (activity.idealTithis.includes(panchang.tithiNumber)) {
        score += 20;
        reasons.push(
          currentLang === 'kn' 
            ? `ಅನುಕೂಲಕರ ತಿಥಿ: ${panchang.tithiName.kn}`
            : currentLang === 'hi'
            ? `अनुकूल तिथि: ${panchang.tithiName.hi}`
            : `Favorable Tithi: ${panchang.tithiName.en}`
        );
      } else if (panchang.tithiNumber === 4 || panchang.tithiNumber === 9 || panchang.tithiNumber === 14) {
        // Rikta tithis (4, 9, 14) - usually avoided for celebratory events
        score -= 25;
        cautions.push(
          currentLang === 'kn'
            ? `ರಿಕ್ತ ತಿಥಿ (${panchang.tithiName.kn}) - ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ವರ್ಜ್ಯ`
            : currentLang === 'hi'
            ? `रिक्ता तिथि (${panchang.tithiName.hi}) - वर्जित`
            : `Rikta Tithi (${panchang.tithiName.en}) - generally avoided`
        );
      } else if (panchang.tithiNumber === 15 && panchang.paksha === 'Krishna') {
        // Amavasya
        score -= 35;
        cautions.push(
          currentLang === 'kn' ? 'ಅಮಾವಾಸ್ಯೆ ದಿನ (ವರ್ಜ್ಯ)' : 'Amavasya day (strictly avoided)'
        );
      }

      // 2. Nakshatra check
      const nakshatraEn = panchang.nakshatra.en;
      const isGoodNakshatra = activity.idealNakshatras.some(n => nakshatraEn.toLowerCase().includes(n.toLowerCase()));
      if (isGoodNakshatra) {
        score += 25;
        reasons.push(
          currentLang === 'kn'
            ? `ಶ್ರೇಷ್ಠ ನಕ್ಷತ್ರ: ${panchang.nakshatra.kn}`
            : currentLang === 'hi'
            ? `श्रेष्ठ नक्षत्र: ${panchang.nakshatra.hi}`
            : `Ideal Star: ${panchang.nakshatra.en}`
        );
      }

      // 3. Weekday (Vara) check
      if (activity.avoidDays.includes(panchang.varaIndex)) {
        score -= 15;
        cautions.push(
          currentLang === 'kn'
            ? `ವಾರ: ${panchang.vara.kn} (ಈ ಕಾರ್ಯಕ್ಕೆ ಅಷ್ಟೊಂದು ಪ್ರಶಸ್ತವಲ್ಲ)`
            : `Day: ${panchang.vara.en} (Not preferred for this activity)`
        );
      } else if (panchang.varaIndex === 4 || panchang.varaIndex === 5 || panchang.varaIndex === 1) {
        // Thursday, Friday, Monday are very auspicious for Vedic activities
        score += 15;
        reasons.push(
          currentLang === 'kn'
            ? `ಶುಭ ವಾರ: ${panchang.vara.kn} (ಗುರು/ಶುಕ್ರ/ಸೋಮವಾರ ಅತ್ಯಂತ ಶುಭ)`
            : `Auspicious Day: ${panchang.vara.en} (Jupiter/Venus/Moon grace)`
        );
      }

      // 4. Paksha bonus
      if (panchang.paksha === 'Shukla') {
        score += 10;
        reasons.push(
          currentLang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳೆಯುವ ಚಂದ್ರನ ಪೂರ್ಣ ಶಕ್ತಿ)' : 'Shukla Paksha (Waxing moon energy)'
        );
      }

      // Determine Best Timings for the city
      const bestTimings: string[] = [];
      if (panchang.abhijitMuhurta && panchang.abhijitMuhurta.start) {
        bestTimings.push(`Abhijit Muhurta: ${panchang.abhijitMuhurta.start} - ${panchang.abhijitMuhurta.end}`);
      }
      if (panchang.amritKaal && panchang.amritKaal.start) {
        bestTimings.push(`Amrit Kaal: ${panchang.amritKaal.start} - ${panchang.amritKaal.end}`);
      }
      if (panchang.brahmaMuhurta && panchang.brahmaMuhurta.start) {
        bestTimings.push(`Brahma Muhurta: ${panchang.brahmaMuhurta.start} - ${panchang.brahmaMuhurta.end}`);
      }

      // Filter only days that have a net positive score
      if (score >= 60) {
        const suitability = score >= 85 ? 'High' : score >= 72 ? 'Moderate' : 'Fair';
        results.push({
          day: panchang,
          score,
          suitability,
          reasons,
          cautions,
          bestTimings
        });
      }
    }

    // Sort by highest score first, then by earliest date
    return results.sort((a, b) => b.score - a.score || a.day.gregorianDate.localeCompare(b.day.gregorianDate));
  }, [activity, searchDaysRange, onlyShuklaPaksha, selectedCity, currentLang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {currentLang === 'kn' ? 'ವೈದಿಕ ಮುಹೂರ್ತ ನಿರ್ಣಯ ಇಂಜಿನ್' : currentLang === 'hi' ? 'वैदिक मुहूर्त निर्णय इंजन' : 'Vedic Muhurta Decision Engine'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white flex items-center gap-3">
              <span>
                {currentLang === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತ ಶೋಧಕ' : currentLang === 'hi' ? 'शुभ मुहूर्त खोजक' : 'Auspicious Muhurta Finder'}
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              {currentLang === 'kn'
                ? `ನಿಮ್ಮ ಆಯ್ದ ನಗರವಾದ ${getLocalizedPlaceName(selectedCity, currentLang)}ದ ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ, ರಾಹುಕಾಲ ಮತ್ತು ನಕ್ಷತ್ರ-ತಿಥಿ ಗಣನೆಗಳ ಆಧಾರದ ಮೇಲೆ ಗೃಹಪ್ರವೇಶ, ವಿವಾಹ, ವಾಹನ ಖರೀದಿ ಮುಂತಾದ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶ್ರೇಷ್ಠ ದಿನ ಮತ್ತು ಮುಹೂರ್ತಗಳನ್ನು ಹುಡುಕಿ.`
                : currentLang === 'hi'
                ? `आपके चयनित शहर ${getLocalizedPlaceName(selectedCity, currentLang)} के सूर्योदय, सूर्यास्त और पंचांग गणना अनुसार गृह प्रवेश, विवाह, वाहन क्रय आदि के लिए शुभ मुहूर्त खोजें।`
                : `Find astrologically verified auspicious dates and time windows for weddings, house warming, vehicle purchases, and business launches based on real astronomical data calculated for ${getLocalizedPlaceName(selectedCity, 'en')}.`
              }
            </p>
          </div>

          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3 shrink-0">
            <MapPin className="w-6 h-6 text-amber-300 shrink-0" />
            <div>
              <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                {currentLang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸ್ಥಳ' : 'Current City'}
              </div>
              <div className="text-sm font-bold text-white">
                {getLocalizedPlaceName(selectedCity, currentLang)}
              </div>
              <div className="text-[10px] text-amber-200/80">
                Lat: {selectedCity.lat.toFixed(2)}° • Lng: {selectedCity.lng.toFixed(2)}°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Selector Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>
              {currentLang === 'kn' ? 'ಶುಭ ಕಾರ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ:' : currentLang === 'hi' ? 'शुभ कार्य का चयन करें:' : 'Select Auspicious Activity:'}
            </span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {ACTIVITIES.length} {currentLang === 'kn' ? 'ಕಾರ್ಯಗಳು' : 'Vedic Categories'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACTIVITIES.map((act) => {
            const Icon = act.icon;
            const isSelected = act.id === selectedActivity;
            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-stone-750'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-amber-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight line-clamp-1">
                    {act.title[currentLang]}
                  </div>
                  <div className={`text-[10px] mt-0.5 line-clamp-1 ${
                    isSelected ? 'text-amber-100' : 'text-stone-500 dark:text-stone-400'
                  }`}>
                    {act.id === 'grihapravesha' ? 'New Home' : act.id === 'vivaha' ? 'Marriage' : act.id === 'vehicle' ? 'Car/Bike' : 'Auspicious'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Activity Details & Rules */}
      <div className="bg-amber-50 dark:bg-stone-850 border border-amber-200 dark:border-stone-700 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-extrabold text-base text-amber-950 dark:text-amber-100">
                {activity.title[currentLang]}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-stone-700 text-amber-900 dark:text-amber-300">
                {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೀಯ ನಿಯಮಗಳು' : 'Vedic Rules'}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-3xl">
              {activity.desc[currentLang]}
            </p>
          </div>

          {/* Search Controls */}
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs bg-white dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="text-stone-500 font-medium">
                {currentLang === 'kn' ? 'ಅವಧಿ:' : 'Range:'}
              </span>
              <select
                value={searchDaysRange}
                onChange={(e) => setSearchDaysRange(Number(e.target.value))}
                className="bg-transparent font-bold text-amber-700 dark:text-amber-400 focus:outline-none"
              >
                <option value={30}>Next 30 Days</option>
                <option value={60}>Next 60 Days</option>
                <option value={90}>Next 90 Days</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs bg-white dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyShuklaPaksha}
                onChange={(e) => setOnlyShuklaPaksha(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {currentLang === 'kn' ? 'ಕೇವಲ ಶುಕ್ಲ ಪಕ್ಷ (Shukla only)' : 'Shukla Paksha Only'}
              </span>
            </label>
          </div>
        </div>

        {/* Requirements badges */}
        <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-stone-700 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/80 dark:bg-stone-800/80 p-2.5 rounded-xl border border-amber-100 dark:border-stone-700">
            <div className="font-bold text-[11px] text-amber-800 dark:text-amber-300 mb-1">
              ✨ {currentLang === 'kn' ? 'ಪ್ರಶಸ್ತ ನಕ್ಷತ್ರಗಳು' : 'Ideal Nakshatras'}
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
              {activity.idealNakshatras.join(', ')}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/80 p-2.5 rounded-xl border border-amber-100 dark:border-stone-700">
            <div className="font-bold text-[11px] text-amber-800 dark:text-amber-300 mb-1">
              🌙 {currentLang === 'kn' ? 'ಶುಭ ತಿಥಿಗಳು' : 'Auspicious Tithis'}
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400">
              Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/80 p-2.5 rounded-xl border border-amber-100 dark:border-stone-700">
            <div className="font-bold text-[11px] text-amber-800 dark:text-amber-300 mb-1">
              ⏰ {currentLang === 'kn' ? 'ದಿನದ ಮುಹೂರ್ತ ಕಾಲ' : 'Suggested Daily Window'}
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400">
              {activity.idealTimeWindow[currentLang]}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Auspicious Dates List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>
              {currentLang === 'kn' 
                ? `ದೊರೆತ ಶುಭ ಮುಹೂರ್ತಗಳು (${computedMuhurtas.length})` 
                : currentLang === 'hi'
                ? `उपलब्ध शुभ मुहूर्त (${computedMuhurtas.length})`
                : `Suggested Auspicious Dates (${computedMuhurtas.length})`
              }
            </span>
          </h3>
          <span className="text-xs text-stone-500">
            {currentLang === 'kn' ? 'ಶ್ರೇಷ್ಠ ಅಂಕಗಳಿಂದ ಜೋಡಿಸಲಾಗಿದೆ' : 'Ranked by Vedic Compatibility'}
          </span>
        </div>

        {computedMuhurtas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-6 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-serif font-bold text-stone-800 dark:text-stone-200">
              {currentLang === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಅವಧಿಯಲ್ಲಿ ದಿನಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Favorable Dates Found in Selected Range'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {currentLang === 'kn'
                ? 'ಅವಧಿಯನ್ನು ೬೦ ಅಥವಾ ೯೦ ದಿನಗಳಿಗೆ ಹೆಚ್ಚಿಸಿ ಅಥವಾ ಶುಕ್ಲ ಪಕ್ಷದ ನಿರ್ಬಂಧವನ್ನು ಸಡಿಲಿಸಿ.'
                : 'Try expanding the search range to 60 or 90 days, or uncheck "Shukla Paksha Only".'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {computedMuhurtas.map((item, idx) => {
              const day = item.day;
              const dateObj = new Date(day.gregorianDate);
              const formattedDate = dateObj.toLocaleDateString(
                currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-US',
                { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
              );

              return (
                <div
                  key={day.gregorianDate}
                  className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group hover:border-amber-400"
                >
                  <div className="space-y-3">
                    
                    {/* Header with Date and Score Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-stone-700/60 pb-3">
                      <div>
                        <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-serif group-hover:text-amber-600 transition-colors">
                          {formattedDate}
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {day.vara[currentLang]} • {day.pakshaName[currentLang]}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          item.suitability === 'High'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300'
                            : item.suitability === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-300'
                            : 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.suitability} ({item.score}%)</span>
                        </span>
                      </div>
                    </div>

                    {/* Key Panchanga Elements */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50/50 dark:bg-stone-750 p-2.5 rounded-xl border border-amber-100 dark:border-stone-700">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">
                          {currentLang === 'kn' ? 'ತಿಥಿ (Tithi)' : 'Tithi'}
                        </span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {day.tithiName[currentLang]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">
                          {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ (Star)' : 'Nakshatra'}
                        </span>
                        <span className="font-bold text-amber-700 dark:text-amber-300">
                          {day.nakshatra[currentLang]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">
                          {currentLang === 'kn' ? 'ಯೋಗ' : 'Yoga'}
                        </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {day.yoga[currentLang]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">
                          {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ' : 'Moon Sign'}
                        </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {day.chandraRashi[currentLang]}
                        </span>
                      </div>
                    </div>

                    {/* Recommended City Timings */}
                    <div className="space-y-1.5 text-xs">
                      <div className="font-bold text-[11px] text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {currentLang === 'kn' ? 'ಸ್ಥಳೀಯ ಶುಭ ಕಾಲಾವಧಿಗಳು:' : `Auspicious Timings in ${selectedCity.name}:`}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {item.bestTimings.map((timeStr, tIdx) => (
                          <div key={tIdx} className="text-[11px] bg-stone-50 dark:bg-stone-700/60 px-2 py-1 rounded-md text-stone-700 dark:text-stone-300 font-medium">
                            {timeStr}
                          </div>
                        ))}
                        <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold px-2">
                          ⚠️ {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (ವರ್ಜ್ಯ):' : 'Rahu Kaal (Avoid):'} {day.rahuKaal.start} - {day.rahuKaal.end}
                        </div>
                      </div>
                    </div>

                    {/* Positive Factors */}
                    {item.reasons.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                          ✓ {currentLang === 'kn' ? 'ಅನುಕೂಲಕರ ಕಾರಣಗಳು:' : 'Favorable Astrological Factors:'}
                        </div>
                        <ul className="text-[11px] text-stone-600 dark:text-stone-300 space-y-0.5 list-disc list-inside">
                          {item.reasons.slice(0, 3).map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action button: View Full Day in Calendar */}
                  {onNavigateToCalendar && (
                    <button
                      onClick={() => onNavigateToCalendar(dateObj)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50 dark:bg-stone-700 hover:bg-amber-600 hover:text-white text-amber-800 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:bg-amber-600 group-hover:text-white"
                    >
                      <span>{currentLang === 'kn' ? 'ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಪೂರ್ಣ ವಿವರ ವೀಕ್ಷಿಸಿ' : 'View Full Panchanga on Calendar'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
