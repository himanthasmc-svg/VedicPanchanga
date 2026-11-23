import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Droplets,
  BookOpen
} from 'lucide-react';
import { Language } from '../types';

interface GuptaMantraSectionProps {
  currentLang: Language;
}

type MantraScriptLang = 'kn' | 'en' | 'hi';

const MANTRA_CONTENT: Record<
  MantraScriptLang,
  {
    scriptLabel: string;
    title: string;
    deityLine: string;
    mantraText: string;
    transliterationLabel: string;
    transliterationText: string;
    hiddenNotice: string;
    revealBtn: string;
    hideBtn: string;
    vidhiHeading: string;
    vidhiSubtitle: string;
    steps: string[];
    japaHeading: string;
    japaCompleted: string;
    copyLabel: string;
    copiedLabel: string;
  }
> = {
  kn: {
    scriptLabel: 'ಕನ್ನಡ (Default)',
    title: 'ಗುಪ್ತ ಕಾಮೇಶ್ವರಿ ವಶೀಕರಣ ಮಂತ್ರ',
    deityLine: 'ಶ್ರೀ ಕಾಮೇಶ್ವರಿ ದೇವಿ ಗುಪ್ತ ಉಪಾಸನಾ ಮಂತ್ರ · ಸಂರಕ್ಷಿತ ವಿಭಾಗ',
    mantraText: 'ಓಂ ರಾಜಮುಖಿ ವಶಮುಖಿ ಕಾಮೇಶ್ವರಿ ವಶ್ಯ ಕುರು ಸ್ವಾಹಾ',
    transliterationLabel: 'ಆಂಗ್ಲ ಉಚ್ಚಾರಣೆ',
    transliterationText: 'Om Rajmukhi Vashmukhi Kaameshwari Vashya Kuru Swaha',
    hiddenNotice: 'ಈ ಮಂತ್ರದ ಜಪ ವಿಧಾನ ಮತ್ತು ಪ್ರಯೋಗ ಕ್ರಮವನ್ನು ಗೌಪ್ಯವಾಗಿ ಮುಚ್ಚಿಡಲಾಗಿದೆ. ವೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿರಿ.',
    revealBtn: 'ಗುಪ್ತ ಪ್ರಯೋಗ ವಿಧಾನವನ್ನು ತೋರಿಸಿ',
    hideBtn: 'ಪ್ರಯೋಗ ವಿಧಾನವನ್ನು ಮರೆಮಾಡಿ',
    vidhiHeading: 'ಮಂತ್ರ ಜಪ ಮತ್ತು ಪ್ರಯೋಗ ವಿಧಾನ (ಗುಪ್ತ ವಿಧಿ)',
    vidhiSubtitle: 'ಏಕಾಗ್ರತೆ ಮತ್ತು ಭಕ್ತಿಯಿಂದ ಕೆಳಗಿನ ಕ್ರಮವನ್ನು ಅನುಸರಿಸಿ',
    steps: [
      'ಎಡಗೈಯಲ್ಲಿ ಗಾಜಿನ ಲೋಟದಲ್ಲಿ (Glass material cup) ಶುದ್ಧವಾದ ನೀರನ್ನು ಹಿಡಿದುಕೊಳ್ಳಿ.',
      'ಈ ಮಂತ್ರವನ್ನು ಭಕ್ತಿ ಮತ್ತು ಏಕಾಗ್ರತೆಯಿಂದ ೭ (ಏಳು) ಬಾರಿ ಪಠಿಸಿ: "ಓಂ ರಾಜಮುಖಿ ವಶಮುಖಿ ಕಾಮೇಶ್ವರಿ ವಶ್ಯ ಕುರು ಸ್ವಾಹಾ".',
      'ನಂತರ ನೀವು ಯಾರನ್ನು ವಶೀಕರಣ ಮಾಡಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರೋ ಆ ವ್ಯಕ್ತಿಯನ್ನು (ಅವಳು / ಅವನು) ಮನಸ್ಸಿನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಸ್ಮರಿಸಿಕೊಳ್ಳಿ.',
      'ಆ ಬಳಿಕ ಆ ನೀರನ್ನು ಕುಡಿಯಿರಿ. ಆ ವ್ಯಕ್ತಿಯು ನಿಮ್ಮನ್ನು ನಿಷ್ಕಲ್ಮಶವಾಗಿ ಹಾಗೂ ನಿಸ್ವಾರ್ಥವಾಗಿ (ಅನನ್ಯವಾಗಿ) ಪ್ರೀತಿಸಲು ಪ್ರಾರಂಭಿಸುತ್ತಾರೆ.'
    ],
    japaHeading: '೭ ಬಾರಿ ಜಪ ಎಣಿಕೆ (Japa Counter)',
    japaCompleted: '೭ ಬಾರಿ ಮಂತ್ರ ಜಪ ಪೂರ್ಣಗೊಂಡಿದೆ. ಈಗ ಮನಸ್ಸಿನಲ್ಲಿ ಸ್ಮರಿಸಿ ನೀರನ್ನು ಕುಡಿಯಿರಿ.',
    copyLabel: 'ಮಂತ್ರ ನಕಲಿಸಿ',
    copiedLabel: 'ನಕಲಿಸಲಾಗಿದೆ'
  },
  en: {
    scriptLabel: 'English',
    title: 'Gupta Kaameshwari Vashikaran Mantra',
    deityLine: 'Sri Kaameshwari Devi Secret Upasana Mantra · Locked Section',
    mantraText: 'Om Rajmukhi Vashmukhi Kaameshwari Vashya Kuru Swaha',
    transliterationLabel: 'Kannada Script (Default)',
    transliterationText: 'ಓಂ ರಾಜಮುಖಿ ವಶಮುಖಿ ಕಾಮೇಶ್ವರಿ ವಶ್ಯ ಕುರು ಸ್ವಾಹಾ',
    hiddenNotice: 'The chanting procedure and usage method for this mantra are kept hidden by default. Reveal only in privacy.',
    revealBtn: 'Reveal Chanting & Usage Method',
    hideBtn: 'Hide Chanting & Usage Method',
    vidhiHeading: 'How to Chant & Use This Mantra (Hidden Vidhi)',
    vidhiSubtitle: 'Follow the exact 7-count water consecration steps with calm focus',
    steps: [
      'Hold a glass material cup filled with clean water in your left hand.',
      'Chant this mantra 7 times clearly: "Om Rajmukhi Vashmukhi Kaameshwari Vashya Kuru Swaha".',
      'Then remember and visualize the person (her / him) whom you wish to bring into your vashikaran.',
      'Drink the water afterwards — the person will love you unconditionally.'
    ],
    japaHeading: '7-Count Chanting Tracker',
    japaCompleted: '7 recitations completed. Now remember the person clearly and drink the water.',
    copyLabel: 'Copy Mantra',
    copiedLabel: 'Copied'
  },
  hi: {
    scriptLabel: 'हिन्दी',
    title: 'गुप्त कामेश्वरी वशीकरण मंत्र',
    deityLine: 'श्री कामेश्वरी देवी गुप्त उपासना मंत्र · संरक्षित अनुभाग',
    mantraText: 'ॐ राजमुखी वशमुखी कामेश्वरी वश्य कुरु स्वाहा',
    transliterationLabel: 'कन्नड़ लिपि (मूल)',
    transliterationText: 'ಓಂ ರಾಜಮುಖಿ ವಶಮುಖಿ ಕಾಮೇಶ್ವರಿ ವಶ್ಯ ಕುರು ಸ್ವಾಹಾ',
    hiddenNotice: 'इस मंत्र की जप विधि और प्रयोग क्रम गोपनीय रूप से छिपाया गया है। देखने के लिए नीचे क्लिक करें।',
    revealBtn: 'गुप्त प्रयोग विधि दिखाएँ',
    hideBtn: 'प्रयोग विधि छिपाएँ',
    vidhiHeading: 'मंत्र जप एवं प्रयोग विधि (गुप्त विधान)',
    vidhiSubtitle: 'एकाग्रता और श्रद्धा के साथ नीचे दिए गए क्रम का पालन करें',
    steps: [
      'बाएं हाथ में कांच के गिलास (Glass material cup) में शुद्ध जल धारण करें।',
      'इस मंत्र का ७ (सात) बार स्पष्ट उच्चारण करें: "ॐ राजमुखी वशमुखी कामेश्वरी वश्य कुरु स्वाहा"।',
      'इसके पश्चात जिस व्यक्ति (स्त्री / पुरुष) को आप अपने वशीकरण में लाना चाहते हैं, उनका मन में स्पष्ट स्मरण करें।',
      'तत्पश्चात उस जल को पी लें — वह व्यक्ति आपसे निस्वार्थ और अटूट प्रेम करने लगेगा।'
    ],
    japaHeading: '७ बार जप गणना (Japa Counter)',
    japaCompleted: '७ बार मंत्र जप पूर्ण हुआ। अब उनका स्मरण कर जल ग्रहण करें।',
    copyLabel: 'मंत्र कॉपी करें',
    copiedLabel: 'कॉपी किया गया'
  }
};

