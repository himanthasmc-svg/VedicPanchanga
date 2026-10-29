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
        kn: '೧. ಶಿವ-ಶಕ್ತಿ ಆಚಮನ & ಪ್ರಾಣಾಯಾಮ (Purification)',
        hi: '१. शिव-शक्ति आचमन एवं प्राणायाम (शुद्धिकरण)',
        en: '1. Shiva-Shakti Achamana & Pranayama (Purification)'
      },
      ritualAction: {
        kn: 'ಬಲ ಅಂಗೈಗೆ ಉದ್ಧರಣೆಯಿಂದ ಮೂರು ಬಾರಿ ಜಲ ಹಾಕಿ ಶಿವ-ಶಕ್ತಿ ಮಂತ್ರದಿಂದ ಆಚಮನ ಮಾಡಿ, ಅಂಗ-ಸ್ಪರ್ಶದಿಂದ ಪವಿತ್ರರಾಗಿ.',
        hi: 'दाहिने हाथ में तीन बार जल लेकर शिव-शक्ति मन्त्रों से आचमन करें एवं अंगों का स्पर्श कर पवित्र हों।',
        en: 'Sip consecrated water 3 times from your right palm while chanting Shiva-Devi mantras for internal purification.'
      },
      sanskritMantra: 'ॐ शिवाय स्वाहा । ॐ महेश्वराय स्वाहा । ॐ शम्भवे स्वाहा ।\nॐ उमायै नमः । ॐ दुर्गायै नमः । ॐ पार्वत्यै नमः । ॐ भवान्यै नमः । ॐ चण्डिकायै नमः ॥',
      kannadaTranslit: 'ಓಂ ಶಿವಾಯ ಸ್ವಾಹಾ । ಓಂ ಮಹೇಶ್ವರಾಯ ಸ್ವಾಹಾ । ಓಂ ಶಂಭವೇ ಸ್ವಾಹಾ ।\nಓಂ ಉಮಾಯೈ ನಮಃ । ಓಂ ದುರ್ಗಾಯೈ ನಮಃ । ಓಂ ಪಾರ್ವತ್ಯೈ ನಮಃ । ಓಂ ಭವಾನ್ಯೈ ನಮಃ । ಓಂ ಚಂಡಿಕಾಯೈ ನಮಃ ॥',
      hindiTranslit: 'ॐ शिवाय स्वाहा । ॐ महेश्वराय स्वाहा । ॐ शम्भवे स्वाहा ।\nॐ उमायै नमः । ॐ दुर्गायै नमः । ॐ पार्वत्यै नमः । ॐ भवान्यै नमः । ॐ चण्डिकायै नमः ॥',
      englishMeaning: 'Salutations to Lord Shiva, Maheshvara, and Shambhu through holy water sips. Salutations to Divine Mother Uma, Durga, Parvati, Bhavani, and Chandika. May our body, speech, and mind be consecrated.',
      audioSpeechText: {
        kn: 'ಪ್ರಥಮವಾಗಿ ಶಿವ-ಶಕ್ತಿ ಆಚಮನ. ಓಂ ಶಿವಾಯ ಸ್ವಾಹಾ. ಓಂ ಮಹೇಶ್ವರಾಯ ಸ್ವಾಹಾ. ಓಂ ಶಂಭವೇ ಸ್ವಾಹಾ. ಹಸ್ತ ತೊಳೆಯಿರಿ. ಓಂ ಉಮಾಯೈ ನಮಃ. ಓಂ ದುರ್ಗಾಯೈ ನಮಃ. ಓಂ ಪಾರ್ವತ್ಯೈ ನಮಃ. ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ ಶಿವ-ಶಕ್ತಿಯನ್ನು ಧ್ಯಾನಿಸಿ.',
        hi: 'प्रथम चरण शिव-शक्ति आचमन। ॐ शिवाय स्वाहा। ॐ महेश्वराय स्वाहा। ॐ शम्भवे स्वाहा। हाथ धोएं। ॐ उमायै नमः, ॐ दुर्गायै नमः, ॐ पार्वत्यै नमः। प्राणायाम कर शिव-शक्ति का ध्यान करें।',
        en: 'Step one: Shiva-Shakti Achamana. Om Shivaya Svaha, Om Maheshvaraya Svaha, Om Shambhave Svaha. Wash hands. Om Umayai Namaha, Om Durgayai Namaha, Om Parvatyai Namaha. Consecrate the breath with Pranayama.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-2-ghanta-deepa',
      stepNumber: 2,
      title: {
        kn: '೨. ಘಂಟಾನಾದ & ಶಿವ-ಶಕ್ತಿ ದೀಪ ಪ್ರಣಾಮ (Altar Sanctification)',
        hi: '२. घण्टानाद एवं शिव-शक्ति दीप प्रणाम (वेदी पावनिकरण)',
        en: '2. Ghanta & Shiva-Shakti Deepa Pranam (Altar Invocation)'
      },
      ritualAction: {
        kn: 'ಘಂಟೆ ಬಾರಿಸುತ್ತಾ ಶಿವ-ಶಕ್ತಿ ದೇವತೆಗಳನ್ನು ಆಹ್ವಾನಿಸಿ, ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಸದಾಶಿವ ಮತ್ತು ಪರಾಶಕ್ತಿಯ ಸ್ವರೂಪವೆಂದು ನಮಸ್ಕರಿಸಿ.',
        hi: 'घण्टी बजाकर शिव-शक्ति का आह्वान करें और दीपक की ज्योति को साक्षात् पराशक्ति व सदाशिव मानकर प्रणाम करें।',
        en: 'Ring the temple bell invoking Shiva and Devi Durga, venerating the sacred flame as embodiment of Parashakti and Sadashiva.'
      },
      sanskritMantra: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शिवशक्त्याह्वान लक्षणम् ॥\nदीपज्योतिः पराशक्तिः दीपज्योतिः सदाशिवः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್ । ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಿವಶಕ್ತ್ಯಾಹ್ವಾನ ಲಕ್ಷಣಮ್ ॥\nದೀಪಜ್ಯೋತಿಃ ಪರಾಶಕ್ತಿಃ ದೀಪಜ್ಯೋತಿಃ ಸದಾಶಿವಃ । ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शिवशक्त्याह्वान लक्षणम् ॥\nदीपज्योतिः पराशक्तिः दीपज्योतिः सदाशिवः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'I ring the bell welcoming Lord Shiva, Devi Durga, and all benevolent divinities while expelling negativity. The light of the lamp is supreme Parashakti and Sadashiva. O Divine Flame, eradicate all darkness and sins.',
      audioSpeechText: {
        kn: 'ಘಂಟಾನಾದ ಮತ್ತು ಶಿವ-ಶಕ್ತಿ ದೀಪ ಪ್ರಣಾಮ. ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್, ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಿವಶಕ್ತ್ಯಾಹ್ವಾನ ಲಕ್ಷಣಮ್. ದೀಪಜ್ಯೋತಿಃ ಪರಾಶಕ್ತಿಃ ದೀಪಜ್ಯೋತಿಃ ಸದಾಶಿವಃ, ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ.',
        hi: 'घण्टानाद एवं शिव-शक्ति दीप प्रणाम। आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम्, कुर्वे घण्टारवं तत्र शिवशक्त्याह्वान लक्षणम्। दीपज्योतिः पराशक्तिः दीपज्योतिः सदाशिवः, दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते।',
        en: 'Ghanta Nada and Shiva-Shakti Deepa Pranam. We ring the bell welcoming Lord Shiva and Mother Durga. The light of the sacred lamp is Parashakti and Sadashiva. Salutations to the Divine Flame.'
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
        kn: 'ಬಲಗೈಯಲ್ಲಿ ಅಕ್ಷತೆ, ಬಿಲ್ವಪತ್ರೆ/ಹೂವು, ಜಲ ಹಿಡಿದು, ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ಮತ್ತು ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿಯ ಪ್ರೀತ್ಯರ್ಥ ಸಂಕಲ್ಪ ಪಠಿಸಿ.',
        hi: 'दाहिने हाथ में अक्षत, बिल्वपत्र/पुष्प, जल लेकर श्री साम्बसदाशिव एवं श्री दुर्गा परमेश्वरी की प्रसन्नता हेतु संकल्प पाठ करें।',
        en: 'Hold sacred Akshata, Bilva/flowers, and water in your right palm while chanting this personalized Sankalpa dedicated to Shiva-Devi.'
      },
      sanskritMantra: `ॐ नमः शिवाय । श्री साम्बसदाशिव दुर्गापरमेश्वर्यै नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री साम्बसदाशिव श्री ${deityName} प्रीत्यर्थं श्री ${granthaName} पूजा कर्म करिष्ये ॥`,
      kannadaTranslit: `ಓಂ ನಮಃ ಶಿವಾಯ । ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ ।\nಅದ್ಯ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯೇ ಪರಾರ್ಧೇ ಶ್ರೀಶ್ವೇತವಾರಾಹಕಲ್ಪೇ ವೈವಸ್ವತಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮಚರಣೇ ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ ಭರತಖಂಡೇ...\n${cityName} ಕ್ಷೇತ್ರೇ... ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ... ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ಶ್ರೀ ${deityName} ಪ್ರೀತ್ಯರ್ಥಂ ಶ್ರೀ ${granthaName} ಪೂಜಾ ಕರ್ಮ ಕರಿಷ್ಯೇ ॥`,
      hindiTranslit: `ॐ नमः शिवाय । श्री साम्बसदाशिव दुर्गापरमेश्वर्यै नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री साम्बसदाशिव श्री ${deityName} प्रीत्यर्थं श्री ${granthaName} पूजा कर्म करिष्ये ॥`,
      englishMeaning: `Om Namah Shivaya. Salutations to Sri Samba Sadashiva and Sri Durga Parameshwari. Within ${cityName}, during ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, ${varaName}, under ${nakshatraName} star, for the supreme grace of Lord Shiva and Devi ${deityName}, I solemnly perform this sacred puja and recitation of Sri ${granthaName}.`,
      audioSpeechText: {
        kn: `ದೇಶ ಕಾಲ ಶುಭ ಸಂಕಲ್ಪ. ಓಂ ನಮಃ ಶಿವಾಯ. ಶ್ರೀ ಸಾಂಬ ಸದಾಶಿವ ದುರ್ಗಾ ಪರಮೇಶ್ವರೀ ಚರಣಾರವಿಂದಯೋಃ ಪ್ರಣಾಮ. ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ, ${cityName} ಕ್ಷೇತ್ರೇ, ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ ಸ್ಥಿತೇ ಚಂದ್ರೇ, ಶ್ರೀ ಸಾಂಬ ಸದಾಶಿವ ಶ್ರೀ ${deityName} ಪ್ರೀತ್ಯರ್ಥಂ, ಧರ್ಮಾರ್ಥ ಕಾಮಮೋಕ್ಷ ಫಲ ಸಿದ್ಧ್ಯರ್ಥಂ, ಶ್ರೀ ${granthaName} ಪಾರಾಯಣ ಪೂಜಾ ಸಂಕಲ್ಪಂ ಕರಿಷ್ಯೇ. ಜಲವನ್ನು ತಟ್ಟೆಯಲ್ಲಿ ಬಿಡಿ.`,
        hi: `देश काल शुभ संकल्प। ॐ नमः शिवाय। श्री साम्ब सदाशिव दुर्गा परमेश्वरी चरणारविन्दयोः प्रणाम। जम्बूद्वीपे भारतवर्षे, ${cityName} क्षेत्रे, ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ, श्री साम्ब सदाशिव श्री ${deityName} प्रीत्यर्थं, श्री ${granthaName} पूजन संकल्पं करिष्ये। जल पात्र में छोड़ें।`,
        en: `Desha Kala Shubha Sankalpa. Om Namah Shivaya. Salutations to Sri Samba Sadashiva and Sri Durga Parameshwari. In the sacred land of ${cityName}, in ${samvatsaraName} year, during ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} star, for the divine love and grace of Lord Shiva and Devi ${deityName}, I undertake this auspicious puja and chanting of ${granthaName}. Release water gently into the vessel.`
      },
      audioBellAtStart: true
    },
    {
      id: 'step-4-kalasha-sthapana',
      stepNumber: 4,
      title: {
        kn: '೪. ಕಲಶ ಸ್ಥಾಪನೆ & ಶಿವ-ಗೌರೀ ವರುಣ ಆವಾಹನ (Kalasha Sthapana)',
        hi: '४. कलश स्थापना एवं शिव-गौरी वरुण आह्वान (Kalasha Sthapana)',
        en: '4. Kalasha Sthapana & Shiva-Gauri Invocation'
      },
      ritualAction: {
        kn: 'ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶಕ್ಕೆ ಗಂಗಾಜಲ ತುಂಬಿ, ಪಂಚಪಲ್ಲವ, ನಾಣ್ಯ, ಅಡಿಕೆ ಹಾಕಿ, ತೆಂಗಿನಕಾಯಿ ಪ್ರತಿಷ್ಠಾಪಿಸಿ ಶಿವ-ಶಕ್ತಿ ತೀರ್ಥ ಶಕ್ತಿಗಳನ್ನು ಆಹ್ವಾನಿಸಿ.',
        hi: 'कलश में शुद्ध जल, पंचपल्लव, सुपारी, सिक्का डालकर नारियल स्थापित करें एवं शिव-गौरी व वरुण देव की वन्दना करें।',
        en: 'Fill holy vessel with sacred water, add 5 mango leaves, betel nut, coin, crown with coconut, and invoke Shiva-Gauri and holy rivers.'
      },
      sanskritMantra: 'कलशस्य मुखे रुद्रः कण्ठे गौरी समाश्रिता । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ नमः शिवाय साम्बसदाशिवाय कलशदेवताभ्यो नमः ॥',
      kannadaTranslit: 'ಕಲಶಸ್ಯ ಮುಖೇ ರುದ್ರಃ ಕಂಠೇ ಗೌರೀ ಸಮಾಶ್ರಿತಾ । ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ॥\nಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ । ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ॥\nಓಂ ನಮಃ ಶಿವಾಯ ಸಾಂಬಸದಾಶಿವಾಯ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ ॥',
      hindiTranslit: 'कलशस्य मुखे रुद्रः कण्ठे गौरी समाश्रिता । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ नमः शिवाय साम्बसदाशिवाय कलशदेवताभ्यो नमः ॥',
      englishMeaning: 'In the mouth of the Kalasha dwells Lord Rudra (Shiva), at the neck Mother Gauri (Devi), at the base Brahma, and in the middle the Divine Matrikas. May sacred Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri sanctify this water. Salutations to Samba Sadashiva.',
      audioSpeechText: {
        kn: 'ಕಲಶ ಸ್ಥಾಪನೆ ಮತ್ತು ಶಿವ-ಗೌರೀ ಆವಾಹನ. ಕಲಶಸ್ಯ ಮುಖೇ ರುದ್ರಃ ಕಂಠೇ ಗೌರೀ ಸಮಾಶ್ರಿತಾ, ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ. ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ, ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು. ಓಂ ನಮಃ ಶಿವಾಯ, ಸಾಂಬಸದಾಶಿವ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ, ಪ್ರಾರ್ಥಯಾಮಿ.',
        hi: 'कलश स्थापना एवं शिव-गौरी आह्वान। कलशस्य मुखे रुद्रः कण्ठे गौरी समाश्रिता, मूल में ब्रह्मा और मध्य में मातृगण स्थित हैं। हे गङ्गा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु और कावेरी, इस पावन जल में पधारें। ॐ नमः शिवाय, कलश देवता को प्रणाम करें।',
        en: 'Kalasha Sthapana and Shiva-Gauri Invocation. In this sanctified vessel reside Lord Rudra, Mother Gauri, Brahma, and the Divine Mothers. We invoke the seven holy rivers Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri. Salutations to Samba Sadashiva.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-5-akhanda-deepa',
      stepNumber: 5,
      title: {
        kn: '೫. ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ & ದುರ್ಗಾ-ಶಿವ ಗಾಯತ್ರೀ (Akhanda Deepa)',
        hi: '५. अखण्ड दीप प्रतिष्ठा एवं दुर्गा-शिव गायत्री (Akhanda Deepa)',
        en: '5. Akhanda Deepa & Durga-Shiva Gayatri'
      },
      ritualAction: {
        kn: 'ಧಾನ್ಯ ಪೀಠದ ಮೇಲೆ ದೀಪವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ತುಪ್ಪ/ಎಣ್ಣೆ ಹಾಕಿ, ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ಮುಖವಾಗಿ ದುರ್ಗಾ-ಶಿವ ಗಾಯತ್ರೀ ಜಪಿಸಿ ಜ್ಯೋತಿ ಬೆಳಗಿ.',
        hi: 'धान्य पीठ पर दीप स्थापित कर घृत या तिल तैल भरकर पूर्व अथवा उत्तर दिशा में दुर्गा-शिव गायत्री जपते हुए अखण्ड ज्योति प्रज्वलित करें।',
        en: 'Place lamp on grain altar, add cow ghee or sesame oil, and ignite facing East or North chanting the Durga-Shiva Gayatri.'
      },
      sanskritMantra: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥\nॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಓಂ ಗಿರಿಜಾಯೈ ಚ ವಿದ್ಮಹೇ ಶಿವಪ್ರಿಯಾಯೈ ಧೀಮಹಿ । ತನ್ನೋ ದುರ್ಗಾ ಪ್ರಚೋದಯಾತ್ ॥\nಓಂ ತತ್ಪುರುಷಾಯ ವಿದ್ಮಹೇ ಮಹಾದೇವಾಯ ಧೀಮಹಿ । ತನ್ನೋ ರುದ್ರಃ ಪ್ರಚೋದಯಾತ್ ॥\nಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ । ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥\nॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'Om, we meditate upon Goddess Girija, the beloved consort of Lord Shiva; may Divine Mother Durga inspire and illuminate our intellect. Om, we meditate upon Mahadeva Tatpurusha; may Lord Rudra guide our consciousness. Salutations to the sacred Flame.',
      audioSpeechText: {
        kn: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ದುರ್ಗಾ-ಶಿವ ಗಾಯತ್ರೀ. ಓಂ ಗಿರಿಜಾಯೈ ಚ ವಿದ್ಮಹೇ ಶಿವಪ್ರಿಯಾಯೈ ಧೀಮಹಿ, ತನ್ನೋ ದುರ್ಗಾ ಪ್ರಚೋದಯಾತ್. ಓಂ ತತ್ಪುರುಷಾಯ ವಿದ್ಮಹೇ ಮಹಾದೇವಾಯ ಧೀಮಹಿ, ತನ್ನೋ ರುದ್ರಃ ಪ್ರಚೋದಯಾತ್. ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮ್ ಆರೋಗ್ಯಂ ಧನಸಂಪದಃ, ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ. ಸಾಂಬಸದಾಶಿವ ದುರ್ಗಾಜ್ಯೋತಯೇ ನಮಃ.',
        hi: 'अखण्ड दीप प्रतिष्ठा एवं दुर्गा-शिव गायत्री। ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि, तन्नो दुर्गा प्रचोदयात्। ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि, तन्नो रुद्रः प्रचोदयात्। शुभं करोति कल्याणमारोग्यं धनसम्पदः, दीपज्योतिर्नमोऽस्तु ते। अखण्ड ज्योति को प्रणाम करें।',
        en: 'Akhanda Deepa Installation and Durga-Shiva Gayatri. Om Girijayai Cha Vidmahe Shiva-Priyayai Dheemahi, Tanno Durgah Prachodayat. Om Tatpurushaya Vidmahe Mahadevaya Dheemahi, Tanno Rudrah Prachodayat. Shubham Karoti Kalyanam. Salutations to the Divine Flame representing Shiva and Durga.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-6-shodashopachara',
      stepNumber: 6,
      title: {
        kn: '೬. ಶಿವ-ದುರ್ಗಾ ಷೋಡಶೋಪಚಾರ ಪೂಜಾ ಸಮರ್ಪಣೆ (16 Sacred Offerings)',
        hi: '६. शिव-दुर्गा षोडशोपचार पूजा समर्पण (१६ पावन उपचार)',
        en: '6. Shiva-Durga Shodashopachara Puja Samarpana (16 Upacharas)'
      },
      ritualAction: {
        kn: 'ಶಿವಲಿಂಗ ಹಾಗೂ ದುರ್ಗಾದೇವಿಯ ಮೂರ್ತಿಗೆ ಬಿಲ್ವಪತ್ರೆ, ಕುಂಕುಮ, ಹೂವು, ಧೂಪ, ದೀಪ, ನೈವೇದ್ಯ, ತಾಂಬೂಲ ಹಾಗೂ ಕರ್ಪೂರ ನೀರಾಜನ ಸಮರ್ಪಿಸಿ.',
        hi: 'शिवलिंग एवं माँ दुर्गा को बिल्वपत्र, कुंकुम, पुष्प, धूप, दीप, नैवेद्य, ताम्बूल एवं कर्पूर आरती अर्पित करें।',
        en: 'Offer Bilva leaves, Kumkum, flowers, incense, lamp, sweet Naivedya, betel leaves, and camphor Arati to Shiva and Devi.'
      },
      sanskritMantra: 'ॐ श्री साम्बसदाशिवाय दुर्गापरमेश्वर्यै नमः ।\nध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्राक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, स्नानान्ते दिव्यवस्त्रं, यज्ञोपवीतं, चन्दनं, कुङ्कुमं, बिल्वपत्र-पुष्पाणि पूजयामि, दिव्यधूपं, दीपं, महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनಂ समर्पयामि ॥',
      kannadaTranslit: 'ಓಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾಯ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ ।\nಧ್ಯಾಯಾಮಿ, ಆವಾಹಯಾಮಿ, ಆಸನಾರ್ಥೇ ಬಿಲ್ವಪತ್ರಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ, ಪಾದ್ಯಂ, ಅರ್ಘ್ಯಂ, ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ, ಸ್ನಾನಾಂತೇ ದಿವ್ಯವಸ್ತ್ರಂ, ಯಜ್ಞೋಪವೀತಂ, ಚಂದನಂ, ಕುಂಕುಮಂ, ಬಿಲ್ವಪತ್ರ-ಪುಷ್ಪಾಣಿ ಪೂಜಯಾಮಿ, ದಿವ್ಯಧೂಪಂ, ದೀಪಂ, ಮಹಾನೈವೇದ್ಯಂ, ತಾಂಬೂಲಂ, ಮಂಗಳಕರ್ಪೂರನೀರಾಜನಂ ಸಮರ್ಪಯಾಮಿ ॥',
      hindiTranslit: 'ॐ श्री साम्बसदाशिवाय दुर्गापरमेश्वर्यै नमः ।\nध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्राक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, स्नानान्ते दिव्यवस्त्रं, यज्ञोपवीतं, चन्दनं, कुङ्कुमं, बिल्वपत्र-पुष्पाणि पूजयामि, दिव्यधूपं, दीपं, महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनಂ समर्पयामि ॥',
      englishMeaning: 'Om, salutations to Sri Samba Sadashiva and Devi Durga Parameshwari. I meditate upon You, I welcome You, offering seat, holy water, divine garments, sacred Bilva leaves, flowers, sandalwood, incense, flame, sweet Naivedya, and camphor Arati.',
      audioSpeechText: {
        kn: 'ಶಿವ-ದುರ್ಗಾ ಷೋಡಶೋಪಚಾರ ಸಮರ್ಪಣೆ. ಓಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾಯ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ. ಧ್ಯಾಯಾಮಿ. ಆವಾಹಯಾಮಿ. ಆಸನಾರ್ಥೇ ಬಿಲ್ವಪತ್ರಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ. ಪಾದ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಅರ್ಘ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ. ಗಂಧಂ ಚಂದನಂ ಸಮರ್ಪಯಾಮಿ. ಕುಂಕುಮಾರ್ಚನಂ ಬಿಲ್ವಪತ್ರಾಣಿ ಸಮರ್ಪಯಾಮಿ. ಧೂಪಂ ಆಘ್ರಾಪಯಾಮಿ. ದೀಪಂ ದರ್ಶಯಾಮಿ. ಮಹಾನೈವೇದ್ಯಂ ನಿವೇದಯಾಮಿ. ತಾಂಬೂಲಂ ಸಮರ್ಪಯಾಮಿ. ಮಂಗಳ ಕರ್ಪೂರ ನೀರಾಜನಂ ಪ್ರದರ್ಶಯಾಮಿ.',
        hi: 'शिव-दुर्गा षोडशोपचार पूजन। ॐ श्री साम्बसदाशिवाय दुर्गापरमेश्वर्यै नमः। ध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्र अक्षत समर्पयामि। पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि। चन्दनं कुङ्कुमं बिल्वपत्राणि समर्पयामि। धूपं, दीपं, महानेवेद्यं, ताम्बूलं एवं मङ्गल कर्पूर आरती समर्पयामि।',
        en: 'Shiva-Durga Shodashopachara Samarpana. Salutations to Sri Samba Sadashiva and Devi Durga. We offer Dhyana, Avahana, Asana, Padyam, Arghyam, Achamaniyam, Gandham, Kumkum, sacred Bilva leaves, flowers, Dhoopam, Deepam, sweet Naivedya, Tambula, and sacred Camphor Arati.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-7-visarjana-shanti',
      stepNumber: 7,
      title: {
        kn: '೭. ಶಿವ-ಶಕ್ತಿ ಸಮರ್ಪಣ & ಶಾಂತಿ ಪಾಠ (Conclusion & Peace Prayer)',
        hi: '७. शिव-शक्ति समर्पण एवं शान्ति पाठ (कल्याण प्रार्थना)',
        en: '7. Shiva-Shakti Samarpana & Shanti Patha (Universal Peace)'
      },
      ritualAction: {
        kn: 'ಪೂಜೆಯ ಸಕಲ ಫಲವನ್ನು ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ಹಾಗೂ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿಗೆ ಸಮರ್ಪಿಸಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮಾಡಿ ಲೋಕಕಲ್ಯಾಣ ಶಾಂತಿ ಮಂತ್ರ ಪಠಿಸಿ.',
        hi: 'सम्पूर्ण पूजा का फल श्री साम्बसदाशिव एवं माँ दुर्गा को समर्पित करें एवं विश्व शान्ति की प्रार्थना करें।',
        en: 'Surrender all fruits of the puja to Sri Samba Sadashiva and Sri Durga Parameshwari, circumambulate clockwise and chant the Vedic Peace Invocations.'
      },
      sanskritMantra: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै शिवाय शक्त्यै इति समर्पयामि ॥\nसर्वं श्री साम्बसदाशिव दुर्गापरमेश्वरार्पणमस्तु ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान್ತಿರೋಷಧಯಃ ಶಾಂತಿಃ । ॐ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      kannadaTranslit: 'ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್ । ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ ಶಿವಾಯ ಶಕ್ತ್ಯೈ ಇತಿ ಸಮರ್ಪಯಾಮಿ ॥\nಸರ್ವಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ದುರ್ಗಾಪರಮೇಶ್ವರಾರ್ಪಣಮಸ್ತು ॥\nಓಂ ದ್ಯೌಃ ಶಾಂತಿಶ್ಚಾಂತರಿಕ್ಷಂ ಶಾಂತಿಃ ಪೃಥಿವೀ ಶಾಂತಿರಾಪಃ ಶಾಂತಿೋಷಧಯಃ ಶಾಂತಿಃ । ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      hindiTranslit: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै शिवाय शक्त्यै इति समर्पयामि ॥\nसर्वं श्री साम्बसदाशिव दुर्गापरमेश्वरार्पणमस्तु ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      englishMeaning: 'Whatever I perform through body, speech, mind, intellect, or senses, I surrender it all to Lord Shiva and Divine Mother Shakti. Everything is offered to Sri Samba Sadashiva and Sri Durga Parameshwari. Om Peace in the heavens, peace on earth, peace in water, peace in all herbs and creation. Om Shantih, Shantih, Shantih.',
      audioSpeechText: {
        kn: 'ಶಿವ-ಶಕ್ತಿ ಸಮರ್ಪಣ ಮತ್ತು ಶಾಂತಿ ಪಾಠ. ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ, ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್, ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ, ಶಿವಾಯ ಶಕ್ತ್ಯೈ ಇತಿ ಸಮರ್ಪಯಾಮಿ. ಸರ್ವಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ದುರ್ಗಾಪರಮೇಶ್ವರಾರ್ಪಣಮಸ್ತು. ಓಂ ದ್ಯೌಃ ಶಾಂತಿಃ, ಅಂತರಿಕ್ಷಂ ಶಾಂತಿಃ, ಪೃಥಿವೀ ಶಾಂತಿಃ, ಆಪಃ ಶಾಂತಿಃ, ಓಷಧಯಃ ಶಾಂತಿಃ. ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ. ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು.',
        hi: 'शिव-शक्ति समर्पण एवं शान्ति पाठ। कायेन वाचा मनसेन्द्रियैर्वा, करोमि यद्यत् सकलं परस्मै शिवाय शक्त्यै इति समर्पयामि। सर्वं श्री साम्बसदाशिव दुर्गापरमेश्वरार्पणमस्तु। ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिः। ॐ शान्तिः शान्तिः शान्तिः। सर्वे भवन्तु सुखिनः।',
        en: 'Shiva-Shakti Samarpana and Shanti Patha. Whatever has been performed through body, speech, and mind is consecrated to Shiva and Shakti. May all fruits be offered to Sri Samba Sadashiva and Sri Durga Parameshwari. Om Peace in heaven, peace on earth, peace in the waters, peace in all beings. Om Shantih, Shantih, Shantih.'
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
