import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Activity, 
  Info, 
  CheckCircle2, 
  BookOpen, 
  Star,
  Layers,
  Sun,
  Moon,
  HelpCircle,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  Eye,
  Flame,
  Zap,
  Apple,
  Pill,
  Heart
} from 'lucide-react';
import { Language, KundaliData, PlanetPosition } from '../types';
import { PlanetaryBalaBreakdown } from '../utils/planetaryBala';
import { SvgGrahaIcon } from './RealisticGraha';
import { getDetailedGrahaBhavaEffect } from '../utils/bhavaDetails';
import { calculateHouseDrishti, HouseDrishtiAnalysis } from '../utils/grahaDrishti';

export interface BhavaExplorerProps {
  currentLang: Language;
  kundaliData: KundaliData;
  planetaryBalas?: PlanetaryBalaBreakdown[];
  selectedBhavaNumber: number;
  onSelectBhava: (bhavaNum: number) => void;
}

export interface BhavaMeta {
  bhava: number;
  sanskritName: { en: string; kn: string; hi: string };
  title: { en: string; kn: string; hi: string };
  category: 'Kendra' | 'Trikona' | 'Upachaya' | 'Dusthana' | 'Maraka';
  categoryLocalized: { en: string; kn: string; hi: string };
  karakaPlanet: { en: string; kn: string; hi: string };
  bodyParts: { en: string; kn: string; hi: string };
  purpose: { en: string; kn: string; hi: string };
  significations: { en: string; kn: string; hi: string };
  lifeDomains: { en: string[]; kn: string[]; hi: string[] };
}

