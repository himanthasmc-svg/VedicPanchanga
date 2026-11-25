import { CityLocation, Language, LocalizedString } from '../types';
import { parseDateInCityTimezone } from './panchanga';

export interface ConstellationStar {
  name: string;
  vedicName?: string;
  /** Normalized constellation map coordinate X (-45 to +45) */
  x: number;
  /** Normalized constellation map coordinate Y (-35 to +35) */
  y: number;
  /** Apparent visual magnitude (lower = brighter) */
  mag: number;
  /** Spectral star color hex */
  color: string;
  /** True if primary anchor star */
  isPrimary?: boolean;
}

export interface RashiConstellationInfo {
  rashiIndex: number; // 0 = Mesha (Aries) .. 11 = Meena (Pisces)
  rashiName: LocalizedString;
  symbol: string;
  element: LocalizedString;
  lord: LocalizedString;
  /** Approximate J2000 center Right Ascension in decimal hours (0–24h) */
  raHours: number;
  /** Approximate J2000 center Declination in degrees (-30° to +30°) */
  decDeg: number;
  /** Ecliptic longitude span (sidereal) */
  siderealStartDeg: number;
  siderealEndDeg: number;
  shapeTitle: LocalizedString;
  howToIdentify: LocalizedString;
  starHoppingGuide: LocalizedString;
  bestViewingMonths: LocalizedString;
  stars: ConstellationStar[];
  lines: Array<[number, number]>;
}

export interface RashiSkyPosition {
  rashiIndex: number;
  altitudeDeg: number;
  azimuthDeg: number;
  compassCode: string; // e.g., 'NE', 'ESE', 'SW'
  compassLabel: LocalizedString;
  directionAdvice: LocalizedString;
  visibilityStatus: 'high' | 'rising_or_low' | 'below_horizon';
  visibilityLabel: LocalizedString;
  /** Approximate local hour when this Rashi culminates (highest in South/overhead) */
  culminationHint: LocalizedString;
}

