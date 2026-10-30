import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Sun, 
  Moon, 
  Compass, 
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Bell,
  Settings,
  X,
  Check
} from 'lucide-react';
import { CityLocation, Language, LocalizedString, PanchangaDay } from '../types';
import { 
  getSandhyaNotificationConfig, 
  saveSandhyaNotificationConfig, 
  calculateAuspiciousWindowsForDay,
  triggerSandhyaNotificationTest,
  playSacredTempleBell,
  parseTimeStringToMinutes,
  AuspiciousAlertType,
  SandhyaNotificationConfig
} from '../utils/dailyNotification';

export interface SankalpaMuhurtaTimerProps {
  currentLang: Language;
  selectedCity: CityLocation;
  selectedDateStr: string; // YYYY-MM-DD
  panchangDay: PanchangaDay;
}

interface MuhurtaWindowItem {
  id: string;
  name: LocalizedString;
  category: 'auspicious' | 'inauspicious' | 'sandhya' | 'puja';
  startTimeStr: string;
  endTimeStr: string;
  significance: LocalizedString;
  recommendedAction: LocalizedString;
  shivaDeviFocus?: string;
  shivaDeviMantra?: string;
}

export const SankalpaMuhurtaTimer: React.FC<SankalpaMuhurtaTimerProps> = ({
  currentLang,
  selectedCity,
  selectedDateStr,
  panchangDay
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedWindowId, setSelectedWindowId] = useState<string>('pratah_sandhya');
  const [audioChimeEnabled, setAudioChimeEnabled] = useState<boolean>(true);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [testingAlertId, setTestingAlertId] = useState<string | null>(null);

  // Notification Config State
  const [notifConfig, setNotifConfig] = useState<SandhyaNotificationConfig>(() => getSandhyaNotificationConfig());
  
  // Custom Japa / Sankalpa hold timer
  const [customTimerSeconds, setCustomTimerSeconds] = useState<number>(300); // 5 mins default
  const [customTimerRunning, setCustomTimerRunning] = useState<boolean>(false);
  const [customTimerInitial, setCustomTimerInitial] = useState<number>(300);

  // Current real-time clock in user's selected city timezone
  const [currentCityTime, setCurrentCityTime] = useState<Date>(() => new Date());

  // 1-second interval ticker updating city time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom Sankalpa Meditation timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (customTimerRunning && customTimerSeconds > 0) {
      interval = setInterval(() => {
        setCustomTimerSeconds(prev => {
          if (prev <= 1) {
            setCustomTimerRunning(false);
            if (audioChimeEnabled) {
              playSacredTempleBell(3.5);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [customTimerRunning, customTimerSeconds, audioChimeEnabled]);

  // Formatted Local Time in City
  const cityTimeFormatted = useMemo(() => {
    try {
      const tz = selectedCity.timezone || 'Asia/Kolkata';
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      }).format(currentCityTime);
    } catch {
      return currentCityTime.toLocaleTimeString();
    }
  }, [currentCityTime, selectedCity.timezone]);

  // Current City Date string (YYYY-MM-DD)
  const cityDateYMD = useMemo(() => {
    try {
      const tz = selectedCity.timezone || 'Asia/Kolkata';
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const parts = formatter.formatToParts(currentCityTime);
      const y = parts.find(p => p.type === 'year')?.value || '';
      const m = parts.find(p => p.type === 'month')?.value || '';
      const d = parts.find(p => p.type === 'day')?.value || '';
      return `${y}-${m}-${d}`;
    } catch {
      return selectedDateStr;
    }
  }, [currentCityTime, selectedCity.timezone, selectedDateStr]);

  // Dynamic Sandhyavandana & Shiva/Devi Puja windows derived from location sunrise/sunset
  const calculatedWindows = useMemo(() => {
    const parts = selectedDateStr.split('-');
    const targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return calculateAuspiciousWindowsForDay(targetDate, selectedCity);
  }, [selectedDateStr, selectedCity]);

  // Complete List of Muhurta windows with strong Shiva & Devi Pooja linking
  const muhurtaWindows: MuhurtaWindowItem[] = useMemo(() => {
    const pratahWin = calculatedWindows.find(w => w.id === 'pratah_sandhya');
    const brahmaWin = calculatedWindows.find(w => w.id === 'brahma_muhurta');
    const madhyahnaWin = calculatedWindows.find(w => w.id === 'madhyahnika_sandhya');
    const sayamWin = calculatedWindows.find(w => w.id === 'sayam_sandhya');
    const pradoshaWin = calculatedWindows.find(w => w.id === 'shiva_pradosha_puja');
    const deviWin = calculatedWindows.find(w => w.id === 'devi_sandhya_deepa');

    return [
      {
        id: 'pratah_sandhya',
        name: {
          kn: '🌅 ಪ್ರಾತಃ ಸಂಧ್ಯಾವಂದನ & ಶಿವ ಗಾಯತ್ರೀ',
          hi: '🌅 प्रातः संध्यावन्दन एवं शिव-गायत्री',
          en: '🌅 Pratah Sandhya & Shiva Gayatri'
        },
        category: 'sandhya',
        startTimeStr: pratahWin?.startTimeStr || '05:45 AM',
        endTimeStr: pratahWin?.endTimeStr || '06:30 AM',
        significance: {
          kn: 'ಸೂರ್ಯೋದಯದ ಪವಿತ್ರ ಸಂಧಿಕಾಲ; ಪ್ರಾತಃ ಸಂಧ್ಯಾವಂದನೆ, ಅರ್ಘ್ಯ ಪ್ರದಾನ ಹಾಗೂ ಶಿವ-ಶಕ್ತಿ ಧ್ಯಾನಕ್ಕೆ ಪರಮ ಪುಣ್ಯಪ್ರದ.',
          hi: 'सूर्योदय की पावन सन्धि वेला; प्रातः अर्घ्य, संध्यावन्दन एवं शिव-शक्ति ध्यान हेतु सर्वश्रेष्ठ।',
          en: 'Dawn twilight junction; ideal for Pratah Sandhyavandana, Gayatri japa, and Shiva-Devi morning prayers.'
        },
        recommendedAction: {
          kn: 'ಉದಯೋನ್ಮುಖ ಸೂರ್ಯನಿಗೆ ಪ್ರಾತಃ ಅರ್ಘ್ಯ ಸಮರ್ಪಿಸಿ, ಶಿವ-ಗಾಯತ್ರೀ ಹಾಗೂ ಸಾವಿತ್ರೀ ಗಾಯತ್ರೀ ಜಪ ಪೂರೈಸಿ.',
          hi: 'उदयगामी सूर्य को प्रातः अर्घ्य दें, शिव-गायत्री व सावित्री गायत्री जप सम्पन्न करें।',
          en: 'Offer sacred morning Arghya, chant Shiva Gayatri (Om Tatpurushaya Vidmahe) and invoke inner light.'
        },
        shivaDeviMantra: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥'
      },
      {
        id: 'brahma',
        name: {
          kn: '✨ ಬ್ರಹ್ಮ ಮುಹೂರ್ತ (ಶಿವ-ಶಕ್ತಿ ಪ್ರಾತಃಕಾಲ)',
          hi: '✨ ब्रह्म मुहूर्त (शिव-शक्ति प्रातःकाल)',
          en: '✨ Brahma Muhurta (Pre-Dawn)'
        },
        category: 'auspicious',
        startTimeStr: brahmaWin?.startTimeStr || panchangDay.brahmaMuhurta?.start || '04:30 AM',
        endTimeStr: brahmaWin?.endTimeStr || panchangDay.brahmaMuhurta?.end || '05:18 AM',
        significance: {
          kn: 'ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುನ್ನ ಸತ್ವಗುಣ ಪ್ರಧಾನ ಕಾಲ; ಉಮಾ-ಮಹೇಶ್ವರ ಧ್ಯಾನ, ಆಚಮನ ಹಾಗೂ ಪ್ರಾಣಾಯಾಮಕ್ಕೆ ಶ್ರೇಷ್ಠ.',
          hi: 'सूर्योदय पूर्व सात्विक बेला; उमा-महेश्वर ध्यान, आचमन एवं प्राणायाम हेतु श्रेष्ठ।',
          en: 'Pre-dawn divine stillness; ideal for Shiva-Devi meditation and pure vow inception.'
        },
        recommendedAction: {
          kn: 'ಸ್ನಾನ-ಶುದ್ಧರಾಗಿ ಶಿವ-ಪಾರ್ವತೀ ಪ್ರಾತಃಸ್ಮರಣೆ, ಮಹಾ ಮೃತ್ಯುಂಜಯ ಜಪ ಹಾಗೂ ಧ್ಯಾನ ಕೈಗೊಳ್ಳಿ.',
          hi: 'स्नान कर शिव-पार्वती प्रातःस्मरण, महामृत्युंजय मन्त्र जप एवं ध्यान करें।',
          en: 'Perform holy Achamana, Pranayama, and chant Maha Mrityunjaya Mantra.'
        },
        shivaDeviMantra: 'ॐ नमः शिवाय । ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ॥'
      },
      {
        id: 'abhijit',
        name: {
          kn: '☀️ ಮಾಧ್ಯಾಹ್ನಿಕ ಸಂಧ್ಯಾ & ಅಭಿಜಿತ್ ಪೂಜೆ',
          hi: '☀️ माध्याह्न संध्या एवं अभिजित पूजा',
          en: '☀️ Madhyahnika Sandhya & Abhijit'
        },
        category: 'auspicious',
        startTimeStr: madhyahnaWin?.startTimeStr || panchangDay.abhijitMuhurta?.start || '11:45 AM',
        endTimeStr: madhyahnaWin?.endTimeStr || panchangDay.abhijitMuhurta?.end || '12:35 PM',
        significance: {
          kn: 'ಮಧ್ಯಾಹ್ನದ ಪರಮ ಮಂಗಳಕರ ಕಾಲ; ಮಾಧ್ಯಾಹ್ನಿಕ ಸಂಧ್ಯಾ, ಕಲಶ ಸ್ಥಾಪನೆ ಹಾಗೂ ಸದಾಶಿವ-ದುರ್ಗಾ ಸಂಕಲ್ಪಕ್ಕೆ ಸರ್ವಶ್ರೇಷ್ಠ.',
          hi: 'मध्याह्न का सर्वश्रेष्ठ मुहूर्त; माध्याह्न संध्या, कलश स्थापना एवं शिव-दुर्गा संकल्प हेतु अति शुभ।',
          en: 'Peak auspicious midday window; eradicates planetary blemishes for Shiva-Devi Sankalpa.'
        },
        recommendedAction: {
          kn: 'ಈ ಸಮಯದಲ್ಲಿ ಮಾಧ್ಯಾಹ್ನಿಕ ಸಂಧ್ಯಾ ಮುಗಿಸಿ, ಶಿವ-ಶಕ್ತಿ ಸಂಕಲ್ಪ ಮಂತ್ರ ಪಠಿಸಿ ಕಲಶ/ದೀಪ ಸ್ಥಾಪನೆ ಮಾಡಿ.',
          hi: 'माध्याह्न संध्या पूर्ण कर शिव-शक्ति संकल्प पाठ व कलश/दीप स्थापना करें।',
          en: 'Commence your Shiva-Shakti Sankalpa, Madhyahnika Arghya, and sacred installations.'
        },
        shivaDeviMantra: 'ॐ साम्बसदाशिवाय दुर्गापरमेश्वर्यै नमः ।'
      },
      {
        id: 'amrit',
        name: {
          kn: '🍯 ಅಮೃತ ಕಾಲ (ಶಿವ-ದುರ್ಗಾ ನೈವೇದ್ಯ)',
          hi: '🍯 अमृत काल (शिव-दुर्गा नैवेद्य)',
          en: '🍯 Amrit Kaal (Nectar Window)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.amritKaal?.start || '02:15 PM',
        endTimeStr: panchangDay.amritKaal?.end || '03:45 PM',
        significance: {
          kn: 'ಅಮೃತ ತರಂಗಗಳ ಶುಭ ಕಾಲ; ನೈವೇದ್ಯ ಸಮರ್ಪಣೆ, ಮಹಾಮಂತ್ರ ಜಪ ಮತ್ತು ಧ್ಯಾನಕ್ಕೆ ಅತ್ಯಂತ ಫಲದಾಯಕ.',
          hi: 'अमृत ऊर्जा का काल; नैवेद्य अर्पण, मन्त्र जप एवं ध्यान हेतु अत्यंत फलदायी।',
          en: 'Nectarine celestial flow; enhances spiritual retention and brings divine tranquility.'
        },
        recommendedAction: {
          kn: 'ಸಾಂಬಸದಾಶಿವ ಹಾಗೂ ಶ್ರೀ ದುರ್ಗಾ ದೇವಿಯ ದಿವ್ಯ ನಾಮ ಜಪಿಸಿ ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ.',
          hi: 'साम्बसदाशिव एवं श्री दुर्गा जी के दिव्य मन्त्र जप व नैवेद्य अर्पण करें।',
          en: 'Engage in dedicated Shiva-Durga mantra chanting and offer consecrated Naivedya.'
        },
        shivaDeviMantra: 'ॐ ह्रीं श्रीं क्लीं दुर्गतिनाशिन्यै महादुर्गायै नमः ॥'
      },
      {
        id: 'vijaya',
        name: {
          kn: '⚔️ ವಿಜಯ ಮುಹೂರ್ತ (ಅಪರಾಜಿತಾ ಪೂಜೆ)',
          hi: '⚔️ विजय मुहूर्त (अपराजिता पूजा)',
          en: '⚔️ Vijaya Muhurta (Victory)'
        },
        category: 'auspicious',
        startTimeStr: panchangDay.vijayaMuhurta?.start || '02:00 PM',
        endTimeStr: panchangDay.vijayaMuhurta?.end || '02:48 PM',
        significance: {
          kn: 'ಸರ್ವ ಕಾರ್ಯಗಳಲ್ಲಿ ಜಯ ತರುವ ಅಪರಾಹ್ನ ಕಾಲ; ಅಪರಾಜಿತಾ ದೇವೀ ಮತ್ತು ರುದ್ರಾಭಿಷೇಕ ಸಂಕಲ್ಪಕ್ಕೆ ಶ್ರೇಷ್ಠ.',
          hi: 'सर्व कार्य सिद्धि प्रदायक समय; अपराजिता देवी व रुद्राभिषेक संकल्प हेतु विशेष अनुकूल।',
          en: 'Victory window; dissolves persistent obstacles through divine grace of Devi Aparajita & Shiva.'
        },
        recommendedAction: {
          kn: 'ಸಂಕಲ್ಪ ಸಿದ್ಧಿಗಾಗಿ ಅಪರಾಜಿತಾ ದುರ್ಗಾ ಸ್ತೋತ್ರ ಪಠಿಸಿ ಪುಷ್ಪಾರ್ಪಣೆ ಮಾಡಿ.',
          hi: 'संकल्प सिद्धि हेतु अपराजिता स्तोत्र पाठ एवं पुष्पांजलि करें।',
          en: 'Offer Pushpanjali for successful culmination of your spiritual enterprise.'
        },
        shivaDeviMantra: 'अपराजितायै विद्महे जयदायै धीमहि । तन्नो देवी प्रचोदयात् ॥'
      },
      {
        id: 'sayam_sandhya',
        name: {
          kn: '🪔 ಸಾಯಂ ಸಂಧ್ಯಾವಂದನ & ಗೋಧೂಳಿ ಸಂಜೆ',
          hi: '🪔 सायं संध्यावन्दन एवं गोधूलि वेला',
          en: '🪔 Sayam Sandhya & Godhuli Dusk'
        },
        category: 'sandhya',
        startTimeStr: sayamWin?.startTimeStr || panchangDay.godhuliMuhurta?.start || '05:55 PM',
        endTimeStr: sayamWin?.endTimeStr || panchangDay.godhuliMuhurta?.end || '06:25 PM',
        significance: {
          kn: 'ಸೂರ್ಯಾಸ್ತದ ಮಂಗಳ ಸಂಧ್ಯಾ ಕಾಲ; ಸಾಯಂ ಸಂಧ್ಯಾವಂದನೆ, ಗಾಯತ್ರೀ ಜಪ ಹಾಗೂ ದೇವೀ ಪ್ರಣಾಮಕ್ಕೆ ಶ್ರೇಷ್ಠ.',
          hi: 'सूर्यास्त कालीन पावन समय; सायं संध्या, गायत्री जप एवं देवी प्रणाम हेतु उत्तम।',
          en: 'Twilight dusk window; revered for evening Sandhya, Arghya oblation, and lamp veneration.'
        },
        recommendedAction: {
          kn: 'ಸೂರ್ಯಾಸ್ತಕ್ಕೆ ಮುನ್ನ ಸಾಯಂ ಅರ್ಘ್ಯ ನೀಡಿ, ಗಾಯತ್ರೀ ಜಪಿಸಿ, ದೇವೀ ದುರ್ಗಾ ಗಾಯತ್ರೀ ಪಠಿಸಿ.',
          hi: 'सूर्यास्त पूर्व सायं अर्घ्य देकर गायत्री एवं दुर्गा गायत्री जप करें।',
          en: 'Offer evening Arghya before sunset, chanting Gayatri and lighting the sacred lamp.'
        },
        shivaDeviMantra: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥'
      },
      {
        id: 'pradosha',
        name: {
          kn: '🔱 ಪಾವನ ಪ್ರದೋಷ ಕಾಲ (ಶಿವ ಪೂಜೆ)',
          hi: '🔱 पावन प्रदोष काल (शिव पूजन)',
          en: '🔱 Sacred Pradosha Kaal (Shiva Puja)'
        },
        category: 'puja',
        startTimeStr: pradoshaWin?.startTimeStr || '05:40 PM',
        endTimeStr: pradoshaWin?.endTimeStr || '06:45 PM',
        significance: {
          kn: 'ಸೂರ್ಯಾಸ್ತದ ೪೫ ನಿಮಿಷಗಳ ಸಂಧಿಕಾಲ; ಸದಾಶಿವನ ನಂದಿ ವಾಹನ ನೃತ್ಯ ಕಾಲ ಹಾಗೂ ಬಿಲ್ವಾರ್ಚನೆಗೆ ಪರಮ ಪುಣ್ಯಪ್ರದ.',
          hi: 'सूर्यास्त के ४५ मिनट पूर्व-पश्चात्; सदाशिव की नन्दी नृत्य वेला, बिल्वार्चना हेतु परम पावन।',
          en: '45 mins around Sunset; sublime window for Lord Shiva’s blessing and Bilva leaf worship.'
        },
        recommendedAction: {
          kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಜಲಾಭಿಷೇಕ/ಬಿಲ್ವಾರ್ಚನೆ ಮಾಡಿ, ರುದ್ರ ಗಾಯತ್ರೀ ಜಪಿಸಿ ಪ್ರದೋಷ ದೀಪ ಬೆಳಗಿಸಿ.',
          hi: 'शिवलिंग पर जलाभिषेक व बिल्वपत्र अर्पित करें, रुद्राक्ष माला से ॐ नमः शिवाय जपें।',
          en: 'Offer holy water and Bilva leaves to Shiva, lighting the sacred Pradosha lamp.'
        },
        shivaDeviMantra: 'ॐ नमः शिवाय । कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम् ॥'
      },
      {
        id: 'devi_deepa',
        name: {
          kn: '🌺 ದೇವೀ ದುರ್ಗಾ ಸಂಧ್ಯಾ & ದೀಪಾರಾಧನೆ',
          hi: '🌺 देवी दुर्गा संध्या एवं दीपाराधना',
          en: '🌺 Devi Durga Sandhya & Deepa'
        },
        category: 'puja',
        startTimeStr: deviWin?.startTimeStr || '06:10 PM',
        endTimeStr: deviWin?.endTimeStr || '06:40 PM',
        significance: {
          kn: 'ಸಂಜೆ ದೀಪ ಬೆಳಗುವ ಪಾವನ ಕಾಲ; ಲಕ್ಷ್ಮೀ-ಪಾರ್ವತೀ ಆರಾಧನೆ, ಮಂಗಳಾರತಿ ಮತ್ತು ಲಲಿತಾ ಸ್ತೋತ್ರಕ್ಕೆ ಪ್ರಶಸ್ತ.',
          hi: 'संध्या दीप प्रज्वलन समय; लक्ष्मी-पार्वती आराधना, आरती व ललिता स्तोत्र हेतु श्रेष्ठ।',
          en: 'Sacred dusk hour for lighting home altars and invoking divine abundance & auspiciousness.'
        },
        recommendedAction: {
          kn: 'ಪೂಜಾ ಮಂದಿರದಲ್ಲಿ ತುಪ್ಪ/ಎಣ್ಣೆ ದೀಪ ಬೆಳಗಿಸಿ, ಮಂಗಳಾರತಿ ಮಾಡಿ ದುರ್ಗಾ ದೀಪ ಮಂತ್ರ ಪಠಿಸಿ.',
          hi: 'पूजा मन्दिर में घृत दीप प्रज्वलित कर आरती करें व दीपज्योति मन्त्र पाठ करें।',
          en: 'Light the sacred altar lamp, wave camphor Arati, and chant auspicious Devi stotrams.'
        },
        shivaDeviMantra: 'शुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥'
      },
      {
        id: 'rahu',
        name: {
          kn: '⚠️ ರಾಹು ಕಾಲ (ತ್ಯಾಜ್ಯ/ಎಚ್ಚರಿಕೆ)',
          hi: '⚠️ राहु काल (वर्ज्य समय)',
          en: '⚠️ Rahu Kaal (Inauspicious Period)'
        },
        category: 'inauspicious',
        startTimeStr: panchangDay.rahuKaal?.start || '04:30 PM',
        endTimeStr: panchangDay.rahuKaal?.end || '06:00 PM',
        significance: {
          kn: 'ಅಶುಭ ಕಾಲಾವಧಿ; ಈ ಸಮಯದಲ್ಲಿ ಹೊಸ ಸಂಕಲ್ಪ, ಕಲಶ ಸ್ಥಾಪನೆ ಆರಂಭಿಸಬಾರದು.',
          hi: 'अशुभ वेला; इस समय में नया संकल्प अथवा कलश स्थापना न करें।',
          en: 'Inauspicious window; do not begin primary Sankalpa or installations.'
        },
        recommendedAction: {
          kn: 'ಕೇವಲ ದುರ್ಗಾ ಬೀಜ ಮಂತ್ರ (ಓಂ ದುಂ ದುರ್ಗಾಯೈ ನಮಃ) ಅಥವಾ ನಮಃ ಶಿವಾಯ ಪಠಿಸಿ; ಶಾಂತತೆಯಿಂದ ಇರಿ.',
          hi: 'केवल दुर्गा बीज मन्त्र (ॐ दुं दुर्गायै नमः) अथवा नमः शिवाय जपें; शान्त रहें।',
          en: 'Chant Om Dum Durgayai Namah or Namah Shivaya peacefully; avoid starting new ventures.'
        },
        shivaDeviMantra: 'ॐ दुं दुर्गायै नमः ।'
      }
    ];
  }, [panchangDay, calculatedWindows]);

  const activeWindowItem = muhurtaWindows.find(w => w.id === selectedWindowId) || muhurtaWindows[0];

  // Calculate real-time status of the selected Muhurta window
  const windowStatus = useMemo(() => {
    const tz = selectedCity.timezone || 'Asia/Kolkata';
    const nowParts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(currentCityTime);

    const nowH = parseInt(nowParts.find(p => p.type === 'hour')?.value || '0', 10);
    const nowM = parseInt(nowParts.find(p => p.type === 'minute')?.value || '0', 10);
    const nowS = parseInt(nowParts.find(p => p.type === 'second')?.value || '0', 10);
    const nowSecondsInDay = nowH * 3600 + nowM * 60 + nowS;

    const startMin = parseTimeStringToMinutes(activeWindowItem.startTimeStr);
    const endMin = parseTimeStringToMinutes(activeWindowItem.endTimeStr);
    const startSec = startMin * 60;
    const endSec = endMin * 60;

    const isTodayInCity = selectedDateStr === cityDateYMD;

    let state: 'active' | 'upcoming' | 'passed' = 'upcoming';
    let remainingSeconds = 0;
    const totalWindowDuration = Math.max(60, endSec - startSec);
    let elapsedPercent = 0;

    if (!isTodayInCity) {
      state = selectedDateStr > cityDateYMD ? 'upcoming' : 'passed';
      remainingSeconds = 0;
    } else {
      if (nowSecondsInDay >= startSec && nowSecondsInDay <= endSec) {
        state = 'active';
        remainingSeconds = endSec - nowSecondsInDay;
        const elapsed = nowSecondsInDay - startSec;
        elapsedPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalWindowDuration) * 100)));
      } else if (nowSecondsInDay < startSec) {
        state = 'upcoming';
        remainingSeconds = startSec - nowSecondsInDay;
      } else {
        state = 'passed';
        remainingSeconds = 0;
        elapsedPercent = 100;
      }
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;

    return {
      state,
      isTodayInCity,
      remainingSeconds,
      hours: String(hours).padStart(2, '0'),
      mins: String(mins).padStart(2, '0'),
      secs: String(secs).padStart(2, '0'),
      elapsedPercent,
      startSec,
      endSec
    };
  }, [activeWindowItem, currentCityTime, selectedCity.timezone, selectedDateStr, cityDateYMD]);

  // Handle saving notification preferences
  const handleToggleAlert = (alertType: AuspiciousAlertType) => {
    const updated = {
      ...notifConfig,
      activeAlertTypes: notifConfig.activeAlertTypes.includes(alertType)
        ? notifConfig.activeAlertTypes.filter(t => t !== alertType)
        : [...notifConfig.activeAlertTypes, alertType]
    };
    setNotifConfig(updated);
    saveSandhyaNotificationConfig(updated);
  };

  const handleSetAdvanceMinutes = (mins: number) => {
    const updated = { ...notifConfig, advanceMinutes: mins };
    setNotifConfig(updated);
    saveSandhyaNotificationConfig(updated);
  };

  const handleToggleMasterEnabled = () => {
    const updated = { ...notifConfig, enabled: !notifConfig.enabled };
    setNotifConfig(updated);
    saveSandhyaNotificationConfig(updated);
  };

  const handleTestAlert = async (alertType: AuspiciousAlertType) => {
    setTestingAlertId(alertType);
    await triggerSandhyaNotificationTest(alertType, selectedCity, currentLang);
    setTimeout(() => setTestingAlertId(null), 1500);
  };

  return (
    <div className="no-print my-4 w-full">
      <div className="rounded-3xl border-2 border-amber-500/70 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white shadow-2xl p-3 sm:p-5 relative overflow-hidden transition-all">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Title, City Clock & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
          
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-lg shadow-md shrink-0 ring-2 ${
              activeWindowItem.category === 'inauspicious'
                ? 'bg-rose-600/30 ring-rose-500/50 text-rose-300'
                : 'bg-amber-500/20 ring-amber-400/40 text-amber-300'
            }`}>
              <TimerIcon className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {currentLang === 'kn' ? 'ಮುಹೂರ್ತ ಕ್ಷಣಗಣನೆ' : currentLang === 'hi' ? 'मुहूर्त उल्टी गिनती' : 'Muhurta Countdown'}
                </span>

                <span className="text-[10px] sm:text-xs font-mono text-stone-300 flex items-center gap-1">
                  <span>📍 {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name}</span>
                  <span className="text-amber-400 font-bold">({cityTimeFormatted})</span>
                </span>
              </div>

              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-200 mt-0.5 break-words">
                {activeWindowItem.name[currentLang]}
              </h3>
            </div>
          </div>

          {/* Right Action Icons: Sandhya Alerts Config, Sound Chime Toggle & Expand Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
            
            {/* Sandhya & Puja Alerts Configuration Button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-amber-400/60 bg-gradient-to-r from-amber-600 to-rose-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all cursor-pointer"
              title="Configure Sandhyavandana & Shiva/Devi Puja Recurring Alerts"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
              <span className="text-[11px] font-mono">
                {currentLang === 'kn' ? 'ಸಂಧ್ಯಾ ಅಲರ್ಟ್' : currentLang === 'hi' ? 'संध्या सूचना' : 'Sandhya Alerts'}
              </span>
            </button>

            {/* Audio Bell Chime Toggle */}
            <button
              onClick={() => setAudioChimeEnabled(!audioChimeEnabled)}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                audioChimeEnabled
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                  : 'border-stone-700 bg-stone-800 text-stone-400'
              }`}
              title="Temple Bell Chime alert when window starts"
            >
              {audioChimeEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline text-[11px] font-mono">Chime</span>
            </button>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-700 bg-stone-850 hover:bg-stone-800 text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title={isExpanded ? 'Collapse Timer' : 'Expand Full Muhurta Panel'}
            >
              <span className="hidden sm:inline text-[11px] font-semibold">{isExpanded ? 'Compact' : 'Expand'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Dynamic Countdown Section (Adjusts smoothly down to 320px mobile screens) */}
        <div className="py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Digital Segmented Countdown Cards */}
          <div className="space-y-2">
            
            <div className="flex items-center gap-2 flex-wrap">
              {windowStatus.state === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentLang === 'kn' ? '🔴 ಸದ್ಯ ಚಾಲ್ತಿಯಲ್ಲಿದೆ (ACTIVE NOW)' : currentLang === 'hi' ? '🔴 वर्तमान में सक्रिय' : '🔴 ACTIVE NOW'}</span>
                </span>
              ) : windowStatus.state === 'upcoming' ? (
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'kn' ? '⏳ ಪ್ರಾರಂಭವಾಗಲಿದೆ (STARTS IN)' : currentLang === 'hi' ? '⏳ प्रारम्भ होने में शेष' : '⏳ STARTS IN'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-stone-800 text-stone-400 border border-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentLang === 'kn' ? '✓ ಇಂದಿಗೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ' : currentLang === 'hi' ? '✓ आज समाप्त हो चुका है' : '✓ ENDED TODAY'}</span>
                </span>
              )}

              <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-300/90">
                {activeWindowItem.startTimeStr} - {activeWindowItem.endTimeStr}
              </span>
            </div>

            {/* Segmented Digital Flip Clock Displays with Sacred Animated Diya */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
              
              {/* Sacred Animated Diya (Jyoti) */}
              <div className="hidden xs:flex flex-col items-center justify-center p-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <svg viewBox="0 0 40 50" className="w-8 h-10 select-none">
                  <defs>
                    <radialGradient id="jyoti-glow" cx="50%" cy="40%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Aura Glow */}
                  <circle cx="20" cy="18" r="14" fill="url(#jyoti-glow)">
                    <animate attributeName="r" values="12;16;12" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  {/* Flame outer */}
                  <path
                    d="M20,6 C16,13 13,19 14,25 C15,30 18,32 20,32 C22,32 25,30 26,25 C27,19 24,13 20,6 Z"
                    fill="#f59e0b"
                  >
                    <animate attributeName="d" values="M20,6 C16,13 13,19 14,25 C15,30 18,32 20,32 C22,32 25,30 26,25 C27,19 24,13 20,6 Z; M20,5 C15,12 12,18 14,25 C16,30 18,32 20,32 C22,32 24,30 26,25 C28,18 25,12 20,5 Z; M20,6 C16,13 13,19 14,25 C15,30 18,32 20,32 C22,32 25,30 26,25 C27,19 24,13 20,6 Z" dur="1.2s" repeatCount="indefinite" />
                  </path>
                  {/* Flame inner core */}
                  <path
                    d="M20,12 C18,17 16,21 17,25 C18,28 19,29 20,29 C21,29 22,28 23,25 C24,21 22,17 20,12 Z"
                    fill="#fef08a"
                  >
                    <animate attributeName="d" values="M20,12 C18,17 16,21 17,25 C18,28 19,29 20,29 C21,29 22,28 23,25 C24,21 22,17 20,12 Z; M20,10 C17,16 16,20 17,25 C18,28 19,29 20,29 C21,29 22,28 23,25 C24,20 23,16 20,10 Z; M20,12 C18,17 16,21 17,25 C18,28 19,29 20,29 C21,29 22,28 23,25 C24,21 22,17 20,12 Z" dur="0.9s" repeatCount="indefinite" />
                  </path>
                  {/* Brass Diya Lamp Base */}
                  <path d="M10,32 Q20,38 30,32 L28,40 Q20,43 12,40 Z" fill="#b45309" stroke="#d97706" strokeWidth="1" />
                  <ellipse cx="20" cy="42" rx="10" ry="2.5" fill="#78350f" />
                </svg>
                <span className="text-[8px] font-mono text-amber-300 font-bold tracking-widest uppercase">Jyoti</span>
              </div>
              
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-12 xs:w-16 sm:w-20 py-1.5 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-xl xs:text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-tight">
                    {windowStatus.hours}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ಗಂಟೆ' : currentLang === 'hi' ? 'घंटे' : 'Hours'}
                </span>
              </div>

              <span className="text-lg xs:text-xl sm:text-2xl font-mono font-bold text-amber-500/70 pb-4">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-12 xs:w-16 sm:w-20 py-1.5 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-xl xs:text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-tight">
                    {windowStatus.mins}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ನಿಮಿಷ' : currentLang === 'hi' ? 'मिनट' : 'Minutes'}
                </span>
              </div>

              <span className="text-lg xs:text-xl sm:text-2xl font-mono font-bold text-amber-500/70 pb-4">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-12 xs:w-16 sm:w-20 py-1.5 sm:py-3 rounded-2xl bg-black/60 border border-amber-500/40 text-center shadow-inner">
                  <span className="text-xl xs:text-3xl sm:text-4xl font-mono font-black text-orange-400 tracking-tight">
                    {windowStatus.secs}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mt-1">
                  {currentLang === 'kn' ? 'ಸೆಕೆಂಡ್' : currentLang === 'hi' ? 'सेकंड' : 'Seconds'}
                </span>
              </div>

            </div>

          </div>

          {/* Right: Significance & Action Prompt Box */}
          <div className="max-w-md w-full p-3 sm:p-4 rounded-2xl bg-black/40 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="break-words">{activeWindowItem.significance[currentLang]}</span>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed font-serif break-words">
              {activeWindowItem.recommendedAction[currentLang]}
            </p>

            {/* Sacred Shiva-Devi Mantra Snippet */}
            {activeWindowItem.shivaDeviMantra && (
              <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20 text-[11px] font-mono text-amber-300/90 break-words">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  🔱 {currentLang === 'kn' ? 'ಶಿವ-ಶಕ್ತಿ ಮಂತ್ರ:' : currentLang === 'hi' ? 'शिव-शक्ति मन्त्र:' : 'Sacred Mantra:'}
                </span>
                {activeWindowItem.shivaDeviMantra}
              </div>
            )}

            {/* Active Progress Line */}
            {windowStatus.state === 'active' && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <span>Window Progress</span>
                  <span className="text-emerald-400 font-bold">{windowStatus.elapsedPercent}%</span>
                </div>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${windowStatus.elapsedPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Quick Selectable Muhurta Pills Grid (Seamless Mobile Scroll / Wrap) */}
        {isExpanded && (
          <div className="mt-2 pt-3 border-t border-stone-800/80 space-y-3 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-amber-400">
                {currentLang === 'kn' ? 'ಮುಹೂರ್ತ ಕಾಲಾವಧಿಗಳ ಆಯ್ಕೆ (Select Window):' : currentLang === 'hi' ? 'मुहूर्त चयन:' : 'Select Muhurta Window:'}
              </span>

              <span className="text-[10px] font-mono text-stone-400">
                Timezone: {selectedCity.timezone || 'Asia/Kolkata'}
              </span>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {muhurtaWindows.map((item) => {
                const isSelected = item.id === selectedWindowId;
                const isInauspicious = item.category === 'inauspicious';
                const isSandhya = item.category === 'sandhya';

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedWindowId(item.id)}
                    className={`p-2 rounded-2xl text-left transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between min-h-[68px] ${
                      isSelected
                        ? isInauspicious
                          ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-400/50 shadow-md'
                          : isSandhya
                          ? 'bg-amber-600/30 border-amber-400 ring-2 ring-amber-300/50 shadow-md'
                          : 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                        : 'bg-stone-850/60 border-stone-750 hover:bg-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold truncate text-[10px] sm:text-[11px] leading-tight">
                        {item.name[currentLang].split('(')[0]}
                      </span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                    </div>

                    <div className="text-[9px] sm:text-[10px] font-mono text-stone-300 mt-1">
                      {item.startTimeStr}
                    </div>

                    {isSelected && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isInauspicious ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Sankalpa / Shiva-Devi Japa Meditation Hold Timer Option */}
            <div className="p-3 rounded-2xl bg-black/40 border border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <span className="font-serif font-bold text-amber-200">
                    {currentLang === 'kn' ? 'ಶಿವ-ಶಕ್ತಿ ಸಂಕಲ್ಪ ಧ್ಯಾನ & ಜಪ ಟೈಮರ್' : currentLang === 'hi' ? 'शिव-शक्ति संकल्प ध्यान एवं जप टाइमर' : 'Shiva-Devi Sankalpa & Japa Timer'}
                  </span>
                  <p className="text-[10px] text-stone-400">
                    {currentLang === 'kn' ? 'ನಿಗದಿತ ನಿಮಿಷಗಳ ಕಾಲ ಶಾಂತಿಯಿಂದ ಸಂಕಲ್ಪ ಹಿಡಿದು ಜಪಿಸಲು ಬಳಸಿ' : 'Set dedicated focus time for internal prayer, mantra holding, and vow completion.'}
                  </p>
                </div>
              </div>

              {/* Preset buttons: Shiva Panchakshara (5m), Devi (11m), Maha Mrityunjaya (21m), Gayatri (15m) */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="inline-flex rounded-xl bg-stone-800 p-0.5 border border-stone-700 flex-wrap">
                  {[
                    { label: '🔱 ಶಿವ (5m)', sec: 300 },
                    { label: '🪔 ದೇವೀ (11m)', sec: 660 },
                    { label: '🌅 ಸಂಧ್ಯಾ (15m)', sec: 900 },
                    { label: '🕉️ ರುದ್ರ (21m)', sec: 1260 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setCustomTimerRunning(false);
                        setCustomTimerSeconds(preset.sec);
                        setCustomTimerInitial(preset.sec);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                        customTimerInitial === preset.sec ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="px-2.5 py-1 rounded-xl bg-stone-850 border border-stone-700 font-mono font-bold text-amber-300 text-xs">
                  {Math.floor(customTimerSeconds / 60)}:{(customTimerSeconds % 60).toString().padStart(2, '0')}
                </div>

                <button
                  onClick={() => setCustomTimerRunning(!customTimerRunning)}
                  className={`p-1.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                    customTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  title={customTimerRunning ? 'Pause Timer' : 'Start Meditation Timer'}
                >
                  {customTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setCustomTimerRunning(false);
                    setCustomTimerSeconds(customTimerInitial);
                  }}
                  className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                  title="Reset Meditation Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SANDHYAVANDANA & SHIVA/DEVI PUJA RECURRING ALERTS CONFIGURATION MODAL */}
      {/* ========================================================================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stone-900 border-2 border-amber-500 text-white p-5 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md">
                  <Bell className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-200">
                    {currentLang === 'kn' ? 'ಸಂಧ್ಯಾ & ಶಿವ-ದೇವೀ ಪೂಜಾ ಅಲರ್ಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್' : currentLang === 'hi' ? 'संध्या एवं शिव-देवी पूजा सूचना विन्यास' : 'Sandhya & Shiva-Devi Puja Alerts'}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    {selectedCity.nameLocalized ? selectedCity.nameLocalized[currentLang] : selectedCity.name} • Sunrise: {panchangDay.sunrise} | Sunset: {panchangDay.sunset}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Master Toggle & Advance Notice */}
            <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    {currentLang === 'kn' ? 'ದೈನಂದಿನ ಮರುಕಳಿಸುವ ಅಧಿಸೂಚನೆಗಳು (Recurring Alerts)' : 'Recurring Auspicious Alerts'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {currentLang === 'kn' ? 'ಸ್ಥಳೀಯ ಸೂರ್ಯೋದಯ/ಸೂರ್ಯಾಸ್ತಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಎಚ್ಚರಿಕೆ' : 'Automatically triggers based on sunrise/sunset of saved location'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMasterEnabled}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    notifConfig.enabled ? 'bg-emerald-600' : 'bg-stone-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      notifConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Advance Notice Minutes Selector */}
              <div className="pt-2 border-t border-stone-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-stone-300 font-semibold">
                  {currentLang === 'kn' ? 'ಮುಂಚಿತ ಎಚ್ಚರಿಕೆ (Advance Reminder):' : 'Advance Notice:'}
                </span>

                <div className="flex items-center gap-1.5">
                  {[
                    { label: '0 min', mins: 0 },
                    { label: '5 min', mins: 5 },
                    { label: '10 min', mins: 10 },
                    { label: '15 min', mins: 15 }
                  ].map(opt => (
                    <button
                      key={opt.mins}
                      onClick={() => handleSetAdvanceMinutes(opt.mins)}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] transition-all cursor-pointer ${
                        notifConfig.advanceMinutes === opt.mins
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Auspicious Alert Toggles with Timings and Test Button */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block px-1">
                {currentLang === 'kn' ? 'ಸಕ್ರಿಯಗೊಳಿಸಬೇಕಾದ ಪೂಜಾ ಕಾಲಗಳು (Auspicious Windows):' : 'Select Windows to Notify:'}
              </span>

              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {calculatedWindows.map(win => {
                  const isChecked = notifConfig.activeAlertTypes.includes(win.id);
                  const isTesting = testingAlertId === win.id;

                  return (
                    <div
                      key={win.id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        isChecked
                          ? 'bg-amber-950/20 border-amber-500/50'
                          : 'bg-stone-800/40 border-stone-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleAlert(win.id)}
                          className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 border cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-amber-500 border-amber-400 text-stone-950'
                              : 'border-stone-600 bg-stone-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-xs text-amber-200">
                              {win.name[currentLang]}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/40 text-amber-300 border border-amber-500/30">
                              {win.startTimeStr} - {win.endTimeStr}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-300 mt-0.5 font-serif">
                            {win.recommendedRitual[currentLang]}
                          </p>

                          <span className="text-[10px] font-mono text-amber-400/80 block mt-1">
                            🕉️ {win.shivaDeviMantra}
                          </span>
                        </div>
                      </div>

                      {/* Test Alert Button */}
                      <button
                        type="button"
                        onClick={() => handleTestAlert(win.id)}
                        disabled={isTesting}
                        className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-600 text-[10px] font-mono font-bold flex items-center gap-1 self-end sm:self-center shrink-0 cursor-pointer disabled:opacity-50"
                        title="Fire a test notification right now with temple bell sound"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isTesting ? 'Playing...' : 'Test Alert'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">
                🔔 Notifications run in background while app is open.
              </span>

              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
