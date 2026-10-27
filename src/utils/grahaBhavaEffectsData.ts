import { LocalizedString } from '../types';

export interface GrahaBhavaEffectItem {
  planet: string;
  planetName: LocalizedString;
  bhava: number;
  bhavaName: LocalizedString;
  title: LocalizedString;
  nature: 'Auspicious' | 'Mixed' | 'Remedy Needed';
  natureLocalized: LocalizedString;
  summary: LocalizedString;
  effects: {
    general: LocalizedString;
    careerAndWealth: LocalizedString;
    relationshipsAndHealth: LocalizedString;
  };
  remedy: {
    action: LocalizedString;
    mantra: string;
    mantraCount: string;
    charityDay: LocalizedString;
  };
}

// Complete classical Parashari effects of all 9 Grahas in all 12 Bhavas (108 combinations)
export const COMPLETE_GRAHA_BHAVA_EFFECTS: Record<string, Record<number, GrahaBhavaEffectItem>> = {
  Sun: {
    1: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 1,
      bhavaName: { en: '1st House (Lagna / Tanu Bhava)', kn: '೧ನೇ ಭಾವ (ಲಗ್ನ / ತನು ಭಾವ)', hi: 'प्रथम भाव (लग्न)' },
      title: { en: 'Sun in 1st House: Radiant Self-Confidence & Royal Dignity', kn: '೧ರಲ್ಲಿ ಸೂರ್ಯ: ತೇಜಸ್ವಿ ವ್ಯಕ್ತಿತ್ವ & ಆತ್ಮವಿಶ್ವಾಸ', hi: 'प्रथम भाव में सूर्य: तेजस्वी व्यक्तित्व' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Auspicious (Shubha)', kn: 'ಶುಭ ಫಲದಾಯಕ', hi: 'शुभ फल' },
      summary: {
        en: 'Endows magnetic charisma, authoritative executive presence, leadership instincts, and radiant vitality. May induce high self-esteem or hot temperament.',
        kn: 'ಆಕರ್ಷಕ ತೇಜಸ್ಸು, ನಾಯಕತ್ವದ ಗುಣ, ಆಡಳಿತ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ದೃಢ ಸಂಕಲ್ಪ ನೀಡುತ್ತದೆ. ಸ್ವಲ್ಪ ಪಿತ್ತ ಉಷ್ಣತೆ ಮತ್ತು ಸ್ವಾಭಿಮಾನ ಉಂಟಾಗಬಹುದು.',
        hi: 'तेजस्वी व्यक्तित्व, स्वाभिमान, नेतृत्व शक्ति एवं दृढ़ निश्चय प्रदान करता है।'
      },
      effects: {
        general: {
          en: 'Strong skeletal frame, proud gait, high ambitions, and natural commanding demeanor.',
          kn: 'ಗಟ್ಟಿಮುಟ್ಟಾದ ಶರೀರ, ಉನ್ನತ ಧ್ಯೇಯ ಮತ್ತು ಸಮಾಜದಲ್ಲಿ ನೈಸರ್ಗಿಕ ನಾಯಕತ್ವ.',
          hi: 'दृढ़ शारीरिक गठन, उच्च महत्वाकांक्षा एवं सम्माननीय प्रतिष्ठा।'
        },
        careerAndWealth: {
          en: 'Excellent for government services, politics, administration, and executive management.',
          kn: 'ಸರ್ಕಾರಿ ಸೇವೆ, ರಾಜಕೀಯ, ಆಡಳಿತ ಹಾಗೂ ಉನ್ನತ ಹುದ್ದೆಗಳಿಗೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ.',
          hi: 'राजकीय सेवा, प्रशासनिक पद एवं उच्च व्यापार में सफलता।'
        },
        relationshipsAndHealth: {
          en: 'Requires gentle diplomacy in marriage; prone to bile (pitta), headache, or eye sensitivity.',
          kn: 'ದಾಂಪತ್ಯದಲ್ಲಿ ಸೌಮ್ಯತೆ ಕಾಪಾಡಿಕೊಳ್ಳಬೇಕು; ಪಿತ್ತ, ತಲೆನೋವು ಹಾಗೂ ಕಣ್ಣಿನ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ವಹಿಸಿ.',
          hi: 'दांपत्य में अहंकार से बचें; पित्त एवं नेत्र विकार की संभावना।'
        }
      },
      remedy: {
        action: { en: 'Offer Arghya to rising Sun daily with red flower and copper vessel.', kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯೋದಯಕ್ಕೆ ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಸೂರ್ಯನಿಗೆ ಕೆಂಪು ಹೂವಿನೊಂದಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸಿ.', hi: 'नित्य प्रातः ताम्बे के लोटे से सूर्य को जल अर्पित करें।' },
        mantra: 'ॐ ಹ್ರಾಂ ಹ್ರೀಂ ಹ್ರೌಂ ಸಃ ಸೂರ್ಯಾಯ ನಮಃ (Om Hraam Hreem Hroum Sah Suryaya Namah)',
        mantraCount: '7,000 times (108 daily)',
        charityDay: { en: 'Sunday (Wheat, jaggery, ruby or copper)', kn: 'ಭಾನುವಾರ (ಗೋಧಿ, ಬೆಲ್ಲ, ತಾಮ್ರ ಅಥವಾ ಕೆಂಪು ವಸ್ತ್ರ ದಾನ)', hi: 'रविवार (गेहूं, गुड़, ताम्बा)' }
      }
    },
    2: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 2,
      bhavaName: { en: '2nd House (Dhana & Kutumba)', kn: '೨ನೇ ಭಾವ (ಧನ & ಕುಟುಂಬ)', hi: 'द्वितीय भाव (धन)' },
      title: { en: 'Sun in 2nd House: Wealth via Authority & Authoritative Speech', kn: '೨ರಲ್ಲಿ ಸೂರ್ಯ: ಆಡಳಿತಾತ್ಮಕ ಧನಾರ್ಜನೆ & ದೃಢ ವಾಕ್ಯ', hi: 'द्वितीय भाव में सूर्य: राजकीय धन' },
      nature: 'Mixed',
      natureLocalized: { en: 'Mixed Results', kn: 'ಮಿಶ್ರ ಫಲ', hi: 'मिश्रित फल' },
      summary: {
        en: 'Blesses with wealth gained through government, royalty, metals, and ancestral legacy. Speech can be blunt, commanding, or sharp.',
        kn: 'ಸರ್ಕಾರ, ಅಧಿಕಾರ ಹಾಗೂ ಪಾರಂಪರಿಕ ಮೂಲಗಳಿಂದ ಧನಾಗಮನ. ಮಾತು ಸ್ವಲ್ಪ ನೇರ ಮತ್ತು ಅಧಿಕಾರಯುತವಾಗಿರುತ್ತದೆ.',
        hi: 'राजकीय स्रोतों से धन लाभ किन्तु वाणी में कठोरता की संभावना।'
      },
      effects: {
        general: {
          en: 'Proud family lineage; spends on noble and prestigious family causes.',
          kn: 'ಪ್ರತಿಷ್ಠಿತ ಕುಟುಂಬ ಹಿನ್ನೆಲೆ; ಕುಟುಂಬದ ಗೌರವಕ್ಕೆ ಹೆಚ್ಚು ಮಹತ್ವ ನೀಡುತ್ತಾರೆ.',
          hi: 'पारिवारिक प्रतिष्ठा एवं मान-सम्मान में वृद्धि।'
        },
        careerAndWealth: {
          en: 'Gains through banking, state treasury, metals, gems, and timber.',
          kn: 'ಬ್ಯಾಂಕಿಂಗ್, ಸರ್ಕಾರಿ ಬೊಕ್ಕಸ, ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಮತ್ತು ಲೋಹಗಳ ಮೂಲಕ ಧನಲಾಭ.',
          hi: 'कोषागार, बैंकिंग एवं धातुओं के व्यवसाय में लाभ।'
        },
        relationshipsAndHealth: {
          en: 'Need to avoid harsh tones with relatives; watch right eye and dental health.',
          kn: 'ಕುಟುಂಬದವರೊಂದಿಗೆ ಮಾತಿನ ಕಟುತ್ವ ತಪ್ಪಿಸಿ; ಬಲಗಣ್ಣು ಮತ್ತು ಹಲ್ಲುಗಳ ಆರೋಗ್ಯ ಕಾಪಾಡಿ.',
          hi: 'कुटुम्बियों से मधुर संवाद रखें; दाहिने नेत्र का ध्यान रखें।'
        }
      },
      remedy: {
        action: { en: 'Serve parents and feed cow with jaggery and wheat on Sundays.', kn: 'ಭಾನುವಾರ ಹಸುವಿಗೆ ಬೆಲ್ಲ ಮತ್ತು ಗೋಧಿ ತಿನ್ನಿಸಿ, ಹಿರಿಯರನ್ನು ಗೌರವಿಸಿ.', hi: 'रविवार को गाय को गुड़ व गेहूं खिलाएं।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ (Om Suryaya Namah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Jaggery and copper coin)', kn: 'ಭಾನುವಾರ (ಬೆಲ್ಲ, ತಾಮ್ರದ ನಾಣ್ಯ)', hi: 'रविवार' }
      }
    },
    3: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 3,
      bhavaName: { en: '3rd House (Sahaja & Parakrama)', kn: '೩ನೇ ಭಾವ (ಸಹಜ & ಪರಾಕ್ರಮ)', hi: 'तृतीय भाव (पराक्रम)' },
      title: { en: 'Sun in 3rd House: Fearless Valor, Initiative & Fame', kn: '೩ರಲ್ಲಿ ಸೂರ್ಯ: ಅಪ್ರತಿಮ ಶೌರ್ಯ, ಸಾಹಸ & ಕೀರ್ತಿ', hi: 'तृतीय भाव में सूर्य: पराक्रमी' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Highly Auspicious (Upachaya)', kn: 'ಪರಮ ಶುಭ (ಉಪಚಯ)', hi: 'अत्यंत शुभ' },
      summary: {
        en: 'Malefic Sun in an Upachaya house yields phenomenal courage, willpower, and victory over adversaries. The native rises through personal enterprise.',
        kn: 'ಉಪಚಯ ಭಾವದಲ್ಲಿ ಸೂರ್ಯನು ಅದ್ಭುತ ಧೈರ್ಯ, ಅಚಲ ಸಂಕಲ್ಪ ಮತ್ತು ಶತ್ರುಜಯ ನೀಡುತ್ತಾನೆ. ಸ್ವಂತ ಪರಿಶ್ರಮದಿಂದ ಕೀರ್ತಿ ಗಳಿಸುತ್ತಾರೆ.',
        hi: 'उपचय भाव में सूर्य असीम साहस, बाहुबल एवं शत्रुओं पर विजय दिलाता है।'
      },
      effects: {
        general: {
          en: 'High physical stamina, heroic attitude, independent thinker, skilled in communications.',
          kn: 'ಅದ್ಭುತ ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ, ಸ್ವಾವಲಂಬಿ ಮನೋಭಾವ, ಸಂವಹನ ಕಲೆ.',
          hi: 'शौर्य, स्वावलम्बन एवं सम्प्रेषण कला में निपुणता।'
        },
        careerAndWealth: {
          en: 'Thrives in media, publishing, military, sports, and business entrepreneurship.',
          kn: 'ಮಾಧ್ಯಮ, ಬರವಣಿಗೆ, ಸೈನ್ಯ, ಕ್ರೀಡೆ ಹಾಗೂ ಸ್ವಂತ ಉದ್ಯಮದಲ್ಲಿ ಅಭೂತಪೂರ್ವ ಯಶಸ್ಸು.',
          hi: 'प्रकाशन, मीडिया, सैन्य बल एवं व्यापारिक उद्यम में उन्नति।'
        },
        relationshipsAndHealth: {
          en: 'May overshadow younger siblings; excellent immune constitution.',
          kn: 'ಕಿರಿಯ ಸಹೋದರರೊಂದಿಗೆ ಪ್ರೀತಿಯಿಂದ ಇರಬೇಕು; ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಉತ್ತಮವಾಗಿರುತ್ತದೆ.',
          hi: 'छोटे भाई-बहनों से स्नेह रखें; उत्तम स्वास्थ्य।'
        }
      },
      remedy: {
        action: { en: 'Practice daily Surya Namaskara and respect younger brothers.', kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯ ನಮಸ್ಕಾರ ಮಾಡಿ ಮತ್ತು ಕಿರಿಯರಿಗೆ ಪ್ರೋತ್ಸಾಹ ನೀಡಿ.', hi: 'नित्य सूर्य नमस्कार करें।' },
        mantra: 'ॐ ಮಿತ್ರಾಯ ನಮಃ, ॐ ರವಯೇ ನಮಃ (Om Mitraya Namah)',
        mantraCount: '12 rounds',
        charityDay: { en: 'Sunday (Red lentils or copper)', kn: 'ಭಾನುವಾರ (ಕೆಂಪು ತೊಗರಿ ಅಥವಾ ತಾಮ್ರ)', hi: 'रविवार' }
      }
    },
    4: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 4,
      bhavaName: { en: '4th House (Sukha & Matru Bhava)', kn: '೪ನೇ ಭಾವ (ಸುಖ & ಮಾತೃ ಭಾವ)', hi: 'चतुर्थ भाव (सुख)' },
      title: { en: 'Sun in 4th House: Real Estate Power with Restless Mind', kn: '೪ರಲ್ಲಿ ಸೂರ್ಯ: ಆಸ್ತಿ-ವಾಹನ ಭಾಗ್ಯ & ಆಂತರಿಕ ತುಡಿತ', hi: 'चतुर्थ भाव में सूर्य: भूमि-भवन सुख' },
      nature: 'Mixed',
      natureLocalized: { en: 'Mixed (Fiery Graha in Watery House)', kn: 'ಮಿಶ್ರ ಫಲ', hi: 'मिश्रित फल' },
      summary: {
        en: 'Grants grand residences, vehicles, and patrimonial properties, but Sun’s fierce heat can disrupt emotional calm and motherly warmth.',
        kn: 'ಭವ್ಯ ಮನೆ, ವಾಹನ ಮತ್ತು ಭೂಮಿ ಲಾಭ ನೀಡುತ್ತದೆ; ಆದರೆ ಅತಿಯಾದ ಆಂತರಿಕ ತಳಮಳ ಮತ್ತು ತಾಯಿಯ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಜಾಗ್ರತೆ ಅಗತ್ಯ.',
        hi: 'सम्पत्ति एवं वाहन लाभ किन्तु मानसिक चंचलता एवं माता के स्वास्थ्य की चिंता।'
      },
      effects: {
        general: {
          en: 'High status in hometown; may travel away from birthplace for career.',
          kn: 'ಹುಟ್ಟಿದೂರಿನಲ್ಲಿ ಪ್ರತಿಷ್ಠೆ, ವೃತ್ತಿಗಾಗಿ ದೂರದ ಊರು ಅಥವಾ ವಿದೇಶ ಪ್ರಯಾಣ.',
          hi: 'जन्मस्थान से दूर भाग्योदय एवं समाज में प्रतिष्ठा।'
        },
        careerAndWealth: {
          en: 'Success in real estate, mining, infrastructure, and public administration.',
          kn: 'ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಗಣಿಗಾರಿಕೆ, ಕೃಷಿ ಭೂಮಿ ಹಾಗೂ ಆಡಳಿತ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಧನಲಾಭ.',
          hi: 'भूमि, भवन, निर्माण एवं राजकीय ठेकेदारी में लाभ।'
        },
        relationshipsAndHealth: {
          en: 'Care for mother’s emotional wellbeing; monitor blood pressure and chest.',
          kn: 'ತಾಯಿಯವರನ್ನು ಗೌರವಿಸಿ; ರಕ್ತದೊತ್ತಡ ಮತ್ತು ಎದೆಯ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ನಿಗಾವಹಿಸಿ.',
          hi: 'माता की सेवा करें; रक्तचाप एवं हृदय का ध्यान रखें।'
        }
      },
      remedy: {
        action: { en: 'Respect mother daily, keep brass or copper vessel filled with water at home.', kn: 'ತಾಯಿಯ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ, ಮನೆಯಲ್ಲಿ ಹಿತ್ತಾಳೆ ಅಥವಾ ತಾಮ್ರದ ಕಲಶದಲ್ಲಿ ನೀರಿಡಿ.', hi: 'माता के चरण स्पर्श करें एवं ताम्बे के पात्र में जल रखें।' },
        mantra: 'ॐ ಭಾನವೇ ನಮಃ (Om Bhanave Namah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Offer milk and jaggery at temple)', kn: 'ಭಾನುವಾರ (ಹಾಲು-ಬೆಲ್ಲ ಸಮರ್ಪಣೆ)', hi: 'रविवार' }
      }
    },
    5: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 5,
      bhavaName: { en: '5th House (Putra & Buddhi Bhava)', kn: '೫ನೇ ಭಾವ (ಪುತ್ರ & ಬುದ್ಧಿ ಭಾವ)', hi: 'पंचम भाव (बुद्धि)' },
      title: { en: 'Sun in 5th House: Piercing Intellect, Mantra Siddhi & Advisory Acumen', kn: '೫ರಲ್ಲಿ ಸೂರ್ಯ: ತೀಕ್ಷ್ಣ ಮೇಧಾಶಕ್ತಿ & ಮಂತ್ರ ಸಿದ್ಧಿ', hi: 'पंचम भाव में सूर्य: कुशाग्र बुद्धि' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Auspicious Trikona', kn: 'ತ್ರಿಕೋಣ ಶುಭ', hi: 'त्रिकोण शुभ' },
      summary: {
        en: 'Blesses with profound intellect, philosophical insight, administrative advisory talent, and deep interest in Vedic mantras and governance.',
        kn: 'ತೀಕ್ಷ್ಣ ಬುದ್ಧಿ, ಮಂತ್ರ ಸಿದ್ಧಿ, ಆಡಳಿತಾತ್ಮಕ ಸಲಹೆಗಾರಿಕೆ ಮತ್ತು ಧಾರ್ಮಿಕ ಜ್ಞಾನ ನೀಡುತ್ತದೆ. ಮೊದಲ ಸಂತಾನಕ್ಕೆ ಸ್ವಲ್ಪ ವಿಳಂಬವಿರಬಹುದು.',
        hi: 'कुशाग्र बुद्धि, मन्त्र सिद्धि, राजनीतिक सूझबूझ एवं नीतिगत परामर्श क्षमता।'
      },
      effects: {
        general: {
          en: 'Sharp intuitive clarity, love for ancient scriptures, dignified offspring.',
          kn: 'ತೀಕ್ಷ್ಣ ಗ್ರಹಣ ಶಕ್ತಿ, ಶಾಸ್ತ್ರಾಧ್ಯಯನ, ಸಮಾಜದಲ್ಲಿ ಗೌರವಾನ್ವಿತ ವ್ಯಕ್ತಿತ್ವ.',
          hi: 'शास्त्र ज्ञान, दूरदर्शिता एवं आत्मसम्मान।'
        },
        careerAndWealth: {
          en: 'Excells as policy maker, political analyst, director, professor, or financial manager.',
          kn: 'ನೀತಿ ನಿರೂಪಕ, ರಾಜಕೀಯ ವಿಶ್ಲೇಷಕ, ಪ್ರಾಧ್ಯಾಪಕ, ನಿರ್ದೇಶಕ ಅಥವಾ ಹಿರಿಯ ಅಧಿಕಾರಿ.',
          hi: 'नीति निर्माता, प्राध्यापक, सलाहकार एवं वित्तीय प्रबन्धक।'
        },
        relationshipsAndHealth: {
          en: 'Watch stomach acidity and digestion; cultivate patience with children.',
          kn: 'ಜೀರ್ಣಾಂಗ, ಪಿತ್ತ ಮತ್ತು ಗ್ಯಾಸ್ಟ್ರಿಕ್ ಬಗ್ಗೆ ಗಮನವಿರಲಿ; ಮಕ್ಕಳೊಂದಿಗೆ ಪ್ರೀತಿಯಿಂದ ವರ್ತಿಸಿ.',
          hi: 'उदर विकार से बचें; सन्तान से सौहार्दपूर्ण सम्बन्ध रखें।'
        }
      },
      remedy: {
        action: { en: 'Recite Gayatri Mantra 108 times daily at sunrise.', kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯೋದಯದಲ್ಲಿ ಗಾಯತ್ರೀ ಮಂತ್ರವನ್ನು ೧೦೮ ಬಾರಿ ಜಪಿಸಿ.', hi: 'नित्य गायत्री मन्त्र का १०८ बार जप करें।' },
        mantra: 'ॐ ಭೂರ್ಭುವಃ ಸ್ವಃ ತತ್ಸವಿತುರ್ವರೇಣ್ಯಂ ಭರ್ಗೋ ದೇವಸ್ಯ ಧೀಮಹಿ ಧಿಯೋ ಯೋ ನಃ ಪ್ರಚೋದಯಾತ್',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate books or food to poor students)', kn: 'ಭಾನುವಾರ (ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪುಸ್ತಕ ಅಥವಾ ಅನ್ನದಾನ)', hi: 'रविवार' }
      }
    },
    6: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 6,
      bhavaName: { en: '6th House (Ripu, Roga & Rina)', kn: '೬ನೇ ಭಾವ (ಶತ್ರು, ರೋಗ & ಋಣ)', hi: 'षष्ठ भाव (शत्रु)' },
      title: { en: 'Sun in 6th House: Shatru Samhara & Unconquerable Immunity', kn: '೬ರಲ್ಲಿ ಸೂರ್ಯ: ಶತ್ರು ಸಂಹಾರ & ಅಪ್ರತಿಮ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ', hi: 'षष्ठ भाव में सूर्य: शत्रुहन्ता' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Highly Victorious (Upachaya)', kn: 'ಶತ್ರುನಾಶಕ ಪರಮ ಶುಭ', hi: 'अत्यंत विजयी' },
      summary: {
        en: 'Crushes rivals, clears long-standing debts, grants heroic legal victory, and endows extraordinary constitutional immunity against diseases.',
        kn: 'ಶತ್ರುಗಳನ್ನು ಧೂಳೀಪಟ ಮಾಡುತ್ತಾನೆ, ಸಾಲಗಳಿಂದ ಮುಕ್ತಿ, ನ್ಯಾಯಾಲಯ ವ್ಯಾಜ್ಯಗಳಲ್ಲಿ ಭರ್ಜರಿ ಜಯ ಮತ್ತು ಅದ್ಭುತ ಆರೋಗ್ಯ ಶಕ್ತಿ ನೀಡುತ್ತಾನೆ.',
        hi: 'शत्रुओं का दमन, ऋणमुक्ति, मुकदमों में विजय एवं अद्वितीय रोग प्रतिरोधक क्षमता।'
      },
      effects: {
        general: {
          en: 'Unyielding fighting spirit, respected by competitors, high service orientation.',
          kn: 'ಸೋಲನ್ನೊಪ್ಪದ ಛಲ, ಸ್ಪರ್ಧಿಗಳಲ್ಲಿ ನಡುಕ, ಸಮಾಜ ಸೇವಾ ಮನೋಭಾವ.',
          hi: 'अदम्य संघर्ष क्षमता एवं प्रतिस्पर्धियों पर प्रभुत्व।'
        },
        careerAndWealth: {
          en: 'Exceptional for medicine, surgery, law, armed forces, banking, and competitive exams.',
          kn: 'ವೈದ್ಯಕೀಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ವಕೀಲ ವೃತ್ತಿ, ರಕ್ಷಣಾ ಪಡೆ ಹಾಗೂ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಅಗ್ರಸ್ಥಾನ.',
          hi: 'चिकित्सा, विधि, रक्षा सेवा एवं प्रतियोगी परीक्षाओं में शीर्ष सफलता।'
        },
        relationshipsAndHealth: {
          en: 'Maternal uncles achieve prominence; keep digestion and kidney wellness balanced.',
          kn: 'ತಾಯಿಯ ಕಡೆಯ ಸಂಬಂಧಿಕರಲ್ಲಿ ಪ್ರಭಾವ; ಜೀರ್ಣಾಂಗ ಆರೋಗ್ಯ ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
          hi: 'मामा पक्ष से प्रतिष्ठा; आंतों के स्वास्थ्य का ध्यान रखें।'
        }
      },
      remedy: {
        action: { en: 'Offer daily water with red sandalwood to Surya; feed stray animals.', kn: 'ರಕ್ತಚಂದನ ಮಿಶ್ರಿತ ಜಲವನ್ನು ಸೂರ್ಯನಿಗೆ ಅರ್ಪಿಸಿ; ಪ್ರಾಣಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ.', hi: 'रक्तचन्दन युक्त जल से सूर्य को अर्घ्य दें।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ ಶತ್ರುನಾಶಾಯ ನಮಃ (Om Suryaya Namah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate jaggery or medicine to needy)', kn: 'ಭಾನುವಾರ (ಔಷಧ ಅಥವಾ ಬೆಲ್ಲ ದಾನ)', hi: 'रविवार' }
      }
    },
    7: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 7,
      bhavaName: { en: '7th House (Kalatra & Jaya Bhava)', kn: '೭ನೇ ಭಾವ (ಕಳತ್ರ & ಜಾಯಾ ಭಾವ)', hi: 'सप्तम भाव (विवाह)' },
      title: { en: 'Sun in 7th House: High Social Status with Marital Ego Tests', kn: '೭ರಲ್ಲಿ ಸೂರ್ಯ: ಸಾರ್ವಜನಿಕ ಗೌರವ & ದಾಂಪತ್ಯ ಸಮತೋಲನ', hi: 'सप्तम भाव में सूर्य: सामाजिक प्रतिष्ठा' },
      nature: 'Mixed',
      natureLocalized: { en: 'Mixed (Kendra / Maraka)', kn: 'ಮಿಶ್ರ ಫಲ', hi: 'मिश्रित फल' },
      summary: {
        en: 'Brings an ambitious, respectable, dignified spouse and public commercial prominence; requires conscious humility to avoid ego clashes in matrimony.',
        kn: 'ಪ್ರತಿಷ್ಠಿತ ಮತ್ತು ಗೌರವಾನ್ವಿತ ಸಂಗಾತಿ ಲಭಿಸುತ್ತಾರೆ. ಆದರೆ ದಾಂಪತ್ಯದಲ್ಲಿ ಅಹಂಕಾರ ಮತ್ತು ಬಿಗಿ ಮನೋಭಾವವನ್ನು ಬಿಟ್ಟು ಹೊಂದಾಣಿಕೆಯಿಂದ ಇರಬೇಕು.',
        hi: 'सम्मानित जीवनसाथी एवं व्यापारिक सफलता किन्तु वैवाहिक जीवन में अहंकार त्यागना आवश्यक।'
      },
      effects: {
        general: {
          en: 'Charismatic public appearance, influential partnerships with prominent figures.',
          kn: 'ಸಾರ್ವಜನಿಕ ವಲಯದಲ್ಲಿ ವರ್ಚಸ್ಸು, ಪ್ರಮುಖ ವ್ಯಕ್ತಿಗಳೊಂದಿಗೆ ವ್ಯವಹಾರ ಒಪ್ಪಂದಗಳು.',
          hi: 'सामाजिक प्रभाव एवं प्रभावशाली व्यक्तियों से साझेदारी।'
        },
        careerAndWealth: {
          en: 'Prosperity in international trade, diplomacy, consulting, and retail ventures.',
          kn: 'ವಿದೇಶಿ ವ್ಯಾಪಾರ, ರಾಜತಾಂತ್ರಿಕತೆ, ಸಮಾಲೋಚನೆ ಹಾಗೂ ಸಗಟು ವಾಣಿಜ್ಯದಲ್ಲಿ ಲಾಭ.',
          hi: 'विदेश व्यापार, कूटनीति एवं परामर्श व्यवसाय में लाभ।'
        },
        relationshipsAndHealth: {
          en: 'Cultivate patience with spouse; take care of lower abdomen and hydration.',
          kn: 'ಸಂಗಾತಿಯ ಅಭಿಪ್ರಾಯಗಳನ್ನು ಗೌರವಿಸಿ; ನೀರಿನಂಶ ಮತ್ತು ಕಿಬ್ಬೊಟ್ಟೆಯ ಆರೋಗ್ಯ ಕಾಪಾಡಿ.',
          hi: 'जीवनसाथी का आदर करें; जलीय सन्तुलन बनाए रखें।'
        }
      },
      remedy: {
        action: { en: 'Worship Goddess Parvati and Lord Shiva together; respect spouse unconditionally.', kn: 'ಪಾರ್ವತಿ-ಪರಮೇಶ್ವರರ ಕಲ್ಯಾಣ ಪೂಜೆ ಮಾಡಿ; ಸಂಗಾತಿಯನ್ನು ಗೌರವಿಸಿ.', hi: 'शिव-पार्वती की संयुक्त उपासना करें।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ (Om Suryaya Namah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate white sweets or ruby red items)', kn: 'ಭಾನುವಾರ (ಸಿಹಿ ತಿಂಡಿ ಅಥವಾ ಗೋಧಿ ದಾನ)', hi: 'रविवार' }
      }
    },
    8: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 8,
      bhavaName: { en: '8th House (Ayur & Randhra Bhava)', kn: '೮ನೇ ಭಾವ (ಆಯುರ್ & ರಂಧ್ರ ಭಾವ)', hi: 'अष्टम भाव (आयु)' },
      title: { en: 'Sun in 8th House: Esoteric Depth, Research Genius & Vitality Tests', kn: '೮ರಲ್ಲಿ ಸೂರ್ಯ: ಗೂಢ ಸಂಶೋಧನಾ ಶಕ್ತಿ & ಆಯುರ್ಬಲ ರಕ್ಷಣೆ', hi: 'अष्टम भाव में सूर्य: गूढ़ विद्या' },
      nature: 'Remedy Needed',
      natureLocalized: { en: 'Remedy Advised (Dusthana)', kn: 'ಶಾಂತಿ ಪರಿಹಾರ ಅಗತ್ಯ (ದುಃಸ್ಥಾನ)', hi: 'उपाय आवश्यक' },
      summary: {
        en: 'Draws the mind toward occult secrets, research, legacy wealth, and psychological transformations; requires steady care for eyesight, vitality, and heart.',
        kn: 'ಗುಪ್ತ ವಿದ್ಯೆಗಳು, ಜ್ಯೋತಿಷ್ಯ, ಸಂಶೋಧನೆ ಮತ್ತು ಆಕಸ್ಮಿಕ ಧನಲಾಭಕ್ಕೆ ಪ್ರೇರಣೆ. ಆದರೆ ದೈಹಿಕ ತೇಜಸ್ಸು, ಕಣ್ಣು ಮತ್ತು ರಕ್ತ ಪರಿಚಲನೆಗೆ ವಿಶೇಷ ರಕ್ಷಣೆ ಅಗತ್ಯ.',
        hi: 'गूढ़ विद्या, शोध एवं वसीयत से लाभ किन्तु नेत्र एवं जीवन शक्ति का ध्यान रखना आवश्यक।'
      },
      effects: {
        general: {
          en: 'Deep analytical discernment, ability to see through deception, interest in mysticism.',
          kn: 'ಮೋಸಗಳನ್ನು ತಕ್ಷಣ ಗುರುತಿಸುವ ಒಳನೋಟ, ಆಧ್ಯಾತ್ಮಿಕ ರಹಸ್ಯಗಳಲ್ಲಿ ಆಸಕ್ತಿ.',
          hi: 'गहन अन्तर्दृष्टि एवं आध्यात्मिक रहस्यों में रुचि।'
        },
        careerAndWealth: {
          en: 'Success in scientific research, forensics, insurance, tax audit, and archaeology.',
          kn: 'ವಿಜ್ಞಾನ ಸಂಶೋಧನೆ, ವಿಮೆ, ತೆರಿಗೆ ತನಿಖೆ, ಪುರಾತತ್ವ ಮತ್ತು ರಹಸ್ಯ ತನಿಖೆಯಲ್ಲಿ ಯಶಸ್ಸು.',
          hi: 'वैज्ञानिक शोध, बीमा, कर ऑडिट एवं पुरातत्व में सफलता।'
        },
        relationshipsAndHealth: {
          en: 'Monitor cardiac rhythm, eye health, and fever; avoid risky reckless actions.',
          kn: 'ಹೃದಯ, ಕಣ್ಣು ಹಾಗೂ ಉಷ್ಣ ಜ್ವರದ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ; ಸಾಹಸ ಚಟುವಟಿಕೆಗಳಲ್ಲಿ ಸುರಕ್ಷತೆ ಕಾಪಾಡಿ.',
          hi: 'नेत्र एवं हृदय स्वास्थ्य पर ध्यान दें; जोखिम से बचें।'
        }
      },
      remedy: {
        action: { en: 'Chant Mahamrityunjaya Mantra 11 times daily and drink water from copper cup.', kn: 'ಪ್ರತಿದಿನ ೧೧ ಬಾರಿ ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಜಪಿಸಿ, ತಾಮ್ರದ ಲೋಟದಲ್ಲಿ ನೀರು ಕುಡಿಯಿರಿ.', hi: 'नित्य महामृत्युंजय मन्त्र का जप करें।' },
        mantra: 'ॐ ತ್ರ್ಯಂಬಕಂ ಯಜಾಮಹೇ ಸುಗಂಧಿಂ ಪುಷ್ಟಿವರ್ಧನಮ್ • ಉರ್ವಾರುಕಮಿವ ಬಂಧನಾನ್ ಮೃತ್ಯೋರ್ಮುಕ್ಷೀಯ ಮಾಮೃತಾತ್',
        mantraCount: '11 or 108 times',
        charityDay: { en: 'Sunday (Donate copper, whole wheat, or red cloth to elderly)', kn: 'ಭಾನುವಾರ (ವೃದ್ಧಾಶ್ರಮಕ್ಕೆ ಗೋಧಿ ಅಥವಾ ತಾಮ್ರ ದಾನ)', hi: 'रविवार' }
      }
    },
    9: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 9,
      bhavaName: { en: '9th House (Bhagya & Dharma Bhava)', kn: '೯ನೇ ಭಾವ (ಭಾಗ್ಯ & ಧರ್ಮ ಭಾವ)', hi: 'नवम भाव (भाग्य)' },
      title: { en: 'Sun in 9th House: Supreme Fortune, Dharmic Wisdom & Guru Grace', kn: '೯ರಲ್ಲಿ ಸೂರ್ಯ: ಪರಮ ಭಾಗ್ಯೋದಯ, ಧರ್ಮ ನಿಷ್ಠೆ & ಗುರುಕೃಪೆ', hi: 'नवम भाव में सूर्य: परम भाग्य' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Supreme Trikona Blessing', kn: 'ಪರಮ ತ್ರಿಕೋಣ ಭಾಗ್ಯ', hi: 'परम त्रिकोण शुभ' },
      summary: {
        en: 'Blesses with divine fatherly grace, unwavering righteousness, pilgrimage journeys, higher philosophical wisdom, and widespread social honor.',
        kn: 'ತಂದೆ ಮತ್ತು ಗುರುಗಳ ಪೂರ್ಣ ಆಶೀರ್ವಾದ, ದೇವತಾ ಭಕ್ತಿ, ತೀರ್ಥಯಾತ್ರೆಗಳು, ಧರ್ಮ ಮಾರ್ಗ ಹಾಗೂ ಸಮಾಜದಲ್ಲಿ ಉನ್ನತ ಗೌರವ ಪ್ರಾಪ್ತಿ.',
        hi: 'पिता एवं गुरु कृपा, तीर्थाटन, धर्मनिष्ठा, उच्च ज्ञान एवं समाज में परम आदर।'
      },
      effects: {
        general: {
          en: 'Strong moral compass, philanthropic disposition, blessed by kuladevata and ancestors.',
          kn: 'ಉನ್ನತ ನೈತಿಕ ಮೌಲ್ಯಗಳು, ದಾನ-ಧರ್ಮ, ಕುಲದೈವದ ಅಪಾರ ಅನುಗ್ರಹ.',
          hi: 'सदाचार, दानशीलता एवं कुलदेवता की विशेष कृपा।'
        },
        careerAndWealth: {
          en: 'Thrives in university teaching, jurisprudence, spirituality, diplomacy, and global publishing.',
          kn: 'ನ್ಯಾಯಾಂಗ, ವಿಶ್ವವಿದ್ಯಾನಿಲಯ, ಆಧ್ಯಾತ್ಮಿಕ ಸಂಸ್ಥೆಗಳು, ಗ್ರಂಥ ಪ್ರಕಾಶನ ಹಾಗೂ ವಿದೇಶ ವ್ಯವಹಾರ.',
          hi: 'न्यायिक सेवा, उच्च शिक्षा, आध्यात्मिक नेतृत्व एवं प्रकाशन।'
        },
        relationshipsAndHealth: {
          en: 'Brings immense honor to father and teachers; robust physical vitality.',
          kn: 'ತಂದೆ ಮತ್ತು ಗುರುಗಳಿಗೆ ಹೆಮ್ಮೆ ತರುತ್ತಾರೆ; ಉತ್ತಮ ಆಯುರಾರೋಗ್ಯ.',
          hi: 'पिता व गुरु का मान बढ़ाएंगे; उत्तम स्वास्थ्य।'
        }
      },
      remedy: {
        action: { en: 'Touch father’s feet daily and visit Sun temples or Shiva shrines on Sundays.', kn: 'ಪ್ರತಿದಿನ ತಂದೆಯ ಪಾದ ಮುಟ್ಟಿ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ, ಭಾನುವಾರ ಶಿವನ ದರ್ಶನ ಮಾಡಿ.', hi: 'पिता के चरण स्पर्श करें एवं शिव दर्शन करें।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ, ॐ ಘೃಣಿಃ ಸೂರ್ಯ ಆದಿತ್ಯಃ (Om Ghrinih Surya Adityah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate saffron, wheat or brass bell at temple)', kn: 'ಭಾನುವಾರ (ದೇವಸ್ಥಾನಕ್ಕೆ ಕೇಸರಿ ಅಥವಾ ಗೋಧಿ ಸಮರ್ಪಣೆ)', hi: 'रविवार' }
      }
    },
    10: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 10,
      bhavaName: { en: '10th House (Karma & Rajya Bhava)', kn: '೧೦ನೇ ಭಾವ (ಕರ್ಮ & ರಾಜ್ಯ ಭಾವ)', hi: 'दशम भाव (कर्म)' },
      title: { en: 'Sun in 10th House: Digbala & Kuladipaka Yoga (Apex Authority)', kn: '೧೦ರಲ್ಲಿ ಸೂರ್ಯ: ಕುಲದೀಪಕ ರಾಜಯೋಗ & ಪರಮ ದಿಗ್ಬಲ', hi: 'दशम भाव में सूर्य: कुलदीपक योग' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Apex Directional Strength (Digbala)', kn: 'ಪರಮ ದಿಗ್ಬಲ ರಾಜಯೋಗ', hi: 'सर्वोच्च दिग्बल' },
      summary: {
        en: 'Gains maximum Directional Strength (Digbala) at the midheaven zenith! Bestows supreme executive status, government honors, leadership authority, and family elevation.',
        kn: 'ಆಕಾಶದ ನೆತ್ತಿಯಾದ ೧೦ನೇ ಮನೆಯಲ್ಲಿ ಸೂರ್ಯನಿಗೆ ಪರಮ ದಿಗ್ಬಲ! ಸರ್ಕಾರದ ಉನ್ನತ ಹುದ್ದೆ, ಆಡಳಿತ ಅಧಿಕಾರ, ರಾಜ ಸನ್ಮಾನ ಮತ್ತು ಇಡೀ ವಂಶವನ್ನು ಬೆಳಗಿಸುವ ಕುಲದೀಪಕ ಯೋಗ ನೀಡುತ್ತಾನೆ.',
        hi: 'दशम में सूर्य पूर्ण दिग्बली होकर कुलदीपक योग बनाता है। उच्च प्रशासनिक पद, राजसत्ता एवं कीर्ति प्रदान करता है।'
      },
      effects: {
        general: {
          en: 'Commanding leadership charisma, born to lead organizations, flawless administrative tact.',
          kn: 'ಜನ್ಮಜಾತ ನಾಯಕತ್ವದ ವರ್ಚಸ್ಸು, ಬೃಹತ್ ಸಂಸ್ಥೆಗಳನ್ನು ಮುನ್ನಡೆಸುವ ಅದ್ಭುತ ಸಾಮರ್ಥ್ಯ.',
          hi: 'जन्मजात नेतृत्व क्षमता एवं समाज में सर्वोच्च सम्मान।'
        },
        careerAndWealth: {
          en: 'IAS, IFS, cabinet minister, CEO, defense commander, royal physician, and industry titan.',
          kn: 'ಐಎಎಸ್, ಮಂತ್ರಿ, ಸಿಇಒ, ನ್ಯಾಯಾಧೀಶರು, ರಕ್ಷಣಾ ಪಡೆಗಳ ಕಮಾಂಡರ್ ಅಥವಾ ಪ್ರಮುಖ ಉದ್ಯಮಿ.',
          hi: 'प्रशासनिक सेवा, राजनेता, निदेशक एवं उद्योगपति।'
        },
        relationshipsAndHealth: {
          en: 'Enjoys immense societal respect; maintain humble empathy with subordinates.',
          kn: 'ಸಮಾಜದಲ್ಲಿ ಅಪಾರ ಮನ್ನಣೆ; ಕೆಳಗಿನ ಸಿಬ್ಬಂದಿಗಳೊಂದಿಗೆ ಕರುಣೆ ಮತ್ತು ಸೌಜನ್ಯದಿಂದ ವರ್ತಿಸಿ.',
          hi: 'अधीनस्थों से मधुर सम्बन्ध रखें; उत्तम शारीरिक ऊर्जा।'
        }
      },
      remedy: {
        action: { en: 'Offer daily morning Arghya to Surya with copper vessel, recite Aditya Hridaya Stotra.', kn: 'ಪ್ರತಿದಿನ ಸೂರ್ಯೋದಯದಲ್ಲಿ ತಾಮ್ರದ ಪಾತ್ರೆಯಿಂದ ಅರ್ಘ್ಯ ನೀಡಿ, ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಿಸಿ.', hi: 'नित्य प्रातः ताम्बे के पात्र से सूर्य को अर्घ्य दें।' },
        mantra: 'ॐ ಹ್ರೀಂ ಹ್ರೌಂ ಸೂರ್ಯಾಯ ನಮಃ (Aditya Hridaya Stotra)',
        mantraCount: 'Daily',
        charityDay: { en: 'Sunday (Donate copper utensils or support orphanages)', kn: 'ಭಾನುವಾರ (ತಾಮ್ರದ ಪಾತ್ರೆ ಅಥವಾ ಅನ್ನದಾನ)', hi: 'रविवार' }
      }
    },
    11: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 11,
      bhavaName: { en: '11th House (Labha & Aya Bhava)', kn: '೧೧ನೇ ಭಾವ (ಲಾಭ & ಆಯ ಭಾವ)', hi: 'एकादश भाव (लाभ)' },
      title: { en: 'Sun in 11th House: Monumental Wealth, High Influential Circle & Ambition Realization', kn: '೧೧ರಲ್ಲಿ ಸೂರ್ಯ: ಅಖಂಡ ಧನಲಾಭ & ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ', hi: 'एकादश भाव में सूर्य: महालाभ' },
      nature: 'Auspicious',
      natureLocalized: { en: 'Highly Auspicious (Upachaya)', kn: 'ಅತ್ಯುನ್ನತ ಶುಭ (ಲಾಭ ಸ್ಥಾನ)', hi: 'महाशुभ' },
      summary: {
        en: 'All malefics excel in the 11th house! Bestows multi-channel wealth streams, influential network of ministers and elites, elder sibling support, and realization of lifelong goals.',
        kn: '೧೧ನೇ ಮನೆಯಲ್ಲಿ ಸೂರ್ಯನು ಅಖಂಡ ಧನಾಗಮನ, ಪ್ರಭಾವಿ ಮಂತ್ರಿ-ಅಧಿಕಾರಿಗಳ ಸ್ನೇಹ, ಹಿರಿಯ ಸಹೋದರರ ಬೆಂಬಲ ಮತ್ತು ಎಲ್ಲಾ ಮಹತ್ವಾಕಾಂಕ್ಷೆಗಳ ಸಿದ್ಧಿ ನೀಡುತ್ತಾನೆ.',
        hi: 'एकादश भाव में सूर्य विपुल धन लाभ, उच्चाधिकारियों से मित्रता एवं मनोकामना पूर्ति कराता है।'
      },
      effects: {
        general: {
          en: 'Fulfill all aspirations, high social popularity, generous benefactor to society.',
          kn: 'ಸಕಲ ಇಷ್ಟಾರ್ಥಗಳ ಸಿದ್ಧಿ, ಸಮಾಜದಲ್ಲಿ ಜನಪ್ರಿಯತೆ, ಉದಾತ್ತ ದಾನಶೀಲತೆ.',
          hi: 'सर्व मनोकामना सिद्धि एवं सामाजिक प्रतिष्ठा।'
        },
        careerAndWealth: {
          en: 'Continuous profits from multiple business enterprises, government contracts, and investments.',
          kn: 'ಸರ್ಕಾರಿ ಗುತ್ತಿಗೆಗಳು, ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಷೇರು ಮಾರುಕಟ್ಟೆ ಹಾಗೂ ಬಹುಮುಖಿ ಉದ್ಯಮಗಳಿಂದ ನಿರಂತರ ಧನಲಾಭ.',
          hi: 'राजकीय अनुबंध, बहुमुखी व्यापार एवं भारी मुनाफा।'
        },
        relationshipsAndHealth: {
          en: 'Cordially connected with elder siblings; healthy immune resilience throughout life.',
          kn: 'ಹಿರಿಯ ಸಹೋದರರೊಂದಿಗೆ ಉತ್ತಮ ಬಾಂಧವ್ಯ; ಜೀವಮಾನವಿಡೀ ಉತ್ತಮ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ.',
          hi: 'बड़े भाई-बहनों से सहयोग; उत्तम स्वास्थ्य।'
        }
      },
      remedy: {
        action: { en: 'Feed sweet rotis to birds or cows on Sundays; contribute to community lighting.', kn: 'ಭಾನುವಾರ ಹಸು ಅಥವಾ ಪಕ್ಷಿಗಳಿಗೆ ಗೋಧಿ ರೊಟ್ಟಿ ತಿನ್ನಿಸಿ; ದೇವಸ್ಥಾನಕ್ಕೆ ದೀಪದ ಎಣ್ಣೆ ದಾನ ಮಾಡಿ.', hi: 'रविवार को गाय को मीठी रोटी खिलाएं।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ (Om Suryaya Namah)',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate jaggery, wheat, or yellow gold/copper to temple)', kn: 'ಭಾನುವಾರ (ಬೆಲ್ಲ, ಗೋಧಿ ದಾನ)', hi: 'रविवार' }
      }
    },
    12: {
      planet: 'Sun',
      planetName: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
      bhava: 12,
      bhavaName: { en: '12th House (Vyaya & Moksha Bhava)', kn: '೧೨ನೇ ಭಾವ (ವ್ಯಯ & ಮೋಕ್ಷ ಭಾವ)', hi: 'द्वादश भाव (मोक्ष)' },
      title: { en: 'Sun in 12th House: Spiritual Solitude, Foreign Horizons & Noble Expenditure', kn: '೧೨ರಲ್ಲಿ ಸೂರ್ಯ: ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ, ವಿದೇಶ ವಾಸ & ಸತ್ಕಾರ್ಯ ವ್ಯಯ', hi: 'द्वादश भाव में सूर्य: विदेश वास' },
      nature: 'Remedy Needed',
      natureLocalized: { en: 'Spiritual / Remedy Advised', kn: 'ಆಧ್ಯಾತ್ಮಿಕ / ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ', hi: 'उपाय आवश्यक' },
      summary: {
        en: 'Channels the soul toward spiritual contemplation, meditation, foreign lands, and noble charitable deeds. May create eye strain, sleeplessness, or high expenditures.',
        kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಧ್ಯಾನ, ವಿದೇಶ ವಾಸ್ತವ್ಯ ಹಾಗೂ ಧರ್ಮಕಾರ್ಯಗಳಿಗೆ ಖರ್ಚು ಮಾಡಿಸುತ್ತಾನೆ. ಆದರೆ ಕಣ್ಣಿನ ದೃಷ್ಟಿ, ನಿದ್ರೆ ಮತ್ತು ಅನಗತ್ಯ ಖರ್ಚುಗಳ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ವಹಿಸಬೇಕು.',
        hi: 'आध्यात्मिक चिंतन, विदेश गमन एवं परोपकार में व्यय किन्तु नेत्र एवं अनिद्रा का ध्यान रखें।'
      },
      effects: {
        general: {
          en: 'Love for solitary contemplation, introspection, attraction to monasteries and ashrams.',
          kn: 'ಏಕಾಂತ ಧ್ಯಾನದಲ್ಲಿ ಆನಂದ, ಆಶ್ರಮ ಮತ್ತು ಹಿಮಾಲಯ ಯಾತ್ರೆಗಳಲ್ಲಿ ಆಸಕ್ತಿ.',
          hi: 'एकान्तप्रियता, ध्यान एवं आश्रम वास में रुचि।'
        },
        careerAndWealth: {
          en: 'Prosperity in foreign embassies, multinational corporations, hospital administration, and shipping.',
          kn: 'ವಿದೇಶಿ ರಾಯಭಾರ ಕಚೇರಿ, ಎಂಎನ್‌ಸಿ ಕಂಪನಿಗಳು, ಆಸ್ಪತ್ರೆ ಆಡಳಿತ ಹಾಗೂ ಹಡಗು ಸಾರಿಗೆ.',
          hi: 'दूतावास, बहुराष्ट्रीय कम्पनियां एवं विदेशी व्यापार में उन्नति।'
        },
        relationshipsAndHealth: {
          en: 'Care for left eye and regular sleep routines; avoid legal penalties through transparency.',
          kn: 'ಎಡಗಣ್ಣು ಮತ್ತು ನಿದ್ರೆಯ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿ; ತೆರಿಗೆ ಮತ್ತು ಲೆಕ್ಕಪತ್ರಗಳಲ್ಲಿ ಪಾರದರ್ಶಕತೆ ಕಾಪಾಡಿ.',
          hi: 'बाएं नेत्र एवं निद्रा का ध्यान रखें; करों में पारदर्शिता रखें।'
        }
      },
      remedy: {
        action: { en: 'Perform early morning meditation facing the East; donate brass or food to ashrams.', kn: 'ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಬೆಳಗಿನ ಜಾವ ಧ್ಯಾನ ಮಾಡಿ; ಆಶ್ರಮಗಳಿಗೆ ಧಾನ್ಯ ಅಥವಾ ತಾಮ್ರ ಪಾತ್ರೆ ದಾನ ನೀಡಿ.', hi: 'प्रातः पूर्व दिशा में बैठकर ध्यान करें।' },
        mantra: 'ॐ ಸೂರ್ಯಾಯ ನಮಃ • ॐ ನಮೋ ಭಗವತೇ ಸೂರ್ಯನಾರಾಯಣಾಯ',
        mantraCount: '108 daily',
        charityDay: { en: 'Sunday (Donate blankets or food at charitable hospitals)', kn: 'ಭಾನುವಾರ (ಆಸ್ಪತ್ರೆ ಅಥವಾ ಅನಾಥಾಶ್ರಮಕ್ಕೆ ದಾನ)', hi: 'रविवार' }
      }
    }
  }
};

