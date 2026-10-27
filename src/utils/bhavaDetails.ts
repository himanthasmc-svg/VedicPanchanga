import { LocalizedString } from '../types';

export interface BhavaInfo {
  bhava: number;
  name: LocalizedString;
  sanskritName: string;
  category: LocalizedString; // Kendra, Trikona, Upachaya, Dusthana
  karakas: LocalizedString; // Karaka Grahas
  purposeToInspect: LocalizedString; // ಏನು ನೋಡಬೇಕು (What purpose to see)
  keySignifications: LocalizedString;
  bodyParts: LocalizedString;
  idealGrahas: LocalizedString;
  challengingGrahas: LocalizedString;
}

export const WHAT_IS_BHAVA_GUIDE: {
  title: LocalizedString;
  meaning: LocalizedString;
  origin: LocalizedString;
  differenceRashiBhava: LocalizedString;
  fourPurusharthas: {
    dharma: LocalizedString;
    artha: LocalizedString;
    kama: LocalizedString;
    moksha: LocalizedString;
  };
} = {
  title: {
    en: 'What is a Bhava in Vedic Astrology?',
    kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಭಾವ ಎಂದರೇನು?',
    hi: 'वैदिक ज्योतिष में भाव क्या है?'
  },
  meaning: {
    en: 'The Sanskrit word "Bhava" originates from the root "Bhoo" (भवति इति भावः - that which comes into existence or manifests). While the 12 Rashis (Zodiac signs) represent the cosmic cosmic energy divisions in space, the 12 Bhavas (houses) represent the tangible fields of earthly human life where individual karma manifests.',
    kn: 'ಸಂಸ್ಕೃತದಲ್ಲಿ "ಭಾವ" ಪದವು "ಭೂ" (ಭವತಿ ಇತಿ ಭಾವಃ - ಯಾವುದು ಅಸ್ತಿತ್ವಕ್ಕೆ ಬರುತ್ತದೆಯೋ ಅದು ಭಾವ) ಎಂಬ ಧಾತುವಿನಿಂದ ನಿಷ್ಪನ್ನವಾಗಿದೆ. ಆಕಾಶದ ೧೨ ರಾಶಿಗಳು ವಿಶ್ವ ಬ್ರಹ್ಮಾಂಡದ ಶಕ್ತಿಗಳನ್ನು ಪ್ರತಿನಿಧಿಸಿದರೆ, ಕುಂಡಲಿಯ ೧೨ ಭಾವಗಳು ಮಾನವನ ಪ್ರಾಪಂಚಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜೀವನದ ಕರ್ಮಗಳು ಹಣ್ಣಾಗುವ ನೈಜ ಅನುಭವ ಕ್ಷೇತ್ರಗಳಾಗಿವೆ.',
    hi: 'संस्कृत में "भाव" शब्द की उत्पत्ति "भू" धातु से हुई है (भवति इति भावः - जो सत्ता में आता है)। १२ राशियाँ ब्रह्माण्डीय ऊर्जा का प्रतीक हैं, जबकि १२ भाव मानव जीवन के उन प्रत्यक्ष क्षेत्रों का प्रतिनिधित्व करते हैं जहाँ व्यक्ति के प्रारब्ध कर्म फलित होते हैं।'
  },
  origin: {
    en: 'The exact degree of the eastern horizon at the precise time of birth becomes the Ascendant (Lagna) or the 1st Bhava. From this starting point, the entire 360° celestial sphere is mapped into 12 distinct Bhavas, governing everything from birth, wealth, siblings, mother, intellect, enemies, marriage, longevity, destiny, profession, gains, to ultimate liberation (Moksha).',
    kn: 'ಜನನ ಕಾಲದಲ್ಲಿ ಪೂರ್ವ ದಿಗಂತದಲ್ಲಿ ಉದಯಿಸುವ ನಿಖರ ರಾಶಿ ಅಂಶವೇ "ಲಗ್ನ" ಅಥವಾ ೧ನೇ ಭಾವ. ಈ ಬಿಂದುವಿನಿಂದ ಸಂಪೂರ್ಣ ೩೬೦° ಆಕಾಶವನ್ನು ೧೨ ವಿಶಿಷ್ಟ ಭಾವಗಳಾಗಿ ವಿಭಾಗಿಸಲಾಗುತ್ತದೆ. ಇದು ವ್ಯಕ್ತಿಯ ಜನನ, ಸಂಪತ್ತು, ಸಹೋದರರು, ತಾಯಿ, ಬುದ್ಧಿ, ಶತ್ರು-ರೋಗ, ದಾಂಪತ್ಯ, ಆಯುಷ್ಯ, ಭಾಗ್ಯ, ಉದ್ಯೋಗ, ಲಾಭ ಮತ್ತು ಮೋಕ್ಷದ ಸಮಗ್ರ ಜೀವನ ಯಾತ್ರೆಯನ್ನು ಒಳಗೊಳ್ಳುತ್ತದೆ.',
    hi: 'जन्म के समय पूर्वी क्षितिज पर उदित राशि अंश को "लग्न" अथवा प्रथम भाव कहते हैं। यहाँ से सम्पूर्ण ३६೦° खगोल को १२ भावों में विभाजित किया जाता है, जो स्वास्थ्य, धन, पराक्रम, सुख, सन्तान, रोग, विवाह, आयु, भाग्य, कर्म, लाभ एवं मोक्ष का नियमन करते हैं।'
  },
  differenceRashiBhava: {
    en: 'Rashi is the "Resource" and environment (Who/How), whereas Bhava is the "Arena" and life stage (Where/What). For instance, Mars in Aries shows energetic assertiveness (Rashi), but Mars in the 10th Bhava focuses that energy into executive career leadership (Bhava).',
    kn: 'ರಾಶಿಯು ಗ್ರಹಕ್ಕೆ ಲಭಿಸುವ "ಪರಿಸರ ಮತ್ತು ಶಕ್ತಿ"ಯಾದರೆ, ಭಾವವು ಆ ಶಕ್ತಿ ಕೆಲಸ ಮಾಡುವ "ಜೀವನದ ರಂಗಸ್ಥಳ". ಉದಾಹರಣೆಗೆ, ಕುಜನು ಮೇಷದಲ್ಲಿದ್ದರೆ (ರಾಶಿ) ಸಾಹಸ ಮನೋಭಾವ ಇರುತ್ತದೆ, ಆದರೆ ಅದೇ ಕುಜನು ೧೦ನೇ ಭಾವದಲ್ಲಿದ್ದರೆ ಆ ಸಾಹಸವು ಅಧಿಕಾರ ಮತ್ತು ಉನ್ನತ ಉದ್ಯೋಗವಾಗಿ (ಭಾವ) ಪರಿವರ್ತನೆಯಾಗುತ್ತದೆ.',
    hi: 'राशि "संसाधन व स्वभाव" है, जबकि भाव वह "जीवन क्षेत्र" है जहाँ वह शक्ति कार्य करती है। उदाहरणार्थ, मेष राशि का मंगल साहसी है, किन्तु १०वें भाव में यही मंगल आजीविका में उच्च प्रशासनिक पद प्रदान करता है।'
  },
  fourPurusharthas: {
    dharma: {
      en: 'Dharma Trikona (Houses 1, 5, 9): Righteousness, character, spiritual wisdom, and divine purpose.',
      kn: 'ಧರ್ಮ ತ್ರಿಕೋಣ (ಭಾವ ೧, ೫, ೯): ಸತ್ಚಾರಿತ್ರ್ಯ, ಬುದ್ಧಿಮತ್ತೆ, ಪೂರ್ವ ಪುಣ್ಯ ಮತ್ತು ಧಾರ್ಮಿಕ ಭಾಗ್ಯ.',
      hi: 'धर्म त्रिकोण (भाव १, ५, ९): सत्य, धर्म, पूर्व पुण्य एवं आत्मोन्नति।'
    },
    artha: {
      en: 'Artha Trikona (Houses 2, 6, 10): Material wealth, daily efforts, finance, and professional career.',
      kn: 'ಅರ್ಥ ತ್ರಿಕೋಣ (ಭಾವ ೨, ೬, ೧೦): ಧನ ಸಂಪಾದನೆ, ಪರಿಶ್ರಮ, ವೃತ್ತಿ ಕರ್ಮ ಮತ್ತು ಆರ್ಥಿಕ ಭದ್ರತೆ.',
      hi: 'अर्थ त्रिकोण (भाव २, ६, १०): धन संचय, सेवा कर्म, उद्योग एवं आजीविका।'
    },
    kama: {
      en: 'Kama Trikona (Houses 3, 7, 11): Desires, courage, marital bonding, partnerships, and fulfillment of ambitions.',
      kn: 'ಕಾಮ ತ್ರಿಕೋಣ (ಭಾವ ೩, ೭, ೧೧): ಧೈರ್ಯ, ಪ್ರೇಮ, ದಾಂಪತ್ಯ ಸೌಖ್ಯ, ವ್ಯಾಪಾರ ಒಡಂಬಡಿಕೆ ಮತ್ತು ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ.',
      hi: 'काम त्रिकोण (भाव ३, ७, ११): पराक्रम, वैवाहिक सुख, मैत्री एवं मनोकामना पूर्ति।'
    },
    moksha: {
      en: 'Moksha Trikona (Houses 4, 8, 12): Internal peace, psychological transformation, deep secrets, and spiritual liberation.',
      kn: 'ಮೋಕ್ಷ ತ್ರಿಕೋಣ (ಭಾವ ೪, ೮, ೧೨): ಆಂತರಿಕ ಮನಃಶಾಂತಿ, ಆಯುರ್ವೇದ ರಹಸ್ಯ, ಕರ್ಮ ಕಳಚುವಿಕೆ ಮತ್ತು ಮುಕ್ತಿ.',
      hi: 'मोक्ष त्रिकोण (भाव ४, ८, १२): मानसिक शान्ति, गूढ़ विद्या, संन्यास एवं मोक्ष।'
    }
  }
};