export const RASHI_CONSTELLATIONS: RashiConstellationInfo[] = [
  {
    rashiIndex: 0,
    rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ (Aries)', hi: 'मेष (Aries)' },
    symbol: '♈',
    element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' },
    lord: { en: 'Mars (Kuja)', kn: 'ಕುಜ (ಮಂಗಳ)', hi: 'मंगल' },
    raHours: 2.35,
    decDeg: 21.0,
    siderealStartDeg: 0,
    siderealEndDeg: 30,
    shapeTitle: {
      en: 'The Ram — Curved Horn Arc of 4 Stars',
      kn: 'ಮೇಷ (ಟಗರು) — ಬಾಗಿದ ಕೊಂಬಿನ ಆಕಾರದ ೪ ಪ್ರಮುಖ ತಾರೆಗಳು',
      hi: 'मेष — मुड़े सींग के आकार के ४ प्रमुख तारे',
    },
    howToIdentify: {
      en: 'Look for a gentle curved crook of 3–4 stars: bright orange-gold Hamal (Ashwini) flanked closely by Sheratan and faint Mesarthim, curving down to 41 Arietis (Bharani).',
      kn: 'ಆಕಾಶದಲ್ಲಿ ಪ್ರಕಾಶಮಾನವಾದ ಕಿತ್ತಳೆ-ಹಳದಿ ಹಮಲ್ (ಅಶ್ವಿನಿ), ಪಕ್ಕದ ಶೆರಟಾನ್ ಮತ್ತು ಮೆಸಾರ್ಥಿಮ್ ತಾರೆಗಳು ಕುದುರೆಯ ಮುಖ ಅಥವಾ ಟಗರಿನ ಕೊಂಬಿನಂತೆ ಬಾಗಿ ಕಾಣಿಸುತ್ತವೆ.',
      hi: 'चमकीले नारंगी-सुनहरे हमल (अश्विनी) के पास शेरटान और मेसार्थिम एक मुड़े हुए सींग की रेखा बनाते हैं।',
    },
    starHoppingGuide: {
      en: 'Find the sparkling Pleiades (Krittika) cluster first, then look about two fist-widths to the West — the brightest lone pair there is Hamal & Sheratan of Mesha.',
      kn: 'ಮೊದಲು ಆಕಾಶದಲ್ಲಿ ಪುಟ್ಟ ದೀಪದಂತೆ ಮಿನುಗುವ ಕೃತ್ತಿಕಾ (ಪ್ಲಿಯೇಡಿಸ್) ಪುಂಜವನ್ನು ಗುರುತಿಸಿ; ಅದರ ಪಶ್ಚಿಮಕ್ಕೆ ಸುಮಾರು ಎರಡು ಮುಷ್ಟಿ ಅಂತರದಲ್ಲಿ ಮೇಷದ ಹಮಲ್-ಶೆರಟಾನ್ ತಾರೆಗಳು ಕಾಣುತ್ತವೆ.',
      hi: 'पहले चमकते कृत्तिका (प्लीएडीज़) समूह को खोजें, उसके पश्चिम में दो मुट्ठी की दूरी पर मेष के मुख्य तारे दिखते हैं।',
    },
    bestViewingMonths: {
      en: 'October – January (Evening Sky)',
      kn: 'ಅಕ್ಟೋಬರ್ – ಜನವರಿ (ಸಂಜೆ/ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'अक्टूबर – जनवरी (संध्या/रात्रि आकाश)',
    },
    stars: [
      { name: 'Hamal (α Ari)', vedicName: 'ಅಶ್ವಿನಿ ಮುಖ್ಯ', x: -16, y: -12, mag: 2.0, color: '#fbbf24', isPrimary: true },
      { name: 'Sheratan (β Ari)', vedicName: 'ಅಶ್ವಿನಿ', x: -30, y: -2, mag: 2.6, color: '#e2e8f0' },
      { name: 'Mesarthim (γ Ari)', vedicName: 'ಅಶ್ವಿನಿ', x: -34, y: 10, mag: 3.9, color: '#bae6fd' },
      { name: '41 Ari (Bharani)', vedicName: 'ಭರಣಿ', x: 10, y: -18, mag: 3.6, color: '#93c5fd' },
      { name: 'Botein (δ Ari)', vedicName: 'ಭರಣಿ-ಕೃತ್ತಿಕಾ', x: 26, y: 2, mag: 4.3, color: '#fde68a' },
      { name: 'ε Ari', x: 14, y: 8, mag: 4.6, color: '#ffffff' },
    ],
    lines: [[2, 1], [1, 0], [0, 3], [3, 4], [4, 5]],
  },
  {
    rashiIndex: 1,
    rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ (Taurus)', hi: 'वृषभ (Taurus)' },
    symbol: '♉',
    element: { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' },
    lord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    raHours: 4.6,
    decDeg: 17.5,
    siderealStartDeg: 30,
    siderealEndDeg: 60,
    shapeTitle: {
      en: 'The Bull — Fiery V-Shaped Face (Rohini) & Pleiades Shoulder (Krittika)',
      kn: 'ವೃಷಭ (ಎತ್ತು) — "V" ಆಕಾರದ ರೋಹಿಣಿ ಮುಖ ಮತ್ತು ಕೃತ್ತಿಕಾ ಪುಂಜ',
      hi: 'वृषभ — "V" आकार का रोहिणी मुख एवं कृत्तिका तारा-पुंज',
    },
    howToIdentify: {
      en: 'Anchored by blazing crimson-orange Aldebaran (Rohini, the Bull’s Eye) inside the distinct V-shaped Hyades star cluster, with two long horns extending to Elnath & Zeta Tauri and the Pleiades (Krittika) sparkling on its shoulder.',
      kn: 'ಪ್ರಕಾಶಮಾನ ಕೆಂಪು ತಾರೆ ರೋಹಿಣಿ (ಆಲ್ಡೆಬರಾನ್) ಎತ್ತಿನ ಕಣ್ಣಿನಂತೆ ಹೊಳೆಯುತ್ತಾ "V" ಆಕಾರದ ಬಂಡಿಯನ್ನು ರಚಿಸುತ್ತದೆ; ಅದರ ಮೇಲ್ಭಾಗದಲ್ಲಿ ೬ ತಾರೆಗಳ ಕೃತ್ತಿಕಾ (ಪ್ಲಿಯೇಡಿಸ್) ಪುಂಜ ಮಿನುಗುತ್ತದೆ.',
      hi: 'लाल चमकीला रोहिणी तारा (एल्डेबरन) स्पष्ट "V" आकार के मुख में चमकता है, जिसके कंधे पर कृत्तिका (प्लीएडीज़) स्थित है।',
    },
    starHoppingGuide: {
      en: 'Follow the 3 aligned stars of Orion’s Belt upward and to the right — the line points straight at reddish Aldebaran (Rohini), and continuing slightly further hits the Pleiades (Krittika).',
      kn: 'ಆಕಾಶದಲ್ಲಿ ಒರಾಯನ್ (ಮೃಗವ್ಯಾಧ) ನಕ್ಷತ್ರಪುಂಜದ ಸೊಂಟದ ೩ ನೇರ ತಾರೆಗಳ ರೇಖೆಯನ್ನು ಮೇಲ್ಮುಖವಾಗಿ ಹಿಂಬಾಲಿಸಿದರೆ ನೇರವಾಗಿ ಕೆಂಪು ರೋಹಿಣಿ ಮತ್ತು ವೃಷಭ ರಾಶಿ ಸಿಗುತ್ತದೆ.',
      hi: 'ओरायन की बेल्ट के तीन सीधे तारों की रेखा को ऊपर-दाएँ बढ़ाएँ — यह सीधे लाल रोहिणी (वृषभ) तक पहुँचती है।',
    },
    bestViewingMonths: {
      en: 'November – March (Evening Sky)',
      kn: 'ನವೆಂಬರ್ – ಮಾರ್ಚ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'नवंबर – मार्च (रात्रि आकाश)',
    },
    stars: [
      { name: 'Aldebaran (Rohini)', vedicName: 'ರೋಹಿಣಿ', x: 0, y: 4, mag: 0.85, color: '#fb923c', isPrimary: true },
      { name: 'Ain (ε Tau)', x: -6, y: -6, mag: 3.5, color: '#fde047' },
      { name: 'Prima Hyadum (γ)', x: -16, y: 12, mag: 3.6, color: '#fde68a' },
      { name: 'Hyadum II (δ)', x: -11, y: 4, mag: 3.7, color: '#fef08a' },
      { name: 'Elnath (β Tau)', vedicName: 'ಮೃಗಶಿರ ಕೊಂಬು', x: 30, y: -22, mag: 1.65, color: '#93c5fd' },
      { name: 'Tianguan (ζ Tau)', x: 32, y: 8, mag: 3.0, color: '#bae6fd' },
      { name: 'Alcyone (Krittika)', vedicName: 'ಕೃತ್ತಿಕಾ', x: -32, y: -18, mag: 2.85, color: '#60a5fa' },
    ],
    lines: [[6, 1], [1, 3], [3, 2], [2, 0], [1, 4], [0, 5]],
  },
  {
    rashiIndex: 2,
    rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ (Gemini)', hi: 'मिथुन (Gemini)' },
    symbol: '♊',
    element: { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' },
    lord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' },
    raHours: 7.05,
    decDeg: 22.5,
    siderealStartDeg: 60,
    siderealEndDeg: 90,
    shapeTitle: {
      en: 'The Twins — Two Parallel Stick Figures (Punarvasu: Castor & Pollux)',
      kn: 'ಮಿಥುನ (ಅವಳಿಗಳು) — ಕ್ಯಾಸ್ಟರ್ ಮತ್ತು ಪೋಲಕ್ಸ್ ಅವಳಿ ತಾರೆಗಳ ಸಮಾನಾಂತರ ಆಕೃತಿ',
      hi: 'मिथुन — कैस्टर और पोलक्स जुड़वाँ तारों की समानांतर आकृति',
    },
    howToIdentify: {
      en: 'Instantly recognized by the bright twin heads Castor (white) and Pollux (golden-orange) of Punarvasu standing side by side, with two parallel chains of stars stepping down toward Orion.',
      kn: 'ಪುನರ್ವಸು ನಕ್ಷತ್ರದ ಕ್ಯಾಸ್ಟರ್ (ಬಿಳಿ) ಮತ್ತು ಪೋಲಕ್ಸ್ (ಚಿನ್ನದ ಬಣ್ಣ) ಎಂಬ ಎರಡು ಪ್ರಖರ ಅವಳಿ ತಾರೆಗಳು ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ನಿಂತು ಎರಡು ಸಮಾನಾಂತರ ಸಾಲುಗಳನ್ನು ರಚಿಸುತ್ತವೆ.',
      hi: 'पुनर्वसु के दो चमकीले जुड़वाँ तारे कैस्टर और पोलक्स पास-पास चमकते हैं, जिनसे दो समानांतर रेखाएँ नीचे की ओर जाती हैं।',
    },
    starHoppingGuide: {
      en: 'Draw a diagonal line from Orion’s blue foot star Rigel through reddish Betelgeuse (Ardra) and continue the same distance to land right on Castor & Pollux.',
      kn: 'ಒರಾಯನ್ ಪುಂಜದ ಕೆಂಪು ಆರಿದ್ರಾ (ಬೆಟೆಲ್‌ಗ್ಯೂಸ್) ತಾರೆಯಿಂದ ಈಶಾನ್ಯಕ್ಕೆ ಸ್ವಲ್ಪ ಮೇಲೆ ನೋಡಿದರೆ ಮಿಥುನದ ಅವಳಿ ತಾರೆಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಗೋಚರಿಸುತ್ತವೆ.',
      hi: 'ओरायन के आर्द्रा (बेटेलग्यूज़) तारे से उत्तर-पूर्व की ओर देखने पर मिथुन के जुड़वाँ तारे तुरंत दिखते हैं।',
    },
    bestViewingMonths: {
      en: 'December – April (Evening Sky)',
      kn: 'ಡಿಸೆಂಬರ್ – ಏಪ್ರಿಲ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'दिसंबर – अप्रैल (रात्रि आकाश)',
    },
    stars: [
      { name: 'Pollux (β Gem)', vedicName: 'ಪುನರ್ವಸು', x: 24, y: -14, mag: 1.14, color: '#fbbf24', isPrimary: true },
      { name: 'Castor (α Gem)', vedicName: 'ಪುನರ್ವಸು', x: 14, y: -24, mag: 1.58, color: '#e0f2fe', isPrimary: true },
      { name: 'Wasat (δ Gem)', x: 8, y: -2, mag: 3.5, color: '#fef9c3' },
      { name: 'Mebsuta (ε Gem)', x: -8, y: -12, mag: 3.0, color: '#fde047' },
      { name: 'Alhena (γ Gem)', x: -16, y: 18, mag: 1.9, color: '#e2e8f0' },
      { name: 'Tejat (μ Gem)', x: -28, y: 2, mag: 2.9, color: '#fca5a5' },
      { name: 'Mekbuda (ζ Gem)', x: -4, y: 10, mag: 3.8, color: '#fde68a' },
    ],
    lines: [[1, 0], [1, 3], [3, 5], [0, 2], [2, 6], [6, 4]],
  },
  {
    rashiIndex: 3,
    rashiName: { en: 'Karka (Cancer)', kn: 'ಕರ್ಕಾಟಕ (Cancer)', hi: 'कर्क (Cancer)' },
    symbol: '♋',
    element: { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' },
    lord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' },
    raHours: 8.65,
    decDeg: 19.5,
    siderealStartDeg: 90,
    siderealEndDeg: 120,
    shapeTitle: {
      en: 'The Crab — Inverted Y Embracing the Beehive Cluster (Pushya)',
      kn: 'ಕರ್ಕಾಟಕ (ಏಡಿ) — ತಲೆಕೆಳಗಾದ "Y" ಆಕಾರ ಮತ್ತು ಪವಿತ್ರ ಪುಷ್ಯ ಜೇನುಗೂಡು ಪುಂಜ',
      hi: 'कर्क — उल्टा "Y" आकार और मध्य में पुष्य (मधुछत्ता) तारा-पुंज',
    },
    howToIdentify: {
      en: 'Cancer is a delicate inverted-Y constellation nestled between bright Gemini and Leo. At its heart glows the misty Beehive Cluster (M44 — Pushya Nakshatra), visible as a soft silvery cloud on dark nights.',
      kn: 'ಮಿಥುನ ಮತ್ತು ಸಿಂಹ ರಾಶಿಗಳ ನಡುವೆ ತಲೆಕೆಳಗಾದ "Y" ಆಕಾರದಲ್ಲಿರುವ ಮೃದು ತಾರಾ ಸಮೂಹ. ಇದರ ಕೇಂದ್ರದಲ್ಲಿ ಪುಷ್ಯ ನಕ್ಷತ್ರದ ಜೇನುಗೂಡಿನಂತಹ ಮಂಜು ಹೊಳಪು (M44) ಕಾಣುತ್ತದೆ.',
      hi: 'मिथुन और सिंह के बीच स्थित यह उल्टे "Y" जैसा कोमल तारामंडल है, जिसके केंद्र में पुष्य नक्षत्र का मधुछत्ता (M44) चमकता है।',
    },
    starHoppingGuide: {
      en: 'Look exactly halfway between Pollux (Gemini) and Regulus (Leo’s heart). In dark skies you will spot the fuzzy glowing patch of Pushya (Beehive Cluster) right in the middle.',
      kn: 'ಮಿಥುನದ ಪೋಲಕ್ಸ್ ಮತ್ತು ಸಿಂಹದ ಮಘಾ (ರೆಗ್ಯುಲಸ್) ತಾರೆಗಳ ನಡುವಿನ ನಿಖರ ಮಧ್ಯಭಾಗದಲ್ಲಿ ನೋಡಿದರೆ ಕರ್ಕಾಟಕ ಮತ್ತು ಪುಷ್ಯ ಪುಂಜ ಕಾಣಿಸುತ್ತದೆ.',
      hi: 'पोलक्स (मिथुन) और मघा/रेग्युलस (सिंह) के ठीक बीच में देखने पर कर्क और पुष्य तारापुंज दिखाई देता है।',
    },
    bestViewingMonths: {
      en: 'January – May (Evening Sky)',
      kn: 'ಜನವರಿ – ಮೇ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'जनवरी – मई (रात्रि आकाश)',
    },
    stars: [
      { name: 'Asellus Australis (Pushya)', vedicName: 'ಪುಷ್ಯ', x: 0, y: 2, mag: 3.9, color: '#fde047', isPrimary: true },
      { name: 'Asellus Borealis (γ)', vedicName: 'ಪುಷ್ಯ', x: -2, y: -10, mag: 4.6, color: '#e2e8f0' },
      { name: 'Iota Cancri (ι)', x: -4, y: -26, mag: 4.0, color: '#fbbf24' },
      { name: 'Acubens (α Cnc)', vedicName: 'ಆಶ್ಲೇಷಾ', x: 24, y: 18, mag: 4.2, color: '#bae6fd' },
      { name: 'Al Tarf (β Cnc)', x: -26, y: 22, mag: 3.5, color: '#fb923c' },
    ],
    lines: [[2, 1], [1, 0], [0, 3], [0, 4]],
  },
  {
    rashiIndex: 4,
    rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ (Leo)', hi: 'सिंह (Leo)' },
    symbol: '♌',
    element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' },
    lord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' },
    raHours: 10.65,
    decDeg: 15.0,
    siderealStartDeg: 120,
    siderealEndDeg: 150,
    shapeTitle: {
      en: 'The Lion — Backwards Question Mark Sickle (Magha) & Tail Triangle',
      kn: 'ಸಿಂಹ — ಕುಡುಗೋಲು ಆಕಾರದ ಮಘಾ ತಲೆ ಮತ್ತು ತ್ರಿಕೋನ ಬಾಲ (ಉತ್ತರ ಫಲ್ಗುಣಿ)',
      hi: 'सिंह — उल्टे प्रश्नचिह्न (मघा) का सिर और त्रिकोणीय पूँछ',
    },
    howToIdentify: {
      en: 'One of the easiest constellations to recognize! Look for a bold backwards question mark ("Sickle") anchored at the bottom by dazzling blue-white Regulus (Magha), connected to a crisp triangle ending in Denebola (Uttara Phalguni).',
      kn: 'ಆಕಾಶದಲ್ಲಿ ಅತಿ ಸುಲಭವಾಗಿ ಗುರುತಿಸಬಹುದಾದ ರಾಶಿ! ಉಲ್ಟಾ ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ ಅಥವಾ ಕುಡುಗೋಲಿನ ಆಕಾರದ ಸಿಂಹದ ತಲೆಗೆ ಪ್ರಖರ ನೀಲಿ-ಬಿಳಿ ಮಘಾ (ರೆಗ್ಯುಲಸ್) ತಾರೆ ಆಧಾರವಾಗಿದ್ದು, ಹಿಂಭಾಗದಲ್ಲಿ ತ್ರಿಕೋನ ಬಾಲವಿದೆ.',
      hi: 'आसमान में सबसे आसानी से पहचान में आने वाली राशि! उल्टे प्रश्नचिह्न (दरांती) के नीचे चमकीला मघा (रेग्युलस) तारा और पीछे त्रिकोणीय पूँछ डेनेबोला है।',
    },
    starHoppingGuide: {
      en: 'Locate the Big Dipper (Saptarishi Mandala) in the North. Follow the two pointer stars on the Dipper bowl’s side DOWNWARD (opposite to Polaris) — they point directly onto Leo’s Sickle.',
      kn: 'ಉತ್ತರ ಆಕಾಶದ ಸಪ್ತರ್ಷಿ ಮಂಡಲದ (Big Dipper) ಪಾತ್ರೆಯ ಮುಂಭಾಗದ ಎರಡು ತಾರೆಗಳನ್ನು ಧ್ರುವತಾರೆಯ ವಿರುದ್ಧ ದಿಕ್ಕಿನಲ್ಲಿ ಕೆಳಕ್ಕೆ ಹಿಂಬಾಲಿಸಿದರೆ ನೇರವಾಗಿ ಸಿಂಹ ರಾಶಿ ಸಿಗುತ್ತದೆ.',
      hi: 'सप्तर्षि मंडल (बिग डिपर) के कटोरे के दो तारों की रेखा को ध्रुवतारे की विपरीत दिशा में नीचे ले जाने पर सीधे सिंह राशि मिलती है।',
    },
    bestViewingMonths: {
      en: 'February – June (Evening Sky)',
      kn: 'ಫೆಬ್ರವರಿ – ಜೂನ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'फरवरी – जून (रात्रि आकाश)',
    },
    stars: [
      { name: 'Regulus (Magha)', vedicName: 'ಮಘಾ', x: -16, y: 14, mag: 1.35, color: '#93c5fd', isPrimary: true },
      { name: 'Eta Leonis (η)', x: -18, y: 0, mag: 3.5, color: '#e0f2fe' },
      { name: 'Algieba (γ Leo)', x: -14, y: -12, mag: 2.0, color: '#fbbf24' },
      { name: 'Adhafera (ζ Leo)', x: -22, y: -22, mag: 3.4, color: '#fef9c3' },
      { name: 'Rasalas (μ Leo)', x: -32, y: -24, mag: 3.9, color: '#fb923c' },
      { name: 'Algenubi (ε Leo)', x: -36, y: -12, mag: 3.0, color: '#fde047' },
      { name: 'Zosma (Purva Phalguni)', vedicName: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ', x: 14, y: -10, mag: 2.56, color: '#e2e8f0' },
      { name: 'Chertan (θ Leo)', vedicName: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ', x: 12, y: 6, mag: 3.3, color: '#e2e8f0' },
      { name: 'Denebola (Uttara Phalguni)', vedicName: 'ಉತ್ತರ ಫಲ್ಗುಣಿ', x: 36, y: 0, mag: 2.14, color: '#bae6fd', isPrimary: true },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [0, 7], [6, 7], [6, 8], [7, 8]],
  },
  {
    rashiIndex: 5,
    rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ (Virgo)', hi: 'कन्या (Virgo)' },
    symbol: '♍',
    element: { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' },
    lord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' },
    raHours: 13.35,
    decDeg: -4.0,
    siderealStartDeg: 150,
    siderealEndDeg: 180,
    shapeTitle: {
      en: 'The Maiden — Grand Y-Diamond Anchored by Brilliant Spica (Chitra)',
      kn: 'ಕನ್ಯಾ — ದಿವ್ಯ ಮುತ್ತು ಚಿತ್ರಾ (ಸ್ಪೈಕಾ) ತಾರೆಯಿಂದ ಹೊಳೆಯುವ ಭವ್ಯ "Y" ವಜ್ರಾಕೃತಿ',
      hi: 'कन्या — चमकीले चित्रा (स्पाइका) तारे से सुशोभित भव्य "Y" आकृति',
    },
    howToIdentify: {
      en: 'Virgo is a sweeping constellation dominated by dazzling blue-white Spica (Chitra Nakshatra), holding a bowl-like Y-diamond formed by Porrima, Vindemiatrix, and Zavijava, with 5-star Hasta (Corvus) right beside it.',
      kn: 'ನೀಲಿ-ಬಿಳಿ ವಜ್ರದಂತೆ ಮಿನುಗುವ ಚಿತ್ರಾ (ಸ್ಪೈಕಾ) ತಾರೆಯು ಕನ್ಯಾ ರಾಶಿಯ ಪ್ರಧಾನ ಗುರುತು. ಇದರ ಪಕ್ಕದಲ್ಲೇ ೫ ತಾರೆಗಳ ಹಸ್ತ (Corvus) ಪುಂಜ ಮತ್ತು ಪೊರಿಮಾ-ವಿಂಡೆಮಿಯಾಟ್ರಿಕ್ಸ್ ತಾರೆಗಳ ವಿಸ್ತಾರವಾದ "Y" ಆಕೃತಿ ಕಾಣುತ್ತದೆ.',
      hi: 'चमकते नीले-सफ़ेद चित्रा (स्पाइका) तारे से कन्या राशि की पहचान होती है; इसके पास पाँच तारों का हस्त (कॉर्वस) नक्षत्र चमकता है।',
    },
    starHoppingGuide: {
      en: 'Use the classic "Arc to Arcturus, Speed on to Spica": follow the curved handle of the Big Dipper (Saptarishi) to bright orange Arcturus (Swati), then extend the same curve straight to blue-white Spica (Chitra)!',
      kn: 'ಸಪ್ತರ್ಷಿ ಮಂಡಲದ ಬಾಲದ ಬಾಗಿದ ರೇಖೆಯನ್ನು ಮುಂದುವರಿಸಿದರೆ ಮೊದಲು ಕಿತ್ತಳೆ ಬಣ್ಣದ ಸ್ವಾತಿ (ಆರ್ಕ್ಟುರಸ್), ಅದರಿಂದ ಇನ್ನೂ ಮುಂದೆ ನೇರವಾಗಿ ನೀಲಿ-ಬಿಳಿ ಚಿತ್ರಾ (ಸ್ಪೈಕಾ - ಕನ್ಯಾ ರಾಶಿ) ಸಿಗುತ್ತದೆ!',
      hi: 'सप्तर्षि मंडल की पूँछ के मोड़ को आगे बढ़ाएँ — पहले नारंगी स्वाति (आर्क्टुरस) और फिर सीधे नीला-सफ़ेद चित्रा (कन्या राशि) मिलता है।',
    },
    bestViewingMonths: {
      en: 'March – July (Evening Sky)',
      kn: 'ಮಾರ್ಚ್ – ಜುಲೈ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'मार्च – जुलाई (रात्रि आकाश)',
    },
    stars: [
      { name: 'Spica (Chitra)', vedicName: 'ಚಿತ್ತಾ (ಚಿತ್ರಾ)', x: 16, y: 20, mag: 0.97, color: '#60a5fa', isPrimary: true },
      { name: 'Porrima (γ Vir)', x: -4, y: 4, mag: 2.74, color: '#fef9c3' },
      { name: 'Vindemiatrix (ε Vir)', x: 2, y: -22, mag: 2.83, color: '#fbbf24' },
      { name: 'Auva (δ Vir)', x: 8, y: -6, mag: 3.38, color: '#fb923c' },
      { name: 'Heze (ζ Vir)', x: 22, y: 2, mag: 3.37, color: '#e2e8f0' },
      { name: 'Zavijava (β Vir)', x: -30, y: -4, mag: 3.6, color: '#fef08a' },
      { name: 'Zaniah (η Vir)', x: -16, y: 2, mag: 3.9, color: '#e2e8f0' },
    ],
    lines: [[5, 6], [6, 1], [1, 0], [1, 3], [3, 2], [3, 4], [4, 0]],
  },
  {
    rashiIndex: 6,
    rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ (Libra)', hi: 'तुला (Libra)' },
    symbol: '♎',
    element: { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' },
    lord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' },
    raHours: 15.2,
    decDeg: -15.5,
    siderealStartDeg: 180,
    siderealEndDeg: 210,
    shapeTitle: {
      en: 'The Balance Scales — Crisp Diamond Kite of Vishakha',
      kn: 'ತುಲಾ (ತಕ್ಕಡಿ) — ವಿಶಾಖಾ ತಾರೆಗಳ ಸಮತೋಲನ ವಜ್ರಾಕೃತಿ',
      hi: 'तुला (तराज़ू) — विशाखा तारों का संतुलित पतंग/हीरा आकार',
    },
    howToIdentify: {
      en: 'Look for a neat diamond/kite of four moderate stars representing the weighing scales: Zubeneschamali (subtle emerald-white) at the top, Zubenelgenubi to the right, and Brachium below (Vishakha Nakshatra).',
      kn: 'ಕನ್ಯಾ ರಾಶಿಯ ಸ್ಪೈಕಾ ಮತ್ತು ವೃಶ್ಚಿಕದ ಜ್ಯೇಷ್ಠಾ ನಡುವೆ ತಕ್ಕಡಿಯಂತೆ ಸಮತೋಲಿತವಾದ ೪ ವಿಶಾಖಾ ತಾರೆಗಳ ಗಾಳಿಪಟ/ವಜ್ರದ ಆಕಾರದಲ್ಲಿ ತುಲಾ ರಾಶಿ ಕಾಣಿಸುತ್ತದೆ.',
      hi: 'कन्या के चित्रा और वृश्चिक के ज्येष्ठा के बीच तराज़ू के पलड़ों जैसे ४ विशाखा तारों का चतुर्भुज तुला राशि बनाता है।',
    },
    starHoppingGuide: {
      en: 'Look directly between bright blue Spica (Virgo) to the west and fiery red Antares (Scorpio) to the east — Libra’s diamond sits squarely in the middle.',
      kn: 'ಪಶ್ಚಿಮದ ನೀಲಿ ಚಿತ್ರಾ (ಸ್ಪೈಕಾ) ಮತ್ತು ಪೂರ್ವದ ಕೆಂಪು ಜ್ಯೇಷ್ಠಾ (ಆಂಟಾರಿಸ್) ನಡುವಿನ ಮಧ್ಯಭಾಗದಲ್ಲಿ ತುಲಾ ರಾಶಿಯ ತಕ್ಕಡಿ ಆಕಾರವನ್ನು ಸುಲಭವಾಗಿ ಗುರುತಿಸಬಹುದು.',
      hi: 'पश्चिम में नीले चित्रा (स्पाइका) और पूर्व में लाल ज्येष्ठा (एंटारेस) के ठीक बीच में तुला राशि स्थित है।',
    },
    bestViewingMonths: {
      en: 'April – August (Evening Sky)',
      kn: 'ಏಪ್ರಿಲ್ – ಆಗಸ್ಟ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'अप्रैल – अगस्त (रात्रि आकाश)',
    },
    stars: [
      { name: 'Zubeneschamali (β Lib)', vedicName: 'ವಿಶಾಖಾ ಉತ್ತರ', x: 0, y: -22, mag: 2.61, color: '#6ee7b7', isPrimary: true },
      { name: 'Zubenelgenubi (α Lib)', vedicName: 'ವಿಶಾಖಾ ದಕ್ಷಿಣ', x: -24, y: 0, mag: 2.75, color: '#e2e8f0', isPrimary: true },
      { name: 'Brachium (σ Lib)', x: -16, y: 24, mag: 3.29, color: '#fca5a5' },
      { name: 'Zubenelhakrabi (γ Lib)', x: 24, y: -2, mag: 3.91, color: '#fde047' },
      { name: 'Upsilon Librae (υ)', x: 22, y: 20, mag: 3.6, color: '#fb923c' },
    ],
    lines: [[0, 1], [0, 3], [1, 3], [1, 2], [3, 4]],
  },
  {
    rashiIndex: 7,
    rashiName: { en: 'Vrischika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ (Scorpio)', hi: 'वृश्चिक (Scorpio)' },
    symbol: '♏',
    element: { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' },
    lord: { en: 'Mars (Kuja)', kn: 'ಕುಜ (ಮಂಗಳ)', hi: 'मंगल' },
    raHours: 16.9,
    decDeg: -27.5,
    siderealStartDeg: 210,
    siderealEndDeg: 240,
    shapeTitle: {
      en: 'The Scorpion — Iconic Fishhook Tail (Moola) & Ruby Heart Antares (Jyeshtha)',
      kn: 'ವೃಶ್ಚಿಕ (ಚೇಳು) — ಕೆಂಪು ಹೃದಯ ಜ್ಯೇಷ್ಠಾ ಮತ್ತು ಬಾಗಿದ ಬಾಲದ ಮೂಲಾ ಪುಂಜ',
      hi: 'वृश्चिक — लाल हृदय ज्येष्ठा (एंटारेस) और मुड़ी पूँछ (मूल नक्षत्र)',
    },
    howToIdentify: {
      en: 'Unmistakable in the southern sky! Three vertical stars form its forehead claws (Anuradha), blazing ruby-red Antares (Jyeshtha) beats as its heart, and a sweeping J-shaped scorpion tail curls up to Shaula (Moola).',
      kn: 'ದಕ್ಷಿಣ ಆಕಾಶದಲ್ಲಿ ಅತ್ಯಂತ ಸ್ಪಷ್ಟವಾಗಿ ಚೇಳಿನಂತೆಯೇ ಕಾಣುವ ರಾಶಿ! ಮುಂಭಾಗದಲ್ಲಿ ೩ ರಕ್ಷಕ ತಾರೆಗಳು (ಅನುರಾಧಾ), ಹೃದಯದಲ್ಲಿ ಪ್ರಖರ ಕೆಂಪು ಜ್ಯೇಷ್ಠಾ (ಆಂಟಾರಿಸ್), ಮತ್ತು ಕೆಳಗೆ "J" ಆಕಾರದಲ್ಲಿ ಬಾಗಿದ ಬಾಲ (ಮೂಲಾ) ಹೊಳೆಯುತ್ತದೆ.',
      hi: 'दक्षिणी आकाश में हूबहू बिच्छू जैसी आकृति! आगे तीन सीधी पंक्ति के तारे (अनुराधा), हृदय में लाल ज्येष्ठा (एंटारेस) और नीचे "J" आकार की मुड़ी पूँछ (मूल) चमकती है।',
    },
    starHoppingGuide: {
      en: 'Look toward the Southern sky during summer evenings: bright glowing red Antares immediately catches the eye inside the Milky Way band, with the curving tail dipping right below it.',
      kn: 'ಬೇಸಿಗೆ ಮತ್ತು ಮುಂಗಾರು ಸಂಜೆಯಲ್ಲಿ ದಕ್ಷಿಣ ಆಕಾಶದಲ್ಲಿ ನೋಡಿದಾಗ ಆಕಾಶಗಂಗೆಯ ಪಟ್ಟಿಯಲ್ಲೇ ಕೆಂಪು ಜ್ಯೇಷ್ಠಾ ತಾರೆ ಮತ್ತು ಬಾಗಿದ ಚೇಳಿನ ಬಾಲ ತಕ್ಷಣ ಕಣ್ಣಿಗೆ ಬೀಳುತ್ತದೆ.',
      hi: 'ग्रीष्म ऋतु की शाम को दक्षिण आकाश में देखने पर आकाशगंगा के बीच लाल ज्येष्ठा तारा और नीचे मुड़ी हुई पूँछ तुरंत दिखाई देती है।',
    },
    bestViewingMonths: {
      en: 'May – September (Evening Sky)',
      kn: 'ಮೇ – ಸೆಪ್ಟೆಂಬರ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'मई – सितंबर (रात्रि आकाश)',
    },
    stars: [
      { name: 'Antares (Jyeshtha)', vedicName: 'ಜ್ಯೇಷ್ಠಾ', x: -6, y: -6, mag: 0.96, color: '#ef4444', isPrimary: true },
      { name: 'Dschubba (Anuradha)', vedicName: 'ಅನುರಾಧಾ', x: -24, y: -14, mag: 2.3, color: '#93c5fd' },
      { name: 'Acrab (β Sco)', vedicName: 'ಅನುರಾಧಾ', x: -22, y: -24, mag: 2.6, color: '#bae6fd' },
      { name: 'Fang (π Sco)', vedicName: 'ಅನುರಾಧಾ', x: -24, y: -2, mag: 2.9, color: '#93c5fd' },
      { name: 'Larawag (ε Sco)', x: 2, y: 12, mag: 2.29, color: '#fb923c' },
      { name: 'Sargas (θ Sco)', x: 16, y: 26, mag: 1.86, color: '#fef08a' },
      { name: 'Shaula (Moola)', vedicName: 'ಮೂಲಾ', x: 30, y: 16, mag: 1.62, color: '#60a5fa', isPrimary: true },
      { name: 'Lesath (υ Sco)', vedicName: 'ಮೂಲಾ', x: 26, y: 10, mag: 2.7, color: '#93c5fd' },
    ],
    lines: [[2, 1], [1, 3], [1, 0], [0, 4], [4, 5], [5, 6], [6, 7]],
  },
  {
    rashiIndex: 8,
    rashiName: { en: 'Dhanus (Sagittarius)', kn: 'ಧನುಸ್ಸು (Sagittarius)', hi: 'धनु (Sagittarius)' },
    symbol: '♐',
    element: { en: 'Fire (Agni)', kn: 'ಅಗ್ನಿ ತತ್ವ', hi: 'अग्नि तत्व' },
    lord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' },
    raHours: 19.0,
    decDeg: -26.0,
    siderealStartDeg: 240,
    siderealEndDeg: 270,
    shapeTitle: {
      en: 'The Archer — Famous "Teapot" Asterism (Purvashadha & Uttarashadha)',
      kn: 'ಧನುಸ್ಸು (ಬಿಲ್ಲು) — ಆಕಾಶಗಂಗೆಯ ದಿಕ್ಕಿನಲ್ಲಿರುವ ಪ್ರಸಿದ್ಧ "ಚಹಾ ಪಾತ್ರೆ / ಬಿಲ್ಲು" ಪುಂಜ',
      hi: 'धनु — आकाशगंगा के केंद्र की ओर प्रसिद्ध "टीपॉट / धनुष" आकृति',
    },
    howToIdentify: {
      en: 'Look for the unmistakable "Teapot" shape sitting directly in the brightest core of the Milky Way! Kaus Australis & Kaus Media (Purvashadha) form its bow/spout, while Nunki & Ascella (Uttarashadha) form its handle.',
      kn: 'ವೃಶ್ಚಿಕದ ಬಾಲದ ಪೂರ್ವಕ್ಕೆ ಆಕಾಶಗಂಗೆಯ ಅತಿ ಪ್ರಕಾಶಮಾನ ಕೇಂದ್ರದಲ್ಲಿ ಬಿಲ್ಲು ಅಥವಾ "ಚಹಾ ಪಾತ್ರೆ" (Teapot) ಆಕಾರದಲ್ಲಿ ಪೂರ್ವಾಷಾಢ ಮತ್ತು ಉತ್ತರಾಷಾಢ ತಾರೆಗಳು ಹೊಳೆಯುತ್ತವೆ.',
      hi: 'वृश्चिक की पूँछ के ठीक पूर्व में आकाशगंगा के सबसे चमकीले भाग में धनुष या "चायदानी" (टीपॉट) के आकार में पूर्वाषाढ़ा और उत्तराषाढ़ा तारे दिखते हैं।',
    },
    starHoppingGuide: {
      en: 'Find the curved sting (Moola) of Scorpio first — immediately to its East (left), the Teapot spout of Sagittarius pours straight toward Scorpio’s tail!',
      kn: 'ಮೊದಲು ವೃಶ್ಚಿಕ ರಾಶಿಯ ಬಾಗಿದ ಬಾಲವನ್ನು (ಮೂಲಾ) ಗುರುತಿಸಿ; ಅದರ ತಕ್ಷಣದ ಪೂರ್ವದಲ್ಲಿ ಧನುಸ್ಸಿನ ಚಹಾ ಪಾತ್ರೆ / ಬಿಲ್ಲಿನ ಆಕಾರ ಕಾಣುತ್ತದೆ.',
      hi: 'पहले वृश्चिक की पूँछ (मूल) खोजें — उसके तुरंत पूर्व (बाएँ) धनु राशि का टीपॉट/धनुष स्पष्ट दिखाई देता है।',
    },
    bestViewingMonths: {
      en: 'June – October (Evening Sky)',
      kn: 'ಜೂನ್ – ಅಕ್ಟೋಬರ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'जून – अक्टूबर (रात्रि आकाश)',
    },
    stars: [
      { name: 'Kaus Australis (ε Sgr)', vedicName: 'ಪೂರ್ವಾಷಾಢ', x: -16, y: 18, mag: 1.79, color: '#93c5fd', isPrimary: true },
      { name: 'Kaus Media (δ Sgr)', vedicName: 'ಪೂರ್ವಾಷಾಢ', x: -14, y: 2, mag: 2.7, color: '#fb923c' },
      { name: 'Kaus Borealis (λ Sgr)', x: -4, y: -18, mag: 2.8, color: '#fbbf24' },
      { name: 'Alnasl (γ Sgr)', x: -30, y: 8, mag: 2.98, color: '#fde047' },
      { name: 'Nunki (Uttarashadha)', vedicName: 'ಉತ್ತರಾಷಾಢ', x: 24, y: -10, mag: 2.05, color: '#60a5fa', isPrimary: true },
      { name: 'Ascella (ζ Sgr)', vedicName: 'ಉತ್ತರಾಷಾಢ', x: 14, y: 16, mag: 2.6, color: '#e2e8f0' },
      { name: 'Phi Sagittarii (φ)', x: 6, y: -2, mag: 3.17, color: '#bae6fd' },
      { name: 'Tau Sagittarii (τ)', x: 28, y: 8, mag: 3.3, color: '#fb923c' },
    ],
    lines: [[3, 1], [3, 0], [0, 1], [1, 2], [2, 6], [6, 4], [4, 7], [7, 5], [5, 0], [6, 5]],
  },
  {
    rashiIndex: 9,
    rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ (Capricorn)', hi: 'मकर (Capricorn)' },
    symbol: '♑',
    element: { en: 'Earth (Prithvi)', kn: 'ಪೃಥ್ವಿ ತತ್ವ', hi: 'पृथ्वी तत्व' },
    lord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' },
    raHours: 21.0,
    decDeg: -18.0,
    siderealStartDeg: 270,
    siderealEndDeg: 300,
    shapeTitle: {
      en: 'The Sea-Goat — Broad Smiling Triangle / Boomerang (Beneath Shravana)',
      kn: 'ಮಕರ — ಶ್ರವಣ ತಾರೆಯ ಕೆಳಗಿರುವ ವಿಶಾಲ ತ್ರಿಕೋನ / ಹಸನ್ಮುಖ ಬೂಮರಾಂಗ್ ಆಕಾರ',
      hi: 'मकर — श्रवण तारे के नीचे फैला हुआ विशाल त्रिकोण / मुस्कान आकृति',
    },
    howToIdentify: {
      en: 'Capricorn forms a large, graceful V-shaped triangle or smiling boat in the southern sky, with optical double Algedi & Dabih at the western corner and Deneb Algedi at the eastern tip.',
      kn: 'ದಕ್ಷಿಣ ಆಕಾಶದಲ್ಲಿ ಹಡಗಿನ ಅಥವಾ ವಿಶಾಲ ತ್ರಿಕೋನದ ಆಕಾರದಲ್ಲಿ ಮಕರ ರಾಶಿ ಹರಡಿದ್ದು, ಪಶ್ಚಿಮ ತುದಿಯಲ್ಲಿ ಅಲ್ಗೆಡಿ-ದಾಬಿಹ್ ಮತ್ತು ಪೂರ್ವ ತುದಿಯಲ್ಲಿ ಡೆನೆಬ್ ಅಲ್ಗೆಡಿ ತಾರೆಗಳಿವೆ.',
      hi: 'दक्षिण आकाश में बड़ी नाव या त्रिकोण की तरह फैली मकर राशि के पश्चिमी कोने पर अल्गेडी-दाबिह और पूर्वी कोने पर डेनेब अल्गेडी हैं।',
    },
    starHoppingGuide: {
      en: 'Find dazzling white Altair (Shravana) flanked by its two tight companion stars in Aquila — look straight South (downward) from Altair to land directly inside Capricorn’s triangle.',
      kn: 'ಆಕಾಶದಲ್ಲಿ ಮೂರು ಹೆಜ್ಜೆಗಳಂತಿರುವ ಪ್ರಖರ ಶ್ರವಣ (ಆಲ್ಟೇರ್) ತಾರೆಯನ್ನು ಗುರುತಿಸಿ; ಅದರ ನೇರ ದಕ್ಷಿಣಕ್ಕೆ (ಕೆಳಭಾಗದಲ್ಲಿ) ಮಕರ ರಾಶಿಯ ತ್ರಿಕೋನ ಆಕೃತಿ ಕಾಣಿಸುತ್ತದೆ.',
      hi: 'आकाश में तीन सीधे तारों वाले चमकीले श्रवण (ऑल्टेयर) तारे को खोजें — उसके ठीक दक्षिण (नीचे) मकर राशि का त्रिकोण स्थित है।',
    },
    bestViewingMonths: {
      en: 'August – November (Evening Sky)',
      kn: 'ಆಗಸ್ಟ್ – ನವೆಂಬರ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'अगस्त – नवंबर (रात्रि आकाश)',
    },
    stars: [
      { name: 'Deneb Algedi (δ Cap)', vedicName: 'ಧನಿಷ್ಠಾ ಸಮೀಪ', x: 30, y: -12, mag: 2.85, color: '#e2e8f0', isPrimary: true },
      { name: 'Nashira (γ Cap)', x: 20, y: -8, mag: 3.69, color: '#fef9c3' },
      { name: 'Dabih (β Cap)', x: -26, y: -10, mag: 3.05, color: '#fbbf24', isPrimary: true },
      { name: 'Algedi (α Cap)', x: -30, y: -18, mag: 3.58, color: '#fde047' },
      { name: 'Omega Cap (ω)', x: -8, y: 22, mag: 4.1, color: '#fca5a5' },
      { name: 'Zeta Cap (ζ)', x: 8, y: 14, mag: 3.77, color: '#fde68a' },
      { name: 'Theta Cap (θ)', x: 2, y: -6, mag: 4.07, color: '#e0f2fe' },
    ],
    lines: [[3, 2], [2, 6], [6, 1], [1, 0], [0, 5], [5, 4], [4, 2]],
  },
  {
    rashiIndex: 10,
    rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ (Aquarius)', hi: 'कुम्भ (Aquarius)' },
    symbol: '♒',
    element: { en: 'Air (Vayu)', kn: 'ವಾಯು ತತ್ವ', hi: 'वायु तत्व' },
    lord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' },
    raHours: 22.5,
    decDeg: -10.5,
    siderealStartDeg: 300,
    siderealEndDeg: 330,
    shapeTitle: {
      en: 'The Water-Bearer — Distinct "Y" Water Jar (Shatabhisha) Pouring Stars',
      kn: 'ಕುಂಭ (ಕೊಡ) — ಶತಭಿಷಾ ತಾರೆಯ "Y" ಆಕಾರದ ಜಲಕಲಶ ಮತ್ತು ಹರಿಯುವ ತಾರಾಧಾರೆ',
      hi: 'कुम्भ — शतभिषा नक्षत्र का "Y" आकार का जलकलश और बहती तारों की धारा',
    },
    howToIdentify: {
      en: 'Look for the signature "Water Jar" — a compact Y-shaped asterism of 4 stars centered on Zeta Aquarii with Sadachbia (Shatabhisha) right alongside, flanked by Sadalmelik & Sadalsuud pouring a stream of stars toward bright Fomalhaut.',
      kn: 'ಶತಭಿಷಾ ನಕ್ಷತ್ರದ ಬಳಿ "Y" ಆಕಾರದಲ್ಲಿರುವ ಪುಟ್ಟ ಜಲಕಲಶ (Water Jar) ಕುಂಭ ರಾಶಿಯ ಪ್ರಮುಖ ಗುರುತು. ಸದಲ್‌ಮೆಲಿಕ್ ಮತ್ತು ಸದಲ್‌ಸೂದ್ ತಾರೆಗಳಿಂದ ದಕ್ಷಿಣದ ಫೋಮಲ್‌ಹಾಟ್ ಕಡೆಗೆ ನೀರಿನ ಧಾರೆಯಂತೆ ತಾರೆಗಳು ಹರಿಯುತ್ತವೆ.',
      hi: 'शतभिषा नक्षत्र के पास छोटे "Y" आकार का जलकलश कुम्भ राशि की पहचान है, जिससे दक्षिण के चमकीले फोमलहाट तारे की ओर तारों की धारा बहती है।',
    },
    starHoppingGuide: {
      en: 'Find the giant Great Square of Pegasus (Purva/Uttara Bhadrapada) high in autumn skies; look directly South of the Square’s western side to spot the Y-shaped Water Jar of Aquarius.',
      kn: 'ಶರತ್ಕಾಲದ ಆಕಾಶದಲ್ಲಿ ದೊಡ್ಡ ಚೌಕಾಕಾರದ ಪೆಗಾಸಸ್ (ಭಾದ್ರಪದ) ಮಂಡಲವನ್ನು ಗುರುತಿಸಿ; ಅದರ ನೇರ ದಕ್ಷಿಣದಲ್ಲಿ ಕುಂಭ ರಾಶಿಯ "Y" ಆಕಾರದ ಜಲಕಲಶ ಕಾಣಿಸುತ್ತದೆ.',
      hi: 'पेगासस के विशाल चौकोर (भाद्रपद) के ठीक दक्षिण में देखने पर कुम्भ राशि का "Y" आकार का कलश दिखाई देता है।',
    },
    bestViewingMonths: {
      en: 'August – December (Evening Sky)',
      kn: 'ಆಗಸ್ಟ್ – ಡಿಸೆಂಬರ್ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'अगस्त – दिसंबर (रात्रि आकाश)',
    },
    stars: [
      { name: 'Sadalsuud (β Aqr)', x: -28, y: -4, mag: 2.9, color: '#fde047', isPrimary: true },
      { name: 'Sadalmelik (α Aqr)', x: -8, y: -16, mag: 2.95, color: '#fbbf24', isPrimary: true },
      { name: 'Sadachbia (Shatabhisha)', vedicName: 'ಶತಭಿಷಾ', x: 4, y: -12, mag: 3.86, color: '#bae6fd' },
      { name: 'Water Jar Center (ζ)', x: 10, y: -8, mag: 3.65, color: '#e2e8f0' },
      { name: 'Eta Aqr (η)', x: 18, y: -4, mag: 4.0, color: '#93c5fd' },
      { name: 'Pi Aqr (π)', x: 12, y: -18, mag: 4.5, color: '#bae6fd' },
      { name: 'Skat (δ Aqr)', x: 24, y: 18, mag: 3.27, color: '#e0f2fe' },
      { name: 'Ancha (θ Aqr)', x: -4, y: 6, mag: 4.17, color: '#fde68a' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 5], [3, 4], [1, 7], [7, 6], [4, 6]],
  },
  {
    rashiIndex: 11,
    rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ (Pisces)', hi: 'मीन (Pisces)' },
    symbol: '♓',
    element: { en: 'Water (Jala)', kn: 'ಜಲ ತತ್ವ', hi: 'जल तत्व' },
    lord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' },
    raHours: 0.75,
    decDeg: 11.5,
    siderealStartDeg: 330,
    siderealEndDeg: 360,
    shapeTitle: {
      en: 'The Two Fishes — V-Shaped Cord Tied at Alrescha with Western Circlet (Revati)',
      kn: 'ಮೀನ (ಜೋಡಿ ಮೀನುಗಳು) — ಅಲ್‌ರೇಶಾ ಗಂಟಿನಿಂದ ಕಟ್ಟಿದ "V" ದಾರ ಮತ್ತು ರೇವತಿ ವೃತ್ತ',
      hi: 'मीन (दो मछलियाँ) — अलरेशा गाँठ से जुड़ी "V" डोरी और रेवती वृत्त',
    },
    howToIdentify: {
      en: 'Pisces forms a wide V-shape of delicate stars: two ribbons meet at the knot star Alrescha, leading west to the neat pentagon "Circlet" (Western Fish, Revati) and north to the smaller Northern Fish.',
      kn: 'ಅಲ್‌ರೇಶಾ ತಾರೆಯ ಗಂಟಿನಿಂದ ಎರಡು ದಾರಗಳು "V" ಆಕಾರದಲ್ಲಿ ಹರಡಿ, ಪಶ್ಚಿಮದಲ್ಲಿ ವೃತ್ತಾಕಾರದ ಮೀನು (ರೇವತಿ ನಕ್ಷತ್ರ) ಮತ್ತು ಉತ್ತರದಲ್ಲಿ ಮತ್ತೊಂದು ಮೀನಿನ ಆಕೃತಿಯನ್ನು ರಚಿಸುತ್ತವೆ.',
      hi: 'अलरेशा तारे की गाँठ से दो रेखाएँ "V" आकार में फैलकर पश्चिम में वृत्ताकार मछली (रेवती) और उत्तर में दूसरी मछली बनाती हैं।',
    },
    starHoppingGuide: {
      en: 'Locate the huge Great Square of Pegasus (Purva & Uttara Bhadrapada): Pisces wraps directly around the South and East sides of the Square, with its Circlet tucked just beneath the Square’s bottom edge.',
      kn: 'ಪೆಗಾಸಸ್ ಚೌಕದ (ಪೂರ್ವಾಭಾದ್ರ - ಉತ್ತರಾಭಾದ್ರ) ದಕ್ಷಿಣ ಮತ್ತು ಪೂರ್ವ ಅಂಚುಗಳನ್ನು ಸುತ್ತುವರಿದಂತೆ ಮೀನ ರಾಶಿಯ ಎರಡು ಮೀನುಗಳು ಮತ್ತು ರೇವತಿ ವೃತ್ತ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸುತ್ತವೆ.',
      hi: 'पेगासस के विशाल चौकोर (भाद्रपद) की दक्षिणी और पूर्वी भुजाओं को घेरते हुए मीन राशि और रेवती वृत्त स्थित हैं।',
    },
    bestViewingMonths: {
      en: 'September – January (Evening Sky)',
      kn: 'ಸೆಪ್ಟೆಂಬರ್ – ಜನವರಿ (ರಾತ್ರಿ ಆಕಾಶ)',
      hi: 'सितंबर – जनवरी (रात्रि आकाश)',
    },
    stars: [
      { name: 'Alrescha (α Psc)', vedicName: 'ಮೀನ ಗಂಟು', x: 24, y: 18, mag: 3.82, color: '#bae6fd', isPrimary: true },
      { name: 'Kullat Nunu (η Psc)', x: 28, y: -4, mag: 3.62, color: '#fbbf24' },
      { name: 'Northern Fish (τ)', x: 18, y: -22, mag: 4.5, color: '#fde68a' },
      { name: 'Revati (ζ Psc)', vedicName: 'ರೇವತಿ', x: 8, y: 10, mag: 5.2, color: '#fef08a', isPrimary: true },
      { name: 'Omega Psc (ω)', x: -10, y: 8, mag: 4.0, color: '#e2e8f0' },
      { name: 'Circlet Top (ι Psc)', x: -22, y: -2, mag: 4.13, color: '#fef9c3' },
      { name: 'Circlet West (γ Psc)', x: -34, y: 6, mag: 3.7, color: '#fbbf24' },
      { name: 'Circlet South (κ Psc)', x: -24, y: 16, mag: 4.9, color: '#e0f2fe' },
    ],
    lines: [[2, 1], [1, 0], [0, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]],
  },
];

const COMPASS_16: Array<{ code: string; en: string; kn: string; hi: string }> = [
  { code: 'N', en: 'North', kn: 'ಉತ್ತರ (North)', hi: 'उत्तर (N)' },
  { code: 'NNE', en: 'North-Northeast', kn: 'ಉತ್ತರ-ಈಶಾನ್ಯ (NNE)', hi: 'उत्तर-ईशान (NNE)' },
  { code: 'NE', en: 'North-East', kn: 'ಈಶಾನ್ಯ (North-East)', hi: 'ईशान / उत्तर-पूर्व (NE)' },
  { code: 'ENE', en: 'East-Northeast', kn: 'ಪೂರ್ವ-ಈಶಾನ್ಯ (ENE)', hi: 'पूर्व-ईशान (ENE)' },
  { code: 'E', en: 'East', kn: 'ಪೂರ್ವ (East)', hi: 'पूर्व (E)' },
  { code: 'ESE', en: 'East-Southeast', kn: 'ಪೂರ್ವ-ಆಗ್ನೇಯ (ESE)', hi: 'पूर्व-आग्नेय (ESE)' },
  { code: 'SE', en: 'South-East', kn: 'ಆಗ್ನೇಯ (South-East)', hi: 'आग्नेय / दक्षिण-पूर्व (SE)' },
  { code: 'SSE', en: 'South-Southeast', kn: 'ದಕ್ಷಿಣ-ಆಗ್ನೇಯ (SSE)', hi: 'दक्षिण-आग्नेय (SSE)' },
  { code: 'S', en: 'South', kn: 'ದಕ್ಷಿಣ (South)', hi: 'दक्षिण (S)' },
  { code: 'SSW', en: 'South-Southwest', kn: 'ದಕ್ಷಿಣ-ನೈಋತ್ಯ (SSW)', hi: 'दक्षिण-नैऋत्य (SSW)' },
  { code: 'SW', en: 'South-West', kn: 'ನೈಋತ್ಯ (South-West)', hi: 'नैऋत्य / दक्षिण-पश्चिम (SW)' },
  { code: 'WSW', en: 'West-Southwest', kn: 'ಪಶ್ಚಿಮ-ನೈಋತ್ಯ (WSW)', hi: 'पश्चिम-नैऋत्य (WSW)' },
  { code: 'W', en: 'West', kn: 'ಪಶ್ಚಿಮ (West)', hi: 'पश्चिम (W)' },
  { code: 'WNW', en: 'West-Northwest', kn: 'ಪಶ್ಚಿಮ-ವಾಯವ್ಯ (WNW)', hi: 'पश्चिम-वायव्य (WNW)' },
  { code: 'NW', en: 'North-West', kn: 'ವಾಯವ್ಯ (North-West)', hi: 'वायव्य / उत्तर-पश्चिम (NW)' },
  { code: 'NNW', en: 'North-Northwest', kn: 'ಉತ್ತರ-ವಾಯವ್ಯ (NNW)', hi: 'उत्तर-वायव्य (NNW)' },
];

/**
 * Computes true astronomical Altitude, Azimuth, and Compass Direction ("Look North-East")
 * for any of the 12 Zodiac Rashi constellations from the observer's exact city, date, and time.
 */
export function computeRashiSkyPosition(
  rashiIndex: number,
  dateStr: string,
  timeStr: string,
  location: CityLocation
): RashiSkyPosition {
  const info = RASHI_CONSTELLATIONS[rashiIndex] || RASHI_CONSTELLATIONS[0];
  const dt = parseDateInCityTimezone(`${dateStr}T${timeStr || '21:00'}`, location);

  // Julian Date
  const jd = dt.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0;
  const T = d / 36525.0;

  // Greenwich Mean Sidereal Time in degrees (IAU formula)
  let gmstDeg =
    280.46061837 +
    360.98564736629 * d +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  gmstDeg = ((gmstDeg % 360) + 360) % 360;

  // Local Sidereal Time in degrees
  const lstDeg = (((gmstDeg + location.lng) % 360) + 360) % 360;
  const raDeg = info.raHours * 15;

  // Local Hour Angle (HA) in radians
  let haDeg = lstDeg - raDeg;
  if (haDeg < -180) haDeg += 360;
  if (haDeg > 180) haDeg -= 360;

  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;
  const latRad = location.lat * deg2rad;
  const decRad = info.decDeg * deg2rad;
  const haRad = haDeg * deg2rad;

  // Altitude (elevation above horizon)
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const altitudeDeg = Math.round(altRad * rad2deg);

  // Azimuth (0° = North, 90° = East, 180° = South, 270° = West)
  const cosAlt = Math.cos(altRad);
  let azDeg = 0;
  if (Math.abs(cosAlt) > 1e-6) {
    const sinAz = (-Math.sin(haRad) * Math.cos(decRad)) / cosAlt;
    const cosAz =
      (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) /
      (cosAlt * Math.cos(latRad));
    azDeg = ((Math.atan2(sinAz, cosAz) * rad2deg) % 360 + 360) % 360;
  }
  const azimuthDeg = Math.round(azDeg);

  const sectorIdx = Math.floor(((azimuthDeg + 11.25) % 360) / 22.5);
  const compass = COMPASS_16[sectorIdx] || COMPASS_16[0];

  // Approximate hours until culmination (transit across local meridian)
  const hoursToCulmination = (((raDeg - lstDeg) % 360) + 360) % 360 / 15;
  const approxLocalHour = Math.round((dt.getHours() + hoursToCulmination) % 24);
  const formattedCulm = `${String(approxLocalHour).padStart(2, '0')}:00`;

  let visibilityStatus: 'high' | 'rising_or_low' | 'below_horizon' = 'below_horizon';
  let visibilityLabel: LocalizedString;
  let directionAdvice: LocalizedString;

  if (altitudeDeg >= 25) {
    visibilityStatus = 'high';
    visibilityLabel = {
      en: `Clearly Visible (${altitudeDeg}° above horizon)`,
      kn: `ಆಕಾಶದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಗೋಚರ (ದಿಗಂತದಿಂದ ${altitudeDeg}° ಎತ್ತರ)`,
      hi: `आकाश में स्पष्ट दृश्य (क्षितिज से ${altitudeDeg}° ऊपर)`,
    };
    directionAdvice = {
      en: `Look ${compass.en} (${compass.code}, ${azimuthDeg}°) — high in the sky at ${altitudeDeg}° elevation.`,
      kn: `${compass.kn} (${azimuthDeg}°) ದಿಕ್ಕಿನಲ್ಲಿ ಮೇಲ್ಮುಖವಾಗಿ ${altitudeDeg}° ಎತ್ತರದಲ್ಲಿ ನೋಡಿ.`,
      hi: `${compass.hi} (${azimuthDeg}°) दिशा में क्षितिज से ${altitudeDeg}° ऊपर देखें।`,
    };
  } else if (altitudeDeg >= 2) {
    visibilityStatus = 'rising_or_low';
    const motionEn = haDeg < 0 ? 'Rising' : 'Setting';
    const motionKn = haDeg < 0 ? 'ಉದಯಿಸುತ್ತಿದೆ' : 'ಅಸ್ತವಾಗುತ್ತಿದೆ';
    const motionHi = haDeg < 0 ? 'उदय हो रही है' : 'अस्त हो रही है';
    visibilityLabel = {
      en: `${motionEn} Low on Horizon (${altitudeDeg}°)`,
      kn: `ದಿಗಂತದ ಬಳಿ ${motionKn} (${altitudeDeg}°)`,
      hi: `क्षितिज के पास ${motionHi} (${altitudeDeg}°)`,
    };
    directionAdvice = {
      en: `Look ${compass.en} (${compass.code}, ${azimuthDeg}°) near the horizon (${altitudeDeg}° up, ${motionEn.toLowerCase()}).`,
      kn: `${compass.kn} (${azimuthDeg}°) ದಿಗಂತದ ಹತ್ತಿರ (${altitudeDeg}° ಎತ್ತರ, ${motionKn}) ನೋಡಿ.`,
      hi: `${compass.hi} (${azimuthDeg}°) दिशा में क्षितिज के निकट (${altitudeDeg}° ऊपर) देखें।`,
    };
  } else {
    visibilityStatus = 'below_horizon';
    visibilityLabel = {
      en: `Below Horizon Now (${altitudeDeg}°) — Rises in East`,
      kn: `ಪ್ರಸ್ತುತ ದಿಗಂತದ ಕೆಳಗಿದೆ (${altitudeDeg}°) — ಪೂರ್ವದಲ್ಲಿ ಉದಯಿಸುತ್ತದೆ`,
      hi: `अभी क्षितिज से नीचे (${altitudeDeg}°) — पूर्व में उदय होगी`,
    };
    directionAdvice = {
      en: `Currently below the ${compass.en} horizon (${altitudeDeg}°). It rises in the East and peaks highest around ${formattedCulm} local time (Best months: ${info.bestViewingMonths.en}).`,
      kn: `ಪ್ರಸ್ತುತ ${compass.kn} ದಿಗಂತದ ಕೆಳಗಿದೆ (${altitudeDeg}°). ಇದು ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ಉದಯಿಸಿ ಸುಮಾರು ${formattedCulm} ಕ್ಕೆ ಆಕಾಶದ ಶೃಂಗದಲ್ಲಿರುತ್ತದೆ (ಉತ್ತಮ ತಿಂಗಳು: ${info.bestViewingMonths.kn}).`,
      hi: `यह अभी ${compass.hi} क्षितिज के नीचे (${altitudeDeg}°) है। यह पूर्व में उदय होकर लगभग ${formattedCulm} पर शीर्ष पर दिखेगी।`,
    };
  }

  return {
    rashiIndex,
    altitudeDeg,
    azimuthDeg,
    compassCode: compass.code,
    compassLabel: { en: compass.en, kn: compass.kn, hi: compass.hi },
    directionAdvice,
    visibilityStatus,
    visibilityLabel,
    culminationHint: {
      en: `Peaks highest near ${formattedCulm} local time`,
      kn: `ಸುಮಾರು ${formattedCulm} ಕ್ಕೆ ಆಕಾಶದ ಶೃಂಗದಲ್ಲಿ`,
      hi: `लगभग ${formattedCulm} पर आकाश के शीर्ष पर`,
    },
  };
}

export function getAllRashisSkyPositions(
  dateStr: string,
  timeStr: string,
  location: CityLocation
): RashiSkyPosition[] {
  return RASHI_CONSTELLATIONS.map((r) =>
    computeRashiSkyPosition(r.rashiIndex, dateStr, timeStr, location)
  );
}
