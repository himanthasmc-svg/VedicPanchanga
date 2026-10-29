import { KundaliData, Language, LocalizedString, PlanetPosition } from '../types';
import { PlanetaryBalaBreakdown } from './planetaryBala';

export interface GrahaRemedyNutritionProfile {
  planet: PlanetPosition;
  balaBreakdown?: PlanetaryBalaBreakdown;
  strengthCategory: 'strong' | 'moderate' | 'weak';
  strengthCategoryLocalized: LocalizedString;
  statusBadge: LocalizedString;
  currentHouseSignificance: LocalizedString;
  nutritionalTherapy: {
    dietaryPhilosophy: LocalizedString;
    superfoods: LocalizedString;
    targetedNutrients: LocalizedString;
    foodsToConsume: LocalizedString[];
    foodsToAvoid: LocalizedString[];
    herbalDecoctions: LocalizedString;
    optimalMealTimings: LocalizedString;
  };
  lifestyleRegimen: {
    idealDailyRoutine: LocalizedString;
    exerciseAndMovement: LocalizedString;
    sunAndNatureTherapy: LocalizedString;
    colorTherapy: LocalizedString;
    mindfulRelaxation: LocalizedString;
  };
  astrologicalRemedies: {
    primaryMantra: LocalizedString;
    beejaMantra: string;
    mantraCount: string;
    gemstoneAdvice: LocalizedString;
    rudrakshaMukhi: LocalizedString;
    daanamCharity: {
      items: LocalizedString;
      dayAndTime: LocalizedString;
      recipient: LocalizedString;
    };
    deityVeneration: LocalizedString;
    sacredRitual: LocalizedString;
  };
}