export const BHAVA_LIST: BhavaInfo[] = [
  {
    bhava: 1,
    name: { en: '1st House (Tanu Bhava / Lagna)', kn: '೧ನೇ ಭಾವ: ತನು ಭಾವ (ಲಗ್ನ)', hi: 'प्रथम भाव: तनु भाव (लग्न)' },
    sanskritName: 'तनु भाव (Lagna)',
    category: { en: 'Kendra & Trikona (Vishnu & Lakshmi Sthana)', kn: 'ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣ (ಪರಮ ಶುಭ ಸ್ಥಾನ)', hi: 'केन्द्र एवं त्रिकोण' },
    karakas: { en: 'Sun (Surya - Atma Karaka)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य' },
    purposeToInspect: {
      en: 'Examine self-identity, physical health, vitality, body constitution, longevity, innate temperament, fame, and overall willpower.',
      kn: 'ಸ್ವರೂಪ, ದೈಹಿಕ ಆರೋಗ್ಯ, ದೇಹದ ಮೈಕಟ್ಟು, ವರ್ಚಸ್ಸು, ಆಯುಷ್ಯ, ನೈಸರ್ಗಿಕ ಸ್ವಭಾವ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಯಶಸ್ಸನ್ನು ನೋಡಬೇಕು.',
      hi: 'शरीर सौष्ठव, स्वास्थ्य, जीवन शक्ति, आत्मविश्वास, रूप-रंग, स्वभाव एवं सम्पूर्ण व्यक्तित्व।'
    },
    keySignifications: {
      en: 'Head, brain, complexion, stamina, birth circumstances, early life.',
      kn: 'ತಲೆ, ಮಿದುಳು, ದೇಹದ ಕಾಂತಿ, ಬಾಲ್ಯದ ಪರಿಸರ, ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ.',
      hi: 'मस्तिष्क, मुखमण्डल, आभा, प्रकृति एवं जीवनारम्भ।'
    },
    bodyParts: { en: 'Head, skull, and brain', kn: 'ತಲೆ, ಕಪಾಲ ಮತ್ತು ಮಿದುಳು', hi: 'शीर्ष एवं मस्तिष्क' },
    idealGrahas: { en: 'Jupiter, Sun, Mars, Mercury', kn: 'ಗುರು, ಸೂರ್ಯ, ಕುಜ, ಬುಧ', hi: 'गुरु, सूर्य, मंगल, बुध' },
    challengingGrahas: { en: 'Rahu, Ketu, afflicted Saturn', kn: 'ರಾಹು, ಕೇತು, ಪೀಡಿತ ಶನಿ', hi: 'राहु, केतु, पापयुक्त शनि' }
  },
  {
    bhava: 2,
    name: { en: '2nd House (Dhana & Kutumba Bhava)', kn: '೨ನೇ ಭಾವ: ಧನ & ಕುಟುಂಬ ಭಾವ', hi: 'द्वितीय भाव: धन एवं कुटुम्ब भाव' },
    sanskritName: 'धन भाव (Dhana / Kutumba)',
    category: { en: 'Maraka & Artha Sthana', kn: 'ಮಾರಕ & ಅರ್ಥ ಸ್ಥಾನ', hi: 'मारक एवं अर्थ स्थान' },
    karakas: { en: 'Jupiter (Wealth), Mercury (Speech)', kn: 'ಗುರು (ಧನ), ಬುಧ (ವಾಕ್)', hi: 'गुरु एवं बुध' },
    purposeToInspect: {
      en: 'Examine liquid wealth, family harmony, speech quality, oral truthfulness, food habits, right eye, and ancestral heritage.',
      kn: 'ಸಂಗ್ರಹಿತ ಧನ, ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್, ಕುಟುಂಬ ಸೌಖ್ಯ, ಮಾತಿನ ಮಧುರತೆ (ವಾಕ್ ಚಾತುರ್ಯ), ಆಹಾರ ಶೈಲಿ, ಬಲಗಣ್ಣು ಮತ್ತು ವಂಶ ಪರಂಪರೆ.',
      hi: 'संचित धन, बैंक बैलेंस, वाणी का प्रभाव, पारिवारिक सुख, खान-पान एवं दाहिना नेत्र।'
    },
    keySignifications: {
      en: 'Accumulated capital, ornaments, precious gems, face, throat, voice.',
      kn: 'ಚಿನ್ನ-ಬೆಳ್ಳಿ, ನಾಣ್ಯಗಳು, ಮುಖ, ಕಂಠ, ನಾಲಿಗೆ, ವಾಣಿಜ್ಯ ಲಾಭ.',
      hi: 'स्वर्ण, रत्न, मुख, कण्ठ, भाषा एवं कुल सम्पत्ति।'
    },
    bodyParts: { en: 'Face, mouth, teeth, tongue, right eye', kn: 'ಮುಖ, ಬಾಯಿ, ಹಲ್ಲುಗಳು, ನಾಲಿಗೆ, ಬಲಗಣ್ಣು', hi: 'मुख, जिह्वा, दांत, दाहिनी आंख' },
    idealGrahas: { en: 'Jupiter, Venus, Mercury', kn: 'ಗುರು, ಶುಕ್ರ, ಬುಧ', hi: 'गुरु, शुक्र, बुध' },
    challengingGrahas: { en: 'Mars, Saturn, Rahu', kn: 'ಕುಜ, ಶನಿ, ರಾಹು', hi: 'मंगल, शनि, राहु' }
  },
  {
    bhava: 3,
    name: { en: '3rd House (Sahaja & Parakrama Bhava)', kn: '೩ನೇ ಭಾವ: ಸಹಜ & ಪರಾಕ್ರಮ ಭಾವ', hi: 'तृतीय भाव: सहज एवं पराक्रम भाव' },
    sanskritName: 'सहज भाव (Sahaja / Bhratri)',
    category: { en: 'Upachaya (Growth) & Kama Sthana', kn: 'ಉಪಚಯ (ಬೆಳವಣಿಗೆ) ಮತ್ತು ಕಾಮ ಸ್ಥಾನ', hi: 'उपचय एवं काम स्थान' },
    karakas: { en: 'Mars (Courage), Mercury (Communication)', kn: 'ಕುಜ (ಶೌರ್ಯ), ಬುಧ (ಸಂವಹನ)', hi: 'मंगल एवं बुध' },
    purposeToInspect: {
      en: 'Examine courage, younger siblings, physical vigor, writing/media skills, short travels, arms, and athletic abilities.',
      kn: 'ಸಾಹಸ, ಧೈರ್ಯ, ಕಿರಿಯ ಸಹೋದರ-ಸಹೋದರಿಯರು, ಕೈಗಳ ಬಲ, ಬರವಣಿಗೆ, ಸಂವಹನ, ಅಲ್ಪ ಪ್ರವಾಸಗಳು ಮತ್ತು ಕ್ರೀಡಾ ಶಕ್ತಿ.',
      hi: 'साहस, छोटे भाई-बहन, पराक्रम, लेखन, सम्प्रेषण, लघु यात्राएं एवं बाहुबल।'
    },
    keySignifications: {
      en: 'Initiative, negotiations, hobbies, manual dexterity, ears, shoulders.',
      kn: 'ಹೊಸ ಆರಂಭಗಳು, ಕಿವಿಯ ಆರೋಗ್ಯ, ಭುಜಗಳು, ಸಂಧಾನ ಕೌಶಲ್ಯ.',
      hi: 'उद्यम, शौर्य, श्रवण शक्ति, कंधे एवं भुजाएं।'
    },
    bodyParts: { en: 'Shoulders, arms, hands, right ear, nervous system', kn: 'ಭುಜಗಳು, ತೋಳುಗಳು, ಕೈಗಳು, ಬಲಗಿವಿ', hi: 'कंधे, हाथ, भुजाएं, दाहिना कान' },
    idealGrahas: { en: 'Mars, Saturn, Sun, Rahu (Malefics thrive in 3rd)', kn: 'ಕುಜ, ಶನಿ, ಸೂರ್ಯ, ರಾಹು (ಉಪಚಯದಲ್ಲಿ ಪಾಪಗ್ರಹ ಶುಭ)', hi: 'मंगल, शनि, सूर्य, राहु' },
    challengingGrahas: { en: 'Afflicted Moon, weak Jupiter', kn: 'ಪೀಡಿತ ಚಂದ್ರ, ಬಲಹೀನ ಗುರು', hi: 'क्षीण चन्द्रमा' }
  },
  {
    bhava: 4,
    name: { en: '4th House (Sukha & Matru Bhava)', kn: '೪ನೇ ಭಾವ: ಸುಖ & ಮಾತೃ ಭಾವ', hi: 'चतुर्थ भाव: सुख एवं मातृ भाव' },
    sanskritName: 'सुख भाव (Matru / Bandhu)',
    category: { en: 'Kendra & Moksha Sthana', kn: 'ಕೇಂದ್ರ ಮತ್ತು ಮೋಕ್ಷ ಸ್ಥಾನ', hi: 'केन्द्र एवं मोक्ष स्थान' },
    karakas: { en: 'Moon (Mother, Mind), Venus (Vehicles, Home)', kn: 'ಚಂದ್ರ (ತಾಯಿ, ಮನಸ್ಸು), ಶುಕ್ರ (ವಾಹನ, ಗೃಹ)', hi: 'चन्द्रमा एवं शुक्र' },
    purposeToInspect: {
      en: 'Examine mother’s love, residential property, real estate, vehicles, inner happiness, heart, chest, and academic schooling.',
      kn: 'ತಾಯಿಯ ಪ್ರೀತಿ ಮತ್ತು ಆಯುಷ್ಯ, ಸ್ವಂತ ಮನೆ, ಜಮೀನು-ಆಸ್ತಿ, ವಾಹನ ಸುಖ, ಆಂತರಿಕ ಸಂತೋಷ, ಎದೆ, ಹೃದಯ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣ.',
      hi: 'माता, गृह, भूमि, भवन, वाहन सुख, मानसिक शांति, हृदय एवं प्रारंभिक विद्या।'
    },
    keySignifications: {
      en: 'Domestic bliss, comforts, livestock, homeland, maternal ancestry.',
      kn: 'ಗೃಹ ಸೌಖ್ಯ, ತಾಯ್ನಾಡು, ಕೃಷಿ ಭೂಮಿ, ಆಂತರಿಕ ನೆಮ್ಮದಿ.',
      hi: 'मातृभूमि, अचल सम्पत्ति, गृह शांति एवं छाती।'
    },
    bodyParts: { en: 'Chest, lungs, heart, breast', kn: 'ಎದೆ, ಶ್ವಾಸಕೋಶ, ಹೃದಯ', hi: 'हृदय, वक्षस्थल एवं फेफड़े' },
    idealGrahas: { en: 'Moon, Venus, Jupiter, Mercury', kn: 'ಚಂದ್ರ, ಶುಕ್ರ, ಗುರು, ಬುಧ', hi: 'चन्द्रमा, शुक्र, गुरु, बुध' },
    challengingGrahas: { en: 'Mars (Angaraka), Saturn, Rahu, Ketu', kn: 'ಕುಜ, ಶನಿ, ರಾಹು, ಕೇತು', hi: 'मंगल, शनि, राहु' }
  },
  {
    bhava: 5,
    name: { en: '5th House (Putra & Buddhi Bhava)', kn: '೫ನೇ ಭಾವ: ಪುತ್ರ & ಬುದ್ಧಿ ಭಾವ', hi: 'पंचम भाव: पुत्र एवं बुद्धि भाव' },
    sanskritName: 'सुत भाव (Putra / Buddhi)',
    category: { en: 'Trikona (Lakshmi Sthana - Divine Grace)', kn: 'ತ್ರಿಕೋಣ (ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ಸ್ಥಾನ)', hi: 'त्रिकोण (लक्ष्मी स्थान)' },
    karakas: { en: 'Jupiter (Children, Wisdom, Mantras)', kn: 'ಗುರು (ಸಂತಾನ, ಜ್ಞಾನ, ಮಂತ್ರ)', hi: 'गुरु' },
    purposeToInspect: {
      en: 'Examine progeny, intellectual brilliance, creativity, past-life merits (Purva Punya), mantra initiation, intuition, and romance.',
      kn: 'ಸಂತಾನ ಭಾಗ್ಯ, ತೀಕ್ಷ್ಣ ಬುದ್ಧಿಶಕ್ತಿ, ಪ್ರತಿಭೆ, ಪೂರ್ವ ಜನ್ಮದ ಪುಣ್ಯ, ಮಂತ್ರ ಸಿದ್ಧಿ, ಆಡಳಿತಾತ್ಮಕ ದೂರದೃಷ್ಟಿ ಮತ್ತು ಪ್ರೇಮ ಬಾಂಧವ್ಯ.',
      hi: 'सन्तान सुख, मेधा शक्ति, पूर्व पुण्य, मन्त्र सिद्धि, रचनात्मकता एवं विवेक।'
    },
    keySignifications: {
      en: 'Higher scholarship, authorship, lottery/speculation luck, stomach.',
      kn: 'ವಿದ್ಯಾರ್ಹತೆ, ಕಾವ್ಯ ರಚನೆ, ಲಾಟರಿ/ಹೂಡಿಕೆ ಅದೃಷ್ಟ, ಹೊಟ್ಟೆ.',
      hi: 'ज्ञान, नीति, मन्त्र शक्ति, उदर एवं आत्मिक आभा।'
    },
    bodyParts: { en: 'Upper abdomen, stomach, pancreas, liver', kn: 'ಹೊಟ್ಟೆಯ ಮೇಲ್ಭಾಗ, ಜಠರ, ಯಕೃತ್ತು', hi: 'पेट, यकृत, आमाशय' },
    idealGrahas: { en: 'Jupiter, Sun, Mercury, Venus', kn: 'ಗುರು, ಸೂರ್ಯ, ಬುಧ, ಶುಕ್ರ', hi: 'गुरु, सूर्य, बुध' },
    challengingGrahas: { en: 'Rahu (Pitru Dosha indicator), Saturn', kn: 'ರಾಹು, ಕೇತು, ಶನಿ', hi: 'राहु, केतु, शनि' }
  },
  {
    bhava: 6,
    name: { en: '6th House (Ripu, Roga & Rina Bhava)', kn: '೬ನೇ ಭಾವ: ಶತ್ರು, ರೋಗ & ಋಣ ಭಾವ', hi: 'षष्ठ भाव: शत्रु, रोग एवं ऋण भाव' },
    sanskritName: 'रिपु भाव (Ari / Roga / Rina)',
    category: { en: 'Dusthana (Trik) & Upachaya Sthana', kn: 'ದುಃಸ್ಥಾನ ಮತ್ತು ಉಪಚಯ ಸ್ಥಾನ', hi: 'त्रिक (दुस्थान) एवं उपचय' },
    karakas: { en: 'Mars (Enemies, Debts), Saturn (Chronic Diseases)', kn: 'ಕುಜ (ಶತ್ರು-ಋಣ), ಶನಿ (ದೀರ್ಘ ರೋಗ)', hi: 'मंगल एवं शनि' },
    purposeToInspect: {
      en: 'Examine enemies, physical illnesses, debts, legal litigations, competitive exams, maternal uncles, daily employment, and service.',
      kn: 'ಶತ್ರುಗಳು, ದೈಹಿಕ ರೋಗಗಳು, ಸಾಲ-ಋಣಗಳು, ನ್ಯಾಯಾಲಯದ ವ್ಯಾಜ್ಯಗಳು, ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು, ತಾಯಿಯ ಸಹೋದರರು (ಮಾವಂದಿರು) ಮತ್ತು ಸೇವಾ ವೃತ್ತಿ.',
      hi: 'शत्रु, रोग, ऋण, मुकदमा, प्रतियोगिता परीक्षा, मामा एवं नित्य सेवा कार्य।'
    },
    keySignifications: {
      en: 'Immunity to overcome disputes, daily workload, digestive fire.',
      kn: 'ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ, ವಿವಾದ ಜಯ, ಜೀರ್ಣಾಂಗ, ನೌಕರಿ.',
      hi: 'शत्रु विजय, रोग प्रतिरोधक क्षमता, आंतें एवं श्रम।'
    },
    bodyParts: { en: 'Intestines, kidneys, digestive tract, navel', kn: 'ಕರುಳು, ಮೂತ್ರಪಿಂಡ, ಹೊಕ್ಕಳು ಭಾಗ', hi: 'आंतें, गुर्दे एवं नाभि' },
    idealGrahas: { en: 'Saturn, Mars, Rahu, Sun (Crush adversaries)', kn: 'ಶನಿ, ಕುಜ, ರಾಹು, ಸೂರ್ಯ (ಶತ್ರುನಾಶಕರು)', hi: 'शनि, मंगल, राहु, सूर्य' },
    challengingGrahas: { en: 'Jupiter, Venus, Moon (soft benefics feel harassed)', kn: 'ಗುರು, ಶುಕ್ರ, ಚಂದ್ರ', hi: 'गुरु, शुक्र' }
  },
  {
    bhava: 7,
    name: { en: '7th House (Kalatra & Jaya Bhava)', kn: '೭ನೇ ಭಾವ: ಕಳತ್ರ & ಜಾಯಾ ಭಾವ', hi: 'सप्तम भाव: कलत्र एवं जाया भाव' },
    sanskritName: 'कलत्र भाव (Jaya / Partnership)',
    category: { en: 'Kendra & Maraka Sthana', kn: 'ಕೇಂದ್ರ ಮತ್ತು ಮಾರಕ ಸ್ಥಾನ', hi: 'केन्द्र एवं मारक स्थान' },
    karakas: { en: 'Venus (Wife/Romance), Jupiter (Husband/Morality)', kn: 'ಶುಕ್ರ (ಪತ್ನಿ, ಪ್ರೇಮ), ಗುರು (ಪತಿ, ಧರ್ಮ)', hi: 'शुक्र एवं गुरु' },
    purposeToInspect: {
      en: 'Examine spouse, marital happiness, fidelity, business partners, public interactions, foreign travels, and commercial trade.',
      kn: 'ಜೀವನ ಸಂಗಾತಿ (ಪತಿ/ಪತ್ನಿ), ದಾಂಪತ್ಯ ಸುಖ, ವಿವಾಹ ಕಾಲ, ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ, ಸಾರ್ವಜನಿಕ ಪ್ರಭಾವ ಮತ್ತು ವಿದೇಶ ವಾಸ.',
      hi: 'जीवनसाथी, वैवाहिक सामंजस्य, व्यापारिक साझेदारी, विदेश गमन एवं सामाजिक प्रतिष्ठा।'
    },
    keySignifications: {
      en: 'Contracts, diplomacy, sensual desires, open rivals, legal agreements.',
      kn: 'ವ್ಯಾಪಾರ ಒಪ್ಪಂದಗಳು, ಕಾಮ ಸುಖ, ರಾಜತಾಂತ್ರಿಕತೆ, ಪ್ರವಾಸ.',
      hi: 'विवाह, सन्धि, कामवासना, साझेदार एवं यात्रा।'
    },
    bodyParts: { en: 'Lower abdomen, pelvis, reproductive organs', kn: 'ಕಿಬ್ಬೊಟ್ಟೆ, ಸೊಂಟ, ಜನನಾಂಗಗಳು', hi: 'पेल्विस, मूत्राशय एवं प्रजनन अंग' },
    idealGrahas: { en: 'Venus, Jupiter, Mercury', kn: 'ಶುಕ್ರ, ಗುರು, ಬುಧ', hi: 'शुक्र, गुरु, बुध' },
    challengingGrahas: { en: 'Mars (Manglik Dosha), Sun, Saturn, Rahu, Ketu', kn: 'ಕುಜ (ಕುಜ ದೋಷ), ಸೂರ್ಯ, ಶನಿ, ರಾಹು, ಕೇತು', hi: 'मंगल, सूर्य, शनि, राहु' }
  },
  {
    bhava: 8,
    name: { en: '8th House (Ayur & Randhra Bhava)', kn: '೮ನೇ ಭಾವ: ಆಯುರ್ & ರಂಧ್ರ ಭಾವ', hi: 'अष्टम भाव: आयु एवं रन्ध्र भाव' },
    sanskritName: 'आयुर्भाव (Randhra / Mrityu)',
    category: { en: 'Dusthana (Trik) & Moksha Sthana', kn: 'ದುಃಸ್ಥಾನ ಮತ್ತು ಮೋಕ್ಷ ಸ್ಥಾನ', hi: 'त्रिक एवं मोक्ष स्थान' },
    karakas: { en: 'Saturn (Ayushya Karaka - Longevity)', kn: 'ಶನಿ (ಆಯುಷ್ಕಾರಕ)', hi: 'शनि' },
    purposeToInspect: {
      en: 'Examine longevity, cause of death, sudden windfalls, hidden wealth, inheritance, research, astrology/occult, and chronic surgery.',
      kn: 'ಆಯುಷ್ಯ, ಸಾವು-ಬದುಕಿನ ಪ್ರಶ್ನೆ, ಆಕಸ್ಮಿಕ ಅಪಘಾತಗಳು, ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿ, ಗುಪ್ತ ವಿದ್ಯೆಗಳು (ಜ್ಯೋತಿಷ್ಯ, ತಂತ್ರ), ಸಂಶೋಧನೆ ಮತ್ತು ಆಪರೇಷನ್.',
      hi: 'आयु, मृत्यु का कारण, आकस्मिक धन, वसीयत, गुप्त विद्याएं, शोध एवं असाध्य रोग।'
    },
    keySignifications: {
      en: 'Transformations, insurance, unearned money, psychic depth, shame.',
      kn: 'ಹಠಾತ್ ಬದಲಾವಣೆ, ವಿಮೆ ಹಣ, ರಹಸ್ಯ ಧನ, ಮಾನಸಿಕ ತೊಳಲಾಟ.',
      hi: 'गहन परिवर्तन, दुर्घटना, गुप्त धन एवं पुनर्जन्म।'
    },
    bodyParts: { en: 'Excretory organs, pelvic bone, perineum', kn: 'ಮಲವಿಸರ್ಜನಾ ಅಂಗಗಳು, ಗುದದ್ವಾರ', hi: 'गुदा, गुप्त अंग एवं मलाशय' },
    idealGrahas: { en: 'Saturn (well placed for long life), benefic Moon', kn: 'ಶನಿ (ದೀರ್ಘಾಯುಷ್ಯಕ್ಕೆ ಶ್ರೇಷ್ಠ), ಶುಭ ಚಂದ್ರ', hi: 'शनि' },
    challengingGrahas: { en: 'Mars, Rahu, Sun (causes surgery/fever)', kn: 'ಕುಜ, ರಾಹು, ಸೂರ್ಯ', hi: 'मंगल, राहु, सूर्य' }
  },
  {
    bhava: 9,
    name: { en: '9th House (Bhagya & Dharma Bhava)', kn: '೯ನೇ ಭಾವ: ಭಾಗ್ಯ & ಧರ್ಮ ಭಾವ', hi: 'नवम भाव: भाग्य एवं धर्म भाव' },
    sanskritName: 'भाग्य भाव (Dharma / Guru)',
    category: { en: 'Supreme Trikona (Lakshmi Sthana)', kn: 'ಪರಮ ತ್ರಿಕೋಣ (ಅತ್ಯುನ್ನತ ಭಾಗ್ಯ ಸ್ಥಾನ)', hi: 'परम त्रिकोण (लक्ष्मी स्थान)' },
    karakas: { en: 'Jupiter (Wisdom, Guru, Dharma), Sun (Father)', kn: 'ಗುರು (ಧರ್ಮ, ಗುರುಗಳು), ಸೂರ್ಯ (ಪಿತೃ)', hi: 'गुरु एवं सूर्य' },
    purposeToInspect: {
      en: 'Examine overall fortune (Bhagya), father’s blessings, guru guidance, pilgrimages, higher philosophical intellect, and noble karma.',
      kn: 'ಸರ್ವತೋಮುಖ ಅದೃಷ್ಟ (ಭಾಗ್ಯೋದಯ), ತಂದೆಯ ಪ್ರೀತಿ, ಕುಲದೈವ ಮತ್ತು ಗುರುಗಳ ಕೃಪೆ, ತೀರ್ಥಯಾತ್ರೆಗಳು, ದೇವತಾ ಭಕ್ತಿ, ಧರ್ಮ ಮತ್ತು ಉನ್ನತ ಶಿಕ್ಷಣ.',
      hi: 'भाग्य, धर्म, पिता, गुरु कृपा, तीर्थयात्रा, उच्च दार्शनिक ज्ञान एवं सदाचार।'
    },
    keySignifications: {
      en: 'Spiritual initiation, temple construction, charity, divine grace.',
      kn: 'ಯಾಗ-ಯಜ್ಞಗಳು, ದೇವಸ್ಥಾನ ಸೇವೆ, ದಾನ-ಧರ್ಮ, ದೈವಾನುಗ್ರಹ.',
      hi: 'तपस्या, दान, ईश्वरानुग्रह एवं विदेश में उच्च शिक्षा।'
    },
    bodyParts: { en: 'Thighs, hips, arterial system', kn: 'ತೊಡೆಗಳು, ಸೊಂಟದ ಮೂಳೆಗಳು', hi: 'जांघें एवं कूल्हे' },
    idealGrahas: { en: 'Jupiter, Sun, Mars, Venus', kn: 'ಗುರು, ಸೂರ್ಯ, ಕುಜ, ಶುಕ್ರ', hi: 'गुरु, सूर्य, मंगल, शुक्र' },
    challengingGrahas: { en: 'Rahu (causes Pitru dosha), afflicted Saturn', kn: 'ರಾಹು, ಪೀಡಿತ ಶನಿ', hi: 'राहु, केतु' }
  },
  {
    bhava: 10,
    name: { en: '10th House (Karma & Rajya Bhava)', kn: '೧೦ನೇ ಭಾವ: ಕರ್ಮ & ರಾಜ್ಯ ಭಾವ', hi: 'दशम भाव: कर्म एवं राज्य भाव' },
    sanskritName: 'कर्म भाव (Rajya / Kirti)',
    category: { en: 'Supreme Kendra (Vishnu Sthana - Zenith of Life)', kn: 'ಪ್ರಮುಖ ಕೇಂದ್ರ (ವಿಷ್ಣು ಸ್ಥಾನ - ಆಕಾಶದ ನೆತ್ತಿ)', hi: 'प्रधान केन्द्र (विष्णु स्थान)' },
    karakas: { en: 'Sun (Authority), Mercury (Trade), Jupiter (Honor), Saturn (Labor)', kn: 'ಸೂರ್ಯ (ಅಧಿಕಾರ), ಬುಧ (ವ್ಯಾಪಾರ), ಗುರು (ಗೌರವ), ಶನಿ (ಶ್ರಮ)', hi: 'सूर्य, बुध, गुरु, शनि' },
    purposeToInspect: {
      en: 'Examine career profession, leadership authority, government status, fame, public prestige, executive power, and worldly achievements.',
      kn: 'ಉದ್ಯೋಗ, ವೃತ್ತಿ ಪ್ರವೃತ್ತಿ, ಸರ್ಕಾರಿ ನೌಕರಿ, ರಾಜಕೀಯ ಅಧಿಕಾರ, ಸಾರ್ವಜನಿಕ ಗೌರವ, ಕೀರ್ತಿ, ವ್ಯಾಪಾರ ಮತ್ತು ಲೌಕಿಕ ಸಾಧನೆಗಳು.',
      hi: 'आजीविका, पद-प्रतिष्ठा, राजसत्ता, ख्याति, व्यवसाय एवं प्रशासनिक नेतृत्व।'
    },
    keySignifications: {
      en: 'Promotion, social rank, father’s status, royal favor, dignity.',
      kn: 'ಹುದ್ದೆ ಬಡ್ತಿ, ರಾಜ ಸನ್ಮಾನ, ಸಮಾಜದಲ್ಲಿ ಹೆಸರು, ಕೀರ್ತಿ.',
      hi: 'पदोन्नति, यश, मान-सम्मान एवं नेतृत्व क्षमता।'
    },
    bodyParts: { en: 'Knees, kneecaps, skeletal joints', kn: 'ಮೊಣಕಾಲುಗಳು, ಕೀಲುಗಳು', hi: 'घुटने एवं जोड़' },
    idealGrahas: { en: 'Sun, Mars (Digbala - Kuladipaka), Jupiter, Mercury, Saturn', kn: 'ಸೂರ್ಯ, ಕುಜ (ದಿಗ್ಬಲ - ಕುಲದೀಪಕ), ಗುರು, ಬುಧ, ಶನಿ', hi: 'सूर्य, मंगल (दिग्बली), गुरु, शनि' },
    challengingGrahas: { en: 'Afflicted Moon, debilitated Venus', kn: 'ಬಲಹೀನ ಚಂದ್ರ, ನೀಚ ಶುಕ್ರ', hi: 'निर्बल चन्द्रमा' }
  },
  {
    bhava: 11,
    name: { en: '11th House (Labha & Aya Bhava)', kn: '೧೧ನೇ ಭಾವ: ಲಾಭ & ಆಯ ಭಾವ', hi: 'एकादश भाव: लाभ एवं आय भाव' },
    sanskritName: 'लाभ भाव (Aya / Siddhi)',
    category: { en: 'Upachaya & Kama Sthana (House of Fulfilment)', kn: 'ಉಪಚಯ ಮತ್ತು ಕಾಮ ಸ್ಥಾನ (ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ)', hi: 'उपचय एवं काम स्थान' },
    karakas: { en: 'Jupiter (Financial Profits & Expansion)', kn: 'ಗುರು (ಲಾಭ, ಸಂತೋಷ)', hi: 'गुरु' },
    purposeToInspect: {
      en: 'Examine regular income, large financial windfalls, fulfillment of ambitions, elder siblings, social networks, and prosperity.',
      kn: 'ಆದಾಯ, ಲಾಭ, ಆಕಸ್ಮಿಕ ಧನಾಗಮನ, ಹಿರಿಯ ಸಹೋದರ-ಸಹೋದರಿಯರು, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ, ಸ್ನೇಹಿತರ ವಲಯ ಮತ್ತು ಸಮಾಜದ ಒಡನಾಟ.',
      hi: 'आय के स्रोत, मनोकामना पूर्ति, बड़े भाई-बहन, मित्र मण्डली एवं आर्थिक समृद्धि।'
    },
    keySignifications: {
      en: 'Gains from profession, celebrations, prizes, influential patronage.',
      kn: 'ವ್ಯಾಪಾರ ಲಾಭ, ಪುರಸ್ಕಾರಗಳು, ಹಿರಿಯರ ಬೆಂಬಲ, ಸಂಪತ್ತು.',
      hi: 'धन लाभ, सिद्धियाँ, पुरस्कार एवं वैभव।'
    },
    bodyParts: { en: 'Left ear, shins, calves, ankles', kn: 'ಎಡಗಿವಿ, ಮೀನಖಂಡ, ಹಿಮ್ಮಡಿ', hi: 'बायां कान, पिंडलियां एवं टखने' },
    idealGrahas: { en: 'All 9 Grahas produce positive gains in the 11th House!', kn: '೧೧ನೇ ಭಾವದಲ್ಲಿ ನೆಲೆಸಿದ ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳೂ ಶುಭ ಲಾಭ ನೀಡುತ್ತವೆ!', hi: 'सभी ९ ग्रह एकादश में शुभ फल देते हैं' },
    challengingGrahas: { en: 'None intrinsically (all planets give material gains)', kn: 'ಯಾವುದೂ ಇಲ್ಲ (ಎಲ್ಲರೂ ಲಾಭದಾಯಕ)', hi: 'कोई नहीं' }
  },
  {
    bhava: 12,
    name: { en: '12th House (Vyaya & Moksha Bhava)', kn: '೧೨ನೇ ಭಾವ: ವ್ಯಯ & ಮೋಕ್ಷ ಭಾವ', hi: 'द्वादश भाव: व्यय एवं मोक्ष भाव' },
    sanskritName: 'व्यय भाव (Moksha / Shayana)',
    category: { en: 'Dusthana (Trik) & Supreme Moksha Sthana', kn: 'ದುಃಸ್ಥಾನ ಮತ್ತು ಪರಮ ಮೋಕ್ಷ ಸ್ಥಾನ', hi: 'त्रिक एवं मोक्ष स्थान' },
    karakas: { en: 'Saturn (Losses), Ketu (Moksha), Venus (Bed pleasures)', kn: 'ಶನಿ (ಖರ್ಚು), ಕೇತು (ಮೋಕ್ಷ), ಶುಕ್ರ (ಶಯನ ಸುಖ)', hi: 'शनि, केतु एवं शुक्र' },
    purposeToInspect: {
      en: 'Examine expenditures, foreign settlements, bedroom comforts/sleep, isolation/hospitals, spiritual renunciation, and Moksha.',
      kn: 'ಖರ್ಚುಗಳು, ವಿದೇಶ ವಾಸ್ತವ್ಯ, ಶಯನ ಸುಖ (ನಿದ್ರೆ), ಆಸ್ಪತ್ರೆ/ಕಾರಾಗೃಹ ವಾಸ, ದಾನ-ಧರ್ಮ, ಆಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ ಮತ್ತು ಮೋಕ್ಷ.',
      hi: 'खर्च, विदेश प्रवास, शयन सुख (निद्रा), अस्पताल, त्याग, ध्यान एवं मोक्ष।'
    },
    keySignifications: {
      en: 'Secret enemies, detachment, meditation ashrams, charity expenditures.',
      kn: 'ಗುಪ್ತ ಖರ್ಚುಗಳು, ನಿದ್ರಾಹೀನತೆ, ಆಶ್ರಮ ವಾಸ, ಅಧ್ಯಾತ್ಮ ಸಾಧನೆ.',
      hi: 'गुप्त व्यय, वैराग्य, मोक्ष साधना एवं विदेश वास।'
    },
    bodyParts: { en: 'Feet, left eye, soles', kn: 'ಪಾದಗಳು, ಎಡಗಣ್ಣು, ಹಿಮ್ಮಡಿ', hi: 'पैर, तलवे एवं बांयी आंख' },
    idealGrahas: { en: 'Venus (exalted in 12th for bed pleasures), Ketu (Moksha)', kn: 'ಶುಕ್ರ (ಶಯನ ಸುಖಕ್ಕೆ ಶುಭ), ಕೇತು (ಮೋಕ್ಷಕಾರಕ)', hi: 'शुक्र एवं केतु' },
    challengingGrahas: { en: 'Sun, Mars, Rahu (heavy expenditures and hospital bills)', kn: 'ಸೂರ್ಯ, ಕುಜ, ರಾಹು (ಅತಿಯಾದ ಆಸ್ಪತ್ರೆ ಖರ್ಚು)', hi: 'सूर्य, मंगल, राहु' }
  }
];

