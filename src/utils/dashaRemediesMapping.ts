import { LocalizedString } from '../types';

export interface DashaRemedyPackage {
  lordName: string;
  sanskritName: LocalizedString;
  vedicDeity: LocalizedString;
  beejaMantra: string;
  gayatriMantra: string;
  recommendedJapaCount: number;
  japaMala: LocalizedString;
  fastingDay: LocalizedString;
  prescribedRituals: {
    name: LocalizedString;
    description: LocalizedString;
    frequency: LocalizedString;
  }[];
  gemstoneRemedy: {
    name: LocalizedString;
    metal: LocalizedString;
    finger: LocalizedString;
  };
  rudrakshaRemedy: {
    mukhi: number;
    benefits: LocalizedString;
  };
  charityRemedy: {
    items: LocalizedString;
    recipient: LocalizedString;
    bestDay: LocalizedString;
  };
}

export const DASHA_REMEDIES_LIBRARY: Record<string, DashaRemedyPackage> = {
  Sun: {
    lordName: 'Sun',
    sanskritName: { en: 'Surya (Sun)', kn: 'ಸೂರ್ಯ (ರವಿ)', hi: 'सूर्य' },
    vedicDeity: { en: 'Lord Surya Narayana & Gayatri Devi', kn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ & ಗಾಯತ್ರೀ ದೇವಿ', hi: 'श्री सूर्यनारायण एवं गायत्री' },
    beejaMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    gayatriMantra: 'ॐ आदित्याय विद्महे मार्तण्डाय धीमहि तन्नो सूर्यः प्रचोदयात्',
    recommendedJapaCount: 7000,
    japaMala: { en: 'Red Sandalwood or Rudraksha (108 beads)', kn: 'ರಕ್ತ ಚಂದನದ ಮಾಲೆ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ', hi: 'रक्त चन्दन अथवा रुद्राक्ष' },
    fastingDay: { en: 'Sundays (Ravivara Vrata)', kn: 'ಭಾನುವಾರ (ರವಿವಾರ ವ್ರತ)', hi: 'रविवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Aditya Hridaya Stotra Parayana', kn: 'ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಾರಾಯಣ', hi: 'आदित्य हृदय स्तोत्र पाठ' },
        description: { en: 'Recite at sunrise after offering copper vessel water arghya to dispel career obstacles and heart weaknesses.', kn: 'ಮುಂಜಾನೆ ಸೂರ್ಯನಿಗೆ ತಾಮ್ರ ಪಾತ್ರೆಯಿಂದ ಅರ್ಘ್ಯ ನೀಡಿ ಪಠಿಸಿ; ಉದ್ಯೋಗ ಅಡೆತಡೆಗಳು ನಿವಾರಣೆಯಾಗುತ್ತವೆ.', hi: 'प्रातः तांबे के लोटे से सूर्य को जल देकर नित्य पाठ करें।' },
        frequency: { en: 'Daily at dawn', kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯೋದಯಕ್ಕೆ', hi: 'नित्य प्रातःकाल' }
      },
      {
        name: { en: 'Surya Shanti Homa & Gayatri Japa', kn: 'ಸೂರ್ಯ ಶಾಂತಿ ಹೋಮ & ಗಾಯತ್ರೀ ಜಪ', hi: 'सूर्य शान्ति होम एवं गायत्री जप' },
        description: { en: 'Perform sacred fire ritual using Samidha of Arka (Ekkada) wood for paternal blessings and royal honors.', kn: 'ಎಕ್ಕದ ಸಮಿಧೆಯಿಂದ ಹೋಮ ನಡೆಸಿ ಪಿತೃ ದೋಷ ನಿವಾರಣೆ ಮತ್ತು ರಾಜ ಸನ್ಮಾನ ಪಡೆಯಿರಿ.', hi: 'मदार की समिधा से हवन कर पितृ कृपा प्राप्त करें।' },
        frequency: { en: 'Once during Mahadasha / Shukla Paksha Sunday', kn: 'ಶುಕ್ಲ ಪಕ್ಷದ ಭಾನುವಾರ', hi: 'शुक्ल पक्ष रविवार' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Ruby (Manikya)', kn: 'ಮಾಣಿಕ್ಯ (Ruby)', hi: 'माणिक्य' },
      metal: { en: 'Pure Gold or Copper', kn: 'ಅಪರಂಜಿ ಚಿನ್ನ ಅಥವಾ ತಾಮ್ರ', hi: 'स्वर्ण अथवा तांबा' },
      finger: { en: 'Ring Finger (Right Hand)', kn: 'ಉಂಗುರದ ಬೆರಳು (ಅನಾಮಿಕಾ)', hi: 'अनामिका' }
    },
    rudrakshaRemedy: {
      mukhi: 1,
      benefits: { en: '1-Mukhi Rudraksha illuminates the soul with divine self-mastery.', kn: '೧-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ದೈವಿಕ ತೇಜಸ್ಸು ಮತ್ತು ನಾಯಕತ್ವ ನೀಡುತ್ತದೆ.', hi: 'आत्मबल एवं नेतृत्व शक्ति संवर्धन।' }
    },
    charityRemedy: {
      items: { en: 'Wheat, jaggery, copper coins, saffron cloth', kn: 'ಗೋಧಿ, ಬೆಲ್ಲ, ತಾಮ್ರದ ನಾಣ್ಯಗಳು, ಕೇಸರಿ ವಸ್ತ್ರ', hi: 'गेहूं, गुड़, तांबा, लाल वस्त्र' },
      recipient: { en: 'Needy temple priests or visually impaired persons', kn: 'ದೇವಸ್ಥಾನದ ಅರ್ಚಕರಿಗೆ ಅಥವಾ ದೃಷ್ಟಿ ಹೀನರಿಗೆ', hi: 'नेत्रहीन अथवा योग्य ब्राह्मण' },
      bestBestDay: { en: 'Sunday Morning before noon', kn: 'ಭಾನುವಾರ ಮಧ್ಯಾಹ್ನದೊಳಗೆ', hi: 'रविवार मध्याह्न से पूर्व' }
    } as any
  },
  Moon: {
    lordName: 'Moon',
    sanskritName: { en: 'Chandra (Moon)', kn: 'ಚಂದ್ರ (ಸೋಮ)', hi: 'चन्द्र' },
    vedicDeity: { en: 'Lord Shiva & Goddess Parvati', kn: 'ಪರಮೇಶ್ವರ ಮತ್ತು ಜಗನ್ಮಾತೆ ಪಾರ್ವತಿ', hi: 'भगवान शिव एवं माता पार्वती' },
    beejaMantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    gayatriMantra: 'ॐ क्षीरपुत्राय विद्महे अमृततत्त्वाय धीमहि तन्नो चन्द्रः प्रचोदयात्',
    recommendedJapaCount: 11000,
    japaMala: { en: 'Pearl or White Sphatika (Quartz)', kn: 'ಸ್ಪಟಿಕ ಮಾಲೆ ಅಥವಾ ಮುತ್ತಿನ ಮಾಲೆ', hi: 'स्फटिक अथवा मोती माला' },
    fastingDay: { en: 'Mondays (Somavara Vrata) & Purnima', kn: 'ಸೋಮವಾರ ವ್ರತ & ಹುಣ್ಣಿಮೆ', hi: 'सोमवार व्रत एवं पूर्णिमा' },
    prescribedRituals: [
      {
        name: { en: 'Ksheerabhisheka with Mahamrityunjaya Mantra', kn: 'ಕ್ಷೀರಾಭಿಷೇಕ & ಮಹಾಮೃತ್ಯುಂಜಯ ಜಪ', hi: 'दुग्धाभिषेक एवं महामृत्युंजय जप' },
        description: { en: 'Offer pure cow milk on Shiva Lingam to banish mental depression, anxiety, and sleeplessness.', kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಹಸುವಿನ ಹಾಲಿನಿಂದ ಅಭಿಷೇಕ ಮಾಡಿ ಮಾನಸಿಕ ಆತಂಕ ಮತ್ತು ನಿದ್ರಾಹೀನತೆ ಶಮನಗೊಳಿಸಿ.', hi: 'शिवलिंग पर कच्चा दूध अर्पित कर मानसिक शांति प्राप्त करें।' },
        frequency: { en: 'Every Monday morning', kn: 'ಪ್ರತಿ ಸೋಮವಾರ ಮುಂಜಾನೆ', hi: 'प्रत्येक सोमवार' }
      },
      {
        name: { en: 'Chandrashtaka Stotram', kn: 'ಚಂದ್ರಾಷ್ಟಕ ಸ್ತೋತ್ರ ಪಾರಾಯಣ', hi: 'चन्द्राष्टक स्तोत्र' },
        description: { en: 'Recite facing the Moon on waxing moon nights for emotional stability.', kn: 'ಶುಕ್ಲ ಪಕ್ಷದ ರಾತ್ರಿ ಚಂದ್ರನಿಗೆ ನಮಸ್ಕರಿಸಿ ಪಠಿಸಿ.', hi: 'पूर्णिमा की रात्रि में पाठ करें।' },
        frequency: { en: 'Every Purnima evening', kn: 'ಪ್ರತಿ ಹುಣ್ಣಿಮೆ ಸಂಜೆ', hi: 'पूर्णिमा सन्ध्या' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Natural Pearl (Mukta / Moti)', kn: 'ನೈಸರ್ಗಿಕ ಮುತ್ತು (Pearl)', hi: 'सच्चा मोती' },
      metal: { en: 'Pure Silver', kn: 'ಶುದ್ಧ ಬೆಳ್ಳಿ', hi: 'शुद्ध चांदी' },
      finger: { en: 'Little Finger (Right Hand)', kn: 'ಕಿರುಬೆರಳು (ಕನಿಷ್ಠಿಕಾ)', hi: 'कनिष्ठिका' }
    },
    rudrakshaRemedy: {
      mukhi: 2,
      benefits: { en: '2-Mukhi Rudraksha harmonizes mind and fosters affectionate relationships.', kn: '೨-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಮನಃಶಾಂತಿ ಮತ್ತು ಪ್ರೀತಿಯ ಬಾಂಧವ್ಯ ತರುತ್ತದೆ.', hi: 'मन की स्थिरता एवं मधुर संबंध।' }
    },
    charityRemedy: {
      items: { en: 'Raw white rice, milk, sugar, silver coin, white flowers', kn: 'ಬೆಳ್ತಿಗೆ ಅಕ್ಕಿ, ಹಾಲು, ಸಕ್ಕರೆ, ಬೆಳ್ಳಿ ನಾಣ್ಯ, ಬಿಳಿ ವಸ್ತ್ರ', hi: 'चावल, दूध, चीनी, चांदी, श्वेत वस्त्र' },
      recipient: { en: 'Elderly women, mothers, or needy widows', kn: 'ವಯೋವೃದ್ಧ ತಾಯಂದಿರಿಗೆ ಅಥವಾ ಬಡ ಮಹಿಳೆಯರಿಗೆ', hi: 'वृद्ध माताएं अथवा निर्धन महिलाएं' },
      bestDay: { en: 'Monday Evening', kn: 'ಸೋಮವಾರ ಸಂಜೆ', hi: 'सोमवार सायं' }
    }
  },
  Mars: {
    lordName: 'Mars',
    sanskritName: { en: 'Mangala / Kuja (Mars)', kn: 'ಮಂಗಳ (ಕುಜ)', hi: 'मंगल (भौम)' },
    vedicDeity: { en: 'Lord Kartikeya (Subrahmanya) & Lord Hanuman', kn: 'ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ & ಹನುಮಂತ ದೇವರು', hi: 'भगवान कार्तिकेय एवं हनुमान जी' },
    beejaMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    gayatriMantra: 'ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नೋ भौमः प्रचोदयात्',
    recommendedJapaCount: 10000,
    japaMala: { en: 'Red Coral or Red Sandalwood Mala', kn: 'ಹವಳದ ಮಾಲೆ ಅಥವಾ ರಕ್ತ ಚಂದನದ ಮಾಲೆ', hi: 'मूंगा अथवा रक्त चन्दन' },
    fastingDay: { en: 'Tuesdays (Mangalavara Vrata)', kn: 'ಮಂಗಳವಾರ ವ್ರತ', hi: 'मंगलवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Sundarakanda Parayana & Hanuman Sindoor Puja', kn: 'ಸುಂದರಕಾಂಡ ಪಾರಾಯಣ & ಸಿಂಧೂರ ಪೂಜೆ', hi: 'सुन्दरकाण्ड पाठ एवं सिन्दूर अर्पण' },
        description: { en: 'Recite Hanuman Chalisa and offer Jasmine oil with vermilion to eliminate debt, court cases, and enemies.', kn: 'ಋಣ-ಸಾಲ ಮುಕ್ತಿ, ಶತ್ರುನಾಶ ಮತ್ತು ಧೈರ್ಯ ವೃದ್ಧಿಗಾಗಿ ಹನುಮಂತನಿಗೆ ಸಿಂಧೂರ ಅರ್ಪಿಸಿ.', hi: 'ऋण मुक्ति एवं शत्रु पराजय हेतु सुन्दरकाण्ड पाठ करें।' },
        frequency: { en: 'Every Tuesday', kn: 'ಪ್ರತಿ ಮಂಗಳವಾರ', hi: 'प्रत्येक मंगलवार' }
      },
      {
        name: { en: 'Subrahmanya Trishati or Sarpa Shanti', kn: 'ಸುಬ್ರಹ್ಮಣ್ಯ ತ್ರಿಶತಿ ಅರ್ಚನೆ', hi: 'कार्तिकेय अभिषेक' },
        description: { en: 'Perform archana with red oleander flowers to neutralize Kuja Dosha and land disputes.', kn: 'ಕೆಂಪು ಕಣಗಲೆ ಹೂವುಗಳಿಂದ ಸುಬ್ರಹ್ಮಣ್ಯನಿಗೆ ಅರ್ಚನೆ ಮಾಡಿ ಆಸ್ತಿ ವಿವಾದ ಬಗೆಹರಿಸಿ.', hi: 'लाल पुष्पों से स्कन्द पूजा करें।' },
        frequency: { en: 'Monthly on Shashti Tithi', kn: 'ಸ್ಕಂದ ಷಷ್ಠಿ ದಿನದಂದು', hi: 'मासिक षष्ठी तिथि' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Red Coral (Moonga)', kn: 'ಕೆಂಪು ಹವಳ (Red Coral)', hi: 'लाल मूंगा' },
      metal: { en: 'Copper or Gold', kn: 'ತಾಮ್ರ ಅಥವಾ ಚಿನ್ನ', hi: 'तांबा अथवा स्वर्ण' },
      finger: { en: 'Ring Finger (Right Hand)', kn: 'ಉಂಗುರದ ಬೆರಳು (ಅನಾಮಿಕಾ)', hi: 'अनामिका' }
    },
    rudrakshaRemedy: {
      mukhi: 3,
      benefits: { en: '3-Mukhi Rudraksha purifies past sins and bestows dynamic energy.', kn: '೩-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಅಗ್ನಿ ತೇಜಸ್ಸು ಮತ್ತು ಸಾಹಸ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.', hi: 'ऊर्जा, उत्साह एवं पाप शमन।' }
    },
    charityRemedy: {
      items: { en: 'Toor dal (red lentils), copper utensils, jaggery, red sweets', kn: 'ತೊಗರಿ ಬೇಳೆ, ತಾಮ್ರದ ಪಾತ್ರೆಗಳು, ಬೆಲ್ಲ, ಸಿಹಿತಿಂಡಿ', hi: 'मसूर दाल, तांबा, गुड़, लाल मिठाई' },
      recipient: { en: 'Soldiers, athletes, defense personnel, or brothers', kn: 'ಯೋಧರಿಗೆ, ಸಹೋದರರಿಗೆ ಅಥವಾ ಅಂಗವಿಕಲರಿಗೆ', hi: 'सैनिक अथवा छोटे भाई' },
      bestDay: { en: 'Tuesday Afternoon', kn: 'ಮಂಗಳವಾರ ಮಧ್ಯಾಹ್ನ', hi: 'मंगलवार दोपहर' }
    }
  },
  Rahu: {
    lordName: 'Rahu',
    sanskritName: { en: 'Rahu (North Node)', kn: 'ರಾಹು', hi: 'राहु' },
    vedicDeity: { en: 'Goddess Durga / Bhairava / Sri Sarpa Devata', kn: 'ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರಿ, ಕಾಲಭೈರವ ಮತ್ತು ನಾಗದೇವತೆ', hi: 'मां दुर्गा, कालभैरव एवं नाग देवता' },
    beejaMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    gayatriMantra: 'ॐ नागाधिराजाय विद्मಹೆ ಪದ್ಮಹಸ್ತಾಯ ಧೀಮಹಿ ತನ್ನೋ ರಾಹುಃ ಪ್ರಚೋದಯಾತ್',
    recommendedJapaCount: 18000,
    japaMala: { en: 'Black Onyx, Rudraksha, or Gomed Mala', kn: 'ಕಪ್ಪು ರುದ್ರಾಕ್ಷಿ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ', hi: 'रुद्राक्ष अथवा गोमेद' },
    fastingDay: { en: 'Saturdays or Ashtami Tithi', kn: 'ಶನಿವಾರ ಅಥವಾ ಅಷ್ಟಮಿ ತಿಥಿ', hi: 'शनिवार अथवा अष्टमी' },
    prescribedRituals: [
      {
        name: { en: 'Durga Saptashati Argala Stotra & Rahu Kavacham', kn: 'ದುರ್ಗಾ ಸಪ್ತಶತೀ ಅರ್ಗಲಾ ಸ್ತೋತ್ರ & ರಾಹು ಕವಚ', hi: 'दुर्गा सप्तशती अर्गला स्तोत्र' },
        description: { en: 'Chant in Rahu Kaalam to dissolve illusion, phantom fears, and black magic anxieties.', kn: 'ರಾಹು ಕಾಲದಲ್ಲಿ ನಿಂಬೆಹಣ್ಣಿನ ದೀಪ ಹಚ್ಚಿ ದುರ್ಗಾ ಸ್ತೋತ್ರ ಪಠಿಸಿ; ಭಯ ಮತ್ತು ಭ್ರಮೆಗಳು ನಾಶವಾಗುತ್ತವೆ.', hi: 'राहु काल में मां दुर्गा के समक्ष नींबू का दीपक जलाएं।' },
        frequency: { en: 'Every Friday or Tuesday in Rahu Kaalam', kn: 'ರಾಹು ಕಾಲದ ಸಮಯದಲ್ಲಿ', hi: 'राहु काल में' }
      },
      {
        name: { en: 'Naga Pratishta / Sarpa Bali Shanti', kn: 'ಸರ್ಪ ಶಾಂತಿ & ಆಶ್ಲೇಷಾ ಬಲಿ', hi: 'नाग पूजा एवं सर्प शान्ति' },
        description: { en: 'Perform sacred Naga puja with milk and bilva leaves to dispel Kala Sarpa and ancestral afflictions.', kn: 'ನಾಗದೇವತೆಗೆ ಹಾಲೆರೆದು ಪೂಜಿಸಿ ಕಾಲಸರ್ಪ ದೋಷ ಶಮನಗೊಳಿಸಿ.', hi: 'नाग प्रतिमा पर दुग्धाभिषेक करें।' },
        frequency: { en: 'Once a year or on Nag Panchami', kn: 'ನಾಗರ ಪಂಚಮಿಯಂದು', hi: 'नाग पंचमी' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Hessonite Garnet (Gomedha)', kn: 'ಗೋಮೇಧಿಕ (Gomedha)', hi: 'गोमेद' },
      metal: { en: 'Panchadhatu or Silver', kn: 'ಪಂಚಲೋಹ ಅಥವಾ ಬೆಳ್ಳಿ', hi: 'पंचधातु अथवा चांदी' },
      finger: { en: 'Middle Finger (Right Hand)', kn: 'ಮಧ್ಯದ ಬೆರಳು (ಮಧ್ಯಮಾ)', hi: 'मध्यमा' }
    },
    rudrakshaRemedy: {
      mukhi: 8,
      benefits: { en: '8-Mukhi Rudraksha blesses with Ganesha grace, removing all unseen impediments.', kn: '೮-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಗಣೇಶನ ಕೃಪೆಯಿಂದ ಸಕಲ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸುತ್ತದೆ.', hi: 'अदृश्य बाधा निवारण एवं सिद्धि।' }
    },
    charityRemedy: {
      items: { en: 'Urad dal (black gram), black sesame, blanket, coconut, mustard oil', kn: 'ಉದ್ದಿನ ಬೇಳೆ, ಕಪ್ಪು ಎಳ್ಳು, ಕಪ್ಪು ಕಂಬಳಿ, ತೆಂಗಿನಕಾಯಿ', hi: 'उड़द दाल, काले तिल, कम्बल, नारियल' },
      recipient: { en: 'Sweepers, lepers, homeless shelters, or feeding stray dogs', kn: 'ಪೌರ ಕಾರ್ಮಿಕರಿಗೆ, ಕುಷ್ಠರೋಗಿಗಳಿಗೆ ಅಥವಾ ಬೀದಿ ನಾಯಿಗಳಿಗೆ ಆಹಾರ', hi: 'सफाई कर्मी अथवा कुष्ठ रोगी' },
      bestDay: { en: 'Saturday Night or Wednesday Night', kn: 'ಶನಿವಾರ ರಾತ್ರಿ', hi: 'शनिवार रात्रि' }
    }
  },
  Jupiter: {
    lordName: 'Jupiter',
    sanskritName: { en: 'Guru / Brihaspati (Jupiter)', kn: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', hi: 'गुरु (बृहस्पति)' },
    vedicDeity: { en: 'Lord Dakshinamurthy & Lord Dattatreya', kn: 'ಶ್ರೀ ಮೇಧಾ ದಕ್ಷಿಣಾಮೂರ್ತಿ & ಶ್ರೀ ಗುರು ದತ್ತಾತ್ರೇಯ', hi: 'श्री दक्षिणामूर्ति एवं दत्तात्रेय' },
    beejaMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    gayatriMantra: 'ॐ वृषध्वजाय विद्महे धनुर्हस्ताय धीमहि तन्नो गुरुः प्रचोदयात्',
    recommendedJapaCount: 19000,
    japaMala: { en: 'Yellow Turmeric Rosary or Pure Gold/Rudraksha', kn: 'ಅರಿಶಿನದ ಕೊಂಬಿನ ಮಾಲೆ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ', hi: 'हल्दी की माला अथवा रुद्राक्ष' },
    fastingDay: { en: 'Thursdays (Guruvara Vrata)', kn: 'ಗುರುವಾರ ವ್ರತ', hi: 'गुरुवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Guru Paduka Stotram & Dakshinamurthy Stotram', kn: 'ದಕ್ಷಿಣಾಮೂರ್ತಿ ಸ್ತೋತ್ರ & ಗುರು ಪಾದುಕಾ ಪೂಜೆ', hi: 'दक्षिणामूर्ति स्तोत्र एवं गुरु पादुका पूजन' },
        description: { en: 'Recite under Peepal tree or in puja room on Thursday mornings to awaken supreme intellect and spiritual intuition.', kn: 'ಗುರುವಾರ ಮುಂಜಾನೆ ಗುರುಗಳ ಪಾದಪೂಜೆ ಮಾಡಿ ಧರ್ಮ, ಜ್ಞಾನ ಮತ್ತು ಸಂತಾನ ಭಾಗ್ಯ ಪಡೆಯಿರಿ.', hi: 'गुरुवार प्रातः गुरु के चरणों में नमन कर पाठ करें।' },
        frequency: { en: 'Every Thursday morning during Guru Hora', kn: 'ಪ್ರತಿ ಗುರುವಾರ ಗುರು ಹೋರೆಯಲ್ಲಿ', hi: 'गुरुवार गुरु होरा में' }
      },
      {
        name: { en: 'Brihaspati Shanti Homa with Ashvattha Samidha', kn: 'ಬೃಹಸ್ಪತಿ ಶಾಂತಿ ಹೋಮ', hi: 'बृहस्पति शान्ति होम' },
        description: { en: 'Offer turmeric sticks, yellow mustard, and ghee into sacred fire for immense family wealth and academic honors.', kn: 'ಅಶ್ವತ್ಥ ಸಮಿಧೆಯಿಂದ ಹೋಮ ನಡೆಸಿ ಅಪಾರ ಧನ-ಧಾನ್ಯ ವೃದ್ಧಿ ಸಾಧಿಸಿ.', hi: 'पीपल की समिधा से आहुति दें।' },
        frequency: { en: 'Quarterly on Shukla Paksha Thursday', kn: 'ಶುಕ್ಲ ಪಕ್ಷದ ಗುರುವಾರ', hi: 'शुक्ल पक्ष गुरुवार' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Yellow Sapphire (Pukhraj) / Yellow Topaz', kn: 'ಪುಷ್ಯರಾಗ (Yellow Sapphire) / ಹಳದಿ ತೋಪಾಜ್', hi: 'पुखराज अथवा पीला पुखराज' },
      metal: { en: 'Pure 22K Gold or Brass', kn: 'ಅಪರಂಜಿ ಬಂಗಾರ ಅಥವಾ ಹಿತ್ತಾಳೆ', hi: 'शुद्ध स्वर्ण' },
      finger: { en: 'Index Finger (Right Hand - Tarjani)', kn: 'ತೋರುಬೆರಳು (ತರ್ಜನೀ)', hi: 'तर्जनी' }
    },
    rudrakshaRemedy: {
      mukhi: 5,
      benefits: { en: '5-Mukhi Rudraksha balances blood pressure, protects intellect, and bestows peace.', kn: '೫-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಪರಮ ಮಂಗಳಕರ; ಜ್ಞಾನ ಮತ್ತು ಶಾಂತಿ ನೀಡುತ್ತದೆ.', hi: 'आरोग्य, ज्ञान एवं आत्मिक शान्ति।' }
    },
    charityRemedy: {
      items: { en: 'Chana dal (split chickpeas), turmeric, yellow laddus, saffron, religious books', kn: 'ಕಡಲೆಕಾಳು, ಅರಿಶಿನದ ಕೊಂಬು, ಹಳದಿ ಲಾಡು, ಧಾರ್ಮಿಕ ಗ್ರಂಥಗಳು', hi: 'चने की दाल, हल्दी, बेसन के लड्डू, धार्मिक ग्रन्थ' },
      recipient: { en: 'Vedic scholars, spiritual gurus, students, or cow shelters (Gau Seva)', kn: 'ವೇದ ಪಾಠಶಾಲೆಗೆ, ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಥವಾ ಗೋಮಾತೆಗೆ', hi: 'ब्राह्मण, विद्यार्थी अथवा गौशाला' },
      bestDay: { en: 'Thursday Morning before noon', kn: 'ಗುರುವಾರ ಮುಂಜಾನೆ', hi: 'गुरुवार प्रातःकाल' }
    }
  },
  Saturn: {
    lordName: 'Saturn',
    sanskritName: { en: 'Shani (Saturn)', kn: 'ಶನಿ (ಶನೈಶ್ಚರ)', hi: 'शनि (शनैश्चर)' },
    vedicDeity: { en: 'Lord Shani Dev & Lord Hanuman', kn: 'ಶ್ರೀ ಶನೀಶ್ವರ ಸ್ವಾಮಿ & ಶ್ರೀ ಹನುಮಂತ', hi: 'शनिदेव एवं हनुमान जी' },
    beejaMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    gayatriMantra: 'ॐ कृष्णांगाय विद्महे रविसुताय धीमहि तन्नो मन्दः प्रचोदयात्',
    recommendedJapaCount: 23000,
    japaMala: { en: 'Blue Sapphire, Amethyst, or Dark Rudraksha (108 beads)', kn: 'ನೀಲಿ ಮಣಿ ಅಥವಾ ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ', hi: 'नीलमणि अथवा रुद्राक्ष' },
    fastingDay: { en: 'Saturdays (Shanivara Vrata)', kn: 'ಶನಿವಾರ ವ್ರತ', hi: 'शनिवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Dasharatha Shani Stotram & Sesame Oil Lamp', kn: 'ದಶರಥ ಕೃತ ಶನಿ ಸ್ತೋತ್ರ & ಎಳ್ಳೆಣ್ಣೆ ದೀಪ', hi: 'दशरथ कृत शनि स्तोत्र' },
        description: { en: 'Light a sesame oil lamp under a sacred Peepal tree after sunset on Saturdays and recite Dasharatha Stotram to dispel Sade Sati and chronic grief.', kn: 'ಶನಿವಾರ ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಅರಳಿ ಮರದ ಕೆಳಗೆ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ ದಶರಥ ಶನಿ ಸ್ತೋತ್ರ ಪಠಿಸಿ.', hi: 'शनिवार सायं पीपल के नीचे तिल के तेल का दीपक जलाएं।' },
        frequency: { en: 'Every Saturday evening', kn: 'ಪ್ರತಿ ಶನಿವಾರ ಸಂಜೆ', hi: 'प्रत्येक शनिवार सायं' }
      },
      {
        name: { en: 'Hanuman Taila Abhishekam', kn: 'ಹನುಮಂತನಿಗೆ ತೈಲಾಭಿಷೇಕ', hi: 'हनुमान जी को तेल अर्पण' },
        description: { en: 'Offer sesame oil on Hanuman idol; according to Ramayana, Saturn promised Hanuman that his devotees will never be troubled by Shani.', kn: 'ಹನುಮಂತನಿಗೆ ಎಳ್ಳೆಣ್ಣೆ ಅರ್ಪಿಸಿ; ಶನಿ ಬಾಧೆಗಳು ತಕ್ಷಣ ಶಾಂತವಾಗುತ್ತವೆ.', hi: 'हनुमान जी पर तेल चढ़ाएं, शनि पीड़ा शांत होगी।' },
        frequency: { en: 'Monthly on Amavasya', kn: 'ಪ್ರತಿ ಅಮಾವಾಸ್ಯೆ ದಿನ', hi: 'मासिक अमावस्या' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Blue Sapphire (Neelam) / Amethyst (Katela)', kn: 'ನೀಲಂ (Blue Sapphire) / ಕಟೇಲಾ (Amethyst)', hi: 'नीलम अथवा कटैला' },
      metal: { en: 'Panchadhatu, Iron, or White Gold', kn: 'ಪಂಚಲೋಹ, ಕಬ್ಬಿಣ ಅಥವಾ ಬೆಳ್ಳಿ', hi: 'पंचधातु अथवा लोहा' },
      finger: { en: 'Middle Finger (Right Hand - Madhyama)', kn: 'ಮಧ್ಯದ ಬೆರಳು (ಮಧ್ಯಮಾ)', hi: 'मध्यमा' }
    },
    rudrakshaRemedy: {
      mukhi: 7,
      benefits: { en: '7-Mukhi Rudraksha shields from sudden downfall and brings financial endurance.', kn: '೭-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಆಕಸ್ಮಿಕ ಸಂಕಷ್ಟಗಳಿಂದ ರಕ್ಷಿಸಿ ಸ್ಥಿರ ಸಂಪತ್ತು ತರುತ್ತದೆ.', hi: 'आकस्मिक संकट से रक्षा एवं स्थायी धन।' }
    },
    charityRemedy: {
      items: { en: 'Black sesame seeds (tila), iron pan, mustard oil, black umbrella, leather footwear', kn: 'ಕಪ್ಪು ಎಳ್ಳು, ಕಬ್ಬಿಣದ ತವಾ, ಎಳ್ಳೆಣ್ಣೆ, ಕಪ್ಪು ಛತ್ರಿ, ಪಾದರಕ್ಷೆ', hi: 'काले तिल, लोहे का तवा, सरसों का तेल, काला छाता' },
      recipient: { en: 'Laborers, disabled persons, elderly servants, or footwear makers', kn: 'ಕಾರ್ಮಿಕರಿಗೆ, ಅಂಗವಿಕಲರಿಗೆ, ವೃದ್ಧ ಸೇವಕರಿಗೆ', hi: 'श्रमिक, दिव्यांग अथवा वृद्ध जन' },
      bestDay: { en: 'Saturday Twilight after sunset', kn: 'ಶನಿವಾರ ಸಂಜೆ ಸೂರ್ಯಾಸ್ತದ ನಂತರ', hi: 'शनिवार सूर्यास्त के बाद' }
    }
  },
  Mercury: {
    lordName: 'Mercury',
    sanskritName: { en: 'Budha (Mercury)', kn: 'ಬುಧ', hi: 'बुध' },
    vedicDeity: { en: 'Lord Maha Vishnu & Lord Narayana', kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು & ನಾರಾಯಣ', hi: 'भगवान श्री हरि विष्णु' },
    beejaMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    gayatriMantra: 'ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि तन्नो सौम्यः प्रचोदयात्',
    recommendedJapaCount: 9000,
    japaMala: { en: 'Tulsi Rosary or Emerald Mala (108 beads)', kn: 'ತುಳಸಿ ಮಾಲೆ ಅಥವಾ ಪಚ್ಚೆ ಮಣಿ', hi: 'तुलसी माला अथवा पन्ना' },
    fastingDay: { en: 'Wednesdays (Budhavara Vrata)', kn: 'ಬುಧವಾರ ವ್ರತ', hi: 'बुधवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Sri Vishnu Sahasranama Stotram Parayana', kn: 'ಶ್ರೀ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಸ್ತೋತ್ರ ಪಾರಾಯಣ', hi: 'विष्णु सहस्रनाम पाठ' },
        description: { en: 'Chanting the 1,000 holy names of Vishnu purifies intellect, boosts commerce, cures stammering, and clarifies mind.', kn: 'ಪ್ರತಿದಿನ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಿಸುವುದರಿಂದ ವ್ಯಾಪಾರ ವೃದ್ಧಿ, ವಾಕ್ ಶಕ್ತಿ ಮತ್ತು ಜ್ಞಾನ ವಿಕಾಸವಾಗುತ್ತದೆ.', hi: 'नित्य विष्णु सहस्रनाम पाठ से बुद्धि प्रखर एवं व्यापार समृद्ध होता है।' },
        frequency: { en: 'Daily or on Wednesdays', kn: 'ಬುಧವಾರ ಅಥವಾ ಪ್ರತಿದಿನ', hi: 'नित्य अथवा बुधवार' }
      },
      {
        name: { en: 'Gau Seva with Green Grass & Moong Dal', kn: 'ಹಸುವಿಗೆ ಹಸಿರು ಹುಲ್ಲು ಮತ್ತು ಹೆಸರುಕಾಳು ನೀಡುವುದು', hi: 'गौ माता को हरा चारा एवं मूंग दाल' },
        description: { en: 'Feed green grass or soaked whole green moong dal to indigenous Indian cows to remove financial stagnancy.', kn: 'ಬುಧವಾರ ಹಸುವಿಗೆ ಹಸಿರು ಹುಲ್ಲು ಅಥವಾ ನೆನೆಸಿದ ಹೆಸರುಕಾಳು ತಿನ್ನಿಸಿ ಬುಧ ದೋಷ ಕಳೆಯಿರಿ.', hi: 'बुधवार को गाय को हरा चारा खिलाएं।' },
        frequency: { en: 'Every Wednesday morning', kn: 'ಪ್ರತಿ ಬುಧವಾರ ಮುಂಜಾನೆ', hi: 'प्रत्येक बुधवार प्रातः' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Emerald (Panna) / Green Tourmaline', kn: 'ಪಚ್ಚೆ (Emerald) / ಹಸಿರು ಟೂರ್ಮಲಿನ್', hi: 'पन्ना अथवा ओनेक्स' },
      metal: { en: 'Gold, Silver, or Bronze', kn: 'ಬಂಗಾರ, ಬೆಳ್ಳಿ ಅಥವಾ ಕಂಚು', hi: 'स्वर्ण अथवा चांदी' },
      finger: { en: 'Little Finger (Right Hand - Kanishthika)', kn: 'ಕಿರುಬೆರಳು (ಕನಿಷ್ಠಿಕಾ)', hi: 'कनिष्ठिका' }
    },
    rudrakshaRemedy: {
      mukhi: 4,
      benefits: { en: '4-Mukhi Rudraksha awakens Brahma intellect, eloquence, and academic memory.', kn: '೪-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಬ್ರಹ್ಮಜ್ಞಾನ, ಅದ್ಭುತ ವಾಕ್ ಚಾತುರ್ಯ ಮತ್ತು ಸ್ಮರಣ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.', hi: 'मेधा शक्ति, वाणी प्रभाव एवं स्मरण शक्ति।' }
    },
    charityRemedy: {
      items: { en: 'Whole green moong dal, green cloth, stationery, books, bronze plates', kn: 'ಹೆಸರುಕಾಳು, ಹಸಿರು ವಸ್ತ್ರ, ಪುಸ್ತಕಗಳು, ಲೇಖನಿ, ಕಂಚಿನ ಪಾತ್ರೆ', hi: 'हरी मूंग, हरे वस्त्र, पुस्तकें, पेन, कांसे का बर्तन' },
      recipient: { en: 'Students, orphanages, young school girls (Kanya Seva)', kn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ, ಅನಾಥ ಮಕ್ಕಳಿಗೆ ಅಥವಾ ಹೆಣ್ಣುಮಕ್ಕಳಿಗೆ', hi: 'कन्याएं अथवा निर्धन विद्यार्थी' },
      bestDay: { en: 'Wednesday Morning before noon', kn: 'ಬುಧವಾರ ಮುಂಜಾನೆ', hi: 'बुधवार प्रातः' }
    }
  },
  Ketu: {
    lordName: 'Ketu',
    sanskritName: { en: 'Ketu (South Node)', kn: 'ಕೇತು', hi: 'केतु' },
    vedicDeity: { en: 'Lord Ganesha (Vighnaharta) & Lord Matsya', kn: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ & ಮತ್ಸ್ಯಾವತಾರ ನಾರಾಯಣ', hi: 'भगवान श्री गणेश एवं मत्स्य अवतार' },
    beejaMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    gayatriMantra: 'ॐ अश्वाध्वजाय विद्महे शूलहस्ताय धीमहि तन्नो केतुः प्रचोदयात्',
    recommendedJapaCount: 17000,
    japaMala: { en: 'Rudraksha or Ashoka Seed Mala', kn: 'ರುದ್ರಾಕ್ಷಿ ಮಾಲೆ', hi: 'रुद्राक्ष माला' },
    fastingDay: { en: 'Tuesdays or Sankashti Chaturthi', kn: 'ಸಂಕಷ್ಟ ಚತುರ್ಥಿ & ಮಂಗಳವಾರ', hi: 'संकष्टी चतुर्थी अथवा मंगलवार' },
    prescribedRituals: [
      {
        name: { en: 'Ganesha Atharvashirsha Parayana with Durva Grass', kn: 'ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ & ಗರಿಕೆಯಿಂದ ಅರ್ಚನೆ', hi: 'गणपति अथर्वशीर्ष पाठ एवं दूर्वा अर्पण' },
        description: { en: 'Offer 21 blades of fresh Durva grass to Lord Ganesha while chanting Atharvashirsha to eradicate mental confusion and occult fear.', kn: '೨೧ ಗರಿಕೆ ಹುಲ್ಲುಗಳಿಂದ ಗಣಪತಿಗೆ ಅಥರ್ವಶೀರ್ಷ ಹೇಳಿ ಅರ್ಚಿಸಿ; ಗೊಂದಲ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ಭೀತಿ ನಿವಾರಣೆಯಾಗುತ್ತದೆ.', hi: 'गणेश जी को २१ दूर्वा दल अर्पित कर पाठ करें।' },
        frequency: { en: 'Every Sankashti Chaturthi or Tuesday', kn: 'ಪ್ರತಿ ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿ ದಿನ', hi: 'प्रत्येक चतुर्थी' }
      },
      {
        name: { en: 'Feeding Multicolored / Stray Animals', kn: 'ಬೀದಿ ನಾಯಿಗಳು ಮತ್ತು ಪ್ರಾಣಿಗಳಿಗೆ ಆಹಾರ', hi: 'श्वान एवं पक्षियों को भोजन' },
        description: { en: 'Feed warm bread or rotis to multicolored or stray dogs to pacify Ketu’s sudden karmic stinging.', kn: 'ಚಿತ್ರ-ವಿಚಿತ್ರ ಬಣ್ಣದ ನಾಯಿಗಳಿಗೆ ಅಥವಾ ಹಕ್ಕಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ ಕೇತು ದೋಷ ಕಳೆಯಿರಿ.', hi: 'चितकबरे श्वान को रोटी खिलाएं।' },
        frequency: { en: 'Weekly on Tuesday or Thursday', kn: 'ವಾರಕ್ಕೊಮ್ಮೆ ಮಂಗಳವಾರ', hi: 'सप्ताह में एक बार' }
      }
    ],
    gemstoneRemedy: {
      name: { en: "Cat's Eye (Vaidurya / Lehsunia)", kn: 'ವೈಡೂರ್ಯ (Cat’s Eye)', hi: 'लहसुनिया' },
      metal: { en: 'Silver or Panchadhatu', kn: 'ಬೆಳ್ಳಿ ಅಥವಾ ಪಂಚಲೋಹ', hi: 'चांदी अथवा पंचधातु' },
      finger: { en: 'Middle or Ring Finger', kn: 'ಮಧ್ಯದ ಬೆರಳು ಅಥವಾ ಉಂಗುರದ ಬೆರಳು', hi: 'मध्यमा अथवा अनामिका' }
    },
    rudrakshaRemedy: {
      mukhi: 9,
      benefits: { en: '9-Mukhi Rudraksha blessed by Navadurga, granting fearless courage and liberation.', kn: '೯-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ನವದುರ್ಗೆಯ ಕೃಪೆಯಿಂದ ಸಕಲ ಭಯಗಳನ್ನು ಕಳೆದು ಮುಕ್ತಿ ನೀಡುತ್ತದೆ.', hi: 'साहस, निर्भयता एवं मोक्ष मार्ग।' }
    },
    charityRemedy: {
      items: { en: 'Seven grains (Sapta Dhanya), grey blanket, sesame, lemon, iron knife', kn: 'ಸಪ್ತ ಧಾನ್ಯ, ಕಪ್ಪು-ಬಿಳಿ ಕಂಬಳಿ, ನಿಂಬೆಹಣ್ಣು, ಸಾಸಿವೆ', hi: 'सप्त धान्य, कम्बल, तिल, नींबू' },
      recipient: { en: 'Sadhus, hermits, monks, or leprosy centers', kn: 'ಸಾಧು-ಸಂತರ ಆಶ್ರಮಕ್ಕೆ, ಅನಾಥರಿಗೆ', hi: 'संन्यासी अथवा साधु' },
      bestDay: { en: 'Tuesday Morning or Thursday', kn: 'ಮಂಗಳವಾರ ಮುಂಜಾನೆ', hi: 'मंगलवार प्रातः' }
    }
  },
  Venus: {
    lordName: 'Venus',
    sanskritName: { en: 'Shukra (Venus)', kn: 'ಶುಕ್ರ (ಶುಕ್ರಾಚಾರ್ಯ)', hi: 'शुक्र' },
    vedicDeity: { en: 'Goddess Maha Lakshmi & Sri Rajarajeshwari', kn: 'ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಿ & ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರಸುಂದರಿ', hi: 'माता महालक्ष्मी एवं ललिता' },
    beejaMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्रಾಯ ನಮಃ',
    gayatriMantra: 'ॐ भृगुपुत्राय विद्महे दिव्यदेहाय धीमहि तन्नो शुक्रः प्रचोदयात्',
    recommendedJapaCount: 16000,
    japaMala: { en: 'White Lotus Seed (Kamalagatta) or Sphatika Mala', kn: 'ಕಮಲದ ಬೀಜದ ಮಾಲೆ ಅಥವಾ ಸ್ಪಟಿಕ ಮಾಲೆ', hi: 'कमलगट्टा अथवा स्फटिक माला' },
    fastingDay: { en: 'Fridays (Shukravara Vrata)', kn: 'ಶುಕ್ರವಾರ ವ್ರತ', hi: 'शुक्रवार व्रत' },
    prescribedRituals: [
      {
        name: { en: 'Sri Suktam & Kanakadhara Stotra Parayana', kn: 'ಶ್ರೀ ಸೂಕ್ತ & ಕನಕಧಾರಾ ಸ್ತೋತ್ರ ಪಾರಾಯಣ', hi: 'श्री सूक्त एवं कनकधारा स्तोत्र पाठ' },
        description: { en: 'Chant with pure cow ghee lamp on Friday evenings to attract immense wealth, artistic fame, and marital ecstasy.', kn: 'ಶುಕ್ರವಾರ ಸಂಜೆ ಹಸುವಿನ ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ ಶ್ರೀ ಸೂಕ್ತ ಪಠಿಸಿ; ಲಕ್ಷ್ಮೀ ಕಟಾಕ್ಷ ಮತ್ತು ಸೌಂದರ್ಯ ಸಿದ್ಧಿಸುತ್ತದೆ.', hi: 'शुक्रवार सायं घी का दीपक जलाकर पाठ करने से अपार धन-वैभव प्राप्त होता है।' },
        frequency: { en: 'Every Friday evening', kn: 'ಪ್ರತಿ ಶುಕ್ರವಾರ ಸಂಜೆ', hi: 'प्रत्येक शुक्रवार' }
      },
      {
        name: { en: 'Mahalakshmi Kunkumarchana', kn: 'ಮಹಾಲಕ್ಷ್ಮೀ ಕುಂಕುಮಾರ್ಚನೆ', hi: 'महालक्ष्मी कुंकुमार्चन' },
        description: { en: 'Offer natural red vermilion chanting Lalita Sahasranama for blissful marriage and luxury vehicle acquisition.', kn: 'ಲಲಿತಾ ಸಹಸ್ರನಾಮದಿಂದ ಕುಂಕುಮಾರ್ಚನೆ ನಡೆಸಿ ದಾಂಪತ್ಯ ಕಲಹ ಪರಿಹರಿಸಿ.', hi: 'ललिता सहस्रनाम द्वारा कुंकुमार्चन करें।' },
        frequency: { en: 'Every Friday or Purnima', kn: 'ಪ್ರತಿ ಹುಣ್ಣಿಮೆ ಅಥವಾ ಶುಕ್ರವಾರ', hi: 'पूर्णिमा अथवा शुक्रवार' }
      }
    ],
    gemstoneRemedy: {
      name: { en: 'Diamond (Heera) / White Zircon (Shveta Zircon)', kn: 'ವಜ್ರ (Diamond) / ಬಿಳಿ ಜಿರ್ಕಾನ್', hi: 'हीरा अथवा श्वेत जरकन' },
      metal: { en: 'White Gold, Platinum, or Silver', kn: 'ಬೆಳ್ಳಿ ಅಥವಾ ಬಿಳಿ ಬಂಗಾರ', hi: 'चांदी अथवा प्लेटिनम' },
      finger: { en: 'Middle or Little Finger (Right Hand)', kn: 'ಮಧ್ಯದ ಬೆರಳು ಅಥವಾ ಕಿರುಬೆರಳು', hi: 'मध्यमा अथवा कनिष्ठिका' }
    },
    rudrakshaRemedy: {
      mukhi: 6,
      benefits: { en: '6-Mukhi Rudraksha blesses with magnetic attraction, artistic creativity, and marital harmony.', kn: '೬-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಆಕರ್ಷಕ ವ್ಯಕ್ತಿತ್ವ ಮತ್ತು ದಾಂಪತ್ಯ ಪ್ರೀತಿ ನೀಡುತ್ತದೆ.', hi: 'सौन्दर्य, आकर्षण एवं वैवाहिक सुख।' }
    },
    charityRemedy: {
      items: { en: 'White fragrant perfume, silk saree, ghee, sugar candy (mishri), curd, silver', kn: 'ಸುಗಂಧ ದ್ರವ್ಯ, ರೇಷ್ಮೆ ವಸ್ತ್ರ, ಶುದ್ಧ ತುಪ್ಪ, ಕಲ್ಲುಸಕ್ಕರೆ, ಮೊಸರು', hi: 'सुगन्धित इत्र, रेशमी वस्त्र, शुद्ध घी, मिश्री, दही' },
      recipient: { en: 'Married women (Sumangalis), musicians, or artistic academies', kn: 'ಮುತ್ತೈದೆಯರಿಗೆ (ಸುಮಂಗಲಿಯರು) ಅಥವಾ ಕಲಾವಿದರಿಗೆ', hi: 'सुहागिन महिलाएं अथवा कलाकार' },
      bestDay: { en: 'Friday Twilight', kn: 'ಶುಕ್ರವಾರ ಸಂಜೆ', hi: 'शुक्रवार सन्ध्या' }
    }
  }
};

export function getDashaLordRemedies(lordName: string): DashaRemedyPackage {
  const normalized = lordName.trim();
  return DASHA_REMEDIES_LIBRARY[normalized] || DASHA_REMEDIES_LIBRARY['Jupiter'];
}