export function calculateGrahaRemedyNutrition(
  planet: PlanetPosition,
  kundaliData: KundaliData,
  bala?: PlanetaryBalaBreakdown
): GrahaRemedyNutritionProfile {
  const normName = planet.name.toLowerCase();
  const bhava = planet.bhava;
  const isRetro = planet.isRetrograde;
  const score = bala ? bala.totalScore : 60;

  let strengthCat: 'strong' | 'moderate' | 'weak' = 'moderate';
  if (score >= 70) strengthCat = 'strong';
  else if (score < 45) strengthCat = 'weak';

  // Localized strength category
  const strengthCatLoc: LocalizedString = {
    en: strengthCat === 'strong' ? 'High Strength (Balavan)' : strengthCat === 'weak' ? 'Requires Strengthening (Nirbala)' : 'Moderate Strength (Madhyama)',
    kn: strengthCat === 'strong' ? 'ಅತ್ಯುನ್ನತ ಬಲ (ಬಲವಾನ್)' : strengthCat === 'weak' ? 'ಪರಿಹಾರ ಅಪೇಕ್ಷಿತ ಬಲಹೀನ (ನಿರ್ಬಲ)' : 'ಮಧ್ಯಮ ಬಲ (ಮಧ್ಯಮ)',
    hi: strengthCat === 'strong' ? 'उच्च बल (बलवान)' : strengthCat === 'weak' ? 'उपाय योग्य (निर्बल)' : 'मध्यम बल'
  };

  // Determine status badge
  let statusBadge: LocalizedString = {
    en: `House ${bhava} • ${score}/100 Pts`,
    kn: `${bhava}ನೇ ಭಾವ • ${score}/೧೦೦ ಅಂಕಗಳು`,
    hi: `${bhava}वां भाव • ${score}/१०० अंक`
  };
  if (isRetro) {
    statusBadge = {
      en: `House ${bhava} • Retrograde (Vakri) • ${score}/100 Pts`,
      kn: `${bhava}ನೇ ಭಾವ • ವಕ್ರಿ (ಚೇಷ್ಟಾ ಬಲ) • ${score}/೧೦೦ ಅಂಕ`,
      hi: `${bhava}वां भाव • वक्री • ${score}/१०० अंक`
    };
  }

  // Generate customized profiles for each of the 9 Grahas based on House and Strength
  if (normName.includes('sun') || normName.includes('surya')) {
    const isWeak = strengthCat === 'weak' || [6, 8, 12].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Sun situated in House ${bhava} rules the vital life-force (Prana), spine, cardiac muscle, eyesight, and cellular mitochondrial energy. ${isWeak ? 'Requires gentle solar replenishment to counter fatigue and low Agni.' : 'Bestows radiant authority; manage excess internal Pitta heat.'}`,
        kn: `ಸೂರ್ಯನು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಪ್ರಾಣಶಕ್ತಿ, ಬೆನ್ನೆಲುಬು, ಹೃದಯ, ದೃಷ್ಟಿ ಹಾಗೂ ಜೀವಕೋಶೀಯ ಶಕ್ತಿಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ಆಯಾಸ ಮತ್ತು ಮಂದಾಗ್ನಿಯನ್ನು ನಿವಾರಿಸಲು ಸೂರ್ಯ ಶಕ್ತಿಯ ಪೋಷಣೆ ಅಗತ್ಯ.' : 'ಉನ್ನತ ವರ್ಚಸ್ಸು ಕರುಣಿಸುತ್ತಾನೆ; ದೇಹದಲ್ಲಿ ಅತಿಯಾಗುವ ಪಿತ್ತದ ಶಾಖವನ್ನು ಸಮತೋಲನದಲ್ಲಿಡಿ.'}`,
        hi: `सूर्य भाव ${bhava} में स्थित होकर प्राण शक्ति, हृदय, रीढ़ एवं नेत्र ज्योति का नियमन करते हैं। ${isWeak ? 'ऊर्जा वृद्धि हेतु सौर पोषण की आवश्यकता है।' : 'पित्त का शमन करते हुए आत्मबल बनाए रखें।'}`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: isWeak ? 'Agni-kindling, warm nourishing diet with golden grains, saffron, and natural solar foods.' : 'Cooling Pitta-pacifying diet with sweet fruits and cooling herbal infusions.',
          kn: isWeak ? 'ಜಠರಾಗ್ನಿ ವರ್ಧಕ, ಬಿಸಿ ಸಾತ್ವಿಕ ಆಹಾರ, ಕೇಸರಿ, ಗೋಧಿ ಮತ್ತು ಸೂರ್ಯ ರಶ್ಮಿ ಪೋಷಿತ ಆಹಾರ.' : 'ಪಿತ್ತ ಶಾಂತಿಗೊಳಿಸುವ ತಂಪಾದ ಸಾತ್ವಿಕ ಆಹಾರ, ದಾಳಿಂಬೆ ಹಾಗೂ ತಂಪಾದ ಗಿಡಮೂಲಿಕೆ ನೀರು.',
          hi: isWeak ? 'जठराग्नि वर्धक, उष्ण व सात्त्विक आहार, केसर एवं गेहूं।' : 'पित्त-शामक शीतल आहार एवं मीठे फल।'
        },
        superfoods: {
          en: 'Whole wheat, saffron, pomegranate, organic jaggery, cardamom, soaked dates, and ginger water.',
          kn: 'ಸಂಪೂರ್ಣ ಗೋಧಿ, ಕುಂಕುಮಕೇಸರಿ, ದಾಳಿಂಬೆ ಹಣ್ಣು, ಸಾವಯವ ಬೆಲ್ಲ, ಏಲಕ್ಕಿ, ನೆನೆಸಿದ ಒಣಖರ್ಜೂರ ಮತ್ತು ಶುಂಠಿ ನೀರು.',
          hi: 'गेहूं, केसर, अनार, देसी गुड़, इलायची एवं सोंठ का जल।'
        },
        targetedNutrients: {
          en: 'Vitamin D3 (solar synthesis), Vitamin B12, Magnesium for cardiac rhythm, and CoQ10.',
          kn: 'ವಿಟಮಿನ್ ಡಿ೩ (ಬೆಳಗಿನ ಸೂರ್ಯಸ್ನಾನ), ವಿಟಮಿನ್ ಬಿ೧೨, ಹೃದಯಕ್ಕೆ ಮೆಗ್ನೀಸಿಯಮ್, ಹಾಗೂ ಕೋ-ಎಂಜೈಮ್ ಕ್ಯೂ೧೦.',
          hi: 'विटामिन डी३, विटामिन बी१२, मैग्नीशियम एवं एंटीऑक्सीडेंट।'
        },
        foodsToConsume: [
          { en: 'Freshly prepared whole wheat chapati or porridge', kn: 'ತಾಜಾ ಗೋಧಿ ಚಪಾತಿ ಅಥವಾ ಬಿಸಿ ಗೋಧಿ ರವೆ ಉಪ್ಪಿಟ್ಟು', hi: 'ताजा गेहूं की रोटी या दलिया' },
          { en: 'A2 pure cow ghee in moderate quantities', kn: 'ಮಿತ ಪ್ರಮಾಣದಲ್ಲಿ ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ', hi: 'शुद्ध देसी गाय का घी' },
          { en: 'Fresh pomegranate juice and sweet oranges', kn: 'ದಾಳಿಂಬೆ ಹಣ್ಣಿನ ರಸ ಮತ್ತು ಸಿಹಿ ಕಿತ್ತಳೆ', hi: 'अनार का ताजा रस एवं संतरा' },
          { en: 'Water stored in pure copper vessel (Tamra Jala)', kn: 'ತಾಮ್ರದ ಪಾತ್ರೆಯಲ್ಲಿ ಶೇಖರಿಸಿದ ಶುದ್ಧ ನೀರು (ತಾಮ್ರ ಜಲ)', hi: 'तांबे के पात्र में रखा जल' }
        ],
        foodsToAvoid: [
          { en: 'Stale refrigerated food and frozen microwaved items', kn: 'ಫ್ರಿಡ್ಜ್‌ನಲ್ಲಿಟ್ಟ ತಂಗಳು ಆಹಾರ ಮತ್ತು ಅತಿಯಾದ ಶೀತಲ ತಿನಿಸು', hi: 'बासी एवं फ्रिज में रखा ठंडा भोजन' },
          { en: 'Excessive spicy deep-fried chilies and junk street food', kn: 'ಅತಿಯಾದ ಖಾರ, ಕರಿದ ಎಣ್ಣೆ ತಿಂಡಿಗಳು ಮತ್ತು ಜಂಕ್ ಫುಡ್', hi: 'अत्यधिक तीखा, तला-भुना एवं जंक फूड' },
          { en: 'Excess sour vinegar, artificial soda drinks, and smoking', kn: 'ಕೃತಕ ಸೋಡಾ ಪಾನೀಯಗಳು, ಸಿಗರೇಟ್ ಮತ್ತು ಅತಿಯಾದ ಕಾಫಿ', hi: 'कृत्रिम शीतल पेय एवं अत्यधिक चाय-कॉफी' }
        ],
        herbalDecoctions: {
          en: 'Morning lukewarm water with a pinch of ginger and saffron; Tulasi tea at sunrise.',
          kn: 'ಮುಂಜಾನೆ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿಗೆ ಚಿಟಿಕೆ ಶುಂಠಿ ಮತ್ತು ಕೇಸರಿ ದಳಗಳು; ಸೂರ್ಯೋದಯದ ಸಮಯದಲ್ಲಿ ತುಳಸಿ ಕಷಾಯ.',
          hi: 'प्रातः गुनगुने जल में सोंठ व केसर; तुलसी की चाय।'
        },
        optimalMealTimings: {
          en: 'Heaviest meal at solar peak noon (12:00 PM - 1:30 PM); light dinner strictly before 8:00 PM.',
          kn: 'ಸೂರ್ಯ ನೆತ್ತಿಯ ಮೇಲಿರುವ ಮಧ್ಯಾಹ್ನ ೧೨:೦೦ ರಿಂದ ೧:೩೦ ರೊಳಗೆ ಮುಖ್ಯ ಊಟ; ರಾತ್ರಿ ೮:೦೦ ಗಂಟೆಯ ಮೊದಲು ಹಗುರ ಆಹಾರ.',
          hi: 'दोपहर १२ से १:३० के मध्य मुख्य भोजन; रात्रि ८ बजे से पूर्व हल्का भोजन।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Wake up during Brahma Muhurta (5:00 AM - 5:30 AM). Offer Arghya to the rising Sun facing East.',
          kn: 'ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದಲ್ಲಿ ಏಳುವುದು (೫:೦೦ - ೫:೩೦). ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಉದಯ ಸೂರ್ಯನಿಗೆ ಶುದ್ಧ ನೀರಿನ ಅರ್ಘ್ಯ ಸಮರ್ಪಣೆ.',
          hi: 'प्रातः सूर्योदय से पूर्व जागरण एवं सूर्य देव को तांबे के लोटे से अर्घ्य समर्पण।'
        },
        exerciseAndMovement: {
          en: '12 rounds of Surya Namaskar with synchronized breathwork; brisk outdoor morning walks in natural sunlight.',
          kn: 'ಶ್ವಾಸೋಚ್ಛ್ವಾಸ ಸಮನ್ವಯದೊಂದಿಗೆ ೧೨ ಸುತ್ತು ಸೂರ್ಯ ನಮಸ್ಕಾರ; ಬೆಳಗಿನ ಬಿಸಿಲಿನಲ್ಲಿ ಚುರುಕಾದ ನಡಿಗೆ.',
          hi: '१२ चक्र सूर्य नमस्कार एवं प्रातःकालीन धूप में भ्रमण।'
        },
        sunAndNatureTherapy: {
          en: '15-20 minutes of morning gentle sun-soaking on the chest and upper spine before 8:00 AM.',
          kn: 'ಬೆಳಿಗ್ಗೆ ೮ ಗಂಟೆಯ ಒಳಗೆ ಎದೆ ಮತ್ತು ಬೆನ್ನಿನ ಭಾಗಕ್ಕೆ ೧೫-೨೦ ನಿಮಿಷಗಳ ಸೌಮ್ಯ ಬಿಸಿಲಿನ ಸ್ನಾನ (ಸೂರ್ಯ ಕಿರಣ ಚಿಕಿತ್ಸೆ).',
          hi: 'प्रातःकाल ८ बजे से पूर्व १५-२० मिनट धूप का सेवन।'
        },
        colorTherapy: {
          en: 'Ruby red, golden saffron, bright copper, and warm orange attire on Sundays.',
          kn: 'ಭಾನುವಾರದಂದು ಕೆಂಪು, ಕೇಸರಿ, ತಾಮ್ರದ ಬಣ್ಣ ಹಾಗೂ ಬಂಗಾರದ ವರ್ಣದ ವಸ್ತ್ರ ಧಾರಣೆ.',
          hi: 'रविवार को लाल, केसरिया, ताम्र एवं सुनहरे रंगों के वस्त्र।'
        },
        mindfulRelaxation: {
          en: 'Gayatri Mantra chanting with mental focus on the Ajna chakra; practicing upright noble posture.',
          kn: 'ಆಜ್ಞಾ ಚಕ್ರದ ಮೇಲೆ ಧ್ಯಾನವಿಟ್ಟು ಗಾಯತ್ರಿ ಮಂತ್ರ ಜಪ; ಶರೀರವನ್ನು ನೇರವಾಗಿ ಇಡುವ ಆತ್ಮವಿಶ್ವಾಸದ ಭಂಗಿ.',
          hi: 'आज्ञा चक्र पर ध्यान केंद्रित कर गायत्री मंत्र का जप।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Hreem Hroum Sah Suryaya Namaha • Aditya Hridaya Stotram',
          kn: 'ಓಂ ಹ್ರೀಂ ಹ್ರೌಂ ಸಃ ಸೂರ್ಯಾಯ ನಮಃ • ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ',
          hi: 'ॐ ह्रीं ह्रौं सः सूर्याय नमः • आदित्य हृदय स्तोत्र'
        },
        beejaMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
        mantraCount: '108 times daily facing East at sunrise',
        gemstoneAdvice: {
          en: isWeak ? 'Natural untreated Ruby (Manikya) in gold/copper on ring finger only if Sun is a functional benefic.' : 'Avoid gemstone if Sun is functionally malefic; use Surya Yantra and Gayatri.',
          kn: isWeak ? 'ಸೂರ್ಯನು ಜಾತಕದಲ್ಲಿ ಶುಭನಾಗಿದ್ದರೆ ಮಾತ್ರ ಉಂಗುರ ಬೆರಳಿಗೆ ತಾಮ್ರ ಅಥವಾ ಬಂಗಾರದಲ್ಲಿ ಮಾಣಿಕ್ಯ ರತ್ನ ಧಾರಣೆ.' : 'ಸೂರ್ಯನು ಮಾರಕನಾಗಿದ್ದರೆ ರತ್ನ ಧರಿಸಬೇಡಿ; ಸೂರ್ಯ ಯಂತ್ರ ಪೂಜೆ ಮತ್ತು ಆದಿತ್ಯ ಹೃದಯ ಪಠಣ ಸಾಕು.',
          hi: isWeak ? 'अनामिका उंगली में तांबे या सोने में माणिक्य धारण करें (शुभ होने पर ही)।' : 'सूर्य यन्त्र एवं आदित्य हृदय स्तोत्र का पाठ करें।'
        },
        rudrakshaMukhi: {
          en: '1-Mukhi or 12-Mukhi Rudraksha (Governed by Surya; enhances willpower, leadership, and dispels lethargy).',
          kn: '೧-ಮುಖಿ ಅಥವಾ ೧೨-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಸೂರ್ಯನ ಅಧಿಪತ್ಯ; ವರ್ಚಸ್ಸು, ನಾಯಕತ್ವ ಹಾಗೂ ದೈಹಿಕ ತೇಜಸ್ಸಿನ ವೃದ್ಧಿ).',
          hi: '१-मुखी अथवा १२-मुखी रुद्राक्ष (तेज एवं नेतृत्व क्षमता हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Wheat grains, jaggery, red sandalwood, copper vessel, and ruby colored cloth.',
            kn: 'ಗೋಧಿ, ಬೆಲ್ಲ, ಕೆಂಪು ಗಂಧ, ತಾಮ್ರದ ಪಾತ್ರೆ ಮತ್ತು ಕೆಂಪು ವಸ್ತ್ರ.',
            hi: 'गेहूं, गुड़, लाल चंदन, तांबे का बर्तन एवं लाल वस्त्र।'
          },
          dayAndTime: {
            en: 'Sunday morning during Surya Hora (between 6:00 AM - 7:00 AM or 1:00 PM - 2:00 PM).',
            kn: 'ಭಾನುವಾರ ಬೆಳಿಗ್ಗೆ ಸೂರ್ಯ ಹೋರೆಯಲ್ಲಿ (೬:೦೦ - ೭:೦೦ ಅಥವಾ ಮಧ್ಯಾಹ್ನ ೧:೦೦ - ೨:೦೦).',
            hi: 'रविवार प्रातः सूर्य होरा में।'
          },
          recipient: {
            en: 'To a temple priest, Vedic scholar, or an impoverished elder in need.',
            kn: 'ವೈದಿಕ ಬ್ರಾಹ್ಮಣರಿಗೆ, ದೇವಾಲಯದ ಅರ್ಚಕರಿಗೆ ಅಥವಾ ನಿರ್ಗತಿಕ ವೃದ್ಧರಿಗೆ.',
            hi: 'विद्वान ब्राह्मण अथवा वृद्ध जरूरतमंद को।'
          }
        },
        deityVeneration: {
          en: 'Lord Shiva and Surya Narayana. Recite Sri Shiva-Surya Ashtakam.',
          kn: 'ಭಗವಾನ್ ಶಿವ ಮತ್ತು ಸೂರ್ಯ ನಾರಾಯಣ ಆರಾಧನೆ. ಶಿವ ಪಂಚಾಕ್ಷರಿ ಹಾಗೂ ಸೂರ್ಯಾಷ್ಟಕ ಪಠಿಸಿ.',
          hi: 'भगवान शिव एवं सूर्यनारायण की आराधना।'
        },
        sacredRitual: {
          en: 'Daily Surya Arghya in copper pot with Akshata, red flower, and a drop of Kumkum; lit pure cow ghee lamp.',
          kn: 'ತಾಮ್ರದ ಚೆಂಬಿನಲ್ಲಿ ಅಕ್ಷತೆ, ಕೆಂಪು ಹೂವು ಮತ್ತು ಕುಂಕುಮ ಬೆರೆಸಿ ಸೂರ್ಯನಿಗೆ ತರ್ಪಣ/ಅರ್ಘ್ಯ; ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪದ ದೀಪಾರಾಧನೆ.',
          hi: 'तांबे के लोटे में रोली, अक्षत व लाल पुष्प डालकर सूर्य देव को नित्य अर्घ्य।'
        }
      }
    };
  }

  if (normName.includes('moon') || normName.includes('chandra')) {
    const isWeak = strengthCat === 'weak' || [6, 8, 12].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Moon in House ${bhava} governs the psychological mind (Manas), emotional stability, sleep quality, and lymphatic bodily fluids. ${isWeak ? 'Mind prone to anxiety or fluctuating moods; prioritize grounding fluid nutrition.' : 'Blesses native with deep empathy and creative peace.'}`,
        kn: `ಚಂದ್ರನು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಮನಸ್ಸು, ಭಾವನಾತ್ಮಕ ಸ್ಥಿರತೆ, ನಿದ್ರಾ ಗುಣಮಟ್ಟ ಮತ್ತು ಶಾರೀರಿಕ ದ್ರವಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ಮನಸ್ಸಿನಲ್ಲಿ ಆತಂಕ ಅಥವಾ ಮೂಡ್ ಸ್ವಿಂಗ್ಸ್ ಸಾಧ್ಯತೆ; ದ್ರವಾಹಾರ ಹಾಗೂ ನಿದ್ರೆಯ ಶಿಸ್ತು ಅಗತ್ಯ.' : 'ಉತ್ತಮ ಕಲ್ಪನಾಶಕ್ತಿ ಹಾಗೂ ಶಾಂತ ಮನಸ್ಸನ್ನು ನೀಡುತ್ತಾನೆ.'}`,
        hi: `चन्द्रमा भाव ${bhava} में मन, भावनाएं, निद्रा एवं जल तत्व का नियमन करते हैं। ${isWeak ? 'मानसिक अस्थिरता निवारण हेतु जल-तत्व संतुलन आवश्यक है।' : 'सकारात्मक संवेदना व शान्ति प्रदान करते हैं।'}`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Hydrating, soothing, alkaline diet rich in fresh milk products, white grains, and natural electrolytes.',
          kn: 'ದೇಹವನ್ನು ತಂಪಾಗಿಸುವ, ಕ್ಷಾರೀಯ (ಆಲ್ಕಲೈನ್), ಹಾಲು, ಬಿಳಿ ಅಕ್ಕಿ ಮತ್ತು ಎಳನೀರಿನ ಪೋಷಕ ಸಾತ್ವಿಕ ಆಹಾರ.',
          hi: 'सुपाच्य, शीतल एवं जल-तत्व प्रधान आहार; दूध एवं ताजे फल।'
        },
        superfoods: {
          en: 'Tender coconut water, soaked almonds, sweet white rice porridge (Ksheera), watermelon, cucumber, and lotus seeds (Makhana).',
          kn: 'ಎಳನೀರು, ನೆನೆಸಿದ ಬಾದಾಮಿ, ಹಾಲಿನ ಪಾಯಸ (ಖೀರ), ಕಲ್ಲಂಗಡಿ, ಸೌತೆಕಾಯಿ, ಮತ್ತು ಕಮಲದ ಬೀಜಗಳು (ಮಖಾನ).',
          hi: 'नारियल पानी, भीगे बादाम, खीर, तरबूज, खीरा एवं मखाना।'
        },
        targetedNutrients: {
          en: 'Calcium, Magnesium Glycinate (for evening nerve calm), Zinc, and pure hydrating electrolytes.',
          kn: 'ಕ್ಯಾಲ್ಸಿಯಂ, ಮೆಗ್ನೀಸಿಯಮ್ (ರಾತ್ರಿ ನರಗಳ ವಿಶ್ರಾಂತಿಗೆ), ಜಿಂಕ್, ಮತ್ತು ನೈಸರ್ಗಿಕ ಎಲೆಕ್ಟ್ರೋಲೈಟ್‌ಗಳು.',
          hi: 'कैल्शियम, मैग्नीशियम (मानसिक शांति हेतु), जिंक एवं इलेक्ट्रोलाइट्स।'
        },
        foodsToConsume: [
          { en: 'Warm boiled A2 milk with a pinch of nutmeg and cardamom at bedtime', kn: 'ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ಚಿಟಿಕೆ ಜಾಯಿಕಾಯಿ ಮತ್ತು ಏಲಕ್ಕಿ ಬೆರೆಸಿದ ಬಿಸಿ ಹಾಲು', hi: 'सोते समय जायफल व इलायची युक्त गुनगुना दूध' },
          { en: 'Sweet cooling tender coconut water at mid-morning', kn: 'ಬೆಳಗಿನ ಜಾವ ೧೧ ಗಂಟೆಗೆ ತಾಜಾ ಎಳನೀರು', hi: 'प्रातः नारियल पानी' },
          { en: 'Fresh churned buttermilk (Takra) spiced with roasted cumin', kn: 'ಹುರಿದ ಜೀರಿಗೆ ಬೆರೆಸಿದ ತಾಜಾ ಕಡೆದ ಮಜ್ಜಿಗೆ', hi: 'भुना जीरा युक्त ताजी छाछ' },
          { en: 'Light easily digestible basmati rice and moong dal khichdi', kn: 'ಹಗುರವಾದ ಮೂಂಗ್ ದಾಲ್ ಕಿಚಡಿ', hi: 'मूंग दाल की खिचड़ी' }
        ],
        foodsToAvoid: [
          { en: 'Sour curd, pickles, and cold fermented batters late at night', kn: 'ರಾತ್ರಿ ಹೊತ್ತು ಹುಳಿ ಮೊಸರು, ಉಪ್ಪಿನಕಾಯಿ ಮತ್ತು ಹುಳಿ ತಿನಿಸುಗಳು', hi: 'रात में खट्टा दही, अचार एवं बासी किण्वित भोजन' },
          { en: 'Excess caffeine, energy drinks, and dehydrating alcohol', kn: 'ಅತಿಯಾದ ಕಾಫಿ, ಮದ್ಯಪಾನ ಮತ್ತು ಎನರ್ಜಿ ಡ್ರಿಂಕ್ಸ್', hi: 'अत्यधिक चाय-कॉफी एवं मद्यपान' },
          { en: 'Heavy oily deep-fried snacks after sunset', kn: 'ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಸೇವಿಸುವ ಎಣ್ಣೆಯ ತಿಂಡಿಗಳು', hi: 'सूर्यास्त के बाद भारी व तला भोजन' }
        ],
        herbalDecoctions: {
          en: 'Sankhapushpi infusion, Brahmi tea, or Chamomile warm water to restore emotional equilibrium.',
          kn: 'ಶಂಖಪುಷ್ಪಿ ಕಷಾಯ, ಬ್ರಾಹ್ಮಿ ಚಹಾ, ಅಥವಾ ಶಾಂತಗೊಳಿಸುವ ಕ್ಯಾಮೊಮೈಲ್ ಗಿಡಮೂಲಿಕೆ ನೀರು.',
          hi: 'शंखपुष्पी अथवा ब्राह्मी की चाय; मानसिक शांति हेतु।'
        },
        optimalMealTimings: {
          en: 'Never skip meals; eat dinner at least 2.5 hours before bedtime to guarantee deep REM sleep.',
          kn: 'ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಊಟ ತಪ್ಪಿಸಬೇಡಿ; ಮಲಗುವ ಕನಿಷ್ಠ ೨.೫ ಗಂಟೆ ಮೊದಲು ರಾತ್ರಿಯೂಟ ಮುಗಿಸಿ.',
          hi: 'सोने से कम से कम २.५ घंटे पूर्व हल्का भोजन करें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Maintain regular sleep cycles; meditate 15 minutes before sleeping; honor mother and maternal elders.',
          kn: 'ನಿಗದಿತ ನಿದ್ರಾ ಸಮಯ ಪಾಲಿಸಿ; ಮಲಗುವ ಮುನ್ನ ೧೫ ನಿಮಿಷ ಧ್ಯಾನ; ತಾಯಿಯ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ.',
          hi: 'नियमित समय पर शयन; माता का आदर एवं चरण स्पर्श।'
        },
        exerciseAndMovement: {
          en: 'Gentle restorative yoga (Chandra Namaskar), swimming, slow mindful walking beside water bodies.',
          kn: 'ಚಂದ್ರ ನಮಸ್ಕಾರ, ಈಜು, ನೀರಿನ ಜಲಾಶಯಗಳ ಬಳಿ ಪ್ರಶಾಂತ ಸಂಜೆ ನಡಿಗೆ.',
          hi: 'चन्द्र नमस्कार, तैराकी एवं सायंकालीन शान्त भ्रमण।'
        },
        sunAndNatureTherapy: {
          en: 'Moon-gazing (Chandra Darshana) on Shukla Paksha evenings to soothe emotional agitation.',
          kn: 'ಶುಕ್ಲ ಪಕ್ಷದ ಸಂಜೆಗಳಲ್ಲಿ ಚಂದ್ರನ ಶೀತಲ ಬೆಳಕಿನಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳುವುದು (ಚಂದ್ರ ತ್ರಾಟಕ).',
          hi: 'शुक्ल पक्ष में चन्द्रमा के दर्शन एवं शीतल चांदनी का सेवन।'
        },
        colorTherapy: {
          en: 'Pearl white, shimmering silver, soft cream, and baby pink clothes on Mondays.',
          kn: 'ಸೋಮವಾರದಂದು ಮುತ್ತಿನ ಬಿಳಿ, ಬೆಳ್ಳಿ ಬಣ್ಣ, ತಿಳಿ ಗುಲಾಬಿ ಬಣ್ಣದ ಉಡುಪು ಧಾರಣೆ.',
          hi: 'सोमवार को श्वेत, चांदी जैसे चमकीले या हल्के गुलाबी वस्त्र।'
        },
        mindfulRelaxation: {
          en: 'Sheetali Pranayama to cool emotional tempers; Trataka on silver deepa flame.',
          kn: 'ಶೀತಲೀ ಪ್ರಾಣಾಯಾಮ (ಭಾವನಾತ್ಮಕ ಆವೇಶ ತಗ್ಗಿಸಲು); ಬೆಳ್ಳಿಯ ದೀಪದ ಮೇಲೆ ತ್ರಾಟಕ.',
          hi: 'शीतली प्राणायाम एवं मानसिक त्राटक।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Shram Shreem Shroum Sah Chandraya Namaha • Sri Shiva Stuti',
          kn: 'ಓಂ ಶ್ರಾಂ ಶ್ರೀಂ ಶ್ರೌಂ ಸಃ ಚಂದ್ರಾಯ ನಮಃ • ಶ್ರೀ ಶಿವ ಪಂಚಾಕ್ಷರ ಸ್ತೋತ್ರ',
          hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः • शिव स्तुति'
        },
        beejaMantra: 'ॐ सों सोमाय नमः',
        mantraCount: '108 times on Mondays after evening bath',
        gemstoneAdvice: {
          en: isWeak ? 'Natural South Sea Pearl (Mukta) set in silver on little finger.' : 'Chanting and silver water glass preferred over stone if Moon is functionally difficult.',
          kn: isWeak ? 'ಚಂದ್ರ ಶುಭನಾಗಿದ್ದರೆ ಮಾತ್ರ ಕಿರುಬೆರಳಿಗೆ ಬೆಳ್ಳಿಯ ಉಂಗುರದಲ್ಲಿ ನೈಸರ್ಗಿಕ ಮುತ್ತು (ಮುಕ್ತಾ) ಧಾರಣೆ.' : 'ಬೆಳ್ಳಿಯ ಲೋಟದಲ್ಲಿ ನೀರು ಕುಡಿಯುವುದು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ.',
          hi: isWeak ? 'कनिष्ठिका उंगली में चांदी में सच्चा मोती धारण करें।' : 'चांदी के गिलास में जल पीना उत्तम है।'
        },
        rudrakshaMukhi: {
          en: '2-Mukhi Rudraksha (Symbol of Ardhanarishvara; harmonizes mind, relationships, and removes depression).',
          kn: '೨-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಅರ್ಧನಾರೀಶ್ವರ ಸ್ವರೂಪ; ಮಾನಸಿಕ ಶಾಂತಿ, ದಾಂಪತ್ಯ ಪ್ರೀತಿ ಮತ್ತು ಖಿನ್ನತೆ ನಿವಾರಣೆ).',
          hi: '२-मुखी रुद्राक्ष (अर्धनारीश्वर स्वरूप, मानसिक शांति हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'White rice, fresh milk, pure silver coin, white flowers, sugar candy (Mishri), and camphor.',
            kn: 'ಬಿಳಿ ಅಕ್ಕಿ, ಶುದ್ಧ ಹಾಲು, ಬೆಳ್ಳಿ ನಾಣ್ಯ, ಬಿಳಿ ಹೂವುಗಳು, ಕಲ್ಲುಸಕ್ಕರೆ ಮತ್ತು ಕರ್ಪೂರ.',
            hi: 'चावल, दूध, चांदी, सफेद पुष्प, मिश्री एवं कपूर।'
          },
          dayAndTime: {
            en: 'Monday evening during twilight (Godhuli or Chandra Hora).',
            kn: 'ಸೋಮವಾರ ಸಂಜೆ ಗೋಧೂಳಿ ಅಥವಾ ಚಂದ್ರ ಹೋರೆಯಲ್ಲಿ.',
            hi: 'सोमवार संध्या समय।'
          },
          recipient: {
            en: 'To elderly women, mothers, orphan girls, or ashram kitchen.',
            kn: 'ವೃದ್ಧ ಮಹಿಳೆಯರಿಗೆ, ತಾಯಂದಿರಿಗೆ, ಅನಾಥ ಹೆಣ್ಣುಮಕ್ಕಳಿಗೆ ಅಥವಾ ಆಶ್ರಮದ ಅನ್ನಛತ್ರಕ್ಕೆ.',
            hi: 'मातृ-तुल्य वृद्ध महिलाओं अथवा कन्याओं को।'
          }
        },
        deityVeneration: {
          en: 'Lord Shiva wearing the crescent Moon (Chandrashekhara) and Goddess Parvati / Durga.',
          kn: 'ಚಂದ್ರಮೌಳೀಶ್ವರ ಶ್ರೀ ಸಾಂಬ ಸದಾಶಿವ ಮತ್ತು ತಾಯಿ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ ಆರಾಧನೆ.',
          hi: 'भगवान शिव (चन्द्रशेखर) एवं मां गौरी की पूजा।'
        },
        sacredRitual: {
          en: 'Abhisheka to Shiva Linga with raw milk and Bilva leaves; lighting a ghee deepa facing North-West.',
          kn: 'ಶಿವಲಿಂಗಕ್ಕೆ ಹಸಿ ಹಾಲಿನ ಅಭಿಷೇಕ ಮತ್ತು ಬಿಲ್ವಪತ್ರೆ ಸಮರ್ಪಣೆ; ವಾಯುವ್ಯ ದಿಕ್ಕಿನಲ್ಲಿ ತುಪ್ಪದ ದೀಪಾರಾಧನೆ.',
          hi: 'शिवलिंग पर कच्चे दूध से अभिषेक एवं बेलपत्र अर्पण।'
        }
      }
    };
  }

  if (normName.includes('mars') || normName.includes('kuja') || normName.includes('mangal')) {
    const isWeak = strengthCat === 'weak' || [8, 12].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Mars in House ${bhava} governs muscular density, blood hemoglobin, bone marrow, sexual stamina, and raw courage. ${isWeak ? 'Risk of blood deficiencies, low drive, or muscle sprains; replenish red vitality.' : 'Intense metabolic drive; manage high blood pressure, inflammation, and temperamental fire.'}`,
        kn: `ಕುಜನು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ರಕ್ತದ ಹಿಮೋಗ್ಲೋಬಿನ್, ಮೂಳೆ ಮಜ್ಜೆ, ಸ್ನಾಯು ಬಲ, ಸಾಹಸ ಮತ್ತು ರಕ್ಷಣಾ ಶಕ್ತಿಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ರಕ್ತಹೀನತೆ ಅಥವಾ ಸ್ನಾಯುಗಳ ಸೆಳೆತ ಉಂಟಾಗಬಹುದು; ರಕ್ತವರ್ಧಕ ಆಹಾರ ಅಗತ್ಯ.' : 'ಅಪಾರ ಶೌರ್ಯ; ಆದರೆ ಅತಿಯಾದ ರಕ್ತದೊತ್ತಡ, ಪಿತ್ತದ ಕಿರಿಕಿರಿ ಮತ್ತು ಸಿಟ್ಟನ್ನು ನಿಯಂತ್ರಿಸಿ.'}`,
        hi: `मंगल भाव ${bhava} में रक्त, मज्जा, मांसपेशियां, पराक्रम एवं क्रोध का नियमन करते हैं। ${isWeak ? 'रक्त अल्पता दूर करने वाले पोषक आहार की आवश्यकता।' : 'अग्नि तत्व को शांत रखें।'}`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Blood-nourishing, iron-dense, yet cooling Pitta-pacifying diet with alkaline greens and electrolytes.',
          kn: 'ರಕ್ತವರ್ಧಕ, ಕಬ್ಬಿಣಾಂಶಯುಕ್ತ, ಪಿತ್ತ ಶಾಮಕ ಹಾಗೂ ಕ್ಷಾರೀಯ ತರಕಾರಿಗಳ ಪೌಷ್ಟಿಕ ಸಾತ್ವಿಕ ಆಹಾರ.',
          hi: 'रक्तवर्धक, लौह तत्व प्रधान एवं पित्त-शामक शीतल आहार।'
        },
        superfoods: {
          en: 'Beetroot juice, red pomegranates, organic dates, soaked black raisins, fennel water, amla, and fresh coriander.',
          kn: 'ಬೀಟ್‌ರೂಟ್ ರಸ, ದಾಳಿಂಬೆ, ಉತ್ತತ್ತಿ/ಖರ್ಜೂರ, ನೆನೆಸಿದ ಕಪ್ಪು ಒಣದ್ರಾಕ್ಷಿ, ಸೋಂಪು ನೀರು, ನೆಲ್ಲಿಕಾಯಿ ಮತ್ತು ಕೊತ್ತಂಬರಿ.',
          hi: 'चुकंदर, अनार, खजूर, मुनक्का, सौंफ का अर्क एवं आंवला।'
        },
        targetedNutrients: {
          en: 'Plant-based Iron (with Vitamin C for absorption), Potassium, Magnesium for muscular relaxation, and Zinc.',
          kn: 'ಕಬ್ಬಿಣಾಂಶ (ಐರನ್), ವಿಟಮಿನ್ ಸಿ (ಹೀರಿಕೊಳ್ಳಲು), ಪೊಟ್ಯಾಸಿಯಮ್, ಹಾಗೂ ಸ್ನಾಯುಗಳ ಸಡಿಲತೆಗೆ ಮೆಗ್ನೀಸಿಯಮ್.',
          hi: 'लौह तत्व (आयरन), विटामिन सी, पोटैशियम एवं मैग्नीशियम।'
        },
        foodsToConsume: [
          { en: 'Fresh beetroot and carrot soup with a squeeze of lemon', kn: 'ತಾಜಾ ಬೀಟ್‌ರೂಟ್-ಕ್ಯಾರೆಟ್ ಸೂಪ್ (ಸ್ವಲ್ಪ ನಿಂಬೆರಸ ಬೆರೆಸಿ)', hi: 'चुकंदर व गाजर का सूप' },
          { en: 'Fennel (Saunf) and coriander seed cooling water throughout the day', kn: 'ದಿನವಿಡೀ ಕುಡಿಯಲು ಸೋಂಪು ಮತ್ತು ಕೊತ್ತಂಬರಿ ನೆನೆಸಿದ ತಣ್ಣೀರು', hi: 'सौंफ व धनिए का शीतल जल' },
          { en: 'Soaked figs (Anjeer) and black raisins on an empty stomach', kn: 'ಮುಂಜಾನೆ ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ನೆನೆಸಿದ ಅಂಜೂರ ಮತ್ತು ಒಣದ್ರಾಕ್ಷಿ', hi: 'प्रातः भीगे अंजीर व मुनक्के' },
          { en: 'Moong dal with plenty of ghee and cumin tempering', kn: 'ಜೀರಿಗೆ ಮತ್ತು ತುಪ್ಪದ ಒಗ್ಗರಣೆ ಹಾಕಿದ ಹೆಸರು ಬೇಳೆ', hi: 'जीरा व घी युक्त मूंग दाल' }
        ],
        foodsToAvoid: [
          { en: 'Extremely hot pungent red chilies, cayenne, and wasabi', kn: 'ಅತಿಯಾದ ಖಾರದ ಹಸಿಮೆಣಸು, ಕೆಂಪು ಮೆಣಸಿನಪುಡಿ ಮತ್ತು ಗರಂ ಮಸಾಲಾ', hi: 'अत्यधिक तीखी लाल मिर्च व गरम मसाले' },
          { en: 'Hard alcohol, smoking, and excessively charred barbecue', kn: 'ಮದ್ಯಪಾನ, ತಂಬಾಕು, ಮತ್ತು ಕರಿದ/ಸುಟ್ಟ ಮಾಂಸಾಹಾರ', hi: 'मद्यपान, तंबाकू एवं अत्यधिक तला मांस' },
          { en: 'Excessive garlic, raw mustard oil, and synthetic energy boosters', kn: 'ಅತಿಯಾದ ಹಸಿ ಬೆಳ್ಳುಳ್ಳಿ ಮತ್ತು ಕೃತಕ ಎನರ್ಜಿ ಬೂಸ್ಟರ್‌ಗಳು', hi: 'कच्चे लहसुन की अधिकता व कृत्रिम उत्तेजक' }
        ],
        herbalDecoctions: {
          en: 'Vetiver (Ushira) and Chandana infused water; Shatavari kalpa in warm milk.',
          kn: 'ಲಾಮಂಚ (ಉಶೀರ) ಮತ್ತು ಶ್ರೀಗಂಧದ ತಂಪಾದ ನೀರು; ಹಾಲಿನೊಂದಿಗೆ ಶತಾವರಿ ಕಲ್ಪ.',
          hi: 'खस व चंदन का शरबत; शतावरी चूर्ण दूध के साथ।'
        },
        optimalMealTimings: {
          en: 'Never delay lunch past 1:00 PM; skipping meals creates fiery bile irritation (Acid Pitta).',
          kn: 'ಮಧ್ಯಾಹ್ನ ೧:೦೦ ಗಂಟೆಯ ನಂತರ ಊಟ ವಿಳಂಬ ಮಾಡಬೇಡಿ; ಹಸಿವು ತಡೆದರೆ ಪಿತ್ತೋದ್ರೇಕವಾಗುತ್ತದೆ.',
          hi: 'दोपहर का भोजन समय पर करें; भूख रोकने से पित्त भड़कता है।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Channel surplus warrior fire into focused athletic or social service endeavors; control temper spikes.',
          kn: 'ಹೆಚ್ಚುವರಿ ಶಕ್ತಿಯನ್ನು ಕ್ರೀಡೆ ಅಥವಾ ಸಮಾಜಸೇವೆಗೆ ವ್ಯಯಿಸಿ; ಸಿಟ್ಟನ್ನು ಮೌನದಿಂದ ಗೆಲ್ಲಿರಿ.',
          hi: 'ऊर्जा को व्यायाम या रचनात्मक कार्यों में लगाएं; क्रोध पर नियंत्रण रखें।'
        },
        exerciseAndMovement: {
          en: 'Martial arts, moderate weightlifting, cycling, wrestling or competitive sports; always cool down with stretching.',
          kn: 'ಕರಾಟೆ, ಜಿಮ್ ವ್ಯಾಯಾಮ, ಸೈಕ್ಲಿಂಗ್ ಅಥವಾ ಕ್ರೀಡೆಗಳು; ವ್ಯಾಯಾಮದ ನಂತರ ತಂಪಾಗಿಸುವ ಸ್ಟ್ರೆಚಿಂಗ್.',
          hi: 'व्यायाम, दौड़, तैराकी अथवा खेलकूद।'
        },
        sunAndNatureTherapy: {
          en: 'Walking barefoot on green morning grass covered with dew to discharge excess electrostatic body heat.',
          kn: 'ಬೆಳಗಿನ ಮಂಜು ಹನಿಗಳಿರುವ ಹಸಿರು ಹುಲ್ಲಿನ ಮೇಲೆ ಬರಿಗಾಲಿನಲ್ಲಿ ನಡಿಗೆ (ದೇಹದ ಉರಿ ಶಮನ).',
          hi: 'प्रातःकाल ओस युक्त हरी घास पर नंगे पैर चलना।'
        },
        colorTherapy: {
          en: 'Coral red and bright crimson for weak Mars; cooling white and soothing greens for overactive Mars.',
          kn: 'ಕುಜ ದುರ್ಬಲನಾಗಿದ್ದರೆ ಹವಳದ ಕೆಂಪು; ಕುಜ ಅತಿಯಾಗಿ ಉಗ್ರವಾಗಿದ್ದರೆ ತಿಳಿ ಬಿಳಿ ಹಾಗೂ ಹಸಿರು ಉಡುಪು.',
          hi: 'मंगल निर्बल हो तो लाल/मूंगा रंग; उग्र हो तो सफेद व हरा रंग।'
        },
        mindfulRelaxation: {
          en: 'Sheetali Pranayama and Chandra Bhedana (left nostril breathing) to soothe autonomic nervous stress.',
          kn: 'ಶೀತಲೀ ಪ್ರಾಣಾಯಾಮ ಹಾಗೂ ಚಂದ್ರ ಭೇದನ (ಎಡ ನಾಸಿಕ ಉಸಿರಾಟ) ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಿಸಲು.',
          hi: 'शीतली एवं चंद्र भेदी प्राणायाम।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Kram Kreem Kroum Sah Bhaumaya Namaha • Sri Mangala Gayatri • Kartikeya Stotra',
          kn: 'ಓಂ ಕ್ರಾಂ ಕ್ರೀಂ ಕ್ರೌಂ ಸಃ ಭೌಮಾಯ ನಮಃ • ಸುಬ್ರಹ್ಮಣ್ಯ ಭುಜಂಗ ಸ್ತೋತ್ರ',
          hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः • कार्तिकेय स्तोत्र'
        },
        beejaMantra: 'ॐ अं अंगारकाय नमः',
        mantraCount: '108 times on Tuesdays facing South or East',
        gemstoneAdvice: {
          en: isWeak ? 'Natural untreated Red Coral (Moonga) in copper/gold on ring finger (check Yogakaraka status first).' : 'Avoid Coral if Mars is functional malefic; perform Hanuman Chalisa instead.',
          kn: isWeak ? 'ಕುಜ ಯೋಗಕಾರಕನಾಗಿದ್ದರೆ ಮಾತ್ರ ತಾಮ್ರದಲ್ಲಿ ನೈಸರ್ಗಿಕ ಕೆಂಪು ಹವಳ ರತ್ನ ಧಾರಣೆ.' : 'ಮಾರಕನಾಗಿದ್ದರೆ ಹವಳ ಧರಿಸಬೇಡಿ; ಸುಬ್ರಹ್ಮಣ್ಯ ಅಥವಾ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ ಶ್ರೇಷ್ಠ.',
          hi: isWeak ? 'तांबे में त्रिकोणीय लाल मूंगा धारण करें (शुभ होने पर ही)।' : 'हनुमान चालीसा का पाठ करें।'
        },
        rudrakshaMukhi: {
          en: '3-Mukhi Rudraksha (Governed by Agni & Mangala; burns accumulated guilt, laziness, and regulates metabolism).',
          kn: '೩-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಅಗ್ನಿ & ಕುಜನ ಸ್ವರೂಪ; ಆಲಸ್ಯ ನಿವಾರಣೆ, ರಕ್ತ ಶುದ್ಧಿ ಹಾಗೂ ಸಾಹಸ ವೃದ್ಧಿ).',
          hi: '३-मुखी रुद्राक्ष (अग्नि तत्व शुद्धिकरण एवं तेज वृद्धि हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Red lentils (Masoor dal), organic jaggery, red flowers, copper vessel, and sweet wheat rotis.',
            kn: 'ಕೆಂಪು ಮಸೂರ ಬೇಳೆ, ಸಾವಯವ ಬೆಲ್ಲ, ಕೆಂಪು ಹೂವು, ತಾಮ್ರದ ಪಾತ್ರೆ, ಮತ್ತು ಸಿಹಿ ರೊಟ್ಟಿ.',
            hi: 'लाल मसूर, गुड़, तांबे का पात्र एवं मीठी रोटी।'
          },
          dayAndTime: {
            en: 'Tuesday afternoon between 12:00 PM - 1:30 PM (Mangala Hora).',
            kn: 'ಮಂಗಳವಾರ ಮಧ್ಯಾಹ್ನ ಮಂಗಳ ಹೋರೆಯಲ್ಲಿ (೧೨:೦೦ - ೧:೩೦).',
            hi: 'मंगलवार दोपहर के समय।'
          },
          recipient: {
            en: 'To police, army veterans, surgeons, or dedicated laborers.',
            kn: 'ಯೋಧರಿಗೆ, ಸೈನಿಕರಿಗೆ, ರಕ್ಷಣಾ ಸಿಬ್ಬಂದಿಗೆ ಅಥವಾ ದೈಹಿಕ ಶ್ರಮಿಕರಿಗೆ.',
            hi: 'सैनिकों, सुरक्षाकर्मियों अथवा श्रमिकों को।'
          }
        },
        deityVeneration: {
          en: 'Lord Subrahmanya (Kartikeya / Murugan) and Lord Hanuman.',
          kn: 'ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿ (ಷಣ್ಮುಖ) ಮತ್ತು ಶ್ರೀ ಹನುಮಂತ ದೇವರ ಆರಾಧನೆ.',
          hi: 'भगवान कार्तिकेय (मुरुगन) एवं श्री हनुमान जी।'
        },
        sacredRitual: {
          en: 'Lighting a sesame oil or mustard oil lamp before Sri Subrahmanya on Tuesdays; chanting Hanuman Chalisa.',
          kn: 'ಮಂಗಳವಾರ ಸುಬ್ರಹ್ಮಣ್ಯ ಅಥವಾ ಆಂಜನೇಯನಿಗೆ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಪ್ರಜ್ವಲನೆ; ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಣ.',
          hi: 'मंगलवार को चमेली के तेल का दीपक एवं सिंदूर अर्पण।'
        }
      }
    };
  }

  // Generic generator for Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
  if (normName.includes('mercury') || normName.includes('budha')) {
    const isWeak = strengthCat === 'weak' || [6, 8, 12].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Mercury in House ${bhava} rules the central & peripheral nervous system, brain neurotransmitters, speech, skin integrity, and enteric gut intelligence. ${isWeak ? 'Nervous restlessness or gut-brain distress; nourish myelin sheaths and gut microbiome.' : 'Sharp commercial agility and intellectual wit.'}`,
        kn: `ಬುಧನು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ನರಮಂಡಲ, ಮಿದುಳಿನ ಸಂವೇದನೆ, ಚರ್ಮದ ಕಾಂತಿ, ಮಾತು ಮತ್ತು ಕರುಳಿನ ಜೀರ್ಣ ಬುದ್ಧಿಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ನರಗಳ ಆಯಾಸ, ಚರ್ಮದ ಕಿರಿಕಿರಿ ಅಥವಾ ಅತಿಯಾದ ಆಲೋಚನೆ; ಹಸಿರು ಪೋಷಕಾಂಶಗಳ ಅಗತ್ಯ.' : 'ತೀಕ್ಷ್ಣ ಬುದ್ಧಿ ಮತ್ತು ಚತುರ ಮಾತುಗಾರಿಕೆ ನೀಡುತ್ತಾನೆ.'}`,
        hi: `बुध भाव ${bhava} में स्नायु तंत्र, त्वचा, वाणी एवं बुद्धि का नियमन करते हैं। ${isWeak ? 'स्नायु दुर्बलता निवारण हेतु पोषक तत्व आवश्यक हैं।' : 'कुशाग्र बुद्धि प्रदान करते हैं।'}`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Neuro-protective, green chlorophyllic, probiotic-rich diet that stabilizes the gut-brain axis.',
          kn: 'ನರಮಂಡಲ ರಕ್ಷಕ, ಹಸಿರು ಎಲೆಕೋಸು, ಕ್ಲೋರೋಫಿಲ್, ಮತ್ತು ಕರುಳಿನ ಪ್ರೋಬಯಾಟಿಕ್ ಸಮೃದ್ಧ ಸಾತ್ವಿಕ ಆಹಾರ.',
          hi: 'हरी पत्तेदार सब्जियां, सुपाच्य एवं स्नायु-पोषक आहार।'
        },
        superfoods: {
          en: 'Green moong dal, soaked almonds, pumpkin seeds, raw celery, amla, and freshly sprouted seeds.',
          kn: 'ಹಸಿರು ಹೆಸರು ಕಾಳು, ನೆನೆಸಿದ ಬಾದಾಮಿ, ಕುಂಬಳಕಾಯಿ ಬೀಜ, ನೆಲ್ಲಿಕಾಯಿ, ಮತ್ತು ಮೊಳಕೆ ಕಟ್ಟಿದ ಧಾನ್ಯಗಳು.',
          hi: 'मूंग दाल, भीगे बादाम, कद्दू के बीज, आंवला एवं अंकुरित अन्न।'
        },
        targetedNutrients: {
          en: 'Complete Vitamin B-Complex (especially B1, B6, B12), Magnesium L-Threonate, and Choline.',
          kn: 'ವಿಟಮಿನ್ ಬಿ-ಕಾಂಪ್ಲೆಕ್ಸ್ (ಬಿ೧, ಬಿ೬, ಬಿ೧೨), ಮೆಗ್ನೀಸಿಯಮ್, ಮತ್ತು ಕೋಲೀನ್ (ಮೆದುಳಿನ ಕೋಶಗಳಿಗೆ).',
          hi: 'विटामिन बी-कॉम्प्लेक्स, मैग्नीशियम एवं कोलीन।'
        },
        foodsToConsume: [
          { en: 'Steamed green mung beans with lime and coriander', kn: 'ನಿಂಬೆರಸ ಮತ್ತು ಕೊತ್ತಂಬರಿ ಬೆರೆಸಿದ ಹೆಸರು ಕಾಳಿನ ಉಸಲಿ', hi: 'अंकुरित मूंग एवं हरी सब्जियां' },
          { en: 'Fresh green leafy spinach, fenugreek (Methi), and moringa soup', kn: 'ಪಾಲಕ್, ಮೆಂತ್ಯ ಸೊಪ್ಪು, ಮತ್ತು ನುಗ್ಗೆ ಸೊಪ್ಪಿನ ಪೌಷ್ಟಿಕ ಸೂಪ್', hi: 'पालक, मेथी व सहजन का सूप' },
          { en: 'Fresh mint and coriander leaf green chutney with rock salt', kn: 'ಪುದೀನಾ ಮತ್ತು ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪಿನ ತಾಜಾ ಚಟ್ನಿ', hi: 'पुदीना व धनिए की ताजी चटनी' },
          { en: 'Soaked walnut halves (rich in brain DHA lipids)', kn: 'ಮೆದುಳಿನ ಪೋಷಣೆಗೆ ನೆನೆಸಿದ ವಾಲ್ನಟ್ (ಅಕ್ರೋಟು)', hi: 'भीगे अखरोट' }
        ],
        foodsToAvoid: [
          { en: 'Refined sugar confectionaries and artificial food coloring', kn: 'ಕೃತಕ ಬಣ್ಣದ ಸಿಹಿತಿಂಡಿಗಳು, ಮೈದಾ, ಮತ್ತು ಅತಿಯಾದ ಸಕ್ಕರೆ', hi: 'सफेद चीनी, कृत्रिम रंग एवं बेकरी उत्पाद' },
          { en: 'Heavy greasy meats causing bowel congestion', kn: 'ಜೀರ್ಣವಾಗದ ಎಣ್ಣೆಯುಕ್ತ ಮಾಂಸಾಹಾರ', hi: 'अत्यधिक गरिष्ठ व चिकनाई युक्त भोजन' },
          { en: 'Excessive coffee causing nervous tremors and insomnia', kn: 'ನರಗಳಲ್ಲಿ ನಡುಕ ಹುಟ್ಟಿಸುವ ಅತಿಯಾದ ಕಾಫಿ ಸೇವನೆ', hi: 'अत्यधिक कैफीन युक्त कॉफी' }
        ],
        herbalDecoctions: {
          en: 'Brahmi tea with Gotu Kola; warm Tulasi infusion with honey in morning.',
          kn: 'ಬ್ರಾಹ್ಮಿ ಮತ್ತು ಒಂದೆಲಗ (ಮಂಡೂಕಪರ್ಣಿ) ಕಷಾಯ; ತುಳಸಿ ಮತ್ತು ಜೇನುತುಪ್ಪದ ನೀರು.',
          hi: 'ब्राह्मी एवं तुलसी की ताजी चाय।'
        },
        optimalMealTimings: {
          en: 'Eat in a tranquil, silent environment; avoid reading phone messages or working while chewing.',
          kn: 'ಶಾಂತ ಪರಿಸರದಲ್ಲಿ, ಮೊಬೈಲ್ ನೋಡದೆ ಸಂಪೂರ್ಣ ಗಮನವಿಟ್ಟು ಜಗಿದು ತಿನ್ನಿ.',
          hi: 'भोजन करते समय मोबाइल या टीवी से दूर रहें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Engage in journaling, intellectual reading, and conscious breath counting; keep living spaces organized.',
          kn: 'ದಿನಚರಿ ಬರೆಯುವುದು, ಗ್ರಂಥಗಳ ಅಧ್ಯಯನ, ಪ್ರಾಣಾಯಾಮ, ಮತ್ತು ಮನೆಯನ್ನು ಸ್ವಚ್ಛವಾಗಿಡುವುದು.',
          hi: 'स्वाध्याय, लेखन एवं दैनिक कार्यप्रणाली को व्यवस्थित रखना।'
        },
        exerciseAndMovement: {
          en: 'Nadi Shodhana (alternate nostril breathing), table tennis/badminton for hand-eye coordination.',
          kn: 'ನಾಡಿ ಶೋಧನ ಪ್ರಾಣಾಯಾಮ, ಬ್ಯಾಡ್ಮಿಂಟನ್ ಅಥವಾ ಟೇಬಲ್ ಟೆನಿಸ್ ನಂತಹ ಚುರುಕಿನ ಆಟಗಳು.',
          hi: 'नाड़ी शोधन प्राणायाम एवं टेबल टेनिस/बैडमिंटन।'
        },
        sunAndNatureTherapy: {
          en: 'Walking in emerald green botanical gardens or bamboo groves; earthing feet on soil.',
          kn: 'ಹಚ್ಚ ಹಸಿರಿನ ಉದ್ಯಾನವನಗಳಲ್ಲಿ ನಡಿಗೆ; ಮಣ್ಣಿನ ಮೇಲೆ ಬರಿಗಾಲಿನಲ್ಲಿ ನಡೆಯುವುದು.',
          hi: 'हरे-भरे उद्यानों में भ्रमण।'
        },
        colorTherapy: {
          en: 'Parrot green, emerald green, and light pastel hues on Wednesdays.',
          kn: 'ಬುಧವಾರದಂದು ಗಿಳಿ ಹಸಿರು, ಪಚ್ಚೆ ಹಸಿರು, ಹಾಗೂ ತಿಳಿ ಬಣ್ಣದ ಉಡುಪು ಧಾರಣೆ.',
          hi: 'बुधवार को हरा एवं पिस्ता रंग।'
        },
        mindfulRelaxation: {
          en: 'Daily 10 minutes of silent deep rhythmic box breathing to quiet monkey-mind chatter.',
          kn: 'ಮನಸ್ಸಿನ ಚಂಚಲತೆ ನಿಯಂತ್ರಿಸಲು ದಿನಕ್ಕೆ ೧೦ ನಿಮಿಷಗಳ ನಿಶ್ಯಬ್ದ ದೀರ್ಘ ಉಸಿರಾಟ ಧ್ಯಾನ.',
          hi: '१० मिनट मौन प्राणायाम एवं भ्रामरी।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Bram Breem Broum Sah Budhaya Namaha • Sri Vishnu Sahasranama',
          kn: 'ಓಂ ಬ್ರಾಂ ಬ್ರೀಂ ಬ್ರೌಂ ಸಃ ಬುಧಾಯ ನಮಃ • ಶ್ರೀ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಸ್ತೋತ್ರ',
          hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः • श्री विष्णु सहस्रनाम'
        },
        beejaMantra: 'ॐ बुं बुधाय नमः',
        mantraCount: '108 times on Wednesdays facing North',
        gemstoneAdvice: {
          en: isWeak ? 'Natural Emerald (Panna) set in gold/panchadhatu on little finger.' : 'Chant Vishnu Sahasranama and worship Tulasi if Mercury is combust.',
          kn: isWeak ? 'ಬುಧ ಯೋಗಕಾರಕನಾಗಿದ್ದರೆ ಮಾತ್ರ ಕಿರುಬೆರಳಿಗೆ ಬಂಗಾರದಲ್ಲಿ ಪಚ್ಚೆ (ಪನ್ನಾ) ರತ್ನ ಧಾರಣೆ.' : 'ಬುಧ ಅಸ್ತಂಗತನಾಗಿದ್ದರೆ ತುಳಸಿ ಪೂಜೆ ಹಾಗೂ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಣ ಸಾಕು.',
          hi: isWeak ? 'कनिष्ठिका में पन्ना धारण करें।' : 'विष्णु सहस्रनाम का पाठ करें।'
        },
        rudrakshaMukhi: {
          en: '4-Mukhi or 10-Mukhi Rudraksha (Governed by Lord Brahma & Vishnu; sharpens intellect, speech, memory).',
          kn: '೪-ಮುಖಿ ಅಥವಾ ೧೦-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಬ್ರಹ್ಮ & ವಿಷ್ಣುವಿನ ಸ್ವರೂಪ; ವಾಕ್ ಸಿದ್ಧಿ, ಸ್ಮರಣ ಶಕ್ತಿ ಮತ್ತು ಏಕಾಗ್ರತೆ).',
          hi: '४-मुखी अथवा १०-मुखी रुद्राक्ष (मेधा एवं वाक सिद्धि हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Whole green moong beans, green vegetables, green cloth, books, and pens to students.',
            kn: 'ಹಸಿರು ಹೆಸರು ಕಾಳು, ಹಸಿರು ತರಕಾರಿಗಳು, ಹಸಿರು ವಸ್ತ್ರ, ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪುಸ್ತಕ ಮತ್ತು ಲೇಖನಿಗಳು.',
            hi: 'साबुत मूंग, हरी सब्जियां, हरा वस्त्र एवं विद्यार्थियों को पुस्तकें।'
          },
          dayAndTime: {
            en: 'Wednesday morning between 6:00 AM - 7:30 AM (Budha Hora).',
            kn: 'ಬುಧವಾರ ಮುಂಜಾನೆ ಬುಧ ಹೋರೆಯಲ್ಲಿ (೬:೦೦ - ೭:೩೦).',
            hi: 'बुधवार प्रातः समय।'
          },
          recipient: {
            en: 'To poor deserving students, orphan children, or cow shelters (feeding green grass to cows).',
            kn: 'ಬಡ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ, ಅನಾಥ ಮಕ್ಕಳಿಗೆ, ಅಥವಾ ಗೋಶಾಲೆಗೆ ಹಸಿರು ಹುಲ್ಲು ನೀಡುವುದು.',
            hi: 'विद्यार्थियों को अथवा गोशाला में गायों को हरा चारा।'
          }
        },
        deityVeneration: {
          en: 'Lord Vishnu and Goddess Saraswati.',
          kn: 'ಶ್ರೀ ಮಹಾವಿಷ್ಣು ಮತ್ತು ವಿದ್ಯಾ ಅಧಿದೇವತೆ ತಾಯಿ ಸರಸ್ವತಿ ಆರಾಧನೆ.',
          hi: 'भगवान विष्णु एवं मां सरस्वती।'
        },
        sacredRitual: {
          en: 'Daily offering of fresh water to Tulasi plant and lighting ghee deepa; chanting Budha Kavacha.',
          kn: 'ತುಳಸಿ ಗಿಡಕ್ಕೆ ನೀರೆರೆದು ಪ್ರದಕ್ಷಿಣೆ ಹಾಕುವುದು; ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ ಬುಧ ಕವಚ ಪಠಣ.',
          hi: 'तुलसी के पौधे में जल एवं घी का दीपक।'
        }
      }
    };
  }

  // Jupiter profile
  if (normName.includes('jupiter') || normName.includes('guru') || normName.includes('brihaspati')) {
    const isWeak = strengthCat === 'weak' || [6, 8, 12].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Jupiter in House ${bhava} governs liver hepatocytes, adipose fat metabolism, pancreas enzymes, arterial circulation, and immune growth. ${isWeak ? 'Sluggish liver or metabolic imbalance; nourish with yellow spices and bitter greens.' : 'Bestows profound divine grace, wisdom, and biological resilience.'}`,
        kn: `ಗುರುವು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಯಕೃತ್ತು (ಲಿವರ್), ಮೇದೋಜೀರಕ ಗ್ರಂಥಿ, ಕೊಬ್ಬಿನ ಚಯಾಪಚಯ ಮತ್ತು ರಕ್ತನಾಳಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ಯಕೃತ್ತಿನ ಮಂದತೆ ಅಥವಾ ತೂಕ ಏರಿಕೆ ಸಾಧ್ಯತೆ; ಅರಿಶಿನ ಹಾಗೂ ಸಾತ್ವಿಕ ಆಹಾರ ಅಗತ್ಯ.' : 'ಅಪಾರ ದೈವಕೃಪೆ, ಸಾತ್ವಿಕ ಜ್ಞಾನ ಮತ್ತು ದೀರ್ಘಾಯುಷ್ಯ ಕರುಣಿಸುತ್ತಾನೆ.'}`,
        hi: `गुरु भाव ${bhava} में यकृत, चर्बी, पाचन रस एवं बुद्धि का नियमन करते हैं। ${isWeak ? 'यकृत शोधन आवश्यक है।' : 'शुभ फल एवं ज्ञान में वृद्धि।'}`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Liver-cleansing, golden anti-inflammatory diet rich in pure A2 ghee, legumes, and curcumin.',
          kn: 'ಯಕೃತ್ತು ಶುದ್ಧೀಕರಣ, ಉರಿಯೂತ ನಿವಾರಕ, ಅರಿಶಿನ, ಕಡಲೆ ಕಾಳು ಮತ್ತು ತುಪ್ಪದ ಪವಿತ್ರ ಆಹಾರ.',
          hi: 'यकृत शोधक, हल्दी एवं चने की दाल प्रधान सात्त्विक आहार।'
        },
        superfoods: {
          en: 'Split yellow chickpeas (Chana dal), turmeric, pure A2 cow ghee, honey, papayas, and bananas.',
          kn: 'ಕಡಲೆ ಬೇಳೆ, ಹಸಿ ಅರಿಶಿನ, ಹಸುವಿನ ತುಪ್ಪ, ಜೇನುತುಪ್ಪ, ಪಪ್ಪಾಯಿ, ಮತ್ತು ಬಾಳೆಹಣ್ಣು.',
          hi: 'चने की दाल, हल्दी, गाय का घी, शहद एवं पपीता।'
        },
        targetedNutrients: {
          en: 'Curcumin with Piperine, Choline, Milk Thistle extract, Chromium, and Vitamin E.',
          kn: 'ಅರಿಶಿನದ ಕರ್ಕ್ಯುಮಿನ್, ಕೋಲೀನ್, ಕ್ರೋಮಿಯಂ, ಮತ್ತು ವಿಟಮಿನ್ ಇ.',
          hi: 'करक्यूमिन, कोलीन, क्रोमियम एवं विटामिन ई।'
        },
        foodsToConsume: [
          { en: 'Golden milk (warm milk with pure turmeric and cardamom)', kn: 'ಅರಿಶಿನ ಮತ್ತು ಏಲಕ್ಕಿ ಬೆರೆಸಿದ ಬಿಸಿ ಹಾಲು (ಗೋಲ್ಡನ್ ಮಿಲ್ಕ್)', hi: 'हल्दी वाला गुनगुना दूध' },
          { en: 'Cooked yellow moong dal with turmeric and ghee', kn: 'ಅರಿಶಿನ ಮತ್ತು ತುಪ್ಪದಿಂದ ಮಾಡಿದ ಹಳದಿ ಬೇಳೆ ಸಾರು', hi: 'हल्दी व घी युक्त पीली दाल' },
          { en: 'Fresh ripe papayas to enhance liver enzyme secretion', kn: 'ಯಕೃತ್ತಿನ ಆರೋಗ್ಯಕ್ಕೆ ಹಣ್ಣಾದ ಪಪ್ಪಾಯಿ', hi: 'पका हुआ पपीता' },
          { en: 'Lukewarm water with pure raw honey in the morning', kn: 'ಬೆಳಿಗ್ಗೆ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿಗೆ ಒಂದು ಚಮಚ ಜೇನುತುಪ್ಪ', hi: 'गुनगुने जल में शहद' }
        ],
        foodsToAvoid: [
          { en: 'Deep-fried oily pastries and trans-fat loaded snacks', kn: 'ಕೃತಕ ಎಣ್ಣೆಯ ಕರಿದ ತಿಂಡಿಗಳು ಮತ್ತು ಬೇಕರಿ ತಿನಿಸುಗಳು', hi: 'अत्यधिक चिकनाई, ट्रांस फैट एवं वनस्पति घी' },
          { en: 'Processed refined sugar syrup causing fatty liver', kn: 'ಯಕೃತ್ತಿಗೆ ಹಾನಿ ಮಾಡುವ ಬಿಳಿ ಸಕ್ಕರೆ ಮತ್ತು ಸ್ವೀಟ್ಸ್', hi: 'अत्यधिक मीठे व कृत्रिम शर्करा वाले पेय' },
          { en: 'Excess heavy dairy creams and stale unpasteurized cheeses', kn: 'ಅತಿಯಾದ ಚೀಸ್ ಮತ್ತು ತಂಗಳಾದ ಕ್ರೀಮ್ ಪದಾರ್ಥಗಳು', hi: 'अत्यधिक पनीर व बासी मलाई' }
        ],
        herbalDecoctions: {
          en: 'Boiled water with cinnamon, dry ginger, and turmeric; Guduchi (Giloy) decoction for immunity.',
          kn: 'ದಾಲ್ಚಿನ್ನಿ, ಒಣಶುಂಠಿ ಮತ್ತು ಅರಿಶಿನದ ಕಷಾಯ; ರೋಗನಿರೋಧಕ ಶಕ್ತಿಗೆ ಅಮೃತಬಳ್ಳಿ (ಗುಡೂಚಿ).',
          hi: 'गिलोय एवं हल्दी का काढ़ा।'
        },
        optimalMealTimings: {
          en: 'Fast or observe light fruit diet on Thursdays; eat lunch mindfully during solar hours.',
          kn: 'ಗುರುವಾರ ಉಪವಾಸ ಅಥವಾ ಹಣ್ಣಿನ ಲಘು ಆಹಾರ; ಸೂರ್ಯನ ಬೆಳಕಿರುವಾಗ ಮಾತ್ರ ಆಹಾರ ಸೇವನೆ.',
          hi: 'गुरुवार को फलाहार या हल्का आहार लें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Wake up with sacred remembrance; study spiritual scriptures (Gita / Upanishads); respect Guru and teachers.',
          kn: 'ಬೆಳಿಗ್ಗೆ ಎದ್ದು ಇಷ್ಟದೇವತಾ ಸ್ಮರಣೆ; ಭಗವದ್ಗೀತೆ ಅಥವಾ ಸದ್ಗ್ರಂಥಗಳ ಪಠಣ; ಗುರುಹಿರಿಯರಿಗೆ ನಮಸ್ಕಾರ.',
          hi: 'प्रातः आध्यात्मिक चिंतन, गुरु वंदना एवं धार्मिक ग्रंथों का अध्ययन।'
        },
        exerciseAndMovement: {
          en: 'Regular walking, gentle aerobic movement to manage body mass, and Pranayama.',
          kn: 'ದಿನನಿತ್ಯ ಸತತ ನಡಿಗೆ, ತೂಕ ನಿಯಂತ್ರಣಕ್ಕೆ ಲಘು ವ್ಯಾಯಾಮ ಮತ್ತು ಪ್ರಾಣಾಯಾಮ.',
          hi: 'नियमित टहलना एवं प्राणायाम।'
        },
        sunAndNatureTherapy: {
          en: 'Worshiping the sacred Ashvattha (Peepal) or Banana tree in morning sunlight.',
          kn: 'ಬೆಳಗಿನ ಬಿಸಿಲಿನಲ್ಲಿ ಅಶ್ವತ್ಥ ವೃಕ್ಷ ಅಥವಾ ಬಾಳೆಗಿಡಕ್ಕೆ ಪ್ರದಕ್ಷಿಣೆ ಹಾಗೂ ನಮಸ್ಕಾರ.',
          hi: 'पीपल या केले के वृक्ष की परिक्रमा।'
        },
        colorTherapy: {
          en: 'Bright yellow, golden amber, turmeric hue, and warm saffron on Thursdays.',
          kn: 'ಗುರುವಾರದಂದು ಹಳದಿ, ಬಂಗಾರದ ವರ್ಣ, ಅರಿಶಿನ ಬಣ್ಣ ಹಾಗೂ ಕೇಸರಿ ಉಡುಪು ಧಾರಣೆ.',
          hi: 'गुरुवार को पीला अथवा सुनहरा रंग।'
        },
        mindfulRelaxation: {
          en: 'Meditation on divine grace and cosmic abundance; practicing unconditional forgiveness.',
          kn: 'ದೈವಿಕ ಕೃಪೆಯ ಮೇಲೆ ಧ್ಯಾನ; ಕ್ಷಮಾ ಗುಣ ಮತ್ತು ವಿಶಾಲ ಮನೋಭಾವ ಬೆಳೆಸಿಕೊಳ್ಳುವುದು.',
          hi: 'गुरु मंत्र का ध्यान एवं परोपकार की भावना।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Gram Greem Groum Sah Gurave Namaha • Sri Dakshinamurthy Stotram • Guru Gayatri',
          kn: 'ಓಂ ಗ್ರಾಂ ಗ್ರೀಂ ಗ್ರೌಂ ಸಃ ಗುರವೇ ನಮಃ • ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ ಸ್ತೋತ್ರ',
          hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः • श्री दक्षिणामूर्ति स्तोत्र'
        },
        beejaMantra: 'ॐ बृं बृहस्पतये नमः',
        mantraCount: '108 times on Thursdays facing North-East (Ishan)',
        gemstoneAdvice: {
          en: isWeak ? 'Natural untreated Yellow Sapphire (Pukhraj) set in gold on index finger (Tarjani).' : 'Worship Guru Yantra and offer chana dal if Guru is functionally malefic.',
          kn: isWeak ? 'ಗುರು ಶುಭನಾಗಿದ್ದರೆ ತೋರುಬೆರಳಿಗೆ ಬಂಗಾರದಲ್ಲಿ ಹಳದಿ ಪುಷ್ಯರಾಗ (ಪುಖ್‌ರಾಜ್) ರತ್ನ ಧಾರಣೆ.' : 'ಗುರು ಮಾರಕನಾಗಿದ್ದರೆ ರತ್ನ ಧರಿಸಬೇಡಿ; ಕಡಲೆಕಾಳು ದಾನ ಹಾಗೂ ವಿಷ್ಣು ಪೂಜೆ ಸಾಕು.',
          hi: isWeak ? 'तर्जनी उंगली में सोने में पुखराज धारण करें।' : 'बृहस्पति यन्त्र की पूजा करें।'
        },
        rudrakshaMukhi: {
          en: '5-Mukhi Rudraksha (Governed by Kalagni Rudra / Guru; universal health, peace, and spiritual growth).',
          kn: '೫-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ದೇವಗುರು ಬೃಹಸ್ಪತಿಯ ಸ್ವರೂಪ; ಆರೋಗ್ಯ, ಸನ್ಮಾರ್ಗ, ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣ).',
          hi: '५-मुखी रुद्राक्ष (आरोग्य एवं मानसिक शांति हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Yellow split chickpeas (Chana dal), turmeric root, yellow cloth, saffron sweets, and pure cow ghee.',
            kn: 'ಕಡಲೆ ಬೇಳೆ, ಅರಿಶಿನ ಕೊಂಬು, ಹಳದಿ ವಸ್ತ್ರ, ಹಳದಿ ಸಿಹಿ ತಿನಿಸು, ಮತ್ತು ಹಸುವಿನ ತುಪ್ಪ.',
            hi: 'चने की दाल, साबुत हल्दी, पीला वस्त्र एवं बेसन के लड्डू।'
          },
          dayAndTime: {
            en: 'Thursday morning during Guru Hora (6:00 AM - 7:30 AM).',
            kn: 'ಗುರುವಾರ ಮುಂಜಾನೆ ಗುರು ಹೋರೆಯಲ್ಲಿ (೬:೦೦ - ೭:೩೦).',
            hi: 'गुरुवार प्रातः काल।'
          },
          recipient: {
            en: 'To spiritual teachers, temple priests, scholars, or educational institutions.',
            kn: 'ಗುರುಗಳಿಗೆ, ಆಚಾರ್ಯರಿಗೆ, ವೇದ ಪಾಠಶಾಲೆಗೆ ಅಥವಾ ಬಡ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ.',
            hi: 'शिक्षकों, गुरुओं अथवा निर्धन छात्रों को।'
          }
        },
        deityVeneration: {
          en: 'Lord Shiva as Sri Dakshinamurthy, Lord Dattatreya, and Sri Raghavendra Swamy.',
          kn: 'ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ, ಶ್ರೀ ಗುರು ದತ್ತಾತ್ರೇಯ, ಮತ್ತು ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳ ಆರಾಧನೆ.',
          hi: 'भगवान दक्षिणामूर्ति, दत्तात्रेय एवं गुरुदेव।'
        },
        sacredRitual: {
          en: 'Watering the Peepal tree on Thursdays; applying yellow sandalwood / turmeric tilak to forehead.',
          kn: 'ಗುರುವಾರ ಅಶ್ವತ್ಥ ವೃಕ್ಷಕ್ಕೆ ನೀರೆರೆದು ಪ್ರದಕ್ಷಿಣೆ; ಹಣೆಗೆ ಹಳದಿ ಗಂಧ ಅಥವಾ ಅರಿಶಿನ ತಿಲಕ ಧಾರಣೆ.',
          hi: 'माथे पर केसर अथवा हल्दी का तिलक लगाना।'
        }
      }
    };
  }

  // Venus profile
  if (normName.includes('venus') || normName.includes('shukra')) {
    const isWeak = strengthCat === 'weak' || [6, 8].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Venus in House ${bhava} governs reproductive fluids (Shukra Dhatu), skin radiance, renal balance, and hormonal harmony. ${isWeak ? 'Hormonal fluctuations or skin dryness; replenish with pure ojas-building foods.' : 'Bestows refined artistic taste, charm, and marital harmony.'}`,
        kn: `ಶುಕ್ರನು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಶುಕ್ರ ಧಾತು, ಪ್ರಣಯ-ದಾಂಪತ್ಯ ಸೌಖ್ಯ, ಹಾರ್ಮೋನು ಸಮತೋಲನ, ಚರ್ಮದ ಕಾಂತಿ ಮತ್ತು ಸೌಂದರ್ಯವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ಹಾರ್ಮೋನು ಏರುಪೇರು ಅಥವಾ ಚರ್ಮದ ಶುಷ್ಕತೆ; ಓಜಸ್ಸು ವೃದ್ಧಿಸುವ ಆಹಾರ ಅಗತ್ಯ.' : 'ಉತ್ತಮ ಸೌಂದರ್ಯ ಪ್ರಜ್ಞೆ ಮತ್ತು ಆಕರ್ಷಕ ವ್ಯಕ್ತಿತ್ವ ನೀಡುತ್ತಾನೆ.'}`,
        hi: `शुक्र भाव ${bhava} में शुक्र धातु, हार्मोन, सौन्दर्य एवं दाम्पत्य सुख का नियमन करते हैं।`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Ojas-replenishing, sweet-cooling, antioxidant-dense diet that balances kidney and hormonal pathways.',
          kn: 'ಓಜಸ್ಸು ವರ್ಧಕ, ಮಧುರ-ಶೀತಲ, ಆಂಟಿಆಕ್ಸಿಡೆಂಟ್ ಭರಿತ ಹಾಗೂ ಹಾರ್ಮೋನು ಸಮತೋಲನದ ಸಾತ್ವಿಕ ಆಹಾರ.',
          hi: 'ओजस वर्धक, सौम्य, पोषक एवं ताजे फलों का आहार।'
        },
        superfoods: {
          en: 'Amla (Indian gooseberry), fresh pomegranate, sweet curd, lotus seeds, almonds, and pure cow milk.',
          kn: 'ಬೆಟ್ಟದ ನೆಲ್ಲಿಕಾಯಿ (ಆಮ್ಲ), ದಾಳಿಂಬೆ, ಮಖಾನ (ಕಮಲದ ಬೀಜ), ಬಾದಾಮಿ, ಮತ್ತು ಶುದ್ಧ ಹಸುವಿನ ಹಾಲು.',
          hi: 'आंवला, अनार, ताजी दही, मखाना एवं बादाम।'
        },
        targetedNutrients: {
          en: 'Zinc for reproductive vitality, Vitamin E for skin, Evening Primrose / Omega-3, and Biotin.',
          kn: 'ಜಿಂಕ್, ಚರ್ಮದ ಕಾಂತಿಗೆ ವಿಟಮಿನ್ ಇ, ಒಮೆಗಾ-೩, ಮತ್ತು ಬಯೋಟಿನ್.',
          hi: 'जिंक, विटामिन ई, ओमेगा-३ एवं बायोटिन।'
        },
        foodsToConsume: [
          { en: 'Fresh amla juice mixed with a teaspoon of honey', kn: 'ಒಂದು ಚಮಚ ಜೇನುತುಪ್ಪ ಬೆರೆಸಿದ ತಾಜಾ ನೆಲ್ಲಿಕಾಯಿ ರಸ', hi: 'शहद युक्त ताजे आंवले का रस' },
          { en: 'Roasted foxnuts (Makhana) cooked in milk as a light dessert', kn: 'ಹಾಲಿನಲ್ಲಿ ಬೇಯಿಸಿದ ಮಖಾನ ಪಾಯಸ', hi: 'मखाने की खीर' },
          { en: 'Fresh sweet fruits: Pears, sweet apples, white grapes, and figs', kn: 'ತಾಜಾ ಪಿಯರ್ಸ್, ಸಿಹಿ ಸೇಬು, ಬಿಳಿ ದ್ರಾಕ್ಷಿ ಮತ್ತು ಅಂಜೂರ', hi: 'नाशपाती, सेब एवं अंगूर' },
          { en: 'Coconut milk infused vegetable curries', kn: 'ತೆಂಗಿನ ಹಾಲಿನಿಂದ ಮಾಡಿದ ಪೌಷ್ಟಿಕ ತರಕಾರಿ ಸಾರು', hi: 'नारियल के दूध से बनी सब्जियां' }
        ],
        foodsToAvoid: [
          { en: 'Overly sour fermented sauces and artificial vinegar dressings', kn: 'ಅತಿಯಾದ ಹುಳಿ ಸಾಸ್‌ಗಳು ಮತ್ತು ಕೃತಕ ವಿನೆಗರ್ ತಿನಿಸುಗಳು', hi: 'अत्यधिक खट्टे, सिरका युक्त भोजन' },
          { en: 'Burnt charred foods and excessive street savory junk', kn: 'ಕರಕಲಾದ ಸುಟ್ಟ ತಿನಿಸುಗಳು ಮತ್ತು ಜಂಕ್ ಫುಡ್', hi: 'अत्यधिक मसालेदार चाट-पकौड़ी' },
          { en: 'Late night sugary bingeing that destroys collagen and Ojas', kn: 'ತಡರಾತ್ರಿ ತಿನ್ನುವ ಚಾಕೊಲೇಟ್ ಮತ್ತು ಸಕ್ಕರೆ ತಿಂಡಿಗಳು', hi: 'देर रात में अधिक मीठा खाना' }
        ],
        herbalDecoctions: {
          en: 'Shatavari boiled in milk; rose petal water (Gulab jal) infusion.',
          kn: 'ಶತಾವರಿ ಬೇಯಿಸಿದ ಹಾಲು; ಗುಲಾಬಿ ದಳಗಳ ತಂಪಾದ ನೀರು.',
          hi: 'शतावरी युक्त दूध एवं गुलाब जल का शरबत।'
        },
        optimalMealTimings: {
          en: 'Eat in visually pleasing, clean surroundings with aesthetic table arrangements and calming music.',
          kn: 'ಸುಂದರ, ಸ್ವಚ್ಛ ವಾತಾವರಣದಲ್ಲಿ ಮನಸ್ಸಿಗೆ ಆಹ್ಲಾದಕರವಾದ ಸಂಗೀತ ಕೇಳುತ್ತಾ ಊಟ ಮಾಡಿ.',
          hi: 'सुंदर व स्वच्छ वातावरण में शांत मन से भोजन करें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Practice cleanliness (Shaucha); wear washed fragrant clothes; surround oneself with floral scents and art.',
          kn: 'ಶೌಚ (ಸ್ವಚ್ಛತೆ) ಪಾಲನೆ; ಸುಗಂಧಭರಿತ ಸ್ವಚ್ಛ ವಸ್ತ್ರ ಧರಿಸಿ; ಮನೆಯಲ್ಲಿ ಹೂವುಗಳು ಹಾಗೂ ಕಲೆಗಳಿಗೆ ಆಸ್ಪದ ನೀಡಿ.',
          hi: 'स्वच्छता का पालन, सुगंधित व स्वच्छ वस्त्र पहनना।'
        },
        exerciseAndMovement: {
          en: 'Classical dancing, gentle Pilates, pelvic floor yoga asanas (Baddha Konasana).',
          kn: 'ನೃತ್ಯ, ಲಘು ಯೋಗಾಸನಗಳು, ಮತ್ತು ಪೆಲ್ವಿಕ್ ಸ್ನಾಯುಗಳ ವ್ಯಾಯಾಮ (ಬದ್ಧ ಕೋನಾಸನ).',
          hi: 'नृत्य, योग एवं सौम्य व्यायाम।'
        },
        sunAndNatureTherapy: {
          en: 'Evening strolls in fragrant rose and jasmine gardens under twilight breeze.',
          kn: 'ಸಂಜೆ ತಂಪಾದ ತಂಗಾಳಿಯಲ್ಲಿ ಮಲ್ಲಿಗೆ ಅಥವಾ ಗುಲಾಬಿ ತೋಟದಲ್ಲಿ ನಡಿಗೆ.',
          hi: 'सायंकाल सुगंधित पुष्पों की वाटिका में भ्रमण।'
        },
        colorTherapy: {
          en: 'Silk white, cream, soft pastel floral shades, and silver on Fridays.',
          kn: 'ಶುಕ್ರವಾರದಂದು ರೇಷ್ಮೆ ಬಿಳಿ, ಕೆನೆ ಬಣ್ಣ (ಕ್ರೀಮ್), ಮತ್ತು ತಿಳಿ ಗುಲಾಬಿ ಬಣ್ಣದ ಉಡುಪು.',
          hi: 'शुक्रवार को रेशमी श्वेत, क्रीम अथवा हल्का गुलाबी रंग।'
        },
        mindfulRelaxation: {
          en: 'Listening to classical ragas (Mohanam, Kalyani); creative painting or music appreciation.',
          kn: 'ಕಲ್ಯಾಣಿ, ಮೋಹನಂ ಮುಂತಾದ ಶಾಸ್ತ್ರೀಯ ರಾಗಗಳನ್ನು ಆಲಿಸುವುದು; ಕಲಾ ಆರಾಧನೆ.',
          hi: 'शास्त्रीय संगीत का श्रवण एवं कलात्मक अभिरुचि।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Dram Dreem Droum Sah Shukraya Namaha • Sri Suktam • Mahalakshmi Ashtakam',
          kn: 'ಓಂ ದ್ರಾಂ ದ್ರೀಂ ದ್ರೌಂ ಸಃ ಶುಕ್ರಾಯ ನಮಃ • ಶ್ರೀ ಸೂಕ್ತಂ • ಮಹಾಲಕ್ಷ್ಮಿ ಅಷ್ಟಕಂ',
          hi: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः • श्री सूक्तम्'
        },
        beejaMantra: 'ॐ शुं शुक्राय नमः',
        mantraCount: '108 times on Fridays facing South-East (Agneya)',
        gemstoneAdvice: {
          en: isWeak ? 'Natural Diamond (Heera) or White Zircon set in platinum/silver on middle or little finger.' : 'Worship Goddess Lakshmi and light cow ghee lamp if Venus is malefic.',
          kn: isWeak ? 'ಶುಕ್ರ ಯೋಗಕಾರಕನಾಗಿದ್ದರೆ ಮಾತ್ರ ಬೆಳ್ಳಿಯಲ್ಲಿ ವಜ್ರ (ಡೈಮಂಡ್) ಅಥವಾ ಬಿಳಿ ಜಿರ್ಕಾನ್ ರತ್ನ ಧಾರಣೆ.' : 'ಮಾರಕನಾಗಿದ್ದರೆ ರತ್ನ ಬೇಡ; ಮಹಾಲಕ್ಷ್ಮಿ ಪೂಜೆ ಹಾಗೂ ಶ್ರೀಸೂಕ್ತ ಪಠಣ ಶ್ರೇಷ್ಠ.',
          hi: isWeak ? 'चांदी में हीरा अथवा सफेद जरकन धारण करें।' : 'मां महालक्ष्मी की पूजा करें।'
        },
        rudrakshaMukhi: {
          en: '6-Mukhi Rudraksha (Governed by Kartikeya & Venus; enhances charm, emotional balance, and hormonal health).',
          kn: '೬-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಕಾರ್ತಿಕೇಯ & ಶುಕ್ರನ ಸ್ವರೂಪ; ಆಕರ್ಷಕ ವ್ಯಕ್ತಿತ್ವ, ಹಾರ್ಮೋನು ಸಮತೋಲನ ಹಾಗೂ ಕಲಾ ಸಿದ್ಧಿ).',
          hi: '६-मुखी रुद्राक्ष (सौन्दर्य एवं आकर्षण वृद्धि हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Basmati rice, pure cow ghee, sugar candy (Mishri), white silk cloth, perfumes, and curd.',
            kn: 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ, ಹಸುವಿನ ತುಪ್ಪ, ಕಲ್ಲುಸಕ್ಕರೆ, ಬಿಳಿ ರೇಷ್ಮೆ ಬಟ್ಟೆ, ಸುಗಂಧ ದ್ರವ್ಯ, ಮತ್ತು ಮೊಸರು.',
            hi: 'चावल, शुद्ध घी, मिश्री, सफेद रेशमी वस्त्र, इत्र एवं दही।'
          },
          dayAndTime: {
            en: 'Friday morning between 6:00 AM - 7:30 AM or evening twilight (Shukra Hora).',
            kn: 'ಶುಕ್ರವಾರ ಮುಂಜಾನೆ ಶುಕ್ರ ಹೋರೆಯಲ್ಲಿ ಅಥವಾ ಸಂಜೆ ಗೋಧೂಳಿ ವೇಳೆಯಲ್ಲಿ.',
            hi: 'शुक्रवार प्रातः अथवा संध्या समय।'
          },
          recipient: {
            en: 'To married women (Sumangalis), young female artists, or female students.',
            kn: 'ಸುಮಂಗಲಿಯರಿಗೆ, ಬಡ ಕಲಾವಿದರಿಗೆ, ಅಥವಾ ಹೆಣ್ಣುಮಕ್ಕಳಿಗೆ.',
            hi: 'सुहागिन महिलाओं अथवा कन्याओं को।'
          }
        },
        deityVeneration: {
          en: 'Goddess Mahalakshmi and Sri Lalitha Tripurasundari.',
          kn: 'ತಾಯಿ ಮಹಾಲಕ್ಷ್ಮಿ ಮತ್ತು ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರಸುಂದರಿ ಆರಾಧನೆ.',
          hi: 'मां महालक्ष्मी एवं मां ललिता त्रिपुरसुन्दरी।'
        },
        sacredRitual: {
          en: 'Lighting fragrant cow ghee lamp with two wicks on Fridays; offering white scented flowers (Jasmine).',
          kn: 'ಶುಕ್ರವಾರ ಎರಡು ಬತ್ತಿಗಳ ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ ಮಲ್ಲಿಗೆ ಹೂವಿನಿಂದ ಲಕ್ಷ್ಮಿ ಪೂಜೆ.',
          hi: 'शुक्रवार को सुगंधित धूप एवं श्वेत पुष्पों से महालक्ष्मी की पूजा।'
        }
      }
    };
  }

  // Saturn profile
  if (normName.includes('saturn') || normName.includes('shani')) {
    const isWeak = strengthCat === 'weak' || [1, 8].includes(bhava);
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Saturn in House ${bhava} governs the skeletal bones, joint fluid lubrication, teeth, longevity (Ayus), and Vata nervous grounding. ${isWeak ? 'Sluggish metabolism, dry tissues, joint stiffness, or melancholia; ground with warm oil and mineral therapy.' : 'Grants monumental perseverance, practical realism, and lasting success.'}`,
        kn: `ಶನಿಯು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಮೂಳೆಗಳು, ಕೀಲುಗಳ ನಯ (ಲ್ಯೂಬ್ರಿಕೇಷನ್), ಹಲ್ಲುಗಳು, ಆಯುಷ್ಯ ಮತ್ತು ವಾತ ದೋಷವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತಾನೆ. ${isWeak ? 'ಕೀಲು ನೋವು, ಮಲಬದ್ಧತೆ, ಒಣಚರ್ಮ ಅಥವಾ ನಿರುತ್ಸಾಹ ಸಾಧ್ಯತೆ; ಬಿಸಿ ಎಣ್ಣೆ ಮಸಾಜ್ ಮತ್ತು ಪೋಷಕ ಆಹಾರ ಅಗತ್ಯ.' : 'ಅದ್ಭುತ ತಾಳ್ಮೆ, ಸತತ ಪರಿಶ್ರಮ ಮತ್ತು ಶಾಶ್ವತ ಯಶಸ್ಸು ನೀಡುತ್ತಾನೆ.'}`,
        hi: `शनि भाव ${bhava} में अस्थि, जोड़, वात दोष, आयु एवं धैर्य का नियमन करते हैं।`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Warm, deeply nourishing, grounding Vata-pacifying diet with healthy unrefined oils and stewed roots.',
          kn: 'ಬಿಸಿ, ಸ್ನಿಗ್ಧ, ವಾತ ಶಮನಗೊಳಿಸುವ, ಶುದ್ಧ ಎಣ್ಣೆಗಳು ಮತ್ತು ಬೇಯಿಸಿದ ಗೆಡ್ಡೆ-ಗೆಣಸುಗಳ ಪೌಷ್ಟಿಕ ಸಾತ್ವಿಕ ಆಹಾರ.',
          hi: 'उष्ण, स्निग्ध, वात-शामक एवं सुपाच्य सूप व दलिया का आहार।'
        },
        superfoods: {
          en: 'Black sesame seeds (Til), cold-pressed sesame oil, warm porridge, pumpkin seeds, soaked black raisins, and bone broths or rich legume stews.',
          kn: 'ಕಪ್ಪು ಎಳ್ಳು, ಗಾಣದ ಎಳ್ಳೆಣ್ಣೆ, ಬಿಸಿ ಗಂಜಿ, ಕುಂಬಳಕಾಯಿ ಬೀಜ, ನೆನೆಸಿದ ಒಣದ್ರಾಕ್ಷಿ, ಮತ್ತು ಬಿಸಿ ತರಕಾರಿ ಸೂಪ್.',
          hi: 'काले तिल, तिल का तेल, गर्म दलिया, कद्दू के बीज एवं मुनक्का।'
        },
        targetedNutrients: {
          en: 'Magnesium Glycinate for muscle/joint relaxation, Vitamin D3 + K2 for bone matrix, Calcium, and Omega-3.',
          kn: 'ಮೂಳೆಗಳಿಗೆ ವಿಟಮಿನ್ ಡಿ೩ + ಕೆ೨, ಕೀಲುಗಳಿಗೆ ಮೆಗ್ನೀಸಿಯಮ್, ಕ್ಯಾಲ್ಸಿಯಂ, ಮತ್ತು ಒಮೆಗಾ-೩.',
          hi: 'मैग्नीशियम, विटामिन डी३ व के२, कैल्शियम एवं ओमेगा-३।'
        },
        foodsToConsume: [
          { en: 'Warm sesame laddus made with pure jaggery in the winter/morning', kn: 'ಬೆಲ್ಲ ಬೆರೆಸಿದ ಎಳ್ಳಿನ ಉಂಡೆ (ಬೆಳಿಗ್ಗೆ ಸೇವನೆ)', hi: 'गुड़ व तिल के लड्डू' },
          { en: 'Warm stewed vegetable soups cooked with a teaspoon of sesame oil', kn: 'ಎಳ್ಳೆಣ್ಣೆ ಒಗ್ಗರಣೆ ಹಾಕಿದ ಬಿಸಿ ತರಕಾರಿ ಸೂಪ್', hi: 'गर्म सब्जियों का सूप' },
          { en: 'Steamed brown rice or khichdi with generous melted cow ghee', kn: 'ಶುದ್ಧ ತುಪ್ಪ ಬೆರೆಸಿದ ಬಿಸಿ ಅನ್ನ ಅಥವಾ ಗಂಜಿ', hi: 'घी युक्त गर्म खिचड़ी' },
          { en: 'Warm herbal milk with dry ginger and nutmeg before bed', kn: 'ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ಒಣಶುಂಠಿ ಮತ್ತು ಜಾಯಿಕಾಯಿ ಬೆರೆಸಿದ ಬಿಸಿ ಹಾಲು', hi: 'सोंठ व जायफल युक्त गर्म दूध' }
        ],
        foodsToAvoid: [
          { en: 'Cold refrigerated beverages and iced drinking water', kn: 'ಫ್ರಿಡ್ಜ್‌ನ ತಣ್ಣೀರು ಮತ್ತು ಐಸ್ ಹಾಕಿದ ಪಾನೀಯಗಳು', hi: 'अत्यधिक ठंडा जल एवं बर्फ वाले पेय' },
          { en: 'Raw uncooked cabbage, cauliflower, and dry dry crackers that aggravate Vata', kn: 'ಹಸಿ ಎಲೆಕೋಸು, ಹೂಕೋಸು ಮತ್ತು ಒಣಗಿದ ಕುರುಕುಲು ತಿಂಡಿಗಳು (ವಾತ ವೃದ್ಧಿ)', hi: 'कच्ची पत्तागोभी, फूलगोभी एवं सूखे खाद्य' },
          { en: 'Stale leftovers and ultra-processed canned foods', kn: 'ತಂಗಿಟ್ಟ ತಂಗಳು ಅನ್ನ ಮತ್ತು ಪ್ಯಾಕೆಟ್ ಫುಡ್ಸ್', hi: 'बासी एवं डिब्बाबंद भोजन' }
        ],
        herbalDecoctions: {
          en: 'Ashwagandha root boiled with milk; Guggulu decoction for joint elasticity.',
          kn: 'ಹಾಲಿನೊಂದಿಗೆ ಅಶ್ವಗಂಧ ಚೂರ್ಣ; ಕೀಲುಗಳ ಬಲಕ್ಕೆ ಗುಗ್ಗುಳು ಕಷಾಯ.',
          hi: 'अश्वगंधा चूर्ण दूध के साथ; गुग्गुल का काढ़ा।'
        },
        optimalMealTimings: {
          en: 'Eat at strictly disciplined regular intervals; never leave the stomach empty for prolonged erratic periods.',
          kn: 'ನಿಗದಿತ ಸಮಯಕ್ಕೆ ಊಟ ಮಾಡುವ ಶಿಸ್ತು ಪಾಲಿಸಿ; ಹೊಟ್ಟೆಯನ್ನು ಅತಿಯಾಗಿ ಖಾಲಿ ಬಿಡಬೇಡಿ.',
          hi: 'नियमित समय पर भोजन करें; भोजन का समय न टालें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Wake up before sunrise; practice Abhyanga (warm sesame oil self-massage) on Saturdays before bath.',
          kn: 'ಶನಿವಾರದಂದು ಬಿಸಿ ಎಳ್ಳೆಣ್ಣೆಯಿಂದ ಮೈಗೆ ಅಭ್ಯಂಗ ಸ್ನಾನ; ಶ್ರಮಜೀವಿಗಳಿಗೆ ಗೌರವ ನೀಡಿ.',
          hi: 'शनिवार को गुनगुने तिल के तेल से मालिश (अभ्यंग) एवं स्नान।'
        },
        exerciseAndMovement: {
          en: 'Low-impact joint mobility exercises, steady distance walking, gentle spinal twists (Ardha Matsyendrasana).',
          kn: 'ಕೀಲುಗಳ ನಿಧಾನ ಚಲನೆ, ವಾಕಿಂಗ್, ಹಾಗೂ ಬೆನ್ನೆಲುಬಿನ ಯೋಗಾಸನಗಳು.',
          hi: 'नियमित टहलना एवं जोड़ों के व्यायाम।'
        },
        sunAndNatureTherapy: {
          en: 'Gentle late afternoon sun absorption; sitting quietly in stone sanctuaries or old temples.',
          kn: 'ಸಂಜೆಯ ಸೌಮ್ಯ ಬಿಸಿಲಿನಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳುವುದು; ಪುರಾತನ ದೇವಾಲಯಗಳ ಪ್ರಶಾಂತ ಪರಿಸರದಲ್ಲಿ ಧ್ಯಾನ.',
          hi: 'प्राचीन मंदिरों में शांत बैठकर ध्यान।'
        },
        colorTherapy: {
          en: 'Deep navy blue, charcoal black, dark slate, and steel gray on Saturdays.',
          kn: 'ಶನಿವಾರದಂದು ಕಪ್ಪು, ಗಾಢ ನೀಲಿ (ನೇವಿ ಬ್ಲೂ) ಅಥವಾ ಬೂದು ಬಣ್ಣದ ಉಡುಪು.',
          hi: 'शनिवार को गहरा नीला, काला या स्लेटी रंग।'
        },
        mindfulRelaxation: {
          en: 'Maha Mrityunjaya mantra recitation with deep awareness of breath; cultivating patient acceptance.',
          kn: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಜಪ; ಸಹನೆ ಹಾಗೂ ಕರ್ಮ ಶುದ್ಧಿಯ ಮನೋಭಾವ.',
          hi: 'महामृत्युंजय मंत्र का जप एवं धैर्य का अभ्यास।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Sham Shanaishcharaya Namaha • Maha Mrityunjaya Mantra • Shani Chalisa',
          kn: 'ಓಂ ಶಂ ಶನೈಶ್ಚರಾಯ ನಮಃ • ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ • ಶ್ರೀ ಶನಿ ವಜ್ರಪಂಜರ ಸ್ತೋತ್ರ',
          hi: 'ॐ शं शनैश्चराय नमः • महामृत्युंजय मन्त्र'
        },
        beejaMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
        mantraCount: '108 times on Saturdays facing West at dusk',
        gemstoneAdvice: {
          en: isWeak ? 'Blue Sapphire (Neelam) or Amethyst (Katela) set in silver/iron on middle finger (only after chart verification).' : 'Do not wear Sapphire if malefic; light mustard/sesame oil lamp instead.',
          kn: isWeak ? 'ಶನಿ ಯೋಗಕಾರಕನಾಗಿದ್ದರೆ ಮಾತ್ರ ಮಧ್ಯದ ಬೆರಳಿಗೆ ಬೆಳ್ಳಿ ಅಥವಾ ಪಂಚಲೋಹದಲ್ಲಿ ಇಂದ್ರನೀಲ ರತ್ನ ಧಾರಣೆ.' : 'ಮಾರಕನಾಗಿದ್ದರೆ ನೀಲ ರತ್ನ ಧರಿಸಲೇಬೇಡಿ; ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಪ್ರಜ್ವಲನೆ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ.',
          hi: isWeak ? 'मध्यमा उंगली में नीलम अथवा जामुनिया (कटेला) धारण करें (परामर्श उपरांत ही)।' : 'तिल के तेल का दीपक जलाएं।'
        },
        rudrakshaMukhi: {
          en: '7-Mukhi or 14-Mukhi Rudraksha (Governed by Goddess Mahalakshmi & Shani; removes poverty, delays, and stabilizes Vata).',
          kn: '೭-ಮುಖಿ ಅಥವಾ ೧೪-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಶನಿದೇವ & ಮಹಾಲಕ್ಷ್ಮಿಯ ಕೃಪೆ; ಆರ್ಥಿಕ ಸಂಕಷ್ಟ, ಕೀಲು ನೋವು ಹಾಗೂ ಅಡೆತಡೆಗಳ ನಿವಾರಣೆ).',
          hi: '७-मुखी अथवा १४-मुखी रुद्राक्ष (शनि पीड़ा शांति एवं समृद्धि हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Black sesame seeds, cold-pressed mustard oil, black blanket, iron utensils, and black umbrella.',
            kn: 'ಕಪ್ಪು ಎಳ್ಳು, ಸಾಸಿವೆ ಎಣ್ಣೆ, ಕಪ್ಪು ಕಂಬಳಿ, ಕಬ್ಬಿಣದ ಪಾತ್ರೆ, ಮತ್ತು ಕಪ್ಪು ಕೊಡೆ.',
            hi: 'काले तिल, सरसों का तेल, काला कंबल, लोहे का तवा एवं छाता।'
          },
          dayAndTime: {
            en: 'Saturday evening after sunset (during Shani Hora).',
            kn: 'ಶನಿವಾರ ಸೂರ್ಯಾಸ್ತದ ನಂತರ ಶನಿ ಹೋರೆಯಲ್ಲಿ.',
            hi: 'शनिवार सूर्यास्त के पश्चात।'
          },
          recipient: {
            en: 'To elderly destitute laborers, disabled persons, sweepers, or poor patients.',
            kn: 'ವೃದ್ಧ ಕಾರ್ಮಿಕರಿಗೆ, ಅಂಗವಿಕಲರಿಗೆ, ಪೌರಕಾರ್ಮಿಕರಿಗೆ ಅಥವಾ ನಿರ್ಗತಿಕರಿಗೆ.',
            hi: 'वृद्ध, असहाय, दिव्यांग अथवा सफाई कर्मियों को।'
          }
        },
        deityVeneration: {
          en: 'Lord Shiva, Lord Hanuman, and Sri Shani Mahatma.',
          kn: 'ಭಗವಾನ್ ಶಿವ, ಶ್ರೀ ಆಂಜನೇಯ ಸ್ವಾಮಿ ಮತ್ತು ಶ್ರೀ ಶನಿ ಮಹಾತ್ಮಾ ಆರಾಧನೆ.',
          hi: 'भगवान शिव, श्री हनुमान जी एवं शनि देव।'
        },
        sacredRitual: {
          en: 'Lighting a sesame oil lamp facing West on Saturdays; circumambulating the sacred Peepal tree.',
          kn: 'ಶನಿವಾರ ಸಂಜೆ ಪಶ್ಚಿಮ ದಿಕ್ಕಿನಲ್ಲಿ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಪ್ರಜ್ವಲನೆ; ಅಶ್ವತ್ಥ ವೃಕ್ಷಕ್ಕೆ ನಮಸ್ಕಾರ.',
          hi: 'शनिवार को पीपल वृक्ष के नीचे सरसों/तिल के तेल का दीपक।'
        }
      }
    };
  }

  // Rahu profile
  if (normName.includes('rahu')) {
    return {
      planet,
      balaBreakdown: bala,
      strengthCategory: strengthCat,
      strengthCategoryLocalized: strengthCatLoc,
      statusBadge,
      currentHouseSignificance: {
        en: `Rahu in House ${bhava} represents electric ambitions, psychic perception, but can cause sudden digestive/nervous phobias and sleep irregularities.`,
        kn: `ರಾಹು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಅಸಾಮಾನ್ಯ ಮಹತ್ವಾಕಾಂಕ್ಷೆ ನೀಡಿದರೂ ನಿದ್ರಾಭಂಗ, ಅನಿರೀಕ್ಷಿತ ಅಲರ್ಜಿ ಹಾಗೂ ಮಾನಸಿಕ ತಳಮಳ ತರಬಹುದು.`,
        hi: `राहु भाव ${bhava} में महत्वाकांक्षा, तीव्र सोच एवं अज्ञात भय का नियमन करते हैं।`
      },
      nutritionalTherapy: {
        dietaryPhilosophy: {
          en: 'Detoxifying, gut-cleansing, cooling light diet with fermented probiotics and liver tonics.',
          kn: 'ವಿಷಹರ (ಡಿಟಾಕ್ಸ್), ಹೊಟ್ಟೆ ಶುದ್ಧೀಕರಿಸುವ, ಲಘು ಸಾತ್ವಿಕ ಹಾಗೂ ಪ್ರೋಬಯಾಟಿಕ್ ಭರಿತ ಆಹಾರ.',
          hi: 'विषाक्तता दूर करने वाला, सुपाच್ಯ एवं हल्का आहार।'
        },
        superfoods: {
          en: 'Fresh churned probiotic buttermilk, sprouted green gram, barley water, and amla juice.',
          kn: 'ಜೀರಿಗೆ ಮಜ್ಜಿಗೆ, ಮೊಳಕೆ ಹೆಸರು, ಬಾರ್ಲಿ ನೀರು, ಮತ್ತು ಬೆಟ್ಟದ ನೆಲ್ಲಿಕಾಯಿ ರಸ.',
          hi: 'ताजी छाछ, अंकुरित मूंग, जौ का पानी एवं आंवला।'
        },
        targetedNutrients: {
          en: 'Vitamin B12, High-potency Probiotics, Zinc, and Selenium.',
          kn: 'ವಿಟಮಿನ್ ಬಿ೧೨, ಪ್ರೋಬಯಾಟಿಕ್ಸ್, ಜಿಂಕ್, ಮತ್ತು ಸೆಲೆನಿಯಮ್.',
          hi: 'विटामिन बी१२, प्रोबायोटिक्स एवं सेलेनियम।'
        },
        foodsToConsume: [
          { en: 'Fresh cooling buttermilk with roasted cumin and mint', kn: 'ಹುರಿದ ಜೀರಿಗೆ ಮತ್ತು ಪುದೀನಾ ಬೆರೆಸಿದ ಮಜ್ಜಿಗೆ', hi: 'जीरा व पुदीना युक्त ताजी छाछ' },
          { en: 'Mung dal vegetable soup seasoned with mild ginger', kn: 'ಶುಂಠಿ ಬೆರೆಸಿದ ಹೆಸರು ಬೇಳೆ ತರಕಾರಿ ಸೂಪ್', hi: 'मूंग दाल व सब्जियों का सूप' },
          { en: 'Boiled barley water with a squeeze of lemon', kn: 'ನಿಂಬೆರಸ ಬೆರೆಸಿದ ಜವೆಗೋಧಿ (ಬಾರ್ಲಿ) ನೀರು', hi: 'जौ का पानी नींबू के साथ' },
          { en: 'Organic soaked chia and basil seeds (Sabja)', kn: 'ದೇಹ ತಂಪಾಗಿಸಲು ನೆನೆಸಿದ ಸಬ್ಜಾ ಬೀಜಗಳು', hi: 'भीगे सब्जा बीज' }
        ],
        foodsToAvoid: [
          { en: 'Chemical artificial flavorings, MSG, and stale packaged foods', kn: 'ಕೃತಕ ಕೆಮಿಕಲ್ ಬೆರೆಸಿದ ಜಂಕ್ ಫುಡ್ ಮತ್ತು ತಂಗಳು ಆಹಾರ', hi: 'अजीनोमोटो, कृत्रिम स्वाद व जंक फूड' },
          { en: 'Heavy red meat, unpasteurized alcohol, and smoking', kn: 'ಮದ್ಯಪಾನ, ಧೂಮಪಾನ ಮತ್ತು ಭಾರೀ ಮಾಂಸಾಹಾರ', hi: 'मांसाहार, शराब एवं धूम्रपान' },
          { en: 'Erratic meal timings and midnight snacking', kn: 'ತಡರಾತ್ರಿಯ ಊಟ ಮತ್ತು ಅಸಮರ್ಪಕ ಆಹಾರ ಪದ್ಧತಿ', hi: 'देर रात भोजन की आदत' }
        ],
        herbalDecoctions: {
          en: 'Brahmi tea with Shankhapushpi; Triphala churna with warm water at bedtime.',
          kn: 'ಬ್ರಾಹ್ಮಿ ಮತ್ತು ಶಂಖಪುಷ್ಪಿ ಕಷಾಯ; ಮಲಗುವಾಗ ತ್ರಿಫಲಾ ಚೂರ್ಣ.',
          hi: 'ब्राह्मी चाय एवं रात में त्रिफला चूर्ण।'
        },
        optimalMealTimings: {
          en: 'Eat strictly in daylight hours; avoid eating during twilight transition.',
          kn: 'ಸೂರ್ಯನಿರುವಾಗಲೇ ಊಟ ಮುಗಿಸಿ; ಮುಸ್ಸಂಜೆಯ ವೇಳೆಯಲ್ಲಿ ಆಹಾರ ಸೇವಿಸಬೇಡಿ.',
          hi: 'सूर्यास्त से पूर्व भोजन कर लें।'
        }
      },
      lifestyleRegimen: {
        idealDailyRoutine: {
          en: 'Maintain spotless hygiene in bedroom and toilet; avoid sleeping with smartphone near the head.',
          kn: 'ಮಲಗುವ ಕೋಣೆ ಹಾಗೂ ಶೌಚಾಲಯವನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ; ಮೊಬೈಲ್ ಅನ್ನು ತಲೆಯ ಬಳಿ ಇಟ್ಟುಕೊಳ್ಳಬೇಡಿ.',
          hi: 'शयनकक्ष में स्वच्छता एवं मोबाइल को सिर से दूर रखें।'
        },
        exerciseAndMovement: {
          en: 'Aerobic exercises in open fresh air, swimming, deep diaphragm breathing.',
          kn: 'ಮುಕ್ತ ಶುದ್ಧ ಗಾಳಿಯಲ್ಲಿ ವ್ಯಾಯಾಮ, ಈಜು ಮತ್ತು ಪ್ರಾಣಾಯಾಮ.',
          hi: 'खुली हवा में व्यायाम एवं प्राणायाम।'
        },
        sunAndNatureTherapy: {
          en: 'Spending time under banyan trees; grounding barefoot on moist grass.',
          kn: 'ಆಲದ ಮರದ ನೆರಳಿನಲ್ಲಿ ವಿಶ್ರಾಂತಿ; ಹಸಿರು ಹುಲ್ಲಿನ ಮೇಲೆ ಬರಿಗಾಲಿನ ನಡಿಗೆ.',
          hi: 'वट वृक्ष की छाया में समय बिताना।'
        },
        colorTherapy: {
          en: 'Smoke gray, metallic steel, and soothing oceanic blues on Saturdays.',
          kn: 'ಬೂದು ಬಣ್ಣ, ಸ್ಟೀಲ್ ಬಣ್ಣ ಮತ್ತು ಸಾಗರದ ತಿಳಿ ನೀಲಿ ಬಣ್ಣದ ಉಡುಪು.',
          hi: 'धूम्र वर्ण, स्लेटी या आसमानी नीला रंग।'
        },
        mindfulRelaxation: {
          en: 'Daily 108 chants of Om Namah Shivaya; sound healing with Tibetan bowl or bells.',
          kn: 'ದಿನಕ್ಕೆ ೧೦೮ ಬಾರಿ ಓಂ ನಮಃ ಶಿವಾಯ ಜಪ; ಗಂಟಾನಾದ ಅಥವಾ ಶಂಖನಾದದ ಶ್ರವಣ.',
          hi: 'ॐ नमः शिवाय का नित्य जप।'
        }
      },
      astrologicalRemedies: {
        primaryMantra: {
          en: 'Om Bhram Bhreem Bhroum Sah Rahave Namaha • Sri Durga Saptashati • Maha Mrityunjaya',
          kn: 'ಓಂ ಭ್ರಾಂ ಭ್ರೀಂ ಭ್ರೌಂ ಸಃ ರಾಹವೇ ನಮಃ • ಶ್ರೀ ದುರ್ಗಾ ಕವಚಂ • ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ',
          hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः • श्री दुर्गा कवच'
        },
        beejaMantra: 'ॐ रां राहवे नमः',
        mantraCount: '108 times during twilight facing South-West (Nairutya)',
        gemstoneAdvice: {
          en: 'Hessonite Garnet (Gomedha) strictly after expert consultation; otherwise wear 8-Mukhi Rudraksha.',
          kn: 'ಪರಿಣಿತರ ಸಲಹೆ ಇಲ್ಲದೆ ಗೋಮೇಧಿಕ ಧರಿಸಬೇಡಿ; ೮-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಧಾರಣೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಮತ್ತು ಶ್ರೇಷ್ಠ.',
          hi: 'गोमेद केवल विशेषज्ञ सलाह पर; ८-मुखी रुद्राक्ष सुरक्षित उपाय।'
        },
        rudrakshaMukhi: {
          en: '8-Mukhi Rudraksha (Governed by Lord Ganesha; eliminates sudden obstacles, phantom fears, and stabilizes Rahu).',
          kn: '೮-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ಶ್ರೀ ಗಣೇಶನ ಸ್ವರೂಪ; ಅನಿರೀಕ್ಷಿತ ವಿಘ್ನ ನಿವಾರಣೆ ಹಾಗೂ ರಾಹು ಶಾಂತಿ).',
          hi: '८-मुखी रुद्राक्ष (विघ्न विनाशक एवं राहु शांति हेतु)।'
        },
        daanamCharity: {
          items: {
            en: 'Black mustard seeds, urad dal, coconut, blue/gray cloth, and seven grains (Sapta Dhanya).',
            kn: 'ಕಪ್ಪು ಸಾಸಿವೆ, ಉದ್ದಿನ ಬೇಳೆ, ತೆಂಗಿನಕಾಯಿ, ಸಪ್ತ ಧಾನ್ಯ, ಮತ್ತು ಬೂದು ಬಣ್ಣದ ವಸ್ತ್ರ.',
            hi: 'उड़द की दाल, काले तिल, नारियल एवं सप्त धान्य।'
          },
          dayAndTime: {
            en: 'Saturday twilight or Wednesday night.',
            kn: 'ಶನಿವಾರ ಮುಸ್ಸಂಜೆ ಅಥವಾ ಬುಧವಾರ ರಾತ್ರಿ.',
            hi: 'शनिवार सायंकाल।'
          },
          recipient: {
            en: 'To sweepers, leprosy patients, or flowing clean river waters (Jala Pravaha of coconut).',
            kn: 'ಕುಷ್ಠರೋಗಿಗಳಿಗೆ, ಪೌರಕಾರ್ಮಿಕರಿಗೆ ಅಥವಾ ಹರಿಯುವ ನದಿಯ ನೀರಿನಲ್ಲಿ ತೆಂಗಿನಕಾಯಿ ಸಮರ್ಪಣೆ.',
            hi: 'सफाई कर्मियों अथवा बहते जल में नारियल प्रवाहित करें।'
          }
        },
        deityVeneration: {
          en: 'Goddess Durga and Lord Bhairava.',
          kn: 'ಜಗನ್ಮಾತೆ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ ಮತ್ತು ಕಾಲಭೈರವ ಸ್ವಾಮಿ ಆರಾಧನೆ.',
          hi: 'मां दुर्गा एवं कालभैरव।'
        },
        sacredRitual: {
          en: 'Feeding stray dogs on Saturdays; lighting a mustard oil lamp before Goddess Durga on Ashtami.',
          kn: 'ಶನಿವಾರ ನಾಯಿಗಳಿಗೆ ಆಹಾರ ನೀಡುವುದು; ಅಷ್ಟಮಿ ತಿಥಿಯಂದು ದುರ್ಗಾ ದೇವಿಗೆ ಸಾಸಿವೆ ಎಣ್ಣೆ ದೀಪ ಪ್ರಜ್ವಲನೆ.',
          hi: 'काले कुत्तों को भोजन कराना एवं मां दुर्गा की पूजा।'
        }
      }
    };
  }

  // Ketu profile
  return {
    planet,
    balaBreakdown: bala,
    strengthCategory: strengthCat,
    strengthCategoryLocalized: strengthCatLoc,
    statusBadge,
    currentHouseSignificance: {
      en: `Ketu in House ${bhava} represents spiritual detachment (Moksha), subtle intuition, and cellular immunity.`,
      kn: `ಕೇತು ${bhava}ನೇ ಭಾವದಲ್ಲಿದ್ದು, ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ, ಅಂತಃಪ್ರಜ್ಞೆ ಮತ್ತು ರಹಸ್ಯ ಶಕ್ತಿಗಳನ್ನು ನೀಡುತ್ತಾನೆ.`,
      hi: `केतु भाव ${bhava} में वैराग्य, मोक्ष एवं सूक्ष्म अंतर्दृष्टि का नियमन करते हैं।`
    },
    nutritionalTherapy: {
      dietaryPhilosophy: {
        en: 'Light, sattvic, digestive-warming diet with grounding roots and therapeutic herbal teas.',
        kn: 'ಲಘು, ಸಾತ್ವಿಕ, ಸುಲಭವಾಗಿ ಜೀರ್ಣವಾಗುವ ಹಾಗೂ ರೋಗನಿರೋಧಕ ಗಿಡಮೂಲಿಕೆ ಆಹಾರ.',
        hi: 'सुपाच्य, हल्का एवं सात्त्विक आहार।'
      },
      superfoods: {
        en: 'Sesame, horse gram (Kulthi), dates, pure warm milk with saffron, and ginger infusion.',
        kn: 'ಹುರುಳಿ ಕಾಳು, ಎಳ್ಳು, ಉತ್ತತ್ತಿ, ಕೇಸರಿ ಬೆರೆಸಿದ ಹಾಲು, ಮತ್ತು ಶುಂಠಿ ನೀರು.',
        hi: 'कुल्थी की दाल, तिल, खजूर एवं सोंठ का जल।'
      },
      targetedNutrients: {
        en: 'Vitamin C, Bioflavonoids, Zinc, and digestive digestive enzymes.',
        kn: 'ವಿಟಮಿನ್ ಸಿ, ಜಿಂಕ್, ಬಯೋಫ್ಲೇವನಾಯ್ಡ್ಸ್, ಮತ್ತು ನೈಸರ್ಗಿಕ ಜೀರ್ಣ ರಸಗಳು.',
        hi: 'विटामिन सी, जिंक एवं पाचक एंजाइम।'
      },
      foodsToConsume: [
        { en: 'Horsegram (Kulthi) soup to dissolve bodily toxins and stones', kn: 'ದೇಹದ ಕಲ್ಮಶ ನಿವಾರಣೆಗೆ ಬಿಸಿ ಹುರುಳಿ ಕಾಳಿನ ಸೂಪ್ (ಕಟ್ಟು)', hi: 'कुल्थी की दाल का सूप' },
        { en: 'Warm stewed vegetable broth with a pinch of black pepper', kn: 'ಚಿಟಿಕೆ ಕರಿಮೆಣಸು ಬೆರೆಸಿದ ಬಿಸಿ ತರಕಾರಿ ಸೂಪ್', hi: 'काली मिर्च युक्त सब्जियों का सूप' },
        { en: 'Ginger and lemon tea after meals', kn: 'ಊಟದ ನಂತರ ಶುಂಠಿ-ನಿಂಬೆ ಚಹಾ', hi: 'अदरक-नींबू की चाय' },
        { en: 'Cooked spiced rice with cumin and pure ghee', kn: 'ಜೀರಿಗೆ ಮತ್ತು ತುಪ್ಪದ ಅನ್ನ', hi: 'जीरा राइस घी के साथ' }
      ],
      foodsToAvoid: [
        { en: 'Overly cold refrigerated salads causing intestinal spasms', kn: 'ತಣ್ಣನೆಯ ಹಸಿ ಸಲಾಡ್ ಮತ್ತು ಕೃತಕ ಶೀತಲ ಆಹಾರ', hi: 'अत्यधिक ठंडा व कच्चा भोजन' },
        { en: 'Stale fermented foods and processed cheeses', kn: 'ತಂಗಳಾದ ಹುಳಿ ಆಹಾರ', hi: 'बासी एवं सड़ा-गला भोजन' },
        { en: 'Excessive spicy chilies causing sudden abdominal colic', kn: 'ಅತಿಯಾದ ಖಾರ', hi: 'अत्यधिक मिर्च मसाले' }
      ],
      herbalDecoctions: {
        en: 'Triphala churna at bedtime; warm Ajwain (carom seed) water for digestion.',
        kn: 'ರಾತ್ರಿ ತ್ರಿಫಲಾ ಚೂರ್ಣ; ಜೀರ್ಣಕ್ರಿಯೆಗೆ ಓಮದ ಕಾಳಿನ (ಅಜ್ವೈನ್) ಬಿಸಿ ನೀರು.',
        hi: 'अजवाइन का पानी एवं रात में त्रिफला।'
      },
      optimalMealTimings: {
        en: 'Eat only when genuine hunger (Agni) manifests; avoid mindless grazing.',
        kn: 'ನೈಜ ಹಸಿವಾದಾಗ ಮಾತ್ರ ಊಟ ಮಾಡಿ; ಸುಮ್ಮನೆ ತಿನ್ನುವ ಅಭ್ಯಾಸ ಬೇಡ.',
        hi: 'भूख लगने पर ही भोजन करें।'
      }
    },
    lifestyleRegimen: {
      idealDailyRoutine: {
        en: 'Spend time in silent meditation, nature contemplation, and detachment from worldly gossips.',
        kn: 'ಏಕಾಂತ ಧ್ಯಾನ, ಪ್ರಕೃತಿಯ ವೀಕ್ಷಣೆ, ಮತ್ತು ಅನಾವಶ್ಯಕ ಹರಟೆಗಳಿಂದ ದೂರವಿರುವುದು.',
        hi: 'मौन, ध्यान एवं एकांत चिंतन।'
      },
      exerciseAndMovement: {
        en: 'Spinal yoga (Viparita Karani), deep meditation, and walking in temple grounds.',
        kn: 'ವಿಪರೀತ ಕರಣಿ ಆಸನ, ಪ್ರಾಣಾಯಾಮ, ಮತ್ತು ದೇವಾಲಯದ ಆವರಣದಲ್ಲಿ ನಡಿಗೆ.',
        hi: 'योगाभ्यास एवं ध्यान।'
      },
      sunAndNatureTherapy: {
        en: 'Forest bathing (Shinrin-yoku) and sitting beside natural streams.',
        kn: 'ಕಾಡಿನ ಹಸಿರಿನಲ್ಲಿ ಅಥವಾ ನದಿಯ ದಡದಲ್ಲಿ ಮೌನವಾಗಿ ಕುಳಿತುಕೊಳ್ಳುವುದು.',
        hi: 'नदी किनारे अथवा वन में शांत बैठना।'
      },
      colorTherapy: {
        en: 'Earth brown, multi-colored speckled shades, and saffron on Tuesdays/Thursdays.',
        kn: 'ಮಣ್ಣಿನ ಕಂದು ಬಣ್ಣ, ಬಣ್ಣಬಣ್ಣದ ವಿನ್ಯಾಸ ಹಾಗೂ ಕೇಸರಿ ಬಣ್ಣ.',
        hi: 'धूम्र अथवा भूरा रंग।'
      },
      mindfulRelaxation: {
        en: 'Vipassana breath awareness and chanting Om Namo Narayanaya.',
        kn: 'ವಿಪಶ್ಯನಾ ಉಸಿರಾಟದ ಧ್ಯಾನ ಮತ್ತು ಓಂ ನಮೋ ನಾರಾಯಣಾಯ ಜಪ.',
        hi: 'विपश्यना ध्यान एवं आत्म-चिंतन।'
      }
    },
    astrologicalRemedies: {
      primaryMantra: {
        en: 'Om Sram Sreem Sroum Sah Ketave Namaha • Ganesha Dwadasanama Stotram',
        kn: 'ಓಂ ಸ್ರಾಂ ಸ್ರೀಂ ಸ್ರೌಂ ಸಃ ಕೇತವೇ ನಮಃ • ಗಣೇಶ ಸಂಕಟನಾಶನ ಸ್ತೋತ್ರ',
        hi: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः • संकट नाशन गणेश स्तोत्र'
      },
      beejaMantra: 'ॐ कें केतवे नमः',
      mantraCount: '108 times at night facing North-West',
      gemstoneAdvice: {
        en: 'Cat’s Eye (Chrysoberyl Vaidhoorya) strictly with astrological testing; 9-Mukhi Rudraksha is universally safe.',
        kn: 'ಪರೀಕ್ಷೆ ಇಲ್ಲದೆ ವೈಢೂರ್ಯ ರತ್ನ ಧರಿಸಬೇಡಿ; ೯-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ ಧಾರಣೆ ಅತ್ಯಂತ ಕ್ಷೇಮಕರ.',
        hi: 'लहसुनिया केवल परीक्षण उपरांत; ९-मुखी रुद्राक्ष सुरक्षित।'
      },
      rudrakshaMukhi: {
        en: '9-Mukhi Rudraksha (Governed by Goddess Durga & Ketu; gives fearlessness, spiritual wisdom, and immune mastery).',
        kn: '೯-ಮುಖಿ ರುದ್ರಾಕ್ಷಿ (ನವದುರ್ಗೆ & ಕೇತುವಿನ ಸ್ವರೂಪ; ಭಯ ನಿವಾರಣೆ, ರೋಗನಿರೋಧಕ ರಕ್ಷಣೆ ಹಾಗೂ ಮೋಕ್ಷ ಮಾರ್ಗ).',
        hi: '९-मुखी रुद्राक्ष (निर्भयता एवं आत्मशक्ति हेतु)।'
      },
      daanamCharity: {
        items: {
            en: 'Horsegram, multi-colored blanket, sesame, sweet bread, and umbrellas to sadhus.',
            kn: 'ಹುರುಳಿ ಕಾಳು, ಬಣ್ಣಬಣ್ಣದ ಕಂಬಳಿ, ಕಪ್ಪು-ಬಿಳಿ ಎಳ್ಳು, ಮತ್ತು ಸಾಧು-ಸಂತರ ಸೇವೆ.',
            hi: 'कुल्थी, चितकबरे कंबल, तिल एवं साधु सेवा।'
        },
        dayAndTime: {
          en: 'Tuesday or Thursday twilight.',
          kn: 'ಮಂಗಳವಾರ ಅಥವಾ ಗುರುವಾರ ಸಂಜೆ.',
          hi: 'मंगलवार अथवा गुरुवार संध्या।'
        },
        recipient: {
          en: 'To wandering monks (Sadhus), temple servants, or street animals (dogs/birds).',
          kn: 'ಸನ್ಯಾಸಿಗಳಿಗೆ, ಸಾಧು-ಸಂತರಿಗೆ, ಅಥವಾ ಪಕ್ಷಿಗಳಿಗೆ ಧಾನ್ಯ ನೀಡುವುದು.',
          hi: 'साधु-संतों अथवा पक्षियों को दाना।'
        }
      },
      deityVeneration: {
        en: 'Lord Ganesha (Vighnaharta) and Lord Matsya Avatara.',
        kn: 'ಶ್ರೀ ಗಣಪತಿ ಮತ್ತು ಮತ್ಸ್ಯಾವತಾರ ಶ್ರೀ ಮಹಾವಿಷ್ಣು ಆರಾಧನೆ.',
        hi: 'भगवान श्री गणेश एवं मत्स्य अवतार।'
      },
      sacredRitual: {
        en: 'Offering Durva grass (Garike) and modaka to Lord Ganesha on Sankashti Chaturthi.',
        kn: 'ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿಯಂದು ಗಣಪತಿಗೆ ಗರಿಕೆಯ ಮಾಲೆ ಮತ್ತು ಮೋದಕ ಸಮರ್ಪಣೆ.',
        hi: 'श्री गणेश जी को दूर्वा एवं मोदक अर्पण।'
      }
    }
  };
}

export function calculateAllGrahasRemedyNutrition(
  kundaliData: KundaliData,
  planetaryBalas: PlanetaryBalaBreakdown[]
): GrahaRemedyNutritionProfile[] {
  const balaMap = new Map(planetaryBalas.map(b => [b.planet.name, b]));
  return kundaliData.planets.map(planet => {
    const bala = balaMap.get(planet.name);
    return calculateGrahaRemedyNutrition(planet, kundaliData, bala);
  });
}