export const GuptaMantraSection: React.FC<GuptaMantraSectionProps> = ({ currentLang }) => {
  // Default strictly to Kannada ('kn') per user requirement ("write this in kannada default and other language as usual")
  const [mantraLang, setMantraLang] = useState<MantraScriptLang>('kn');
  // Strictly hidden by default ("how tho chant and use the mantra explained here, this has to be hidden")
  const [isVidhiRevealed, setIsVidhiRevealed] = useState<boolean>(false);
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);
  const [japaCount, setJapaCount] = useState<number>(0);

  const content = MANTRA_CONTENT[mantraLang];

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(
      `${MANTRA_CONTENT.kn.mantraText}\n${MANTRA_CONTENT.en.mantraText}\n${MANTRA_CONTENT.hi.mantraText}`
    );
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  return (
    <section
      aria-label="4. Gupta Mantra"
      className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-7 shadow-sm space-y-6"
    >
      {/* Header Row with Language Selector (Kannada Default) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {currentLang === 'kn'
                ? '೪. ಗುಪ್ತ ಮಂತ್ರ · ಪಾಸ್‌ವರ್ಡ್ ಸಂರಕ್ಷಿತ ವಿಭಾಗ'
                : currentLang === 'hi'
                ? '४. गुप्त मंत्र · पासवर्ड सुरक्षित अनुभाग'
                : '4. Gupta Mantra · Protected Section'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {content.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {content.deityLine}
          </p>
        </div>

        {/* Script Switcher (Kannada Default + English + Hindi) */}
        <div
          role="tablist"
          aria-label="Mantra Language"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start md:self-auto shrink-0"
        >
          {(['kn', 'en', 'hi'] as MantraScriptLang[]).map((langKey) => (
            <button
              key={langKey}
              type="button"
              role="tab"
              aria-selected={mantraLang === langKey}
              onClick={() => setMantraLang(langKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mantraLang === langKey
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {MANTRA_CONTENT[langKey].scriptLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Sacred Mantra Display Box */}
      <div className="rounded-2xl bg-stone-50 dark:bg-stone-950 border border-amber-300/80 dark:border-amber-800/60 p-6 sm:p-8 text-center space-y-4">
        <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          {mantraLang === 'kn'
            ? '॥ ಶ್ರೀ ಕಾಮೇಶ್ವರಿ ಮಹಾಮಂತ್ರ ॥'
            : mantraLang === 'hi'
            ? '॥ श्री कामेश्वरी महामंत्र ॥'
            : 'Sri Kaameshwari Sacred Mantra'}
        </div>

        <p className="text-xl sm:text-3xl font-serif font-black text-stone-900 dark:text-amber-100 leading-relaxed tracking-normal">
          “{content.mantraText}”
        </p>

        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-500 dark:text-stone-400">
            {content.transliterationLabel}:
          </span>
          <span className="font-medium text-stone-800 dark:text-stone-200">
            {content.transliterationText}
          </span>
        </div>

        {/* Multilingual Reference Strip (All 3 scripts available for reference) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-stone-500 dark:text-stone-400">
          <span>KN: {MANTRA_CONTENT.kn.mantraText}</span>
          <span aria-hidden="true">·</span>
          <span>HI: {MANTRA_CONTENT.hi.mantraText}</span>
        </div>

        <div className="pt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={handleCopyMantra}
            className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedMantra ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{copiedMantra ? content.copiedLabel : content.copyLabel}</span>
          </button>
        </div>
      </div>

      {/* HIDDEN CHANTING & USAGE METHOD (VIDHI) - Collapsed & Hidden by Default */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
              {isVidhiRevealed ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100">
                {content.vidhiHeading}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {isVidhiRevealed ? content.vidhiSubtitle : content.hiddenNotice}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVidhiRevealed((prev) => !prev)}
            aria-expanded={isVidhiRevealed}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto ${
              isVidhiRevealed
                ? 'bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
            }`}
          >
            {isVidhiRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{content.hideBtn}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{content.revealBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Strictly rendered only when user explicitly clicks Reveal */}
        {isVidhiRevealed && (
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-5 animate-in fade-in">
            {/* Step-by-Step Procedure */}
            <ol className="space-y-3">
              {content.steps.map((stepText, idx) => (
                <li
                  key={`vidhi-step-${idx}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-mono tabular-nums font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                    {stepText}
                  </p>
                </li>
              ))}
            </ol>

            {/* Interactive 7-Count Water Mantra Japa Counter */}
            <div className="rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                  <Droplets className="w-4 h-4 text-amber-600" />
                  <span>{content.japaHeading}</span>
                  <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    ({japaCount} / 7)
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {japaCount >= 7
                    ? content.japaCompleted
                    : mantraLang === 'kn'
                    ? 'ಪ್ರತಿ ಬಾರಿ ಮಂತ್ರ ಪಠಿಸಿದಾಗ +1 ಒತ್ತಿ ೭ ಬಾರಿ ಪೂರ್ಣಗೊಳಿಸಿ.'
                    : mantraLang === 'hi'
                    ? 'प्रत्येक मंत्र उच्चारण के बाद +1 दबाएँ और ७ बार पूर्ण करें।'
                    : 'Tap +1 after each recitation until you complete all 7 chants.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setJapaCount((prev) => Math.min(7, prev + 1))}
                  disabled={japaCount >= 7}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-emerald-600 text-white text-xs font-bold font-mono tabular-nums transition-colors cursor-pointer disabled:cursor-default whitespace-nowrap"
                >
                  {japaCount >= 7 ? '7 / 7 ✓' : `+1 (${japaCount}/7)`}
                </button>

                {japaCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setJapaCount(0)}
                    aria-label="Reset 7-count counter"
                    className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                {mantraLang === 'kn'
                  ? 'ಪೂರ್ಣಗೊಂಡ ನಂತರ ಗೌಪ್ಯತೆಗಾಗಿ "ಪ್ರಯೋಗ ವಿಧಾನವನ್ನು ಮರೆಮಾಡಿ" ಒತ್ತಿ ಮುಚ್ಚಿಡಿ.'
                  : mantraLang === 'hi'
                  ? 'पूर्ण होने के बाद गोपनीयता के लिए "प्रयोग विधि छिपाएँ" दबाकर बंद करें।'
                  : 'Click "Hide Chanting & Usage Method" once finished to keep these instructions private.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
