import { Language, LocalizedString, PlanetPosition } from '../types';

export interface SignificantTransit {
  planetName: string;
  sanskritName: LocalizedString;
  symbol: string;
  currentRashiIndex: number; // 0 to 11
  currentRashiName: LocalizedString;
  currentDegree: number;
  houseFromLagna: number; // 1 to 12
  houseFromMoon: number; // 1 to 12
  isNewIngress: boolean;
  ingressDateText: string;
  isBeneficTransit: boolean;
  headline: LocalizedString;
  lagnaImpact: {
    en: string;
    kn: string;
    hi: string;
  };
  remedy: {
    en: string;
    kn: string;
    hi: string;
  };
}

export function detectSignificantTransits(
  planets: PlanetPosition[],
  lagnaRashiIndex: number,
  moonRashiIndex: number
): SignificantTransit[] {
  const transits: SignificantTransit[] = [];

  // 1. Jupiter (Guru) Transit
  const jupiter = planets.find(p => p.name === 'Jupiter');
  if (jupiter) {
    const houseFromLagna = ((jupiter.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    const houseFromMoon = ((jupiter.rashiIndex - moonRashiIndex + 12) % 12) + 1;
    const isBenefic = [1, 2, 5, 7, 9, 11].includes(houseFromLagna);

    const headlines: Record<number, LocalizedString> = {
      1: {
        en: 'Jupiter in 1st House (Lagna) • Expansion of Self & Wisdom',
        kn: 'ಗುರು ಲಗ್ನದಲ್ಲಿ (೧ನೇ ಭಾವ) • ಆತ್ಮವಿಶ್ವಾಸ, ಕೀರ್ತಿ ಹಾಗೂ ದೈವ ರಕ್ಷಣೆ',
        hi: 'बृहस्पति लग्न (१म भाव) में • आत्मगौरव, ज्ञान एवं दैवीय सुरक्षा'
      },
      2: {
        en: 'Jupiter in 2nd House • Dhana & Family Prosperity',
        kn: 'ಗುರು ೨ನೇ ಭಾವದಲ್ಲಿ • ಧನ ಸಮೃದ್ಧಿ, ಕುಟುಂಬ ಸೌಹಾರ್ದ ಹಾಗೂ ವಾಕ್ಸಿದ್ಧಿ',
        hi: 'बृहस्पति २सरे भाव में • धन वृद्धि, पारिवारिक सौहार्द एवं मधुर वाणी'
      },
      3: {
        en: 'Jupiter in 3rd House • Valor & Creative Enterprise',
        kn: 'ಗುರು ೩ನೇ ಭಾವದಲ್ಲಿ • ಸಾಹಸ, ಸೋದರ ಸಹಕಾರ ಹಾಗೂ ಸಂವಹನ ಬೆಳವಣಿಗೆ',
        hi: 'बृहस्पति ३रे भाव में • पराक्रम, भ्रातृ सहयोग एवं नवीन उद्यम'
      },
      4: {
        en: 'Jupiter in 4th House • Home Comfort & Maternal Grace',
        kn: 'ಗುರು ೪ನೇ ಭಾವದಲ್ಲಿ • ಗೃಹ ಸೌಖ್ಯ, ಮಾತೃವಾತ್ಸಲ್ಯ ಹಾಗೂ ವಾಹನ ಲಾಭ',
        hi: 'बृहस्पति ४थे भाव में • गृह सुख, मातृकृपा एवं वाहन योग'
      },
      5: {
        en: 'Jupiter in 5th House (Trikona) • Divine Grace, Intellect & Progeny',
        kn: 'ಗುರು ೫ನೇ ಭಾವದಲ್ಲಿ (ತ್ರಿಕೋಣ) • ಸಂತಾನ ಸೌಖ್ಯ, ಪೂರ್ವಪುಣ್ಯ ಪ್ರಾಪ್ತಿ & ವಿದ್ಯಾಭಿವೃದ್ಧಿ',
        hi: 'बृहस्पति ५वें भाव (त्रिकोण) में • संतान सुख, पूर्वपुण्य फल एवं उच्च विद्या'
      },
      6: {
        en: 'Jupiter in 6th House • Overcoming Adversaries & Service',
        kn: 'ಗುರು ೬ನೇ ಭಾವದಲ್ಲಿ • ರೋಗ-ಶತ್ರು ಉಪಶಮನ, ನಿಷ್ಠಾವಂತ ಸೇವಾ ಯೋಗ',
        hi: 'बृहस्पति ६ठे भाव में • रोग-ऋण मुक्ति एवं कर्मनिष्ठा'
      },
      7: {
        en: 'Jupiter in 7th House (Kendra) • Auspicious Partnerships & Marriage',
        kn: 'ಗುರು ೭ನೇ ಭಾವದಲ್ಲಿ (ಕೇಂದ್ರ) • ಕಳತ್ರ ಸೌಖ್ಯ, ವಿವಾಹ ಯೋಗ ಹಾಗೂ ವಾಣಿಜ್ಯ ಪಾಲುದಾರಿಕೆ',
        hi: 'बृहस्पति ७वें भाव (केन्द्र) में • वैवाहिक सुख, शुभ विवाह एवं व्यापारिक लाभ'
      },
      8: {
        en: 'Jupiter in 8th House • Occult Knowledge & Transformative Depth',
        kn: 'ಗುರು ೮ನೇ ಭಾವದಲ್ಲಿ • ಆಯುಷ್ಯ ವೃದ್ಧಿ, ಗೂಢ ಜ್ಞಾನಾರ್ಜನೆ ಹಾಗೂ ಆಂತರಿಕ ಪರಿವರ್ತನೆ',
        hi: 'बृहस्पति ८वें भाव में • गूढ़ विद्या, दीर्घायु एवं आध्यात्मिक रूपांतरण'
      },
      9: {
        en: 'Jupiter in 9th House (Supreme Bhagya) • Great Fortune & Dharma',
        kn: 'ಗುರು ೯ನೇ ಭಾವದಲ್ಲಿ (ಪರಮ ಭಾಗ್ಯ ಸ್ಥಾನ) • ಭಾಗ್ಯೋದಯ, ತೀರ್ಥಯಾತ್ರೆ ಹಾಗೂ ಗುರು ಕೃಪೆ',
        hi: 'बृहस्पति ९वें भाव (परम भाग्य) में • भाग्योदय, तीर्थाटन एवं गुरु कृपा'
      },
      10: {
        en: 'Jupiter in 10th House • Professional Honor & Karmic Success',
        kn: 'ಗುರು ೧೦ನೇ ಭಾವದಲ್ಲಿ • ವೃತ್ತಿಪರ ಉನ್ನತಿ, ಸಾಮಾಜಿಕ ಕೀರ್ತಿ ಹಾಗೂ ಧರ್ಮ ಕಾರ್ಯ',
        hi: 'बृहस्पति १०वें भाव में • पद-प्रतिष्ठा, कार्यक्षेत्र में यश एवं प्रशासनिक सम्मान'
      },
      11: {
        en: 'Jupiter in 11th House • Fulfillments of Desires & Supreme Gains',
        kn: 'ಗುರು ೧೧ನೇ ಭಾವದಲ್ಲಿ (ಲಾಭ ಸ್ಥಾನ) • ಅಪಾರ ಆರ್ಥಿಕ ಲಾಭ, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ & ಮಿತ್ರ ಬಲ',
        hi: 'बृहस्पति ११वें भाव (लाभ) में • विपुल धन लाभ, अभीष्ट सिद्धि एवं वरिष्ठों का सहयोग'
      },
      12: {
        en: 'Jupiter in 12th House • Spiritual Philanthropy & Moksha',
        kn: 'ಗುರು ೧೨ನೇ ಭಾವದಲ್ಲಿ • ಆಧ್ಯಾತ್ಮಿಕ ಚಿಂತನೆ, ದಾನ-ಧರ್ಮ ಹಾಗೂ ಶುಭ ವ್ಯಯ',
        hi: 'बृहस्पति १२वें भाव में • दान-पुण्य, आध्यात्मिक यात्रा एवं मोक्ष चेतना'
      }
    };

    transits.push({
      planetName: 'Jupiter',
      sanskritName: { en: 'Devaguru Brihaspati', kn: 'ದೇವಗುರು ಬೃಹಸ್ಪತಿ', hi: 'देवगुरु बृहस्पति' },
      symbol: '♃ Guru',
      currentRashiIndex: jupiter.rashiIndex,
      currentRashiName: jupiter.rashiName,
      currentDegree: jupiter.degrees,
      houseFromLagna,
      houseFromMoon,
      isNewIngress: jupiter.degrees < 5,
      ingressDateText: 'Transits sign for ~12 months',
      isBeneficTransit: isBenefic,
      headline: headlines[houseFromLagna] || headlines[1],
      lagnaImpact: {
        en: `Jupiter activates your ${houseFromLagna}th house from Lagna in ${jupiter.rashiName.en}. This casts holy 5th, 7th, and 9th drishti (aspects), conferring spiritual elevation, protection against obstacles, and righteous growth.`,
        kn: `ದೇವಗುರು ನಿಮ್ಮ ಲಗ್ನದಿಂದ ${houseFromLagna}ನೇ ಭಾವವಾದ ${jupiter.rashiName.kn} ರಾಶಿಯಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿದ್ದಾನೆ. ತನ್ನ ಅಮೃತ ದೃಷ್ಟಿಯಿಂದ ೫, ೭ ಮತ್ತು ೯ನೇ ಭಾವಗಳನ್ನು ಪವಿತ್ರಗೊಳಿಸಿ, ಸಂಕಷ್ಟಗಳನ್ನು ಪರಿಹರಿಸಿ ಶುಭ ಫಲ ನೀಡುತ್ತಾನೆ.`,
        hi: `देवगुरु आपके लग्न से ${houseFromLagna}वें भाव ${jupiter.rashiName.hi} में गोचर कर रहे हैं। अपनी अमृत ५वीं, ७वीं व ९वीं दृष्टि से शुभता, बाधा निवारण और ज्ञान की वृद्धि कर रहे हैं।`
      },
      remedy: {
        en: 'Chant "Om Brim Brihaspataye Namah" on Thursdays, honor spiritual teachers, and offer yellow sweets.',
        kn: 'ಗುರುವಾರ "ಓಂ ಬೃಂ ಬೃಹಸ್ಪತಯೇ ನಮಃ" ಮಂತ್ರ ಜಪಿಸಿ, ಗುರು-ಹಿರಿಯರನ್ನು ಗೌರವಿಸಿ ಕಡಲೆಕಾಳು ದಾನ ಮಾಡಿ.',
        hi: 'गुरुवार को "ॐ बृं बृहस्पतये नमः" का जप करें, गुरुजनों का सम्मान एवं चने की दाल दान करें।'
      }
    });
  }

  // 2. Saturn (Shani) Transit
  const saturn = planets.find(p => p.name === 'Saturn');
  if (saturn) {
    const houseFromLagna = ((saturn.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    const houseFromMoon = ((saturn.rashiIndex - moonRashiIndex + 12) % 12) + 1;
    const isUpachaya = [3, 6, 11].includes(houseFromLagna);
    const isSadesati = [12, 1, 2].includes(houseFromMoon);

    const headlines: Record<number, LocalizedString> = {
      1: {
        en: 'Saturn in 1st House (Lagna) • Deep Character Rebuilding & Discipline',
        kn: 'ಶನಿ ಲಗ್ನದಲ್ಲಿ (೧ನೇ ಭಾವ) • ಶಿಸ್ತು, ಕರ್ತವ್ಯ ಪ್ರಜ್ಞೆ ಹಾಗೂ ತಾಳ್ಮೆಯ ಪರೀಕ್ಷೆ',
        hi: 'शनि लग्न में • अनुशासन, कर्मनिष्ठा एवं धैर्य की परीक्षा'
      },
      3: {
        en: 'Saturn in 3rd House (Upachaya) • Heroic Resolution & Victory',
        kn: 'ಶನಿ ೩ನೇ ಭಾವದಲ್ಲಿ (ಉಪಚಯ) • ಅದ್ಭುತ ಧೈರ್ಯ, ಶತ್ರುಜಯ ಹಾಗೂ ಸಾಹಸ ಸಿದ್ಧಿ',
        hi: 'शनि ३रे भाव में • अद्वितीय साहस, शत्रु दमन एवं पराक्रम'
      },
      6: {
        en: 'Saturn in 6th House (Upachaya) • Shatru Nasha & Invincible Endurance',
        kn: 'ಶನಿ ೬ನೇ ಭಾವದಲ್ಲಿ (ಉಪಚಯ) • ಶತ್ರು-ರೋಗ ನಿರ್ಮೂಲನೆ ಹಾಗೂ ಅಪ್ರತಿಮ ಸಹನೆ',
        hi: 'शनि ६ठे भाव में • शत्रु विजय, स्वास्थ्य सुधार एवं कठिन परिश्रम का फल'
      },
      7: {
        en: 'Saturn in 7th House (Digbala Angle) • Mature Partnerships & Diligence',
        kn: 'ಶನಿ ೭ನೇ ಭಾವದಲ್ಲಿ (ದಿಗ್ಬಲ ಕೇಂದ್ರ) • ಜವಾಬ್ದಾರಿಯುತ ಪಾಲುದಾರಿಕೆ & ಗಂಭೀರತೆ',
        hi: 'शनि ७वें भाव में • परिपक्व सम्बंध एवं कार्यक्षेत्र में स्थायित्व'
      },
      10: {
        en: 'Saturn in 10th House (Karmasthana) • Professional Grounding & Duty',
        kn: 'ಶನಿ ೧೦ನೇ ಭಾವದಲ್ಲಿ (ಕರ್ಮಸ್ಥಾನ) • ಕಠಿಣ ಶ್ರಮಕ್ಕೆ ಮಹೋನ್ನತ ಗೌರವ & ಜವಾಬ್ದಾರಿ',
        hi: 'शनि १०वें भाव में • आजीविका में दृढ़ता, उच्च उत्तरदायित्व एवं न्याय'
      },
      11: {
        en: 'Saturn in 11th House (Upachaya) • Enduring Financial Gains & Fruition',
        kn: 'ಶನಿ ೧೧ನೇ ಭಾವದಲ್ಲಿ (ಲಾಭ ಸ್ಥಾನ) • ಅಪಾರ ಸ್ಥಿರ ಸಂಪತ್ತು, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ & ವಿಜಯ',
        hi: 'शनि ११वें भाव में • स्थायी धन लाभ, महत्वाकांक्षा पूर्ति एवं दीर्घकालिक सिद्धि'
      }
    };

    const fallbackHeadline: LocalizedString = {
      en: `Saturn Transits House ${houseFromLagna} • Karmic Focus`,
      kn: `ಶನಿ ${houseFromLagna}ನೇ ಭಾವದಲ್ಲಿ ಗೋಚಾರ • ಕರ್ಮ ತಿದ್ದುವ ಕಾಲ`,
      hi: `शनि ${houseFromLagna}वें भाव में गोचर • कर्म शुद्धि काल`
    };

    transits.push({
      planetName: 'Saturn',
      sanskritName: { en: 'Karmaphala Shani', kn: 'ಕರ್ಮಫಲದಾತ ಶನೀಶ್ವರ', hi: 'कर्मफलदाता शनि' },
      symbol: '♄ Shani',
      currentRashiIndex: saturn.rashiIndex,
      currentRashiName: saturn.rashiName,
      currentDegree: saturn.degrees,
      houseFromLagna,
      houseFromMoon,
      isNewIngress: saturn.degrees < 4,
      ingressDateText: 'Transits sign for ~2.5 years',
      isBeneficTransit: isUpachaya,
      headline: headlines[houseFromLagna] || fallbackHeadline,
      lagnaImpact: {
        en: `Saturn activates your ${houseFromLagna}th house from Lagna in ${saturn.rashiName.en} ${isSadesati ? 'with active Sade Sati / Janma Shani influence' : ''}. Demands methodical perseverance, integrity, and humility. Upachaya houses (3, 6, 11) yield lasting triumphs.`,
        kn: `ಶನೀಶ್ವರನು ನಿಮ್ಮ ಲಗ್ನದಿಂದ ${houseFromLagna}ನೇ ಭಾವವಾದ ${saturn.rashiName.kn} ರಾಶಿಯಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿದ್ದಾನೆ ${isSadesati ? '(ಸಾಡೇಸಾತಿ ಪ್ರಭಾವವಿದೆ)' : ''}. ಕಠಿಣ ಪರಿಶ್ರಮ, ಪ್ರಾಮಾಣಿಕತೆ ಹಾಗೂ ಹಿರಿಯರ ಸೇವೆಯಿಂದ ಶನಿ ದೇವನು ಪರಮ ಶುಭ ಫಲ ಹಾಗೂ ದೀರ್ಘಾಯುಷ್ಯ ನೀಡುತ್ತಾನೆ.`,
        hi: `शनिदेव आपके लग्न से ${houseFromLagna}वें भाव ${saturn.rashiName.hi} में गोचर कर रहे हैं ${isSadesati ? '(साढ़ेसाती प्रभाव सहित)' : ''}। निष्ठा, सत्य एवं धैर्य से जीवन में दीर्घकालिक स्थिरता और सिद्धि प्राप्त होगी।`
      },
      remedy: {
        en: 'Light a sesame oil lamp on Saturdays, recite Dasharatha Shani Stotra, and feed underprivileged workers.',
        kn: 'ಶನಿವಾರ ಎಳ್ಳೆಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ, ದಶರಥ ಕೃತ ಶನಿ ಸ್ತೋತ್ರ ಪಠಿಸಿ ಹಾಗೂ ಶ್ರಮಿಕರಿಗೆ ಕಪ್ಪು ಎಳ್ಳು/ಆಹಾರ ನೀಡಿ.',
        hi: 'शनिवार को तिल के तेल का दीपक, दशरथ शनि स्तोत्र पाठ एवं निर्धनों को भोजन कराएं।'
      }
    });
  }

  // 3. Rahu & Ketu Ingress
  const rahu = planets.find(p => p.name === 'Rahu');
  if (rahu) {
    const houseFromLagna = ((rahu.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    const isBenefic = [3, 6, 10, 11].includes(houseFromLagna);

    transits.push({
      planetName: 'Rahu',
      sanskritName: { en: 'Chhaya Graha Rahu', kn: 'ಛಾಯಾಗ್ರಹ ರಾಹು', hi: 'छायाग्रह राहु' },
      symbol: '☊ Rahu',
      currentRashiIndex: rahu.rashiIndex,
      currentRashiName: rahu.rashiName,
      currentDegree: rahu.degrees,
      houseFromLagna,
      houseFromMoon: ((rahu.rashiIndex - moonRashiIndex + 12) % 12) + 1,
      isNewIngress: rahu.degrees > 27,
      ingressDateText: 'Retrograde transit for ~18 months',
      isBeneficTransit: isBenefic,
      headline: {
        en: `Rahu in House ${houseFromLagna} • Ambition & Unconventional Shifts`,
        kn: `ರಾಹು ${houseFromLagna}ನೇ ಭಾವದಲ್ಲಿ • ಮಹತ್ವಾಕಾಂಕ್ಷೆ & ತಂತ್ರಜ್ಞಾನ ಪ್ರಭಾವ`,
        hi: `राहु ${houseFromLagna}वें भाव में • तीव्र अभिलाषा एवं नवीन दिशा`
      },
      lagnaImpact: {
        en: `Rahu moves through your ${houseFromLagna}th house in ${rahu.rashiName.en}. Stimulates rapid innovation, worldly cravings, and sudden breakthroughs. Durga worship channels erratic energy into focused mastery.`,
        kn: `ರಾಹುವು ನಿಮ್ಮ ಲಗ್ನದಿಂದ ${houseFromLagna}ನೇ ಭಾವದಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿದ್ದಾನೆ. ನವೀನ ಆಲೋಚನೆ, ತಾಂತ್ರಿಕ ಪ್ರಗತಿ ಹಾಗೂ ಹೊಸ ಅವಕಾಶಗಳನ್ನು ತರುತ್ತಾನೆ. ದುರ್ಗಾ ಆರಾಧನೆಯಿಂದ ಮಾನಸಿಕ ಶಾಂತಿ ಲಭಿಸುತ್ತದೆ.`,
        hi: `राहु आपके लग्न से ${houseFromLagna}वें भाव में भ्रमण कर रहे हैं। यह नवाचार और तीव्र गति प्रदान करता है। दुर्गा आराधना से मानसिक संतुलन बना रहता है।`
      },
      remedy: {
        en: 'Recite Durga Kavacham or Rahu Stotra, keep clean surroundings, and avoid speculative risks.',
        kn: 'ದುರ್ಗಾ ಕವಚ ಪಠಣ, ರಾಹು ಕಾಲದಲ್ಲಿ ಪ್ರಾರ್ಥನೆ ಹಾಗೂ ಆವೇಶದ ತಪ್ಪು ನಿರ್ಧಾರಗಳಿಂದ ದೂರವಿರಿ.',
        hi: 'दुर्गा कवच पाठ, व्यसनों से मुक्ति एवं सोच-समझकर निर्णय लें।'
      }
    });
  }

  return transits;
}
