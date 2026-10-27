import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Clock, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Layers, 
  Info, 
  ShieldCheck, 
  Maximize2, 
  Minimize2, 
  Calendar as CalendarIcon,
  Heart,
  ChevronRight,
  Sun,
  Moon,
  Scissors,
  Check
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { 
  KALASHA_SAMAGRI_LIST, 
  KALASHA_STHAPANA_STEPS,
  DAILY_NAVADURGA_PUJA_KRAMA,
  AYUDHA_PUJA_DETAILS,
  VIJAYADASHAMI_VISARJANA_DETAILS,
  AKHANDA_DEEPA_STHAPANA_DETAILS,
  SANDHI_PUJA_DETAILS, 
  NAVARATRI_10_DAYS_RITUALS, 
  getCalculatedSandhiTiming 
} from '../utils/navaratriRitualsData';
import { getNavaratriColorsForYear } from '../utils/navaratriColors';

interface NavaratriRitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  selectedYear: number;
  selectedCity?: CityLocation;
  currentDay?: PanchangaDay | null;
  initialTab?: 'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami';
  initialDayNumber?: number;
}

export const NavaratriRitualsModal: React.FC<NavaratriRitualsModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  selectedYear,
  selectedCity,
  currentDay,
  initialTab = 'kalasha',
  initialDayNumber = 1
}) => {
  const [activeTab, setActiveTab] = useState<'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami'>(initialTab);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(initialDayNumber);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [checkedSamagri, setCheckedSamagri] = useState<Record<string, boolean>>({});

  const toggleSamagri = (id: string) => {
    setCheckedSamagri(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const navaratriDays = useMemo(() => {
    return getNavaratriColorsForYear(selectedYear, selectedCity);
  }, [selectedYear, selectedCity]);

  const activeDayColor = navaratriDays.find(d => d.dayNumber === selectedDayNumber) || navaratriDays[0];
  const activeDayRitual = NAVARATRI_10_DAYS_RITUALS[selectedDayNumber] || NAVARATRI_10_DAYS_RITUALS[1];

  const sandhiTiming = useMemo(() => {
    if (currentDay) {
      return getCalculatedSandhiTiming(currentDay);
    }
    // Fallback standard calculation
    return {
      sandhiStart: '11:36 PM',
      sandhiEnd: '12:24 AM',
      baliWindowStart: '12:00 AM',
      baliWindowEnd: '12:24 AM',
      pradoshaStart: '06:05 PM',
      pradoshaEnd: '07:17 PM',
      explanation: {
        en: 'Sandhi Kala is the exact 48-minute junction between the last 24 minutes of Maha Ashtami and first 24 minutes of Maha Navami. The Kushmanda Bali is offered during the second half (12:00 AM - 12:24 AM) or during Pradosha Kala (06:05 PM - 07:17 PM).',
        kn: 'ಸಂಧಿಕಾಲವು ಒಟ್ಟು ೪೮ ನಿಮಿಷಗಳ ಕಾಲಾವಧಿ (ಅಷ್ಟಮಿಯ ಕೊನೆಯ ೨೪ ನಿಮಿಷ ಮತ್ತು ನವಮಿಯ ಮೊದಲ ೨೪ ನಿಮಿಷ). ಕೂಷ್ಮಾಂಡ ಬಲಿಯನ್ನು ಎರಡನೇ ಅರ್ಧಭಾಗದಲ್ಲಿ (12:00 AM - 12:24 AM) ಅಥವಾ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ (06:05 PM - 07:17 PM) ಸಮರ್ಪಿಸಬೇಕು.',
        hi: 'सन्धिकाल कुल ४८ मिनट का होता है। कूष्माण्ड बलि दूसरे अर्धभाग (12:00 AM - 12:24 AM) अथवा प्रदोष वेला में दी जाती है।'
      }
    };
  }, [currentDay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className={`bg-white dark:bg-stone-900 border-2 border-red-500/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-[97vw] xl:max-w-[1580px] max-h-[94vh]'
      }`}>

        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-stone-950 to-amber-950 text-white border-b border-red-500/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center shadow-lg shrink-0 border border-amber-300">
              <span className="text-xl">🌺</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-red-900/60 px-2 py-0.5 rounded border border-amber-400/40">
                  {currentLang === 'kn' ? 'ನವರಾತ್ರಿ ಮಹೋತ್ಸವ ವಿಧಿ-ವಿಧಾನ' : currentLang === 'hi' ? 'नवरात्रि पूजा महाविधान' : 'Navaratri Rituals Hub'}
                </span>
                <span className="text-xs text-amber-200/80 font-mono">
                  {selectedYear} • {selectedCity?.name || 'Vedic Panchanga'}
                </span>
              </div>
              <h3 className="font-serif font-black text-base sm:text-xl text-amber-300 tracking-tight">
                {currentLang === 'kn' 
                  ? 'ಕಲಶ ಸ್ಥಾಪನೆ, ೯ ನವದುರ್ಗಾ ಪೂಜೆ, ಅಷ್ಟಮಿ ಬಲಿ & ಆಯುಧ ಪೂಜೆ' 
                  : currentLang === 'hi'
                  ? 'कलश स्थापना, ९ नवदुर्गा पूजन, कूष्माण्ड बलि एवं आयुध पूजा'
                  : 'Kalasa Sthapana, Daily Durga Puja, Kushmanda Bali & Ayudha Puja'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar (6 Core Ritual Sections) */}
        <div className="p-2 sm:p-3 bg-stone-100 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            
            {/* Tab 1: Kalasha Sthapana */}
            <button
              type="button"
              onClick={() => setActiveTab('kalasha')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'kalasha'
                  ? 'bg-red-700 text-white border-red-500 shadow-md ring-2 ring-red-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-red-50 dark:hover:bg-stone-700'
              }`}
            >
              <span>🏺</span>
              <span>{currentLang === 'kn' ? '೧. ಕಲಶ ಸ್ಥಾಪನಾ (ಘಟಸ್ಥಾಪನಾ)' : currentLang === 'hi' ? '१. कलश स्थापना (घटस्थापना)' : '1. Kalasa Sthapana'}</span>
            </button>

            {/* Tab 1B: Akhanda Deepa Sthapana */}
            <button
              type="button"
              onClick={() => setActiveTab('akhandaDeepa')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'akhandaDeepa'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700'
              }`}
            >
              <span>🪔</span>
              <span>{currentLang === 'kn' ? '೧ಬಿ. ಅಖಂಡ ದೀಪ ಸ್ಥಾಪನೆ & ದಿಕ್ಕು' : currentLang === 'hi' ? '१ख. अखण्ड दीप स्थापना व दिशा' : '1B. Akhanda Deepa & Directions'}</span>
            </button>

            {/* Tab 2: Daily 9 Durga Puja */}
            <button
              type="button"
              onClick={() => setActiveTab('dailyDurga')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'dailyDurga'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentLang === 'kn' ? '೨. ದಿನನಿತ್ಯದ ನವದುರ್ಗಾ ಪೂಜೆ' : currentLang === 'hi' ? '२. नित्य नवदुर्गा पूजन क्रम' : '2. Daily 9 Durga Puja'}</span>
            </button>

            {/* Tab 3: Kushmanda / Ashtami Bali */}
            <button
              type="button"
              onClick={() => setActiveTab('kushmandaBali')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'kushmandaBali'
                  ? 'bg-purple-700 text-white border-purple-500 shadow-md ring-2 ring-purple-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-purple-50 dark:hover:bg-stone-700'
              }`}
            >
              <span>🗡️</span>
              <span>{currentLang === 'kn' ? '೩. ಕೂಷ್ಮಾಂಡ ಬಲಿ (ಅಷ್ಟಮಿ ಸಂಧಿ ಪೂಜೆ)' : currentLang === 'hi' ? '३. कूष्माण्ड बलि (अष्टमी सन्धि पूजा)' : '3. Kushmanda / Ashtami Bali'}</span>
            </button>

            {/* Tab 4: Ayudha & Saraswati Puja */}
            <button
              type="button"
              onClick={() => setActiveTab('ayudhaPuja')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'ayudhaPuja'
                  ? 'bg-sky-700 text-white border-sky-500 shadow-md ring-2 ring-sky-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-sky-50 dark:hover:bg-stone-700'
              }`}
            >
              <span>🛠️</span>
              <span>{currentLang === 'kn' ? '೪. ಆಯುಧ & ಸರಸ್ವತೀ ಪೂಜೆ' : currentLang === 'hi' ? '४. आयुध व सरस्वती पूजा' : '4. Ayudha & Saraswati Puja'}</span>
            </button>

            {/* Tab 5: Vijayadashami & Vidyarambha */}
            <button
              type="button"
              onClick={() => setActiveTab('vijayadashami')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'vijayadashami'
                  ? 'bg-emerald-700 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-emerald-50 dark:hover:bg-stone-700'
              }`}
            >
              <span>🏹</span>
              <span>{currentLang === 'kn' ? '೫. ವಿಜಯದಶಮಿ & ಕಲಶ ವಿಸರ್ಜನೆ' : currentLang === 'hi' ? '५. विजयादशमी व कलश विसर्जन' : '5. Vijayadashami & Kalasha Visarjana'}</span>
            </button>

          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: KALASHA STHAPANA (GHATASTHAPANA) VIDHI & SAMAGRI CHECKLIST */}
          {/* ========================================================================= */}
          {activeTab === 'kalasha' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Significance Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-900 via-orange-950 to-stone-900 text-white space-y-2 border border-red-500/40 shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {currentLang === 'kn' 
                      ? 'ಸಕಲ ಬ್ರಹ್ಮಾಂಡದ ಸಂಕೇತ • ಪವಿತ್ರ ತೀರ್ಥ ಆವಾಹನೆ' 
                      : currentLang === 'hi'
                      ? 'सकल ब्रह्माण्ड का प्रतीक • पावन तीर्थ आवाहन'
                      : 'Cosmic Symbol of Universe & Sacred Water Invocation'}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {currentLang === 'kn' 
                    ? 'ಕಲಶ ಸ್ಥಾಪನೆಯ ಮಹತ್ವ & ತತ್ತ್ವ' 
                    : currentLang === 'hi'
                    ? 'कलश स्थापना का आध्यात्मिक रहस्य एवं विधान'
                    : 'Spiritual Significance of Kalasha Sthapana'}
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ದೇವಿ ಪೂಜೆಯಲ್ಲಿ (ನವರಾತ್ರಿ, ವರಮಹಾಲಕ್ಷ್ಮಿ ಅಥವಾ ಗೌರಿ ಪೂಜೆಗಳಲ್ಲಿ) ಕಲಶ ಸ್ಥಾಪನೆ ಅತ್ಯಂತ ಮುಖ್ಯವಾದ ವಿಧಿ. ಕಲಶವನ್ನು ಸಕಲ ಬ್ರಹ್ಮಾಂಡದ ಸಂಕೇತವೆಂದು ಮತ್ತು ಪವಿತ್ರ ತೀರ್ಥಗಳು ಹಾಗೂ ದೇವತಾ ಶಕ್ತಿಗಳು ಅದರಲ್ಲಿ ನೆಲೆಸಿವೆ ಎಂದು ಭಾವಿಸಿ ಪೂಜಿಸಲಾಗುತ್ತದೆ. ಕಲಶದ ಮುಖದಲ್ಲಿ ವಿಷ್ಣು, ಕಂಠದಲ್ಲಿ ರುದ್ರ, ಮೂಲದಲ್ಲಿ ಬ್ರಹ್ಮ ಹಾಗೂ ಮಧ್ಯದಲ್ಲಿ ಮಾತೃಗಣಗಳು ನೆಲೆಸಿರುತ್ತಾರೆ.'
                    : currentLang === 'hi'
                    ? 'देवी पूजा (नवरात्रि, वरलक्ष्मी अथवा गौरी पूजा) में कलश स्थापना सर्वप्रमुख विधान है। कलश को सकल ब्रह्माण्ड का प्रतीक माना जाता है जिसमें समस्त पवित्र तीर्थ एवं देवशक्तियां वास करती हैं। कलश के मुख में भगवान विष्णु, कण्ठ में रुद्र, मूल में ब्रह्मा एवं मध्य में समस्त मातृकाएं विराजमान हैं।'
                    : 'In Devi Puja, Kalasha Sthapana is the primordial consecration ritual. The pot represents the manifest cosmos, holding sacred waters of the seven holy rivers, embodying Lord Vishnu at the rim, Rudra at the neck, Brahma at the base, and Mother Durga in the core.'}
                </p>
              </div>

              {/* Muhurta Windows Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-amber-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಶ್ರೇಷ್ಠ ಕಾಲ):' : currentLang === 'hi' ? 'अभिजित मुहूर्त (सर्वश्रेष्ठ वेला):' : 'Abhijit Muhurta (Supreme Window):'}</span>
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    11:45 AM - 12:35 PM
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' 
                      ? 'ಮಧ್ಯಾಹ್ನದ ಶುಭ ಕಾಲ — ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನೆಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಹಾಗೂ ಸಕಲ ದೋಷ ನಿವಾರಕ.' 
                      : currentLang === 'hi'
                      ? 'मध्याह्न की शुभ वेला — कलश प्रतिष्ठा हेतु सर्वोत्तम एवं समस्त दोष निवारक।'
                      : 'Midday window — Most auspicious for Kalasha Prathistha, removing all planetary blemishes.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-amber-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'प्रातःकालीन शुभ मुहूर्त:' : 'Morning Shubh Muhurta:'}</span>
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    06:15 AM - 08:45 AM
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' 
                      ? 'ಸೂರ್ಯೋದಯದ ನಂತರದ ಶುಭ ಮುಹೂರ್ತ — ಪೀಠ ಸಿದ್ಧತೆ ಮತ್ತು ನವಧಾನ್ಯ ಬಿತ್ತನೆಗೆ ಪ್ರಶಸ್ತ.' 
                      : currentLang === 'hi'
                      ? 'सूर्योदय पश्चात् शुभ वेला — अक्षत वेदी निर्माण एवं कलश स्थापन हेतु प्रशस्त।'
                      : 'Early morning sunrise window — Ideal for peetha preparation and grain sowing.'}
                  </p>
                </div>
              </div>

              {/* Samagri Checklist with Checkboxes */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-3">
                  <div>
                    <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{currentLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆಗೆ ಬೇಕಾಗುವ ಮುಖ್ಯ ಸಾಮಗ್ರಿಗಳು (Checklist):' : currentLang === 'hi' ? 'कलश स्थापना हेतु आवश्यक मुख्य सामग्री (सूची):' : 'Essential Samagri Checklist for Kalasha Sthapana:'}</span>
                    </h5>
                    <p className="text-xs text-stone-500">
                      {currentLang === 'kn' ? 'ಸಿದ್ಧಪಡಿಸಿದ ಸಾಮಗ್ರಿಗಳನ್ನು ಗುರುತು ಹಾಕಲು ಕ್ಲಿಕ್ ಮಾಡಿ (Click to mark items ready):' : currentLang === 'hi' ? 'तैयार सामग्री को चिह्नित करने हेतु क्लिक करें:' : 'Click checkboxes to keep track while gathering items:'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 self-start sm:self-auto">
                    {Object.values(checkedSamagri).filter(Boolean).length} / {KALASHA_SAMAGRI_LIST.length} Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {KALASHA_SAMAGRI_LIST.map((item) => {
                    const isChecked = !!checkedSamagri[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSamagri(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400 text-emerald-950 dark:text-emerald-200'
                            : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white dark:bg-stone-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-0.5">
                          <span className={`text-xs font-bold leading-tight block ${isChecked ? 'line-through opacity-75' : 'text-stone-900 dark:text-stone-100'}`}>
                            {item.name[currentLang]}
                          </span>
                          <span className="text-[11px] text-stone-500 leading-tight block">
                            {item.notes[currentLang]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Method */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 pb-2">
                  {currentLang === 'kn' 
                    ? 'ಕಲಶ ಸ್ಥಾಪನೆಯ ಹಂತ-ಹಂತದ ವಿಧಾನ (Step-by-Step Vidhi):' 
                    : currentLang === 'hi' 
                    ? 'कलश स्थापना का क्रमबद्ध विधान (चरण-दर-चरण विधि):' 
                    : 'Step-by-Step Kalasha Sthapana Method:'}
                </h5>

                <div className="space-y-3.5 text-xs text-stone-700 dark:text-stone-300">
                  {KALASHA_STHAPANA_STEPS.map((s) => (
                    <div key={s.stepNumber} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1.5">
                      <span className="font-bold text-red-700 dark:text-red-400 text-xs block">
                        {s.title[currentLang]}
                      </span>
                      <p className="leading-relaxed">
                        {s.instruction[currentLang]}
                      </p>

                      {s.mantra && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 space-y-1 mt-2">
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider">
                            {currentLang === 'kn' ? 'ಪವಿತ್ರ ಆವಾಹನಾ ಮಂತ್ರಗಳು:' : currentLang === 'hi' ? 'पवित्र आवाहन मन्त्र:' : 'Sacred Invocation Mantras:'}
                          </span>
                          <p className="font-serif font-bold text-amber-950 dark:text-amber-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {currentLang === 'kn' ? s.mantra.kannadaText : currentLang === 'hi' ? s.mantra.sanskritText : s.mantra.sanskritText}
                          </p>
                          <p className="text-[11px] font-mono text-stone-500 whitespace-pre-line">
                            {s.mantra.englishTransliteration}
                          </p>
                          <p className="text-[11px] text-stone-700 dark:text-stone-300 pt-1 border-t border-amber-200 dark:border-stone-800">
                            <strong>{currentLang === 'kn' ? 'ಅರ್ಥ:' : currentLang === 'hi' ? 'अर्थ:' : 'Meaning:'}</strong> {s.mantra.meaning[currentLang]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1B: AKHANDA DEEPA STHAPANA & DIRECTION GUIDE */}
          {/* ========================================================================= */}
          {activeTab === 'akhandaDeepa' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Intro Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 text-white space-y-2 border border-amber-500/40 shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {currentLang === 'kn' ? '೯ ದಿನಗಳ ಅಖಂಡ ಜ್ಯೋತಿ • ಪರಮ ಪವಿತ್ರ ಮಹಾವಿಧಾನ' : currentLang === 'hi' ? '९ दिवसीय अखण्ड ज्योति • परम पवित्र विधान' : 'Eternal Sacred Flame • 9 Days of Navaratri'}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.intro[currentLang]}
                </p>
              </div>

              {/* Direction Significance Banner (IMPORTANT) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-400 dark:border-amber-700/80 flex items-start gap-3 text-xs leading-relaxed text-amber-950 dark:text-amber-200 shadow-2xs">
                <span className="text-2xl mt-0.5 shrink-0">🧭</span>
                <div>
                  <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                    {currentLang === 'kn' ? 'ಪವಿತ್ರ ದಿಕ್ಕು & ವಾಸ್ತು ನಿಯಮ (Sacred Direction Guide):' : currentLang === 'hi' ? 'पवित्र दिशा एवं वास्तु विधान:' : 'Sacred Direction & Vastu Rules:'}
                  </h5>
                  <p className="font-medium text-stone-800 dark:text-stone-200">
                    {AKHANDA_DEEPA_STHAPANA_DETAILS.directionSignificance[currentLang]}
                  </p>
                </div>
              </div>

              {/* 1. Required Materials */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೧</span>
                  <span>
                    {currentLang === 'kn' ? '೧. ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು (Essential Materials)' : currentLang === 'hi' ? '१. आवश्यक सामग्री (Essential Materials)' : '1. Essential Materials for Akhanda Deepa'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.samagriList.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-800/60 flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{item.icon || '🪔'}</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-xs block">
                          {item.name[currentLang]}
                        </span>
                        <p className="text-[11.5px] text-stone-600 dark:text-stone-400 leading-snug">
                          {item.details[currentLang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Step-by-Step Installation */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೨</span>
                  <span>
                    {currentLang === 'kn' ? '೨. ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ಬೆಳಗಿಸುವ ವಿಧಾನ' : currentLang === 'hi' ? '२. दीप स्थापना एवं प्रज्वलन विधि' : '2. Installation & Lighting Procedure'}
                  </span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.stepByStepVidhi.map((step) => (
                    <div 
                      key={step.stepNumber}
                      className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-mono shrink-0">
                          {step.stepNumber}
                        </span>
                        <span className="font-serif">{step.title[currentLang]}</span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                        {step.instruction[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Sacred Lighting Shlokas */}
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border-2 border-amber-400 dark:border-amber-700 space-y-3 shadow-2xs">
                <h4 className="font-serif font-black text-base text-amber-950 dark:text-amber-200 flex items-center gap-2">
                  <span>🔥</span>
                  <span>
                    {currentLang === 'kn' ? '೩. ದೀಪ ಹಚ್ಚುವಾಗ ಹೇಳಬೇಕಾದ ಶ್ಲೋಕ (Sacred Lighting Shlokas)' : currentLang === 'hi' ? '३. दीप प्रज्वलन मन्त्र' : '3. Sacred Mantras during Lighting'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                      {currentLang === 'kn' ? 'ಶ್ಲೋಕ ೧ (Deepa Jyoti Parabrahma):' : 'Shloka 1:'}
                    </span>
                    <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                      {currentLang === 'hi' 
                        ? 'दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ।\nदीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥'
                        : 'ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ |\nದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                      <strong>{currentLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                      {currentLang === 'kn'
                        ? 'ದೀಪದ ಜ್ಯೋತಿಯೇ ಪರಬ್ರಹ್ಮ, ಜ್ಯೋತಿಯೇ ಜನಾರ್ದನ. ಈ ಜ್ಯೋತಿಯು ನನ್ನ ಸಮಸ್ತ ಪಾಪಗಳನ್ನು ಹೋಗಲಾಡಿಸಲಿ; ಪವಿತ್ರ ದೀಪಜ್ಯೋತಿಗೆ ನನ್ನ ನಮಸ್ಕಾರ.'
                        : 'The flame of this sacred lamp is Supreme Brahman and Lord Janardana. May this effulgent flame dissolve all sins; salutations to the sacred Deepa Jyoti.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                      {currentLang === 'kn' ? 'ಶ್ಲೋಕ ೨ (Shubham Karoti Kalyanam):' : 'Shloka 2:'}
                    </span>
                    <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                      {currentLang === 'hi'
                        ? 'शुभं करोति कल्याणमारोग्यं धनसम्पदः ।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥'
                        : 'ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ |\nಶತ್ರುಬುದ್ಧಿವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                      <strong>{currentLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                      {currentLang === 'kn'
                        ? 'ಶುಭ, ಕಲ್ಯಾಣ, ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಸಂಪತ್ತನ್ನು ಕರುಣಿಸುವ ಹಾಗೂ ದುಷ್ಟಬುದ್ಧಿ-ಶತ್ರುಭಾವನೆಯನ್ನು ನಾಶಮಾಡುವ ಮಂಗಳ ಜ್ಯೋತಿಗೆ ನಮಸ್ಕಾರ.'
                        : 'Bestowing auspiciousness, supreme welfare, radiant health, and abundant wealth while removing all negative thoughts; salutations to the divine flame.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Golden Rules for Maintenance */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3 text-xs leading-relaxed">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೪</span>
                  <span>
                    {currentLang === 'kn' ? '೪. ಮುಖ್ಯವಾಗಿ ಗಮನಿಸಬೇಕಾದ ನಿಯಮಗಳು (Golden Rules)' : currentLang === 'hi' ? '४. महत्त्वपूर्ण सावधानियां एवं नियम' : '4. Sacred Maintenance Rules'}
                  </span>
                </h4>

                <div className="space-y-2">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.goldenRules.map((rule) => (
                    <div key={rule.ruleNumber} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {rule.ruleNumber}. {rule.title[currentLang]}
                      </div>
                      <p className="text-stone-600 dark:text-stone-400">
                        {rule.instruction[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Visarjana */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {currentLang === 'kn' ? '೫. ಅಖಂಡ ದೀಪ ವಿಸರ್ಜನೆ (Deepa Visarjana):' : '5. Akhanda Deepa Visarjana:'}
                </h5>
                <p className="leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ವ್ರತದ ಕೊನೆಯಲ್ಲಿ ದೀಪವನ್ನು ಎಂದಿಗೂ ಬಾಯಿಯಿಂದ ಊದಿ ಆರಿಸಬಾರದು. ಎಣ್ಣೆ/ತುಪ್ಪ ತಾನಾಗಿಯೇ ಶಾಂತವಾಗಲು ಬಿಡಬೇಕು, ಅಥವಾ ಹೂವಿನಿಂದ ಹಾಲು/ತುಪ್ಪದ ಹನಿ ಚಿಮುಕಿಸಿ ಗೌರವಪೂರ್ವಕವಾಗಿ ಶಾಂತಗೊಳಿಸಬೇಕು. ಆಧಾರ ಪೀಠದ ಧಾನ್ಯಗಳನ್ನು ಪ್ರಸಾದವಾಗಿ ಅಡುಗೆಯಲ್ಲಿ ಬಳಸಬೇಕು.'
                    : 'At the conclusion of the vrata, the lamp must NEVER be blown out. Let it extinguish naturally as fuel finishes, or gently calm the flame using a flower dipped in milk/ghee. The foundation grains should be cooked as Prasad.'}
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DAILY 9 NAVADURGA PUJA (DAYS 1 TO 9) & UNIVERSAL PUJA KRAMA */}
          {/* ========================================================================= */}
          {activeTab === 'dailyDurga' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Universal Daily Navadurga Worship Steps (User requested: "how Nadurga pooja every day performed") */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3.5 shadow-sm">
                <div className="border-b border-stone-200 dark:border-stone-700 pb-2.5">
                  <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ದಿನನಿತ್ಯದ ಸಾಮಾನ್ಯ ಆರಾಧನಾ ಕ್ರಮ' : currentLang === 'hi' ? 'दैनिक सामान्य पूजन विधि' : 'Universal Daily Pooja Sequence'}
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn' 
                      ? 'ಪ್ರತಿದಿನ ನವದುರ್ಗಾ ಪೂಜೆಯನ್ನು ಹೇಗೆ ಮಾಡಬೇಕು? (೬ ಹಂತಗಳ ಕ್ರಮ)' 
                      : currentLang === 'hi'
                      ? 'प्रतिदिन नवदुर्गा पूजन किस प्रकार करें? (६ चरण)'
                      : 'How Navadurga Pooja is Performed Daily (6-Step Krama)'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {DAILY_NAVADURGA_PUJA_KRAMA.map((k) => (
                    <div key={k.step} className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1 text-xs">
                      <span className="font-bold text-amber-800 dark:text-amber-400 block">
                        {k.title[currentLang]}
                      </span>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-[11.5px]">
                        {k.desc[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Selector Ribbon (Days 1 to 9) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {currentLang === 'kn' ? 'ನವರಾತ್ರಿ ದಿನವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Day 1 to 9):' : currentLang === 'hi' ? 'नवरात्रि दिवस चुनें (दिवस १ से ९):' : 'Select Navaratri Day (1 to 9):'}
                </span>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                  {navaratriDays.slice(0, 9).map((d) => {
                    const isSelected = selectedDayNumber === d.dayNumber;
                    return (
                      <button
                        key={d.dayNumber}
                        type="button"
                        onClick={() => setSelectedDayNumber(d.dayNumber)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/50 scale-102'
                            : 'bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold">
                          {currentLang === 'kn' ? `ದಿನ ${d.dayNumber}` : currentLang === 'hi' ? `दिवस ${d.dayNumber}` : `Day ${d.dayNumber}`}
                        </span>
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-2xs shrink-0" 
                          style={{ backgroundColor: d.hex }}
                        />
                        <span className="text-[10.5px] font-serif font-bold truncate max-w-full">
                          {d.goddessAvatar[currentLang].split(' ')[1] || d.goddessAvatar[currentLang]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Day Full Ritual Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-stone-850 border-2 border-amber-300 dark:border-stone-700 shadow-lg space-y-5">
                
                {/* Header with Avatar & Auspicious Color Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md border-2 border-white/40 shrink-0 font-serif text-2xl font-bold"
                      style={{ backgroundColor: activeDayColor.hex }}
                    >
                      {selectedDayNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                          {activeDayRitual.deity[currentLang]}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-300">
                          {activeDayRitual.tithiTitle[currentLang]}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">
                        {activeDayColor.weekdayName[currentLang]} • {activeDayColor.rulingPlanet[currentLang]}
                      </span>
                    </div>
                  </div>

                  {/* Auspicious Color Pill */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div 
                      className="w-6 h-6 rounded-lg border border-white shadow-2xs shrink-0" 
                      style={{ backgroundColor: activeDayColor.hex }}
                    />
                    <div className="text-left text-xs">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        {activeDayColor.colorName[currentLang]}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {currentLang === 'kn' ? 'ದಿನದ ಮಂಗಳ ವರ್ಣ' : currentLang === 'hi' ? 'दिवस का पावन रंग' : 'Color of the Day'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Significance & Form */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ಸ್ವರೂಪ & ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವ:' : currentLang === 'hi' ? 'स्वरूप एवं आध्यात्मिक महत्त्व:' : 'Spiritual Significance:'}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    {activeDayRitual.significance[currentLang]}
                  </p>
                </div>

                {/* Offerings and Clothing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                    <span className="font-bold text-amber-700 dark:text-amber-400 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{currentLang === 'kn' ? 'ದೇವಿಗೆ ಪ್ರಿಯವಾದ ನೈವೇದ್ಯ (Sacred Offering):' : currentLang === 'hi' ? 'प्रिय नैवेद्य एवं भोग:' : 'Sacred Naivedya / Offering:'}</span>
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {activeDayColor.sacredOffering[currentLang]}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                    <span className="font-bold text-purple-700 dark:text-purple-400 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-purple-500" />
                      <span>{currentLang === 'kn' ? 'ವಸ್ತ್ರ ಧಾರಣೆ ಮಾರ್ಗದರ್ಶನ (Attire):' : currentLang === 'hi' ? 'वस्त्र धारण निर्देश:' : 'Clothing Guidance:'}</span>
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {activeDayColor.clothingGuidance[currentLang]}
                    </p>
                  </div>
                </div>

                {/* Dhyana Mantra */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border border-amber-300 dark:border-stone-700 space-y-2">
                  <span className="text-[10.5px] font-bold text-red-900 dark:text-red-400 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ದಿನದ ಧ್ಯಾನ ಮಂತ್ರ (Daily Dhyana Mantra):' : currentLang === 'hi' ? 'दैनिक ध्यान मन्त्र:' : 'Prescribed Dhyana Mantra:'}
                  </span>
                  <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm leading-relaxed">
                    {currentLang === 'kn' ? activeDayRitual.dhyanaMantra.kannada : activeDayRitual.dhyanaMantra.sanskrit}
                  </p>
                  <p className="text-[11px] font-mono text-stone-500 leading-normal">
                    {activeDayRitual.dhyanaMantra.english}
                  </p>
                </div>

                {/* Special Daily Ritual Actions */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    {currentLang === 'kn' ? 'ದಿನನಿತ್ಯದ ಮುಖ್ಯ ಪೂಜಾ ವಿಧಿಗಳು:' : currentLang === 'hi' ? 'दैनिक विशेष पूजा अनुष्ठान:' : 'Special Daily Puja Practices:'}
                  </span>
                  <div className="space-y-1.5">
                    {activeDayRitual.specialRituals.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{r[currentLang]}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: KUSHMANDA BALI (ASHTAMI BALI) & SANDHI PUJA */}
          {/* ========================================================================= */}
          {activeTab === 'kushmandaBali' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950 via-stone-950 to-red-950 text-white space-y-2 border border-purple-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {currentLang === 'kn' 
                      ? 'ಮಹಾಷ್ಟಮಿ ರಹಸ್ಯ • ಸಾತ್ವಿಕ ಬಲಿ ಮಹಾವಿಧಿ' 
                      : currentLang === 'hi'
                      ? 'महाष्टमी रहस्य • सात्त्विक बलि महाविधान'
                      : 'Secret of Maha Ashtami • Satvik Bali Mahavidhi'}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {SANDHI_PUJA_DETAILS.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                  {SANDHI_PUJA_DETAILS.subtitle[currentLang]}
                </p>
              </div>

              {/* Precise Sandhi Kala & Muhurta Breakdown */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-purple-400 dark:border-stone-700 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-700 pb-3">
                  <div>
                    <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{currentLang === 'kn' ? 'ಸಂಧಿ ಪೂಜೆ & ಬಲಿ ಮುಹೂರ್ತದ ನಿಖರ ಲೆಕ್ಕಾಚಾರ' : currentLang === 'hi' ? 'सन्धि पूजा एवं बलि मुहूर्त की सूक्ष्म गणना' : 'Sandhi Puja & Kushmanda Bali Muhurta Calculation'}</span>
                    </h5>
                    <p className="text-xs text-stone-500">
                      {currentLang === 'kn' ? '೪೮ ನಿಮಿಷಗಳ ನಿಖರ ಸಂಧಿ ಕಾಲದ ವಿವರ:' : currentLang === 'hi' ? '४८ मिनट के शास्त्रोक्त सन्धिकालीन मिलन का विवरण:' : 'Exact 48-minute scriptural confluence calculation:'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-mono font-bold">
                    48 Minutes Sandhi Window
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Primary Sandhi Window */}
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-300 dark:border-purple-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 block">
                      {currentLang === 'kn' ? '೧. ಸಂಧಿ ಪೂಜಾ ಕಾಲ (೪೮ ನಿಮಿಷಗಳ ಸಂಧಿಕಾಲ):' : currentLang === 'hi' ? '१. सन्धि पूजा काल (४८ मिनट का पावन सन्धिकाळ):' : '1. Sandhi Kala (48-Minute Confluence):'}
                    </span>
                    <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                      {sandhiTiming.sandhiStart} - {sandhiTiming.sandhiEnd}
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-purple-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
                      <strong className="text-purple-700 dark:text-purple-400">
                        {currentLang === 'kn' ? 'ಬಲಿ ಕೊಯ್ಯುವ ನಿಖರ ಸಮಯ (ದ್ವಿತೀಯಾರ್ಧ):' : currentLang === 'hi' ? 'बलि छेदन का यथार्थ समय (द्वितीयार्ध):' : 'Precise Bali Cutting Window:'}
                      </strong>{' '}
                      <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{sandhiTiming.baliWindowStart} - {sandhiTiming.baliWindowEnd}</span>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {currentLang === 'kn' 
                          ? '೪೮ ನಿಮಿಷದ ದ್ವಿತೀಯಾರ್ಧದಲ್ಲಿ ಬಲಿ ಛೇದನ ನಡೆಸಿ ಆರತಿ ಮಾಡಬೇಕು.' 
                          : currentLang === 'hi'
                          ? '४८ मिनट की सन्धि के दूसरे २४ मिनट में बलि छेदन कर सन्धि आरती की जाती है।'
                          : 'Bali is executed in the second half of Sandhi period during Sandhi Aarti.'}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Alternative Window */}
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                      {currentLang === 'kn' ? '೨. ಪರ್ಯಾಯ ಕಾಲ (ಪ್ರದೋಷ ಕಾಲ):' : currentLang === 'hi' ? '२. शास्त्रसम्मत विकल्प (प्रदोष वेला):' : '2. Alternative Window (Pradosha Kala):'}
                    </span>
                    <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                      {sandhiTiming.pradoshaStart} - {sandhiTiming.pradoshaEnd}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {currentLang === 'kn'
                        ? 'ಮಧ್ಯರಾತ್ರಿ ಸಂಧಿಕಾಲ ಆಚರಿಸಲು ಸಾಧ್ಯವಾಗದಿದ್ದರೆ, ಅಷ್ಟಮಿಯ ಸೂರ್ಯಾಸ್ತದ ಸಂಧ್ಯಾ ಕಾಲದಲ್ಲಿ (ಪ್ರದೋಷ ಕಾಲ) ಅರ್ಚನೆ ಪೂರ್ಣಗೊಳಿಸಿ ಬಲಿ ಸಮರ್ಪಿಸಬಹುದು.'
                        : currentLang === 'hi'
                        ? 'यदि मध्यरात्रि का सन्धिकाल पालन करना सम्भव न हो, तो अष्टमी की सायंकालीन प्रदोष वेला (सूर्यास्त काल) में पूजन पूर्ण कर बलि समर्पित करना शास्त्रसम्मत है।'
                        : 'If midnight transition cannot be observed, the Bali is scripturally sanctioned during Pradosha Kala (sunset transition) on Ashtami evening.'}
                    </p>
                  </div>

                </div>

                {/* Explanation of Why People are Confused */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs leading-relaxed space-y-1.5 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <Info className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentLang === 'kn' ? 'ಮುಹೂರ್ತ ಗೊಂದಲ ಏಕೆ & ವಾಸ್ತವ ಶಾಸ್ತ್ರೀಯ ನಿಯಮ:' : currentLang === 'hi' ? 'मुहूर्त को लेकर भ्रम क्यों होता है एवं शास्त्रीय समाधान:' : 'Why Confusion Occurs & Scriptural Resolution:'}</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-300">
                    {SANDHI_PUJA_DETAILS.whyPeopleConfuse[currentLang]}
                  </p>
                </div>
              </div>

              {/* Kushmanda / Pumpkin Symbolism */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm">
                <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span>🎃</span>
                  <span>{currentLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಬಲಿಯ ಸಾತ್ವಿಕ ಮಹತ್ವ:' : currentLang === 'hi' ? 'कूष्माण्ड (पेठा) सात्त्विक बलि का रहस्य एवं महत्त्व:' : 'Satvik Significance of White Ash Gourd (Kushmanda):'}</span>
                </h5>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {SANDHI_PUJA_DETAILS.kushmandaSignificance[currentLang]}
                </p>
              </div>

              {/* Bali Invocation Mantra Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-100 via-amber-100 to-red-100 dark:from-red-950/40 dark:via-stone-900 dark:to-red-950/40 border-2 border-red-400 dark:border-red-900 space-y-2">
                <span className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wider block">
                  {currentLang === 'kn' ? 'ಬಲಿ ಸಮರ್ಪಣಾ ಸಂಕಲ್ಪ ಮಂತ್ರ:' : currentLang === 'hi' ? 'बलि समर्पण संकल्प मन्त्र:' : 'Sacred Bali Invocation Mantra:'}
                </span>
                <p className="font-serif font-bold text-red-950 dark:text-red-200 text-sm sm:text-base leading-relaxed">
                  "{currentLang === 'kn' ? SANDHI_PUJA_DETAILS.baliMantra.kannadaText : SANDHI_PUJA_DETAILS.baliMantra.sanskritText}"
                </p>
                <p className="font-mono text-xs text-stone-600 dark:text-stone-400">
                  {SANDHI_PUJA_DETAILS.baliMantra.englishTransliteration}
                </p>
                <div className="pt-2 border-t border-red-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200">
                  <strong>{currentLang === 'kn' ? 'ಭಾವಾರ್ಥ:' : currentLang === 'hi' ? 'भावार्थ:' : 'Meaning:'}</strong> {SANDHI_PUJA_DETAILS.baliMantra.meaning[currentLang]}
                </div>
              </div>

              {/* Step-by-Step Method for Bali */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-sm">
                <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 pb-2">
                  {currentLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ ಬಲಿ ಕೊಯ್ಯುವ ಹಂತ-ಹಂತದ ವಿಧಾನ (Step-by-Step Vidhi):' : currentLang === 'hi' ? 'कूष्माण्ड बलि छेदन की क्रमबद्ध विधि:' : 'Step-by-Step Method for Pumpkin Bali:'}
                </h5>

                <div className="space-y-3">
                  {SANDHI_PUJA_DETAILS.stepByStepBaliVidhi.map((stepItem) => (
                    <div key={stepItem.step} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300">
                        <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[11px] shrink-0 font-mono">
                          {stepItem.step}
                        </span>
                        <span>{stepItem.title[currentLang]}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed pl-7">
                        {stepItem.desc[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: AYUDHA PUJA & SARASWATI PUJA (DAY 9) */}
          {/* ========================================================================= */}
          {activeTab === 'ayudhaPuja' && (
            <div className="space-y-6 animate-in fade-in">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-950 via-stone-950 to-indigo-950 text-white space-y-2 border border-sky-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{currentLang === 'kn' ? 'ಮಹಾನವಮಿ • ಕಾಯಕವೇ ಕೈಲಾಸ ತತ್ತ್ವ' : currentLang === 'hi' ? 'महानवमी • कर्म ही पूजा है का पावन सन्देश' : 'Maha Navami • Consecration of Tools & Wisdom'}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {AYUDHA_PUJA_DETAILS.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  {AYUDHA_PUJA_DETAILS.significance[currentLang]}
                </p>
              </div>

              {/* Muhurta Windows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 block">
                    {currentLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'प्रातःकालीन शुभ मुहूर्त:' : 'Morning Shubh Window:'}
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    06:15 AM - 08:45 AM
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಅಮೃತ ಮುಹೂರ್ತ — ವಾಹನ ಮತ್ತು ಗೃಹ ಪರಿಕರಗಳ ಪೂಜೆಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತ.' : currentLang === 'hi' ? 'अमृत वेला — वाहन एवं घरेलू उपकरणों की पूजा हेतु सर्वोत्तम।' : 'Auspicious morning window for vehicles, home tools, and machinery worship.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 block">
                    {currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಕಾಲ:' : currentLang === 'hi' ? 'मध्याह्न अभिजित वेला:' : 'Midday Abhijit Window:'}
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    11:45 AM - 12:35 PM
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಕಾರ್ಖಾನೆ, ಕಚೇರಿ, ವಾಣಿಜ್ಯ ಯಂತ್ರಗಳ ಪೂಜೆಗೆ ಶ್ರೇಷ್ಠ ಸಮಯ.' : currentLang === 'hi' ? 'कारखाना, कार्यालय, आईटी प्रतिष्ठान एवं यन्त्र पूजन हेतु प्रशस्त।' : 'Ideal window for industrial, factory, IT office, and business tools consecration.'}
                  </p>
                </div>
              </div>

              {/* Samagri */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                  {currentLang === 'kn' ? 'ಆಯುಧ ಪೂಜೆ ಸಾಮಗ್ರಿಗಳು:' : currentLang === 'hi' ? 'आयुध पूजा आवश्यक सामग्री:' : 'Ayudha Puja Materials:'}
                </span>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {AYUDHA_PUJA_DETAILS.samagri[currentLang]}
                </p>
              </div>

              {/* Step-by-Step Ayudha Puja */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3.5 shadow-sm text-xs">
                <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 pb-2">
                  {currentLang === 'kn' ? 'ಆಯುಧ ಪೂಜಾ ಕ್ರಮ (Step-by-Step Vidhi):' : currentLang === 'hi' ? 'आयुध पूजा की क्रमबद्ध विधि:' : 'Ayudha Puja Step-by-Step Method:'}
                </h5>

                <div className="space-y-3">
                  {AYUDHA_PUJA_DETAILS.steps.map((st) => (
                    <div key={st.step} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-300">
                        <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[11px] font-mono shrink-0">
                          {st.step}
                        </span>
                        <span>{st.title[currentLang]}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed pl-7">
                        {st.desc[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ayudha & Saraswati Mantras */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border border-sky-300 dark:border-stone-700 space-y-2 text-xs">
                <span className="font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider block">
                  {currentLang === 'kn' ? 'ಆಯುಧ & ಸರಸ್ವತೀ ಪೂಜಾ ಮಂತ್ರಗಳು:' : currentLang === 'hi' ? 'आयुध एवं सरस्वती मन्त्र:' : 'Sacred Ayudha & Saraswati Mantras:'}
                </span>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {currentLang === 'kn' ? AYUDHA_PUJA_DETAILS.mantra.kannadaText : AYUDHA_PUJA_DETAILS.mantra.sanskritText}
                </p>
                <p className="font-mono text-[11px] text-stone-500 whitespace-pre-line">
                  {AYUDHA_PUJA_DETAILS.mantra.englishTransliteration}
                </p>
                <p className="text-stone-700 dark:text-stone-300 pt-1 border-t border-sky-200 dark:border-stone-800">
                  <strong>{currentLang === 'kn' ? 'ಅರ್ಥ:' : currentLang === 'hi' ? 'अर्थ:' : 'Meaning:'}</strong> {AYUDHA_PUJA_DETAILS.mantra.meaning[currentLang]}
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: VIJAYADASHAMI, VIDYARAMBHA & KALASHA VISARJANA (UDWASANA) */}
          {/* ========================================================================= */}
          {activeTab === 'vijayadashami' && (
            <div className="space-y-6 animate-in fade-in">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-950 to-amber-950 text-white space-y-2 border border-emerald-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{currentLang === 'kn' ? 'ವಿಜಯದಶಮಿ • ಧರ್ಮ ವಿಜಯ & ನವೋದಯ' : currentLang === 'hi' ? 'विजयादशमी • अधर्म पर धर्म की जय' : 'Vijayadashami • Triumph of Righteousness'}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.significance[currentLang]}
                </p>
              </div>

              {/* Muhurtas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    {currentLang === 'kn' ? 'ವಿಜಯ ಮುಹೂರ್ತ (Supreme Victory Window):' : currentLang === 'hi' ? 'विजय मुहूर्त (अपराह्न वेला):' : 'Vijaya Muhurta (Auspicious Window):'}
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    {VIJAYADASHAMI_VISARJANA_DETAILS.muhurtas.vijayaMuhurta}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಸಕಲ ಅಡೆತಡೆಗಳನ್ನು ಮೆಟ್ಟಿನಿಂತು ಜಯ ಗಳಿಸಲು ಅತ್ಯಂತ ಪ್ರಶಸ್ತವಾದ ಅಪರಾಹ್ನ ಮುಹೂರ್ತ.' : currentLang === 'hi' ? 'समस्त बाधाओं को पार कर विजय प्राप्ति हेतु प्रशस्त अपराह्न वेला।' : 'Afternoon window dedicated to victory in ventures and boundary expansions (Seemollanghana).'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    {currentLang === 'kn' ? 'ವಿದ್ಯಾರಂಭ (ಅಕ್ಷರಾಭ್ಯಾಸ) ಮುಹೂರ್ತ:' : currentLang === 'hi' ? 'विद्यारम्भ (अक्षराभ्यास) काल:' : 'Vidyarambha / Aksharabhyasa Window:'}
                  </span>
                  <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    {VIJAYADASHAMI_VISARJANA_DETAILS.muhurtas.vidyarambhaWindow}
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' ? 'ಪುಟ್ಟ ಮಕ್ಕಳಿಗೆ ಅಕ್ಷರಭ್ಯಾಸ ಮಾಡಿಸಲು ಹಾಗೂ ಹೊಸ ವಿದ್ಯಾಭ್ಯಾಸ ಆರಂಭಿಸಲು ಶ್ರೇಷ್ಠ ಸಮಯ.' : currentLang === 'hi' ? 'बच्चों को अक्षरारम्भ कराने एवं नवीन विद्या अध्ययन हेतु पावन समय।' : 'Morning auspicious window to initiate children into reading and writing.'}
                  </p>
                </div>
              </div>

              {/* Vidyarambha / Aksharabhyasa Guide */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3 shadow-sm text-xs">
                <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-700 pb-2">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.vidyarambhaVidhi.title[currentLang]}
                </h5>

                <div className="space-y-2 text-stone-700 dark:text-stone-300 leading-relaxed">
                  <p>
                    {VIJAYADASHAMI_VISARJANA_DETAILS.vidyarambhaVidhi.desc[currentLang]}
                  </p>
                  
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-center">
                    <span className="font-serif font-bold text-sm sm:text-base text-amber-900 dark:text-amber-300 block">
                      "ಓಂ ಹರಿಃ ಶ್ರೀ ಗಣಪತಯೇ ನಮಃ | ಅವಿಘ್ನಮಸ್ತು ||"
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 block mt-0.5">
                      "Om Harih Shri Ganapataye Namah | Avighnamastu ||"
                    </span>
                  </div>
                </div>
              </div>

              {/* Shami Puja Tradition */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border border-amber-300 dark:border-stone-700 space-y-2 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.shamiPujaVidhi.title[currentLang]}
                </span>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm leading-relaxed">
                  "ಶಮೀ ಶಮಯತೇ ಪಾಪಂ ಶಮೀ ಶತ್ರುವಿನಾಶಿನೀ | ಅರ್ಜುನಸ್ಯ ಧನುರ್ಧಾರಿ ರಾಮಸ್ಯ ಪ್ರಿಯದರ್ಶಿನೀ ||"
                </p>
                <p className="font-mono text-[11px] text-stone-500">
                  (Shami Shamayate Papam Shami Shatruvinashini | Arjunasya Dhanurdhari Ramasya Priyadarshini ||)
                </p>
                <p className="text-stone-600 dark:text-stone-300 pt-1 border-t border-amber-200 dark:border-stone-800">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.shamiPujaVidhi.desc[currentLang]}
                </p>
              </div>

              {/* SPECIAL: KALASHA VISARJANA / UDWASANA VIDHI (User requested: "Dashami visarjana details") */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border-2 border-emerald-500/60 dark:border-emerald-800 space-y-4 shadow-md">
                <div className="border-b border-stone-200 dark:border-stone-700 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      {currentLang === 'kn' ? 'ಮಹೋತ್ಸವ ಸಮಾರೋಪ ಮಹಾವಿಧಿ' : currentLang === 'hi' ? 'महोत्सव समापन महाविधान' : 'Conch of Navaratri Consecration'}
                    </span>
                    <h5 className="font-serif font-black text-base sm:text-lg text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                      <span>🏺</span>
                      <span>{currentLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನೆ & ಉದ್ವಾಸನಾ ಮಹಾಕ್ರಮ' : currentLang === 'hi' ? 'कलश विसर्जन एवं उद्वासन महाविधान' : 'Kalasha Visarjana (Udwasana) Method'}</span>
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold self-start sm:self-auto">
                    {VIJAYADASHAMI_VISARJANA_DETAILS.muhurtas.kalashaVisarjanaWindow}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-stone-700 dark:text-stone-300">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.kalashaVisarjanaSteps.map((st) => (
                    <div key={st.step} className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-stone-900 border border-emerald-200 dark:border-stone-700 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-mono shrink-0">
                          {st.step}
                        </span>
                        <span>{st.title[currentLang]}</span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-300 leading-relaxed pl-7 text-[11.5px]">
                        {st.desc[currentLang]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sacred Visarjana Mantras Card */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ಪ್ರಧಾನ ವಿಸರ್ಜನಾ ಮಂತ್ರಗಳು (Chant while gently moving Kalasha):' : currentLang === 'hi' ? 'प्रधान विसर्जन मन्त्र:' : 'Primary Visarjana Mantras:'}
                  </span>
                  <div className="space-y-1 font-serif font-bold text-amber-950 dark:text-amber-200 text-xs sm:text-sm">
                    <p>"ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ | ಯತ್ಪೂಜಿತಂ ಮಯಾ ದೇವಿ ಪರಿಪೂರ್ಣಂ ತದಸ್ತು ಮೇ ||"</p>
                    <p>"ಯಾಂತು ದೇವಗಣಾಃ ಸರ್ವೇ ಪೂಜಾಮಾದಾಯ ಮಾಮಕೀಮ್ | ಇಷ್ಟಕಾಮಸಮೃದ್ಧರ್ಥಂ ಪುನರಾಗಮನಾಯ ಚ ||"</p>
                  </div>
                  <div className="text-[10.5px] font-mono text-stone-500 pt-1 border-t border-amber-200 dark:border-stone-800">
                    Gachha Gachha Param Sthanam Swasthanam Parameshwari | Yatpoojitam Maya Devi Paripoornam Tadastu Me ||
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <span className="text-base">🪔</span>
            <span>
              {currentLang === 'kn' 
                ? 'ವೈದಿಕ ನವರಾತ್ರಿ ಮಹೋತ್ಸವ — ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಭಕ್ತಿಯಿಂದ ಪೂಜಿಸಿ ಕೃತಾರ್ಥರಾಗಿ' 
                : currentLang === 'hi'
                ? 'वैदिक नवरात्रि महोत्सव — शुभ मुहूर्त में भक्तिपूर्वक पूजन कर अनुग्रह प्राप्त करें'
                : 'Sacred Vedic Navaratri — May Divine Mother Durga bless your household with peace and victory'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
          >
            {currentLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : currentLang === 'hi' ? 'बन्द करें (Close)' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

export { NavaratriRitualModal } from './NavaratriRitualModal';
