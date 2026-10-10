import React, { useState } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Clock, 
  Compass, 
  Sparkles, 
  Bell, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  ShieldAlert, 
  Flame,
  Info,
  CheckSquare,
  Square,
  Sunrise,
  HeartHandshake
} from 'lucide-react';
import { CustomEventItem, Festival, Language, PanchangaDay } from '../types';
import { formatJustNumber, formatNumberWithEnglishBracket } from '../utils/panchanga';
import { MoonPhaseIcon } from './MoonPhaseIcon';

interface DayDetailModalProps {
  day: PanchangaDay | null;
  currentLang: Language;
  onClose: () => void;
  onSelectFestival: (festival: Festival) => void;
  customEvents: CustomEventItem[];
  onAddEvent: (event: CustomEventItem) => void;
  onDeleteEvent: (id: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  currentLang,
  onClose,
  onSelectFestival,
  customEvents,
  onAddEvent,
  onDeleteEvent
}) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'pooja' | 'vrat' | 'shraddha' | 'auspicious' | 'personal'>('pooja');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [checkedDailyItems, setCheckedDailyItems] = useState<Record<string, boolean>>({});
  const [showDailyRituals, setShowDailyRituals] = useState(true);

  if (!day) return null;

  const toggleDailyItem = (index: number) => {
    setCheckedDailyItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Standardized universal daily pooja items (Samagri) applicable for every day of the year
  const dailyPoojaItems = [
    {
      en: '1. Diya / Deepa: Brass/Silver/Clay Oil or Ghee lamp with cotton wicks (ದೀಪ)',
      kn: '೧. ದೀಪ: ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ ಅಥವಾ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಮತ್ತು ಹತ್ತಿಯ ಬತ್ತಿಗಳು',
      hi: '१. दीप: शुद्ध गौघृत अथवा तिल तेल का दीपक एवं रुई की बत्तियां'
    },
    {
      en: '2. Agarbatti & Dhoopa: Natural fragrance incense sticks & camphor (ಧೂಪ/ಅಗರಬತ್ತಿ)',
      kn: '೨. ಅಗರಬತ್ತಿ ಮತ್ತು ಧೂಪ: ಶುದ್ಧ ಸುಗಂಧ ಧೂಪ ಹಾಗೂ ಮಂಗಳಾರತಿ ಕರ್ಪೂರ',
      hi: '२. अगरबत्ती एवं धूप: सुगन्धित धूपबत्ती एवं कर्पूर'
    },
    {
      en: '3. Fresh Flowers & Tulasi: Freshly picked sacred flowers and Tulasi leaves (ಪುಷ್ಪ-ತುಳಸಿ)',
      kn: '೩. ತಾಜಾ ಪುಷ್ಪ ಮತ್ತು ತುಳಸಿ: ಪೂಜೆಗೆ ಅರ್ಪಿಸಲು ಪರಿಮಳಯುಕ್ತ ಹೂವುಗಳು ಹಾಗೂ ತುಳಸೀದಳ',
      hi: '३. ताजे पुष्प एवं तुलसी दल: पूजा हेतु सुगन्धित पुष्प व पवित्र तुलसी'
    },
    {
      en: '4. Sacred Kumkum, Chandana & Haldi: Pure Vermilion, Sandalwood paste, Turmeric (ಗಂಧ-ಕುಂಕುಮ)',
      kn: '೪. ಗಂಧ, ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ: ಶ್ರೀಗಂಧದ ಲೇಪನ, ಶುದ್ಧ ಅರಿಶಿನ ಹಾಗೂ ಕುಂಕುಮ',
      hi: '४. चन्दन, रोली एवं हल्दी: शुद्ध चन्दन लेप, कुंकुम व हल्दी'
    },
    {
      en: '5. Akshata: Sacred unbroken raw rice mixed with a pinch of turmeric and ghee (ಅಕ್ಷತೆ)',
      kn: '೫. ಅಕ್ಷತೆ: ಅರಿಶಿನ ಮತ್ತು ತುಪ್ಪ ಮಿಶ್ರಿತ ಮುರಿಯದ ಪವಿತ್ರ ಬಿಳಿ ಅಕ್ಕಿ',
      hi: '५. अक्षत: हल्दी मिश्रित अखण्ड चावल'
    },
    {
      en: '6. Sacred Water (Theertha Patra): Pure Ganga water or clean drinking water with Uddharane (ತೀರ್ಥ)',
      kn: '೬. ಪಂಚಪಾತ್ರೆ-ಉದ್ಧರಣೆ: ಶುದ್ಧ ತೀರ್ಥೋದಕ (ಗಂಗಾಜಲ) ಹಾಗೂ ಆಚಮನ ಪಾತ್ರೆ',
      hi: '६. पंचपात्र एवं आचमनी: शुद्ध जल एवं गंगाजल'
    },
    {
      en: '7. Naivedya & Prasadam: Fresh fruits, milk, raisins, dry fruits, or jaggery (ನೈವೇದ್ಯ)',
      kn: '೭. ಮಹಾ ನೈವೇದ್ಯ: ಬಾಳೆಹಣ್ಣು, ಹಾಲು, ಬೆಲ್ಲ, ಗೋಡಂಬಿ, ದ್ರಾಕ್ಷಿ ಅಥವಾ ಸಾತ್ವಿಕ ಪ್ರಸಾದ',
      hi: '७. नैवेद्य एवं प्रसाद: ऋतुफल, गौदुग्ध, गुड़, मिश्री अथवा सात्त्विक भोग'
    },
    {
      en: '8. Ghanti & Shankha: Sacred puja bell and conch shell (ಘಂಟೆ-ಶಂಖ)',
      kn: '೮. ಪೂಜಾ ಘಂಟೆ ಮತ್ತು ಶಂಖ: ಆರಾಧನೆಯ ವೇಳೆ ನಾದ ಮಾಡಲು ಪವಿತ್ರ ಗಂಟೆ',
      hi: '८. पूजा घण्टी एवं शंख: आरती के समय नाद हेतु पवित्र घंटी'
    }
  ];

  // Generic chronological morning ritual guide applicable for any day of the year
  const genericMorningRituals = [
    {
      step: 1,
      title: {
        en: 'Brahma Muhurta Awakening & Karadarshana (04:30 AM - 05:30 AM)',
        kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ ಜಾಗರಣೆ ಮತ್ತು ಕರದರ್ಶನ (೪:೩೦ AM - ೫:೩೦ AM)',
        hi: 'ब्रह्म मुहूर्त जागरण एवं करदर्शन (४:३० AM - ५:३೦ AM)'
      },
      desc: {
        en: 'Wake up before sunrise, look at palms reciting "Karagre Vasate Lakshmi...", touch mother Earth seeking forgiveness, and meditate on the Supreme.',
        kn: 'ಸೂರ್ಯೋದಯಕ್ಕಿಂತ ಮುಂಚೆ ಎದ್ದು "ಕರಾಗ್ರೇ ವಸತೇ ಲಕ್ಷ್ಮೀಃ..." ಹೇಳುತ್ತಾ ಅಂಗೈಗಳನ್ನು ದರ್ಶಿಸಿ, ಭೂಮಿದೇವಿಗೆ ಕ್ಷಮೆ ಯಾಚಿಸಿ ಈಶ್ವರ ಧ್ಯಾನ ಮಾಡುವುದು.',
        hi: 'सूर्योदय पूर्व उठकर "कराग्रे वसते लक्ष्मीः..." श्लोक से हथेलियों का दर्शन करें एवं भूमि वन्दना करें।'
      }
    },
    {
      step: 2,
      title: {
        en: 'Shaucha, Snana & Clean Clothing (05:30 AM - 06:15 AM)',
        kn: 'ಶೌಚ, ಶರೀರ ಶುದ್ಧಿ, ಸ್ನಾನ ಮತ್ತು ಶುದ್ಧ ವಸ್ತ್ರಧಾರಣೆ (೫:೩೦ AM - ೬:೧೫ AM)',
        hi: 'शौच, पवित्र स्नान एवं शुद्ध वस्त्र धारण (५:३० AM - ६:१५ AM)'
      },
      desc: {
        en: 'Take a purifying bath invoking sacred rivers (Ganga, Yamuna, Godavari). Wear clean, washed traditional clothes suitable for puja.',
        kn: 'ತಣ್ಣೀರು ಅಥವಾ ಬೆಚ್ಚಗಿನ ನೀರಿನಲ್ಲಿ "ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ..." ನದಿಸ್ಮರಣೆ ಮಾಡಿ ಸ್ನಾನ ಮುಗಿಸಿ ಶುದ್ಧ ಪೂಜಾ ವಸ್ತ್ರ ಧರಿಸುವುದು.',
        hi: 'पवित्र तीर्थों का स्मरण करते हुए स्नान करें तथा धुले हुए शुद्ध वस्त्र धारण करें।'
      }
    },
    {
      step: 3,
      title: {
        en: 'Surya Arghya & Gayatri Sandhyavandana (At Sunrise)',
        kn: 'ಸೂರ್ಯೋದಯ ಕಾಲದಲ್ಲಿ ಸೂರ್ಯಾರ್ಘ್ಯ ಮತ್ತು ಗಾಯತ್ರೀ ಸಂಧ್ಯಾವಂದನೆ (ಸೂರ್ಯೋದಯಕ್ಕೆ)',
        hi: 'सूर्योदय काल में सूर्यार्घ्य एवं गायत्री सन्ध्यावन्दन (सूर्योदय समय)'
      },
      desc: {
        en: 'Offer water to the rising Sun facing East with a copper pot, chanting the Gayatri Mantra (108 or 28 times) for wisdom and vitality.',
        kn: 'ಪೂರ್ವಾಭಿಮುಖವಾಗಿ ನಿಂತು ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಸೂರ್ಯದೇವನಿಗೆ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ, ಗಾಯತ್ರಿ ಜಪ ಅಥವಾ ಆದಿತ್ಯ ಹೃದಯ ಪಠಣ ಮಾಡುವುದು.',
        hi: 'ताम्रपात्र से पूर्व दिशा में भगवान सूर्य को अर्घ्य दें तथा गायत्री मन्त्र का जप करें।'
      }
    },
    {
      step: 4,
      title: {
        en: 'Deepa Prajvalana & Altar Cleansing (06:30 AM - 07:00 AM)',
        kn: 'ದೀಪ ಪ್ರಜ್ವಲನೆ ಮತ್ತು ದೇವರ ಮನೆ ಶುದ್ಧೀಕರಣ (೬:೩೦ AM - ೭:೦೦ AM)',
        hi: 'दीप प्रज्वलन एवं पूजा गृह शुद्धि (६:३० AM - ७:०० AM)'
      },
      desc: {
        en: 'Clean the puja mandir, wipe deity vigrahas, light the holy Ghee/Oil lamp and incense. Ring the bell reciting "Agamartham tu devanam...".',
        kn: 'ದೇವರ ಮಂಟಪವನ್ನು ಶುದ್ಧಗೊಳಿಸಿ, ದೇವರಿಗೆ ಹಳೆಯ ಹೂಗಳನ್ನು ತೆಗೆದು, ಶುದ್ಧ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ, ಘಂಟಾನಾದದೊಂದಿಗೆ ಪೂಜೆಗೆ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳುವುದು.',
        hi: 'पूजा स्थान को स्वच्छ कर, दीपक व अगरबत्ती प्रज्वलित करें एवं घंटी बजाकर देवों का आह्वान करें।'
      }
    },
    {
      step: 5,
      title: {
        en: 'Pancha Upachara Puja: Gandha, Pushpa, Dhoopa, Deepa, Naivedya',
        kn: 'ಪಂಚೋಪಚಾರ ನಿತ್ಯ ಪೂಜೆ: ಗಂಧ, ಪುಷ್ಪ, ಧೂಪ, ದೀಪ ಮತ್ತು ನೈವೇದ್ಯ',
        hi: 'पंचोपचार नित्य पूजन: गन्ध, पुष्प, धूप, दीप एवं नैवेद्य'
      },
      desc: {
        en: 'Apply Chandana & Kumkum, offer fresh flowers and Tulasi, show incense, wave the lamp, offer Naivedya (fruits/milk/sweets), and recite your daily stotras.',
        kn: 'ದೇವರಿಗೆ ಗಂಧ-ಕುಂಕುಮ ಹಚ್ಚಿ, ತಾಜಾ ಪುಷ್ಪ-ತುಳಸಿ ಅರ್ಪಿಸಿ, ಧೂಪ-ದೀಪ ತೋರಿಸಿ, ಹಣ್ಣು-ಹಾಲು ನೈವೇದ್ಯವಿಟ್ಟು, ಇಷ್ಟದೇವತಾ ಸ್ತೋತ್ರಗಳನ್ನು ಪಠಿಸುವುದು.',
        hi: 'देवप्रतिमाओं को चन्दन-कुंकुम लगाएं, पुष्प अर्पित करें, धूप-दीप दर्शन कराएं तथा सात्त्विक नैवेद्य समर्पित करें।'
      }
    },
    {
      step: 6,
      title: {
        en: 'Maha Mangalarati & Pradakshina (07:30 AM - 08:00 AM)',
        kn: 'ಮಹಾ ಮಂಗಳಾರತಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮತ್ತು ಪ್ರಸಾದ ಸ್ವೀಕಾರ',
        hi: 'महा मङ्गलारती, प्रदक्षिणा नमस्कार एवं प्रसाद ग्रहण'
      },
      desc: {
        en: 'Perform Karpura Aarti waving circular-wise with ringing bell, perform 3 self-circumambulations (Pradakshina), accept sacred water (Theertha) and Prasada.',
        kn: 'ಕರ್ಪೂರಾರತಿ ಬೆಳಗಿಸಿ, ೩ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ ಸಾಷ್ಟಾಂಗ ನಮಸ್ಕರಿಸಿ, ತೀರ್ಥ-ಪ್ರಸಾದವನ್ನು ಭಕ್ತಿಯಿಂದ ಸ್ವೀಕರಿಸಿ ದಿನದ ಕರ್ತವ್ಯಗಳಿಗೆ ಶುಭಾರಂಭ ಮಾಡುವುದು.',
        hi: 'कर्पूर आरती करें, परिक्रमा कर दण्डवत् प्रणाम करें, तथा तीर्थ एवं प्रसाद श्रद्धापूर्वक ग्रहण करें।'
      }
    }
  ];

  const dayEvents = customEvents.filter(e => e.date === day.gregorianDate);

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const item: CustomEventItem = {
      id: `evt-${Date.now()}`,
      date: day.gregorianDate,
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      category: newEventCategory,
      hasNotification: notificationEnabled
    };

    onAddEvent(item);
    setNewEventTitle('');
    setNewEventDesc('');
    setShowEventForm(false);
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationEnabled(true);
        new Notification('HCMM Vedic Panchanga Alert', {
          body: `Notification armed for Rahu Kaal (${day.rahuKaal.start}) & Gulika Kaal (${day.gulikaKaal.start})!`
        });
      }
    } else {
      setNotificationEnabled(!notificationEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-amber-200/80 dark:border-stone-700 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-amber-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {day.vara[currentLang]} • {day.gregorianDate}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight flex items-center gap-3">
                <span>{formatNumberWithEnglishBracket(day.day, currentLang)} {day.tithiName[currentLang]}</span>
                <MoonPhaseIcon 
                  paksha={day.paksha} 
                  tithiNumber={day.tithiNumber} 
                  size={26} 
                  currentLang={currentLang} 
                />
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 mt-1">
                {day.samvatsara[currentLang]} ಸಂವತ್ಸರ • {day.masa[currentLang]} ಮಾಸ ({day.pakshaName[currentLang]})
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800 dark:text-stone-200">
          
          {/* SPECIAL: Navaratri Day 1 Kalasha Sthapana & Ghatasthapana Mahavidhi */}
          {day.festivals.some(f => f.id === 'navaratri_day1') && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/15 via-amber-500/10 to-orange-500/15 border-2 border-red-500/40 dark:border-red-900 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-red-200 dark:border-red-900/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏺</span>
                  <div>
                    <h3 className="font-serif font-bold text-base text-red-900 dark:text-red-200">
                      {currentLang === 'kn' ? 'ನವರಾತ್ರಿ ಪ್ರಥಮ ದಿನ: ಕಲಶ ಸ್ಥಾಪನಾ (ಘಟಸ್ಥಾಪನಾ) ವಿವರಗಳು' : currentLang === 'hi' ? 'नवरात्रि प्रथम दिवस: कलश स्थापना (घटस्थापना) महाविधान' : 'Navaratri Day 1: Kalasha Sthapana (Ghatasthapana) Details'}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {currentLang === 'kn' ? 'ಆಶ್ವಯುಜ ಶುಕ್ಲ ಪಾಡ್ಯದಂದು ಶಕ್ತಿಮಾತೆಯ ಆಹ್ವಾನ ಹಾಗೂ ಪೂಜಾ ಕ್ರಮ' : 'Invocation of Goddess Durga into the sacred Kalasha on Pratipada'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-mono font-bold text-[11px] shadow-2xs">
                  {currentLang === 'kn' ? 'ಪಾಡ್ಯ ದಿನ ೧' : 'Pratipada Day 1'}
                </span>
              </div>

              {/* Muhurta Windows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-amber-300 dark:border-amber-800">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ಶುಭ ಅಭಿಜಿತ್ ಮುಹೂರ್ತ (ಶ್ರೇಷ್ಠ ಕಾಲ):' : 'Abhijit Muhurta (Supreme Window):'}
                  </span>
                  <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {day.abhijitMuhurta.start} - {day.abhijitMuhurta.end}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {currentLang === 'kn' ? 'ಮಧ್ಯಾಹ್ನದ ಶುಭ ಕಾಲ — ಕಲಶ ಪ್ರತಿಷ್ಠಾಪನೆಗೆ ಅತ್ಯಂತ ಪ್ರಶಸ್ತ.' : 'Midday window — Most auspicious for Kalasha Prathisthapana.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-amber-300 dark:border-amber-800">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    {currentLang === 'kn' ? 'ಪ್ರಾತಃಕಾಲ ಶುಭ ಮುಹೂರ್ತ:' : 'Morning Auspicious Window:'}
                  </span>
                  <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {day.sunrise} - 08:45 AM
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯದ ಶುಭ ಕಾಲ — ನವಧಾನ್ಯ ಬಿತ್ತನೆ & ಕಲಶ ಪೀಠ ಸಿದ್ಧತೆ.' : 'Sunrise auspicious window — Navadhanya sowing & peetha preparation.'}
                  </p>
                </div>
              </div>

              {/* Step-by-step Kalash Sthapana Vidhi */}
              <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-xs leading-relaxed space-y-2">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <span className="text-red-600 font-extrabold font-serif">೧.</span>
                  <span>{currentLang === 'kn' ? 'ಕಲಶ ಸ್ಥಾಪನಾ ಮುಖ್ಯ ಕ್ರಮ (Step-by-Step Vidhi):' : 'Step-by-step Kalasha Installation:'}</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-stone-700 dark:text-stone-300 text-[11.5px]">
                  <li>
                    {currentLang === 'kn' 
                      ? 'ನವಧಾನ್ಯ ವೇದಿ: ಮಣ್ಣಿನ ತಟ್ಟೆಯಲ್ಲಿ ಶುದ್ಧ ಮಣ್ಣು ಮತ್ತು ನವಧಾನ್ಯಗಳನ್ನು ಹರಡಿ ನೀರು ಸಿಂಪಡಿಸಿ.' 
                      : 'Prepare earthen tray with fertile soil, sow Navadhanya (9 sacred grains), and sprinkle water.'}
                  </li>
                  <li>
                    {currentLang === 'kn'
                      ? 'ಕಲಶ ಸಿದ್ಧತೆ: ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶಕ್ಕೆ ಕಂಕಣ (ದಾರ) ಕಟ್ಟಿ, ಗಂಗಾಜಲ ತುಂಬಿಸಿ, ಅಡಿಕೆ, ನಾಣ್ಯ, ಏಲಕ್ಕಿ ಹಾಕಿ.'
                      : 'Tie sacred red thread to copper/brass pot, fill with Ganga water, add intact supari, coins, and spices.'}
                  </li>
                  <li>
                    {currentLang === 'kn'
                      ? 'ಪಲ್ಲವ & ತೆಂಗಿನಕಾಯಿ: ಕಲಶದ ಬಾಯಿಗೆ ೫ ಮಾವಿನೆಲೆಗಳು ಅಥವಾ ವೀಳ್ಯದೆಲೆಗಳನ್ನು ಜೋಡಿಸಿ, ಅರಿಶಿನ-ಕುಂಕುಮ ಲೇಪಿತ ತೆಂಗಿನಕಾಯಿಯನ್ನು ಕೆಂಪು ರೇಷ್ಮೆ ವಸ್ತ್ರ ಸುತ್ತಿ ಇರಿಸಿ.'
                      : 'Place 5 mango/betel leaves at the rim, place unbroken coconut anointed with turmeric & vermilion wrapped in red silk.'}
                  </li>
                  <li>
                    {currentLang === 'kn'
                      ? 'ಅಖಂಡ ದೀಪ: ೯ ದಿನಗಳ ಕಾಲ ನಿರಂತರವಾಗಿ ಉರಿಯುವಂತೆ ಅಖಂಡ ತುಪ್ಪದ ದೀಪವನ್ನು ಬೆಳಗಿಸಿ.'
                      : 'Light the Akhanda Deepa (perennial sacred lamp) with pure cow ghee to burn for all 9 nights.'}
                  </li>
                </ul>

                {/* Kalasha Gayatri & Prathisthapana Mantra */}
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 mt-2">
                  <span className="text-[10.5px] font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                    {currentLang === 'kn' ? 'ಕಲಶ ಆವಾಹನಾ ಮಂತ್ರ (Kalasha Prathistha Mantra):' : 'Kalasha Prathistha Mantra:'}
                  </span>
                  <p className="font-serif text-[11px] font-bold text-stone-800 dark:text-stone-200 leading-normal">
                    {currentLang === 'kn' 
                      ? 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ | ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ || ಕುಕ್ಷೌ ತು ಸಾಗರಾಃ ಸರ್ವೇ ಸಪ್ತದ್ವೀಪಾ ವಸುಂಧರಾ | ಋಗ್ವೇದೋಥ ಯಜುರ್ವೇದಃ ಸಾಮವೇದೋ ಹ್ಯಥರ್ವಣಃ ||'
                      : 'Kalashasya Mukhe Vishnuh Kanthe Rudrah Samashritah | Mule Tatra Sthito Brahma Madhye Matriganaah Smritaah || Kukshau Tu Saagaraah Server Saptadveepaa Vasundharaa | Rigvedo-tha Yajurvedah Saamavedo Hyatharvanah ||'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Festivals on this day if any */}
          {day.festivals.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-orange-500/10 border border-amber-300 dark:border-amber-800">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {currentLang === 'kn' ? 'ಈ ದಿನದ ವಿಶೇಷ ಹಬ್ಬಗಳು / ಆಚರಣೆಗಳು:' : currentLang === 'hi' ? 'आज के विशेष पर्व:' : 'Festivals Today:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {day.festivals.map(fest => (
                  <button
                    key={fest.id}
                    onClick={() => onSelectFestival(fest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-transform hover:scale-105 flex items-center gap-1.5 ${fest.badgeBg}`}
                  >
                    <span>{fest.name[currentLang]}</span>
                    <span className="text-[10px] underline">
                      {currentLang === 'kn' ? '(ವಿವರ ನೋಡಿ)' : currentLang === 'hi' ? '(विवरण देखें)' : '(View Details)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sun Times & Dina Mana (Ahoratra Calculation) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1">
                <Sun className="w-4 h-4" />
                <span>{currentLang === 'kn' ? 'ಸೂರ್ಯೋದಯ (Suryodaya)' : currentLang === 'hi' ? 'सूर्योदय' : 'Sunrise'}</span>
              </div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                {day.sunrise}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                {currentLang === 'kn' ? 'ಮುಂದಿನ ದಿನದ ಸೂರ್ಯೋದಯ:' : currentLang === 'hi' ? 'अगला सूर्योदय:' : 'Next Sunrise:'} {day.nextDaySunrise}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-bold text-xs mb-1">
                <Moon className="w-4 h-4" />
                <span>{currentLang === 'kn' ? 'ಸೂರ್ಯಾಸ್ತ (Suryasta)' : currentLang === 'hi' ? 'सूर्यास्त' : 'Sunset'}</span>
              </div>
              <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                {day.sunset}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                {currentLang === 'kn' ? 'ಸಾಯಂಕಾಲ ಸಂಧ್ಯಾ ಕಾಲ' : currentLang === 'hi' ? 'सायं सन्ध्या काल' : 'Evening Sandhya'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-800/40">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold text-xs mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ದಿನಮಾನ (Dina Mana)' : currentLang === 'hi' ? 'दिनमान' : 'Day Length'}</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {Math.floor(day.dinaManaMinutes / 60)} hrs {day.dinaManaMinutes % 60} mins
              </div>
              <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mt-1 font-semibold">
                {day.dinaManaGhatis}
              </div>
            </div>
          </div>

          {/* Complete Panchanga 5 Limbs Breakdown */}
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider border-b border-stone-200 dark:border-stone-700 pb-2">
              {currentLang === 'kn' ? 'ಪಂಚಾಂಗದ ಪಂಚಾಂಗ ವಿವರಗಳು' : currentLang === 'hi' ? 'पंचांग के पांच अंग' : 'The Five Limbs of Panchanga'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ತಿಥಿ (Tithi):' : currentLang === 'hi' ? 'तिथि:' : 'Tithi:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {day.tithiName[currentLang]} ({formatJustNumber(day.tithiNumber, currentLang)})
                  </span>
                  <MoonPhaseIcon
                    paksha={day.paksha}
                    tithiNumber={day.tithiNumber}
                    size={16}
                    currentLang={currentLang}
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">Sanskrit: {day.tithiSanskrit}</span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ವಾರ (Vara):' : currentLang === 'hi' ? 'वार:' : 'Vara:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {day.vara[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ನಕ್ಷತ್ರ (Nakshatra):' : currentLang === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {day.nakshatra[currentLang]}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-medium">
                  ಅಕ್ಷರ: {day.charanaLetter}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಯೋಗ (Yoga):' : currentLang === 'hi' ? 'योग:' : 'Yoga:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.yoga[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಕರಣ (Karana):' : currentLang === 'hi' ? 'करण:' : 'Karana:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.karana[currentLang]}
                </span>
              </div>

              <div>
                <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                  {currentLang === 'kn' ? 'ಚಂದ್ರ ರಾಶಿ (Moon Sign):' : currentLang === 'hi' ? 'चन्द्र राशि:' : 'Moon Sign:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {day.chandraRashi[currentLang]} ({day.chandraRashiLord[currentLang]})
                </span>
              </div>
            </div>
          </div>

          {/* DAILY MUHURTA SECTION: Comprehensive Auspicious & Inauspicious Timings */}
          <div className="rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-stone-850 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-200 dark:border-stone-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>
                      {currentLang === 'kn' ? 'ದೈನಂದಿನ ಮುಹೂರ್ತಗಳು (Daily Muhurta)' : currentLang === 'hi' ? 'दैनिक मुहूर्त (Daily Muhurta)' : 'Daily Muhurta & Auspicious Timings'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold uppercase border border-emerald-300 dark:border-emerald-700">
                      Vedic Panchanga
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn'
                      ? 'ಈ ದಿನದ ಶುಭ ಮುಹೂರ್ತಗಳು (ಅಭಿಜಿತ್, ಅಮೃತ ಕಾಲ, ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ) ಮತ್ತು ಅಶುಭ ಕಾಲಗಳು (ರಾಹು, ಗುಳಿಕ, ಯಮಗಂಡ).'
                      : currentLang === 'hi'
                      ? 'आज के शुभ मुहूर्त (अभिजित, अमृत काल, ब्रह्म मुहूर्त) एवं अशुभ काल (राहु, गुलिक, यमगण्ड)।'
                      : 'Auspicious windows (Abhijit, Amrit Kaal, Brahma Muhurta) and inauspicious periods (Rahu, Gulika, Yamaganda).'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRequestNotification}
                className={`px-3 py-1.5 text-xs rounded-xl border flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs ${
                  notificationEnabled 
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-400'
                }`}
                title="Enable local reminder notifications for this day's planetary periods"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notificationEnabled ? 'Alerts Armed' : (currentLang === 'kn' ? 'ಎಚ್ಚರಿಕೆ ಸೂಚನೆ' : currentLang === 'hi' ? 'सूचना सेट करें' : 'Set Alerts')}</span>
              </button>
            </div>

            {/* Auspicious Muhurtas Grid (ಶುಭ ಮುಹೂರ್ತಗಳು) */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentLang === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತಗಳು (Auspicious Windows)' : currentLang === 'hi' ? 'शुभ मुहूर्त (Auspicious Windows)' : 'Auspicious Windows'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* 1. Abhijit Muhurta */}
                <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                        {currentLang === 'kn' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'अभिजित मुहूर्त' : 'Abhijit Muhurta'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 uppercase">
                        Shubh
                      </span>
                    </div>
                    <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                      {day.abhijitMuhurta.start} - {day.abhijitMuhurta.end}
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 mt-2 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ಮಧ್ಯಾಹ್ನದ ಸರ್ವಸಿದ್ಧಿ ಮುಹೂರ್ತ. ಪೂಜೆ, ಹೊಸ ಆರಂಭ ಹಾಗೂ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಅತ್ಯುತ್ಕೃಷ್ಟ.'
                      : currentLang === 'hi'
                      ? 'दोपहर का सर्वार्थ सिद्धि काल। समस्त शुभ कार्यों व पूजा हेतु उत्तम।'
                      : 'Midday solar victory window. Highly auspicious for commencing any new venture or sacred ritual.'}
                  </p>
                </div>

                {/* 2. Amrit Kaal */}
                <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                        {currentLang === 'kn' ? 'ಅಮೃತ ಕಾಲ' : currentLang === 'hi' ? 'अमृत काल' : 'Amrit Kaal'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 uppercase">
                        Amrita
                      </span>
                    </div>
                    <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                      {day.amritKaal?.start || '10:45 AM'} - {day.amritKaal?.end || '12:15 PM'}
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-2 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ನಕ್ಷತ್ರಾನುಸಾರ ಅಮೃತ ಘಳಿಗೆ. ಯಾವುದೇ ದೇವಕಾರ್ಯ, ಮಂತ್ರಾನುಷ್ಠಾನ, ಧನಲಾಭಕ್ಕೆ ಶ್ರೇಷ್ಠ.'
                      : currentLang === 'hi'
                      ? 'नक्षत्राधारित अमृत काल। पूजा, जप एवं विशेष मांगलिक कार्यों हेतु फलदायी।'
                      : 'Nectar period derived from Nakshatra transit. Auspicious for japa, remedies and financial investments.'}
                  </p>
                </div>

                {/* 3. Brahma Muhurta */}
                <div className="p-3.5 rounded-xl border border-teal-300 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-teal-900 dark:text-teal-200 text-sm">
                        {currentLang === 'kn' ? 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurta'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200 uppercase">
                        Sattva
                      </span>
                    </div>
                    <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                      {day.brahmaMuhurta.start} - {day.brahmaMuhurta.end}
                    </div>
                  </div>
                  <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 mt-2 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುಂಚಿನ ಪ್ರಶಾಂತ ಮುಂಜಾನೆ. ಧ್ಯಾನ, ವೇದಪಾಠ ಹಾಗೂ ಈಶ್ವರ ಸ್ಮರಣೆಗೆ ಪರಮೋತ್ಕೃಷ್ಟ.'
                      : currentLang === 'hi'
                      ? 'सूर्योदय से पूर्व का पावन काल। योग, प्राणायाम व ध्यान हेतु सर्वोत्तम।'
                      : 'Early dawn period before sunrise. Prime time for yoga, dhyana, and spiritual awakening.'}
                  </p>
                </div>

                {/* 4. Vijaya Muhurta */}
                <div className="p-3.5 rounded-xl border border-sky-300 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sky-900 dark:text-sky-200 text-sm">
                        {currentLang === 'kn' ? 'ವಿಜಯ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'विजय मुहूर्त' : 'Vijaya Muhurta'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200 uppercase">
                        Vijay
                      </span>
                    </div>
                    <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                      {day.vijayaMuhurta?.start || '02:15 PM'} - {day.vijayaMuhurta?.end || '03:03 PM'}
                    </div>
                  </div>
                  <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 mt-2 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ಅಪರಾಹ್ನದ ವಿಜಯ ಕಾಲ. ವ್ಯಾಪಾರ, ಪ್ರಯಾಣ ಹಾಗೂ ಜಯಾಪೇಕ್ಷಿತ ಕಾರ್ಯಗಳಿಗೆ ಶುಭ.'
                      : currentLang === 'hi'
                      ? 'अपराह्न का विजय काल। यात्रा व महत्वपूर्ण निर्णयों हेतु फलदायी।'
                      : 'Afternoon victory window. Excellent for negotiations, travel, and auspicious ventures.'}
                  </p>
                </div>

                {/* 5. Godhuli Muhurta */}
                <div className="p-3.5 rounded-xl border border-orange-300 dark:border-orange-800/60 bg-orange-50/70 dark:bg-orange-950/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-orange-900 dark:text-orange-200 text-sm">
                        {currentLang === 'kn' ? 'ಗೋಧೂಳಿ ಮುಹೂರ್ತ' : currentLang === 'hi' ? 'गोधूलि मुहूर्त' : 'Godhuli Muhurta'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 uppercase">
                        Sandhya
                      </span>
                    </div>
                    <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
                      {day.godhuliMuhurta?.start || '06:05 PM'} - {day.godhuliMuhurta?.end || '06:53 PM'}
                    </div>
                  </div>
                  <p className="text-[11px] text-orange-800/80 dark:text-orange-300/80 mt-2 leading-relaxed">
                    {currentLang === 'kn'
                      ? 'ಸಂಧ್ಯಾ ಕಾಲದ ಪವಿತ್ರ ಸಮಯ. ದೀಪ ಪ್ರಜ್ವಲನೆ, ಲಕ್ಷ್ಮೀ ಆರಾಧನೆ ಹಾಗೂ ಸಂಧ್ಯಾವಂದನೆಗೆ ಶ್ರೇಷ್ಠ.'
                      : currentLang === 'hi'
                      ? 'सायंकाल का पावन समय। दीप प्रज्वलन व सन्ध्या वन्दन हेतु श्रेष्ठ।'
                      : 'Twilight sunset window. Highly revered for lighting the evening lamp and Sandhyavandana.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Inauspicious Timelines (ಅಶುಭ ಕಾಲಗಳು: Rahu, Gulika, Yamaganda) */}
            <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-stone-700">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                <span>{currentLang === 'kn' ? 'ತ್ಯಾಜ್ಯ / ಅಶುಭ ಕಾಲಗಳು (Inauspicious Periods)' : currentLang === 'hi' ? 'वर्ज्य / अशुभ काल (Inauspicious Periods)' : 'Inauspicious Periods (Avoid Major Undertakings)'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Rahu Kaal */}
                <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-950/60 bg-red-50/60 dark:bg-red-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-red-800 dark:text-red-400 text-sm">
                      {currentLang === 'kn' ? 'ರಾಹು ಕಾಲ (Rahu Kaal)' : currentLang === 'hi' ? 'राहु काल' : 'Rahu Kaal'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200">
                      Varjya
                    </span>
                  </div>
                  <div className="font-mono font-bold text-base text-stone-900 dark:text-stone-100">
                    {day.rahuKaal.start} - {day.rahuKaal.end}
                  </div>
                  <div className="text-[10px] text-red-600/90 dark:text-red-300 mt-1 font-mono">
                    ಹಿಂದು ಕಾಲ: {day.rahuKaal.startGhati.split('(')[0]}
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                    {currentLang === 'kn' ? 'ಹೊಸ ಕೆಲಸ, ಖರೀದಿ ಹಾಗೂ ಪ್ರಯಾಣವನ್ನು ತಪ್ಪಿಸಬೇಕು.' : currentLang === 'hi' ? 'शुभ कार्य एवं नवीन आरम्भ वर्जित।' : 'Avoid starting new ventures or travel.'}
                  </p>
                </div>

                {/* Gulika Kaal */}
                <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-950/60 bg-amber-50/60 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-800 dark:text-amber-400 text-sm">
                      {currentLang === 'kn' ? 'ಗುಳಿಕ ಕಾಲ (Gulika Kaal)' : currentLang === 'hi' ? 'गुलिक काल' : 'Gulika Kaal'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      Manda
                    </span>
                  </div>
                  <div className="font-mono font-bold text-base text-stone-900 dark:text-stone-100">
                    {day.gulikaKaal.start} - {day.gulikaKaal.end}
                  </div>
                  <div className="text-[10px] text-amber-700/90 dark:text-amber-300 mt-1 font-mono">
                    ಹಿಂದು ಕಾಲ: {day.gulikaKaal.startGhati.split('(')[0]}
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                    {currentLang === 'kn' ? 'ಶನಿ ಪ್ರಭಾವಿತ ಅವಧಿ. ಪುನರಾವರ್ತನೆ ಬಯಸದ ಕಾರ್ಯ ತ್ಯಜಿಸಿ.' : currentLang === 'hi' ? 'शनि सम्बन्धी काल।' : 'Saturn sub-period.'}
                  </p>
                </div>

                {/* Yamaganda Kaal */}
                <div className="p-3.5 rounded-xl border border-blue-300 dark:border-blue-950/60 bg-blue-50/60 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-800 dark:text-blue-400 text-sm">
                      {currentLang === 'kn' ? 'ಯಮಗಂಡ ಕಾಲ (Yamaganda)' : currentLang === 'hi' ? 'यमगण्ड काल' : 'Yamaganda Kaal'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                      Ketu
                    </span>
                  </div>
                  <div className="font-mono font-bold text-base text-stone-900 dark:text-stone-100">
                    {day.yamagandaKaal.start} - {day.yamagandaKaal.end}
                  </div>
                  <div className="text-[10px] text-blue-700/90 dark:text-blue-300 mt-1 font-mono">
                    ಹಿಂದು ಕಾಲ: {day.yamagandaKaal.startGhati.split('(')[0]}
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                    {currentLang === 'kn' ? 'ಅನಿರೀಕ್ಷಿತ ಅಡೆತಡೆಗಳ ಕಾಲ.' : currentLang === 'hi' ? 'अड़चन सम्भव काल।' : 'Ketu sub-period; potential obstructions.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NEW FEATURE: Standardized Daily Rituals & Pooja Items (Applicable Every Day) */}
          <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-stone-850 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-amber-300/80 dark:border-stone-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                  <Sunrise className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? 'ದೈನಂದಿನ ನಿತ್ಯ ಪೂಜಾ ವಿಧಿ ಮತ್ತು ಸಾಮಗ್ರಿಗಳು' : currentLang === 'hi' ? 'दैनिक नित्य पूजा विधि एवं सामग्री' : 'Daily Rituals & Pooja Requirements'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold uppercase">
                      Universal Guide
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {currentLang === 'kn'
                      ? 'ವರ್ಷದ ಯಾವುದೇ ದಿನ ಪಾಲಿಸಬಹುದಾದ ಪ್ರಮಾಣಿತ ಪೂಜಾ ಪರಿಕರಗಳ ಪಟ್ಟಿ ಮತ್ತು ಮುಂಜಾನೆಯ ಹಂತ-ಹಂತದ ಪೂಜಾ ಮಾರ್ಗದರ್ಶಿ.'
                      : currentLang === 'hi'
                      ? 'वर्ष के प्रत्येक दिवस हेतु मानक पूजा सामग्री सूची एवं प्रातःकालीन नित्य पूजा की क्रमिक मार्गदर्शिका।'
                      : 'Standardized daily pooja essentials checklist and step-by-step generic morning ritual guide for any day of the year.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDailyRituals(!showDailyRituals)}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 underline hover:no-underline"
              >
                {showDailyRituals ? (currentLang === 'kn' ? 'ಮರೆಮಾಡು' : 'Hide') : (currentLang === 'kn' ? 'ತೋರಿಸು' : 'Show')}
              </button>
            </div>

            {showDailyRituals && (
              <div className="space-y-5 text-xs">
                {/* 1. Daily Pooja Requirements Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wide text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{currentLang === 'kn' ? 'ನಿತ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ (Checklist):' : currentLang === 'hi' ? 'नित्य पूजा सामग्री सूची:' : 'Daily Pooja Items (Samagri):'}</span>
                    </span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold font-mono">
                      {Object.values(checkedDailyItems).filter(Boolean).length} / {dailyPoojaItems.length} Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dailyPoojaItems.map((item, idx) => {
                      const isDone = !!checkedDailyItems[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleDailyItem(idx)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                            isDone
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                              : 'bg-white dark:bg-stone-800/70 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
                            {isDone ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-stone-400" />}
                          </span>
                          <span className={`leading-relaxed text-xs ${isDone ? 'line-through opacity-80' : 'font-medium'}`}>
                            {item[currentLang]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Step-by-Step Generic Morning Ritual Guide */}
                <div className="space-y-3 pt-2 border-t border-amber-200/80 dark:border-stone-700">
                  <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wide text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentLang === 'kn' ? 'ಮುಂಜಾನೆಯ ನಿತ್ಯ ಪೂಜಾ ಕ್ರಮ (Step-by-Step Morning Guide):' : currentLang === 'hi' ? 'प्रातःकालीन नित्य पूजन क्रम:' : 'Chronological Morning Ritual Procedure:'}</span>
                  </span>

                  <div className="space-y-2.5">
                    {genericMorningRituals.map((r) => (
                      <div
                        key={r.step}
                        className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-start gap-3 shadow-2xs"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          {r.step}
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold font-serif text-stone-900 dark:text-stone-100 text-xs text-amber-900 dark:text-amber-300">
                            {r.title[currentLang]}
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                            {r.desc[currentLang]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Custom Events & Scheduling for this day */}
          <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn' ? 'ನನ್ನ ವೈಯಕ್ತಿಕ ಪೂಜೆ / ಕಾರ್ಯಕ್ರಮಗಳು' : currentLang === 'hi' ? 'व्यक्तिगत पूजन एवं अनुष्ठान' : 'Custom Scheduled Events'}
                </span>
              </h4>

              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>

            {/* Event Form */}
            {showEventForm && (
              <form onSubmit={handleSaveEvent} className="p-3.5 rounded-xl border border-amber-300 dark:border-stone-700 bg-amber-50/40 dark:bg-stone-800/60 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Event Title (e.g. Satyanarayana Puja, Shraddha, Vrat)"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                  />

                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500 cursor-pointer"
                  >
                    <option value="pooja">Pooja / Seva (ಪೂಜೆ)</option>
                    <option value="vrat">Vrata / Upavasa (ವ್ರತ)</option>
                    <option value="shraddha">Shraddha / Tarpan (ಶ್ರಾದ್ಧ)</option>
                    <option value="auspicious">Auspicious Muhurtha (ಶುಭ ಕಾರ್ಯ)</option>
                    <option value="personal">Personal Note (ಟಿಪ್ಪಣಿ)</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Notes or mantras (optional)"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-amber-500"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-3 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            )}

            {/* List of Custom Events */}
            {dayEvents.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-1">
                No custom personal events scheduled for this day yet.
              </p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{evt.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {evt.category}
                        </span>
                      </div>
                      {evt.description && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 pl-4">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            {currentLang === 'kn' ? 'ಮುಚ್ಚಿ' : currentLang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