// Helper function to dynamically generate or retrieve Graha-Bhava placement effect
export function getDetailedGrahaBhavaEffect(planetName: string, bhava: number): GrahaBhavaEffectItem {
  if (COMPLETE_GRAHA_BHAVA_EFFECTS[planetName]?.[bhava]) {
    return COMPLETE_GRAHA_BHAVA_EFFECTS[planetName][bhava];
  }

  // Synthesize authentic Parashari description for other Graha-Bhava placements
  const isKendra = [1, 4, 7, 10].includes(bhava);
  const isTrikona = [1, 5, 9].includes(bhava);
  const isDusthana = [6, 8, 12].includes(bhava);
  const isUpachaya = [3, 6, 10, 11].includes(bhava);

  const nature: 'Auspicious' | 'Mixed' | 'Remedy Needed' = 
    isTrikona || (isKendra && ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(planetName)) || (isUpachaya && ['Mars', 'Saturn', 'Rahu'].includes(planetName))
      ? 'Auspicious'
      : isDusthana && !['Mars', 'Saturn', 'Rahu'].includes(planetName) && bhava !== 12 && planetName !== 'Venus'
      ? 'Remedy Needed'
      : 'Mixed';

  const natureLocalized: LocalizedString = {
    en: nature === 'Auspicious' ? 'Auspicious (Shubha)' : nature === 'Mixed' ? 'Mixed Influence (Mishra)' : 'Remedy Advised (Parihara)',
    kn: nature === 'Auspicious' ? 'ಶುಭ ಫಲದಾಯಕ (ಉತ್ತಮ)' : nature === 'Mixed' ? 'ಮಿಶ್ರ ಪ್ರಭಾವ' : 'ಶಾಂತಿ ಪರಿಹಾರ ಅಗತ್ಯ',
    hi: nature === 'Auspicious' ? 'शुभ फल' : nature === 'Mixed' ? 'मिश्रित फल' : 'उपाय आवश्यक'
  };

  const planetTitlesKn: Record<string, string> = {
    Sun: 'ಸೂರ್ಯ', Moon: 'ಚಂದ್ರ', Mars: 'ಕುಜ (ಮಂಗಳ)', Mercury: 'ಬುಧ',
    Jupiter: 'ಗುರು (ಬೃಹಸ್ಪತಿ)', Venus: 'ಶುಕ್ರ', Saturn: 'ಶನಿ', Rahu: 'ರಾಹು', Ketu: 'ಕೇತು'
  };

  const planetTitlesEn: Record<string, string> = {
    Sun: 'Sun (Surya)', Moon: 'Moon (Chandra)', Mars: 'Mars (Mangala)', Mercury: 'Mercury (Budha)',
    Jupiter: 'Jupiter (Guru)', Venus: 'Venus (Shukra)', Saturn: 'Saturn (Shani)', Rahu: 'Rahu (North Node)', Ketu: 'Ketu (South Node)'
  };

  const bhavaNamesKn: Record<number, string> = {
    1: '೧ನೇ ಭಾವ (ತನು / ಲಗ್ನ)', 2: '೨ನೇ ಭಾವ (ಧನ & ಕುಟುಂಬ)', 3: '೩ನೇ ಭಾವ (ಸಹಜ & ಶೌರ್ಯ)',
    4: '೪ನೇ ಭಾವ (ಮಾತೃ & ಸುಖ)', 5: '೫ನೇ ಭಾವ (ಪುತ್ರ & ಬುದ್ಧಿ)', 6: '೬ನೇ ಭಾವ (ಶತ್ರು-ರೋಗ-ಋಣ)',
    7: '೭ನೇ ಭಾವ (ಕಳತ್ರ & ದಾಂಪತ್ಯ)', 8: '೮ನೇ ಭಾವ (ಆಯುರ್ & ರಂಧ್ರ)', 9: '೯ನೇ ಭಾವ (ಭಾಗ್ಯ & ಧರ್ಮ)',
    10: '೧೦ನೇ ಭಾವ (ಕರ್ಮ & ಕೀರ್ತಿ)', 11: '೧೧ನೇ ಭಾವ (ಲಾಭ & ಆಯ)', 12: '೧೨ನೇ ಭಾವ (ವ್ಯಯ & ಮೋಕ್ಷ)'
  };

  const pNameKn = planetTitlesKn[planetName] || planetName;
  const pNameEn = planetTitlesEn[planetName] || planetName;
  const bNameKn = bhavaNamesKn[bhava] || `${bhava}ನೇ ಭಾವ`;

  // Specific classical interpretations for Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
  let summaryEn = `${pNameEn} in House #${bhava} activates this life sphere with its distinct astrological energies.`;
  let summaryKn = `${pNameKn} ಗ್ರಹವು ${bNameKn}ದಲ್ಲಿ ಸ್ಥಿತವಾಗಿ, ಈ ಕ್ಷೇತ್ರದ ಮೇಲೆ ತನ್ನ ನೈಸರ್ಗಿಕ ಶಕ್ತಿಯನ್ನು ಬೀರುತ್ತದೆ.`;

  if (planetName === 'Moon') {
    if (bhava === 4) {
      summaryEn = 'Attains full Directional Strength (Digbala)! Endows boundless maternal love, domestic peace, vehicles, and popularity.';
      summaryKn = '೪ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರನಿಗೆ ಸಂಪೂರ್ಣ ದಿಗ್ಬಲ! ಅಪಾರ ಮನಶ್ಶಾಂತಿ, ತಾಯಿಯ ಪ್ರೀತಿ, ಸುಂದರ ಮನೆ, ವಾಹನ ಸುಖ ಮತ್ತು ಸಮಾಜದಲ್ಲಿ ಎಲ್ಲರ ಪ್ರೀತಿ ಲಭಿಸುತ್ತದೆ.';
    } else if (bhava === 1) {
      summaryEn = 'Radiant, gentle, charismatic appearance, magnetic social charm, poetic imagination, and emotional sensitivity.';
      summaryKn = 'ಆಕರ್ಷಕ ಸೌಂದರ್ಯ, ಮೃದು ಸ್ವಭಾವ, ಕಾವ್ಯಾತ್ಮಕ ಕಲ್ಪನೆ, ಅಪಾರ ಜನಪ್ರಿಯತೆ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಭಾವನೆಗಳು.';
    } else if (bhava === 2) {
      summaryEn = 'Sweet, melodious speech, wealth accumulated from family resources, love for delicious dining and hospitality.';
      summaryKn = 'ಮಧುರ ವಾಣಿ, ಸುಂದರ ಮುಖ, ಧನ ಸಂಪತ್ತು ಹಾಗೂ ಉತ್ತಮ ಆತಿಥ್ಯ ನೀಡುವ ಗುಣ.';
    } else if (bhava === 5) {
      summaryEn = 'Purva Punya blessing! Sharp creative intuition, virtuous children, devotion to divine Mother, and speculative luck.';
      summaryKn = 'ಪೂರ್ವ ಪುಣ್ಯ ಫಲ! ಕಲಾತ್ಮಕ ಸೃಜನಶೀಲತೆ, ಸದ್ಗುಣ ಸಂಪನ್ನ ಸಂತಾನ ಹಾಗೂ ದೇವೀ ಭಕ್ತಿ.';
    } else if (bhava === 9) {
      summaryEn = 'Fortune through pilgrimages, higher wisdom, noble motherly guidance, and divine protection.';
      summaryKn = 'ತೀರ್ಥಯಾತ್ರೆಗಳ ಮೂಲಕ ಭಾಗ್ಯೋದಯ, ಉನ್ನತ ಧಾರ್ಮಿಕ ಚಿಂತನೆ ಮತ್ತು ತಾಯಿಯ ಆಶೀರ್ವಾದ.';
    } else if (bhava === 10) {
      summaryEn = 'High public visibility, respected government or social welfare position, caring professional leadership.';
      summaryKn = 'ಸಾರ್ವಜನಿಕ ಪ್ರಸಿದ್ಧಿ, ಜನಪ್ರಿಯ ನಾಯಕತ್ವ ಮತ್ತು ಸಮಾಜ ಕಲ್ಯಾಣ ವೃತ್ತಿಯಲ್ಲಿ ಉನ್ನತಿ.';
    } else if (bhava === 11) {
      summaryEn = 'Abundant regular profits, influential maternal friends, fulfillment of cherished desires and celebrations.';
      summaryKn = 'ವಿಪುಲ ಆದಾಯ, ಹಿರಿಯರ ಬೆಂಬಲ ಮತ್ತು ಸಕಲ ಇಷ್ಟಾರ್ಥಗಳ ಸಿದ್ಧಿ.';
    }
  } else if (planetName === 'Mars') {
    if (bhava === 10) {
      summaryEn = 'Attains pinnacle Digbala! Kuladipaka executive status, military/police command, engineering mastery, and victory over all rivals.';
      summaryKn = '೧೦ನೇ ಮನೆಯಲ್ಲಿ ಕುಜನಿಗೆ ಪರಮ ದಿಗ್ಬಲ! ಕುಲದೀಪಕ ರಾಜಯೋಗ, ತಾಂತ್ರಿಕ-ಎಂಜಿನಿಯರಿಂಗ್ ಯಶಸ್ಸು, ರಕ್ಷಣಾ ಪಡೆಗಳ ನಾಯಕತ್ವ ಮತ್ತು ಶತ್ರುನಾಶ.';
    } else if (bhava === 1) {
      summaryEn = 'Athletic physique, brave warrior instincts, head-first initiative, fiery determination; check impatience.';
      summaryKn = 'ಅಪ್ರತಿಮ ಧೈರ್ಯ, ಕ್ರೀಡಾ ಶಕ್ತಿ, ಸಾಹಸ ಮನೋಭಾವ; ಆತುರದ ಕೋಪವನ್ನು ನಿಯಂತ್ರಿಸಬೇಕು.';
    } else if (bhava === 3) {
      summaryEn = 'Supreme valor in Upachaya! Fearless stamina, technological brilliance, independent entrepreneurship.';
      summaryKn = 'ಉಪಚಯದಲ್ಲಿ ಪರಮ ಸಾಹಸ! ಅಚಲ ಧೈರ್ಯ, ತಾಂತ್ರಿಕ ನೈಪುಣ್ಯ ಮತ್ತು ಸ್ವಂತ ಪರಿಶ್ರಮದಿಂದ ವಿಜಯ.';
    } else if (bhava === 6) {
      summaryEn = 'Shatru Samhara Yoga! Demolishes rivals and legal opposition, clears debts, thrives in competitive environments.';
      summaryKn = 'ಶತ್ರು ಸಂಹಾರ ಯೋಗ! ನ್ಯಾಯಾಲಯ ವಿವಾದಗಳಲ್ಲಿ ಗೆಲುವು, ಸಾಲ ಪರಿಹಾರ ಮತ್ತು ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ ವಿಜಯ.';
    } else if (bhava === 11) {
      summaryEn = 'Massive financial returns from real estate, industrial enterprises, and brotherly ventures.';
      summaryKn = 'ಭೂಮಿ, ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಕಾರ್ಖಾನೆ ಮತ್ತು ತಂತ್ರಜ್ಞಾನದಿಂದ ಬೃಹತ್ ಧನಲಾಭ.';
    }
  } else if (planetName === 'Jupiter') {
    if (bhava === 1) {
      summaryEn = 'Hamsa Mahapurusha Yoga & Digbala! Divine armor neutralizing hundreds of doshas; brings supreme wisdom and honor.';
      summaryKn = 'ಲಗ್ನದಲ್ಲಿ ಗುರು ಪರಮ ದಿಗ್ಬಲಿ! ಹಂಸ ಮಹಾಪುರುಷ ರಾಜಯೋಗ, ಕೋಟಿ ದೋಷಗಳನ್ನು ನಿವಾರಿಸುವ ದೈವಿಕ ರಕ್ಷಣೆ, ಬ್ರಹ್ಮ ತೇಜಸ್ಸು ಮತ್ತು ಸಕಲ ಗೌರವ.';
    } else if (bhava === 5 || bhava === 9) {
      summaryEn = 'Supreme Trikona grace! Virtuous progeny, profound Vedic wisdom, mantra siddhi, and grand auspicious fortune.';
      summaryKn = 'ಪರಮ ತ್ರಿಕೋಣ ಲಕ್ಷ್ಮೀ ಸ್ಥಾನ! ಶ್ರೇಷ್ಠ ಸಂತಾನ ಭಾಗ್ಯ, ಮಂತ್ರ ಸಿದ್ಧಿ, ದೈವ ಕೃಪೆ ಮತ್ತು ಸಕಲ ಸುಖ-ಸಂಪತ್ತು.';
    } else if (bhava === 2) {
      summaryEn = 'Vast accumulated wealth, truthful and inspiring speech, blessed lineage, and scholarly respect.';
      summaryKn = 'ಅಪಾರ ಧನ ಸಂಪತ್ತು, ಸತ್ಯನಿಷ್ಠ ವಾಣಿ, ವಿದ್ವತ್ ಸಭೆಯಲ್ಲಿ ಗೌರವ ಮತ್ತು ಕುಟುಂಬ ಸೌಖ್ಯ.';
    } else if (bhava === 10) {
      summaryEn = 'Ethical judiciary, ministerial advisory, chancellor, righteous leadership, and lasting legacy.';
      summaryKn = 'ನ್ಯಾಯಾಧೀಶರು, ಮಂತ್ರಿಗಳು, ಕುಲಪತಿಗಳು ಹಾಗೂ ಸಾರ್ವಜನಿಕ ಧರ್ಮ ನಾಯಕತ್ವದಲ್ಲಿ ಉನ್ನತಿ.';
    } else if (bhava === 11) {
      summaryEn = 'Unending treasury of wealth, noble children, virtuous associates, and divine wish fruition.';
      summaryKn = 'ಅಕ್ಷಯ ಧನ ಭಂಡಾರ, ಸಕಲ ಕಾರ್ಯ ಸಿದ್ಧಿ ಮತ್ತು ಸಮಾಜದ ಗಣ್ಯರ ಪೂರ್ಣ ಬೆಂಬಲ.';
    }
  } else if (planetName === 'Venus') {
    if (bhava === 12) {
      summaryEn = 'Exalted luxury and bed pleasures! Exceptional artistic pleasures, international travels, and elegant prosperity.';
      summaryKn = '೧೨ರಲ್ಲಿ ಶುಕ್ರನು ಪರಮ ಆನಂದದಾಯಕ! ಭೋಗ-ಭಾಗ್ಯ, ಶಯನ ಸುಖ, ವಿದೇಶ ಯಾನ ಹಾಗೂ ಕಲಾತ್ಮಕ ಸಮೃದ್ಧಿ.';
    } else if (bhava === 1) {
      summaryEn = 'Malavya Yoga! Radiant physical allure, refined taste in fine arts, music, scents, and magnetic charisma.';
      summaryKn = 'ಮಾಳವ್ಯ ರಾಜಯೋಗ! ಅದ್ಭುತ ಆಕರ್ಷಣೆ, ಸಂಗೀತ-ಸಾಹಿತ್ಯದಲ್ಲಿ ನೈಪುಣ್ಯ, ಸುಖ-ಶಾಂತಿ ಮತ್ತು ಸೌಂದರ್ಯ.';
    } else if (bhava === 4) {
      summaryEn = 'Palatial house, luxury modern vehicles, harmonious domestic bliss, and generous hospitality.';
      summaryKn = 'ಭವ್ಯ ಗೃಹ, ಸುಂದರ ವಾಹನಗಳು, ತಾಯಿಯ ವಾತ್ಸಲ್ಯ ಮತ್ತು ಅಪಾರ ಸುಖ-ಶಾಂತಿ.';
    } else if (bhava === 7) {
      summaryEn = 'Deep conjugal bliss, charming and loving spouse, flourishing trade and artistic partnerships.';
      summaryKn = 'ಸುಖಕರ ದಾಂಪತ್ಯ, ಸುಂದರ-ಗುಣವಂತ ಸಂಗಾತಿ ಮತ್ತು ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆಯಲ್ಲಿ ಯಶಸ್ಸು.';
    }
  } else if (planetName === 'Saturn') {
    if (bhava === 7) {
      summaryEn = 'Attains Western Digbala! Sasa Yoga potential; imparts lifelong matrimonial fidelity, maturity, and steadfast business partnerships.';
      summaryKn = '೭ನೇ ಭಾವದಲ್ಲಿ ಶನಿಗೆ ಪಶ್ಚಿಮ ದಿಗ್ಬಲ! ದಾಂಪತ್ಯದಲ್ಲಿ ಅಚಲ ನಿಷ್ಠೆ, ಪ್ರಬುದ್ಧತೆ ಮತ್ತು ಶಾಶ್ವತ ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ.';
    } else if (bhava === 8) {
      summaryEn = 'Supreme Ayushya Karaka! Bestows exceptional longevity (Deerghayushya), crisis resilience, and deep research mastery.';
      summaryKn = '೮ರಲ್ಲಿ ಶನಿ ಆಯುಷ್ಕಾರಕ! ದೀರ್ಘಾಯುಷ್ಯ, ಆಪತ್ತುಗಳನ್ನು ಮೆಟ್ಟಿ ನಿಲ್ಲುವ ತಾಳ್ಮೆ ಮತ್ತು ಗೂಢ ಸಂಶೋಧನಾ ಜ್ಞಾನ.';
    } else if (bhava === 3 || bhava === 6 || bhava === 11) {
      summaryEn = 'Supreme Upachaya blessing! Crushes opponents, builds monumental enduring wealth through tireless discipline.';
      summaryKn = 'ಉಪಚಯದಲ್ಲಿ ಶನಿ ಅದ್ಭುತ ಶುಭ! ಶತ್ರುನಾಶ, ಕಠಿಣ ಪರಿಶ್ರಮದಿಂದ ಸ್ಥಿರ ಆಸ್ತಿ ಮತ್ತು ಸಮಾಜದ ಜನಬೆಂಬಲ.';
    } else if (bhava === 10) {
      summaryEn = 'Rises from grassroots to high political or industrial leadership through disciplined hard work.';
      summaryKn = 'ತಳಮಟ್ಟದಿಂದ ಉನ್ನತ ರಾಜಕೀಯ ಅಥವಾ ಕೈಗಾರಿಕಾ ಆಡಳಿತಕ್ಕೆ ಏರುವ ಅದ್ಭುತ ಕರ್ಮಯೋಗಿ.';
    }
  } else if (planetName === 'Mercury') {
    if (bhava === 1) {
      summaryEn = 'Bhadra Mahapurusha Yoga! Youthful radiance, quick mathematical intellect, eloquence, and sharp humor.';
      summaryKn = 'ಭದ್ರ ಮಹಾಪುರುಷ ಯೋಗ! ಚಿರಯೌವನ, ತೀಕ್ಷ್ಣ ಗಣಿತ ಬುದ್ಧಿ, ಹಾಸ್ಯಪ್ರಜ್ಞೆ ಮತ್ತು ಮಾತುಗಾರಿಕೆ.';
    } else if (bhava === 2) {
      summaryEn = 'Saraswati Yoga! Eloquent multi-lingual speaker, gifted financial auditor, and commercial genius.';
      summaryKn = 'ಸರಸ್ವತೀ ಯೋಗ! ಮಧುರ ವಾಕ್ಚಾತುರ್ಯ, ಬಹುಭಾಷಾ ಪಾಂಡಿತ್ಯ ಮತ್ತು ವ್ಯಾಪಾರ ಬುದ್ಧಿ.';
    } else if (bhava === 5) {
      summaryEn = 'Brilliant astrological, literary, and coding abilities; blessed with clever children.';
      summaryKn = 'ಜ್ಯೋತಿಷ್ಯ, ಗಣಿತ, ಸಾಹಿತ್ಯ ಹಾಗೂ ಸಾಫ್ಟ್‌ವೇರ್‌ನಲ್ಲಿ ಅಗಾಧ ಪ್ರತಿಭೆ.';
    } else if (bhava === 10) {
      summaryEn = 'Prominent journalist, publisher, chartered accountant, or software technology executive.';
      summaryKn = 'ಪತ್ರಿಕೋದ್ಯಮ, ಪ್ರಕಾಶನ, ಚಾರ್ಟರ್ಡ್ ಅಕೌಂಟೆಂಟ್ ಅಥವಾ ತಂತ್ರಜ್ಞಾನ ನಾಯಕತ್ವ.';
    }
  } else if (planetName === 'Rahu') {
    if (bhava === 3 || bhava === 6 || bhava === 10 || bhava === 11) {
      summaryEn = 'Sensational worldly rise! Overcomes competitors, gains unprecedented wealth, foreign prominence, and tech innovation.';
      summaryKn = 'ಉಪಚಯದಲ್ಲಿ ರಾಹು ಅದ್ಭುತ ಜಯ! ಸ್ಪರ್ಧಿಗಳ ಮೇಲೆ ಅಪ್ರತಿಮ ಗೆಲುವು, ವಿದೇಶ ಲಾಭ, ತಂತ್ರಜ್ಞಾನ ನಾವೀನ್ಯತೆ ಮತ್ತು ಅಪಾರ ಧನಾಗಮನ.';
    } else {
      summaryEn = 'Creates intense ambition and out-of-the-box unconventional approaches in this life arena.';
      summaryKn = 'ಈ ಜೀವನ ಕ್ಷೇತ್ರದಲ್ಲಿ ವಿಭಿನ್ನ ಮತ್ತು ನವೀನ ಆಲೋಚನೆಗಳ ಮೂಲಕ ಹೊಸ ಹಾದಿ ತುಳಿಯುವ ಮನೋಭಾವ.';
    }
  } else if (planetName === 'Ketu') {
    if (bhava === 12) {
      summaryEn = 'The Moksha Karaka in Moksha Bhava! Supreme spiritual liberation, divine detachment, and cosmic surrender.';
      summaryKn = 'ಮೋಕ್ಷಕಾರಕ ಕೇತುವು ಮೋಕ್ಷ ಭಾವದಲ್ಲಿ! ಪರಮ ಆಧ್ಯಾತ್ಮಿಕ ಮುಕ್ತಿ, ವೈರಾಗ್ಯ, ಕುಂಡಲಿನೀ ಜಾಗೃತಿ ಮತ್ತು ಭಗವತ್ ಕೃಪೆ.';
    } else if (bhava === 8) {
      summaryEn = 'Deep psychic perception, mastery over astrology and occult, transcendence of fear of transformation.';
      summaryKn = 'ಅಂತಃಪ್ರಜ್ಞೆ, ಜ್ಯೋತಿಷ್ಯ-ಮಂತ್ರ ರಹಸ್ಯಗಳ ಅರಿವು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ.';
    } else {
      summaryEn = 'Detaches the native from worldly vanity, steering the soul toward spiritual contemplation.';
      summaryKn = 'ಲೌಕಿಕ ಆಡಂಬರದಿಂದ ಮುಕ್ತಿ ನೀಡಿ, ಆಂತರಿಕ ಆಧ್ಯಾತ್ಮಿಕ ಶಾಂತಿಯತ್ತ ಮನಸ್ಸನ್ನು ಪ್ರೇರೇಪಿಸುತ್ತದೆ.';
    }
  }

  const defaultMantras: Record<string, string> = {
    Sun: 'ॐ ಹ್ರಾಂ ಹ್ರೀಂ ಹ್ರೌಂ ಸಃ ಸೂರ್ಯಾಯ ನಮಃ',
    Moon: 'ॐ ಶ್ರಾಂ ಶ್ರೀಂ ಶ್ರೌಂ ಸಃ ಚಂದ್ರಮಸೇ ನಮಃ',
    Mars: 'ॐ ಕ್ರಾಂ ಕ್ರೀಂ ಕ್ರೌಂ ಸಃ ಭೌಮಾಯ ನಮಃ',
    Mercury: 'ॐ ಬ್ರಾಂ ಬ್ರೀಂ ಬ್ರೌಂ ಸಃ ಬುಧಾಯ ನಮಃ',
    Jupiter: 'ॐ ಗ್ರಾಂಗ್ ಗ್ರೀಂ ಗ್ರೌಂ ಸಃ ಗುರವೇ ನಮಃ',
    Venus: 'ॐ ದ್ರಾಂ ದ್ರೀಂ ದ್ರೌಂ ಸಃ ಶುಕ್ರಾಯ ನಮಃ',
    Saturn: 'ॐ ಪ್ರಾಂ ಪ್ರೀಂ ಪ್ರೌಂ ಸಃ ಶನೈಶ್ಚರಾಯ ನಮಃ',
    Rahu: 'ॐ ಭ್ರಾಂ ಭ್ರೀಂ ಭ್ರೌಂ ಸಃ ರಾಹವೇ ನಮಃ',
    Ketu: 'ॐ ಸ್ರಾಂ ಸ್ರೀಂ ಸ್ರೌಂ ಸಃ ಕೇತವೇ ನಮಃ'
  };

  const defaultCharityDays: Record<string, LocalizedString> = {
    Sun: { en: 'Sunday (Wheat, jaggery, copper)', kn: 'ಭಾನುವಾರ (ಗೋಧಿ, ಬೆಲ್ಲ, ತಾಮ್ರ)', hi: 'रविवार' },
    Moon: { en: 'Monday (Milk, rice, silver)', kn: 'ಸೋಮವಾರ (ಹಾಲು, ಅಕ್ಕಿ, ಬೆಳ್ಳಿ)', hi: 'सोमवार' },
    Mars: { en: 'Tuesday (Red lentils, jaggery, red coral)', kn: 'ಮಂಗಳವಾರ (ತೊಗರಿ, ಬೆಲ್ಲ, ಕೆಂಪು ವಸ್ತ್ರ)', hi: 'मंगलवार' },
    Mercury: { en: 'Wednesday (Green gram / Moong, green clothes)', kn: 'ಬುಧವಾರ (ಹೆಸರುಕಾಳು, ಹಸಿರು ವಸ್ತ್ರ)', hi: 'बुधवार' },
    Jupiter: { en: 'Thursday (Chana dal, turmeric, yellow sweets)', kn: 'ಗುರುವಾರ (ಕಡಲೆಕಾಳು, ಅರಿಶಿನ, ಹಳದಿ ಸಿಹಿ)', hi: 'गुरुवार' },
    Venus: { en: 'Friday (White rice, sugar, ghee, curd)', kn: 'ಶುಕ್ರವಾರ (ಅಕ್ಕಿ, ಸಕ್ಕರೆ, ತುಪ್ಪ, ಹಾಲು)', hi: 'शुक्रवार' },
    Saturn: { en: 'Saturday (Black sesame, mustard/sesame oil, iron)', kn: 'ಶನಿವಾರ (ಕಪ್ಪು ಎಳ್ಳು, ಎಳ್ಳೆಣ್ಣೆ, ಕಬ್ಬಿಣ)', hi: 'शनिवार' },
    Rahu: { en: 'Saturday / Wednesday (Black urad dal, coconut)', kn: 'ಶನಿವಾರ (ಉದ್ದಿನಕಾಳು, ಕಪ್ಪು ಕಂಬಳಿ, ತೆಂಗಿನಕಾಯಿ)', hi: 'शनिवार' },
    Ketu: { en: 'Tuesday / Thursday (Multi-colored blanket, sesame)', kn: 'ಮಂಗಳವಾರ (ಚಿತ್ರ-ವಿಚಿತ್ರ ಕಂಬಳಿ, ಬೆಕ್ಕು ಅಥವಾ ಶ್ವಾನ ಸೇವೆ)', hi: 'मंगलवार' }
  };

  return {
    planet: planetName,
    planetName: { en: pNameEn, kn: pNameKn, hi: planetName },
    bhava,
    bhavaName: { en: `House #${bhava}`, kn: bNameKn, hi: `${bhava}वां भाव` },
    title: {
      en: `${pNameEn} in ${bhava === 1 ? '1st' : bhava === 2 ? '2nd' : bhava === 3 ? '3rd' : `${bhava}th`} House: Classical Effects`,
      kn: `${bNameKn}ದಲ್ಲಿ ${pNameKn} ಗ್ರಹ: ಶಾಸ್ತ್ರೋಕ್ತ ಫಲಗಳು`,
      hi: `${bhava}वें भाव में ${pNameEn}: फल विचार`
    },
    nature,
    natureLocalized,
    summary: { en: summaryEn, kn: summaryKn, hi: summaryEn },
    effects: {
      general: {
        en: `${pNameEn} manifests in the ${bhava}th house domain, bringing focused karmic focus and characteristic results.`,
        kn: `${pNameKn} ಗ್ರಹವು ಈ ಭಾವದಲ್ಲಿ ತನ್ನ ಕಾರಕತ್ವದ ಪ್ರಭಾವವನ್ನು ಬೀರಲಿದ್ದು, ಕರ್ಮಾನುಸಾರ ವಿಶೇಷ ಫಲ ನೀಡುತ್ತದೆ.`,
        hi: `${pNameEn} इस भाव में अपने नैसर्गिक गुणों के अनुरूप फल प्रदान करता है।`
      },
      careerAndWealth: {
        en: `Influences career through this house. ${isKendra ? 'Kendra placement gives dynamic leadership.' : isTrikona ? 'Trikona placement gives effortless fortune.' : isUpachaya ? 'Upachaya gives continuous growth through effort.' : 'Calls for disciplined care.'}`,
        kn: `${isKendra ? 'ಕೇಂದ್ರ ಸ್ಥಾನದಲ್ಲಿರುವುದರಿಂದ ನಾಯಕತ್ವ ಮತ್ತು ಸ್ಥಿರತೆ ನೀಡುತ್ತದೆ.' : isTrikona ? 'ತ್ರಿಕೋಣ ಸ್ಥಾನವು ದೈವಾನುಗ್ರಹ ಮತ್ತು ಸುಲಭ ಧನಲಾಭ ತರುತ್ತದೆ.' : isUpachaya ? 'ಉಪಚಯ ಸ್ಥಾನವು ಪರಿಶ್ರಮದಿಂದ ನಿರಂತರ ಅಭಿವೃದ್ಧಿ ಕರುಣಿಸುತ್ತದೆ.' : 'ವೃತ್ತಿಯಲ್ಲಿ ಶಿಸ್ತು ಮತ್ತು ಜಾಗರೂಕತೆ ಅಪೇಕ್ಷಿಸುತ್ತದೆ.'}`,
        hi: `कार्यक्षेत्र में यह अनुकूल प्रभाव देता है।`
      },
      relationshipsAndHealth: {
        en: `Nurture harmony in relationships and maintain mindful health balance according to body organs ruled by House #${bhava}.`,
        kn: `ಈ ಭಾವವು ಪ್ರತಿನಿಧಿಸುವ ಶರೀರದ ಅಂಗಗಳ ಬಗ್ಗೆ ಗಮನಹರಿಸಿ, ಬಾಂಧವ್ಯದಲ್ಲಿ ಸೌಹಾರ್ದತೆ ಕಾಪಾಡಿಕೊಳ್ಳಿ.`,
        hi: `स्वास्थ्य एवं सम्बन्धों में सन्तुलन रखें।`
      }
    },
    remedy: {
      action: {
        en: `Chant Beeja mantra of ${planetName} 108 times daily and perform charity on its weekday.`,
        kn: `${pNameKn} ಗ್ರಹದ ಬೀಜ ಮಂತ್ರವನ್ನು ಪ್ರತಿದಿನ ೧೦೮ ಬಾರಿ ಜಪಿಸಿ ಮತ್ತು ವಾರದ ದಿನದಂದು ದಾನ ನೀಡಿ.`,
        hi: `${planetName} के बीज मन्त्र का जप एवं दान करें।`
      },
      mantra: defaultMantras[planetName] || 'ॐ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ',
      mantraCount: '108 daily',
      charityDay: defaultCharityDays[planetName] || { en: 'Saturday', kn: 'ಶನಿವಾರ', hi: 'शनिवार' }
    }
  };
}
