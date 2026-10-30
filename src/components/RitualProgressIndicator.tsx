import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  Droplets, 
  Compass, 
  BookOpen, 
  Gift, 
  Bell,
  Check
} from 'lucide-react';
import { Language } from '../types';

export interface RitualStepMeta {
  stepNumber: number;
  id: string;
  tabKey: 'audioGuide' | 'deepaGuidelines' | 'kalasha' | 'stotra' | 'offeringLog' | 'visarjana';
  icon: string;
  name: Record<Language, string>;
  actionSummary: Record<Language, string>;
  mantraSnippet: Record<Language, string>;
}

export const RITUAL_STEPS: RitualStepMeta[] = [
  {
    stepNumber: 1,
    id: 'achamana',
    tabKey: 'audioGuide',
    icon: '💧',
    name: {
      kn: '೧. ಆಚಮನ & ಪ್ರಾಣಾಯಾಮ',
      hi: '१. आचमन एवं प्राणायाम',
      en: '1. Achamana & Pranayama'
    },
    actionSummary: {
      kn: 'ಮೂರು ಬಾರಿ ಜಲ ಪ್ರಾಶನದಿಂದ ಆಂತರಿಕ ಪವಿತ್ರತೆ ಹಾಗೂ ಪ್ರಾಣಾಯಾಮ',
      hi: 'तीन बार जल आचमन से आंतरिक शुद्धिकरण एवं प्राणायाम',
      en: 'Sipping water 3 times for internal purification and breath consecration'
    },
    mantraSnippet: {
      kn: 'ಓಂ ಶಿವಾಯ ಸ್ವಾಹಾ । ಓಂ ಮಹೇಶ್ವರಾಯ ಸ್ವಾಹಾ । ಓಂ ಶಂಭವೇ ಸ್ವಾಹಾ ॥',
      hi: 'ॐ शिवाय स्वाहा । ॐ महेश्वराय स्वाहा । ॐ शम्भवे स्वाहा ॥',
      en: 'Om Shivaya Svaha | Om Maheshvaraya Svaha | Om Shambhave Svaha'
    }
  },
  {
    stepNumber: 2,
    id: 'deepa',
    tabKey: 'deepaGuidelines',
    icon: '🪔',
    name: {
      kn: '೨. ದೀಪ ಸ್ಥಾಪನೆ & ಆಸನ ನಿಯಮ',
      hi: '२. दीप स्थापना एवं आसन नियम',
      en: '2. Deepa & Seating Direction'
    },
    actionSummary: {
      kn: 'ಪೂರ್ವ/ಉತ್ತರ ಮುಖಾಸನದಲ್ಲಿ ಕುಳಿತು ಶಾಸ್ತ್ರೋಕ್ತ ಬಲ/ಎಡ ಭಾಗದಲ್ಲಿ ದೀಪ ಬೆಳಗಿಸಿ',
      hi: 'पूर्व/उत्तर दिशा की ओर मुख कर शास्त्रसम्मत दीप प्रज्वलित करें',
      en: 'Sit facing East or North; light the auspicious lamp on right/left side'
    },
    mantraSnippet: {
      kn: 'ದೀಪಜ್ಯೋತಿಃ ಪರಾಶಕ್ತಿಃ ದೀಪಜ್ಯೋತಿಃ ಸದಾಶಿವಃ । ದೀಪೋ ಹರತು ಮೇ ಪಾಪಂ ॥',
      hi: 'दीपज्योतिः पराशक्तिः दीपज्योतिः सदाशिवः । दीपो हरतु मे पापं ॥',
      en: 'Deepa Jyotih Parashaktih Deepa Jyotih Sadashivah'
    }
  },
  {
    stepNumber: 3,
    id: 'kalasha',
    tabKey: 'kalasha',
    icon: '🏺',
    name: {
      kn: '೩. ಕಲಶ & ಪೀಠ ಪ್ರತಿಷ್ಠಾಪನೆ',
      hi: '३. कलश एवं पीठ प्रतिष्ठा',
      en: '3. Kalasha & Peetha Sthapana'
    },
    actionSummary: {
      kn: 'ಅಕ್ಕಿ ಪೀಠದ ಮೇಲೆ ತಾಮ್ರ/ಬೆಳ್ಳಿ ಕಲಶ, ಮಾವಿನೆಲೆ, ತೆಂಗಿನಕಾಯಿ ಇಟ್ಟು ತೀರ್ಥಾವಾಹನೆ',
      hi: 'अक्षत पीठ पर कलश, आम्रपल्लव व श्रीफल स्थापित कर तीर्थावाहन करें',
      en: 'Set rice altar, install copper/silver Kalasha with mango leaves & coconut'
    },
    mantraSnippet: {
      kn: 'ಕಲಶಸ್ಯ ಮುಖೇ ವಿಷ್ಣುಃ ಕಂಠೇ ರುದ್ರಃ ಸಮಾಶ್ರಿತಃ । ಗಂಗೇ ಚ ಯಮುನೇ ಚೈವ ॥',
      hi: 'कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः । गङ्गे च यमुने चैव ॥',
      en: 'Kalashe Mukhe Vishnuh Kanthe Rudrah Samashritah'
    }
  },
  {
    stepNumber: 4,
    id: 'sankalpa',
    tabKey: 'stotra',
    icon: '📜',
    name: {
      kn: '೪. ದೇಶ-ಕಾಲ ಮಹಾ ಸಂಕಲ್ಪ',
      hi: '४. देश-काल महा संकल्प',
      en: '4. Desha-Kala Maha Sankalpa'
    },
    actionSummary: {
      kn: 'ಇಂದಿನ ಸಂವತ್ಸರ, ಆಯನ, ಮಾಸ, ಪಕ್ಷ, ತಿಥಿ, ವಾರ, ನಕ್ಷತ್ರಗಳೊಂದಿಗೆ ಸಂಕಲ್ಪ ಪಠಿಸಿ',
      hi: 'वर्तमान संवत्सर, अयन, मास, पक्ष, तिथि, वार व नक्षत्र सहित संकल्प पाठ',
      en: 'Recite dynamic localized Vedic Sankalpa with exact cosmic coordinates'
    },
    mantraSnippet: {
      kn: 'ಮಮ ಉಪಾತ್ತ ಸಮಸ್ತ ದುರಿತಕ್ಷಯದ್ವಾರಾ ಶ್ರೀಪರಮೇಶ್ವರ ಪ್ರೀತ್ಯರ್ಥಂ ಶುಭ ಸಂಕಲ್ಪಂ ॥',
      hi: 'मम उपात्त समस्त दुरितक्षयद्वारा श्रीपरमेश्वर प्रीत्यर्थं शुभ संकल्पम् ॥',
      en: 'Mama Upatta Samasta Duritakshayadwara Sri Parameshwara Preetyartham'
    }
  },
  {
    stepNumber: 5,
    id: 'naivedya',
    tabKey: 'offeringLog',
    icon: '🌺',
    name: {
      kn: '೫. ಪೂಜಾ ಅರ್ಪಣೆ & ನೈವೇದ್ಯ',
      hi: '५. पूजन अर्पण एवं नैवेद्य',
      en: '5. Devotional Offerings (Naivedya)'
    },
    actionSummary: {
      kn: 'ಧೂಪ-ದೀಪ, ಪುಷ್ಪ, ನೈವೇದ್ಯ ಸಮರ್ಪಿಸಿ ಹಾಗೂ ನೈವೇದ್ಯ ಲಾಗ್‌ನಲ್ಲಿ ದಾಖಲಿಸಿ',
      hi: 'धूप-दीप, पुष्प, नैवेद्य अर्पण करें एवं नैवेद्य लॉग में प्रविष्ट करें',
      en: 'Offer flowers, incense, fruits/sweets and log in the Offering Tracker'
    },
    mantraSnippet: {
      kn: 'ಓಂ ಭೂರ್ಭುವಸ್ಸುವಃ । ದೇವಸವಿತಃ ಪ್ರಸುವ । ಸತ್ಯಂ ತ್ವರ್ತೇನ ಪರಿಷಿಂಚಾಮಿ ॥',
      hi: 'ॐ भूर्भुवः स्वः । देवसवितः प्रसुव । सत्यं त्वर्तेन परिषिञ्चामि ॥',
      en: 'Om Bhur Bhuvah Svah | Deva Savitah Prasuva'
    }
  },
  {
    stepNumber: 6,
    id: 'shanti',
    tabKey: 'visarjana',
    icon: '🔔',
    name: {
      kn: '೬. ಶಾಂತಿ ಪಾಠ & ವಿಸರ್ಜನೆ',
      hi: '६. शान्ति पाठ एवं विसर्जन',
      en: '6. Shanti Patha & Samarpanam'
    },
    actionSummary: {
      kn: 'ಮಂಗಳಾರತಿ, ಸರ್ವಲೋಕ ಶಾಂತಿ ಮಂತ್ರ ಪಠಿಸಿ ಹಾಗೂ ವಿಧಿಪೂರ್ವಕ ವಿಸರ್ಜನೆ ಮುಹೂರ್ತ ತಿಳಿಯಿರಿ',
      hi: 'मङ्गलारती, विश्व शान्ति मन्त्र पाठ एवं विधिपूर्वक विसर्जन मुहूर्त जानें',
      en: 'Mangala Arati, universal peace prayer, and concluding ritual dedication'
    },
    mantraSnippet: {
      kn: 'ಓಂ ಸರ್ವೇಷಾಂ ಸ್ವಸ್ತಿರ್ಭವತು । ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು । ಓಂ ಶಾಂತಿಃ ಶಾಂತಿಃ ಶಾಂತಿಃ ॥',
      hi: 'ॐ सर्वेषां स्वस्तिर्भवतु । सर्वे जनाः सुखिनो भवन्तु । ॐ शान्तिः शान्तिः शान्तिः ॥',
      en: 'Om Sarvesham Svastir Bhavatu | Sarve Janah Sukhino Bhavantu'
    }
  }
];