import { getDetailedGrahaBhavaEffect, COMPLETE_GRAHA_BHAVA_EFFECTS, GrahaBhavaEffectItem } from './grahaBhavaEffectsData';

export { getDetailedGrahaBhavaEffect, COMPLETE_GRAHA_BHAVA_EFFECTS };
export type { GrahaBhavaEffectItem };

// Classical Vedic Interpretations of each Graha in each Bhava (1 to 12)
export interface GrahaBhavaEffect {
  planet: string;
  bhava: number;
  title: LocalizedString;
  nature: 'Auspicious' | 'Mixed' | 'Remedy Needed';
  description: LocalizedString;
  remedy: LocalizedString;
}

export function getGrahaBhavaEffect(planetName: string, bhava: number): GrahaBhavaEffect {
  const detailed = getDetailedGrahaBhavaEffect(planetName, bhava);
  return {
    planet: detailed.planet,
    bhava: detailed.bhava,
    title: detailed.title,
    nature: detailed.nature,
    description: detailed.summary,
    remedy: {
      en: `${detailed.remedy.action.en} Mantra: ${detailed.remedy.mantra} (${detailed.remedy.mantraCount}). Day: ${detailed.remedy.charityDay.en}.`,
      kn: `${detailed.remedy.action.kn} ಮಂತ್ರ: ${detailed.remedy.mantra} (${detailed.remedy.mantraCount}). ವಾರ: ${detailed.remedy.charityDay.kn}.`,
      hi: `${detailed.remedy.action.hi} मन्त्र: ${detailed.remedy.mantra}`
    }
  };
}
