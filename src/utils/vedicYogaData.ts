import { KundaliData, Language, LocalizedString, PlanetPosition } from '../types';
import { PlanetaryBalaBreakdown } from './planetaryBala';

export interface VedicAsana {
  id: string;
  sanskritName: string;
  name: LocalizedString;
  poseLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetChakra: LocalizedString;
  element: LocalizedString;
  physicalBenefits: LocalizedString;
  astrologicalBalancing: LocalizedString;
  steps: LocalizedString[];
  breathingCues: LocalizedString;
  holdDuration: string;
  contraindications: LocalizedString;
  iconType: string;
}

export interface GrahaYogaProfile {
  grahaName: string;
  grahaTitle: LocalizedString;
  element: LocalizedString;
  chakra: LocalizedString;
  governedBodyParts: LocalizedString;
  imbalanceSymptoms: LocalizedString[];
  suggestedAsanas: VedicAsana[];
  pranayama: {
    name: LocalizedString;
    instructions: LocalizedString;
    duration: LocalizedString;
  };
  mudra: {
    name: LocalizedString;
    instructions: LocalizedString;
    benefits: LocalizedString;
  };
  bijaMantra: string;
  recommendedColor: string;
}

export const GRAHA_YOGA_PROFILES: Record<string, GrahaYogaProfile> = {
  Sun: {
    grahaName: 'Sun',
    grahaTitle: {
      en: 'Surya (Sun) • Vitality, Heart & Spine',
      kn: 'ಸೂರ್ಯ • ಪ್ರಾಣಶಕ್ತಿ, ಹೃದಯ ಮತ್ತು ಬೆನ್ನೆಲುಬು',
      hi: 'सूर्य • प्राणशक्ति, हृदय एवं मेरुदण्ड'
    },
    element: { en: 'Agni (Fire)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्त्व' },
    chakra: { en: 'Manipura (Solar Plexus) & Anahata', kn: 'ಮಣಿಪೂರ ಮತ್ತು ಅನಾಹತ ಚಕ್ರ', hi: 'मणिपुर एवं अनाहत चक्र' },
    governedBodyParts: {
      en: 'Spine, Heart, Eyesight, Skeletal Framework, Prana Vitality',
      kn: 'ಬೆನ್ನುಹುರಿ, ಹೃದಯ, ಕಣ್ಣಿನ ದೃಷ್ಟಿ, ಮೂಳೆಗಳು, ಪ್ರಾಣಶಕ್ತಿ',
      hi: 'मेरुदण्ड, हृदय, नेत्र ज्योति, अस्थि तंत्र, प्राण ऊर्जा'
    },
    imbalanceSymptoms: [
      { en: 'Slouching posture and lumbar weakness', kn: 'ಬೆನ್ನು ಬಾಗುವುದು ಮತ್ತು ಬೆನ್ನುನೋವು', hi: 'झुकी हुई मुद्रा एवं रीढ़ की कमजोरी' },
      { en: 'Sluggish metabolic fire (low Agni) and chronic fatigue', kn: 'ಜೀರ್ಣಶಕ್ತಿ ಕೊರತೆ ಮತ್ತು ನಿರಂತರ ಆಯಾಸ', hi: 'मन्द जठराग्नि एवं आलस्य' },
      { en: 'Circulatory sluggishness and poor cardiovascular vitality', kn: 'ರಕ್ತ ಪರಿಚಲನೆ ಕೊರತೆ ಮತ್ತು ಹೃದಯದ ದೌರ್ಬಲ್ಯ', hi: 'रक्तसंचार में शिथिलता एवं हृदय दुर्बलता' }
    ],
    pranayama: {
      name: { en: 'Surya Bhedana Pranayama', kn: 'ಸೂರ್ಯ ಭೇದನ ಪ್ರಾಣಾಯಾಮ', hi: 'सूर्य भेदन प्राणायाम' },
      instructions: {
        en: 'Close left nostril with ring finger. Inhale deeply through right nostril, retain comfortably for 3 seconds, and exhale slowly through left nostril.',
        kn: 'ಎಡ ಹೊಳ್ಳೆಯನ್ನು ಮುಚ್ಚಿ ಬಲ ಹೊಳ್ಳೆಯಿಂದ ಆಳವಾಗಿ ಉಸಿರು ತೆಗೆದುಕೊಂಡು, ೩ ಸೆಕೆಂಡು ಕುಂಭಕ ಮಾಡಿ, ಎಡ ಹೊಳ್ಳೆಯಿಂದ ನಿಧಾನವಾಗಿ ಹೊರಹಾಕಿ.',
        hi: 'बायां नथुना बंद कर दाएं नथुने से गहरी श्वास लें, ३ सेकंड रोकें और बाएं नथुने से धीरे-धीरे छोड़ें।'
      },
      duration: { en: '5 to 7 minutes before sunrise or morning practice', kn: '೫ ರಿಂದ ೭ ನಿಮಿಷ ಬೆಳಗ್ಗೆ', hi: '५ से ७ मिनट प्रातःकाल' }
    },
    mudra: {
      name: { en: 'Surya Mudra (Sun Gesture)', kn: 'ಸೂರ್ಯ ಮುದ್ರೆ', hi: 'सूर्य मुद्रा' },
      instructions: {
        en: 'Bend ring finger to touch base of thumb. Press gently with thumb.',
        kn: 'ಉಂಗುರದ ಬೆರಳನ್ನು ಹೆಬ್ಬೆರಳಿನ ಬುಡಕ್ಕೆ ಮುಟ್ಟಿಸಿ ಹೆಬ್ಬೆರಳಿನಿಂದ ಮೃದುವಾಗಿ ಒತ್ತಿರಿ.',
        hi: 'अनामिका उंगली को अंगूठे की जड़ में लगाकर अंगूठे से हल्का दबाएं।'
      },
      benefits: {
        en: 'Stirs digestive fire, dispels cold and lethargy, burns cholesterol.',
        kn: 'ಜಠರಾಗ್ನಿಯನ್ನು ಪ್ರಚೋದಿಸುತ್ತದೆ, ಆಲಸ್ಯ ದೂರಮಾಡಿ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.',
        hi: 'जठराग्नि प्रज्वलित करता है, आलस्य मिटाता है और कोलेस्ट्रॉल कम करता है।'
      }
    },
    bijaMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    recommendedColor: 'from-amber-500 to-orange-600',
    suggestedAsanas: [
      {
        id: 'surya_namaskara',
        sanskritName: 'Surya Namaskara',
        name: { en: 'Sun Salutation (12 Cyclic Asanas)', kn: 'ಸೂರ್ಯ ನಮಸ್ಕಾರ (೧೨ ಪವಿತ್ರ ಆಸನಗಳು)', hi: 'सूर्य नमस्कार (१२ दिव्य आसनों का चक्र)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'All 7 Chakras (Manipura Dominant)', kn: 'ಮಣಿಪೂರ ಮತ್ತು ಸರ್ವ ಚಕ್ರಗಳು', hi: 'मणिपुर एवं समस्त चक्र' },
        element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ', hi: 'अग्नि' },
        physicalBenefits: {
          en: 'Synergizes cardiovascular stamina, flexes entire spinal column, regulates endocrine hormones.',
          kn: 'ಸಮಸ್ತ ನರಮಂಡಲ, ಹೃದಯ ಹಾಗೂ ಬೆನ್ನೆಲುಬನ್ನು ಬಲಪಡಿಸುತ್ತದೆ; ಹಾರ್ಮೋನ್ ಸಮತೋಲನ ನೀಡುತ್ತದೆ.',
          hi: 'हृदय और रीढ़ को सुदृढ़ करता है, रक्त संचार बढ़ाता है और अंतःस्रावी ग्रंथियों को संतुलित करता है।'
        },
        astrologicalBalancing: {
          en: 'Ignites solar prana, removes planetary debilitation of the Sun, bestows regal confidence.',
          kn: 'ಸೂರ್ಯನ ದುರ್ಬಲತೆಯನ್ನು ನಿವಾರಿಸಿ ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಯಶಸ್ಸನ್ನು ಕರುಣಿಸುತ್ತದೆ.',
          hi: 'सूर्य देव की कृपा दिलाता है, दुर्बल सूर्य का शमन कर आत्मबल एवं तेज प्रदान करता है।'
        },
        steps: [
          { en: '1. Pranamasana: Stand tall in prayer posture with hands in Anjali Mudra.', kn: '೧. ಪ್ರಣಾಮಾಸನ: ಎರಡೂ ಕೈ ಮುಗಿದು ನಮಸ್ಕಾರ ಭಂಗಿ.', hi: '१. प्रणामासन: दोनों हाथ जोड़कर प्रार्थना मुद्रा में सीधे खड़े हों।' },
          { en: '2. Hastauttanasana: Inhale, arch backward opening the chest.', kn: '೨. ಹಸ್ತೋತ್ಥಾನಾಸನ: ಉಸಿರೆಳೆದು ಕೈಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ ಹಿಂದಕ್ಕೆ ಬಾಗಿ.', hi: '२. हस्तउत्तानासन: श्वास भरते हुए दोनों हाथ ऊपर उठाकर पीछे झुकें।' },
          { en: '3. Padahastasana: Exhale, bend forward touching toes or mat.', kn: '೩. ಪಾದಹಸ್ತಾಸನ: ಉಸಿರು ಬಿಡುತ್ತಾ ಮುಂದೆ ಬಾಗಿ ಪಾದ ಮುಟ್ಟಿ.', hi: '३. पादहस्तासन: श्वास छोड़ते हुए आगे झुककर पाँव छुएं।' },
          { en: '4. Ashwa Sanchalanasana: Inhale, slide right leg back, gaze up.', kn: '೪. ಅಶ್ವಸಂಚಾಲನಾಸನ: ಬಲಗಾಲನ್ನು ಹಿಂದೆ ಚಾಚಿ ಮೇಲ್ಮುಖವಾಗಿ ನೋಡಿ.', hi: '४. अश्वसञ्चालनासन: दायां पैर पीछे ले जाकर दृष्टि ऊपर रखें।' }
        ],
        breathingCues: {
          en: 'Rhythmic breath: Inhale on expansions, Exhale on contractions.',
          kn: 'ದೇಹ ಹಿಗ್ಗುವಾಗ ಉಸಿರೆಳೆದುಕೊಳ್ಳಿ, ಬಾಗುವಾಗ ಉಸಿರು ಬಿಡಿ.',
          hi: 'विस्तार में श्वास लें, संकोच में श्वास छोड़ें।'
        },
        holdDuration: '3 to 6 complete rounds (10 mins)',
        contraindications: {
          en: 'Avoid rapid movements during acute hernia or high blood pressure.',
          kn: 'ತೀವ್ರ ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಹರ್ನಿಯಾ ಇದ್ದರೆ ನಿಧಾನವಾಗಿ ಮಾಡಿ.',
          hi: 'उच्च रक्तचाप या हर्निया में तीव्रता से न करें।'
        },
        iconType: 'sun_salutation'
      },
      {
        id: 'bhujangasana',
        sanskritName: 'Bhujangasana',
        name: { en: 'Cobra Pose', kn: 'ಭುಜಂಗಾಸನ', hi: 'भुजङ्गासन' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Anahata (Heart) & Manipura', kn: 'ಅನಾಹತ ಮತ್ತು ಮಣಿಪೂರ', hi: 'अनाहत एवं मणिपुर' },
        element: { en: 'Fire', kn: 'ಅಗ್ನಿ', hi: 'अग्नि' },
        physicalBenefits: {
          en: 'Decompresses thoracic vertebrae, expands lungs, tones liver and spleen.',
          kn: 'ಎದೆಯನ್ನು ಹಿಗ್ಗಿಸುತ್ತದೆ, ಶ್ವಾಸಕೋಶದ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸಿ ಬೆನ್ನಿನ ಕಶೇರುಕಗಳನ್ನು ಸಡಿಲಗೊಳಿಸುತ್ತದೆ.',
          hi: 'फेफड़ों का विस्तार करता है, रीढ़ की हड्डी को लचीला बनाता है एवं यकृत को सक्रिय करता है।'
        },
        astrologicalBalancing: {
          en: 'Strengthens weak Sun in 6th/8th/12th houses; counteracts low confidence and spinal slouch.',
          kn: '೬, ೮ ಅಥವಾ ೧೨ನೇ ಮನೆಯಲ್ಲಿರುವ ಸೂರ್ಯನ ದೋಷ ಪರಿಹರಿಸಿ ಬೆನ್ನಿನ ಶಕ್ತಿ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'कमजोर सूर्य को बल देता है, रीढ़ के झुकाव को ठीक कर आत्मसम्मान में वृद्धि करता है।'
        },
        steps: [
          { en: 'Lie flat on your stomach with palms under shoulders.', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲೆ ಮಲಗಿ, ಕೈಗಳನ್ನು ಭುಜದ ಕೆಳಗೆ ಇರಿಸಿ.', hi: 'पेट के बल लेटें, हथेलियों को कन्धों के नीचे रखें।' },
          { en: 'Inhale, slowly lift chest upward using back muscles without straining arms.', kn: 'ಉಸಿರೆಳೆದುಕೊಂಡು ಬೆನ್ನಿನ ಶಕ್ತಿಯಿಂದ ಎದೆಯನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ.', hi: 'श्वास भरते हुए छाती को ऊपर उठाएं, नाभि जमीन पर रहे।' },
          { en: 'Keep shoulders relaxed and gaze softly upward.', kn: 'ಭುಜಗಳನ್ನು ಸಡಿಲವಾಗಿಟ್ಟು ಮೇಲ್ಮುಖವಾಗಿ ನೋಡಿ.', hi: 'कन्धों को ढीला रखें और दृष्टि ऊपर की ओर रखें।' }
        ],
        breathingCues: {
          en: 'Inhale to lift, smooth deep belly breathing while holding.',
          kn: 'ಮೇಲೇಳುವಾಗ ಉಸಿರೆಳೆದು, ನಿಧಾನವಾಗಿ ಉಸಿರಾಟ ನಡೆಸಿ.',
          hi: 'उठते समय श्वास लें, मुद्रा में रहकर गहरा श्वास लें।'
        },
        holdDuration: '5 deep breaths (30 seconds)',
        contraindications: {
          en: 'Avoid in acute peptic ulcer, abdominal surgery, or pregnancy.',
          kn: 'ಹೊಟ್ಟೆಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಅಥವಾ ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಮಾಡಬೇಡಿ.',
          hi: 'पेट की सर्जरी या गर्भावस्था में वर्जित।'
        },
        iconType: 'cobra'
      },
      {
        id: 'tadasana',
        sanskritName: 'Tadasana',
        name: { en: 'Mountain Pose (Royal Alignment)', kn: 'ತಾಡಾಸನ (ರಾಜ ಗಾಂಭೀರ್ಯ ಭಂಗಿ)', hi: 'ताड़ासन (राजसी समस्थिति)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Muladhara & Sahasrara', kn: 'ಮೂಲಾಧಾರ ಮತ್ತು ಸಹಸ್ರಾರ', hi: 'मूलाधार एवं सहस्रार' },
        element: { en: 'Earth & Fire', kn: 'ಪೃಥ್ವಿ ಮತ್ತು ಅಗ್ನಿ', hi: 'पृथ्वी एवं अग्नि' },
        physicalBenefits: {
          en: 'Corrects postural asymmetries, aligns spinal columns, grounds nervous energy.',
          kn: 'ದೇಹದ ನಿಲುವನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ, ಸಮತೋಲನ ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಏಕಾಗ್ರತೆ ನೀಡುತ್ತದೆ.',
          hi: 'शारीरिक मुद्रा को संतुलित करता है, मेरुदण्ड सीधा रखता है और एकाग्रता बढ़ाता है।'
        },
        astrologicalBalancing: {
          en: 'Imparts regal solar posture, cures rounded shoulders from computer use.',
          kn: 'ರಾಜಯೋಗದ ಸೂರ್ಯನ ತೇಜಸ್ಸನ್ನು ದೇಹದ ಆಕಾರದಲ್ಲಿ ಪ್ರತಿಷ್ಠಾಪಿಸುತ್ತದೆ.',
          hi: 'सूर्य के तेज को शरीर में स्थिर करता है, आलस्य और कुबड़ापन दूर करता है।'
        },
        steps: [
          { en: 'Stand with feet hip-width apart, weight evenly distributed.', kn: 'ಪಾದಗಳನ್ನು ಸಮನಾಗಿಟ್ಟು ನೇರವಾಗಿ ನಿಲ್ಲಿ.', hi: 'पैरों को समानांतर रखकर सीधे खड़े हों।' },
          { en: 'Roll shoulders back and down, lengthen crown towards the ceiling.', kn: 'ಭುಜಗಳನ್ನು ಹಿಂದಕ್ಕೆ ತಿರುಗಿಸಿ ನೆಟ್ಟಗೆ ನಿಲ್ಲಿ.', hi: 'कन्धों को पीछे घुमाएं, सिर को ऊपर की ओर खींचें।' },
          { en: 'Inhale, raise arms overhead interlacing fingers and stretch upward.', kn: 'ಉಸಿರೆಳೆದು ಕೈಗಳನ್ನು ಮೇಲಕ್ಕೆ ಚಾಚಿ ಇಡೀ ದೇಹವನ್ನು ಮೇಲಕ್ಕೆ ಎಳೆಯಿರಿ.', hi: 'श्वास लेते हुए दोनों हाथों को ऊपर खींचकर पंजों पर खड़े हों।' }
        ],
        breathingCues: {
          en: 'Slow, dignified diaphragm breathing.',
          kn: 'ಶಾಂತ ಮತ್ತು ಆಳವಾದ ಉಸಿರಾಟ.',
          hi: 'धीमी और गहरी प्राणवायु का संचार।'
        },
        holdDuration: '60 seconds',
        contraindications: {
          en: 'Practice against a wall if suffering from acute vertigo.',
          kn: 'ತಲೆಸುತ್ತು ಇದ್ದರೆ ಗೋಡೆಯ ಆಧಾರ ತೆಗೆದುಕೊಂಡು ಮಾಡಿ.',
          hi: 'चक्कर आने की स्थिति में दीवार के सहारे करें।'
        },
        iconType: 'mountain'
      }
    ]
  },
  Moon: {
    grahaName: 'Moon',
    grahaTitle: {
      en: 'Chandra (Moon) • Mind, Emotions & Lymphatic Fluids',
      kn: 'ಚಂದ್ರ • ಮನಸ್ಸು, ಭಾವನೆಗಳು ಮತ್ತು ರಸಧಾತು',
      hi: 'चन्द्र • मन, भावनाएं एवं जलीय तत्त्व'
    },
    element: { en: 'Jala (Water)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्त्व' },
    chakra: { en: 'Swadhisthana (Sacral) & Ajna', kn: 'ಸ್ವಾದಿಷ್ಠಾನ ಮತ್ತು ಆಜ್ಞಾ ಚಕ್ರ', hi: 'स्वाधिष्ठान एवं आज्ञा चक्र' },
    governedBodyParts: {
      en: 'Mind (Manas), Lungs, Body Fluids, Lymph, Sleep Cycles',
      kn: 'ಮನಸ್ಸು, ಶ್ವಾಸಕೋಶ, ರಸಧಾತು, ನಿದ್ರೆ ಮತ್ತು ರಕ್ತದ್ರವ',
      hi: 'मन, मस्तिष्क, फेफड़े, लसिका तंत्र, अनिद्रा व शारीरिक जल'
    },
    imbalanceSymptoms: [
      { en: 'Emotional anxiety, mood swings, and insomnia', kn: 'ಮಾನಸಿಕ ಚಂಚಲತೆ, ಆತಂಕ ಮತ್ತು ನಿದ್ರಾಹೀನತೆ', hi: 'मानसिक बेचैनी, तनाव एवं अनिद्रा' },
      { en: 'Water retention, lymphatic stagnation, and chest congestion', kn: 'ದೇಹದಲ್ಲಿ ನೀರು ತುಂಬಿಕೊಳ್ಳುವುದು ಮತ್ತು ಎದೆಯ ದಟ್ಟಣೆ', hi: 'जल संचय (वाटर रिटेंशन) एवं कफ विकार' },
      { en: 'Hypersensitivity and restlessness at night', kn: 'ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ನಿದ್ರೆ ಬಾರದಿರುವುದು ಮತ್ತು ಅತಿಯಾದ ಸೂಕ್ಷ್ಮತೆ', hi: 'अतिसंवेदनशीलता एवं रात्रि में बेचैनी' }
    ],
    pranayama: {
      name: { en: 'Chandra Bhedana & Sheetali', kn: 'ಚಂದ್ರ ಭೇದನ ಮತ್ತು ಶೀತಲೀ ಪ್ರಾಣಾಯಾಮ', hi: 'चन्द्र भेदन एवं शीतली प्राणायाम' },
      instructions: {
        en: 'Close right nostril. Inhale exclusively through left nostril, retain for 2 seconds, and exhale smoothly through right nostril.',
        kn: 'ಬಲ ಹೊಳ್ಳೆ ಮುಚ್ಚಿ ಕೇವಲ ಎಡ ಹೊಳ್ಳೆಯಿಂದ ಉಸಿರೆಳೆದು, ೨ ಸೆಕೆಂಡು ನಿಲ್ಲಿಸಿ, ಬಲ ಹೊಳ್ಳೆಯಿಂದ ಹೊರಹಾಕಿ.',
        hi: 'दायां नथुना बंद कर केवल बाएं से श्वास लें और दाएं से बाहर निकालें।'
      },
      duration: { en: '5 to 10 minutes in the evening or before sleep', kn: 'ಸಂಜೆ ಅಥವಾ ಮಲಗುವ ಮುನ್ನ ೫-೧೦ ನಿಮಿಷ', hi: 'संध्याकाल या सोने से पूर्व ५-१० मिनट' }
    },
    mudra: {
      name: { en: 'Varuna Mudra (Water Balancing)', kn: 'ವರುಣ ಮುದ್ರೆ', hi: 'वरुण मुद्रा' },
      instructions: {
        en: 'Touch tip of little finger to tip of thumb with light pressure.',
        kn: 'ಕಿರುಬೆರಳಿನ ತುದಿಯನ್ನು ಹೆಬ್ಬೆರಳಿನ ತುದಿಗೆ ಮುಟ್ಟಿಸಿ ಮೃದುವಾಗಿ ಹಿಡಿಯಿರಿ.',
        hi: 'कनिष्ठिका (छोटी उंगली) के अग्रभाग को अंगूठे के अग्रभाग से स्पर्श करें।'
      },
      benefits: {
        en: 'Hydrates cells, cools Pitta fire, soothes anxiety, balances hormones.',
        kn: 'ಭಾವನಾತ್ಮಕ ಸಮತೋಲನ ನೀಡುತ್ತದೆ, ಜಲತತ್ವವನ್ನು ಶುದ್ಧೀಕರಿಸುತ್ತದೆ.',
        hi: 'जल तत्त्व को संतुलित करता है, त्वचा में निखार लाता है और मानसिक शांति देता है।'
      }
    },
    bijaMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    recommendedColor: 'from-sky-400 to-indigo-500',
    suggestedAsanas: [
      {
        id: 'viparita_karani',
        sanskritName: 'Viparita Karani',
        name: { en: 'Legs-Up-The-Wall Pose (Restorative Inversion)', kn: 'ವಿಪರೀತ ಕರಣಿ (ಕಾಲುಗಳನ್ನು ಗೋಡೆಯ ಮೇಲಿಡುವ ವಿಶ್ರಾಂತಿ ಭಂಗಿ)', hi: 'विपरीत करणी (दीवार के सहारे पादोत्थानासन)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Swadhisthana & Sahasrara', kn: 'ಸ್ವಾದಿಷ್ಠಾನ ಮತ್ತು ವಿಶುದ್ಧಿ', hi: 'स्वाधिष्ठान एवं सहस्रार' },
        element: { en: 'Water', kn: 'ಜಲ', hi: 'जल' },
        physicalBenefits: {
          en: 'Drains pooled venous blood and lymph from legs, calms parasympathetic nervous system, treats chronic insomnia.',
          kn: 'ಕಾಲುಗಳ ಊತ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ, ರಕ್ತವನ್ನು ಹೃದಯ ಮತ್ತು ಮಿದುಳಿಗೆ ಮರಳಿ ತರುತ್ತದೆ, ಗಾಢ ನಿದ್ರೆ ನೀಡುತ್ತದೆ.',
          hi: 'पैरों की सूजन मिटाता है, लसिका प्रवाह सुधारता है और अनिद्रा को जड़ से खत्म करता है।'
        },
        astrologicalBalancing: {
          en: 'Pacifies afflicted Moon (Chandra dosha / Kemadruma), deeply calms racing lunar thoughts.',
          kn: 'ಚಂದ್ರನ ಚಂಚಲತೆಯನ್ನು ಶಮನಗೊಳಿಸಿ ಮನಸ್ಸಿಗೆ ಪರಮ ಶಾಂತಿ ನೀಡುತ್ತದೆ.',
          hi: 'पीड़ित चन्द्रमा के मानसिक तनाव और अनिद्रा का सर्वोत्तम शमन करता है।'
        },
        steps: [
          { en: 'Sit sideways against a wall, gently pivot hips and swing legs up the wall.', kn: 'ಗೋಡೆಯ ಪಕ್ಕ ಕುಳಿತು ನಿಧಾನವಾಗಿ ಕಾಲುಗಳನ್ನು ಗೋಡೆಯ ಮೇಲೆ ಚಾಚಿ ಮಲಗಿ.', hi: 'दीवार के पास बैठें और दोनों पैरों को दीवार पर सीधा ऊपर उठाएं।' },
          { en: 'Rest head and back flat on the floor with arms open at 45 degrees, palms facing up.', kn: 'ತೋಳುಗಳನ್ನು ಪಕ್ಕದಲ್ಲಿಟ್ಟು ಹಸ್ತಗಳನ್ನು ಮೇಲ್ಮುಖವಾಗಿಡಿ.', hi: 'हाथों को बगल में फैलाकर हथेलियां ऊपर रखें।' },
          { en: 'Close your eyes and breathe into the lower belly.', kn: 'ಕಣ್ಣು ಮುಚ್ಚಿ ಹೊಟ್ಟೆಯ ಆಳದಿಂದ ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ.', hi: 'नेत्र बंद कर पेट की गहरी श्वास लें।' }
        ],
        breathingCues: {
          en: 'Prolonged exhalation: inhale for 4 counts, exhale for 6 counts.',
          kn: 'ಉಸಿರು ಬಿಡುವುದನ್ನು ಹೆಚ್ಚು ದೀರ್ಘವಾಗಿಸಿ (೪ ಎಳೆತ, ೬ ಬಿಡುವಿಕೆ).',
          hi: 'प्रश्वास को धीमा और गहरा रखें (४ सेकंड पूरक, ६ सेकंड रेचक)।'
        },
        holdDuration: '5 to 10 minutes',
        contraindications: {
          en: 'Avoid during active menstruation or acute glaucoma.',
          kn: 'ಮಾಸಿಕ ದಿನಗಳಲ್ಲಿ ಅಥವಾ ಕಣ್ಣಿನ ತೀವ್ರ ಒತ್ತಡವಿದ್ದರೆ ಮಾಡಬೇಡಿ.',
          hi: 'मासिक धर्म या मोतियाबिंद/ग्लूकोमा में न करें।'
        },
        iconType: 'inversion'
      },
      {
        id: 'balasana',
        sanskritName: 'Balasana',
        name: { en: "Child's Pose", kn: 'ಬಾಲಾಸನ (ಮಗುವಿನ ಭಂಗಿ)', hi: 'बालासन (शिशु विश्रांति आसन)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Ajna (Third Eye)', kn: 'ಆಜ್ಞಾ ಚಕ್ರ', hi: 'आज्ञा चक्र' },
        element: { en: 'Water & Earth', kn: 'ಜಲ ಮತ್ತು ಪೃಥ್ವಿ', hi: 'जल एवं पृथ्वी' },
        physicalBenefits: {
          en: 'Gently stretches lower back and hips, releases mental overload, lowers cortisol.',
          kn: 'ನರಮಂಡಲವನ್ನು ತಂಪಾಗಿಸುತ್ತದೆ, ಸೊಂಟದ ಒತ್ತಡವನ್ನು ನಿವಾರಿಸಿ ಪ್ರಶಾಂತತೆ ನೀಡುತ್ತದೆ.',
          hi: 'मानसिक तनाव मिटाता है, पीठ के निचले हिस्से को आराम देता है और रक्तचाप सामान्य करता है।'
        },
        astrologicalBalancing: {
          en: 'Restores motherly somatic safety, heals childhood lunar trauma and emotional insecurity.',
          kn: 'ಚಂದ್ರನ ಅತಿಯಾದ ಭಾವುಕತೆ ಮತ್ತು ಒಂಟಿತನದ ಭಾವನೆಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ.',
          hi: 'चन्द्रमा से उत्पन्न भय, असुरक्षा की भावना और मानसिक अस्थिरता को दूर करता है।'
        },
        steps: [
          { en: 'Kneel on the floor, touch big toes together, sit on heels with knees separated.', kn: 'ಮಂಡಿಯೂರಿ ಕುಳಿತು ಪಾದದ ಹಿಮ್ಮಡಿಗಳ ಮೇಲೆ ಕುಳಿತುಕೊಳ್ಳಿ.', hi: 'घुटनों के बल बैठें, नितम्बों को एड़ियों पर टिकाएं।' },
          { en: 'Exhale, fold torso forward between thighs, resting forehead on mat.', kn: 'ಮುಂದೆ ಬಾಗಿ ಹಣೆ ನೆಲಕ್ಕೆ ಮುಟ್ಟಿಸಿ ಕೈಗಳನ್ನು ಮುಂದೆ ಚಾಚಿ.', hi: 'आगे झुकते हुए माथा जमीन पर टिकाएं और हाथ आगे फैलाएं।' },
          { en: 'Allow entire spine to round and surrender to gravity.', kn: 'ಇಡೀ ಬೆನ್ನುಮೂಳೆಯನ್ನು ಸಡಿಲಗೊಳಿಸಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.', hi: 'सम्पूर्ण शरीर को शिथिल छोड़ दें।' }
        ],
        breathingCues: {
          en: 'Soft, whispering lunar breaths expanding into the posterior ribs.',
          kn: 'ಬೆನ್ನಿನ ಪಕ್ಕೆಲುಬುಗಳಲ್ಲಿ ಉಸಿರನ್ನು ಅನುಭವಿಸಿ.',
          hi: 'पीठ के पिछले हिस्से में श्वास का अनुभव करें।'
        },
        holdDuration: '2 to 3 minutes',
        contraindications: {
          en: 'Use a cushion under knees if suffering from acute knee inflammation.',
          kn: 'ಮಂಡಿನೋವು ಇದ್ದರೆ ಮಂಡಿಯ ಕೆಳಗೆ ಮೆತ್ತನೆಯ ದಿಂಬು ಇಟ್ಟುಕೊಳ್ಳಿ.',
          hi: 'घुटनों में तीव्र दर्द होने पर तकिए का सहारा लें।'
        },
        iconType: 'child'
      }
    ]
  },
  Mars: {
    grahaName: 'Mars',
    grahaTitle: {
      en: 'Mangala / Kuja (Mars) • Muscle Stamina & Core Power',
      kn: 'ಮಂಗಳ (ಕುಜ) • ಮಾಂಸಖಂಡಗಳ ಶಕ್ತಿ ಮತ್ತು ಆತ್ಮಸ್ಥೈರ್ಯ',
      hi: 'मंगल • पेशीय शक्ति, साहस एवं आन्तरिक अग्नि'
    },
    element: { en: 'Tejas (Fierce Fire)', kn: 'ತೇಜಸ್ / ಅಗ್ನಿ', hi: 'तेजस / उग्र अग्नि' },
    chakra: { en: 'Muladhara (Root) & Manipura', kn: 'ಮೂಲಾಧಾರ ಮತ್ತು ಮಣಿಪೂರ', hi: 'मूलाधार एवं मणिपुर' },
    governedBodyParts: {
      en: 'Muscular System, Bone Marrow, Physical Stamina, Blood Production, Pelvic Floor',
      kn: 'ಸ್ನಾಯುಗಳು, ಮಜ್ಜಾ ಧಾತು, ರಕ್ತಕಣಗಳು, ದೈಹಿಕ ತ್ರಾಣ',
      hi: 'मांसपेशियां, मज्जा, रक्त कणिकाएं, शारीरिक सहनशक्ति'
    },
    imbalanceSymptoms: [
      { en: 'Muscle cramping, impulsive strain, and tendon stiffness', kn: 'ಸ್ನಾಯು ಸೆಳೆತ, ಅತಿಯಾದ ಕೋಪ ಮತ್ತು ಕೀಲುಗಳ ನೋವು', hi: 'मांसपेशियों में खिंचाव, अकारण क्रोध एवं रक्त विकार' },
      { en: 'Excess internal heat, inflammation, and sciatica irritation', kn: 'ದೇಹದಲ್ಲಿ ಅತಿಯಾದ ಉಷ್ಣತೆ, ಉರಿ ಮತ್ತು ಆಮ್ಲೀಯತೆ', hi: 'अत्यधिक शारीरिक ताप, सूजन एवं साइटिका' }
    ],
    pranayama: {
      name: { en: 'Sheetkari & Gentle Nadi Shodhana', kn: 'ಶೀತ್ಕಾರೀ ಮತ್ತು ನಾಡೀ ಶೋಧನ', hi: 'शीत्कारी एवं नाड़ी शोधन' },
      instructions: {
        en: 'Clench teeth gently, inhale through teeth with a hissing sound cooling the tongue. Exhale gently through both nostrils.',
        kn: 'ಹಲ್ಲುಗಳನ್ನು ಹತ್ತಿರ ತಂದು ನಾಲಿಗೆಯಿಂದ ತಂಪಾದ ಉಸಿರೆಳೆದು, ಮೂಗಿನಿಂದ ನಿಧಾನವಾಗಿ ಹೊರಹಾಕಿ.',
        hi: 'दांतों को मिलाकर सीत्कार ध्वनि के साथ श्वास भीतर लें और नाक से बाहर निकालें।'
      },
      duration: { en: '5 minutes to dissipate reactive anger', kn: '೫ ನಿಮಿಷಗಳ ಕಾಲ', hi: '५ मिनट' }
    },
    mudra: {
      name: { en: 'Prithvi Mudra (Grounding Strength)', kn: 'ಪೃಥ್ವಿ ಮುದ್ರೆ', hi: 'पृथ्वी मुद्रा' },
      instructions: {
        en: 'Touch tip of ring finger to thumb tip with firm contact.',
        kn: 'ಉಂಗುರದ ಬೆರಳಿನ ತುದಿಯನ್ನು ಹೆಬ್ಬೆರಳಿಗೆ ತಾಗಿಸಿ ಸ್ಥಿರವಾಗಿಡಿ.',
        hi: 'अनामिका के अग्रभाग को अंगूठे से दृढ़ता से स्पर्श करें।'
      },
      benefits: {
        en: 'Stabilizes raw impulsive energy, builds lean muscular stamina, anchors vitality.',
        kn: 'ಕೋಪ ಶಮನಗೊಳಿಸಿ ಶಕ್ತಿಯನ್ನು ಸಕಾರಾತ್ಮಕವಾಗಿ ಬಳಸಿಕೊಳ್ಳಲು ನೆರವಾಗುತ್ತದೆ.',
        hi: 'क्रोध को नियंत्रित कर शारीरिक स्थिरता एवं ओज बढ़ाता है।'
      }
    },
    bijaMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    recommendedColor: 'from-red-600 to-rose-700',
    suggestedAsanas: [
      {
        id: 'virabhadrasana',
        sanskritName: 'Virabhadrasana II',
        name: { en: 'Warrior II Pose (Focused Heroic Stance)', kn: 'ವೀರಭದ್ರಾಸನ ೨ (ಶೌರ್ಯ ಮತ್ತು ಧೈರ್ಯದ ನಿಲುವು)', hi: 'वीरभद्रासन द्वितीय (वीर पराक्रम मुद्रा)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Manipura & Muladhara', kn: 'ಮಣಿಪೂರ ಮತ್ತು ಮೂಲಾಧಾರ', hi: 'मणिपुर एवं मूलाधार' },
        element: { en: 'Fire & Earth', kn: 'ಅಗ್ನಿ ಮತ್ತು ಪೃಥ್ವಿ', hi: 'अग्नि एवं पृथ्वी' },
        physicalBenefits: {
          en: 'Builds quadriceps, gluteal and core endurance; stabilizes hip joints and improves stance.',
          kn: 'ತೊಡೆ ಮತ್ತು ಕಾಲಿನ ಸ್ನಾಯುಗಳನ್ನು ಗಟ್ಟಿಗೊಳಿಸುತ್ತದೆ, ಸೊಂಟದ ಸ್ಥಿರತೆ ಹಾಗೂ ದೈಹಿಕ ದೃಢತೆ ನೀಡುತ್ತದೆ.',
          hi: 'जांघों और पैरों को वज्र समान बनाता है, संतुलन और सहनशक्ति बढ़ाता है।'
        },
        astrologicalBalancing: {
          en: 'Channels raw Martian fire into disciplined courage; mitigates Kuja Dosha and impatience.',
          kn: 'ಮಂಗಳನ ಉಗ್ರತೆಯನ್ನು ಸನ್ಮಾರ್ಗಕ್ಕೆ ತಿರುಗಿಸುತ್ತದೆ, ಕುಜದೋಷದ ದುಷ್ಪರಿಣಾಮ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
          hi: 'मंगल के उग्र स्वभाव को शांत कर एकाग्र साहस एवं अनुशासन में परिवर्तित करता है।'
        },
        steps: [
          { en: 'Step feet wide apart (~4 feet), turn right foot out 90 degrees.', kn: 'ಕಾಲುಗಳನ್ನು ೪ ಅಡಿ ಅಗಲವಾಗಿಡಿ, ಬಲ ಪಾದವನ್ನು ೯೦ ಡಿಗ್ರಿ ಹೊರಕ್ಕೆ ತಿರುಗಿಸಿ.', hi: 'पैरों को ४ फीट फैलाएं, दायां पैर ९० डिग्री बाहर करें।' },
          { en: 'Bend right knee over ankle, stretch arms parallel to floor at shoulder height.', kn: 'ಬಲ ಮೊಣಕಾಲನ್ನು ಬಗ್ಗಿಸಿ ಕೈಗಳನ್ನು ಭುಜದ ಮಟ್ಟಕ್ಕೆ ಚಾಚಿ.', hi: 'दायां घुटना मोड़ें और दोनों हाथ कन्धों की सीध में फैलाएं।' },
          { en: 'Gaze steadily past right middle finger with warrior resolve.', kn: 'ಬಲಗೈ ಬೆರಳುಗಳ ಕಡೆಗೆ ದೃಢವಾದ ದೃಷ್ಟಿ ಇಡಿ.', hi: 'दृष्टि को दाएं हाथ की उंगलियों पर एकाग्र रखें।' }
        ],
        breathingCues: {
          en: 'Deep, steady diaphragmatic warrior breathing through the nose.',
          kn: 'ಆಳವಾದ, ಸ್ಥಿರ ಉಸಿರಾಟ.',
          hi: 'गहरी और स्थिर नासिका श्वास।'
        },
        holdDuration: '5 deep breaths per side',
        contraindications: {
          en: 'Shorten stance if you have knee meniscus injuries.',
          kn: 'ತೀವ್ರ ಮೊಣಕಾಲು ನೋವಿದ್ದರೆ ಹೆಚ್ಚು ಬಗ್ಗಬೇಡಿ.',
          hi: 'घुटने में दर्द हो तो ज्यादा न झुकें।'
        },
        iconType: 'warrior'
      },
      {
        id: 'navasana',
        sanskritName: 'Navasana',
        name: { en: 'Boat Pose (Core Agni Harnessing)', kn: 'ನಾವಾಸನ (ಉದರ ಅಗ್ನಿ ಪ್ರದೀಪಕ)', hi: 'नावासन (जठराग्नि प्रदीपक नौकासन)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Manipura (Navel Center)', kn: 'ಮಣಿಪೂರ (ನಾಭಿ ಕೇಂದ್ರ)', hi: 'मणिपुर (नाभि केन्द्र)' },
        element: { en: 'Fire', kn: 'ಅಗ್ನಿ', hi: 'अग्नि' },
        physicalBenefits: {
          en: 'Fires up abdominal rectus and transverse muscles, strengthens lumbar extensors.',
          kn: 'ಹೊಟ್ಟೆಯ ಬೊಜ್ಜು ಕರಗಿಸುತ್ತದೆ, ಕೋರ್ ಸ್ನಾಯುಗಳನ್ನು ಅತ್ಯಂತ ಶಕ್ತಿಶಾಲಿಯಾಗಿಸುತ್ತದೆ.',
          hi: 'पेट की चर्बी कम करता है, कोर मांसपेशियों और रीढ़ को सुदृढ़ बनाता है।'
        },
        astrologicalBalancing: {
          en: 'Activates sluggish Mars; burns away physical laziness and procrastination.',
          kn: 'ಮಂಗಳನ ದೌರ್ಬಲ್ಯವನ್ನು ಹೋಗಲಾಡಿಸಿ ಚುರುಕುತನ, ಉತ್ಸಾಹ ನೀಡುತ್ತದೆ.',
          hi: 'आलस्य और काम टालने की प्रवृत्ति को नष्ट कर कार्यक्षमता बढ़ाता है।'
        },
        steps: [
          { en: 'Sit with knees bent, feet flat on the floor.', kn: 'ಮೊಣಕಾಲು ಮಡಚಿ ನೆಲದ ಮೇಲೆ ಕುಳಿತುಕೊಳ್ಳಿ.', hi: 'घुटने मोड़कर बैठें।' },
          { en: 'Lean back slightly and lift feet off the ground, shin parallel to floor or legs straight.', kn: 'ಹಿಂದಕ್ಕೆ ಸ್ವಲ್ಪ ಬಾಗಿ ಕಾಲುಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ (V ಆಕಾರ).', hi: 'हल्का पीछे झुकें और पैरों को ऊपर उठाकर V आकार बनाएं।' },
          { en: 'Extend arms forward parallel to the ground, keeping chest lifted.', kn: 'ಕೈಗಳನ್ನು ಮುಂದಕ್ಕೆ ಚಾಚಿ ಎದೆಯನ್ನು ನೆಟ್ಟಗಿಡಿ.', hi: 'हाथों को आगे सीधा रखें और रीढ़ सीधी रखें।' }
        ],
        breathingCues: {
          en: 'Strong, rhythmic belly breathing without collapsing the chest.',
          kn: 'ಎದೆಯನ್ನು ಕುಗ್ಗಿಸದೆ ಸ್ಥಿರವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'छाती खुली रखकर लयबद्ध श्वास लें।'
        },
        holdDuration: '30 to 45 seconds',
        contraindications: {
          en: 'Avoid during acute lower back spasm or pregnancy.',
          kn: 'ಗರ್ಭಾವಸ್ಥೆ ಅಥವಾ ತೀವ್ರ ಬೆನ್ನುನೋವಿನಲ್ಲಿ ಮಾಡಬೇಡಿ.',
          hi: 'कमर के तीव्र दर्द या गर्भावस्था में वर्जित।'
        },
        iconType: 'boat'
      }
    ]
  },
  Mercury: {
    grahaName: 'Mercury',
    grahaTitle: {
      en: 'Budha (Mercury) • Nervous System, Thyroid & Coordination',
      kn: 'ಬುಧ • ನರಮಂಡಲ, ಥೈರಾಯ್ಡ್ ಮತ್ತು ಸಂವಹನ ಕೌಶಲ್ಯ',
      hi: 'बुध • तंत्रिका तंत्र, थायरॉयड एवं वाक शक्ति'
    },
    element: { en: 'Prithvi & Vayu (Earth-Air)', kn: 'ಪೃಥ್ವಿ ಮತ್ತು ವಾಯು', hi: 'पृथ्वी एवं वायु' },
    chakra: { en: 'Vishuddha (Throat) & Ajna', kn: 'ವಿಶುದ್ಧ ಮತ್ತು ಆಜ್ಞಾ ಚಕ್ರ', hi: 'विशुद्ध एवं आज्ञा चक्र' },
    governedBodyParts: {
      en: 'Nervous System, Thyroid Gland, Shoulders, Hands, Respiratory Tubes, Speech Organs',
      kn: 'ನರಮಂಡಲ, ಥೈರಾಯ್ಡ್, ಗಂಟಲು, ಭುಜಗಳು, ಕೈಗಳು, ಮಾತು',
      hi: 'तंत्रिका तंत्र, थायरॉयड ग्रंथि, कंठ, कंधे, हाथ एवं वाणी'
    },
    imbalanceSymptoms: [
      { en: 'Cervical stiffness, shoulder tension, and hand tremors', kn: 'ಕುತ್ತಿಗೆ ನೋವು, ಭುಜದ ಬಿಗಿತ ಮತ್ತು ಕೈ ನಡುಕ', hi: 'गर्दन में अकड़न, कन्धों का तनाव एवं हाथों में कंपन' },
      { en: 'Restless mind, rapid shallow breathing, and speech stutter', kn: 'ಚಂಚಲ ಬುದ್ಧಿ, ಆಳವಿಲ್ಲದ ಉಸಿರಾಟ ಮತ್ತು ಮಾತಿನಲ್ಲಿ ಗೊಂದಲ', hi: 'अस्थिर चित्त, उथली श्वास एवं वाणी दोष' }
    ],
    pranayama: {
      name: { en: 'Ujjayi & Bhramari Pranayama', kn: 'ಉಜ್ಜಾಯೀ ಮತ್ತು ಭ್ರಾಮರೀ ಪ್ರಾಣಾಯಾಮ', hi: 'उज्जायी एवं भ्रामरी प्राणायाम' },
      instructions: {
        en: 'Gentle oceanic throat constriction during inhale and exhale, followed by humming bee sound on exhalation.',
        kn: 'ಗಂಟಲಿನಿಂದ ಮೃದುವಾಗಿ ಉಸಿರಾಡಿ (ಉಜ್ಜಾಯೀ) ನಂತರ ಜೇನ್ನೊಣದಂತೆ ನಾದ ಮಾಡುತ್ತಾ ಉಸಿರು ಬಿಡಿ.',
        hi: 'कंठ से समुद्र की ध्वनि के समान श्वास लें और भंवरे की तरह गुंजन करते हुए श्वास छोड़ें।'
      },
      duration: { en: '5 to 8 minutes daily', kn: '೫ ರಿಂದ ೮ ನಿಮಿಷ', hi: '५ से ८ मिनट' }
    },
    mudra: {
      name: { en: 'Gyana / Chin Mudra', kn: 'ಜ್ಞಾನ ಮುದ್ರೆ', hi: 'ज्ञान मुद्रा' },
      instructions: {
        en: 'Touch tip of index finger to thumb tip with hands resting on knees.',
        kn: 'ತೋರುಬೆರಳಿನ ತುದಿಯನ್ನು ಹೆಬ್ಬೆರಳಿನ ತುದಿಗೆ ಜೋಡಿಸಿ ಧ್ಯಾನಸ್ಥರಾಗಿರಿ.',
        hi: 'तर्जनी के अग्रभाग को अंगूठे से मिलाकर घुटनों पर रखें।'
      },
      benefits: {
        en: 'Sharpens intellectual focus, calms ADHD/restlessness, synchronizes cerebral hemispheres.',
        kn: 'ಬುದ್ಧಿಶಕ್ತಿ, ಏಕಾಗ್ರತೆ ಹಾಗೂ ಜ್ಞಾಪಕಶಕ್ತಿಯನ್ನು ಅಪಾರವಾಗಿ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
        hi: 'बुद्धि, एकाग्रता और स्मरण शक्ति को तीव्र करता है।'
      }
    },
    bijaMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    recommendedColor: 'from-emerald-500 to-teal-600',
    suggestedAsanas: [
      {
        id: 'sarvangasana',
        sanskritName: 'Salamba Sarvangasana',
        name: { en: 'Shoulder Stand (Mother of Asanas)', kn: 'ಸರ್ವಾಂಗಾಸನ (ಸಮಸ್ತ ಅಂಗಗಳ ರಕ್ಷಕ)', hi: 'सर्वाङ्गासन (आसनों की जननी)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Vishuddha (Throat Center)', kn: 'ವಿಶುದ್ಧಿ ಚಕ್ರ', hi: 'विशुद्ध चक्र' },
        element: { en: 'Air / Ether', kn: 'ವಾಯು / ಆಕಾಶ', hi: 'वायु / आकाश' },
        physicalBenefits: {
          en: 'Brings thyroid and parathyroid glands into metabolic balance, relieves throat strain.',
          kn: 'ಥೈರಾಯ್ಡ್ ಗ್ರಂಥಿಯನ್ನು ಸಮತೋಲನದಲ್ಲಿಡುತ್ತದೆ, ಮಿದುಳಿಗೆ ಶುದ್ಧ ರಕ್ತ ಪೂರೈಸುತ್ತದೆ.',
          hi: 'थायरॉयड ग्रंथि को संतुलित करता है, मस्तिष्क में शुद्ध रक्त पहुंचाता है।'
        },
        astrologicalBalancing: {
          en: 'Calms Mercury afflictions, enhances neurological dexterity, sharpens memory and speech.',
          kn: 'ಬುಧನ ದೋಷ ನಿವಾರಿಸಿ ಮಾತು, ಜ್ಞಾಪಕಶಕ್ತಿ ಮತ್ತು ವಾಕ್ ಚಾತುರ್ಯ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'बुध ग्रह को बलवान बनाकर वाकपटुता, स्मरणशक्ति और स्नायु तंत्र को सुदृढ़ करता है।'
        },
        steps: [
          { en: 'Lie on your back, lift legs to 90 degrees.', kn: 'ನೆಲದ ಮೇಲೆ ಮಲಗಿ ಕಾಲುಗಳನ್ನು ೯೦ ಡಿಗ್ರಿ ಮೇಲಕ್ಕೆತ್ತಿ.', hi: 'पीठ के बल लेटें, पैरों को ९० डिग्री उठाएं।' },
          { en: 'Support lower back with hands and lift hips vertically towards ceiling.', kn: 'ಕೈಗಳಿಂದ ಸೊಂಟಕ್ಕೆ ಆಧಾರ ನೀಡಿ ಇಡೀ ದೇಹವನ್ನು ಲಂಬವಾಗಿ ಮೇಲಕ್ಕೆತ್ತಿ.', hi: 'हाथों से कमर को सहारा देकर शरीर को सीधा ऊपर उठाएं।' },
          { en: 'Tuck chin into sternum to create Jalandhara Bandha naturally.', kn: 'ಗಲ್ಲವನ್ನು ಎದೆಗೆ ತಾಗಿಸಿ ಕುತ್ತಿಗೆಗೆ ಆಧಾರ ನೀಡಿ.', hi: 'ठोड़ी को छाती से लगाकर रखें।' }
        ],
        breathingCues: {
          en: 'Gentle, even chest breathing; do not turn neck while in posture.',
          kn: 'ಶಾಂತವಾಗಿ ಉಸಿರಾಡಿ, ಕುತ್ತಿಗೆಯನ್ನು ತಿರುಗಿಸಬೇಡಿ.',
          hi: 'शांत श्वास लें, गर्दन को बिल्कुल न हिलाएं।'
        },
        holdDuration: '1 to 3 minutes',
        contraindications: {
          en: 'Avoid in cervical spondylosis, high blood pressure, or retinal issues.',
          kn: 'ಕುತ್ತಿಗೆ ನೋವು ಅಥವಾ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಇದ್ದರೆ ಮಾಡಬೇಡಿ.',
          hi: 'गर्दन में स्लिप डिस्क या उच्च रक्तचाप में न करें।'
        },
        iconType: 'shoulder_stand'
      },
      {
        id: 'garudasana',
        sanskritName: 'Garudasana',
        name: { en: 'Eagle Pose (Neurological Balance)', kn: 'ಗರುಡಾಸನ (ನರಗಳ ಸಮತೋಲನ ಮತ್ತು ಏಕಾಗ್ರತೆ)', hi: 'गरुड़ासन (नाड़ी समन्वय एवं एकाग्रता)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Ajna & Muladhara', kn: 'ಆಜ್ಞಾ ಮತ್ತು ಮೂಲಾಧಾರ', hi: 'आज्ञा एवं मूलाधार' },
        element: { en: 'Earth & Air', kn: 'ಪೃಥ್ವಿ ಮತ್ತು ವಾಯು', hi: 'पृथ्वी एवं वायु' },
        physicalBenefits: {
          en: 'Opens posterior shoulder girdle, stretches deltoids, strengthens ankles and calves.',
          kn: 'ಭುಜದ ಕೀಲುಗಳನ್ನು ಸಡಿಲಗೊಳಿಸುತ್ತದೆ, ನರಗಳ ಸಮನ್ವಯತೆ ಮತ್ತು ದೇಹದ ಸಮತೋಲನ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'कन्धों की जकड़न खोलता है, टखनों को मजबूत करता है और तंत्रिका तंत्र को संतुलित करता है।'
        },
        astrologicalBalancing: {
          en: 'Integrates left and right brain hemispheres; calms Mercurial scattered thinking.',
          kn: 'ಮಿದುಳಿನ ಎರಡೂ ಭಾಗಗಳನ್ನು ಸಮನ್ವಯಗೊಳಿಸಿ ಏಕಾಗ್ರತೆ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'मस्तिष्क के दोनों गोलार्द्धों को संतुलित कर चंचलता को दूर करता है।'
        },
        steps: [
          { en: 'Bend knees slightly, lift left leg and cross thigh over right thigh, hooking left foot behind right calf.', kn: 'ಬಲಗಾಲಿನ ಮೇಲೆ ನಿಂತು ಎಡಗಾಲನ್ನು ಸುತ್ತಿ ಹೆಣೆದುಕೊಳ್ಳಿ.', hi: 'दाएं पैर पर संतुलन बनाकर बाएं पैर को दाएं पैर पर लपेटें।' },
          { en: 'Cross right elbow over left elbow, wrap forearms and press palms together.', kn: 'ಎರಡೂ ಕೈಗಳನ್ನು ಹೆಣೆದು ಹಸ್ತಗಳನ್ನು ಮುಖದ ಮುಂದೆ ಜೋಡಿಸಿ.', hi: 'हाथों को आपस में लपेटकर नमस्कार मुद्रा बनाएं।' },
          { en: 'Fix gaze on a single point and sink hips downward.', kn: 'ಒಂದೇ ಬಿಂದುವಿನ ಮೇಲೆ ದೃಷ್ಟಿಯಿಟ್ಟು ಸೊಂಟವನ್ನು ಸ್ವಲ್ಪ ತಗ್ಗಿಸಿ.', hi: 'एक बिंदु पर दृष्टि टिकाकर घुटने थोड़े मोड़ें।' }
        ],
        breathingCues: {
          en: 'Deep expansive breaths into the space between the shoulder blades.',
          kn: 'ಭುಜಗಳ ನಡುವೆ ಉಸಿರು ತುಂಬುವಂತೆ ಆಳವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'कन्धों के बीच गहरा श्वास भरें।'
        },
        holdDuration: '5 deep breaths per side',
        contraindications: {
          en: 'Uncross arms or legs if suffering from acute knee or ankle sprain.',
          kn: 'ಮೊಣಕಾಲು ಅಥವಾ ಹಿಮ್ಮಡಿಯ ತೀವ್ರ ನೋವಿದ್ದರೆ ಸಾಮಾನ್ಯ ಸ್ಥಿತಿಯಲ್ಲಿ ಮಾಡಿ.',
          hi: 'घुटने या टखने की चोट में सावधानी बरतें।'
        },
        iconType: 'eagle'
      }
    ]
  },
  Jupiter: {
    grahaName: 'Jupiter',
    grahaTitle: {
      en: 'Guru / Brihaspati (Jupiter) • Liver, Hip Girdle & Etheric Expansion',
      kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ) • ಯಕೃತ್, ಸೊಂಟದ ಕೀಲುಗಳು ಮತ್ತು ಜ್ಞಾನವಿಕಾಸ',
      hi: 'गुरु • यकृत, श्रोणि चक्र एवं आध्यात्मिक चेतना'
    },
    element: { en: 'Akasha (Ether / Space)', kn: 'ಆಕಾಶ ತತ್ವ', hi: 'आकाश तत्त्व' },
    chakra: { en: 'Ajna & Sahasrara (Crown)', kn: 'ಆಜ್ಞಾ ಮತ್ತು ಸಹಸ್ರಾರ ಚಕ್ರ', hi: 'आज्ञा एवं सहस्रार चक्र' },
    governedBodyParts: {
      en: 'Liver, Gallbladder, Hip Joints, Arterial Circulation, Fat Metabolism, Ears',
      kn: 'ಯಕೃತ್ (ಲಿವರ್), ಸೊಂಟದ ಕೀಲುಗಳು, ಕೊಬ್ಬಿನ ಚಯಾಪಚಯ, ರಕ್ತನಾಳಗಳು',
      hi: 'यकृत (लिवर), कूल्हे, मेद (फैट), धमनी संचार, श्रवण इन्द्रिय'
    },
    imbalanceSymptoms: [
      { en: 'Hip stiffness, weight gain around midriff, and sluggish liver', kn: 'ಸೊಂಟದ ಬಿಗಿತ, ಹೊಟ್ಟೆಯ ಸುತ್ತ ಕೊಬ್ಬು ಶೇಖರಣೆ, ಮಂದ ಜೀರ್ಣಕ್ರಿಯೆ', hi: 'कूल्हों में अकड़न, मोटापा एवं यकृत की शिथिलता' },
      { en: 'Loss of spiritual optimism and chronic stagnation', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಆಸಕ್ತಿ ಕೊರತೆ ಮತ್ತು ನಿರಾಶಾವಾದ', hi: 'आध्यात्मिक अरुचि एवं मानसिक अवसाद' }
    ],
    pranayama: {
      name: { en: 'Anulom Vilom (Nadi Shodhana)', kn: 'ಅನುಲೋಮ ವಿಲೋಮ ಪ್ರಾಣಾಯಾಮ', hi: 'अनुलोम विलोम प्राणायाम' },
      instructions: {
        en: 'Inhale through left nostril for 4 counts, hold for 4 counts, exhale through right for 8 counts. Repeat in reverse.',
        kn: 'ಎಡದಿಂದ ೪ ಸೆಕೆಂಡು ಉಸಿರೆಳೆದು, ೪ ಸೆಕೆಂಡು ನಿಲ್ಲಿಸಿ, ಬಲದಿಂದ ೮ ಸೆಕೆಂಡು ಬಿಡಿ. ನಂತರ ಬಲದಿಂದ ಎಳೆದು ಎಡದಿಂದ ಬಿಡಿ.',
        hi: 'बाएं से ४ सेकंड श्वास लें, ४ सेकंड कुम्भक करें, दाएं से ८ सेकंड छोड़ें।'
      },
      duration: { en: '10 to 15 minutes before meditation', kn: 'ಧ್ಯಾನಕ್ಕೆ ಮುನ್ನ ೧೦-೧೫ ನಿಮಿಷ', hi: '१० से १५ मिनट' }
    },
    mudra: {
      name: { en: 'Dhyana Mudra / Chinmaya Mudra', kn: 'ಧ್ಯಾನ ಮುದ್ರೆ', hi: 'ध्यान मुद्रा' },
      instructions: {
        en: 'Place right hand over left hand in lap, palms facing up, thumbs gently touching.',
        kn: 'ಎಡಗೈ ಮೇಲೆ ಬಲಗೈ ಇರಿಸಿ, ಹೆಬ್ಬೆರಳುಗಳು ಪರಸ್ಪರ ತಾಗುವಂತೆ ಮಡಿಲಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ.',
        hi: 'बाएं हाथ पर दायां हाथ गोद में रखें, दोनों अंगूठे आपस में स्पर्श करें।'
      },
      benefits: {
        en: 'Expands etheric consciousness, awakens sattva, dispels spiritual ego and cynicism.',
        kn: 'ಸಾತ್ವಿಕ ಶಕ್ತಿಯನ್ನು ಜಾಗೃತಗೊಳಿಸಿ ಮನಸ್ಸಿಗೆ ಪರಮ ಪ್ರಶಾಂತತೆ ನೀಡುತ್ತದೆ.',
        hi: 'सात्त्विक ऊर्जा बढ़ाता है, ज्ञान और सकारात्मकता का संचार करता है।'
      }
    },
    bijaMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    recommendedColor: 'from-amber-400 to-yellow-600',
    suggestedAsanas: [
      {
        id: 'padmasana',
        sanskritName: 'Padmasana / Siddhasana',
        name: { en: 'Lotus / Accomplished Meditative Pose', kn: 'ಪದ್ಮಾಸನ / ಸಿದ್ಧಾಸನ (ಧ್ಯಾನ ಭಂಗಿ)', hi: 'पद्मासन / सिद्धासन (परम ध्यान मुद्रा)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Sahasrara & Ajna', kn: 'ಸಹಸ್ರಾರ ಮತ್ತು ಆಜ್ಞಾ', hi: 'सहस्रार एवं आज्ञा' },
        element: { en: 'Ether (Akasha)', kn: 'ಆಕಾಶ', hi: 'आकाश' },
        physicalBenefits: {
          en: 'Stimulates sacral nerves, opens hip rotators, keeps spine naturally erect.',
          kn: 'ಸೊಂಟದ ಕೀಲುಗಳಿಗೆ ನಮ್ಯತೆ ನೀಡುತ್ತದೆ, ಬೆನ್ನುಹುರಿಯನ್ನು ಸ್ವಾಭಾವಿಕವಾಗಿ ನೆಟ್ಟಗಿಡುತ್ತದೆ.',
          hi: 'श्रोणि भाग को लचीला बनाता है, रीढ़ को स्वाभाविक रूप से सीधा रखता है।'
        },
        astrologicalBalancing: {
          en: 'Awakens Jupiterian wisdom and Grace; dissolves spiritual arrogance and financial anxieties.',
          kn: 'ಗುರುವಿನ ಅನುಗ್ರಹವನ್ನು ಆಕರ್ಷಿಸುತ್ತದೆ, ಜ್ಞಾನ ಮತ್ತು ಶಾಂತಿಯನ್ನು ನೀಡುತ್ತದೆ.',
          hi: 'बृहस्पति देव की कृपा से आत्मज्ञान, सात्विकता और समृद्धि की प्राप्ति होती है।'
        },
        steps: [
          { en: 'Sit with legs extended, bend right knee bringing foot onto left hip crease.', kn: 'ಕುಳಿತು ಬಲ ಪಾದವನ್ನು ಎಡ ತೊಡೆಯ ಮೇಲೆ ಇರಿಸಿ.', hi: 'दाएं पैर को मोड़कर बाईं जांघ पर रखें।' },
          { en: 'Bend left knee bringing foot onto right hip crease, soles facing skyward.', kn: 'ಎಡ ಪಾದವನ್ನು ಬಲ ತೊಡೆಯ ಮೇಲೆ ಇರಿಸಿ.', hi: 'बाएं पैर को मोड़कर दाईं जांघ पर रखें।' },
          { en: 'Rest hands in Chin Mudra on knees with spine straight.', kn: 'ಕೈಗಳನ್ನು ಜ್ಞಾನ ಮುದ್ರೆಯಲ್ಲಿ ಮಂಡಿಗಳ ಮೇಲೆ ಇರಿಸಿ ಬೆನ್ನು ನೇರವಾಗಿಡಿ.', hi: 'हाथ ज्ञान मुद्रा में घुटनों पर रखें, रीढ़ सीधी।' }
        ],
        breathingCues: {
          en: 'Effortless, luminous cosmic breathing expanding into the ether.',
          kn: 'ಸಹಜ, ಶಾಂತ ಮತ್ತು ಆಳವಾದ ಉಸಿರಾಟ.',
          hi: 'सहज एवं शांत दीर्घ श्वास।'
        },
        holdDuration: '5 to 15 minutes of quietude',
        contraindications: {
          en: 'Substitute with Sukhasana if experiencing acute knee stiffness.',
          kn: 'ಮೊಣಕಾಲು ನೋವಿದ್ದರೆ ಸುಖಾಸನದಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
          hi: 'घुटने में दर्द होने पर सुखासन में बैठें।'
        },
        iconType: 'lotus'
      },
      {
        id: 'baddha_konasana',
        sanskritName: 'Baddha Konasana',
        name: { en: 'Bound Angle / Butterfly Pose', kn: 'ಬದ್ಧ ಕೋಣಾಸನ (ಚಿಟ್ಟೆ ಭಂಗಿ)', hi: 'बद्ध कोणासन (तितली आसन)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Swadhisthana & Manipura', kn: 'ಸ್ವಾದಿಷ್ಠಾನ ಮತ್ತು ಮಣಿಪೂರ', hi: 'स्वाधिष्ठान एवं मणिपुर' },
        element: { en: 'Ether & Water', kn: 'ಆಕಾಶ ಮತ್ತು ಜಲ', hi: 'आकाश एवं जल' },
        physicalBenefits: {
          en: 'Stimulates abdominal organs, prostate, ovaries, and kidneys; improves hip mobility.',
          kn: 'ಕಿಡ್ನಿ, ಯಕೃತ್ ಮತ್ತು ಮೂತ್ರಾಶಯದ ಆರೋಗ್ಯ ಸುಧಾರಿಸುತ್ತದೆ; ಸೊಂಟದ ಕೀಲು ಸಡಿಲಗೊಳಿಸುತ್ತದೆ.',
          hi: 'यकृत, गुर्दे एवं मूत्राशय को सक्रिय करता है, कूल्हों का लचीलापन बढ़ाता है।'
        },
        astrologicalBalancing: {
          en: 'Cures sluggish Jupiter energy; harmonizes liver metabolism and arterial flow.',
          kn: 'ಗುರುವಿನ ನಕಾರಾತ್ಮಕ ಪ್ರಭಾವ ಕಡಿಮೆ ಮಾಡಿ ದೇಹಕ್ಕೆ ತೇಜಸ್ಸು ನೀಡುತ್ತದೆ.',
          hi: 'बृहस्पति जनित यकृत और मेद विकारों को दूर करता है।'
        },
        steps: [
          { en: 'Sit with spine erect, bend knees and bring soles of feet together.', kn: 'ಕುಳಿತು ಎರಡೂ ಪಾದಗಳನ್ನು ಜೋಡಿಸಿ ದೇಹದ ಹತ್ತಿರ ತನ್ನಿ.', hi: 'बैठकर दोनों तलवों को आपस में मिलाएं और शरीर के समीप लाएं।' },
          { en: 'Clasp feet with hands, gently flutter knees like butterfly wings.', kn: 'ಕೈಗಳಿಂದ ಪಾದಗಳನ್ನು ಹಿಡಿದು ಮೊಣಕಾಲುಗಳನ್ನು ಮೃದುವಾಗಿ ಅಲ್ಲಾಡಿಸಿ.', hi: 'पैरों को हाथों से पकड़कर घुटनों को ऊपर-नीचे हिलाएं।' },
          { en: 'Lengthen spine on inhale, gently fold forward on exhale.', kn: 'ಉಸಿರೆಳೆದು ಬೆನ್ನು ನೇರಮಾಡಿ, ಉಸಿರು ಬಿಡುತ್ತಾ ಸ್ವಲ್ಪ ಮುಂದೆ ಬಾಗಿ.', hi: 'रीढ़ सीधी कर हल्का आगे झुकें।' }
        ],
        breathingCues: {
          en: 'Breathe softly into the pelvic bowl, releasing groin tension.',
          kn: 'ಸೊಂಟದ ಭಾಗದಲ್ಲಿ ಉಸಿರನ್ನು ಕೇಂದ್ರೀಕರಿಸಿ.',
          hi: 'श्रोणि भाग में गहरा श्वास भरें।'
        },
        holdDuration: '1 to 3 minutes',
        contraindications: {
          en: 'Do not force knees downward if groin is tight; support thighs with blocks.',
          kn: 'ಮೊಣಕಾಲುಗಳನ್ನು ಬಲವಂತವಾಗಿ ನೆಲಕ್ಕೆ ಒತ್ತಬೇಡಿ.',
          hi: 'घुटनों पर जोर न डालें, आवश्यकता हो तो तकिया लगाएं।'
        },
        iconType: 'butterfly'
      }
    ]
  },
  Venus: {
    grahaName: 'Venus',
    grahaTitle: {
      en: 'Shukra (Venus) • Pelvic Vitality, Kidneys & Ojas',
      kn: 'ಶುಕ್ರ • ಸೌಂದರ್ಯ, ರಸಧಾತು, ಶುಕ್ರಧಾತು ಮತ್ತು ನಮ್ಯತೆ',
      hi: 'शुक्र • सौन्दर्य, ओजस, प्रजनन स्वास्थ्य एवं लालित्य'
    },
    element: { en: 'Jala & Ojas (Water-Essence)', kn: 'ಜಲ ಮತ್ತು ಓಜಸ್ಸು', hi: 'जल एवं ओजस' },
    chakra: { en: 'Swadhisthana (Sacral) & Anahata', kn: 'ಸ್ವಾದಿಷ್ಠಾನ ಮತ್ತು ಅನಾಹತ', hi: 'स्वाधिष्ठान एवं अनाहत' },
    governedBodyParts: {
      en: 'Reproductive System, Kidneys, Pelvic Floor, Skin Radiance, Ojas / Vital Essence',
      kn: 'ಪ್ರಜನನ ಅಂಗಗಳು, ಮೂತ್ರಪಿಂಡಗಳು, ಚರ್ಮದ ಕಾಂತಿ, ಓಜಸ್ಸು',
      hi: 'प्रजनन तंत्र, वृक्क (किडनी), त्वचा की कांति, ओज एवं शुक्र धातु'
    },
    imbalanceSymptoms: [
      { en: 'Pelvic stiffness, lower back compression, and loss of flexibility', kn: 'ಸೊಂಟದ ಬಿಗಿತ, ಬೆನ್ನುನೋವು ಮತ್ತು ದೇಹದ ನಮ್ಯತೆ ಕೊರತೆ', hi: 'श्रोणि भाग में जकड़न, कमर दर्द एवं लचीलेपन की कमी' },
      { en: 'Renal / urinary sluggishness and dry lackluster skin', kn: 'ಮೂತ್ರಪಿಂಡದ ತೊಂದರೆ ಮತ್ತು ಚರ್ಮದ ಕಾಂತಿಹೀನತೆ', hi: 'मूत्र विकार एवं त्वचा का रुखापन' }
    ],
    pranayama: {
      name: { en: 'Dirga Pranayama & Bhramari', kn: 'ದೀರ್ಘ ಪ್ರಾಣಾಯಾಮ ಮತ್ತು ಭ್ರಾಮರೀ', hi: 'दीर्घ प्राणायाम एवं भ्रामरी' },
      instructions: {
        en: 'Three-part smooth breath filling belly, ribcage, and chest gracefully, followed by soothing humming resonance.',
        kn: 'ಹೊಟ್ಟೆ, ಪಕ್ಕೆಲುಬು, ಎದೆಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಉಸಿರಿನಿಂದ ತುಂಬಿಸಿ ನಂತರ ನಾದ ಮಾಡುತ್ತಾ ಬಿಡಿ.',
        hi: 'पेट, पसलियों और छाती में पूर्ण श्वास भरें, ॐकार के समान गुंजन करें।'
      },
      duration: { en: '7 minutes in gentle twilight or morning', kn: '೭ ನಿಮಿಷ', hi: '७ मिनट' }
    },
    mudra: {
      name: { en: 'Yoni Mudra / Padma Mudra', kn: 'ಯೋನಿ ಮುದ್ರೆ / ಪದ್ಮ ಮುದ್ರೆ', hi: 'योनि मुद्रा / पद्म मुद्रा' },
      instructions: {
        en: 'Bring base of palms together, thumbs touching, index fingers touching pointing downward forming a diamond.',
        kn: 'ಹಸ್ತಗಳನ್ನು ಜೋಡಿಸಿ ಹೆಬ್ಬೆರಳು ಮತ್ತು ತೋರುಬೆರಳುಗಳನ್ನು ಮುಟ್ಟಿಸಿ ವಜ್ರದ ಆಕಾರ ಮಾಡಿ.',
        hi: 'दोनों हाथों के अंगूठे और तर्जनी को मिलाकर त्रिकोण/हीरा आकार बनाएं।'
      },
      benefits: {
        en: 'Channels creative kundalini, heals pelvic trauma, restores youthfulness and ojas.',
        kn: 'ಸೌಂದರ್ಯ, ಯೌವನ, ಓಜಸ್ಸು ಮತ್ತು ಸೃಜನಶೀಲತೆಯನ್ನು ವೃದ್ಧಿಸುತ್ತದೆ.',
        hi: 'सृजनात्मक ऊर्जा का विकास, ओजस में वृद्धि एवं मुख पर तेज लाता है।'
      }
    },
    bijaMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    recommendedColor: 'from-pink-500 to-rose-600',
    suggestedAsanas: [
      {
        id: 'ustrasana',
        sanskritName: 'Ustrasana',
        name: { en: 'Camel Pose (Heart & Pelvis Opening)', kn: 'ಉಷ್ಟ್ರಾಸನ (ಒಂಟೆ ಭಂಗಿ)', hi: 'उष्ट्रासन (हृदय व श्रोणि प्रसारक)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Anahata & Swadhisthana', kn: 'ಅನಾಹತ ಮತ್ತು ಸ್ವಾದಿಷ್ಠಾನ', hi: 'अनाहत एवं स्वाधिष्ठान' },
        element: { en: 'Water & Fire', kn: 'ಜಲ ಮತ್ತು ಅಗ್ನಿ', hi: 'जल एवं अग्नि' },
        physicalBenefits: {
          en: 'Expands thoracic cavity, stretches hip flexors, tones kidneys and adrenal glands.',
          kn: 'ಎದೆಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತೆರೆಯುತ್ತದೆ, ಮೂತ್ರಪಿಂಡಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ, ಮುಖಕ್ಕೆ ಕಾಂತಿ ನೀಡುತ್ತದೆ.',
          hi: 'छाती और फेफड़ों को खोलता है, गुर्दों को पुष्ट करता है और सौंदर्य बढ़ाता है।'
        },
        astrologicalBalancing: {
          en: 'Balances Shukra afflictions; awakens magnetic grace, affection, and radiant ojas.',
          kn: 'ಶುಕ್ರನ ದೋಷಗಳನ್ನು ಶಮನಗೊಳಿಸಿ ಆಕರ್ಷಕ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ಸೌಂದರ್ಯ ನೀಡುತ್ತದೆ.',
          hi: 'शुक्र ग्रह के दोषों का शमन कर आकर्षण, प्रेम और शारीरिक कांति प्रदान करता है।'
        },
        steps: [
          { en: 'Kneel upright with knees hip-width apart and hips stacked directly over knees.', kn: 'ಮಂಡಿಯೂರಿ ನೆಟ್ಟಗೆ ನಿಲ್ಲಿ.', hi: 'घुटनों के बल सीधे खड़े हों।' },
          { en: 'Place hands on lower back, inhale and lengthen spine upward.', kn: 'ಕೈಗಳನ್ನು ಸೊಂಟದ ಮೇಲಿಟ್ಟು ಉಸಿರೆಳೆದುಕೊಳ್ಳಿ.', hi: 'हाथों को कमर पर रखें, रीढ़ को ऊपर खींचें।' },
          { en: 'Gently arch backward, reaching hands towards heels one at a time while keeping hips pressing forward.', kn: 'ಹಿಂದಕ್ಕೆ ಬಾಗಿ ಹಿಮ್ಮಡಿಗಳನ್ನು ಮುಟ್ಟಿ, ಸೊಂಟವನ್ನು ಮುಂದಕ್ಕೆ ತಳ್ಳಿ.', hi: 'पीछे झुककर हाथों से एड़ियां छुएं, कूल्हों को आगे धकेलें।' }
        ],
        breathingCues: {
          en: 'Smooth, unbroken chest breathing with throat relaxed.',
          kn: 'ಕುತ್ತಿಗೆಯನ್ನು ಸಡಿಲವಾಗಿಟ್ಟು ಎದೆಯಲ್ಲಿ ಆಳವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'कंठ को सहज रखकर छाती में गहरा श्वास लें।'
        },
        holdDuration: '3 to 5 deep breaths',
        contraindications: {
          en: 'Avoid throwing neck back aggressively if prone to migraines or cervical issues.',
          kn: 'ಕುತ್ತಿಗೆ ನೋವಿದ್ದರೆ ತಲೆಯನ್ನು ಅತಿಯಾಗಿ ಹಿಂದಕ್ಕೆ ಹಾಕಬೇಡಿ.',
          hi: 'गर्दन में दर्द हो तो सिर को ज्यादा पीछे न झुकाएं।'
        },
        iconType: 'camel'
      },
      {
        id: 'supta_baddha_konasana',
        sanskritName: 'Supta Baddha Konasana',
        name: { en: 'Reclining Goddess / Butterfly Pose', kn: 'ಸುಪ್ತ ಬದ್ಧ ಕೋಣಾಸನ (ವಿಶ್ರಾಂತಿ ದೇವೀ ಭಂಗಿ)', hi: 'सुप्त बद्ध कोणासन (विश्राम देवी मुद्रा)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Swadhisthana', kn: 'ಸ್ವಾದಿಷ್ಠಾನ', hi: 'स्वाधिष्ठान' },
        element: { en: 'Water', kn: 'ಜಲ', hi: 'जल' },
        physicalBenefits: {
          en: 'Relieves lower pelvic cramping, cools inflammation, promotes gentle venous pelvic drainage.',
          kn: 'ಸೊಂಟ ಮತ್ತು ಪ್ರಜನನ ಅಂಗಗಳ ಆಯಾಸ ನಿವಾರಿಸಿ ಸಂಪೂರ್ಣ ವಿಶ್ರಾಂತಿ ನೀಡುತ್ತದೆ.',
          hi: 'श्रोणि भाग के तनाव को मिटाता है, हार्मोन्स को संतुलित करता है।'
        },
        astrologicalBalancing: {
          en: 'Restores Venusian harmony; dissolves relationship stress and physical exhaustion.',
          kn: 'ಶುಕ್ರನ ಶಾಂತಿಯನ್ನು ತಂದು ದಾಂಪತ್ಯ ಜೀವನದಲ್ಲಿ ಸಾಮರಸ್ಯ ಉಂಟುಮಾಡುತ್ತದೆ.',
          hi: 'शुक्र के सात्विक प्रभाव से मानसिक तृप्ति एवं वैवाहिक सौहार्द मिलता है।'
        },
        steps: [
          { en: 'Lie on your back, bend knees and join soles of feet together, letting knees fall open to sides.', kn: 'ನೆಲದ ಮೇಲೆ ಮಲಗಿ ಪಾದಗಳನ್ನು ಜೋಡಿಸಿ ಮೊಣಕಾಲುಗಳನ್ನು ಎರಡೂ ಬದಿಗೆ ಬಿಡಿ.', hi: 'पीठ के बल लेटकर तलवों को आपस में मिलाएं और घुटने दोनों ओर फैलाएं।' },
          { en: 'Place one hand on heart and one hand on lower belly.', kn: 'ಒಂದು ಕೈಯನ್ನು ಎದೆಯ ಮೇಲೆ, ಮತ್ತೊಂದನ್ನು ಹೊಟ್ಟೆಯ ಮೇಲಿಡಿ.', hi: 'एक हाथ छाती पर और दूसरा नाभि पर रखें।' },
          { en: 'Relax facial muscles, jaw, and pelvic floor completely.', kn: 'ಮುಖದ ಸ್ನಾಯುಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಶಾಂತವಾಗಿರಿ.', hi: 'सम्पूर्ण शरीर को शिथिल छोड़ दें।' }
        ],
        breathingCues: {
          en: 'Silky, calming oceanic exhalations.',
          kn: 'ಮೃದುವಾದ ನಾದದಂತೆ ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'अत्यंत शांत और धीमी गति से श्वास लें।'
        },
        holdDuration: '3 to 7 minutes',
        contraindications: {
          en: 'Place rolled blankets under thighs if hips feel unsupported.',
          kn: 'ತೊಡೆಗಳ ಕೆಳಗೆ ದಿಂಬು ಇಟ್ಟುಕೊಳ್ಳಬಹುದು.',
          hi: 'जांघों के नीचे तकिया रखकर सहारा लें।'
        },
        iconType: 'reclined'
      }
    ]
  },
  Saturn: {
    grahaName: 'Saturn',
    grahaTitle: {
      en: 'Shani (Saturn) • Joints, Knees, Spine & Longevity',
      kn: 'ಶನಿ • ಕೀಲುಗಳು, ಮೊಣಕಾಲುಗಳು, ನರಗಳು ಮತ್ತು ಆಯಸ್ಸು',
      hi: 'शनि • अस्थि जोड़, घुटने, मेरुदण्ड एवं दीर्घायु'
    },
    element: { en: 'Vayu (Air) & Prithvi', kn: 'ವಾಯು ಮತ್ತು ಪೃಥ್ವಿ', hi: 'वायु एवं पृथ्वी' },
    chakra: { en: 'Muladhara (Root Chakra)', kn: 'ಮೂಲಾಧಾರ ಚಕ್ರ', hi: 'मूलाधार चक्र' },
    governedBodyParts: {
      en: 'Skeletal Framework, Joints, Knees, Feet, Teeth, Bone Collagen, Longevity (Ayus)',
      kn: 'ಮೂಳೆಗಳು, ಕೀಲುಗಳು, ಮೊಣಕಾಲುಗಳು, ಪಾದಗಳು, ದಂತಗಳು, ಆಯಸ್ಸು',
      hi: 'अस्थि ढांचा, समस्त जोड़, घुटने, पैर, दांत एवं आयु'
    },
    imbalanceSymptoms: [
      { en: 'Chronic joint stiffness, cracking knees, and lumbar tightness', kn: 'ಕೀಲುಗಳಲ್ಲಿ ಸದ್ದು, ಮೊಣಕಾಲು ನೋವು ಮತ್ತು ಬೆನ್ನು ಬಿಗಿತ', hi: 'जोड़ों में अकड़न, घुटनों का दर्द एवं कमर का कड़ापन' },
      { en: 'Excess Vata dryness, sciatic tension, and slow plodding posture', kn: 'ದೇಹದಲ್ಲಿ ವಾತದ ಹೆಚ್ಚಳ, ನರಗಳ ದೌರ್ಬಲ್ಯ ಮತ್ತು ಆಯಾಸ', hi: 'अत्यधिक वात विकार, नसों में खिंचाव एवं भारीपन' }
    ],
    pranayama: {
      name: { en: 'Slow Nadi Shodhana with Brahmamudra', kn: 'ನಿಧಾನ ನಾಡೀ ಶೋಧನ ಹಾಗೂ ಬ್ರಹ್ಮ ಮುದ್ರೆ', hi: 'मन्द नाड़ी शोधन एवं ब्रह्म मुद्रा' },
      instructions: {
        en: 'Rhythmic, deep alternate nostril breathing accompanied by slow, mindful neck rotations (Brahmamudra) to lubricate cervical joints.',
        kn: 'ನಿಧಾನವಾಗಿ ಎಡ-ಬಲ ಹೊಳ್ಳೆಗಳಿಂದ ಉಸಿರಾಟ ಮಾಡುತ್ತಾ ಕುತ್ತಿಗೆಯನ್ನು ನಾಲ್ಕೂ ದಿಕ್ಕಿಗೆ ಮೃದುವಾಗಿ ತಿರುಗಿಸಿ.',
        hi: 'धीमी गति से नाड़ी शोधन करें और गर्दन को धीरे-धीरे चारों दिशाओं में घुमाएं।'
      },
      duration: { en: '10 minutes at dusk or early morning', kn: '೧೦ ನಿಮಿಷ', hi: '१० मिनट' }
    },
    mudra: {
      name: { en: 'Vayu Mudra (Wind Dispelling Gesture)', kn: 'ವಾಯು ಮುದ್ರೆ', hi: 'वायु मुद्रा' },
      instructions: {
        en: 'Bend index finger to base of thumb and press gently with thumb pad.',
        kn: 'ತೋರುಬೆರಳನ್ನು ಮಡಚಿ ಹೆಬ್ಬೆರಳಿನ ಬುಡಕ್ಕೆ ಮುಟ್ಟಿಸಿ ಹೆಬ್ಬೆರಳಿನಿಂದ ಒತ್ತಿ ಹಿಡಿಯಿರಿ.',
        hi: 'तर्जनी उंगली को मोड़कर अंगूठे की जड़ में लगाएं और अंगूठे से हल्का दबाएं।'
      },
      benefits: {
        en: 'Relieves joint rheumatism, gout, sciatica, gas bloating, and tremors.',
        kn: 'ಕೀಲುನೋವು, ವಾತ, ನಡುಕ ಮತ್ತು ಬೆನ್ನುನೋವನ್ನು ನಿವಾರಿಸುತ್ತದೆ.',
        hi: 'गठिया, जोड़ों के दर्द, साइटिका एवं वात विकारों में अत्यंत लाभकारी।'
      }
    },
    bijaMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    recommendedColor: 'from-blue-700 to-indigo-950',
    suggestedAsanas: [
      {
        id: 'paschimottanasana',
        sanskritName: 'Paschimottanasana',
        name: { en: 'Seated Forward Bend (Western Spinal Stretch)', kn: 'ಪಶ್ಚಿಮೋತ್ತಾನಾಸನ (ಸಮಗ್ರ ಬೆನ್ನುಮೂಳೆ ಹಿಗ್ಗಿಸುವಿಕೆ)', hi: 'पश्चिमोत्तानासन (मेरुदण्ड दीर्घायु प्रसारक)' },
        poseLevel: 'Intermediate',
        targetChakra: { en: 'Muladhara & Swadhisthana', kn: 'ಮೂಲಾಧಾರ ಮತ್ತು ಮಣಿಪೂರ', hi: 'मूलाधार एवं मणिपुर' },
        element: { en: 'Air & Earth', kn: 'ವಾಯು ಮತ್ತು ಪೃಥ್ವಿ', hi: 'वायु एवं पृथ्वी' },
        physicalBenefits: {
          en: 'Lengthens entire posterior chain from heels to crown, massages internal viscera, promotes patience.',
          kn: 'ಹಿಮ್ಮಡಿಯಿಂದ ತಲೆಯವರೆಗಿನ ಸಮಸ್ತ ನರಗಳನ್ನು ಹಿಗ್ಗಿಸುತ್ತದೆ, ನರಮಂಡಲವನ್ನು ಶಾಂತಗೊಳಿಸುತ್ತದೆ.',
          hi: 'एड़ियों से सिर तक की समस्त नाड़ियों को लचीला बनाता है, पाचन अंगों की मालिश करता है।'
        },
        astrologicalBalancing: {
          en: 'Pacifies Shani dosha, Sade Sati stress, and cultivates grounded perseverance and humility.',
          kn: 'ಶನಿಯ ಸಾಡೇಸಾತಿ, ಕಂಟಕ ಶನಿ ಹಾಗೂ ವಾತ ದೋಷಗಳನ್ನು ಶಮನಗೊಳಿಸಿ ಸಹನೆ ನೀಡುತ್ತದೆ.',
          hi: 'शनि की साढ़ेसाती व ढैय्या के कष्टों को शांत करता है, धैर्य और विनम्रता का विकास करता है।'
        },
        steps: [
          { en: 'Sit with legs extended straight in front, toes flexed towards your face.', kn: 'ಕಾಲುಗಳನ್ನು ಮುಂದೆ ಚಾಚಿ ನೆಟ್ಟಗೆ ಕುಳಿತುಕೊಳ್ಳಿ.', hi: 'पैरों को सीधा आगे फैलाकर बैठें, पंजे ऊपर की ओर।' },
          { en: 'Inhale, raise arms overhead lengthening the torso.', kn: 'ಉಸಿರೆಳೆದು ಕೈಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ ಬೆನ್ನನ್ನು ನೇರಮಾಡಿ.', hi: 'श्वास लेते हुए दोनों हाथ ऊपर उठाएं।' },
          { en: 'Exhale, fold from the hip joints and hold your shins, ankles, or feet.', kn: 'ಉಸಿರು ಬಿಡುತ್ತಾ ಸೊಂಟದಿಂದ ಮುಂದೆ ಬಾಗಿ ಪಾದಗಳನ್ನು ಹಿಡಿಯಿರಿ.', hi: 'श्वास छोड़ते हुए कूल्हों से आगे झुककर पैरों के पंजों को पकड़ें।' },
          { en: 'Surrender neck and forehead towards shins without forcing.', kn: 'ಹಣೆಯನ್ನು ಮೊಣಕಾಲಿಗೆ ತಾಗಿಸಲು ಯತ್ನಿಸಿ.', hi: 'माथा घुटनों के पास ले जाएं, बलपूर्वक न खींचें।' }
        ],
        breathingCues: {
          en: 'Deep, slow diaphragmatic breaths creating space in each vertebra.',
          kn: 'ಪ್ರತಿಯೊಂದು ಕಶೇರುಕದಲ್ಲಿ ಉಸಿರನ್ನು ತುಂಬುವಂತೆ ಆಳವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'रीढ़ के प्रत्येक मनके में श्वास का विस्तार अनुभव करें।'
        },
        holdDuration: '1 to 3 minutes',
        contraindications: {
          en: 'Bend knees slightly if experiencing acute sciatica or herniated lumbar disc.',
          kn: 'ತೀವ್ರ ಬೆನ್ನುನೋವು ಇದ್ದರೆ ಮೊಣಕಾಲುಗಳನ್ನು ಸ್ವಲ್ಪ ಮಡಚಿ ಮಾಡಿ.',
          hi: 'स्लिप डिस्क या साइटिका में घुटनों को हल्का मोड़कर रखें।'
        },
        iconType: 'forward_bend'
      },
      {
        id: 'adho_mukha_svanasana',
        sanskritName: 'Adho Mukha Svanasana',
        name: { en: 'Downward-Facing Dog Pose', kn: 'ಅಧೋಮುಖ ಶ್ವಾನಾಸನ', hi: 'अधोमुख श्वानासन' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Muladhara & Sahasrara', kn: 'ಮೂಲಾಧಾರ ಮತ್ತು ಸಹಸ್ರಾರ', hi: 'मूलाधार एवं सहस्रार' },
        element: { en: 'Air & Earth', kn: 'ವಾಯು ಮತ್ತು ಪೃಥ್ವಿ', hi: 'वायु एवं पृथ्वी' },
        physicalBenefits: {
          en: 'Decompresses lumbar spine, stretches Achilles tendons, strengthens shoulder girdle.',
          kn: 'ಬೆನ್ನುಹುರಿಯ ಒತ್ತಡ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ, ಹಿಮ್ಮಡಿ ಹಾಗೂ ಕಾಲುಗಳ ಸ್ನಾಯುಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.',
          hi: 'रीढ़ की हड्डी को लम्बा करता है, पिंडलियों और कंधों को सुदृढ़ बनाता है।'
        },
        astrologicalBalancing: {
          en: 'Reverses Saturnine heaviness, stimulates fresh arterial blood to brain without overexciting.',
          kn: 'ಶನಿಯ ಜಡತ್ವವನ್ನು ನಿವಾರಿಸಿ ಮಿದುಳಿಗೆ ರಕ್ತ ಪರಿಚಲನೆ ಹೆಚ್ಚಿಸುತ್ತದೆ.',
          hi: 'शनि के भारीपन और आलस्य को मिटाकर मस्तिष्क को ताजगी प्रदान करता है।'
        },
        steps: [
          { en: 'Start on hands and knees, hands shoulder-width apart and knees hip-width.', kn: 'ನಾಲ್ಕೂ ಕಾಲುಗಳ ಮೇಲೆ ಬಂದು ಕೈ ಮತ್ತು ಮಂಡಿಗಳನ್ನು ಇಡಿ.', hi: 'हाथों और घुटनों के बल आएं।' },
          { en: 'Tuck toes, exhale and lift hips up and back into an inverted V shape.', kn: 'ಮೊಣಕಾಲುಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ ಸೊಂಟವನ್ನು ಮೇಲಕ್ಕೆ ತಳ್ಳಿ (V ಆಕಾರ).', hi: 'घुटने ऊपर उठाकर नितम्बों को पीछे और ऊपर की ओर धकेलें (उल्टा V)।' },
          { en: 'Press heels toward floor and spread fingers wide.', kn: 'ಹಿಮ್ಮಡಿಗಳನ್ನು ನೆಲಕ್ಕೆ ತಾಗಿಸಲು ಯತ್ನಿಸಿ, ಕೈಬೆರಳುಗಳನ್ನು ಅಗಲವಾಗಿಡಿ.', hi: 'एड़ियों को जमीन की ओर दबाएं, उंगलियां फैली रहें।' }
        ],
        breathingCues: {
          en: 'Deep rhythmic breathing through the nose.',
          kn: 'ಮೂಗಿನ ಮೂಲಕ ಆಳವಾದ ಉಸಿರಾಟ.',
          hi: 'नासिका द्वारा गहरा एवं लयबद्ध श्वास।'
        },
        holdDuration: '5 to 8 breaths (1 minute)',
        contraindications: {
          en: 'Use wrist wedges or do on forearms if having carpal tunnel syndrome.',
          kn: 'ಮಣಿಕಟ್ಟಿನ ನೋವಿದ್ದರೆ ಮೊಣಕೈಗಳ ಮೇಲೆ ಮಾಡಿ.',
          hi: 'कलाई में दर्द होने पर कोहनियों के सहारे करें।'
        },
        iconType: 'downward_dog'
      }
    ]
  },
  Rahu: {
    grahaName: 'Rahu',
    grahaTitle: {
      en: 'Rahu (North Node) • Central Nervous System & Somatic Grounding',
      kn: 'ರಾಹು • ಕೇಂದ್ರ ನರಮಂಡಲ ಮತ್ತು ದೃಢತೆ',
      hi: 'राहु • केंद्रीय तंत्रिका तंत्र, स्थिरता एवं भ्रम निवारण'
    },
    element: { en: 'Vayu / Maya (Air / Smoke)', kn: 'ವಾಯು / ಧೂಮ್ರ', hi: 'वायु / धुआं' },
    chakra: { en: 'Ajna & Muladhara (Disorientation to Root)', kn: 'ಆಜ್ಞಾ ಮತ್ತು ಮೂಲಾಧಾರ', hi: 'आज्ञा एवं मूलाधार' },
    governedBodyParts: {
      en: 'Central Nervous System, Vagus Nerve, Spatial Proprioception, Phobias, Mental Illusions',
      kn: 'ಕೇಂದ್ರ ನರಮಂಡಲ, ಕಣ್ಣು-ಕೈ ಸಮತೋಲನ, ಆತಂಕ, ಭಯ',
      hi: 'केंद्रीय तंत्रिका तंत्र, वेगस नर्व, भ्रम, भय एवं मानसिक अस्थिरता'
    },
    imbalanceSymptoms: [
      { en: 'Restless legs, erratic breathing spikes, and sudden phantom fears', kn: 'ಕಾಲುಗಳಲ್ಲಿ ನಡುಕ, ಅತಿಯಾದ ಭಯ ಮತ್ತು ಭ್ರಮೆಗಳು', hi: 'पैरों में बेचैनी, अचानक घबराहट एवं अज्ञात भय' },
      { en: 'Spatial clumsiness and feeling ungrounded', kn: 'ದೇಹದ ಸಮತೋಲನ ತಪ್ಪುವುದು ಮತ್ತು ಅಸ್ಥಿರತೆ', hi: 'शारीरिक असंतुलन एवं भटकाव' }
    ],
    pranayama: {
      name: { en: 'Grounding Sama Vritti (Box Breathing)', kn: 'ಸಮ ವೃತ್ತಿ ಪ್ರಾಣಾಯಾಮ (ನಾಲ್ಕು ದಿಕ್ಕುಗಳ ಸಮ ಉಸಿರು)', hi: 'समवृत्ति प्राणायाम (चौकोर श्वास)' },
      instructions: {
        en: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. Repeat 8 rounds.',
        kn: '೪ ಸೆಕೆಂಡು ಉಸಿರೆಳೆದು, ೪ ಸೆಕೆಂಡು ನಿಲ್ಲಿಸಿ, ೪ ಸೆಕೆಂಡು ಬಿಟ್ಟು, ೪ ಸೆಕೆಂಡು ಶೂನ್ಯದಲ್ಲಿರಿ.',
        hi: '४ सेकंड श्वास लें, ४ सेकंड रोकें, ४ सेकंड छोड़ें, ४ सेकंड खाली रखें।'
      },
      duration: { en: '5 to 8 minutes', kn: '೫ ರಿಂದ ೮ ನಿಮಿಷ', hi: '५ से ८ मिनट' }
    },
    mudra: {
      name: { en: 'Bhumisparsha Mudra (Earth Touching)', kn: 'ಭೂಮಿಸ್ಪರ್ಶ ಮುದ್ರೆ', hi: 'भूमिस्पर्श मुद्रा' },
      instructions: {
        en: 'Rest right hand downward touching the ground with fingertips while left hand rests open in lap.',
        kn: 'ಬಲಗೈ ಬೆರಳುಗಳಿಂದ ನೆಲವನ್ನು ಮುಟ್ಟಿ, ಎಡಗೈಯನ್ನು ಮಡಿಲಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ.',
        hi: 'दाएं हाथ की उंगलियों से धरती को छुएं, बायां हाथ गोद में रखें।'
      },
      benefits: {
        en: 'Dispels Rahu phantom phobias, anchors the aura directly into the earth.',
        kn: 'ರಾಹುವಿನ ಭ್ರಮೆ, ಭಯ ಮತ್ತು ಗೊಂದಲಗಳನ್ನು ನಿವಾರಿಸಿ ದೃಢತೆ ನೀಡುತ್ತದೆ.',
        hi: 'राहु के भ्रम, भय और चिंताओं को दूर कर जातक को स्थिर करता है।'
      }
    },
    bijaMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    recommendedColor: 'from-violet-700 to-stone-900',
    suggestedAsanas: [
      {
        id: 'vrikshasana',
        sanskritName: 'Vrikshasana',
        name: { en: 'Tree Pose (Drishti Point Anchoring)', kn: 'ವೃಕ್ಷಾಸನ (ಏಕಾಗ್ರತೆಯ ವೃಕ್ಷ ಭಂಗಿ)', hi: 'वृक्षासन (स्थिर एकाग्रता मुद्रा)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Muladhara (Rooting)', kn: 'ಮೂಲಾಧಾರ (ಬೇರೂರುವಿಕೆ)', hi: 'मूलाधार (जड़वत स्थिरता)' },
        element: { en: 'Earth', kn: 'ಪೃಥ್ವಿ', hi: 'पृथ्वी' },
        physicalBenefits: {
          en: 'Trains vestibular ocular balance, strengthens ankles and stabilizing tendons.',
          kn: 'ದೇಹದ ಸಮತೋಲನ ಹೆಚ್ಚಿಸುತ್ತದೆ, ಪಾದ ಹಾಗೂ ಹಿಮ್ಮಡಿಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.',
          hi: 'शारीरिक संतुलन सुधारता है, टखनों और पैरों को मजबूत करता है।'
        },
        astrologicalBalancing: {
          en: 'Binds wandering Rahu illusion into laser-sharp physical stability through eye-gaze (Drishti).',
          kn: 'ರಾಹುವಿನ ಚಂಚಲತೆಯನ್ನು ನಿಯಂತ್ರಿಸಿ ಅಚಲವಾದ ಮನೋಸ್ಥೈರ್ಯ ನೀಡುತ್ತದೆ.',
          hi: 'राहु के मानसिक भटकाव को एकटक दृष्टि से स्थिर कर आत्मनियंत्रण लाता है।'
        },
        steps: [
          { en: 'Stand tall in Tadasana, shift weight to left foot.', kn: 'ನೇರವಾಗಿ ನಿಂತು ಎಡಗಾಲಿನ ಮೇಲೆ ತೂಕವಿರಿಸಿ.', hi: 'सीधे खड़े हों, बाएं पैर पर वजन डालें।' },
          { en: 'Place sole of right foot against inner left calf or inner thigh (never on knee).', kn: 'ಬಲ ಪಾದವನ್ನು ಎಡ ತೊಡೆಯ ಒಳಭಾಗಕ್ಕೆ ತಾಗಿಸಿ.', hi: 'दाएं पैर के तलवे को बाईं जांघ के भीतरी भाग पर रखें।' },
          { en: 'Bring hands to heart center in prayer, fixing eyes on an unmoving spot.', kn: 'ಕೈ ಮುಗಿದು ಎದುರಿನ ಒಂದು ಬಿಂದುವಿನ ಮೇಲೆ ದೃಷ್ಟಿಯಿಡಿ.', hi: 'दोनों हाथ छाती पर जोड़ें, नजर एक स्थान पर टिकाएं।' }
        ],
        breathingCues: {
          en: 'Steady, calm, silent nasal breathing.',
          kn: 'ಶಾಂತ ಮತ್ತು ಮೌನವಾದ ಉಸಿರಾಟ.',
          hi: 'शांत एवं मौन नासिका श्वास।'
        },
        holdDuration: '1 minute per side',
        contraindications: {
          en: 'Keep toe lightly on floor if experiencing balance difficulties.',
          kn: 'ತಲೆಸುತ್ತಿದ್ದರೆ ಬೆರಳನ್ನು ನೆಲದ ಮೇಲೆ ಇಟ್ಟುಕೊಳ್ಳಿ.',
          hi: 'संतुलन न बने तो पैर को थोड़ा नीचे रखें।'
        },
        iconType: 'tree'
      },
      {
        id: 'malasana',
        sanskritName: 'Malasana',
        name: { en: 'Yogic Deep Garland Squat', kn: 'ಮಾಲಾಸನ (ಗಾರ್ಲ್ಯಾಂಡ್ ಸ್ಕ್ವಾಟ್)', hi: 'मालासन (गहरी यौगिक बैठक)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Muladhara', kn: 'ಮೂಲಾಧಾರ', hi: 'मूलाधार' },
        element: { en: 'Earth', kn: 'ಪೃಥ್ವಿ', hi: 'पृथ्वी' },
        physicalBenefits: {
          en: 'Opens groin, stimulates Apana Vayu elimination, grounds lower lumbar pressure.',
          kn: 'ಅಪಾನ ವಾಯುವನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ, ಸೊಂಟದ ಒತ್ತಡ ಕಡಿಮೆ ಮಾಡಿ ನೆಲದ ಸಂಪರ್ಕ ನೀಡುತ್ತದೆ.',
          hi: 'अपान वायु को संतुलित करता है, पाचन सुधारता है एवं शरीर को स्थिरता देता है।'
        },
        astrologicalBalancing: {
          en: 'Discharges nervous erratic electric charges generated by Rahu into Mother Earth.',
          kn: 'ರಾಹುವಿನಿಂದ ಉಂಟಾಗುವ ನರಗಳ ತಲ್ಲಣವನ್ನು ಭೂಮಿಗೆ ವರ್ಗಾಯಿಸಿ ಶಾಂತಿ ನೀಡುತ್ತದೆ.',
          hi: 'राहु जनित घबराहट और वायु दोष को भूमि में विसर्जित करता है।'
        },
        steps: [
          { en: 'Stand with feet wider than hips, toes angled outward.', kn: 'ಕಾಲುಗಳನ್ನು ಅಗಲವಾಗಿಟ್ಟು ನಿಲ್ಲಿ.', hi: 'पैरों को कंधों से अधिक चौड़ा रखें।' },
          { en: 'Lower hips into a deep squat, keeping heels rooted.', kn: 'ಹಿಮ್ಮಡಿಗಳನ್ನು ನೆಲಕ್ಕೆ ತಾಗಿಸಿ ಪೂರ್ಣವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ.', hi: 'नितम्बों को नीचे लाकर पूरी बैठक लगाएं।' },
          { en: 'Press elbows against inner knees, palms together at heart, spine tall.', kn: 'ಮೊಣಕೈಗಳಿಂದ ಮಂಡಿಗಳನ್ನು ಹೊರಕ್ಕೆ ತಳ್ಳಿ ಕೈಮುಗಿಯಿರಿ.', hi: 'कोहनियों से घुटनों को बाहर दबाएं और हाथ जोड़ें।' }
        ],
        breathingCues: {
          en: 'Deep abdominal diaphragmatic breaths into the base of the pelvis.',
          kn: 'ಹೊಟ್ಟೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಆಳವಾಗಿ ಉಸಿರಾಡಿ.',
          hi: 'नाभि के निचले भाग में गहरा श्वास लें।'
        },
        holdDuration: '1 to 2 minutes',
        contraindications: {
          en: 'Place a rolled mat under heels if they lift off the floor.',
          kn: 'ಹಿಮ್ಮಡಿ ಮೇಲಕ್ಕೆದ್ದರೆ ಮ್ಯಾಟ್ ಮಡಚಿ ಕೆಳಗೆ ಇಟ್ಟುಕೊಳ್ಳಿ.',
          hi: 'एड़ियां न टिकें तो नीचे तौलिया या मैट मोड़कर रखें।'
        },
        iconType: 'squat'
      }
    ]
  },
  Ketu: {
    grahaName: 'Ketu',
    grahaTitle: {
      en: 'Ketu (South Node) • Kundalini Axis, Spine & Subtle Body',
      kn: 'ಕೇತು • ಸುಷುಮ್ನಾ ನಾಡಿ, ಬೆನ್ನುಹುರಿ ಮತ್ತು ಕುಂಡಲಿನೀ ಜಾಗೃತಿ',
      hi: 'केतु • सुषुम्ना नाड़ी, मेरुदण्ड एवं कुण्डलिनी जागरण'
    },
    element: { en: 'Moksha / Subtle Fire', kn: 'ಮೋಕ್ಷ / ಸೂಕ್ಷ್ಮ ಅಗ್ನಿ', hi: 'मोक्ष / सूक्ष्म अग्नि' },
    chakra: { en: 'Muladhara to Sahasrara Axis', kn: 'ಮೂಲಾಧಾರದಿಂದ ಸಹಸ್ರಾರದವರೆಗಿನ ಅಕ್ಷ', hi: 'मूलाधार से सहस्रार तक मेरुदण्ड अक्ष' },
    governedBodyParts: {
      en: 'Spine Column, Kundalini Channel (Sushumna), Nervous Reflexes, Subconscious Memory',
      kn: 'ಬೆನ್ನುಹುರಿ, ಸುಷುಮ್ನಾ ನಾಡಿ, ಪ್ರತಿವರ್ತನೆಗಳು, ಅಂತಃಪ್ರಜ್ಞೆ',
      hi: 'मेरुदण्ड, सुषुम्ना, तंत्रिका प्रतिक्रियाएं, अवचेतन मन'
    },
    imbalanceSymptoms: [
      { en: 'Spinal misalignment, numbness in fingers or toes, and detachment', kn: 'ಬೆನ್ನುಮೂಳೆಯ ಅಸಮತೋಲನ, ಕೈಕಾಲುಗಳ ಮರಗಟ್ಟುವಿಕೆ ಮತ್ತು ಅನಾಸಕ್ತಿ', hi: 'रीढ़ की विकृति, हाथ-पैरों का सुन्न होना एवं वैराग्यजन्य अवसाद' },
      { en: 'Erratic pain thresholds and sensory overload', kn: 'ಹಠಾತ್ ನೋವು ಮತ್ತು ಶರೀರದಿಂದ ಬೇರ್ಪಟ್ಟ ಭಾವನೆ', hi: 'अचानक दर्द एवं शरीर से कटाव का अनुभव' }
    ],
    pranayama: {
      name: { en: 'Sushumna Shodhana & Kumbhaka', kn: 'ಸುಷುಮ್ನಾ ಶೋಧನ ಮತ್ತು ಕುಂಭಕ', hi: 'सुषुम्ना शोधन एवं कुम्भक' },
      instructions: {
        en: 'Visualize prana flowing up the central spinal channel on inhale, pause in stillness at the crown, exhale smoothly down to the base.',
        kn: 'ಉಸಿರೆಳೆಯುವಾಗ ಪ್ರಾಣಶಕ್ತಿಯು ಬೆನ್ನುಹುರಿಯ ಮೂಲಕ ನೆತ್ತಿಯವರೆಗೆ ಏರುವುದನ್ನು ಭಾವಿಸಿ, ಕ್ಷಣಕಾಲ ನಿಲ್ಲಿಸಿ, ನಂತರ ಕೆಳಗೆ ಇಳಿಸಿ.',
        hi: 'श्वास लेते हुए रीढ़ के मध्य से प्राण ऊर्जा को सिर तक उठता अनुभव करें, रोकें और धीरे-धीरे नीचे लाएं।'
      },
      duration: { en: '5 to 10 minutes', kn: '೫ ರಿಂದ ೧೦ ನಿಮಿಷ', hi: '५ से १० मिनट' }
    },
    mudra: {
      name: { en: 'Hakini Mudra (Brain Hemisphere Cohesion)', kn: 'ಹಾಕಿನೀ ಮುದ್ರೆ', hi: 'हाकिनी मुद्रा' },
      instructions: {
        en: 'Bring fingertips of both hands together with fingers pointing upward, palms separated.',
        kn: 'ಎರಡೂ ಕೈಗಳ ಬೆರಳುಗಳ ತುದಿಗಳನ್ನು ಪರಸ್ಪರ ಮುಟ್ಟಿಸಿ ಹಸ್ತಗಳನ್ನು ದೂರವಿಡಿ.',
        hi: 'दोनों हाथों की उंगलियों के पोरों को आपस में मिलाएं, हथेलियां अलग रहें।'
      },
      benefits: {
        en: 'Activates third eye and crown, deepens intuition, integrates fragmented subtle energy.',
        kn: 'ಅಂತಃಪ್ರಜ್ಞೆ, ಧ್ಯಾನ ಶಕ್ತಿ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಸಂವೇದನೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
        hi: 'अंतर्ज्ञान बढ़ाता है, दोनों गोलार्द्धों को जोड़ता है और केतु को शुभ करता है।'
      }
    },
    bijaMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    recommendedColor: 'from-amber-700 to-stone-800',
    suggestedAsanas: [
      {
        id: 'marjaryasana',
        sanskritName: 'Marjaryasana-Bitilasana',
        name: { en: 'Cat-Cow Spinal Wave', kn: 'ಮಾರ್ಜಾಲಾಸನ - ಬಿಟಿಲಾಸನ (ಬೆನ್ನಿನ ಅಲೆ ಭಂಗಿ)', hi: 'मार्जरासन - मार्जारी लहर' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Entire Sushumna (Spinal Column)', kn: 'ಸಮಗ್ರ ಸುಷುಮ್ನಾ ನಾಡಿ', hi: 'सम्पूर्ण सुषुम्ना मेरुदण्ड' },
        element: { en: 'Ether & Air', kn: 'ಆಕಾಶ ಮತ್ತು ವಾಯು', hi: 'आकाश एवं वायु' },
        physicalBenefits: {
          en: 'Articulates each spinal vertebra, releases cerebrospinal fluid, harmonizes sympathetic and parasympathetic nerves.',
          kn: 'ಬೆನ್ನುಹುರಿಯ ಪ್ರತಿಯೊಂದು ಮೂಳೆಯನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಪ್ರಾಣಸಂಚಾರ ಸುಲಭಗೊಳಿಸುತ್ತದೆ.',
          hi: 'रीढ़ के प्रत्येक जोड़ को लचीला बनाता है, रीढ़ के तरल को सक्रिय करता है।'
        },
        astrologicalBalancing: {
          en: 'Awakens Ketu spiritual spinal axis, dispels phantom physical blockages.',
          kn: 'ಕೇತುವಿನ ಸೂಕ್ಷ್ಮ ಶಕ್ತಿಯನ್ನು ಬೆನ್ನುಹುರಿಯಲ್ಲಿ ಜಾಗೃತಗೊಳಿಸಿ ನರಗಳ ದೌರ್ಬಲ್ಯ ನಿವಾರಿಸುತ್ತದೆ.',
          hi: 'केतु के आध्यात्मिक प्रवाह को मेरुदण्ड में सक्रिय कर स्नायु विकारों को दूर करता है।'
        },
        steps: [
          { en: 'Start on hands and knees with wrists directly under shoulders and knees under hips.', kn: 'ನಾಲ್ಕೂ ಕಾಲುಗಳ ಮೇಲೆ ಸಮನಾಗಿ ನಿಲ್ಲಿ.', hi: 'हाथों और घुटनों पर आएं, कलाई कन्धों के नीचे रहे।' },
          { en: 'Inhale (Cow): Drop belly, arch back, lift sitting bones and chest, gaze up.', kn: 'ಉಸಿರೆಳೆದು ಹೊಟ್ಟೆಯನ್ನು ತಗ್ಗಿಸಿ, ಬೆನ್ನನ್ನು ಬಗ್ಗಿಸಿ ಮೇಲಕ್ಕೆ ನೋಡಿ.', hi: 'श्वास लेते हुए पेट नीचे करें, छाती उठाएं, दृष्टि ऊपर।' },
          { en: 'Exhale (Cat): Round spine towards ceiling, tuck tailbone, release head down.', kn: 'ಉಸಿರು ಬಿಡುತ್ತಾ ಬೆನ್ನನ್ನು ಮೇಲಕ್ಕೆ ಕಮಾನಿನಂತೆ ಬಗ್ಗಿಸಿ ಗಲ್ಲವನ್ನು ಎದೆಗೆ ಮುಟ್ಟಿಸಿ.', hi: 'श्वास छोड़ते हुए पीठ को बिल्ली के समान ऊपर उठाएं, ठोड़ी छाती से लगाएं।' }
        ],
        breathingCues: {
          en: 'Wave-like sync: Inhale to arch, Exhale to round.',
          kn: 'ಅಲೆಯಂತೆ ನಿರಂತರ ಉಸಿರಾಟದ ಜೊತೆ ಚಲಿಸಿ.',
          hi: 'श्वास के साथ लयबद्ध गति करें।'
        },
        holdDuration: '8 to 12 slow waves',
        contraindications: {
          en: 'Keep spine neutral if recovering from acute whiplash.',
          kn: 'ಕುತ್ತಿಗೆಯ ತೀವ್ರ ನೋವಿದ್ದರೆ ಕುತ್ತಿಗೆಯನ್ನು ನೇರವಾಗಿಡಿ.',
          hi: 'गर्दन में चोट होने पर सिर सीधा रखें।'
        },
        iconType: 'cat_cow'
      },
      {
        id: 'salabhasana',
        sanskritName: 'Salabhasana',
        name: { en: 'Locust Pose (Posterior Chain Strengthener)', kn: 'ಶಲಭಾಸನ (ಮಿಡತೆ ಭಂಗಿ)', hi: 'शलभासन (मेरुदण्ड शक्ति मुद्रा)' },
        poseLevel: 'Beginner',
        targetChakra: { en: 'Muladhara & Manipura', kn: 'ಮೂಲಾಧಾರ ಮತ್ತು ಮಣಿಪೂರ', hi: 'मूलाधार एवं मणिपुर' },
        element: { en: 'Fire & Earth', kn: 'ಅಗ್ನಿ ಮತ್ತು ಪೃಥ್ವಿ', hi: 'अग्नि एवं पृथ्वी' },
        physicalBenefits: {
          en: 'Strengthens erector spinae, deep gluteal muscles, and improves posterior spinal alignment.',
          kn: 'ಬೆನ್ನಿನ ಕೆಳಭಾಗದ ಸ್ನಾಯುಗಳನ್ನು ಅತ್ಯಂತ ಬಲಿಷ್ಠಗೊಳಿಸುತ್ತದೆ, ಬೆನ್ನುಹುರಿಯನ್ನು ಸರಿಪಡಿಸುತ್ತದೆ.',
          hi: 'रीढ़ की निचली मांसपेशियों को मजबूत बनाता है, कटि प्रदेश के दर्द को मिटाता है।'
        },
        astrologicalBalancing: {
          en: 'Grounds Ketu detachment, restores tactile strength to extremities and lower back.',
          kn: 'ಕೇತುವಿನಿಂದ ಉಂಟಾಗುವ ಬೆನ್ನುನೋವು ಮತ್ತು ಕಾಲುಗಳ ಮರಗಟ್ಟುವಿಕೆಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ.',
          hi: 'केतु के कारण होने वाले सुन्नपन और रीढ़ की कमजोरी को समाप्त करता है।'
        },
        steps: [
          { en: 'Lie on your stomach with arms resting alongside torso, palms facing down.', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲೆ ಮಲಗಿ ಕೈಗಳನ್ನು ಪಕ್ಕದಲ್ಲಿಡಿ.', hi: 'पेट के बल लेटें, हाथ जांघों के बगल में रखें।' },
          { en: 'Inhale, lift head, chest, arms, and legs off the mat simultaneously.', kn: 'ಉಸಿರೆಳೆದು ತಲೆ, ಎದೆ ಮತ್ತು ಕಾಲುಗಳನ್ನು ಒಟ್ಟಿಗೆ ಮೇಲಕ್ಕೆತ್ತಿ.', hi: 'श्वास भरते हुए सिर, छाती, हाथ और दोनों पैर एक साथ ऊपर उठाएं।' },
          { en: 'Balance on your lower ribs, abdomen, and front pelvis, reaching back through toes.', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲೆ ತೂಕವಿರಿಸಿ ಕೈಕಾಲುಗಳನ್ನು ಹಿಂದಕ್ಕೆ ಚಾಚಿ.', hi: 'पेट पर संतुलन बनाएं, दृष्टि सामने रखें।' }
        ],
        breathingCues: {
          en: 'Steady, non-strained breathing into the upper back.',
          kn: 'ಸ್ಥಿರವಾಗಿ ಉಸಿರಾಡಿ, ಉಸಿರು ಕಟ್ಟಬೇಡಿ.',
          hi: 'श्वास न रोकें, निरंतर मंद श्वास लेते रहें।'
        },
        holdDuration: '15 to 30 seconds',
        contraindications: {
          en: 'Avoid in late pregnancy or acute abdominal inflammation.',
          kn: 'ಗರ್ಭಾವಸ್ಥೆ ಅಥವಾ ಹೊಟ್ಟೆಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯಾಗಿದ್ದರೆ ಮಾಡಬೇಡಿ.',
          hi: 'गर्भावस्था या हर्निया में न करें।'
        },
        iconType: 'locust'
      }
    ]
  }
};

export interface PersonalizedVedicYogaPlan {
  lagnaRashi: string;
  lagnaLord: string;
  lagnaLordProfile: GrahaYogaProfile;
  constitutionalAsana: VedicAsana;
  weakestPlanet: {
    name: string;
    score: number;
    profile: GrahaYogaProfile;
    therapeuticAsana: VedicAsana;
  };
  strongestPlanet: {
    name: string;
    score: number;
    profile: GrahaYogaProfile;
    energizingAsana: VedicAsana;
  };
  elementalBreakdown: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    dominantElement: string;
    balancingAdvice: LocalizedString;
  };
  physicalBalanceScores: {
    spinalAlignment: number;
    muscularStamina: number;
    jointFlexibility: number;
    nervousStability: number;
    cardioVitality: number;
    digestiveAgni: number;
  };
  customSequence: {
    phase: 'warmup' | 'therapeutic' | 'energizing' | 'restorative';
    title: LocalizedString;
    asana: VedicAsana;
    grahaSource: string;
    rationale: LocalizedString;
  }[];
  dailyPranayama: {
    name: LocalizedString;
    instructions: LocalizedString;
    duration: LocalizedString;
  };
  dailyMudra: {
    name: LocalizedString;
    instructions: LocalizedString;
    benefits: LocalizedString;
  };
}

const RASHI_LORDS = [
  'Mars',    // 0 Mesha
  'Venus',   // 1 Vrishabha
  'Mercury', // 2 Mithuna
  'Moon',    // 3 Karka
  'Sun',     // 4 Simha
  'Mercury', // 5 Kanya
  'Venus',   // 6 Tula
  'Mars',    // 7 Vrischika
  'Jupiter', // 8 Dhanus
  'Saturn',  // 9 Makara
  'Saturn',  // 10 Kumbha
  'Jupiter'  // 11 Meena
];

export function calculateVedicYogaPlan(
  kundali: KundaliData,
  balaBreakdown?: PlanetaryBalaBreakdown[] | Record<string, PlanetaryBalaBreakdown>
): PersonalizedVedicYogaPlan {
  const lagnaRashiIdx = kundali.lagnaRashiIndex ?? 0;
  const lagnaLord = RASHI_LORDS[lagnaRashiIdx] || 'Sun';
  const lagnaLordProfile = GRAHA_YOGA_PROFILES[lagnaLord] || GRAHA_YOGA_PROFILES.Sun;
  const constitutionalAsana = lagnaLordProfile.suggestedAsanas[0];

  // Evaluate planetary strength scores
  const planetsToEvaluate = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const scores: { name: string; score: number }[] = [];

  planetsToEvaluate.forEach(pName => {
    let score = 65; // default moderate
    if (balaBreakdown) {
      if (Array.isArray(balaBreakdown)) {
        const found = balaBreakdown.find(b => b.planet.name.toLowerCase() === pName.toLowerCase());
        if (found) score = Math.round(found.totalScore);
      } else if (balaBreakdown[pName]) {
        score = Math.round(balaBreakdown[pName].totalScore);
      }
    }
    if (score === 65) {
      // Approximate fallback from house placement
      const p = kundali.planets.find(pl => pl.name.toLowerCase() === pName.toLowerCase());
      if (p) {
        if ([1, 4, 5, 7, 9, 10].includes(p.bhava)) score += 20;
        if ([6, 8, 12].includes(p.bhava)) score -= 25;
        if (p.isRetrograde) score += 10;
      }
    }
    scores.push({ name: pName, score });
  });

  scores.sort((a, b) => a.score - b.score);
  const weakest = scores[0] || { name: 'Saturn', score: 45 };
  const strongest = scores[scores.length - 1] || { name: 'Sun', score: 85 };

  const weakestProfile = GRAHA_YOGA_PROFILES[weakest.name] || GRAHA_YOGA_PROFILES.Saturn;
  const strongestProfile = GRAHA_YOGA_PROFILES[strongest.name] || GRAHA_YOGA_PROFILES.Sun;

  const therapeuticAsana = weakestProfile.suggestedAsanas[0];
  const energizingAsana = strongestProfile.suggestedAsanas[0];

  // Elemental distribution (Fire: 0,4,8; Earth: 1,5,9; Air: 2,6,10; Water: 3,7,11)
  let fireCount = 0;
  let earthCount = 0;
  let airCount = 0;
  let waterCount = 0;

  kundali.planets.forEach(p => {
    const r = p.rashiIndex % 12;
    if ([0, 4, 8].includes(r)) fireCount++;
    else if ([1, 5, 9].includes(r)) earthCount++;
    else if ([2, 6, 10].includes(r)) airCount++;
    else if ([3, 7, 11].includes(r)) waterCount++;
  });

  const totalElements = Math.max(1, fireCount + earthCount + airCount + waterCount);
  const firePercent = Math.round((fireCount / totalElements) * 100);
  const earthPercent = Math.round((earthCount / totalElements) * 100);
  const airPercent = Math.round((airCount / totalElements) * 100);
  const waterPercent = Math.round((waterCount / totalElements) * 100);

  let dominantElement = 'Fire (Agni)';
  let balancingAdvice: LocalizedString = {
    en: 'Your chart is rich in Fire (Agni). Emphasize cooling, grounding postures like Chandra Namaskara and Balasana.',
    kn: 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಅಗ್ನಿ ತತ್ವ ಹೆಚ್ಚಾಗಿದೆ. ಚಂದ್ರ ನಮಸ್ಕಾರ, ಶೀತಲೀ ಪ್ರಾಣಾಯಾಮ ಮತ್ತು ಬಾಲಾಸನಗಳ ಮೂಲಕ ಶಾಂತತೆ ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
    hi: 'आपकी कुण्डली में अग्नि तत्त्व प्रधान है। शीतलता और स्थिरता हेतु चन्द्र नमस्कार एवं बालासन का अभ्यास करें।'
  };

  if (earthPercent >= firePercent && earthPercent >= airPercent && earthPercent >= waterPercent) {
    dominantElement = 'Earth (Prithvi)';
    balancingAdvice = {
      en: 'Your chart is grounded in Earth (Prithvi). Incorporate dynamic flowing sequences like Surya Namaskara to avoid physical stagnation.',
      kn: 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಪೃಥ್ವಿ ತತ್ವ ಅಧಿಕವಾಗಿದೆ. ಜಡತ್ವ ನಿವಾರಿಸಲು ಸೂರ್ಯ ನಮಸ್ಕಾರ ಮತ್ತು ಕ್ರಿಯಾಶೀಲ ಆಸನಗಳನ್ನು ರೂಢಿಸಿಕೊಳ್ಳಿ.',
      hi: 'आपकी कुण्डली में पृथ्वी तत्त्व अधिक है। आलस्य निवारण हेतु गतिशील सूर्य नमस्कार का अभ्यास करें।'
    };
  } else if (airPercent >= firePercent && airPercent >= earthPercent && airPercent >= waterPercent) {
    dominantElement = 'Air (Vayu)';
    balancingAdvice = {
      en: 'Your chart has high Air (Vayu). Ground nervous energy with standing poses like Tadasana, Vrikshasana, and Vayu Mudra.',
      kn: 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ವಾಯು ತತ್ವ ಹೆಚ್ಚಿದೆ. ನರಗಳ ಚಂಚಲತೆ ಕಡಿಮೆ ಮಾಡಲು ತಾಡಾಸನ, ವೃಕ್ಷಾಸನ ಮತ್ತು ವಾಯು ಮುದ್ರೆಯನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.',
      hi: 'आपकी कुण्डಲಿ में वायु तत्त्व अधिक है। तंत्रिका तंत्र की शांति हेतु ताड़ासन, वृक्षासन एवं वायु मुद्रा करें।'
    };
  } else if (waterPercent >= firePercent && waterPercent >= earthPercent && waterPercent >= airPercent) {
    dominantElement = 'Water (Jala)';
    balancingAdvice = {
      en: 'Your chart is rich in Water (Jala). Stimulate core digestive fire (Agni) with Navasana and Warrior poses.',
      kn: 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಜಲ ತತ್ವ ಹೆಚ್ಚಿದೆ. ನಾವಾಸನ ಮತ್ತು ವೀರಭದ್ರಾಸನಗಳ ಮೂಲಕ ಜಠರಾಗ್ನಿಯನ್ನು ಪ್ರಚೋದಿಸಿಕೊಳ್ಳಿ.',
      hi: 'आपकी कुण्डली में जल तत्त्व अधिक है। जठराग्नि प्रदीप्त करने हेतु नावासन व वीरभद्रासन करें।'
    };
  }

  // Physical balance scores based on planetary strengths
  const physicalBalanceScores = {
    spinalAlignment: Math.min(95, Math.max(40, Math.round((scores.find(s => s.name === 'Sun')?.score || 60) * 0.95))),
    muscularStamina: Math.min(95, Math.max(40, Math.round((scores.find(s => s.name === 'Mars')?.score || 60) * 0.95))),
    jointFlexibility: Math.min(95, Math.max(40, Math.round((scores.find(s => s.name === 'Saturn')?.score || 60) * 0.95))),
    nervousStability: Math.min(95, Math.max(40, Math.round((scores.find(s => s.name === 'Mercury')?.score || 60) * 0.95))),
    cardioVitality: Math.min(95, Math.max(40, Math.round(((scores.find(s => s.name === 'Sun')?.score || 60) + (scores.find(s => s.name === 'Moon')?.score || 60)) / 2))),
    digestiveAgni: Math.min(95, Math.max(40, Math.round(((scores.find(s => s.name === 'Mars')?.score || 60) + (scores.find(s => s.name === 'Jupiter')?.score || 60)) / 2)))
  };

  // Build 4-Phase Custom Sequence
  const customSequence = [
    {
      phase: 'warmup' as const,
      title: { en: 'Phase 1: Solar / Lunar Centering', kn: 'ಹಂತ ೧: ಪ್ರಾಣ ಜಾಗೃತಿ ಮತ್ತು ಸೂರ್ಯ ಸಮತೋಲನ', hi: 'प्रथम चरण: प्राण जागरण एवं सूर्य संतुलन' },
      asana: GRAHA_YOGA_PROFILES.Sun.suggestedAsanas[0], // Surya Namaskara
      grahaSource: 'Sun (Prana Awakener)',
      rationale: {
        en: 'Activates the central Sushumna and Manipura chakra, clearing physical lethargy before specific therapy.',
        kn: 'ದೇಹದ ಪ್ರತಿಯೊಂದು ಕೀಲು ಮತ್ತು ನರಗಳಿಗೆ ಪ್ರಾಣಶಕ್ತಿಯನ್ನು ತುಂಬಿ ದಿನದ ಆರಂಭಕ್ಕೆ ಸಿದ್ಧಗೊಳಿಸುತ್ತದೆ.',
        hi: 'सम्पूर्ण शरीर में प्राण का संचार करता है और दिनचर्या हेतु स्फूर्ति प्रदान करता है।'
      }
    },
    {
      phase: 'therapeutic' as const,
      title: {
        en: `Phase 2: Therapeutic Balance for Weak ${weakest.name}`,
        kn: `ಹಂತ ೨: ದುರ್ಬಲ ${weakestProfile.grahaTitle.kn.split('•')[0]} ದೋಷ ನಿವಾರಣಾ ಆಸನ`,
        hi: `द्वितीय चरण: निर्बल ${weakestProfile.grahaTitle.hi.split('•')[0]} की चिकित्सा`
      },
      asana: therapeuticAsana,
      grahaSource: `${weakest.name} (Remedial Balancing)`,
      rationale: {
        en: `Directly heals the physical weakness governed by ${weakest.name} in your Kundali (score: ${weakest.score}/100).`,
        kn: `ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ${weakest.name} ದುರ್ಬಲವಾಗಿರುವುದರಿಂದ ಉಂಟಾಗುವ ದೈಹಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುತ್ತದೆ.`,
        hi: `आपकी कुण्डली में ${weakest.name} के प्रभाव से उत्पन्न शारीरिक दुर्बलता को दूर करता है।`
      }
    },
    {
      phase: 'energizing' as const,
      title: {
        en: `Phase 3: Core Harmony for Lagna Lord (${lagnaLord})`,
        kn: `ಹಂತ ೩: ಲಗ್ನಾಧಿಪತಿ (${lagnaLord}) ಸಮತೋಲನ ಆಸನ`,
        hi: `तृतीय चरण: लग्नेश (${lagnaLord}) शारीरिक पुष्टि आसन`
      },
      asana: constitutionalAsana,
      grahaSource: `${lagnaLord} (Tanu Bhava Lord)`,
      rationale: {
        en: `Strengthens your physical body (Tanu Bhava) constitution governed by your ascendant lord ${lagnaLord}.`,
        kn: `ನಿಮ್ಮ ಲಗ್ನಾಧಿಪತಿಯಾದ ${lagnaLord} ನ ಪ್ರಭಾವದಿಂದ ಶರೀರದ ಸಹಜ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸುತ್ತದೆ.`,
        hi: `लग्नेश ${lagnaLord} के प्रभाव से शरीर को आरोग्य और स्वाभाविक तेज प्रदान करता है।`
      }
    },
    {
      phase: 'restorative' as const,
      title: { en: 'Phase 4: Restorative Cool-down & Somatic Grounding', kn: 'ಹಂತ ೪: ಪ್ರಶಾಂತ ವಿಶ್ರಾಂತಿ ಮತ್ತು ನರಗಳ ತಂಪು', hi: 'चतुर्थ चरण: परम विश्रांति एवं मानसिक शांति' },
      asana: GRAHA_YOGA_PROFILES.Moon.suggestedAsanas[0], // Viparita Karani
      grahaSource: 'Moon & Venus (Somatic Restoration)',
      rationale: {
        en: 'Cooling lymphatic restoration; locks in the bio-energy gained and down-regulates the sympathetic nervous system.',
        kn: 'ಮಾನಸಿಕ ಶಾಂತಿ, ಗಾಢ ನಿದ್ರೆ ಮತ್ತು ದೇಹದ ರಸಧಾತುವಿನ ಸಮತೋಲನ ನೀಡುತ್ತದೆ.',
        hi: 'लसिका तंत्र को शांत कर मानसिक शांति और गहरी ऊर्जा प्रदान करता है।'
      }
    }
  ];

  return {
    lagnaRashi: kundali.houses[0]?.rashiName.en || 'Aries',
    lagnaLord,
    lagnaLordProfile,
    constitutionalAsana,
    weakestPlanet: {
      name: weakest.name,
      score: weakest.score,
      profile: weakestProfile,
      therapeuticAsana
    },
    strongestPlanet: {
      name: strongest.name,
      score: strongest.score,
      profile: strongestProfile,
      energizingAsana
    },
    elementalBreakdown: {
      fire: firePercent,
      earth: earthPercent,
      air: airPercent,
      water: waterPercent,
      dominantElement,
      balancingAdvice
    },
    physicalBalanceScores,
    customSequence,
    dailyPranayama: weakestProfile.pranayama,
    dailyMudra: weakestProfile.mudra
  };
}
