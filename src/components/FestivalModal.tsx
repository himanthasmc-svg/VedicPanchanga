import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Flame, 
  Scroll, 
  CheckCircle2, 
  Copy, 
  Share2, 
  HeartHandshake,
  CalendarCheck,
  CheckSquare,
  Square,
  Clock,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ListOrdered
} from 'lucide-react';
import { Festival, Language, RitualTimingItem } from '../types';
import { UNIVERSAL_FESTIVAL_SAMAGRI, UNIVERSAL_FESTIVAL_TIMINGS } from '../utils/festivalRequirements';

interface FestivalModalProps {
  festival: Festival | null;
  currentLang: Language;
  onClose: () => void;
}

export const FestivalModal: React.FC<FestivalModalProps> = ({
  festival,
  currentLang,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'celebration' | 'story' | 'samagri' | 'timings' | 'vidhi' | 'mantras' | 'navaratri-vidhana' | 'color'>('celebration');
  const [copiedMantraIndex, setCopiedMantraIndex] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!festival) return null;

  // Resolve items required (Pooja Requirements / Samagri)
  const resolvedSamagri = (festival.poojaSamagri && festival.poojaSamagri.length > 0)
    ? festival.poojaSamagri
    : (festival.isNavaratri 
        ? UNIVERSAL_FESTIVAL_SAMAGRI.navaratri_kalash_sthapana 
        : UNIVERSAL_FESTIVAL_SAMAGRI.generic_puja_essentials);

  // Resolve chronological ritual timings throughout the day
  const resolvedTimings: RitualTimingItem[] = (festival.ritualTimings && festival.ritualTimings.length > 0)
    ? festival.ritualTimings
    : (festival.isNavaratri
        ? UNIVERSAL_FESTIVAL_TIMINGS.navaratri_daily
        : UNIVERSAL_FESTIVAL_TIMINGS.generic_vedic_festival);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyMantra = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMantraIndex(idx);
    setTimeout(() => setCopiedMantraIndex(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-hidden animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-amber-200/80 dark:border-stone-700 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header Bar - Always visible */}
        <div 
          className="sticky top-0 z-30 shrink-0 p-4 sm:p-6 text-white overflow-hidden shadow-md"
          style={{ background: `linear-gradient(135deg, ${festival.tagColor}, #b45309)` }}
        >
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>
                  {currentLang === 'kn' ? 'ವೈದಿಕ ಹಬ್ಬ ಮತ್ತು ಪೂಜಾ ವಿವರಣೆ' : currentLang === 'hi' ? 'वैदिक पर्व एवं पूजन विधान' : 'Vedic Festival & Ritual Guide'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
                {festival.name[currentLang]}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
                {festival.shortDesc[currentLang]}
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-bold text-xs flex items-center gap-1.5 transition-all ring-1 ring-white/40 shrink-0 ml-3 cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
            <button
              onClick={() => setActiveTab('celebration')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'celebration'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಆಚರಣೆ ಹೇಗೆ?' : currentLang === 'hi' ? 'कैसे मनाते हैं?' : 'How Celebrated'}</span>
            </button>

            <button
              onClick={() => setActiveTab('story')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'story'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಪುರಾಣ ಕಥೆ' : currentLang === 'hi' ? 'पौराणिक कथा' : 'Sacred Story'}</span>
            </button>

            {/* New / Enhanced Pooja Requirements (Samagri) Tab */}
            <button
              onClick={() => setActiveTab('samagri')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeTab === 'samagri'
                  ? 'bg-amber-300 text-stone-950 shadow-md ring-2 ring-white'
                  : 'bg-amber-400/25 text-amber-100 hover:bg-amber-400/35'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-900 dark:text-amber-200" />
              <span>
                {currentLang === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು (Requirements)' : currentLang === 'hi' ? 'पूजा सामग्री (Requirements)' : 'Pooja Requirements'}
              </span>
            </button>

            {/* New Chronological Ritual Guide with Timings Tab */}
            <button
              onClick={() => setActiveTab('timings')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                activeTab === 'timings'
                  ? 'bg-amber-300 text-stone-950 shadow-md ring-2 ring-white'
                  : 'bg-amber-400/25 text-amber-100 hover:bg-amber-400/35'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-900 dark:text-amber-200" />
              <span>
                {currentLang === 'kn' ? 'ದಿನದ ಪೂಜಾ ಕಾಲಗಳು (Timings)' : currentLang === 'hi' ? 'दिन के पूजा मुहूर्त (Timings)' : 'Ritual Timings Guide'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vidhi')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'vidhi'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಪೂಜಾ ವಿಧಾನ' : currentLang === 'hi' ? 'पूजा विधि' : 'Pooja Vidhi'}</span>
            </button>

            <button
              onClick={() => setActiveTab('mantras')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'mantras'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>{currentLang === 'kn' ? 'ಮಂತ್ರಗಳು' : currentLang === 'hi' ? 'मन्त्र' : 'Mantras'}</span>
            </button>

            {festival.isNavaratri && festival.navaratriColor && (
              <button
                onClick={() => setActiveTab('color')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                  activeTab === 'color'
                    ? 'bg-amber-300 text-stone-950 shadow-md ring-2 ring-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-white shrink-0 shadow-xs" 
                  style={{ backgroundColor: festival.navaratriColor.hex }} 
                />
                <span>
                  {currentLang === 'kn' ? 'ದಿನದ ಬಣ್ಣ (Color)' : currentLang === 'hi' ? 'आज का रंग (Color)' : 'Day Color'}
                </span>
              </button>
            )}

            {festival.isNavaratri && (
              <button
                onClick={() => setActiveTab('navaratri-vidhana')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap font-bold ${
                  activeTab === 'navaratri-vidhana'
                    ? 'bg-amber-300 text-stone-950 shadow-md ring-2 ring-white'
                    : 'bg-amber-400/30 text-amber-100 hover:bg-amber-400/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-900" />
                <span>{currentLang === 'kn' ? 'ನವರಾತ್ರಿ ಪೂಜಾ ವಿಧಾನ (ಫೋಟೋ ಪ್ರತಿ)' : currentLang === 'hi' ? 'नवरात्रि पूजा विधान (मूल पाठ)' : 'Navaratri Pooja Vidhan List'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0 text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
          
          {/* Tab 1: How Celebrated */}
          {activeTab === 'celebration' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                <h3 className="font-bold font-serif text-base text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-amber-600" />
                  <span>
                    {currentLang === 'kn' ? 'ಭಾರತದಲ್ಲಿ ಈ ಹಬ್ಬವನ್ನು ಹೇಗೆ ಆಚರಿಸುತ್ತಾರೆ?' : currentLang === 'hi' ? 'भारत में यह पर्व कैसे मनाया जाता है?' : 'How Indians Celebrate this Sacred Festival'}
                  </span>
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm">
                  {festival.howCelebrated[currentLang]}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    {currentLang === 'kn' ? 'ಸಾತ್ವಿಕ ನೈವೇದ್ಯ ಮತ್ತು ಭಕ್ಷ್ಯಗಳು:' : currentLang === 'hi' ? 'सात्त्विक नैवेद्य एवं प्रसाद:' : 'Traditional Offerings & Prasad:'}
                  </span>
                  <p className="text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' 
                      ? 'ಪಂಚಾಮೃತ, ಪಾಯಸ, ಹಣ್ಣು-ಹಂಪಲುಗಳು, ಕೊಬ್ಬರಿ, ಬೆಲ್ಲ, ಸಾತ್ವಿಕ ತಿಂಡಿಗಳು ಮತ್ತು ತುಳಸಿ/ಬಿಲ್ವ ದಳಗಳು.' 
                      : currentLang === 'hi'
                      ? 'पंचामृत, खीर, फल, हलवा, ऋतुफल एवं तुलसी-बिल्वपत्र।'
                      : 'Panchamrita, Kheer, seasonal fruits, coconut, jaggery, Tulasi & Bilva leaves.'}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    {currentLang === 'kn' ? 'ಸಾಮಾಜಿಕ ಮತ್ತು ಕೌಟುಂಬಿಕ ಭಾವ:' : currentLang === 'hi' ? 'पारिवारिक एवं सामाजिक महत्त्व:' : 'Social & Spiritual Harmony:'}
                  </span>
                  <p className="text-stone-600 dark:text-stone-400">
                    {currentLang === 'kn' 
                      ? 'ಕುಟುಂಬದ ಹಿರಿಯರ ಆಶೀರ್ವಾದ, ನೆರೆಹೊರೆಯವರಿಗೆ ಸಿಹಿ ಹಂಚಿಕೆ, ದೇವಸ್ಥಾನ ದರ್ಶನ ಹಾಗೂ ಸಾಮೂಹಿಕ ಭಜನೆ.' 
                      : currentLang === 'hi'
                      ? 'बड़ों का आशीर्वाद, परस्पर मिष्ठान वितरण, देवालय दर्शन एवं सामूहिक संकीर्तन।'
                      : 'Seeking elders blessings, sharing sweets with neighbors, temple visits, and family bonding.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sacred Story */}
          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40">
                <h3 className="font-bold font-serif text-base text-orange-900 dark:text-orange-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>
                    {currentLang === 'kn' ? 'ಹಬ್ಬದ ಹಿನ್ನೆಲೆಯ ಪೌರಾಣಿಕ ಕಥೆ' : currentLang === 'hi' ? 'पर्व की पावन पौराणिक कथा' : 'Sacred Puranic Story Behind the Festival'}
                  </span>
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm">
                  {festival.story[currentLang]}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Pooja Requirements (Items / Samagri) */}
          {activeTab === 'samagri' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-300 dark:border-amber-800/60 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold font-serif text-base text-amber-950 dark:text-amber-200">
                      {currentLang === 'kn'
                        ? `${festival.name.kn} - ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ (Pooja Requirements)`
                        : currentLang === 'hi'
                        ? `${festival.name.hi} - पूजा सामग्री सूची (Pooja Requirements)`
                        : `Pooja Requirements & Sacred Samagri for ${festival.name.en}`}
                    </h3>
                    <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
                      {currentLang === 'kn'
                        ? 'ಪೂಜೆಗೆ ಅಗತ್ಯವಿರುವ ಸಾಂಪ್ರದಾಯಿಕ ಪರಿಕರಗಳನ್ನು (ಕಲಶ, ನವಧಾನ್ಯ, ಪಂಚಾಮೃತ ಇತ್ಯಾದಿ) ಸಂಗ್ರಹಿಸುತ್ತಾ ಗುರುತು ಹಾಕಿ.'
                        : currentLang === 'hi'
                        ? 'कलश स्थापना व पूजन हेतु पारम्परिक आवश्यक वस्तुओं को एकत्र कर चेकलिस्ट मार्क करें।'
                        : 'Interactive checklist for traditional items (Kalash Sthapana essentials, grains, fabrics, offerings).'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0">
                  {Object.values(checkedItems).filter(Boolean).length} / {resolvedSamagri.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {resolvedSamagri.map((item, idx) => {
                  const isChecked = !!checkedItems[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-stone-500 dark:text-stone-400 line-through'
                          : 'bg-white dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 shadow-2xs'
                      }`}
                    >
                      <button type="button" className="shrink-0 mt-0.5 text-stone-400 hover:text-amber-600">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      <span className="text-xs sm:text-sm font-medium leading-snug">
                        {item[currentLang]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/50 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
                <span>
                  {currentLang === 'kn' 
                    ? 'ಸಾಮಗ್ರಿ ಸಿದ್ಧವಾದ ಬಳಿಕ ಮುಂದಿನ ಟ್ಯಾಬ್‌ನಲ್ಲಿರುವ ಶುಭ ಮುಹೂರ್ತ ಮತ್ತು ಪೂಜಾ ಕಾಲಗಳನ್ನು ವೀಕ್ಷಿಸಿ.' 
                    : currentLang === 'hi' 
                    ? 'सामग्री एकत्र करने के पश्चात् अगले टैब में दिन के विशिष्ट पूजा मुहूर्त देखें।' 
                    : 'Once samagri is gathered, check the Ritual Timings tab for specific Muhurtas throughout the day.'}
                </span>
                <button
                  onClick={() => setActiveTab('timings')}
                  className="font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0 ml-2"
                >
                  {currentLang === 'kn' ? 'ಮುಹೂರ್ತ ನೋಡಿ →' : currentLang === 'hi' ? 'मुहूर्त देखें →' : 'View Timings →'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Chronological Ritual Guide with Specific Timings throughout the day */}
          {activeTab === 'timings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/10 via-amber-500/10 to-indigo-500/10 border border-sky-300 dark:border-sky-800/60 flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold font-serif text-base text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn'
                      ? 'ದಿನವಿಡೀ ಪೂಜೆ ಮತ್ತು ವಿಧಿಗಳನ್ನು ಆಚರಿಸಲು ಕಾಲಾನುಕ್ರಮದ ಮಾರ್ಗದರ್ಶಿ'
                      : currentLang === 'hi'
                      ? 'दिनभर पूजन एवं अनुष्ठान सम्पन्न करने हेतु कालक्रमिक मुहूर्त निर्देशिका'
                      : 'Chronological Ritual Guide with Daily Timings (Muhurtas)'}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn'
                      ? 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ, ಪ್ರಾತಃಕಾಲ, ಅಭಿಜಿತ್ ಮುಹೂರ್ತ, ಸಾಯಂ ಪ್ರದೋಷ ಹಾಗೂ ನಿಶೀಥ ಕಾಲದ ನಿಖರ ವಿವರಣೆ.'
                      : currentLang === 'hi'
                      ? 'ब्रह्म मुहूर्त, प्रातः सन्ध्या, अभिजित काल, प्रदोष काल एवं निशीथ काल की विशिष्ट समय-सारणी।'
                      : 'Specific timing windows from Brahma Muhurta to Pradosha Kala and Nishita Kala for rituals throughout the day.'}
                  </p>
                </div>
              </div>

              {/* Vertical Chronological Timeline */}
              <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-orange-400 before:to-indigo-500">
                {resolvedTimings.map((timing, idx) => (
                  <div 
                    key={idx}
                    className="relative p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/70 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                  >
                    {/* Timeline Node Badge */}
                    <div className="absolute -left-[1.85rem] sm:-left-[2.35rem] top-4 w-6 h-6 rounded-full bg-amber-500 border-2 border-white dark:border-stone-900 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-stone-100 dark:border-stone-700/60 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        {idx === 0 ? (
                          <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : idx === resolvedTimings.length - 1 ? (
                          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                        ) : idx === 2 ? (
                          <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                        )}
                        <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                          {timing.periodName[currentLang]}
                        </h4>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-300/50 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 font-mono font-bold text-xs self-start sm:self-auto">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{timing.approxTime}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                      <div className="p-2.5 rounded-lg bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                          {currentLang === 'kn' ? 'ಮುಹೂರ್ತದ ಮಹತ್ವ ಮತ್ತು ಶಾಸ್ತ್ರೋಕ್ತ ಫಲ:' : currentLang === 'hi' ? 'मुहूर्त महत्त्व एवं शास्त्रीय फल:' : 'Significance & Spiritual Merit:'}
                        </span>
                        <p className="text-stone-600 dark:text-stone-400">
                          {timing.significance[currentLang]}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                          {currentLang === 'kn' ? 'ಈ ಸಮಯದಲ್ಲಿ ಮಾಡಬೇಕಾದ ನಿರ್ದಿಷ್ಟ ಪೂಜೆಗಳು:' : currentLang === 'hi' ? 'इस काल में करणीय विशिष्ट कर्म:' : 'Recommended Pooja & Rituals:'}
                        </span>
                        <p className="text-stone-700 dark:text-stone-300">
                          {timing.recommendedRituals[currentLang]}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Pooja Vidhi */}
          {activeTab === 'vidhi' && (
            <div className="space-y-3">
              <h3 className="font-bold font-serif text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ಅನುಸರಿಸಬೇಕಾದ ಪೂಜಾ ವಿಧಿಗಳು ಮತ್ತು ಕ್ರಮ' : currentLang === 'hi' ? 'पूजन विधि एवं अनुष्ठान क्रम' : 'Pooja Vidhis and Observance Guidelines'}
                </span>
              </h3>

              <div className="space-y-2.5">
                {festival.poojaVidhi.map((vidhi, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
                      {vidhi[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Mantras */}
          {activeTab === 'mantras' && (
            <div className="space-y-4">
              <h3 className="font-bold font-serif text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ಪೂಜೆಗೆ ಸಂಬಂಧಿಸಿದ ಪವಿತ್ರ ಮಂತ್ರಗಳು' : currentLang === 'hi' ? 'पूजन से संबंधित पवित्र मन्त्र' : 'Sacred Festival Mantras'}
                </span>
              </h3>

              <div className="space-y-3">
                {festival.mantras.map((mantra, idx) => {
                  const mantraText = mantra[currentLang];
                  const isCopied = copiedMantraIndex === idx;

                  return (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl border border-amber-200/80 dark:border-stone-700 bg-amber-50/30 dark:bg-stone-800/60 flex items-center justify-between gap-3"
                    >
                      <p className="text-sm sm:text-base font-serif font-semibold text-stone-900 dark:text-amber-100 italic leading-relaxed">
                        {mantraText}
                      </p>

                      <button
                        onClick={() => handleCopyMantra(mantraText, idx)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400 transition-colors flex items-center gap-1.5 text-xs shrink-0"
                        title="Copy Mantra"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 7: Complete Navaratri Pooja Vidhan from User's Uploaded Image */}
          {festival.isNavaratri && activeTab === 'navaratri-vidhana' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
                <Flame className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold font-serif text-base text-amber-900 dark:text-amber-200">
                    ಶ್ರೀ ಶರನ್ನವರಾತ್ರಿ ಪೂಜಾ ವಿಧಾನ ಮತ್ತು ನೇಮನಿಷ್ಠೆಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ (ಮೂಲ ಫೋಟೋ ಪ್ರತಿ ವಿವರಣೆ)
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                    ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನವರಾತ್ರಿಯ ೯ ದಿನಗಳಲ್ಲೂ ಅನುಸರಿಸಬೇಕಾದ ಪೂಜಾ ವಿಧಾನದ ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ.
                  </p>
                </div>
              </div>

              {/* 10 Step Detailed List exactly as transcribed from the user's provided document */}
              <div className="space-y-3 text-xs sm:text-sm">
                
                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೧. ಅಖಂಡ ದೀಪ ಸ್ಥಾಪನೆ ಮತ್ತು ಆರೈಕೆ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ೯ ದಿನಗಳಲ್ಲೂ ನಂದಾದೀಪವು ನಂದಿಹೋಗದಂತೆ (ಆರಿಹೋಗದಂತೆ) ಎಚ್ಚರ ವಹಿಸಬೇಕು. ದೀಪಕ್ಕೆ ತುಪ್ಪ ಅಥವಾ ಎಣ್ಣೆಯನ್ನು ಸತತವಾಗಿ ಹಾಕಿ ಪೋಷಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೨. ಕಲಶ ಸ್ಥಾಪನೆ ಮತ್ತು ಸಪ್ತಧಾನ್ಯ ಬಿತ್ತನೆ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ಕಲಶವನ್ನು ಮೊದಲ ದಿನದಂದು ಅಭಿಜಿತ್ ಮುಹೂರ್ತದಲ್ಲಿ (ಮಧ್ಯಾಹ್ನ ೧೨:೦೦ ರ ಸುಮಾರಿಗೆ) ಸ್ಥಾಪಿಸುವುದು ಅತ್ಯಂತ ಶುಭಕರ. ಕಲಶದ ಕೆಳಗೆ ಮಣ್ಣಿನ ತಟ್ಟೆಯಲ್ಲಿ ನವಧಾನ್ಯಗಳನ್ನು ಬಿತ್ತಿ ಪೂಜಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೩. ದೇವಿಯ ಆವಾಹನೆ ಮತ್ತು ಜ್ಯೋತಿ ಪ್ರಜ್ವಲನೆ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ಕಲಶದಲ್ಲಿ ಶ್ರೀ ದೇವಿಯನ್ನು ಆವಾಹನೆ ಮಾಡಿ, ದೇವಿಯ ಮೂರ್ತಿ ಅಥವಾ ಫೋಟೋವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ಅಕ್ಷತೆ, ಗಂಧ, ಕುಂಕುಮಗಳಿಂದ ಪೂಜಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೪. ಪ್ರಾತಃಕಾಲ ಮತ್ತು ಸಾಯಂಕಾಲದ ಪೂಜೆ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ಶುದ್ಧ ಮನಸ್ಸಿನಿಂದ ಸ್ನಾನ ಮಾಡಿ, ದೇವಿಗೆ ಪಂಚಾಮೃತ ಅಭಿಷೇಕ, ಹೂವುಗಳಿಂದ ಅಲಂಕಾರ, ಧೂಪ, ದೀಪ ಮತ್ತು ನೈವೇದ್ಯವನ್ನು ಸಮರ್ಪಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೫. ನೈವೇದ್ಯ ನಿಯಮ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ದೇವಿಗೆ ನಿತ್ಯವೂ ಸಾತ್ವಿಕ ನೈವೇದ್ಯವನ್ನೇ ಅರ್ಪಿಸಬೇಕು. ಹಣ್ಣುಗಳು, ಪಾಯಸ, ಸಿಹಿ ತಿಂಡಿಗಳು ಮತ್ತು ಪಂಚಾಮೃತವನ್ನು ನೈವೇದ್ಯ ಮಾಡಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೬. ಕನ್ಯಾ ಪೂಜೆ (ಬಾಲಾ ತ್ರಿಪುರಸುಂದರಿ ಪೂಜೆ):
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ನವರಾತ್ರಿಯಲ್ಲಿ ಪ್ರತಿದಿನ ಅಥವಾ ಅಷ್ಟಮಿ/ನವಮಿಯ ದಿನದಂದು ೨ ರಿಂದ ೧೦ ವರ್ಷದೊಳಗಿನ ಕನ್ಯೆಯರನ್ನು ದೇವಿಯ ಸ್ವರೂಪವೆಂದು ಭಾವಿಸಿ ಪಾದಪೂಜೆ ಮಾಡಿ, ವಸ್ತ್ರ ಮತ್ತು ಭೋಜನ ನೀಡಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೭. ದೇವಿ ಪುರಾಣ / ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಾರಾಯಣ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ದೇವಿ ಪುರಾಣವನ್ನು ಮೊದಲ ಬಾರಿಗೆ ಓದುತ್ತಿರುವವರು, ದಿನಕ್ಕೆ ಎರಡು ಅಧ್ಯಾಯ ಓದುವುದರಿಂದ, ೯ ದಿನಗಳಲ್ಲಿ ೧೩ ಅಧ್ಯಾಯಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಬಹುದು. ದೇವಿ ಪುರಾಣವನ್ನು ಪ್ರತಿದಿನ ಪೂರ್ಣವಾಗಿ ಓದುವುದು ಅತ್ಯುತ್ತಮ.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೮. ಅಷ್ಟಮಿ ಕೂಷ್ಮಾಂಡ (ಕುಂಬಳಕಾಯಿ) ಬಲಿ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ಅಷ್ಟಮಿ ದಿನದ ರಾತ್ರಿ ಅಷ್ಟಮ ಅಧ್ಯಾಯವನ್ನು (ಮಹಿಷಾಸುರ ಮರ್ದನ) ಓದಿ ಕುಂಬಳಕಾಯಿ (ಕೂಷ್ಮಾಂಡ) ಯನ್ನು ಕೊಯ್ದು ದೇವಿಗೆ ಬಲಿಯನ್ನು ಸಮರ್ಪಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೯. ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಮತ್ತು ಧ್ಯಾನ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ಪ್ರತಿದಿನ ದೇವಿ ಪುರಾಣ ಓದಿದ ನಂತರ ಜಪ ಮಾಡಬೇಕು. ನವಾರ್ಣ ಮಂತ್ರ (ಓಂ ಐಂ ಹ್ರೀಂ ಕ್ಲೀಂ ಚಾಮುಂಡಾಯೈ ವಿಚ್ಚೇ) ಜಪಿಸಿ ಭಕ್ತಿಯಿಂದ ಧ್ಯಾನಿಸಬೇಕು.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    ೧೦. ದಶಮಿಯ ದಿನ ವಿಸರ್ಜನೆ:
                  </div>
                  <p className="text-stone-700 dark:text-stone-300">
                    ದಶಮಿಯ ದಿನ, ಪ್ರತಿದಿನದ ಪೂಜೆಯ ನಂತರ ಮೊದಲನೆಯ ಅಧ್ಯಾಯದ ಒಂದೆರಡು ನುಡಿಗಳನ್ನು ಓದಿ ಜಪಗಳನ್ನು ಮುಗಿಸಿ, ದಶಮಿಯ ನೈವೇದ್ಯವನ್ನು ಮಾಡಿದ ನಂತರ ಪ್ರದಕ್ಷಿಣಾಪೂರ್ವಕ ದೇವಿ ಕಲಶವನ್ನು ವಿಸರ್ಜಿಸಬೇಕು.
                  </p>
                </div>

              </div>

              {/* Phala Shruti & Conclusion */}
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-600 dark:text-stone-300 italic border border-stone-200 dark:border-stone-700">
                <span className="font-bold not-italic block mb-1 text-stone-800 dark:text-stone-100">ಸೂಚನೆ:</span>
                ಶ್ರೀ ದೇವಿಯು ನಿರಾಕಾರ ಮತ್ತು ನಿರಂಬರಳಾಗಿದ್ದರೂ, ನಾವು ಪೂಜೆ ಮಾಡುವಾಗ ದೇವಿಯ ಮೂರ್ತಿಗಳಲ್ಲಿ ಆರಾಧಿಸುವುದು ಸುಲಭ. ನಂತರ ಆ ದಿವ್ಯ ಚೈತನ್ಯವೇ ಬ್ರಹ್ಮವೆಂದು ಅರಿತು ಜಾಗೃತರಾಗುವುದು ಶ್ರೇಷ್ಠ.
              </div>

            </div>
          )}

          {/* Tab 8: Navaratri Day Color */}
          {activeTab === 'color' && festival.navaratriColor && (
            <div className="space-y-4">
              <div 
                className="p-6 rounded-2xl border-2 shadow-lg text-white space-y-3 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${festival.navaratriColor.hex}, #1c1917)`,
                  borderColor: festival.navaratriColor.hex
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center shrink-0 text-xl font-bold"
                    style={{ backgroundColor: festival.navaratriColor.hex }}
                  >
                    ✨
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-mono text-white/80 font-bold block">
                      {currentLang === 'kn' ? 'ನವರಾತ್ರಿ ದಿನದ ಪವಿತ್ರ ಬಣ್ಣ' : currentLang === 'hi' ? 'नवरात्रि का पावन रंग' : 'Sacred Navaratri Color of the Day'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                      {festival.navaratriColor.colorName[currentLang]}
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 backdrop-blur-xs border border-white/20 text-xs sm:text-sm text-stone-100 leading-relaxed">
                  <strong className="block text-amber-300 mb-1 font-sans">
                    {currentLang === 'kn' ? 'ಬಣ್ಣದ ಧಾರ್ಮಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವ:' : currentLang === 'hi' ? 'रंग का आध्यात्मिक एवं धार्मिक महत्व:' : 'Spiritual & Cosmic Significance:'}
                  </strong>
                  {festival.navaratriColor.significance[currentLang]}
                </div>
              </div>

              {/* All 9 / 10 Navaratri Colors Guide */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>
                    {currentLang === 'kn' ? 'ನವರಾತ್ರಿಯ ೯ ದಿನಗಳ ಬಣ್ಣಗಳ ಪಟ್ಟಿ (Navaratri 9 Colors Sequence)' : currentLang === 'hi' ? 'नवरात्रि के ९ दिनों के रंगों की क्रमबद्ध सूची' : 'Nine Sacred Colors of Navaratri'}
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {[
                    { day: 'Day 1 (ಶೈಲಪುತ್ರಿ)', color: 'ಹಳದಿ (Yellow)', hex: '#eab308' },
                    { day: 'Day 2 (ಬ್ರಹ್ಮಚಾರಿಣಿ)', color: 'ಹಸಿರು (Green)', hex: '#16a34a' },
                    { day: 'Day 3 (ಚಂದ್ರಘಂಟಾ)', color: 'ಬೂದು (Grey)', hex: '#64748b' },
                    { day: 'Day 4 (ಕೂಷ್ಮಾಂಡಾ)', color: 'ಕಿತ್ತಳೆ (Orange)', hex: '#ea580c' },
                    { day: 'Day 5 (ಸ್ಕಂದಮಾತಾ)', color: 'ಬಿಳಿ (White)', hex: '#f8fafc' },
                    { day: 'Day 6 (ಕಾತ್ಯಾಯನಿ)', color: 'ಕೆಂಪು (Red)', hex: '#dc2626' },
                    { day: 'Day 7 (ಕಾಳರಾತ್ರಿ)', color: 'ನೀಲಿ (Royal Blue)', hex: '#1d4ed8' },
                    { day: 'Day 8 (ಮಹಾಗೌರಿ)', color: 'ಗುಲಾಬಿ (Pink)', hex: '#db2777' },
                    { day: 'Day 9 (ಸಿದ್ಧಿದಾತ್ರಿ)', color: 'ನೇರಳೆ (Purple)', hex: '#7c3aed' },
                    { day: 'Day 10 (ವಿಜಯದಶಮಿ)', color: 'ಸ್ವರ್ಣ ಹಳದಿ (Gold)', hex: '#d97706' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        item.hex.toLowerCase() === festival.navaratriColor?.hex.toLowerCase()
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-400 font-bold'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-xs" style={{ backgroundColor: item.hex }} />
                      <div className="truncate">
                        <div className="text-[11px] text-stone-800 dark:text-stone-200">{item.day}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{item.color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Modal Footer - Always visible at bottom with quick close button */}
        <div className="sticky bottom-0 z-30 shrink-0 p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {currentLang === 'kn' ? 'ಪವಿತ್ರ ಭಾರತೀಯ ಹಬ್ಬಗಳ ಕೈಪಿಡಿ' : currentLang === 'hi' ? 'वैदिक पर्व मार्गदर्शिका' : 'Authentic Vedic Festivals Directory'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-md flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>{currentLang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : currentLang === 'hi' ? 'बंद करें (Close)' : 'Close'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
