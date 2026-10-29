import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Compass, 
  Flame, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  HeartHandshake,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Festival, Language, PanchangaDay } from '../types';
import { formatJustNumber, formatNumberWithEnglishBracket } from '../utils/panchanga';
import { calculateMoonPhaseFromDate } from '../utils/lunarPhase';
import { MoonPhaseIcon } from './MoonPhaseIcon';

export interface InlineDayDetailPanelProps {
  day: PanchangaDay;
  festival?: Festival | null;
  currentLang: Language;
  initialTab?: 'panchanga' | 'moonGowri' | 'rituals' | 'festivalDetail' | 'dasha';
  onClose: () => void;
  onOpenDasha?: () => void;
  onSelectFestival?: (fest: Festival) => void;
}

export const InlineDayDetailPanel: React.FC<InlineDayDetailPanelProps> = ({
  day,
  festival: initialFestival,
  currentLang,
  initialTab = 'panchanga',
  onClose,
  onOpenDasha,
  onSelectFestival
}) => {
  const [activeTab, setActiveTab] = useState<'panchanga' | 'moonGowri' | 'rituals' | 'festivalDetail' | 'dasha'>(
    initialFestival || (day.festivals.length > 0 && initialTab === 'festivalDetail') ? 'festivalDetail' : initialTab
  );

  const [selectedFestivalIndex, setSelectedFestivalIndex] = useState<number>(0);
  const [checkedSamagri, setCheckedSamagri] = useState<Record<string, boolean>>({});
  const [selectedUserDirection, setSelectedUserDirection] = useState<'east' | 'north' | 'west' | 'south'>('east');

  // Synchronize state when user clicks a new date or festival
  useEffect(() => {
    if (initialFestival) {
      setActiveTab('festivalDetail');
      const idx = day.festivals.findIndex(f => f.id === initialFestival.id);
      if (idx >= 0) setSelectedFestivalIndex(idx);
    } else if (initialTab) {
      setActiveTab(initialTab);
      setSelectedFestivalIndex(0);
    }
  }, [day.gregorianDate, initialFestival, initialTab]);

  // Active festival for festival tab
  const activeFestival = useMemo(() => {
    if (initialFestival) return initialFestival;
    if (day.festivals.length > 0) {
      return day.festivals[selectedFestivalIndex] || day.festivals[0];
    }
    return null;
  }, [initialFestival, day.festivals, selectedFestivalIndex]);

  // Moon phase calculation
  const moonPhase = useMemo(() => {
    const dt = new Date(day.gregorianDate);
    return calculateMoonPhaseFromDate(dt, currentLang);
  }, [day.gregorianDate, currentLang]);

  // Gowri Panchanga day & night calculations
  const gowriDaySlots = useMemo(() => {
    // Standard 8 muhurta slots of day (each 1.5 hours approximately)
    const slots = [
      { name: { kn: 'ಶುಭ', en: 'Shubha', hi: 'शुभ' }, nature: 'good', desc: { kn: 'ಅತ್ಯುತ್ತಮ ಶುಭ ಕಾಲ - ನೂತನ ಕಾರ್ಯಾರಂಭಕ್ಕೆ ಶ್ರೇಷ್ಠ', en: 'Highly Auspicious for new deeds', hi: 'अति शुभ वेला' } },
      { name: { kn: 'ಲಾಭ', en: 'Labha', hi: 'लाभ' }, nature: 'good', desc: { kn: 'ವ್ಯಾಪಾರ, ಹೂಡಿಕೆ, ಧನಲಾಭಕ್ಕೆ ಉತ್ತಮ', en: 'Prosperity & financial gains', hi: 'धनलाभ एवं व्यापार' } },
      { name: { kn: 'ಅಮೃತ', en: 'Amrita', hi: 'अमृत' }, nature: 'good', desc: { kn: 'ಅಮೃತ ಘಳಿಗೆ - ದೇವತಾ ಪೂಜೆ ಹಾಗೂ ಪ್ರಯಾಣಕ್ಕೆ ಸಿದ್ಧಿ', en: 'Nectar window - spiritual success', hi: 'अमृत काल सर्वकार्य सिद्धि' } },
      { name: { kn: 'ಚರ', en: 'Chara', hi: 'चर' }, nature: 'neutral', desc: { kn: 'ಚಲನಶೀಲ ಕಾಲ - ವಾಹನ ಖರೀದಿ, ಪ್ರಯಾಣಕ್ಕೆ ಯೋಗ್ಯ', en: 'Mobile/Movement - travel & transit', hi: 'यात्रा एवं गतिशीलता' } },
      { name: { kn: 'ಉದ್ಯೋಗ', en: 'Udyoga', hi: 'उद्यम' }, nature: 'good', desc: { kn: 'ಉದ್ಯೋಗ, ಇಂಟರ್ವ್ಯೂ, ಹೊಸ ಪ್ರಯತ್ನಗಳಿಗೆ ಶುಭ', en: 'Employment & negotiations', hi: 'उद्योग एवं रोजगार' } },
      { name: { kn: 'ರೋಗ', en: 'Roga', hi: 'रोग' }, nature: 'bad', desc: { kn: 'ಅಶುಭ ಕಾಲ - ಆರೋಗ್ಯ ಬಾಧೆ, ಸಾಲ ಮಾಡಬೇಡಿ', en: 'Inauspicious - health cautions', hi: 'अशुभ काल - वर्ज्य' } },
      { name: { kn: 'ಕಾಲ', en: 'Kaala', hi: 'काल' }, nature: 'bad', desc: { kn: 'ಕಾಲ ಘಳಿಗೆ - ಕಲಹ, ನಷ್ಟ ಉಂಟಾಗುವ ಸಂಭವ', en: 'Strife window - avoid conflicts', hi: 'काल वेला - वर्ज्य' } },
      { name: { kn: 'ವಿಷ', en: 'Visha', hi: 'विष' }, nature: 'bad', desc: { kn: 'ವಿಷ ಘಟಿಕಾ - ಕಡ್ಡಾಯ ತ್ಯಾಜ್ಯ ಸಮಯ', en: 'Poison window - strictly avoid', hi: 'विष काल - त्याज्य' } }
    ];
    // Rotate based on varaIndex
    const shift = (day.varaIndex * 3) % slots.length;
    return [...slots.slice(shift), ...slots.slice(0, shift)];
  }, [day.varaIndex]);

  const toggleSamagri = (id: string) => {
    setCheckedSamagri(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Deepa guidelines direction data
  const deepaPlacementGuidelines = useMemo(() => {
    return {
      east: {
        title: { en: 'Facing East (ಪೂರ್ವಾಭಿಮುಖ)', kn: 'ಪೂರ್ವಾಭಿಮುಖ (Facing East)', hi: 'पूर्वाभिमुख (Facing East)' },
        altarDirection: { en: 'Pooja Altar in East / North-East (Ishanya)', kn: 'ಪೂಜಾ ಮಂಟಪ: ಪೂರ್ವ ಅಥವಾ ಈಶಾನ್ಯ ದಿಕ್ಕು', hi: 'पूजा वेदी: पूर्व अथवा ईशान कोण' },
        rightSide: {
          direction: { en: 'South (ದಕ್ಷಿಣ)', kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕು (South)', hi: 'दक्षिण दिशा (South)' },
          outcome: {
            en: 'Agni Deva position: Dispels negative planetary energy, evil eyes, and establishes victory over hurdles.',
            kn: 'ಅಗ್ನಿ ದೇವತಾ ಸ್ಥಾನ: ನಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಹಾಗೂ ಶತ್ರು ಬಾಧೆ ನಿವಾರಣೆ; ಕಾರ್ಯ ವಿಜಯ ಮತ್ತು ಸ್ಥಿರತೆ ತರುತ್ತದೆ.',
            hi: 'अग्नि तत्त्व: नकारात्मक ऊर्जा का नाश, शत्रु बाधा निवारण एवं कार्य सिद्धि।'
          },
          status: 'recommended'
        },
        leftSide: {
          direction: { en: 'North (ಉತ್ತರ - ಕುಬೇರ)', kn: 'ಉತ್ತರ ದಿಕ್ಕು - ಕುಬೇರ ಸ್ಥಾನ (North)', hi: 'उत्तर दिशा - कुबेर स्थान (North)' },
          outcome: {
            en: 'Kubera & Lakshmi position: Attracts financial wealth, spiritual peace, and prosperity.',
            kn: 'ಕುಬೇರ-ಲಕ್ಷ್ಮೀ ಸ್ಥಾನ: ಧನಾಗಮನ, ಆರ್ಥಿಕ ಪ್ರಗತಿ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ ಮತ್ತು ಸಮೃದ್ಧಿ.',
            hi: 'कुबेर एवं लक्ष्मी स्थान: धन-धान्य समृद्धि, मानसिक शांति एवं वैभव।'
          },
          status: 'auspicious'
        },
        verdict: {
          en: 'Classical Vedic rule: Light the primary ghee/oil lamp on your RIGHT side (facing the deity) for general prosperity and divine blessings.',
          kn: 'ಶಾಸ್ತ್ರ ಸಮ್ಮತ ನಿಯಮ: ಪೂರ್ವಾಭಿಮುಖವಾಗಿ ಕುಳಿತಾಗ ನಿಮ್ಮ ಬಲಗೈ (Right hand) ಭಾಗದಲ್ಲಿ ಮುಖ್ಯ ದೀಪವಿಡುವುದು ಸಾತ್ವಿಕ ನಿಯಮ.',
          hi: 'शास्त्रोक्त विधान: पूर्वाभिमुख बैठकर दाहिने हाथ की ओर प्रधान दीपक प्रज्वलित करना परम मंगलकारी है।'
        }
      },
      north: {
        title: { en: 'Facing North (ಉತ್ತರಾಭಿಮುಖ)', kn: 'ಉತ್ತರಾಭಿಮುಖ (Facing North)', hi: 'उत्तराभिमुख (Facing North)' },
        altarDirection: { en: 'Pooja Altar in North / North-East (Ishanya)', kn: 'ಪೂಜಾ ಮಂಟಪ: ಉತ್ತರ ಅಥವಾ ಈಶಾನ್ಯ ದಿಕ್ಕು', hi: 'पूजा वेदी: उत्तर अथवा ईशान कोण' },
        rightSide: {
          direction: { en: 'East (ಪೂರ್ವ - ಸೂರ್ಯ)', kn: 'ಪೂರ್ವ ದಿಕ್ಕು (East)', hi: 'पूर्व दिशा (East)' },
          outcome: {
            en: 'Surya / Indra position: Bestows intelligence, vitality, good health, and longevity.',
            kn: 'ಸೂರ್ಯ-ಇಂದ್ರ ಸ್ಥಾನ: ಜ್ಞಾನ, ಕೀರ್ತಿ, ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಆಯಸ್ಸು ವೃದ್ಧಿಸುತ್ತದೆ.',
            hi: 'सूर्य-इन्द्र पद: ज्ञान, तेज, उत्तम स्वास्थ्य एवं दीर्घायु।'
          },
          status: 'recommended'
        },
        leftSide: {
          direction: { en: 'West (ಪಶ್ಚಿಮ - ವರುಣ)', kn: 'ಪಶ್ಚಿಮ ದಿಕ್ಕು (West)', hi: 'पश्चिम दिशा (West)' },
          outcome: {
            en: 'Varuna position: Emotional balance, water element purification, and harmony.',
            kn: 'ವರುಣ ಸ್ಥಾನ: ಭಾವನಾತ್ಮಕ ಸಮತೋಲನ ಮತ್ತು ಕೌಟುಂಬಿಕ ಸೌಖ್ಯ.',
            hi: 'वरुण पद: मानसिक संतुलन एवं पारिवारिक सौहार्द।'
          },
          status: 'auspicious'
        },
        verdict: {
          en: 'Lighting the lamp on the East (your right) when facing North maximizes solar prana and intellect.',
          kn: 'ಉತ್ತರಾಭಿಮುಖವಾಗಿ ಕುಳಿತಾಗ ಬಲಗೈಯ ಪೂರ್ವ ದಿಕ್ಕಿಗೆ ದೀಪವಿಡುವುದು ಪ್ರಾಣಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'उत्तराभिमुख में दाहिनी ओर पूर्व दिशा में दीपक रखना प्राणशक्ति वर्धक है।'
        }
      },
      west: {
        title: { en: 'Facing West (ಪಶ್ಚಿಮಾಭಿಮುಖ)', kn: 'ಪಶ್ಚಿಮಾಭಿಮುಖ (Facing West)', hi: 'पश्चिमाभिमुख (Facing West)' },
        altarDirection: { en: 'Pooja Altar in West / East', kn: 'ಪೂಜಾ ಮಂಟಪ: ಪಶ್ಚಿಮ ಅಥವಾ ಪೂರ್ವ', hi: 'पूजा वेदी: पश्चिम अथवा पूर्व' },
        rightSide: {
          direction: { en: 'North (ಉತ್ತರ)', kn: 'ಉತ್ತರ ದಿಕ್ಕು (North)', hi: 'उत्तर दिशा (North)' },
          outcome: {
            en: 'Soma/Kubera: Financial stabilization and spiritual tranquility.',
            kn: 'ಕುಬೇರ ದಿಕ್ಕು: ಆರ್ಥಿಕ ಸಮತೋಲನ ಮತ್ತು ದೈವಿಕ ಶಾಂತಿ.',
            hi: 'कुबेर दिशा: वित्तीय स्थिरता व आध्यात्मिक शांति।'
          },
          status: 'auspicious'
        },
        leftSide: {
          direction: { en: 'South (ದಕ್ಷಿಣ)', kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕು (South)', hi: 'दक्षिण दिशा (South)' },
          outcome: {
            en: 'Yama direction: Ancestral prayers only. General pooja avoids keeping lamp exclusively in South.',
            kn: 'ಯಮ ದಿಕ್ಕು: ಪಿತೃತರ್ಪಣಕ್ಕೆ ಮಾತ್ರ ಮಾನ್ಯ; ನಿತ್ಯ ದೇವತಾ ಪೂಜೆಯಲ್ಲಿ ದಕ್ಷಿಣದಲ್ಲಿ ಮಾತ್ರ ದೀಪವಿಡಬಾರದು.',
            hi: 'यम दिशा: केवल पितृ कार्य हेतु मान्य।'
          },
          status: 'neutral'
        },
        verdict: {
          en: 'Keep lamp on the North (your right) when facing West.',
          kn: 'ಪಶ್ಚಿಮಾಭಿಮುಖವಾಗಿ ಕುಳಿತಾಗ ಬಲಗೈಯ ಉತ್ತರ ದಿಕ್ಕಿಗೆ ದೀಪವಿಡುವುದು ಶ್ರೇಷ್ಠ.',
          hi: 'पश्चिमाभिमुख में दाहिनी ओर उत्तर दिशा में दीपक रखें।'
        }
      },
      south: {
        title: { en: 'Facing South (ದಕ್ಷಿಣಾಭಿಮುಖ - ಸೀಮಿತ)', kn: 'ದಕ್ಷಿಣಾಭಿಮುಖ (Facing South - Restrictive)', hi: 'दक्षिणाभिमुख (Facing South)' },
        altarDirection: { en: 'Tantrik or Pitru Pooja only', kn: 'ಕೇವಲ ಪಿತೃ ಕರ್ಮ ಹಾಗೂ ತಾಂತ್ರಿಕ ಪೂಜೆಗಳಿಗೆ ಸೀಮಿತ', hi: 'केवल पितृ अथवा विशेष अनुष्ठान' },
        rightSide: {
          direction: { en: 'West (ಪಶ್ಚಿಮ)', kn: 'ಪಶ್ಚಿಮ ದಿಕ್ಕು (West)', hi: 'पश्चिम दिशा (West)' },
          outcome: {
            en: 'Pacification of ancestral doshas and neutral karma.',
            kn: 'ಪಿತೃ ದೋಷ ಶಾಂತಿ ಮತ್ತು ಕರ್ಮ ನಿರ್ವಹಣೆ.',
            hi: 'पितृदोष शांति एवं कर्म संसिद्धि।'
          },
          status: 'neutral'
        },
        leftSide: {
          direction: { en: 'East (ಪೂರ್ವ)', kn: 'ಪೂರ್ವ ದಿಕ್ಕು (East)', hi: 'पूर्व दिशा (East)' },
          outcome: {
            en: 'Solar light to offset south-facing negative influence.',
            kn: 'ದಕ್ಷಿಣ ದಿಕ್ಕಿನ ದೋಷವನ್ನು ಸೂರ್ಯ ಪ್ರಕಾಶದಿಂದ ನಿವಾರಿಸುವುದು.',
            hi: 'सूर्य प्रकाश द्वारा दोष निवारण।'
          },
          status: 'auspicious'
        },
        verdict: {
          en: 'Daily auspicious puja is strictly not recommended facing South. Prefer East or North.',
          kn: 'ನಿತ್ಯ ಮಂಗಳಕರ ದೇವತಾ ಪೂಜೆಗೆ ದಕ್ಷಿಣಾಭಿಮುಖ ಸೂಕ್ತವಲ್ಲ; ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಕುಳಿತುಕೊಳ್ಳಿ.',
          hi: 'नित्य मंगल पूजन हेतु दक्षिण दिशा का त्याग कर पूर्व या उत्तर दिशा का चयन करें।'
        }
      }
    };
  }, []);

  const dirData = deepaPlacementGuidelines[selectedUserDirection];

  return (
    <div 
      id={`inline-details-${day.gregorianDate}`}
      className="w-full my-4 p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/80 dark:from-stone-900 dark:via-stone-900 dark:to-stone-850 border-2 border-amber-400 dark:border-amber-600 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 transition-all select-none"
    >
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{day.gregorianDate} ({day.vara[currentLang]})</span>
            </span>

            {day.festivals.length > 0 && (
              <span className="text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-red-300 dark:border-red-800">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>
                  {day.festivals.length} {currentLang === 'kn' ? 'ಹಬ್ಬ/ವಿಶೇಷ' : currentLang === 'hi' ? 'त्योहार/विशेष' : 'Festival Day'}
                </span>
              </span>
            )}

            <span className="text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
              {day.samvatsara[currentLang]} • {day.masa[currentLang]} ({day.pakshaName[currentLang]})
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 flex items-center gap-2 pt-1">
            <span>{day.tithiName[currentLang]}</span>
            <span className="text-stone-400 font-normal">|</span>
            <span className="text-amber-700 dark:text-amber-400">{day.nakshatra[currentLang]}</span>
            {day.pada && <span className="text-xs font-mono font-semibold text-stone-500">({currentLang === 'kn' ? 'ಪಾದ' : 'Pada'} {day.pada})</span>}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-400 pt-0.5">
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}: {day.sunrise}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-orange-700 dark:text-orange-300 font-semibold">
              <span>🌅</span>
              <span>{currentLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}: {day.sunset}</span>
            </span>
            <span>•</span>
            <span className="text-purple-700 dark:text-purple-300 font-semibold">
              <span>🌙 {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ' : 'Moon Sign'}: {day.chandraRashi[currentLang]}</span>
            </span>
          </div>
        </div>

        {/* Close Button right at the top */}
        <button
          onClick={onClose}
          type="button"
          className="self-start md:self-center px-4 py-2 rounded-xl bg-stone-200/80 hover:bg-red-500 hover:text-white dark:bg-stone-800 dark:hover:bg-red-600 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          title="Collapse Details (ವಿವರಗಳನ್ನು ಮರೆಮಾಡಿ)"
        >
          <X className="w-4 h-4" />
          <span>{currentLang === 'kn' ? 'ವಿವರಗಳನ್ನು ಮುಚ್ಚಿ ✕' : currentLang === 'hi' ? 'विवरण बंद करें ✕' : 'Close Details ✕'}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1.5 pt-3 pb-1 border-b border-amber-200/60 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setActiveTab('panchanga')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'panchanga'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 border border-amber-200 dark:border-stone-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{currentLang === 'kn' ? 'ಪಂಚಾಂಗ & ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'पंचांग एवं मुहूर्त' : 'Panchanga & Muhurtas'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('moonGowri')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'moonGowri'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-indigo-50 border border-amber-200 dark:border-stone-700'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>{currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲೆ & ಗೌರಿ ಪಂಚಾಂಗ' : currentLang === 'hi' ? 'चन्द्र कला व गौरी पंचांग' : 'Moon Phase & Gowri'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rituals')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'rituals'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-50 border border-amber-200 dark:border-stone-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{currentLang === 'kn' ? 'ನಿತ್ಯ ಪೂಜೆ & ದೀಪ ನಿಯಮಗಳು' : currentLang === 'hi' ? 'नित्य पूजा व दीप नियम' : 'Daily Pooja & Deepa Guidelines'}</span>
        </button>

        {day.festivals.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('festivalDetail')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'festivalDetail'
                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 border border-red-300 dark:border-red-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'kn' ? 'ಹಬ್ಬದ ಕಥೆ & ಪೂಜಾ ವಿಧಾನ' : currentLang === 'hi' ? 'त्योहार कथा व पूजा विधि' : 'Festival Story & Vidhi'}
            </span>
          </button>
        )}

        {onOpenDasha && (
          <button
            type="button"
            onClick={onOpenDasha}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-300 dark:border-purple-800 ml-auto"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentLang === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್ →' : 'Vimshottari Dasha →'}</span>
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PANCHANGA & TIMINGS */}
      {/* ============================================================== */}
      {activeTab === 'panchanga' && (
        <div className="pt-4 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Tithi Card */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                {currentLang === 'kn' ? 'ತಿಥಿ ವಿವರ' : 'Tithi Details'}
              </span>
              <p className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {day.tithiName[currentLang]} ({day.pakshaName[currentLang]})
              </p>
              {day.tithiTiming && (
                <div className="mt-1 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">{currentLang === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Ends'}: </span>
                  <span>{day.tithiTiming.endTimeFormatted[currentLang] || day.tithiTiming.endTime}</span>
                </div>
              )}
            </div>

            {/* Nakshatra Card */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ & ಪಾದ' : 'Nakshatra & Pada'}
              </span>
              <p className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {day.nakshatra[currentLang]} {day.pada ? `(ಪಾದ ${day.pada})` : ''}
              </p>
              {day.charanaLetter && (
                <p className="mt-1 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                  {currentLang === 'kn' ? 'ನಾಮ ಅಕ್ಷರಗಳು' : 'Name Syllables'}: <span className="font-bold text-emerald-700 dark:text-emerald-400">{day.charanaLetter}</span>
                </p>
              )}
            </div>

            {/* Yoga & Karana */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-1">
                {currentLang === 'kn' ? 'ಯೋಗ & ಕರಣ' : 'Yoga & Karana'}
              </span>
              <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                <span className="font-bold text-stone-900 dark:text-stone-100">{day.yoga[currentLang]}</span> (ಯೋಗ)
              </p>
              <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-1">
                <span className="font-bold text-stone-900 dark:text-stone-100">{day.karana[currentLang]}</span> (ಕರಣ)
              </p>
            </div>

            {/* Sun & Moon Signs */}
            <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                {currentLang === 'kn' ? 'ಸೂರ್ಯ & ಚಂದ್ರ ರಾಶಿ' : 'Sun & Moon Signs'}
              </span>
              <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                ☀️ {currentLang === 'kn' ? 'ಸೂರ್ಯ' : 'Sun'}: {day.suryaRashi[currentLang]}
              </p>
              <p className="font-semibold text-xs text-stone-800 dark:text-stone-200 mt-1">
                🌙 {currentLang === 'kn' ? 'ಚಂದ್ರ' : 'Moon'}: {day.chandraRashi[currentLang]}
              </p>
            </div>
          </div>

          {/* Muhurtas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Auspicious Muhurtas */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 border-b border-emerald-200 dark:border-emerald-900 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                  {currentLang === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತಗಳು (Auspicious Timings)' : 'Auspicious Windows (Shubh Muhurtas)'}
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                {day.brahmaMuhurta && (
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ (Brahma Muhurta)' : 'Brahma Muhurta'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{day.brahmaMuhurta.start} - {day.brahmaMuhurta.end}</span>
                  </div>
                )}
                {day.abhijitMuhurta && (
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (Abhijit Muhurta)' : 'Abhijit Muhurta'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{day.abhijitMuhurta.start} - {day.abhijitMuhurta.end}</span>
                  </div>
                )}
                {day.amritKaal && (
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ಅಮೃತ ಕಾಲ (Amrit Kaal)' : 'Amrit Kaal'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{day.amritKaal.start} - {day.amritKaal.end}</span>
                  </div>
                )}
                {day.vijayaMuhurta && (
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-900/50">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ವಿಜಯ ಮುಹೂರ್ತ (Vijaya Muhurta)' : 'Vijaya Muhurta'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{day.vijayaMuhurta.start} - {day.vijayaMuhurta.end}</span>
                  </div>
                )}
                {day.godhuliMuhurta && (
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {currentLang === 'kn' ? 'ಗೋಧೂಳಿ ಮುಹೂರ್ತ (Godhuli Muhurta)' : 'Godhuli Muhurta'}
                    </span>
                    <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{day.godhuliMuhurta.start} - {day.godhuliMuhurta.end}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inauspicious Timings */}
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 space-y-2">
              <div className="flex items-center gap-2 border-b border-rose-200 dark:border-rose-900 pb-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300">
                  {currentLang === 'kn' ? 'ವರ್ಜ್ಯ / ಅಶುಭ ಕಾಲಗಳು (Inauspicious Windows)' : 'Inauspicious Windows (Ashubh Kaal)'}
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-rose-900/50">
                  <span className="font-semibold text-rose-800 dark:text-rose-300">
                    {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal)' : 'Rahu Kaal'}
                  </span>
                  <span className="font-mono font-bold text-rose-900 dark:text-rose-200">{day.rahuKaal.start} - {day.rahuKaal.end}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-rose-900/50">
                  <span className="font-semibold text-rose-800 dark:text-rose-300">
                    {currentLang === 'kn' ? 'ಗುಳಿಕ ಕಾಲ (Gulika Kaal)' : 'Gulika Kaal'}
                  </span>
                  <span className="font-mono font-bold text-rose-900 dark:text-rose-200">{day.gulikaKaal.start} - {day.gulikaKaal.end}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-rose-900/50">
                  <span className="font-semibold text-rose-800 dark:text-rose-300">
                    {currentLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda)' : 'Yamaganda Kaal'}
                  </span>
                  <span className="font-mono font-bold text-rose-900 dark:text-rose-200">{day.yamagandaKaal.start} - {day.yamagandaKaal.end}</span>
                </div>
                {day.durmuhurta && (
                  <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-rose-900/50">
                    <span className="font-semibold text-rose-800 dark:text-rose-300">
                      {currentLang === 'kn' ? 'ದುರ್ಮುಹೂರ್ತ (Durmuhurta)' : 'Durmuhurta'}
                    </span>
                    <span className="font-mono font-bold text-rose-900 dark:text-rose-200">{day.durmuhurta.start} - {day.durmuhurta.end}</span>
                  </div>
                )}
                {day.varjyam && (
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-rose-800 dark:text-rose-300">
                      {currentLang === 'kn' ? 'ವರ್ಜ್ಯಂ (Varjyam / Visha Ghatika)' : 'Varjyam'}
                    </span>
                    <span className="font-mono font-bold text-rose-900 dark:text-rose-200">{day.varjyam.start} - {day.varjyam.end}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MOON PHASE & GOWRI PANCHANGA */}
      {/* ============================================================== */}
      {activeTab === 'moonGowri' && (
        <div className="pt-4 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Moon Phase Visualizer */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                  {currentLang === 'kn' ? 'ಚಂದ್ರ ಕಲೆ & ಪ್ರಕಾಶತೆ' : 'Moon Phase & Illumination'}
                </span>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {moonPhase.phaseName}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {day.paksha === 'Shukla' ? (currentLang === 'kn' ? 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳದಿಂಗಳು)' : 'Waxing Period') : (currentLang === 'kn' ? 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕತ್ತಲು)' : 'Waning Period')}
                </p>
              </div>

              <div className="flex items-center gap-4 my-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-stone-800">
                <MoonPhaseIcon 
                  paksha={day.paksha} 
                  tithiNumber={day.tithiNumber} 
                  size={36} 
                  currentLang={currentLang} 
                />
                <div>
                  <div className="text-xl font-bold font-mono text-indigo-900 dark:text-indigo-200">
                    {moonPhase.illumination}%
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {currentLang === 'kn' ? 'ಚಂದ್ರನ ಪ್ರಕಾಶಮಾನತೆ' : 'Illuminated Disk'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed italic">
                {moonPhase.spiritualSignificance}
              </p>
            </div>

            {/* Gowri Day Slots (2 Cols) */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-stone-800 pb-2">
                <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{currentLang === 'kn' ? 'ದಿನದ ಗೌರಿ ಪಂಚಾಂಗ (Day Gowri Timings)' : 'Day Gowri Panchanga Windows'}</span>
                </h4>
                <span className="text-[11px] text-stone-500 font-mono">8 ಮುಹೂರ್ತಗಳು</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {gowriDaySlots.map((slot, idx) => (
                  <div 
                    key={idx}
                    className={`p-2 rounded-xl border text-xs flex flex-col justify-between ${
                      slot.nature === 'good'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                        : slot.nature === 'neutral'
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                        : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{slot.name[currentLang]}</span>
                      <span className="text-[10px] font-mono">#{idx + 1}</span>
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-1 leading-tight line-clamp-2">
                      {slot.desc[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DAILY RITUALS & POOJA DEEPA GUIDELINES */}
      {/* ============================================================== */}
      {activeTab === 'rituals' && (
        <div className="pt-4 space-y-4 animate-in fade-in duration-150">
          {/* Deepa Placement Guidelines Interactive Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400 dark:border-amber-600 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-300/80 dark:border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
                <h4 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
                  {currentLang === 'kn' ? 'ಪೂಜಾ ದೀಪ ಸ್ಥಾಪನೆ & ದಿಕ್ಕಿನ ಮಾರ್ಗದರ್ಶಿ (Deepa Guidelines)' : 'Pooja Deepa Placement & Seating Guidelines'}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                {currentLang === 'kn' ? 'ಶಾಸ್ತ್ರ ಸಮ್ಮತ ಕ್ರಮ' : 'Vedic Krama'}
              </span>
            </div>

            {/* Direction Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {currentLang === 'kn' ? 'ಪೂಜೆ ಮಾಡುವವರು ಯಾವ ದಿಕ್ಕಿಗೆ ಮುಖ ಮಾಡಿ ಕುಳಿತಿದ್ದಾರೆ?' : 'Which direction is the worshipper facing while seated for Pooja?'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['east', 'north', 'west', 'south'] as const).map(dir => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setSelectedUserDirection(dir)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedUserDirection === dir
                        ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-amber-50'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{dir === 'east' ? (currentLang === 'kn' ? 'ಪೂರ್ವ (East)' : 'East') : dir === 'north' ? (currentLang === 'kn' ? 'ಉತ್ತರ (North)' : 'North') : dir === 'west' ? (currentLang === 'kn' ? 'ಪಶ್ಚಿಮ (West)' : 'West') : (currentLang === 'kn' ? 'ದಕ್ಷಿಣ (South)' : 'South')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seating & Deepa Placement Analysis Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Right Side Card */}
              <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-amber-300 dark:border-stone-700 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                    {currentLang === 'kn' ? 'ಬಲಗೈ ಭಾಗ (Right Hand Side)' : 'Right Hand Side of Worshipper'}
                  </span>
                  <span className="text-xs font-bold text-orange-600">
                    {dirData.rightSide.direction[currentLang]}
                  </span>
                </div>
                <p className="font-bold text-xs text-stone-900 dark:text-stone-100 pt-1">
                  {currentLang === 'kn' ? 'ಅಗ್ನಿ ಶಕ್ತಿ & ವಿಘ್ನ ನಿವಾರಣೆ' : 'Agni Principle & Obstacle Removal'}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {dirData.rightSide.outcome[currentLang]}
                </p>
              </div>

              {/* Left Side Card */}
              <div className="p-3 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-700 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                    {currentLang === 'kn' ? 'ಎಡಗೈ ಭಾಗ (Left Hand Side)' : 'Left Hand Side of Worshipper'}
                  </span>
                  <span className="text-xs font-bold text-indigo-600">
                    {dirData.leftSide.direction[currentLang]}
                  </span>
                </div>
                <p className="font-bold text-xs text-stone-900 dark:text-stone-100 pt-1">
                  {currentLang === 'kn' ? 'ಸಂಪತ್ತು, ಲಕ್ಷ್ಮೀ & ಶಾಂತಿ' : 'Lakshmi & Wealth Attraction'}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {dirData.leftSide.outcome[currentLang]}
                </p>
              </div>
            </div>

            {/* Vedic Recommendation Banner */}
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{dirData.verdict[currentLang]}</span>
            </div>
          </div>

          {/* Daily Pooja Samagri Checklist */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5 border-b border-stone-200 dark:border-stone-800 pb-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{currentLang === 'kn' ? 'ನಿತ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ (Pooja Checklist)' : 'Daily Pooja Samagri Checklist'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 text-xs">
              {[
                { id: 'deepa', label: { kn: 'ದೀಪ & ತುಪ್ಪ / ಎಳ್ಳೆಣ್ಣೆ (Lamp & Ghee)', en: 'Diya & Pure Cow Ghee', hi: 'दीपक एवं शुद्ध गौघृत' } },
                { id: 'agarbatti', label: { kn: 'ಸುಗಂಧ ಧೂಪ & ಅಗರಬತ್ತಿ (Incense Sticks)', en: 'Agarbatti & Dhoopa', hi: 'धूपबत्ती एवं अगरबत्ती' } },
                { id: 'flowers', label: { kn: 'ತಾಜಾ ಹೂವುಗಳು & ತುಳಸಿ (Flowers & Tulasi)', en: 'Fresh Flowers & Tulasi', hi: 'ताजे पुष्प एवं तुलसीदल' } },
                { id: 'gandha', label: { kn: 'ಗಂಧ, ಅರಿಶಿನ & ಕುಂಕುಮ (Chandana & Kumkum)', en: 'Chandana & Vermilion', hi: 'चन्दन, हल्दी व रोली' } },
                { id: 'akshata', label: { kn: 'ಮುರಿಯದ ಅಕ್ಷತೆ ಕಾಳುಗಳು (Sacred Akshata)', en: 'Sacred Akshata Rice', hi: 'अखण्ड अक्षत' } },
                { id: 'theertha', label: { kn: 'ಗಂಗಾಜಲ / ಶುದ್ಧ ತೀರ್ಥೋದಕ (Pure Theertha)', en: 'Theertha Patra & Uddharane', hi: 'गंगाजल एवं तीर्थ जल' } },
                { id: 'naivedya', label: { kn: 'ಋತುಫಲ / ಹಾಲು / ಪ್ರಸಾದ (Naivedya & Fruits)', en: 'Naivedya / Milk / Fruits', hi: 'ऋतुफल एवं नैवेद्य' } },
                { id: 'ghanti', label: { kn: 'ಪೂಜಾ ಘಂಟೆ & ಶಂಖ (Puja Bell & Conch)', en: 'Sacred Bell & Camphor', hi: 'पूजा घंटी एवं शंख' } }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleSamagri(item.id)}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    checkedSamagri[item.id]
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                      : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                    checkedSamagri[item.id] ? 'bg-emerald-600 text-white border-emerald-600' : 'border-stone-400 bg-white dark:bg-stone-700'
                  }`}>
                    {checkedSamagri[item.id] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="font-semibold text-xs">{item.label[currentLang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: FESTIVAL STORY & VIDHI */}
      {/* ============================================================== */}
      {activeTab === 'festivalDetail' && activeFestival && (
        <div className="pt-4 space-y-4 animate-in fade-in duration-150">
          {/* Multiple festivals selector pills if > 1 */}
          {day.festivals.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-2 border-b border-amber-200 dark:border-stone-800">
              {day.festivals.map((fest, idx) => (
                <button
                  key={fest.id}
                  type="button"
                  onClick={() => setSelectedFestivalIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                    activeFestival.id === fest.id
                      ? 'bg-red-600 text-white shadow-md border-red-500 ring-2 ring-red-400'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-red-50'
                  }`}
                >
                  <span>{['deepavali', 'naraka_chaturdashi', 'dhanteras', 'bali_padyami'].includes(fest.id) ? '🪔' : '🌺'}</span>
                  <span>{fest.name[currentLang]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Festival Hero Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {['deepavali', 'naraka_chaturdashi', 'dhanteras', 'bali_padyami'].includes(activeFestival.id) ? '🪔' : '🌺'}
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                Vedic Mahotsava
              </span>
            </div>
            <h4 className="text-lg sm:text-2xl font-serif font-black tracking-tight">
              {activeFestival.name[currentLang]}
            </h4>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              {activeFestival.shortDesc[currentLang]}
            </p>
          </div>

          {/* Festival Story & How Celebrated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs space-y-2">
              <h5 className="font-bold text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
                {currentLang === 'kn' ? 'ಪೌರಾಣಿಕ ಕಥೆ & ಮಹತ್ವ' : 'Spiritual Story & Significance'}
              </h5>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {activeFestival.story[currentLang]}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs space-y-2">
              <h5 className="font-bold text-xs font-mono uppercase tracking-wider text-orange-800 dark:text-orange-400">
                {currentLang === 'kn' ? 'ಆಚರಣಾ ವಿಧಾನ & ಸಂಪ್ರದಾಯ' : 'How it is Celebrated'}
              </h5>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {activeFestival.howCelebrated[currentLang]}
              </p>
            </div>
          </div>

          {/* Sacred Mantras */}
          {activeFestival.mantras && activeFestival.mantras.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-stone-850 border border-amber-300 dark:border-stone-700 shadow-xs space-y-3">
              <h5 className="font-bold text-xs font-mono uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಪವಿತ್ರ ಮಂತ್ರಗಳು & ಶ್ಲೋಕಗಳು' : 'Sacred Mantras & Stotras'}</span>
              </h5>

              <div className="space-y-2">
                {activeFestival.mantras.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800">
                    <p className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 text-center leading-relaxed">
                      {m[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pooja Vidhi Steps */}
          {activeFestival.poojaVidhi && activeFestival.poojaVidhi.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs space-y-3">
              <h5 className="font-bold text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200">
                {currentLang === 'kn' ? 'ಹಂತ-ಹಂತದ ಪೂಜಾ ವಿಧಾನ' : 'Step-by-Step Pooja Vidhi'}
              </h5>

              <div className="space-y-2 text-xs">
                {activeFestival.poojaVidhi.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {step[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
