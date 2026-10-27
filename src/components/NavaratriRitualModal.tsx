import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Maximize2, 
  Minimize2, 
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Check,
  Languages
} from 'lucide-react';
import { CityLocation, Language, PanchangaDay } from '../types';
import { 
  KALASHA_SAMAGRI_LIST, 
  KALASHA_STHAPANA_STEPS,
  AKHANDA_DEEPA_STHAPANA_DETAILS,
  DAILY_NAVADURGA_PUJA_KRAMA,
  AYUDHA_PUJA_DETAILS,
  VIJAYADASHAMI_VISARJANA_DETAILS,
  SANDHI_PUJA_DETAILS, 
  NAVARATRI_10_DAYS_RITUALS, 
  getCalculatedSandhiTiming 
} from '../utils/navaratriRitualsData';
import { getNavaratriColorsForYear } from '../utils/navaratriColors';

export interface NavaratriRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLanguageChange?: (lang: Language) => void;
  selectedYear?: number;
  selectedCity?: CityLocation;
  currentDay?: PanchangaDay | null;
  initialTab?: 'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami';
  initialDayNumber?: number;
}

export const NavaratriRitualModal: React.FC<NavaratriRitualModalProps> = ({
  isOpen,
  onClose,
  currentLang: initialLang,
  onLanguageChange,
  selectedYear = new Date().getFullYear(),
  selectedCity,
  currentDay,
  initialTab = 'kalasha',
  initialDayNumber = 1
}) => {
  // Local language state allowing instant switching within the modal, synced with parent if callback exists
  const [modalLang, setModalLang] = useState<Language>(initialLang);
  const [activeTab, setActiveTab] = useState<'kalasha' | 'akhandaDeepa' | 'dailyDurga' | 'kushmandaBali' | 'ayudhaPuja' | 'vijayadashami'>(initialTab);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(initialDayNumber);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [checkedSamagri, setCheckedSamagri] = useState<Record<string, boolean>>({});

  // Synchronize when external currentLang changes
  React.useEffect(() => {
    setModalLang(initialLang);
  }, [initialLang]);

  // Synchronize initialTab and initialDayNumber
  React.useEffect(() => {
    setActiveTab(initialTab);
    setSelectedDayNumber(initialDayNumber);
  }, [initialTab, initialDayNumber]);

  const handleLanguageToggle = (newLang: Language) => {
    setModalLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

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
    // Fallback astronomical calculation based on October 19 standard
    return {
      sandhiStart: '10:24 AM',
      sandhiEnd: '11:12 AM',
      baliWindowStart: '10:48 AM',
      baliWindowEnd: '11:12 AM',
      pradoshaStart: '06:05 PM',
      pradoshaEnd: '07:17 PM',
      ashtamiEndTimeStr: '10:48 AM',
      explanation: {
        en: 'Exact Sandhi Kala spans 48 minutes (10:24 AM - 11:12 AM), representing the final 24 minutes of Maha Ashtami and first 24 minutes of Maha Navami. The Kushmanda (Ash Gourd) Satvik Bali is performed during the second half (10:48 AM - 11:12 AM) or during Pradosha transition (06:05 PM - 07:17 PM).',
        kn: 'ನಿಖರ ಸಂಧಿಕಾಲ ಮುಹೂರ್ತ: 10:24 AM ರಿಂದ 11:12 AM (ಒಟ್ಟು ೪೮ ನಿಮಿಷ: ಅಷ್ಟಮಿಯು 10:48 AM ಕ್ಕೆ ಮುಕ್ತಾಯವಾಗುವ ಮುನ್ನ ೨೪ ನಿಮಿಷ ಹಾಗೂ ನವಮಿಯ ಮೊದಲ ೨೪ ನಿಮಿಷ). ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಸಾತ್ವಿಕ ಬಲಿಯನ್ನು ಎರಡನೇ ಅರ್ಧಭಾಗದಲ್ಲಿ (10:48 AM - 11:12 AM) ಅಥವಾ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ (06:05 PM - 07:17 PM) ಸಮರ್ಪಿಸಬೇಕು.',
        hi: 'यथार्थ सन्धिकाल: 10:24 AM से 11:12 AM (कुल ४८ मिनट: अष्टमी समाप्ति 10:48 AM से पूर्व २४ मिनट एवं नवमी के आरम्भिक २४ मिनट)। सात्त्विक कूष्माण्ड बलि द्वितीयार्ध (10:48 AM - 11:12 AM) अथवा प्रदोष वेला में अर्पित की जाती है।'
      }
    };
  }, [currentDay]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div 
        className={`relative w-full bg-stone-50 dark:bg-stone-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'h-[98vh] max-w-[99vw]' : 'max-w-[97vw] xl:max-w-[1580px] h-[94vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-700 via-amber-700 to-orange-700 text-white shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-xl sm:text-2xl shadow-lg border-2 border-white/40 shrink-0 font-serif font-black">
              🌺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-widest">
                  {modalLang === 'kn' ? 'ಶರನ್ನವರಾತ್ರಿ ಮಹೋತ್ಸವ' : modalLang === 'hi' ? 'शारदीय नवरात्रि महोत्सव' : 'Sharannavaratri Mahotsava'}
                </span>
                <span className="text-amber-200 text-xs font-mono font-bold hidden sm:inline">
                  {selectedYear}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-serif font-bold tracking-tight text-white mt-0.5">
                {modalLang === 'kn' ? 'ನವರಾತ್ರಿ ಸಂಪೂರ್ಣ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿ & ವಿಧಿ-ವಿಧಾನ' : modalLang === 'hi' ? 'सम्पूर्ण नवरात्रि पूजा विधान एवं मन्त्र संकलन' : 'Complete Navaratri Rituals, Kalasa & Bali Hub'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* IN-MODAL TRILINGUAL SWITCHER */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/30 border border-white/30 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => handleLanguageToggle('kn')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'kn' ? 'bg-amber-400 text-stone-950 shadow-sm' : 'text-amber-100 hover:text-white'
                }`}
                title="ಕನ್ನಡ (Kannada)"
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'hi' ? 'bg-amber-400 text-stone-950 shadow-sm' : 'text-amber-100 hover:text-white'
                }`}
                title="संस्कृत / हिन्दी (Devanagari)"
              >
                संस्कृत
              </button>
              <button
                type="button"
                onClick={() => handleLanguageToggle('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  modalLang === 'en' ? 'bg-amber-400 text-stone-950 shadow-sm' : 'text-amber-100 hover:text-white'
                }`}
                title="English"
              >
                English
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer hidden md:flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-all cursor-pointer flex items-center justify-center ring-1 ring-white/30"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar (5 Core Ritual Sections) */}
        <div className="p-2 sm:p-3 bg-stone-100 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('kalasha')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'kalasha'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🏺</span>
              <span>
                {modalLang === 'kn' ? '೧. ಕಲಶ ಸ್ಥಾಪನಾ ವಿಧಿ' : modalLang === 'hi' ? '१. कलश स्थापना विधि' : '1. Kalasa Sthapana'}
              </span>
            </button>

            {/* Tab 1B: Akhanda Deepa Sthapana & Directions */}
            <button
              onClick={() => setActiveTab('akhandaDeepa')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'akhandaDeepa'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🪔</span>
              <span>
                {modalLang === 'kn' ? '೧ಬಿ. ಅಖಂಡ ದೀಪ ಸ್ಥಾಪನೆ & ದಿಕ್ಕು' : modalLang === 'hi' ? '१ख. अखण्ड दीप स्थापना व दिशा' : '1B. Akhanda Deepa & Directions'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dailyDurga')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'dailyDurga'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🌺</span>
              <span>
                {modalLang === 'kn' ? '೨. ದಿನಂಪ್ರತಿ ನವದುರ್ಗಾ ಪೂಜೆ' : modalLang === 'hi' ? '२. दैनिक नवदुर्गा पूजन' : '2. Daily Navadurga Puja'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kushmandaBali')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'kushmandaBali'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🗡️</span>
              <span>
                {modalLang === 'kn' ? '೩. ಅಷ್ಟಮೀ ಕೂಷ್ಮಾಂಡ ಬಲಿ' : modalLang === 'hi' ? '३. महाष्टमी कूष्माण्ड बलि' : '3. Ashtami Sandhi & Bali'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ayudhaPuja')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ayudhaPuja'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🛠️</span>
              <span>
                {modalLang === 'kn' ? '೪. ನವಮೀ ಆಯುಧ & ಸರಸ್ವತೀ' : modalLang === 'hi' ? '४. आयुध एवं सरस्वती पूजन' : '4. Ayudha & Saraswati'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vijayadashami')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'vijayadashami'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
            >
              <span className="text-base">🏹</span>
              <span>
                {modalLang === 'kn' ? '೫. ವಿಜಯದಶಮಿ & ಕಲಶ ವಿಸರ್ಜನೆ' : modalLang === 'hi' ? '५. विजयादशमी एवं कलश विसर्जन' : '5. Dashami Visarjana'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-stone-800 dark:text-stone-200">
          
          {/* ========================================================================= */}
          {/* TAB 1: KALASA STHAPANA VIDHI (ಕಲಶ ಸ್ಥಾಪನಾ ವಿಧಿ & ಸಾಮಗ್ರಿ) */}
          {/* ========================================================================= */}
          {activeTab === 'kalasha' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Significance Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400 dark:border-amber-600/60 flex items-start gap-3.5">
                <span className="text-3xl shrink-0">🏺</span>
                <div className="space-y-1">
                  <h3 className="font-serif font-black text-base sm:text-lg text-amber-950 dark:text-amber-200">
                    {modalLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆಯ ಮಹತ್ವ & ಬ್ರಹ್ಮಾಂಡ ತತ್ವ:' : modalLang === 'hi' ? 'कलश स्थापना का आध्यात्मिक रहस्य एवं ब्रह्माण्ड दर्शन:' : 'Significance of Kalasa Sthapana & Cosmic Symbolism:'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {modalLang === 'kn'
                      ? 'ದೇವಿ ಪೂಜೆಯಲ್ಲಿ ಕಲಶ ಸ್ಥಾಪನೆ ಅತ್ಯಂತ ಮುಖ್ಯವಾದ ವಿಧಿ. ಕಲಶವನ್ನು ಸಕಲ ಬ್ರಹ್ಮಾಂಡದ ಸಂಕೇತವೆಂದು ಮತ್ತು ಪವಿತ್ರ ತೀರ್ಥಗಳು ಹಾಗೂ ದೇವತಾ ಶಕ್ತಿಗಳು ಅದರಲ್ಲಿ ನೆಲೆಸಿವೆ ಎಂದು ಭಾವಿಸಿ ಪೂಜಿಸಲಾಗುತ್ತದೆ. ಕಲಶದ ಮುಖದಲ್ಲಿ ವಿಷ್ಣು, ಕಂಠದಲ್ಲಿ ರುದ್ರ, ಮೂಲದಲ್ಲಿ ಬ್ರಹ್ಮ ಹಾಗೂ ಮಧ್ಯದಲ್ಲಿ ಮಾತೃಗಣಗಳು ನೆಲೆಸಿರುತ್ತಾರೆ.'
                      : modalLang === 'hi'
                      ? 'कलश स्थापना सगुण-साकार ब्रह्म की प्रतिष्ठा है। कलश के मुख में भगवान विष्णु, कण्ठ में महादेव रुद्र, मूल में चतुर्मुख ब्रह्मा तथा मध्य में मातृका शक्तियां एवं पवित्र तीर्थ प्रतिष्ठित रहते हैं।'
                      : 'Kalasa Sthapana is the consecration of the cosmic microcosm. The pot represents the universe, containing the holy waters (Theerthas) and primordial divine vibrations. Lord Vishnu resides at the mouth, Lord Shiva at the neck, Lord Brahma at the base, and Mother Goddesses at the center.'}
                  </p>
                </div>
              </div>

              {/* Muhurta Windows for Day 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>{modalLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಕಲಶ ಸ್ಥಾಪನಾ ಮುಹೂರ್ತ:' : modalLang === 'hi' ? 'प्रातःकालीन कलश स्थापना मुहूर्त:' : 'Morning Kalasha Muhurta:'}</span>
                  </div>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    06:15 AM - 08:30 AM
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ಶುಭ ಚೌಘಡಿಯಾ — ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನೆಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಕಾಲಾವಧಿ.' : modalLang === 'hi' ? 'अमृत/शुभ चौघड़िया — घटस्थापना हेतु सर्वोत्तम समय।' : 'Auspicious Chaughadiya for pot consecration.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{modalLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:' : modalLang === 'hi' ? 'मध्याह्न अभिजित मुहूर्त:' : 'Midday Abhijit Muhurta:'}</span>
                  </div>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    11:45 AM - 12:35 PM
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ಬೆಳಗ್ಗೆ ಸಾಧ್ಯವಾಗದಿದ್ದರೆ ಅಭಿಜಿತ್ ಮುಹೂರ್ತದಲ್ಲಿ ಸ್ಥಾಪನೆ ಮಾಡಬಹುದು.' : modalLang === 'hi' ? 'प्रातः सम्भव न होने पर अभिजित वेला में स्थापना करें।' : 'Scriptural alternative window if morning was missed.'}
                  </p>
                </div>
              </div>

              {/* Samagri Checklist */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{modalLang === 'kn' ? 'ಬೇಕಾಗುವ ಮುಖ್ಯ ಸಾಮಗ್ರಿಗಳು (Samagri Checklist):' : modalLang === 'hi' ? 'आवश्यक पूजन सामग्री (Samagri Checklist):' : 'Required Pooja Samagri Checklist:'}</span>
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {Object.values(checkedSamagri).filter(Boolean).length} / {KALASHA_SAMAGRI_LIST.length} {modalLang === 'kn' ? 'ಸಿದ್ಧ' : modalLang === 'hi' ? 'सिद्ध' : 'Ready'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {KALASHA_SAMAGRI_LIST.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleSamagri(item.id)}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        checkedSamagri[item.id]
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-800'
                          : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                        {checkedSamagri[item.id] ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-stone-400" />}
                      </button>
                      <div className="space-y-0.5">
                        <span className={`font-bold block ${checkedSamagri[item.id] ? 'line-through text-stone-400' : 'text-stone-900 dark:text-stone-100'}`}>
                          {item.name[modalLang]}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight block">
                          {item.notes[modalLang]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Step-by-Step Procedure */}
              <div className="space-y-4">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>📜</span>
                  <span>{modalLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನೆಯ ಹಂತ-ಹಂತದ ವಿಧಾನ (೫ ಮುಖ್ಯ ಹಂತಗಳು):' : modalLang === 'hi' ? 'कलश स्थापना की चरणबद्ध विधि (५ प्रमुख चरण):' : 'Step-by-Step Method for Kalasa Sthapana (5 Stages):'}</span>
                </h4>

                <div className="space-y-3">
                  {KALASHA_STHAPANA_STEPS.map((step) => (
                    <div 
                      key={step.stepNumber}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 shadow-xs space-y-2"
                    >
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
                        <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-xs font-mono">
                          {step.stepNumber}
                        </span>
                        <span>{step.title[modalLang]}</span>
                      </div>
                      
                      <p className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                        {step.instruction[modalLang]}
                      </p>

                      {step.mantra && (
                        <div className="ml-8 p-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 space-y-1">
                          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                            {modalLang === 'kn' ? 'ಪವಿತ್ರ ಮಂತ್ರ:' : modalLang === 'hi' ? 'पवित्र मन्त्र:' : 'Sacred Mantra:'}
                          </span>
                          <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 whitespace-pre-line">
                            {modalLang === 'kn' ? step.mantra.kannadaText : step.mantra.sanskritText}
                          </p>
                          <p className="font-mono text-[10.5px] text-stone-500 whitespace-pre-line">
                            {step.mantra.englishTransliteration}
                          </p>
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-amber-200 dark:border-stone-800">
                            <strong>{modalLang === 'kn' ? 'ಅರ್ಥ:' : modalLang === 'hi' ? 'अर्थ:' : 'Meaning:'}</strong> {step.mantra.meaning[modalLang]}
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
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Intro Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 text-white space-y-2 border border-amber-500/40 shadow-lg">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {modalLang === 'kn' ? '೯ ದಿನಗಳ ಅಖಂಡ ಜ್ಯೋತಿ • ಪರಮ ಪವಿತ್ರ ಮಹಾವಿಧಾನ' : modalLang === 'hi' ? '९ दिवसीय अखण्ड ज्योति • परम पवित्र विधान' : 'Eternal Sacred Flame • 9 Days of Navaratri'}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.title[modalLang]}
                </h4>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.intro[modalLang]}
                </p>
              </div>

              {/* Direction Significance Banner (IMPORTANT) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-400 dark:border-amber-700/80 flex items-start gap-3 text-xs leading-relaxed text-amber-950 dark:text-amber-200 shadow-2xs">
                <span className="text-2xl mt-0.5 shrink-0">🧭</span>
                <div>
                  <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                    {modalLang === 'kn' ? 'ಪವಿತ್ರ ದಿಕ್ಕು & ವಾಸ್ತು ನಿಯಮ (Sacred Direction Guide):' : modalLang === 'hi' ? 'पवित्र दिशा एवं वास्तु विधान:' : 'Sacred Direction & Vastu Rules:'}
                  </h5>
                  <p className="font-medium text-stone-800 dark:text-stone-200">
                    {AKHANDA_DEEPA_STHAPANA_DETAILS.directionSignificance[modalLang]}
                  </p>
                </div>
              </div>

              {/* 1. Required Materials */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೧</span>
                  <span>
                    {modalLang === 'kn' ? '೧. ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು (Essential Materials)' : modalLang === 'hi' ? '१. आवश्यक सामग्री (Essential Materials)' : '1. Essential Materials for Akhanda Deepa'}
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
                          {item.name[modalLang]}
                        </span>
                        <p className="text-[11.5px] text-stone-600 dark:text-stone-400 leading-snug">
                          {item.details[modalLang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Step-by-Step Installation */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white text-xs">೨</span>
                  <span>
                    {modalLang === 'kn' ? '೨. ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ಬೆಳಗಿಸುವ ವಿಧಾನ' : modalLang === 'hi' ? '२. दीप स्थापना एवं प्रज्वलन विधि' : '2. Installation & Lighting Procedure'}
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
                        <span className="font-serif">{step.title[modalLang]}</span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-8">
                        {step.instruction[modalLang]}
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
                    {modalLang === 'kn' ? '೩. ದೀಪ ಹಚ್ಚುವಾಗ ಹೇಳಬೇಕಾದ ಶ್ಲೋಕ (Sacred Lighting Shlokas)' : modalLang === 'hi' ? '३. दीप प्रज्वलन मन्त्र' : '3. Sacred Mantras during Lighting'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                      {modalLang === 'kn' ? 'ಶ್ಲೋಕ ೧ (Deepa Jyoti Parabrahma):' : 'Shloka 1:'}
                    </span>
                    <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                      {modalLang === 'hi' 
                        ? 'दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ।\nदीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥'
                        : 'ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ |\nದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                      <strong>{modalLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                      {modalLang === 'kn'
                        ? 'ದೀಪದ ಜ್ಯೋತಿಯೇ ಪರಬ್ರಹ್ಮ, ಜ್ಯೋತಿಯೇ ಜನಾರ್ದನ. ಈ ಜ್ಯೋತಿಯು ನನ್ನ ಸಮಸ್ತ ಪಾಪಗಳನ್ನು ಹೋಗಲಾಡಿಸಲಿ; ಪವಿತ್ರ ದೀಪಜ್ಯೋತಿಗೆ ನನ್ನ ನಮಸ್ಕಾರ.'
                        : 'The flame of this sacred lamp is Supreme Brahman and Lord Janardana. May this effulgent flame dissolve all sins; salutations to the sacred Deepa Jyoti.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">
                      {modalLang === 'kn' ? 'ಶ್ಲೋಕ ೨ (Shubham Karoti Kalyanam):' : 'Shloka 2:'}
                    </span>
                    <p className="font-serif font-extrabold text-sm sm:text-base text-red-950 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                      {modalLang === 'hi'
                        ? 'शुभं करोति कल्याणमारोग्यं धनसम्पदः ।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥'
                        : 'ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ |\nಶತ್ರುಬುದ್ಧಿವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ||'}
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1">
                      <strong>{modalLang === 'kn' ? 'ಅರ್ಥ:' : 'Meaning:'}</strong>{' '}
                      {modalLang === 'kn'
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
                    {modalLang === 'kn' ? '೪. ಮುಖ್ಯವಾಗಿ ಗಮನಿಸಬೇಕಾದ ನಿಯಮಗಳು (Golden Rules)' : modalLang === 'hi' ? '४. महत्त्वपूर्ण सावधानियां एवं नियम' : '4. Sacred Maintenance Rules'}
                  </span>
                </h4>

                <div className="space-y-2">
                  {AKHANDA_DEEPA_STHAPANA_DETAILS.goldenRules.map((rule) => (
                    <div key={rule.ruleNumber} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {rule.ruleNumber}. {rule.title[modalLang]}
                      </div>
                      <p className="text-stone-600 dark:text-stone-400">
                        {rule.instruction[modalLang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Visarjana */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                <h5 className="font-serif font-black text-sm uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {modalLang === 'kn' ? '೫. ಅಖಂಡ ದೀಪ ವಿಸರ್ಜನೆ (Deepa Visarjana):' : '5. Akhanda Deepa Visarjana:'}
                </h5>
                <p className="leading-relaxed">
                  {modalLang === 'kn'
                    ? 'ವ್ರತದ ಕೊನೆಯಲ್ಲಿ ದೀಪವನ್ನು ಎಂದಿಗೂ ಬಾಯಿಯಿಂದ ಊದಿ ಆರಿಸಬಾರದು. ಎಣ್ಣೆ/ತುಪ್ಪ ತಾನಾಗಿಯೇ ಶಾಂತವಾಗಲು ಬಿಡಬೇಕು, ಅಥವಾ ಹೂವಿನಿಂದ ಹಾಲು/ತುಪ್ಪದ ಹನಿ ಚಿಮುಕಿಸಿ ಗೌರವಪೂರ್ವಕವಾಗಿ ಶಾಂತಗೊಳಿಸಬೇಕು. ಆಧಾರ ಪೀಠದ ಧಾನ್ಯಗಳನ್ನು ಪ್ರಸಾದವಾಗಿ ಅಡುಗೆಯಲ್ಲಿ ಬಳಸಬೇಕು.'
                    : 'At the conclusion of the vrata, the lamp must NEVER be blown out. Let it extinguish naturally as fuel finishes, or gently calm the flame using a flower dipped in milk/ghee. The foundation grains should be cooked as Prasad.'}
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DAILY NAVADURGA PUJA (ದಿನಂಪ್ರತಿ ೯ ದುರ್ಗಾ ಪೂಜಾ ಕ್ರಮ) */}
          {/* ========================================================================= */}
          {activeTab === 'dailyDurga' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Daily 6-step krama overview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>🪔</span>
                  <span>{modalLang === 'kn' ? 'ದಿನಂಪ್ರತಿ ನವರಾತ್ರಿ ನಿತ್ಯ ಪೂಜಾ ಕ್ರಮ (೬ ಹಂತಗಳು):' : modalLang === 'hi' ? 'दैनिक नवरात्रि पूजन क्रम (६ चरण):' : 'Daily 6-Step Puja Krama for Every Navaratri Day:'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {DAILY_NAVADURGA_PUJA_KRAMA.map((st) => (
                    <div key={st.step} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <strong className="text-amber-800 dark:text-amber-400 block">{st.title[modalLang]}</strong>
                      <p className="text-stone-600 dark:text-stone-300 text-[11.5px] leading-relaxed">{st.desc[modalLang]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9 Days Selector Pill Bar */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider block">
                  {modalLang === 'kn' ? '೯ ದಿನಗಳ ನವದುರ್ಗಾ ರೂಪಗಳು:' : modalLang === 'hi' ? '९ दिवसों के नवदुर्गा स्वरूप:' : 'Select Day to View Deity, Dhyana Mantra & Color:'}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((dNum) => {
                    const r = NAVARATRI_10_DAYS_RITUALS[dNum];
                    const isSelected = selectedDayNumber === dNum;
                    return (
                      <button
                        key={dNum}
                        onClick={() => setSelectedDayNumber(dNum)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white font-bold border-amber-500 shadow-md ring-2 ring-amber-300'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-80">Day {dNum}</div>
                        <div className="text-xs font-bold truncate mt-0.5">{r.deity[modalLang]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Deity Focus Card */}
              {activeDayRitual && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-red-500/10 to-orange-500/15 border-2 border-amber-400 dark:border-stone-700 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-300 dark:border-stone-700 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold text-xs">
                          {modalLang === 'kn' ? `ದಿನ ${selectedDayNumber}` : `Day ${selectedDayNumber}`}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {activeDayRitual.tithiTitle[modalLang]}
                        </span>
                      </div>
                      <h3 className="font-serif font-black text-lg sm:text-xl text-red-950 dark:text-red-200 mt-1">
                        {activeDayRitual.name[modalLang]}
                      </h3>
                    </div>

                    {activeDayColor && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-white/90 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
                        <span className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: activeDayColor.hex }} />
                        <div className="text-xs">
                          <span className="text-stone-400 block text-[10px] uppercase font-bold">{modalLang === 'kn' ? 'ದಿನದ ಬಣ್ಣ:' : 'Color:'}</span>
                          <span className="font-bold text-stone-900 dark:text-stone-100">{activeDayColor.colorName[modalLang]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {activeDayRitual.significance[modalLang]}
                  </p>

                  {/* Dhyana Mantra */}
                  <div className="p-4 rounded-2xl bg-white/95 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 space-y-2">
                    <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider block">
                      {modalLang === 'kn' ? 'ಶ್ರೀ ದೇವಿಯ ಧ್ಯಾನ ಮಂತ್ರ:' : modalLang === 'hi' ? 'माँ का पावन ध्यान मन्त्र:' : 'Prescribed Dhyana Mantra:'}
                    </span>
                    <p className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed">
                      "{modalLang === 'kn' ? activeDayRitual.dhyanaMantra.kannada : activeDayRitual.dhyanaMantra.sanskrit}"
                    </p>
                    <p className="font-mono text-xs text-stone-500">
                      {activeDayRitual.dhyanaMantra.english}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MAHA ASHTAMI, SANDHI PUJA & KUSHMANDA BALI */}
          {/* ========================================================================= */}
          {activeTab === 'kushmandaBali' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Sandhi Confluence Card */}
              <div className="p-5 rounded-3xl bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-400 dark:border-purple-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200 dark:border-purple-900 pb-2">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-serif text-base sm:text-lg">
                      {modalLang === 'kn' ? 'ನಿಖರ ಸಂಧಿ ಪೂಜಾ ಕಾಲ (೪೮ ನಿಮಿಷ):' : modalLang === 'hi' ? 'यथार्थ सन्धि पूजा काल (४८ मिनट):' : 'Exact Sandhi Kala Window (48 Minutes):'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 self-start sm:self-auto">
                    {modalLang === 'kn' ? 'ಅಷ್ಟಮಿ ಮುಕ್ತಾಯ:' : 'Ashtami Ends:'} {sandhiTiming.ashtamiEndTimeStr}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-purple-300 space-y-1">
                    <span className="text-[11px] font-bold text-purple-800 uppercase block">
                      {modalLang === 'kn' ? '೧. ಪೂರ್ಣ ಸಂಧಿಕಾಲ (೪೮ ನಿಮಿಷ):' : '1. Full 48-Minute Confluence:'}
                    </span>
                    <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                      {sandhiTiming.sandhiStart} - {sandhiTiming.sandhiEnd}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {modalLang === 'kn' ? 'ಅಷ್ಟಮಿಯ ಕೊನೆಯ ೨೪ ನಿಮಿಷ ಮತ್ತು ನವಮಿಯ ಮೊದಲ ೨೪ ನಿಮಿಷಗಳ ನಿಖರ ಸಂಗಮ.' : 'Last 24m of Ashtami + first 24m of Navami.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-purple-300 space-y-1">
                    <span className="text-[11px] font-bold text-red-800 uppercase block">
                      {modalLang === 'kn' ? '೨. ಬಲಿ ಕೊಯ್ಯುವ ನಿಖರ ಕ್ಷಣ (ದ್ವಿತೀಯಾರ್ಧ):' : '2. Bali Cutting Window (2nd Half):'}
                    </span>
                    <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                      {sandhiTiming.baliWindowStart} - {sandhiTiming.baliWindowEnd}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {modalLang === 'kn' ? 'ಸಂಧಿ ಆರತಿಯ ನಂತರ ಕೂಷ್ಮಾಂಡವನ್ನು ಛೇದಿಸುವ ಪವಿತ್ರ ಕಾಲ.' : 'Second 24 minutes when pumpkin is offered.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 text-xs text-stone-700 dark:text-stone-300">
                  <strong>{modalLang === 'kn' ? 'ಪರ್ಯಾಯ ಪ್ರದೋಷ ಕಾಲ:' : 'Alternative Pradosha Window:'}</strong> {sandhiTiming.pradoshaStart} - {sandhiTiming.pradoshaEnd} ({modalLang === 'kn' ? 'ಮಧ್ಯರಾತ್ರಿ ಅಸಾಧ್ಯವಾದರೆ ಸೂರ್ಯಾಸ್ತದ ಸಂಧ್ಯಾ ಕಾಲದಲ್ಲಿ ಬಲಿ ನೀಡಬಹುದು' : 'If midnight is not possible, perform at sunset transition'}).
                </div>
              </div>

              {/* Kushmanda Bali Significance & Why Ash Gourd is used */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-serif font-black text-base text-purple-950 dark:text-purple-300 flex items-center gap-2">
                  <span>🎃</span>
                  <span>{modalLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ (ಬೂದು ಕುಂಬಳಕಾಯಿ) ಬಲಿಯ ಸಾತ್ವಿಕ ರಹಸ್ಯ:' : modalLang === 'hi' ? 'कूष्माण्ड सात्त्विक बलि का रहस्य एवं विधान:' : 'Significance of Kushmanda Satvik Bali:'}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {SANDHI_PUJA_DETAILS.kushmandaSignificance[modalLang]}
                </p>

                {/* Bali Offering Mantra */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-stone-900 border border-red-300 dark:border-red-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ಕೂಷ್ಮಾಂಡ ಬಲಿ ಸಮರ್ಪಣಾ ಮಂತ್ರ:' : modalLang === 'hi' ? 'कूष्माण्ड बलि समर्पण मन्त्र:' : 'Sacred Bali Offering Mantra:'}
                  </span>
                  <p className="font-serif font-bold text-sm sm:text-base text-red-950 dark:text-red-200">
                    "{modalLang === 'kn' ? SANDHI_PUJA_DETAILS.baliMantra.kannadaText : SANDHI_PUJA_DETAILS.baliMantra.sanskritText}"
                  </p>
                  <p className="font-mono text-xs text-stone-500">
                    {SANDHI_PUJA_DETAILS.baliMantra.englishTransliteration}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300 pt-1 border-t border-red-200 dark:border-stone-800">
                    <strong>{modalLang === 'kn' ? 'ಭಾವಾರ್ಥ:' : modalLang === 'hi' ? 'भावार्थ:' : 'Meaning:'}</strong> {SANDHI_PUJA_DETAILS.baliMantra.meaning[modalLang]}
                  </p>
                </div>

                {/* Step by Step Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {SANDHI_PUJA_DETAILS.stepByStepBaliVidhi.map((step) => (
                    <div key={step.step} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <strong className="text-purple-900 dark:text-purple-300">{step.step}. {step.title[modalLang]}:</strong>
                      <p className="text-stone-600 dark:text-stone-300 text-[11.5px] leading-relaxed">{step.desc[modalLang]}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MAHA NAVAMI, AYUDHA PUJA & SARASWATI PUJA */}
          {/* ========================================================================= */}
          {activeTab === 'ayudhaPuja' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                  <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಅಮೃತ ಮುಹೂರ್ತ:' : modalLang === 'hi' ? 'प्रातःकालीन अमृत मुहूर्त:' : 'Morning Amrita Window:'}
                  </span>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    06:15 AM - 08:45 AM
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ವಾಹನ, ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳ ಪೂಜೆಗೆ ಶ್ರೇಷ್ಠ.' : 'Ideal for vehicles and domestic tools.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-300 dark:border-sky-800 space-y-1">
                  <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ:' : modalLang === 'hi' ? 'मध्याह्न अभिजित वेला:' : 'Midday Abhijit Window:'}
                  </span>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    11:45 AM - 12:35 PM
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ಕಾರ್ಖಾನೆ, ಕಚೇರಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಯಂತ್ರಗಳ ಪೂಜೆ.' : 'Ideal for industrial and commercial machinery.'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-serif font-black text-base text-sky-950 dark:text-sky-300 flex items-center gap-2">
                  <span>🛠️</span>
                  <span>{modalLang === 'kn' ? 'ಆಯುಧ & ಸರಸ್ವತೀ ಪೂಜಾ ಕ್ರಮ (೫ ಹಂತಗಳು):' : modalLang === 'hi' ? 'आयुध एवं सरस्वती पूजन क्रम (५ चरण):' : 'Ayudha & Saraswati Puja 5-Step Method:'}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {AYUDHA_PUJA_DETAILS.significance[modalLang]}
                </p>

                <div className="space-y-2.5 pt-1">
                  {AYUDHA_PUJA_DETAILS.steps.map((st) => (
                    <div key={st.step} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <strong className="text-sky-900 dark:text-sky-300 text-xs sm:text-sm">{st.title[modalLang]}</strong>
                      <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">{st.desc[modalLang]}</p>
                    </div>
                  ))}
                </div>

                {/* Ayudha & Saraswati Mantras */}
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-stone-900 border border-sky-300 dark:border-stone-700 space-y-1.5 mt-2">
                  <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ಆಯುಧ & ಸರಸ್ವತೀ ಮಂತ್ರಗಳು:' : modalLang === 'hi' ? 'आयुध एवं सरस्वती मन्त्र:' : 'Sacred Mantras:'}
                  </span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed">
                    {modalLang === 'kn' ? AYUDHA_PUJA_DETAILS.mantra.kannadaText : AYUDHA_PUJA_DETAILS.mantra.sanskritText}
                  </p>
                  <p className="font-mono text-xs text-stone-500 whitespace-pre-line">
                    {AYUDHA_PUJA_DETAILS.mantra.englishTransliteration}
                  </p>
                  <p className="text-xs text-stone-700 dark:text-stone-300 pt-1 border-t border-sky-200 dark:border-stone-800">
                    <strong>{modalLang === 'kn' ? 'ಅರ್ಥ:' : modalLang === 'hi' ? 'अर्थ:' : 'Meaning:'}</strong> {AYUDHA_PUJA_DETAILS.mantra.meaning[modalLang]}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: VIJAYADASHAMI, SHAMI & KALASHA VISARJANA */}
          {/* ========================================================================= */}
          {activeTab === 'vijayadashami' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ವಿಜಯ ಮುಹೂರ್ತ (Supreme Victory):' : modalLang === 'hi' ? 'विजय मुहूर्त (अपराह्न वेला):' : 'Vijaya Muhurta (Victory Window):'}
                  </span>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    {VIJAYADASHAMI_VISARJANA_DETAILS.muhurtas.vijayaMuhurta}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ಹೊಸ ಉದ್ಯೋಗ, ಕಾಯಕ, ಸಂಕಲ್ಪಗಳಿಗೆ ಜಯ ಖಚಿತ.' : 'Supreme window to start any new endeavor.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ವಿದ್ಯಾರಂಭ (ಅಕ್ಷರಾಭ್ಯಾಸ) ಕಾಲ:' : modalLang === 'hi' ? 'विद्यारम्भ (अक्षराभ्यास) काल:' : 'Vidyarambha (Aksharabhyasa) Window:'}
                  </span>
                  <div className="text-lg font-mono font-black text-stone-900 dark:text-stone-100">
                    {VIJAYADASHAMI_VISARJANA_DETAILS.muhurtas.vidyarambhaWindow}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {modalLang === 'kn' ? 'ಪುಟ್ಟ ಮಕ್ಕಳಿಗೆ ಅಕ್ಷರಾಭ್ಯಾಸ ಮಾಡಿಸಲು ಪ್ರಶಸ್ತ ಮುಹೂರ್ತ.' : 'Auspicious morning window for literacy initiation.'}
                  </p>
                </div>
              </div>

              {/* Vidyarambha, Shami, & Kalasha Visarjana Content */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 space-y-4">
                <h4 className="font-serif font-black text-base text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                  <span>🏹</span>
                  <span>{VIJAYADASHAMI_VISARJANA_DETAILS.title[modalLang]}</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {VIJAYADASHAMI_VISARJANA_DETAILS.significance[modalLang]}
                </p>

                {/* Aksharabhyasa */}
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    {modalLang === 'kn' ? 'ಅಕ್ಷರಾಭ್ಯಾಸ ಮಂತ್ರ (ಅಕ್ಕಿಯ ಮೇಲೆ ಬೆರಳು ಹಿಡಿದು ಬರೆಯುವುದು):' : 'Aksharabhyasa Initiation Mantra:'}
                  </span>
                  <p className="font-serif font-bold text-sm sm:text-base text-amber-950 dark:text-amber-200">
                    {modalLang === 'kn' ? '"ಓಂ ಹರಿಃ ಶ್ರೀ ಗಣಪತಯೇ ನಮಃ | ಅವಿಘ್ನಮಸ್ತು ||"' : '"ॐ हरिः श्री गणपतये नमः । अविघ्नमस्तु ॥"'}
                  </p>
                </div>

                {/* Shami Tree Puja */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    {modalLang === 'kn' ? 'ಶಮೀ ಮಂತ್ರ & ಬನ್ನಿ ಹಂಚುವ ಪರಂಪರೆ:' : 'Shami Tree Stotra:'}
                  </span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    {modalLang === 'kn'
                      ? '"ಶಮೀ ಶಮಯತೇ ಪಾಪಂ ಶಮೀ ಶತ್ರುವಿನಾಶಿನೀ | ಅರ್ಜುನಸ್ಯ ಧನುರ್ಧಾರಿ ರಾಮಸ್ಯ ಪ್ರಿಯದರ್ಶಿನೀ ||"'
                      : '"शमी शमयते पापं शमी शत्रुविनाशिनी । अर्जुनस्य धनुर्धारी रामस्य प्रियदर्शिनी ॥"'}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {modalLang === 'kn' 
                      ? '"ಬನ್ನಿ ತಗೋಳಿ ಬಂಗಾರ್ದಂಗಿರಿ" ಎಂದು ಹಿರಿಯರಿಗೆ ಬನ್ನಿ ಕೊಟ್ಟು ನಮಸ್ಕರಿಸುವುದು ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಪರಂಪರೆ.' 
                      : 'Exchanging Shami leaves with elders wishing eternal prosperous life.'}
                  </p>
                </div>

                {/* 4-Step Kalasha Visarjana / Udwasana */}
                <div className="space-y-3 pt-2">
                  <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>🏺</span>
                    <span>{modalLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನೆ (ಉದ್ವಾಸನಾ) ಹಂತ-ಹಂತದ ವಿಧಾನ:' : modalLang === 'hi' ? 'कलश विसर्जन (उद्वासन) विधि एवं मन्त्र:' : 'Kalasha Visarjana (Udwasana) Method:'}</span>
                  </h5>
                  {VIJAYADASHAMI_VISARJANA_DETAILS.kalashaVisarjanaSteps.map((st) => (
                    <div key={st.step} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                      <strong className="text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">{st.title[modalLang]}</strong>
                      <p className="text-stone-600 dark:text-stone-300 text-xs leading-relaxed">{st.desc[modalLang]}</p>
                    </div>
                  ))}
                </div>

                {/* Visarjana Mantras */}
                <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-stone-900 border border-emerald-300 dark:border-stone-700 text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                    {modalLang === 'kn' ? 'ಕಲಶ ವಿಸರ್ಜನಾ ಮಂತ್ರಗಳು:' : modalLang === 'hi' ? 'कलश विसर्जन मन्त्र:' : 'Sacred Visarjana Mantras:'}
                  </span>
                  <p className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                    {modalLang === 'kn'
                      ? '"ಗಚ್ಛ ಗಚ್ಛ ಪರಂ ಸ್ಥಾನಂ ಸ್ವಸ್ಥಾನಂ ಪರಮೇಶ್ವರಿ | ಯತ್ಪೂಜಿತಂ ಮಯಾ ದೇವಿ ಪರಿಪೂರ್ಣಂ ತದಸ್ತು ಮೇ ||"'
                      : '"गच्छ गच्छ परं स्थानं स्वस्थानं परमेश्वरि । यत्पूजितं मया देवि परिपूर्णं तदस्तु मे ॥"'}
                  </p>
                  <p className="font-mono text-xs text-stone-500">
                    Gachha Gachha Param Sthanam Swasthanam Parameshwari | Yatpoojitam Maya Devi Paripoornam Tadastu Me ||
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">
              {modalLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ನವರಾತ್ರಿ ಆಚರಣಾ ಕೈಪಿಡಿ' : modalLang === 'hi' ? 'शास्त्रसम्मत नवरात्रि पूजन संकलन' : 'Vedic Navaratri Observance Guide'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            {modalLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : modalLang === 'hi' ? 'बंद करें' : 'Close Window'}
          </button>
        </div>
      </div>
    </div>
  );
};
