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
  ChevronRight,
  ShieldCheck
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
  audioTrackFocus?: 'shiva' | 'devi';
  onAudioTrackFocusChange?: (focus: 'shiva' | 'devi') => void;
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
  audioTrackFocus: propAudioTrackFocus,
  onAudioTrackFocusChange,
  onStepChange
}) => {
  // Dual-track state: 'shiva' or 'devi'
  const [activeTrack, setActiveTrack] = useState<'shiva' | 'devi'>(() => {
    if (propAudioTrackFocus) return propAudioTrackFocus;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcmm_audio_track_focus');
      if (saved === 'shiva' || saved === 'devi') return saved;
    }
    return 'shiva';
  });

  // Keep synced with parent prop if provided
  useEffect(() => {
    if (propAudioTrackFocus && propAudioTrackFocus !== activeTrack) {
      setActiveTrack(propAudioTrackFocus);
    }
  }, [propAudioTrackFocus]);

  const handleTrackChange = (newTrack: 'shiva' | 'devi') => {
    setActiveTrack(newTrack);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hcmm_audio_track_focus', newTrack);
    }
    onAudioTrackFocusChange?.(newTrack);
    // Restart audio if playing
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

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

  // =========================================================================
  // DUAL-TRACK RITUAL AUDIO STEPS: SHIVA-FOCUSED vs DEVI-FOCUSED
  // =========================================================================

  // 1. SHIVA-FOCUSED RITUAL AUDIO STEPS (Strictly Shiva / Sadashiva / Rudra)
  const SHIVA_AUDIO_STEPS: RitualAudioStep[] = [
    {
      id: 'step-1-achamana',
      stepNumber: 1,
      title: {
        kn: '೧. ಶಿವ ಸಾಂಬಸದಾಶಿವ ಆಚಮನ & ಪ್ರಾಣಾಯಾಮ (Shiva Achamana)',
        hi: '१. शिव साम्बसदाशिव आचमन एवं प्राणायाम',
        en: '1. Shiva-focused Achamana & Pranayama (Purification)'
      },
      ritualAction: {
        kn: 'ಬಲ ಅಂಗೈಗೆ ಉದ್ಧರಣೆಯಿಂದ ಮೂರು ಬಾರಿ ಜಲ ಹಾಕಿ ಶಿವ ಮಂತ್ರಗಳಿಂದ ಆಚಮನ ಮಾಡಿ, ಶಿವ ಪಂಚಮುಖ ಧ್ಯಾನದೊಂದಿಗೆ ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ.',
        hi: 'दाहिने हाथ में तीन बार जल लेकर ॐ शिवाय स्वाहा, ॐ महेश्वराय स्वाहा, ॐ शम्भवे स्वाहा से आचमन करें एवं शिव-पञ्चमुख ध्यान करें।',
        en: 'Sip holy water 3 times from your right palm chanting Om Shivaya Svaha, Om Maheshvaraya Svaha, Om Shambhave Svaha, then perform Pranayama.'
      },
      sanskritMantra: 'ॐ शिवाय स्वाहा । ॐ महेश्वराय स्वाहा । ॐ शम्भवे स्वाहा ।\nॐ सदाशिवाय नमः । ॐ ईशानाय नमः । ॐ तत्पुरुषाय नमः । ॐ अघोराय नमः । ॐ वामदेवाय नमः । ॐ सद्योजाताय नमः ॥',
      kannadaTranslit: 'ಓಂ ಶಿವಾಯ ಸ್ವಾಹಾ । ಓಂ ಮಹೇಶ್ವರಾಯ ಸ್ವಾಹಾ । ಓಂ ಶಂಭವೇ ಸ್ವಾಹಾ ।\nಓಂ ಸದಾಶಿವಾಯ ನಮಃ । ಓಂ ಈಶಾನಾಯ ನಮಃ । ಓಂ ತತ್ಪುರುಷಾಯ ನಮಃ । ಓಂ ಅಘೋರಾಯ ನಮಃ । ಓಂ ವಾಮದೇವಾಯ ನಮಃ । ಓಂ ಸದ್ಯೋಜಾತಾಯ ನಮಃ ॥',
      hindiTranslit: 'ॐ शिवाय स्वाहा । ॐ महेश्वराय स्वाहा । ॐ शम्भवे स्वाहा ।\nॐ सदाशिवाय नमः । ॐ ईशानाय नमः । ॐ तत्पुरुषाय नमः । ॐ अघोराय नमः । ॐ वामदेवाय नमः । ॐ सद्योजाताय नमः ॥',
      englishMeaning: 'Salutations to Lord Shiva through consecrated water sips: Om Shivaya Svaha, Om Maheshvaraya Svaha, Om Shambhave Svaha. Salutations to Sadashiva, Ishana, Tatpurusha, Aghora, Vamadeva, and Sadyojata. May all inner sheaths be sanctified.',
      audioSpeechText: {
        kn: 'ಪ್ರಥಮವಾಗಿ ಶಿವ ಆಚಮನ. ಬಲ ಅಂಗೈಗೆ ಜಲ ಹಾಕಿ ಆಚಮನ ಮಾಡಿ: ಓಂ ಶಿವಾಯ ಸ್ವಾಹಾ. ಓಂ ಮಹೇಶ್ವರಾಯ ಸ್ವಾಹಾ. ಓಂ ಶಂಭವೇ ಸ್ವಾಹಾ. ಹಸ್ತ ತೊಳೆಯಿರಿ. ಓಂ ಸದಾಶಿವಾಯ ನಮಃ. ಓಂ ಈಶಾನಾಯ ನಮಃ. ಓಂ ತತ್ಪುರುಷಾಯ ನಮಃ. ಶಿವ ಪಂಚಮುಖ ಧ್ಯಾನದೊಂದಿಗೆ ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ ಪವಿತ್ರರಾಗಿ.',
        hi: 'प्रथम चरण शिव आचमन। दाहिने हाथ में जल लेकर आचमन करें: ॐ शिवाय स्वाहा। ॐ महेश्वराय स्वाहा। ॐ शम्भवे स्वाहा। हाथ धोएं। ॐ सदाशिवाय नमः, ॐ ईशानाय नमः, ॐ तत्पुरुषाय नमः। शिव पञ्चमुख ध्यान के साथ प्राणायाम करें।',
        en: 'Step one: Shiva Achamana. Sip sacred water: Om Shivaya Svaha, Om Maheshvaraya Svaha, Om Shambhave Svaha. Wash hands. Om Sadashivaya Namaha. Om Ishanaya Namaha. Consecrate breath and senses with Shiva Pranayama.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-2-ghanta-deepa',
      stepNumber: 2,
      title: {
        kn: '೨. ಘಂಟಾನಾದ & ಮಹಾದೇವ ಸದಾಶಿವ ದೀಪ ಪ್ರಣಾಮ (Shiva Altar Invocation)',
        hi: '२. घण्टानाद एवं महेश्वर सदाशिव दीप प्रणाम',
        en: '2. Ghanta & Sadashiva Deepa Pranam (Shiva Altar Sanctification)'
      },
      ritualAction: {
        kn: 'ಘಂಟೆ ಬಾರಿಸುತ್ತಾ ಶಿವಗಣಗಳನ್ನು ಆಹ್ವಾನಿಸಿ, ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಸಾಕ್ಷಾತ್ ಮಹಾದೇವ ಸದಾಶಿವನ ಜ್ಯೋತಿರ್ಮಯ ಸ್ವರೂಪವೆಂದು ನಮಸ್ಕರಿಸಿ.',
        hi: 'घण्टी बजाकर शिव एवं शिवगणों का आह्वान करें एवं दीपक की ज्योति को साक्षात् सदाशिव ज्योतिर्लिङ्ग स्वरूप मानकर प्रणाम करें।',
        en: 'Ring the temple bell invoking Lord Shiva and His divine Ganas, revering the sacred flame as the Jyotirlinga manifestation of Sadashiva.'
      },
      sanskritMantra: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शिवसङ्कीर्तन लक्षणम् ॥\nदीपज्योतिः सदाशिवः दीपज्योतिर्महेश्वरः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್ । ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಿವಸಂಕೀರ್ತನ ಲಕ್ಷಣಮ್ ॥\nದೀಪಜ್ಯೋತಿಃ ಸದಾಶಿವಃ ದೀಪಜ್ಯೋತಿರ್ಮಹೇಶ್ವರಃ । ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शिवसङ्कीर्तन लक्षणम् ॥\nदीपज्योतिः सदाशिवः दीपज्योतिर्महेश्वरः । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'I ring this auspicious bell to welcome Lord Shiva and all celestial protectors, while dispelling negative energies. The sacred flame is Sadashiva and Maheshvara. O Divine Flame, dissolve all ignorance and afflictions.',
      audioSpeechText: {
        kn: 'ಘಂಟಾನಾದ ಮತ್ತು ಶಿವ ದೀಪ ಪ್ರಣಾಮ. ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್, ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಿವಸಂಕೀರ್ತನ ಲಕ್ಷಣಮ್. ದೀಪಜ್ಯೋತಿಃ ಸದಾಶಿವಃ ದೀಪಜ್ಯೋತಿರ್ಮಹೇಶ್ವರಃ, ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ.',
        hi: 'घण्टानाद एवं शिव दीप प्रणाम। आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम्, कुर्वे घण्टारवं तत्र शिवसङ्कीर्तन लक्षणम्। दीपज्योतिः सदाशिवः दीपज्योतिर्महेश्वरः, दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते।',
        en: 'Ghanta Nada and Shiva Deepa Pranam. We ring the bell chanting Shiva sankirtana. The light of the flame is Sadashiva and Maheshvara. Salutations to the Divine Light.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-3-desha-kala-sankalpa',
      stepNumber: 3,
      title: {
        kn: '೩. ದೇಶ ಕಾಲ ಶಿವ ಸಂಕಲ್ಪ (Personalized Shiva Sankalpa)',
        hi: '३. देश काल शिव संकल्प (Vedic Shiva Oath)',
        en: '3. Desha Kala Shiva Sankalpa (Personalized Shiva Oath)'
      },
      ritualAction: {
        kn: 'ಬಲಗೈಯಲ್ಲಿ ಅಕ್ಷತೆ, ಬಿಲ್ವಪತ್ರೆ ಹಾಗೂ ತೀರ್ಥ ಹಿಡಿದು, ಪರಮೇಶ್ವರ ಸಾಂಬಸದಾಶಿವನ ಪ್ರೀತ್ಯರ್ಥವಾಗಿ ಈ ದಿನದ ಪಂಚಾಂಗದೊಂದಿಗೆ ಸಂಕಲ್ಪ ಪಠಿಸಿ.',
        hi: 'दाहिने हाथ में अक्षत, बिल्वपत्र एवं जल लेकर भगवान साम्बसदाशिव की प्रसन्नता हेतु आज के पञ्चाङ्ग सहित संकल्प पाठ करें।',
        en: 'Hold Akshata, sacred Bilva leaf, and water in your right palm while chanting this personalized Vedic Sankalpa for the grace of Samba Sadashiva.'
      },
      sanskritMantra: `ॐ नमಃ शिवाय । श्री साम्बसदाशिवाय नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... શ્રી साम्बसदाशिव प्रीत्यर्थं श्री ${granthaName || 'रुद्राध्याय'} पूजा कर्म करिष्ये ॥`,
      kannadaTranslit: `ಓಂ ನಮಃ ಶಿವಾಯ । ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾಯ ನಮಃ ।\nಅದ್ಯ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯೇ ಪರಾರ್ಧೇ ಶ್ರೀಶ್ವೇತವಾರಾಹಕಲ್ಪೇ ವೈವಸ್ವತಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮಚರಣೇ ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ ಭರತಖಂಡೇ...\n${cityName} ಕ್ಷೇತ್ರೇ... ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ... ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ ಪ್ರೀತ್ಯರ್ಥಂ ಶ್ರೀ ${granthaName || 'ರುದ್ರಾಧ್ಯಾಯ'} ಪೂಜಾ ಕರ್ಮ ಕರಿಷ್ಯೇ ॥`,
      hindiTranslit: `ॐ नमः शिवाय । श्री साम्बसदाशिवाय नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री साम्बसदाशिव प्रीत्यर्थं श्री ${granthaName || 'रुद्राध्याय'} पूजा कर्म करिष्ये ॥`,
      englishMeaning: `Om Namah Shivaya. In ${cityName}, during ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} constellation, for the supreme love and grace of Sri Samba Sadashiva, I solemnly perform this sacred puja and Vedic recitation.`,
      audioSpeechText: {
        kn: `ದೇಶ ಕಾಲ ಶಿವ ಸಂಕಲ್ಪ. ಓಂ ನಮಃ ಶಿವಾಯ. ಶ್ರೀ ಸಾಂಬ ಸದಾಶಿವ ಚರಣಾರವಿಂದಯೋಃ ಪ್ರಣಾಮ. ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ, ${cityName} ಕ್ಷೇತ್ರೇ, ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ, ಶ್ರೀ ಸಾಂಬ ಸದಾಶಿವ ಪ್ರೀತ್ಯರ್ಥಂ, ಧರ್ಮಾರ್ಥ ಕಾಮಮೋಕ್ಷ ಫಲ ಸಿದ್ಧ್ಯರ್ಥಂ, ಶ್ರೀ ${granthaName || 'ರುದ್ರಾಧ್ಯಾಯ'} ಪಾರಾಯಣ ಪೂಜಾ ಸಂಕಲ್ಪಂ ಕರಿಷ್ಯೇ. ಜಲವನ್ನು ಪಾತ್ರೆಗೆ ಬಿಡಿ.`,
        hi: `देश काल शिव संकल्प। ॐ नमः शिवाय। श्री साम्ब सदाशिव चरणारविन्दयोः प्रणाम। जम्बूद्वीपे भारतवर्षे, ${cityName} क्षेत्रे, ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ, श्री साम्ब सदाशिव प्रीत्यर्थं, श्री ${granthaName || 'रुद्राध्याय'} पूजन संकल्पं करिष्ये। जल पात्र में छोड़ें।`,
        en: `Desha Kala Shiva Sankalpa. Om Namah Shivaya. Salutations to Sri Samba Sadashiva. In ${cityName}, in ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} star, for the supreme grace of Lord Shiva, I undertake this sacred puja of ${granthaName || 'Rudradhyaya'}. Gently release water into the plate.`
      },
      audioBellAtStart: true
    },
    {
      id: 'step-4-kalasha-sthapana',
      stepNumber: 4,
      title: {
        kn: '೪. ಕಲಶ ಸ್ಥಾಪನೆ & ರುದ್ರ-ಗಂಗಾಧರ ವರುಣ ಆವಾಹನ (Shiva Kalasha)',
        hi: '४. कलश स्थापना एवं रुद्र-गङ्गाधर वरुण आह्वान',
        en: '4. Kalasha Sthapana & Rudra-Gangadhara Invocation'
      },
      ritualAction: {
        kn: 'ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶಕ್ಕೆ ಗಂಗಾಜಲ ತುಂಬಿ, ಪಂಚಪಲ್ಲವ, ನಾಣ್ಯ, ಅಡಿಕೆ ಹಾಕಿ ತೆಂಗಿನಕಾಯಿ ಇರಿಸಿ, ಕಂಠದಲ್ಲಿ ರುದ್ರ-ಗಂಗಾಧರನನ್ನು ಆವಾಹಿಸಿ.',
        hi: 'कलश में शुद्ध जल, पंचपल्लव, सुपारी, सिक्का डालकर नारियल स्थापित करें एवं भगवान रुद्र-गङ्गाधर व सप्त सरिताओं की वन्दना करें।',
        en: 'Fill holy vessel with water, add 5 mango leaves, betel nut, coin, crown with coconut, and invoke Rudra-Gangadhara and the sacred rivers.'
      },
      sanskritMantra: 'कलशस्य मुखे रुद्रः कण्ठे नीलकण्ठः समाश्रितः । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ शिवाय साम्बसदाशिवाय कलशदेवताभ्यो नमः ॥',
      kannadaTranslit: 'ಕಲಶಸ್ಯ ಮುಖೇ ರುದ್ರಃ ಕಂಠೇ ನೀಲಕಂಠಃ ಸಮಾಶ್ರಿತಃ । ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ॥\nಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ । ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ॥\nಓಂ ಶಿವಾಯ ಸಾಂಬಸದಾಶಿವಾಯ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ ॥',
      hindiTranslit: 'कलशस्य मुखे रुद्रः कण्ठे नीलकण्ठः समाश्रितः । मूले तत्र स्थितो ब्रह्मा मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ शिवाय साम्बसदाशिवाय कलशदेवताभ्यो नमः ॥',
      englishMeaning: 'In the mouth of the Kalasha dwells Lord Rudra, in the neck Nilakantha, at the base Brahma, and in the middle the Divine Matrikas. May holy Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri sanctify this water. Salutations to Lord Shiva.',
      audioSpeechText: {
        kn: 'ಕಲಶ ಸ್ಥಾಪನೆ ಮತ್ತು ರುದ್ರ-ಗಂಗಾಧರ ಆವಾಹನ. ಕಲಶಸ್ಯ ಮುಖೇ ರುದ್ರಃ ಕಂಠೇ ನೀಲಕಂಠಃ ಸಮಾಶ್ರಿತಃ, ಮೂಲೇ ತತ್ರ ಸ್ಥಿತೋ ಬ್ರಹ್ಮಾ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ. ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ, ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು. ಓಂ ನಮಃ ಶಿವಾಯ, ಸಾಂಬಸದಾಶಿವ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ, ಪ್ರಾರ್ಥಯಾಮಿ.',
        hi: 'कलश स्थापना एवं रुद्र-गङ्गाधर आह्वान। कलशस्य मुखे रुद्रः कण्ठे नीलकण्ठः समाश्रितः। हे गङ्गा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु और कावेरी, इस पावन जल में पधारें। ॐ शिवाय साम्बसदाशिवाय कलश देवता को प्रणाम करें।',
        en: 'Kalasha Sthapana and Rudra-Gangadhara Invocation. Lord Rudra and Nilakantha reside within the sacred vessel. We invoke the holy rivers Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri. Salutations to Shiva in the Kalasha.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-5-akhanda-deepa',
      stepNumber: 5,
      title: {
        kn: '೫. ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ & ಮಹಾದೇವ ರುದ್ರ ಗಾಯತ್ರೀ (Shiva Gayatri Deepa)',
        hi: '५. अखण्ड दीप प्रतिष्ठा एवं महादेव रुद्र गायत्री',
        en: '5. Akhanda Deepa & Mahadeva Rudra Gayatri'
      },
      ritualAction: {
        kn: 'ಧಾನ್ಯ ಪೀಠದ ಮೇಲೆ ದೀಪವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ತುಪ್ಪ/ಎಣ್ಣೆ ಹಾಕಿ, ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ಮುಖವಾಗಿ ಮಹಾದೇವ ರುದ್ರ ಗಾಯತ್ರೀ ಜಪಿಸಿ ಜ್ಯೋತಿ ಬೆಳಗಿ.',
        hi: 'धान्य पीठ पर दीप स्थापित कर घृत या तिल तैल भरकर पूर्व अथवा उत्तर दिशा में महादेव रुद्र गायत्री जपते हुए अखण्ड ज्योति प्रज्वलित करें।',
        en: 'Place lamp on grain altar, add cow ghee or sesame oil, and ignite facing East or North chanting the Mahadeva Rudra Gayatri.'
      },
      sanskritMantra: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥\nॐ नमो भगवते रुद्राय दीपज्योतिः स्वरूपिणे नमः ॥',
      kannadaTranslit: 'ಓಂ ತತ್ಪುರುಷಾಯ ವಿದ್ಮಹೇ ಮಹಾದೇವಾಯ ಧೀಮಹಿ । ತನ್ನೋ ರುದ್ರಃ ಪ್ರಚೋದಯಾತ್ ॥\nಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ । ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥\nಓಂ ನಮೋ ಭಗವತೇ ರುದ್ರಾಯ ದೀಪಜ್ಯೋತಿಃ ಸ್ವರೂಪಿಣೇ ನಮಃ ॥',
      hindiTranslit: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि । तन्नो रुद्रः प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥\nॐ नमो भगवते रुद्राय दीपज्योतिः स्वरूपिणे नमः ॥',
      englishMeaning: 'Om, we meditate upon Mahadeva Tatpurusha; may Lord Rudra enlighten and inspire our consciousness. The light brings auspiciousness, health, and spiritual wealth. Salutations to Lord Rudra manifested as the sacred flame.',
      audioSpeechText: {
        kn: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ಮಹಾದೇವ ರುದ್ರ ಗಾಯತ್ರೀ. ಓಂ ತತ್ಪುರುಷಾಯ ವಿದ್ಮಹೇ ಮಹಾದೇವಾಯ ಧೀಮಹಿ, ತನ್ನೋ ರುದ್ರಃ ಪ್ರಚೋದಯಾತ್. ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮ್ ಆರೋಗ್ಯಂ ಧನಸಂಪದಃ, ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ. ರುದ್ರಜ್ಯೋತಯೇ ನಮಃ.',
        hi: 'अखण्ड दीप प्रतिष्ठा एवं महादेव रुद्र गायत्री। ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि, तन्नो रुद्रः प्रचोदयात्। शुभं करोति कल्याणमारोग्यं धनसम्पदः, दीपज्योतिर्नमोऽस्तु ते। अखण्ड रुद्र ज्योति को प्रणाम करें।',
        en: 'Akhanda Deepa Installation and Mahadeva Rudra Gayatri. Om Tatpurushaya Vidmahe Mahadevaya Dheemahi, Tanno Rudrah Prachodayat. Shubham Karoti Kalyanam. Salutations to the Divine Flame representing Lord Rudra.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-6-shodashopachara',
      stepNumber: 6,
      title: {
        kn: '೬. ಶಿವ ಷೋಡಶೋಪಚಾರ ಬಿಲ್ವಾರ್ಚನ ಪೂಜಾ ಸಮರ್ಪಣೆ (Shiva 16 Offerings)',
        hi: '६. शिव षोडशोपचार बिल्वार्चन पूजा समर्पण',
        en: '6. Shiva Shodashopachara Bilvarchana Puja (16 Holy Offerings)'
      },
      ritualAction: {
        kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಭಸ್ಮ, ಗಂಗಾಜಲ, ಶ್ರೀಗಂಧ, ರುದ್ರಾಕ್ಷಿ ಹಾಗೂ ತ್ರಿಶೂಲದ ದಳಗಳ ಬಿಲ್ವಪತ್ರೆಗಳನ್ನು ಸಮರ್ಪಿಸಿ ಷೋಡಶೋಪಚಾರ ಪೂಜೆ ನೆರವೇರಿಸಿ.',
        hi: 'शिवलिंग पर भस्म, गङ्गाजल, चन्दन, रुद्राक्ष एवं त्रिशूलाकार बिल्वपत्र अर्पित करते हुए षोडशोपचार पूजा सम्पन्न करें।',
        en: 'Offer sacred Vibhuti/Bhasma, Gangajala, Chandana, Rudraksha, and sacred Bilva leaves to Lord Shiva during the 16 Vedic upacharas.'
      },
      sanskritMantra: 'ॐ श्री साम्बसदाशिवाय नमः ।\nध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्राक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, गङ्गाजल-स्नानं, भस्म-लेपनं, दिव्यचन्दनं, रुद्राक्षमालां, बिल्वपत्र-पुष्पाणि पूजयामि, दिव्यधूपं, दीपं, महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनं समर्पयामि ॥',
      kannadaTranslit: 'ಓಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾಯ ನಮಃ ।\nಧ್ಯಾಯಾಮಿ, ಆವಾಹಯಾಮಿ, ಆಸನಾರ್ಥೇ ಬಿಲ್ವಪತ್ರಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ, ಪಾದ್ಯಂ, ಅರ್ಘ್ಯಂ, ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ, ಗಂಗಾಜಲ-ಸ್ನಾನಂ, ಭಸ್ಮ-ಲೇಪನಂ, ದಿವ್ಯಚಂದನಂ, ರುದ್ರಾಕ್ಷಮಾಲಾಂ, ಬಿಲ್ವಪತ್ರ-ಪುಷ್ಪಾಣಿ ಪೂಜಯಾಮಿ, ದಿವ್ಯಧೂಪಂ, ದೀಪಂ, ಮಹಾನೈವೇದ್ಯಂ, ತಾಂಬೂಲಂ, ಮಂಗಳಕರ್ಪೂರನೀರಾಜನಂ ಸಮರ್ಪಯಾಮಿ ॥',
      hindiTranslit: 'ॐ श्री साम्बसदाशिवाय नमः ।\nध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्राक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, गङ्गाजल-स्नानं, भस्म-लेपनं, दिव्यचन्दनं, रुद्राक्षमालां, बिल्वपत्र-पुष्पाणि पूजयामि, दिव्यधूपं, दीपं, महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनं समर्पयामि ॥',
      englishMeaning: 'Om, salutations to Sri Samba Sadashiva. I meditate and invoke Lord Shiva, offering seat of Bilva leaves, holy washings, sacred Gangajala bath, holy Vibhuti ash, divine Chandana, Rudraksha garland, Bilva leaves, incense, lamp, Mahanaivedya, and camphor Arati.',
      audioSpeechText: {
        kn: 'ಶಿವ ಷೋಡಶೋಪಚಾರ ಬಿಲ್ವಾರ್ಚನ ಸಮರ್ಪಣೆ. ಓಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾಯ ನಮಃ. ಧ್ಯಾಯಾಮಿ. ಆವಾಹಯಾಮಿ. ಆಸನಾರ್ಥೇ ಬಿಲ್ವಪತ್ರಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ. ಪಾದ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಅರ್ಘ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ. ಗಂಗಾಜಲ ಸ್ನಾನಂ ಸಮರ್ಪಯಾಮಿ. ಭಸ್ಮ-ಲೇಪನಂ ಚಂದನಂ ಸಮರ್ಪಯಾಮಿ. ಬಿಲ್ವಪತ್ರಾಣಿ ಸಮರ್ಪಯಾಮಿ. ದಿವ್ಯ ಧೂಪಂ ಆಘ್ರಾಪಯಾಮಿ. ದೀಪಂ ದರ್ಶಯಾಮಿ. ಮಹಾನೈವೇದ್ಯಂ ನಿವೇದಯಾಮಿ. ತಾಂಬೂಲಂ ಸಮರ್ಪಯಾಮಿ. ಮಂಗಳ ಕರ್ಪೂರ ನೀರಾಜನಂ ಪ್ರದರ್ಶಯಾಮಿ.',
        hi: 'शिव षोडशोपचार बिल्वार्चन पूजन। ॐ श्री साम्बसदाशिवाय नमः। ध्यायामि, आवाहयामि, आसनार्थे बिल्वपत्र अक्षत समर्पयामि। गङ्गाजल स्नानं, भस्म लेपनं, चन्दनं, रुद्राक्षं, बिल्वपत्राणि समर्पयामि। धूपं, दीपं, महानेवेद्यं, ताम्बूलं एवं मङ्गल कर्पूर आरती समर्पयामि।',
        en: 'Shiva Shodashopachara Bilvarchana Samarpana. Salutations to Sri Samba Sadashiva. We offer Dhyana, Avahana, Bilva asana, Padyam, Gangajala snanam, sacred Bhasma ash, Chandana, Rudraksha, sacred Bilva leaves, Dhoopam, Deepam, Naivedya, and Camphor Arati.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-7-visarjana-shanti',
      stepNumber: 7,
      title: {
        kn: '೭. ಶಿವ ಸಾಂಬಸದಾಶಿವ ಸಮರ್ಪಣ & ಶಾಂತಿ ಪಾಠ (Shiva Samarpana & Peace)',
        hi: '७. शिव साम्बसदाशिव समर्पण एवं शान्ति पाठ',
        en: '7. Shiva Samarpana & Shanti Patha (Universal Peace Invocations)'
      },
      ritualAction: {
        kn: 'ಪೂಜೆಯ ಸಕಲ ಫಲವನ್ನು ಶ್ರೀ ಸಾಂಬಸದಾಶಿವನಿಗೆ ಸಮರ್ಪಿಸಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮಾಡಿ ಲೋಕಕಲ್ಯಾಣ ಶಾಂತಿ ಮಂತ್ರ ಪಠಿಸಿ.',
        hi: 'सम्पूर्ण पूजा का फल भगवान साम्बसदाशिव को समर्पित करें एवं विश्व शान्ति की प्रार्थना करें।',
        en: 'Surrender all fruits of the puja to Sri Samba Sadashiva, perform pradakshina, and chant the Vedic Shanti invocations.'
      },
      sanskritMantra: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै शिवाय साम्बसदाशिवाय इति समर्पयामि ॥\nसर्वं श्री साम्बसदाशिवार্পಣಮಸ್ತು ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      kannadaTranslit: 'ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್ । ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ ಶಿವಾಯ ಸಾಂಬಸದಾಶಿವಾಯ ಇತಿ ಸಮರ್ಪಯಾಮಿ ॥\nಸರ್ವಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾರ್ಪಣಮಸ್ತು ॥\nಓಂ ದ್ಯೌಃ ಶಾಂತಿಶ್ಚಾಂತರಿಕ್ಷಂ ಶಾಂತಿಃ ಪೃಥಿವೀ ಶಾಂತಿರಾಪಃ ಶಾಂತಿೋಷಧಯಃ ಶಾಂತಿಃ । ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      hindiTranslit: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै शिवाय साम्बसदाशिवाय इति समर्पयामि ॥\nसर्वं श्री साम्बसदाशिवार্পणमस्तु ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      englishMeaning: 'Whatever I have performed through body, speech, mind, senses, intellect, or nature, I surrender it all unto Lord Shiva, Sri Samba Sadashiva. Everything is offered to Shambhu. Om Peace in high heavens, peace in mid-space, peace on earth, peace in water, peace in all medicinal plants. Om Shantih, Shantih, Shantih.',
      audioSpeechText: {
        kn: 'ಶಿವ ಸಮರ್ಪಣ ಮತ್ತು ಶಾಂತಿ ಪಾಠ. ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ, ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್, ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ, ಶಿವಾಯ ಸಾಂಬಸದಾಶಿವಾಯ ಇತಿ ಸಮರ್ಪಯಾಮಿ. ಸರ್ವಂ ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಾರ್ಪಣಮಸ್ತು. ಓಂ ದ್ಯೌಃ ಶಾಂತಿಃ, ಅಂತರಿಕ್ಷಂ ಶಾಂತಿಃ, ಪೃಥಿವೀ ಶಾಂತಿಃ, ಆಪಃ ಶಾಂತಿಃ, ಓಷಧಯಃ ಶಾಂತಿಃ. ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ. ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು.',
        hi: 'शिव समर्पण एवं शान्ति पाठ। कायेन वाचा मनसेन्द्रियैर्वा, करोमि यद्यत् सकलं परस्मै शिवाय साम्बसदाशिवाय इति समर्पयामि। सर्वं श्री साम्बसदाशिवार্পणमस्तु। ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिः। ॐ शान्तिः शान्तिः शान्तिः। सर्वे भवन्तु सुखिनः।',
        en: 'Shiva Samarpana and Shanti Patha. Whatever has been performed through body, speech, and mind is consecrated to Lord Samba Sadashiva. May all fruits be offered to Shiva. Om Peace in heaven, peace on earth, peace in waters, peace in herbs. Om Shantih, Shantih, Shantih.'
      },
      audioBellAtStart: true
    }
  ];

  // 2. DEVI-FOCUSED RITUAL AUDIO STEPS (Strictly Devi / Durga / Parashakti / Jagadamba)
  const DEVI_AUDIO_STEPS: RitualAudioStep[] = [
    {
      id: 'step-1-achamana',
      stepNumber: 1,
      title: {
        kn: '೧. ಪರಾಶಕ್ತಿ ಜಗನ್ಮಾತಾ ಆಚಮನ & ಪ್ರಾಣಾಯಾಮ (Devi Achamana)',
        hi: '१. पराशक्ति जगन्माता आचमन एवं प्राणायाम',
        en: '1. Devi-focused Parashakti Achamana & Pranayama'
      },
      ritualAction: {
        kn: 'ಬಲ ಅಂಗೈಗೆ ಉದ್ಧರಣೆಯಿಂದ ಮೂರು ಬಾರಿ ಜಲ ಹಾಕಿ ಜಗನ್ಮಾತೆ ಪರಾಶಕ್ತಿ ಮಂತ್ರದಿಂದ ಆಚಮನ ಮಾಡಿ (ಓಂ ಪರಾಶಕ್ತ್ಯೈ ಸ್ವಾಹಾ...), ಮಾತೃನ್ಯಾಸ ಮಾಡಿ ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ.',
        hi: 'दाहिने हाथ में तीन बार जल लेकर ॐ पराशक्त्यै स्वाहा, ॐ महालक्ष्म्यै स्वाहा, ॐ महासरस्वत्यै स्वाहा से आचमन करें एवं भगवती शक्ति ध्यान करें।',
        en: 'Sip holy water 3 times from your right palm chanting Om Parashaktyai Svaha, Om Mahalakshmyai Svaha, Om Mahasarasvatyai Svaha, then perform Pranayama.'
      },
      sanskritMantra: 'ॐ पराशक्त्यै स्वाहा । ॐ महालक्ष्म्यै स्वाहा । ॐ महासरस्वत्यै स्वाहा ।\nॐ उमायै नमः । ॐ दुर्गायै नमः । ॐ पार्वत्यै नमः । ॐ भवान्यै नमः । ॐ चण्डिकायै नमः । ॐ ललितायै नमः ॥',
      kannadaTranslit: 'ಓಂ ಪರಾಶಕ್ತ್ಯೈ ಸ್ವಾಹಾ । ಓಂ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ಸ್ವಾಹಾ । ಓಂ ಮಹಾಸರಸ್ವತ್ಯೈ ಸ್ವಾಹಾ ।\nಓಂ ಉಮಾಯೈ ನಮಃ । ಓಂ ದುರ್ಗಾಯೈ ನಮಃ । ಓಂ ಪಾರ್ವತ್ಯೈ ನಮಃ । ಓಂ ಭವಾನ್ಯೈ ನಮಃ । ಓಂ ಚಂಡಿಕಾಯೈ ನಮಃ । ಓಂ ಲಲಿತಾಯೈ ನಮಃ ॥',
      hindiTranslit: 'ॐ पराशक्त्यै स्वाहा । ॐ महालक्ष्म्यै स्वाहा । ॐ महासरस्वत्यै स्वाहा ।\nॐ उमायै नमः । ॐ दुर्गायै नमः । ॐ पार्वत्यै नमः । ॐ भवान्यै नमः । ॐ चण्डिकायै नमः । ॐ ललितायै नमः ॥',
      englishMeaning: 'Salutations to Divine Mother Parashakti through holy sips: Om Parashaktyai Svaha, Om Mahalakshmyai Svaha, Om Mahasarasvatyai Svaha. Salutations to Uma, Durga, Parvati, Bhavani, Chandika, and Lalita. May our body, speech, and soul be consecrated.',
      audioSpeechText: {
        kn: 'ಪ್ರಥಮವಾಗಿ ದೇವೀ ಪರಾಶಕ್ತಿ ಆಚಮನ. ಬಲ ಅಂಗೈಗೆ ಜಲ ಹಾಕಿ ಆಚಮನ ಮಾಡಿ: ಓಂ ಪರಾಶಕ್ತ್ಯೈ ಸ್ವಾಹಾ. ಓಂ ಮಹಾಲಕ್ಷ್ಮ್ಯೈ ಸ್ವಾಹಾ. ಓಂ ಮಹಾಸರಸ್ವತ್ಯೈ ಸ್ವಾಹಾ. ಹಸ್ತ ತೊಳೆಯಿರಿ. ಓಂ ಉಮಾಯೈ ನಮಃ. ಓಂ ದುರ್ಗಾಯೈ ನಮಃ. ಓಂ ಲಲಿತಾಯೈ ನಮಃ. ಜಗನ್ಮಾತೆಯ ದಿವ್ಯ ಕೃಪೆಗಾಗಿ ಪ್ರಾಣಾಯಾಮ ಮಾಡಿ.',
        hi: 'प्रथम चरण देवी पराशक्ति आचमन। दाहिने हाथ में जल लेकर आचमन करें: ॐ पराशक्त्यै स्वाहा। ॐ महालक्ष्म्यै स्वाहा। ॐ महासरस्वत्यै स्वाहा। हाथ धोएं। ॐ उमायै नमः, ॐ दुर्गायै नमः, ॐ ललितायै नमः। भगवती कृपा हेतु प्राणायाम करें।',
        en: 'Step one: Devi Parashakti Achamana. Sip sacred water: Om Parashaktyai Svaha, Om Mahalakshmyai Svaha, Om Mahasarasvatyai Svaha. Wash hands. Om Umayai Namaha, Om Durgayai Namaha, Om Lalitayai Namaha. Consecrate breath with Divine Mother.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-2-ghanta-deepa',
      stepNumber: 2,
      title: {
        kn: '೨. ಘಂಟಾನಾದ & ಪರಾಶಕ್ತಿ ಜಗನ್ಮಯೀ ದೀಪ ಪ್ರಣಾಮ (Devi Altar Invocation)',
        hi: '२. घण्टानाद एवं पराशक्ति जगन्मयी दीप प्रणाम',
        en: '2. Ghanta & Parashakti Deepa Pranam (Devi Altar Invocation)'
      },
      ritualAction: {
        kn: 'ಘಂಟೆ ಬಾರಿಸುತ್ತಾ ಜಗನ್ಮಾತೆಯ ಮಾತೃಗಣಗಳನ್ನು ಆಹ್ವಾನಿಸಿ, ದೀಪದ ಜ್ಯೋತಿಯನ್ನು ಸಾಕ್ಷಾತ್ ಪರಾಶಕ್ತಿ ದುರ್ಗಾಪರಮೇಶ್ವರಿಯ ಸ್ವರೂಪವೆಂದು ನಮಸ್ಕರಿಸಿ.',
        hi: 'घण्टी बजाकर माँ दुर्गा एवं मातृकाओं का आह्वान करें एवं दीपक की ज्योति को साक्षात् पराशक्ति जगन्मयी मानकर प्रणाम करें।',
        en: 'Ring the temple bell invoking Divine Mother Durga and the Matrikas, venerating the sacred flame as the radiant embodiment of Parashakti.'
      },
      sanskritMantra: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शक्तिसंस्मरण लक्षणम् ॥\nदीपज्योतिः पराशक्तिः दीपज्योतिर्जगन्मयी । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್ । ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಕ್ತಿಸಂಸ್ಮರಣ ಲಕ್ಷಣಮ್ ॥\nದೀಪಜ್ಯೋತಿಃ ಪರಾಶಕ್ತಿಃ ದೀಪಜ್ಯೋತಿರ್ಜಗನ್ಮಯೀ । ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम् । कुर्वे घण्टारवं तत्र शक्तिसंस्मरण लक्षणम् ॥\nदीपज्योतिः पराशक्तिः दीपज्योतिर्जगन्मयी । दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'I ring the bell welcoming Mother Durga and all divine Shaktis while dispelling negativity. The light of the lamp is supreme Parashakti and Jaganmayi. O Divine Mother Flame, dispel darkness and sorrows.',
      audioSpeechText: {
        kn: 'ಘಂಟಾನಾದ ಮತ್ತು ಪರಾಶಕ್ತಿ ದೀಪ ಪ್ರಣಾಮ. ಆಗಮನಾರ್ಥಂ ತು ದೇವಾನಾಂ ಗಮನಾರ್ಥಂ ತು ರಕ್ಷಸಾಮ್, ಕುರ್ವೇ ಘಂಟಾರವಂ ತತ್ರ ಶಕ್ತಿಸಂಸ್ಮರಣ ಲಕ್ಷಣಮ್. ದೀಪಜ್ಯೋತಿಃ ಪರಾಶಕ್ತಿಃ ದೀಪಜ್ಯೋತಿರ್ ಜಗನ್ಮಯೀ, ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ.',
        hi: 'घण्टानाद एवं पराशक्ति दीप प्रणाम। आगमनार्थं तु देवानां गमनार्थं तु रक्षसाम्, कुर्वे घण्टारवं तत्र शक्तिसंस्मरण लक्षणम्। दीपज्योतिः पराशक्तिः दीपज्योतिर्जगन्मयी, दीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते।',
        en: 'Ghanta Nada and Parashakti Deepa Pranam. We ring the bell welcoming Devi Durga. The light of the sacred lamp is Parashakti and Jaganmayi. Salutations to the Divine Mother Flame.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-3-desha-kala-sankalpa',
      stepNumber: 3,
      title: {
        kn: '೩. ದೇಶ ಕಾಲ ದುರ್ಗಾ-ಪರಾಶಕ್ತಿ ಸಂಕಲ್ಪ (Personalized Devi Sankalpa)',
        hi: '३. देश काल दुर्गा-पराशक्ति संकल्प (Vedic Devi Oath)',
        en: '3. Desha Kala Devi Sankalpa (Personalized Durga Oath)'
      },
      ritualAction: {
        kn: 'ಬಲಗೈಯಲ್ಲಿ ಅಕ್ಷತೆ, ಕುಂಕುಮ, ಹೂವು ಹಾಗೂ ಜಲ ಹಿಡಿದು, ಜಗನ್ಮಾತೆ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿಯ ಪ್ರೀತ್ಯರ್ಥವಾಗಿ ಸಂಕಲ್ಪ ಪಠಿಸಿ.',
        hi: 'दाहिने हाथ में अक्षत, कुंकुम, पुष्प एवं जल लेकर जगज्जननी श्री दुर्गा परमेश्वरी की प्रसन्नता हेतु संकल्प पाठ करें।',
        en: 'Hold Akshata, Kumkum, flowers, and holy water in your right palm while chanting this personalized Vedic Sankalpa dedicated to Sri Durga Parameshwari.'
      },
      sanskritMantra: `ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे । श्री दुर्गापरमेश्वर्यै नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री जगदम्बा दुर्गापरमेश्वरी प्रीत्यर्थं श्री ${granthaName || 'दुर्गासप्तशती'} पूजा कर्म करिष्ये ॥`,
      kannadaTranslit: `ಓಂ ಐಂ ಹ್ರೀಂ ಕ್ಲೀಂ ಚಾಮುಂಡಾಯೈ ವಿಚ್ಚೇ । ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ ।\nಅದ್ಯ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯೇ ಪರಾರ್ಧೇ ಶ್ರೀಶ್ವೇತವಾರಾಹಕಲ್ಪೇ ವೈವಸ್ವತಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮಚರಣೇ ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ ಭರತಖಂಡೇ...\n${cityName} ಕ್ಷೇತ್ರೇ... ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ... ಶ್ರೀ ಜಗದಂಬಾ ದುರ್ಗಾಪರಮೇಶ್ವರೀ ಪ್ರೀತ್ಯರ್ಥಂ ಶ್ರೀ ${granthaName || 'ದುರ್ಗಾಸಪ್ತಶತೀ'} ಪೂಜಾ ಕರ್ಮ ಕರಿಷ್ಯೇ ॥`,
      hindiTranslit: `ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे । श्री दुर्गापरमेश्वर्यै नमः ।\nअद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे प्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे...\n${cityName} क्षेत्रे... ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ... श्री जगदम्बा दुर्गापरमेश्वरी प्रीत्यर्थं श्री ${granthaName || 'दुर्गासप्तशती'} पूजा कर्म करिष्ये ॥`,
      englishMeaning: `Om Aim Hreem Kleem Chamundayai Vicche. Salutations to Sri Durga Parameshwari. Within ${cityName}, during ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} star, for the supreme love and grace of Divine Mother Durga, I perform this sacred puja and recitation of Sri ${granthaName || 'Devi Saptashati'}.`,
      audioSpeechText: {
        kn: `ದೇಶ ಕಾಲ ದುರ್ಗಾ ಸಂಕಲ್ಪ. ಓಂ ಐಂ ಹ್ರೀಂ ಕ್ಲೀಂ ಚಾಮುಂಡಾಯೈ ವಿಚ್ಚೇ. ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರೀ ಚರಣಾರವಿಂದಯೋಃ ಪ್ರಣಾಮ. ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ, ${cityName} ಕ್ಷೇತ್ರೇ, ${samvatsaraName} ಸಂವತ್ಸರೇ, ${ayanaName} ಅಯನೇ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರೇ, ${rashiName} ರಾಶೌ, ಶ್ರೀ ಜಗದಂಬಾ ದುರ್ಗಾ ಪರಮೇಶ್ವರೀ ಪ್ರೀತ್ಯರ್ಥಂ, ಧರ್ಮಾರ್ಥ ಕಾಮಮೋಕ್ಷ ಫಲ ಸಿದ್ಧ್ಯರ್ಥಂ, ಶ್ರೀ ${granthaName || 'ದುರ್ಗಾಸಪ್ತಶತೀ'} ಪಾರಾಯಣ ಪೂಜಾ ಸಂಕಲ್ಪಂ ಕರಿಷ್ಯೇ. ಜಲವನ್ನು ತಟ್ಟೆಯಲ್ಲಿ ಬಿಡಿ.`,
        hi: `देश काल दुर्गा संकल्प। ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे। श्री दुर्गा परमेश्वरी चरणारविन्दयोः प्रणाम। जम्बूद्वीपे भारतवर्षे, ${cityName} क्षेत्रे, ${samvatsaraName} संवत्सरे, ${ayanaName} अयने, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रे, ${rashiName} राशौ, श्री जगदम्बा दुर्गा परमेश्वरी प्रीत्यर्थं, श्री ${granthaName || 'दुर्गासप्तशती'} पूजन संकल्पं करिष्ये। जल पात्र में छोड़ें।`,
        en: `Desha Kala Devi Sankalpa. Om Aim Hreem Kleem Chamundayai Vicche. Salutations to Sri Durga Parameshwari. In ${cityName}, during ${samvatsaraName} year, ${ayanaName}, ${masaName} month, ${pakshaName}, on ${tithiName} tithi, under ${nakshatraName} star, for the supreme grace of Divine Mother Durga, I undertake this sacred puja of ${granthaName || 'Devi Saptashati'}. Gently release water into the vessel.`
      },
      audioBellAtStart: true
    },
    {
      id: 'step-4-kalasha-sthapana',
      stepNumber: 4,
      title: {
        kn: '೪. ಕಲಶ ಸ್ಥಾಪನೆ & ಗೌರೀ-ಮಾತೃಕಾ ವರುಣ ಆವಾಹನ (Devi Kalasha)',
        hi: '४. कलश स्थापना एवं गौरी-मातृका वरुण आह्वान',
        en: '4. Kalasha Sthapana & Devi Gauri Invocation'
      },
      ritualAction: {
        kn: 'ತಾಮ್ರ/ಹಿತ್ತಾಳೆ ಕಲಶಕ್ಕೆ ಗಂಗಾಜಲ ತುಂಬಿ, ಪಂಚಪಲ್ಲವ, ನಾಣ್ಯ, ಅಡಿಕೆ ಹಾಕಿ ತೆಂಗಿನಕಾಯಿ ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ಕಲಶದಲ್ಲಿ ತಾಯಿ ಗೌರಿ, ದುರ್ಗೆ ಹಾಗೂ ಸಪ್ತಮಾತೃಕೆಯರನ್ನು ಆವಾಹಿಸಿ.',
        hi: 'कलश में शुद्ध जल, पंचपल्लव, सुपारी, सिक्का डालकर नारियल स्थापित करें एवं भगवती गौरी, दुर्गा व सप्त मातृकाओं की वन्दना करें।',
        en: 'Fill holy vessel with water, add 5 mango leaves, betel nut, coin, crown with coconut, and invoke Mother Gauri, Durga, and the Divine Matrikas.'
      },
      sanskritMantra: 'कलशस्य मुखे गौरी कण्ठे दुर्गा समाश्रिता । मूले तत्र स्थिता ब्राह्मी मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ दुं दुर्गायै पराशक्त्यै कलशदेवताभ्यो नमः ॥',
      kannadaTranslit: 'ಕಲಶಸ್ಯ ಮುಖೇ ಗೌರೀ ಕಂಠೇ ದುರ್ಗಾ ಸಮಾಶ್ರಿತಾ । ಮೂಲೇ ತತ್ರ ಸ್ಥಿತಾ ಬ್ರಾಹ್ಮೀ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ ॥\nಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ । ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು ॥\nಓಂ ದುಂ ದುರ್ಗಾಯೈ ಪರಾಶಕ್ತ್ಯೈ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ ॥',
      hindiTranslit: 'कलशस्य मुखे गौरी कण्ठे दुर्गा समाश्रिता । मूले तत्र स्थिता ब्राह्मी मध्ये मातृगणाः स्मृताः ॥\nगङ्गे च यमुने चैव गोदावरि सरस्वति । नर्मदे सिन्धु कावेरि जलेऽस्मिन् सन्निधिं कुरु ॥\nॐ दुं दुर्गायै पराशक्त्यै कलशदेवताभ्यो नमः ॥',
      englishMeaning: 'In the mouth of the Kalasha dwells Mother Gauri, at the neck Durga, at the base Brahmi Shakti, and in the middle the Saptamatrikas. May holy Ganga, Yamuna, Godavari, Saraswati, Narmada, Sindhu, and Kaveri sanctify this water. Salutations to Parashakti.',
      audioSpeechText: {
        kn: 'ಕಲಶ ಸ್ಥಾಪನೆ ಮತ್ತು ಗೌರೀ-ಮಾತೃಕಾ ಆವಾಹನ. ಕಲಶಸ್ಯ ಮುಖೇ ಗೌರೀ ಕಂಠೇ ದುರ್ಗಾ ಸಮಾಶ್ರಿತಾ, ಮೂಲೇ ತತ್ರ ಸ್ಥಿತಾ ಬ್ರಾಹ್ಮೀ ಮಧ್ಯೇ ಮಾತೃಗಣಾಃ ಸ್ಮೃತಾಃ. ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ಗೋದಾವರಿ ಸರಸ್ವತಿ, ನರ್ಮದೇ ಸಿಂಧು ಕಾವೇರಿ ಜಲೇಸ್ಮಿನ್ ಸನ್ನಿಧಿಂ ಕುರು. ಓಂ ದುಂ ದುರ್ಗಾಯೈ, ಪರಾಶಕ್ತಿ ಕಲಶದೇವತಾಭ್ಯೋ ನಮಃ, ಪ್ರಾರ್ಥಯಾಮಿ.',
        hi: 'कलश स्थापना एवं गौरी-मातृका आह्वान। कलशस्य मुखे गौरी कण्ठे दुर्गा समाश्रिता। हे गङ्गा, यमुना, गोदावरी, सरस्वती, नर्मदा, सिन्धु और कावेरी, इस पावन जल में पधारें। ॐ दुं दुर्गायै पराशक्त्यै कलश देवता को प्रणाम करें।',
        en: 'Kalasha Sthapana and Mother Gauri Invocation. In this vessel reside Mother Gauri, Durga, Brahmi, and the Divine Mothers. We invoke the seven holy rivers. Salutations to Divine Mother Durga.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-5-akhanda-deepa',
      stepNumber: 5,
      title: {
        kn: '೫. ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ & ದುರ್ಗಾ-ಗಿರಿಜಾ ಗಾಯತ್ರೀ (Devi Gayatri Deepa)',
        hi: '५. अखण्ड दीप प्रतिष्ठा एवं दुर्गा-गिरिजा गायत्री',
        en: '5. Akhanda Deepa & Durga-Girija Gayatri'
      },
      ritualAction: {
        kn: 'ಧಾನ್ಯ ಪೀಠದ ಮೇಲೆ ದೀಪವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸಿ, ತುಪ್ಪ/ಎಣ್ಣೆ ಹಾಕಿ, ಪೂರ್ವ ಅಥವಾ ಉತ್ತರ ಮುಖವಾಗಿ ದುರ್ಗಾ-ಗಿರಿಜಾ ಗಾಯತ್ರೀ ಜಪಿಸಿ ಅಖಂಡ ಜ್ಯೋತಿ ಬೆಳಗಿ.',
        hi: 'धान्य पीठ पर दीप स्थापित कर घृत या तिल तैल भरकर पूर्व अथवा उत्तर दिशा में दुर्गा-गिरिजा गायत्री जपते हुए अखण्ड ज्योति प्रज्वलित करें।',
        en: 'Place lamp on grain altar, add cow ghee or sesame oil, and ignite facing East or North chanting the Durga-Girija Gayatri.'
      },
      sanskritMantra: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥\nॐ महादेव्यै च विद्महे दुर्गायै धीमहि । तन्नो देवी प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
      kannadaTranslit: 'ಓಂ ಗಿರಿಜಾಯೈ ಚ ವಿದ್ಮಹೇ ಶಿವಪ್ರಿಯಾಯೈ ಧೀಮಹಿ । ತನ್ನೋ ದುರ್ಗಾ ಪ್ರಚೋದಯಾತ್ ॥\nಓಂ ಮಹಾದೇವ್ಯೈ ಚ ವಿದ್ಮಹೇ ದುರ್ಗಾಯೈ ಧೀಮಹಿ । ತನ್ನೋ ದೇವೀ ಪ್ರಚೋದಯಾತ್ ॥\nಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮಾರೋಗ್ಯಂ ಧನಸಂಪದಃ । ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ನಮೋಸ್ತು ತೇ ॥',
      hindiTranslit: 'ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि । तन्नो दुर्गा प्रचोदयात् ॥\nॐ महादेव्यै च विद्महे दुर्गायै धीमहि । तन्नो देवी प्रचोदयात् ॥\nशुभं करोति कल्याणमारोग्यं धनसम्पदः । शत्रुबुद्धि विनाशाय दीपज्योतिर्नमोऽस्तु ते ॥',
      englishMeaning: 'Om, we meditate upon Goddess Girija, the beloved consort of Lord Shiva; may Divine Mother Durga inspire and illuminate our intellect. Om, we meditate upon Mahadevi Durga; may Devi guide our path. Salutations to the auspicious Flame.',
      audioSpeechText: {
        kn: 'ಅಖಂಡ ದೀಪ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ದುರ್ಗಾ ಗಾಯತ್ರೀ. ಓಂ ಗಿರಿಜಾಯೈ ಚ ವಿದ್ಮಹೇ ಶಿವಪ್ರಿಯಾಯೈ ಧೀಮಹಿ, ತನ್ನೋ ದುರ್ಗಾ ಪ್ರಚೋದಯಾತ್. ಓಂ ಮಹಾದೇವ್ಯೈ ಚ ವಿದ್ಮಹೇ ದುರ್ಗಾಯೈ ಧೀಮಹಿ, ತನ್ನೋ ದೇವೀ ಪ್ರಚೋದಯಾತ್. ಶುಭಂ ಕರೋತಿ ಕಲ್ಯಾಣಮ್ ಆರೋಗ್ಯಂ ಧನಸಂಪದಃ, ಶತ್ರುಬುದ್ಧಿ ವಿನಾಶಾಯ ದೀಪಜ್ಯೋತಿರ್ ನಮೋಸ್ತು ತೇ. ಶ್ರೀ ದುರ್ಗಾ ಜ್ಯೋತಯೇ ನಮಃ.',
        hi: 'अखण्ड दीप प्रतिष्ठा एवं दुर्गा गायत्री। ॐ गिरिजायै च विद्महे शिवप्रियायै धीमहि, तन्नो दुर्गा प्रचोदयात्। ॐ महादेव्यै च विद्महे दुर्गायै धीमहि, तन्नो देवी प्रचोदयात्। शुभं करोति कल्याणमारोग्यं धनसम्पदः, दीपज्योतिर्नमोऽस्तु ते। अखण्ड दुर्गा ज्योति को प्रणाम करें।',
        en: 'Akhanda Deepa Installation and Durga Gayatri. Om Girijayai Cha Vidmahe Shiva-Priyayai Dheemahi, Tanno Durgah Prachodayat. Shubham Karoti Kalyanam. Salutations to the Divine Flame representing Mother Durga.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-6-shodashopachara',
      stepNumber: 6,
      title: {
        kn: '೬. ದುರ್ಗಾ ಷೋಡಶೋಪಚಾರ ಕುಂಕುಮಾರ್ಚನ ಪೂಜಾ ಸಮರ್ಪಣೆ (Devi 16 Offerings)',
        hi: '६. दुर्गा षोडशोपचार कुङ्कुमार्चन पूजा समर्पण',
        en: '6. Devi Shodashopachara Kumkumarchana (16 Holy Offerings)'
      },
      ritualAction: {
        kn: 'ದುರ್ಗಾದೇವಿಯ ಮೂರ್ತಿಗೆ ಹರಿದ್ರಾ, ಕುಂಕುಮಾರ್ಚನೆ, ಕೆಂಪು ಹೂವು, ಸುವಾಸಿನಿ ದ್ರವ್ಯ, ಧೂಪ, ದೀಪ, ಮಧುರ ಪಾಯಸ ನೈವೇದ್ಯ ಹಾಗೂ ಕರ್ಪೂರ ನೀರಾಜನ ಸಮರ್ಪಿಸಿ.',
        hi: 'माँ दुर्गा को हरिद्रा, कुङ्कुमार्चन, रक्त पुष्प, धूप, दीप, मधुर पायस नैवेद्य एवं कर्पूर आरती अर्पित करें।',
        en: 'Offer Haldi, Kumkumarchana, fragrant red flowers, incense, lamp, sweet Payasam Naivedya, and camphor Arati to Divine Mother Durga.'
      },
      sanskritMantra: 'ॐ श्री दुर्गापरमेश्वर्यै जगन्मात्रे नमः ।\nध्यायामि, आवाहयामि, रक्तपुष्प-कुङ्कुमाक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, हरिद्रा-कुङ्कुम-चन्दनं, सुवासिनी-द्रव्यं, रक्तपुष्पाणि, दिव्यधूपं, दीपं, मधुरपायस-महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनं समर्पयामि ॥',
      kannadaTranslit: 'ಓಂ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ಜಗನ್ಮಾತ್ರೇ ನಮಃ ।\nಧ್ಯಾಯಾಮಿ, ಆವಾಹಯಾಮಿ, ರಕ್ತಪುಷ್ಪ-ಕುಂಕುಮಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ, ಪಾದ್ಯಂ, ಅರ್ಘ್ಯಂ, ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ, ಹರಿದ್ರಾ-ಕುಂಕುಮ-ಚಂದನಂ, ಸುವಾಸಿನೀ-ದ್ರವ್ಯಂ, ರಕ್ತಪುಷ್ಪಾಣಿ, ದಿವ್ಯಧೂಪಂ, ದೀಪಂ, ಮಧುರಪಾಯಸ-ಮಹಾನೈವೇದ್ಯಂ, ತಾಂಬೂಲಂ, ಮಂಗಳಕರ್ಪೂರನೀರಾಜನಂ ಸಮರ್ಪಯಾಮಿ ॥',
      hindiTranslit: 'ॐ श्री दुर्गापरमेश्वर्यै जगन्मात्रे नमः ।\nध्यायामि, आवाहयामि, रक्तपुष्प-कुङ्कुमाक्षतान् समर्पयामि, पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि, हरिद्रा-कुङ्कुम-चन्दनं, सुवासिनी-द्रव्यं, रक्तपुष्पाणि, दिव्यधूपं, दीपं, मधुरपायस-महानेवेद्यं, ताम्बूलं, मङ्गलकर्पूरनीराजनं समर्पयामि ॥',
      englishMeaning: 'Om, salutations to Sri Durga Parameshwari, the Mother of the Universe. I meditate and invoke Divine Mother, offering sacred seat, red flowers, holy Kumkumarchana, holy bath, Haridra-Kumkum, sandalwood, sweet Payasam Naivedya, Tambula, and camphor Arati.',
      audioSpeechText: {
        kn: 'ದುರ್ಗಾ ಷೋಡಶೋಪಚಾರ ಕುಂಕುಮಾರ್ಚನ ಸಮರ್ಪಣೆ. ಓಂ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ಜಗನ್ಮಾತ್ರೇ ನಮಃ. ಧ್ಯಾಯಾಮಿ. ಆವಾಹಯಾಮಿ. ಆಸನಾರ್ಥೇ ಪುಷ್ಪಾಕ್ಷತಾನ್ ಸಮರ್ಪಯಾಮಿ. ಪಾದ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಅರ್ಘ್ಯಂ ಸಮರ್ಪಯಾಮಿ. ಆಚಮನೀಯಂ ಸಮರ್ಪಯಾಮಿ. ಹರಿದ್ರಾ ಕುಂಕುಮಾರ್ಚನಂ ಸಮರ್ಪಯಾಮಿ. ರಕ್ತ ಪುಷ್ಪಾಣಿ ಪೂಜಯಾಮಿ. ದಿವ್ಯ ಧೂಪಂ ಆಘ್ರಾಪಯಾಮಿ. ದೀಪಂ ದರ್ಶಯಾಮಿ. ಮಧುರ ಪಾಯಸ ಮಹಾನೈವೇದ್ಯಂ ನಿವೇದಯಾಮಿ. ತಾಂಬೂಲಂ ಸಮರ್ಪಯಾಮಿ. ಮಂಗಳ ಕರ್ಪೂರ ನೀರಾಜನಂ ಪ್ರದರ್ಶಯಾಮಿ.',
        hi: 'दुर्गा षोडशोपचार कुङ्कुमार्चन पूजन। ॐ श्री दुर्गापरमेश्वर्यै जगन्मात्रे नमः। ध्यायामि, आवाहयामि, रक्तपुष्प अक्षत समर्पयामि। पाद्यं, अर्घ्यं, आचमनीयं समर्पयामि। हरिद्रा कुङ्कुमार्चनं समर्पयामि। धूपं, दीपं, मधुर पायस महानेवेद्यं, ताम्बूलं एवं मङ्गल कर्पूर आरती समर्पयामि।',
        en: 'Durga Shodashopachara Kumkumarchana Samarpana. Salutations to Divine Mother Durga Parameshwari. We offer Dhyana, Avahana, red flowers, holy Haridra, Kumkumarchanam, Dhoopam, Deepam, sweet Payasam Naivedya, Tambula, and Camphor Arati.'
      },
      audioBellAtStart: true
    },
    {
      id: 'step-7-visarjana-shanti',
      stepNumber: 7,
      title: {
        kn: '೭. ದುರ್ಗಾ-ಪರಾಶಕ್ತಿ ಸಮರ್ಪಣ & ಶಾಂತಿ ಪಾಠ (Devi Samarpana & Peace)',
        hi: '७. दुर्गा-पराशक्ति समर्पण एवं शान्ति पाठ',
        en: '7. Devi Samarpana & Shanti Patha (Universal Peace Invocations)'
      },
      ritualAction: {
        kn: 'ಪೂಜೆಯ ಸಕಲ ಫಲವನ್ನು ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿ ಜಗನ್ಮಾತೆಗೆ ಸಮರ್ಪಿಸಿ, ಪ್ರದಕ್ಷಿಣೆ ನಮಸ್ಕಾರ ಮಾಡಿ ಲೋಕಕಲ್ಯಾಣ ಶಾಂತಿ ಮಂತ್ರ ಪಠಿಸಿ.',
        hi: 'सम्पूर्ण पूजा का फल जगन्माता श्री दुर्गा परमेश्वरी को समर्पित करें एवं विश्व शान्ति की प्रार्थना करें।',
        en: 'Surrender all fruits of the puja to Sri Durga Parameshwari, circumambulate clockwise and chant the Vedic Shanti invocations.'
      },
      sanskritMantra: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै पराशक्त्यै दुर्गायै जगदम्बायै इति समर्पयामि ॥\nसर्वं श्री दुर्गापरमेश्वरार्पणमस्तु जगदम्बार्पणमस्तु ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      kannadaTranslit: 'ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್ । ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ ಪರಾಶಕ್ತ್ಯೈ ದುರ್ಗಾಯೈ ಜಗದಂಬಾಯೈ ಇತಿ ಸಮರ್ಪಯಾಮಿ ॥\nಸರ್ವಂ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಾರ್ಪಣಮಸ್ತು ಜಗದಂಬಾರ್ಪಣಮಸ್ತು ॥\nಓಂ ದ್ಯೌಃ ಶಾಂತಿಶ್ಚಾಂತರಿಕ್ಷಂ ಶಾಂತಿಃ ಪೃಥಿವೀ ಶಾಂತಿರಾಪಃ ಶಾಂತಿೋಷಧಯಃ ಶಾಂತಿಃ । ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      hindiTranslit: 'कायेन वाचा मनसेन्द्रियैर्वा बुध्यात्मना वा प्रकृतेः स्वभावात् । करोमि यद्यत् सकलं परस्मै पराशक्त्यै दुर्गायै जगदम्बायै इति समर्पयामि ॥\nसर्वं श्री दुर्गापरमेश्वरार्पणमस्तु जगदम्बार्पणमस्तु ॥\nॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः । ॐ शान्तिः शान्तिः शान्तिः ॥',
      englishMeaning: 'Whatever I have performed through body, speech, mind, senses, or intellect, I surrender it all unto Divine Mother Parashakti, Sri Durga Jagadamba. Everything is offered to Devi. Om Peace in high heavens, peace on earth, peace in water, peace in herbs. Om Shantih, Shantih, Shantih.',
      audioSpeechText: {
        kn: 'ದುರ್ಗಾ-ಪರಾಶಕ್ತಿ ಸಮರ್ಪಣ ಮತ್ತು ಶಾಂತಿ ಪಾಠ. ಕಾಯೇನ ವಾಚಾ ಮನಸೇಂದ್ರಿಯೈರ್ವಾ, ಬುದ್ಧ್ಯಾತ್ಮನಾ ವಾ ಪ್ರಕೃತೇಃ ಸ್ವಭಾವಾತ್, ಕರೋಮಿ ಯದ್ಯತ್ ಸಕಲಂ ಪರಸ್ಮೈ, ಪರಾಶಕ್ತ್ಯೈ ದುರ್ಗಾಯೈ ಜಗದಂಬಾಯೈ ಇತಿ ಸಮರ್ಪಯಾಮಿ. ಸರ್ವಂ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಾರ್ಪಣಮಸ್ತು. ಓಂ ದ್ಯೌಃ ಶಾಂತಿಃ, ಅಂತರಿಕ್ಷಂ ಶಾಂತಿಃ, ಪೃಥಿವೀ ಶಾಂತಿಃ, ಆಪಃ ಶಾಂತಿಃ, ಓಷಧಯಃ ಶಾಂತಿಃ. ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ. ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು.',
        hi: 'दुर्गा-पराशक्ति समर्पण एवं शान्ति पाठ। कायेन वाचा मनसेन्द्रियैर्वा, करोमि यद्यत् सकलं परस्मै पराशक्त्यै दुर्गायै जगदम्बायै इति समर्पयामि। सर्वं श्री दुर्गापरमेश्वरार्पणमस्तु। ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिः। ॐ शान्तिः शान्तिः शान्तिः। सर्वे भवन्तु सुखिनः।',
        en: 'Devi Samarpana and Shanti Patha. Whatever has been performed through body, speech, and mind is consecrated to Parashakti Durga Jagadamba. May all fruits be offered to Sri Durga Parameshwari. Om Peace in heaven, peace on earth, peace in waters. Om Shantih, Shantih, Shantih.'
      },
      audioBellAtStart: true
    }
  ];

  // Active steps array derived strictly from active track ('shiva' vs 'devi')
  const RITUAL_AUDIO_STEPS = activeTrack === 'shiva' ? SHIVA_AUDIO_STEPS : DEVI_AUDIO_STEPS;
  const currentStep = RITUAL_AUDIO_STEPS[currentStepIndex] || RITUAL_AUDIO_STEPS[0];

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
      
      {/* Audio Guide Header Bar with Deity Track Switcher */}
      <div className="bg-gradient-to-r from-red-800 via-rose-800 to-amber-700 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-200 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4 text-amber-300" />
            <span>SYNCHRONOUS POOJA AUDIO GUIDE • ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5 flex-wrap">
            <span>{language === 'kn' ? 'ಪೂಜಾ ಮಂತ್ರ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ' : language === 'hi' ? 'पूजा मन्त्र ध्वनि संदर्शिका' : 'Pooja Mantra Audio Guide'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold">
              {currentStepIndex + 1} / {RITUAL_AUDIO_STEPS.length}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs border ${
              activeTrack === 'shiva' 
                ? 'bg-blue-900/80 text-blue-100 border-blue-400' 
                : 'bg-rose-900/80 text-rose-100 border-rose-400'
            }`}>
              {activeTrack === 'shiva' ? '🔱 Shiva Track' : '🪔 Devi Track'}
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

        {/* Global Track Selector Buttons & Temple Bell SFX */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          {/* Dual Deity Switcher Pill */}
          <div className="bg-stone-950/70 p-1 rounded-xl border border-amber-300/40 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => handleTrackChange('shiva')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTrack === 'shiva'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-blue-300'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Switch all mantras to Lord Shiva (Sadashiva / Rudra)"
            >
              <span>🔱</span>
              <span>{language === 'kn' ? 'ಶಿವ ಮಂತ್ರಗಳು' : language === 'hi' ? 'शिव मन्त्र' : 'Shiva Track'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTrackChange('devi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTrack === 'devi'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md ring-1 ring-amber-300'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Switch all mantras to Divine Mother Devi (Durga / Parashakti)"
            >
              <span>🪔</span>
              <span>{language === 'kn' ? 'ದೇವೀ ಮಂತ್ರಗಳು' : language === 'hi' ? 'देवी मन्त्र' : 'Devi Track'}</span>
            </button>
          </div>

          {/* Quick Temple Bell Trigger Button */}
          <button
            type="button"
            onClick={playTempleBell}
            title="Ring Brass Temple Bell"
            className={`px-3 py-1.5 rounded-xl border border-amber-300/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
              isBellRinging 
                ? 'bg-amber-400 text-stone-950 scale-105 ring-2 ring-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${isBellRinging ? 'animate-bounce text-stone-950' : 'text-amber-300'}`} />
            <span>{language === 'kn' ? 'ಘಂಟೆ (Bell)' : 'Bell'}</span>
          </button>

          <button
            type="button"
            onClick={playOmChime}
            title="Play Cosmic Om Resonance"
            className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
          >
            <span>🕉️ Om</span>
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
                    ? activeTrack === 'shiva'
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-red-600 text-white shadow-md ring-2 ring-amber-400'
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
      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Step Header */}
        <div className="border-b border-amber-200 dark:border-stone-700 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono">
                RITUAL SECTION {currentStep.stepNumber} OF {RITUAL_AUDIO_STEPS.length}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeTrack === 'shiva' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
              }`}>
                {activeTrack === 'shiva' ? '🔱 Shiva Mantra' : '🪔 Devi Mantra'}
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 dark:text-white mt-0.5">
              {currentStep.title[language]}
            </h4>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-stone-500 font-semibold">
              Speed:
            </span>
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
              {[0.75, 0.9, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
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
              {language === 'kn' ? 'ಪೂಜಾ ವಿಧಿ ಕ್ರಮ (Ritual Action):' : language === 'hi' ? 'पूजन विधि क्रम (Ritual Action):' : 'Ritual Action Required:'}
            </strong>
            <p className="leading-relaxed">{currentStep.ritualAction[language]}</p>
          </div>
        </div>

        {/* Mantra Card with Multi-Script Support */}
        <div className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-50/50 to-white dark:from-stone-850 dark:to-stone-900 p-5 sm:p-6 shadow-inner space-y-4">
          
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-stone-700 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                {language === 'kn' ? 'ವೇದೋಕ್ತ ಮಂತ್ರ (Sacred Mantra)' : language === 'hi' ? 'वेदोक्त मन्त्र (Sacred Mantra)' : 'Sacred Vedic Mantra'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              Vedic Chanting Script
            </span>
          </div>

          {/* Sanskrit Devanagari */}
          <div className="p-4 rounded-xl bg-white dark:bg-stone-800/90 border border-amber-200 dark:border-stone-700 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              संस्कृतम् (Devanagari)
            </span>
            <pre className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-amber-100 whitespace-pre-wrap leading-relaxed tracking-wide font-sans">
              {currentStep.sanskritMantra}
            </pre>
          </div>

          {/* Kannada Script Transliteration */}
          {language === 'kn' && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
                ಕನ್ನಡ ಲಿಪಿ (Kannada Script)
              </span>
              <pre className="font-serif text-sm sm:text-base font-semibold text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed font-sans">
                {currentStep.kannadaTranslit}
              </pre>
            </div>
          )}

          {/* English Meaning & Insight */}
          <div className="p-4 rounded-xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            <strong className="block font-bold text-stone-900 dark:text-stone-100 mb-1">
              {language === 'kn' ? 'ಆಂತರ್ಯ ಭಾವಾರ್ಥ (Inner Meaning):' : language === 'hi' ? 'गूढ़ भावार्थ (Spiritual Meaning):' : 'Spiritual Meaning & Context:'}
            </strong>
            <p>{currentStep.englishMeaning}</p>
          </div>

        </div>

        {/* Primary Audio Player Control Deck */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                {isPlaying ? 'NOW CHANTING' : isPaused ? 'PAUSED' : 'READY TO PLAY'}
              </span>
              <div className="font-serif font-bold text-sm text-stone-100 truncate max-w-xs">
                {currentStep.title[language].split('(')[0]}
              </div>
            </div>
            
            {/* Animated SVG Audio Waveform Equalizer */}
            {isPlaying && (
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 32 20" className="w-8 h-5">
                  <rect x="2" y="5" width="3" height="12" rx="1.5" fill="#f59e0b">
                    <animate attributeName="height" values="4;14;6;14;4" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="y" values="8;3;7;3;8" dur="0.8s" repeatCount="indefinite" />
                  </rect>
                  <rect x="8" y="2" width="3" height="16" rx="1.5" fill="#fbbf24">
                    <animate attributeName="height" values="8;18;4;16;8" dur="0.7s" repeatCount="indefinite" />
                    <animate attributeName="y" values="6;1;8;2;6" dur="0.7s" repeatCount="indefinite" />
                  </rect>
                  <rect x="14" y="4" width="3" height="14" rx="1.5" fill="#38bdf8">
                    <animate attributeName="height" values="14;6;18;8;14" dur="0.9s" repeatCount="indefinite" />
                    <animate attributeName="y" values="3;7;1;6;3" dur="0.9s" repeatCount="indefinite" />
                  </rect>
                  <rect x="20" y="3" width="3" height="15" rx="1.5" fill="#fbbf24">
                    <animate attributeName="height" values="6;16;8;14;6" dur="0.65s" repeatCount="indefinite" />
                    <animate attributeName="y" values="7;2;6;3;7" dur="0.65s" repeatCount="indefinite" />
                  </rect>
                  <rect x="26" y="6" width="3" height="10" rx="1.5" fill="#f59e0b">
                    <animate attributeName="height" values="4;12;6;10;4" dur="0.85s" repeatCount="indefinite" />
                    <animate attributeName="y" values="8;4;7;5;8" dur="0.85s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </div>
            )}
          </div>

          {/* Central Controls: Prev, Play/Pause, Stop, Next */}
          <div className="flex items-center gap-3">
            {/* Previous Step */}
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
                  : activeTrack === 'shiva'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white ring-4 ring-indigo-400/30'
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