export const BHAVA_DETAILS: BhavaMeta[] = [
  {
    bhava: 1,
    sanskritName: { en: 'Tanu Bhava (Lagna)', kn: 'ತನು ಭಾವ (ಲಗ್ನ)', hi: 'तनु भाव (लग्न)' },
    title: { en: 'House of Self & Vitality', kn: 'ಆತ್ಮ, ಶರೀರ ಮತ್ತು ವ್ಯಕ್ತಿತ್ವ ಭಾವ', hi: 'आत्म, देह व व्यक्तित्व भाव' },
    category: 'Kendra',
    categoryLocalized: { en: 'Kendra & Trikona (Supreme)', kn: 'ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣ (ಅತ್ಯುನ್ನತ)', hi: 'केन्द्र एवं त्रिकोण (परम)' },
    karakaPlanet: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ (ಆತ್ಮಕಾರಕ)', hi: 'सूर्य (आत्मकारक)' },
    bodyParts: { en: 'Head, brain, forehead, general physique', kn: 'ತಲೆ, ಮಿದುಳು, ಹಣೆ, ಮುಖಲಕ್ಷಣ, ಒಟ್ಟಾರೆ ಶರೀರ', hi: 'मस्तक, मस्तिष्क, ललाट, समग्र शारीरिक गठन' },
    purpose: {
      en: 'To examine physical constitution, longevity, immune vitality, temperament, fame, self-confidence, and general life orientation.',
      kn: 'ದೈಹಿಕ ಶಕ್ತಿ, ಆರೋಗ್ಯ, ದೀರ್ಘಾಯುಷ್ಯ, ವ್ಯಕ್ತಿತ್ವ, ಆತ್ಮವಿಶ್ವಾಸ, ಕೀರ್ತಿ ಮತ್ತು ಜೀವನದ ಒಟ್ಟಾರೆ ದಿಕ್ಕನ್ನು ತಿಳಿಯಲು ಈ ಭಾವವನ್ನು ನೋಡಬೇಕು.',
      hi: 'शारीरिक सामर्थ्य, रोग प्रतिरोधक क्षमता, स्वभाव, यश, आत्मविश्वास एवं जीवन की दिशा जानने हेतु।'
    },
    significations: {
      en: 'The prime pivot of the horoscope. Determines how the native perceives the world and how the world responds to them.',
      kn: 'ಕುಂಡಲಿಯ ಮುಖ್ಯ ಅಡಿಪಾಯ. ಜಾತಕನ ದೈಹಿಕ ತೇಜಸ್ಸು, ಆರೋಗ್ಯ ಮತ್ತು ಸಮಾಜದಲ್ಲಿನ ಪ್ರಭಾವವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.',
      hi: 'सम्पूर्ण कुण्डली का आधार स्तम्भ। जातक की जीवन ऊर्जा और समाज में प्रतिष्ठा का निर्धारक।'
    },
    lifeDomains: {
      en: ['Self-Identity', 'Physical Health', 'Longevity', 'Personality', 'New Beginnings'],
      kn: ['ಆತ್ಮಸ್ವರೂಪ', 'ದೈಹಿಕ ಆರೋಗ್ಯ', 'ಆಯುಷ್ಯ', 'ವ್ಯಕ್ತಿತ್ವ', 'ಜೀವನದ ಆರಂಭ'],
      hi: ['आत्म-पहचान', 'स्वास्थ्य', 'आयु', 'व्यक्तित्व', 'आरम्भ']
    }
  },
  {
    bhava: 2,
    sanskritName: { en: 'Dhana & Kutumba Bhava', kn: 'ಧನ & ಕುಟುಂಬ ಭಾವ', hi: 'धन व कुटुम्ब भाव' },
    title: { en: 'House of Wealth & Speech', kn: 'ಸಂಪತ್ತು, ವಾಣಿ ಮತ್ತು ಕುಟುಂಬ ಭಾವ', hi: 'सम्पत्ति, वाणी व कुटुम्ब भाव' },
    category: 'Maraka',
    categoryLocalized: { en: 'Maraka & Panapara', kn: 'ಮಾರಕ ಮತ್ತು ಪಣಫರ', hi: 'मारक एवं पणफर' },
    karakaPlanet: { en: 'Jupiter (Brihaspati) & Mercury', kn: 'ಗುರು (ಧನಕಾರಕ) & ಬುಧ (ವಾಕ್)', hi: 'गुरु (धनकारक) एवं बुध (वाणी)' },
    bodyParts: { en: 'Right eye, throat, teeth, tongue, mouth, vocal cords', kn: 'ಬಲಗಣ್ಣು, ಗಂಟಲು, ಹಲ್ಲುಗಳು, ನಾಲಿಗೆ, ಬಾಯಿ, ಕಂಠಧ್ವನಿ', hi: 'दाहिनी आँख, कण्ठ, दन्त, जिह्वा, मुखमण्डल' },
    purpose: {
      en: 'To examine accumulated wealth, liquid assets, family lineage, truthfulness and eloquence of speech, dietary preferences, and moral values.',
      kn: 'ಸಂಚಿತ ಧನ, ಬಂಗಾರ, ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್, ಕುಟುಂಬ ಪರಂಪರೆ, ಮಧುರ ವಾಣಿ, ಸತ್ಯನಿಷ್ಠೆ ಮತ್ತು ಆಹಾರ ಪದ್ಧತಿಯನ್ನು ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'संचित धन, पारिवारिक सुख, वाणी की मधुरता, खान-पान एवं नैतिक संस्कारों का आकलन करने हेतु।'
    },
    significations: {
      en: 'Represents resources accumulated from birth family and spoken communication that creates harmony or discord.',
      kn: 'ಕುಟುಂಬದಿಂದ ದೊರೆಯುವ ಆಸ್ತಿ, ಮಾತಿನ ಪ್ರಭಾವ ಮತ್ತು ಸ್ಥಿರ ಆರ್ಥಿಕ ಸುಭದ್ರತೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
      hi: 'पैतृक सम्पदा, संचित धन एवं वाणी के प्रभाव का द्योतक।'
    },
    lifeDomains: {
      en: ['Accumulated Assets', 'Speech & Voice', 'Family Traditions', 'Food Habits', 'Values'],
      kn: ['ಸಂಚಿತ ಸಂಪತ್ತು', 'ವಾಕ್ ಸಾಮರ್ಥ್ಯ', 'ಕುಟುಂಬ ಪರಂಪರೆ', 'ಆಹಾರ ಶೈಲಿ', 'ಮೌಲ್ಯಗಳು'],
      hi: ['संचित धन', 'वाणी', 'पारिवारिक परम्परा', 'खानपान', 'संस्कार']
    }
  },
  {
    bhava: 3,
    sanskritName: { en: 'Bhratru & Sahaja Bhava', kn: 'ಭ್ರಾತೃ & ಸಹಜ ಭಾವ', hi: 'भ्रातृ व सहज भाव' },
    title: { en: 'House of Courage & Siblings', kn: 'ಧೈರ್ಯ, ಪರಾಕ್ರಮ ಮತ್ತು ಕಿರಿಯ ಸಹೋದರರ ಭಾವ', hi: 'पराक्रम, साहस व भ्रातृ भाव' },
    category: 'Upachaya',
    categoryLocalized: { en: 'Upachaya & Apoklima', kn: 'ಉಪಚಯ ಮತ್ತು ಅಪೋಕ್ಲಿಮ', hi: 'उपचय एवं आपोक्लिम' },
    karakaPlanet: { en: 'Mars (Mangala)', kn: 'ಕುಜ (ಪರಾಕ್ರಮಕಾರಕ)', hi: 'मंगल (पराक्रमकारक)' },
    bodyParts: { en: 'Arms, shoulders, hands, collarbone, respiratory passages', kn: 'ತೋಳುಗಳು, ಭುಜಗಳು, ಕೈಗಳು, ಕಿವಿಗಳು, ಶ್ವಾಸನಾಳ', hi: 'बाहु, कंधे, हाथ, कान, श्वासनली' },
    purpose: {
      en: 'To examine courage, self-initiative, younger siblings, short journeys, writing abilities, hands-on skills, and mental stamina.',
      kn: 'ಧೈರ್ಯ, ಸ್ವಪ್ರಯತ್ನ, ಕಿರಿಯ ಸಹೋದರರ ಪ್ರೀತಿ, ಕಿರು ಪ್ರವಾಸಗಳು, ಬರವಣಿಗೆ, ಕೈಚಳಕ ಮತ್ತು ಛಲವನ್ನು ತಿಳಿಯಲು ಪರಿಶೀಲಿಸಬೇಕು.',
      hi: 'साहस, पुरुषार्थ, छोटे भाई-बहन, लघु यात्राएं, लेखन एवं हस्तकला कौशल जानने हेतु।'
    },
    significations: {
      en: 'Shows personal effort (Purushartha). Being an Upachaya house, results improve systematically with age and dedicated efforts.',
      kn: 'ಸ್ವಂತ ಪರಿಶ್ರಮದ ಸ್ಥಾನ. ಉಪಚಯ ಭಾವವಾದ್ದರಿಂದ ಕಾಲಕ್ರಮೇಣ ಮತ್ತು ಪ್ರಯತ್ನದಿಂದ ಶುಭಫಲಗಳು ಹೆಚ್ಚುತ್ತವೆ.',
      hi: 'स्वयं के पराक्रम का स्थान। उपचय भाव होने से समय व अभ्यास के साथ फल में वृद्धि होती है।'
    },
    lifeDomains: {
      en: ['Bravery & Initiative', 'Younger Siblings', 'Writing & Media', 'Short Travels', 'Manual Skills'],
      kn: ['ಧೈರ್ಯ & ಪರಾಕ್ರಮ', 'ಕಿರಿಯ ಒಡಹುಟ್ಟಿದವರು', 'ಸಾಹಿತ್ಯ & ಮಾಧ್ಯಮ', 'ಸಣ್ಣ ಪ್ರವಾಸಗಳು', 'ಕಲಾ ನೈಪುಣ್ಯ'],
      hi: ['साहस व पराक्रम', 'छोटे भाई-बहन', 'लेखन व संचार', 'लघु यात्रा', 'हस्तशिल्प']
    }
  },
  {
    bhava: 4,
    sanskritName: { en: 'Sukha & Matru Bhava', kn: 'ಸುಖ & ಮಾತೃ ಭಾವ', hi: 'सुख व मातृ भाव' },
    title: { en: 'House of Mother & Happiness', kn: 'ತಾಯಿ, ಗೃಹ, ಭೂಮಿ ಮತ್ತು ಸುಖ ಭಾವ', hi: 'माता, गृह, भूमि व सुख भाव' },
    category: 'Kendra',
    categoryLocalized: { en: 'Kendra (Core Anchor)', kn: 'ಕೇಂದ್ರ (ಆಧಾರ ಸ್ತಂಭ)', hi: 'केन्द्र (सुख स्तम्भ)' },
    karakaPlanet: { en: 'Moon (Chandra) & Venus', kn: 'ಚಂದ್ರ (ಮಾತೃ) & ಶುಕ್ರ (ವಾಹನ/ಸುಖ)', hi: 'चन्द्र (मातृ) एवं शुक्र (वाहन/सुख)' },
    bodyParts: { en: 'Chest, heart, lungs, breasts', kn: 'ಎದೆ, ಹೃದಯ, ಶ್ವಾಸಕೋಶಗಳು, ಮನಸ್ಸು', hi: 'हृदय, वक्षस्थल, फेफड़े' },
    purpose: {
      en: 'To examine mother relationship, inner emotional contentment, real estate properties, vehicles, primary formal education, and domestic peace.',
      kn: 'ತಾಯಿಯ ಪ್ರೀತಿ, ಆಂತರಿಕ ಮಾನಸಿಕ ನೆಮ್ಮದಿ, ಸ್ವಂತ ಮನೆ, ಕೃಷಿ/ನಿವೇಶನ, ವಾಹನ ಸೌಭಾಗ್ಯ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣವನ್ನು ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'माता का स्नेह, आन्तरिक सुख-शांति, गृह, भूमि, वाहन एवं प्राथमिक शिक्षा की स्थिति जानने हेतु।'
    },
    significations: {
      en: 'The emotional anchor of the chart. Represents roots, native homeland, psychological sanctuary, and ancestral home.',
      kn: 'ಜಾತಕನ ಮಾನಸಿಕ ನೆಮ್ಮದಿಯ ತಾಣ. ಸ್ವಂತ ಊರು, ವಾಹನ ಮತ್ತು ಮನೆಯಲ್ಲಿನ ಶಾಂತಿಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.',
      hi: 'मानसिक शांति व अंतःकरण की प्रसन्नता का आधार। मातृभूमि व अचल सम्पत्ति का द्योतक।'
    },
    lifeDomains: {
      en: ['Mother & Ancestry', 'Real Estate & Home', 'Vehicles & Conveyances', 'Inner Peace', 'Foundational Learning'],
      kn: ['ತಾಯಿ & ವಂಶ', 'ಮನೆ & ನಿವೇಶನ', 'ವಾಹನ ಸೌಖ್ಯ', 'ಮನಶಾಂತಿ', 'ಮೂಲಭೂತ ಶಿಕ್ಷಣ'],
      hi: ['माता व परिवार', 'भवन व भूमि', 'वाहन सुख', 'मानसिक शांति', 'प्राथमिक शिक्षा']
    }
  },
  {
    bhava: 5,
    sanskritName: { en: 'Putra & Purva Punya Bhava', kn: 'ಪುತ್ರ & ಪೂರ್ವಪುಣ್ಯ ಭಾವ', hi: 'पुत्र व पूर्वपुण्य भाव' },
    title: { en: 'House of Intellect & Children', kn: 'ಬುದ್ಧಿಮತ್ತೆ, ಸಂತಾನ ಮತ್ತು ಪೂರ್ವಪುಣ್ಯ ಭಾವ', hi: 'बुद्धि, सन्तान व पूर्वपुण्य भाव' },
    category: 'Trikona',
    categoryLocalized: { en: 'Trikona (Auspicious Lakshmi Sthana)', kn: 'ತ್ರಿಕೋಣ (ಲಕ್ಷ್ಮೀ ಸ್ಥಾನ)', hi: 'त्रिकोण (परम शुभ लक्ष्मी स्थान)' },
    karakaPlanet: { en: 'Jupiter (Brihaspati)', kn: 'ಗುರು (ಧೀ-ಕಾರಕ)', hi: 'गुरु (संतान व बुद्धि कारक)' },
    bodyParts: { en: 'Stomach, upper abdomen, liver, pancreas, spleen', kn: 'ಹೊಟ್ಟೆ, ಮೇಲ್ಭಾಗದ ಜೀರ್ಣಾಂಗ, ಪಿತ್ತಕೋಶ, ಮೇದೋಜೀರಕ ಗ್ರಂಥಿ', hi: 'पेट, यकृत, अग्न्याशय, तिल्ली' },
    purpose: {
      en: 'To examine past-life karmic credit (Purva Punya), intelligence, children, creative arts, mantras, speculative investments, and romantic love.',
      kn: 'ಪೂರ್ವಜನ್ಮದ ಪುಣ್ಯ, ತೀಕ್ಷ್ಣ ಬುದ್ಧಿ, ಸಂತಾನ ಸೌಭಾಗ್ಯ, ಮಂತ್ರ ಸಿದ್ಧಿ, ಷೇರು/ಹೂಡಿಕೆ ಮತ್ತು ಕಲಾತ್ಮಕ ಪ್ರತಿಭೆಯನ್ನು ತಿಳಿಯಲು ಪರಿಶೀಲಿಸಬೇಕು.',
      hi: 'पूर्वजन्म के पुण्य कर्म, कुशाग्र बुद्धि, सन्तान सुख, मंत्र सिद्धि, निवेश एवं रचनात्मक प्रतिभा जानने हेतु।'
    },
    significations: {
      en: 'House of creative genius and divine grace. Strong 5th house bestows effortless luck, wise discernment, and virtuous progeny.',
      kn: 'ದೈವಾನುಗ್ರಹ ಮತ್ತು ಪ್ರತಿಭೆಯ ಸ್ಥಾನ. ಈ ಭಾವ ಬಲವಾಗಿದ್ದರೆ ಉನ್ನತ ಬುದ್ಧಿ, ಮಂತ್ರ ಜಪ ಮತ್ತು ಸತ್ಪುತ್ರರ ಪ್ರಾಪ್ತಿಯಾಗುತ್ತದೆ.',
      hi: 'दैवीय कृपा एवं विवेक का स्थान। बलि होने पर जातक विद्वान, नीतिज्ञ व सन्तान सुख से सम्पन्न होता है।'
    },
    lifeDomains: {
      en: ['Children & Lineage', 'Higher Intellect', 'Purva Punya (Past Karma)', 'Mantras & Devotion', 'Creative Genius'],
      kn: ['ಸಂತಾನ ಭಾಗ್ಯ', 'ಉನ್ನತ ಬುದ್ಧಿಶಕ್ತಿ', 'ಪೂರ್ವಪುಣ್ಯ', 'ಮಂತ್ರೋಪಾಸನೆ', 'ಸೃಜನಶೀಲತೆ'],
      hi: ['सन्तान सुख', 'उच्च बुद्धि', 'पूर्वपुण्य', 'मंत्र सिद्धि', 'रचनात्मकता']
    }
  },
  {
    bhava: 6,
    sanskritName: { en: 'Shatru & Roga Bhava', kn: 'ಶತ್ರು & ರೋಗ ಭಾವ', hi: 'शत्रु व रोग भाव' },
    title: { en: 'House of Health & Obstacles', kn: 'ರೋಗ, ಸಾಲ, ಶತ್ರು ಮತ್ತು ಸೇವಾ ಭಾವ', hi: 'रोग, ऋण, शत्रु व सेवा भाव' },
    category: 'Dusthana',
    categoryLocalized: { en: 'Dusthana & Upachaya', kn: 'ದುಸ್ಥಾನ ಮತ್ತು ಉಪಚಯ', hi: 'दुस्थान एवं उपचय' },
    karakaPlanet: { en: 'Mars (Mangala) & Saturn (Shani)', kn: 'ಕುಜ & ಶನಿ', hi: 'मंगल एवं शनि' },
    bodyParts: { en: 'Lower abdomen, intestines, kidneys, immune battles', kn: 'ಕೆಳಹೊಟ್ಟೆ, ಕರುಳುಗಳು, ಮೂತ್ರಪಿಂಡ, ರೋಗನಿರೋಧಕ ವ್ಯವಸ್ಥೆ', hi: 'निचला उदर, आंतें, गुर्दे, प्रतिरोधी तंत्र' },
    purpose: {
      en: 'To examine diseases, litigation, debt burdens, opponents, pets, competitive examinations, and daily working discipline/service.',
      kn: 'ಕಾಯಿಲೆಗಳು, ಸಾಲಬಾಧೆ, ಕೋರ್ಟ್-ಕಚೇರಿ, ಶತ್ರು ಜಯ, ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಯಶಸ್ಸು ಮತ್ತು ದೈನಂದಿನ ಉದ್ಯೋಗ ಶ್ರಮ ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'रोग, ऋण, शत्रु, न्यायालयीन विवाद, प्रतियोगी परीक्षाएं एवं सेवा कार्य का विश्लेषण करने हेतु।'
    },
    significations: {
      en: 'While categorized as Dusthana (difficult house), as an Upachaya house, malefics here crush enemies and bring victory in battles.',
      kn: 'ಸವಾಲುಗಳ ಸ್ಥಾನವಾದರೂ, ಪಾಪಗ್ರಹಗಳು ಇಲ್ಲಿದ್ದರೆ ಶತ್ರುಗಳನ್ನು ಧ್ವಂಸ ಮಾಡಿ, ಸಾಲ ತೀರಿಸಿ ಜಯ ತಂದುಕೊಡುತ್ತವೆ.',
      hi: 'कठिनाइयों का भाव होने पर भी, क्रूर ग्रहों की स्थिति शत्रुओं पर विजय एवं सफलता दिलाती है।'
    },
    lifeDomains: {
      en: ['Physical Health / Diseases', 'Debts & Loans', 'Enemies & Competitions', 'Litigation', 'Service & Jobs'],
      kn: ['ಆರೋಗ್ಯ & ರೋಗಗಳು', 'ಸಾಲ & ಆರ್ಥಿಕ ಹೊಣೆ', 'ಶತ್ರುಗಳು & ಸ್ಪರ್ಧೆ', 'ಕೋರ್ಟ್ ವ್ಯಾಜ್ಯಗಳು', 'ಸೇವೆ & ಕರ್ತವ್ಯ'],
      hi: ['स्वास्थ्य व रोग', 'ऋण', 'शत्रु व विजय', 'मुकदमेबाजी', 'दैनिक नौकरी']
    }
  },
  {
    bhava: 7,
    sanskritName: { en: 'Kalatra & Jaya Bhava', kn: 'ಕಳತ್ರ & ಜಾಯಾ ಭಾವ', hi: 'कलत्र व जाया भाव' },
    title: { en: 'House of Marriage & Partnerships', kn: 'ವಿವಾಹ, ಪತ್ನಿ/ಪತಿ ಮತ್ತು ಪಾಲುದಾರಿಕೆ ಭಾವ', hi: 'विवाह, जीवनसाथी व साझेदारी भाव' },
    category: 'Kendra',
    categoryLocalized: { en: 'Kendra & Maraka', kn: 'ಕೇಂದ್ರ ಮತ್ತು ಪ್ರಧಾನ ಮಾರಕ', hi: 'केन्द्र एवं मारक' },
    karakaPlanet: { en: 'Venus (Shukra) & Jupiter', kn: 'ಶುಕ್ರ (ಕಳತ್ರಕಾರಕ) & ಗುರು', hi: 'शुक्र (कलत्रकारक) एवं गुरु' },
    bodyParts: { en: 'Pelvis, reproductive organs, lumbar region', kn: 'ಸೊಂಟ, ಜನನಾಂಗಗಳು, ಮೂತ್ರಕೋಶ', hi: 'पेल्विस, जननेन्द्रियां, गुदा' },
    purpose: {
      en: 'To examine spouse temperament, marriage longevity, business partnerships, public interactions, legal contracts, and foreign trade.',
      kn: 'ಜೀವನ ಸಂಗಾತಿಯ ಗುಣ-ಸ್ವಭಾವ, ವೈವಾಹಿಕ ಸೌಖ್ಯ, ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ, ಸಾರ್ವಜನಿಕ ಒಪ್ಪಂದಗಳು ಮತ್ತು ವಿದೇಶ ವ್ಯವಹಾರ ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'जीवनसाथी का स्वभाव, वैवाहिक सुख, व्यापारिक साझेदारी, जनसम्पर्क एवं विदेश गमन जानने हेतु।'
    },
    significations: {
      en: 'Directly opposite the 1st house (self); represents the "other" - spouse, partners, and public sphere with whom we interact.',
      kn: 'ಲಗ್ನಕ್ಕೆ ಎದುರಾಗಿರುವ ಪ್ರಧಾನ ಕೇಂದ್ರ. ವ್ಯಕ್ತಿಯ ದಾಂಪತ್ಯ ಜೀವನ ಮತ್ತು ಸಮಾನ ಪಾಲುದಾರಿಕೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
      hi: 'लग्न के सम्मुख स्थित प्रधान केन्द्र। दांपत्य जीवन, लोक-व्यवहार व समझौतों का निर्धारक।'
    },
    lifeDomains: {
      en: ['Spouse & Marriage', 'Business Partnerships', 'Public Reputation', 'Foreign Travel', 'Legal Agreements'],
      kn: ['ವಿವಾಹ & ಸಂಗಾತಿ', 'ವ್ಯಾಪಾರ ಪಾಲುದಾರಿಕೆ', 'ಲೋಕ ಸಂಪರ್ಕ', 'ವಿದೇಶ ಪ್ರವಾಸ', 'ಕಾನೂನು ಒಪ್ಪಂದ'],
      hi: ['विवाह व दाम्पत्य', 'व्यापारिक साझीदारी', 'लोक व्यवहार', 'विदेश यात्रा', 'अनुबंध']
    }
  },
  {
    bhava: 8,
    sanskritName: { en: 'Ayur & Randhra Bhava', kn: 'ಆಯುರ್ & ರಂಧ್ರ ಭಾವ', hi: 'आयु व रन्ध्र भाव' },
    title: { en: 'House of Longevity & Transformation', kn: 'ಆಯುಷ್ಯ, ಗೂಢ ವಿದ್ಯೆ ಮತ್ತು ಪರಿವರ್ತನೆ ಭಾವ', hi: 'आयु, गूढ़ विद्या व परिवर्तन भाव' },
    category: 'Dusthana',
    categoryLocalized: { en: 'Dusthana (Deep Karmic Sthana)', kn: 'ದುಸ್ಥಾನ (ಕರ್ಮ ರಂಧ್ರ)', hi: 'दुस्थान (गूढ़ कर्म स्थान)' },
    karakaPlanet: { en: 'Saturn (Shani)', kn: 'ಶನಿ (ಆಯುಷ್ಕಾರಕ)', hi: 'शनि (आयुकारक)' },
    bodyParts: { en: 'Excretory organs, pelvic bones, chronic underlying vitality', kn: 'ವಿಸರ್ಜನಾಂಗಗಳು, ಸೊಂಟದ ಮೂಳೆಗಳು, ಗುಪ್ತ ರೋಗಗಳು', hi: 'उत्सर्जन तंत्र, नितम्ब, गुप्त अंग' },
    purpose: {
      en: 'To examine longevity span, unearned wealth (inheritance, insurance, wills), research, occult sciences, accidents, sudden upheavals, and spiritual rebirth.',
      kn: 'ಆಯುಷ್ಯದ ಪ್ರಮಾಣ, ಅನಿರೀಕ್ಷಿತ ಧನಲಾಭ (ವಿಮೆ, ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿ), ಜ್ಯೋತಿಷ್ಯ/ಗೂಢ ವಿದ್ಯೆ, ಅಪಘಾತಗಳು ಮತ್ತು ಜೀವನದ ಹಠಾತ್ ತಿರುವು ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'दीर्घायु, वसीयत व आकस्मिक धन, गूढ़ विज्ञान (ज्योतिष/तंत्र), दुर्घटनाएं एवं आध्यात्मिक रूपांतरण हेतु।'
    },
    significations: {
      en: 'The house of mystery, death, and resurrection. Deepest karma that forces soul evolution through transformative crises.',
      kn: 'ರಹಸ್ಯ ಮತ್ತು ಆಂತರಿಕ ಶಕ್ತಿಯ ಸ್ಥಾನ. ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆಗಳ ಮೂಲಕ ಆತ್ಮ ಪರಿವರ್ತನೆ ಉಂಟುಮಾಡುತ್ತದೆ.',
      hi: 'रहस्य व आत्म-साक्षात्कार का स्थान। संकटों के माध्यम से जीवन में आमूलचूल परिवर्तन लाता है।'
    },
    lifeDomains: {
      en: ['Longevity (Ayushya)', 'Inherited Wealth', 'Occult & Astrology', 'Sudden Events', 'Kundalini Awakening'],
      kn: ['ಆಯುಷ್ಯ ಪ್ರಮಾಣ', 'ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿ', 'ಜ್ಯೋತಿಷ್ಯ & ಗೂಢ ಶಾಸ್ತ್ರ', 'ಅನಿರೀಕ್ಷಿತ ಘಟನೆಗಳು', 'ಆಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ'],
      hi: ['आयु', 'पैतृक सम्पत्ति/बीमा', 'गूढ़ ज्ञान/ज्योतिष', 'अप्रत्याशित घटना', 'कुंडलिनी जागरण']
    }
  },
  {
    bhava: 9,
    sanskritName: { en: 'Bhagya & Dharma Bhava', kn: 'ಭಾಗ್ಯ & ಧರ್ಮ ಭಾವ', hi: 'भाग्य व धर्म भाव' },
    title: { en: 'House of Fortune & Higher Wisdom', kn: 'ಭಾಗ್ಯ, ಧರ್ಮ, ತಂದೆ ಮತ್ತು ಗುರು ಭಾವ', hi: 'भाग्य, धर्म, पिता व गुरु भाव' },
    category: 'Trikona',
    categoryLocalized: { en: 'Supreme Trikona (Parama Shubha)', kn: 'ಪರಮ ಶ್ರೇಷ್ಠ ತ್ರಿಕೋಣ', hi: 'परम शुभ त्रिकोण' },
    karakaPlanet: { en: 'Jupiter (Brihaspati) & Sun', kn: 'ಗುರು (ಗುರುಕಾರಕ) & ಸೂರ್ಯ (ಪಿತೃ)', hi: 'गुरु (धर्म/भाग्य) एवं सूर्य (पिता)' },
    bodyParts: { en: 'Thighs, hips, arterial circulation', kn: 'ತೊಡೆಗಳು, ಸೊಂಟದ ಕೀಲುಗಳು, ರಕ್ತನಾಳಗಳು', hi: 'जांघें, नितम्ब, धमनियां' },
    purpose: {
      en: 'To examine divine grace, father relationship, spiritual mentors (Gurus), pilgrimages, higher education, moral righteousness, and luck.',
      kn: 'ಭಾಗ್ಯೋದಯ, ತಂದೆಯ ಹಿತ, ಕುಲದೈವ ಕೃಪೆ, ಗುರುಗಳ ಆಶೀರ್ವಾದ, ತೀರ್ಥಯಾತ್ರೆ, ಉನ್ನತ ವಿಶ್ವವಿದ್ಯಾಲಯ ಶಿಕ್ಷಣ ಮತ್ತು ಸತ್ಕರ್ಮಗಳನ್ನು ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'ईश्वरीय कृपा, पिता से संबंध, गुरु कृपा, तीर्थाटन, उच्च विद्या, धर्मनिष्ठा एवं भाग्योदय का अध्ययन।'
    },
    significations: {
      en: 'The most auspicious house in Vedic astrology. Protects the native from calamities like an unshakeable shield of dharma.',
      kn: 'ಕುಂಡಲಿಯ ಅತ್ಯಂತ ಪವಿತ್ರ ಭಾಗ್ಯ ಸ್ಥಾನ. ಇದು ಬಲವಾಗಿದ್ದರೆ ಎಂಥ ಕಷ್ಟದಲ್ಲೂ ದೈವಕೃಪೆಯಿಂದ ಜಯ ದೊರೆಯುತ್ತದೆ.',
      hi: 'कुण्डली का सर्वाधिक शुभ भाव। धर्म और भाग्य की ढाल बनकर जातक की रक्षा करता है।'
    },
    lifeDomains: {
      en: ['Divine Fortune (Bhagya)', 'Father & Mentors', 'Spiritual Pilgrimage', 'Dharma & Righteousness', 'Higher Learning'],
      kn: ['ಭಾಗ್ಯೋದಯ', 'ತಂದೆ & ಸದ್ಗುರುಗಳು', 'ತೀರ್ಥಕ್ಷೇತ್ರ ಯಾತ್ರೆ', 'ಧರ್ಮ ನಿಷ್ಠೆ', 'ಉನ್ನತ ಶಿಕ್ಷಣ'],
      hi: ['भाग्योदय', 'पिता व गुरु', 'तीर्थ यात्रा', 'धर्म व सत्कर्म', 'उच्च अध्ययन']
    }
  },
  {
    bhava: 10,
    sanskritName: { en: 'Karma & Rajya Bhava', kn: 'ಕರ್ಮ & ರಾಜ್ಯ ಭಾವ', hi: 'कर्म व राज्य भाव' },
    title: { en: 'House of Career & Authority', kn: 'ವೃತ್ತಿ, ಕರ್ಮ, ಕೀರ್ತಿ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸ್ಥಾನಮಾನ', hi: 'आजीविका, पद, प्रतिष्ठा व कर्म भाव' },
    category: 'Kendra',
    categoryLocalized: { en: 'Supreme Kendra (Midheaven)', kn: 'ಪ್ರಧಾನ ಕೇಂದ್ರ (ಆಕಾಶ ಮಧ್ಯ)', hi: 'सर्वोच्च केन्द्र (दशम भाव)' },
    karakaPlanet: { en: 'Sun, Mercury, Jupiter & Saturn', kn: 'ಸೂರ್ಯ (ಅಧಿಕಾರ), ಬುಧ (ವ್ಯಾಪಾರ), ಗುರು, ಶನಿ (ಶ್ರಮ)', hi: 'सूर्य, बुध, गुरु एवं शनि' },
    bodyParts: { en: 'Knees, kneecaps, skeletal joints', kn: 'ಮೊಣಕಾಲುಗಳು, ಕೀಲುಗಳು, ಅಸ್ಥಿಪಂಜರ', hi: 'घुटने, संधियां, अस्थियां' },
    purpose: {
      en: 'To examine career profession, public status, government recognition, leadership authority, business fame, and worldly deeds (Karma).',
      kn: 'ಉದ್ಯೋಗ, ವ್ಯಾಪಾರ, ರಾಜಕೀಯ ಗೌರವ, ನಾಯಕತ್ವ, ಸಾರ್ವಜನಿಕ ಕೀರ್ತಿ, ಪ್ರಶಸ್ತಿ ಮತ್ತು ಸಮಾಜದಲ್ಲಿನ ಪ್ರಭಾವ ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'व्यवसाय, पदोन्नति, प्रशासनिक सम्मान, नेतृत्व क्षमता, सामाजिक प्रतिष्ठा एवं कर्म का फल जानने हेतु।'
    },
    significations: {
      en: 'The summit of worldly achievement. Shows what footprints the soul leaves behind in society through its actions.',
      kn: 'ವ್ಯಕ್ತಿಯ ಕೀರ್ತಿಯ ಶಿಖರ. ಸಮಾಜದಲ್ಲಿ ಆತನಿಗೆ ಸಿಗುವ ಗೌರವ, ಅಧಿಕಾರ ಮತ್ತು ಜವಾಬ್ದಾರಿಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.',
      hi: 'भौतिक उपलब्धियों का शिखर। समाज में जातक के कर्म एवं पद-प्रतिष्ठा का दर्पण।'
    },
    lifeDomains: {
      en: ['Career & Vocation', 'Public Fame & Honor', 'Government Favors', 'Leadership & Authority', 'Karmic Mission'],
      kn: ['ಉದ್ಯೋಗ & ವೃತ್ತಿ', 'ಸಾರ್ವಜನಿಕ ಕೀರ್ತಿ', 'ಸರ್ಕಾರಿ ಮನ್ನಣೆ', 'ನಾಯಕತ್ವ & ಅಧಿಕಾರ', 'ಜೀವನದ ಕರ್ತವ್ಯ'],
      hi: ['आजीविका', 'यश व सम्मान', 'राजकीय अनुग्रह', 'नेतृत्व', 'कर्म निष्ठा']
    }
  },
  {
    bhava: 11,
    sanskritName: { en: 'Labha & Aya Bhava', kn: 'ಲಾಭ & ಆಯ ಭಾವ', hi: 'लाभ व आय भाव' },
    title: { en: 'House of Gains & Aspirations', kn: 'ಲಾಭ, ಆದಾಯ, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ ಮತ್ತು ಹಿರಿಯ ಸಹೋದರ ಭಾವ', hi: 'लाभ, आय व सिद्धि भाव' },
    category: 'Upachaya',
    categoryLocalized: { en: 'Upachaya (Fulfillment House)', kn: 'ಉಪಚಯ (ಕಾಮ ತ್ರಿಕೋಣ)', hi: 'उपचय (इच्छापूर्ति भाव)' },
    karakaPlanet: { en: 'Jupiter (Brihaspati)', kn: 'ಗುರು (ಲಾಭಕಾರಕ)', hi: 'गुरु (लाभकारक)' },
    bodyParts: { en: 'Left ear, shins, ankles, calves', kn: 'ಎಡಗಿವಿ, ಮೀನಖಂಡ, ಕಣಕಾಲು, ಪಾದದ ಮೇಲ್ಭಾಗ', hi: 'बायां कान, पिंडलियां, टखने' },
    purpose: {
      en: 'To examine financial profits, continuous cash inflows, fulfillment of cherished desires, elder siblings, and social networking influence.',
      kn: 'ನಿರಂತರ ಆದಾಯ, ವ್ಯಾಪಾರ ಲಾಭ, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ, ಹಿರಿಯ ಒಡಹುಟ್ಟಿದವರು, ಸ್ನೇಹಿತರ ಬಳಗ ಮತ್ತು ಸಾಮಾಜಿಕ ಪ್ರಭಾವ ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'नियमित आय, व्यावसायिक मुनाफा, मनोकामना पूर्ति, बड़े भाई-बहन एवं मित्रों से लाभ जानने हेतु।'
    },
    significations: {
      en: 'House of abundant fulfillment. All planets, whether benefic or malefic, tend to produce tangible financial gains when situated here.',
      kn: 'ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿಯ ಸ್ಥಾನ. ಯಾವುದೇ ಗ್ರಹವು ಈ ಭಾವದಲ್ಲಿ ಸ್ಥಿತವಾಗಿದ್ದರೂ ಆರ್ಥಿಕ ವೃದ್ಧಿಯನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.',
      hi: 'मनोकामना सिद्धि का भाव। शुभ अथवा क्रूर, सभी ग्रह यहाँ स्थित होकर लाभ में वृद्धि करते हैं।'
    },
    lifeDomains: {
      en: ['Financial Gains (Labha)', 'Fulfillment of Desires', 'Elder Siblings', 'Influential Friends', 'Community Networks'],
      kn: ['ಆರ್ಥಿಕ ಲಾಭ & ಆದಾಯ', 'ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ', 'ಹಿರಿಯ ಒಡಹುಟ್ಟಿದವರು', 'ಸ್ನೇಹಿತರ ವಲಯ', 'ಸಾಮಾಜಿಕ ಜಾಲ'],
      hi: ['आर्थिक लाभ', 'मनोकामना सिद्धि', 'बड़े भाई-बहन', 'मित्र मंडली', 'सामाजिक प्रभाव']
    }
  },
  {
    bhava: 12,
    sanskritName: { en: 'Vyaya & Moksha Bhava', kn: 'ವ್ಯಯ & ಮೋಕ್ಷ ಭಾವ', hi: 'व्यय व मोक्ष भाव' },
    title: { en: 'House of Expenditure & Liberation', kn: 'ವ್ಯಯ, ಮೋಕ್ಷ, ವಿದೇಶ ವಾಸ ಮತ್ತು ಅಧ್ಯಾತ್ಮ ಭಾವ', hi: 'व्यय, मोक्ष व विदेश वास भाव' },
    category: 'Dusthana',
    categoryLocalized: { en: 'Dusthana & Moksha Trikona', kn: 'ದುಸ್ಥಾನ ಮತ್ತು ಮೋಕ್ಷ ತ್ರಿಕೋಣ', hi: 'दुस्थान एवं मोक्ष त्रिकोण' },
    karakaPlanet: { en: 'Saturn & Ketu', kn: 'ಶನಿ (ವ್ಯಯ) & ಕೇತು (ಮೋಕ್ಷಕಾರಕ)', hi: 'शनि (व्यय) एवं केतु (मोक्षकारक)' },
    bodyParts: { en: 'Feet, left eye, sleep cycles, lymphatic drainage', kn: 'ಪಾದಗಳು, ಎಡಗಣ್ಣು, ನಿದ್ರಾ ಚಕ್ರ, ಅಂಗಾಲುಗಳು', hi: 'चरण, बायीं आँख, शयन सुख' },
    purpose: {
      en: 'To examine financial expenditures, charity donations, foreign settlements, deep meditation, bedroom pleasures, hospitalizations, and ultimate liberation (Moksha).',
      kn: 'ಖರ್ಚು-ವೆಚ್ಚಗಳು, ದಾನ-ಧರ್ಮ, ವಿದೇಶ ಪ್ರಯಾಣ/ನೆಲೆಸುವಿಕೆ, ಆಸ್ಪತ್ರೆ ಖರ್ಚು, ಏಕಾಂತ ಧ್ಯಾನ, ನಿದ್ರಾ ಸುಖ ಮತ್ತು ಅಂತಿಮ ಮುಕ್ತಿ (ಮೋಕ್ಷ) ತಿಳಿಯಲು ನೋಡಬೇಕು.',
      hi: 'व्यय, दान, विदेश प्रवास, एकांत ध्यान, शयन सुख, अस्पताल व्यय एवं मोक्ष की स्थिति जानने हेतु।'
    },
    significations: {
      en: 'The exit gate of the zodiac. Represents letting go of the ego, dissolution of karma, unconditional charity, and transcendent consciousness.',
      kn: 'ರಾಶಿಚಕ್ರದ ಮುಕ್ತಾಯದ ಸ್ಥಾನ. ಲೌಕಿಕ ಬಂಧನಗಳಿಂದ ಬಿಡುಗಡೆ, ವಿದೇಶ ವಾಸ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮುಕ್ತಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
      hi: 'भौतिक बंधनों से मुक्ति का द्वार। दान, विदेश वास एवं अंततः आत्मा के मोक्ष का परिचायक।'
    },
    lifeDomains: {
      en: ['Spiritual Liberation (Moksha)', 'Foreign Settlement', 'Expenditures & Charity', 'Sleep & Rest', 'Solitude & Retreat'],
      kn: ['ಆಧ್ಯಾತ್ಮಿಕ ಮೋಕ್ಷ', 'ವಿದೇಶ ವಾಸ', 'ಖರ್ಚು & ದಾನಧರ್ಮ', 'ನಿದ್ರಾ ಸುಖ', 'ಏಕಾಂತ ಧ್ಯಾನ'],
      hi: ['मोक्ष', 'विदेश वास', 'व्यय व दान', 'शयन सुख', 'एकांत साधना']
    }
  }
];

