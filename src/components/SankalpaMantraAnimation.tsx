import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Language } from '../types';

interface SankalpaMantraAnimationProps {
  stotraLang: Language;
  sankalpaSampradaya: 'shiva_shakti' | 'classical';
  deityName: string;
  granthaName: string;
}

interface SankalpaSegment {
  id: number;
  label: string;
  text: string;
  isShubhaHighlight?: boolean;
  highlightBadge?: string;
}

export const SankalpaMantraAnimation: React.FC<SankalpaMantraAnimationProps> = ({
  stotraLang,
  sankalpaSampradaya,
  deityName,
  granthaName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0);
  const [chantRate, setChantRate] = useState<number>(0.76);
  const [droneEnabled, setDroneEnabled] = useState<boolean>(true);
  const [videoAvailable, setVideoAvailable] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  isPlayingRef.current = isPlaying;

  // Build the complete Sankalpa Shloka with the user's exact substitutions:
  // - Place (Bengaluru) -> "ಪುಣ್ಯ ಪ್ರದೇಶೇ" (no city name)
  // - Samvatsara (Parabhava) -> "ಶುಭ ನಾಮ ಸಂವತ್ಸರೇ"
  // - All other blue blanks -> "ಶುಭ" (Ayana, Masa, Paksha, Tithi, Vasara, Nakshatra, Rashi)
  const segments: SankalpaSegment[] = useMemo(() => {
    const cleanDeity = deityName.trim() || (stotraLang === 'kn' ? 'ಶ್ರೀ ಸಾಂಬಸದಾಶಿವ' : stotraLang === 'hi' ? 'श्री साम्बसदाशिव' : 'Sri Samba Sadashiva');
    const cleanGrantha = granthaName.trim() || (stotraLang === 'kn' ? 'ಶ್ರೀ ರುದ್ರಾಧ್ಯಾಯ' : stotraLang === 'hi' ? 'श्री रुद्राध्याय' : 'Sri Rudradhyaya');

    if (stotraLang === 'hi') {
      const invokeLine =
        sankalpaSampradaya === 'shiva_shakti'
          ? 'ॐ नमः परमात्मने, श्री साम्बसदाशिवस्य श्री जगन्मातुः महादेव्याः श्री पराशक्त्याः आज्ञया प्रवर्तमानस्य'
          : 'ॐ नमः परमात्मने, श्री पुराणपुरुषोत्तमस्य श्री विष्णोराज्ञया प्रवर्तमानस्य';

      return [
        { id: 0, label: 'आवाहनम् (Invocation)', text: invokeLine },
        {
          id: 1,
          label: 'महाकाल-कल्पः (Cosmic Epoch)',
          text: 'आद्य श्री ब्रह्मणो द्वितीय परार्धे, श्री श्वेतवराहकल्पे, वैवस्वत मन्वन्तरे, अष्टाविंशतितमे कलियुगे प्रथम चरणे,',
        },
        {
          id: 2,
          label: 'देशः (Jambudvipe • Punya Pradeshe)',
          text: 'जम्बू द्वीपे, भारत वर्षे, भरत खण्डे, आर्यावर्तान्तर्गत ब्रह्मावर्तैक देशे, पुण्य प्रदेशे,',
          isShubhaHighlight: true,
          highlightBadge: 'पुण्य प्रदेशे',
        },
        {
          id: 3,
          label: 'संवत्सरः (Shubha Samvatsare)',
          text: 'शुभ नाम संवत्सरे,',
          isShubhaHighlight: true,
          highlightBadge: 'शुभ नाम संवत्सरे',
        },
        {
          id: 4,
          label: 'अयन-मास-पक्षः (Shubha)',
          text: 'शुभ अयने, शुभ मासे, शुभ पक्षे,',
          isShubhaHighlight: true,
          highlightBadge: 'शुभ',
        },
        {
          id: 5,
          label: 'तिथि-वासर-नक्षत्र-राशिः (Shubha)',
          text: 'शुभ तिथौ, शुभ वासरान्वितायां, शुभ नक्षत्रे, शुभ राशि स्थिते भास्करे,',
          isShubhaHighlight: true,
          highlightBadge: 'शुभ',
        },
        {
          id: 6,
          label: 'मंगल-प्रार्थना (Kshema & Mangala)',
          text: 'अस्माकं सर्वेषां सह कुटुम्बानां क्षेम स्थैर्य विजय वीर्यायुरारोग्यैश्वर्याद्यभिवृद्ध्यर्थं, समस्त मंगलावाप्त्यर्थं,',
        },
        {
          id: 7,
          label: 'नवग्रह शान्ति व पुरुषार्थ (Purushartha)',
          text: 'आदित्यादि नवग्रह दोष पीडापरिहारार्थं, धर्मार्थ काम मोक्ष चतुर्विध पुण्य पुरुषार्थ सिद्ध्यर्थं च,',
        },
        {
          id: 8,
          label: 'संकल्प समर्पणम् (Conclusion)',
          text: `श्री ${cleanDeity} देवता प्रीत्यर्थं, ${cleanGrantha} पाठाख्यं पूजनं करिष्ये।`,
        },
      ];
    }

    if (stotraLang === 'en') {
      const invokeLine =
        sankalpaSampradaya === 'shiva_shakti'
          ? 'Om Namah Paramatmane, Sri Samba-Sadashivasya Sri Jaganmatuh Mahadevyah Sri Parashaktyah Aajnaya Pravartamanasya'
          : 'Om Namah Paramatmane, Sri Purana-Purushottamasya Sri Vishnor-Aajnaya Pravartamanasya';

      return [
        { id: 0, label: 'Invocation (Dhyana)', text: invokeLine },
        {
          id: 1,
          label: 'Cosmic Epoch (Kalpa & Yuga)',
          text: 'Aadya Sri Brahmano Dvitiya Parardhe, Sri Shweta-Varaha-Kalpe, Vaivasvata Manvantare, Ashtavimshatitame Kaliyuge Prathama Charane,',
        },
        {
          id: 2,
          label: 'Sacred Geography (Punya Pradeshe)',
          text: 'Jambu Dweepe, Bharata Varshe, Bharata Khande, Aaryavartantargata Brahmavartaika Deshe, Punya Pradeshe,',
          isShubhaHighlight: true,
          highlightBadge: 'Punya Pradeshe',
        },
        {
          id: 3,
          label: 'Samvatsara (Shubha)',
          text: 'Shubha Nama Samvatsare,',
          isShubhaHighlight: true,
          highlightBadge: 'Shubha Nama Samvatsare',
        },
        {
          id: 4,
          label: 'Ayana, Masa & Paksha (Shubha)',
          text: 'Shubha Ayane, Shubha Mase, Shubha Pakshe,',
          isShubhaHighlight: true,
          highlightBadge: 'Shubha',
        },
        {
          id: 5,
          label: 'Tithi, Vasara, Nakshatra & Rashi (Shubha)',
          text: 'Shubha Tithau, Shubha Vasaranvitayam, Shubha Nakshatre, Shubha Rashi Sthite Bhaskare,',
          isShubhaHighlight: true,
          highlightBadge: 'Shubha',
        },
        {
          id: 6,
          label: 'Kshema & Auspiciousness',
          text: 'Asmakam Sarvesham Saha Kutumbanam Kshema Sthairya Vijaya Veeryayurarogyaishvaryadyabhivriddhyartham, Samasta Mangalavaptyartham,',
        },
        {
          id: 7,
          label: 'Navagraha Shanti & Purushartha',
          text: 'Adityadi Navagraha Dosha Peedapariharartham, Dharmartha Kama Moksha Chaturvidha Punya Purushartha Siddhyartham Cha,',
        },
        {
          id: 8,
          label: 'Sankalpa Dedication',
          text: `Sri ${cleanDeity} Devata Preetyartham, ${cleanGrantha} Paathaakhyam Pujanam Karishye.`,
        },
      ];
    }

    // Kannada (Default — user's exact phrasing!)
    const invokeLine =
      sankalpaSampradaya === 'shiva_shakti'
        ? 'ಓಂ ನಮಃ ಪರಮಾತ್ಮನೇ, ಶ್ರೀ ಸಾಂಬಸದಾಶಿವಸ್ಯ ಶ್ರೀ ಜಗನ್ಮಾತುಃ ಮಹಾದೇವ್ಯಾಃ ಶ್ರೀ ಪರಾಶಕ್ತ್ಯಾಃ ಆಜ್ಞಯಾ ಪ್ರವರ್ತಮಾನಸ್ಯ'
        : 'ಓಂ ನಮಃ ಪರಮಾತ್ಮನೇ, ಶ್ರೀ ಪುರಾಣಪುರುಷೋತ್ತಮಸ್ಯ ಶ್ರೀ ವಿಷ್ಣೋರಾಜ್ಞಯಾ ಪ್ರವರ್ತಮಾನಸ್ಯ';

    return [
      { id: 0, label: 'ಆವಾಹನಂ (ಮಹಾ ಪ್ರಾರಂಭ)', text: invokeLine },
      {
        id: 1,
        label: 'ಮಹಾಕಾಲ-ಕಲ್ಪ (Cosmic Time)',
        text: 'ಆದ್ಯ ಶ್ರೀ ಬ್ರಹ್ಮಣೋ ದ್ವಿತೀಯ ಪರಾರ್ಧೇ, ಶ್ರೀ ಶ್ವೇತವರಾಹಕಲ್ಪೇ, ವೈವಸ್ವತ ಮನ್ವಂತರೇ, ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಪ್ರಥಮ ಚರಣೇ,',
      },
      {
        id: 2,
        label: 'ದೇಶ ನಿರ್ದೇಶ (ಪುಣ್ಯ ಪ್ರದೇಶೇ)',
        text: 'ಜಂಬೂ ದ್ವೀಪೇ, ಭಾರತ ವರ್ಷೇ, ಭರತ ಖಂಡೇ, ಆರ್ಯಾವರ್ತಾಂತರ್ಗತ ಬ್ರಹ್ಮಾವರ್ತೈಕ ದೇಶೇ, ಪುಣ್ಯ ಪ್ರದೇಶೇ,',
        isShubhaHighlight: true,
        highlightBadge: 'ಪುಣ್ಯ ಪ್ರದೇಶೇ',
      },
      {
        id: 3,
        label: 'ಸಂವತ್ಸರ (ಶುಭ ನಾಮ ಸಂವತ್ಸರೇ)',
        text: 'ಶುಭ ನಾಮ ಸಂವತ್ಸರೇ,',
        isShubhaHighlight: true,
        highlightBadge: 'ಶುಭ ನಾಮ ಸಂವತ್ಸರೇ',
      },
      {
        id: 4,
        label: 'ಅಯನ • ಮಾಸ • ಪಕ್ಷ (ಶುಭ)',
        text: 'ಶುಭ ಅಯನೇ, ಶುಭ ಮಾಸೇ, ಶುಭ ಪಕ್ಷೇ,',
        isShubhaHighlight: true,
        highlightBadge: 'ಶುಭ',
      },
      {
        id: 5,
        label: 'ತಿಥಿ • ವಾಸರ • ನಕ್ಷತ್ರ • ರಾಶಿ (ಶುಭ)',
        text: 'ಶುಭ ತಿಥೌ, ಶುಭ ವಾಸರಾನ್ವಿತಾಯಾಂ, ಶುಭ ನಕ್ಷತ್ರೇ, ಶುಭ ರಾಶಿ ಸ್ಥಿತೇ ಭಾಸ್ಕರೇ,',
        isShubhaHighlight: true,
        highlightBadge: 'ಶುಭ',
      },
      {
        id: 6,
        label: 'ಕ್ಷೇಮ & ಮಂಗಳ ಪ್ರಾರ್ಥನೆ',
        text: 'ಅಸ್ಮಾಕಂ ಸರ್ವೇಷಾಂ ಸಹ ಕುಟುಂಬಾನಾಂ ಕ್ಷೇಮ ಸ್ಥೈರ್ಯ ವಿಜಯ ವೀರ್ಯಾಯುರಾರೋಗ್ಯೈಶ್ವರ್ಯಾದ್ಯಭಿವೃದ್ಧರ್ಥಂ, ಸಮಸ್ತ ಮಂಗಳಾವಾಪ್ತ್ಯರ್ಥಂ,',
      },
      {
        id: 7,
        label: 'ನವಗ್ರಹ ಶಾಂತಿ & ಚತುರ್ವಿಧ ಪುರುಷಾರ್ಥ',
        text: 'ಆದಿತ್ಯಾದಿ ನವಗ್ರಹ ದೋಷ ಪೀಡಾಪರಿಹಾರಾರ್ಥಂ, ಧರ್ಮಾರ್ಥ ಕಾಮ ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಪುಣ್ಯ ಪುರುಷಾರ್ಥ ಸಿದ್ಧ್ಯರ್ಥಂ ಚ,',
      },
      {
        id: 8,
        label: 'ಸಂಕಲ್ಪ ಸಮರ್ಪಣಂ (ಪೂರ್ಣ ಶ್ಲೋಕ)',
        text: `ಶ್ರೀ ${cleanDeity} ದೇವತಾ ಪ್ರೀತ್ಯರ್ಥಂ, ${cleanGrantha} ಪಾಠಾಖ್ಯಂ ಪೂಜನಂ ಕರಿಷ್ಯೇ.`,
      },
    ];
  }, [stotraLang, sankalpaSampradaya, deityName, granthaName]);

  // Warm sacred Tanpura / Om drone + subtle brass temple bell chime using Web Audio API
  const startDroneAndBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Temple bell chime on start
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(528, ctx.currentTime);
      bellOsc.frequency.exponentialRampToValueAtTime(524, ctx.currentTime + 1.8);
      bellGain.gain.setValueAtTime(0.08, ctx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);
      bellOsc.start();
      bellOsc.stop(ctx.currentTime + 2.3);

      // Continuous low Om / Tanpura Sa-Pa drone (136.1 Hz Om + 204.15 Hz Fifth)
      if (!droneGainRef.current && droneEnabled) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);
        masterGain.connect(ctx.destination);

        [136.1, 204.15, 272.2].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          oscGain.gain.setValueAtTime(i === 0 ? 0.65 : i === 1 ? 0.25 : 0.12, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
        });

        droneGainRef.current = masterGain;
      }
    } catch {
      // AudioContext blocked or unsupported
    }
  };

  const stopDrone = () => {
    try {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    } catch {}
    audioCtxRef.current = null;
    droneGainRef.current = null;
  };

  const stopAllPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    stopDrone();
  };

  // Pick the deepest, clearest ceremonial Indian voice available
  const selectCeremonialVoice = (lang: Language): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const preferredLangCodes =
      lang === 'kn'
        ? ['kn-IN', 'kn', 'hi-IN', 'sa-IN', 'en-IN']
        : lang === 'hi'
        ? ['hi-IN', 'sa-IN', 'hi', 'en-IN']
        : ['en-IN', 'hi-IN', 'en-GB', 'en-US'];

    for (const code of preferredLangCodes) {
      const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(code.toLowerCase()));
      if (matching.length > 0) {
        // Prefer male / deep voice if named
        const male = matching.find((v) => /male|rishi|prabhat|gagan|madhur|hemant|google/i.test(v.name));
        return male || matching[0];
      }
    }
    return voices[0] || null;
  };

  const speakSegment = (index: number, rateVal: number) => {
    if (!isPlayingRef.current) return;
    if (index >= segments.length) {
      // Completed full shloka
      stopAllPlayback();
      setActiveSegmentIdx(0);
      return;
    }

    setActiveSegmentIdx(index);
    const seg = segments[index];

    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(seg.text);
        const voice = selectCeremonialVoice(stotraLang);
        if (voice) utter.voice = voice;
        utter.lang = stotraLang === 'kn' ? 'kn-IN' : stotraLang === 'hi' ? 'hi-IN' : 'en-IN';
        // Deep, slow ceremonial Vedic chanting tone matching the reference animation voice
        utter.rate = rateVal;
        utter.pitch = 0.76;
        utter.volume = 1.0;

        let advanced = false;
        const advanceNext = () => {
          if (advanced || !isPlayingRef.current) return;
          advanced = true;
          fallbackTimerRef.current = window.setTimeout(() => {
            if (isPlayingRef.current) {
              speakSegment(index + 1, rateVal);
            }
          }, 520);
        };

        utter.onend = advanceNext;
        utter.onerror = () => {
          // Graceful timed animation advance even if a headless/sandbox browser lacks TTS voices
          const estimatedMs = Math.max(3200, seg.text.length * 75);
          fallbackTimerRef.current = window.setTimeout(advanceNext, estimatedMs);
        };

        window.speechSynthesis.speak(utter);
        return;
      } catch {
        // Fall through to timed animation
      }
    }

    // Fallback synchronized timed progression when speechSynthesis is unavailable
    const durationMs = Math.max(3500, seg.text.length * 80);
    fallbackTimerRef.current = window.setTimeout(() => {
      if (isPlayingRef.current) {
        speakSegment(index + 1, rateVal);
      }
    }, durationMs);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAllPlayback();
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    startDroneAndBell();

    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    speakSegment(activeSegmentIdx, chantRate);
  };

  const handleRestart = () => {
    stopAllPlayback();
    setTimeout(() => {
      setActiveSegmentIdx(0);
      isPlayingRef.current = true;
      setIsPlaying(true);
      startDroneAndBell();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
      speakSegment(0, chantRate);
    }, 80);
  };

  const handleJumpSegment = (idx: number) => {
    const clamped = Math.max(0, Math.min(segments.length - 1, idx));
    setActiveSegmentIdx(clamped);
    if (isPlayingRef.current) {
      speakSegment(clamped, chantRate);
    }
  };

  // Toggle drone live while playing
  useEffect(() => {
    if (!droneEnabled && droneGainRef.current) {
      stopDrone();
    } else if (droneEnabled && isPlaying && !droneGainRef.current) {
      startDroneAndBell();
    }
  }, [droneEnabled]);

  // Cleanup on unmount or language/sampradaya change
  useEffect(() => {
    return () => {
      stopAllPlayback();
    };
  }, [stotraLang, sankalpaSampradaya]);

  const currentSeg = segments[activeSegmentIdx] || segments[0];
  const progressPct = ((activeSegmentIdx + 1) / segments.length) * 100;

  return (
    <div className="no-print rounded-3xl overflow-hidden border-2 border-amber-500/70 bg-stone-950 text-white shadow-2xl">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 sm:px-6 py-3.5 border-b border-amber-500/35 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-stone-950 flex items-center justify-center shadow-lg shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                {stotraLang === 'kn'
                  ? 'ಸಂಪೂರ್ಣ ಸಂಕಲ್ಪ ಮಂತ್ರ ದೃಶ್ಯ-ಶ್ರವಣ ಪಠಣ (Animated Cosmic Sankalpa Chanting)'
                  : stotraLang === 'hi'
                  ? 'सम्पूर्ण संकल्प मन्त्र दृश्य-श्रवण पठन (Animated Cosmic Sankalpa)'
                  : 'Complete Sankalpa Mantra Cosmic Animation & Chanting'}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {stotraLang === 'kn' ? 'ಪುಣ್ಯ ಪ್ರದೇಶೇ • ಶುಭ ಪಠಣ' : stotraLang === 'hi' ? 'पुण्य प्रदेशे • शुभ पाठ' : 'Punya Pradeshe • Shubha'}
              </span>
            </div>
            <p className="text-[11px] text-amber-100/80 mt-0.5">
              {stotraLang === 'kn'
                ? 'ಸ್ಥಳದ ಬದಲು "ಪುಣ್ಯ ಪ್ರದೇಶೇ", ಸಂವತ್ಸರಕ್ಕೆ "ಶುಭ ನಾಮ ಸಂವತ್ಸರೇ" ಹಾಗೂ ಎಲ್ಲಾ ನೀಲಿ ಪದಗಳಿಗೆ "ಶುಭ" ಎಂದು ಪೂರ್ಣ ಶ್ಲೋಕ ಪಠಣ.'
                : stotraLang === 'hi'
                ? 'स्थान के बदले "पुण्य प्रदेशे", संवत्सर पर "शुभ नाम संवत्सरे" तथा सभी नीले शब्दों के स्थान पर "शुभ" उच्चारण के साथ पूर्ण श्लोक।'
                : 'Chants the complete shloka using "Punya Pradeshe", "Shubha Nama Samvatsare", and "Shubha" for all dynamic blue terms.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200">
            {activeSegmentIdx + 1} / {segments.length}
          </span>
        </div>
      </div>

      {/* Main Cosmic Visual Stage */}
      <div className="relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-between overflow-hidden bg-stone-950">
        {/* Reference Cosmic Video Backdrop (Golden Jambudvipe / Earth Animation) */}
        {videoAvailable && (
          <video
            ref={videoRef}
            src="/assets/aistudio/SankalpaMain_image_place_6b7e77fc.mp4"
            loop
            muted
            playsInline
            onError={() => setVideoAvailable(false)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isPlaying ? 'opacity-55 scale-105' : 'opacity-35 scale-100'
            }`}
          />
        )}

        {/* Sacred Golden Radial Vignette & Animated Mandala Rings SVG Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.18)_0%,rgba(12,10,9,0.78)_68%,rgba(12,10,9,0.95)_100%)] pointer-events-none" />

        <svg
          viewBox="0 0 600 320"
          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g
            style={{
              transformOrigin: '300px 160px',
              animation: isPlaying ? 'spin 48s linear infinite' : 'none',
            }}
          >
            <circle cx="300" cy="160" r="118" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="300" cy="160" r="145" fill="none" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="2 8" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={300 + 108 * Math.cos(rad)}
                  y1={160 + 108 * Math.sin(rad)}
                  x2={300 + 128 * Math.cos(rad)}
                  y2={160 + 128 * Math.sin(rad)}
                  stroke="#fde047"
                  strokeWidth="1.2"
                  opacity="0.65"
                />
              );
            })}
          </g>
        </svg>

        {/* Top Stage Badge */}
        <div className="relative z-10 px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950/80 border border-amber-400/50 text-xs font-serif font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentSeg.label}</span>
          </div>

          {currentSeg.isShubhaHighlight && currentSeg.highlightBadge && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 text-xs font-bold font-serif shadow-md">
              ✦ {currentSeg.highlightBadge}
            </span>
          )}
        </div>

        {/* Center Illuminated Sacred Shloka Karaoke Display */}
        <div className="relative z-10 px-5 sm:px-10 py-6 text-center max-w-4xl mx-auto space-y-3">
          <div className="text-amber-400/90 text-xs sm:text-sm font-serif tracking-[0.25em] uppercase">
            ॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ • ವೇದೋಕ್ತ ಮಹಾ ಸಂಕಲ್ಪಃ ॥
          </div>
          <p
            key={currentSeg.id}
            className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl leading-relaxed text-amber-100 drop-shadow-[0_2px_14px_rgba(245,158,11,0.55)] animate-in fade-in zoom-in-95 duration-300"
          >
            {currentSeg.text}
          </p>
        </div>

        {/* Progress Bar & Ceremonial Controls Bar */}
        <div className="relative z-10 bg-stone-950/90 border-t border-amber-500/30 px-4 sm:px-6 py-3.5 space-y-3">
          {/* Progress Rail */}
          <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Primary Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleJumpSegment(activeSegmentIdx - 1)}
                disabled={activeSegmentIdx === 0}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-amber-200 border border-stone-700 cursor-pointer"
                title="Previous Phrase"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-400'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-stone-950'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>
                  {isPlaying
                    ? stotraLang === 'kn'
                      ? 'ವಿರಾಮ (Pause)'
                      : stotraLang === 'hi'
                      ? 'विराम (Pause)'
                      : 'Pause Chanting'
                    : stotraLang === 'kn'
                    ? 'ಸಂಪೂರ್ಣ ಸಂಕಲ್ಪ ಪಠಿಸಿ (Play)'
                    : stotraLang === 'hi'
                    ? 'सम्पूर्ण संकल्प सुनें (Play)'
                    : 'Play Full Sankalpa'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleJumpSegment(activeSegmentIdx + 1)}
                disabled={activeSegmentIdx === segments.length - 1}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-amber-200 border border-stone-700 cursor-pointer"
                title="Next Phrase"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 cursor-pointer"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Cadence Speed & Sacred Om Drone Toggle */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="inline-flex rounded-xl bg-stone-900 border border-stone-700 p-0.5">
                {[
                  { label: 'Slow', val: 0.65 },
                  { label: 'Vedic', val: 0.76 },
                  { label: 'Medium', val: 0.9 },
                ].map((spd) => (
                  <button
                    key={spd.label}
                    type="button"
                    onClick={() => setChantRate(spd.val)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                      chantRate === spd.val
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDroneEnabled(!droneEnabled)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  droneEnabled
                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
                title="Toggle Sacred Om Tanpura Drone"
              >
                {droneEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{stotraLang === 'kn' ? 'ಓಂ ನಾದ' : 'Om Drone'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Full Shloka Phrase Strip (Click Any Line to Jump) */}
      <div className="p-4 sm:p-5 bg-stone-900/90 border-t border-amber-500/25 space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
          {stotraLang === 'kn'
            ? 'ಸಂಪೂರ್ಣ "ಶುಭ" ಸಂಕಲ್ಪ ಶ್ಲೋಕ ಪಠ್ಯ (ಯಾವುದೇ ಸಾಲನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ):'
            : stotraLang === 'hi'
            ? 'सम्पूर्ण "शुभ" संकल्प श्लोक (किसी भी पंक्ति पर क्लिक करें):'
            : 'Full "Shubha" Sankalpa Shloka Transcript (Click Any Phrase to Jump):'}
        </div>
        <div className="flex flex-wrap gap-1.5 leading-relaxed font-serif text-sm">
          {segments.map((seg) => {
            const isCurrent = seg.id === activeSegmentIdx;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => handleJumpSegment(seg.id)}
                className={`text-left px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/25 border-amber-400 text-amber-100 font-bold shadow-md ring-1 ring-amber-400/50'
                    : seg.isShubhaHighlight
                    ? 'bg-emerald-950/50 border-emerald-500/35 text-emerald-200 hover:bg-emerald-900/50'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-amber-500/40 hover:text-amber-100'
                }`}
              >
                {seg.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
