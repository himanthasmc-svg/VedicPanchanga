import { LocalizedString } from '../types';

export interface NakshatraPadaAkshara {
  akshara: string;
  aksharaDevanagari: string;
  aksharaKannada: string;
  nakshatraIndex: number; // 0 to 26
  nakshatraName: LocalizedString;
  pada: number; // 1 to 4
  rashiIndex: number; // 0 to 11
  rashiName: LocalizedString;
  rashiLord: LocalizedString;
}

export const NAKSHATRA_AKSHARAS: NakshatraPadaAkshara[] = [
  // 1. Ashwini (0 to 3)
  { akshara: 'Chu', aksharaDevanagari: 'चु', aksharaKannada: 'ಚು', nakshatraIndex: 0, nakshatraName: { en: 'Ashwini', kn: 'ಅಶ್ವಿನಿ', hi: 'अश्विनी' }, pada: 1, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Che', aksharaDevanagari: 'चे', aksharaKannada: 'ಚೆ', nakshatraIndex: 0, nakshatraName: { en: 'Ashwini', kn: 'ಅಶ್ವಿನಿ', hi: 'अश्विनी' }, pada: 2, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Cho', aksharaDevanagari: 'चो', aksharaKannada: 'ಚೊ', nakshatraIndex: 0, nakshatraName: { en: 'Ashwini', kn: 'ಅಶ್ವಿನಿ', hi: 'अश्विनी' }, pada: 3, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'La', aksharaDevanagari: 'ला', aksharaKannada: 'ಲಾ', nakshatraIndex: 0, nakshatraName: { en: 'Ashwini', kn: 'ಅಶ್ವಿನಿ', hi: 'अश्विनी' }, pada: 4, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },

  // 2. Bharani (4 to 7)
  { akshara: 'Lee', aksharaDevanagari: 'ली', aksharaKannada: 'ಲೀ', nakshatraIndex: 1, nakshatraName: { en: 'Bharani', kn: 'ಭರಣಿ', hi: 'भरणी' }, pada: 1, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Lu', aksharaDevanagari: 'लू', aksharaKannada: 'ಲೂ', nakshatraIndex: 1, nakshatraName: { en: 'Bharani', kn: 'ಭರಣಿ', hi: 'भरणी' }, pada: 2, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Le', aksharaDevanagari: 'ले', aksharaKannada: 'ಲೇ', nakshatraIndex: 1, nakshatraName: { en: 'Bharani', kn: 'ಭರಣಿ', hi: 'भरणी' }, pada: 3, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Lo', aksharaDevanagari: 'लो', aksharaKannada: 'ಲೋ', nakshatraIndex: 1, nakshatraName: { en: 'Bharani', kn: 'ಭರಣಿ', hi: 'भरणी' }, pada: 4, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },

  // 3. Krittika (8 to 11)
  { akshara: 'A', aksharaDevanagari: 'अ', aksharaKannada: 'ಅ', nakshatraIndex: 2, nakshatraName: { en: 'Krittika', kn: 'ಕೃತಿಕಾ', hi: 'कृत्तिका' }, pada: 1, rashiIndex: 0, rashiName: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', hi: 'मेष' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Ee', aksharaDevanagari: 'ई', aksharaKannada: 'ಈ', nakshatraIndex: 2, nakshatraName: { en: 'Krittika', kn: 'ಕೃತಿಕಾ', hi: 'कृत्तिका' }, pada: 2, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Oo', aksharaDevanagari: 'उ', aksharaKannada: 'ಉ', nakshatraIndex: 2, nakshatraName: { en: 'Krittika', kn: 'ಕೃತಿಕಾ', hi: 'कृत्तिका' }, pada: 3, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Eh', aksharaDevanagari: 'ए', aksharaKannada: 'ಎ', nakshatraIndex: 2, nakshatraName: { en: 'Krittika', kn: 'ಕೃತಿಕಾ', hi: 'कृत्तिका' }, pada: 4, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },

  // 4. Rohini (12 to 15)
  { akshara: 'O', aksharaDevanagari: 'ओ', aksharaKannada: 'ಒ', nakshatraIndex: 3, nakshatraName: { en: 'Rohini', kn: 'ರೋಹಿಣಿ', hi: 'रोहिणी' }, pada: 1, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Va', aksharaDevanagari: 'वा', aksharaKannada: 'ವಾ', nakshatraIndex: 3, nakshatraName: { en: 'Rohini', kn: 'ರೋಹಿಣಿ', hi: 'रोहिणी' }, pada: 2, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुಕ್ರ' } },
  { akshara: 'Vi', aksharaDevanagari: 'वी', aksharaKannada: 'ವಿ', nakshatraIndex: 3, nakshatraName: { en: 'Rohini', kn: 'ರೋಹಿಣಿ', hi: 'रोहिणी' }, pada: 3, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Vu', aksharaDevanagari: 'वू', aksharaKannada: 'ವು', nakshatraIndex: 3, nakshatraName: { en: 'Rohini', kn: 'ರೋಹಿಣಿ', hi: 'रोहिणी' }, pada: 4, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },

  // 5. Mrigashira (16 to 19)
  { akshara: 'Ve', aksharaDevanagari: 'वे', aksharaKannada: 'ವೇ', nakshatraIndex: 4, nakshatraName: { en: 'Mrigashira', kn: 'ಮೃಗಶಿರಾ', hi: 'मृगशिरा' }, pada: 1, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Vo', aksharaDevanagari: 'वो', aksharaKannada: 'ವೋ', nakshatraIndex: 4, nakshatraName: { en: 'Mrigashira', kn: 'ಮೃಗಶಿರಾ', hi: 'मृगशिरा' }, pada: 2, rashiIndex: 1, rashiName: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', hi: 'वृषभ' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Ka', aksharaDevanagari: 'का', aksharaKannada: 'ಕಾ', nakshatraIndex: 4, nakshatraName: { en: 'Mrigashira', kn: 'ಮೃಗಶಿರಾ', hi: 'मृगशिरा' }, pada: 3, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Kee', aksharaDevanagari: 'की', aksharaKannada: 'ಕೀ', nakshatraIndex: 4, nakshatraName: { en: 'Mrigashira', kn: 'ಮೃಗಶಿರಾ', hi: 'मृगशिरा' }, pada: 4, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },

  // 6. Ardra (20 to 23)
  { akshara: 'Ku', aksharaDevanagari: 'कु', aksharaKannada: 'ಕು', nakshatraIndex: 5, nakshatraName: { en: 'Ardra', kn: 'ಆರಿದ್ರಾ', hi: 'आर्द्रा' }, pada: 1, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Gha', aksharaDevanagari: 'घ', aksharaKannada: 'ಘ', nakshatraIndex: 5, nakshatraName: { en: 'Ardra', kn: 'ಆರಿದ್ರಾ', hi: 'आर्द्रा' }, pada: 2, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Ng', aksharaDevanagari: 'ङ', aksharaKannada: 'ಙ', nakshatraIndex: 5, nakshatraName: { en: 'Ardra', kn: 'ಆರಿದ್ರಾ', hi: 'आर्द्रा' }, pada: 3, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Chha', aksharaDevanagari: 'छ', aksharaKannada: 'ಛ', nakshatraIndex: 5, nakshatraName: { en: 'Ardra', kn: 'ಆರಿದ್ರಾ', hi: 'आर्द्रा' }, pada: 4, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },

  // 7. Punarvasu (24 to 27)
  { akshara: 'Ke', aksharaDevanagari: 'के', aksharaKannada: 'ಕೆ', nakshatraIndex: 6, nakshatraName: { en: 'Punarvasu', kn: 'ಪುನರ್ವಸು', hi: 'पुनर्वसु' }, pada: 1, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Ko', aksharaDevanagari: 'को', aksharaKannada: 'ಕೋ', nakshatraIndex: 6, nakshatraName: { en: 'Punarvasu', kn: 'ಪುನರ್ವಸು', hi: 'पुनर्वसु' }, pada: 2, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Ha', aksharaDevanagari: 'हा', aksharaKannada: 'ಹಾ', nakshatraIndex: 6, nakshatraName: { en: 'Punarvasu', kn: 'ಪುನರ್ವಸು', hi: 'पुनर्वसु' }, pada: 3, rashiIndex: 2, rashiName: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', hi: 'मिथुन' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Hee', aksharaDevanagari: 'ही', aksharaKannada: 'ಹೀ', nakshatraIndex: 6, nakshatraName: { en: 'Punarvasu', kn: 'ಪುನರ್ವಸು', hi: 'पुनर्वसु' }, pada: 4, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },

  // 8. Pushya (28 to 31)
  { akshara: 'Hu', aksharaDevanagari: 'हु', aksharaKannada: 'ಹು', nakshatraIndex: 7, nakshatraName: { en: 'Pushya', kn: 'ಪುಷ್ಯ', hi: 'पुष्य' }, pada: 1, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'He', aksharaDevanagari: 'हे', aksharaKannada: 'ಹೆ', nakshatraIndex: 7, nakshatraName: { en: 'Pushya', kn: 'ಪುಷ್ಯ', hi: 'पुष्य' }, pada: 2, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'Ho', aksharaDevanagari: 'हो', aksharaKannada: 'ಹೋ', nakshatraIndex: 7, nakshatraName: { en: 'Pushya', kn: 'ಪುಷ್ಯ', hi: 'पुष्य' }, pada: 3, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'Da', aksharaDevanagari: 'डा', aksharaKannada: 'ಡಾ', nakshatraIndex: 7, nakshatraName: { en: 'Pushya', kn: 'ಪುಷ್ಯ', hi: 'पुष्य' }, pada: 4, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },

  // 9. Ashlesha (32 to 35)
  { akshara: 'Dee', aksharaDevanagari: 'डी', aksharaKannada: 'ಡೀ', nakshatraIndex: 8, nakshatraName: { en: 'Ashlesha', kn: 'ಆಶ್ಲೇಷಾ', hi: 'आश्लेषा' }, pada: 1, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'Doo', aksharaDevanagari: 'डू', aksharaKannada: 'ಡೂ', nakshatraIndex: 8, nakshatraName: { en: 'Ashlesha', kn: 'ಆಶ್ಲೇಷಾ', hi: 'आश्लेषा' }, pada: 2, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'De', aksharaDevanagari: 'डे', aksharaKannada: 'ಡೇ', nakshatraIndex: 8, nakshatraName: { en: 'Ashlesha', kn: 'ಆಶ್ಲೇಷಾ', hi: 'आश्लेषा' }, pada: 3, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },
  { akshara: 'Do', aksharaDevanagari: 'डो', aksharaKannada: 'ಡೋ', nakshatraIndex: 8, nakshatraName: { en: 'Ashlesha', kn: 'ಆಶ್ಲೇಷಾ', hi: 'आश्लेषा' }, pada: 4, rashiIndex: 3, rashiName: { en: 'Karkataka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', hi: 'कर्क' }, rashiLord: { en: 'Moon (Chandra)', kn: 'ಚಂದ್ರ', hi: 'चन्द्र' } },

  // 10. Magha (36 to 39)
  { akshara: 'Ma', aksharaDevanagari: 'मा', aksharaKannada: 'ಮಾ', nakshatraIndex: 9, nakshatraName: { en: 'Magha', kn: 'ಮಖಾ', hi: 'मघा' }, pada: 1, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Mee', aksharaDevanagari: 'मी', aksharaKannada: 'ಮೀ', nakshatraIndex: 9, nakshatraName: { en: 'Magha', kn: 'ಮಖಾ', hi: 'मघा' }, pada: 2, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Moo', aksharaDevanagari: 'मू', aksharaKannada: 'ಮೂ', nakshatraIndex: 9, nakshatraName: { en: 'Magha', kn: 'ಮಖಾ', hi: 'मघा' }, pada: 3, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Me', aksharaDevanagari: 'मे', aksharaKannada: 'ಮೇ', nakshatraIndex: 9, nakshatraName: { en: 'Magha', kn: 'ಮಖಾ', hi: 'मघा' }, pada: 4, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },

  // 11. Purva Phalguni (40 to 43)
  { akshara: 'Mo', aksharaDevanagari: 'मो', aksharaKannada: 'ಮೋ', nakshatraIndex: 10, nakshatraName: { en: 'Purva Phalguni', kn: 'ಪುಬ್ಬಾ (ಪೂರ್ವ ಫಲ್ಗುಣಿ)', hi: 'पूर्वाफाल्गुनी' }, pada: 1, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Ta', aksharaDevanagari: 'टा', aksharaKannada: 'ಟಾ', nakshatraIndex: 10, nakshatraName: { en: 'Purva Phalguni', kn: 'ಪುಬ್ಬಾ', hi: 'पूर्वाफाल्गुनी' }, pada: 2, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Tee', aksharaDevanagari: 'टी', aksharaKannada: 'ಟೀ', nakshatraIndex: 10, nakshatraName: { en: 'Purva Phalguni', kn: 'ಪುಬ್ಬಾ', hi: 'पूर्वाफाल्गुनी' }, pada: 3, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'Too', aksharaDevanagari: 'टू', aksharaKannada: 'ಟೂ', nakshatraIndex: 10, nakshatraName: { en: 'Purva Phalguni', kn: 'ಪುಬ್ಬಾ', hi: 'पूर्वाफाल्गुनी' }, pada: 4, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },

  // 12. Uttara Phalguni (44 to 47)
  { akshara: 'Te', aksharaDevanagari: 'टे', aksharaKannada: 'ಟೇ', nakshatraIndex: 11, nakshatraName: { en: 'Uttara Phalguni', kn: 'ಉತ್ತರಾ (ಉತ್ತರ ಫಲ್ಗುಣಿ)', hi: 'उत्तराफाल्गुनी' }, pada: 1, rashiIndex: 4, rashiName: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', hi: 'सिंह' }, rashiLord: { en: 'Sun (Surya)', kn: 'ಸೂರ್ಯ', hi: 'सूर्य' } },
  { akshara: 'To', aksharaDevanagari: 'टो', aksharaKannada: 'ಟೋ', nakshatraIndex: 11, nakshatraName: { en: 'Uttara Phalguni', kn: 'ಉತ್ತರಾ', hi: 'उत्तराफाल्गुनी' }, pada: 2, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Pa', aksharaDevanagari: 'पा', aksharaKannada: 'ಪಾ', nakshatraIndex: 11, nakshatraName: { en: 'Uttara Phalguni', kn: 'ಉತ್ತರಾ', hi: 'उत्तराफाल्गुनी' }, pada: 3, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Pee', aksharaDevanagari: 'पी', aksharaKannada: 'ಪೀ', nakshatraIndex: 11, nakshatraName: { en: 'Uttara Phalguni', kn: 'ಉತ್ತರಾ', hi: 'उत्तराफाल्गुनी' }, pada: 4, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },

  // 13. Hasta (48 to 51)
  { akshara: 'Poo', aksharaDevanagari: 'पू', aksharaKannada: 'ಪೂ', nakshatraIndex: 12, nakshatraName: { en: 'Hasta', kn: 'ಹಸ್ತಾ', hi: 'हस्त' }, pada: 1, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Sha', aksharaDevanagari: 'ष', aksharaKannada: 'ಷ', nakshatraIndex: 12, nakshatraName: { en: 'Hasta', kn: 'ಹಸ್ತಾ', hi: 'हस्त' }, pada: 2, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Na', aksharaDevanagari: 'ण', aksharaKannada: 'ಣ', nakshatraIndex: 12, nakshatraName: { en: 'Hasta', kn: 'ಹಸ್ತಾ', hi: 'हस्त' }, pada: 3, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Tha', aksharaDevanagari: 'ठ', aksharaKannada: 'ಠ', nakshatraIndex: 12, nakshatraName: { en: 'Hasta', kn: 'ಹಸ್ತಾ', hi: 'हस्त' }, pada: 4, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },

  // 14. Chitra (52 to 55)
  { akshara: 'Pe', aksharaDevanagari: 'पे', aksharaKannada: 'ಪೇ', nakshatraIndex: 13, nakshatraName: { en: 'Chitra', kn: 'ಚಿತ್ತಾ', hi: 'चित्रा' }, pada: 1, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Po', aksharaDevanagari: 'पो', aksharaKannada: 'ಪೋ', nakshatraIndex: 13, nakshatraName: { en: 'Chitra', kn: 'ಚಿತ್ತಾ', hi: 'चित्रा' }, pada: 2, rashiIndex: 5, rashiName: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', hi: 'कन्या' }, rashiLord: { en: 'Mercury (Budha)', kn: 'ಬುಧ', hi: 'बुध' } },
  { akshara: 'Ra', aksharaDevanagari: 'रा', aksharaKannada: 'ರಾ', nakshatraIndex: 13, nakshatraName: { en: 'Chitra', kn: 'ಚಿತ್ತಾ', hi: 'चित्रा' }, pada: 3, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Ree', aksharaDevanagari: 'री', aksharaKannada: 'ರೀ', nakshatraIndex: 13, nakshatraName: { en: 'Chitra', kn: 'ಚಿತ್ತಾ', hi: 'चित्रा' }, pada: 4, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },

  // 15. Swati (56 to 59)
  { akshara: 'Roo', aksharaDevanagari: 'रू', aksharaKannada: 'ರೂ', nakshatraIndex: 14, nakshatraName: { en: 'Swati', kn: 'ಸ್ವಾತಿ', hi: 'स्वाति' }, pada: 1, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Re', aksharaDevanagari: 'रे', aksharaKannada: 'ರೇ', nakshatraIndex: 14, nakshatraName: { en: 'Swati', kn: 'ಸ್ವಾತಿ', hi: 'स्वाति' }, pada: 2, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Ro', aksharaDevanagari: 'रो', aksharaKannada: 'ರೋ', nakshatraIndex: 14, nakshatraName: { en: 'Swati', kn: 'ಸ್ವಾತಿ', hi: 'स्वाति' }, pada: 3, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुಕ್ರ' } },
  { akshara: 'Taa', aksharaDevanagari: 'ता', aksharaKannada: 'ತಾ', nakshatraIndex: 14, nakshatraName: { en: 'Swati', kn: 'ಸ್ವಾತಿ', hi: 'स्वाति' }, pada: 4, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },

  // 16. Vishakha (60 to 63)
  { akshara: 'Tee', aksharaDevanagari: 'ती', aksharaKannada: 'ತೀ', nakshatraIndex: 15, nakshatraName: { en: 'Vishakha', kn: 'ವಿಶಾಖಾ', hi: 'विशाखा' }, pada: 1, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Too', aksharaDevanagari: 'तू', aksharaKannada: 'ತೂ', nakshatraIndex: 15, nakshatraName: { en: 'Vishakha', kn: 'ವಿಶಾಖಾ', hi: 'विशाखा' }, pada: 2, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'Te', aksharaDevanagari: 'ते', aksharaKannada: 'ತೇ', nakshatraIndex: 15, nakshatraName: { en: 'Vishakha', kn: 'ವಿಶಾಖಾ', hi: 'विशाखा' }, pada: 3, rashiIndex: 6, rashiName: { en: 'Tula (Libra)', kn: 'ತುಲಾ', hi: 'तुला' }, rashiLord: { en: 'Venus (Shukra)', kn: 'ಶುಕ್ರ', hi: 'शुक्र' } },
  { akshara: 'To', aksharaDevanagari: 'तो', aksharaKannada: 'ತೋ', nakshatraIndex: 15, nakshatraName: { en: 'Vishakha', kn: 'ವಿಶಾಖಾ', hi: 'विशाखा' }, pada: 4, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },

  // 17. Anuradha (64 to 67)
  { akshara: 'Na', aksharaDevanagari: 'ना', aksharaKannada: 'ನಾ', nakshatraIndex: 16, nakshatraName: { en: 'Anuradha', kn: 'ಅನುರಾಧಾ', hi: 'अनुराधा' }, pada: 1, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Nee', aksharaDevanagari: 'नी', aksharaKannada: 'ನೀ', nakshatraIndex: 16, nakshatraName: { en: 'Anuradha', kn: 'ಅನುರಾಧಾ', hi: 'अनुराधा' }, pada: 2, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Noo', aksharaDevanagari: 'नू', aksharaKannada: 'ನೂ', nakshatraIndex: 16, nakshatraName: { en: 'Anuradha', kn: 'ಅನುರಾಧಾ', hi: 'अनुराधा' }, pada: 3, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Ne', aksharaDevanagari: 'ने', aksharaKannada: 'ನೇ', nakshatraIndex: 16, nakshatraName: { en: 'Anuradha', kn: 'ಅನುರಾಧಾ', hi: 'अनुराधा' }, pada: 4, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },

  // 18. Jyeshtha (68 to 71)
  { akshara: 'No', aksharaDevanagari: 'नो', aksharaKannada: 'ನೋ', nakshatraIndex: 17, nakshatraName: { en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠಾ', hi: 'ज्येष्ठा' }, pada: 1, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Ya', aksharaDevanagari: 'या', aksharaKannada: 'ಯಾ', nakshatraIndex: 17, nakshatraName: { en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠಾ', hi: 'ज्येष्ठा' }, pada: 2, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Yee', aksharaDevanagari: 'यी', aksharaKannada: 'ಯೀ', nakshatraIndex: 17, nakshatraName: { en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠಾ', hi: 'ज्येष्ठा' }, pada: 3, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },
  { akshara: 'Yoo', aksharaDevanagari: 'यू', aksharaKannada: 'ಯೂ', nakshatraIndex: 17, nakshatraName: { en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠಾ', hi: 'ज्येष्ठा' }, pada: 4, rashiIndex: 7, rashiName: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', hi: 'वृश्चिक' }, rashiLord: { en: 'Mars (Kuja)', kn: 'ಕುಜ', hi: 'मंगल' } },

  // 19. Moola (72 to 75)
  { akshara: 'Ye', aksharaDevanagari: 'ये', aksharaKannada: 'ಯೇ', nakshatraIndex: 18, nakshatraName: { en: 'Moola', kn: 'ಮೂಲಾ', hi: 'मूल' }, pada: 1, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Yo', aksharaDevanagari: 'यो', aksharaKannada: 'ಯೋ', nakshatraIndex: 18, nakshatraName: { en: 'Moola', kn: 'ಮೂಲಾ', hi: 'मूल' }, pada: 2, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Bha', aksharaDevanagari: 'भा', aksharaKannada: 'ಭಾ', nakshatraIndex: 18, nakshatraName: { en: 'Moola', kn: 'ಮೂಲಾ', hi: 'मूल' }, pada: 3, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Bhee', aksharaDevanagari: 'भी', aksharaKannada: 'ಭೀ', nakshatraIndex: 18, nakshatraName: { en: 'Moola', kn: 'ಮೂಲಾ', hi: 'मूल' }, pada: 4, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },

  // 20. Purva Ashadha (76 to 79)
  { akshara: 'Bhoo', aksharaDevanagari: 'भू', aksharaKannada: 'ಭೂ', nakshatraIndex: 19, nakshatraName: { en: 'Purva Ashadha', kn: 'ಪೂರ್ವಾಷಾಢಾ', hi: 'पूर्वाषाढ़ा' }, pada: 1, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Dha', aksharaDevanagari: 'धा', aksharaKannada: 'ಧಾ', nakshatraIndex: 19, nakshatraName: { en: 'Purva Ashadha', kn: 'ಪೂರ್ವಾಷಾಢಾ', hi: 'पूर्वाषाढ़ा' }, pada: 2, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Pha', aksharaDevanagari: 'फा', aksharaKannada: 'ಫಾ', nakshatraIndex: 19, nakshatraName: { en: 'Purva Ashadha', kn: 'ಪೂರ್ವಾಷಾಢಾ', hi: 'पूर्वाषाढ़ा' }, pada: 3, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Dhaa', aksharaDevanagari: 'ढा', aksharaKannada: 'ಢಾ', nakshatraIndex: 19, nakshatraName: { en: 'Purva Ashadha', kn: 'ಪೂರ್ವಾಷಾಢಾ', hi: 'पूर्वाषाढ़ा' }, pada: 4, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },

  // 21. Uttara Ashadha (80 to 83)
  { akshara: 'Bhe', aksharaDevanagari: 'भे', aksharaKannada: 'ಭೇ', nakshatraIndex: 20, nakshatraName: { en: 'Uttara Ashadha', kn: 'ಉತ್ತರಾಷಾಢಾ', hi: 'उत्तराषाढ़ा' }, pada: 1, rashiIndex: 8, rashiName: { en: 'Dhanu (Sagittarius)', kn: 'ಧನು', hi: 'धनु' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Bho', aksharaDevanagari: 'भो', aksharaKannada: 'ಭೋ', nakshatraIndex: 20, nakshatraName: { en: 'Uttara Ashadha', kn: 'ಉತ್ತರಾಷಾಢಾ', hi: 'उत्तराषाढ़ा' }, pada: 2, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Ja', aksharaDevanagari: 'जा', aksharaKannada: 'ಜಾ', nakshatraIndex: 20, nakshatraName: { en: 'Uttara Ashadha', kn: 'ಉತ್ತರಾಷಾಢಾ', hi: 'उत्तराषाढ़ा' }, pada: 3, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'Jee', aksharaDevanagari: 'जी', aksharaKannada: 'ಜೀ', nakshatraIndex: 20, nakshatraName: { en: 'Uttara Ashadha', kn: 'ಉತ್ತರಾಷಾಢಾ', hi: 'उत्तराषाढ़ा' }, pada: 4, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },

  // 22. Shravana (84 to 87)
  { akshara: 'Khee', aksharaDevanagari: 'खी', aksharaKannada: 'ಖೀ', nakshatraIndex: 21, nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣಾ', hi: 'श्रवण' }, pada: 1, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Khoo', aksharaDevanagari: 'खू', aksharaKannada: 'ಖೂ', nakshatraIndex: 21, nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣಾ', hi: 'श्रवण' }, pada: 2, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Khe', aksharaDevanagari: 'खे', aksharaKannada: 'ಖೇ', nakshatraIndex: 21, nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣಾ', hi: 'श्रवण' }, pada: 3, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Kho', aksharaDevanagari: 'खो', aksharaKannada: 'ಖೋ', nakshatraIndex: 21, nakshatraName: { en: 'Shravana', kn: 'ಶ್ರವಣಾ', hi: 'श्रवण' }, pada: 4, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },

  // 23. Dhanishta (88 to 91)
  { akshara: 'Ga', aksharaDevanagari: 'गा', aksharaKannada: 'ಗಾ', nakshatraIndex: 22, nakshatraName: { en: 'Dhanishta', kn: 'ಧನಿಷ್ಠಾ', hi: 'धनिष्ठा' }, pada: 1, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Gee', aksharaDevanagari: 'गी', aksharaKannada: 'ಗೀ', nakshatraIndex: 22, nakshatraName: { en: 'Dhanishta', kn: 'ಧನಿಷ್ಠಾ', hi: 'धनिष्ठा' }, pada: 2, rashiIndex: 9, rashiName: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', hi: 'मकर' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'Goo', aksharaDevanagari: 'गू', aksharaKannada: 'ಗೂ', nakshatraIndex: 22, nakshatraName: { en: 'Dhanishta', kn: 'ಧನಿಷ್ಠಾ', hi: 'धनिष्ठा' }, pada: 3, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Ge', aksharaDevanagari: 'गे', aksharaKannada: 'ಗೇ', nakshatraIndex: 22, nakshatraName: { en: 'Dhanishta', kn: 'ಧನಿಷ್ಠಾ', hi: 'धनिष्ठा' }, pada: 4, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },

  // 24. Shatabhisha (92 to 95)
  { akshara: 'Go', aksharaDevanagari: 'गो', aksharaKannada: 'ಗೋ', nakshatraIndex: 23, nakshatraName: { en: 'Shatabhisha', kn: 'ಶತಭಿಷಾ', hi: 'शतभिषा' }, pada: 1, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनि' } },
  { akshara: 'Sa', aksharaDevanagari: 'सा', aksharaKannada: 'ಸಾ', nakshatraIndex: 23, nakshatraName: { en: 'Shatabhisha', kn: 'ಶತಭಿಷಾ', hi: 'शतभिषा' }, pada: 2, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'See', aksharaDevanagari: 'सी', aksharaKannada: 'ಸೀ', nakshatraIndex: 23, nakshatraName: { en: 'Shatabhisha', kn: 'ಶತಭಿಷಾ', hi: 'शतभिषा' }, pada: 3, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'Soo', aksharaDevanagari: 'सू', aksharaKannada: 'ಸೂ', nakshatraIndex: 23, nakshatraName: { en: 'Shatabhisha', kn: 'ಶತಭಿಷಾ', hi: 'शतभिषा' }, pada: 4, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },

  // 25. Purva Bhadrapada (96 to 99)
  { akshara: 'Se', aksharaDevanagari: 'से', aksharaKannada: 'ಸೇ', nakshatraIndex: 24, nakshatraName: { en: 'Purva Bhadrapada', kn: 'ಪೂರ್ವಾಭಾದ್ರಾ', hi: 'पूर्वाभाद्रपद' }, pada: 1, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'So', aksharaDevanagari: 'सो', aksharaKannada: 'ಸೋ', nakshatraIndex: 24, nakshatraName: { en: 'Purva Bhadrapada', kn: 'ಪೂರ್ವಾಭಾದ್ರಾ', hi: 'पूर्वाभाद्रपद' }, pada: 2, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'Da', aksharaDevanagari: 'दा', aksharaKannada: 'ದಾ', nakshatraIndex: 24, nakshatraName: { en: 'Purva Bhadrapada', kn: 'ಪೂರ್ವಾಭಾದ್ರಾ', hi: 'पूर्वाभाद्रपद' }, pada: 3, rashiIndex: 10, rashiName: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', hi: 'कुम्भ' }, rashiLord: { en: 'Saturn (Shani)', kn: 'ಶನಿ', hi: 'शनಿ' } },
  { akshara: 'Dee', aksharaDevanagari: 'दी', aksharaKannada: 'ದೀ', nakshatraIndex: 24, nakshatraName: { en: 'Purva Bhadrapada', kn: 'ಪೂರ್ವಾಭಾದ್ರಾ', hi: 'पूर्वाभाद्रपद' }, pada: 4, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },

  // 26. Uttara Bhadrapada (100 to 103)
  { akshara: 'Doo', aksharaDevanagari: 'दू', aksharaKannada: 'ದೂ', nakshatraIndex: 25, nakshatraName: { en: 'Uttara Bhadrapada', kn: 'ಉತ್ತರಾಭಾದ್ರಾ', hi: 'उत्तराभाद्रपद' }, pada: 1, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Tha', aksharaDevanagari: 'थ', aksharaKannada: 'ಥ', nakshatraIndex: 25, nakshatraName: { en: 'Uttara Bhadrapada', kn: 'ಉತ್ತರಾಭಾದ್ರಾ', hi: 'उत्तराभाद्रपद' }, pada: 2, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Jha', aksharaDevanagari: 'झ', aksharaKannada: 'ಝ', nakshatraIndex: 25, nakshatraName: { en: 'Uttara Bhadrapada', kn: 'ಉತ್ತರಾಭಾದ್ರಾ', hi: 'उत्तराभाद्रपद' }, pada: 3, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Gna', aksharaDevanagari: 'ञ', aksharaKannada: 'ಞ', nakshatraIndex: 25, nakshatraName: { en: 'Uttara Bhadrapada', kn: 'ಉತ್ತರಾಭಾದ್ರಾ', hi: 'उत्तराभाद्रपद' }, pada: 4, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },

  // 27. Revati (104 to 107)
  { akshara: 'De', aksharaDevanagari: 'दे', aksharaKannada: 'ದೇ', nakshatraIndex: 26, nakshatraName: { en: 'Revati', kn: 'ರೇವತಿ', hi: 'रेवती' }, pada: 1, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Do', aksharaDevanagari: 'दो', aksharaKannada: 'ದೋ', nakshatraIndex: 26, nakshatraName: { en: 'Revati', kn: 'ರೇವತಿ', hi: 'रेवती' }, pada: 2, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Cha', aksharaDevanagari: 'च', aksharaKannada: 'ಚ', nakshatraIndex: 26, nakshatraName: { en: 'Revati', kn: 'ರೇವತಿ', hi: 'रेवती' }, pada: 3, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } },
  { akshara: 'Chee', aksharaDevanagari: 'ची', aksharaKannada: 'ಚೀ', nakshatraIndex: 26, nakshatraName: { en: 'Revati', kn: 'ರೇವತಿ', hi: 'रेवती' }, pada: 4, rashiIndex: 11, rashiName: { en: 'Meena (Pisces)', kn: 'ಮೀನ', hi: 'मीन' }, rashiLord: { en: 'Jupiter (Guru)', kn: 'ಗುರು', hi: 'गुरु' } }
];

/**
 * Finds the Nakshatra and Rashi for a given starting syllable / name
 */
export function findNakshatraByAkshara(searchLetter: string): NakshatraPadaAkshara | null {
  const clean = searchLetter.trim().toLowerCase();
  if (!clean) return null;

  // Exact or prefix match
  const match = NAKSHATRA_AKSHARAS.find(item => 
    item.akshara.toLowerCase() === clean ||
    clean.startsWith(item.akshara.toLowerCase()) ||
    item.aksharaKannada === searchLetter ||
    item.aksharaDevanagari === searchLetter
  );

  return match || null;
}

/**
 * Returns the exact Pada Akshara for a given Nakshatra index (0 to 26) and Pada number (1 to 4)
 */
export function getNakshatraPadaAkshara(nakshatraIndex: number, pada: number): NakshatraPadaAkshara {
  const normNak = ((nakshatraIndex % 27) + 27) % 27;
  const normPada = Math.min(4, Math.max(1, pada));
  const found = NAKSHATRA_AKSHARAS.find(item => item.nakshatraIndex === normNak && item.pada === normPada);
  return found || NAKSHATRA_AKSHARAS[0];
}
