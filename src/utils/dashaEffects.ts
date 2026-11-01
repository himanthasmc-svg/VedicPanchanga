import { Language, LocalizedString } from '../types';

export interface DashaEffectSummary {
  mahadashaLord: string;
  archetype: LocalizedString;
  governedAreas: LocalizedString;
  generalEffects: LocalizedString;
  careerFinance: LocalizedString;
  healthWellness: LocalizedString;
  spiritualFocus: LocalizedString;
  recommendedRemedies: LocalizedString;
}

export interface AntardashaEffectSummary {
  comboKey: string; // e.g. "Jupiter-Saturn"
  relationship: 'Friendly' | 'Neutral' | 'Adversarial' | 'Karmic Integration';
  relationshipName: LocalizedString;
  synthesis: LocalizedString;
  opportunities: LocalizedString;
  cautions: LocalizedString;
  prescribedUpaya: LocalizedString;
}

export const MAHADASHA_EFFECTS: Record<string, DashaEffectSummary> = {
  Sun: {
    mahadashaLord: 'Sun',
    archetype: { en: 'The Royal Soul & Cosmic Vitality (Atmakaraka)', kn: 'ಆತ್ಮಕಾರಕ, ತೇಜಸ್ಸು ಹಾಗೂ ರಾಜಯೋಗ', hi: 'आत्मकारक, तेज एवं राजयोग' },
    governedAreas: { en: 'Soul vitality, spine, eyesight, governmental favor, leadership, father', kn: 'ಆತ್ಮಶಕ್ತಿ, ಬೆನ್ನೆಲುಬು, ನೇತ್ರ, ಸರಕಾರಿ ಕೃಪೆ, ಪಿತೃ', hi: 'आत्मशक्ति, मेरुदण्ड, नेत्र, सरकारी कृपा, पिता' },
    generalEffects: {
      en: 'A cycle of high self-confidence, recognition from authority, executive responsibility, and radiant vitality. Fosters strong willpower and clarity of life purpose.',
      kn: 'ಉನ್ನತ ಆತ್ಮವಿಶ್ವಾಸ, ಸಮಾಜದಲ್ಲಿ ಮನ್ನಣೆ, ಸರಕಾರಿ ಮತ್ತು ಆಡಳಿತಾತ್ಮಕ ಅಧಿಕಾರ ಪ್ರಾಪ್ತಿ ಹಾಗೂ ತೇಜಸ್ಸಿನ ವೃದ್ಧಿ.',
      hi: 'उच्च आत्मविश्वास, सामाजिक प्रतिष्ठा, सरकारी व प्रशासनिक कार्यों में सफलता एवं जीवन में स्पष्टता।'
    },
    careerFinance: {
      en: 'Promotions to management or administrative ranks. Favorable for launching enterprises, political aspirations, and contracts.',
      kn: 'ಉದ್ಯೋಗದಲ್ಲಿ ಪದೋನ್ನತಿ, ಆಡಳಿತಾತ್ಮಕ ಹುದ್ದೆ, ಸ್ವಂತ ಉದ್ಯಮ ಮತ್ತು ಸರಕಾರಿ ಅನುದಾನ ಪ್ರಾಪ್ತಿ.',
      hi: 'प्रबंधन में पदोन्नति, प्रशासनिक दायित्व, व्यापार विस्तार एवं राजपक्ष से लाभ।'
    },
    healthWellness: {
      en: 'Supportive for cardiovascular stamina. Watch for excessive bodily heat (Pitta), headaches, or eye strain during peak transits.',
      kn: 'ಹೃದಯ ಮತ್ತು ಬೆನ್ನುಹುರಿಯ ಬಲವರ್ಧನೆ. ಪಿತ್ತ ಪ್ರಕೋಪ, ನೇತ್ರದೋಷ ಹಾಗೂ ರಕ್ತದೊತ್ತಡದ ಬಗ್ಗೆ ಜಾಗ್ರತೆ ಅಗತ್ಯ.',
      hi: 'हृदय व मेरुदण्ड की सुदृढ़ता। पित्त प्रकोप एवं नेत्र पीड़ा से बचाव रखें।'
    },
    spiritualFocus: {
      en: 'Surya Namaskar at sunrise, Gayatri Mantra, and Sri Aditya Hridaya Stotra dedicated to Lord Shiva as Nilakantha.',
      kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯ ನಮಸ್ಕಾರ, ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಣ ಹಾಗೂ ಶಿವನಿಗೆ ರುದ್ರಾಭಿಷೇಕ.',
      hi: 'सूर्योदय समय सूर्य नमस्कार, आदित्य हृदय स्तोत्र पाठ एवं भगवान शिव का रुद्राभिषेक।'
    },
    recommendedRemedies: {
      en: 'Chant Om Hram Hrim Hraum Sah Suryaya Namah. Offer water in a copper vessel with kumkum to the rising Sun.',
      kn: 'ತಾಮ್ರದ ಪಾತ್ರೆಯಲ್ಲಿ ಅಕ್ಷತೆ-ಕುಂಕುಮಯುಕ್ತ ಜಲವನ್ನು ಸೂರ್ಯನಿಗೆ ಅರ್ಪಿಸಿ.',
      hi: 'तांबे के पात्र में लाल चन्दन व अक्षत डालकर सूर्य को अर्घ्य दें।'
    }
  },
  Moon: {
    mahadashaLord: 'Moon',
    archetype: { en: 'The Intuitive Mind & Fluid Maternal Nurture (Manaskaraka)', kn: 'ಮನಃಕಾರಕ, ಮಾತೃ ವಾತ್ಸಲ್ಯ ಹಾಗೂ ಅಂತಃಪ್ರಜ್ಞೆ', hi: 'मनःकारक, मातृ वात्सल्य एवं अंतर्ज्ञान' },
    governedAreas: { en: 'Mind, emotions, bodily fluids, public popularity, mother, peace', kn: 'ಮನಸ್ಸು, ಭಾವನೆಗಳು, ಜಲತತ್ವ, ಸಾರ್ವಜನಿಕ ಪ್ರೀತಿ, ಮಾತೃ', hi: 'मन, भावनाएं, जल तत्त्व, जनसंपर्क, माता' },
    generalEffects: {
      en: 'Heightened sensitivity, psychic intuition, artistic creativity, and emotional expansion. Public interactions and overseas travel flourish.',
      kn: 'ಮಾನಸಿಕ ಶಾಂತಿ, ಕಲಾತ್ಮಕ ಸೃಜನಶೀಲತೆ, ಮಾತೃ ಸುಖ ಹಾಗೂ ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕದಿಂದ ಯಶಸ್ಸು.',
      hi: 'मानसिक प्रसन्नता, कलात्मक प्रतिभा, माता का सुख एवं विदेश यात्राओं से लाभ।'
    },
    careerFinance: {
      en: 'Success in public relations, liquids, hospitality, creative writing, pharmaceuticals, and silver/dairy investments.',
      kn: 'ಸಾರ್ವಜನಿಕ ಸಂಪರ್ಕ, ಹಾಲು, ದ್ರವ ಪದಾರ್ಥಗಳು, ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಹಾಗೂ ಹೋಟೆಲ್ ಉದ್ಯಮದಲ್ಲಿ ಪ್ರಗತಿ.',
      hi: 'जनसंपर्क, जल/दुग्ध व्यापार, कला, साहित्य एवं औषधि क्षेत्र में विशेष प्रगति।'
    },
    healthWellness: {
      en: 'Good emotional resilience. Balance bodily kapha (cold/mucus) and maintain consistent sleep during lunar cycles.',
      kn: 'ಕಫ ಪ್ರಕೃತಿ, ಶೀತ ಹಾಗೂ ನಿದ್ರಾಹೀನತೆಯ ಬಗ್ಗೆ ಮುನ್ನೆಚ್ಚರಿಕೆ. ಧ್ಯಾನದಿಂದ ಮನಸ್ಸು ಪ್ರಶಾಂತವಾಗಿರುತ್ತದೆ.',
      hi: 'कफ विकार व सर्दी से बचाव रखें। ध्यान व प्राणायाम से मानसिक संतुलन बनाए रखें।'
    },
    spiritualFocus: {
      en: 'Devi Lalita Tripurasundari worship, Shiva Chandrashekhara dhyana, and milk abhishekam on Mondays.',
      kn: 'ಸೋಮವಾರ ಶ್ರೀ ಚಂದ್ರಮೌಳೀಶ್ವರ ಪೂಜೆ, ಲಲಿತಾ ಸಹಸ್ರನಾಮ ಪಠಣ ಹಾಗೂ ಕ್ಷೀರಾಭಿಷೇಕ.',
      hi: 'सोमवार को भगवान चन्द्रमौलीश्वर का दुग्धाभिषेक एवं ललिता सहस्रनाम पाठ।'
    },
    recommendedRemedies: {
      en: 'Chant Om Shram Shrim Shraum Sah Chandraya Namah. Wear pearl (Mukta) or white clothes on Mondays.',
      kn: 'ಓಂ ಶ್ರಾಂ ಶ್ರೀಂ ಶ್ರೌಂ ಸಃ ಚಂದ್ರಾಯ ನಮಃ ಜಪಿಸಿ; ಮುತ್ತು ಅಥವಾ ಬಿಳಿ ವಸ್ತ್ರ ಧಾರಣೆ.',
      hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः का जप करें एवं श्वेत वस्त्र धारण करें।'
    }
  },
  Mars: {
    mahadashaLord: 'Mars',
    archetype: { en: 'The Courageous Commander & Kinetic Fire (Bhratrikaraka)', kn: 'ಧೈರ್ಯ, ಶೌರ್ಯ ಹಾಗೂ ಭೂಕಾರಕ ಮಂಗಳ', hi: 'पराक्रम, शौर्य एवं भूमिपुत्र मंगल' },
    governedAreas: { en: 'Physical vitality, real estate, engineering, siblings, surgical precision', kn: 'ದೈಹಿಕ ಶಕ್ತಿ, ಭೂಮಿ, ಇಂಜಿನಿಯರಿಂಗ್, ಒಡಹುಟ್ಟಿದವರು', hi: 'शारीरिक बल, भूमि, तकनीक, भ्रातृ सुख, साहस' },
    generalEffects: {
      en: 'A decisive phase marked by intense ambition, conquest of hurdles, property acquisition, and bold initiative. Requires channeling anger into focused discipline.',
      kn: 'ಅದ್ಭುತ ಶೌರ್ಯ, ಶತ್ರುಜಯ, ನೂತನ ಆಸ್ತಿ-ಭೂಮಿ ಖರೀದಿ ಹಾಗೂ ಮಹತ್ವಾಕಾಂಕ್ಷೆಗಳ ಸಿದ್ಧಿ.',
      hi: 'अदम्य साहस, शत्रु विजय, भूमि-भवन क्रय एवं तकनीकी कार्यों में विशेष उपलब्धि।'
    },
    careerFinance: {
      en: 'Unstoppable progress in construction, armed forces, surgery, software infrastructure, and real estate speculation.',
      kn: 'ನಿರ್ಮಾಣ, ಇಂಜಿನಿಯರಿಂಗ್, ಪೊಲೀಸ್/ರಕ್ಷಣೆ, ಕ್ರೀಡೆ ಹಾಗೂ ರಿಯಲ್ ಎಸ್ಟೇಟ್‌ನಲ್ಲಿ ಭಾರೀ ಲಾಭ.',
      hi: 'निर्माण, रक्षा, शल्य चिकित्सा, खेल एवं रियल एस्टेट में आशातीत सफलता।'
    },
    healthWellness: {
      en: 'Muscular stamina and metabolic fire peak. Protect from blood pressure spikes, inflammatory burns, or rash driving.',
      kn: 'ಸ್ನಾಯು ಶಕ್ತಿ ಹೆಚ್ಚಳ. ರಕ್ತದೊತ್ತಡ, ಉಷ್ಣತೆ ಹಾಗೂ ವಾಹನ ಚಾಲನೆಯಲ್ಲಿ ಜಾಗರೂಕತೆ ಅತ್ಯಗತ್ಯ.',
      hi: 'मांसपेशीय बल में वृद्धि। रक्तचाप एवं अग्नि/वाहन दुर्घटनाओं से सतर्कता बरतें।'
    },
    spiritualFocus: {
      en: 'Sri Subrahmanya (Kartikeya) and Lord Hanuman worship; Shiva Virabhadra Kavacha chanting.',
      kn: 'ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಹಾಗೂ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ; ವೀರಭದ್ರ ಸ್ವಾಮಿ ಆರಾಧನೆ.',
      hi: 'श्री कार्तिकेय एवं हनुमान चालीसा पाठ; वीरभद्र कवच का नित्य पठन।'
    },
    recommendedRemedies: {
      en: 'Chant Om Kram Krim Kraum Sah Bhaumaya Namah. Donate red lentils (masoor dal) on Tuesdays.',
      kn: 'ಮಂಗಳವಾರ ತೊಗರಿಬೇಳೆ ಅಥವಾ ಕೆಂಪು ವಸ್ತ್ರ ದಾನ ಮಾಡಿ; ಹವಳ ಧಾರಣೆ.',
      hi: 'मंगलवार को मसूर दाल व गुड़ का दान करें एवं मूंगा रत्न धारण करें।'
    }
  },
  Rahu: {
    mahadashaLord: 'Rahu',
    archetype: { en: 'The Cosmic Transformer & Ambition Catalyst (Chhaya Graha)', kn: 'ಮಾಯಾಕಾರಕ, ವಿದೇಶ ಯಾನ ಹಾಗೂ ಕ್ರಾಂತಿಕಾರಕ ರಾಹು', hi: 'मायावी, विदेशी संबंध एवं क्रांतिकारी राहु' },
    governedAreas: { en: 'Modern technologies, foreign affairs, unconventional paths, research', kn: 'ತಂತ್ರಜ್ಞಾನ, ವಿದೇಶ ಸಂಪರ್ಕ, ಸಂಶೋಧನೆ, ಹಠಾತ್ ಧನಲಾಭ', hi: 'आधुनिक तकनीक, विदेश गमन, शोध, आकस्मिक लाभ' },
    generalEffects: {
      en: 'A transformative 18-year period of meteoric worldly rise, foreign connections, technological mastery, and psychological rewiring.',
      kn: 'ಹಠಾತ್ ಪ್ರಗತಿ, ವಿದೇಶ ಪ್ರಯಾಣ, ನವೀನ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಖ್ಯಾತಿ ಹಾಗೂ ಅನಿರೀಕ್ಷಿತ ಯಶಸ್ಸು.',
      hi: 'अप्रत्याशित उन्नति, वैदेशिक सफलता, तकनीकी नवाचार एवं जीवन में युगांतरकारी बदलाव।'
    },
    careerFinance: {
      en: 'Exponential growth in artificial intelligence, aviation, global commerce, cinema/media, and disruptive innovations.',
      kn: 'ಸಾಫ್ಟ್‌ವೇರ್, ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ, ಸಿನಿಮಾ, ಮಾಧ್ಯಮ ಹಾಗೂ ಜಾಗತಿಕ ರಫ್ತು ವ್ಯಾಪಾರದಲ್ಲಿ ಮುಂಚೂಣಿ.',
      hi: 'कृत्रिम बुद्धिमत्ता, सॉफ्टवेयर, मीडिया एवं बहुराष्ट्रीय कंपनियों में भारी विस्तार।'
    },
    healthWellness: {
      en: 'Guards against phobias, nervous hypersensitivity, and undiagnosed allergies. Grounding through daily pranayama is vital.',
      kn: 'ನರಮಂಡಲದ ದುರ್ಬಲತೆ ಮತ್ತು ಭ್ರಮೆಗಳಿಂದ ದೂರವಿರಲು ನಿಯಮಿತ ಯೋಗ-ಪ್ರಾಣಾಯಾಮ ಅನುಸರಿಸಿ.',
      hi: 'वायु विकार व अनिद्रा से बचें। नित्य भ्रामरी प्राणायाम व ध्यान अत्यंत आवश्यक।'
    },
    spiritualFocus: {
      en: 'Maa Durga worship, Sri Durga Saptashati recital, and Shiva Bhairava Ashtakam on Saturday evenings.',
      kn: 'ಶ್ರೀ ದುರ್ಗಾ ಸಪ್ತಶತೀ ಪಠಣ, ಕಾಲಭೈರವಾಷ್ಟಕ ಹಾಗೂ ನಾಗದೇವತೆಗಳ ಆರಾಧನೆ.',
      hi: 'माँ दुर्गा सप्तशती पाठ, कालभैरवाष्टक एवं राहु मन्त्र की नित्य एक माला।'
    },
    recommendedRemedies: {
      en: 'Chant Om Bhram Bhrim Bhraum Sah Rahave Namah. Offer black sesame seeds and blankets to the needy.',
      kn: 'ಕಪ್ಪು ಎಳ್ಳು ಮತ್ತು ಕಂಬಳಿ ದಾನ ಮಾಡಿ; ಗೋಮೇಧಿಕ ರತ್ನ ಸಲಹೆ ಮೇರೆಗೆ ಧಾರಣೆ.',
      hi: 'काले तिल व कम्बल का दान करें; राहु शान्ति हेतु दुर्गा चालीसा का पाठ करें।'
    }
  },
  Jupiter: {
    mahadashaLord: 'Jupiter',
    archetype: { en: 'The Divine Preceptor & Expansive Wisdom (Guru / Jivakaraka)', kn: 'ಜ್ಞಾನಕಾರಕ, ಪುತ್ರಕಾರಕ ಹಾಗೂ ಪರಮ ಕಲ್ಯಾಣಕಾರಕ ಗುರು', hi: 'ज्ञानकारक, पुत्रकारक एवं परम कल्याणकारी गुरु' },
    governedAreas: { en: 'Higher wisdom, dharma, progeny, wealth, spirituality, legal success', kn: 'ಉನ್ನತ ಜ್ಞಾನ, ಧರ್ಮ, ಸಂತಾನ, ಐಶ್ವರ್ಯ, ಸತ್ಕರ್ಮ', hi: 'वेद-वेदांग, धर्म, संतान, समृद्धि, सदाचार' },
    generalEffects: {
      en: 'A golden 16-year epoch of profound spiritual evolution, family prosperity, academic honors, auspicious ceremonies, and virtuous fortune.',
      kn: 'ಜೀವನದ ಸುವರ್ಣ ಕಾಲ; ಸದ್ಬುದ್ಧಿ, ಸಂತಾನ ಭಾಗ್ಯ, ಕೀರ್ತಿ, ಮದುವೆ-ಉಪನಯನ ಮುಂತಾದ ಶುಭ ಕಾರ್ಯಗಳ ಸಿದ್ಧಿ.',
      hi: 'जीवन का स्वर्णिम काल; विवेक, संतान सुख, तीर्थ यात्रा, मान-सम्मान एवं सर्वतोमुखी उन्नति।'
    },
    careerFinance: {
      en: 'Apex leadership in education, finance, jurisprudence, consulting, philosophy, and institutional management.',
      kn: 'ಶಿಕ್ಷಣ, ಕಾನೂನು, ಬ್ಯಾಂಕಿಂಗ್, ಆಡಳಿತ ಹಾಗೂ ಧಾರ್ಮಿಕ ಸಂಸ್ಥೆಗಳಲ್ಲಿ ಅತ್ಯುನ್ನತ ಮನ್ನಣೆ.',
      hi: 'शिक्षा, विधि, वित्त, परामर्श एवं उच्च प्रशासनिक सेवाओं में सर्वोच्च पद।'
    },
    healthWellness: {
      en: 'Protective against chronic illnesses. Monitor liver health, sugar metabolism, and avoid excessive weight gain.',
      kn: 'ಆರೋಗ್ಯ ಸುಧಾರಣೆ; ಯಕೃತ್ತು (ಲಿವರ್) ಮತ್ತು ಮಧುಮೇಹದ ನಿಯಂತ್ರಣಕ್ಕೆ ಸಾತ್ವಿಕ ಆಹಾರ ಸೇವಿಸಿ.',
      hi: 'आरोग्य की रक्षा; यकृत (लीवर) व मधुमेह पर नियंत्रण हेतु सात्विक आहार लें।'
    },
    spiritualFocus: {
      en: 'Guru Paduka Pooja, Sri Dakshinamurthy Stotra, Guru Gita, and Shiva Rudrabhisheka on Thursdays.',
      kn: 'ಗುರುವಾರ ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ ಸ್ತೋತ್ರ, ಗುರು ಚರಿತ್ರೆ ಪಾರಾಯಣ ಹಾಗೂ ಬ್ರಾಹ್ಮಣ-ಗುರು ಸೇವೆ.',
      hi: 'गुरुवार को श्री दक्षिणामूर्ति स्तोत्र, गुरु गीता पाठ एवं पीले पुष्पों से शिव पूजा।'
    },
    recommendedRemedies: {
      en: 'Chant Om Gram Grim Graum Sah Gurave Namah. Donate yellow grams (chana dal) and turmeric to temples.',
      kn: 'ಕಡಲೆಕಾಳು ಮತ್ತು ಅರಿಶಿನ ದಾನ ಮಾಡಿ; ಹಳದಿ ಪುಷ್ಯರಾಗ ರತ್ನ ಧಾರಣೆ.',
      hi: 'चने की दाल, हल्दी व पीत वस्त्र का दान करें; पुखराज रत्न धारण करें।'
    }
  },
  Saturn: {
    mahadashaLord: 'Saturn',
    archetype: { en: 'The Great Taskmaster & Karmic Balancer (Ayushkaraka / Shani)', kn: 'ಆಯುಷ್ಯಕಾರಕ, ಕರ್ಮಫಲದಾತ ಹಾಗೂ ನ್ಯಾಯಾಧೀಶ ಶನಿ', hi: 'आयुष्कारक, कर्मफलदाता एवं न्यायप्रिय शनि' },
    governedAreas: { en: 'Longevity, discipline, perseverance, democracy, structural foundation', kn: 'ಆಯಸ್ಸು, ಕಠಿಣ ಪರಿಶ್ರಮ, ವಿನಮ್ರತೆ, ಸೇವೆ, ನ್ಯಾಯ', hi: 'दीर्घायु, अनुशासन, धैर्य, जनसेवा, न्याय' },
    generalEffects: {
      en: 'A transformative 19-year cycle establishing enduring bedrock foundations. Rewards meticulous integrity and patience while dismantling vanity.',
      kn: 'ಆಳವಾದ ಕರ್ಮ ಪರಿಪಾಕ; ತಾಳ್ಮೆ, ಸತತ ಪರಿಶ್ರಮ, ಶಾಶ್ವತ ಆಸ್ತಿ ನಿರ್ಮಾಣ ಹಾಗೂ ಕಷ್ಟಗಳನ್ನು ಮೆಟ್ಟಿ ನಿಲ್ಲುವ ಶಕ್ತಿ.',
      hi: 'स्थाई नींव का निर्माण; धैर्य, कठोर श्रम का प्रतिफल, न्यायप्रियता एवं अहंकार का शमन।'
    },
    careerFinance: {
      en: 'Tremendous long-term gains in heavy manufacturing, mining, agriculture, law, governance, and organized labor.',
      kn: 'ಕಾರ್ಖಾನೆಗಳು, ಗಣಿಗಾರಿಕೆ, ಕೃಷಿ, ನ್ಯಾಯಾಂಗ ಹಾಗೂ ದೀರ್ಘಾವಧಿ ಹೂಡಿಕೆಗಳಲ್ಲಿ ಅಪಾರ ಯಶಸ್ಸು.',
      hi: 'भारी उद्योग, खनन, कृषि, वकालत एवं सार्वजनिक उपक्रमों में दीर्घकालिक लाभ।'
    },
    healthWellness: {
      en: 'Longevity is bolstered. Guard joint flexibility, lumbar spine alignment, and nerve calm through gentle daily Vrikshasana.',
      kn: 'ಕೀಲುಗಳು, ಮೊಣಕಾಲು ಮತ್ತು ವಾತ ದೋಷವನ್ನು ಸಮತೋಲನದಲ್ಲಿಡಲು ಎಳ್ಳೆಣ್ಣೆ ಅಭ್ಯಂಜನ ಮಾಡಿ.',
      hi: 'संधि-वात (जोड़ों का दर्द) से बचाव हेतु तिल के तेल की मालिश व योगाभ्यास करें।'
    },
    spiritualFocus: {
      en: 'Shani Shanti Stotra, Sri Hanuman Chalisa, and Lord Shiva as Mahakala on Saturdays.',
      kn: 'ಶನಿವಾರ ಶ್ರೀ ಆಂಜನೇಯ ಸ್ವಾಮಿಗೆ ವಡೆಮಾಲೆ ಅರ್ಪಣೆ, ದಶರಥಕೃತ ಶನಿ ಸ್ತೋತ್ರ ಪಠಣ.',
      hi: 'शनिवार को हनुमान जी को सिन्दूर अर्पण, दशरथकृत शनि स्तोत्र एवं दीपदान।'
    },
    recommendedRemedies: {
      en: 'Chant Om Pram Prim Praum Sah Shanaischaraya Namah. Light sesame oil lamps on Saturday evenings.',
      kn: 'ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಬೆಳಗಿಸಿ, ಕಪ್ಪು ಬಟ್ಟೆ ಅಥವಾ ಕಬ್ಬಿಣದ ವಸ್ತುಗಳನ್ನು ದಾನ ಮಾಡಿ; ನೀಲಮಣಿ ಧಾರಣೆ.',
      hi: 'शनिवार संध्या तिल के तेल का दीप प्रज्वलित करें; काले उड़द व कम्बल का दान करें।'
    }
  },
  Mercury: {
    mahadashaLord: 'Mercury',
    archetype: { en: 'The Intellectual Prince & Analytical Commerce (Budha / Matikaraka)', kn: 'ಬುದ್ಧಿಕಾರಕ, ವಾಕ್ಚಾತುರ್ಯ ಹಾಗೂ ವಾಣಿಜ್ಯಕಾರಕ ಬುಧ', hi: 'बुद्धिकारक, वाकपटुता एवं व्यापारकारक बुध' },
    governedAreas: { en: 'Intellect, communication, trade, mathematics, writing, nervous system', kn: 'ಬುದ್ಧಿಶಕ್ತಿ, ಸಂವಹನ, ವಾಣಿಜ್ಯ, ಗಣಿತ, ಲೇಖನ, ನರಗಳು', hi: 'बुद्धि, वाणी, व्यापार, गणित, लेखन, तंत्रिका तंत्र' },
    generalEffects: {
      en: 'A vibrant 17-year period of intellectual brilliance, flourishing trade, eloquent speech, and successful scholarly endeavors.',
      kn: 'ತೀಕ್ಷ್ಣ ಬುದ್ಧಿಮತ್ತೆ, ವ್ಯಾಪಾರ-ವ್ಯವಹಾರದಲ್ಲಿ ಅಭಿವೃದ್ಧಿ, ಉತ್ತಮ ಮಾತುಗಾರಿಕೆ ಹಾಗೂ ವಿದ್ಯಾಭ್ಯಾಸದಲ್ಲಿ ಜಯ.',
      hi: 'प्रखर बुद्धि, व्यापारिक सफलता, मधुर वाणी एवं बौद्धिक कार्यों में यश।'
    },
    careerFinance: {
      en: 'Booming prosperity in banking, software programming, accounting, journalism, publishing, and digital marketing.',
      kn: 'ಬ್ಯಾಂಕಿಂಗ್, ಲೆಕ್ಕಪತ್ರ, ಸಾಫ್ಟ್‌ವೇರ್, ಪತ್ರಿಕೋದ್ಯಮ ಹಾಗೂ ಷೇರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗಣನೀಯ ಲಾಭ.',
      hi: 'बैंकिंग, सॉफ्टवेयर, सीए, पत्रकारिता, प्रकाशन एवं शेयर बाजार में प्रचुर लाभ।'
    },
    healthWellness: {
      en: 'Alert mental agility. Balance nervous tension, skin radiance, and respiratory clarity with deep alternate-nostril pranayama.',
      kn: 'ನರಮಂಡಲದ ಸ್ಥಿರತೆ ಹಾಗೂ ಚರ್ಮದ ರಕ್ಷಣೆಗಾಗಿ ಅನುಲೋಮ-ವಿಲೋಮ ಪ್ರಾಣಾಯಾಮ ಶ್ರೇಷ್ಠ.',
      hi: 'त्वचा व तंत्रिका तंत्र की सुरक्षा; अनुलोम-विलोम प्राणायाम से मानसिक शांति रखें।'
    },
    spiritualFocus: {
      en: 'Maha Vishnu Sahasranama recital and Shiva Medhadakshinamurthy aradhana on Wednesdays.',
      kn: 'ಬುಧವಾರ ಶ್ರೀ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ, ತುಳಸಿ ಅರ್ಚನೆ ಹಾಗೂ ಮೇಧಾದಕ್ಷಿಣಾಮೂರ್ತಿ ಜಪ.',
      hi: 'बुधवार को विष्णु सहस्रनाम पाठ, तुलसी दल अर्पण एवं मेधा-दक्षिणामूर्ति ध्यान।'
    },
    recommendedRemedies: {
      en: 'Chant Om Bram Brim Braum Sah Budhaya Namah. Feed green grass to cows on Wednesdays; wear Emerald (Marakata).',
      kn: 'ಹಸುವಿಗೆ ಹಸಿರು ಹುಲ್ಲು ನೀಡಿ; ಹೆಸರುಕಾಳು ದಾನ ಮಾಡಿ; ಪಚ್ಚೆ ರತ್ನ ಧಾರಣೆ.',
      hi: 'गौमाता को हरा चारा खिलाएं; मूंग दाल का दान करें एवं पन्ना रत्न धारण करें।'
    }
  },
  Ketu: {
    mahadashaLord: 'Ketu',
    archetype: { en: 'The Spiritual Ascetic & Liberation Catalyst (Mokshakaraka)', kn: 'ಮೋಕ್ಷಕಾರಕ, ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ ಹಾಗೂ ಜ್ಞಾನದಾತ ಕೇತು', hi: 'मोक्षकारक, वैराग्य एवं आध्यात्मिक चेतना केतु' },
    governedAreas: { en: 'Spiritual liberation, occult wisdom, intuition, detachment, spine base', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ವಿಮೋಚನೆ, ಗೂಢವಿದ್ಯೆ, ವೈರಾಗ್ಯ, ಮೂಲಾಧಾರ', hi: 'मोक्ष, गूढ़ विद्या, अंतर्मुखी साधना, वैराग्य' },
    generalEffects: {
      en: 'A 7-year introspective phase breaking material delusions, unlocking latent mystical insights, and reorienting life toward higher spiritual moksha.',
      kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಪರಿವರ್ತನೆ, ಆಂತರಿಕ ಶಾಂತಿ, ಲೌಕಿಕ ವ್ಯಾಮೋಹದಿಂದ ಮುಕ್ತಿ ಹಾಗೂ ಗೂಢಜ್ಞಾನ ಪ್ರಾಪ್ತಿ.',
      hi: 'आध्यात्मिक जागृति, मानसिक शांति, भौतिक भ्रमों से मुक्ति एवं गूढ़ ज्ञान की प्राप्ति।'
    },
    careerFinance: {
      en: 'Success in research, occult astrology, biotechnology, psychology, and quiet behind-the-scenes strategy.',
      kn: 'ಸಂಶೋಧನೆ, ಜ್ಯೋತಿಷ್ಯ, ಆಯುರ್ವೇದ, ತತ್ವಜ್ಞಾನ ಹಾಗೂ ರಹಸ್ಯ ಯೋಜನೆಗಳಲ್ಲಿ ಯಶಸ್ಸು.',
      hi: 'शोध कार्य, ज्योतिष, आयुर्वेद, दर्शन एवं रणनीतिक परामर्श में विशेष ख्याति।'
    },
    healthWellness: {
      en: 'Protects intuition. Watch for gastrointestinal digestion swings and subtle joint aches; grounded yoga practice restores harmony.',
      kn: 'ಜೀರ್ಣಾಂಗ ಕ್ರಿಯೆ ಮತ್ತು ವಾತ ದೋಷ ನಿಯಂತ್ರಣಕ್ಕೆ ಸಾತ್ವಿಕ ಜೀವನಶೈಲಿ ಅನುಸರಿಸಿ.',
      hi: 'उदर विकार व सूक्ष्म पीड़ा से बचाव हेतु सात्विक दिनचर्या व प्राणायाम अपनाएं।'
    },
    spiritualFocus: {
      en: 'Lord Ganesha Atharvashirsha chanting and Lord Shiva Kapalishwara worship.',
      kn: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಪಠಣ, ಗಣೇಶನಿಗೆ ಗರಿಕೆಯಿಂದ ಅರ್ಚನೆ ಹಾಗೂ ಶಿವಪೂಜೆ.',
      hi: 'भगवान गणेश को दूर्वा अर्पण, अथर्वशीर्ष पाठ एवं कैवल्योपनिषद् का मनन।'
    },
    recommendedRemedies: {
      en: 'Chant Om Sram Srim Sraum Sah Ketave Namah. Feed stray dogs and donate multi-colored blankets.',
      kn: 'ನಾಯಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ; ಬಹುಬಣ್ಣದ ಕಂಬಳಿ ದಾನ ಮಾಡಿ; ವೈಢೂರ್ಯ ರತ್ನ ಧಾರಣೆ.',
      hi: 'श्वानों को भोजन दें; चितकबरा कम्बल दान करें एवं लहसुनिया रत्न धारण करें।'
    }
  },
  Venus: {
    mahadashaLord: 'Venus',
    archetype: { en: 'The Cosmic Beauty, Love & Prosperity (Shukra / Kalatrakaraka)', kn: 'ಸೌಂದರ್ಯ, ಕಲೆ, ಪ್ರೇಮ ಹಾಗೂ ಸಂಪತ್ಕಾರಕ ಶುಕ್ರ', hi: 'सौंदर्य, कला, प्रेम एवं समृद्धि कारक शुक्र' },
    governedAreas: { en: 'Marital bliss, wealth, vehicles, luxury, fine arts, endocrine balance', kn: 'ವಿವಾಹ ಸುಖ, ವಾಹನ, ಆಭರಣ, ಸಂಗೀತ, ಕಲೆ, ರಸಧಾತು', hi: 'वैवाहिक सुख, वाहन, आभूषण, ललित कलाएं, धन' },
    generalEffects: {
      en: 'A lavish 20-year period of sensory refinement, romantic union, opulent acquisitions, artistic renown, and universal joy.',
      kn: 'ವೈಭವೋಪೇತ ಜೀವನ; ಸುಖ-ಸಂತೋಷ, ನೂತನ ವಾಹನ-ಗೃಹ ಖರೀದಿ, ಕೀರ್ತಿ ಹಾಗೂ ರಮಣೀಯ ದಾಂಪತ್ಯ.',
      hi: 'वैभवशाली जीवन; भौतिक सुख-सुविधाएं, वाहन लाभ, कलात्मक ख्याति एवं सुखद दांपत्य।'
    },
    careerFinance: {
      en: 'Immense prosperity in luxury goods, fashion, jewelry, hospitality, entertainment, architecture, and international commerce.',
      kn: 'ಫ್ಯಾಶನ್, ಆಭರಣ, ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಹೋಟೆಲ್, ಚಲನಚಿತ್ರ ಹಾಗೂ ಸುಗಂಧ ದ್ರವ್ಯಗಳಲ್ಲಿ ಅತ್ಯಧಿಕ ಲಾಭ.',
      hi: 'वस्त्र, आभूषण, सौंदर्य प्रसाधन, मनोरंजन, होटल एवं विलासिता व्यापार में अपार लाभ।'
    },
    healthWellness: {
      en: 'Radiant somatic vitality and hormonal balance. Maintain moderation in sugary rich foods and hydrate adequately.',
      kn: 'ದೇಹಕ್ಕೆ ತೇಜಸ್ಸು ಹಾಗೂ ಕಾಂತಿ; ಮಧುಮೇಹ ಮತ್ತು ಮೂತ್ರಪಿಂಡದ ಆರೋಗ್ಯಕ್ಕೆ ನಿಯಮಿತ ನೀರು ಕುಡಿಯಿರಿ.',
      hi: 'शारीरिक कान्ति में वृद्धि; अत्यधिक मिष्ठान्न से बचें एवं जल का समुचित सेवन करें।'
    },
    spiritualFocus: {
      en: 'Sri Mahalakshmi Ashtakam, Sri Suktam recital, and Lalita Sahasranama on Fridays.',
      kn: 'ಶುಕ್ರವಾರ ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ ಅಷ್ಟಕ, ಶ್ರೀಸೂಕ್ತ ಪಾರಾಯಣ ಹಾಗೂ ಕಮಲದ ಹೂವಿನಿಂದ ಅರ್ಚನೆ.',
      hi: 'शुक्रवार को श्री सूक्त पाठ, महालक्ष्मी अष्टकम एवं श्वेत पुष्पों से भगवती की अर्चना।'
    },
    recommendedRemedies: {
      en: 'Chant Om Dram Drim Draum Sah Shukraya Namah. Donate white sweets, rice, or ghee to women on Fridays; wear Diamond or White Zircon.',
      kn: 'ಶುಕ್ರವಾರ ಅಕ್ಕಿ, ಸಕ್ಕರೆ ಅಥವಾ ತುಪ್ಪ ದಾನ ಮಾಡಿ; ವಜ್ರ ಅಥವಾ ಬಿಳಿ ಜಿರ್ಕಾನ್ ಧಾರಣೆ.',
      hi: 'शुक्रवार को चावल, खीर व मिश्री का दान करें; हीरा अथवा श्वेत ओपल धारण करें।'
    }
  }
};

// Interpretive synthesizer for Mahadasha + Antardasha
export const getDashaAntardashaSynthesis = (
  mahaLord: string,
  antarLord: string,
  lang?: Language
): AntardashaEffectSummary => {
  const comboKey = `${mahaLord}-${antarLord}`;

  // Check planetary relationship
  const friendlyPairs = [
    'Sun-Moon', 'Moon-Sun', 'Sun-Mars', 'Mars-Sun', 'Sun-Jupiter', 'Jupiter-Sun',
    'Moon-Mars', 'Mars-Moon', 'Moon-Jupiter', 'Jupiter-Moon',
    'Mercury-Venus', 'Venus-Mercury', 'Saturn-Mercury', 'Mercury-Saturn',
    'Saturn-Venus', 'Venus-Saturn', 'Jupiter-Mars', 'Mars-Jupiter'
  ];

  const enemyPairs = [
    'Sun-Saturn', 'Saturn-Sun', 'Sun-Venus', 'Venus-Sun', 'Sun-Rahu', 'Rahu-Sun',
    'Moon-Rahu', 'Rahu-Moon', 'Moon-Ketu', 'Ketu-Moon', 'Mars-Mercury', 'Mercury-Mars',
    'Jupiter-Venus', 'Venus-Jupiter'
  ];

  let relationship: AntardashaEffectSummary['relationship'] = 'Neutral';
  if (mahaLord === antarLord) {
    relationship = 'Karmic Integration';
  } else if (friendlyPairs.includes(comboKey)) {
    relationship = 'Friendly';
  } else if (enemyPairs.includes(comboKey)) {
    relationship = 'Adversarial';
  }

  const relNames: Record<string, LocalizedString> = {
    Friendly: { en: 'Friendly Harmony (Mitra)', kn: 'ಮಿತ್ರ ಸಂಬಂಧ (ಅತ್ಯಂತ ಶುಭ)', hi: 'मित्र संबंध (परम शुभ)' },
    Neutral: { en: 'Balanced Synergy (Sama)', kn: 'ಸಮ ಸಂಬಂಧ (ಸಾಧಾರಣ ಶುಭ)', hi: 'सम संबंध (संतुलित)' },
    Adversarial: { en: 'Karmic Friction (Shatru)', kn: 'ಶತ್ರು ಘರ್ಷಣೆ (ಶಾಂತಿ ಅಗತ್ಯ)', hi: 'शत्रु संबंध (शांति आवश्यक)' },
    'Karmic Integration': { en: 'Sva-Bhukti (Self Awakening)', kn: 'ಸ್ವಭುಕ್ತಿ (ಮೂಲ ಸಂಕಲ್ಪ)', hi: 'स्वभुक्ति (आरंभिक प्रभाव)' }
  };

  const getSynthesisText = (): LocalizedString => {
    if (mahaLord === antarLord) {
      return {
        en: `The initial foundation period of ${mahaLord} Mahadasha. Concentrated cosmic energy of ${mahaLord} takes center stage, setting the trajectory for the entire major cycle.`,
        kn: `${mahaLord} ಮಹಾದಶೆಯ ಆರಂಭಿಕ ಹಂತ. ${mahaLord} ಗ್ರಹದ ಸಂಪೂರ್ಣ ಪ್ರಭಾವ ನಿಮ್ಮ ಜೀವನದ ಪ್ರಮುಖ ನಿರ್ಧಾರಗಳನ್ನು ರೂಪಿಸುತ್ತದೆ.`,
        hi: `${mahaLord} महादशा का प्रारंभिक संक्रांति काल। ${mahaLord} की ऊर्जा संपूर्ण जीवन की दिशा तय करती है।`
      };
    }
    if (relationship === 'Friendly') {
      return {
        en: `Highly harmonious fusion of ${mahaLord} and ${antarLord}. The foundational energy of ${mahaLord} receives graceful amplification and collaborative support from ${antarLord}, producing rapid progress and peace.`,
        kn: `${mahaLord} ಮತ್ತು ${antarLord} ಗ್ರಹಗಳ ಅತ್ಯದ್ಭುತ ಮಿತ್ರಕೂಟ. ಮಹಾದಶಾಧಿಪತಿಯ ಸಂಕಲ್ಪಕ್ಕೆ ಅಂತರ್ದಶಾಧಿಪತಿಯ ಪೂರ್ಣ ಬೆಂಬಲ ಸಿಕ್ಕು ಇಷ್ಟಾರ್ಥಗಳು ಸಿದ್ಧಿಸುತ್ತವೆ.`,
        hi: `${mahaLord} एवं ${antarLord} का परम कल्याणकारी समन्वय। दोनों ग्रहों की मैत्री से कार्यों में शीघ्र सफलता व मानसिक उल्लास रहता है।`
      };
    }
    if (relationship === 'Adversarial') {
      return {
        en: `A period of dynamic tension requiring maturity. The inherent nature of ${mahaLord} meets contrasting demands from ${antarLord}. Requires patience, diplomatic tact, and conscious remedial alignment.`,
        kn: `${mahaLord} ಮತ್ತು ${antarLord} ನಡುವಿನ ವಿರೋಧಾತ್ಮಕ ಪ್ರಭಾವ. ತಾಳ್ಮೆ, ವಿವೇಕ ಹಾಗೂ ವೈದಿಕ ಶಾಂತಿ ಮಂತ್ರಗಳ ಪಠಣದಿಂದ ಸಂಭವನೀಯ ಅಡೆತಡೆಗಳು ನಿವಾರಣೆಯಾಗುತ್ತವೆ.`,
        hi: `${mahaLord} एवं ${antarLord} का विरोधाभासी प्रभाव। धैर्य, कूटनीतिक संयम एवं वैदिक मन्त्रानुष्ठान से प्रतिकूलताओं का शमन होता है।`
      };
    }
    return {
      en: `A steady, balanced phase where ${mahaLord} and ${antarLord} operate with pragmatic equilibrium. Progress is earned through disciplined effort and consistent routine.`,
      kn: `${mahaLord} ಮತ್ತು ${antarLord} ಗ್ರಹಗಳ ಸಮತೋಲಿತ ಅವಧಿ. ನಿರಂತರ ಪ್ರಯತ್ನ ಮತ್ತು ಕ್ರಮಬದ್ಧ ಪರಿಶ್ರಮದಿಂದ ಸ್ಥಿರ ಯಶಸ್ಸು ದೊರೆಯುತ್ತದೆ.`,
      hi: `${mahaLord} एवं ${antarLord} की संतुलित युति। निरंतर परिश्रम एवं नियमित दिनचर्या से स्थाई लाभ प्राप्त होगा।`
    };
  };

  return {
    comboKey,
    relationship,
    relationshipName: relNames[relationship],
    synthesis: getSynthesisText(),
    opportunities: {
      en: `Expansion in areas governed by both lords; strategic planning and consolidation.`,
      kn: `ಉಭಯ ಗ್ರಹಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ನೂತನ ಅವಕಾಶಗಳು ಹಾಗೂ ಆರ್ಥಿಕ ಸಬಲತೆ.`,
      hi: `दोनों ग्रहों के स्वामित्व वाले क्षेत्रों में नए अवसर एवं आर्थिक सुदृढ़ता।`
    },
    cautions: {
      en: `Avoid hasty financial commitments; maintain equilibrium in personal communications.`,
      kn: `ಅನಗತ್ಯ ಸಾಲ ಮತ್ತು ಆತುರದ ನಿರ್ಧಾರಗಳನ್ನು ತಪ್ಪಿಸಿ; ಕುಟುಂಬದಲ್ಲಿ ಸೌಹಾರ್ದತೆ ಕಾಪಾಡಿ.`,
      hi: `जल्दबाजी में वित्तीय निर्णय न लें; पारिवारिक संवाद में मधुरता बनाए रखें।`
    },
    prescribedUpaya: {
      en: `Offer Bilva patra to Lord Shiva, recite Mahamrityunjaya Mantra 11 times daily, and perform Dana for ${antarLord}.`,
      kn: `ಪ್ರತಿದಿನ ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ೧೧ ಬಾರಿ ಜಪಿಸಿ; ಶಿವನಿಗೆ ಬಿಲ್ವಪತ್ರೆ ಸಮರ್ಪಿಸಿ ಮತ್ತು ${antarLord} ಗ್ರಹದ ದಾನ ಮಾಡಿ.`,
      hi: `नित्य ११ बार महामृत्युंजय मन्त्र का जप करें, शिवलिंग पर बिल्वपत्र चढ़ाएं एवं ${antarLord} का दान करें।`
    }
  };
};