interface RitualProgressIndicatorProps {
  currentLang: Language;
  activeStep: number;
  onStepSelect: (stepNumber: number, tabKey: RitualStepMeta['tabKey']) => void;
  completedSteps: number[];
  onToggleComplete: (stepNumber: number) => void;
  onResetProgress: () => void;
}

export const RitualProgressIndicator: React.FC<RitualProgressIndicatorProps> = ({
  currentLang,
  activeStep,
  onStepSelect,
  completedSteps,
  onToggleComplete,
  onResetProgress
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const totalSteps = RITUAL_STEPS.length;
  const currentStepData = RITUAL_STEPS.find(s => s.stepNumber === activeStep) || RITUAL_STEPS[0];
  const percentComplete = Math.round((completedSteps.length / totalSteps) * 100);

  const handlePrevStep = () => {
    if (activeStep > 1) {
      const prevStep = RITUAL_STEPS[activeStep - 2];
      onStepSelect(prevStep.stepNumber, prevStep.tabKey);
    }
  };

  const handleNextStep = () => {
    if (activeStep < totalSteps) {
      const nextStep = RITUAL_STEPS[activeStep];
      onStepSelect(nextStep.stepNumber, nextStep.tabKey);
    }
  };

  const isCurrentStepDone = completedSteps.includes(activeStep);

  return (
    <div className="no-print sticky top-0 z-30 mb-4 transition-all">
      <div className="rounded-2xl border-2 border-amber-500/80 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md text-white shadow-2xl p-3 sm:p-4">
        
        {/* Top Bar: Step Title, Progress Bar & Quick Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Active Step Badge & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 flex items-center justify-center text-lg shadow-md shrink-0 ring-2 ring-amber-400/50">
              {currentStepData.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {currentLang === 'kn' ? `ಹಂತ ${activeStep} / ${totalSteps}` : currentLang === 'hi' ? `चरण ${activeStep} / ${totalSteps}` : `Step ${activeStep} of ${totalSteps}`}
                </span>
                <span className="text-[11px] font-mono font-bold text-stone-300">
                  {percentComplete}% {currentLang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : currentLang === 'hi' ? 'पूर्ण' : 'Completed'}
                </span>
              </div>

              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-200 mt-0.5">
                {currentStepData.name[currentLang]}
              </h3>
            </div>
          </div>

          {/* Right: Step Actions (Prev, Mark Done, Next, Expand Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto flex-wrap">
            
            {/* Mark Done / Completed Button */}
            <button
              onClick={() => onToggleComplete(activeStep)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isCurrentStepDone
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/50'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 hover:border-amber-400'
              }`}
              title="Toggle step completion"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {isCurrentStepDone
                  ? (currentLang === 'kn' ? 'ಮುಗಿದಿದೆ ✓' : currentLang === 'hi' ? 'सम्पन्न ✓' : 'Done ✓')
                  : (currentLang === 'kn' ? 'ಮುಗಿಸಿ' : currentLang === 'hi' ? 'पूर्ण करें' : 'Mark Done')}
              </span>
            </button>

            {/* Prev Step Button */}
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 1}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed border border-stone-700 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಹಿಂದಿನದು' : 'Prev'}</span>
            </button>

            {/* Next Step Button */}
            <button
              onClick={handleNextStep}
              disabled={activeStep === totalSteps}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed border border-amber-500 text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Next Step"
            >
              <span className="hidden sm:inline">{currentLang === 'kn' ? 'ಮುಂದಿನದು' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={onResetProgress}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              title={currentLang === 'kn' ? 'ಪ್ರಗತಿ ಮರುಹೊಂದಿಸಿ' : 'Reset Ritual Progress'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Collapse Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Stepper' : 'Expand All Steps'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Global Progress Line Bar */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mt-3 border border-stone-700">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Expanded 6 Steps Horizontal Cards Tracker */}
        {isExpanded && (
          <div className="mt-3.5 pt-3 border-t border-stone-800/80 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-2">
              {RITUAL_STEPS.map((step) => {
                const isActive = step.stepNumber === activeStep;
                const isDone = completedSteps.includes(step.stepNumber);

                return (
                  <button
                    key={step.id}
                    onClick={() => onStepSelect(step.stepNumber, step.tabKey)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border relative overflow-hidden ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                        : isDone
                        ? 'bg-emerald-950/30 border-emerald-500/50 hover:bg-emerald-950/50'
                        : 'bg-stone-850/60 border-stone-750 hover:bg-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{step.icon}</span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      ) : (
                        <Circle className="w-3 h-3 text-stone-500" />
                      )}
                    </div>

                    <div>
                      <div className={`text-[10px] font-bold leading-tight line-clamp-1 ${
                        isActive ? 'text-amber-300 font-extrabold' : isDone ? 'text-emerald-300 font-semibold' : 'text-stone-300'
                      }`}>
                        {step.name[currentLang]}
                      </div>
                      <div className="text-[9px] text-stone-400 line-clamp-1 mt-0.5">
                        {step.actionSummary[currentLang]}
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Step Mantra & Action Inset Bar */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-serif font-bold text-amber-300">
                    {currentStepData.actionSummary[currentLang]}
                  </span>
                  <div className="font-serif text-[11px] text-amber-100/90 italic mt-0.5">
                    {currentStepData.mantraSnippet[currentLang]}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-stone-400 sm:text-right shrink-0">
                {currentLang === 'kn' ? 'ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯಾ ವಿಭಾಗ ತೆರೆಯಿರಿ ➔' : currentLang === 'hi' ? 'क्लिक कर अनुभाग देखें ➔' : 'Click to jump to section ➔'}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