export const BhavaExplorer: React.FC<BhavaExplorerProps> = ({
  currentLang,
  kundaliData,
  planetaryBalas = [],
  selectedBhavaNumber,
  onSelectBhava
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'drishtiRemedies' | 'nineBhavas' | 'planetsInHouse' | 'grahaEffects'>('details');
  const [selectedGraha, setSelectedGraha] = useState<string>('Sun');
  const [grahaViewScope, setGrahaViewScope] = useState<'currentBhava' | 'all12Bhavas'>('currentBhava');

  const selectedBhava = BHAVA_DETAILS.find(b => b.bhava === selectedBhavaNumber) || BHAVA_DETAILS[0];

  // Graha Drishti and Mind-Body Nutrition & Vedic Remedies calculation
  const houseDrishti = useMemo(() => {
    return calculateHouseDrishti(kundaliData, selectedBhavaNumber);
  }, [kundaliData, selectedBhavaNumber]);

  // Planets currently situated in this house in the native's chart
  const planetsInSelectedBhava = kundaliData.planets.filter(p => p.bhava === selectedBhavaNumber);

  // Rashi residing in this house
  const houseData = kundaliData.houses.find(h => h.bhava === selectedBhavaNumber);
  const rashiName = houseData ? houseData.rashiName[currentLang] : '';

  // Planetary Bala breakdown map
  const balaMap = new Map(planetaryBalas.map(b => [b.planet.name, b]));

  const ALL_GRAHA_LIST = [
    { key: 'Sun', en: 'Sun', kn: 'ಸೂರ್ಯ' },
    { key: 'Moon', en: 'Moon', kn: 'ಚಂದ್ರ' },
    { key: 'Mars', en: 'Mars', kn: 'ಕುಜ' },
    { key: 'Mercury', en: 'Mercury', kn: 'ಬುಧ' },
    { key: 'Jupiter', en: 'Jupiter', kn: 'ಗುರು' },
    { key: 'Venus', en: 'Venus', kn: 'ಶುಕ್ರ' },
    { key: 'Saturn', en: 'Saturn', kn: 'ಶನಿ' },
    { key: 'Rahu', en: 'Rahu', kn: 'ರಾಹು' },
    { key: 'Ketu', en: 'Ketu', kn: 'ಕೇತು' }
  ];

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-400/80 dark:border-stone-800 shadow-2xl space-y-5 animate-in fade-in">
      
      {/* Header with Explanation of What is Bhava */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 text-white flex items-center justify-center shadow-lg shrink-0">
            <Compass className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                {currentLang === 'kn' ? '೧೨ ಭಾವಗಳ ಸಮಗ್ರ ದರ್ಶನ' : 'Interactive Bhava Explorer'}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-mono font-semibold text-stone-500">
                Bhava #{selectedBhavaNumber} Selected
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100 mt-0.5">
              {currentLang === 'kn'
                ? 'ಭಾವ ಎಂದರೇನು? ಕುಂಡಲಿಯ ಪ್ರಮುಖ ಭಾವಗಳು & ಅವುಗಳ ಉದ್ದೇಶ'
                : currentLang === 'hi'
                ? 'भाव क्या है? कुण्डली के प्रमुख भाव एवं प्रयोजन'
                : 'What is a Bhava? Significance, Purpose & Planetary Effects'}
            </h3>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start md:self-auto text-xs font-bold flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {currentLang === 'kn' ? 'ಆಯ್ದ ಭಾವ ವಿವರ' : 'House Deep-Dive'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drishtiRemedies')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'drishtiRemedies'
                ? 'bg-rose-700 text-white border-rose-500 shadow-xs'
                : 'text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-rose-500 dark:text-rose-300" />
            <span>{currentLang === 'kn' ? 'ಗ್ರಹ ದೃಷ್ಟಿ & ಆರೋಗ್ಯ ಪರಿಹಾರ' : 'Drishti & Remedies'}</span>
            <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-900 dark:bg-rose-950 dark:text-rose-200 text-[10px] flex items-center justify-center font-mono font-bold">
              {houseDrishti.aspectingPlanets.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nineBhavas')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'nineBhavas'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {currentLang === 'kn' ? 'ಭಾವ ಎಂದರೇನು? (ಪರಿಚಯ)' : 'What is Bhava?'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('planetsInHouse')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'planetsInHouse'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>{currentLang === 'kn' ? 'ಭಾವಸ್ಥ ಗ್ರಹಗಳು' : 'Planets Here'}</span>
            <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] flex items-center justify-center font-mono">
              {planetsInSelectedBhava.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grahaEffects')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'grahaEffects'
                ? 'bg-purple-700 text-white border-purple-500 shadow-xs'
                : 'text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>{currentLang === 'kn' ? '೯ ಗ್ರಹ-ಭಾವ ಫಲಗಳು' : '9 Grahas in Bhavas'}</span>
          </button>
        </div>
      </div>

      {/* 1 to 12 House Selector Bar (Clickable, Highlights Current House & Kendra/Trikona) */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 dark:text-stone-400 mb-2">
          <span>{currentLang === 'kn' ? 'ಪರಿಶೀಲಿಸಲು ಭಾವವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Click House):' : 'Select House to Explore (1-12):'}</span>
          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
            ★ Kendras: 1, 4, 7, 10 • ▲ Trikonas: 1, 5, 9
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {BHAVA_DETAILS.map((b) => {
            const isSelected = b.bhava === selectedBhavaNumber;
            const planetCount = kundaliData.planets.filter(p => p.bhava === b.bhava).length;
            const isKendra = [1, 4, 7, 10].includes(b.bhava);
            const isTrikona = [1, 5, 9].includes(b.bhava);

            return (
              <button
                key={b.bhava}
                type="button"
                onClick={() => onSelectBhava(b.bhava)}
                className={`p-2 rounded-xl text-center transition-all cursor-pointer relative flex flex-col items-center justify-between min-h-[58px] ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-lg ring-2 ring-amber-400 scale-105 z-10'
                    : isTrikona
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                    : isKendra
                    ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-xs">#{b.bhava}</span>
                  {isTrikona && <span className="text-[9px] text-amber-400">▲</span>}
                </div>
                <span className="text-[10px] font-serif font-bold line-clamp-1">
                  {b.sanskritName[currentLang].split(' ')[0]}
                </span>
                {planetCount > 0 && (
                  <span className={`text-[9px] font-mono px-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-200 dark:bg-stone-700 text-amber-950 dark:text-amber-200'}`}>
                    {planetCount} {planetCount === 1 ? 'P' : 'Ps'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DETAILED DIVE INTO THE SELECTED HOUSE */}
      {/* ========================================================================= */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          {/* Main Selected House Banner Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 dark:from-stone-850 dark:via-amber-950/30 dark:to-stone-850 border border-amber-300 dark:border-stone-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                    House #{selectedBhava.bhava}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-300">
                    {selectedBhava.categoryLocalized[currentLang]}
                  </span>
                  {rashiName && (
                    <span className="text-xs font-serif font-bold text-stone-600 dark:text-stone-300">
                      • {currentLang === 'kn' ? 'ರಾಶಿ:' : 'Occupied Sign:'} <strong>{rashiName}</strong>
                    </span>
                  )}
                </div>

                <h4 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {selectedBhava.sanskritName[currentLang]} — {selectedBhava.title[currentLang]}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                  {selectedBhava.significations[currentLang]}
                </p>
              </div>

              {/* Natural Karaka Badge */}
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-300 dark:border-stone-700 shrink-0 text-xs text-center space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                  {currentLang === 'kn' ? 'ನೈಸರ್ಗಿಕ ಕಾರಕ ಗ್ರಹ' : 'Natural Karaka'}
                </span>
                <span className="font-serif font-bold text-amber-800 dark:text-amber-400 text-sm">
                  {selectedBhava.karakaPlanet[currentLang]}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid: Purpose of Analysis, Ruled Anatomy & Key Life Domains */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Purpose of Looking at This Bhava */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಯಾವ ಉದ್ದೇಶಕ್ಕೆ ನೋಡಬೇಕು?' : 'Purpose of Analysis'}</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {selectedBhava.purpose[currentLang]}
              </p>
            </div>

            {/* 2. Bodily Parts Ruled */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Activity className="w-4 h-4 text-rose-600" />
                <span>{currentLang === 'kn' ? 'ಶರೀರದ ಅಂಗಗಳು (Anatomy)' : 'Governed Body Parts'}</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {selectedBhava.bodyParts[currentLang]}
              </p>
            </div>

            {/* 3. Core Life Domains */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>{currentLang === 'kn' ? 'ಪ್ರಮುಖ ಜೀವನ ರಂಗಗಳು' : 'Core Life Domains'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedBhava.lifeDomains[currentLang].map((domain, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold"
                  >
                    • {domain}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Planets In This House In Native's Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>
                  {currentLang === 'kn'
                    ? `ಜಾತಕ ಕುಂಡಲಿಯಲ್ಲಿ ${selectedBhavaNumber}ನೇ ಭಾವದಲ್ಲಿರುವ ಗ್ರಹಗಳು (${planetsInSelectedBhava.length})`
                    : `Planets Situated in House #${selectedBhavaNumber} for Entered Native (${planetsInSelectedBhava.length})`}
                </span>
              </h5>
              <span className="text-xs text-stone-500 font-mono">
                {rashiName ? `${rashiName} Rashi` : ''}
              </span>
            </div>

            {planetsInSelectedBhava.length === 0 ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
                <p className="text-xs text-stone-500 dark:text-stone-400 text-center">
                  {currentLang === 'kn'
                    ? `ಈ ಜಾತಕದಲ್ಲಿ ${selectedBhavaNumber}ನೇ ಭಾವವು ಶೂನ್ಯವಾಗಿದೆ (ಯಾವುದೇ ಗ್ರಹವಿಲ್ಲ). ಈ ಭಾವದ ಫಲವನ್ನು ಇದರ ಅಧಿಪತಿ ಮತ್ತು ಈ ಭಾವವನ್ನು ನೋಡುವ ದೃಷ್ಟಿ ಗ್ರಹಗಳಿಂದ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ.`
                    : `This house is vacant (no grahas situated). Its effects are determined by its sign lord (${rashiName}) and planetary aspects casting upon it.`}
                </p>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>{currentLang === 'kn' ? '೯ ಗ್ರಹಗಳು ಈ ಭಾವದಲ್ಲಿದ್ದರೆ ಏನು ಫಲ? (ಕ್ಲಿಕ್ ಮಾಡಿ ಪರಿಶೀಲಿಸಿ):' : 'Explore what each planet does in House #' + selectedBhavaNumber + ':'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('grahaEffects')}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <span>{currentLang === 'kn' ? 'ಎಲ್ಲಾ ಗ್ರಹಗಳ ಫಲಗಳು' : 'All 9 Grahas Guide'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_GRAHA_LIST.map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => {
                          setSelectedGraha(g.key);
                          setActiveTab('grahaEffects');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <SvgGrahaIcon name={g.key} size={14} />
                        <span>{currentLang === 'kn' ? g.kn : g.en}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {planetsInSelectedBhava.map((planet) => {
                  const bala = balaMap.get(planet.name);
                  const detailedEffect = getDetailedGrahaBhavaEffect(planet.name, selectedBhavaNumber);

                  return (
                    <div
                      key={planet.name}
                      className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-700 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <SvgGrahaIcon name={planet.name} size={30} isRetrograde={planet.isRetrograde} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                                {planet.sanskritName[currentLang]} ({planet.name})
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                detailedEffect.nature === 'Auspicious'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                  : detailedEffect.nature === 'Mixed'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300'
                              }`}>
                                {detailedEffect.natureLocalized[currentLang]}
                              </span>
                            </div>
                            <span className="text-xs text-stone-500 font-mono">
                              {planet.degrees}° in {planet.nakshatra[currentLang]} • {planet.rashiName[currentLang]}
                            </span>
                          </div>
                        </div>

                        {bala && (
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-mono font-bold block text-amber-700 dark:text-amber-400">
                              Bala: {bala.totalScore}/100 ({bala.level.toUpperCase()})
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                        {detailedEffect.summary[currentLang]}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                            {currentLang === 'kn' ? 'ವೃತ್ತಿ & ಆರ್ಥಿಕ ಪ್ರಭಾವ' : 'Career & Wealth'}
                          </span>
                          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                            {detailedEffect.effects.careerAndWealth[currentLang]}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block">
                            {currentLang === 'kn' ? 'ಬಾಂಧವ್ಯ & ಆರೋಗ್ಯ' : 'Relationships & Health'}
                          </span>
                          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                            {detailedEffect.effects.relationshipsAndHealth[currentLang]}
                          </p>
                        </div>
                      </div>

                      {/* Remedy */}
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಶಾಂತಿ ಪರಿಹಾರ & ಮಂತ್ರ' : 'Classical Vedic Remedy'}</span>
                        </span>
                        <p className="text-stone-700 dark:text-stone-300">
                          {detailedEffect.remedy.action[currentLang]}
                        </p>
                        <p className="text-[11px] font-mono text-amber-900 dark:text-amber-300">
                          <strong>ಮಂತ್ರ:</strong> {detailedEffect.remedy.mantra} ({detailedEffect.remedy.mantraCount})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1 EMBEDDED: GRAHA DRISHTI QUICK SUMMARY FOR CURRENT BHAVA */}
          {/* ========================================================================= */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/80 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-rose-300 dark:border-rose-900/60 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200 dark:border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{currentLang === 'kn' ? 'ಈ ಭಾವದ ಮೇಲಿರುವ ಗ್ರಹ ದೃಷ್ಟಿಗಳು (Planetary Aspects on this House)' : 'Planetary Aspects (Drishti) on this House'}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300">
                      {houseDrishti.aspectingPlanets.length} {currentLang === 'kn' ? 'ಗ್ರಹಗಳು' : 'Aspects'}
                    </span>
                  </h5>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    {houseDrishti.overallDrishtiToneLocalized[currentLang]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('drishtiRemedies')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>{currentLang === 'kn' ? 'ಸಂಪೂರ್ಣ ದೃಷ್ಟಿ & ಆಹಾರ-ಪರಿಹಾರ ವೀಕ್ಷಿಸಿ' : 'View Full Drishti & Remedies'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {houseDrishti.aspectingPlanets.length === 0 ? (
              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                {currentLang === 'kn'
                  ? 'ಈ ಭಾವದ ಮೇಲೆ ಯಾವುದೇ ಇತರ ಗ್ರಹಗಳ ನೇರ ಪರಾಶರಿ ದೃಷ್ಟಿಯಿಲ್ಲ. ಈ ಭಾವದ ಫಲವು ಕೇವಲ ಭಾವಸ್ಥ ಗ್ರಹಗಳು ಮತ್ತು ಭಾವಾಧಿಪತಿಯ ಬಲದಿಂದ ನಿರ್ಧರಿತವಾಗುತ್ತದೆ.'
                  : 'No external Grahas cast direct Parashari aspects onto this house. Results depend exclusively on occupant planets and the house lord.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {houseDrishti.aspectingPlanets.map((aspect, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <SvgGrahaIcon name={aspect.aspectingPlanet.name} size={22} isRetrograde={aspect.aspectingPlanet.isRetrograde} />
                        <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                          {aspect.aspectingPlanet.sanskritName[currentLang]}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          (H#{aspect.aspectingPlanet.bhava})
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        aspect.nature === 'benefic'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}>
                        {aspect.natureLocalized[currentLang]}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400">
                      {aspect.aspectTypeLocalized[currentLang]}
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2">
                      {aspect.effectOnHouse[currentLang]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW TAB: COMPREHENSIVE GRAHA DRISHTI, PHYSICAL & MENTAL EFFECTS & NUTRITION */}
      {/* ========================================================================= */}
      {activeTab === 'drishtiRemedies' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-900 via-stone-900 to-indigo-950 text-white border-2 border-rose-500/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white">
                    Bhava #{selectedBhavaNumber} Drishti Analysis
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/40">
                    {houseDrishti.overallDrishtiToneLocalized[currentLang]}
                  </span>
                  <span className="text-xs font-mono text-stone-300">
                    Rashi: {houseDrishti.rashiName[currentLang]}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-black text-amber-300">
                  {currentLang === 'kn'
                    ? `${selectedBhavaNumber}ನೇ ಭಾವದ ಗ್ರಹ ದೃಷ್ಟಿ ವಿಶ್ಲೇಷಣೆ, ಮನೋ-ದೈಹಿಕ ಪ್ರಭಾವ ಮತ್ತು ಪೋಷಕಾಂಶ ಪರಿಹಾರಗಳು`
                    : currentLang === 'hi'
                    ? `${selectedBhavaNumber}वें भाव का ग्रह दृष्टि विश्लेषण, शारीरिक-मानसिक प्रभाव एवं पोषण उपचार`
                    : `House #${selectedBhavaNumber} Planetary Drishti, Mind-Body Impacts & Nutritional Remedies`}
                </h4>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-3xl leading-relaxed">
                  {currentLang === 'kn'
                    ? 'ಪರಾಶರ ಶಾಸ್ತ್ರದ ದೃಷ್ಟಿ ತತ್ವಗಳು (೭ನೇ ಪೂರ್ಣ ದೃಷ್ಟಿ, ಕುಜನ ೪/೮, ಗುರುವಿನ ೫/೯, ಶನಿಯ ೩/೧೦, ರಾಹು-ಕೇತುವಿನ ೫/೯ ದೃಷ್ಟಿ). ಈ ದೃಷ್ಟಿಗಳು ಈ ಭಾವದ ನೈಸರ್ಗಿಕ ಕಾರಕತ್ವ, ಭಾವಸ್ಥ ಗ್ರಹಗಳು ಮತ್ತು ಮಾನವ ಶರೀರದ ಅಂಗಾಂಗ-ಮನೋವೃತ್ತಿಗಳನ್ನು ಹೇಗೆ ಪ್ರಭಾವಿಸುತ್ತವೆ ಎಂಬುದರ ವಿವರ.'
                    : 'Classical Parashari aspects (7th full aspect, Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th, Rahu/Ketu 5th/9th). How these glances alter the house’s energy, occupant planets, anatomical health, and psychological temperament.'}
                </p>
              </div>

              {/* Score Badges */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
                    {currentLang === 'kn' ? 'ಶುಭ ದೃಷ್ಟಿಗಳು' : 'Benefic Drishtis'}
                  </span>
                  <span className="text-lg font-serif font-bold text-emerald-200">
                    {houseDrishti.beneficAspectCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-center">
                  <span className="text-[10px] uppercase font-mono font-bold text-rose-400 block">
                    {currentLang === 'kn' ? 'ಕ್ರೂರ/ತೀವ್ರ ದೃಷ್ಟಿಗಳು' : 'Malefic Drishtis'}
                  </span>
                  <span className="text-lg font-serif font-bold text-rose-200">
                    {houseDrishti.maleficAspectCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Occupants & Aspects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Left: Occupant Grahas & Aspecting Grahas */}
            <div className="space-y-4">
              
              {/* Occupant Grahas Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-amber-300 dark:border-stone-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? `ಭಾವ #${selectedBhavaNumber} ರಲ್ಲಿ ಸ್ಥಿತವಾಗಿರುವ ಗ್ರಹಗಳು (ಭಾವಸ್ಥ)` : `Planets Positioned Inside House #${selectedBhavaNumber}`}
                    </h5>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200">
                    {houseDrishti.occupantPlanets.length} {currentLang === 'kn' ? 'ಗ್ರಹ' : 'Grahas'}
                  </span>
                </div>

                {houseDrishti.occupantPlanets.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 italic">
                    {currentLang === 'kn'
                      ? 'ಈ ಭಾವದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹಗಳು ನೇರವಾಗಿ ಸ್ಥಿತವಾಗಿಲ್ಲ (ಖಾಲಿ ಭಾವ). ಈ ಭಾವದ ಫಲಿತಾಂಶವು ಭಾವಾಧಿಪತಿ (Lord) ಮತ್ತು ಈ ಭಾವದ ಮೇಲೆ ಬೀಳುವ ಗ್ರಹಗಳ ದೃಷ್ಟಿಯ ಮೇಲೆ ಸಂಪೂರ್ಣ ಅವಲಂಬಿತವಾಗಿರುತ್ತದೆ.'
                      : 'This house is unoccupied in the native’s birth chart. Its manifestations are directed by its ruling lord and incoming planetary aspects.'}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {houseDrishti.occupantPlanets.map((planet) => (
                      <div
                        key={planet.name}
                        className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <SvgGrahaIcon name={planet.name} size={28} isRetrograde={planet.isRetrograde} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                                {planet.sanskritName[currentLang]} ({planet.name})
                              </span>
                              {planet.isRetrograde && (
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 font-mono">
                                  [ವಕ್ರ - Retrograde]
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-600 dark:text-stone-400">
                              {planet.degrees}° • {planet.nakshatra[currentLang]} (Pada {planet.pada})
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-white dark:bg-stone-800 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-stone-700">
                          Lord of H#{planet.isLordOf.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspecting Grahas Detailed List */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-rose-300 dark:border-stone-700 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-rose-600" />
                    <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {currentLang === 'kn' ? `ಈ ಭಾವದ ಮೇಲೆ ದೃಷ್ಟಿ ಬೀರುತ್ತಿರುವ ಗ್ರಹಗಳು (${houseDrishti.aspectingPlanets.length})` : `Planets Casting Drishti on House #${selectedBhavaNumber} (${houseDrishti.aspectingPlanets.length})`}
                    </h5>
                  </div>
                  <span className="text-xs font-mono text-stone-500">
                    Parashari Drishti
                  </span>
                </div>

                {houseDrishti.aspectingPlanets.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 italic">
                    {currentLang === 'kn'
                      ? 'ಈ ಕುಂಡಲಿಯಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹವು ಈ ಭಾವದ ಮೇಲೆ ನೇರ ಪರಾಶರಿ ದೃಷ್ಟಿ ಬೀರುತ್ತಿಲ್ಲ.'
                      : 'No other graha casts a direct classical aspect onto this house.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {houseDrishti.aspectingPlanets.map((aspect, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 hover:border-rose-400 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <SvgGrahaIcon name={aspect.aspectingPlanet.name} size={26} isRetrograde={aspect.aspectingPlanet.isRetrograde} />
                            <div>
                              <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                                {aspect.aspectingPlanet.sanskritName[currentLang]} ({aspect.aspectingPlanet.name})
                              </span>
                              <span className="text-xs text-stone-500 ml-1.5 font-mono">
                                Seated in House #{aspect.aspectingPlanet.bhava} ({aspect.aspectingPlanet.rashiName[currentLang]})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                              {aspect.distanceFromPlanet}th Aspect
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              aspect.nature === 'benefic'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            }`}>
                              {aspect.natureLocalized[currentLang]}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs font-mono font-bold text-rose-800 dark:text-rose-400">
                          {aspect.aspectTypeLocalized[currentLang]}
                        </div>

                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                          {aspect.effectOnHouse[currentLang]}
                        </p>

                        {aspect.effectOnOccupants && (
                          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200">
                            <strong>{currentLang === 'kn' ? 'ಭಾವಸ್ಥ ಗ್ರಹಗಳ ಮೇಲಿನ ಪ್ರಭಾವ:' : 'Effect on Occupant Grahas:'}</strong> {aspect.effectOnOccupants[currentLang]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right: Physical Conditions & Mental Conditions */}
            <div className="space-y-4">
              
              {/* Card 1: Physical Health & Vitality Impact */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-red-200 dark:border-stone-700 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-red-100 dark:border-stone-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    <div>
                      <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                        {currentLang === 'kn' ? 'ಶಾರೀರಿಕ ಪರಿಸ್ಥಿತಿ & ಆರೋಗ್ಯದ ಮೇಲಿನ ಪ್ರಭಾವ' : 'Physical Conditions & Health Impact'}
                      </h5>
                      <span className="text-[11px] text-stone-500">
                        Biological Doshas, Vital Organs & Immunity
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300">
                    Anatomy
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-50/60 dark:bg-stone-900 border border-red-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-red-800 dark:text-red-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಈ ಭಾವಕ್ಕೆ ಸೇರಿದ ಶಾರೀರಿಕ ಅಂಗಗಳು:' : 'Governed Anatomical Organs:'}
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 font-semibold">
                      {houseDrishti.physicalImpact.governedOrgans[currentLang]}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-stone-900 border border-orange-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-orange-800 dark:text-orange-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಜೀವಶಕ್ತಿ & ರೋಗನಿರೋಧಕ ಸಾಮರ್ಥ್ಯ (Vitality):' : 'Vitality & Immune Constitution:'}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {houseDrishti.physicalImpact.vitalityEffect[currentLang]}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-stone-900 border border-amber-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಗಮನಿಸಬೇಕಾದ ಸಂಭವನೀಯ ದೈಹಿಕ ಸೂಕ್ಷ್ಮತೆಗಳು (Vulnerabilities):' : 'Potential Health Sensitivities:'}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {houseDrishti.physicalImpact.vulnerabilities[currentLang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Mental & Emotional Constitution Impact */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-850 border border-purple-200 dark:border-stone-700 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-purple-100 dark:border-stone-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div>
                      <h5 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                        {currentLang === 'kn' ? 'ಮಾನಸಿಕ & ಭಾವನಾತ್ಮಕ ಪ್ರಭಾವ (Mind & Temperament)' : 'Mental & Emotional Conditions Impact'}
                      </h5>
                      <span className="text-[11px] text-stone-500">
                        Cognitive Clarity, Stress Coping & Emotions
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                    Psychology
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-stone-900 border border-purple-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-purple-800 dark:text-purple-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಮನೋಧರ್ಮ & ಸ್ವಭಾವ (Innate Temperament):' : 'Innate Temperament & Disposition:'}
                    </span>
                    <p className="text-stone-800 dark:text-stone-200 font-semibold leading-relaxed">
                      {houseDrishti.mentalImpact.temperament[currentLang]}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-stone-900 border border-indigo-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-indigo-800 dark:text-indigo-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಭಾವನಾತ್ಮಕ ಒಲವು & ಮನಸ್ಸಿನ ಪ್ರತಿಕ್ರಿಯೆಗಳು:' : 'Emotional Tendencies & Reactions:'}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {houseDrishti.mentalImpact.emotionalTendencies[currentLang]}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-stone-700 dark:text-stone-300 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಒತ್ತಡಕ್ಕೆ ಕಾರಣವಾಗುವ ಅಂಶಗಳು (Stress Triggers):' : 'Primary Stress Triggers:'}
                    </span>
                    <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                      {houseDrishti.mentalImpact.stressTriggers[currentLang]}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-stone-900 border border-emerald-100 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block uppercase tracking-wider text-[10px]">
                      {currentLang === 'kn' ? 'ಬುದ್ಧಿಶಕ್ತಿ & ತೀರ್ಮಾನ ಸಾಮರ್ಥ್ಯ (Cognitive Strength):' : 'Cognitive & Intellectual Discernment:'}
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                      {houseDrishti.mentalImpact.cognitiveStrength[currentLang]}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Section 2: Comprehensive Nutritional & Dietary Therapy Remedies */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-emerald-400 dark:border-emerald-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Apple className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Ayurvedic Dietetics & Biochemical Nutrition
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn'
                      ? 'ಆಹಾರ ಮತ್ತು ಪೋಷಕಾಂಶ ಚಿಕಿತ್ಸೆ (Nutritional & Dietary Therapy)'
                      : currentLang === 'hi'
                      ? 'आहार एवं पोषण उपचार (Nutritional & Dietary Remedies)'
                      : 'Nutritional Therapy & Ayurvedic Dietary Remediation'}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                Pitta-Vata-Kapha Harmonization
              </span>
            </div>

            {/* 4 Pillars of Nutrition */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* 1. Recommended Foods */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-emerald-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Apple className="w-4 h-4 text-emerald-600" />
                  <span>{currentLang === 'kn' ? 'ಸೇವಿಸಬೇಕಾದ ಸಾತ್ವಿಕ ಆಹಾರ' : 'Recommended Foods'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.nutritionalTherapy.recommendedFoods[currentLang]}
                </p>
              </div>

              {/* 2. Vitamins & Micronutrients */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-teal-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>{currentLang === 'kn' ? 'ಅಗತ್ಯ ವಿಟಮಿನ್‌ಗಳು & ಪೋಷಕಾಂಶ' : 'Vitamins & Minerals'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.nutritionalTherapy.vitaminsAndNutrients[currentLang]}
                </p>
              </div>

              {/* 3. Ayurvedic Herbs & Teas */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ಆಯುರ್ವೇದೀಯ ಗಿಡಮೂಲಿಕೆಗಳು' : 'Ayurvedic Herbs & Teas'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.nutritionalTherapy.ayurvedicHerbs[currentLang]}
                </p>
              </div>

              {/* 4. Foods to Strictly Avoid */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>{currentLang === 'kn' ? 'ತ್ಯಜಿಸಬೇಕಾದ/ಮಿತಗೊಳಿಸಬೇಕಾದ ಆಹಾರ' : 'Foods to Avoid / Limit'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.nutritionalTherapy.foodsToAvoid[currentLang]}
                </p>
              </div>

            </div>

            {/* Sacred Dietary Ritual */}
            <div className="p-3.5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div className="text-stone-800 dark:text-stone-200">
                <strong>{currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೀಯ ಆಹಾರ ಸೇವನಾ ನಿಯಮ:' : 'Sacred Eating Discipline:'}</strong> {houseDrishti.nutritionalTherapy.dietaryRitual[currentLang]}
              </div>
            </div>
          </div>

          {/* Section 3: Classical Vedic Astrological Remedies */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 border-2 border-amber-400 dark:border-amber-700 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <ShieldCheck className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      Vedic Parashari Remedies
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                    {currentLang === 'kn'
                      ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳು (Mantras, Gemstone, Daanam & Rituals)'
                      : currentLang === 'hi'
                      ? 'वैदिक ज्योतिषीय उपाय (मन्त्र, रत्न, दान एवं साधना)'
                      : 'Classical Vedic Astrological Remediation'}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                Graha Shanti & Karma Alignment
              </span>
            </div>

            {/* 4 Pillars of Astrological Remedies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* 1. Mantra */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಮಂತ್ರ & ಜಪ' : 'Vedic Mantra & Japa'}</span>
                </div>
                <p className="text-stone-800 dark:text-stone-200 font-serif font-bold text-xs leading-relaxed">
                  {houseDrishti.astrologicalRemedies.vedicMantra[currentLang]}
                </p>
              </div>

              {/* 2. Gemstone & Rudraksha */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-purple-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>{currentLang === 'kn' ? 'ರತ್ನ & ರುದ್ರಾಕ್ಷಿ ಧಾರಣೆ' : 'Gemstone & Rudraksha'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.astrologicalRemedies.gemstoneAndRudraksha[currentLang]}
                </p>
              </div>

              {/* 3. Daanam Charity */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-indigo-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-indigo-600" />
                  <span>{currentLang === 'kn' ? 'ದಾನ-ಧರ್ಮ & ಶುಭ ದಿನ' : 'Auspicious Charity (Daanam)'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.astrologicalRemedies.daanamCharity[currentLang]}
                </p>
              </div>

              {/* 4. Spiritual Practice */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-rose-200 dark:border-stone-700 shadow-xs space-y-2">
                <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>{currentLang === 'kn' ? 'ದೈನಂದಿನ ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ' : 'Daily Spiritual Practice'}</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {houseDrishti.astrologicalRemedies.spiritualPractice[currentLang]}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EDUCATIONAL EXPLANATION - WHAT IS BHAVA & WHAT ARE THESE BHAVAS */}
      {/* ========================================================================= */}
      {activeTab === 'nineBhavas' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{currentLang === 'kn' ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ತತ್ವಶಾಸ್ತ್ರ' : 'Vedic Astrological Philosophy'}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
              {currentLang === 'kn' ? 'ಭಾವ ಎಂದರೇನು? (What is a Bhava?)' : 'What is a Bhava in Vedic Astrology?'}
            </h4>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
              {currentLang === 'kn'
                ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ "ಭಾವ" ಎಂದರೆ ಕೇವಲ ಒಂದು ಮನೆಯಲ್ಲ; ಅದು ಮಾನವ ಜೀವನದ ಪ್ರಜ್ಞೆಯ ಒಂದು ಆಯಾಮ ಅಥವಾ ಅನುಭವದ ರಂಗ. ಜನನದ ಕ್ಷಣದಲ್ಲಿ ಪೂರ್ವ ದಿಗಂತದಲ್ಲಿ ಉದಯಿಸುತ್ತಿರುವ ರಾಶಿಯು ಮೊದಲನೇ ಭಾವ (ಲಗ್ನ - ತನು ಭಾವ) ಆಗುತ್ತದೆ. ಅಲ್ಲಿಂದ ಆರಂಭಿಸಿ ಇಡೀ ೩೬೦ ಡಿಗ್ರಿಗಳ ಆಕಾಶವನ್ನು ೧೨ ಸಮಾನ ಭಾವಗಳಾಗಿ ವಿಂಗಡಿಸಲಾಗುತ್ತದೆ.'
                : 'In Parashari Vedic Astrology, a "Bhava" translates as a state of existence, realm of experience, or house of consciousness. At the moment of birth, the exact degree of the zodiac rising on the eastern horizon marks the 1st House (Lagna / Tanu Bhava). From this vantage point, the entire 360° celestial sphere is segmented into 12 Bhavas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* The 4 Purusharthas (Life Pursuits) in the Bhavas */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
              <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? '೪ ಪುರುಷಾರ್ಥಗಳು ಮತ್ತು ಭಾವಗಳ ವಿಭಜನೆ' : 'The 4 Purusharthas (Soul Objectives)'}</span>
              </h5>
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <strong className="text-amber-800 dark:text-amber-300">೧) ಧರ್ಮ ತ್ರಿಕೋಣ (Houses 1, 5, 9):</strong> ಕರ್ತವ್ಯ, ಸತ್ಕರ್ಮ, ಆತ್ಮ ಸಾಕ್ಷಾತ್ಕಾರ, ದೈವಾನುಗ್ರಹ ಮತ್ತು ನೀತಿ ಮಾರ್ಗ.
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <strong className="text-emerald-800 dark:text-emerald-300">೨) ಅರ್ಥ ತ್ರಿಕೋಣ (Houses 2, 6, 10):</strong> ಸಂಪತ್ತು, ಆರ್ಥಿಕ ಸ್ಥಿರತೆ, ಉದ್ಯೋಗ ಕರ್ತವ್ಯ, ಸಮಾಜ ಸೇವೆ ಮತ್ತು ಕರ್ಮ.
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <strong className="text-rose-800 dark:text-rose-300">೩) ಕಾಮ ತ್ರಿಕೋಣ (Houses 3, 7, 11):</strong> ಆಸೆ-ಆಕಾಂಕ್ಷೆಗಳು, ಒಡಹುಟ್ಟಿದವರು, ವಿವಾಹ, ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಲಾಭ.
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                  <strong className="text-purple-800 dark:text-purple-300">೪) ಮೋಕ್ಷ ತ್ರಿಕೋಣ (Houses 4, 8, 12):</strong> ಮನಶಾಂತಿ, ಆಧ್ಯಾತ್ಮಿಕ ಅನ್ವೇಷಣೆ, ರಹಸ್ಯ ಜ್ಞಾನ ಮತ್ತು ಭವಬಂಧನ ಮುಕ್ತಿ.
                </div>
              </div>
            </div>

            {/* Why 9 Bhavas are specifically emphasized */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
              <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಕುಂಡಲಿಯ ಪ್ರಮುಖ ಕೇಂದ್ರ-ತ್ರಿಕೋಣ ಭಾವಗಳು' : 'The Essential Kendras & Trikonas'}</span>
              </h5>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {currentLang === 'kn'
                  ? 'ಕುಂಡಲಿಯಲ್ಲಿ ೪ ಕೇಂದ್ರಗಳು (೧, ೪, ೭, ೧೦ - ವಿಷ್ಣು ಸ್ಥಾನಗಳು) ಜೀವನದ ಅಡಿಪಾಯವನ್ನು ನಿರ್ಮಿಸಿದರೆ, ತ್ರಿಕೋಣಗಳು (೧, ೫, ೯ - ಲಕ್ಷ್ಮೀ ಸ್ಥಾನಗಳು) ಜಾತಕನಿಗೆ ದೈವಕೃಪೆ, ಉನ್ನತ ಭಾಗ್ಯ ಮತ್ತು ಯಶಸ್ಸನ್ನು ಕರುಣಿಸುತ್ತವೆ. ಈ ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣಗಳ ಸಮನ್ವಯವೇ ವ್ಯಕ್ತಿಯ ಜೀವನದ ಮುಖ್ಯ ಶಕ್ತಿಯಾಗಿದೆ.'
                  : 'The 4 Kendras (1, 4, 7, 10) are the Pillars of Vishnu representing dynamic worldly action, while the Trikonas (1, 5, 9) are the Auspicious Lakshmi Sthanas of divine luck and grace. Together they form the backbone of life.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-bold">1st: Lagna (Self)</span>
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-bold">4th: Sukha (Home)</span>
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-bold">7th: Kalatra (Spouse)</span>
                <span className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-bold">10th: Karma (Career)</span>
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-900 font-bold">5th: Punya (Intellect)</span>
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-900 font-bold">9th: Bhagya (Grace)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PLANETS IN HOUSE LIST */}
      {/* ========================================================================= */}
      {activeTab === 'planetsInHouse' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <span className="font-bold text-xs text-stone-700 dark:text-stone-300">
              {currentLang === 'kn' ? `${selectedBhavaNumber}ನೇ ಭಾವದಲ್ಲಿರುವ ಗ್ರಹಗಳ ವಿಶ್ಲೇಷಣೆ:` : `Planetary Details for House #${selectedBhavaNumber}:`}
            </span>
            <span className="text-xs font-mono text-stone-500">
              Count: {planetsInSelectedBhava.length}
            </span>
          </div>

          {planetsInSelectedBhava.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
              {currentLang === 'kn'
                ? `ಪ್ರಸ್ತುತ ಜಾತಕದಲ್ಲಿ ${selectedBhavaNumber}ನೇ ಭಾವದಲ್ಲಿ ಯಾವುದೇ ಗ್ರಹ ಸ್ಥಿತವಾಗಿಲ್ಲ.`
                : `No planets are currently placed in House #${selectedBhavaNumber}. Click other house buttons above to inspect occupied houses.`}
            </div>
          ) : (
            <div className="space-y-3">
              {planetsInSelectedBhava.map((p) => {
                const b = balaMap.get(p.name);

                return (
                  <div
                    key={p.name}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-amber-300 dark:border-stone-700 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SvgGrahaIcon name={p.name} size={28} isRetrograde={p.isRetrograde} />
                        <div>
                          <h6 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                            {p.sanskritName[currentLang]} ({p.name})
                          </h6>
                          <span className="text-xs text-stone-500 font-mono">
                            {p.degrees}° {p.nakshatra[currentLang]} • {p.rashiName[currentLang]}
                          </span>
                        </div>
                      </div>

                      {b && (
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                            Bala Score: {b.totalScore}/100
                          </span>
                          <span className="block text-[11px] text-stone-500">
                            Level: <strong className="capitalize">{b.level}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span>{p.isRetrograde ? '⚡ ವಕ್ರ ಗತಿಯಲ್ಲಿದ್ದಾನೆ (Retrograde) • ' : ''}</span>
                      <span>
                        {currentLang === 'kn'
                          ? `ಈ ಗ್ರಹವು ${selectedBhava.sanskritName[currentLang]}ದ ಮೇಲೆ ಪ್ರಮುಖ ಪ್ರಭಾವ ಬೀರುತ್ತದೆ.`
                          : `Exerts primary astrological influence over House #${selectedBhavaNumber} domain.`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMPREHENSIVE GRAHA-BHAVA EFFECTS (EACH GRAHA IN EACH BHAVA) */}
      {/* ========================================================================= */}
      {activeTab === 'grahaEffects' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-stone-900 text-white space-y-2 border border-purple-500/40 shadow-xl">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{currentLang === 'kn' ? 'ಪರಾಶರ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ • ಗ್ರಹ-ಭಾವ ಸಿದ್ಧಾಂತ' : 'Parashari Vedic Astrology • Graha-Bhava Principles'}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
              {currentLang === 'kn' ? 'ಪ್ರತಿಯೊಂದು ಭಾವದಲ್ಲಿ ೯ ಗ್ರಹಗಳ ಫಲಗಳು' : 'Effects of Each Graha in Each Bhava'}
            </h4>
            <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-4xl">
              {currentLang === 'kn'
                ? 'ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ ಗ್ರಹಗಳು ಶಕ್ತಿಯ ಆಕರವಾದರೆ (Forces), ಭಾವಗಳು ಆ ಶಕ್ತಿಯು ವ್ಯಕ್ತವಾಗುವ ಜೀವನ ಕ್ಷೇತ್ರಗಳು (Arenas). ಸೂರ್ಯ, ಚಂದ್ರ, ಕುಜ, ಬುಧ, ಗುರು, ಶುಕ್ರ, ಶನಿ, ರಾಹು ಹಾಗೂ ಕೇತುಗಳು ೧ ರಿಂದ ೧೨ ಭಾವಗಳಲ್ಲಿ ನೆಲೆಸಿದಾಗ ಉಂಟಾಗುವ ನಿರ್ದಿಷ್ಟ ಶುಭಾಶುಭ ಫಲಗಳು ಹಾಗೂ ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರಗಳನ್ನು ಕೆಳಗೆ ವಿವರವಾಗಿ ತಿಳಿಯಿರಿ.'
                : 'In Vedic Astrology, Grahas (Planets) represent cosmic drivers of karma, while Bhavas (Houses) represent the specific arenas of life experience. Explore the classical Parashari results and Vedic remedies for all 9 Grahas across all 12 houses.'}
            </p>
          </div>

          {/* Planet Selector Bar (Surya to Ketu) */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentLang === 'kn' ? 'ಗ್ರಹವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Graha):' : 'Select a Graha to Analyze:'}</span>
              </span>

              {/* Scope Switcher */}
              <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold gap-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGrahaViewScope('currentBhava')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    grahaViewScope === 'currentBhava'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {currentLang === 'kn' ? `ಭಾವ #${selectedBhavaNumber} ರಲ್ಲಿ ಫಲ` : `In House #${selectedBhavaNumber}`}
                </button>
                <button
                  type="button"
                  onClick={() => setGrahaViewScope('all12Bhavas')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    grahaViewScope === 'all12Bhavas'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {currentLang === 'kn' ? '೧೨ ಭಾವಗಳ ಸಮಗ್ರ ಕೋಷ್ಟಕ' : 'Across All 12 Houses'}
                </button>
              </div>
            </div>

            {/* 9 Planets Quick Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
              {ALL_GRAHA_LIST.map((g) => {
                const isSelected = selectedGraha === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setSelectedGraha(g.key)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-500 shadow-md ring-2 ring-purple-400/50 scale-102'
                        : 'bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-purple-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <SvgGrahaIcon name={g.key} size={22} />
                    <span className="font-serif font-bold text-xs">
                      {currentLang === 'kn' ? g.kn : g.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SCOPE 1: CURRENT SELECTED HOUSE */}
          {grahaViewScope === 'currentBhava' && (
            <div className="space-y-4">
              {(() => {
                const effect = getDetailedGrahaBhavaEffect(selectedGraha, selectedBhavaNumber);

                return (
                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-purple-50/40 dark:from-stone-850 dark:via-stone-900 dark:to-stone-850 border-2 border-amber-300 dark:border-stone-700 shadow-lg space-y-4">
                    
                    {/* Title & Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                      <div className="flex items-center gap-3">
                        <SvgGrahaIcon name={selectedGraha} size={36} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
                              {effect.title[currentLang]}
                            </h5>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              effect.nature === 'Auspicious'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                                : effect.nature === 'Mixed'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                            }`}>
                              {effect.natureLocalized[currentLang]}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 font-mono">
                            {effect.planetName[currentLang]} • {selectedBhava.sanskritName[currentLang]}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-800">
                          {selectedBhava.categoryLocalized[currentLang]}
                        </span>
                      </div>
                    </div>

                    {/* Shastric Summary */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700">
                      <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                        {effect.summary[currentLang]}
                      </p>
                    </div>

                    {/* 3 Detailed Spheres: Persona, Career/Wealth, Relationships/Health */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          <span>{currentLang === 'kn' ? 'ಸ್ವಭಾವ & ದೈಹಿಕ ಪ್ರಭಾವ' : 'Persona & Physical Impact'}</span>
                        </span>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                          {effect.effects.general[currentLang]}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{currentLang === 'kn' ? 'ವೃತ್ತಿ & ಧನಾರ್ಜನೆ' : 'Career & Wealth'}</span>
                        </span>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                          {effect.effects.careerAndWealth[currentLang]}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5 shadow-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                          <span>{currentLang === 'kn' ? 'ಬಾಂಧವ್ಯ & ದಾಂಪತ್ಯ' : 'Relationships & Marriage'}</span>
                        </span>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                          {effect.effects.relationshipsAndHealth[currentLang]}
                        </p>
                      </div>
                    </div>

                    {/* Authentic Vedic Remedy Panel */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-950/40 border border-amber-300 dark:border-amber-900/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>{currentLang === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಪರಿಹಾರ & ಬೀಜ ಮಂತ್ರ ಜಪ (Vedic Remedy):' : 'Prescribed Vedic Parihara & Japa:'}</span>
                        </span>
                        <span className="text-[11px] font-mono text-stone-600 dark:text-stone-400">
                          {currentLang === 'kn' ? 'ವಾರದ ದಿನ:' : 'Day:'} <strong>{effect.remedy.charityDay[currentLang]}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                        {effect.remedy.action[currentLang]}
                      </p>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-amber-900 dark:text-amber-300 font-bold">
                          {effect.remedy.mantra}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 font-semibold shrink-0">
                          Count: {effect.remedy.mantraCount}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Quick 9 Planets Grid for this House */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-3">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {currentLang === 'kn' ? `ಭಾವ #${selectedBhavaNumber} ರಲ್ಲಿ ಇತರ ಎಲ್ಲಾ ೯ ಗ್ರಹಗಳ ಸಾರಾಂಶ:` : `Quick summary of all 9 planets in House #${selectedBhavaNumber}:`}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {ALL_GRAHA_LIST.map((g) => {
                    const ef = getDetailedGrahaBhavaEffect(g.key, selectedBhavaNumber);
                    return (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setSelectedGraha(g.key)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedGraha === g.key
                            ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-bold font-serif">
                            <SvgGrahaIcon name={g.key} size={16} />
                            <span>{currentLang === 'kn' ? g.kn : g.en}</span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            ef.nature === 'Auspicious' ? 'bg-emerald-100 text-emerald-800' :
                            ef.nature === 'Mixed' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ef.nature}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-tight">
                          {ef.summary[currentLang]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SCOPE 2: ACROSS ALL 12 HOUSES FOR SELECTED GRAHA */}
          {grahaViewScope === 'all12Bhavas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <SvgGrahaIcon name={selectedGraha} size={24} />
                  <span>
                    {currentLang === 'kn'
                      ? `೧ ರಿಂದ ೧೨ ಭಾವಗಳಲ್ಲಿ ${selectedGraha} ಗ್ರಹದ ಸಂಪೂರ್ಣ ಫಲಗಳು:`
                      : `Complete Parashari Effects of ${selectedGraha} Across Houses 1 to 12:`}
                  </span>
                </h5>
                <span className="text-xs text-purple-700 dark:text-purple-400 font-mono font-bold">
                  12 Houses Covered
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => {
                  const ef = getDetailedGrahaBhavaEffect(selectedGraha, hNum);
                  const isCurrentSelectedHouse = hNum === selectedBhavaNumber;

                  return (
                    <div
                      key={hNum}
                      className={`p-3.5 rounded-2xl border space-y-2 flex flex-col justify-between transition-all ${
                        isCurrentSelectedHouse
                          ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-400 shadow-md ring-1 ring-purple-400'
                          : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-amber-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                              #{hNum}
                            </span>
                            <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs">
                              {ef.bhavaName[currentLang]}
                            </span>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            ef.nature === 'Auspicious' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            ef.nature === 'Mixed' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {ef.nature}
                          </span>
                        </div>

                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium line-clamp-3">
                          {ef.summary[currentLang]}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                        <span className="text-amber-800 dark:text-amber-400 font-mono text-[10px]">
                          Day: {ef.remedy.charityDay[currentLang]}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBhava(hNum);
                            setGrahaViewScope('currentBhava');
                          }}
                          className="text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>{currentLang === 'kn' ? 'ವಿವರ ವೀಕ್ಷಣೆ' : 'Inspect'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
