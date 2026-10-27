import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Compass, 
  Bell, 
  Clock, 
  CheckCircle2, 
  Languages, 
  RotateCcw,
  Music2,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';

export interface PoojaAudioGuideProps {
  language: Language;
  deityName: string;
  granthaName: string;
  cityName: string;
  samvatsaraName: string;
  ayanaName: string;
  masaName: string;
  pakshaName: string;
  tithiName: string;
  varaName: string;
  nakshatraName: string;
  rashiName: string;
  onStepChange?: (stepIndex: number) => void;
}

export interface RitualAudioStep {
  id: string;
  stepNumber: number;
  title: Record<Language, string>;
  ritualAction: Record<Language, string>;
  sanskritMantra: string;
  kannadaTranslit: string;
  hindiTranslit: string;
  englishMeaning: string;
  audioSpeechText: Record<Language, string>;
  audioBellAtStart?: boolean;
}

export const PoojaAudioGuide: React.FC<PoojaAudioGuideProps> = ({
  language,
  deityName,
  granthaName,
  cityName,
  samvatsaraName,
  ayanaName,
  masaName,
  pakshaName,
  tithiName,
  varaName,
  nakshatraName,
  rashiName,
  onStepChange
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9); // Default 0.9x for steady Vedic cadence
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(true);
  const [audioSpeechSupported, setAudioSpeechSupported] = useState<boolean>(true);
  const [isBellRinging, setIsBellRinging] = useState<boolean>(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Speech Synthesis and Web Audio
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setAudioSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Synthesizer: Authentic Temple Brass Bell Sound
  const playTempleBell = () => {
    if (!soundEffectsEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsBellRinging(true);
      setTimeout(() => setIsBellRinging(false), 2000);

      const now = ctx.currentTime;
      // Fundamental + High Bell Harmonics (Brass Bell Acoustic Profile)
      const freqs = [587.33, 1174.66, 1760.0, 2637.02, 3520.0];
      const gains = [0.35, 0.25, 0.15, 0.08, 0.04];
      const decays = [2.2, 1.8, 1.4, 0.9, 0.6];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decays[idx]);
      });
    } catch (e) {
      console.warn('Web Audio Bell not supported', e);
    }
  };

  // Sacred Om Drone Frequency (136.1 Hz Cosmic Octave)
  const playOmChime = () => {
    if (!soundEffectsEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(136.1, now);
      osc.frequency.exponentialRampToValueAtTime(136.1, now + 3.0);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.2);
    } catch (e) {
      console.warn('Web Audio Om not supported', e);
    }
  };

  // 7 Sacred Ritual Audio Steps
  const RITUAL_AUDIO_STEPS: RitualAudioStep[] = [
    {
      id: 'step-1-achamana',
      stepNumber: 1,
      title: {
        kn: '೧. ಆಚಮನ ಮತ್ತು ಪ್ರಾಣಾಯಾಮ (Purification)',
        hi: '१. आचमन एवं प्राणायाम (शुद्धिकरण)',
        en: '1. Achamana & Pranayama (Purification)'
      },
      ritualAction: {
        kn: 'ಬಲ ಅಂಗೈಗೆ ಉದ್ಧರಣೆಯಿಂದ ಮೂರು ಬಾರಿ ಜಲ ಹಾಕಿ ಆಚಮನ ಮಾಡಿ, ಕಣ್ಣು, ಮೂಗು, ಕಿವಿ, ಭುಜಗಳನ್ನು ಸ್ಪರ್ಶಿಸಿ.',
        hi: 'दाहिने हाथ में तीन बार जल लेकर आचमन करें एवं अंगों का स्पर्श कर पवित्र हों।',
        en: 'Sip consecrated water 3 times from your right palm, then touch your sense organs for internal sanctification.'
      },
      sanskritMantra: 'ॐ केशवाय स्वाहा । ॐ नारायणाय स्वाहा । ॐ माधवाय स्वाहा । ॐ गोविन्दाय नमः...',
      kannadaTranslit: 'ಓಂ ಕೇಶವಾಯ ಸ್ವಾಹಾ । ಓಂ ನಾರಾಯಣಾಯ ಸ್ವಾಹಾ । ಓಂ ಮಾಧವಾಯ ಸ್ವಾಹಾ । ಓಂ ಗೋವಿಂದಾಯ ನಮಃ...',
      hindiTranslit: 'ॐ केशवाय स्वाहा । ॐ नारायणाय स्वाहा । ॐ माधवाय स्वाहा । ॐ गोविन्दाय नमः...',
      englishMeaning: 'Salutations to Lord Keshava, Narayana, Madhava, and Govinda. May our body, mind, and speech be purified.',
      audioSpeechText: {
        kn: 'ಪ್ರಥಮವಾಗಿ ಆಚಮನ. ಓಂ ಕೇಶವಾಯ ಸ್ವಾಹಾ. ಓಂ ನಾರಾಯಣಾಯ ಸ್ವಾಹಾ. ಓಂ ಮಾಧವಾಯ ಸ್ವಾಹಾ. ಓಂ ಗೋವಿಂದಾಯ ನಮಃ. ಹಸ್ತ ತೊಳೆಯಿರಿ. ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ ಮನಸ್ಸನ್ನು ಏಕಾಗ್ರಗೊಳಿಸಿ.',
        hi: 'प्रथम चरण आचमन। ॐ केशवाय स्वाहा। ॐ नारायणाय स्वाहा। ॐ माधवाय स्वाहा। ॐ गोविन्दाय नमः। हाथ धोएं और प्राणायाम करें।',
        en: 'Step one: Achamana. Om Keshavaya Svaha, Om Narayanaya Svaha, Om Madhavaya Svaha, Om Govindaya Namaha. Wash hands and calm the breath with Pranayama.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-2-ghanta-deepa',
      stepNumber: 2,
      title: {
        kn: '೨. ಘಂಟಾನಾದ & ದೀಪ ನಮಸ್ಕಾರ (Altar Sanctification)',
        hi: '२. घण्टानाद एवं दीप नमस्कार (वेदी पावनिकरण)',
        en: '2. Ghanta & Deepa Pranam (Altar Invocation)'
      },
      ritualAction: {
        kn: 'ಘಂಟೆ ಬಾರಿಸುತ್ತಾ ದೇವತೆಗಳನ್ನು ಆಹ್ವಾನಿಸಿ, ದೀಪದ ಜ್ಯೋತಿಗೆ ನಮಸ್ಕರಿಸಿ ದೇವಿಯ ಅನುಗ್ರಹ ಬೇಡಿ.',
        hi: 'घण्टी बजाकर देवताओं का आह्वान करें और दीपक की ज्योति को प्रणाम करें।',
        en: 'Ring the temple bell to welcome auspicious divinities, and offer reverence to the Sacred Lamp flame.'
      },
      sanskritMantra: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र देवताह्वान लक्षणम् ॥\nदीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್ । ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ದೇವತಾಹ್ವಾನ ಲಕ್ಷಣಮ್ ॥\nದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ಜನಾರ್ದನಃ । ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र देवताह्वान लक्षणम् ॥\nदीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'I ring the bell for the arrival of Devas and the dispelling of negative energies. O Light of the Lamp, embodiment of Supreme Divinity, remove our sins and illuminate our consciousness.',
      audioSpeechText: {
        kn: 'ಘಂಟಾನಾದ ಮತ್ತು ದೀಪ ನಮಸ್ಕಾರ. ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್, ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ದೇವತಾಹ್ವಾನ ಲಕ್ಷಣಮ್. ದೀಪಜ್ಯೋತಿಃ ಪರಬ್ರಹ್ಮ ದೀಪಜ್ಯೋತಿರ್ ಜನಾರ್ದನಃ, ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ.',
        hi: 'घण्टानाद एवं दीप नमस्कार। आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम्, कुर्वे घण्टारवं तत्र देवताह्वान लक्षणम्। दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः, दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते।',
        en: 'Ghanta Nada and Deepa Pranam. We ring the bell for the arrival of Devas and removal of obstacles. Salutations to the Divine Flame representing Parabrahman and Janardana.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-3-desha-kala-sankalpa',
      stepNumber: 3,
      title: {
        kn: '೩. ದೇಶ ಕಾಲ ಶುಭ ಸಂಕಲ್ಪ (Personalized Dynamic Stotra)',
        hi: '३. देश काल शुभ संकल्प (वैदिक संकल्प मन्त्र)',
        en: '3. Desha Kala Shubha Sankalpa (Vedic Oath)'
      },
      ritualAction: {
        kn: 'ಬಲಗೈಯಲ್ಲಿ ಅಕ್ಷತೆ, ಪುಷ್ಪ, ಜಲ ಮತ್ತು ನಾಣ್ಯವನ್ನು ಹಿಡಿದು, ಗುರು-ಹಿರಿಯರನ್ನು ಸ್ಮರಿಸುತ್ತಾ ಸಂಕಲ್ಪವನ್ನು ಪಠಿಸಿ.',
        hi: 'दाहिने हाथ में अक्षत, पुष्प, जल एवं द्रव्य लेकर श्रद्धापूर्वक संकल्प का पाठ करें।',
        en: 'Hold sacred Akshata (uncooked rice), flower, water, and coin in your right palm while chanting this personalized Sankalpa.'
      },
      sanskritMantra: `श्री गोविन्द गोविन्द... अद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री ${deityName} प्रीत्यर्थं श्री ${granthaName} पूजा कर्म करिष्ये ॥`,
      kannadaTranslit: `ಶ್ರೀ ಗೋವಿಂದ ಗೋವಿಂದ... ಅದ್ಯ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯೇ ಪರಾರ್ಧೇ ಶ್ರೀಶ್ವೇತವಾರಾಹಕಲ್ಪೇ ವೈವಸ್ವತಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮಚರಣೇ ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ ಭರತಖಂಡೇ...\n${cityName} ಕ್ಷೇತ್ರೇ... ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ... ಶ್ರೀ ${deityName} ಪ್ರೀತ್ಯರ್ಥಂ ಶ್ರೀ ${granthaName} ಪೂಜಾ ಕರ್ಮ ಕರಿಷ್ಯೇ ॥`,
      hindiTranslit: `श्री गोविन्द गोविन्द... अद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री ${deityName} प्रीत्यर्थं श्री ${granthaName} पूजा कर्म करिष्ये ॥`,
      englishMeaning: `In this cosmic space and time, within ${cityName}, during ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, ${varaName}, under ${nakshatraName} star, for the divine grace and pleasure of Sri ${deityName}, I solemnly perform this sacred puja and recitation of Sri ${granthaName}.`,
      audioSpeechText: {
        kn: `ದೇಶ ಕಾಲ ಶುಭ ಸಂಕಲ್ಪ. ಶ್ರೀ ಗೋವಿಂದ ಗೋವಿಂದ ಗೋವಿಂದ. ಶ್ರೀ ಪರಮೇಶ್ವರ ಪ್ರೀತ್ಯರ್ಥಂ, ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ, ${cityName} ಕ್ಷೇತ್ರೇ, ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ ಸ್ಥಿತೇ ಚಂದ್ರೇ, ಶ್ರೀ ${deityName} ಪ್ರೀತ್ಯರ್ಥಂ, ಧರ್ಮಾರ್ಥ ಕಾಮಮೋಕ್ಷ ಚತುರ್ವಿಧ ಫಲ ಪುರುಷಾರ್ಥ ಸಿದ್ಧ್ಯರ್ಥಂ, ಶ್ರೀ ${granthaName} ಪಾರಾಯಣ ಪೂಜಾ ಸಂಕಲ್ಪಂ ಕರಿಷ್ಯೇ. ಜಲವನ್ನು ತಟ್ಟೆಯಲ್ಲಿ ಬಿಡಿ.`,
        hi: `देश काल शुभ संकल्प। श्री गोविन्द गोविन्द गोविन्द। जम्बूद्वीपे भारतवर्षे, ${cityName} क्षेत्रे, ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ, श्री ${deityName} प्रीत्यर्थं, श्री ${granthaName} पूजन संकल्पं करिष्ये। जल पात्र में छोड़ें।`,
        en: `Desha Kala Shubha Sankalpa. Sri Govinda, Govinda, Govinda. In the holy land of ${cityName}, in ${samvatsaraName} year, during ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} star, for the divine grace of Sri ${deityName}, I undertake this auspicious ritual and chanting of ${granthaName}. Release water gently into the vessel.`
      },
      audioBellAtStart: true
    },
    {
      id: 'step-4-kalasha-sthapana',
      stepNumber: 4,
      title: {
        kn: '೪. ಕಲಶ ಸ್ಥಾಪನೆ & ವರುಣ ಆವಾಹನ (Kalasha Sthapana)',
        hi: '४. कलश स्थापना एवं वरुण आह्वान (Kalasha Sthapana)',
        en: '4. Kalasha Sthapana & Varuna Invocation'
      },
      ritualAction: {
        kn: 'ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶಕ್ಕೆ ಗಂಗಾಜಲ ತುಂಬಿ, ಪಂಚಪಲ್ಲವ, ನಾಣ್ಯ, ಅಡಿಕೆ ಹಾಕಿ, ತೆಂಗಿನಕಾಯಿ ಪ್ರತಿಷ್ಠಾಪಿಸಿ ವರುಣ ದೇವರನ್ನು ಪ್ರಾರ್ಥಿಸಿ.',
        hi: 'कलश में शुद्ध जल, पंचपल्लव, सुपारी, सिक्का डालकर नारियल स्थापित करें एवं वरुण देव की वन्दना करें।',
        en: 'Fill copper/brass pot with sacred water, add 5 mango leaves, betel nut, coin, crown with coconut and invoke holy rivers.'
      },
      sanskritMantra: 'कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥',
      kannadaTranslit: 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ । ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ॥\nಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ । ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ॥',
      hindiTranslit: 'कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥',
      englishMeaning: 'In the mouth of the Kalasha dwells Vishnu, at the neck Rudra, at the base Brahma, and in the middle the Divine Mothers. May Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri enter this sacred water.',
      audioSpeechText: {
        kn: 'ಕಲಶ ಸ್ಥಾಪನೆ ಮತ್ತು ವರುಣ ಆವಾಹನ. ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ, ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ. ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ, ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು. ಕಲಶಾಯ ನಮಃ, ಪ್ರಾರ್ಥಯಾಮಿ.',
        hi: 'कलश स्थापना एवं वरुण आह्वान। कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः, मूल में ब्रह्मा और मध्य में मातृगण स्थित हैं। हे गङ्गा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु और कावेरी, इस पवित्र जल में पधारें। कलश को प्रणाम करें।',
        en: 'Kalasha Sthapana and Varuna Invocation. In the Kalasha reside Vishnu, Rudra, Brahma, and the Divine Mother Energies. We invoke the seven holy rivers Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri into this sanctified vessel.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-5-akhanda-deepa',
      stepNumber: 5,
      title: {
        kn: '೫. ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ & ಗಾಯತ್ರೀ (Akhanda Deepa)',
        hi: '५. अखण्ड दीप प्रतिष्ठा एवं गायत्री (Akhanda Deepa)',
        en: '5. Akhanda Deepa Installation & Gayatri'
      },
      ritualAction: {
        kn: 'ಗೋಧಿ/ಅಕ್ಕಿ ಪೀಠದ ಮೇಲೆ ಹಿತ್ತಾಳೆಯ ದೀಪವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ತುಪ್ಪ/ಎಣ್ಣೆ ಹಾಕಿ, ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ಮುಖವಾಗಿ ಜ್ಯೋತಿ ಪ್ರಜ್ವಲಿಸಿ.',
        hi: 'धान्य पीठ पर पीतल का दीप रखकर घृत अथवा तिल तैल भरकर पूर्व या उत्तर दिशा में अखण्ड ज्योति प्रज्वलित करें।',
        en: 'Place brass lamp on grain altar, add pure cow ghee (left) or sesame oil (right), illuminate facing East or North.'
      },
      sanskritMantra: 'शुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥\nॐ महाज्वालाय विद्महे अग्निदेवाय धीमहि । तन्नो अग्निः प्रचोदयात् ॥',
      kannadaTranslit: 'ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ । ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥\nಓಂ ಮಹಾಜ್ವಾಲಾಯ ವಿದ್ಮಹೇ ಅಗ್ನಿದೇವಾಯ ಧೀಮಹಿ । ತನ್ನೋ ಅಗ್ನಿಃ ಪ್ರಚೋದಯಾತ್ ॥',
      hindiTranslit: 'शुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥\nॐ महाज्वालाय विद्महे अग्निदेवाय धीमहि । तन्नो अग्निः प्रचोदयात् ॥',
      englishMeaning: 'Salutations to the sacred flame that bestows auspiciousness, radiant health, wealth, and dispels malevolent thoughts. Om, we meditate on the blazing Lord of Fire, may Agni enlighten our intellect.',
      audioSpeechText: {
        kn: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ. ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮ್ ಆರೋಗ್ಯಂ ಧನಸಂಪದಃ, ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ. ಓಂ ಮಹಾಜ್ವಾಲಾಯ ವಿದ್ಮಹೇ ಅಗ್ನಿದೇವಾಯ ಧೀಮಹಿ, ತನ್ನೋ ಅಗ್ನಿಃ ಪ್ರಚೋದಯಾತ್. ಅಖಂಡ ಜ್ಯೋತಯೇ ನಮಃ.',
        hi: 'अखण्ड दीप प्रतिष्ठा। शुभं करोति कल्याणमारोग्यं धनसम्पदः, शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते। ॐ महाज्वालाय विद्महे अग्निदेवाय धीमहि, तन्नो अग्निः प्रचोदयात्। अखण्ड ज्योति को प्रणाम करें।',
        en: 'Akhanda Deepa Installation. Shubham Karoti Kalyanam, Arogyam Dhana Sampadah. Salutations to the sacred light that brings peace, supreme health, and prosperity. May the divine flame of Agni protect our home.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-6-shodashopachara',
      stepNumber: 6,
      title: {
        kn: '೬. ಷೋಡಶೋಪಚಾರ ಪೂಜಾ ಸಮರ್ಪಣೆ (16 Sacred Offerings)',
        hi: '६. षोडशोपचार पूजा समर्पण (१६ पावन उपचार)',
        en: '6. Shodashopachara Puja Samarpana (16 Upacharas)'
      },
      ritualAction: {
        kn: 'ಧ್ಯಾಹನ, ಆವಾಹನ, ಆಸನ, ಪಾದ್ಯ, ಅರ್ಘ್ಯ, ಆಚಮನ, ಸ್ನಾನ, ವಸ್ತ್ರ, ಗಂಧ, ಪುಷ್ಪ, ಧೂಪ, ದೀಪ, ನೈವೇದ್ಯ, ತಾಂಬೂಲ ಸಮರ್ಪಿಸಿ.',
        hi: 'ध्यान, आवाहन, आसन, पाद्य, अर्घ्य, आचमन, स्नान, वस्त्र, गन्ध, पुष्प, धूप, दीप, नैवेद्य एवं ताम्बूल अर्पित करें।',
        en: 'Chant and offer each of the 16 traditional Vedic offerings with devotion to Sri Ishta Devata.'
      },
      sanskritMantra: 'ध्यायामि, आवाहयामि, आसनं समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, स्नानान्ते वस्त्रं, यज्ञोपवीतं, गन्धं, पुष्पं, धूपं, दीपं, नैवेद्यं, ताम्बूलं, मङ्गलनीराजनं समर्पयामि ॥',
      kannadaTranslit: 'ಧ್ಯಾಯಾಮಿ, ಆವಾಹಯಾಮಿ, ಆಸನಂ ಸಮರ್ಪಯಾಮಿ, ಪಾದ್ಯಂ, ಅರ್ಘ್ಯಂ, ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ, ಸ್ನಾನಾಂತೇ ವಸ್ತ್ರಂ, ಯಜ್ಞೋಪವೀತಂ, ಗಂಧಂ, ಪುಷ್ಪಂ, ಧೂಪಂ, ದೀಪಂ, ನೈವೇದ್ಯಂ, ತಾಂಬೂಲಂ, ಮಂಗಳನೀರಾಜನಂ ಸಮರ್ಪಯಾಮಿ ॥',
      hindiTranslit: 'ध्यायामि, आवाहयामि, आसनं समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, स्नानान्ते वस्त्रं, यज्ञोपवीतं, गन्धं, पुष्पं, धूपं, दीपं, नैवेद्यं, ताम्बूलं, मङ्गलनीराजनं समर्पयामि ॥',
      englishMeaning: 'I meditate upon You, I welcome You, I offer seat, holy water for feet, hands, and sipping; holy bath, garments, sacred thread, sandalwood, flowers, incense, lamp, sweet food, and sacred waving of lights.',
      audioSpeechText: {
        kn: 'ಷೋಡಶೋಪಚಾರ ಸಮರ್ಪಣೆ. ಶ್ರೀ ಇಷ್ಟದೇವತಾಯೈ ನಮಃ. ಧ್ಯಾಯಾಮಿ. ಆವಾಹಯಾಮಿ. ಆಸನಾರ್ಥೇ ಅಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ. ಪಾದ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಅರ್ಘ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ. ಗಂಧಂ ಸಮರ್ಪಯಾಮಿ. ಪುಷ್ಪಾಣಿ ಪೂಜಯಾಮಿ. ಧೂಪಂ ಆಘ್ರಾಪಯಾಮಿ. ದೀಪಂ ದರ್ಶಯಾಮಿ. ನೈವೇದ್ಯಂ ನಿವೇದಯಾಮಿ. ತಾಂಬೂಲಂ ಸಮರ್ಪಯಾಮಿ. ಮಂಗಳ ನೀರಾಜನಂ ಸಮರ್ಪಯಾಮಿ.',
        hi: 'षोडशोपचार पूजन। श्री इष्टदेवतायै नमः। ध्यायामि, आवाहयामि, आसनं समर्पयामि। पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि। गन्धं, पुष्पं, धूपं, दीपं, नैवेद्यं, ताम्बूलं एवं मङ्गल आरती समर्पयामि।',
        en: 'Shodashopachara Samarpana. Salutations to the Divine Deity. We offer Dhyana, Avahana, Asana, Padyam, Arghyam, Achamaniyam, Gandham, Pushpam, Dhoopam, Deepam, Naivedyam, and Mangala Arati.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-7-visarjana-shanti',
      stepNumber: 7,
      title: {
        kn: '೭. ಸಮರ್ಪಣ & ಶಾಂತಿ ಪಾಠ (Conclusion & Peace Prayer)',
        hi: '७. समर्पण एवं शान्ति पाठ (कल्याण प्रार्थना)',
        en: '7. Samarpana & Shanti Patha (Universal Peace)'
      },
      ritualAction: {
        kn: 'ಪೂಜೆಯ ಸಕಲ ಫಲವನ್ನು ಶ್ರೀ ಪರಮೇಶ್ವರಾರ್ಪಣ ಮಾಡಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮಾಡಿ ಲೋಕಕಲ್ಯಾಣ ಶಾಂತಿ ಮಂತ್ರ ಪಠಿಸಿ.',
        hi: 'सम्पूर्ण पूजा का फल परमात्मा को समर्पित करें एवं विश्व शान्ति की प्रार्थना करें।',
        en: 'Surrender all fruits of the puja to Supreme Divinity, circumambulate clockwise and chant the Vedic Peace Invocations.'
      },
      sanskritMantra: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै नारायणायेति समर्पयामि ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      kannadaTranslit: 'ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್ । ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ ನಾರಾಯಣಾಯೇತಿ ಸಮರ್ಪಯಾಮಿ ॥\nಓಂ ದ್ಯೌಃ ಶಾಂತಿಶ್ಚಾಂತರಿಕ್ಷಂ ಶಾಂತಿಃ ಪೃಥಿವೀ ಶಾಂತಿರಾಪಃ ಶಾಂತಿೋಷಧಯಃ ಶಾಂತಿಃ । ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      hindiTranslit: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै नारायणायेति समर्पयामि ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      englishMeaning: 'Whatever I perform with body, speech, mind, senses, or nature, I surrender it all to the Supreme Divine. May there be peace in heaven, peace in the atmosphere, peace on earth, peace in water, peace in herbs and plants. Om Peace, Peace, Peace.',
      audioSpeechText: {
        kn: 'ಸಮರ್ಪಣ ಮತ್ತು ಶಾಂತಿ ಪಾಠ. ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ, ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್, ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ, ಶ್ರೀ ಪರಮೇಶ್ವರಾರ್ಪಣಮಸ್ತು. ಓಂ ದ್ಯೌಃ ಶಾಂತಿಃ, ಅಂತರಿಕ್ಷಂ ಶಾಂತಿಃ, ಪೃಥಿವೀ ಶಾಂತಿಃ, ಆಪಃ ಶಾಂತಿಃ, ಓಷಧಯಃ ಶಾಂತಿಃ. ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ. ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು.',
        hi: 'समर्पण एवं शान्ति पाठ। कायेन वाचा मनसेन्द्रियैर्वा, करोमि यद्यत् सकलं परस्मै नारायणायेति समर्पयामि। ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिः। ॐ शान्तिः शान्तिः शान्तिः। सर्वे भवन्तु सुखिनः।',
        en: 'Samarpana and Shanti Patha. Whatever has been performed through body, speech, and mind is consecrated to the Divine. Om Peace in the heavens, peace in space, peace on earth, peace in the waters, peace in all beings. Om Shantih, Shantih, Shantih.'
      },
      audioBellAtStart: true
    }
  ];

  const currentStep = RITUAL_AUDIO_STEPS[currentStepIndex];

  // Play audio for a given step index
  const playStepAudio = (stepIdx: number) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const targetStep = RITUAL_AUDIO_STEPS[stepIdx];
    if (!targetStep) return;

    // Trigger Temple Bell Sound effect at step start
    if (targetStep.audioBellAtStart) {
      playTempleBell();
    }

    const textToSpeak = targetStep.audioSpeechText[language] || targetStep.audioSpeechText.kn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Pick appropriate voice
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;
    if (language === 'kn') {
      selectedVoice = voices.find(v => v.lang.startsWith('kn')) || voices.find(v => v.lang.startsWith('hi')) || null;
    } else if (language === 'hi') {
      selectedVoice = voices.find(v => v.lang.startsWith('hi')) || null;
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en')) || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      // Play a soft closing chime
      playOmChime();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    onStepChange?.(stepIdx);
  };

  const handlePlayPause = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      playStepAudio(currentStepIndex);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePrevStep = () => {
    const nextIdx = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(nextIdx);
    if (isPlaying || isPaused) {
      playStepAudio(nextIdx);
    } else {
      onStepChange?.(nextIdx);
    }
  };

  const handleNextStep = () => {
    const nextIdx = Math.min(RITUAL_AUDIO_STEPS.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextIdx);
    if (isPlaying || isPaused) {
      playStepAudio(nextIdx);
    } else {
      onStepChange?.(nextIdx);
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    if (isPlaying || isPaused) {
      playStepAudio(idx);
    } else {
      onStepChange?.(idx);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 bg-white dark:bg-stone-900 shadow-xl overflow-hidden">
      
      {/* Audio Guide Header Bar */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-amber-700 text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4 text-amber-300" />
            <span>SYNCHRONOUS POOJA AUDIO GUIDE • ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>{language === 'kn' ? 'ಪೂಜಾ ಮಂತ್ರ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ' : language === 'hi' ? 'पूजा मन्त्र ध्वनि संदर्शिका' : 'Pooja Mantra Audio Guide'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold">
              {currentStepIndex + 1} / {RITUAL_AUDIO_STEPS.length}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-2xl leading-relaxed">
            {language === 'kn'
              ? 'ಆಚಮನ, ಘಂಟಾನಾದ, ದೀಪ ನಮಸ್ಕಾರ, ದೇಶ-ಕಾಲ ಸಂಕಲ್ಪ, ಕಲಶ ಸ್ಥಾಪನೆ, ಅಖಂಡ ದೀಪ ಹಾಗೂ ಷೋಡಶೋಪಚಾರ ಮಂತ್ರಗಳನ್ನು ಸಕ್ರಮವಾಗಿ ಆಲಿಸಿ ಪೂಜೆ ನೆರವೇರಿಸಿ.'
              : language === 'hi'
              ? 'आचमन, घण्टानाद, दीप नमस्कार, संकल्प, कलश स्थापना, अखण्ड दीप एवं षोडशोपचार मन्त्रों का सस्वर श्रवण करें।'
              : 'Synchronously play authentic Sanskrit mantras and step-by-step ritual instructions with temple bells and cosmic Om chimes.'}
          </p>
        </div>

        {/* Quick Temple Bell Trigger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={playTempleBell}
            title="Ring Brass Temple Bell"
            className={`px-3.5 py-2 rounded-xl border border-amber-300/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              isBellRinging 
                ? 'bg-amber-400 text-stone-950 scale-105 ring-2 ring-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Bell className={`w-4 h-4 ${isBellRinging ? 'animate-bounce text-stone-950' : 'text-amber-300'}`} />
            <span>{language === 'kn' ? 'ಘಂಟಾನಾದ (Bell)' : 'Ring Bell'}</span>
          </button>

          <button
            type="button"
            onClick={playOmChime}
            title="Play Cosmic Om Resonance"
            className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span>🕉️ Om Chime</span>
          </button>
        </div>
      </div>

      {/* Synchronous Step Progress Pills */}
      <div className="no-print bg-amber-50 dark:bg-stone-800/60 p-3 border-b border-amber-200 dark:border-stone-700 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {RITUAL_AUDIO_STEPS.map((s, idx) => {
            const isActive = currentStepIndex === idx;
            const isDone = currentStepIndex > idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md ring-2 ring-amber-400'
                    : isDone
                    ? 'bg-amber-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{s.title[language].split('(')[0].trim().replace(/^[೧-೭]\.\s*/, '').replace(/^[1-7]\.\s*/, '')}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Display & Synchronous Highlight */}
      <div className="p-6 space-y-6">
        
        {/* Step Header */}
        <div className="border-b border-amber-200 dark:border-stone-700 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono">
              RITUAL SECTION {currentStep.stepNumber} OF {RITUAL_AUDIO_STEPS.length}
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 dark:text-white mt-0.5">
              {currentStep.title[language]}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-semibold">
              Speed:
            </span>
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
              {[0.8, 0.9, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    playbackSpeed === speed
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ritual Action Guide */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-3">
          <span className="text-lg shrink-0 mt-0.5">✨</span>
          <div>
            <strong className="block font-bold text-amber-900 dark:text-amber-300 mb-0.5">
              {language === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವಿಧಾನ ಮತ್ತು ಆಚರಣೆ:' : language === 'hi' ? 'शास्त्रोक्त विधान एवं क्रिया:' : 'Prescribed Action & Ritual Method:'}
            </strong>
            <p className="leading-relaxed">{currentStep.ritualAction[language]}</p>
          </div>
        </div>

        {/* Sacred Sanskrit Mantra Box with Glowing Synchronous Border when Playing */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
          isPlaying
            ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-950/20 shadow-lg ring-4 ring-amber-300/40 animate-pulse'
            : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಪೂಜಾ ಮಂತ್ರ (Sacred Vedic Mantra)' : 'Sacred Vedic Mantra'}</span>
            </span>

            {isPlaying && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">
                <Volume2 className="w-3 h-3" />
                <span>CHANTING NOW</span>
              </span>
            )}
          </div>

          <div className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-loose whitespace-pre-line select-text">
            {language === 'kn' ? currentStep.kannadaTranslit : language === 'hi' ? currentStep.hindiTranslit : currentStep.sanskritMantra}
          </div>

          {/* English Meaning / Significance */}
          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 italic">
            <strong>Meaning:</strong> {currentStep.englishMeaning}
          </div>
        </div>

        {/* Main Audio Controls Deck */}
        <div className="rounded-2xl bg-stone-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          
          {/* Step Indicator */}
          <div className="text-xs space-y-0.5 text-center sm:text-left">
            <div className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              Active Ritual Track
            </div>
            <div className="font-serif font-bold text-sm text-stone-200">
              {currentStep.title[language]}
            </div>
          </div>

          {/* Audio Transport Buttons */}
          <div className="flex items-center gap-3">
            {/* Prev Step */}
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Previous Step"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={handlePlayPause}
              className={`p-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center cursor-pointer active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 ring-4 ring-amber-300/40'
                  : 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-400/30'
              }`}
              title={isPlaying ? 'Pause Chanting' : 'Play Vedic Audio Guide'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            {/* Stop Button */}
            <button
              type="button"
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-red-400 transition-colors cursor-pointer"
              title="Stop Audio Guide"
            >
              <Square className="w-5 h-5" />
            </button>

            {/* Next Step */}
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStepIndex === RITUAL_AUDIO_STEPS.length - 1}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-40 transition-colors cursor-pointer"
              title="Next Step"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Sound Effects Toggle & Bell */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                soundEffectsEnabled
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'bg-stone-800 text-stone-500 border border-stone-700'
              }`}
              title="Toggle Temple Bell Chimes & Om Sound Effects"
            >
              {soundEffectsEnabled ? <Bell className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEffectsEnabled ? 'SFX Bell: ON' : 'SFX: OFF'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
